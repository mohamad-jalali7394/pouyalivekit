import config from '../config'
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import store from '../store/index'
import eventBus from "../utils/event.bus";
import i18n from "../i18n"

let id = null


class WebSocketClient {
    constructor(conferenceId, userId, displayName, amImoderator, amIPresenter, amIsubstitutionModerator, amIGuest, isPrivateMeeting) {
        this.connected = false
        this.conferenceId = conferenceId
        this.displayName = displayName
        this.userId = userId
        this.connectionId = ''
        this.isPrivateMeeting = isPrivateMeeting
        this.socket = null
        this.stompClient = null
        this.amIGuest = amIGuest
        this.retryAttempts = 0;
        this.maxRetries = 10;
        this.reconnectDelay = 2000; // Initial delay before reconnecting
        if (amImoderator) {
            this.participantRole = 'Moderator'
        } else if (amIsubstitutionModerator) {
            this.participantRole = 'Substitution'
        } else if (amIPresenter) {
            this.participantRole = 'Presenter'
        } else if (amIGuest) {
            this.participantRole = 'Guest'
        } else {
            this.participantRole = 'Participant'
        }
    }


    async connect() {
        const options = {
            debug: false, protocols: Stomp.VERSIONS.supportedProtocols(),
        };

        const sockJsUrl = `${config.SHOOKA_SERVER_URL}?conferenceId=${this.conferenceId}&userId=${this.userId}`;
        console.log(`WebSocket URL: ${sockJsUrl}`); // Log the full URL

        this.socket = new SockJS(sockJsUrl, options);

        if (!this.socket) {
            console.error("Failed to initialize SockJS");
            return; // Exit if initialization fails
        }

        this.stompClient = Stomp.over(this.socket);
        this.stompClient.heartbeat.outgoing = 10000;
        this.stompClient.heartbeat.incoming = 10000;
        this.stompClient.debug(false);

        // Bind socket event handlers
        this.socket.onclose = this.handleSocketClose.bind(this);
        this.socket.onerror = this.handleSocketError.bind(this);

        console.log("Attempting to connect to WebSocket");
        await this.connectToWebSocket();
    }
    async connectToWebSocket() {
        if (!this.stompClient) {
            console.error("STOMP client not initialized.");
            return;
        }

        console.log(`${this.conferenceId} ${this.userId}`);

        const headers = {
            conferenceId: this.conferenceId,
            userId: this.userId,
        };

        console.error("Attempting to connect to WebSocket");
        try {
            await new Promise((resolve, reject) => {
                // Add logs below to track connection
                console.log("Connecting...");
                this.stompClient.connect(headers, (frame) => {
                    console.error("WebSocket connected ...");
                    this.handleWebSocketConnected(frame);
                    resolve();
                }, (error) => {
                    console.error("WebSocket connection error:", error);
                    this.handleWebSocketError(error, reject);
                });
            });
        } catch (error) {
            console.error("Error during WebSocket connection:", error);
            this.handleConnectionError(error);
        }
    }
    handleWebSocketConnected(frame) {
        this.connected = true;
        this.retryAttempts = 0; // Reset retry attempts on successful connection
        const id = frame.headers['user-name']; // Store user ID

        this.stompClient.subscribe(`/queue/push/${this.conferenceId}`, this.onMessageReceived.bind(this));
        this.stompClient.subscribe(`/user/queue/push/${this.conferenceId}`, this.onMessageReceived.bind(this));

        this.sendMyInfo(id).then(() => {
            console.error("sendMyInfo")
            eventBus.emit('websocket_connected');
        }).catch(error => {
            console.error("Failed to send user info:", error);
        });
    }

    handleWebSocketError(error, reject) {
        // this.connected = false;
        // console.error("WebSocket error:", error);
        // this.retryConnection();
        // console.error("اتصال با سرور با مشکل مواجه شده است, در حال اتصال مجدد", "error")
        // this.handleConnectionError("اتصال با سرور با مشکل مواجه شده است, در حال اتصال مجدد", "error")
        reject(error);
    }

    async retryConnection() {
        eventBus.emit('reconnect-web-socket-loading')
        if (this.retryAttempts < this.maxRetries) {
            this.retryAttempts++;
            const delay = Math.pow(2, this.retryAttempts) * 1000; // Exponential backoff
            setTimeout(() => {
                console.log(`Retrying connection... Attempt: ${this.retryAttempts}`);
                eventBus.emit('reconnect-web-socket')
            }, delay);
        } else {
            eventBus.emit('reconnect-web-socket-canceled')
            console.error("Max retry attempts reached. Please check your network or server.");
            this.handleConnectionError("تعداد تلاش های بازنشانی به حداکثر رسید. لطفاً بعداً دوباره آزمایش کنید.", "error");
        }
    }

    async handleSocketClose() {
        // this.connected = false;
        // this.handleConnectionError("WebSocket connection closed.", "info")
        console.error("WebSocket connection closed.", "info");
        // setTimeout(() => {
        //     this.retryConnection();
        // }, 2000); // Delay before retrying connection
    }
   async handleSocketError(error) {
        // this.handleConnectionError("WebSocket error:", error)
        console.error("WebSocket error:", error);
        // this.connected = false;
       // await this.retryConnection();
    }


    handleConnectionError(message) {
        eventBus.emit("notification", {
            title: "پیام", type: "error", bodyText: i18n.global.t(message), time: 5000,
        });
        eventBus.emit('reconnect-web-socket-canceled')
    }


    getConnected() {
        return this.connected
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect()
        }
        this.connected = false
    }

    onMessageReceived(payload) {
        const body = JSON.parse(payload.body)
        console.error('')
        switch (body.messageType) {
            // زمانی که وارد جلسه می شویم لیست افراد دعوت شده برایمان ارسال می شود
            // case 'UserList':
            //     store.dispatch('setParticipants', body.data);
            //     store.dispatch('setChatList', body.data);
            //
            //     break;
            // case 'SecondUserList':
            //     store.dispatch('setParticipants', body.data);
            //     break;
            // وقتی کاربر از جلسه خارج می شود به تمام کاربران این پیغام ارسال می شود و آن هارا با خبر میکند
            // case 'UserLeft':
            //     eventBus.emit('user_left', body.data);
            //     store.dispatch('participantLeaved', body.data);
            //     store.dispatch('participantLeftForChatList', body.data);
            //     break;
            // زمانی که وارد جلسه می شویم کانکشن ایدی ما به روز میشود
            // case 'ConnectionIdUpdated':
            //     store.dispatch('connectionIdUpdated', body.data)
            //     break
            // case 'sendIsPublisher':
            //     if (body.data)
            //         eventBus.emit('sendIsPublisher', body.data);
            //     break
            // زمانی که کاربری وارد جلسه می شود دیگران را با خبر میکند
            // case 'ParticipantJoined':
            //     store.dispatch('participantJoined', body.data)
            //     store.dispatch('participantJoinedForChatList', body.data)
            //     break
            // زمانی که مدیر وارد جلسه می شود دیگران را باخبر میکند
            // case 'ModeratorJoined':
            //     store.dispatch('participantJoinedForChatList', body.data)
            //     store.dispatch('moderatorJoined', body.data)
            //     break
            // case 'PresenterJoined':
            //     store.dispatch('participantJoinedForChatList', body.data)
            //     store.dispatch('presenterJoined', body.data)
            //     break
            // case 'OpenMic':
            //     eventBus.emit('your_mic_granted', body.data)
            //     break
            // case 'CloseMic':
            //     eventBus.emit('your_mic_denied', body.data)
            //     break
            // case 'YourMicStatus':
            //     if (body.data) eventBus.emit('unmute_your_mic')
            //     else eventBus.emit('mute_your_mic')
            //     break
            // زمانی که مدیر جلسه وضعیت دوربین کاربران را تغییر میدهد
            // case 'YourCameraStatus':
            //     if (body.data) eventBus.emit('unmute_your_camera')
            //     else eventBus.emit('mute_your_camera')
            //     break
            // زمانی که مدیر جلسه وضعیت شیر کاربران را تغییر میدهد
            // case 'YourShareStatus':
            //     if (body.data) eventBus.emit('unmute_your_share')
            //     else eventBus.emit('mute_your_share')
            //     break
            // زمانی که درخواست صحبت به مدیر ارسال میشود
            // case 'HandRiseRequest':
            //     store.dispatch('participantHandRequest', body.data)
            //     break
            // زمانی که کاربر هندرایز را کنسل میکند
            // case 'HandRiseCanceled':
            //     store.dispatch('participantHandCancel', body.data)
            //     break
            // case 'HandRiseCancel':
            //     store.dispatch('participantHandCancel', body.data)
            //     break
            // زمانی که درخواست صحبت از طرف مدیر قبول میشود
            // case 'HandRiseGranted':
            //     eventBus.emit('your_hand_rise_granted', body.data)
            //     break
            // زمانی که مدیر هندرایز را کنسل میکند
            // case 'HandRiseEnd':
            //     eventBus.emit('your_hand_rise_denied', body.data)
            //     break
            // زمانی که کاربر از طرف مدیر پین میشود
            // case 'ParticipantPinned':
            //     eventBus.emit('participant_Pinned', body.data)
            //     store.dispatch('participantPinned', body.data)
            //     break
            // زمانی که کاربر از طرف مدیر آن پین میشود
            // case 'participantUnPinned':
            //     eventBus.emit('participant_Un_Pinned', body.data)
            //     store.dispatch('participantUnPinned', body.data)
            //     break

            // case 'ScreenShared':
            //     eventBus.emit('screen_shared', body.data)
            //     break

            // زمانی که مدیر کاربر را از جلسه اخراج میکند
            // case 'Leave':
            //     eventBus.emit('leaveSession')
            //     store.dispatch('participantLeftForChatList', body.data)
            //     break
            // زمانی که کاربر  پیغامی را که برای تمام افراد در جلسه ارسال شده است را دریافت میکند
            case 'GroupChat':
                eventBus.emit('group_chat', body.data)
                break
            // زمانی که کاربر  پیغامی را که برای خودش در جلسه ارسال شده است را دریافت میکند
            case 'PrivateChat':
                eventBus.emit('private_chat', body.data)
                break
            // دسترسی های از قبل داده شده را هنگام ورود مجدد به جلسه به کاربر بازمیگرداند
            // case 'YourPermission':
            //     eventBus.emit('your_permission', body.data)
            //     break
            // زمانی که تایم جلسه به پایان میرسد همه کاربران را از جلسه خارج میکند
            case 'GoOut':
                eventBus.emit('goOut', body.data)
                break
            //
            // case 'AddNewParticipant':
            //     store.dispatch('addParticipant', body.data)
            //     break
            // case 'RemoveParticipant':
            //     eventBus.emit('goOut', body.data)
            //     break
            // هر 45 ثانیه یکبار برای چرخش تصاویر به همه ی کاربران ارسال میشود
            // case 'Rotation':
            //     eventBus.emit('add_to_rotation', body.data)
            //     break

            // case 'PublisherList':
            //     eventBus.emit('publisher_list', body.data)
            //     break
            // وقتی که وارد جلسه میشویم سرور وضعیت کاربر را برای نمایش تصویر تعیین میکند
            // case 'IsPublisher':
            //     eventBus.emit('Is_Publisher', body.data)
            //     break
            // تعیین کاربر جایگزین برای فردی که از جلسه خارج شده است یا توسط مدیر اخراج شده است
            // case 'SubstitutionUser':
            //     eventBus.emit('Subsituation_User', body.data)
            //     break

            // case 'FailPublish':
            //     eventBus.emit('Fail_Publish', body.data)
            //     break
            // case 'PublishModerator':
            //     eventBus.emit('Publish_Moderator', body.data)
            //     break
            // زمانی که فرد مشخص شده برای پابلیش در تصویر چرخشی به مشکل بر خورده یا شرایط لازم برای پابلیش را ندارد
            case 'RejectRotation':
                eventBus.emit('Reject_Rotation', body.data)
                break
            // زمانی که در تصویر چرخشی یا پین یا هندرایز میخواهیم فردی را پابلیش کنیم و یک کاربر را آنپابلیش کنیم
            // case 'UnSubscribe':
            //     eventBus.emit('unSubscribe', body.data)
            //     break
            // case 'NotifyPinFailed':
            //     eventBus.emit('notifyPinFailed', body.data)
            //     break
            // زمانی که فردی پین میشود به بقیه کاربران ارسال میشود
            // case 'NotifyUserPin':
            //     store.dispatch('notifyParticipantPinned', body.data)
            //     break
            // 5 دقیقه مانده به جلسه را اعلام میکند
            case 'NotifyMeetingEnd':
                eventBus.emit('Notify_Meeting_End', body.data)
                break
            // خاتمه جلسه توسط صاحب اتاق شخصی
            case 'MeetingEnded':
                eventBus.emit('Meeting_Ended', body.data)
                break
            // ارسال پیغام ضبط جلسه به همه کاربران
            case 'START_RECORDING':
                eventBus.emit('START_RECORDING')
                break

            // case 'Capacity_Open_Mic_Is_Full':
            //     eventBus.emit('MicCapacityIsFull')
            //     break
            // case 'Capacity_Pin_Is_Full':
            //     eventBus.emit('PinCapacityIsFull')
            //     break
            // case 'Capacity_Grant_Hand_Rise_Is_Full':
            //     eventBus.emit('HandCapacityIsFull')
            //     break
            case 'ActivateModeratorSubstitution':
                eventBus.emit('ActivateModeratorSubstitution', body.data)
                break
            case 'POLLING':
                eventBus.emit('Polling', body.data)
                break

            // case 'ACTIVE_SPEAKER':
            //     eventBus.emit('Active_Speaker', body.data)
            //     break
            // case 'NOTIFY_ACTIVE_SPEAKER':
            //     store.dispatch('notifyActiveSpeaker', body.data)
            //     break
            // case 'MUTE_SPEAKER':
            //     if (body.data.permission.isMuteSpeaker) eventBus.emit('unmute_your_speaker')
            //     else eventBus.emit('mute_your_speaker');
            //     // store.dispatch('notifySpeakerStatus', body.data)
            // //     break;
            case 'isShared':
                eventBus.emit('isShared', body.data.isShared)
                break;
            case 'unShare':
                eventBus.emit('stop_your_share', body.data)
                break
            case 'shareRequest':
                eventBus.emit('shareRequest')
                break
            case 'enableActiveSpeaker':
                eventBus.emit('enableActiveSpeakerMode', body.data)
                break
            case 'enableChat':
                eventBus.emit('enableChatMode', body.data)
                store.dispatch("setIsChatVisible", body.data);
                break
            // case 'changePublishStatus':
            //     eventBus.emit('removeParticipantFromLayout', body.data)
            //     break
            // case 'changePermissionStatus':
            //     console.error('8888888888888888888888888888888888888888888888888888888')
            //     console.error('permiiiiiiiiiiiiisssssssssssssssssssssssssssss')
            //     if (body.data.pin === true || body.data.pin === false) {
            //         store.dispatch("updatePinStatus", body.data);
            //     } else if (body.data.micStatus === true || body.data.micStatus === false) {
            //         store.dispatch("updateMicStatus", body.data);
            //     } else if (body.data.handStatus === 'granted' || body.data.handStatus === 'none') {
            //         store.dispatch("updateHandStatus", body.data);
            //     } else if (body.data.shareStatus === true || body.data.shareStatus === false) {
            //         store.dispatch("updateShareStatus", body.data);
            //     } else if (body.data.cameraStatus === true || body.data.cameraStatus === false) {
            //         store.dispatch("updateCameraStatus", body.data);
            //     } else if (body.data.status === true || body.data.status === false) {
            //         eventBus.emit('enable-active-speaker', body.data.status)
            //     } else if (body.data.rotationChangeStatus === true || body.data.rotationChangeStatus === false) {
            //         eventBus.emit('rotation_change_status', body.data.rotationChangeStatus)
            //     } else if (body.data.publishStatus === true || body.data.publishStatus === false) {
            //         eventBus.emit('publish_change_status', {status: body.data.publishStatus, id: body.data.userId})
            //     }
            //     break
            // case 'SubstitutionModeratorJoined':
            //     console.error('jooooooooooooooooooooooineeeeeeeeeeeeeeeeeeeed')
            //     console.error(body.data)
            //     store.dispatch('SubstitutionModeratorJoined', body.data)
            //     break
            // case 'NotifyActivateModeratorSubstitution':
            //     eventBus.emit('NotifyActivateModeratorSubstitution', body.data)
            //     break
            case 'PROCEEDINGS':
                eventBus.emit('proceedings', body.data)
                break
            case 'proceedingsAllow':
                eventBus.emit('proceedings-allow', body.data)
                break
            case 'PinToAudience':
                eventBus.emit('pin-to-audience', body.data)
                break
            case 'NotifyPinToAudience':
                store.dispatch('notifyPinToAudience', body.data)
                break
            case 'You_Have_Permission_To_Join':
                eventBus.emit('You_Have_Permission_To_Join', body.data)
                break
            case 'IWantToJoin':
                eventBus.emit('IWantToJoin', body.data)
                break
            case 'YouCanAskToJoin':
                eventBus.emit('youCanAskToJoin')
                break
            case 'ModeratorNotJoinedYet':
                eventBus.emit('ModeratorNotJoinedYet')
                break

            case 'UserIsNotInPublisherList':
                eventBus.emit('UserIsNotInPublisherList', body.data)
                break
            case 'DUPLACATEUSER':
                eventBus.emit('DUPLACATEUSER')
                break
            case 'MODERATOR_SUBSTITUTION_SYNCER':
                console.error( body.data.actionType)
                if (body.data.actionType === 'pin' || body.data.actionType === 'unPin') {
                    store.dispatch("updatePinStatus", body.data);
                } else if (body.data.actionType === 'openMic' || body.data.actionType === 'closeMic') {
                    store.dispatch("updateMicStatus", body.data);
                }  else if (body.data.actionType === 'openShare' || body.data.actionType === 'closeShare') {
                    store.dispatch("updateShareStatus", body.data);
                } else if (body.data.actionType === 'openCamera' || body.data.actionType === 'closeCamera') {
                    store.dispatch("updateCameraStatus", body.data);
                } else if (body.data.actionType === 'openVideo' || body.data.actionType === 'removeVideo') {
                    store.dispatch("updatePublishStatus", body.data);
                }
                break;
            case 'RECEIVED_SURVEY':
                if (body.data.isOptional) {
                    eventBus.emit('optional-polling-created', body.data)
                } else {
                    eventBus.emit('descriptive-polling-created', body.data)
                }
                break
            case 'ALL_SURVEYS_RECEIVED':
                if (body.data?.length > 0) {
                    eventBus.emit('RECEIVED_ALL_CREATED_SURVEY', body.data)
                }
                break
            case 'RECEIVED_MINUTE_PARAGRAPH':
                eventBus.emit('RECEIVED_MINUTE_PARAGRAPH', body.data)
                break
            case 'GET_ALL_MEETING_MINUTES_PARAGRAPH':
                eventBus.emit('GET_ALL_RECEIVED_MINUTE_PARAGRAPH', body.data)
                break
            case 'SUBMIT_MEETING_MINUTES':
                eventBus.emit('SUBMIT_MINUTE_PARAGRAPH', body.data)
                break
            case 'MINUTES_PARAGRAPH_DELETED':
                eventBus.emit('MINUTES_PARAGRAPH_DELETED', body.data)
                break
            case 'CHANGE_MEETING_QUALITY':
                eventBus.emit('CHANGE_MEETING_QUALITY', body.data.resolution)
                break
            case 'RECEIVE_PUBLIC_CHAT':
                eventBus.emit('public-message-received', body.data)
                break
            // زمانی که کاربر  پیغامی را که برای خودش در جلسه ارسال شده است را دریافت میکند
            case 'RECEIVE_PRIVATE_CHAT':
                eventBus.emit('private-message-received', body.data)
                break
            case 'GET_EGRESS_ID':
                eventBus.emit('GET_EGRESS_ID', body.data)
                break
            default:
                break;
        }
    }
    async sendMyInfo(id) {
        if (id) {
            const payload = {
                nickname: this.displayName,
                displayName: this.displayName,
                socketId: id,
                userId: this.userId ? parseInt(this.userId) : undefined,
                conferenceId: this.conferenceId ? parseInt(this.conferenceId) : undefined,
                participantRole: this.participantRole,
                amIGuest: this.amIGuest,
                isPrivateMeeting: this.isPrivateMeeting
            };
            if (this.stompClient && this.stompClient.connected) {
                this.stompClient.send('/app/signalling.myInfo', JSON.stringify(payload), {});
            }
        }
    }

    sendMyInfoForReconnect(amIPublished, status, micStatus, handStatus, shareStatus) {
        if (this.stompClient && this.stompClient.connected && id) {
            console.error("sending reconnect with id ..." + id)
            this.stompClient.send('/app/signalling.reconnect', JSON.stringify({
                nickname: localStorage.getItem('meetingDisplayName'),
                socketId: id,
                displayName: this.displayName,
                userId: this.userId,
                conferenceId: this.conferenceId,
                participantRole: this.participantRole,
                amIGuest: this.amIGuest,
                isPrivateMeeting: this.isPrivateMeeting,
                amIPublished: amIPublished,
                status: status,
                micStatus: micStatus,
                handStatus: handStatus,
                shareStatus: shareStatus
            }), {})
        }
    }


    IWantToJoinPermission() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.iWantToJoin', JSON.stringify({
                userName: this.displayName, userId: this.userId, meetingId: this.conferenceId
            }), {})
        }
    }

    YouHavePermissionToJoin(id, join) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.youHavePermissionToJoin', JSON.stringify({
                userId: id, meetingId: this.conferenceId, publishStatus: join
            }), {})

        }
    }

    rejoinModerator() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.rejoinModerator', JSON.stringify({
                userId: this.userId, meetingId: this.conferenceId
            }), {})

        }
    }

    // زمانی که کاربر میخواهد پیغامی را  برای تمام افراد در جلسه ارسال کند
    sendGroupChat(text, name) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.sendPublicChat', JSON.stringify({
                message: text, senderUserName: name
            }), {})
        }
    }

    // زمانی که کاربر میخواهد پیغامی را  برای فردی در جلسه ارسال کند
    sendPrivateChat(text, userId, name) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.sendPrivateChat' + '', JSON.stringify({
                message: text, receiverUserId: userId, senderUserName: name
            }), {})
        }
    }

    sendMyConnectionId(connectionId) {
        this.connectionId = connectionId
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.myConnectionId', JSON.stringify({
                userId: this.userId.toString(), connectionId: this.connectionId, displayName: this.displayName
            }), {})
        }
    }

    // زمانی که کاربر وضعیت هندرایز خود را مشخص میکند
    changeMyHandStatus(handStatus) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.changeMyHandState', JSON.stringify({
                handStatus: handStatus
            }), {})

        }
    }

    // زمانی که مدیر وضعیت میکروفن را مشخص میکند
    changeMicStatus(userId, micStatus) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.changeUserMicState', JSON.stringify({
                userId: userId.toString(), micState: micStatus
            }), {})
        }
    }

    // زمانی که مدیر وضعیت دوربین را مشخص میکند
    changeCameraStatus(userId, cameraStatus) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.changeCameraStatus', JSON.stringify({
                cameraStatus: cameraStatus, userId: userId.toString()
            }), {})
        }
    }

    // زمانی که مدیر وضعیت شیر را مشخص میکند
    changeShareStatus(userId, shareStatus) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.changeShareStatus', JSON.stringify({
                shareStatus: shareStatus, userId: userId.toString()
            }), {})
        }
    }

    // زمانی که مدیر وضعیت هندرایز را مشخص میکند
    changeUserHandState(userId, handStatus) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.changeUserHandState', JSON.stringify({
                userId: userId.toString(), handStatus: handStatus
            }), {})
            // let micStatus
            // micStatus = handStatus !== 'none';
            // this.stompClient.send('/app/signalling.changeMicStatus', JSON.stringify({
            //     micStatus: micStatus,
            //     userId: userId.toString()
            // }), {})
        }
    }

    // زمانی که مدیر وضعیت پین را مشخص میکند
    changePin(userId, pin) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.changePin', JSON.stringify({
                pin: pin, userId: userId.toString()
            }), {})
        }
    }

    removeParticipantFromLayout(status, userId) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.changePublishStatus', JSON.stringify({
                userId: userId, meetingId: this.conferenceId, publishStatus: status
            }), {})
        }
    }

    myScreenShared(connectionId) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.sharing', JSON.stringify({
                userId: this.userId, connectionId: connectionId, displayName: this.displayName
            }), {})
        }
    }

    // زمانی که مدیر وارد جلسه میشود این پیام را هر 45 ثانیه یک بار به سرور ارسال میکند
    rotation() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.rotation', JSON.stringify({
                meetingId: this.conferenceId
            }), {})
        }
    }

    publisherList() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.publisherList', JSON.stringify({
                meetingId: this.conferenceId
            }), {})
        }
    }

    // زمانی که وارد جلسه میشویم این پیام را برای اطلاع از وضعیت پابلیش خود به سرور ارسال میکنیم
    isPublisher() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.isPublisher', JSON.stringify({
                meetingId: this.conferenceId, userId: this.userId, isPrivateMeeting: this.isPrivateMeeting
            }), {})
        }
    }

    okPublisher(isok) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.okPublisher', JSON.stringify({
                meetingId: this.conferenceId, userId: this.userId, okPublisher: isok
            }), {})
        }
    }

    // زمانی که مدیر فردی را از جلسه اخراج میکند این پیام را ارسال میکند
    throwOut(userId) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.leave', JSON.stringify({
                userId: userId
            }), {})
        }
    }

    iWantToLeave(userId) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.iWantToLeave', JSON.stringify({
                userId: userId
            }), {})
        }
    }

    // زمانی که کاربر از جلسه خارج میشود پیغام خروج را به سمت سرور ارسال میکند
    participantLeft() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.participantLeft', JSON.stringify({
                meetingId: this.conferenceId, userId: this.userId
            }), {})
        }
    }

    removeUserFromPublishers(num) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.isFailPublish', JSON.stringify({
                meetingId: this.conferenceId, userId: this.userId, status: num
            }), {})
        }
    }

    successPublish(num) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.successPublish', JSON.stringify({
                meetingId: this.conferenceId, userId: this.userId, state: +num
            }), {})
        }
    }

    failedPublish(num) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.failedPublish', JSON.stringify({
                meetingId: this.conferenceId, userId: this.userId, status: num
            }), {})
        }
    }

    // زمانی که کاربر از جلسه خارج میشود پیغام خروج را به سمت سرور ارسال میکند
    notifyUserLeft() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.notifyUserLeft', JSON.stringify({
                meetingId: this.conferenceId, userId: this.userId
            }), {})
        }
    }

    //  مدیر جلسه پیغام ضبط جلسه را به همه کاربران ارسال میکند
    notifyStartRecording() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.startRecording', JSON.stringify({
                meetingId: this.conferenceId
            }), {})
        }
    }

    getQueue() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.getQueue', JSON.stringify({
                meetingId: this.conferenceId
            }), {})
        }
    }

    activateModeratorSubstitutuion(Id, active) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.activateSubstitution', JSON.stringify({
                userId: Id, meetingId: this.conferenceId, active: active
            }), {})

        }
    }

    activateSpeacker(userId, conId, flag) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.activeSpeaker', JSON.stringify({
                userId: userId, connectionId: conId, meetingId: this.conferenceId, isActiveSpeaker: flag
            }), {})
        }
    }

    muteSpeacker(userId, isMuteSpeaker) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.muteSpeaker', JSON.stringify({
                isMuteSpeaker: isMuteSpeaker, userId: userId.toString(), meetingId: this.conferenceId
            }), {})
        }
    }

    isShared(isShared) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.isShared', JSON.stringify({
                isShared: isShared, userId: this.userId, displayName: this.displayName, meetingId: this.conferenceId
            }), {})
        }
    }

    participantClosedMic(status) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.participantClosedMic', JSON.stringify({
                micStatus: status, userId: this.userId, meetingId: this.conferenceId
            }), {})
        }
    }

    participantClosedCamera(status) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.participantClosedCamera', JSON.stringify({
                cameraStatus: status, userId: this.userId, meetingId: this.conferenceId
            }), {})
        }
    }

    changePublishSize() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.changePublishSize', JSON.stringify({
                userId: this.userId, meetingId: this.conferenceId
            }), {})
        }
    }

    shareRequest() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.shareRequest', JSON.stringify({
                userId: this.userId, meetingId: this.conferenceId
            }), {})
        }
    }

    shareStart(userid, meetingId) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.shareStart', JSON.stringify({
                userId: userid, meetingId: meetingId
            }), {})
        }
    }

    shareStop() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.shareStop', JSON.stringify({
                userId: this.userId, meetingId: this.conferenceId
            }), {})
        }
    }

    enableActiveSpeaker(enable) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.enableActiveSpeaker', JSON.stringify({
                meetingId: this.conferenceId, status: enable,
            }), {})
        }
    }

    enableChat(enable) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.enableChat', JSON.stringify({
                meetingId: this.conferenceId, status: enable,

            }), {})
        }
    }

    enableCreateProceedings(userId, proceedingsAllow, meetingId) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.proceedingsAllow', JSON.stringify({
                userId: userId.toString(), meetingId: meetingId.toString(), proceedingsAllow: proceedingsAllow
            }), {})
        }
    }

    pinToAudienceService(userId) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.pinToAudienceService', JSON.stringify({
                pin: false, userId: userId.toString()
            }), {})
        }
    }

    rotationChangeStatus(enable) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.rotationChangeStatus', JSON.stringify({
                senderUserId: this.userId, meetingId: this.conferenceId, rotationChangeStatus: enable,
            }), {})
        }
    }

    sendParagraph(paragraphInfo) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.sendMinutesParagraph', JSON.stringify(paragraphInfo), {})
        }
    }

    deleteParagraph(paragraphInfo) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.deleteMinutesParagraph', JSON.stringify(paragraphInfo), {})
        }
    }

    sendSurvey(data) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.sendSurvey', JSON.stringify(data), {})
        }
    }
    sendVideoQuality(resolution) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.changeMeetingQuality', JSON.stringify({
                resolution: resolution
            }), {})
        }
    }
    sendEgressId(status, eggId) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send('/app/signalling.saveEgressId', JSON.stringify({
                meetingId: this.conferenceId ,status:status, eggId: eggId,
            }), {})
        }
    }

}

const Singleton = (function () {
    let instance;

    function createInstance(conferenceId, userId, displayName, amImoderator, amIPresenter, amIsubstitutionModerator, amIGuest, isPrivateMeeting) {
        return new WebSocketClient(conferenceId, userId, displayName, amImoderator, amIPresenter, amIsubstitutionModerator, amIGuest, isPrivateMeeting)
    }

    return {
        getInstance: function (conferenceId, userId, displayName, amImoderator, amIPresenter, amIsubstitutionModerator, amIGuest, isPrivateMeeting) {
            if (!instance) {
                instance = createInstance(conferenceId, userId, displayName, amImoderator, amIPresenter, amIsubstitutionModerator, amIGuest, isPrivateMeeting)
            }
            return instance
        }
    }
})();

export default Singleton

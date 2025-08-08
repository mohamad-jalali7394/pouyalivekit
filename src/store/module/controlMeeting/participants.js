import eventBus from "../../../utils/event.bus";
import participantStatus from '../../../statics/types/participantStatus'
import auth from '../../../store/auth/index'
import WebSocketClient from "../../../webSocketClient";
import handStatus from "../../../statics/types/handStatus";

const participant = {
    state: {
        participants: [],
        secondParticipants: [],
        substitutionStatus: false
    },

    mutations: {
        PARTICIPANT_LEAVED: (state, participantInfo) => {
            const index = state.participants.findIndex(element => +element.userId === +participantInfo.userId);
            if (index < 0) return; // Exit if participant is not found

            const participant = state.participants[index];

            // Remove guest participants
            state.participants.splice(index, 1);
            if (participant.participantRole === 'USER' || participant.participantRole === 'ORGANIZATIONAL') {
                // Handle organizational participants
                if (participant.participantRole === 'MODERATOR' || participant.participantRole === 'MODERATOR') {
                    eventBus.emit('moderator_leaved');
                }
                if (participant.participantRole === 'PRESENTER') {
                    eventBus.emit('presenter_leaved');
                }
                eventBus.emit('participant-leave-from-conference',participantInfo)
                participant.participantStatus = participantStatus.OFFLINE; // Update status
            }
        },
        SET_PARTICIPANTS: (state, incomingParticipants) => {
            const existingParticipantsMap = new Map(state.participants.map(p => [p.userId, p]));

            incomingParticipants.forEach(incoming => {
                existingParticipantsMap.set(incoming.userId, incoming);
            });

            // Update state
            state.participants = Array.from(existingParticipantsMap.values());
            state.participants.forEach(participant => {
                eventBus.emit('connectionId_updated', participant);
                if (participant.participantRole === 'Moderator' && participant?.participantStatus === 'ONLINE') {
                    eventBus.emit('moderator_joined', participant);
                }
            });
        },
        SET_SECOND_PARTICIPANTS: (state, participants) => {
            state.secondParticipants = participants
        },
        PARTICIPANT_JOINED: (state, data) => {
            const index = state.participants.findIndex(element => +element.userId === +data.userId);
            const defaultDisplayName = 'ناشناس(بدون نام)';

            if (index > -1) {
                const participant = state.participants[index];
                Object.assign(participant, {
                    participantRole: data.participantRole,
                    failedPublish: data.failedPublish,
                    participantStatus: participantStatus.ONLINE,
                    permission: data.permission,
                    displayName: data.displayName || defaultDisplayName,
                });
            } else {
                state.participants.push(data);
            }

            // Emit connection update
            state.participants.forEach(participant => {
                eventBus.emit('connectionId_updated', participant);
                if (participant.participantRole === 'Moderator' && participant?.participantStatus === 'ONLINE') {
                    eventBus.emit('moderator_joined', participant);
                }
            });
        },
        ADD_PARTICIPANT: (state, participant) => {
            state.participants = participant
        },

        CONNECTION_ID_UPDATED: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index < 0) return
            state.participants[index].connectionId = data.connectionId
        },
        UPDATE_MY_INFO: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index < 0) return
            state.participants[index].connectionId = data.connectionId
            state.participants[index].layout_area = data.layout_area
        },
        MODERATOR_JOINED: (state, data) => {
            let index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index > -1) {
                state.participants[index].participantStatus = participantStatus.ONLINE
                state.participants[index].participantRole = data.participantRole
                state.participants[index].permission = data.permission
                state.participants[index].displayName = (data.displayName !== null && data.displayName !== undefined && data.displayName !== '') ? data.displayName : 'ناشناس(بدون نام)'
            } else {
                state.participants.push(data)
                index = state.participants.length - 1
            }
            state.participants[index].isModerator = true
            eventBus.emit('moderator_joined', state.participants[index].displayName)
        },
        PRESENTER_JOINED: (state, data) => {
            let index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index > -1) {
                state.participants[index].participantStatus = participantStatus.ONLINE
                state.participants[index].participantRole = data.participantRole
                state.participants[index].permission = data.permission
                state.participants[index].displayName = data.displayName
            } else {
                state.participants.push(data)
                index = state.participants.length - 1
            }
            eventBus.emit('presenter_joined', data)
        },

        UNMUTE_MIC_PARTICIPANT: (state, userId) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +userId
            })
            if (index < 0) return

            state.participants[index].permission.mic = true
            state.participants[index].permission.handStatus = handStatus.granted
            // WebSocketClient.getInstance().changeUserHandState(userId, handStatus.granted)
        },
        MUTE_MIC_PARTICIPANT: (state, userId) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +userId
            })
            if (index < 0) return
            state.participants[index].permission.mic = false
            state.participants[index].permission.handStatus = handStatus.none
        },
        UNMUTE_CAMERA_PARTICIPANT: (state, userId) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +userId
            })
            if (index < 0) return
            state.participants[index].permission.camera = true
        },
        MUTE_CAMERA_PARTICIPANT: (state, userId) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +userId
            })
            if (index < 0) return
            state.participants[index].permission.camera = false
        },
        UNMUTE_SHARE_PARTICIPANT: (state, userId) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +userId
            })
            if (index < 0) return

            state.participants[index].permission.share = true
        },
        MUTE_SHARE_PARTICIPANT: (state, userId) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +userId
            })
            if (index < 0) return
            state.participants[index].permission.share = false
        },
        PARTICIPANT_HAND_REQUEST: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            console.error('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv')
            console.error(index)
            console.error(data.userId)
            console.error(state.participants)
            if (index < 0) return
            state.participants[index].permission.handStatus = handStatus.waiting
            eventBus.emit('participantHandRequest', state.participants[index].displayName)
            eventBus.emit('participantHandRequestUserId', state.participants[index].userId)
        },
        PARTICIPANT_HAND_CANCEL: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index < 0) return
            state.participants[index].permission.handStatus = handStatus.none
            eventBus.emit('participantCancelHandRaiseRequest')
        },
        SEND_HAND_RISE: () => {
            WebSocketClient.getInstance().changeMyHandStatus(handStatus.waiting)
        },
        SEND_CANCEL_HAND_RISE: () => {
            WebSocketClient.getInstance().changeMyHandStatus(handStatus.none)
        },
        SEND_HAND_RISE_GRANTED: (state, userId) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +userId
            })
            if (index < 0) return
            // WebSocketClient.getInstance().changeUserHandState(userId, handStatus.granted)
            state.participants[index].permission.handStatus = handStatus.granted
            state.participants[index].permission.mic = true
            state.participants[index].permission.camera = true
        },
        SEND_HAND_RISE_DENIED: (state, userId) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +userId
            })
            if (index < 0) return
            state.participants[index].permission.handStatus = handStatus.none
            state.participants[index].permission.mic = false
        },
        SHARE_MY_SCREEN: (state) => {
            state.isMyScreenSharing = true
            eventBus.emit('share_my_screen')
        },
        UN_SHARE_MY_SCREEN: (state) => {
            state.isMyScreenSharing = false
            eventBus.emit('un_share_my_screen')
        },
        FAVORITE_PARTICIPANT: (state, participant) => {
            const index = state.participants.findIndex(function (element) {
                return element.id === participant.id
            })
            if (index < 0) return
            state.participants[index].favorite = true
            eventBus.emit('subscribe_to_some_participant', participant)
        },
        NOT_FAVORITE_PARTICIPANT: (state, participant) => {
            const index = state.participants.findIndex(function (element) {
                return element.id === participant.id
            })
            if (index < 0) return
            state.participants[index].favorite = false
            eventBus.emit('un_subscribe_to_some_participant', participant)
        },
        PIN_PARTICIPANT: (state, userId) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +userId
            })
            if (index < 0) return
            state.participants[index].permission.pin = true
            // state.pinned_count++
        },
        UN_PIN_PARTICIPANT: (state, userId) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +userId
            })
            if (index < 0) return
            state.participants[index].permission.pin = false
            // state.pinned_count--
            // participant un pin end
        },
        REMOVE_PARTICIPANT_FROM_LAYOUT: (state, object) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +object.userId
            })
            // let userId = state.participants[index].userId
            if (!object.status) {
                state.participants[index].permission.pin = false
                state.participants[index].permission.mic = false
                state.participants[index].permission.handStatus = handStatus.none
                state.participants[index].permission.share = false
                state.participants[index].permission.publishStatus = false
            }else {
                state.participants[index].permission.publishStatus = true
            }
            // state.participants[index].permission.pin = true
            if (index < 0) return
            // WebSocketClient.getInstance().removeParticipantFromLayout(object.status, userId)
            // participant un pin end
        },
        PARTICIPANT_PINNED: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index > -1) {
                state.participants[index].permission.pin = true
            }
        },
        PARTICIPANT_UNPINNED: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return element.userId === data.userId
            })
            if (index > -1) {
                state.participants[index].permission.pin = false
                // state.participants[index].permission.mic = false
                eventBus.emit('participant_un_pinned', state.participants[index])
            }
        },
        NOTIFY_PARTICIPANT_PINNED: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })

            if (index > -1) {
                state.participants[index].permission.pin = true
                eventBus.emit('Notify_User_Pin', state.participants[index])
            }
        },
        NOTIFY_PIN_TO_AUDIENCE: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })

            if (index > -1) {
                eventBus.emit('notify-pin-to-audience', state.participants[index])
            }
        },
        NOTIFY_PARTICIPANT_UN_PINNED: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index > -1) {
                state.participants[index].permission.pin = false
                // state.participants[index].permission.mic = false
                const participant = state.participants[index]

                // if some one is unpinned, if has the situation (not moderator and not me) he can be added to changeQueue
                if (+auth.getUserId() === +participant.userId) {
                    return
                }
                eventBus.emit('Un_Pin_Message', state.participants[index])
            }
        },
        NOTIFY_ACTIVE_SPEAKER: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })

            if (index > -1) {
                state.participants[index].permission.pin = true
                const participant = state.participants[index]

                // if some one is unpinned, if has the situation (not moderator and not me) he can be added to changeQueue
                if (+auth.getUserId() === +participant.userId) {
                    return
                }
                eventBus.emit('Notify_Active_Speaker', state.participants[index])
            }
        },
        THROWOUT_PARTICPANT: (state, userId) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +userId
            })
            if (index > -1) {
                WebSocketClient.getInstance().throwOut(userId)
            }
        },
        UPDATE_MIC_STATUS: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index < 0) return
            state.participants[index].permission.mic = data.micStatus
            if (data.micStatus === true) {
                state.participants[index].permission.handStatus = handStatus.granted
            } else {
                state.participants[index].permission.handStatus = handStatus.none

            }


        },
        UPDATE_PIN_STATUS: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index < 0) return

            eventBus.emit('change-pin-text', data.pin)

            state.participants[index].permission.pin = data.pin

        },
        UPDATE_SHARE_STATUS: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index < 0) return
            eventBus.emit('change-share-text', data.shareStatus)
            state.participants[index].permission.share = data.shareStatus

        },
        UPDATE_CAMERA_STATUS: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index < 0) return
            state.participants[index].permission.camera = data.cameraStatus

        },
        UPDATE_HAND_STATUS: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index < 0) return
            state.participants[index].permission.handStatus = data.handStatus
            if(data.handStatus ==='none'){
                state.participants[index].permission.mic = false
            }else{
                state.participants[index].permission.mic = true
            }

        },
        SUBSTITUTION_MODERATOR_JOINED: (state, data) => {
            state.substitutionStatus = data
            eventBus.emit('toggle-moderator-substitute' , {stat:data})
            eventBus.emit('SUB_MODERATOR_IS_ACTIVE' , data)
        },
        UPDATE_PROCEEDINGS_STATUS: (state, data) => {
            const index = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (index < 0) return
            WebSocketClient.getInstance().enableCreateProceedings(data.userId,data.proceedingsStatus,data.meetingId)
        },
        ADD_PARTICIPANT_TO_AUDIENCE: (state, data) => {
            WebSocketClient.getInstance().pinToAudienceService(data)
        },

    },

    actions: {
        participantLeaved({ commit }, userId) {
            commit('PARTICIPANT_LEAVED', userId)
        },
        setParticipants({ commit }, participants) {
            commit('SET_PARTICIPANTS', participants)
        },
        setSecondParticipants({ commit }, participants) {
            commit('SET_SECOND_PARTICIPANTS', participants)
        },
        addParticipant({ commit }, participant) {
            commit('ADD_PARTICIPANT', participant)
        },
        // removeParticipant({ commit }) {
        //     commit('REMOVE_PARTICIPANT')
        // },
        participantJoined({ commit }, data) {
            commit('PARTICIPANT_JOINED', data)
        },
        connectionIdUpdated({ commit }, data) {
            commit('CONNECTION_ID_UPDATED', data)
        },
        updateMyInfo({ commit }, data) {
            commit('UPDATE_MY_INFO', data)
        },
        moderatorJoined({ commit }, participant) {
            commit('MODERATOR_JOINED', participant)
        },
        presenterJoined({ commit }, participant) {
            commit('PRESENTER_JOINED', participant)
        },
        unmuteMicParticipant({ commit }, participant) {
            commit('UNMUTE_MIC_PARTICIPANT', participant)
        },
        muteMicParticipant({ commit }, participant) {
            commit('MUTE_MIC_PARTICIPANT', participant)
        },
        unmuteShareParticipant({ commit }, participant) {
            commit('UNMUTE_SHARE_PARTICIPANT', participant)
        },
        muteShareParticipant({ commit }, participant) {
            commit('MUTE_SHARE_PARTICIPANT', participant)
        },
        unmuteCameraParticipant({ commit }, participant) {
            commit('UNMUTE_CAMERA_PARTICIPANT', participant)
        },
        muteCameraParticipant({ commit }, participant) {
            commit('MUTE_CAMERA_PARTICIPANT', participant)
        },
        sendHandRise({ commit }) {
            commit('SEND_HAND_RISE')
        },
        sendCancelHandRise({ commit }) {
            commit('SEND_CANCEL_HAND_RISE')
        },
        sendHandRiseGranted({ commit }, participant) {
            commit('SEND_HAND_RISE_GRANTED', participant)
        },
        sendHandRiseDenied({ commit }, participant) {
            commit('SEND_HAND_RISE_DENIED', participant)
        },
        shareMyScreen({ commit }) {
            commit('SHARE_MY_SCREEN')
        },
        unShareMyScreen({ commit }) {
            commit('UN_SHARE_MY_SCREEN')
        },
        favoriteParticipant({ commit }, participant) {
            commit('FAVORITE_PARTICIPANT', participant)
        },
        notFavoriteParticipant({ commit }, participant) {
            commit('NOT_FAVORITE_PARTICIPANT', participant)
        },

        pinParticipant({ commit }, participant) {
            commit('PIN_PARTICIPANT', participant)
        },
        unPinParticipant({ commit }, participant) {
            commit('UN_PIN_PARTICIPANT', participant)
        },
        removeParticipantFromLayout({ commit }, participant) {
            commit('REMOVE_PARTICIPANT_FROM_LAYOUT', participant)
        },
        participantHandRequest({ commit }, participant) {
            commit('PARTICIPANT_HAND_REQUEST', participant)
        },
        participantHandCancel({ commit }, participant) {
            commit('PARTICIPANT_HAND_CANCEL', participant)
        },

        notifyParticipantPinned({ commit }, data) {
            commit('NOTIFY_PARTICIPANT_PINNED', data)
        },
        notifyPinToAudience({ commit }, data) {
            commit('NOTIFY_PIN_TO_AUDIENCE', data)
        },

        notifyParticipantUnPinned({ commit }, data) {
            commit('NOTIFY_PARTICIPANT_UN_PINNED', data)
        },

        participantPinned({ commit }, data) {
            commit('PARTICIPANT_PINNED', data)
        },
        participantUnPinned({ commit, state }, data) {
            commit('PARTICIPANT_UNPINNED', data)

            const indexInParticipants = state.participants.findIndex(function (element) {
                return +element.userId === +data.userId
            })
            if (indexInParticipants < 0) return
            const participant = state.participants[indexInParticipants]

            // if some one is unpinned, if has the situation (not moderator and not me) he can be added to changeQueue
            if (participant.isItMe ||
                +auth.getUserId() === +participant.userId || // it's me
                participant.isModerator ||
                participant.participantStatus !== participantStatus.ONLINE ||
                (participant.permission && participant.permission.pin)) {
                return
            }
            // state.changeQueue.push(participant)
        },
        notifyActiveSpeaker({ commit }, data) {
            commit('NOTIFY_ACTIVE_SPEAKER', data)
        },
        throwOutParticipant({ commit }, participant) {
            commit('THROWOUT_PARTICPANT', participant)
        },
        updateMicStatus({ commit }, data) {
            commit('UPDATE_MIC_STATUS', data)
        },
        updatePinStatus({ commit }, data) {
            commit('UPDATE_PIN_STATUS', data)
        },
        updateShareStatus({ commit }, data) {
            commit('UPDATE_SHARE_STATUS', data)
        },
        updateCameraStatus({ commit }, data) {
            commit('UPDATE_CAMERA_STATUS', data)
        },
        updateHandStatus({ commit }, data) {
            commit('UPDATE_HAND_STATUS', data)
        },
        SubstitutionModeratorJoined({commit }, data) {
            commit('SUBSTITUTION_MODERATOR_JOINED', data)
        },
        updateProceedingsStatus({commit},data){
            commit('UPDATE_PROCEEDINGS_STATUS',data)
        },
        addParticipantToAudience({commit},data){
            commit('ADD_PARTICIPANT_TO_AUDIENCE', data)
        }

    }
}
export default participant

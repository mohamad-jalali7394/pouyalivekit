import auth from "@/store/auth";
const room = {
    state: {
        maximumPinSizeExceeds : false,
        screenShareInfo : {screenShareStat : false, amIShareMyScreen: false, screenSharerId : null, screenShareDetails : null},
        hasModerator : auth.getHasModerator(),
        isBlock : false,
        isModeratorSubstituteActivated : false,
        roomId: null,
        amIHaveBoardPermission: false,
        amIShareMyScreen: false,
        session_name: '',
        startTime : '',
        endTime : '',
        publishCount: 16,
        fromSchd: {},
        toSchd: {to:auth.getToSchd(),
            meetingAgenda:[]} ,
        prRoomId : null,
    },
    mutations: {
        SET_SCREEN_SHARE_INFO: (state, info) => {
            state.screenShareInfo[info.type] = info.payload;
        },
        SET_HAS_MAXIMUM_PIN_EXCEEDS : (state, maximumPinSizeExceeds) => {
            state.maximumPinSizeExceeds = maximumPinSizeExceeds;
        },
        SET_HAS_MODERATOR : (state, hasModerator) => {
            state.hasModerator = hasModerator;
        },
        SET_ROOM_ID: (state, roomId) => {
            state.roomId = roomId
        },
        AM_I_HAVE_BOARD_PERMISSION: (state, amIHaveBoardPermission) => {
            state.amIHaveBoardPermission = amIHaveBoardPermission;
        },
        AM_I_SHARE_MY_SCREEN: (state, amIShareMyScreen) => {
            state.amIShareMyScreen = amIShareMyScreen
        },
        SET_IS_MODERATOR_SUBSTITUTE_ACTIVATED: (state, isModeratorSubstituteActivated) => {
            state.isModeratorSubstituteActivated = isModeratorSubstituteActivated;
        },
        SET_SESSION_NAME: (state, session_name) => {
            state.session_name = session_name
        },
        SET_START_TIME: (state,time) => {
            state.startTime = time
        },
        SET_END_TIME: (state,time) => {
            state.endTime = time
        },
        SET_PBLISH_COUNT: (state,publishCount) => {
            state.publishCount = publishCount
        },
        SET_ROOM_BLOCKING_STAT: (state, blockingStat) => {
            state.isBlock = blockingStat;
        },
        SET_FROM_SCHD: (state, fromSchd) => {
            state.fromSchd = fromSchd;
        },
        SET_TO_SCHD: (state, toSchd) => {
            state.toSchd = toSchd;
        },
        SET_AGENDAS: (state, meetingAgenda) => {
            state.meetingAgenda = meetingAgenda;
        },
        SET_PR_ROOM_ID: (state, prRoomID) => {
            state.prRoomID = prRoomID;
        },
    },
    actions: {
        setScreenShareInfo({ commit }, info){
          commit('SET_SCREEN_SHARE_INFO', info);
        },
        setHasMaximumPinExceeds({ commit }, maximumPinSizeExceeds){
            commit('SET_HAS_MAXIMUM_PIN_EXCEEDS', maximumPinSizeExceeds);
        },
        setHasModerator({commit}, hasModerator){
            commit('SET_HAS_MODERATOR', hasModerator);
        },
        setRoomId({commit}, roomId) {
            commit('SET_ROOM_ID', roomId);
        },
        setMyBoardPermission({commit}, amIHaveBoardPermission) {
            commit('AM_I_HAVE_BOARD_PERMISSION', amIHaveBoardPermission);
        },
        setMyScreenShareStat({commit}, amIShareMyScreen) {
            commit('AM_I_SHARE_MY_SCREEN', amIShareMyScreen)
        },
        setIsModeratorSubstituteActivated({ commit }, isModeratorSubstituteActivated) {
            commit('SET_IS_MODERATOR_SUBSTITUTE_ACTIVATED', isModeratorSubstituteActivated);
        },
        setSessionName({ commit }, session_name) {
            commit('SET_SESSION_NAME', session_name)
        },
        setStartTime({ commit }, time) {
            commit('SET_START_TIME', time)
        },
        setEndTime({ commit }, time) {
            commit('SET_END_TIME', time)
        },
        setPublishCount({ commit }, publishCount) {
            commit('SET_PBLISH_COUNT', publishCount)
        },
        setRoomBlockingStat({ commit }, blockingStat){
            commit('SET_ROOM_BLOCKING_STAT', blockingStat);
        },
        setFromSchd({ commit }, fromSchd){
            commit('SET_FROM_SCHD', fromSchd);
        },
        setToSchd({ commit }, toSchd){
            auth.setToSchd(toSchd.to)
            commit('SET_TO_SCHD', toSchd);
        },
        setAgendas({ commit }, meetingAgenda){
            commit('SET_AGENDAS', meetingAgenda);
        },
        setPrRoomId({ commit }, prRoomID){
            commit('SET_PR_ROOM_ID', prRoomID);
        },
    }
}

// import emitter from "../../../utils/event.bus";
// import { OpenVidu } from 'openvidu-browser'
// const room = {
//     state: {
//         OV: undefined,
//         room: '',
//         session_name: '',
//         session_id: '',
//         publisher: null,
//         sessionToken: ''
//     },
//
//     mutations: {
//
//         SET_SESSION: (state, room) => {
//             state.room = room
//         },
//         SET_PUBLISHER: (state, publisher) => {
//             state.publisher = publisher.publisher
//         },
//         SET_SESSION_ID: (state, session_id) => {
//             state.session_id = session_id
//         },
//         SET_SESSION_NAME: (state, session_name) => {
//             state.session_name = session_name
//         },
//         SET_SCHEDULE_ID: (state, session_id) => {
//             state.session_id = session_id
//         },
//         SET_SESSION_TOKEN: (state, token) => {
//             state.sessionToken = token
//         },
//         INIT_OPENVIDU: (state) => {
//             state.OV = new OpenVidu()
//             state.OV.setAdvancedConfiguration({
//                 screenShareChromeExtension: 'https://chrome.google.com/webstore/detail/YOUR_EXTENSION_NAME/YOUR_EXTENSION_ID',
//                 publisherSpeakingEventsOptions: {
//                     interval: 100, // Frequency of the polling of audio streams in ms (default 100)
//                     threshold: -50 // Threshold volume in dB (default -50)
//                 }
//             })
//             state.OV.enableProdMode()
//             var openviduSupported = state.OV.checkSystemRequirements()
//             if (openviduSupported === 1) {
//             }
//             var shareSupported = state.OV.checkScreenSharingCapabilities
//             if (shareSupported === 1) {
//             }
//         },
//     },
//     actions: {
//         initOpenVidu({ commit }) {
//             commit('INIT_OPENVIDU')
//         },
//         setSession({ commit, state, dispatch }) {
//             const room = state.OV.initSession()
//             commit('SET_SESSION', room)
//             state.room.on('streamCreated', event => {
//                 try {
//                     // let userData
//                     let nodeId
//                     const connection = event.stream.connection
//                     if (typeof connection === 'string') {
//                         nodeId = connection
//                     } else {
//                         nodeId = connection.connectionId
//                     }
//                     const participant = {
//                         streamObject: event,
//                         id: nodeId,
//                         connection: connection,
//                         connectionId: nodeId,
//                         layout_area: null,
//                         subscriber: null
//                     }
//                     // TODO prevent subscribing if max user reached
//                     participant.isItMe = false
//                     dispatch('streams/addToStreams', participant, { root: true })
//                     emitter.$emit('streamCreated', participant)
//                 } catch (error) {
//                     console.error(error)
//                 }
//             })
//             state.room.on('streamDestroyed', event => {
//                 try {
//                     dispatch('streams/removeFromStreams', event, { root: true })
//                     dispatch('subscribedStreams/removeFromSubscribedStreams', event, { root: true })
//                 } catch (error) {
//                     console.error(error)
//                 }
//             })
//             this.room.on('exception', ({ exception }) => {
//             });
//             state.room.on('sessionDisconnected ', (event) => {
//             })
//             state.room.on('connectionCreated', (event) => { console.log(event) })
//             state.room.on('connectionDestroyed', (event) => {
//                 emitter.$emit('connectionDestroyed', event)
//             })
//             state.room.on('publisherStartSpeaking', (event) => {
//                 emitter.$emit('publisherStartSpeaking', event)
//             })
//
//             state.room.on('publisherStopSpeaking', (event) => {
//                 emitter.$emit('publisherStopSpeaking', event)
//             })
//             state.room.on('signal', () => { })
//             commit('SET_SESSION', room)
//         },
//         setSessionName({ commit }, session_name) {
//             commit('SET_SESSION_NAME', session_name)
//         },
//         setSessionId({ commit }, session_name) {
//             commit('SET_SESSION_ID', session_name)
//         },
//         setScheduleId({ commit }, schedule_id) {
//             commit('SET_SCHEDULE_ID', schedule_id)
//         },
//         setSessionToken({ commit }, token) {
//             console.error(token)
//             commit('SET_SESSION_TOKEN', token)
//         },
//         setPublisher({ commit, state, dispatch }, publisher) {
//             commit('SET_PUBLISHER', publisher)
//             const participant = {
//                 display_name: publisher.display_name,
//                 layout_area: publisher.layout_area,
//                 isModerator: state.amIModerator,
//                 isItMe: true,
//                 pin: false,
//                 streamObject: event
//             }
//             dispatch('streams/addToStreams', participant, { root: true })
//             for (let i = 0; i < state.participants.length; i++) {
//                 if (state.participants[i].display_name === publisher.display_name) { return }
//             }
//         },
//     }
// }
export default room;

import eventBus from "../../../utils/event.bus";
import handStatus from '../../../statics/types/handStatus'
import WebSocketClient from '../../../webSocketClient/index'
import auth from '../../../store/auth/index'
const moderatorMeetingController = {
    state:{

    },

    mutations:{
        UNMUTE_MIC_PARTICIPANT: (state, participant) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === participant.userId
            })
            if (index < 0) return
            state.participants[index].permission.mic = true
            WebSocketClient.getInstance().changeMicStatus(state.participants[index].userId, true)
        },
        MUTE_MIC_PARTICIPANT: (state, participant) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === participant.userId
            })
            if (index < 0) return
            state.participants[index].permission.mic = false
            WebSocketClient.getInstance().changeMicStatus(state.participants[index].userId, false)
        },
        UNMUTE_CAMERA_PARTICIPANT: (state, participant) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === participant.userId
            })
            if (index < 0) return
            state.participants[index].permission.camera = true
            WebSocketClient.getInstance().changeCameraStatus(state.participants[index].userId, true)
        },
        MUTE_CAMERA_PARTICIPANT: (state, participant) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === participant.userId
            })
            if (index < 0) return
            state.participants[index].permission.camera = false
            WebSocketClient.getInstance().changeCameraStatus(state.participants[index].userId, false)
        },
        UNMUTE_SHARE_PARTICIPANT: (state, participant) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === participant.userId
            })
            if (index < 0) return
            state.participants[index].permission.share = true
            WebSocketClient.getInstance().changeShareStatus(state.participants[index].userId, true)
        },
        MUTE_SHARE_PARTICIPANT: (state, participant) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === participant.userId
            })
            if (index < 0) return
            state.participants[index].permission.share = false
            WebSocketClient.getInstance().changeShareStatus(state.participants[index].userId, false)
        },
        PARTICIPANT_HAND_REQUEST: (state, data) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === data.userId
            })
            if (index < 0) return
            state.participants[index].permission.handStatus = handStatus.waiting
        },
        PARTICIPANT_HAND_CANCEL: (state, data) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === data.userId
            })
            if (index < 0) return
            state.participants[index].permission.handStatus = handStatus.none
        },
        SEND_HAND_RISE: () => {
            WebSocketClient.getInstance().changeMyHandStatus(handStatus.waiting)
        },
        SEND_CANCEL_HAND_RISE: () => {
            WebSocketClient.getInstance().changeMyHandStatus(handStatus.none)
        },
        SEND_HAND_RISE_GRANTED: (state, participant) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === participant.userId
            })
            if (index < 0) return
            WebSocketClient.getInstance().changeUserHandState(participant.userId, handStatus.granted)
            state.participants[index].permission.handStatus = handStatus.granted
            state.participants[index].permission.mic = true
            state.participants[index].permission.camera = true
            state.participants[index].permission.share = true
            // participant pin
            state.participants[index].pin = true
            eventBus.emit('participant_pinned', participant)
            // WebSocketClient.getInstance().changePin(participant.userId, true)
            state.pinned_count++
            // participant pin end
        },
        SEND_HAND_RISE_DENIED: (state, participant) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === participant.userId
            })
            if (index < 0) return
            WebSocketClient.getInstance().changeUserHandState(participant.userId, handStatus.none)
            state.participants[index].permission.handStatus = handStatus.none
            state.participants[index].permission.mic = false
            state.participants[index].permission.share = false
            // participant un pin
            state.participants[index].permission.pin = false
            eventBus.emit('participant_un_pinned', participant)
            WebSocketClient.getInstance().changePin(participant.userId, false)
            state.pinned_count--
            // participant un pin end
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
            const index = state.participants.findIndex(function(element) {
                return element.id === participant.id
            })
            if (index < 0) return
            state.participants[index].favorite = true
            eventBus.emit('subscribe_to_some_participant', participant)
        },
        NOT_FAVORITE_PARTICIPANT: (state, participant) => {
            const index = state.participants.findIndex(function(element) {
                return element.id === participant.id
            })
            if (index < 0) return
            state.participants[index].favorite = false
            eventBus.emit('un_subscribe_to_some_participant', participant)
        },
        PIN_PARTICIPANT: (state, participant) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === participant.userId
            })
            if (index < 0) return
            // participant pin
            state.participants[index].permission.pin = true
            // state.participants[index].permission.mic = true
            eventBus.emit('participant_pinned', participant)
            WebSocketClient.getInstance().changePin(participant.userId, true)
            state.pinned_count++
            // participant pin end
        },
        UN_PIN_PARTICIPANT: (state, participant) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === participant.userId
            })
            if (index < 0) return
            // participant un pin
            state.participants[index].permission.pin = false
            // state.participants[index].permission.mic = false
            eventBus.emit('participant_un_pinned', participant)
            WebSocketClient.getInstance().changePin(participant.userId, false)
            state.pinned_count--
            // participant un pin end
        },
        PARTICIPANT_PINNED: (state, data) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === data.userId
            })
            if (index > -1) {
                state.participants[index].permission.pin = true
                // state.participants[index].permission.mic = true
                eventBus.emit('participant_pinned', state.participants[index])
            }
        },
        PARTICIPANT_UNPINNED: (state, data) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === data.userId
            })
            if (index > -1) {
                state.participants[index].permission.pin = false
                // state.participants[index].permission.mic = false
                eventBus.emit('participant_un_pinned', state.participants[index])
            }
        },
        NOTIFY_PARTICIPANT_PINNED: (state, data) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === data.userId
            })

            if (index > -1) {
                state.participants[index].permission.pin = true
                const participant = state.participants[index]

                // if some one is unpinned, if has the situation (not moderator and not me) he can be added to changeQueue
                if (auth.getUserId() === participant.userId) {
                    return
                }
                eventBus.emit('Notify_User_Pin', state.participants[index])
            }
        },
        NOTIFY_PARTICIPANT_UN_PINNED: (state, data) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === data.userId
            })
            if (index > -1) {
                state.participants[index].permission.pin = false
                // state.participants[index].permission.mic = false
                const participant = state.participants[index]

                // if some one is unpinned, if has the situation (not moderator and not me) he can be added to changeQueue
                if (auth.getUserId() === participant.userId) {
                    return
                }
                eventBus.emit('Un_Pin_Message', state.participants[index])
            }
        },
        THROWOUT_PARTICPANT: (state, data) => {
            const index = state.participants.findIndex(function(element) {
                return element.userId === data.userId
            })
            if (index > -1) {
                WebSocketClient.getInstance().throwOut(state.participants[index].userId)
            }
        },
    },

    actions:{
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
    }
}
export default moderatorMeetingController
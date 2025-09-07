import ConferenceState from '../../../statics/types/conferenceState'
import auth from "@/store/auth";
const userState = {
    state:{
        privateRoomOwnerUserId: 0,
        status: '',
        privateRoomId: auth.getPrivateRoomId(),
        conferenceState: ConferenceState.none,
        cameraStat: true,
        micStat:false,
    },

    mutations:{
        SET_PRIVATE_ROOM_ID: (state, privateRoomId) => {
            state.privateRoomId = privateRoomId
        },
        SET_PRIVATE_ROOM_OWNER_ID: (state, privateRoomOwnerUserId) => {
            state.privateRoomOwnerUserId = privateRoomOwnerUserId
        },
        SET_CODE: (state, code) => {
            state.code = code
        },
        SET_CONFERENCE_STATE: (state, conferenceState) => {
            state.conferenceState = conferenceState
        },
        SET_STATUS: (state, status) => {
            state.status = status
        },
        SET_CAMERA_STAT: (state, status) => {
            state.cameraStat = status
        },
        SET_MIC_STAT: (state, status) => {
            state.micStat = status
        },
    },

    actions:{
        setUserStatus({ commit }, userStatus) {
            commit('SET_STATUS', userStatus)
        },
        setConferenceState({ commit }, conferenceState) {
            commit('SET_CONFERENCE_STATE', conferenceState)
        },
        setPrivateRoomId({ commit }, privateRoomId) {
            commit('SET_PRIVATE_ROOM_ID', privateRoomId)
        },
        setPrivateRoomOwnerUserId({ commit }, privateRoomOwmerUserId) {
            commit('SET_PRIVATE_ROOM_OWNER_ID', privateRoomOwmerUserId)
        },
        setCameraStat({ commit }, cameraStat) {
            commit('SET_CAMERA_STAT', cameraStat)
        },
        setMicStat({ commit }, micStat) {
            commit('SET_MIC_STAT', micStat)
        },
    }
}
export default userState

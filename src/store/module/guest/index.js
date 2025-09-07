import auth from '../../auth/index'
const guest = {
    state: {
        amIGuest : false,
        isRoomExistedOrStarted : true,
        meetingType: '',
        meetingInfo: '',
        username:'',
        meetingName:'',
        ownerName:'',
        uniqueId:'',
        password:'',
        conferenceIdG:'',
        link: auth.getGuestURL()
    },

    mutations: {
        SET_AM_I_GUEST : (state, amIGuest) => {
          state.amIGuest = amIGuest;
        },
        SET_IS_ROOM_EXISTED_OR_STARTED : (state, isRoomExistedOrStarted) => {
          state.isRoomExistedOrStarted = isRoomExistedOrStarted;
        },
        SET_MEETING_INFO: (state, meetingInfo) => {
            state.meetingInfo = meetingInfo
        },
        SET_MEETING_TYPE: (state, meetingType) => {
            state.meetingType = meetingType
        },
        SET_MEETING_NAME: (state, meetingName) => {
            state.meetingName = meetingName
        },
        SET_OWNER_NAME: (state, ownerName) => {
            state.ownerName = ownerName
        },
        SET_UNIQUE_ID: (state, uniqueId) => {
            state.uniqueId = uniqueId
        },
        SET_PASSWORD: (state, password) => {
            state.password = password
        },
        SET_CONFERENCE_ID: (state, conferenceId) => {
            state.conferenceIdG = conferenceId
        },
        SET_USER_NAME: (state, username) => {
            state.username = username
        },
        SET_MEETING_LINK: (state, link) => {
            state.link = link
        }
    },

    actions: {
        setAmIGuest({ commit }, amIGuest) {
          commit('SET_AM_I_GUEST', amIGuest);
        },
        setIsRoomExistedOrStarted({ commit }, isRoomExistedOrStarted) {
          commit('SET_IS_ROOM_EXISTED_OR_STARTED', isRoomExistedOrStarted);
        },
        setMeetingInfo({commit}, meetingInfo) {
            commit('SET_MEETING_INFO', meetingInfo)
        },
        setMeetingType({commit}, meetingType) {
            commit('SET_MEETING_TYPE', meetingType)
        },
        setMeetingName({commit}, meetingName) {
            commit('SET_MEETING_NAME', meetingName)
        },
        setOwnerName({commit}, ownerName) {
            commit('SET_OWNER_NAME', ownerName)
        },
        setUniqueId({commit}, uniqueId) {
            commit('SET_UNIQUE_ID', uniqueId)
        },
        setPassword({commit}, password) {
            commit('SET_PASSWORD', password)
        },
        setConferenceIdG({commit}, conferenceId) {
            commit('SET_CONFERENCE_ID', conferenceId)

        },
        setUsername({commit}, username) {
            commit('SET_USER_NAME', username)
        },
        setMeetingLink({commit}, link) {
            auth.setGuestUR(link)
            commit('SET_MEETING_LINK', link)
        }
    }
}
export default guest

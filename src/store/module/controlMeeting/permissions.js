

const state = {
    cameraControlAllowed: true,
    cameraStatus: true,
    micStatus: false,
    micControlAllowed: false,
    speakerStatus: true,
    speakerControlAllowed: true,
    userJoinedStatus: false,
    handStatus: "none",
    shareStatus: false,
    microphneStateForReconnect:false,
}

const getters = {
    cameraControlAllowed: (state) => {
        return state.cameraControlAllowed
    },
    cameraStatus: (state) => {
        return state.cameraStatus
    },
    micStatus: (state) => {
        return state.micStatus
    },
    micControlAllowed: (state) => {
        return state.micControlAllowed
    },
    userJoinedStatus: (state) => {
        return state.userJoinedStatus
    },
    getHandStatus: (state) => {
        return state.handStatus
    },
    getShareStatus: (state) => {
        return state.shareStatus
    },

    getMicrophneStateForReconnect: (state) => {
        return state.microphneStateForReconnect
    }
}

const actions = {
    setCameraState({commit}, cameraStatus) {
        commit('SET_CAMERA_STATE', cameraStatus)
    },
    setCameraControlAllowed({commit}, cameraControlAllowed) {
        commit('SET_CAMERA_CONTROL_ALLOWED', cameraControlAllowed)
    },
    setMicState({commit}, micStatus) {
        commit('SET_MIC_STATE', micStatus)
    },
    setMicControlAllowed({commit}, micControlAllowed) {
        commit('SET_MIC_CONTROL_ALLOWED', micControlAllowed)
    },
    setUserJoinedStatus({commit}, userJoinedStatus) {
        commit('SET_USER_JOINED', userJoinedStatus)
    },
    setHandStatus({commit}, handStatus) {
        commit('SET_HAND_STATUS', handStatus)
    },
    setShareStatus({commit}, shareStatus) {
        commit('SET_SHARE_STATUS', shareStatus)
    },
    setMicrophneStateForReconnect({commit}, microphneStateForReconnect) {
        commit('SET_MIC_STATUS_FOR_RECONNECT', microphneStateForReconnect)
    },
}

const mutations = {
    SET_CAMERA_STATE: (state, cameraStatus) => {
        state.cameraStatus = cameraStatus
    },
    SET_CAMERA_CONTROL_ALLOWED: (state, cameraControlAllowed) => {
        state.cameraControlAllowed = cameraControlAllowed
        state.cameraStatus = false
    },
    SET_MIC_STATE: (state, micStatus) => {
        state.micStatus = micStatus
    },
    SET_MIC_CONTROL_ALLOWED: (state, micControlAllowed) => {
        state.micControlAllowed = micControlAllowed
    },
    SET_USER_JOINED: (state, userJoinedStatus) => {
        state.userJoinedStatus = userJoinedStatus
    },
    SET_HAND_STATUS: (state, handStatus) => {
        state.handStatus = handStatus
    },
    SET_SHARE_STATUS: (state, shareStatus) => {
        state.shareStatus = shareStatus
    },
    SET_MIC_STATUS_FOR_RECONNECT:(state, microphneStateForReconnect) => {
        state.microphneStateForReconnect = microphneStateForReconnect
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

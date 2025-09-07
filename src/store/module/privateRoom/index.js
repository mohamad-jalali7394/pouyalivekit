const privateRoom = {
    state: {
        invitePasswordPrivate: '',
        roomIdPublic: ''
    },
    mutations: {
        SET_ROOM_ID: (state, roomIdPublic) => {
            state.roomIdPublic = roomIdPublic
        },
        SET_INVITE_PASSWORD: (state, invitePasswordPrivate) => {
            state.invitePasswordPrivate = invitePasswordPrivate
        }
    },
    actions: {
        setInvitePassword({ commit }, invitePassword) {
            commit('SET_INVITE_PASSWORD', invitePassword)
        },
        setRoomIdPublicRoom({ commit }, roomIdPublic) {
            commit('SET_ROOM_ID', roomIdPublic)
        }

    }

}

export default privateRoom
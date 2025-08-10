const userTypesInConfrance = {
    state:{
        isPublicUser: '',
        isPrivateUser: '',
        isPrivateGuest: '',
        isPublicGuest: '',
        isPrivate: false,
    },

    mutations:{
        IS_PRIVATE_GUEST: (state, isPrivateGuest) => {
            state.isPrivateGuest = isPrivateGuest
        },
        IS_PUBLIC_GUEST: (state, isPublicGuest) => {
            state.isPublicGuest = isPublicGuest
        },
        IS_PRIVATE_USER: (state, isPrivateUser) => {
            state.isPrivateUser = isPrivateUser
        },
        IS_PUBLIC_USER: (state, isPublicUser) => {
            state.isPublicUser = isPublicUser
        },

        IS_PRIVATE: (state, isPrivate) => {
            state.isPrivate = isPrivate
        },

    },

    actions:{
        setIsPrivateGuest({ commit }, userRole) {
            commit('IS_PRIVATE_GUEST', userRole)
        },
        setIsPublicGuest({ commit }, userRole) {
            commit('IS_PUBLIC_GUEST', userRole)
        },
        setIsPrivateRoom({ commit }, falg) {
            commit('IS_PRIVATE', falg)
        },

        setIsPrivateUser({ commit }, userRole) {
            commit('IS_PRIVATE_USER', userRole)
        },
        setIsPublicUser({ commit }, userRole) {
            commit('IS_PUBLIC_USER', userRole)
        },
    }
}
export default userTypesInConfrance

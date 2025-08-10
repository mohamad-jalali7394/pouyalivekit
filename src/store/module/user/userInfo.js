import auth from '../../auth/index'
import RestClient from '@/api/restClient'
import store from "../../index";
const restClient = new RestClient('auth')
const restClientUser = new RestClient('user')
const userInfo = {
    state: {
        firstName: auth.getFirstName(),
        lastName: auth.getLastName(),
        tenant: auth.getTenant(),
        token: auth.getKilid(),
        refresh_token: '',
        userId: auth.getUserId(),
        displayName: auth.getDisplayName() ? auth.getDisplayName() : '' ,
        connectionId: '',
        userRole: [],
        authenticated: false,
        customerId:auth.getCustomerId(),
        phoneNumber: auth.getMobile(),
        email:auth.getEmail(),
        LDAPID:auth.getLDAPID(),
        imgSrc:auth.getLImgSrc(),
        userName:auth.getUserName(),
        gender:auth.getGender(),
        isVideoMuted:false,
        isAudioMuted:false,
        userRoleInMeeting: 'USER',

    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_USER_ID: (state, userId) => {
            state.userId = userId
        },
        SET_CONNECTION_ID: (state, connectionId) => {
            state.connectionId = connectionId
        },
        SET_FIRST_NAME: (state, firstName) => {
            state.firstName = firstName
        },
        SET_LAST_NAME: (state, lastName) => {
            state.lastName = lastName
        },
        SET_DISPLAY_NAME: (state, displayName) => {
            state.displayName = displayName
        },
        SET_REFERESH_TOKEN: (state, token) => {
            state.refresh_token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_TENANT: (state, tenant) => {
            state.tenant = tenant
        },
        SET_USER_ROLE: (state, role) => {
            state.userRole = role
        },
        SET_AUTHENTICATION: (state, authenticated) => {
            state.authenticated = authenticated
        },
        SET_CUSTOMER_ID: (state, customerId) => {
            state.customerId = customerId
        },

        SET_PHONE_NUMBER: (state, phoneNumber) => {
            state.phoneNumber = phoneNumber
        },
        SET_EMAIL: (state, email) => {
            state.email = email
        },
        SET_LDAP_ID: (state, LDAPID) => {
            state.LDAPID = LDAPID
        },
        SET_IMAGE_SRC: (state, imgSrc) => {
            state.imgSrc = imgSrc
        },
        SET_USER_NAME: (state, userName) => {
            state.userName = userName
        },
        SET_GENDER: (state, gender) => {
            state.gender = gender
        },
        iS_VIDEO_MUTED: (state, isVideoMuted) => {
            state.isVideoMuted = isVideoMuted
        },
        iS_AUDIO_MUTED: (state, isAudioMuted) => {
            state.isAudioMuted = isAudioMuted
        },
        SET_USER_ROLE_IN_MEETING: (state, userRoleInMeeting) => {
            state.userRoleInMeeting = userRoleInMeeting
        },
    },

    actions: {
        LoginByUsername({ commit }, userInfo) {
            const username = userInfo.username
            commit('SET_TENANT', userInfo.tenantName)
            return new Promise((resolve, reject) => {
                restClient
                    .login(username, userInfo.password, userInfo.ldap, userInfo.tenantName)
                    .then(response => {
                        commit('SET_USER_ROLE', response.data['role'])
                        localStorage.setItem('user-role',JSON.stringify(response.data['role']))
                        const data = response.data

                        commit('SET_TOKEN', data['access_token'])
                        commit('SET_REFERESH_TOKEN', data['refresh_token'])
                        commit('SET_AUTHENTICATION', true)
                        auth.setkilid(response.data['access_token'])
                        // auth.setRefreshkilid(response.data['refresh_token'])
                        auth.setUserId(response.data['userId'])

                        commit('SET_USER_ID', data['userId'])

                        restClientUser.getMyInfo().then((response) => {
                            store.dispatch('setCustomerId', response.data.customerId);
                            auth.setCustomerId(response.data.customerId)
                            const displayName = response.data['firstName'] + ' ' + response.data['lastName']
                            const tenant = response.data['tenant']
                            const firstName = response.data['firstName']
                            const lastName = response.data['lastName']
                            auth.setFirstName(firstName)
                            auth.setLastName(lastName)
                            auth.setDisplayName(displayName)
                            auth.setTenant(tenant)
                            auth.setIsAuthenticated(true)
                            auth.setEmail(response.data['email'])
                            auth.setMobile(response?.data['phoneNumber']?.toString())
                            auth.setLDAPId(response.data['ldapConfigID'])
                            auth.setUserName(response.data['username'])
                            auth.setGender(response.data['gender'])
                            commit('SET_TENANT', tenant)
                            commit('SET_DISPLAY_NAME', displayName)
                            commit('SET_FIRST_NAME', firstName)
                            commit('SET_LAST_NAME', lastName)
                            commit('SET_PHONE_NUMBER', response.data['phoneNumber'])
                            commit('SET_EMAIL', response.data['email'])
                            commit('SET_USER_NAME', response.data['username'])
                            commit('SET_LDAP_ID', response.data['ldapConfigID'])
                            commit('SET_GENDER', response.data['gender'])
                            resolve(response)
                        })
                    })
                    .catch(error => {
                        reject(error.response)
                    })
            })
        },

        setUserId({ commit }, userId) {
            commit('SET_USER_ID', userId)
        },
        setConnectionId({ commit }, connectionId) {
            commit('SET_CONNECTION_ID', connectionId);
        },
        setDisplayName({ commit }, displayName) {
            commit('SET_DISPLAY_NAME', displayName)
        },
        setCustomerId({ commit }, customerId) {
            commit('SET_CUSTOMER_ID', customerId)
        },
        setImageSrc({ commit }, imgSrc) {
            auth.setImgSrc(imgSrc)
            commit('SET_IMAGE_SRC', imgSrc)
        },
        setIsVideoMute({ commit }, isVideoMute) {
            commit('iS_VIDEO_MUTED', isVideoMute)
        },
        setIsAudioMute({ commit }, isAudioMute) {
            commit('iS_AUDIO_MUTED', isAudioMute)
        },
        setUserRoleInMeeting({commit}, userRoleInMeeting) {
            commit('SET_USER_ROLE_IN_MEETING', userRoleInMeeting)
        },
        LogOut({ commit, state }) {
            return new Promise((resolve) => {
                restClient
                    .logOut(state.refresh_token)
                    .then(() => {
                        resolve()
                    })
                    .finally(() => {
                        commit('SET_TENANT', '')
                        commit('SET_TOKEN', '')
                        commit('SET_REFERESH_TOKEN', '')
                        commit('SET_USER_ID', 0)
                        commit('SET_DISPLAY_NAME', '')
                        commit('SET_FIRST_NAME', '')
                        commit('SET_LAST_NAME', '')
                        commit('SET_AUTHENTICATION', false)
                        auth.setIsAuthenticated(false)
                        auth.removeToken()
                        auth.removeRefreshToken()
                        auth.removeUserId()
                        auth.removeDisplayName()
                        auth.removeFirstName()
                        auth.removeLastName()

                        resolve()
                    })
            })
        },
    }
}
export default userInfo

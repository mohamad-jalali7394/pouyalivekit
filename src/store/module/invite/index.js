import RestClient from '@/api/restClient'
import entityTypes from '../../../statics/entityTypes'

const restClient = new RestClient(entityTypes.invite)
const invite = {
    state:{
        invitedUsers: [],
        inviteLink: '',
        invitePasswordPrivate: ''
    },

    mutations:{
        SET_INVITE_PASSWORD: (state, invitePasswordPrivate) => {
            state.invitePasswordPrivate = invitePasswordPrivate
        },
        SET_INVITED_USERS: (state, invitedUsers) => {
            state.invitedUsers = invitedUsers
        },
        SET_INVITE_LINK: (state, inviteLink) => {
            state.inviteLink = inviteLink
        }
    },

    actions:{
        setInviteLink({ commit }, inviteLink) {
            commit('SET_INVITE_LINK', inviteLink)
        },
        setInvitePassword({ commit }, invitePassword) {
            commit('SET_INVITE_PASSWORD', invitePassword)
        },
        setInvitedUsers({ commit }, setInvitedUsers) {
            commit('SET_INVITED_USERS', setInvitedUsers)
        },
        getInviteUsers({ commit, rootState }) {
            const scheduleId = rootState['schedule_id']
            restClient.getInvitedPublic(scheduleId)
                .then((setInvitedUsers) => {
                    commit('SET_INVITED_USERS', setInvitedUsers)
                })
                .catch((error) => {
                    console.error(error)
                })


        }
    }
}
export default invite
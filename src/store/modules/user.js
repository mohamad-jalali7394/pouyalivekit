import RestClient from '@/api/restClient'
import auth from '@/services/auth'
const restClient = new RestClient('auth')

const user = {
  state: {
    token: auth.getToken(),
    refresh_token: auth.getRefreshToken(),
    authenticated: false,
  },

  mutations: {

    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REFERESH_TOKEN: (state, token) => {
      state.refresh_token = token
    },

    SET_AUTHENTICATION: (state, authenticated) => {
      state.authenticated = authenticated
    },
  },

  actions: {
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        restClient
          .login(username, userInfo.password)
          .then(response => {
            const data = response.data
            localStorage.setItem("userId", response.data['userId']);
            commit('SET_TOKEN', data['access_token'])
            commit('SET_REFERESH_TOKEN', data['refresh_token'])
            auth.setToken(response.data['access_token'])
            auth.setRefreshToken(response.data['refresh_token'])
            resolve(response)
          })
          .catch(error => {
            reject(error.response)
          })
      })
    },
  }
}

export default user

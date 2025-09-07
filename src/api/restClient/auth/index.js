import genericClient from '../genericClient'
import Fingerprint2 from 'fingerprintjs2'
import staticCredentials from '@/statics/credentials'
import config from '../../../config'

class auth extends genericClient {F
  login(username, password, ldap, tenantName) {
    return new Promise((resolve, reject) => {
      if (ldap === undefined) {
        ldap = false
      }
      try {
        const options = {}
        Fingerprint2.get(options, (components) => {
          const values = components.map(function(component) { return component.value })
          const hash = Fingerprint2.x64hash128(values.join(''), 31)

          const basicAuth = 'Basic ' + btoa(staticCredentials.basic_username + ':' + staticCredentials.basic_passwrod)
          this.axios
            .create({
              baseURL: config.REST_API,
              timeout: this.localSettings.http_request_general_timeout,
              headers: {
                'isMonitoring': 'Y',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': basicAuth
              }
            })
            .post(this.localSettings.endpoints.auth.getToken, {
              username: username, // gave the values directly for testing
              password: password,
              tenant: tenantName,
              grant_type: 'password',
              ldap: ldap,
              deviceId: hash,
              platform: 'web'
            }
            )
            .then(response => {
              const result = this.ApiResponseService.checkResponse(response, reject, true)
              resolve(result)
            })
            .catch(function(error) {
              reject(error)
            })
        })
      } catch (error) {
        console.error(error)
      }
    })
  }
  refreshToken() {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth.getRefreshKilid()
          }
        })
        .post(this.localSettings.endpoints.auth.refresh)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(result)
        })
        .catch(function(error) {
          resolve()
          reject(error)
        })
    })
  }
  logOut() {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth.getKilid()
          }
        })
        .get(this.localSettings.endpoints.auth.logout)
        .then(response => {
          localStorage.removeItem('customer-id')
          const result = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(result)
        })
        .catch(function(error) {
          resolve()
          reject(error)
        })
    })
  }

  sendVerificationCode(data) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout
        })
        .post(this.localSettings.endpoints.auth.sendVerificationCode, data)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject)
          resolve(result.data)
        })
        .catch(error => {
          this.ApiResponseService.checkResponse(error.response.data, reject)
        })
    })
  }
  confirmVerification(info) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout

        }).post(this.localSettings.endpoints.auth.confirmVerification, info)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject ,response.data.success)
          resolve(result.data)
        })
        .catch(error => {
          this.ApiResponseService.checkResponse(error.response, reject)
        })
    })
  }
  resetPassword(info) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout

        }).put(this.localSettings.endpoints.auth.resetPassword, info)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject)
          resolve(result.data)
        })
        .catch(error => {
          this.ApiResponseService.checkResponse(error.response, reject)
        })
    })
  }

  changePassword(info) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth.getKilid()
          }
        }).put(this.localSettings.endpoints.auth.changePassword, info)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject)
          resolve(result.data)
        })
        .catch(error => {
          this.ApiResponseService.checkResponse(error.response, reject)
        })
    })
  }
}
export default auth

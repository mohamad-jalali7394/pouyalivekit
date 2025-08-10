import genericClient from '../genericClient'
import config from '@/config'

class passProtection extends genericClient {
  getPasswordProtectionPrivate(roomId) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .post(this.localSettings.endpoints.getPasswordProtection.getPasswordProtectionPrivate + '?privateRoomId=' + roomId)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(result.data.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  getPasswordProtectionPublic(roomId) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .post(this.localSettings.endpoints.getPasswordProtection.getPasswordProtectionPublic + '?roomId=' + roomId)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(result.data.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
export default passProtection

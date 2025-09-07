import genericClient from '../genericClient'
import config from '@/config'
class userGroup extends genericClient {
  getAllUsersByGroupId(id) {
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
        .get(this.localSettings.endpoints.userGroup.getAllUsersByGroupId + '/' + id)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject)
          resolve(result.data)
        })
        .catch(error => {
          this.ApiResponseService.checkResponse(error, reject)
        })
    })
  }
  modify(groupId, users) {
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
        .post(this.localSettings.endpoints.userGroup.modifyUsersOfGroup + groupId, users)
        .then(response => {
          const modify = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(modify)
        })
        .catch(error => {
          this.ApiResponseService.checkResponse(error, reject)
        })
    })
  }
}
export default userGroup

import genericClient from '../genericClient'
import config from '@/config'
import eventBus from "@/utils/event.bus";

class invite extends genericClient {
  getInvited(privateRoomId) {
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
        .get(this.localSettings.endpoints.invite.getInvited + privateRoomId)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(result.data.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  getInvitedPublic(publicRoomId) {
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
        .get(this.localSettings.endpoints.invite.getInvitedUsersByScheduleId + publicRoomId)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(result.data.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  getPassword(meetingId) {
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
        .get(this.localSettings.endpoints.room.getPassword + meetingId)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(result.data.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  modifyUserOfPublicRoom(publicRoomId, guestsPhoneNumber, data) {
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
        .post(this.localSettings.endpoints.invite.modifyUserOfPublicRoom + publicRoomId + '?' + 'guestsPhoneNumber=' + guestsPhoneNumber, data)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(result.data.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  generateLink( meetingId) {
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
        .post(this.localSettings.endpoints.room.generateLink + "/" + meetingId)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(result.data.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  getRoomInfo(data) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .post(this.localSettings.endpoints.rooms.getRoomInfo + data)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, true)
            if (result.data.errorCodeLists?.length > 0){
                this.ApiResponseService.checkResponse(result.data, reject)
                setTimeout(()=>{
                    eventBus.emit('time-is-up-please-do-not-try')
                },5000)

            }
          resolve(result.data.data)
        })
        .catch(error => {
          this.ApiResponseService.checkResponse(error.response, reject)
        })
    })
  }
  getInvitedUsersPublicRoom(meetingId) {
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
        .get(this.localSettings.endpoints.invite.getInvitedUsersPublicRoom + meetingId)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(result.data.data)
        })
        .catch(error => {
          this.ApiResponseService.checkResponse(error.response, reject)
        })
    })
  }
  deleteInvitedUser(userId) {
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
        .delete(this.localSettings.endpoints.invite.removeInvitedUser + userId)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(result.data.data)
        })
        .catch(error => {
          this.ApiResponseService.checkResponse(error.response, reject)
        })
    })
  }
    // getInvitedUserPhoto(id) {
    //     return new Promise((resolve, reject) => {
    //         this.axios
    //             .create({
    //                 baseURL: config.REST_API,
    //                 timeout: this.localSettings.http_request_general_timeout,
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 }
    //             })
    //             .get(this.localSettings.endpoints.invite.getInvitedUserPhoto + id)
    //             .then(response => {
    //                 const result = this.ApiResponseService.checkResponse(response, reject, true)
    //
    //                 resolve(result?.data)
    //             })
    //             .catch(function(error) {
    //                 this.ApiResponseService.checkResponse(error, reject)
    //             })
    //     })
    // }
}
export default invite

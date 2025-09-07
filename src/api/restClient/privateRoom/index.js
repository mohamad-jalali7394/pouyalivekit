import genericClient from '../genericClient'
import config from '@/config'

class privateRoom extends genericClient {
    modifyUserOfPrivateRoom(privateRoomId, meetingLink, data) {
        return new Promise((resolve, reject) => {
            const privateinvite = {
                privateRoomId: privateRoomId,
                meetingLink: meetingLink,
                inviteEmails: data
            }
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.privateRoom.modifyUserOfPrivateRoom, privateinvite)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    inviteGuest(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                }).post(this.localSettings.endpoints.privateRoom.inviteGuest, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    inviteOrganizationalGuest(data) {
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
                .post(this.localSettings.endpoints.privateRoom.inviteOrganizationalGuest, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    getAllInvited(id){
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
                .get(this.localSettings.endpoints.privateRoom.getAllInvited + id)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data)
                })
                .catch((error) => {
                    console.error(error)
                })
        })
    }

    getAllByOwnerUserId() {
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
                .get(this.localSettings.endpoints.privateRoom.getAllByOwnerUserId)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data.data)
                })
                .catch((error) => {
                    console.error(error)
                })
        })
    }

    generateLink(privateRoomId) {
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
                .get(this.localSettings.endpoints.privateRoom.generateLink + '/' + privateRoomId)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }

    generateNewPassword(password, privateRoomId) {
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
                .put(this.localSettings.endpoints.privateRoom.generateNewPassword + privateRoomId + '/' + password)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }

    terminateMeeting() {
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
                .get(this.localSettings.endpoints.privateRoom.terminate)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error, reject)
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
                .get(this.localSettings.endpoints.privateRoom.getRoomInfo + data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result.data.data)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }
    getRoomInfoForOrganizationUser(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .get(this.localSettings.endpoints.privateRoom.getRoomInfo + data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result.data.data)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }
    getAll() {
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
                .get(this.localSettings.endpoints.privateRoom.getAllByAdmin)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    const room = result.data
                    for (let i = 0; i < room.length; i++) {
                        room[i].createdAt = this.convertDate(room[i].createdAt)
                        room[i].modifiedAt = this.convertDate(room[i].modifiedAt)
                        room[i].enable = this.convertBoolean(room[i].enable)
                    }
                    resolve(room)
                })
                .catch(function(error) {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }

    deleteOrganization(id) {
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
                .delete(this.localSettings.endpoints.privateRoom.deleteOrganization + id)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }

    deleteGuest(id) {
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
                .delete(this.localSettings.endpoints.privateRoom.deleteGuest + id)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }

    inviteByPublicLink(privateRoomId, meetingLink, emails , phoneNumbers , inviteMessage) {
        return new Promise((resolve, reject) => {
            const privateinvite = {
                privateRoomId: privateRoomId,
                meetingLink: meetingLink,
                inviteEmails: emails,
                invitePhoneNumbers : phoneNumbers,
                inviteMessage : inviteMessage

            }
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.privateRoom.inviteByPublicLink, privateinvite)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }




    createPrivateRoomMeeting(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: 'https//360gw.shooka.com/',
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.privateRoom.createPrivateRoomMeeting, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    assign(userId, privateRoomId) {
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
                .post(this.localSettings.endpoints.privateRoom.assignPrivateRoom + '/' + privateRoomId + '/' + userId)

                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const room = result.data
                    resolve(room)
                })
                .catch(function(error) {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }


}

export default privateRoom

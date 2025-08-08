import genericClient from '../genericClient'
import config from '@/config'

class user extends genericClient {
  getMyInfo() {
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
        .get(this.localSettings.endpoints.user.getMyInfo)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, true)
          resolve(result.data)
        })
        .catch((error) => {
          reject(error)
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
        .get(this.localSettings.endpoints.user.getAll)
        .then(response => {
          const users = this.ApiResponseService.checkResponse(response, reject)
          resolve(users.data)
        }).catch((error) => {
          this.ApiResponseService.checkResponse(error, reject)
        })
    })
  }
    search(searchQueryLastName, searchQueryFirstName, userName, phoneNumber, pageNumber, pageSize) {
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
                .post(this.localSettings.endpoints.user.search + `?pageNo=${pageNumber}&pageSize=${pageSize}`, {
                    lastName: searchQueryLastName,
                    firstName: searchQueryFirstName,
                    userName: userName,
                    phoneNumber: phoneNumber
                })
                .then(response => {
                    const users = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(users)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error, reject)
            })
        })
    }
    getById(id) {
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
                .get(this.localSettings.endpoints.user.getById + id)
                .then(response => {
                    const users = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(users.data)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error, reject)
            })
        })
    }
    create(data) {
        // console.log(JSON.stringify(data))
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
                .post(this.localSettings.endpoints.user.create, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch(error => {
                    console.error(error.response)
                    this.ApiResponseService.checkResponse(error.response.data, reject)
                })
        })
    }
    update(data) {
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
                .post(this.localSettings.endpoints.user.update, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }
    delete(id) {
        // console.log(`id: ${id}`)
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
                .delete(this.localSettings.endpoints.user.delete + id)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }

    deleteSomeUsers(ids) {
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
                .post(this.localSettings.endpoints.user.deleteSomeUsers, ids)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }

    activateUsers(ids) {
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
                .put(this.localSettings.endpoints.user.deactiveUsers + true, ids)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }

    deActivateUsers(ids) {
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
                .put(this.localSettings.endpoints.user.deactiveUsers + false, ids)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }

    createUserByExcel(file) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.user.createUserByExcel, file)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }
    exportUsers() {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.user.getAllUserInExcel)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }

    confirmVerificationCode(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .post(this.localSettings.endpoints.user.ConfirmVerificationCode, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }
    updateAvatar(data,id) {
        // console.log(JSON.stringify(data))
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
                .post(this.localSettings.endpoints.user.updateAvatar + id, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch(error => {
                    console.error(error.response)
                    this.ApiResponseService.checkResponse(error.response.data, reject)
                })
        })
    }
    getAvatar(id) {
        // console.log(JSON.stringify(data))
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: 'https//360gw.shooka.com/',
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .get(this.localSettings.endpoints.user.getAvatar + id,{responseType: 'arraybuffer' })
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch(error => {
                    console.error(error.response)
                    this.ApiResponseService.checkResponse(error.response.data, reject)
                })
        })
    }
    deleteAvatar(id) {
        // console.log(JSON.stringify(data))
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
                .delete(this.localSettings.endpoints.user.deleteAvatar + id)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch(error => {
                    console.error(error.response)
                    this.ApiResponseService.checkResponse(error.response.data, reject)
                })
        })
    }
    getAllUsersForVipCustomer() {
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
                .get(this.localSettings.endpoints.user.getAllUsersForVipCustomer)
                .then(response => {
                    const users = this.ApiResponseService.checkResponse(response, reject)
                    resolve(users.data)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error, reject)
            })
        })
    }
}
export default user


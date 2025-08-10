import genericClient from '../genericClient'
import config from '@/config'
class room extends genericClient {
    getAllRoomsByCustomerId(customer_id) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: process.env.BASE_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.room.getAllRoomByCustomerId + `${customer_id}`)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    const room = result.data
                    resolve(room)
                })
                .catch(function(error) {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }

    getAllRoomByCustomerIdAndPlanId(customerId,planId) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL:config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.room.getAllRoomByCustomerIdAndPlanId  + customerId + '/'  + planId)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    const room = result.data
                    resolve(room)
                })
                .catch(function(error) {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }
    //
    // getAllRoomByCustomerIdAndPlanId(customer_id) {
    //     return new Promise((resolve, reject) => {
    //         this.axios
    //             .create({
    //                 baseURL: process.env.BASE_API,
    //                 timeout: this.localSettings.http_request_general_timeout,
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': 'Bearer ' + this.auth.getKilid()
    //                 }
    //             })
    //             .get(this.localSettings.endpoints.room.getAllRoomByCustomerIdAndPlanId + `${customer_id}` + '/1')
    //             .then(response => {
    //                 const result = this.ApiResponseService.checkResponse(response, reject, true)
    //                 const room = result.data
    //                 resolve(room)
    //             })
    //             .catch(function(error) {
    //                 this.ApiResponseService.checkResponse(error, reject)
    //             })
    //     })
    // }
    getById(id) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: process.env.BASE_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.room.getById + id)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    const room = result.data
                    resolve(room)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    create(data, customer_id) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: process.env.BASE_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.room.create + `${customer_id}`, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const room = result.data
                    resolve(room)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    createRoomByCustomer(data, customer_id) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.room.createRoomByCustomer + `${customer_id}`, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const room = result.data
                    resolve(room)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    deleteRoom(customerId,roomId){
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL:config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .delete(this.localSettings.endpoints.room.deleteRoom  + customerId + '/'  + roomId)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    const room = result.data
                    resolve(room)
                })
                .catch(function(error) {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }
    updateRoomByCustomer(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.room.updateRoomByCustomer , data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const room = result.data
                    resolve(room)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    update(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: process.env.BASE_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.room.update, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const room = result.data
                    resolve(room)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    getAll(is_webinar) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL:config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.room.getAll + '?is_webinar=' + is_webinar)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    const room = result.data
                    resolve(room)
                })
                .catch(function(error) {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }
    delete(id) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + this.auth.getKilid()
                    }
                })
                .delete(this.localSettings.endpoints.room.delete + id)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }
}
export default room

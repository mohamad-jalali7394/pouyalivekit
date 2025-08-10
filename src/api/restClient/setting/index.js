import genericClient from '../genericClient'
import config from '@/config'

// class setting extends genericClient {
//     saveSetting(userId, phoneNumbers, GetHistoryInterval, dbHealthCheck,RequestIntervalTime) {
//         return new Promise((resolve, reject) => {
//             const data = {
//                 'userId': userId,
//                 'healthCheckFrequency': RequestIntervalTime,
//                 'dbHealthCheckFrequency': dbHealthCheck,
//                 'resultFrequency': GetHistoryInterval,
//                 'phoneNumbers': phoneNumbers
//             }
//             this.axios.create({
//                     baseURL: config.REST_API,
//                     timeout: this.localSettings.http_request_general_timeout,
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': 'Bearer ' + this.auth.getToken()
//                     }
//                 })
//                 .post(this.localSettings.endpoints.setting.saveSetting, data)
//                 .then(response => {
//                     if (this.checkResponse(response, reject)) {
//                         resolve(response)
//                     } else reject()
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     }
//     getSetting() {
//         return new Promise((resolve, reject) => {
//             this.axios.create({
//                 baseURL: config.REST_API,
//                 timeout: this.localSettings.http_request_general_timeout,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': 'Bearer ' + this.auth.getToken()
//                 }
//             })
//                 .get(this.localSettings.endpoints.setting.getSetting)
//                 .then(response => {
//                     if (this.checkResponse(response, reject)) {
//                         resolve(response)
//                     } else reject()
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     }
// }

// export default setting

class setting extends genericClient {
    create(id) {
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
                .get(this.localSettings.endpoints.setting.createSetting + '/' `${id}`)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const setting = result.data
                    resolve(setting)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    getAll() {
        console.log(`get room by id`)
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
                .get(this.localSettings.endpoints.setting.getSetting)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    const setting = result.data.data
                    resolve(setting)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
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
                .post(this.localSettings.endpoints.setting.updateSetting, data)
                .then(response => {
                    console.log(JSON.stringify(response))
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const setting = result.data
                    resolve(setting)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    reset() {
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
                .get(this.localSettings.endpoints.setting.resetSetting)
                .then(response => {
                    // console.log(response)
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const setting = result.data
                    resolve(setting)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
}
export default setting


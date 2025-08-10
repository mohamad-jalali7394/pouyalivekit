import genericClient from '../genericClient'
import config from '../../../config'

class loginLog extends genericClient {
    search(username, pageNumber, pageSize, searchQuery, ip, from, to, tenant) {
        return new Promise((resolve, reject) => {
            const data = {
                username: username,
                ip: ip,
                title: searchQuery,
                from: this.convertDateToGeorgianTimeStamp(from),
                to: this.convertDateToGeorgianTimeStamp(to),
                tenant: tenant
            }
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.log.getAll + `?pageNo=${pageNumber}&pageSize=${pageSize}`, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    console.error(result.data)
                    for (let i = 0; i < result.data.logs.length; i++) {
                        result.data.logs[i].timestamp = this.convertDate(result.data.logs[i].timestamp)
                    }
                    resolve(result)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error.response, reject)
            })
        })
    }

    getFailedLogHistory(username, pageNumber, pageSize, searchQuery, ip, from, to, tenant) {
        return new Promise((resolve, reject) => {
            const data = {
                username: username,
                ip: ip,
                title: searchQuery,
                from: this.convertDateToGeorgianTimeStamp(from),
                to: this.convertDateToGeorgianTimeStamp(to),
                tenant: tenant
            }
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.log.getFailedLogHistory + `?pageNo=${pageNumber}&pageSize=${pageSize}`, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    console.log()
                    for (let i = 0; i < result.logs.length; i++) {
                        result.logs[i].timestamp = this.convertDate(result.logs[i].timestamp)
                        result.logs[i].description = this.convertLoginStatus(result.logs[i].description)
                        console.log(result.logs[i].description)
                    }
                    resolve(result)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error, reject)
            })
        })
    }
}

export default loginLog

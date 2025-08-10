import genericClient from '../genericClient'
import config from '@/config'

class meetingattribute extends genericClient {
    getByMeetingId(meetingId) {
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
                .get(this.localSettings.endpoints.meetingAttribute.getByMeetingId + meetingId)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }


    create(data) {
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
                .post(this.localSettings.endpoints.meetingAttribute.create, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result.data.data)
                })
                .catch((error) => {
                    reject(error)
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
                .post(this.localSettings.endpoints.meetingAttribute.update, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    getMeetingInfo(meetingId) {
        console.error('apiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
        console.error(this.localSettings.endpoints.meetingAttribute)
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .get(this.localSettings.endpoints.meetingAttribute.getMeetingInfo + meetingId)
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
export default meetingattribute

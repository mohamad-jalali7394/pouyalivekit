import genericClient from '../genericClient'
import config from '@/config'

class meeting extends genericClient {
    getMySchedule(fromSchd, toSchd) {
        return new Promise((resolve, reject) => {
            const data = {
                fromSchd: this.convertDateToGeorgianTimeStampWithZeroTime(fromSchd),
                toSchd: this.convertDateToGeorgianTimeStampWithZeroTime(toSchd)
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
                .post(this.localSettings.endpoints.scheduledMeeting.getMySchedule, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        const meetings = response.data.data
                        for (let i = 0; i < meetings.length; i++) {
                            meetings[i].fromSchd = this.convertDate(meetings[i].fromSchd)
                            meetings[i].toSchd = this.convertDate(meetings[i].toSchd)
                        }
                        resolve(meetings)
                    } else reject()
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error.response, reject, false)
                    if (error.response?.status === 401) {
                        console.log(error.response?.status)
                    }
                    reject(error)
                })
        })
    }

    getAll(fromSchd, toSchd) {
        return new Promise((resolve, reject) => {
            const data = {
                fromSchd: this.convertDateToGeorgianTimeStamp(fromSchd),
                toSchd: this.convertDateToGeorgianTimeStamp(toSchd)
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
                .post(this.localSettings.endpoints.scheduledMeeting.getAll, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    const meetings = result.data
                    // meetings
                    //     .sort((a, b) => new Date(a.fromSchd) - new Date(b.fromSchd))
                    for (let i = 0; i < meetings.data.length; i++) {
                        // meetings.data[i].meetingStatus = this.convertStatus(meetings.data[i].meetingStatus)
                        meetings.data[i].fromSchd = this.convertDate(meetings.data[i].fromSchd)
                        meetings.data[i].toSchd = this.convertDate(meetings.data[i].toSchd)
                        meetings.data[i].createdDate = this.convertDate(meetings.data[i].createdDate)
                    }
                    resolve(meetings.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }

    getPrivateMeetingByUserId() {
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
                .get(this.localSettings.endpoints.scheduledMeeting.getPrivateMeetingByUserId)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result.data.data)
                })
                .catch((error) => {
                    reject(error)
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
                .get(this.localSettings.endpoints.scheduledMeeting.getById + id)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    const meeting = result.data
                    meeting.data.fromSchd = this.convertDate(meeting.data.fromSchd)
                    meeting.data.toSchd = this.convertDate(meeting.data.toSchd)
                    resolve(meeting)
                })
                .catch(error => {
                    console.error(error)
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    create(dataInput) {
        return new Promise((resolve, reject) => {
            try {
                dataInput.fromSchd = this.convertDateToGeorgianTimeStamp(dataInput.fromSchd)
                dataInput.toSchd = this.convertDateToGeorgianTimeStamp(dataInput.toSchd)
                const client = this.axios
                    .create({
                        baseURL: config.REST_API,
                        timeout: this.localSettings.http_request_general_timeout,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.auth.getKilid()
                        }
                    })
                client.post(this.localSettings.endpoints.scheduledMeeting.create, dataInput)
                    .then(response => {
                        const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                        resolve(result.data)
                    })
                    .catch(error => {
                        this.ApiResponseService.checkResponse(error.response.data, reject)
                    })
            } catch (error) {
                console.error(error)
                this.ApiResponseService.checkResponse(error, reject)
            }
        })
    }
    update(data) {
        data.fromSchd = this.convertDateToGeorgianTimeStamp(data.fromSchd)
        data.toSchd = this.convertDateToGeorgianTimeStamp(data.toSchd)
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
                .post(this.localSettings.endpoints.scheduledMeeting.update, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)


                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }
    cancelMeeting(meetingID, smsStatus) {
        return new Promise((resolve, reject) => {
            this.axios.create({
                baseURL: config.REST_API,
                timeout: this.localSettings.http_request_general_timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.auth.getKilid()
                }
            })
                .post(this.localSettings.endpoints.scheduledMeeting.cancelMeeting + meetingID + '/' + smsStatus)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }
    getAllUsersTenantByCustomerId(id) {
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
                .get(this.localSettings.endpoints.scheduledMeeting.getAllUsersTenantByCustomerId + id)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    getAllGroupsTenantByCustomerId(id) {
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
                .get(this.localSettings.endpoints.scheduledMeeting.getAllGroupsTenantByCustomerId + id)
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
export default meeting

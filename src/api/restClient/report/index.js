import genericClient from '../genericClient'
import config from '@/config'
import Fingerprint2 from "fingerprintjs2";
const staticCredentials = {
    basic_username: 'client_id',
    basic_passwrod: 'password'
}
class report extends genericClient {
    loginSuper() {
        return new Promise((resolve, reject) => {
            try {
                const options = {}
                Fingerprint2.get(options, (components) => {
                    const values = components.map(function(component) { return component.value })
                    const hash = Fingerprint2.x64hash128(values.join(''), 31)
                    const basicAuth = 'Basic ' + btoa(staticCredentials.basic_username + ':' + staticCredentials.basic_passwrod)
                    this.axios
                        .create({
                            baseURL: 'https://gw.shooka.com',
                            timeout: this.localSettings.http_request_general_timeout,
                            headers:{
                                'isMonitoring' : 'Y',
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': basicAuth
                            }
                        })
                        .post(this.localSettings.endpoints.testApis.getKilid, {
                                username: 'super', // gave the values directly for testing
                                password: '123@Abcd',
                                tenant: 'shooka',
                                ldap:'false',
                                grant_type: 'password',
                                deviceId: hash,
                                platform: 'ap'
                            }
                        )
                        .then(response => {

                            if (this.checkResponse(response, reject)) {
                                resolve(response)
                            } else  resolve(response)
                        })
                        .catch(function(error) {
                            if (!error.response) {
                                resolve(error)
                            } else {
                                resolve(error.response)
                            }
                        })
                })
            } catch (error) {
                console.error(error)
            }
        })
    }


    getAll() {
        return new Promise((resolve, reject) => {

            this.axios
                .create({
                    baseURL: 'https://gw.shooka.com',
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.report.getReportForSuper)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })

                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error, reject)
            })
        })
    }
    search(pageNumber, pageSize, from, to) {
        console.error()
        return new Promise((resolve, reject) => {
            const data = {
                fromDate: this.convertDateToGeorgianTimeStamp(from),
                toDate: this.convertDateToGeorgianTimeStamp(to)
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
                .post(this.localSettings.endpoints.report.getReportForSuper + `?page=${pageNumber}&size=${pageSize}`, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    for (let i = 0; i < result.data.data.reportMeetings.length; i++) {
                        result.data.data.reportMeetings[i].fromSch = this.convertDate(result.data.data.reportMeetings[i].fromSch)
                        result.data.data.reportMeetings[i].toSch = this.convertDate(result.data.data.reportMeetings[i].toSch)
                        result.data.data.reportMeetings[i].invitedLength = result.data.data.reportMeetings[i].invitedList.length
                    }

                    resolve(result.data)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error.response, reject)
            })
        })
    }

    getAllBriefReportInExcel(from, to) {
        return new Promise((resolve, reject) => {
            const data = {
                // customerId: customerId,
                fromDate: this.convertDateToGeorgianTimeStamp(from),
                toDate: this.convertDateToGeorgianTimeStamp(to)
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
                .post(this.localSettings.endpoints.report.getAllBriefReportInExcel, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }

    exportReport(from, to) {
        return new Promise((resolve, reject) => {
            const data = {
                fromDate: this.convertDateToGeorgianTimeStamp(from),
                toDate: this.convertDateToGeorgianTimeStamp(to)
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
                .post(this.localSettings.endpoints.report.getAllReportInExcel, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }
    exportReportById(meetingId) {
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
                .post(this.localSettings.endpoints.report.getAllReportInExcelById + '?meetingId=' + meetingId)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error.response, reject)
                })
        })
    }

}
export default report

import genericClient from '../genericClient'
import config from '@/config'

class proceedings extends genericClient {
    createProceedings(data) {
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
                .post(this.localSettings.endpoints.proceedings.createProceedings, data)
                .then(response => {
                    resolve(response.data)
                    // if (this.checkResponse(response, reject)) {
                    //     resolve(response)
                    // } else reject()
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error.response.data, reject)
                })
        })
    }
    getProceedingsById(id){
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
                .get(this.localSettings.endpoints.proceedings.getProceedingsById + id)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    submitProceedings(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.proceedings.submitProceedings, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    getResult(id) {
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
                .get(this.localSettings.endpoints.proceedings.getResultProceedings + id)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response.data.data)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    getResultWithEntranceTime(id,meetingId) {
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
                .get(this.localSettings.endpoints.proceedings.getResultProceedingsWithEntranceTime + id + '/' + meetingId)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response.data.data)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    getAllResult(id) {
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
                .get(this.localSettings.endpoints.proceedings.getAllProceedings + id)
                .then(response => {
                    for (let i = 0 ; i< response.data.data.length ; i++){
                        if (response.data.data[i].createdDate){
                            response.data.data[i].createdDate =this.convertDate(response.data.data[i].createdDate)
                        }

                    }
                    if (this.checkResponse(response, reject)) {
                        resolve(response.data.data)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    getResultInPDF(id) {
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
                .get(this.localSettings.endpoints.proceedings.downloadPDF + id + '/pdf')
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response.data.data)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    getMeetingMinutesSignResult(proceedingsId,meetingId) {
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
                .get(this.localSettings.endpoints.proceedings.getMeetingMinutesSignResult + proceedingsId + '/' + meetingId)
                .then(response => {
                    for (let i = 0 ; i< response.data.data.length ; i++){
                        if (response.data.data[i].createdDate){
                            response.data.data[i].createdDate =this.convertDate(response.data.data[i].createdDate)
                        }

                    }
                    if (this.checkResponse(response, reject)) {
                        resolve(response.data.data)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    getPrivateMeetingMinutesSignResult(proceedingsId,meetingId) {
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
                .get(this.localSettings.endpoints.proceedings.getPrivateMeetingMinutesSignResult + proceedingsId + '/' + meetingId)
                .then(response => {
                    for (let i = 0 ; i< response.data.data.length ; i++){
                        if (response.data.data[i].createdDate){
                            response.data.data[i].createdDate =this.convertDate(response.data.data[i].createdDate)
                        }

                    }
                    if (this.checkResponse(response, reject)) {
                        resolve(response.data.data)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}

export default proceedings



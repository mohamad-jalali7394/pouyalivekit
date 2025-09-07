import genericClient from '../genericClient'
import config from '@/config'

class poll extends genericClient {
  createPoll(data) {
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
        .post(this.localSettings.endpoints.polling.createPolling, data)
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
    createSurvey(data) {
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
                .post(this.localSettings.endpoints.polling.createSurvey, data)
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
    submitSurvey(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.polling.submitSurvey, data)
                .then(response => {
                    console.error(response)
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error.response.data, reject)
                })
        })
    }
  submitComment(data) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .post(this.localSettings.endpoints.polling.submitComment, data)
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
        .get(this.localSettings.endpoints.polling.getResultPolling + id)
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
    getPDF(id,fromSchd,toSchd) {
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
                .get(this.localSettings.endpoints.polling.getPDF + 'surveyId=' + id + '&startDate=' + fromSchd + '&endDate=' + toSchd)
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
    getResultSurvey(id) {
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
                .get(this.localSettings.endpoints.polling.getResultSurvey + id)
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
    getAllSurvey(id) {
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
                .get(this.localSettings.endpoints.polling.getAllSurvey + id)
                .then(response => {
                    if (response.data?.data){
                        for (let i = 0 ; i< response.data.data.length ; i++){
                            response.data.data[i].createdAt =this.convertDate(response.data.data[i].createdAt)
                        }
                    }


                    if (this.checkResponse(response, reject)) {
                        resolve(response?.data?.data)
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
        .get(this.localSettings.endpoints.polling.getAllPolling + id)
        .then(response => {
            if (response.data?.data){
                for (let i = 0 ; i< response.data.data.length ; i++){
                    response.data.data[i].createdAt =this.convertDate(response.data.data[i].createdAt)
                }
            }


          if (this.checkResponse(response, reject)) {
            resolve(response?.data?.data)
          } else reject()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  getResultInExcel(id) {
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
        .get(this.localSettings.endpoints.polling.downloadExcel + id)
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


}
export default poll

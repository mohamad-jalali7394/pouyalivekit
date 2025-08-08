import genericClient from '../genericClient'
import axios from 'axios'
import config from '@/config'
import axiosTiming from 'axios-timing'
class history extends genericClient {
    save(data) {

        return new Promise((resolve, reject) => {
          this.axios
            .create({
              baseURL: config.REST_API,
              timeout: this.localSettings.http_request_general_timeout,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.auth.getToken()
              }
            })
            .post(this.localSettings.endpoints.monitoring.save ,data)
            .then(response => {
              if (this.checkResponse(response, reject)) {
            
                resolve(response)
              } else reject()
            })
            .catch((error) => {
              reject(error)
            })
            axiosTiming(axios, console.log)
        })
      }
      getHistory(page,pageSize) {
        return new Promise((resolve, reject) => {
          this.axios
            .create({
              baseURL: config.REST_API,
              timeout: this.localSettings.http_request_general_timeout,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.auth.getToken()
              }
            })
            .get(this.localSettings.endpoints.monitoring.history + `?pageNumber=${page-1}&pageSize=${pageSize}`)
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
      deleteHistory() {
        return new Promise((resolve, reject) => {
          this.axios
            .create({
              baseURL: config.REST_API,
              timeout: this.localSettings.http_request_general_timeout,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.auth.getToken()
              }
            })
            .delete(this.localSettings.endpoints.monitoring.history)
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
}
export default history
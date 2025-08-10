import genericClient from '../genericClient'
import config from '@/config'

class agenda extends genericClient {
    createAgenda(data) {
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
                .post(this.localSettings.endpoints.agenda.agenda, data)
                .then(response => {

                        resolve(response)

                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    editAgenda(data) {
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
                .post(this.localSettings.endpoints.agenda.agenda , data)
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
    deleteAgenda(id) {
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
                .delete(this.localSettings.endpoints.agenda.agenda + id)
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
    getAgenda(id) {
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
                .get(this.localSettings.endpoints.agenda.agenda + id)
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
export default agenda

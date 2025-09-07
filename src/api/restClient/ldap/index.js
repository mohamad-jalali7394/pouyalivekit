import genericClient from '../genericClient'
import config from '../../../config'

class ldap extends genericClient {
    getAll() {
        // console.log(`TOEKN: ${this.auth.getKilid()}`)
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: 120000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.ldapSettings.getAll)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result.data)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error.response, reject)
            })
        })
    }

    getByCustomerId() {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: 120000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.ldapSettings.getByCustomerId)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, true)
                    resolve(result.data)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error, reject)
            })
        })
    }
    create(data, customerId) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: 120000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.ldapSettings.create + customerId, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const ladapSettings = result
                    resolve(ladapSettings)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error, reject)
            })
        })
    }

    update(data, customerId) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: 120000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .put(this.localSettings.endpoints.ldapSettings.update + customerId, data)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const ladapSettings = result
                    resolve(ladapSettings)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error, reject)
            })
        })
    }

    sync(id) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: 120000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.ldapSettings.sync + id)
                .then(response => {
                    console.error(response.data.success)
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const ladapSettings = result
                    resolve(ladapSettings)
                }).catch((response) => {
                this.ApiResponseService.checkResponse(response.errorCodeLists, reject)
            })
        })
    }

    getLdapSyncErrors(id) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: 120000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.ldapSettings.getLdapSyncErrors + id)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const ladapSettings = result
                    resolve(ladapSettings)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error, reject)
            })
        })
    }

    getLdapConfigById(id) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: 120000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.ldapSettings.getById + id)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const ladapSettings = result
                    resolve(ladapSettings.data)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error, reject)
            })
        })
    }
    getLdapPicture(userName,id) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: 120000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.ldapSettings.getLdapPicture + userName + '/' + id ,{responseType: 'arraybuffer' })
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    const ladapSettings = result.data
                    resolve(ladapSettings)
                }).catch((error) => {
                this.ApiResponseService.checkResponse(error, reject)
            })
        })
    }
}

export default ldap

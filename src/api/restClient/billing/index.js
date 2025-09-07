import genericClient from '../genericClient'
import config from '@/config'
class billing extends genericClient {
    getAll(id) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.billing.getCustomerBillingPlanByCustomerId + id)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(
                        response,
                        reject,
                        true
                    )
                    const customer = result.data
                    for (let i = 0; i < customer.data.length; i++) {
                        customer.data[i].startDateTime = this.convertDate(customer.data[i].startDateTime)
                        customer.data[i].endDateTime = this.convertDate(customer.data[i].endDateTime)
                    }
                    resolve(customer)
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
                    baseURL: process.env.BASE_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' +  this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.billing.getBillingPlanById + id)
                .then((response) => {
                    const result = this.ApiResponseService.checkResponse(
                        response,
                        reject,
                        true
                    )
                    result.startDateTime = this.convertDate(result.startDateTime)
                    result.endDateTime = this.convertDate(result.endDateTime)
                    const customer = result
                    resolve(customer)
                })
                .catch((error) => {
                    console.error(error)
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    getContract(id) {
        // console.log(`get customer by id`)
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.billing.getContract + id)
                .then((response) => {
                    const result = this.ApiResponseService.checkResponse(
                        response,
                        reject,
                        true
                    )
                    const customer = result
                    resolve(customer)
                })
                .catch((error) => {
                    console.error(error)
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    create(data,id) {
        return new Promise((resolve, reject) => {
            data.startDateTime = this.convertDateToGeorgianTimeStamp(data.startDateTime)
            data.endDateTime = this.convertDateToGeorgianTimeStamp(data.endDateTime)
            this.axios
                .create({
                    baseURL: process.env.BASE_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' +  this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.billing.create + '/' + id , data)
                .then((response) => {
                    const result = this.ApiResponseService.checkResponse(
                        response,
                        reject,
                        response.data.success
                    )
                    const customer = result.data
                    resolve(customer)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(
                        error.response,
                        reject
                    )
                })
        })
    }
    update(data) {
        return new Promise((resolve, reject) => {
            data.startDateTime = this.convertDateToGeorgianTimeStamp(data.startDateTime)
            data.endDateTime = this.convertDateToGeorgianTimeStamp(data.endDateTime)
            this.axios
                .create({
                    baseURL: process.env.BASE_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' +  this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.billing.update, data)
                .then((response) => {
                    const result = this.ApiResponseService.checkResponse(
                        response,
                        reject,
                        response.data.success
                    )
                    const customer = result.data
                    resolve(customer)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(
                        error.response,
                        reject
                    )
                })
        })
    }
    delete(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: process.env.BASE_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' +  this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.billing.delete, data)
                .then((response) => {
                    const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                    resolve(result.data)
                })
                .catch((error) => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
    getPic() {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: 150000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get('auth-service/ldap/picture/test5000/78',{responseType: 'arraybuffer' })
                .then(response => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}

export default billing

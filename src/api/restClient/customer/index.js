import genericClient from '../genericClient'
import config from '@/config'
class customer extends genericClient {
    getAllCustomer() {
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
                .get(this.localSettings.endpoints.customer.getAll)
                .then(response => {
                    const result = this.ApiResponseService.checkResponse(response, reject)
                    resolve(result.data.data)
                })
                .catch(error => {
                    this.ApiResponseService.checkResponse(error, reject)
                })
        })
    }
}
export default customer


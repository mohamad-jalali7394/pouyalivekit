import genericClient from '../genericClient'
import config from '../../../config'
class auth extends genericClient {
    sendSms(message, phoneNumber) {
        return new Promise((resolve, reject) => {
            let data = {
                message: message,
                phoneNumber: phoneNumber
            }
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.auth.getToken()
                    }
                })
                .post(this.localSettings.endpoints.sms.sendSms, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject(response)
                })
                .catch((error) => {
                    resolve(error.response)
                })
        })
    }
}
export default auth

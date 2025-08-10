import genericClient from '../genericClient'
// import config from '@/config'
import Fingerprint2 from 'fingerprintjs2'
import config from '@/config'
const staticCredentials = {
    basic_username: 'client_id',
    basic_passwrod: 'password'
  }
class testApis extends genericClient {
    login() {
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
                .post(this.localSettings.endpoints.testApis.getToken,{
                  username: 'test1', // gave the values directly for testing
                  password: '123@Abcd',
                  tenant: 'shooka',
                  ldap:'false',
                  grant_type: 'password',
                  deviceId: hash,
                  platform: 'web'
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
      getMySchedule() {
        return new Promise((resolve, reject) => {
          const data = {
            fromSchd: new Date().getTime(),
            toSchd: new Date().getTime()
          }
          this.axios
            .create({
              baseURL: 'https://gw.shooka.com',
              timeout: this.localSettings.http_request_general_timeout,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token_service')
              }
            })
            .post(this.localSettings.endpoints.testApis.getMySchedule, data)
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
    dbCheck() {
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
                .get(this.localSettings.endpoints.testApis.dbHealthCheck)
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
     // TODOwe have to creat schedule before
      iWantToJoin(schedule_id, userId) {
            return new Promise((resolve, reject) => {
            this.axios
              .create({
                baseURL: 'https://gw.shooka.com',
                timeout: this.localSettings.http_request_general_timeout,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token_service')
                }
              })
              .get(this.localSettings.endpoints.testApis.iWantToJoin + schedule_id, { params: { userId: userId, platform: 'web' }})
              // .get(this.localSettings.endpoints.controlMeeting.iWantToJoin + schedule_id)
              .then(response => {
                if (this.checkResponse(response, reject)) {
                  resolve(response.data.data)
                } else reject(response)
              })
              .catch((error) => {
                reject(error)
              })
          })
        }

}
export default testApis

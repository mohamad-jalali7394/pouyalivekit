import ApiErrorService from './api.error.service'
import router from "../router";
import auth from '@/store/auth';
const ApiResponseService = {
  checkResponse: function (response, reject, showSucess) {
    try {
      switch (response.status) {
        case 200:
          if (!showSucess) {
            ApiErrorService.detectError(response.data)
          }
          return response
        case 401:
          ApiErrorService.tokenExpired()
          router.push({
            name: 'Login',
            path: '/login'
          })
          auth.setIsAuthenticated(false)
          // removeRoles()
          // removeToken()
          // removeRefreshToken()
          reject()
          break
        case 403:
          ApiErrorService.accessDenied()
          break
        case 503:
          ApiErrorService.serviceUnavailble()
          break
        default:
          ApiErrorService.detectError(response)
          reject()
      }
    } catch (error) {
      ApiErrorService.detectError(response)
      reject()
    }
  }
}

export default ApiResponseService

export { ApiResponseService }


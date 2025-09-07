class errorHandler {
  constructor(component) {
    this.component = component
  }
  showError(errorCode, callback) {
    if (errorCode === 401 || errorCode === 404) {
      if (this.component === 'Login') {
        callback('نام کاربری یا رمز عبور اشتباه است')
      } else {
        callback('لطفا وارد حساب کاربری خود شوید')
      }
    } else {
      if (this.component === 'Table') {
        callback(errorCode)
      } else {
        callback(errorCode)
      }
    }
  }
}

export default errorHandler

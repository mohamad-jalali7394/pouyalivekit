import axios from 'axios'
import localSettings from '../localSettings/localSettings'
import auth from '../../store/auth/index'
import moment from 'moment'
import momentJalali from 'moment-jalaali'
import ApiErrorService from '../../services/api.error.service'
import ApiResponseService from '@/services/api.response.service'

class genericClient {
  constructor() {
    this.axios = axios
    this.localSettings = localSettings
    this.auth = auth
    this.ApiResponseService = ApiResponseService
  }
  checkResponse(response) {
    switch (response.status) {
      case 200:
        return true
      case 401:
        auth.removeToken()
        return false
      default:
        ApiErrorService.detectError(response)
    }
  }
  convertDate(datefields, format = 'jYYYY/jM/jD HH:mm') {
    if (!datefields) return datefields
    // var n = datefields.toISOString()
    let dateValue = new Date(datefields)
    if (Number.isNaN(dateValue.getMonth())) {
      const arr = datefields.split(/[- :]/)
      dateValue = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
    }
    dateValue.setDate(dateValue.getDate())
    const localTime = moment
      .utc(dateValue)
      .local()
      .format()
    const persianTime = momentJalali(localTime).format(format)
    return persianTime
  }

  convertDateMines(datefields, format = 'jYYYY/jM/jD HH:mm') {
    if (!datefields) return datefields
    // var n = datefields.toISOString()
    let dateValue = new Date(datefields)
    if (Number.isNaN(dateValue.getMonth())) {
      const arr = datefields.split(/[- :]/)
      dateValue = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
    }
    dateValue.setDate(dateValue.getDate() - 7)
    const localTime = moment
        .utc(dateValue)
        .local()
        .format()
    const persianTime = momentJalali(localTime).format(format)
    return persianTime
  }
  convertDateWithZeroTime(datefields, format = 'jYYYY/jM/jD HH:mm') {
    try {
      if (!datefields) return datefields
      const dateValue = new Date(datefields)
      const localTime = moment
          .utc(dateValue)
          .local()
          .startOf('day')
          .format()
      const persianTime = momentJalali(localTime).format(format)
      return persianTime
    } catch (error) {
      console.error(error)
      return datefields
    }
  }

  convertDatePlus(datefields, format = 'jYYYY/jM/jD HH:mm') {
    if (!datefields) return datefields
    // var n = datefields.toISOString()
    let dateValue = new Date(datefields)
    if (Number.isNaN(dateValue.getMonth())) {
      const arr = datefields.split(/[- :]/)
      dateValue = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
    }
    dateValue.setDate(dateValue.getDate() + 7)
    const localTime = moment
      .utc(dateValue)
      .local()
      .format()
    const persianTime = momentJalali(localTime).format(format)
    return persianTime
  }
  convertMonthMines(datefields, format = 'jYYYY/jM/jD HH:mm') {
    try {
      if (!datefields) return datefields
      const dateValue = new Date(datefields)
      dateValue.setDate(dateValue.getMonth() - 3)
      const localTime = moment
          .utc(dateValue)
          .local()
          .format()
      const persianTime = momentJalali(localTime).format(format)
      return persianTime
    } catch (error) {
      console.error()
      return datefields
    }
  }
  convertDateToGeorgian(persian) {
    try {
      persian = momentJalali(persian, 'jYYYY/jM/jD HH:mm')
      persian.format('YYYY/M/D HH:mm')
      const localTime = moment
        .utc(persian)
        .local()
        .format()
      return localTime
    } catch (error) {
      return null
    }
  }
  convertDateToGeorgianTimeStamp(persian) {
    try {
      persian = momentJalali(persian, 'jYYYY/jM/jD HH:mm')
      persian.format('YYYY/M/D HH:mm')
      const localTime = moment
        .utc(persian)
        .local()
        .format('x')
      // const time = new Date(persian)
      // console.error(time.getTime().toString())
      // console.error(localTime)
      // console.error(Date.parse(persian))
      // console.error(time.toUTCString())
      return localTime
    } catch (error) {
      return null
    }
  }
  convertDateToGeorgianTimeStampWithZeroTime(persian) {
    try {
      persian = momentJalali(persian, 'jYYYY/jM/jD HH:mm')
      persian.format('YYYY/M/D HH:mm')
      const localTime = moment
        .utc(persian)
        .local()
        .startOf('day')
        .format('x')
      return localTime
    } catch (error) {
      return null
    }
  }
}
export default genericClient

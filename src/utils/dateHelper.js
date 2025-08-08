import moment from 'moment-jalaali'

class DateHelper {
  isGreaterEqual(first, second) {
    const first_date = moment(first, 'jYYYY/jM/jD HH:mm')
    const second_date = moment(second, 'jYYYY/jM/jD HH:mm')
    if (first_date.jYear() > second_date.jYear()) return true
    else if (first_date.jYear() < second_date.jYear()) return false
    else {
      if (first_date.jMonth() > second_date.jMonth()) return true
      else if (first_date.jMonth() < second_date.jMonth()) return false
      else {
        if (first_date.jDate() > second_date.jDate()) return true
        else if (first_date.jDate() < second_date.jDate()) return false
        else {
          if (first_date.hour() > second_date.hour()) return true
          else if (first_date.hour() < second_date.hour()) return false
          else {
            if (first_date.minutes() < second_date.minutes()) return false
            else return true
          }
        }
      }
    }
  }
  isGreater(first, second) {
    const first_date = moment(first, 'jYYYY/jM/jD HH:mm')
    const second_date = moment(second, 'jYYYY/jM/jD HH:mm')
    if (first_date.jYear() > second_date.jYear()) return true
    else if (first_date.jYear() < second_date.jYear()) return false
    else {
      if (first_date.jMonth() > second_date.jMonth()) return true
      else if (first_date.jMonth() < second_date.jMonth()) return false
      else {
        if (first_date.jDate() > second_date.jDate()) return true
        else if (first_date.jDate() < second_date.jDate()) return false
        else {
          if (first_date.hour() > second_date.hour()) return true
          else if (first_date.hour() < second_date.hour()) return false
          else {
            if (first_date.minutes() < second_date.minutes()) return false
            else if (first_date.minutes() === second_date.minutes()) return false
            else return true
          }
        }
      }
    }
  }
  getTimeFromJalali(date) {
    const moment_time = moment(date, 'jYYYY/jM/jD HH:mm')
    if (moment_time) return moment_time.hour() + ':' + moment_time.minutes()
    else return ''
  }
  getDateFromJalali(date) {
    try {
      const moment_date = moment(date, 'jYYYY/jM/jD HH:mm')
      if (moment_date) return moment_date.jYear() + '/' + (moment_date.jMonth() + 1) + '/' + moment_date.jDate()
      else return ''
    } catch (error) {
      console.warn('invalid year')
    }
  }
}
export default DateHelper


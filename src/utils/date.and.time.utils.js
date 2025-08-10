import moment from 'moment-jalaali';
class DateAndTimeUtilities {
    dateFormat = 'jYYYY/jM/jD HH:mm';
    constructor(date = null) {
        if(date){
            this.date = moment(date, this.dateFormat);
        } else {
            this.date = moment();
        }
    }
    getACustomDateFromOriginal(signal, magnitude, futureOrPast){
        const methodName = (futureOrPast === 'future')? 'add' : 'subtract';
        switch (signal){
            case 'day' :
                this.date[methodName](magnitude, 'day'); break;
            case 'week' :
                this.date[methodName](magnitude * 7, 'day'); break;
            case 'month' :
                this.date[methodName](magnitude, 'jMonth'); break;
            case 'year' :
                this.date[methodName](magnitude, 'jYear'); break;
            default : return;
        }
        return this.formatDate();
    }
    formatDate(){
        return this.date.format(this.dateFormat);
    }
}
export default DateAndTimeUtilities;
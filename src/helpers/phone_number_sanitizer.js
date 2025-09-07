export default (phoneNumber) => {
    let sanitizedPhoneNumber = phoneNumber;
    if(phoneNumber.toString()[0] === '0' && phoneNumber.toString()[1] === '9'){
        sanitizedPhoneNumber = phoneNumber.toString().substring(1);
    }
    return parseInt(sanitizedPhoneNumber)
}
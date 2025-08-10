import Cookies from 'js-cookie'
import CryptoJS from "crypto-js";

const TokenKey = 'Token'
const RefreshKey = 'Refresh-Token'
const UserIdKey = 'User-Id'
const UserDisplayNameKey = 'User-DisplayName'
const TenantKey = 'Tenant'
const UserFirstNameKey = 'User-FirstName'
const UserLastNameKey = 'User-LastName'
const Mobile = 'mobile'
const Email = 'Email'
const isAuthenticated = 'is-authenticated'
const GuestURL = 'GuestURL'
const toSchd = 'toSchd'
const LDAPID = 'LDAPID'
const imgSrc = 'imgSrc'
const userName = 'userName'
const Gender = 'gender'
const hasModerator = 'has-moderator'
const vrAddress = 'vrAddress'
const customerId = 'customerId'
const privateRoomId = 'privateRoomId'
export default {

    getIsAuthenticated() {
        return Cookies.get(isAuthenticated)
    },
    setIsAuthenticated(is) {
        return Cookies.set(isAuthenticated, is)
    },
    getMobile() {
        return Cookies.get(Mobile)
    },
    setMobile(mobile) {
        return Cookies.set(Mobile, mobile)
    },
    setLDAPId(id) {
        return Cookies.set(LDAPID, id)
    },
    setImgSrc(src) {
        return Cookies.set(imgSrc, src)
    },
    setUserName(username) {
        return Cookies.set(userName, username)
    },
    getEmail() {
        return Cookies.get(Email)
    },
    getLDAPID() {
        return Cookies.get(LDAPID)
    },
    getLImgSrc() {
        return Cookies.get(imgSrc)
    },
    getUserName() {
        return Cookies.get(userName)
    },
    setEmail(email) {
        return Cookies.set(Email, email)
    },
    getKilid() {
        if (Cookies.get(TokenKey))
            return CryptoJS.AES.decrypt(Cookies.get(TokenKey), "AliAmirReza1994pouya").toString(CryptoJS.enc.Utf8)
        else return ''
    },
    getRefreshKilid() {
        if (Cookies.get(TokenKey))
            return CryptoJS.AES.decrypt(Cookies.get(RefreshKey), "AliAmirReza1994pouya").toString(CryptoJS.enc.Utf8)
        else return ''
    },

    getUserId() {
        return Cookies.get(UserIdKey)
    },
    getGender() {
        return Cookies.get(Gender)
    },
    getHasModerator() {
        return Cookies.get(hasModerator)
    },
    getFirstName() {
        return Cookies.get(UserFirstNameKey)
    },
    getLastName() {
        return Cookies.get(UserLastNameKey)
    },

    getDisplayName() {
        return Cookies.get(UserDisplayNameKey)
    },

    getTenant() {
        return Cookies.get(TenantKey)
    },
    getVrAddress() {

        return Cookies.get(vrAddress)
    },

    setkilid(token) {
        const encryptedText = CryptoJS.AES.encrypt(token, "AliAmirReza1994pouya").toString()
        return Cookies.set(TokenKey, encryptedText)
    },
    getGuestURL() {
        return Cookies.get(GuestURL)
    },
    getCustomerId() {
        return Cookies.get(customerId)
    },
    getPrivateRoomId() {
        return Cookies.get(privateRoomId)
    },
    getToSchd() {
        return Cookies.get(toSchd)
    },
    setRefreshkilid(token) {
        const encryptedText = CryptoJS.AES.encrypt(token, "AliAmirReza1994pouya").toString()
        return Cookies.set(RefreshKey, encryptedText)
    },


    setUserId(userId) {
        return Cookies.set(UserIdKey, userId)
    },

    setDisplayName(displayName) {
        return Cookies.set(UserDisplayNameKey, displayName)
    },
    setFirstName(firstName) {
        return Cookies.set(UserFirstNameKey, firstName)
    },
    setLastName(lastName) {
        return Cookies.set(UserLastNameKey, lastName)
    },

    setTenant(tenant) {
        return Cookies.set(TenantKey, tenant)
    },
    setGuestUR(URL) {
        return Cookies.set(GuestURL, URL)
    },
    setCustomerId(id) {
        return Cookies.set(customerId, id)
    },
    setPrivateRoomId(id) {
        return Cookies.set(privateRoomId, id)
    },
    setToSchd(time) {
        return Cookies.set(toSchd, time)
    },
    setGender(gender) {
        return Cookies.set(Gender, gender)
    },
    setHasModerator(hasModerator) {
        return Cookies.set(hasModerator, hasModerator)
    },
    setVrAddress(vr) {
        return Cookies.set(vrAddress, vr)
    },
    removeToken() {
        return Cookies.remove(TokenKey)
    },

    wrongTenant() {
        this.showTenantErrorMsg()
    },

    wrongAccessDenied() {
        this.showAccessDeniedtErrorMsg()
    },

    removeRefreshToken() {
        return Cookies.remove(RefreshKey)
    },


    removeUserId() {
        return Cookies.remove(UserIdKey)
    },

    removeDisplayName() {
        return Cookies.remove(UserDisplayNameKey)
    },
    removeFirstName() {
        return Cookies.remove(UserFirstNameKey)
    },
    removeLastName() {
        return Cookies.remove(UserLastNameKey)
    },
    removeTenant() {
        return Cookies.remove(TenantKey)
    },
    removeGender() {
        return Cookies.remove(Gender)
    },
    removeUserName() {
        return Cookies.remove(userName)
    },
}

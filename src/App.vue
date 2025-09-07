<template>
    <router-view></router-view>
  <base-notification ref="notification"></base-notification>
</template>

<script>
import BaseNotification from "./components/UI/BaseNotification";
// import config from "@/config";
export default {
  name: 'App',
  components:{BaseNotification},
  data(){
    return {
      roomName : '',
      participantName : '',
      showNotification : false,
      notificationInfo : {
        title : '',
        type : '',
        bodyText : '',
        time : '',
        isMobile : true,
        backGroundColor:null,
        color:null,
        id:null,
        styleClass:null,
      },
      allNotifications:[],
      styleClass:{},
      timeIsUp: false,
    }
  },
  methods : {
    getData(roomName, participantName){
      this.roomName = roomName;
      this.participantName = participantName;
      this.$router.push('/conference');

    },



  },
  mounted() {
    this.$store.dispatch('setI18NTextHandler', this.$t);
    setTimeout(()=>{
      window.scrollTo(0,1)
    },1000)
    if (localStorage.getItem('language') === 'فارسی . Fa'){
      this.$i18n.locale = 'fa'
    } else if ( localStorage.getItem('language') === 'انگلیسی . En') {
      this.$i18n.locale = 'en'
    }else{
      this.$i18n.locale = 'fa'
    }
    this.eventBus.on('change-language',()=>{
      if (localStorage.getItem('language') === 'فارسی . Fa'){
        this.$i18n.locale = 'fa'
      } else if ( localStorage.getItem('language') === 'انگلیسی . En') {
        this.$i18n.locale = 'en'
      }else{
        this.$i18n.locale = 'fa'
      }
    })
    this.eventBus.on('notification', (receivedNotifInfo) => {
      let color = null
      let backGroundColor = null
      if (receivedNotifInfo.type === 'error'){
        color = '#EC3737'
        backGroundColor = '#eeb4b4'
        this.styleClass = {'notification-body--error' : true}
      }else if (receivedNotifInfo.type === 'warning'){
        color = '#FFA024'
        backGroundColor = '#f1dec7'
        this.styleClass = {'notification-body--warn' : true}
      }else if (receivedNotifInfo.type === 'success') {
        color = '#2AB459'
        backGroundColor = '#caf1d7'
        this.styleClass = {'notification-body--success' : true}
      }else {
        color = '#246fe5'
        backGroundColor = '#c5d4e8'
      }
      this.notificationInfo.title = receivedNotifInfo.title;
      this.notificationInfo.type = receivedNotifInfo.type;
      this.notificationInfo.bodyText = receivedNotifInfo.bodyText;
      this.notificationInfo.time = 50000000000
      this.notificationInfo.color = color
      this.notificationInfo.backGroundColor = backGroundColor
      this.notificationInfo.styleClass = this.styleClass
      this.$refs.notification.addNotification(this.notificationInfo);
    })
  }
}
</script>

<style>
@import url("./assets/fonts/YekanFont/css/fontiran.css");

* {
  box-sizing: inherit;
  /*direction: rtl;*/
  padding: 0;
  margin: 0;
  font-family: inherit;
}
ul{
  list-style: none;
}
html {
  font-size: 62.5%;
  font-family: iranyekan, roboto, Arial;
  /*overflow:hidden;*/
  /*position: fixed;*/
}
body {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  overflow:hidden;
  position: fixed;
  user-select: none;
}
textarea {
  resize: none;
}
textarea:focus {
outline: none;
  border: solid 0.1rem #1a73e8;
}
@media only screen and (min-width: 250px) and (max-width: 1000px){
  body{
    overflow: auto;
  }
}
#app{
  width: 100%;
  height: 100%;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active{
  -webkit-box-shadow: 0 0 0 3rem white inset !important;
}
.header-close-icon{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.header-close-icon > div{
  font-size: 1.6rem;
  cursor: pointer;
}
span.vpd-input-group{
  border: .1rem solid white;
  border-radius: 1rem;
}
.vpd-icon-btn{
  border-radius: 0 1rem 1rem 0;
}
input[placeholder].form-control{
  border-radius: 1rem 0 0 1rem;

}
.vpd-input-group{
  direction: rtl ;
}
.pagination-container{
  display: flex;
  flex-direction: row;
  list-style-type: none;
  gap: 0.4rem;
  align-items: center;
}

.page-link-class {
  width: 3.2rem;
  height:3.2rem;
  border: 0.1rem solid #F2F2F2;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
}
.prev-link-pagination {
  cursor: pointer;
}
.page-link {
  cursor: pointer;
}
.break-view-pagination {
  border: none;
  cursor: auto;

}
.active-classs {
  width: 3.2rem;
  height: 3.2rem;
  border: 0.1rem solid #F2F2F2;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  color: white;
  background-color: #1B76FF ;
}
.disabled-pagination {
  cursor: not-allowed;
}
.prev-list-pagination{
  width: 5rem;
  display: flex;
  flex-direction: row-reverse;
  cursor: pointer;
  color: transparent;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
.next-class-pagination{
  width: 5rem;
  display: flex;
  flex-direction: row-reverse;
  cursor: pointer;
  color: transparent;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
.cropper{
  width: 250px;
  height: 250px;
  position: relative;

}
.preview {
  border: dashed 2px white ;
}
</style>

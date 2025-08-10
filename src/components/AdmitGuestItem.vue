<template>
<li :class=" $i18n.locale === 'fa' ? 'admit-guest-item--container' : 'admit-guest-item--container-ltr' ">
  <span @click="rejectGuest">{{$store.getters.t('reject')}}</span>
  <span @click="admitGuest"> {{$store.getters.t('admit')}}</span>
  <div>
    <span  style="  width: 4rem;height: 4rem;display: flex;justify-content: center;align-items: center;background-color: #00A9FF;border-radius: 50%;color: white;font-size: 1.3rem">
      {{userName.toUpperCase().split('')[0]}}
    </span>
    <span class="guest-username">{{userName}}</span>
<!--    <span>{{$store.getters.t('want-join-room')}}</span>-->
  </div>
</li>
</template>

<script>
export default {
  name: "AdmitGuestItem",
  props:["userName","socketId"],
  methods:{
    rejectGuest(){
      this.$emit('reject-guest',this.socketId)
    },
    admitGuest(){
      this.$emit('admit-guest',this.socketId)
    }
  }
}
</script>

<style scoped>
.admit-guest-item--container{
  display: flex;
  flex-direction: row;
  justify-content: right;
  align-items: center;
  width: 100%;
  height: 6rem;
  padding: 0 0.5rem;
  border: solid 1px #c5c6c7;
  border-radius: 1rem;
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  box-shadow: -1px 1px 5px 0px rgba(0,0,0,0.75);
  -webkit-box-shadow: -1px 1px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: -1px 1px 5px 0px rgba(0,0,0,0.75);
}
.admit-guest-item--container > div {
  width: 65%;
  height: 100%;
  text-align: right;
  display: flex;
  font-size: 1.3rem;
  flex-direction: row-reverse;
  align-items: center;

}
.admit-guest-item--container > span {
  width: 15%;
  height: 100%;
  margin: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #00A9FF;
}
.admit-guest-item--container > span:hover {
  color: #175f83;
}
.admit-guest-item--container-ltr {
  display: flex;
  flex-direction: row-reverse;
  justify-content: left;
  align-items: center;
  width: 100%;
  height: 6rem;
  padding: 0 0.5rem;
  border: solid 1px #c5c6c7;
  border-radius: 1rem;
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  box-shadow: -1px 1px 5px 0px rgba(0,0,0,0.75);
  -webkit-box-shadow: -1px 1px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: -1px 1px 5px 0px rgba(0,0,0,0.75);
}
.admit-guest-item--container-ltr > div {
  width: 60%;
  height: 100%;
  text-align: left;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1.3rem;

}
.admit-guest-item--container-ltr > span {
  width: 15%;
  height: 100%;
  margin: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #00A9FF;
}
.admit-guest-item--container-ltr > span:hover {
  color: #175f83;
}
.guest-username{
  margin: 0.4rem;  white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 15rem;direction: rtl
}
@media (max-width: 500px){
  .admit-guest-item--container > div {
    font-size: 1.1rem;
  }
  .admit-guest-item--container > span {
   font-size: 1.1rem;
  }
  .guest-username{
    margin: 0.4rem;  white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 10rem;direction: rtl
  }


}
</style>
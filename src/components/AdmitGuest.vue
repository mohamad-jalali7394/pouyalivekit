<template>
<div class="admit--container">
<div :class=" $i18n.locale === 'fa' ?  'admit--container-header' : 'admit--container-header-ltr'">
{{$store.getters.t('room-permission')}}
</div>
  <div class="admit--container-body">
    <ul>
      <admit-guest-item v-for="guest in guests" :key="guest.socketId" :user-name="guest.username" :socket-id="guest.socketId" @admit-guest="admitGuest" @reject-guest="rejectGuest"></admit-guest-item>
    </ul>
  </div>
  <div v-if="guests.length > 1" class="admit--container-actions">
    <span @click="admitAllGuest">{{$store.getters.t('admit-all')}}</span>
    <span @click="rejectAllGuest">{{$store.getters.t('reject-all')}}</span>
  </div>
</div>
</template>

<script>
import AdmitGuestItem from "./AdmitGuestItem";
export default {
  name: "AdmitGuest",
  components:{AdmitGuestItem},
  props:["guests"],
  watch: {
  },
  methods:{
    closeAdmitComponent() {
      this.$emit('close-admit-component')
    },
    admitGuest(id){
      this.$emit('admit-guest',id)
    },
    rejectGuest(id){
      this.$emit('reject-guest',id)
    },
    admitAllGuest(){
      this.$emit('admit-all-guest')
    },
    rejectAllGuest(){
      this.$emit('reject-all-guest')
    },
  }
}
</script>

<style scoped>
.admit--container{
  width: 45rem;
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: none;
  border-radius: 1rem;
  padding: 1rem;
}
.admit--container-header {
  width: 100%;
  height: 4rem;
  text-align: right;
  font-size: 1.3rem;
}
.admit--container-header-ltr{
  width: 100%;
  height: 4rem;
  text-align: left;
  font-size: 1.3rem;
}
.admit--container-body{
  width: 100%;
  max-height: 30rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.admit--container-actions{
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  gap: 5rem;
  height: 5rem;
  align-items: center;
}
.admit--container-actions > span {
  color: #00A9FF;
  cursor: pointer;
  font-size: 1.3rem;
}
.admit--container-actions > span:hover {
  color: #175f83;

}
@media (max-width: 500px){
  .admit--container {
    width: 85vw;
  }
  .admit--container-actions{
    justify-content: space-around;
  }
  .admit--container{
    top: 3.1rem;
  }
}
</style>
<template>
  <div class="login-container">
    <input type="text" v-model="roomName">
    <input type="text" v-model="participantName">
    <button @click="goToConference">conference</button>
  </div>
</template>
<script>
export default {
  name : 'TestLogin',
  data() {
    return {
      roomName : '',
      participantName : ''
    }
  },
  methods : {
    goToConference(){
      this.$emit('data', this.roomName, this.participantName);
    }
  }
}
</script>
<style scoped>
.login-container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
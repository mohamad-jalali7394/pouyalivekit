
<template>
  <div class="record-meeting__badge">
    <div>در حال ضبط جلسه</div>
    <div>
      <span v-if="hoursCounter > 0">{{hoursForRendering}}</span>
      <span v-if="hoursCounter > 0">:</span>
      <span>{{minutesForRendering}}</span>
      <span>:</span>
      <span>{{secondsForRendering}}</span>
    </div>
    <img draggable="false" src="/img/record-end.svg" alt="not-loaded">
  </div>
</template>

<script>
export default {
  name: "RecordMeetingNotification",
  data(){
    return{
      hoursCounter:0,
      minutesCounter:0,
      secondsCounter:0,
      timerInterval : null,
    }
  },

  computed: {
    secondsForRendering(){
      return (this.secondsCounter.toString().length === 1)? ('0' + this.secondsCounter) : this.secondsCounter;
    },
    minutesForRendering(){
      return (this.minutesCounter.toString().length === 1)? ('0' + this.minutesCounter) : this.minutesCounter;
    },
    hoursForRendering(){
      return (this.hoursCounter.toString().length === 1)? ('0' + this.hoursCounter) : this.hoursCounter;
    },
  },
  mounted() {
    setInterval(() => {if(this.secondsCounter ===  59){
      this.secondsCounter = 0
      this.minutesCounter++
    }else {
      this.secondsCounter++
    }
    }, 1000)
  }
}
</script>
<style scoped>
.record-meeting__badge{
  display: flex;
  flex-direction: row;
  direction: rtl;
  gap: 1.2rem;
  padding:  0.8rem;
  background-color: white;
  border-radius: 2.4rem;
  position: absolute;
  left: 1rem;
  top: 1rem;
  align-items: center;
}
</style>

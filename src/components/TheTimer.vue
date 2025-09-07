<template>
  <div class="timer">
  {{minutesForRendering}}:{{secondsForRendering}}
  </div>
</template>

<script>
export default {
  props: ['minutes', 'seconds', 'startFlag'],
  emits : ['timer-status'],
  data(){
    return{
      minutesCounter: 1,
      timerIntervalId : null,
      secondsCounter: 59,
    }
  },
  watch : {
    startFlag : {
      immediate : true,
      handler(currentVal){
        if(currentVal){
          this.startTimer();
        } else {
          console.error('stoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooop')
          this.stopTimer();
        }
      }
    },
    minutes : {
      immediate: true,
      handler(currentVal) {
        this.minutesCounter = parseFloat(currentVal);
      }
    },
    seconds : {
      immediate : true,
      handler(currentVal){
        this.secondsCounter = parseFloat(currentVal);
      }
    }
  },
  computed:{
    secondsForRendering(){
      return (this.secondsCounter.toString().length === 1)? ('0' + this.secondsCounter) : this.secondsCounter;
    },
    minutesForRendering(){
      return (this.minutes.toString().length === 1)? ('0' + this.minutesCounter) : this.minutesCounter;
    }
  },
  methods : {
    startTimer(){
      // this.$emit('timer-status', true);
      this.timerIntervalId = setInterval(() => {
        console.error('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
        if(this.secondsCounter === 0){
          if(this.minutesCounter > 0){
            this.minutesCounter -= 1;
            this.secondsCounter = 60;
          } else {
            clearInterval(this.timerIntervalId);
            this.$emit('timer-status', false);
          }
        }
        if(this.secondsCounter !== 0){
          this.secondsCounter -= 1;
        }
      }, 1000)
    },
    stopTimer(){
      clearInterval(this.timerIntervalId);
      this.$emit('timer-status', false);
    }
  },
  mounted(){
  },
}
</script>

<style scoped>
.timer{
  margin-right: 1rem;
  color: rgba(0, 0, 0, 0.8);
  font-size: 1.2rem;
  color: #75758F;

  display: flex;
  flex-direction: row;
  gap: 0.8rem;
}
</style>

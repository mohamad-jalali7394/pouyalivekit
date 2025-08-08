<template>
<div class="event-pop-over-fragment">
 <div class="event-pop-over-header">
   <img draggable="false" src="/img/close.svg" style="width: 24px; height: 24px;position: relative;top: -1rem;cursor: pointer" alt="not loaded" @click="closePopOver">
<div style="display: flex;flex-direction: column;justify-content:center;align-items: center;width: 100%;position: relative;top: -1rem">
  <span style="color: #1B76FF;font-size: 1.4rem;">{{ date[1] }}</span>
  <span style="font-size: 1.4rem;width: 3rem;height: 3rem;background-color: #1B76FF;border-radius: 50%;color: white;display: flex;justify-content: center;align-items: center">{{ date[0] }}</span>
</div>
 </div>
  <div class="event-pop-over-body">
    <ul class="event-pop-over-ul">
      <li v-for="segment in allSegs" :key="segment.event._def.extendedProps.id" class="event-pop-over-list" :style="{'background-color':segment.event._def.extendedProps.isPast ?  '#5392F2' : '#A6C4F6' }" @click="clickToPopOverList(segment.event._def.extendedProps)">
        <span>{{segment.event._def.extendedProps.eventTime}}</span>
       <span style=" max-width: 9rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;direction: rtl"> {{segment.event._def.extendedProps.title}}</span>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
// import momentJalaali from "moment-jalaali";
export default {
  name: "EventPopOver",
  props:['allSegs'],
  data(){
    return {
      date:[]
    }
  },
  methods:{
    closePopOver(){
      this.$emit('close-pop-over')
    },
    clickToPopOverList(eventInfo){
      this.$emit('click-to-pop-over',eventInfo)
    }
  },
  mounted() {
    console.error('popppppp-overrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
    // console.error(momentJalaali(this.allSegs[0].start).format)
      this.date = (new Intl.DateTimeFormat('fa-IR', {dateStyle: 'full', timeStyle: 'long'}).format(new Date(this.allSegs[0].start))).toString().split('ساعت')[0].split(',')
      this.date[0] = (new Intl.DateTimeFormat('fa-IR', {dateStyle: 'full', timeStyle: 'long'}).format(new Date(this.allSegs[0].start))).toString().split('ساعت')[0].split(',')[0].split(' ')[2]
  }
}
</script>

<style scoped>
.event-pop-over-fragment {
  width: 24rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  padding: 1.6rem 0.8rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  -webkit-box-shadow: 0px 0px 9px 1px rgba(0,0,0,0.26);
  -moz-box-shadow: 0px 0px 9px 1px rgba(0,0,0,0.26);
  box-shadow: 0px 0px 9px 1px rgba(0,0,0,0.26);
}
.event-pop-over-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.event-pop-over-body{
  width: 100%;
}
.event-pop-over-ul {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0 1.2rem;
  max-height:15rem;
  overflow-y: scroll;
}
.event-pop-over-list{
  width: 100%;
  border: 0.1rem solid transparent;
  border-radius: 0.3rem;
  display: flex;
  flex-direction: row-reverse;
  gap: 1rem;
  align-items: center;
  padding: 0.4rem 1.6rem;
  color: white;
  cursor: pointer;

}
</style>
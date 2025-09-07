<template>
  <header class="schedule-card__header">
    <hr>
    <h2>{{title}}</h2>
<!--    <h2 class="mobile__header">{{title}}</h2>-->
    <div v-if="hasButton" class="schedule-card__create-private-meeting">
      <span class="button-side">

      </span>
      <base-button
          :is-active="true"
          button-inner-txt="ایجاد جلسه خصوصی"
          :continuous-params="
          [
              'background-color=#1a73e8',
               'color=white',
               'font-weight=bold',
               'font-size=1.1rem',
               'white-space=nowrap'
          ]"
          :style-types="
          [
              'button--small',
               'button--curved'
          ]"
          @click="openPrivateMeetingCreation"
      ></base-button>
    </div>

  </header>
</template>

<script>
import BaseButton from "./BaseButton";
export default {
  name: "BaseScheduleHeader",
  components: {BaseButton},
  props : ['title','hasButton'],
  emits : ['private-meeting-creation'],
  // inject:['isMobile'],
  methods:{
    openPrivateMeetingCreation(){
      this.$emit('private-meeting-creation');
    }
  }
}
</script>

<style scoped>
h2{
  background-color: #f6f6f6;
  padding: 0 1.3rem;
  font-size: 1.5rem;
  font-weight: bold;
  position: absolute;
  top : 50%;
  right: 0;
  z-index: 1;
  transform: translateY(-50%);
}
.schedule-card__header{
  position: relative;
  width: 100%;
  padding : 0 1.3rem;
  margin-bottom: 1.3rem;

}
.schedule-card__create-private-meeting{
  position: absolute;
  top : 50%;
  left: 0;
  z-index: 1;
  transform: translateY(-50%);
  width: 2rem;
}
.button-side{
  background-color: #f6f6f6;
  position: absolute;
  width: 1.5rem;
  height: 100%;
  right: -2rem;
}
.mobile__header{
  background-color: white;
  padding: 0 1.3rem;
  font-size: 1.5rem;
  font-weight: bold;
  position: absolute;
  top : 50%;
  right: 0;
  z-index: 1;
  transform: translateY(-50%);
}
@media (max-width: 824px) {
  /*h2{*/
  /*  background-color: #f6f6f6;*/
  /*  padding: 0 1.3rem;*/
  /*  font-size: 1.5rem;*/
  /*  font-weight: bold;*/
  /*  position: absolute;*/
  /*  top : 0;*/
  /*  right: 0;*/
  /*  z-index: 1;*/
  /*  transform: translateY(15%);*/
  /*}*/
}
</style>

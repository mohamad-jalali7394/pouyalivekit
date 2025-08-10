<template>
  <div class="schedule-card">
    <base-schedule-header @button-clicked="openPrivateMeetingCreation" :title="headerTitle" :has-button="hasButton">
    </base-schedule-header>
    <div class="schedule-card__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BaseScheduleHeader from "./BaseScheduleHeader";



export default {
  name: "BaseScheduleCard",
  components: {BaseScheduleHeader},
  props : ['headerTitle','hasButton'],
  emits : ['private-meeting-creation'],
  methods:{
    openPrivateMeetingCreation(){
      this.$emit('private-meeting-creation');
    }
  }
}
</script>

<style scoped>
.schedule-card{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.schedule-card__body{
  width: 100%;
  height: calc(100% - 3.4rem);
  background-color: #ffffff;
  border-radius: 1.2rem;
  box-shadow: .3rem .3rem 1.2rem 0 rgba(0, 0, 0, 0.16);

}
@media(max-width: 824px) {
  .schedule-card{
    width: 100%;
    height: 25rem;
    display: flex;
    flex-direction: column;
    margin-top: 2rem;

  }

}
</style>
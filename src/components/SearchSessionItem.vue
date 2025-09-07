<template>
  <li v-for="event in addedEvents" :key="event.id"
      :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" class="added-events-list"
      @mousedown="openFoundEvent(event)">
    <div>{{event.extendedProps.title}}</div>
    <div style="display: flex;gap: 0.8rem">
      <span>{{event.extendedProps.eventDayName + ' ' + event.extendedProps.eventDay + ' ' + event.extendedProps.eventMonth}}</span>
      <span>{{$store.getters.t('session-time', {'time': event.extendedProps.eventTime})}}</span>
    </div>
  </li>
</template>

<script>
export default {
  name: "SearchSessionItem",
  props:["addedEvents"],
  methods:{
    openFoundEvent(event){
      this.eventBus.emit('open-found-event', event)
    }
  }
}
</script>

<style scoped>
.added-events-list {
  width: 100%;
  height: 5rem;
  border: 0.1rem solid transparent;
  margin-bottom: 0.5rem;
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: flex-start;
  justify-content: space-around;
  padding: 0.8rem 1.6rem;
  cursor: pointer;
  font-size: 1.3rem;
  background-color: #F6F6F7;
  font-size: 1.2rem;
}
</style>
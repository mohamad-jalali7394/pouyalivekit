<template>
<div class="schedules">
  <slot></slot>
</div>
</template>

<script>
export default {
  name: "SchedulesFragment"
}
</script>

<style scoped>
.schedules {
  width: 100%;
  height: calc(100% - 8.8rem);
  padding: 3.5rem 5.1rem;
  background-color: #f6f6f6;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
}
@media (max-width: 1124px) {
  .schedules {
    flex-direction: column;
    align-items: center;
    height: calc(100vh - 8.8rem);
    overflow-y: auto;
  }
}
@media (max-width: 540px) {
  .schedules {
    flex-direction: column;
    align-items: center;
    height: calc(100vh - 8.8rem);
    overflow-y: auto;
    padding: 3.5rem 1rem;
  }

}
</style>
<template>
  <div class="confirm-optional-polling__container">
<confirm-optional-polling-element v-for="(polling, index) in allOptionalPolling" :key="polling.pollingId + index" :index="index" :all-optional-polling="allOptionalPolling" :polling-number="allOptionalPolling.length - index" :polling="polling"></confirm-optional-polling-element>
  </div>
</template>

<script>


import ConfirmOptionalPollingElement from "@/components/ConfirmOptionalPollingElement.vue";

export default {
  name: "ConfirmOptionalPolling",
  components: {ConfirmOptionalPollingElement},
  props:["allOptionalPolling"],
}
</script>
<style scoped>
.confirm-optional-polling__container{
  width: 95%;
  height: 100%;
  position: relative;
  left: 2.5%;
  display: flex;
  flex-direction: column;
  direction: rtl;
  gap: 1.6rem;
  padding: 0.8rem 0;
  margin-top: 0.1rem;
}
</style>

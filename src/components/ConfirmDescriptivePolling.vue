<template>
  <div class="confirm-descriptive-polling__container" >
    <confirm-descriptive-polling-element v-for="(polling, index) in allDescriptivePolling" :key="polling.pollingId + index" :polling="polling" :polling-number="allDescriptivePolling.length - index" :all-descriptive-polling="allDescriptivePolling"></confirm-descriptive-polling-element>
  </div>
</template>

<script>


import ConfirmDescriptivePollingElement from "@/components/ConfirmDescriptivePollingElement.vue";

export default {
  name: "ConfirmDescriptivePolling",
  components: {ConfirmDescriptivePollingElement},
  props:["allDescriptivePolling"],

}
</script>
<style scoped>
.confirm-descriptive-polling__container{
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  direction: rtl;
  margin-top: 0.1rem;

}

</style>

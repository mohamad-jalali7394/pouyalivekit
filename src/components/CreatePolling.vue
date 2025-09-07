<template>
  <create-optional-polling v-if="whichPollingItem === $store.getters.t('multiple-choice-polling')" :all-polling-created="allPollingCreated" :am-i-guest-user="amIGuestUser"></create-optional-polling>
  <create-descriptive-polling v-else :all-polling-created="allDescriptivePollingCreated" :am-i-guest-user="amIGuestUser"></create-descriptive-polling>

</template>


<script>
import CreateOptionalPolling from "@/components/CreateOptionalPolling.vue";
import CreateDescriptivePolling from "@/components/CreateDescriptivePolling.vue";

export default {
  name: "CreatePolling",
  components: {CreateDescriptivePolling, CreateOptionalPolling},
  props:["whichPollingItem","allPollingCreated","allDescriptivePollingCreated","amIGuestUser"],
}
</script>
<style scoped>

</style>

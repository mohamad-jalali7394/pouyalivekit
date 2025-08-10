<template>
<div class="device-test-fragment">
  <slot></slot>
</div>
</template>

<script>
export default {
  name: "DeviceTestFragment"
}
</script>

<style scoped>
.device-test-fragment {
  width: 77.2rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: center;
}
@media (max-width: 860px) {
  .device-test-fragment {
    width: 38.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
@media (max-width: 480px) {
  .device-test-fragment {
    width: 35.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

</style>

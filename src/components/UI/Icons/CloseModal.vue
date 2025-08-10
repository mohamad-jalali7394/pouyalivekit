<template>
  <div>
    <img draggable="false" src="/img/close.svg" alt="close modal image not loaded" @click="closeModal"/>
  </div>
</template>

<script>
export default {
  name: "CloseModal",
  emits : ['close-modal'],
  methods : {
    closeModal(){
      this.$emit('close-modal')
    }
  }
}
</script>

<style scoped>
div{
  cursor: pointer;
}
</style>
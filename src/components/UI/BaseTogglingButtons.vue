<template>
  <button :class="mode">
    <slot></slot>
  </button>

</template>
<script>
export default {
  props: ['mode']
}
</script>

<style scoped>
.inactive{
  text-decoration: none;
  border: 1px solid transparent;
  width: auto;
  padding: 0.3rem 0.5rem;
  margin-left: 1rem;
  display: inline-block;
  color:#333;
  cursor: pointer;
  background-color: transparent;
  white-space: nowrap;
}
.active{
  text-decoration: none;
  border: 1px solid transparent;
  width: auto;
  padding: 0.3rem 0.5rem;
  margin-left: 1rem;
  display: inline-block;
  cursor: pointer;
  background-color: transparent;
  color:#95d1cc;
  border-bottom: 1px solid #95d1cc ;
  white-space: nowrap;
}
button:hover,
button:active {
  font-weight: bold;
}

</style>
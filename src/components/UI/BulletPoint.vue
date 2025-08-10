<template>
<div :style="{'width':'0.8rem','height': '0.8rem', 'background-color': color === '#1B76FF' ? '#1B76FF' : '#DCDADA','border':'0.1rem solid transparent','border-radius': '50%'}"></div>
</template>

<script>
export default {
  name: "BulletPoint",
  props:["color"]
}
</script>

<style scoped>

</style>

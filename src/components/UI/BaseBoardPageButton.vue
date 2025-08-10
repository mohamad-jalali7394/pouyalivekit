<template>
<div :class="['board-page-btn', {['board-page-btn--next'] : type === 'next', ['board-page-btn--back'] : type === 'back'}]">
<img draggable="false" src="/img/board-page-btn.svg" alt="not loaded">
</div>
</template>

<script>
export default {
  name: "BaseBoardPageButton",
  props : ['type'],
}
</script>

<style scoped>
.board-page-btn{
width: 4rem;
height: 4rem;
  cursor: pointer;
}
.board-page-btn > img{
  width: 100%;
}
.board-page-btn--back{
  transform: rotateZ(180deg);
}
</style>
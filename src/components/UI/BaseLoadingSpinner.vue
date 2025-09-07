<template>

  <div class="loading" :style="loadingSpinnerSize">
    <div class="loading__spinner">
      <div :style="loadingSpinnerColor"></div>
      <div :style="loadingSpinnerColor"></div>
      <div :style="loadingSpinnerColor"></div>
      <div :style="loadingSpinnerColor"></div>
      <div :style="loadingSpinnerColor"></div>
      <div :style="loadingSpinnerColor"></div>
      <div :style="loadingSpinnerColor"></div>
      <div :style="loadingSpinnerColor"></div>
    </div>
    <div class="loading__extra-content">
      <slot name="loading-content"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props : ['sizeRatio', 'spinnerColor'],
  computed : {
    loadingSpinnerSize(){
      return ({transform : `scale(${this.sizeRatio})`})
    },
    loadingSpinnerColor(){
      return ({backgroundColor : this.spinnerColor})
    }
  }
}
</script>
<style scoped>
.loading{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.loading__spinner {
  display: inline-block;
  /*position: relative;*/
  width: 8rem;
  height: 8rem;
}
.loading__spinner div {
  animation: loading__spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 4rem 4rem;
}
.loading__spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: inherit;
  margin: -.4rem 0 0 -.4rem;
}
.loading__spinner div:nth-child(1) {
  animation-delay: -0.036s;
}
.loading__spinner div:nth-child(1):after {
  top: 6.3rem;
  left: 6.3rem;
}
.loading__spinner div:nth-child(2) {
  animation-delay: -0.072s;
}
.loading__spinner div:nth-child(2):after {
  top: 6.8rem;
  left: 5.6rem;
}
.loading__spinner div:nth-child(3) {
  animation-delay: -0.108s;
}
.loading__spinner div:nth-child(3):after {
  top: 7.1rem;
  left: 4.8rem;
}
.loading__spinner div:nth-child(4) {
  animation-delay: -0.144s;
}
.loading__spinner div:nth-child(4):after {
  top: 7.2rem;
  left: 4rem;
}
.loading__spinner div:nth-child(5) {
  animation-delay: -0.18s;
}
.loading__spinner div:nth-child(5):after {
  top: 7.1rem;
  left: 3.2rem;
}
.loading__spinner div:nth-child(6) {
  animation-delay: -0.216s;
}
.loading__spinner div:nth-child(6):after {
  top: 6.8rem;
  left: 2.4rem;
}
.loading__spinner div:nth-child(7) {
  animation-delay: -0.252s;
}
.loading__spinner div:nth-child(7):after {
  top: 6.3rem;
  left: 1.7rem;
}
.loading__spinner div:nth-child(8) {
  animation-delay: -0.288s;
}
.loading__spinner div:nth-child(8):after {
  top: 5.6rem;
  left: 1.2rem;
}
@keyframes loading__spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
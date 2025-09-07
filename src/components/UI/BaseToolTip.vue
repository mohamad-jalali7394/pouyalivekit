<template>
  <div v-if="isHovered && !isMobile" class="tool_tip--container">
    <slot></slot>
    <div class="tool-tip-arrow" ></div>
  </div>
</template>

<script>
import DetectMobile from "../../utils/detectMobile";

export default {
  name: "BaseToolTip",
  props:['isHovered'],
  data(){
    return {
      isMobile:false,
    }
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },

}
</script>

<style scoped>
.tool_tip--container {
  min-width: 10rem;
  width: max-content;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.4rem;
  position: absolute;
  top: -3rem;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0.5rem;
  background-color: #4f4e4e;
  color: white;
  font-size: 1.1rem;
  z-index: 1000;
  animation: tooltip 1s ;

}
.tool-tip-arrow{
  left: 50%;
  transform: translateX(-50%) rotate(50deg);
  position: absolute;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 10px solid  #4f4e4e;
  border-bottom-left-radius:5px;
  white-space: pre;
  bottom: -0.3rem;
}
@keyframes tooltip {
  from{
    opacity: 0;
  }
  to{
    opacity: 1;
  }
}

</style>

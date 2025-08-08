<template>
  <div class="slider">
    <div class="slider__inner">
      <transition-group tag="div" :name="transitionName" class="slides-group">
        <div :key="currentSlideIdx"
             class="slide"
             >
            <slot name="slider-list" :current-slide="currentSlide"></slot>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseSlider",
  props : ['slidingAction', 'slidesInfo'],
  emits : ['end-sliding'],
  data(){
    return {
      currentSlideIdx: 0,
      direction: 1,
      transitionName: '',
      slides: null,
    }
  },
  watch : {
    slidingAction(currentAction){
      switch (currentAction){
        case 'next' :
          this.slide(1);   break;
        case 'back' :
          this.slide(-1);  break;
        default : return;
      }
    },
  },
  computed : {
    currentSlide(){
      return this.slidesInfo[this.currentSlideIdx]
    }
  },
  methods : {
    slide(direction) {
      if(direction === 1){
        this.transitionName = "slide-next"
      }else {
        this.transitionName = "slide-prev"
      }
      if(this.slidesInfo.length > 0){
        this.currentSlideIdx = (this.currentSlideIdx + direction % this.slidesInfo.length + this.slidesInfo.length) % this.slidesInfo.length;
      }
      this.$emit('end-sliding');
    }
  },

}
</script>

<style scoped>
.slide-next-enter-active,
.slide-next-leave-active {
  transition: transform 0.5s ease-in-out;
}
.slide-next-enter-from {
  transform: translate(100%);
}
.slide-next-leave-to {
  transform: translate(-100%);
}

.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.5s ease-in-out;
}
.slide-prev-enter-from {
  transform: translate(-100%);
}
.slide-prev-leave-to {
  transform: translate(100%);
}


.slider{
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: hidden;
  font-size: 1.2rem;
  border-radius: inherit;
}
.slider__inner {
  width: 100%;
  height: 100%;
  position: relative;
  /*border-radius: .3rem;*/
  display: flex;
  border-radius: inherit;
}

.slide {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: inherit;
}

</style>
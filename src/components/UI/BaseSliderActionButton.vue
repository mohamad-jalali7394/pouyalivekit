<template>
      <span class="slider-action-btn"
      @click="makeSliderAction"
      :class="{[(sliderActionBtnType === 'next')? 'slider-action-btn--next': 'slider-action-btn--back' ] : true}">
        <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
          <path
              d="M7.383,22a.5082.5082,0,0,1-.3583-.8685l9.0093-8.9566-9.1467-9.31a.5081.5081,0,1,1,.7245-.7127l9.5011,9.67a.5083.5083,0,0,1-.004.7166l-9.3676,9.313A.5079.5079,0,0,1,7.383,22Z"
          />
        </svg>
      </span>
</template>

<script>
export default {
  name: "BaseSliderActionButton",
  props : ['sliderActionBtnType'],
  emits : ['slider-action'],
  methods : {
    makeSliderAction(){
      this.$emit('slider-action', this.sliderActionBtnType);
    }
  }

}
</script>

<style scoped>
.slider-action-btn{
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 10;
}
.slider-action-btn--back {
  left: 1.2rem;
  transform: rotateZ(180deg) translateY(50%);

}
.slider-action-btn--next{
  right: 1.2rem;
  transform: translateY(-50%);
}
</style>
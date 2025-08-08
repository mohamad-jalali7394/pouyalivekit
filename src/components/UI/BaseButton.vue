<template>
  <button type="button"
          ref="button"
          :disabled="!isActive"
          :style="{...continuousStyleProperties, cursor:isActive ? 'pointer' : 'not-allowed'}"
          :class="{...predefinedDiscreteStyleProperties, ...{['button--shake-animation']: shakeAnimation}, 'button__rtl': $i18n.locale !== 'en','button__ltr':$i18n.locale === 'en'}"
          @animationend="shakeAnimationEnded"
          @click.prevent="clickBtn"
  >
    <div class="button-slot" v-if="$slots['pre-button-slot']">
      <slot name="pre-button-slot"></slot>
    </div>
    <span>{{ buttonInnerTxt }}</span>
    <div class="button-slot" v-if="$slots['post-button-slot']">
      <slot name="post-button-slot"></slot>
    </div>
  </button>
</template>

<script>
export default {
  name : "BaseButton",
  data(){
    return {
      discreteStyleTypes : [
        'button--right-aligned',
        'button--left-aligned',
        'button--small',
        'small--button',
        'button--full',
        'button--semi-full',
        'button--curved',
        'login--button',
        'button--disabled',
        'button--with-border',
        'large--button',
        'entrance--button',
        'button--normal',
      ],
    }
  },
  props: ['styleTypes', 'buttonInnerTxt', 'continuousParams', 'shakeAnimation','isActive'],
  emits : ['btn-clicked', 'shake-animation-ended'],
  computed: {
    predefinedDiscreteStyleProperties() {
      const styleTypes = {};
      if(this.styleTypes && this.styleTypes.some(type => this.discreteStyleTypes.includes(type)))
        this.styleTypes.forEach(type => {
          styleTypes[type] = true;
        });
      return styleTypes;
    },
    continuousStyleProperties() {
      const continuousParams = {};
      if(this.continuousParams){
        this.continuousParams.forEach(type => {
          if (type.includes('=')) {
            continuousParams[`${type.split('=')[0].trim()}`] = type.split('=')[1].trim().toString();
          }
        });
      }
      return continuousParams;
    }
  },
  methods : {
    clickBtn(){
      this.$emit('btn-clicked');
    },
    shakeAnimationEnded(){
      this.$emit('shake-animation-ended');
    },
    changeBackGround(type){
      if (this.$refs.button){
        if(type === 'over'){
          this.$refs.button.style.backgroundColor = '#1B76FF'
        }else {
          this.$refs.button.style.backgroundColor = '#1B76FF'
        }


      }
    }
  }
}
</script>

<style scoped>

.button__rtl {
  position: relative;
  font-size: 1.5rem;
  border: none;
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  border-radius: 0.4rem;
}
.button__ltr {
  position: relative;
  font-size: 1.5rem;
  border: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  border-radius: 0.4rem;
}
.button-slot {
  display: flex;
  justify-content: center;
  align-items: center;
}


/* Button Types Classified with Its Direction Aspect */
.button--right-aligned{
  justify-content: flex-end;
}
.button--left-aligned{
  justify-content: flex-start;
}
.entrance--button{
  padding: 1rem 8rem;
  border-radius: 0.8rem;
  font-size: 1.2rem;
  width: max-content;
  top: -1rem;
}

/* Button Types Classified with Its Size Aspect */
.button--small {
  padding:1rem 1.8rem;
  border-radius: 0.8rem;
  font-size: 1.2rem;
  font-weight: 700;
  height: fit-content;
  width: max-content;
}
.button--normal{
  padding: 1rem 3.4rem;
  border-radius: 0.8rem;
  font-size: 1.2rem;
  width: max-content;
}
.login--button{
  width: 100%;
  border-radius: 0.8rem;
}
.login--button:hover{
  background-color:#1B76FF !important;
}
.button--disabled {
  width: 100%;
  border-radius: 0.8rem;
}
.small--button{
  padding: 0.4rem 0.8rem;
  border-radius: 0.6rem;
  font-size: 1.4rem;
  font-weight: 700;
  width: max-content;
}
.large--button{
  padding: 1rem 3rem;
  border-radius: 0.8rem;
  min-width: 15rem;
  font-size: 1.4rem;
  font-weight: 700;
  width: max-content;
}
/*.button--full{*/
/*  width: 100%;*/
/*}*/
/*.button--semi-full{*/
/*  width: 90%;*/
/*}*/


/* Button Types Classified with Its Visual Aspect */
.button--curved {
  border-radius: 0.8rem;
}

.button--disabled {
  padding: .85rem 2.5rem;
  background-color: #aaa !important;
  cursor: not-allowed;
}
.button--disabled :hover {
  background-color: #aaa !important;

}
.button--with-border{
  border : .1rem solid black
}


/* Button animation while have invalid data */
.button--shake-animation{
  animation: btn-shake 0.82s cubic-bezier(0.37, 0.08, 0.2, 0.98);
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 100rem;
}
@keyframes btn-shake {
  10%,
  90% {
    transform: translate3d(-0.1rem, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(0.2rem, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-0.4rem, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(0.4rem, 0, 0);
  }
}

/*@media only screen and (min-width: 250px) and (max-width: 1000px){*/
/*  .button--big{*/
/*    padding: .85rem 6.9rem;*/
/*  }*/
/*}*/
/*@media only screen and (max-width: 500px) {*/
/*  .button--big {*/
/*    padding: .5rem 3.9rem;*/

/*  }*/
/*}*/
</style>

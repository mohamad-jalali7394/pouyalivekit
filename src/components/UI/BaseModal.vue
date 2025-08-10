<template>
  <teleport to="body">
    <div class="modal-backdrop" @click="closeModal" :style="{  'z-index':  isLoading === 'isLoading' ? '1004':'1000',cursor: whichModal === 'eventDetail' ? 'pointer' : ''}" :class="applyBlurClass" v-if="open && !(isLoginPage === 'yes') && !(page === 'conference') && (isFullScreen !== true) ">
    </div>
    <transition name="modal" >
      <div @click.stop  :class="isLoading === 'isLoading' ? 'modal-content-loading' : whichModal === 'eventDetail'? 'modal-content-tabs' : 'modal-content'"  :style="applyModalColor" v-if="open">
        <section class="modal-section modal-section--header" v-if="$slots['modal-header']">
          <header class="modal-section--header__inner" :style="{padding : isEventDetail ? '1.5rem 4rem 0 4rem' : '1.5rem 4rem' }"  :class="mode">
            <slot name="modal-header" :class="mode">
            </slot>
          </header>
        </section>
        <section class="modal-section" v-if="$slots['modal-body']" :style="{justifyContent : isEventDetail ? 'flex-end' : ''}">
          <div class="modal-section--body__inner" :style="{padding : isEventDetail ? '1.5rem 4rem 0 4rem' : '1.5rem 4rem'}" >
            <slot name="modal-body">
            </slot>
          </div>
        </section>
        <section class="modal-section" v-if="$slots['modal-buttons']">
          <div class="modal-section--buttons__inner">
            <slot name="modal-buttons">
            </slot>
          </div>
        </section>
      </div>
    </transition>
  </teleport>
</template>

<script>

export default {
  name: "BaseModal",
  props: ['open','isBlur', 'modalColor','mode','isLoginPage','isLoading','page','whichModal','isFullScreen','isEventDetail','isForgetPasswordPage'],
  emits : ['close-modal'],
  computed : {
    applyBlurClass(){
      if(this.isBlur === 'true'){
        return ({'modal-backdrop--blurred': true})
      } else {
        return ({});
      }
    },
    applyModalColor() {
      return ({backgroundColor: this.modalColor,'border-radius': this.isLoginPage === 'yes' ? '0.8rem' : '0.8rem',' max-height':this.isLoginPage === 'yes' ? '100vh'  :'75rem',padding:this.isForgetPasswordPage ? '4rem 0 0 0' : '' })
    }
  },
  methods:{
    closeModal(){
      this.$emit('close-modal');
      this.eventBus.emit('close-modal');
    },
  },

}
</script>

<style scoped>

.modal-backdrop{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0.8;
  justify-content: center;
  align-items: center;

}
.modal-backdrop--blurred{
  backdrop-filter: blur(.5rem);
  -webkit-backdrop-filter: blur(.5rem);
}
/*.modal-content{*/
/*  position: fixed;*/
/*  !*width: 100%;*!*/
/*  background-color: #fff;*/
/*  border-radius: 2.5rem;*/
/*  right: 50%;*/
/*  top: 50%;*/
/*  transform: translate(50%, -50%);*/
/*  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.26);*/
/*  z-index: 1001;*/

/*}*/


.modal-section{
  width: 100%;
  margin-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content-loading{
  position: fixed;
  /*width: 100%;*/
  background-color: #fff;
  border-radius: 0.8rem;
  right: 50%;
  top: 50%;
  transform: translate(50%, -50%);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.26);
  z-index: 1005;
  box-shadow: none;
  /*overflow-y: scroll;*/
}
.modal-content{
  position: fixed;
  /*width: 100%;*/
  border-radius: 0.8rem;
  background-color: white;
  right: 50%;
  top: 50%;
  transform: translate(50%, -50%);
  -webkit-box-shadow: 0px 0px 12px 0 rgba(0, 0, 0, 0.16);
  box-shadow:0px 0px 12px 0px rgba(0, 0, 0, 0.16);
  z-index: 1001;
  /*overflow-y: scroll;*/
}
.modal-content-tabs{
  position: fixed;
  /*width: 100%;*/
  background-color: white;
  border-radius: 0.8rem;
  right: 50%;
  top: 50%;
  transform: translate(50%, -50%);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.26);
  max-height: 99%;
  overflow-y: auto;
  z-index: 1001;
  /*overflow-y: scroll;*/
}

.modal-section--header{
  /*background-color: #efefef;*/
  border-radius: 0.8rem 0.8rem 0 0;
  padding : 0.8rem 0;
  width: 100%;
  margin-top: 0;
}
.modal-section--header__inner{
  font-size: 1.2rem;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 4rem;

}
.modal-section--body__inner{
  direction: rtl;
  font-size: 1.5rem;
  padding: 1.5rem 4rem;
}
.modal-section--buttons__inner{
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1.5rem 4rem;
  position: relative;

}
.modal-enter-active{
  animation: fade .3s ease-out
}
.modal-leave-active{
  animation: fade .3s ease-in reverse;
}

@keyframes fade {
  from{
    opacity: 0;
    transform: translate(50%,-50%) scale(0.4,0.4);
  }
  to{
    opacity: 1;
    transform: translate(50%,-50%);

  }
}
.modal-header__flex{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.modal-body__flex{
  height: 75%;
}
@media (max-width: 860px){
  .modal-section--header__inner{

    padding: 1.5rem 1.5rem 0 1.5rem;

  }
  .modal-section--body__inner{

    padding : 1rem 2rem;
  }
  .modal-section--buttons__inner{

    padding : 2rem 2rem;

  }
  .modal-section--buttons__inner{
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding : 2rem 2rem;
    padding : 2rem 2rem;

  }
  @media (max-height: 500px) {
    .modal-content{
      position: fixed;
      /*width: 100%;*/
      background-color: #fff;
      border-radius: 1rem;
      right: 50%;
      top: 50%;
      transform: translate(50%, -30%);
      box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.26);
      z-index: 1001;

    }
  }
}
</style>

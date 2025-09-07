<template>
  <div
      class="toggle-btn"
      @click="toggleButton"
      :class="[{'toggle-btn--enable' : toggleBtnStatus === 'enabled'}, {'toggle-btn--disable' : toggleBtnStatus === 'disabled'}]">
    <div
        class="toggle-btn__thumb"
        :class="[{'toggle-btn__thumb--enable' : toggleBtnStatus === 'enabled'}, {'toggle-btn__thumb--disable' : toggleBtnStatus === 'disabled'}]"></div>
  </div>
</template>

<script>
export default {
  name: "AmIModeratorButton",
  data(){
    return {
      toggleBtnStatus : 'not-clicked',
    }
  },
  props:['isModerator'],
  methods : {
    toggleButton(){

      if(this.toggleBtnStatus === 'not-clicked'){

        this.toggleBtnStatus = 'enabled';
        if(this.isModerator === true){

          this.eventBus.emit('i-am-moderator', true)
        }else{
          this.eventBus.emit('normal-user', true)

        }
      } else {
        if(this.toggleBtnStatus === 'enabled'){
          this.toggleBtnStatus = 'disabled'
          if(this.isModerator === true){
            this.eventBus.emit('i-am-moderator', false)
          }else{
            this.eventBus.emit('normal-user', false)

          }
        } else {
          this.toggleBtnStatus = 'enabled';
          if(this.isModerator === true){
            this.eventBus.emit('i-am-moderator', true)
          }else{
            this.eventBus.emit('normal-user', true)

          }
        }
      }
    }
  }
}
</script>

<style scoped>
.toggle-btn{
  padding: 0 .5rem;
  width: 5.5rem;
  height: 2.5rem;
  border-radius: 2.3rem;
  background-color: #dadada;
  display: flex;
  justify-content: right;
  align-items: center;
  cursor: pointer;
}
.toggle-btn__thumb{
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;

  transition: transform .2s ease-in;
  background-color: white;
  box-shadow: 0 0 .8rem 0 rgba(0, 0, 0, .18);
}
.toggle-btn--enable{
  background-color: #8ab4f8;
}
.toggle-btn--disable{
  background-color: #dadada;
}
.toggle-btn__thumb--enable{
  transform: translateX(-2.5rem);
}
.toggle-btn__thumb--disable{
  transform: translateX(0);

}
@keyframes btn-enabled-animation {
  from{

  }
  to{
    transform: translateX(-4.1rem);
  }
}
@keyframes btn-disabled-animation {
  from{

  }
  to{
    transform: translateX(4.1rem);
  }
}
</style>
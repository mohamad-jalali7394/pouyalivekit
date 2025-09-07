<template>
  <div
      class="toggle-btn"
      @click="toggleButton"
      :class="[{'toggle-btn--enable' : toggleBtnStatus === 'enabled'}, {'toggle-btn--disable' : toggleBtnStatus === 'disabled'}]"
  :style="{cursor: (!togglePermission) ? 'not-allowed' : 'pointer'}">
    <div
        class="toggle-btn__thumb"
        :class="[{'toggle-btn__thumb--enable' : toggleBtnStatus === 'enabled'}, {'toggle-btn__thumb--disable' : toggleBtnStatus === 'disabled'}]"></div>
  </div>
</template>

<script>
export default {
  name: "BaseToggleButton",
  data(){
    return {
      toggleBtnStatus : 'not-clicked',
    }
  },
  // props:{
  //   isToggled:{
  //     type:Boolean,
  //     required: false,
  //     default: true
  //   },
  //   toggleItem:{
  //     type:String,
  //     required: false,
  //     default: ''
  //   }
  // },
  props:['isToggled','toggleItem','isGuest','togglePermission'],
  watch:{
    isToggled:{
      immediate:true,
      handler(val){
        if (val){
          this.toggleBtnStatus = 'enabled'
        }else {
          this.toggleBtnStatus = 'disabled'
        }
      }
    }
  },
  methods : {
    toggleButton(){
      if (this.togglePermission) {
        // if (this.isGuest){
        //   this.eventBus.emit("notification", {
        //     title: "پیام",
        //     type: "error",
        //     bodyText: 'امکان اجازه این دسترسی به کاربر مهمان وجود ندارد',
        //     time: 5000,
        //   });
        // }else {
        if (this.toggleBtnStatus === 'not-clicked') {
          this.toggleBtnStatus = 'enabled';
          // if(this.isModerator === true){
          this.$emit('toggle-item', {item: this.toggleItem, status: true})
          // }else{
          //   this.eventBus.emit('anonymous', true)
          //
          // }
        } else {
          if (this.toggleBtnStatus === 'enabled') {
            this.toggleBtnStatus = 'disabled'
            // if(this.isModerator === true){
            this.$emit('toggle-item', {item: this.toggleItem, status: false})
            // }else{
            //   this.eventBus.emit('anonymous', false)
            //
            // }
          } else {
            this.toggleBtnStatus = 'enabled';
            // if(this.isModerator === true){
            this.$emit('toggle-item', {item: this.toggleItem, status: true})
            // }else{
            //   this.eventBus.emit('anonymous', true)
            //
            // }
          }
        }
      // }

      }


    }
  },
}
</script>

<style scoped>
.toggle-btn{
  padding: 0 .5rem;
  width: 5rem;
  height: 2.1rem;
  border-radius: 2.3rem;
  background-color: #a4a3a3;
  display: flex;
  justify-content: right;
  align-items: center;
}
.toggle-btn__thumb{
  width: 3.1rem;
  height: 3.1rem;
  border-radius: 50%;
  transition: transform .2s ease-in;
  background-color: white;
  box-shadow: 0 0 .8rem 0 rgba(0, 0, 0, .18);
  position: relative;
  right: -0.5rem;
  border: 0.1rem solid #e1dfdf;
}
.toggle-btn--enable{
  background-color: #cbdaf3;
}
.toggle-btn--disable{
  background-color: #a4a3a3;
}
.toggle-btn__thumb--enable{
  transform: translateX(-1.8rem);
  background-color: #1B76FF;
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

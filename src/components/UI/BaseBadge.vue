<template>
  <span  :class="mode">
    <div :class="circle" v-if="showBadge"></div>
    <p :class="textWidth">{{badgeText}}</p>

      <span class="hidden-badge"  :class="close" @click="closBadge">+</span>

      <slot></slot>

  </span>
</template>

<script>
export default {
  name : "BaseBadge",
  props: {
    mode: {
      type: String,
      required: false,
      default: null,
    },
    badgeText : {
      type : String
    },
    close : {
      type : String
    },
    circle : {
      type : String,
      default: "circle"
    },
    showBadge : {
      type : Boolean,
      default:true
    },
    textWidth:{
      type:String,
      default:'badge__text'
    }

  },
  methods:{
    closBadge(){
      this.$emit('close-badge')
    }
  }
};
</script>
<style scoped>
.badge__text{
  direction: rtl;
  /* display : flex;
  justify-content: center;
  align-items: center; */
  max-width: 4.8rem;
  white-space : nowrap;
  overflow : hidden;
  text-overflow : ellipsis;

}
.email__text{
  direction: ltr;
  max-width: 22rem;
  white-space : nowrap;
  overflow : hidden;
  text-overflow : ellipsis;

}
.circle{
  position: absolute;
  width: 0.7rem;
  height: 0.7rem;
  background-color: #1a73e8;
  border-radius: 50%;
  top: -0.4rem;
  left: 0;
}
.badge {
  position: relative;
  font-size: 1rem;
  display: flex;
  padding: 0 .7rem;
  align-items: center;
  /*justify-content: center;*/
  max-width: 9rem;
  height: 2.2rem;
  border-radius: 1.1rem;
  margin-left: 0.5rem;
  border: solid .1rem rgb(194, 191, 191);
  direction: rtl;
  color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
}
.invitation{
  position: relative;
  font-size: 1.1rem;
  display: flex;
  padding: 0 .5rem;
  align-items: center;
  /*justify-content: center;*/
  width: 6.5rem;
  height: 2.2rem;
  border-radius: 1.1rem;
  margin-left: 0.5rem;
  border: solid .1rem rgb(194, 191, 191);
  direction: rtl;
  color: rgba(0, 0, 0, 0.8);
}
.email__mode{
  position: relative;
  font-size: 1.1rem;
  display: flex;

  align-items: center;
  /*justify-content: center;*/
  max-width: 22rem;
  height: 2.2rem;
  border-radius: 1.1rem;
  margin-left: 0.5rem;
  border: solid .1rem rgb(194, 191, 191);
  direction: ltr;
  color: rgba(0, 0, 0, 0.8);
  padding:0.3rem 1.5rem 0.3rem  0.3rem;
  margin-bottom: 1rem;
}
.color {
  color: #1a73e8;
}
.hidden-badge{
  position: absolute;
  display: none;
}
.close-badge{
  transform: rotate(45deg);
  width: 1rem;
  height: 1rem;
  font-size: 1.2rem;

  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0.2rem;
  cursor: pointer;
  color: black;
  border-radius: 50%;
}
.close-badge--ltr{
  transform: rotate(45deg);
  width: 1rem;
  height: 1rem;
  font-size: 1.2rem;

  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0.2rem;
  cursor: pointer;
  color: black;
  border-radius: 50%;
}
.close-badge:hover {
  background-color: #1a73e8;
  color: white;
}
.close-badge--ltr:hover{
  background-color: #1a73e8;
  color: white;
}
@media only screen and (max-width: 400px){

  .badge__text{
    direction: rtl;
    /* display : flex;
    justify-content: center;
    align-items: center; */
    max-width: 6rem;
    white-space : nowrap;
    overflow : hidden;
    text-overflow : ellipsis;

  }
  .invitation{

    font-size: 0.9rem;

    padding: 0 .3rem;


    width: 8rem;
    height: 2.2rem;
    border-radius: 1.1rem;
    margin-left: 0.4rem;

  }
  .close-badge{
    left: 0.1rem;
  }

}
@media (min-width:401px ) and (max-width: 767px){
  .badge__text{
    direction: rtl;

    max-width: 7rem;
    white-space : nowrap;
    overflow : hidden;
    text-overflow : ellipsis;

  }
  .invitation{

    font-size: 0.9rem;

    padding: 0 .3rem;


    width: 10rem;
    height: 2.2rem;
    border-radius: 1.1rem;
    margin-left: 0.4rem;

  }
  .close-badge{
    left: 0.1rem;
  }
}
</style>


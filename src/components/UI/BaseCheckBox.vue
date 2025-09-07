<template>
  <div class="checkbox" :style="{borderColor : (hasWhiteBorder)? 'white' : '#1a73e8'}" :class="{['checkbox--checked'] : isChecked}" @click="checkToggling"></div>
</template>

<script>
export default {
  name: "BaseCheckBox",
  props : {
    hasWhiteBorder :{
      type : Boolean
    }
  },
  data(){
    return {
      isChecked : false,
    }
  },
  emits : ['is-checked-status'],
  methods : {
    checkToggling(){
      this.isChecked = !this.isChecked;
      this.$emit('is-checked-status', this.isChecked);
    }
  }
}
</script>

<style scoped>
.checkbox{
  width: 1.6rem;
  height: 1.6rem;
  border-radius : .3rem;
  border : .2rem solid #1a73e8;
  margin-left: .6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.checkbox--checked:before{
  height : 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  content: '\2713';
  background-color : #1a73e8;
  color : white;
  font-family: "Arial";
  font-size: 1rem;
  font-weight: bold;
}
</style>
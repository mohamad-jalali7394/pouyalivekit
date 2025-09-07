<template>
  <li>
    <div>

      <input type="radio"   name="answer"  :id="option" :value="option" @input="inputValueBinding">
      <label :for="option"> {{option}}</label>
    </div>
  </li>
</template>

<script>
export default {
  props:['option'],
  methods:{
    inputValueBinding(e){
      this.$emit('update:modelValue', e.target.value);
    },
  },
}
</script>

<style scoped>
li{
  width: 100%;

}
div{
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
label{
  margin:0 1rem;
  cursor: pointer;
}
input{
  cursor: pointer;
}
</style>
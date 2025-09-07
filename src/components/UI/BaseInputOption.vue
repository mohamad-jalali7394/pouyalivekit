<template>
  <div>
    <span @click="closeOption(index)"> - </span>
    <input :ref="'input' + index"  type="text" :placeholder="optionPlaceHolder" @input="inputValueBinding" @focus="clearPlaceHOlder(index)" @blur="showPlaceHolder(index)">
  </div>


</template>


<script>
export default {
  props:['index','modelValue','length'],
  emits:['update:modelValue'],
  data(){
    return {

    }
  },
  methods:{
    inputValueBinding(e){
      this.$emit('update:modelValue', e.target.value);
    },
    clearPlaceHOlder(index){
      for(let i =0;i<this.length;i++){
        if(i == index){
          this.$refs['input' + index].placeholder = ''
        }
      }
    },
    showPlaceHolder(index){
      for(let i =0;i<this.length;i++){
        if(i == index){
          this.$refs['input' + index].placeholder = this.optionPlaceHolder
        }
      }
    },
    closeOption(index){
      this.eventBus.emit('close-option',index)
    },
  },
  computed:{
    optionPlaceHolder(){
      if(this.index === 0){
        return this.$store.getters.t("first-option")
      }else if(this.index === 1){
        return this.$store.getters.t("second-option")
      }else if(this.index === 2){
        return this.$store.getters.t("third-option")
      }else if(this.index === 3){
        return this.$store.getters.t("fourth-option")
      }else if(this.index === 4){
        return this.$store.getters.t("fifth-option")
      }else if(this.index === 5){
        return this.$store.getters.t("sixth-option")
      }else if(this.index === 6){
        return this.$store.getters.t("seventh-option")
      }else if(this.index === 7){
        return this.$store.getters.t("eighth-option")
      }else if(this.index === 8){
        return this.$store.getters.t("ninth-option")
      }else if(this.index === 9){
        return this.$store.getters.t("tenth-option")
      }else if(this.index === 10){
        return this.$store.getters.t("eleventh-option")
      }else if(this.index === 11){
        return this.$store.getters.t("twelfth-option")
      }else if(this.index === 12){
        return this.$store.getters.t("thirteenth-option")
      }else if(this.index === 13){
        return this.$store.getters.t("fourteenth-option")
      }else if(this.index === 14){
        return this.$store.getters.t("fifteenth-option")
      }else if(this.index === 15){
        return this.$store.getters.t("sixteenth-option")
      }else if(this.index === 16){
        return this.$store.getters.t("seventeenth-option")
      }else if(this.index === 17){
        return this.$store.getters.t("eighteenth-option")
      }else if(this.index === 18){
        return this.$store.getters.t("nineteenth-option")
      }else if(this.index === 19){
        return this.$store.getters.t("twentieth-option")
      }else{
        return ''
      }
    }
  }
}
</script>


<style scoped>
div{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
}

span{
  width: 1.4rem;
  height: 1.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: red;
  color: white;
  font-size: 4rem;
  margin:0 0.5rem;
  cursor: pointer;
}

input{
  width: 46rem;
  height: 3.6rem;
  border-radius: 1rem;
  border: solid 0.1rem #707070;

  padding-right: .5rem;
  padding-left: .5rem;

}
input:focus{
  outline: none;
  border-color:#95d1cc;
}
</style>
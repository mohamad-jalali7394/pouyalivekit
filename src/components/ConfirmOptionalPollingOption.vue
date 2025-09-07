<template>
  <div  style="width: fit-content;min-width: 20rem;display: flex;gap: 0.8rem;align-items: center;position: relative;background-color: #F2F2F2;padding: 0.8rem 1.6rem;border-radius: 0.8rem">
    <span v-if="polling.isAnswered" style="border: 0.05rem solid #777676;width: 1.3rem;height: 1.3rem;border-radius: 50%;display: flex;justify-content: center;align-items: center;cursor: not-allowed" >
      <span style="width: 0.7rem;height: 0.7rem;border-radius: 50%;" :style="{backgroundColor:polling?.optionalAnswer[index]?.optionalAnswerId === option.id ? '#bbbbbb' : ''}"></span>
    </span>
    <input v-else :style="{cursor: polling.isAnswered ? 'not-allowed' : 'pointer'}" type="radio" :id="option.id + polling.pollingId + index" :name="polling.pollingId + index" :checked="polling.isAnswered && polling?.optionalAnswer[index]?.optionalAnswerId === option.id" :disabled="polling.isAnswered" :value="option.optionBody"  @input="chooseOption" >
    <label  :style="{cursor: polling.isAnswered ? 'not-allowed' : ''}" :for="polling.pollingId + index">{{ option.optionBody }}</label>
  </div>
</template>
<script>

export default {
  name: "ConfirmOptionalPollingOption",
  props:["polling","option","index","pollElement"],
  data(){
    return {
      optionalAnswer:'',
    }
  },
  methods:{
    chooseOption(e){
      this.optionalAnswer = e.target.value
      this.$emit('choose-option', {value:e.target.value, index:this.index,questionId:this.pollElement.questionId,optionId:this.option.id,pollingId:this.polling.pollingId})
    }
  },

  mounted() {
    // console.error('ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss')
    // console.error(this.option)
    // console.error(this.polling?.optionalAnswer[this.index]?.optionalAnswerId , this.option.id)
  }
}
</script>
<style scoped>

</style>

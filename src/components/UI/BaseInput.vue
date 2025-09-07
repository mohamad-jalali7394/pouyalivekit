<template>
  <div class="container" >
    <label class="label"> {{ label }} </label>
    <input :id="id" :showError="showInputError"  :class="[showInputError ? 'errorInput' : 'input' , showInputError ? 'input:focus' : 'errorInput:focus']" v-model.trim="inputValue"  @input="updateModelValue" @keyup="searchParticipants" autocomplete="off" @blur="disableDivs">
  </div>
</template>


<script>

export default {
  data () {
    return {
      inputValue : this.value,
    }
  },
  emits : [ 'update:modelValue' , 'searchParticipants' , 'disableDivs' ],
  props : [ 'label' , 'id' , 'value','removeInputValues' , 'showInputError'],
  watch:{
    removeInputValues(value){
      if (value){
        this.inputValue = ''
        this.$emit('change-remove-input-values-to-false')
      }
    }
  },
  methods : {
    updateModelValue (e) {
      this.$emit('update:modelValue' , e.target.value )
      // this.$emit('send-input-id' , this.id)
    },
    searchParticipants () {
      this.$emit("searchParticipants" , this.id , this.inputValue)
    },
    disableDivs () {
      this.$emit('disableDivs' , this.id)
    }
  },
}
</script>


<style scoped>

.container {
  display: flex;
  flex-direction: column;
  width: 91rem;
  gap: 1rem;
}

.label {
  color: #75758F;
  text-align: right;
  font-size: 1.3rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
}
.input {
  display: flex;
  width: 25.5rem;
  padding: 0.5rem 1rem;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 1rem;
  border: transparent;
  border-radius: 0.5rem;
  background: #F6F6F7;
}

.errorInput {
  display: flex;
  width: 25.5rem;
  padding: 0.5rem 1rem;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 1rem;
  border-radius: 0.5rem;
  background: white;
  border: 1px solid #EC3737;
}

.input:focus {
  outline: none;
  background: var(--No-color, #FFF);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}

.errorInput:focus {
  outline: none;
  background: var(--No-color, #FFF);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}

@media (max-width: 1024px) and (min-width: 768px) {

  .input {
    display: flex;
    width: 19.5rem;
    padding: 0.5rem 1rem;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 1rem;
    border: transparent;
    border-radius: 0.5rem;
    background: #F6F6F7;
  }

  .errorInput {
    display: flex;
    width: 19.5rem;
    padding: 0.5rem 1rem;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 1rem;
    border-radius: 0.5rem;
    background: white;
    border: 1px solid #EC3737;
  }
}

@media (max-width: 768px) {

  .container {
    display: flex;
    flex-direction: column;
    width: 32rem;
    gap: 1rem;
  }

  .input {
    display: flex;
    width: 32rem;
    padding: 0.5rem 1rem;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    border: transparent;
    border-radius: 0.5rem;
    background: #F6F6F7;
  }

  .errorInput {
    display: flex;
    width: 32rem;
    padding: 0.5rem 1rem;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    border-radius: 0.5rem;
    background: white;
    border: 1px solid #EC3737;
  }
}

</style>
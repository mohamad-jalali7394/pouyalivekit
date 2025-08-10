<template>
<div class="date-filter">
  <label>:{{ (type === 'to')? 'تا' : 'از'}} تاریخ</label>
<date-picker
    color="#1a73e8"
    min="1399/02/01 08:00"
    max="1410/08/01 08:00"
    v-model="date"
    @change="changeDateFrom"
></date-picker>
</div>
</template>

<script>
import DatePicker from 'vue3-persian-datetime-picker';
export default {
  name: "DateFilter",
  components : {DatePicker},
  props : ['dateInfo', 'type'],
  emits : ['date-modified'],
  data(){
    return {
      dateManipulatorInstance : null,
        date : this.dateInfo,
    }
  },
  methods : {
    changeDateFrom(){
       this.$emit('date-modified', this.date);
    }
  },
}
</script>

<style scoped>
.date-filter{
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}
label {
  font-size: 1.2rem;
  margin-left: .8rem;
  color: white;
}
input {
  width: 20.2rem;
  height: 3.2rem;
  border: none;
  outline: none;
  border-radius: 1rem;
  background-color: #f1f1f1;
}
@media (max-width: 1024px){
  label {
    font-size: 1.2rem;
    margin-left: .8rem;
    color: black;
  }
}
</style>
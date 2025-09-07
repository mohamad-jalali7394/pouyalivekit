<template>
  <span>{{timeComputer.toTime}}</span>

  <span>الی</span>
  <span>{{timeComputer.fromTime}}</span>

</template>

<script>
export default {
  name: "TheTime",
  props : ['fromTime', 'toTime'],
  computed : {
    timeComputer(){
      const fromTimeArray = this.fromTime.split(' ')[1].split(':');
      const toTimeArray = this.toTime.split(' ')[1].split(':');
      const fromTime = this.oneDigitTimeResolver(fromTimeArray).join(':');
      const toTime = this.oneDigitTimeResolver(toTimeArray).join(':');
      return ({fromTime, toTime});
    }
  },
  methods : {
    oneDigitTimeResolver(array){
      const revisedArray = array.map(el => {
        if((+el).toString().length === 1){
          return '۰' + (+el).toLocaleString('fa-IR');
        } else {
          return (+el).toLocaleString('fa-IR');
        }
      });
      return revisedArray;
    }
  }
}
</script>

<style scoped>
span{
  margin-left: .4rem;
}
</style>
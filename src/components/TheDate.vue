<template>
  <span>{{dateComputer.year}}</span>
  <span>{{dateComputer.month}}</span>
  <span>{{dateComputer.day}}</span>
</template>

<script>
export default {
  name: "TheDate",
  data(){
    return{
      persianMonths : new Map([
        ['1', 'فروردین'],
        ['2', 'اردیبهشت'],
        ['3', 'خرداد'],
        ['4', 'تیر'],
        ['5', 'مرداد'],
        ['6', 'شهریور'],
        ['7', 'مهر'],
        ['8', 'آبان'],
        ['9', 'آذر'],
        ['10', 'دی'],
        ['11', 'بهمن'],
        ['12', 'اسفند']
      ])
    }
  },
  props : ['date'],
  computed : {
    dateComputer(){
      const dateArray = this.date.split(' ')[0].split('/');
      const year = (+dateArray[0]).toLocaleString('fa-IR').split('٬').join('')
      const month = this.persianMonths.get(dateArray[1]);
      const day = (+dateArray[2]).toLocaleString('fa-IR');
      return ({year, month, day});
    }
  }
}
</script>

<style scoped>
span{
  margin-left: .6rem;
}
span:first-child{
  margin: 0;
}
</style>
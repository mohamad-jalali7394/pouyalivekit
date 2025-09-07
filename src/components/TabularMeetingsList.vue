<template>
  <div class="meetings-table">
    <ul class="meetings-table__titles">
      <li v-for="(title, index) in titlesArray"
          :key="title"
          :style="{width : fieldsWidth(index)}"
          class="title">
        <div>{{title}}</div>
      </li>
    </ul>
    <div class="date-flag" v-for="date in allDates" :key="date">
      <h3 class="date-flag__header">
        <the-date :date="date"></the-date>
      </h3>
      <ul class="date-flag__list">
        <tabular-meeting-row
            v-for="meeting in meetings.filter(mtng => mtng.fromSchd.split(' ').shift().toString() === date)"
            :key="meeting.id"
            :meeting="meeting"
            :number-of-columns="titlesArrayLength"
        >
        </tabular-meeting-row>
      </ul>
    </div>
  </div>
</template>

<script>
// import TabularMeetingEntity from "./TabularMeetingEntity";
import TabularMeetingRow from "./TabularMeetingRow";
import TheDate from "./TheDate";
export default {
  name: "TabularMeetingsList",
  components: {TheDate, TabularMeetingRow},
  // components: {TabularMeetingEntity},
  props: ['titlesArray' , 'meetings','isPast'],
  data(){
    return {
      dates : new Set()
    }
  },
  computed : {
    allDates(){
      return  this.isPast ? Array.from(this.dates).sort().reverse() :  Array.from(this.dates).sort()
    },
    titlesArrayLength(){
      return this.titlesArray.length;
    },
  },
  methods : {
    fieldsWidth(idx){
      let widthPercentage;
      if(this.titlesArrayLength === 5){
        switch (idx){
          case 0 : widthPercentage = '26%'; break;
          case 1 : widthPercentage = '26%'; break;
          case 2 : widthPercentage = '18%'; break;
          case 3 : widthPercentage = '18%'; break;
          case 4 : widthPercentage = '12%'; break;
        }
      } else if(this.titlesArrayLength === 4) {
        switch (idx){
          case 0 : widthPercentage = '40%'; break;
          case 1 : widthPercentage = '22%'; break;
          case 2 : widthPercentage = '22%'; break;
          case 3 : widthPercentage = '16%'; break;

        }
      }else {
        switch (idx){
          case 0 : widthPercentage = '45%'; break;
          case 1 : widthPercentage = '35%'; break;
          case 2 : widthPercentage = '20%'; break;


        }
      }
      return widthPercentage;
    }
  },
  beforeMount() {
    for(const meeting of this.meetings){
      this.dates.add(meeting.fromSchd.split(' ').shift().toString())
    }
  }
}
</script>

<style scoped>
.meetings-table{
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 1.6rem 2.4rem;
  border-radius: .3rem;
  /*box-shadow: 0 1rem 2rem rgba(0, 0, 0, .26);*/
}
ul{
  list-style: none;
}
.meetings-table__titles{
  position: relative;
  width: 100%;
  background: #1a73e8;
  display: flex;
  padding: 0 1.5rem;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 1.5rem;
  color: white;
}

.date-flag{
  width: 100%;
}
.date-flag__header{
  width: 100%;
  height: 3rem;
  display : flex;
  margin : .8rem 0;

  padding-right: 1.5rem;
  color : rgba(0, 0, 0, .8);
  font-size: 1.2rem;
  font-weight: bold;
  justify-content: flex-end;
  align-items: center;
  background-color: #e8e8e8;
}
.date-flag__list{
  position: relative;
  padding-left: 1.5rem;
  padding-right: .9rem;
  height: calc(100% - 3.2rem);
  -ms-overflow-style: none;
  scrollbar-width: none;

}

.date-flag__list::-webkit-scrollbar{
  position: absolute;
  right: 0;
  top : 0;
  width: .6rem;
  height: 100%;
  background-color: transparent;
}
.date-flag__list::-webkit-scrollbar-thumb{
  width: 100%;
  border-radius: 20rem;
  background-color: #7A7A7A;
}
.title{

  height: 3.2rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 33%;

}

.title:first-child{
  justify-content: flex-end;
}
.title:last-child{
  justify-content: flex-start;
  margin-left: 3rem;
}
.title:nth-child(2){
  justify-content: flex-end;
  margin-right: 6rem;


}
@media (max-width: 767px) {
  .title:nth-child(2){
    justify-content: flex-end;
    margin-right: -2rem;


  }
}

</style>
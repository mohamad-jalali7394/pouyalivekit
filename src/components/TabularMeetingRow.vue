<template>
  <li class="meeting">
    <ul class="meeting-fields">
     <tabular-meeting-field
         :first-name-manager="meeting.firstNameManger"
         :last-name-manager="meeting.lastNameManager"
         :room-name="meeting.roomName"
         :meeting-title="meeting.title"
         :room-capacity="meeting.roomCapacity"
         :meeting-from-schd="meeting.fromSchd"
         :meeting-to-schd="meeting.toSchd"
         :meeting-id="meeting.id"
         v-for="(fieldVal, fieldName, index) in filteredFields"
         :key="fieldName"
         :style="{width : fieldsWidth(index)}"
         :field-value="fieldVal"
         :field-type="fieldName">
     </tabular-meeting-field>
    </ul>
  </li>
</template>

<script>
import TabularMeetingField from "./TabularMeetingField";
// import BaseModal from "./BaseModal";
export default {
  name: "TabularMeetingRow",
  components: {TabularMeetingField},
  data(){
    return {
      meetingInfoModalIsVisible : false
    }
  },
  props : ['meeting', 'numberOfColumns','isDateFlag'],
  computed : {
    filteredFields(){
      let filteredMeeting;
      if(this.numberOfColumns === 5){
        filteredMeeting = {
          title : this.meeting.title,
          roomName : this.meeting.roomName,
          date : this.meeting.fromSchd,
          time : {fromTime : this.meeting.fromSchd, toTime : this.meeting.toSchd},
          more : '',

        }
      } else if(this.numberOfColumns === 4){
        filteredMeeting = {
          title : this.meeting.title,
          date : this.meeting.fromSchd,
          time : {fromTime : this.meeting.fromSchd, toTime : this.meeting.toSchd},
          more : '',

        }
      } else {
        filteredMeeting = {
          title : this.meeting.title,
          time : {fromTime : this.meeting.fromSchd, toTime : this.meeting.toSchd},
          more : '',
        }
      }
      return filteredMeeting;
    },
    fieldsLength(){
      return Object.keys(this.filteredFields).length;
    }
  },
  methods : {
    fieldsWidth(idx){
      let widthPercentage;
      if(this.fieldsLength === 5){
        switch (idx){
          case 0 : widthPercentage = '22%'; break;
          case 1 : widthPercentage = '22%'; break;
          case 2 : widthPercentage = '14%'; break;
          case 3 : widthPercentage = '14%'; break;
          case 4 : widthPercentage = '8%'; break;
        }
      } else if(this.fieldsLength === 4){
        switch (idx){
          case 0 : widthPercentage = '40%'; break;
          case 1 : widthPercentage = '22%'; break;
          case 2 : widthPercentage = '22%'; break;
          case 3 : widthPercentage = '16%'; break;

        }
      } else {
        switch (idx){
          case 0 : widthPercentage = '45%'; break;
          case 1 : widthPercentage = '35%'; break;
          case 2 : widthPercentage = '20%'; break;


        }
      }
      return widthPercentage;
    }
  },
  // methods : {
  //   characterResolver(fieldTextContent){
  //         let sanitizedText;
  //         if(fieldTextContent.length >= 25){
  //           sanitizedText = ('...').concat(fieldTextContent.slice(0, 24))
  //         } else {
  //           sanitizedText = fieldTextContent;
  //         }
  //         return sanitizedText;
  //   }
  // }
}
</script>

<style scoped>
.meeting{
  width: 100%;

}
.meeting:last-child{
  border-bottom: .1rem solid #b8b8b8;
}
.meeting-fields{
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
}

.meeting-fields > li {
  width: 33%;
}

.field{
  font-size: 1.2rem;
  color : #6e6e6e;
  height: 4.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.field:first-child{
  justify-content: flex-end;
}
.field:last-child{
  color : black;
  font-weight: bold;
}
.meeting-fields > li {
  width: 33%;
}
@media (min-width: 540px) and (max-width: 767px) {
  .meeting-fields :first-child{
    display: flex;
    justify-content: flex-end;
  }
}

</style>
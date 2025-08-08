<template>
<li class="field">
  <div v-if="fieldType === 'date'" class="field--date">
    <the-date :date="fieldValue"></the-date>
  </div>
  <div v-else-if="fieldType === 'time'" class="field--time">
<!--    <the-time :to-time="fieldValue.toTime" :from-time="fieldValue.fromTime"></the-time>-->
  </div>
  <div v-else-if="fieldType === 'title' || fieldType === 'roomName'" class="field--overflow">
    {{fieldValue}}
  </div>
  <div v-else @click="showMeetingData" >...</div>
</li>

  <base-modal is-blur="true" :open="isMeetingDataOpen">
    <template #modal-header>
      <div class="header-container">
        <div>
          <div style="cursor: pointer" @click="closeInvitationModal">
            &#10060;
          </div>
        </div>
      </div>
    </template>
    <template #modal-body>
      <div class="moderator__name">
        <h2 ref="h2">{{meetingTitle}}</h2>
      </div>
      <div class="modal-body__name">
        {{firstNameManager + lastNameManager + '  '}}
        <span>(مدیر)</span>
      </div>
      <div class="modal-body__room-name">
        {{roomName}}
      </div>
      <div class="room-capacity">
        {{ 'ظرفیت'+' ' + roomCapacity+ ' ' + 'نفر'}}
      </div>
      <div class="invited__user">
        <invited-members :is-table="true" :meeting-id="meetingId"></invited-members>
      </div>
      <div class="room__date-container">
        <div class="room__date">
          {{date}}
        </div>
        <div class="room__time">
          {{time}}
        </div>
      </div>
    </template>
  </base-modal>
</template>

<script>
import TheDate from "./TheDate";
import BaseModal from "./UI/BaseModal";
import InvitedMembers from "./InvitedMembers";
// import CloseModal from "./UI/Icons/CloseModal";
export default {
  name: "TabularMeetingField",
  components: { BaseModal, TheDate,InvitedMembers},
  data(){
    return {
      isMeetingDataOpen:false,
      invitedUsers:[]
    }
  },
  props : ['fieldType','meetingId', 'fieldValue','meetingTitle','firstNameManager','meetingToSchd','lastNameManager','roomName','meetingFromSchd','roomCapacity'],
  computed : {
    meetingTitleResolver(){
      return this.characterResolver(this.meeting.title)
    },
    date(){
      const dateArr = this.meetingFromSchd.split(' ')

      return dateArr[0]
    },
    time(){
      const dateArrFrom = this.meetingFromSchd.split(' ')
      const dateArrTo = this.meetingToSchd.split(' ')

      return dateArrFrom[1] + ' ' +  'تا' + ' ' + dateArrTo[1]
    },
  },
  methods : {

    characterResolver(fieldTextContent){
      let sanitizedText;
      if(fieldTextContent.length >= 25){
        sanitizedText = ('...').concat(fieldTextContent.slice(0, 24))
      } else {
        sanitizedText = fieldTextContent;
      }
      return sanitizedText;
    },
    showMeetingData(){
      this.isMeetingDataOpen = true
    },
    closeInvitationModal(){
      this.isMeetingDataOpen = false
    }
  },
  mounted() {
    this.eventBus.on('close-modal',()=>{
      this.isMeetingDataOpen = false
    })
  }

}
</script>

<style scoped>
.field{
  color : #6e6e6e;
  /*width: 9rem;*/
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 33%;
  position: relative;


}
.field:last-child{
  font-size: 2rem;
  cursor: pointer;
  margin-left:3.5rem;

}


.field--date{
  display: flex;
}
.field--time{
  display: flex;
  flex-direction: row;justify-content: center;
position: absolute;
  left: 48%;
  transform: translateX(-75%);


}
.field--overflow{
  width: 100%;
  direction: rtl;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 1.2rem;
  /*text-align: right;*/
  text-overflow: ellipsis;
  text-align: right;
  max-width: 22rem;
  position: absolute;
  right: 0.5rem;

}
.header-container{
  width: 40rem;
  height: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: none;
}
.moderator__name{
  margin-top: -1rem;
  direction: rtl;
  color: rgba(0, 0, 0, 0.8);
  font-size: 1.5rem;
  font-weight: bold;


}
h2{
  font-size: 1.9rem;
}

.modal-body__name{
  position: relative;
  width: 40rem;
  height: 3rem;
  font-size: 1.6rem;
  margin-top: 1rem;
  font-weight: bold;
  color: rgba(31, 31, 31, 0.8);
}

.modal-body__room-name{
  width: 40rem;
  height: 2rem;
  color: #6e6e6e;
  font-size: 1.4rem;
  margin-top: 0.2rem;
  margin-bottom: -0.2rem;
}
.room-capacity{
  width: 40rem;
  height: 3rem;
  margin-top: 0.5rem;
  color:#6e6e6e;
}
.room__date-container{
  display: flex;
  height: 5rem;
  width: 40rem;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  color: #6e6e6e;
}
.room__date{
  display: flex;
  align-items: center;
  width: auto;
  direction: rtl;
  color: #6e6e6e;
}
.invited__user{
  width: 40rem;
  max-height: 50vh;
  overflow-y: scroll;
margin-bottom: 2rem;
  overflow-wrap: break-word;
  margin-top: 0.5rem;
  color: #6e6e6e;
}

@media (min-width: 320px) and (max-width: 540px) {
  .header-container{
    width: 70vw;
  }
  .modal-body__name{

    width: 70vw;

  }
  .modal-body__room-name{
    width: 70vw;

  }
  .room-capacity{
    width: 70vw;

  }
  .room__date-container{
    width: 70vw;
  }
  .invited__user{
    width: 70vw;

  }
  .field--overflow{

    white-space : nowrap;
    overflow : hidden;
    text-overflow : ellipsis;
    max-width: 10rem;



  }

}
@media (min-width: 541px) and (max-width: 767px) {
  .header-container{
    width: 70vw;
  }
  .modal-body__name{

    width: 70vw;

  }
  .modal-body__room-name{
    width: 70vw;

  }
  .room-capacity{
    width: 70vw;

  }
  .room__date-container{
    width: 70vw;
  }
  .invited__user{
    width: 70vw;

  }
  .field--overflow{

    white-space : nowrap;
    overflow : hidden;
    text-overflow : ellipsis;
    max-width: 15rem;


  }
}
</style>
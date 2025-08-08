<template>
  <participants-filter :participants-number="participantsNumber"  :am-i-moderator="amIModerator" :sub-moderator="subModerator" @search-info="getFilterInfo" @status-filterer-info="getFilterInfo" @initial-status-filter="getInitialStatusVal"></participants-filter>
  <div class="participants">
    <ul  class="participants-list"
         v-if="filterType ===1">
      <the-participant
          :am-i-substitution-moderator="amISubstitutionModerator"
          :is-absent="filterType ===2"
          v-for="(participant, index) in sortFilteredUsersOnline"
          :mic-on-count="micOnCount"
          :key="participant.userId + index"
          :permission="participant.permission"
          :participant-role="participant.participantRole"
          :am-i-moderator="amIModerator"
          :login-way-enum="participant.loginWayEnum"
          :participant-status="participant.participantStatus"
          :participant-name="(participant.displayName !== null && participant.displayName !== undefined && participant.displayName !== '') ? participant.displayName : 'ناشناس(بدون نام)'"
          :participant-id="participant.userId"
          :participants-length="sortFilteredUsersOnline.length"
          :is-chat-enable="isChatEnable"
          :is-webinar="isWebinar"
          :disable-participant="participant.failedPublish"
          :is-moderator-substitute-activated="isModeratorSubstituteActivated"
          :is-guest="participant?.loginWayEnum === 'GUEST'"
          :connection-id = "participant.connectionId"
      >
      </the-participant>

    </ul>
    <ul  class="participants-list"
         v-if="filterType ===2"
    >
      <the-participant
          :am-i-substitution-moderator="amISubstitutionModerator"
          :is-absent="filterType ===2"
          v-for="(participant, index) in filteredUserssOffline"
          :key="participant.userId + index"
          :permission="participant.permission"
          :am-i-moderator="amIModerator"
          :participant-status="participant.participantStatus"
          :participant-name="(participant.displayName !== null && participant.displayName !== undefined && participant.displayName !== '') ? participant.displayName : 'ناشناس(بدون نام)'"
          :participant-id="participant.userId"
          :is-webinar="isWebinar"
          :is-guest="participant?.loginWayEnum === 'GUEST'"
      >
      </the-participant>

    </ul>
    <ul class="participants-list"
        v-if="filterType ===3">
      <the-participant
          :am-i-substitution-moderator="amISubstitutionModerator"
          v-for="(participant, index) in sortFilteredUsers"
          :is-absent="participant.participantStatus === 'OFFLINE'"
          :key="participant.userId + index"
          :permission="participant.permission"
          :participant-role="participant.participantRole"
          :am-i-moderator="amIModerator"
          :participant-status="participant.participantStatus"
          :participant-name="(participant.displayName !== null && participant.displayName !== undefined && participant.displayName !== '') ? participant.displayName : 'ناشناس(بدون نام)'"
          :participant-id="participant.userId"
          :is-webinar="isWebinar"
          :is-chat-enable="isChatEnable"
          :is-guest="participant?.loginWayEnum === 'GUEST'"
          :connection-id = "participant.connectionId"
      >
      </the-participant>

    </ul>
  </div>
</template>

<script>
import ParticipantsFilter from "./ParticipantsFilter";
import TheParticipant from "./TheParticipant";


export default {
  name: "ParticipantsSection",
  components: {TheParticipant, ParticipantsFilter},
  props:['amISubstitutionModerator','isWebinar','isChatEnable','subModerator', 'isModeratorSubstituteActivated'],
  data() {
    return {
      handRaisedIndex:0,
      temp:1,
      filterType: 1,
      participantsStatus: '',
      searchStr: '',
      micOnCount: 0,
      participantLength:  this.$store.getters.participants.length,
    }
  },
  computed: {
    filteredUserssOnline() {
      return this.participants.filter(participant => participant?.displayName?.includes(this.searchStr) && participant?.participantStatus === 'ONLINE')
    },
    sortFilteredUsersOnline(){
      const filteredUsers = this.filteredUserssOnline.slice()
      if (+this.$store.getters.userId === +this.$store.getters.moderatorId || this.isModeratorSubstituteActivated){
        const hasHandRaised = filteredUsers.some(
            p => p.permission.handStatus !== 'none'
        );

        if (!hasHandRaised) {
          // Only sort by displayName
          filteredUsers.sort((a, b) =>
              a.displayName.localeCompare(b.displayName)
          );
        } else {
          // Sort by handStatus priority, then displayName
          const handPriority = {
            granted: 0,
            waiting: 1,
            none: 2
          };

          filteredUsers.sort((a, b) => {
            const statusA = a.permission.handStatus;
            const statusB = b.permission.handStatus;

            if (handPriority[statusA] !== handPriority[statusB]) {
              return handPriority[statusA] - handPriority[statusB];
            }

            return a.displayName.localeCompare(b.displayName);
          });
        }
      }else {
          // Only sort by displayName
          filteredUsers.sort((a, b) =>
              a.displayName.localeCompare(b.displayName)
          );
      }

      filteredUsers.forEach((el,index,wholeArr)=>{
        if(el.participantRole  === 'MODERATOR' || el.participantRole  === 'MODERATOR'){
          wholeArr.splice(index,1);
          wholeArr.unshift(el)
        }
      })
      return filteredUsers

    },



    filteredUserssOffline() {
      return this.participants.filter(participant => participant?.displayName?.includes(this.searchStr) && participant?.participantStatus === 'OFFLINE')
      // return this.participants.filter(participant => participant.participantStatus === 'OFFLINE')

    },

    filteredUserss() {
      return this.participants.filter(participant => participant?.displayName?.includes(this.searchStr))
      // return this.participants
    },
    sortFilteredUsers(){
      const onlineUsers = this.sortFilteredUsersOnline.filter((el)=>{
        return el.participantStatus === 'ONLINE'
      })
      const offlineUsers = this.filteredUserss.filter((el)=>{
        return el.participantStatus !== 'ONLINE'
      })
      const allUsers = onlineUsers.concat(offlineUsers)
      allUsers.forEach((el,index,wholeArr)=>{
        if(el.participantRole  === 'MODERATOR' || el.participantRole  === 'MODERATOR'){
          wholeArr.splice(index,1);
          wholeArr.unshift(el)
        }
      })
      return allUsers

    },
    participantsNumber(){
      return [{label:this.$t("onlineParticipants"), numbers:this.filteredUserssOnline.length},{label:this.$t("offlineParticipants"), numbers:this.filteredUserssOffline.length},{label:this.$t("all"),numbers:this.filteredUserss.length}]
    },
    participants() {
      if (this.$store.getters.amIModerator || this.isModeratorSubstituteActivated){
        const index  = this.$store.getters.participants.findIndex((participant) =>{
          return participant.permission.handStatus === "waiting"
        })
        if (index !== -1) {
          this.eventBus.emit('is-there-hand-raise-waiting-mode', true)
        }else {
          this.eventBus.emit('is-there-hand-raise-waiting-mode', false)
        }
      }
      return this.$store.getters.participants
    },
    amIModerator() {
      if (this.$store.getters.meetingType !== 'meeting'){
        return this.$store.getters.amIModerator;
      }else {
        return false
      }

    }
  },
  methods: {
    updateParticipantPublishStatus(id){
      const idx = this.filteredUserssOnline.findIndex((el) => {
        let userId = id.toString()
        return el.userId === userId
      })
      if (idx !== -1) {
        this.filteredUserssOnline[idx].failedPublish= true
      }
    },
    comparisonAndAdd(participants) {
      this.participants = []
      const tempArr = [];
      for (const participant of Array.from(participants)) {
        const tempObj = {label: participant.displayName, userId: participant.userId};
        tempArr.push(tempObj);
      }
      this.participants = tempArr
    },
    getInitialStatusVal(val) {
      this.participantsStatus = val.label
    },
    getFilterInfo(info, type) {
      if (type === 'search') {
        this.searchStr = info;
      } else {
        this.participantsStatus = info.label;
      }
      switch (this.participantsStatus) {
        case  this.$t("onlineParticipants"):
          this.filterType = 1
          break;
        case this.$t("offlineParticipants") :
          this.filterType = 2
          break;
        case this.$t("all"):
          this.filterType = 3
          break
      }
    },
    countMicOn(arr){
      this.micOnCount = 0
      arr.forEach((el)=>{
        if (el.permission.mic){
          this.micOnCount += 1
        }
      })
    }
  },

  mounted() {
    // this.eventBus.on("toggle-moderator-substitute", ({stat}) => {
    //   this.isModeratorSubstituteActivated = stat;
    // });
    // this.emitter.on("UserIsNotInPublisherList", (userid) => {
    //   this.updateParticipantPublishStatus(userid)
    // });
  },

  created(){
    this.filteredUserss = [...this.participants]
  },


}
</script>

<style scoped>
.participants{
  width: 100%;
  height: calc(100% - 13rem);
}
.participants-list{
  margin-top: 1rem;
  width: 100%;
  direction: rtl;
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.participants-list::-webkit-scrollbar{
  width: .6rem;
  height: 100%;
  background-color: transparent;
}
.participants-list::-webkit-scrollbar-thumb{
  width: 100%;
  border-radius: 20rem;
  background-color: #ccc;
}
</style>

<template>
  <div class="private-chat-list__container">
    <div class="private-chat-list__search">
      <input type="text" class="private-chat-list__input" :placeholder="$store.getters.t('searching-for-people\'s-names')" @focus="focusInput" @blur="blurInput" @keyup="searchUser" v-model.trim="searchedName" :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr'}"/>
      <img draggable="false" style="position: absolute; right: 1rem;top:1rem" src="/img/search.svg" alt="not-loaded">
      <ul v-if="foundParticipants.length > 0" class="private-chat-list__Participants">
        <li v-for="participant in foundParticipants" :key="participant.participantId" @click="goToPrivateChat(participant)">
          {{participant.label}}
        </li>
      </ul>
    </div>
    <ul class="private-chat-list__ul">
<private-chat-list-element v-for="participant in chatList" :invited-members="invitedMembers" :key="participant" :participant="participant"></private-chat-list-element>
    </ul>
  </div>
</template>


<script>
import PrivateChatListElement from "@/components/PrivateChatListElement.vue";
import RestClient from "@/api/restClient";
// import invitedMembers from "@/components/InvitedMembers.vue";

export default {
  name: "PrivateChatList",
  components: {PrivateChatListElement},
  props:['participantsInMyChatList'],
  data(){
    return {
      searchedName: '',
      foundParticipants:[],
      timer:null,
      restClientInvite: new RestClient('invite'),
      invitedMembers:[],
      allParticipants:[]
    }
  },
  computed:{
    chatList(){
      return this.participantsInMyChatList?.filter(participant => participant?.label)
    },
  },
  methods:{
    comparisonAndAdd(participants) {
      const tempArr = [];

      for (const participant of participants) {
        const tempObj = {label: participant.displayName, participantId: participant.userId};
        if (tempObj.label !== this.$store.getters.displayName) {
          tempArr.push(tempObj);
        }
      }
      this.allParticipants = tempArr
    },
    searchUser() {
      const inpValue = this.searchedName;
      clearTimeout(this.timer);
      if (inpValue === ''){
        this.foundParticipants = this.allParticipants
      }else{
        this.timer = setTimeout(()=>{
          // const onlineParticipants = this.$store.getters.displayedChatList
          this.foundParticipants = this.allParticipants.filter((el) => {
            if ((el.label)?.includes(inpValue) && inpValue.length !== 0) {
              return true
            }
          })
        },100)
      }


    },
    focusInput(){
      if (this.searchedName === ''){
        this.foundParticipants = this.allParticipants
      }
    },
    blurInput(){
      if (this.searchedName === ''){
        setTimeout(()=>{
          this.foundParticipants = []
        },200)

      }
    },
    goToPrivateChat(participant){
      this.eventBus.emit('go-to-private-chat',participant)
    },
  },
  mounted() {
    const allOnlineParticipants = this.$store.getters.participants.filter((el)=>{
      return el?.participantStatus === "ONLINE"
    })
    this.comparisonAndAdd(allOnlineParticipants)
    this.eventBus.on('p-left', (participants) => {
      this.comparisonAndAdd(participants)

    });
    this.eventBus.on('p-joined', (participants) => {
      this.comparisonAndAdd(participants)
      for (const element of participants) {
        const idx = this.messages.findIndex((el) => {
          return el.userId === element.userId
        })
        if (idx !== -1) {
          this.messages[idx].label = element.displayName
        }
        const index = this.allMessagesInChat.findIndex((el) => {
          return el.id === element.userId
        })
        if (index !== -1) {
          this.allMessagesInChat[index].label = element.displayName
        }
      }

    });
    // this.restClientInvite.getInvitedUserPhoto(this.$store.getters.roomId).then((response) => {
    //   this.invitedMembers = response.data.filter((user) => {
    //     // let imgURL = null
    //     // if (user.imgFile){
    //     //   imgURL = `data:image/jpeg;base64,${user.imgFile}`;
    //     // }
    //
    //     return user?.imgFile
    //   })
    // })
    //     .catch((error) => {
    //       console.error(error)
    //     })
  }
}
</script>
<style scoped>
.private-chat-list__container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.6rem 1.4rem;
}

.private-chat-list__search {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  position: relative
}
.private-chat-list__input {
  width: 100%;
  background-color: #F6F6F7;
  font-size: 1.3rem;
  height: 4rem;
  font-weight: 400;
  -webkit-appearance: none;
  border-radius: 0.8rem;
  border: 0.1rem solid #eaeaea;
  padding: 0 4rem 0 0.8rem;

}

.private-chat-list__input:focus {
  outline: 0;
  background-color: transparent;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
}
.private-chat-list__ul {
  width: 100%;
  display: flex;
  flex-direction: column;
  direction: rtl;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  gap: 0.8rem;
}
.private-chat-list__Participants{
  position: absolute;
  top: 3.5rem;
  z-index: 10;
  max-height: 30rem;
  overflow-y: auto;
  width: 100%;
  background-color: #F6F6F7;
  border-radius: 0.8rem;
  border: 0.1rem solid #eaeaea;
  border-top: none;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);

}
.private-chat-list__Participants > li{
  z-index: 10;
  height: 4rem;
  width: 100%;
  border-bottom: 0.1rem solid #DCDADA;
  display: flex;
  align-items: center;
  direction: rtl;
  padding: 0 0.8rem;
  cursor: pointer;
}
.private-chat-list__Participants > li:hover{
  background-color: #f5f4f4;
}
.private-chat-list__Participants > li:last-child{
  border-bottom: none;
}
.private-chat-list__Participants > li:first-child{
  border-top: 0.1rem solid #DCDADA;
}
</style>

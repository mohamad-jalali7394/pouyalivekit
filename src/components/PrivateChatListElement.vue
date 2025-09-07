<template>
  <div class="private-chat-list-element__container" @click="goToPrivateChat">
    <div class="private-chat-list-element--participant">
      <img draggable="false" v-if="!imgURL" src="/img/contact.svg" alt="not loaded" style="width: 3.2rem" />
      <img draggable="false" v-else :src="imgURL" alt="not loaded" style="width: 3.2rem;height: 3.2rem;border-radius: 50%" />
      <div class="private-chat-list-element--participant-name__fragment">
          <div class="private-chat-list-element--participant-name">
           {{ participant.label }}


          </div>

        <div class="private-chat-list-element--participant-last-message">

          <span>
            {{lastMessage}}
          </span>
           <span v-if="lastMessageLength > 20">...</span>
          </div>
        <div>
        </div>

      </div>
    </div>

<div class="private-chat-list-element--time__fragment">
  <div> {{lastMessageTime}}</div>
  <div v-show="participant.unreadMessages.length > 0">{{participant.unreadMessages.length}}</div>

</div>
  </div>
</template>


<script>
export default {
  name: "PrivateChatListElement",
  props:['participant','invitedMembers'],
  data(){
    return {
      imgURL:'',
    }
  },
  watch:{
    invitedMembers:{
      immediate:true,
      deep:true,
      handler(val){
        if (val?.length > 0) {
          const index = val.findIndex((el)=>{
            return +this.participant.participantId === +el.userId
          })
          if (index !== -1){
            this.imgURL = `data:image/jpeg;base64,${val[index].imgFile}`
          }
        }
      }
    }
  },
  computed:{
   lastMessage(){
     if(this.participant.unreadMessages.length > 0){
       return this.participant.unreadMessages[this.participant.unreadMessages.length - 1].text.slice(0,20)
     }else {
       return this.participant.messages[this.participant.messages.length - 1].text.slice(0,20)
     }
   },
    lastMessageLength(){
      if(this.participant.unreadMessages.length > 0){
        return this.participant.unreadMessages[this.participant.unreadMessages.length - 1].text.length
      }else {
        return this.participant.messages[this.participant.messages.length - 1].text.length
      }
    },
    lastMessageTime(){
      if(this.participant.unreadMessages.length > 0){
        return this.participant.unreadMessages[this.participant.unreadMessages.length - 1].time
      }else {
        return this.participant.messages[this.participant.messages.length - 1].time
      }
    }
  },
  methods:{
    goToPrivateChat(){
      console.error(this.participant)
      this.eventBus.emit('go-to-private-chat',this.participant)
    }
  },
  mounted() {
    const index = this.invitedMembers.findIndex((el)=>{
      return +this.participant.participantId === +el.userId
    })
    if (index !== -1){
      this.imgURL = `data:image/jpeg;base64,${this.invitedMembers[index].imgFile}`
    }
  }
}
</script>
<style scoped>
.private-chat-list-element__container {
  width: 100%;
  height:5rem ;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 0.1rem solid #DCDADA;
}
.private-chat-list-element--participant{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 3.5rem;
  gap: 0.8rem;
}
.private-chat-list-element--participant-name__fragment{
  font-size: 1.4rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.private-chat-list-element--participant-name{
  font-weight: bold;
  font-size:1.4rem ;
  color: #292933;
}
.private-chat-list-element--participant-last-message{
  font-weight: 400;
  font-size:1.1rem ;
  color: #292933;
}
.private-chat-list-element--time__fragment{
  height: 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.private-chat-list-element--time__fragment > div:first-child {
  font-size: 1.2rem;
  color:#75758F;
  font-weight: 400;
}
.private-chat-list-element--time__fragment > div:last-child {
  font-size: 1.2rem;
  color:white;
  font-weight: 400;
  background-color:#FFA024;
  padding:0.1rem 0.6rem;
  border: 0.1rem solid transparent;
  border-radius: 2rem;
}
</style>

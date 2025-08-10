<template>
    <div v-if="!isMobile" class="chat-container" >
    <section class="messages-from">
      <div ref="chatContainer" @scroll="scroll"
           :class="{'chat-container__main-body1':!pvChat, 'chat-container__main-body2':pvChat}">
        <base-message
            v-for="(val, idx) in selectedChat.messages"
            :key="val"
            :idx="idx"
            :text-message="val.text"
            :message-sender="val.label"
            :repeated-name="selectedIdx.includes(idx) || idx === 0"
            :message-time="val.time"
            :last-message-read-index="selectedChat?.lastMessageReadIndex"
        >
        </base-message>

      </div>
    </section>
    <section class="messages-to">
      <div class="message-input">
        <textarea v-if="isInputVisible" @keydown="enterTOSendMessage" ref="textarea"  @focus="sendFocusedStat" @blur="sendBluredStat" :placeholder='$store.getters.t("writeMessage")'
                  v-model.trim="chatText" :style="{direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr', padding : $i18n.locale === 'fa' ? '1.2rem .5rem 0 3.8rem' : '1.2rem 3.8rem 0 .5rem'}"></textarea>
        <img draggable="false" src="/img/send-message-deactive.svg" alt="not loaded" :class="$i18n.locale === 'fa' ? 'send__arrow-rtl' : 'send__arrow-ltr'" v-show="!textareaIsActive">
        <img draggable="false" src="/img/send-message-active.svg" alt="not loaded" :class="$i18n.locale === 'fa' ? 'send__arrow-rtl' : 'send__arrow-ltr'" @click="sendMessage" v-show="textareaIsActive">

      </div>
    </section>
  </div>


  <div v-else class="chat-container__mobile" >
    <section class="messages-from__mobile">
      <div ref="chatContainer" @scroll="scroll"
           :class="{'chat-container__main-body1':!pvChat, 'chat-container__main-body2':pvChat}">
        <base-message
            v-for="(val, idx) in selectedChat.messages"
            :key="val"
            :idx="idx"
            :text-message="val.text"
            :message-sender="val.label"
            :repeated-name="selectedIdx.includes(idx) || idx === 0"
            :message-time="val.time"
            :last-message-read-index="selectedChat?.lastMessageReadIndex"
        >
        </base-message>

      </div>
    </section>
    <section class="messages-to__mobile">
      <div class="message-input">
       <textarea class="mobile__textarea" @keyup="enterTOSendMessage" ref="textarea"
                 :placeholder='$store.getters.t("writeMessage")' v-model.trim="chatText" :style="{direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr', padding : $i18n.locale === 'fa' ? '1.2rem .5rem 0 3.8rem' : '1.2rem 3.8rem 0 .5rem'}"></textarea>
        <img draggable="false" src="/img/send.svg" alt="not loaded"  :class="$i18n.locale === 'fa' ? 'send__arrow-rtl' : 'send__arrow-ltr'" v-if="!textareaIsActive">
        <img draggable="false" src="/img/activatedSend.svg" alt="not loaded" class="send__arrow" :class="$i18n.locale === 'fa' ? 'send__arrow-rtl' : 'send__arrow-ltr'"  @click="sendMessage" v-else>

      </div>
    </section>
  </div>
</template>
<script>

import BaseMessage from "./BaseMessage.vue";
import {nextTick} from "vue";
import DetectMobile from "../utils/detectMobile";
import webSocketClient from "@/webSocketClient";
export default {
  name: "ChatBox",
  components: { BaseMessage},
  props: ['SideBarHeight', 'messageReceived','insideSidebar','chatWith','isChatOpen'],
  inject: ['sideBarStatus'],
  data() {
    return {
      isInputVisible:true,
      isMobile:false,
      isDropDownOpen: false,
      chatContainerHeight: this.SideBarHeight,
      unreadMessagesCounter: 0,
      protocol: ['http://', 'https://', 'www.'],
      textareaIsActive: false,
      keysSet: new Set(),
      selectedIdx: [],
      sameTexts: [],
      myDisplayName: '',
      isScrolledTop: false,
      topScrollPosition: 0,
      isMessageSend: false,
      pvChat: true,
      chatText: '',
      persons: [
        {
          label: this.$store.getters.t("all"),
          userId: 'all'

        }
      ],
      selectedPerson: {
        label: this.$store.getters.t('all'),
        userId: 'all'
      },
      messages: [],
      isShown: false,
      allMessagesInChat: [{label: this.$store.getters.t("all"),userId:this.$store.getters.t("all") ,messages: []}],
      maxHeight:0,
      lastSelectedChat:{},
      lastSelectedParticipantForChat:{},
    }

  },
  watch: {
    chatText(val){
      if (val === '') {
      this.textareaIsActive = false
    }else {
      this.textareaIsActive = true
    }
      },
    sideBarInterior(val) {
      this.sideBarInterior = val
    },
    // sideBarStatus: {
    //   deep: true,
    //   handler(currentVal) {
    //     if (currentVal.value) {
    //       this.selectedPerson = {label: this.$store.getters.t("all"), userId: 'all'}
    //       if (this.sideBarInterior === 'chat') {
    //         this.messageReceived(false)
    //       }
    //     }
    //   }
    // },
    topScrollPosition(value) {
      this.topScrollPosition = value;
    },
    isChatOpen(val){
      if (!val) {
       const idx =  this.allMessagesInChat.findIndex((chat) =>{
          return chat.userId === this.lastSelectedParticipantForChat?.participantId
        })
        if (idx !== -1) {
          this.allMessagesInChat[idx].lastMessageReadIndex = this.allMessagesInChat[idx]?.messages.length
          console.error('ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss')
          console.error(this.allMessagesInChat[idx].lastMessageReadIndex)
        }
      }
    },
    chatWith:{
      deep:true,
      immediate:true,
      handler(val){

        if (val?.label){
          this.lastSelectedParticipantForChat = val
        }
      }
    },
  },
  methods: {
    sendFocusedStat(){
      this.eventBus.emit('is-focused')
    },
    sendBluredStat(){
      this.eventBus.emit('is-blured')
    },
    lineBreak(event) {
      if (event.key === 'Enter') {
        this.$refs.textarea.value.replace('\r\n', '')
      }
      if (event.key === 'Enter' || event.key === 'Shift') {
        this.keysSet.add(event.key)
      } else {
        this.keysSet.clear();
      }
      const keysArr = Array.from(this.keysSet);
      if ((keysArr.length === 2) && (keysArr[0] + keysArr[1] === 'ShiftEnter')) {
        this.$refs.textarea.value = this.$refs.textarea.value + ''
      }
    },
    scrollBottom() {
      setTimeout(() => {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        this.isScrolledTop = false;
        this.unreadMessagesCounter = 0
      }, 0)
    },
    scroll(e) {
      this.topScrollPosition = e.target.scrollTop;
      if ((this.$refs.chatContainer.scrollHeight - this.topScrollPosition) <= this.$refs.chatContainer.offsetHeight + 20) {
        this.isScrolledTop = false
      }
    },
    sendMessage() {
      if (this.chatText !== '') {
        if (this.chatText.match(/<[^>]*>?/gm)){
          this.chatText = this.chatText.replace(/</gm, '');
        }
        if (this.chatWith.label === this.$store.getters.t("all")) {
            webSocketClient.getInstance().sendGroupChat(this.chatText,this.$store.getters.displayName);
        } else {
          webSocketClient.getInstance().sendPrivateChat(this.chatText, this.chatWith.participantId, this.$store.getters.displayName)
        }
        let name = '';
        if (this.chatWith.label !== this.$store.getters.t("all")){
          name = this.chatWith.label;
        }else {
          name = this.$store.getters.t("all")
        }
        const idx = this.allMessagesInChat.findIndex(el => el.label === name)
        const date = new Date()
        let minutes = date.getMinutes()
        if (minutes.toString().length < 2){
          minutes = '0' + date.getMinutes()
        }
        let lastMessageReadIndex;
        const time = date.getHours() + ':' + minutes
        if (idx >= 0) {
          lastMessageReadIndex =  this.allMessagesInChat[idx].messages.length + 1
          this.allMessagesInChat[idx].lastMessageReadIndex = lastMessageReadIndex
          this.allMessagesInChat[idx].messages.push({label: this.$store.getters.t("you"), text: this.chatText,time:time})
        } else {
          lastMessageReadIndex = 1
          this.allMessagesInChat.push({label: name,userId: this.chatWith.participantId,lastMessageReadIndex:lastMessageReadIndex, messages: [{label: this.$store.getters.t("you"), text: this.chatText, time:time }]});
        }
        if (this.chatWith.label !== this.$store.getters.t("all")){
          this.$emit('send-chat',this.chatWith,{label: this.$store.getters.t("you"), text: this.chatText,time:time})
        }
        this.chatText = '';
        if (idx >= 0) {
          this.sameTexts = this.allMessagesInChat[idx]?.messages.forEach((chat, idx, wholeArr) => {
            if (chat?.label !== this.$store.getters.t("you") && wholeArr[idx + 1]?.label === this.$store.getters.t("you")) {
              this.selectedIdx.push(idx + 1)
            }
          })
        }


        this.sameTexts = this.allMessagesInChat[0]?.messages.forEach((chat, idx, wholeArr) => {
          if (chat?.label !== this.$store.getters.t("you") && wholeArr[idx + 1]?.label === this.$store.getters.t("you")) {
            this.selectedIdx.push(idx + 1)
          }
        })
        this.chatText = '';
        // setTimeout(()=>{
        nextTick(() => {
          this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        })
      }
    },
    enterTOSendMessage(e) {

      if (e.keyCode === 13 || e.keyCode === 16){
        this.keysSet.add(e.keyCode)
      }else{
        this.keysSet.clear()
      }
      if ((this.chatText !== '') && (this.keysSet.size === 1) && (this.keysSet.has(13)) && (this.isMobile === false)) {
        if (this.chatText.match(/<[^>]*>?/gm)){
          this.chatText = this.chatText.replace(/</gm, '/>');
        }
        if (this.chatWith.label === this.$store.getters.t("all")) {
          webSocketClient.getInstance().sendGroupChat(this.chatText,this.$store.getters.displayName);
        } else {
          webSocketClient.getInstance().sendPrivateChat(this.chatText, this.chatWith.participantId,this.$store.getters.displayName)
        }
        let name = this.$store.getters.t("all");
        if (this.chatWith.label !== this.$store.getters.t("all")){
          name = this.chatWith.label;
        }
        const idx = this.allMessagesInChat.findIndex(el => el.label === name)
        const date = new Date()
        let minutes = date.getMinutes()
        if (minutes.toString().length < 2){
          minutes = '0' + date.getMinutes()
        }
        const time = date.getHours() + ':' + minutes
        let lastMessageReadIndex;
        if (idx >= 0) {
          lastMessageReadIndex =  this.allMessagesInChat[idx].messages.length + 1
          this.allMessagesInChat[idx].lastMessageReadIndex = lastMessageReadIndex
          this.allMessagesInChat[idx].messages.push({label: this.$store.getters.t("you"), text: this.chatText,time:time})
        } else {
          lastMessageReadIndex = 1
          this.allMessagesInChat.push({label: name,userId: this.chatWith.participantId,lastMessageReadIndex:lastMessageReadIndex, messages: [{label: this.$store.getters.t("you"), text: this.chatText, time:time }]});
        }
        if (this.chatWith.label !== this.$store.getters.t("all")){
          this.$emit('send-chat',this.chatWith,{label: this.$store.getters.t("you"), text: this.chatText,time:time})
        }
        this.chatText = '';
        if (idx >= 0) {
          this.sameTexts = this.allMessagesInChat[idx]?.messages.forEach((chat, idx, wholeArr) => {
            if (chat?.label !== this.$store.getters.t("you") && wholeArr[idx + 1]?.label === this.$store.getters.t("you")) {
              this.selectedIdx.push(idx + 1)
            }
          })
        }


        this.sameTexts = this.allMessagesInChat[0]?.messages.forEach((chat, idx, wholeArr) => {
          if (chat?.label !== this.$store.getters.t("you") && wholeArr[idx + 1]?.label === this.$store.getters.t("you")) {
            this.selectedIdx.push(idx + 1)
          }
        })
        this.chatText = '';
        // setTimeout(()=>{
        nextTick(() => {
          this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        })
        // this.$refs.textarea.blur()
        this.keysSet.clear();
        this.isInputVisible = false
        // setTimeout(()=>{
        //   this.isInputVisible =true
        // },0)

        nextTick(()=>{
          this.isInputVisible =true
        })
        setTimeout(()=>{
          this.$refs.textarea.focus()
        },1)

      }else if(this.keysSet.size === 2 && ([...this.keysSet][0]=== 16)){
        this.keysSet.clear()
      }

    },
  },
  computed: {
    allParticipants() {
      const participants = this.$store.getters.participants.filter((user) => {
        return +user.userId !== +this.$store.getters.userId
      })
      return [{label :this.$store.getters.t("all") , userId : 'all'}, ...participants]
    },
    selectedChat() {
      if (this.chatWith.participantId === this.$store.getters.t("all")) {
        this.$emit('chat-type', 'public')
      } else {
        this.$emit('chat-type', 'private', this.chatWith.label)
      }
      let chat = []
      if (this.chatWith.label !== this.$store.getters.t("all")){
        chat = this.allMessagesInChat.filter(el => el.label === this.chatWith.label)
      }else {
        chat = [this.allMessagesInChat[0]]
      }
      if (chat[0]) {

        return chat[0]
      } else {
        return 0
      }
    }
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  mounted() {

    setTimeout(() => {
      console.log(this.$store.getters.innerParticipants)
      console.log(this.$store.getters.combinedExtServicesAndMediaServerParticipants);
    }, 10000)
    this.eventBus.on('chat-notification',()=>{
      this.eventBus.emit('unread-chats',this.messages)
    })
    // this.maxHeight = window.innerHeight - this.$refs.chatselector.getBoundingClientRect().bottom - 25 + 'px'
    this.eventBus.on('go-to-public-chat',()=>{
      this.selectedPerson = this.allParticipants[0]
    })
    this.eventBus.on('p-joined', (participants) => {
      for (const element of participants) {
        const idx = this.messages.findIndex((el) => {
          return el.userId === element.userId
        })
        if (idx !== -1) {
          this.messages[idx].label = element.displayName
        }
        const index = this.allMessagesInChat.findIndex((el) => {
          return el.userId === element.userId
        })
        if (index !== -1) {
          this.allMessagesInChat[index].label = element.displayName
        }
      }

    });

    this.eventBus.on('public-message-received', (data) => {
      let messageSender = {}
        messageSender = this.allParticipants.find((participant) => +participant.userId === +data.senderUserId);
      const date = new Date()
      let minutes = date.getMinutes()
      if (minutes.toString().length < 2){
        minutes = '0' + date.getMinutes()
      }
      const time = date.getHours() + ':' + minutes

      this.$emit('receive-public-chat', data.message)

      console.log('this is message sender name');
      let participantName;
      if(messageSender){
        participantName = messageSender.displayName;
        this.eventBus.emit('public-chat', participantName)
        this.allMessagesInChat[0].messages.push({label: participantName, text: data.message,time:time})
      }
      if(this.$refs.chatContainer && this.$refs.chatContainer.scrollHeight && this.topScrollPosition){
          if ((this.$refs.chatContainer.scrollHeight && (this.$refs.chatContainer.scrollHeight - this.topScrollPosition)) <= 2 * (this.$refs.chatContainer.offsetHeight)) {
            nextTick(() => {
              this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight
              this.isScrolledTop = false;
              this.unreadMessagesCounter = 0
            })
          } else if (this.chatWith.label === this.$store.getters.t("all")) {
            this.isScrolledTop = true;
            this.unreadMessagesCounter++
          }
        }

      const messagesIdx = this.messages.findIndex((message) => {
        return message.label === this.$store.getters.t("all")
      })
      if (messagesIdx === -1) {
        this.messages.push({label: this.$store.getters.t("all") , userId:'all'})
      }
      this.allMessagesInChat[0].messages.forEach((chat, idx, wholeArr) => {
        if( wholeArr[idx + 1]){
          if (chat.label !== participantName && wholeArr[idx + 1].label === participantName) {
            this.selectedIdx.push(idx + 1)
          }
        }
      });

      if (this.isChatOpen && this.chatWith.label === this.$store.getters.t("all")){
        this.allMessagesInChat[0].lastMessageReadIndex = this.allMessagesInChat[0].messages.length
      }
      this.eventBus.emit('messages-array-length', this.messages.length)

    });
    this.eventBus.on('private-message-received', ({senderUserId, message,senderUserName}) => {
      // const messageSender = this.allParticipants.find(participant => participant.userId === userId);
      const date = new Date()
      let minutes = date.getMinutes()
      if (minutes.toString().length < 2){
        minutes = '0' + date.getMinutes()
      }
      const time = date.getHours() + ':' + minutes

      this.$emit('receive-chat', {label:senderUserName, userId: senderUserId},{label: senderUserName, text: message,time:time})
      let participantName;
      if(senderUserName){
        participantName = senderUserName;
      }
      this.eventBus.emit('private-chat', {label:participantName, userId: senderUserId})
      // const senderDisplayName = data.name;
      const founduserIdx = this.allMessagesInChat.findIndex((participant) => {
      return  parseInt(participant.userId) === parseInt(senderUserId)
      })
      if (founduserIdx !== -1) {
        const date = new Date()
        let minutes = date.getMinutes()
        if (minutes.toString().length < 2){
          minutes = '0' + date.getMinutes()
        }
        const time = date.getHours() + ':' + minutes

        this.allMessagesInChat[founduserIdx].messages.push({label: participantName, text: message,time:time});
        if (((this.$refs.chatContainer && this.$refs.chatContainer.scrollHeight) - this.topScrollPosition) <= 2 * (this.$refs.chatContainer.offsetHeight)) {
          nextTick(() => {
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
            this.isScrolledTop = false;
            this.unreadMessagesCounter = 0
          })
        } else if (this.chatWith.label === participantName) {
          this.isScrolledTop = true;
          this.unreadMessagesCounter++
        }
      } else {
        const date = new Date()
        let minutes = date.getMinutes()
        if (minutes.toString().length < 2){
          minutes = '0' + date.getMinutes()
        }
        const time = date.getHours() + ':' + minutes

        console.log('this is executed');
        this.allMessagesInChat.push({label: participantName, userId:senderUserId ,messages: [{label: participantName, text: message,time:time}]});
      }
      const privateMessagesIdx = this.messages.findIndex((message) => {
        return message.label === participantName
      })
      if (privateMessagesIdx === -1) {
        this.messages.push({label: participantName,senderUserId})
      }
      this.eventBus.emit('messages-array-length', this.messages.length)

      const index = this.allMessagesInChat.findIndex(el => el.label === this.chatWith.label)
      if (this.isChatOpen && founduserIdx !== -1 && parseInt(this.allMessagesInChat[founduserIdx]?.userId) === parseInt(senderUserId)){
        this.allMessagesInChat[index].lastMessageReadIndex = this.allMessagesInChat[index].messages.length
      }
      this.allMessagesInChat[index]?.messages.forEach((chat, idx, wholeArr) => {
        if (chat?.label !== participantName && wholeArr[idx + 1]?.label === participantName) {
          this.selectedIdx.push(idx + 1)
        }
      });


      this.eventBus.emit('messages-array-length', this.messages.length)
    })
  },

}
</script>
<style scoped>
.chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 1.4rem;
}
.chat-container__mobile{
  width: 100%;
  height: 100%;
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 1.4rem;
}

.messages-from {
  display: flex;
  flex-direction: column;
  height:calc(100% - 8rem);
}
.messages-from__mobile{
  display: flex;
  flex-direction: column;
  height: calc(100% - 10em);
}


.unread-messages {
  display: flex;
  flex-direction: column;
  direction: rtl;
}

.unread-messages__header-rtl {
  margin-bottom: .8rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  direction: rtl;
  margin-top: 0.2rem
}
.unread-messages__header-ltr {
  margin-bottom: .8rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  direction: ltr;
  margin-top: 0.2rem
}

.unread-messages__header-rtl h3 {
  font-size: 1.2rem;
  font-weight: normal;

}
.unread-messages__header-ltr h3 {
  font-size: 1.2rem;
  font-weight: normal;

}
.badge-list-rtl {
  display: flex;
  flex-direction: row;
}
.badge-list-ltr {
  display: flex;
  flex-direction: row-reverse;
}


.badge-list__persons {
  display: flex;
  flex-direction: row;
  max-width: 28.5rem;
}

.badge-list::-webkit-scrollbar {
  width: 5px;

}

.badge-list p {
  direction: rtl;

}

.messages-to {
  height: 10%;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
}
.messages-to__mobile{
  height: 10rem;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.messages-to__inner-rtl {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 1.2rem;
  margin-top: 0.7rem;
}
.messages-to__inner-ltr {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1.2rem;
  margin-top: 0.7rem;
}

.messages-to__label {
  margin: 0.5rem;
  font-size: 1.2rem;
  position: relative;
  width: 7rem;
}

.unread-messages__counter {
  position: absolute;
  width: 2rem;
  height: 2rem;
  background-color: blue;
  font-size: 1.2rem;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  top: -5.2rem;
  right: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.messages-to__select {
  width: 25rem;
  height: 3.2rem;
}

.message-input {
  width: 100%;
  position: relative;
}

textarea {
  width: 100%;
  height: 4.1rem;
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  direction: rtl;
  padding-right: .5rem;
  padding-left: 3.8rem;
  padding-top: 1.1rem;
  background-color: #f1f3f4;
  display: flex;
  resize: none;
}

textarea::placeholder {
  color: rgba(0, 0, 0, 0.8);
}

textarea:focus {
  outline: none;

  box-shadow: 0 .2rem .8rem rgba(0, 0, 0, .26);
}

/*.message-input img {*/
/*  position: absolute;*/
/*  top: 50%;*/
/*  left: 0;*/
/*  transform: translate(50%, -50%) rotateZ(180deg);*/
/*}*/

.send__arrow-rtl {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(40%, -50%) rotateZ(180deg);
  width: 9%;
  cursor: pointer;
}
.send__arrow-ltr {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-30%, -50%) ;
  width: 9%;
  cursor: pointer;
}

.chat-container__main-body1 {
  width: 100%;
  height: 98%;
  /* border: solid 1px black; */
  direction: rtl;
  margin-bottom: 1rem;
  overflow-y: auto;
  overflow-x: hidden;

}

.chat-container__main-body2 {
  width: 100%;
  height: 98%;
  /* border: solid 1px black; */
  direction: rtl;
padding-left:1rem ;
  margin-bottom: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 3px;


}

::-webkit-scrollbar-track {
  background: transparent;


}

::-webkit-scrollbar-thumb {
  background: #7A7A7A;
  border-radius: 12px;


}

::-webkit-scrollbar-track-piece {
  height: 3px;

}


.badge-list__others {
  color:#95d1cc;
  border: solid .1rem #dadce0;
  border-radius: 1.1rem;
  height: 2.2rem;
  width: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  position: relative;
  cursor: pointer;
}

.unread-messages__more {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 12rem;
  max-height: 10rem;
  border: solid .1rem lightgray;
  z-index: 100;
  background-color: white;
  overflow-y: auto;
  /*left: -3rem;*
   */
  top: 2rem;
  left: -4rem;
  direction: ltr;
  border-radius: 1rem;
}

.unread-messages__more li:first-child {
  border-radius: 1rem 1rem 0 0;

}

.unread-messages__more li:last-child {
  border-radius: 0 0 1rem 1rem;
  border: 0.1rem solid transparent;

}

.participant {

  font-size: 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  height: 3rem;
  border-bottom: .1rem solid rgb(204, 198, 198);
  direction: rtl;
}

.participant:hover {
  background-color: rgb(235, 235, 245);
}

.tooltip {
  position: relative;

}

.tooltip .tooltip__text {
  visibility: hidden;
  max-width: 120px;
  background-color: rgba(60, 64, 67, 0.8);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: 100%;
  right: 50%;
  padding: 0.3rem 0.3rem;
  transform: translateX(50%);
  white-space: nowrap;
  /* margin-left: -20px; */

}

.tooltip:hover .tooltip__text {
  visibility: visible;
  white-space: nowrap;
}

.unread-messages__badge {
  position: absolute;
  top: -3.5rem;
  right: 1rem;
  cursor: pointer;
  z-index: 100;
}

@media only screen and (max-width: 1024px) {
  .send__arrow__mobile {
    width: 4%;
  }

  .messages-to__select__mobile {
    width: 35rem;
    height: 3.5rem;
  }

  .mobile__textarea {
    height: 4.5rem;
    padding-top: 1.2rem;
    font-size: 16px;
    padding-left: 7.8rem;
  }

}

@media only screen and (max-width: 540px) {
  .chat-container__mobile{
    width: 100%;
    height: 100%;
    margin-top: 1.2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .send__arrow__mobile {
    width: 6%;
  }

  .messages-to__select__mobile {
    width: 30rem;
    height: 3.5rem;
  }

  .mobile__textarea {
    height: 4.5rem;
    padding-top: 1.2rem;
    font-size: 16px;
  }
}

@media only screen and (min-width: 320px) and (max-width: 480px) {
  .chat-container__mobile{
    width: 100%;
    height: 100%;
    margin-top: 1.2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .send__arrow__mobile {
    width: 10%;
  }

  .messages-to__label__mobile {
    font-size: 1rem;
    margin-left: 0.5rem;
  }

  .messages-to__select__mobile {
    width: 25rem;
    height: 3.5rem;
  }

  .mobile__textarea {
    height: 5rem;
    padding-top: 1.3rem;
    font-size: 16px;
  }
}

@media only screen and (max-width: 319px) {
  .send__arrow__mobile {
    width: 9%;
  }

  .messages-to__label__mobile {
    font-size: 0.9rem;
    margin-left: 0.5rem;
  }

  .messages-to__select__mobile {
    width: 18rem;
    height: 3.5rem;
  }

  .mobile__textarea {
    height: 4rem;
    padding-top: 0.6rem;
    font-size: 16px;
  }
}
</style>

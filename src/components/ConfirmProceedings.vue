<template>
  <div class="proceedings-started" v-if="allProceedingsParagraphs.length > 0 && proceedingsCreated">
    <div style="width: 100%;display: flex;justify-content: center;font-size: 1.4rem" v-if="isProceedingsAnswered">
      <div style="color: #2AB459" v-if="isConfirmedProceedings">
        شما این  صورتجلسه را تایید کرده اید
      </div>
      <div style="color: #EC3737" v-else>
        شما این صورت جلسه را رد کرده اید
      </div>
    </div>
    <base-button
        v-if="!isProceedingsAnswered && !sending"
        :is-active="true"
        button-inner-txt="رد می‌کنم"
        :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
        :style-types="['large--button']"
        @click="rejectProceedings"
    >
    </base-button>
      <base-button
          v-if="!isProceedingsAnswered && !sending"
          :is-active="true"
          button-inner-txt="تایید می‌کنم"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
          :style-types="['large--button']"
          @click="confirmProceedings"
      >
      </base-button>
  </div>
  <div class="confirm-proceedings__container">
    <div class="confirm-proceedings__details">
      <div>
        <span>شماره صورتجلسه:</span>
        <span v-if="proceedingsNumber">{{proceedingsNumber }}</span>
        <div v-else style="position: relative;display: flex;justify-content: center;align-items: center">
          <div class="waiting-animation">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <div>
        <span>زمان ایجاد:</span>
        <span v-if="proceedingsDateCreated">{{proceedingsDateCreated}}</span>
        <div v-else style="position: relative;display: flex;justify-content: center;align-items: center">
          <div class="waiting-animation">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <div>
        <span>عنوان صورتجلسه</span>
        <span>{{$store.getters.session_name}}</span>
      </div>
      <div>
        <span>مسئول صورتجلسه:</span>
        <span v-if="proceedingsSecretary">{{proceedingsSecretary}}</span>
        <div v-else style="position: relative;display: flex;justify-content: center;align-items: center">
          <div class="waiting-animation">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="confirm-proceedings__Paragraph--fragment">
      <div v-if="allProceedingsParagraphs.length === 0 && notCompleteParagraphIndex === null" style="display: flex;font-size: 1.4rem;width: 100%;justify-content: center">درحال حاضر هیچ بندی تدوین نشده است</div>
      <made-proceedings-paragraph v-for="(paragraph, index) in allProceedingsParagraphs" :index="index" :key="paragraph.paragraphId" :paragraph="paragraph" :is-editing="paragraph.status === 'update'" :assignee="paragraph.assignee" :paragraph-text="paragraph.paragraphText" :paragraph-status="paragraph.status"></made-proceedings-paragraph>
      <div v-if="notCompleteParagraphIndex !== null && !isProceedingsCreated" style="display: flex;font-size: 1.4rem;width: 100%;gap: 0.4rem">
        <div style="display: flex;gap: 0.3rem">
          <span>بند شماره</span>
          <span>{{notCompleteParagraphIndex + 1}}</span>
          <span>در حال تدوین میباشد</span>
        </div>
       <div style="position: relative;display: flex;justify-content: center;align-items: center">
         <div class="waiting-animation">
           <div></div>
           <div></div>
           <div></div>
           <div></div>
         </div>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
import RestClient from "@/api/restClient";
import entityTypes from "@/statics/entityTypes";
// import room_handler from "../utilities/room_handler";
import BaseButton from "@/components/UI/BaseButton.vue";
import MadeProceedingsParagraph from "@/components/MadeProceedingsParagraph.vue";
export default {
  name: "ConfirmProceedings",
  components: {MadeProceedingsParagraph, BaseButton},
  props: ["proceedingsDateCreated","isProceedingsStarted","notCompleteParagraphIndex","allProceedingsParagraphs", "proceedingsSecretary", "proceedingsNumber","proceedingsCreated","isProceedingsAnswered"
    ,"isConfirmedProceedings","proceedingsId",'isProceedingsCreated'],
  data(){
    return {
      restClient: new RestClient(entityTypes.proceedings),
      isResultShowed:false,
      paragraphs:[],
      paragraphText:'',
      assignedParticipant:{name:'',id:''},
      createOrResult:'create',
      creationOrUpdatingMeetingResult: 'creation',
      meetingName:'',
      description:'',
      descriptionPlus:'',
      proceedingsResultList:[],
      allProceedings:[],
      isPassedThreeSeconds:false,
      isGetResult:false,
      resultAllProceedings:[],
      isDropDownOpen: false,
      selectedQuestion: "",
      date:'',
      sending:false
    }
  },
  methods:{
    showProceedingsDetails(){
      this.isResultShowed = !this.isResultShowed
    },
    deleteParagraph(data){
      if (data.paragraphId){
        const foundIndex = this.paragraphs.findIndex((el)=>{
          return +el.paragraphId === +data.paragraphId
        })
        if (foundIndex !== -1) {
          this.paragraphs.splice(foundIndex,1)
        }
      }else {
        this.paragraphs.pop()
      }
      // room_handler.deleteProceedingsParagraph(this.$store.getters.roomId,{
      //   paragraphId: data.paragraphId,
      //   paragraphIndex: +data.paragraphIndex + 1
      // })
    },
    completeParagraph(paragraph){
      const foundIndex = this.paragraphs.findIndex((el)=>{
        return +el.paragraphId === +paragraph.paragraphId
      })
      if (foundIndex !== -1) {
        this.paragraphs[foundIndex].paragraphText = paragraph.paragraphText
        this.paragraphs[foundIndex].assignedParticipant = paragraph.assignedParticipant
        if (paragraph.status === 'update'){
          // room_handler.editProceedingsParagraph(this.$store.getters.roomId,{
          //   ...paragraph
          // })
        }else {
          // room_handler.sendProceedingsParagraphData(this.$store.getters.roomId,{
          //   ...paragraph
          // })
        }

      }
    },
    confirmProceedings(){
      this.sending = true
      let data = {}
      if (!this.$store.getters.isPrivate){
        data = {
          meetingId: parseInt(this.$store.getters.roomId),
              agree: true,
            meetingProceedingsId: parseInt(this.proceedingsId),
            userId: parseInt(this.$store.getters.userId),
        }
      }else {
        data = {
          meetingId: parseInt(this.$store.getters.prRoomID),
              agree: true,
            meetingProceedingsId: parseInt(this.proceedingsId),
            userId: parseInt(this.$store.getters.userId),
        }
      }
      this.restClient.submitProceedings(data).then(()=>{
        this.eventBus.emit('is-proceedings-answered',true)
        if (!this.$store.getters.isPrivate){
          localStorage.setItem('answerProceeding',JSON.stringify({roomId: this.$store.getters.roomId,isAnswered: true,isConfirmed: true}))
        }else{
          localStorage.setItem('answerProceeding',JSON.stringify({roomId: this.$store.getters.prRoomID,isAnswered: true,isConfirmed: true}))
        }
        this.sending = false
      }).catch((error)=>{
        this.sending = false
        console.error(error)
      })

    },
    rejectProceedings(){
      this.sending = true
      this.restClient.submitProceedings({
        meetingId: parseInt(this.$store.getters.roomId),
        agree: false,
        meetingProceedingsId: parseInt(this.proceedingsId),
        userId: parseInt(this.$store.getters.userId),
      }).then(()=>{
        this.eventBus.emit('is-proceedings-answered',false)
        if (!this.$store.getters.isPrivate){
          localStorage.setItem('answerProceeding',JSON.stringify({roomId: this.$store.getters.roomId,isAnswered: true,isConfirmed: false}))
        }else{
          localStorage.setItem('answerProceeding',JSON.stringify({roomId: this.$store.getters.prRoomID,isAnswered: true,isConfirmed: false}))
        }
        this.sending = false
      }).catch((error)=>{
        this.sending = false
        console.error(error)
      })

    },
    getResultProceedings(id) {
      this.restClient
          .getResult(id)
          .then((response) => {
            // this.proceedingsResultList = response.filter((el)=>{
            //   return el.userId !== null
            // })
            this.proceedingsResultList = response

          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {});
    },
    createMeetingResult(){
      this.createOrResult = 'create'
      this.resultAllProceedings=[]
    },
    showResults(){
      this.getAllResultProceedings(this.$store.getters.roomId)
      this.createOrResult = 'result'
    },
    closeMeetingResult() {
      this.$emit("close-meeting-result");
      this.creationOrUpdatingMeetingResult = 'creation'
      this.createOrResult = 'create'
      this.resultAllProceedings=[]
    },
    goToPreviewPage(){
      this.date = new Date()
      this.creationOrUpdatingMeetingResult = 'update'
    },
    updateMeetingResult(){
      this.creationOrUpdatingMeetingResult = 'creation'

    },

  },

}
</script>

<style scoped>
.proceedings-not-started{
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
}
.proceedings-started{
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: space-between;
  bottom: 3rem;
  left: 0;
  padding: 0 1.4rem;
}
.confirm-proceedings__container{
  width: 100%;
  max-height: 100% ;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  overflow-y: auto;
}
.confirm-proceedings__details{
  width: 100%;
  padding: 0.8rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  font-weight: 400;
  font-size: 1.2rem;
  color: #292933;
  border-radius: 0.8rem;
  background-color: #F2F2F2;
}
.confirm-proceedings__details > div{
  width: 100%;
  display: flex;
  gap: 0.8rem;
  direction: rtl;
}
.proceedings__details-date-fragment{
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 33%;
}

.proceedings__details-input-proceedings-number{
  width:12.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.proceedings__details-location{
  width:calc(100% - 13.5rem);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.proceedings__details > div:last-child {
  height: 6.4rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
}
.proceedings__details-secretary{
  width: 100%;
  height: 4rem;
  background-color: white;
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  align-items: center;
  padding: 0 1.6rem 0 0;
  border-radius: 0.8rem;
}
.proceedings__details-secretary > span {
  color: #292933;
}
.proceedings--default-details{
  background-color: white;
  border-radius: 0.8rem ;
  border: 0.1rem solid transparent;
  height: 3.2rem;
  width: 100%;
  padding: 0 0.8rem;
  display: flex;
  gap: 0.4rem;
  align-items: center;
  font-weight: 400;
  font-size: 1.4rem;
  color: #292933;
}
.confirm-proceedings-action--footer {
  position: absolute;
  bottom: 2rem;
  width: 100%;
  height: 4rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.6rem;
}
.confirm-proceedings-action--footer__more {
  width: 4.8rem;
  height: 4.8rem;
  background-color: #F2F2F2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.8rem;
  cursor: pointer;
}
.confirm-proceedings__Paragraph--fragment {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap:1.6rem;
  direction: rtl;
  padding: 0 1.4rem;
}
.confirm-proceedings__Paragraph--action{
  width: 100%;
  display: flex;
  gap: 0.8rem;
  align-items: center;
  direction: rtl;
}
.waiting-animation {
  display: inline-block;
  position: relative;
  width: 15px;
  height: 3px;

  animation: infinite alternate;
  z-index: 10;
}
.waiting-for-editing-animation{
  display: inline-block;
  position: relative;
  width: 15px;
  height: 3px;

  animation: infinite alternate;
  z-index: 10;
}
.waiting-for-editing-animation div{
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #9E9EB2;
  z-index: 10;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}




.waiting-for-editing-animation div:nth-child(1) {
  left: 0;
  animation: waiting-animation1 .5s infinite;
}
.waiting-for-editing-animation div:nth-child(2) {
  left: 0;
  animation: waiting-animation2 .5s infinite;
}
.waiting-for-editing-animation div:nth-child(3) {
  left: 4px;
  animation: waiting-animation2 .5s infinite;
}
.waiting-for-editing-animation div:nth-child(4) {
  left: 8px;
  animation: waiting-animation3 .5s infinite;
}




.waiting-animation div {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: black;
  z-index: 10;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.waiting-animation div:nth-child(1) {
  left: 0;
  animation: waiting-animation1 .5s infinite;
}
.waiting-animation div:nth-child(2) {
  left: 0;
  animation: waiting-animation2 .5s infinite;
}
.waiting-animation div:nth-child(3) {
  left: 4px;
  animation: waiting-animation2 .5s infinite;
}
.waiting-animation div:nth-child(4) {
  left: 8px;
  animation: waiting-animation3 .5s infinite;
}

@keyframes waiting-animation1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes waiting-animation3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes waiting-animation2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(4px, 0);
  }
}
@keyframes ripple {
  from {
    opacity: 1;
    transform: scale(0) ;

  }
  to {
    opacity: 0;
    transform: scale(2);
  }
}


@keyframes ripple{
  0%{
    width: 15px;
    height: 15px;
    opacity: 1;
  }
  96%{
    width: 30px;
    height: 30px;
    opacity: 0;
  }
  100%{
    width: 35px;
    height: 35px;
    opacity: 0;
  }
}
</style>

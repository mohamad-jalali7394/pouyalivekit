<template>
  <div  class="confirm-descriptive-polling-details__container" :style="{backgroundColor: polling.isAnswered ? '#F2F2F2' : ''}">

    <div style="width: 100%;display: flex;flex-direction: column;align-items: center">

      <div  style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem;margin-bottom: 0.8rem">

        <div class="confirm-descriptive-polling-details-question-title">
          {{polling.title}}
        </div>
      </div>

      <div v-for="(pollElement, pollIdx) in polling.pollingData" :key="pollElement.questionId + pollIdx" style="width: 35.9rem; padding: 1.6rem;display: flex;flex-direction: column;gap: 0.8rem" :style="{'border-top': '0.1rem solid #DCDADA' ,'border-bottom':  '0.1rem solid #DCDADA' }">
        <div style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem">

          <div class="confirm-descriptive-polling-details-question-text">
            <span v-if="polling.pollingData.length > 1">{{(pollIdx + 1) + '.'}}</span>
            <span v-if="polling.pollingData.length > 1"></span>
            <span>{{pollElement.questionBody}}</span>

          </div>
        </div>
        <div style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem">
          <label style="color: #75758F">   {{$store.getters.t("answer")}}</label>
          <input v-if="isAnswerInputsRendered" :style="{cursor: polling.isAnswered ? 'not-allowed' : '',width:'100%'}" class="answer-descriptive-polling-input" type="text" :id="polling.pollingId + pollIdx" :name="polling.pollingId + pollIdx"  :disabled="polling.isAnswered" maxlength="512"  v-model.trim="descriptiveAnswer[pollIdx].descriptiveAnswer" @focus="focusInput" @blur="blurInput">
          <div v-if="isAnswerInputsRendered" style="width: 100%">
            <span>{{ descriptiveAnswer[pollIdx].descriptiveAnswer.length }}</span> <span>/</span> <span>512</span>
          </div>
        </div>
      </div>

    </div>
    <div style="display: flex;flex-direction: row;justify-content: space-between;width: 100%">
      <div >
        <div v-if="polling.isAnonymous && !polling.isAnswered" style="width: 20rem;padding: 0.8rem 1.6rem;display: flex;gap: 0.8rem;font-size: 1.2rem;align-items: center;border-radius: 0.8rem;color: #75758F">
          <span>نظر شما بصورت ناشناس ثبت می گردد</span>
        </div>
        <div v-else-if="polling.isAnswered" style="width: 22rem;padding: 0.8rem 1.6rem;display: flex;gap: 0.8rem;font-size: 1.2rem;align-items: center;border-radius: 0.8rem;color: #75758F">
          <span>شما این نظرسنجی را پاسخ داده اید</span>
        </div>
      </div>
      <div v-if="polling.isAnswered || isAnswered" style=" background-color:#F2F2F2;
          color:#2AB459; width:12.1rem;height:4.8rem;
          font-size:1.4rem; font-weight: 700;
          border-radius:0.6rem;cursor: not-allowed;display: flex;align-items: center;justify-content: center;flex-direction: row-reverse;gap: 0.8rem">
        <span>{{ $store.getters.t('registered') }}</span>
        <svg class="fade-image" style="width: 16px;height: 16px"  width="24" height="24"
             viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M18.7104 7.2101C18.6175 7.11638 18.5069 7.04198 18.385 6.99121C18.2632 6.94044 18.1324 6.91431 18.0004 6.91431C17.8684 6.91431 17.7377 6.94044 17.6159 6.99121C17.494 7.04198 17.3834 7.11638 17.2904 7.2101L9.84044 14.6701L6.71044 11.5301C6.61392 11.4369 6.49998 11.3636 6.37512 11.3143C6.25026 11.2651 6.11694 11.241 5.98276 11.2433C5.84858 11.2457 5.71617 11.2744 5.59309 11.3279C5.47001 11.3814 5.35868 11.4586 5.26544 11.5551C5.1722 11.6516 5.09889 11.7656 5.04968 11.8904C5.00048 12.0153 4.97635 12.1486 4.97867 12.2828C4.98099 12.417 5.00972 12.5494 5.06321 12.6725C5.1167 12.7955 5.19392 12.9069 5.29044 13.0001L9.13044 16.8401C9.2234 16.9338 9.334 17.0082 9.45586 17.059C9.57772 17.1098 9.70843 17.1359 9.84044 17.1359C9.97245 17.1359 10.1032 17.1098 10.225 17.059C10.3469 17.0082 10.4575 16.9338 10.5504 16.8401L18.7104 8.68011C18.8119 8.58646 18.893 8.47281 18.9484 8.34631C19.0038 8.21981 19.0324 8.08321 19.0324 7.94511C19.0324 7.807 19.0038 7.6704 18.9484 7.5439C18.893 7.4174 18.8119 7.30375 18.7104 7.2101Z"
              fill="#2AB459"/>
        </svg>
      </div>
      <base-button
          v-else
          :is-active="true"
          :button-inner-txt=" $store.getters.t('polling-registration')"
          :continuous-params="[
        'background-color=#F2F2F2',
          'color=#1B76FF', 'width=12.1rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
          @btn-clicked="answerDescriptivePolling(polling.pollingId)"
      ></base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/UI/BaseButton.vue";
import RestClient from "@/api/restClient";
import entityTypes from "@/statics/entityTypes";
// import room_handler from "@/utilities/room_handler";
export default {
  name: "ConfirmDescriptivePollingElement",
  components: {BaseButton},
  props:["allDescriptivePolling","pollingNumber","polling"],
  data(){
    return {
      restClient: new RestClient(entityTypes.polling),
      descriptiveAnswer:[],
      sending:false,
      isAnswered : false,
      isAnswerInputsRendered:false
    }
  },
  methods:{
    answerDescriptivePolling(id){
      const emptyAnswerIndex = this.descriptiveAnswer.findIndex((answer) => {
        return answer.descriptiveAnswer?.trim() !== ''
      })
      console.error(emptyAnswerIndex)
      // if (this.descriptiveAnswer.length > 0){
      // eslint-disable-next-line no-constant-condition
      if (emptyAnswerIndex !== -1){
        this.sending = true;
        this.restClient.submitSurvey({
          meetingId: this.$store.getters.roomId,
          surveyId: parseInt(id) ,
          userId: this.$store.getters.userId,
          displayName:this.$store.getters.displayName ,
          questionAnswerDtoList:this.descriptiveAnswer,
        })
            .then(() => {
              this.isAnswered = true
              this.eventBus.emit('answer-descriptive-polling', {id:id,answer:this.descriptiveAnswer })
              // room_handler.confirmPolling(this.$store.getters.roomId)
            })
            .catch((error) => {
              this.testPolling = false;
              this.options = [];
              this.questionList = [];
              console.error(error);
            })
            .finally(() => {
              this.sending = false;
            });
      }else {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText:'حد اقل یکی از سوال های این نظرسنجی را پاسخ نداده اید',
          time: 5000,
        });
      }

    },
    deletePolling(){

    },
    focusInput(){
      this.eventBus.emit("is-focused")
    },
    blurInput(){
      this.eventBus.emit("is-blured")
    },
  },
  mounted() {
    if (this.polling?.descriptiveAnswer?.length > 0){
      this.descriptiveAnswer = this.polling.descriptiveAnswer
    }else {
      this.descriptiveAnswer = this.polling.pollingData.map((data)=>{
        return {descriptiveAnswer:'',questionId:data.questionId,isOptional:false,optionalAnswerId:''}
      })
    }

    this.isAnswerInputsRendered = true
  }
}
</script>

<style scoped>

.create-optional-polling-new-polling-action{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  height:4.8rem ;
}
.confirm-descriptive-polling-details__container{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  border-radius: 0.8rem;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.36);
  height: max-content;
  padding:1.6rem ;
  margin-bottom: 0.1rem;
}
.confirm-descriptive-polling-details__container label {
  font-size: 1.2rem;
  color: #292933;
}
.confirm-descriptive-polling-details-question-title{
  width: 100%;
  height: auto;
  border-radius: 0.8rem;
  border: 0.1rem solid transparent;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}
.confirm-descriptive-polling-details-question-text{
  width: 100%;
  height: auto;
  border-radius: 0.8rem;
  border: 0.1rem solid transparent;
  font-size: 1.4rem;
  font-weight: 400;
}

.answer-descriptive-polling-input{
  background-color: #F6F6F7;
  width: 100%;
  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  padding: 0 0.8rem;
}
.answer-descriptive-polling-input:focus{
  background-color: transparent;
  border: 0.1rem solid #DCDADA;
  outline: none;
}
</style>

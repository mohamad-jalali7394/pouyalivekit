<template>
  <div  class="confirm-optional-polling-details__container" :style="{backgroundColor: polling.isAnswered ? '#F2F2F2' : ''}">
    <div style="width: 100%;display: flex;flex-direction: column;align-items: center">
      <div v-if="polling.title" style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem;margin-bottom: 0.8rem">

        <div class="confirm-optional-polling-details-question-title">
          {{polling.title}}
        </div>
      </div>
      <div v-for="(pollElement, pollIdx) in polling.pollingData" :key="pollElement.questionId + pollIdx" style="width: 34rem; padding: 0.6rem;display: flex;flex-direction: column;gap: 0.8rem" :style="{'border-top':'0.1rem solid #DCDADA','border-bottom':  '0.1rem solid #DCDADA'}">

          <div class="confirm-optional-polling-details-question-text">
            <span v-if="polling.pollingData?.length > 1">{{(pollIdx + 1) + '.'}}</span>
            <span v-if="polling.pollingData?.length > 1"></span>
            <span>{{pollElement.questionBody}}</span>

          </div>

        <div style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem">
          <label style="color: #75758F">   {{$store.getters.t("options")}}</label>
          <confirm-optional-polling-option v-for="(option, optionIdx) in pollElement.createQuestionOptRespDtoList" :key="option.id + optionIdx" :option="option" :polling="polling" :poll-element="pollElement" :index="pollIdx" @choose-option="chooseOption"></confirm-optional-polling-option>
        </div>

      </div>

    </div>
    <div style="display: flex;flex-direction: row;justify-content: space-between;width: 100%">
      <div >
        <div v-if="polling.isAnonymous && !polling.isAnswered" style="width: 21rem;padding: 0.8rem 1.6rem;display: flex;gap: 0.8rem;font-size: 1.2rem;align-items: center;border-radius: 0.8rem;color: #75758F">
          <span>نظر شما بصورت ناشناس ثبت می گردد</span>
        </div>
        <div v-else-if="polling.isAnswered" style="width: 21rem;padding: 0.8rem 1.6rem;display: flex;gap: 0.8rem;font-size: 1.2rem;align-items: center;border-radius: 0.8rem;color: #75758F">
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
          :button-inner-txt="$store.getters.t('confirm-polling')"
          :continuous-params="[
        'background-color=#F2F2F2',
          'color=#1B76FF', 'width=12.1rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
          @btn-clicked="answerOptionalPolling(polling.pollingId,index)"
      ></base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/UI/BaseButton.vue";
import RestClient from "@/api/restClient";
import entityTypes from "@/statics/entityTypes";
import eventBus from "@/utils/event.bus";
import ConfirmOptionalPollingOption from "@/components/ConfirmOptionalPollingOption.vue";
// import room_handler from "@/utilities/room_handler";

export default {
  name: "ConfirmOptionalPollingElement",
  components: {ConfirmOptionalPollingOption, BaseButton},
  props:["allOptionalPolling","polling","pollingNumber","index"],
  data(){
    return {
      restClient: new RestClient(entityTypes.polling),
      optionalAnswer:'',
      sending:false,
      isAnswered : false,
      answers:[],
      optionalAnswerText:''
    }
  },
  methods:{
    answerOptionalPolling(id,index){
      this.sending = true;
      const answerIdx = this.answers.findIndex((el) => {
        return !el?.questionId;
      });
      console.error(index)
      if (answerIdx === -1){
        this.restClient.submitSurvey({
          meetingId: this.$store.getters.roomId,
          surveyId: parseInt(id) ,
          userId: this.$store.getters.userId,
          displayName:this.$store.getters.displayName ,
          questionAnswerDtoList:this.answers,
        })
            .then(() => {
              this.isAnswered = true
              this.eventBus.emit('answer-optional-polling', {id:id,answer:this.answers })
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
        eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'حد اقل یکی از گزینه های این نظرسنجی را انتخاب نکرده اید',
          time: 5000,
        });
      }

    },
    deletePolling(){

    },
    chooseOption(data){
      // this.answers[data.index] = {optionalAnswer:data.value,questionId:data.questionId,isOptional:true,descriptiveAnswer:'',optionalAnswerId:data.optionId}
      this.optionalAnswerText = data.value
      this.answers[data.index] = {questionId:data.questionId,isOptional:true,descriptiveAnswer:'',optionalAnswerId:data.optionId}
    },
  },
  mounted() {
    console.error('gggggggggggggggggggggggggggggggggggggggggggg')
    console.error(this.polling.pollingData)
    this.answers = this.polling.pollingData.map(()=>{
      return ''
    })
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
.confirm-optional-polling-details__container{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  border-radius: 0.8rem;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.36);
  height: max-content;
  padding:1.6rem ;
}
.confirm-optional-polling-details__container label {
  font-size: 1.2rem;
  color: #292933;
}
.confirm-optional-polling-details-question-title{
  width: 100%;
  height: auto;
  border-radius: 0.8rem;
  border: 0.1rem solid transparent;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}
.confirm-optional-polling-details-question-text{
  width: 100%;
  height: auto;
  border-radius: 0.8rem;
  border: 0.1rem solid transparent;
  font-size: 1.4rem;
  font-weight: 400;
  display: flex;
  gap: 0.3rem;
}

</style>

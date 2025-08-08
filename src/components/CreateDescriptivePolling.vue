<template>
  <div ref="mini-drop-down-container" class="create-optional-polling-new-polling-action">
    <base-button
        v-if="(this.allDescriptivePolling.length === 0) || ((this.allDescriptivePolling.length > 0) && this.allDescriptivePolling[0].isDone)"
        :is-active="true"
        :button-inner-txt="$store.getters.t('Conduct-new-multi-choice-polling')"
        :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=23rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
        @btn-clicked="addNewPolling"
    >
      <template #post-button-slot>
        <add-plus color="white" width="24" height="24"></add-plus>
      </template>
    </base-button>
    <base-button
        v-if="allPollingCreated?.length > 0"
        :is-active="true"
        :button-inner-txt="$store.getters.t('view-result')"
        :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF', 'width=11rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
        @btn-clicked="viewResult"
    >
    </base-button>
  </div>
  <div class="create-optional-polling__container">

    <div v-if="allDescriptivePolling.length === 0 && allPollingCreated.length === 0" style="width: 100%;height: 100%;display: flex;justify-content: center;margin-top: 2rem">
      {{$store.getters.t('no_polling_found')}}
    </div>
    <div v-for="(polling, index) in allDescriptivePolling" :key="polling.pollingId" class="create-optional-polling-details__container" :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr' }">
      <div style="padding: 1rem 1.6rem">
        <span style="font-size: 2.4rem;font-weight: 700;color: #292933">{{$store.getters.t('optional-polling-header',{num:allPollingCreated.length + 1})}}</span>
      </div>
      <div  style="padding: 0.8rem 1.6rem;display: flex;flex-direction: column;gap: 0.8rem">
        <span>
          {{$store.getters.t("polling-tile")}}
        </span>

        <input v-model.trim="polling.title" autocomplete="off" :id="polling.pollingId" :name="'input' + polling.pollingId" :disabled="polling.isDone"   :style="{border:!isQuestionTextInputValid && (polling.title === '') ? '0.1rem solid rgb(229, 0, 0)' : '',cursor:polling.isDone ? 'not-allowed' : ''}"  class="create-optional-polling-details-input-question-text" @focus="focusInput" @blur="blurInput">
      </div>
      <div v-for="(pollElement, pollIdx) in polling.pollingData" :key="pollElement.pollingDataId + pollIdx + index" style="width: 35.9rem; padding: 1rem 1.6rem;display: flex;flex-direction: column;gap: 0.8rem" :style="{'border-top':'0.1rem solid #DCDADA' ,'border-bottom':'0.1rem solid #DCDADA' }">
<!--        <div   style="margin-bottom: 0.8rem">{{$store.getters.t('optional-question',{num:pollIdx + 1})}}</div>-->
        <div  style="margin-bottom: 0.8rem; display: flex;gap: 0.8rem">
          <div> {{$store.getters.t('optional-question',{num:pollIdx + 1})}}</div>
          <div v-if="pollIdx > 0 && !polling.isDone" style="width: 1.4rem;height: 1.4rem;display: flex;justify-content: center;align-items: center;background-color: #E50000;color: white;border-radius: 50%;cursor: pointer" @click="deleteQuestion(pollIdx)">
            <div style="font-size: 4rem;width: 70%;height: 0;border: 0.1rem solid white" >  </div>
          </div>
        </div>
        <div style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem">
          <label>
            {{$store.getters.t("title-question")}}
          </label>
          <input v-model.trim="pollElement.question" autocomplete="off" :id="'input' + polling.pollingDataId + pollIdx + index" :name="'input' + polling.pollingDataId + pollIdx + index" :disabled="polling.isDone"   :style="{border:!isQuestionTextInputValid && (pollElement.question === '') ? '0.1rem solid rgb(229, 0, 0)' : '',cursor:polling.isDone ? 'not-allowed' : ''}"  class="create-optional-polling-details-input-question-text" @focus="focusInput" @blur="blurInput">
        </div>
      </div>
      <div @click="addNewQuestion" v-if="!polling.isDone" style="cursor: pointer;display: flex;flex-direction: row;gap: 0.4rem;align-items: flex-end;font-size: 1.2rem;height: 3.2rem;padding: 0.8rem 1.6rem">
        <add-plus color="#1B76FF" width="16" height="16"></add-plus>
        <span style="color: #1B76FF;cursor: pointer">{{$store.getters.t("addNewQuestion")}}</span>
      </div>
      <div style="border-bottom: 0.1rem solid #DCDADA;padding-bottom: 1.6rem">
        <div style="width: 22rem;padding: 0.8rem 1.6rem; background-color: #F6F6F7;display: flex;gap: 0.8rem;font-size: 1.2rem;align-items: center;border-radius: 0.8rem">
          <Span>{{$store.getters.t("anonymous-polling")}}</Span>
          <base-toggle-button @click.stop @toggle-item="ToggleItem" :is-toggled="polling.isAnonymous" :toggle-permission="!polling.isDone"></base-toggle-button>

        </div>
      </div>
      <div style="display: flex;flex-direction: row-reverse;gap: 0.8rem;padding:2.4rem 1.6rem 1.6rem 1.6rem">
        <base-button
            :is-active="true"
            :button-inner-txt=" $store.getters.t('polling-registration')"
            :continuous-params="[
        'background-color=#F2F2F2',
          'color=#1B76FF', 'width=12.1rem','height=3.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
            @btn-clicked="registerPolling(index)"
        ></base-button>
        <base-button
            :is-active="true"
            :button-inner-txt="$store.getters.t('delete')"
            :continuous-params="[
          'background-color=#F2F2F2',
          'color=#E50000', 'width=12.1rem','height=3.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
            @btn-clicked="deletePolling"
        >
          <template #post-button-slot>
            <delete-icon color="#E50000"></delete-icon>
          </template>
        </base-button>
      </div>
    </div>


    <confirm-descriptive-polling v-if = "allPollingCreated?.length > 0" :all-descriptive-polling="allPollingCreated"></confirm-descriptive-polling>





<!--    <div v-for="(polling, index) in allPollingCreated" :key="polling.pollingId + index" class="create-optional-polling-details__container">-->

<!--      <div  style="  width: 100%;-->
<!--  height: auto;-->
<!--  border-radius: 0.8rem;-->
<!--  border: 0.1rem solid transparent;-->
<!--  font-size: 2rem;-->
<!--  font-weight: 700;-->
<!--  text-align: center;">-->
<!--        <span>-->
<!--            {{polling.title}}-->
<!--        </span>-->
<!--      </div>-->
<!--      <div v-for="(pollElement, pollIdx) in polling.pollingData" :key="pollElement.questionId + pollIdx" style="width: 35.9rem; padding: 1.6rem;display: flex;flex-direction: column;gap: 0.8rem" :style="{'border-top': '0.1rem solid #DCDADA' ,'border-bottom':  '0.1rem solid #DCDADA' }">-->
<!--        <div style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem">-->
<!--          <div class="confirm-descriptive-polling-details-question-text">-->
<!--            <span>{{pollElement.questionBody}}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem">-->
<!--          <label style="color: #75758F">   {{$store.getters.t("answer")}}</label>-->
<!--          <input  :style="{cursor: polling.isAnswered ? 'not-allowed' : '',width:'100%'}" class="answer-descriptive-polling-input" type="text" :id="polling.pollingId + pollIdx" :name="polling.pollingId + pollIdx"  :disabled="polling.isAnswered" maxlength="512"  v-model.trim="descriptiveAnswer[pollIdx].descriptiveAnswer" @focus="focusInput" @blur="blurInput">-->
<!--          <div style="width: 100%">-->
<!--            <span>{{ descriptiveAnswer[pollIdx].descriptiveAnswer.length }}</span> <span>/</span> <span>512</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div style="border-bottom: 0.1rem solid #DCDADA;padding-bottom: 1.6rem">-->
<!--        <div style="width: 22rem;padding: 0.8rem 1.6rem; background-color: #F6F6F7;display: flex;gap: 0.8rem;font-size: 1.2rem;align-items: center;border-radius: 0.8rem">-->
<!--          <Span>{{$store.getters.t("anonymous-polling")}}</Span>-->
<!--          <base-toggle-button @click.stop @toggle-item="ToggleItem" :is-toggled="polling.isAnonymous" :toggle-permission="!polling.isDone"></base-toggle-button>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div style="display: flex;flex-direction: row-reverse;gap: 0.8rem;padding:2.4rem 1.6rem 1.6rem 1.6rem">-->
<!--        <div v-if="polling.isAnswered" style=" background-color:#F2F2F2;-->
<!--          color:#2AB459; width:12.1rem;height:4.8rem;-->
<!--          font-size:1.4rem; font-weight: 700;-->
<!--          border-radius:0.6rem;cursor: not-allowed;display: flex;align-items: center;justify-content: center;flex-direction: row-reverse;gap: 0.8rem">-->
<!--          <span>{{ $store.getters.t('registered') }}</span>-->
<!--          <svg class="fade-image" style="width: 16px;height: 16px"  width="24" height="24"-->
<!--               viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--            <path-->
<!--                d="M18.7104 7.2101C18.6175 7.11638 18.5069 7.04198 18.385 6.99121C18.2632 6.94044 18.1324 6.91431 18.0004 6.91431C17.8684 6.91431 17.7377 6.94044 17.6159 6.99121C17.494 7.04198 17.3834 7.11638 17.2904 7.2101L9.84044 14.6701L6.71044 11.5301C6.61392 11.4369 6.49998 11.3636 6.37512 11.3143C6.25026 11.2651 6.11694 11.241 5.98276 11.2433C5.84858 11.2457 5.71617 11.2744 5.59309 11.3279C5.47001 11.3814 5.35868 11.4586 5.26544 11.5551C5.1722 11.6516 5.09889 11.7656 5.04968 11.8904C5.00048 12.0153 4.97635 12.1486 4.97867 12.2828C4.98099 12.417 5.00972 12.5494 5.06321 12.6725C5.1167 12.7955 5.19392 12.9069 5.29044 13.0001L9.13044 16.8401C9.2234 16.9338 9.334 17.0082 9.45586 17.059C9.57772 17.1098 9.70843 17.1359 9.84044 17.1359C9.97245 17.1359 10.1032 17.1098 10.225 17.059C10.3469 17.0082 10.4575 16.9338 10.5504 16.8401L18.7104 8.68011C18.8119 8.58646 18.893 8.47281 18.9484 8.34631C19.0038 8.21981 19.0324 8.08321 19.0324 7.94511C19.0324 7.807 19.0038 7.6704 18.9484 7.5439C18.893 7.4174 18.8119 7.30375 18.7104 7.2101Z"-->
<!--                fill="#2AB459"/>-->
<!--          </svg>-->
<!--        </div>-->
<!--        <base-button-->
<!--            v-else-->
<!--            :is-active="true"-->
<!--            :button-inner-txt=" $store.getters.t('polling-registration')"-->
<!--            :continuous-params="[-->
<!--        'background-color=#F2F2F2',-->
<!--          'color=#1B76FF', 'width=12.1rem','height=4.8rem',-->
<!--          'font-size=1.4rem', 'font-weight= 700',-->
<!--          'border-radius=0.6rem'-->
<!--          ]"-->
<!--            @btn-clicked="answerDescriptivePolling(polling.pollingId)"-->
<!--        ></base-button>-->
<!--      </div>-->
<!--    </div>-->














  </div>
</template>

<script>
import BaseButton from "@/components/UI/BaseButton.vue";
import AddPlus from "@/components/UI/Icons/AddPlus.vue";
import BaseToggleButton from "@/components/UI/BaseToggleButton.vue";
import DeleteIcon from "@/components/UI/Icons/DeleteIcon.vue";
// import room_handler from "@/utilities/room_handler";
import RestClient from "@/api/restClient";
import entityTypes from "@/statics/entityTypes";
import MiniDropDownHandler from "@/utils/mini.drop.down.actions";
import ConfirmDescriptivePolling from "@/components/ConfirmDescriptivePolling.vue";
import WebSocketClient from "@/webSocketClient";

export default {
  name: "CreateDescriptivePolling",
  components: {ConfirmDescriptivePolling, DeleteIcon, BaseToggleButton, AddPlus, BaseButton},
  props:['allPollingCreated', "amIGuestUser"],
  data(){
    return {
      allDescriptivePolling:[],
      restClient: new RestClient(entityTypes.polling),
      isQuestionTextInputValid:true,
      isCreatPollingDropDownOpen: {flag: false},
      createPollingItems:[
        {
          label: this.$store.getters.t("Conduct-one-question-polling"),
        },
        {
          label: this.$store.getters.t("Conduct-multi-question-polling"),
        },
      ],
      descriptiveAnswer:[],
    }
  },
  methods:{

    addNewPolling(){
        this.allDescriptivePolling.unshift({title: '',isAnonymous:false,pollingId:0,isDone:false,pollingData:[{question:'', answer:'',pollingDataId:'pollingDataId'}]})
        this.eventBus.emit('scroll-top-create-polling')
    },
    ToggleItem(data){
      this.allDescriptivePolling[0].isAnonymous = data.status
    },
    registerPolling(index){
      // this.addToQuestionList();
      this.isQuestionTextInputValid = true
      this.sending = true;
      const questionValueIdx = this.allDescriptivePolling[index].pollingData.findIndex((data) => {
        return data?.question === ''
      })
      if (questionValueIdx === -1){
        const questionList = this.allDescriptivePolling[0].pollingData.map((data)=>{
            return {isOption:false,questionBody:data.question,optionList:[]}
        })
        this.restClient
            .createSurvey({
              meetingId: this.$store.getters.roomId,
              title: this.allDescriptivePolling[0].title,
              isAnonymous: this.allDescriptivePolling[0].isAnonymous,
              questionList: questionList,
            })
            .then((response) => {
              this.allDescriptivePolling[0].pollingId = response.data.data
              this.allDescriptivePolling[0].isDone = true

              const data = {
                isAnonymous: this.allDescriptivePolling[0].isAnonymous,
                title: this.allDescriptivePolling[0].title,
                questionText: this.allDescriptivePolling[0].pollingData[0].question,
                isOptional: false,
                pollingId: response.data.data.surveyId,
                pollingData:response.data.data.surveyQuestionRespDtoList,
                option: [],
                meetingId:this.$store.getters.roomId,
              }
              this.allDescriptivePolling = []
              // room_handler.sendPollingData(this.$store.getters.roomId,data)
              WebSocketClient.getInstance().sendSurvey(data)
              // localStorage.setItem(
              //     "all-descriptive-polling",
              //     JSON.stringify({allDescriptivePolling: this.allDescriptivePolling, roomId:this.$store.getters.roomId})
              // );
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              this.sending = false;
            });
      } else {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: this.$store.getters.t('question-title-must-not-be-empty'),
          time: 5000,
        });
        this.isQuestionTextInputValid = false
      }

    },
    addNewQuestion(){
      if (this.allDescriptivePolling[0].pollingData.length < 26){
        let pollingDataId = "pollingDataId" + this.allDescriptivePolling[0].pollingData.length
        this.allDescriptivePolling[0].pollingData.push({question:'',answer:'',pollingDataId:pollingDataId})
      }else {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "warning",
          bodyText: ' تعداد سوالات نظرسنجی نمیتواند بیشتر از 25 باشد',
          time: 5000,
        });
      }

    },
    viewResult(){
      this.eventBus.emit('view-polling-result')
    },
    deletePolling(){
      this.allDescriptivePolling.shift()
    },
    getAllResult() {
      this.allPollings = [];
      this.restClient
          .getAllResult(this.$store.getters.roomId)
          .then((response) => {
            console.log(response)
            // response.forEach((polling)=>{
            //   if (polling.isOptional){
            //     this.getResultPolling(polling.pollingId)
            //     this.allDescriptivePolling.unshift({questionText: polling.title,options:[{ option: "", optionText: "" }],isAnonymous:polling.isAnonymous,pollingId:polling.pollingId,isDone:true})
            //   }
            // })
            // this.isPassedThreeSeconds = false
            // this.isGetResult = true
            // // document.getElementById("chart").style.display = "none";
            // this.allPollings = response;
            // this.selectedQuestion = { label: response[0].body,pollingId:response[0].pollingId,isOptional:response[0].isOptional};
            // for (const el of response) {
            //   this.resultQuestion.push({ label: el.body,pollingId: el.pollingId,isOptional: el.isOptional });
            // }
          })
          .catch((error) => {
            this.isPassedThreeSeconds = true
            this.isGetResult = false
            console.error(error);
          })
          .finally(() => {});
    },
    getResultPolling(id) {
      this.restClient
          .getResult(id)
          .then((response) => {
            console.log(response)
            // const createdAt =momentjs(response.createdAt).format('YYYY-MM-DD')
            // this.createdAt = momentJalali(createdAt).format('jYYYY/jMM/jDD')
            // nextTick(()=>{
            //   if (response.isOption){
            //     document.getElementById("chart").style.display = "none";
            //   }
            // })
            //
            // if (response.isAnonymous) {
            //   for (let i = 0; i < response.pollingResultDto.length; i++) {
            //     response.pollingResultDto[i].username = "ناشناس";
            //   }
            // }
            // this.body = response.body;
            // this.pollingResult = response.pollingResultDto;
            // this.pollStatistics = response.pollStatistics;
            // let question = "";
            // let percentage = 0;
            // if (response.pollingResultDto.length === 0){
            //   this.isPassCoupleOfSeconds = true
            // }else{
            //
            //   this.isPassCoupleOfSeconds = false
            // }
            // if (response.isOptional && response.pollingResultDto.length !== 0) {
            //   document.getElementById("chart").style.display = "block";
            //   if (this.pollStatistics) {
            //     for (let i = 0; i < this.pollStatistics.length; i++) {
            //       question = this.pollStatistics[i].question;
            //       this.arrayOfPercentage.push(question);
            //       percentage = this.pollStatistics[i].percentageOfVotes;
            //       this.arrayOfPercentage.push(percentage);
            //     }
            //     let splittedArray = [];
            //     while (this.arrayOfPercentage.length > 0) {
            //       splittedArray.push(this.arrayOfPercentage.splice(0, 2));
            //     }
            //     this.innerData = splittedArray;
            //     const options = {
            //       data: {
            //         columns: this.innerData,
            //         type: "pie",
            //       },
            //     };
            //     this.chartOptions = options
            //     // this.eventBus.emit("initChart", options);
            //   }
            // }
            // else {
            //   document.getElementById("chart").style.display = "none";
            // }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {});
    },
    focusInput(){
      this.eventBus.emit("is-focused")
    },
    blurInput(){
      this.eventBus.emit("is-blured")
    },
    answerDescriptivePolling(id){
      console.error(this.descriptiveAnswer)
      const emptyAnswerIndex = this.descriptiveAnswer.findIndex((answer) => {
        return answer.value === ''
      })
      // if (this.descriptiveAnswer.length > 0){
      // eslint-disable-next-line no-constant-condition
      if (emptyAnswerIndex === -1){
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
          bodyText:'ابتدا پاسخ خود را بنوسید سپس آن را ثبت کنید ',
          time: 5000,
        });
      }

    },
    deleteQuestion(pollIdx){
      this.allDescriptivePolling[0].pollingData.splice(pollIdx,1)
    },
  },
  mounted() {
  //   if ((JSON.parse(localStorage.getItem("all-descriptive-polling"))?.roomId) && (+JSON.parse(localStorage.getItem("all-descriptive-polling"))?.roomId === +this.$store.getters.roomId) && JSON.parse(localStorage.getItem("all-descriptive-polling"))?.allDescriptivePolling.length > 0){
  //   this.allDescriptivePolling = JSON.parse(localStorage.getItem("all-descriptive-polling"))?.allDescriptivePolling
  // }

    new MiniDropDownHandler(this.$refs['mini-drop-down-container'], this.isCreatPollingDropDownOpen);
    // this.getAllResult()
  }
}
</script>
<style scoped>
.create-optional-polling__container{
  width: 95%;
  position: relative;
  left: 2.5%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 0.8rem 0;
}
.create-optional-polling-new-polling-action{
  width: 100%;
  position: absolute;
  bottom: 2rem;
  display: flex;
  justify-content: center;
  direction: rtl;
  gap: 0.8rem;
}
.create-optional-polling-details__container{
  width: 100%;
  display: flex;
  flex-direction: column;
  direction: rtl;
  border-radius: 0.8rem;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.36);
  height: max-content;
}
.create-optional-polling-details__container label {
  font-size: 1.2rem;
  color: #75758F;
}
.create-optional-polling-details-input-question-text{
  width: 100%;
  height: 3.2rem;
  background-color: #F6F6F7;
  padding: 0.8rem 1.6rem;
  border-radius: 0.8rem;
  border: 0.1rem solid transparent;
}
.create-optional-polling-details-input-question-text:focus{
  outline: none;
  background-color: transparent;
  border: 0.1rem solid #DCDADA;
}
.confirm-descriptive-polling-details-question-text{
  width: 100%;
  height: auto;
  border-radius: 0.8rem;
  border: 0.1rem solid transparent;
  font-size: 1.4rem;
  font-weight: 400;
}

</style>

<template>
  <div class="create-optional-polling-new-polling-action">
    <base-button
        v-if="isThereNewPolling"
        :is-active="true"
        :button-inner-txt="$store.getters.t('Conduct-new-multi-choice-polling')"
        :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=23rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
        @btn-clicked="addNewOptionalPolling"
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
  <div v-if="allOptionalPolling?.length === 0 && allPollingCreated?.length === 0" style="width: 100%;height: 100%;display: flex;justify-content: center;margin-top: 2rem">
  {{$store.getters.t('no_polling_found')}}
  </div>
  <div v-for="(polling, index) in allOptionalPolling" :key="polling.pollingId" class="create-optional-polling-details__container" :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr' }">
    <div style=" padding: 0.8rem 1.6rem;">
      <span style="font-size: 2rem;font-weight: 700;color: #292933">{{$store.getters.t('optional-polling-header',{num:allPollingCreated.length + 1 })}}</span>
    </div>
    <div style="width: 100%;display: flex;flex-direction: column;gap: 1.6rem">
      <div style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem; padding: 0.8rem 1.6rem;">
        <label>
          {{$store.getters.t("polling-tile")}}
        </label>
        <input v-model.trim="polling.title" :id="polling.pollingId" :style="{border:!isQuestionTextInputValid && (polling.questionText === '') ? '0.1rem solid rgb(229, 0, 0)' : '',cursor:polling.isDone ? 'not-allowed' : ''}" :name="'input' + polling.pollingId" :disabled="polling.isDone"  class="create-optional-polling-details-input-question-text" @focus="focusInput" @blur="blurInput">
      </div>
      <div  style="width: 20rem;display: flex;flex-direction: column;">
        <div v-for="(pollElement, pollIdx) in polling.pollingData" :key="pollElement.pollingDataId + pollIdx" style="width: 35.9rem; padding: 1rem 1.6rem;display: flex;flex-direction: column;gap: 0.8rem" :style="{'border-top': '0.1rem solid #DCDADA','border-bottom':  '0.1rem solid #DCDADA'}">
          <div  style="margin-bottom: 0.8rem; display: flex;gap: 0.8rem">
            <div> {{$store.getters.t('optional-question',{num:pollIdx + 1})}}</div>
            <div v-if="pollIdx > 0 && !polling.isDone" style="width: 1.4rem;height: 1.4rem;display: flex;justify-content: center;align-items: center;background-color: #E50000;color: white;border-radius: 50%;cursor: pointer" @click="deleteQuestion(pollIdx)">
              <div style="font-size: 4rem;width: 70%;height: 0;border: 0.1rem solid white" >  </div>
            </div>
           </div>
          <input  :name="pollElement.pollingDataId + pollIdx" :id="pollElement.pollingDataId + pollIdx" :disabled="polling.isDone" :style="{border:(!isQuestionTextInputValid && (pollElement?.question === '')) ? '0.1rem solid rgb(229, 0, 0)' : '',cursor:polling.isDone ? 'not-allowed' : '' }" autocomplete="off" class="create-optional-polling-details-input-question-text" @blur="blurInput"  @focus="focusInput" v-model.trim="pollElement.question ">
          <label>   {{$store.getters.t("options")}}</label>
          <div v-for="(option,idx) in pollElement.options" :key="option.option" style="display: flex;gap: 0.8rem;align-items: center;position: relative">
            <input  :name="option.option + idx" :id="option.option + idx" :disabled="polling.isDone" :style="{border:((isOptionalInputValidIndex === index) && !isOptionalInputValid && (option?.optionText === '')) ? '0.1rem solid rgb(229, 0, 0)' : '',cursor:polling.isDone ? 'not-allowed' : '',width:'19.7rem' }" autocomplete="off" class="create-optional-polling-details-input-question-text" @blur="blurInput"  @focus="focusInput" v-model.trim="option.optionText">
            <div v-if="idx > 0 && !polling.isDone" style="width: 1.4rem;height: 1.4rem;display: flex;justify-content: center;align-items: center;background-color: #E50000;color: white;border-radius: 50%;cursor: pointer" @click="deleteOption(idx,pollIdx)">
              <div style="font-size: 4rem;width: 70%;height: 0;border: 0.1rem solid white" >  </div>
            </div>
          </div>
          <div @click="addNewOption(pollIdx)" v-if="!polling.isDone" style="cursor: pointer;display: flex;flex-direction: row;gap: 0.4rem;align-items: flex-end;font-size: 1.2rem;height: 3.2rem">
            <add-plus color="#1B76FF" width="16" height="16"></add-plus>
            <span style="color: #1B76FF;cursor: pointer">{{$store.getters.t("new-option")}}</span>
          </div>
        </div>
        <div  @click="addNewQuestion" v-if="!polling.isDone" style="cursor: pointer;display: flex;flex-direction: row;gap: 0.4rem;align-items: flex-end;font-size: 1.2rem;height: 3.2rem;padding: 0.8rem 1.6rem">
          <add-plus color="#1B76FF" width="16" height="16"></add-plus>
          <span style="color: #1B76FF;cursor: pointer"> {{ $store.getters.t('addNewQuestion') }} </span>
        </div>
      </div>
<!--      <div v-else class="confirm-optional-polling__container">-->
<!--        <div v-for="(pollElement, pollIdx) in polling.pollingInfo" :key="pollElement.pollingDataId + pollIdx" style="width: 35.9rem; padding: 1rem 1.6rem;display: flex;flex-direction: column;gap: 0.8rem" :style="{'border-top':   '0.1rem solid #DCDADA','border-bottom':  '0.1rem solid #DCDADA'}">-->
<!--          <div  style="margin-bottom: 0.8rem"> {{$store.getters.t('optional-question',{num:pollIdx + 1})}}</div>-->
<!--          <input  :name="pollElement.pollingDataId + pollIdx" :id="pollElement.pollingDataId + pollIdx" :disabled="polling.isDone" :style="{border:((isOptionalInputValidIndex === index) && !isOptionalInputValid && (option?.optionText === '')) ? '0.1rem solid rgb(229, 0, 0)' : '',cursor:polling.isDone ? 'not-allowed' : '' }" autocomplete="off" class="create-optional-polling-details-input-question-text" v-model.trim="pollElement.question ">-->
<!--          <label>   {{$store.getters.t("options")}}</label>-->
<!--          <confirm-optional-polling-option v-for="(option, index) in pollElement.createQuestionOptRespDtoList" :key="option.id + index" :option="option" :poll-element="pollElement" :polling="polling" :index="index" @choose-option="chooseOption"></confirm-optional-polling-option>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div style="border-bottom: 0.1rem solid #DCDADA;padding:0.8rem 1.6rem">
      <div style="width: 22rem;padding: 0.8rem 1.6rem; background-color: #F6F6F7;display: flex;gap: 0.8rem;font-size: 1.2rem;align-items: center;border-radius: 0.8rem;">
        <Span>{{$store.getters.t("anonymous-polling")}}</Span>
        <base-toggle-button @click.stop @toggle-item="ToggleItem" :is-toggled="polling.isAnonymous" :toggle-permission="!polling.isDone"></base-toggle-button>

      </div>
    </div>
    <div style="display: flex;flex-direction: row-reverse;gap: 0.8rem;padding:0 0  1.6rem 1.6rem">
      <base-button
          v-if="polling.isDone"
          :is-active="true"
          :button-inner-txt=" $store.getters.t('register-answer')"
          :continuous-params="[
        'background-color=#F2F2F2',
          'color=#1B76FF', 'width=12.1rem','height=3.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
          @btn-clicked="answerOptionalPolling(polling.pollingId,index)"
      ></base-button>
      <base-button
          v-else
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
          v-if="!polling.isDone"
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







<div v-if="allOptionalPollingCreated.length > 0" style="display: flex;flex-direction: column;gap: 1.6rem">
  <confirm-optional-polling-element v-for="(polling, index) in allOptionalPollingCreated" :key="polling.pollingId + index" :index="index" :all-optional-polling="allOptionalPolling" :polling-number="allOptionalPolling.length - index" :polling="polling"></confirm-optional-polling-element>

  <!--  <div v-for="(optionalPolling, pollCreatedIndex) in allOptionalPollingCreated" :key="optionalPolling.pollingId + pollCreatedIndex" class="create-optional-polling-details__container" :style="{backgroundColor: optionalPolling.isAnswered ? '#F2F2F2' : ''}">-->

<!--    <div style="width: 100%;display: flex;flex-direction: column;gap: 1.6rem">-->
<!--      <div style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem; padding: 0.8rem 1.6rem;">-->
<!--        <div class="confirm-optional-polling-details-question-title">-->
<!--          {{optionalPolling.title}}-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="confirm-optional-polling__container">-->
<!--        <div v-for="(pollElement, pollIdx) in optionalPolling.pollingData" :key="pollElement.questionId + pollIdx" style="width: 35.9rem; padding: 1rem 1.6rem;display: flex;flex-direction: column;gap: 0.8rem" :style="{'border-top':   '0.1rem solid #DCDADA','border-bottom':  '0.1rem solid #DCDADA'}">-->
<!--          <div class="confirm-optional-polling-details-question-text">-->
<!--            <span>{{(pollIdx + 1) + '.'}}</span>-->
<!--            <span ></span>-->
<!--            <span>{{pollElement.questionBody}}</span>-->

<!--          </div>-->
<!--          <label>   {{$store.getters.t("options")}}</label>-->
<!--          <confirm-optional-polling-option v-for="(option, optionIdx) in pollElement.createQuestionOptRespDtoList" :key="option.id + optionIdx" :option="option" :is-answered="optionalPolling.isAnswered"  :polling="optionalPolling" :poll-element="pollElement" :index="pollIdx" @choose-option="chooseOption"></confirm-optional-polling-option>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div style="border-bottom: 0.1rem solid #DCDADA;padding:0.8rem 1.6rem">-->
<!--      <div style="width: 22rem;padding: 0.8rem 1.6rem; background-color: #F6F6F7;display: flex;gap: 0.8rem;font-size: 1.2rem;align-items: center;border-radius: 0.8rem;">-->
<!--        <Span>{{$store.getters.t("anonymous-polling")}}</Span>-->
<!--        <base-toggle-button @click.stop @toggle-item="ToggleItem" :is-toggled="optionalPolling.isAnonymous" :toggle-permission="!optionalPolling.isDone"></base-toggle-button>-->

<!--      </div>-->
<!--    </div>-->
<!--    <div style="display: flex;flex-direction: row-reverse;gap: 0.8rem;padding:0 0  1.6rem 1.6rem">-->
<!--      <base-button-->
<!--          v-if="!optionalPolling.isAnswered"-->
<!--          :is-active="true"-->
<!--          :button-inner-txt=" $store.getters.t('register-answer')"-->
<!--          :continuous-params="[-->
<!--        'background-color=#F2F2F2',-->
<!--          'color=#1B76FF', 'width=12.1rem','height=3.8rem',-->
<!--          'font-size=1.4rem', 'font-weight= 700',-->
<!--          'border-radius=0.6rem'-->
<!--          ]"-->
<!--          @btn-clicked="answerOptionalPolling(optionalPolling.pollingId,pollCreatedIndex)"-->
<!--      ></base-button>-->
<!--      <div v-if="optionalPolling.isAnswered" style=" background-color:#F2F2F2;-->
<!--          color:#2AB459; width:12.1rem;height:4.8rem;-->
<!--          font-size:1.4rem; font-weight: 700;-->
<!--          border-radius:0.6rem;cursor: not-allowed;display: flex;align-items: center;justify-content: center;flex-direction: row-reverse;gap: 0.8rem">-->
<!--        <span>{{ $store.getters.t('registered') }}</span>-->
<!--        <svg class="fade-image" style="width: 16px;height: 16px"  width="24" height="24"-->
<!--             viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--          <path-->
<!--              d="M18.7104 7.2101C18.6175 7.11638 18.5069 7.04198 18.385 6.99121C18.2632 6.94044 18.1324 6.91431 18.0004 6.91431C17.8684 6.91431 17.7377 6.94044 17.6159 6.99121C17.494 7.04198 17.3834 7.11638 17.2904 7.2101L9.84044 14.6701L6.71044 11.5301C6.61392 11.4369 6.49998 11.3636 6.37512 11.3143C6.25026 11.2651 6.11694 11.241 5.98276 11.2433C5.84858 11.2457 5.71617 11.2744 5.59309 11.3279C5.47001 11.3814 5.35868 11.4586 5.26544 11.5551C5.1722 11.6516 5.09889 11.7656 5.04968 11.8904C5.00048 12.0153 4.97635 12.1486 4.97867 12.2828C4.98099 12.417 5.00972 12.5494 5.06321 12.6725C5.1167 12.7955 5.19392 12.9069 5.29044 13.0001L9.13044 16.8401C9.2234 16.9338 9.334 17.0082 9.45586 17.059C9.57772 17.1098 9.70843 17.1359 9.84044 17.1359C9.97245 17.1359 10.1032 17.1098 10.225 17.059C10.3469 17.0082 10.4575 16.9338 10.5504 16.8401L18.7104 8.68011C18.8119 8.58646 18.893 8.47281 18.9484 8.34631C19.0038 8.21981 19.0324 8.08321 19.0324 7.94511C19.0324 7.807 19.0038 7.6704 18.9484 7.5439C18.893 7.4174 18.8119 7.30375 18.7104 7.2101Z"-->
<!--              fill="#2AB459"/>-->
<!--        </svg>-->
<!--      </div>-->

<!--    </div>-->
<!--  </div>-->


</div>





















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
// import ConfirmOptionalPollingOption from "@/components/ConfirmOptionalPollingOption.vue";
import MiniDropDownHandler from "@/utils/mini.drop.down.actions";
import eventBus from "@/utils/event.bus";
import ConfirmOptionalPollingElement from "@/components/ConfirmOptionalPollingElement.vue";
import WebSocketClient from "../webSocketClient/index";

export default {
  name: "CreateOptionalPolling",
  props:['allPollingCreated',"amIGuestUser"],
  components: {ConfirmOptionalPollingElement, DeleteIcon, BaseToggleButton, AddPlus, BaseButton,},
  data(){
    return {
      allOptionalPolling:[],
      restClient: new RestClient(entityTypes.polling),
      isOptionalInputValid:true,
      isQuestionTextInputValid:true,
      isOptionalInputValidIndex:null,
      optionalAnswer:'',
      sendingConfirmPolling:false,
      sending:false,
      isCreatOptionalPollingDropDownOpen: {flag: false},
      answers:[],
      optionalAnswers:[],
      allOptionalPollingCreated:[],
    }
  },
  watch:{
    allPollingCreated:{
      immediate:true,
      deep:true,
      handler(val){
          this.allOptionalPollingCreated = val


      }
    }
  },
  computed:{
    isThereNewPolling() {
      return  (this.allOptionalPolling.length === 0) || ((this.allOptionalPolling.length > 0) && this.allOptionalPolling[0].isDone)
    }
  },
  methods:{
    addNewOptionalPolling(){
        this.allOptionalPolling.unshift({title: '',isAnonymous:false,pollingId:0,isAnswered:false,isDone:false,pollingData:[{question:'',options:[{ option: "option1", optionText: ""}], optionalAnswer:'',pollingDataId:'pollingDataId'}]})
        this.eventBus.emit('scroll-top-create-polling')
    },
    addNewOption(index){
      let option = "option" + this.allOptionalPolling[0].pollingData[index].options.length;
      this.allOptionalPolling[0].pollingData[index].options.push({ option: option, optionText: "" });
    },
    addNewQuestion(){
      if (this.allOptionalPolling[0].pollingData.length < 26){
        let option = "option" + this.allOptionalPolling[0].pollingData.length;
        let pollingDataId = "pollingDataId" + this.allOptionalPolling[0].pollingData.length
        this.allOptionalPolling[0].pollingData.push({question:'',options:[{ option:option, optionText: ""}], optionalAnswer:'',pollingDataId:pollingDataId})
      }else {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "warning",
          bodyText: ' تعداد سوالات نظرسنجی نمیتواند بیشتر از 25 باشد',
          time: 5000,
        });
      }

    },
    ToggleItem(data){
      this.allOptionalPolling[0].isAnonymous = data.status
    },
    deleteOption(idx,pollIdx){
      this.allOptionalPolling[0].pollingData[pollIdx].options.splice(idx,1)
    },
    deleteQuestion(pollIdx){
      this.allOptionalPolling[0].pollingData.splice(pollIdx,1)
    },
    // registerPolling(index){
    //   console.error(index)
    //   console.error(this.allOptionalPolling)
    //   // this.addToQuestionList();
    //   this.isOptionalInputValid = true
    //   this.isQuestionTextInputValid = true
    //   this.isOptionalInputValidIndex = index
    //
    //   const optionValueIdx = this.allOptionalPolling[index].pollingData[0].options.findIndex((option) => {
    //     return option?.optionText === ''
    //   })
    //   if (optionValueIdx === -1 && this.allOptionalPolling[0].pollingData[0].question !== ''){
    //     const optionList = this.allOptionalPolling[0].pollingData[0].options.map((option)=>{
    //       return option?.optionText
    //     })
    //     this.sending = true;
    //     this.restClient
    //         .createPoll({
    //           isAnonymous: this.allOptionalPolling[0].isAnonymous,
    //           title: this.allOptionalPolling[0].pollingData[0].question,
    //           body: this.allOptionalPolling[0].pollingData[0].question,
    //           isOption: true,
    //           meetingId: this.$store.getters.roomId,
    //           questionList: optionList,
    //           person: parseInt([...this.$store.getters.innerParticipants, ...this.$store.getters.outerParticipants].length),
    //         })
    //         .then((response) => {
    //           this.allOptionalPolling[0].pollingId = response.data.data
    //           this.allOptionalPolling[0].isDone = true
    //           const options = this.allOptionalPolling[0].pollingData[0].options.map((option) =>{
    //             return {option:option.option + response.data.data, optionText:option?.optionText}
    //           })
    //           const data = {
    //             isAnonymous: this.allOptionalPolling[0].isAnonymous,
    //             title: this.allOptionalPolling[0].title,
    //             questionText: this.allOptionalPolling[0].pollingData[0].question,
    //             isOptional: true,
    //             pollingId: response.data.data,
    //             pollingData:this.allOptionalPolling[0].pollingData,
    //             options: options,
    //             isDone:true,
    //             date:new Date(),
    //           }
    //           room_handler.sendPollingData(this.$store.getters.roomId,data)
    //           localStorage.setItem(
    //               "all-optional-polling",
    //               JSON.stringify({allOptionalPolling: this.allOptionalPolling, roomId:this.$store.getters.roomId})
    //           );
    //         })
    //         .catch((error) => {
    //           console.error(error);
    //         })
    //         .finally(() => {
    //           this.sending = false;
    //         });
    //   }else if (this.allOptionalPolling[0].questionText === ''){
    //     this.eventBus.emit("notification", {
    //       title: "پیام",
    //       type: "error",
    //       bodyText: "عنوان سوال نمیتواند خالی باشد",
    //       time: 5000,
    //     });
    //     this.isQuestionTextInputValid = false
    //   } else {
    //     this.isOptionalInputValid = false
    //     this.eventBus.emit("notification", {
    //       title: "پیام",
    //       type: "error",
    //       bodyText: "هیچ گزینه ای نباید خالی باشد",
    //       time: 5000,
    //     });
    //   }
    //
    // },
    //




    registerPolling(index){
      // this.addToQuestionList();
      this.isOptionalInputValid = true
      this.isQuestionTextInputValid = true
      this.isOptionalInputValidIndex = index
      console.error(this.allOptionalPolling[index])
      const optionValueIdx = this.allOptionalPolling[index].pollingData.findIndex((data) => {
        let isOptionFree = false
        data.options.forEach((option)=>{
          if (option?.optionText === ''){
            isOptionFree = true
            return;
          }
        })
        return isOptionFree
      })
      const questionValueIdx = this.allOptionalPolling[index].pollingData.findIndex((data) => {
        return data?.question === ''
      })
      if (optionValueIdx === -1 &&  questionValueIdx === -1 && this.allOptionalPolling[0].pollingData[0].question !== ''){
        const questionList = this.allOptionalPolling[0].pollingData.map((option)=>{
          const optionTexts = option.options.map((el) => {
            return el?.optionText
          })
          return {isOption:true, questionBody:option.question,optionList:optionTexts}
        })
        this.sending = true;
        this.restClient
            .createSurvey({
              meetingId: this.$store.getters.roomId,
              title: this.allOptionalPolling[0].title,
              isAnonymous: this.allOptionalPolling[0].isAnonymous,
              questionList: questionList,
            })
            .then((response) => {
              this.answers.unshift({pollingId:response.data.data,answers:[]})
              for (let i=0 ; i < questionList.length ;  i++ ){
                this.answers[0].answers.push({})
              }
              this.allOptionalPolling[0].pollingId = response.data.data
              this.allOptionalPolling[0].isDone = true
              // const options = this.allOptionalPolling[0].pollingData[0].options.map((option) =>{
              //   return {option:option.option + response.data.data, optionText:option?.optionText}
              // })
              const options = response.data.data.surveyQuestionRespDtoList.map((el) => {
                return {option:el.questionId , optionText:el.questionBody}
              })
              const data = {
                isAnonymous: this.allOptionalPolling[0].isAnonymous,
                title: this.allOptionalPolling[0].title,
                questionText: this.allOptionalPolling[0].pollingData[0].question,
                isOptional: true,
                pollingId: response.data.data.surveyId,
                pollingData:response.data.data.surveyQuestionRespDtoList,
                options: options,
                meetingId:this.$store.getters.roomId
              }
              this.allOptionalPolling[0].pollingInfo = response.data.data.surveyQuestionRespDtoList
                // room_handler.sendPollingData(this.$store.getters.roomId,data)
              WebSocketClient.getInstance().sendSurvey(data)
              this.allOptionalPolling = []
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              this.sending = false;
            });
      }else if (this.allOptionalPolling[0].questionText === ''){
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: "عنوان سوال نمیتواند خالی باشد",
          time: 5000,
        });
        this.isQuestionTextInputValid = false
        this.isOptionalInputValid = false
      } else {
        this.isOptionalInputValid = false
        this.isQuestionTextInputValid = false
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: this.$store.getters.t('questions-must-not-be-empty'),
          time: 5000,
        });
      }

    },










    answerOptionalPolling(id,index){
      this.sending = true;
      // const answerIdx = this.allOptionalPolling[index].options.findIndex((el) => {
      //   return el?.optionText === this.optionalAnswer;
      // });
      console.error(index)
      const foundIdx = this.allPollingCreated.findIndex((polling)  => {
        return polling.pollingId === id
      })
      if (foundIdx !== -1){
        this.restClient.submitSurvey({
          meetingId: this.$store.getters.roomId,
          surveyId: parseInt(id) ,
          userId: this.$store.getters.userId,
          displayName:this.$store.getters.displayName ,
          questionAnswerDtoList:this.optionalAnswers,
        })
            .then(() => {
              // const foundIdx = this.allOptionalPolling.findIndex((polling)  => {
              //               return polling.pollingId === id
              //             })
              // if (foundIdx !== -1) {
              //               this.allPollingCreated[foundIdx].isAnswered = true
              //               this.allPollingCreated[foundIdx].optionalAnswer = this.optionalAnswers
              //               localStorage.setItem(
              //                   "all-optional-polling",
              //                   JSON.stringify({allOptionalPolling: this.allPollingCreated, roomId:this.$store.getters.roomId})
              //               );
              //             }
              this.eventBus.emit('answer-optional-polling', {id:id,answer:this.optionalAnswers})
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
          bodyText: 'ابتدا یکی از گزینه ها را انتخاب کرده سپس نظرسنجی را ثبت کنید',
          time: 5000,
        });
      }

    },




    // answerOptionalPolling(id,index){
    //   console.error(index)
    //   const answerIdx = 0
    //   if (answerIdx !== -1){
    //     this.restClient.submitComment({
    //       meetingId: this.$store.getters.roomId,
    //       answer: `${answerIdx + 1}`,
    //       pollingId: parseInt(id),
    //       userId: this.$store.getters.userId,
    //     })
    //         .then(() => {
    //           const foundIdx = this.allOptionalPolling.findIndex((polling)  => {
    //             return polling.pollingId === id
    //           })
    //           if (foundIdx !== -1) {
    //             this.allOptionalPolling[foundIdx].isAnswered = true
    //             this.allOptionalPolling[foundIdx].optionalAnswer = this.answers
    //             localStorage.setItem(
    //                 "all-optional-polling",
    //                 JSON.stringify({allOptionalPolling: this.allOptionalPolling, roomId:this.$store.getters.roomId})
    //             );
    //           }
    //           this.eventBus.emit('answer-optional-polling', {id:id,answer:this.answers })
    //           room_handler.confirmPolling(this.$store.getters.roomId)
    //         })
    //         .catch((error) => {
    //           this.testPolling = false;
    //           this.options = [];
    //           this.questionList = [];
    //           console.error(error);
    //         })
    //         .finally(() => {
    //           this.sending = false;
    //         });
    //   }else {
    //     eventBus.emit("notification", {
    //       title: "پیام",
    //       type: "error",
    //       bodyText: 'ابتدا یکی از گزینه ها را انتخاب کرده سپس نظرسنجی را ثبت کنید',
    //       time: 5000,
    //     });
    //   }
    //
    // },
    chooseOption(data){
      this.optionalAnswers[data.index] = {questionId:data.questionId,isOptional:true,descriptiveAnswer:'',optionalAnswerId:data.optionId,pollingId:data.pollingId}
      // const foundIdx = this.answers.findIndex((answer)  => {
      //   return answer.pollingId === data.pollingId
      // })
      // if (foundIdx !== -1){
      //   this.answers[foundIdx].answers[data.index] = { questionId:data.questionId,isOptional:true,descriptiveAnswer:'',optionalAnswerId:data.optionId}
      // }
      // this.answers[data.pollingId] = { questionId:data.questionId,isOptional:true,descriptiveAnswer:'',optionalAnswerId:data.optionId}
      // this.answers[data.pollingId] = {pollingId:id, questionId:data.questionId,isOptional:true,descriptiveAnswer:'',optionalAnswerId:data.optionId}
    },
    viewResult(){
    this.eventBus.emit('view-polling-result')
    },
    getPDF(){
      this.restClient
          .getPDF(61958)
          .then((response) => {
            var raw = window.atob(response);
            // Create an array to store the decoded data
            var uInt8Array = new Uint8Array(raw.length);
            // blob can only receive binary encoding, need to talk about base64 converted to binary and then stuffed
            for (var i = 0; i < raw.length; ++i) {
              uInt8Array[i] = raw.charCodeAt(i);
            }
            // A return value is given here. In other methods, you can get the converted blob by using the base64 encoding.
            const link = document.createElement("a");
            const blob = new Blob([uInt8Array], {
              type: "application/pdf",
            });
            link.target = "_blank"
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            // Set the downloaded PDF table name
            link.setAttribute("download", `${this.meetingTitle}` + ' ' + `${this.proceedingsNumber}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }).catch((error)=>{
        console.error(error)
      })
    },
    deletePolling(){
     this.allOptionalPolling.shift()
    },
    getAllResult() {
      this.allPollings = [];
      this.restClient
          .getAllSurvey(this.$store.getters.roomId)
          .then(() => {

            // response.forEach((polling)=>{
            //   if (polling.isOptional){
            //     this.getResultPolling(polling.pollingId)
            //     this.allOptionalPolling.unshift({questionText: polling.title,options:[{ option: "", optionText: "" }],isAnonymous:polling.isAnonymous,pollingId:polling.pollingId,isDone:true})
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
            console.error(response)
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

  },
  mounted() {
      new MiniDropDownHandler(this.$refs['mini-drop-down-container'], this.isCreatOptionalPollingDropDownOpen);
    // this.eventBus.on('answer-optional-polling',(data)=>{
    //   // if (this.notAnsweredOptionalPolling > 0) {
    //   //   this.notAnsweredOptionalPolling -= 1
    //   // }
    //
    // })
    // this.eventBus.on('joined-successfully',()=>{
    //   if ((JSON.parse(localStorage.getItem("all-optional-polling"))?.roomId) && (+JSON.parse(localStorage.getItem("all-optional-polling"))?.roomId === +this.$store.getters.roomId) && JSON.parse(localStorage.getItem("all-optional-polling"))?.allOptionalPolling.length > 0){
    //     console.error( JSON.parse(localStorage.getItem("all-optional-polling")).allOptionalPolling)
    //     this.allPollingCreated =  JSON.parse(localStorage.getItem("all-optional-polling")).allOptionalPolling
    //   }
    // })


    //   if (this.$store.getters.roomId && !this.amIGuestUser){
    //   this.getAllResult()
    // }

  }
}
</script>
<style scoped>
.create-optional-polling__container{
  width: 95%;
  height: 100%;
  position: relative;
  left: 2.5%;
  display: flex;
  flex-direction: column;
  direction: rtl;
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
  display: flex;
  gap: 0.8rem;
}
.create-optional-polling-details__container{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  border-radius: 0.8rem;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.36);
  height: max-content;
  margin-bottom: 1rem;
}
.create-optional-polling-details__container label {
  font-size: 1.2rem;
  color: #75758F;
}
.create-optional-polling-details-input-question-text{
  width: 100%;
  height: 3.2rem;
  background-color: #F6F6F7;
  border-radius: 0.8rem;
  border: 0.1rem solid transparent;
  padding: 0.8rem;
}
.create-optional-polling-details-input-question-text:focus{
 outline: none;
  background-color: transparent;
  border: 0.1rem solid #DCDADA;
}
.confirm-optional-polling__container{
  width: 99%;
  position: relative;
  right: 0.5%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

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

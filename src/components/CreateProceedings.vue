<template>
  <div class="proceedings-not-started"
       v-show="!isProceedingsStarted && !proceedingsStarted && sideBarIsVisible && chatBoxTitle === $store.getters.t('proceedings')">
    <span>{{ $store.getters.t('no-meeting-minutes-created') }}</span>
    <div>
      <base-button
          v-if="!isProceedingsStarted && !proceedingsCreated"
          :is-active="true"
          :button-inner-txt= "$store.getters.t('create-minutes')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=28.4rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
          @click="startProceedings"
      >
      </base-button>
<!--      <div class="create-proceedings-action&#45;&#45;footer__more" @click="downloadPDF">-->
<!--        <more-icon color="#75758F" ></more-icon>-->
<!--      </div>-->
    </div>

  </div>
  <div v-show="(isProceedingsStarted || proceedingsStarted) && sideBarIsVisible && chatBoxTitle === $store.getters.t('proceedings')"
       class="create-proceedings__container" >
    <div class="proceedings__details"
         :style="{ 'border-bottom':isResultShowed ? '' : '0.1rem solid #DCDADA', 'background-color': isResultShowed ? '#F2F2F2' : 'transparent' }">
      <div>
        <span>{{ $store.getters.t('minutes-details') }}</span>
        <img draggable="false" v-show="!isResultShowed" src="/img/chevron_down.svg" alt="not-loaded" style="cursor: pointer"
             @click="showProceedingsDetails">
        <img draggable="false" v-show="isResultShowed" src="/img/chevron_down.svg" alt="not-loaded"
             style="cursor: pointer;transform: rotate(180deg)" @click="showProceedingsDetails">
      </div>
      <div v-show="isResultShowed">
        <div class="proceedings__details-input-proceedings-number">
          <label>{{ $store.getters.t('minutes-number') }}</label>
          <input type="text" @focus="focusProceedingsNumber" @blur="blurProceedingsNumber" :disabled="proceedingsCreated" v-model.trim="proceedingsNumber">
        </div>
        <div class="proceedings__details-location">
          <label>{{ $store.getters.t('meeting-title') }}</label>
          <div class="proceedings--default-details">{{ $store.getters.session_name }}</div>
        </div>
      </div>
      <div v-show="isResultShowed">
        <div v-show="isResultShowed" class="proceedings__details-date-fragment">
          <label>{{ $store.getters.t('creation-date') }}</label>
          <div class="proceedings--default-details">
            <div v-if="!this.$store.getters.isPrivate" style="max-width:90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;">
              {{ $store.getters.fromSchd.dayNum + ' ' + $store.getters.fromSchd.monthName + ' ' + $store.getters.fromSchd.yearName }}
            </div>
            <div v-else style="max-width:90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;">
              {{ nowDate[3] + ' ' + nowDate[2] + ' ' + nowDate[1] + ' ' + nowDate[0] }}
            </div>
          </div>
        </div>
        <!--    <div class="proceedings__details-date-fragment ">-->
        <!--      <label>زمان ایجاد</label>-->
        <!--      <div class="proceedings&#45;&#45;default-details">-->
        <!--        <span>ساعت</span>-->
        <!--        <span>{{$store.getters.fromSchd.from}}</span>-->
        <!--      </div>-->
        <!--    </div>-->
        <!--    <div class="proceedings__details-date-fragment">-->
        <!--      <label>زمان پایان</label>-->
        <!--      <div class="proceedings&#45;&#45;default-details">-->
        <!--        <span>ساعت</span>-->
        <!--        <span>{{$store.getters.toSchd.to}}</span>-->
        <!--      </div>-->
        <!--    </div>-->
      </div>
      <div v-show="isResultShowed">
        <label>{{ $store.getters.t('responsible-for-meeting-minutes') }}</label>
        <div class="proceedings__details-secretary">
          <img draggable="false" src="/img/contact.svg" alt="not-loaded" style="width: 3rem">
          <span>{{ $store.getters.displayName }}</span>
        </div>
      </div>
    </div>
    <div class="create-proceedings__Paragraph--fragment">
      <div v-if="!proceedingsCreated" class="create-proceedings__Paragraph--action">
        <add-plus color="#1B76FF" width="16" height="16" @click="createNewParagraph"></add-plus>
        <span style="color: #1B76FF;font-size: 1.2rem;font-weight: 700;cursor: pointer" @click="createNewParagraph">{{ $store.getters.t('create-clause') }}</span>
      </div>
      <proceedings-paragraph v-for="(paragraph, index) in paragraphs" :key="paragraph.paragraphId"
                             :paragraph-index="index" :is-proceedings-created="proceedingsCreated"
                             :paragraph="paragraph" @delete-paragraph="deleteParagraph"
                             :paragraph-status="paragraph.status"
                             @complete-paragraph="completeParagraph"
                             @edit-paragraph="editParagraph"></proceedings-paragraph>
    </div>
    <section v-if="!proceedingsCreated" class="create-proceedings-action--footer">
      <base-button
          
          :is-active="true"
          :button-inner-txt="$store.getters.t('notification-for-confirmation')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=28.4rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
          @click="createProceedings"
      >
      </base-button>
      <div class="create-proceedings-action--footer__more"  ref="mini-drop-down-container-before-proceedings-created">
        <more-icon color="#75758F" ></more-icon>
        <base-mini-drop-down
            :open="dropDownIsOpen.flag"
            direction-y="upward"
            direction-x="proceedings"
            :items="dropDownItemsBeforeProceedingsCreated"
            :is-guest="false"
            @select-item="getSelectedItem"
        >
        </base-mini-drop-down>
      </div>
    </section>
    <section v-if="proceedingsCreated"
             :style="{'justify-content': isProceedingsAnswered ? 'space-between' : '',padding:isProceedingsAnswered ? '0 1.6rem' : '0'}"
             class="create-proceedings-action--footer">
      <div style="width: 100%;position: absolute;top: -3rem;display: flex;gap:0.8rem;direction: rtl;right: 1.4rem" :style="{ top: isConfirmedProceedings ?  '-2.3rem' : '-2.3rem' }">

          <img draggable="false" src="/img/alarm.svg" alt="not-loaded">
          <span style="color: #1B76FF;font-size: 1.2rem;font-weight: 400;cursor: pointer" @click="openList">
             مشاهده لیست افرادی که صورت جلسه را پاسخ داده اند
          </span>


      </div>
      <div v-if="!isProceedingsAnswered" style="display: flex;gap: 1rem">
        <base-button
            :is-active="true"
            button-inner-txt="رد می‌کنم"
            :continuous-params="[
         'background-color=#F2F2F2',
          'color=#1B76FF', 'width=14rem','height=3.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
            @click="rejectProceedings"
        >
        </base-button>
        <base-button
            :is-active="true"
            button-inner-txt="تایید می‌کنم"
            :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=14rem','height=3.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
            @click="confirmProceedings"
        >
        </base-button>
      </div>
      <div v-else>
        <div style="color: #2AB459" v-if="isConfirmedProceedings" >
          شما این صورتجلسه را تایید کرده اید
        </div>
        <div style="color: #EC3737" v-else>
          شما این صورت جلسه را رد کرده اید
        </div>
      </div>

      <div class="create-proceedings-action--footer__more" ref="mini-drop-down-container-after-proceedings-created">
        <more-icon color="#75758F"></more-icon>
        <base-mini-drop-down
            :open="dropDownIsOpen.flag"
            direction-y="upward"
            direction-x="proceedings"
            :items="dropDownItemsAfterProceedingsCreated"
            @select-item="getSelectedItem"
        >
        </base-mini-drop-down>
      </div>
    </section>
  </div>
  <teleport to="body" v-if="showCreateProceedingsModal">
    <base-modal :open="showCreateProceedingsModal">
      <template #modal-header>
        <div class="confirm-proceedings-modal-header" :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr' , width: $i18n.locale !== 'en' ? '40rem' : '57rem'}">
          <h2>{{ $store.getters.t('confirming-and-sending-the-meeting-minutes-to-the-participants') }}</h2>
          <img draggable="false" style="width: 2.4rem;height: 2.4rem;cursor: pointer" src="/img/close.svg"
               @click="rejectCreateProceedings">
        </div>
      </template>
      <template #modal-body>
        <div class="confirm-proceedings-modal-body" :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr' , width: $i18n.locale !== 'en' ? '40rem' : '42rem'}">
          <span>{{ $store.getters.t('after-approval-you-are-no-longer-able-to-edit-the-minutes') }}</span>

        </div>
      </template>
      <template #modal-buttons>
        <div class="confirm-proceedings-modal-action">
          <base-button
              :is-active="true"
              :button-inner-txt= "$store.getters.t('withdrawal')"
              :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
              :style-types="['large--button']"
              @click="rejectCreateProceedings"

          >
          </base-button>
          <base-button
              :is-active="true"
              :button-inner-txt= "$store.getters.t('confirm-layout')"
              :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
              :style-types="['large--button']"
              @click="confirmCreateProceedings">

          </base-button>
        </div>
      </template>
    </base-modal>
  </teleport>
  <teleport to="body">
  <div v-if="isListModalOpen" style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);z-index: 10;background-color: white;border-radius: 0.8rem">

      <div class="proceedings-answer-modal-header">
        <h2>لیست تایید کننده صورت جلسه</h2>
        <img draggable="false" style="width: 2.4rem;height: 2.4rem;cursor: pointer" src="/img/close.svg" @click="isListModalOpen = false">
      </div>


      <div class="proceedings-answer-modal-body">
        <div
            style="width: 100%;display: flex;justify-content: space-between;direction: rtl;color: #75758F;font-size: 1.4rem;font-weight: 700;height:4.8rem;padding: 0 2.4rem; ">
          <span>افراد شرکت کننده</span>
          <span>وضعیت</span>
        </div>
        <div class="proceedings-answer__table">
          <div v-for="user in resultProceedingsList" :key="user.id" class="proceedings-answer__table-list">
            <span>{{user.displayName}}</span>
            <span v-if="user.agree === true" style="color: #2AB459">تایید کرده</span>
            <span v-else-if="user.agree === false" style="color: red">رد کرده</span>
            <span v-else>عدم پاسخگویی</span>
          </div>
        </div>
      </div>

      <div class="proceedings-answer-modal-footer">

        <Span style="color: #2AB459;font-size: 1.4rem;direction: rtl">{{userConfirmProceedings + ' ' + 'نفر' + ' ' + 'تایید'}}</Span>

        <Span style="width: 0;height: 2rem;border:0.1rem solid #DCDADA"></Span>
        <Span style="color: #EC3737;font-size: 1.4rem;direction: rtl">{{userRejectProceedings + ' ' + 'نفر' + ' ' + 'رد'}}</Span>
        <Span style="width: 0;height: 2rem;border:0.1rem solid #DCDADA"></Span>
        <Span style="color: #292933;font-size: 1.4rem;direction: rtl">{{userDoNotAnswerProceedings + ' ' + 'نفر' + ' ' + 'عدم پاسخگویی'}}</Span>
      </div>
  </div>
  </teleport>
</template>

<script>
import RestClient from "@/api/restClient";
import momentJalali from "moment-jalaali";
import entityTypes from "@/statics/entityTypes";
// import room_handler from "../utilities/room_handler";
import BaseButton from "@/components/UI/BaseButton.vue";
import AddPlus from "@/components/UI/Icons/AddPlus.vue";
import ProceedingsParagraph from "@/components/ProceedingsParagraph.vue";
import BaseModal from "@/components/UI/BaseModal.vue";
import MoreIcon from "@/components/UI/Icons/MoreIcon.vue";
import BaseMiniDropDown from "@/components/UI/BaseMiniDropDown.vue";
import MiniDropDownHandler from "@/utils/mini.drop.down.actions";
import webSocketClient from "@/webSocketClient";

export default {
  name: "CreateProceedings",
  components: {BaseMiniDropDown, MoreIcon, BaseModal, ProceedingsParagraph, AddPlus, BaseButton},
  props: ["isProceedingsStarted","allProceedingsParagraphs","proceedingsId", "meetingTitle", "chatBoxTitle", "sideBarIsVisible", "isProceedingsCreated", "isConfirmedProceedings", "isProceedingsAnswered","proceedingsAllowed"],
  data() {
    return {
      restClient: new RestClient(entityTypes.proceedings),
      isResultShowed: true,
      paragraphs: [],
      paragraphText: '',
      assignedParticipant: '',
      createOrResult: 'create',
      creationOrUpdatingMeetingResult: 'creation',
      meetingName: '',
      proceedingsNumber: '',
      description: '',
      descriptionPlus: '',
      proceedingsResultList: [],
      allProceedings: [],
      isPassedThreeSeconds: false,
      isGetResult: false,
      date: '',
      showCreateProceedingsModal: false,
      isListModalOpen: false,
      proceedingsCreated:false,
      minutesId:null,
      dropDownItemsBeforeProceedingsCreated: [
      // {
      //   label: this.$store.getters.t('list-of-approvers'),
      // },
      //   {
      //     label: this.$store.getters.t('PDF-output'),
      //   },
      //   {
      //     label: this.$store.getters.t('print'),
      //   },
        {
          label: this.$store.getters.t('delete-meeting-minutes'),
        },
        ],
      dropDownItemsAfterProceedingsCreated: [
        {
          label: this.$store.getters.t('PDF-output'),
        },
        // {
        //   label: this.$store.getters.t('print'),
        // },
        // {
        //   label: this.$store.getters.t('delete-meeting-minutes'),
        // },
      ],
      dropDownIsOpen: {flag: false},
      resultProceedingsList:[],
      userConfirmProceedings: 0,
      userRejectProceedings: 0,
      userDoNotAnswerProceedings:0,
      nowDate:'',
      startTimeForPrivate:'',
      proceedingsStarted:false,

    }
  },
  watch: {
    isProceedingsCreated:{
      immediate:true,
      handler(val){

        this.proceedingsCreated = val
        if (val){
          setTimeout(()=>{
            new MiniDropDownHandler(
                this.$refs["mini-drop-down-container-before-proceedings-created"],
                this.dropDownIsOpen
            );
            new MiniDropDownHandler(
                this.$refs["mini-drop-down-container-after-proceedings-created"],
                this.dropDownIsOpen)
            // this.getProceedingsByMeetingId()
          },10)
        }
      }
    },
    proceedingsAllowed(val){
      if (val){
        setTimeout(()=>{
          new MiniDropDownHandler(
              this.$refs["mini-drop-down-container-before-proceedings-created"],
              this.dropDownIsOpen
          );
          new MiniDropDownHandler(
              this.$refs["mini-drop-down-container-after-proceedings-created"],
              this.dropDownIsOpen
          );

          // this.getProceedingsByMeetingId()
        },10)
      }
    },
    allProceedingsParagraphs:{
      immediate: true,
      deep:true,
      handler(val) {
        if (val?.length > 0 &&  this.paragraphs?.length === 0 ){
          this.changeParagraph(val)
          // this.isProceedingsStarted = true
        }
      }
    },
  },
  methods: {
    changeParagraph(val){
      this.paragraphs = val.map((el)=>{
        setTimeout(()=>{
          this.eventBus.emit('complete-paragraph-join-to-room', {id:el.paragraphId,status: el.status})
        },0)
        return {  paragraphText: el.paragraphText,
          assignedParticipant: el.assignee,
          paragraphId: el.paragraphId,
          createTime: el.createTime,
          status: el.status}
      })
    },
    showProceedingsDetails() {
      this.isResultShowed = !this.isResultShowed
    },
    createNewParagraph() {
      let someDate = new Date();
      someDate = someDate.getTime();
      if ((this.paragraphs.length > 0 && this.paragraphs[this.paragraphs.length - 1]?.paragraphText.length > 2) || this.paragraphs.length === 0) {
        let id = Math.floor(Math.random() * 1000000)
        this.paragraphs.push({
          paragraphText: this.paragraphText,
          assignedParticipant: this.assignedParticipant,
          paragraphId: id,
          createTime: someDate,
          status: 'create'
        });
        // room_handler.sendPreProceedingsParagraphData(this.$store.getters.roomId)
        webSocketClient.getInstance().sendParagraph({
          paragraphText: this.paragraphText,
          assignee: this.assignedParticipant,
          paragraphId: id,
          createTime: someDate,
          status: 'create',
        })
      } else {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "warning",
          bodyText: this.$store.getters.t('first-complete-and-confirm-the-created-paragraph-and-then-create-the-new-paragraph'),
          time: 5000,
        });
      }

    },
    deleteParagraph(data) {
      if (data.paragraphId) {
        const foundIndex = this.paragraphs.findIndex((el) => {
          return +el.paragraphId === +data.paragraphId
        })
        if (foundIndex !== -1) {
          this.paragraphs.splice(foundIndex, 1)
        }
      } else {
        this.paragraphs.pop()
      }
      webSocketClient.getInstance().deleteParagraph({
        paragraphText: this.paragraphText,
        assignee: this.assignedParticipant,
        paragraphId: data.paragraphId,
        createTime: data.createTime,
        status: 'delete',
      })
      // room_handler.deleteProceedingsParagraph(this.$store.getters.roomId, {
      //   paragraphId: data.paragraphId,
      //   paragraphIndex: +data.paragraphIndex + 1
      // })
    },
    editParagraph(data) {
      const editedIndex = this.paragraphs.findIndex((paragraph) => {
        return paragraph.paragraphId === data.paragraphId
      })
      if (editedIndex !== -1) {
        this.paragraphs[editedIndex].status = 'update'
      }
      webSocketClient.getInstance().sendParagraph({
        paragraphText: data.paragraphText,
        assignee: data.assignee,
        paragraphId: data.paragraphId,
        createTime: data.createTime,
        status: 'update',
      })
      // room_handler.preEditProceedingsParagraph(this.$store.getters.roomId, {
      //   paragraphId: data.paragraphId,
      //   paragraphIndex: +data.paragraphIndex + 1
      // })
    },
    completeParagraph(paragraph) {
      const foundIndex = this.paragraphs.findIndex((el) => {
        return +el.paragraphId === +paragraph.paragraphId
      })
      if (foundIndex !== -1) {
        this.paragraphs[foundIndex].paragraphText = paragraph.paragraphText
        this.paragraphs[foundIndex].assignedParticipant = paragraph.assignee
        this.paragraphs[foundIndex].status = 'done'
        webSocketClient.getInstance().sendParagraph(paragraph)
        // if (paragraph.status === 'update') {
        //   const editedIndex = this.paragraphs.findIndex((paragraphEl) => {
        //     return paragraphEl.paragraphId === paragraph.paragraphId
        //   })
        //   if (editedIndex !== -1) {
        //     this.paragraphs[editedIndex].status = 'done'
        //   }
        //   webSocketClient.getInstance().sendParagraph(paragraph)
        //   // room_handler.editProceedingsParagraph(this.$store.getters.roomId, {
        //   //   ...paragraph
        //   // })
        // } else {
        //   webSocketClient.getInstance().sendParagraph(paragraph)
        //   // room_handler.sendProceedingsParagraphData(this.$store.getters.roomId, {
        //   //   ...paragraph
        //   // })
        // }

      }
    },
    startProceedings() {
      // this.isProceedingsStarted = true
      this.paragraphs = []
      this.proceedingsStarted = true
      // room_handler.startProceedings(this.$store.getters.roomId, {
      //   proceedingsNumber: this.proceedingsNumber,
      //   proceedingsSecretary: this.$store.getters.displayName,
      // })
    },
    createProceedings() {
      const editIdx = this.paragraphs.findIndex((paragraph) => {
        return paragraph?.status === 'update'
      })
      if (this.proceedingsNumber.length > 0 && this.paragraphs.length > 0 && this.paragraphs[this.paragraphs.length - 1].paragraphText.length > 2 && editIdx === -1) {
        this.showCreateProceedingsModal = true
      } else if (this.proceedingsNumber.length === 0) {
        this.eventBus.emit('notification', {
          type: 'error',
          bodyText: this.$store.getters.t('the-minutes-number-must-not-be-empty'),
          time: 5000
        })
      } else if (this.paragraphs.length === 0) {
        this.eventBus.emit('notification', {
          type: 'error',
          bodyText: this.$store.getters.t('you-have-not-created-any-clauses'),
          time: 5000
        })
      } else if (this.proceedingsNumber.length !== 0 && this.paragraphs[this.paragraphs.length - 1].paragraphText.length === 0) {
        this.eventBus.emit('notification', {
          type: 'error',
          bodyText: this.$store.getters.t('one-of-the-created-clauses-is-incomplete'),
          time: 5000
        })
      } else if (this.proceedingsNumber.length !== 0 && this.paragraphs[this.paragraphs.length - 1].paragraphText.length > 2 && editIdx !== -1) {
        this.eventBus.emit('notification', {
          type: 'error',
          bodyText: this.$store.getters.t('at-least-one-of-the-clauses-is-being-edited'),
          time: 5000
        })
      }
    },
    confirmCreateProceedings() {
      this.showCreateProceedingsModal = false
      const agendas = this.paragraphs.map((paragraph) =>{
        return {description: paragraph.paragraphText, attendee:paragraph.assignedParticipant}
      })
      let data = {}
      if (!this.$store.getters.isPrivate){
         data = {
          meetingId: this.$store.getters.roomId,
          meetingName: this.$store.getters.session_name ,
          meetingDate:this.$store.getters.startTime,
          createdBy: this.$store.getters.displayName,
          meetingMinutesNumber: this.proceedingsNumber,
          agendas: agendas
        }
      }else {
         data = {
          meetingId: this.$store.getters.prRoomID,
          meetingName: this.$store.getters.session_name ,
          meetingDate:this.startTimeForPrivate,
          createdBy: this.$store.getters.displayName,
          meetingMinutesNumber: this.proceedingsNumber,
          agendas: agendas
        }
      }

      this.restClient.createProceedings(data).then(() => {

        // room_handler.createProceedings(this.$store.getters.roomId, {proceedingsNumber: this.proceedingsNumber, proceedingsId: response.body.id,proceedingsSecretary:this.$store.getters.displayName,proceedingsDate:this.$store.getters.fromSchd.dayNum + ' ' + this.$store.getters.fromSchd.monthName + ' ' + this.$store.getters.fromSchd.yearName })
      })
          .catch((error) =>{
            console.error(error)
          })
    },
    rejectCreateProceedings() {
      this.showCreateProceedingsModal = false
    },
    openList() {

      if (!this.$store.getters.isPrivate){
        this.getMeetingMinutesSignResult()
      }else {
        this.getPrivateMeetingMinutesSignResult()
      }
      this.isListModalOpen = true
    },
    getAllResultProceedings() {
      this.allProceedings = [];
      this.restClient
          .getAllResult(this.minutesId)
          .then((response) => {
            console.log(response)
            // this.isPassedThreeSeconds = false
            // this.isGetResult = true
            // this.allProceedings = response;
            //
            // this.selectedQuestion = {
            //   label: response[response.length - 1].proceedingsNumber,
            //   proceedingsId: response[response.length - 1].id
            // };
            // for (const el of response.reverse()) {
            //   this.resultAllProceedings.push({label: el.proceedingsNumber, proceedingsId: el.id});
            // }

          })
          .catch((error) => {
            this.isPassedThreeSeconds = true
            this.isGetResult = false
            console.error(error);
          })
          .finally(() => {
          });
    },
    getResult(){
      this.allProceedings = [];
      this.restClient
          .getResult(this.minutesId)
          .then((response) => {
            console.log(response)

          })
          .catch((error) => {
            this.isPassedThreeSeconds = true
            this.isGetResult = false
            console.error(error);
          })
          .finally(() => {
          });
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
          .finally(() => {
          });
    },
    showResults() {
      this.getAllResultProceedings(this.$store.getters.roomId)
      this.createOrResult = 'result'
    },
    closeMeetingResult() {
      this.$emit("close-meeting-result");
      this.creationOrUpdatingMeetingResult = 'creation'
      this.createOrResult = 'create'
    },
    goToPreviewPage() {
      this.date = new Date()
      this.creationOrUpdatingMeetingResult = 'update'
    },
    updateMeetingResult() {
      this.creationOrUpdatingMeetingResult = 'creation'

    },
    ConfirmMeetingResult() {
      if ((this.description !== '') && (this.proceedingsNumber !== '')) {
        let calendarArr = momentJalali(new Date()).format('jYYYY/jMM/jDD').split(' ');
        let calendarFirstEl = calendarArr[0].split('/')
        let temp = calendarFirstEl[0]
        calendarFirstEl[0] = calendarFirstEl[2]
        calendarFirstEl[2] = temp
        calendarArr[0] = calendarFirstEl.join('/')
        const date = calendarArr.join(' ')
        this.restClient
            .createProceedings({
              startTime: this.$store.getters.startTime,
              endTime: this.$store.getters.endTime,
              meetingSecretary: this.$store.getters.displayName,
              dataOfProceeding: date,
              meetingId: this.$store.getters.roomId,
              proceedingsNumber: this.proceedingsNumber,
              description: this.description,
            })
            .then(() => {
              this.closeMeetingResult();
              // room_handler.sendProceedingsData(this.$store.getters.roomId, {
              //   id: response.data.data,
              //   startTime: this.$store.getters.startTime,
              //   endTime: this.$store.getters.endTime,
              //   meetingSecretary: this.$store.getters.displayName,
              //   dataOfProceeding: date,
              //   meetingId: this.$store.getters.roomId,
              //   proceedingsNumber: this.proceedingsNumber,
              //   description: this.description,
              //   date: this.date
              // })
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              this.sending = false;
            });
      } else {
        this.eventBus.emit('notification', {
          type: 'error',
          bodyText: this.$store.getters.t("set-number-and-topics"),
          time: 5000
        })
      }
    },
    getProceedingsByMeetingId() {
      let roomId = ''
      if (!this.$store.getters.isPrivate){
        roomId = this.$store.getters.roomId
      }else {
        roomId = this.$store.getters.prRoomID
      }

      this.restClient
          .getProceedingsById(roomId)
          .then((response) => {
            if (response?.data?.id){
              this.eventBus.emit('there-is-created-proceedings')
              this.minutesId = response.data.id
              console.error('idddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd')
              console.error(response.data)
              // this.isProceedingsStarted = true
              this.paragraphs = response.data.agendas.map((agenda)=>{
                return {
                  paragraphText: agenda.description,
                  assignedParticipant: agenda.attendee,
                  paragraphId: agenda.id,
                  status:'done'
                }
              })
              this.proceedingsNumber = response.data.meetingMinutesNumber
              this.proceedingsCreated = true
              this.proceedingsStarted = true
              setTimeout(()=>{
                new MiniDropDownHandler(
                    this.$refs["mini-drop-down-container-before-proceedings-created"],
                    this.dropDownIsOpen
                );
                new MiniDropDownHandler(
                    this.$refs["mini-drop-down-container-after-proceedings-created"],
                    this.dropDownIsOpen
                );
                // this.getProceedingsByMeetingId()
              },10)
            }

          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
          });
    },
    downloadPDF() {
      this.restClient
          .getResultInPDF(this.$store.getters.roomId)
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
            link.setAttribute("download", `${this.$store.getters.session_name}` + ' ' + `${this.minutesId}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
          });
    },
    confirmProceedings() {
      this.restClient.submitProceedings({
        meetingId: parseInt(this.$store.getters.roomId),
        agree: true,
        meetingProceedingsId: this.proceedingsId ? parseInt(this.proceedingsId) : parseInt(this.minutesId),
        userId: parseInt(this.$store.getters.userId),
      }).then(()=>{
        this.eventBus.emit('is-proceedings-answered',true)
        if (!this.$store.getters.isPrivate){
          localStorage.setItem('answerProceeding',JSON.stringify({roomId: this.$store.getters.roomId,isAnswered: true,isConfirmed: true}))
        }else{
          localStorage.setItem('answerProceeding',JSON.stringify({roomId: this.$store.getters.prRoomID,isAnswered: true,isConfirmed: true}))
        }
      }).catch((error)=>{
        console.error(error)
      })
    },
    rejectProceedings() {
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


      }).catch((error)=>{
        console.error(error)
      })
    },
    getSelectedItem(item) {
      const foundActionBeforeCreate = this.dropDownItemsBeforeProceedingsCreated.find(
          (dropDownItem) => {
           return  dropDownItem?.label === item
          }
      );
      const foundActionAfterCreate = this.dropDownItemsAfterProceedingsCreated.find(
          (dropDownItem) => {
         return    dropDownItem?.label === item
          }
      );
      switch (foundActionBeforeCreate?.label || foundActionAfterCreate?.label) {
        case  this.$store.getters.t('list-of-approvers'):
          console.log('liste taeed konandegan')
          break;
        case this.$store.getters.t('PDF-output'):
          this.downloadPDF()
          break;
        case this.$store.getters.t('print'):
          this.downloadPDF()
          break;
        case 'حذف صورت جلسه':
          // this.isProceedingsStarted = false
            this.paragraphs= []
            this.proceedingsNumber = ''
          // room_handler.deleteProceedings(this.$store.getters.roomId)
          break
      }
    },
    focusProceedingsNumber(){
      this.eventBus.emit('is-focused')
    },
    blurProceedingsNumber(){
       this.eventBus.emit('is-blured')
    },
    getMeetingMinutesSignResult(){
      console.error(this.minutesId , this.proceedingsId)
      const proceedingsId = this.minutesId || this.proceedingsId
      this.restClient.getMeetingMinutesSignResult(proceedingsId, this.$store.getters.roomId).then((response) =>{
         for(let i=0; i<response.length; i++){
           if (response[i].agree === true){
             this.userConfirmProceedings++
           }else if (response[i].agree === false){
             this.userRejectProceedings++
           }else {
             this.userDoNotAnswerProceedings++
           }
         }
        this.resultProceedingsList = response
      })
          .catch((error) =>{
            console.error(error)
          })
    },
    getPrivateMeetingMinutesSignResult(){
      const proceedingsId = this.minutesId || this.proceedingsId
      this.restClient.getPrivateMeetingMinutesSignResult(proceedingsId, this.$store.getters.prRoomID).then((response) =>{
        for(let i=0; i<response.length ; i++){
          console.error(response[i].agree)
          if (response[i].agree === true){
            this.userConfirmProceedings++
          }else if (response[i].agree === false){
            this.userRejectProceedings++
          }else {
            this.userDoNotAnswerProceedings++
          }
        }
        this.resultProceedingsList = response
      })
          .catch((error) =>{
            console.error(error)
          })
    },

  },
  mounted() {
if (this.$store.getters.isPrivate){
  this.nowDate = new Intl.DateTimeFormat('fa-IR', {dateStyle: 'full', timeStyle: 'long'}).format(Date.now()).toString().split(' ')
  this.startTimeForPrivate = new Intl.DateTimeFormat('fa-IR').format(Date.now())

}
    this.eventBus.on('get-proceedings-data-for-secretary',(data)=>{
      console.log(data)
    })
    this.eventBus.on('joined-successfully', () => {
      new MiniDropDownHandler(
          this.$refs["mini-drop-down-container-before-proceedings-created"],
          this.dropDownIsOpen
      );
      new MiniDropDownHandler(
          this.$refs["mini-drop-down-container-after-proceedings-created"],
          this.dropDownIsOpen)
      if (this.$store.getters.amIModerator){
        this.getProceedingsByMeetingId()
      }

    });
  }
}
</script>

<style scoped>
.proceedings-not-started {
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
}

.proceedings-not-started > div {
  width: 100%;
  position: absolute;
  bottom: 2rem;
  display: flex;
  justify-content: center;
  direction: rtl;
  gap: 1.2rem;
}

.create-proceedings__container {
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  overflow-y: auto;
}

.proceedings__details {
  width: 100%;
  padding: 0.8rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  font-weight: 400;
  font-size: 1.2rem;
  color: #292933;
  border-radius: 0.8rem;
}

.proceedings__details > div {
  width: 100%;
  height: 5.6rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  direction: rtl;
}

.proceedings__details > div:first-child {
  width: 100%;
  height: 4rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  direction: ltr;
}

.proceedings__details input {
  background-color: white;
  border-radius: 0.8rem;
  border: 0.1rem solid transparent;
  height: 3.2rem;
  width: 100%;
  padding: 0 0.8rem;
}

.proceedings__details input:focus {
  outline: none;
  border: 0.1rem solid transparent;
}

.proceedings__details label {
  color: #75758F;
  font-size: 1.2rem;
  font-weight: 400;
}

.proceedings__details-date-fragment {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
}

.proceedings__details-input-proceedings-number {
  width: 12.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.proceedings__details-location {
  width: calc(100% - 13.5rem);
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

.proceedings__details-secretary {
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

.proceedings--default-details {
  background-color: white;
  border-radius: 0.8rem;
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

.create-proceedings-action--footer {
  position: absolute;
  bottom: 2.4rem;
  width: 100%;
  height: 4rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  gap: 1.2rem;
  align-items: center;
}

.create-proceedings-action--footer__more {
  width: 4.8rem;
  height: 4.7rem;
  background-color: #F2F2F2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.8rem;
  cursor: pointer;
  position: relative;
  direction: rtl;
}

.create-proceedings__Paragraph--fragment {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 0 1.4rem;
}

.create-proceedings__Paragraph--action {
  width: 100%;
  display: flex;
  gap: 0.6rem;
  align-items: center;
  direction: rtl;
}

.confirm-proceedings-modal-header {
  width: 40rem;
  height: 5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.1rem solid #DCDADA;
}

.confirm-proceedings-modal-body {
  width: 40rem;
  border-bottom: 0.1rem solid #DCDADA;
  font-size: 1.6rem;
  font-weight: 400;
  justify-content: flex-start;
  padding: 0 0 2rem 0;
}

.confirm-proceedings-modal-action {
  width: 40rem;
  height: 5rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
}

.proceedings-answer-modal-header {
  display: flex;
  direction: rtl;
  width: 48rem;
  justify-content: space-between;
  padding: 2.4rem;
  font-size: 1.6rem;
}

.proceedings-answer-modal-body {
  display: flex;
  flex-direction: column;
  width: 48rem;
  min-height: 10rem;
  max-height: 27rem;
  overflow-y: auto;
  padding: 2.4rem 0;
}

.proceedings-answer-modal-footer {
  display: flex;
  justify-content: flex-start;
  gap: 0.8rem;
  width: 48rem;
  padding: 2.4rem;
}

.proceedings-answer__table {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.proceedings-answer__table > div {
  width: 100%;
  height: 4.8rem;
  display: flex;
  direction: rtl;
  justify-content: space-between;
  align-items: center;
  color: #292933;
  font-weight: 400;
  font-size: 1.4rem;
  padding: 0 2.4rem;

}
.proceedings-answer__table-list:nth-child(odd) {
 background-color: #F6F6F7;
}

@media (max-width: 630px) {
  .confirm-proceedings-modal-header {
    width: 33rem;

  }

  .confirm-proceedings-modal-body {
    width: 33rem;

  }

  .confirm-proceedings-modal-action {
    width: 33rem;

  }
}
</style>

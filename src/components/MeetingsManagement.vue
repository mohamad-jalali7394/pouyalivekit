<template>
  <div class="meeting-management__container">
    <div class="meeting-management__header" :style="{flexDirection: $i18n.locale === 'fa' ? 'row-reverse' : 'row'}">
      <h1>{{ sideBarSubItem }}</h1>
      <base-button
          v-if="sideBarSubItem !== 'مدیریت وبینارها'"
          :is-active="true"
          :button-inner-txt="$store.getters.t('create-session')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
          :style-types="['large--button']"
          @click="openCreateMetingModal"

      >
        <template #pre-button-slot>
          <add-plus color="white"></add-plus>
        </template>
      </base-button>
      <base-button
          v-else
          :is-active="true"
          :button-inner-txt="$store.getters.t('create-webinar')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
          :style-types="['large--button']"
          @click="openCreateWebinarModal"

      >
        <template #pre-button-slot>
          <add-plus color="white"></add-plus>
        </template>
      </base-button>
    </div>
    <div class="meetings-choose-time__container" :style="{flexDirection: $i18n.locale === 'fa' ? 'row-reverse' : 'row'}">
      <div class="meetings-choose-time-items">


        <span :style="{ width: $i18n.locale !== 'en' ? 'unset' : '100%' }">{{ $store.getters.t('start-time') }}</span>
        <input
            type="text"
            id="start-time-input-vue-persian-date-picker"
            v-model="fromSchdInput"
            :style="{'background-color':fromSchd ? 'white': '#F2F2F2','border': fromSchd ? '0.1rem solid #DCDADA':'0.1rem solid transparent' }"
        />
        <persian-date-picker
            color="#1B76FF"
            max="1410/08/01 08:00"
            v-model="fromSchd"
            type="datetime"
            custom-input="#start-time-input-vue-persian-date-picker"
        >
        </persian-date-picker>
      </div>

      <div class="meetings-choose-time-items">
        <span :style="{ width: $i18n.locale !== 'en' ? 'unset' : '100%' }">{{$store.getters.t('end-time')}}</span>
        <input
            type="text"
            v-model="toSchdInput"
            id="end-time-input-vue-persian-date-picker"
            :style="{'background-color':toSchd ? 'white': '#F2F2F2','border': toSchd ? '0.1rem solid #DCDADA':'0.1rem solid transparent' }"

        />
        <persian-date-picker
            color="#1B76FF"
            v-model="toSchd"
            type="datetime"
            custom-input="#end-time-input-vue-persian-date-picker"
        >
        </persian-date-picker>

      </div>

    </div>

    <div class="meeting-management-table__container">
      <div ref="table-th" :class="{'meeting-management-table__th': $i18n.locale === 'fa','meeting-management-table__th__ltr': $i18n.locale !== 'fa'}" :style="{flexDirection: $i18n.locale === 'fa' ? 'row' : 'row-reverse'}">
        <span v-for="el in meetingListTh" :key="el" :style="{textAlign: $i18n.locale !== 'en' ? 'right' : 'left' , width: $i18n.locale === 'fa' ? '11.25%' : '33.25%'}">{{ el }}</span>
      </div>
      <ul class="meeting-management-table__Ul">
        <li :class="$i18n.locale !== 'en' ? 'meeting-management-table__list' : 'meeting-management-table__list-ltr'" v-for="meeting in showedMeetings" :key="meeting.id" :style="{flexDirection: $i18n.locale === 'fa' ? 'row' : 'row-reverse' , justifyContent: $i18n.locale !== 'en' ? 'unset' : 'space-between'}">
          <div :style="{textAlign: $i18n.locale === 'fa' ? 'right' : '-webkit-left' , width: $i18n.locale !== 'en' ? '11.25%' : '8.25%'}"><span class="meeting-management-info" >{{ meeting.fromSchd }}</span></div>
          <div><span class="meeting-management-info">{{ meeting.toSchd }}</span></div>
          <div><span class="meeting-management-info">{{ meeting.createdDate }}</span></div>
          <div><span class="meeting-management-info">{{ meeting.title }}</span></div>
          <div><span class="meeting-management-info">{{ meeting.roomName }}</span></div>
          <div><span class="meeting-management-info">{{ meeting.firstNameManger + ' ' + meeting.lastNameManager }}</span>
          </div>
          <div><span class="meeting-management-info">{{ meeting.userCreator }}</span></div>
          <div><span class="meeting-management-info"
                     :style="{color:meeting.meetingStatus === 'IN_PROGRESS' ? '#2AB459' : meeting.meetingStatus === 'FINISHED' ? '#A6C4F6' :  meeting.meetingStatus === 'CANCELED' ?'#Ec3737' : '#5392F2'}">{{
              meeting.meetingStatus === 'IN_PROGRESS' ? 'درحال برگزاری' : meeting.meetingStatus === 'FINISHED' ? 'به اتمام رسیده' : meeting.meetingStatus === 'CANCELED' ? 'لغو شده' : 'تنظیم شده'
            }}</span></div>
          <div :style="{justifyContent: $i18n.locale === 'fa' ? 'flex-end' : 'flex-start'}">
            <img draggable="false" src="/img/edit.svg" style="cursor: pointer;width: 2rem;height: 2rem" alt="not loaded"
                 @click=" openUpdateMeetingModal(meeting.id, meeting.meetingStatus === 'CANCELED' ? false : true)"
                 :style="{cursor:meeting.meetingStatus === 'CANCELED'? 'not-allowed' : 'pointer',opacity:meeting.meetingStatus === 'CANCELED'? '0.5' : '1'}">
            <img draggable="false" src="/img/delete.svg" style="cursor: pointer;width: 2rem;height: 2rem" alt="not loaded"
                 @click="openDeleteMeetingModal(meeting, meeting.meetingStatus !== 'SCHEDULED' ? false : true)"
                 :style="{cursor:meeting.meetingStatus !== 'SCHEDULED' ? 'not-allowed' : 'pointer',opacity:meeting.meetingStatus !== 'SCHEDULED'? '0.5' : '1'}">
          </div>
        </li>
      </ul>
    </div>
    <div v-if="meetings?.length === 0 && !isWebinar" style="color: #E50000;font-size: 1.8rem;width: 100%;text-align: center">
   {{$t('there-is-no-meeting')}}

    </div>
    <div v-if="meetings?.length === 0 && isWebinar" style="color: #E50000;font-size: 1.8rem;width: 100%;text-align: center">
      هیچ وبیناری در این بازه زمانی وجود ندارد

    </div>
    <div class="meeting-management__change-page" v-if="meetings.length > 0">
      <div>
        {{ this.$store.getters.t("pagination-count", {pageCount: pageCount, currentPage: currentPage}) }}
      </div>
      <div style="width: 40%;height: 70%;display: flex;flex-direction: row;align-items: center;justify-content: center">
<!--        <div class="pre-button-pagination" :style="{opacity:isPreButtonActive ? '1' : '0.4' }">-->
<!--          <svg style="width: 16px;height: 16px" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--               xmlns="http://www.w3.org/2000/svg">-->
<!--            <path-->
<!--                d="M7.51348 11.3L13.1135 5.60005C13.5135 5.20005 14.1135 5.20005 14.5135 5.60005C14.9135 6.00005 14.9135 6.60005 14.5135 7.00005L9.61348 11.9L14.5135 16.8C14.7135 17 14.8135 17.2 14.8135 17.5C14.8135 18.1 14.4135 18.5 13.8135 18.5C13.5135 18.5 13.3135 18.4 13.1135 18.2L7.41348 12.5C7.11348 12.3 7.11348 11.7 7.51348 11.3Z"-->
<!--                fill="black"/>-->
<!--          </svg>-->
<!--          <span>{{ $store.getters.t('previous') }}</span>-->
<!--        </div>-->
        <the-pagination :items-length="meetings.length" :items-per-page="10" :current-page="currentPage"  @change-page="changePage" />

<!--        <paginate-->
<!--            :page-count="pageCount"-->
<!--            :page-range="4"-->
<!--            :click-handler="paginationCallback"-->
<!--            :prev-text="'.............'"-->
<!--            :next-text="'.............'"-->
<!--            :container-class="'pagination-container'"-->
<!--            :page-class="'pagination-list'"-->
<!--            :page-link-class="'page-link-class'"-->
<!--            :prev-link-class:="'prev-link-pagination'"-->
<!--            :break-view-link-class="'break-view-pagination'"-->
<!--            :active-class="'active-classs'"-->
<!--            :disabled-class="'disabled-pagination'"-->
<!--            :prev-class="'prev-list-pagination'"-->
<!--            :next-class="'next-class-pagination'"-->

<!--        >-->
<!--          <template #breakViewContent>-->
<!--            <svg width="16" height="4" viewBox="0 0 16 4">-->
<!--              <circle fill="#292933" cx="2" cy="2" r="2"/>-->
<!--              <circle fill="#292933" cx="8" cy="2" r="2"/>-->
<!--              <circle fill="#292933" cx="14" cy="2" r="2"/>-->
<!--            </svg>-->
<!--          </template>-->
<!--        </paginate>-->
<!--        <div class="next-button-pagination" :style="{opacity:isNextButtonActive ? '1' : '0.4' }">-->
<!--        <span>-->
<!--          {{ $store.getters.t('next') }}-->
<!--        </span>-->
<!--          <svg style="width: 16px;height: 16px" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--               xmlns="http://www.w3.org/2000/svg">-->
<!--            <path-->
<!--                d="M14.5002 12.5L8.9002 18.2C8.5002 18.6 7.9002 18.6 7.5002 18.2C7.1002 17.8 7.1002 17.2 7.5002 16.8L12.4002 11.9L7.5002 7C7.3002 6.8 7.2002 6.6 7.2002 6.3C7.2002 5.7 7.6002 5.3 8.2002 5.3C8.5002 5.3 8.7002 5.4 8.9002 5.6L14.6002 11.3C14.9002 11.5 14.9002 12.1 14.5002 12.5Z"-->
<!--                fill="black"/>-->
<!--          </svg>-->
<!--        </div>-->
      </div>
      <div :style="{direction : $i18n.locale !== 'fa' ? 'ltr' : 'rtl'}"> {{$store.getters.t('meeting-length', {length: meetingsLength})}}</div>
    </div>

  </div>
  <base-modal :open="isDeleteMeetingOpen">
    <template #modal-header>
      <div class="delete-meeting-modal-header">
        <h2>حذف جلسه</h2>
        <img draggable="false" style="width: 2.4rem;height: 2.4rem;cursor: pointer" src="/img/close.svg" @click="closeDeleteMeetingModal">
      </div>
    </template>
    <template #modal-body>
      <div class="delete-meeting-modal-body">
        <span>آیا از حذف </span>
        <span>{{ ' ' + 'این جلسه' + ' ' }}</span>
        <span>مطمئن هستید؟</span>
      </div>
    </template>
    <template #modal-buttons>
      <div class="delete-meeting-modal-action">
        <base-button
            :is-active="true"
            button-inner-txt="انصراف"
            :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
            :style-types="['large--button']"
            @click="closeDeleteMeetingModal"

        >
        </base-button>
        <base-button
            :is-active="true"
            button-inner-txt="بله حذف شود"
            :continuous-params="[
          'background-color=#EC3737',
          'color=white',
          ]"
            :style-types="['large--button']"
            @click="deleteMeeting">

        </base-button>
      </div>
    </template>
  </base-modal>
  <base-modal :is-loading="'isLoading'"  :open="isLoading" is-blur="true" modal-color="transparent">
    <template #modal-body>
      <base-loading-spinner size-ratio="1.2" spinner-color="#409EFF">
        <template #loading-content>
          <div style="overflow: hidden; color: #409EFF" class="loading__extra-content--text">{{$store.getters.t("pleaseWait")}}</div>
        </template>
      </base-loading-spinner>
    </template>
  </base-modal>
</template>

<script>
import BaseButton from "./UI/BaseButton";
import RestClient from "@/api/restClient";
import BaseModal from "./UI/BaseModal";
import PersianDatePicker from "vue3-persian-datetime-picker";
import GenericClient from "@/api/restClient/genericClient";
import AddPlus from "@/components/UI/Icons/AddPlus.vue";
import {nextTick} from "vue";
import ThePagination from "@/components/ThePagination.vue";
import BaseLoadingSpinner from "@/components/UI/BaseLoadingSpinner.vue";

const genericClient = new GenericClient()
export default {
  name: "MeetingsManagement",
  props: ['sideBarSubItem',"isWebinar","userRole"],
  components: {BaseLoadingSpinner, ThePagination, AddPlus, BaseModal, BaseButton, PersianDatePicker},
  data() {
    return {
      fromSchd: genericClient.convertDateWithZeroTime(
          new Date(),
          'jYYYY/jM/jD HH:mm'
      ),
      toSchd: genericClient.convertDatePlus(
          new Date(),
          'jYYYY/jM/jD HH:mm'
      ),
      showStartDatePicker: 'false',
      showEndDatePicker: "false",
      isCreateMeetingClicked: false,
      restClientScheduleMeeting: new RestClient('scheduledMeeting'),
      tableMaxHeight: '',
      meetings: [],
      timer: null,
      currentPage: 1,
      pageCount: 1,
      isNextButtonActive: true,
      isPreButtonActive: false,
      isLoading: false,
      pageNumber: 1,
      pageSize: 10,
      isDeleteMeetingOpen: false,
      meetingId: null,
      firstName: null,
      lastName: null,
      meetingsLength:0,
    }
  },
  watch: {
    sideBarSubItem(){
      this.fromSchd= genericClient.convertDateWithZeroTime(
          new Date(),
          'jYYYY/jM/jD HH:mm'
      ),
          this.toSchd= genericClient.convertDatePlus(
              new Date(),
              'jYYYY/jM/jD HH:mm'
          )
    },
    fromSchd() {
      if (!this.isWebinar){
        this.getAllMeetings()
      }else {
        this.getAllWebinars()
      }

    },
    toSchd() {
      if (!this.isWebinar){
        this.getAllMeetings()
      }else {
        this.getAllWebinars()
      }

    },
    currentPage: {
      immediate: true,
      handler(val) {
        if (val === 1 && this.pageCount > 1) {
          this.isPreButtonActive = false
          this.isNextButtonActive = true
        } else if (val === 1 && this.pageCount === 1) {
          this.isPreButtonActive = false
          this.isNextButtonActive = false
        } else if (val === this.pageCount && this.pageCount > 1) {
          this.isPreButtonActive = true
          this.isNextButtonActive = false
        } else if (val === this.pageCount && this.pageCount === 1) {
          this.isPreButtonActive = false
          this.isNextButtonActive = false
        } else {
          this.isPreButtonActive = true
          this.isNextButtonActive = true
        }
      }

    },
    isWebinar(val){
      this.fromSchd = genericClient.convertDateWithZeroTime(
          new Date(),
          'jYYYY/jM/jD HH:mm'
      )
      this.toSchd = genericClient.convertDatePlus(
          new Date(),
          'jYYYY/jM/jD HH:mm'
      )
      if (!val){
        this.getAllMeetings()
      }else {
        this.getAllWebinars()
      }
    }
  },
  computed: {
    fromSchdInput(){
      return this.fromSchd.split(' ')[0]
    },
    toSchdInput(){
      return this.toSchd.split(' ')[0]
    },
    meetingListTh() {
      if (this.sideBarSubItem !== this.$store.getters.t('webinar-management')) {
        return [this.$store.getters.t('start-time'), this.$store.getters.t('end-time'), this.$store.getters.t('registration-time'), this.$store.getters.t('meeting-title'), this.$store.getters.t('meeting-place'), this.$store.getters.t('meeting-moderator'), this.$store.getters.t('creator'), this.$store.getters.t('meeting-status'), this.$store.getters.t('action')]
      } else {
        return [this.$store.getters.t('start-time'), this.$store.getters.t('end-time'), this.$store.getters.t('registration-time'), this.$store.getters.t('webinar-title'), this.$store.getters.t('webinar-place'), this.$store.getters.t('webinar-moderator'), this.$store.getters.t('creator'), this.$store.getters.t('webinar-status'), this.$store.getters.t('action')]
      }

    },
    showedMeetings() {
      const startIndex = ((this.currentPage - 1) * 10)
      if (this.meetings.length - startIndex > 10) {

        return this.meetings.slice(startIndex, startIndex + 10)
      } else {
        return this.meetings.slice(startIndex, this.meetings.length)
      }

    }
  },
  methods: {
    openCreateMetingModal(){
      this.$emit('open-create-meeting')
    },
    openCreateWebinarModal(){
      this.$emit('open-create-webinar')
    },
    changePage(page) {
      this.currentPage = page
      this.pageNumber = page
    },
    openDeleteMeetingModal(meeting, status) {
      if (status) {
        this.meetingId = meeting.id
        this.isDeleteMeetingOpen = true
      }

    },
    closeDeleteMeetingModal() {
      this.meetingId = null
      this.isDeleteMeetingOpen = false
    },
    openUpdateMeetingModal(id,flag) {
      if (flag){
        if (!this.isWebinar){
          this.eventBus.emit('edit-created-meeting',{id:id})
        }else {
          this.eventBus.emit('edit-created-webinar',{id:id})
        }
      }


    },
    deleteMeeting() {
      this.isLoading = true
      this.restClientScheduleMeeting.cancelMeeting(this.meetingId, true).then(() => {
        this.closeDeleteMeetingModal()
        this.getAllMeetings()
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "success",
          bodyText: 'لغو جلسه با موفقیت انجام شد',
          time: 5000,
        });
        this.isLoading = false
      }).catch((error) => {
        console.error(error)
        this.isLoading = false
      })
    },
    closeStartDatePicker() {
      this.showStartDatePicker = false
      this.showEndDatePicker = false
    },
    closeEndDatePicker() {
      this.showStartDatePicker = false
      this.showEndDatePicker = false
    },
    getAllMeetings() {
      this.meetings = []
      this.isLoading = true
          this.currentPage= 1
          this.pageCount= 1
          this.isNextButtonActive= true
          this.isPreButtonActive= false
          this.pageNumber= 1
          this.pageSize= 10
      this.restClientScheduleMeeting.getAll(this.fromSchd, this.toSchd).then((response) => {
        if (this.userRole[0] === 'ROLE_ADMIN' || this.userRole[1] === 'ROLE_ADMIN'){
          this.meetings = response.filter((meeting)=>{
            return meeting.isWebinar === false
          })
        }else if (this.userRole[0] === 'ROLE_SECRETARY' || this.userRole[1] === 'ROLE_SECRETARY'){
          this.meetings = response.filter((meeting)=>{
            return meeting.isWebinar === false && +meeting?.creatorUserId === +this.$store.getters.userId
          })
        }

        this.pageCount = Math.ceil( this.meetings.length / 10)
        this.meetingsLength = this.meetings.length
        this.isLoading = false
      }).catch((error) => {
        console.error(error)
        this.isLoading = false
      })
    },
    getAllWebinars() {
      this.meetings = []
      this.isLoading = true
      this.currentPage= 1
      this.pageCount= 1
      this.isNextButtonActive= true
      this.isPreButtonActive= false
      this.pageNumber= 1
      this.pageSize= 10
      this.restClientScheduleMeeting.getAll(this.fromSchd, this.toSchd).then((response) => {
        console.error(response.data)
        if (this.userRole[0] === 'ROLE_ADMIN' || this.userRole[1] === 'ROLE_ADMIN'){
          this.meetings = response.filter((meeting)=>{
            return meeting.isWebinar === true
          })
        }else if (this.userRole[0] === 'ROLE_SECRETARY' || this.userRole[1] === 'ROLE_SECRETARY'){
          this.meetings = response.filter((meeting)=>{
            return meeting.isWebinar === true && +meeting?.creatorUserId === +this.$store.getters.userId
          })
      }
          this.pageCount = Math.ceil(this.meetings.length / 10)
        console.error( this.meetings)
        this.isLoading = false
      }).catch((error) => {
        console.error(error)
        this.isLoading = false
      })
    }
  },

  mounted() {
    console.error('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    nextTick(()=>{
      if (!this.isWebinar){
        this.getAllMeetings()
      }else {
        this.getAllWebinars()
      }
    })
    this.tableMaxHeight = window.innerHeight - this.$refs['table-th'].getBoundingClientRect().bottom - 100 + 'px'
    window.addEventListener("resize", () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.$refs.camera) {
          this.tableMaxHeight = window.innerHeight - this.$refs['table-th'].getBoundingClientRect().bottom - 100 + 'px'
        }

      }, 80);
    });
  }
}
</script>

<style scoped>
.meeting-management__container {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
  max-height: calc(100vh - 9rem);
  overflow-y: auto;
}

/*::-webkit-scrollbar {*/
/*  width: 3px;*/


/*}*/

/*::-webkit-scrollbar-track {*/
/*  background: transparent;*/


/*}*/

/*::-webkit-scrollbar-thumb {*/
/*  background: rgb(170, 168, 168);*/
/*  border-radius: 12px;*/


/*}*/

/*::-webkit-scrollbar-track-piece {*/
/*  height: 4px;*/

/*}*/
.meeting-management__header {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.6rem 1.6rem;
  border-bottom: 0.1rem solid #DCDADA;
}

.meeting-management__header > h1 {
  font-size: 2.5rem;
}

.meetings-choose-time__container {
  display: flex;
  gap: 1.6rem;
  height: fit-content;
  width: 100%;
  padding: 1.6rem 1.6rem;
  border-bottom: 0.1rem solid #DCDADA;
}

.meeting-management-table__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  direction: rtl;
}

.meeting-management-table__th {
  width: 100%;
  min-width: 80rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.6rem;
}

.meeting-management-table__th > span {
  font-size: 1.4rem;
  font-weight: 700;
}

.meeting-management-table__th > span:last-child {
  width: 10%;
  min-width: 6rem;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: left;
}


.meeting-management-table__th__ltr {
  width: 100%;
  min-width: 80rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.6rem;
}

.meeting-management-table__th__ltr > span {
  font-size: 1.4rem;
  font-weight: 700;
}

.meeting-management-table__th__ltr > span:last-child {
  width: 10%;
  min-width: 6rem;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: right;
}

.meeting-management-table__Ul {
  width: 100%;
  min-width: 80rem;
  display: flex;
  flex-direction: column;
  direction: rtl;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}

.meeting-management-table__list {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 1.6rem;
}
.meeting-management-table__list-ltr {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 1.6rem;
}
.meeting-management-table__list-ltr:nth-child(odd) {
  background-color: #F6F6F7;
}
.meeting-management-table__list-ltr> div {
  width: 11.25%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}
.meeting-management-table__list-ltr span {
 text-align: left;
}

.meeting-management-table__list:nth-child(odd) {
  background-color: #F6F6F7;
}

.meeting-management-table__list > div {
  width: 11.25%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}

.meeting-management-info {
  display: block;
  width: 80%;
  height: auto;
  white-space: pre-line;
  overflow-wrap: break-word;
  position: relative;
  direction: rtl;
  font-size: 1.4rem;
  font-weight: 400;
}

.meeting-management-table__list > div:last-child {
  width: 10%;
  min-width: 6rem;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
}


.pre-button-pagination {
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  align-items: center;
  position: relative;
  right: -5rem;
  z-index: -1
}

.pre-button-pagination > span {
  font-weight: 400;
  font-size: 1.2rem
}

.next-button-pagination {
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  align-items: center;
  position: relative;
  left: -5rem;
  z-index: -1
}

.next-button-pagination > span {
  font-weight: 400;
  font-size: 1.2rem
}

.no-info__meeting-management {
  width: 100%;
  height: 40rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;

}

.meeting-management__change-page {
  width: 100%;
  height: 6.5rem;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
  padding: 0 1.6rem;
}

.meeting-management__change-page > div:first-child {
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  color: #75758F
}

.meeting-management__change-page > div:last-child {
  color: #292933;
  font-weight: 400;
  font-size: 1.4rem;
  direction: rtl
}


.delete-meeting-modal-header {
  width: 40rem;
  height: 5rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.1rem solid #DCDADA;
}

.delete-meeting-modal-body {
  width: 40rem;
  height: 5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 0.1rem solid #DCDADA;
  font-size: 1.6rem;
  font-weight: 400;
  justify-content: flex-start;
  gap: 0.6rem;
}

.delete-meeting-modal-action {
  width: 40rem;
  height: 5rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
}

.meetings-choose-time-items {
  width: 30%;
  max-width: 55rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: flex-end;
}

#custom-input-start-meetings {
  width: 90%;

  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
}

#custom-input-start-meetings:focus {
  outline: none;
}

#custom-input-end-meetings {
  width: 90%;

  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
}

#custom-input-end-meetings:focus {
  outline: none;
}

.cancel-btn-date-picker:hover {
  background-color: transparent;
}
#start-time-input-vue-persian-date-picker{
  width:100%;
  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
  background-color: #F2F2F2;
}


#start-time-input-vue-persian-date-picker:focus {
  outline: none;
}
#end-time-input-vue-persian-date-picker{
  width:100%;
  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
  background-color: #F2F2F2;
}


#end-time-input-vue-persian-date-picker:focus {
  outline: none;
}
.meeting-management-length-info {
  display: flex;
  flex-direction: row-reverse;
  gap: 0.8rem;
  align-items: center;
  direction: rtl;
}
@media (max-width: 800px) {

  .meetings-choose-time-items {
    width: 45%;
    max-width: 55rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    align-items: flex-end;
  }

}
@media (max-width: 630px) {
  .meeting-management__header {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    width: 100%;
    padding: 1.6rem 1.6rem;
    border-bottom: 0.1rem solid #DCDADA;
  }

  .meeting-management__header > h1 {
    font-size: 2.5rem;
  }
  .meetings-choose-time__container {
    display: flex;
    flex-wrap: wrap;
    gap: 1.6rem;
    height: fit-content;
    width: 100%;
    padding: 1.6rem 1.6rem;
    border-bottom: 0.1rem solid #DCDADA;
  }
  .meetings-choose-time-items {
    width: 60%;
    min-width: 27rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    align-items: flex-end;
  }
  .meeting-management__change-page {
    width: 100%;
    height: 6.5rem;
    display: flex;
    justify-content: center;
    flex-direction: row-reverse;
    align-items: center;
    padding: 0 1.6rem;
  }

  .meeting-management__change-page > div:first-child {
    display: none;
  }
  .meeting-management-length-info {
    display: none;
  }
  .meeting-management-table__th > span:last-child {
    width: 10%;
    min-width: 6rem;
    font-size: 1.4rem;
    font-weight: 700;
    display: flex;
    justify-content: left;
  }
  .meeting-management-table__th__ltr > span:last-child {
    width: 10%;
    min-width: 6rem;
    font-size: 1.4rem;
    font-weight: 700;
    display: flex;
    justify-content: right;
  }
}
</style>

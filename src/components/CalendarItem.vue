<template>
  <!--      <div-->
  <!--          v-if="-->
  <!--        ((this.userRole.length > 1 &&-->
  <!--          (this.userRole[0] === 'ROLE_ADMIN' ||-->
  <!--            this.userRole[0] === 'ROLE_SECRETARY' ||-->
  <!--            this.userRole[1] === 'ROLE_ADMIN' ||-->
  <!--            this.userRole[1] === 'ROLE_SECRETARY')) ||-->
  <!--        hasPrivateRoomId ) && whichItem !== $store.getters.t('sessions')-->
  <!--      "-->
  <!--          :class="-->
  <!--        $i18n.locale === 'fa'-->
  <!--          ? 'create-session-fragment-rtl'-->
  <!--          : 'create-session-fragment-ltr'-->
  <!--      "-->
  <!--      >-->
  <!--        <button-->
  <!--            v-if="-->
  <!--          this.userRole.length > 1 &&-->
  <!--          (this.userRole[0] === 'ROLE_ADMIN' ||-->
  <!--            this.userRole[0] === 'ROLE_SECRETARY' ||-->
  <!--            this.userRole[1] === 'ROLE_ADMIN' ||-->
  <!--            this.userRole[1] === 'ROLE_SECRETARY')-->
  <!--        "-->
  <!--            :class="-->
  <!--          $i18n.locale === 'fa'-->
  <!--            ? 'crate-session-btn-rtl'-->
  <!--            : 'crate-session-btn-ltr'-->
  <!--        "-->
  <!--            @click="openCreateMeeting"-->
  <!--        >-->
  <!--        <span :style="{ 'font-size': isMobile ? '1rem' : 'inherit' }">{{-->
  <!--            $store.getters.t("session-creation")-->
  <!--          }}</span>-->
  <!--          <span-->
  <!--              :style="{-->
  <!--            'font-size': '3rem',-->
  <!--            position: 'relative',-->
  <!--            top: '0.3rem',-->
  <!--            'margin-left': $i18n.locale === 'fa' ? '1rem' : 0,-->
  <!--            'margin-right': $i18n.locale === 'fa' ? '0' : '1rem',-->
  <!--          }"-->
  <!--          >+</span-->
  <!--          >-->
  <!--        </button>-->
  <!--        <button-->
  <!--            v-if="true"-->
  <!--            @click="openPrivateRoom"-->
  <!--            :class="-->
  <!--          $i18n.locale === 'fa'-->
  <!--            ? 'crate-immediate-session-btn-rtl'-->
  <!--            : 'crate-immediate-session-btn-ltr'-->
  <!--        "-->
  <!--        >-->
  <!--        <span :style="{ 'font-size': isMobile ? '1rem' : 'inherit' }">{{-->
  <!--            $store.getters.t("immediate-meeting")-->
  <!--          }}</span>-->
  <!--          <span>-->
  <!--          <img draggable="false"-->
  <!--              style="position: relative; left: 0.2rem; top: 0.5rem; width: 60%"-->
  <!--              src="/img/conference-icon.png"-->
  <!--              alt="not loaded"-->
  <!--          />-->
  <!--        </span>-->
  <!--        </button>-->
  <!--      </div>-->
  <div :style="{'height': '100%','width':'100%'}">
    <the-calendar
        :which-item="whichItem"
        :user-role="userRole"
        :private-invitation-is-visible="privateInvitationIsVisible"
        v-if="isMeetingsLoaded"
        :events="meetings"
        :is-sidebar-open="isSidebarOpen"
        :is-user-leave-calendar-page="isUserLeaveCalendarPage"
        :private-room-name="privateRoomName"
        @join-to-conference="joinToConference"
    ></the-calendar>
  </div>



  <base-modal
      :open="!isMeetingsLoaded"
      :is-loading="'isLoading'"
      is-blur="true"
      modal-color="transparent"
  >
    <template #modal-body>
      <base-loading-spinner size-ratio="1.2" spinner-color="#409EFF">
        <template #loading-content>
          <div class="loading__extra-content--text" style = "color: #409EFF">
            {{ $store.getters.t("pleaseWait") }}
          </div>
        </template>
      </base-loading-spinner>
    </template>
  </base-modal>

</template>

<script>
import TheCalendar from "./TheCalendar";
// import auth from "../store/auth/index";
import DetectMobile from "../utils/detectMobile";
import BaseModal from "./UI/BaseModal";
import BaseLoadingSpinner from "./UI/BaseLoadingSpinner";
import DateHelper from "@/utils/dateHelper";
import DateAndTimeUtilities from "../utils/date.and.time.utils";
import RestClient from "@/api/restClient";
import entityTypes from "@/statics/entityTypes";
export default {
  name: "MeetingSchedules",
  components: {
    TheCalendar,
    BaseModal,
    BaseLoadingSpinner,
  },
  props:['whichItem','privateInvitationIsVisible','isSidebarOpen','isUserLeaveCalendarPage','privateRoomName'],
  data() {
    return {
      restClient: new RestClient(entityTypes.scheduledMeeting),
      hasWebinar: this.$store.getters.manageWebinar,
      manageWebinar: false,
      schedules: [],
      hasPrivateRoomId: false,
      isMeetingDataOpen: false,
      meetingData: {},
      hasMeetingPinCode: false,
      whichPrivateSliderIsActive: 0,
      whichSliderIsActive: 0,
      upcomingMeetingsSliderAction: null,
      privateMeetingsSliderAction: null,
      privateMeetingsSliderStartingIdx: 0,
      upcomingMeetingsSliderStartingIdx: 0,
      roomName: "",
      interval: null,
      inviteMembersIsVisible: false,
      isPrivateRoom: false,
      privateSchedule: [],
      privateRooms: [],
      privateRoomId: "",
      userRole:[],
      isMeetingsLoaded: false,
      meetings: {
        upcoming: {
          data: [],
          sliderAction: null,
        },
        private: {
          data: [],
          sliderAction: null,
        },
        future: {
          data: [],
          sliderAction: null,
        },
        past: {
          data: [],
          sliderAction: null,
        },
      },
      dateHelper: new DateHelper(),
      datesInfo: {
        range: {
          from: new DateAndTimeUtilities().getACustomDateFromOriginal(
              "week",
              2,
              "past"
          ),
          to: new DateAndTimeUtilities().getACustomDateFromOriginal(
              "week",
              2,
              "future"
          ),
        },
        currentDate: new DateAndTimeUtilities().formatDate(),
      },
      intervalId:false,

    };
  },
  watch:{
    isUserLeaveCalendarPage(val){
      if (val) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    },

  },
  methods: {
    changePageView(view){
      this.whichSideBarItem = view
    },


    // getPassword(meetingId) {
    //   this.restClientInvite.getPassword(meetingId).then((data) => {
    //     const serverPass = data.data
    //     if (!this.isEmpty(serverPass)) {
    //       this.passwordInput = data.data
    //       if (this.passwordInput.length > 4) { this.generatePassword(data.data, meetingId) }
    //     } else {
    //       // this.passwordInput = this.generate()
    //       if (this.passwordInput.length > 4) {
    //         this.generatePassword('123648', meetingId)
    //       }
    //     }
    //   })
    //       .catch((error) => {
    //         console.log(error)
    //       })
    // },

    // generatePassword(password,meetingId) {
    //   this.restClientInvite
    //       .generateNewPassword('985214', meetingId)
    //       .then( () => {
    //         // this.generateInviteLink()
    //       })
    // },



    // nextSlide(meeting) {
    //   meeting.sliderAction = "next";
    // },
    // previousSlide(meeting) {
    //   meeting.sliderAction = "back";
    // },
    getModifiedDate(date, type) {
      this.datesInfo.range[type] = date;
      this.getAllMeetings();
    },
    resetSliderAction(meeting) {
      meeting.sliderAction = null;
    },
    getAllMeetings() {
      this.resetMeetings();
      this.restClient
          .getMySchedule(this.datesInfo.range.from, this.datesInfo.range.to)
          .then((schedules) => {
            // this.getAllByPrivateRoomByUserId();
            for (let i = 0; i < schedules.length; i++) {
              if (
                  this.dateHelper.isGreaterEqual(
                      this.datesInfo.currentDate,
                      schedules[i].toSchd
                  )
              ) {
                this.meetings.past.data.push(schedules[i]);
              } else if (
                  this.dateHelper.isGreaterEqual(
                      this.datesInfo.currentDate,
                      schedules[i].fromSchd
                  ) &&
                  this.dateHelper.isGreaterEqual(
                      schedules[i].toSchd,
                      this.datesInfo.currentDate
                  )
              ) {
                this.meetings.upcoming.data.push(schedules[i]);
                // this.currentUpcomingSchd =
                //     this.meetings.upcoming[
                //         this.upcomingMeetingsSliderStartingIdx
                //         ];
              } else if (
                  this.dateHelper.isGreaterEqual(
                      schedules[i].fromSchd,
                      this.datesInfo.currentDate
                  ) &&
                  this.dateHelper.isGreaterEqual(
                      schedules[i].toSchd,
                      this.datesInfo.currentDate
                  )
              ) {
                this.meetings.future.data.push(schedules[i]);
              }
            }
            this.eventBus.emit('all-meetings',this.meetings)
            this.isMeetingsLoaded = true;
          })
          .catch((err) => {
            console.log(err);
            this.eventBus.emit('all-meetings',[])
            this.isMeetingsLoaded = true;
          });
    },
    getAllMeetingsForModerator() {
      this.resetMeetings();
      this.restClient
          .getMySchedule(this.datesInfo.range.from, this.datesInfo.range.to)
          .then((schedules) => {
            // this.getAllByPrivateRoomByUserId();
            for (let i = 0; i < schedules.length; i++) {
              this.amIModerator =
                  parseInt(this.$store.getters.userId) ===
                  schedules[i].managerUserId;
              if (
                  this.dateHelper.isGreaterEqual(
                      this.datesInfo.currentDate,
                      schedules[i].toSchd
                  ) &&
                  this.amIModerator
              ) {
                // past
                this.meetings.past.data.push(schedules[i]);
              } else if (
                  this.dateHelper.isGreaterEqual(
                      this.datesInfo.currentDate,
                      schedules[i].fromSchd
                  ) &&
                  this.dateHelper.isGreaterEqual(
                      schedules[i].toSchd,
                      this.datesInfo.currentDate
                  ) &&
                  this.amIModerator
              ) {
                this.meetings.upcoming.data.push(schedules[i]);
              } else if (
                  this.dateHelper.isGreaterEqual(
                      schedules[i].fromSchd,
                      this.datesInfo.currentDate
                  ) &&
                  this.dateHelper.isGreaterEqual(
                      schedules[i].toSchd,
                      this.datesInfo.currentDate
                  ) &&
                  this.amIModerator
              ) {
                this.meetings.future.data.push(this.schedules[i]);
              }
            }
          })
          .catch((error) => {
            console.error(error);
          });
    },
    // getAllByOwnerUserId() {
    //   this.restClientPrivateRoom.getAllByOwnerUserId().then((privateRooms) => {
    //     if (privateRooms != null) {
    //       this.eventBus.emit("room-name", privateRooms.name);
    //       this.privateRoomName = privateRooms.name
    //       // document.getElementById('online-room-btn').style.display = 'block'
    //       // this.allMeetings.privateMeetings = privateRooms
    //       this.PrivateOwnerUserId = privateRooms.roomOwnerUserId;
    //       this.hasPrivateRoomId = (+this.PrivateOwnerUserId === +this.$store.getters.userId)
    //       this.$store.dispatch("setPrivateRoomId", privateRooms.id);
    //       this.$store.dispatch(
    //           "setPrivateRoomOwnerUserId",
    //           this.PrivateOwnerUserId
    //       );
    //       // EventBus.$emit('getPrivateRoomId', this.privateRoomId)
    //     } else {
    //       // document.getElementById('online-room-btn').style.display = 'none'
    //     }
    //   });
    // },
    getAllByPrivateRoomByUserId() {
      this.restClient
          .getPrivateMeetingByUserId()
          .then((privateSchedule) => {
            for (let i = 0; i < privateSchedule.length; i++) {
              this.meetings.private.data.push(privateSchedule[i]);
            }
            // this.currentPrivateSchd =
            //     this.allMeetings.privateMeetings[
            //         this.privateMeetingsSliderStartingIdx
            //         ];
          })
          .catch((error) => {
            console.error(error);
          });
    },
    resetMeetings() {
      this.meetings = {
        upcoming: {
          data: [],
              sliderAction: null,
        },
        private: {
          data: [],
              sliderAction: null,
        },
        future: {
          data: [],
              sliderAction: null,
        },
        past: {
          data: [],
              sliderAction: null,
        },
      }
    },
    joinToConference(){
      clearInterval(this.intervalId)
      this.intervalId = null
    },
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
    this.getAllMeetings();
    this.intervalId = setInterval(()=>{
      this.getAllMeetings();
    },30000)
    // this.getAllByOwnerUserId();
    this.eventBus.on("i-am-moderator", (flag) => {
      if (flag) this.getAllMeetingsForModerator();
      else this.getAllMeetings();
    });
    this.eventBus.on("normal-user", (flag) => {
      if (flag) this.getAllMeetingsForModerator();
      else this.getAllMeetings();
    });
  },
  mounted() {
    this.eventBus.on('all-meetings', (data) => {
      this.meetings = data
    })
    this.userRole =JSON.parse(localStorage.getItem("user-role")) ;
  },
  beforeUnmount() {
    // Stop the interval when the component is destroyed
    clearInterval(this.intervalId)
    this.intervalId = null
  }
};
</script>

<style scoped>
section:first-child {
  width: 80rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
section:last-child {
  width: calc(100% - 83.4rem);
  height: 100%;
}
section:first-child > div:first-child {
  width: 100%;
  height: 25.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.found-users-container > ul {
  max-height: 10rem;
  overflow-y: auto;
  width: 100%;
}
.moderator-chosen > div {
  width: auto;
  height: 80%;
  border: solid 1px blue;
  position: absolute;
  top: 0.4rem;
  display: flex;
  flex-direction: row;
  padding: 0.2rem 0.2rem 0 0.02rem;
  border-radius: 0.5rem;
  box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.4);
}

.invited-user-meeting-container > ul {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  max-height: 16rem;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}
.invited-user-meeting-list-element > span {
  width: 25%;
  text-align: center;
  height: 3.5rem;
}
.invited-user-meeting-list-element > div {
  width: 25%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.invite-meeting-link-container > div {
  width: 100%;
  height: 4rem;
  border: 1px solid gray;
  border-radius: 0.5rem;
  direction: ltr;
  display: flex;
  align-items: center;
  padding-left: 1rem;
}
.create-meeting-fields > span {
  color: #7b7b7b;
  font-size: 1.3rem;
}
.create-meeting-fields > input {
  width: 30rem;
  height: 4rem;
  border: 1px solid gray;
  border-radius: 0.5rem;
  direction: rtl;
  padding-right: 0.5rem;
}
.create-meeting-fields > input:focus {
  outline: none;
  border: solid 0.1rem #1a73e8;
}
.step__container > div {
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.step-text :first-child {
  width: 50%;
  display: flex;
  flex-direction: row;
  cursor: pointer;
}
.step-text :last-child {
  width: 50%;
  display: flex;
  flex-direction: row-reverse;
  position: relative;
  left: -1.5rem;
}
.without-moderator-input + label {
  cursor: pointer;
}
.create-meeting__invited-users-table > span {
  text-align: center;
  width: 25%;
}
@media (max-width: 760px) {
  .create-meeting-invitation--container > div {
    position: relative;
    right: 1rem;
  }
  .create-meeting__invited-users-table > span {
    font-size: 1.2rem;
  }
}
@media (max-width: 480px) {
  .create-meeting-invitation--container > div {
    position: relative;
    right: 1rem;
  }
  .create-meeting__invited-users-table > span {
    font-size: 1.1rem;
  }
}
</style>

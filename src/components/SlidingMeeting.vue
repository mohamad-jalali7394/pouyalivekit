<template>
  <div v-if="type === 'private'" @click.prevent="joinToRoom" class="sliding-meeting-schedule">
    <section class="sliding-meeting-schedule__header">
      <header>
        <h2>
          {{roomName}}
        </h2>
      </header>
    </section>
    <section class="sliding-meeting-schedule__body">
      <article class="meeting">
        <div class="meeting__room-name">  {{ "نام اتاق" }} : {{ roomName }}</div>
        <div class="meeting__room-capacity">ظرفیت: {{roomCapacity}} نفر</div>
      </article>
    </section>
  </div>
  <div
      v-else
      @click.prevent="joinToRoom"
      class="sliding-meeting-schedule"
  >
    <section class="sliding-meeting-schedule__header">
      <header>
        <h2>{{title}}</h2>
      </header>
    </section>
    <section class="sliding-meeting-schedule__body">
      <article class="meeting">
        <div
            class="meeting__moderator-name"
        >{{managerFirstName}} {{managerLastName}}</div>
        <div class="meeting__room-name">{{roomName}}</div>
        <div
            class="meeting__room-capacity"
        >ظرفیت {{roomCapacity}} نفر</div>
        <invited-members :is-table="false" :meeting-id="id"></invited-members>
      </article>
    </section>
    <section class="meeting__time-and-date">
      <div class="meeting__time-and-date--time">
<!--        <the-time :from-time="fromDate" :to-time="toDate"></the-time>-->
      </div>
      <div class="meeting__time-and-date--date">
        <the-date :date="fromDate"></the-date>
      </div>
    </section>
  </div>
  <base-modal :open="loadingModalIsVisible" is-blur="true" modal-color="transparent">
    <template #modal-body>
      <base-loading-spinner size-ratio="1.2" spinner-color="#f6f6f6">
        <template #loading-content>
          <loading-text></loading-text>
        </template>
      </base-loading-spinner>
    </template>
  </base-modal>

<!--  <base-modal :open="pinModalIsVisible">-->
<!--    <template #modal-header>-->
<!--      <h2>کد ورود به جلسه را وارد کنید</h2>-->
<!--    </template>-->
<!--    <template #modal-body>-->
<!--      <input-->
<!--          type="password"-->
<!--          class="input__field"-->
<!--          :id="id"-->
<!--          @input="meetingPinCode"-->
<!--      />-->
<!--    </template>-->
<!--    <template #modal-buttons>-->
<!--      <base-button-->
<!--          :button-type="['background-color=green', 'color=white']"-->
<!--          button-content="ورود به جلسه"-->
<!--          @click="closeinModal"-->
<!--      ></base-button>-->
<!--    </template>-->
<!--  </base-modal>-->
<!--  <base-modal :open="loginIsTriggered" is-blur="true" modal-color="transparent">-->
<!--    <template #modal-body>-->
<!--      <base-loading-spinner size-ratio="1.2" spinner-color="#f6f6f6">-->
<!--        <template #loading-content>-->
<!--          <div class="loading__extra-content&#45;&#45;text">لطفا منتظر بمانید...</div>-->
<!--        </template>-->
<!--      </base-loading-spinner>-->
<!--    </template>-->
<!--  </base-modal>-->
</template>

<script>
import InvitedMembers from "./InvitedMembers";
import TheDate from "./TheDate";
import BaseModal from "./UI/BaseModal";
import BaseLoadingSpinner from "./UI/BaseLoadingSpinner";
// import BaseButton from "./BaseButton";
import userStatus from "../statics/types/userStatus";
import RestClient from "../api/restClient";
import LoadingText from "./UI/LoadingText";
// import emitter from "../utils/emitter";
export default {
  name: "SlidingMeeting",
  components: {
    LoadingText,
    BaseLoadingSpinner,
    BaseModal,
    // BaseButton,
    TheDate,
    InvitedMembers,
  },
  props: [
    'type',
    'id',
    'title',
    'roomName',
    'roomCapacity',
    'managerFirstName',
    'managerLastName',
    'managerUserId',
    'moderatorSubstituteUserId',
    'fromDate',
    'toDate'
  ],
  data() {
    return {
      restClient : new RestClient("controlMeeting"),
      loginIsTriggered: false,
      meetingPinCode: "",
      amIModeratorPrivate: false,
      amIModerator: false,
      amIModeratorSubstitute: false,
      loadingModalIsVisible: false,
      pinModalIsVisible: false,
    };
  },
  methods : {
    joinToRoom(){
      this.loadingModalIsVisible = true
      this.restClient.iWantToJoin(this.id, this.meetingPinCode.toString())
          .then(async response => {
            if (!response.token) {
              // this.eventBus.emit("notification", {
              //   title: "پیام",
              //   type: "error",
              //   bodyText:
              //       "خطایی رخ داده است.لطفا دوباره تلاش کنید و در صورت برطرف نشدن مشکل با پشتیبانی تماس بگیرید.",
              //   time: 10000,
              // });
              this.loginIsTriggered = false;
              return;
            }
            this.$store.dispatch(
                "setRoomIdPublicRoom",
                this.id.toString()
            );
            this.$store.dispatch("setSessionToken", response.token);
            this.amIModerator = +this.$store.getters.userId === +this.managerUserId;
            this.amIModeratorSubstitute = +this.$store.getters.userId === +this.moderatorSubstituteUserId;
            this.$store.dispatch('setModeratorId', +this.managerUserId);
            this.$store.dispatch('setModeratorSubstituteId', +this.moderatorSubstituteUserId);
            this.$store.dispatch("setAmIModerator", this.amIModerator);
            this.$store.dispatch('setAmIModeratorSubstitute', this.amIModeratorSubstitute);
            // this.$store.dispatch(
            //     "setSubstitutionId",
            //     this.meetingDataObject.substitutionUserId
            // );
            this.$store.dispatch("setSessionName", this.title);
            this.$store.dispatch("setRoomId", this.id);
            localStorage.setItem('roomId', this.id);
            this.$store.dispatch("setIsPublicUser", userStatus.isPublicUser);
            // this.$store.dispatch("setScheduleId", this.id);
            this.loadingModalIsVisible = false
            this.$router.push('/conference');
          })
          .catch((error) => {
            this.loadingModalIsVisible = false
            throw error;
          });
    }
  }
  // methods: {
  //   joinToSession() {
  //     this.loginIsTriggered = true;
  //     restClient
  //         .iWantToJoin(this.meetingDataObject.id, this.meetingPinCode.toString())
  //         .then((response) => {
  //           if (!response.token) {
  //             eventBus.emit("notification", {
  //               title: "پیام",
  //               type: "error",
  //               bodyText:
  //                   "خطایی رخ داده است.لطفا دوباره تلاش کنید و در صورت برطرف نشدن مشکل با پشتیبانی تماس بگیرید.",
  //               time: 10000,
  //             });
  //             this.loginIsTriggered = false;
  //             return;
  //           }
  //           this.$store.dispatch(
  //               "setRoomIdPublicRoom",
  //               this.meetingDataObject.toString()
  //           );
  //           this.$store.dispatch("setSessionToken", response.token);
  //           this.amIModerator =
  //               +this.$store.getters.userId === +this.meetingDataObject.managerUserId;
  //           this.$store.dispatch("setAmIModerator", this.amIModerator);
  //           this.$store.dispatch(
  //               "setSubstitutionId",
  //               this.meetingDataObject.substitutionUserId
  //           );
  //           this.$store.dispatch("setSessionName", this.meetingDataObject.title);
  //           this.$store.dispatch("setSessionId", this.meetingDataObject.id);
  //           this.$store.dispatch("setIsPublicUser", userStatus.isPublicUser);
  //           this.$store.dispatch("setScheduleId", this.meetingDataObject.id);
  //           this.$router.push({
  //             name: "Conference",
  //             path: "/conference",
  //             params: {
  //               isPublicUser: true,
  //               myUserName: this.$store.getters.displayName,
  //             },
  //           });
  //         })
  //         .catch((error) => {
  //           throw error;
  //         });
  //     return;
  //   },
  // },
};
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.8);
  width: 24.3rem;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
}
.sliding-meeting-schedule {
  transition-duration: 0.2s;
  transition-timing-function: ease;
  transition-delay: 0s;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  /*padding: 1.1rem 1.6rem;*/

  padding: 2.1rem 5.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  cursor: pointer;
  font-size: 1.2rem;
}
.sliding-meeting-schedule:hover {
  transform: scale(0.97);
  transition: all 100ms;
}

.sliding-meeting-schedule__header header {
  display: flex;
  justify-content: right;
}
.sliding-meeting-schedule__body {
  width: 100%;
  height: calc(100% - 4.1rem);
}
.meeting {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}
.meeting > div {
  margin-top: 0.6rem;
  color: #6e6e6e;
}
.meeting__moderator-name {
  margin-top: 0.8rem;

  font-size: 1.2rem;
  font-weight: bold;
  color: rgba(74, 74, 74, 0.8);
}
.meeting__room-name {
  width: 100%;
  direction: rtl;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.meeting__time-and-date {
  height: 2rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.meeting__time-and-date--date {
  display: flex;
}
.meeting__time-and-date--time {
  display: flex;
}
</style>

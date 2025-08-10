<template>
  <div style="overflow-y: auto">
    <div>
      <the-nav-bar
          :all-meetings="meetings"
          :user-role="userRole"
          :date-range="datesInfo.range"
          :which-side-bar-item="whichSideBarItem"
          :has-private-room-id="hasPrivateRoomId"
          @change-page-view="changeMobilePageView"
          @open-private-room="openPrivateRoom"
          @create-meeting="openCreateMeeting"
          @date-modified="getModifiedDate"
          @toggle-sidebar="toggleSidebar"
          @toggle-mobile-sidebar="toggleMobileSidebar"
          @log-out="logOutDesktop"
          @create-webinar="openCreateWebinar"
      >
      </the-nav-bar>
    </div>
    <div v-if="isAgendaModalOpen">
      <the-agenda :is-meeting-created="isMeetingCreated" :create-or-edit-agenda="createOrEditAgenda" :meeting-id="meetingId" :is-open="isAgendaModalOpen" @close-agenda-modal="closeAgendaModal"></the-agenda>
    </div>

    <div v-if="createMeetingIsOpen" style=" width: 100vw; height: calc(100vh - 8rem);direction: rtl;display: flex;justify-content: center">
        <create-meeting :is-mobile="isMobile" :create-or-edit-meeting="createOrEditMeeting" :editable-meeting-id = "meetingId" :chosen-moderator="chosenModerator" :chosen-sub-moderator="chosenSubModerator" @close-create-meeting="closeCreateMeeting" @open-agenda-modal="openAgendaModal" @open-agenda-modal-before-create-meeting="openAgendaModalBeforeCreateMeeting"></create-meeting>
    </div>
    <div v-if="createWebinarIsOpen" style=" width: 100vw; height: calc(100vh - 8rem);direction: rtl;display: flex;justify-content: center">
      <create-webinar :create-or-edit-meeting="createOrEditMeeting" :editable-meeting-id = "meetingId" :chosen-moderator="chosenModerator" :chosen-second-presenter="chosenSecondPresenter" :chosen-first-presenter="chosenFirstPresenter" @close-create-meeting="closeCreateMeeting" @open-agenda-modal="openAgendaModal" @open-agenda-modal-before-create-meeting="openAgendaModalBeforeCreateMeeting"></create-webinar>
    </div>

    <div v-show="!createMeetingIsOpen" :class=" $i18n.locale !== 'en' ? 'calendar-page-fragment': 'calendar-page-fragment-ltr' " :style="{'overflow-y' : whichSideBarItem === $store.getters.t('calendar')? 'auto': 'hidden'}">
      <div v-if="
        (this.userRole.length > 1 &&
        (this.userRole[0] === 'ROLE_ADMIN' ||
        this.userRole[1] === 'ROLE_ADMIN' || this.userRole[0] === 'ROLE_SECRETARY' || this.userRole[1] === 'ROLE_SECRETARY'
        )) && !isMobile && isSidebarOpen"  class="side-bar" :style="{ borderLeft: $i18n.locale !== 'en' ? 'solid 0.2rem #d9d6d6' : 'none' , borderRight: $i18n.locale !== 'en' ? 'none' : 'solid 0.2rem #d9d6d6' }">
        <ul class="side-bar-item-ul">
          <side-bar-item v-for="item in sidebarItems" :which-side-bar-item="whichSideBarItem" :key="item.label" :is-mobile="isMobile" :side-bar-sub-item="sideBarSubItem" :color="whichSideBarItem === item.label ? '#1B76FF' : '#75758F'" :sidebar-item="item" :is-focused="whichSideBarItem === item.label" @choose-Item="changePageView" @choose-sub-item="chooseSubItem"></side-bar-item>
        </ul>
      </div>
      <transition  name="mobile-side-bar">
        <div v-if="isMobileSidebarOpen"  class="side-bar__mobile">
          <div style="width: 100%;direction: rtl;padding: 0 0 1.6rem 0">
            <img draggable="false"
                src="/img/close.svg"
                alt="not loaded"
                @click="closeMobileSideBar"
                style="cursor: pointer;width: 3rem"
            />
            <div v-if="( this.userRole[0] === 'ROLE_SECRETARY' ||this.userRole[1] === 'ROLE_SECRETARY') || (this.userRole[0] === 'ROLE_ADMIN' ||this.userRole[1] === 'ROLE_ADMIN')" :class=" $i18n.locale !== 'en' ? 'mobile-side-bar-header-tabs-container':'mobile-side-bar-header-tabs-container__ltr'">
              <div :class=" $i18n.locale !== 'en' ? 'tabs_underline__mobile-side-bar' : 'tabs_underline__mobile-side-bar__ltr'"
                   :style="{'translate': $i18n.locale !== 'en' ? '-' + clickedIndex * tabContainerWidth+ 'px' + ' ' + '0' : clickedIndex * tabContainerWidth + 'px' + ' ' + '0','width':tabContainerWidth + 'px' }"></div>
              <tab-item v-for="(tab, index) in tabItemsForMobile" :tab-items="tabItemsForMobile.length" :tab="tab" :key="tab.label"
                        :index="index" :is-active="tab.label === whichTab"
                        @choose-tab="chooseTab"></tab-item>
            </div>
          </div>
          <div v-if='whichTab === $store.getters.t("user-info")' class="profile-container__mobile">
<!--            <div v-if="(this.userRole[0] === 'ROLE_SECRETARY' ||this.userRole[1] === 'ROLE_SECRETARY') || (this.userRole[0] === 'ROLE_ADMIN' ||this.userRole[1] === 'ROLE_ADMIN') || hasPrivateRoomId" style="display: flex;gap: 2rem;flex-direction: row-reverse">-->
<!--              <div style="color: #1B76FF;font-size: 1.3rem;font-weight: 700;display: flex;gap: 0.4rem;direction: rtl"  @click="openCreateMeeting" v-if="(this.userRole[0] === 'ROLE_SECRETARY' ||this.userRole[1] === 'ROLE_SECRETARY') || (this.userRole[0] === 'ROLE_ADMIN' ||this.userRole[1] === 'ROLE_ADMIN') "-->
<!--              >-->
<!--                <add-plus color="#1B76FF" width="16" height="16"></add-plus>-->
<!--                <span>{{$store.getters.t('create-session-in-calendar')}}</span>-->

<!--              </div>-->
<!--              <div style="color: #1B76FF;font-size: 1.3rem;font-weight: 700;display: flex;gap: 0.4rem;direction: rtl"  >-->
<!--                <add-plus color="#1B76FF" width="16" height="16"></add-plus>-->
<!--                <span>-->
<!--                {{$store.getters.t('immediate-meeting')}}-->
<!--              </span>-->

<!--              </div>-->
<!--            </div>-->
            <div style="display: flex;flex-direction: row-reverse;gap: 0.8rem;align-items: center;position: relative;left: 0.5rem">
              <img draggable="false" v-if="!imgUrlForMobile" src="/img/profile.svg" alt="not loaded" style="width: 42px; height: 42px">
              <img draggable="false" v-else :src="imgUrlForMobile" alt="not loaded" style="width: 42px; height: 42px;border-radius: 50%">
              <span style="font-size: 1.4rem; font-weight: 700">
                {{$store.getters.displayName}}
              </span>
            </div>
<!--            <div @click="openProfile" style="font-size: 1.4rem; font-weight: 700;width: 100%;direction: rtl">-->
<!--              {{$store.getters.t('profile')}}-->
<!--            </div>-->
            <div @click="openSetting" style="font-size: 1.4rem; font-weight: 700;width: 100%;direction: rtl">
              {{$store.getters.t('device-setting')}}
            </div>
            <div @click="logOut" style="font-size: 1.4rem; font-weight: 700;width: 100%;direction: rtl">
              {{$store.getters.t('log-out')}}
            </div>

          </div>
          <ul v-else class="side-bar-item-ul">
            <side-bar-item v-for="item in sidebarItems" :key="item.label" :which-side-bar-item="whichSideBarItem" :is-mobile="isMobile" :side-bar-sub-item="sideBarSubItem" :color="whichSideBarItem === item.label ? '#1B76FF' : '#75758F'" :sidebar-item="item" :is-focused="whichSideBarItem === item.label" @choose-Item="changePageView" @choose-sub-item="chooseSubItem"></side-bar-item>
          </ul>
        </div>
      </transition>

      <div
          :style="{width:isSidebarOpen ?  'calc(100vw - 22.5rem)' : '100vw' }">
<!--        <user-management v-if="sideBarSubItem === $store.getters.t('users-management')"></user-management>-->
<!--        <group-management v-else-if="sideBarSubItem === $store.getters.t('groups-management')"></group-management>-->
        <router-view :room-list="roomList" :webinar-list="webinarList" :private-room-list="privateRoomList" :line-room-list="lineRooms" :side-bar-sub-item="sideBarSubItem" :user-role="userRole" :is-webinar = "sideBarSubItem === $store.getters.t('webinar-management') ? true : false" @open-create-meeting="this.createMeetingIsOpen = true"  :private-room-name="privateRoomName" @open-create-webinar="this.createWebinarIsOpen = true"></router-view>
      </div>
<!--      <div-->
<!--           v-else-if="(whichSideBarItem === $store.getters.t('meetings-and-rooms-management') || whichSideBarItem === $store.getters.t('meetings-management')) && !isMobileSidebarOpen" :style="{width: isSidebarOpen ?  'calc(100vw - 22.5rem)' : '100vw'}">-->
<!--        <meetings-management :side-bar-sub-item="sideBarSubItem"  v-if="sideBarSubItem === $store.getters.t('meetings-management') || sideBarSubItem === $store.getters.t('webinar-management')" :is-webinar="(sideBarSubItem ===$store.getters.t('webinar-management'))" :user-role="userRole" @open-create-meeting="this.createMeetingIsOpen = true" @open-create-webinar="this.createWebinarIsOpen = true"></meetings-management>-->
<!--        <room-management v-else-if="sideBarSubItem === $store.getters.t('rooms-management')" :room-list="roomList" :webinar-list="webinarList" :private-room-list="privateRoomList" :line-room-list="lineRooms"></room-management>-->
<!--        <meeting-settings v-else></meeting-settings>-->

<!--      </div>-->
<!--      <div-->
<!--          v-else-if="!isMobileSidebarOpen" :style="{width: isSidebarOpen ?  'calc(100vw - 22.5rem)' : '100vw'}">-->
<!--        <report-management  v-if="sideBarSubItem === $store.getters.t('meeting-report')"></report-management>-->
<!--        <system-incident v-else></system-incident>-->
<!--      </div>-->

    </div>
  </div>
  <div v-if="privateInvitationIsVisible">
    <private-invitation
        :is-open="privateInvitationIsVisible"
        :private-meeting-name="privateRoomName"
        :private-invitation-is-open="privateInvitationIsVisible"
        @close-invitation-modal="closePrivateComponent"
        @close-invitation-component="closePrivateComponent"
        @join-to-conference="isUserLeaveCalendarPage = true"
    ></private-invitation>
  </div>


</template>

<script>
// import CalendarItem from "../components/CalendarItem";
import DetectMobile from "../utils/detectMobile";
import entityTypes from "@/statics/entityTypes";
import RestClient from "@/api/restClient";
import TheNavBar from "../components/TheNavBar";
// import CreateRoom from "../components/CreateRoom";
import PrivateInvitation from "../components/PrivateInvitation";
// import PersianDatePicker from "vue3-persian-datetime-picker";
// import BaseSelect from "../components/UI/BaseSelect";
import momentJalali from "moment-jalaali";
import GenericClient from "@/api/restClient/genericClient";
import DateAndTimeUtilities from "../utils/date.and.time.utils";
// import BaseModal from "../components/UI/BaseModal";
import eventBus from "../utils/event.bus";
import SideBarItem from "../components/SideBarItem";
import CreateMeeting from "../components/CreateMeeting";
// import UserManagement from "../components/UserManagement";
// import GroupManagement from "../components/GroupManagement";
// import ActiveDirectory from "../components/ActiveDirectory";
// import MeetingsManagement from "../components/MeetingsManagement";
// import MeetingSettings from "../components/MeetingSettings";
// import RoomManagement from "../components/RoomManagement";
// import ReportManagement from "../components/ReportManagement";
// import SystemIncident from "../components/SystemIncident";
import TabItem from "@/components/TabItem.vue";
// import BaseButton from "@/components/UI/BaseButton.vue";
// import AddPlus from "@/components/UI/Icons/AddPlus.vue";
import TheAgenda from "@/components/TheAgenda.vue";
import CreateWebinar from "@/components/CreateWebinar.vue";
import auth from "@/store/auth";
export default {
  name: "MeetingSchedules",
  components: {
    CreateWebinar,
    TheAgenda,
    TabItem, TheNavBar, PrivateInvitation,SideBarItem,CreateMeeting
  },
  data() {
    return {
      inviteUserInputHeight: 0,
      chooseSubModeratorInputHeight: 0,
      chooseModeratorInputHeight: 0,
      group: {},
      maxHeight: '10rem',
      isReturnToUpdate: false,
      minTime: '',
      customerId: null,
      restClientBilling: new RestClient('billing'),
      restClientCustomer: new RestClient('customer'),
      roomId: "",
      currentPrivateSchd: null,
      currentUpcomingSchd: null,


      allMeetings: {
        upcomingMeetings: [],
        futureMeetings: [],
        privateMeetings: [],
        pastMeetings: [],
      },


      isMobile: false,
      datesInfo: {
        range: {
          from: new DateAndTimeUtilities().getACustomDateFromOriginal(
              "week",
              12,
              "past"
          ),
          to: new DateAndTimeUtilities().getACustomDateFromOriginal(
              "week",
              12,
              "future"
          ),
        },
        currentDate: new DateAndTimeUtilities().formatDate(),
      },
      userRole: [],
      isMeetingTypeOpen: false,
      meetingTypeList: [
        {
          label: this.$store.getters.t('with-moderator'),
        },
        {
          label: this.$store.getters.t('without-moderator'),
        },
      ],
      selectedMeetingType: {
        label: this.$store.getters.t('with-moderator'),
      },
      allUsers: [],
      listOfAllGroups: [],
      userInput: "",
      groupInput: "",
      moderatorMeetingValue: "",
      subModeratorMeetingValue: "",
      notificationType: "",
      isUserFound: false,
      addedUsers: [],
      addedGroups: [],
      addedUsersSub: [],
      userIds: [],
      invitedGroups: [],
      genericClient: new GenericClient(),
      restClientRoom: new RestClient(entityTypes.room),
      lineRooms:[],
      restClientUser: new RestClient("user"),
      restClientGroup: new RestClient("group"),
      restClientInvite: new RestClient("invite"),
      withoutModerator: false,
      isCreateOrEditMeeting: false,
      isLoadingCreateMeeting: false,
      listOfInvitedUsers: [],
      invitationLink: "",
      meetingId: "",
      editableMeetingId: "",
      moderatorId: "",
      subModeratorId: "",
      meetingTitle: "",
      isSubModeratorChosen: false,
      chosenSubModerator: {},
      chosenFirstPresenter: {},
      chosenSecondPresenter: {},
      createOrEditMeeting: "create",
      isSubModeratorFocused: false,
      isModeratorFocused: false,
      chosenModerator: {},
      isModeratorChosen: false,
      invitedUsers: [],
      isInvitePersonFocused: false,
      isInviteGroupFocused: false,
      startTime: "",
      meetingPinCode: "",
      description: "",
      endTime: "",
      roomList: [],
      privateRoomList:[],
      webinarList:[],
      selectedRoom: {label: ""},
      noticeList: [
        {
          label: this.$store.getters.t('SMS'),
        },
        {
          label: this.$store.getters.t('Email'),
        },
        {
          label: this.$store.getters.t('both'),
        },
      ],
      selectedNotice: {label: this.$store.getters.t('Email')},
      isDropDownOpen: false,
      isRoomDropDownOpen: false,
      stepOfCreateMeeting: "stepOne",
      now: momentJalali().format("jYYYY/jM/jD HH:mm"),
      createMeetingIsOpen: false,
      createWebinarIsOpen:false,
      privateInvitationIsVisible: false,
      privateRoomName: null,
      hasPrivateRoomId: false,
      restClient: new RestClient(entityTypes.scheduledMeeting),
      restClientPrivateRoom: new RestClient(entityTypes.privateRoom),
      whichSideBarItem: this.$store.getters.t('calendar'),
      sideBarSubItem:this.$store.getters.t('user-management'),
      meetingType:this.$store.getters.t('meetings-management'),
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
      // sidebarItems:[{label:this.$store.getters.t('calendar'), subItems:[]},{label:this.$store.getters.t('user-management') ,subItems:[{label:this.$store.getters.t('users-management')},{label:this.$store.getters.t('groups-management')},{label:this.$store.getters.t('active-directory-management')}] },{label:this.$store.getters.t('meetings-and-rooms-management'),subItems:[{label:this.$store.getters.t('meetings-management')},{label:this.$store.getters.t('webinar-management')},{label:this.$store.getters.t('rooms-management')},{label:this.$store.getters.t('meeting-settings')}]},{label:this.$store.getters.t('reports-management'),subItems:[{label:this.$store.getters.t('meeting-report')},{label:this.$store.getters.t('system-events')}]}],
      sidebarItems:[{label:this.$store.getters.t('calendar'), subItems:[]},{label:this.$store.getters.t('user-management') ,subItems:[{label:this.$store.getters.t('users-management')},{label:this.$store.getters.t('groups-management')}] },{label:this.$store.getters.t('meetings-and-rooms-management'),subItems:[{label:this.$store.getters.t('meetings-management')},{label:this.$store.getters.t('webinar-management')},{label:this.$store.getters.t('rooms-management')},{label:this.$store.getters.t('meeting-settings')}]},{label:this.$store.getters.t('reports-management'),subItems:[{label:this.$store.getters.t('meeting-report')},{label:this.$store.getters.t('system-events')}]}],

      isSidebarOpen: false,
      isMobileSidebarOpen:false,
      tabItems:[{label: this.$store.getters.t("user-info"), isActive:true}, {label: this.$store.getters.t("admin-panel"), isActive:true}],
      whichTab: this.$store.getters.t("user-info"),
      clickedIndex:0,
      isUserLeaveCalendarPage:false,
      isAgendaModalOpen:false,
      createOrEditAgenda:'create',
      isMeetingCreated:false,
      isProfileModalOpen:false,
      imgURL:'',
      imgUrlForMobile:'',
      iswebinar:false
    };
  },

  computed: {
    tabContainerWidth() {
      if ((this.userRole.length > 1 &&
          (this.userRole[0] === 'ROLE_ADMIN' ||
              this.userRole[1] === 'ROLE_ADMIN'
          ))){
        return parseFloat(window.innerWidth) / 2.1
      }else {
        return parseFloat(window.innerWidth)
      }


    },
    tabItemsForMobile() {
      if ((this.userRole.length > 1 &&
          (this.userRole[0] === 'ROLE_ADMIN' ||
              this.userRole[1] === 'ROLE_ADMIN'
          ))){
        return [{label: this.$store.getters.t("user-info"), isActive:true}, {label: this.$store.getters.t("admin-panel"), isActive:true}]
      }else {
        return [{label: this.$store.getters.t("user-info"), isActive:true}]
      }
    },
    calendarwidth() {
      return (this.userRole.length > 1 &&
          (this.userRole[0] === 'ROLE_ADMIN' ||
              this.userRole[1] === 'ROLE_ADMIN')) ? !this.isMobile ? this.isSidebarOpen?  '80%': '100%' : '100%' : '100%'
    },
    foundGroups() {
      return this.addedGroups;
    },
    foundUsers() {
      return this.addedUsers;
    },
    foundUsersSub() {
      return this.addedUsersSub;
    },
    hasPrivateRoom() {
      return this.hasPrivateRoomId;
    },
    imgSRC(){
      return this.$store.getters.imgSrc
    },
  },
  watch: {
    isModeratorFocused(val) {
      if (val) {
        this.chooseModeratorInputHeight = window.innerHeight - this.$refs.chooseModeratorInput.getBoundingClientRect().bottom - 20 + 'px'
      }
    },
    isSubModeratorFocused(val) {
      if (val) {
        this.chooseSubModeratorInputHeight = window.innerHeight - this.$refs.chooseSubModeratorInput.getBoundingClientRect().bottom - 20 + 'px'
      }
    },
    isInvitePersonFocused(val) {
      if (val) {
        this.inviteUserInputHeight = window.innerHeight - this.$refs.inviteUserInput.getBoundingClientRect().bottom - 20 + 'px'
      }
    },


  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
    // this.getAllMeetings()
    this.getAllByOwnerUserId();
  },

  methods: {
    returnToEditMeeting() {
      this.stepOfCreateMeeting = 'stepOne'
      this.createOrEditMeeting = 'edit'
      this.isReturnToUpdate = true
    },
    getById(id) {
      this.editableMeetingId = "";
      this.createOrEditMeeting = "create";
      this.restClient
          .getById(id)
          .then((data) => {
            this.createOrEditMeeting = "edit";
            this.createMeetingIsOpen = true;
            if (data.data.meetingType == 1) {
              this.selectedMeetingType.label = this.$store.getters.t('without-moderator');
              this.isModeratorChosen = false;
              this.isSubModeratorChosen = false;
              this.chosenModeratorn.id = null
              this.chosenSubModerator.id = null
            } else {
              this.selectedMeetingType.label = this.$store.getters.t('with-moderator');
              this.isModeratorChosen = true;
              this.isSubModeratorChosen = true;
            }
            // this.withoutModerator = data.withoutModerator
            this.editableMeetingId = data.data.id;
            this.meetingId = data.data.id;
            this.meetingTitle = data.data.title;
            this.startTime = data.data.fromSchd
            this.endTime = data.data.toSchd

            this.selectedNotice.label = this.getNotificationTypeByValue(data.data.notificationType);
            const foundRoomIndex = this.roomList.findIndex((el) => {
              return el.label === data.data.roomName;
            });
            if (foundRoomIndex === -1) {
              this.roomList.push({label: data.data.roomName});
            }
            this.selectedRoom = {
              label: data.data.roomName,
              id: data.data.roomId,
            };
          })
          .catch((err) => {
            console.log(err);
          });
    },
    cancelMeeting(id) {
      this.restClient.cancelMeeting(id, true).then(() => {
        eventBus.emit('notification', {
          type: 'success',
          bodyText: this.$store.getters.t("meeting-canceled"),
          time: 5000
        })
        setTimeout(() => {
          window.location.reload();
        }, 1000)

      }).catch(() => {
        eventBus.emit('notification', {
          type: 'error',
          bodyText: this.$store.getters.t("meeting-not-canceled"),
          time: 5000
        })
      })
    },
    inviteUsers() {
      this.userIds = this.invitedUsers.map((el) => {
        return el.id;
      });
      this.restClientInvite
          .modifyUserOfPublicRoom(this.meetingId, [], this.userIds)
          .then(() => {
            this.closeCreateMeeting();
            this.stepOfCreateMeeting = "stepOne";
            this.startTime = "";
            this.endTime = "";
            this.meetingTitle = "";
            this.meetingPinCode = "";
            this.description = "";
            this.selectedNotice.label = this.$store.getters.t('Email');
            this.chosenModeratorn = {};
            this.chosenSubModerator = {};
            this.selectedRoom = {};
            this.meetingId = "";
            this.createMeetingIsOpen = false;
            this.editableMeetingId = "";
            this.meetingData = "";
            this.isModeratorChosen = false;
            this.isSubModeratorChosen = false;
            this.invitedUsers = [];
            this.userIds = [];
          })
          .catch((err) => {
            console.log(err);
          });
    },
    openCreateMeeting() {
      // this.closeMobileSideBar()
      this.createOrEditMeeting = "create";
      this.createMeetingIsOpen = true;
      // this.getAllUsers();
      // this.getAllGroups();
    },
    openCreateWebinar() {
      // this.closeMobileSideBar()
      this.createOrEditMeeting = "create";
      this.createWebinarIsOpen = true;
      // this.getAllUsers();
      // this.getAllGroups();
    },
    closeCreateMeeting() {
      // this.isReturnToUpdate = false
      // this.stepOfCreateMeeting = "stepOne";
      // this.startTime = "";
      // this.endTime = "";
      // this.meetingTitle = "";
      // this.meetingPinCode = "";
      // this.description = "";
      // this.selectedNotice.label = this.$store.getters.t('Email');
      this.chosenModeratorn = {};
      this.chosenSubModerator = {};
      // this.selectedRoom = {label: '', id: ''};
      // this.meetingId = "";
      this.createMeetingIsOpen = false;
      this.meetingId = null
      // this.meetingData = "";
      // this.selectedNotice = {};
      // this.editableMeetingId = "";
      // this.isModeratorChosen = false;
      // this.isSubModeratorChosen = false;
      this.createOrEditMeeting = 'create'
      // this.invitedUsers = [];
      // this.userIds = [];

      // if (this.isCreateOrEditMeeting === true) {
      //   window.location.reload();
      // }
      // this.eventBus.emit('resize-calendar')
      window.location.reload();
    },
    openAgendaModalBeforeCreateMeeting(data){
      if (data.createOrEdit === 'edit'){
        this.createOrEditAgenda = 'edit'
        this.meetingId = data.meetingId
      }else {
        this.createOrEditAgenda = 'create'
      }
      this.isMeetingCreated = false

      this.isAgendaModalOpen = true
    },
    openAgendaModal(data){
      this.isMeetingCreated = true
      this.chosenModeratorn = {};
      this.chosenSubModerator = {};
      this.createMeetingIsOpen = false;
      this.isAgendaModalOpen = true
      this.meetingId = data.meetingId
      if (data.createOrEdit === 'edit'){
        this.createOrEditAgenda = 'edit'
      }else {
        this.createOrEditAgenda = 'create'
      }
    },
    closeAgendaModal(isMeetingCreated){
      this.isAgendaModalOpen = false
      if (isMeetingCreated) {
        this.meetingId = null
        this.eventBus.emit('resize-calendar')
        window.location.reload();
      }

    },
    openPrivateRoom() {
      this.privateInvitationIsVisible = true;
    },
    closePrivateComponent() {
      this.privateInvitationIsVisible = false;
    },
    changePageView(view) {
      if (view === this.$store.getters.t('calendar')){
        this.closeMobileSideBar()
        this.sideBarSubItem = ''
        this.$router.push('/calendar/calendar')
      }
      this.whichSideBarItem = view
      if (view === this.$store.getters.t('user-management') && (this.$route.path !== '/calendar/userManagement' && this.$route.path !== '/calendar/groupManagement' && this.$route.path !== '/calendar/activeDirectory')) {
        this.sideBarSubItem = this.$store.getters.t('users-management')
        this.$router.push('/calendar/userManagement')
      }
      if (view === this.$store.getters.t('meetings-and-rooms-management')){
        if (this.sideBarSubItem !== this.$store.getters.t('webinar-management') && this.sideBarSubItem !== this.$store.getters.t('rooms-management'))
        this.sideBarSubItem = this.$store.getters.t('meetings-management')
        this.$router.push('/calendar/meetingManagement')
      }
      else if (view === this.$store.getters.t('meetings-management')){
        if (this.sideBarSubItem !== this.$store.getters.t('webinar-management') && this.sideBarSubItem !== this.$store.getters.t('rooms-management'))
          this.sideBarSubItem = this.$store.getters.t('meetings-management')
        this.$router.push('/calendar/meetingManagement')
        this.iswebinar = false
      }else if (view === this.$store.getters.t('reports-management')) {
        if (this.sideBarSubItem !== this.$store.getters.t('system-events') && this.sideBarSubItem !== 'گزارشات ورود و خروج کاربران' )
        this.sideBarSubItem = this.$store.getters.t('meeting-report')
        this.$router.push('/calendar/reportManagement')
      }

    },
    closeMobileSideBar(){
      this.isMobileSidebarOpen = false
      this.eventBus.emit('close-mobile-side-bar')
    },
    chooseSubItem(item){
      this.closeMobileSideBar()
      switch (item){
        case this.$store.getters.t('users-management'):
          this.whichSideBarItem = this.$store.getters.t('user-management')
          this.sideBarSubItem = this.$store.getters.t('user-management')
          this.$router.push('/calendar/userManagement')
          break
        case this.$store.getters.t('groups-management'):
          this.sideBarSubItem = this.$store.getters.t('groups-management')
          this.$router.push('/calendar/groupManagement')
          break
        case this.$store.getters.t('active-directory-management'):
          this.whichSideBarItem = this.$store.getters.t('user-management')
          this.$router.push('/calendar/activeDirectory')
          break
        case this.$store.getters.t('meetings-management'):
          this.iswebinar = false
          this.whichSideBarItem = this.$store.getters.t('meetings-and-rooms-management')
          this.$router.push('/calendar/meetingManagement')
              break
        case  this.$store.getters.t('webinar-management'):
          this.iswebinar = true
          this.whichSideBarItem = this.$store.getters.t('meetings-and-rooms-management')
          this.$router.push('/calendar/webinarManagement')
          break
        case this.$store.getters.t('rooms-management') :
          this.whichSideBarItem = this.$store.getters.t('meetings-and-rooms-management')
          this.$router.push('/calendar/roomManagement')
          break
        case  this.$store.getters.t('meeting-settings') :
          this.whichSideBarItem = this.$store.getters.t('meetings-and-rooms-management')
          this.$router.push('/calendar/meetingSettings')
          break

        case this.$store.getters.t('meeting-report') :
          this.whichSideBarItem = this.$store.getters.t('reports-management')
          this.$router.push('/calendar/reportManagement')
          break
        case this.$store.getters.t('system-events') :
          this.whichSideBarItem = this.$store.getters.t('reports-management')
          this.$router.push('/calendar/systemIncident')
          break
        default :
          this.whichSideBarItem = this.$t('Calendar-of-meetings')
      }
      this.sideBarSubItem = item
    },
    changeMobilePageView(view) {
      this.changePageView(view)
    },
    getAllMeetings() {
      this.resetMeetings();
      this.restClient
          .getMySchedule(this.datesInfo.range.from, this.datesInfo.range.to)
          .then((schedules) => {
            this.getAllByPrivateRoomByUserId();
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
            // this.eventBus.emit('all-meetings', this.meetings)
            this.isMeetingsLoaded = true;
          })
          .catch((err) => {
            console.log(err);
            this.isMeetingsLoaded = true;
          });
    },
    getAllByOwnerUserId() {
      this.restClientPrivateRoom.getAllByOwnerUserId().then((privateRooms) => {
        if (privateRooms != null) {
          this.eventBus.emit("room-name", privateRooms.name);
          this.privateRoomName = privateRooms.name
          // document.getElementById('online-room-btn').style.display = 'block'
          // this.allMeetings.privateMeetings = privateRooms
          this.PrivateOwnerUserId = privateRooms.roomOwnerUserId;
          this.hasPrivateRoomId = (+this.PrivateOwnerUserId === +this.$store.getters.userId)
          this.$store.dispatch("setPrivateRoomId", privateRooms.id);
          auth.setPrivateRoomId('privateRoomId', privateRooms.id.toString())
          this.$store.dispatch(
              "setPrivateRoomOwnerUserId",
              this.PrivateOwnerUserId
          );
          localStorage.setItem("roomId", privateRooms.id);
          localStorage.setItem('room-Name', privateRooms.id)
          // EventBus.$emit('getPrivateRoomId', this.privateRoomId)
        } else {
          // document.getElementById('online-room-btn').style.display = 'none'
        }
      }).catch(err => console.error(err));
    },
    getAllPrivateRoom() {
      this.restClientPrivateRoom.getAll().then((response) => {
       this.privateRoomList =  response.data
      });
    },
    generateLink(meetingId) {
      this.restClientInvite
          .generateLink(meetingId)
          .then((response) => {
            this.invitationLink = response;
          })
          .catch((error) => {
            console.log(error);
          });
    },
    getRooms() {
      this.roomList = [];
      this.restClientRoom
          .getAll(false)
          .then((response) => {
            this.roomList = response.data
            this.selectedRoom = {
              label: this.roomList[0].label,
              id: this.roomList[0].id,
            };
            this.lineRooms = response.data.filter((room) =>{
              return room.roomType === 'LINE'
            })
          })
          .catch((error) => {
            // eslint-disable-next-line no-undef
            reject(error);
          });
    },
    getWebinarRooms() {
      this.roomList = [];
      this.restClientRoom
          .getAll(true)
          .then((response) => {
            this.webinarList = response.data
          })
          .catch((error) => {
            // eslint-disable-next-line no-undef
            reject(error);
          });
    },
    deleteModerator() {
      this.isModeratorChosen = false;
      this.chosenModeratorn = {};
    },
    deleteSubModerator() {
      this.isSubModeratorChosen = false;
      this.chosenSubModerator = {};
    },
    clickToChooseUser(user) {
      this.chosenModeratorn = user;
      this.isModeratorChosen = true;
      this.moderatorMeetingValue = "";
      this.addedUsers = [];
    },
    clickToChooseSubModerator(user) {
      this.chosenSubModerator = user;
      this.isSubModeratorChosen = true;
      this.subModeratorMeetingValue = "";
      this.addedUsersSub = [];
    },
    deleteUser(id) {
      const foundUserIndex = this.invitedUsers.findIndex((user) => {
        return user.id == id;
      });
      if (foundUserIndex !== -1) {
        this.invitedUsers.splice(foundUserIndex, 1);
      }
    },
    clickToInviteUser(user) {
      const index = this.invitedUsers.findIndex((el) => {
        return el.id == user.id;
      });
      if (index === -1) {
        this.invitedUsers.push(user);
      }
    },

    returnUpdateMeeting() {
      this.isCreateOrEditMeeting = false;
      // EventBus.$emit('roomId', this.roomId)
      return new Promise((resolve, reject) => {
        this.createOrEditMeeting = "edit";
        let inputData = {};
        if (this.selectedMeetingType.label === this.$store.getters.t('with-moderator')) {
          inputData = {
            meetingType: 0,
            id: this.meetingId,
            fromSchd: this.startTime,
            toSchd: this.endTime,
            title: this.meetingTitle,
            meetingPinCode: this.meetingPinCode,
            description: this.description,
            publishSize: "8",
            isWebinar: false,
            notificationType: this.getNotificationTypeByName(
                this.selectedNotice.label
            ),
            managerUserId: this.chosenModeratorn.id,
            substitutionUserId: this.chosenSubModerator.id,
            roomId: this.selectedRoom.id,
          };
        } else {
          inputData = {
            meetingType: 1,
            id: this.meetingId,
            fromSchd: this.startTime,
            toSchd: this.endTime,
            title: this.meetingTitle,
            meetingPinCode: this.meetingPinCode,
            description: this.description,
            publishSize: "8",
            isWebinar: false,
            notificationType: this.getNotificationTypeByName(
                this.selectedNotice.label
            ),
            managerUserId: null,
            substitutionUserId: null,
            roomId: this.selectedRoom.id,
          };
        }
        this.restClient
            .update(inputData)
            .then((data) => {
              this.isCreateOrEditMeeting = true;
              this.eventBus.emit("notification", {
                title: "پیام",
                type: "success",
                bodyText: this.$store.getters.t('meting-edited'),
                time: 5000,
              });
              this.stepOfCreateMeeting = "stepTwo";

              this.generateLink(this.editableMeetingId);

              resolve(data);
            })
            .catch((error) => {
              reject(error);
            });
      });
    },

    getAllInvited() {
      this.invitedUsers = [];
      this.restClientInvite
          .getInvitedPublic(this.editableMeetingId)
          .then((invitedUsers) => {
            for (const el of invitedUsers) {
              if (
                  el.id != this.chosenModeratorn.id &&
                  el.id != this.chosenSubModerator.id
              ) {
                this.invitedUsers.push(el);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
    },

    resetMeetings() {
      this.meetings.upcoming.data = [];
      this.meetings.past.data = [];
      this.meetings.future.data = [];
      this.meetings.private.data = [];
    },
    // getAllPlanByCustomerId() {
    //   let customerId = null
    //   if (this.$store.getters['customer_Id']) {
    //     customerId = this.$store.getters['customer_Id']
    //   } else {
    //     customerId = localStorage.getItem('customer-id')
    //
    //   }
    //   this.restClientBilling.getAll(customerId).then((data) => {
    //     this.getAllRoomByCustomerIdAndPlanId(data.data[0].customerId,data.data[0].id)
    //     const linePlanIndex = data.data.findIndex((plan) => {
    //       return plan.planType == 1
    //     })
    //     if (linePlanIndex !== -1) {
    //       this.customerId = data.data[0].customerId
    //     }
    //   }).catch((err) => {
    //     console.error(err)
    //   })
    // },
    // getAllRoomByCustomerIdAndPlanId(customerId, planId) {
    //   this.lineRooms = []
    //   this.restClientRoom
    //       .getAllRoomByCustomerIdAndPlanId(customerId, planId)
    //       .then((response) => {
    //         this.lineRooms = response.data
    //       })
    //       .catch((error) => {
    //         // eslint-disable-next-line no-undef
    //         console.error(error)
    //       });
    // },
    toggleSidebar(flag){
      this.isSidebarOpen = flag
      this.eventBus.emit('resize-calendar')
    },
    toggleMobileSidebar(flag){
      this.isMobileSidebarOpen = flag
    },
    chooseTab(tabName, index) {
      this.clickedIndex = index
      this.whichTab = tabName
    },
    logOut(){
      this.$store
          .dispatch("LogOut")
          .then(() => {
            this.isUserLeaveCalendarPage = true
            localStorage.removeItem('user-role')
            this.$router.push({
              name: "Login",
              path: "/login",
            });
          })
          .catch(() => {
            this.isLogOut = false
            this.$router.push({
              name: "Login",
              path: "/login",
            });
          });
    },
    openSetting(){
      this.isMobileSidebarOpen = false
      this.eventBus.emit('open-setting-modal')
    },
    openProfile(){
      this.isMobileSidebarOpen = false
      this.eventBus.emit('open-profile-modal')
    },
    logOutDesktop(){
      this.isUserLeaveCalendarPage = true
    },
  },
  beforeRouteLeave() {
    this.isUserLeaveCalendarPage = true
  },
  mounted() {
    if (this.$route.path === '/calendar') {
      this.whichSideBarItem = this.$store.getters.t('calendar')
      this.$router.push('/calendar/calendar')
    }
    if (this.$route.path === '/calendar/calendar') {
      this.whichSideBarItem = this.$store.getters.t('calendar')
    }
const path = this.$route.path

    switch (path){
      case '/calendar/userManagement':
        this.whichSideBarItem = this.$store.getters.t('user-management')
        this.sideBarSubItem = this.$store.getters.t('users-management')
        break
      case '/calendar/groupManagement':
        this.whichSideBarItem = this.$store.getters.t('user-management')
        this.sideBarSubItem = this.$store.getters.t('groups-management')
        break
      case '/calendar/activeDirectory':
        this.whichSideBarItem = this.$store.getters.t('user-management')
        this.sideBarSubItem = this.$store.getters.t('active-directory-management')
        break
      case '/calendar/meetingManagement':
        this.iswebinar = false
        this.whichSideBarItem = this.$store.getters.t('meetings-and-rooms-management')
        this.sideBarSubItem = this.$store.getters.t('meetings-management')
        break
      case  '/calendar/webinarManagement':
        this.iswebinar = true
        this.whichSideBarItem = this.$store.getters.t('meetings-and-rooms-management')
        this.sideBarSubItem = this.$store.getters.t('webinar-management')
        break
      case '/calendar/roomManagement':
        this.whichSideBarItem = this.$store.getters.t('meetings-and-rooms-management')
          this.sideBarSubItem = this.$store.getters.t('rooms-management')
        break
      case  '/calendar/meetingSettings' :
        this.whichSideBarItem = this.$store.getters.t('meetings-and-rooms-management')
        this.sideBarSubItem = this.$store.getters.t('meeting-settings')
        break
      case  '/calendar/reportManagement' :
        this.whichSideBarItem = this.$store.getters.t('reports-management')
        this.sideBarSubItem = this.$store.getters.t('meeting-report')
        break
      case '/calendar/systemIncident' :
        this.whichSideBarItem = this.$store.getters.t('reports-management')
        this.sideBarSubItem = this.$store.getters.t('system-events')
        break
      default :
        this.whichSideBarItem = this.$t('Calendar-of-meetings')
    }













    this.eventBus.on('all-meetings',(data)=>{
      setTimeout(()=>{
        this.meetings = data
      },1000)

      this.isMeetingsLoaded = true
    })
    this.eventBus.on('image-url',(data) => {
      this.imgUrlForMobile = data
    })
    // this.restClientCustomer.getAllCustomer()
    //     .then((response) => {
    //       console.error('customerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
    //       console.error(response)
    //     })
    //     .catch((error) =>{
    //       console.error(error)
    //     })
    this.eventBus.on('create-session-in-calendar',()=>{
      this.createMeetingIsOpen = true
    })
    this.eventBus.on('createPrivateMeeting',()=>{
      this.privateInvitationIsVisible = true
    })
    // this.eventBus.on('base-select-value', (data) => {
    //   this.clickToInviteGroup(data)
    // })
    // this.eventBus.on('set-max-height', () => {
    //   this.maxHeight = window.innerHeight - this.$refs.groupSelector.getBoundingClientRect().bottom - 15 + 'px'
    //   window.addEventListener("resize", () => {
    //     clearTimeout(this.timer);
    //     this.timer = setTimeout(() => {
    //       if (this.$refs.groupSelector) {
    //         this.maxHeight = window.innerHeight - this.$refs.groupSelector.getBoundingClientRect().bottom - 15 + 'px'
    //       }
    //
    //     }, 80);
    //   });
    // })
    this.minTime = momentJalali(new Date()).format('jYYYY/jMM/jDD HH:mm:ss')


    // this.eventBus.on('all-meetings', (data) => {
    //   this.meetings = data
    // })
    this.userRole = JSON.parse(localStorage.getItem("user-role"));
    if (this.userRole[0] === 'ROLE_SECRETARY' || this.userRole[1] === 'ROLE_SECRETARY') {
      this.sidebarItems = [{label:this.$store.getters.t('calendar'), subItems:[]}, {label:this.$store.getters.t('meetings-management'),subItems:[{label:this.$store.getters.t('meetings-management')},{label:this.$store.getters.t('webinar-management')}]}]
    }

    this.eventBus.on("edit-created-meeting", (data) => {
      this.createOrEditMeeting = 'edit'
      this.createMeetingIsOpen = true
      this.meetingId = data.id

    });
    this.eventBus.on("edit-created-webinar", (data) => {
      this.createOrEditMeeting = 'edit'
      this.createWebinarIsOpen = true
      this.meetingId = data.id

    });
    this.eventBus.on('cancel-meeting', (id) => {
      this.cancelMeeting(id)
    })
    if (
        this.userRole.length > 1 &&
        (this.userRole[0] === "ROLE_ADMIN" || this.userRole[1] === "ROLE_ADMIN")
    ) {
      this.getRooms();
      this.getWebinarRooms()
      this.getAllPrivateRoom()
    }
    // if (this.userRole.length > 1 && (this.userRole[0] === "ROLE_ADMIN" || this.userRole[1] === "ROLE_ADMIN")) {
    //   this.getAllPlanByCustomerId()
    // }
    this.eventBus.on('get-private-rooms', ()=>{
      this.getAllPrivateRoom()
    })

  },
  beforeRouteEnter(to, from) {
    if ((from.path === '/conference') && to.path === '/calendar'){
      window.location.reload();
    }
  }

};
</script>

<style scoped>
.calendar-page-fragment {
  width: 100%;
  height: calc(100vh - 8.8rem);
  display: flex;
  flex-direction: row-reverse;
}

.calendar-page-fragment-ltr {
  width: 100%;
  height: calc(100vh - 8.8rem);
  display: flex;
  flex-direction: row;
}

.side-bar {
  width: 22.5rem;
  height: calc(100vh + 6rem);
  border-left: solid 0.2rem #d9d6d6;
  padding: 2.5rem 1.5rem 2.5rem 0.8rem;
  background-color: white;
  position: relative;
  z-index: 10

  /*-webkit-box-shadow: -2px 2px 21px 1px rgba(0, 0, 0, 0.34);*/
  /*box-shadow: -2px 2px 21px 1px rgba(0, 0, 0, 0.34);*/
}
.side-bar__mobile {
  width: 100%;
  height: 100vh;
  background-color: white;
  border-left: solid 0.2rem #d9d6d6;
  padding: 2.5rem 1.5rem 2.5rem 0.8rem;
  position: absolute;
  z-index: 10010;
  transition: 0.3s;
  top: 0;
  /*-webkit-box-shadow: -2px 2px 21px 1px rgba(0, 0, 0, 0.34);*/
  /*box-shadow: -2px 2px 21px 1px rgba(0, 0, 0, 0.34);*/
}
.mobile-side-bar-enter-active{
  animation: translate .4s ease-out
}
.mobile-side-bar-leave-active{
  animation: translate .4s ease-in reverse;
}
@keyframes translate {
  from{
    transform: translateX(100%);
  }
  to{
    transform: translateX(0);

  }
}
.side-bar-item-ul {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
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

.calendar-fragment {
  height: 100%;
}

.calendar-fragment-mobile {
  width: 100%;
  height: 100%;
}


.found-users-container > ul {
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
.create-meeting-fields > span {
  color: #7b7b7b;
  font-size: 1.3rem;
}

.create-meeting-fields-ltr > span {
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

.create-meeting-fields-ltr > input {
  width: 30rem;
  height: 4rem;
  border: 1px solid gray;
  border-radius: 0.5rem;
  direction: ltr;
  padding: 0 0.5rem;
}

.create-meeting-fields > input:focus {
  outline: none;
  border: solid 0.1rem #1a73e8;
}

.create-meeting-fields-ltr > input:focus {
  outline: none;
  border: solid 0.1rem #1a73e8;
}

.step__container {
  width: 100%;
  height: 6rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  left: -1.3rem;
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
  position: relative;
}

.step-text :last-child {
  width: 50%;
  display: flex;
  flex-direction: row-reverse;
  position: relative;

}

.without-moderator-input + label {
  cursor: pointer;
}

.tabs_underline__mobile-side-bar {
  position: absolute;
  bottom: 0;
  border: 0.1rem solid #1B76FF;
  right: 0;
  transition: 0.2s;
}
.tabs_underline__mobile-side-bar__ltr {
  position: absolute;
  bottom: 0;
  border: 0.1rem solid #1B76FF;
  left: 0;
  transition: 0.2s;
}
.mobile-side-bar-header-tabs-container{
  position: relative;
  width: 100%;
  height: 4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  -webkit-box-shadow: 0px 5px 8px -7px #000000, 0px 4px 8px 0px rgba(0, 0, 0, 0);
  box-shadow: 0px 5px 8px -7px #000000, 0px 4px 8px 0px rgba(0, 0, 0, 0);

}
.mobile-side-bar-header-tabs-container__ltr {
  position: relative;
  width: 100%;
  height: 4rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  -webkit-box-shadow: 0px 5px 8px -7px #000000, 0px 4px 8px 0px rgba(0, 0, 0, 0);
  box-shadow: 0px 5px 8px -7px #000000, 0px 4px 8px 0px rgba(0, 0, 0, 0);
  overflow: hidden;
}
.profile-container__mobile{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.profile-container__mobile > div{
  padding: 0 0 0.8rem 0;
border-bottom: 0.1rem solid #DCDADA;
}


</style>

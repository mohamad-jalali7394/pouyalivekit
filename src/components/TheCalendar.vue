<template>
  <div :style="{padding:(isMobile === true )  && ' 1rem 0.2rem 0 0.2rem' }" :class="$i18n.locale === 'fa'? 'header-calendar-rtl':'header-calendar-ltr'" @click="closeEventSummery">
    <div  :class="$i18n.locale === 'fa'? 'header-calendar-rtl-first-child':'header-calendar-ltr-first-child'">
      <div ref="mini-drop-down-container" style="position: relative" v-if="!isMobile && (userRole.length >1 && (userRole[0] === 'ROLE_ADMIN' || userRole[1] === 'ROLE_SECRETARY' || userRole[1] === 'ROLE_ADMIN' || userRole[0] === 'ROLE_SECRETARY') || privateRoomName)">
        <base-button
            :is-active="true"
            :button-inner-txt="$store.getters.t('session-creation')"
            :continuous-params="['color=white', 'background-color=#1B76FF']"
            :style-types="[ 'large--button']"
            @btn-clicked="openCreateMeetingDropDown"
        >
          <template #pre-button-slot>
            <add-plus color="white"></add-plus>
          </template>
          <template #post-button-slot>
            <img draggable="false"   src="/img/down-white.svg" style="width: 16px; height: 16px" alt="not loaded">
          </template>
        </base-button>
        <base-mini-drop-down
            v-if="!isMobile"
            direction-y="downward"
            direction-x="middle"
            :open="isCreatSessionDropDownOpen.flag"
            :items="createSessionDropDownItems"
            @select-item="getSelectedItem"
        >
        </base-mini-drop-down>
      </div>
      <div v-if="whichItem === $store.getters.t('Calendar-of-meetings')" :style="{'margin-left' : isMobile ?'0.8rem' : '',width:'13rem'}">
        <base-select :option-values="viewList" v-model="selectedView" max-height="24rem" :side="$i18n.locale === 'en' ? 'select-rtl' : 'select-ltr'" :arrow-direction="'arrow-down-icon-ltr'" :div-height="'3rem'" :select-side="'list-item__label-ltr'" is-calendar-view="yes"></base-select>
      </div>
      <!--      <div v-if="whichItem === $store.getters.t('Calendar-of-meetings')" :style="{'margin-left' : isMobile ?'0.8rem' : ''}">-->
      <!--        <base-select :option-values="lists" v-model="selectedList" max-height="24rem" :side="'select-ltr'" :arrow-direction="'arrow-down-icon-ltr'" :div-height="'3rem'" :select-side="'list-item__label-ltr'" is-calendar-view="yes"></base-select>-->
      <!--      </div>-->
    </div>
    <div v-if="isMobile === false" class="search-input-container">
      <div style="position: relative">
        <!--        <img draggable="false"-->
        <!--          :class="$i18n.locale === 'fa' ? 'search-calendar-icon' : 'search-calendar-icon-ltr'" src="/img/search.svg"-->
        <!--          alt="not loaded"/>-->
        <!--        <div style="width: fit-content;height: 100%;display: flex;flex-direction: row;align-items: center;position: absolute;gap: 0.6rem" :style="{left:$i18n.locale !== 'en' ? ' 0.8rem' : '',right:$i18n.locale === 'en' ? ' 0.8rem' : ''}">-->
        <!--          <img draggable="false" style="cursor: pointer" @click="clickToOpenSearchDetail" src="/img/down.svg" alt="not loaded"/>-->
        <!--          <div style="width: 0;height: 2.5rem;border: 0.1rem solid #DCDADA;"></div>-->
        <!--          <img draggable="false" style="cursor: pointer" @click=" this.isDetailSearchClicked = false;searchInputValue=''" src="/img/close.svg" alt="not loaded"/>-->
        <!--        </div>-->

        <!--        <input @focus="inputFocused" @blur="inputBlurred" @keyup="searchEvents"-->
        <!--               :class="$i18n.locale === 'fa' ? 'search-input-calendar' : 'search-input-calendar-ltr'"-->
        <!--               :placeholder="$store.getters.t('search-in-sessions')"-->
        <!--               :style="{ 'border-bottom-left-radius': (searchInputValue && isSearchInputFocused || isDetailSearchClicked) ? '0':'','border-bottom-right-radius':(searchInputValue && isSearchInputFocused || isDetailSearchClicked)? '0' : '','box-shadow':isDetailSearchClicked ? '0px 0px 8px 0px rgba(0, 0, 0, 0.25)' : ''}"-->
        <!--               v-model="searchInputValue">-->
        <!--        <div v-if="searchInputValue && isSearchInputFocused && !isDetailSearchClicked" class="found-events">-->
        <!--          <div style="color: red" v-if="addedEvents.length < 1 && searchInputValue">-->
        <!--            {{ $store.getters.t("no-information-found") }}-->
        <!--          </div>-->
        <!--          <div v-else style="width: 100%;height: 100%">-->
        <!--            <ul class="added-events">-->
        <!--             <search-session-item :added-events="addedEvents" ></search-session-item>-->
        <!--            </ul>-->
        <!--          </div>-->
        <!--        </div>-->
        <div v-if="isDetailSearchClicked" class="search-detail-events">
          <div class="detail-search--fragment" :style="{direction: $i18n.locale !== 'en' ? 'ltr' : 'rtl' }">
            <div>
              <span >{{ $store.getters.t('label') }}</span>
              <div>
                <base-select  :option-values="meetingLabelList" v-model="selectedLabelList" max-height="33rem"
                              :side="'select-ltr'" :arrow-direction="'arrow-down-icon-ltr'" :div-height="'3.2rem'"
                              :select-side="'list-item__label-ltr'" is-calendar-view="yes"></base-select>
              </div>
            </div>
            <div>
              <span :style="{fontSize: $i18n.locale !== 'en' ? '1.2rem' : '1rem' }">{{ $store.getters.t('room-creator') }}</span>
              <div style="display: flex;flex-direction: row-reverse;width: 30rem;justify-content: space-between">
                <div style="width: 13rem;position: relative">
                  <svg @click="showStartDatePicker = true"
                       style="cursor: pointer;width: 16px;height: 16px;position: absolute;left:0.8rem;top: 0.8rem;z-index: 10"
                       width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4.70696 7.70711L7.29274 10.2929C7.68327 10.6834 8.31643 10.6834 8.70696 10.2929L11.2927 7.70711C11.6833 7.31658 11.6833 6.68342 11.2927 6.29289C11.1052 6.10536 10.8509 6 10.5856 6H5.41406C4.86178 6 4.41406 6.44772 4.41406 7C4.41406 7.26522 4.51942 7.51957 4.70696 7.70711Z"
                        fill="#1B76FF"/>
                  </svg>

                  <input
                      type="text"
                      id="custom-input-start"
                      :style="{'background-color':startTime ? 'white': '#F2F2F2','border': startTime ? '0.1rem solid #DCDADA':'0.1rem solid transparent' }"
                  />
                  <persian-date-picker
                      color="#1B76FF"
                      :disabled="showEndDatePicker"
                      :show="showStartDatePicker"
                      :format="'jDD jMMMM jYYYY'"
                      v-model="fromSearchInput"
                      popover="bottom-right"
                      custom-input="#custom-input-start"
                      @close="closeStartDatePicker"
                  ><template #header-date="{formattedDate }">
                    {{
                      formattedDate.toString().split(' ')[0] + formattedDate.toString().split(' ')[1] + formattedDate.toString().split(' ')[2]
                    }}
                  </template>
                    <template #month-name="{date}">
                      {{ date.xFormat('jDD jMMMM jYYYY') }}
                    </template>
                    <template #submit-btn="{canSubmit, submit, lang }">
                      <button
                          type="button"
                          :disabled="!canSubmit"
                          :style="{ 'background-color':'#1B76FF','border-radius':'0.8rem','color':'white','position':'relative','left':'-19.5rem' }"
                          @click="submit"
                          v-text="lang.submit"
                      />
                    </template>
                    <template #cancel-btn="{vm}">
                      <button
                          type="button"
                          :style="{ 'color':'white','position':'absolute','top':'-8rem','left':'-1rem' }"
                          class="cancel-btn-date-picker"
                          @click="vm.visible = false"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                              d="M11.0191 3.56764L7.99812 6.58868L4.97715 3.56764C4.5874 3.17789 3.9555 3.17789 3.56575 3.56764L3.49724 3.64344C3.17752 4.03543 3.20036 4.61366 3.56575 4.97905L6.58678 8.00001L3.56575 11.021C3.176 11.4107 3.176 12.0426 3.56575 12.4324L3.64155 12.5009C4.03354 12.8206 4.61176 12.7978 4.97715 12.4324L7.99812 9.41134L11.0191 12.4324C11.4088 12.8221 12.0407 12.8221 12.4305 12.4324L12.499 12.3566C12.8187 11.9646 12.7959 11.3864 12.4305 11.021L9.40945 8.00001L12.4305 4.97905C12.8202 4.5893 12.8202 3.95739 12.4305 3.56764C12.0407 3.17789 11.4088 3.17789 11.0191 3.56764Z"
                              fill="white"/>
                        </svg>

                      </button>
                    </template>
                    <template #now-btn="{color, goToday, lang }">
                      <button
                          type="button"
                          :style="{ color,'position':'relative','right':'-9rem' }"
                          @click="goToday"
                          v-text="lang.now"
                      />
                    </template>
                  </persian-date-picker>
                </div>
                <div style="display: flex;align-items: center;font-size: 1.4rem">{{ $store.getters.t('until') }}</div>
                <div style="width: 13rem;position: relative">
                  <svg @click="showEndDatePicker = true"
                       style="cursor: pointer;width: 16px;height: 16px;position: absolute;left:0.8rem;top: 0.8rem;z-index: 10"
                       width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4.70696 7.70711L7.29274 10.2929C7.68327 10.6834 8.31643 10.6834 8.70696 10.2929L11.2927 7.70711C11.6833 7.31658 11.6833 6.68342 11.2927 6.29289C11.1052 6.10536 10.8509 6 10.5856 6H5.41406C4.86178 6 4.41406 6.44772 4.41406 7C4.41406 7.26522 4.51942 7.51957 4.70696 7.70711Z"
                        fill="#1B76FF"/>
                  </svg>

                  <input
                      type="text"
                      id="custom-input-end"
                      :style="{'background-color':endTime ? 'white': '#F2F2F2','border': endTime ? '0.1rem solid #DCDADA' : '0.1rem solid transparent' }"
                  />
                  <persian-date-picker
                      color="#1B76FF"
                      :show="showEndDatePicker"
                      :format="'jDD jMMMM jYYYY'"
                      :disabled="showStartDatePicker"
                      v-model="toSearchInput"
                      popover="bottom-right"
                      custom-input="#custom-input-end"
                      @close="closeEndDatePicker"
                  >
                    <template #header-date="{formattedDate }">
                      {{
                        formattedDate.toString().split(' ')[0] + formattedDate.toString().split(' ')[1] + formattedDate.toString().split(' ')[2]
                      }}
                    </template>
                    <template #month-name="{date}">
                      {{ date.xFormat('jDD jMMMM jYYYY') }}
                    </template>
                    <template #submit-btn="{canSubmit, submit, lang }">
                      <button
                          type="button"
                          :disabled="!canSubmit"
                          :style="{ 'background-color':'#1B76FF','border-radius':'0.8rem','color':'white','position':'relative','left':'-19.5rem' }"
                          @click="submit"
                          v-text="lang.submit"
                      />
                    </template>
                    <template #cancel-btn="{vm}">
                      <button
                          type="button"
                          :style="{ 'color':'white','position':'absolute','top':'-8rem','left':'-1rem' }"
                          class="cancel-btn-date-picker"
                          @click="vm.visible = false"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                              d="M11.0191 3.56764L7.99812 6.58868L4.97715 3.56764C4.5874 3.17789 3.9555 3.17789 3.56575 3.56764L3.49724 3.64344C3.17752 4.03543 3.20036 4.61366 3.56575 4.97905L6.58678 8.00001L3.56575 11.021C3.176 11.4107 3.176 12.0426 3.56575 12.4324L3.64155 12.5009C4.03354 12.8206 4.61176 12.7978 4.97715 12.4324L7.99812 9.41134L11.0191 12.4324C11.4088 12.8221 12.0407 12.8221 12.4305 12.4324L12.499 12.3566C12.8187 11.9646 12.7959 11.3864 12.4305 11.021L9.40945 8.00001L12.4305 4.97905C12.8202 4.5893 12.8202 3.95739 12.4305 3.56764C12.0407 3.17789 11.4088 3.17789 11.0191 3.56764Z"
                              fill="white"/>
                        </svg>

                      </button>
                    </template>
                    <template #now-btn="{color, goToday, lang }">
                      <button
                          type="button"
                          :style="{ color,'position':'relative','right':'-9rem' }"
                          @click="goToday"
                          v-text="lang.now"
                      />
                    </template>
                  </persian-date-picker>
                </div>

              </div>

            </div>
            <div>
              <span :style="{fontSize: $i18n.locale !== 'en' ? '1.2rem' : '1rem' }">{{ $store.getters.t('person-name') }}</span>
              <div style="width: calc(100% - 7rem )">
                <input class="person-name--input" v-model="personName">
              </div>
            </div>
            <div>
              <span :style="{fontSize: $i18n.locale !== 'en' ? '1.2rem' : '1rem' }">{{ $store.getters.t('manager-name') }}</span>
              <div style="width: calc(100% - 7rem )">
                <input class="person-name--input" v-model="moderatorName">
              </div>
            </div>
            <div>
              <span :style="{fontSize: $i18n.locale !== 'en' ? '1.2rem' : '1rem' }">{{ $store.getters.t('meeting-room') }}</span>
              <div ref="groupSelector" style="width:calc(100% - 7rem)">
                <base-select
                    down-img-color="#1B76FF"
                    :is-drop-downOpen="isRoomDropDownOpen"
                    :option-values="roomList"
                    max-height="10rem"
                    :is-group="true"
                    :side="'select-ltr'" :arrow-direction="'arrow-down-icon-rtl'"
                    :select-side="'list-item__label-ltr'"
                    :is-waiting-room="'yes'"
                    v-model="selectedRoom" :div-height="'5rem'"></base-select>
              </div>
            </div>
            <div>
              <div>
                <base-button
                    :is-active="true"
                    :button-inner-txt= "$store.getters.t('delete')"
                    :continuous-params="['color=#1B76FF', 'background-color=#F6F6F7']"
                    :style-types="[ 'large--button']"
                ></base-button>
              </div>
              <div>
                <base-button
                    :is-active="true"
                    :button-inner-txt= "$store.getters.t('search')"
                    :continuous-params="['color=white', 'background-color=#1B76FF']"
                    :style-types="[ 'large--button']"
                ></base-button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div :class="isMobile === false ? $i18n.locale === 'fa' ? 'title-view-rtl' : 'title-view-ltr' : 'title-view-mobile'" >
      <span class="title-view-text">{{titleView}}</span>
      <button class="today--button" :disabled="numberOfClicked ===0">
        <span>
        <img draggable="false" @click="clickToNextDate" style="width:1.8rem" src="/img/arrow-left.svg" class="arrow-span" alt="not loaded" />
        </span>
        <span style="font-size: 1.4rem" @click="clickToDay">{{ $store.getters.t('today') }}</span>
        <span>  <img draggable="false" @click="clickToPrevDate" style="width:1.8rem" src="/img/arrow-right-2.svg" alt="not loaded"   class="arrow-span" /></span>
      </button>
    </div>
  </div>
  <FullCalendar ref="fullCalendar" :options="calendarOptions" @click="closeEventSummery" />


  <div v-if="(isHoverInEvent || isHoverToSummery) && !isMobile" @mouseenter="dontDisappearPopUp" @mouseleave="disappearPopUp" @click.prevent="disappearPopUp" class="event-information" :style="{left:leftOfScreen,top:topOfScreen}">
    <event-summery :event-id="eventId" :is-meeting-has-agenda="true" :is-meeting-has-file="false"  :invited-members="invitedMembers" :is-greater-than-day="isGreaterThanDay" :is-greater-than-week = "isGreaterThanWeek" :meeting-id="meetingId" :is-greater-than-month="isGreaterThanMonth" :time = "time" :time-left="timeLeft" :time-left-text="timeLeftText" :event-title="eventTitle" :event-moderator="eventModerator" :go-meeting="goMeeting" :meeting-data-object="meetingDataObject" :is-summery-left="isSummeryLeft" :is-summery-top="isSummeryTop" @join-to-session="joinToRoom" @click-to-show-detail="clickToShowDetail"></event-summery>
  </div>

  <base-modal :is-loading="'isLoading'"  :open="loginIsTriggered || isSessionsLoaded" is-blur="true" modal-color="transparent">
    <template #modal-body>
      <base-loading-spinner size-ratio="1.2" spinner-color="#409EFF">
        <template #loading-content>
          <div style="overflow: hidden; color: #409EFF" class="loading__extra-content--text">{{$store.getters.t("pleaseWait")}}</div>
        </template>
      </base-loading-spinner>
    </template>
  </base-modal>
  <div v-if="isEventClicked">
    <event-detail :which-item="whichItem"  :is-meeting-editable="isMeetingEditable" :result-question="resultQuestion" :is-meeting-deletable="isMeetingDeletable" :is-MeetingEnded="isMeetingEnded" :is-event-clicked="isEventClicked" :meeting-data-object="meetingDataObject" :go-meeting="goMeeting" :edit-meeting="editMeeting" :user-role="userRole" :event-moderator="eventModerator" :invited-members="invitedMembers"  @join-to-session="joinToRoom" @edit-meeting="editCreatedMeeting" @edit-webinar="editCreatedWebinar" @close-event-detail="closeEventModal" @cancel-meeting="cancelMeeting" @download-pdf = "DownloadPdf" @close-modal="closeEventModal"></event-detail>
  </div>
  <div v-if="isMoreLinkClicked" style="position: absolute;z-index: 100" :style="{left:leftOfScreenPopOver,top:topOfScreenPopOver}">
    <event-pop-over :all-segs="allSegs" @close-pop-over="closePopOver" @click-to-pop-over="clickToPopOverList"></event-pop-over>
  </div>

</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import EventSummery from "./EventSummery";
import BaseModal from "./UI/BaseModal";
import BaseSelect from "./UI/BaseSelect";
import BaseLoadingSpinner from "./UI/BaseLoadingSpinner";
import EventDetail from "./EventDetail";
import RestClient from "../api/restClient";
import momentJalali from "moment-jalaali-holiday";
import momentJalaali from "moment-jalaali";
import momentjs from "moment";
import DetectMobile from "../utils/detectMobile";
import {nextTick} from "vue";
// import userStatus from "../statics/types/userStatus";
import DateAndTimeUtilities from "../utils/date.and.time.utils";
// import SearchSessionItem from "./SearchSessionItem";
import EventPopOver from "./EventPopOver";
// const restClient = new RestClient("controlMeeting");
const restClientInviteMembers = new RestClient(entityTypes.invite);
import entityTypes from "@/statics/entityTypes";
import BaseButton from "./UI/BaseButton";
import BaseMiniDropDown from "./UI/BaseMiniDropDown";
import MiniDropDownHandler from "../utils/mini.drop.down.actions";
import PersianDatePicker from "vue3-persian-datetime-picker";
import AddPlus from "@/components/UI/Icons/AddPlus.vue";
import auth from "@/store/auth";
import InvitedMembers from "@/components/InvitedMembers.vue";
import userStatus from "../statics/types/userStatus";
export default {
  name: "TheCalendar",
  computed: {
    InvitedMembers() {
      return InvitedMembers
    }
  },
  components: {
    AddPlus,
    BaseButton,
    EventSummery,
    BaseMiniDropDown,
    FullCalendar,BaseSelect,BaseModal,BaseLoadingSpinner,EventDetail,EventPopOver,PersianDatePicker
  },
  props:['events','privateInvitationIsVisible','userRole','whichItem','isSidebarOpen','isUserLeaveCalendarPage', 'privateRoomName'],
  data(){
    return {
      isEventPast:false ,
      addedEvents: [],
      eventFound: false,
      isSearchInputFocused: false,
      searchInputValue:'',
      invitedMembers:[],
      restScheduleMeeting: new RestClient(entityTypes.scheduledMeeting),
      restClientProceedings: new RestClient(entityTypes.proceedings),
      restClientPoll: new RestClient(entityTypes.polling),
      restClientAuth: new RestClient(entityTypes.auth),
      restClientControlmeeting: new RestClient('controlMeeting'),
      allPollings:[],
      resultQuestion:[],
      amIModeratorSubstitute: false,
      id:'',
      isMobile:false,
      rightPulse:0,
      topPulse:0,
      isNowTime:false,
      invitedMembersArray:[],
      meetingData:[],
      allProceedings: [],
      isEventClicked:false,
      amIModerator: false,
      meetingDataObject:null,
      goMeeting:false,
      editMeeting:false,
      numberOfClicked:0,
      isDisable:false,
      titleView:'',
      viewList:[
        {
          label: 'نمای روز'
        },
        {
          label:'نمای هفته'
        },
        {
          label:'نمای ماه'
        },
      ],
      lists:[
        {
          label: 'لیست روز'
        },
        {
          label:'لیست هفته'
        },
      ],
      selectedView:{ label:'نمای هفته'},
      selectedList:{ label:'لیست روز'},
      eventClassNames:'myclass',
      isDropDownOpen:false,
      calendarOptions: {
        plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin,listPlugin],
        initialView: 'timeGridWeek',
        noEventsContent :this.$store.getters.t('no-event-to-display'),
        noEventsClassNames:'no-event-class',
        events:[],
        locale:this.$store.getters.t('which-language'),
        direction: this.$store.getters.t('which-direction'),
        firstDay:parseFloat(this.$store.getters.t('first-day')),
        titleFormat:{ year: 'numeric', month: 'long' },
        dayHeaderFormat:{ weekday: 'long',day: 'numeric' },
        scrollTime:momentjs().add(-2, 'hours').format("HH:mm"),
        calendarWeekends: true,
        slotDuration: '00:30:00',
        height:'100%',
        expandRows:true,
        slotEventOverlap: false,
        slotMaxTime:'23:00:00',
        slotMinTime:'00:00:00',
        slotLabelClassNames:'rowClass',
        slotLabelFormat:{ hour: 'numeric',
          minute: '2-digit',
        },
        dayMaxEventRows: true, // for all non-TimeGrid views
        views: {
          timeGrid: {
            dayMaxEventRows: 3// adjust to 6 only for timeGridWeek/timeGridDay
          }
        },
        eventContent: this.eventContentMethod,
        editable:false,
        eventTextColor:'black',
        droppable: false,
        eventDurationEditable:false,
        eventMouseEnter:this.hoverInEventToShowDetails,
        eventMouseLeave:this.mouseLeaveFromEvent,
        eventClick:this.clickToEvent,
        moreLinkClick:this.moreLinkClick,
        nowIndicator:true,
        allDaySlot: false,
        columnHeaderFormat:{ weekday: 'long', month: 'numeric', day: 'numeric', omitCommas: true },
        dayHeaderContent :this.headerHook,
        nowIndicatorContent:this.nowIndicator,
        businessHours:[],
        validRange: {
          start: momentjs(new Date()).add(-1,'years').format('YYYY-MM-DD'),
          end: momentjs(new Date()).add(1,'years').format('YYYY-MM-DD'),
        },
        nowIndicatorClassNames : 'now-class',
      },
      leftOfScreen:0,
      topOfScreen:0,
      isHoverInEvent:false,
      isHoverToSummery:false,
      eventTitle:'',
      eventModerator:'',
      time:'',
      isPast:false,
      isEnd:false,
      isAfter:false,
      isNow:false,
      hoursLef:'',
      isMeetingStarted:false,
      isMeetingEnded:false,
      isGreaterThanWeek:false,
      isGreaterThanDay:false,
      isGreaterThanMonth:false,
      timeLeftText:'',
      timeLeft:'',
      isSummeryLeft:true,
      isSummeryTop:true,
      isMouseEnteredInPopUP:false,
      pinCodeMeeting:'',
      meetingPinCode: "",
      isMeetingHasPinCode:false,
      loginIsTriggered:false,
      meetingId:'',
      datesInfo: {
        range: {
          from: momentJalali(new Date()).add(-1,'months').format('jYYYY/jM/jD HH:mm'),
          to: momentJalali(new Date()).add(1,'months').format('jYYYY/jM/jD HH:mm'),
        },
        currentDate: new DateAndTimeUtilities().formatDate(),
      },
      allMeetings:[],
      isMeetingEditable:false,
      isMeetingDeletable:false,
      isSessionsLoaded:false,
      isMoreLinkClicked:false,
      allSegs:[],
      leftOfScreenPopOver:'',
      topOfScreenPopOver:'',
      isPopOverLeft:false,
      isPopOverTop:false,
      isCreatSessionDropDownOpen: {flag: false},
      createSessionDropDownItems:[
        {
          label: this.$store.getters.t("create-session-in-calendar"),
        },
        {
          label: this.$store.getters.t("createPrivateMeeting"),
        },
      ],
      isDetailSearchClicked:false,
      meetingLabelList: [
        {
          label: 'عادی', color:'#5392F2'
        },
        {
          label: 'محرمانه', color:'black'
        },
        {
          label: 'مهم', color:'#DA0202'
        },
      ],
      selectedLabelList: {label: 'عادی',color:'#5392F2'},
      toSearchInput:'',
      fromSearchInput:'',
      showStartDatePicker: false,
      showEndDatePicker: false,
      personName:'',
      moderatorName:'',
      isRoomDropDownOpen: false,
      roomList: [{label: ""}],
      selectedRoom: {label: ""},
      eventId:'',
    }
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  watch:{
    whichItem(value){
      if (value === this.$store.getters.t('sessions')){
        this.$refs.fullCalendar.getApi().changeView('listMonth');
        this.selectedView = { label:this.$store.getters.t('month-list')}
        this.getAll()
      } else {
        if (!this.isMobile){
          this.$refs.fullCalendar.getApi().changeView('timeGridWeek');
          this.selectedView = { label:this.$store.getters.t('week-view')}
        }else{
          this.$refs.fullCalendar.getApi().changeView('timeGridDay');
          this.selectedView = { label:this.$store.getters.t('day-view')}

        }

        this.allMeetings = []
        this.calendarOptions.events = []
        let eventDate = ''
        for(const event in this.events){
          this.isEventPast = (momentjs(momentJalali(event.toSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + event.toSchd.split(' ')[1]).diff(momentjs(new Date()),'minutes')) > 0

          this.calendarOptions.events.push(...this.events[event].data.map((eventObj)=> {
            if (this.$i18n.locale !== 'en'){
              eventDate = (new Intl.DateTimeFormat('fa-IR', {dateStyle: 'full', timeStyle: 'long'}).format(new Date(eventObj.createdDate))).toString()
            }else {
              eventDate = (new Intl.DateTimeFormat('en-us', {dateStyle: 'full', timeStyle: 'long'}).format(new Date(eventObj.createdDate))).toString()
            }

            return {
              id:eventObj.id,
              title: eventObj.title,
              start: momentJalali(eventObj.fromSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + eventObj.fromSchd.split(' ')[1],
              end: momentJalali(eventObj.toSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + eventObj.toSchd.split(' ')[1],
              extendedProps: {...eventObj,now: (event=== 'upcoming') ? true : false,isPast:this.isEventPast,eventDay:  eventDate.split(' ')[2], eventDayName:  eventDate.split(' ')[3],eventMonth: eventDate.split(' ')[1],eventTimeFrom: eventObj.fromSchd.split(' ')[1] ,eventTimeTo : eventObj.toSchd.split(' ')[1] },
              textColor:'black'
            }
          }))

        }
      }
    },
    privateInvitationIsVisible(){
      this.isHoverInEvent = false
      this.isMouseEnteredInPopUP = false
    },
    selectedView: {
      deep: true,
      handler(value) {
        if ((value.label ==this.$store.getters.t('day-list')) || (value.label ==this.$store.getters.t('week-list'))||(value.label ==this.$store.getters.t('month-list'))){
          this.calendarOptions.eventClassNames = 'myclass'
        }else {
          this.calendarOptions.eventClassNames = 'myclass'
        }

        nextTick(()=>{
          if (this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ').length > 3 ){
            this.titleView = this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ')[1] + '  ' + this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ')[0] + '  ' + '-' + ' ' + this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ')[4] + '  ' + this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ')[3]

          }else {
            this.titleView = this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ')[1] + '  ' + this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ')[0]

          }
          this.calendarOptions.businessHours =  [
            {
              daysOfWeek: [ 0,1,2,3,6],

              startTime: '7:00',
              endTime: '18:00', },
            {
              daysOfWeek: [ 4],

              startTime: '7:00',
              endTime: '14:00',
            }
          ]
        })

        if(value.label === this.$store.getters.t('day-view')){
          this.$refs.fullCalendar.getApi().changeView('timeGridDay');
        }else if(value.label === this.$store.getters.t('week-view')){
          this.$refs.fullCalendar.getApi().changeView('timeGridWeek');
        }else if (value.label === this.$store.getters.t('month-view')){
          this.$refs.fullCalendar.getApi().changeView('dayGridMonth');
        }else if (value.label === this.$store.getters.t('day-list')){
          this.$refs.fullCalendar.getApi().changeView('listDay');
        }else if (value.label === this.$store.getters.t('week-list')){
          this.$refs.fullCalendar.getApi().changeView('listWeek');
        }else {
          if (this.userRole[0] === 'ROLE_ADMIN' || this.userRole[1] === 'ROLE_ADMIN' || this.userRole[0] === 'ROLE_SECRETARY' || this.userRole[1] === 'ROLE_SECRETARY'){
            this.$refs.fullCalendar.getApi().changeView('listMonth');
            this.isHoverInEvent = false
            this.getAll()
          }else {
            this.$refs.fullCalendar.getApi().changeView('listMonth');
            this.isHoverInEvent = false
          }

        }


      },

    },
    titleView:{
      immediate:true,
      handler(value){
        nextTick(()=>{
          if(value !== ''){
            if (this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ').length > 3 ){
              this.titleView = this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ')[1] + '  ' + this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ')[0] + '  ' + '-' + ' ' + this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ')[4] + '  ' + this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ')[3]


            }else {
              this.titleView = this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ')[1] + '  ' + this.$refs.fullCalendar.calendar.currentData.viewTitle.split(' ')[0]

            }

          }else{
            this.isDisable = true
          }
        })
      }
    },
    // isUserLeaveCalendarPage(val){
    //   if (val) {
    //     clearInterval(this.intervalId)
    //   }
    // },
    privateRoomName:{
      immediate: true,
      handler(val) {
        if (!val) {
          this.createSessionDropDownItems.splice(1,1)
        }
      }
    },
    userRole:{
      immediate:true,
      deep: true,
      handler(val){
        if (val.length < 2 ||  val.length > 1 && (val[0] !== 'ROLE_ADMIN' && val[1] !== 'ROLE_SECRETARY' && val[1] !== 'ROLE_ADMIN' && val[0] !== 'ROLE_SECRETARY')){
          this.createSessionDropDownItems.splice(0,1)
        }
      }
    }
  },
  methods:{
    // getAllPollings() {
    //   this.allPollings = [];
    //   this.resultQuestion= [];
    //   this.restClientPoll
    //       .getAllResult(this.meetingDataObject.id)
    //       .then((response) => {
    //         this.allPollings = response;
    //         if(response) {
    //           for (const el of response) {
    //             this.resultQuestion.push({ label: el.body,pollingId: el.pollingId,isOptional: el.isOptional });
    //           }
    //         }
    //
    //       })
    //       .catch((error) => {
    //         this.isPassedThreeSeconds = true
    //         this.isGetResult = false
    //         console.error(error);
    //       })
    //       .finally(() => {});
    // },
    DownloadPdf(data) {
      this.restClientProceedings
          .getResultInPDF(data.id)
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
            link.setAttribute("download", `${data.meetingName}` + ' ' + `${data.proceedingsNumber}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {});
    },
    eventContentMethod(arg){
      let italicEl = document.createElement('i')
      if (arg.view.type === 'timeGridWeek' || arg.view.type === 'timeGridDay') {
        if (arg.event.extendedProps?.tagColor && !arg.event.extendedProps.isWebinar){
          switch (arg.event.extendedProps.tagColor){
            case 1:
              italicEl.innerHTML = `<div class="event-content-container">${arg.event.extendedProps.title}</div> <div class="event-content-container">${ arg.event.extendedProps.meetingType === 0 ?   arg.event.extendedProps.firstNameManger + ' ' + arg.event.extendedProps.lastNameManager + ' '  + '(مدیر)' : this.$store.getters.t('without-moderator') }</div> <div v-if="true" class="event-content-time">${arg.event.extendedProps.toSchd.split(' ')[1]  + ' - '  + arg.event.extendedProps.fromSchd.split(' ')[1]}</div>`
              break;
            case 2:
              italicEl.innerHTML = `<div class="event-content-container">*****</div>  <div v-if="true" class="event-content-time">${arg.event.extendedProps.toSchd.split(' ')[1]  + ' - '  + arg.event.extendedProps.fromSchd.split(' ')[1]}</div> <div  class="eventConfidentialClass-tag">${arg.event.extendedProps?.tagName}</div>`
              break;
            case 3:
              italicEl.innerHTML = `<div class="event-content-container">${arg.event.extendedProps.title}</div> <div class="event-content-container">${ arg.event.extendedProps.meetingType === 0 ?   arg.event.extendedProps.firstNameManger + ' ' + arg.event.extendedProps.lastNameManager + ' '  + '(مدیر)' : this.$store.getters.t('without-moderator') }</div> <div v-if="true" class="event-content-time">${arg.event.extendedProps.toSchd.split(' ')[1]  + ' - '  + arg.event.extendedProps.fromSchd.split(' ')[1]}</div> <div  class="eventImportantClass-tag">${arg.event.extendedProps?.tagName}</div>`
              break;
            case 4:
              italicEl.innerHTML = `<div class="event-content-container">${arg.event.extendedProps.title}</div> <div class="event-content-container">${ arg.event.extendedProps.meetingType === 0 ?   arg.event.extendedProps.firstNameManger + ' ' + arg.event.extendedProps.lastNameManager + ' '  + '(مدیر)' : this.$store.getters.t('without-moderator') }</div> <div v-if="true" class="event-content-time">${arg.event.extendedProps.toSchd.split(' ')[1]  + ' - '  + arg.event.extendedProps.fromSchd.split(' ')[1]}</div> <div  class="eventCustomGreenClass-tag">${arg.event.extendedProps?.tagName}</div>`
              break;
            case 5:
              italicEl.innerHTML = `<div class="event-content-container">${arg.event.extendedProps.title}</div> <div class="event-content-container">${ arg.event.extendedProps.meetingType === 0 ?   arg.event.extendedProps.firstNameManger + ' ' + arg.event.extendedProps.lastNameManager + ' '  + '(مدیر)' : this.$store.getters.t('without-moderator') }</div> <div v-if="true" class="event-content-time">${arg.event.extendedProps.toSchd.split(' ')[1]  + ' - '  + arg.event.extendedProps.fromSchd.split(' ')[1]}</div> <div  class="eventCustomOrangeClass-tag">${arg.event.extendedProps?.tagName}</div>`
              break;
            case 6:
              italicEl.innerHTML = `<div class="event-content-container">${arg.event.extendedProps.title}</div> <div class="event-content-container">${ arg.event.extendedProps.meetingType === 0 ?   arg.event.extendedProps.firstNameManger + ' ' + arg.event.extendedProps.lastNameManager + ' '  + '(مدیر)' : this.$store.getters.t('without-moderator') }</div> <div v-if="true" class="event-content-time">${arg.event.extendedProps.toSchd.split(' ')[1]  + ' - '  + arg.event.extendedProps.fromSchd.split(' ')[1]}</div> <div  class="eventCustomPurpleClass-tag">${arg.event.extendedProps?.tagName}</div>`
              break;
            case 7:
              italicEl.innerHTML = `<div class="event-content-container">${arg.event.extendedProps.title}</div> <div class="event-content-container">${ arg.event.extendedProps.meetingType === 0 ?   arg.event.extendedProps.firstNameManger + ' ' + arg.event.extendedProps.lastNameManager + ' '  + '(مدیر)' : this.$store.getters.t('without-moderator') }</div> <div v-if="true" class="event-content-time">${arg.event.extendedProps.toSchd.split(' ')[1]  + ' - '  + arg.event.extendedProps.fromSchd.split(' ')[1]}</div> <div  class="eventCustomPinkClass-tag">${arg.event.extendedProps?.tagName}</div>`
              break;
            case 8:
              italicEl.innerHTML = `<div class="event-content-container">${arg.event.extendedProps.title}</div> <div class="event-content-container">${ arg.event.extendedProps.meetingType === 0 ?   arg.event.extendedProps.firstNameManger + ' ' + arg.event.extendedProps.lastNameManager + ' '  + '(مدیر)' : this.$store.getters.t('without-moderator') }</div> <div v-if="true" class="event-content-time">${arg.event.extendedProps.toSchd.split(' ')[1]  + ' - '  + arg.event.extendedProps.fromSchd.split(' ')[1]}</div> <div  class="eventCustomAquaClass-tag">${arg.event.extendedProps?.tagName}</div>`

              break;
          }

        }else if (arg.event.extendedProps.isWebinar) {
          italicEl.innerHTML = `<div class="event-content-container">${arg.event.extendedProps.title}</div> <div class="event-content-container">${ arg.event.extendedProps.meetingType === 0 ?   arg.event.extendedProps.firstNameManger + ' ' + arg.event.extendedProps.lastNameManager + ' '  + '(مدیر)' : this.$store.getters.t('without-moderator') }</div> <div v-if="true" class="event-content-time">${arg.event.extendedProps.toSchd.split(' ')[1]  + ' - '  + arg.event.extendedProps.fromSchd.split(' ')[1]}</div> <div  class="eventCustomWebinarClass-tag">${this.$store.getters.t('webinar')}</div>`
        }
        else {
          italicEl.innerHTML = `<div class="event-content-container">${arg.event.extendedProps.title}</div> <div class="event-content-container">${ arg.event.extendedProps.meetingType === 0 ?   arg.event.extendedProps.firstNameManger + ' ' + arg.event.extendedProps.lastNameManager + ' '  + '(مدیر)' : this.$store.getters.t('without-moderator') }</div> <div v-if="true" class="event-content-time">${arg.event.extendedProps.toSchd.split(' ')[1]  + ' - '  + arg.event.extendedProps.fromSchd.split(' ')[1]}</div>`
        }

      }else {
        italicEl.innerHTML = `<div class="event-content-container">${arg.event.extendedProps.title}</div> <div v-if="arg.event.extendedProps.firstNameManger" class="event-content-container">${ arg.event.extendedProps.meetingType === 0 ?   arg.event.extendedProps.firstNameManger + ' ' + arg.event.extendedProps.lastNameManager + ' '  + '(مدیر)' : this.$store.getters.t('without-moderator') }</div>`

      }



      let arrayOfDomNodes = [ italicEl ]
      return { domNodes: arrayOfDomNodes }

    },

    nowIndicator(){
      return {html :'<div class="now-indicator-time"></div><div class="now-indicator-time-right"></div>'}
    },
    // getAllResultProceedings(id) {
    //
    //   this.allProceedings = [];
    //   this.restClientProceedings
    //       .getAllResult(id)
    //       .then((response) => {
    //         if (response != null) {
    //           this.allProceedings = response;
    //         }
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       })
    //       .finally(() => {});
    // },
    editCreatedMeeting(){
      this.closeEventModal()
      this.isEventClicked = false
      const meetingData = {...this.meetingDataObject}
      this.eventBus.emit('edit-created-meeting',meetingData)
    },
    editCreatedWebinar(){
      this.closeEventModal()
      this.isEventClicked = false
      const meetingData = {...this.meetingDataObject}
      this.eventBus.emit('edit-created-webinar',meetingData)
    },
    joinToRoom(pinCode){
      // this.loginIsTriggered = true;
      // this.loadingModalIsVisible = true;
      // this.$store.dispatch("setStartTime", this.meetingDataObject.fromSchd);
      // this.$store.dispatch("setEndTime", this.meetingDataObject.toSchd);
      // restClient.iWantToJoin(this.meetingDataObject.id, this.meetingPinCode.toString())
      //     .then( async (response) => {
      //       let ownerOrMember = (+this.meetingDataObject.managerUserId === +this.$store.getters.userId) ? 'owner' : 'member'
      //       this.restClientAuth.getJitsiMeetingToken({
      //         name: '',
      //         avatar: '',
      //         email: '',
      //         affiliation: ownerOrMember,
      //         roomName: this.meetingDataObject.roomName,
      //         meetingId: this.meetingDataObject.id.toString()
      //
      //       })
      //           .then( (token) => {
      //             this.$emit('join-to-conference')
      //             this.$store.dispatch('setvrURL','https://mediair2.ancerz.com/')
      //             // this.$store.dispatch('setvrURL','vr8.shooka.com/')
      //             this.$store.dispatch("setPublishCount", response?.publishCount ? response.publishCount : 16);
      //             // if (!response.token) {
      //             //   // this.eventBus.emit("notification", {
      //             //   //   title: "پیام",
      //             //   //   type: "error",
      //             //   //   bodyText:
      //             //   //       "خطایی رخ داده است.لطفا دوباره تلاش کنید و در صورت برطرف نشدن مشکل با پشتیبانی تماس بگیرید.",
      //             //   //   time: 10000,
      //             //   // });
      //             //   this.loginIsTriggered = false;
      //             //   return;
      //             // }
      //             this.$store.dispatch(
      //                 "setRoomIdPublicRoom",
      //                 this.id.toString()
      //             );
      //             this.$store.dispatch("setSessionToken", response.token);
      //             this.amIModerator = +this.$store.getters.userId === +this.meetingDataObject.managerUserId;
      //             this.amIModeratorSubstitute = +this.$store.getters.userId === +this.meetingDataObject.substitutionUserId;
      //             this.$store.dispatch('setModeratorId', +this.meetingDataObject.managerUserId);
      //             this.$store.dispatch("setAmIModerator", this.amIModerator);
      //             this.$store.dispatch('setAmIModeratorSubstitute', this.amIModeratorSubstitute);
      //             this.$store.dispatch('setModeratorSubstituteId', +this.meetingDataObject.substitutionUserId);
      //             this.$store.dispatch("setSessionName", this.meetingDataObject.title);
      //             localStorage.setItem('room-Name', this.meetingDataObject.id.toString())
      //             localStorage.setItem("roomId", +this.meetingDataObject.id);
      //             this.$store.dispatch("setRoomId", this.meetingDataObject.id);
      //             this.$store.dispatch("setIsPublicUser", userStatus.isPublicUser);
      //             this.$store.dispatch("setScheduleId", this.meetingDataObject.id);
      //             this.$store.dispatch("setHasModerator", !!this.meetingDataObject.managerUserId);
      //             const hasModerator = !!this.meetingDataObject.managerUserId
      //             auth.setHasModerator(hasModerator)
      //             this.loadingModalIsVisible = false
      //             this.$router.push('/conference');
      //           }).catch((error) => {
      //         console.error(error)
      //         console.error(error)
      //       })
      //
      //
      //       // clearInterval(this.intervalId)
      //
      //     })
      //     .catch((error) => {
      //       this.loginIsTriggered = false;
      //       this.loadingModalIsVisible = false
      //       throw error;
      //     });


      this.loginIsTriggered = true;
      this.loadingModalIsVisible = true;
      this.$store.dispatch("setStartTime", this.meetingDataObject.fromSchd);
      this.$store.dispatch("setEndTime", this.meetingDataObject.toSchd);
      this.isEventClicked = false;
      this.$store.dispatch("setStartTime", this.meetingDataObject.fromSchd);
      this.$store.dispatch("setEndTime", this.meetingDataObject.toSchd);
      this.pinCodeMeeting = "";
      if (pinCode === true) {
        this.isMeetingHasPinCode = true;
      } else {
        this.loginIsTriggered = true;


        this.restClientControlmeeting.iWantToJoin(
            this.meetingDataObject.id,
            this.meetingPinCode.toString(),
        )
            .then((response) => {
              // if (!response.token) {
              //   emitter.emit("notification", {
              //     title: "پیام",
              //     type: "error",
              //     bodyText: this.$t("an-error-occurred"),
              //     time: 10000,
              //   });
              //   this.loginIsTriggered = false;
              //   return;
              // }
              this.$emit('join-to-conference')
              const hasSubModerator = response.substitutionUserId?.toString().trim()?.length > 0
              auth.setHasModerator(hasSubModerator)
              this.$store.dispatch("setHasModerator", hasSubModerator);
              auth.setVrAddress(response.vr)
              this.$store.dispatch("setModeratorId", response.moderatorUserId)
              this.$store.dispatch(
                  "setRoomIdPublicRoom",
                  this.meetingDataObject.toString()
              );
              // this.$store.dispatch("setSessionToken", response.token);
              // this.$store.dispatch("setSessionShareToken", response.shareToken);
              sessionStorage.setItem("publishCount", response.publishCount);
              if (this.meetingDataObject.presenters) {
                for (let i = 0; i < this.meetingDataObject.presenters.length; i++) {
                  if (
                      +this.$store.getters.userId === +this.meetingDataObject.presenters[i]
                  ) {
                    this.$store.dispatch("setAmIPresenter", true);
                  }
                }
              }
              this.amIModerator = +this.$store.getters.userId === +this.meetingDataObject.managerUserId;
              this.amISubstitutionModerator = +this.$store.getters.userId === +response.substitutionUserId;
              this.$store.dispatch("setAmIModerator", this.amIModerator);
              this.$store.dispatch("setAmIModeratorSubstitute", this.amISubstitutionModerator);
              this.$store.dispatch(
                  "setModeratorSubstituteId",
                  this.meetingDataObject.substitutionUserId
              );
              this.$store.dispatch("setSessionName", this.meetingDataObject.title);
              this.$store.dispatch("setRoomId", this.meetingDataObject.id);
              this.$store.dispatch("setIsPublicUser", userStatus.isPublicUser);
              // this.$store.dispatch("setScheduleId", this.meetingDataObject.id);
              this.$store.dispatch("setIsPrivateRoom", false)
              if (this.meetingDataObject.isWebinar) {
                this.$router.push({
                  name: "WebinarConference",
                  path: "/webinar",
                  params: {
                    isPublicUser: true,
                    myUserName: this.$store.getters.displayName,
                  },
                });
              } else {
                if (this.meetingDataObject.meetingType === 0){
                  this.$router.push({
                    name: "Conference",
                    path: "/conference",
                    params: {
                      isPublicUser: true,
                      myUserName: this.$store.getters.displayName,
                    },
                  });
                } else {
                  this.$router.push({
                    name: "Meeting",
                    path: "/meeting",
                    params: {
                      isPublicUser: true,
                      myUserName: this.$store.getters.displayName,
                    },
                  });
                }

              }
            })
            .catch((error) => {
              this.loginIsTriggered = false;
              this.loginIsTriggered = false;
              throw error;
            });
      }










    },
    // joinToSession (pinCode) {
    //   this.isEventClicked = false
    //   this.$store.dispatch("setStartTime", this.meetingDataObject.fromSchd)
    //   this.$store.dispatch("setEndTime", this.meetingDataObject.toSchd)
    //   this.pinCodeMeeting = ''
    //   if (pinCode === true) {
    //     this.isMeetingHasPinCode = true
    //   } else {
    //     this.loginIsTriggered = true;
    //     restClient.iWantToJoin(this.meetingDataObject.id, this.meetingPinCode.toString())
    //         .then((response) => {
    //           if (!response.token) {
    //             this.eventBus.emit("notification", {
    //               title: "پیام",
    //               type: "error",
    //               bodyText: this.$store.getters.t("an-error-occurred"),
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
    //           // this.$store.dispatch("setSessionShareToken", response.shareToken);
    //
    //           if (this.meetingDataObject.presenters) {
    //
    //             for (let i = 0; i < this.meetingDataObject.presenters.length; i++) {
    //               if (+this.$store.getters.userId === +this.meetingDataObject.presenters[i]) {
    //                 console.error('setAmIPresenter')
    //                 this.$store.dispatch('setAmIPresenter', true)
    //               }
    //             }
    //           }
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
    //           if (this.meetingDataObject.isWebinar) {
    //             this.$router.push({
    //               name: "WebinarConference",
    //               path: "/webinar",
    //               params: {
    //                 isPublicUser: true,
    //                 myUserName: this.$store.getters.displayName,
    //               },
    //             });
    //           } else {
    //             this.$router.push({
    //               name: "Conference",
    //               path: "/conference",
    //               params: {
    //                 isPublicUser: true,
    //                 myUserName: this.$store.getters.displayName,
    //               },
    //             });
    //           }
    //
    //
    //         })
    //         .catch((error) => {
    //           throw error;
    //         });
    //   }
    // },
    headerHook(arg){
      const enDate = momentjs(arg.date.toDateString()).format('YYYY/MM/DD')
      let faDate = momentJalali(enDate, 'YYYY/MM/DD').format('jYYYY/jMM/jD').split('/')
      let moment=null;
      let isHoliday = null;
      if(this.$i18n.locale === 'fa'){
        moment = momentJalali(enDate, 'YYYY/MM/DD').format('jYYYY/jMM/jDD')
        isHoliday =  momentJalali(moment,'jYYYY/jMM/jDD').isHoliday()
      }else {
        moment = enDate
        // isHoliday =  momentjs(enDate,'YYYY/MM/DD').isHoliday()
      }
      let subString='';
      if(this.$i18n.locale === 'fa' && ( (this.selectedView.label === this.$store.getters.t('day-view')) || (this.selectedView.label === this.$store.getters.t('week-view')) ||this.selectedView.label === this.$store.getters.t('month-view'))){
        subString = arg.text.substring(0, arg.text.length - 1 );
      }else{
        subString = arg.text.substring(0, arg.text.length);

      }

      const arr = subString.split(" ");
      let text;
      if(arg.isToday){
        this.numberOfClicked = 0
        if(arg.view.type === 'dayGridMonth' ){
          text = { html: `<div class="text-header"> ${arr[0]} <div>`}

        }else if (arg.view.type === 'listMonth'){
          text = { html: `<div class="text-header-today"> ${arr[0]} </div><div class="number-today-container" ><span class="number-today-month">${arr[1]}</span></div>`}
        }else{
          if(arr.length === 2){
            text = { html: `<div class="text-header-today"> ${arr[0]} </div><div class="number-today-container" ><span class="number-today">${arr[1]}</span></div>`}
          }else {
            text = { html: `<div class="text-header-today"> ${arr[0]} </div><div class="number-today-container" ><span class="number-today">${faDate[2]}</span></div>`}
          }


        }
      }else if (isHoliday || (arg.dow === 5 )){
        for(let el of this.calendarOptions.businessHours){
          let index = el.daysOfWeek.findIndex((element)=>{
            return  element == arg.dow
          })
          if(index !== -1){
            el.daysOfWeek.splice(index,1)
          }
        }
        if(arg.view.type === 'dayGridMonth' ){
          text = { html: `<div class="text-header"> ${arr[0]} <div>`}

        }else if (arg.view.type === 'listMonth'){
          text = { html: `<div class="text-header-holiday"> ${arr[0]} </div><div class="number-today-container" ><span class="number-today-holiday">${arr[1]}</span></div>`}
        }else{
          if(arr.length === 2){
            text = { html: `<div class="text-header-holiday"> ${arr[0]} <div><div class="number-today-container"><span class="number-today-holiday">${arr[1]}</span><div>`}
          }else{
            text = { html: `<div class="text-header-holiday"> ${arr[0]} <div><div class="number-today-container"><span class="number-today-holiday">${faDate[2]}</span><div>`}
          }


        }

      }
      else{

        if(arg.view.type === 'listMonth' ){

          // text = { html: `<div class="text-header"> ${arr[0]} <div>`}
          text = { html: `<div class="text-header"> ${arr[0]} <div><div class="number-day">${arr[1]}<div>`}
        }else{
          if(arr.length === 2){

            text = { html: `<div class="text-header"> ${arr[0]} <div><div class="number-day">${arr[1]}<div>`}
          }else{

            text = { html: `<div class="text-header"> ${arr[0]} <div><div class="number-day">${faDate[2]}<div>`}
          }


        }
      }
      if (this.selectedView.label === this.$store.getters.t('month-view')){
        text = { html: `<div class="text-header"> ${arr[0]} <div>`}
      }

      return text
    },

    dontDisappearPopUp(){
      // this.isHoverInEvent = true
      this.isHoverToSummery = true

    },
    disappearPopUp(){
      this.isHoverToSummery = false
      // this.isHoverInEvent = false
      // this.isGreaterThanDay=false
      // this.isGreaterThanWeek = false
      // this.isGreaterThanMonth = false

    },
    clickToEvent(info){
      this.isHoverInEvent = false
      // this.restClientInviteMembers
      //     .getInvitedUsersPublicRoom(info.event.extendedProps.id)
      //     .then((data) => {
      //       this.invitedMembersArray = data;
      //       console.error(data)
      //     }).catch((error)=>{
      //       console.error(error)
      // });


      this.editMeeting = false
      this.goMeeting = false
      this.isAfter = momentjs(new Date()).isAfter(info.event.start)
      this.isPast = momentjs(new Date()).isBefore(info.event.end)
      this.isEnd = momentjs(new Date()).isAfter(info.event.end)
      if(this.isAfter && this.isPast){
        this.goMeeting = true
        this.isMeetingEditable = true
        this.isMeetingDeletable = false
      }else if (!this.isAfter){
        this.goMeeting = false
        this.isMeetingEditable = true
        this.isMeetingDeletable = true
        this.eventBus.on('invited-members-for-edit',(data)=>{
          this.meetingData = data
        })
        this.editMeeting = true
      }else if (this.isEnd) {
        this.goMeeting = false
        this.isMeetingEditable = false
        this.isMeetingDeletable = false
      }
      // this.isGreaterThanDay=false
      // this.isGreaterThanWeek = false
      // this.isGreaterThanMonth = false
      this.meetingDataObject = info.event.extendedProps
      this.isMouseEnteredInPopUP = false
// const promises = []
//         this.allProceedings = [];
//         this.allPollings = [];
      this.resultQuestion= [];

      // Promise.allSettled([  this.restClientPoll.getAllResult(this.meetingDataObject.id ), this.restClientProceedings.getAllResult(this.meetingDataObject.id)]).then((values) => {
      //   if ( values[1].value != null &&  values[1].status === "fulfilled") {
      //     this.allProceedings =  values[1].value.reverse();
      //   }
      //   if ( values[0].value != null && values[0].status === "fulfilled") {
      //     this.allPollings = values[0].value.reverse();
      //     for (const el of  this.allPollings) {
      //       this.resultQuestion.push({ label: el.body,pollingId: el.pollingId,isOptional: el.isOptional });
      //     }
      //   }
      //   this.isEventClicked = true
      //
      // }).catch((err)=>{
      //   console.error(err);
      //   this.isEventClicked = true
      // });
      // Promise.allSettled(promises).
      // then((results) =>{
      //   results.forEach((result) => console.error(result.status))
      //   this.isEventClicked = true
      // } );

      // setTimeout(()=>{
      //
      // },1000)

      this.isEventClicked = true



    },
    clickToPopOverList(info){
      this.meetingDataObject = info
      this.isMouseEnteredInPopUP = false
// const promises = []
//       this.allProceedings = [];
//       this.allPollings = [];
      this.resultQuestion= [];

      // Promise.allSettled([  this.restClientPoll.getAllResult(this.meetingDataObject.id ), this.restClientProceedings.getAllResult(this.meetingDataObject.id)]).then((values) => {
      //   if ( values[1].value != null &&  values[1].status === "fulfilled") {
      //     this.allProceedings =  values[1].value.reverse();
      //   }
      //   if ( values[0].value != null && values[0].status === "fulfilled") {
      //     this.allPollings = values[0].value.reverse();
      //     for (const el of  this.allPollings) {
      //       this.resultQuestion.push({ label: el.body,pollingId: el.pollingId,isOptional: el.isOptional });
      //     }
      //   }
      //   this.isEventClicked = true
      //
      // }).catch((err)=>{
      //   console.error(err);
      //   this.isEventClicked = true
      // });
      this.isEventClicked = true
    },
    closeEventModal(){
      this.isEventClicked = false
    },
    hoverInEventToShowDetails(info){
      this.eventId = info.event.id
      function padTo2Digits(num,type) {

        if( type === "minutes" && +num.toString().padStart(2, '0').split('')[1] < 9){
          const array =  num.toString().padStart(2, '0').split('')
          const number =   parseInt(array[1]) + 1
          array[1] = number
          return array.join('')
        }else{
          return num.toString().padStart(2, '0');
        }

      }
      // const eventDate = (new Intl.DateTimeFormat('fa-IR', {dateStyle: 'full', timeStyle: 'long'}).format(new Date(info.event.extendedProps.createdDate))).toString()
      if (this.selectedView.label === this.$store.getters.t('week-view') || this.selectedView.label === this.$store.getters.t('month-view') || this.isMobile){
        this.meetingDataObject = info.event.extendedProps
        // this.meetingDataObject = {...info.event.extendedProps, eventDay:  eventDate.split(' ')[2], eventDayName:  eventDate.split(' ')[3],eventMonth: eventDate.split(' ')[1]  }
        this.goMeeting = false
        if (!this.isMobile){
          this.isHoverInEvent = true
        }
        restClientInviteMembers
            .getInvitedUsersPublicRoom(info.event.id)
            .then((data) => {
              // this.$store.dispatch('setParticipants', data);
              this.invitedMembers = data;
              this.eventBus.emit('get-invited-members',data)
            });

        const eventHeader = info.event.title.split('\n\n')
        this.eventTitle = eventHeader[0]
        this.eventModerator = eventHeader[1]
        this.meetingId = info.event.id
        this.isAfter = momentjs(new Date()).isAfter(info.event.start)
        this.isPast = momentjs(new Date()).isBefore(info.event.end)

        let milliseconds = 0
        if(this.isAfter && this.isPast){
          milliseconds = momentjs(new Date()).diff(momentjs(info.event.start))
          this.goMeeting = true
          this.timeLeftText = this.$store.getters.t('time-passed-meeting-start')
          this.isMeetingStarted = false
          this.isMeetingEnded = false
        }
        else if(!this.isAfter && this.isPast){
          this.timeLeftText = this.$store.getters.t('time-left-meeting-start')
          milliseconds = momentjs(info.event.start).diff(momentjs(new Date()))
          this.isMeetingStarted = true
          this.isMeetingEnded = false
        }else if(this.isAfter && !this.isPast){
          milliseconds = momentjs(new Date()).diff(momentjs(info.event.end))
          this.isMeetingStarted = true
          this.isMeetingEnded = true
          this.timeLeftText = this.$store.getters.t('time-passed-meeting-end')
        }

        let seconds = Math.floor(milliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        seconds = seconds % 60;
        minutes = minutes % 60;
        let day = Math.floor(hours / 24);
        let week = Math.floor(day / 7);
        let month = Math.floor(day / 30);
        if(hours < 24){

          this.timeLeft = `${padTo2Digits(hours,'hours')}:${padTo2Digits(minutes,'minutes')}`
        }else if ( day >=1 && day < 7){

          this.isGreaterThanDay =true
          this.isGreaterThanWeek = false
          this.isGreaterThanMonth = false
          this.timeLeft =  day
        }else if (6 < day && day < 30){

          this.isGreaterThanWeek = true
          this.isGreaterThanDay =false
          this.isGreaterThanMonth = false
          this.timeLeft = week
        }else{

          this.isGreaterThanWeek = false
          this.isGreaterThanDay =false
          this.isGreaterThanMonth = true
          this.timeLeft = month
        }


        this.time = info.event.start.toTimeString().substring(0, 5) + '  ' + '-' + '  ' + info.event.end.toTimeString().substring(0, 5)
        if(info.jsEvent.target.getBoundingClientRect().left > 291){
          this.leftOfScreen =info.jsEvent.target.getBoundingClientRect().left - 240 + "px"
          this.isSummeryLeft = true
        }else {
          this.leftOfScreen =info.jsEvent.target.getBoundingClientRect().right + "px"
          this.isSummeryLeft = false
        }
        if( window.innerHeight - info.jsEvent.clientY  > 260){
          this.isSummeryTop = true
          this.topOfScreen =info.jsEvent.clientY  - 45 + "px"
        }else {
          this.isSummeryTop = false
          this.topOfScreen =info.jsEvent.clientY -250  + "px"
        }
      }

    },
    mouseLeaveFromEvent(){
      this.isHoverInEvent = false
      setTimeout(()=>{
        if (this.isHoverToSummery === false && this.isHoverInEvent === false){
          this.isGreaterThanDay=false
          this.isGreaterThanWeek = false
          this.isGreaterThanMonth = false
        }
      },0)
    },

    clickToNextDate(){
      this.numberOfClicked += 1
      this.$refs.fullCalendar.getApi().next();
      nextTick(()=>{
        this.titleView = this.$refs.fullCalendar.calendar.currentData.viewTitle
        this.calendarOptions.businessHours =  [
          {
            daysOfWeek: [ 0,1,2,3,6],

            startTime: '7:00',
            endTime: '18:00', },
          {
            daysOfWeek: [ 4],

            startTime: '7:00',
            endTime: '14:00',
          }
        ]
      })

    },
    clickToPrevDate(){
      this.$refs.fullCalendar?.getApi()?.prev();
      this.numberOfClicked -= 1
      nextTick(()=>{
        this.calendarOptions.businessHours =  [
          {
            daysOfWeek: [ 0,1,2,3,6],

            startTime: '7:00',
            endTime: '18:00', },
          {
            daysOfWeek: [ 4],

            startTime: '7:00',
            endTime: '14:00',
          }
        ]
        this.titleView = this.$refs.fullCalendar.calendar.currentData.viewTitle
      })
    },
    clickToDay(){
      this.$refs.fullCalendar.getApi().today()
      this.numberOfClicked = 0
      nextTick(()=>{
        this.calendarOptions.businessHours =  [
          {
            daysOfWeek: [ 0,1,2,3,6],

            startTime: '7:00',
            endTime: '18:00', },
          {
            daysOfWeek: [ 4],

            startTime: '7:00',
            endTime: '14:00',
          }
        ]
      })

    },
    getAll(){
      this.isSessionsLoaded = true
      this.restScheduleMeeting
          .getAll(this.datesInfo.range.from, this.datesInfo.range.to)
          .then((schedules) => {
            this.allMeetings = []
            this.calendarOptions.events = []
            this.allMeetings = schedules
            if((this.userRole[0] === 'ROLE_SECRETARY' || this.userRole[1] === 'ROLE_SECRETARY')){
              for(let i = 0; i < this.allMeetings.length; i++){
                this.isEventPast = (momentjs(momentJalali(this.allMeetings[i].toSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + this.allMeetings[i].toSchd.split(' ')[1]).diff(momentjs(new Date()),'minutes')) > 0
                if(this.allMeetings[i].meetingStatus !== "CANCELED") {
                  if (this.allMeetings[i].role === 'ROLE_SECRETARY' ){
                    this.calendarOptions.events.push({
                      id:this.allMeetings[i].id,
                      title:  this.allMeetings[i].title,
                      start: momentJalali(this.allMeetings[i].fromSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + this.allMeetings[i].fromSchd.split(' ')[1],
                      end: momentJalali(this.allMeetings[i].toSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + this.allMeetings[i].toSchd.split(' ')[1],
                      extendedProps: {...this.allMeetings[i],now: (event=== 'upcoming') ? true : false,isPast:this.isEventPast},
                      className:'myclass',
                      textColor:'black'
                    })
                  }
                }


              }
              this.isSessionsLoaded = false
            }else{
              for(let i = 0; i < this.allMeetings.length; i++){
                this.isEventPast = (momentjs(momentJalali(this.allMeetings[i].toSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + this.allMeetings[i].toSchd.split(' ')[1]).diff(momentjs(new Date()),'minutes')) > 0
                if(this.allMeetings[i].meetingStatus !== "CANCELED") {
                  this.calendarOptions.events.push({
                    id:this.allMeetings[i].id,
                    title: this.allMeetings[i].title,
                    start: momentJalali(this.allMeetings[i].fromSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + this.allMeetings[i].fromSchd.split(' ')[1],
                    end: momentJalali(this.allMeetings[i].toSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + this.allMeetings[i].toSchd.split(' ')[1],
                    extendedProps: {...this.allMeetings[i],now: (event=== 'upcoming') ? true : false,isPast:this.isEventPast},
                    className:'myclass',
                    textColor:'black'
                  })
                }


              }
              this.isSessionsLoaded = false
            }
            // for (let i = 0; i < schedules.length; i++) {
            //   if (
            //       this.dateHelper.isGreaterEqual(
            //           this.datesInfo.currentDate,
            //           schedules[i].toSchd
            //       )
            //   ) {
            //     this.meetings.past.data.push(schedules[i]);
            //   } else if (
            //       this.dateHelper.isGreaterEqual(
            //           this.datesInfo.currentDate,
            //           schedules[i].fromSchd
            //       ) &&
            //       this.dateHelper.isGreaterEqual(
            //           schedules[i].toSchd,
            //           this.datesInfo.currentDate
            //       )
            //   ) {
            //     this.meetings.upcoming.data.push(schedules[i]);
            //     // this.currentUpcomingSchd =
            //     //     this.meetings.upcoming[
            //     //         this.upcomingMeetingsSliderStartingIdx
            //     //         ];
            //   } else if (
            //       this.dateHelper.isGreaterEqual(
            //           schedules[i].fromSchd,
            //           this.datesInfo.currentDate
            //       ) &&
            //       this.dateHelper.isGreaterEqual(
            //           schedules[i].toSchd,
            //           this.datesInfo.currentDate
            //       )
            //   ) {
            //     this.meetings.future.data.push(schedules[i]);
            //   }
            // }
            // this.eventBus.emit('all-meetings', this.meetings)
            // this.isMeetingsLoaded = true;
          })
          .catch((err) => {
            this.allMeetings = []
            this.isSessionsLoaded = false
            console.log(err);
          });

    },
    cancelMeeting(id){
      this.closeEventModal()
      this.eventBus.emit('cancel-meeting',id)
    },
    searchEvents() {
      if (this.searchInputValue === '') {
        this.eventFound = false;
      }
      this.addedEvents = this.calendarOptions.events.filter((el) => {
        if (((el.title).includes(this.searchInputValue)) && this.searchInputValue.length !== 0) {
          return true
        }
      })
      if (this.addedEvents.length > 0) {
        this.eventFound = true;

        return this.addedEvents

      }
    },
    inputFocused() {
      this.isSearchInputFocused = true
    },
    inputBlurred() {
      this.isSearchInputFocused = false

    },
    openFoundEvent(event) {
      this.searchInputValue = ''
      this.addedEvents = []
      this.eventFound = false
      this.eventBus.emit('open-found-event', event)
    },
    clickToOpenSearchDetail(){
      this.isDetailSearchClicked = !this.isDetailSearchClicked
    },
    moreLinkClick(info){
      if(info.jsEvent.target.getBoundingClientRect().left > 291){
        this.leftOfScreenPopOver =info.jsEvent.target.getBoundingClientRect().left - 220 + "px"
        this.isPopOverLeft = true
      }else {
        this.leftOfScreenPopOver =info.jsEvent.target.getBoundingClientRect().right + "px"
        this.isPopOverLeft = false
      }
      if( window.innerHeight - info.jsEvent.clientY  > 260){
        this.isPopOverTop = true
        this.topOfScreenPopOver =info.jsEvent.clientY  - 85 + "px"
      }else {
        this.isPopOverTop = false
        this.topOfScreenPopOver =info.jsEvent.clientY -250  + "px"
      }
      this.allSegs = info.allSegs
      this.isMoreLinkClicked = true
    },
    closePopOver(){
      this.allSegs = []
      this.isMoreLinkClicked = false
    },
    getSelectedItem(item) {
      const selectedItem = this.createSessionDropDownItems.find(dropDownItem => dropDownItem.label === item);
      switch (selectedItem.label){
        case this.$store.getters.t("create-session-in-calendar"):
          this.eventBus.emit('create-session-in-calendar')
          break;
        case this.$store.getters.t("createPrivateMeeting"):
          this.eventBus.emit('createPrivateMeeting')
          break;
      }
      this.eventBus.emit('close-drop-down');
    },
    openCreateMeetingDropDown(){
      this.isCreatSessionDropDownOpen.flag = true
    },
    closeStartDatePicker() {
      this.showStartDatePicker = false
      this.showEndDatePicker = false
    },
    closeEndDatePicker() {
      this.showStartDatePicker = false
      this.showEndDatePicker = false
    },
    clickToShowDetail(id){
      const event = this.$refs.fullCalendar.getApi().getEventById(id)
      this.isAfter = momentjs(new Date()).isAfter(event.start)
      this.isPast = momentjs(new Date()).isBefore(event.end)
      this.isEnd = momentjs(new Date()).isAfter(event.end)
      if(this.isAfter && this.isPast){
        this.goMeeting = true
        this.isMeetingEditable = true
        this.isMeetingDeletable = false
      }else if (!this.isAfter){
        this.goMeeting = false
        this.isMeetingEditable = true
        this.isMeetingDeletable = true
        this.eventBus.on('invited-members-for-edit',(data)=>{
          this.meetingData = data
        })
        this.editMeeting = true
      }else if (this.isEnd) {
        this.goMeeting = false
        this.isMeetingEditable = false
        this.isMeetingDeletable = false
      }
      // this.isGreaterThanDay=false
      // this.isGreaterThanWeek = false
      // this.isGreaterThanMonth = false
      this.meetingDataObject = event.extendedProps
      this.isMouseEnteredInPopUP = false
// const promises = []
//       this.allProceedings = [];
//       this.allPollings = [];
      this.resultQuestion= [];

      // Promise.allSettled([  this.restClientPoll.getAllResult(this.meetingDataObject.id ), this.restClientProceedings.getAllResult(this.meetingDataObject.id)]).then((values) => {
      //   if ( values[1].value != null &&  values[1].status === "fulfilled") {
      //     this.allProceedings =  values[1].value.reverse();
      //   }
      //   if ( values[0].value != null && values[0].status === "fulfilled") {
      //     this.allPollings = values[0].value.reverse();
      //     for (const el of  this.allPollings) {
      //       this.resultQuestion.push({ label: el.body,pollingId: el.pollingId,isOptional: el.isOptional });
      //     }
      //   }
      //   this.isEventClicked = true
      //
      // }).catch((err)=>{
      //   console.error(err);
      //   this.isEventClicked = true
      // });
      this.isEventClicked = true
    },
    closeEventSummery(){
      this.isHoverInEvent = false
      this.isHoverToSummery = false
    }
  },

  mounted(){
    this.eventBus.on('resize-calendar',()=>{
      setTimeout(()=>{
        this.$refs.fullCalendar?.getApi()?.updateSize()
      },0)
    })

    new MiniDropDownHandler(this.$refs['mini-drop-down-container'], this.isCreatSessionDropDownOpen);
    nextTick(()=>{
      this.calendarOptions.initialView =  this.whichItem === this.$store.getters.t('sessions') ? 'listMonth': 'timeGridWeek'
      if (this.whichItem === this.$store.getters.t('sessions') ){
        this.$refs.fullCalendar.getApi().changeView('listMonth');
        this.selectedView = { label:this.$store.getters.t('month-list')}
        this.allMeetings = []
        this.getAll()
      }else if(!this.isMobile){
        this.$refs.fullCalendar.getApi().changeView('timeGridWeek');
        this.selectedView = { label:this.$store.getters.t('week-view')}
        this.allMeetings = []
      }else {

        this.$refs.fullCalendar.getApi().changeView('timeGridDay');
        this.selectedView = { label:this.$store.getters.t('day-view')}
        this.allMeetings = []
      }
      // if(this.isMobile){
      //   this.$refs.fullCalendar.getApi().changeView('timeGridDay');
      //   this.selectedView = { label:this.$store.getters.t('day-view')}
      // }

    })



    window.addEventListener('click',()=>{
      this.isHoverInEvent = false
      this.isGreaterThanDay=false
      this.isGreaterThanWeek = false
      this.isGreaterThanMonth = false
    })
    //
    this.eventBus.on('open-found-event',(event)=>{
      this.isGreaterThanDay=false
      this.isGreaterThanWeek = false
      this.isGreaterThanMonth = false
      this.goMeeting = false
      this.meetingDataObject = event
      this.isHoverInEvent = false
      this.isMouseEnteredInPopUP = false
      this.isEventClicked = true
      this.getAllResultProceedings(event.id)
    })
    if(this.isMobile===false) {
      this.viewList = [
        {
          label: this.$store.getters.t('day-view')
        },
        {
          label:this.$store.getters.t('week-view')
        },
        {
          label:this.$store.getters.t('month-view')
        },
        {
          label:this.$store.getters.t('day-list')
        },
        {
          label:this.$store.getters.t('month-list')
        },
      ]
      this.selectedView = { label:this.$store.getters.t('week-view')}
    }else{
      this.viewList = [
        {
          label: this.$store.getters.t('day-view')
        },
        {
          label: this.$store.getters.t('day-list')
        },
      ]
      this.selectedView = { label:this.$store.getters.t('day-view')}
    }
    this.calendarOptions.businessHours =  [
      {
        daysOfWeek: [ 0,1,2,3,6],

        startTime: '7:00',
        endTime: '18:00', },
      {
        daysOfWeek: [ 4],

        startTime: '7:00',
        endTime: '14:00',
      }
    ]


    // for(const event in this.events){
    //   this.calendarOptions.events.push(...this.events[event].map((eventObj)=> {
    //
    //     return {
    //       id:eventObj.id,
    //       title: eventObj.firstNameManger === null ? eventObj.title + '\n\n' + this.$store.getters.t('without-moderator') :  eventObj.title + '\n\n' + ((this.$i18n.locale === 'en' ? '(moderator)':''))  + eventObj.firstNameManger + eventObj.lastNameManager + (this.$i18n.locale === 'fa' ? '(مدیر)':''),
    //       start: momentJalali(eventObj.fromSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + eventObj.fromSchd.split(' ')[1],
    //       end: momentJalali(eventObj.toSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + eventObj.toSchd.split(' ')[1],
    //       extendedProps: {...eventObj,now: (event=== 'upcomingMeetings') ? true : false},
    //       className:'myclass',
    //       textColor:'black'
    //     }
    //   }))
    //
    // }
    if (this.whichItem !== this.$store.getters.t('sessions'))  {
      let eventDate = ''

      for(const event in this.events){

        if (event !== 'private'){
          this.calendarOptions.events.push(...this.events[event].data.map((eventObj)=> {
            const nowDate  = momentjs(new Date()).format('YYYY/MM/DD HH:mm')
            const startDate  = momentJalaali(eventObj.fromSchd, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm')
            const endDate = momentJalaali(eventObj.toSchd, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm')
            const isBetweenMetingTime = (momentjs(nowDate).isAfter(startDate) || momentjs(nowDate).isSame(startDate)) && momentjs(nowDate).isBefore(endDate)
            const isMeetingPast = momentjs(nowDate).isAfter(endDate)
            let className = 'eventUsualClass'
            let pastClassName = 'myclass-past'
            if (this.$i18n.locale !== 'en'){
              eventDate = (new Intl.DateTimeFormat('fa-IR', {dateStyle: 'full', timeStyle: 'long'}).format(new Date(eventObj.createdDate))).toString()
            }else {
              eventDate = (new Intl.DateTimeFormat('en-us', {dateStyle: 'full', timeStyle: 'long'}).format(new Date(eventObj.createdDate))).toString()
            }
            this.isEventPast = (momentjs(momentJalaali(eventObj.toSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + eventObj.toSchd.split(' ')[1]).diff(momentjs(new Date()),'minutes')) > 0
            return {
              id:eventObj.id,
              title: eventObj.title,
              start: momentJalaali(eventObj.fromSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + eventObj.fromSchd.split(' ')[1],
              end: momentJalaali(eventObj.toSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + eventObj.toSchd.split(' ')[1],
              extendedProps: {...eventObj,now: (event=== 'upcoming') ? true : false,isPast:this.isEventPast,eventDay:  eventDate.split(' ')[2], eventDayName:  eventDate.split(' ')[3],eventMonth: eventDate.split(' ')[1] ,eventTimeFrom: eventObj.fromSchd.split(' ')[1] ,eventTimeTo : eventObj.toSchd.split(' ')[1],tagName:eventObj?.meetingAttributesDto?.tagName,tagColor:eventObj?.meetingAttributesDto?.tagColor},
              className:this.isEventPast ? className : pastClassName,
              textColor:'white',
              color:isMeetingPast ? '#A6C4F6' : isBetweenMetingTime ? '#2AB459' : '#5392F2',
            }
          }))

        }

      }




      //
      //
      this.eventBus.on('all-meetings',()=>{
        let eventDate = ''
        this.calendarOptions.events = []
        for(const event in this.events){
          if (event !== 'private'){
            this.calendarOptions.events.push(...this.events[event].data.map((eventObj)=> {
              const nowDate  = momentjs(new Date()).format('YYYY/MM/DD HH:mm')
              const startDate  = momentJalaali(eventObj.fromSchd, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm')
              const endDate = momentJalaali(eventObj.toSchd, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm')
              const isBetweenMetingTime = (momentjs(nowDate).isAfter(startDate) || momentjs(nowDate).isSame(startDate)) && momentjs(nowDate).isBefore(endDate)
              const isMeetingPast = momentjs(nowDate).isAfter(endDate)

              // console.error(isBetweenMetingTime)
              // console.error(isMeetingPast)
              // console.error(nowDate)
              // console.error(endDate)
              let className = 'eventUsualClass'
              let pastClassName = 'myclass-past'
              if (this.$i18n.locale !== 'en'){
                eventDate = (new Intl.DateTimeFormat('fa-IR', {dateStyle: 'full', timeStyle: 'long'}).format(new Date(eventObj.createdDate))).toString()
              }else {
                eventDate = (new Intl.DateTimeFormat('en-us', {dateStyle: 'full', timeStyle: 'long'}).format(new Date(eventObj.createdDate))).toString()
              }
              this.isEventPast = (momentjs(momentJalaali(eventObj.toSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + eventObj.toSchd.split(' ')[1]).diff(momentjs(new Date()),'minutes')) > 0
              return {
                id:eventObj.id,
                title: eventObj.title,
                start: momentJalaali(eventObj.fromSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + eventObj.fromSchd.split(' ')[1],
                end: momentJalaali(eventObj.toSchd.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY-MM-DD') + ' ' + eventObj.toSchd.split(' ')[1],
                extendedProps: {...eventObj,now: (event=== 'upcoming') ? true : false,isPast:this.isEventPast,eventDay:  eventDate.split(' ')[2], eventDayName:  eventDate.split(' ')[3],eventMonth: eventDate.split(' ')[1] ,eventTimeFrom: eventObj.fromSchd.split(' ')[1] ,eventTimeTo : eventObj.toSchd.split(' ')[1],tagName:eventObj?.meetingAttributesDto?.tagName,tagColor:eventObj?.meetingAttributesDto?.tagColor},
                className:this.isEventPast ? className : pastClassName,
                textColor:'white',
                color:isMeetingPast ? '#A6C4F6' : isBetweenMetingTime ? '#2AB459' : '#5392F2',
              }
            }))
          }


        }


        // this.$refs.fullCalendar.getApi().render()

      })







    }




    // let data = localStorage.getItem(`${obj.roomId}:moderator-substitute`);
    // data = JSON.parse(data)
    // if (obj.end > data.exp) {
    // localStorage.removeItem(`${obj.roomId}:moderator-substitute`);
    // }




  }
}
</script>

<style>
.person-name--input{
  width: 100%;height: 3rem;background-color:#F6F6F7;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
}
.person-name--input:focus{
  outline: none;
  background-color: transparent;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
}
#custom-input-start {
  width: 13rem;
  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
  font-size: 1.2rem;
}

#custom-input-start:focus {
  outline: none;
}

#custom-input-end {
  width: 13rem;
  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
  font-size: 1.2rem;
}

#custom-input-end:focus {
  outline: none;
}
.cancel-btn-date-picker:hover {
  background-color: transparent;
}
.event-content-container{
  max-width:100%;
  margin-bottom: 1rem;
  text-align: right;
  overflow-wrap: break-word !important;
  overflow: hidden !important;
  white-space: pre-line !important;
  direction: rtl;
  padding-left: 0.1rem;
  font-size: 1.2rem;
}
.event-content-time{
  max-width: 100%;
  overflow-wrap: break-word !important;
  overflow: hidden !important;
  white-space: pre-line !important;
  direction: rtl;
  padding-left: 0.1rem;
}
/*.some-text {*/
/*  width: 10px;*/
/*  height: 10px;*/
/*  border-radius: 50%;*/
/*position: absolute;*/
/*  top: 0.1rem;*/
/*  left: -0.6rem;*/
/*  background-color: #68ff63;*/
/*  border: 0.1rem solid #17af40;*/

/*  -webkit-animation: beat .25s infinite alternate;*/
/*  -moz-animation: beat .25s infinite alternate;*/
/*  -ms-animation: beat .25s infinite alternate;*/
/*  -o-animation: beat .25s infinite alternate;*/
/*  animation: beat .25s infinite alternate;*/

/*  -webkit-transform-origin: center;*/
/*  -moz-transform-origin: center;*/
/*  -o-transform-origin: center;*/
/*  -ms-transform-origin: center;*/
/*  transform-origin: center;*/
/*}*/

/*@keyframes "beat" {*/
/*  to {*/
/*    -webkit-transform: scale(1.2);*/
/*    -moz-transform: scale(1.2);*/
/*    -o-transform: scale(1.2);*/
/*    -ms-transform: scale(1.2);*/
/*    transform: scale(1.2);*/
/*  }*/

/*}*/

/*@-moz-keyframes beat {*/
/*  to {*/
/*    -moz-transform: scale(1.2);*/
/*    transform: scale(1.2);*/
/*  }*/

/*}*/

/*@-webkit-keyframes "beat" {*/
/*  to {*/
/*    -webkit-transform: scale(1.2);*/
/*    transform: scale(1.2);*/
/*  }*/

/*}*/

/*@-ms-keyframes "beat" {*/
/*  to {*/
/*    -ms-transform: scale(1.2);*/
/*    transform: scale(1.2);*/
/*  }*/

/*}*/

/*@-o-keyframes "beat" {*/
/*  to {*/
/*    -o-transform: scale(1.2);*/
/*    transform: scale(1.2);*/
/*  }*/

/*}*/
.search-calendar-icon {
  position: absolute;
  right: 1rem;
  top: 1.3rem;
  width: 1.5rem;
}

.search-calendar-icon-ltr {
  position: absolute;
  left: 1rem;
  top: 1.3rem;
  width: 1.5rem;
}
.search-input-calendar {
  width: 37.3rem;
  height: 3.6rem;
  padding: 1.9rem 3rem 1.8rem 4.5rem;
  border-radius: 0.8rem;
  border: solid 1px transparent;
  direction: rtl;
}

.search-input-calendar-ltr {
  width: 37.3rem;
  height: 5rem;
  padding: 1.9rem 4.5rem 1.8rem 3rem;
  border-radius: 1rem;
  border: solid 1px #707070;
  direction: ltr;
}

.search-input-calendar::placeholder {
  color: #9E9EB2;
}

.search-input-calendar:focus {
  outline: none;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;
}

.search-input-calendar-ltr::placeholder {
  color: #9E9EB2;
}

.search-input-calendar-ltr:focus {
  outline: none;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;

}
.search-input-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
}

.found-events {
  position: absolute;
  width: 100%;
  height: auto;
  min-height: 7rem;
  max-height: 22rem;
  border-top: none;
  top: 3.7rem;
  z-index: 1009;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  background-color: white;
  -webkit-box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
}
.search-detail-events {
  position: absolute;
  width: 100%;
  height: auto;
  border-top: none;
  top: 3.7rem;
  z-index: 1009;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  background-color: white;
  -webkit-box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
  padding: 0 0.8rem;

}

.added-events {
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
  direction: rtl;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  border-top: 0.1rem solid #F6F6F7;
}
.detail-search--fragment{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.8rem;
}
.detail-search--fragment > div{
  width: 100%;
  height: 5rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 0.8rem;
}
.detail-search--fragment > div > span{
  width: 7rem;
  font-size: 1.2rem;
  color: #75758F;
  text-align: right;
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: #DCDADA;


}

::-webkit-scrollbar-thumb {
  background: #7A7A7A;
  border-radius: 12px;


}

::-webkit-scrollbar-track-piece {
  height: 20px;

}
.invited-users--container{
  width: 100%;
  height: 20.2rem;
  display: flex;
  flex-direction: column;
  margin-top: 0.7rem;
}
.invited-user-table{

}

.title-view-rtl{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
}
.title-view-ltr{
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}
.title-view-mobile{
  width: 60vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.title-view-text{
  margin-right:0.8rem;
  font-size: 1.3rem;
  text-align: right;
  width: max-content;
}
.next-prev-btn {
  display: flex;
  flex-direction: row;
}
.enter-button{
  width: 10.6rem;
  height: 3.2rem;
  border-radius: 1.2rem;
  box-shadow: 3px 3px 12px 0 rgb(0 0 0 / 16%);
  background-color: #8ec7c2;
  color: white;
  font-size: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  position: absolute;
  bottom: 0.8rem;
  right: 1rem;
}
.enter-button:hover{
  background-color: #1fe7d5;
}
.eventUsualClass{
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
}
.eventConfidentialClass{
  background: #444444;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
  color: #F2F2F2;
}
.eventConfidentialClass-tag{
  width: fit-content;
  padding: 0.2rem 0.8rem;
  background-color: #444444;
  color: white;
  border-radius: 2rem;
  font-weight: 700;
}
.eventPastConfidentialClass{
  background: #7c7b7b;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
  color: #F2F2F2;
}
.eventImportantClass{
  background: #DA0202;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
}
.eventImportantClass-tag{
  width: fit-content;
  padding: 0.2rem 0.8rem;
  color: white;
  background-color: #EC3737;
  border-radius: 2rem;
  font-weight: 700;
}
.eventPastImportantClass{
  background: #e7a6a6;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
}
.eventCustomGreenClass{
  background: #10CC72;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
  font-weight: 700;
}
.eventCustomGreenClass-tag{
  width: fit-content;
  padding: 0.2rem 0.8rem;
  background-color: #10CC72;
  color: white;
  border-radius: 2rem;
  font-weight: 700;
}
.eventPastCustomGreenClass{
  background: #afe0c8;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
}
.eventCustomOrangeClass{
  background: #EBA112;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
  font-weight: 700;
}
.eventCustomOrangeClass-tag{
  width: fit-content;
  padding: 0.2rem 0.8rem;
  background-color: #EBA112;
  color: white;
  border-radius: 2rem;
  font-weight: 700;
}
.eventPastCustomOrangeClass{
  background: #e8ce9c;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
}

.eventCustomPurpleClass{
  background: #923CE8;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
  font-weight: 700;
}
.eventCustomPurpleClass-tag{
  width: fit-content;
  padding: 0.2rem 0.8rem;
  background-color: #923CE8;
  color: white;
  border-radius: 2rem;
  font-weight: 700;
}
.eventPastCustomPurpleClass{
  background: #cfb2ec;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
}
.eventCustomPinkClass-tag{
  width: fit-content;
  padding: 0.2rem 0.8rem;
  background-color: #DA6BE3;
  color: white;
  border-radius: 2rem;
  font-weight: 700;
}
.eventCustomWebinarClass-tag{
  width: fit-content;
  padding: 0.2rem 0.8rem;
  background-color: white;
  color: #1B76FF;
  border-radius: 2rem;
  font-weight: 700;
  position: absolute;
  left: 0;
}
.eventCustomAquaClass{
  background: #6DD6DD;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
  font-weight: 700;
}
.eventCustomAquaClass-tag{
  width: fit-content;
  padding: 0.2rem 0.8rem;
  background-color: #6DD6DD;
  color: white;
  border-radius: 2rem;
  font-weight: 700;
}
.eventPastCustomAquaClass{
  background: rgba(195, 228, 231, 0.43);
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow: hidden !important;
  font-size: 1.1rem;
}
.myclass:hover{
  cursor: pointer;
}
.myclass-past{
  background: #A6C4F6;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow-y: hidden !important;
  font-size: 1.1rem;
}
.myclass2{
  background:blue;
  margin: 0 0.1rem;
  border-radius: 4px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.23);
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow-y: hidden !important;
  font-size: 1.1rem;

}
.myclass-sessions{
  background: transparent;
  margin: 0 0.1rem;
  border-radius: 4px;
  border: none;
  direction: rtl;
  padding: 0.2rem 1rem;
  overflow-y: hidden !important;
  font-size: 1.1rem;

}
.myclass-sessions:hover{
  cursor: pointer;
}
:root {
  --fc-list-event-dot-width: 10px;
  --fc-list-event-hover-bg-color: #5392F2 !important;
}
.no-event-class{
  font-size: 2rem;
  color: red;
}
.rowClass{
  font-size: 15px;
  position: relative;
  left: 3px;

}
.fc-today {
  background: red !important;
}
.mask{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  z-index: 99;
}
.curve-message{
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 15px solid #fff;
  border-bottom-left-radius:5px;
  transform: rotate(210deg);
  white-space: pre;
}

.fc-button {
  background-color: #5392F2 !important;
  color: white  !important;
  border: none !important;
}
.fc-button-active{
  background-color: #5392F2 !important;
  color: white  !important;
  border: 1px solid #5392F2 !important;
}
.fc-today-button{
  background-color: #5392F2!important;
  color: white  !important;
}
.fc-today-button:disabled{
  cursor: not-allowed;
}
.fc-toolbar-title{
  font-size: 20px !important;
  direction: ltr !important;
}
.fc-next-button{
  background-color: white !important;
  color: #5392F2  !important;
  border: none !important;
}
.fc-next-button :active{

  border: none !important;
}
.fc-prev-button{
  background-color: white !important;
  color: #5392F2  !important;
  border: none !important;
}
.fc-header-toolbar{
  display: none !important;
}
thead{
  height: 50px !important;
  border: none !important;
}
.number-day{
  margin: 10px 0 !important;
  font-size: 2rem;
}
.text-header-today{
  color:#5392F2 ;
  font-size: 15px ;
}
.text-header-holiday {
  color:rgb(245, 108, 108) ;
  font-size: 15px ;
}.text-header{
   color: black;
   font-size: 1.3rem;
 }
.number-today-container{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.number-today{
  border-radius: 50% ;
  width: 3.4rem ;
  height: 3.4rem ;
  display: flex ;
  justify-content: center ;
  align-items: center ;
  background-color:#5392F2 ;
  color: white ;
  margin-top: 0.6rem;
  font-size: 2rem;
}
.number-today-month{
  border-radius: 50% ;
  width: 3.4rem ;
  height: 3.4rem ;
  display: flex ;
  justify-content: center ;
  align-items: center ;
  color: #5392F2 ;
  margin-top: 0.6rem;
  font-size: 2rem;
}
.number-today-holiday{

  width: 30px ;
  height: 30px ;
  display: flex ;
  justify-content: center ;
  align-items: center ;
  color: red ;
  margin: 0.6rem;
  font-size: 2rem;
}

/* .fc .fc-scrollgrid table {
   border-top: none !important;
} */

table{
  border: none !important;
}
th{
  /* border-bottom: none !important; */
  border-top: none !important;
  border-left:1px solid #DCDADA !important;
}


/* .fc-col-header-cell{
   border: 1px solid #97b5ce !important;
   border-top: none !important;

} */
.fc .fc-timegrid-slot-label{
  vertical-align: top;
  /* border: none !important; */

}
/* .fc .fc-timegrid-slot-minor{
     border: 1px dotted #97b5ce !important;
     border-right: none !important;
} */



.fc-theme-standard th{
  border-right:none !important;
  border-bottom: none !important;

}
/*.fc-theme-standard th:last-child{*/
/*  border-left: none !important;*/
/*}*/
.fc-theme-standard td{
  border: 0.5px solid #DCDADA!important;
  border-right:none !important;
  border-bottom: 1px dotted #DCDADA !important;
}
/*.fc-theme-standard td:last-child{*/
/*  border-left: none !important;*/
/*}*/

.fc .fc-timegrid-slot-minor{
  border: 1px dotted #DCDADA !important;
  border-bottom: 1px solid #DCDADA !important;
  border-right: none !important;



}



/*::-webkit-scrollbar {*/
/*  width: 8px;*/


/*}*/

/*::-webkit-scrollbar-track {*/
/*  background: transparent;*/


/*}*/

/*::-webkit-scrollbar-thumb {*/
/*  background: rgb(170, 168, 168);*/
/*  border-radius: 12px;*/


/*}*/

/*::-webkit-scrollbar-track-piece {*/
/*  height: 20px;*/

/*}*/
.header-calendar-rtl{
  width: 100%;
  height: 8rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem 2.4rem;
  border-bottom: 0.1rem solid #DCDADA;
}
.header-calendar-rtl-first-child{
  width: fit-content;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
}
.header-calendar-ltr{
  width: 100%;
  height: 8rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem 2.4rem;
  gap: 0.8rem;
}
.header-calendar-ltr-first-child{
  width: fit-content;
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  align-items: center;
}

.arrow-span{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width:3rem;
  height: 3rem;
  margin: 0 1rem;
  cursor: pointer;
}
.arrow-span:hover{
  animation: arrow-span-hover .2s ease-out forwards;
}
@keyframes arrow-span-hover {

  to {
    transform: scale(1.4) ;
  }
}
.today--button{
  margin: 0 10px;
  height: 4rem;
  border-radius: 0.8rem;
  color: blue;
  border: transparent;
  background: #F6F6F7;
  cursor: pointer;
  padding: 0.8rem 1.6rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.today--button:disabled {
  cursor: not-allowed;
  color: #97b5ce;
}
.fc .fc-non-business{
  background-color: #F6F6F7 !important;
  opacity: 0.3;
}
.fc-event-time{
  text-align: left !important;
}
.fc-v-event .fc-event-title {
  overflow-wrap: break-word !important;
  overflow : hidden !important;
  white-space: pre-line !important;

}
/*.fc-event-title::after{*/
/*  content: '(مدیر)';*/
/*}*/

.now-indicator-time{
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #EC3737;
  position: absolute;
  left: -0.5px;
  top: -4px;

}
.now-indicator-time-right{
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #EC3737;
  position: absolute;
  right: -0.4px;
  top: -4px;
}
.fc .fc-timegrid-now-indicator-line{
  border-width: 1px 0 0 !important;
}
.fc-v-event .fc-event-title-container{
  flex-grow: 0;
  flex-shrink: 0;
  margin-bottom: 15px;

}
.fc-v-event .fc-event-main-frame {
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;

}
.event-information{
  display: flex;
  flex-direction: column;
  padding: 1rem;
  position:absolute;
  width:24rem;
  height:fit-content;
  z-index:100;
  box-shadow: 6px 6px 12px 0 rgba(0, 0, 0, 0.26);
  border-radius:15px;
  background-color: white;
  opacity: 1;
}


/*.event-information:nth-child(2){*/
/*  margin-bottom: 100px;*/
/*}*/

.fc-col-header-cell-cushion {
  width: 100% ;
  height: 100% ;
}
.fc .fc-daygrid-day.fc-day-today {
  background-color: #5392F2;

}
.fc .fc-timegrid-col.fc-day-today {
  background-color: transparent;
}
/*tr > td {*/
/*  height: 3em !important;*/
/*}*/
.rowClass{
  font-size: 1.2rem;
}
tr{
  height: 5rem !important;
}
.fc .fc-non-business
{
  background-color:  #9E9EB2 !important;
}
.fc-timegrid-now-indicator-arrow > div{
  display: none;
}

.fc-daygrid-event-harness a{
  color: black !important;
}
.fc-timegrid-event .fc-event-time {
  direction: ltr;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.fc  {
  height: 100vh !important;
}
.fc-media-screen{
  height: 100vh !important;
}
.fc-direction-rtl{
  height: 100vh !important;
}
.fc-theme-standard{
  height: 100vh !important;
}
.fc-scrollgrid-liquid  {
  height: 100vh !important;
}

.fc-direction-rtl .fc-timegrid-col-events {
  margin: 0 0.1rem;

}
.fc-timegrid-now-indicator-line ,.now-class , .fc-timegrid-now-indicator-container {
  border-color:  #EC3737;
}
.fc .fc-timegrid-now-indicator-line {
  border-color:  #EC3737;
}
/*.fc .fc-timegrid-now-indicator-arrow {*/
/*  position: absolute;*/
/*  z-index: 4;*/
/*  width: 0;*/
/*  height: 0;*/
/*  border-top: 6px solid transparent;*/
/*  border-right: 8px solid #FFA024;*/
/*  border-bottom: 6px solid transparent;*/
/*}*/
.fc .fc-daygrid-day.fc-day-today {
  background-color: transparent;
}
.fc-popover-body {
  display: none !important;
}
.fc-popover-header {
  display: none !important;
}

/*.fc-daygrid-day-events{*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*  gap: 0.4rem;*/
/*}*/
.fc-daygrid-day-top {
  height: 2rem !important;
}


</style>

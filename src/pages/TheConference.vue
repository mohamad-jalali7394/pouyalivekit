<template>
  <div style="height: 100vh;width: 100vw;display: flex;flex-direction: column;background-color: #292933;">
    <video v-if="isMyVideoStreamDisplayed" @mousedown="startSelfViewDragging" ref="myVideoStream" style="position: absolute;z-index: 15;width: 200px;height: 150px;object-fit: cover;border-radius: 1rem;cursor: grab" autoplay playsinline></video>
    <div style="height: calc(100% - 55px); width: 100%;position: relative;
  overflow: hidden;  display: flex;
  justify-content: space-between;
  align-items: start;" ref="conference">
      <div
          v-if="subscribedTracksList.length > 0"
          style="position: relative;height: 100%"
          :class="{
          'other-videos--normal':!isSideBarVisible || isMobile,
          'other-videos--normal-width-side-bar':isSideBarVisible && !isMobile ,
        }">
        <the-layout ref="layout" @remove-from-layout="removeFromLayout" :show-agenda-component="showAgendaComponent" :is-moderator-substitute-activated="isModeratorSubstituteActivated" :video-share-status="videoShareStatus" :is-moderator-maximize-active-speaker="isModeratorMaximizeActiveSpeaker" :camera-status="cameraStatus" :is-active-speaker-maximized="isActiveSpeakerMaximized" :layout-updated="layoutUpdated" :screen-share-track="screenShareTrack" :screen-size-changed="screenSizeChanged"  :layout-type="layoutType" :other-video-stream-height="otherVideoStreamHeight" :active-speaker-video-stream-height="activeSpeakerVideoStreamHeight" :class-mode="classMode" :pin-class-mode="pinClassMode"   :first-camera-ratio="firstCameraRatio" :camera-ratio="cameraRatio"    :layout-with="layoutWith"  :is-mobile="isMobile" :subscribed-tracks-list="subscribedTracksList" :side-bar-is-visible="isSideBarVisible" :is-shared-with-sidebar="isSharedWithSidebar" :is-shared="isScreenShared" :share-subscriber-name="shareSubscriberName" :is-moderator-accept="isModeratorAccept" name-font="" :active-speaker="activeSpeaker" :is-video-shared="isVideoShared" :video-share-subscriber-name="videoShareSubscriberName"></the-layout>
        <transition name="proceedingsNotification">
          <div v-if="showProceedingsNotification" class="proceedings-notification__container">
            <div>
              <span>{{ $store.getters.t('proceedings') }}</span>
              <img draggable="false" src="/img/close.svg" alt="not-loaded" style="cursor: pointer;width: 2.5rem" @click="showProceedings">
            </div>
            <div>
              {{ $store.getters.t('please-review-the-minutes-and-give-your-opinion') }}
            </div>

          </div>
        </transition>
        <transition name="proceedingsNotification">
          <div v-if="showStartingProceedingsNotification" class="proceedings-notification__container"
               @click="showProceedings">
            <div>
              <span>{{ $store.getters.t('proceedings') }}</span>
            </div>
            <div>
              {{ $store.getters.t('The-minutes-of-the-meeting-are-being-prepared') }}
            </div>
          </div>
        </transition>
      </div>
      <div v-if="isWebSocketConnected" :style="{height:(isControlPanelShowed || isMouseEnteredInControlMeeting) && !isMobile ? '100%' : '100%',padding:'0.5rem 0.5rem 0.5rem 0'}">
        <the-side-bar
            v-show="isSideBarVisible"
            :inside-component="sideBarInterior"
            :am-i-selected-moderator="false"
            :new-moderator-user-id="''"
            :new-sub-moderator-id="''"
            :sub-moderator="''"
            :side-bar-status="isSideBarVisible"
            :message-received="''"
            :side-bar-chat-interior="sideBarChatInterior"
            :am-i-moderator="false"
            :is-side-bar-visible="isSideBarVisible"
            :proceedings-allowed="proceedingsAllowed"
            :participants-in-my-chat-list="participantsInMyChatList"
            :all-public-chats="allPublicChats"
            :is-proceedings-started="isProceedingsStarted"
            :all-proceedings-paragraphs="allProceedingsParagraphs"
            :not-complete-paragraph-index="notCompleteParagraphIndex"
            :proceedings-secretary="proceedingsSecretary"
            :proceedings-created="isProceedingsCreated"
            :proceedings-number="proceedingsNumber"
            :is-proceedings-answered="isProceedingsAnswered"
            :is-confirmed-proceedings="isConfirmedProceedings"
            :is-proceedings-created="isProceedingsCreated"
            :proceedings-id="proceedingsId"
            :proceedings-date-created="proceedingsDateCreated"
            :all-optional-polling="allOptionalPolling"
            :all-descriptive-polling="allDescriptivePolling"
            :which-polling-tab-for-confirm="whichPollingTabForConfirm"
            :not-answered-descriptive-polling="notAnsweredDescriptivePolling"
            :not-answered-optional-polling="notAnsweredOptionalPolling"
            :is-moderator-substitute-activated="isModeratorSubstituteActivated"
            :proceedings-creator-user-id="proceedingsCreatorUserId"
            :invited-photos="invitedPhotos"
            :am-i-guest-user="amIGuestUser"
            @close-side-bar="closeConferenceSideBar"
            @choose-chat-or-proceedings="chooseChatOrProceedings"
            @send-chat="sendChat"
            @receive-chat="receiveChat"
            @receive-public-chat="receivePublicChat"
        ></the-side-bar>
      </div>
    </div>
    <div v-if="isWebSocketConnected"  :class="(isControlPanelShowed ||( isMouseEnteredInControlMeeting && !isMobile)) ? 'control-meeting-actions__container' : 'control-meeting-actions__container-hide'" @mouseenter="isMouseEnteredInControlMeeting = true" @mouseleave="isMouseEnteredInControlMeeting = false">
      <control-meeting-actions
          :am-i-moderator="$store.getters.amIModerator"
          :am-i-share="false"
          :board-sharing-allowed="false"
          :camera-control-allowed="cameraControlAllowed"
          :camera-status="cameraStatus"
          :descriptive-polling="[]"
          :hand-status="handStatus"
          :is-board-activated="false"
          :is-enable-download-pdf="false"
          :is-meeting-result-open="false"
          :is-message-received="false"
          :is-mobile="isMobile"
          :is-moderator-joined="moderator_joined"
          :is-p-d-f-sharing-enabled="false"
          :is-polling-open="false"
          :is-proceedings-open="false"
          :is-video-sharing-enabled="false"
          :list-of-pollings="[]"
          :list-of-proceedings="[]"
          :mic-control-allowed="micControlAllowed"
          :mic-status="micStatus"
          :pdf-sharing-allowed="false"
          :pdf-url="''"
          :proceedings-allowed="false"
          :screen-share-allowed="screenShareAllowed"
          :share-status="shareStatus"
          :side-bar-interior="sideBarInterior"
          :side-bar-is-visible="isSideBarVisible"
          :test-polling="[]"
          :video-sharing-allowed="false"
          :is-iphone="false"
          :am-i-selected-moderator="false"
          :waiting-hand-raise-participants="handRaiseBadge"
          :board-name="'sfsdf'"
          :room-is-block="false"
          :unread-private-chat-length="unreadPrivateChatLength"
          :unread-group-chat-length="unreadGroupChatLength"
          :proceedings-created="false"
          :is-proceedings-answered="isProceedingsAnswered"
          :is-proceedings-started="isProceedingsStarted"
          :current-layout-container-height="50"
          :all-polling="allPolling"
          :is-confirm-polling-open="false"
          :is-meeting-in-recording-mode="isMeetingInRecordingMode"
          :am-i-guest-user="amIGuestUser"
          :is-screen-touched="isScreenTouched"
          :is-my-video-stream-displayed="isMyVideoStreamDisplayed"
          :video-share-status="videoShareStatus"
          :is-screen-full-size="isScreenFullSize"
          :is-moderator-substitute-activated="isModeratorSubstituteActivated"
          @control-meeting-handler="controlMeetingHandler"
          @control-side-bar-handler="controlSideBarHandler"
          @control-more-options-handler="controlMoreOptionsHandler"
          @video-sharing-stat="openVideoSharingModalOrStopIt"
          @pdf-sharing-modal="openPDFSharingModal"
          @open-polling="openPolling"
          @open-confirmation-proceedings="openConfirmationProceedings"
          @open-pdf-sharing="openPdfSharing"
          @record-meeting-notification="showRecordBadge"
          @open-confirm-polling-modal="openConfirmPolling"
          @toggle-in-mobile="ToggleControlPanelInMobile"
      >
      </control-meeting-actions>
    </div>
  </div>

  <base-modal
      :open="isLoading"
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
  <base-modal
      :open="reconnectLoading"
      :is-loading="'isLoading'"
      is-blur="true"
      modal-color="transparent"
  >
    <template #modal-body>
      <base-loading-spinner size-ratio="1.2" spinner-color="#409EFF">
        <template #loading-content>
          <div class="loading__extra-content--text" style = "color: #409EFF">
            {{ $store.getters.t("please-wait-for-reconnecting") }}
          </div>
        </template>
      </base-loading-spinner>
    </template>
  </base-modal>
  <the-invitation
      v-if="(this.$store.getters.amIModerator || isModeratorSubstituteActivated) && isWebSocketConnected"
      v-show="isInvitationVisible"
      :is-open="isInvitationVisible"
      @close-invitation-component="closeInvitationComponent"
      @close-invitatoin="closeInvitationComponent"></the-invitation>
  <base-modal :open="false" is-blur="true">
    <template #modal-header>
      <div class="header-close-icon">
        <img draggable="false" src="/img/close.svg" @click="closeWaitingRoomModalInCall" style="cursor: pointer">
      </div>
    </template>
    <template #modal-body>
      <waiting-room  is-change-devices="yes"></waiting-room>
    </template>
    <template #modal-buttons>
      <base-button
          :button-inner-txt="$store.getters.t('close')"
          :continuous-params="['color=white', 'background-color=#1B76FF']"
          :is-active="isEntranceButtonActive"
          :style-types="[ 'entrance--button']"
          @click="closeWaitingRoomModalInCall"
      ></base-button>
    </template>
  </base-modal>
  <base-modal  :open="isRecordModalopend">
    <template #modal-header>
      <div class="header-close-icon">
        <img draggable="false" src="/img/close.svg" @click="isRecordModalopend = false" style="cursor: pointer">
      </div>
    </template>
    <template #modal-body>
      <div style="width: 40rem;display: flex;justify-content: space-between; height: 5rem">
        <span v-if="!isClientRecordingStart" style="color: #1B76FF; cursor: pointer" @click="startClientRecording">{{ $t("client-recording") }}</span>
        <span v-else style="color: #EC3737; cursor: pointer" @click="stopClientRecording">{{ $t("stop_client_recording") }}</span>

        <span v-if="!$store.getters.egressId" style="color: #1B76FF; cursor: pointer" @click="startServerRecording">{{ $t("server-recording") }}</span>
        <span v-else style="color: #EC3737; cursor: pointer" @click="stopServerRecording">{{ $t("stop_server_recording") }}</span>

      </div>
    </template>
    <template #modal-buttons>
      <base-button
          :button-inner-txt="$store.getters.t('close')"
          :continuous-params="['color=white', 'background-color=#EC3737']"
          :is-active="true"
          :style-types="[ 'entrance--button']"
          @click="isRecordModalopend = false"
      ></base-button>
    </template>
  </base-modal>
  <notifications
      v-if="this.$i18n.locale === 'fa' && !isMobile"
      group="notification"
      position="bottom right"
      style="direction: rtl; right: 400px; bottom: 65px; cursor: pointer"
      width="350px"
  >
    <template #body="props">
      <div
          class="my-notification"
          style="margin-bottom: 6px"
          @click="
          OpenNotification(
            props.item.text,
            props.item.title,
            props.item.text.userId
          )
        "
      >
        <div style="width: 0.4rem;height: 80%;position: absolute;left: 0;top: 10%;border-radius: 0.8rem;background-color: #246fe5;z-index: 100000" ></div>
        <div style="font-weight: 700;display: flex;gap: 0.8rem;align-items: center">
          <svg  width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15ZM12.9933 7.88338C12.9355 7.38604 12.5128 7 12 7C11.4477 7 11 7.44772 11 8V12L11.0067 12.1166C11.0645 12.614 11.4872 13 12 13C12.5523 13 13 12.5523 13 12V8L12.9933 7.88338Z" fill="#246fe5"/>
          </svg>
          {{ props.item.title }}
        </div>
        <!--        <img draggable="false"-->
        <!--            :src="props.item.type"-->
        <!--            alt="not loaded"-->
        <!--            class="Chat__icon__notif"-->
        <!--        />-->
        <div style="display: flex;gap: 0.4rem">
          <span>شما یک </span>
          <span>{{
              props.item.title
            }}</span>
          <span v-if=" props.item.text?.label">
             از
            </span>
          <span
              v-if=" props.item.text?.label"
              style="
            color: blue;
            max-width: 75px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
          >{{ props.item.text.label }}</span
          >
          <span>دارید</span>
        </div>

      </div>
    </template>
  </notifications>
  <notifications
      v-else-if="this.$i18n.locale === 'fa' && isMobile"
      group="notification"
      position="bottom right"
      style="direction: rtl;bottom: 90%;left:50%;transform: translateX(-50%);cursor: pointer"
      width="350px"
  >
    <template #body="props">
      <div
          class="my-notification"
          style="margin-bottom: 6px"
          @click="
          OpenNotification(
            props.item.text,
            props.item.title,
            props.item.text.userId
          )
        "
      >
        <div/>
        <span style="margin-left: 0.2rem; margin-right: 0.5rem">شما یک </span>
        <span style="margin-left: 0.2rem; margin-right: 0.5rem">{{
            props.item.title
          }}</span>
        <span style="margin-left: 0.2rem"></span>
        <span
            style="
            color: blue;
            margin-left: 0.4rem;
            max-width: 75px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >{{ props.item.text.label }}</span
        >
        <span>دارید</span>
      </div>
    </template>
  </notifications>
  <notifications
      v-else
      group="notification"
      position="bottom right"
      style="direction: ltr; right: 400px; bottom: 65px; cursor: pointer"
      width="450px"
  >
    <template #body="props">
      <div
          class="my-notification"
          style="margin-bottom: 6px"
          @click="
          OpenNotification(
            props.item.text,
            props.item.title,
            props.item.text.userId
          )
        "
      >
        <div/>
        <span
            style="
            color: blue;
            margin: 0.2rem;
            max-width: 50px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >{{ props.item.text.label }}</span
        >
        <span>{{ props.item.title }}</span>
        <span style="margin-left: 0.2rem"></span>
        <span style="margin-right: 0.25rem">you have a</span>
        <img draggable="false"
             :src="props.item.type"
             alt="not loaded"
             class="Chat__icon__notif-en"
        />
      </div>
    </template>
  </notifications>
  <!--  <change-layout v-if="showChangeLayoutModal" :show-change-layout-modal="showChangeLayoutModal"-->
  <!--                 :layout-type="layoutType" @close-change-layout-modal="openChangeLayoutModal"-->
  <!--                 @change-layout="changeLayout"></change-layout>-->
  
  <base-modal :open="isWaitingRoomModalOpen" is-blur="true">
    <template #modal-header>
      <div class="header-close-icon__waiting-room">
        <div style="font-size: 1.6rem">{{$store.getters.t('waiting-room')}}</div>
        <img draggable="false" src="/img/close.svg" @click="closeWaitingRoomModal" style="cursor: pointer">
      </div>
    </template>
    <template #modal-body>
      <waiting-room is-change-devices="yes"></waiting-room>
    </template>
    <template #modal-buttons>
      <base-button
          :button-inner-txt="$store.getters.t('login')"
          :continuous-params="['color=white', 'background-color=#1B76FF']"
          :is-active="isEntranceButtonActive"
          :style-types="[ 'entrance--button']"
          @click="enterToRoom"
      ></base-button>
    </template>
  </base-modal>
  <base-modal :open="microphoneSettingModalIsVisible" is-blur="true">
    <template #modal-header>
      <div class="header-close-icon__waiting-room">
        <div style="font-size: 1.6rem">{{$store.getters.t('microphone-setting')}}</div>
        <img draggable="false" src="/img/close.svg" @click="closeMicrophoneSettingModal" style="cursor: pointer">
      </div>
    </template>
    <template #modal-body>
      <microphone-setting></microphone-setting>
    </template>
    <template #modal-buttons>
      <base-button
          :button-inner-txt="$store.getters.t('confirm')"
          :continuous-params="['color=white', 'background-color=#1B76FF']"
          :is-active="true"
          :style-types="[ 'entrance--button']"
          @click="confirmToChangeMic"
      ></base-button>
    </template>
  </base-modal>
  <base-modal :open="cameraSettingModalIsVisible" is-blur="true">
    <template #modal-header>
      <div class="header-close-icon__waiting-room" style="height: 2rem">
        <div style="font-size: 1.6rem">{{$store.getters.t('camera-setting')}}</div>
        <img draggable="false" src="/img/close.svg" @click="closeCameraSettingModal" style="cursor: pointer">
      </div>
    </template>
    <template #modal-body>
      <camera-setting></camera-setting>
    </template>
    <template #modal-buttons>
      <base-button
          :button-inner-txt="$store.getters.t('confirm')"
          :continuous-params="['color=white', 'background-color=#1B76FF']"
          :is-active="true"
          :style-types="[ 'entrance--button']"
          @click="confirmToChangeCamera"
      ></base-button>
    </template>
  </base-modal>
  <base-modal is-blur="true" :open="terminatePrivateMeeting">
    <template #modal-header>
      <div class="terminate__header-container">
        <div>
          <img
              src="/img/close.svg"
              alt="not loaded"
              @click="closeTerminateModal"
              style="cursor: pointer;width: 2rem"
          />
        </div>
        <div style="font-size: 1.6rem">{{ $t("do-you-terminate-meeting") }}</div>
      </div>
    </template>
    <template #modal-body>
      <div class="terminate__private--room">
        <span @click="terminateMeeting">{{ $t("terminate-meeting") }}</span>
        <span @click="leaveSession()">{{ $t("Leaving-the-meeting") }}</span>
      </div>
    </template>
  </base-modal>
  <input type="file" ref="VideoFileInput" @change="handleVideoFile" style="display: none"  accept="video/*,.mkv,.fiv,.avi,.mov,.wmv " />
</template>

<script>
import BaseModal from "@/components/UI/BaseModal.vue";
import BaseLoadingSpinner from "@/components/UI/BaseLoadingSpinner.vue";
import ControlMeetingActions from "@/components/ControlMeetingActions.vue";
import DetectMobile from "../utils/detectMobile";
// import momentJalaali from "moment-jalaali";
// import {nextTick} from "vue";
import RestClient from '@/api/restClient';
import entityTypes from '@/statics/entityTypes';
import {nextTick} from "vue";
import TheSideBar from "@/components/TheSideBar.vue";
import TheInvitation from "@/components/TheInvitation.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import WaitingRoom from "@/components/WaitingRoom.vue";
import WebSocketClient from "@/webSocketClient";
import {mapActions, mapGetters} from "vuex";
import {Notifications} from "@kyvg/vue3-notification";
// import ChangeLayout from "@/components/ChangeLayout.vue";
import config from "@/config";
import auth from "@/store/auth";
import TheLayout from "@/components/TheLayout.vue";
import momentJalali from 'moment-jalaali'
import {filmStripView} from "@/utils/filmStripView";
import {tileView} from "@/utils/tileView";
import {startCapture, stopCapture} from "@/utils/clientRecording"
import { setRecordingMicStatus } from "@/utils/clientRecording";

import {
  createLocalVideoTrack,
  createLocalAudioTrack,
  LocalVideoTrack,
  LocalAudioTrack,
  // RemoteParticipant,
  // RemoteTrack,
  // RemoteTrackPublication,
  // AccessToken,
  RoomEvent,
  Room,
} from 'livekit-client';

import MicrophoneSetting from "@/components/MicrophoneSetting.vue";
import CameraSetting from "@/components/CameraSetting.vue";
import throttle from 'lodash.throttle';
export default {
  name: "TheConference",
  components:{
    CameraSetting,
    MicrophoneSetting,
    TheLayout,
    Notifications,
    TheInvitation, TheSideBar, BaseLoadingSpinner, BaseModal, ControlMeetingActions,WaitingRoom, BaseButton},
  props:["isJitsiScriptAddedToHtml"],
  data(){
    return {
      isLoading: false,
      isSideBarVisible:false,
      restClientRoom: new RestClient(entityTypes.invite),
      meetingType: '',
      amIGuestUser: false,
      displayNameInput: '',
      restClientAuth: new RestClient(entityTypes.auth),
      sideBarInterior:'',
      sideBarChatInterior:'publicChat',
      proceedingsAllowed:false,
      participantsInMyChatList:[],
      allPublicChats:[],
      isProceedingsStarted:false,
      allProceedingsParagraphs:[],
      notCompleteParagraphIndex:null,
      proceedingsSecretary:null,
      isProceedingsCreated:false,
      proceedingsNumber:null,
      isProceedingsAnswered:false,
      isConfirmedProceedings:false,
      proceedingsId:null,
      proceedingsDateCreated:null,
      allOptionalPolling:[],
      allDescriptivePolling:[],
      whichPollingTabForConfirm:null,
      notAnsweredDescriptivePolling:0,
      notAnsweredOptionalPolling:0,
      isModeratorSubstituteActivated:false,
      proceedingsCreatorUserId:null,
      invitedPhotos:[],
      isControlPanelShowed:true,
      messagesArrayLength:0,
      messages: [],
      controlMeetingTimer:null,
      isMouseEnteredInControlMeeting: false,
      recordData:{},
      isMeetingInRecordingMode:false,
      isMyVideoMute: false,
      isMyAudioMute: true,
      amIShareMyScreen:false,
      isInvitationVisible:false,
      availableDevices:{},
      currentDevices:{},
       isWaitingRoomModalOpen:true,
      isRecordModalopend: false,
      browserSideRecording:'local',
      serverSideRecording:'file',
      recordingType: 'local',
      isUserJoinedTOMeeting: false,
      webSocketClient: null,
      amISubstitutionModerator:false,
      isPrivate:this.$store.getters.isPrivate,
      isWebSocketConnected:false,
      restClientControlMeeting: new RestClient(entityTypes.controlMeeting),
      handStatus:'not-set',
      shareStatus: false,
      screenShareAllowed:false,
      moderator_joined:false,
      isMobile: false,
      unreadGroupChatLength: 0,
      unreadPrivateChatLength: 0,
      chatWith: {label: this.$store.getters.t("all"), participantId: this.$store.getters.t("all")},
      handRaiseBadge:false,
      showChangeLayoutModal:false,
      layoutType: "filmStrip",
      listOfProceedings:[],
      isReconnecting: false,
      allOptionalPollingInLocalStorage:[],
      allDescriptivePollingInLocalStorage:[],
      notCompleteParagraphId:null,
      showStartingProceedingsNotification:false,
      showProceedingsNotification: false,
      editParagraphIndex:null,
      jitsiDomain : '',
      isIOS:false,
      restClientPrivate: new RestClient(entityTypes.privateRoom),
      isScreenTouched:false,
      showToggleButtonTimer:null,
      jitsiId:null,
      isDisplayNameRepeated: false,
      reconnectLoading:false,
      isVideoQualityModalOpened:false,
      qualityLevelZero:0,
      qualityLevel180:180,
      qualityLevel360:360,
      qualityLevel720:720,
      videoQulityLevel:180,
      isJoinToMeeting:false,
      isEntranceButtonActive:false,
      room: null,
      videoLocalTrack: null,
      audioLocalTrack: null,
      remoteTracksMap: new Map(),
      participantName: 'Participant' + Math.floor(Math.random() * 100),
      roomName: this.$store.getters.roomId,
      APPLICATION_SERVER_URL:'',
      LIVEKIT_URL: '',
      token: null,
      localTrack: null,
      subscribedTracksList: [],
      mySid: null,
      screenTrack: [],
      shareSubscriberName: null,
      trackArray: [],
      fullPublishListFromBackEnd: [],
      callIWantToJoin: 0,
      sub_moderator_name: '',
      moderator_name: '',
      firstPublishList: [],
      isFirstSubscribe: true,
      sharedScreenUserId: null,
      isJoinedToRoom:false,
      openRecordModal:false,
      isInBackGround:false,
      isClientRecordingStart:false,
      isScreenShared:false,
      activeSpeaker:null,
      isModeratorAccept:false,
      pinClassMode:'',
      classMode:'',
      firstCameraRatio:0,
      cameraRatio:0,
      isSharedWithSidebar:false,
      layoutWith:0,
      otherVideoStreamHeight:0,
      activeSpeakerVideoStreamHeight:0,
      screenHeight: 0,
      screenWidth: 0,
      resizeTimer:null,
      screenSizeChanged:0,
      screenShareTrack:null,
      layoutUpdated : false,
      controlMeetingSending:false,
      cameraSettingModalIsVisible:false,
      microphoneSettingModalIsVisible:false,
      isMyVideoStreamDisplayed: false,
      throttledMouseMove:null,
      isMouseDown:false,
      isActiveSpeakerMaximized: false,
      isVideoShared:false,
      videoShareStatus:false,
      videoShareSubscriberName:'',
      sharedVideoTrack:null,
      sharedAudioTrack:null,
      videoSharedScreenUserId: null,
      isModeratorMaximizeActiveSpeaker:false,
      amIPrivateRoomModerator: this.$store.getters.amIModerator,
      amIModerator: this.$store.getters.amIModerator,
      amIPresenter: false,
      role:'',
      isScreenFullSize:false,
      activeSpeakerMode:true,
      maxVidBw:200,
      terminatePrivateMeeting: false,
      showAgendaComponent:false,
    }
  },
  watch:{
    isControlPanelShowed(val){
      if (!val && !this.isMouseEnteredInControlMeeting){
        this.eventBus.emit('close-mini-dropdown')
      }
    },
    activeSpeakerMode(val) {
      if (!val) {
        let foundIdx = this.subscribedTracksList.findIndex((subscriber) => {

          return +subscriber.userId === +this.pinnedP;
        });
        if (foundIdx > 0 && (this.$store.getters.displayName === this.subscribedTracksList[0].name)) {
          [this.subscribedTracksList[0], this.subscribedTracksList[foundIdx]] = [this.subscribedTracksList[foundIdx], this.subscribedTracksList[0]];
        }
      }
    },
    remoteTracksMap: {
      immediate: true,
      deep: true,
      handler(val) {
        this.trackArray = Array.from(val.values())
        if (this.pinnedP && !this.activeSpeakerMode) {
          let foundIdx = this.trackArray.findIndex((subscriber) => {

            return +subscriber.userId === +this.pinnedP;
          });
          if (foundIdx > 0) {
            [this.trackArray[0], this.trackArray[foundIdx]] = [this.trackArray[foundIdx], this.trackArray[0]];
          }
        } else if (this.trackArray.length === 2) {
          [this.trackArray[0], this.trackArray[1]] = [this.trackArray[1], this.trackArray[0]]
        } else if (this.activeSpeaker && this.activeSpeakerMode && this.layoutType === 'filmStrip') {
          let foundIdx = this.trackArray.findIndex(
              (subscriber) => {
                return subscriber.name === this.activeSpeaker && subscriber.videoTrack?.kind === 'video'
              }
          );
          if (foundIdx >= 0) {
            [this.trackArray[0], this.trackArray[foundIdx]] = [
              this.trackArray[foundIdx],
              this.trackArray[0],
            ];
          }
        }
        this.subscribedTracksList = this.trackArray.slice()
      }
    },
    isSideBarVisible(){
      this.updateLayout()
    },
    isMyVideoStreamDisplayed(){
      const myUserId = this.$store.getters.userId.toString()

      if (this.remoteTracksMap.has(myUserId)){
        navigator.mediaDevices
            .getUserMedia({video :  { deviceId: this.$store.getters.cameraId }})
            .then(stream => {
              const recorder = new MediaRecorder(stream);
              recorder.ondataavailable = event => {
                this.videoBlob = event.data;
              };
              recorder.start(200);
              if(this.$refs.myVideoStream){
                this.$refs.myVideoStream.style.left = 0
                this.$refs.myVideoStream.style.top = 0
                this.$refs.myVideoStream.srcObject = stream;
              }

            })
            .catch((err) => {
              console.log(err)
            })
      }

    },
    isActiveSpeakerMaximized(){
      this.updateLayout()
    },
    isShared(){
      this.isActiveSpeakerMaximized = false
    },
    isVideoShared(){
      this.isActiveSpeakerMaximized = false
    },
    micStatus(newVal) {
      if (this.isClientRecordingStart) {
        setRecordingMicStatus(newVal);
      }
    }
  },
  computed: {
    ...mapGetters("permissions", [
      "cameraStatus",
      "cameraControlAllowed",
      "micStatus",
      "micControlAllowed",
      "userJoinedStatus",
      "getHandStatus",
      "getShareStatus",
      "getMicrophneStateForReconnect"
    ]),
    allPolling() {
      return [...this.allOptionalPolling, ...this.allDescriptivePolling]
    },
    myUserId(){
      return this.$store.getters.userId.toString()
    }
  },
  methods:{
    ...mapActions("permissions", [
      "setCameraState",
      "setCameraControlAllowed",
      "setMicState",
      "setMicControlAllowed",
      "setUserJoinedStatus",
      "setHandStatus",
      "setShareStatus",
      "setMicrophneStateForReconnect"
    ]),
    sendHandRaiseRequest(connectionId, targetUserId, actionType) {
      this.controlMeetingSending = true
      const data = {
        targetUserId: targetUserId,
        connectionId: connectionId ? connectionId : '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.$store.getters.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: actionType,
        userRole: this.role,
      }
      this.restClientControlMeeting.handRaiseRequest(data)
          .then(() => {
            const subModeratorIdentity = this.sub_moderator_name + '&&' + this.$store.getters.moderatorSubstituteId
            const moderatorIdentity = this.moderator_name + '&&' + this.$store.getters.moderatorId
            if (actionType === 'NONE') {
              this.handStatus = 'none'
              const handRequestMessage = JSON.stringify({
                action: 'handRequest',
                userId: this.$store.getters.userId,
                status: 'NONE'
              })
              const encodeHandRequestMessage = new TextEncoder().encode(handRequestMessage);
              if (!this.sub_moderator_connection_id) {
                this.room.localParticipant.publishData(
                    encodeHandRequestMessage,
                    {
                      kind: "reliable",
                      topic: "handRequest",
                      destinationIdentities: [moderatorIdentity, subModeratorIdentity]
                    }              // Set to true for guaranteed delivery
                );
              } else {
                this.room.localParticipant.publishData(
                    encodeHandRequestMessage,
                    {
                      kind: "reliable",
                      topic: "handRequest",
                      destinationIdentities: [moderatorIdentity, subModeratorIdentity]
                    }            // Set to true for guaranteed delivery
                );
              }

            } else if (actionType === 'WAITING') {
              this.handStatus = 'waiting'

              const handRequestMessage = JSON.stringify({
                action: 'handRequest',
                userId: this.$store.getters.userId,
                status: 'WAITING'
              })
              const encodeHandRequestMessage = new TextEncoder().encode(handRequestMessage);
              if (!this.sub_moderator_connection_id) {
                this.room.localParticipant.publishData(
                    encodeHandRequestMessage,
                    {
                      kind: "reliable",
                      topic: "handRequest",
                      destinationIdentities: [moderatorIdentity, subModeratorIdentity]
                    }          // Set to true for guaranteed delivery
                );
              } else {
                this.room.localParticipant.publishData(
                    encodeHandRequestMessage,
                    {
                      kind: "reliable",
                      topic: "handRequest",
                      destinationIdentities: [moderatorIdentity, subModeratorIdentity]
                    }           // Set to true for guaranteed delivery
                );
              }

            }
            this.controlMeetingSending = false
          }).catch(() => {
        this.controlMeetingSending = false
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: this.$t('please-try-again'),
          time: 5000,
        });
      }).finally(() => {
        this.sending = false
        this.isMeetingsLoaded = true
      });
    },
    async controlMeetingHandler(type,stat) {
      switch (type) {
        case "hand-raise":
          if (stat === "none") {
            // send hand rise
            this.sendHandRaiseRequest('', this.$store.getters.userId, 'WAITING')
            this.handStatus = "waiting";
          } else if (stat === "waiting") {
            // send cancel hand rise
            this.eventBus.emit("send-cancel-hand-raise");
            this.sendHandRaiseRequest('', this.$store.getters.userId, 'NONE')
            this.handStatus = "none";
            this.setHandStatus("none")
          }
          break;
        case "microphone":
          if (this.micStatus){
            this.setMicState(false)
            await this.room.localParticipant.setMicrophoneEnabled(false);
          }else {
            this.setMicState(true)
            await this.room.localParticipant.setMicrophoneEnabled(true);

          }
          break;
        case "camera":
          if (this.cameraStatus){
            this.setCameraState(false)
            this.room.localParticipant.setCameraEnabled(false);
          }else {
            this.setCameraState(true)
            this.room.localParticipant.setCameraEnabled(true);
          }
          break;
        case "share":

          if (this.videoShareStatus && !this.shareStatus) {
            this.stopVideoSharing()
          }else if(this.isVideoShared && !this.videoShareStatus && !this.shareStatus && !this.amIModerator){
            this.eventBus.emit("notification", {
              title: "پیام",
              type: "error",
              bodyText: this.$t('Another_user_is_sharing'),
              time: 3000,
            });
            return
          }
          // this.amIShareMyScreen = !this.amIShareMyScreen
          if ((this.isScreenShared || this.isVideoShared) && !this.shareStatus && !this.amIModerator) {
            this.eventBus.emit("notification", {
              title: "پیام",
              type: "error",
              bodyText: this.$t('Another_user_is_sharing'),
              time: 3000,
            });
            return
          } else if ((this.isScreenShared || this.isVideoShared) && this.amIModerator) {
            if (!this.shareStatus) {
              const stopShareMessage = JSON.stringify({action: 'moderatorSharedScreen'})
              const encodeStopShareMessage = new TextEncoder().encode(stopShareMessage);
              this.room.localParticipant.publishData(
                  encodeStopShareMessage,
                  {
                    kind: "reliable",
                    topic: "moderatorSharedScreen",
                    destinationIdentities: []
                  }          // Set to true for guaranteed delivery
              );
              this.webSocketClient?.shareRequest();
              await this.startScreenShare()
            } else {
              this.stopShare();
              this.webSocketClient?.shareStop();
            }
            this.shareStatus = !this.shareStatus;
            return
          }
          if (!this.shareStatus) {
            this.webSocketClient?.shareRequest();
            await this.startScreenShare()
          } else {
            this.stopShare();
            this.webSocketClient?.shareStop();
          }
          this.shareStatus = !this.shareStatus;
          break;
        case "video-share":
          this.eventBus.emit('open-video-file-picker')
          this.openVideoFilePicker()
          break ;
        case "end-share":
          if (this.shareStatus){
            this.stopShare()
            this.shareStatus = !this.shareStatus
          }else if (this.videoShareStatus){
            this.stopVideoSharing()
          }
          break ;
        case "leave":
          this.leaveSessionOrTerminate()
          // if (this.$store.getters.privateRoomId === this.roomId) {
          //   if (this.amIModerator){
          //     this.showLeftModal = true;
          //     return;
          //   }

          // }
          // if (this.$store.getters.privateRoomId === this.roomId && [...this.$store.getters.innerParticipants, ...this.$store.getters.outerParticipants].length > 2) {
          //   this.showLeftModal = true;
          //   return;
          // } else if (this.$store.getters.privateRoomId === this.roomId && [...this.$store.getters.innerParticipants, ...this.$store.getters.outerParticipants].length === 2) {
          //   this.exitPrivateRoom()
          //   return;
          // } else if (this.isProceedingsCreated && !this.isProceedingsAnswered) {
          //   this.showConfirmProceedingsModal = true
          //   return;
          // }
          // this.saveLeftTime()
          // await this.exitRoom();
          break;
        case "PDF":
          break;
        case "record":
            this.isRecordModalopend = true
          break;
        case "changeLayout":
          this.changeLayout()
          break;
        case "camera_setting":
          this.cameraSettingModalIsVisible = true
          break;
        case "microphone_setting":
          this.microphoneSettingModalIsVisible = true
          break;
        default:
          return;
      }
    },
    leaveSessionOrTerminate() {
      console.error('privaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaate')
      console.error(this.$store.getters.isPrivate, this.$store.getters.amIModerator)
      if (this.$store.getters.isPrivate && this.$store.getters.amIModerator) {
        this.terminatePrivateMeeting = true;
        // this.leaveSession()
      } else {
        this.isLoading = true
        this.leaveSession()
      }
    },
    closeTerminateModal() {
      this.terminatePrivateMeeting = false;
    },
    terminateMeeting() {
      this.terminatePrivateMeeting = false;
      this.terminatePrivateRoom();
    },
    terminatePrivateRoom() {
      this.restClientPrivate.terminateMeeting().then((data) => {
        console.log(data);
        this.leaveSession()

        window.location.href = config.CALENDAR_URL;
      });
    },
    async leaveSession() {
      this.isLoading = true
      localStorage.setItem("meetingDisplayName", null);
      if (this.isScreenShared) {
        this.webSocketClient?.shareStop();
      }
      await this.leaveRoom()

    },
    async leaveRoom() {
      if (this.remoteTracksMap.has(this.$store.getters.userId.toString())){
        await this.unPublishTrack(false)
      }
      await this?.room?.disconnect();
      if (this.$store.getters.meetingType === "public") {
        window.location.href = config.MEETING_ENDED;
      } else if (this.$store.getters.meetingType === "private") {
        window.location.href = config.MEETING_ENDED;
      } else {
        window.location.href = config.CALENDAR_URL;
      }
    },
    async startScreenShare() {
      try {
        // 1. Create screen share track
        const screenTrack = await this.room.localParticipant.createScreenTracks({
          video: true, // Choose 'window', 'monitor', or 'browser'
          audio: false, // Enable audio (if browser supports it)
          resolution: {width: 1920, height: 1280, frameRate: 15}, // Proper format for resolution
          contentHint: 'detail', // Improve text clarity if needed
          selfBrowserSurface: 'include', // Allow capturing current tab
          surfaceSwitching: 'include', // Allow user to switch tabs
          systemAudio: 'include', // Include system audio if supported
        });

        this.screenTrack = screenTrack;

        screenTrack.forEach((track) => {
          this.room.localParticipant.publishTrack(track, {
            simulcast: false, // Disable simulcast
            // screenShareEncoding: {
            //   maxBitrate: 200000, // Adjust bitrate
            //   maxFramerate: 10, // Adjust frame rate
            //   scaleResolutionDownBy: 1, // Keep original resolution
            // },
          });

          this.isScreenShared = true;
          this.shareSubscriberName = this.$store.getters.displayName;
          nextTick(async () => {
            if (track.kind === 'video') {
              // await track.attach(this.$refs['video-share']);
              this.screenShareTrack = track
            }
            this.updateLayout();
          });
        });

        // Handle screen share stop
        screenTrack.forEach((track) => {
          track.mediaStreamTrack.onended = () => {
            this.sharePublisher = null;
            this.shareSubscriberName = null;
            this.isScreenShared = false;
            this.sharedScreenUserId = null
            this.shareStatus = false;
            this.setShareStatus(false);
            this.updateLayout();
            this.stopScreenShare();
          };
        });

      } catch (err) {
        setTimeout(() => {
          this.shareStatus = false;
        }, 50);
        console.error('Error starting screen share:', err);
      }
    },
    stopScreenShare() {
      this.sharePublisher = null;
      this.isShared = false;
      this.isScreenShared = false
      this.shareStatus = false;
      this.shareSubscriberName = null
      this.sharedScreenUserId = null
      this.updateLayout();
      // ✅ Unpublish and stop each screen track
      this.screenTrack.forEach((track) => {
        this.room.localParticipant.unpublishTrack(track); // Unpublish from LiveKit
        track.stop(); // Stop the media stream
      });

      // Clear stored tracks
      this.screenTrack = [];
      console.log('Screen sharing stopped');
    },
    async stopShare() {
      this.sharePublisher = null;
      this.isScreenShared = false;
      this.sharedScreenUserId = null
      this.shareSubscriberName = null
      this.updateLayout();
      this.screenTrack.forEach((track) => {
        this.room.localParticipant.unpublishTrack(track); // Unpublish from LiveKit
        track.stop(); // Stop the media stream
      });

      // Clear stored tracks
      this.screenTrack = [];
      console.log('Screen sharing stopped');
      this.updateLayout();
    },
    controlSideBarHandler(type, status) {
      switch (type) {
        case "chat":
          if (status === "off") {
            this.isSideBarVisible = true;
            this.sideBarInterior = "chat";
            this.messageReceived(false);
          } else {
            this.closeConferenceSideBar();
            this.sideBarInterior = null;


            if (this.sideBarInterior !== "chat") {
              this.sideBarInterior = "chat";
            } else {
              if (this.isSideBarVisible === true && this.isMobile === false) {
                this.isSideBarVisible = false;
              }
            }


          }
          break;
        case "participants":
          if (status === "off") {
            this.isSideBarVisible = true;
            this.sideBarInterior = "participants";
            // if (this.messagesArrayLength !== 0) {
            //   this.messageReceived(true);
            // }
            if (this.messagesArrayLength !== 0) {
              this.messageReceived(true);
            } else {
              this.messageReceived(false);
            }

          } else {
            this.closeConferenceSideBar();
            this.sideBarInterior = null;
            if (this.sideBarInterior !== "participants") {
              this.sideBarInterior = "participants";
              // this.isProceedingsMiniDropDownOPen = false;
              // this.isPollingMiniDropDownOpen = false;
              if (this.messagesArrayLength !== 0) {
                this.messageReceived(true);
              }
            } else if (
                this.isSideBarVisible === true &&
                this.isMobile === false
            ) {
              this.isSideBarVisible = false;
            }
          }
          break;
        case "polling":
          if (status === "off") {
            this.isSideBarVisible = true;
            this.sideBarInterior = "polling";
            // this.openConfirmPolling()
          } else {
            this.closeConferenceSideBar();
            this.sideBarInterior = null;
            if (this.sideBarInterior !== "polling") {
              this.sideBarInterior = "polling";
            } else if (
                this.isSideBarVisible === true &&
                this.isMobile === false
            ) {
              this.isSideBarVisible = false;
            }
          }
          break;
        case 'record':
          if (status === 'start') {
            console.error('start')
          } else {
            console.error('end')
          }
          break;
        case "selfView":
         this.changeSelfView()
          break;
        default:
          return;
      }
    },  closeConferenceSideBar() {
      this.sideBarInterior = null;
      this.isSideBarVisible = false;
      // if (this.messagesArrayLength !== 0) {
      //   this.messageReceived(true);
      // }
      // } else {
      //   this.messageReceived(false);
      // }
    },
    messageReceived(unreadMessage) {
      if (unreadMessage === true) {
        if (this.isSideBarVisible === true) {
          if (this.sideBarInterior !== "chat") {
            this.isMessageReceived = true;
          }
          if (this.sideBarInterior === "chat") {
            this.isMessageReceived = false;
          }
        } else {
          this.isMessageReceived = true;
        }
      } else {
        if (this.messages.length < 1) {
          this.isMessageReceived = false;
        }

      }
    },
    controlMoreOptionsHandler(type, stat) {
      switch (type) {
        case "invite":
          this.isInvitationVisible = true;
          break;
        case "change":
          this. isWaitingRoomModalOpen = true;
          break;
        case "moderator-substitute":
          if (stat) {
            this.enableSubstitution()
          } else {
         this.disableSubstitution()
          }
          localStorage.setItem(`moderator-substitute`, JSON.stringify({
            roomId: this.roomId,
            stat,
          }));
          break;
        case "polling":
          this.openPoll();
          break;
        case "blockRoom":
          this.blockRoom(stat)
          break;
        case "rotation":
          if (stat === 'disable'){
            this.webSocketClient.rotationChangeStatus(false)
          }else {
            this.webSocketClient.rotationChangeStatus(true)
          }
          break;
        case "active_speaker":
          if (stat === 'on'){
            this.webSocketClient.enableActiveSpeaker(true);
          }else {
            this.webSocketClient.enableActiveSpeaker(false);
          }
          break;
        case "maximize_active_speaker":
          if (stat === 'on'){
            this.changeActiveSpeakerView(false)
          }else {
            this.changeActiveSpeakerView(true)
          }
          break;
        default:
          return;
      }
    },
    closeInvitationComponent() {
      this.isInvitationVisible = false;
    },
   async enterToRoom() {
     this.isEntranceButtonActive = false
      if (this.$store.getters.meetingType === "public") {
        this.isEntranceButtonActive = false
        if (this.$store.getters?.displayName?.length < 3) {
           this.eventBus.emit("notification", {
            title: "پیام",
            type: "error",
            bodyText: this.$t("short-name-err"),
            time: 3000,
          });
          this.isEntranceButtonActive = true
        } else {
          this.joinToSessionAsGuestPublic();

        }

      } else if (this.$store.getters.meetingType === "private") {
        this.isEntranceButtonActive = false
        this.isPrivate = true
        if (this.$store.getters.displayName.length < 3) {
           this.eventBus.emit("notification", {
            title: "پیام",
            type: "error",
            bodyText: this.$t("short-name-err"),
            time: 3000,
          });
          this.isEntranceButtonActive = true
        } else {
          this.joinToSessionPrivate();

        }

      } else {
       await this.initiateWebSocket()
        this.IWantToPublishHandler()
      }
    },
    joinToSessionAsGuestPublic() {
      this.amIGuestUser = true
      this.isLoading = true
      // this.$store.dispatch("isUserGuest", true);
      this.isEntranceButtonActive = false;
      this.myUserName = this.$store.getters.displayName;
      this.restClientControlMeeting.iWantToJoinAsGuest(
          this.$store.getters.roomId,
          this.$store.getters.displayName + " " + "(مهمان)",
          this.$store.getters.password,
          this.$store.getters.userId,
          this.$store.getters.customerId, 0
      )
          .then(async (response) => {
            this.isEntranceButtonActive = true
            auth.setVrAddress(response.data.vr)
            this.isModeratorAccept = response.data.shouldAskForJoin
            this.$store.dispatch('setvrAddress', response.data?.vr)
            this.$store.dispatch('setModeratorSubstituteId', response?.data?.substitutionUserId)

            const index = response?.errorCodeLists?.findIndex((el) => {
              return +el === 15
            })
            if (index === -1 || index === undefined) {
              const meetingLink = window.location.href.toString();

              if ((!response.data.substitutionUserId?.toString().trim()?.length > 0 && !meetingLink.includes('/meeting/')) || (response.data.substitutionUserId?.toString().trim()?.length > 0 && meetingLink.includes('/meeting/')) ) {
                this.eventBus.emit("notification", {
                  title: "پیام",
                  type: "error",
                  bodyText: 'لینک جلسه را اشتباه وارد کرده اید',
                  time: 5000,
                });
                setTimeout(() => {
                  window.location.href = config.MEETING_ENDED;
                }, 5000)
                await new Promise(resolve => setTimeout(resolve, 6000));
                window.location.href = config.MEETING_ENDED;
              }
              // this.deviceTestModalIsVisible = false;
              if (!response) {
                return;
              }
              // this.$store.dispatch(
              //     "setUserId",
              //     this.$store.getters.uniqueId + ""
              // );
              this.$store.dispatch(
                  "setDisplayName",
                  this.$store.getters.displayName + " " + "(مهمان)"
              );
              this.$store.dispatch(
                  "setUsername",
                  this.$store.getters.displayName + " " + "(مهمان)"
              );
              // this.$store.dispatch("setSessionToken", response.data.token);
              sessionStorage.setItem("publishCount", response.data.publishCount);
              this.publishCount = response.data.publishCount

              this.$store.dispatch(
                  "setSessionId",
                  this.$store.getters.roomId
              );
              localStorage.setItem('userId', JSON.stringify({
                meetingId: this.$store.getters.roomId,
                userId: this.$store.getters.userId
              }))
              if (+JSON.parse(localStorage?.getItem("answerProceeding"))?.roomId === +this.$store.getters.roomId && JSON.parse(localStorage?.getItem("answerProceeding"))?.isAnswered.toString() === 'true') {
                this.isProceedingsAnswered = true
                this.isProceedingsCreated = true
                // this.eventBus.emit('is-proceedings-answered')
                this.isConfirmedProceedings = JSON.parse(localStorage?.getItem("answerProceeding"))?.isConfirmed
              } else if (+JSON.parse(localStorage?.getItem("answerProceeding"))?.roomId === +this.$store.getters.roomId && JSON.parse(localStorage?.getItem("answerProceeding"))?.isAnswered.toString() === 'false') {
                this.isProceedingsAnswered = false
                this.isProceedingsCreated = true
                // this.eventBus.emit('is-proceedings-answered')
                this.isConfirmedProceedings = JSON.parse(localStorage?.getItem("answerProceeding"))?.isConfirmed
              }
               await this.initiateWebSocket()
              // this.deviceTestModalIsVisible = false;

              if (!this.isModeratorAccept){
                this.IWantToPublishHandler()
              }else{
                this.isLoading = false
              }
            } else {
              this.eventBus.emit("notification", {
                title: "پیام",
                type: "error",
                bodyText: 'این کاربر در جلسه حضور دارد',
                time: 5000,
              });
              this.isLoading = false
              this.isEntranceButtonActive = true;
            }


          })
          .catch((error) => {
            this.eventBus.emit("notification", {
              title: "پیام",
              type: "warning",
              bodyText: this.$t("there-is-some-problem"),
              time: 3000,
            });

            this.isLoading = false
            this.isEntranceButtonActive = true;
            console.error(error);
          });
      // }
    },
    joinToSessionPrivate() {
      this.myUserName = this.$store.getters.displayName;
      if (this.$store.getters.displayName.length < 3) {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: this.$t("short-name-err"),
          time: 3000,
        });
      } else {
        this.amIGuestUser = true
        this.isLoading = true
        // this.$store.dispatch("isUserGuest", true);
        this.isEntranceButtonActive = false;
        this.myUserName = this.$store.getters.displayName;
        this.restClientControlMeeting
            .iWantToJoinPrivateAsGuest(
                this.$store.getters.roomId,
                this.$store.getters.displayName + " " + "(مهمان)",
                this.$store.getters.password,
                this.$store.getters.userId,
                this.$store.getters.customerId
            )
            .then((response) => {
              this.deviceTestModalIsVisible = false;
              if (!response) {
                return;
              }
              this.$store.dispatch(
                  "setUserId",
                  this.$store.getters.userId + ""
              );
              this.$store.dispatch(
                  "setDisplayName",
                  this.$store.getters.displayName + " " + "(مهمان)"
              );
              this.$store.dispatch(
                  "setUsername",
                  this.$store.getters.displayName + " " + "(مهمان)"
              );
              // this.$store.dispatch("setSessionToken", response.data.token);
              // sessionStorage.setItem("publishCount", response.data.publishCount);
              // this.publishCount = response.data.publishCount
              // this.$store.dispatch(
              //     "setSessionShareToken",
              //     response.data.shareToken
              // );
              this.$store.dispatch(
                  "setSessionId",
                  this.$store.getters.roomId
              );
              this.initiateWebSocket()
              // this.webSocketClient = WebSocketClient.getInstance(
              //     this.$store.getters.roomId,
              //     this.$store.getters.userId,
              //     this.$store.getters.displayName,
              //     false, false, false, true, true
              // );
              // this.webSocketClient?.connect();
              //
              // this.deviceTestModalIsVisible = false;
              // setTimeout(() => {
              //   const connected = this.webSocketClient?.getConnected();
              //   if (!connected) {
              //     this.eventBus.emit("notification", {
              //       title: "پیام",
              //       type: "warning",
              //       bodyText: this.$t("unable-connect"),
              //       time: 3000,
              //     });
              //     this.webSocketClient?.disconnect();
              //     if (this.$store.getters.meetingType === "public") {
              //
              //       window.location.href = config.MEETING_ENDED;
              //     } else if (this.$store.getters.meetingType === "private") {
              //       window.location.href = config.MEETING_ENDED;
              //     } else {
              //       window.location.href = config.CALENDAR_URL;
              //     }
              //   }
              // }, 5000)
              localStorage.setItem('userId', JSON.stringify({
                meetingId: this.$store.getters.session_id,
                userId: this.$store.getters.uniqueId
              }))
              this.IWantToPublishHandler()
            })
            .catch((error) => {
              this.isEntranceButtonActive = true;
              console.error(error);
            });
      }
    },

    IWantToPublishHandler() {
      // 1. Assign user role
      this.role = this.getUserRole();

      // 2. Build data object
      const data = this.buildPublishData();

      // 3. Call API and handle response
      this.restClientControlMeeting.iWantToPublish(data)
        .then(async (res) => {
          this.handlePublishResponse(res);
        })
        .catch(() => {
          this.isLoading = false;
          this.eventBus.emit("notification", {
            title: "پیام",
            type: "error",
            bodyText: this.$t('please-try-again'),
            time: 5000,
          });
          setTimeout(() => {
            this.redirectOnError();
          }, 5000);
        })
        .finally(() => {
          this.isMeetingsLoaded = true;
        });
    },

    getUserRole() {
      if (this.amIGuestUser) return 'GUEST';
      if (this.amIModerator || this.amIPrivateRoomModerator) return 'MODERATOR';
      if (this.amISubstitutionModerator) return 'SUBSTITUTION';
      if (this.amIPresenter) return 'PRESENTER';
      return 'USER';
    },

    buildPublishData() {
      return {
        targetUserId: '',
        connectionId: this.mySid,
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'iWantToPublish',
        userRole: this.role,
        displayName: this.$store.getters.displayName,
        customerId: +this.$store.getters.customerId,
      };
    },

    handlePublishResponse: async function(res) {
      const data = res?.data?.data;
      if (!data) {
        this.isLoading = false;
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: this.$t('please-try-again'),
          time: 5000,
        });
        return;
      }

      // 1. Update bandwidth and server URLs
      if (data.maxVidBw) this.maxVidBw = data.maxVidBw;
      this.isWaitingRoomModalOpen = false;
      this.APPLICATION_SERVER_URL = auth.getVrAddress() + '/shooka/';
      this.LIVEKIT_URL = auth.getVrAddress();

      // 2. Join the room
      await this.joinToRoom();
      this.callIWantToJoin++;
      this.fullPublishListFromBackEnd = data.fullPublishList;

      // 3. Prepare participant permissions and data
      const participantPermissions = { ...data.permissions, publishStatus: data.publishStatus };
      this.publishStatus = data.publishStatus;
      const participantData = {
        userId: data.userId,
        participantRole: data.userRole,
        failedPublish: false,
        permission: participantPermissions,
        participantStatus: 'ONLINE',
        displayName: data.displayName,
        connectionId: this.mySid,
        userRole: data.userRole
      };

      // 4. Handle substitution moderator activation
      if ((+this.$store.getters.userId === +this.$store.getters.moderatorSubstituteId) && data.substitutionActive) {
        this.amISubstitutionModerator = true;
        this.isModeratorSubstituteActivated = true;
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "success",
          bodyText: this.$t("meeting-management-is-available"),
          time: 5000,
        });
      }

      // 5. Handle moderator and substitution logic
      if (data.userRole === 'MODERATOR') {
        this.handleModeratorJoin(data);
      } else if (data.userRole === 'SUBSTITUTION') {
        this.handleSubstitutionJoin(data);
      } else if (data.publishStatus) {
        await this.publishToRoom();
      }
      // 6. Update permissions and UI state
      this.setMicControlAllowed(data.permissions.mic);
      if (data.permissions.share) {
        this.screenShareAllowed = true;
        this.setShareStatus(false);
      }
      this.handStatus = data.permissions.handStatus;
      this.setHandStatus(data.permissions.handStatus);

      // 7. Store and update participants
      this.$store.dispatch('participantJoined', participantData);
      if (data.moderatorExist) this.moderator_joined = true;
      this.$store.dispatch('setUserRoleInMeeting', data.userRole);
      this.$store.dispatch('setParticipants', data.userList);

      // 8. Set moderator and sub-moderator names
      this.setModeratorNames(data);

      // 9. Handle pinning
      this.handlePinParticipant(data);

      // 10. Update chat list and notify others
      this.$store.dispatch('setChatList', data.userList);
      this.notifyParticipantJoined(participantData);

      // 11. Final UI state updates
      this.isLoading = false;
      this.isJoinedToRoom = true;
      if (data.activeSpeakerLayoutActive) {
        this.eventBus.emit('isModeratorMaximizeActiveSpeaker');
        this.isModeratorMaximizeActiveSpeaker = true;
        this.isActiveSpeakerMaximized = true;
      }
    },

    handleModeratorJoin(data) {
      this.webSocketClient.enableActiveSpeaker(true);
      if (data.substitutionActive) {
        this.eventBus.emit('sub-moderator-is-active');
      }
      if (data.unPublishUserId) {
        const unPublishIdentity = data.unPublishDisplayName + '&&' + data.unPublishUserId;
        setTimeout(() => {
          if (data.publishStatus) this.publishToRoom();
        }, 100);
        const unPublishMessage = JSON.stringify({ action: 'unPublishParticipant' });
        const encodeUnPublishMessage = new TextEncoder().encode(unPublishMessage);
        this.room.localParticipant.publishData(
          encodeUnPublishMessage,
          {
            kind: "reliable",
            topic: "unPublishParticipant",
            destinationIdentities: [unPublishIdentity]
          }
        );
      } else if (data.publishStatus) {
        this.publishToRoom();
      }
      const moderatorJoinedMessage = JSON.stringify({
        action: 'moderatorJoined',
        name: this.$store.getters.displayName
      });
      const encodeModeratorJoinedMessage = new TextEncoder().encode(moderatorJoinedMessage);
      this.room.localParticipant.publishData(
        encodeModeratorJoinedMessage,
        {
          kind: "reliable",
          topic: "moderatorJoined",
          destinationIdentities: []
        }
      );
    },

    handleSubstitutionJoin(data) {
      const subModeratorJoinedMessage = JSON.stringify({
        action: 'subModeratorJoined',
        name: this.$store.getters.displayName
      });
      const encodeSubModeratorJoinedMessage = new TextEncoder().encode(subModeratorJoinedMessage);
      this.room.localParticipant.publishData(
        encodeSubModeratorJoinedMessage,
        {
          kind: "reliable",
          topic: "subModeratorJoined",
          destinationIdentities: []
        }
      );
      if (data.publishStatus) {
        this.publishToRoom();
      }
    },

    setModeratorNames(data) {
      const subModeratorIndex = data?.userList?.findIndex((user) => {
        return +user.userId === +this.$store.getters.moderatorSubstituteId;
      });
      if (subModeratorIndex > -1) {
        this.sub_moderator_name = data?.userList[subModeratorIndex].displayName;
      }
      if (data.moderatorExist) {
        const moderatorIndex = data?.userList?.findIndex((user) => {
          return +user.userId === +this.$store.getters.moderatorId;
        });
        if (moderatorIndex > -1) {
          this.moderator_name = data?.userList[moderatorIndex].displayName;
        }
      }
    },

    handlePinParticipant(data) {
      const foundPinIndex = data?.userList.findIndex((user) => user.permission.pin === true);
      if (foundPinIndex > -1) {
        this.pinnedP = data.userList[foundPinIndex].userId;
        setTimeout(() => {
          if (this.remoteTracksMap.has(this.pinnedP)) {
            let temp = this.remoteTracksMap.get(this.pinnedP);
            temp = { ...temp, pin: true };
            this.remoteTracksMap.set(this.pinnedP, temp);
          }
        }, 2000);
      }
    },

    notifyParticipantJoined(participantData) {
      const participantDataString = JSON.stringify({ ...participantData, action: 'participantJoined' });
      const joiningMessage = new TextEncoder().encode(participantDataString);
      this.room.localParticipant.publishData(
        joiningMessage,
        {
          kind: "reliable",
          topic: "participantJoined",
          destinationIdentities: []
        }
      );
    },

    redirectOnError() {
      if (this.$store.getters.meetingType === "public" || this.$store.getters.meetingType === "private") {
        window.location.href = config.MEETING_ENDED;
      } else {
        window.location.href = config.CALENDAR_URL;
      }
    },

    enableSubstitution() {
      localStorage.setItem(
          "moderator-substitution",
          "allowModeratorSubstitution"
      );
      this.controlMeetingSending = true
      const data = {
        targetUserId: '',
        connectionId: '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'enableSubstitutionModerator',
        userRole: this.$store.getters.userRoleInMeeting,
      }
      this.restClientControlMeeting.enableSubstitutionModerator(data)
          .then(() => {
            // this.miniDropDownItemsModeratorDesktop[1].label = this.$t(
            //     "deny-moderator-substitution"
            // );
            if (this.sub_moderator_name) {
              const identity = this.sub_moderator_name + '&&' + this.$store.getters.moderatorSubstituteId
              const enableSubstitutionModeratorMessage = JSON.stringify({action: 'enableSubstitutionModerator'})
              const encodeEnableSubstitutionModeratorMessage = new TextEncoder().encode(enableSubstitutionModeratorMessage);
              this.room.localParticipant.publishData(
                  encodeEnableSubstitutionModeratorMessage,
                  {
                    kind: "reliable",
                    topic: "enableSubstitutionModerator",
                    destinationIdentities: [identity]
                  }          // Set to true for guaranteed delivery
              );
            }
            this.controlMeetingSending = false
          }).catch(() => {
        this.controlMeetingSending = false
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
          time: 5000,
        });
      }).finally(() => {
        this.isMeetingsLoaded = true
      });
      this.eventBus.emit("notification", {
        title: "پیام",
        type: "success",
        bodyText: this.$t("substitution-moderator"),
        time: 3000,
      });
    },
    disableSubstitution() {
      this.controlMeetingSending = true
      const data = {
        targetUserId: '',
        connectionId: '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'disableSubstitution',
        userRole: this.$store.getters.userRoleInMeeting,
      }
      this.restClientControlMeeting.disableSubstitutionModerator(data)
          .then(() => {
            // this.miniDropDownItemsModeratorDesktop[1].label = this.$t(
            //     "moderator-substitution"
            // );
            if (this.sub_moderator_name) {
              const identity = this.sub_moderator_name + '&&' + this.$store.getters.moderatorSubstituteId
              const disableSubstitutionModeratorMessage = JSON.stringify({action: 'disableSubstitutionModerator'})
              const encodeDisableSubstitutionModeratorMessage = new TextEncoder().encode(disableSubstitutionModeratorMessage);
              this.room.localParticipant.publishData(
                  encodeDisableSubstitutionModeratorMessage,
                  {
                    kind: "reliable",
                    topic: "disableSubstitutionModerator",
                    destinationIdentities: [identity]
                  }            // Set to true for guaranteed delivery
              );
            }

            this.controlMeetingSending = false
          }).catch(() => {
        this.controlMeetingSending = false
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
          time: 5000,
        });
      }).finally(() => {
        this.isMeetingsLoaded = true
      });
      this.eventBus.emit("notification", {
        title: "پیام",
        type: "success",
        bodyText: this.$t("substitution-moderator-disable"),
        time: 3000,
      });
    },

    enableSubstitutionModerator() {
      this.amISubstitutionModerator = true;
      this.isModeratorSubstituteActivated = true
      if (!this.micControlAllowed) {
        this.openMicrophoneAPIHandler('', this.$store.getters.userId, this.$store.getters.displayName)
      }
      setTimeout(() => {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "success",
          bodyText: this.$t("meeting-management-available"),
          time: 5000,
        });
      }, 100)
    },

    disableSubstitutionModerator() {
      this.eventBus.emit("notification", {
        title: "پیام",
        type: "error",
        bodyText: this.$t("meeting-management-unavailable"),
        time: 5000,
      });
      this.amISubstitutionModerator = false;
      this.isModeratorSubstituteActivated = false
    },
    openMicrophoneAPIHandler(connectionId, targetUserId, name) {
      console.error(name)
      this.controlMeetingSending = true
      const data = {
        targetUserId: targetUserId,
        connectionId: connectionId ? connectionId : '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'openMic',
        userRole: this.role,
      }
      this.restClientControlMeeting.openMic(data)
          .then((res) => {
            if (!res.data){
              if (res.errorMessage){
                this.eventBus.emit("notification", {
                  title: "پیام",
                  type: "error",
                  bodyText: res.errorMessage,
                  time: 5000,
                });
              }

              return
            }
            // this.callHandRaiseResponse(connectionId, targetUserId,"GRANTED")
            //   this.$store.dispatch(
            //       'addAllConnection', data);
            // })
            const identity = name + '&&' + targetUserId
            if (res.data.data.unPublishUserId) {
              if (+targetUserId === +this.$store.getters.userId) {
                this.openMyMicrophone('publish');
              }
              const unPublishIdentity = res.data.data.unPublishDisplayName + '&&' + res.data.data.unPublishUserId
              setTimeout(() => {
                const openMicMessage = JSON.stringify({action: 'openMic', publishStatus: 'publish'})
                const encodeOpenMicMessage = new TextEncoder().encode(openMicMessage);
                this.room.localParticipant.publishData(
                    encodeOpenMicMessage,
                    {
                      kind: "reliable",
                      topic: "openMic",
                      destinationIdentities: [identity] // Only send to this participant
                    }        // Set to true for guaranteed delivery
                );
              }, 100)
              const unPublishMessage = JSON.stringify({action: 'unPublishParticipant'})
              const encodeUnPublishMessage = new TextEncoder().encode(unPublishMessage);
              this.room.localParticipant.publishData(
                  encodeUnPublishMessage,
                  {
                    kind: "reliable",
                    topic: "unPublishParticipant",
                    destinationIdentities: [unPublishIdentity] // Only send to this participant
                  }        // Set to true for guaranteed delivery
              );
              this.$store.dispatch("removeParticipantFromLayout", {
                userId: res.data.data.unPublishUserId,
                status: false
              });
              this.$store.dispatch("removeParticipantFromLayout", {userId: targetUserId, status: true});
            } else {
              if (+targetUserId === +this.$store.getters.userId) {
                this.openMyMicrophone('publish');
              }
              const openMicMessage = JSON.stringify({action: 'openMic', publishStatus: 'publish'})
              const encodeOpenMicMessage = new TextEncoder().encode(openMicMessage);
              this.room.localParticipant.publishData(
                  encodeOpenMicMessage,
                  {
                    kind: "reliable",
                    topic: "openMic",
                    destinationIdentities: [identity] // Only send to this participant
                  }
              );
            }

            this.$store.dispatch("unmuteMicParticipant", targetUserId);
            this.controlMeetingSending = false
            if (this.amIModerator) {
              this.sendNotifySubstituteSignal()
            } else {
              this.sendNotifyModeratorSignal()
            }
          }).catch(() => {
        this.controlMeetingSending = false
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
          time: 5000,
        });
      }).finally(() => {
        this.sending = false
        this.isMeetingsLoaded = true
      });
    },
    closeMicrophoneAPIHandler(connectionId, targetUserId, name) {
      this.controlMeetingSending = true
      const data = {
        targetUserId: targetUserId,
        connectionId: connectionId ? connectionId : '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'closeMic',
        userRole: this.role,
      }
      this.restClientControlMeeting.closeMic(data)
          .then(() => {
            // this.callHandRaiseResponse(connectionId, targetUserId,"NONE")
            if (+targetUserId === +this.$store.getters.userId) {
              this.closeMyMicrophone()
            }
            const closeMicMessage = JSON.stringify({action: 'closeMic'})
            const encodeCloseMicMessage = new TextEncoder().encode(closeMicMessage);
            const identity = name + '&&' + targetUserId
            this.room.localParticipant.publishData(
                encodeCloseMicMessage,
                {
                  kind: "reliable",
                  topic: "closeMic",
                  destinationIdentities: [identity] // Only send to this participant
                }       // Set to true for guaranteed delivery
            );
            this.$store.dispatch("muteMicParticipant", targetUserId);
            this.controlMeetingSending = false
            if (this.amIModerator) {
              this.sendNotifySubstituteSignal()
            } else {
              this.sendNotifyModeratorSignal()
            }
          }).catch(() => {
        this.controlMeetingSending = false
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
          time: 5000,
        });
      }).finally(() => {
        this.controlMeetingSending = false
        this.isMeetingsLoaded = true
      });
    },
    closeCameraAPIHandler(connectionId, targetUserId, name) {
      console.error(name)
      this.controlMeetingSending = true
      const data = {
        targetUserId: targetUserId,
        connectionId: connectionId ? connectionId : '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'closeCamera',
        userRole: this.role,
      }
      this.restClientControlMeeting.closeMyCamera(data)
          .then(() => {
            //   this.$store.dispatch(
            //       'addAllConnection', data);
            // })
            if (+targetUserId === +this.$store.getters.userId) {
              this.closeMyCamera();
            }
            const identity = name + '&&' + targetUserId
            const closeCameraMessage = JSON.stringify({action: 'closeCamera'})
            const encodeCloseCameraMessage = new TextEncoder().encode(closeCameraMessage);
            this.room.localParticipant.publishData(
                encodeCloseCameraMessage,
                {
                  kind: "reliable",
                  topic: "closeCamera",
                  destinationIdentities: [identity] // Only send to this participant
                }       // Set to true for guaranteed delivery
            );

            this.$store.dispatch("muteCameraParticipant", targetUserId);
            this.controlMeetingSending = false
            if (this.amIModerator) {
              this.sendNotifySubstituteSignal()
            } else {
              this.sendNotifyModeratorSignal()
            }
          }).catch(() => {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
          time: 5000,
        });
        this.controlMeetingSending = false
      }).finally(() => {
        this.controlMeetingSending = false
        this.isMeetingsLoaded = true
      });
    },
    openCameraAPIHandler(connectionId, targetUserId, name) {
      console.error(name)
      this.controlMeetingSending = true
      const data = {
        targetUserId: targetUserId,
        connectionId: connectionId ? connectionId : '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'openCamera',
        userRole: this.role,
      }
      this.restClientControlMeeting.openMyCamera(data)
          .then(() => {
            //   this.$store.dispatch(
            //       'addAllConnection', data);
            // })
            if (+targetUserId === +this.$store.getters.userId) {
              this.openMyCamera();
            }
            const identity = name + '&&' + targetUserId

            const openCameraMessage = JSON.stringify({action: 'openCamera'})
            const encodeOpenCameraMessage = new TextEncoder().encode(openCameraMessage);
            this.room.localParticipant.publishData(
                encodeOpenCameraMessage,
                {
                  kind: "reliable",
                  topic: "openCamera",
                  destinationIdentities: [identity] // Only send to this participant
                }       // Set to true for guaranteed delivery
            );
            this.$store.dispatch("unmuteCameraParticipant", targetUserId);
            this.controlMeetingSending = false
            if (this.amIModerator) {
              this.sendNotifySubstituteSignal()
            } else {
              this.sendNotifyModeratorSignal()
            }
          }).catch(() => {
        this.controlMeetingSending = false
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
          time: 5000,
        });
      }).finally(() => {
        this.controlMeetingSending = false
        this.isMeetingsLoaded = true
      });
    },
    muteShareAPIHandler(connectionId, targetUserId, name) {
      console.error(name)
      this.controlMeetingSending = true
      const data = {
        targetUserId: targetUserId,
        connectionId: connectionId ? connectionId : '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'closeShare',
        userRole: this.role,
      }
      this.restClientControlMeeting.closeShare(data)
          .then(() => {
            //   this.$store.dispatch(
            //       'addAllConnection', data);
            // })
            if (+targetUserId === +this.$store.getters.userId) {
              this.shareAccessDenied();
            }
            const identity = name + '&&' + targetUserId


            const shareAccessDeniedMessage = JSON.stringify({action: 'shareAccessDenied'})
            const encodeShareAccessDeniedMessage = new TextEncoder().encode(shareAccessDeniedMessage);
            this.room.localParticipant.publishData(
                encodeShareAccessDeniedMessage,
                {
                  kind: "reliable",
                  topic: "shareAccessDenied",
                  destinationIdentities: [identity] // Only send to this participant
                }      // Set to true for guaranteed delivery
            );
            this.controlMeetingSending = false
            if (this.amIModerator) {
              this.sendNotifySubstituteSignal()
            } else {
              this.sendNotifyModeratorSignal()
            }
          }).catch(() => {
        this.controlMeetingSending = false
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
          time: 5000,
        });
      }).finally(() => {
        this.controlMeetingSending = false
        this.isMeetingsLoaded = true
      });
    },
    unmuteShareAPIHandler(connectionId, targetUserId, name) {
      this.controlMeetingSending = true
      const data = {
        targetUserId: targetUserId,
        connectionId: connectionId ? connectionId : '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'openShare',
        userRole: this.role,
      }
      this.restClientControlMeeting.openShare(data)
          .then(() => {
            //   this.$store.dispatch(
            //       'addAllConnection', data);
            // })
            if (+targetUserId === +this.$store.getters.userId) {
              this.shareAccess();
            }
            const identity = name + '&&' + targetUserId


            const shareAccessMessage = JSON.stringify({action: 'shareAccess'})
            const encodeShareAccessMessage = new TextEncoder().encode(shareAccessMessage);
            this.room.localParticipant.publishData(
                encodeShareAccessMessage,
                {
                  kind: "reliable",
                  topic: "shareAccess",
                  destinationIdentities: [identity] // Only send to this participant
                }   // Set to true for guaranteed delivery
            );
            this.controlMeetingSending = false
            if (this.amIModerator) {
              this.sendNotifySubstituteSignal()
            } else {
              this.sendNotifyModeratorSignal()
            }
          }).catch(() => {
        this.controlMeetingSending = false
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
          time: 5000,
        });
      }).finally(() => {
        this.controlMeetingSending = false
        this.isMeetingsLoaded = true
      });
    },
    unpinAPIHandler(connectionId, targetUserId) {
      this.controlMeetingSending = true
      const data = {
        targetUserId: targetUserId,
        connectionId: connectionId ? connectionId : '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'unPin',
        userRole: this.role,
      }
      this.restClientControlMeeting.unPin(data)
          .then(() => {
            //   this.$store.dispatch(
            //       'addAllConnection', data);
            // })
            console.error('1111111111111111111111111111111111111111111')
            this.$store.dispatch('participantUnPinned', {targetUserId})
            console.error('33333333333333333333333333333333333333333333333333333')
            // const unPinMessage = JSON.stringify({action: 'unPin', userId: targetUserId})
            // const encodeUnPinMessage = new TextEncoder().encode(unPinMessage);
            // this.room.localParticipant.publishData(
            //     encodeUnPinMessage,
            //     {
            //       kind: "reliable",
            //       topic: "unPin",
            //       destinationIdentities: [] // Only send to this participant
            //     }       // Set to true for guaranteed delivery
            // )
            const pinMessage = JSON.stringify({action: 'unPin', userId: targetUserId})
            const encodePinMessage = new TextEncoder().encode(pinMessage);
            this.room.localParticipant.publishData(
                encodePinMessage,
                {
                  kind: "reliable",
                  topic: "unPin",
                  destinationIdentities: [] // Only send to this participant
                }          // Set to true for guaranteed delivery
            );
            this.unPinUser(targetUserId)
            this.controlMeetingSending = false
            if (this.amIModerator) {
              this.sendNotifySubstituteSignal()
            } else {
              this.sendNotifyModeratorSignal()
            }
          }).catch(() => {
        this.controlMeetingSending = false
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
          time: 5000,
        });
      }).finally(() => {
        this.controlMeetingSending = false
        this.isMeetingsLoaded = true
      });
    },
    pinAPIHandler(connectionId, targetUserId, name) {
      this.controlMeetingSending = true
      const data = {
        targetUserId: targetUserId,
        connectionId: connectionId ? connectionId : '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'pin',
        userRole: this.role,
      }
      this.restClientControlMeeting.pin(data)
          .then((res) => {
            //   this.$store.dispatch(
            //       'addAllConnection', data);
            // })
            const identity = name + '&&' + targetUserId

            if (res.data.data.unPublishUserId) {
              const openVideoTrackMessage = JSON.stringify({action: 'openVideoTrack'})
              const encodeOpenVideoTrack = new TextEncoder().encode(openVideoTrackMessage);
              this.room.localParticipant.publishData(
                  encodeOpenVideoTrack,
                  {
                    kind: "reliable",
                    topic: "openVideoTrack",
                    destinationIdentities: [identity] // Only send to this participant
                  }        // Set to true for guaranteed delivery
              );
              const myUserId = this.$store.getters.userId.toString()

              if (+targetUserId === +this.$store.getters.userId) {
                if (!this.remoteTracksMap.has(myUserId)) {
                  this.publishToRoom()
                }
              }
              setTimeout(() => {
                const unPublishIdentity = res.data.data.unPublishDisplayName + '&&' + res.data.data.unPublishUserId
                const unPublishMessage = JSON.stringify({action: 'unPublishParticipant'})
                const encodeUnPublishMessage = new TextEncoder().encode(unPublishMessage);
                this.room.localParticipant.publishData(
                    encodeUnPublishMessage,
                    {
                      kind: "reliable",
                      topic: "unPublishParticipant",
                      destinationIdentities: [unPublishIdentity] // Only send to this participant
                    }      // Set to true for guaranteed delivery
                );
                this.$store.dispatch("removeParticipantFromLayout", {
                  userId: res.data.data.unPublishUserId,
                  status: false
                });
              }, 100)
              setTimeout(() => {
                const pinMessage = JSON.stringify({action: 'pin', userId: targetUserId})
                const encodePinMessage = new TextEncoder().encode(pinMessage);
                this.room.localParticipant.publishData(
                    encodePinMessage,
                    {
                      kind: "reliable",
                      topic: "pin",
                      destinationIdentities: [] // Only send to this participant
                    }          // Set to true for guaranteed delivery
                );
                this.$store.dispatch("removeParticipantFromLayout", {userId: targetUserId, status: true});
                this.pinUser(targetUserId)
              }, 2000)


            } else {
              setTimeout(() => {
                const pinMessage = JSON.stringify({action: 'pin', userId: targetUserId})
                const encodePinMessage = new TextEncoder().encode(pinMessage);
                this.room.localParticipant.publishData(
                    encodePinMessage,
                    {
                      kind: "reliable",
                      topic: "pin",
                      destinationIdentities: [] // Only send to this participant
                    }          // Set to true for guaranteed delivery
                );
                this.pinUser(targetUserId)
              }, 100)
            }
            this.$store.dispatch("pinParticipant", targetUserId);

            this.controlMeetingSending = false
            if (this.amIModerator) {
              this.sendNotifySubstituteSignal()
            } else {
              this.sendNotifyModeratorSignal()
            }
          }).catch(() => {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
          time: 5000,
        });
        this.controlMeetingSending = false
      }).finally(() => {
        this.controlMeetingSending = false
        this.isMeetingsLoaded = true
      });
    },
    removeVideoAPIHandler(connectionId, targetUserId, name) {
      console.error(name)
      this.controlMeetingSending = true
      const index = this.subscribedTracksList.findIndex((user) => {
        return +user.userId === +targetUserId
      })
      if (index > -1) {
        const data = {
          targetUserId: targetUserId,
          connectionId: connectionId ? connectionId : '',
          meetingId: this.$store.getters.roomId,
          meetingType: !this.isPrivate ? 'public' : 'private',
          senderUserId: this.$store.getters.userId,
          actionType: 'removeVideo',
          userRole: this.role,
        }
        this.restClientControlMeeting.removeVideo(data)
            .then((res) => {
              this.muteShareAPIHandler(connectionId, targetUserId, name)
              //   this.$store.dispatch(
              //       'addAllConnection', data);
              // })
              const removedParticipant = {status: false, userId: targetUserId}

              const identity = name + '&&' + targetUserId

              if (res.data?.data?.substitutionUserId) {
                const substitutionIdentity = res.data.data.substitutionDisplayName + '&&' + res.data.data.substitutionUserId
                setTimeout(() => {
                  const openVideoTrackMessage = JSON.stringify({action: 'openVideoTrack'})
                  const encodeOpenVideoTrack = new TextEncoder().encode(openVideoTrackMessage);
                  this.room.localParticipant.publishData(
                      encodeOpenVideoTrack,
                      {
                        kind: "reliable",
                        topic: "openVideoTrack",
                        destinationIdentities: [substitutionIdentity] // Only send to this participant
                      }       // Set to true for guaranteed delivery
                  );

                }, 10)
                this.$store.dispatch("removeParticipantFromLayout", {
                  userId: res.data.data.substitutionUserId,
                  status: true
                });
              }
              if (+targetUserId === +this.$store.getters.userId) {
                this.removeVideoTrack();
              }

              const removeVideoTrackMessage = JSON.stringify({action: 'removeVideoTrack'})
              const encodeRemoveVideoTrackMessage = new TextEncoder().encode(removeVideoTrackMessage);
              this.room.localParticipant.publishData(
                  encodeRemoveVideoTrackMessage,
                  {
                    kind: "reliable",
                    topic: "removeVideoTrack",
                    destinationIdentities: [identity] // Only send to this participant
                  }        // Set to true for guaranteed delivery
              );
              this.$store.dispatch("removeParticipantFromLayout", removedParticipant);
              this.controlMeetingSending = false
              if (this.amIModerator) {
                this.sendNotifySubstituteSignal()
              } else {
                this.sendNotifyModeratorSignal()
              }
            }).catch(() => {
          this.eventBus.emit("notification", {
            title: "پیام",
            type: "error",
            bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
            time: 5000,
          });
          this.controlMeetingSending = false
        }).finally(() => {
          this.isMeetingsLoaded = true
          this.controlMeetingSending = false
        });
      } else {
        this.controlMeetingSending = false
      }

    },
    publishVideoAPIHandler(connectionId, targetUserId, name) {
      console.error(name)
      this.controlMeetingSending = true
      const index = this.subscribedTracksList.findIndex((user) => {
        return +user.userId === +targetUserId
      })
      if (index === -1) {
        const data = {
          targetUserId: targetUserId,
          connectionId: connectionId ? connectionId : '',
          meetingId: this.$store.getters.roomId,
          meetingType: !this.isPrivate ? 'public' : 'private',
          senderUserId: this.$store.getters.userId,
          actionType: 'openVideo',
          userRole: this.role,
        }
        this.restClientControlMeeting.openVideo(data)
            .then((res) => {
              //   this.$store.dispatch(
              //       'addAllConnection', data);
              // })

              const identity = name + '&&' + targetUserId

              if (res.data.data.unPublishUserId) {
                const unPublishIdentity = res.data.data.unPublishDisplayName + '&&' + res.data.data.unPublishUserId
                const unPublishMessage = JSON.stringify({action: 'unPublishParticipant'})
                const encodeUnPublishMessage = new TextEncoder().encode(unPublishMessage);
                this.room.localParticipant.publishData(
                    encodeUnPublishMessage,
                    {
                      kind: "reliable",
                      topic: "unPublishParticipant",
                      destinationIdentities: [unPublishIdentity] // Only send to this participant
                    }      // Set to true for guaranteed delivery
                );
                this.$store.dispatch("removeParticipantFromLayout", {
                  userId: res.data.data.unPublishUserId,
                  status: false
                });
              }
              const myUserId = this.$store.getters.userId.toString()

              if (+targetUserId === +this.$store.getters.userId) {
                if (!this.remoteTracksMap.has(myUserId)) {
                  this.publishToRoom()
                }
              }
              const openVideoTrackMessage = JSON.stringify({action: 'openVideoTrack'})
              const encodeOpenVideoTrack = new TextEncoder().encode(openVideoTrackMessage);
              this.room.localParticipant.publishData(
                  encodeOpenVideoTrack,
                  {
                    kind: "reliable",
                    topic: "openVideoTrack",
                    destinationIdentities: [identity] // Only send to this participant
                  }        // Set to true for guaranteed delivery
              );
              this.$store.dispatch("removeParticipantFromLayout", {userId: targetUserId, status: true});
              this.controlMeetingSending = false
              if (this.amIModerator) {
                this.sendNotifySubstituteSignal()
              } else {
                this.sendNotifyModeratorSignal()
              }
            }).catch(() => {
          this.eventBus.emit("notification", {
            title: "پیام",
            type: "error",
            bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
            time: 5000,
          });
          this.controlMeetingSending = false
        }).finally(() => {
          this.isMeetingsLoaded = true
          this.controlMeetingSending = false
        });
      } else {
        this.controlMeetingSending = false
      }
    },
    async handleTrackPublished() {
      this.isFirstSubscribe = false
    },
    async handleTrackSubscribed(track, publication, participant) {
      console.error('888888888888888888888888888888888888888888888888888888888888')
      console.error(this.room.remoteParticipants)
      const name = participant?.identity?.split('&&')[0]
      const userId = participant?.identity?.split('&&')[1]
      console.error('subscribeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      console.error(name)
      console.error(track.kind)
      console.error(track.source)
      console.error(track)
      if (track.kind === 'video' && track.source === "screen_share") {
        this.isScreenShared = true
        if (name) {
          this.shareSubscriberName = name
          this.sharedScreenUserId = userId
        }
        nextTick(async () => {
          // await this.$refs.layout.subscribeShareScreen(track)
          this.screenShareTrack = track
          this.updateLayout()
        })

      }
      if (track.kind === 'video' && track.source === "unknown") {
        this.isVideoShared = true
        if (name) {
          this.videoShareSubscriberName = name
          this.videoSharedScreenUserId = userId
        }
        nextTick(async () => {
          await this.$refs.layout.subscribeVideoSharing(track)
          this.updateLayout()
        })

      }
      if (track.kind === 'audio' && track.source === "unknown") {
        setTimeout(()=>{
          track.attach(this.$refs['sharedAudio'])
        },2000)

      }
      // console.error(track)
      // console.error(publication)
      // console.error(participant)

      // const index = this.subscribers.findIndex((user)=>{
      //   return user.track.sid !== participant.sid
      // })
      // if (index === -1){
      //   this.subscribers.push({track:track, name:participant.identity,videoStat:true})
      // }
      // if (publication.kind === 'au'){
      //
      // }\
      // if (publication.kind === 'audio'){
      //   this.remoteTracksMap.set(participant.sid, {
      //     track: publication,
      //     name: participant.identity,
      //     videoStat:true
      //   });
      // }else if (publication.kind === 'video'){
      //   this.remoteTracksMap.set(participant.sid, {
      //     track: publication,
      //     name: participant.identity,
      //     videoStat:true
      //   });
      // }
      // let publishIndex = -1
      // if (this.isFirstSubscribe){
      //   publishIndex = this.firstPublishList.findIndex((el)=>{
      //     return +el === +userId
      //   })
      // }

      // if(publishIndex > -1){
      if (this.remoteTracksMap.has(userId)) {
        console.error('haaaaaaaaaaaaaaaaas userId')
        let temp = this.remoteTracksMap.get(userId);
        if (track.kind === 'video' && track.source !== "screen_share" && track.source !== "unknown") {
          // publication?.setVideoQuality('high')
          temp = {
            ...temp,
            videoTrack: track,
            name: name,
            isCameraOn: !track.isMuted,
            userId: userId,
            pin: false
          };
        } else if (track.kind === 'audio' && track.source !== "screen_share"&& track.source !== "unknown") {
          temp = {
            ...temp,
            audioTrack: track,
            isMicOn: !track.isMuted,
            isMute: false,
            name: name,
            userId: userId,
          };
        }

        this.remoteTracksMap.set(userId, temp); // Update the Map
      } else {
        if (track.kind === 'video' && track.source !== "screen_share" && track.source !== "unknown") {
          // publication?.setVideoQuality('high')

          this.remoteTracksMap.set(userId, {
            videoTrack: track,
            name: name,
            isCameraOn: !track.isMuted,
            userId: userId,
            pin: false
          });
        } else if (track.kind === 'audio' && track.source !== "screen_share" && track.source !== "unknown") {
          this.remoteTracksMap.set(userId, {
            audioTrack: track,
            isMicOn: !track.isMuted,
            isMute: false,
            name: name,
            userId: userId,
            // isCameraOn:this.cameraStatus,
            // isMicOn:false
          });
        }

      }
      // }
      // else if(!this.isFirstSubscribe){
      //   if (this.remoteTracksMap.has(userId)){
      //     let temp = this.remoteTracksMap.get(userId);
      //     if (track.kind === 'video' && track.source !=="screen_share"){
      //       // publication?.setVideoQuality('low')
      //       temp = {...temp,
      //         videoTrack: track,
      //         name: name,
      //         isCameraOn:!track.isMuted,
      //         userId:userId,
      //         pin:false
      //       };
      //     }else if (track.kind === 'audio' && track.source !=="screen_share"){
      //       temp = {...temp,
      //         audioTrack: track,
      //         isMicOn:false,
      //         name: name,
      //         userId:userId,
      //       };
      //     }
      //     this.remoteTracksMap.set(userId, temp); // Update the Map
      //   }else {
      //     if (track.kind === 'video' && track.source !=="screen_share"){
      //       // publication?.setVideoQuality('low')
      //       this.remoteTracksMap.set(userId, {
      //         videoTrack: track,
      //         name: name,
      //         isCameraOn:!track.isMuted,
      //         userId:userId,
      //         pin:false
      //       });
      //     }else if (track.kind === 'audio' && track.source !=="screen_share"){
      //       this.remoteTracksMap.set(userId, {
      //         audioTrack: track,
      //         isMicOn:false,
      //         name: name,
      //         userId:userId,
      //         // isCameraOn:this.cameraStatus,
      //         // isMicOn:false
      //       });
      //     }
      //
      //   }
      // }
      // console.error(track)
      // console.error(participant)
      nextTick(() => {
        this.updateLayout()
      })
      console.error('3333333333333333333333333333333333333333333333333333333333333333333')
      let temp = this.remoteTracksMap.get(userId)
      console.error(temp.audioTrack)
      console.error(temp.videoTrack)
      // const array = Array.from(this.remoteTracksMap)
      // const splicedArr = array.slice()
      // console.error(splicedArr)
    },

    handleTrackUnsubscribed(track, publication, participant) {
      const userId = participant?.identity?.split('&&')[1]
      console.error(participant?.identity)
      if (this.remoteTracksMap.has(userId) && publication.kind === 'audio' && publication.source !== 'screen_share' && publication.source !== 'unknown') {
        let temp = this.remoteTracksMap.get(userId)
        console.error(this.room.remoteParticipants.get(participant?.identity)?.audioTrackPublications.size)
        console.error(temp.videoTrack)
        temp.audioTrack = null
        if (this.room.remoteParticipants.get(participant?.identity)?.videoTrackPublications.size === 0){
          this.remoteTracksMap.delete(userId);
        }else if(this.room.remoteParticipants.get(participant?.identity)?.videoTrackPublications.size > 0){

          let hasVideoTrack = false
          for (const key of this.room.remoteParticipants.get(participant?.identity).videoTrackPublications.keys()) {
            if (this.room.remoteParticipants.get(participant?.identity).videoTrackPublications.get(key).source !== 'screen_share' && this.room.remoteParticipants.get(participant?.identity).videoTrackPublications.get(key).source !== 'unknown') {
              hasVideoTrack = true

            }

          }

          if (hasVideoTrack){

            this.remoteTracksMap.set(userId, temp)
          }else {

            this.remoteTracksMap.delete(userId);
          }
        }else {
          this.remoteTracksMap.set(userId, temp)

        }
      }
      if (publication.source === 'screen_share') {
        this.isShared = false
        this.isScreenShared = false
        this.shareSubscriberName = null
        this.sharedScreenUserId = null
      } else if (this.remoteTracksMap.has(userId) && publication.kind === 'video' && publication.source !== 'unknown') {
        let temp = this.remoteTracksMap.get(userId)
        console.error('11111111111111111111111111111111111111111111111111111111111111111111111111')
        console.error('unpuuuuuuuuuuuuublishhhhhhhhhhhhhhhhhhhheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed')
        // console.error(publication.kind)
        // console.error(temp.audioTrack)
        // console.error(this.room.remoteParticipants.get(participant?.identity)?.videoTrackPublications.size)
        temp.videoTrack = null
        if (this.room.remoteParticipants.get(participant?.identity)?.audioTrackPublications.size === 0){
          console.error('11111111111111111111111111222222222222222222222222222222222222222222222222')
          this.remoteTracksMap.delete(userId);
        }else if(this.room.remoteParticipants.get(participant?.identity)?.audioTrackPublications.size > 0) {
          console.error('11111111111111111111111111133333333333333333333333333333333333333333333333')
          let hasAudioTrack = false
          for (const key of this.room.remoteParticipants.get(participant?.identity).audioTrackPublications.keys()) {
            if (this.room.remoteParticipants.get(participant?.identity).audioTrackPublications.get(key).source !== 'screen_share' && this.room.remoteParticipants.get(participant?.identity).audioTrackPublications.get(key).source !== 'unknown') {
              hasAudioTrack = true
              console.error('111111111111111111111111111111111444444444444444444444444444444444444444444')
            }
          }
          if (hasAudioTrack){
            console.error('111111111111111111111111111111111111155555555555555555555555555555555555')
            this.remoteTracksMap.set(userId, temp)
          }else {
            console.error('1111111111111111111111111111111111111166666666666666666666666666666666666666666666666666')
            this.remoteTracksMap.delete(userId);
          }

        }else {
          this.remoteTracksMap.set(userId, temp)
        }
      }


      else if (publication.source === 'unknown'){
        this.isVideoShared = false
        this.videoShareSubscriberName = null
        this.videoSharedScreenUserId = null
        this.sharedVideoTrack = null
        this.sharedAudioTrack = null
        this.videoShareStatus = false
      }
      // if (this.remoteTracksMap.has(userId) && publication.kind === 'audio') {
      //   if (!this.remoteTracksMap.get(userId)?.videoTrack?.kind === 'video'){
      //     setTimeout(()=>{
      //       this.remoteTracksMap?.delete(userId);
      //     },100)
      //
      //   }
      //
      // }
      if (!this.room.remoteParticipants.get(participant?.identity)?.audioTrackPublications && !this.room.remoteParticipants.get(participant?.identity)?.videoTrackPublications){
        console.error('88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888')
        this.remoteTracksMap.delete(userId)
      }
      console.error('22222222222222222222222222222222222222222222222222222222222222222222222')
      console.error(this.room.remoteParticipants.get(participant?.identity))
      console.error(this.remoteTracksMap)
      nextTick(() => {
        this.updateLayout();
      })
    },
    updateParticipantCameraStatus(participantId, isCameraOn) {
      if (this.remoteTracksMap.has(participantId)) {
        const participant = this.remoteTracksMap.get(participantId);
        participant.isCameraOn = isCameraOn;
        this.remoteTracksMap.set(participantId, participant); // Update the Map
      }
    },
    updateParticipantMicStatus(participantId, isMicOn) {
      if (this.remoteTracksMap.has(participantId)) {
        const participant = this.remoteTracksMap.get(participantId);
        participant.isMicOn = isMicOn;
        this.remoteTracksMap.set(participantId, participant); // Update the Map
      }
    },
    openMyMicrophone(publishFlag) {
      this.setMicrophneStateForReconnect(true)
      if (publishFlag === 'publish') {
        this.publishToRoom()
      }
      this.setMicControlAllowed(true);
      this.handStatus = "granted";
      this.setHandStatus("granted")
      if (!this.amISubstitutionModerator && !this.amIModerator) {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "success",
          bodyText: this.$t("moderator_unmute_your_mic"),
          time: 3000,
        });
      }

    },
    async closeMyMicrophone() {
      this.setMicState(false);
      this.setMicControlAllowed(false);
      await this.room.localParticipant.setMicrophoneEnabled(false);
      if (!this.amISubstitutionModerator && !this.amIModerator) {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "warning",
          bodyText: this.$t("moderator_mute_your_mic"),
          time: 3000,
        });
      }
      if (this.handStatus === "granted") {
        this.handStatus = "none";
        this.setHandStatus("none")
      }
    },
    openMyCamera() {
      this.setCameraControlAllowed(true);
      if (!this.amISubstitutionModerator && !this.amIModerator) {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "success",
          bodyText: this.$t("moderator_unmute_your_camera"),
          time: 3000,
        });
      }
    },
    async closeMyCamera() {
      this.setCameraControlAllowed(false);
      this.setCameraState(false);
      await this.room.localParticipant.setCameraEnabled(false);
      if (!this.amISubstitutionModerator && !this.amIModerator) {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "warning",
          bodyText: this.$t("moderator_mute_your_camera"),
          time: 3000,
        });
      }

    },

    handRequestCanceledReceived(userId) {
      if (this.$store.getters.userRoleInMeeting === 'MODERATOR' || this.$store.getters.userRoleInMeeting === 'SUBSTITUTION') {
        this.$store.dispatch('participantHandCancelByConnectionId', userId)

      }
    },
    shareAccess() {
      if (!this.amISubstitutionModerator && !this.amIModerator) {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "success",
          bodyText: this.$t("moderator_unmute_your_share"),
          time: 3000,
        });
      }
      this.screenShareAllowed = true;
      this.setShareStatus(false);
      this.shareStatus = false;
    },
    shareAccessDenied() {
      this.screenShareAllowed = false;
      this.setShareStatus(false);
      this.videoShareStatus = false
      if (this.isVideoShared){
        this.stopVideoSharing()
      }
      if (this.isScreenShared) {
        this.stopShare()
      }
      if (!this.amISubstitutionModerator && !this.amIModerator && this.screenShareAllowed) {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "warning",
          bodyText: this.$t("moderator_mute_your_share"),
          time: 3000,
        });
      }


    },
    setHandRequest(userId, actionType) {
      if (actionType === "WAITING") {
        this.$store.dispatch('participantHandRequest', {userId})
      } else {
        this.$store.dispatch('participantHandCancel', {userId})
      }

    },
    //others get who is pinned
    pinUser(userId) {
      console.error('ppppppppppppppppppppppppppiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiin')
      console.error(userId)
      console.error(this.$store.getters.userId)
      console.error(this.remoteTracksMap)
      this.retryToPin++
      console.error("pin by connection id: " + userId)
      this.pinnedP = userId;
      if (this.remoteTracksMap?.has(userId)) {
        this.retryToPin = 0
        let pinnedSubscriber = this.remoteTracksMap?.get(userId)
        if (pinnedSubscriber) {
          pinnedSubscriber = {
            ...pinnedSubscriber,
            pin: true
          };
          this.remoteTracksMap.set(userId, pinnedSubscriber); // Update the Map
          console.error("pinnedSubscriber: " + pinnedSubscriber)
          this.onParticipantPinned(userId);
        }
      } else if (this.retryToPin <= 3) {
        this.pinUser(userId)
      }
    },
    //others get who is unpinned
    unPinUser(userId) {
      this.$store.dispatch('participantUnPinned', {userId})
      this.pinnedParticipant = null;
      this.pinnedP = null
      if (this.remoteTracksMap?.has(userId)) {
        let pinnedSubscriber = this.remoteTracksMap?.get(userId)
        if (pinnedSubscriber) {
          pinnedSubscriber = {
            ...pinnedSubscriber,
            pin: false
          };
          this.remoteTracksMap.set(userId, pinnedSubscriber); // Update the Map
        }
      }
    },
    kickOff() {
      this.leaveSession()
    },
    updateUserListState() {
      this.controlMeetingSending = true
      this.restClientControlMeeting.getUserList(this.$store.getters.roomId)
          .then((res) => {
            this.$store.dispatch("setParticipants", res.data.data);
            this.controlMeetingSending = false
          }).catch(() => {
        console.error("updateSubstitutionModeratorState failed")
        this.controlMeetingSending = false
      })
    },
    ModeratorJoinedSignal(name) {
      this.moderator_name = name
      this.moderator_joined = true
      // this.moderator_connection_id = participant.connectionId
      this.eventBus.emit("notification", {
        title: "پیام",
        type: "success",
        bodyText: 'مدیر وارد جلسه شد',
        time: 3000,
      });
    },
    subModeratorJoinedSignal(name) {
      this.sub_moderator_name = name
    },
    async removeVideoTrack() {
      if (this.room.localParticipant?.videoTrackPublications?.size > 0 || this.room.localParticipant?.audioTrackPublications?.size > 0) {
        this.setMicControlAllowed(false);
        this.setMicState(false);
        this.setMicrophneStateForReconnect(false)
        this.handStatus = "none";
        this.setHandStatus("none")
        // this.screenShareAllowed = false;
        // if (this.isShared) {
        //   this.stopShare();
        // }
        await this.unPublishTrack({isRepublish:false});
      }
    },
    // bringVideo() {
    //   // const iCantPublish = JSON.stringify({action: 'iCantPublish'})
    //   // const encodeiCantPublish = new TextEncoder().encode(iCantPublish);
    //   // this.room.localParticipant.publishData(
    //   //     encodeiCantPublish,
    //   //     {
    //   //       kind: "reliable",
    //   //       topic: "iCantPublish",
    //   //       destinationIdentities: [] // Only send to this participant
    //   //     })
    //   if (!this.remoteTracksMap.has(this.$store.getters.userId)) {
    //     this.publishToRoom()
    //   }
    //   // this.$store.dispatch("removeParticipantFromLayout",data );
    // },
    participantJoinedSignal(data) {
      if (data?.userRole === 'SUBSTITUTION' || data?.userRole === 'MODERATOR') {
        this.sub_moderator_connection_id = data?.connectionId
      }
      this.$store.dispatch('participantJoined', data)
      this.$store.dispatch('participantJoinedForChatList', data)
    },
    userLeftSignal(id) {
      console.error(" user left signal with user id : " + id)
      this.$store.dispatch('participantLeaved', {userId: id})
      this.$store.dispatch('participantLeftForChatList', {userId: id})
    },
    handleParticipantDisconnected(participant){
      const userId = participant?.identity?.split('&&')[1]
      if (+userId !== +this.$store.getters.userId) {
        this.userLeftSignal(userId)
        const randomTime = Math.floor(Math.random() * (1500 - 499)) + 500
        console.error(randomTime)
        setTimeout(() => {
          console.error('sendPublishListSignal')
          this.sendPublishListSignal()
        }, randomTime)
      }
      if (+userId === +this.$store.getters.moderatorId){
        this.moderator_joined = false
      }
    },
    handleTrackMuted(track, participant){
      const userId = participant?.identity?.split('&&')[1]
      if (track.kind === 'audio') {
        this.updateParticipantMicStatus(userId, false);
      } else if (track.kind === 'video') {
        this.updateParticipantCameraStatus(userId, false);
      }
    },
    handleTrackUnmuted(track, participant){
      const userId = participant?.identity?.split('&&')[1]
      if (track.kind === 'audio') {
        this.updateParticipantMicStatus(userId, true);
      } else if (track.kind === 'video') {
        this.updateParticipantCameraStatus(userId, true);
      }
    },
    handleActiveSpeaker(speakers){
      console.error('#########################################################################################')
      console.error(speakers)
      console.error(speakers[0]?.identity?.split('&&')[0])
      if (speakers.length > 1) {
        for (let i=0; i < speakers.length ; i++){
          if (speakers[i].audioTrackPublications.size > 0){
            this.activeSpeaker = speakers[i]?.identity?.split('&&')[0]
            break
          }
        }
        // console.error(speakers[0]?.identity)

      }else if (speakers.length > 0){
        this.activeSpeaker = speakers[0]?.identity?.split('&&')[0]
      }
      if (this.activeSpeakerMode && this.layoutType === 'filmStrip') {
        let foundIdx = this.subscribedTracksList.findIndex(
            (subscriber) => {
              console.error(subscriber.name)
              console.error(this.activeSpeaker)
              return subscriber.name === this.activeSpeaker
            }
        );
        if (foundIdx >= 0) {
          [this.subscribedTracksList[0], this.subscribedTracksList[foundIdx]] = [
            this.subscribedTracksList[foundIdx],
            this.subscribedTracksList[0],
          ];

        }
      }
    },
    async joinToRoom() {
      this.isLoading = true
      this.isEntranceButtonActive = false
      this.room = new Room();
      this.room.on(RoomEvent.DataReceived, (payload) => {
        this.listenToCustomLiveKitMessages(payload)
      });
      this.room.on(RoomEvent.ParticipantDisconnected, (participant) => {
        this.handleParticipantDisconnected(participant)
      });
      this.room.on(RoomEvent.Disconnected, () => {
        if (this.$store.getters.meetingType === "public") {
          window.location.href = config.MEETING_ENDED;
        } else if (this.$store.getters.meetingType === "private") {
          window.location.href = config.MEETING_ENDED;
        } else {
          window.location.href = config.CALENDAR_URL;
        }
      });
      this.room.on(RoomEvent.Reconnecting, () => {
        this.isReconnecting = true
      });
      this.room.on(RoomEvent.Reconnected, () => {
        // setTimeout(()=>{
        this.isReconnecting = false
        this.reconnectParticipant()
        // },1000)


      });
      //
      this.room.on(RoomEvent.ConnectionStateChanged, (ConnectionState) => {
        if (ConnectionState === 'signalReconnecting') {
          this.isReconnecting = true
        }
      });
      // this.room.on(RoomEvent.Disconnected, (track,participant) => {
      //   console.error('disconecteeeeeeeeeeeeeeeeeeeeeeeeeed')
      //   console.error(track)
      //   console.error(participant)
      // });
      this.room.on(RoomEvent.TrackMuted, (track, participant) => {
        this.handleTrackMuted(track, participant)

      });

      this.room.on(RoomEvent.TrackUnmuted, (track, participant) => {
        this.handleTrackUnmuted(track, participant)
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.room.on(RoomEvent.TrackPublished, this.handleTrackPublished);
      this.room.on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed);
      this.room.on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed);
      this.room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        this.handleActiveSpeaker(speakers)

        // Speakers contain all of the current active speakers
      });
      try {
        await this.getTokenAndConnectToRoom()
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        this.showAgendaComponent = true
        window.addEventListener("resize", () => {
          clearTimeout(this.resizeTimer);
          this.resizeTimer = setTimeout(() => {
            this.screenHeight = window.innerHeight;
            this.screenWidth = window.innerWidth;
            this.screenSizeChanged = this.screenSizeChanged + 1
            // if (window.innerHeight >= screen.height){
            //   this.isScreenFullSize = true
            // }else {
            //   this.isScreenFullSize = false
            // }
            nextTick(()=>{
              this.screenSizeChanged = this.screenSizeChanged + 1
            })
            this.updateLayout();
          }, 50);
        });
        // localTrack.value = room.value.localParticipant.videoTrackPublications.values().next().value.videoTrack;
      } catch (error) {
        this.isEntranceButtonActive = true
        console.error('There was an error connecting to the room:', error?.message);
        await this.leaveRoom();
      }
      this.republishWhenRepluggedDevice()
      // window.addEventListener('beforeunload', async ()=>{
      //   await this.leaveRoom()
      // });
    },
    async getTokenAndConnectToRoom(){
      let vrAddress = ''
      if (this.amIGuestUser) {
        vrAddress = this.$store.getters.vrAddress?.split(':')[1]?.split('//')[1]
      } else {
        vrAddress = auth?.getVrAddress()?.split(':')[1]?.split('//')[1]
      }

      const vrPort = 3478
      const iceServers = [
        {urls: "stun:" + vrAddress + ":" + vrPort, username: "USER", credential: "PASS"},
        {
          urls: [
            "turn:" + vrAddress + ":" + vrPort,
            "turn:" + vrAddress + "?transport=tcp"],
          username: "USER",
          credential: "PASS"
        },
      ]
      // Get a token from your application server with the room name and participant name
      this.token = await this.getToken(this.$store.getters.roomId + '', this.$store.getters.displayName + '&&' + this.$store.getters.userId);
      // Connect to the room with the LiveKit URL and the token
      // await this.room.connect(this.LIVEKIT_URL, this.token,{
      //   autoSubscribe: false,
      // }
      await this.room.connect(this.LIVEKIT_URL, this.token, {
        rtcConfig: {
          iceServers: iceServers,
        },
      });
      this.mySid = this.room.localParticipant.sid
      this.deviceTestModalIsVisible = false;
      nextTick(() => {
        this.updateLayout()
      })
      this.isEntranceButtonActive = true
    },
    listenToCustomLiveKitMessages(payload){
      const decodedString = new TextDecoder().decode(payload);
      const message = JSON.parse(decodedString)
      switch (message.action) {
        case 'participantJoined':
          this.participantJoinedSignal(message);
          break;
        case "openMic":
          this.openMyMicrophone(message.publishStatus);
          break;
        case "closeMic":
          this.closeMyMicrophone();
          break;
        case "openCamera":
          this.openMyCamera();
          break;
        case "closeCamera":
          this.closeMyCamera();
          break;
        case 'unPublishParticipant':
          this.unPublishTrack({isRepublish:false});
          break;
        case 'moderatorJoined':
          this.ModeratorJoinedSignal(message.name);
          break;
        case 'subModeratorJoined':
          this.subModeratorJoinedSignal(message.name);
          break;
        case 'openVideoTrack':
          console.error(this.remoteTracksMap.has(this.$store.getters.userId.toString()))
          if (!this.remoteTracksMap.has(this.$store.getters.userId.toString())) {
            this.publishToRoom()
          }
          break;
        case 'removeVideoTrack':
          console.error(this.remoteTracksMap.has(this.$store.getters.userId.toString()))
          this.removeVideoTrack();
          break;
        case 'enableSubstitutionModerator':
          this.enableSubstitutionModerator();
          break;
        case "handRequest":
          this.setHandRequest(message.userId, message.status);
          break;
        case "handRequestCanceled":
          this.handRequestCanceledReceived(message.userId)
          break;
        case "disableSubstitutionModerator":
          this.disableSubstitutionModerator();
          break;
        case "shareAccessDenied":
          this.shareAccessDenied();
          break;
        case "shareAccess":
          this.shareAccess();
          break;
        case "pin":
          this.pinUser(message.userId);
          break;
        case "unPin":
          this.unPinUser(message.userId);
          break;
        case "kick-out":
          this.kickOff();
          break;
        case "syncUserList":
          this.updateUserListState();
          break;
        case "moderatorSharedScreen":
          if (this.shareStatus) {
            this.stopShare();
            this.shareStatus = false;
            this.videoShareStatus = false
            this.webSocketClient?.shareStop();
          }
          if (this.videoShareStatus){
            this.stopVideoSharing()
          }
          this.pinUser(message.userId);
          break;
        case "maximizeActiveSpeakerView":
          this.isActiveSpeakerMaximized = true
          this.isModeratorMaximizeActiveSpeaker = true
          break;
        case "minimizeActiveSpeakerView":
          this.isActiveSpeakerMaximized = false
          this.isModeratorMaximizeActiveSpeaker = false
          break;
        case "extend-meeting-agenda-time":
          this.eventBus.emit('send-signal-to-edit-agenda')
          console.error('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv')
          break;
      }
    },
    getCurrentTimeFormatted() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');

      return `${hours}:${minutes}:${seconds}`;
    },
    async publishToRoom() {
      // --- Initialization ---
      let hasPublishedVideo = false;
      let hasPublishedAudio = false;
      let previousVideoTrack = null;
      let previousAudioTrack = null;
      this.videoLocalTrack = null;

      // --- Check for existing published video track ---
      for (const key of this.room.localParticipant.videoTrackPublications.keys()) {
        const publication = this.room.localParticipant.videoTrackPublications.get(key);
        if (publication.source === 'camera') {
          hasPublishedVideo = true;
          previousVideoTrack = publication.track;
          break;
        }
      }

      // --- Check for existing published audio track ---
      for (const key of this.room.localParticipant.audioTrackPublications.keys()) {
        const publication = this.room.localParticipant.audioTrackPublications.get(key);
        hasPublishedAudio = true;
        previousAudioTrack = publication.track;
        break;
      }

      // --- Helper: Update remoteTracksMap for video ---
      const updateRemoteVideoTrack = (videoTrackPublication) => {
        const userId = this.$store.getters.userId.toString();
        const displayName = this.$store.getters.displayName;
        const cameraStatus = this.cameraStatus;
        const trackObj = {
          videoTrack: videoTrackPublication,
          name: displayName,
          isCameraOn: cameraStatus,
          userId,
          pin: false
        };
        if (this.remoteTracksMap.has(userId)) {
          this.remoteTracksMap.set(userId, {
            ...this.remoteTracksMap.get(userId),
            ...trackObj
          });
        } else {
          this.remoteTracksMap.set(userId, trackObj);
        }
      };

      // --- Helper: Update remoteTracksMap for audio ---
      const updateRemoteAudioTrack = (audioTrackPublication) => {
        const userId = this.$store.getters.userId.toString();
        const trackObj = {
          audioTrack: audioTrackPublication,
          isMicOn: false
        };
        if (this.remoteTracksMap.has(userId)) {
          this.remoteTracksMap.set(userId, {
            ...this.remoteTracksMap.get(userId),
            ...trackObj
          });
        } else {
          this.remoteTracksMap.set(userId, trackObj);
        }
      };

      // --- Publish Video Track ---
      try {
        if (!hasPublishedVideo) {
          // Create and publish a new local video track
          this.videoLocalTrack = await createLocalVideoTrack({
            deviceId: this.$store.getters.cameraId,
            resolution: { width: 480, height: 320, frameRate: 15 },
          });
          if (this.videoLocalTrack?.source === 'camera') {
            if ( this.maxVidBw <= 120){
              await this.room.localParticipant.publishTrack(this.videoLocalTrack, {
                simulcast: false, // Disable simulcast,
                videoEncoding: {
                  maxBitrate: 100000, // Set max bitrate (in bps)
                  maxFramerate: 15, // Set frame rate
                  scaleResolutionDownBy: 1, // Keep original resolution
                }
              })
            }else if ( this.maxVidBw >= 120 && this.maxVidBw < 180){
              await this.room.localParticipant.publishTrack(this.videoLocalTrack, {
                simulcast: false, // Disable simulcast,
                videoEncoding: {
                  maxBitrate: 130000, // Set max bitrate (in bps)
                  maxFramerate: 15, // Set frame rate
                  scaleResolutionDownBy: 1, // Keep original resolution
                }
              })
            }else if (  this.maxVidBw < 250 && this.maxVidBw >= 180){

              await this.room.localParticipant.publishTrack(this.videoLocalTrack, {
                simulcast: false, // Disable simulcast,
                videoEncoding: {
                  maxBitrate: 150000, // Set max bitrate (in bps)
                  maxFramerate: 15, // Set frame rate
                  scaleResolutionDownBy: 1, // Keep original resolution
                }
              })
            }else if ( this.maxVidBw < 400 && this.maxVidBw >= 250){
              await this.room.localParticipant.publishTrack(this.videoLocalTrack, {
                simulcast: false, // Disable simulcast,
                videoEncoding: {
                  maxBitrate: 175000, // Set max bitrate (in bps)
                  maxFramerate: 15, // Set frame rate
                  scaleResolutionDownBy: 1, // Keep original resolution
                }
              })
            }
            else if (  this.maxVidBw < 600 && this.maxVidBw >= 400){

              await this.room.localParticipant.publishTrack(this.videoLocalTrack, {
                simulcast: false, // Disable simulcast,
                videoEncoding: {
                  maxBitrate: 2000000, // Set max bitrate (in bps)
                  maxFramerate: 15, // Set frame rate
                  scaleResolutionDownBy: 1, // Keep original resolution
                }
              })
            }else if (this.maxVidBw >= 600){
              await this.room.localParticipant.publishTrack(this.videoLocalTrack, {
                simulcast: false, // Disable simulcast,
                videoEncoding: {
                  maxBitrate: 3000000, // Set max bitrate (in bps)
                  maxFramerate: 15, // Set frame rate
                  scaleResolutionDownBy: 1, // Keep original resolution
                }
              })
            }
          }
        } else {
          // Re-publish the previous video track
          this.videoLocalTrack = previousVideoTrack;
          await this.room.localParticipant.publishTrack(previousVideoTrack);
        }
      } catch (e) {
        console.error('Error publishing video track:', e);
      }

      // --- Publish Audio Track ---
      try {
        if (!hasPublishedAudio) {
          this.audioLocalTrack = await createLocalAudioTrack({
            deviceId: this.$store.getters.microphoneId,
          });
          if (this.audioLocalTrack) {
            try {
              await this.audioLocalTrack.disable();
            } catch (e) {
              console.error('Error disabling new audio track:', e);
            }
            await this.room.localParticipant.publishTrack(this.audioLocalTrack);
            setTimeout(() => {
              this.room.localParticipant.setMicrophoneEnabled(!!this.micStatus);
              this.setMicState(false);
            }, 100);
          }
        } else {
          this.audioLocalTrack = previousAudioTrack;
          if (this.audioLocalTrack) {
            try {
              await this.audioLocalTrack.disable();
            } catch (e) {
              console.error('Error disabling previous audio track:', e);
            }
            await this.room.localParticipant.publishTrack(this.audioLocalTrack);
            setTimeout(() => {
              this.room.localParticipant.setMicrophoneEnabled(false);
            }, 100);
          }
        }
      } catch (e) {
        console.error('Error publishing audio track:', e);
      }

      // --- Update remoteTracksMap for video ---
      for (const key of this.room.localParticipant.videoTrackPublications.keys()) {
        const publication = this.room.localParticipant.videoTrackPublications.get(key);
        if (publication.source === 'camera' && this.videoLocalTrack?.source === 'camera') {
          updateRemoteVideoTrack(publication);
        }
      }
      await this.room.localParticipant.setCameraEnabled(this.cameraStatus);

      // --- Update remoteTracksMap for audio ---
      if (this.audioLocalTrack) {
        const audioPublication = this.room.localParticipant.audioTrackPublications.values().next().value;
        updateRemoteAudioTrack(audioPublication);
      }

      // --- Finalize ---
      this.publishStatus = true;
      nextTick(() => {
        this.updateLayout();
      });
    },
    async unPublishTrack(data) {

      if (this.room.localParticipant.videoTrackPublications.size > 0) {
        for (const publication of this.room.localParticipant.videoTrackPublications.values()) {
          const track = publication.track;
          if (track) {
            await this.room.localParticipant.unpublishTrack(track);
            track.stop(); // optional: stop the media stream
          }
        }
        // this.videoLocalTrack.stop(); // Stops the track
        // await this.room.localParticipant.unpublishTrack(this.videoLocalTrack, true);
        // this.videoLocalTrack.stop()
        this.videoLocalTrack = null;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      if (this.room.localParticipant.audioTrackPublications.size > 0) {
        // this.audioLocalTrack.stop(); // Stops the track
        for (const publication of this.room.localParticipant.audioTrackPublications.values()) {
          const track = publication.track;
          if (track) {
            await this.room.localParticipant.unpublishTrack(track);
            track.stop(); // optional: stop the media stream
          }
        }
        // await this.room.localParticipant.unpublishTrack(this.audioLocalTrack, true);
        // this.audioLocalTrack.stop()
        this.audioLocalTrack = null;
      }

      this.publishStatus = false;
      if (!data.isRepublish){
        this.setMicState(false);
        this.setMicControlAllowed(false);
      }

      await this.room.localParticipant.setMicrophoneEnabled(false);
      if (this.handStatus === "granted") {
        this.handStatus = "none";
        this.setHandStatus("none")
      }
      await this.room.localParticipant.setCameraEnabled(false);
      // Remove from remote participants' track map
      const myUserId = this.$store.getters.userId.toString()
      if (this.remoteTracksMap.has(myUserId)) {
        this.remoteTracksMap.delete(myUserId);
      }
      if (data.isRepublish){
        console.error('isssssssssssssssssssssssssss republiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiish')
        setTimeout(()=>{
          this.publishToRoom()
        },1000)
      }

    },
    async republish(){
      await this.unPublishTrack({isRepublish:true})
    },

    // configureUrls() {
    //   // If APPLICATION_SERVER_URL is not configured, use default value from OpenVidu Local deployment
    //   if (!this.APPLICATION_SERVER_URL) {
    //     if (window.location.hostname === 'localhost') {
    //       this.APPLICATION_SERVER_URL = 'http://192.168.7.54:6080/';
    //     } else {
    //       this.APPLICATION_SERVER_URL = 'http://192.168.7.54:6080/';
    //     }
    //   }
    //   // If LIVEKIT_URL is not configured, use default value from OpenVidu Local deployment
    //   if (!this.LIVEKIT_URL) {
    //     if (window.location.hostname === 'localhost') {
    //       this.LIVEKIT_URL = 'https://openvidu.shooka.com';
    //     } else {
    //       this.LIVEKIT_URL = 'https://openvidu.shooka.com';
    //     }
    //   }
    // },
    async getToken(roomName, participantName) {
      const response = await fetch(this.APPLICATION_SERVER_URL + 'token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomName,
          participantName
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get token: ${error.errorMessage}`);
      }
      const data = await response.json();
      return data.token;
    },
    async reconnectParticipant() {
      // let publishedParticipants = []
      // try {
      //    publishedParticipants = await this.getPublishList()
      // }catch (err){
      //   console.error(err)
      // }

      const onlineParticipants = this.$store.getters.participants.filter(participant => participant?.participantStatus === 'ONLINE')
      // console.error(publishedParticipants)
      // console.error(publishedParticipants.length)

      // if ( (onlineParticipants.length === 1) && (publishedParticipants.length >= 0) ){
      if (onlineParticipants.length === 1) {
        if (this.$store.getters.meetingType === "public") {
          window.location.href = config.MEETING_ENDED;
        } else if (this.$store.getters.meetingType === "private") {
          window.location.href = config.MEETING_ENDED;
        } else {
          window.location.href = config.CALENDAR_URL;
        }
      } else {
        await this.initiateWebSocket()
        // }

      }
    },
    userInForGround(connectionId, targetUserId) {
      this.controlMeetingSending = true
      const index = this.subscribedTracksList.findIndex((user) => {
        return +user.userId === +targetUserId
      })
      if (index === -1) {
        const data = {
          targetUserId: targetUserId,
          connectionId: connectionId ? connectionId : '',
          meetingId: this.$store.getters.roomId,
          meetingType: !this.isPrivate ? 'public' : 'private',
          senderUserId: this.$store.getters.userId,
          actionType: 'openVideo',
          userRole: this.role,
        }
        this.restClientControlMeeting.userInForGround(data)
            .then().catch(() => {
          this.eventBus.emit("notification", {
            title: "پیام",
            type: "error",
            bodyText: this.$t('please-try-again'),
            time: 5000,
          });
          this.controlMeetingSending = false
        }).finally(() => {
          this.isMeetingsLoaded = true
          this.controlMeetingSending = false
        });
      } else {
        this.controlMeetingSending = false
      }
    },
    userInBackGround(connectionId, targetUserId) {
      this.controlMeetingSending = true
      const index = this.subscribedTracksList.findIndex((user) => {
        return +user.userId === +targetUserId
      })
      if (index === -1) {
        const data = {
          targetUserId: targetUserId,
          connectionId: connectionId ? connectionId : '',
          meetingId: this.$store.getters.roomId,
          meetingType: !this.$store.getters.isPrivate ? 'public' : 'private',
          senderUserId: this.$store.getters.userId,
          actionType: 'openVideo',
          userRole: this.role,
        }
        this.restClientControlMeeting.userInBackGround(data)
            .then().catch(() => {
          this.eventBus.emit("notification", {
            title: "پیام",
            type: "error",
            bodyText: this.$t('please-try-again'),
            time: 5000,
          });
          this.controlMeetingSending = false
        }).finally(() => {
          this.isMeetingsLoaded = true
          this.controlMeetingSending = false
        });
      } else {
        this.controlMeetingSending = false
      }
    },
    removeFromLayout(id){
      setTimeout(()=>{
        if (this.remoteTracksMap.has(id)){
          this.remoteTracksMap.delete(id)
        }
      },100)

    },
    stopClientRecording(){
      this.isClientRecordingStart = false
      this.isMeetingInRecordingMode = !!this.$store.getters.egressId
      stopCapture()
    },
    startClientRecording(){
      this.isClientRecordingStart = true
      this.isMeetingInRecordingMode = true
      this.isRecordModalopend = false
      const element = this.$el;
      startCapture(element, this.micStatus)
    },
    startServerRecording(){
      if (this.sending){
       console.log('you can not start recording')
      }else {
        this.sending = true
        const currentDate = new Date
        const jalaliNow = momentJalali(currentDate).format('jYYYY/jMM/jDD HH:mm:ss');
        this.controlMeetingSending = true

        const data = {
          customerId: auth.getCustomerId(),
          customerName: this.$store.getters.tenant,
          meetingName: this.$store.getters.session_name,
          meetingTime: jalaliNow,
          roomName: this.$store.getters.roomId,
        }
        this.restClientControlMeeting.startRecording(data).then((res) => {
          this.isMeetingInRecordingMode = true
          this.sending = false
          this.isRecordModalopend = false
          this.$store.dispatch('saveEgressID', res.data)
          this.webSocketClient.sendEgressId(true, res?.data)
          this.openRecordModal = false
          // this.miniDropDownItemsSubstitutionModeratorDesktop[0].label = this.$t("stop-recording");
          // this.miniDropDownItemsModeratorDesktop[0].label = this.$t("stop-recording");
          // this.miniDropDownItemsModeratorDesktopPrivate[0].label = this.$t("stop-recording");
        }).catch(() => {
          this.sending = false
          this.openRecordModal = false
          this.eventBus.emit("notification", {
            title: "پیام",
            type: "error",
            bodyText: this.$t('please-try-again'),
            time: 5000,
          });
          this.controlMeetingSending = false
        }).finally(() => {
          this.isMeetingsLoaded = true
          this.controlMeetingSending = false
          this.openRecordModal = false
        });
      }

    },
    stopServerRecording(){
      localStorage.setItem('isRecording', 'false')
      this.isRecording = false
      this.recordStatus = true;
      const data = {
        customerId: +auth.getCustomerId(),
        egressId: this.$store.getters.egressId,
      }
      this.restClientControlMeeting.stopRecording(data)
          .then((RES) => {
            this.isMeetingInRecordingMode = false
            this.isRecordModalopend = !!this.isClientRecordingStart
            this.$store.dispatch('saveEgressID', null)
            console.log('meeting recorded with file name : ' + RES.data.recording.name)
          }).catch(() => {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: this.$t('please-try-again'),
          time: 5000,
        });
      }).finally(() => {

      });
    },

    setRecordingType(e){
      this.recordingType = e.target.value
    },
    async initiateWebSocket(){
      try {
        let name = ''
        if (this.amIGuestUser){
          name =  this.$store.getters.displayName + " " + "(مهمان)"
        }else {
          name =  this.$store.getters.displayName
        }
        this.webSocketClient = await WebSocketClient.getInstance(
            this.$store.getters.roomId,
            this.$store.getters.userId,
            name,
            this.$store.getters.amIModerator,
            false,
            this.$store.getters.amIModeratorSubstitute,
            this.amIGuestUser,
            this.$store.getters.isPrivate
        );
        await this.webSocketClient?.connect();
        const connected = await this.webSocketClient?.getConnected();
        if (!connected) {
          this.eventBus.emit("notification", {
            title: "پیام",
            type: "warning",
            bodyText: this.$t("unable-connect"),
            time: 3000,
          });
          this.webSocketClient?.iWantToLeave(this.$store.getters.userId);
          this.webSocketClient?.disconnect();
          if (this.amIGuestUser){
            window.location.href = `${window.location.origin}/MeetingEnded`;
          }else {
            window.location.href = `${window.location.origin}/calendar/calendar`;
          }
        }
        // await this.webSocketClient.sendMyConnectionId(
        //     id
        // );
        // this.webSocketClient.successPublish(0);
        // await this.webSocketClient.isPublisher();
        this.isWebSocketConnected = true
        setTimeout(()=>{
          this.eventBus.emit('joined-successfully')
        },1000)
      }catch (error){
        console.error(error)
        this.isLoading = false
        if (this.amIGuestUser){
          window.location.href = `${window.location.origin}/MeetingEnded`;
        }else {
          window.location.href = `${window.location.origin}/calendar/calendar`;
        }
      }



    },
    // joinToRoomAsGuest(data){
    //   this.restClientControlMeeting.iWantToJoinAsGuest(
    //       this.$store.getters.roomId,
    //       this.$store.getters.displayName + " " + "(مهمان)",
    //       this.$store.getters.password,
    //       this.$store.getters.userId,
    //       this.$store.getters.customerId
    //   ).then(()=>{
    //     if (+JSON.parse(localStorage?.getItem("answerProceeding"))?.roomId === +this.$store.getters.roomId && JSON.parse(localStorage?.getItem("answerProceeding"))?.isAnswered.toString() === 'true') {
    //       this.isProceedingsAnswered = true
    //       this.isProceedingsCreated = true
    //       // this.eventBus.emit('is-proceedings-answered')
    //       this.isConfirmedProceedings = JSON.parse(localStorage?.getItem("answerProceeding"))?.isConfirmed
    //     } else if (+JSON.parse(localStorage?.getItem("answerProceeding"))?.roomId === +this.$store.getters.roomId && JSON.parse(localStorage?.getItem("answerProceeding"))?.isAnswered.toString() === 'false') {
    //       this.isProceedingsAnswered = false
    //       this.isProceedingsCreated = true
    //       // this.eventBus.emit('is-proceedings-answered')
    //       this.isConfirmedProceedings = JSON.parse(localStorage?.getItem("answerProceeding"))?.isConfirmed
    //     }
    //     this.initiateWebSocket(data)
    //   }).catch((error) => {
    //     this.eventBus.emit("notification", {
    //       title: "پیام",
    //       type: "warning",
    //       bodyText: this.$t("there-is-some-problem"),
    //       time: 5000,
    //     });
    //     setTimeout(()=>{
    //       window.location.href = `${window.location.origin}/MeetingEnded`;
    //     },5000)
    //     console.error(error)
    //   })
    // },
    unreadGroupChat() {
      this.unreadGroupChatLength = this.allPublicChats.length
    },
    unreadPrivateChat() {
      let counter = 0
      this.participantsInMyChatList.forEach((el) => {
        counter += el.unreadMessages.length
      })
      this.unreadPrivateChatLength = counter
    },
    sendChat(participant, message) {
      const idx = this.participantsInMyChatList.findIndex((el) => {
        return +el.participantId === +participant.participantId
      })
      if (idx !== -1) {
        this.participantsInMyChatList[idx].messages.push(message)
        this.participantsInMyChatList[idx].unreadMessages = []
      } else {
        this.participantsInMyChatList.push({
          label: participant.label,
          participantId: participant.participantId,
          messages: [message],
          unreadMessages: []
        })
      }
    },
    receiveChat(user, message) {
      let participant = null
      if (user?.participantId){
        participant = user
      }else {
        participant = {...user, participantId: user?.userId}
      }
      const idx = this.participantsInMyChatList.findIndex((el) => {
        return +el?.participantId === +participant?.participantId
      })
      if (idx !== -1) {
        this.participantsInMyChatList[idx].messages.push(message)
        if ((+this.chatWith.participantId === +participant.participantId) && this.isSideBarVisible) {
          this.participantsInMyChatList[idx].unreadMessages = []
        } else {
          this.participantsInMyChatList[idx].unreadMessages.push(message)
        }

      } else {
        if ((+this.chatWith.participantId === +participant.participantId) && this.isSideBarVisible) {
          this.participantsInMyChatList.push({
            label: participant.label,
            participantId: participant.participantId,
            messages: [message],
            unreadMessages: []
          })
        } else {
          this.participantsInMyChatList.push({
            label: participant.label,
            participantId: participant.participantId,
            messages: [message],
            unreadMessages: [message]
          })
        }

      }
      this.unreadPrivateChat()
    },
    receivePublicChat(text) {
      if ((this.sideBarInterior !== 'chat' || this.sideBarInterior === 'chat' && this.chatWith !== {
        label: this.$store.getters.t("all"),
        participantId: this.$store.getters.t("all")
      }) || !this.isSideBarVisible) {
        this.allPublicChats.push(text)
        this.unreadGroupChat()
      }

    },
    OpenNotification(text, title) {
      // const index = this.listOfPollings.findIndex((el) => {
      //   return el.question === text;
      // });
      // const foundProceedings = this.listOfProceedings.filter((el) => {
      //   return el?.proceedingsNumber === text;
      // });
      if (title === this.$store.getters.t("Request-to-speak")) {
        this.isSideBarVisible = true;
        this.sideBarInterior = "participants";
      } else if (title === this.$store.getters.t("descriptive-polling")) {
        this.isSideBarVisible = true;
        this.sideBarInterior = "polling";
        // this.openConfirmPolling()
        // this.descriptivePolling = true;
        this.whichPollingTabForConfirm = this.$store.getters.t('descriptive-polling')
        // this.optionalPolling = false;
        // this.descriptiveQuestionText = this.listOfPollings[index].question;
        // this.isAnonymous = this.listOfPollings[index].isAnonymous;
        // this.indexOfOptionalPolling = index;
      } else if (title === this.$store.getters.t("multiple-choice-polling")) {
        this.isSideBarVisible = true;
        this.sideBarInterior = "polling";
        // this.openConfirmPolling()
        this.whichPollingTabForConfirm = this.$store.getters.t("multiple-choice-polling")
        // this.optionalPolling = true;
        // this.descriptivePolling = false;
        // this.optionalQuestionText = this.listOfPollings[index].question;
        // this.questionList = this.questionListTemp;
        // this.isAnonymous = this.listOfPollings[index].isAnonymous;
        // this.indexOfOptionalPolling = index;
      } else if (title === this.$store.getters.t("proceedings")) {
        this.showProceedings()
      } else if (title === this.$store.getters.t("public-message-from")) {
        this.isSideBarVisible = true;
        this.sideBarInterior = "chat";
      } else {
        this.isSideBarVisible = true;
        this.sideBarInterior = "chat";
        const participant = {label:text.label, participantId: text .userId}
        this.eventBus.emit('go-to-private-chat', participant)
      }
    },
    // openChangeLayoutModal(flag) {
    //   this.showChangeLayoutModal = flag
    // },
    changeLayout(){
      if (this.layoutType === 'filmStrip'){
        this.layoutType = 'flat'
        this.$store.dispatch('setLayoutType', 'flat')
      }else {
        this.layoutType = 'filmStrip'
        this.$store.dispatch('setLayoutType', 'film-strip')

          if (this.activeSpeakerMode && this.layoutType === 'filmStrip') {
            let foundIdx = this.subscribedTracksList.findIndex(
                (subscriber) => {
                  return subscriber.name === this.activeSpeaker && subscriber?.videoTrack?.kind === 'video' && !subscriber?.audioTrack?.isMuted
                }
            );
            if (foundIdx >= 0) {
              [this.subscribedTracksList[0], this.subscribedTracksList[foundIdx]] = [
                this.subscribedTracksList[foundIdx],
                this.subscribedTracksList[0],
              ];

            }
          }
      }
      this.updateLayout()
    },
    iOS() {
      return [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform);
      // // iPad on iOS 13 detection
      // || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    },
    ToggleControlPanelInMobile(flag){
      this.isControlPanelShowed = !flag
    },
    showToggleButton(){
      if (this.isWebSocketConnected){
        this.isScreenTouched = true
        clearTimeout(this.showToggleButtonTimer)
        this.showToggleButtonTimer =  setTimeout(()=>{
          this.isScreenTouched = false
        },5000)
      }
    },
    handleBeforeUnload() {
      if (localStorage?.getItem('isRecording')?.toString() === 'true') {
        this.stopClientRecording()
      }

    },
    showProceedings() {
      this.showProceedingsNotification = false
      this.sideBarInterior = "chat";
      this.isSideBarVisible = true;
      this.eventBus.emit('show-proceedings')
    },
    setVideoQualityForAllParticipants(e){
      this.videoQulityLevel = e.target.value
    },
    changeVideoQualityForAllParticipants(){
      this.webSocketClient.sendVideoQuality(this.videoQulityLevel)
      this.isVideoQualityModalOpened = false
    },
    closeWaitingRoomModal(){
      if (this.amIGuestUser){
        window.location.href = `${window.location.origin}/MeetingEnded`;
      }else {
        window.location.href = `${window.location.origin}/calendar/calendar`;
      }
    },
    updateLayout() {
      this.layoutUpdated = true
      setTimeout(()=>{
        this.layoutUpdated = false
      },10)
      if (!this.isActiveSpeakerMaximized){
        if (this.layoutType === 'flat'){
          const result = tileView(this.isScreenShared || this.isVideoShared,this.screenHeight, this.screenWidth, this.isSideBarVisible,this.subscribedTracksList?.length)
          this.pinClassMode = result.pinClassMode
          this.classMode = result.classMode
          this.firstCameraRatio = result.firstCameraRatio
          this.cameraRatio = result.cameraRatio
          this.isSharedWithSidebar = result.isSharedWithSidebar
          this.layoutWith = result.layoutWith
          console.error(this.pinClassMode)
        }else {
          const result = filmStripView(this.isScreenShared || this.isVideoShared,this.screenHeight, this.screenWidth, this.isSideBarVisible,this.subscribedTracksList?.length)
          this.pinClassMode = result.pinClassMode
          this.classMode = result.classMode
          this.firstCameraRatio = result.firstCameraRatio
          this.cameraRatio = result.cameraRatio
          this.isSharedWithSidebar = result.isSharedWithSidebar
          this.layoutWith = result.layoutWith
          console.error(this.pinClassMode)
        }
      }else {
        nextTick(()=>{
          this.pinClassMode = 'full-screen__activeSpeaker'
          this.classMode = 'full-screen__activeSpeaker'
          if (!this.isMobile){
            this.firstCameraRatio = this.screenHeight - 60 + 'px'
            this.cameraRatio = this.screenHeight - 60 + 'px'
            if (this.$refs.conference.offsetWidth > (16/9) * (this.screenHeight - 60)){
              this.layoutWith = (16/9) * (this.screenHeight - 60) + 'px'
            }else {
              this.layoutWith = '100%'
            }
          }else {
            this.firstCameraRatio = '60vh'
            this.cameraRatio= '60vh'
            this.layoutWith = '100%'
          }
        })

      }



    },

    sendPublishListSignal() {
      this.controlMeetingSending = true
      const data = {
        targetUserId: this.$store.getters.userId,
        connectionId: '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'participantLeft',
        userRole: this.role,
      }
      this.restClientControlMeeting.publishList(data)
          .then((res) => {
            const publishList = res.data.data.publishList
            const index = publishList.findIndex((id) => {
              return (+id === +this.$store.getters.userId)
            })
            console.error(res.data.data.publishList)
            console.error(this.getCurrentTimeFormatted())
            console.error('am i unpubliiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiish')
            const myUserId = this.$store.getters.userId.toString()
            console.error(index, this.remoteTracksMap.has(myUserId))
            console.error(this.remoteTracksMap)
            if (index > -1 && !this.remoteTracksMap.has(myUserId)) {
              this.publishToRoom()
            } else if (index === -1 && this.remoteTracksMap.has(myUserId)) {
              this.unPublishTrack({isRepublish:false})
            }
          }).catch(() => {
        this.controlMeetingSending = false
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
          time: 5000,
        });
      }).finally(() => {
        this.controlMeetingSending = false
        this.isMeetingsLoaded = true
      });


    },
    async getPublishList() {
      this.controlMeetingSending = true
      const data = {
        targetUserId: this.$store.getters.userId,
        connectionId: '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'participantLeft',
        userRole: this.role,
      }
      return this.restClientControlMeeting.publishList(data)
          .then((res) => {
            return res.data.data.publishList
          }).catch(() => {
            this.controlMeetingSending = false
            this.eventBus.emit("notification", {
              title: "پیام",
              type: "error",
              bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
              time: 5000,
            });
          }).finally(() => {
            this.controlMeetingSending = false
            this.isMeetingsLoaded = true
          });


    },
    sendKickOutSignal(connectionId, targetUserId, name) {
      console.error(name)
      console.error(name)
      this.controlMeetingSending = true
      const data = {
        targetUserId: targetUserId,
        connectionId: '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'kickOut',
        userRole: this.role,
      }
      this.restClientControlMeeting.kickOut(data)
          .then((res) => {
            if (res.data?.data?.substitutionUserId) {
              const substitutionIdentity = res.data.data.substitutionDisplayName + '&&' + res.data.data.substitutionUserId
              setTimeout(() => {

                const openVideoTrackMessage = JSON.stringify({action: 'openVideoTrack'})
                const encodeOpenVideoTrack = new TextEncoder().encode(openVideoTrackMessage);
                this.room.localParticipant.publishData(
                    encodeOpenVideoTrack,
                    {
                      kind: "reliable",
                      topic: "openVideoTrack",
                      destinationIdentities: [substitutionIdentity] // Only send to this participant
                    }          // Set to true for guaranteed delivery
                );

              }, 10)
              this.$store.dispatch("removeParticipantFromLayout", {
                userId: res.data.data.substitutionUserId,
                status: true
              });
            }
            if (res.data?.data?.userList) {
              this.$store.dispatch('setParticipants', res.data.data.userList)
              this.$store.dispatch('setChatList', res.data.data.userList)
            }


            const identity = name + '&&' + targetUserId

            const kickOutMessage = JSON.stringify({action: 'kick-out'})
            const encodeKickOutMessage = new TextEncoder().encode(kickOutMessage);
            this.room.localParticipant.publishData(
                encodeKickOutMessage,
                {
                  kind: "reliable",
                  topic: "kick-out",
                  destinationIdentities: [identity] // Only send to this participant
                }        // Set to true for guaranteed delivery
            );

          }).catch(() => {
        this.controlMeetingSending = false
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'عملیات انجام نشد, لطفا دوباره تلاش کنید',
          time: 5000,
        });
      }).finally(() => {
        this.controlMeetingSending = false
        this.isMeetingsLoaded = true
      });


    },
    sendNotifySubstituteSignal() {
      const identity = this.sub_moderator_name + '&&' + this.$store.getters.moderatorSubstituteId
      const syncUserListMessage = JSON.stringify({action: 'syncUserList'})
      const encodeSyncUserListMessage = new TextEncoder().encode(syncUserListMessage);
      this.room.localParticipant.publishData(
          encodeSyncUserListMessage,
          {
            kind: "reliable",
            topic: "syncUserList",
            destinationIdentities: [identity] // Only send to this participant
          }        // Set to true for guaranteed delivery
      );
    },

    sendNotifyModeratorSignal() {
      const identity = this.moderator_name + '&&' + this.$store.getters.moderatorId
      const syncUserListMessage = JSON.stringify({action: 'syncUserList'})
      const encodeSyncUserListMessage = new TextEncoder().encode(syncUserListMessage);
      this.room.localParticipant.publishData(
          encodeSyncUserListMessage,
          {
            kind: "reliable",
            topic: "syncUserList",
            destinationIdentities: [identity] // Only send to this participant
          }          // Set to true for guaranteed delivery
      );
    },
    confirmToChangeCamera(){
      this.eventBus.emit('confirm-choose-camera')
      this.cameraSettingModalIsVisible = false
    },
    confirmToChangeMic(){
      this.eventBus.emit('confirm-choose-mic')
      this.microphoneSettingModalIsVisible = false
    },
    closeCameraSettingModal() {
      this.cameraSettingModalIsVisible = false
    },
    closeMicrophoneSettingModal() {
      this.microphoneSettingModalIsVisible = false
    },
    async changeCamera(id) {
      console.error('1111111111111111111111111111111111111111111111111111111')
      // Cycle through available cameras
      if (id !== this.$store.getters.cameraId) {
        console.error('222222222222222222222222222222222222222222222222222222222222')
        this.$store.dispatch('setCameraId', id)


        // if (index > -1){
        if (this.room.localParticipant.videoTrackPublications.size > 0) {
          for (const publication of this.room.localParticipant.videoTrackPublications.values()) {
            const track = publication.track;
            if (track && track.source!== 'screen_share' && track.source!== 'unknown') {
              await this.room.localParticipant.unpublishTrack(track);
              track.stop(); // optional: stop the media stream
            }
          }
          // this.videoLocalTrack.stop(); // Stops the track
          // await this.room.localParticipant.unpublishTrack(this.videoLocalTrack, true);
          // this.videoLocalTrack.stop()
          this.videoLocalTrack = null;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        const myUserId = this.$store.getters.userId.toString()
        if (this.remoteTracksMap.has(myUserId)){
          console.error('3333333333333333333333333333333333333333333333333333')
          if(!this.isMobile){
            this.videoLocalTrack = await createLocalVideoTrack({
              deviceId: this.$store.getters.cameraId,

              resolution: {
                width: 480,
                height: 320,
                frameRate: 15,
              },
            });
          }else {
            this.videoLocalTrack = await createLocalVideoTrack({
              deviceId: this.$store.getters.cameraId,
              resolution: {
                width: 480,
                height: 320,
                frameRate: 15,
              },
            });
          }
          if (this.videoLocalTrack && this.videoLocalTrack?.source === 'camera') {
            await this.room.localParticipant.publishTrack(this.videoLocalTrack, {
              simulcast: false, // Disable simulcast,
              videoEncoding: {
                maxBitrate: 150000, // Set max bitrate (in bps)
                maxFramerate: 15, // Set frame rate
                scaleResolutionDownBy: 1, // Keep original resolution
              }
            })
            await this.room.localParticipant.setCameraEnabled(this.cameraStatus);
          }
          const myUserId = this.$store.getters.userId.toString()

          for (const key of this.room.localParticipant.videoTrackPublications.keys()) {
            if (this.room.localParticipant.videoTrackPublications.get(key).source === 'camera')
              if (this.videoLocalTrack && this.videoLocalTrack?.source === 'camera') {
                if (this.remoteTracksMap.has(myUserId)) {
                  let temp = this.remoteTracksMap.get(myUserId);
                  temp = {
                    ...temp,
                    videoTrack: this.room.localParticipant.videoTrackPublications.get(key),
                    name: this.$store.getters.displayName,
                    isCameraOn: this.cameraStatus,
                    userId: this.$store.getters.userId,
                    pin: false
                  };

                  this.remoteTracksMap.set(myUserId, temp);
                }

              }
          }
        }

        // }

      }
    },
    async changeMicrophone(id) {
      // Cycle through available cameras
      if (id !== this.$store.getters.cameraId) {
        this.$store.dispatch('setMicrophoneId', id)
        if (this.room.localParticipant.audioTrackPublications.size > 0) {
          // this.audioLocalTrack.stop(); // Stops the track
          for (const publication of this.room.localParticipant.audioTrackPublications.values()) {
            const track = publication.track;
            if (track && track.source!== 'screen_share' && track.source!== 'unknown') {
              await this.room.localParticipant.unpublishTrack(track);
              track.stop(); // optional: stop the media stream
            }
          }
          // await this.room.localParticipant.unpublishTrack(this.audioLocalTrack, true);
          // this.audioLocalTrack.stop()
          this.audioLocalTrack = null;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        const myUserId = this.$store.getters.userId.toString()
        if (this.remoteTracksMap.has(myUserId)){
          this.audioLocalTrack = await createLocalAudioTrack({
            deviceId: this.$store.getters.microphoneId, // Use selected mic
          });
          if (!this.micStatus){
            try {
              await this.audioLocalTrack?.disable();
            } catch (e) {
              console.error('there is not audioLocalTrack')
            }

            await this.room.localParticipant.publishTrack(this.audioLocalTrack);
            setTimeout(() => {
              this.room.localParticipant.setMicrophoneEnabled(false);
            }, 100)
          }else {
            await this.room.localParticipant.publishTrack(this.audioLocalTrack);
          }

          const myUserId = this.$store.getters.userId.toString()

          for (const key of this.room.localParticipant.audioTrackPublications.keys()) {
            if (this.room.localParticipant.audioTrackPublications.get(key).source !== 'screen_share' && this.room.localParticipant.audioTrackPublications.get(key).source !== 'unknown')
              if (this.audioLocalTrack) {
                if (this.remoteTracksMap.has(myUserId)) {
                  let temp = this.remoteTracksMap.get(myUserId);
                  temp = {
                    ...temp,
                    audioTrack: this.room.localParticipant.audioTrackPublications.values().next().value,
                    isMicOn: this.micStatus,
                  };

                  this.remoteTracksMap.set(myUserId, temp);
                }

              }
          }
        }
      }
    },
    changeSelfView(){
      this.isMyVideoStreamDisplayed = !this.isMyVideoStreamDisplayed
    },
    onDrag(e) {
      if (!this.isMouseDown) return;

      // Video element dimensions
      const VIDEO_WIDTH = 200;
      const VIDEO_HEIGHT = 150;

      // Get current mouse position
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Calculate constrained position to keep video within window bounds
      const constrainedPosition = this.calculateConstrainedPosition(mouseX, mouseY, VIDEO_WIDTH, VIDEO_HEIGHT);

      // Update video element position
      this.updateVideoPosition(constrainedPosition.x, constrainedPosition.y);
    },

    calculateConstrainedPosition(mouseX, mouseY, videoWidth, videoHeight) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate the constrained position to keep video within window bounds
      let x = mouseX;
      let y = mouseY;

      // Constrain X position
      if (mouseX + videoWidth > windowWidth) {
        x = windowWidth - videoWidth;
      } else if (mouseX < 0) {
        x = 0;
      }

      // Constrain Y position
      if (mouseY + videoHeight > windowHeight) {
        y = windowHeight - videoHeight;
      } else if (mouseY < 0) {
        y = 0;
      }

      return { x, y };
    },

    updateVideoPosition(x, y) {
      if (this.$refs.myVideoStream) {
        this.$refs.myVideoStream.style.left = x + 'px';
        this.$refs.myVideoStream.style.top = y + 'px';
      }
    },
    startSelfViewDragging(){
      this.throttledMouseMove = throttle(this.onDrag, 100);
      this.isMouseDown = true
      document.addEventListener('mousemove', this.throttledMouseMove);
      document.addEventListener('mouseup', this.stopDrag);
    },
    stopDrag(){
      document.removeEventListener('mousemove', this.throttledMouseMove);
      document.removeEventListener('mouseup', this.stopDrag);
      this.isMouseDown = false
      this.throttledMouseMove = null;
    },
    republishWhenRepluggedDevice(){
      navigator.mediaDevices.addEventListener('devicechange', async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const currentCameraId = this.$store.getters.cameraId;
        // const currentMicaId = this.$store.getters.microphoneId;

        const cameraExists = devices.some(
            d => d.deviceId === currentCameraId && d.kind === 'videoinput'
        );
        // const micExists = devices.some(
        //     d => d.deviceId === currentMicaId && d.kind === 'audioinput'
        // );
        // if (!cameraExists && !micExists) {
        //   console.warn("Camera removed");
        //   return;
        // }
        if (!cameraExists) {
          console.error('cameraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa removeeeeeeeeeeeeeeeeeeeeed')
          console.warn("Camera removed");
          return;
        }

        if(cameraExists){
          if (this.videoLocalTrack) {
            this.room.localParticipant.unpublishTrack(this.videoLocalTrack);
            this.videoLocalTrack.stop();
          }
          const myUserId = this.$store.getters.userId.toString()

          if (this.remoteTracksMap.has(myUserId)) {
            const newTrack = await createLocalVideoTrack({
              deviceId: currentCameraId,
              resolution: {
                width: 480,
                height: 320,
                frameRate: 15,
              },
            });
            await this.room.localParticipant.publishTrack(newTrack);
            await this.room.localParticipant.setCameraEnabled(this.cameraStatus);
            this.videoLocalTrack = newTrack;
          }
          await new Promise(resolve => setTimeout(resolve, 500));

          for (const key of this.room.localParticipant.videoTrackPublications.keys()) {
            console.error('111111111111111111111111111')
            if (this.room.localParticipant.videoTrackPublications.get(key).source === 'camera'){
              console.error('22222222222222222222222222222')
              if (this.videoLocalTrack && this.videoLocalTrack?.source === 'camera') {
                console.error('3333333333333333333333333333')
                if (this.remoteTracksMap.has(myUserId)) {
                  console.error('44444444444444444444444444444444444444444444444444')
                  let temp = this.remoteTracksMap.get(myUserId);
                  temp = {
                    ...temp,
                    videoTrack: this.room.localParticipant.videoTrackPublications.get(key),
                    name: this.$store.getters.displayName,
                    isCameraOn: this.cameraStatus,
                    userId: this.$store.getters.userId,
                    pin: false
                  };
                  this.remoteTracksMap.set(myUserId, temp);
                }else {
                  console.error('555555555555555555555555555555555555555555555555555555555')
                }

              }
            }
          }
        }
        // if (micExists){
        //   const oldAudioTrack = this.audioLocalTrack;
        //   if (oldAudioTrack) {
        //     this.room.localParticipant.unpublishTrack(oldAudioTrack);
        //     oldAudioTrack.stop();
        //   }
        //   if (this.remoteTracksMap.has(this.$store.getters.userId)) {
        //     const newAudioTrack = await createLocalAudioTrack({
        //       deviceId: this.$store.getters.microphoneId, // Use selected mic
        //     });
        //     this.audioLocalTrack = newAudioTrack;
        //
        //     if (!this.micStatus){
        //       try {
        //         await this.audioLocalTrack?.disable();
        //       } catch (e) {
        //         console.error('there is not audioLocalTrack')
        //       }
        //
        //       await this.room.localParticipant.publishTrack(this.audioLocalTrack);
        //       setTimeout(() => {
        //         this.room.localParticipant.setMicrophoneEnabled(false);
        //       }, 100)
        //     }else {
        //       await this.room.localParticipant.publishTrack(this.audioLocalTrack);
        //     }
        //     for (const key of this.room.localParticipant.audioTrackPublications.keys()) {
        //       if (this.room.localParticipant.audioTrackPublications.get(key).source !== 'screen_share' && this.room.localParticipant.audioTrackPublications.get(key).source !== 'unknown')
        //         if (this.audioLocalTrack) {
        //           if (this.remoteTracksMap.has(this.$store.getters.userId)) {
        //             let temp = this.remoteTracksMap.get(this.$store.getters.userId);
        //             temp = {
        //               ...temp,
        //               audioTrack: this.room.localParticipant.audioTrackPublications.values().next().value,
        //               isMicOn: this.micStatus,
        //             };
        //
        //             this.remoteTracksMap.set(this.$store.getters.userId, temp);
        //           }
        //
        //         }
        //     }
        //   }
        // }

      })
    },
    async handleVideoFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.videoShareSubscriberName = this.$store.getters.displayName
      this.isVideoShared = true
      await new Promise(resolve => setTimeout(resolve, 1000));
      const streamObject = await this.$refs.layout.handleVideoFile(file)
      if (streamObject.hasStream){
        await this.shareVideoStream(streamObject.stream);
        this.updateLayout()
      }else {
        this.isVideoShared = false
        this.videoShareSubscriberName = ''
        this.videoShareStatus = false
        this.updateLayout()
      }


    },

    async openVideoFilePicker(){
      if (this.screenShareAllowed) {
        if (this.shareStatus){
          this.stopShare()
          this.webSocketClient?.shareStop();
          this.shareStatus = !this.shareStatus;
        }
        if ((this.isVideoShared || (this.isScreenShared && !this.shareStatus)) && !this.amIModerator) {
          this.eventBus.emit("notification", {
            title: "پیام",
            type: "error",
            bodyText: this.$t('Another_user_is_sharing'),
            time: 3000,
          });
          return
        } else if ((this.isVideoShared || this.isScreenShared) && this.amIModerator) {
          const stopShareMessage = JSON.stringify({action: 'moderatorSharedScreen'})
          const encodeStopShareMessage = new TextEncoder().encode(stopShareMessage);
          this.room.localParticipant.publishData(
              encodeStopShareMessage,
              {
                kind: "reliable",
                topic: "moderatorSharedScreen",
                destinationIdentities: []
              }          // Set to true for guaranteed delivery
          );
          if (this.shareStatus) {
            this.stopShare();
            this.shareStatus = false;
            this.videoShareStatus = false
            this.stopVideoSharing()
            this.webSocketClient?.shareStop();
          }
          if (this.videoShareStatus){
            this.stopVideoSharing()
          }
          this.$refs.VideoFileInput.click()
          return
        }

        this.$refs.VideoFileInput.click()

      }
    },

    async shareVideoStream(stream) {
      const [videoTrack] = stream.getVideoTracks();
      const [audioTrack] = stream.getAudioTracks();
      // Create LiveKit-compatible tracks
      const livekitVideoTrack = new LocalVideoTrack(videoTrack);
      const livekitAudioTrack = new LocalAudioTrack(audioTrack);
      // nextTick(async () => {
      //   await livekitVideoTrack.attach(this.$refs['sharedVideo'])
      //   this.updateLayout()
      // })
      // Publish to LiveKit room
      await this.room.localParticipant.publishTrack(livekitVideoTrack, {
        simulcast: false, // Disable simulcast,
        videoEncoding: {
          maxBitrate: 600000, // Set max bitrate (in bps)
          maxFramerate: 30, // Set frame rate
          scaleResolutionDownBy: 1, // Keep original resolution
        }
      });
      await this.room.localParticipant.publishTrack(livekitAudioTrack);
      this.sharedVideoTrack = livekitVideoTrack;
      this.sharedAudioTrack = livekitAudioTrack;
      this.videoShareStatus = true
      this.isVideoShared = true
      this.videoShareSubscriberName = this.$store.getters.displayName
    },
    async stopVideoSharing(){
      this.sharedVideoTrack = null
      this.sharedAudioTrack = null
      this.isVideoShared = false
      this.videoShareSubscriberName = null
      this.videoSharedScreenUserId = null
      this.videoShareStatus = false
      this.$refs.VideoFileInput.value = null
      this.updateLayout()
      if (this.room.localParticipant.videoTrackPublications.size > 0) {
        for (const publication of this.room.localParticipant.videoTrackPublications.values()) {
          const track = publication.track;
          if (track.source === 'unknown') {
            await this.room.localParticipant.unpublishTrack(track);
            track.stop(); // optional: stop the media stream
          }
        }
        // this.videoLocalTrack.stop(); // Stops the track
        // await this.room.localParticipant.unpublishTrack(this.videoLocalTrack, true);
        // this.videoLocalTrack.stop()
      }
      if (this.room.localParticipant.audioTrackPublications.size > 0) {
        for (const publication of this.room.localParticipant.audioTrackPublications.values()) {
          const track = publication.track;
          if (track.source === 'unknown') {
            await this.room.localParticipant.unpublishTrack(track);
            track.stop(); // optional: stop the media stream
          }
        }
        // this.videoLocalTrack.stop(); // Stops the track
        // await this.room.localParticipant.unpublishTrack(this.videoLocalTrack, true);
        // this.videoLocalTrack.stop()
      }
    },
    changeActiveSpeakerView(active){
      this.controlMeetingSending = true
      const data = {
        targetUserId: '',
        connectionId: '',
        meetingId: this.$store.getters.roomId,
        meetingType: !this.isPrivate ? 'public' : 'private',
        senderUserId: this.$store.getters.userId,
        actionType: 'openMic',
        userRole: this.role,
        active:active
      }
      this.restClientControlMeeting.changeActiveSpeakerView(data)
          .then(() => {
            if (active){
              this.isActiveSpeakerMaximized = true
              this.isModeratorMaximizeActiveSpeaker = true
              const changeActiveSpeakerViewMessage = JSON.stringify({
                action: 'maximizeActiveSpeakerView',
                name: this.$store.getters.displayName
              })
              const encodeChangeActiveSpeakerViewMessage = new TextEncoder().encode(changeActiveSpeakerViewMessage);
              this.room.localParticipant.publishData(
                  encodeChangeActiveSpeakerViewMessage,
                  {
                    kind: "reliable",
                    topic: "maximizeActiveSpeakerView",
                    destinationIdentities: [] // Only send to this participant
                  }         // Set to true for guaranteed delivery
              );
            }else {
              this.isActiveSpeakerMaximized = false
              this.isModeratorMaximizeActiveSpeaker = false
              const changeActiveSpeakerViewMessage = JSON.stringify({
                action: 'minimizeActiveSpeakerView',
                name: this.$store.getters.displayName
              })
              const encodeChangeActiveSpeakerViewMessage = new TextEncoder().encode(changeActiveSpeakerViewMessage);
              this.room.localParticipant.publishData(
                  encodeChangeActiveSpeakerViewMessage,
                  {
                    kind: "reliable",
                    topic: "minimizeActiveSpeakerView",
                    destinationIdentities: [] // Only send to this participant
                  }         // Set to true for guaranteed delivery
              );
            }

          }).catch((err)=>{
        console.error(err)
      })
    },
    onParticipantPinned(id) {
      console.error("onParticipantPinned: " + id)

      let foundIdx = this.subscribedTracksList.findIndex((subscriber) => {

        return +subscriber.userId === +id;
      });
      if (foundIdx > 0 && !this.activeSpeakerMode) {
        [this.subscribedTracksList[0], this.subscribedTracksList[foundIdx]] = [this.subscribedTracksList[foundIdx], this.subscribedTracksList[0]];
      }
    },
  },
  created() {
    this.isIOS = this.iOS()
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
    const meetingLink = window.location.href;
    this.meetingType  = meetingLink.substring(meetingLink.indexOf('?') + 1, meetingLink.lastIndexOf('&'));
    this.meetingInfo = meetingLink.substring(meetingLink.indexOf('&') + 1);
    // if (this.meetingInfo.split('')[this.meetingInfo.length - 1] === '/'){
    //   this.meetingInfo = this.meetingInfo.split('/')[0]
    // }
    if(this.meetingType ){
      this.amIGuestUser = true;
      let userId = null
      if (+JSON.parse(localStorage?.getItem("userId"))?.roomId === +this.$store.getters.roomId && JSON.parse(localStorage?.getItem("userId"))?.userId) {
        userId = +JSON.parse(localStorage?.getItem("userId"))?.userId
      }else {
        userId = this.$store.getters.userId
        localStorage.setItem("userId", JSON.stringify({userId:userId, roomId: this.$store.getters.roomId}))
      }
      this.$store.dispatch('setAmIGuest', true);
    } else {
      this.displayNameInput = this.$store.getters.displayName
    }
    this.$store.dispatch('setMeetingLink',meetingLink);
    this.$store.dispatch('setMeetingType', this.meetingType );
    this.$store.dispatch('setMeetingInfo', this.meetingInfo);
  },
  mounted() {
    this.eventBus.on('devices-is-loaded', ()=>{
      this.isEntranceButtonActive =  true
    })
    this.eventBus.on("enableActiveSpeakerMode", (data) => {
      this.activeSpeakerMode = data.status;
    });
    document.addEventListener('visibilitychange', async () => {
      if (this.isJoinedToRoom){
        if (document.hidden) {
          this.isInBackGround = true
          this.userInBackGround('', this.$store.getters.userId)
          console.log('Tab is inactive (hidden)');
          // Optional: Take action if needed
        } else {
          this.isInBackGround = false
          let publishedParticipants = []
          try {
            publishedParticipants = await this.getPublishList()
          }catch (err){
            console.error(err)
          }
          const index = publishedParticipants.findIndex((id)=>{
            return +id === +this.$store.getters.userId
          })
          const myUserId = this.$store.getters.userId.toString()

          if ( index > -1 && !this.remoteTracksMap.has(myUserId)){
            await this.republish()
          }
          console.log('Tab is active');
          this.userInForGround('', this.$store.getters.userId)
          // Reattempt to publish streams if necessary
        }
      }

    });
    this.eventBus.on('OPEN_PARTICIPANT_MICROPHONE',({connectionId, userId, name})=>{
      this.openMicrophoneAPIHandler(connectionId, userId, name)
    })
    this.eventBus.on('CLOSE_PARTICIPANT_MICROPHONE', ({connectionId, userId, name}) => {
      this.closeMicrophoneAPIHandler(connectionId, userId, name)
    })
    this.eventBus.on('muteShareParticipant', ({connectionId, userId, name}) => {
      this.muteShareAPIHandler(connectionId, userId, name)
    })
    this.eventBus.on('unmuteShareParticipant', ({connectionId, userId, name}) => {
      this.unmuteShareAPIHandler(connectionId, userId, name)
    })
    this.eventBus.on('throwOutParticipant', ({connectionId, userId, name}) => {
      this.sendKickOutSignal(connectionId, userId, name)
    })
    this.eventBus.on('unPinParticipant', ({connectionId, userId}) => {
      this.unpinAPIHandler(connectionId, userId)
      // this.webcamSession.signal({
      //   data: 'unPin&&' + connectionId,
      //   to: [connectionId],
      //   type: 'my-event-to-all'
      // })
    })
    this.eventBus.on('pinParticipant', ({connectionId, userId, name}) => {
      this.pinAPIHandler(connectionId, userId, name)
    })
    this.eventBus.on('OPEN_PARTICIPANT_CAMERA', ({connectionId, userId, name}) => {
      this.openCameraAPIHandler(connectionId, userId, name)
    })
    this.eventBus.on('CLOSE_PARTICIPANT_CAMERA', ({connectionId, userId, name}) => {
      this.closeCameraAPIHandler(connectionId, userId, name)
    })
    this.eventBus.on('removeParticipantFromLayout', ({connectionId, userId, name}) => {
      this.removeVideoAPIHandler(connectionId, userId, name)
    })
    this.eventBus.on('bringParticipantFromLayout', ({connectionId, userId, name}) => {
      this.publishVideoAPIHandler(connectionId, userId, name)
    })
    this.eventBus.on('update-layout',()=>{
      this.updateLayout()
    })
    this.eventBus.on('reconnect-web-socket',()=>{
      this.initiateWebSocket(this.jitsiId)
      this.reconnectLoading = false
      console.error('reconnect')
    })
    this.eventBus.on('reconnect-web-socket-canceled',()=>{
      this.reconnectLoading = false
      this.eventBus.emit('leave-jitsi-meeting')
      this.webSocketClient?.iWantToLeave(this.$store.getters.userId);
      this.webSocketClient?.disconnect();
    })
    this.eventBus.on('reconnect-web-socket-loading',()=>{
      this.reconnectLoading = true
    })
    this.eventBus.on('participant-leave-from-conference', (data) =>{
      if (+data.userId === +this.$store.getters.userId){
        this.eventBus.emit('leave-conference')
      }
    })
    this.eventBus.on('video-conference-left',()=>{
      this.webSocketClient?.iWantToLeave(this.$store.getters.userId);
      this.webSocketClient?.disconnect();
      this.isLoading = false
      if (this.amIGuestUser){
        window.location.href = `${window.location.origin}/MeetingEnded`;
      }else {
        window.location.href = `${window.location.origin}/calendar/calendar`;
      }
    })
    // if (this.amIGuestUser) {
    //   if (this.meetingType === "public" || this.meetingType === "wm"){
    //     this.getPublicRoomInformation()
    //   }
    //   else{
    //     this.getPrivateRoomInformation()
    //   }
    //   // nextTick(() => {
    //   //   if (this.isChangeDevices !== 'yes'){
    //   //     this.$refs.guestUserInput.focus()
    //   //   }
    //   //
    //   // })
    // }else {
    //   nextTick(() => {
    //     this.roomName = localStorage.getItem('room-Name')
    //   })
    //   // nextTick(()=> {
    //   //   if (this.isChangeDevices !== 'yes'){
    //   //     this.$refs.organizationalUserInput.focus()
    //   //   }
    //   // })
    //
    // }
    this.eventBus.on('close-loading-modal',()=>{
      this.isLoading = false
    })

    this.eventBus.on('invite-participants', () => {
      this.isInvitationVisible = true
      if (this.isMobile){
        this.isSideBarVisible = false
      }
    })


    this.eventBus.on('moderator_joined', () => {
      this.moderator_joined = true
    });
    this.eventBus.on("moderator_leaved", () => {
      try {
        if (this.moderator_joined === true) {
          this.eventBus.emit("notification", {
            title: "پیام",
            type: "warning",
            bodyText: this.$t("moderator-left"),
            time: 3000,
          });
        }

        this.moderator_joined = false;
      } catch (error) {
        console.error(error);
      }
    });
    this.eventBus.on('go-to-private-chat', (participant) => {
      this.sideBarInterior = 'chat'
      this.chatWith = participant
      const idx = this.participantsInMyChatList.findIndex((el) => {
        return +el.participantId === +participant.participantId
      })
      if (idx !== -1) {
        this.participantsInMyChatList[idx].unreadMessages = []
      }
      this.unreadPrivateChat()
      this.unreadGroupChat()
    })
    this.eventBus.on('change-chat-with', (participant) => {
      this.chatWith = participant
    })
    this.eventBus.on('websocket_error_connected', () =>{
      if (this.amIGuestUser){
        window.location.href = `${window.location.origin}/MeetingEnded`;
      }else {
        window.location.href = `${window.location.origin}/calendar/calendar`;
      }
    })
    this.eventBus.on("private-chat", (data) => {
      this.isTherePrivateMessage = true;
      this.isThereMessage = false;
      if (
          (!this.isSideBarVisible ||
              (this.isSideBarVisible && this.sideBarInterior !== "chat") || (this.isSideBarVisible && this.sideBarInterior === "chat" && this.chatWith.label === this.$store.getters.t("all")))
      ) {
        this.$notify({
          group: "notification",
          type: "/img/Message-Information.svg",
          title: this.$store.getters.t("Private-message-from"),
          text: data,
          duration: 2000,
          speed: 1000,
        });
      }
    });
    this.eventBus.on("public-chat", (data) => {
      this.isThereMessage = true;
      this.isTherePrivateMessage = false;
      if (
          (!this.isSideBarVisible ||
              (this.isSideBarVisible && this.sideBarInterior !== "chat") || (this.isSideBarVisible && this.sideBarInterior === "chat" && this.chatWith.label !== this.$store.getters.t("all")))
      ) {
        this.$notify({
          group: "notification",
          type: "/img/Message-Information.svg",
          title: this.$store.getters.t("public-message-from"),
          text: data,
          duration: 2000,
          speed: 1000,
        });
      }
    });
    this.eventBus.on("participantHandRequest", (data) => {
      this.waitingHandRaise += 1;
      if (
          (!this.isSideBarVisible ||
              (this.isSideBarVisible && this.sideBarInterior === "chat")) &&
          this.isMobile === false
      ) {
        this.$notify({
          group: "notification",
          type: "/img/Handraise-Alert.svg",
          title: this.$store.getters.t("Request-to-speak"),
          text: data,
          duration: 2000,
          speed: 1000,
        });
      }
    });
    this.eventBus.on("optional-polling-created", (pollingData) => {
      try {
        if (pollingData.isOptional) {
          this.allOptionalPolling.unshift({
            title: pollingData.title,
            pollingData: pollingData.pollingData,
            isAnonymous: pollingData.isAnonymous,
            pollingId: pollingData.pollingId,
            isAnswered: false,
            optionalAnswer: [],
            isDone: true
          })
          const notAnsweredOptionalPolling = this.allOptionalPolling.filter((polling) => {
            return polling.isAnswered === false
          })
          if (notAnsweredOptionalPolling.length > 0) {
            this.notAnsweredOptionalPolling = notAnsweredOptionalPolling.length
          }
          // this.optionalQuestionText = pollingData.body;

          // this.questionList = pollingData.questionList;
          // for (const el of this.questionList) {
          //   let option = "option" +  pollingData.id + this.allOptionalPolling[0].options.length;
          //   this.allOptionalPolling[0].options.push({option: option, optionText: el});
          // }
          if (!this.$store.getters.isPrivate){
            localStorage.setItem(
                "all-optional-polling",
                JSON.stringify({allOptionalPolling: this.allOptionalPolling, roomId:this.$store.getters.roomId})
            );
          }else{
            localStorage.setItem(
                "all-optional-polling",
                JSON.stringify({allOptionalPolling: this.allOptionalPolling, roomId:this.$store.getters.prRoomID})
            );
          }

          // if (this.isOptionalPollingSelected === false) {
          //   this.listOfPollings.push({
          //     question: pollingData.body,
          //     pollingId: pollingData.id,
          //     options: options,
          //     pollingType: this.$store.getters.t("multiple-choice"),
          //     isAnonymous: pollingData.isAnonymous,
          //     date: momentjs(pollingData.date).format('h:mm:ss A')
          //   });
          // }

          // if (
          //     this.isOptionalPollingSelected === false
          // ) {
          this.$notify({
            group: "notification",
            type: "/img/Polling.svg",
            title: this.$store.getters.t("multiple-choice-polling"),
            text: pollingData.questionText,
            duration: 2000,
            speed: 1000,
          });
          // }
          // else if (this.isMobile === true) {
          //   this.optionalPolling = true;
          // }
        }
      } catch (error) {
        console.error(error);
      }
    });
    this.eventBus.on("descriptive-polling-created", (pollingData) => {
      try {
        if (!pollingData.isOptional) {
          // this.centerDialogVisible = true;
          this.allDescriptivePolling.unshift({
            title: pollingData.title,
            pollingData: pollingData.pollingData,
            isAnonymous: pollingData.isAnonymous,
            pollingId: pollingData.pollingId,
            isAnswered: false,
            descriptiveAnswer: [],
            isDone: true
          })
          const notAnsweredDescriptivePolling = this.allDescriptivePolling.filter((polling) => {
            return polling.isAnswered === false
          })
          if (notAnsweredDescriptivePolling.length > 0) {
            this.notAnsweredDescriptivePolling = notAnsweredDescriptivePolling.length
          }
          if (!this.$store.getters.isPrivate){
            localStorage.setItem(
                "all-descriptive-polling",
                JSON.stringify({allDescriptivePolling: this.allDescriptivePolling, roomId: this.$store.getters.roomId})
            );
          }else{
            localStorage.setItem(
                "all-descriptive-polling",
                JSON.stringify({allDescriptivePolling: this.allDescriptivePolling, roomId: this.$store.getters.prRoomID})
            );
          }

          // this.descriptiveQuestionText = pollingData.title;
          // this.descriptiveQuestionText = pollingData.body;
          // this.id = pollingData.id;
          // if (this.isDescriptivePollingSelected === false) {
          //   this.listOfPollings.push({
          //     question: pollingData.body,
          //     pollingId: pollingData.id,
          //     options: [],
          //     pollingType: this.$store.getters.t("descriptive"),
          //     isAnonymous: pollingData.isAnonymous,
          //     date: momentjs(pollingData.date).format('h:mm:ss A')
          //   });
          // }

          // if (
          //     this.isDescriptivePollingSelected === false
          // ) {
          this.$notify({
            group: "notification",
            type: "/img/Polling.svg",
            title: this.$store.getters.t("descriptive-polling"),
            text: pollingData.questionText,
            duration: 2000,
            speed: 1000,
          });
          // }
          // else if (this.isMobile === true) {
          //   this.descriptivePolling = true;
          // }
        }
      } catch (error) {
        console.error(error);
      }
    });
    this.eventBus.on('change-camera-off',()=>{
      this.setCameraState(false)
    })
    this.eventBus.on('video-mute-status-changed', (data)=>{
      this.setCameraState(!data)
    })
    this.eventBus.on('change-mic-from-pre-meeting',(data)=>{
      if (this.micControlAllowed || !this.$store.getters.hasModerator){
        this.setMicState(!data)
      }else if (data === false) {
        this.eventBus.emit('toggle-audio')
      }

    })
    this.eventBus.on('audio-mute-status-changed', (data)=>{
      this.setMicState(!data)
    })

    this.eventBus.on('is-there-hand-raise-waiting-mode', (data) =>{
      this.handRaiseBadge = data
    })
    this.eventBus.on('chat-title-public', () => {
      if (this.isSideBarVisible) {
        this.allPublicChats = []
      }

      this.unreadGroupChat()
      this.unreadPrivateChat()
    })
    this.eventBus.on('chat-title-changed', () => {
      this.unreadGroupChat()
      this.unreadPrivateChat()
    })
    if (this.$store.getters.amIModerator){
      this.proceedingsAllowed = true
    }
    this.eventBus.on('websocket_connected',()=>{
      this.isReconnecting = false
    });
    this.eventBus.on('websocket_reconnect_started',()=>{
      this.isReconnecting = true
    });
    this.eventBus.on('websocket_reconnect_failed',()=>{
      this.isReconnecting = false
      this.isLoading = false
      if (this.amIGuestUser){
        window.location.href = `${window.location.origin}/MeetingEnded`;
      }else {
        window.location.href = `${window.location.origin}/calendar/calendar`;
      }
    });
    this.eventBus.on('leave-conference-time-is-up',()=>{
      this.eventBus.emit('leave-jitsi-meeting')
      this.isLoading = true
      this.webSocketClient?.iWantToLeave(this.$store.getters.userId);
      this.webSocketClient?.disconnect();
      if (this.amIGuestUser){
        window.location.href = `${window.location.origin}/MeetingEnded`;
      }else {
        window.location.href = `${window.location.origin}/calendar/calendar`;
      }
    });
    this.eventBus.on('leave-conference',()=>{
      this.eventBus.emit('leave-jitsi-meeting')
      this.isLoading = true
      if (this.amIGuestUser){
        window.location.href = `${window.location.origin}/MeetingEnded`;
      }else {
        window.location.href = `${window.location.origin}/calendar/calendar`;
      }
    });
    this.eventBus.on('leaNotify_Meeting_End',()=>{
      this.eventBus.emit("notification", {
        title: "پیام",
        type: "warning",
        bodyText: this.$t("5-minutes-left"),
        time: 3000,
      });
    });
    this.eventBus.on('RECEIVED_ALL_CREATED_SURVEY',(allPolling)=>{
      if ((JSON.parse(localStorage.getItem("all-optional-polling"))?.roomId) && ( (+JSON.parse(localStorage.getItem("all-optional-polling"))?.roomId === +this.$store.getters.roomId) ||  (+JSON.parse(localStorage.getItem("all-optional-polling"))?.roomId === +this.$store.getters.prRoomID) ) && ( this.$store.getters.prRoomId ?  (+JSON.parse(localStorage.getItem("all-descriptive-polling"))?.prRoomId === +this.$store.getters.prRoomId) : true) && JSON.parse(localStorage.getItem("all-optional-polling"))?.allOptionalPolling.length > 0) {
        this.allOptionalPollingInLocalStorage =  JSON.parse(localStorage.getItem("all-optional-polling")).allOptionalPolling
      }
      if ((JSON.parse(localStorage.getItem("all-descriptive-polling"))?.roomId) && ((+JSON.parse(localStorage.getItem("all-descriptive-polling"))?.roomId === +this.$store.getters.roomId) || (+JSON.parse(localStorage.getItem("all-descriptive-polling"))?.roomId === +this.$store.getters.prRoomID)) && JSON.parse(localStorage.getItem("all-descriptive-polling"))?.allDescriptivePolling.length > 0) {
        this.allDescriptivePollingInLocalStorage =  JSON.parse(localStorage.getItem("all-descriptive-polling")).allDescriptivePolling
      }
      allPolling.forEach((polling) => {
        if (polling.surveyQuestionRespDtoList[0].isOptional){
          const answeredIndex = this.allOptionalPollingInLocalStorage.findIndex((poll)=>{
            return (+poll?.pollingId === +polling?.surveyId) && (poll?.isAnswered)
          })
          this.allOptionalPolling.unshift({
            title: polling.title,
            pollingData: polling.surveyQuestionRespDtoList,
            isAnonymous: polling.isAnonymous,
            pollingId: polling.surveyId,
            isAnswered: answeredIndex !== -1 ,
            optionalAnswer: answeredIndex !== -1 ? this.allOptionalPollingInLocalStorage[answeredIndex]?.optionalAnswer : [],
            isDone: true
          })
          const notAnsweredOptionalPolling = this.allOptionalPolling.filter((polling) => {
            return polling.isAnswered === false
          })
          if (notAnsweredOptionalPolling.length > 0) {
            this.notAnsweredOptionalPolling = notAnsweredOptionalPolling.length
          }
        }else {
          const answeredIndex = this.allDescriptivePollingInLocalStorage.findIndex((poll)=>{
            return (+poll?.pollingId === +polling?.surveyId) && (poll?.isAnswered)
          })
          this.allDescriptivePolling.unshift({
            title: polling.title,
            pollingData: polling.surveyQuestionRespDtoList,
            isAnonymous: polling.isAnonymous,
            pollingId: polling.surveyId,
            isAnswered: answeredIndex !== -1 ,
            descriptiveAnswer: answeredIndex !== -1 ? this.allDescriptivePollingInLocalStorage[answeredIndex]?.descriptiveAnswer : [],
            isDone: true
          })
          const notAnsweredOptionalPolling = this.allDescriptivePolling.filter((polling) => {
            return polling.isAnswered === false
          })
          if (notAnsweredOptionalPolling.length > 0) {
            this.notAnsweredDescriptivePolling = notAnsweredOptionalPolling.length
          }
        }
      })
    });
    this.eventBus.on('answer-optional-polling', (data) => {
      if (this.notAnsweredOptionalPolling > 0) {
        this.notAnsweredOptionalPolling -= 1
      }
      const foundIdx = this.allOptionalPolling.findIndex((polling) => {
        return polling.pollingId === data.id
      })
      if (foundIdx !== -1) {
        this.allOptionalPolling[foundIdx].isAnswered = true
        this.allOptionalPolling[foundIdx].optionalAnswer = data.answer
        if (!this.$store.getters.isPrivate){
          localStorage.setItem(
              "all-optional-polling",
              JSON.stringify({allOptionalPolling: this.allOptionalPolling, roomId: this.$store.getters.roomId})
          );
        }else{
          localStorage.setItem(
              "all-optional-polling",
              JSON.stringify({allOptionalPolling: this.allOptionalPolling, roomId: this.$store.getters.prRoomID})
          );
        }

      }
    })
    this.eventBus.on('answer-descriptive-polling', (data) => {
      if (this.notAnsweredDescriptivePolling > 0) {
        this.notAnsweredDescriptivePolling -= 1
      }
      const foundIdx = this.allDescriptivePolling.findIndex((polling) => {
        return polling.pollingId === data.id
      })
      if (foundIdx !== -1) {
        this.allDescriptivePolling[foundIdx].isAnswered = true
        this.allDescriptivePolling[foundIdx].descriptiveAnswer = data.answer
        if (!this.$store.getters.isPrivate){
          localStorage.setItem(
              "all-descriptive-polling",
              JSON.stringify({allDescriptivePolling: this.allDescriptivePolling, roomId: this.$store.getters.roomId})
          );
        }else{
          localStorage.setItem(
              "all-descriptive-polling",
              JSON.stringify({allDescriptivePolling: this.allDescriptivePolling, roomId: this.$store.getters.prRoomID})
          );
        }


      }
    })
    this.eventBus.on('RECEIVED_MINUTE_PARAGRAPH',(data)=>{
      if (this.allProceedingsParagraphs.length === 0){
        this.isProceedingsStarted = true
        this.showStartingProceedingsNotification = true
        setTimeout(() => {
          this.showStartingProceedingsNotification = false
        }, 5000)
        this.proceedingsNumber = data?.proceedingsNumber ? data?.proceedingsNumber : ''
        this.proceedingsSecretary = data?.proceedingsSecretary ? data?.proceedingsSecretary : ''
      }
      if (data.status === 'create'){
        this.notCompleteParagraphIndex = this.allProceedingsParagraphs.length
        this.allProceedingsParagraphs.push(data)
      }else if (data.status === 'done'){
        const doneParagraphIndex = this.allProceedingsParagraphs.findIndex((paragraph) => {
          return +paragraph.paragraphId === +data.paragraphId
        })
        if (doneParagraphIndex !== -1){
          this.allProceedingsParagraphs[doneParagraphIndex] = data
        }
        if (doneParagraphIndex + 1 === this.allProceedingsParagraphs.length) {
          this.notCompleteParagraphIndex = null
        }
      }else {
        const editParagraphIndex = this.allProceedingsParagraphs.findIndex((paragraph) => {
          return +paragraph.paragraphId === +data.paragraphId
        })
        if (editParagraphIndex !== -1){
          this.allProceedingsParagraphs[editParagraphIndex] = data
        }

      }
    })
    this.eventBus.on('GET_ALL_RECEIVED_MINUTE_PARAGRAPH', (data) => {

      if (data.length > 0){
        this.allProceedingsParagraphs = data
        this.isProceedingsStarted = true
        const doneParagraphIndex = this.allProceedingsParagraphs.findIndex((paragraph) => {
          return paragraph.status === 'create'
        })
        if (doneParagraphIndex !== -1) {
          this.notCompleteParagraphIndex = doneParagraphIndex
        }
      }

      // this.proceedingsCreatorUserId = null
      // this.proceedingsNumber = ''
      // this.proceedingsSecretary = ''
    })
    this.eventBus.on('SUBMIT_MINUTE_PARAGRAPH', (data) => {
      this.showProceedingsNotification = true
      this.isProceedingsStarted = true
      this.isProceedingsCreated = true
      this.proceedingsId = data.id
      // this.proceedingsCreatorUserId = null
      this.proceedingsDateCreated = data.meetingDate
      this.proceedingsNumber = data.meetingMinutesNumber
      this.proceedingsSecretary = data.createdBy
    })
    // this.eventBus.on('MEETING_MINUTE_DELETED', () => {
    //   this.isProceedingsStarted = false
    //   this.proceedingsCreatorUserId = null
    //   this.proceedingsNumber = ''
    //   this.proceedingsSecretary = ''
    //   this.allProceedingsParagraphs = []
    //   localStorage.removeItem('roomProceedings')
    //   localStorage.removeItem('answerProceeding')
    //   this.eventBus.emit("notification", {
    //     title: "پیام",
    //     type: "warning",
    //     bodyText: 'صورتجلسه حذف شد',
    //     time: 5000,
    //   });
    // })
    this.eventBus.on('there-is-created-proceedings', ()=>{
      this.isProceedingsCreated = true
    })
    this.eventBus.on('is-proceedings-answered', (data) => {
      this.isProceedingsAnswered = true
      this.isConfirmedProceedings = data
    })
    this.eventBus.on('start-recording-meeting',()=>{
      this.webSocketClient.notifyStartRecording()
    })
    this.eventBus.on('RECORDING_STARTED', ()=>{
      this.eventBus.emit("notification", {
        title: "پیام",
        type: "warning",
        bodyText: this.$t("recording-meeting"),
        time: 5000,
      });
    })
    this.eventBus.on('MINUTES_PARAGRAPH_DELETED', (data)=>{
      const foundParagraphIndex = this.allProceedingsParagraphs.findIndex((paragraph) => {
        return +paragraph.paragraphId === data.paragraphId
      })
      if (foundParagraphIndex !== -1){
        if (this.allProceedingsParagraphs[foundParagraphIndex].status === 'create'){
          this.notCompleteParagraphIndex = null
        }
        this.allProceedingsParagraphs.splice(foundParagraphIndex,1)
      }
    })
    this.eventBus.on("REMOVE_PARTICIPANT_BYE_MODERATOR", (id) =>{
      this.webSocketClient.throwOut(id)
    });
    this.eventBus.on("LEAVE_SESSION", () =>{
      this.eventBus.emit('leave-jitsi-meeting')
      this.isLoading = true
    });
    if (+JSON.parse(localStorage?.getItem("answerProceeding"))?.roomId === +this.$store.getters.roomId && JSON.parse(localStorage?.getItem("answerProceeding"))?.isAnswered.toString() === 'true') {
      this.isProceedingsAnswered = true
      this.isProceedingsCreated = true
      // this.eventBus.emit('is-proceedings-answered')
      this.isConfirmedProceedings = JSON.parse(localStorage?.getItem("answerProceeding"))?.isConfirmed
    } else if (+JSON.parse(localStorage?.getItem("answerProceeding"))?.roomId === +this.$store.getters.roomId && JSON.parse(localStorage?.getItem("answerProceeding"))?.isAnswered.toString() === 'false') {
      this.isProceedingsAnswered = false
      this.isProceedingsCreated = true
      // this.eventBus.emit('is-proceedings-answered')
      this.isConfirmedProceedings = JSON.parse(localStorage?.getItem("answerProceeding"))?.isConfirmed
    }
    this.eventBus.on('hide-toggle-control-meeting',()=>{
      this.isControlPanelShowed = true
    })
    this.eventBus.on('show-toggle-control-meeting',()=>{
      this.isControlPanelShowed = true
    })
    // this.eventBus.on('toggle-moderator-substitute', ({stat}) => {
    //   this.isModeratorSubstituteActivated = stat;
    //   this.setMicControlAllowed(true);
    // })
    this.eventBus.on('SUB_MODERATOR_IS_ACTIVE', (stat) => {
      if (stat){
        this.setMicControlAllowed(true);
        this.screenShareAllowed = true;
        this.setShareStatus(true);
      }else {
        this.setMicControlAllowed(false);
        this.screenShareAllowed = false;
        this.setShareStatus(false);
      }
    })
    this.eventBus.on('time-is-up-please-do-not-try',()=>{
      if (this.amIGuestUser){
        window.location.href = `${window.location.origin}/MeetingEnded`;
      }else {
        window.location.href = `${window.location.origin}/calendar/calendar`;
      }
    })
    this.eventBus.on('proceedings-allow', (data)=>{
      if (data.proceedingsAllow){
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "success",
          bodyText: this.$t("allow-minutes"),
          time: 5000,
        });
      }else {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "warning",
          bodyText: this.$t("disallow-minutes"),
          time: 5000,
        });
      }
      this.proceedingsAllowed = data.proceedingsAllow
    })
    this.eventBus.on('user_already_exist_in_meeting', ()=>{
      this.isDisplayNameRepeated = true
      setTimeout(()=>{
        this.eventBus.emit('leave-jitsi-meeting')
        this.webSocketClient.iWantToLeave(this.$store.getters.userId);
        this.webSocketClient?.disconnect();
      },5000)
    })
    this.eventBus.on('TOGGLE_SETTINGS_PANEL', () => {
      if (this.isMobile){
        this.isControlPanelShowed = false
      }
    })
    this.eventBus.on('CHANGE_MEETING_VIDEO_QUALITY',()=>{
      this.isVideoQualityModalOpened = true
    })
    this.eventBus.on('close-pre-join-page', ()=>{
      this.isJoinToMeeting = true
    })
    this.eventBus.on('end-recording-from-browser-api', ()=>{
      this.isClientRecordingStart = false
      this.isMeetingInRecordingMode = !!this.$store.getters.egressId
    })

    this.eventBus.on('camera_changed', (id) => {
      console.info("new camera recived")
      this.changeCamera(id)
    })
    this.eventBus.on('microphone_changed', (id) => {
      console.info("new microphone recived")
      this.changeMicrophone(id)
    })
    this.eventBus.on('show-my-video-stream',()=>{
      this.isMyVideoStreamDisplayed = true
    })
    this.eventBus.on('hide-my-video-stream',()=>{
      this.isMyVideoStreamDisplayed = false

    })
    this.eventBus.on('maximize-active-speaker',()=>{
      this.isActiveSpeakerMaximized = true
    })

    this.eventBus.on('minimize-active-speaker',()=>{
      this.isActiveSpeakerMaximized = false
    })
    this.eventBus.on('You_Have_Permission_To_Join', (data) => {
      this.moderator_joined = true
      this.isModeratorJoined = true
      this.isModeratorAccept = !data.publishStatus
      if (!data.publishStatus) {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "warning",
          bodyText: 'اجازه حضور در جلسه به شما داده نشد',
          time: 3000,
        });
        setTimeout(() => {
          window.location.href = config.MEETING_ENDED;
        }, 3000)

      }else {
        this.IWantToPublishHandler()
      }
    })
    this.eventBus.on('GET_EGRESS_ID',(egressId)=>{
      this.$store.dispatch('saveEgressID', egressId)
    })
    this.eventBus.on('send-signal-to-edit-agenda', ()=>{
      const editAgendaMessage = JSON.stringify({action: 'editAgenda'})
      const encodeEditAgendaMessage = new TextEncoder().encode(editAgendaMessage);
      this.room.localParticipant.publishData(
          encodeEditAgendaMessage,
          {
            kind: "reliable",
            topic: "editAgenda",
            destinationIdentities: [] // Only send to this participant
          }        // Set to true for guaranteed delivery
      );
    })
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },
};
</script>

<style>
@import "./style.css";
</style>

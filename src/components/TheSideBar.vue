<template>
  <div
      v-if="!isMobile"
      class="side-bar-container"
      ref="side-bar"
      style="width: 36rem"
  >
    <div class="side-bar" ref="containeruser">
      <div style="display: flex;flex-direction: column;gap: 1.6rem">
        <section :class="$i18n.locale === 'fa' ?  'side-bar__header-rtl' : 'side-bar__header-ltr'">
          <div v-if="!isChatInPrivateMode" style=" width: 100%;  padding: 0 1.4rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;">
            <h2>
            <span>{{ sideBarTitle }}</span
            >
<!--              <span>&nbsp;</span-->
<!--            ><span ref="chat-with-p" class="chat-with"> </span>-->
            </h2>
            <img draggable="false" src="/img/close.svg"  @click="closeSideBar" alt="not-loaded" style="cursor: pointer">

          </div>
          <div style="height: 5rem;width: 100%;display: flex;flex-direction: row-reverse;justify-content: space-between;align-items: center;padding: 0 1.4rem" v-else>
            <div style="display: flex;flex-direction: row;align-items: center;gap: 0.8rem;font-size: 1.4rem;font-weight: 700">
                 <span >
            {{ chatWith.label }}
          </span>
              <img draggable="false"  src="/img/contact.svg" alt="not loaded" style="width: 3rem" />
            </div>

            <img draggable="false" src="/img/back-arrow.svg" alt="not-loaded" style="cursor: pointer" @click="backToChatList">



          </div>
        </section>
        <section v-if="insideComponent === 'chat' && !isChatInPrivateMode" class="choose-tab-in-side-bar-container" :style="{position:'relative',top:isIos ? '2rem' : '' , padding: $i18n.locale !== 'en' ? '0 1.4rem' : '0px 0.4rem'}">
          <div :style="{color:whichItem === $store.getters.t('publicChat') ? 'white' : '' ,'background-color':whichItem === $store.getters.t('publicChat') ? '#1B76FF' : '',position:'relative'}" @click="chooseChatOrProceedings($store.getters.t('publicChat'))">
            <div class="notification-badge-side-bar" v-if="allPublicChats.length > 0 && whichItem !== $store.getters.t('publicChat')"></div>
            {{$store.getters.t("publicChat")}}</div>
          <div :style="{color:whichItem === $store.getters.t('privateChat') ? 'white' : '' ,'background-color':whichItem ===$store.getters.t('privateChat') ? '#1B76FF' : '',position:'relative'}" @click="chooseChatOrProceedings($store.getters.t('privateChat'))">
            <div class="notification-badge-side-bar" v-if="unreadPrivateChatList > 0 && whichItem !== $store.getters.t('privateChat')"></div>
            {{$store.getters.t('privateChat')}}</div>
          <div v-if="(proceedingsAllowed ||
            !$store.getters.hasModerator && this.$store.getters.amIModerator) || isProceedingsStarted" :style="{color:whichItem === $store.getters.t('proceedings') ? 'white' : '' ,'background-color':whichItem === $store.getters.t('proceedings') ? '#1B76FF' : '',position:'relative'}" @click="chooseChatOrProceedings($store.getters.t('proceedings'))">
            <div class="notification-badge-side-bar__proceedings" style="color: white" v-if="proceedingsNotificationBadge"></div>
            <div class="notification-badge-side-bar" v-if="proceedingsCreated && !isProceedingsAnswered"></div>
            {{$store.getters.t('proceedings')}}</div>
        </section>
        <section v-if="insideComponent === 'polling' && ($store.getters.amIModerator || isModeratorSubstituteActivated || !$store.getters.hasModerator)" class="choose-tab-in-side-bar-container" :style="{position:'relative',top:isIos ? '2rem' : ''}">
          <div :style="{color:whichPollingItem === $store.getters.t('multiple-choice-polling') ? 'white' : '' ,'background-color':whichPollingItem === $store.getters.t('multiple-choice-polling') ? '#1B76FF' : '',position:'relative' }" @click="choosePolling($store.getters.t('multiple-choice-polling'))">
            <div class="notification-badge-side-bar__polling" v-if="notAnsweredOptionalPolling > 0">
              {{ notAnsweredOptionalPolling }}</div>
            {{$store.getters.t("multiple-choice-polling")}}</div>
          <div :style="{color:whichPollingItem === $store.getters.t('descriptive-polling') ? 'white' : '' ,'background-color':whichPollingItem ===$store.getters.t('descriptive-polling') ? '#1B76FF' : '',position:'relative' }" @click="choosePolling($store.getters.t('descriptive-polling'))">
            <div class="notification-badge-side-bar__polling" v-if="notAnsweredDescriptivePolling > 0">
              {{ notAnsweredDescriptivePolling }}</div>
            {{$store.getters.t('descriptive-polling')}}</div>
        </section>
        <section v-else-if="insideComponent === 'polling' && (!$store.getters.amIModerator && !isModeratorSubstituteActivated)" class="choose-tab-in-side-bar-container" :style="{position:'relative',top:isIos ? '2rem' : '' , padding: $i18n.locale !== 'en' ? '0 1.4rem' : '0px 0.4rem'}">
          <div :style="{color:(allOptionalPolling.length === 0) ? '#75758F' : whichPollingItem === $store.getters.t('multiple-choice-polling') ? 'white' : '' ,'background-color':whichPollingItem === $store.getters.t('multiple-choice-polling') ? '#1B76FF' : '',position:'relative',cursor:(allOptionalPolling.length === 0) ? 'not-allowed' : '' }" @click="choosePollingForConfirm($store.getters.t('multiple-choice-polling'))">
            <div class="notification-badge-side-bar__polling" style="color: white" v-if="notAnsweredOptionalPolling > 0 && !$store.getters.amIModerator && !isModeratorSubstituteActivated">
              {{ notAnsweredOptionalPolling }}</div>
            {{$store.getters.t("multiple-choice-polling")}}</div>
          <div :style="{color:(allDescriptivePolling.length === 0) ? '#75758F' : whichPollingItem === $store.getters.t('descriptive-polling') ? 'white' : '' ,'background-color':whichPollingItem ===$store.getters.t('descriptive-polling') ? '#1B76FF' : '',position:'relative',cursor:(allDescriptivePolling.length === 0) ? 'not-allowed' : '' }" @click="choosePollingForConfirm($store.getters.t('descriptive-polling'))">
            <div class="notification-badge-side-bar__polling" style="color: white" v-if="notAnsweredDescriptivePolling > 0 && !$store.getters.amIModerator && !isModeratorSubstituteActivated">
              {{ notAnsweredDescriptivePolling }}</div>
            {{$store.getters.t('descriptive-polling')}}</div>
        </section>
      </div>

      <section :class="isChatInPrivateMode ? 'side-bar__body--private-chat' : 'side-bar__body'" :style="{height: insideComponent === 'participants' ? 'calc(100% - 3.2rem)' : 'calc(100% - 8.8rem)'}">
        <div v-show="insideComponent === 'participants'" style="width: 100%;height: 100%">
          <participants-section
              :am-i-selected-moderator="amISelectedModerator"
              :new-moderator-user-id="newModeratorUserId"
              :new-sub-moderator-id="newSubModeratorId"
              :sub-moderator = "isModeratorSubstituteActivated"
              :online-participants="onlineParticipants"
              :ext-services-online-participants="extServicesOnlineParticipants"
              :is-proceedings-started="isProceedingsStarted"
              :is-moderator-substitute-activated="isModeratorSubstituteActivated"
          ></participants-section>
        </div>
        <div v-show="showChatBoxComponent" style="height: 100%;width: 100%">
          <chat-box
              :inside-sidebar="insideComponent"
              :online-participants="onlineParticipants"
              :ext-services-online-participants="extServicesOnlineParticipants"
              :message-received="messageReceived"
              :side-bar-status="sideBarStatus"
              :chat-type="whichItem"
              :chat-with="chatWith"
              :is-chat-open="showChatBoxComponent"
              @chat-type="getChatType"
              @send-chat="sendChat"
              @receive-chat="receiveChat"
              @receive-public-chat="receivePublicChat"
          ></chat-box>
        </div>

        <div v-show="showPrivateChatList">
          <private-chat-list v-if="showPrivateChatList" :participants-in-my-chat-list="participantsInMyChatList"></private-chat-list>
        </div>
        <div style="max-height: calc(100% - 8rem); overflow-y: auto" v-if="isProceedingsAllowed" v-show=" insideComponent === 'chat' && chatBoxTitle === $store.getters.t('proceedings') && insideComponent !== 'participants'">
          <create-proceedings :all-proceedings-paragraphs="allProceedingsParagraphs" :proceedings-id="proceedingsId" :proceedings-allowed="proceedingsAllowed"  :is-proceedings-created="isProceedingsCreated"  :is-confirmed-proceedings="isConfirmedProceedings" :is-proceedings-answered="isProceedingsAnswered" :is-proceedings-started="isProceedingsStarted" :chat-box-title="chatBoxTitle" :side-bar-is-visible="isSideBarVisible"></create-proceedings>
        </div>
        <div v-else style="max-height: calc(100% - 8rem); overflow-y: auto" v-show="insideComponent === 'chat' && (chatBoxTitle === $store.getters.t('proceedings') && insideComponent !== 'participants' && isProceedingsStarted &&  (!proceedingsAllowed && $store.getters.hasModerator || (!$store.getters.hasModerator && isProceedingsStarted && +proceedingsCreatorUserId !== +$store.getters.userId)))">
          <confirm-proceedings :proceedings-date-created="proceedingsDateCreated" :proceedings-id="proceedingsId" :is-proceedings-created="isProceedingsCreated"   :is-confirmed-proceedings="isConfirmedProceedings" :is-proceedings-answered="isProceedingsAnswered" :proceedings-secretary="proceedingsSecretary"  :proceedings-created="proceedingsCreated" :proceedings-number="proceedingsNumber" :is-proceedings-started:="isProceedingsStarted" :all-proceedings-paragraphs="allProceedingsParagraphs" :not-complete-paragraph-index="notCompleteParagraphIndex"></confirm-proceedings>
        </div>
        <div v-show="insideComponent === 'polling' && ($store.getters.amIModerator || isModeratorSubstituteActivated)" ref="create-poll" style="max-height: calc(100% - 9rem); overflow-y: auto">
          <create-polling :which-polling-item="whichPollingItem" :all-polling-created="allOptionalPolling" :all-descriptive-polling-created="allDescriptivePolling" :not-answered-descriptive-polling="notAnsweredDescriptivePolling"
                          :not-answered-optional-polling="notAnsweredOptionalPolling" :am-i-guest-user="amIGuestUser"></create-polling>
        </div>
        <div v-show="insideComponent === 'polling' && (!$store.getters.amIModerator && !isModeratorSubstituteActivated && $store.getters.hasModerator || !$store.getters.hasModerator && !$store.getters.amIModerator)" style="max-height: 100%; overflow-y: auto">
          <confirm-polling
              :all-optional-polling="allOptionalPolling"
              :all-descriptive-polling="allDescriptivePolling"
              :which-polling="whichPollingItem"
              :not-answered-descriptive-polling="notAnsweredDescriptivePolling"
              :not-answered-optional-polling="notAnsweredOptionalPolling"
              ></confirm-polling>
        </div>
      </section>
    </div>
  </div>

  <div :class="isDeviceIphone ? 'side-bar-container__iphone' : 'side-bar-container__mobile'" ref="side-bar" v-else>
    <div class="side-bar__mobile" ref="containeruser">
      <div style="display: flex;flex-direction: column;gap: 1.6rem">
        <section :class="$i18n.locale === 'fa' ?  'side-bar__header-rtl' : 'side-bar__header-ltr'">
          <div v-if="!isChatInPrivateMode" style=" width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;">
            <h2>
            <span>{{ sideBarTitle }}</span
            >
              <!--              <span>&nbsp;</span-->
              <!--            ><span ref="chat-with-p" class="chat-with"> </span>-->
            </h2>
            <img draggable="false" src="/img/close.svg"  @click="closeSideBar" alt="not-loaded" style="cursor: pointer">

          </div>
          <div style="height: 5rem;width: 100%;display: flex;flex-direction: row-reverse;justify-content: space-between;align-items: center" v-else>
            <div style="display: flex;flex-direction: row;align-items: center;gap: 0.8rem;font-size: 1.4rem;font-weight: 700">
                 <span >
            {{ chatWith.label }}
          </span>
              <img draggable="false"  src="/img/contact.svg" alt="not loaded" style="width: 3rem" />
            </div>

            <img draggable="false" src="/img/back-arrow.svg" alt="not-loaded" style="cursor: pointer" @click="backToChatList">



          </div>
        </section>
        <section v-if="insideComponent === 'chat' && !isChatInPrivateMode" class="choose-tab-in-side-bar-container-mobile" :style="{position:'relative',top:isIos ? '2rem' : '' , padding: $i18n.locale !== 'en' ? '0 1.4rem' : '0px 0.4rem'}">
          <div :style="{color:whichItem === $store.getters.t('publicChat') ? 'white' : '' ,'background-color':whichItem === $store.getters.t('publicChat') ? '#1B76FF' : '',position:'relative'}" @click="chooseChatOrProceedings($store.getters.t('publicChat'))">
            <div class="notification-badge-side-bar" v-if="allPublicChats.length > 0 && whichItem !== $store.getters.t('publicChat')"></div>
            {{$store.getters.t("publicChat")}}</div>
          <div :style="{color:whichItem === $store.getters.t('privateChat') ? 'white' : '' ,'background-color':whichItem ===$store.getters.t('privateChat') ? '#1B76FF' : '',position:'relative'}" @click="chooseChatOrProceedings($store.getters.t('privateChat'))">
            <div class="notification-badge-side-bar" v-if="unreadPrivateChatList > 0 && whichItem !== $store.getters.t('privateChat')"></div>
            {{$store.getters.t('privateChat')}}</div>
          <div v-if="(proceedingsAllowed ||
            !$store.getters.hasModerator && this.$store.getters.amIModerator) || isProceedingsStarted" :style="{color:whichItem === $store.getters.t('proceedings') ? 'white' : '' ,'background-color':whichItem === $store.getters.t('proceedings') ? '#1B76FF' : '',position:'relative'}" @click="chooseChatOrProceedings($store.getters.t('proceedings'))">
            <div class="notification-badge-side-bar" v-if="proceedingsCreated && !isProceedingsAnswered"></div>
            {{$store.getters.t('proceedings')}}</div>
        </section>
        <section v-if="insideComponent === 'polling' && ($store.getters.amIModerator || isModeratorSubstituteActivated || !$store.getters.hasModerator)" class="choose-tab-in-side-bar-container" :style="{position:'relative',top:isIos ? '2rem' : ''}">
          <div :style="{color:whichPollingItem === $store.getters.t('multiple-choice-polling') ? 'white' : '' ,'background-color':whichPollingItem === $store.getters.t('multiple-choice-polling') ? '#1B76FF' : '',position:'relative' }" @click="choosePolling($store.getters.t('multiple-choice-polling'))">
            <div class="notification-badge-side-bar__polling" v-if="notAnsweredOptionalPolling > 0">
              {{ notAnsweredOptionalPolling }}</div>
            {{$store.getters.t("multiple-choice-polling")}}</div>
          <div :style="{color:whichPollingItem === $store.getters.t('descriptive-polling') ? 'white' : '' ,'background-color':whichPollingItem ===$store.getters.t('descriptive-polling') ? '#1B76FF' : '',position:'relative' }" @click="choosePolling($store.getters.t('descriptive-polling'))">
            <div class="notification-badge-side-bar__polling" v-if="notAnsweredDescriptivePolling > 0">
              {{ notAnsweredDescriptivePolling }}</div>
            {{$store.getters.t('descriptive-polling')}}</div>
        </section>
        <section v-else-if="insideComponent === 'polling' && (!$store.getters.amIModerator && !isModeratorSubstituteActivated)" class="choose-tab-in-side-bar-container" :style="{position:'relative',top:isIos ? '2rem' : ''}">
          <div :style="{color:(allOptionalPolling?.length === 0) ? '#75758F' : whichPollingItem === $store.getters.t('multiple-choice-polling') ? 'white' : '' ,'background-color':whichPollingItem === $store.getters.t('multiple-choice-polling') ? '#1B76FF' : '',position:'relative',cursor:(allOptionalPolling?.length === 0) ? 'not-allowed' : '' }" @click="choosePollingForConfirm($store.getters.t('multiple-choice-polling'))">
            <div class="notification-badge-side-bar__polling" style="color: white" v-if="notAnsweredOptionalPolling > 0 && !$store.getters.amIModerator && !isModeratorSubstituteActivated">
              {{ notAnsweredOptionalPolling }}</div>
            {{$store.getters.t("multiple-choice-polling")}}</div>
          <div :style="{color:(allDescriptivePolling?.length === 0) ? '#75758F' : whichPollingItem === $store.getters.t('descriptive-polling') ? 'white' : '' ,'background-color':whichPollingItem ===$store.getters.t('descriptive-polling') ? '#1B76FF' : '',position:'relative',cursor:(allDescriptivePolling?.length === 0) ? 'not-allowed' : '' }" @click="choosePollingForConfirm($store.getters.t('descriptive-polling'))">
            <div class="notification-badge-side-bar__polling" style="color: white" v-if="notAnsweredDescriptivePolling > 0 && !$store.getters.amIModerator && !isModeratorSubstituteActivated">
              {{ notAnsweredDescriptivePolling }}</div>
            {{$store.getters.t('descriptive-polling')}}</div>
        </section>
      </div>



<!--      <section :class="$i18n.locale === 'fa' ?  'side-bar__header-rtl' : 'side-bar__header-ltr'" :style="{position:'relative',top:isIos ? '2rem' : ''}">-->
<!--        <header>-->
<!--          <h2>-->
<!--            <span>{{ sideBarTitle }}</span>-->
<!--&lt;!&ndash;            <span>&nbsp;</span&ndash;&gt;-->
<!--&lt;!&ndash;          ><span ref="chat-with-p" class="chat-with"> </span>&ndash;&gt;-->
<!--          </h2>-->
<!--          <div class="close-icon" @click="closeSideBar">&#10005;</div>-->
<!--        </header>-->
<!--      </section>-->
      <section :class="isChatInPrivateMode ? 'side-bar__body--private-chat' : 'side-bar__body'" :style="{position:'relative',top:(insideComponent === 'participants' && isIos )? '1.5rem' : '',height: insideComponent === 'participants' ? 'calc(100% - 3.2rem)' : 'calc(100% - 8.8rem)'}">
        <participants-section
            v-if="insideComponent === 'participants'"
            :am-i-selected-moderator="amISelectedModerator"
            :new-moderator-user-id="newModeratorUserId"
            :new-sub-moderator-id="newSubModeratorId"
            :sub-moderator = "isModeratorSubstituteActivated"
            :online-participants="onlineParticipants"
            :ext-services-online-participants="extServicesOnlineParticipants"
            :is-proceedings-started="isProceedingsStarted"
            :is-moderator-substitute-activated="isModeratorSubstituteActivated"

            :style="{position:'relative',top:isIos ? '2.5rem' : '4rem'}"
        ></participants-section>
        <chat-box
            v-show="showChatBoxComponent"
            :inside-sidebar="insideComponent"
            :online-participants="onlineParticipants"
            :ext-services-online-participants="extServicesOnlineParticipants"
            :message-received="messageReceived"
            :side-bar-status="sideBarStatus"
            :chat-type="whichItem"
            :chat-with="chatWith"
            :is-chat-open="(chatBoxTitle === $store.getters.t('publicChat') || (chatBoxTitle === $store.getters.t('privateChat') && isChatInPrivateMode  )) && insideComponent !== 'participants'&& insideComponent !== 'polling'"
            @chat-type="getChatType"
            @send-chat="sendChat"
            @receive-chat="receiveChat"
            @receive-public-chat="receivePublicChat"
        ></chat-box>
        <private-chat-list v-if="showPrivateChatList" :participants-in-my-chat-list="participantsInMyChatList"></private-chat-list>
        <div style="max-height: calc(100% - 8rem); overflow-y: auto" v-if="!isProceedingsCreated && isProceedingsAllowed" v-show=" insideComponent === 'chat' && chatBoxTitle === $store.getters.t('proceedings') && insideComponent !== 'participants' && (proceedingsAllowed || (!$store.getters.hasModerator && !isProceedingsStarted || !$store.getters.hasModerator && isProceedingsStarted && (+proceedingsCreatorUserId === +$store.getters.userId) ) && !this.$store.getters.amIGuest)">
          <create-proceedings v-if="isProceedingsAllowed" v-show=" insideComponent === 'chat' && chatBoxTitle === $store.getters.t('proceedings') && insideComponent !== 'participants'"  :is-confirmed-proceedings="isConfirmedProceedings" :is-proceedings-answered="isProceedingsAnswered" :chat-box-title="chatBoxTitle" :side-bar-is-visible="isSideBarVisible"></create-proceedings>
        </div>
        <div style="max-height: calc(100% - 8rem); overflow-y: auto" v-show="insideComponent === 'chat' && (chatBoxTitle === $store.getters.t('proceedings') && insideComponent !== 'participants' && isProceedingsStarted &&  (!proceedingsAllowed && $store.getters.hasModerator || (!$store.getters.hasModerator && isProceedingsStarted && +proceedingsCreatorUserId !== +$store.getters.userId)))">
          <confirm-proceedings :proceedings-date-created="proceedingsDateCreated" :proceedings-id="proceedingsId" :is-proceedings-created="isProceedingsCreated"  :is-confirmed-proceedings="isConfirmedProceedings" :is-proceedings-answered="isProceedingsAnswered" :proceedings-secretary="proceedingsSecretary"  :proceedings-created="proceedingsCreated" :proceedings-number="proceedingsNumber" :is-proceedings-started:="isProceedingsStarted" :all-proceedings-paragraphs="allProceedingsParagraphs" :not-complete-paragraph-index="notCompleteParagraphIndex"></confirm-proceedings>
        </div>
        <div v-show="insideComponent === 'polling' && ($store.getters.amIModerator || isModeratorSubstituteActivated)" ref="create-poll" style="max-height: calc(100% - 9rem); overflow-y: auto">
          <create-polling :which-polling-item="whichPollingItem" :all-polling-created="allOptionalPolling" :all-descriptive-polling-created="allDescriptivePolling" :not-answered-descriptive-polling="notAnsweredDescriptivePolling"
                          :not-answered-optional-polling="notAnsweredOptionalPolling" :am-i-guest-user="amIGuestUser"></create-polling>
        </div>
        <div v-show="insideComponent === 'polling' && (!$store.getters.amIModerator && !isModeratorSubstituteActivated && $store.getters.hasModerator || !$store.getters.hasModerator && !$store.getters.amIModerator)" style="max-height: 100%; overflow-y: auto">
          <confirm-polling
              :descriptive-polling="descriptivePolling"
              :all-optional-polling="allOptionalPolling"
              :all-descriptive-polling="allDescriptivePolling"
              :which-polling="whichPollingItem"
              :not-answered-descriptive-polling="notAnsweredDescriptivePolling"
              :not-answered-optional-polling="notAnsweredOptionalPolling"
          ></confirm-polling>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import ParticipantsSection from "./ParticipantsSection";
import ChatBox from "./ChatBox";
import DetectMobile from '../utils/detectMobile';
import PrivateChatList from "@/components/PrivateChatList.vue";
import {nextTick} from "vue";
import CreateProceedings from "@/components/CreateProceedings.vue";
import ConfirmProceedings from "@/components/ConfirmProceedings.vue";
import CreatePolling from "@/components/CreatePolling.vue";
import ConfirmPolling from "@/components/ConfirmPolling.vue";

export default {
  name: "TheSideBar",
  components: {
    ConfirmPolling,
    CreatePolling,ConfirmProceedings, CreateProceedings, ChatBox, ParticipantsSection,PrivateChatList},
  // inject: ["isMobile"],
  emits: ["close-side-bar"],
  props: [
    "insideComponent",
    "amISelectedModerator",
      "newModeratorUserId",
      "newSubModeratorId",
      "subModerator",
      "isIos",
    "onlineParticipants",
      "extServicesOnlineParticipants",
      "messageReceived",
      "sideBarStatus",
      "sideBarChatInterior",
      "amIModerator",
      "proceedingsAllowed",
      "isSideBarVisible",
      "participantsInMyChatList",
      "allPublicChats",
      "isProceedingsStarted",
      "allProceedingsParagraphs",
       "notCompleteParagraphIndex",
      "proceedingsSecretary",
      "proceedingsNumber",
      "proceedingsCreated",
      "isProceedingsAnswered",
      "isConfirmedProceedings",
      "isProceedingsCreated",
      "proceedingsId",
      "proceedingsDateCreated",
      "allOptionalPolling",
      "allDescriptivePolling",
      "whichPollingTabForConfirm",
      "notAnsweredDescriptivePolling",
      "notAnsweredOptionalPolling",
      "isModeratorSubstituteActivated",
      "proceedingsCreatorUserId",
      "amIGuestUser"

  ],
  data() {
    return {
      chatBoxTitle: this.$store.getters.t("publicChat"),
      SideBarHeight: 0,
      whichItem: 'گفتگوی عمومی',
      whichPollingItem: this.$store.getters.t("multiple-choice-polling"),
      isChatInPrivateMode: false,
      chatWith:{label:this.$store.getters.t("all"), participantId:this.$store.getters.t("all")},
      isGuest:false,
      isDeviceIphone:false,
    };
  },
  watch:{
    proceedingsAllowed:{
      handler(val) {
        if (!val && this.whichItem === this.$store.getters.t('proceedings')){
          this.chooseChatOrProceedings(this.$store.getters.t('publicChat'))
        }
      }
    },
    chatBoxTitle: {
      immediate: true,
      handler(val) {
        if ((!this.chatWith?.label && val === this.$store.getters.t('privateChat')) || (val === this.$store.getters.t('publicChat')))
          this.isChatInPrivateMode = false;
      }
    },
    isSideBarVisible(val){
      if ((this.chatBoxTitle === this.$store.getters.t("privateChat")) && !val){
        this.isChatInPrivateMode = false
      }
    },
    whichPollingTabForConfirm(val){
      this.whichPollingItem = val
    },
  },
  computed: {
    isProceedingsAllowed(){
      return (this.proceedingsAllowed || (!this.$store.getters.hasModerator && this.$store.getters.amIModerator ) )

      // return (this.proceedingsAllowed || (!this.$store.getters.hasModerator && !this.isProceedingsStarted || !this.$store.getters.hasModerator && this.isProceedingsStarted && (+this.proceedingsCreatorUserId === +this.$store.getters.userId) ) && !this.$store.getters.amIGuest)
    },
    sideBarTitle() {
      let title;
      if (this.insideComponent === "participants") {
        title = this.$store.getters.t("participants");
        this.eventBus.emit('chat-title-changed')
      } else if (
          this.insideComponent === "chat" &&
          this.chatBoxTitle === this.$store.getters.t("publicChat")
      ) {
        title = this.chatBoxTitle;
        this.eventBus.emit('chat-title-public')
      } else if (
          this.insideComponent === "chat" &&
          this.chatBoxTitle === this.$store.getters.t("privateChat")
      ) {
        title = this.chatBoxTitle;
        this.eventBus.emit('chat-title-changed')
      }else if (this.insideComponent === "chat" && this.chatBoxTitle === this.$store.getters.t('proceedings')){
        title = this.$store.getters.t("proceedings")
      }else if (this.insideComponent === 'polling'){
        title = this.$store.getters.t("polling")
      }
      return title;
    },
    unreadPrivateChatList(){
      let counter = 0
      this.participantsInMyChatList.forEach((el)=>{
        counter += el.unreadMessages.length
      })
      return  counter
    },
    proceedingsNotificationBadge() {
      return !this.isProceedingsAnswered && (this.proceedingsCreated || this.isProceedingsStarted)
    },
    showChatBoxComponent(){
      return this.insideComponent === 'chat' && (this.chatBoxTitle === this.$store.getters.t('publicChat') || (this.chatBoxTitle === this.$store.getters.t('privateChat') && this.isChatInPrivateMode))
    },
    showPrivateChatList(){
      return (this.insideComponent === 'chat') && (this.chatBoxTitle === this.$store.getters.t('privateChat')) && !this.isChatInPrivateMode && (this.insideComponent !== 'participants')
    }
  },
  methods: {
    goToPublicChat() {
      this.eventBus.emit("go-to-public-chat");
    },
    closeSideBar() {
      this.$emit("close-side-bar");
      this.eventBus.emit("close-the-side-bar");
    },
    // getChatType(type) {
    //   console.error('getTyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyype')
    //   if (type === "public") {
    //     this.chatBoxTitle = this.$store.getters.t("publicChat");
    //     this.eventBus.emit('chat-title-public')
    //   } else {
    //     this.chatBoxTitle = this.$store.getters.t("privateChat");
    //   }
    //   // if (this.$refs["chat-with-p"])
    //   //   this.$refs["chat-with-p"].textContent = val;
    // },
    chooseChatOrProceedings(item){
      if (item === this.$store.getters.t("publicChat")){
        this.chatWith = {label:this.$store.getters.t("all"), participantId:this.$store.getters.t("all")}
        // this.eventBus.emit('change-chat-with',this.chatWith)
      }
      this.whichItem = item
      this.chatBoxTitle = item
      this.isChatInPrivateMode = false
      this.$emit('choose-chat-or-proceedings',item)
    },
    choosePolling(item){
        this.whichPollingItem = item
        this.$emit('choose-polling-tab',item)
    },
    choosePollingForConfirm(item){
      if(item === this.$store.getters.t("multiple-choice-polling") && this.allOptionalPolling?.length > 0){
        this.whichPollingItem = item
        this.$emit('choose-polling-tab',item)
      }else if((item === this.$store.getters.t('descriptive-polling')) && this.allDescriptivePolling?.length > 0 ) {
        this.whichPollingItem = item
        this.$emit('choose-polling-tab',item)
      }
    },
    backToChatList(){
      this.chatWith = {label:'', participantId:''}
      this.eventBus.emit('change-chat-with',this.chatWith)
      this.isChatInPrivateMode = false
    },
    sendChat(participant,message){
      this.$emit('send-chat',participant,message)

    },
    receiveChat(participant,message){
      this.$emit('receive-chat',participant,message)

    },
    receivePublicChat(text){
      this.$emit('receive-public-chat',text)
    },
  },
  mounted() {
    if (navigator.userAgent.match(/iPhone/i)) {
      this.isDeviceIphone = true
    }
    this.eventBus.on('guest-user-joined',()=>{
      this.isGuest = true
    })
    this.eventBus.on('go-private-message', (data) => {
      // const index = this.allParticipants.findIndex((el) => {
      //   return el.label === data
      // })
      this.whichItem = this.$store.getters.t("privateChat")
      this.chatBoxTitle = this.$store.getters.t("privateChat")
      nextTick(()=>{
        this.isChatInPrivateMode = true
        console.error('chat width:')
        console.error(data)
        if (data?.participantId){
          this.chatWith = data
        }else {
          this.chatWith = {label:data.label, participantId: data.userId}
        }
      })
    })
    this.eventBus.on('go-to-private-chat',(participant)=>{
      console.error('privaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaate')
      console.error(participant)
      this.whichItem = this.$store.getters.t("privateChat")
      this.chatBoxTitle = this.$store.getters.t("privateChat")
      nextTick(()=>{
        this.isChatInPrivateMode = true
        console.error('chat width2:')
        console.error(participant)
        if (participant?.participantId){
          this.chatWith = participant
        }else {
          this.chatWith = {label:participant.label, participantId: participant.userId}
        }
      })

    })
    // this.eventBus.on('close-the-side-bar',()=>{
    //   this.chatWith = {}
    // })
    this.eventBus.on('show-proceedings',()=>{
      this.whichItem = this.$store.getters.t('proceedings')
      this.chatBoxTitle = this.$store.getters.t('proceedings')
      this.$emit('choose-chat-or-proceedings',this.$store.getters.t("proceedings"))
    })
    this.eventBus.on('proceedings-deleted',()=>{
      this.chooseChatOrProceedings(this.$store.getters.t('publicChat'))
    })
    this.eventBus.on('scroll-top-create-polling',()=>{
      const scrollableDiv = this.$refs["create-poll"];
      if (scrollableDiv) {
        scrollableDiv.scrollTop = 0; // Set scroll position to top
      }
    })
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
};
</script>

<style scoped>
h2 > span:first-child {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.side-bar-container {
  height: 100%;
}

.side-bar {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2.5rem 0 1.3rem 0 ;
  background-color: white;
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.side-bar__header-rtl header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
}

.side-bar__header-rtl h2 {
  font-size: 1.5rem;
  display: flex;
  flex-direction: row-reverse;
}


.side-bar__header-ltr h2 {
  font-size: 1.5rem;
  display: flex;
  flex-direction: row;
}

.chat-with {
  color: #1a73e8;
  max-width: 15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
}

.close-icon {
  font-size: 2rem;
  margin-left: 1rem;
  cursor: pointer;
}

.close__sidebar {
  font-size: 2rem;
  margin-left: 1rem;
  cursor: pointer;
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}

.side-bar__body {
  width: 100%;
}
.side-bar__body--private-chat{
  width: 100%;
  height: calc(100% - 4.8rem);
}
.close-icon {
  font-size: 2.5rem;
  margin-left: 1rem;
  cursor: pointer;
}

.side-bar-container__mobile {
  width: 100vw;
  padding: 0;
  height: 90vh;
  position: fixed;
  bottom: 0;
  left: 0;
  /*margin-top: 2rem;*/
  z-index: 100000000;
}
.side-bar-container__iphone {
  width: 100vw;
  padding: 0;
  height: 80vh;
  position: fixed;
  bottom: 0;
  left: 0;
  /*margin-top: 2rem;*/
  z-index: 100000000;
}

.side-bar__mobile {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2.5rem 1.8rem 1.3rem 1.8rem;
  background-color: white;
  border-radius: 1.2rem;
}
.choose-tab-in-side-bar-container{
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  gap: 1.25rem;
  padding:0 1rem;
}
.choose-tab-in-side-bar-container > div{
  padding: 0.95rem 0.79rem;
  background-color: #F6F6F7;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  font-size: 1.25rem;
  cursor: pointer;
  font-weight: 700;
}
.choose-tab-in-side-bar-container > div:last-child{
  padding: 0.95rem 1.95rem;
  background-color: #F6F6F7;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  font-size: 1.2rem;
  cursor: pointer;
}
.choose-tab-in-side-bar-container-mobile{
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  gap: 0.8rem;
  margin-bottom: 1rem;
}
.choose-tab-in-side-bar-container-mobile > div{
  padding: 0.95rem 0.79rem;
  background-color: #F6F6F7;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: 700;
}
.choose-tab-in-side-bar-container-mobile > div:last-child{
  padding: 0.95rem 1.95rem;
  background-color: #F6F6F7;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  font-size: 1.2rem;
  cursor: pointer;
}

.notification-badge-side-bar{
  position: absolute;
  width: 1.6rem;
  height: 1.6rem;
  background-color:#2AB459 ;
  border: 0.2rem solid white;
  border-radius: 50%;
  top: -1rem;
  right: 0.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.notification-badge-side-bar__polling {
  position: absolute;
  width: 2.2rem;
  height: 2.2rem;
  background-color:#2AB459 ;
  border: 0.2rem solid white;
  border-radius: 50%;
  top: -1.8rem;
  right: 0.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  z-index: 2;
  color: white;
}
.notification-badge-side-bar__proceedings{
  position: absolute;
  width: 1.2rem;
  height: 1.2rem;
  background-color:#2AB459 ;
  border: 0.1rem solid black;
  border-radius: 50%;
  top: -0.8rem;
  right: 0.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
@media only screen and (max-width: 767px) {
  .side-bar-container__mobile {
    width: 100vw;
    padding: 0;
    height: 90vh;
    position: fixed;
    bottom: 0;
    /*margin-top: 2rem;*/
    /*z-index: 10;*/
  }

  .side-bar__mobile {
    width: 100%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    height: 100%;
  }
}

/*@media (min-width: 768px) and (max-width: 1024px) {*/
/*  .side-bar-container__mobile {*/
/*    width:100vw;*/
/*    padding: 0;*/
/*    height: 90vh;*/
/*    position: absolute;*/
/*    bottom: 0;*/
/*    z-index: 10;*/
/*  }*/

/*  .side-bar__mobile {*/
/*    width: 100%;*/
/*    border-bottom-left-radius: 0;*/
/*    border-bottom-right-radius: 0;*/
/*    height: 100%;*/
/*  }*/
/*}*/

/*@media (min-width: 320px) and (max-width: 1024px) and (max-height: 500px) {*/
/*  .side-bar-container__mobile {*/
/*    position: absolute;*/
/*    top: 1rem;*/
/*    width: 100vw;*/
/*    padding: 0;*/
/*    height: 95vh;*/
/*    bottom: 0;*/
/*    z-index: 10;*/
/*  }*/

/*  .side-bar__mobile {*/
/*    width: 100vw;*/
/*    border-bottom-left-radius: 0;*/
/*    border-bottom-right-radius: 0;*/
/*    height: 100%;*/
/*  }*/
/*}*/
</style>

<template>
  <base-modal :open="isEventClicked" :is-event-detail="true" is-blur="true" whichModal="eventDetail"
              :is-full-screen="isFullScreen" @close-modal="closeModal">
    <template #modal-header>
      <div ref="event-detail-header"
           :style="{'width': !isFullScreen ? '' : '98vw', direction:$i18n.locale !== 'en' ? 'rtl' : 'ltr'}"
           class="even-detail-header-fragment">
        <div :class="$i18n.locale !== 'en' ?'even-detail-header-title':'even-detail-header-title__ltr'"
             :style="{padding:isFullScreen ? '3rem 0 0 0' : '0'}">
          <div :class="$i18n.locale !== 'en' ?'even-detail-header-title-action':'even-detail-header-title-action__ltr'">
            <img draggable="false" v-show="!isFullScreen && !isMobile" src="/img/full-screen.svg" style="width: 16px; height: 16px;cursor: pointer"
                 alt="not loaded" @click="fullScreen">
            <img draggable="false" src="/img/close.svg" style="width: 24px; height: 24px;cursor: pointer" alt="not loaded"
                 @click="closeModal">

          </div>
          <div style="display: flex;flex-direction: row;gap: 1.6rem">
            <div style="font-size: 2.5rem"
                 :style="{'direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
              {{ meetingDataObject.title }}
            </div>
            <div v-if="meetingDataObject.tagName && !meetingDataObject.isWebinar" style="height: 100%;display: flex;align-items: center">
              <span :style="{'background-color':tagColor,color: 'white','border-radius': '2rem',padding:' 0.2rem 0.8rem'}">
                 {{meetingDataObject.tagName}}
              </span>
            </div>
            <div v-if="meetingDataObject.isWebinar" style="height: 100%;display: flex;align-items: center">
              <span :style="{'background-color':'#1B76FF',color: 'white','border-radius': '2rem',padding:' 0.2rem 0.8rem'}">
                 {{$store.getters.t('webinar')}}
              </span>
            </div>
          </div>


        </div>
        <div style="display: flex;flex-direction: column;gap: 0.8rem;width: 100%;max-width: 144rem">
          <div :class=" $i18n.locale !== 'en' ? 'even-detail-header-date': 'even-detail-header-date__ltr'">
            <div><img draggable="false" src="/img/schedule.svg" alt="not loaded"></div>
            <div>{{ meetingDataObject.eventDayName + ' ' + meetingDataObject.eventDay + ' ' + meetingDataObject.eventMonth }}</div>
            <div style="color:#9E9EB2 ">{{ '|' }}</div>
            <div :style="{direction:$i18n.locale !== 'en' ? 'rtl' : 'ltr'}"> {{
                $store.getters.t('session-time', {
                  'timeFrom': meetingDataObject.eventTimeFrom,
                  'timeTo': meetingDataObject.eventTimeTo
                })
              }}
            </div>
          </div>
          <div ref="tab"
               :style="{ 'max-width': fullScreen ? '144rem' : '' ,'width': fullScreen ? '' : '100% ','display':'flex'}">
            <div
                :class=" $i18n.locale !== 'en' ? 'even-detail-header-tabs-container':'even-detail-header-tabs-container__ltr'" :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}">
              <div :class=" $i18n.locale !== 'en' ? 'tabs_underline' : 'tabs_underline__ltr'"
                   :style="{'translate': $i18n.locale !== 'en' ? '-' + clickedIndex * tabContainerWidth + 'px' + ' ' + '0' : clickedIndex * tabContainerWidth + 'px' + ' ' + '0','width':tabContainerWidth + 'px' }"></div>
              <tab-item v-for="(tab, index) in tabItems" :tab-items="tabItems.length" :tab="tab" :key="tab.label"
                        :index="index" :is-active="tab.label === whichTab"
                        @choose-tab="chooseTab"></tab-item>
            </div>
          </div>
        </div>

      </div>

    </template>
    <template #modal-body>
      <div v-if="whichTab === this.$store.getters.t('meeting-info')" class="even-detail-body-meeting-Info"
           :style="{'width': !isFullScreen ? '' : '98vw', 'height': !isFullScreen ? '' : 'calc(100vh - 34rem)','max-height': !isFullScreen ? '40rem' : 'calc(100vh - 27rem)' }">
        <div class="even-detail-body-meeting-Info-rows" :style="{'max-width': fullScreen ? '144rem' : ''}">
          <div style="display: flex;gap: 0.8rem;align-items: center"
               :style="{'flex-direction': $i18n.locale !== 'en' ? 'row' : 'row-reverse'}">
            <img draggable="false" src="/img/monitor.svg" style="width: 16px; height: 16px;cursor: pointer" alt="not loaded">
            <span style="font-size: 1.2rem;color: #75758F"
                  :style="{'direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">{{ $store.getters.t('meeting-room') }}</span>
            <span class="room-name-text meeting-information--text">{{ meetingDataObject.roomName }}</span>
          </div>
          <div style="display: flex;gap: 0.8rem;align-items: center"
               :style="{'flex-direction': $i18n.locale !== 'en' ? 'row' : 'row-reverse'}">
            <img draggable="false" src="/img/user-circle.svg" style="width: 16px; height: 16px;cursor: pointer" alt="not loaded">
            <span style="font-size: 1.2rem;color: #75758F">{{ $store.getters.t('room-capacity') }}</span>
            <span
                class="meeting-information--text" :style="{'direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">{{
                $store.getters.t('room-capacity-length', {'capacity': meetingDataObject.roomCapacity})
              }}</span>
          </div>
        </div>
        <div class="even-detail-body-meeting-Info-rows" :style="{'max-width': fullScreen ? '144rem' : ''}">
          <div v-if="meetingDataObject.meetingType === 0" :class=" $i18n.locale !== 'en' ? 'manager-information' : 'manager-information__ltr'"
               :style="{'max-width': fullScreen ? '144rem' : ''}">
            <div style="  display: flex;gap: 0.8rem;align-items: center"
                 :style="{'flex-direction': $i18n.locale !== 'en' ? 'row' : 'row-reverse'}">
              <img draggable="false" src="/img/user-circle.svg" style="width: 16px; height: 16px;cursor: pointer" alt="not loaded">
              <span style="font-size: 1.2rem;color: #75758F"
                    :style="{'direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">{{ $store.getters.t('meeting-moderator') + ':' }}</span>
              <span
                  class="meeting-information--text__moderator-name">{{
                  meetingDataObject.firstNameManger != null ? meetingDataObject.firstNameManger + ' ' + meetingDataObject.lastNameManager : $store.getters.t('without-moderator')
                }}</span>
            </div>
            <!--            <div v-if="meetingDataObject.firstNameManger != null && !meetingDataObject.isWebinar"-->
            <!--                 style="display: flex;gap: 0.8rem;align-items: center"-->
            <!--                 :style="{'flex-direction': $i18n.locale !== 'en' ? 'row' : 'row-reverse'}">-->
            <!--              <img draggable="false" src="/img/user-circle.svg" style="width: 16px; height: 16px;cursor: pointer" alt="not loaded">-->
            <!--              <span style="font-size: 1.2rem;color: #75758F"-->
            <!--                    :style="{'direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">{{ $store.getters.t('moderator-sub') }}</span>-->
            <!--              <span :class=" $i18n.locale !== 'en' ? 'meeting-information&#45;&#45;text__moderator-name' : 'meeting-information&#45;&#45;text__ltr'">{{-->
            <!--                  meetingDataObject.substitutionName-->
            <!--                }}</span></div>-->
          </div>
          <div v-else :class=" $i18n.locale !== 'en' ? 'manager-information' : 'manager-information__ltr'"
               :style="{'max-width': fullScreen ? '144rem' : ''}">
            <div style="  display: flex;gap: 0.8rem;align-items: center"
                 :style="{'flex-direction': $i18n.locale !== 'en' ? 'row' : 'row-reverse'}">
              <img draggable="false" src="/img/user-circle.svg" style="width: 16px; height: 16px;cursor: pointer" alt="not loaded">
              <span
                  class="meeting-information--text__moderator-name">{{
                  $store.getters.t('without-moderator')
                }}</span>
            </div>

          </div>
          <div style="display: flex;gap: 0.8rem;align-items: center"
               :style="{'max-width': fullScreen ? '144rem' : '','flex-direction': $i18n.locale !== 'en' ? 'row' : 'row-reverse'}">
            <img draggable="false" src="/img/user-circle.svg" style="width: 16px; height: 16px;cursor: pointer" alt="not loaded">
            <span style="font-size: 1.2rem;color: #75758F"
                  :style="{'direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">{{ $store.getters.t('invited-members') }}</span>
            <span
                :class=" $i18n.locale !== 'en' ? 'meeting-information--invited-text' : 'meeting-information--invited-text__ltr'">{{
                $store.getters.t('invited-members-length', {'members': invitedMembers?.length}) + ' ' + noticeText
              }}</span>
          </div>
          <div :style="{'max-width': fullScreen ? '144rem' : ''}" style="overflow-y: auto">
            <invited-members
                :is-table="true"
                :invited-members="invitedMembers"
                :meeting-id="this.meetingDataObject.id"
            ></invited-members>
          </div>
        </div>
        <div class="even-detail-body-meeting-Info-rows">
          <div style="display: flex;gap: 0.8rem;align-items: center"
               :style="{'flex-direction': $i18n.locale !== 'en' ? 'row' : 'row-reverse'}">
            <img draggable="false" src="/img/description.svg" style="width: 16px;height: 16px" alt="not loaded">
            <span style="font-size: 1.2rem;color: #75758F"
                  :style="{'direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">{{ $store.getters.t('session-description') }}</span>
          </div>
          <div style="width: 100%;height: fit-content;font-size: 1.4rem"
               :style="{'direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
            {{ !meetingDataObject.description ? $store.getters.t('no-information') : meetingDataObject.description }}
          </div>
        </div>
      </div>
      <div v-if="whichTab === this.$store.getters.t('proceedings') && proceedingsParagraphs.length > 0" class="even-detail-body-proceedings"
           :style="{'width': !isFullScreen ? '' : '98vw', 'height': !isFullScreen ? '' : 'calc(100vh - 14rem)','max-height': !isFullScreen ? '70vh' : 'calc(100vh - 7rem)' }">
        <proceedings-information :proceedings-id="proceedingsId" :meeting-id="meetingDataObject.id" :proceedings-paragraphs="proceedingsParagraphs" @download-pdf="downloadPdf" @show-more-proceedings="clickToShowMoreProceedings"></proceedings-information>

      </div>

      <div v-if="whichTab === this.$store.getters.t('proceedings') && proceedingsParagraphs.length === 0" :style="{'width': !isFullScreen ? '' : '98vw', 'height': !isFullScreen ? '' : 'calc(100vh - 14rem)','max-height': !isFullScreen ? '40rem' : 'calc(100vh - 7rem)'}" style="font-size: 1.2rem;height: 30rem;display: flex;justify-content: center" class="even-detail-no-proceedings">
        {{$store.getters.t('there-is-no-proceedings')}}
      </div>
      <div v-if="whichTab === this.$store.getters.t('polling') && allPollings.length > 0" class="even-detail-body-polling"
           :style="{'width': !isFullScreen ? '' : '98vw', 'height': !isFullScreen ? '' : 'calc(100vh - 14rem)','max-height': !isFullScreen ? '70vh' : 'calc(100vh - 7rem)' }">
        <polling-information-card v-for="poll in allPollings" :key="poll.pollingId"
                                  :polling-id="poll.surveyId"
                                  :polling-data="poll.surveyQuestionRespDtoList"
                                  :polling-result-dto="poll.pollingResultDto"></polling-information-card>

      </div>
      <div v-if="whichTab === this.$store.getters.t('polling') && allPollings.length === 0"  :style="{'width': !isFullScreen ? '' : '98vw', 'height': !isFullScreen ? '' : 'calc(100vh - 14rem)','max-height': !isFullScreen ? '40rem' : 'calc(100vh - 7rem)'}" style="font-size: 1.2rem;height: 30rem;display: flex;justify-content: center" class="even-detail-no-proceedings">
        {{$store.getters.t('no_polling_found')}}
      </div>
    </template>
    <template #modal-buttons>
      <div v-if="!isMobile && whichTab === this.$store.getters.t('meeting-info')" :style="{width:isFullScreen ? '98vw' : '','max-width':isFullScreen ? '98vw' : '90rem'}"
           class="action--container-event-details">
        <div :style="{width: '100%','max-width':isFullScreen ? '144rem' : '90rem'}"
             style="height: 5rem;display: flex;justify-content: space-between">

          <div style="display: flex;flex-direction: row-reverse;gap: 0.8rem">
            <base-button
                v-if="userRole.length >1 && ((userRole[0] === 'ROLE_ADMIN' || userRole[1] === 'ROLE_ADMIN') || parseFloat(meetingDataObject.creatorUserId)  === parseFloat(this.$store.getters.userId) ) && isMeetingEditable && !meetingDataObject.isWebinar"

                :is-active="true"
                :button-inner-txt="$store.getters.t('edit-session')"
                :continuous-params="['color=#1B76FF', 'background-color=#F6F6F7','width=18.2rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem']"
                @btn-clicked="editCreatedMeeting"
            >
              <template #post-button-slot>
                <img draggable="false" src="/img/edit.svg" style="width: 16px; height: 16px" alt="not loaded">
              </template>
            </base-button>
            <base-button
                v-if="userRole.length >1 && ((userRole[0] === 'ROLE_ADMIN' || userRole[1] === 'ROLE_ADMIN') || parseFloat(meetingDataObject.creatorUserId)  === parseFloat(this.$store.getters.userId) ) && isMeetingEditable && meetingDataObject.isWebinar"

                :is-active="true"
                :button-inner-txt="$store.getters.t('edit-webinar')"
                :continuous-params="['color=#1B76FF', 'background-color=#F6F6F7','width=18.2rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem']"
                @btn-clicked="editCreatedWebinar"
            >
              <template #post-button-slot>
                <img draggable="false" src="/img/edit.svg" style="width: 16px; height: 16px" alt="not loaded">
              </template>
            </base-button>
            <base-button
                v-if="userRole.length >1 && ((userRole[0] === 'ROLE_ADMIN' || userRole[1] === 'ROLE_ADMIN') || parseFloat(meetingDataObject.creatorUserId)  === parseFloat(this.$store.getters.userId) ) && isMeetingDeletable"
                :is-active="true"
                :button-inner-txt="$store.getters.t('delete-session')"
                :continuous-params="['color=#E50000', 'background-color=#F6F6F7','width=18.2rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem']"
                @btn-clicked="deleteMeeting"
            >
              <template #post-button-slot>
                <delete-icon color="#E50000"></delete-icon>
              </template>
            </base-button>
          </div>
          <div>
            <base-button
                v-if="goMeeting"
                :is-active="true"
                :button-inner-txt="$store.getters.t('enter-meeting')"
                :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=16.1rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
                @btn-clicked="joinToSession"
            ></base-button>
          </div>

        </div>
      </div>





      <div v-else-if="whichTab === this.$store.getters.t('meeting-info')" :style="{width:isFullScreen ? '98vw' : '','max-width':isFullScreen ? '98vw' : '90rem'}"
           style="display: flex;flex-direction: column;gap: 1.2rem;justify-content: center">
        <base-button
            v-if="userRole.length >1 && ((userRole[0] === 'ROLE_ADMIN' || userRole[1] === 'ROLE_ADMIN') || parseFloat(meetingDataObject.creatorUserId)  === parseFloat(this.$store.getters.userId) ) && isMeetingEditable"

            :is-active="true"
            :button-inner-txt="$store.getters.t('edit-session')"
            :continuous-params="['color=#1B76FF', 'background-color=#F6F6F7','width=18.2rem','height=3.4rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem']"
            @btn-clicked="editCreatedMeeting"
        >
          <template #post-button-slot>
            <img draggable="false" src="/img/edit.svg" style="width: 16px; height: 16px" alt="not loaded">
          </template>
        </base-button>
        <base-button
            v-if="userRole.length >1 && ((userRole[0] === 'ROLE_ADMIN' || userRole[1] === 'ROLE_ADMIN') || parseFloat(meetingDataObject.creatorUserId)  === parseFloat(this.$store.getters.userId) ) && isMeetingDeletable"
            :is-active="true"
            :button-inner-txt="$store.getters.t('delete-session')"
            :continuous-params="['color=#E50000', 'background-color=#F6F6F7','width=18.2rem','height=3.4rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem']"
            @btn-clicked="deleteMeeting"
        >
          <template #post-button-slot>
            <delete-icon color="#E50000"></delete-icon>
          </template>
        </base-button>


        <base-button
            v-if="goMeeting"
            :is-active="true"
            :button-inner-txt="$store.getters.t('enter-meeting')"
            :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=80vw','height=3.4rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
            @btn-clicked="joinToSession"
        ></base-button>
      </div>
      <div v-else-if="whichTab === $store.getters.t('agenda') && this.agendas.length > 0" :style="{width:isFullScreen ? '98vw' : '100%','max-width':isFullScreen ? '98vw' : '90rem',minHeight:'30rem',display:'flex',flexDirection:'column',gap:'1.6rem',direction:'rtl','height': !isFullScreen ? '' : 'calc(100vh - 14rem)','max-height': !isFullScreen ? '40rem' : 'calc(100vh - 7rem)'}">
        <div style="display: flex;flex-direction: column;gap: 0.8rem">
          <span style="font-size: 1.2rem;font-weight: 700;color: #292933">موضوع جلسه:</span>
                  <span v-if="purposeOfMeeting" style="font-size: 1.4rem;font-weight: 400">
                    {{purposeOfMeeting}}
                  </span>
          <span v-else>{{$store.getters.t('no-information')}}</span>
          <span style="font-size: 1.2rem;font-weight: 400">
          {{purposeOfMeeting}}
        </span>
        </div>
        <div style="font-size: 1.2rem;font-weight: 700;color: #292933">موارد دستورجلسه:</div>

        <div class="table-container">
          <table :style="{width: '94%', direction: $i18n.locale !== 'en' ?  'ltr' : 'rtl'}">
            <tbody>
            <tr>
              <th> زمان ارائه</th>
              <th>ارائه دهنده</th>
              <th>عنوان</th>
            </tr>
            </tbody>
            <tbody>
            <tr  v-for="paragraph in agendas" :key="paragraph.paragraphId">
              <td v-if="agendaHasTime" style="direction: rtl">{{ paragraph.timeInMinutes + ' ' + 'دقیقه' + ' ' + '('+ ' ' + paragraph.fromTime + ' ' + 'تا' + ' ' + paragraph.toTime + ' ' + ')'}}</td>
              <td v-else style="direction: rtl">ندارد</td>
              <td>{{ paragraph.assignedParticipant}}</td>
              <td style="text-align: center">{{ paragraph.paragraphText }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else-if="whichTab === $store.getters.t('agenda') && this.agendas.length === 0"   :style="{'width': !isFullScreen ? '' : '98vw', 'height': !isFullScreen ? '' : 'calc(100vh - 14rem)','max-height': !isFullScreen ? '40rem' : 'calc(100vh - 7rem)'}" style="font-size: 1.2rem;height: 30rem;display: flex;justify-content: center" class="even-detail-no-proceedings">
        {{$store.getters.t('there-is-no-agendas')}}
      </div>

      <div v-else-if="whichTab === $store.getters.t('meeting-files') "  :style="{width:isFullScreen ? '98vw' : '100%','max-width':isFullScreen ? '98vw' : '90rem',minHeight:'30rem',display:'flex',flexDirection:'column',gap:'1.6rem',direction:'rtl','height': !isFullScreen ? '' : 'calc(100vh - 14rem)','max-height': !isFullScreen ? '40rem' : 'calc(100vh - 7rem)'}">
        <meeting-files-information :list-of-recordings="listOfRecordings" :is-there-files-after-meeting="isThereFilesAfterMeeting" :is-there-files-before-meeting="isThereFilesBeforeMeeting"></meeting-files-information>
      </div>


      <!--      <div v-if='whichTab === this.$store.getters.t("meeting-info")' :class=" $i18n.locale !== 'en' ? 'even-detail-actions-fragment' : 'even-detail-actions-fragment__ltr'">-->
      <!--        <div style="display: flex;flex-direction: row-reverse;gap: 0.8rem">-->
      <!--          <base-button-->
      <!--              v-if="userRole.length >1 && ((userRole[0] === 'ROLE_ADMIN' || userRole[1] === 'ROLE_ADMIN') || parseFloat(meetingDataObject.creatorUserId)  === parseFloat(this.$store.getters.userId) ) && isMeetingEditable"-->
      <!--              :is-active="true"-->
      <!--              :button-inner-txt="$store.getters.t('edit-session')"-->
      <!--              :continuous-params="['color=#1B76FF', 'background-color=#F6F6F7']"-->
      <!--              :style-types="[ 'large&#45;&#45;button']"-->
      <!--          >-->
      <!--            <template #pre-button-slot>-->
      <!--              <img draggable="false" src="/img/edit.svg" style="width: 16px; height: 16px" alt="not loaded">-->
      <!--            </template>-->
      <!--          </base-button>-->
      <!--          <base-button-->
      <!--              v-if="userRole.length >1 && ((userRole[0] === 'ROLE_ADMIN' || userRole[1] === 'ROLE_ADMIN') || parseFloat(meetingDataObject.creatorUserId)  === parseFloat(this.$store.getters.userId) ) && isMeetingDeletable"-->
      <!--              :is-active="true"-->
      <!--              :button-inner-txt="$store.getters.t('delete-session')"-->
      <!--              :continuous-params="['color=#E50000', 'background-color=#F6F6F7']"-->
      <!--              :style-types="[ 'large&#45;&#45;button']"-->
      <!--          >-->
      <!--            <template #pre-button-slot>-->
      <!--              <img draggable="false" src="/img/delete.svg" style="width: 16px; height: 16px" alt="not loaded">-->
      <!--            </template>-->
      <!--          </base-button>-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <base-button-->
      <!--              v-if="goMeeting"-->
      <!--              :is-active="true"-->
      <!--              :button-inner-txt="$store.getters.t('enter-meeting')"-->
      <!--              :continuous-params="['color=white', 'background-color=#1B76FF']"-->
      <!--              :style-types="[ 'large&#45;&#45;button']"-->
      <!--              @btn-clicked="joinToSession"-->
      <!--          ></base-button>-->
      <!--        </div>-->
      <!--      </div>-->
    </template>

  </base-modal>

</template>

<script>
import BaseModal from "./UI/BaseModal";
import TabItem from "./TabItem";
import PollingInformationCard from "./PollingInformationCard";
import ProceedingsInformation from "./ProceedingsInformation.vue";
import InvitedMembers from "./InvitedMembers";
import RestClient from "@/api/restClient";
import entityTypes from "@/statics/entityTypes";
import BaseButton from "./UI/BaseButton";
import {nextTick} from "vue";
import DeleteIcon from "@/components/UI/Icons/DeleteIcon.vue";
import DetectMobile from "@/utils/detectMobile";
// import momentjs from "moment";
import momentJalaali from "moment-jalaali";
import auth from "@/store/auth";
import MeetingFilesInformation from "@/components/MeetingFilesInformation.vue";

const restClientAgenda = new RestClient(entityTypes.agenda);

export default {
  components: {
    MeetingFilesInformation,
    DeleteIcon,
    ProceedingsInformation, BaseModal, TabItem, BaseButton, PollingInformationCard, InvitedMembers},
  props: ['isEventClicked', 'meetingDataObject', 'goMeeting', 'editMeeting', 'userRole', 'resultQuestion', 'isMeetingEditable', 'whichItem', 'isMeetingDeletable', 'meetingId', 'invitedMembers'],
  data() {
    return {
      restClientProceedings: new RestClient(entityTypes.proceedings),
      restClientPoll: new RestClient(entityTypes.polling),
      restClientInvite: new RestClient(entityTypes.invite),
      restClientControlMeeting: new RestClient(entityTypes.controlMeeting),
      proceedingsId: -1,
      pollingId: -1,
      meetingInformationId: 0,
      TABS_AMOUNT: 1,
      CONTENT: [],
      tabs: [],
      currentTabIndex: 2,
      prevTabIndex: 0,
      isFirstTime: true,
      isIOS: false,
      isFullScreen: false,
      tabItems: [{
        label: this.$store.getters.t("meeting-info"),
        isActive: true
      }, {label: this.$store.getters.t("agenda"), isActive: false}, {
        label: this.$store.getters.t("meeting-files"),
        isActive: true
      },
        {label: this.$store.getters.t("tasks"), isActive: false},
        {
          label: this.$store.getters.t("polling"),
          isActive: false
        },
        {label: this.$store.getters.t("proceedings"), isActive: false}
      ],
      whichTab: this.$store.getters.t("meeting-info"),
      clickedIndex: 0,
      isMount: false,
      isResizing: false,
      timer: '',
      showMoreProceedings: false,
      isMobile:false,
      proceedingsNumber:null,
      proceedingsParagraphs:[],
      allPollings:[],
      agendas:[],
      purposeOfMeeting:'',
      agendaHasTime:false,
      meetingType:0,
      listOfRecordings:[],
      isThereFilesBeforeMeeting: false,
      isThereFilesAfterMeeting: false,


    };
  },
  computed: {
    tabContainerWidth() {
      if (this.isResizing) {
        console.log('resize')
      }
      if (!this.isMount) {
        return 0
      } else {
        if (this.isFullScreen) {
          if ((parseFloat(this.$refs.tab.offsetWidth) / this.tabItems.length) > 103) {
            return parseFloat(this.$refs.tab.offsetWidth) / this.tabItems.length
          } else {
            return 103
          }

        } else {

          if ((parseFloat(this.$refs.tab.offsetWidth) / this.tabItems.length) > 103) {
            return parseFloat(this.$refs.tab.offsetWidth) / this.tabItems.length
          } else {
            return 103
          }
        }
      }
    },
    showedProceedings() {
      if (this.showMoreProceedings) {
        return this.allProceedings
      } else {
        return [this.allProceedings[0]]
      }
    },
    noticeText() {
      return this.meetingDataObject.notificationType == 1 ? '(اطلاع رسانی با ایمیل)' : this.meetingDataObject.notificationType == 0 ? '(اطلاع رسانی با پیامک)' : '(اطلاع رسانی با پیامک و ایمیل)'
    },
    tagColor(){
      return this.getTagColorByCode(this.meetingDataObject?.tagColor)
    }
  },
  methods: {
    clickToShowMoreProceedings() {
      this.showMoreProceedings = true
    },
    downloadPdf(data) {
      this.$emit('download-pdf', data)
    },
    closeModal() {
      this.$emit('close-modal');
      this.isFullScreen = false
    },
    joinToSession() {
      this.$emit('join-to-session')
    },
    getTabClass(id) {
      return [{
        'tab--current': this.currentTabIndex === id,
        'tab--prev': this.prevTabIndex === id,
        'tab': this.$i18n.locale !== 'en' && !this.isIOS,
        'tab-ios': this.$i18n.locale !== 'en' && this.isIOS,
        'tab-ltr': this.$i18n.locale === 'en',
      }];
    },
    selectTabById(id) {
      if (id === this.currentTabIndex) {
        return;
      }
      if (this.isFirstTime) {
        this.prevTabIndex = 0
        this.currentTabIndex = id;
      } else {
        this.prevTabIndex = this.currentTabIndex;
        this.currentTabIndex = id;
      }

      this.isFirstTime = false
    },
    deleteMeeting() {
      this.$emit('cancel-meeting', this.meetingDataObject.id)
    },
    editCreatedMeeting() {
      this.$emit('edit-meeting')
    },
    editCreatedWebinar() {
      this.$emit('edit-webinar')
    },
    fullScreen() {
      this.$refs.tab.style.width = '99vw'
      this.isFullScreen = true
    },
    chooseTab(tabName, index) {
      this.clickedIndex = index
      this.whichTab = tabName
    },
    getTagColorByCode(code) {
      let color = '#5392F2'
      switch (code) {
        case 1:
          color = '#5392F2';
          break
        case 2:
          color = '#444444'
          break
        case 3:
          color = '#DA0202'
          break
        case 4:
          color = '#10CC72'
          break
        case 5:
          color = '#EBA112'
          break
        case 6:
          color = '#923CE8'
          break
        case 7:
          color = '#DA6BE3'
          break
        case 8:
          color = '#6DD6DD'
          break
      }
      return color
    },
    getProceedingsByMeetingId() {
      this.restClientProceedings
          .getProceedingsById(this.meetingDataObject.id)
          .then((response) => {
            // this.minutesId = response.data.id
            if (response.data.id){
              this.proceedingsId = response.data.id
              this.tabItems[5].isActive = true
              // this.isProceedingsStarted = true
              this.proceedingsParagraphs = response.data.agendas.map((agenda)=>{
                return {
                  paragraphText: agenda.description,
                  assignedParticipant: agenda.attendee,
                  paragraphId: agenda.id,
                  editMode: false
                }
              })
              this.proceedingsNumber = response.data.meetingMinutesNumber

            }

          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
          });
    },
    // getAllPolling(){
    //   this.restClientPoll.getResultSurvey(this.meetingDataObject.id ).then((response) => {
    //     // if (response?.length > 0){
    //       this.tabItems[this.tabItems?.length - 2].isActive = true
    //     // }
    //     this.allPolling = response
    //   })
    //       .catch((error) => {
    //         console.error(error)
    //       })
    // },


    getAllPolling() {
      this.allPollings = [];
      this.restClientPoll
          .getAllSurvey(this.meetingDataObject.id )
          .then((response) => {
            for (let i=0; i < response.length ; i++){
              this.allPollings.unshift(response[i])
            }
            if (response.length > 0){
              const foundTabIndex =  this.tabItems.findIndex((tab) => {
                return tab.label === this.$store.getters.t("polling")
              })
              if (foundTabIndex !== -1){
                this.tabItems[foundTabIndex].isActive = true
              }
            }
          })
          .catch((error) => {
            this.isPassedThreeSeconds = true
            this.isGetResult = false
            console.error(error);
          })
          .finally(() => {});
    },
    getMeetingAgenda(){
      restClientAgenda.getAgenda(this.meetingDataObject.id).then((response)=>{
        this.purposeOfMeeting = response.data.purposeOfMeeting
        if (response?.data?.agendas?.length > 0){
          this.tabItems[1].isActive = true
        }
        this.agendaHasTime = response.data.hasTiming
        let fromTime = this.meetingDataObject.fromSchd
        let toTime = ''
        console.error(toTime)
        console.error(momentJalaali(fromTime).add(50,'minutes').format('HH:mm').toString())
        for (let i=0 ; i<response?.data?.agendas?.length ; i++ ){
          toTime = momentJalaali(fromTime).add(parseInt(response.data.agendas[i].timeInMinutes),'minutes').format('HH:mm').toString()
          this.agendas.push({
            paragraphText: response.data.agendas[i].agenda,
            assignedParticipant: response.data.agendas[i].presenter,
            timeInMinutes: response.data.agendas[i].timeInMinutes,
            fromTime:momentJalaali(fromTime).format('HH:mm').toString(),
            toTime:toTime,
            paragraphId: response.data.agendas[i].id,
            isFromServer: true,
            editMode: false,
            isDone: true
          })

          fromTime = momentJalaali(fromTime).add(parseInt(response.data.agendas[i].timeInMinutes),'minutes').toString()
        }
        // this.agendas = response.data.agendas.map((agenda) => {
        //   return {
        //     paragraphText: agenda.agenda,
        //     assignedParticipant: agenda.presenter,
        //     timeInMinutes: agenda.timeInMinutes,
        //     timePeriod:'8 تا 9',
        //     paragraphId: agenda.id,
        //     isFromServer: true,
        //     editMode: false,
        //     isDone: true
        //   }
        // })
      })
          .catch((error)=>{
            console.error(error)
          })
    },
    getListOfRecordedMeetings() {
      this.restClientControlMeeting.getListOfRecordedFiles(
          auth.getCustomerId(),
          this.$store.getters.tenant,
          this.meetingDataObject.id,  // roomId (set to null as in your example)
          null
      ).then((response) => {
        this.listOfRecordings = response?.data.recordings ? response?.data.recordings : []
        if (this.listOfRecordings?.length > 0 ){
          this.isThereFilesAfterMeeting = true
        }
      }).catch((err) => {
        console.error('Failed to fetch recordings:', err);
        this.listOfRecordings = []; // Clear list on error
      });
    },
    // arrayBufferToBase64(buffer) {
    //
    //   let binary = '';
    //   const bytes = new Uint8Array(buffer);
    //   const len = bytes.byteLength;
    //   for (let i = 0; i < len; i++) {
    //     binary += String.fromCharCode(bytes[i]);
    //   }
    //   return window.btoa(binary);
    // },

  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  mounted() {
    if (this.goMeeting ) {
      this.tabItems[this.tabItems?.length - 2].isActive = true
      this.tabItems[this.tabItems?.length - 1].isActive = true
    }
    // if (this.goMeeting || (!this.isMeetingDeletable && !this.goMeeting)){
    //   for (let i=0 ; i< [{label: this.$store.getters.t("tasks"), isActive: false}, {
    //     label: this.$store.getters.t("polling"),
    //     isActive: false
    //   }, {label: this.$store.getters.t("proceedings"), isActive: false}].length ; i++){
    //     this.tabItems.push([{label: this.$store.getters.t("tasks"), isActive: false}, {
    //       label: this.$store.getters.t("polling"),
    //       isActive: false
    //     }, {label: this.$store.getters.t("proceedings"), isActive: false}][i])
    //   }
    // }
    console.error('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa objeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeect')
    console.error(this.meetingDataObject)
    // if (this.meetingDataObject.hasMeetingAgenda ){
      this.getMeetingAgenda()
    // }
    // if (this.meetingDataObject.hasMeetingMinutes ){
    this.getProceedingsByMeetingId()
    // }

    this.getAllPolling()
    this.getListOfRecordedMeetings()
    this.$store.dispatch('setFromSchd', {
      dayName: this.meetingDataObject.eventDayName,
      dayNum: this.meetingDataObject.eventDay.split(',')[0],
      monthName: this.meetingDataObject.eventMonth,
      yearName: this.meetingDataObject.fromSchd.split(' ')[0].split('/')[0],
      from: this.meetingDataObject.eventTimeFrom,
      completeDate:this.meetingDataObject.fromSchd
    })
    this.$store.dispatch('setToSchd', {to: this.meetingDataObject.eventTimeTo})
    console.error('hoooooooooooooooooooooooooooooooooooooooover')
    console.error({dayName: this.meetingDataObject.eventDayName,
      dayNum: this.meetingDataObject.eventDay.split(',')[0],
      monthName: this.meetingDataObject.eventMonth,
      yearName: this.meetingDataObject.fromSchd.split(' ')[0].split('/')[0],
      from: this.meetingDataObject.eventTimeFrom,
      completeDate:this.meetingDataObject.fromSchd})
    nextTick(() => {
      if (this.allPollings?.length > 0) {
        this.tabItems[this.tabItems - 2].isActive = true
      }
    })
    addEventListener('resize', () => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.isResizing = !this.isResizing
        if (this.isFullScreen) {
          this.$refs.tab.style.width = '98vw'
        }
      }, 50)
    })
    setTimeout(() => {
      this.isMount = true
    }, 10)

    // this.restClientInvite.getInvitedUserPhoto(this.meetingDataObject.id).then((response) => {
    //   this.invitedMembers = response.data.map((user) => {
    //     // console.error(base64Image)
    //     let imgURL = null
    //     if (user.imgFile){
    //        imgURL = `data:image/jpeg;base64,${user.imgFile}`;
    //     }
    //     return {userId: user.userId, displayName: user.displayName, imgURL}
    //   })
    // })
    //     .catch((error) => {
    //       console.error(error)
    //     })


    // this.isIOS = iOS();
    // if (this.allProceedings?.length > 0 && !this.allPolling?.length > 0) {
    //   this.TABS_AMOUNT = 2
    //   this.meetingInformationId = 0
    //   this.proceedingsId = 1
    //   this.pollingId = -1
    //   this.prevTabIndex = 1
    //   this.currentTabIndex = 0
    // } else if (!this.allProceedings?.length > 0 && this.allPolling?.length > 0) {
    //   this.meetingInformationId = 0
    //   this.TABS_AMOUNT = 2
    //   this.pollingId = 1
    //   this.proceedingsId = -1
    //   this.prevTabIndex = 1
    //   this.currentTabIndex = 0
    // } else if (this.allProceedings?.length > 0 && this.allPolling?.length > 0) {
    //   this.TABS_AMOUNT = 3
    //   this.meetingInformationId = 0
    //   this.pollingId = 2
    //   this.proceedingsId = 1
    //   this.prevTabIndex = 2
    //   this.currentTabIndex = 0
    // }
    // this.CONTENT = Array.from({length: this.TABS_AMOUNT},
    //     () => Array.from(
    //         {length: 4},
    //         () => ({width: 70 + Math.random() * 20})
    //     )
    // );
    // this.tabs = this.CONTENT.map((content, id) => ({
    //   id,
    //   content
    // }))

  }


};
</script>

<style scoped>
/**,*/
/*::before,*/
/*::after {*/
/*  box-sizing: border-box;*/
/*}*/


/*html {*/
/*  --color-light: #665e68;*/
/*  --color-regular: #353637;*/
/*  --color-semidark: #9f946f;*/
/*  --color-dark: #bfb48f;*/
/*  --color-accent: #f2efe9;*/
/*  --color-background: #564e58;*/
/*  --color-background-a: #200e15;*/
/*  --color-background-b: #151617;*/

/*  font-family: Arial, sans-serif;*/
/*  display: flex;*/
/*  background:*/
/*      linear-gradient(*/
/*          to bottom,*/
/*          var(--color-background-b),*/
/*          var(--color-background-a)*/
/*      );*/
/*  overflow: hidden;*/
/*}*/

/*body {*/
/*  color: var(--color-regular);*/
/*  margin: 0;*/
/*  flex: 1;*/
/*  display: flex;*/
/*  flex-flow: column;*/
/*  align-items: center;*/
/*  justify-content: center;*/
/*}*/

.even-detail-header-fragment {
  width: 90rem;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  align-items: center;
}

.even-detail-header-title {
  width: 100%;
  max-width: 144rem;
  font-size: 1.8rem;
  font-weight: 400;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;

}

.even-detail-header-title-action {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  width: fit-content;
}

.even-detail-header-title__ltr {
  font-size: 1.8rem;
  font-weight: 400;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.even-detail-header-title-action__ltr {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  width: fit-content;
}

.even-detail-header-date {
  font-size: 1.2rem;
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  max-width: 144rem;
}

.even-detail-header-date__ltr {
  font-size: 1.2rem;
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
}

.even-detail-header-tabs-container {
  position: relative;
  width: 100%;
  height: 4.8rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  -webkit-box-shadow: 0px 5px 8px -7px #000000, 0px 4px 8px 0px rgba(0, 0, 0, 0);
  box-shadow: 0px 5px 8px -7px #000000, 0px 4px 8px 0px rgba(0, 0, 0, 0);
  overflow-x: auto;
}

.even-detail-header-tabs-container__ltr {
  position: relative;
  width: 100%;
  height: 4.8rem;
  display: flex;
  align-items: center;
  -webkit-box-shadow: 0px 5px 8px -7px #000000, 0px 4px 8px 0px rgba(0, 0, 0, 0);
  box-shadow: 0px 5px 8px -7px #000000, 0px 4px 8px 0px rgba(0, 0, 0, 0);
  overflow-x: auto;
}

.even-detail-header-tabs-container::-webkit-scrollbar {
  height: 3px; /* height of horizontal scrollbar ← You're missing this */
  width: 4px; /* width of vertical scrollbar */
  border: 1px solid #d5d5d5;

}

.even-detail-body-meeting-Info {
  width: 90rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 1.5rem 0 0 0;
  align-items: center;
  min-height: 25rem;
}

.even-detail-body-proceedings {
  width: 90rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  align-items: center;
}
.even-detail-no-proceedings{
  width: 90rem;
}
.even-detail-body-polling {
  width: 90rem;
  min-height: 30rem;
  overflow-y: auto;
}
.even-detail-no-polling {
  width: 90rem;
  display: flex;
  justify-content: center;
}

.meeting-information--text {
  font-size: 1.4rem;
  direction: rtl;
  max-width: calc(100% - 11rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.meeting-information--text__moderator-name{
  font-size: 1.4rem;
  direction: rtl;
  max-width: 20rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  bottom: 0.1rem;
}
.meeting-information--text__ltr {
  font-size: 1.4rem;
  direction: ltr;
  max-width: calc(100% - 9rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meeting-information--invited-text {
  font-size: 1.4rem;
  direction: rtl;
  max-width: calc(100% - 13rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meeting-information--invited-text__ltr {
  font-size: 1.4rem;
  direction: ltr;
  max-width: calc(100% - 13rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.even-detail-body-meeting-Info-rows {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 144rem;
  gap: 0.8rem;
  padding-bottom: 0.4rem;
  border-bottom: 0.1rem solid #F6F6F7;
}

.manager-information {
  width:100%;
  display: flex;
  flex-direction: row;
  gap: 4.8rem;
  align-items: center
}
.manager-information > div {
  max-width: 45%;
}

.manager-information__ltr {
  display: flex;
  flex-direction: row-reverse;
  gap: 4.8rem;
  align-items: center
}

.even-detail-actions-fragment {
  width: 90rem;
  height: 6rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
}

.even-detail-actions-fragment__ltr {
  width: 90rem;
  height: 6rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.tabs_underline {
  position: absolute;
  bottom: 0;
  border: 0.1rem solid #1B76FF;
  right: 0;
  transition: 0.2s;
}

.tabs_underline__ltr {
  position: absolute;
  bottom: 0;
  border: 0.1rem solid #1B76FF;
  left: 0;
  transition: 0.2s;
}

@keyframes index1 {
  from {
    right: 0;
  }
  to {
    right: 14.9rem;
  }
}

.bar {
  display: inline-block;
  transition: all 260ms ease;
}

.event-detail-body {
  width: 60rem;
  max-height: 44rem;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;

}

.event-detail-body-ltr {
  width: 66rem;
  max-height: 44rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.event-detail__title {
  margin-bottom: 1rem;
  text-align: right;
}

.event-detail__moderator {
  margin-bottom: 1rem;
  height: 5rem;
  font-size: 1.3rem;
  text-align: right;
}

.event-detail-date {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 3rem;
  font-size: 1.3rem;
}

.event-detail__title:first-child {
  color: gray;
  font-size: 1.3rem;
}

.event-detail__title:last-child {
  color: #00abfc !important;
  font-size: 1.3rem;
}

.enter-detail-enter-button {
  width: 10.6rem;
  height: 3.2rem;
  border-radius: 0.5rem;
  box-shadow: 3px 3px 12px 0 rgb(0 0 0 / 16%);
  background-color: #8ec7c2;
  color: white;
  font-size: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  z-index: 1000;
}

.delete-button {
  margin: 0 1rem;
  height: 3.2rem;
  width: 8rem;
  border-radius: 0.5rem;
  border: solid 0.1rem transparent;
  background-color: #e57979;
  color: white;
  cursor: pointer
}

.delete-button:hover {
  background-color: #e75c5c;
}

.edit-button {
  height: 3.2rem;
  width: 8rem;
  border-radius: 0.5rem;
  border: solid 0.1rem transparent;
  background-color: #7ba4ee;
  color: white;
  cursor: pointer
}

.edit-button:hover {
  background-color: #5b8fee;
}

.enter-detail-enter-button:hover {
  background-color: #4cc9b7;
}


.event-detail-footer {
  position: relative;
  margin-top: 2rem;
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  z-index: 200;
}

.list-proceedings {
  width: 70rem;
}

.action--container-event-details {
  width: 90rem;
  height: 5rem;
  display: flex;
  direction: rtl;
  justify-content: center;
}
.action--container-event-buttons{
  display: flex;flex-direction: row-reverse;gap: 0.8rem
}
.action--container-event-buttons-mobile{
  display: flex;
  flex-direction: column;
}
.table-container {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: right;
  max-height:40rem;
  overflow-y: auto;
  margin-bottom: 2rem;

}
.table-container-mobile{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;

}


table {
  border-collapse: collapse;
  font-size: 1.2rem;
  table-layout: fixed;
}

td, tr, th {
  border: 0.1rem solid #DCDADA;
  text-align: center;
  padding: 8px 2px;
}

td, th {
  word-wrap: break-word;
}

th {
  color: #292933;
  font-weight: 700;
  font-size: 1.3rem;

}
th:nth-child(1) {
  color: #292933;
  width: 25%;
  font-weight: 700;
}
th:nth-child(2) {
  color: #292933;
  width: 25%;
  font-weight: 700;
}
td:nth-child(3) {
  padding-right: 1rem;
  padding-left: 1rem;
  width: 50%;
}
tr {
  max-width: 100%;
  height: 3rem !important;
}
@media (max-width: 1024px) {
  .even-detail-header-fragment {
    width: 80vw;
  }

  .even-detail-body-meeting-Info {
    width: 80vw;
  }

  .even-detail-body-proceedings {
    width: 80vw;
  }
  .even-detail-no-proceedings{
    width: 80vw;
  }

  .even-detail-body-polling {
    width: 80vw;

  }
  .even-detail-no-polling {
    width: 80vw;

  }
  .even-detail-actions-fragment {
    width: 80vw;
  }
  .action--container-event-details {
    width: 80vw;

  }

  .list-proceedings {
    width: 65rem;
  }

  .event-detail-body {
    width: 65rem;

  }

  .event-detail-body-ltr {
    width: 65rem;
  }

  .event-detail-footer {
    width: 65rem;
  }

  .event-detail__title:first-child {

    font-size: 1.2rem;
  }

  .event-detail__title:last-child {

    font-size: 1.2rem;
  }

  .event-detail__moderator {

    font-size: 1.2rem;

  }

  .event-detail-date {

    font-size: 1.2rem;
  }

  .tabs {
    width: 65rem;
    font-size: 1.3rem;
  }
}

@media (max-width: 780px) {

  .event-detail-header {
    width: 50rem;
    height: 3rem;
    display: flex;
    justify-content: flex-start;
  }

  .enter-detail-enter-button {
    position: relative;
    left: 2rem;
  }

  .list-proceedings {
    width: 50rem;
  }

  .event-detail-body {
    width: 50rem;

  }

  .event-detail-body-ltr {
    width: 50rem;
  }

  .event-detail-footer {
    width: 50rem;
  }

  .event-detail__title:first-child {

    font-size: 1.2rem;
  }

  .event-detail__title:last-child {

    font-size: 1.2rem;
  }

  .event-detail__moderator {

    font-size: 1.2rem;

  }

  .event-detail-date {

    font-size: 1.2rem;
  }

  .tabs {
    width: 50rem;
    font-size: 1.2rem;
  }
}

@media (max-width: 570px) {
  .even-detail-header-fragment {
    width: 85vw;
  }

  .even-detail-body-meeting-Info {
    width: 85vw;
  }

  .even-detail-body-proceedings {
    width: 85vw;
  }
  .even-detail-no-proceedings{
    width: 85vw;
  }

  .even-detail-body-polling {
    width: 85vw;

  }
  .even-detail-no-polling {
    width: 85vw;

  }
  .even-detail-actions-fragment {
    width: 85vw;
  }
  .action--container-event-details {
    width: 85vw;

  }
  .room-name-text {
    max-width: calc(100% - 9rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.4rem
  }

  .manager-information {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
  }

  .manager-information > div {
    max-width: 100%;
  }

  .meeting-information--text {
    max-width: calc(100% - 11rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.4rem
  }
  .event-detail-header {
    width: 45rem;
    height: 3rem;
    display: flex;
    justify-content: flex-start;
  }

  .event-detail__title:first-child {

    font-size: 1.2rem;
  }

  .event-detail__title:last-child {

    font-size: 1.2rem;
  }

  .event-detail__moderator {

    font-size: 1.2rem;

  }

  .event-detail-date {

    font-size: 1.2rem;
  }

  .tabs {
    width: 45rem;
    font-size: 1.2rem;
  }

  .list-proceedings {
    width: 45rem;
  }

  .event-detail-body {
    width: 45rem;
  }

  .event-detail-body-ltr {
    width: 45rem;
  }

  .event-detail-footer {
    width: 45rem;
  }
}

@media (max-width: 480px) {
  .meeting-information--text {
    font-size: 1.2rem;
    font-weight: 700;
  }

  .event-detail-header {
    width: 38rem;
    height: 3rem;
    display: flex;
    justify-content: flex-start;
  }

  .enter-detail-enter-button {
    position: relative;
    left: 1.8rem;
  }

  .event-detail__title:first-child {

    font-size: 1.1rem;
  }

  .event-detail__title:last-child {

    font-size: 1.1rem;
  }

  .event-detail__moderator {

    font-size: 1.1rem;

  }

  .event-detail-date {

    font-size: 1.1rem;
  }

  .tabs {
    width: 38rem;
    font-size: 1.1rem;
  }

  .list-proceedings {
    width: 38rem;
  }

  .event-detail-body {
    width: 38rem;
  }

  .event-detail-body-ltr {
    width: 38rem;
  }

  .event-detail-footer {
    width: 38rem;
  }
}

@media (max-width: 420px) {
  .event-detail-header {
    width: 90vw;
    height: 3rem;
    display: flex;
    justify-content: flex-start;
  }

  .tabs {
    width: 90vw;
    font-size: 1.1rem;
  }

  .tab__content {
    font-size: 1.1rem;
  }

  .event-detail-body {
    font-size: 1.1rem;
  }

  .event-detail-body-ltr {
    font-size: 1.1rem;
  }

  .list-proceedings {
    font-size: 1.2rem;
    max-height: 10rem;
    width: 80vw;
    overflow-y: auto;
  }

  .event-detail-footer {
    width: 90vw;
  }

  .event-detail-body {
    font-size: 1.1rem;
  }

  .event-detail-body-ltr {
    font-size: 1.1rem;
  }
}

/*.tab--current .bar {*/
/*  background: green;*/
/*}*/

@keyframes swipe {
  0% {
    transform: translate3d(0, 0, 0);
    z-index: 2;
  }
  50% {
    transform: translate3d(-80%, 0, 100px) rotate3d(0, 1, 0, +80deg);
    z-index: 2;
  }
  51% {
    z-index: -1;
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes swipeIOS {
  0% {
    transform: translateX(0);
    z-index: 2;
  }
  50% {
    transform: translateX(-100%);
    z-index: 2;
  }
  51% {
    z-index: -1;
  }
  100% {
    transform: translateX(0);
  }
}

@media only screen and (max-width: 400px) {
  .tabs {
    min-width: 100%;
    font-size: 1.1rem;
  }

  .event-detail-body {
    font-size: 1.1rem;
  }

  .event-detail-body-ltr {
    font-size: 1.1rem;
  }
}
</style>

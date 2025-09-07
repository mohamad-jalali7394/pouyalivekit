<template>
<div class="meeting-settings__container">
  <div class="meeting-settings__header" :style="{flexDirection: $i18n.locale === 'fa' ? 'row-reverse' : 'row'}">
    <h1>{{this.$store.getters.t('meeting-settings')}}</h1>
    <div class="meeting-settings__header-actions">
      <base-button
          :is-active="true"
          :button-inner-txt=" $store.getters.t('save-settings') "
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
          :style-types="['large--button']"
          @click="saveSettings"

      >
      </base-button>
      <base-button
          :is-active="true"
          :button-inner-txt="$store.getters.t('return-to-initial-settings')"
          :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
          :style-types="['large--button']"
          @click="returnToInitialSettings"

      >
      </base-button>
    </div>

  </div>

  <div class="meeting-settings-set-time-container" :style="{flexDirection : $i18n.locale !== 'en' ? 'row-reverse' : 'row' , padding: $i18n.locale !== 'en' ? '1.6rem 1.6rem' : '3.6rem 1.6rem'}">
  <div>
    <span :style="{width : $i18n.locale !== 'en' ? 'unset' : '100%'}"> {{ $store.getters.t('minimum-meeting-time') }} </span>
    <input class="meeting-settings-set-time-input" type="number" v-model="minimumMeetingTime">
  </div>
    <span class="separator"></span>
  <div>
    <span :style="{width : $i18n.locale !== 'en' ? 'unset' : '100%'}">{{ $store.getters.t('maximum-meeting-time') }}</span>
    <input class="meeting-settings-set-time-input" type="number" v-model="maximumMeetingTime">
  </div>
    <span class="separator"></span>
  <div :style="{width:  '32rem'}">
    <span :style="{width : $i18n.locale !== 'en' ? 'unset' : '100%'}">{{ $store.getters.t('minimum-time-interval-between-two-meetings') }}</span>
    <input class="meeting-settings-set-time-input" type="number" v-model="minimumTimeInterval">
  </div>
    <span class="separator"></span>
  <div>
    <span :style="{width : $i18n.locale !== 'en' ? 'unset' : '100%'}">{{ $store.getters.t('meeting-time-reminder') }}</span>
    <input class="meeting-settings-set-time-input" type="number" v-model="rememberTime">
  </div>
    <span class="separator"></span>
  <div>
    <span :style="{width : '25rem'}"> {{ $store.getters.t('time-to-send-the-meeting-end-alert') }}</span>
    <input class="meeting-settings-set-time-input" type="number" v-model="warningTime">
  </div>
  </div>
  <div class="meeting-settings-set-time-container" :style="{flexDirection : $i18n.locale !== 'en' ? 'row-reverse' : 'row', padding: $i18n.locale !== 'en' ? '1.6rem 1.6rem' : '3.6rem 1.6rem'}">
    <div>
      <span :style="{width : $i18n.locale !== 'en' ? 'unset' : '89%'}">{{ $store.getters.t('user-exit-after-meeting') }}</span>
      <div style="display: flex;gap: 0.8rem" :style="{direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr' }">
        <div style="display: flex;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding: 1rem 0.8rem;width: 9.6rem" :style="{direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr' }">
          <input class="activation-input"  type="radio" id="activeExitRoom" name="activeExitRoom" value="active" v-model="activateExitRoom">
          <label class="activation-label"  for="activeExitRoom">{{ $store.getters.t('active') }}</label>
        </div>
        <div style="display: flex;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding: 1rem 0.8rem;width: 9.6rem" :style="{direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr' }">
          <input class="activation-input"  type="radio" id="inactiveExitRoom" name="inactiveExitRoom" value="inactive"  v-model="activateExitRoom">
          <label class="activation-label"  for="inactiveExitRoom">{{ $store.getters.t('in-active') }}</label>
        </div>
      </div>
    </div>



    <div>
      <span :style="{width : $i18n.locale !== 'en' ? 'unset' : '89%'}">{{ $store.getters.t('invitation-during-the-meeting') }}</span>
      <div style="display: flex;gap: 0.8rem" :style="{direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr' }">
        <div style="display: flex;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding: 1rem 0.8rem;width: 9.6rem" :style="{direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr' }">
          <input class="activation-input"  type="radio" id="activateInvitation" name="activateInvitation" value="active" v-model="activateInvitation">
          <label class="activation-label"  for="activateInvitation">{{ $store.getters.t('active') }}</label>
        </div>
        <div style="display: flex;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding:1rem 0.8rem;width: 9.6rem" :style="{direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr' }">
          <input class="activation-input"  type="radio" id="inactivateInvitation" name="inactivateInvitation" value="inactive"  v-model="activateInvitation">
          <label class="activation-label"  for="inactivateInvitation">{{ $store.getters.t('in-active') }}</label>
        </div>
      </div>
    </div>



    <div>
      <span :style="{width : $i18n.locale !== 'en' ? 'unset' : '89%'}">{{ $store.getters.t('meeting-end-warning') }}</span>
      <div style="display: flex;gap: 0.8rem" :style="{direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr' }">
        <div style="display: flex;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding: 1rem 0.8rem;width: 9.6rem" :style="{direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr' }">
          <input class="activation-input" type="radio" id="activateWarning" name="activateWarning" value="active" v-model="activateWarning">
          <label class="activation-label"  for="activateWarning">{{ $store.getters.t('active') }}</label>
        </div>
        <div style="display: flex;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding:1rem 0.8rem;width: 9.6rem" :style="{direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr' }">
          <input class="activation-input"  type="radio" id="inactivateWarning" name="inactivateWarning" value="inactive"  v-model="activateWarning">
          <label class="activation-label"  for="inactivateWarning">{{ $store.getters.t('in-active') }}</label>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import BaseButton from "./UI/BaseButton";
import RestClient from "@/api/restClient";
export default {
  name: "MeetingSettings",
  components:{BaseButton},
  data(){
    return {
       restClientSetting: new RestClient('setting'),
      minimumMeetingTime: '15',
      maximumMeetingTime: '2000',
      minimumTimeInterval: '0',
      rememberTime: '5',
      warningTime: '5',
      activateExitRoom:'active',
      activateWarning:'active',
      activateInvitation:'active',
      settingId:'',
      customer_id:'',
    }
  },
  methods:{
    saveSettings(){
      // console.error('saveSettings')
      let meetingFinishAction, inviteDuringInMeeting, meetingEndingAlert
      if (this.activateExitRoom === 'active') {
        meetingFinishAction = true
      } else {
        meetingFinishAction = false
      }
      if (this.activateInvitation === 'active') {
        inviteDuringInMeeting = true
      } else {
        inviteDuringInMeeting = false
      }
      if (this.activateWarning === 'active') {
        meetingEndingAlert = true
      } else {
        meetingEndingAlert = false
      }
      this.restClientSetting
          .update({
            id: this.settingId,
            customerId: this.customer_id ,
            minMeetingDuration: this.minimumMeetingTime,
            maxMeetingDuration: this.maximumMeetingTime,
            minMeetingParticipants: 0,
            meetingsInterval: this.minimumTimeInterval,
            meetingEndingAlertTime: this.warningTime,
            meetingFinishAction: meetingFinishAction,
            inviteDuringInMeeting: inviteDuringInMeeting,
            meetingEndingAlert: meetingEndingAlert,
            notifyTime: this.rememberTime
          })
          .then(data => console.log(data)).catch((error) => {
        console.error(error)
      })

    },
    returnToInitialSettings(){
      this.restClientSetting.reset().then(() => {
        this.getAll()
      })
    },
    getAll() {
      if (!this.restClient) this.restClient = new RestClient(this.urlType)
      this.restClientSetting.getAll().then(data => {
        if (data) {
          this.settingId = data.id
          this.minimumMeetingTime = data.minMeetingDuration
          this.maximumMeetingTime = data.maxMeetingDuration
          this.minimumTimeInterval = data.meetingsInterval
          this.warningTime = data.meetingEndingAlertTime
          console.error(data)
          console.error(data.meetingFinishAction)
          if (data.meetingFinishAction){
            this.activateExitRoom = 'active'
          }else {
            this.activateExitRoom = 'inactive'
          }
          if (data.inviteDuringInMeeting){
            this.activateInvitation = 'active'
          }else {
            this.activateInvitation = 'inactive'
          }
          if (data.meetingEndingAlert){
            this.activateWarning = 'active'
          }else {
            this.activateWarning = 'inactive'
          }
          this.customer_id = data.customerId
          this.rememberTime = data.notifyTime.toString()
        }
      })
    },

  },
  mounted() {
    this.getAll()
  }
}
</script>

<style scoped>
.meeting-settings__container{
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
  max-height: calc(100vh - 9rem);
  overflow-y: auto;
}
.meeting-settings__header {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.6rem 1.6rem;
  border-bottom: 0.1rem solid #DCDADA;
}

.meeting-settings__header > h1 {
  font-size: 2.5rem;
}
.meeting-settings__header-actions {
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  align-items: center;
}
.meeting-settings-set-time-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  row-gap: 1.6rem;
  column-gap: 1.6rem;
  height: fit-content;
  width: 100%;
  border-bottom: 0.1rem solid #DCDADA;
  align-items: flex-end;
}
.meeting-settings-set-time-container > div {
  width: 22rem;
  height: 5.6rem;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-end;
  gap: 0.8rem;
}
.meeting-settings-set-time-input {
  width: 100%;
  height: 3.2rem;
  padding: 0.8rem;
  background-color: #F6F6F7;
  border: none;
  direction: ltr;
}
.meeting-settings-set-time-input:focus {
  outline: 0;
  background-color: transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}
.separator {
  width: 0;
  height: 5.6rem;
  border: 0.1rem solid #F6F6F7;
}
.activation-input ,.activation-label {
  cursor: pointer;
  font-size: 1.4rem;
}
.meeting-settings-set-time-container > div > span {
  font-size: 1.2rem;
  color: #75758F;
}
@media (max-width: 900px) {
  .meeting-settings__header > h1 {
    font-size: 2.2rem;
    margin-bottom: 2rem;
  }
}
@media (max-width: 800px) {
  .meeting-settings__header {
    display: flex;
    flex-direction: column;
   gap: 0.8rem;
    align-items: flex-end;
    width: 100%;
    padding: 1.6rem 1.6rem;
    border-bottom: 0.1rem solid #DCDADA;
  }
}
@media (max-width: 410px) {
  .meeting-settings__header-actions {
    display: flex;
    flex-wrap: wrap-reverse;
    justify-content: flex-end;
    gap: 0.8rem;
  }
}
</style>
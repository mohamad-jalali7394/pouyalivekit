<template>
  <div :class="'brief-meeting-fragment'">
    <div v-if="meetingDataObject.isWebinar" style="display: flex;align-items: center;position: absolute;top: 0.5rem;left: 0.5rem">
              <span :style="{'background-color':'#1B76FF',color: 'white','border-radius': '2rem',padding:' 0.2rem 0.8rem'}">
                 {{$store.getters.t('webinar')}}
              </span>
    </div>
    <div :class="'event-title-rtl'">{{ eventTitle }}</div>
    <div class="session-time">
      <span>{{meetingDataObject.eventDayName + ' ' + meetingDataObject.eventDay + ' ' + meetingDataObject.eventMonth}}</span>
      <span v-if="!goMeeting" style="color:#2AB459">{{' ( ' + timeLeft + ' '}}</span>
      <span v-if="!goMeeting && !isGreaterThanDay && !isGreaterThanWeek && !isGreaterThanMonth" style="color:#2AB459">{{''}}</span>
      <span v-else-if="dayLeftOrPast" style="color:#2AB459">روز</span>
      <span v-else-if="!goMeeting && isGreaterThanWeek" style="color:#2AB459">هفته</span>
      <span v-else-if="!goMeeting && isGreaterThanMonth" style="color:#2AB459">ماه</span>
      <span v-else style="color:#2AB459">{{''}}</span>

      <span v-if="!goMeeting" style="color:#2AB459">{{ ' ' + timeLeftText + ' ) '}}</span>
    </div>
    <div class="session-time"> <span>{{'ساعت' + ' '}}</span> <span>{{time}} </span> </div>
    <div class="seprator"></div>
    <div :class="'event-room-name-fragment'" >
       <span style="display: flex;align-items: center">
        <img draggable="false" src="/img/monitor.svg" alt="not loaded" style="width: 16px;height: 16px;position: relative;right:-0.2rem " >
      </span>
      <span :class="'event-room-name'">{{meetingDataObject.roomName}}</span>
    </div>
    <div class="seprator"></div>
    <div v-if="meetingDataObject.managerUserId" style="direction: rtl" :class=" 'moderator-name-event' " >
      <span >{{meetingDataObject.firstNameManger + ' ' + meetingDataObject.lastNameManager + '(مدیر)'}}</span>
     <span>{{$store.getters.t('invite-members',{'length':invitedMembers.length - 1})}}</span>
    </div>
    <div v-else style="direction: rtl" :class="'moderator-name-event'" >
      <span >جلسه بدون مدیر</span>

    </div>
    <div class="seprator"></div>
<!--    <div class="even&#45;&#45;info__is-has-file">-->
<!--      <div>-->
<!--        <img draggable="false" v-if="meetingDataObject.hasMeetingAgenda" style="width: 16px;height: 16px" src="/img/Subtract.svg">-->
<!--        <img draggable="false" v-else style="width: 16px;height: 16px" src="/img/close-circle.svg">-->
<!--        <span>-->
<!--          {{meetingDataObject.hasMeetingAgenda ? 'دستور جلسه دارد' : 'دستور جلسه ندارد'}}-->
<!--        </span>-->
<!--      </div>-->
<!--      <div>-->
<!--        <img draggable="false" v-if="isMeetingHasFile" style="width: 16px;height: 16px" src="/img/Subtract.svg">-->
<!--        <img draggable="false" style="width: 16px;height: 16px" v-else src="/img/close-circle.svg">-->
<!--        <span>-->
<!--          {{isMeetingHasFile ? 'فایل ضمیمه دارد' : 'فایل ضمیمه ندارد'}}-->
<!--        </span>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="seprator"></div>-->
    <div style="margin-top: 0.5rem;display: flex;flex-direction: row-reverse;justify-content: space-between;width: 100%">
     <div>
       <base-button
           :is-active="true"
           :button-inner-txt="$store.getters.t('meeting-details')"
           :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
           :style-types="['button--small']"
           @click="clickToShowDetail(this.eventId)"

       >
       </base-button>
     </div>
    <div>
      <base-button
          v-if="goMeeting"
          :is-active="true"
          :button-inner-txt="$store.getters.t('enter')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
          :style-types="['button--normal']"
          @click="joinToSession"
      >
      </base-button>
    </div>
    </div>
      <div :style="{position: 'absolute',top:isSummeryTop ?  '4rem' : '',bottom: isSummeryTop ?  '' : '4rem',right: isSummeryLeft ?  '-0.6rem' : '',left: isSummeryLeft ?  '' : '-0.6rem',transform:isSummeryLeft ?  '' :'rotate(150deg)'}" class="curve-message" ></div>

  </div>
  <!--  <div  :class="$i18n.locale === 'fa' ? 'brief-meeting' : 'brief-meeting-ltr'">-->
  <!--    <div  :class="$i18n.locale === 'fa' ? 'hours-left' : 'hours-left-ltr'">-->
  <!--      <div :class="$i18n.locale === 'fa' ? 'information-header-text-rtl': 'information-header-text-ltr'">-->
  <!--&lt;!&ndash;        <div v-if="!isGreaterThanDay && !isGreaterThanWeek && !isGreaterThanMonth" :class="$i18n.locale === 'fa' ? 'time-left' : 'time-left-ltr'">{{ timeLeft }}</div>&ndash;&gt;-->
  <!--&lt;!&ndash;        <div v-else-if="isGreaterThanDay" class="time-left-day">&ndash;&gt;-->
  <!--&lt;!&ndash;          <span :style="{'margin-left': $i18n.locale === 'fa' ? '0.2rem' : '0','margin-right': $i18n.locale === 'fa' ? '0' : '0.1rem',position: 'relative',bottom: $i18n.locale === 'fa' ? '':'0.15rem'}">{{ timeLeft }}</span>&ndash;&gt;-->
  <!--&lt;!&ndash;          <span :style="{'font-size': $i18n.locale === 'fa' ? '1.2rem' : '1.1rem'}">{{ this.$store.getters.t('day') }}<span v-if="parseFloat(timeLeft) > 1 && $i18n.locale === 'en' ">s</span></span>&ndash;&gt;-->
  <!--&lt;!&ndash;        </div>&ndash;&gt;-->
  <!--&lt;!&ndash;        <div v-else-if = "isGreaterThanWeek" class="time-left-week"> <span :style="{'margin-left': $i18n.locale === 'fa' ? '0.2rem' : '0','margin-right': $i18n.locale === 'fa' ? '0' : '0.1rem',position: 'relative',bottom: $i18n.locale === 'fa' ? '':'0.15rem'}">{{ timeLeft }}  <span :style="{'font-size': $i18n.locale === 'fa' ? '1.2rem' : '1.1rem'}">{{this.$store.getters.t('week')}}<span v-if="parseFloat(timeLeft) > 1 && $i18n.locale === 'en' ">s</span></span></span>&ndash;&gt;-->
  <!--&lt;!&ndash;        </div>&ndash;&gt;-->
  <!--&lt;!&ndash;        <div v-else class="time-left-week"> <span :style="{'margin-left': $i18n.locale === 'fa' ? '0.2rem' : '0','margin-right': $i18n.locale === 'fa' ? '0' : '0.1rem',position: 'relative',bottom: $i18n.locale === 'fa' ? '':'0.15rem'}">{{ timeLeft }}</span> <span :style="{'font-size': $i18n.locale === 'fa' ? '1.2rem' : '1.1rem'}" >{{this.$store.getters.t('month')}}<span v-if="parseFloat(timeLeft) > 1 && $i18n.locale === 'en' ">s</span></span> </div>&ndash;&gt;-->
  <!--&lt;!&ndash;        <span :style="{'margin' : (!isGreaterThanDay && !isGreaterThanWeek && !isGreaterThanMonth) ? '1rem 0 0 0': '0.5rem 0 1rem 0' }" :class="$i18n.locale === 'fa' ? 'time-text-span' : 'time-text-span-ltr'"  >{{timeLeftText}}</span>&ndash;&gt;-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div :class=" $i18n.locale === 'fa' ?  'event-title-rtl' :'event-title-ltr' " >{{eventTitle}}</div>-->
  <!--    <div :class="$i18n.locale === 'fa' ? 'moderator-name-event' : 'moderator-name-event-ltr'"   >{{eventModerator}}</div>-->
  <!--    <div :class="$i18n.locale === 'fa' ? 'event-room-name' : 'event-room-name-ltr'" >{{meetingDataObject.roomName}}</div>-->
  <!--    <div :class="$i18n.locale === 'fa' ? 'event-capacity' : 'event-capacity-ltr'">-->
  <!--      <span>{{$store.getters.t('capacity')}}</span>-->
  <!--      <span>	&nbsp;</span>-->
  <!--      <span>{{meetingDataObject.roomCapacity}}</span>-->
  <!--      <span>	&nbsp;</span>-->
  <!--      <span>{{$store.getters.t('user')}}</span>-->
  <!--    </div>-->
  <!--    <div  :class="$i18n.locale === 'fa' ? 'invited__user-event' : 'invited__user-event-ltr'">-->
  <!--      <invited-members-->
  <!--          :is-table="false"-->
  <!--          :invited-members="invitedMembers"-->
  <!--          :meeting-id="meetingId"-->
  <!--      ></invited-members>-->
  <!--    </div>-->
  <!--  </div>-->

  <!--  <button v-if="goMeeting" class="enter-button" @click="joinToSession">{{ $store.getters.t('enter-meeting') }}</button>-->

  <!--  <div class="time-interval">{{time}}</div>-->
  <!--  <div :style="{position: 'absolute',top:isSummeryTop ?  '4rem' : '',bottom: isSummeryTop ?  '' : '4rem',right: isSummeryLeft ?  '-0.6rem' : '',left: isSummeryLeft ?  '' : '-0.6rem',transform:isSummeryLeft ?  '' :'rotate(150deg)'}" class="curve-message" ></div>-->
</template>

<script>
// import InvitedMembers from "./InvitedMembers";
import BaseButton from "./UI/BaseButton";
export default {
  name: "EventSummery",
  components: {BaseButton},
  props: ['eventId','invitedMembers', 'isGreaterThanDay', 'isGreaterThanWeek', 'isGreaterThanMonth', 'timeLeft', 'timeLeftText', 'eventTitle', 'eventModerator', 'goMeeting', 'time', 'meetingDataObject', 'isSummeryLeft', 'isSummeryTop', 'meetingId','isMeetingHasFile','isMeetingHasAgenda'],
 data(){
    return {
      date:''
    }
 },
  computed:{
    dayLeftOrPast(){
      return !this.goMeeting && this.isGreaterThanDay && !this.timeLeft.toString().includes(':')
    }
  },
  methods: {
    joinToSession() {
      this.$emit('join-to-session')
    },
    clickToShowDetail(id){
      this.$emit('click-to-show-detail',id)
    }
  },
mounted() {
  this.$store.dispatch('setFromSchd',{dayName:this.meetingDataObject.eventDayName,dayNum:this.meetingDataObject.eventDay.split(',')[0],monthName: this.meetingDataObject.eventMonth,yearName:this.meetingDataObject.fromSchd.split(' ')[0].split('/')[0],from:this.meetingDataObject.eventTimeFrom})
  this.$store.dispatch('setToSchd',{to:this.meetingDataObject.eventTimeTo})
}
}
</script>

<style scoped>
.brief-meeting-fragment {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.8rem;
  height: 90%;
  padding: 1rem;
}

.brief-meeting-fragment-ltr {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 90%;
  padding: 1rem;
}

.information-header-text-rtl {
  display: flex;
  flex-direction: row;
  direction: rtl;
  align-items: center;
}

.information-header-text-ltr {
  display: flex;
  flex-direction: row;
  direction: ltr;
  align-items: center;
}

.time-left {
  margin: 0 0 0 0.7rem;
  font-size: 2.8rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 2.2px;
  text-align: right;
  color: rgba(0, 0, 0, 0.8);
}

.time-left-ltr {
  margin: 0 0.7rem 0 0;
  font-size: 2.6rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 2.2px;
  text-align: left;
  color: rgba(0, 0, 0, 0.8);
}

.time-text-span {

  /*font-family: IRANYekanWeb;*/
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: right;
  color: rgba(0, 0, 0, 0.8);
}

.time-text-span-ltr {

  /*font-family: IRANYekanWeb;*/
  font-size: 11px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: rgba(0, 0, 0, 0.8);
  position: relative;
  bottom: 0.4rem;
}
.even--info__is-has-file{
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.8rem;
}
.even--info__is-has-file > div{
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 0.8rem;
}
.even--info__is-has-file span{
  font-size: 12px;
  font-weight: 400;
  text-align: right;
  color: #6e6e6e;
}
.event-title-rtl {
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  direction: rtl;
  max-width: 20rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(0, 0, 0, 0.8);
}

.event-title-ltr {
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  direction: ltr;
  max-width: 20rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(0, 0, 0, 0.8);
}

.time-left-day {
  display: flex;
  margin-right: 0.4rem;
  flex-direction: row;
  margin-left: 0.4rem;
  /*margin-top: 5px;*/
  margin-bottom: 10px;
  font-size: 1.4rem;
}

.time-left-week {
  display: flex;
  margin-right: 0.4rem;
  flex-direction: row;
  margin-left: 0.4rem;
  /*margin-top: 5px;*/
  margin-bottom: 10px;
  font-size: 1.4rem;
}

.invited__user-event {
  width: 100%;
  height: 5.4rem;
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: right;
  color: #6e6e6e;
}

.invited__user-event-ltr {
  width: 100%;
  height: 5.4rem;
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  direction: ltr;
  color: #6e6e6e;
}
.session-time{
  font-size: 12px;
  text-align: right;
  font-weight: bold;
  color: #6e6e6e;
}

.moderator-name-event {
  font-size: 12px;
  font-weight: 400;
  text-align: right;
  color: #6e6e6e;
}

.moderator-name-event-ltr {
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: right;
  color: #6e6e6e;
}

.moderator-name-event-ltr::after {
  content: ' (Moderator) ';
}

.event-room-name-fragment {
  font-size: 1.4rem;
  width: 100%;
  text-align: right;
  display: flex;
  gap: 0.2rem;
  direction: rtl;
}

.event-room-name-fragment -ltr{
  font-size: 1.4rem;
  width: 100%;
  height: 3rem;
  text-align: left;
  display: flex;
  gap: 0.8rem;
  direction: ltr;
}

.event-room-name {
  font-size: 1.4rem;
  width: 100%;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 17rem;
  direction: rtl;
  color: #6e6e6e;
}

.event-room-name-ltr {
  font-size: 1.4rem;
  width: 100%;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 17rem;
  direction: ltr;
  color: #6e6e6e;
}

.event-capacity {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  margin: 0px 6.5px 0px 61px;
  font-size: 10px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;

  color: #918f8f;
}

.event-capacity-ltr {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 0px 61px 0px 8.5px;
  font-size: 10px;
  font-weight: normal;
  font-stretch: normal;
  text-align: left;
  font-style: normal;
  letter-spacing: normal;

  color: #918f8f;
}

.hours-left {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}

.hours-left-ltr {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.time-interval {
  text-align: left;
  margin: 0px 10.5px 0 0;
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #6e6e6e;
  position: absolute;
  bottom: 0.8rem;
}
.seprator {
  width: 90%;
  margin: 0 auto;
  border: 0.1rem solid #F6F6F7;
}
</style>

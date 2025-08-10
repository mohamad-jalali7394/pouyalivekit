
<template>
  <div v-show="!showDetailAgendas"
       v-if="isMeetingHasAgenda && joiningTimeToRoom < allAgendaTimeInMinutes && isMeetingAgendaHasTime "
       class="container-presenter-agenda">
    <div v-for="(agenda,index) in agendas" :key="agenda.id"
         style="position: absolute;left: 50%;transform: translateX(-50%);text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);display: flex;gap: 0.8rem;align-items: center">
      <!--            <div v-if="(activeAgendaIndex === index)" style="padding: 0.8rem;border-radius: 0.8rem;background-color: rgba(12, 12, 12, 0.2);font-size: 1.2rem;color: white;text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);z-index: 101">-->
      <span v-if="(activeAgendaIndex === index)"
            :class="isHoveredOnAgenda ? 'presenter-agenda__title-hovered' : 'presenter-agenda__title'"
            @mouseenter="isHoveredOnAgenda = true"
            @mouseleave="isHoveredOnAgenda = false">{{ agenda.presenter + ':' + ' ' + agenda.paragraphText + '( ' + agenda.timeInMinutes + $store.getters.t('minute') + ' )' }}</span>
      <!--            </div>-->
      <img v-if="(activeAgendaIndex === index)" @click="showDetailAgendas = true" style="cursor: pointer"
           src="/img/chevron.svg" alt="not-loaded">
    </div>

  </div>
  <div v-show="showDetailAgendas"
       v-if="isMeetingHasAgenda && joiningTimeToRoom < allAgendaTimeInMinutes && isMeetingAgendaHasTime "
       class="container-progress-bar-for-agenda">
    <div class="line-progress-bar">
    </div>
    <img @click="showDetailAgendas = false"
         style="cursor: pointer;position: absolute;top:-.7rem;left: 50%;transform: translateX(-50%);z-index: 200"
         src="/img/chevron-u.svg" alt="not-loaded">
    <div v-for="(agenda,index) in agendas" :key="agenda.id" class="progress-element-agenda"
         :style="{width:(agenda.timeInMinutes/allAgendaTimeInMinutes)*100 + '%'}">
      <div v-if="activeAgendaIndex === index && isExtendAgendaTimeShowed"
           style="padding:0.8rem 1.6rem;color: #292933;direction: rtl;font-size: 1.1rem;position: absolute;background-color: white;width:20rem;top: 2rem;display: flex;flex-direction: column;z-index: 105;border: 0.1rem solid transparent;border-radius: 0.8rem "
           :style="{left:index === 0 ? '0' :  '',right:index === 0 ? '' :  '0'}">
        <div v-if="(activeAgendaIndex === index) "
             style="width: 0;height: 0;border-left: 6px solid transparent;border-right: 6px solid transparent;border-bottom: 8px solid #ffffff;position: relative;top: -1.5rem;"
             :style="{right:index === 0 ? '16.5rem' :  '-1rem'}"></div>

        <div>{{ $store.getters.t('do-you-extend-time', {name: agenda.presenter}) }}</div>
        <div style="display: flex;justify-content: space-between">
          <span style="cursor: pointer" @click="extendMeetingAgendaTime">بله</span>
          <span style="cursor: pointer" @click="doNotAcceptExtendMeetingAgendaTime">خیر</span>
        </div>
      </div>
      <span
          style="position: absolute;right:-1.6rem;font-size: 1rem;color: white;text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);z-index: 101">{{ agenda.toSchd }}</span>
      <span v-if="index === 0"
            style="position: absolute;left:-1.6rem;font-size: 1rem;color: white;text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);z-index: 101">{{ fromSchd }}</span>
      <div
          style="width: 100%;display: flex;justify-content: center;position: absolute;left:50%;transform: translateX(-50%);font-size: 1rem;color: white;text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);z-index: 101">
        <div @mouseenter="isHoveredOnAgenda = true; agendaIndexHovered = index"
             @mouseleave="isHoveredOnAgenda = false; agendaIndexHovered = null"
             :class="isHoveredOnAgenda && agendaIndexHovered === index ? 'progress-agenda__title-hovered' : 'progress-agenda__title'">
          {{ agenda.presenter + ':' + ' ' + agenda.paragraphText + '( ' + agenda.timeInMinutes + $store.getters.t('minute') + ' )' }}
        </div>
      </div>
      <div v-if="(activeAgendaIndex === index) && !agenda.isDone" :style="{width: (startStepInAgendaProgress/agenda.timeInMinutes)*100 + '%',  height: '20px',
  backgroundColor: 'rgb(42, 180, 89,0.5)'}" :id="agenda.id">

      </div>
      <div v-if="(activeAgendaIndex === index) "
           style="width: 0;height: 0;border-left: 6px solid transparent;border-right: 6px solid transparent;border-top: 8px solid red;position: relative;top: -1rem;left: -0.4rem"></div>
      <div v-if="agenda.isDone" :style="{width: '100%',  height: '20px',
  backgroundColor: 'rgba(158,158,178,0.7)',position:'relative'}">
        <!--              <span style="position: absolute;left: 50%;font-size: 1.2rem;transform: translateX(-50%);color: white;text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);">completed</span>-->
      </div>
    </div>

  </div>

</template>
<script>
import RestClient from "@/api/restClient";
import entityTypes from "@/statics/entityTypes";
import momentjs from "moment";
import momentJalaali from "moment-jalaali";
import {nextTick} from "vue";
export default {
  name: "AgendaProgress",
  props:["isModeratorSubstituteActivated"],
  data(){
    return {
      restClientAgenda: new RestClient(entityTypes.agenda),
      joiningTimeToRoom: 0,
      showDetailAgendas: true,
      isExtendAgendaTimeShowed: false,
      isHoveredOnAgenda: false,
      agendaId: '',
      purposeOfMeeting: '',
      isMeetingAgendaHasTime: false,
      isMeetingHasAgenda: false,
      agendas: [],
      allAgendasTimeInMinutes: 0,
      activeAgendaIndex: 0,
      startStepInAgendaProgress: 0,
      allAgendaTimeInMinutes: 0,
      intervalId: '',
      counter: 0,
      agendaHistory:[],
      agendaIndexHovered: null,
      remainTime:5,
      progressRatioOfActiveAgenda:0,
    }
},
  methods:{
    getAgendaByMeetingId() {
      this.restClientAgenda.getAgenda(this.$store.getters.roomId).then((response) => {
        this.isMeetingAgendaHasTime = response.data.hasTiming
        if (response.data?.agendas?.length > 0 && this.isMeetingAgendaHasTime) {
          this.showProgressBarForMeetingAgenda(response.data)
        }

        // this.$store.dispatch('setAgendaParagraphs',this.paragraphs)
        // this.$store.dispatch('setPurposeOfMeeting',response.data.purposeOfMeeting)
        // this.eventBus.emit('agenda-id',response.data.id)
        this.purposeOfMeeting = response.data.purposeOfMeeting
        this.agendaId = response.data.id
        this.createdDate = response.data.createdDate
        this.createdBy = response.data.createdBy
        this.meetingName = response.data.meetingName
        this.agendaHistory = response.data.agendas.map((el) => {
          return {id:el.id, isExtendedTimeShowed:false, isNotificationShowed:false}
        })
      })
          .catch((error) => {
            console.error(error)
          })
    },
    startProgressInAgenda() {
      this.isExtendAgendaTimeShowed = false
      nextTick(() => {
        if (this.counter === 0) {
          this.counter = 1;
          var elem = document.getElementById(this.agendas[this.activeAgendaIndex].id);
          this.progressRatioOfActiveAgenda = (this.startStepInAgendaProgress / (this.agendas[this.activeAgendaIndex].timeInMinutes) * 100);
          this.intervalId = setInterval(() => {
            if (this.progressRatioOfActiveAgenda >= 100) {
              this.counter = 0;
              clearInterval(this.intervalId);
              this.startStepInAgendaProgress = 0
              this.agendas[this.activeAgendaIndex].isDone = true
              this.activeAgendaIndex++
              if (this.activeAgendaIndex < this.agendas.length) {
                this.counter = 0
                this.startProgressInAgenda()
              }

            } else {
              if (this.$store.getters.amIModerator || this.isModeratorSubstituteActivated) {
                const activeAgendaEndDate = this.$store.getters.fromSchd.completeDate.split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex].toSchd
                const toScheduleActiveAgenda = new Date(momentJalaali(activeAgendaEndDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm'))
                const nowDate = new Date(momentjs().format('YYYY/MM/DD HH:mm'))
                if ((toScheduleActiveAgenda?.getTime() - nowDate?.getTime()) / 60000 < 5  && (!this.agendaHistory[this.activeAgendaIndex].isNotificationShowed)) {
                  this.agendaHistory[this.activeAgendaIndex].isNotificationShowed = true
                  this.remainTime = Math.ceil((toScheduleActiveAgenda?.getTime() - nowDate?.getTime()) / 60000)
                  this.eventBus.emit("notification", {
                    title: "پیام",
                    type: "warning",
                    bodyText: this.$store.getters.t('time-left-5-minutes', {name: this.agendas[this.activeAgendaIndex].presenter, numberOfMinutes:this.remainTime}),
                    time: 5000,
                  });
                }
                if ((toScheduleActiveAgenda?.getTime() - nowDate?.getTime()) / 60000 < 5 && (!this.agendaHistory[this.activeAgendaIndex].isExtendedTimeShowed) && (+this.agendas[this.activeAgendaIndex + 1]?.timeInMinutes > 5 || (+this.agendas[this.activeAgendaIndex + 1]?.timeInMinutes + +this.agendas[this.activeAgendaIndex + 2]?.timeInMinutes) > 5 || (+this.agendas[this.activeAgendaIndex + 1]?.timeInMinutes + +this.agendas[this.activeAgendaIndex + 2]?.timeInMinutes + +this.agendas[this.activeAgendaIndex + 3]?.timeInMinutes) > 5)) {
                  this.isExtendAgendaTimeShowed = true

                }
              }
              this.progressRatioOfActiveAgenda = this.progressRatioOfActiveAgenda + 100 / (6 * this.agendas[this.activeAgendaIndex].timeInMinutes);
              this.startStepInAgendaProgress = this.progressRatioOfActiveAgenda + '%'
              elem.style.width = this.progressRatioOfActiveAgenda + "%";
            }
          }, 10000);
        }


      },)

    },
    showProgressBarForMeetingAgenda(data) {
      this.isMeetingAgendaHasTime = data.hasTiming
      this.isMeetingHasAgenda = true
      let minutes = 0
      this.agendas = data.agendas.map((agenda) => {
        minutes += parseInt(agenda.timeInMinutes)
        return {
          presenter: agenda.presenter,
          timeInMinutes: parseInt(agenda.timeInMinutes),
          isDone: false,
          id: agenda.id,
          paragraphText: agenda.agenda,
          toSchd: momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').add(minutes, 'minutes').format('HH:mm')
        }
      })
      const initialValue = 0;
      this.allAgendaTimeInMinutes = this.agendas.reduce(
          (accumulator, currentValue) => accumulator + parseInt(currentValue.timeInMinutes),
          initialValue,
      );// console.error(this.agendas)
      // console.error(this.allAgendaTimeInMinutes)
      const fromSchedule = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.$store.getters.fromSchd.from)
      const joiningDate = new Date(momentjs().format('YYYY/MM/DD HH:mm'))
      this.fromSchd = momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('HH:mm')
      if (joiningDate?.getTime() >= fromSchedule?.getTime()) {
        this.joiningTimeToRoom = (joiningDate?.getTime() - fromSchedule?.getTime()) / 60000
      }
      let activeIndex = -1;
      let step = parseInt(this.agendas[0].timeInMinutes)
      for (let i = 0; i < this.agendas.length; i++) {

        if (this.joiningTimeToRoom < step) {
          activeIndex = i
          break;
        }
        if (i + 1 < this.agendas.length) {
          step += parseInt(this.agendas[i + 1].timeInMinutes)
        }
      }
      if (activeIndex !== -1) {
        this.startStepInAgendaProgress = this.joiningTimeToRoom
        this.activeAgendaIndex = activeIndex
        for (let i = 0; i < activeIndex; i++) {
          this.agendas[i].isDone = true
          this.startStepInAgendaProgress -= this.agendas[i].timeInMinutes
        }
        // console.error(this.joiningTimeToRoom)
        // console.error(this.startStepInAgendaProgress)
        this.startProgressInAgenda()
      } else {
        this.startStepInAgendaProgress = 0
        for (let i = 0; i < this.agendas.length; i++) {
          this.agendas[i].isDone = true
          this.activeAgendaIndex = null
        }
      }
    },
    doNotAcceptExtendMeetingAgendaTime(){
      this.isExtendAgendaTimeShowed = false
      this.agendaHistory[this.activeAgendaIndex].isExtendedTimeShowed = true
    },
    extendMeetingAgendaTime() {
      this.isExtendAgendaTimeShowed = false
      // this.restClientAgenda.extendMeetingAgendaTime(this.$store.getters.roomId, this.$store.getters.userId)

      if ( (this.agendas.length - this.activeAgendaIndex + 1 > 2) &&  (+this.agendas[this.activeAgendaIndex + 1]?.timeInMinutes > 5 || (+this.agendas[this.activeAgendaIndex + 1]?.timeInMinutes + +this.agendas[this.activeAgendaIndex + 2]?.timeInMinutes) > 5 || (+this.agendas[this.activeAgendaIndex + 1]?.timeInMinutes + +this.agendas[this.activeAgendaIndex + 2]?.timeInMinutes + +this.agendas[this.activeAgendaIndex + 3]?.timeInMinutes) > 5)) {
        if ((+this.agendas[this.activeAgendaIndex + 1]?.timeInMinutes + +this.agendas[this.activeAgendaIndex + 2]?.timeInMinutes + +this.agendas[this.activeAgendaIndex + 3]?.timeInMinutes) > 5) {
          const date = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex].toSchd)
          const date2 = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex + 1].toSchd)
          const date3 = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex + 2].toSchd)
          // const date4 = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex + 3].toSchd)
          const editedDate = momentjs(date).add(5, 'minutes')
          const editedDate2 = momentjs(date2).add(3, 'minutes')
          const editedDate3 = momentjs(date3).add(1, 'minutes')
          // const editedDate4 = momentjs(date4).add(parseInt('-' + 1), 'minutes')
          this.agendas[this.activeAgendaIndex].toSchd = momentjs(editedDate).format('HH:mm')
          this.agendas[this.activeAgendaIndex].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex].timeInMinutes) + 5
          this.agendas[this.activeAgendaIndex + 1].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex + 1].timeInMinutes) - 2
          this.agendas[this.activeAgendaIndex + 1].toSchd = momentjs(editedDate2).format('HH:mm')
          this.agendas[this.activeAgendaIndex + 2].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex + 2].timeInMinutes) - 2
          this.agendas[this.activeAgendaIndex + 2].toSchd = momentjs(editedDate3).format('HH:mm')
          this.agendas[this.activeAgendaIndex + 3].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex + 3].timeInMinutes) - 1
          // this.agendas[this.activeAgendaIndex + 3].toSchd = momentjs(editedDate4).format('HH:mm')
        } else if ((this.agendas.length - this.activeAgendaIndex + 1 > 1) && (+this.agendas[this.activeAgendaIndex + 1]?.timeInMinutes + +this.agendas[this.activeAgendaIndex + 2]?.timeInMinutes) > 5) {
          const date = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex].toSchd)
          const date2 = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex + 1].toSchd)
          // const date3 = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex + 2].toSchd)
          const editedDate = momentjs(date).add(5, 'minutes')
          const editedDate2 = momentjs(date2).add(2, 'minutes')
          // const editedDate3 = momentjs(date3).add(parseInt('-' + 2), 'minutes')
          this.agendas[this.activeAgendaIndex].toSchd = momentjs(editedDate).format('HH:mm')
          this.agendas[this.activeAgendaIndex].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex].timeInMinutes) + 5
          this.agendas[this.activeAgendaIndex + 1].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex + 1].timeInMinutes) - 3
          this.agendas[this.activeAgendaIndex + 1].toSchd = momentjs(editedDate2).format('HH:mm')
          this.agendas[this.activeAgendaIndex + 2].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex + 2].timeInMinutes) - 2
          // this.agendas[this.activeAgendaIndex + 2].toSchd = momentjs(editedDate3).format('HH:mm')

        } else {
          const date = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex].toSchd)
          // const date2 = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex + 1].toSchd)
          const editedDate = momentjs(date).add(5, 'minutes')
          // const editedDate2 = momentjs(date2).add(parseInt('-' + 5), 'minutes')
          this.agendas[this.activeAgendaIndex].toSchd = momentjs(editedDate).format('HH:mm')
          this.agendas[this.activeAgendaIndex].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex].timeInMinutes) + 5
          this.agendas[this.activeAgendaIndex + 1].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex + 1].timeInMinutes) - 5
          // this.agendas[this.activeAgendaIndex + 1].toSchd = momentjs(editedDate2).format('HH:mm')
        }
        this.progressRatioOfActiveAgenda = ((this.agendas[this.activeAgendaIndex].timeInMinutes - 5) *  this.progressRatioOfActiveAgenda ) / this.agendas[this.activeAgendaIndex].timeInMinutes
        this.eventBus.emit('send-signal-to-edit-agenda')
        this.editAgenda()

      }

    },
    editAgenda() {
      const agendas = this.agendas.map((paragraph) => {
        return {
          presenter: paragraph.presenter,
          timeInMinutes: paragraph.timeInMinutes,
          agenda: paragraph.paragraphText,
          id: paragraph.id
        }
      })

      const data = {
        id: this.agendaId,
        meetingId: this.$store.getters.roomId,
        createdDate: this.createdDate,
        createdBy: this.createdBy,
        meetingName: this.meetingName,
        purposeOfMeeting: this.purposeOfMeeting,
        agendas: agendas,
        hasTiming: this.isMeetingAgendaHasTime
      }
      if (this.agendas.length > 0 && this.agendas[this.agendas.length - 1].paragraphText.length > 0) {
        this.restClientAgenda.editAgenda(data).then(() => {
          // this.$emit("close-agenda-modal", false);
          console.log('agenda updated')
        }).catch((error) => {
          console.error(error)
        })
      }

    },
  },
  mounted() {
    this.getAgendaByMeetingId()
    this.eventBus.on('change-agenda-presenter', () => {
      this.startProgressInAgenda()
    })
    this.eventBus.on("extend-meeting-agenda-time", () => {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "success",
          bodyText: this.$store.getters.t('time-extended-5-minutes', {name: this.agendas[this.activeAgendaIndex].presenter}),
          time: 5000,
        });
        if ((+this.agendas[this.activeAgendaIndex + 1]?.timeInMinutes + +this.agendas[this.activeAgendaIndex + 2]?.timeInMinutes + +this.agendas[this.activeAgendaIndex + 3]?.timeInMinutes) > 5) {
          const date = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex].toSchd)
          const date2 = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex + 1].toSchd)
          const date3 = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex + 2].toSchd)
          const date4 = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex + 3].toSchd)
          const editedDate = momentjs(date).add(5, 'minutes')
          const editedDate2 = momentjs(date2).add(parseInt('-' + 2), 'minutes')
          const editedDate3 = momentjs(date3).add(parseInt('-' + 2), 'minutes')
          const editedDate4 = momentjs(date4).add(parseInt('-' + 1), 'minutes')
          this.agendas[this.activeAgendaIndex].toSchd = momentjs(editedDate).format('HH:mm')
          this.agendas[this.activeAgendaIndex].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex].timeInMinutes) + 5
          this.agendas[this.activeAgendaIndex + 1].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex + 1].timeInMinutes) - 2
          this.agendas[this.activeAgendaIndex + 1].toSchd = momentjs(editedDate2).format('HH:mm')
          this.agendas[this.activeAgendaIndex + 2].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex + 2].timeInMinutes) - 2
          this.agendas[this.activeAgendaIndex + 2].toSchd = momentjs(editedDate3).format('HH:mm')
          this.agendas[this.activeAgendaIndex + 3].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex + 3].timeInMinutes) - 1
          this.agendas[this.activeAgendaIndex + 3].toSchd = momentjs(editedDate4).format('HH:mm')
        } else if ((+this.agendas[this.activeAgendaIndex + 1]?.timeInMinutes + +this.agendas[this.activeAgendaIndex + 2]?.timeInMinutes) > 5) {
          const date = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex].toSchd)
          const date2 = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex + 1].toSchd)
          const date3 = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex + 2].toSchd)
          const editedDate = momentjs(date).add(5, 'minutes')
          const editedDate2 = momentjs(date2).add(parseInt('-' + 3), 'minutes')
          const editedDate3 = momentjs(date3).add(parseInt('-' + 2), 'minutes')
          this.agendas[this.activeAgendaIndex].toSchd = momentjs(editedDate).format('HH:mm')
          this.agendas[this.activeAgendaIndex].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex].timeInMinutes) + 5
          this.agendas[this.activeAgendaIndex + 1].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex + 1].timeInMinutes) - 3
          this.agendas[this.activeAgendaIndex + 1].toSchd = momentjs(editedDate2).format('HH:mm')
          this.agendas[this.activeAgendaIndex + 2].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex + 2].timeInMinutes) - 2
          this.agendas[this.activeAgendaIndex + 2].toSchd = momentjs(editedDate3).format('HH:mm')

        } else {
          const date = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex].toSchd)
          const date2 = new Date(momentJalaali(this.$store.getters.fromSchd.completeDate, 'jYYYY/jMM/jDD HH:mm').format('YYYY/MM/DD HH:mm').split(' ')[0] + ' ' + this.agendas[this.activeAgendaIndex + 1].toSchd)
          const editedDate = momentjs(date).add(5, 'minutes')
          const editedDate2 = momentjs(date2).add(parseInt('-' + 5), 'minutes')
          this.agendas[this.activeAgendaIndex].toSchd = momentjs(editedDate).format('HH:mm')
          this.agendas[this.activeAgendaIndex].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex].timeInMinutes) + 5
          this.agendas[this.activeAgendaIndex + 1].timeInMinutes = parseInt(this.agendas[this.activeAgendaIndex + 1].timeInMinutes) - 5
          this.agendas[this.activeAgendaIndex + 1].toSchd = momentjs(editedDate2).format('HH:mm')
        }
      this.progressRatioOfActiveAgenda = ((this.agendas[this.activeAgendaIndex].timeInMinutes - 5) *  this.progressRatioOfActiveAgenda ) / this.agendas[this.activeAgendaIndex].timeInMinutes
    });
  }
}
</script>
<style scoped>
.container-presenter-agenda {
  width: 95%;
  display: flex;
  position: absolute;
  top: 1rem;
  z-index: 100;
  gap: 1.6rem;
}

.presenter-agenda__title-hovered {
  max-width: 100%;
  padding: 0.8rem;
  border-radius: 0.8rem;
  background-color: rgba(12, 12, 12, 0.2);
  font-size: 1.2rem;
  direction: rtl;
  color: white;
}

.presenter-agenda__title {
  max-width: 40rem;
  padding: 0.8rem;
  border-radius: 0.8rem;
  background-color: rgba(12, 12, 12, 0.2);
  font-size: 1.2rem;
  direction: rtl;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-agenda__title-hovered {
  max-width: 100%;
  padding: 0.8rem;
  border-radius: 0.8rem;
  background-color: rgba(12, 12, 12, 0.2);
  font-size: 1.2rem;
  direction: rtl;
  color: white;
}

.progress-agenda__title {
  font-size: 1.2rem;
  color: white;
  width: 70%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  direction: rtl;
  text-align: center
}

.container-progress-bar-for-agenda {
  width: 95%;
  display: flex;
  position: absolute;
  top: 1rem;
  z-index: 100;
}

.progress-element-agenda {
  background-color: rgba(12, 12, 12, 0.2);
  border-left: 1px solid black;
  border-right: 1px solid black;
  position: relative;
  display: flex;


}

.line-progress-bar {
  position: absolute;
  width: 100%;
  height: 0;
  top: 50%;
  border: 1px solid black;
}
</style>
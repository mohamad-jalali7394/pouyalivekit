<template>
  <div style="width: 100%; padding: 0.5rem">
    <div class="polling-information-container">
      <div style="border-bottom: 0.1rem solid #8f8e8e" :class=" $i18n.locale !== 'en' ?  'polling-information-header' : 'polling-information-header-ltr'">
        <div>
          <!--        <span class="polling-label-span">{{ $store.getters.t('polling-type') }} </span>-->
          <!--        <span style="font-size: 1.4rem;font-weight: 700">{{-->
          <!--            isOptional ? $store.getters.t('multiple-choice') : $store.getters.t('descriptive')-->
          <!--          }}</span>-->
        </div>
        <div>
          <span class="polling-label-span">{{ $store.getters.t('creation-time') }} </span>
          <!--        <span style="font-size: 1.4rem;font-weight: 400">{{-->
          <!--            (pollingCreatedDate !== null && pollingCreatedDate !== undefined) ? pollingCreatedDate.eventDayName + ' ' + pollingCreatedDate.dayNum + ' ' + pollingCreatedDate.eventMonth + ' ' + pollingCreatedDate.eventYear + '،' + ' '  + pollingCreatedDate.clock + ' ' + pollingCreatedDate.eventTime : $store.getters.t('no-time')-->
          <!--          }}</span>-->
          <span>{{  createdAt[2] + ' ' + createdAt[1] + ' ' + createdAt[0] + ',' + createdAt[3]}}</span>
        </div>
        <div>
             <span class="polling-label-span">
               {{ $store.getters.t('answers-number') }}
            </span>
          <span style="font-size: 1.4rem;font-weight: 700">
            {{ pollingResult[0]?.surveyResultDtoList?.length ? pollingResult[0]?.surveyResultDtoList?.length  : 0}}

        </span>
        </div>
        <div>
             <span class="polling-label-span">
               {{ $store.getters.t('polling-type') }}
            </span>
          <span style="font-size: 1.4rem;font-weight: 700">
            {{ pollingData[0].isOptional? 'تستی' : 'تشریحی'}}

        </span>
        </div>
      </div>
      <div class="polling-information-body">
        <div style="max-height:7rem;overflow-y: auto;display: flex;flex-direction: column;gap: 0.8rem;justify-content: center;width: 100%;align-items: center">

          <!--                        <span class="polling-label-span" :style="{'direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">-->
          <!--                          {{ $store.getters.t('polling-tile') }}-->
          <!--                        </span>-->
          <span style="max-width: 90%;white-space: pre-line;overflow-wrap: break-word;font-size: 1.6rem;font-weight: 700;" :style="{'direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
                  {{ pollingTitle }}
              </span>


        </div>
      </div>

      <div v-if="isInformationShown" class="seprate-info"></div>
      <div class="height-animation-expand" ref="expand">
        <!--      <div v-if="isOptional && this.pollStatistics.length" :class=" $i18n.locale !== 'en' ? 'polling-chart-fragment' : 'polling-chart-fragment__ltr'" style="">-->
        <div :class=" $i18n.locale !== 'en' ? 'polling-chart-fragment' : 'polling-chart-fragment__ltr'">

          <div v-for="(info,questionIdx) in pollingResult" :key="info.questionNum" style="width: 100%;display: flex;flex-direction: column;border-bottom: 0.1rem solid #8f8e8e;padding: 0 0 4rem 0">
            <div style="width: 100%;display: flex">
              <div class="polling-chart-options" :style="{'direction' : $i18n.locale !== 'en' ? 'rtl' : 'ltr',width:'100%'}">
                <div style="min-height:1rem;max-height: 7rem;overflow-y: auto;display: flex;flex-direction: column;gap: 0.8rem;font-weight: 700;font-size: 1.4rem">
           <span style="max-width: 90%;white-space: pre-line;overflow-wrap: break-word;margin-top: 1rem" :style="{'direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
                  {{ info.questionBody}}
              </span>


                </div>
                <div  ref="options" v-for="(poll, index) in info.surveyStatisticsList" :key="poll + index"
                      style="position: relative;width: 100%;font-size: 1.2rem;"
                      :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">

                  <div style="max-width: 98%;overflow-wrap: break-word;" :style="{'direction' : $i18n.locale !== 'en' ? 'rtl' : 'ltr'}"
                       @mouseenter="showTooltip(index)" @mouseleave="hideTooltip">
                    <span>{{ index + 1 + '-' + ' ' }}</span>
                    <span>{{ poll.option + ' ' }}</span>
                    <span>{{ '(' + poll.percentageOfVotes + '%' + ')' }}</span>
                  </div>


                </div>
              </div>
              <div v-if='isOptional' class="pie-chart">
                <pieChart :id="info.questionNum" :options="options[questionIdx]" class="direction"/>
              </div>
            </div>

            <div
                class="users-participated-polling-table-fragment" :style="{'direction' : $i18n.locale !== 'en' ? 'rtl' : 'ltr', 'margin-top': isOptional  ? '0' : '1rem'}"
            >
              <!--         <span class="polling-label-span" >{{$store.getters.t('present-participants')}}</span>-->
              <div class="polling-th-table--container">
                <span style="width: 20rem;font-weight: 700;color: #75758F"> {{$store.getters.t('name-of-participant')}}</span>
                <span style="width: calc(100% - 20rem);font-weight: 700;color: #75758F">{{$store.getters.t('answer')}}</span>
              </div>
              <ul class="polling-ul--table">
                <li v-for="(user,index) in info.surveyResultDtoList" :key="index">
                  <div class="polling-table-display-name" >
              <span
                  style="max-width: 17rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-size: 1.2rem;font-weight: 400;" :style="{'text-align' : $i18n.locale !== 'en' ? 'right' : 'left'}">
                {{ !user.firstName ? 'ناشناس' : user.firstName }}</span>
                  </div>
                  <span class="polling-table-answer" :style="{'text-align' : $i18n.locale !== 'en' ? 'right' : 'left'}">{{
                      user.answer  }}</span>

                </li>
              </ul>
            </div>
          </div>
        </div>


      </div>

      <div
          style="height: 5rem;display: flex;align-items: center;justify-content: space-between"
          :style="{width: '100%','text-align': $i18n.locale !== 'en' ? 'right' : 'left',direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr','border-top':isInformationShown  ? 'none' :'0.1rem solid #DCDADA'}">
        <div style="height: 5rem;display: flex;align-items: center;gap: 0.5rem">

        <span style="cursor: pointer;font-size: 1.4rem;font-weight: 700"
              @click="openDetailInformation">{{ $store.getters.t('more-detail') }}</span>
          <span style="width: 20px">
<!--            <svg v-if="$i18n.locale !== 'en'" @click="openDetailInformation"-->
            <!--                 :class="isInformationShown ? $i18n.locale!=='en' ?  'rotation-svg-90' :  'rotation-svg-90-ltr' :$i18n.locale!=='en' ? 'rotation-svg-zero' : 'rotation-svg-zero-ltr' "-->
            <!--                 style="width: 15px ; cursor: pointer;position: relative;top: 5px;z-index: 1000" data-name="Layer 1"-->
            <!--                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">-->
            <!--              <path-->
            <!--                  d="M16.617,22a.5082.5082,0,0,0,.3583-.8685L7.966,12.1749l9.1467-9.31a.5081.5081,0,0,0-.7245-.7127l-9.5011,9.67a.5083.5083,0,0,0,.004.7166l9.3676,9.313A.5079.5079,0,0,0,16.617,22Z"/>-->
            <!--            </svg>-->
         <img draggable="false" v-if="!isInformationShown" @click="openDetailInformation" style="cursor: pointer"
              src="/img/chevron_down.svg" alt="not-loaded">
         <img draggable="false" v-else @click="openDetailInformation" style="cursor: pointer;transform: rotate(180deg)"
              src="/img/chevron_down.svg" alt="not-loaded">

            </span>
        </div>

        <div style="height: 5rem;display: flex;align-items: center;gap: 1.6rem;flex-direction: row-reverse">
          <!--        <div class="polling-action-element" @click="DownloadExel">-->
          <!--          <img draggable="false" src="/img/excel.svg">-->
          <!--          <span style="color:#1B76FF">{{$store.getters.t('get-excel')}}</span>-->
          <!--        </div>-->
          <div class="polling-action-element" @click="getPDF">
            <img draggable="false" src="/img/print.svg">
            <span style="color:#1B76FF" >{{$store.getters.t('print')}}</span>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import pieChart from "./vuec3/VueC3.vue";
import {nextTick} from "vue";
import RestClient from "@/api/restClient";
import entityTypes from "../statics/entityTypes";
// import momentJalali from "moment-jalaali";
// import momentjs from "moment";
// import ParticipantListElement from "./ParticipantListElement";
// import BaseToolTip from "./UI/BaseToolTip";


export default {
  name: "PollingInformation",
  props: [ 'pollingId', 'meetingTitle','pollingData'],
  components: {pieChart},
  data() {
    return {
      isInformationShown: false,
      isCollapsed: false,
      restClient: new RestClient(entityTypes.polling),
      arrayOfPercentage: [],
      pollStatistics: [],
      isPollingOptionsHovered: false,
      optionIndex: 0,
      options: [],
      createdTime: '',
      dayName:'',
      year:'',
      monthName:'',
      pollingTitle:'',
      isOptional:false,
      pollingResult:[],
      createdAt:'',
      pollingResultDto:[],
    }
  },
  // watch: {
  //   isInformationShown(value) {
  //     if (value) {
  //       this.$refs.expand.style.animation = 'expand 1s forwards'
  //       // this.$refs.expand.style.height = 0 + 'px';
  //       // let x = Math.floor(this.$refs.expandchild.offsetHeight / 20) + 1
  //       // let counter = 0
  //       // let timer = setInterval(() => {
  //       //   counter = counter + x
  //       //   if (this.pollingResultDto.length > 0) {
  //       //     if (counter > (this.$refs.expandchild.offsetHeight + x)) {
  //       //       clearInterval(timer)
  //       //     } else {
  //       //       this.$refs.expand.style.height = `${counter}px`
  //       //     }
  //       //   } else {
  //       //     if (counter > (this.$refs.expandchild.offsetHeight + x + x + x + x + x + x + x + x + x + x + x + x + x + x)) {
  //       //       clearInterval(timer)
  //       //     } else {
  //       //       this.$refs.expand.style.height = `${counter}px`
  //       //     }
  //       //   }
  //       //
  //       //
  //       // }, 10)
  //     }
  //   }
  // },
  computed: {
    pollingCreatedDate() {
    //   let eventDate = ''
    //   if (this.$i18n.locale !== 'en'){
    //       eventDate = (new Intl.DateTimeFormat('fa-IR', {
    //       dateStyle: 'full',
    //       timeStyle: 'long'
    //     }).format(new Date(this.createdAt))).toString()
    //   }else {
    //     eventDate = (new Intl.DateTimeFormat('en-us', {
    //       dateStyle: 'full',
    //       timeStyle: 'long'
    //     }).format(new Date(this.createdAt))).toString()
    //   }
    //   const monthNum = momentJalali(this.createdAt)._i.split('/')[1]
    //   this.getMonth(monthNum)
    //   // this.dayName = momentJalali(this.createdAt).format('dddd')
    //   // this.Year = momentJalali(this.createdAt).format('yyyy')
    //   console.error({
    //     eventDayName: momentJalali(this.createdAt).format('dddd'),
    //     dayNum:(momentJalali(this.createdAt)._i.split('/')[2]).split(' ')[0],
    //     eventMonth: this.monthName,
    //     clock: eventDate.split(' ')[4],
    //     eventTime: eventDate.split(' ')[5].slice(0, eventDate.split(' ')[5].length - 3),
    //     eventYear: momentJalali(this.createdAt).format('yyyy'),
    //   })
    //   return {
    //     eventDayName: momentJalali(this.createdAt).format('dddd'),
    //     dayNum:(momentJalali(this.createdAt)._i.split('/')[2]).split(' ')[0],
    //     eventMonth: this.monthName,
    //     clock: eventDate.split(' ')[4],
    //     eventTime: (momentJalali(this.createdAt)._i.split('/')[2]).split(' ')[1],
    //     eventYear: momentJalali(this.createdAt).format('yyyy'),
    //   }
      return ''
    }
  },
  methods: {
    showTooltip(index) {

      if (this.$refs.options[index]?.lastChild.offsetWidth > 107) {
        this.optionIndex = index
        this.isPollingOptionsHovered = true
      }

    },
    hideTooltip() {
      this.isPollingOptionsHovered = false
    },
    openDetailInformation() {
      this.isInformationShown = !this.isInformationShown
      if (this.isInformationShown) {
        this.$refs.expand.style['max-height'] = 'max-content'
        setTimeout(() => {
          this.$refs.expand.style['overflow-y'] = 'auto'
        }, 400)

      } else {
        this.$refs.expand.style['max-height'] = '0'
        this.$refs.expand.style['overflow-y'] = 'hidden'
      }
    },
    getResultPolling(id) {
      this.arrayOfPercentage = [];

      this.restClient
          .getResultSurvey(id)
          .then((response) => {

            nextTick(() => {
              this.createdAt = (new Intl.DateTimeFormat('fa-IR', {
                dateStyle: 'full',
                timeStyle: 'long'
              }).format(new Date(response.createdAt))).toString().split(',')[0].split(' ')
              this.createdAt.push((new Intl.DateTimeFormat('fa-IR', {
                dateStyle: 'full',
                timeStyle: 'long'
              }).format(new Date(response.createdAt))).toString().split(',')[1].split('(')[0])
              if (response.surveyQuestionResultDtoList[0].isOptional) {
                this.isOptional = true

                // if (response.pollingResultDto.length === 0) {
                //   this.isPassCoupleOfSeconds = true
                // } else {
                //
                //   this.isPassCoupleOfSeconds = false
                // }
              }
              this.pollingResult = [...response.surveyQuestionResultDtoList];
              for (let i = 0; i<this.pollingResult?.length ; i++) {
                const element = document.getElementById(`${this.pollingResult[i].questionNum}`)
                if (element){
                  element.style.display = "none";
                }
              }
              // this.pollStatistics = this.pollingResult.map(el => {
              //   console.error(el.surveyStatisticsList)
              //   return el.surveyStatisticsList
              // });
              for (let i = 0; i<this.pollingResult?.length ; i++){
                this.pollStatistics.push(this.pollingResult[i].surveyStatisticsList)
              }
              // else {
              //   if (response?.surveyQuestionResultDtoList?.surveyResultDtoList.length > 0){
              //     const AnswerList = response.surveyQuestionResultDtoList.surveyResultDtoList.map((el)=>{
              //       return {answer: el.answer, displayName: el.displayName,questionId:response.surveyId }
              //     })
              //     this.pollingResultDto = {answer, displayName}
              //   }else {
              //     this.pollingResultDto = []
              //   }
              //
              // }
            })
            this.pollingTitle = response.title
            // if (response.isAnonymous) {
            //   for (let i = 0; i < response.pollingResultDto.length; i++) {
            //     response.pollingResultDto[i].username = "ناشناس";
            //   }
            // }

            let question = "";
            let percentage = 0;

            setTimeout(()=>{
              // console.error(response.surveyQuestionResultDtoList[0])
              console.error(this.pollStatistics)
              if (this.pollingResult[0].isOptional && this.pollStatistics?.length > 0) {
                for (let i = 0; i<this.pollStatistics?.length ; i++){
                  document.getElementById(`${this.pollingResult[i].questionNum}`).style.display = "flex";

                  document.getElementById(`${this.pollingResult[i].questionNum}`).style.fontSize = "11px";
                  if (this.pollStatistics[i]?.length > 0) {
                    const pollStatisticsElement = this.pollStatistics[i]
                    console.error(pollStatisticsElement)
                    for (let j = 0; j < pollStatisticsElement?.length; j++) {
                      question = 'گزینه ' + (j + 1);
                      this.arrayOfPercentage.push(question);
                      console.error(pollStatisticsElement[j].percentageOfVotes)
                      percentage = pollStatisticsElement[j].percentageOfVotes;
                      this.arrayOfPercentage.push(percentage);
                    }
                    let splittedArray = [];
                    while (this.arrayOfPercentage.length > 0) {
                      splittedArray.push(this.arrayOfPercentage.splice(0, 2));
                    }
                    this.innerData = splittedArray;
                    const options = {
                      size: {
                        height: 200,
                        width: 300
                      },
                      data: {
                        columns: this.innerData,
                        type: "donut",
                        onmouseover: function (d, i) {
                          console.error("onmouseover", d, i);
                        },
                      },
                      donut: {},
                      legend: {
                        show: true,
                        position: 'right'
                      },
                      tooltip: {
                        format: {
                          value: function () {
                            return '';
                          }
                        }
                      }
                    };
                    this.options.push(options)
                    // console.error(options)
                    // this.eventBus.emit("initChart", options);
                    // console.error('emiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiit')
                  }
                }



              }
            },10)

            // else {
            //   document.getElementById("chart").style.display = "none";
            // }
          })
          .catch((error) => {

            console.error(error);
          })
          .finally(() => {
          });
    },
    DownloadExel() {
      this.restClient
          .getResultInExcel(this.pollingId)
          .then((response) => {
            var raw = window.atob(response)
            // Create an array to store the decoded data
            var uInt8Array = new Uint8Array(raw.length)
            // blob can only receive binary encoding, need to talk about base64 converted to binary and then stuffed
            for (var i = 0; i < raw.length; ++i) {
              uInt8Array[i] = raw.charCodeAt(i)
            }
            // A return value is given here. In other methods, you can get the converted blob by using the base64 encoding.
            const link = document.createElement("a")
            const blob = new Blob([uInt8Array], {
              type: "application/vnd.ms-excel"
            })
            link.target = "_blank"
            link.style.display = "none"
            link.href = URL.createObjectURL(blob)
            // Set the downloaded Excel table name-->
            link.setAttribute("download", `${this.meetingTitle}` + ' ' + `${this.createdAt}`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
          .catch((error) => {
            console.error(error)
          })
          .finally(() => {
          })
    },
    getMonth(num){
      switch (+num){
        case 1:
          this.monthName = 'فروردین'
          break;
        case 2:
          this.monthName = 'اردیبهشت'
          break;
        case 3:
          this.monthName = 'خرداد'
          break;
        case 4:
          this.monthName = 'تیر'
          break;
        case 5:
          this.monthName = 'مرداد'
          break;
        case 6:
          this.monthName = 'شهریور'
          break;
        case 7:
          this.monthName = 'مهر'
          break;
        case 8:
          this.monthName = 'آبان'
          break;
        case 9:
          this.monthName = 'آذر'
          break;
        case 10:
          this.monthName = 'دی'
          break;
        case 11:
          this.monthName = 'بهمن'
          break;
        case 12:
          this.monthName = 'اسفند'
          break;

      }
    },
    getPDF(){
      this.restClient
          .getPDF(this.pollingId)
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
            link.setAttribute("download", `${this.$store.getters.session_name}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }).catch((error)=>{
        console.error(error)
      })
    },

  },
  mounted() {
        // const options = {
    //   data: {
    //     columns: ['123', '100%'],
    //     type: "pie",
    //   },
    // };
    // this.eventBus.emit("initChart", options);
    // let event =  this.eventBus.emit("event-bus");
    // console.error(event)
    this.getResultPolling(this.pollingId)

  }
}
</script>

<style scoped>
.polling-information-container {
  width: 100%;
  //max-width: 144rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  border-radius: 0.8rem;
  padding: 2.4rem 2.4rem 0.8rem 2.4rem;
  background-color: #F6F6F7;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.32);
}

.polling-label-span {
  font-size: 1.2rem;
  font-weight: 400;
  color: #75758F
}

.height-animation-expand {
  width: 100%;
  max-height: 0;
  overflow-y: hidden;
  transition: max-height 0.4s;
}

.polling-chart-fragment {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.6rem;
}
.polling-chart-fragment__ltr {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.6rem;
}
.polling-chart-options {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: calc(100% - 350px);
  max-height: 18rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.seprate-info {
  width: 90%;
  margin: 0 auto;
  border: 0.1rem solid #F6F6F7;
}

.polling-th-table--container {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 0.1rem solid #DCDADA;
  height: 3rem;
}

.polling-th-table--container > span {
  width: 30%;
  color: #75758F;
  font-size: 1.2rem;
  font-weight: 700;
}

.polling-table-display-name {
  width: 20rem;
  display: flex;
  padding: 0.8rem;
  font-size: 1.2rem;
  font-weight: 400;
  gap: 0.8rem;
  align-items: center;
}

.polling-ul--table {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 20rem;
  overflow-y: auto
}

.polling-ul--table > li {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 0.1rem solid #DCDADA;
}
.polling-ul--table > li:last-child {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: none;
}

.polling-table-answer {
  width: calc(100% - 20rem);
  font-size: 1.2rem;
  font-weight: 400;
  padding: 0.8rem 0
}

.users-participated-polling-table-fragment {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.height-animation-collapse {
  width: 94%;
  height: 25rem;
  overflow-y: hidden;
  transition: all 0.4s;
}

.pie-chart {
  width: 300px;
  max-height: 300px;
  position: relative;
  display: flex;
  align-items: flex-start;
}

.direction {
  display: none;
  direction: ltr;

}

.pie-chart-fragment {
  width: 50%;
  height: 18rem;
  display: flex;
  justify-content: space-between;
}

.pie-chart-fragment-ltr {
  width: 50%;
  height: 18rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}

.polling-information-header {
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: row;
  gap: 1.6rem;
  align-items: center;

}

.polling-information-header-ltr {
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;

}

.polling-information-body {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
}

.polling-action-element {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
}

.polling-information-body-question-fragment {
  display: flex;
  width: 100%;
  height: fit-content;
  flex-direction: row;
  justify-content: space-between;
}

.polling-information-body-question-fragment-ltr {
  display: flex;
  width: 100%;
  height: fit-content;
  flex-direction: row-reverse;
  justify-content: space-between;
}

.polling-information-body-question {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  height: fit-content;
}

.polling-information-body-question-descriptive {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: fit-content;
}

.polling-information-body-question-ltr {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  width: 50%;
  height: fit-content;
}

.polling-information-body-question-descriptive-ltr {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: 10rem;
}

.arrow-icon-detail {
  animation-name: rotate;
  animation-duration: 1s;
}

@keyframes rotate {
  from {
    background-color: red;
  }
  to {
    background-color: yellow;
  }
}

.rotation-svg-zero {
  animation: movezerodeggree 0.2s forwards;
}

.rotation-svg-90 {
  animation: move90degree 0.2s forwards;
}

.rotation-svg-zero-ltr {
  animation: movezerodeggreeltr 0.2s forwards;
}

.rotation-svg-90-ltr {
  animation: move90degreeltr 0.2s forwards;
}

::-webkit-scrollbar {
  height: 5px; /* height of horizontal scrollbar ← You're missing this */
  width: 4px; /* width of vertical scrollbar */
  border: 1px solid #d5d5d5;

}

@keyframes movezerodeggree {
  from {
    transform: rotate(90deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes move90degree {
  100% {
    transform: rotate(90deg);
  }
}

@keyframes movezerodeggreeltr {
  from {
    transform: rotate(-90deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes move90degreeltr {
  100% {
    transform: rotate(-90deg);
  }
}

@keyframes expand {
  from {
    height: 0;
  }
  to {
    height: fit-content;
  }
}

@keyframes collapse {
  to {
    height: 0;
  }
}

.table-container--polling {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  margin-top: 0.7rem;
}

.table-container__descriptive {
  width: 100%;
  height: 16rem;
  display: flex;
  flex-direction: column;
  margin-top: 0.7rem;
}

.table__header--polling {
  display: flex;
  flex-direction: row;
  gap: 10rem;
  align-items: center;
  width: 100%;
  height: 3.5rem;
  border-radius: 1.5rem;
  background-color: #00abfc;
}

.header--name__field {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.2rem;
  margin-right: 1rem;
  color: white;
}

.header--name__field-ltr {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.2rem;
  margin-left: 1rem;
  color: white;
}

.header--answer__field-ltr {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.2rem;
  margin-left: 5rem;
  color: white;
}

.ul-container {
  direction: rtl;
  max-height: 15rem;
  overflow-y: auto;
}

.ul-container__desc {
  direction: rtl;
  max-height: 15rem;
  overflow-y: auto;
}

.ul-container__desc ul {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
}

.legend span {
  width: 10rem;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  color: white;
}

.ul-container ul {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
}

.tool-tip-arrow {
  right: 0;
  transform: translateX(-50%) rotate(50deg);
  position: absolute;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 10px solid gray;
  border-bottom-left-radius: 5px;
  white-space: pre;
  bottom: -0.2rem;
}

@media (max-width: 980px) {
  .polling-information-container {
    font-size: 1.2rem;
  }

}

@media (max-width: 768px) {
  .polling-information-container {
    font-size: 1.2rem;
  }

  .polling-information-body-question {
    width: 100%;
  }

  .polling-information-header {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    align-items: flex-start;

  }

  .polling-chart-fragment {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .polling-chart-options {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    width: calc(100%);
    max-height: 200rem;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .polling-ul--table {
    width: 100%;
    display: flex;
    flex-direction: column;
    max-height: 20rem;
    overflow-y: auto
  }
  .polling-table-answer {
    width: calc(100% - 10rem);
    font-size: 1.2rem;
    font-weight: 400;
    padding: 0.8rem 0
  }
  .polling-table-display-name {
    width: 10rem;
    display: flex;
    justify-content: right;
    padding: 0.2rem;
    font-size: 1.2rem;
    font-weight: 400;
    gap: 0.8rem;
    align-items: center;
  }

  .pie-chart {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 680px) {
  .header--answer__field {
    position: relative;
    left: 6rem;
  }

  .height-animation-expand {
    width: 100%;
    height: 25rem;
    overflow-y: hidden;
    animation: expand 0.2s forwards;
  }

  .height-animation-collapse {
    width: 100%;
    overflow-y: hidden;
    animation: collapse 0.2s forwards;
  }

}

@media (max-width: 420px) {
  .polling-information-container {
    font-size: 1.1rem;
  }

}
</style>

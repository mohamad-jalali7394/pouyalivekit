<template>
  <div class="proceedings-information__container" :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
    <section>
      <div style="display: flex;gap: 0.8rem">
        <span class="proceedings-information__key">{{$store.getters.t('minutes-number')}}</span>
        <span style="font-weight: 700;color: #292933">12345</span>
      </div>
      <div style="display: flex;gap: 0.8rem">
        <span class="proceedings-information__key">{{$store.getters.t('creation-time')}}</span>
        <span style="font-weight: 400;color: #292933">6 اسفند 1401، ساعت 12:45</span>
      </div>
      <div style="display: flex;gap: 0.8rem">
        <span class="proceedings-information__key">{{$store.getters.t('answers-number')}}</span>
        <span style="font-weight: 400;color: #292933">{{userRejectProceedings + userConfirmProceedings + ' ' + 'نفر'}}</span>
      </div>
    </section>
    <section style="padding: 0 0 2.5rem 0;">
      <span class="proceedings-information__key">{{$store.getters.t('proceedings') + ':'}}</span>
      <div style="font-weight: 400;color: #292933;display: flex;flex-direction: column;gap: 1rem" >
<!--        <div v-for="(paragraph, index) in proceedingsParagraphs" :key="paragraph.paragraphId" style="padding: 0.8rem;border: 0.1rem solid #DCDADA;border-radius: 0.8rem;display: flex;flex-direction: column;gap: 0.4rem">-->
<!--          <div>-->
<!--            <span style="font-size: 1.2rem;color: #75758F">-->
<!--              {{'بند شماره' + ' ' }}-->
<!--            </span>-->
<!--            <span style="font-size: 1.2rem;color: #75758F">-->
<!--              {{ index + 1}}-->
<!--            </span>-->
<!--            </div>-->
<!--          <span>{{paragraph.paragraphText}}</span>-->
<!--          <span v-if="paragraph.assignedParticipant" style="border-top: 0.1rem solid #DCDADA;width: 100%;height: 0"></span>-->
<!--          <div v-if="paragraph.assignedParticipant"  style="display: flex;gap: 0.8rem;height: 2rem;align-items: center">-->
<!--            <span style="font-size: 1.2rem;color: #75758F">شخص مسئول:</span>-->
<!--            <span>-->
<!--              {{paragraph.assignedParticipant}}-->
<!--            </span>-->
<!--          </div>-->

<!--        </div>-->
        <div class="table-container-proceedings" :style="{width: '94%', direction: $i18n.locale !== 'en' ?  'ltr' : 'rtl'}">

          <table :style="{width: '94%', direction: $i18n.locale !== 'en' ?  'ltr' : 'rtl'}">
            <tbody>
            <tr>
              <th :style="{'background-color': iseExpired ?  '#c9c8c8' : ''}">{{$store.getters.t('presenter')}}</th>
              <th :style="{'background-color': iseExpired ?  '#c9c8c8' : ''}">{{$store.getters.t('clause')}}</th>
            </tr>
            </tbody>
            <tbody>
            <tr  v-for="paragraph in proceedingsParagraphs" :key="paragraph.paragraphId">
              <td>{{paragraph.assignedParticipant}}</td>
              <td style="text-align: center">{{ paragraph.paragraphText }}</td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </section>
    <section style="margin-top: 1rem">
      <div style="width: 100%;max-height:21rem;overflow-y: auto">

        <div class="proceedings-information__answer-list-header" :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
          <span>{{$store.getters.t('name-of-participant')}}</span>
<!--          <span>زمان ورود</span>-->
<!--          <span>زمان حضور</span>-->
          <span>{{$store.getters.t('answer')}}</span>
        </div>
        <div class="proceedings-answer__table" >
          <div v-for="user in resultProceedingsList" :key="user.id" class="proceedings-information__answer-list" :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
            <span>{{user.displayName}}</span>
<!--            <span>null</span>-->
<!--            <span>null</span>-->
            <span v-if="user.agree === true" style="color: #2AB459">{{ $store.getters.t('confirmed') }}</span>
            <span v-else-if="user.agree === false" style="color: red">{{ $store.getters.t('rejected') }}</span>
            <span v-else>{{ $store.getters.t('unresponsive') }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import ParticipantListElement from "./ParticipantListElement";
import RestClient from "@/api/restClient";
import entityTypes from "../statics/entityTypes";


export default {
  name: "ProceedingsInformation",
  props: ['proceedingsId', 'proceedingsNumber', 'proceedingsDescription', 'createDate', 'meetingTitle', 'meetingId','proceedingsParagraphs'],

  data() {
    return {
      isInformationShown: false,
      isCollapsed: false,
      restClient: new RestClient(entityTypes.proceedings),
      proceedingsResultList: [],
      isLoading: false,
      userConfirmProceedings:0,
      userRejectProceedings:0,
      userDoNotAnswerProceedings:0,
      resultProceedingsList:[],
    }
  },
  methods: {
    downloadPdf(data) {
      this.$emit('download-pdf', data)
    },
    openDetailInformation() {
      if (!this.isLoading)
        this.isInformationShown = !this.isInformationShown
    },
    getMeetingMinutesSignResult(){
      this.restClient.getMeetingMinutesSignResult(this.proceedingsId, this.meetingId).then((response) =>{
        for(let i=0; i<response.length - 1; i++){
          if (response[i].agree === true){
            this.userConfirmProceedings++
          }else if (response[i].agree === false){
            this.userRejectProceedings++
          }else {
            this.userDoNotAnswerProceedings++
          }
        }


        this.resultProceedingsList = response
      })
          .catch((error) =>{
            console.error(error)
          })
    },
    clickTosShowMoreProceedings() {
      this.$emit('show-more-proceedings')
    },

  },
  mounted() {

    this.getMeetingMinutesSignResult()
    // this.getResultProceedings(this.proceedingsId)
  }
}
</script>

<style scoped>
.proceedings-information__container {
  width: 100%;
  max-width: 144rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.proceedings-information__container > section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border-bottom: 0.1rem solid #DCDADA;
  padding: 0 0 1rem 0;
  font-weight: 700;
  font-size: 1.4rem;
}
.proceedings-information__container > section:last-child {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border-bottom:none;

}
.proceedings-information__answer-list-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  direction: rtl;
  color: #75758F;
  font-size: 1.2rem;
  font-weight: 700;
  height: 4.4rem;
  border-bottom: 0.1rem solid #DCDADA;
  align-items: center;
}

.proceedings-information__answer-list-header > span {
  width: 23%;
}

.proceedings-information__answer-list-header > span:first-child {
  width: 30%;
}

.proceedings-information__answer-list {
  width: 100%;
  display: flex;
  justify-content: space-between;
  direction: rtl;
  color: #292933;
  font-size: 1.2rem;
  font-weight: 400;
  height: 4.4rem;
  border-bottom: 0.1rem solid #DCDADA;
  align-items: center;

}

.proceedings-information__answer-list > span {
  width: 23%;
}

.proceedings-information__answer-list > span:first-child {
  width: 30%;
}

.proceedings-information__key {
  font-size: 1.2rem;
  font-weight: 400;
  color: #75758F;
}
.table-container-proceedings{
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: right;
    max-height:40rem;
    overflow-y: auto;
    margin-bottom: 2rem;
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
}
th:nth-child(1) {
  color: #292933;
  width: 30%;
}
th:nth-child(2) {
  color: #292933;
  width: 70%;
}
tr {
  max-width: 100%;
  height: 3rem !important;
}
</style>

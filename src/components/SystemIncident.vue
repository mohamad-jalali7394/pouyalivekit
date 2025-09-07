<template>
  <div class="system-incident-management__container">
    <div class="system-incident-management__header" :style="{flexDirection: $i18n.locale === 'fa' ? 'row-reverse' : 'row'}">
      <h1> {{ $store.getters.t('system-events') }} </h1>

    </div>
    <div class="system-incident-choose-time__container" :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row' }">
      <div class="system-incident-choose-time-items">


        <span :style="{width: $i18n.locale !== 'en' ? 'unset' : '100%' }">{{ $store.getters.t('start-time') }} </span>
        <input
            type="text"
            id="system-incident-start-time-input"
            v-model="fromSchdInput"
            :style="{'background-color':fromSchd ? 'white': '#F2F2F2','border': fromSchd ? '0.1rem solid #DCDADA':'0.1rem solid transparent' }"
        />
        <persian-date-picker
            color="#1B76FF"
            max="1410/08/01 08:00"
            v-model="fromSchd"
            type="datetime"
            custom-input="#system-incident-start-time-input"
        >
        </persian-date-picker>
      </div>

      <div class="system-incident-choose-time-items">
        <span :style="{width: $i18n.locale !== 'en' ? 'unset' : '100%' }">{{ $store.getters.t('end-time') }} </span>
        <input
            type="text"
            v-model="toSchdInput"
            id="system-incident-end-time-input-"
            :style="{'background-color':toSchd ? 'white': '#F2F2F2','border': toSchd ? '0.1rem solid #DCDADA':'0.1rem solid transparent' }"

        />
        <persian-date-picker
            color="#1B76FF"
            v-model="toSchd"
            type="datetime"
            custom-input="#system-incident-end-time-input-"
        >
        </persian-date-picker>

      </div>

    </div>

    <div class="system-incident-Info__container" :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row' }">
      <base-form-input
          v-for="info in systemIncidentInfo"
          :key="info.id"
          :type="info.type"
          :id="info.id"
          :ref="info.id"
          :label="info.label"
          :is-authentication-code="false"
          :validation-type="info.validationType"
          :is-login-form="false"
          v-model="info.inputVal"
      >
      </base-form-input>
      <base-button
          :is-active="true"
          :button-inner-txt="$store.getters.t('search')"
          :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
          :style-types="['button--small']"
          @click="getAllIncidents"

      >
      </base-button>
    </div>

    <div class="system-incident-table__container">
      <div ref="table-th" class="system-incident-table__th" :style="{flexDirection: $i18n.locale !== 'en' ? 'row' : 'row-reverse' , width: $i18n.locale !== 'en' ? '100%' : '97%' }">
        <span v-for="el in incidentListTh" :key="el" :style="{justifyContent: $i18n.locale !== 'en' ? 'unset' : 'space-around' }">{{ el }}</span>
      </div>
      <div style="overflow-x: auto">
        <ul class="system-incident-table__Ul">
          <li class="group-table__list" v-for="incident in incidents" :key="incident.meetingId" :style="{flexDirection: $i18n.locale !== 'en' ? 'row' : 'row-reverse' }">
            <div :style="{textAlign: $i18n.locale !== 'en' ? 'right' : 'center' }"><span class="system-incident-info">{{ incident.username }}</span></div>
            <div :style="{textAlign: $i18n.locale !== 'en' ? 'right' : 'center' }"><span class="system-incident-info">{{ incident.title }}</span></div>
            <div :style="{textAlign: $i18n.locale !== 'en' ? 'right' : 'center' }"><span class="system-incident-info">{{ incident.deviceIp }}</span></div>
            <div :style="{textAlign: $i18n.locale !== 'en' ? 'right' : 'center' }"><span class="system-incident-info">{{ incident.customerName }}</span></div>
            <div :style="{textAlign: $i18n.locale !== 'en' ? 'right' : 'center' }"><span class="system-incident-info">{{ incident.timestamp }}</span></div>

          </li>
        </ul>
      </div>

    </div>

    <base-modal :open="isLoading" :is-loading="'isLoading'" is-blur="true" modal-color="transparent">
      <template #modal-body>
        <base-loading-spinner size-ratio="1.2" spinner-color="#409EFF">
          <template #loading-content>
            <div class="loading__extra-content--text" style="color: #409EFF">{{ $store.getters.t("pleaseWait") }}</div>
          </template>
        </base-loading-spinner>
      </template>
    </base-modal>

    <div class="system-incident-management__change-page" v-if="incidents.length > 0">
      <div>
        {{ this.$store.getters.t("pagination-count", {pageCount: pageCount, currentPage: currentPage}) }}
      </div>
      <div style="width: 40%;height: 70%;display: flex;flex-direction: row;align-items: center;justify-content: center">
<!--        <div class="pre-button-pagination" :style="{opacity:isPreButtonActive ? '1' : '0.4' }">-->
<!--          <svg style="width: 16px;height: 16px" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--               xmlns="http://www.w3.org/2000/svg">-->
<!--            <path-->
<!--                d="M7.51348 11.3L13.1135 5.60005C13.5135 5.20005 14.1135 5.20005 14.5135 5.60005C14.9135 6.00005 14.9135 6.60005 14.5135 7.00005L9.61348 11.9L14.5135 16.8C14.7135 17 14.8135 17.2 14.8135 17.5C14.8135 18.1 14.4135 18.5 13.8135 18.5C13.5135 18.5 13.3135 18.4 13.1135 18.2L7.41348 12.5C7.11348 12.3 7.11348 11.7 7.51348 11.3Z"-->
<!--                fill="black"/>-->
<!--          </svg>-->
<!--          <span>{{ $store.getters.t('previous') }}</span>-->
<!--        </div>-->
        <the-pagination :items-length="incidentsLength" :items-per-page="10" :current-page="currentPage" @change-page="changePage" />
<!--        <paginate-->
<!--            :page-count="pageCount"-->
<!--            :page-range="4"-->
<!--            :click-handler="paginationCallback"-->
<!--            :prev-text="'.............'"-->
<!--            :next-text="'.............'"-->
<!--            :container-class="'pagination-container'"-->
<!--            :page-class="'pagination-list'"-->
<!--            :page-link-class="'page-link-class'"-->
<!--            :prev-link-class:="'prev-link-pagination'"-->
<!--            :break-view-link-class="'break-view-pagination'"-->
<!--            :active-class="'active-classs'"-->
<!--            :disabled-class="'disabled-pagination'"-->
<!--            :prev-class="'prev-list-pagination'"-->
<!--            :next-class="'next-class-pagination'"-->

<!--        >-->
<!--          <template #breakViewContent>-->
<!--            <svg width="16" height="4" viewBox="0 0 16 4">-->
<!--              <circle fill="#292933" cx="2" cy="2" r="2"/>-->
<!--              <circle fill="#292933" cx="8" cy="2" r="2"/>-->
<!--              <circle fill="#292933" cx="14" cy="2" r="2"/>-->
<!--            </svg>-->
<!--          </template>-->
<!--        </paginate>-->
<!--        <div class="next-button-pagination" :style="{opacity:isNextButtonActive ? '1' : '0.4' }">-->
<!--        <span>-->
<!--          {{ $store.getters.t('next') }}-->
<!--        </span>-->
<!--          <svg style="width: 16px;height: 16px" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--               xmlns="http://www.w3.org/2000/svg">-->
<!--            <path-->
<!--                d="M14.5002 12.5L8.9002 18.2C8.5002 18.6 7.9002 18.6 7.5002 18.2C7.1002 17.8 7.1002 17.2 7.5002 16.8L12.4002 11.9L7.5002 7C7.3002 6.8 7.2002 6.6 7.2002 6.3C7.2002 5.7 7.6002 5.3 8.2002 5.3C8.5002 5.3 8.7002 5.4 8.9002 5.6L14.6002 11.3C14.9002 11.5 14.9002 12.1 14.5002 12.5Z"-->
<!--                fill="black"/>-->
<!--          </svg>-->
<!--        </div>-->


      </div>
      <div class="system-incident-management__length">
        <span>{{ incidentsLength }}</span>
        <span>{{ $store.getters.t('event') }}</span>
      </div>
    </div>
    <div class="no-info__group-management" v-if=" incidents.length === 0">
      <h1>
        {{ $store.getters.t('no-information') }}
      </h1>

    </div>
  </div>

</template>

<script>
import BaseLoadingSpinner from "./UI/BaseLoadingSpinner";
import BaseButton from "./UI/BaseButton";
import RestClient from "@/api/restClient";
import BaseModal from "./UI/BaseModal";
import PersianDatePicker from "vue3-persian-datetime-picker";
import BaseFormInput from "./UI/BaseFormInput";
import GenericClient from "@/api/restClient/genericClient";
import ThePagination from "@/components/ThePagination.vue";

const genericClient = new GenericClient()
export default {
  name: "SystemIncident",
  components: {ThePagination, BaseModal, BaseButton, BaseLoadingSpinner, PersianDatePicker, BaseFormInput},
  props: ['sideBarSubItem'],
  data() {
    return {
      fromSchd: genericClient.convertMonthMines(
          new Date(),
          'jYYYY/jM/jD HH:mm'
      ),
      toSchd: genericClient.convertDateWithZeroTime(
          new Date(),
          'jYYYY/jM/jD HH:mm'
      ),
      restClientLog: new RestClient('log'),
      tableMaxHeight: '',
      isCreateGroupOpen: false,
      groupName: '',
      systemIncidentInfo: [
        {
          label:": " + this.$store.getters.t('user')  ,
          type: "text",
          validationType: '',
          id: "name",
          inputVal: '',
          isValid: false,
        },
        {
          label:": " + this.$store.getters.t('title'),
          type: "text",
          validationType: '',
          id: "title",
          inputVal: "",
          isValid: false,
        },
        {
          label:": " + "IP",
          type: "text",
          validationType: '',
          id: "IP",
          inputVal: "",
          isValid: false,
        }, {
          label:": " + this.$store.getters.t('tenant'),
          type: "text",
          validationType: '',
          id: "tenant",
          inputVal: "",
          isValid: false,
        },
      ],
      incidentListTh: [this.$store.getters.t('user'), this.$store.getters.t('title'), 'IP', this.$store.getters.t('tenant'), this.$store.getters.t('time')],
      incidents: [],
      timer: null,
      currentPage: 1,
      pageCount: 1,
      isNextButtonActive: true,
      isPreButtonActive: false,
      isGroupFound: false,
      isLoading: false,
      pageNumber: 1,
      pageSize: 10,
      groupLength: 0,
      isDeleteGroupOpen: false,
      groupId: null,
      firstName: null,
      lastName: null,
      isUpdateGroup: false,
      nameOfGroup: false,
      meetingsLength: '',
      customerId: '',
      incidentsLength:0
    }
  },
  watch: {
    sideBarSubItem() {
      this.fromSchd = genericClient.convertDateWithZeroTime(
          new Date(),
          'jYYYY/jM/jD HH:mm'
      ),
          this.toSchd = genericClient.convertDatePlus(
              new Date(),
              'jYYYY/jM/jD HH:mm'
          )
    },
    fromSchd() {
      this.getAllIncidents()
    },
    toSchd() {
      this.getAllIncidents()
    },

    currentPage: {
      immediate: true,
      handler(val) {
        if (val === 1 && this.pageCount > 1) {
          this.isPreButtonActive = false
          this.isNextButtonActive = true
        } else if (val === 1 && this.pageCount === 1) {
          this.isPreButtonActive = false
          this.isNextButtonActive = false
        } else if (val === this.pageCount && this.pageCount > 1) {
          this.isPreButtonActive = true
          this.isNextButtonActive = false
        } else if (val === this.pageCount && this.pageCount === 1) {
          this.isPreButtonActive = false
          this.isNextButtonActive = false
        } else {
          this.isPreButtonActive = true
          this.isNextButtonActive = true
        }
      }

    }
  },
  computed: {
    fromSchdInput() {
      return this.fromSchd.split(' ')[0]
    },
    toSchdInput() {
      return this.toSchd.split(' ')[0]
    },
    // showedIncidents() {
    //   const startIndex = ((this.currentPage - 1) * 10)
    //   if (this.incidents.length - startIndex > 10) {
    //     console.error(this.incidents.slice(startIndex, startIndex + 10))
    //     return this.incidents.slice(startIndex, startIndex + 10)
    //   } else {
    //     return this.incidents.slice(startIndex, this.incidents.length)
    //   }
    //
    // }
  },
  methods: {
    changePage(page) {
      this.currentPage = page
      this.pageNumber = page
      this.getAllIncidents()
    },
    getAllIncidents() {
      this.isLoading = true
      this.restClientLog
          .search(
              this.systemIncidentInfo[0].inputVal,
              this.pageNumber - 1,
              this.pageSize,
              this.systemIncidentInfo[1].inputVal,
              this.systemIncidentInfo[2].inputVal,
              this.fromSchd,
              this.toSchd,
              this.systemIncidentInfo[3].inputVal
          )
          .then((response) => {
            // this.pageCount = response.data.pageNumber
            console.log(response.data.logs)
            this.incidents = response.data.logs
            this.incidentsLength = response.data.totalElement
            this.pageCount = Math.ceil((response.data.totalElement) / 10)
            // if (this.urlType === entityTypes.log) {
            //   this.list = response.logs
            //   this.total = response.totalElement
            // } else {
            //   this.list = response.userDtoList
            //   this.total = response.totalElement
            // }

            this.isLoading = false
          })
          .catch((error) => {
            console.error(error)
            this.list = []
            this.total = 0
            this.isLoading = false
          })
    }
  },
  created() {
    this.getAllIncidents()
  },
  mounted() {

    // setTimeout(() => {
    //   this.pageCount = Math.ceil(this.groupsLength / 10)
    // }, 1000)
    this.tableMaxHeight = window.innerHeight - this.$refs['table-th'].getBoundingClientRect().bottom - 100 + 'px'
    window.addEventListener("resize", () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.$refs.camera) {
          this.tableMaxHeight = window.innerHeight - this.$refs['table-th'].getBoundingClientRect().bottom - 100 + 'px'
        }

      }, 80);
    });
  }
}
</script>

<style scoped>
.system-incident-management__container {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
  max-height: calc(100vh - 9rem);
  overflow-y: auto;
}

/*::-webkit-scrollbar {*/
/*  width: 3px;*/


/*}*/

/*::-webkit-scrollbar-track {*/
/*  background: transparent;*/


/*}*/

/*::-webkit-scrollbar-thumb {*/
/*  background: rgb(170, 168, 168);*/
/*  border-radius: 12px;*/


/*}*/

/*::-webkit-scrollbar-track-piece {*/
/*  height: 4px;*/

/*}*/
.system-incident-management__header {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.6rem 1.6rem;
  border-bottom: 0.1rem solid #DCDADA;
}

.system-incident-management__header > h1 {
  font-size: 2.5rem;
}

.system-incident-download-actions {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  height: fit-content;
  width: 100%;
  padding: 1.6rem 1.6rem;
  border-bottom: 0.1rem solid #DCDADA;
  align-items: flex-end;
}


.group-management-input__search {
  width: 100%;
  background-color: #F6F6F7;
  font-size: 1.3rem;
  height: 3.4rem;
  font-weight: 400;
  -webkit-appearance: none;
  border-radius: 0.8rem;
  border: 0.1rem solid #eaeaea;
  direction: rtl;
  padding: 0 0.8rem;
}

.group-management-input__search:focus {
  outline: 0;
  background-color: transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}

.system-incident-table__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  direction: rtl;

}

.system-incident-table__th {
  width: 100%;
  min-width: 60rem;
  display: flex;
  align-items: center;
  padding: 1.6rem;
}

.system-incident-table__th > span {
  width: 20%;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
}


.system-incident-table__Ul {
  width: 100%;
  min-width: 60rem;
  display: flex;
  flex-direction: column;
  direction: rtl;
  padding: 0;
  margin: 0;
}

.group-table__list {
  width: 100%;
  display: flex;
  padding: 1.6rem;
}

.group-table__list:nth-child(odd) {
  background-color: #F6F6F7;
}

.group-table__list > div {
  width: 20%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}

.system-incident-info {
  display: block;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  direction: rtl;
  font-size: 1.4rem;
  font-weight: 400;
}


.group-table__list > div > input {
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
}

.pre-button-pagination {
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  align-items: center;
  position: relative;
  right: -5rem;
  z-index: -1
}

.pre-button-pagination > span {
  font-weight: 400;
  font-size: 1.2rem
}

.next-button-pagination {
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  align-items: center;
  position: relative;
  left: -5rem;
  z-index: -1
}

.next-button-pagination > span {
  font-weight: 400;
  font-size: 1.2rem
}

.no-info__group-management {
  width: 100%;
  height: 8rem;
  display: flex;
  justify-content: center;
  align-items: center
}

.system-incident-management__change-page {
  width: 100%;
  height: 6.5rem;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
  padding: 0 1.6rem;
}

.system-incident-management__change-page > div:first-child {
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  color: #75758F
}


.delete-group-modal-header {
  width: 40rem;
  height: 5rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.1rem solid #DCDADA;
}

.delete-group-modal-body {
  width: 40rem;
  height: 5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 0.1rem solid #DCDADA;
  font-size: 1.6rem;
  font-weight: 400;
  justify-content: flex-start;
  gap: 0.6rem;
}

.delete-group-modal-action {
  width: 40rem;
  height: 5rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
}

.system-incident-choose-time__container {
  display: flex;
  gap: 1.6rem;
  width: 100%;
  padding: 1.6rem 1.6rem;
  align-items: center;
  border-bottom: 0.1rem solid #DCDADA;
}

.system-incident-choose-time-items {
  width: 45%;
  max-width: 55rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: flex-end;
}

.system-incident-Info__container {
  display: flex;
  flex-wrap: wrap;
  row-gap: 1.6rem;
  column-gap: 1.6rem;
  height: fit-content;
  width: 100%;
  padding: 1.6rem 1.6rem;
  border-bottom: 0.1rem solid #DCDADA;
  align-items: flex-end;
}

#system-incident-start-time-input {
  width: 100%;
  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
  background-color: #F2F2F2;
}


#system-incident-start-time-input:focus {
  outline: none;
}

#system-incident-end-time-input- {
  width: 100%;
  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
  background-color: #F2F2F2;
}


#system-incident-end-time-input-:focus {
  outline: none;
}

.system-incident-management__length {
  display: flex;
  flex-direction: row-reverse;
  gap: 0.2rem;
  align-items: center;
  font-size: 1.4rem
}

@media (max-width: 800px) {

}

@media (max-width: 630px) {
  .system-incident-management__header > h1 {
    font-size: 2.5rem;
  }


  .system-incident-choose-time__container {
    display: flex;
    flex-wrap: wrap;
    gap: 1.6rem;
    width: 100%;
    padding: 1.6rem 1.6rem;
    align-items: center;
    border-bottom: 0.1rem solid #DCDADA;
  }

  .system-incident-choose-time-items {
    width: 70%;
    max-width: 55rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    align-items: flex-end;
  }

  .system-incident-management__change-page {

    justify-content: center;

  }

  .system-incident-management__change-page > div:first-child {
    display: none;
  }
  .system-incident-management__length {
    display: none;
  }
}
</style>
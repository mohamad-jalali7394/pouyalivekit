<template>
  <div class="report-management__container">
    <div class="report-management__header" :style="{flexDirection: $i18n.locale === 'fa' ? 'row-reverse' : 'row'}">
      <h1>{{ $store.getters.t('meeting-report') }}</h1>

    </div>
    <div class="report-download-actions" :style="{ flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row' }">
      <div class="report-choose-time__container" :style="{ justifyContent: $i18n.locale !== 'en' ? 'unset' : 'flex-end' }">
        <div class="report-choose-time-items">


          <span :style="{ width: $i18n.locale !== 'en' ? 'unset' : '100%' }">{{ $store.getters.t('start-time') }} </span>
          <input
              type="text"
              id="report-start-time-input"
              v-model="fromSchdInput"
              :style="{'background-color':fromSchd ? 'white': '#F2F2F2','border': fromSchd ? '0.1rem solid #DCDADA':'0.1rem solid transparent' }"
          />
          <persian-date-picker
              color="#1B76FF"
              max="1410/08/01 08:00"
              v-model="fromSchd"
              type="datetime"
              custom-input="#report-start-time-input"
          >
          </persian-date-picker>
        </div>

        <div class="report-choose-time-items">
          <span :style="{ width: $i18n.locale !== 'en' ? 'unset' : '100%' }">{{ $store.getters.t('end-time') }}</span>
          <input
              type="text"
              v-model="toSchdInput"
              id="report-end-time-input-"
              :style="{'background-color':toSchd ? 'white': '#F2F2F2','border': toSchd ? '0.1rem solid #DCDADA':'0.1rem solid transparent' }"

          />
          <persian-date-picker
              color="#1B76FF"
              v-model="toSchd"
              type="datetime"
              custom-input="#report-end-time-input-"
          >
          </persian-date-picker>

        </div>

      </div>

      <base-button
          :is-active="true"
          :button-inner-txt="$store.getters.t('download-the-report')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
          :style-types="['large--button']"
          @click="getAllreportsInExcel"
      >
        <template #pre-button-slot>
          <svg style="width: 16px; height: 16px;cursor: pointer" width="18" height="20" viewBox="0 0 18 20" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.29 11.29C5.19627 11.383 5.12188 11.4936 5.07111 11.6154C5.02034 11.7373 4.9942 11.868 4.9942 12C4.9942 12.132 5.02034 12.2627 5.07111 12.3846C5.12188 12.5064 5.19627 12.617 5.29 12.71L8.29 15.71C8.38296 15.8037 8.49356 15.8781 8.61542 15.9289C8.73728 15.9797 8.86799 16.0058 9 16.0058C9.13201 16.0058 9.26272 15.9797 9.38458 15.9289C9.50644 15.8781 9.61704 15.8037 9.71 15.71L12.71 12.71C12.8983 12.5217 13.0041 12.2663 13.0041 12C13.0041 11.7337 12.8983 11.4783 12.71 11.29C12.5217 11.1017 12.2663 10.9959 12 10.9959C11.7337 10.9959 11.4783 11.1017 11.29 11.29L10 12.59V1C10 0.734784 9.89464 0.48043 9.70711 0.292893C9.51957 0.105357 9.26522 0 9 0C8.73478 0 8.48043 0.105357 8.29289 0.292893C8.10536 0.48043 8 0.734784 8 1V12.59L6.71 11.29C6.61704 11.1963 6.50644 11.1219 6.38458 11.0711C6.26272 11.0203 6.13201 10.9942 6 10.9942C5.86799 10.9942 5.73728 11.0203 5.61542 11.0711C5.49356 11.1219 5.38296 11.1963 5.29 11.29ZM15 7H13C12.7348 7 12.4804 7.10536 12.2929 7.29289C12.1054 7.48043 12 7.73478 12 8C12 8.26522 12.1054 8.51957 12.2929 8.70711C12.4804 8.89464 12.7348 9 13 9H15C15.2652 9 15.5196 9.10536 15.7071 9.29289C15.8946 9.48043 16 9.73478 16 10V17C16 17.2652 15.8946 17.5196 15.7071 17.7071C15.5196 17.8946 15.2652 18 15 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V10C2 9.73478 2.10536 9.48043 2.29289 9.29289C2.48043 9.10536 2.73478 9 3 9H5C5.26522 9 5.51957 8.89464 5.70711 8.70711C5.89464 8.51957 6 8.26522 6 8C6 7.73478 5.89464 7.48043 5.70711 7.29289C5.51957 7.10536 5.26522 7 5 7H3C2.20435 7 1.44129 7.31607 0.87868 7.87868C0.316071 8.44129 0 9.20435 0 10V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H15C15.7956 20 16.5587 19.6839 17.1213 19.1213C17.6839 18.5587 18 17.7956 18 17V10C18 9.20435 17.6839 8.44129 17.1213 7.87868C16.5587 7.31607 15.7956 7 15 7Z"
                fill="white"/>
          </svg>

        </template>
      </base-button>
    </div>
    <div class="report-table__container">
      <div ref="table-th" class="report-table__th" :style="{flexDirection : $i18n.locale !== 'en' ? 'row' : 'row-reverse'}">
        <span v-for="el in reportListTh" :key="el" :style="{textAlign : $i18n.locale !== 'en' ? 'right' : 'center'}">{{ el }}</span>
      </div>
      <ul class="report-table__Ul">
        <li class="group-table__list" v-for="report in reports" :key="report.meetingId" :style="{flexDirection : $i18n.locale !== 'en' ? 'row' : 'row-reverse'}">
          <div :style="{textAlign : $i18n.locale !== 'en' ? 'right' : '-webkit-center'}"><span class="report-info">{{ report.meetingName }}</span></div>
          <div :style="{textAlign : $i18n.locale !== 'en' ? 'right' : '-webkit-center'}"><span class="report-info">{{ report.roomName }}</span></div>s
          <div :style="{textAlign : $i18n.locale !== 'en' ? 'right' : '-webkit-center'}"><span class="report-info">{{ report.vr }}</span></div>
          <div :style="{textAlign : $i18n.locale !== 'en' ? 'right' : '-webkit-center'}"><span class="report-info">{{ report.invitedLength }}</span></div>
          <div :style="{textAlign : $i18n.locale !== 'en' ? 'right' : '-webkit-center'}"><span class="report-info">{{ report.fromSch }}</span></div>
          <div :style="{textAlign : $i18n.locale !== 'en' ? 'right' : '-webkit-center'}"><span class="report-info">{{ report.toSch }}</span></div>

          <div :style="{justifyContent : $i18n.locale !== 'en' ? 'flex-start' : 'flex-start'}">
            <img draggable="false" src="/img/report.svg" style="cursor: pointer" alt="not loaded"
                 @click="getAllReportInExcelById(report.meetingId)">
          </div>
        </li>
      </ul>
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

    <div class="report-management__change-page" v-if="reports.length > 0">
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
        <the-pagination :items-length="meetingsLength" :items-per-page="10" :current-page="currentPage"  @change-page="changePage" />
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
      <div class="report-management__meeting-length" :style=" {flexDirection: $i18n.locale !== 'en' ? 'unset' : 'row'} ">
        <span>{{ $store.getters.t('total-number-of-meetings') }}</span>
        <span> {{ meetingsLength }} </span>
      </div>
    </div>
    <div class="no-info__group-management" v-if=" reports.length === 0">
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
import GenericClient from "@/api/restClient/genericClient";
import ThePagination from "@/components/ThePagination.vue";

const genericClient = new GenericClient()
export default {
  name: "ReportManagement",
  components: {ThePagination, BaseModal, BaseButton, BaseLoadingSpinner, PersianDatePicker},
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
      restClientReport: new RestClient('report'),
      tableMaxHeight: '',
      isCreateGroupOpen: false,
      groupName: '',
      reportListTh: [this.$store.getters.t('meeting-title'), this.$store.getters.t('roomName'), 'VR', this.$store.getters.t('number-of-participant'), this.$store.getters.t('start-time'), this.$store.getters.t('end-time'), this.$store.getters.t('action')],
      reports: [],
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
      this.searchMeeting()
    },
    toSchd() {
      this.searchMeeting()
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
  },
  methods: {
    changePage(page) {
      this.currentPage = page
      this.pageNumber = page
      this.searchMeeting()
    },

    searchMeeting() {
      this.isLoading = true
      this.isUserFound = false
      this.restClientReport.search(this.pageNumber - 1, this.pageSize, this.fromSchd, this.toSchd)
          .then((response) => {
            this.pageCount = response.data.totalPage
            this.meetingsLength = response.data.totalFundedMeeting
            this.reports = response.data.reportMeetings
            this.isLoading = false
          })
          .catch((error) => {
            this.isLoading = false
            this.isUserFound = false
            console.error(error)
          });
    },
    getAllreportsInExcel() {
      this.restClientReport.exportReport(this.fromSchd, this.toSchd)
          .then((response) => {
            // Decode base64 using atob method
            var raw = window.atob(response.data.data)
            // Create an array to store the decoded data
            var uInt8Array = new Uint8Array(raw.length)
            // blob can only receive binary encoding, need to talk about base64 converted to binary and then stuffed
            for (var i = 0; i < raw.length; ++i) {
              uInt8Array[i] = raw.charCodeAt(i)
            }
            // A return value is given here. In other methods, you can get the converted blob by using the base64 encoding.
            const link = document.createElement('a')
            const blob = new Blob([uInt8Array], {type: 'application/vnd.ms-excel'})
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            // Set the downloaded Excel table name
            link.setAttribute('download', 'گزارش جلسات')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
          .catch((error) => {
            console.error(error)
          })
    },
    getAllReportInExcelById(id) {
      this.restClientReport
          .exportReportById(id)
          .then((response) => {
            // Decode base64 using atob method
            var raw = window.atob(response.data.data)
            // Create an array to store the decoded data
            var uInt8Array = new Uint8Array(raw.length)
            // blob can only receive binary encoding, need to talk about base64 converted to binary and then stuffed
            for (var i = 0; i < raw.length; ++i) {
              uInt8Array[i] = raw.charCodeAt(i)
            }
            // A return value is given here. In other methods, you can get the converted blob by using the base64 encoding.
            const link = document.createElement('a')
            const blob = new Blob([uInt8Array], {type: 'application/vnd.ms-excel'})
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            // Set the downloaded Excel table name
            link.setAttribute('download', 'گزارش جلسات')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
          .catch((error) => {
            console.error(error)
          })
    }
  },
  created() {
    this.searchMeeting()
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
.report-management__container {
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
.report-management__header {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.6rem 1.6rem;
  border-bottom: 0.1rem solid #DCDADA;
}

.report-management__header > h1 {
  font-size: 2.5rem;
}

.report-download-actions {
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

.report-table__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  direction: rtl;
}

.report-table__th {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1.6rem;
  min-width: 60rem;
}

.report-table__th > span {
  width: 15%;
  font-size: 1.4rem;
  font-weight: 700;
}

.report-table__th > span:last-child {
  width: 10%;
  min-width: 6rem;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-start;
  position: relative;
}

.report-table__Ul {
  width: 100%;
  min-width: 60rem;
  display: flex;
  flex-direction: column;
  direction: rtl;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}

.group-table__list {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 1.6rem;
}

.group-table__list:nth-child(odd) {
  background-color: #F6F6F7;
}

.group-table__list > div {
  width: 15%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}

.report-info {
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

.group-table__list > div:last-child {
  width: 10%;
  min-width: 6rem;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-end;
  position: relative;

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

.report-management__change-page {
  width: 100%;
  height: 6.5rem;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
  padding: 0 1.6rem;
}

.report-management__change-page > div:first-child {
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

.report-choose-time__container {
  display: flex;
  flex-direction: row-reverse;
  gap: 1.6rem;
  height: 5rem;
  width: 70%;
  align-items: center;
}

.report-choose-time-items {
  width: 45%;
  max-width: 55rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: flex-end;
}

#report-start-time-input {
  width: 100%;
  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
  background-color: #F2F2F2;
}


#report-start-time-input:focus {
  outline: none;
}

#report-end-time-input- {
  width: 100%;
  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
  background-color: #F2F2F2;
}


#report-end-time-input-:focus {
  outline: none;
}

.report-management__meeting-length {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  font-size: 1.4rem
}

@media (max-width: 800px) {
  .report-download-actions {
    display: flex;
    flex-wrap: wrap;
    height: fit-content;
    width: 100%;
    gap: 1.6rem;
    border-bottom: 0.1rem solid #DCDADA;
    align-items: flex-end;
  }

  .report-choose-time__container {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    gap: 1.6rem;
    height: 5rem;
    align-items: center;
  }
}

@media (max-width: 630px) {
  .report-management__header > h1 {
    font-size: 2.5rem;
  }

  .report-download-actions {
    display: flex;
    flex-wrap: wrap;
    height: fit-content;
    width: 100%;
    padding: 1.6rem 1.6rem;
    border-bottom: 0.1rem solid #DCDADA;
    align-items: flex-end;
    gap: 1.6rem;
  }

  .report-management__change-page {
    width: 100%;
    height: 6.5rem;
    display: flex;
    justify-content: center;
    flex-direction: row-reverse;
    align-items: center;
    padding: 0 1.6rem;
  }

  .report-management__change-page > div:first-child {
    display: none;
  }
  .report-management__meeting-length {
    display: none;
    flex-direction: row-reverse;
    gap: 0.8rem;
    align-items: center;
    font-size: 1.4rem
  }

}
</style>
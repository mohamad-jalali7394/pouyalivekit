<template>
  <div class="active-directory-management__container">
    <div class="active-directory-management__header" :style="{flexDirection: $i18n.locale === 'fa' ? 'row-reverse' : 'row'}">
      <h1> {{$store.getters.t('active-directory-management')}} </h1>
      <base-button
          :is-active="true"
          :button-inner-txt="$store.getters.t('update-all')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
          :style-types="['large--button']"

      >
        <template #pre-button-slot>
          <img draggable="false" src="/img/upgrade.svg">
        </template>
      </base-button>
    </div>
    <div style="  width: 100%;display: flex;flex-direction: column;overflow-x: auto;direction: rtl">
      <div class="active-directory-table__container">
        <div ref="table-th" class="active-directory-table__th" :style="{flexDirection: $i18n.locale === 'fa' ? 'row' : 'row-reverse'}">
          <span v-for="el in activeDirectoryListTh" :key="el" :style="{textAlign: $i18n.locale === 'fa' ? 'right' : 'center'}">{{ el }}</span>
        </div>
        <ul class="active-directory-table__Ul" :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}">
          <li class="active-directory-table__list" v-for="ldap in ldapList" :key="ldap.id" :style="{textAlign: $i18n.locale === 'fa' ? 'right' : 'center'}">
            <div><span class="active-directory-info">{{ldap.url}}</span></div>
            <div><span class="active-directory-info">{{ldap.base}}</span></div>
            <div><span class="active-directory-info">{{ldap.groupName }}</span></div>
            <div><span class="active-directory-info">{{ldap.userDn}}</span></div>
            <div><span class="active-directory-info">{{ldap.tenant}}</span></div>
            <div style="display: flex;flex-direction: row;gap: 1.2rem;font-size: 1.1rem ; justify-content: center">
              <div style="width: 4.4rem;display: flex;flex-direction: column;align-items: center;justify-content: center;gap: 0.8rem">
                <img draggable="false"  src="/img/problemtext.svg" style="cursor: pointer" alt="not loaded" :style="{cursor: isSending ? 'not-allowed' : 'pointer'}" @click="getLdapSyncError(ldap.id)">
                <span>{{$store.getters.t('problems')}}</span>
              </div>
              <div style="width: 4.4rem;display: flex;flex-direction: column;align-items: center;justify-content: center;gap: 0.8rem">
                <img draggable="false" src="/img/upgradetext.svg" style="cursor: pointer" alt="not loaded" :style="{cursor: isSending ? 'not-allowed' : 'pointer'}" @click="upgradeActiveDirectory(ldap.id)">
                <span style="position: relative;bottom: 0.4rem">{{$store.getters.t('upgrade')}}</span>
              </div>


            </div>
          </li>
        </ul>
      </div>
      <div class="active-directory__upgrade-ifo">
        <div  class="active-directory__upgrade-ifo__div" :style="{flexDirection: $i18n.locale === 'fa' ? 'row' : 'row-reverse'}">
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.859 0.222999C10.4745 -0.1142 9.03296 -0.0683305 7.66961 0.356136C6.3121 0.778784 5.07785 1.5625 4.08011 2.63241L2.22222 4.5115V2.73913C2.22222 2.0908 1.72476 1.56522 1.11111 1.56522C0.497464 1.56522 2.82419e-06 2.0908 2.82419e-06 2.73913V7.25792V7.26323V7.43478C2.82419e-06 8.08312 0.497464 8.6087 1.11111 8.6087H5.55556C6.16921 8.6087 6.66667 8.08312 6.66667 7.43478C6.66667 6.78645 6.16921 6.26087 5.55556 6.26087H3.70614L5.62896 4.3161C5.63735 4.30761 5.64562 4.29898 5.65375 4.29022C6.39077 3.49653 7.30071 2.91864 8.29776 2.60821C9.29471 2.29782 10.348 2.26438 11.3599 2.51083C12.3719 2.75729 13.3114 3.27615 14.0902 4.02118C14.8691 4.76632 15.4618 5.7136 15.811 6.77579C16.0124 7.38824 16.6455 7.71227 17.2252 7.49954C17.8049 7.28682 18.1116 6.61788 17.9102 6.00544C17.4397 4.57443 16.6394 3.29263 15.5818 2.28082C14.524 1.2689 13.2435 0.560177 11.859 0.222999ZM16.2939 11.7391H14.4444C13.8308 11.7391 13.3333 11.2136 13.3333 10.5652C13.3333 9.91688 13.8308 9.3913 14.4444 9.3913H18.8889C19.5025 9.3913 20 9.91688 20 10.5652V10.7384V10.7405V15.2609C20 15.9092 19.5025 16.4348 18.8889 16.4348C18.2752 16.4348 17.7778 15.9092 17.7778 15.2609V13.4885L15.9199 15.3676C14.9222 16.4375 13.6879 17.2212 12.3304 17.6439C10.967 18.0683 9.52551 18.1142 8.14095 17.777C6.75648 17.4398 5.47596 16.7311 4.41822 15.7192C3.3606 14.7074 2.56026 13.4256 2.0898 11.9946C1.88845 11.3821 2.19515 10.7132 2.77483 10.5005C3.3545 10.2877 3.98765 10.6118 4.18899 11.2242C4.5382 12.2864 5.13093 13.2337 5.90981 13.9788C6.68857 14.7239 7.62811 15.2427 8.64012 15.4892C9.65204 15.7356 10.7053 15.7022 11.7022 15.3918C12.6993 15.0814 13.6092 14.5035 14.3462 13.7098C14.3544 13.701 14.3626 13.6924 14.371 13.6839L16.2939 11.7391Z" fill="#75758F"/>
          </svg>
          <span style="font-size: 1.6rem;font-weight: 700">{{ $store.getters.t('display-update-information') }}</span>
        </div>
        <div class="upgrade-table__container">
          <div ref="table-th" class="upgrade-table__th">
            <span v-for="el in upgradeListTh" :key="el">{{ el }}</span>
          </div>
          <ul class="upgrade-table__Ul" >
            <li class="upgrade-table__list" v-for="user in errorList" :key="user">
              <div><span style="border-radius: 3rem;padding: 0.4rem 2rem;background-color:#EC3737;color: white;font-size: 1.2rem">دارای مشکل</span></div>
              <div><span>{{user.key}}</span></div>
              <div style="display: flex;flex-direction: column;gap: 0.8rem;">
                <div v-for="err in user.value" :key="err" style="display: flex;gap: 0.8rem;align-items: center">
                  <span style="width: 1.2rem;height: 1.2rem;border-radius: 50%;background-color:#EC3737"></span>
                  <span style="max-width:calc(100% - 2.2rem);font-weight: 400 ">{{err}}</span>
                </div>
              </div>
            </li>
            <li class="upgrade-table__list" v-for="user in createdList" :key="user">
              <div><span style="border-radius: 3rem;padding: 0.4rem 2.3rem;background-color:#2AB459;color: white;font-size: 1.2rem">کاربر جدید</span></div>
              <div><span>{{user}}</span></div>
              <div><span></span></div>
            </li>
            <li class="upgrade-table__list" v-for="user in upgradeList" :key="user">
              <div><span style="border-radius: 3rem;padding: 0.4rem 1.1rem;background-color:#2AB459;color: white;font-size: 1.2rem">بروزرسانی شده</span></div>
              <div><span>{{user}}</span></div>
              <div><span></span></div>
            </li>

          </ul>
        </div>
      </div>
    </div>

    <div class="no-info__group-management" v-if="!isLoading && !isGroupFound && ldapList.length === 0">
      <h1>
        {{ $store.getters.t('no-information') }}
      </h1>

    </div>
  </div>
  <base-modal :open="isProblemsModalOpen" is-blur="true">
    <template #modal-header>
   <div class="ldap-problems-modal__header" :style="{direction:$i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
     <span class="ldap-problems-modal__header-text">{{$store.getters.t('ldap-group-problems',{num:1})}}</span>
     <close-icon  width="24" height="24" color="#292933" @click-icon="isProblemsModalOpen = false" ></close-icon>
   </div>
    </template>
    <template #modal-body>
    <div class="ldap-problems-modal__body">
      <div class="problems-table__container">
        <div ref="table-th" class="problems-table__th">
          <span v-for="el in userHasErrorListTh" :key="el">{{ el }}</span>
        </div>
        <ul class="problems-table__Ul" :style="{'max-height':'30rem'}">
          <li class="problems-table__list" v-for="user in userHasError" :key="user">
            <div><span style="font-size: 1.2rem">{{ user.userName ? user.userName : 'بک اند' }}</span></div>
            <div><span>{{'1402/11/01'}}</span></div>
            <div style="display: flex;flex-direction: column;gap: 0.8rem;">
<!--              <div v-for="err in 3" :key="err" style="display: flex;gap: 0.8rem;align-items: center">-->
<!--                <span style="width: 1.2rem;height: 1.2rem;border-radius: 50%;background-color:#EC3737"></span>-->
<!--                <span style="max-width:calc(100% - 2.2rem);font-weight: 400 ">{{'این کاربر مشکل دارد'}}</span>-->
<!--              </div>-->
<!--              <div v-for="err in 3" :key="err" style="display: flex;gap: 0.8rem;align-items: center">-->
              <div style="display: flex;gap: 0.8rem;align-items: center">
                <span style="width: 1.2rem;height: 1.2rem;border-radius: 50%;background-color:#EC3737"></span>
                <span style="max-width:calc(100% - 2.2rem);font-weight: 400 ">{{user.errorMessage}}</span>
              </div>
            </div>
          </li>


        </ul>
      </div>
      <div style="width: 100%;color: #EC3737;font-size: 1.4rem" :style="{direction:$i18n.locale !== 'en' ? 'rtl' : 'ltr',textAlign:$i18n.locale !== 'en' ? 'left' : 'right'}">{{$store.getters.t('number-of-participants-problems',{num:24})}}</div>
    </div>
    </template>

  </base-modal>
  <base-modal :is-loading="'isLoading'"  :open="isLoading" is-blur="true" modal-color="transparent">
    <template #modal-body>
      <base-loading-spinner size-ratio="1.2" spinner-color="#409EFF">
        <template #loading-content>
          <div style="overflow: hidden; color: #409EFF" class="loading__extra-content--text">{{$store.getters.t("pleaseWait")}}</div>
        </template>
      </base-loading-spinner>
    </template>
  </base-modal>

</template>

<script>
import BaseButton from "./UI/BaseButton";
import RestClient from "@/api/restClient";
import BaseModal from "@/components/UI/BaseModal.vue";
import CloseIcon from "@/components/UI/Icons/CloseIcon.vue";
import BaseLoadingSpinner from "@/components/UI/BaseLoadingSpinner.vue";
export default {
  name: "ActiveDirectory",
  components: {BaseLoadingSpinner, CloseIcon, BaseModal, BaseButton},
  data() {
    return {
      restClientLdap: new RestClient('ldap'),
      tableMaxHeight: '',
      isCreateGroupOpen: false,
      activeDirectoryListTh: [this.$store.getters.t('address'),this.$store.getters.t('base'), this.$store.getters.t('group'), this.$store.getters.t('userName'), this.$store.getters.t('tenant'), this.$store.getters.t('action')],
      upgradeListTh: [this.$store.getters.t('user-status'),this.$store.getters.t('updated-users'), this.$store.getters.t('user-problems')],
      userHasErrorListTh:['نام کاربری','تاریخ','مشکلات'],
      ldapList: [],
      upgradeList:[],
      createdList:[],
      errorList: [],
      errorListTemp:[],
      userHasError:[],
      isActiveDirectoryHasError:false,
      timer: null,
      currentPage: 1,
      pageCount: 1,
      isNextButtonActive: true,
      isPreButtonActive: false,
      isLoading: false,
      pageNumber: 1,
      pageSize: 10,
      isProblemsModalOpen:false,
      isSending:false
    }
  },
  watch: {
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
  // computed: {
  //   shownUsers() {
  //     const users = this.groups.slice()
  //     const startIndex = ((this.currentPage - 1) * 10)
  //     if (this.groups.length - startIndex > 10) {
  //       return users.slice(startIndex, startIndex + 10)
  //     } else {
  //       return users.slice(startIndex, this.groups.length)
  //     }
  //
  //   }
  // },
  methods: {
    // addOrRemoveFromcheckedGroups(event,id){
    //
    //   if (event.target.checked){
    //     this.checkedGroups.push(id)
    //   }else {
    //     this.checkedGroups = this.checkedGroups.filter((el)=> {
    //       return el !== id
    //     })
    //     console.error( this.checkedGroups)
    //     console.error(this.selectedGroups)
    //   }
    //
    // }
    paginationCallback(page) {
      this.currentPage = page
      this.pageNumber = page
      this.searchGroup()
    },
    upgradeActiveDirectory(id) {
      if (!this.isSending){
        this.isSending = true
        this.restClientLdap
            .sync(id)
            .then((response) => {
              this.errorList = []
              this.createdList = []
              this.upgradeList = []
              console.error(response)
              this.createdList = response.data.data.createdUserList
              this.upgradeList = response.data.data.updatedUserList
              const errorUsers = response?.data.data?.mapErrorCode
              const Errorkeys = Object.keys(errorUsers)
              for (let i = 0; i < Errorkeys.length; i++) {
                let errorString = []
                const errors = errorUsers[Errorkeys[i]]
                for (let j = 0; j < errors.length; j++) {
                  errorString.push(this.errorHandleFunction(errors[j]))
                }
                this.errorList.push({
                  key: Errorkeys[i],
                  value: errorString
                })
              }
              this.isSending = false
            }).catch((err) => {
          this.isSending = false
          console.error(err)
        })
      }

    },
    getLdapSyncError(id){
      if (!this.isSending){
        this.isSending = true
        this.isLoading = true
        this.isProblemsModalOpen = true
        this.restClientLdap.getLdapSyncErrors(id)
            .then((response)=>{
              if (response.data.data.length < 1){
                this.eventBus.emit('notification', {
                  type: 'warning',
                  bodyText: this.$store.getters.t('no-problem'),
                  time: 5000
                })
              }else{
                this.userHasError = response.data.data
                this.isActiveDirectoryHasError = true
              }
              this.isSending = false
              this.isLoading = false
            }).catch((error)=>{
          console.error(error)
          this.isActiveDirectoryHasError = false
          this.isSending = false
          this.isLoading = false
        })
      }

    },
    errorHandleFunction(value) {
      let errorTextMessage
      switch (value) {
        case 202:
          errorTextMessage = this.$store.getters.t('username-is-empty')
          this.errorListTemp.push(errorTextMessage)
          break
        case 211:
          errorTextMessage = this.$store.getters.t('invalid_email_format')
          this.errorListTemp.push(errorTextMessage)
          break
        case 212:
          errorTextMessage = this.$store.getters.t('invalid_email_format')
          this.errorListTemp.push(errorTextMessage)
          break
        case 213:
          errorTextMessage =  this.$store.getters.t('email_already_exist')
          this.errorListTemp.push(errorTextMessage)
          break
        case 214:
          errorTextMessage = this.$store.getters.t('invalid_mobile_number')
          this.errorListTemp.push(errorTextMessage)
          break
        case 215:
          errorTextMessage = this.$store.getters.t('mobile_number_already_exist')
          this.errorListTemp.push(errorTextMessage)
          break
        case 221:
          errorTextMessage = this.$store.getters.t('email-not-valid')
          this.errorListTemp.push(errorTextMessage)
          break
        case 205:
          errorTextMessage = this.$store.getters.t('phone-number-is-empty')
          this.errorListTemp.push(errorTextMessage)
          break
        case 200:
          errorTextMessage = this.$store.getters.t('name-is-empty')
          this.errorListTemp.push(errorTextMessage)
          break
        case 201:
          errorTextMessage =  this.$store.getters.t('full-name-is-empty')
          this.errorListTemp.push(errorTextMessage)
          break
        case 206:
          errorTextMessage = this.$store.getters.t('username-is-empty')
          this.errorListTemp.push(errorTextMessage)
          break
      }
      return errorTextMessage
    },
    closeErrorModal() {
      this.isActiveDirectoryHasError = false
      this.userHasError = []
    },
    openProblemsActiveDirectoryModal(group) {
      this.groupId = group.id
      this.isUpdateGroup = true
      this.isCreateGroupOpen = true
    },
    getLdapConfig() {
      this.isLoading = true
      this.restClientLdap
          .getByCustomerId()
          .then((response) => {
            console.error(response)
            this.ldapList=response.data
            this.isLoading = false
          }).catch((err) => {
        console.error(err)
        this.isLoading = false
      })
    }
  },
  created() {
    this.getLdapConfig()
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
.active-directory-management__container {
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
.active-directory-management__header {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.6rem 1.6rem;
  border-bottom: 0.1rem solid #DCDADA;
}

.active-directory-management__header > h1 {
  font-size: 2.5rem;
}

.active-directory-info__container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  row-gap: 1.6rem;
  column-gap: 1.6rem;
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
.active-directory-problems__table {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.active-directory-problems__table--th{
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding: 1.6rem;
}
.active-directory-problems__table--th> span {
  width:30%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
}

.active-directory-problems__table--th> span:last-child {
  width: 40%;
  min-width: 6rem;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
}
.active-directory-table__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-width: 60rem;
}
.active-directory-table__th {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1.6rem;
  justify-content: space-around;
}

.active-directory-table__th > span {
  width:15%;
  font-size: 1.4rem;
  font-weight: 700;
  color: #75758F;

}

.active-directory-table__th > span:last-child {
  width: 10%;
  min-width: 6rem;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
}

.active-directory-table__Ul {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}

.active-directory-table__list {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 1.6rem;
  justify-content: space-around;
}

.active-directory-table__list:nth-child(odd) {
  background-color: #F6F6F7;
}

.active-directory-table__list > div {
  width: 15%;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}
.active-directory-table__list > div:last-child {
  width: 10%;
  text-align: center;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}

.active-directory-info {
  display: block;
  width: 90%;
  position: relative;
  direction: rtl;
  font-size: 1.4rem;
  font-weight: 400;
  white-space: pre-line;
  overflow-wrap: break-word;
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

.group-management__change-page {
  width: 100%;
  height: 6.5rem;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
  padding: 0 1.6rem;
}

.group-management__change-page > div:first-child {
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
.active-directory__upgrade-ifo{
  padding: 1.6rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-bottom: 0.1rem solid #DCDADA;
  border-top: 0.1rem solid #DCDADA;
  min-width: 60rem;
}

.active-directory__upgrade-ifo__div {
  display: flex;
  gap: 0.8rem;
  padding: 2.6rem 0 2rem 0;
  border-bottom: 0.1rem solid #DCDADA;
  font-weight: 700;
  width: 100%
}

.upgrade-table__container {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.upgrade-table__th {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.6rem;
  gap: 2%;
}

.upgrade-table__th > span {
  width:20%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  color: #75758F;
}

.upgrade-table__th > span:last-child {
  width: 55%;
  font-size: 1.4rem;
  font-weight: 700;
}

.upgrade-table__Ul {
  width: 100%;
  display: flex;
  flex-direction: column;
  direction: rtl;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}





.upgrade-table__list {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 1.6rem;
  gap: 2%;
}

.upgrade-table__list:nth-child(odd) {
  background-color: #F6F6F7;
}

.upgrade-table__list > div {
  width: 20%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}
.upgrade-info {
  display: block;
  width: 90%;
  position: relative;
  direction: rtl;
  font-size: 1.4rem;
  font-weight: 400;
  white-space: pre-line;
  overflow-wrap: break-word;
}
.upgrade-table__list > div:last-child {
  width: 54%;
  min-width: 6rem;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content:center ;
  gap: 0.8rem;
}



























.problems-table__container {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.problems-table__th {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.6rem;
  gap: 2%;
}

.problems-table__th > span {
  width:25%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  color: #75758F;
}

.problems-table__th > span:last-child {
  width: 45%;
  font-size: 1.4rem;
  font-weight: 700;
}

.problems-table__Ul {
  width: 100%;
  display: flex;
  flex-direction: column;
  direction: rtl;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}





.problems-table__list {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 1.6rem;
  gap: 2%;
}

.problems-table__list:nth-child(odd) {
  background-color: #F6F6F7;
}

.problems-table__list > div {
  width: 25%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}
.upgrade-info {
  display: block;
  width: 90%;
  position: relative;
  direction: rtl;
  font-size: 1.4rem;
  font-weight: 400;
  white-space: pre-line;
  overflow-wrap: break-word;
}
.problems-table__list > div:last-child {
  width: 45%;
  min-width: 6rem;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content:center ;
  gap: 0.8rem;
}


.ldap-problems-modal__header{
  width: 85rem;
  height:6rem;
  display: flex;
  justify-content: space-between;
  align-items: end;
}
.ldap-problems-modal__header-text{
  font-size: 2.5rem ;
}
.ldap-problems-modal__body{
  width: 85rem;
  height: 40rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}
@media (max-width:680px) {
  .active-directory-management__header{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    padding: 1.6rem 1.6rem;
    gap: 2rem;
    border-bottom: 0.1rem solid #DCDADA;
  }
  .active-directory-management__header h1{
    font-size: 2.5rem;
  }
  .upgrade-table__th > span {
    width:30%;
    text-align: right;
    font-size: 1.4rem;
    font-weight: 700;
    color: #75758F;
  }

  .upgrade-table__th > span:last-child {
    width: 35%;
    font-size: 1.4rem;
    font-weight: 700;
  }
  .upgrade-table__list > div {
    width: 30%;
    text-align: right;
    font-size: 1.4rem;
    font-weight: 400;
    direction: rtl;
  }
  .upgrade-table__list > div:last-child {
    width: 35%;
    min-width: 6rem;
    text-align: right;
    font-size: 1.4rem;
    font-weight: 700;
    display: flex;
    justify-content:center ;
    gap: 0.8rem;
  }
}
</style>
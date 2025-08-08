<template>
  <div class="group-management__container">
    <div class="group-management__header" :style="{flexDirection: $i18n.locale === 'fa' ? 'row-reverse' : 'row'}">
      <h1> {{ $store.getters.t('groups-management') }} </h1>
      <base-button
          :is-active="true"
          :button-inner-txt="$store.getters.t('add-new-group')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
          :style-types="['large--button']"
          @click="openCreateGroupModal"

      >
        <template #pre-button-slot>
          <svg style="width: 18px;height: 18px" width="24" height="24" viewBox="0 0 24 24" fill="white"
               xmlns="http://www.w3.org/2000/svg">
            <path
                d="M19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z"
                fill="white"/>
          </svg>

        </template>
      </base-button>
    </div>
    <div class="group-Info__container" :style="{flexDirection: $i18n.locale === 'fa' ? 'row-reverse' : 'row'}">
      <div style="display: flex;flex-direction: column;gap: 0.8rem;width:calc(100% - 9.2rem) ">
        <label :style="{justifyContent: $i18n.locale === 'fa' ? 'flex-end' : 'flex-start'}"> {{ $store.getters.t('group-name') }} </label>
        <input type="text" class="group-management-input__search" v-model="groupName"/>
      </div>

      <base-button
          :is-active="true"
          :button-inner-txt="$store.getters.t('search')"
          :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
          :style-types="['button--small']"
          @click="searchGroup"

      >
      </base-button>
    </div>
    <div class="group-table__container">
      <div ref="table-th" class="group-table__th" :style="{flexDirection: $i18n.locale === 'fa' ? 'row-reverse' : 'row'}">
        <span v-for="el in groupListTh" :key="el" :style="{textAlign: $i18n.locale === 'fa' ? 'right' : 'revert'}">{{ el }}</span>
      </div>
      <ul class="group-table__Ul" :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}">
        <li class="group-table__list" v-for="group in showGroups" :key="group.id">
          <div>
            <span class="group-info" :style="{flexDirection: $i18n.locale === 'fa' ? 'row' : 'row-reverse'}">{{ group.name }}</span></div>
          <div><span class="group-info" :style="{flexDirection: $i18n.locale === 'fa' ? 'row' : 'row-reverse'}">{{group.groupCount}}</span></div>
          <div>
            <img draggable="false" src="/img/edit.svg" style="cursor: pointer" alt="not loaded" @click="openUpdateUserModal(group)">
            <img draggable="false" src="/img/delete.svg" style="cursor: pointer" alt="not loaded" @click="openDeleteGroupModal(group)">
          </div>
        </li>
      </ul>
    </div>
    <div class="group-management__change-page" v-if="groups.length > 0">
      <div >
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
<!--          <span>{{ this.$store.getters.t('previous') }}</span>-->
<!--        </div>-->
<the-pagination :items-length="groupLength" :items-per-page="10" :current-page="currentPage"  @change-page="changePage" ></the-pagination>
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
<!--          {{ this.$store.getters.t('next') }}-->
<!--        </span>-->
<!--          <svg style="width: 16px;height: 16px" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--               xmlns="http://www.w3.org/2000/svg">-->
<!--            <path-->
<!--                d="M14.5002 12.5L8.9002 18.2C8.5002 18.6 7.9002 18.6 7.5002 18.2C7.1002 17.8 7.1002 17.2 7.5002 16.8L12.4002 11.9L7.5002 7C7.3002 6.8 7.2002 6.6 7.2002 6.3C7.2002 5.7 7.6002 5.3 8.2002 5.3C8.5002 5.3 8.7002 5.4 8.9002 5.6L14.6002 11.3C14.9002 11.5 14.9002 12.1 14.5002 12.5Z"-->
<!--                fill="black"/>-->
<!--          </svg>-->
<!--        </div>-->


      </div>
      <div class="group-length-info" >
        <div :style="{direction : $i18n.locale !== 'fa' ? 'ltr' : 'rtl'}" >{{$store.getters.t('group-length', {length: groupLength})}}</div>
      </div>
    </div>
    <div class="no-info__group-management" v-if="!isLoading && !isGroupFound && groupLength === 0">
      <h1>
        {{ $store.getters.t('no-information') }}
      </h1>

    </div>
  </div>
  <div v-if="isCreateGroupOpen">
    <create-group :is-update-group="isUpdateGroup" :group-id="groupId"
                  @close-create-group-modal=" closeCreateGroupModal"
                  @group-created="getAllGroup"
                  :is-create-group-open="isCreateGroupOpen" @start-loading="isLoading = true"></create-group>
  </div>
  <base-modal :open="isDeleteGroupOpen">
    <template #modal-header>
      <div class="delete-group-modal-header">
        <h2>{{ $store.getters.t('delete-group') }}</h2>
        <img draggable="false" style="width: 2.4rem;height: 2.4rem;cursor: pointer" src="/img/close.svg" @click="closeDeleteGroupModal">
      </div>
    </template>
    <template #modal-body>
      <div class="delete-group-modal-body" :style="{direction : $i18n.locale !== 'fa' ? 'ltr' : 'rtl'}">
        <span> {{ $store.getters.t('do-you-want-delete-group' , {group: ' ' + this.nameOfGroup + ' '}) }} </span>
      </div>
    </template>
    <template #modal-buttons>
      <div class="delete-group-modal-action">
        <base-button
            :is-active="true"
            :button-inner-txt= "$store.getters.t('withdrawal')"
            :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
            :style-types="['large--button']"
            @click="closeDeleteGroupModal"

        >
        </base-button>
        <base-button
            :is-active="true"
            :button-inner-txt="$store.getters.t('yes-delete-it')"
            :continuous-params="[
          'background-color=#EC3737',
          'color=white',
          ]"
            :style-types="['large--button']"
            @click="deleteGroup">

        </base-button>
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
import BaseModal from "./UI/BaseModal";
import CreateGroup from "./CreateGroup";
import ThePagination from "@/components/ThePagination.vue";
import BaseLoadingSpinner from "@/components/UI/BaseLoadingSpinner.vue";

export default {
  name: "GroupManagement",
  components: {BaseLoadingSpinner, ThePagination, CreateGroup, BaseModal, BaseButton},
  data() {
    return {
      restClientGroup: new RestClient('group'),
      tableMaxHeight: '',
      isCreateGroupOpen: false,
      groupName: '',
      groupListTh: [this.$store.getters.t('group-name'), this.$store.getters.t('number-of-users'), this.$store.getters.t('action')],
      groups: [],
      checkedGroups: [],
      selectedGroups: [],
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
      nameOfGroup:false,
      allGroups : [{name : 'گروه شوکا', id : 12 } , {name : 'گروه تست', id : 15 } , {name : 'گروه آسیایی', id : 25 }],
      searchedGroups : []
    }
  },
  watch: {
    // currentPage: {
    //   immediate: true,
    //   handler(val) {
    //     if (val === 1 && this.pageCount > 1) {
    //       this.isPreButtonActive = false
    //       this.isNextButtonActive = true
    //     } else if (val === 1 && this.pageCount === 1) {
    //       this.isPreButtonActive = false
    //       this.isNextButtonActive = false
    //     } else if (val === this.pageCount && this.pageCount > 1) {
    //       this.isPreButtonActive = true
    //       this.isNextButtonActive = false
    //     } else if (val === this.pageCount && this.pageCount === 1) {
    //       this.isPreButtonActive = false
    //       this.isNextButtonActive = false
    //     } else {
    //       this.isPreButtonActive = true
    //       this.isNextButtonActive = true
    //     }
    //   }
    //
    // }
  },
  computed: {
    showGroups() {
      const groups = this.searchedGroups.slice()
      const startIndex = ((this.currentPage - 1) * 10)
      if (this.searchedGroups.length - startIndex > 10) {
        return groups.slice(startIndex, startIndex + 10)
      } else {
        return groups.slice(startIndex, this.groups.length)
      }

    }
  },
  methods: {
    openCreateGroupModal() {
      this.isUpdateGroup = false
      this.isCreateGroupOpen = true
    },
    closeCreateGroupModal() {
      this.groupId = null
      this.isUpdateGroup = false
      this.isCreateGroupOpen = false
      this.getAllGroup()
    },
    getGroupById(id) {
      this.restClientGroup
          .getById(id)
          .then((response) => {
            console.error(response)
          })
          .catch((error) => {
            console.error(error)
          })
    },
    changePage(page) {
      this.currentPage = page
      this.pageNumber = page
    },
    openDeleteGroupModal(group) {
      this.groupId = group.id
      this.nameOfGroup = group.name
      this.isDeleteGroupOpen = true
    },
    closeDeleteGroupModal() {
      this.groupId = null
      this.firstName = null
      this.lastName = null
      this.isDeleteGroupOpen = false
      this.isLoading = false
    },
    openUpdateUserModal(group) {
      this.groupId = group.id
      this.isUpdateGroup = true
      this.isCreateGroupOpen = true
    },
    deleteGroup() {
      this.isLoading = true
      this.restClientGroup.delete(this.groupId).then(() => {
        this.getAllGroup()
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "success",
          bodyText: 'گروه مورد نظر حذف شد',
          time: 5000,
        });
        this.isLoading = false
        this.closeDeleteGroupModal()
        this.searchGroup()
      }).catch((err) => {
        console.error(err)
        this.isLoading = false
      })
    },
    getAllGroup() {
      this.isLoading = true
      this.restClientGroup
          .getAll()
          .then((response) => {
            this.groups = response
            this.searchedGroups = response
            this.groupLength = response.length
            this.isLoading = false
          }).catch((err) => {
        console.error(err)
        this.isLoading = false
      })
    },

    searchGroup () {
      this.isLoading = true
      console.error(this.allGroups)
      console.error(this.searchedGroups)
      // console.log(this.selectedGroups)

      if (this.groupName.trim() === ''){
        this.getAllGroup()
      }else {
        this.searchedGroups = this.searchedGroups.filter( (group) =>{
          return  group.name.trim().includes(this.groupName.trim())
        })
      }

      this.isLoading = false
    }
  },
  created() {
    this.getAllGroup()

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
.group-management__container {
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
.group-management__header {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.6rem 1.6rem;
  border-bottom: 0.1rem solid #DCDADA;
}

.group-management__header > h1 {
  font-size: 2.5rem;
}

.group-Info__container {
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

.group-Info__container > div > label {
  color: #75758F;
  font-size : 1.2rem;
  width: 100%;
  display: flex;
  //justify-content: flex-end
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

.group-table__container {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.group-table__th {
  width: 100%;
  display: flex;
  //flex-direction: row-reverse;
  align-items: center;
  padding: 1.6rem;
}

.group-table__th > span {
  width: 45%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
}

.group-table__th > span:last-child {
  width: 10%;
  min-width: 6rem;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-start;
}

.group-table__Ul {
  width: 100%;
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
  width: 45%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}
.group-info {
  display: flex;
  max-width: 98%;
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
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
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
.group-length-info {
  display: flex;
direction: rtl;
  align-items: center;
}

.group-length-info > div {
  color: #292933;
  font-weight: 400;
  font-size: 1.4rem
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
  border-bottom: 0.1rem solid #DCDADA;
  font-size: 1.6rem;
  font-weight: 400;
  justify-content: flex-start;
}

.delete-group-modal-action {
  width: 40rem;
  height: 5rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
}
@media (max-width: 630px) {
  .group-management__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    padding: 1.6rem 1.6rem;
    gap: 2rem;
    border-bottom: 0.1rem solid #DCDADA;
  }
  .group-management__header h1 {
   font-size: 2.5rem;
  }
  .delete-group-modal-header{
    width:33rem;
  }
  .delete-group-modal-body{
    width:33rem;
    padding: 2rem 0;
    white-space: pre-line;
    overflow-wrap: break-word;
  }
  .delete-group-modal-action{
    width:33rem;

  }
  .group-management__change-page > div:first-child {
    display: none;
  }
  .group-length-info{
    display: none;
  }
  .group-management__change-page{
    justify-content: center;
  }
}

</style>

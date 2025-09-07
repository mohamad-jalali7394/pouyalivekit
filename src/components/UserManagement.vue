<template>
  <div class="user-management__container">
    <div class="user-management__header" :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">
      <h1>{{ $store.getters.t('users-management') }}</h1>
      <base-button
          :is-active="true"
          :button-inner-txt="$store.getters.t('add-new-user')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
          :style-types="['large--button']"
          :style="{flexDirection: $i18n.locale === 'en' ? 'row-reverse' : 'row'}"
          @click="openCreateUserModal"

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
    <div class="User-Info__container" :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">
      <base-form-input
          v-for="info in UserInfo"
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
          @click="searchUser"

      >
      </base-button>
    </div>
    <div class="upload-user-container">
      <div>
        <div>{{ $store.getters.t("add-excel-file-to-the-list-of-users") }}</div>

        <div class="upload-user-actions">
          <base-button
              :is-active="true"
              :button-inner-txt = "$store.getters.t('download-the-excel-template')"
              :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
              :style-types="['button--small']"
              @btnClicked="getExcelTemplate"
          >
            <template #pre-button-slot>
              <img draggable="false" src="/img/download-excel.svg" style="width: 16px; height: 16px;cursor: pointer" alt="not loaded">
            </template>
          </base-button>

          <base-button
              :is-active="true"
              :button-inner-txt="$store.getters.t('add-excel-file')"
              :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
              :style-types="['button--small']"
              @btnClicked="OpenUploadFile"
          >
            <template #pre-button-slot>
              <svg style="width: 18px;height: 18px" width="24" height="24" viewBox="0 0 24 24" fill="#1B76FF"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z"
                    fill="#1B76FF"/>
              </svg>

            </template>
          </base-button>
          <input v-if="isChooseFileInputExist" style="display: none" type="file" accept=".xlsx, .xls" ref="file" @input="uploadFile">
          <base-button
              :is-active="true"
              :button-inner-txt="$store.getters.t('upload-file')"
              :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
              :style-types="['button--small']"
              @btnClicked="uploadExcelFile"
          >
            <template #pre-button-slot>
              <img draggable="false" src="/img/upload.svg" style="width: 16px; height: 16px;cursor: pointer" alt="not loaded">
            </template>
          </base-button>
      </div>
      </div>
      <div style="width: 100%;direction: rtl">
        <div v-if="excelFile?.name" style="padding: 0.8rem 1.6rem;border-radius: 0.8rem;background-color: #DCDADA;font-size: 1.4rem;color: #292933;display: flex;gap: 0.8rem;direction: rtl;width: fit-content">
          <span>{{ excelFile?.name }}</span>
          <close-icon width="24" height="24" color="#000000" @click-icon="deleteFile"></close-icon>
        </div>
      </div>




    </div>
    <div class="users-table__container">
      <div class="users-table__choose-all-users" :style="{direction:$i18n.locale === 'fa'? 'rtl' : 'ltr'}">
        <div :style="{direction:$i18n.locale === 'fa'? 'rtl' : 'ltr'}">
          <div :style="{direction:$i18n.locale === 'fa'? 'rtl' : 'ltr'}" style="display: flex;align-items: center">
            <input style="  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;" type="checkbox" @change="addAllUsersToCheckedUsers">
            <span style="color: #292933;font-size: 1.4rem;font-weight: 700; padding: 0 0.8rem">{{$store.getters.t("select-all")}}</span>
          </div>

          <transition name="change-user-stat">
            <div v-if="selectedUsers?.length > 0" class="users-table__choose-actions">
              <base-button
                  :is-active="true"
                  :button-inner-txt="$t('delete')"
                  :continuous-params="[
          'background-color=#F2F2F2',
          'color=#EC3737',
          ]"
                  :style-types="['button--small']"
                  @click="deleteSomeUsers"
              >
                <template #pre-button-slot>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M4.66536 2.66659C4.66536 1.93021 5.26232 1.33325 5.9987 1.33325H9.9987C10.7351 1.33325 11.332 1.93021 11.332 2.66659V3.99992H13.9987C14.3669 3.99992 14.6654 4.2984 14.6654 4.66659C14.6654 5.03477 14.3669 5.33325 13.9987 5.33325H13.2861L12.7079 13.4283C12.658 14.126 12.0775 14.6666 11.378 14.6666H4.61944C3.91992 14.6666 3.33934 14.126 3.2895 13.4283L2.71128 5.33325H1.9987C1.63051 5.33325 1.33203 5.03477 1.33203 4.66659C1.33203 4.2984 1.63051 3.99992 1.9987 3.99992H4.66536V2.66659ZM5.9987 3.99992H9.9987V2.66659H5.9987V3.99992ZM4.61944 13.3333L4.04802 5.33325H11.9494L11.378 13.3333H4.61944ZM6.66536 6.66659C7.03356 6.66659 7.33203 6.96505 7.33203 7.33325V11.3333C7.33203 11.7015 7.03356 11.9999 6.66536 11.9999C6.29718 11.9999 5.9987 11.7015 5.9987 11.3333V7.33325C5.9987 6.96505 6.29718 6.66659 6.66536 6.66659ZM9.9987 7.33325C9.9987 6.96505 9.70023 6.66659 9.33203 6.66659C8.96383 6.66659 8.66536 6.96505 8.66536 7.33325V11.3333C8.66536 11.7015 8.96383 11.9999 9.33203 11.9999C9.70023 11.9999 9.9987 11.7015 9.9987 11.3333V7.33325Z"
                          fill="
#EC3737"/>
                  </svg>

                </template>
              </base-button>
              <base-button
                  :is-active="true"
                  :button-inner-txt="$t('activate')"
                  :continuous-params="[
          'background-color=#F2F2F2',
          'color=#2AB459',
          ]"
                  :style-types="['button--small']"
                  @click="activateUsers"
              >
                <template #pre-button-slot>
                  <span style="width: 1rem;height: 1rem;background-color:#2AB459;border-radius: 50%"></span>
                </template>
              </base-button>
              <base-button
                  :is-active="true"
                  :button-inner-txt="$t('disable')"
                  :continuous-params="[
          'background-color=#F2F2F2',
          'color=#75758F',
          ]"
                  :style-types="['button--small']"
                  @click="deActivateUsers"
              >
                <template #pre-button-slot>
                  <span style="width: 1rem;height: 1rem;background-color:#75758F;border-radius: 50%"></span>
                </template>
              </base-button>

            </div>
          </transition>
        </div>
        <div style="color: #1B76FF" @click="exportUsers">
          <img draggable="false" src="/img/xls.svg" style="cursor: pointer">
          <span style="cursor: pointer" >{{ $store.getters.t("get-users-exel") }}</span>
        </div>
      </div>
      <div class="user-management__table--container">
        <div ref="table-th" :class="{'users-table__th': $i18n.locale === 'fa', 'users-table__th__ltr': $i18n.locale !== 'fa'}" :style="{'flex-direction': $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">
          <span v-for="el in userListTh" :key="el" :style="{textAlign: $i18n.locale !== 'en' ? 'right' : 'justify'}">{{ el }}</span>
        </div>
        <ul class="users-table__Ul">
          <li :class="{'users-table__list': $i18n.locale === 'fa','users-table__list__ltr': $i18n.locale !== 'fa'}" :style="{'flex-direction': $i18n.locale !== 'en' ? 'row-reverse' : 'row'}" v-for="user in users" :key="user.id">
            <div style="display: flex;gap: 0.8rem;align-items: center">
              <input type="checkbox" name="user" :value="user.id" v-model="selectedUsers">
              <span v-if="user.active"
                    style="background-color:#2AB459;width: 1rem;height: 1rem;border-radius: 50%"></span>
              <span v-else style="background-color:#75758F;width: 1rem;height: 1rem;border-radius: 50%"></span>
              <span class="user-info">{{ user.username }}</span>
            </div>
            <div :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr' , textAlign: $i18n.locale !== 'en' ? 'right' : 'justify'}"><span class="user-info" >{{ user.firstName }}</span></div>
            <div :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr' , textAlign: $i18n.locale !== 'en' ? 'right' : 'justify'}"><span class="user-info">{{ user.lastName }}</span></div>
            <div :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr' , textAlign: $i18n.locale !== 'en' ? 'right' : 'justify'}"><span class="user-info">{{ user.phoneNumber }}</span></div>
            <div :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr' , textAlign: $i18n.locale !== 'en' ? 'right' : 'justify'}"><span class="user-info-email">{{ user.email }}</span></div>
            <div :style="{display:'flex',flexDirection: $i18n.locale !== 'en' ?'row-reverse' : 'row'}">
              <img draggable="false" src="/img/edit.svg" style="cursor: pointer" alt="not loaded" @click="openUpdateUserModal(user)">
              <img draggable="false" src="/img/delete.svg" style="cursor: pointer" alt="not loaded" @click="openDeleteUserModal(user)">
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="user-management__change-page" v-if="users?.length > 0">
      <div>
        {{ this.$store.getters.t("pagination-count", {pageCount: pageCount, currentPage: currentPage}) }}
      </div>
      <div style="width: 40%;height: 70%;display: flex;flex-direction: row;align-items: center;justify-content: center">
<!--        <div class="pre-button-pagination" :style="{opacity:isPreButtonActive ? '1' : '0.4',cursor: isPreButtonActive ? 'pointer' : 'not-allowed'}">-->
<!--          <svg style="width: 16px;height: 16px" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--               xmlns="http://www.w3.org/2000/svg">-->
<!--            <path-->
<!--                d="M7.51348 11.3L13.1135 5.60005C13.5135 5.20005 14.1135 5.20005 14.5135 5.60005C14.9135 6.00005 14.9135 6.60005 14.5135 7.00005L9.61348 11.9L14.5135 16.8C14.7135 17 14.8135 17.2 14.8135 17.5C14.8135 18.1 14.4135 18.5 13.8135 18.5C13.5135 18.5 13.3135 18.4 13.1135 18.2L7.41348 12.5C7.11348 12.3 7.11348 11.7 7.51348 11.3Z"-->
<!--                fill="black"/>-->
<!--          </svg>-->
<!--          <span>{{this.$store.getters.t('previous')}}</span>-->
<!--        </div>-->
        <the-pagination :items-length="usersLength" :items-per-page="10" :current-page="currentPage" @change-page="changePage" />

        <!--        <paginate-->
<!--            :page-count="pageCount"-->
<!--            :page-range="4"-->
<!--            :click-handler="paginationCallback"-->
<!--            :prev-text="'.......................'"-->
<!--            :next-text="'.......................'"-->
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
<!--        <div class="next-button-pagination" :style="{opacity:isNextButtonActive ? '1' : '0.4',cursor:isNextButtonActive ? '1' : 'not-allowed'  }">-->
<!--        <span>-->
<!--          {{this.$store.getters.t('next')}}-->
<!--        </span>-->
<!--          <svg style="width: 16px;height: 16px" width="24" height="24" viewBox="0 0 24 24" fill="none"-->
<!--               xmlns="http://www.w3.org/2000/svg">-->
<!--            <path-->
<!--                d="M14.5002 12.5L8.9002 18.2C8.5002 18.6 7.9002 18.6 7.5002 18.2C7.1002 17.8 7.1002 17.2 7.5002 16.8L12.4002 11.9L7.5002 7C7.3002 6.8 7.2002 6.6 7.2002 6.3C7.2002 5.7 7.6002 5.3 8.2002 5.3C8.5002 5.3 8.7002 5.4 8.9002 5.6L14.6002 11.3C14.9002 11.5 14.9002 12.1 14.5002 12.5Z"-->
<!--                fill="black"/>-->
<!--          </svg>-->
<!--        </div>-->


      </div>
      <div class="user-length-info">
        <div style="color: #292933;font-weight: 400;font-size: 1.4rem;direction: rtl">{{$store.getters.t('user-length', {length: usersLength})}}</div>
        <span style="width: 0;height:2rem;border: 0.1rem solid #DCDADA"></span>
        <div style="color: #2AB459;font-weight: 400;font-size: 1.4rem;direction: rtl">{{$store.getters.t('active-user-length', {length: activeUsersLength})}}</div>
        <span style="width: 0;height: 2rem;border: 0.1rem solid #DCDADA"></span>
        <div style="color:#a8a8ad;font-weight: 400;font-size: 1.4rem;direction: rtl">{{$store.getters.t('inactive-user-length', {length: inactiveUsersLength})}}</div>
      </div>
    </div>
    <div class="no-info__user-management" v-if="!isLoading && !isUserFound && users?.length === 0">
      <h1>
        {{ $store.getters.t('no-information') }}
      </h1>

    </div>
  </div>
  <div v-if="isCreateUserOpen">
    <create-user :is-update-user="isUpdateUSer" :user-id="userId" @close-create-user-modal=" closeCreateUserModal"
                 :is-create-user-open="isCreateUserOpen" @start-loading="isLoading = true" @end-loading="isLoading = false"></create-user>
  </div>
  <base-modal :open="isDeleteUserOpen">
    <template #modal-header>
      <div class="delete-user-modal-header">
        <h2>{{ $store.getters.t('delete-user') }}</h2>
        <img draggable="false" style="width: 2.4rem;height: 2.4rem;cursor: pointer" src="/img/close.svg" @click="closeDeleteUserModal">
      </div>
    </template>
    <template #modal-body>
      <div class="delete-user-modal-body" :style="{direction : $i18n.locale !== 'fa' ? 'ltr' : 'rtl'}">
        <span> {{ $store.getters.t('do-you-want-delete-user' , {user: ' ' + this.firstName + ' ' + this.lastName + ' '}) }} </span>
      </div>
    </template>
    <template #modal-buttons>
      <div class="delete-user-modal-action">
        <base-button
            :is-active="true"
            :button-inner-txt= "$store.getters.t('withdrawal')"
            :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
            :style-types="['large--button']"
            @click="closeDeleteUserModal"

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
            @click="deleteUser">

        </base-button>
      </div>
    </template>
  </base-modal>
  <base-modal :open="showFailedUsers" is-blur="true">
    <template #modal-header>
      <div class="ldap-problems-modal__header" style="width: 70rem;height: 3rem;display: flex;justify-content: space-between" :style="{direction:$i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
        <span class="ldap-problems-modal__header-text" style="font-size: 2.8rem">{{'مشکلات کاربران'}}</span>
        <close-icon  width="24" height="24" color="#292933" @click-icon="showFailedUsers = false" ></close-icon>
      </div>
    </template>
    <template #modal-body>
      <div class="ldap-problems-modal__body" style="width: 70rem;max-height: 60rem;display: flex;flex-direction: column;overflow-y: auto" >
        <div class="problems-table__container" style="width: 70rem;display: flex;flex-direction: column">
          <div ref="table-th" class="problems-table__th" style="width: 70rem;height: 5rem;display: flex;justify-content: space-between;align-items: center">
            <span v-for="el in userHasErrorListTh" style="direction: rtl;width: 50%"  :key="el">{{ el }}</span>
          </div>
          <ul class="problems-table__Ul" style="width: 100%;;display: flex;flex-direction: column" :style="{'max-height':'30rem'}">
            <li class="problems-table__list" style="padding: 1.5rem 1rem ;width: 100%;display: flex;justify-content: space-between;align-items: center;overflow-y: auto" v-for="user in failedUsers" :key="user">
              <div style="direction: rtl;width: 50%"> {{user.fullName}}</div>
              <div style="direction: rtl;width: 50%;display: flex;flex-direction: column;gap: 0.8rem"><div v-for="err in user.error" :key="err" style="display: flex;gap: 0.8rem;width: 100%;align-items: center">
                <span style="width: 1.2rem;height: 1.2rem;border-radius: 50%;background-color:#EC3737"></span>
                <span style="max-width:calc(100% - 2.2rem);font-weight: 400 ">{{err}}</span>
              </div></div>
            </li>

          </ul>
        </div>
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
import BaseFormInput from "./UI/BaseFormInput";
import BaseButton from "./UI/BaseButton";
import CreateUser from "./CreateUser";
// import Paginate from 'vuejs-paginate-next';
import RestClient from "@/api/restClient";
import BaseModal from "./UI/BaseModal";
import CloseIcon from "@/components/UI/Icons/CloseIcon.vue";
import ThePagination from "@/components/ThePagination.vue";
import BaseLoadingSpinner from "@/components/UI/BaseLoadingSpinner.vue";

export default {
  name: "UserManagement",
  components: {BaseLoadingSpinner, CloseIcon, BaseModal, CreateUser, BaseButton, BaseFormInput,ThePagination},
  data() {
    return {
      restClientUser: new RestClient('user'),
      tableMaxHeight: '',
      isCreateUserOpen: false,
      UserInfo: [
        {
          label: this.$store.getters.t('userName'),
          type: "text",
          validationType: '',
          id: "username",
          inputVal: '',
          isValid: false,
        },
        {
          label: this.$store.getters.t('name'),
          type: "text",
          validationType: '',
          id: "name",
          inputVal: "",
          isValid: false,
        },
        {
          label: this.$store.getters.t('last-name'),
          type: "text",
          validationType: '',
          id: "lastName",
          inputVal: "",
          isValid: false,
        }, {
          label: this.$store.getters.t('phone-number'),
          type: "text",
          validationType: '',
          id: "phoneNumber",
          inputVal: "",
          isValid: false,
        },
      ],
      userListTh: [ this.$store.getters.t("userName"), this.$store.getters.t("name"), this.$store.getters.t("last-name"), this.$store.getters.t("phone-number"), this.$store.getters.t("Email"), this.$store.getters.t("action")],
      users: [],
      checkedUsers: [],
      selectedUsers: [],
      timer: null,
      currentPage: 1,
      pageCount: 1,
      isNextButtonActive: true,
      isPreButtonActive: false,
      isUserFound: false,
      isLoading: false,
      pageNumber: 1,
      pageSize: 10,
      usersLength: 0,
      isDeleteUserOpen: false,
      userId: null,
      firstName: null,
      lastName: null,
      isUpdateUSer: false,
      activeUsersLength: null,
      inactiveUsersLength: null,
      excelFile:null,
      isChooseFileInputExist:true,
      failedUsers:[
        {
          header: 'نام و نام خانوادگی',
          name: 'fullName',
          render: 'fullName',
          sortDir: 'asc',
          width: 18
        },
        {
          header: 'خطا',
          name: 'error',
          render: 'error',
          sortDir: 'asc',
          width: 18
        }
      ],
      showFailedUsers:false,
      errorListTemp:[],
      userHasErrorListTh:['نام و نام خانوادگی','خطا'],
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
  //     const users = this.users.slice()
  //     const startIndex = ((this.currentPage - 1) * 10)
  //     if (this.users.length - startIndex > 10) {
  //       return users.slice(startIndex, startIndex + 10)
  //     } else {
  //       return users.slice(startIndex, this.users.length)
  //     }
  //
  //   }
  // },
  methods: {
    openCreateUserModal() {
      this.isUpdateUSer = false
      this.isCreateUserOpen = true
    },
    closeCreateUserModal() {
      this.isLoading = false
      this.userId = null
      this.isUpdateUSer = false
      this.isCreateUserOpen = false
      this.searchApi()
    },
    addAllUsersToCheckedUsers(event) {
      this.selectedUsers = []
      if (event.target.checked) {
        for (let i = 0; i < this.users?.length; i++) {
          // this.checkedUsers.push(this.users[i].userId)
          // this.users[i].inputVal = true
          this.selectedUsers.push(this.users[i].id)

        }
      } else {
        // for (let i=0 ; i < this.users.length ;i++){
        //   this.users[i].inputVal = false
        // }
        this.selectedUsers = []
      }
    },
    // addOrRemoveFromCheckedUsers(event,id){
    //
    //   if (event.target.checked){
    //     this.checkedUsers.push(id)
    //   }else {
    //     this.checkedUsers = this.checkedUsers.filter((el)=> {
    //       return el !== id
    //     })
    //     console.error( this.checkedUsers)
    //     console.error(this.selectedUsers)
    //   }
    //
    // }
    changePage(page) {
      this.currentPage = page
      this.pageNumber = page
      this.searchApi()
    },
    // getAllUsers(){
    //   this.isLoading = true
    //   this.isUserFound = false
    //   this.restClientUser
    //       .getAll()
    //       .then((response) => {
    //         this.usersLength = response.length
    //         this.searchUser('','','','','',0,10)
    //
    //       })
    //       .catch((error) => {
    //         this.isLoading = false
    //         this.isUserFound = false
    //         console.error(error)
    //       });
    // },
    searchUser() {

      this.isLoading = true
      this.isUserFound = false
      if (this.UserInfo[2].inputVal ||
          this.UserInfo[1].inputVal ||
          this.UserInfo[0].inputVal ||
          this.UserInfo[3].inputVal ){
        this.pageNumber = 1
        this.pageCount = 1

        this.searchApi()

      }else {
        this.currentPage = 1
        this. changePage(1)
      }

    },
    searchApi(){
      this.users = []
      let  phoneNumber = this.UserInfo[3].inputVal
      if (phoneNumber?.length === 11 && +phoneNumber.split('')[0] === 0 ) {
        phoneNumber = phoneNumber.substring(1)
      }
      this.restClientUser
          .search(
              this.UserInfo[2].inputVal,
              this.UserInfo[1].inputVal,
              this.UserInfo[0].inputVal,
              phoneNumber,
              this.pageNumber - 1,
              this.pageSize
          )
          .then((response) => {
            this.pageCount = response.data.pageNumber
            this.usersLength = response.data.totalElement
            this.activeUsersLength = response.data.totalActiveUsers
            this.inactiveUsersLength =response.data.totalInactiveUsers
            this.users = response.data.userDtoList
            if (!response.data.userDtoList) {
              this.eventBus.emit("notification", {
                title: "پیام",
                type: "error",
                bodyText: 'کاربری یافت نشد',
                time: 5000,
              });
            }
            this.isUserFound = true
            this.isLoading = false
          })
          .catch((error) => {
            this.isLoading = false
            this.isUserFound = false
            console.error(error)
          });
    },
    getExcelTemplate(){
      var link = document.createElement('a')
      link.download = name
      link.href = process.env.VUE_APP_DOWNLOAD_EXCEL_TEMPLATE
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    OpenUploadFile(){
      this.$refs.file.click()
    },
    uploadFile(){
      this.excelFile = this.$refs.file.files[0]
      const formData = new FormData()
      formData.append('file', this.excelFile)
    },
    deleteFile(){
      this.excelFile = null
      this.isChooseFileInputExist = false
      setTimeout(()=>{
        this.isChooseFileInputExist = true

      },0)

    },
    uploadExcelFile(){

      const formData = new FormData()
      /*
                Add the form data we need to submit
            */
      formData.append('file', this.excelFile)
      if (this.excelFile?.size > 0){
        this.restClientUser
            .createUserByExcel(formData)
            .then((response) => {
              let errorString = []
              let failedUsers = []
              for (const key in response.data) {
                errorString = []
                if (key.includes('fail')) {
                  for (let j = 0; j < response.data[key].errorCode.length; j++) {
                    errorString.push(this.errorHandleFunction(response.data[key].errorCode[j]))
                  }
                  failedUsers.push({
                    fullName: response.data[key].data.firstName + '  ' + response.data[key].data.lastName,
                    error: errorString
                  })
                }
              }
              this.failedUsers = failedUsers.filter((el)=>{
                return el.fullName
              })
              if (this.failedUsers?.length > 0) {
                this.showFailedUsers = true
                this.eventBus.emit("notification", {
                  title: "پیام",
                  type: "error",
                  bodyText: 'خطا در انجام عملیات',
                  time: 5000,
                });

              } else {
                this.searchUser()
                this.excelFile = null
                this.eventBus.emit("notification", {
                  title: "پیام",
                  type: 'success',
                  bodyText: 'همه کاربران با موفقیت ایجاد شدند.',
                  time: 5000,
                });
              }
            })
            .catch((error) => {
              console.error(error)
            })
      }else {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'هیچ فایلی بارگذاری نشده است',
          time: 5000,
        });
      }

    },
    openDeleteUserModal(user) {
      this.userId = user.id
      this.firstName = user.firstName
      this.lastName = user.lastName
      this.isDeleteUserOpen = true
    },
    closeDeleteUserModal() {
      this.userId = null
      this.firstName = null
      this.lastName = null
      this.isDeleteUserOpen = false
    },
    openUpdateUserModal(user) {
      this.userId = user.id
      this.isUpdateUSer = true
      this.isCreateUserOpen = true
    },
    deleteUser() {
      this.restClientUser.delete(this.userId).then(() => {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "success",
          bodyText: 'کاربر مورد نظر حذف شد',
          time: 5000,
        });
        this.closeDeleteUserModal()
        this.searchUser()
      })
    },
    exportUsers() {
      this.restClientUser
          .exportUsers()
          .then((response) => {
            console.error(response)
            // Decode base64 using atob method
            var raw = window.atob(response.data.data)
            // Create an array to store the decoded data
            var uInt8Array = new Uint8Array(raw?.length)
            // blob can only receive binary encoding, need to talk about base64 converted to binary and then stuffed
            for (var i = 0; i < raw?.length; ++i) {
              uInt8Array[i] = raw.charCodeAt(i)
            }
            // A return value is given here. In other methods, you can get the converted blob by using the base64 encoding.
            const link = document.createElement('a')
            const blob = new Blob([uInt8Array], {type: 'application/vnd.ms-excel'})
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            // Set the downloaded Excel table name
            link.setAttribute('download', 'لیست کاربران')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
          .catch((error) => {
            console.error(error)
          })
    },
    activateUsers() {
      this.restClientUser.activateUsers(this.selectedUsers)
          .then((response) => {
            console.log(response)
            this.selectedUsers = []
            this.searchUser()
          })
          .catch((error) => {
            console.log(error)
          })
    },
    deActivateUsers() {
      this.restClientUser.deActivateUsers(this.selectedUsers)
          .then((response) => {
            console.log(response)
            this.selectedUsers = []
            this.searchUser()
          })
          .catch((error) => {
            console.log(error)
          })
    },
    deleteSomeUsers() {
      this.restClientUser.deleteSomeUsers(this.selectedUsers)
          .then((response) => {
            this.search()
            console.log(response)
            this.selectedUsers = []
            this.searchUser()
          })
          .catch((error) => {
            console.log(error)
          })
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
  },
  created() {
    this.searchUser()
  },
  mounted() {
    // setTimeout(() => {
    //   this.pageCount = Math.ceil(this.usersLength / 10)
    // }, 1000)
    this.tableMaxHeight = (window.innerHeight - this.$refs['table-th'].getBoundingClientRect().bottom - 100) > 100 ? window.innerHeight - this.$refs['table-th'].getBoundingClientRect().bottom - 100 + 'px' :  'auto'
    window.addEventListener("resize", () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.$refs.camera) {
          this.tableMaxHeight = (window.innerHeight - this.$refs['table-th'].getBoundingClientRect().bottom - 100) > 100 ? window.innerHeight - this.$refs['table-th'].getBoundingClientRect().bottom - 100 + 'px' :  '110px'
        }

      }, 80);
    });
  }
}
</script>

<style scoped>
.user-management__container {
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
.user-management__header {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.6rem 1.6rem;
  border-bottom: 0.1rem solid #DCDADA;
}

.user-management__header > h1 {
  font-size: 2.5rem;
}

.User-Info__container {
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

.upload-user-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
  width: 100%;
  padding: 1.6rem 1.6rem;
  border-bottom: 0.1rem solid #DCDADA;
}

.upload-user-container > div:first-child {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4rem;
}
.upload-user-actions{
  display: flex;
  flex-direction: row-reverse;
  gap: 1.6rem;
  align-items: center;
  font-size: 1.4rem;
}
.users-table__container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.users-table__choose-all-users {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.6rem;
  height: 4rem;
}

.users-table__choose-actions {
  display: flex;
  flex-direction: row-reverse;
  gap: 0.8rem;
  align-items: center;
  margin-right: 3rem;
}


.users-table__choose-all-users > div {
  display: flex;
  gap: 0.8rem;
  font-size: 1.4rem;
  font-weight: 400;
  align-items: center;
}

.users-table__th {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1.6rem;
  min-width: 60rem;
}

.users-table__th > span {
  width: 18%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
}

.users-table__th > span:last-child {
  width: 10%;
  min-width: 6rem;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-end;
}
.users-table__th__ltr {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1.6rem;
  min-width: 60rem;
}

.users-table__th__ltr > span {
  width: 18%;
display: flex;
  justify-content: left;
  font-size: 1.4rem;
  font-weight: 700;
}

.users-table__th__ltr > span:last-child {
  width: 10%;
  min-width: 6rem;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-end;
}

.user-management__table--container {
  width: 100%;
  overflow-x: auto;
  direction: ltr;
}

.users-table__Ul {
  width: 100%;
  display: flex;
  flex-direction: column;
  direction: ltr;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  min-width: 60rem;
}

.users-table__list {
  width: 100%;
  display: flex;
  padding: 1.6rem;
}
.users-table__list__ltr{
  width: 100%;
  display: flex;
  padding: 1.6rem;
}

.users-table__list:nth-child(odd) {
  background-color: #F6F6F7;
}

.users-table__list > div {
  width: 18%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}
.users-table__list > div:last-child {
  position: relative;
  left: -1rem;
  width: 10%;
}

.users-table__list__ltr:nth-child(odd) {
  background-color: #F6F6F7;
}

.users-table__list__ltr > div {
  width: 18%;
  text-align: left;
  font-size: 1.4rem;
  font-weight: 400;
  direction: ltr;
  display: flex;
  justify-content: left;
}
.users-table__list__ltr > div:last-child {
  position: relative;
  justify-content: right;
  width: 10%;
}
.users-table__list__ltr > div:first-child {
  position: relative;
  justify-content: left;
}

.user-info {
  display: block;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  font-size: 1.4rem;
  font-weight: 400;
}



.users-table__list > div:last-child {
  width: 10%;
  min-width: 6rem;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
}

.users-table__list > div > input {
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
}
.users-table__list_ltr > div:last-child {
  width: 10%;
  min-width: 6rem;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
}

.users-table__list__ltr > div > input {
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
}

.pre-button-pagination {
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
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
  gap: 0.4rem;
  align-items: center;
  position: relative;
  left: -5rem;
  z-index: -1
}

.next-button-pagination > span {
  font-weight: 400;
  font-size: 1.2rem
}

.no-info__user-management {
  width: 100%;
  height: 8rem;
  display: flex;
  justify-content: center;
  align-items: center
}

.user-length-info {
  display: flex;
  flex-direction: row-reverse;
  gap: 0.8rem;
  align-items: center;
}

.user-management__change-page {
  width: 100%;
  height: 6.5rem;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
  padding: 0 1.6rem;
}

.user-management__change-page > div:first-child {
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  color: #75758F
}

.change-user-stat-enter-active {
  animation: fade .2s ease-out
}

.change-user-stat-leave-active {
  animation: fade .2s ease-in reverse;
}

.delete-user-modal-header {
  width: 40rem;
  padding: 2rem 0;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.1rem solid #DCDADA;
}

.delete-user-modal-body {
  width: 40rem;
  padding: 0 0 3rem 0;
  align-items: center;
  border-bottom: 0.1rem solid #DCDADA;
  font-size: 1.6rem;
  font-weight: 400;
  direction: rtl;
}

.delete-user-modal-action {
  width: 40rem;
  height: 5rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
}
.problems-table__list:nth-child(odd) {
  background-color: #F6F6F7;
}

@keyframes fade {
  from {
    opacity: 0;
    transform: scale(0.7, 0.7);
  }
  to {
    opacity: 1;
    transform: scale(1, 1);

  }
}

@media (max-width: 830px) {
.user-length-info{
  display: none;
}
  .user-management__change-page{
    justify-content: center;
  }
  .user-management__change-page > div:first-child {
    display: none;
  }
  .users-table__choose-all-users{
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    padding: 0.8rem 1.6rem;
    height: auto;
  }
  .users-table__choose-all-users > div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    font-size: 1.4rem;
    font-weight: 400;
    align-items: center;
  }
  .users-table__choose-actions {
    display: flex;
    flex-direction: row-reverse;
    gap: 0.8rem;
    align-items: center;
    margin-right:0;
  }

}

@media (max-width: 630px) {


  .upload-user-container{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    padding: 1.6rem 1.6rem;
    border-bottom: 0.1rem solid #DCDADA;
    gap: 0.8rem;
  }
  .upload-user-container > div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.6rem;
    font-size: 1.4rem;

  }

  .delete-user-modal-header {
    width: 33rem;
  }

  .delete-user-modal-body {
    width: 33rem;
    padding: 2rem 0;
    white-space: pre-line;
    overflow-wrap: break-word;
  }

  .delete-user-modal-action {
    width: 33rem;

  }
  .user-management__header {
    display: flex;
   flex-wrap: wrap;
    align-items: center;
    width: 100%;
    padding: 1.6rem 1.6rem;
    gap: 2rem;
    border-bottom: 0.1rem solid #DCDADA;
  }

  .user-management__header > h1 {
    font-size: 2.5rem;
  }
}
</style>

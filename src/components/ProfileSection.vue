<template>
  <div v-if="!isMobile" class="profile-fragment" :style="{direction:$i18n.locale !== 'en' ? 'rtl': 'ltr'}">
    <div class="profile-details">
      <div class="user-details">
        <div class="user-details__display-name">{{name}}</div>
        <div class="user-details__tenant-name">{{tenantName}}</div>
      </div>
      <div>
        <div v-show="!isDropDownOpen.flag" style="cursor: pointer" @click="openProfileActionsDropDown" >
          <img draggable="false"  src="/img/down.svg" style="width: 16px; height: 16px" alt="not loaded">
        </div>
        <div v-show="isDropDownOpen.flag" style="cursor: pointer">
          <img draggable="false"   src="/img/up.svg" style="width: 16px; height: 16px" alt="not loaded">
        </div>
      </div>
    </div>
    <img draggable="false" v-if="imgURL" :src="imgURL" alt="not loaded" style="width: 32px; height: 32px;border-radius: 50%;object-fit: cover;">
    <img draggable="false" v-else src="/img/contact.svg" alt="not loaded" style="width: 32px; height: 32px">
      <base-mini-drop-down
          v-if="!isMobile"
          direction-y="downward"
          direction-x="middle"
          :open="isDropDownOpen.flag"
          :items="dropDownItems"
          @select-item="getSelectedItem"
      >
      </base-mini-drop-down>

<!--    <img draggable="false" v-else src="/img/up.svg" alt="not loaded" class="avatar__image">-->
<!--    <div class="profile__name-and-tenant"><span>{{ name }}</span>&nbsp;<span>({{ tenantName }})</span></div>-->
<!--      <div class="profile">-->
<!--        <div :class="isMobile ?  'profile__actions-mobile' : 'profile__actions'" ref="mini-drop-down-container">-->
<!--          <img draggable="false" @click="openSheet" v-if="isMobile" src="/img/hamburger-menu.svg" alt="not loaded">-->
<!--          <div  class="down-arrow-arrow" v-else >-->
<!--             <span v-show="!isDropDownOpen.flag" >-->
<!--            <svg   @click="openSheet" style="transform: rotate(-90deg); width: 70% ; cursor: pointer;position: relative;z-index: 10"  data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">-->
<!--              <path-->
<!--                  d="M16.617,22a.5082.5082,0,0,0,.3583-.8685L7.966,12.1749l9.1467-9.31a.5081.5081,0,0,0-.7245-.7127l-9.5011,9.67a.5083.5083,0,0,0,.004.7166l9.3676,9.313A.5079.5079,0,0,0,16.617,22Z"/>-->
<!--            </svg>-->
<!--            </span>-->
<!--            <span v-show="isDropDownOpen.flag" >-->
<!--               <svg style="transform: rotate(+90deg); width: 70%;position: relative;z-index: 10"  @click="openSheet"  data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">-->
<!--              <path-->
<!--                  d="M16.617,22a.5082.5082,0,0,0,.3583-.8685L7.966,12.1749l9.1467-9.31a.5081.5081,0,0,0-.7245-.7127l-9.5011,9.67a.5083.5083,0,0,0,.004.7166l9.3676,9.313A.5079.5079,0,0,0,16.617,22Z"/>-->
<!--            </svg>-->
<!--            </span>-->
<!--          </div>-->
<!--          <base-mini-drop-down-->
<!--              v-if="!isMobile"-->
<!--              class="ham__icon"-->
<!--              direction-y="downward"-->
<!--              direction-x="middle"-->
<!--              :open="isDropDownOpen.flag"-->
<!--              :items="dropDownItems"-->
<!--              @select-item="getSelectedItem"-->
<!--          >-->
<!--          </base-mini-drop-down>-->
<!--          <vue-bottom-sheet :click-to-close="true" :overlay="false" effect="fx-fadein-scale" :swipe-able="true"-->
<!--                            :is-full-screen="true" :max-height="'100%'" ref="myBottomSheet">-->
<!--            <div @click.stop="closeSheet" class="close-device-test-model&#45;&#45;sheet" >-->
<!--              &#10060;-->
<!--            </div>-->
<!--            <div class="profile-info__fragment">-->
<!--              <img draggable="false" src="/img/avatar.svg" alt="not loaded">-->
<!--              <div class="profile__name-and-tenant&#45;&#45;sheet"><span>{{ name }}</span>&nbsp;<span>({{ tenantName }})</span></div>-->
<!--            </div>-->

<!--            <div v-if="false" class="nav-bar__date-filters&#45;&#45;sheet">-->
<!--              <date-filter :date-info="dateRange.from" type="from" @date-modified="getModifiedDate($event, 'from')"></date-filter>-->
<!--              <date-filter :date-info="dateRange.to" type="to" @date-modified="getModifiedDate($event, 'to')"></date-filter>-->
<!--              <div class="nav-bar__am-i-moderator&#45;&#45;sheet">-->
<!--                <label  class="am-i-moderator__label&#45;&#45;sheet">جلساتی که در آنها مدیر هستم</label>-->
<!--                <am-i-moderator-button></am-i-moderator-button>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="setting">-->
<!--              <p @click.stop="openSetting">-->
<!--               {{$store.getters.t('setting')}}-->
<!--              </p>-->
<!--              <p @click="logOut">-->
<!--                {{$store.getters.t('log-out')}}-->
<!--              </p>-->
<!--            </div>-->

<!--          </vue-bottom-sheet>-->
<!--        </div>-->
<!--        </div>-->

<!--      <div class="profile__tenant-name">({{ tenantName }})</div>-->
    </div>
  <base-modal is-blur="true" :open="isDevicesTestModalOpen" @close-modal="closeDeviceTestModal">
    <template #modal-header>
      <div class="header-close-icon">
        <div class="close-device-test-model">
          <close-icon  width="24" height="24" color="#292933" @click-icon="closeDeviceTestModal" ></close-icon>
        </div>
      </div>
    </template>
    <template #modal-body>
      <device-test></device-test>
    </template>
    <template #modal-buttons>
      <base-button
          :is-active="true"
          :button-inner-txt="$store.getters.t('OK')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=16.1rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
          @btn-clicked="closeDeviceTestModal"
      ></base-button>

    </template>
  </base-modal>
  <base-modal :open="isLogOut" :is-loading="'isLoading'" is-blur="true" modal-color="transparent">
    <template #modal-body>
      <base-loading-spinner size-ratio="1.2" spinner-color="#409EFF">
        <template #loading-content>
          <div class="loading__extra-content--text" style = "color: #409EFF">{{$store.getters.t("pleaseWait")}}</div>
        </template>
      </base-loading-spinner>
    </template>
  </base-modal>

<!--  <base-modal is-blur="true" :open="isProfileModalOpen" @close-modal="isProfileModalOpen = false">-->
<!--    <template #modal-header>-->

<!--        <div  style="height: 2rem;display: flex;justify-content: space-between;"  :style="{direction:$i18n.locale !== 'en' ? 'rtl': 'ltr'}">-->
<!--          <h2>{{ $store.getters.t("profile") }}</h2>-->
<!--          <close-icon  width="24" height="24" color="#292933" @click-icon="isProfileModalOpen = false" ></close-icon>-->
<!--        </div>-->

<!--    </template>-->
<!--    <template #modal-body>-->
<!--      <div v-if="!isChangingPassword && !IsChangingProfileOpen" style="width: 30rem;height: 25rem;display: flex;flex-direction: column;gap:1.6rem;align-items: center">-->
<!--        <div style="position: relative">-->
<!--          <div style="background-color: #2AB459;width: 2.5rem;height: 2.5rem;border-radius: 50%;display: flex;justify-content: center;align-items: center;position: absolute;top: 0;cursor: pointer;" @click="IsChangingProfileOpen = true">-->
<!--&lt;!&ndash;            <input style="display: none" type="file" ref="fileInput" accept="image/*" @input="uploadImage">&ndash;&gt;-->
<!--            <img draggable="false" src="/img/edit-profile.svg" alt="not-loaded">-->
<!--          </div>-->
<!--          <img draggable="false" v-if="imgURL" :src="imgURL" alt="not-loaded" style="width: 10rem;height: 10rem;border-radius: 50%;object-fit: cover;">-->
<!--          <span v-else style="width: 10rem;height: 10rem;border-radius: 50%;background-color: #1B76FF;color: white;display: flex;justify-content: center;align-items: center">{{$store.getters.displayName.split('')[0]}}</span>-->
<!--        </div>-->
<!--        <div style="font-weight: 700">-->
<!--          {{$store.getters.displayName}}-->
<!--        </div>-->
<!--        <div>-->
<!--          {{$store.getters.email}}-->
<!--        </div>-->
<!--        <div>-->
<!--          {{$store.getters.phoneNumber}}-->
<!--        </div>-->
<!--      </div>-->



<!--      <div v-if="!isChangingPassword && IsChangingProfileOpen" style="width: 30rem;height: 25rem;display: flex;flex-direction: column;gap:1.6rem;align-items: center">-->
<!--        <div style="position: relative">-->
<!--          <img draggable="false" v-if="imgURL" :src="imgURL" alt="not-loaded" style="width: 15rem;height: 15rem;border-radius: 50%;object-fit: cover;">-->
<!--          <img draggable="false" v-else src="/img/contact.svg" alt="not-loaded" style="width: 15rem;height: 15rem;border-radius: 50%;object-fit: cover;">-->
<!--&lt;!&ndash;          <span v-else style="width: 10rem;height: 10rem;border-radius: 50%;background-color: #1B76FF;color: white;display: flex;justify-content: center;align-items: center">{{$store.getters.displayName.split('')[0]}}</span>&ndash;&gt;-->
<!--        </div>-->
<!--&lt;!&ndash;        <div style="font-size: 1.8rem; color: #292933">{{$store.getters.t('drag-photo-here')}}</div>&ndash;&gt;-->

<!--        <div style="position: relative">-->




<!--          <button :style="{border: (isDragOver || isFileUploaded) ? 'dashed 0.3rem darkBlue' : 'dashed 0.2rem #1a73e8',height: '5rem',width:'20rem','background-color': (isDragOver || isFileUploaded) ? '#b2dcf1' : 'rgba(130, 176, 246, 0.13)','-webkit-box-shadow': isDragOver ?  '-1px 6px 15px -4px rgba(0,0,0,0.62)':'',-->
<!--  'box-shadow': (isDragOver) ?  '-1px 6px 15px -4px rgba(0,0,0,0.62)' : ''}">-->

<!--            <span v-if="!isFileUploaded" style="color: #292933">   {{$store.getters.t('drag-photo-here')}}</span>-->
<!--            <span v-else style="color: #2AB459">{{$store.getters.t('file-selected')}}</span>-->
<!--          </button>-->





<!--          <input style="  width: 20rem;-->
<!--  height: 5rem;-->
<!--  opacity: 0;-->
<!--  position: absolute;-->
<!--  top: 50%;-->
<!--  left: 50%;-->
<!--  transform: translate(-50%,-50%);-->
<!--  z-index: 1;-->
<!--  cursor:pointer;-->
<!--  background-color: #d4eaf5;"-->
<!--                 @dragenter="isDragOver = true"-->
<!--                 @dragleave="isDragOver = false"-->
<!--                 @click="isDragOver = false" type="file" ref="fileInput" accept="image/*" @input="uploadImage">-->
<!--        </div>-->

<!--        <div style="font-size: 1.4rem; color: #292933">{{  $store.getters.t('or')}}</div>-->
<!--      </div>-->




<!--      <div v-else-if=" isChangingPassword && changePasswordStep === 'verificationCode'" style="width: 30rem;height: 25rem;display: flex;flex-direction: column;gap:1.6rem;align-items: center">-->
<!--        <div>کد تایید را وارد کنید</div>-->
<!--        <base-form-input-->
<!--            auto-complete="off"-->
<!--            v-for="info in verificationFormInfo"-->
<!--            :key="info.id"-->
<!--            :type="info.type"-->
<!--            :id="info.id"-->
<!--            :label="info.label"-->
<!--            :is-authentication-code="true"-->
<!--            :validation-type="info.validationType"-->
<!--            :is-login-form="true"-->
<!--            v-model.trim="info.inputVal"-->
<!--            @validity-status="checkEachInputValidity"-->
<!--        >-->
<!--        </base-form-input>-->
<!--        <div style="margin-top: 1rem">-->
<!--          <the-timer  :minutes="timerMinutes" :seconds="timerSeconds" :start-flag="isTimerStarted" @timer-status="getTimerStatus"></the-timer>-->
<!--        </div>-->

<!--        <div :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" v-if="!isTimerStarted" >-->
<!--          <div style="margin: 1rem 0 3rem 0;-->
<!--  width: 100%;-->
<!--  display: flex;-->
<!--  flex-direction: row;">-->
<!--        <span style="  color: #1a73e8;-->
<!--  cursor: pointer;-->
<!--  width: 100%;-->
<!--  text-align: center;" @click="resendVerificationCode"-->
<!--        >{{$store.getters.t("codeRequest")}}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->






<!--      <div v-else-if=" isChangingPassword && changePasswordStep === 'changePassword'" style="width: 30rem;height: 25rem;display: flex;flex-direction: column;gap:1.6rem;align-items: center">-->
<!--        <div>تغییر رمز</div>-->
<!--        <base-form-input-->
<!--            v-for="info in newPasswordFormInfo"-->
<!--            auto-complete="off"-->
<!--            :key="info.id"-->
<!--            :type="info.type"-->
<!--            :id="info.id"-->
<!--            :label="info.label"-->
<!--            :is-authentication-code="false"-->
<!--            :validation-type="info.validationType"-->
<!--            :is-login-form="true"-->

<!--            v-model="info.inputVal"-->
<!--            @validity-status="checkEachInputValidityNewPassword"-->
<!--        >-->
<!--        </base-form-input>-->
<!--      </div>-->






<!--    </template>-->
<!--    <template #modal-buttons>-->

<!--      <base-button-->
<!--          v-if="!isChangingPassword && !IsChangingProfileOpen"-->
<!--          :is-active="true"-->
<!--          :button-inner-txt="$store.getters.t('change-password')"-->
<!--          :continuous-params="[-->
<!--          'background-color=#1B76FF',-->
<!--          'color=white', 'width=16.1rem','height=4.8rem',-->
<!--          'font-size=1.4rem', 'font-weight= 700',-->
<!--          'border-radius=0.6rem'-->
<!--          ]"-->
<!--          @btn-clicked="changePassword"-->
<!--      ></base-button>-->
<!--      <base-button-->
<!--          v-else-if=" isChangingPassword && changePasswordStep === 'verificationCode'"-->
<!--          :is-active="true"-->
<!--          :button-inner-txt="$store.getters.t('confirmCode')"-->
<!--          :continuous-params="[-->
<!--          `background-color= ${(verificationFormInfo[0].inputVal.trim().length !== 6) ? '#aaa' : '#1B76FF'}`,-->
<!--          'color=white', 'width=16.1rem','height=4.8rem',-->
<!--          'font-size=1.4rem', 'font-weight= 700',-->
<!--          'border-radius=0.6rem',-->
<!--          ]"-->
<!--          @btn-clicked="submitVerificationCode"-->
<!--      ></base-button>-->
<!--      <base-button-->
<!--          v-else-if=" isChangingPassword && changePasswordStep === 'changePassword'"-->
<!--          :is-active="true"-->
<!--          :button-inner-txt="$store.getters.t('confirm')"-->
<!--          :continuous-params="[-->
<!--          'background-color=#1B76FF',-->
<!--          'color=white', 'width=16.1rem','height=4.8rem',-->
<!--          'font-size=1.4rem', 'font-weight= 700',-->
<!--          'border-radius=0.6rem'-->
<!--          ]"-->
<!--          @btn-clicked="submitPassword"-->
<!--      ></base-button>-->
<!--      <div v-if="!isChangingPassword && IsChangingProfileOpen" style="display: flex;gap: 1.6rem">-->
<!--        <button-->
<!--            class="choose-image-button"-->
<!--            @click="OpenUploadFile"-->
<!--        >-->
<!--          انتخاب عکس از کامپیوتر-->
<!--        </button>-->

<!--&lt;!&ndash;        <base-button&ndash;&gt;-->

<!--&lt;!&ndash;            :is-active="true"&ndash;&gt;-->
<!--&lt;!&ndash;            button-inner-txt="گرفتن عکس"&ndash;&gt;-->
<!--&lt;!&ndash;            :continuous-params="[;-->
<!--&lt;!&ndash;          'background-color=white',&ndash;&gt;-->
<!--&lt;!&ndash;          'color=#1B76FF', 'width=16.1rem','height=4.8rem',&ndash;&gt;-->
<!--&lt;!&ndash;          'font-size=1.3rem', 'font-weight= 700',&ndash;&gt;-->
<!--&lt;!&ndash;          'border-radius=0.6rem','border=  0.1rem solid #1B76FF'&ndash;&gt;-->
<!--&lt;!&ndash;          ]"&ndash;&gt;-->
<!--&lt;!&ndash;            @btn-clicked="takePhoto"&ndash;&gt;-->
<!--&lt;!&ndash;        ></base-button>&ndash;&gt;-->
<!--      </div>-->
<!--    </template>-->
<!--  </base-modal>-->
  <div v-if="isProfileModalOpen">
    <the-profile :is-profile-modal-open="isProfileModalOpen" :img-u-r-l="imgURL" @close-profile-modal="isProfileModalOpen = false"></the-profile>
  </div>
  <base-modal :open="loginIsTriggered" :is-loading="'isLoading'" is-blur="true" modal-color="transparent">
    <template #modal-body>
      <base-loading-spinner size-ratio="1.2" spinner-color="#409EFF">
        <template #loading-content>
          <div class="loading__extra-content--text" style="color: #409EFF">{{ $store.getters.t("pleaseWait") }}</div>
        </template>
      </base-loading-spinner>
    </template>
  </base-modal>

</template>

<script>
import MiniDropDownHandler from "../utils/mini.drop.down.actions";
import BaseMiniDropDown from "./UI/BaseMiniDropDown";
import DeviceTest from "./DeviceTest";
import BaseModal from "./UI/BaseModal";
import BaseButton from "./UI/BaseButton";
// import axios from 'axios';
// import VueBottomSheet from "./UI/VueBottomSheet";
// import DateFilter from "./DateFilter";
// import AmIModeratorButton from "./AmIModeratorButton";
import DetectMobile from "../utils/detectMobile";
import BaseLoadingSpinner from "./UI/BaseLoadingSpinner";
import RestClient from "@/api/restClient";
import CloseIcon from "@/components/UI/Icons/CloseIcon.vue";
import TheProfile from "@/components/TheProfile.vue";
export default {
  name: "ProfileSection",
  components: { CloseIcon, BaseButton, BaseModal, DeviceTest,BaseLoadingSpinner,BaseMiniDropDown,TheProfile},
  props : ['dateRange'],
  data(){
    return {
      restClientLdap: new RestClient('ldap'),
      restClientUser: new RestClient('user'),
      dropDownIsOpen:false,
      isMobile:false,
      isSheetVisible: false,
      isDevicesTestModalOpen : false,
      isLogOut:false,
      dropDownItems: [
        // {
        //   label: this.$store.getters.t("profile"),
        // },
        {
          label: this.$store.getters.t("device-setting"),
        },
        {
          label: this.$store.getters.t("log-out"),
        },
      ],
      isDropDownOpen: {flag: false},
      name: this.$store.getters.displayName,
      tenantName: this.$store.getters.tenant,
      imgURL:'',
      isProfileModalOpen:false,
      hasProfileImg:false,
      imageFile:null,
      isChangingPassword:false,
      IsChangingProfileOpen:false,
      changePasswordStep:'',
      verificationFormInfo : [
        {
          label: 'کد احراز هویت',
          type: 'text',
          validationType: 'OTP-verification-code',
          id: 'verification-code',
          inputVal: '',
          isValid: false,
          loginIsTriggered:false,
        },
      ],
      verificationCode:'',
      areAllInputsValid:'not-decided-yet',
      newPasswordFormInfo: [
        {
          label: 'گذرواژه جدید',
          type: 'password',
          validationType : 'password',
          id: 'new-password',
          inputVal: '',
          isValid: false,
        },
        {
          label: 'تکرار گذرواژه جدید',
          type: 'password',
          validationType: 'password',
          id: 'repeat-new-password',
          inputVal: '',
          isValid: false,
        },
      ],
      restClientAuth: new RestClient('auth'),
      loginIsTriggered:false,
      timerMinutes : 0,
      timerSeconds : 0,
      isTimerStarted : false,
      isDragOver:false,
      isFileUploaded:false
    }
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  methods: {
    logOut(){
      this.isLogOut = true
      this.$store
          .dispatch("LogOut")
          .then(() => {
            this.isLogOut = false
            localStorage.removeItem('user-role')
            this.$router.push({
              name: "Login",
              path: "/login",
            });
          })
          .catch(() => {
            this.isLogOut = false
            this.$router.push({
              name: "Login",
              path: "/login",
            });
          });
    },
    openSetting(){
      this.closeSheet()
      this.isDevicesTestModalOpen = true;
    },
    getModifiedDate(date, type){
      this.$emit('date-modified', date, type);
    },
    closeSheet() {
      if(window.innerWidth <= 1024){
        this.isDropDownOpen.flag = false
      }

      this.close();
      this.isSheetVisible = false
    },
    openSheet(){
      this.dropDownIsOpen = true
      if(window.innerWidth <= 1024){
        this.isDropDownOpen.flag = false
        this.open()
        this.isSheetVisible = true
      }

    },
    open() {
      this.$refs.myBottomSheet.open();

    },
    close() {
      this.$refs.myBottomSheet.close();
    },
    getSelectedItem(item) {
      const selectedItem = this.dropDownItems.find(dropDownItem => dropDownItem.label === item);
      switch (selectedItem.label){
        case this.$store.getters.t("profile"):
          this.isProfileModalOpen = true;
          break;
        case this.$store.getters.t("device-setting"):
          this.isDevicesTestModalOpen = true;
        break;
        case this.$store.getters.t("log-out"):
          this.$emit('log-out')
          this.isLogOut = true
          this.$store
              .dispatch("LogOut")
              .then(() => {
                this.isLogOut = false
                localStorage.removeItem('user-role')
                this.$router.push({
                  name: "Login",
                  path: "/login",
                });
              })
              .catch(() => {
                this.isLogOut = false
                this.$router.push({
                  name: "Login",
                  path: "/login",
                });
              });
        break;
      }
      this.eventBus.emit('close-drop-down');
    },
    closeDeviceTestModal(){
      this.isDevicesTestModalOpen = false;
    },
    openProfileActionsDropDown(){
      if (!this.isDropDownOpen.flag){
        this.isDropDownOpen.flag = true
      }

    },
    arrayBufferToBase64(buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      console.error(window.btoa(binary))
      return window.btoa(binary);
    },
    OpenUploadFile(){
      this.$refs.fileInput.click()
    },
    uploadImage(){
      this.imageFile = this.$refs.fileInput.files[0]
      if (this.imageFile) {
        this.isFileUploaded = true
      }
      // this.changeProfilePicture()
    },
    changeProfilePicture(){
      const formData = new FormData()
      formData.append('imgFile', this.imageFile)
      this.restClientUser.updateAvatar(formData,this.$store.getters.userId).then((response) =>{
        console.error(response)
      }).
      catch((error)=>{
        console.error(error)
      })
    },
    deleteProfilePicture(){

      this.restClientUser.deleteAvatar(this.$store.getters.userId).then((response) =>{
        console.error(response)
      }).catch((error)=>{
        console.error(error)
      })
    },
    checkEachInputValidity(id, isValid){
      const foundFormInfo = this.verificationFormInfo.find(info => info.id === id);
      if(!foundFormInfo) return;
      foundFormInfo.isValid = isValid;
    },
    checkEachInputValidityNewPassword(id, isValid){
      const foundFormInfo = this.newPasswordFormInfo.find(info => info.id === id);
      if(!foundFormInfo) return;
      foundFormInfo.isValid = isValid;
    },

    changePassword(){
        this.loginIsTriggered = true
        this.restClientAuth
            .sendVerificationCode({
              username: this.$store.getters.userName,
              tenant: this.$store.getters.tenant
            })

            .then(() => {
              this.startTimer();
              this.eventBus.emit("notification", {
                title: "پیام",
                type: "success",
                bodyText: this.$store.getters.t("send-code-to-cell-phone"),
                time: 5000,
              });
              this.loginIsTriggered = false
              this.isChangingPassword = true
              this.changePasswordStep = 'verificationCode'


            }).catch(error => {
          this.loginIsTriggered = false
          console.error(error)
        })

    },
    checkAllInputsValidity(){
      const inputsValidationResult = this.verificationFormInfo.every(info => info.isValid === 'yes');
      if(inputsValidationResult){
        this.areAllInputsValid = 'yes';
      } else {
        this.areAllInputsValid = 'no';
      }
    },
    checkAllInputsValidityNewPassword(){
      console.error( this.newPasswordFormInfo)
      const inputsValidationResult = this.newPasswordFormInfo.every(info => info.isValid === 'yes');
      if(inputsValidationResult){
        this.areAllInputsValid = 'yes';
      } else {
        this.areAllInputsValid = 'no';
      }
    },
    submitVerificationCode(){
      this.checkAllInputsValidity();
      if(this.areAllInputsValid === 'yes'){
        this.confirmVerificationCode()
      }
    },
    confirmVerificationCode() {
      this.loginIsTriggered = true
      // this.$refs.authenticationCode.isAuthenticationCodeInvalid = false
      const authentication = [this.verificationFormInfo[0].inputVal];
      // this.code = authentication[0]
      this.restClientAuth
          .confirmVerification({
            code: authentication[0],
            username: this.$store.getters.userName,
            tenant: this.$store.getters.tenant
          })
          .then((data) => {
            if(data.success === true){
              this.isTimerStarted = false
              this.verificationCode = this.verificationFormInfo[0].inputVal
              this.changePasswordStep = 'changePassword'
              this.verificationFormInfo[0].inputVal = ''
              setTimeout(()=>{
                this.newPasswordFormInfo[0].inputVal = ''
                this.loginIsTriggered = false
              },1000)
            }
          }).catch((error) => {
        console.error(error)
        this.loginIsTriggered = false
      }).finally(() => {
        setTimeout(()=>{
          this.newPasswordFormInfo[0].inputVal = ''
          this.loginIsTriggered = false
        },1000)
      })
      // }else{
      //   this.btnAnimation = true
      // }

    },
    submitPassword(){
      this.checkAllInputsValidityNewPassword()
      if(this.areAllInputsValid === 'yes' ){
        this.loginIsTriggered = true
        const newPassword = [this.newPasswordFormInfo[0].inputVal,this.newPasswordFormInfo[1].inputVal];
        if (newPassword[0] === newPassword[1]) {
          // this.$refs.newPass.isNewPassInvalid = false
          // this.$refs.repeatNewPass.isRepeatedPassInvalid = false
          this.restClientAuth
              .resetPassword({
                password: newPassword[0],
                confirmPassword:newPassword[1],
                code: this.verificationCode,
                username: this.$store.getters.userName,
                tenant: this.$store.getters.tenant
              })
              .then(() => {
                this.loginIsTriggered = false

                this.newPasswordFormInfo[0].inputVal = ''
                this.newPasswordFormInfo[1].inputVal = ''
                this.isChangingPassword = false
                this.changePasswordStep = ''
                this.loginIsTriggered = false
                  this.eventBus.emit('notification', {
                    title: 'پیام',
                    type: 'success',
                    bodyText: this.$store.getters.t('password-changed-successfully'),
                    time: 5000

                  })

              }).finally(() => {
            this.loginIsTriggered = false
          }).catch((error) => {
            this.loginIsTriggered = false
            console.error(error)
            this.btnAnimation = true
          })
        } else {
          this.loginIsTriggered =false
          this.btnAnimation = true
          this.isNewPassInvalid = true
          this.btnAnimation = true
          // this.$refs.newPass.isNewPassInvalid = true
          // this.$refs.repeatNewPass.isRepeatedPassInvalid = true
          // this. isNewPassInvalid=true

          this.eventBus.emit('notification', {
            title: 'پیام',
            type: 'error',
            bodyText: this.$store.getters.t("invalid_repeated_password"),
            time: 5000

          })

        }
      }else{
        this.btnAnimation = true


      }
    },
    getTimerStatus(stat){
      if(stat === false){
        this.timerSeconds = 0;
        this.timerSeconds = 0;
      }
      this.isTimerStarted = stat;
    },
    startTimer(){
      this.timerMinutes = 1;
      this.timerSeconds = 59;
      this.isTimerStarted = true;
    },
    resendVerificationCode(){
      this.restClientAuth
          .sendVerificationCode({
            username: this.$store.getters.userName,
            tenant: this.$store.getters.tenant
          })

          .then(() => {
            this.startTimer();
            this.eventBus.emit("notification", {
              title: "پیام",
              type: "success",
              bodyText: this.$store.getters.t("send-code-to-cell-phone"),
              time: 5000,
            });

          }).catch(error => {
        this.loginIsTriggered = false
        console.error(error)
      })

    },
  },
  mounted() {

    this.eventBus.on('img-profile-deleted',()=>{
     this.imgURL = ''
      if (this.isMobile){
        this.eventBus.emit('image-url', '')
      }
      this.eventBus.emit("notification", {
        title: "پیام",
        type: "success",
        bodyText: this.$store.getters.t('profile-picture-deleted'),
        time: 5000,
      });
    })

    this.eventBus.on('img-profile-changed',()=>{
      // this.restClientUser.getAvatar(this.$store.getters.userId).then((response) =>{
      //   const base64Image = this.arrayBufferToBase64(response);
      //   if (base64Image){
      //     this.imgURL = `data:image/jpeg;base64,${base64Image}`;
      //     if (this.isMobile){
      //       this.eventBus.emit('image-url', this.imgURL)
      //     }
      //
      //     this.$store.dispatch('setImageSrc',this.imgURL)
      //   }
      //
      // })
      this.eventBus.emit("notification", {
        title: "پیام",
        type: "success",
        bodyText: this.$store.getters.t('profile-picture-saved'),
        time: 5000,
      });
    })
    // this.restClientUser.getAvatar(this.$store.getters.userId).then((response) =>{
    //   const base64Image = this.arrayBufferToBase64(response);
    //   if (base64Image){
    //     this.imgURL = `data:image/jpeg;base64,${base64Image}`;
    //     this.$store.dispatch('setImageSrc',this.imgURL)
    //     if (this.isMobile){
    //       this.eventBus.emit('image-url', this.imgURL)
    //     }
    //   }
    //
    // }).
    // catch((error)=>{
    //   console.error(error)
    // })
if (this.$store.getters.LDAPID){
  this.restClientLdap.getLdapPicture(this.$store.getters.userName, this.$store.getters.LDAPID).then((response)=>{
    // const blob = new Blob([response.data], { type: 'image/jpeg' });
    // this.imgURL = URL.createObjectURL(blob)
    const base64Image = this.arrayBufferToBase64(response);
    this.imgURL = `data:image/jpeg;base64,${base64Image}`;
    if (this.isMobile){
      this.eventBus.emit('image-url', this.imgURL)
    }

    console.error(this.imgURL)
  }).catch((error) => {
    console.error(error)
  })
}

    this.eventBus.on('open-setting-modal',()=>{
      this.isDevicesTestModalOpen = true;
    })
    this.eventBus.on("toggle", () => {
      this.close()
      this.isSheetVisible = false

    });
    new MiniDropDownHandler(this.$refs['mini-drop-down-container'], this.isDropDownOpen);
    this.eventBus.on('open-profile-modal',()=>{
      this.isProfileModalOpen = true;
    })
  },
}
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
textarea {
  width: 46rem;
  height: 10.6rem;
  margin-right: 3.2rem;
  border-radius: 1rem;
  border: solid 0.1rem #707070;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  resize: none;
}
textarea:focus {
  outline: none;
  border-color: #1a73e8;
}
.header-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 55rem;
  height: 5rem;
}
.main-body__polling {
  width: 55rem;
  height: 45rem;
  display: flex;
  flex-direction: column;

  /*align-items: center;*/
}
.question-title {
  width: 100%;
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.question-answer {
  width: 100%;
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 2rem;
}
.button-container {
  width: 55rem;
  height: 7rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.question-title__text {
  width: 46rem;
  height: 3.6rem;
  margin: 0 0.3rem 0 0;
  border-radius: 1rem;
  border: solid 0.1rem #707070;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}
.test__question-title {
  width: 80%;
  height: 35rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 2rem;
  margin-right: 7rem;
  overflow-y: auto;
}

.profile-fragment {
  position: relative;
  width:fit-content;
  height: 4.8rem;
  display: flex;
  border-radius: 0.8rem;
  flex-direction: row-reverse;
  align-items: center;
  background-color: #F6F6F7;
  gap: 0.8rem;
  padding: 0.8rem 1.6rem;
}
.profile-actions-fragment{
  position: absolute;
  bottom: 0;
}
.profile-details{
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  gap: 0.8rem;
  max-width: 14rem;
}
.user-details {
  display: flex;
  flex-direction: column;
  direction: rtl;
  font-size: 1.2rem;
}
.user-details__display-name{
  max-width: 12rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-details__tenant-name {
  font-weight: bold;
}

/*.profile__avatar {*/
/*  width: 4.5rem;*/
/*  height: 4.5rem;*/
/*  background-color: #f1f1f1;*/
/*  border-radius: 50%;*/
/*}*/
/*.profile {*/
/*  display: flex;*/
/*  font-size: 1.2rem;*/
/*  color: black;*/
/*  width: 3rem;*/
/*  height: 3rem;*/
/*}*/
/*.profile-fragment > img {*/
/*  width: 4.5rem;*/
/*  height: 4.5rem;*/
/*}*/
/*.profile__name-and-tenant{*/
/*  display: flex;*/
/*  font-size: 1.2rem;*/
/*  color : black;*/
/*  direction: rtl;*/
/*}*/
/*.profile__name-and-tenant > span:first-child{*/
/*  white-space: nowrap;*/
/*}*/
/*.profile__tenant-name {*/
/*  font-size: 1.2rem;*/
/*  color: black;*/
/*  direction: rtl;*/
/*}*/

/*.profile__actions {*/
/*  position: relative;*/
/*  font-weight: bold;*/
/*  font-size: 3rem;*/
/*  line-height: 1rem;*/


/*}*/
/*.profile__actions-mobile {*/
/*  position: absolute;*/
/*  font-weight: bold;*/
/*  font-size: 3rem;*/
/*  line-height: 1rem;*/
/*  cursor: pointer;*/
/*  right: 2rem;*/
/*  top: 2rem;*/

/*}*/
/*.down-arrow-arrow{*/
/*  width: 3rem;*/
/*}*/

/*@media (max-width: 1024px) {*/
/*  .avatar__image{*/
/*    display: none;*/
/*  }*/
/*  .ham__icon{*/
/*    display: none;*/
/*  }*/
/*  .profile-info__fragment{*/
/*    width: 100%;*/
/*    display: flex;*/
/*    flex-direction: row-reverse;*/
/*    align-items: center;*/
/*    height: 8rem;*/
/*    border-bottom: 0.1rem solid black;*/

/*  }*/
/*  .profile-info__fragment div {*/
/*    color: black;*/
/*    margin-right: 1.5rem;*/
/*  }*/
/*  .profile-info__fragment img {*/
/*    width: 5rem;*/
/*    height: 5rem;*/
/*  }*/
/*  .close-device-test-model--sheet{*/
/*    margin-top: 1rem;*/
/*    margin-right: 1rem;*/
/*    display: flex;*/
/*    flex-direction: row-reverse;*/
/*    height: 2rem;*/
/*    font-size: 70%;*/
/*    position: relative;*/
/*    z-index: 1000;*/
/*  }*/
/*  .profile__name-and-tenant{*/
/*    display: none;*/
/*  }*/
/*  .profile__name-and-tenant--sheet{*/
/*    display: flex;*/
/*    font-size: 1.2rem;*/
/*    color : black;*/
/*    direction: rtl;*/
/*  }*/
/*  .profile__name-and-tenant--sheet > span:first-child{*/
/*    white-space: nowrap;*/
/*  }*/
/*  .nav-bar__date-filters--sheet{*/
/*    width: 100%;*/
/*    display: flex;*/
/*    flex-direction: column;*/
/*    height: 25rem;*/
/*    justify-content:space-around ;*/
/*    border-bottom: 0.1rem solid black;*/
/*  }*/
/*  .am-i-moderator__label--sheet{*/
/*    color: black;*/
/*    font-size: 1.2rem;*/
/*  }*/
/*  .nav-bar__am-i-moderator--sheet{*/
/*    width: 100%;*/
/*    display: flex;*/
/*    flex-direction: row-reverse;*/
/*    align-items: center;*/
/*  }*/
/*  .nav-bar__am-i-moderator--sheet label {*/
/*    margin-left: 1rem;*/
/*  }*/
/*  .setting{*/
/*    width: 100%;*/
/*    display: flex;*/
/*    flex-direction: column;*/
/*    justify-content: space-around;*/
/*    height: 10rem;*/
/*  }*/
/*  .setting p{*/
/*    display: flex;*/
/*    justify-content: flex-end;*/
/*    font-size: 1.4rem;*/
/*    color: black;*/
/*  }*/
/*}*/

</style>

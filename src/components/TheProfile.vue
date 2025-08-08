<template>
  <base-modal is-blur="true" :open="isProfileModalOpen">
    <template #modal-header>

      <div style="height: 2rem;display: flex;justify-content: space-between;"
           :style="{direction:$i18n.locale !== 'en' ? 'rtl': 'ltr'}">
        <h2>{{ $store.getters.t("profile") }}</h2>
        <close-icon v-if="!IsChangingProfileOpen && !isChangingPassword" width="24" height="24" color="#292933"
                    @click-icon="closeProfile"></close-icon>
        <img draggable="false" v-else src="/img/back-arrow.svg" style="cursor: pointer" @click="backToProfile" alt="not-loaded">
      </div>

    </template>
    <template #modal-body>
      <div v-if="!isChangingPassword && !IsChangingProfileOpen"
           style="width: 30rem;height: 25rem;display: flex;flex-direction: column;gap:1.6rem;align-items: center">
        <div style="position: relative">
          <div
              style="background-color: #2AB459;width: 2.5rem;height: 2.5rem;border-radius: 50%;display: flex;justify-content: center;align-items: center;position: absolute;top: 0;cursor: pointer;"
              @click="goToChangeProfile">
            <!--            <input style="display: none" type="file" ref="fileInput" accept="image/*" @input="uploadImage">-->
            <img draggable="false" src="/img/edit-profile.svg" alt="not-loaded">
          </div>
          <img draggable="false" v-if="imgURL" :src="imgURL" alt="not-loaded"
               style="width: 10rem;height: 10rem;border-radius: 50%;object-fit: cover;">
          <span v-else
                style="width: 10rem;height: 10rem;border-radius: 50%;background-color: #1B76FF;color: white;display: flex;justify-content: center;align-items: center">{{ $store.getters.displayName.split('')[0] }}</span>
        </div>
        <div style="font-weight: 700">
          {{ $store.getters.displayName }}
        </div>
        <div>
          {{ $store.getters.email }}
        </div>
        <div>
          {{ $store.getters.phoneNumber }}
        </div>

      </div>


      <div v-if="!isChangingPassword && IsChangingProfileOpen"
           style="width: 30rem;height: 25rem;display: flex;flex-direction: column;gap:1.6rem;align-items: center">
        <!--        <div style="position: relative">-->
        <!--          <img draggable="false" v-if="imgURL" :src="imgURL" alt="not-loaded" style="width: 15rem;height: 15rem;border-radius: 50%;object-fit: cover;">-->
        <!--          <img draggable="false" v-else src="/img/contact.svg" alt="not-loaded" style="width: 15rem;height: 15rem;border-radius: 50%;object-fit: cover;">-->
        <!--          &lt;!&ndash;          <span v-else style="width: 10rem;height: 10rem;border-radius: 50%;background-color: #1B76FF;color: white;display: flex;justify-content: center;align-items: center">{{$store.getters.displayName.split('')[0]}}</span>&ndash;&gt;-->
        <!--        </div>-->
        <!--        &lt;!&ndash;        <div style="font-size: 1.8rem; color: #292933">{{$store.getters.t('drag-photo-here')}}</div>&ndash;&gt;-->

        <!--        <div v-if="!isMobile" style="position: relative">-->


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
        <!--        <input v-if="isMobile" style="  width: 20rem;-->
        <!--  height: 5rem;-->
        <!--  opacity: 0;-->
        <!--  position: absolute;-->
        <!--  top: 50%;-->
        <!--  left: 50%;-->
        <!--  transform: translate(-50%,-50%);-->
        <!--  z-index: 1;-->
        <!--  cursor:pointer;-->
        <!--  background-color: #d4eaf5;"-->
        <!--               @dragenter="isDragOver = true"-->
        <!--               @dragleave="isDragOver = false"-->
        <!--               @click="isDragOver = false" type="file" ref="fileInput" accept="image/*" @input="uploadImage">-->
        <!--        <div v-if="!isMobile" style="font-size: 1.4rem; color: #292933">{{  $store.getters.t('or')}}</div>-->
        <div v-show="!isFileUploaded && !isCameraOpen" style="position: relative">
          <input v-if="isInputFileExist" type="file" ref="imageFile" @change="loadImage($event)" accept=".png, .jpg, .jpeg, .svg" style="display: none">
          <img draggable="false" v-if="imgURL" :src="imgURL" alt="not-loaded"
               style="width: 15rem;height: 15rem;border-radius: 50%;object-fit: cover;">
          <img draggable="false" v-else src="/img/contact.svg" alt="not-loaded"
               style="width: 15rem;height: 15rem;border-radius: 50%;object-fit: cover;">
          <div v-if="imgURL  && !isFileUploaded"
               style="position: absolute; top: 0;right: 1rem;background-color: #E50000;width: 3rem;height: 3rem;border-radius: 50%;display: flex;justify-content: center;align-items: center;border: 0.1rem solid white;cursor: pointer"
               @click="deleteProfilePicture">
            <delete-icon color="white" :height="'20px'" :width="'20px'"></delete-icon>
          </div>
        </div>



        <div v-if="isCameraOpen" class="web-camera-container" style="z-index: 100">
          <div v-if="isCameraOpen" v-show="!isLoading" class="camera-box" :class="{ 'flash' : isShotPhoto }">

            <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>

            <video v-show="!isPhotoTaken" ref="camera" :width="250" :height="200" autoplay></video>

            <canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas" :width="250" :height="200"></canvas>
          </div>

          <div v-if="isCameraOpen && !isLoading && !isPhotoTaken" class="camera-shoot">
            <button type="button" class="button" @click="takePhoto">
              <img draggable="false" src="/img/camera-photo.svg" alt="not-loaded" style="width: 30px;height: 30px">
            </button>
          </div>

<!--          <div v-if="isPhotoTaken && isCameraOpen" class="camera-download">-->
<!--            <a id="downloadPhoto" download="my-photo.jpg" class="button" role="button" @click="downloadImage">-->
<!--              Download-->
<!--            </a>-->
<!--          </div>-->
        </div>


        <div v-if="isFileUploaded && !isCameraOpen">
          <cropper
              :src="image.src"
              ref="cropper"
              class="cropper"
              :auto-zoom="true"
              stencil-component="circle-stencil"
              :stencil-props="{
		previewClass: 'preview'
	}"
          />
        </div>


      </div>


      <div v-else-if=" isChangingPassword && changePasswordStep === 'verificationCode'"
           style="width: 30rem;height: 25rem;display: flex;flex-direction: column;gap:1.6rem;align-items: center">
        <div>{{$store.getters.t('sendAuthenticationCode')}}</div>
        <base-form-input
            auto-complete="off"
            v-for="info in verificationFormInfo"
            :key="info.id"
            :type="info.type"
            :id="info.id"
            :label="info.label"
            :is-authentication-code="true"
            :validation-type="info.validationType"
            :is-login-form="true"
            v-model.trim="info.inputVal"
            @validity-status="checkEachInputValidity"
        >
        </base-form-input>
        <div style="margin-top: 1rem">
          <the-timer :minutes="timerMinutes" :seconds="timerSeconds" :start-flag="isTimerStarted"
                     @timer-status="getTimerStatus"></the-timer>
        </div>

        <div :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" v-if="!isTimerStarted">
          <div style="margin: 1rem 0 3rem 0;
  width: 100%;
  display: flex;
  flex-direction: row;">
        <span style="  color: #1a73e8;
  cursor: pointer;
  width: 100%;
  text-align: center;" @click="resendVerificationCode"
        >{{ $store.getters.t("codeRequest") }}</span>
          </div>
        </div>
      </div>


      <div v-else-if=" isChangingPassword && changePasswordStep === 'changePassword'"
           style="width: 30rem;height: 25rem;display: flex;flex-direction: column;gap:1.6rem;align-items: center">
        <div>{{$store.getters.t('setNewPassword')}}</div>
        <base-form-input
            v-for="info in newPasswordFormInfo"
            auto-complete="off"
            :key="info.id"
            :type="info.type"
            :id="info.id"
            :label="info.label"
            :is-authentication-code="false"
            :validation-type="info.validationType"
            :is-login-form="true"

            v-model="info.inputVal"
            @validity-status="checkEachInputValidityNewPassword"
        >
        </base-form-input>
      </div>


    </template>
    <template #modal-buttons>
      <base-button
          v-if="!isChangingPassword && !IsChangingProfileOpen"
          :is-active="true"
          :button-inner-txt="$store.getters.t('change-password')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=16.1rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
          @btn-clicked="changePassword"
      ></base-button>
      <base-button
          v-else-if=" isChangingPassword && changePasswordStep === 'verificationCode'"
          :is-active="true"
          :button-inner-txt="$store.getters.t('confirmCode')"
          :continuous-params="[
          `background-color= ${(verificationFormInfo[0].inputVal.trim().length !== 6) ? '#aaa' : '#1B76FF'}`,
          'color=white', 'width=16.1rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem',
          ]"
          @btn-clicked="submitVerificationCode"
      ></base-button>
      <base-button
          v-else-if=" isChangingPassword && changePasswordStep === 'changePassword'"
          :is-active="true"
          :button-inner-txt="$store.getters.t('confirm')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=16.1rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
          @btn-clicked="submitPassword"
      ></base-button>
      <div v-if="!isChangingPassword && IsChangingProfileOpen" style="display: flex;gap: 1.6rem">
<!--        <button-->
<!--            v-if="imgURL  && !isFileUploaded"-->
<!--            class="delete-image-button"-->
<!--            @click="deleteProfilePicture"-->
<!--        >-->
<!--          حذف عکس-->
<!--        </button>-->
        <!--        <button-->
        <!--            v-if="!isMobile"-->
        <!--            class="choose-image-button"-->
        <!--            @click="OpenUploadFile"-->
        <!--        >-->
        <!--           انتخاب عکس از کامپیوتر-->
        <!--        </button>-->
        <button v-if="isFileUploaded" class="choose-image-button" @click="uploadImage()">
          {{$store.getters.t('save-photo')}}
        </button>
        <button v-if="isFileUploaded " class="delete-image-button" @click="deleteLoadedPhoto">
          {{$store.getters.t('delete-photo')}}
        </button>
        <button v-if="!isFileUploaded && !isCameraOpen && !isMobile && hasWebcam" class="choose-image-button" @click="toggleCamera">
          {{$store.getters.t('take-picture')}}
        </button>
        <button v-if="!isFileUploaded && isCameraOpen && !isPhotoTaken " class="choose-image-button" @click="toggleCamera">
          {{$store.getters.t('close-camera')}}
        </button>
        <button v-if="!isFileUploaded && isCameraOpen && isPhotoTaken " class="choose-image-button" @click="toggleCamera">
          {{$store.getters.t('next')}}
        </button>
        <button v-if="!isFileUploaded && isCameraOpen && isPhotoTaken " class="delete-image-button" @click="deleteTakenPhoto">
          {{$store.getters.t('delete-photo')}}
        </button>


        <button v-if="!isMobile && !isCameraOpen && !isFileUploaded" class="choose-image-button" @click="$refs.imageFile.click()">
          {{$store.getters.t('choose-picture-from-pc')}}
        </button>
        <button
            v-else-if="isMobile && !isCameraOpen && !isFileUploaded"
            class="choose-image-button"
            @click="$refs.imageFile.click()"
        >
          {{$store.getters.t('choose-picture')}}
        </button>

        <!--        <base-button-->

        <!--            :is-active="true"-->
        <!--            button-inner-txt="گرفتن عکس"-->
        <!--            :continuous-params="[-->
        <!--          'background-color=white',-->
        <!--          'color=#1B76FF', 'width=16.1rem','height=4.8rem',-->
        <!--          'font-size=1.3rem', 'font-weight= 700',-->
        <!--          'border-radius=0.6rem','border=  0.1rem solid #1B76FF'-->
        <!--          ]"-->
        <!--            @btn-clicked="takePhoto"-->
        <!--        ></base-button>-->
      </div>
    </template>
  </base-modal>
  <base-modal :open="isLoading" :is-loading="'isLoading'" modal-color="transparent">
    <template #modal-body>
      <base-loading-spinner size-ratio="1.2" spinner-color="#409EFF">
      </base-loading-spinner>
    </template>
  </base-modal>
</template>
<script>

import BaseModal from "@/components/UI/BaseModal.vue";
import CloseIcon from "@/components/UI/Icons/CloseIcon.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import BaseFormInput from "@/components/UI/BaseFormInput.vue";
import TheTimer from "@/components/TheTimer.vue";
import RestClient from "@/api/restClient";
import DetectMobile from "../utils/detectMobile";
import BaseLoadingSpinner from "@/components/UI/BaseLoadingSpinner.vue";
import {Cropper} from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
import DeleteIcon from "@/components/UI/Icons/DeleteIcon.vue";
import {nextTick} from "vue";

function getMimeType(file, fallback = null) {
  const byteArray = (new Uint8Array(file)).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case "89504e47":
      return "image/png";
    case "47494638":
      return "image/gif";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
      return "image/jpeg";
    default:
      return fallback;
  }
}

export default {
  components: {DeleteIcon, BaseLoadingSpinner, BaseModal, CloseIcon, BaseButton, BaseFormInput, TheTimer, Cropper},
  props: ["isProfileModalOpen", "imgURL"],
  data() {
    return {
      image: {
        src: null,
        type: null
      },
      isChangingPassword: false,
      IsChangingProfileOpen: false,
      isDragOver: false,
      isFileUploaded: false,
      changePasswordStep: '',
      verificationFormInfo: [
        {
          label: this.$store.getters.t("authenticationCode"),
          type: 'text',
          validationType: 'OTP-verification-code',
          id: 'verification-code',
          inputVal: '',
          isValid: false,
          loginIsTriggered: false,
        },
      ],
      verificationCode: '',
      areAllInputsValid: 'not-decided-yet',
      newPasswordFormInfo: [
        {
          label: this.$store.getters.t("newPassword"),
          type: 'password',
          validationType: 'password',
          id: 'new-password',
          inputVal: '',
          isValid: false,
        },
        {
          label: this.$store.getters.t("repeatPassword"),
          type: 'password',
          validationType: 'password',
          id: 'repeat-new-password',
          inputVal: '',
          isValid: false,
        },
      ],
      loginIsTriggered: false,
      timerMinutes: 0,
      timerSeconds: 0,
      isTimerStarted: false,
      restClientAuth: new RestClient('auth'),
      restClientBilling: new RestClient('billing'),
      restClientLdap: new RestClient('ldap'),
      restClientUser: new RestClient('user'),
      isMobile: false,
      isLoading: false,
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      link: '#',
      isInputFileExist:true,
      hasWebcam:false,

    }
  },
  methods: {
    goToChangeProfile(){
      this.detectWebcam((hasWebcam) => {
        if (hasWebcam){
          this.hasWebcam = true
        }

      })
      this.IsChangingProfileOpen = true
    },
    closeProfile() {
      this.$emit('close-profile-modal')
    },
    arrayBufferToBase64(buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },
    OpenUploadFile() {
      this.$refs.fileInput.click()
    },
    // uploadImage(){
    //   this.isLoading  = true
    //   this.imageFile = this.$refs.fileInput.files[0]
    //   if (this.imageFile) {
    //     this.isFileUploaded = true
    //   }
    //   console.error('deleteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    //   this.changeProfilePicture()
    // },
    changeProfilePicture(formData) {
      // const formData = new FormData()
      // formData.append('imgFile', this.imageFile)
      this.restClientUser.updateAvatar(formData, this.$store.getters.userId).then((response) => {
        this.image = {
          src: null,
          type: null
        }
        this.isFileUploaded = false
        console.error(response)
        this.isFileUploaded = false
        this.isLoading = false
        this.eventBus.emit('img-profile-changed')
      }).catch((error) => {
        this.isLoading = false
        this.isFileUploaded = false
        console.error(error)
      })
    },
    deleteProfilePicture() {
      this.isFileUploaded = false
      this.isLoading = true
      this.restClientUser.deleteAvatar(this.$store.getters.userId).then((response) => {
        console.error(response)
        this.isLoading = false
        this.eventBus.emit('img-profile-deleted')
      }).catch((error) => {
        this.isLoading = false
        console.error(error)
      })
    },
    checkEachInputValidity(id, isValid) {
      const foundFormInfo = this.verificationFormInfo.find(info => info.id === id);
      if (!foundFormInfo) return;
      foundFormInfo.isValid = isValid;
    },
    checkEachInputValidityNewPassword(id, isValid) {
      const foundFormInfo = this.newPasswordFormInfo.find(info => info.id === id);
      if (!foundFormInfo) return;
      foundFormInfo.isValid = isValid;
    },

    changePassword() {
      this.isLoading = true
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
            this.isLoading = false
            this.isChangingPassword = true
            this.changePasswordStep = 'verificationCode'


          }).catch(error => {
        this.isLoading = false
        console.error(error)
      })

    },
    checkAllInputsValidity() {
      const inputsValidationResult = this.verificationFormInfo.every(info => info.isValid === 'yes');
      if (inputsValidationResult) {
        this.areAllInputsValid = 'yes';
      } else {
        this.areAllInputsValid = 'no';
      }
    },
    checkAllInputsValidityNewPassword() {
      console.error(this.newPasswordFormInfo)
      const inputsValidationResult = this.newPasswordFormInfo.every(info => info.isValid === 'yes');
      if (inputsValidationResult) {
        this.areAllInputsValid = 'yes';
      } else {
        this.areAllInputsValid = 'no';
      }
    },
    submitVerificationCode() {
      this.checkAllInputsValidity();
      if (this.areAllInputsValid === 'yes') {
        this.confirmVerificationCode()
      }
    },
    confirmVerificationCode() {
      this.isLoading = true
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
            if (data.success === true) {
              this.isTimerStarted = false
              this.verificationCode = this.verificationFormInfo[0].inputVal
              this.changePasswordStep = 'changePassword'
              this.verificationFormInfo[0].inputVal = ''
              setTimeout(() => {
                this.newPasswordFormInfo[0].inputVal = ''
                this.isLoading = false
              }, 1000)
            }
          }).catch((error) => {
        console.error(error)
        this.isLoading = false
      }).finally(() => {
        setTimeout(() => {
          this.newPasswordFormInfo[0].inputVal = ''
          this.isLoading = false
        }, 1000)
      })
      // }else{
      //   this.btnAnimation = true
      // }

    },
    submitPassword() {
      this.isLoading = true
      this.checkAllInputsValidityNewPassword()
      if (this.areAllInputsValid === 'yes') {
        this.loginIsTriggered = true
        const newPassword = [this.newPasswordFormInfo[0].inputVal, this.newPasswordFormInfo[1].inputVal];
        if (newPassword[0] === newPassword[1]) {
          // this.$refs.newPass.isNewPassInvalid = false
          // this.$refs.repeatNewPass.isRepeatedPassInvalid = false
          this.restClientAuth
              .resetPassword({
                password: newPassword[0],
                confirmPassword: newPassword[1],
                code: this.verificationCode,
                username: this.$store.getters.userName,
                tenant: this.$store.getters.tenant
              })
              .then(() => {
                this.isLoading = false

                this.newPasswordFormInfo[0].inputVal = ''
                this.newPasswordFormInfo[1].inputVal = ''
                this.isChangingPassword = false
                this.changePasswordStep = ''
                this.isLoading = false
                this.eventBus.emit('notification', {
                  title: 'پیام',
                  type: 'success',
                  bodyText: this.$store.getters.t('password-changed-successfully'),
                  time: 5000

                })

              }).finally(() => {
            this.isLoading = false
          }).catch((error) => {
            this.isLoading = false
            console.error(error)
            this.btnAnimation = true
          })
        } else {
          this.isLoading = false
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
      } else {
        this.btnAnimation = true


      }
    },
    getTimerStatus(stat) {
      if (stat === false) {
        this.timerSeconds = 0;
        this.timerSeconds = 0;
      }
      this.isTimerStarted = stat;
    },
    startTimer() {
      this.timerMinutes = 1;
      this.timerSeconds = 59;
      this.isTimerStarted = true;
    },
    resendVerificationCode() {
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
        this.isLoading = false
        console.error(error)
      })

    },
    backToProfile() {
      this.isCameraOpen = false;
      this.isPhotoTaken = false;
      this.isShotPhoto = false;
      this.stopCameraStream();
      this.image = {
        src: null,
        type: null
      }
      this.IsChangingProfileOpen = false
      this.isChangingPassword = false
      this.isDragOver = false
      this.isFileUploaded = false
      this.changePasswordStep = ''
      this.verificationFormInfo = [
        {
          label: 'کد احراز هویت',
          type: 'text',
          validationType: 'OTP-verification-code',
          id: 'verification-code',
          inputVal: '',
          isValid: false,
          loginIsTriggered: false,
        },
      ]
      this.verificationCode = ''
      this.areAllInputsValid = 'not-decided-yet'
      this.newPasswordFormInfo = [
        {
          label: 'گذرواژه جدید',
          type: 'password',
          validationType: 'password',
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
        }
      ]
    },
    reset() {
      this.image = {
        src: null,
        type: null
      }
    },
    loadImage(event) {
      // Reference to the DOM input element
      const {files} = event.target;
      // Ensure that you have a file before attempting to read it
      if (files && files[0]) {
        // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
        if (this.image.src) {
          URL.revokeObjectURL(this.image.src)
        }
        // 2. Create the blob link to the file to optimize performance:
        const blob = URL.createObjectURL(files[0]);

        // 3. The steps below are designated to determine a file mime type to use it during the
        // getting of a cropped image from the canvas. You can replace it them by the following string,
        // but the type will be derived from the extension and it can lead to an incorrect result:
        //
        // this.image = {
        //    src: blob;
        //    type: files[0].type
        // }

        // Create a new FileReader to read this image binary data
        const reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.image" refers to the image of Vue component
          this.image = {
            // Set the image source (it will look like blob:http://example.com/2c5270a5-18b5-406e-a4fb-07427f5e7b94)
            src: blob,
            // Determine the image type to preserve it during the extracting the image from canvas:
            type: getMimeType(e.target.result, files[0].type),
          };
          if (this.image.src) {
            this.isFileUploaded = true
          }
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsArrayBuffer(files[0]);
      }
    },
    crop() {
      const {canvas} = this.$refs.cropper.getResult();
      canvas.toBlob((blob) => {
        // Do something with blob: upload to a server, download and etc.
        console.error(blob)
      }, this.image.type);
    },
    uploadImage() {
      // const formData = new FormData()
      // formData.append('imgFile', this.imageFile)
      const {canvas} = this.$refs.cropper.getResult();
      if (canvas) {
        const form = new FormData();
        canvas.toBlob(blob => {
          const myFile = new File([blob], 'image.jpeg', {
            type: blob.type,
          });
          form.append('imgFile', myFile);
          this.changeProfilePicture(form)
          // You can use axios, superagent and other libraries instead here

          // Perhaps you should add the setting appropriate file format here
        }, 'image/jpeg');
      }
    },
    toggleCamera() {
      if (this.isPhotoTaken){
        this.isPhotoTaken = false
        this.isFileUploaded = true
        this.image.src = document.getElementById("photoTaken").toDataURL("image/jpeg")
            .replace("image/jpeg", "image/octet-stream")
        this.image.type = 'image/jpeg'
      }
      if (this.isCameraOpen) {
        this.isCameraOpen = false;
        this.isPhotoTaken = false;
        this.isShotPhoto = false;
        this.stopCameraStream();
      } else {
        this.isCameraOpen = true;
        this.createCameraElement();
      }

    },
    detectWebcam(callback) {
      let md = navigator.mediaDevices;
      if (!md || !md.enumerateDevices) return callback(false);
      md.enumerateDevices().then(devices => {
        callback(devices.some(device => 'videoinput' === device.kind));
      })
    },
    createCameraElement() {
      this.isLoading = true;

      const constraints = (window.constraints = {
        audio: false,
        video: true
      });


      navigator.mediaDevices
          .getUserMedia(constraints)
          .then(stream => {
            this.isLoading = false;
            this.$refs.camera.srcObject = stream;
          })
          .catch(() => {
            this.isLoading = false;
            this.isCameraOpen = false;
            alert("May the browser didn't support or there is some errors.");
          });
    },
    stopCameraStream() {
      if (this.$refs?.camera?.srcObject){
        let tracks = this.$refs.camera.srcObject.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
      }



    },
    takePhoto() {
      if (!this.isPhotoTaken) {
        this.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
          this.isShotPhoto = false;
        }, FLASH_TIMEOUT);
      }

      this.isPhotoTaken = !this.isPhotoTaken;

      const context = this.$refs.canvas.getContext('2d');
      context.drawImage(this.$refs.camera, 0, 0, 250, 200);
      // console.error('taaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaake')
      // const byteCharacters = atob(document.getElementById("photoTaken").toDataURL("image/jpeg")
      //     .replace("image/jpeg", "image/octet-stream"));
      // const byteArrays = [];
      //
      // for (let i = 0; i < byteCharacters.length; i++) {
      //   byteArrays.push(byteCharacters.charCodeAt(i));
      // }
      //
      // const byteArray = new Uint8Array(byteArrays)
      // this.image.src = byteArray
      // this.image.type = 'image/jpeg'
    },
    deleteTakenPhoto(){
      this.isPhotoTaken = false
      this.isShotPhoto = false
    },
    deleteLoadedPhoto(){

      if (this.$refs?.imageFile?.files){
        this.isInputFileExist = false
        nextTick(()=>{
          this.isInputFileExist = true
        })
      }
      this.isFileUploaded = false
      this.image = {
        src: null,
        type: null
      }
    },
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
}
</script>


<style scoped>
.choose-image-button {
  background-color: white;
  color: #1B76FF;
  width: 16.1rem;
  height: 4.8rem;
  font-size: 1.3rem;
  font-weight: 700;
  border-radius: 0.6rem;
  border: 0.1rem solid #1B76FF
}

.choose-image-button:hover {
  background-color: rgba(130, 176, 246, 0.13);
  cursor: pointer;
}

.delete-image-button {
  background-color: white;
  color: #E50000;
  width: 16.1rem;
  height: 4.8rem;
  font-size: 1.3rem;
  font-weight: 700;
  border-radius: 0.6rem;
  border: 0.1rem solid #E50000
}

.delete-image-button:hover {
  background-color: rgba(246, 130, 140, 0.13);
  cursor: pointer;
}

.web-camera-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 270px;


  .camera-button {
    margin-bottom: 2rem;
  }

  .camera-box {
    .camera-shutter {
      opacity: 0;
      width: 250px;
      height: 200px;
      background-color: #fff;
      position: absolute;

      &.flash {
        opacity: 1;
      }
    }
  }

  .camera-shoot {
    cursor: pointer;
position: relative;
    bottom: 0.6rem;
    button {
      height: 45px;
      width: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      cursor: pointer;

      img {
        height: 35px;
        object-fit: cover;
      }
    }
  }

  .camera-loading {
    overflow: hidden;
    height: 100%;
    position: absolute;
    width: 100%;
    min-height: 150px;
    margin: 3rem 0 0 -1.2rem;

    ul {
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 999999;
      margin: 0;
    }

    .loader-circle {
      display: block;
      height: 14px;
      margin: 0 auto;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      transform: translateX(-50%);
      position: absolute;
      width: 100%;
      padding: 0;

      li {
        display: block;
        float: left;
        width: 10px;
        height: 10px;
        line-height: 10px;
        padding: 0;
        position: relative;
        margin: 0 0 0 4px;
        background: #999;
        animation: preload 1s infinite;
        top: -50%;
        border-radius: 100%;

        &:nth-child(2) {
          animation-delay: .2s;
        }

        &:nth-child(3) {
          animation-delay: .4s;
        }
      }
    }
  }

  @keyframes preload {
    0% {
      opacity: 1
    }
    50% {
      opacity: .4
    }
    100% {
      opacity: 1
    }
  }
}

</style>
<template>
  <form-fragment>
    <form class="new-password-form" autocomplete="off">
      <header class="form__header">
        <span style="width: 100%;text-align: center;font-size: 1.6rem;font-weight: 600">{{$store.getters.t("setNewPassword")}}</span>
      </header>

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
          @validity-status="checkEachInputValidity"
      >
      </base-form-input>
      <div v-if="isNewPassInvalid" class="invalid-password">{{$store.getters.t("invalid_repeated_password")}}</div>

<!--      <div class="form-control">-->
<!--        <div :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" class="form-control__return-login">-->
<!--          <a @click="goToLoginForm">{{$store.getters.t("returnToLogin")}}</a>-->
<!--        </div>-->
<!--      </div>-->
      <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;width: 100%;height: 4rem">
        <base-button
            :is-active="true"
            :shake-animation="areAllInputsValid === 'no'"
            @click="submitForm"
            :button-inner-txt="$store.getters.t('confirm')"
            :continuous-params="
          [
          'background-color=#1B76FF',
          'height=4.1rem',
          'color=white'
          ]"
            :style-types="
        [
        'login--button',
        'button--curved'
        ]"
            @shake-animation-ended="resetBtnAnimation"
        >
        </base-button>
      </div>

    </form>
  </form-fragment>
  <base-modal :open="loginIsTriggered" :is-loading="'isLoading'" is-blur="true" modal-color="transparent">
    <template #modal-body>
      <base-loading-spinner size-ratio="1.2" spinner-color="#409EFF">
        <template #loading-content>
          <div class="loading__extra-content--text" style = "color: #409EFF">{{$store.getters.t("pleaseWait")}}</div>
        </template>
      </base-loading-spinner>
    </template>
  </base-modal>
</template>

<script>
import FormFragment from "../UI/FormFragment";
import BaseButton from "../UI/BaseButton";
import BaseFormInput from "../UI/BaseFormInput";
import RestClient from '@/api/restClient';
import BaseModal from "../UI/BaseModal";
import BaseLoadingSpinner from "../UI/BaseLoadingSpinner";
export default {
  name: "NewPasswordForm",
  components: {BaseFormInput, BaseButton, FormFragment,BaseModal,BaseLoadingSpinner},
  props : ['infoForNewPassword','userName','code','tenantName'],
  data(){
    return {
      loginIsTriggered:false,
      isNewPassInvalid:false,
      btnAnimation: false,
      isAllInputsValid: false,
      isAllInputsSemiValid : false,
      RestClient: new RestClient('auth'),
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
      areAllInputsValid : 'not-decided-yet'
    }
  },
  methods : {
    checkEachInputValidity(id, isValid){
      const foundFormInfo = this.newPasswordFormInfo.find(info => info.id === id);
      if(!foundFormInfo) return;
      foundFormInfo.isValid = isValid;
    },
    checkAllInputsValidity(){
      const inputsValidationResult = this.newPasswordFormInfo.every(info => info.isValid === 'yes');
      if(inputsValidationResult){
        this.areAllInputsValid = 'yes';
      } else {
        this.areAllInputsValid = 'no';
      }
    },
    resetBtnAnimation(){
      this.areAllInputsValid = 'not-decided-yet';
    },
    submitForm() {

      this.isNewPassInvalid = false
      this.checkAllInputsValidity()
      if(this.areAllInputsValid === 'yes' ){
        this.loginIsTriggered = true
        const newPassword = [this.newPasswordFormInfo[0].inputVal,this.newPasswordFormInfo[1].inputVal];
        if (newPassword[0] === newPassword[1]) {
          // this.$refs.newPass.isNewPassInvalid = false
          // this.$refs.repeatNewPass.isRepeatedPassInvalid = false
          this.RestClient
              .resetPassword({
                password: newPassword[0],
                confirmPassword:newPassword[1],
                code: this.code,
                username: this.userName,
                tenant: this.tenantName
              })
              .then(() => {
                this.loginIsTriggered = false

                this.goToLoginForm()

              }).finally(() => {
            this.loginIsTriggered = false
            this.sending = false
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
    goToLoginForm(){
      localStorage.setItem('change-password','yes')
    window.location.reload();
      this.eventBus.emit('password-changed')
    },
  },
  mounted() {
    this.eventBus.emit('show-return-new-password', true)
    this.newPasswordFormInfo[0].label = this.$store.getters.t("newPassword")
    this.newPasswordFormInfo[1].label = this.$store.getters.t("repeatPassword")

    this.eventBus.on('reset-input',()=>{
      this.newPasswordFormInfo[0].label = this.$store.getters.t("newPassword")
      this.newPasswordFormInfo[1].label = this.$store.getters.t("repeatPassword")
    })
  },
  unmounted() {
    this.eventBus.emit('show-return-new-password', false)
  }
}
</script>

<style scoped>
a {
  float: right;
  text-decoration: none;
  color: #1a73e8;
  cursor: pointer;
}
.new-password-form {
  width: 35.2rem;
  height: 26rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.form-control {
  width: 100%;
}
.form-control__return-login {
  margin-top: 3.5rem;
  margin-bottom: 9rem;
  width: 100%;
  display: flex;
  flex-direction: row;
}
.form-control__return-login > a {
 color: #95d1cc;
}
.form-control__return-login > a:hover {
  color:#4fd5ca;
}
.form__header {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.invalid-password{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5rem;
  font-size: 1.5rem;
  color: red;
}
@media (min-width: 768px) and (max-width: 1024px) {
  .new-password-form {
    align-items: flex-start;
    width: 35.2rem;
    height: 26rem;
  }
  .form__header h2 {
    font-size: 2.3rem;
  }

}
@media (min-width: 541px) and (max-width: 767px){
  .new-password-form {
    align-items: flex-start;
    width: 35.2rem;
    height: 26rem;
  }
  .form__header h2 {
    font-size: 2rem;
  }
}
@media (min-width: 320px) and (max-width: 540px) {
  .new-password-form {
    align-items: flex-start;

    height: 26rem;
  }
  .form__header h2 {
    font-size: 2rem;
  }
}
@media (max-width: 320px) {
  .new-password-form {
    align-items: flex-start;

    height: 26rem;
  }
  .form__header h2 {
    font-size: 2rem;
  }
}
</style>

<template>
  <form-fragment>
  <form class="authentication-form" autocomplete="off">
    <header class="form__header">
<!--      <transition appear appear-active-class="code-sent">-->
        <span>{{$store.getters.t("sendAuthenticationCode")}}</span>
<!--        <span>{{$store.getters.t("verification-code-sent",{"phoneNumber":'09122222222'})}}</span>-->
<!--      </transition>-->
    </header>
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
<!--    <div v-if="isCodeInvalid" style="color: red; margin-top: 1rem"> کد وارد شده صحیح نیست </div>-->
    <div class="not-verified-notification" v-if="!isCodeVerified">{{$store.getters.t("wrong_code")}}</div>

    <div class="form-control">

<!--      <div :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" class="form-control__return-login ">-->
<!--        <a @click="navigateToForgetPasswordForm"-->
<!--        >{{$store.getters.t("reformUserName")}}</a>-->
<!--      </div>-->
    </div>
    <div v-if="isTimerStarted" class="time-counter">
      <the-timer :minutes="timerMinutes" :seconds="timerSeconds" :start-flag="isTimerStarted" @timer-status="getTimerStatus"></the-timer>
    </div>
<!--    <div class="form-control">-->
<!--      <div :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" class="form-control__return-login-forgetPass">-->
<!--        <a @click="goToLoginForm"-->
<!--        >{{$store.getters.t("returnToLogin")}}</a>-->
<!--      </div>-->
<!--    </div>-->
    <div :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" v-if="!isTimerStarted" class="form-control">
      <div class="form-control__return-login-forgetPass">
        <span class="code-request" @click="startTimer"
        >{{$store.getters.t("codeRequest")}}</span>
      </div>
    </div>
    <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;width: 100%;height: 4rem">
      <base-button
          :is-active="true"
          :shake-animation="areAllInputsValid === 'no'"
          @click="submitVerificationCode"
          :button-inner-txt="$store.getters.t('confirmCode')"
          :continuous-params="
        [
        'background-color=#1B76FF',
        'height=4.1rem',
        'color=white'
        ]"
          :style-types="
        [
        'button--curved',
        ((verificationFormInfo[0].inputVal.trim().length !== 6)? 'button--disabled' : 'login--button')
        ]"
          @shake-animation-ended="resetBtnAnimation"
      >
      </base-button>
    </div>

  </form>
  </form-fragment>

</template>

<script>
import BaseFormInput from "../UI/BaseFormInput";
import BaseButton from "../UI/BaseButton";
import TheTimer from "../TheTimer";
import FormFragment from "../UI/FormFragment";
import RestClient from '@/api/restClient'
export default {
  name: "VerificationCodeForm",
  components: {FormFragment, TheTimer, BaseButton, BaseFormInput},
  props:['userName','tenantName'],
  data(){
    return {
      isCodeVerified:true,
      RestClient: new RestClient('auth'),
      verificationFormInfo : [
          {
            label: 'کد احراز هویت',
            type: 'text',
            validationType: 'OTP-verification-code',
            id: 'verification-code',
            inputVal: '',
            isValid: false,
          },
      ],
      areAllInputsValid : 'not-decided-yet',
      timerMinutes : 0,
      timerSeconds : 0,
      isTimerStarted : false,
    }
  },
  methods : {
    navigateToNewPasswordForm(){
      this.$emit('change-form', 'verification-code-form', 'new-password-form');
    },
    navigateToForgetPasswordForm(){
      this.$emit('change-form', 'verification-code-form', 'forget-password-form');
    },
    submitVerificationCode(){
      this.checkAllInputsValidity();
      if(this.areAllInputsValid === 'yes'){
        this.eventBus.emit('verification-code-info', {verificationCode : this.verificationFormInfo[0].inputVal});
        this.confirmVerificationCode()
      }
    },
    startTimer(){
      this.timerMinutes = 1;
      this.timerSeconds = 59;
      this.isTimerStarted = true;
    },
    getTimerStatus(stat){
     if(stat === false){
       this.timerSeconds = 0;
       this.timerSeconds = 0;
     }
      this.isTimerStarted = stat;
    },
    checkEachInputValidity(id, isValid){
      const foundFormInfo = this.verificationFormInfo.find(info => info.id === id);
      if(!foundFormInfo) return;
      foundFormInfo.isValid = isValid;
    },
    checkAllInputsValidity(){
      const inputsValidationResult = this.verificationFormInfo.every(info => info.isValid === 'yes');
      if(inputsValidationResult){
        this.areAllInputsValid = 'yes';
      } else {
        this.areAllInputsValid = 'no';
      }
    },
    resetBtnAnimation(){
      this.areAllInputsValid = 'not-decided-yet';
    },
    goToLoginForm(){
      window.location.reload();
    },
    confirmVerificationCode() {
      this.isCodeVerified = true
      // this.$refs.authenticationCode.isAuthenticationCodeInvalid = false
        const authentication = [this.verificationFormInfo[0].inputVal];
        // this.code = authentication[0]
        this.RestClient
            .confirmVerification({
              'code': authentication[0],
              'username': this.userName,
              'tenant': this.tenantName
            })
            .then((data) => {
              if(data.success === true){
                this.navigateToNewPasswordForm();
              }else{
                this.isCodeVerified = false
                return;
                // this.$refs.authenticationCode.isAuthenticationCodeInvalid = true
                // this.isCodeInvalid= true
              }


            }).catch((error) => {
          console.error(error)
        }).finally(() => {
        })
      // }else{
      //   this.btnAnimation = true
      // }

    },
  },
  mounted() {
    this.eventBus.emit('show-return-verification-code', true)
    this.verificationFormInfo[0].label = this.$store.getters.t("authenticationCode")

    this.eventBus.on('reset-input',()=>{
      this.verificationFormInfo[0].label = this.$store.getters.t("authenticationCode")

    })
    this.startTimer();
  },
  unmounted() {
    this.eventBus.emit('show-return-verification-code', false)
  }
}
</script>

<style scoped>
.code-request {
  color: #1a73e8;
  cursor: pointer;
  width: 100%;
  text-align: center;
}

.authentication-form {
  width: 35.2rem;
  height: 27rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.form-control {
  width: 100%;
}

.form-control__return-login {
  margin-top: 3rem;
  width: 100%;
  display: flex;
  flex-direction: row;
}
.form-control__return-login > a {
  color: #1B76FF;
}
.form-control__return-login > a:hover {
  color: #1B76FF;
}

.form-control__return-login-forgetPass {
  margin: 1rem 0 3rem 0;
  width: 100%;
  display: flex;
  flex-direction: row;
}
.form-control__return-login-forgetPass > a {
  color: #1B76FF;
}
.form-control__return-login-forgetPass > a:hover {
  color: #1B76FF;
}
.form__header {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
}
.form__header > span {
font-weight: 600;
  font-size: 1.6rem;
}
.form__header > span:last-child {
  font-weight: 400;
  font-size: 1.4rem;
}
.time-counter {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.not-verified-notification{
  width: 100%;
  display: flex;
  margin-top: 2rem;
  justify-content: center;
  align-items: center;
  height: 5rem;
  font-size: 1.5rem;
  color: red;
}

.code-sent{
  animation: text-fade-in 3s forwards;
}

@keyframes text-fade-in {
  from{
    opacity: 0;
  }
  to{
    opacity: 1;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .authentication-form {
    align-items: flex-start;
    width: 35.2rem;
    height: 27rem;
  }
 h3 {
    font-size: 2.3rem;
  }

}
@media (min-width: 541px) and (max-width: 767px){
  .authentication-form {
    align-items: flex-start;

    width: 35.2rem;
    height: 27rem;
  }
   h3 {
    font-size: 2rem;
  }
}
@media (min-width: 320px) and (max-width: 540px) {
  .authentication-form {
    align-items: flex-start;

    height: 27rem;
  }
   h3 {
    font-size: 1.5rem;
     margin-bottom: 2rem;
  }
}
@media (max-width: 320px) {
  .authentication-form {
    align-items: flex-start;

    height: 27rem;
  }
   h3 {
    font-size: 2rem;
     margin-bottom: 2rem;
  }
}

</style>

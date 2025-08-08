<template>
  <form-fragment>
    <form class="form login-form" autocomplete="off">
      <header :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" class="form__header" >
        {{ $store.getters.t("loginToShookaweb") }}
      </header>
      <base-form-input
          v-for="info in loginFormInfo"
          :key="info.id"
          :type="info.type"
          :id="info.id"
          :ref="info.id"
          :label="info.label"
          :is-authentication-code="false"
          :validation-type="info.validationType"
          :is-login-form="true"
          v-model="info.inputVal"
          @is-valid="checkValidity"
          @validity-status="checkEachInputValidity"
      >
      </base-form-input>

      <!--    <div v-if="isTenantNameInvalid" style="color: red"> نام سازمان را اشتباه وارد کرده اید</div>-->
      <!--    <div v-else-if="isUserNameInvalid && isTenantNameInvalid === false" style="color: red; margin-top: 2rem"> نام کاربری یا رمز عبور اشتباه است</div>-->
      <!--    <div v-else-if="isPasswordIncorrectThreeTimes" style="color: red ; font-size: 1.2rem;text-align: right">حساب شما بدلیل اشتباه وارد کردن بیش از 3 بار گذرواژه مسدود شده است، لطفا با راهبر سامانه تماس بگیرید</div>-->
      <div class="form-control">
        <div :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}"  class="form-control__forgot-password">
          <a @click="navigateToForgetPasswordForm">{{ $store.getters.t("haveForgotten") }}</a>
        </div>

      </div>
      <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;width: 100%;height: 4rem">
        <base-button
            :is-active="true"
            :shake-animation="areAllInputsValid === 'no'"
            @click="submitLoginForm"
            :button-inner-txt='$store.getters.t("login")'
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

<!--      <div :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}"  class="form-control__LDAP">-->
<!--        <base-check-box @is-checked-status="toggleLDAPUsage"></base-check-box>-->
<!--        <label >{{ $store.getters.t("authentication") }}</label>-->
<!--      </div>-->
    </form>
  </form-fragment>
  <div class="form-control">

  </div>
  <!--  <div class="version-control">-->
  <!--    <span >نگارش: {{applicationVersion}}</span>-->
  <!--    <span >نگارش امنیتی: {{securityVersion}}</span>-->
  <!--  </div>-->

  <base-modal :open="loginIsTriggered" :is-loading="'isLoading'" is-blur="true" modal-color="transparent">
    <template #modal-body>
      <base-loading-spinner size-ratio="1.2" spinner-color="#409EFF">
        <template #loading-content>
          <div class="loading__extra-content--text" style= "color: #409EFF">{{$store.getters.t("pleaseWait")}}</div>
        </template>
      </base-loading-spinner>
    </template>
  </base-modal>
</template>

<script>
import BaseFormInput from "../UI/BaseFormInput";
import BaseButton from "../UI/BaseButton";
// import BaseCheckBox from "../UI/BaseCheckBox";
import FormFragment from "../UI/FormFragment";
import BaseLoadingSpinner from "../UI/BaseLoadingSpinner";
import BaseModal from "../UI/BaseModal";
export default {
  name: "LoginForm",
  components: {
    FormFragment,
    BaseFormInput,
    BaseButton,
    BaseLoadingSpinner,
    BaseModal
  },
  emits : ['change-form'],
  data(){
    return {
      loginIsTriggered:false,
      loginFormInfo: [
        {
          label: "نام سازمان",
          type: "text",
          validationType :'not-empty',
          id: "tenantName",
          inputVal: '',
          isValid: false,
        },
        {
          label: "نام کاربری",
          type: "text",
          validationType :'not-empty',
          id: "username",
          inputVal: "",
          isValid: false,
        },
        {
          label: "گذرواژه",
          type: "password",
          validationType :'password',
          id: "password",
          inputVal: "",
          isValid: false,
        },
      ],
      areAllInputsValid : 'not-decided-yet',
      isLDAPEnabled : false,
      applicationVersion : '5.0.0',
      securityVersion : '1.0.0'
    }
  },
  methods : {
    navigateToForgetPasswordForm(){
      localStorage.removeItem('change-password')
      this.$emit('change-form','login-form', 'forget-password-form');
    },
    toggleLDAPUsage(stat){
      this.isLDAPEnabled = stat;
    },
    checkEachInputValidity(id, isValid){
      const foundFormInfo = this.loginFormInfo.find(info => info.id === id);
      if(!foundFormInfo) return;
      foundFormInfo.isValid = isValid;
    },
    checkAllInputsValidity(){
      const inputsValidationResult = this.loginFormInfo.every(info => info.isValid === 'yes');
      if(inputsValidationResult){
        this.areAllInputsValid = 'yes';
      } else {
        this.areAllInputsValid = 'no';
      }
    },
    checkValidity(input){
      if(input === 'tenantName'){
        this.loginFormInfo[0].isValid = 'yes'
      }
    },
    submitLoginForm(){
      localStorage.removeItem('change-password')
      this.checkAllInputsValidity();
      const loginInfo = {}
      if(this.areAllInputsValid === 'yes'){
        this.loginIsTriggered  = true
        for(const info of this.loginFormInfo){
          loginInfo[info.id.toString()] = info.inputVal
        }
        loginInfo.ldap = false
        this.$store.dispatch('LoginByUsername', loginInfo).then(() => {
          this.loginIsTriggered  = false
          this.$router.push('/calendar/calendar');
          window.localStorage.setItem('tenant-name', this.loginFormInfo[0].inputVal)
        }).catch((error) => {
          this.loginIsTriggered  = false
          console.error(error)
          if (error.data.error === 'unauthorized_user') {
            this.eventBus.emit("notification", {
              title: "پیام",
              type: "error",
              bodyText: this.$store.getters.t("usernameOrPasswordIncorrect"),
              time: 5000,
            });
            this.btnAnimation = true;

          } else if (error.data.error_description === 'TENANT_IS_WRONG') {
            this.eventBus.emit("notification", {
              title: "پیام",
              type: "error",
              bodyText: this.$store.getters.t("wrong_tenant"),
              time: 5000,
            });
            this.btnAnimation = true;

          } else if (error.data.error_description === '402') {
            this.eventBus.emit("notification", {
              title: "پیام",
              type: "error",
              bodyText: this.$store.getters.t("three_times_incorrect_password"),
              time: 5000,
            });
            this.btnAnimation = true;
          } else if (error.data.error_description === '403') {
            this.eventBus.emit("notification", {
              title: "پیام",
              type: "error",
              bodyText: this.$store.getters.t("access_denied"),
              time: 5000,
            });
            this.btnAnimation = true;

          }
          this.loginIsTriggered = false;

        })
      }
    },
    resetBtnAnimation(){
      this.areAllInputsValid = 'not-decided-yet';
    },
    submitWithEnterKey(e){
      if(e.keyCode === 13){
        this.submitLoginForm();
      }
    }
  },
  mounted() {
    this.eventBus.on('reset-input',()=>{
      this.loginFormInfo[0].label = this.$store.getters.t("tenantName")
      this.loginFormInfo[1].label = this.$store.getters.t("userName")
      this.loginFormInfo[2].label = this.$store.getters.t("password")
    })
    this.eventBus.on('login-to-schedule',()=>{
      this.submitLoginForm();
    })

    window.addEventListener('keypress', this.submitWithEnterKey);
  },
  unmounted() {
    window.removeEventListener('keypress', this.submitWithEnterKey);
  }
}
</script>

<style scoped>
.form-control__forgot-password{
  width: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  bottom: 1rem;
}
.form-control__forgot-password > a {
  color: #1B76FF;
}
.form-control__forgot-password > a:hover {
  color:#1B76FF;
}
.version-control{
  /*position: absolute;*/
  /*bottom: 5%;*/
  position: relative;
  display: flex;
  flex-direction: column;
  width: 10rem;
  /*left: 20%;*/
  white-space: nowrap;
  bottom: 5%;
  right: 10rem;
  /*margin-top: 20%;*/

}
.version-control span{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  height: 2rem;
  width: 25%;

}

.form-control {
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column-reverse;
  justify-content: flex-end;
  align-items: flex-end;
}

a {
  float: right;
  text-decoration: none;
  color: #1B76FF;
  cursor: pointer;
}
.form {
  width: 33rem;
  height: 41rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

}

.forget-form {
  width: 45.2rem;
  height: 49.8rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.form__header {
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 600;
}

.form__header h2 {
  font-size: 2rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.8);
}

.form-control:nth-child(5) {
  display: flex;
  height: 3.5rem;
  justify-content: space-between;
}

.form-control:last-child {
  display: flex;
  justify-content: right;
  align-items: center;
}
.form-control__LDAP {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}
.form-control__LDAP > label {
  margin: 0 0.4rem;

}

.form-control__return-login {
  margin-top: 3rem;
  margin-bottom: 9rem;
  width: 100%;
  display: flex;
  flex-direction: row;
}
@media (min-width: 768px) and (max-width: 1024px) {
  .form {
    align-items: flex-start;

  }
  .version-control{
    right: 20rem;
  }
}
@media (min-width: 541px) and (max-width: 767px){
  .form {
    align-items: flex-start;

  }
  .form__header h2 {
    font-size: 2.3rem;
  }
  .version-control{
    right: 13rem;
  }
}
@media (min-width: 320px) and (max-width: 540px) {
  .form {
    align-items: flex-start;

    height: 40rem;
  }

  .version-control{
    right: 2rem;
    bottom: 8%;
  }
}
@media (max-width: 320px) {
  .form {
    align-items: flex-start;

    height: 40rem;
  }

  .version-control{
    right: 2rem;
    bottom: 8%;
  }
}


</style>

<template>
  <form-fragment>
    <form class="forget-form" autocomplete="off">
      <header :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" class="form__header">
        {{ $store.getters.t("forgetPassword") }}
      </header>
      <base-form-input
          v-for="info in forgetPasswordFormInfo"
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
      <div class="form-control">
        <!--      <div :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" class="form-control__return-login">-->
        <!--        <a @click="navigateToLoginForm">{{$store.getters.t("returnToLogin")}}</a>-->
        <!--      </div>-->
      </div>
      <div
          style="display: flex;flex-direction: row;justify-content: center;align-items: center;width: 100%;height: 4rem">
        <base-button
            :is-active="true"
            :shake-animation="areAllInputsValid === 'no'"
            @click="requestVerificationCode"
            :button-inner-txt="$store.getters.t('getCode')"
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
          <div class="loading__extra-content--text" style="color: #409EFF">{{ $store.getters.t("pleaseWait") }}</div>
        </template>
      </base-loading-spinner>
    </template>
  </base-modal>
</template>

<script>
// import phoneNumberSanitizer from "../../helpers/phone_number_sanitizer";
import RestClient from '@/api/restClient'
import BaseFormInput from "../UI/BaseFormInput";
import BaseButton from "../UI/BaseButton";
import FormFragment from "../UI/FormFragment";
import BaseLoadingSpinner from "../UI/BaseLoadingSpinner";
import BaseModal from "../UI/BaseModal";

export default {
  name: "ForgetPasswordForm",
  components: {FormFragment, BaseButton, BaseFormInput, BaseLoadingSpinner, BaseModal},
  emits: ['change-form'],
  data() {
    return {
      loginIsTriggered: false,
      restClient: new RestClient('auth'),
      forgetPasswordFormInfo: [
        {
          label: "نام سازمان",
          type: "text",
          validationType: "not-empty",
          id: "tenant-name",
          inputVal: "",
          isValid: false,
        },
        {
          label: "نام کاربری",
          type: "text",
          validationType: 'not-empty',
          id: "username",
          inputVal: "",
          isValid: false,
        },
      ],
      areAllInputsValid: 'not-decided-yet'
    }
  },
  methods: {
    navigateToLoginForm() {
      this.$emit('change-form', 'forget-password-form', 'login-form');
    },
    navigateToVerificationCodeForm() {
      this.$emit('change-form', 'forget-password-form', 'verification-code-form')
    },
    requestVerificationCode() {
      this.checkAllInputsValidity();
      if (this.areAllInputsValid === 'yes') {
        this.loginIsTriggered = true
        this.restClient
            .sendVerificationCode({
              username: this.forgetPasswordFormInfo[1].inputVal,
              tenant: this.forgetPasswordFormInfo[0].inputVal
            })
            .then(() => {
              this.loginIsTriggered = false
              this.eventBus.emit('forget-password-info',
                  {
                    tenantName: this.forgetPasswordFormInfo[0].inputVal,
                    userName: this.forgetPasswordFormInfo[1].inputVal
                  }
              )
              this.navigateToVerificationCodeForm();
            }).catch(error => {
          this.loginIsTriggered = false
          console.error(error)

          this.loginIsTriggered = false
        })
      }
    },
    checkEachInputValidity(id, isValid) {
      const foundFormInfo = this.forgetPasswordFormInfo.find(info => info.id === id);
      if (!foundFormInfo) return;
      foundFormInfo.isValid = isValid;
    },
    checkAllInputsValidity() {
      const inputsValidationResult = this.forgetPasswordFormInfo.every(info => info.isValid === 'yes');
      if (inputsValidationResult) {
        this.areAllInputsValid = 'yes';
      } else {
        this.areAllInputsValid = 'no';
      }
    },
    resetBtnAnimation() {
      this.areAllInputsValid = 'not-decided-yet';
    }
  },
  mounted() {
    this.eventBus.emit('show-return-forget-password', true)
    this.forgetPasswordFormInfo[0].label = this.$store.getters.t("tenantName")
    this.forgetPasswordFormInfo[1].label = this.$store.getters.t("userName")

    this.eventBus.on('reset-input', () => {
      this.forgetPasswordFormInfo[0].label = this.$store.getters.t("tenantName")
      this.forgetPasswordFormInfo[1].label = this.$store.getters.t("userName")
    })
  },
  unmounted() {
    this.eventBus.emit('show-return-forget-password', false)
  }

}
</script>

<style scoped>
a {
  float: right;
  text-decoration: none;
  color: #1B76FF;
  cursor: pointer;
}

.form-control {
  width: 100%;
}

.forget-form {
  width: 35.2rem;
  height: 27rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

/*.form-control__return-login {*/
/*  width: 100%;*/
/*  display: flex;*/
/*  flex-direction: row;*/
/*  position: relative;*/
/*  bottom: 2rem;*/
/*}*/
.form-control__return-login > a {
  color: #1B76FF;
}

.form-control__return-login > a:hover {
  color: #1B76FF;
}

.form__header {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 600;
}

/*@media (max-width: 767px) {*/
/*  .form-control__return-login {*/
/*    margin-top: 3.5rem;*/
/*    margin-bottom: 9rem;*/
/*    width: 100%;*/
/*    display: flex;*/
/*    flex-direction: row-reverse;*/
/*  }*/
/*}*/


@media (min-width: 768px) and (max-width: 1024px) {
  .forget-form {
    align-items: flex-start;
    height: 30rem;
    width: 35rem;
  }


}

@media (min-width: 541px) and (max-width: 767px) {
  .forget-form {
    align-items: flex-start;

    height: 30rem;
  }

}

@media (min-width: 320px) and (max-width: 540px) {
  .forget-form {
    align-items: flex-start;
    height: 30rem;
  }

}

@media (max-width: 320px) {
  .forget-form {
    align-items: flex-start;
    height: 40rem;
  }

}

</style>

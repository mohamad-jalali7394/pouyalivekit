<template>
  <div v-if="isMobile===false" class="background-image"></div>
  <div style="width: 100%;height: 100%;position: relative;">
    <div class="select-option-container">
      <choose-language :is-drop-downOpen="isDropDownOpen" :option-values="languages" v-model="selectedLang"
                       max-height="30rem" :side="'select-ltr'"
                       :arrow-direction="'arrow-down-icon-ltr'"
                       :select-side="'list-item__label-ltr'"
      ></choose-language>
    </div>
    <base-modal :is-blur="false" :is-login-page="'yes'" :open="true" >
      <template #modal-header>
        <div class="header-container">
          <div v-show="isReturnButtonShowed" class="return-button" @click="handleReturnButton">
            <img draggable="false" src="/img/arrow_back.svg" alt="not-loaded">
            <span style="font-size: 1.6rem;font-weight: 600">{{$store.getters.t("return")}}</span>
          </div>
          <div v-if="!isMobile" class="shooka-logo">
            <img draggable="false" class="login-logo--shookaweb" :src="logoAddress" alt="not-loaded" >
            <a v-if="logoAddress !== '/img/logo-login.svg'" style="font-size: 1rem;text-decoration: none;" href="https://www.shooka.ir/" target="_blank">Powered by Shooka</a>
          </div>

        </div>
      </template>
      <template #modal-body>
        <section
            :class="{'forms-container-login' :  whichForm === 'login-form', 'forms-container-forget' :  whichForm === 'forget-password-form'}">
          <base-slider :slides-info="formLabels" :sliding-action="sliderAction" @end-sliding="resetSliderAction">
            <template #slider-list="slotProps">
              <component
                  :is="formLabels.find(formLabel => formLabel === slotProps.currentSlide)"
                  :info-for-new-password="forgetPasswordInfo"
                  :user-name="userName"
                  :code="code"
                  :tenant-name="tenantName"
                  @change-form="navigateToSpecificForm"
              >
              </component>
            </template>
          </base-slider>
        </section>
        <div :class="{'version-container': $i18n.locale !== 'en','version-container__ltr': $i18n.locale === 'en'}">
          <div>
            <span> {{ $store.getters.t("version") }}</span>
            <span>{{ version }}</span>
          </div>
          <span style="height: 1.5rem;width: 0;border: 0.1rem solid #75758F">

          </span>
          <div>
            <span>{{ $store.getters.t("security-version") }}</span>
            <span>{{ securityVersion }}</span>
          </div>
        </div>
      </template>
    </base-modal>

  </div>

  <div v-if="isMobile" :class="{'version-container--mobile': $i18n.locale !== 'en','version-container--mobile__ltr': $i18n.locale === 'en'}">
    <div>
      <span> {{ $store.getters.t("version") }}</span>
      <span>{{ version }}</span>
    </div>
    <span style="height: 1.5rem;width: 0;border: 0.1rem solid #75758F">

          </span>
    <div>
      <span>{{ $store.getters.t("security-version") }}</span>
      <span>{{ securityVersion }}</span>
    </div>
  </div>

</template>

<script>
import auth from '../store/auth/index'
import BaseSlider from "../components/UI/BaseSlider";
import LoginForm from "../components/Forms/LoginForm";
import ForgetPasswordForm from "../components/Forms/ForgetPasswordForm";
import VerificationCodeForm from "../components/Forms/VerificationCodeForm";
import NewPasswordForm from "../components/Forms/NewPasswordForm";
import BaseFormInput from "../components/UI/BaseFormInput";
import compareArrayIndexes from "../helpers/compare_element_order_in_array";
import BaseModal from "../components/UI/BaseModal";
import DetectMobile from "../utils/detectMobile";
import ChooseLanguage from "../components/ChooseLanguage";
import config from "@/config";

export default {
  name: "LoginPage",
  components: {
    BaseFormInput,
    BaseSlider,
    LoginForm,
    ForgetPasswordForm,
    VerificationCodeForm,
    NewPasswordForm,
    BaseModal,
    ChooseLanguage
  },
  data() {
    return {
      isMobile: false,
      tenantName: '',
      code: '',
      userName: '',
      tempCurrentSlide: null,
      isAnimationEnded: false,
      sliderAction: null,
      formLabels: [
        'login-form',
        'forget-password-form',
        'verification-code-form',
        'new-password-form'
      ],
      languages: [
        {
          label: 'فارسی . Fa'
        },
        {
          label: 'انگلیسی . En'
        },

      ],
      selectedLang: {
        label: 'فارسی . Fa'
      },
      isDropDownOpen: false,
      forgetPasswordInfo: {},
      returnType: '',
      isReturnButtonShowed: false,
      whichForm: 'login-form',
      version: '1.2',
      securityVersion: '1.1.2',
      logoAddress:'',
    }
  },
  watch: {
    selectedLang: {
      deep: true,
      handler(value) {
        if (value.label === 'فارسی . Fa') {
          this.$i18n.locale = 'fa'
        } else {
          this.$i18n.locale = 'en'
        }
        localStorage.setItem('language', `${value.label}`)
        this.eventBus.emit('reset-input')
        this.eventBus.emit('change-language')


      }
    },
  },
  methods: {
    // someMethod(data) {
    //   this.active = data
    //   if (data === 1) {
    //     this.userName = this.$refs['sendverificationCode'].getUserName()
    //     this.tenant = this.$refs['sendverificationCode'].getTenant()
    //   }
    //   if (data === 2) {
    //     this.code = this.$refs['ConfirmVerificationCode'].getCode()
    //     this.tenant = this.$refs['ConfirmVerificationCode'].getTenant()
    //     this.phoneNumber = this.$refs['ConfirmVerificationCode'].getUserName()
    //   }
    // },
    removeLeftBorder() {
      this.isAnimationEnded = true
    },
    navigateToSpecificForm(currentForm, targetForm) {
      if (targetForm === 'forget-password-form') {
        this.whichForm = 'forget-password-form'
      } else if (targetForm === 'login-form') {
        this.whichForm = 'login-form'
      } else {
        this.whichForm = 'forget-password-form'
      }
      const compareResult = compareArrayIndexes(currentForm, targetForm, this.formLabels);
      if (compareResult.difference === 1) {
        if (compareResult.result === 'greater') {
          this.sliderAction = 'back';
        } else {
          this.sliderAction = 'next';
        }
      } else {
        this.$router.push('/login');
      }
      // this.tempCurrentSlide = null;
    },
    resetSliderAction() {
      this.sliderAction = null
    },
    handleReturnButton() {
      if (this.returnType === 'forgetPassword') {
        this.navigateToSpecificForm('forget-password-form', 'login-form')
      } else if (this.returnType === 'verificationCode') {
        this.navigateToSpecificForm('verification-code-form', 'forget-password-form')
      } else {
        this.navigateToSpecificForm('new-password-form', 'forget-password-form')
      }
    }
  },
  created() {
    auth.setMobile(false)
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  mounted() {
    this.logoAddress = config.VUE_APP_LOGO_LOGIN
    this.eventBus.on('show-return-forget-password', (value) => {
      this.isReturnButtonShowed = value
      this.returnType = 'forgetPassword'
    })
    this.eventBus.on('show-return-verification-code', (value) => {
      this.isReturnButtonShowed = value
      this.returnType = 'verificationCode'
    })
    this.eventBus.on('show-return-new-password', (value) => {
      this.isReturnButtonShowed = value
      this.returnType = 'newPassword'
    })
    if (localStorage.getItem('language') === 'فارسی . Fa') {

      this.selectedLang = {label: 'فارسی . Fa'}
    } else if (localStorage.getItem('language') === 'انگلیسی . En') {
      this.selectedLang = {label: 'انگلیسی . En'}
    } else {
      this.selectedLang = {label: 'فارسی . Fa'}
    }
    // this.eventBus.on('password-changed',()=>{
    //   this.eventBus.emit('notification', {
    //     title: 'پیام',
    //     type: 'success',
    //     bodyText: 'عملیات تغییر رمز عبور با موفقیت انجام شد',
    //     time: 5000
    //
    //   })
    // })
    const isChangedPassword = localStorage.getItem('change-password')
    if (isChangedPassword === 'yes') {
      this.eventBus.emit('notification', {
        title: 'پیام',
        type: 'success',
        bodyText: this.$store.getters.t("action_was_successful"),
        time: 5000

      })
    }
    this.eventBus.on('verification-code-info', (info) => {
      this.code = info.verificationCode
    })
    this.eventBus.on('forget-password-info', info => {
      this.forgetPasswordInfo = {...this.forgetPasswordInfo, ...info};
      this.userName = info.userName
      this.tenantName = info.tenantName
    });
    setTimeout(() => {
      localStorage.removeItem('change-password')
    }, 0)
  }
}
</script>

<style scoped>
.shooka-logo {
  width: 100%;
  height: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  top: 2rem;
  gap: 0.8rem;
}

.background-image {
  width: inherit;
  position: absolute;
  height: inherit;
  z-index: -5;
  background-color: #a2cae8;
  background-image: linear-gradient(50deg, #a2cae8 0%, #89c8e4 19%, #7fc9ea 39%, #99d0e8 60%, #acd6e8 80%, #ffffff 100%);
}
.login-logo--shookaweb {
  width: 7rem;
}
ul {
  width: 100%;
  height: 2rem;
  color: black
}

main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row-reverse;
}

.forms-container-login {
  position: relative;
  width: 32rem;
  height: 45rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.forms-container-forget {
  position: relative;
  width: 32rem;
  height: 31rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.return-button {
  width: 100%;
  height: 6rem;
  display: flex;
  flex-direction: row-reverse;
  gap: 0.8rem;
  align-items: center;
  cursor: pointer
}

.version-container {
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  position: absolute;
  bottom: -5rem;
  left: 0rem
}
.version-container > div{
  color: #75758F;font-size: 1.4rem;display: flex;flex-direction: row;gap: 0.4rem
}
.version-container__ltr {
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  position: absolute;
  bottom: -5rem;
  left: 0rem
}
.version-container__ltr > div{
  color: #75758F;font-size: 1.4rem;display: flex;flex-direction: row-reverse;gap: 0.4rem
}














.version-container--mobile {
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  position: absolute;
  bottom: 5rem;
  left: 0;
  z-index: 1010;
}
.version-container--mobile > div{
  color: #75758F;font-size: 1.4rem;display: flex;flex-direction: row-reverse;gap: 0.4rem
}
.version-container--mobile__ltr {
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  position: absolute;
  bottom: 5rem;
  left: 0rem
}
.version-container--mobile__ltr > div{
  color: #75758F;font-size: 1.4rem;display: flex;flex-direction: row;gap: 0.4rem
}
/*.welcome-container{*/
/*  width: calc(100% - 60rem);*/
/*  height: 100%;*/
/*  background-color: rgba(138, 180, 248, 0.2);*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*}*/
/*.welcome-container__inner{*/
/*  width: 49.2rem;*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*  justify-content: space-between;*/
/*  align-items: flex-start;*/
/*}*/
/*.logo{*/
/*  width: 100%;*/
/*}*/
/*.logo img{*/
/*  width: 100%;*/
/*}*/
/*.welcome-text{*/
/*  direction: rtl;*/
/*  width: 18ch;*/
/*  display: none;*/
/*  white-space: nowrap;*/
/*  overflow: hidden;*/
/*  font-size: 2.1vw;*/
/*  color: #676767;*/
/*}*/
/*.welcome-text__shooka{*/
/*  color: #2C65AA;*/
/*}*/
/*.welcome-text__w{*/
/*  color: #84B755;*/
/*}*/
/*.welcome-text__b{*/
/*  color: #E6A743;*/
/*}*/
/*.welcome-text--while-animating{*/
/*  display: block;*/
/*}*/
/*.welcome-text--animated{*/
/*  animation : typing 1.4s steps(23);*/
/*}*/
/*.welcome-text--left-border {*/
/*  border-left: .3rem solid;*/
/*}*/
/*@keyframes typing {*/
/*  from{*/
/*    width: 0;*/
/*  }*/
/*  to{*/

/*  }*/
/*}*/
.select-option-container {
  width: 14rem;
  position: relative;
  left: 1rem;
  top: 2rem;
  z-index: 1010;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .welcome-container {
    display: none;
  }

  .forms-container-login {
    position: relative;
    width: 32rem;
    height: 45rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .forms-container-forget {
    position: relative;
    width: 32rem;
    height: 31rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

}

@media (min-width: 541px) and (max-width: 767px) {
  .welcome-container {
    display: none;
  }

  .forms-container-login {
    position: relative;
    width: 32rem;
    height: 45rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .forms-container-forget {
    position: relative;
    width: 32rem;
    height: 31rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

@media (min-width: 401px) and (max-width: 540px) {
  .welcome-container {
    display: none;
  }
  .login-logo--shookaweb {
    width:6rem;
    position: relative;
    top:5rem;
  }

  .forms-container-login {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 8rem 0 0 0 ;
  }

  .forms-container-forget {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 8rem 0 0 0 ;
  }

  .shooka-logo {
    width: 100vw;
    bottom: 4rem;
  }
}

@media (max-width: 400px) {
  .forms-container-login {
    position: relative;
    width: 90vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 8rem 0 0 0 ;
  }

  .forms-container-forget {
    position: relative;
    width: 90vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 8rem 0 0 0 ;
  }

  .shooka-logo {
    width: 100vw;
    bottom: 4rem;
  }

}

</style>

<template>
  <div :class="{'input-container__login': isLoginForm ,'input-container': !isLoginForm } ">
    <div class="input-container__validation-message" :style="{direction:$i18n.locale !== 'en' ? 'rtl' : 'ltr'}" v-if="hasValidValue === 'no' && this.validationType">{{ messageForInvalidity }}</div>
  <input
      autocomplete="off"
      :type="type === 'password' ? passwordOrText: type"
      class="input-container__input"
      :class="inputStylesAfterValidation"
      :id="id"
      :value="modelValue"
      :maxlength="isAuthenticationCode ? 6 : 50"
      :style="{direction: (label === 'نام' || label === 'نام خانوادگی') ? 'rtl' :  'ltr',padding: (label === 'نام' || label === 'نام خانوادگی') ? '0 0.8rem' :  '0 5rem 0 0.8rem'}"
      @input="emitUpdatedModelValueForVModel"
      @keypress.enter="login(id)"
      ref="input"
      @keyup="validateInput"
      @blur="validateInput"/>
  <span v-if="validationType==='password' && id !== 'pass' && id !== 'repeat-new-password' " ref="eye" @touchstart.prevent="convertToTextMobile" @touchend="convertToPassword" @mousedown="convertToText" @mouseup="convertToPassword"  style="position: absolute;right: 1.6rem;z-index: 10;cursor: pointer;top: 3.1rem">
      <img draggable="false"

          v-show="passwordOrText === 'text'"
          alt="not loaded"
          src="/img/eye-open.svg"
          style="width: 2rem"
      />
      <img draggable="false"
          v-show="passwordOrText === 'password'"
          alt="not loaded"
          src="/img//eye-close.svg"
          style="width: 2rem"
      />
  </span>
    <label
        class="input-container__label"
        :class="labelStylesAfterValidation"
        :style="{ 'text-align': $i18n.locale !== 'en' ? 'right' : 'left'}"
        :for="id">{{ label }}
    </label>


  </div>
</template>

<script>

export default {
  name: "BaseFormInput",
  props : ['label', 'id', 'modelValue', 'type', 'validationType','isAuthenticationCode','isLoginForm'],
  emits : ['update:modelValue', 'validity-status','is-valid'],
  data(){
    return {
      passwordOrText:'password',
      hasValidValue : 'not-decided-yet',
      messageForInvalidity : '',
      invalidHandler : new Map([
        [
          'not-empty',
          {
            validationType : 'not-empty',
            validationHandler:() => {
              const message = this.$i18n.locale === "fa" ? this.label + ' نباید خالی باشد' : this.$store.getters.t("emptyTenantError");
              this.hasValidValue = (this.modelValue.length > 0)? 'yes' : 'no';
              this.messageForInvalidity = message;
            },
          }
        ],
        [
          'password',
          {
            validationType: 'password',
            validationHandler: () => {
              const message = this.$i18n.locale === 'fa' ?  'گذرواژه باید بین ۸ تا ۳۲ کاراکتر باشد' : this.$store.getters.t("passwordError");
              this.hasValidValue = (this.modelValue.length >= 8 && this.modelValue.length <= 32)? 'yes' : 'no';
              this.messageForInvalidity = message;
            }
          }
        ],
        [
          'OTP-verification-code',
          {
            validationType: 'OTP-verification-code',
            validationHandler: () => {
              const message = this.$i18n.locale === 'fa' ?'کد وارد شده باید عدد 6 رقمی باشد' : this.$store.getters.t("authenticationCodeError");
              this.hasValidValue = (this.modelValue.length === 6 && parseInt(this.modelValue) == this.modelValue)? 'yes' : 'no';
              this.messageForInvalidity = message;
            }
          }
        ],
        [
          'phone-number',
          {
            validationType: 'phone-number',
            validationHandler: () => {
              const message = this.$i18n.locale === 'fa' ?  'شماره تلفن وارد شده صحیح نمی باشد' : this.$store.getters.t("phoneNumberError");
              this.hasValidValue = ((this.modelValue.length === 11 || this.modelValue.length === 10) && parseInt(this.modelValue) == this.modelValue && this.modelValue.split('')[0] != 0)? 'yes' : 'no';
              this.messageForInvalidity = message;
            }
          }
        ]
      ])
    }
  },
  computed : {

    inputStylesAfterValidation(){
      let borderClassesAfterValidation = {};
      if(this.hasValidValue !== 'not-decided-yet' && this.validationType) {
        const validationBooleanFlag = (this.hasValidValue === 'yes')? true : false;
        borderClassesAfterValidation = {
          'input-container__input--valid' : validationBooleanFlag,
          'input-container__input--invalid' : !validationBooleanFlag
        };
      }
      return borderClassesAfterValidation;
    },
    labelStylesAfterValidation(){
      let borderClassesAfterValidation = {};
      if(this.hasValidValue !== 'not-decided-yet' && this.validationType) {
        const validationBooleanFlag = (this.hasValidValue === 'yes')? true : false;
        borderClassesAfterValidation = {
          'input-container__label--valid' : validationBooleanFlag,
          'input-container__label--invalid' : !validationBooleanFlag
        };
      }
      return borderClassesAfterValidation;
    }
  },
  methods : {
    convertToPassword(){
        this.passwordOrText = 'password'
      this.eventBus.emit('convert-to-password')
    },
    absorbEvent_(e) {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      e.cancelBubble = true;
      e.returnValue = false;
      return false;
    },
    convertToText(){
        this.passwordOrText = 'text'
      this.eventBus.emit('convert-to-text')
    },
    convertToTextMobile(){
      let node = this.$refs.eye
      node.ontouchstart = this.absorbEvent_;
      node.ontouchmove = this.absorbEvent_;
      node.ontouchend = this.absorbEvent_;
      node.ontouchcancel = this.absorbEvent_;
      this.passwordOrText = 'text'
    },
    login(id){
      if(id === 'tenantName'){
        this.$refs.input.blur()
        this.eventBus.emit('login-to-schedule')
      }
    },
    emitUpdatedModelValueForVModel(e){
      this.$emit('update:modelValue', e.target.value);
    },
    validateInput(){
      if(!this.invalidHandler.has(this.validationType)) return;
      this.invalidHandler.get(this.validationType).validationHandler();
      this.emitValidationStatus();
    },
    emitValidationStatus(){
      this.$emit('validity-status', this.id, this.hasValidValue);
    },
    setInitialTenantName(){
      let tenantName = window.localStorage.getItem('tenant-name');
      if(tenantName && this.id === 'tenantName'){
        this.$refs.input.value = tenantName;
        this.$emit('update:modelValue', tenantName);
        this.$emit('is-valid', 'tenantName');
        this.hasValidValue = 'yes' ;
      }
    }
  },
  mounted() {
    if (this.id === 'repeat-new-password'){
      this.eventBus.on('convert-to-text',()=>{
        this.passwordOrText = 'text'
      })
      this.eventBus.on('convert-to-password',()=>{
        this.passwordOrText = 'password'
      })
    }
    this.setInitialTenantName()
    this.eventBus.on('some-inputs-are-invalid',(data)=>{
      if (data.length > 0){
        const invalidIdx = data.findIndex((el)=>{
          return el.label === this.label
        })
        if (invalidIdx !== -1){
          this.hasValidValue = 'no'
        }
      }else {
        this.hasValidValue = 'yes'
      }


    })
  }
}
</script>

<style scoped>
.input-container {
  width: 18%;
  min-width: 20rem;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  gap: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  /*padding-top: 1.5rem;*/
  /*margin-top: 1.5rem;*/
}
.input-container__login {
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  gap: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  /*padding-top: 1.5rem;*/
  /*margin-top: 1.5rem;*/
}
.input-container__label {
  color: #75758F;
  font-size : 1.2rem;
  width: 100%;
  /*position: absolute;*/
  /*top: 1.2rem;*/
  /*right: 0;*/
  /*transition: 0.25s ease;*/
}
.input-container__label--valid{
  color : #75758F
}
.input-container__label--invalid{
  color : red
}
.input-container__input {
  width: 99%;
  background-color: #F6F6F7;
  /*border-bottom: 0.1rem solid #a2a2a2;*/
  font-size: 1.3rem;
  height: 3.4rem;
  /*padding-top: .25rem;*/
  font-weight: 400;
  -webkit-appearance: none;
  /*appearance: none;*/
  border-radius: 0.8rem;
  border: 0.1rem solid #eaeaea;
}
.input-container__input[type="password"]{
  font:small-caption;
  letter-spacing: 0.3rem;
  background-color: #F6F6F7;
}
.input-container__input[type="password"].input-container__input--invalid{
  color:red;
}
/*.input-container__input[type="password"].input-container__input--valid{*/
/*  color:#95d1cc;*/
/*}*/
.input-container__input:focus{
  outline: 0;
  background-color: transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  /*border-bottom-color: #a2a2a2;*/
}
/*.input-container__input:focus + .input-container__label {*/
/*  color: #75758F;*/
/*  !*transform: translateY(-2.5rem);*!*/
/*}*/
/*.input-container__input.input-container__input--valid + .input-container__label {*/
/*  transform: translateY(-2.5rem);*/
/*}*/
/*.input-container__input.input-container__input--invalid + .input-container__label {*/
/*  transform: translateY(-2.5rem);*/
/*}*/
/*.input-container__input--valid{*/
/*  border-bottom-color: #95d1cc;*/
/*}*/
.input-container__input--invalid{
  border :0.1rem solid red;
}
.input-container__validation-message{
  position: absolute;
  top: 6.5rem;
  width: 100%;
  font-size: 1.2rem;
  color : red;
}
</style>

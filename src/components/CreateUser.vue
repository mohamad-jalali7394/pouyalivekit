<template>
  <base-modal :open="isCreateUserOpen" is-blur="true">
    <template #modal-header>
      <header class="create-user__header">
        <h1>{{isUpdateUser ? $store.getters.t('edit-user') : $store.getters.t('create-new-user')}}</h1>
        <img draggable="false" src="/img/close.svg" style="width: 2.4rem;height: 2.4rem;cursor: pointer" @click="closeModal">
      </header>
    </template>
    <template #modal-body>
      <div class="create-user__body-container">
          <base-form-input v-for="info in userInfo"
                           :key="info.id"
                           :type="info.type"
                           :id="info.id"
                           :ref="info.id"
                           :label="info.label"
                           :is-authentication-code="false"
                           :validation-type="info.validationType"
                           :is-login-form="false"
                           v-model="info.inputVal">

          </base-form-input>
          <div>
            <span>{{ $store.getters.t('user-status') }}</span>
            <div style="display: flex;flex-direction: row;gap: 0.8rem">
              <div style="display: flex;flex-direction: row;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding: 0.8rem;width: 9.6rem">
                <input type="radio" id="activeStatus" name="userStatus" value="activeStatus" v-model="userStatus">
                <label for="activeStatus">{{ $store.getters.t('active') }}</label>
              </div>
              <div style="display: flex;flex-direction: row;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding: 0.8rem;width: 9.6rem">
                <input type="radio" id="inactiveStatus" value="inactiveStatus" name="userStatus" v-model="userStatus">
                <label for="inactiveStatus">{{ $store.getters.t('in-active') }}</label>
              </div>
            </div>
          </div>
          <div>
            <span>{{ $store.getters.t('gender') }}</span>
            <div style="display: flex;flex-direction: row;gap: 0.8rem">
              <div style="display: flex;flex-direction: row;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding: 0.8rem;width: 9.6rem">
                <input type="radio" id="male" name="gender" value="male"  v-model="gender">
                <label for="male">{{ $store.getters.t('male') }}</label>
              </div>
              <div style="display: flex;flex-direction: row;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding: 0.8rem;width: 9.6rem">
                <input type="radio" id="female" name="gender" value="female"  v-model="gender">
                <label for="female">{{ $store.getters.t('female') }}</label>
              </div>
            </div>
          </div>
          <div>
            <span>{{ $store.getters.t('user-title') }}</span>
            <div style="display: flex;flex-direction: row;gap: 0.8rem">
              <div style="display: flex;flex-direction: row;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding: 0.8rem;width: 9.6rem">
                <input type="radio" id="normal" name="role" value="normal" v-model="role">
                <label for="normal">{{ $store.getters.t('normal') }}</label>
              </div>
              <div style="display: flex;flex-direction: row;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding: 0.8rem;width: 9.6rem">
                <input type="radio" id="secretary" name="role" value="secretary"  v-model="role">
                <label for="secretary">{{ $store.getters.t('Secretary') }}</label>
              </div>
            </div>
          </div>
      </div>
    </template>
    <template #modal-buttons>
      <div class="create-user__actions">
        <base-button
            v-show="!isUpdateUser"
            :is-active="true"
            :button-inner-txt= "$store.getters.t('confirm-layout')"
            :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
            :style-types="['button--small']"
            @click="createUser"

        >

        </base-button>
        <base-button
            v-show="isUpdateUser"
            :is-active="true"
            :button-inner-txt="$store.getters.t('edit')"
            :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
            :style-types="['button--small']"
            @click="updateUser"

        >

        </base-button>
        <base-button
            :is-active="!sending"
            :button-inner-txt= "$store.getters.t('withdrawal')"
            :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
            :style-types="['button--small']"
            @click="closeModal"

        >

        </base-button>
      </div>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from "./UI/BaseModal";
import BaseFormInput from "./UI/BaseFormInput";
import BaseButton from "./UI/BaseButton";
import RestClient from "@/api/restClient";
export default {
  name: "CreateUser",
  props:['isCreateUserOpen','userId','isUpdateUser'],
  components: {BaseFormInput, BaseModal,BaseButton},
  data(){
    return {
      restClientUser: new RestClient('user'),
      userStatus:'activeStatus',
      gender:'male',
      role:'normal',
      dataForm: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        phoneNumber: '',
        username: '',
        active: false,
        gender:'',
        manageWebinar:false,
        isRoleSecretary:false,
      },
      sending: false,
      isUserStatusValid:true,
      isGenderValid:true,
      isRoleValid:true,
      areAllInputsValid:'no',
      userInfo:[
        {
          label: this.$store.getters.t('name'),
          type: "text",
          validationType :'not-empty',
          id: "name",
          inputVal: "",
          isValid: 'no',
        },
        {
          label: this.$store.getters.t('last-name'),
          type: "text",
          validationType :'not-empty',
          id: "lastName",
          inputVal: "",
          isValid: 'no',
        },
        {
          label: this.$store.getters.t('userName'),
          type: "text",
          validationType :'not-empty',
          id: "username",
          inputVal: '',
          isValid: 'no',
        },
        {
          label: this.$store.getters.t('phone-number'),
          type: "text",
          validationType :'phone-number',
          id: "phoneNumber",
          inputVal: "",
          isValid: 'no',
        },
        {
          label: this.$store.getters.t('Email'),
          type: "text",
          validationType :'not-empty',
          id: "email",
          inputVal: "",
          isValid: 'no',
        },
        {
          label: this.$store.getters.t('password'),
          type: "password",
          validationType :'password',
          id: "pass",
          inputVal: "",
          isValid: 'no',
        }
      ],
    }
  },
methods:{
  closeModal(){
    this.eventBus.emit('some-inputs-are-invalid',[])
    this.$emit('close-create-user-modal')
  },
  checkAllInputsValidity(){
    if (this.isUpdateUser) {
      const inputsValidationResult = this.userInfo.every(info => info.inputVal !== '' && info.validationType !== 'validationType');
      if(inputsValidationResult){
        this.areAllInputsValid = 'yes';
      } else {
        this.areAllInputsValid = 'no';
        const invalidInputes = this.userInfo.filter(info => info.inputVal === '' && info.validationType !== 'validationType');
        this.eventBus.emit('some-inputs-are-invalid',invalidInputes)
      }
    }else {
      const inputsValidationResult = this.userInfo.every(info => info.inputVal !== '');
      if(inputsValidationResult){
        this.areAllInputsValid = 'yes';
      } else {
        this.areAllInputsValid = 'no';
        const invalidInputes = this.userInfo.filter(info => info.inputVal === '');
        this.eventBus.emit('some-inputs-are-invalid',invalidInputes)
      }
    }


  },
  createUser() {
    this.$emit('start-loading')
    this.checkAllInputsValidity()
    if (this.userStatus === 'activeStatus'){
      this.dataForm.active = true
    }else {
      this.dataForm.active = false
    }
    if (this.gender === 'male'){
      this.dataForm.gender = "M"
    }else {
      this.dataForm.gender = "F"
    }
    if (this.role === 'normal'){
      this.dataForm.isRoleSecretary = false
    }else {
      this.dataForm.isRoleSecretary = true
    }
    this.dataForm.firstName = this.userInfo[0].inputVal
    this.dataForm.lastName = this.userInfo[1].inputVal
    this.dataForm.username = this.userInfo[2].inputVal
    this.dataForm.phoneNumber = this.userInfo[3].inputVal
    this.dataForm.email = this.userInfo[4].inputVal
    this.dataForm.password = this.userInfo[5].inputVal
    this.sending = true
      if (this.areAllInputsValid === 'yes') {
        this.sending = true
        this.restClientUser
            .create({
              'email': this.dataForm.email,
              'firstName': this.dataForm.firstName,
              'lastName': this.dataForm.lastName,
              'password': this.dataForm.password,
              'phoneNumber': this.dataForm.phoneNumber,
              'username': this.dataForm.username,
              'isRoleSecretary': this.dataForm.isRoleSecretary,
              'active': this.dataForm.active,
              'gender': this.dataForm.gender,
              'roles': [
                {
                  'roleName': 'ROLE_USER'
                }
              ]
            })
            .then(() => {
              this.$emit('end-loading')
              this.eventBus.emit("notification", {
                title: "پیام",
                type: "success",
                bodyText: this.$store.getters.t("user-created-successfully"),
                time: 5000,
              });
              this.closeModal()
            }).catch((err)=>{
          console.error(err)
          this.closeModal()
          this.sending = false
          this.$emit('end-loading')
        })
            .finally(() => {
              this.$emit('end-loading')
              this.sending = false
              this.closeModal()
            })
      } else {
        this.$emit('end-loading')
        this.sending = false;
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'لطفا فیلد های اجباری را پر کنید',
          time: 5000,
        });
      }

  },
  updateUser(){
    this.$emit('start-loading')
    this.checkAllInputsValidity()
    if (this.userStatus === 'activeStatus'){
      this.dataForm.active = true
    }else {
      this.dataForm.active = false
    }
    if (this.gender === 'male'){
      this.dataForm.gender = "M"
    }else {
      this.dataForm.gender = "F"
    }
    if (this.role === 'normal'){
      this.dataForm.isRoleSecretary = false
    }else {
      this.dataForm.isRoleSecretary = true
    }
    this.dataForm.firstName = this.userInfo[0].inputVal
    this.dataForm.lastName = this.userInfo[1].inputVal
    this.dataForm.username = this.userInfo[2].inputVal
    this.dataForm.phoneNumber = this.userInfo[3].inputVal
    this.dataForm.email = this.userInfo[4].inputVal
    this.dataForm.password = this.userInfo[5].inputVal
    this.sending = true
    if (this.areAllInputsValid === 'yes') {
      this.sending = true
      this.restClientUser
          .update({
            id: this.userId,
            'email': this.dataForm.email,
            'firstName': this.dataForm.firstName,
            'lastName': this.dataForm.lastName,
            'password': this.dataForm.password,
            'phoneNumber': this.dataForm.phoneNumber,
            'username': this.dataForm.username,
            'isRoleSecretary': this.dataForm.isRoleSecretary,
            'active': this.dataForm.active,
            'gender': this.dataForm.gender,
            'roles': [
              {
                'roleName': 'ROLE_USER'
              }
            ]
          })
          .then(() => {
            this.$emit('end-loading')
            this.eventBus.emit("notification", {
              title: "پیام",
              type: "success",
              bodyText: this.$store.getters.t("user-edited-successfully"),
              time: 5000,
            });
            this.closeModal()
          }).catch((err)=>{
        console.error(err)
        this.$emit('end-loading')
        this.sending = false
        this.closeModal()
      })
          .finally(() => {
            this.$emit('end-loading')
            this.sending = false
            this.closeModal()
          })
    } else {
      this.$emit('end-loading')
      this.sending = false;
      this.eventBus.emit("notification", {
        title: "پیام",
        type: "error",
        bodyText: 'لطفا فیلد های اجباری را پر کنید',
        time: 5000,
      });
    }

  },
  getData(userId) {
    try {
      this.sending = true
      if (!userId) return
      this.restClientUser
          .getById(userId)
          .then((response) => {
            if (response.data) {
              console.error(response.data)
              this.userInfo[4].inputVal = response.data.email
              this.userInfo[0].inputVal = response.data.firstName
              this.userInfo[1].inputVal = response.data.lastName
              this.userInfo[5].inputVal = response.data.password
              this.userInfo[3].inputVal = response.data.phoneNumber
              this.userInfo[2].inputVal = response.data.username
              if (response.data.active === true){
                this.userStatus = 'activeStatus'
              }else {
                this.userStatus = 'inactiveStatus'
              }

              if (response.data.gender === 'F') {
                this.gender = 'female'
              } else{
                this.gender = 'male'
              }
              if (response.data.roles.length > 1) {
                this.isRoleSecretary = true
                this.role = 'secretary'
              }else {
                this.isRoleSecretary = false
                this.role = 'normal'
              }
            }
          })
          .finally(() => {
            this.sending = false
          })
    } catch (error) {
      this.sending = false
    }
  },
},
  mounted() {
    if (this.isUpdateUser){
      this.getData(this.userId.toString())
    }
  }
}
</script>

<style scoped>
.create-user__header {
  width: 65rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
}

.create-user__header > h1 {
  font-size: 2.5rem;
  font-weight: 400;
  color: #292933;
}

.create-user__body-container {
  width: 65rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.6rem;
}
.create-user__body-container input {
  cursor: pointer;
}
.create-user__body-container label {
cursor: pointer;
}
.create-user__actions{
  width: 65rem;
  height: 5rem;
  display: flex;
  justify-content: flex-start;
  gap: 0.8rem;
}
@media (max-width: 760px) {
  .create-user__header {
    width: 50rem;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
  }
  .create-user__body-container {
    width: 50rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1.6rem;
  }
  .create-user__actions{
    width: 50rem;
    height: 5rem;
    display: flex;
    justify-content: flex-start;
    gap: 0.8rem;
  }

}
@media (max-width: 580px) {
  .create-user__header {
    width: 38rem;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
  }
  .create-user__body-container {
    width: 38rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1.6rem;
    max-height:40rem ;
    overflow-y: auto;
  }
  .create-user__actions{
    width: 38rem;
    height: 5rem;
    display: flex;
    justify-content: flex-start;
    gap: 0.8rem;
  }

}
@media (max-width: 400px) {
  .create-user__header {
    width: 30rem;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
  }
  .create-user__body-container {
    width: 30rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1.6rem;
    max-height:40rem ;
    overflow-y: auto;
  }
  .create-user__actions{
    width: 30rem;
    height: 5rem;
    display: flex;
    justify-content: flex-start;
    gap: 0.8rem;
  }

}
</style>
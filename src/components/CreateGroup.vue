<template>
  <base-modal :open="isCreateGroupOpen" is-blur="true">
    <template #modal-header>
      <header class="create-group__header">
        <h1 v-if="!isUpdateGroup">{{ $store.getters.t('create-new-group') }}</h1>
        <h1 v-else>{{ $store.getters.t('edit-group') }}</h1>
        <img draggable="false" src="/img/close.svg" style="width: 2.4rem;height: 2.4rem;cursor: pointer" @click="closeModal">
      </header>
    </template>
    <template #modal-body>
      <div class="create-group__body-container">
        <div class="group-name__container">
          <div >
            <label style="color: #75758F;font-size : 1.2rem;width: 100%;"
                   :style="{color:isGroupNameInvalid ? 'red' : ''}">{{ $store.getters.t('group-name') }}</label>
            <input type="text" class="group-management-input__search"
                   :style="{'border':isGroupNameInvalid ? '0.1rem solid red' : ''}" v-model.trim="groupName"/>
            <span v-if="isGroupNameInvalid" style="font-size: 1.2rem" :style="{color:isGroupNameInvalid ? 'red' : ''}">{{ $store.getters.t('the-group-name-must-contain-at-least-3-characters') }}</span>
          </div>
          <div >
            <label style="color: #75758F;font-size : 1.2rem;width: 100%;">{{ $store.getters.t('add-new-user') }}</label>
            <input type="text" class="group-management-input__search" v-model="searchedName" @keyup="searchUser"
                   @focus="focusUser" @blur="blurUser"/>
            <div
                class="found-users-in-group--container"
                v-if="foundUsersToAddGroup.length > 0"
                :style="{'max-height':'21rem'}"
            >
              <ul :style="{'max-height':'21rem'}">
                <li
                    v-for="user in foundUsersToAddGroup"
                    :key="user.id"
                    class="found-user-invite-list"
                    @mousedown="clickToAddUser(user)"
                >
                  {{ user.firstName + " " + user.lastName }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style="width: 100%;overflow-x: auto;display: flex;flex-direction: column">
          <div ref="table-th" class="users-in-group-table__th">
            <span v-for="el in userListTh" :key="el">{{ el }}</span>
          </div>
          <ul class="users-in-group-table__Ul" :style="{'max-height':'25rem'}">
            <li class="users-in-group-table__list" v-for="user in addedUsers" :key="user.id">
              <div><span class="user-in-group-info">{{ user.username }}</span></div>
              <div><span class="user-in-group-info">{{ user.firstName }}</span></div>
              <div><span class="user-in-group-info">{{ user.lastName }}</span></div>
              <div><span class="user-in-group-info">{{ user.phoneNumber }}</span></div>
              <div><span class="user-in-group-info-email">{{ user.email }}</span></div>
              <div>
                <img draggable="false" src="/img/delete.svg" style="cursor: pointer" alt="not loaded" @click="deleteUser(user)">
              </div>
            </li>
          </ul>
          <div v-if="addedUsers?.length < 1" style="width: 100%;display: flex;justify-content: center"> {{ $store.getters.t('add-people-to-the-list') }} </div>
        </div>

      </div>
    </template>
    <template #modal-buttons>
      <div class="create-group__actions">
        <base-button
            v-show="!isUpdateGroup"
            :is-active="true"
            :button-inner-txt= "$store.getters.t('confirm-layout')"
            :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
            :style-types="['button--small']"
            @click="createGroup"

        >

        </base-button>
        <base-button
            v-show="isUpdateGroup"
            :is-active="true"
            :button-inner-txt="$store.getters.t('edit')"
            :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
            :style-types="['button--small']"
            @click="updateGroup"

        >

        </base-button>
        <base-button
            :is-active="!sending"
            :button-inner-txt="$store.getters.t('withdrawal')"
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
import BaseModal from "./UI/BaseModal";
import BaseButton from "./UI/BaseButton";
import RestClient from "@/api/restClient";
import BaseLoadingSpinner from "@/components/UI/BaseLoadingSpinner.vue";

export default {
  name: "CreateGroup",
  props: ['groupId', 'isCreateGroupOpen', 'isUpdateGroup'],
  components: {BaseLoadingSpinner, BaseModal, BaseButton},
  data() {
    return {
      groupName: '',
      searchedName: '',
      addedUsers: [],
      allUsers: [],
      isUserFound: false,
      isGroupNameInvalid: false,
      isUserFocused: false,
      foundUsersToAddGroup: [],
      userListTh: [this.$store.getters.t('userName'), this.$store.getters.t('name'), this.$store.getters.t('last-name'), this.$store.getters.t('phone-number'), this.$store.getters.t('Email'), this.$store.getters.t('action')],
      restClientGroup: new RestClient('group'),
      restClientUser: new RestClient('user'),
      restClientUserGroup: new RestClient('userGroup'),
      userStatus: 'activeStatus',
      gender: 'male',
      role: 'normal',
      hasWebinar: false,
      dataForm: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        phoneNumber: '',
        username: '',
        active: false,
        gender: '',
        manageWebinar: false,
        isRoleSecretary: false,
      },
      sending: false,
      isUserStatusValid: true,
      isGenderValid: true,
      isRoleValid: true,
      areAllInputsValid: 'no',
      userInfo: [
        {
          label: "نام",
          type: "text",
          validationType: 'not-empty',
          id: "name",
          inputVal: "",
          isValid: 'no',
        },
        {
          label: "نام خانوادگی",
          type: "text",
          validationType: 'not-empty',
          id: "lastName",
          inputVal: "",
          isValid: 'no',
        },
        {
          label: "نام کاربری",
          type: "text",
          validationType: 'not-empty',
          id: "username",
          inputVal: '',
          isValid: 'no',
        },
        {
          label: "شماره تلفن همراه",
          type: "text",
          validationType: 'phone-number',
          id: "phoneNumber",
          inputVal: "",
          isValid: 'no',
        },
        {
          label: "ایمیل",
          type: "text",
          validationType: 'not-empty',
          id: "email",
          inputVal: "",
          isValid: 'no',
        },
        {
          label: "رمز عبور",
          type: "text",
          validationType: 'password',
          id: "pass",
          inputVal: "",
          isValid: 'no',
        }
      ],
      isLoading:false,
    }
  },
  watch: {
    groupName(val) {
      if (val.length > 2) {
        this.isGroupNameInvalid = false
      }
    },
    isLoading(val){
      console.error('waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaatchhhhhhhhhhhhhhhhhhhh')
      console.error(val)
    }
  },
  methods: {
    getAllUsers() {
      this.allUsers = [];
      this.restClientUser
          .getAll()
          .then((users) => {
            this.allUsers = users;
          })
          .catch((err) => {
            console.log(err);
          });
    },
    searchUser() {
      const inpValue = this.searchedName;
      if (this.searchedName === "") {
        this.isUserFound = false;
      }
      this.foundUsersToAddGroup = this.allUsers.filter((el) => {
        if (
            ((el.firstName + " " + el.lastName).includes(inpValue) ||
                el.username.includes(inpValue)) &&
            inpValue.length !== 0
        ) {
          return true;
        }
      });
    },
    focusUser() {
      this.isUserFocused = true;
    },
    blurUser() {
      this.isUserFocused = false;
    },
    clickToAddUser(user) {
      const index = this.addedUsers.findIndex((el) => {
        return el.id == user.id;
      });
      if (index === -1) {
        this.addedUsers.push(user);
      }
      // this.foundUsersToAddGroup = []
      // this.searchedName = ''
    },
    deleteUser(deletedUser) {
      const index = this.addedUsers.findIndex((user)=>{
        return +user.id === +deletedUser.id
      })
      if (index > -1){
        this.addedUsers.splice(index, 1)
      }
    },
    closeModal() {
      this.eventBus.emit('some-inputs-are-invalid', [])
      this.$emit('close-create-group-modal')
    },
    checkAllInputsValidity() {
      if (this.isupdateGroup) {
        const inputsValidationResult = this.userInfo.every(info => info.inputVal !== '' && info.validationType !== 'validationType');
        if (inputsValidationResult) {
          this.areAllInputsValid = 'yes';
        } else {
          this.areAllInputsValid = 'no';
          const invalidInputes = this.userInfo.filter(info => info.inputVal === '' && info.validationType !== 'validationType');
          this.eventBus.emit('some-inputs-are-invalid', invalidInputes)
        }
      } else {
        const inputsValidationResult = this.userInfo.every(info => info.inputVal !== '');
        if (inputsValidationResult) {
          this.areAllInputsValid = 'yes';
        } else {
          this.areAllInputsValid = 'no';
          const invalidInputes = this.userInfo.filter(info => info.inputVal === '');
          this.eventBus.emit('some-inputs-are-invalid', invalidInputes)
        }
      }


    },
    createGroup() {
      this.$emit('start-loading')
      if (this.addedUsers?.length > 0 && this.groupName.length > 2) {
        const userIds = this.addedUsers.map((user) => {
          return user.id
        })
        this.sending = true
        this.restClientGroup
            .create({
              name: this.groupName
            })
            .then((data) => {
              this.restClientUserGroup
                  .modify(data.data, userIds)
                  .then(() => {
                    this.eventBus.emit("notification", {
                      title: "پیام",
                      type: "success",
                      bodyText: this.$store.getters.t("group-created-successfully"),
                      time: 5000,
                    });
                    this.$emit('group-created')

                  })
                  .finally(() => {
                    this.sending = false
                  })
              this.closeModal()
            }).catch((err) => {
          console.error(err)
          this.sending = false
        })
            .finally(() => {
              this.sending = false
            })
      } else if (this.groupName.length < 3) {
        this.isGroupNameInvalid = true
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'نام گروه باید حد اقل شامل 3 کاراکتر باشد',
          time: 5000,
        });
      } else {
        this.sending = false;
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'کاربری برای ایجاد گروه اضافه نشده است',
          time: 5000,
        });
      }

    },
    updateGroup() {
      this.$emit('start-loading')
      if (this.addedUsers?.length > 0 && this.groupName.length > 2) {
        const userIds = this.addedUsers.map((user) => {
          return user.id
        })
        this.sending = true
        this.restClientGroup
            .update({
              id: this.groupId,
              name: this.groupName
            })
            .then(() => {
              this.restClientUserGroup
                  .modify(this.groupId, userIds)
                  .then(() => {
                    this.eventBus.emit("notification", {
                      title: "پیام",
                      type: "success",
                      bodyText: this.$store.getters.t("group-edited-successfully"),
                      time: 5000,
                    });

                  })
                  .finally(() => {
                    this.sending = false
                  })
              this.closeModal()
            }).catch((err) => {
          console.error(err)
          this.sending = false
        })
            .finally(() => {
              this.sending = false
            })
      } else if (this.groupName.length < 3) {
        this.isGroupNameInvalid = true
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'نام گروه باید حد اقل شامل 3 کاراکتر باشد',
          time: 5000,
        });
      } else {
        this.sending = false;
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'کاربری برای ایجاد گروه اضافه نشده است',
          time: 5000,
        });
      }
    },
    getData(groupId) {
      try {
        this.sending = true
        if (!groupId) return
        this.restClientGroup
            .getById(groupId)
            .then((response) => {
              console.error(response)
              if (response.data) {
                this.groupName = response.data.name
                this.isLoading = true
                this.restClientUserGroup
                    .getAllUsersByGroupId(groupId)
                    .then(data => {
                      console.error(data)
                      this.addedUsers = data
                      this.isLoading = false
                    })
                    .finally(() => {
                      this.sending = false
                    })
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
    this.getAllUsers()
    if (this.isUpdateGroup) {
      this.getData(this.groupId.toString())
    }
  }
}
</script>

<style scoped>
.create-group__header {
  width: 100rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
}

.create-group__header > h1 {
  font-size: 2.5rem;
  font-weight: 400;
  color: #292933;
}

.create-group__body-container {
  width: 100rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.group-name__container {
  display: flex;
  flex-direction: row;
  justify-content: space-between
}
.group-name__container >div {
  display: flex;flex-direction: column;gap: 0.8rem;width:45%;position: relative
}
.create-group__actions {
  width: 100rem;
  height: 5rem;
  display: flex;
  justify-content: flex-start;
  gap: 0.8rem;
}

.group-management-input__search {
  width: 100%;
  background-color: #F6F6F7;
  font-size: 1.3rem;
  height: 3.4rem;
  font-weight: 400;
  -webkit-appearance: none;
  border-radius: 0.8rem;
  border: 0.1rem solid #eaeaea;
  direction: rtl;
  padding: 0 0.8rem;
}

.group-management-input__search:focus {
  outline: 0;
  background-color: transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}

.users-in-group-table__th {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.6rem;
  min-width: 70rem;
}

.users-in-group-table__th > span {
  width: 19%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
}

.users-in-group-table__th > span:last-child {
  width: 5%;
  min-width: 4rem;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-start;
}

.users-in-group-table__Ul {
  width: 100%;
  display: flex;
  flex-direction: column;
  direction: rtl;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  min-width: 70rem;
}

.users-in-group-table__list {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 1.6rem;
}

.users-in-group-table__list:nth-child(odd) {
  background-color: #F6F6F7;
}

.users-in-group-table__list > div {
  width: 18%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}
.users-in-group-table__list > div > span{
  display: block;
  max-width: 95%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.users-in-group-table__list > div:last-child {
  position: relative;
  left: -1rem;
}

.users-in-group-info {
  display: block;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  direction: rtl;
  font-size: 1.4rem;
  font-weight: 400;
}

.users-in-group-info-email {
  display: block;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  direction: ltr;
  font-size: 1.4rem;
  font-weight: 400;
}

.users-in-group-table__list > div:last-child {
  width: 10%;
  min-width: 6rem;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
}

.found-users-in-group--container {
  position: absolute;
  width: 100%;
  max-height: 21rem;
  top: 6rem;
  overflow-y: scroll;
  direction: rtl;
  border: 0.1rem solid #F6F6F7;
  border-radius: 1rem;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  z-index: 10;
  background-color: white;
}

.found-user-invite-list {
  width: 100%;
  height: 3rem;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 400;
  color: #75758F;
}

.found-user-invite-list:hover {
  background-color: #F2F2F2;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;

}

@media (max-width: 1024px) {
  .create-group__header {
    width: 80rem;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
  }


  .create-group__body-container {
    width: 80rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  .create-group__actions {
    width: 80rem;
    height: 5rem;
    display: flex;
    justify-content: flex-start;
    gap: 0.8rem;
  }
}

@media (max-width: 900px) {
  .create-group__header {
    width: 70rem;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
  }


  .create-group__body-container {
    width: 70rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  .create-group__actions {
    width: 70rem;
    height: 5rem;
    display: flex;
    justify-content: flex-start;
    gap: 0.8rem;
  }
}


@media (max-width: 780px) {
  .create-group__header > h1 {
    font-size: 2.7rem;
    font-weight: 400;
    color: #292933;
  }
  .group-name__container {
    display: flex;
 flex-direction: column;
    gap: 0.8rem;
  }
  .group-name__container > div {
    width: 80%;
  }
  .create-group__header {
    width: 55rem;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
  }


  .create-group__body-container {
    width: 55rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  .create-group__actions {
    width: 55rem;
    height: 5rem;
    display: flex;
    justify-content: flex-start;
    gap: 0.8rem;
  }
}

@media (max-width: 580px) {
  .create-group__header > h1 {
    font-size: 2.5rem;
    font-weight: 400;
    color: #292933;
  }

  .create-group__header {
    width: 38rem;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
  }


  .create-group__body-container {
    width: 38rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  .create-group__actions {
    width: 38rem;
    height: 5rem;
    display: flex;
    justify-content: flex-start;
    gap: 0.8rem;
  }

}

@media (max-width: 440px) {
  .create-group__header > h1 {
    font-size: 2.2rem;
    font-weight: 400;
    color: #292933;
  }

  .create-group__header {
    width: 30rem;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
  }


  .create-group__body-container {
    width: 30rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  .create-group__actions {
    width: 30rem;
    height: 5rem;
    display: flex;
    justify-content: flex-start;
    gap: 0.8rem;
  }

}
</style>
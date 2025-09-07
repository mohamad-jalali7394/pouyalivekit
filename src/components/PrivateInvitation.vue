<template>
  <base-modal is-blur="true" :open="modalOpen">
    <template #modal-header>
      <div :class="$i18n.locale === 'fa' ? 'header-container--private--invitation-rtl' : 'header-container--private--invitation-ltr' ">
        <div>
          <img
              src="/img/close.svg"
              alt="not loaded"
              @click="closeInvitationModal"
              style="cursor: pointer"
          />
        </div>
        <div>
          <h2 ref="h2">{{ $t("create-private-room") }}</h2>
        </div>
      </div>
    </template>
    <template #modal-body>
      <div class="body-container--private">
        <div :class=" $i18n.locale === 'fa' ? 'top__section-body-container-rtl' : 'top__section-body-container-ltr'">
          <div class="email-text-container">
            <span style="margin: 0 0.1rem">{{$t("send-to-email")}}</span>
          </div>
          <div class="email__address-container" @click="clickToEnterEmail">
            <span
                v-if="numberOfAddedEmail.length === 0 && isClickedToEnterEmail === false"
                :class=" $i18n.locale === 'fa' ? 'search__email-container__text' : 'search__email-container__text-ltr'"
            >{{$t("enter-email-address")}}</span>

            <div class="emails-container">
              <base-badge
                  :show-badge="false"
                  mode="email__mode"
                  v-for="user in numberOfAddedEmail"
                  :key="user"
                  :badge-text="user.email"
                  text-width="email__text"
                  :close="'close-badge--ltr'"
                  @close-badge="closeBadge(user)"
              ></base-badge>
              <div
                  v-if="numberOfOtherEmails > 0"
                  class="badge-list__others"
                  @click="showOtherEmails"
              >
                <p>{{ numberOfOtherEmails + '+' }}</p>
                <div v-if="emailIsShown">
                  <ul class="participants__more">
                    <li
                        v-for="user in otherEmails"
                        :key="user"
                        class="participant"
                    >
                      <span class="hidden-badge" @click="closeBadge(user)">+</span>
                      {{ user.email }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="search__email-container">
                <input
                    ref="input"
                    @focus="focusToSearchEmail"
                    @blur="clickToBlurEmailContainer"
                    class="search__email-input"
                    type="text"
                    @keydown.enter="pressEnterToAddEmails"
                    @keyup="searchEmails"
                    @keydown="deleteAndMoveAlongEmail"
                    :value="emailSearchInput.toLowerCase()" @input="emailSearchInput = $event.target.value.toLowerCase()"
                />

                <ul
                    class="found__users"
                    v-if="isEmailFound && emailSearchInput !=='' "
                    tabindex="0"
                    ref="emails"
                    @blur="focusedIndex = 0"
                    @keydown="selectAndMoveAlongEmails"
                >
                  <li
                      tabindex="0"
                      v-for="(user,index) in foundEmails"
                      :key="user"
                      class="found__users-list"
                      @click="addToEmailList(user)"
                      :class="focusedList(index)"
                  >
                    <p>{{ user.email }}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom__section-body-container">
          <div class="email__title-container">
            <div :class=" $i18n.locale === 'fa' ? 'email__title-rtl' : 'email__title-ltr'">
              <span>{{$t("email-title")}}</span>
            </div>
            <div class="email__title-input-container">
              <input type="text" :style="{direction : $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" disabled v-model.trim="emailTitle"/>
            </div>
          </div>
          <div class="invitation__text-container">
            <div  :class=" $i18n.locale === 'fa' ? 'invitation__text-rtl' : 'invitation__text-ltr'">{{$t("invitation-link")}}</div>
            <div>
              <textarea :style="{direction : $i18n.locale === 'fa' ? 'rtl' : 'ltr'}"  disabled type="text" v-model.trim="invitationText"></textarea>
            </div>
          </div>
          <div class="meeting__link-container">
            <div class="meeting__link-input-container">
              <input disabled type="text" ref="meetingLink" v-model="meetLink"/>
            </div>
            <div class="copy__icon-container">
              <div class="copy__icon__text">
                <span
                    v-if="isLinkCopied"
                >{{$t("copy-meeting-link")}}</span>
              </div>

              <div class="icon__copy" @click="copyToClipboard">
                <img
                    src="/img/Copy.svg"
                    style="width: 60%"
                    alt="not loaded"
                    @click="copyToClipboard"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #modal-buttons>
      <div class="button-container--private">


                    <base-button :is-active="true"
                                 :continuous-params="[
        'background-color=#1B76FF',
          'color=white', 'width=12.1rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
                                 :button-inner-txt="$store.getters.t('invite-and-enter')"
                                 @btn-clicked="inviteUsers"></base-button>





<!--        <base-button-->
<!--            is-active="true"-->
<!--            :button-type="['button&#45;&#45;ultra-big', 'button&#45;&#45;curved', 'background-color=#95d1cc', 'color=white','width=5rem','font-weight=bold','font-size=1.2rem']"-->
<!--            :button-content='$t("invite-and-enter")'-->
<!--            @click="inviteUsers"-->
<!--        ></base-button>-->
      </div>
    </template>
  </base-modal>
</template>

<script>
// import BaseModal from "./BaseModal";
// import BaseButton from "./BaseButton";
import BaseModal from "@/components/UI/BaseModal.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import BaseBadge from "@/components/UI/BaseBadge.vue";
import RestClient from "../api/restClient";
import {nextTick} from "vue";
import userStatus from "../statics/types/userStatus";
import DetectMobile from '../utils/detectMobile'
const restClientUser = new RestClient("user");
const restClientPrivateRoom = new RestClient("privateRoom");
const restClient = new RestClient('controlMeeting')

export default {
  components: {BaseModal, BaseButton, BaseBadge},
  props: ["privateInvitationIsOpen", "privateMeetingName"],
  data() {
    return {
      passwordInput: '12345678',
      amIModeratorPrivate: false,
      scroll: -35,
      focusedIndex: 0,
      isInputFocused: false,
      isClickedToEnterEmail: false,
      isLinkCopied: false,
      emailIsShown: false,
      allUsers: [],
      userIds: [],
      foundEmails: [],
      inviteEmails: [],
      isEmailFound: false,
      emailSearchInput: "",
      meetingLink: "",
      addedEmails: [],
      isMobile: false,

    };
  },
  computed: {
    emailTitle() {
      return this.$t("invite-to-virtual-meeting");
    },
    invitationText() {
      return (
          this.$t("Greetings-and-Regards") +
          "\r\n" +
          this.$t("you-invited-to") +
          " " +
          this.privateMeetingName +
          " " +
          this.$t("join-with-link")
      );
    },
    numberOfAddedEmail() {
      return this.addedEmails.filter((el, idx) => {
        if (this.isMobile === true) {
          return idx < 5;
        } else {
          return idx < 19;
        }
      });
    },
    numberOfOtherEmails() {
      if (this.isMobile === true) {
        return this.addedEmails.length - 5;
      } else {
        return this.addedEmails.length - 19;
      }
    },
    otherEmails() {
      return this.addedEmails.filter((el, idx) => {
        if (this.isMobile === true) {
          return idx > 4;
        } else {
          return idx > 18;
        }
      });
    },
    modalOpen() {
      if (this.privateInvitationIsOpen) {
        this.generatePassword()
        return true;
      } else return false;
    },
    meetLink() {
      return this.meetingLink;
    },
  },

  mounted() {
    if (this.modalOpen) {
      this.generatePassword()
    }
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  }
  ,

  watch: {
    isLinkCopied(val) {
      if (val === true) {
        setTimeout(() => {
          this.isLinkCopied = false;
        }, 6000);
      }
    },
    meetingLink(val) {
      this.meetingLink = val;
    },

  },
  methods: {
    joinToSession() {
      restClient.iWantToJoinPrivate(this.$store.getters.privateRoomId).then((response) => {
        if (!response) {
          return;
        }
        this.$store.dispatch("setIsPrivateRoom", true)
        sessionStorage.setItem('isPrivate','true')
        this.$store.dispatch("setSessionId", this.$store.getters.privateRoomId);
        this.$store.dispatch('setConferenceId',this.$store.getters.privateRoomId)
        this.$store.dispatch("setRoomId", this.$store.getters.privateRoomId);
        this.amIModeratorPrivate = parseInt(this.$store.getters.userId) === parseInt(this.$store.getters.privateRoomOwnerUserId);
        this.$store.dispatch("setIsPrivateRoom", true)
        this.$store.dispatch("setAmIModerator", true);
        this.$store.dispatch("setSessionName",  "اتاق شخصی" + " " + this.privateMeetingName);
        this.$store.dispatch("setSessionId", this.$store.getters.privateRoomId);
        this.$store.dispatch('setSessionToken', response.data.token)
        this.$store.dispatch("setSessionShareToken", response.data.shareToken);
        this.$store.dispatch("setUserStatus", userStatus.inConference);
        this.$store.dispatch("setIsPrivateUser", userStatus.isPrivateUser);
        this.$store.dispatch("setScheduleId", this.$store.getters.privateRoomId);
        sessionStorage.setItem("publishCount", response.data.publishCount);
        this.$router.push({
          name: "Conference",
          path: "/conference",
          params: {
            isPublicUser: true,
            myUserName: this.$store.getters.displayName,
          },
        });
      }).catch((error) => {
        throw error;
      });
      return;
    },
    generatePassword() {
      restClientPrivateRoom
          .generateNewPassword(
              this.passwordInput,
              this.$store.getters.privateRoomId
          )
          .then(data => {
            console.log(data)
            this.getAllUsers();
            this.generateLink();
          })
    },


    focusedList(index) {
      if (index === this.focusedIndex && this.isInputFocused === false) {
        return "focused";
      }
      return "";
    },
    selectAndMoveAlongEmails(e) {
      if (e.key === "ArrowDown") {
        if (this.focusedIndex < this.foundEmails.length - 1) {

          this.$refs.emails.scrollTo(0, this.scroll)
          this.focusedIndex++;
          this.scroll += 35
        }
      } else if (e.key === "ArrowUp") {
        if (this.focusedIndex >= 0) {
          this.focusedIndex--;
          this.scroll -= 35
          this.$refs.emails.scrollTo(0, this.scroll)
        }
      } else if (e.key === "Enter") {
        this.addToEmailList(this.foundEmails[this.focusedIndex]);
        this.$refs.input.focus();
      }
    },

    clickToBlurEmailContainer() {
      this.isClickedToEnterEmail = false;
      this.isInputFocused = false;
    },
    focusToSearchEmail() {
      this.isInputFocused = true;
    },
    clickToEnterEmail() {
      this.isClickedToEnterEmail = true;
      // this.emailSearchInput = ''
      nextTick(() => {
        this.$refs.input.focus();
      });
    },

    copyToClipboard() {

      this.$refs.meetingLink.select();
      this.$refs.meetingLink.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(
          this.invitationText + "\r\n" + this.meetingLink
      );
      nextTick(()=>{
        this.isLinkCopied = true;
      })

    },



    modifyUserOfPrivateRoom() {
      restClientPrivateRoom
          .modifyUserOfPrivateRoom(
              this.$store.getters.privateRoomId,
              this.meetingLink,
              this.inviteEmails
          )
          .then(() => {

            this.joinToSession()

            this.eventBus.emit("enterToConferenceFromModal");
          })
          .catch((err) => {
            console.log(err);
          });
    },
    generateLink() {
      restClientPrivateRoom
          .generateLink(this.$store.getters.privateRoomId)
          .then((response) => {
            this.meetingLink = response;
          })
          .catch((error) => {
            console.log(error);
          });
    },
    getAllUsers() {
      restClientUser
          .getAll()
          .then((users) => {
            this.allUsers = users;
          })
          .catch((err) => {
            console.log(err);
          });
    },

    closeInvitationModal() {
      this.$emit("close-invitation-modal");
    },
    inviteUsers() {
      this.$emit("close-invitation-component");
      this.modifyUserOfPrivateRoom();
    },
    closeBadge(user) {
      const idx = this.addedEmails.findIndex((el) => {
        return el.email === user.email;
      });
      if (idx !== -1) {
        this.addedEmails.splice(idx, 1);
      }
    },
    deleteAndMoveAlongEmail(e) {
      if (e.keyCode === 8) {
        if (this.emailSearchInput === "") {
          this.addedEmails.pop();
        }
      }
      if (e.key === "ArrowDown") {
        if (this.isInputFocused) {
          nextTick(() => {
            this.$refs.emails.focus();
          });
        }
      }

    },
    searchEmails() {
      if (this.emailSearchInput === "") {
        this.isEmailFound = false;
      }
      if (this.emailSearchInput !== "") {
        this.foundEmails = this.allUsers.filter((el) => {
          if (el.email.includes(this.emailSearchInput)) {
            return true;
          }
        });
        if (this.foundEmails.length > 0) {
          this.isEmailFound = true;
        } else {
          this.isEmailFound = false;
        }
      }
    },

    addToEmailList(person) {
      this.isEmailFound = false;
      let idx = this.addedEmails.findIndex((el) => {
        return el.email === person.email;
      });

      if (idx === -1) {
        this.addedEmails.push(person);
        this.inviteEmails.push(person.email);
        this.$refs.input.focus();
      }
      this.emailSearchInput = "";
    },
    showOtherEmails() {
      this.emailIsShown = !this.emailIsShown;
    },
    pressEnterToAddEmails() {
      if (
          this.emailSearchInput !== "" &&
          this.emailSearchInput.length > 7 &&
          this.emailSearchInput.search("@") &&
          (this.emailSearchInput.search(".com") ===
              this.emailSearchInput.length - 4 ||
              this.emailSearchInput.search(".ir") ===
              this.emailSearchInput.length - 3)
      ) {
        this.addedEmails.push({email: this.emailSearchInput});
        this.inviteEmails.push(this.emailSearchInput);
        this.emailSearchInput = "";
      }
    },
  },
};
</script>

<style scoped>
.search__email-container__text {
  color: lightgray;
  font-size: 1.2rem;
  position: absolute;
  top: 0;
  right: 1rem;
}
.search__email-container__text-ltr {
  color: #bbb8b8;
  font-size: 1.2rem;
  direction: ltr;
  position: absolute;
  top: 0;
  z-index: 1000;
  left: 1rem;
}

.header-container--private--invitation-rtl {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  width: 55.8rem;
  border-bottom: solid 0.1rem grey;
}
.header-container--private--invitation-ltr {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  width: 55.8rem;
  border-bottom: solid 0.1rem grey;
}

h2 {
  direction: rtl;
  font-size: 1.5rem;
}

.body-container--private {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 55.8rem;
  height: 53rem;
}

.top__section-body-container-rtl {
  display: flex;
  flex-direction: row;
  /*justify-content: space-between;*/
  width: 100%;
  height: 23rem;
}
.top__section-body-container-ltr {
  display: flex;
  flex-direction: row-reverse;
  /*justify-content: space-between;*/
  width: 100%;
  height: 23rem;
}

.email-text-container {
  width: 15%;
  height: 3rem;
  /*direction: rtl;*/
  font-size: 1.2rem;
}

.email__address-container {
  position: relative;
  width: 84%;
  height: 25rem;
  border: solid 0.1rem #707070;
  border-radius: 1rem;
  /*display: flex;*/
  /*flex-direction: column;*/
  padding: 0.5rem;
}

.emails-container {
  display: flex;
  flex-wrap: wrap;
  direction: ltr;
  width: 46rem;
}

.search__email-container {
  position: relative;
  height: 2.2rem;
  width: 25%;
}

.search__email-input {
  margin-top: 0.2rem;
  width: 100%;
  height: 80%;
  border: none;
  /*background-color: #f4f5f8;*/
  border-radius: 1rem;
  direction: ltr;
  padding-left: 0.3rem;
  margin-left: 0.5rem;
}

.search__email-input:focus {
  outline: none;
}

.search__email-input::placeholder {
  font-size: 0.9rem;
}

.bottom__section-body-container {
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 25rem;
}

.email__title-container {
  display: flex;
  flex-direction: column;
  height: 6rem;
  width: 55.8rem;
  justify-content: space-between;
}

.email__title-rtl {
  width: 100%;
  height: 1.5rem;
  font-size: 1.2rem;
  direction: rtl;
  margin-bottom: 1rem;

  align-items: center;
}
.email__title-ltr {
  width: 100%;
  height: 1.5rem;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  direction: ltr;
  align-items: center;
}

.email__title-input-container {
  width: 100%;
  height: 3.5rem;
}

.email__title-input-container input {
  width: 100%;
  height: 4rem;
  border: solid 0.1rem #cdcdcd;
  border-radius: 1rem;
  font-size: 1.2rem;
  padding-right: 1rem;
  background-color: #eaebee;
}

.copy__icon__text {
  color: #08aa3e;
  font-size: 1.2rem;
  width: 25rem;
  display: flex;
  align-items: center;
}

@keyframes copiedText {
  from {
    transform: translateY(-1rem);
    display: none;
  }
  to {
    transform: translateY(0);
    display: block;
  }
  0% {
    transform: translateY(-1.5rem);
    opacity: 0;
  }
  25% {
    transform: translateY(0);
    opacity: 100%;
  }
  50% {
    transform: translateY(0);
    opacity: 100%;
  }
  75% {
    transform: translateY(0);
    opacity: 100%;
  }
  100% {
    transform: translateY(-1.5rem);
    opacity: 0;
  }
}

.copy__icon__text span {
  animation-name: copiedText;
  animation-duration: 6s;
}

.email__title-input-container input:focus {
  outline: none;
  box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.26);
}

.invitation__text-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 9rem;
  width: 55.8rem;
  margin-top: 1.5rem;
}

.invitation__text {
  width: 100%;
  font-size: 1.2rem;
  height: 1.8rem;
  direction: rtl;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.invitation__text-rtl {
  width: 100%;
  font-size: 1.2rem;
  height: 1.8rem;
  direction: rtl;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.invitation__text-ltr {
  width: 100%;
  font-size: 1.2rem;
  height: 1.8rem;
  direction: ltr;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.invitation__text-container:last-child {
  width: 100%;
  height: 7rem;
}

.invitation__text-container textarea {
  width: 100%;
  height: 7rem;
  border: solid 0.1rem #cdcdcd;
  border-radius: 1rem;
  resize: none;
  padding-right: 1rem;
  margin-right: 0;
  margin-bottom: 1rem;
  background-color: #eaebee;
}

.invitation__text-container textarea:focus {
  outline: none;
  box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.26);
}

.meeting__link-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 7rem;
  width: 55.8rem;
  margin-top: 1rem;
}

.meeting__link-input-container {
  width: 55.8rem;
  height: 3.7rem;
  font-size: 1.2rem;
}

.copy__icon-container {
  width: 55.8rem;
  height: 3.6rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 1rem;
  justify-content: space-between;
}

.icon__copy {
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  background-color: #1a73e8;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 100;
}

.meeting__link-input-container input {
  width: 100%;
  height: 3rem;
  border-radius: 1rem;
  border: solid 0.1rem #cdcdcd;
  direction: ltr;
  padding-left: 1rem;
  background-color: #eaebee;
}

.meeting__link-input-container input:focus {
  outline: none;
  box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.26);
}

.badge-list__others {
  color: #1a73e8;
  border: solid 0.1rem #dadce0;
  border-radius: 1.1rem;
  height: 2rem;
  width: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  position: relative;
  cursor: pointer;
  margin-left: 1rem;
  direction: rtl;
}

.found__users {
  position: absolute;
  right: -5rem;
  top: 2rem;
  z-index: 100;
  width: 21rem;
  max-height: 13.5rem;
  border: solid 0.1rem lightgray;
  background-color: white;
  overflow-y: auto;
  border-radius: 1rem;
  direction: ltr;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.found__users:focus {
  outline: none;
}

.found__users-list {
  /*position: relative;*/
  font-size: 1.3rem;
  width: 100%;
  display: flex;
  align-items: center;
  direction: ltr;
  /*border-bottom: 0.1rem solid rgb(204, 198, 198);*/
  height: 3.5rem;
  padding-left: 0.6rem;
}

.found__users-list > p {
  display: flex;
  align-items: center;
  height: 3.5rem;
  max-width: 20rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.found__users-list:hover {
  background-color: rgb(214, 214, 220);
  cursor: pointer;
}

.participants__more {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 18rem;
  max-height: 10rem;
  border: solid 0.1rem lightgray;
  z-index: 100;
  background-color: white;
  /*overflow-y: auto;*/
  /*left: -3rem;*
     */
  top: 2rem;
  left: -4rem;
  direction: ltr;
  border-radius: 1rem;
}

.participant {
  position: relative;

  width: 100%;
  display: flex;
  align-items: center;
  height: 2rem;
  border-bottom: 0.1rem solid rgb(204, 198, 198);
  padding-left: 1.5rem;
  font-size: 1.1rem;
  padding-right: 0.6rem;
  direction: ltr;
}

.participant:hover {
  outline: none;
  border: none;
  background-color: #ece9e9;
}

.hidden-badge {
  transform: rotate(45deg);
  width: 1rem;
  height: 1rem;
  font-size: 1.2rem;
  left: 0.2rem;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;

  cursor: pointer;
  color: black;
  border-radius: 50%;
}

.hidden-badge:hover {
  background-color: #1a73e8;
  color: white;
}

.focused {
  background-color: #d9d8d8;
}


@media (min-width: 401px) and (max-width: 767px) {
  .header-container--private--invitation-rtl {
    height: 3rem;
    width: 85vw;
  }
  .header-container--private--invitation-ltr {
    height: 3rem;
    width: 85vw;
  }

  .body-container--private {
    height: 55rem;
    width: 85vw;
  }

  .email__address-container {
    width: 84%;
    height: 24rem;
  }

  .emails-container {
    width: 100%;
  }

  .email__title-container {
    height: 7rem;
    width: 85vw;
    margin-top: 2rem;
  }

  .email__title-input-container {
    height: 5rem;
  }

  .invitation__text-container {
    width: 85vw;
    height: 10rem;
    margin-bottom: 2rem;
  }

  .meeting__link-container {
    margin-top: 2rem;
    height: 7rem;
    width: 85vw;
  }

  .meeting__link-input-container {
    width: 85vw;
    height: 3rem;
    font-size: 1.2rem;
  }

  .invitation__text-container textarea {
    height: 5rem;
    padding-left: 1rem;
  }

  .invitation__text {
    width: 100%;
    font-size: 1.2rem;
    height: 1.8rem;
    direction: rtl;
    display: flex;
    align-items: center;
    margin-top: 2rem;
  }

  .email__title-input-container input {
    height: 2.5rem;
  }

  .found__users {
    right: -5rem;
    top: 2rem;
  }

  .button-container--guest {
    margin-top: 3rem;
  }

  .invitation__text-container {
    margin-bottom: 1rem;
    margin-top: -1rem;
  }

  .invitation__text {
    margin-bottom: 0.5rem;
  }

  .copy__icon-container {
    width: 85vw;
    height: 3.6rem;
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  .icon__copy {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: #1a73e8;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bottom__section-body-container {
    height: 30rem;
  }
  .invitation__text-container textarea{
    height: 10rem;
  }
}

@media (min-width: 320px) and (max-width: 400px) {
  .header-container--private--invitation-rtl {
    height: 3rem;
    width: 85vw;
  }
  .header-container--private--invitation-ltr {
    height: 3rem;
    width: 85vw;
  }
  .body-container--private {
    height: 50rem;
    width: 85vw;
  }

  .email__address-container {
    width: 84%;
    height: 18rem;
  }

  .emails-container {
    width: 100%;
  }

  .email__title-container {
    height: 5rem;
    width: 85vw;
    margin-top: 1rem;
  }

  .email__title-input-container {
    height: 3rem;
  }

  .invitation__text-container {
    width: 85vw;
    height: 8rem;
  }

  .meeting__link-container {
    margin-top: 1rem;
    height: 7rem;
    width: 85vw;
  }

  .meeting__link-input-container {
    width: 85vw;
    height: 3rem;
    font-size: 1.2rem;
  }

  .copy__icon-container {
    height: 2.8rem;
    width: 85vw;
  }

  .icon__copy {
    width: 2.5rem;
    height: 2.5rem;

  }

  .invitation__text-container {
    margin-bottom: 1rem;
    margin-top: 0;
  }

  .invitation__text-container textarea {
    height: 5rem;
    padding-left: 1rem;
  }

  .invitation__text {
    width: 100%;
    font-size: 1.2rem;
    height: 1.8rem;
    direction: rtl;
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }

  .email__title-input-container input {
    height: 2.5rem;
  }

  .found__users {
    right: -12rem;
    top: 2rem;
  }

  .button-container--guest {
    margin-top: 3rem;
  }

  .invitation__text {
    margin-bottom: 0.5rem;
  }

  .email__title {
    margin-bottom: 1rem;
  }
  .bottom__section-body-container {
    height: 36rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .invitation__text-container textarea{
    height: 10rem;
  }
  .meeting__link-input-container input{
    height: 3rem;
    font-size: 1.1rem;
  }
}
</style>












<!--<template>-->
<!--  <base-modal page="conference" is-blur="false" :open="isOpen">-->
<!--    <template #modal-header>-->
<!--      <div :class="$i18n.locale === 'fa'-->
<!--          ? 'header-container&#45;&#45;private&#45;&#45;invitation-rtl'-->
<!--          : 'header-container&#45;&#45;private&#45;&#45;invitation-ltr'-->
<!--        ">-->
<!--        <div>-->
<!--          <img draggable="false" src="/img/close.svg" alt="not loaded" @click="closeInvitationModal" style="cursor: pointer"/>-->
<!--        </div>-->
<!--        <div>-->
<!--          <h2 ref="h2">{{ $store.getters.t("create-private-room") }}</h2>-->
<!--        </div>-->
<!--      </div>-->
<!--    </template>-->
<!--    <template #modal-body>-->

<!--      <div class="input-container">-->

<!--        <base-input v-for="(detail, index) in inputDetails" :key="index" :ref="detail.id" :value="detail.value"-->
<!--                    :label="detail.label" :id="detail.id" :remove-input-values="removeInputValues"-->
<!--                    :showInputError="detail.inputErrorShow" @searchParticipants="searchParticipants"-->
<!--                    @disableDivs="disableDivs"-->
<!--                    @change-remove-input-values-to-false="removeInputValues = false"></base-input>-->

<!--        <span class="nameInputError" v-if="this.inputDetails[0].inputErrorShow">{{-->
<!--            $store.getters.t('wrong_username')-->
<!--          }} </span>-->
<!--        <div class="nameInputContainer" v-if="this.nameInput">-->
<!--          <ul class="nameInput-ul">-->
<!--            <li class="nameInput-li" v-for="user in addedParticipants" :key="user" @click="addParticipantToList(user)">-->
<!--              {{ user.firstName }} {{ user.lastName }}-->
<!--            </li>-->
<!--          </ul>-->
<!--        </div>-->

<!--        <span class="emailInputError"-->
<!--              v-if="this.inputDetails[1].inputErrorShow">{{ $store.getters.t('invalid_email_format') }} </span>-->
<!--        <div class="emailInputContainer" v-if="this.emailInput">-->
<!--          <ul class="emailInput-ul">-->
<!--            <li class="emailInput-li" v-for="user in addedParticipants" :key="user" @click="addParticipantToList(user)">-->
<!--              {{ user.email }}-->
<!--            </li>-->
<!--          </ul>-->
<!--        </div>-->

<!--        <span class="phoneInputError" v-if="this.inputDetails[2].inputErrorShow">{{-->
<!--            $store.getters.t('phoneNumberError')-->
<!--          }} </span>-->
<!--        <div class="phoneInputContainer" v-if="this.phoneInput">-->
<!--          <ul class="phoneInput-ul">-->
<!--            <li class="phoneInput-li" v-for="user in addedParticipants" :key="user" @click="addParticipantToList(user)">-->
<!--              {{ user.phoneNumber }}-->
<!--            </li>-->
<!--          </ul>-->
<!--        </div>-->


<!--        <div class="tooltip-container">-->
<!--          <div class="tooltip">-->
<!--            <span class="tooltiptext">{{ $store.getters.t('add-new-user') }}</span>-->
<!--          </div>-->
<!--          <div class="circle">-->
<!--            <add-plus color="white" width="25" height="25" @click="addGuestParticipant"></add-plus>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="participants-table">-->
<!--        <span class="user-not-added" v-if="allUsersInvited.length === 0"> {{-->
<!--            $store.getters.t('user-has-not-been-added')-->
<!--          }} </span>-->
<!--        <ul class="participants-table__ul">-->
<!--          <li class="participants-table__li" v-for="user in allUsersInvited" :key="user.email">-->
<!--            <div><span> {{ user.nickName }} </span></div>-->
<!--            <div><span> {{ user.email }} </span></div>-->
<!--            <div><span> {{ user.mobile }} </span></div>-->
<!--            <div><span> <img draggable="false" src="/img/close.svg" alt="not-loaded" @click="deleteParticipant(user)"> </span></div>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->

<!--      <div class="inviteText__container">-->
<!--        <span :style="{ display: 'flex' , flexDirection: $i18n.locale !== 'en' ? 'unset' : 'row-reverse' }"> {{-->
<!--            $store.getters.t('the-text-of-the-invitation-to-the-meeting')-->
<!--          }}  </span>-->
<!--        <textarea v-model="inviteText" :style="{ direction: $i18n.locale !== 'en' ? 'unset' : 'ltr' }"/>-->
<!--      </div>-->

<!--      <div class="choose_which_invite">-->
<!--        <label class="label"> لطفا نوع دعوت کاربران را مشخص کنید : </label>-->
<!--        <div class="question-mark-container">-->
<!--          <div class="button-container&#45;&#45;choose_invite">-->
<!--            <base-button :is-active="true"-->
<!--                         :continuous-params="['color=white', 'background-color=#1B76FF' , 'width=25rem']"-->
<!--                         :style-types="['button&#45;&#45;curved', 'button&#45;&#45;big']"-->
<!--                         :button-inner-txt="$store.getters.t('safe-invitation-with-exclusive-link')"-->
<!--                         @btn-clicked="invitePrivate" class="private-invite-btn"-->
<!--                         :style="{padding: $i18n.locale !== 'en' ? '1.5rem' : 'unset'}"></base-button>-->
<!--            <base-button :is-active="true"-->
<!--                         :continuous-params="['color=white', 'background-color=#1B76FF' , 'width=25rem']"-->
<!--                         :style-types="['button&#45;&#45;curved', 'button&#45;&#45;big']"-->
<!--                         :button-inner-txt="$store.getters.t('invitation-with-public-link')"-->
<!--                         @btn-clicked="invitePublic" class="public-invite-btn"></base-button>-->
<!--          </div>-->


<!--          <div class="tooltip-container-question-mark">-->
<!--            <div class="tooltip-question-mark">-->
<!--              <span class="tooltiptext-question-mark">-->
<!--                <div  style="margin-bottom: 0.3rem"> دعوت امن با لینک اختصاصی : </div>-->
<!--                <span>-->
<!--                  لینک اختصاصی برای هر شخص حاوی اطلاعات فردی مختص به همان شخص به صورت امن ارسال میشود-->
<!--                </span>-->
<!--                <div  style="margin-bottom: 0.3rem ; margin-top: 1rem"> دعوت با لینک عمومی : </div>-->
<!--                <span>-->
<!--                  برای تمام اشخاص دعوت شده به جلسه یک لینک یکسان به صورت عمومی ارسال میشود-->
<!--                </span>-->
<!--              </span>-->
<!--            </div>-->
<!--            <div class="question-mark">-->
<!--              <img draggable="false" src="../assets/question-mark.svg" alt="not-loaded">-->
<!--            </div>-->
<!--          </div>-->

<!--        </div>-->
<!--      </div>-->

<!--      <div class="inviteLink__container" v-show="publicInvite">-->
<!--        <span>{{ $store.getters.t('meeting-link') }} :</span>-->
<!--        <div class="link-button__container">-->
<!--          <input v-model.trim="meetingLink" disabled ref="meetingLink" class="invite-link-input">-->

<!--          <div style="width: fit-content;height: fit-content" @click="copyToClipboard">-->
<!--            <base-button-->
<!--                :button-inner-txt="$store.getters.t('copy-link')"-->
<!--                :continuous-params="['color=#F6F6F7', 'background-color=#1B76FF','width=10rem','height=3rem',-->
<!--          'font-size=1.2rem', 'font-weight= 700',-->
<!--          'border-radius=0.6rem']"-->
<!--                :is-active="true"-->
<!--            >-->
<!--              <template #post-button-slot>-->
<!--                <img draggable="false" v-show="!isLinkCopied" src="/img/copy-icon.svg" style="width: 16px; height: 16px"-->
<!--                     alt="not loaded"-->
<!--                     class="fade-image">-->
<!--                <svg class="fade-image" style="width: 16px;height: 16px" v-show="isLinkCopied" width="24" height="24"-->
<!--                     viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                  <path-->
<!--                      d="M18.7104 7.2101C18.6175 7.11638 18.5069 7.04198 18.385 6.99121C18.2632 6.94044 18.1324 6.91431 18.0004 6.91431C17.8684 6.91431 17.7377 6.94044 17.6159 6.99121C17.494 7.04198 17.3834 7.11638 17.2904 7.2101L9.84044 14.6701L6.71044 11.5301C6.61392 11.4369 6.49998 11.3636 6.37512 11.3143C6.25026 11.2651 6.11694 11.241 5.98276 11.2433C5.84858 11.2457 5.71617 11.2744 5.59309 11.3279C5.47001 11.3814 5.35868 11.4586 5.26544 11.5551C5.1722 11.6516 5.09889 11.7656 5.04968 11.8904C5.00048 12.0153 4.97635 12.1486 4.97867 12.2828C4.98099 12.417 5.00972 12.5494 5.06321 12.6725C5.1167 12.7955 5.19392 12.9069 5.29044 13.0001L9.13044 16.8401C9.2234 16.9338 9.334 17.0082 9.45586 17.059C9.57772 17.1098 9.70843 17.1359 9.84044 17.1359C9.97245 17.1359 10.1032 17.1098 10.225 17.059C10.3469 17.0082 10.4575 16.9338 10.5504 16.8401L18.7104 8.68011C18.8119 8.58646 18.893 8.47281 18.9484 8.34631C19.0038 8.21981 19.0324 8.08321 19.0324 7.94511C19.0324 7.807 19.0038 7.6704 18.9484 7.5439C18.893 7.4174 18.8119 7.30375 18.7104 7.2101Z"-->
<!--                      fill="white"/>-->
<!--                </svg>-->

<!--              </template>-->
<!--            </base-button>-->
<!--          </div>-->


<!--        </div>-->
<!--      </div>-->






<!--    </template>-->

<!--    <template #modal-buttons>-->
<!--      <div class="button-container&#45;&#45;private">-->
<!--        <base-button :is-active="true" :continuous-params="['color=white', 'background-color=#1B76FF']"-->
<!--                     :style-types="['button&#45;&#45;curved', 'button&#45;&#45;big']"-->
<!--                     :button-inner-txt="$store.getters.t('enter-meeting')"-->
<!--                     @btn-clicked="inviteToPrivateRoom" class="invite-btn"-->
<!--                     :style="{padding: $i18n.locale !== 'en' ? '1.5rem' : 'unset'}"></base-button>-->
<!--        <base-button :is-active="true" :continuous-params="['color=#1B76FF', 'background-color=#F2F2F2']"-->
<!--                     :style-types="['button&#45;&#45;curved', 'button&#45;&#45;big']" :button-inner-txt="$store.getters.t('withdrawal')"-->
<!--                     @btn-clicked="closeInvitationModal" class="withdrawal-btn"></base-button>-->
<!--      </div>-->
<!--    </template>-->
<!--  </base-modal>-->
<!--</template>-->

<!--<script>-->
<!--import BaseModal from "./UI/BaseModal";-->
<!--import BaseButton from "./UI/BaseButton";-->
<!--// import BaseBadge from "./BaseBadge";-->
<!--import RestClient from "../api/restClient";-->
<!--import {nextTick} from "vue";-->
<!--import DetectMobile from "../utils/detectMobile";-->
<!--import BaseInput from "@/components/UI/BaseInput.vue";-->
<!--import {details} from "caniuse-lite/data/features";-->
<!--import AddPlus from "@/components/UI/Icons/AddPlus.vue";-->
<!--// import userStatus from "@/statics/types/userStatus";-->
<!--// import auth from "@/store/auth";-->
<!--import entityTypes from "@/statics/entityTypes";-->

<!--const restClientUser = new RestClient("user");-->
<!--const restClientPrivateRoom = new RestClient("privateRoom");-->
<!--// const restClient = new RestClient("controlMeeting");-->
<!--const restClientInvite = new RestClient('invite')-->
<!--export default {-->
<!--  components: {AddPlus, BaseInput, BaseModal, BaseButton,},-->
<!--  props: ["privateInvitationIsOpen", "privateMeetingName", "isOpen"],-->
<!--  data() {-->
<!--    return {-->
<!--      passwordInput: "12345678",-->
<!--      amIModeratorPrivate: false,-->
<!--      scroll: -35,-->
<!--      focusedIndex: 0,-->
<!--      isInputFocused: false,-->
<!--      isClickedToEnterEmail: false,-->
<!--      isLinkCopied: false,-->
<!--      emailIsShown: false,-->
<!--      allUsers: [],-->
<!--      userIds: [],-->
<!--      foundEmails: [],-->
<!--      inviteEmails: [],-->
<!--      isEmailFound: false,-->
<!--      emailSearchInput: "",-->
<!--      meetingLink: "لینک جلسه اینجا قرار میگیرد",-->
<!--      addedEmails: [],-->
<!--      isMobile: false,-->
<!--      inputValue: '',-->
<!--      inputDetails: [-->
<!--        {-->
<!--          label: this.$store.getters.t('full-name') + ' :',-->
<!--          id: 'name',-->
<!--          value: '',-->
<!--          isValid: true,-->
<!--          inputErrorShow: false,-->
<!--        },-->
<!--        {label: this.$store.getters.t('Email') + ' :', id: 'email', value: '', isValid: true, inputErrorShow: false,},-->
<!--        {-->
<!--          label: this.$store.getters.t('phone-number') + ' :',-->
<!--          id: 'phone',-->
<!--          value: '',-->
<!--          isValid: true,-->
<!--          inputErrorShow: false-->
<!--        },-->
<!--      ],-->
<!--      // userListTitle: ['نام و نام خانوادگی', 'ایمیل', 'تلفن', 'حذف'],-->
<!--      addedParticipants: [],-->
<!--      nameInput: false,-->
<!--      emailInput: false,-->
<!--      phoneInput: false,-->
<!--      allUsersInvited: [],-->
<!--      guestUsersInvited: [],-->
<!--      organizationalUsersInvited: [],-->
<!--      removeInputValues: false,-->
<!--      invitedUsersForDelete: [],-->
<!--      guestNewUsersInvited: [],-->
<!--      inviteText: '',-->
<!--      publicInvite: false,-->
<!--      restClientAuth: new RestClient(entityTypes.auth),-->
<!--      // emails:['babak.baniahmadi@gmail.com','babak.baniahmadi@gmail.com','babak.baniahmadi@gmail.com','babak.baniahmadi@gmail.com','babak.baniahmadi@gmail.com','babak.baniahmadi@gmail.com','babak.baniahmadi@gmail.com','babak.baniahmadi@gmail.com',-->
<!--      //   'babak.baniahmadi@gmail.com','babak.baniahmadi@gmail.com','babak.baniahmadi@gmail.com']-->
<!--    };-->
<!--  },-->
<!--  watch: {-->
<!--    isOpen: function (newVal) {-->
<!--      if (newVal) {-->
<!--        // Do something when the modal is opened-->
<!--        this.generateLink()-->
<!--      }-->
<!--    },-->
<!--    isLinkCopied(val) {-->
<!--      if (val === true) {-->
<!--        setTimeout(() => {-->
<!--          this.isLinkCopied = false;-->
<!--        }, 6000);-->
<!--      }-->
<!--    },-->
<!--    meetingLink(val) {-->
<!--      this.meetingLink = val;-->
<!--    },-->
<!--  },-->

<!--  computed: {-->
<!--    details() {-->
<!--      return details-->
<!--    },-->
<!--    emailTitle() {-->
<!--      return this.$store.getters.t("invite-to-virtual-meeting");-->
<!--    },-->
<!--    menOrWomen() {-->
<!--      if (this.$store.getters.gender === 'M') {-->
<!--        return this.$store.getters.t("you-invited-to-men")-->
<!--      } else {-->
<!--        return this.$store.getters.t("you-invited-to-women")-->
<!--      }-->
<!--    },-->
<!--    invitationText() {-->

<!--      return (-->
<!--          this.$store.getters.t("Greetings-and-Regards") +-->
<!--          "\r\n" +-->

<!--          this.menOrWomen +-->
<!--          this.$store.getters.displayName +-->
<!--          " " +-->
<!--          this.$store.getters.t("join-with-link")-->
<!--      );-->
<!--    },-->

<!--    numberOfAddedEmail() {-->
<!--      return this.addedEmails.filter((el, idx) => {-->
<!--        if (this.isMobile === true) {-->
<!--          return idx < 5;-->
<!--        } else {-->
<!--          return idx < 19;-->
<!--        }-->
<!--      });-->
<!--    },-->
<!--    numberOfOtherEmails() {-->
<!--      if (this.isMobile === true) {-->
<!--        return this.addedEmails.length - 5;-->
<!--      } else {-->
<!--        return this.addedEmails.length - 19;-->
<!--      }-->
<!--    },-->
<!--    otherEmails() {-->
<!--      return this.addedEmails.filter((el, idx) => {-->
<!--        if (this.isMobile === true) {-->
<!--          return idx > 4;-->
<!--        } else {-->
<!--          return idx > 18;-->
<!--        }-->
<!--      });-->
<!--    },-->
<!--  },-->
<!--  created() {-->
<!--    const mobileDetector = new DetectMobile();-->
<!--    this.isMobile = mobileDetector.isMobile();-->
<!--  },-->
<!--  mounted() {-->
<!--    this.generateLink()-->
<!--    this.getAllUsers()-->
<!--    this.getAllPrivateInvited()-->
<!--    this.inviteText = this.invitationText-->

<!--  },-->
<!--  methods: {-->
<!--    joinToSession() {-->

<!--      // restClient-->
<!--      //     .iWantToJoinPrivate(this.$store.getters.privateRoomId)-->
<!--      //     .then(async (response) =>{-->
<!--      //       if (!response) {-->
<!--      //         return;-->
<!--      //       }-->
<!--      //       this.restClientAuth.getJitsiMeetingToken({-->
<!--      //         name: '',-->
<!--      //         avatar: '',-->
<!--      //         email: '',-->
<!--      //         affiliation: 'owner',-->
<!--      //         roomName: this.privateMeetingName,-->
<!--      //         meetingId: this.$store.getters.privateRoomId + ''-->
<!--      //-->
<!--      //       })-->
<!--      //           .then((token) => {-->
<!--      //             this.$emit('join-to-conference')-->
<!--      //             this.$store.dispatch('setvrURL', 'https://mediair2.ancerz.com/')-->
<!--      //             this.$store.dispatch("setPublishCount", response?.publishCount ? response.publishCount : 16);-->
<!--      //             ////////////////////////////////////////////////////////////////////////////////////-->
<!--      //             this.$store.dispatch("setHasModerator", true);-->
<!--      //             this.$store.dispatch(-->
<!--      //                 "setRoomIdPublicRoom",-->
<!--      //                 this.$store.getters.privateRoomId-->
<!--      //             );-->
<!--      //-->
<!--      //             this.$store.dispatch("setSessionToken", response.token);-->
<!--      //             // this.amIModerator = true;-->
<!--      //             // this.amIModeratorSubstitute = false;-->
<!--      //             this.$store.dispatch("setModeratorId", +this.$store.getters.userId);-->
<!--      //             this.$store.dispatch("setAmIModerator", true);-->
<!--      //             this.$store.dispatch("setAmIModeratorSubstitute", false);-->
<!--      //             this.$store.dispatch("setSessionName", "اتاق شخصی");-->
<!--      //             this.$store.dispatch("setRoomId", this.$store.getters.privateRoomId);-->
<!--      //             this.$store.dispatch(-->
<!--      //                 "setScheduleId",-->
<!--      //                 this.$store.getters.privateRoomId-->
<!--      //             );-->
<!--      //             ////////////////////////////////////////////////////////////////////////////////////-->
<!--      //-->
<!--      //             this.amIModeratorPrivate =-->
<!--      //                 parseInt(this.$store.getters.userId) ===-->
<!--      //                 parseInt(this.$store.getters.privateRoomOwnerUserId);-->
<!--      //             this.$store.dispatch("setIsPrivateRoom", true);-->
<!--      //             this.$store.dispatch(-->
<!--      //                 "setSessionId",-->
<!--      //                 this.$store.getters.privateRoomId-->
<!--      //             );-->
<!--      //             // await this.createPrivateRoomMeeting()-->
<!--      //             // this.$store.dispatch("setShareSessionToen", response.data.shareToken);-->
<!--      //             // this.$store.dispatch("setUserStatus", userStatus.inConference);-->
<!--      //             // this.$store.dispatch("setIsPrivateUser", userStatus.isPrivateUser);-->
<!--      //             auth.setJitsiToken(token)-->
<!--      //             this.$store.dispatch("setJitsiToken", token);-->
<!--      //             this.$router.push({-->
<!--      //               name: "Conference",-->
<!--      //               path: "/conference",-->
<!--      //               params: {-->
<!--      //                 isPublicUser: true,-->
<!--      //                 myUserName: this.$store.getters.displayName,-->
<!--      //               },-->
<!--      //             });-->
<!--      //           }).catch((error) => {-->
<!--      //         console.error(error)-->
<!--      //         console.error(error)-->
<!--      //       })-->
<!--      //-->
<!--      //     })-->
<!--      //     .catch((error) => {-->
<!--      //       throw error;-->
<!--      //     });-->
<!--    },-->

<!--    focusedList(index) {-->
<!--      if (index === this.focusedIndex && this.isInputFocused === false) {-->
<!--        return "focused";-->
<!--      }-->
<!--      return "";-->
<!--    },-->
<!--    selectAndMoveAlongEmails(e) {-->
<!--      if (e.key === "ArrowDown") {-->
<!--        if (this.focusedIndex < this.foundEmails.length - 1) {-->
<!--          this.$refs.emails.scrollTo(0, this.scroll);-->
<!--          this.focusedIndex++;-->
<!--          this.scroll += 35;-->
<!--        }-->
<!--      } else if (e.key === "ArrowUp") {-->
<!--        // if(this.focusedIndex === 0){-->
<!--        //   this.$refs.emails.blur();-->
<!--        //   this.$refs.input.focus()-->
<!--        // }-->
<!--        if (this.focusedIndex >= 0) {-->
<!--          this.focusedIndex&#45;&#45;;-->
<!--          this.scroll -= 35;-->
<!--          this.$refs.emails.scrollTo(0, this.scroll);-->
<!--        }-->
<!--      } else if (e.key === "Enter") {-->
<!--        this.addToEmailList(this.foundEmails[this.focusedIndex]);-->
<!--        this.$refs.input.focus();-->
<!--      }-->
<!--    },-->

<!--    clickToBlurEmailContainer() {-->
<!--      this.isClickedToEnterEmail = false;-->
<!--      this.isInputFocused = false;-->
<!--    },-->
<!--    focusToSearchEmail() {-->
<!--      this.isInputFocused = true;-->
<!--    },-->
<!--    clickToEnterEmail() {-->
<!--      this.isClickedToEnterEmail = true;-->
<!--      // this.emailSearchInput = ''-->
<!--      nextTick(() => {-->
<!--        this.$refs.input.focus();-->
<!--      });-->
<!--    },-->

<!--    copyToClipboard() {-->
<!--      this.$refs.meetingLink.select();-->
<!--      this.$refs.meetingLink.setSelectionRange(0, 99999);-->
<!--      navigator.clipboard.writeText(-->
<!--          this.invitationText + "\r\n" + this.meetingLink-->
<!--      );-->
<!--      nextTick(() => {-->
<!--        this.isLinkCopied = true;-->
<!--      });-->
<!--    },-->

<!--    modifyUserOfPrivateRoom() {-->
<!--      restClientPrivateRoom-->
<!--          .modifyUserOfPrivateRoom(-->
<!--              this.$store.getters.privateRoomId,-->
<!--              this.meetingLink,-->
<!--              this.inviteEmails-->
<!--          )-->
<!--          .then(() => {-->
<!--            this.joinToSession();-->

<!--            // this.eventBus.emit("enterToConferenceFromModal");-->
<!--          })-->
<!--          .catch((err) => {-->
<!--            console.log(err);-->
<!--          });-->
<!--    },-->
<!--    generateLink() {-->
<!--      restClientPrivateRoom-->
<!--          .generateLink(this.$store.getters.privateRoomId)-->
<!--          .then((response) => {-->
<!--            this.meetingLink = response;-->
<!--          })-->
<!--          .catch((error) => {-->
<!--            console.log(error);-->
<!--          });-->
<!--    },-->

<!--    closeInvitationModal() {-->
<!--      this.$emit('close-invitation-component')-->
<!--    },-->
<!--    // inviteUsers() {-->
<!--    //   this.$emit("close-invitation-component");-->
<!--    //   this.modifyUserOfPrivateRoom();-->
<!--    // },-->
<!--    inviteUsers() {-->
<!--      if (this.$store.getters.isPrivateUser !== 'isPrivateUser') {-->
<!--        this.modifyNewInvitedUsers();-->
<!--      }-->

<!--      this.$emit('close-invitation-component')-->
<!--      this.eventBus.emit('invited-users', this.listOfAllUsers)-->
<!--    },-->
<!--    modifyNewInvitedUsers() {-->
<!--      const userIds = this.organizationalUsersInvited.map((user) => {-->
<!--        return user.id-->
<!--      })-->
<!--      restClientInvite.modifyUserOfPublicRoom(this.$store.getters.roomId, [], userIds).then(() => {-->
<!--      }).catch(err => {-->
<!--        console.log(err)-->
<!--      })-->
<!--    },-->
<!--    closeBadge(user) {-->
<!--      const idx = this.addedEmails.findIndex((el) => {-->
<!--        return el.email === user.email;-->
<!--      });-->
<!--      if (idx !== -1) {-->
<!--        this.addedEmails.splice(idx, 1);-->
<!--      }-->
<!--    },-->
<!--    deleteAndMoveAlongEmail(e) {-->
<!--      if (e.keyCode === 8) {-->
<!--        if (this.emailSearchInput === "") {-->
<!--          this.addedEmails.pop();-->
<!--        }-->
<!--      }-->
<!--      if (e.key === "ArrowDown") {-->
<!--        if (this.isInputFocused) {-->
<!--          nextTick(() => {-->
<!--            this.$refs.emails.focus();-->
<!--          });-->
<!--        }-->
<!--      }-->
<!--    },-->
<!--    searchEmails() {-->
<!--      if (this.emailSearchInput === "") {-->
<!--        this.isEmailFound = false;-->
<!--      }-->
<!--      if (this.emailSearchInput !== "") {-->
<!--        this.foundEmails = this.allUsers.filter((el) => {-->
<!--          if (el.email.includes(this.emailSearchInput)) {-->
<!--            return true;-->
<!--          }-->
<!--        });-->
<!--        if (this.foundEmails.length > 0) {-->
<!--          this.isEmailFound = true;-->
<!--        } else {-->
<!--          this.isEmailFound = false;-->
<!--        }-->
<!--      }-->
<!--    },-->

<!--    addToEmailList(person) {-->
<!--      this.isEmailFound = false;-->
<!--      let idx = this.addedEmails.findIndex((el) => {-->
<!--        return el.email === person.email;-->
<!--      });-->

<!--      if (idx === -1) {-->
<!--        this.addedEmails.push(person);-->
<!--        this.inviteEmails.push(person.email);-->
<!--        this.$refs.input.focus();-->
<!--      }-->
<!--      this.emailSearchInput = "";-->
<!--    },-->
<!--    showOtherEmails() {-->
<!--      this.emailIsShown = !this.emailIsShown;-->
<!--    },-->
<!--    pressEnterToAddEmails() {-->
<!--      if (-->
<!--          this.emailSearchInput !== "" &&-->
<!--          this.emailSearchInput.length > 7 &&-->
<!--          this.emailSearchInput.search("@") &&-->
<!--          (this.emailSearchInput.search(".com") ===-->
<!--              this.emailSearchInput.length - 4 ||-->
<!--              this.emailSearchInput.search(".ir") ===-->
<!--              this.emailSearchInput.length - 3)-->
<!--      ) {-->
<!--        this.addedEmails.push({email: this.emailSearchInput});-->
<!--        this.inviteEmails.push(this.emailSearchInput);-->
<!--        this.emailSearchInput = "";-->
<!--      }-->
<!--    },-->
<!--    getAllUsers() {-->
<!--      this.allUsers = [];-->
<!--      restClientUser-->
<!--          .getAll()-->
<!--          .then((users) => {-->
<!--            this.allUsers = users;-->
<!--          })-->
<!--          .catch((err) => {-->
<!--            console.log(err);-->
<!--          });-->
<!--    },-->
<!--    searchParticipants(name, value) {-->

<!--      let input = this.inputDetails.find(input => input.id === name)-->
<!--      input.value = value-->

<!--      if (name === 'name') {-->

<!--        this.nameInput = true-->
<!--        this.emailInput = false-->
<!--        this.phoneInput = false-->

<!--        this.inputDetails[0].inputErrorShow = false-->
<!--        let finalInputValue = ''-->
<!--        let inputVal = value-->
<!--        console.error(inputVal)-->
<!--        inputVal.split('').forEach((el) => {-->
<!--          if (el === 'ي') {-->
<!--            finalInputValue = finalInputValue + 'ی'-->
<!--          } else if (el === 'ة') {-->
<!--            finalInputValue = finalInputValue + 'ه'-->
<!--          } else if (el === 'ۀ') {-->
<!--            finalInputValue = finalInputValue + 'ه'-->
<!--          } else if (el === 'ك') {-->
<!--            finalInputValue = finalInputValue + 'ک'-->
<!--          } else {-->
<!--            finalInputValue = finalInputValue + el-->

<!--          }-->
<!--        })-->
<!--        this.addedParticipants = this.allUsers.filter((user) => {-->
<!--          if (((user.firstName + ' ' + user.lastName).includes(finalInputValue) || user.username.includes(finalInputValue)) && finalInputValue.length !== 0) {-->
<!--            return true-->
<!--          }-->
<!--        })-->
<!--        // let addedParticipantTwo = this.allUsers.filter((user) => {-->
<!--        //   if (((user.firstName + ' ' + user.lastName).includes(inputVal) || user.username.includes(inputVal)) && inputVal.length !== 0) {-->
<!--        //     return true-->
<!--        //   }-->
<!--        // })-->
<!--        // this.addedParticipants = [...addedParticipantOne, ...addedParticipantTwo]-->
<!--        if ((inputVal === '') || (this.addedParticipants.length === 0)) {-->
<!--          this.nameInput = false-->
<!--        }-->


<!--        //   check Validation-->
<!--        input.isValid = this.validateName(value)-->

<!--      } else if (name === 'email') {-->

<!--        this.nameInput = false-->
<!--        this.emailInput = true-->
<!--        this.phoneInput = false-->

<!--        this.inputDetails[1].inputErrorShow = false-->

<!--        let inputVal = value-->
<!--        this.addedParticipants = this.allUsers.filter((user) => {-->
<!--          if ((user.email).includes(inputVal) && inputVal.length !== 0) {-->
<!--            return true-->
<!--          }-->
<!--        })-->
<!--        if (inputVal === '' || (this.addedParticipants.length === 0) || (this.inputDetails[0].value !== '' || this.inputDetails[2].value !== '')) {-->
<!--          this.emailInput = false-->
<!--        }-->

<!--        //   check Validation-->

<!--        input.isValid = this.validateEmail(value)-->

<!--      } else if (name === 'phone') {-->

<!--        this.nameInput = false-->
<!--        this.emailInput = false-->
<!--        this.phoneInput = true-->

<!--        this.inputDetails[2].inputErrorShow = false-->

<!--        let inputVal = value-->
<!--        this.addedParticipants = this.allUsers.filter((user) => {-->
<!--          if ((user.phoneNumber).includes(inputVal) && inputVal.length !== 0) {-->
<!--            return true-->
<!--          }-->
<!--        })-->
<!--        if (inputVal === '' || (this.addedParticipants.length === 0) || (this.inputDetails[0].value !== '' || this.inputDetails[1].value !== '')) {-->
<!--          this.phoneInput = false-->
<!--        }-->

<!--        //   check Validation-->
<!--        input.isValid = this.validatePhoneNumber(value)-->

<!--      }-->


<!--    },-->
<!--    addParticipantToList(user) {-->

<!--      this.nameInput = false-->
<!--      this.emailInput = false-->
<!--      this.phoneInput = false-->

<!--      this.addedParticipants = []-->
<!--      this.inputDetails[0].value = ''-->
<!--      this.inputDetails[1].value = ''-->
<!--      this.inputDetails[2].value = ''-->

<!--      this.removeInputValues = true-->


<!--      let personIdx = this.allUsersInvited.findIndex(person => {-->
<!--        return person.nickName === (user.firstName + ' ' + user.lastName)-->
<!--      })-->

<!--      if (personIdx === -1) {-->
<!--        this.allUsersInvited.push({...user, nickName: user.firstName + ' ' + user.lastName, mobile: user.phoneNumber})-->
<!--        this.organizationalUsersInvited.push({-->
<!--          ...user,-->
<!--          nickName: user.firstName + ' ' + user.lastName,-->
<!--          mobile: user.phoneNumber-->
<!--        })-->
<!--      }-->

<!--    },-->

<!--    deleteParticipant(user) {-->
<!--      const deletedIdx = this.invitedUsersForDelete.findIndex((person) => {-->
<!--        return +person.id === +user.id-->
<!--      })-->

<!--      if (deletedIdx !== -1 && user.isGuest === false) {-->
<!--        restClientPrivateRoom.deleteOrganization(user.id).then(() => {-->
<!--        }).catch((error) => {-->
<!--          console.error(error)-->
<!--        })-->
<!--      } else if (deletedIdx !== -1) {-->
<!--        restClientPrivateRoom.deleteGuest(user.id).then(() => {-->
<!--        }).catch((error) => {-->
<!--          console.error(error)-->
<!--        })-->
<!--      }-->

<!--      this.allUsersInvited = this.allUsersInvited.filter(person => {-->
<!--        return person.id !== user.id-->
<!--      })-->
<!--      this.organizationalUsersInvited = this.organizationalUsersInvited.filter(person => {-->
<!--        return person.id !== user.id-->
<!--      })-->
<!--      this.guestUsersInvited = this.guestUsersInvited.filter(person => {-->
<!--        return person.id !== user.id-->
<!--      })-->


<!--    },-->
<!--    addGuestParticipant() {-->

<!--      this.inputDetails[0].inputErrorShow = false-->
<!--      this.inputDetails[1].inputErrorShow = false-->
<!--      this.inputDetails[2].inputErrorShow = false-->

<!--      let name = this.inputDetails[0].value-->
<!--      let emaill = this.inputDetails[1].value-->
<!--      let phone-->
<!--      if (this.inputDetails[2].value.length === 11) {-->
<!--        phone = this.inputDetails[2].value.slice(1)-->
<!--      } else {-->
<!--        phone = this.inputDetails[2].value-->
<!--      }-->
<!--      let nameIsValid = this.inputDetails[0].isValid-->
<!--      let emailIsValid = this.inputDetails[1].isValid-->
<!--      let phoneIsValid = this.inputDetails[2].isValid-->


<!--      const timestamp = Date.now().toString();-->
<!--      const randomNumber = Math.floor(Math.random() * 1000).toString();-->

<!--      // this.removeInputValues = true-->

<!--      if ((nameIsValid && name !== '') && ((emailIsValid && emaill !== '') || (emaill === '' && phoneIsValid && phone !== '')) && ((phoneIsValid && phone !== '') || (phone === '' && emailIsValid && emaill !== ''))) {-->

<!--        let personNameIdx = this.guestUsersInvited.findIndex(user => {-->
<!--          return (user.nickName) === name-->
<!--        })-->
<!--        let personEmailIdx = this.allUsersInvited.findIndex(user => {-->
<!--          return (user.email) === emaill-->
<!--        })-->
<!--        let personPhoneIdx = this.allUsersInvited.findIndex(user => {-->
<!--          return (user.mobile) === phone-->
<!--        })-->

<!--        if ((personNameIdx !== -1 && personEmailIdx !== -1 && personPhoneIdx !== -1) || (personNameIdx === -1 && personEmailIdx !== -1 && personPhoneIdx !== -1)) {-->
<!--          return-->
<!--        } else {-->
<!--          let guestObject = {nickName: name, email: '', mobile: '', id: timestamp + randomNumber}-->
<!--          if (emailIsValid && emaill !== '') {-->
<!--            guestObject.email = emaill-->
<!--          } else {-->
<!--            guestObject.email = ''-->
<!--          }-->
<!--          if (phoneIsValid && phone !== '') {-->
<!--            guestObject.mobile = phone-->
<!--          } else {-->
<!--            guestObject.mobile = ''-->
<!--          }-->
<!--          this.allUsersInvited.push(guestObject)-->
<!--          this.guestUsersInvited.push(guestObject)-->
<!--          this.guestNewUsersInvited.push(guestObject)-->

<!--          this.removeInputValues = true-->
<!--        }-->

<!--      } else {-->

<!--        if (!nameIsValid || name === '') {-->
<!--          this.inputDetails[0].inputErrorShow = true-->
<!--        }-->
<!--        if (!emailIsValid || emaill === '') {-->
<!--          this.inputDetails[1].inputErrorShow = true-->
<!--        }-->
<!--        if (!phoneIsValid || phone === '') {-->
<!--          this.inputDetails[2].inputErrorShow = true-->
<!--        }-->
<!--      }-->

<!--    },-->

<!--    validateEmail(email) {-->
<!--      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;-->
<!--      return emailRegex.test(email);-->
<!--    },-->
<!--    validateName(name) {-->
<!--      const nameRegex = /^.{3,}$/;-->
<!--      return nameRegex.test(name);-->
<!--    },-->
<!--    validatePhoneNumber(mobile) {-->

<!--      if (mobile.length === 10 && mobile[0] === '9') {-->
<!--        return true-->
<!--      } else if (mobile.length === 11 && mobile[0] === '0' && mobile[1] === '9') {-->
<!--        return true-->
<!--      } else {-->
<!--        return false-->
<!--      }-->
<!--      // const phoneNumberRegex = /^\d{10}$/;-->
<!--      // return phoneNumberRegex.test(phoneNumber);-->
<!--    },-->
<!--    disableDivs(id) {-->
<!--      if (id === 'name') {-->

<!--        setTimeout(() => {-->
<!--          this.nameInput = false-->
<!--        }, 200)-->

<!--      } else if (id === 'email') {-->

<!--        setTimeout(() => {-->
<!--          this.emailInput = false-->
<!--        }, 200)-->
<!--      } else {-->
<!--        setTimeout(() => {-->
<!--          this.phoneInput = false-->
<!--        }, 200)-->
<!--      }-->
<!--    },-->
<!--    inviteToPrivateRoom() {-->
<!--      // if (this.guestNewUsersInvited.length > 0) {-->
<!--      //   this.invitePrivate()-->
<!--      // }-->
<!--      // if (this.organizationalUsersInvited.length > 0) {-->
<!--      //   this.invitePublic()-->
<!--      // }-->

<!--      this.joinToSession();-->
<!--    },-->
<!--    invitePrivate() {-->
<!--      const guestUser = this.allUsersInvited.map((user) => {-->
<!--        return {-->
<!--          nickName: user.nickName,-->
<!--          email: user.email,-->
<!--          mobile: user.mobile,-->
<!--          customerId: this.$store.getters.customerId,-->
<!--          meetingId: this.$store.getters.privateRoomId,-->
<!--        }-->
<!--      })-->
<!--      const data = {-->
<!--        meetingId: this.$store.getters.privateRoomId,-->
<!--        guestDtos: guestUser,-->
<!--        inviteMessage: this.inviteText-->
<!--      }-->

<!--      restClientPrivateRoom.inviteGuest(data).then((response) => {-->
<!--        console.error(response)-->
<!--      }).catch((err) => {-->
<!--        console.error(err)-->
<!--      })-->

<!--      this.publicInvite = false-->

<!--    },-->


<!--    invitePublic() {-->

<!--      const guestEmails = this.allUsersInvited.map((user) => {-->
<!--        return user.email-->

<!--      })-->
<!--      const guestPhoneNumbers = this.allUsersInvited.map((user) => {-->
<!--        return user.mobile-->

<!--      })-->

<!--      const meetingId = this.$store.getters.privateRoomId-->
<!--      const inviteMessage = this.inviteText-->
<!--      const meetingLink = this.meetingLink-->


<!--      restClientPrivateRoom.inviteByPublicLink(meetingId, meetingLink, guestEmails, guestPhoneNumbers, inviteMessage).then((response) => {-->
<!--        console.error(response)-->
<!--      }).catch((err) => {-->
<!--        console.error(err)-->
<!--      })-->

<!--      this.publicInvite = true-->

<!--    },-->


<!--    getAllPrivateInvited() {-->
<!--      restClientPrivateRoom-->
<!--          .getAllInvited(this.$store.getters.privateRoomId)-->
<!--          .then((response) => {-->

<!--            this.organizationalUsersInvited = response.data.customUsers-->
<!--            this.guestUsersInvited = response.data.guestUsers-->
<!--            this.allUsersInvited = [...response.data.customUsers, ...response.data.guestUsers]-->
<!--            this.invitedUsersForDelete = [...response.data.customUsers, ...response.data.guestUsers]-->


<!--          }).catch((error) => {-->
<!--        console.error(error)-->
<!--      })-->
<!--    },-->

<!--    showPublicLink() {-->
<!--      this.publicInvite = true-->
<!--    },-->
<!--    hidePublicLink() {-->
<!--      this.publicInvite = false-->
<!--    },-->

<!--    inviteWithPublicLink() {-->


<!--    },-->
<!--    inviteWithPrivateLink() {-->

<!--    },-->
<!--    createPrivateRoomMeeting() {-->
<!--      const data = {-->
<!--        fromSchd: '',-->
<!--        toSchd: '',-->
<!--        title: 'اتاق شخصی',-->
<!--        description: '',-->
<!--        notificationType: 1,-->
<!--        managerUserId: +this.$store.getters.userId,-->
<!--        substitutionUserId: null,-->
<!--        privateRoomId: this.$store.getters.privateRoomId,-->
<!--        meetingPinCode: '',-->
<!--        publishSize: 8-->
<!--      }-->
<!--      restClientPrivateRoom.createPrivateRoomMeeting(data).then((response) => {-->
<!--        if (response?.prMeetingId) {-->
<!--          this.$store.dispatch('setPrRoomId', response.prMeetingId)-->
<!--        } else {-->
<!--          this.$store.dispatch('setPrRoomId', response.data)-->
<!--        }-->

<!--      }).catch((error) => {-->
<!--        console.error(error)-->
<!--      })-->
<!--    }-->

<!--  },-->

<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.input-container {-->
<!--  display: flex;-->
<!--  width: 91rem;-->
<!--  justify-content: space-around;-->
<!--  align-items: center;-->
<!--  border-bottom: 0.1rem solid #DCDADA;-->
<!--  padding-bottom: 2.5rem;-->
<!--}-->

<!--.circle {-->
<!--  width: 3rem;-->
<!--  height: 3rem;-->
<!--  background-color: #1B76FF;-->
<!--  border-radius: 50%;-->
<!--  position: relative;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  top: 0.9rem;-->
<!--}-->

<!--.plus-svg {-->
<!--  cursor: pointer;-->
<!--  //pointer-events: none;-->
<!--}-->

<!--.tooltip-container {-->
<!--  display: flex;-->

<!--}-->


<!--.tooltip {-->
<!--  position: relative;-->
<!--  display: inline-block;-->
<!--}-->

<!--.tooltip .tooltiptext {-->
<!--  visibility: hidden;-->
<!--  width: 9rem;-->
<!--  background-color: #555;-->
<!--  color: #fff;-->
<!--  text-align: center;-->
<!--  border-radius: 6px;-->
<!--  padding: 4px 0;-->
<!--  position: absolute;-->
<!--  z-index: 100000;-->
<!--  bottom: 100%;-->
<!--  left: 50%;-->
<!--  margin-left: -55px;-->
<!--  opacity: 0;-->
<!--  transition: opacity 0.3s;-->
<!--  font-size: 1rem;-->
<!--}-->

<!--.tooltip .tooltiptext::after {-->
<!--  content: "";-->
<!--  position: absolute;-->
<!--  top: 100%;-->
<!--  left: 50%;-->
<!--  margin-left: -11px;-->
<!--  border-width: 5px;-->
<!--  border-style: solid;-->
<!--  border-color: #555 transparent transparent transparent;-->
<!--}-->

<!--.tooltip-container:hover .tooltiptext {-->
<!--  visibility: visible;-->
<!--  opacity: 1;-->
<!--}-->


<!--.tooltip-container-question-mark {-->
<!--  display: flex;-->

<!--}-->


<!--.tooltip-question-mark {-->
<!--  position: relative;-->
<!--  display: inline-block;-->
<!--}-->

<!--.tooltip-question-mark .tooltiptext-question-mark {-->
<!--  visibility: hidden;-->
<!--  width: 20rem;-->
<!--  background-color: #555;-->
<!--  color: #fff;-->
<!--  text-align: center;-->
<!--  border-radius: 6px;-->
<!--  padding: 10px 20px;-->
<!--  position: absolute;-->
<!--  z-index: 100000;-->
<!--  bottom: 100%;-->
<!--  left: 50%;-->
<!--  margin-left: -121px;-->
<!--  opacity: 0;-->
<!--  transition: opacity 0.3s;-->
<!--  font-size: 1rem;-->
<!--}-->

<!--.tooltip-question-mark .tooltiptext-question-mark::after {-->
<!--  content: "";-->
<!--  position: absolute;-->
<!--  top: 100%;-->
<!--  left: 50%;-->
<!--  margin-left: -11px;-->
<!--  border-width: 5px;-->
<!--  border-style: solid;-->
<!--  border-color: #555 transparent transparent transparent;-->
<!--}-->

<!--.tooltip-container-question-mark:hover .tooltiptext-question-mark {-->
<!--  visibility: visible;-->
<!--  opacity: 1;-->
<!--}-->

<!--.participants-table {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  margin-top: 0.7rem;-->
<!--  width: 91rem;-->
<!--  height: 17.5rem;-->
<!--  position: relative;-->
<!--  //border-bottom: 0.1rem solid #DCDADA;-->

<!--}-->

<!--.participants-table__th {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  width: 90.3rem;-->
<!--  color: #75758F;-->
<!--  text-align: right;-->
<!--  font-size: 1.5rem;-->
<!--  font-weight: 600;-->
<!--}-->

<!--.participants-table__ul {-->
<!--  width: 91rem;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  direction: rtl;-->
<!--  padding: 0;-->
<!--  margin: 0;-->
<!--  overflow-y: auto;-->
<!--  //min-width: 75rem; max-height: 20rem; margin-top: 1rem;-->
<!--}-->

<!--.participants-table__li:nth-child(odd) {-->
<!--  background-color: #F6F6F7;-->
<!--}-->

<!--.participants-table__li {-->
<!--  text-align: right;-->
<!--  font-size: 1.4rem;-->
<!--  font-weight: 400;-->
<!--  direction: rtl;-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  margin-top: 1rem;-->
<!--  padding: 0.5rem;-->
<!--}-->

<!--.participants-table__li > div {-->
<!--  width: 100%;-->
<!--  text-align: right;-->
<!--  font-size: 1.4rem;-->
<!--  font-weight: 400;-->
<!--  direction: rtl;-->
<!--}-->

<!--.participants-table__li > div:last-child {-->
<!--  width: 5%;-->
<!--  text-align: right;-->
<!--  font-size: 1.4rem;-->
<!--  font-weight: 400;-->
<!--  direction: rtl;-->
<!--  cursor: pointer;-->
<!--}-->

<!--.participants-table__li > div > span {-->
<!--  display: block;-->
<!--  max-width: 95%;-->
<!--  white-space: nowrap;-->
<!--  overflow: hidden;-->
<!--  text-overflow: ellipsis;-->
<!--}-->

<!--.inviteText__container {-->
<!--  color: #75758F;-->
<!--  text-align: right;-->
<!--  line-height: 2.5rem;-->
<!--  margin-top: 1.5rem;-->
<!--  max-width: 91rem;-->
<!--}-->

<!--.inviteText__container > span {-->

<!--  font-size: 1.3rem;-->

<!--}-->

<!--.inviteText__container > textarea {-->
<!--  width: 100%;-->
<!--  height: 8rem;-->
<!--  margin-top: 0.7rem;-->
<!--  border-radius: 0.5rem;-->
<!--  padding: 0.5rem 1rem;-->
<!--  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);-->
<!--  font-size: 1.4rem;-->
<!--  padding: 0.8rem 2rem 3rem 1rem;-->
<!--  //font-weight: 546;-->
<!--}-->

<!--.inviteLink__container {-->
<!--  text-align: right;-->
<!--  font-size: 1.3rem;-->
<!--  line-height: 2.5rem;-->
<!--  /* 133.333% */-->
<!--  margin-top: -1rem;-->
<!--  max-width: 91rem;-->
<!--}-->

<!--.inviteLink__container > span {-->
<!--  color: #75758F;-->
<!--}-->

<!--.link-button__container {-->
<!--  color: #292933;-->
<!--  text-align: right;-->
<!--  font-size: 1.3rem;-->
<!--  font-weight: 400;-->
<!--  background-color: #F6F6F7;-->
<!--  padding: 1.5rem;-->
<!--  border-radius: 0.5rem;-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--}-->

<!--.invite-link-input {-->
<!--  font-size: 1.5rem;-->
<!--  width: 70rem;-->
<!--  outline: none;-->
<!--  border: 0.01rem solid transparent;-->
<!--}-->


<!--.invite-link-button {-->
<!--  background-color: rgb(27, 118, 255);-->
<!--  color: #FFF;-->
<!--  text-align: right;-->
<!--  font-weight: 700;-->
<!--  line-height: 1rem;-->
<!--  /* 133.333% */-->
<!--  font-size: 1.2rem;-->
<!--  border: none;-->
<!--  border-radius: 0.5rem;-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  padding: 0.7rem;-->
<!--  cursor: pointer;-->
<!--}-->

<!--.invite-link-button img {-->
<!--  margin-left: 1rem;-->
<!--}-->



<!--.private-invite-btn {-->
<!--  height: 4rem;-->
<!--}-->
<!--.public-invite-btn {-->
<!--  height: 4rem;-->
<!--}-->



<!--.nameInputContainer {-->
<!--  position: absolute;-->
<!--  width: 25.4rem;-->
<!--  top: 14.9rem;-->
<!--  right: 4.1rem;-->
<!--  max-height: 15rem;-->
<!--  overflow-y: scroll;-->
<!--  direction: rtl;-->
<!--  border: 0.1rem solid #F6F6F7;-->
<!--  border-radius: 1rem;-->
<!--  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);-->
<!--  z-index: 1000;-->
<!--  background-color: white;-->
<!--}-->

<!--.nameInput-ul {-->
<!--}-->

<!--.nameInput-li {-->
<!--  width: 100%;-->
<!--  height: 3rem;-->
<!--  padding: 0.5rem;-->
<!--  cursor: pointer;-->
<!--  font-size: 1.2rem;-->
<!--  font-weight: 400;-->
<!--  color: #75758F;-->
<!--}-->

<!--.nameInput-li:hover {-->
<!--  background-color: #F2F2F2;-->
<!--  border: 0.1rem solid transparent;-->
<!--  border-radius: 0.8rem;-->
<!--}-->

<!--.emailInputContainer {-->
<!--  position: absolute;-->
<!--  width: 25.4rem;-->
<!--  max-height: 15rem;-->
<!--  top: 14.9rem;-->
<!--  right: 33.5rem;-->
<!--  overflow-y: scroll;-->
<!--  direction: rtl;-->
<!--  border: 0.1rem solid #F6F6F7;-->
<!--  border-radius: 1rem;-->
<!--  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);-->
<!--  z-index: 1000;-->
<!--  background-color: white;-->
<!--}-->

<!--.emailInput-ul {-->
<!--}-->

<!--.emailInput-li {-->
<!--  width: 100%;-->
<!--  height: 3rem;-->
<!--  padding: 0.5rem;-->
<!--  cursor: pointer;-->
<!--  font-size: 1.2rem;-->
<!--  font-weight: 400;-->
<!--  color: #75758F;-->
<!--}-->

<!--.emailInput-li:hover {-->
<!--  background-color: #F2F2F2;-->
<!--  border: 0.1rem solid transparent;-->
<!--  border-radius: 0.8rem;-->
<!--}-->

<!--.phoneInputContainer {-->
<!--  position: absolute;-->
<!--  width: 25.4rem;-->
<!--  max-height: 15rem;-->
<!--  top: 14.9rem;-->
<!--  left: 10.8rem;-->
<!--  overflow-y: scroll;-->
<!--  direction: rtl;-->
<!--  border: 0.1rem solid #F6F6F7;-->
<!--  border-radius: 1rem;-->
<!--  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);-->
<!--  z-index: 1000;-->
<!--  background-color: white;-->
<!--}-->

<!--.phoneInput-ul {-->
<!--}-->

<!--.phoneInput-li {-->
<!--  width: 100%;-->
<!--  height: 3rem;-->
<!--  padding: 0.5rem;-->
<!--  cursor: pointer;-->
<!--  font-size: 1.2rem;-->
<!--  font-weight: 400;-->
<!--  color: #75758F;-->
<!--}-->

<!--.phoneInput-li:hover {-->
<!--  background-color: #F2F2F2;-->
<!--  border: 0.1rem solid transparent;-->
<!--  border-radius: 0.8rem;-->
<!--}-->

<!--.user-not-added {-->
<!--  position: absolute;-->
<!--  width: 30rem;-->
<!--  height: 3rem;-->
<!--  top: 11rem;-->
<!--  right: 37rem;-->
<!--  color: #75758F;-->
<!--  text-align: right;-->
<!--  font-size: 1.5rem;-->
<!--  font-weight: 500;-->
<!--  line-height: 1rem;-->
<!--  letter-spacing: 0.05rem;-->
<!--}-->

<!--.button-container&#45;&#45;private {-->
<!--  display: flex;-->
<!--  width: 100%;-->
<!--  justify-content: flex-start;-->
<!--  //margin-right: 69.5rem; gap: 1.5rem;-->
<!--}-->

<!--.invite-btn {-->

<!--  width: 12rem;-->
<!--}-->

<!--.withdrawal-btn {-->
<!--  padding: 1.5rem;-->
<!--  width: 10rem;-->
<!--}-->

<!--.search__email-container__text {-->
<!--  color: lightgray;-->
<!--  font-size: 1.2rem;-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  right: 1rem;-->
<!--}-->

<!--.search__email-container__text-ltr {-->
<!--  color: #bbb8b8;-->
<!--  font-size: 1.2rem;-->
<!--  direction: ltr;-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  z-index: 1000;-->
<!--  left: 1rem;-->
<!--}-->

<!--.header-container&#45;&#45;private&#45;&#45;invitation-rtl {-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  height: 4rem;-->
<!--  width: 91rem;-->
<!--  border-bottom: solid 0.1rem grey;-->
<!--}-->

<!--.header-container&#45;&#45;private&#45;&#45;invitation-ltr {-->
<!--  display: flex;-->
<!--  flex-direction: row-reverse;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  height: 4rem;-->
<!--  width: 91rem;-->
<!--  border-bottom: solid 0.1rem grey;-->
<!--}-->

<!--h2 {-->
<!--  direction: rtl;-->
<!--  font-size: 1.5rem;-->
<!--}-->

<!--.body-container&#45;&#45;private {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: space-between;-->
<!--  width: 55.8rem;-->
<!--  height: 53rem;-->
<!--}-->

<!--.top__section-body-container-rtl {-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  /*justify-content: space-between;*/-->
<!--  width: 100%;-->
<!--  height: 23rem;-->
<!--}-->

<!--.top__section-body-container-ltr {-->
<!--  display: flex;-->
<!--  flex-direction: row-reverse;-->
<!--  /*justify-content: space-between;*/-->
<!--  width: 100%;-->
<!--  height: 23rem;-->
<!--}-->

<!--.email-text-container {-->
<!--  width: 15%;-->
<!--  height: 3rem;-->
<!--  /*direction: rtl;*/-->
<!--  font-size: 1.2rem;-->
<!--}-->

<!--.email__address-container {-->
<!--  position: relative;-->
<!--  width: 84%;-->
<!--  height: 25rem;-->
<!--  border: solid 0.1rem #707070;-->
<!--  border-radius: 1rem;-->
<!--  /*display: flex;*/-->
<!--  /*flex-direction: column;*/-->
<!--  padding: 0.5rem;-->
<!--}-->

<!--.emails-container {-->
<!--  display: flex;-->
<!--  flex-wrap: wrap;-->
<!--  direction: ltr;-->
<!--  width: 46rem;-->
<!--}-->

<!--.search__email-container {-->
<!--  position: relative;-->
<!--  height: 2.2rem;-->
<!--  width: 25%;-->
<!--}-->

<!--.search__email-input {-->
<!--  margin-top: 0.2rem;-->
<!--  width: 100%;-->
<!--  height: 80%;-->
<!--  border: none;-->
<!--  /*background-color: #f4f5f8;*/-->
<!--  border-radius: 1rem;-->
<!--  direction: ltr;-->
<!--  padding-left: 0.3rem;-->
<!--  margin-left: 0.5rem;-->
<!--}-->

<!--.search__email-input:focus {-->
<!--  outline: none;-->
<!--}-->

<!--.search__email-input::placeholder {-->
<!--  font-size: 0.9rem;-->
<!--}-->

<!--.bottom__section-body-container {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->

<!--  width: 100%;-->
<!--  height: 25rem;-->
<!--}-->

<!--.email__title-container {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  height: 6rem;-->
<!--  width: 55.8rem;-->
<!--  justify-content: space-between;-->
<!--}-->

<!--.email__title-rtl {-->
<!--  width: 100%;-->
<!--  height: 1.5rem;-->
<!--  font-size: 1.2rem;-->
<!--  direction: rtl;-->
<!--  margin-bottom: 1rem;-->

<!--  align-items: center;-->
<!--}-->

<!--.email__title-ltr {-->
<!--  width: 100%;-->
<!--  height: 1.5rem;-->
<!--  font-size: 1.2rem;-->
<!--  margin-bottom: 1rem;-->
<!--  direction: ltr;-->
<!--  align-items: center;-->
<!--}-->

<!--.email__title-input-container {-->
<!--  width: 100%;-->
<!--  height: 3.5rem;-->
<!--}-->

<!--.email__title-input-container input {-->
<!--  width: 100%;-->
<!--  height: 4rem;-->
<!--  border: solid 0.1rem #cdcdcd;-->
<!--  border-radius: 1rem;-->
<!--  font-size: 1.2rem;-->
<!--  padding-right: 1rem;-->
<!--  background-color: #eaebee;-->
<!--}-->

<!--.copy__icon__text {-->
<!--  color: #08aa3e;-->
<!--  font-size: 1.2rem;-->
<!--  width: 25rem;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--}-->

<!--.question-mark-container {-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  margin-top: 1rem;-->
<!--}-->

<!--.question-mark {-->
<!--  margin-top: -0.3rem;-->
<!--  margin-right: -0.5rem;-->
<!--  cursor: pointer;-->
<!--}-->

<!--@keyframes copiedText {-->
<!--  from {-->
<!--    transform: translateY(-1rem);-->
<!--    display: none;-->
<!--  }-->

<!--  to {-->
<!--    transform: translateY(0);-->
<!--    display: block;-->
<!--  }-->

<!--  0% {-->
<!--    transform: translateY(-1.5rem);-->
<!--    opacity: 0;-->
<!--  }-->

<!--  25% {-->
<!--    transform: translateY(0);-->
<!--    opacity: 100%;-->
<!--  }-->

<!--  50% {-->
<!--    transform: translateY(0);-->
<!--    opacity: 100%;-->
<!--  }-->

<!--  75% {-->
<!--    transform: translateY(0);-->
<!--    opacity: 100%;-->
<!--  }-->

<!--  100% {-->
<!--    transform: translateY(-1.5rem);-->
<!--    opacity: 0;-->
<!--  }-->
<!--}-->

<!--.copy__icon__text span {-->
<!--  animation-name: copiedText;-->
<!--  animation-duration: 6s;-->
<!--}-->

<!--.email__title-input-container input:focus {-->
<!--  outline: none;-->
<!--  box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.26);-->
<!--}-->

<!--.invitation__text-container {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: space-between;-->
<!--  height: 9rem;-->
<!--  width: 55.8rem;-->
<!--  margin-top: 1.5rem;-->
<!--}-->

<!--.invitation__text {-->
<!--  width: 100%;-->
<!--  font-size: 1.2rem;-->
<!--  height: 1.8rem;-->
<!--  direction: rtl;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  margin-bottom: 1rem;-->
<!--}-->

<!--.invitation__text-rtl {-->
<!--  width: 100%;-->
<!--  font-size: 1.2rem;-->
<!--  height: 1.8rem;-->
<!--  direction: rtl;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  margin-bottom: 1rem;-->
<!--}-->

<!--.invitation__text-ltr {-->
<!--  width: 100%;-->
<!--  font-size: 1.2rem;-->
<!--  height: 1.8rem;-->
<!--  direction: ltr;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  margin-bottom: 1rem;-->
<!--}-->

<!--.invitation__text-container:last-child {-->
<!--  width: 100%;-->
<!--  height: 7rem;-->
<!--}-->

<!--.invitation__text-container textarea {-->
<!--  width: 100%;-->
<!--  height: 7rem;-->
<!--  border: solid 0.1rem #cdcdcd;-->
<!--  border-radius: 1rem;-->
<!--  resize: none;-->
<!--  padding-right: 1rem;-->
<!--  margin-right: 0;-->
<!--  margin-bottom: 1rem;-->
<!--  background-color: #eaebee;-->
<!--}-->

<!--.invitation__text-container textarea:focus {-->
<!--  outline: none;-->
<!--  box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.26);-->
<!--}-->

<!--.meeting__link-container {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: space-between;-->
<!--  height: 7rem;-->
<!--  width: 55.8rem;-->
<!--  margin-top: 1rem;-->
<!--}-->

<!--.meeting__link-input-container {-->
<!--  width: 55.8rem;-->
<!--  height: 3.7rem;-->
<!--  font-size: 1.2rem;-->
<!--}-->

<!--.copy__icon-container {-->
<!--  width: 55.8rem;-->
<!--  height: 3.6rem;-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  align-items: center;-->
<!--  margin-top: 1rem;-->
<!--  justify-content: space-between;-->
<!--}-->

<!--.icon__copy {-->
<!--  width: 3.6rem;-->
<!--  height: 3.6rem;-->
<!--  border-radius: 50%;-->
<!--  background-color: #1a73e8;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  cursor: pointer;-->
<!--  position: relative;-->
<!--  z-index: 100;-->
<!--}-->

<!--.meeting__link-input-container input {-->
<!--  width: 100%;-->
<!--  height: 3rem;-->
<!--  border-radius: 1rem;-->
<!--  border: solid 0.1rem #cdcdcd;-->
<!--  direction: ltr;-->
<!--  padding-left: 1rem;-->
<!--  background-color: #eaebee;-->
<!--}-->

<!--.meeting__link-input-container input:focus {-->
<!--  outline: none;-->
<!--  box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.26);-->
<!--}-->

<!--.badge-list__others {-->
<!--  color: #1a73e8;-->
<!--  border: solid 0.1rem #dadce0;-->
<!--  border-radius: 1.1rem;-->
<!--  height: 2rem;-->
<!--  width: 5rem;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  font-size: 1rem;-->
<!--  font-weight: bold;-->
<!--  position: relative;-->
<!--  cursor: pointer;-->
<!--  margin-left: 1rem;-->
<!--  direction: rtl;-->
<!--}-->

<!--.found__users {-->
<!--  position: absolute;-->
<!--  right: -5rem;-->
<!--  top: 2rem;-->
<!--  z-index: 100;-->
<!--  width: 21rem;-->
<!--  max-height: 13.5rem;-->
<!--  border: solid 0.1rem lightgray;-->
<!--  background-color: white;-->
<!--  overflow-y: auto;-->
<!--  border-radius: 1rem;-->
<!--  direction: ltr;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  padding: 0;-->
<!--}-->

<!--.found__users:focus {-->
<!--  outline: none;-->
<!--}-->

<!--.found__users-list {-->
<!--  /*position: relative;*/-->
<!--  font-size: 1.3rem;-->
<!--  width: 100%;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  direction: ltr;-->
<!--  /*border-bottom: 0.1rem solid rgb(204, 198, 198);*/-->
<!--  height: 3.5rem;-->
<!--  padding-left: 0.6rem;-->
<!--}-->

<!--.found__users-list > p {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  height: 3.5rem;-->
<!--  max-width: 20rem;-->
<!--  white-space: nowrap;-->
<!--  overflow: hidden;-->
<!--  text-overflow: ellipsis;-->
<!--}-->

<!--.found__users-list:hover {-->
<!--  background-color: rgb(214, 214, 220);-->
<!--  cursor: pointer;-->
<!--}-->

<!--.participants__more {-->
<!--  position: absolute;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  width: 18rem;-->
<!--  max-height: 10rem;-->
<!--  border: solid 0.1rem lightgray;-->
<!--  z-index: 100;-->
<!--  background-color: white;-->
<!--  /*overflow-y: auto;*/-->
<!--  /*left: -3rem;*-->
<!--     */-->
<!--  top: 2rem;-->
<!--  left: -4rem;-->
<!--  direction: ltr;-->
<!--  border-radius: 1rem;-->
<!--}-->

<!--.participant {-->
<!--  position: relative;-->

<!--  width: 100%;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  height: 2rem;-->
<!--  border-bottom: 0.1rem solid rgb(204, 198, 198);-->
<!--  padding-left: 1.5rem;-->
<!--  font-size: 1.1rem;-->
<!--  padding-right: 0.6rem;-->
<!--  direction: ltr;-->
<!--}-->

<!--.participant:hover {-->
<!--  outline: none;-->
<!--  border: none;-->
<!--  background-color: #ece9e9;-->
<!--}-->

<!--.hidden-badge {-->
<!--  transform: rotate(45deg);-->
<!--  width: 1rem;-->
<!--  height: 1rem;-->
<!--  font-size: 1.2rem;-->
<!--  left: 0.2rem;-->
<!--  background-color: transparent;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  position: absolute;-->

<!--  cursor: pointer;-->
<!--  color: black;-->
<!--  border-radius: 50%;-->
<!--}-->

<!--.hidden-badge:hover {-->
<!--  background-color: #1a73e8;-->
<!--  color: white;-->
<!--}-->

<!--.focused {-->
<!--  background-color: #d9d8d8;-->
<!--}-->

<!--.nameInputError {-->
<!--  position: absolute;-->
<!--  width: 25.4rem;-->
<!--  top: 15rem;-->
<!--  right: 4.4rem;-->
<!--  font-size: 1.2rem;-->
<!--  color: #EC3737-->
<!--}-->

<!--.emailInputError {-->
<!--  position: absolute;-->
<!--  width: 25.4rem;-->
<!--  top: 15rem;-->
<!--  right: 33.7rem;-->
<!--  font-size: 1.2rem;-->
<!--  color: #EC3737-->
<!--}-->

<!--.phoneInputError {-->
<!--  position: absolute;-->
<!--  width: 25.4rem;-->
<!--  top: 15rem;-->
<!--  right: 63.1rem;-->
<!--  font-size: 1.2rem;-->
<!--  color: #EC3737-->
<!--}-->

<!--.choose_which_invite {-->
<!--  width: 100%;-->
<!--  margin-bottom: 1rem;-->
<!--}-->

<!--.button-container&#45;&#45;choose_invite {-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  gap: 1rem;-->
<!--  height: 2rem;-->
<!--  justify-content: center;-->
<!--  margin-top: 1rem;-->
<!--}-->

<!--.label {-->
<!--  color: #75758F;-->
<!--  text-align: right;-->
<!--  font-size: 1.3rem;-->
<!--  font-style: normal;-->
<!--  font-weight: 400;-->
<!--  line-height: 1rem;-->
<!--}-->


<!--@media (max-width: 1024px) and (min-width: 768px) {-->
<!--  .header-container&#45;&#45;private&#45;&#45;invitation-rtl {-->
<!--    display: flex;-->
<!--    flex-direction: row;-->
<!--    justify-content: space-between;-->
<!--    align-items: center;-->
<!--    height: 4rem;-->
<!--    width: 65rem;-->
<!--    border-bottom: solid 0.1rem grey;-->
<!--  }-->

<!--  .input-container {-->
<!--    display: flex;-->
<!--    width: 65rem;-->
<!--    justify-content: space-around;-->
<!--    align-items: center;-->
<!--    //gap: 4rem;-->
<!--  }-->

<!--  .participants-table {-->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    margin-top: 0.7rem;-->
<!--    width: 65rem;-->
<!--    height: 21.5rem;-->
<!--    position: relative;-->
<!--  }-->

<!--  .inviteText__container {-->
<!--    color: #75758F;-->
<!--    text-align: right;-->
<!--    line-height: 2.5rem;-->
<!--    /* 133.333% */-->
<!--    margin-top: 2rem;-->
<!--    max-width: 65rem;-->
<!--  }-->

<!--  .inviteLink__container {-->
<!--    text-align: right;-->
<!--    line-height: 2.5rem;-->
<!--    /* 133.333% */-->
<!--    margin-top: 2rem;-->
<!--    max-width: 65rem;-->
<!--  }-->

<!--  .button-container&#45;&#45;private {-->
<!--    display: flex;-->
<!--    margin-right: 43.5rem;-->
<!--    //gap: 1.5rem;-->
<!--  }-->


<!--  .nameInputContainer {-->
<!--    position: absolute;-->
<!--    width: 19.4rem;-->
<!--    max-height: 15rem;-->
<!--    top: 14.9rem;-->
<!--    right: 4.1rem;-->
<!--    overflow-y: scroll;-->
<!--    direction: rtl;-->
<!--    border: 0.1rem solid #F6F6F7;-->
<!--    border-radius: 1rem;-->
<!--    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);-->
<!--    z-index: 1000;-->
<!--    background-color: white;-->
<!--  }-->

<!--  .invite-link-input {-->
<!--    font-size: 1.4rem;-->
<!--    width: 52rem;-->
<!--    outline: none;-->
<!--    border: 0.01rem solid transparent;-->
<!--  }-->

<!--  .emailInputContainer {-->
<!--    position: absolute;-->
<!--    width: 19.4rem;-->
<!--    max-height: 15rem;-->
<!--    top: 14.9rem;-->
<!--    right: 24.9rem;-->
<!--    overflow-y: scroll;-->
<!--    direction: rtl;-->
<!--    border: 0.1rem solid #F6F6F7;-->
<!--    border-radius: 1rem;-->
<!--    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);-->
<!--    z-index: 1000;-->
<!--    background-color: white;-->
<!--  }-->


<!--  .phoneInputContainer {-->
<!--    position: absolute;-->
<!--    width: 19.4rem;-->
<!--    max-height: 15rem;-->
<!--    top: 14.9rem;-->
<!--    left: 8.4rem;-->
<!--    overflow-y: scroll;-->
<!--    direction: rtl;-->
<!--    border: 0.1rem solid #F6F6F7;-->
<!--    border-radius: 1rem;-->
<!--    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);-->
<!--    z-index: 1000;-->
<!--    background-color: white;-->
<!--  }-->


<!--  .participants-table__th {-->
<!--    display: flex;-->
<!--    justify-content: space-between;-->
<!--    width: 65rem;-->
<!--    color: #75758F;-->
<!--    text-align: right;-->
<!--    font-size: 1.5rem;-->
<!--    font-weight: 600;-->
<!--    //gap: 23rem;-->
<!--  }-->

<!--  .participants-table__ul {-->
<!--    width: 65.5rem;-->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    direction: rtl;-->
<!--    padding: 0;-->
<!--    margin: 0;-->
<!--    overflow-y: auto;-->
<!--    //min-width: 75rem; max-height: 20rem; margin-top: 1rem;-->
<!--  }-->

<!--  .participants-table__li:nth-child(odd) {-->
<!--    background-color: #F6F6F7;-->
<!--  }-->

<!--  .participants-table__li {-->
<!--    text-align: right;-->
<!--    font-size: 1.4rem;-->
<!--    font-weight: 400;-->
<!--    direction: rtl;-->
<!--    display: flex;-->
<!--    justify-content: space-between;-->
<!--    align-items: center;-->
<!--    margin-top: 1rem;-->
<!--    padding: 0.5rem;-->
<!--    //gap: 3rem;-->
<!--  }-->

<!--  .participants-table__li > div {-->
<!--    width: 100%;-->
<!--    text-align: right;-->
<!--    font-size: 1.4rem;-->
<!--    font-weight: 400;-->
<!--    direction: rtl;-->
<!--  }-->

<!--  .participants-table__li > div:last-child {-->
<!--    width: 5%;-->
<!--    text-align: right;-->
<!--    font-size: 1.4rem;-->
<!--    font-weight: 400;-->
<!--    direction: rtl;-->
<!--    cursor: pointer;-->
<!--  }-->

<!--  .participants-table__li > div > span {-->
<!--    display: block;-->
<!--    max-width: 95%;-->
<!--    white-space: nowrap;-->
<!--    overflow: hidden;-->
<!--    text-overflow: ellipsis;-->
<!--  }-->

<!--  .user-not-added {-->
<!--    position: absolute;-->
<!--    width: 30rem;-->
<!--    height: 3rem;-->
<!--    top: 11rem;-->
<!--    right: 23.5rem;-->
<!--    color: #75758F;-->
<!--    text-align: right;-->
<!--    font-size: 1.5rem;-->
<!--    font-weight: 500;-->
<!--    line-height: 1rem;-->
<!--    letter-spacing: 0.05rem;-->
<!--  }-->

<!--  .nameInputError {-->
<!--    position: absolute;-->
<!--    width: 25.4rem;-->
<!--    top: 15rem;-->
<!--    right: 4.4rem;-->
<!--    font-size: 1.2rem;-->
<!--    color: #EC3737-->
<!--  }-->

<!--  .emailInputError {-->
<!--    position: absolute;-->
<!--    width: 25.4rem;-->
<!--    top: 15rem;-->
<!--    right: 25.3rem;-->
<!--    font-size: 1.2rem;-->
<!--    color: #EC3737-->
<!--  }-->

<!--  .phoneInputError {-->
<!--    position: absolute;-->
<!--    width: 25.4rem;-->
<!--    top: 15rem;-->
<!--    right: 46rem;-->
<!--    font-size: 1.2rem;-->
<!--    color: #EC3737-->
<!--  }-->


<!--}-->

<!--@media (max-width: 768px) {-->
<!--  .header-container&#45;&#45;private&#45;&#45;invitation-rtl {-->
<!--    display: flex;-->
<!--    flex-direction: row;-->
<!--    justify-content: space-between;-->
<!--    align-items: center;-->
<!--    height: 4rem;-->
<!--    width: 37rem;-->
<!--    border-bottom: solid 0.1rem grey;-->
<!--  }-->

<!--  .input-container {-->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    width: 37rem;-->
<!--    justify-content: center;-->
<!--    align-items: center;-->
<!--    gap: 1rem;-->
<!--    padding-bottom: 3.5rem;-->
<!--  }-->

<!--  .participants-table {-->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    margin-top: 0.7rem;-->
<!--    width: 37rem;-->
<!--    height: 19rem;-->
<!--    position: relative;-->
<!--    overflow-x: auto;-->
<!--  }-->

<!--  .inviteText__container {-->
<!--    color: #75758F;-->
<!--    text-align: right;-->
<!--    line-height: 2.2rem;-->
<!--    margin-top: 1.6rem;-->
<!--    max-width: 37rem;-->
<!--  }-->

<!--  .inviteLink__container {-->
<!--    text-align: right;-->
<!--    line-height: 2.5rem;-->
<!--    margin-top: 1rem;-->
<!--    max-width: 37rem;-->

<!--  }-->


<!--  .nameInputContainer {-->
<!--    position: absolute;-->
<!--    width: 32rem;-->
<!--    max-height: 15rem;-->
<!--    top: 15rem;-->
<!--    right: 6.4rem;-->
<!--    overflow-y: scroll;-->
<!--    direction: rtl;-->
<!--    border: 0.1rem solid #F6F6F7;-->
<!--    border-radius: 1rem;-->
<!--    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);-->
<!--    z-index: 1000;-->
<!--    background-color: white;-->
<!--  }-->

<!--  .emailInputContainer {-->
<!--    position: absolute;-->
<!--    width: 32rem;-->
<!--    max-height: 15rem;-->
<!--    top: 20.8rem;-->
<!--    right: 6.4rem;-->
<!--    overflow-y: scroll;-->
<!--    direction: rtl;-->
<!--    border: 0.1rem solid #F6F6F7;-->
<!--    border-radius: 1rem;-->
<!--    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);-->
<!--    z-index: 1000;-->
<!--    background-color: white;-->
<!--  }-->


<!--  .phoneInputContainer {-->
<!--    position: absolute;-->
<!--    width: 32rem;-->
<!--    max-height: 15rem;-->
<!--    top: 26.7rem;-->
<!--    left: 6.5rem;-->
<!--    overflow-y: scroll;-->
<!--    direction: rtl;-->
<!--    border: 0.1rem solid #F6F6F7;-->
<!--    border-radius: 1rem;-->
<!--    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);-->
<!--    z-index: 1000;-->
<!--    background-color: white;-->
<!--  }-->


<!--  .participants-table__th {-->
<!--    display: flex;-->
<!--    justify-content: space-between;-->
<!--    width: 65rem;-->
<!--    color: #75758F;-->
<!--    text-align: right;-->
<!--    font-size: 1.5rem;-->
<!--    font-weight: 600;-->
<!--    //gap: 23rem;-->
<!--  }-->

<!--  .participants-table__ul {-->
<!--    width: 65.5rem;-->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    direction: rtl;-->
<!--    padding: 0;-->
<!--    margin: 0;-->
<!--    overflow-y: auto;-->
<!--    //min-width: 75rem; max-height: 20rem; margin-top: 1rem;-->
<!--  }-->

<!--  .participants-table__li:nth-child(odd) {-->
<!--    background-color: #F6F6F7;-->
<!--  }-->

<!--  .participants-table__li {-->
<!--    text-align: right;-->
<!--    font-size: 1.4rem;-->
<!--    font-weight: 400;-->
<!--    direction: rtl;-->
<!--    display: flex;-->
<!--    justify-content: space-between;-->
<!--    align-items: center;-->
<!--    margin-top: 1rem;-->
<!--    padding: 0.5rem;-->
<!--    //gap: 3rem;-->
<!--  }-->

<!--  .participants-table__li > div {-->
<!--    width: 100%;-->
<!--    text-align: right;-->
<!--    font-size: 1.4rem;-->
<!--    font-weight: 400;-->
<!--    direction: rtl;-->
<!--  }-->

<!--  .participants-table__li > div:last-child {-->
<!--    width: 5%;-->
<!--    text-align: right;-->
<!--    font-size: 1.4rem;-->
<!--    font-weight: 400;-->
<!--    direction: rtl;-->
<!--    cursor: pointer;-->
<!--  }-->

<!--  .participants-table__li > div > span {-->
<!--    display: block;-->
<!--    max-width: 95%;-->
<!--    white-space: nowrap;-->
<!--    overflow: hidden;-->
<!--    text-overflow: ellipsis;-->
<!--  }-->

<!--  .user-not-added {-->
<!--    position: absolute;-->
<!--    width: 30rem;-->
<!--    height: 3rem;-->
<!--    top: 9rem;-->
<!--    right: 23rem;-->
<!--    color: #75758F;-->
<!--    text-align: right;-->
<!--    font-size: 1.5rem;-->
<!--    font-weight: 500;-->
<!--    line-height: 1rem;-->
<!--    letter-spacing: 0.05rem;-->
<!--  }-->

<!--  .circle {-->
<!--    width: 32rem;-->
<!--    padding: 0.5rem 1rem;-->
<!--    height: 3rem;-->
<!--    background-color: #1B76FF;-->
<!--    border-radius: 0.5rem;-->
<!--    position: relative;-->
<!--    display: flex;-->
<!--    justify-content: center;-->
<!--    align-items: center;-->
<!--    top: 1.2rem;-->
<!--  }-->


<!--  .button-container&#45;&#45;private {-->
<!--    display: flex;-->
<!--    justify-content: flex-start;-->
<!--    //margin-top: 0; gap: 1rem; margin-left: 1.6rem;-->
<!--  }-->

<!--  .invite-btn {-->
<!--    padding: 0.8rem;-->
<!--    width: 8rem;-->
<!--  }-->

<!--  .withdrawal-btn {-->
<!--    padding: 0.8rem;-->
<!--    width: 8rem;-->
<!--  }-->

<!--  .invite-link-input {-->
<!--    font-size: 1.4rem;-->
<!--    width: 20rem;-->
<!--    outline: none;-->
<!--    border: 0.01rem solid transparent;-->
<!--  }-->


<!--  .link-button__container {-->
<!--    color: #292933;-->
<!--    text-align: right;-->
<!--    font-size: 1.8rem;-->
<!--    font-weight: 400;-->
<!--    background-color: #F6F6F7;-->
<!--    padding: 0.8rem;-->
<!--    border-radius: 0.5rem;-->
<!--    display: flex;-->
<!--    justify-content: space-between;-->
<!--  }-->

<!--  .tooltip .tooltiptext {-->
<!--    visibility: hidden;-->
<!--    width: 9rem;-->
<!--    background-color: #555;-->
<!--    color: #fff;-->
<!--    text-align: center;-->
<!--    border-radius: 6px;-->
<!--    padding: 4px 0;-->
<!--    position: absolute;-->
<!--    z-index: 100000;-->
<!--    bottom: 100%;-->
<!--    left: 50%;-->
<!--    margin-left: -198px;-->
<!--    opacity: 0;-->
<!--    transition: opacity 0.3s;-->
<!--    font-size: 1rem;-->
<!--  }-->

<!--  .nameInputError {-->
<!--    position: absolute;-->
<!--    width: 25.4rem;-->
<!--    top: 15rem;-->
<!--    right: 26.6rem;-->
<!--    font-size: 1.1rem;-->
<!--    color: #EC3737-->
<!--  }-->

<!--  .emailInputError {-->
<!--    position: absolute;-->
<!--    width: 25.4rem;-->
<!--    top: 21rem;-->
<!--    right: 26.6rem;-->
<!--    font-size: 1.1rem;-->
<!--    color: #EC3737-->
<!--  }-->

<!--  .phoneInputError {-->
<!--    position: absolute;-->
<!--    width: 25.4rem;-->
<!--    top: 27.1rem;-->
<!--    right: 26.6rem;-->
<!--    font-size: 1.1rem;-->
<!--    color: #EC3737;-->

<!--  }-->

<!--  .invite-link-input {-->
<!--    font-size: 1.5rem;-->
<!--    width: 20rem;-->
<!--    outline: none;-->
<!--    border: 0.01rem solid transparent;-->
<!--  }-->

<!--  .invite-btn {-->
<!--    width: 12rem;-->
<!--  }-->


<!--  .choose_which_invite {-->
<!--    width: 100%;-->
<!--    margin-bottom: 1rem;-->
<!--  }-->

<!--  .button-container&#45;&#45;choose_invite {-->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    gap: 1rem;-->
<!--    height: 2rem;-->
<!--    justify-content: center;-->
<!--    margin-top: 1rem;-->
<!--  }-->

<!--  .question-mark-container {-->
<!--    justify-content: center;-->
<!--    width: 104%;-->
<!--  }-->

<!--  .button-container&#45;&#45;choose_invite {-->
<!--    height: 8rem;-->
<!--    justify-content: center;-->

<!--  }-->

<!--  .private-invite-btn {-->
<!--    height: 3.5rem;-->
<!--  }-->
<!--  .public-invite-btn {-->
<!--    height: 4rem;-->
<!--  }-->

<!--}-->

<!--</style>-->

<!--&lt;!&ndash;<template>&ndash;&gt;-->
<!--&lt;!&ndash;  <base-modal page="conference" is-blur="false" :open="isOpen">&ndash;&gt;-->
<!--&lt;!&ndash;    <template #modal-header>&ndash;&gt;-->
<!--&lt;!&ndash;      <div :style="{direction: $i18n.locale === 'fa' ? 'ltr':'rtl'}" class="header-container&#45;&#45;guest&#45;&#45;invitation">&ndash;&gt;-->
<!--&lt;!&ndash;        <img draggable="false" src="/img/close.svg" alt="not-loaded" style="width: 3rem;cursor: pointer" @click="closeInvitationModal" >&ndash;&gt;-->
<!--&lt;!&ndash;        <div>&ndash;&gt;-->
<!--&lt;!&ndash;          <h1>{{$store.getters.t("invite-to-meeting")}}</h1>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;    </template>&ndash;&gt;-->


<!--&lt;!&ndash;    <template #modal-body>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="body-container&#45;&#45;guest">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="search__user-container">&ndash;&gt;-->
<!--&lt;!&ndash;          <div class="search__user-container&#45;&#45;element">&ndash;&gt;-->
<!--&lt;!&ndash;            <label style="color: #75758F;font-size : 1.2rem;width: 100%;">کاربر سازمانی</label>&ndash;&gt;-->

<!--&lt;!&ndash;            <input type="text" class="user-input__search" v-model="userInput" @keyup="search"&ndash;&gt;-->
<!--&lt;!&ndash;                   @blur="isUSerInputFocused = false" @focus="isUSerInputFocused = true"/>&ndash;&gt;-->
<!--&lt;!&ndash;            <div&ndash;&gt;-->
<!--&lt;!&ndash;                class="found-users&#45;&#45;container"&ndash;&gt;-->
<!--&lt;!&ndash;                v-if="foundUsers.length > 0"&ndash;&gt;-->
<!--&lt;!&ndash;                :style="{'max-height':'21rem'}"&ndash;&gt;-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--&lt;!&ndash;              <ul :style="{'max-height':'21rem'}">&ndash;&gt;-->
<!--&lt;!&ndash;                <li&ndash;&gt;-->
<!--&lt;!&ndash;                    v-for="user in foundUsers"&ndash;&gt;-->
<!--&lt;!&ndash;                    :key="user"&ndash;&gt;-->
<!--&lt;!&ndash;                    class="found-user&#45;&#45;list"&ndash;&gt;-->
<!--&lt;!&ndash;                    @click="addToListParticipant(user)"&ndash;&gt;-->
<!--&lt;!&ndash;                >&ndash;&gt;-->
<!--&lt;!&ndash;                  {{ user.firstName + " " + user.lastName }}&ndash;&gt;-->
<!--&lt;!&ndash;                </li>&ndash;&gt;-->
<!--&lt;!&ndash;              </ul>&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;          <div class="search__user-container&#45;&#45;element">&ndash;&gt;-->
<!--&lt;!&ndash;            <label style="color: #75758F;font-size : 1.2rem;width: 100%;">گروه سازمانی</label>&ndash;&gt;-->

<!--&lt;!&ndash;            <input type="text" class="user-input__search" v-model="groupNameInput" @keyup="searchGroupName"&ndash;&gt;-->
<!--&lt;!&ndash;                   @blur="isGroupInputFocused = false" @focus="isGroupInputFocused = true"/>&ndash;&gt;-->
<!--&lt;!&ndash;            <div&ndash;&gt;-->
<!--&lt;!&ndash;                class="found-users&#45;&#45;container"&ndash;&gt;-->
<!--&lt;!&ndash;                v-if="numberOfGroups.length > 0"&ndash;&gt;-->
<!--&lt;!&ndash;                :style="{'max-height':'21rem'}"&ndash;&gt;-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--&lt;!&ndash;              <ul :style="{'max-height':'21rem'}">&ndash;&gt;-->
<!--&lt;!&ndash;                <li&ndash;&gt;-->
<!--&lt;!&ndash;                    v-for="group in numberOfGroups" :key="group"&ndash;&gt;-->
<!--&lt;!&ndash;                    class="found-user&#45;&#45;list"&ndash;&gt;-->
<!--&lt;!&ndash;                    @click="addGroupToListParticipant(group)"&ndash;&gt;-->
<!--&lt;!&ndash;                >&ndash;&gt;-->
<!--&lt;!&ndash;                  {{ group.groupName }}&ndash;&gt;-->
<!--&lt;!&ndash;                </li>&ndash;&gt;-->
<!--&lt;!&ndash;              </ul>&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->


<!--&lt;!&ndash;        <div style="width: 100%;overflow-x: auto;display: flex;flex-direction: column">&ndash;&gt;-->
<!--&lt;!&ndash;          <div ref="table-th" class="invite-user-table__th">&ndash;&gt;-->
<!--&lt;!&ndash;            <span v-for="el in invitedUserListTh" :key="el">{{ el }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;          <ul class="invite-user-table__Ul" :style="{'max-height':'25rem'}">&ndash;&gt;-->
<!--&lt;!&ndash;            <li class="invite-user-table__list" v-for="user in listOfAllUsers" :key="user.id">&ndash;&gt;-->
<!--&lt;!&ndash;              <div><span class="invite-user-info">{{ user.firstName }}</span></div>&ndash;&gt;-->
<!--&lt;!&ndash;              <div><span class="invite-user-info">{{ user.lastName }}</span></div>&ndash;&gt;-->
<!--&lt;!&ndash;              <div><span class="invite-user-info">{{ user.phoneNumber }}</span></div>&ndash;&gt;-->
<!--&lt;!&ndash;              <div><span class="invite-user-info-email">{{ user.email }}</span></div>&ndash;&gt;-->
<!--&lt;!&ndash;              <div><span class="invite-user-info"><img draggable="false" src="/img/close.svg" alt="not-loaded" style="cursor: pointer;width: 2rem" @click="deleteUSer(user)"></span></div>&ndash;&gt;-->
<!--&lt;!&ndash;            </li>&ndash;&gt;-->
<!--&lt;!&ndash;          </ul>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->


<!--&lt;!&ndash;<div class="invite__text&#45;&#45;container">&ndash;&gt;-->
<!--&lt;!&ndash;<span>متن دعوت به جلسه</span>&ndash;&gt;-->
<!--&lt;!&ndash;  <div>{{invitationText}}</div>&ndash;&gt;-->
<!--&lt;!&ndash;</div>&ndash;&gt;-->


<!--&lt;!&ndash;        <div class="invite__text&#45;&#45;container__link">&ndash;&gt;-->
<!--&lt;!&ndash;          <div style="width: calc(100% - 11rem)">&ndash;&gt;-->
<!--&lt;!&ndash;            <input class="invite__text&#45;&#45;container__link&#45;&#45;input" disabled ref="linkURL"&ndash;&gt;-->
<!--&lt;!&ndash;                   v-model="invitationURL">&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;          <div style="width: fit-content;height: fit-content" >&ndash;&gt;-->
<!--&lt;!&ndash;            <base-button&ndash;&gt;-->
<!--&lt;!&ndash;                button-inner-txt="کپی لینک"&ndash;&gt;-->
<!--&lt;!&ndash;                :continuous-params="['color=white', 'background-color=#1B76FF']"&ndash;&gt;-->
<!--&lt;!&ndash;                :style-types="[ 'small&#45;&#45;button']"&ndash;&gt;-->
<!--&lt;!&ndash;                :is-active="true"&ndash;&gt;-->
<!--&lt;!&ndash;                @click="copyToClipboard"&ndash;&gt;-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--&lt;!&ndash;              <template #pre-button-slot>&ndash;&gt;-->
<!--&lt;!&ndash;                <img draggable="false" v-show="!isLinkCopied" src="/img/copy-icon.svg" style="width: 16px; height: 16px" alt="not loaded"&ndash;&gt;-->
<!--&lt;!&ndash;                     class="fade-image">&ndash;&gt;-->
<!--&lt;!&ndash;                <svg class="fade-image" style="width: 16px;height: 16px" v-show="isLinkCopied" width="24" height="24"&ndash;&gt;-->
<!--&lt;!&ndash;                     viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">&ndash;&gt;-->
<!--&lt;!&ndash;                  <path&ndash;&gt;-->
<!--&lt;!&ndash;                      d="M18.7104 7.2101C18.6175 7.11638 18.5069 7.04198 18.385 6.99121C18.2632 6.94044 18.1324 6.91431 18.0004 6.91431C17.8684 6.91431 17.7377 6.94044 17.6159 6.99121C17.494 7.04198 17.3834 7.11638 17.2904 7.2101L9.84044 14.6701L6.71044 11.5301C6.61392 11.4369 6.49998 11.3636 6.37512 11.3143C6.25026 11.2651 6.11694 11.241 5.98276 11.2433C5.84858 11.2457 5.71617 11.2744 5.59309 11.3279C5.47001 11.3814 5.35868 11.4586 5.26544 11.5551C5.1722 11.6516 5.09889 11.7656 5.04968 11.8904C5.00048 12.0153 4.97635 12.1486 4.97867 12.2828C4.98099 12.417 5.00972 12.5494 5.06321 12.6725C5.1167 12.7955 5.19392 12.9069 5.29044 13.0001L9.13044 16.8401C9.2234 16.9338 9.334 17.0082 9.45586 17.059C9.57772 17.1098 9.70843 17.1359 9.84044 17.1359C9.97245 17.1359 10.1032 17.1098 10.225 17.059C10.3469 17.0082 10.4575 16.9338 10.5504 16.8401L18.7104 8.68011C18.8119 8.58646 18.893 8.47281 18.9484 8.34631C19.0038 8.21981 19.0324 8.08321 19.0324 7.94511C19.0324 7.807 19.0038 7.6704 18.9484 7.5439C18.893 7.4174 18.8119 7.30375 18.7104 7.2101Z"&ndash;&gt;-->
<!--&lt;!&ndash;                      fill="white"/>&ndash;&gt;-->
<!--&lt;!&ndash;                </svg>&ndash;&gt;-->

<!--&lt;!&ndash;              </template>&ndash;&gt;-->
<!--&lt;!&ndash;            </base-button>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->


<!--&lt;!&ndash;&lt;!&ndash;        <div class="user-list__container">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          <div :class=" $i18n.locale === 'fa' ? 'user-list-rtl' :  'user-list-ltr'">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            <span :style="{direction : $i18n.locale === 'fa' ? 'rtl' : 'ltr'}">{{$store.getters.t("organizational-user")}}</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            <div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              <div class="search__user-container" @click="clickToSearchUser">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                <span v-if="isClickedToSearchUser && listOfOrganizationalUsers.length === 0" :class=" $i18n.locale === 'fa' ? 'search__user&#45;&#45;text-rtl' : 'search__user&#45;&#45;text-ltr'">{{$store.getters.t("enter-user")}}</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                <input class="search__user" ref="userInput" @blur="showUserPlaceHolder" @focus="deleteUserPlaceHolder" @keydown="deleteUser"  @keyup="search"  :value="userInput.toLowerCase()" @input="userInput = $event.target.value.toLowerCase()">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                &lt;!&ndash;                  <div v-if="isUserFound" class="founded__users">&ndash;&gt;&ndash;&gt;&ndash;&gt;-->

<!--&lt;!&ndash;&lt;!&ndash;                <ul&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    v-if="isUserFound"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    class="founded__users"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    tabindex="0"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    ref="users"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    @blur="focusedIndex = 0"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    @keydown="selectAndMoveAlongUsers">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  <li v-for="(user,index) in foundUsers" :key="user" class="founded__users-list"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                      :class="focusedList(index)"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                      @click="addToListParticipant(user)">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    <p>{{ user.firstName + ' ' + user.lastName }}</p>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  </li>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                </ul>&ndash;&gt;&ndash;&gt;-->

<!--&lt;!&ndash;&lt;!&ndash;                &lt;!&ndash;                  </div>&ndash;&gt;&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              <div class="user-list__participant">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                <div class="badge-list__participant">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  <base-badge :show-badge="false" mode="invitation" v-for="user in filteredParticipant"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                              :key="user" :badge-text="user.firstName + ' ' + user.lastName "&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                              :close="'close-badge'" @close-badge="closeBadge(user)"></base-badge>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                <div v-if="numberOfOtherParticipant>0" class="badge-list__others" @click="showParticipants">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  <p>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    {{ numberOfOtherParticipant + '+' }}&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  </p>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  <div v-if="userIsShown">&ndash;&gt;&ndash;&gt;-->


<!--&lt;!&ndash;&lt;!&ndash;                    <ul class="participants__more">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                      <li v-for="user in otherUsers" :key="user" class="participant">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                        <span class="hidden-badge" @click="closeBadge(user)">+</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                        {{ user.firstName + ' ' + user.lastName }}&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                      </li>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    </ul>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          <div :class=" $i18n.locale === 'fa' ? 'user-list-rtl' :  'user-list-ltr'">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            <span :style="{direction : $i18n.locale === 'fa' ? 'rtl' : 'ltr'}">{{$store.getters.t("organizational-group")}}</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            <div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              <div class="search__user-container"  @click="clickToSearchGroup">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                <span v-if="isClickedToSearchGroup&& invitedGroups.length === 0"  :class=" $i18n.locale === 'fa' ? 'search__user&#45;&#45;text-rtl' : 'search__user&#45;&#45;text-ltr'">{{$store.getters.t("enter-group")}}</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                <input class="search__user" ref="groupInput" @blur="showGroupPlaceHolder" @focus="deleteGroupPlaceHolder" @keydown="deleteGroup"  @keyup="searchGroupName"    :value="groupNameInput.toLowerCase()" @input="groupNameInput = $event.target.value.toLowerCase()">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                &lt;!&ndash;                  <div  >&ndash;&gt;&ndash;&gt;&ndash;&gt;-->

<!--&lt;!&ndash;&lt;!&ndash;                <ul v-if="groupIsFound"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    class="founded__users"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    tabindex="0"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    ref="groups"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    @blur="focusedIndex = 0"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    @keydown="selectAndMoveAlongGroups"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                >&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  <li v-for="(group,index) in numberOfGroups" :key="group" class="founded__users-list"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                      @click="addGroupToListParticipant(group)"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                      :class="focusedList(index)">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    <p>{{ group.groupName }}</p>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  </li>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                </ul>&ndash;&gt;&ndash;&gt;-->

<!--&lt;!&ndash;&lt;!&ndash;                &lt;!&ndash;                  </div>&ndash;&gt;&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              <div class="user-list__participant">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                <div class="badge-list__participant">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  <base-badge :show-badge="false" mode="invitation" v-for="group in filteredGroups" :key="group"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                              :badge-text="group.groupName" :close="'close-badge'"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                              @close-badge="closeBadgeGroup(group)"></base-badge>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                <div v-if="numberOfOtherGroups>0"  class="badge-list__others" @click="showGroupOfParticipants">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  <p>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    {{ numberOfOtherGroups + '+' }}&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  </p>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  <div v-if="groupIsShown">&ndash;&gt;&ndash;&gt;-->


<!--&lt;!&ndash;&lt;!&ndash;                    <ul class="participants__more">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                      <li v-for="group in otherGroups" :key="group" class="participant">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                        <span class="hidden-badge" @click="closeBadgeGroup(group)">+</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                        {{ group.groupName}}&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                      </li>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                    </ul>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                  </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;        </div>&ndash;&gt;&ndash;&gt;-->


<!--&lt;!&ndash;&lt;!&ndash;        <div class="guest__list-container">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          <span :style="{direction : $i18n.locale === 'fa' ? 'rtl' : 'ltr'}">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            {{$store.getters.t("invitation-list")}}&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          </span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          <div class="table-container&#45;&#45;guest">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            <div class="table__header&#45;&#45;guest">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              <span>{{$store.getters.t("name")}}</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              <span>{{$store.getters.t("last-name")}}</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              <span class="email">{{$store.getters.t("email-address")}}</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              <span class="phone">{{$store.getters.t("phone-number")}}</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            <div class="ul-container&#45;&#45;guest">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              <ul>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                <participant-list-element  v-for="user in listOfAllUsers"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                                           :is-guest="true"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                                           :key="user"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                                           :participant-name="user.firstName"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                                           :participant-lastname="user.lastName"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                                           :participant-email="user.email"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                                           :participant-phone-number="user.phoneNumber"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                >&ndash;&gt;&ndash;&gt;-->

<!--&lt;!&ndash;&lt;!&ndash;                </participant-list-element>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              </ul>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;        </div>&ndash;&gt;&ndash;&gt;-->


<!--&lt;!&ndash;&lt;!&ndash;        <div class="invitation__text-container">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          <span :style="{direction : $i18n.locale === 'fa' ? 'rtl' : 'ltr'}">{{$store.getters.t("invitation-link")}}</span>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          <div :class=" $i18n.locale === 'fa' ? 'invitation__text-rtl' : 'invitation__text-ltr'">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            <textarea ref="textarea" disabled type="text" placeholder="متن دعوت را وارد کنید..." v-model="invitationText"></textarea>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          <div :class=" $i18n.locale === 'fa' ? 'invitation__link-container-rtl' : 'invitation__link-container-ltr'">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            <div class="invitation__link">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              <input disabled ref="inputURL"  class="URL__generation" type="text" v-model="invitationURL">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            </div>&ndash;&gt;&ndash;&gt;-->

<!--&lt;!&ndash;&lt;!&ndash;            <div class="icon-container" >&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              <img draggable="false" src="/img/Copy.svg" class="copy-icon" alt="not loaded" @touch="copyToClipboard" @click="copyToClipboard" >&ndash;&gt;&ndash;&gt;-->

<!--&lt;!&ndash;&lt;!&ndash;            </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          <div class="copied-link" v-if="linkIsCopied">{{$store.getters.t("copy-meeting-link")}}</div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;        </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;    </template>&ndash;&gt;-->

<!--&lt;!&ndash;    <template #modal-buttons>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="button-container&#45;&#45;guest">&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;        <base-button&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            is-active="true"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            :button-type="['button&#45;&#45;ultra-big', 'button&#45;&#45;curved', 'background-color=#1a73e8', 'color=white','width=5rem','font-weight=bold','font-size=1.2rem']"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            button-content=" دعوت "&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            @touch="inviteUsers"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            @click="inviteUsers"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;        ></base-button>&ndash;&gt;&ndash;&gt;-->


<!--&lt;!&ndash;        <base-button&ndash;&gt;-->
<!--&lt;!&ndash;            :button-inner-txt='$store.getters.t("invite")'&ndash;&gt;-->
<!--&lt;!&ndash;            :continuous-params="['color=white', 'background-color=#1B76FF']"&ndash;&gt;-->
<!--&lt;!&ndash;            :style-types="[ 'large&#45;&#45;button']"&ndash;&gt;-->
<!--&lt;!&ndash;            :is-active="true"&ndash;&gt;-->
<!--&lt;!&ndash;            @click="inviteUsers"&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;        </base-button>&ndash;&gt;-->


<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;    </template>&ndash;&gt;-->
<!--&lt;!&ndash;  </base-modal>&ndash;&gt;-->
<!--&lt;!&ndash;</template>&ndash;&gt;-->

<!--&lt;!&ndash;<script>&ndash;&gt;-->
<!--&lt;!&ndash;import BaseModal from './UI/BaseModal';&ndash;&gt;-->
<!--&lt;!&ndash;// import BaseBadge from './BaseBadge';&ndash;&gt;-->
<!--&lt;!&ndash;import BaseButton from './UI/BaseButton';&ndash;&gt;-->
<!--&lt;!&ndash;import RestClient from "../api/restClient";&ndash;&gt;-->
<!--&lt;!&ndash;import DetectMobile from '../utils/detectMobile';&ndash;&gt;-->
<!--&lt;!&ndash;// import ParticipantListElement from "./ParticipantListElement";&ndash;&gt;-->
<!--&lt;!&ndash;import {nextTick} from "vue";&ndash;&gt;-->
<!--&lt;!&ndash;const restClientUser = new RestClient('user')&ndash;&gt;-->
<!--&lt;!&ndash;const restClientGroup = new RestClient('group')&ndash;&gt;-->
<!--&lt;!&ndash;const restClientInvite = new RestClient('invite')&ndash;&gt;-->
<!--&lt;!&ndash;const restClientPrivate = new RestClient('privateRoom')&ndash;&gt;-->
<!--&lt;!&ndash;const restClientUserGroup = new RestClient('userGroup')&ndash;&gt;-->

<!--&lt;!&ndash;export default {&ndash;&gt;-->
<!--&lt;!&ndash;  name: "TheInvitation",&ndash;&gt;-->
<!--&lt;!&ndash;  components:{BaseModal,BaseButton},&ndash;&gt;-->
<!--&lt;!&ndash;  props:['isOpen'],&ndash;&gt;-->
<!--&lt;!&ndash;  inject:['isMobile'],&ndash;&gt;-->
<!--&lt;!&ndash;  data(){&ndash;&gt;-->
<!--&lt;!&ndash;    return {&ndash;&gt;-->
<!--&lt;!&ndash;      isMobile:false,&ndash;&gt;-->
<!--&lt;!&ndash;      scroll:-35,&ndash;&gt;-->
<!--&lt;!&ndash;      focusedIndex: 0,&ndash;&gt;-->
<!--&lt;!&ndash;      isInputFocused: false,&ndash;&gt;-->
<!--&lt;!&ndash;      isClickedToSearchGroup:true,&ndash;&gt;-->
<!--&lt;!&ndash;      isClickedToSearchUser:true,&ndash;&gt;-->
<!--&lt;!&ndash;      groupUser:[],&ndash;&gt;-->
<!--&lt;!&ndash;      linkIsCopied:false,&ndash;&gt;-->
<!--&lt;!&ndash;      invitationURL : '',&ndash;&gt;-->
<!--&lt;!&ndash;      invitedGroups: [],&ndash;&gt;-->
<!--&lt;!&ndash;      invitationText: this.$store.getters.t("invite-text"),&ndash;&gt;-->
<!--&lt;!&ndash;      isUserFound: false,&ndash;&gt;-->
<!--&lt;!&ndash;      groupIsFound: false,&ndash;&gt;-->
<!--&lt;!&ndash;      addedUsers: [],&ndash;&gt;-->
<!--&lt;!&ndash;      addedGroups: [],&ndash;&gt;-->
<!--&lt;!&ndash;      userInput: '',&ndash;&gt;-->
<!--&lt;!&ndash;      groupNameInput: '',&ndash;&gt;-->
<!--&lt;!&ndash;      listOfOrganizationalUsers:[],&ndash;&gt;-->
<!--&lt;!&ndash;      listOfAllUsers: [],&ndash;&gt;-->
<!--&lt;!&ndash;      invitedUserIds:[],&ndash;&gt;-->
<!--&lt;!&ndash;      allUsers: [],&ndash;&gt;-->


<!--&lt;!&ndash;      listOfAllGroups: [],&ndash;&gt;-->

<!--&lt;!&ndash;      userIsShown: false,&ndash;&gt;-->
<!--&lt;!&ndash;      groupIsShown: false,&ndash;&gt;-->
<!--&lt;!&ndash;      userIds:[],&ndash;&gt;-->
<!--&lt;!&ndash;      isUSerInputFocused:false,&ndash;&gt;-->
<!--&lt;!&ndash;      isGroupInputFocused:false,&ndash;&gt;-->
<!--&lt;!&ndash;      invitedUserListTh: ['نام', 'نام خانوادگی', 'تلفن', 'ایمیل', 'حذف'],&ndash;&gt;-->
<!--&lt;!&ndash;      isLinkCopied: false,&ndash;&gt;-->
<!--&lt;!&ndash;    }&ndash;&gt;-->
<!--&lt;!&ndash;  },&ndash;&gt;-->
<!--&lt;!&ndash;  computed:{&ndash;&gt;-->
<!--&lt;!&ndash;    foundUsers() {&ndash;&gt;-->

<!--&lt;!&ndash;      return this.addedUsers&ndash;&gt;-->

<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    numberOfGroups() {&ndash;&gt;-->
<!--&lt;!&ndash;      return this.addedGroups&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    filteredParticipant() {&ndash;&gt;-->
<!--&lt;!&ndash;      return this.listOfOrganizationalUsers.filter((el, idx) => {&ndash;&gt;-->
<!--&lt;!&ndash;        if(this.isMobile){&ndash;&gt;-->
<!--&lt;!&ndash;          return idx < 2&ndash;&gt;-->
<!--&lt;!&ndash;        }else{&ndash;&gt;-->
<!--&lt;!&ndash;          return idx < 5&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->


<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    filteredGroups() {&ndash;&gt;-->
<!--&lt;!&ndash;      return this.invitedGroups.filter((el,idx)=>{&ndash;&gt;-->
<!--&lt;!&ndash;        if(this.isMobile){&ndash;&gt;-->
<!--&lt;!&ndash;          return idx < 2&ndash;&gt;-->
<!--&lt;!&ndash;        }else{&ndash;&gt;-->
<!--&lt;!&ndash;          return idx < 5&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      });&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->

<!--&lt;!&ndash;    numberOfOtherParticipant() {&ndash;&gt;-->

<!--&lt;!&ndash;      if(this.isMobile){&ndash;&gt;-->
<!--&lt;!&ndash;        return this.listOfOrganizationalUsers.length - 2&ndash;&gt;-->
<!--&lt;!&ndash;      }else{&ndash;&gt;-->
<!--&lt;!&ndash;        return this.listOfOrganizationalUsers.length - 5&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    numberOfOtherGroups(){&ndash;&gt;-->
<!--&lt;!&ndash;      if(this.isMobile){&ndash;&gt;-->
<!--&lt;!&ndash;        return this.invitedGroups.length - 2&ndash;&gt;-->
<!--&lt;!&ndash;      }else{&ndash;&gt;-->
<!--&lt;!&ndash;        return this.invitedGroups.length - 5&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    otherUsers() {&ndash;&gt;-->
<!--&lt;!&ndash;      return this.listOfOrganizationalUsers.filter((el, idx) => {&ndash;&gt;-->
<!--&lt;!&ndash;        if(this.isMobile){&ndash;&gt;-->
<!--&lt;!&ndash;          return idx > 1&ndash;&gt;-->
<!--&lt;!&ndash;        }else{&ndash;&gt;-->
<!--&lt;!&ndash;          return idx > 4&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    otherGroups(){&ndash;&gt;-->
<!--&lt;!&ndash;      return this.invitedGroups.filter((el, idx) => {&ndash;&gt;-->
<!--&lt;!&ndash;        if(this.isMobile){&ndash;&gt;-->
<!--&lt;!&ndash;          return idx > 1&ndash;&gt;-->
<!--&lt;!&ndash;        }else{&ndash;&gt;-->
<!--&lt;!&ndash;          return idx > 4&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    }&ndash;&gt;-->
<!--&lt;!&ndash;  },&ndash;&gt;-->
<!--&lt;!&ndash;  watch:{&ndash;&gt;-->
<!--&lt;!&ndash;    // linkIsCopied(val){&ndash;&gt;-->
<!--&lt;!&ndash;    //   if(val === true){&ndash;&gt;-->
<!--&lt;!&ndash;    //     setTimeout(()=>{&ndash;&gt;-->
<!--&lt;!&ndash;    //       this.linkIsCopied = false&ndash;&gt;-->
<!--&lt;!&ndash;    //     },6000)&ndash;&gt;-->
<!--&lt;!&ndash;    //   }&ndash;&gt;-->
<!--&lt;!&ndash;    // },&ndash;&gt;-->
<!--&lt;!&ndash;    isLinkCopied(val) {&ndash;&gt;-->
<!--&lt;!&ndash;      if (val) {&ndash;&gt;-->
<!--&lt;!&ndash;        setTimeout(() => {&ndash;&gt;-->
<!--&lt;!&ndash;          this.toggleCopiedLinkStatus()&ndash;&gt;-->
<!--&lt;!&ndash;        }, 3000)&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->

<!--&lt;!&ndash;  },&ndash;&gt;-->
<!--&lt;!&ndash;  methods:{&ndash;&gt;-->

<!--&lt;!&ndash;    focusedList(index) {&ndash;&gt;-->
<!--&lt;!&ndash;      if (index === this.focusedIndex && this.isInputFocused === false) {&ndash;&gt;-->
<!--&lt;!&ndash;        return "focused";&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;      return "";&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    selectAndMoveAlongUsers(e){&ndash;&gt;-->
<!--&lt;!&ndash;      if (e.key === "ArrowDown") {&ndash;&gt;-->
<!--&lt;!&ndash;        if (this.focusedIndex < this.foundUsers.length - 1) {&ndash;&gt;-->
<!--&lt;!&ndash;          this.$refs.users.scrollTo(0,this.scroll)&ndash;&gt;-->
<!--&lt;!&ndash;          this.focusedIndex++;&ndash;&gt;-->
<!--&lt;!&ndash;          this.scroll +=35&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      } else if (e.key === "ArrowUp") {&ndash;&gt;-->
<!--&lt;!&ndash;        if (this.focusedIndex >= 0) {&ndash;&gt;-->
<!--&lt;!&ndash;          this.focusedIndex&#45;&#45;;&ndash;&gt;-->
<!--&lt;!&ndash;          this.scroll -=35&ndash;&gt;-->
<!--&lt;!&ndash;          this.$refs.users.scrollTo(0,this.scroll)&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      } else if (e.key === "Enter") {&ndash;&gt;-->
<!--&lt;!&ndash;        this.addToListParticipant(this.foundUsers[this.focusedIndex]);&ndash;&gt;-->
<!--&lt;!&ndash;        this.$refs.userInput.focus();&ndash;&gt;-->
<!--&lt;!&ndash;        this.focusedIndex = 0&ndash;&gt;-->
<!--&lt;!&ndash;        this.scroll = -35&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    selectAndMoveAlongGroups(e){&ndash;&gt;-->
<!--&lt;!&ndash;      if (e.key === "ArrowDown") {&ndash;&gt;-->
<!--&lt;!&ndash;        if (this.focusedIndex < this.numberOfGroups.length - 1) {&ndash;&gt;-->
<!--&lt;!&ndash;          this.$refs.groups.scrollTo(0,this.scroll)&ndash;&gt;-->
<!--&lt;!&ndash;          this.focusedIndex++;&ndash;&gt;-->
<!--&lt;!&ndash;          this.scroll +=35&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      } else if (e.key === "ArrowUp") {&ndash;&gt;-->
<!--&lt;!&ndash;        if (this.focusedIndex >= 0) {&ndash;&gt;-->
<!--&lt;!&ndash;          this.focusedIndex&#45;&#45;;&ndash;&gt;-->
<!--&lt;!&ndash;          this.scroll -=35&ndash;&gt;-->
<!--&lt;!&ndash;          this.$refs.groups.scrollTo(0,this.scroll)&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      } else if (e.key === "Enter") {&ndash;&gt;-->
<!--&lt;!&ndash;        this.addGroupToListParticipant(this.numberOfGroups[this.focusedIndex]);&ndash;&gt;-->
<!--&lt;!&ndash;        this.$refs.groupInput.focus();&ndash;&gt;-->
<!--&lt;!&ndash;        this.focusedIndex = 0&ndash;&gt;-->
<!--&lt;!&ndash;        this.scroll = -35&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    clickToSearchUser(){&ndash;&gt;-->
<!--&lt;!&ndash;      this.isClickedToSearchUser = false&ndash;&gt;-->
<!--&lt;!&ndash;      this.userInput = ''&ndash;&gt;-->
<!--&lt;!&ndash;      nextTick(()=>{&ndash;&gt;-->
<!--&lt;!&ndash;        this.$refs.userInput.focus()&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    clickToSearchGroup(){&ndash;&gt;-->

<!--&lt;!&ndash;      this.isClickedToSearchGroup = false&ndash;&gt;-->
<!--&lt;!&ndash;      this.groupNameInput = ''&ndash;&gt;-->
<!--&lt;!&ndash;      nextTick(()=>{&ndash;&gt;-->
<!--&lt;!&ndash;        this.$refs.groupInput.focus()&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    showGroupPlaceHolder(){&ndash;&gt;-->

<!--&lt;!&ndash;      if(this.$refs.groupInput.value === ''){&ndash;&gt;-->
<!--&lt;!&ndash;        this.isClickedToSearchGroup = true&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;      this.isInputFocused = false;&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    showUserPlaceHolder(){&ndash;&gt;-->
<!--&lt;!&ndash;      if(this.$refs.userInput.value === ''){&ndash;&gt;-->
<!--&lt;!&ndash;        this.isClickedToSearchUser = true&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->

<!--&lt;!&ndash;      this.isInputFocused = false;&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    deleteGroupPlaceHolder(){&ndash;&gt;-->
<!--&lt;!&ndash;      this.$refs.groupInput.placeholder = ''&ndash;&gt;-->
<!--&lt;!&ndash;      this.isInputFocused = true;&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    deleteUserPlaceHolder(){&ndash;&gt;-->
<!--&lt;!&ndash;      this.$refs.userInput.placeholder = ''&ndash;&gt;-->
<!--&lt;!&ndash;      this.isInputFocused = true;&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    generatePrivateLink(){&ndash;&gt;-->
<!--&lt;!&ndash;      restClientPrivate.generateLink(this.$store.getters.roomId).then((response)=>{&ndash;&gt;-->
<!--&lt;!&ndash;        this.invitationURL = response;&ndash;&gt;-->
<!--&lt;!&ndash;      }).catch((error)=>{&ndash;&gt;-->
<!--&lt;!&ndash;        console.error(error)&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    generateLink(){&ndash;&gt;-->
<!--&lt;!&ndash;      restClientInvite.generateLink(this.$store.getters.roomId).then((response)=>{&ndash;&gt;-->
<!--&lt;!&ndash;        this.invitationURL = response;&ndash;&gt;-->
<!--&lt;!&ndash;      }).catch((error)=>{&ndash;&gt;-->
<!--&lt;!&ndash;        console.log(error)&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    getAllUsers() {&ndash;&gt;-->
<!--&lt;!&ndash;      restClientUser.getAll().then((users) => {&ndash;&gt;-->
<!--&lt;!&ndash;        this.allUsers = users;&ndash;&gt;-->
<!--&lt;!&ndash;      }).catch(err => {&ndash;&gt;-->
<!--&lt;!&ndash;        console.log(err)&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->

<!--&lt;!&ndash;    getAllGroups() {&ndash;&gt;-->

<!--&lt;!&ndash;      restClientGroup.getAll().then((groups) => {&ndash;&gt;-->
<!--&lt;!&ndash;        for(const el of groups){&ndash;&gt;-->
<!--&lt;!&ndash;          this.listOfAllGroups.push({groupName:el.name,groupId:el.id,users:[]})&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->


<!--&lt;!&ndash;      }).catch(err => {&ndash;&gt;-->
<!--&lt;!&ndash;        console.log(err)&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    getAllPrivateInvited() {&ndash;&gt;-->
<!--&lt;!&ndash;      restClientPrivate.getInvitedPrivate(this.$store.getters.roomId).then((invitedUsers) => {&ndash;&gt;-->
<!--&lt;!&ndash;        console.log(invitedUsers)&ndash;&gt;-->
<!--&lt;!&ndash;        for(const el of invitedUsers){&ndash;&gt;-->
<!--&lt;!&ndash;          this.userIds.push(el.id)&ndash;&gt;-->
<!--&lt;!&ndash;          // this.listOfOrganizationalUsers.push(el)&ndash;&gt;-->
<!--&lt;!&ndash;          this.listOfAllUsers.push(el)&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      }).catch(err => {&ndash;&gt;-->
<!--&lt;!&ndash;        console.log(err)&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->

<!--&lt;!&ndash;    getAllInvited() {&ndash;&gt;-->
<!--&lt;!&ndash;      restClientInvite.getInvitedPublic(this.$store.getters.roomId).then((invitedUsers) => {&ndash;&gt;-->
<!--&lt;!&ndash;        for(const el of invitedUsers){&ndash;&gt;-->
<!--&lt;!&ndash;          this.userIds.push(el.id)&ndash;&gt;-->
<!--&lt;!&ndash;          // this.listOfOrganizationalUsers.push(el)&ndash;&gt;-->
<!--&lt;!&ndash;          this.listOfAllUsers.push(el)&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      }).catch(err => {&ndash;&gt;-->
<!--&lt;!&ndash;        console.log(err)&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->


<!--&lt;!&ndash;    modifyNewInvitedUsers() {&ndash;&gt;-->
<!--&lt;!&ndash;      restClientInvite.modifyUserOfPublicRoom(this.$store.getters.roomId, [] , this.userIds).then(() => {&ndash;&gt;-->
<!--&lt;!&ndash;      }).catch(err => {&ndash;&gt;-->
<!--&lt;!&ndash;        console.log(err)&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    modifyNewInvitedUsersPrivateRoom() {&ndash;&gt;-->
<!--&lt;!&ndash;      restClientPrivate.modifyUserOfPrivateRoom(this.$store.getters.roomId,  this.invitationURL , this.userIds).then(() => {&ndash;&gt;-->
<!--&lt;!&ndash;      }).catch(err => {&ndash;&gt;-->
<!--&lt;!&ndash;        console.log(err)&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    getAllUsersByGroupId(id){&ndash;&gt;-->
<!--&lt;!&ndash;      restClientUserGroup.getAllUsersByGroupId(id).then(response=>{&ndash;&gt;-->
<!--&lt;!&ndash;        // this.addGroupToListParticipant(id);&ndash;&gt;-->
<!--&lt;!&ndash;        const index = this.listOfAllGroups.findIndex((el)=>{&ndash;&gt;-->
<!--&lt;!&ndash;          return  el.groupId ===id&ndash;&gt;-->
<!--&lt;!&ndash;        })&ndash;&gt;-->

<!--&lt;!&ndash;        if(this.listOfAllGroups[index].users.length === 0){&ndash;&gt;-->
<!--&lt;!&ndash;          for(let element of response){&ndash;&gt;-->
<!--&lt;!&ndash;            this.listOfAllGroups[index].users.push(element)&ndash;&gt;-->
<!--&lt;!&ndash;          }&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;        const idx = this.invitedGroups.findIndex((el)=>{&ndash;&gt;-->
<!--&lt;!&ndash;          return el.groupName === this.listOfAllGroups[index].groupName&ndash;&gt;-->
<!--&lt;!&ndash;        })&ndash;&gt;-->
<!--&lt;!&ndash;        if(idx === -1){&ndash;&gt;-->
<!--&lt;!&ndash;          this.invitedGroups.push(this.listOfAllGroups[index])&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;        const groupUsers = this.listOfAllGroups[index].users;&ndash;&gt;-->
<!--&lt;!&ndash;        for (let el of groupUsers) {&ndash;&gt;-->

<!--&lt;!&ndash;          const index = this.listOfAllUsers.findIndex((element) => {&ndash;&gt;-->
<!--&lt;!&ndash;            return element.firstName + element.lastName === el.firstName + el.lastName&ndash;&gt;-->
<!--&lt;!&ndash;          })&ndash;&gt;-->
<!--&lt;!&ndash;          if (index === -1) {&ndash;&gt;-->
<!--&lt;!&ndash;            this.listOfAllUsers.push(el);&ndash;&gt;-->
<!--&lt;!&ndash;            this.userIds.push(el.id)&ndash;&gt;-->
<!--&lt;!&ndash;          }&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      }).catch(error=>{&ndash;&gt;-->
<!--&lt;!&ndash;        console.log(error)&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    inviteUsers(){&ndash;&gt;-->
<!--&lt;!&ndash;      if (this.$store.getters.isPrivateUser !== 'isPrivateUser'){&ndash;&gt;-->
<!--&lt;!&ndash;        this.modifyNewInvitedUsers();&ndash;&gt;-->
<!--&lt;!&ndash;      }else {&ndash;&gt;-->
<!--&lt;!&ndash;        this.modifyNewInvitedUsersPrivateRoom()&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->

<!--&lt;!&ndash;      this.$emit('close-invitation-component')&ndash;&gt;-->
<!--&lt;!&ndash;      this.eventBus.emit('invited-users',this.listOfAllUsers)&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    closeBadge(participant) {&ndash;&gt;-->

<!--&lt;!&ndash;      const indexOfAllUsers = this.listOfAllUsers.findIndex((el) => {&ndash;&gt;-->
<!--&lt;!&ndash;        return el.firstName + el.lastName === participant.firstName + participant.lastName&ndash;&gt;-->
<!--&lt;!&ndash;      });&ndash;&gt;-->
<!--&lt;!&ndash;      const indexOfOrganizationalUsers = this.listOfOrganizationalUsers.findIndex((el) => {&ndash;&gt;-->
<!--&lt;!&ndash;        return el.firstName + el.lastName === participant.firstName + participant.lastName&ndash;&gt;-->
<!--&lt;!&ndash;      });&ndash;&gt;-->
<!--&lt;!&ndash;      if(indexOfAllUsers!==-1 && indexOfOrganizationalUsers !==-1 ){&ndash;&gt;-->
<!--&lt;!&ndash;        this.listOfOrganizationalUsers.splice(indexOfOrganizationalUsers,1)&ndash;&gt;-->
<!--&lt;!&ndash;        this.listOfAllUsers.splice(indexOfAllUsers, 1);&ndash;&gt;-->
<!--&lt;!&ndash;        this.userIds.splice(indexOfAllUsers, 1);&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    closeBadgeGroup(group) {&ndash;&gt;-->
<!--&lt;!&ndash;      const idx = this.invitedGroups.findIndex((el) => {&ndash;&gt;-->
<!--&lt;!&ndash;        return el.groupName === group.groupName&ndash;&gt;-->
<!--&lt;!&ndash;      });&ndash;&gt;-->
<!--&lt;!&ndash;      if (idx !== -1) {&ndash;&gt;-->
<!--&lt;!&ndash;        for (let el of this.invitedGroups[idx].users) {&ndash;&gt;-->
<!--&lt;!&ndash;          let index = this.listOfAllUsers.findIndex((element) => {&ndash;&gt;-->
<!--&lt;!&ndash;            return element.firstName + element.lastName === el.firstName + el.lastName&ndash;&gt;-->
<!--&lt;!&ndash;          })&ndash;&gt;-->
<!--&lt;!&ndash;          if(index !==-1){&ndash;&gt;-->
<!--&lt;!&ndash;            this.listOfAllUsers.splice(index, 1);&ndash;&gt;-->
<!--&lt;!&ndash;            this.userIds.splice(index, 1);&ndash;&gt;-->
<!--&lt;!&ndash;          }&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;        this.invitedGroups.splice(idx, 1);&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    addToListParticipant(person) {&ndash;&gt;-->
<!--&lt;!&ndash;      this.isUserFound = false&ndash;&gt;-->
<!--&lt;!&ndash;      let idx = this.listOfAllUsers.findIndex((el) => {&ndash;&gt;-->
<!--&lt;!&ndash;        return el.name + el.lastName === person.name + person.lastName&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->
<!--&lt;!&ndash;      if (idx === -1) {&ndash;&gt;-->
<!--&lt;!&ndash;        this.listOfOrganizationalUsers.push(person);&ndash;&gt;-->
<!--&lt;!&ndash;        this.listOfAllUsers.push(person);&ndash;&gt;-->
<!--&lt;!&ndash;        this.userIds.push(person.id);&ndash;&gt;-->
<!--&lt;!&ndash;        this.invitedUserIds.push(person.id)&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    addGroupToListParticipant(group) {&ndash;&gt;-->
<!--&lt;!&ndash;      this.getAllUsersByGroupId(group.groupId);&ndash;&gt;-->
<!--&lt;!&ndash;      this.groupIsFound = false;&ndash;&gt;-->
<!--&lt;!&ndash;      this.groupNameInput = ''&ndash;&gt;-->
<!--&lt;!&ndash;      this.addedGroups = []&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    // deleteUser(e){&ndash;&gt;-->
<!--&lt;!&ndash;    //   if(e.keyCode=== 8 ){&ndash;&gt;-->
<!--&lt;!&ndash;    //     if(this.userInput === '' && this.listOfOrganizationalUsers.length > 0){&ndash;&gt;-->
<!--&lt;!&ndash;    //       this.listOfAllUsers.pop();&ndash;&gt;-->
<!--&lt;!&ndash;    //       this.userIds.pop()&ndash;&gt;-->
<!--&lt;!&ndash;    //       this.listOfOrganizationalUsers.pop()&ndash;&gt;-->
<!--&lt;!&ndash;    //     }&ndash;&gt;-->
<!--&lt;!&ndash;    //   }&ndash;&gt;-->
<!--&lt;!&ndash;    //   if (e.key === "ArrowDown") {&ndash;&gt;-->
<!--&lt;!&ndash;    //     if (this.isInputFocused) {&ndash;&gt;-->
<!--&lt;!&ndash;    //       nextTick(() => {&ndash;&gt;-->
<!--&lt;!&ndash;    //         this.$refs.users.focus();&ndash;&gt;-->
<!--&lt;!&ndash;    //       });&ndash;&gt;-->
<!--&lt;!&ndash;    //     }&ndash;&gt;-->
<!--&lt;!&ndash;    //   }&ndash;&gt;-->
<!--&lt;!&ndash;    // },&ndash;&gt;-->
<!--&lt;!&ndash;    search() {&ndash;&gt;-->
<!--&lt;!&ndash;      const inpValue = this.userInput;&ndash;&gt;-->
<!--&lt;!&ndash;      if (this.userInput === '') {&ndash;&gt;-->
<!--&lt;!&ndash;        this.isUserFound = false;&ndash;&gt;-->


<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;      this.addedUsers = this.allUsers.filter((el) => {&ndash;&gt;-->
<!--&lt;!&ndash;        if (((el.firstName + ' ' + el.lastName).includes(inpValue) || (el.username.includes(inpValue))) && inpValue.length !== 0) {&ndash;&gt;-->
<!--&lt;!&ndash;          return true&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->


<!--&lt;!&ndash;      if (this.foundUsers.length > 0) {&ndash;&gt;-->
<!--&lt;!&ndash;        this.isUserFound = true;&ndash;&gt;-->
<!--&lt;!&ndash;      }else{&ndash;&gt;-->
<!--&lt;!&ndash;        this.isUserFound = false;&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;      this.groupIsFound = false&ndash;&gt;-->
<!--&lt;!&ndash;      this.groupNameInput = ''&ndash;&gt;-->

<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    deleteGroup(e){&ndash;&gt;-->
<!--&lt;!&ndash;      if(this.groupNameInput === '') {&ndash;&gt;-->
<!--&lt;!&ndash;        if (e.keyCode === 8) {&ndash;&gt;-->
<!--&lt;!&ndash;          const idx = this.invitedGroups.length - 1;&ndash;&gt;-->
<!--&lt;!&ndash;          for (let el of this.invitedGroups[idx].users) {&ndash;&gt;-->
<!--&lt;!&ndash;            let index = this.listOfAllUsers.findIndex((element) => {&ndash;&gt;-->
<!--&lt;!&ndash;              return element.firstName + element.lastName === el.firstName + el.lastName&ndash;&gt;-->
<!--&lt;!&ndash;            })&ndash;&gt;-->
<!--&lt;!&ndash;            if (index !== -1) {&ndash;&gt;-->
<!--&lt;!&ndash;              this.invitedGroups.splice(idx, 1);&ndash;&gt;-->
<!--&lt;!&ndash;              this.listOfAllUsers.splice(index, 1);&ndash;&gt;-->
<!--&lt;!&ndash;              this.userIds.splice(index, 1);&ndash;&gt;-->

<!--&lt;!&ndash;            }&ndash;&gt;-->


<!--&lt;!&ndash;          }&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;      if (e.key === "ArrowDown") {&ndash;&gt;-->


<!--&lt;!&ndash;        if (this.isInputFocused) {&ndash;&gt;-->

<!--&lt;!&ndash;          nextTick(() => {&ndash;&gt;-->
<!--&lt;!&ndash;            this.focusedIndex=0&ndash;&gt;-->
<!--&lt;!&ndash;            this.$refs.groups.focus();&ndash;&gt;-->

<!--&lt;!&ndash;          });&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    searchGroupName() {&ndash;&gt;-->
<!--&lt;!&ndash;      const inpValue = this.groupNameInput;&ndash;&gt;-->
<!--&lt;!&ndash;      if (this.groupNameInput === '') {&ndash;&gt;-->
<!--&lt;!&ndash;        this.groupIsFound = false;&ndash;&gt;-->


<!--&lt;!&ndash;      }&ndash;&gt;-->

<!--&lt;!&ndash;      this.addedGroups = this.listOfAllGroups.filter((el) => {&ndash;&gt;-->
<!--&lt;!&ndash;        if (el.groupName.includes(inpValue) && inpValue.length !== 0) {&ndash;&gt;-->
<!--&lt;!&ndash;          return true&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->


<!--&lt;!&ndash;      if (this.numberOfGroups.length > 0) {&ndash;&gt;-->
<!--&lt;!&ndash;        this.groupIsFound = true;&ndash;&gt;-->
<!--&lt;!&ndash;      }else{&ndash;&gt;-->
<!--&lt;!&ndash;        this.groupIsFound = false;&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;      this.isUserFound = false&ndash;&gt;-->
<!--&lt;!&ndash;      this.userInput = ''&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    closeList(participant) {&ndash;&gt;-->
<!--&lt;!&ndash;      const idx = this.listOfAllUsers.findIndex((el) => {&ndash;&gt;-->
<!--&lt;!&ndash;        return el.firstName === participant.firstName&ndash;&gt;-->
<!--&lt;!&ndash;      });&ndash;&gt;-->
<!--&lt;!&ndash;      if(idx !== -1){&ndash;&gt;-->
<!--&lt;!&ndash;        this.listOfAllUsers.splice(idx, 1);&ndash;&gt;-->
<!--&lt;!&ndash;        this.userIds.splice(idx, 1);&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;      const index = this.listOfOrganizationalUsers.findIndex((el) => {&ndash;&gt;-->
<!--&lt;!&ndash;        return el.firstName === participant.firstName&ndash;&gt;-->
<!--&lt;!&ndash;      });&ndash;&gt;-->
<!--&lt;!&ndash;      if(index !== -1){&ndash;&gt;-->
<!--&lt;!&ndash;        this.listOfOrganizationalUsers.splice(index, 1);&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    closeInvitationModal() {&ndash;&gt;-->
<!--&lt;!&ndash;      this.$emit('close-invitatoin')&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    showParticipants() {&ndash;&gt;-->
<!--&lt;!&ndash;      this.userIsShown = !this.userIsShown&ndash;&gt;-->

<!--&lt;!&ndash;      this.groupIsShown = false&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    showGroupOfParticipants() {&ndash;&gt;-->
<!--&lt;!&ndash;      this.groupIsShown = !this.groupIsShown&ndash;&gt;-->
<!--&lt;!&ndash;      this.userIsShown = false&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    copyToClipboard(){&ndash;&gt;-->
<!--&lt;!&ndash;      console.error()&ndash;&gt;-->
<!--&lt;!&ndash;      this.$refs.linkURL.select();&ndash;&gt;-->
<!--&lt;!&ndash;      this.$refs.linkURL.setSelectionRange(0, 99999);&ndash;&gt;-->
<!--&lt;!&ndash;      navigator.clipboard.writeText(this.invitationURL);&ndash;&gt;-->
<!--&lt;!&ndash;      nextTick(() => {&ndash;&gt;-->
<!--&lt;!&ndash;        this.isLinkCopied = true&ndash;&gt;-->
<!--&lt;!&ndash;      })&ndash;&gt;-->

<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    toggleCopiedLinkStatus() {&ndash;&gt;-->
<!--&lt;!&ndash;      this.isLinkCopied = false&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    deleteUSer(participant) {&ndash;&gt;-->

<!--&lt;!&ndash;      const indexOfAllUsers = this.listOfAllUsers.findIndex((el) => {&ndash;&gt;-->
<!--&lt;!&ndash;        return el.firstName + el.lastName === participant.firstName + participant.lastName&ndash;&gt;-->
<!--&lt;!&ndash;      });&ndash;&gt;-->

<!--&lt;!&ndash;      if(indexOfAllUsers!==-1){&ndash;&gt;-->
<!--&lt;!&ndash;        this.listOfAllUsers.splice(indexOfAllUsers, 1);&ndash;&gt;-->
<!--&lt;!&ndash;        this.userIds.splice(indexOfAllUsers, 1);&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;  },&ndash;&gt;-->
<!--&lt;!&ndash;  created() {&ndash;&gt;-->
<!--&lt;!&ndash;    const mobileDetector = new DetectMobile();&ndash;&gt;-->
<!--&lt;!&ndash;    this.isMobile = mobileDetector.isMobile();&ndash;&gt;-->
<!--&lt;!&ndash;  },&ndash;&gt;-->
<!--&lt;!&ndash;  mounted(){&ndash;&gt;-->

<!--&lt;!&ndash;    if (this.$store.getters.isPrivateUser !== 'isPrivateUser'){&ndash;&gt;-->
<!--&lt;!&ndash;      this.getAllInvited();&ndash;&gt;-->
<!--&lt;!&ndash;      this.generateLink()&ndash;&gt;-->
<!--&lt;!&ndash;    }else{&ndash;&gt;-->
<!--&lt;!&ndash;      this.getAllPrivateInvited()&ndash;&gt;-->
<!--&lt;!&ndash;      this.generatePrivateLink()&ndash;&gt;-->
<!--&lt;!&ndash;    }&ndash;&gt;-->
<!--&lt;!&ndash;    this.getAllUsers();&ndash;&gt;-->

<!--&lt;!&ndash;    this.getAllGroups();&ndash;&gt;-->


<!--&lt;!&ndash;  },&ndash;&gt;-->


<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;</script>&ndash;&gt;-->

<!--&lt;!&ndash;<style scoped>&ndash;&gt;-->
<!--&lt;!&ndash;.close-device-test-model{&ndash;&gt;-->
<!--&lt;!&ndash;  cursor: pointer;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.invitation-enter-active{&ndash;&gt;-->
<!--&lt;!&ndash;  animation: fade .3s ease-out&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.invitation-leave-active{&ndash;&gt;-->
<!--&lt;!&ndash;  animation: fade .3s ease-in reverse;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;@keyframes fade {&ndash;&gt;-->
<!--&lt;!&ndash;  from{&ndash;&gt;-->
<!--&lt;!&ndash;    opacity: 0;&ndash;&gt;-->
<!--&lt;!&ndash;    transform: translate(50%,-50%) scale(0.7,0.7);&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  to{&ndash;&gt;-->
<!--&lt;!&ndash;    opacity: 1;&ndash;&gt;-->
<!--&lt;!&ndash;    transform: translate(50%,-50%);&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.search__user&#45;&#45;text-rtl{&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  color: grey;&ndash;&gt;-->
<!--&lt;!&ndash;  width: auto;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  position: absolute;&ndash;&gt;-->
<!--&lt;!&ndash;  top: 0.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  right: 0;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.search__user&#45;&#45;text-ltr{&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  color: grey;&ndash;&gt;-->
<!--&lt;!&ndash;  width: auto;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  position: absolute;&ndash;&gt;-->
<!--&lt;!&ndash;  top: 0.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  left: 0;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.header-container&#45;&#45;guest&#45;&#45;invitation {&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: space-between;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 4rem;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 75rem;&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;h2 {&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.body-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;  gap: 1.6rem;&ndash;&gt;-->
<!--&lt;!&ndash;  max-height: 48rem;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 75rem;&ndash;&gt;-->
<!--&lt;!&ndash;  overflow-y: auto;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.user-list__container {&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: space-between;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 10rem;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.user-list-rtl {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 42%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row;&ndash;&gt;-->
<!--&lt;!&ndash;  /*justify-content: space-between;*/&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.user-list-ltr {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 42%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row-reverse;&ndash;&gt;-->
<!--&lt;!&ndash;  /*justify-content: space-between;*/&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->


<!--&lt;!&ndash;.user-list-rtl > span {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 15%;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.user-list-ltr > span {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 20%;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.user-list-rtl > div {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 85%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row-reverse;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: space-between;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  border: solid 0.1rem #707070;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.user-list-ltr > div {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 85%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row-reverse;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: space-between;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  border: solid 0.1rem #707070;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.user-list__participant {&ndash;&gt;-->
<!--&lt;!&ndash;  max-width: 90%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  padding-right: 0.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.search__user {&ndash;&gt;-->
<!--&lt;!&ndash;  margin: 0 0 0 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 80%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 2.6rem;&ndash;&gt;-->
<!--&lt;!&ndash;  border: solid 0.1rem transparent;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.search__user::placeholder{&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 0.9rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.search__user:focus {&ndash;&gt;-->
<!--&lt;!&ndash;  outline: none;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.badge-list__participant {&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  max-width: 39rem;&ndash;&gt;-->
<!--&lt;!&ndash;  padding-top: 0.3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  padding-bottom: 0.3rem;&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.badge-list__others {&ndash;&gt;-->
<!--&lt;!&ndash;  color: #1a73e8;&ndash;&gt;-->
<!--&lt;!&ndash;  border: solid .1rem #dadce0;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1.1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 2.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 4rem;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: center;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  font-weight: bold;&ndash;&gt;-->
<!--&lt;!&ndash;  position: relative;&ndash;&gt;-->
<!--&lt;!&ndash;  cursor: pointer;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.participants__more {&ndash;&gt;-->
<!--&lt;!&ndash;  position: absolute;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 12rem;&ndash;&gt;-->
<!--&lt;!&ndash;  max-height: 10rem;&ndash;&gt;-->
<!--&lt;!&ndash;  border: solid .1rem lightgray;&ndash;&gt;-->
<!--&lt;!&ndash;  z-index: 100;&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: white;&ndash;&gt;-->
<!--&lt;!&ndash;  overflow-y: auto;&ndash;&gt;-->
<!--&lt;!&ndash;  /*left: -3rem;*&ndash;&gt;-->
<!--&lt;!&ndash;   */&ndash;&gt;-->
<!--&lt;!&ndash;  top: 2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  left: -4rem;&ndash;&gt;-->
<!--&lt;!&ndash;  direction: ltr;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.participants__more li:first-child {&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1rem 1rem 0 0;&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.participants__more li:last-child {&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 0 0 1rem 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  border: 0.1rem solid transparent;&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.participant {&ndash;&gt;-->
<!--&lt;!&ndash;  position: relative;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  border-bottom: .1rem solid rgb(204, 198, 198);&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;  padding-right: 0.6rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.participant:hover {&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: rgb(235, 235, 245);&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.guest__list-container {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 73%;&ndash;&gt;-->
<!--&lt;!&ndash;  /*display: flex;*/&ndash;&gt;-->
<!--&lt;!&ndash;  margin-top: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  /*flex-direction: column;*/&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.guest__list-container > span {&ndash;&gt;-->
<!--&lt;!&ndash;  height: 10%;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.table-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 20.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;  margin-top: 0.7rem;&ndash;&gt;-->


<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.table__header&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: space-between;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 3.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  background-color:#95d1cc;&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.table__header&#45;&#45;guest > span {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 23%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: center;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  color: white;&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.ul-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;  max-height: 16.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  overflow-y: auto;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.ul-container&#45;&#45;guest ul {&ndash;&gt;-->
<!--&lt;!&ndash;  padding: 0;&ndash;&gt;-->
<!--&lt;!&ndash;  margin: 0;&ndash;&gt;-->
<!--&lt;!&ndash;  list-style: none;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: center;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;::-webkit-scrollbar {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 5px;&ndash;&gt;-->


<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;::-webkit-scrollbar-track {&ndash;&gt;-->
<!--&lt;!&ndash;  background: transparent;&ndash;&gt;-->


<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;::-webkit-scrollbar-thumb {&ndash;&gt;-->
<!--&lt;!&ndash;  background: #7A7A7A;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 12px;&ndash;&gt;-->


<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;::-webkit-scrollbar-track-piece {&ndash;&gt;-->
<!--&lt;!&ndash;  height: 20px;&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invitation__text-container {&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: space-between;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 18rem;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  margin-top: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  margin-bottom: 2rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invitation__text-rtl {&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 65%;&ndash;&gt;-->
<!--&lt;!&ndash;  position: relative;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.invitation__text-ltr {&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: flex-end;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 65%;&ndash;&gt;-->
<!--&lt;!&ndash;  position: relative;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invitation__text-rtl textarea {&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 89%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  overflow-y: auto;&ndash;&gt;-->
<!--&lt;!&ndash;  padding-left: 0.7rem;&ndash;&gt;-->
<!--&lt;!&ndash;  padding-right: 0.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;  resize: none;&ndash;&gt;-->
<!--&lt;!&ndash;  border: 0.1rem solid #707070;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  margin-top: 1.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  margin-bottom: .5rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.invitation__text-ltr textarea {&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 89%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  overflow-y: auto;&ndash;&gt;-->
<!--&lt;!&ndash;  padding-left: 0.7rem;&ndash;&gt;-->
<!--&lt;!&ndash;  padding-right: 0.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  direction: ltr;&ndash;&gt;-->
<!--&lt;!&ndash;  resize: none;&ndash;&gt;-->
<!--&lt;!&ndash;  border: 0.1rem solid #707070;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  margin-top: 1.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  margin-bottom: .5rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invitation__text textarea::placeholder {&ndash;&gt;-->
<!--&lt;!&ndash;  color: rgba(0, 0, 0, 0.8);&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invitation__text textarea:focus {&ndash;&gt;-->
<!--&lt;!&ndash;  outline: none;&ndash;&gt;-->

<!--&lt;!&ndash;  box-shadow: 0 .2rem .8rem rgba(0, 0, 0, .26);&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invitation__link-container-rtl {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: space-between;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 35%;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.invitation__link-container-ltr {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row-reverse;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: space-between;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 35%;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invitation__link {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 89%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invitation__link input {&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  padding-left: 0.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  padding-right: 0.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  direction: ltr;&ndash;&gt;-->
<!--&lt;!&ndash;  border: solid 0.1rem #c2c2c2;&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: #f1f1f1;&ndash;&gt;-->
<!--&lt;!&ndash;  color: #6e6e6e;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.icon-container {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 3.6rem;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 3.6rem;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 50%;&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: #95d1cc;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: center;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.button-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;  height: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 52rem;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: center;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.copy-icon {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 45%;&ndash;&gt;-->
<!--&lt;!&ndash;  cursor: pointer;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.copied-link {&ndash;&gt;-->
<!--&lt;!&ndash;  margin-top: 0.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  color: #08aa3e;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 89%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: center;&ndash;&gt;-->
<!--&lt;!&ndash;  /*animation-name: copiedText;*/&ndash;&gt;-->
<!--&lt;!&ndash;  /*animation-duration: 6s;*/&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;@keyframes copiedText {&ndash;&gt;-->
<!--&lt;!&ndash;  from {transform: translateY(-1rem);&ndash;&gt;-->
<!--&lt;!&ndash;    display: none;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  to {transform: translateY(0);&ndash;&gt;-->
<!--&lt;!&ndash;    display: block;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  0%   {transform: translateY(-1.5rem);&ndash;&gt;-->
<!--&lt;!&ndash;    opacity: 0;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  25%  {transform: translateY(0);&ndash;&gt;-->
<!--&lt;!&ndash;    opacity: 100%}&ndash;&gt;-->
<!--&lt;!&ndash;  50%  {transform: translateY(0);&ndash;&gt;-->
<!--&lt;!&ndash;    opacity: 100%}&ndash;&gt;-->
<!--&lt;!&ndash;  75%  {transform: translateY(0);&ndash;&gt;-->
<!--&lt;!&ndash;    opacity: 100%}&ndash;&gt;-->
<!--&lt;!&ndash;  100% {transform: translateY(-1.5rem);&ndash;&gt;-->
<!--&lt;!&ndash;    opacity: 0}&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.hidden-badge {&ndash;&gt;-->
<!--&lt;!&ndash;  transform: rotate(45deg);&ndash;&gt;-->
<!--&lt;!&ndash;  width: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.2rem;&ndash;&gt;-->

<!--&lt;!&ndash;  background-color: transparent;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: center;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  position: absolute;&ndash;&gt;-->
<!--&lt;!&ndash;  left: 0.7rem;&ndash;&gt;-->
<!--&lt;!&ndash;  cursor: pointer;&ndash;&gt;-->
<!--&lt;!&ndash;  color: black;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 50%;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.hidden-badge:hover {&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: #95d1cc;&ndash;&gt;-->
<!--&lt;!&ndash;  color: white;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.search__user-container {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 7rem;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: space-between;&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.search__user-container&#45;&#45;element{&ndash;&gt;-->
<!--&lt;!&ndash;  width: 45%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 7rem;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;  gap: 0.8rem;&ndash;&gt;-->
<!--&lt;!&ndash;  position: relative;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.found-container {&ndash;&gt;-->
<!--&lt;!&ndash;  position: relative;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.founded__users {&ndash;&gt;-->
<!--&lt;!&ndash;  position: absolute;&ndash;&gt;-->
<!--&lt;!&ndash;  right: 0;&ndash;&gt;-->
<!--&lt;!&ndash;  top: 2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  z-index: 100;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 15rem;&ndash;&gt;-->
<!--&lt;!&ndash;  max-height: 17.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  border: solid .1rem lightgray;&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: white;&ndash;&gt;-->
<!--&lt;!&ndash;  overflow-y: auto;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;ul:focus{&ndash;&gt;-->
<!--&lt;!&ndash;  outline: none;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.found__persons {&ndash;&gt;-->

<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->

<!--&lt;!&ndash;  padding: 0;&ndash;&gt;-->

<!--&lt;!&ndash;  /*left: -3rem;*&ndash;&gt;-->
<!--&lt;!&ndash;   */&ndash;&gt;-->

<!--&lt;!&ndash;  direction: ltr;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.founded__users-list {&ndash;&gt;-->
<!--&lt;!&ndash;  position: relative;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->

<!--&lt;!&ndash;  border-bottom: .1rem solid rgb(204, 198, 198);&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 3.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  padding-right: 0.6rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.founded__users-list > p {&ndash;&gt;-->
<!--&lt;!&ndash;  max-width: 14rem;&ndash;&gt;-->
<!--&lt;!&ndash;  white-space: nowrap;&ndash;&gt;-->
<!--&lt;!&ndash;  overflow: hidden;&ndash;&gt;-->
<!--&lt;!&ndash;  text-overflow: ellipsis;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.founded__users-list:hover {&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: rgb(226, 226, 229);&ndash;&gt;-->
<!--&lt;!&ndash;  cursor: pointer;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.focused {&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: rgb(226, 226, 229);&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.URL__generation:focus {&ndash;&gt;-->
<!--&lt;!&ndash;  outline: none;&ndash;&gt;-->
<!--&lt;!&ndash;  color: #171616;&ndash;&gt;-->
<!--&lt;!&ndash;  box-shadow: 0 .2rem .8rem rgba(0, 0, 0, .26);&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.user-input__search {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: #F6F6F7;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 3.4rem;&ndash;&gt;-->
<!--&lt;!&ndash;  font-weight: 400;&ndash;&gt;-->
<!--&lt;!&ndash;  -webkit-appearance: none;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 0.8rem;&ndash;&gt;-->
<!--&lt;!&ndash;  border: 0.1rem solid #eaeaea;&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;  padding: 0 0.8rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.user-input__search:focus {&ndash;&gt;-->
<!--&lt;!&ndash;  outline: 0;&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: transparent;&ndash;&gt;-->
<!--&lt;!&ndash;  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.found-users&#45;&#45;container {&ndash;&gt;-->
<!--&lt;!&ndash;  position: absolute;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  max-height: 21rem;&ndash;&gt;-->
<!--&lt;!&ndash;  top: 6rem;&ndash;&gt;-->
<!--&lt;!&ndash;  overflow-y: scroll;&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;  border: 0.1rem solid #F6F6F7;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);&ndash;&gt;-->
<!--&lt;!&ndash;  z-index: 10;&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: white;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.found-user&#45;&#45;list {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  padding: 0.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  cursor: pointer;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  font-weight: 400;&ndash;&gt;-->
<!--&lt;!&ndash;  color: #75758F;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.found-user&#45;&#45;list:hover {&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: #F2F2F2;&ndash;&gt;-->
<!--&lt;!&ndash;  border: 0.1rem solid transparent;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 0.8rem;&ndash;&gt;-->

<!--&lt;!&ndash;}&ndash;&gt;-->


<!--&lt;!&ndash;.invite-user-table__th {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: center;&ndash;&gt;-->
<!--&lt;!&ndash;  padding: 1.6rem;&ndash;&gt;-->
<!--&lt;!&ndash;  min-width: 75rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invite-user-table__th > span {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 23%;&ndash;&gt;-->
<!--&lt;!&ndash;  text-align: right;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.4rem;&ndash;&gt;-->
<!--&lt;!&ndash;  font-weight: 700;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invite-user-table__th > span:last-child {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 5%;&ndash;&gt;-->
<!--&lt;!&ndash;  min-width: 4rem;&ndash;&gt;-->
<!--&lt;!&ndash;  text-align: right;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.4rem;&ndash;&gt;-->
<!--&lt;!&ndash;  font-weight: 700;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: flex-start;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->


<!--&lt;!&ndash;.invite-user-table__Ul {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;  padding: 0;&ndash;&gt;-->
<!--&lt;!&ndash;  margin: 0;&ndash;&gt;-->
<!--&lt;!&ndash;  overflow-y: auto;&ndash;&gt;-->
<!--&lt;!&ndash;  min-width: 75rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->


<!--&lt;!&ndash;.invite-user-table__list {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row;&ndash;&gt;-->
<!--&lt;!&ndash;  padding: 1.6rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invite-user-table__list:nth-child(odd) {&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: #F6F6F7;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invite-user-table__list > div {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 23%;&ndash;&gt;-->
<!--&lt;!&ndash;  text-align: right;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.4rem;&ndash;&gt;-->
<!--&lt;!&ndash;  font-weight: 400;&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.invite-user-table__list > div:last-child {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 5%;&ndash;&gt;-->
<!--&lt;!&ndash;  text-align: right;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.4rem;&ndash;&gt;-->
<!--&lt;!&ndash;  font-weight: 400;&ndash;&gt;-->
<!--&lt;!&ndash;  direction: rtl;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.invite-user-table__list > div > span{&ndash;&gt;-->
<!--&lt;!&ndash;  display: block;&ndash;&gt;-->
<!--&lt;!&ndash;  max-width: 95%;&ndash;&gt;-->
<!--&lt;!&ndash;  white-space: nowrap;&ndash;&gt;-->
<!--&lt;!&ndash;  overflow: hidden;&ndash;&gt;-->
<!--&lt;!&ndash;  text-overflow: ellipsis;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.invite__text&#45;&#45;container{&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 9rem;&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;  gap: 0.8rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.invite__text&#45;&#45;container > div {&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 6.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  border: 0.1rem solid #DCDADA;&ndash;&gt;-->
<!--&lt;!&ndash;  border-radius: 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;  color: #75758F;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  font-weight: 400;&ndash;&gt;-->
<!--&lt;!&ndash;  padding: 0.8rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.invite__text&#45;&#45;container > span {&ndash;&gt;-->
<!--&lt;!&ndash;color: #75758F;&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;  font-weight: 400;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.invite__text&#45;&#45;container__link {&ndash;&gt;-->
<!--&lt;!&ndash;  display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;  flex-direction: row;&ndash;&gt;-->
<!--&lt;!&ndash;  align-items: flex-end;&ndash;&gt;-->
<!--&lt;!&ndash;  justify-content: space-between;&ndash;&gt;-->
<!--&lt;!&ndash;  height: 5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  background-color: #F6F6F7;&ndash;&gt;-->
<!--&lt;!&ndash;  padding: 1.6rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.invite__text&#45;&#45;container__link&#45;&#45;input {&ndash;&gt;-->
<!--&lt;!&ndash;  font-size: 1.4rem;&ndash;&gt;-->
<!--&lt;!&ndash;width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  border: none;&ndash;&gt;-->
<!--&lt;!&ndash;  padding: 0 0 0 1rem;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;.fade-image {&ndash;&gt;-->
<!--&lt;!&ndash;  animation: fadeIn 1s;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;@keyframes fadeIn {&ndash;&gt;-->
<!--&lt;!&ndash;  0% {&ndash;&gt;-->
<!--&lt;!&ndash;    opacity: 0;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  100% {&ndash;&gt;-->
<!--&lt;!&ndash;    opacity: 1;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;@media only screen and (max-width: 400px){&ndash;&gt;-->
<!--&lt;!&ndash;  .button-container&#45;&#45;guest{&ndash;&gt;-->
<!--&lt;!&ndash;    height: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;    margin-top: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .email{&ndash;&gt;-->
<!--&lt;!&ndash;    margin-left: 1.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->

<!--&lt;!&ndash;  .header-container&#45;&#45;guest&#45;&#45;invitation {&ndash;&gt;-->

<!--&lt;!&ndash;    height: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;    width:85vw;&ndash;&gt;-->

<!--&lt;!&ndash;    border-bottom: solid 0.1rem grey;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .body-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;    height: 35rem;&ndash;&gt;-->
<!--&lt;!&ndash;    width: 85vw;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->

<!--&lt;!&ndash;  .user-list__container {&ndash;&gt;-->

<!--&lt;!&ndash;    height: 7rem;&ndash;&gt;-->
<!--&lt;!&ndash;    width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .table-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;    width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;    height: 10.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;    display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;    flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;    margin-top: 0.7rem;&ndash;&gt;-->


<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .table__header&#45;&#45;guest {&ndash;&gt;-->

<!--&lt;!&ndash;    height: 2.5rem;&ndash;&gt;-->


<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .ul-container&#45;&#45;guest {&ndash;&gt;-->

<!--&lt;!&ndash;    max-height: 12.2rem;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .invitation__text-container {&ndash;&gt;-->

<!--&lt;!&ndash;    margin-top: 1.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;    margin-bottom: .5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .invitation__text {&ndash;&gt;-->
<!--&lt;!&ndash;    width: 85vw;&ndash;&gt;-->


<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .invitation__text textarea {&ndash;&gt;-->
<!--&lt;!&ndash;    width: 90%;&ndash;&gt;-->
<!--&lt;!&ndash;    height: 4rem;&ndash;&gt;-->
<!--&lt;!&ndash;    overflow-y: hidden;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .invitation__link input {&ndash;&gt;-->

<!--&lt;!&ndash;    height: 2rem;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .button-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;    width: 85vw;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .phone{&ndash;&gt;-->
<!--&lt;!&ndash;    display: none;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .table__header&#45;&#45;guest > span:last-child {&ndash;&gt;-->
<!--&lt;!&ndash;    display: none;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .table__header&#45;&#45;guest > span{&ndash;&gt;-->
<!--&lt;!&ndash;    width: 32%;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .user-list__participant {&ndash;&gt;-->
<!--&lt;!&ndash;    max-width: 85%;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .icon-container{&ndash;&gt;-->
<!--&lt;!&ndash;    width: 2.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;    height: 2.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->


<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;@media  (min-width:401px ) and (max-width: 600px){&ndash;&gt;-->
<!--&lt;!&ndash;  .button-container&#45;&#45;guest{&ndash;&gt;-->

<!--&lt;!&ndash;    margin-top: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .email{&ndash;&gt;-->
<!--&lt;!&ndash;    margin-left: 1.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->

<!--&lt;!&ndash;  .header-container&#45;&#45;guest&#45;&#45;invitation {&ndash;&gt;-->

<!--&lt;!&ndash;    height: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;    width:85vw;&ndash;&gt;-->

<!--&lt;!&ndash;    border-bottom: solid 0.1rem grey;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .body-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;    height: 40rem;&ndash;&gt;-->
<!--&lt;!&ndash;    width: 85vw;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->

<!--&lt;!&ndash;  .user-list__container {&ndash;&gt;-->

<!--&lt;!&ndash;    height: 7rem;&ndash;&gt;-->
<!--&lt;!&ndash;    width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .table-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;    width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;    height: 13.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;    display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;    flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;    margin-top: 0.7rem;&ndash;&gt;-->


<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .table__header&#45;&#45;guest {&ndash;&gt;-->

<!--&lt;!&ndash;    height: 3.5rem;&ndash;&gt;-->


<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .ul-container&#45;&#45;guest {&ndash;&gt;-->

<!--&lt;!&ndash;    max-height: 12.2rem;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .invitation__text-container {&ndash;&gt;-->

<!--&lt;!&ndash;    margin-top: 1.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;    margin-bottom: .5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .invitation__text {&ndash;&gt;-->
<!--&lt;!&ndash;    width: 85vw;&ndash;&gt;-->


<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .invitation__text textarea {&ndash;&gt;-->
<!--&lt;!&ndash;    width: 90%;&ndash;&gt;-->
<!--&lt;!&ndash;    height: 4rem;&ndash;&gt;-->
<!--&lt;!&ndash;    overflow-y: hidden;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .invitation__link input {&ndash;&gt;-->

<!--&lt;!&ndash;    height: 2rem;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .button-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;    height: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;    width: 85vw;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .phone{&ndash;&gt;-->
<!--&lt;!&ndash;    display: none;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .table__header&#45;&#45;guest > span:last-child {&ndash;&gt;-->
<!--&lt;!&ndash;    display: none;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .table__header&#45;&#45;guest > span{&ndash;&gt;-->
<!--&lt;!&ndash;    width: 32%;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .user-list__participant {&ndash;&gt;-->
<!--&lt;!&ndash;    max-width: 85%;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .icon-container{&ndash;&gt;-->
<!--&lt;!&ndash;    width: 2.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;    height: 2.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->


<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;@media  (min-width:601px ) and (max-width: 767px){&ndash;&gt;-->
<!--&lt;!&ndash;  .button-container&#45;&#45;guest{&ndash;&gt;-->

<!--&lt;!&ndash;    margin-top: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .email{&ndash;&gt;-->
<!--&lt;!&ndash;    margin-left: 1.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->

<!--&lt;!&ndash;  .header-container&#45;&#45;guest&#45;&#45;invitation {&ndash;&gt;-->

<!--&lt;!&ndash;    height: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;    width:75vw;&ndash;&gt;-->

<!--&lt;!&ndash;    border-bottom: solid 0.1rem grey;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .body-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;    height: 40rem;&ndash;&gt;-->
<!--&lt;!&ndash;    width: 75vw;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->

<!--&lt;!&ndash;  .user-list__container {&ndash;&gt;-->

<!--&lt;!&ndash;    height: 7rem;&ndash;&gt;-->
<!--&lt;!&ndash;    width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .table-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;    width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;    height: 13.2rem;&ndash;&gt;-->
<!--&lt;!&ndash;    display: flex;&ndash;&gt;-->
<!--&lt;!&ndash;    flex-direction: column;&ndash;&gt;-->
<!--&lt;!&ndash;    margin-top: 0.7rem;&ndash;&gt;-->


<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .table__header&#45;&#45;guest {&ndash;&gt;-->

<!--&lt;!&ndash;    height: 3.5rem;&ndash;&gt;-->


<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .ul-container&#45;&#45;guest {&ndash;&gt;-->

<!--&lt;!&ndash;    max-height: 12.2rem;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .invitation__text-container {&ndash;&gt;-->

<!--&lt;!&ndash;    margin-top: 1.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;    margin-bottom: .5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .invitation__text {&ndash;&gt;-->
<!--&lt;!&ndash;    width: 85vw;&ndash;&gt;-->


<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .invitation__text textarea {&ndash;&gt;-->
<!--&lt;!&ndash;    width: 90%;&ndash;&gt;-->
<!--&lt;!&ndash;    height: 4rem;&ndash;&gt;-->
<!--&lt;!&ndash;    overflow-y: hidden;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .invitation__link input {&ndash;&gt;-->

<!--&lt;!&ndash;    height: 2rem;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .button-container&#45;&#45;guest {&ndash;&gt;-->
<!--&lt;!&ndash;    height: 3rem;&ndash;&gt;-->
<!--&lt;!&ndash;    width: 75vw;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .phone{&ndash;&gt;-->
<!--&lt;!&ndash;    display: none;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .table__header&#45;&#45;guest > span:last-child {&ndash;&gt;-->
<!--&lt;!&ndash;    display: none;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .table__header&#45;&#45;guest > span{&ndash;&gt;-->
<!--&lt;!&ndash;    width: 32%;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .user-list__participant {&ndash;&gt;-->
<!--&lt;!&ndash;    max-width: 85%;&ndash;&gt;-->

<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .icon-container{&ndash;&gt;-->
<!--&lt;!&ndash;    width: 2.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;    height: 2.5rem;&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->


<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;</style>&ndash;&gt;-->

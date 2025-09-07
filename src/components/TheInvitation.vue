<template>
  <base-modal page="conference" is-blur="false" :open="isOpen">
    <template #modal-header>
      <div :style="{direction: $i18n.locale === 'fa' ? 'ltr':'rtl'}" class="header-container--guest--invitation">
        <img src="/img/close.svg" alt="not-loaded" style="width: 3rem;cursor: pointer" @click="closeInvitationModal" >
        <div>
          <h1>{{$store.getters.t("invite-to-meeting")}}</h1>
        </div>
      </div>
    </template>


    <template #modal-body>
      <div class="body-container--guest">
        <div class="search__user-container">
          <div class="search__user-container--element">
            <label style="color: #75758F;font-size : 1.2rem;width: 100%;">کاربر سازمانی</label>

            <input type="text" class="user-input__search" v-model="userInput" @keyup="search"
                   @blur="isUSerInputFocused = false" @focus="isUSerInputFocused = true"/>
            <div
                class="found-users--container"
                v-if="foundUsers.length > 0"
                :style="{'max-height':'21rem'}"
            >
              <ul :style="{'max-height':'21rem'}">
                <li
                    v-for="user in foundUsers"
                    :key="user"
                    class="found-user--list"
                    @click="addToListParticipant(user)"
                >
                  {{ user.firstName + " " + user.lastName }}
                </li>
              </ul>
            </div>
          </div>
          <div class="search__user-container--element">
            <label style="color: #75758F;font-size : 1.2rem;width: 100%;">گروه سازمانی</label>

            <input type="text" class="user-input__search" v-model="groupNameInput" @keyup="searchGroupName"
                   @blur="isGroupInputFocused = false" @focus="isGroupInputFocused = true"/>
            <div
                class="found-users--container"
                v-if="numberOfGroups.length > 0"
                :style="{'max-height':'21rem'}"
            >
              <ul :style="{'max-height':'21rem'}">
                <li
                    v-for="group in numberOfGroups" :key="group"
                    class="found-user--list"
                    @click="addGroupToListParticipant(group)"
                >
                  {{ group.groupName }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div style="width: 100%;overflow-x: auto;display: flex;flex-direction: column; padding: 0 0 1rem 0">
          <div ref="table-th" class="invite-user-table__th">
            <span v-for="el in invitedUserListTh" :key="el">{{ el }}</span>
          </div>
          <ul class="invite-user-table__Ul" :style="{'height':'25rem'}">
            <li class="invite-user-table__list" v-for="user in listOfAllUsers" :key="user.id">
              <div><span class="invite-user-info">{{ user.firstName }}</span></div>
              <div><span class="invite-user-info">{{ user.lastName }}</span></div>
              <div><span class="invite-user-info">{{ user.phoneNumber }}</span></div>
              <div><span class="invite-user-info-email">{{ user.email }}</span></div>
              <div><span class="invite-user-info"><img src="/img/close.svg" alt="not-loaded" style="cursor: pointer;width: 2rem" @click="deleteUSer(user)"></span></div>
            </li>
          </ul>
        </div>




        <div class="invite__text--container">
          <span>متن دعوت به جلسه</span>
          <div>{{invitationText}}</div>
        </div>





        <div class="invite__text--container__link">
          <div style="width: calc(100% - 11rem)">
            <input class="invite__text--container__link--input" disabled ref="linkURL"
                   v-model="invitationURL">
          </div>
          <div style="width: fit-content;height: fit-content" >
            <base-button
                button-inner-txt="کپی لینک"
                :continuous-params="['color=white', 'background-color=#1B76FF']"
                :style-types="[ 'small--button']"
                :is-active="true"
                @click="copyToClipboard"
            >
              <template #pre-button-slot>
                <img v-show="!isLinkCopied" src="/img/copy-icon.svg" style="width: 16px; height: 16px" alt="not loaded"
                     class="fade-image">
                <svg class="fade-image" style="width: 16px;height: 16px" v-show="isLinkCopied" width="24" height="24"
                     viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M18.7104 7.2101C18.6175 7.11638 18.5069 7.04198 18.385 6.99121C18.2632 6.94044 18.1324 6.91431 18.0004 6.91431C17.8684 6.91431 17.7377 6.94044 17.6159 6.99121C17.494 7.04198 17.3834 7.11638 17.2904 7.2101L9.84044 14.6701L6.71044 11.5301C6.61392 11.4369 6.49998 11.3636 6.37512 11.3143C6.25026 11.2651 6.11694 11.241 5.98276 11.2433C5.84858 11.2457 5.71617 11.2744 5.59309 11.3279C5.47001 11.3814 5.35868 11.4586 5.26544 11.5551C5.1722 11.6516 5.09889 11.7656 5.04968 11.8904C5.00048 12.0153 4.97635 12.1486 4.97867 12.2828C4.98099 12.417 5.00972 12.5494 5.06321 12.6725C5.1167 12.7955 5.19392 12.9069 5.29044 13.0001L9.13044 16.8401C9.2234 16.9338 9.334 17.0082 9.45586 17.059C9.57772 17.1098 9.70843 17.1359 9.84044 17.1359C9.97245 17.1359 10.1032 17.1098 10.225 17.059C10.3469 17.0082 10.4575 16.9338 10.5504 16.8401L18.7104 8.68011C18.8119 8.58646 18.893 8.47281 18.9484 8.34631C19.0038 8.21981 19.0324 8.08321 19.0324 7.94511C19.0324 7.807 19.0038 7.6704 18.9484 7.5439C18.893 7.4174 18.8119 7.30375 18.7104 7.2101Z"
                      fill="white"/>
                </svg>

              </template>
            </base-button>
          </div>
        </div>










        <!--        <div class="user-list__container">-->
        <!--          <div :class=" $i18n.locale === 'fa' ? 'user-list-rtl' :  'user-list-ltr'">-->
        <!--            <span :style="{direction : $i18n.locale === 'fa' ? 'rtl' : 'ltr'}">{{$store.getters.t("organizational-user")}}</span>-->
        <!--            <div>-->
        <!--              <div class="search__user-container" @click="clickToSearchUser">-->
        <!--                <span v-if="isClickedToSearchUser && listOfOrganizationalUsers.length === 0" :class=" $i18n.locale === 'fa' ? 'search__user&#45;&#45;text-rtl' : 'search__user&#45;&#45;text-ltr'">{{$store.getters.t("enter-user")}}</span>-->
        <!--                <input class="search__user" ref="userInput" @blur="showUserPlaceHolder" @focus="deleteUserPlaceHolder" @keydown="deleteUser"  @keyup="search"  :value="userInput.toLowerCase()" @input="userInput = $event.target.value.toLowerCase()">-->
        <!--                &lt;!&ndash;                  <div v-if="isUserFound" class="founded__users">&ndash;&gt;-->

        <!--                <ul-->
        <!--                    v-if="isUserFound"-->
        <!--                    class="founded__users"-->
        <!--                    tabindex="0"-->
        <!--                    ref="users"-->
        <!--                    @blur="focusedIndex = 0"-->
        <!--                    @keydown="selectAndMoveAlongUsers">-->
        <!--                  <li v-for="(user,index) in foundUsers" :key="user" class="founded__users-list"-->
        <!--                      :class="focusedList(index)"-->
        <!--                      @click="addToListParticipant(user)">-->
        <!--                    <p>{{ user.firstName + ' ' + user.lastName }}</p>-->
        <!--                  </li>-->
        <!--                </ul>-->

        <!--                &lt;!&ndash;                  </div>&ndash;&gt;-->
        <!--              </div>-->
        <!--              <div class="user-list__participant">-->
        <!--                <div class="badge-list__participant">-->
        <!--                  <base-badge :show-badge="false" mode="invitation" v-for="user in filteredParticipant"-->
        <!--                              :key="user" :badge-text="user.firstName + ' ' + user.lastName "-->
        <!--                              :close="'close-badge'" @close-badge="closeBadge(user)"></base-badge>-->
        <!--                </div>-->
        <!--                <div v-if="numberOfOtherParticipant>0" class="badge-list__others" @click="showParticipants">-->
        <!--                  <p>-->
        <!--                    {{ numberOfOtherParticipant + '+' }}-->
        <!--                  </p>-->
        <!--                  <div v-if="userIsShown">-->


        <!--                    <ul class="participants__more">-->
        <!--                      <li v-for="user in otherUsers" :key="user" class="participant">-->
        <!--                        <span class="hidden-badge" @click="closeBadge(user)">+</span>-->
        <!--                        {{ user.firstName + ' ' + user.lastName }}-->
        <!--                      </li>-->
        <!--                    </ul>-->
        <!--                  </div>-->
        <!--                </div>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div :class=" $i18n.locale === 'fa' ? 'user-list-rtl' :  'user-list-ltr'">-->
        <!--            <span :style="{direction : $i18n.locale === 'fa' ? 'rtl' : 'ltr'}">{{$store.getters.t("organizational-group")}}</span>-->
        <!--            <div>-->
        <!--              <div class="search__user-container"  @click="clickToSearchGroup">-->
        <!--                <span v-if="isClickedToSearchGroup&& invitedGroups.length === 0"  :class=" $i18n.locale === 'fa' ? 'search__user&#45;&#45;text-rtl' : 'search__user&#45;&#45;text-ltr'">{{$store.getters.t("enter-group")}}</span>-->
        <!--                <input class="search__user" ref="groupInput" @blur="showGroupPlaceHolder" @focus="deleteGroupPlaceHolder" @keydown="deleteGroup"  @keyup="searchGroupName"    :value="groupNameInput.toLowerCase()" @input="groupNameInput = $event.target.value.toLowerCase()">-->
        <!--                &lt;!&ndash;                  <div  >&ndash;&gt;-->

        <!--                <ul v-if="groupIsFound"-->
        <!--                    class="founded__users"-->
        <!--                    tabindex="0"-->
        <!--                    ref="groups"-->
        <!--                    @blur="focusedIndex = 0"-->
        <!--                    @keydown="selectAndMoveAlongGroups"-->
        <!--                >-->
        <!--                  <li v-for="(group,index) in numberOfGroups" :key="group" class="founded__users-list"-->
        <!--                      @click="addGroupToListParticipant(group)"-->
        <!--                      :class="focusedList(index)">-->
        <!--                    <p>{{ group.groupName }}</p>-->
        <!--                  </li>-->
        <!--                </ul>-->

        <!--                &lt;!&ndash;                  </div>&ndash;&gt;-->
        <!--              </div>-->
        <!--              <div class="user-list__participant">-->
        <!--                <div class="badge-list__participant">-->
        <!--                  <base-badge :show-badge="false" mode="invitation" v-for="group in filteredGroups" :key="group"-->
        <!--                              :badge-text="group.groupName" :close="'close-badge'"-->
        <!--                              @close-badge="closeBadgeGroup(group)"></base-badge>-->
        <!--                </div>-->
        <!--                <div v-if="numberOfOtherGroups>0"  class="badge-list__others" @click="showGroupOfParticipants">-->
        <!--                  <p>-->
        <!--                    {{ numberOfOtherGroups + '+' }}-->
        <!--                  </p>-->
        <!--                  <div v-if="groupIsShown">-->


        <!--                    <ul class="participants__more">-->
        <!--                      <li v-for="group in otherGroups" :key="group" class="participant">-->
        <!--                        <span class="hidden-badge" @click="closeBadgeGroup(group)">+</span>-->
        <!--                        {{ group.groupName}}-->
        <!--                      </li>-->
        <!--                    </ul>-->
        <!--                  </div>-->
        <!--                </div>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->


        <!--        <div class="guest__list-container">-->
        <!--          <span :style="{direction : $i18n.locale === 'fa' ? 'rtl' : 'ltr'}">-->
        <!--            {{$store.getters.t("invitation-list")}}-->
        <!--          </span>-->
        <!--          <div class="table-container&#45;&#45;guest">-->
        <!--            <div class="table__header&#45;&#45;guest">-->
        <!--              <span>{{$store.getters.t("name")}}</span>-->
        <!--              <span>{{$store.getters.t("last-name")}}</span>-->
        <!--              <span class="email">{{$store.getters.t("email-address")}}</span>-->
        <!--              <span class="phone">{{$store.getters.t("phone-number")}}</span>-->
        <!--            </div>-->
        <!--            <div class="ul-container&#45;&#45;guest">-->
        <!--              <ul>-->
        <!--                <participant-list-element  v-for="user in listOfAllUsers"-->
        <!--                                           :is-guest="true"-->
        <!--                                           :key="user"-->
        <!--                                           :participant-name="user.firstName"-->
        <!--                                           :participant-lastname="user.lastName"-->
        <!--                                           :participant-email="user.email"-->
        <!--                                           :participant-phone-number="user.phoneNumber"-->
        <!--                >-->

        <!--                </participant-list-element>-->
        <!--              </ul>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->


        <!--        <div class="invitation__text-container">-->
        <!--          <span :style="{direction : $i18n.locale === 'fa' ? 'rtl' : 'ltr'}">{{$store.getters.t("invitation-link")}}</span>-->
        <!--          <div :class=" $i18n.locale === 'fa' ? 'invitation__text-rtl' : 'invitation__text-ltr'">-->
        <!--            <textarea ref="textarea" disabled type="text" placeholder="متن دعوت را وارد کنید..." v-model="invitationText"></textarea>-->
        <!--          </div>-->
        <!--          <div :class=" $i18n.locale === 'fa' ? 'invitation__link-container-rtl' : 'invitation__link-container-ltr'">-->
        <!--            <div class="invitation__link">-->
        <!--              <input disabled ref="inputURL"  class="URL__generation" type="text" v-model="invitationURL">-->
        <!--            </div>-->

        <!--            <div class="icon-container" >-->
        <!--              <img src="/img/Copy.svg" class="copy-icon" alt="not loaded" @touch="copyToClipboard" @click="copyToClipboard" >-->

        <!--            </div>-->
        <!--          </div>-->
        <!--          <div class="copied-link" v-if="linkIsCopied">{{$store.getters.t("copy-meeting-link")}}</div>-->
        <!--        </div>-->
      </div>
    </template>

    <template #modal-buttons>
      <div class="button-container--guest">
        <!--        <base-button-->
        <!--            is-active="true"-->
        <!--            :button-type="['button&#45;&#45;ultra-big', 'button&#45;&#45;curved', 'background-color=#1a73e8', 'color=white','width=5rem','font-weight=bold','font-size=1.2rem']"-->
        <!--            button-content=" دعوت "-->
        <!--            @touch="inviteUsers"-->
        <!--            @click="inviteUsers"-->
        <!--        ></base-button>-->



        <base-button
            :button-inner-txt='$store.getters.t("invite")'
            :continuous-params="['color=white', 'background-color=#1B76FF']"
            :style-types="[ 'large--button']"
            :is-active="true"
            @click="inviteUsers"
        >
        </base-button>




      </div>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from './UI/BaseModal';
// import BaseBadge from './BaseBadge';
import BaseButton from './UI/BaseButton';
import RestClient from "../api/restClient";
import DetectMobile from '../utils/detectMobile';
// import ParticipantListElement from "./ParticipantListElement";
import {nextTick} from "vue";
const restClientUser = new RestClient('user')
const restClientGroup = new RestClient('group')
const restClientInvite = new RestClient('invite')
const restClientPrivate = new RestClient('privateRoom')
const restClientUserGroup = new RestClient('userGroup')

export default {
  name: "TheInvitation",
  components:{BaseModal,BaseButton},
  props:['isOpen'],
  inject:['isMobile'],
  data(){
    return {
      isMobile:false,
      scroll:-35,
      focusedIndex: 0,
      isInputFocused: false,
      isClickedToSearchGroup:true,
      isClickedToSearchUser:true,
      groupUser:[],
      linkIsCopied:false,
      invitationURL : '',
      invitedGroups: [],
      invitationText: this.$store.getters.t("invite-text"),
      isUserFound: false,
      groupIsFound: false,
      addedUsers: [],
      addedGroups: [],
      userInput: '',
      groupNameInput: '',
      listOfOrganizationalUsers:[],
      listOfAllUsers: [],
      invitedUserIds:[],
      allUsers: [],



      listOfAllGroups: [],

      userIsShown: false,
      groupIsShown: false,
      userIds:[],
      isUSerInputFocused:false,
      isGroupInputFocused:false,
      invitedUserListTh: ['نام', 'نام خانوادگی', 'تلفن', 'ایمیل', 'حذف'],
      isLinkCopied: false,
    }
  },
  computed:{
    foundUsers() {

      return this.addedUsers

    },
    numberOfGroups() {
      return this.addedGroups
    },
    filteredParticipant() {
      return this.listOfOrganizationalUsers.filter((el, idx) => {
        if(this.isMobile){
          return idx < 2
        }else{
          return idx < 5
        }


      })
    },
    filteredGroups() {
      return this.invitedGroups.filter((el,idx)=>{
        if(this.isMobile){
          return idx < 2
        }else{
          return idx < 5
        }
      });
    },

    numberOfOtherParticipant() {

      if(this.isMobile){
        return this.listOfOrganizationalUsers.length - 2
      }else{
        return this.listOfOrganizationalUsers.length - 5
      }
    },
    numberOfOtherGroups(){
      if(this.isMobile){
        return this.invitedGroups.length - 2
      }else{
        return this.invitedGroups.length - 5
      }
    },
    otherUsers() {
      return this.listOfOrganizationalUsers.filter((el, idx) => {
        if(this.isMobile){
          return idx > 1
        }else{
          return idx > 4
        }
      })
    },
    otherGroups(){
      return this.invitedGroups.filter((el, idx) => {
        if(this.isMobile){
          return idx > 1
        }else{
          return idx > 4
        }
      })
    }
  },
  watch:{
    // linkIsCopied(val){
    //   if(val === true){
    //     setTimeout(()=>{
    //       this.linkIsCopied = false
    //     },6000)
    //   }
    // },
    isLinkCopied(val) {
      if (val) {
        setTimeout(() => {
          this.toggleCopiedLinkStatus()
        }, 3000)
      }
    },

  },
  methods:{

    focusedList(index) {
      if (index === this.focusedIndex && this.isInputFocused === false) {
        return "focused";
      }
      return "";
    },
    selectAndMoveAlongUsers(e){
      if (e.key === "ArrowDown") {
        if (this.focusedIndex < this.foundUsers.length - 1) {
          this.$refs.users.scrollTo(0,this.scroll)
          this.focusedIndex++;
          this.scroll +=35
        }
      } else if (e.key === "ArrowUp") {
        if (this.focusedIndex >= 0) {
          this.focusedIndex--;
          this.scroll -=35
          this.$refs.users.scrollTo(0,this.scroll)
        }
      } else if (e.key === "Enter") {
        this.addToListParticipant(this.foundUsers[this.focusedIndex]);
        this.$refs.userInput.focus();
        this.focusedIndex = 0
        this.scroll = -35
      }
    },
    selectAndMoveAlongGroups(e){
      if (e.key === "ArrowDown") {
        if (this.focusedIndex < this.numberOfGroups.length - 1) {
          this.$refs.groups.scrollTo(0,this.scroll)
          this.focusedIndex++;
          this.scroll +=35
        }
      } else if (e.key === "ArrowUp") {
        if (this.focusedIndex >= 0) {
          this.focusedIndex--;
          this.scroll -=35
          this.$refs.groups.scrollTo(0,this.scroll)
        }
      } else if (e.key === "Enter") {
        this.addGroupToListParticipant(this.numberOfGroups[this.focusedIndex]);
        this.$refs.groupInput.focus();
        this.focusedIndex = 0
        this.scroll = -35
      }
    },
    clickToSearchUser(){
      this.isClickedToSearchUser = false
      this.userInput = ''
      nextTick(()=>{
        this.$refs.userInput.focus()
      })
    },
    clickToSearchGroup(){

      this.isClickedToSearchGroup = false
      this.groupNameInput = ''
      nextTick(()=>{
        this.$refs.groupInput.focus()
      })
    },
    showGroupPlaceHolder(){

      if(this.$refs.groupInput.value === ''){
        this.isClickedToSearchGroup = true
      }
      this.isInputFocused = false;
    },
    showUserPlaceHolder(){
      if(this.$refs.userInput.value === ''){
        this.isClickedToSearchUser = true
      }

      this.isInputFocused = false;
    },
    deleteGroupPlaceHolder(){
      this.$refs.groupInput.placeholder = ''
      this.isInputFocused = true;
    },
    deleteUserPlaceHolder(){
      this.$refs.userInput.placeholder = ''
      this.isInputFocused = true;
    },
    generatePrivateLink(){
      restClientPrivate.generateLink(this.$store.getters.roomId).then((response)=>{
        this.invitationURL = response;
      }).catch((error)=>{
        console.error(error)
      })
    },
    generateLink(){
      restClientInvite.generateLink(this.$store.getters.roomId).then((response)=>{
        this.invitationURL = response;
      }).catch((error)=>{
        console.log(error)
      })
    },
    getAllUsers() {
      restClientUser.getAll().then((users) => {
        this.allUsers = users;
      }).catch(err => {
        console.log(err)
      })
    },

    getAllGroups() {

      restClientGroup.getAll().then((groups) => {
        for(const el of groups){
          this.listOfAllGroups.push({groupName:el.name,groupId:el.id,users:[]})
        }



      }).catch(err => {
        console.log(err)
      })
    },
    getAllPrivateInvited() {
      restClientPrivate.getInvitedPrivate(this.$store.getters.roomId).then((invitedUsers) => {
        console.log(invitedUsers)
        for(const el of invitedUsers){
          this.userIds.push(el.id)
          // this.listOfOrganizationalUsers.push(el)
          this.listOfAllUsers.push(el)
        }
      }).catch(err => {
        console.log(err)
      })
    },

    getAllInvited() {
      restClientInvite.getInvitedPublic(this.$store.getters.roomId).then((invitedUsers) => {
        for(const el of invitedUsers){
          this.userIds.push(el.id)
          // this.listOfOrganizationalUsers.push(el)
          this.listOfAllUsers.push(el)
        }
      }).catch(err => {
        console.log(err)
      })
    },


    modifyNewInvitedUsers() {
      restClientInvite.modifyUserOfPublicRoom(this.$store.getters.roomId, [] , this.userIds).then(() => {
      }).catch(err => {
        console.log(err)
      })
    },
    modifyNewInvitedUsersPrivateRoom() {
      restClientPrivate.modifyUserOfPrivateRoom(this.$store.getters.roomId,  this.invitationURL , this.userIds).then(() => {
      }).catch(err => {
        console.log(err)
      })
    },
    getAllUsersByGroupId(id){
      restClientUserGroup.getAllUsersByGroupId(id).then(response=>{
        // this.addGroupToListParticipant(id);
        const index = this.listOfAllGroups.findIndex((el)=>{
          return  el.groupId ===id
        })

        if(this.listOfAllGroups[index].users.length === 0){
          for(let element of response){
            this.listOfAllGroups[index].users.push(element)
          }
        }
        const idx = this.invitedGroups.findIndex((el)=>{
          return el.groupName === this.listOfAllGroups[index].groupName
        })
        if(idx === -1){
          this.invitedGroups.push(this.listOfAllGroups[index])
        }
        const groupUsers = this.listOfAllGroups[index].users;
        for (let el of groupUsers) {

          const index = this.listOfAllUsers.findIndex((element) => {
            return element.firstName + element.lastName === el.firstName + el.lastName
          })
          if (index === -1) {
            this.listOfAllUsers.push(el);
            this.userIds.push(el.id)
          }
        }
      }).catch(error=>{
        console.log(error)
      })
    },
    inviteUsers(){
      if (this.$store.getters.isPrivateUser !== 'isPrivateUser'){
        this.modifyNewInvitedUsers();
      }else {
        this.modifyNewInvitedUsersPrivateRoom()
      }

      this.$emit('close-invitation-component')
      this.eventBus.emit('invited-users',this.listOfAllUsers)
    },
    closeBadge(participant) {

      const indexOfAllUsers = this.listOfAllUsers.findIndex((el) => {
        return el.firstName + el.lastName === participant.firstName + participant.lastName
      });
      const indexOfOrganizationalUsers = this.listOfOrganizationalUsers.findIndex((el) => {
        return el.firstName + el.lastName === participant.firstName + participant.lastName
      });
      if(indexOfAllUsers!==-1 && indexOfOrganizationalUsers !==-1 ){
        this.listOfOrganizationalUsers.splice(indexOfOrganizationalUsers,1)
        this.listOfAllUsers.splice(indexOfAllUsers, 1);
        this.userIds.splice(indexOfAllUsers, 1);
      }
    },
    closeBadgeGroup(group) {
      const idx = this.invitedGroups.findIndex((el) => {
        return el.groupName === group.groupName
      });
      if (idx !== -1) {
        for (let el of this.invitedGroups[idx].users) {
          let index = this.listOfAllUsers.findIndex((element) => {
            return element.firstName + element.lastName === el.firstName + el.lastName
          })
          if(index !==-1){
            this.listOfAllUsers.splice(index, 1);
            this.userIds.splice(index, 1);
          }
        }
        this.invitedGroups.splice(idx, 1);
      }
    },
    addToListParticipant(person) {
      this.isUserFound = false
      let idx = this.listOfAllUsers.findIndex((el) => {
        return el.name + el.lastName === person.name + person.lastName
      })
      if (idx === -1) {
        this.listOfOrganizationalUsers.push(person);
        this.listOfAllUsers.push(person);
        this.userIds.push(person.id);
        this.invitedUserIds.push(person.id)
      }
    },
    addGroupToListParticipant(group) {
      this.getAllUsersByGroupId(group.groupId);
      this.groupIsFound = false;
      this.groupNameInput = ''
      this.addedGroups = []
    },
    // deleteUser(e){
    //   if(e.keyCode=== 8 ){
    //     if(this.userInput === '' && this.listOfOrganizationalUsers.length > 0){
    //       this.listOfAllUsers.pop();
    //       this.userIds.pop()
    //       this.listOfOrganizationalUsers.pop()
    //     }
    //   }
    //   if (e.key === "ArrowDown") {
    //     if (this.isInputFocused) {
    //       nextTick(() => {
    //         this.$refs.users.focus();
    //       });
    //     }
    //   }
    // },
    search() {
      const inpValue = this.userInput;
      if (this.userInput === '') {
        this.isUserFound = false;


      }
      this.addedUsers = this.allUsers.filter((el) => {
        if (((el.firstName + ' ' + el.lastName).includes(inpValue)|| (el.username.includes(inpValue))) && inpValue.length !== 0) {
          return true
        }
      })


      if (this.foundUsers.length > 0) {
        this.isUserFound = true;
      }else{
        this.isUserFound = false;
      }
      this.groupIsFound = false
      this.groupNameInput = ''

    },
    deleteGroup(e){
      if(this.groupNameInput === '') {
        if (e.keyCode === 8) {
          const idx = this.invitedGroups.length - 1;
          for (let el of this.invitedGroups[idx].users) {
            let index = this.listOfAllUsers.findIndex((element) => {
              return element.firstName + element.lastName === el.firstName + el.lastName
            })
            if (index !== -1) {
              this.invitedGroups.splice(idx, 1);
              this.listOfAllUsers.splice(index, 1);
              this.userIds.splice(index, 1);

            }


          }
        }
      }
      if (e.key === "ArrowDown") {


        if (this.isInputFocused) {

          nextTick(() => {
            this.focusedIndex=0
            this.$refs.groups.focus();

          });
        }
      }
    },
    searchGroupName() {
      const inpValue = this.groupNameInput;
      if (this.groupNameInput === '') {
        this.groupIsFound = false;




      }

      this.addedGroups = this.listOfAllGroups.filter((el) => {
        if (el.groupName.includes(inpValue) && inpValue.length !== 0) {
          return true
        }
      })


      if (this.numberOfGroups.length > 0) {
        this.groupIsFound = true;
      }else{
        this.groupIsFound = false;
      }
      this.isUserFound = false
      this.userInput = ''
    },
    closeList(participant) {
      const idx = this.listOfAllUsers.findIndex((el) => {
        return el.firstName === participant.firstName
      });
      if(idx !== -1){
        this.listOfAllUsers.splice(idx, 1);
        this.userIds.splice(idx, 1);
      }
      const index = this.listOfOrganizationalUsers.findIndex((el) => {
        return el.firstName === participant.firstName
      });
      if(index !== -1){
        this.listOfOrganizationalUsers.splice(index, 1);
      }
    },
    closeInvitationModal() {
      this.$emit('close-invitatoin')
    },
    showParticipants() {
      this.userIsShown = !this.userIsShown

      this.groupIsShown = false
    },
    showGroupOfParticipants() {
      this.groupIsShown = !this.groupIsShown
      this.userIsShown = false
    },
    copyToClipboard(){
      console.error()
      this.$refs.linkURL.select();
      this.$refs.linkURL.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(this.invitationURL);
      nextTick(() => {
        this.isLinkCopied = true
      })

    },
    toggleCopiedLinkStatus() {
      this.isLinkCopied = false
    },
    deleteUSer(participant) {

      const indexOfAllUsers = this.listOfAllUsers.findIndex((el) => {
        return el.firstName + el.lastName === participant.firstName + participant.lastName
      });

      if(indexOfAllUsers!==-1){
        this.listOfAllUsers.splice(indexOfAllUsers, 1);
        this.userIds.splice(indexOfAllUsers, 1);
      }
    },
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  mounted(){

    // if (this.$store.getters.isPrivateUser !== 'isPrivateUser'){
      this.getAllInvited();
      this.generateLink()
    // }else{
    //   this.getAllPrivateInvited()
    //   this.generatePrivateLink()
    // }
    this.getAllUsers();
    this.getAllGroups();
  },


}

</script>

<style scoped>
.close-device-test-model{
  cursor: pointer;
}
.invitation-enter-active{
  animation: fade .3s ease-out
}
.invitation-leave-active{
  animation: fade .3s ease-in reverse;
}

@keyframes fade {
  from{
    opacity: 0;
    transform: translate(50%,-50%) scale(0.7,0.7);
  }
  to{
    opacity: 1;
    transform: translate(50%,-50%);

  }
}
.search__user--text-rtl{
  font-size: 1rem;
  color: grey;
  width: auto;
  height: 2rem;
  position: absolute;
  top: 0.2rem;
  right: 0;
}
.search__user--text-ltr{
  font-size: 1rem;
  color: grey;
  width: auto;
  height: 2rem;
  position: absolute;
  top: 0.2rem;
  left: 0;
}
.header-container--guest--invitation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  width: 75rem;

}

h2 {
  direction: rtl;
  font-size: 1.5rem;
}

.body-container--guest {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  max-height: 48rem;
  width: 75rem;
  overflow-y: auto;
}

.user-list__container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 10rem;
  width: 100%;
}

.user-list-rtl {
  width: 100%;
  height: 42%;
  display: flex;
  flex-direction: row;
  /*justify-content: space-between;*/

}
.user-list-ltr {
  width: 100%;
  height: 42%;
  display: flex;
  flex-direction: row-reverse;
  /*justify-content: space-between;*/

}


.user-list-rtl > span {
  width: 15%;
  font-size: 1.2rem;
  display: flex;
  align-items: center;

}
.user-list-ltr > span {
  width: 20%;
  font-size: 1.2rem;
  display: flex;
  align-items: center;

}

.user-list-rtl > div {
  width: 85%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
  border: solid 0.1rem #707070;
  border-radius: 1rem;
}
.user-list-ltr > div {
  width: 85%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
  border: solid 0.1rem #707070;
  border-radius: 1rem;
}

.user-list__participant {
  max-width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3rem;
  padding-right: 0.5rem;
  border-radius: 1rem;
}

.search__user {
  margin: 0 0 0 1rem;
  width: 80%;
  height: 2.6rem;
  border: solid 0.1rem transparent;
}
.search__user::placeholder{
  font-size: 0.9rem;
}
.search__user:focus {
  outline: none;
}

.badge-list__participant {
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 39rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;

}

.badge-list__others {
  color: #1a73e8;
  border: solid .1rem #dadce0;
  border-radius: 1.1rem;
  height: 2.2rem;
  width: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  position: relative;
  cursor: pointer;
}

.participants__more {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 12rem;
  max-height: 10rem;
  border: solid .1rem lightgray;
  z-index: 100;
  background-color: white;
  overflow-y: auto;
  /*left: -3rem;*
   */
  top: 2rem;
  left: -4rem;
  direction: ltr;
  border-radius: 1rem;
}

.participants__more li:first-child {
  border-radius: 1rem 1rem 0 0;

}

.participants__more li:last-child {
  border-radius: 0 0 1rem 1rem;
  border: 0.1rem solid transparent;

}

.participant {
  position: relative;
  font-size: 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  height: 2rem;
  border-bottom: .1rem solid rgb(204, 198, 198);
  direction: rtl;
  padding-right: 0.6rem;
}

.participant:hover {
  background-color: rgb(235, 235, 245);
}

.guest__list-container {
  width: 100%;
  height: 73%;
  /*display: flex;*/
  margin-top: 3rem;
  /*flex-direction: column;*/

}

.guest__list-container > span {
  height: 10%;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  direction: rtl;
}

.table-container--guest {
  width: 100%;
  height: 20.2rem;
  display: flex;
  flex-direction: column;
  margin-top: 0.7rem;


}

.table__header--guest {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 3.5rem;
  border-radius: 1.5rem;
  background-color:#95d1cc;

}

.table__header--guest > span {
  width: 23%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: white;

}

.ul-container--guest {
  direction: rtl;
  max-height: 16.2rem;
  overflow-y: auto;
}

.ul-container--guest ul {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

}

::-webkit-scrollbar {
  width: 5px;


}

::-webkit-scrollbar-track {
  background: transparent;


}

::-webkit-scrollbar-thumb {
  background: #7A7A7A;
  border-radius: 12px;


}

::-webkit-scrollbar-track-piece {
  height: 20px;

}

.invitation__text-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 18rem;
  font-size: 1.2rem;
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.invitation__text-rtl {
  direction: rtl;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 65%;
  position: relative;
}
.invitation__text-ltr {
  direction: rtl;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
  height: 65%;
  position: relative;
}

.invitation__text-rtl textarea {
  display: flex;
  font-size: 1.2rem;
  align-items: center;
  width: 89%;
  height: 5rem;
  overflow-y: auto;
  padding-left: 0.7rem;
  padding-right: 0.5rem;
  direction: rtl;
  resize: none;
  border: 0.1rem solid #707070;
  border-radius: 1rem;
  margin-top: 1.5rem;
  margin-bottom: .5rem;
}
.invitation__text-ltr textarea {
  display: flex;
  font-size: 1.2rem;
  align-items: center;
  width: 89%;
  height: 5rem;
  overflow-y: auto;
  padding-left: 0.7rem;
  padding-right: 0.5rem;
  direction: ltr;
  resize: none;
  border: 0.1rem solid #707070;
  border-radius: 1rem;
  margin-top: 1.5rem;
  margin-bottom: .5rem;
}

.invitation__text textarea::placeholder {
  color: rgba(0, 0, 0, 0.8);
}

.invitation__text textarea:focus {
  outline: none;

  box-shadow: 0 .2rem .8rem rgba(0, 0, 0, .26);
}

.invitation__link-container-rtl {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 35%;
}
.invitation__link-container-ltr {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  height: 35%;
}

.invitation__link {
  width: 89%;
  display: flex;
  height: 100%;
  align-items: center;
}

.invitation__link input {
  font-size: 1.2rem;
  width: 100%;
  height: 3rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  direction: ltr;
  border: solid 0.1rem #c2c2c2;
  background-color: #f1f1f1;
  color: #6e6e6e;
  border-radius: 1rem;
}

.icon-container {
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  background-color: #95d1cc;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-container--guest {
  height: 3rem;
  width: 52rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.copy-icon {
  width: 45%;
  cursor: pointer;
}
.copied-link {
  margin-top: 0.5rem;
  color: #08aa3e;
  font-size: 1.2rem;
  width: 89%;
  display: flex;
  align-items: center;
  justify-content: center;
  /*animation-name: copiedText;*/
  /*animation-duration: 6s;*/
}
@keyframes copiedText {
  from {transform: translateY(-1rem);
    display: none;

  }
  to {transform: translateY(0);
    display: block;
  }
  0%   {transform: translateY(-1.5rem);
    opacity: 0;
  }
  25%  {transform: translateY(0);
    opacity: 100%}
  50%  {transform: translateY(0);
    opacity: 100%}
  75%  {transform: translateY(0);
    opacity: 100%}
  100% {transform: translateY(-1.5rem);
    opacity: 0}
}
.hidden-badge {
  transform: rotate(45deg);
  width: 1rem;
  height: 1rem;
  font-size: 1.2rem;

  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0.7rem;
  cursor: pointer;
  color: black;
  border-radius: 50%;
}

.hidden-badge:hover {
  background-color: #95d1cc;
  color: white;
}
.search__user-container {
  width: 100%;
  height: 7rem;
  display: flex;
  justify-content: space-between;

}
.search__user-container--element{
  width: 45%;
  height: 7rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: relative;
}

.found-container {
  position: relative;
}

.founded__users {
  position: absolute;
  right: 0;
  top: 2rem;
  z-index: 100;
  width: 15rem;
  max-height: 17.5rem;
  border: solid .1rem lightgray;
  background-color: white;
  overflow-y: auto;
  border-radius: 1rem;
}
ul:focus{
  outline: none;
}

.found__persons {

  display: flex;
  flex-direction: column;
  width: 100%;

  padding: 0;

  /*left: -3rem;*
   */

  direction: ltr;
}

.founded__users-list {
  position: relative;
  font-size: 1.3rem;
  width: 100%;
  display: flex;
  align-items: center;

  border-bottom: .1rem solid rgb(204, 198, 198);
  direction: rtl;
  height: 3.5rem;
  padding-right: 0.6rem;
}

.founded__users-list > p {
  max-width: 14rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.founded__users-list:hover {
  background-color: rgb(226, 226, 229);
  cursor: pointer;
}
.focused {
  background-color: rgb(226, 226, 229);
}

.URL__generation:focus {
  outline: none;
  color: #171616;
  box-shadow: 0 .2rem .8rem rgba(0, 0, 0, .26);
}
.user-input__search {
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

.user-input__search:focus {
  outline: 0;
  background-color: transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}
.found-users--container {
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
.found-user--list {
  width: 100%;
  height: 3rem;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 400;
  color: #75758F;
}

.found-user--list:hover {
  background-color: #F2F2F2;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;

}




.invite-user-table__th {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.6rem;
  min-width: 75rem;
}

.invite-user-table__th > span {
  width: 23%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
}

.invite-user-table__th > span:last-child {
  width: 5%;
  min-width: 4rem;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-start;
}




.invite-user-table__Ul {
  width: 100%;
  display: flex;
  flex-direction: column;
  direction: rtl;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  min-width: 75rem;
}



.invite-user-table__list {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 1.6rem;
}

.invite-user-table__list:nth-child(odd) {
  background-color: #F6F6F7;
}

.invite-user-table__list > div {
  width: 23%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}

.invite-user-table__list > div:last-child {
  width: 5%;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 400;
  direction: rtl;
}
.invite-user-table__list > div > span{
  display: block;
  max-width: 95%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.invite__text--container{
  width: 100%;
  height: 9rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.invite__text--container > div {
  width: 100%;
  height: 6.5rem;
  border: 0.1rem solid #DCDADA;
  border-radius: 1rem;
  color: #75758F;
  font-size: 1.3rem;
  font-weight: 400;
  padding: 0.8rem;
}
.invite__text--container > span {
  color: #75758F;
  font-size: 1.2rem;
  font-weight: 400;
}
.invite__text--container__link {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  height: 5rem;
  width: 100%;
  background-color: #F6F6F7;
  padding: 1.6rem;
}
.invite__text--container__link--input {
  font-size: 1.4rem;
  width: 100%;
  border: none;
  padding: 0 0 0 1rem;
}
.fade-image {
  animation: fadeIn 1s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@media only screen and (max-width: 400px){
  .button-container--guest{
    height: 3rem;
    margin-top: 3rem;
  }
  .email{
    margin-left: 1.5rem;
  }

  .header-container--guest--invitation {

    height: 3rem;
    width:85vw;

    border-bottom: solid 0.1rem grey;
  }
  .body-container--guest {
    height: 35rem;
    width: 85vw;
  }

  .user-list__container {

    height: 7rem;
    width: 100%;
  }
  .table-container--guest {
    width: 100%;
    height: 10.2rem;
    display: flex;
    flex-direction: column;
    margin-top: 0.7rem;


  }
  .table__header--guest {

    height: 2.5rem;


  }
  .ul-container--guest {

    max-height: 12.2rem;

  }
  .invitation__text-container {

    margin-top: 1.5rem;
    margin-bottom: .5rem;
  }
  .invitation__text {
    width: 85vw;


  }
  .invitation__text textarea {
    width: 90%;
    height: 4rem;
    overflow-y: hidden;

  }
  .invitation__link input {

    height: 2rem;

  }
  .button-container--guest {
    width: 85vw;

  }
  .phone{
    display: none;
  }
  .table__header--guest > span:last-child {
    display: none;
  }
  .table__header--guest > span{
    width: 32%;
  }
  .user-list__participant {
    max-width: 85%;

  }
  .icon-container{
    width: 2.5rem;
    height: 2.5rem;
  }
  .icon-container{
    width: 2.5rem;
    height: 2.5rem;
  }
  .invite-user-table__list {

    padding: 0.4rem 1.6rem;
  }


}
@media  (min-width:401px ) and (max-width: 600px){
  .button-container--guest{

    margin-top: 3rem;
  }
  .email{
    margin-left: 1.5rem;
  }

  .header-container--guest--invitation {

    height: 3rem;
    width:85vw;

    border-bottom: solid 0.1rem grey;
  }
  .body-container--guest {
    height: 40rem;
    width: 85vw;
  }

  .user-list__container {

    height: 7rem;
    width: 100%;
  }
  .table-container--guest {
    width: 100%;
    height: 13.2rem;
    display: flex;
    flex-direction: column;
    margin-top: 0.7rem;


  }
  .table__header--guest {

    height: 3.5rem;


  }
  .ul-container--guest {

    max-height: 12.2rem;

  }
  .invitation__text-container {

    margin-top: 1.5rem;
    margin-bottom: .5rem;
  }
  .invitation__text {
    width: 85vw;


  }
  .invitation__text textarea {
    width: 90%;
    height: 4rem;
    overflow-y: hidden;

  }
  .invitation__link input {

    height: 2rem;

  }
  .button-container--guest {
    height: 3rem;
    width: 85vw;

  }
  .phone{
    display: none;
  }
  .table__header--guest > span:last-child {
    display: none;
  }
  .table__header--guest > span{
    width: 32%;
  }
  .user-list__participant {
    max-width: 85%;

  }
  .icon-container{
    width: 2.5rem;
    height: 2.5rem;
  }
  .invite-user-table__list {

    padding: 0.4rem 1.6rem;
  }

}
@media  (min-width:601px ) and (max-width: 767px){
  .button-container--guest{

    margin-top: 3rem;
  }
  .email{
    margin-left: 1.5rem;
  }

  .header-container--guest--invitation {

    height: 3rem;
    width:75vw;

    border-bottom: solid 0.1rem grey;
  }
  .body-container--guest {
    height: 40rem;
    width: 75vw;
  }

  .user-list__container {

    height: 7rem;
    width: 100%;
  }
  .table-container--guest {
    width: 100%;
    height: 13.2rem;
    display: flex;
    flex-direction: column;
    margin-top: 0.7rem;


  }
  .table__header--guest {

    height: 3.5rem;


  }
  .ul-container--guest {

    max-height: 12.2rem;

  }
  .invitation__text-container {

    margin-top: 1.5rem;
    margin-bottom: .5rem;
  }
  .invitation__text {
    width: 85vw;


  }
  .invitation__text textarea {
    width: 90%;
    height: 4rem;
    overflow-y: hidden;

  }
  .invitation__link input {

    height: 2rem;

  }
  .button-container--guest {
    height: 3rem;
    width: 75vw;

  }
  .phone{
    display: none;
  }
  .table__header--guest > span:last-child {
    display: none;
  }
  .table__header--guest > span{
    width: 32%;
  }
  .user-list__participant {
    max-width: 85%;

  }
  .icon-container{
    width: 2.5rem;
    height: 2.5rem;
  }


}
</style>

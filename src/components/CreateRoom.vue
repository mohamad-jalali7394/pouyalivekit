<template>
  <div class="create-room__container">
    <div class="create-room__choose-room" :style="{direction:$i18n.locale === 'fa'? 'rtl' : 'ltr'}">
      <span :style="{color:whichContract === $t('line-room') ? 'white' : '' ,'background-color':whichContract === $t('line-room') ? '#1B76FF' : ''}" @click="chooseRoom('اتاق لاین')">{{ $store.getters.t('line-room') }}</span>
      <span :style="{color:whichContract === $t('webinar-room') ? 'white' : '' ,'background-color':whichContract === $t('webinar-room') ? '#1B76FF' : ''}" @click="chooseRoom($t('webinar-room'))">{{ $store.getters.t('webinar-room') }}</span>
      <span :style="{color:whichContract === $t('private-room') ? 'white' : '' ,'background-color':whichContract === $t('private-room') ? '#1B76FF' : ''}" @click="chooseRoom($t('private-room'))">{{ $store.getters.t('private-room') }}</span>
      <span :style="{color:whichContract === $t('permanent-room') ? 'white' : '' ,'background-color':whichContract === $t('permanent-room') ? '#1B76FF' : ''}"  @click="chooseRoom(this.$t('permanent-room'))">{{ $store.getters.t('permanent-room') }}</span>

    </div>
    <span style="font-weight: 700;font-size: 1.4rem;width: 100%" :style="{direction:$i18n.locale === 'fa'? 'rtl' : 'ltr'}">{{ $store.getters.t('contract-status-at-a-glance') }}</span>
    <room-contract-card :rooms-length="whichRoom.rooms?.length" :end-date="endDate" :start-date="startDate" :allowed-concurrent-lines="allowedConcurrentLines" :remain-capacity="remainCapacity" :contract-type="whichRoom.contractType" :is-create-room="true" :rooms="whichRoom.rooms"></room-contract-card>
    <div class="create-room__action" :style="{direction:$i18n.locale === 'fa'? 'rtl' : 'ltr'}" v-if="whichContract === $t('line-room')">
      <span>{{whichContract}}</span>
      <base-button
          :is-active="true"
          :button-inner-txt=" $store.getters.t('create-a-new-room')"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
          :style-types="['large--button']"
          @click="openCreateRoom"

      >
        <template #pre-button-slot>
          <svg style="width: 18px;height: 18px" width="24" height="24" viewBox="0 0 24 24" fill="white"
               xmlns="http://www.w3.org/2000/svg">
            <path
                d="M19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z"
                fill="white"/>
          </svg>

        </template>
      </base-button>
    </div>
    <div style="width: 100%">
      <div
          class="create-room__rooms" :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
        <room-info :contract-type="whichRoom.contractType" :is-create-room="true" :contract-rooms="whichRoom.rooms" :ise-expired="iseExpired"  :which-contract="whichContract" @edit-room="editRoom" @delete-room="deleteRoomById" @open-create-room="openCreateRoom" @grant-private-room="grantPrivateRoom"></room-info>
      </div>
    </div>
  </div>



  <base-modal is-blur="true" :open="isCreateRoomOpen">
    <template #modal-header>
      <div class="create-room-header" :style="{direction: $i18n.locale !== 'en' ? 'ltr' : 'rtl' }">
        <img draggable="false" src="/img/close.svg" style="cursor: pointer;width: 2.4rem" @click="closeCreateRoom">
        <h1>{{ createOrEdit === 'create' ?  $store.getters.t('create-a-new-room')  : $store.getters.t('edit') }}</h1>
      </div>
    </template>
    <template #modal-body>
      <div :class=" $i18n.locale !== 'en' ? 'create-room-body' :'create-room-body-ltr' " >
        <div style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem;position: relative">
          <span style="font-size: 1.2rem;color: #75758F">{{$store.getters.t('room-name')}}</span>
          <input @blur="blurRoomName" class="create-room__input" :style="{border:isRoomNameEmpty ? 'solid 0.1rem red' : ''}" type="text"  v-model.trim="roomName">
          <span v-if="isRoomNameEmpty" style="color: red;position: absolute;bottom: -1.8rem;font-size: 1.1rem">{{$store.getters.t('the-room-name-must-not-be-empty')}}</span>

        </div>
        <div style="width: 100%;display: flex;flex-direction: row;justify-content: space-between">
          <div style="width: 45%;display: flex;flex-direction: column;gap: 0.8rem;position: relative">
            <span style="font-size: 1.2rem;color: #75758F">{{ $store.getters.t('room-capacity-remaining-capacity' , {max: this.maxCapacity}) }}</span>
            <input  @blur="blurMAxParticipant" class="create-room__input" :style="{border:((parseInt(roomMaxParticipantCount) > this.maxCapacity || parseInt(roomMaxParticipantCount) < 3) || isMaxParticipantEmpty) ? '0.1rem solid red': ''}" type="number" v-model="roomMaxParticipantCount">
            <span v-if="(parseInt(roomMaxParticipantCount) > this.maxCapacity || parseInt(roomMaxParticipantCount) < 3) || isMaxParticipantEmpty" style="color: red;position: absolute;bottom: -1.8rem;font-size: 1.1rem">{{ this.maxCapacity > 3 ? $store.getters.t('room-Participant-limit',{'maxParticipant':this.maxCapacity}) : 'تعداد کاربان حد اقل باید 3 باشد'}}</span>

          </div>
          <div style="width: 45%;display: flex;flex-direction: column;gap: 0.8rem;position: relative">
            <span style="font-size: 1.2rem;color: #75758F">{{$store.getters.t('max-publisher')}}</span>
            <input @blur="blurMAxPublisher" class="create-room__input" :style="{border:((parseInt(maxPublishUser) > meetingMaxPublishCount || parseInt(maxPublishUser) < 3) || isMaxPublisherEmpty) ? '0.1rem solid red': ''}" type="number" v-model="maxPublishUser">
                       <span v-if="(parseInt(maxPublishUser) > meetingMaxPublishCount || parseInt(maxPublishUser) < 3) || isMaxPublisherEmpty" style="color: red;position: absolute;bottom: -1.8rem;font-size: 1.1rem">
                        <span>{{$store.getters.t('max-publisher-limit',{'publisher':8 })}}</span>
                       </span>
          </div>

        </div>
        <div style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem">
          <span>{{ $store.getters.t('room-condition') }}</span>
          <div style="display: flex;flex-direction: row;gap: 0.8rem">
            <div style="display: flex;flex-direction: row;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding: 1rem 0.8rem;width: 9.6rem">
              <input class="activation-input" type="radio" id="activateRoom" name="activateRoom" value="active" v-model="activateRoom">
              <label class="activation-label"  for="activateRoom">{{ $store.getters.t('active') }}</label>
            </div>
            <div style="display: flex;flex-direction: row;gap: 0.8rem;background-color:#F6F6F7;border-radius: 0.8rem;padding:1rem 0.8rem;width: 9.6rem">
              <input class="activation-input"  type="radio" id="inactivateRoom" name="inactivateRoom" value="inactive"  v-model="activateRoom">
              <label class="activation-label"  for="inactivateRoom">{{ $store.getters.t('in-active') }}</label>
            </div>
          </div>
        </div>
<!--        <section>-->
<!--          <div style="position: relative">-->
<!--            <span>{{$store.getters.t('room-name')}}</span>-->
<!--            <input @blur="blurRoomName" :style="{border:isRoomNameEmpty ? 'solid 0.1rem red' : ''}" type="text" v-model.trim="roomName">-->
<!--            <div v-if="isRoomNameEmpty" style="color: red;position:absolute;bottom: -1.8rem;font-size: 1.1rem">{{$store.getters.t('empty-room-name')}}</div>-->
<!--          </div>-->
<!--          <div style="position: relative">-->
<!--            <span>{{$store.getters.t('max-participants')}}</span>-->
<!--            <input @blur="blurMAxParticipant" :style="{border:((parseInt(roomMaxParticipantCount) > this.maxCapacity || parseInt(roomMaxParticipantCount) < 3) || isMaxParticipantEmpty) ? '0.1rem solid red': ''}" type="number" v-model="roomMaxParticipantCount">-->
<!--            <span v-if="(parseInt(roomMaxParticipantCount) > this.maxCapacity || parseInt(roomMaxParticipantCount) < 3) || isMaxParticipantEmpty" style="color: red;position: absolute;bottom: -2.5rem;font-size: 1.1rem">{{$store.getters.t('room-Participant-limit',{'maxParticipant':this.maxCapacity})}}</span>-->
<!--          </div>-->
<!--        </section>-->
        <!--        <section>-->
        <!--        </section>-->
<!--        <section>-->
<!--          <div style="position: relative">-->
<!--            <span>{{$store.getters.t('max-publisher')}}</span>-->
<!--            <input @blur="blurMAxPublisher" :style="{border:((parseInt(maxPublishUser) > meetingMaxPublishCount || parseInt(maxPublishUser) < 3) || isMaxPublisherEmpty) ? '0.1rem solid red': ''}" type="number" v-model="maxPublishUser">-->
<!--            <span v-if="(parseInt(maxPublishUser) > meetingMaxPublishCount || parseInt(maxPublishUser) < 3) || isMaxPublisherEmpty" style="color: red;position: absolute;bottom: -2.5rem;font-size: 1.1rem">-->
<!--              <span>{{$store.getters.t('max-publisher-limit',{'publisher':meetingMaxPublishCount })}}</span>-->
<!--            </span>-->
<!--          </div>-->
<!--        </section>-->
      </div>
    </template>
    <template #modal-buttons>
      <div style="width: 100%;height: 4rem;display: flex;justify-content: flex-start;align-items: center;gap: 0.8rem">
        <base-button
            v-if="createOrEdit === 'create'"
            :is-active="true"
            :button-inner-txt="$store.getters.t('save')"
            :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
            :style-types="['large--button']"
            @click="createRoomByCustomer"
        >
        </base-button>
        <base-button
            v-else
            :is-active="true"
            :button-inner-txt="$store.getters.t('save')"
            :continuous-params="[
          'background-color=#1B76FF',
          'color=white',
          ]"
            :style-types="['large--button']"
            @click="editRoomByCustomer"
        >
        </base-button>
        <base-button
            :is-active="true"
            :button-inner-txt="$store.getters.t('withdrawal')"
            :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
            :style-types="['large--button']"
          @click="closeCreateRoom"
        >
        </base-button>
      </div>
    </template>
  </base-modal>
  <base-modal :open="isDeleteRoomOpen">
    <template #modal-header>
      <div class="delete-room-modal-header">
        <h2>{{$t('delete_room')}}</h2>
        <img draggable="false" style="width: 2.4rem;height: 2.4rem;cursor: pointer" src="/img/close.svg" @click="closeDeleteRoomModal">
      </div>
    </template>
    <template #modal-body>
      <div class="delete-room-modal-body">
        <span>{{$t('Are_you_sure_delete_room')}}</span>


      </div>
    </template>
    <template #modal-buttons>
      <div class="delete-room-modal-action">
        <base-button
            :is-active="true"
            :button-inner-txt="$t('withdrawal')"
            :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
            :style-types="['large--button']"
            @click="closeDeleteRoomModal"

        >
        </base-button>
        <base-button
            :is-active="true"
            :button-inner-txt="$t('yes-delete-it')"
            :continuous-params="[
          'background-color=#EC3737',
          'color=white',
          ]"
            :style-types="['large--button']"
            @click="deleteRoom">

        </base-button>
      </div>
    </template>
  </base-modal>

  <base-modal :open="isGrantRoomOpen">
    <template #modal-header>
      <div class="create-room-header">
        <img draggable="false" style="width: 2.4rem;height: 2.4rem;cursor: pointer" src="/img/close.svg" @click="isGrantRoomOpen = false">
        <h2>{{$t('room_assignment')}}</h2>
      </div>
    </template>
    <template #modal-body>
      <div :class=" $i18n.locale !== 'en' ? 'grant-room-body' :'grant-room-body' " >
        <div style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem;position: relative">
          <span style="font-size: 1.2rem;color: #75758F">{{$store.getters.t('room-name')}}</span>
          <input @blur="blurRoomName" class="create-room__input" :style="{border:isRoomNameEmpty ? 'solid 0.1rem red' : ''}" type="text"  v-model.trim="roomName">
          <span v-if="isRoomNameEmpty" style="color: red;position: absolute;bottom: -1.8rem;font-size: 1.1rem">{{$store.getters.t('the-room-name-must-not-be-empty')}}</span>

        </div>
        <div style="width: 50%;position: relative">
          <label style="color: #75758F;font-size : 1.2rem;width: 100%;">{{$t('user_selection')}}</label>
          <div class="create-room__input" v-if="grantedUser">
            <div style="display: flex;flex-direction: row;align-items: center;height: 100%;gap: 0.8rem">
              <div style="font-weight: 400;font-size: 1.2rem">
                {{
                  grantedUser.firstName +
                  " " +
                  grantedUser.lastName
                }}
              </div>

              <img draggable="false" src="/img/close.svg" style="width: 16px;height: 16px;cursor: pointer" @click="deleteUser">

            </div>
          </div>
          <input v-else type="text" ref="chooseUser" class="create-room__input" v-model="searchedName" @keyup="searchUser"
                 @focus="focusUser" @blur="blurUser"/>
          <div
              class="found-users-in-group--container"
              v-if="foundUserToGrantRoom.length > 0"
              :style="{'max-height':'21rem'}"
          >
            <ul :style="{'max-height':'21rem'}">
              <li
                  v-for="user in foundUserToGrantRoom"
                  :key="user.id"
                  class="found-user-invite-list"
                  @mousedown="clickToGrantUser(user)"
              >
                {{ user.firstName + " " + user.lastName }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
    <template #modal-buttons>
      <div class="grant-room-modal-action">
        <base-button
            :is-active="true"
            :button-inner-txt="$t('confirm-layout')"
            :continuous-params="['color=white', 'background-color=#1B76FF','height=3.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem','padding=0 2rem']"
            @click="assignPrivateRoom()"
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
import RestClient from "@/api/restClient";
import entityTypes from "../statics/entityTypes";
import RoomInfo from "./RoomInfo";
import RoomContractCard from "./RoomContractCard";
import BaseButton from "./UI/BaseButton";
import BaseLoadingSpinner from "@/components/UI/BaseLoadingSpinner.vue";
// import eventBus from "../utils/event.bus";

export default {
  name: "CreateRoom",
  components: {BaseLoadingSpinner, BaseButton, RoomContractCard, RoomInfo,BaseModal},
  props:['roomList','allRooms','contractType'],
  data() {
    return {
      whichContract: this.$store.getters.t('line-room'),
      activateRoom:'active',
      isCreateRoomOpen: false,
      isDeleteRoomOpen:false,
      roomName: '',
      roomMaxParticipantCount: null,
      maxPublishUser: null,
      isMaxPublisherEmpty:false,
      isMaxParticipantEmpty:false,
      isWebinar: false,
      restClientRoom: new RestClient(entityTypes.room),
      restClientBilling: new RestClient('billing'),
      planName: '',
      startDate: '',
      endDate: '',
      allowedConcurrentLines:null,
      remainCapacity: 0,
      planId: null,
      customerId: null,
      meetingMaxParticipantCount: null,
      rooms: [],
      lineRooms:[],
      roomId: null,
      createOrEdit: 'create',
      meetingMaxPublishCount : 0,
      iseExpired:false,
      isRoomNameEmpty:false,
      meetingMaxParticipantCountInPlan: 0,
      isGrantRoomOpen:false,
      restClientUser: new RestClient("user"),
      allUsers:[],
      isLoading:false,
      foundUserToGrantRoom:[],
      isUserFocused:false,
      grantedUser:null,
      searchedName:'',
      isUserChoose:false,
      restClientPrivateRoom: new RestClient("privateRoom"),
    }
  },
  watch: {
    contractType:{
      immediate:true,
      handler(val){
        if (val) {
          switch (val){
            case 'سرویس ویدیو لاین':
              this.whichContract = 'اتاق لاین';
              break;
            case 'اتاق های وبینار':
              this.whichContract = this.$t('webinar-room');
              break;
            case 'اتاق های خصوصی':
              this.whichContract = this.$t('private-room');
              break;
            case 'اتاق جلسات مجازی':
              this.whichContract = this.$t('permanent-room');
              break;

          }
        }
      }
    }
  },
  computed:{
    maxCapacity (){
      if (this.remainCapacity >= this.meetingMaxParticipantCountInPlan){
        return this.meetingMaxParticipantCountInPlan
      }else {
        return this.remainCapacity
      }
    },
    whichRoom(){
      if (this.whichContract === 'اتاق لاین'){
        return this.allRooms[3]
      }else if(this.whichContract === this.$t('webinar-room')){
        return this.allRooms[1]
      }else if(this.whichContract === this.$t('private-room')){
        return this.allRooms[2]
      }else {
        return this.allRooms[0]
      }
    }
  },
  methods: {
    blurRoomName(){
      if (this.roomName === ''){
        this.isRoomNameEmpty = true
      }else {
        this.isRoomNameEmpty = false
      }
    },
    blurMAxParticipant(){
      if (this.roomMaxParticipantCount === '' || this.roomMaxParticipantCount === null){
        this.isMaxParticipantEmpty = true
      }else {
        this.isMaxParticipantEmpty = false
      }
    },
    blurMAxPublisher(){
      if (this.maxPublishUser === ''|| this.maxPublishUser === null){
        this.isMaxPublisherEmpty = true
      }else {
        this.isMaxPublisherEmpty = false
      }
    },
    getAllPlanByCustomerId() {
      this.restClientBilling.getAll('1').then((data) => {
        const linePlanIndex = data.data.findIndex((plan) => {
          return plan.planType == 1
        })
        if (linePlanIndex !== -1) {
          this.panName = data.data[0].planName
          this.startDate = data.data[0].startDateTime.toString().split(' ')[0]
          this.endDate = data.data[0].endDateTime.toString().split(' ')[0]
          this.meetingMaxParticipantCountInPlan = data.data[0].meetingMaxParticipantCount
          this.remainCapacity = data.data[0].leftCapacity
          this.meetingMaxParticipantCount = data.data[0].meetingMaxParticipantCount
          this.planId = data.data[0].id
          this.customerId = data.data[0].customerId
          this.allowedConcurrentLines = data.data[0].allowedConcurrentLines
          this.meetingMaxPublishCount = data.data[0].meetingMaxPublishCount
          this.getContract(this.planId)
          this.getAllRoomByCustomerIdAndPlanId()
        } else {
          this.panName = 'اطلاعاتی وجود ندارد'
          this.startDate = 'اطلاعاتی وجود ندارد'
          this.endDate = 'اطلاعاتی وجود ندارد'
          this.remainCapacity = 'اطلاعاتی وجود ندارد'
        }

      }).catch((err) => {
        console.error(err)
      })
    },
    chooseRoom(room){
      console.error('whhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhich')
      console.error(room)
      console.error(this.allRooms)
      this.whichContract = room
    },
    openCreateRoom() {
      this.createOrEdit = 'create'
      this.isCreateRoomOpen = true
    },
    closeCreateRoom() {
      this.isCreateRoomOpen = false
      this.maxPublishUser = null
      this.roomMaxParticipantCount = null
      this.roomName = ''
      this.roomMaxParticipantCount= null
      this.isMaxPublisherEmpty=false
      this.isMaxParticipantEmpty=false
    },
    getAllRoomByCustomerIdAndPlanId() {
      this.rooms = []
      this.restClientRoom
          .getAllRoomByCustomerIdAndPlanId(this.customerId, this.planId)
          .then((response) => {
           this.lineRooms = response.data
            for (let i = 0; i < response.data.length; i++) {
              this.rooms.push(response.data[i])
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-undef
            console.error(error)
          });
    },
    createRoomByCustomer() {
      const data = {
        name: this.roomName,
        customerId: this.customerId,
        concurrentTimeCapacity: 100000,
        concurrentUserCapacity: this.roomMaxParticipantCount,
        roomOwnerUserId: this.$store.getters.userId,
        roomStatus: true,
        isWebinar: false,
        billingPlanId: this.planId,
        meetingMaxParticipantCount: this.roomMaxParticipantCount,
        maxPublishUser: this.maxPublishUser,
      }
      const foundedRoomIdx = -1
      if(((parseInt(this.maxPublishUser) <= this.meetingMaxPublishCount && parseInt(this.maxPublishUser)) > 2 && (parseInt(this.roomMaxParticipantCount) <= 100 && parseInt(this.roomMaxParticipantCount) > 2 ) && this.roomName !== '' ) && foundedRoomIdx === -1){
        this.restClientRoom
            .createRoomByCustomer(data, this.customerId)
            .then(() => {
              this.$emit('update-room')
              this.getAllPlanByCustomerId()
              this.closeCreateRoom()
            })
            .catch((error) => {
              console.error(error)
            });
      }else{
        if (foundedRoomIdx === -1){
          this.eventBus.emit('notification',{
            type: 'error',
            title: 'error',
            bodyText: this.$store.getters.t('can-not-create-room'),
            time: 7000
          })
        }else {
          this.eventBus.emit('notification',{
            type: 'error',
            bodyText: this.$store.getters.t('same-room-name') ,
            time: 7000
          })
        }

      }
    },
    editRoom(room) {
      this.createOrEdit = 'edit'
      this.isCreateRoomOpen = true
      this.maxPublishUser = room.maxPublishUser
      this.roomMaxParticipantCount = room.meetingMaxParticipantCount
      this.roomName = room.name
      this.roomId = room.id
    },
    getContract(id){
      this.restClientBilling.getContract(id).then((response)=>{
        this.iseExpired = response.data.data.expired
        if (this.iseExpired){
          this.eventBus.emit('notification',{
            type: 'error',
            title: 'error',
            bodyText: this.$store.getters.t('plan-line-expired'),
            time: 7000
          })
        }
      }).catch((err)=>{
        console.error(err)
      })
    },
    editRoomByCustomer() {
      if (this.maxPublishUser < 21) {
        const data = {
          id: this.roomId,
          name: this.roomName,
          customerId: this.customerId,
          concurrentTimeCapacity: 100000,
          concurrentUserCapacity: this.roomMaxParticipantCount,
          roomOwnerUserId: this.$store.getters.userId,
          roomStatus: true,
          isWebinar: false,
          billingPlanId: this.planId,
          meetingMaxParticipantCount: this.roomMaxParticipantCount,
          maxPublishUser: this.maxPublishUser,
        }
        this.restClientRoom
            .updateRoomByCustomer(data)
            .then(() => {
              this.$emit('update-room')
              this.getAllPlanByCustomerId()
              this.closeCreateRoom()
            })
            .catch((error) => {
              // eslint-disable-next-line no-undef
              console.error(error)
            });
      } else {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: this.$store.getters.t("maxPublisherWarning"),
          time: 5000,
        });
      }
    },
    deleteRoomById(id) {
      this.isDeleteRoomOpen = true
      this.roomId = id


    },
    deleteRoom(){
      this.restClientRoom
          .deleteRoom(this.customerId, this.roomId)
          .then(() => {
            this.$emit('update-room')
            this.closeDeleteRoomModal()
            this.getAllPlanByCustomerId()
          })
          .catch((error) => {
            // eslint-disable-next-line no-undef
            console.error(error)
          });
    },
    closeDeleteRoomModal(){
      this.isDeleteRoomOpen = false
      this.roomId = null
    },
    grantPrivateRoom(room) {
      this.isGrantRoomOpen = true
      this.roomName = room.name
      this.roomId = room.id
      this.getAllUsers()
    },
    getAllUsers() {
      this.isLoading = true
      this.allUsers = [];
      this.restClientUser
          .getAll()
          .then((users) => {
            this.allUsers = users;
            this.isLoading = false
          })
          .catch((err) => {
            this.isLoading = false
            console.log(err);
          });
    },
    focusUser() {
      this.isUserFocused = true;
    },
    blurUser() {
      this.isUserFocused = false;
    },
    clickToGrantUser(user) {
      this.grantedUser = user
      this.searchedName = ''
      this.foundUserToGrantRoom = []
    },
    searchUser() {
      const inpValue = this.searchedName;
      if (this.searchedName === "") {
        this.isUserFound = false;
      }
      this.foundUserToGrantRoom = this.allUsers.filter((el) => {
        if (
            ((el.firstName + " " + el.lastName).includes(inpValue) ||
                el.username.includes(inpValue)) &&
            inpValue.length !== 0
        ) {
          return true;
        }
      });
    },
    deleteUser() {
      this.isUserChoose = false;
      this.grantedUser = null;
      this.searchedName = ''
      setTimeout(() => {
        this.$refs.chooseUser.focus()
      }, 10)
    },
    assignPrivateRoom() {
      this.restClientPrivateRoom.assign(this.grantedUser.id, this.roomId).then(() => {
        this.isGrantRoomOpen = false
        this.isUserChoose = false;
        this.grantedUser = null;
        this.searchedName = ''
        this.allUsers=[]
        this.isLoading=false
        this.foundUserToGrantRoom=[]
        this.isUserFocused=false
        this.eventBus.emit('get-private-rooms')
      }).catch((error) => {
        console.error(error)
      })
    },
  },
  mounted() {
    this.getAllPlanByCustomerId()
  }
}
</script>

<style scoped>
.create-room__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  align-items: flex-end;
  padding: 1.6rem;
}
.create-room__choose-room{
  width: 100%;
  display: flex;
  gap: 0.8rem;
}
.create-room__choose-room > span{
 padding: 0.8rem 1.6rem;
  background-color: #F6F6F7;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  font-size: 1.4rem;
  cursor: pointer;
}
.create-room__action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
  width: 100%;
}
.create-room__action > span {
font-size: 1.4rem;
  font-weight: 700;
}
.table-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;

}
.activation-input ,.activation-label {
  cursor: pointer;
  font-size: 1.4rem;
}
.table-container-mobile{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  display: none;

}


table {
  border-collapse: collapse;
  width: 100%;
  font-size: 1.4rem;
  table-layout: fixed;
  -webkit-box-shadow: 0px 0px 12px 0 rgba(0, 0, 0, 0.25);
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.25);
}

td, tr, th {
  border: none;
  text-align: center;
  padding: 8px 2px;
}

td, th {
  max-width: 20%;
  word-wrap: break-word;
}

th {
  background-color: #7ba4ee;
  color: white;
}

tr {
  max-width: 100%;
}

.create-room__rooms {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1.6rem;
  justify-content: flex-start;
  padding: 1rem 0;
  margin-top: 2rem;

}

.create-room-header {
  width: 66rem;
  height: 3rem;
  display: flex;

  align-items: center;
  justify-content: space-between;
  position: relative;
  left: 1rem;
}

.create-room-body {
  width: 66rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
}

.create-room-body-ltr {
  width: 66rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
}
.grant-room-body {
  width: 66rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  align-items: center;
  padding: 1rem 0;
}
.create-room-body > section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 6rem;
}

.create-room-body-ltr > section {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 6rem;
}

.create-room__input {
  width: 100%;
  height: 3.2rem;
  padding: 0.8rem;
  direction: rtl;
  background-color: #F6F6F7;
  border: none;
  border-radius: 0.8rem;
}

.create-room__input:focus {
  outline: 0;
  background-color: transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}

/*.create-room-body > section input:focus {*/
/*  outline: none;*/
/*  border: solid 0.1rem #1a73e8;*/
/*}*/

/*.create-room-body-ltr > section input:focus {*/
/*  outline: none;*/
/*  border: solid 0.1rem #1a73e8;*/
/*}*/

.create-room-body > section > div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 48.5%;
  height: 100%;
  justify-content: space-between
}

.create-room-body-ltr > section > div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 48.5%;
  height: 100%;
  justify-content: space-between
}

.create-room-action {
  background-color: #95d1cc;
  padding: 1rem 2rem;
  cursor: pointer;
  border: 0.1rem solid transparent;
  border-radius: 2rem;
  color: white;
}

.create-room-action:hover {
  background-color: #4cc9b7;

}

.add-room-fragment {
  width: 24.2%;
  height: 20rem;
}


.add-room {
  color: #7b7b7b;
  width: 40%;
  height: 40%;
  display: flex;
  border: solid 0.1rem;
  justify-content: center;
  align-items: center
}

.is-webinar {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  width: 100%;
  gap: 0.5rem;
}

.is-webinar > * {
  cursor: pointer;
}

.is-webinar-ltr {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  gap: 0.5rem;
}

.is-webinar-ltr > * {
  cursor: pointer;
}
.delete-room-modal-header{
  width:40rem ;
  padding: 2rem 0;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.1rem solid #DCDADA;
}
.delete-room-modal-body{
  width:40rem ;
 padding:0 0 3rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 0.1rem solid #DCDADA;
  font-size: 1.6rem;
  font-weight: 400;
  justify-content: flex-start;
}
.delete-room-modal-action{
  width:40rem ;
  height: 5rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
}
.found-users-in-group--container {
  position: absolute;
  width: 30rem;
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
@media (max-width: 1480px) {
  .add-room-fragment {
    width: 24.2%;
    height: 20rem;
  }


}

@media (max-width: 1380px) {
  .add-room-fragment {
    width: 32.5%;
    height: 20rem;
  }


}

@media (max-width: 1200px) {
  .add-room-fragment {
    width: 32.5%;
    height: 20rem;
  }


}

@media (max-width: 1128px) {
  .add-room-fragment {
    width: 32.5%;
    height: 20rem;
  }


}

@media (max-width: 1028px) {
  .add-room-fragment {
    width: 48.5%;
    height: 20rem;
  }

}

@media (max-width: 980px) {
  .add-room-fragment {
    width: 48.5%;
    height: 20rem;
  }

}


@media (max-width: 860px) {
  .create-room-header {
    width: 85vw;
  }

  .create-room-body {
    width: 85vw;
  }


  .add-room-fragment {
    height: 20rem;
    width: 80%;
  }


  .create-room__rooms {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 2rem;
    align-items: center;
    justify-content: flex-start;

  }
}

@media (max-width: 680px) {
  .add-room-fragment {
    height: 20rem;
    width: 80%;
  }
  .table-container{
    display: none;
  }
  .table-container-mobile {
    display: flex;
  }

  .create-room__rooms {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 2rem;
    align-items: center;
    justify-content: flex-start;

  }

}

@media (max-width: 480px) {
  .create-room-body > section {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;
    margin-bottom: -1.5rem;
  }

  .create-room-body > section > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    justify-content: space-around;
    margin: 1.5rem 0;
  }

  .create-room-body-ltr > section > div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    justify-content: space-around;
  }

  .create-room-body > section > input {
    border: 0.1rem solid rgb(128, 128, 128);
    border-radius: 0.5rem;
    width: 100%;
    height: 3rem;
    padding: 0 0.5rem;

  }

  .create-room-body-ltr > section > input {
    border: 0.1rem solid rgb(128, 128, 128);
    border-radius: 0.5rem;
    width: 100%;
    height: 3rem;
    padding: 0 0.5rem;

  }

  .create-room-header {
    width: 85vw;
    margin: 0 !important;
  }

  .create-room-body {
    width: 85vw;
  }

  .add-room-fragment {
    height: 20rem;
    width: 100%;
  }


  .create-room__rooms {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    justify-content: flex-start;

  }
}
@media (max-width: 480px) {
  .create-room__choose-room{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }
}
</style>

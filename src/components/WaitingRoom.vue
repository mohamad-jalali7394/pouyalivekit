<template>
  <device-test-fragment>
    <div v-if="camerasList.length !==0 && videoStream" class="display-local-fragment">

<!--      <div class="display-local-fragment__controls">-->
<!--        <div  @click="muteCamera" :style="{backgroundColor: cameraStatus ? '' : '#EC3737',border:cameraStatus ?'0.1rem solid white' : '0.1rem solid transparent'}">-->
<!--          <camera-icon color="white" :camera-status="cameraStatus"></camera-icon>-->
<!--        </div>-->
<!--        <div  @click="muteMicrophone" v-if="!$store.getters.hasModerator" :style="{backgroundColor: micStatus ? '' : '#EC3737',border:micStatus ?'0.1rem solid white' : '0.1rem solid transparent'}">-->
<!--          <microphone-icon color="white" :mic-status="micStatus" ></microphone-icon>-->
<!--        </div>-->
<!--      </div>-->

      <div
          v-if="!cameraStatus"
          class="display-local-fragment__mute-mask"
      >
        <img draggable="false"  src="/img/contact-logo.svg" alt="not loaded">
      </div>
      <the-display
          :video-stream="videoStream"
      >
      </the-display>
    </div>
    <div class="base-loading-spinner__container" v-else-if="!videoStream">
      <base-loading-spinner size-ratio="1" spinner-color="#409EFF" ></base-loading-spinner>
    </div>
    <div :style="{  height :amIGuestUser  ? '29rem' : '25rem'}" class="devices">
      <div v-if="isChangeDevices !== 'yes'" class="devices--nick-name">
        <span style="  font-size: 1.2rem;
  font-weight: 400;
  color: #75758F;width: 100%;display: flex" :style="{'flex-direction' : $i18n.locale !== 'en' ? 'row' : 'row-reverse'}" >{{$store.getters.t("name")}}</span>
        <input v-if="amIGuestUser" ref="guestUserInput" @input="getUserName" @keyup.enter="enterRoom" v-model.trim="userNameInput"  type="text" autocomplete="off"  :class=" $i18n.locale === 'fa' ? 'guest--username--input-rtl' : 'guest--username--input-ltr'" :placeholder="$store.getters.t('enter-full-name')">
        <input v-else ref="organizationalUserInput" @blur="getDisplayName" @keyup.enter="enterRoom" v-model.trim="displayNameInput"  type="text" autocomplete="off" :class=" $i18n.locale === 'fa' ? 'displayname--input-rtl' : 'displayname--input-ltr'" :placeholder="$store.getters.t('enter-nick-name')">
      </div>
      <div v-if="amIGuestUser && isChangeDevices !== 'yes'" style="width: 100% ; height: 2.3rem;margin-bottom: 0.6rem">
        <base-select :is-drop-downOpen="isDropDownOpen" :option-values="languages" v-model="selectedLang"
                     max-height="20rem" :side="'select-ltr'" :arrow-direction="'arrow-down-icon-ltr'"
                     :select-side="'list-item__label-ltr'" down-img-color="#1B76FF"></base-select>
      </div>
      <div class="devices--cameras">
        <camera-test
            :cameras-list="camerasList"
            :selected-camera="selectedCamera"
            @video-stream="getVideoStream"
        >
        </camera-test>
      </div>
      <div class="devices--microphones">
        <microphone-test
            :selected-mic="selectedMic"
            :mics-list="micsList">
        </microphone-test>
      </div>
      <div class="devices--speakers">
        <speakers-test
            :speakers-list="speakersList"
            :selected-speaker="selectedSpeaker"
        ></speakers-test>
      </div>
      <div style="width: 100%;margin-top: 2.2rem">
        <input ref="textarea" @keypress.enter="EnterToMeeting"  @input="getUserName"   :placeholder='$t("enter-full-name")' :class=" $i18n.locale === 'fa' ? 'guest--username--input-rtl' : 'guest--username--input-ltr'" v-model.trim="userNameInput" />

      </div>
    </div>
  </device-test-fragment>
</template>

<script>
import DeviceTestFragment from "./UI/DeviceTestFragment";
import entityTypes from '@/statics/entityTypes';
import RestClient from '@/api/restClient';
import userStatus from "../statics/types/userStatus";
import TheDisplay from "./UI/TheDisplay";
import CameraTest from "./CameraTest";
import MicrophoneTest from "./MicrophoneTest";
import BaseLoadingSpinner from "./UI/BaseLoadingSpinner";
import BaseSelect from "./UI/BaseSelect";
import SpeakersTest from "@/components/SpeakersTest.vue";
// import CameraIcon from "@/components/UI/Icons/CameraIcon.vue";
// import MicrophoneIcon from "@/components/UI/Icons/MicrophoneIcon.vue";
// import momentJalali from "moment-jalaali";
import {nextTick} from "vue";
import auth from "@/store/auth";
// import momentjs from "moment";
export default {
  name: "WaitingRoom",
  components: {
    SpeakersTest, MicrophoneTest, CameraTest, TheDisplay, DeviceTestFragment,BaseLoadingSpinner,BaseSelect},
  emits: ['guest-name'],
  props:['isChangeDevices','currentDevices','availableDevices'],
  data(){
    return {
      languages:[
        {
          label: 'فارسی . Fa'
        },
        {
          label: 'انگلیسی . En'
        },
      ],
      selectedLang:{
        label: 'فارسی . Fa'
      },
      isDropDownOpen:false,
      userNameInput:'',
      isUserNameInput: false,
      amIGuestUser : false,
      displayNameInput:'',
      meetingType : '',
      meetingInfo: '',
      randomUserId: Math.floor(10000000 + Math.random() * 9000000),
      restClientRoom: new RestClient(entityTypes.invite),
      restClientPrivate: new RestClient(entityTypes.privateRoom),
      // devices: {
      //   microphones: {
      //     microphonesList: [],
      //     selectedMicrophone: null,
      //     micStream: null,
      //     isMicMute : false
      //   },
      //   cameras: {
      //     camerasList: [],
      //     selectedCamera: null,
      //     videoStream: null,
      //     isVideoMute : false
      //   },
      //   speakers: {
      //     speakersList: [],
      //     selectedSpeaker: null,
      //   },
      // },
      camerasList: [],
      selectedCamera: this.$t("loading"),
      micsList: [],
      selectedMic: this.$t("loading"),
      selectedSpeaker: this.$t("loading"),
      speakersList: [],
      videoStream : null,
      isCameraFound:true,
      cameraStatus:true,
      micStatus:false,
    }
  },
  watch:{
    selectedLang: {
      deep: true,
      handler(value) {
        if(value.label === 'فارسی . Fa'){
          this.$i18n.locale = 'fa'

        }else {
          this.$i18n.locale = 'en'
        }

        localStorage.setItem('language',`${value.label}`)
        this.eventBus.emit('reset-input')
        this.eventBus.emit('change-language')



      }
    },
  },

  methods: {
    getPrivateRoomInformationGuest(){
      this.restClientPrivate
          .getRoomInfo(this.meetingInfo)
          .then((data) => {
            this.$store.dispatch('setCustomerId',data.customerId)
            this.$store.dispatch('setUserId',this.randomUserId)
            this.$store.dispatch('setCustomerId',data.customerId)
            this.$store.dispatch('setRoomId',data.id)
            this.$store.dispatch("setSessionId", data.id);
            this.$store.dispatch('setOwnerName',data.ownerName)
            this.$store.dispatch('setMeetingName',"اتاق شخصی" + " " + data.roomName)
            this.$store.dispatch('setPassword','')
            // this.$store.dispatch('setModeratorId', data.moderatorUserId);
            this.$store.dispatch("setHasModerator", true);
            auth.setHasModerator(true)
            auth.setVrAddress(data.vr)
          })
    },
    getUserName(e){
      this.$emit('guest-name', e.target.value );
      this.$store.dispatch('setUsername',this.userNameInput)
      this.$store.dispatch('setDisplayName',this.userNameInput)
    },
    getDisplayName(){
      if (this.displayNameInput !== '' && this.displayNameInput !== null && this.displayNameInput !== undefined){
        this.$store.dispatch('setUsername',this.displayNameInput)
        this.$store.dispatch('setDisplayName',this.displayNameInput)
      }
    },

    async loadCameras() {
      await navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
        // this.eventBus.emit('waiting-room-camera')
        this.cameraAspectRatio = 4 / 3;
        console.log(stream)
      }).catch(err => {
        console.log(err)
        // this.eventBus.emit('waiting-room-camera')
        this.cameraAspectRatio = 4 / 3
        this.isCameraFound = false
      });

      const loadedDevices = await navigator.mediaDevices.enumerateDevices();
      loadedDevices.forEach((device) => {
        if (device.kind === 'videoinput') {
          this.camerasList.push(device)
        }
      })

      this.$store.dispatch('setCameraId', this.camerasList[0].deviceId)
      this.selectedCamera = this.camerasList[0]
      nextTick(()=>{
        this.eventBus.emit('devices-is-loaded')
      })
      //  }else{
      //   nextTick(()=>{
      //     this.eventBus.emit('waiting-room-camera')
      //   })
      //
      // }
      // let isCameraAvailable = true;
      // try{
      //   await navigator.mediaDevices.getUserMedia({video: true})
      //   this.cameraAspectRatio = 4 / 3;
      // }
      // catch(err){
      //   console.log('camera not found')
      //   console.log(err)
      // }
      // // let index = -1
      // const loadedDevices = await navigator.mediaDevices.enumerateDevices();
      //
      // loadedDevices.forEach((device) => {
      //   if (device.kind === 'videoinput') {
      //     if(!device.deviceId){
      //       this.eventBus.emit("notification", {
      //       title: "پیام",
      //       type: "error",
      //       bodyText: "بدون وب کم نمیتوانید وارد شوید",
      //       time: 5000,
      //     });
      //     isCameraAvailable = false;
      //     }
      //     this.devices.cameras.camerasList.push(device)
      //   }
      // });
      // if(!isCameraAvailable) return this.$store.dispatch('setMyInfo', {type : 'amIHaveCamera', payload: false});
      // // if (localStorage?.getItem('set-camera')){
      // //   index = this.devices.cameras.camerasList.findIndex((el)=>{
      // //     return el.deviceId === localStorage?.getItem('set-camera')
      // //   })
      // //   if (index !== -1){
      // //     this.devices.cameras.selectedCamera =  this.devices.cameras.camerasList[index]
      // //   }else {
      // //     this.devices.cameras.selectedCamera =
      // //         this.devices.cameras.camerasList[0];
      // //   }
      // // }else{
      // let selectedCameraIdx = this.devices.cameras.camerasList.findIndex((camera) => {
      //   return camera.label === this.currentDevices.videoInput.label
      // })
      // if (selectedCameraIdx !== -1) {
      //   this.devices.cameras.selectedCamera = this.devices.cameras.camerasList[selectedCameraIdx]
      // }
      // this.eventBus.emit('is-camera-found',this.devices.cameras.camerasList.length)
      // // this.devices.cameras.selectedCamera = this.devices.cameras.camerasList[0];

    },


    // async loadCameras() {
    //   const loadedDevices = await navigator.mediaDevices.enumerateDevices();
    //   loadedDevices.forEach((device) => {
    //     if (device.kind === "videoinput") {
    //       this.devices.cameras.camerasList.push(device);
    //     }
    //   });
    //   this.eventBus.emit('is-camera-found',this.devices.cameras.camerasList.length)
    //   this.devices.cameras.selectedCamera = this.devices.cameras.camerasList[0];
    // },


    async loadMicrophones() {
      try {
        await navigator.mediaDevices.getUserMedia({audio: true});
        const loadedDevices = await navigator.mediaDevices.enumerateDevices();
        if (loadedDevices?.length > 0){
          this.eventBus.emit('waiting-room-camera')
        }
        const microphones = []
        loadedDevices.forEach((device) => {

          if (device.kind === 'audioinput') {
            microphones.push(device)
          }
        })
        const seenGroupIds = new Set();
        for (const mic of microphones) {
          if (!seenGroupIds.has(mic.groupId)) {
            seenGroupIds.add(mic.groupId);
            this.micsList.push(mic);
          }
        }

        this.$store.dispatch('setMicrophoneId', this.micsList[0].deviceId)
        this.selectedMic = this.micsList[0]
      }catch (error){
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'برای  ورود به جلسه دستگاه شما حتما باید میکروفون داشته باشد',
          time: 5000,
        });
        setTimeout(()=>{
          this.eventBus.emit('leave-conference')
        },5000)
        console.error(error)
      }
      nextTick(()=>{
        this.eventBus.emit('devices-is-loaded')
      })
      // console.log('this is load microphones')
      // let isMicrophoneAvailable = true;
      // try{
      //   await navigator.mediaDevices.getUserMedia({audio: true});
      //
      // } catch(err){
      //   console.log('this is error');
      //   console.log(err);
      // }
      // const loadedDevices = await navigator.mediaDevices.enumerateDevices();
      // console.log('this is loaded devicessss')
      // loadedDevices.forEach((device) => {
      //   if (device.kind === 'audioinput') {
      //     console.log('this is audio device');
      //     console.log(device);
      //     if(!device.deviceId){
      //       this.eventBus.emit("notification", {
      //       title: "پیام",
      //       type: "error",
      //       bodyText: "بدون میکروفون نمیتوانید وارد شوید",
      //       time: 5000,
      //     });
      //     isMicrophoneAvailable = false;
      //     }
      //     this.devices.microphones.microphonesList.push(device)
      //   }
      // });
      // if(!isMicrophoneAvailable) return this.$store.dispatch('setMyInfo', {type : 'amIHaveMicrophone', payload: false});

      // let index = -1
      // if (localStorage.getItem('set-mic')){
      //   index = this.devices.microphones.microphonesList.findIndex((el)=>{
      //     return el.deviceId === localStorage.getItem('set-mic')
      //   })
      //   if (index !== -1){
      //     this.devices.microphones.selectedMicrophone =  this.devices.microphones.microphonesList[index]
      //   }else {
      //     this.devices.microphones.selectedMicrophone =
      //         this.devices.microphones.microphonesList[0];
      //   }
      // }else{
      // console.error(this.currentDevices.audioInput)
      //   this.devices.microphones.selectedMicrophone = this.currentDevices.audioInput
      // }



    },


    // async loadMicrophones() {
    //   const loadedDevices = await navigator.mediaDevices.enumerateDevices();
    //   loadedDevices.forEach((device) => {
    //     if (device.kind === "audioinput") {
    //       this.devices.microphones.microphonesList.push(device);
    //     }
    //   });
    //   this.devices.microphones.selectedMicrophone =
    //       this.devices.microphones.microphonesList[0];
    // },
    async loadSpeakers() {
      await navigator.mediaDevices.getUserMedia({audio: true});
      const loadedDevices = await navigator.mediaDevices.enumerateDevices();

      const speakers = []
      loadedDevices.forEach((device) => {

        if (device.kind === 'audiooutput') {
          speakers.push(device)
        }
      })
      const seenGroupIds = new Set();
      for (const mic of speakers) {
        if (!seenGroupIds.has(mic.groupId)) {
          seenGroupIds.add(mic.groupId);
          this.speakersList.push(mic);
        }
      }
      this.eventBus.emit('waiting-room-speaker')
      this.selectedSpeaker = this.speakersList[0]
      if(this.speakersList.length === 0){
        this.isSpeakerFound = false
      }
    },
    // async loadSpeakers() {
    //   const loadedDevices = await navigator.mediaDevices.enumerateDevices();
    //   loadedDevices.forEach((device) => {
    //     if (device.kind === "audiooutput") {
    //       this.speakersList.push(device);
    //     }
    //   });
    //   // if (this.$store.getters.speaker){
    //   //   const speakerIdx =  this.devices.speakers.speakersList.findIndex((el) => {
    //   //     return el?.deviceId === this.$store.getters.speaker.deviceId
    //   //   })
    //   //
    //   //   if (speakerIdx !== -1){
    //   //     this.devices.speakers.selectedSpeaker = this.devices.speakers.speakersList[speakerIdx]
    //   //   }else {
    //   //     this.devices.speakers.selectedSpeaker =
    //   //         this.devices.speakers.speakersList[0];
    //   //   }
    //   // }else {
    //     this.selectedSpeaker =
    //         this.currentDevices.audioOutput;
    //   // }
    //
    //   this.$store.dispatch('setspeaker', this.speakersList[0])
    // },

    getVideoStream(stream) {
      this.videoStream = stream;
      if (!this.$refs.video) return;
      this.$refs.video.srcObject = stream;
    },

    muteCamera(){
      this.cameraStatus = !this.cameraStatus
      this.$store.dispatch('setCameraStat',this.cameraStatus)
      this.isVideoMute = !this.cameraStatus;
    },
    muteMicrophone(){
      this.micStatus = !this.micStatus
      this.$store.dispatch('setMicStat',this.micStatus)
      this.isMicMute = !this.micStatus;
    },
    getPublicRoomInformation(){
      this.restClientRoom.getRoomInfo(this.meetingInfo)
          .then(data => {
            this.$store.dispatch('setAgendas',data.meetingAgenda)
            // const eventDate = (new Intl.DateTimeFormat('fa-IR', {dateStyle: 'full', timeStyle: 'long'}).format(new Date(data.fromSchd))).toString()
            if(!data){
              return this.$store.dispatch('setIsRoomExistedOrStarted', false);
            }
            if(data.owner === 'جلسه بدون مدیر'){
              this.$store.dispatch("setHasModerator",false);
            }else {
              this.$store.dispatch("setHasModerator",true);
            }
            this.$store.dispatch('setCustomerId',data.customerId)
            this.$store.dispatch('setUserId',this.randomUserId)
            this.$store.dispatch('setCustomerId',data.customerId)
            this.$store.dispatch('setOwnerName',data.owner)
            this.$store.dispatch('setMeetingName',data.meetingName)
            this.$store.dispatch('setPassword',data.password)
            this.$store.dispatch('setConferenceId',data.meetingId)
            this.$store.dispatch("setRoomId", data.meetingId);
            this.$store.dispatch("setIsPublicUser", userStatus.isPublicUser);
            this.$store.dispatch('setModeratorId', +data.moderatorUserId);
            this.$store.dispatch('setModeratorSubstituteId', +data.substitutionModerator);
            this.$store.dispatch("setSessionName", data.meetingName);
            const hasSubModerator = !!data.substitutionUserId?.toString().trim()?.length > 0
            this.$store.dispatch("setHasModerator", hasSubModerator);
            auth.setHasModerator(hasSubModerator)
            // this.$store.dispatch('setFromSchd', {
            //   dayName: eventDate.split(' ')[3],
            //   dayNum: eventDate.split(' ')[2].split(',')[0],
            //   monthName: eventDate.split(' ')[1],
            //   yearName: momentJalali(data.fromSchd).format('jYYYY/jMM/jDD HH:mm').split(' ')[0].split('/')[0],
            //   from: momentJalali(data.fromSchd).format('jYYYY/jMM/jDD HH:mm').split(' ')[1],
            //   completeDate:momentJalali(data.fromSchd).format('jYYYY/jMM/jDD HH:mm')
            // })
            // this.$store.dispatch('setToSchd', {to: momentJalali(data.toSchd).format('jYYYY/jMM/jDD HH:mm').split(' ')[1].toString()})
            // this.$store.dispatch("setScheduleId",data.id);
          })
    },
    getPrivateRoomInformation(){
      // this.restClientPrivate
      //     .getRoomInfoForOrganizationUser(this.meetingInfo)
      //     .then((data) => {
      //       if (data.id === null) {
              this.getPrivateRoomInformationGuest()
            // }else {
            //   this.$store.dispatch('setUserId',this.randomUserId)
            //   this.$store.dispatch('setCustomerId',data.customerId)
            //   this.$store.dispatch('setRoomId',data.meetingId)
            //   this.$store.dispatch("setSessionId", data.meetingId);
            //   this.$store.dispatch('setOwnerName',data.ownerName)
            //   this.$store.dispatch('setMeetingName',data.roomName)
            //   this.$store.dispatch('setPassword','')
            // }

          // })
    },
    enterRoom(){
      if (this.displayNameInput.length > 3 || this.userNameInput.length > 3){
        this.eventBus.emit('enter-room-with-enter-key')
      }
    }
  },

  created() {
    this.loadCameras();
    this.loadMicrophones();
    this.loadSpeakers();
    const meetingLink = window.location.href;
    this.meetingType  = meetingLink.substring(meetingLink.indexOf('?') + 1, meetingLink.lastIndexOf('&'));
    this.meetingInfo = meetingLink.substring(meetingLink.indexOf('&') + 1);
    // if (this.meetingInfo.split('')[this.meetingInfo.length - 1] === '/'){
    //   this.meetingInfo = this.meetingInfo.split('/')[0]
    // }
    if(this.meetingType ){
      this.amIGuestUser = true;
      this.$store.dispatch('setAmIGuest', true);
    } else {
      this.displayNameInput = this.$store.getters.displayName
    }
    this.$store.dispatch('setMeetingLink',meetingLink);
    this.$store.dispatch('setMeetingType', this.meetingType );
    this.$store.dispatch('setMeetingInfo', this.meetingInfo);
  },
  mounted() {
    if (this.$store.getters.displayName){
      this.userNameInput = this.$store.getters.displayName
    }
    if (localStorage.getItem('language') === 'فارسی . Fa'){
      this.$i18n.locale = 'fa'
      this.selectedLang= {
        label: 'فارسی . Fa'
      }
    } else if ( localStorage.getItem('language') === 'انگلیسی . En') {
      this.$i18n.locale = 'en'
      this.selectedLang= {
        label: 'انگلیسی . En'
      }
    }else{
      this.$i18n.locale = 'fa'
      this.selectedLang= {
        label: 'فارسی . Fa'
      }
    }

    if (this.amIGuestUser) {
      if (this.meetingType === "public" || this.meetingType === "wm"){
        this.getPublicRoomInformation()
      }
      else{
        this.getPrivateRoomInformation()
      }
     nextTick(() => {
       if (this.isChangeDevices !== 'yes'){
         this.$refs.guestUserInput.focus()
       }

     })
    }else {
      nextTick(()=> {
        if (this.isChangeDevices !== 'yes'){
          this.$refs.organizationalUserInput.focus()
        }
      })

    }

  }
}
</script>

<style scoped>
.display-local-fragment{
  position: relative;
}
.base-loading-spinner__container{
  width: 100%;
  height: 23rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.display-local-fragment__controls{
  position: absolute;
  display: flex;
  align-items: center;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  z-index: 11;
  gap: 1.6rem;
}
.display-local-fragment__controls > div{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 5rem;
  cursor: pointer;
  border: 0.1rem solid white;
  background-color: rgba(0, 0, 0, 0.11);
  border-radius: 50%;
}
.display-local-fragment__mute-mask{
  width: 100%;
  height: 27.6rem;
  position: absolute;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color:#5a5a67;
}
.devices {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}
.devices--nick-name{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1rem;
}
/*.devices--nick-name > input {*/
/*  width: 100%;*/
/*  height: 3.5rem;*/
/*  border-radius: 1rem;*/
/*  position: relative;*/
/*  background-color: #F6F6F7;*/
/*  direction: rtl;*/
/*  text-align: right;*/
/*  padding:0 0.8rem 0 0.8rem ;*/
/*  overflow-y: hidden;*/
/*  font-weight: 400;*/
/*  font-size: 1.4rem;*/
/*  border: none;*/
/*}*/
/*.devices--nick-name > input:focus {*/
/*  outline: 0;*/
/*  background-color: transparent;*/
/*  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);*/
/*}*/
/*.devices--nick-name > input::placeholder {*/
/*  font-size: 1.2rem;*/
/*  font-weight: 400;*/
/*  color: #aeaeb0*/
/*}*/
.guest--username--input-rtl {
    width: 100%;
    height: 3.5rem;
    border-radius: 1rem;
    position: relative;
    background-color: #F6F6F7;
    direction: rtl;
    text-align: right;
  align-items: center;
    padding:0 0.8rem 0 0.8rem ;
    overflow-y: hidden;
    font-weight: 400;
    font-size: 1.4rem;
    border: none;

}
.guest--username--input-rtl:focus {
  outline: 0;
  background-color: transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);

}
.guest--username--input-ltr{
  width: 100%;
  height: 3.5rem;
  border-radius: 1rem;
  position: relative;
  background-color: #F6F6F7;
  direction: ltr;
  padding:0 0.8rem 0 0.8rem ;
  overflow-y: hidden;
  font-weight: 400;
  font-size: 1.4rem;
  align-items: center;
  border: none;
}
.guest--username--input-ltr:focus{
  outline: 0;
  background-color: transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}
.guest--username--input:focus{
    outline: 0;
    background-color: transparent;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}
.guest--username--input-ltr:focus{
  outline: 0;
  background-color: transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}
.guest--username--input::placeholder{
    font-size: 1.2rem;
    font-weight: 400;
    color: #aeaeb0
}
.guest--username--input-ltr::placeholder{
  font-size: 1.2rem;
  font-weight: 400;
  color: #aeaeb0
}
textarea::placeholder {
  color: rgba(0, 0, 0, 0.8);
}
.displayname--input-rtl{
  width: 100%;
  height: 3.5rem;
  border-radius: 1rem;
  position: relative;
  background-color: #F6F6F7;
  direction: rtl;
  text-align: right;
  padding:0 0.8rem 0 0.8rem ;
  overflow-y: hidden;
  font-weight: 400;
  font-size: 1.4rem;
  border: none;

}
.displayname--input-ltr{
  width: 100%;
  height: 3.5rem;
  border-radius: 1rem;
  position: relative;
  background-color: #F6F6F7;
  direction: ltr;
  padding:0 0.8rem 0 0.8rem ;
  overflow-y: hidden;
  font-weight: 400;
  font-size: 1.4rem;
  border: none;

}
.displayname--input-ltr:focus{
  outline: 0;
  background-color: transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}
.displayname--input-rtl:focus{
  outline: 0;
  background-color: transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}
.displayname--input-ltr::placeholder{
  font-size: 1.2rem;
  font-weight: 400;
  color: #aeaeb0
}
.displayname--input-rtl::placeholder{
  font-size: 1.2rem;
  font-weight: 400;
  color: #aeaeb0
}

@media (max-width:480px) {
  .display-local-fragment__mute-mask{
    height: 23rem;
  }
}
</style>

<template>
  <li ref="videoContainer" @mouseover="showMaximizeIcon" @mouseleave="hideMaximizeIcon" :class="[{[videoStreamClass] : true}, {'video-is-visible' : videoIsReady}]" :style="{ height: videoHeight }" >

    <div class="video-container" >
      <!--      <video :muted="isPublish ?  (isAudioMuted === true) : true" class="video-tag" :style="{'object-fit':'cover' , 'border-radius': '1rem'}" autoplay ref="video" @contextmenu.prevent :class="[{'active-speaker&#45;&#45;active' : (activeSpeakerName === fullName)}]" playsinline></video>-->
      <video   class="video-tag" :style="{'object-fit':'cover' , 'border-radius': '1rem'}" autoplay ref="video" @contextmenu.prevent :class="[{'active-speaker--active' : (activeSpeakerName === fullName)}]" playsinline></video>
      <img  src="/img/avatar.svg" alt="not loaded"  v-show="!cameraIsEnabled || reconnecting || !hasVideoTrack" class="first--participant__icon">

      <base-loading-spinner v-if="reconnecting" size-ratio="1.2" spinner-color="#11f2d1">
      </base-loading-spinner>

      <div v-if="this.isMobile===false && this.index!==0 " :style="{ 'font-size': font }"  class="full-name__video-publisher__unpin">{{fullName}}</div>
      <div v-else-if="this.index===0" :style="{ 'font-size': firstFont }" :class="pinMode === 'pinned__video--stream-private' ? 'full-name__video-publisher-private' : 'full-name__video-publisher'">{{fullName}}</div>
      <div v-else-if="this.isMobile===true"  class="full-name__video-publisher__mobile">{{fullName}}</div>

      <div class="mic-off" v-if="!micIsEnabled && !itIsMe">
        <svg data-name="Layer 1" class="mic-off__icon" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19.1858,15.3218a7.5562,7.5562,0,0,0,.5765-2.9174.8462.8462,0,0,0-1.6509-.272,2.0142,2.0142,0,0,0-.0644.4852,5.7763,5.7763,0,0,1-.3193,1.7384l1.3068,1.3067Q19.1131,15.495,19.1858,15.3218Z"/>
          <path d="M16.9617,12.2839c.01-1.2339.002-2.468.002-3.7021,0-1.2419.0034-2.4838-.0014-3.7256A5.2541,5.2541,0,0,0,16.64,3.0239,4.7153,4.7153,0,0,0,7.5567,4.185l9.2751,9.275A5.5568,5.5568,0,0,0,16.9617,12.2839Z"/>
          <path d="M21.9107,21.1027,18.057,17.249v0l-1.2254-1.2254v0l-.8209-.8209v0l-8.5-8.5012v.0012L2.8973,2.0893a.5713.5713,0,0,0-.808.808L7.5121,8.32q0,1.9854.0035,3.9707A4.8139,4.8139,0,0,0,8.5,15.255a4.71,4.71,0,0,0,6.52.9422c.0739-.0552.13-.115.1975-.1714l.8367.8368a5.9749,5.9749,0,0,1-6.3584,1.0105,5.8446,5.8446,0,0,1-3.58-5.2554,2.3052,2.3052,0,0,0-.0652-.4853.8461.8461,0,0,0-1.6506.272,7.3917,7.3917,0,0,0,.455,2.5888,7.5392,7.5392,0,0,0,5.2334,4.8321c.3716.1061.7564.1656,1.1473.2493v2.232c-.1317,0-.2245,0-.3174,0-.9372.0016-1.8746-.0076-2.8115.009A.823.823,0,0,0,7.34,23.383.9262.9262,0,0,0,7.9562,24h8.25a2.2534,2.2534,0,0,0,.482-.3489.8381.8381,0,0,0-.6557-1.34c-.945-.0048-1.89-.0036-2.8351-.0047h-.2554v-2.25c.0892-.016.1668-.0241.241-.0443a14.8708,14.8708,0,0,0,1.9042-.5375A7.6065,7.6065,0,0,0,17.269,18.077l3.8337,3.8337a.5713.5713,0,0,0,.808-.808Z"/>
        </svg>
      </div>
      <div class="mic-off" v-if="itIsMe && !$store.getters.micStatus">
        <svg data-name="Layer 1" class="mic-off__icon" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19.1858,15.3218a7.5562,7.5562,0,0,0,.5765-2.9174.8462.8462,0,0,0-1.6509-.272,2.0142,2.0142,0,0,0-.0644.4852,5.7763,5.7763,0,0,1-.3193,1.7384l1.3068,1.3067Q19.1131,15.495,19.1858,15.3218Z"/>
          <path d="M16.9617,12.2839c.01-1.2339.002-2.468.002-3.7021,0-1.2419.0034-2.4838-.0014-3.7256A5.2541,5.2541,0,0,0,16.64,3.0239,4.7153,4.7153,0,0,0,7.5567,4.185l9.2751,9.275A5.5568,5.5568,0,0,0,16.9617,12.2839Z"/>
          <path d="M21.9107,21.1027,18.057,17.249v0l-1.2254-1.2254v0l-.8209-.8209v0l-8.5-8.5012v.0012L2.8973,2.0893a.5713.5713,0,0,0-.808.808L7.5121,8.32q0,1.9854.0035,3.9707A4.8139,4.8139,0,0,0,8.5,15.255a4.71,4.71,0,0,0,6.52.9422c.0739-.0552.13-.115.1975-.1714l.8367.8368a5.9749,5.9749,0,0,1-6.3584,1.0105,5.8446,5.8446,0,0,1-3.58-5.2554,2.3052,2.3052,0,0,0-.0652-.4853.8461.8461,0,0,0-1.6506.272,7.3917,7.3917,0,0,0,.455,2.5888,7.5392,7.5392,0,0,0,5.2334,4.8321c.3716.1061.7564.1656,1.1473.2493v2.232c-.1317,0-.2245,0-.3174,0-.9372.0016-1.8746-.0076-2.8115.009A.823.823,0,0,0,7.34,23.383.9262.9262,0,0,0,7.9562,24h8.25a2.2534,2.2534,0,0,0,.482-.3489.8381.8381,0,0,0-.6557-1.34c-.945-.0048-1.89-.0036-2.8351-.0047h-.2554v-2.25c.0892-.016.1668-.0241.241-.0443a14.8708,14.8708,0,0,0,1.9042-.5375A7.6065,7.6065,0,0,0,17.269,18.077l3.8337,3.8337a.5713.5713,0,0,0,.808-.808Z"/>
        </svg>
      </div>
    </div>
    <div class="participant-actions" v-if="pinned || maximizeIconShowed || minimizeIconShowed">
      <!--      <active-speaker-analyser  v-if="activeSpeakerName === fullName"></active-speaker-analyser>-->
      <pin-sign color="white" width="12" height="15" v-if="pinned"></pin-sign>
      <img src="/img/full-screen-mobile.svg" alt="not loaded"  @click="maximizeActiveSpeaker"  v-if="maximizeIconShowed" style="cursor: pointer;width: 1.5rem;height:1.5rem;background-color: rgba(110,109,109,0.6);" class="pin__icon">
      <img src="/img/windowed-mode.svg" alt="not loaded"  @click="minimizeActiveSpeaker"  v-if="minimizeIconShowed" style="cursor: pointer;width: 1.5rem;height:1.5rem;background-color: rgba(110,109,109,0.6);" class="pin__icon">

    </div>
    <div v-if="fullName !== this.$store.getters.displayName"  class="participant-actions-speaker">
      <!--      <active-speaker-analyser  v-if="activeSpeakerName === fullName"></active-speaker-analyser>-->
      <div class="speaker__icon"  v-show="isAudioMuted">
        <img @click="muteAudio" src="/img/Speaker-off.svg" alt="not loaded" style="width: 1.7rem" >
      </div>
      <div  class="speaker__icon" v-show="!isAudioMuted">
        <img @click="muteAudio"  src="/img/Speaker-on.svg" alt="not loaded" style="width: 1.7rem" >
      </div>


    </div>
  </li>
  <!--  <li v-show="false" >-->
  <!--    <audio v-if="fullName !== $store.getters.displayName" v-show="false" autoplay ref="microphone" ></audio>-->
  <!--  </li>-->
</template>

<script>

// import ActiveSpeakerAnalyser from "./ActiveSpeakerAnalyser";
import pinSign from "@/components/UI/Icons/PinSign.vue";
// import {nextTick} from "vue";
import DetectMobile from "@/utils/detectMobile";
import BaseLoadingSpinner from "@/components/UI/BaseLoadingSpinner.vue";
export default {
  components: {BaseLoadingSpinner, pinSign},
  props: {
    pinned: {
      type: Boolean,
      default: false
    },
    micIsEnabled : {
      type : Boolean
    },
    cameraIsEnabled : {
      type : Boolean,
      default:true,
    },
    fullName : {
      type : String,
      default: 'این کاربر دچار مشکل میباشد',
    },
    activeSpeakerName : {
      type : String
    },
    videoTrack : {
      type : Object
    },
    audioTrack : {
      type : Object
    },


    mode: {
      type: String,
      required: true,
      default: null,
    },
    pinMode: {
      type: String,
      required: true,
      default: null,
    },
    nameFont: {
      type: String,
      required: true,
      default: null,
    },
    index: {
      type: Number,
      required: false,

    },
    cameraRatio: {
      type: Number,
      required: false,
      default: 0,
    },
    firstCameraRatio: {
      type: Number,
      required: false,
      default: 0,
    },
    sideBarIsVisible: {
      type : Boolean,
      required: false,
      default: false,
    },
    streamHeight: {
      type: Number,
      required: false,
      default: 380,
    },
    streamWidth: {
      type: Number,
      required: false,
      default: 640,},
    isPublic: {
      type: Boolean,
      required: false,
      default: false,},
    isModeratorAccept: {
      type: Boolean,
      required: false,
      default: true,},
    reconnecting: {
      type : Boolean,
      required: false,
      default: false,
    },
    sid: {
      type: String,
      required: false,
      default: ''},
    userId: {
      type: String,
      required: false,
      default: ''},
    itIsMe: {
      type: Boolean,
      required: false,
      default: false
    },
    layoutType: {
      type: String,
      required: false,
      default: ''},
    isShared: {
      type: Boolean,
      required: false,
      default: false
    },
    layoutUpdated: {
      type: Boolean,
      required: false,
      default: false
    },
    isActiveSpeakerMaximized: {
      type: Boolean,
      required: false,
      default: false
    },
    isModeratorMaximizeActiveSpeaker: {
      type: Boolean,
      required: false,
      default: false
    },
    numberOfVideos: {
      type: Number,
      required: false,
      default: 0
    },
  },
  data() {
    return {
      height: null,
      videoIsReady : false,
      firstFont:'1.7rem',
      font:'1.5rem',
      divHeight:0,
      firstDivHeight:0,
      isAudioMuted:false,
      isMobile:false,
      hasVideoStream:true,
      hasVideoTrack:true,
      isMaximizeIconShowed: false,


    };
  },
  computed:{
    isPublish(){
      return this.isPublic ? !this.isModeratorAccept : true
    },
    videoStreamClass(){
      if(this.index === 0 && this.layoutType === 'filmStrip'){
        return this.pinMode
      }else if (this.layoutType === 'flat' && (this.mode === 'tile-view__with--16__video-streams') && (this.numberOfVideos === 16 && (this.index > 9))){
        return 'tile-view__with--16__video-streams-bottom'
      }else if (this.layoutType === 'flat' && (this.mode === 'tile-view__with--16__video-streams') && (this.numberOfVideos === 17 && (this.index > 4))){
        return 'tile-view__with--16__video-streams-bottom'
      }else{
        return this.mode
      }

    },
    videoHeight(){
      console.log(this.layoutUpdated)

      if(this.index === 0 && this.layoutType === 'filmStrip'){
        return this.firstCameraRatio
      }else if (this.layoutType === 'flat' && (this.mode === 'tile-view__with--16__video-streams') && (this.numberOfVideos === 16 && (this.index > 9))){
        return 0.29 * (window.innerHeight - 60) + "px"
      }else if (this.layoutType === 'flat' && (this.mode === 'tile-view__with--16__video-streams') && (this.numberOfVideos === 17 && (this.index > 4))){
        return 0.32 * (window.innerHeight - 60) + "px"
      }else if (!this.isShared){
        return this.cameraRatio
      }else if (this.layoutType === 'flat' && this.isShared){
        return this.$refs.videoContainer.offsetWidth + 'px'
      }else {
        return this.cameraRatio
      }
    },
    maximizeIconShowed(){
      return this.activeSpeakerName === this.fullName && !this.isActiveSpeakerMaximized && (this.isMaximizeIconShowed || this.isMobile) && !this.isModeratorMaximizeActiveSpeaker
    },
    minimizeIconShowed(){
      return  this.activeSpeakerName === this.fullName && this.isActiveSpeakerMaximized && (this.isMaximizeIconShowed || this.isMobile) && !this.isModeratorMaximizeActiveSpeaker
    }
  },
  methods : {
    muteAudio(){
      this.isAudioMuted = !this.isAudioMuted
      this.emitter.emit('toggle-mute', {id:this.userId,mute:this.isAudioMuted, name:this.fullName})
    },
    async addStreamToVideoElement(){

      if (this.itIsMe){
        if (this.videoTrack?.kind === 'video' && this.videoTrack.videoTrack){
          this.hasVideoTrack = true
          await this.videoTrack.videoTrack.attach(this.$refs.video)
        }else {
          this.hasVideoTrack = false
        }
      }else if(this.videoTrack?.kind === 'video' && this.videoTrack) {
        this.hasVideoTrack = true
        await this.videoTrack.attach(this.$refs.video)

        // else {
        //   this.$emit('remove-from-layout', this.userId)
        // }

      }else {
        this.hasVideoTrack = false
      }

      // this.streamManager.addVideoElement(this.$refs.video)
    },
    maximizeActiveSpeaker(){
      this.eventBus.emit('maximize-active-speaker')
    },
    minimizeActiveSpeaker(){
      this.eventBus.emit('minimize-active-speaker')
    },
    showMaximizeIcon(){
      if (this.activeSpeakerName === this.fullName){
        this.isMaximizeIconShowed = true
      }
    },
    hideMaximizeIcon(){
      if (this.activeSpeakerName === this.fullName){
        this.isMaximizeIconShowed = false
      }
    },
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  mounted() {
    this.addStreamToVideoElement();

    // nextTick(()=>{
    //   this.divHeight = this.$refs.videoContainer.offsetWidth * this.cameraRatio  + "px"
    //   this.firstDivHeight = this.$refs.videoContainer.offsetWidth * this.firstCameraRatio + "px"
    // })
    // window.addEventListener('resize',()=>{
    //   clearTimeout(this.counter)
    //   this.counter  = setTimeout(()=>{
    //     this.divHeight = this.$refs.videoContainer.offsetWidth * this.cameraRatio  + "px"
    //     this.firstDivHeight = this.$refs.videoContainer.offsetWidth * this.firstCameraRatio + "px"
    //   },60)
    // })
  },



};
</script>

<style scoped>
.circle{
  width:10rem;
  height:10rem;
  background-color:white;
  border-radius:50%
}
li{
  position: relative;

  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
}
video{
  width: 100%;
  height: 100%;


}

.video-container{
  position: relative;
  background-color: #333;
  text-align: center;
  border-radius: .7rem;
  width: 100%;
  height: 100%;

}
.video-container > div {
  display: flex;
  position: absolute;
  /*bottom: -0.3rem;*/
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  right: 3%;
  color : white;
  white-space : nowrap;
  overflow : hidden;
  text-overflow : ellipsis;
  /*max-width: 70%;*/
  direction: rtl;
}
.full-name__video-publisher__unpin{
  display: block !important;
  position: absolute;
  bottom: 0.5rem;
  white-space : nowrap;
  overflow : hidden;
  text-overflow : ellipsis;
  max-width: 80%;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  right: 3%;
  color : white;
  direction: rtl;
}
.full-name__video-publisher{

  display: block !important;
  position: absolute;
  bottom: 0.5rem;
  white-space : nowrap;
  overflow : hidden;
  text-overflow : ellipsis;
  max-width: 80%;
}
.full-name__video-publisher-private {
  display: block !important;
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  white-space : nowrap;
  overflow : hidden;
  text-overflow : ellipsis;
  max-width: 80%;
}
.participant__icon{
  width: 45%;
  height: 45%;
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-69%, -50%);
  /*z-index: 1;*/
}
.first--participant__icon{
  width: 35%;
  height: 35%;
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
}

.mic-off{
  position: absolute;
  top: 5%;
  right: 0;
  background-color: rgba(42,42,42,0.6);
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pin-icon{
  position: absolute;
  top: 1rem;
  right: 0;
  background-color: grey;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mic-off__icon{
  width: 1.8rem;
}
.active-speaker--active{
  border : .4rem solid #669df6;
  border-radius: 1rem;
}
.participant-actions{
  position: absolute;
  top: 5%;
  left:3%;
  padding: 0.7rem;
  display: flex;
  justify-content: flex-start;
  gap: 0.4rem;
  align-items: center;
  background-color: rgba(42,42,42,0.6);
  border-radius: 2rem;
}

.participant-actions-speaker{
  position: absolute;
  bottom: 5%;
  left:3%;
  width: 8.7rem;
  height: 2.4rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;

}

.pin__icon{
  width: 2.6rem;
  height: 2.6rem;
  background-color: rgba(42,42,42,0.6);
}
.speaker__icon{
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(61, 61, 61, 0.6);
  -moz-border-radius: 70px;
  -webkit-border-radius: 70px;
  border-radius: 70px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

}
.video__streams__2--columns-private {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20%;
}
.first__video--stream{
  width: 90%;
}
.video-list--1 {
  width: 24%;
  margin-top: 0.5rem;
  margin-left: 0.2rem;

}
.video--streams{
  width: 23%;
  margin-top: 0.5rem;
  margin-left: 0.2rem;
}
.video--stream {
  width: 49%;
  margin-top: .5rem;
  margin-left: 0.1rem;

}
.video__streams__3--columns{
  width: 30%;
  margin-top: .5rem;
  margin-left: 0.2rem;
}
.video-list--11 {
  width: 22%;
  margin-top: 1rem;
  margin-left: 0.5rem;

}
.pinned__video--streams{
  width: 60%;
  margin: 0 15%;
}
.pinned__video--streams--full{
  width: 100%;
  margin:0 4.7%;
}
.pinned__video--stream-private{
  width: 85%;

}
.pinned__video--streams--grater--8{
  width: 45%;
  margin: 0 22%;
}
.pinned__video--streams--grater--8-with-sidebar{
  width: calc(40% + 250px);
  margin: 0 20%;
}
.pinned__video--streams--middle--grater--8{
  width: 60%;
  margin: 0 25%;
}

.pinned__video--streams__with--sidebar{
  width: 70%;
  margin: 0 14%;
}
.pinned__video--streams--middle{
  width: 80%;
  margin: 0 8%;
}
.pinned__video--streams--middle__with--sidebar{
  width: 95%;
  margin: 0 2%;
}
.pinned__video--stream {
  width: 100%;
  margin:0 4px;
}
.video-list--tag--2{
  width: 75%;
  margin: 0 10%;
}
.video-list--tag--with-side{
  width: 98%;

}
.video-list--tag--share{
  width: 90%;
  margin: 0 1rem;
}
.pinned__video--stream__with--share{
  width: 100%;
  margin: 0.2rem;
}
.video-list--tag--with-sidebar{
  width: 90%;
  margin: 0 1rem;
}
.video-list--2 {
  width: 19%;
  margin-top: 1rem;
  margin-left: 0.1rem;
}
.video__with__6--streams {
  width: 16%;
  margin-top: 0.5rem;
  margin-left: 0.2rem;
}
.video-list--2 {
  width: 18%;
  margin-top: 0.5rem;
  margin-left: 0.2rem;
}
.video-list--3 {
  width: 16%;
  margin-top: 0.5rem;
  margin-left: 0.1rem;

}
.video__with__7--streams {
  width: 16%;
  margin-top: 0.5rem;
  margin-left: 0.1rem;

}
.video-list--33 {
  width: 14.7%;
  margin-top: 1.5rem;
  margin-left: 0.2rem;

}

.video-list--4 {
  width: 14%;
  margin-top: .6rem;
  margin-left: 0.2rem;

}
.videoo-list--4{
  width: 14%;
  margin-top: .6rem;
  margin-left: 0.2rem;
}
.video__with__8--streams {
  width: 14%;
  margin-top: .6rem;
  margin-left: 0.2rem;

}
.video__with__9--streams {
  width: 12%;
  margin-top: .6rem;
  margin-left: 0.2rem;

}
.video__with__10--streams {
  width: 10%;
  margin-top: .6rem;
  margin-left: 0.2rem;

}
.video-list--44 {
  width: 12.8%;
  margin-top: .6rem;
  margin-left: 0.2rem;

}

.video-list--with-share--1 {
  width: 100%;
  margin: 2px 1px;
}
.video-list--with-share--2 {
  width: 45%;
  margin: 5px 1px;
}
.video-list--with-share--3 {
  width: 45%;
  margin: 10px 1px;
}
.video-list--with-share--4 {
  width: 45%;
  margin: 5px 1px;
}
.video-list--with-share-and-sidebar--4 {
  width: 45%;
  margin: 5px 1px;
}
.video-list--with-sidebar--5{
  width: 45%;
  margin: 5px 1px;
}
.video-list--with-share--greater--5 {
  width: 45%;
  margin: 10px 1px;
}
.video--stream__with--share{
  width: 48%;
  margin: 1px 2px;
}
.video--stream__with--share__mobile{
  width: 30%;
  margin: 10px 1px;
}
.video-list--with-share--greater--5__with--sidebar{
  width: 45%;
  margin: 5px 1px;
}
.full-screen__activeSpeaker{
  width: 100%;
  height: 100%;
}

.tile-view__mobile-1-2-3__video-streams{
  width: 99%;
  margin: 0.5%;
}
.tile-view__mobile-1-2-3-4__video-streams{
   width: 49.5%;
   margin: 0.1%;
 }

.tile-view__tablet-1-2-3__video-streams{
  width: 70%;
  margin: 0.5%;
}
.tile-view__with--2__video-streams{
  width: 49.7%;
  margin: 0.1%;
}

.tile-view__with--3-4__video-streams{
  width: 38%;
  margin: 0.2%;
}
.tile-view__with--3-4__video-streams--mobile{
  width: 48%;
  margin: 0.2%;
}
.tile-view__with--5-6__video-streams{
  width: 32%;
  margin: 0.2%;
}
.tile-view__with--7-8__video-streams{
  width: 24.7%;
  margin: 0.1%;
}
.tile-view__with--9__video-streams{
  width: 28%;
  margin: 0.1%;
}
.tile-view__with--10-11-12__video-streams{
  width: 24%;
  margin: 0.1%;
}
.tile-view__with--13-14-15__video-streams{
  width: 19.5%;
  margin:0.05%;
}
.tile-view__with--16__video-streams{
  width: 19.7%;
  margin:0.05%;
}
.tile-view__with--16__video-streams-bottom{
  width: 16.4%;
  margin:0.05%;
}
.tile-view__with--16__video-streams-wide{
  width: 12.4%;
  margin:0.05%;
}
.tile-view__with--share{
  width: 49%;
  margin:0.25%;
}
@media only screen and (max-width: 540px){
  .full-name__video-publisher__mobile{
    display: block !important;
    font-size: 1rem;
    position: absolute;
    bottom: 0.4rem;
    white-space : nowrap;
    overflow : hidden;
    text-overflow : ellipsis;
    max-width: 80%;

  }
  .pin__icon{
    width: 2rem;
    height: 2rem;
    background-color: rgba(42,42,42,0.6);
  }
  .speaker__icon{
    width: 2.2rem;
    height: 2.2rem;
    background-color: rgba(124, 124, 124, 0.8);
    -moz-border-radius: 70px;
    -webkit-border-radius: 70px;
    border-radius: 70px;
    cursor: pointer;
  }
  .mic-off{
    width: 2rem;
    height: 2rem;
    background-color: rgba(42,42,42,0.6);
  }
  .mic-off__icon{
    width: 1.4rem;
  }
  .video-list--1 {
    width: 48%;
    margin-top: 1.5rem;
    margin-left: 0.5rem;

  }
  .video-list--11 {
    width: 45%;
    margin-top: 1rem;
    margin-left: 0.5rem;

  }
  .video-list--33{
    width: 45%;
    margin-top: 1rem;
    margin-left: 0.5rem;
  }
  .video-list--44{
    width: 45%;
    margin-top: 1rem;
    margin-left: 0.5rem;
  }
  .pinned__video--streams{
    width: 100%;
    margin:0 4px;
  }
  .video-list--tag--with-sidebar{
    width: 100%;
    margin: 0 1rem;
  }
  .video-list--2 {
    width: 48%;
    margin-top: 1.5rem;
    margin-left: 0.2rem;
  }
  .video-list--3 {
    width: 48%;
    margin-top: 1.5rem;
    margin-left: 0.2rem;

  }
  .video-list--33 {
    width: 15%;
    margin-top: 1.5rem;
    margin-left: 0.2rem;

  }

  .video-list--4 {
    width: 48%;
    margin-top: 1.5rem;
    margin-left: 0.2rem;

  }
  .video-list--with-share--1 {
    width: 45%;
    margin: 2px 1px;
  }
  .video-list--with-share--2 {
    width: 45%;
    margin: 5px 1px;
  }
  .video-list--with-share--3 {
    width: 45%;
    margin: 10px 1px;
  }
  .video-list--with-share--4 {
    width: 45%;
    margin: 5px 1px;
  }
  .video-list--with-share-and-sidebar--4 {
    width: 45%;
    margin: 5px 1px;
  }
  .video-list--with-sidebar--5{
    width: 45%;
    margin: 5px 1px;
  }
  .video-list--with-share--greater--5 {
    width: 45%;
    margin: 10px 1px;
  }
  .video-list--with-share--greater--5__with--sidebar{
    width: 45%;
    margin: 10px 1px;
  }
  .video-list--tag--share{
    width: 45%;
    margin: 10px 1px;
  }

}
@media (min-width: 540px) and (max-width: 924px) {
  .full-name__video-publisher__mobile{
    display: block !important;
    font-size: 1rem;
    position: absolute;
    bottom: 0.4rem;
    white-space : nowrap;
    overflow : hidden;
    text-overflow : ellipsis;
    max-width: 80%;

  }
  .video-list--1 {
    width: 30%;
    margin-top: 1.5rem;
    margin-left: 0.5rem;

  }
  .video-list--11 {
    width: 30%;
    margin-top: 1rem;
    margin-left: 0.5rem;

  }
  .video-list--33{
    width: 30%;
    margin-top: 1rem;
    margin-left: 0.5rem;
  }
  .video-list--44{
    width: 30%;
    margin-top: 1rem;
    margin-left: 0.5rem;
  }

  .video-list--tag--with-sidebar{
    width: 100%;
    margin: 0 1rem;
  }
  .video-list--2 {
    width: 30%;
    margin-top: 1.5rem;
    margin-left: 0.2rem;
  }
  .video-list--3 {
    width: 30%;
    margin-top: 1.5rem;
    margin-left: 0.2rem;

  }
  .video-list--33 {
    width: 15%;
    margin-top: 1.5rem;
    margin-left: 0.2rem;

  }

  .video-list--4 {
    width: 30%;
    margin-top: 1.5rem;
    margin-left: 0.2rem;

  }


  .video-list--with-share--1 {
    width: 30%;
    margin: 2px 1px;
  }
  .video-list--with-share--2 {
    width: 30%;
    margin: 5px 1px;
  }
  .video-list--with-share--3 {
    width: 30%;
    margin: 10px 1px;
  }
  .video-list--with-share--4 {
    width: 30%;
    margin: 5px 1px;
  }
  .video-list--with-share-and-sidebar--4 {
    width: 28%;
    margin: 5px 1px;
  }
  .video-list--with-sidebar--5{
    width: 30%;
    margin: 5px 1px;
  }
  .video-list--with-share--greater--5 {
    width: 30%;
    margin: 10px 1px;
  }
  .video-list--with-share--greater--5__with--sidebar{
    width: 28%;
    margin: 10px 1px;
  }
  .video-list--tag--share{
    width: 28%;
    margin: 10px 1px;
  }
}
@media (min-width: 769px) and (max-width: 1024px) {
  .full-name__video-publisher__mobile{
    display: block !important;
    font-size: 1rem;
    position: absolute;
    bottom: 0.5rem;
    white-space : nowrap;
    overflow : hidden;
    text-overflow : ellipsis;
    max-width: 80%;

  }
  .video-list--11 {
    width: 30%;
    margin-top: 1rem;
    margin-left: 0.5rem;

  }
  .video-list--33{
    width: 30%;
    margin-top: 1rem;
    margin-left: 0.5rem;
  }
  .video-list--44{
    width: 30%;
    margin-top: 1rem;
    margin-left: 0.5rem;
  }
  .video-list--with-share--1 {
    width: 22%;
    margin: 2px 1px;
  }
  .video-list--with-share--2 {
    width: 22%;
    margin: 5px 1px;
  }
  .video-list--with-share--3 {
    width: 22%;
    margin: 10px 1px;
  }
  .video-list--with-share--4 {
    width: 22%;
    margin: 5px 1px;
  }
  .video-list--with-share-and-sidebar--4 {
    width: 22%;
    margin: 5px 1px;
  }
  .video-list--with-sidebar--5{
    width: 22%;
    margin: 5px 1px;
  }
  .video-list--with-share--greater--5 {
    width: 22%;
    margin: 10px 1px;
  }
  .video-list--with-share--greater--5__with--sidebar{
    width: 22%;
    margin: 10px 1px;
  }
  .video-list--tag--share{
    width: 22%;
    margin: 10px 1px;
  }}
@media (max-width: 762px){
  .pinned__video--streams--full{
    width: 100%;
    margin:0 0.4rem;
  }
}
</style>

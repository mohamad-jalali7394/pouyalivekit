<template>
  <div class="device-test">
    <div class="device-test__monitor-section" >

      <div class="mask" v-if="isVideoOff" :style="{height : `${28/cameraAspectRatio + .1}rem`}" ></div>
      <video playsinline
             ref="video"
             class="screen"
             autoplay
             v-if="cameraAspectRatio && isCameraFound"
             :style="{height : `${28/cameraAspectRatio + .1}rem`}"
      >

      </video>
      <base-loading-spinner size-ratio="1" spinner-color="blue" v-else-if = "(!cameraAspectRatio && isCameraFound)"></base-loading-spinner>
      <div v-else-if="!isCameraFound "> {{ $t("there-is-not-camera-device") }} </div>
    </div>
    <div class="devices--cam">
      <camera-selected
          :cameras-list="camerasList"
          :selected-camera="selectedCamera"
          @video-stream="getVideoStream"
      >
      </camera-selected>
    </div>


  </div>
</template>

<script>

import CameraSelected from "./CameraSelected";
import BaseLoadingSpinner from "@/components/UI/BaseLoadingSpinner.vue";
import {mapActions, mapGetters} from "vuex";
export default {
  name: "CameraSetting",
  components: {BaseLoadingSpinner, CameraSelected},
  data() {
    return {
      isDropDownOpen:false,
      isVideoOff:false,
      customerId: '',
      conferenceId: '',
      roomId: '',
      cameraAspectRatio: 0,
      camerasList: [],
      selectedCamera: this.$t("loading"),
      videoStream : null,
      isCameraFound:true,
      isEntranceButtonActive:false,

    }
  },
  computed:{
    ...mapGetters("permissions", [
      "cameraStatus",
    ]),
  },
  created() {
    this.loadCamerasList();
  },

  mounted() {
    // this.eventBus.on('video-stream', stream => {
    //   this.getVideoStream(stream)
    // })
  },
  methods: {
    ...mapActions("permissions", [
      "setCameraState",
    ]),

    handleCameraStatus(val) {
      this.setCameraState(val);
      if(val===false){
        this.isVideoOff=true
      }else {
        this.isVideoOff=false
      }

    },
    async loadCamerasList() {
      await navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
        this.cameraAspectRatio = 4 / 3;
        console.log(stream)
      }).catch(err => {
        console.log(err)
        this.cameraAspectRatio = 4 / 3
        this.isCameraFound = false
      });

      const loadedDevices = await navigator.mediaDevices.enumerateDevices();
      let listOfCameras = []
      loadedDevices.forEach((device) => {
        if (device.kind === 'videoinput') {
          listOfCameras.push(device)
        }
      })
      const virtualIndex = listOfCameras.findIndex((device)=>{
        return device.label.includes('virtual') || device.label.includes('Virtual')
      })
      if (virtualIndex > -1 && listOfCameras.length > 1){
        listOfCameras.splice(virtualIndex,1)
      }
      listOfCameras.forEach((device) => {
        this.camerasList.push(device)
      })
      const index  = this.camerasList.findIndex((device)=>{
        return device.deviceId === this.$store.getters.cameraId
      })
      if (index > -1){
        this.selectedCamera = this.camerasList[index]
      }else {
        this.selectedCamera = this.camerasList[0]
      }
      this.$store.dispatch('setCameraId', this.selectedCamera.deviceId)
      this.cameraAspectRatio = 4/3
    },

    getVideoStream(stream) {
      this.videoStream = stream;
      if(this.$refs.video){
        this.$refs.video.srcObject = this.videoStream;
      }
    },
    stopCamera(){
      if(this.videoStream){
        this.videoStream.getTracks().forEach((track) => {
          track.stop();
        });
        this.videoStream = null;
      }

    },
  },
  beforeUnmount() {
    this.stopCamera();
  }
}
</script>

<style scoped>
.device-test {
  width: 38.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

}

.device-test__monitor-section {
  position: relative;
  width: 100%;
  height: 23rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.handle--streams{
  position: absolute;
  bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5rem;
  top: 50%;
  transform: translateY(-35%);
  z-index: 10000000;
}
.handle--streams > div{
  width: 3.6rem;
  height: 3.6rem;

  cursor: pointer;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.mic--icon{
  width: 60%;

}
.screen {

  width: 28rem;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

}
.mask{
  position: absolute;
  width: 28rem;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: #706f6f;
}
.devices {

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.guest--username--input-rtl {
  position: relative;
  right: -5%;
  direction: rtl;
  text-align: right;
  border-radius: 10px;
  border: 1px solid #1a73e8;
  padding-right: 8px;
  padding-top: 4px;
  width: 30rem;
  height: 3rem;

}
.guest--username--input-ltr{
  position: relative;
  right: -5%;
  direction: ltr;
  text-align:left;
  border-radius: 10px;
  border: 1px solid #1a73e8;
  padding-right: 8px;
  padding-top: 4px;
  width: 30rem;
  height: 3rem;
}
.guest--username--input:focus{
  outline: none;
}
textarea::placeholder {
  color: rgba(0, 0, 0, 0.8);
}
.displayname--input-rtl{
  position: relative;
  right: -5%;
  padding-top: 4px;
  direction: rtl;
  text-align: right;
  border-radius: 10px;
  border: 1px solid #1a73e8;
  padding-right: 8px;
  width: 30rem;
  height: 3rem;
  overflow-y: hidden;
}
.displayname--input-ltr{
  position: relative;
  right: -5%;
  padding-top: 4px;
  direction: ltr;
  text-align: left;
  border-radius: 10px;
  border: 1px solid #1a73e8;
  padding-right: 8px;
  width: 30rem;
  height: 3rem;
  overflow-y: hidden;
}
.displayname--input:focus{
  outline: none;
}
video::-webkit-media-controls{
  display: none !important;
}
video::-webkit-media-controls-panel{
  display: none !important;
  -webkit-appearance: none;
}
video::-webkit-media-controls-play-button{
  display: none !important;
  -webkit-appearance: none;
}
video::-webkit-media-controls-start-playback-button{
  display: none !important;
  -webkit-appearance: none;
}
@media (max-width: 767px) {

  .device-test {
    width: 31rem;
  }
  /*.screen {*/
  /*  width: 21rem;*/
  /*  height: 30rem;*/

  /*}*/
  /*.mask{*/
  /*  width: 21rem;*/
  /*}*/
}
</style>

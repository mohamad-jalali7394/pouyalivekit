<template>
  <device-test-fragment>
    <the-display
        v-if="devices.cameras.camerasList.length !==0"
        :video-stream="devices.cameras.currentVideoStream"
    >
    </the-display>
    <div class="base-loading-spinner__container" v-else>
      <base-loading-spinner size-ratio="1" spinner-color="#409EFF" ></base-loading-spinner>
    </div>
    <div class="devices">
      <div class="devices--cameras">
        <camera-test
            :cameras-list="devices.cameras.camerasList"
            :selected-camera="devices.cameras.selectedCamera"
            @video-stream="getVideoStream"
        >
        </camera-test>
      </div>
      <div class="devices--microphones">
        <microphone-test
            :mics-list="devices.microphones.microphonesList"
            :selected-mic="devices.microphones.selectedMicrophone"
            @audio-stream="getAudioStream"
        >
        </microphone-test>
      </div>
      <div class="devices--speakers">
        <speakers-test
            :speakers-list="devices.speakers.speakersList"
            :selected-speaker="devices.speakers.selectedSpeaker"
        >
        </speakers-test>
      </div>
    </div>
  </device-test-fragment>
</template>

<script>
import MicrophoneTest from "./MicrophoneTest";
import CameraTest from "./CameraTest";
import SpeakersTest from "./SpeakersTest";
import DeviceTestFragment from "./UI/DeviceTestFragment";
import TheDisplay from "./UI/TheDisplay";
import BaseLoadingSpinner from "./UI/BaseLoadingSpinner";
export default {
  name: "DeviceTest",
  components: {TheDisplay, DeviceTestFragment, SpeakersTest, CameraTest, MicrophoneTest,BaseLoadingSpinner },
  data() {
    return {
      devices: {
        microphones: {
          microphonesList: [],
          selectedMicrophone: null,
          currentAudioStream : null
        },
        cameras: {
          camerasList: [],
          selectedCamera: null,
          currentVideoStream: null,
        },
        speakers: {
          speakersList: [],
          selectedSpeaker: null,
        },
      },
    };
  },
  methods: {
    async loadCameras() {
      const loadedDevices = await navigator.mediaDevices.enumerateDevices();
      loadedDevices.forEach((device) => {
        if (device.kind === "videoinput") {
          this.devices.cameras.camerasList.push(device);
        }
      });
      this.devices.cameras.selectedCamera =
          this.devices.cameras.camerasList
              .find(camera => camera.deviceId === this.$store.getters.cameraId) ||
          this.devices.cameras.camerasList[0];
    },
    async loadMicrophones() {
      const loadedDevices = await navigator.mediaDevices.enumerateDevices();
      loadedDevices.forEach((device) => {
        if (device.kind === "audioinput") {
          this.devices.microphones.microphonesList.push(device);
        }
      });
      this.devices.microphones.selectedMicrophone =
          this.devices.microphones.microphonesList
              .find(mic => mic.deviceId === this.$store.getters.microphoneId) ||
          this.devices.microphones.microphonesList[0] ;
    },
    async loadSpeakers() {
      const loadedDevices = await navigator.mediaDevices.enumerateDevices();
      loadedDevices.forEach((device) => {
        if (device.kind === "audiooutput") {
          this.devices.speakers.speakersList.push(device);
        }
      });
      this.devices.speakers.selectedSpeaker =
          this.devices.speakers.speakersList[0];
    },
    getVideoStream(stream) {
      this.devices.cameras.currentVideoStream = stream;
      if (!this.$refs.video) return;
      this.$refs.video.srcObject = stream;
    },
    getAudioStream(stream){
      this.devices.microphones.currentAudioStream = stream;
    },
    stopMediaStreams(){
      this.devices.cameras.currentVideoStream.getTracks().forEach(track => {
        track.stop();
      });
      this.devices.microphones.currentAudioStream.getTracks().forEach(track => {
        track.stop();
      });
      this.devices.cameras.currentVideoStream = null;
      this.devices.microphones.currentAudioStream = null;
    },
  },
  created() {
    this.loadCameras();
    this.loadMicrophones();
    this.loadSpeakers();
  },
  unmounted() {
    this.stopMediaStreams();
  }
};
</script>

<style scoped>
.devices {
  height: 23rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  align-items: center;
}
.base-loading-spinner__container{
  width: 100%;
  height: 23rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>

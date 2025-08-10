<template>
  <div class="control-meeting-sign__container">
    <pin-sign v-if="isPinned" :videoLength="videoLength" color="white"></pin-sign>
    <microphone-icon v-if="isAudioMute"  :mic-status="false" :videoLength="videoLength" color="white"></microphone-icon>
    <camera-icon v-if="isVideoMute" :camera-status="false" :videoLength="videoLength" color="white"></camera-icon>
  </div>

</template>

<script>
import CameraIcon from "@/components/UI/Icons/CameraIcon.vue";
import MicrophoneIcon from "@/components/UI/Icons/MicrophoneIcon.vue";
import PinSign from "@/components/UI/Icons/PinSign.vue";

export default {
  name: "ControlMeetingSigns",
  components: {PinSign, MicrophoneIcon, CameraIcon},
  props:["isVideoMute","isAudioMute","isPinned","videoLength"]
}
</script>

<style scoped>
.control-meeting-sign__container {
  background-color: rgba(12, 12, 12, 0.2);
  display: flex;
  border: 0.1rem solid transparent;
  //border-radius: 2rem;
  padding: 0.2rem 0.8rem;
  border-radius: 0.8rem;
  gap: 0.4rem;
}
</style>

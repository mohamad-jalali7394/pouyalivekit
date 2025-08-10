<template>
  <div class="devices" :style="{height :'12rem' }">
    <div class="devices--cam">
      <microphone-selected
          :selected-mic="selectedMic"
          :mics-list="micsList"></microphone-selected>
    </div>

  </div>
</template>

<script>
import MicrophoneSelected from "@/components/MicrophoneSelected.vue";

export default {
  name: "MicrophoneSetting",
  components: {MicrophoneSelected},
  data() {
    return {
      isDropDownOpen:false,
      micsList: [],
      selectedMic: this.$t("loading"),
      isMicrophoneFound:true,
    }
  },
  created() {
    this.loadMicrophonesList();
  },

  methods: {




    async loadMicrophonesList() {
      try {
        await navigator.mediaDevices.getUserMedia({audio: true});
        const loadedDevices = await navigator.mediaDevices.enumerateDevices();
        // if (loadedDevices?.length > 0){
        //   this.emitter.emit('waiting-room-camera')
        //   this.isEntranceButtonActive = true
        // }
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

        const index  = this.micsList.findIndex((device)=>{
          return device.deviceId === this.$store.getters.microphoneId
        })
        if (index > -1){
          this.selectedMic = this.micsList[index]
        }else {
          this.selectedMic = this.micsList[0]
        }
        this.$store.dispatch('setMicrophoneId', this.selectedMic.deviceId)
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
    },
  },
}
</script>

<style scoped>
.device-test {
  width: 40.2rem;
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
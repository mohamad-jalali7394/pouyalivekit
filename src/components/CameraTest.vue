<template>
  <div ref="camera" class="camera-select">
<!--    <span style="  font-size: 1.2rem;-->
<!--  font-weight: 400;-->
<!--  color: #75758F;width: 100%;display: flex" :style="{'flex-direction' : $i18n.locale !== 'en' ? 'row' : 'row-reverse'}" >{{$store.getters.t("camera")}}</span>-->
    <base-select
        :option-values="cameras"
        :max-height="maxHeight"
        :side="'select-rtl'" :arrow-direction="'arrow-down-icon-ltr'" :select-side="'list-item__label-lrt'"
        :is-waiting-room="'yes'"
        down-img-color="#1B76FF"
        v-model="camera"
        :div-height="'5rem'"
        @change-index="changeBaseSelectIndex">
      <template #icon>
        <camera-icon :camera-status="true"></camera-icon>
      </template>
    </base-select>
  </div>
</template>

<script>
import BaseSelect from "@/components/UI/BaseSelect.vue";
import CameraIcon from "@/components/UI/Icons/CameraIcon.vue";

export default {
  name: "CameraTest",
  components: {CameraIcon, BaseSelect},
  props: ['camerasList', 'selectedCamera'],
  emits : ['is-test-passed','stream','stream-stopped','video-stream'],
  data(){
    return {
      cameraAspectRatio : 0,
      cameras : this.camerasList,
      camera : this.selectedCamera,
      stream : null,
      isTestPassed : false,
      videoBlob : null,
      blobsFlagArray : [],

    }
  },
  watch :{
    selectedCamera(currentVal) {
      this.camera = currentVal
    },
    camera(currentVal) {
      this.$store.dispatch('setCameraId', currentVal.deviceId)
      this.$store.dispatch('setCamera', currentVal)
      this.startTest(currentVal.deviceId);
    },
    videoBlob(currentBuffer, lastBuffer){
      this.cameraChecker(currentBuffer,lastBuffer);
    },
    blobsFlagArray: {
      deep : true,
      handler(currentArray){
        if(currentArray.length === 11){
          this.isTestPassed = true;
        } else if(currentArray.length === 0){
          this.isTestPassed = false
        }
      }
    },
    isTestPassed(currentVal){
      if(currentVal) {
        this.$emit('is-test-passed', 'camera')
      }
    }
  },
  methods: {
    cameraChecker(currentBuffer, lastBuffer){
      if(currentBuffer !== lastBuffer){
        this.blobsFlagArray.push('t')
      }
    },
    startTest(deviceId){
      navigator.mediaDevices
          .getUserMedia({video :  { deviceId: deviceId }})
          .then(stream => {
            this.stream = stream;
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = event => {
              this.videoBlob = event.data;
            };
            recorder.start(200);
            this.$emit('video-stream', stream)

          })
          .catch(err => console.log(err))
    },
    stopTest(){
      if(this.stream){
        this.blobsFlagArray = [];
        this.stream.getTracks().forEach((track) => {
          track.stop();
        });
        this.stream = null
      }

    },

  },
  mounted() {
    this.maxHeight  = window.innerHeight - this.$refs.camera.getBoundingClientRect().bottom - 15 + 'px'
    window.addEventListener("resize", () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.$refs.camera){
          this.maxHeight  = window.innerHeight - this.$refs.camera.getBoundingClientRect().bottom - 15 + 'px'
        }

      }, 80);
    });
  },
  // unmounted() {
  //   if(this.parentComp === 'device-test')
  //   this.stopTest();
  // }
}
</script>

<style scoped>
.camera-select{
  width: 40rem;
  height : 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

@media (max-width: 480px) {
  .camera-select{
    width: 32rem;

  }
}
</style>

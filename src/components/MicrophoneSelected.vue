<template>
  <div ref="mic" class="mic-select">
    <!--    <span style="  font-size: 1.2rem;-->
    <!--  font-weight: 400;-->
    <!--  color: #75758F;width: 100%;display: flex" :style="{'flex-direction' : $i18n.locale !== 'en' ? 'row' : 'row-reverse'}">{{$store.getters.t("microphone")}}</span>-->
    <base-select
        :option-values="mics"
        :side="'select-rtl'"
        :arrow-direction="'arrow-down-icon-ltr'"
        :select-side="'list-item__label-lrt'"
        :is-waiting-room="'yes'"
        :max-height="maxHeight"
        :div-height="'5rem'"
        down-img-color="#1B76FF"
        v-model="mic"
        @change-index="changeBaseSelectIndex">
      <template #icon>
        <microphone-icon :mic-status="true"></microphone-icon>
      </template>
      <template #functional-icon>
        <div ref="signals" class="signals">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </template>
    </base-select>
  </div>
</template>

<script>
import BaseSelect from "./UI/BaseSelect";
import MicrophoneIcon from "./UI/Icons/MicrophoneIcon";
export default {
  name: "MicrophoneTest",
  components: { MicrophoneIcon, BaseSelect },
  props: ["micsList", "selectedMic"],
  emits: ["audio-stream"],
  data() {
    return {
      mics: this.micsList,
      mic: this.selectedMic,
      stream: null,
      audioAnalyzer: null,
      maxHeight:0,
      timer: 0,
      counter:0,
      selectedIndex:0
    };
  },
  watch: {
    selectedMic(currentVal) {
      this.mic = currentVal;
    },
    mic(currentVal) {
      this.startTest(currentVal.deviceId);
      if (this.counter > 0){
        localStorage.setItem('set-mic',currentVal.deviceId)
        this.eventBus.emit('set-audio-input-device',{label:currentVal.label, index:this.selectedIndex})
      }
      this.counter++
    },
  },
  methods: {
    async startTest(id) {
      let signals = Array.from(this.$refs.signals.children);
      let signalSigns = signals;
      const AudioContext =
          window.AudioContext || window.webkitAudioContext || false;
      navigator.mediaDevices
          .getUserMedia({video: false, audio: { deviceId: id } })
          .then((stream) => {
            this.stream = stream;
            this.$store.dispatch('setMicrophoneAudioStream', stream);
            this.$emit("audio-stream", stream);
            const recorder = new MediaRecorder(stream);
            recorder.start(200);
            const context = new AudioContext();
            this.audioAnalyzer = context.createAnalyser();
            const array = new Uint8Array(this.audioAnalyzer.frequencyBinCount);
            const source = context.createMediaStreamSource(stream);
            source.connect(this.audioAnalyzer);
            const updateData = () => {
              if (this.audioAnalyzer) {
                this.audioAnalyzer.getByteFrequencyData(array);
                let values = 0;
                for (let i = 0; i < array.length; i++) {
                  values += array[i];
                }
                const avg = values / array.length;
                let actualSignalSigns = Math.round(avg / 15);
                let range = Array.from(signalSigns).slice(0, actualSignalSigns);
                for (let i = 0; i < signalSigns.length; i++) {
                  signalSigns[i].style.backgroundColor = "#e6e6e6";
                }
                for (let i = 0; i < range.length; i++) {
                  range[i].style.backgroundColor = "#1a73e8";
                }
                requestAnimationFrame(updateData);
              }
            };
            updateData();
          })
          .catch(function (err) {
            console.log(err);
          });
    },
    stopTest() {
      if(this.stream){
        this.stream.getTracks().forEach((track) => {
          track.stop();
          this.audioAnalyzer = null;
        });
        this.stream = null;
      }
    },
    changeBaseSelectIndex(index){
      this.selectedIndex = index
    },
  },
  mounted() {
    this.eventBus.on('confirm-choose-mic',()=> {
      if (this.mic.deviceId !== this.$store.getters.microphoneId && this.stream) {
        this.eventBus.emit('microphone_changed', this.mic.deviceId)
        this.$store.dispatch('setMicrophoneId', this.mic.deviceId)
      }
    })
    this.maxHeight  = window.innerHeight - this.$refs.mic.getBoundingClientRect().bottom - 15 + 'px'
    window.addEventListener("resize", () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if(this.$refs.mic){
          this.maxHeight  = window.innerHeight - this.$refs.mic.getBoundingClientRect().bottom - 15 + 'px'
        }

      }, 80);
    });
  },
  // unmounted() {
  //   this.stopTest();
  // },
};
</script>

<style scoped>
.mic-select {
  width: 40rem;
  height: 3.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.signals {
  width: 2rem;
  height: 2rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  right: 2rem;
  bottom: 0.3rem;
}
.signals div {
  width: 0.6rem;
}
.signals div:first-child {
  height: 0.4rem;
}
.signals div:nth-child(2) {
  height: 0.7rem;
}
.signals div:last-child {
  height: 1.1rem;
}
@media (max-width: 480px) {
  .mic-select {
    width: 32rem;
  }
}
</style>

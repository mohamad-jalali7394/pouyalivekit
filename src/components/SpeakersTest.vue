<template>
  <div ref="speaker" class="speakers">
<!--    <span style="  font-size: 1.2rem;-->
<!--  font-weight: 400;-->
<!--  color: #75758F;width: 100%;display: flex" :style="{'flex-direction' : $i18n.locale !== 'en' ? 'row' : 'row-reverse'}" >{{$store.getters.t("speaker")}}</span>-->
    <base-select
        :side="'select-rtl'" :arrow-direction="'arrow-down-icon-ltr'" :select-side="'list-item__label-lrt'"
        :option-values="speakers" :max-height="maxHeight"
        :is-waiting-room="'yes'"
        down-img-color="#1B76FF"
        v-model="speaker"  :div-height="'5rem'">
      <template #icon>
        <speaker-icon></speaker-icon>
      </template>
    </base-select>
    <span class="test-text" @click.stop="playTestAudio">{{$store.getters.t("test")}}</span>
    <audio src="/voice/Haydeh.mp3" ref="audio"></audio>
  </div>
</template>

<script>
import BaseSelect from "./UI/BaseSelect";
import SpeakerIcon from "./UI/Icons/SpeakerIcon";
export default {
  name: "SpeakersTest",
  components: {SpeakerIcon, BaseSelect},
  props : ['speakersList', 'selectedSpeaker'],
  data(){
    return {
      speakers : this.speakersList,
      speaker : this.selectedSpeaker,
      maxHeight:0,
      timer: 0,
      counter:0,
    }
  },
  watch : {
    selectedSpeaker:{
      deep:true,
      handler(currentVal){
        this.speaker = currentVal;
      }

    },
    speaker: {
      deep: true,
      handler(val) {
        this.$store.dispatch('setspeaker', val)
        if (this.counter > 0) {
          this.eventBus.emit('change-speaker-id', val?.deviceId)
          this.eventBus.emit('set-audio-output-device', val)
        }
        this.counter++
      }

    }
  },
  methods : {
    playTestAudio(){
      this.$refs.audio.setSinkId(this.speaker?.deviceId);
      this.$refs.audio.play();
    }
  },
  mounted() {
    setTimeout(()=>{
      if (this.$store.getters?.speaker)
      this.speaker = this.$store.getters.speaker
    }, 10)
    this.maxHeight  = window.innerHeight - this.$refs.speaker.getBoundingClientRect().bottom - 15 + 'px'
    window.addEventListener("resize", () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if(this.$refs.speaker){
          this.maxHeight  = window.innerHeight - this.$refs.speaker.getBoundingClientRect().bottom - 15 + 'px'
        }

      }, 80);
    });
  }
}
</script>

<style scoped>
.speakers{
  width: 40rem;
  height : 3rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.test-text{
  text-decoration: underline;
  font-size: 1.5rem;
  color : rgba(0, 0, 0, .8);
  position: absolute;
  color: #00A9FF;
  cursor: pointer;
  left: 0;
  bottom: -4rem;

}
@media (max-width: 480px) {
  .speakers{
    width: 32rem;
  }
}
</style>

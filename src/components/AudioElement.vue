

<template>
  <li v-show="false" >
    <audio v-show="false"  autoplay ref="microphone" ></audio>
  </li>
</template>

<script>
import {nextTick} from "vue";

export default {
  name: "AudioElement",
  props:['audioTrack','userId', 'micIsEnabled', 'isMute'],
  watch:{
    micIsEnabled:{
      handler(val){
        if (val){
          this.$refs.microphone.muted = false
          setTimeout(()=>{
            this.$refs.microphone.muted = this.isMute
          },50)

        }else{
          this.$refs.microphone.muted = true
        }

      }
    },
    isMute:{
      handler(val){
        setTimeout(()=>{
          if (this.$refs?.microphone){
            if (val){
              this.$refs.microphone.muted = true
            }else {
              this.$refs.microphone.muted = false
              this.$refs.microphone.muted = !this.micIsEnabled
            }

          }
        },50)

      }
    }
  },
  methods : {
    addStreamToAudioElement(){
      nextTick(() => {
        if (this.audioTrack?.kind === 'audio' && this.audioTrack){
          this.audioTrack?.attach(this.$refs.microphone)
        }
      })
    }
  },
  mounted() {
    if (+this.$store.getters.userId !== +this.userId){
      this.addStreamToAudioElement();
    }
    // this.emitter.on('toggle-mute', ({id, mute})=>{
    //   if (id === this.userId){
    //     this.$refs.microphone.muted = mute
    //   }
    // })
  },
}
</script>
<style scoped>

</style>
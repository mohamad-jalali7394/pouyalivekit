<template>
  <video @dblclick="shareFullScreen" :srcObject="shareStream" ref="video-share" autoplay playsinline muted>
  </video>
  <div
      v-if="!isIphone && isMobile === true"
      class="full__screen-icon"
      @click="shareFullScreen"
  >
    <img draggable="false" src="/img/fullscreen.svg" alt="not loaded" />

  </div>
  <div :class=" isMobile ? $i18n.locale === 'fa' ? 'participant-name-mobile' : 'participant-name-mobile-ltr' : $i18n.locale === 'fa' ?  'participant-name' : 'participant-name-ltr'">
    <span style="margin: 0 0.4rem"> {{participantName}}</span>
    <span> </span>
    <span> {{$store.getters.t('is-presenting')}}</span>
   </div>
  <div class="participant-name-back-ground">

  </div>
</template>

<script>
import DetectMobile from "../utils/detectMobile";

export default {
  name: "ScreenShare",
  props : ['shareStream', 'participantName'],
  data(){
    return {
      isIphone :false,
      isFullScreen: false,
      isMobile:false,
    }
  },
  methods:{

    shareFullScreen() {
      const pdfShare = this.$refs["video-share"];
      if (
          (document.fullScreenElement !== undefined &&
              document.fullScreenElement === null) ||
          (document.msFullscreenElement !== undefined &&
              document.msFullscreenElement === null) ||
          (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
          (document.webkitIsFullScreen !== undefined &&
              !document.webkitIsFullScreen)
      ) {
        if (pdfShare.requestFullScreen) {
          pdfShare.requestFullScreen();
        } else if (pdfShare.mozRequestFullScreen) {
          pdfShare.mozRequestFullScreen();
        } else if (pdfShare.webkitRequestFullScreen) {
          pdfShare.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (pdfShare.msRequestFullscreen) {
          pdfShare.msRequestFullscreen();
        }
        this.isFullScreen = true

      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.isFullScreen = false
        this.eventBus.emit('cancel-full-screen')

      }

    },
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  watch:{
  },
  mounted() {
    setTimeout(() => {
    }, 15000)
    if (!this.participantName || !this.shareStream) {
      this.$emit("screenSharingRefused")
    }
    function iOS() {
      return [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform);
      // // iPad on iOS 13 detection
      // || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }
    this.isIphone = iOS();
  }
}
</script>

<style scoped>
video {
  width: 100%;
  height: 100%;
  position: relative;
}
.participant-name-back-ground{
  position: absolute;
  top: -0.5rem;
 width: 100%;
  height: 3rem;
  background-color: #7b7b7b;
  opacity: 0.6
;
  font-size: 1.8rem;
  color : white;

  z-index: 8;
}
.participant-name{
  position: absolute;
  display: flex;
  flex-direction: row-reverse;
  top: 0;
  right: 0;
  font-size: 1.6rem;
  color : white;
  z-index: 10;
}
.participant-name-ltr{
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 0;
  left: 0;
  font-size: 1.6rem;
  color : white;
}
.participant-name-mobile{
  position: absolute;
  display: flex;
  flex-direction: row-reverse;
  top: 0;
  right: 0;
  font-size: 1.3rem;
  color : white;
  z-index: 10;
}
.participant-name-mobile-ltr{
  position: absolute;
  display: flex;
  flex-direction: row;
  top:0;
  left: 0;
  font-size: 1.3rem;
  color : white;
  z-index: 10;
}
.participant-name > span:nth-child(2) {
  width: 0.5rem;
}
.full__screen-icon {
  position: absolute;
  width: 2rem;
  height: 2rem;
  right: 0;
  bottom: 0;
  z-index: 100;
  cursor: pointer;
}
@media (min-width: 768px) and (max-width: 980px) {
  .participant-name{
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    font-size: 1.5rem;
    color : white;
  }
  .participant-name-ltr{
    position: absolute;
    display: flex;
    flex-direction: row;
    top: 0;
    left: 0;
    font-size: 1.5rem;
    color : white;
  }
}
@media(min-width: 481px) and (max-width: 767px)  {
  .participant-name{
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    top: 0;
    right: -5rem;
    font-size: 1.2rem;
    color : white;
  }
  .participant-name-ltr{
    position: absolute;
    display: flex;
    flex-direction: row;
    top: 0;
    left: 0;
    font-size: 1.2rem;
    color : white;
  }
}
@media (max-width: 480px)  {
  .participant-name{
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    top: 0;
    right: -13rem;
    font-size: 1.2rem;
    color : white;
  }
  .participant-name-ltr{
    position: absolute;
    display: flex;
    flex-direction: row;
    top: 0;
    left: 0;
    font-size: 1.2rem;
    color : white;
  }
}
</style>
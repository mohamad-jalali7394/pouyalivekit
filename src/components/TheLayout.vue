<template>
  <agenda-progress v-if="showAgendaComponent"   :is-moderator-substitute-activated="isModeratorSubstituteActivated"></agenda-progress>
  <div
      v-if="isMobile === false"
      class="conference-container"
      ref="layoutContainer"
  >

    <div
        :class="{
          'layout-container': !isSharedWithSidebar,
          'layout--container--with--share--and--sidebar': !!isSharedWithSidebar,
        }"
    >
      <div
          :class="{
            'share-screen': !isSharedWithSidebar,
            'share--screen--with--sidebar': !!isSharedWithSidebar,
          }"
          ref="shareScreen"
          v-if="isShared"
      >
        <div
            :class="{
              'share-screen__presenter':
                !sideBarIsVisible && $i18n.locale === 'fa',
              'share-screen__presenter-ltr':
                !sideBarIsVisible && $i18n.locale === 'en',
              'share-screen__presenter--with--sidebar':
                sideBarIsVisible && $i18n.locale === 'fa',
              'share-screen__presenter--with--sidebar-ltr':
                sideBarIsVisible && $i18n.locale === 'en',
            }"
        >
          <div>
              <span>
                {{
                  shareSubscriberName
                }}
              </span>
            <span>&nbsp;</span>
            <span>{{ $t("is-presenting") }}</span>
          </div>
        </div>
        <video
            autoplay
            class="share-screen__video"
            ref="video-share"
            controls
            @dblclick="shareFullScreen"
        ></video>
      </div>




      <div
          :class="{
            'share-screen': !isSharedWithSidebar,
            'share--screen--with--sidebar': !!isSharedWithSidebar,
          }"
          style="aspect-ratio: 16 / 9;"
          ref="shareScreen"
          v-if="isVideoShared"
      >
        <div
            :class="{
              'share-screen__presenter':
                !sideBarIsVisible && $i18n.locale === 'fa',
              'share-screen__presenter-ltr':
                !sideBarIsVisible && $i18n.locale === 'en',
              'share-screen__presenter--with--sidebar':
                sideBarIsVisible && $i18n.locale === 'fa',
              'share-screen__presenter--with--sidebar-ltr':
                sideBarIsVisible && $i18n.locale === 'en',
            }"
        >
          <div>
              <span>
                {{videoShareSubscriberName }}
              </span>
            <span>&nbsp;</span>
            <span>{{ $t("is-presenting") }}</span>
          </div>
        </div>
        <video
            class="video-share__video"
            ref="sharedVideo"
            style="width: 100%"
            crossorigin="anonymous"
            :controls="videoShareStatus"
            @dblclick="shareFullScreen"
        ></video>
        <audio style="display: none" ref="sharedAudio"></audio>
      </div>





      <div
          ref="video-list-container"
          :class="{
            'video-list-container': !isShared,
            'video-list-container--with-share1':
              isShared && !isSharedWithSidebar,
            'video-list-container--with-share--and--sidebar':
              isShared && isSharedWithSidebar,
          }"
      >
        <ul
            ref="videoStreamContainer"
            :class="{
              'video-ul': true,
              'video-ul--with-share': isShared && !isSharedWithSidebar,
              'video-ul--with-share--and--sidebar':
                isShared && isSharedWithSidebar,
            }"
        >

          <base-video
              v-for="(subscriber, index) in videoStreamsInLayout"
              :key="subscriber"
              :is-public="$store.getters.meetingType === 'public'"
              :is-moderator-accept="isModeratorAccept"
              :name-font="nameFont"
              :camera-ratio="cameraRatio"
              :first-camera-ratio="firstCameraRatio"
              :camera-is-enabled="+subscriber.userId === +$store.getters.userId ? cameraStatus : subscriber?.isCameraOn"
              :mic-is-enabled="subscriber?.isMicOn"
              stream-manager=""
              stream-height=""
              stream-width=""
              :full-name="
                subscriber.name !== null &&
                subscriber.name !== undefined &&
                subscriber.name !== ''
                  ? subscriber.name
                  : 'ناشناس(بدون نام)'
              "
              :index="index"
              :mode="classMode"
              :subscribers-length="subscribersLength"
              :pin-mode="pinClassMode"
              :side-bar-is-visible="sideBarIsVisible"
              media-type="video"
              :active-speaker-name="activeSpeaker"
              :video-track="subscriber.videoTrack"
              :audio-track="subscriber.audioTrack"
              :user-id="subscriber.userId"
              :pinned="subscriber.pin"
              :it-is-me="+subscriber.userId === +$store.getters.userId"
              :layout-type="layoutType"
              :is-shared="isShared"
              :layout-updated="layoutUpdated"
              :is-active-speaker-maximized="isActiveSpeakerMaximized"
              :is-moderator-maximize-active-speaker="isModeratorMaximizeActiveSpeaker"
              :number-of-videos="subscribedTracksList.length"
              otherCameraRatio
              @remove-from-layout="removeFromLayout"
          ></base-video>
          <audio-element v-for="(subscriber) in subscribedTracksList"
                         :key="subscriber"
                         :audio-track="subscriber.audioTrack"
                         :mic-is-enabled="subscriber?.isMicOn"
                         :user-id="subscriber.userId"
                         :is-mute="subscriber?.isMute"
          ></audio-element>
        </ul>
      </div>
    </div>
  </div>

  <div
      v-else
      class="conference-container"
      ref="layoutContainer"
      :class="{
        'with-side-bar__mobile': sideBarIsVisible,
        'without-side-bar': !sideBarIsVisible,
      }"
  >
    <div class="layout-container">
      <div class="share-screen" ref="shareScreen" v-if="isShared">
        <div
            v-if="isMobile === true && !isIphone"
            class="full__screen-icon"
            @touchend="shareFullScreen"
        >
          <img src="/img/full-screen-mobile.svg" alt="not loaded"/>
        </div>

        <video
            autoplay
            class="share-screen__video"
            ref="video-share"
            v-if="isShared"
        ></video>
      </div>
      <div
          ref="video-list-container"
          :class="{
            'video-list-container': !isShared,
            'video-list-container--with-share1': isShared,
          }"
      >
        <div v-if="!isShared && !recordStatus" class="screen__recorder"></div>
        <ul
            ref="videoStreamContainer"
            :class="{ 'video-ul': true, 'video-ul--with-share': isShared }"
        >
          <base-video
              v-for="(subscriber, index) in videoStreamsInLayout"
              :key="subscriber"
              :name-font="nameFont"
              :is-public="$store.getters.meetingType === 'public'"
              :is-moderator-accept="isModeratorAccept"
              :tag-name-font="tagNameFont"
              :camera-ratio="cameraRatio"
              :first-camera-ratio="firstCameraRatio"
              :camera-is-enabled="+subscriber.userId === +$store.getters.userId ? cameraStatus : subscriber?.isCameraOn"
              :mic-is-enabled="subscriber?.isMicOn"
              :stream-manager="subscriber.data"
              :stream-height="subscriber.height"
              :stream-width="subscriber.width"
              :full-name="
                subscriber.name !== null &&
                subscriber.name !== undefined &&
                subscriber.name !== ''
                  ? subscriber.name
                  : 'ناشناس(بدون نام)'
              "
              :index="index"
              :mode="classMode"
              :subscribers-length="subscribersLength"
              :pin-mode="pinClassMode"
              :side-bar-is-visible="sideBarIsVisible"
              media-type="video"
              :active-speaker-name="activeSpeaker"
              :video-track="subscriber.videoTrack"
              :audio-track="subscriber.audioTrack"
              :pinned="subscriber.pin"
              :user-id="subscriber.userId"
              :it-is-me="+subscriber.userId === +$store.getters.userId"
              :layout-type="layoutType"
              :is-shared="isShared"
              :layout-updated="layoutUpdated"
              :is-active-speaker-maximized="isActiveSpeakerMaximized"
              :is-moderator-maximize-active-speaker="isModeratorMaximizeActiveSpeaker"
              :number-of-videos="subscribedTracksList.length"
              @remove-from-layout="removeFromLayout"
          ></base-video>
          <audio-element v-for="(subscriber) in subscribedTracksList"
                         :key="subscriber"
                         :audio-track="subscriber.audioTrack"
                         :user-id="subscriber.userId"
                         :is-mute="subscriber?.isMute"
          ></audio-element>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BaseVideo from "@/components/BaseVideo.vue";
import AudioElement from "@/components/AudioElement.vue";
import {nextTick} from "vue";
import AgendaProgress from "@/components/AgendaProgress.vue";

export default {
  name: "TheLayout",
  components: {AgendaProgress, AudioElement, BaseVideo},
  props:['showAgendaComponent','isModeratorSubstituteActivated','videoShareStatus','otherCameraRatio','isModeratorMaximizeActiveSpeaker','cameraStatus','isActiveSpeakerMaximized','layoutUpdated','screenShareTrack','screenSizeChanged','layoutType','isMobile', 'subscribedTracksList','sideBarIsVisible','isSharedWithSidebar','isShared','shareSubscriberName','isModeratorAccept','nameFont','activeSpeaker','pinClassMode','classMode','firstCameraRatio','cameraRatio','layoutWith','otherVideoStreamHeight','activeSpeakerVideoStreamHeight','isVideoShared', 'videoShareSubscriberName'],
  data(){
    return {
      subscribersLength:0,
    }
  },
  computed:{
    videoStreamsInLayout(){
      const index = this.subscribedTracksList.findIndex((el)=>{
        return el.name === this.activeSpeaker
      })
      if (index > -1){
        return !this.isActiveSpeakerMaximized ? this.subscribedTracksList : this.subscribedTracksList[index]?.userId ? [this.subscribedTracksList[index]] : this.subscribedTracksList

      }else {
        return !this.isActiveSpeakerMaximized ? this.subscribedTracksList : this.subscribedTracksList[0]?.userId ? [this.subscribedTracksList[0]] : this.subscribedTracksList

      }
    }
  },
  watch:{
    layoutWith:{
      immediate:true,
      handler(val){
        if (val && this.$refs.videoStreamContainer){
          console.error('wiiiiiiiiiiiidthhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
          console.error(val)
          this.$refs.videoStreamContainer.style.width = val
        }


      }
    },
    screenSizeChanged:{
      immediate: true,
        handler(){
        nextTick(()=>{
          if ( this.$refs.videoStreamContainer?.scrollHeight > this.$refs.layoutContainer?.offsetHeight){
            this.$refs.videoStreamContainer.style.overflowY = 'auto'
          }else if (this.$refs.videoStreamContainer?.style.overflowY === 'auto') {
            this.$refs.videoStreamContainer.style.overflowY = 'hidden'
          }
        })
     }
    },
    isShared:{
      immediate:true,
      handler(val){
        if (val){
            setTimeout(async ()=>{
              console.error(this.screenShareTrack)
              await this.screenShareTrack.attach(this.$refs['video-share'])
              this.eventBus.emit('update-layout')
            },1000)


        }
      }
    }
  },
  methods:{
    removeFromLayout(id){
      this.$emit('remove-from-layout', id)
    },
 async handleVideoFile(file){
   const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
   if (isFirefox){
     this.eventBus.emit("notification", {
       title: "پیام",
       type: "error",
       bodyText: 'لطفا برای اشتراک ویدئو از یک مرورگر دیگر استفاده کنید',
       time: 5000,
     });
     return {hasStream: false, stream: null}
   }else {
     console.error(file)
     try {
       const video = this.$refs.sharedVideo;
       video.src =  URL.createObjectURL(file);
       await video.play();
       const stream = video.captureStream();
       return {hasStream: true, stream: stream}
     }catch (err){
       console.error(err)
       this.eventBus.emit("notification", {
         title: "پیام",
         type: "error",
         bodyText: 'فرمت یا کدک این ویدئو در مرورگر پشتیبانی نمیشود',
         time: 5000,
       });
       return {hasStream: false, stream: null}
     }
   }

    },
   async subscribeVideoSharing(track){
     await track.attach(this.$refs['sharedVideo'])
   },
    shareFullScreen() {
      const videoShare = this.$refs["sharedVideo"];
      if (videoShare.requestFullscreen) {
        videoShare.requestFullscreen();
      } else if (videoShare.webkitRequestFullscreen) {
        videoShare.webkitRequestFullscreen();
      } else if (videoShare.msRequestFullscreen) {
        videoShare.msRequestFullscreen();
      }
    },
  },
  created() {
  },
  mounted() {
    setTimeout(()=>{
      if ( this.$refs.videoStreamContainer?.scrollHeight > this.$refs.layoutContainer?.offsetHeight){
        this.$refs.videoStreamContainer.style.overflowY = 'auto'
      }else if (this.$refs.videoStreamContainer?.style.overflowY === 'auto') {

        this.$refs.videoStreamContainer.style.overflowY = 'hidden'
      }
    },100)
  },
}
</script>

<style scoped>
.conference-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.layout-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.layout--container--with--share--and--sidebar{
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   width: 100%;
   height: 100%;
 }
.with-side-bar__mobile {
  width:0;
}
.share-screen {
   color: white;
   position: relative;
   /*padding: 1.6rem;*/
   //font-size: 150%;
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100%;
   width: 75%;
   /*border-left: .1rem solid white;*/
   /*border-right: .1rem solid white;*/
   /*margin: auto 0px auto 2px;*/
 }
.share-screen__video {
  width: 100%;
  height: 100%;
}
.share-screen__video::-webkit-media-controls {
  display: none !important;
}

.share-screen__video::-webkit-media-controls-enclosure {
  display: none !important;
}
.share--screen--with--sidebar{
  color: white;
  position: relative;
  width: 70%;
  height: 100%;
}
.share-screen__presenter {
  width: calc(100% - 3.2rem);
  height: 3.6rem;
  font-size: 1.2rem;
  color: white;
  padding-right: 1rem;
  position: absolute;
  border-radius: 1.2rem;
  top: 1.6rem;
  left: 1.6rem;
  background-color: rgba(60, 64, 67, 0.8);
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}
.share-screen__presenter-ltr {
  width: calc(100% - 3.2rem);
  height: 3.6rem;
  font-size: 1.2rem;
  color: white;
  padding-right: 1rem;
  position: absolute;
  border-radius: 1.2rem;
  top: 1.6rem;
  left: 1.6rem;
  background-color: rgba(60, 64, 67, 0.8);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}
.share-screen__presenter--with--sidebar{
  width: calc(100vw - 40rem);
  height: 3.6rem;
  font-size: 1.2rem;
  color: white;
  padding-right: 1rem;
  position: absolute;
  border-radius: 1.2rem;
  top: 1.6rem;
  left: 1.6rem;
  background-color: rgba(60, 64, 67, 0.8);
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}
.share-screen__presenter--with--sidebar-ltr{
  width: calc(100vw - 36rem);
  height: 3.6rem;
  font-size: 1.2rem;
  color: white;
  padding-right: 1rem;
  position: absolute;
  border-radius: 1.2rem;
  top: 1.6rem;
  left: 1.6rem;
  background-color: rgba(60, 64, 67, 0.8);
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}
.video-list-container {
  display: flex;
  position: relative;
  width: 100%;
  align-items: center;
  height: 100%;
  border: solid 1px transparent;
  /* box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
  margin: auto 0;
  justify-content: center;
}
.video-list-container--with-share1 {
  display: flex;
  align-items: center;
  width: 25%;
  flex-direction: column;
  justify-content: center;
  border: solid 1px transparent;

  height: 100%;
  /* box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
}
.video-list-container--with-share--and--sidebar{
  display: flex;
  align-items: center;
  width: 30%;
  flex-direction: column;
  height: 100%;
  border: solid 1px transparent;
  overflow-y: auto;
  justify-content: center;

  /* box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
}
.video-ul--with-share--and--sidebar{
  display: flex;
  flex-wrap: wrap;
  height: auto;
  max-height: 100%;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  width: 100%;
}
.video-ul {
  display: flex;
  flex-wrap: wrap;
  height: auto;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
  position: relative;
  width: 100%;
  max-height: 100%;
}

.video-ul--with-share {
  display: flex;
  flex-wrap: wrap;
  height: auto;
  max-height: 100%;
  /* flex-direction: column; */
  /*width: 30%;*/
  /* border: solid 1px transparent;
  box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}
@media (min-width: 768px) and (max-width: 1024px){
  .share-screen{
    width: 100%;
  }
  .share-screen__presenter {
    height: 2rem;
    top: 3.6rem;
  }
  .share-screen__presenter-ltr {
    height: 2rem;
    top: 3.6rem;
  }
  .video-list-container {
    display: flex;
    width: 100%;
    /*align-items: center;*/
    height: 100%;
    border: solid 1px transparent;
    /* box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
    //margin: auto 0;
    /*justify-content: center;*/
  }
  .video-list-container--with-share1 {
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: column;
    height: 100%;
    border: solid 1px transparent;
    overflow-y: auto;

    /* box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
  }
  .video-ul {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    /* border: solid 1px transparent;
    box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
    /* margin-top: auto;
    margin-bottom: auto; */
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
    height: fit-content;
    max-height: 100%;
  }
  .video-ul--with-share {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    width: 100%;
    /* flex-direction: column; */
    /*width: 30%;*/
    /* border: solid 1px transparent;
    box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
    justify-content: center;
    align-items: center;
    overflow-y: auto;

  }
}
@media (min-width: 541px) and (max-width: 767px){
  .share-screen{
    width: 100%;
    height: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .share-screen__presenter {
    height: 2rem;
    top: 3.6rem;
  }
  .share-screen__presenter-ltr {
    height: 2rem;
    top: 3.6rem;
  }
  .video-list-container {
    display: flex;
    width: 100%;
    /*align-items: center;*/
    height: 100%;
    border: solid 1px transparent;
    /* box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
    //margin: auto 0px;
    /*justify-content: center;*/
  }

  .video-list-container--with-share1 {
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: column;
    height: 100%;
    border: solid 1px transparent;
    overflow-y: auto;
    justify-content: start;

    /* box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
  }
  .video-ul {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    /* border: solid 1px transparent;
    box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
    /* margin-top: auto;
    margin-bottom: auto; */
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
    height: fit-content;
    max-height: 100%;
  }
  .video-ul--with-share {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    width: 100%;
    /* flex-direction: column; */
    /*width: 30%;*/
    /* border: solid 1px transparent;
    box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
    justify-content: center;
    align-items: center;

  }
}
@media (min-width: 320px) and (max-width: 540px) {
  .share-screen{
    height: 100%;
  }
  .share-screen__presenter {
    height: 2rem;
    top: 3.6rem;
  }
  .share-screen__presenter-ltr{
    height: 2rem;
    top: 3.6rem;
  }
  .video-list-container{
    display: flex;
    width: 100%;
    align-items: center;
    height:100%;
    border: solid 1px transparent;
    /* box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
    margin: auto 0px;
    justify-content: center;
  }
  .video-list-container--with-share1 {
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: column;
    height: 100%;
    border: solid 1px transparent;
    overflow-y: auto;
    justify-content: center;

    /* box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
  }
  .video-ul {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    /* border: solid 1px transparent;
    box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
    /* margin-top: auto;
    margin-bottom: auto; */
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
    height: fit-content;
    max-height: 100%;
  }
  .video-ul--with-share {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    width: 100%;
    /* flex-direction: column; */
    /*width: 30%;*/
    /* border: solid 1px transparent;
    box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
    justify-content: center;
    align-items: center;
    overflow-y: auto;
  }

}
@media (min-width: 270px) and (max-width: 319px) {
  .video-list-container {
    display: flex;
    width: 100%;
    align-items: center;
    height: 100%;
    border: solid 1px transparent;
    /* box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
    //margin: auto 0px;
    justify-content: center;
  }
  .video-list-container--with-share1 {
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: column;
    height: 100%;
    border: solid 1px transparent;
    overflow-y: auto;

    /* box-shadow: 0 1px 4px rgba(56, 56, 250, 0.616); */
  }
}

</style>
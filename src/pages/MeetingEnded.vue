<template>
  <div class="container">
    <img draggable="false" v-if="isMobile === true" src="/img/MobileGoodbye.svg" alt="not loaded" class="goodbye__svg-mobile">
    <img draggable="false" v-else  src="/img/GoodbyePage.svg" alt="not loaded" class="goodbye__svg">

    <div class="card">
      <div :style="{direction: $i18n.locale === 'fa' ? 'rtl':'ltr'}" class="row valign-wrapper">
        <div class="col s6 offset-s3 valign">
          <div class="card-content">
            <span v-if="!isMeetingEnded" class="card-title">{{$store.getters.t("you-left-meeting")}}</span>
            <span v-else class="card-title">{{$store.getters.t("time-is-up")}}</span>
            <p v-if="!isMeetingEnded" id="text">{{$store.getters.t("click-link")}}</p>
            <p v-else id="text">{{$store.getters.t("thanks-text")}}</p>
            <a v-if="!isMeetingEnded" id="link" :href="url">{{url}} </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DetectMobile from "../utils/detectMobile";
import momentjs from "moment";

export default {
  name: "MeetingEnded",
  data(){
    return{
      url : this.$store.getters.link,
      isMobile:false,
      isMeetingEnded:false
    }
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  mounted() {
    const nowDate = momentjs(Date.now()).format('YYYY/MM/DD HH:mm').toString()
    const endMeetingDate = momentjs(Date.now()).format('YYYY/MM/DD').toString() + ' ' + this.$store.getters.toSchd.to

    if (momentjs(nowDate).isAfter(endMeetingDate)) {
      this.isMeetingEnded = true
    }else {
      this.isMeetingEnded = false
    }
    console.error(JSON.parse(localStorage?.getItem("is-terminate"))?.isTerminate)
    this.isMeetingEnded = JSON.parse(localStorage?.getItem("is-terminate"))?.isTerminate ? true : false
    if(localStorage.getItem('language') === 'انگلیسی . En'){
      this.$i18n.locale = 'en'
    }else{
      this.$i18n.locale = 'fa'
    }
    localStorage.setItem('meetingDisplayName', null)
  }

}
</script>

<style scoped>
.container  {
  position: relative;

  height: 100%;
  width: 100%;

}



.card-title{
  font-size: 2.2rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.7);
}

.card-content{
  padding: 4rem;

}

#text{
  font-size: 1.5rem;
  margin-top: 1.5rem;
  color: rgba(0, 0, 0, 0.7);
}
.goodbye__svg{
  width: 100%;
  height: 95%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.card {
  position: absolute;
  border-radius: 2.5rem;
  background-color: white;
  font-size: 1rem;
  width: 50%;
  height: 30%;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  top: 0;
  transform: translate(-15%, 25%);

  box-shadow: 0 .2rem .8rem rgba(0, 0, 0, .26);
}

#link{
  text-decoration: none;
  direction: ltr;
  text-align: left;
  float: left;
  margin-top: 1.5rem;
  margin-bottom: 3.5rem;
  font-size: 1.5rem;
  color: #1a73e8;
  font-weight: bold;
}
@media (min-width: 767px) and (max-width: 1024px) {

  .card-title{
    font-size: 1.9rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.7);
  }
  #link{
    text-decoration: none;
    direction: ltr;
    text-align: left;
    float: left;
    margin-top: 1.5rem;
    margin-bottom: 3.5rem;
    font-size: 1.4rem;
    color: #1a73e8;
    font-weight: bold;
  }
  #text{
    font-size: 1.4rem;
    margin-top: 1.5rem;
    color: rgba(0, 0, 0, 0.7);
  }

}
@media (max-width: 767px) {
  .card-content{
    padding: 1.5rem;

  }
  .card {
    position: absolute;
    border-radius: 2.5rem;
    background-color: white;
    font-size: 1rem;
    width: 85%;
    height: 22%;
    padding-left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    top: 0;
    transform: translate(-8%, 75%);

    box-shadow: 0 .2rem .8rem rgba(0, 0, 0, .26);
  }
  .goodbye__svg-mobile{
    width: 100%;
    height: 50rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -30%);
  }
  .card-title{
    font-size: 1.4rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.7);
    letter-spacing: -0.5px;
  }
  #text{
    font-size: 0.9rem;
    margin-top: 1rem;
    color: rgba(0, 0, 0, 0.7);
  }
  #link{
    text-decoration: none;
    direction: ltr;
    text-align: left;
    float: left;
    margin-top: 2rem;
    margin-bottom: 2rem;
    font-size: 1.5rem;
    color: #1a73e8;
    font-weight: bold;
  }
}
</style>

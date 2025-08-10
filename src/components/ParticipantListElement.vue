<template>
  <li v-if="isGuest === true" class="guest__list">
    <span class="participant-name">
      <p>
      {{participantName}}
      </p>
    </span>
    <span class="participant-name">
      <p>
        {{participantLastname}}
      </p>

    </span>
    <span class="email-container">
      <p class="email">
      {{participantEmail}}
      </p>
    </span>
    <span class="phone">
      <p>
      {{participantPhoneNumber}}
      </p>
    </span>
  </li>
  <li v-else-if="isProceedingsInformation === true" class="proceedings-information-list">
    <span class="proceedings-information-list-span">
      <p style="max-width: 11rem; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
      {{participantFullName}}
      </p>
    </span>
    <span class="proceedings-information-list-span">
      <p>
        {{firstEntrance}}
      </p>

    </span>
    <span class="proceedings-information-list-span">
      <p>
       {{timeIn}}
      </p>

    </span>
    <span class="answer-container-meeting-result">
<!--      <teleport to="body">-->
      <!--        <span   class="participant__name&#45;&#45;tool-tip" ref="answer">  {{participantAnswer}}</span>-->
      <!--      </teleport>-->

      <p :class="(participantAgreement === true) ? 'participant-agreement' : participantAgreement === false ? 'participant-disagreement' : 'participant-without-answer'" ref="participant-answer"  >
      {{(participantAgreement !== true && participantAgreement !== false) ? 'عدم پاسخگویی' : (participantAgreement === true) ? 'تایید': 'عدم تایید'}}
      </p>
    </span>
  </li>
  <li v-else-if="isCreateMeeting === true" class="guest__list">
    <span class="participant-name">
      <p>
      {{participantName}}
      </p>
    </span>
    <span class="participant-name">
      <p>
        {{participantLastname}}
      </p>

    </span>
    <span class="email-container">
      <p>
      {{participantUserName}}
      </p>
    </span>
    <span class="phone">
      <div @click="this.$emit('delete-user')" class="delete-user">
           <span style="color: white;transform: rotate(45deg);font-size: 2.5rem;position: relative;right: 0.15rem;top: 0.1rem">+</span>
      </div>
    </span>
  </li>

  <li class="meeting-result-list" v-else-if = "meetingResult === true">
    <span class="participant-full__name-meeting-result">
      <p>
        {{participantFullName}}
      </p>

    </span>
    <span class="answer-container-meeting-result">
<!--      <teleport to="body">-->
      <!--        <span   class="participant__name&#45;&#45;tool-tip" ref="answer">  {{participantAnswer}}</span>-->
      <!--      </teleport>-->

      <p :class="(participantAgreement === true) ? 'participant-agreement' : 'participant-disagreement'" ref="participant-answer"  >
      {{(participantAgreement !== true && participantAgreement !== false) ? 'عدم پاسخگویی' : (participantAgreement === true) ? 'تایید': 'عدم تایید'}}
      </p>
    </span>

  </li>


  <li :class=" $i18n.locale !== 'en' ? 'poll-list' : 'poll-list-ltr'" v-else-if = "isPollingAnswer === true">
    <span class="participant-full__name" :style="{direction: $i18n.locale !== 'en' ? 'rtl' :'ltr','margin-left': $i18n.locale !== 'en' ? '0' :'1rem'}">
      <p>
        {{participantFullName}}
      </p>

    </span>
    <span class="answer-container" :style="{direction: $i18n.locale !== 'en' ? 'rtl' :'ltr'}">
<!--      <teleport to="body">-->
      <!--        <span   class="participant__name&#45;&#45;tool-tip" ref="answer">  {{participantAnswer}}</span>-->
      <!--      </teleport>-->

      <p class="answer" ref="participant-answer"  >
      {{participantAnswer}}
      </p>
    </span>

  </li>


  <li class="login-failed" v-else>
    <span class="failed--login--field">
     <p>
       {{computeDate}}
     </p>
    </span>
    <span class="failed--login--field">
<!--      <teleport to="body">-->
      <!--        <span   class="participant__name&#45;&#45;tool-tip" ref="answer">  {{participantAnswer}}</span>-->
      <!--      </teleport>-->

      <p>
      {{ip}}
      </p>
    </span>
    <span class="failed--login--field">
      <p>
        {{tenant}}
      </p>

    </span>
  </li>
</template>

<script>


export default {

  props:['isGuest','participantUserName','isCreateMeeting','meetingResult','participantName','participantLastname','participantEmail','participantPhoneNumber','participantAnswer','participantFullName','participantAgreement','isPollingAnswer','ip','time','tenant','timeIn','isProceedingsInformation','firstEntrance'],
  methods:{

    // showAnswerToolTip() {
    //   this.$refs.answer.style.visibility = "visible"
    // },
    // hideAnswerToolTip() {
    //   this.$refs.answer.style.visibility = "hidden"
    // },
  },
  computed:{
    computeDate(){
      return this.time
    }
  }
}
</script>

<style scoped>
.guest__list{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 3.7rem;
  border-bottom: solid 0.1rem #b8b8b8;
}
.proceedings-information-list{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 3.7rem;
  border-bottom: solid 0.1rem #b8b8b8;
}
.proceedings-information-list-span{
  width: 25%;
  display: flex;
  justify-content: center;
}

.login-failed{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 3.7rem;
  border-bottom: solid 0.1rem #b8b8b8;
  justify-content: space-around;
}
.poll-list{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
  border-bottom: solid 0.1rem #b8b8b8;
}
.poll-list-ltr{
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
  height: auto;
  border-bottom: solid 0.1rem #b8b8b8;
}
.meeting-result-list{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: auto;
  border-bottom: solid 0.1rem #b8b8b8;
}
.participant-full__name{
  width: 35%;
  margin-right: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.2rem;
  white-space : nowrap;
  overflow : hidden;
  text-overflow : ellipsis;
}
.participant-full__name-meeting-result{
  width: 70%;
  margin-right: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.2rem;
  white-space : nowrap;
  overflow : hidden;
  text-overflow : ellipsis;
}
.participant-full__name > p{
  white-space : nowrap;
  overflow : hidden;
  text-overflow : ellipsis;
  max-width: 80%;
}
.answer-container{
  position: relative;
  width: 65%;
  display: flex;
  min-height: 3.7rem;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.2rem;
}
.answer-container-meeting-result{
  position: relative;
  width: 30%;
  display: flex;
  min-height: 3.7rem;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
}
.answer{
  max-width: 95%;
  min-height: 1.7rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: right;
}
.participant-agreement{
  max-width: 95%;
  min-height: 1.7rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: green;
  text-align: right;
}
.participant-disagreement{
  max-width: 95%;
  min-height: 1.7rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: red;
  text-align: right;
}
.participant-without-answer{
  max-width: 95%;
  min-height: 1.7rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: gray;
  text-align: right;
}
.participant__name--tool-tip {
  visibility: hidden;

  background-color: rgba(60, 64, 67, 0.8);
  text-align: center;
  border-radius: 5px;
  color: #fff;
  padding: 0.3rem;
  position: absolute;
  z-index: 10000000000000000;
  top: -50%;
  right: 0;
  width: 400px;
  max-height:500px ;
  overflow-wrap: break-word;

}
.guest__list>span{
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;

}
.participant-name{
  position: relative;
  text-align: right;

}
.delete-user{
  color: white;font-size: 1.5rem;cursor: pointer;width: 4.2rem;border-radius: 0.4rem;height: 2.5rem;background-color: red;display: flex;justify-content: center;align-items: center
}

.failed--login--field > span {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  font-weight: bold;
  font-size: 2rem;
  color: white;
  border-radius: 50%;
  background: #ea4335;
  cursor: pointer;
}
.participant-name > span {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  font-weight: bold;
  font-size: 2rem;
  right: 0.3rem;
  color: white;
  border-radius: 50%;
  background: #ea4335;
  cursor: pointer;
}
/*@media (max-width: 680px) {*/
/*  .proceedings-information-list{*/
/*    wi*/
/*  }*/
/*}*/
@media only screen and (max-width: 500px){
  .guest__list{

    height: 3rem;

  }
  .guest__list>span{
    width: 31%;
    font-size: 1rem;

  }


  .phone{
    display: none;
  }
  .email{
    margin-left: 1.5rem;
  }
  .delete-user{
    color: white;font-size: 1.5rem;cursor: pointer;width: 4.2rem;border-radius: 0.4rem;height: 1.8rem
  }
}

</style>
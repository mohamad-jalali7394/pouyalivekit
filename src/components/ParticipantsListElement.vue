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

  <li class="poll-list" v-else>
    <span class="participant-full__name">
      <p>
        {{participantFullName}}
      </p>

    </span>
    <span class="answer-container">
<!--      <teleport to="body">-->
      <!--        <span   class="participant__name&#45;&#45;tool-tip" ref="answer">  {{participantAnswer}}</span>-->
      <!--      </teleport>-->

      <p class="answer" ref="participant-answer"  >
      {{participantAnswer}}
      </p>
    </span>

  </li>
</template>

<script>

export default {
  props:['isGuest','participantName','participantLastname','participantEmail','participantPhoneNumber','participantAnswer','participantFullName'],
  methods:{

    // showAnswerToolTip() {
    //   this.$refs.answer.style.visibility = "visible"
    // },
    // hideAnswerToolTip() {
    //   this.$refs.answer.style.visibility = "hidden"
    // },
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
.poll-list{
  display: flex;
  flex-direction: row;
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
.answer{
  max-width: 95%;
  min-height: 1.7rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  width: 23%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;

}
.participant-name{
  position: relative;

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
@media only screen and (max-width: 680px){
  .guest__list{

    height: 2.5rem;

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
  .answer-container{
display: flex;
    justify-content: center;
    align-items: center;


  }

}

</style>
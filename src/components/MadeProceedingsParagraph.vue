<template>
  <div v-if="paragraphStatus !== 'create'" class="confirm-proceedings-paragraph">
    <div style="display: flex;justify-content: space-between;width: 100%">
      <div style="display: flex;gap: 0.3rem">
        <span style="color: #1B76FF;font-size: 1rem ">بند</span>
        <span style="color: #1B76FF;font-size: 1rem">{{index + 1}}</span>
      </div>
      <div v-if="isEditing" style="font-size: 1rem;color: #9E9EB2;display: flex;gap: 0.3rem;align-items: center">
        <span> {{$store.getters.t('This-paragraph-is-being-edited')}}</span>
        <div class="waiting-for-editing-animation">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

    </div>
    <div  style="min-height: 3rem;width: 100%;display: flex;flex-direction: column">
      <div :style="{width: '100%',height: '2rem',display: 'flex','justify-content': 'space-between','flex-direction': isParagraphExpand ? 'row-reverse' :'row'}">
        <span ref="spann" style="direction: rtl;max-width:30rem;font-size: 1.2rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis; " v-show="!isParagraphExpand">{{paragraphText}}</span>
        <div v-if="paragraphText.length > 48  ">
          <img draggable="false" v-show="!isParagraphExpand" src="/img/chevron_down.svg" alt="not-loaded" style="cursor: pointer" @click="isParagraphExpand = !isParagraphExpand">
          <img draggable="false" v-show="isParagraphExpand" src="/img/chevron_down.svg" alt="not-loaded" style="cursor: pointer;transform: rotate(180deg)" @click="isParagraphExpand = !isParagraphExpand">
        </div>

      </div>
      <div style="width: 100%;height: max-content;direction: rtl;font-size: 1.2rem" v-if="isParagraphExpand">
        {{paragraphText}}
      </div>
    </div>

    <div v-if="assignee.toString().length > 0" style="width: 100%;display: flex;align-items: center;height: 2.4rem;border-top: 0.1rem solid #DCDADA;font-size: 1.2rem;justify-content: space-between">
          <span :style="{ 'max-width': 'calc(100% - 13rem)',
  'white-space': 'nowrap',
  overflow: 'hidden',
  'text-overflow': 'ellipsis',color:assignee.toString().length === 0 ? '#9E9EB2' : '' }">
              {{assignee}}
          </span>
      <span style="font-size: 1rem;color: #9E9EB2">
             شخص مسئول
          </span>

    </div>
  </div>
</template>
<script>
export default {
  name: "MadeProceedingsParagraph",
  props:["index","assignee","paragraphText","isEditing", "paragraphStatus"],
  data(){
    return {
      isParagraphExpand:false,
      paragraphTextWidth:0,
    }
  },
  watch:{
    paragraphText:{
      immediate:true,
      handler(val){
        setTimeout(()=>{
          this.paragraphTextWidth = val.length > 48 ? 300 : 0
        },0)
      }
    },
  }
}
</script>

<style scoped>
.confirm-proceedings-paragraph{
  width: 100%;
  padding: 0.8rem 0.8rem 1.2rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  border-radius: 0.8rem;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  margin-bottom: 0.1rem;
  border: 0.1rem solid #DCDADA;
  background-color: #F2F2F2;
}
.waiting-animation {
  display: inline-block;
  position: relative;
  width: 15px;
  height: 3px;

  animation: infinite alternate;
  z-index: 10;
}
.waiting-for-editing-animation{
  display: inline-block;
  position: relative;
  width: 15px;
  height: 3px;

  animation: infinite alternate;
  z-index: 10;
}
.waiting-for-editing-animation div{
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #9E9EB2;
  z-index: 10;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}




.waiting-for-editing-animation div:nth-child(1) {
  left: 0;
  animation: waiting-animation1 .5s infinite;
}
.waiting-for-editing-animation div:nth-child(2) {
  left: 0;
  animation: waiting-animation2 .5s infinite;
}
.waiting-for-editing-animation div:nth-child(3) {
  left: 4px;
  animation: waiting-animation2 .5s infinite;
}
.waiting-for-editing-animation div:nth-child(4) {
  left: 8px;
  animation: waiting-animation3 .5s infinite;
}




.waiting-animation div {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: black;
  z-index: 10;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.waiting-animation div:nth-child(1) {
  left: 0;
  animation: waiting-animation1 .5s infinite;
}
.waiting-animation div:nth-child(2) {
  left: 0;
  animation: waiting-animation2 .5s infinite;
}
.waiting-animation div:nth-child(3) {
  left: 4px;
  animation: waiting-animation2 .5s infinite;
}
.waiting-animation div:nth-child(4) {
  left: 8px;
  animation: waiting-animation3 .5s infinite;
}

@keyframes waiting-animation1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes waiting-animation3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes waiting-animation2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(4px, 0);
  }
}
@keyframes ripple {
  from {
    opacity: 1;
    transform: scale(0) ;

  }
  to {
    opacity: 0;
    transform: scale(2);
  }
}


@keyframes ripple{
  0%{
    width: 15px;
    height: 15px;
    opacity: 1;
  }
  96%{
    width: 30px;
    height: 30px;
    opacity: 0;
  }
  100%{
    width: 35px;
    height: 35px;
    opacity: 0;
  }
}
</style>

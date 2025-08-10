<template>
  <base-modal :is-blur="true" :open="showChangeLayoutModal">
    <template #modal-header>
      <div class="change-layout-header">
        <span>{{$store.getters.t('change-layout')}}</span>
        <img draggable="false" style="cursor: pointer" src="/img/close.svg" @click="closeChangeLayoutModal">
      </div>
    </template>
    <template #modal-body>
      <div class="change-layout-body-container">
        <div>
          <div style="display: flex;flex-direction: row-reverse;gap: 0.8rem;">
            <label style="cursor: pointer" for="active-speaker">حالت film-strip</label>
            <input style="cursor: pointer"  type="checkbox" id="active-speaker" name="active-speaker"  @input="activeSpeakerLayoutMethod" v-model="activeSpeakerLayout">
          </div>
          <div class="layout-prototype__active-speaker-container">
            <div style="  background-color: #e0e0e0;
  border-radius: 0.2rem;width: 65%;height: 100%"></div>
            <div style="display: flex;flex-direction: column;width:30%;height: 100%;gap: 0.2rem">
              <span class="spannn"></span>
              <span class="spannn"></span>
              <span class="spannn"></span>
            </div>


          </div>
        </div>
    <div>
      <div style="display: flex;flex-direction: row-reverse;gap: 0.8rem">
        <label style="cursor: pointer"  for="flat">حالت flat</label>
        <input style="cursor: pointer"  type="checkbox" id="flat" name="flat"  @input="flatLayoutMethod" v-model="flatLayout">
      </div>
      <div class="layout-prototype-container">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
      </div>
    </template>
    <template #modal-buttons>
    <div class="change-layout-action-container">
      <base-button
          @click="chooseLayout"
          :is-active="true"
          :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=12rem','height=3.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
          :button-inner-txt='$store.getters.t("confirm-layout")'
      ></base-button>
    </div>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from "./UI/BaseModal";
import BaseButton from "./UI/BaseButton";
export default {
  name: "ChangeLayout",
  components:{BaseModal,BaseButton},
  props:["layoutType","showChangeLayoutModal"],
  data(){
    return{
      flatLayout:false,
      activeSpeakerLayout:false
    }
  },
  methods:{
    closeChangeLayoutModal(){
      this.$emit('close-change-layout-modal',false)
    },
    activeSpeakerLayoutMethod(e){
      if (e.target.value){
        this.flatLayout = false
      }
    },
    flatLayoutMethod(e){
      if (e.target.value){
        this.activeSpeakerLayout = false
      }
    },
    chooseLayout(){
      let type = ''
      if (this.activeSpeakerLayout){
        type = 'film-strip'
      }else {
        type = 'flat'
      }
      this.$emit('change-layout',type)
      this.$emit('close-change-layout-modal',false)
    },
  },
  mounted() {
    if (this.$store.getters.layoutType === 'film-strip'){
      this.activeSpeakerLayout = true
      this.flatLayout = false
    }else {
      this.activeSpeakerLayout = false
      this.flatLayout = true
    }
  }
}
</script>

<style scoped>
.change-layout-header{
  width: 30rem;
  height: 5rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
}
.change-layout-body-container{
  width: 30rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  justify-content: center;
}
.change-layout-body-container > div{
  width: 100%;
  height: 8rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.layout-prototype-container{
  width: 8rem;
  height: 6rem;
  border: 0.1rem solid #d5d4d4;
  display: flex;
  padding: 0.2rem 0;
  flex-wrap: wrap;
  gap:  0.2rem;
  border-radius: 0.4rem;
  justify-content: center;
  align-items: center;
}
.layout-prototype-container > span{
  width:30%;
  height: 30%;
  background-color: #e0e0e0;
  border-radius: 0.2rem;
}
.layout-prototype__active-speaker-container {
  width: 8rem;
  height: 6rem;
  border: 0.1rem solid #d5d4d4;
  display: flex;
  flex-direction: row-reverse;
  padding: 0.2rem;
  border-radius: 0.4rem;
  justify-content: space-around;
  align-items: center;
}
.spannn {
  width:100%;
  height: 31%;
  background-color: #e0e0e0;
  border-radius: 0.2rem;
}
.change-layout-action-container{
  width: 30rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
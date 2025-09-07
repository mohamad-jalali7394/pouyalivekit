<template>
<div class="room-contract-card__container" :style="{'background-color' : isActive && !isCreateRoom ? 'transparent' : '#F6F6F7' }">
<div :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">
  <div :style="{flexDirection: $i18n.locale !== 'en' ? 'row' : 'row-reverse'}">
    <span class="contract-type">{{contractType}}</span>
    <img draggable="false" src="/img/contract.svg">
  </div>
  <div class="contract-is-over" v-if="!isActive">
    قرارداد تمام شده
  </div>
</div>
<!--  <div style="width : 100% ;display: flex;flex-direction: row-reverse;gap: 0.8rem" :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">-->
<!--    <span class="contract-label"> {{ $store.getters.t('contract-number') }}</span>-->
<!--    <span class="contract-number">بک اند</span>-->
<!--  </div>-->
  <div class="contract-details" :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">
<!--    <div :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">-->
<!--      <span class="contract-label">{{ $store.getters.t('contract-end-date') }}</span>-->
<!--      <span class="contract-label-detail">'بک اند'</span>-->
<!--    </div>-->
<!--    <div :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">-->
<!--      <span class="contract-label">{{ $store.getters.t('contract-end-date') }}</span>-->
<!--      <span class="contract-label-detail">'بک اند'</span>-->
<!--    </div>-->
<!--    <div :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">-->
<!--      <span class="contract-label">{{ $store.getters.t('number-of-rooms') }}</span>-->
<!--      <span class="contract-label-detail">{{roomsLength}}</span>-->
<!--    </div>-->
<!--    <div :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">-->
<!--      <span class="contract-label">{{ $store.getters.t('capacity-of-each-rooms') }}</span>-->
<!--      <span class="contract-label-detail">{{contractType === 'قرارداد لاین' ? 'بک اند' : '-'}}</span>-->
<!--    </div>-->
<!--    <div :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">-->
<!--      <span class="contract-label">{{ $store.getters.t('room-access-status') }}</span>-->
<!--      <span class="contract-label-detail">'بک اند'</span>-->
<!--    </div>-->

<!--  </div>-->
<!--  <div class="contract-situation" :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">-->
    <div :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">
      <span class="contract-label">{{contractType === $store.getters.t('line-contract') ? $store.getters.t('the-number-of-rooms-created') : $store.getters.t('the-number-of-rooms-created-by-the-organization')}}</span>
      <span class="contract-label-detail">{{ roomsLength }}</span>
    </div>
    <div v-if="contractType === 'قرارداد لاین'" :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">
      <span class="contract-label" >{{ $store.getters.t('capacity-of-remaining-calls') }}</span>
      <span class="contract-label-detail">'بک اند'</span>
    </div>
    <div v-if="contractType === 'قرارداد اتاق خصوصی'" :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">
      <span class="contract-label" >{{ $store.getters.t('the-number-of-assigned-rooms') }}</span>
      <span class="contract-label-detail">بک اند</span>
    </div>
<!--    <div :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">-->
<!--      <span class="contract-label">{{ $store.getters.t('the-remaining-time-of-the-contract') }}</span>-->
<!--      <span class="contract-label-detail">بک اند</span>-->
<!--    </div>-->
  </div>
  <div v-if="isActive && !isCreateRoom" class="contract-action">
    <base-button
        :is-active="true"
        :button-inner-txt= "$store.getters.t('view-the-rooms')"
        :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
        :style-types="['large--button']"
        @click="showRooms"

    >
    </base-button>
  </div>
</div>

</template>

<script>
import BaseButton from "./UI/BaseButton";
export default {
  name: "RoomContractCard",
  components: {BaseButton},
  props:["isCreateRoom","contractType","endDate","startDate","allowedConcurrentLines","remainCapacity","roomsLength",'rooms','concurrentTimeCapacity'],
  data(){
    return {
      isActive:true
    }
  },
  computed:{
    accessCondition(){

      if (this.contractType === 'قرارداد لاین'){
        return 'قابل ویرایش'
      }else if(this.contractType === 'قرارداد وبینار'){
        return 'مشاهده'
      }else if(this.contractType === 'قرارداد دائمی'){
        return 'عدم دسترسی'
      }else{
        return 'مشاهده - واگذاری اتاق'
      }
    },

  },
  methods:{
    showRooms(){
      this.$emit('show-room',this.contractType)
    }
  }

}
</script>

<style scoped>
.room-contract-card__container{
  width: 100%;
  padding: 2.4rem;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  align-items: flex-end;
  border: solid 0.1rem transparent;
  border-radius: 0.8rem;
}
.contract-type {
  font-size: 2.4rem;
  font-weight: 700;
}
.room-contract-card__container > div:first-child {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
}

.room-contract-card__container > div:first-child > div:first-child {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8rem
}
.contract-label{
  font-size: 1.2rem;
  font-weight: 400;
  color: #75758F;
  direction: rtl;
}
.contract-number{
  font-size: 1.4rem;
  font-weight: 700;
}
.contract-details {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  row-gap: 1.6rem;
  column-gap: 2.4rem;
  height: fit-content;
  width: 100%;
  align-items: flex-end;
  padding: 0 0 2.4rem 0;
}
.contract-details > div {
  width: max-content;
  padding: 0 0.2rem;
  display: flex;
  flex-direction: row-reverse;
  gap: 0.8rem;
}
.contract-label-detail{
  font-size: 1.4rem;
  font-weight: 400;
}
.contract-situation{
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  row-gap: 1.6rem;
  column-gap: 2.4rem;
  height: fit-content;
  width: 100%;
  align-items: flex-end;
}
.contract-situation > div{
  width: max-content;
  padding: 0 0.2rem;
  display: flex;
  flex-direction: row-reverse;
  gap: 0.8rem;
}
.contract-action{
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 2.4rem 0 0 0 ;
  border-top:0.1rem solid #DCDADA;
}
.contract-is-over{
  padding: 0.8rem 1.6rem;
  background-color: white;
  border-radius: 0.8rem;
  color:#9E9EB2;
  font-weight: 700;
  font-size: 1.4rem;
}
</style>
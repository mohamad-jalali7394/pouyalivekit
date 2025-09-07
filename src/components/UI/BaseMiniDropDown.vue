<template>
  <ul class="drop-down" :style="dropDownDirection" v-show="open && !isMobile" tabindex="0" ref="mini-drop-down" @blur="closeDropDown">
    <base-mini-drop-down-item
        v-for="item in items"
        :key="item.label"
        :item-label="item.label"
        :has-slot="item.miniDropDownSlot"
        :img-src="item?.imgSrc"
        @select-item="getAndEmitSelectedItem"
    >
      <template v-if="item.miniDropDownSlot" #mini-drop-down-item>
        <base-toggle-button  :toggle-permission="(!isGuest && !isProceedingsStarted) || ( isGuest && (item.miniDropDownSlot !== 'اجازه ایجاد صورتجلسه'  && item.miniDropDownSlot !== 'لغو ایجاد صورتجلسه')) || (item.miniDropDownSlot !== 'اجازه ایجاد صورتجلسه'  && item.miniDropDownSlot !== 'لغو ایجاد صورتجلسه')"  :is-toggled="item.isToggled" :toggle-item="item.miniDropDownSlot" @click.stop @toggle-item="ToggleItem"></base-toggle-button>
      </template>
      <template v-if="item?.imgSrc" #mini-drop-down-icon>
        <img draggable="false" :src="item.imgSrc" alt="not-loaded">
      </template>
    </base-mini-drop-down-item>
  </ul>
  <ul class="drop-down--mobile" v-if="open && isMobile" tabindex="0" ref="mini-drop-down" @blur="closeDropDown">
    <div
        v-if="isMobile"
        style="position: absolute;top: 0.5rem;font-size: 2.5rem;width: 4rem;height: 4rem"
        :style="{left:$i18n.locale !== 'en' ? '1rem': '',right:$i18n.locale !== 'en' ? '': '1rem'}"
        @click="closeDropDown"
    >
      &#10005;
    </div>
    <base-mini-drop-down-item
        v-for="item in items"
        :key="item.label"
        :item-label="item.label"
        @select-item="getAndEmitSelectedItem"
    >
    </base-mini-drop-down-item>
  </ul>
</template>

<script>
import BaseMiniDropDownItem from "./BaseMiniDropDownItem";
import DetectMobile from '../../utils/detectMobile';
import {nextTick} from "vue";
import BaseToggleButton from "@/components/UI/BaseToggleButton.vue";
export default {
  name: "BaseMiniDropDown",
  components: {BaseToggleButton, BaseMiniDropDownItem},
  props : ['open', 'items', 'directionX', 'directionY', 'amIModerator','isGuest','isProceedingsStarted'],
  emits : ['select-item'],
  data(){
    return {
      isMobile:false,
    }
  },
  watch : {
    open(currentVal){
      if(currentVal){
        nextTick(() => {
          this.$refs['mini-drop-down'].focus();
        });
      }
    },
  },
  computed : {
    dropDownDirection(){
      const stylesForDirection = {}
      switch (this.directionY){
        case 'upward' :
          stylesForDirection.top = '-8px';
          switch (this.directionX){
            case 'right' :
              stylesForDirection.right = '0';
              stylesForDirection.transform = 'translate(100%,-100%)';
              break;
            case 'left' :
              stylesForDirection.left = '0';
              stylesForDirection.transform = 'translate(-100%,-100%)';
              break;
            case 'middle' :
              stylesForDirection.left = '50%';
              stylesForDirection.transform = 'translate(-50%,-100%)';
              break;
            case 'proceedings' :
              stylesForDirection.left = '6.8rem';
              stylesForDirection.transform = 'translate(-50%,-100%)';
              break;
            default : return;
          }
          break;
        case 'downward' :
          stylesForDirection.bottom = '0';

          switch (this.directionX){
            case 'middle' :
              stylesForDirection.left = '50%';
              stylesForDirection.transform = 'translate(-50%,110%)';
              break;
            case 'right' :
              stylesForDirection.right = '0';
              stylesForDirection.transform = 'translate(100%, 100%)';
              break;
            case 'left' :
              stylesForDirection.left = '0';
              stylesForDirection.transform = 'translate(-100%, 100%)';
              break;

            default :  return ;
          }
      }
      return stylesForDirection;
    }
  },
  methods : {
    getAndEmitSelectedItem(itemLabel){
      this.$emit('select-item', itemLabel);
    },
    closeDropDown(){
      this.eventBus.emit('close-drop-down');
    },
    ToggleItem(data){
      this.$emit('toggle-item', data)
    }
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  mounted() {
    this.eventBus.on('close-mini',()=>{
      if (this.open === true){
        this.eventBus.emit('close-drop-down');
      }
    })
    if (this.amIModerator) {
      let data = localStorage.getItem(`moderator-substitute`);
      data = JSON.parse(data);
      if (data?.roomId === this.$store?.getters?.roomId) {
          this.$emit('stat', data?.stat)
      }
    }
  }

}
</script>

<style scoped>
.drop-down{
  position :absolute;
  /*left: 0;*/
  z-index: 100;
  outline: none;
  width: fit-content;
  min-width: 13rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.drop-down--mobile{
  position :fixed;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: 100vw;
  height: 50rem;
  outline: none;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 .3rem .6rem 0 rgba(0, 0, 0, 0.16);
}
</style>

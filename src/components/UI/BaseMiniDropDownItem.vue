<template>
  <li v-if="!isMobile" class="item" @click="selectItem" :style="{  cursor: hasSlot ? 'default' : 'pointer','flex-direction': imgSrc ? 'row-reverse' : 'row'}">

    <div  :class=" $i18n.locale === 'fa' ?  'item__label-rtl' :'item__label-ltr'">
      <div style="height: 100%;display: flex;align-items: center"  v-if="$slots['mini-drop-down-icon']">
        <slot name="mini-drop-down-icon" ></slot>
      </div>
      <span> {{ itemLabel }}</span>
     </div>
    <div class="mini-drop-down-item__slot" v-if="$slots['mini-drop-down-item']">
      <slot name="mini-drop-down-item" @click.stop></slot>
    </div>
  </li>
  <li v-else  class="item--mobile" @click="$emit('select-item', itemLabel)">
    <div  :class=" $i18n.locale === 'fa' ?  'item__label-rtl' :'item__label-ltr'">{{ itemLabel }}</div>
  </li>
</template>

<script>
import DetectMobile from "../../utils/detectMobile";

export default {
  name: "BaseMiniDropDownItem",
  props: ['itemLabel','hasSlot','imgSrc'],
  emits: ['select-item'],
  data(){
    return {
      isMobile:false,
    }
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  methods:{
    selectItem(){
      if (this.$slots['mini-drop-down-item']){
        console.log('')
      }else {
        this.$emit('select-item', this.itemLabel)
      }
    }
  }
}
</script>

<style scoped>
.item {
  width: 99%;
  height: 4rem;
  font-size: 1.4rem;
  font-weight: normal;
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 0.8rem 0 1.6rem;
}
.item--mobile{
  height: 6rem;
  cursor: pointer;
  padding: 0 1rem;
  font-size: 1.2rem;
  font-weight: normal;
}

.mini-drop-down-item__slot{
  margin-right: 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  z-index: 10;
}
.item:hover {
  background-color: #f5f4f4;
}

.item:first-child:hover {
  border-top-right-radius: 1rem;
  border-top-left-radius: 1rem;
}
.item:last-child:hover {
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.item:last-child .item__label {
  border: none
}

.item__label-rtl {
  height: 100%;
  white-space: nowrap;
  direction: rtl;
  color: black;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.item__label-ltr {
  height: 100%;
  white-space: nowrap;
  direction: ltr;
  color: black;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
</style>

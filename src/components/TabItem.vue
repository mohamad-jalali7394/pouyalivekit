<template>
  <div class="tabs-item"  :style="{'width':(100/(tabItemsLength)) + '%','min-width':'10.3rem',color:isActive ? '#1B76FF ': '','font-weight':isActive ? '700': '400',cursor: tab.isActive ? 'pointer' : 'not-allowed',opacity:tab.isActive ? '1' : '0.4' }"  @click="chooseTab(tab,index)">
    <span>{{tab.label}}</span>
    <div style="background-color: #2AB459;color: white;padding: 0rem 0.7rem;border-radius: 50%"  v-if="$slots['tab-notification-badge']">
      <slot name="tab-notification-badge"></slot>
    </div>
  </div>

</template>

<script>
export default {
  name: "TabItem",
  props:["tab","isActive","index","tabItems"],
  methods:{
    chooseTab(tab,index){
      if (tab.isActive)
      this.$emit('choose-tab',tab.label,index)
    }
  },
  computed:{
    tabItemsLength(){
      return this.tabItems
    }
  },


}
</script>

<style scoped>
.tabs-item {
  position: relative;
  display: flex;
  height: 4.5rem;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 1.4rem;
  color: #75758F ;
  gap: 0.8rem;
}
</style>

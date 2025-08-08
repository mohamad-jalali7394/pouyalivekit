<template>
  <li ref="list" :class=" isMobile ? 'side-bar-item__isMobile' : 'side-bar-item'" :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
    <div class="side-bar-item-primary-section">
      <div class="side-bar-item-label">
        <bullet-point :color="color"></bullet-point>
        <span :style="{'color':color,'cursor':'pointer' , direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr'}" @click="chooseAndToggleOpenAndCloseItems">{{sidebarItem.label}}</span>
      </div>
      <div v-if="sidebarItem.label !== $store.getters.t('Calendar-of-meetings')" @click="toggleOpenAndCloseItems" style="cursor: pointer;display: flex;justify-content: center;align-items: center">
        <svg v-show="!isItemOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.0283 9.64229L12.125 13.3216L8.22166 9.64229C7.86828 9.30919 7.33298 9.28171 6.94958 9.55966L6.83 9.66102C6.46218 10.0085 6.44568 10.5883 6.79315 10.9562L6.83 10.993V10.993L11.4383 15.3463C11.8237 15.7104 12.4263 15.7104 12.8117 15.3463L17.42 10.993C17.7878 10.6455 17.8043 10.0657 17.4568 9.69787L17.42 9.66102V9.66102L17.401 9.64304C17.0158 9.27923 16.4138 9.27891 16.0283 9.64229Z" :fill="color"/>
        </svg>
        <svg v-show="isItemOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.0283 14.3472L12.125 10.6679L8.22166 14.3472C7.86828 14.6803 7.33298 14.7078 6.94958 14.4298L6.83 14.3285C6.46218 13.981 6.44568 13.4012 6.79315 13.0333L6.83 12.9965L11.4383 8.64319C11.8237 8.27909 12.4263 8.27909 12.8117 8.64319L17.42 12.9965C17.7878 13.344 17.8043 13.9238 17.4568 14.2916L17.401 14.3465C17.0158 14.7103 16.4138 14.7106 16.0283 14.3472Z" :fill="color"/>
        </svg>

      </div>

    </div>
    <transition name="side-bar-item">
      <div class="side-bar-item-details" v-if="isItemOpen && sidebarItem.subItems.length  > 0" :style="{marginLeft: $i18n.locale === 'fa' ? '0' : '18px'}">
        <ul class="side-bar-item-details-ul">
          <li class="side-bar-item-details-element" v-for="subItem of sidebarItem.subItems" :key="subItem" @click="chooseSubItem(subItem.label)" :style="{color:sideBarSubItem === subItem.label ? '#1B76FF' : '' , textAlign: $i18n.locale !== 'en' ? 'right' : 'none'}">{{subItem.label}}</li>
        </ul>
      </div>
    </transition>

  </li>

</template>

<script>
import BulletPoint from "./UI/BulletPoint";
export default {
  name: "SideBarItem",
  components:{BulletPoint},
  props:["sidebarItem","color","isFocused","sideBarSubItem","isMobile"],
  data(){
    return {
      isItemOpen : false,
      whichSubItem: '',
    }
  },
  watch:{
    isItemOpen(val){
      if (val && this.sidebarItem.subItems.length  === 4) {
        this.$refs.list.style.height = '12.5rem'
      }else if (val && this.sidebarItem.subItems.length  === 2) {
        this.$refs.list.style.height = '7.8rem'
      }else if(this.sidebarItem.subItems.length  > 0) {
        this.$refs.list.style.height = '4rem'

      }
    },
  },
  methods:{
    chooseSubItem(item){
      this.$emit('choose-sub-item',item)
    },
    toggleOpenAndCloseItems(){
      this.isItemOpen = !this.isItemOpen
    },
    chooseAndToggleOpenAndCloseItems(){
      this.isItemOpen = !this.isItemOpen
      this.$emit('choose-item',this.sidebarItem.label )
    }
  }
}
</script>

<style scoped>
.side-bar-item__isMobile {
  border-bottom: 0.1rem solid #DCDADA;
  height: 4rem;
  transition: height 0.6s;
  position: relative;
}
.side-bar-item {
  height: 4rem;
  transition: height 0.6s;
  position: relative;
}
.side-bar-item-enter-active,
.side-bar-item-leave-active {
  transition: transform 0.2s ease-in-out;
  opacity: 1;
}
.side-bar-item-enter-from {
  transform: translateY(-25px);

}
.side-bar-item-leave-to {
  transform: translateY(-25px);

}


.side-bar-item-primary-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.side-bar-item-label{
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  max-width: 18rem;
  align-items: center;
  font-size: 1.4rem;
  position: relative;
  z-index: 10;
  background-color: white;
}
.side-bar-item-label > span{
  //direction: rtl;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 17rem;
  font-size: 1.4rem;
}
.side-bar-item-details {
  width: 100%;
  height: fit-content;
  padding:0.5rem 1.5rem 0 0;
  position: relative;
  z-index: 5;
}
.side-bar-item-details-ul {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.8rem;
}
.side-bar-item-details-element{
  font-size: 1.2rem;
  direction: rtl;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 17rem;
  //text-align: right;
  cursor: pointer;
  color: #9E9EB2;
}
</style>

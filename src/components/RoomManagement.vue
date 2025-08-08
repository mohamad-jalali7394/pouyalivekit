<template>
<div class="room-management__container">
  <div class="room-management__header" :style="{flexDirection: $i18n.locale === 'fa' ? 'row-reverse' : 'row'}">
    <h1>{{ $store.getters.t('rooms-management') }}</h1>
  </div>
  <div class="room-management__choose-item" ref="roomTab" :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">
    <div  class="tabs_underline"
         :style="{'translate': $i18n.locale !== 'en' ? '-' + clickedIndex * tabContainerWidth + 'px' + ' ' + '0' : clickedIndex * tabContainerWidth + 'px' + ' ' + '0','width':tabContainerWidth + 'px' }"></div>
    <tab-item v-for="(tab, index) in tabItems" :tab-items="tabItems.length" :tab="tab" :key="tab.label"
              :index="index" :is-active="tab.label === whichTab"
              @choose-tab="chooseTab">

    </tab-item>
  </div>
  <div v-if="whichTab === $store.getters.t('contracts')" style="padding: 1.6rem;display: flex;flex-direction: column;gap: 2.4rem;align-items: flex-end">
    <span style="font-weight: 700;font-size: 1.4rem;width: 100%" :style="{direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr'}">{{$store.getters.t('active-contracts')}}</span>
<room-contract-card v-for="room in allRooms" :key="room.contractType" :contract-type="room.contractType" :rooms="room.rooms" :concurrent-time-capacity="room?.concurrentTimeCapacity" :rooms-length="room.length" @show-room="showRooms"></room-contract-card>
  </div>
  <div v-else>
    <create-room :contract-type="contractType" :all-rooms="allRooms"></create-room>
  </div>
</div>
</template>

<script>
import TabItem from "./TabItem";
import RoomContractCard from "./RoomContractCard";
import CreateRoom from "./CreateRoom";
import momentJalaali from "moment-jalaali";
export default {
  name: "RoomManagement",
  components: {CreateRoom, RoomContractCard, TabItem},
  props:['roomList','webinarList','privateRoomList','lineRoomList'],
  data(){
    return {
      tabItems: [{label: this.$store.getters.t('contracts'), isActive:true}, {label: this.$store.getters.t('rooms'), isActive:true}],
      whichTab: this.$store.getters.t('contracts'),
      clickedIndex:this.$i18n.locale !== 'en' ? 0 : -1 ,
      isMount: false,
      isResizing: false,
      timer: '',
      contractType:'',
    }
  },
  computed: {
    allRooms(){
      const privateRoomsList = this.privateRoomList.map((room) =>{
       const persianDate =  momentJalaali(room.createdAt).format('jYYYY/jM/jD HH:mm')
        return {...room, createdAt: persianDate}
      })
      console.error([{contractType:this.$store.getters.t('virtual-meetings-room'), rooms:this.roomList,length: this.roomList?.length }, {contractType:this.$store.getters.t('webinar-rooms'), rooms:this.webinarList, length: this.webinarList?.length }, {contractType:this.$store.getters.t('private-room-contract'), rooms:privateRoomsList, length: this.privateRoomList?.length }, {contractType:this.$store.getters.t('line-contract'), rooms:this.lineRoomList, length: this.lineRoomList?.length}]
    )
      return [{contractType:this.$store.getters.t('virtual-meetings-room'), rooms:this.roomList,length: this.roomList?.length }, {contractType:this.$store.getters.t('webinar-rooms'), rooms:this.webinarList, length: this.webinarList?.length }, {contractType:this.$store.getters.t('private-room-contract'), rooms:privateRoomsList, length: this.privateRoomList?.length }, {contractType:this.$store.getters.t('line-contract'), rooms:this.lineRoomList, length: this.lineRoomList?.length}]
    },
    tabContainerWidth() {
      if (this.isResizing) {
        console.log('resize')
      }
      if (!this.isMount) {
        return 0
      } else {
            return parseFloat(this.$refs.roomTab.offsetWidth) / 2
      }
    },
  },
  methods:{
    chooseTab(tabName, index) {
      if (this.$i18n.locale !== 'en') {
        this.clickedIndex = index
        this.whichTab = tabName
      } else {
        this.clickedIndex = index - 1
        this.whichTab = tabName
      }
    },
    showRooms(contractType){
      this.contractType = contractType
      if (this.$i18n.locale !== 'en') {
        this.clickedIndex = 1
        this.whichTab = this.$store.getters.t('rooms')
      } else {
        this.clickedIndex = 0
        this.whichTab = this.$store.getters.t('rooms')
      }
    }
  },
  mounted() {
    addEventListener('resize', () => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.isResizing = !this.isResizing
      }, 50)
    })
    setTimeout(() => {
      this.isMount = true
    }, 10)
  }
}
</script>

<style scoped>
.room-management__container{
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
  max-height: calc(100vh - 9rem);
  overflow-y: scroll;
}
.room-management__header {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.6rem 1.6rem;
  border-bottom: 0.1rem solid #DCDADA;
}

.room-management__header > h1 {
  font-size: 2.5rem;
}
.room-management__choose-item{
  position: relative;
  width: 100%;
  height: 4.8rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  -webkit-box-shadow: 0px 5px 8px -7px #000000, 0px 4px 8px 0px rgba(0, 0, 0, 0);
  box-shadow: 0px 5px 8px -7px #000000, 0px 4px 8px 0px rgba(0, 0, 0, 0);
}
.tabs_underline {
  position: absolute;
  bottom: 0;
  border: 0.1rem solid #1B76FF;
  right: 0;
  transition: 0.2s;
}
</style>

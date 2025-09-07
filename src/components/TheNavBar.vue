<template>
  <nav :class=" !isMobile ? 'nav' : 'nav-mobile'">
<!--    <div v-if="-->
<!--        (this.userRole.length > 1 &&-->
<!--          (this.userRole[0] === 'ROLE_ADMIN' ||-->
<!--            this.userRole[0] === 'ROLE_SECRETARY' ||-->
<!--            this.userRole[1] === 'ROLE_ADMIN' ||-->
<!--            this.userRole[1] === 'ROLE_SECRETARY')) && isMobile " style="position:absolute; bottom: 0;width: 100%" :style="{display: 'flex','flex-direction': $i18n.locale !==  'en' ? 'row-reverse' :  'row'}">-->
<!--      <span v-if="userRole.length > 1 || hasPrivateRoomId" @click="changePageView($store.getters.t('calendar'))" class="nav-item-mobile" :style="{'border-bottom' : whichSideBarItem ===  $store.getters.t('calendar') ? 'solid 0.2rem #1a73e8' : '',position:'relative','z-index' : '10'}">{{ $store.getters.t('calendar') }}</span>-->
<!--      <span v-if="(this.userRole.length > 1 && (this.userRole[0] === 'ROLE_ADMIN' || this.userRole[1] === 'ROLE_ADMIN' ))" @click="changePageView($store.getters.t('rooms'))" class="nav-item-mobile" :style="{'border-bottom' : whichSideBarItem ===  $store.getters.t('rooms') ? 'solid 0.2rem #1a73e8' : '',position:'relative','z-index' : '10'}"> {{ $store.getters.t('rooms') }}</span>-->
<!--      <span v-if="(this.userRole.length > 1 && (this.userRole[0] === 'ROLE_ADMIN' || this.userRole[1] === 'ROLE_ADMIN' ))"  @click="changePageView($store.getters.t('sessions'))" class="nav-item-mobile" :style="{'border-bottom' : whichSideBarItem ===  $store.getters.t('sessions') ? 'solid 0.2rem #1a73e8' : '',position:'relative','z-index' : '10'}">{{ $store.getters.t('sessions') }}</span>-->
<!--      <span v-if="(this.userRole.length > 1 && (this.userRole[0] === 'ROLE_ADMIN' || this.userRole[1] === 'ROLE_ADMIN' ))"  @click="createMeeting" class="nav-item-mobile" :style="{'border-bottom' : whichSideBarItem ===  $store.getters.t('create-session') ? 'solid 0.2rem #1a73e8' : '',position:'relative','z-index' : '10'}"> {{ $store.getters.t('create-session') }}</span>-->
<!--      <span v-if="hasPrivateRoomId" @click="openPrivateRoom" class="nav-item-mobile" :style="{'border-bottom' : whichSideBarItem ===  $store.getters.t('immediate-meeting') ? 'solid 0.2rem #1a73e8' : '',position:'relative','z-index' : '10'}"> {{ $store.getters.t('immediate-meeting') }}</span>-->

<!--    </div>-->
    <div class="nav-bar" :style="{flexDirection: $i18n.locale !== 'en' ? 'row-reverse' : 'row'}">
      <div v-if="!isMobile" :style="{flexDirection: $i18n.locale === 'en' ? 'row-reverse' : 'row'}">
        <img draggable="false" v-if="logoAddress ==='/img/logo-calendar.svg'" :src="logoAddress" alt="logo not loaded" >
        <img draggable="false" v-else :src="logoAddress" alt="logo not loaded" style="width: 5rem">
        <a v-if="(logoAddress !=='/img/logo-calendar.svg') && !(this.userRole.length > 1 && ((this.userRole[0] === 'ROLE_ADMIN' || this.userRole[1] === 'ROLE_ADMIN' ) || (this.userRole[0] === 'ROLE_SECRETARY' || this.userRole[1] === 'ROLE_SECRETARY' ) ))" style="font-size: 1rem;text-decoration: none;position: absolute;bottom: 0;right: -4rem;width: 20rem" href="https://www.shooka.ir/" target="_blank">Powered by Shooka</a>
        <a v-else-if="(logoAddress !=='/img/logo-calendar.svg') && (this.userRole.length > 1 && (this.userRole[0] === 'ROLE_ADMIN' || this.userRole[1] === 'ROLE_ADMIN' ))" style="font-size: 1rem;text-decoration: none;position: absolute;bottom: 0;right: 2rem;width: 20rem" href="https://www.shooka.ir/" target="_blank">Powered by Shooka</a>

        <div v-if="(this.userRole.length > 1 && ((this.userRole[0] === 'ROLE_ADMIN' || this.userRole[1] === 'ROLE_ADMIN' ) || (this.userRole[0] === 'ROLE_SECRETARY' || this.userRole[1] === 'ROLE_SECRETARY' ) ))" v-show="!isSidebarOpen" style="width: 4.8rem;height: 4.8rem;display:flex;flex-direction: column;gap: 0.4rem;justify-content: center;align-items: center;background-color: #1B76FF;border-radius: 0.8rem;cursor: pointer" @click="toggleSidebar(true)">
          <span style="color: white;font-size: 2rem;width: 35%;border: solid 0.1rem white"> </span>
          <span style="color: white;font-size: 2rem;width: 35%;border: solid 0.1rem white"> </span>
          <span style="color: white;font-size: 2rem;width: 35%;border: solid 0.1rem white"> </span>
        </div>
        <div v-if="(this.userRole.length > 1 && ((this.userRole[0] === 'ROLE_ADMIN' || this.userRole[1] === 'ROLE_ADMIN' ) || (this.userRole[0] === 'ROLE_SECRETARY' || this.userRole[1] === 'ROLE_SECRETARY' ) ))" v-show="isSidebarOpen" style="width: 4.8rem;height: 4.8rem;display:flex;justify-content: center;align-items: center;background-color: #1B76FF;border-radius: 0.8rem;cursor: pointer" @click="toggleSidebar(false)">
       <img draggable="false" src="/img/doubleArrow.svg">
        </div>
      </div>
      <div v-else class="nav-bar__logo-mobile">





        <div v-if="(this.userRole[0] === 'ROLE_SECRETARY' ||this.userRole[1] === 'ROLE_SECRETARY') || (this.userRole[0] === 'ROLE_ADMIN' ||this.userRole[1] === 'ROLE_ADMIN') || hasPrivateRoomId" style="display: flex;gap: 2rem;flex-direction: row-reverse;position: absolute;bottom: -0.2rem" :style="{right:$i18n.locale !== 'en' ? '' : '0',left:$i18n.locale !== 'en' ? '0' : ''}">
          <div style="color: #1B76FF;font-size: 1.3rem;font-weight: 700;display: flex;gap: 0.4rem;direction: rtl"  @click="createMeeting" v-if="(this.userRole[0] === 'ROLE_SECRETARY' ||this.userRole[1] === 'ROLE_SECRETARY') || (this.userRole[0] === 'ROLE_ADMIN' ||this.userRole[1] === 'ROLE_ADMIN') "
          >

            <span>{{$store.getters.t('create-session-in-calendar')}}</span>

          </div>
          <div style="color: #1B76FF;font-size: 1.3rem;font-weight: 700;display: flex;gap: 0.4rem;direction: rtl"  @click="openPrivateRoom">
            <span>
                {{$store.getters.t('immediate-meeting')}}
              </span>

          </div>
        </div>








        <div  v-show="!isSidebarOpen" style="width: 5.8rem;display:flex;flex-direction: column;gap: 0.4rem;justify-content: center;align-items: flex-end;background-color: transparent;border-radius: 0.8rem;cursor: pointer" @click="toggleMobileSidebar(true)">
          <span style="color: #1B76FF;font-size: 2rem;width: 50%;border: solid 0.2rem #1B76FF"> </span>
          <span style="color: #1B76FF;font-size: 2rem;width: 50%;border: solid 0.2rem #1B76FF"> </span>
          <span style="color: #1B76FF;font-size: 2rem;width: 50%;border: solid 0.2rem #1B76FF"> </span>
        </div>
        <img draggable="false" v-if="logoAddress === '/img/logo-calendar.svg'" :src="logoAddress" alt="logo not loaded" style="width: 10rem">
        <img draggable="false" v-else :src="logoAddress" alt="logo not loaded" style="width: 5rem">
        <a v-if="logoAddress !== '/img/logo-calendar.svg'" style="font-size: 1rem;text-decoration: none;position: absolute;bottom: 0;left: 8rem;width: 20rem" href="https://www.shooka.ir/" target="_blank">Powered by Shooka</a>
<!--        <profile-section :date-range="dateRange"></profile-section>-->
      </div>
      <!-- <div></div>-->
      <div class="nav-bar__date-filters">
                <profile-section :date-range="dateRange" :is-mobile="isMobile"></profile-section>
<!--        <base-button-->
<!--            v-if="!isEntranceButtonActive"-->
<!--            button-inner-txt="ورود به مدیریت"-->
<!--            :continuous-params="['color=black', 'background-color=#F6F6F7']"-->
<!--            :is-active="isEntranceButtonActive"-->
<!--            :style-types="['large&#45;&#45;button']"-->
<!--        ></base-button>-->
<!--        <date-filter v-if="false" :date-info="dateRange.from" type="from"-->
<!--                     @date-modified="getModifiedDate($event, 'from')"></date-filter>-->
<!--        <date-filter v-if="false" :date-info="dateRange.to" type="to"-->
<!--                     @date-modified="getModifiedDate($event, 'to')"></date-filter>-->
<!--        <div v-if="isMobile === false" class="search-input-container">-->
<!--          <div style="position: relative;width: 80%;height: 100%"><img draggable="false"-->
<!--              :class="$i18n.locale === 'fa' ? 'search-calendar-icon' : 'search-calendar-icon-ltr'" src="/img/search.svg"-->
<!--              alt="not loaded"/>-->
<!--            <input @focus="inputFocused" @blur="inputBlurred" @keyup="searchEvents"-->
<!--                   :class="$i18n.locale === 'fa' ? 'search-input-calendar' : 'search-input-calendar-ltr'"-->
<!--                   :placeholder="$store.getters.t('search-in-sessions')" v-model="searchInputValue">-->
<!--            <div v-if="isSearchInputFocused " class="found-events">-->
<!--              <div style="color: red" v-if="!eventFound">-->
<!--                {{ $store.getters.t("no-information-found") }}-->
<!--              </div>-->
<!--              <div v-else style="width: 100%;height: 100%">-->
<!--                <ul class="added-events">-->
<!--                  <li v-for="event in addedEvents" :key="event.id"-->
<!--                      :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" class="added-events-list"-->
<!--                      @mousedown="openFoundEvent(event)">-->
<!--                    <div><span style="margin-left: 0.5rem">{{ $store.getters.t("title") }}</span> <span>{{ event.title }}</span></div>-->
<!--                    <div style="display: flex;flex-direction: row;">-->
<!--                      <span style="margin-left: 0.5rem">{{ $store.getters.t("date") }}</span>-->
<!--                      <span>{{ event.fromSchd.split(' ')[0] }}</span>-->
<!--                      &lt;!&ndash;                    <span v-else>{{event.enDate}}</span>&ndash;&gt;-->
<!--                    </div>-->


<!--                  </li>-->
<!--                </ul>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--        </div>-->
      </div>
<!--      <div v-if="false" class="nav-bar__am-i-moderator">-->
<!--        <label class="am-i-moderator__label">{{ $store.getters.t("moderatorMeetings") }}</label>-->
<!--        <am-i-moderator-button></am-i-moderator-button>-->
<!--      </div>-->
      <!--    <div class="r-section">-->
      <!--      <profile-info></profile-info>-->
      <!--    </div>-->
      <!--    <date-filterers></date-filterers>-->
      <!--    <div class="am-i-moderator">-->
      <!--      <label class="am-i-moderator__label">جلساتی که در آنها مدیر هستم</label>-->
      <!--      <base-toggle-button></base-toggle-button>-->
      <!--    </div>-->
    </div>
  </nav>
</template>

<script>
import ProfileSection from "./ProfileSection";
import momentJalali from "moment-jalaali";
import DetectMobile from "../utils/detectMobile";
import config from "@/config";
export default {
  name: "TheNavBar",
  components: {ProfileSection},
  props: ['dateRange', 'allMeetings', "whichSideBarItem",'userRole','hasPrivateRoomId'],
  emits: ['date-modified'],
  data() {
    return {
      addedEvents: [],
      eventFound: false,
      allEvents: [],
      searchInputValue: '',
      isSearchInputFocused: false,
      isMobile: false,
      isSidebarOpen:false,
      logoAddress:'',
    }
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  methods: {
    toggleSidebar(flag){
      this.isSidebarOpen = !this.isSidebarOpen
      this.$emit('toggle-sidebar',flag)
    },
    toggleMobileSidebar(flag){
      this.isSidebarOpen = !this.isSidebarOpen
      this.$emit('toggle-mobile-sidebar',flag)
    },
    getModifiedDate(date, type) {
      this.$emit('date-modified', date, type);
    },
    openFoundEvent(event) {
      this.searchInputValue = ''
      this.addedEvents = []
      this.eventFound = false
      this.eventBus.emit('open-found-event', event)
    },
    searchEvents() {
      if (this.searchInputValue === '') {
        this.eventFound = false;
      }
      this.addedEvents = this.allEvents.filter((el) => {
        if (((el.title).includes(this.searchInputValue)) && this.searchInputValue.length !== 0) {
          return true
        }
      })
      if (this.addedEvents.length > 0) {
        this.eventFound = true;
      }
    },
    inputFocused() {
      this.isSearchInputFocused = true
    },
    inputBlurred() {
      this.isSearchInputFocused = false

    },
    changePageView(view) {
      this.$emit('change-page-view', view)
    },
    openPrivateRoom(){
      this.$emit('open-private-room')
    },
    createMeeting(){
      this.$emit('create-meeting')
    },
  },
  mounted() {
    this.logoAddress = config.VUE_APP_LOGO_CALENDAR
    this.eventBus.on('close-mobile-side-bar',()=>{
      this.isSidebarOpen = false
    })
    for (const event in this.allMeetings) {
      this.allEvents.push(...this.allMeetings[event].data.map((eventObj) => {
        let obj = {...eventObj}
        obj.enDate = momentJalali(eventObj?.fromSchd?.split(' ')[0], 'jYYYY/jMM/jDD').format('YYYY/MM/DD')
        return obj
      }))
    }
    this.eventBus.on('open-profile-modal',()=>{
      this.isSidebarOpen = false;
    })
  }
}
</script>

<style scoped>
.nav {
  padding: 1.6rem 2.4rem;
  width: 100%;
  height: 8rem;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  border-bottom: 0.1rem solid #DCDADA;
}

.nav-mobile {
  position: relative;
  padding: 0 2rem;
  width: 100%;
  height: 7rem;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  border-bottom: 0.1rem solid transparent;
  -webkit-box-shadow: 0px 5px 12px -5px rgba(0, 0, 0, 0.97);
  box-shadow: 0px 5px 12px -5px rgba(0, 0, 0, 0.97);
}

.nav-item-mobile {
  display: flex;
  justify-content: center;
  width: 9rem;
  color: black;
  font-size: 1.2rem
}

.nav-bar {
  width: 100%;
  height: 100%;
  display: flex;
  //flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
}

.nav-bar > div {
  display: flex;
  gap: 2rem;
  position: relative;

}



.nav-logo-mobile {
  position: relative;
  right: 2.5rem;

}

.nav-bar__logo-mobile {
  height: 100%;
  display: flex;
  width: 100%;
  flex-direction: row-reverse;
  justify-content: space-between;
  position: relative;
}

.nav-bar__logo img {
  height: 100%;
}

.nav-bar__date-filters {
  height: 100%;
  display: flex;
  gap: 1.6rem;
  justify-content: center;
  align-items: center;
  position: relative;

}

.nav-bar__more-actions {
  position: relative;
  font-size: 3rem;
  color: black;
  cursor: pointer;
}

.nav-bar__am-i-moderator {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  /*margin-left: 10rem;*/
}

.am-i-moderator__label {
  margin-right: .8rem;
  overflow: hidden;
  font-size: 1.2rem;
  color: black;
  white-space: nowrap;
}

.search-input-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
}

.found-events {
  position: absolute;
  width: 100%;
  height: auto;
  min-height: 7rem;
  max-height: 22rem;
  border: solid 1px #1a73e8;
  border-top: none;
  top: 4.5rem;
  z-index: 1009;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  background-color: white;
  -webkit-box-shadow: 0px 9px 21px -7px #000000;
  box-shadow: 0px 9px 21px -7px #000000;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
}

.added-events {
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem;
  direction: rtl;
  width: 100%;
  height: 100%;
}

.added-events-list {
  width: 100%;
  height: 5rem;
  border: 0.1rem solid gray;
  margin-bottom: 0.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  padding: 0 0.5rem;
  cursor: pointer;
  font-size: 1.3rem;
}

.search-calendar-icon {
  position: absolute;
  left: 2rem;
  top: 1.5rem;
  width: 2rem;
}

.search-calendar-icon-ltr {
  position: absolute;
  right: 2rem;
  top: 1.5rem;
  width: 2rem;
}

.search-input-calendar {
  width: 100%;
  height: 5rem;
  padding: 1.9rem 3rem 1.8rem 4.5rem;
  border-radius: 3rem;
  border: solid 1px #707070;
  direction: rtl;
  background-color: #fff;
}

.search-input-calendar-ltr {
  width: 100%;
  height: 5rem;
  padding: 1.9rem 4.5rem 1.8rem 3rem;
  border-radius: 3rem;
  border: solid 1px #707070;
  direction: ltr;
  background-color: #fff;
}

.search-input-calendar::placeholder {
  color: gray;
}

.search-input-calendar:focus {
  outline: none;
  border: solid 1px #1a73e8;
  box-shadow: 0px 0px 20px -6px rgba(26, 115, 232, 0.53);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;

}

.search-input-calendar-ltr::placeholder {
  color: gray;
}

.search-input-calendar-ltr:focus {
  outline: none;
  border: solid 1px #1a73e8;
  box-shadow: 0px 0px 20px -6px rgba(26, 115, 232, 0.53);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;

}

.filte_moderator--mobile-rtl {
  width: 100%;
  display: flex;
  justify-content: right;
  align-items: center;
  height: 10rem;
}

.filte_moderator--mobile-ltr {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 10rem;
}

.container {
  /*display: inline-block;*/
  cursor: pointer;
  /*position: relative;*/
  /*top: 46%;*/
  /*right: 70%;*/
}

@media (max-width: 1600px) {
  .search-input-container > div {
    position: relative;
    right: 4rem;
  }
}

@media (max-width: 1300px) {
  .search-input-container > div {
    position: relative;
    right: 6rem;
  }
}

@media (max-width: 1024px) {
  .nav-bar__am-i-moderator {
    display: none;
  }

  .nav-bar {
    width: 100vw;
  }

  .nav-bar__logo {
    width: 10rem;
    justify-content: space-between;
    flex-direction: row;
  }

  .nav-bar__logo img {
    height: 9rem;
    width: 14rem;
    margin-left: -4rem;
  }

}

@media (max-width: 680px) {
  .search-input-container > div {
    position: relative;
    right: 6rem;
  }
}
</style>

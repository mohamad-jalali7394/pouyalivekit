<template>
  <div ref="members" :class="{'invited-members':!isTable,'invited-members--table':isTable}" :style="{'max-height': '13rem','direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
    <base-loading-spinner v-if="invitedMembers?.length === 0" spinner-color="#409EFF"></base-loading-spinner>
    <div
        class="member"
        v-for="member in shownInvitedMembers"
        :key="member.userId"
        :class="{'invited-members__inner':!isTable , 'invited-members__inner--table':isTable}"
        v-else
    >
      <div style="width: 15rem;display: flex;gap: 0.4rem;height: 100%; display: flex;
  justify-content: flex-start;
  align-items: center;" :style="{'flex-direction': $i18n.locale !== 'en' ? 'row' :  'row-reverse'}">
       <div>
         <img draggable="false" v-if="!member.imgURL" v-show="member.userId !== 'showAll'" src="/img/profile.svg" style="width: 32px; height: 32px" alt="not loaded">
         <img draggable="false" v-else v-show="member.userId !== 'showAll'" :src="member.imgURL" style="width: 32px; height: 32px;border-radius: 50%" alt="not loaded">
         <div v-show="member.userId === 'showAll'" src="/img/show-all.svg" style="cursor: pointer;width: 26px;height: 26px;border-radius: 50%;background-color: #C4C4C4;color: white;display: flex;justify-content: center;align-items: center;font-size: 1.6rem" @click="clickToShowAllMembers">+</div>
       </div>
       <span class="member-name" :style="{'direction': $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
      {{member.name}}
    </span>
      </div>
    </div>
  </div>
</template>

<script>
// import RestClient from "@/api/restClient";
// import entityTypes from "@/statics/entityTypes";
import BaseLoadingSpinner from "./UI/BaseLoadingSpinner";
export default {
  name: "InvitedMembers",
  components: { BaseLoadingSpinner },
  props: ["meetingId", "isTable","invitedMembers"],
  data(){
    return {
      showAllMembers:false,
    }
  },

  created() {
    // const restClientInviteMembers = new RestClient(entityTypes.invite);
    // if (this.meetingId) {
    // restClientInviteMembers
    //     .getInvitedUsersPublicRoom(this.meetingId)
    //     .then((data) => {
    //       this.$store.dispatch('setParticipants', data);
    //       this.invitedMembers = data;
    //     });
    // }
  },

  computed: {
    shownInvitedMembers() {
      if (this.invitedMembers.length < 10){
        return this.invitedMembers
      }else if (this.invitedMembers.length >= 10 && !this.showAllMembers){
        return [...this.invitedMembers.slice(0,9) , {name:'مشاهده همه',userId:'showAll'}]
      }else {
        return this.invitedMembers
      }
    },
    maxHeight(){
      if (this.invitedMembers.length < 10){
        return ''
      }else if (this.invitedMembers.length >= 10 && !this.showAllMembers){
        return ''
      }else {
        return '12rem'
      }
    }
    // invitedMembersStringList() {
    //   const invitedMembersAsStrings = [];
    //   if (this.invitedMembers) {
    //     for (const member of this.invitedMembers) {
    //       invitedMembersAsStrings.push(member.name);
    //     }
    //     return invitedMembersAsStrings;
    //   } else {
    //     return invitedMembersAsStrings;
    //   }
    // },
  },
  methods: {
    clickToShowAllMembers(){
      this.showAllMembers = true
    }
  }
};
</script>

<style scoped>
.invited-members {
  height: 6rem;
  text-align: right;

}
.invited-members__inner {
  display: -webkit-box;
  direction: rtl;
  max-width: 35.4rem;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: right;
}
.invited-members--table {
  display: -webkit-box;
  max-width: 100%;
  -webkit-box-orient: vertical;
  text-align: right;
  font-size: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.8rem;
}
.invited-members__inner--table {
  direction: rtl;
  text-align: right;
  font-size: 1.2rem;
}
.member-name{
  max-width: 11rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media(max-width: 980px) {
  .invited-members--table {
    width: 100%;
  }
}
@media(max-width: 480px) {
  .invited-members--table {
    width: 100%;
  }
}
@media(max-width: 380px) {
  .invited-members--table {
    width: 100%;
  }
}

</style>

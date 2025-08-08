
<template>
<div v-if="iseExpired && contractType === 'سرویس ویدیو لاین'" style="width: 100%;height: 5rem;color: red;font-size: 2rem;display: flex;justify-content: center;align-items: center">
  قرارداد لاین شما به اتمام رسیده
</div>
  <div v-for="room in contractRooms" :key="room.id" :class="$i18n.locale !== 'en' ? 'room-info-fragment' : 'room-info-fragment-ltr' ">
<!--    <div :style="{width:'100%',color:iseExpired ? '#A6C4F6' : '#2AB459','font-size':'1.4rem'}">-->
<!--     {{iseExpired ? 'بک اند' : 'بک اند'}}-->
<!--    </div>-->
    <div class="room-info__roomName">
      {{room.name}}
    </div>
    <div v-if="contractType === 'اتاق های خصوصی'">
      <span style="font-size: 1.2rem;color:#75758F ">
        {{ $store.getters.t('room-creation-date') }}
        <span>:</span>
      </span> <span  :style="{color:iseExpired ? '#c9c8c8' : ''}">{{contractType === 'اتاق های خصوصی' ? room.createdAt : ''}}</span>
    </div>
    <div v-if="contractType === 'سرویس ویدیو لاین'">
      <span style="font-size: 1.2rem;color:#75758F ">
       تعداد تصاویر همزمان
        <span>:</span>
      </span> <span  :style="{color:iseExpired ? '#c9c8c8' : ''}">{{room.meetingMaxPublishCount ? room.meetingMaxPublishCount : 'نا محدود' }}</span>
    </div>
<!--    <div>-->
<!--      <span style="font-size: 1.2rem;color:#75758F ">-->
<!--&lt;!&ndash;        {{ $store.getters.t('room-creator') }}&ndash;&gt;-->
<!--&lt;!&ndash;        <span>:</span>&ndash;&gt;-->
<!--      </span> <span  :style="{color:iseExpired ? '#c9c8c8' : ''}"></span>-->
<!--    </div>-->

    <div v-if="contractType === 'اتاق های خصوصی'">
      <span style="font-size: 1.2rem;color:#75758F ">صاحب اتاق<span>:</span></span> <span  :style="{color:iseExpired ? '#c9c8c8' : ''}">
      {{room.ownerName}}
    </span>
    </div>
    <div>
      <span style="font-size: 1.2rem;color:#75758F ">  {{$store.getters.t('room-capacity')}}</span> <span :style="{color:iseExpired ? '#c9c8c8' : ''}">{{ contractType === 'اتاق های خصوصی' ? room?.capacity :   room?.concurrentUserCapacity}}</span>
    </div>
    <div class="room-info__actions" v-if="contractType === 'اتاق های خصوصی' || contractType === 'سرویس ویدیو لاین'">
      <base-button
          v-if="contractType ===  'سرویس ویدیو لاین' && !iseExpired"
          :is-active="!iseExpired"
          button-inner-txt="ویرایش"
          :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
          :style-types="['large--button']"
          @click="editRoom(room)"
      >
        <template #post-button-slot>
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.0163 8C13.8395 8 13.6699 8.07024 13.5449 8.19526C13.4198 8.32029 13.3496 8.48986 13.3496 8.66667V12.6667C13.3496 12.8435 13.2794 13.013 13.1543 13.1381C13.0293 13.2631 12.8598 13.3333 12.6829 13.3333H3.34961C3.1728 13.3333 3.00323 13.2631 2.87821 13.1381C2.75318 13.013 2.68294 12.8435 2.68294 12.6667V3.33333C2.68294 3.15652 2.75318 2.98695 2.87821 2.86193C3.00323 2.7369 3.1728 2.66667 3.34961 2.66667H7.34961C7.52642 2.66667 7.69599 2.59643 7.82101 2.4714C7.94604 2.34638 8.01628 2.17681 8.01628 2C8.01628 1.82319 7.94604 1.65362 7.82101 1.5286C7.69599 1.40357 7.52642 1.33333 7.34961 1.33333H3.34961C2.81918 1.33333 2.31047 1.54405 1.9354 1.91912C1.56032 2.29419 1.34961 2.8029 1.34961 3.33333V12.6667C1.34961 13.1971 1.56032 13.7058 1.9354 14.0809C2.31047 14.456 2.81918 14.6667 3.34961 14.6667H12.6829C13.2134 14.6667 13.7221 14.456 14.0972 14.0809C14.4722 13.7058 14.6829 13.1971 14.6829 12.6667V8.66667C14.6829 8.48986 14.6127 8.32029 14.4877 8.19526C14.3627 8.07024 14.1931 8 14.0163 8ZM4.01628 8.50667V11.3333C4.01628 11.5101 4.08651 11.6797 4.21154 11.8047C4.33656 11.9298 4.50613 12 4.68294 12H7.50961C7.59735 12.0005 7.68432 11.9837 7.76555 11.9505C7.84677 11.9173 7.92065 11.8685 7.98294 11.8067L12.5963 7.18667L14.4896 5.33333C14.5521 5.27136 14.6017 5.19762 14.6355 5.11638C14.6694 5.03515 14.6868 4.94801 14.6868 4.86C14.6868 4.77199 14.6694 4.68485 14.6355 4.60362C14.6017 4.52238 14.5521 4.44864 14.4896 4.38667L11.6629 1.52667C11.601 1.46418 11.5272 1.41458 11.446 1.38074C11.3648 1.34689 11.2776 1.32947 11.1896 1.32947C11.1016 1.32947 11.0145 1.34689 10.9332 1.38074C10.852 1.41458 10.7783 1.46418 10.7163 1.52667L8.83628 3.41333L4.20961 8.03333C4.14782 8.09563 4.09894 8.1695 4.06576 8.25073C4.03259 8.33195 4.01577 8.41893 4.01628 8.50667ZM11.1896 2.94L13.0763 4.82667L12.1296 5.77333L10.2429 3.88667L11.1896 2.94ZM5.34961 8.78L9.30294 4.82667L11.1896 6.71333L7.23628 10.6667H5.34961V8.78Z" fill="#1B76FF"/>
          </svg>

        </template>
      </base-button>

      <base-button
          v-if="contractType === 'سرویس ویدیو لاین' && !iseExpired"
          :is-active="!iseExpired"
          button-inner-txt="حذف"
          :continuous-params="[
          'background-color=#F2F2F2',
          'color=#EC3737',
          ]"
          :style-types="['large--button']"
          @click="deleteRoom(room.id)"
      >
        <template #post-button-slot>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M4.66536 2.66659C4.66536 1.93021 5.26232 1.33325 5.9987 1.33325H9.9987C10.7351 1.33325 11.332 1.93021 11.332 2.66659V3.99992H13.9987C14.3669 3.99992 14.6654 4.2984 14.6654 4.66659C14.6654 5.03477 14.3669 5.33325 13.9987 5.33325H13.2861L12.7079 13.4283C12.658 14.126 12.0775 14.6666 11.378 14.6666H4.61944C3.91992 14.6666 3.33934 14.126 3.2895 13.4283L2.71128 5.33325H1.9987C1.63051 5.33325 1.33203 5.03477 1.33203 4.66659C1.33203 4.2984 1.63051 3.99992 1.9987 3.99992H4.66536V2.66659ZM5.9987 3.99992H9.9987V2.66659H5.9987V3.99992ZM4.61944 13.3333L4.04802 5.33325H11.9494L11.378 13.3333H4.61944ZM6.66536 6.66659C7.03356 6.66659 7.33203 6.96505 7.33203 7.33325V11.3333C7.33203 11.7015 7.03356 11.9999 6.66536 11.9999C6.29718 11.9999 5.9987 11.7015 5.9987 11.3333V7.33325C5.9987 6.96505 6.29718 6.66659 6.66536 6.66659ZM9.9987 7.33325C9.9987 6.96505 9.70023 6.66659 9.33203 6.66659C8.96383 6.66659 8.66536 6.96505 8.66536 7.33325V11.3333C8.66536 11.7015 8.96383 11.9999 9.33203 11.9999C9.70023 11.9999 9.9987 11.7015 9.9987 11.3333V7.33325Z"
                  fill="
#EC3737"/>
          </svg>

        </template>
      </base-button>
      <base-button
          v-if="contractType === 'اتاق های خصوصی'"
          :is-active="true"
          button-inner-txt="واگذاری اتاق"
          :continuous-params="['color=white', 'background-color=#1B76FF','height=3.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem','padding=0 2rem']"
          @click="grantPrivateRoom(room)"
      >
        <template #post-button-slot>
          <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.37301 7.18732C9.79499 6.73415 10.0327 6.13983 10.0397 5.52065C10.0397 4.85231 9.77418 4.21133 9.30158 3.73874C8.82899 3.26615 8.18802 3.00065 7.51967 3.00065C6.85133 3.00065 6.21036 3.26615 5.73777 3.73874C5.26517 4.21133 4.99967 4.85231 4.99967 5.52065C5.00663 6.13983 5.24436 6.73415 5.66634 7.18732C5.07878 7.4799 4.57315 7.91394 4.19495 8.45041C3.81675 8.98688 3.57783 9.60894 3.49967 10.2607C3.48023 10.4375 3.53181 10.6148 3.64308 10.7535C3.75435 10.8923 3.9162 10.9812 4.09301 11.0007C4.26982 11.0201 4.44711 10.9685 4.58589 10.8572C4.72467 10.746 4.81356 10.5841 4.83301 10.4073C4.91256 9.76141 5.22557 9.16689 5.71307 8.73575C6.20056 8.30462 6.82889 8.06664 7.47967 8.06664C8.13046 8.06664 8.75879 8.30462 9.24628 8.73575C9.73378 9.16689 10.0468 9.76141 10.1263 10.4073C10.1449 10.5783 10.2288 10.7354 10.3604 10.846C10.4921 10.9566 10.6614 11.012 10.833 11.0007H10.9063C11.0811 10.9805 11.2408 10.8922 11.3507 10.7548C11.4606 10.6175 11.5118 10.4422 11.493 10.2673C11.4206 9.61904 11.1893 8.99867 10.8194 8.46135C10.4496 7.92402 9.95272 7.48638 9.37301 7.18732ZM7.49967 6.70732C7.26497 6.70732 7.03554 6.63772 6.8404 6.50733C6.64525 6.37694 6.49315 6.1916 6.40334 5.97477C6.31352 5.75793 6.29002 5.51933 6.33581 5.28914C6.3816 5.05895 6.49462 4.84751 6.66057 4.68155C6.82653 4.51559 7.03798 4.40257 7.26817 4.35679C7.49836 4.311 7.73696 4.3345 7.95379 4.42431C8.17063 4.51413 8.35596 4.66623 8.48635 4.86137C8.61674 5.05652 8.68634 5.28595 8.68634 5.52065C8.68634 5.83537 8.56132 6.13721 8.33877 6.35975C8.11623 6.58229 7.8144 6.70732 7.49967 6.70732ZM12.1663 0.333984H2.83301C2.30257 0.333984 1.79387 0.544698 1.41879 0.919771C1.04372 1.29484 0.833008 1.80355 0.833008 2.33398V11.6673C0.833008 12.1978 1.04372 12.7065 1.41879 13.0815C1.79387 13.4566 2.30257 13.6673 2.83301 13.6673H12.1663C12.6968 13.6673 13.2055 13.4566 13.5806 13.0815C13.9556 12.7065 14.1663 12.1978 14.1663 11.6673V2.33398C14.1663 1.80355 13.9556 1.29484 13.5806 0.919771C13.2055 0.544698 12.6968 0.333984 12.1663 0.333984ZM12.833 11.6673C12.833 11.8441 12.7628 12.0137 12.6377 12.1387C12.5127 12.2637 12.3432 12.334 12.1663 12.334H2.83301C2.6562 12.334 2.48663 12.2637 2.3616 12.1387C2.23658 12.0137 2.16634 11.8441 2.16634 11.6673V2.33398C2.16634 2.15717 2.23658 1.9876 2.3616 1.86258C2.48663 1.73756 2.6562 1.66732 2.83301 1.66732H12.1663C12.3432 1.66732 12.5127 1.73756 12.6377 1.86258C12.7628 1.9876 12.833 2.15717 12.833 2.33398V11.6673Z" fill="white"/>
          </svg>
        </template>
      </base-button>
    </div>

  </div>
<!--  <div v-if="!iseExpired" class="room-info-fragment" style="cursor: pointer;display: flex;justify-content: center;align-items: center;border: solid 0.1rem transparent;border-radius: 1rem;-webkit-box-shadow: 0px 0px 12px 0 rgba(0, 0, 0, 0.16);-->
<!--  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);">-->
<!--      <span-->
<!--          class="add-room"-->
<!--          ref="addRoom"-->
<!--          @click="openCreateRoom">-->
<!--          <img draggable="false"-->
<!--              src="/img/add-plus.svg"-->
<!--              alt="not loaded"-->
<!--          />-->
<!--      </span>-->
<!--  </div>-->


</template>

<script>
import BaseButton from "./UI/BaseButton";
export default {
  name: "RoomInfo",
  components:{BaseButton},
  props:["iseExpired","contractType","contractRooms","whichContract"],
  methods:{
    editRoom(room){
      this.$emit('edit-room',room)
    },
    deleteRoom(id){
      console.error(id)
      this.$emit('delete-room',id)
    },
    openCreateRoom(){
      this.$emit('open-create-room')
    },
    grantPrivateRoom(room){
      this.$emit('grant-private-room',room)
    },
  },
  mounted() {
    console.error('rooooooooooooooooooooooooooooooooom')
    console.error(this.contractRooms)
  }
}
</script>

<style scoped>

.room-info-fragment {
  width: 35rem;
  height: max-content;
  min-height: 15rem;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  direction: rtl;
  border: solid 0.1rem transparent;
  border-radius: 1rem;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.16);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.16);
  margin: 0.3rem 0;
}
.room-info__roomName{
  font-weight:700 ;
  font-size:1.6rem ;
  max-width: 100%;white-space: pre-line;overflow-wrap: break-word;
  direction: rtl;
}
.room-info-fragment-ltr{
  width: 24.2%;
  height: 20rem;
  gap: 2rem;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  direction: ltr;
  border: solid 0.1rem transparent;
  border-radius: 1rem;
  -webkit-box-shadow: 0px 0px 12px 0 rgba(0, 0, 0, 0.16);
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
}
.room-info__actions{
  width: 100%;
  height:6rem;
  padding: 1.6rem 0 0 0 ;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.room-info-fragment-ltr > div {
  width: 100%;
  height: 5rem;
  display: flex;
  flex-direction: row;
  font-size: 1.3rem;
}
.delete-action {
  margin: 0 1rem;
  height: 3rem;
  width: 7rem;
  border-radius: 0.5rem;
  border: solid 0.1rem transparent;
  background-color: #e57979;
  color: white;
  cursor: pointer
}

.delete-action:hover {
  background-color: #e75c5c;
}

.edit-action {
  margin: 0 1rem;
  height: 3rem;
  width: 7rem;
  border-radius: 0.5rem;
  border: solid 0.1rem transparent;
  background-color: #7ba4ee;
  color: white;
  cursor: pointer
}
.add-room {
  color: #7b7b7b;
  width: 60%;
  height: 60%;
  display: flex;
  border: solid 0.1rem;
  justify-content: center;
  align-items: center
}
.edit-action:hover {
  background-color: #5b8fee;
}
/*@media (max-width: 1480px) {*/


/*  .room-info-fragment {*/
/*    width: 24.2%;*/
/*    height: 20rem;*/
/*  }*/
/*  .room-info-fragment-ltr {*/
/*    width: 24.2%;*/
/*    height: 20rem;*/
/*  }*/

/*}*/
/*@media (max-width: 1380px) {*/


/*  .room-info-fragment {*/
/*    width: 32.5%;*/
/*    height: 20rem;*/
/*  }*/
/*  .room-info-fragment-ltr {*/
/*    width: 32.5%;*/
/*    height: 20rem;*/
/*  }*/

/*}*/
/*@media (max-width: 1200px) {*/
/*  .room-info-fragment {*/
/*    width: 32.5%;*/
/*    height: 20rem;*/
/*  }*/
/*  .room-info-fragment-ltr {*/
/*    width: 32.5%;*/
/*    height: 20rem;*/
/*  }*/

/*}*/
/*@media (max-width: 1128px) {*/

/*  .room-info-fragment {*/
/*    width: 32.5%;*/
/*    height: 20rem;*/
/*  }*/
/*  .room-info-fragment-ltr {*/
/*    width: 32.5%;*/
/*    height: 20rem;*/
/*  }*/

/*}*/
/*@media (max-width: 1028px) {*/

/*  .room-info-fragment {*/
/*    width:45% ;*/
/*    height: 20rem;*/
/*  }*/
/*  .room-info-fragment-ltr {*/
/*    width:45% ;*/
/*    height: 20rem;*/
/*  }*/

/*}*/
/*@media (max-width: 980px) {*/


/*  .room-info-fragment {*/
/*    width:48.5% ;*/
/*    height: 20rem;*/
/*  }*/
/*  .room-info-fragment-ltr {*/
/*    width:48.5% ;*/
/*    height: 20rem;*/
/*  }*/
/*}*/
/*@media (max-width: 860px) {*/
/*  .room-info-fragment {*/
/*    height: 20rem;*/
/*    width: 80%;*/
/*  }*/
/*  .room-info-fragment-ltr {*/
/*    height: 20rem;*/
/*    width: 80%;*/
/*  }*/
/*}*/
/*@media (max-width: 680px) {*/

/*  .room-info-fragment {*/
/*    height: 20rem;*/
/*    width: 80%;*/
/*  }*/
/*  .room-info-fragment-ltr {*/
/*    height: 20rem;*/
/*    width: 80%;*/
/*  }*/
/*}*/
/*@media (max-width: 480px) {*/
/*  .room-info-fragment {*/
/*    height: 20rem;*/
/*    width:100%;*/
/*  }*/
/*  .room-info-fragment-ltr {*/
/*    height: 20rem;*/
/*    width: 100%;*/
/*  }*/
/*}*/
</style>


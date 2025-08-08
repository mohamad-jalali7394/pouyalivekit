<template>
  <div class="participants-filter__container">
    <div ref="side-bar">
      <input :style="{direction: $i18n.locale === 'fa' ? 'rtl' : 'ltr'}" class="participants-filter__search"  :placeholder="$t('search')" type="text" @input="emitSearchInfo">

      <base-button
          v-if="amIModerator || subModerator"
          :is-active="true"
          :button-inner-txt="$store.getters.t('invite')"
          :continuous-params="[
          'background-color= transparent',
          'color=#1B76FF',
          'border= 0.1rem solid #1B76FF'
          ]"
          :style-types="['small--button']"
          @click="inviteParticipants"

      >
        <template #pre-button-slot>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z" fill="#1B76FF"/>
          </svg>

        </template>
      </base-button>
    </div>
    <div>
      <div style="direction: rtl;font-size: 1.3rem;font-weight: 700;padding: 0 0.2rem 0 0">
        <span>{{  ' ' + numberOfParticipants  }}</span> <span>{{ $store.getters.t('people') }}</span>
          </div>

          <div class="participants-filter__status" v-if="!this.$store.getters.amIGuest">
<!--          <span :style="{width: $i18n.locale === 'fa' ? '4rem' : '7rem'}" class="participant__size">-->
<!--            {{ '(' +  numberOfParticipants + ')'}}-->
<!--          </span>-->
            <span style="font-size: 1.3rem;color: #75758F"> :{{ $store.getters.t('filter') }}</span>
            <base-select :option-values="participantsNumber" v-model="selectedParticipantStatus" down-img-color="#1B76FF" max-height="23rem" :side=" $i18n.locale === 'fa' ? 'select-ltr' : 'select-ltr'" :arrow-direction=" $i18n.locale === 'fa' ? 'arrow-down-icon-ltr' : 'arrow-down-icon-ltr'" :select-side=" $i18n.locale === 'fa' ? 'list-item__label-ltr' : 'list-item__label-ltr'"></base-select>
          </div>
          <div v-else class="participants-filter__status" :style="{'border': '0.1rem solid black', 'border-radius': '1rem','display': 'flex','justify-content': 'center','align-items': 'center','font-size': '1.4rem','flex-direction': $i18n.locale === 'en' ? 'row' : 'row-reverse' }">
          <span>
          {{$t('onlineParticipants')}}
          </span>
          </div>
    </div>
  </div>

</template>

<script>
import BaseSelect from "./UI/BaseSelect";
import BaseButton from "@/components/UI/BaseButton.vue";
// import amIModeratorButton from "@/components/AmIModeratorButton.vue";
export default {
  name: "ParticipantsFilter",
  components: {BaseButton,BaseSelect},
  props:['participantsNumber','amIModerator','subModerator'],
  data(){
    return {
      filtererValues:
          [
            {
              label : this.$t('onlineParticipants'),
              numbers:0
            },
            {
              label : this.$t('offlineParticipants'),
              numbers:0
            },
            {
              label : this.$t('all'),
              numbers:0
            }
          ],

      selectedParticipantStatus : {
        label : this.$t('onlineParticipants'),
        numbers:0
      }
    }
  },
  emits : ['search-info', 'status-filterer-info', 'initial-status-filter'],
  watch : {
    selectedParticipantStatus:{
      deep:true,
      handler(currentVal){
        this.$emit('status-filterer-info', currentVal)
      }

    }
  },
  computed:{
    // amIModeratorButton() {
    //   return amIModeratorButton
    // },
    numberOfParticipants(){
      const idx = this.participantsNumber.findIndex((el)=>{
        return el.label === this.selectedParticipantStatus.label
      })
      return  this.participantsNumber[idx].numbers
    },
    // onlineNumbers(){
    //   return this.participantsNumber[0].numbers
    // },
    // offlineNumbers(){
    //   return this.participantsNumber[1].numbers
    // },
    //
    // allNumbers(){
    //   return this.participantsNumber[2].numbers
    // },

  },

  methods : {
    emitSearchInfo(e){
      this.$emit('search-info', e.target.value, 'search')
    },
    inviteParticipants(){
      this.eventBus.emit('invite-participants')
    }
  },

  created(){
    this.selectedParticipantStatus = this.filtererValues[0]
  },
  mounted(){
    this.$emit('initial-status-filter', this.selectedParticipantStatus)
    this. filtererValues=
        [
          {
            label : this.$t('onlineParticipants'),
            numbers:this.onlineNumbers
          },
          {
            label : this.$t('offlineParticipants'),
            numbers:this.offlineNumbers
          },
          {
            label : this.$t('all'),
            numbers:this.allNumbers
          }
        ]


  }
}
</script>

<style scoped>
.participants-filter__container{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 0 1.4rem;
}
.participants-filter__container > div{
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.1rem;
}

.participants-filter__search{
  position: relative;
  width: 50%;
  height: 3rem;
  outline: none;
  font-size: 1.2rem;
  padding-right: .5rem;
  border : none;
  background-color: #f1f1f1;
  border-radius: 1rem;
  padding: 0 0.5rem;
}
.participants-filter__status{
  position: relative;
  width: 19rem;
  height: 3rem;
  display: flex;
  flex-direction: row-reverse;
  gap: 0.8rem;
  align-items:center;
}
/*.participants-filter__search::placeholder{*/
/*  color: rgba(104, 104, 104, 0.8);*/
/*  position : relative;*/
/*  right: 1rem;*/
/*  text-align: right;*/
/*}*/

.participant__size{
  position: absolute;
  height: 2rem;
  border-radius: 1rem;
  /*border: solid 0.1rem rgb(194, 191, 191);*/
  color: black;
  font-size: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;

  top: 0;
  transform: translate(67%, 25%);
  z-index: 3;
}
</style>

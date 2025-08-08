<template>
<base-modal :open="isOpen" :is-blur="true">
  <template #modal-header>
    <div :style="{direction: $i18n.locale === 'fa' ? 'rtl':'ltr'}" class="header-container--agenda">
      <h1>دستور جلسه</h1>
      <div>
        <close-icon  width="16" height="16" color="#292933" @click-icon="closeAgendaModal" ></close-icon>
      </div>
    </div>
  </template>
  <template #modal-body>
    <div class="body-container--agenda">
      <div class="create-agenda--fragment">
        <div style="width: 100%">
          <label>هدف جلسه</label>
          <input class="purpose-of-meeting-input" style="width: 100%" v-model.trim="purposeOfMeeting">
        </div>
        <div style="display: flex;flex-direction: row;gap: 0.8rem;">
          <input style="cursor: pointer"  name="hasTime" id="hasTime" type="checkbox"  v-model="hasTime">
          <label style="cursor: pointer"  for="hasTime"> زمان ارائه داشته باشد</label>
        </div>
        <div  class="create-agenda--action">
          <add-plus color="#1B76FF" width="16" height="16" @click="createNewAgenda"></add-plus>
          <span style="color: #1B76FF;font-size: 1.3rem;font-weight: 700;cursor: pointer" @click="createNewAgenda">ایجاد مورد دستورجلسه</span>
        </div>


        <agenda-paragraph v-for="(paragraph, index) in paragraphs" :key="paragraph.paragraphId"
                          :paragraph-index="index" :is-proceedings-created="proceedingsCreated"
                          :paragraph="paragraph" @delete-paragraph="deleteParagraph"
                          :meeting-time="meetingTime"
                          :has-time="hasTime"
                          :all-users="allUsers"
                          @complete-paragraph="completeParagraph"
                          @edit-paragraph="editParagraph"></agenda-paragraph>
        <div v-if="paragraphs?.length === 0" style="color: red; width: 100%;text-align: center">هیچ موردی ایجاد نشده است</div>
      </div>
    </div>

  </template>
  <template #modal-buttons>
    <base-button
        v-if="(isMeetingCreated && createOrEditAgenda === 'create')"
        :is-active="true"
        :button-inner-txt="$store.getters.t('create-agenda') "
        :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=14rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
        @btn-clicked="createAgenda"
    ></base-button>
<!--    <base-button-->
<!--        v-if="createOrEditAgenda === 'edit' && hasAgenda"-->
<!--        :is-active="true"-->
<!--        :button-inner-txt="$store.getters.t('edit-agenda')"-->
<!--        :continuous-params="[-->
<!--          'background-color=#1B76FF',-->
<!--          'color=white', 'width=14rem','height=4.8rem',-->
<!--          'font-size=1.4rem', 'font-weight= 700',-->
<!--          'border-radius=0.6rem'-->
<!--          ]"-->
<!--        @btn-clicked="editAgenda"-->
<!--    ></base-button>-->
    <base-button
        v-if="(!isMeetingCreated && createOrEditAgenda === 'create') || createOrEditAgenda === 'edit'"
        :is-active="true"
        button-inner-txt=" ذخیره دستورجلسه"
        :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=14rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
        @btn-clicked="storeAgenda"
    ></base-button>
  </template>
</base-modal>
</template>

<script>
import BaseModal from "@/components/UI/BaseModal.vue";
import AddPlus from "@/components/UI/Icons/AddPlus.vue";
import RestClient from "@/api/restClient";
import entityTypes from "@/statics/entityTypes";

import AgendaParagraph from "@/components/AgendaParagraph.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import CloseIcon from "@/components/UI/Icons/CloseIcon.vue";

export default {
  name: "TheAgenda",
  components:{CloseIcon, BaseButton, AgendaParagraph, AddPlus, BaseModal},
  props:["isOpen","createOrEditAgenda","meetingId","isMeetingCreated"],
  data(){
    return {
      restClient:new RestClient(entityTypes.agenda) ,
      paragraphs: [],
      paragraphText: '',
      assignedParticipant: '',
      timeInMinutes:'',
      creationOrUpdatingMeetingResult: 'creation',
      meetingTime:0,
      agendaId:null,
      hasAgenda:false,
      purposeOfMeeting:'',
      hasTime:false,
      restClientUser: new RestClient("user"),
    }
  },
  watch:{
    hasTime(val){
     this.$store.dispatch('setAgendaHasTime',val)
    }
  },
  methods:{
    closeAgendaModal() {
      this.$emit("close-agenda-modal",this.isMeetingCreated);
    },
    createNewAgenda() {
      if ((this.paragraphs.length > 0 && this.paragraphs[this.paragraphs.length - 1]?.paragraphText.length > 2) || this.paragraphs.length === 0) {
        let id = Math.floor(Math.random() * 1000000)
        this.paragraphs.push({
          paragraphText: this.paragraphText,
          assignedParticipant: this.assignedParticipant,
          timeInMinutes:this.timeInMinutes,
          paragraphId: id,
          isFromServer: false,
          editMode: false,
          isDone:false,


        });
      } else {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "warning",
          bodyText: 'ابتدا مورد ایجاد شده را تکمیل و تایید کرده و سپس مورد جدید را ایجاد کنید',
          time: 5000,
        });
      }

    },
    completeParagraph(paragraph) {
      const foundIndex = this.paragraphs.findIndex((el) => {
        return +el.paragraphId === +paragraph.paragraphId
      })
      if (foundIndex !== -1) {
        this.paragraphs[foundIndex].paragraphText = paragraph.paragraphText
        this.paragraphs[foundIndex].assignedParticipant = paragraph.assignedParticipant
        this.paragraphs[foundIndex].timeInMinutes = paragraph.timeInMinutes
        this.paragraphs[foundIndex].isDone = true
        if (paragraph.editMode) {
          const editedIndex = this.paragraphs.findIndex((paragraphEl) => {
            return paragraphEl.paragraphId === paragraph.paragraphId
          })
          if (editedIndex !== -1) {
            this.paragraphs[editedIndex].editMode = false
          }
        }
      }
    },
    deleteParagraph(data) {
      if (data.paragraphId) {
        const foundIndex = this.paragraphs.findIndex((el) => {
          return +el.paragraphId === +data.paragraphId
        })
        if (foundIndex !== -1) {
          this.paragraphs.splice(foundIndex, 1)
        }
      } else {
        this.paragraphs.pop()
      }
    },
    editParagraph(data) {
      const editedIndex = this.paragraphs.findIndex((paragraph) => {
        return paragraph.paragraphId === data.paragraphId
      })
      if (editedIndex !== -1) {

        this.paragraphs[editedIndex].editMode = true
      }
    },
    createAgenda(){
      const agendas = this.paragraphs.map((paragraph) =>{
        return {
          presenter: paragraph.assignedParticipant,
          timeInMinutes: paragraph.timeInMinutes,
          agenda:paragraph.paragraphText
      }
      })
      console.error(agendas)
      const data = {
        meetingId:this.meetingId,
        createdDate:'1402/10/15 09:40',
        createdBy:"John Doe",
        meetingName:'تست جلالی',
        purposeOfMeeting: this.purposeOfMeeting,
        agendas: agendas,
        hasTiming:this.hasTime
      }
      const editIdx = this.paragraphs.findIndex((paragraph) => {
        return paragraph?.editMode === true
      })
      if (this.paragraphs.length > 0 && this.paragraphs[this.paragraphs.length - 1].paragraphText.length > 0 && editIdx === -1){
        const initialValue = 0
        const sumWithInitial = this.paragraphs.reduce(
            (accumulator, currentValue) => accumulator + parseInt(currentValue.timeInMinutes),
            initialValue,
        );
        if ( +this.meetingTime >= +sumWithInitial){
          this.restClient.createAgenda(data).then(() => {
            this.closeAgendaModal()
          }).catch((error) => {
            console.error(error)
          })
        }else {
          this.eventBus.emit('notification', {
            type: 'error',
            bodyText: this.$store.getters.t('agendaTime-not-bigger-than-meetingTime',{time:this.meetingTime }),
            time: 7000
          })
        }

      }else if (this.paragraphs[this.paragraphs.length - 1].paragraphText.length === 0) {
        this.eventBus.emit('notification', {
          type: 'error',
          bodyText: 'یکی از بندهای ایجاد شده کامل نشده است',
          time: 5000
        })
      }else if(editIdx !== -1){
        this.eventBus.emit('notification', {
          type: 'error',
          bodyText: 'یکی از بندها در حال ویرایش است و کامل نشده است',
          time: 5000
        })
      }

    },
    editAgenda(){
      const agendas = this.paragraphs.map((paragraph) =>{
        return {
          presenter: paragraph.assignedParticipant,
          timeInMinutes: paragraph.timeInMinutes,
          agenda:paragraph.paragraphText,
          id:paragraph.paragraphId
        }
      })
      const data = {
        id:this.agendaId,
        meetingId:this.meetingId,
        createdDate:'1402/10/15 09:40',
        createdBy:"John Doe",
        meetingName:'تست جلالی',
        purposeOfMeeting: this.purposeOfMeeting,
        agendas: agendas,
        hasTiming:this.hasTime,
        allUsers:[],
      }
      const editIdx = this.paragraphs.findIndex((paragraph) => {
        return paragraph?.editMode === true
      })
      if (this.paragraphs.length > 0 && this.paragraphs[this.paragraphs.length - 1].paragraphText.length > 0 && editIdx === -1){
        this.restClient.editAgenda(this.agendaId,data).then(() => {
          this.$emit("close-agenda-modal",false);
        }).catch((error) => {
          console.error(error)
        })
      }else if (this.paragraphs[this.paragraphs.length - 1].paragraphText.length === 0) {
        this.eventBus.emit('notification', {
          type: 'error',
          bodyText: 'یکی از بندهای ایجاد شده کامل نشده است',
          time: 5000
        })
      }else if(editIdx !== -1){
        this.eventBus.emit('notification', {
          type: 'error',
          bodyText: 'یکی از بندها در حال ویرایش است و کامل نشده است',
          time: 5000
        })
      }

    },
    storeAgenda() {
      this.$store.dispatch('setAgendaParagraphs',this.paragraphs)
      this.$store.dispatch('setPurposeOfMeeting',this.purposeOfMeeting)
      this.closeAgendaModal()
    },
    getAgendaByMeetingId(){
      this.restClient.getAgenda(this.meetingId).then((response)=>{
        this.hasTime = response.data.hasTiming
        this.paragraphs = response.data.agendas.map((agenda) => {
          return {
            paragraphText: agenda.agenda,
            assignedParticipant: agenda.presenter,
            timeInMinutes:agenda.timeInMinutes,
            paragraphId: agenda.id,
            isFromServer:true,
            editMode: false,
            isDone:true
          }
        })
        this.$store.dispatch('setAgendaParagraphs',this.paragraphs)
        this.$store.dispatch('setPurposeOfMeeting',response.data.purposeOfMeeting)
        this.eventBus.emit('agenda-id',response.data.id)
        this.purposeOfMeeting = response.data.purposeOfMeeting
        this.agendaId = response.data.id
        this.hasAgenda = true
      })
          .catch((error)=>{
        console.error(error)
      })
    },
    getAllUsers() {
      this.allUsers = [];
      this.restClientUser.getAll()
          .then((users) => {
            this.allUsers = users;
            if (this.createOrEditMeeting === 'edit' && this.editableMeetingId ){
              this.getById(this.editableMeetingId)
            }

          })
          .catch((err) => {
            this.isLoading = false
            console.log(err);
          });
    },
  },
  mounted() {
      this.getAllUsers()
    if (this.$store.getters.meetingEndTime > 0 && this.$store.getters.meetingStartTime > 0){
      this.meetingTime = this.$store.getters.meetingEndTime - this.$store.getters.meetingStartTime
    }
    if (this.$store.getters.agendaParagraphs?.length > 0){
      this.paragraphs = this.$store.getters.agendaParagraphs
    }
    if (this.$store.getters?.purposeOfMeeting){
      this.purposeOfMeeting = this.$store.getters?.purposeOfMeeting
    }
    if (this.createOrEditAgenda !== 'create'){
      this.getAgendaByMeetingId()
    }

  }
}
</script>

<style scoped>

.header-container--agenda{
  width: 80rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  color: #292933;
}
.header-container--agenda >h1{
  font-size: 2.5rem;
}
.body-container--agenda {
  width: 80rem;
  display: flex;
  align-items: flex-start;
  height: 50rem;
  color: #292933;
  overflow-y: auto;
}
.purpose-of-meeting-input{
  width: 100%;
  height: 3.2rem;
  background-color: #F6F6F7;
  border-radius: 0.8rem;
  border: 0.1rem solid transparent;
  padding: 0.8rem;
}
.purpose-of-meeting-input:focus{
  outline: none;
  background-color: transparent;
  border: 0.1rem solid #DCDADA;
}
.create-agenda--fragment {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 0 .4rem;
}
.create-agenda--action {
  width: 100%;
  display: flex;
  gap: 0.6rem;
  align-items: center;
  direction: rtl;
}
@media (max-width: 980px) {
  .header-container--agenda{
    width: 85vw;
  }
  .body-container--agenda{
    width: 85vw;
  }
}
@media (max-width: 580px) {
  .header-container--agenda{
    width:90vw;
  }
  .body-container--agenda{
    width: 90vw;
  }
}

</style>

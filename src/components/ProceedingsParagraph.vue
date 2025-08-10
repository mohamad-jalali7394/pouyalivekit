<template>
  <div style="position:relative;width: 100%">
    <div  v-if="!isProceedingsCreated" style="position: absolute;right: 8rem;;top:1rem;z-index: 10">
      <span>{{ characterCounter }}</span> <span>/</span> <span>255</span>
    </div>
    <div class="proceedings-paragraph__container" :style="{backgroundColor: isParagraphCompleted || isProceedingsCreated ? '#F2F2F2' : ''}">
      <div class="proceedings-paragraph__header">
        <div>
          <span>{{ isParagraphCompleted ? $store.getters.t('clause') : $store.getters.t('number') }}</span>
          <span>{{paragraphIndex + 1}}</span>
        </div>
        <div class="confirm-paragraph" v-if="!isProceedingsCreated" ref="mini-drop-down-in-paragraph">
          <div v-if="!isParagraphCompleted && paragraphText.length > 2 && (assignedParticipantName.length > 2 || assignedParticipant.length > 2 || assignedParticipantName === '' || assignedParticipant === '')">
            <input type="checkbox" name="isParagraphCompleted" :id="paragraph.paragraphId" @input="confirmProceedings" v-model="isParagraphCompleted">
            <label :for="paragraph.paragraphId">{{$store.getters.t("be-done")}}</label>
          </div>
          <close-icon v-if="!isParagraphCompleted && !editMode" width="16" height="16" color="#75758F" @click-icon="closeParagraph" ></close-icon>
          <img draggable="false" v-else-if="!isProceedingsCreated && !editMode" src="/img/more.svg" style="cursor: pointer" alt="not-loaded">
          <base-mini-drop-down
              v-if="isParagraphCompleted"
              :open="dropDownIsOpen.flag"
              direction-y="downward"
              direction-x="right"
              :items="dropDownItems"
              @select-item="getSelectedItem">

          </base-mini-drop-down>
        </div>
      </div>
      <div class="proceedings-paragraph__text">
        <textarea v-if="!isParagraphCompleted && !isProceedingsCreated" type="text" :disabled="isParagraphCompleted" @blur="blurParagraphText"  @focus="focusParagraphText" maxlength="255"    v-model.trim="paragraphText" :placeholder="$store.getters.t('enter-the-text-of-the-paragraph')"></textarea>
        <div v-else style="height: auto;width: 100%;display: flex;flex-direction: column">
          <div :style="{width: '100%',height: '2rem',display: 'flex','justify-content': 'space-between','flex-direction': isParagraphExpand ? 'row' :'row-reverse'}">
            <span ref="spann" style="direction: rtl;max-width:30rem;font-size: 1.2rem; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" v-show="!isParagraphExpand">{{paragraph.paragraphText}}</span>
            <div v-if="paragraph.paragraphText.length > 48 ">
              <img draggable="false" v-show="!isParagraphExpand" src="/img/chevron_down.svg" alt="not-loaded" style="cursor: pointer" @click="isParagraphExpand = !isParagraphExpand">
              <img draggable="false" v-show="isParagraphExpand" src="/img/chevron_down.svg" alt="not-loaded" style="cursor: pointer;transform: rotate(180deg)" @click="isParagraphExpand = !isParagraphExpand">
            </div>

          </div>
          <div style="width: 100%;height: max-content;direction: rtl;font-size: 1.2rem" v-if="isParagraphExpand">
            {{paragraph.paragraphText}}
          </div>
        </div>
      </div>
      <div class="proceedings-paragraph__assign-participant" :style="{ 'justify-content': isAssignedParticipantInputFocused ?  'flex-start' :  'space-between',gap:isAssignedParticipantInputFocused ?  '0.8rem' :  ''}">
        <span v-show="isAssignedParticipantInputFocused" style="color:#1B76FF;font-size: 1.4rem">@</span>
        <input v-if="!isParticipantAssigned && !isProceedingsCreated" type="text" :disabled="isParagraphCompleted"  v-model.trim="assignedParticipant" @blur="blurAssignedParticipant"  @focus="focusAssignedParticipant" @keyup="searchParticipantForAssignment" :placeholder= "$store.getters.t('enter-the-person\'s-name')">
        <div v-else class="proceedings-paragraph__chosen-participant">
          <span> {{assignedParticipantName ?assignedParticipantName : paragraph.assignedParticipant }} </span>
          <close-icon v-if="!isParagraphCompleted && (!isProceedingsCreated) && paragraph.assignedParticipant.length > 2" width="16" height="16" color="#75758F" @click-icon="deleteAssignParticipant" ></close-icon>
        </div>
        <div v-show="!isAssignedParticipantInputFocused" style="color: #9E9EB2;display: flex;height: 100%;align-items: center">
          <span>@</span>
          <span> {{ $store.getters.t('responsible-person') }} </span>
        </div>
      </div>
    </div>
    <ul class="proceedings-paragraph__assign-participant--ul" v-if="foundParticipants.length > 0 && isAssignedParticipantInputFocused">
      <li v-for="participant in  foundParticipants" :key="participant.participantId" @click="chooseParticipantToAssignParagraph(participant)">
        {{participant.displayName}}
      </li>
    </ul>
  </div>
  <base-modal :open="isDeleteParagraphOpen">
    <template #modal-header>
      <div class="delete-paragraph-modal-header">
        <h2>{{paragraphIndex + 1 + ' ' + 'حذف بند'}}</h2>
        <img draggable="false" style="width: 2.4rem;height: 2.4rem;cursor: pointer" src="/img/close.svg" @click="closeDeleteParagraphModal">
      </div>
    </template>
    <template #modal-body>
      <div class="delete-paragraph-modal-body">
        <span> آیا از حذف این بند مطمئن هستید ؟ </span>

      </div>
    </template>
    <template #modal-buttons>
      <div class="delete-paragraph-modal-action">
        <base-button
            :is-active="true"
            button-inner-txt="انصراف"
            :continuous-params="[
          'background-color=#F2F2F2',
          'color=#1B76FF',
          ]"
            :style-types="['large--button']"
            @click="closeDeleteParagraphModal"

        >
        </base-button>
        <base-button
            :is-active="true"
            button-inner-txt="بله حذف شود"
            :continuous-params="[
          'background-color=#EC3737',
          'color=white',
          ]"
            :style-types="['large--button']"
            @click="deleteParagraph">

        </base-button>
      </div>
    </template>
  </base-modal>
</template>

<script>
import BaseMiniDropDown from "@/components/UI/BaseMiniDropDown.vue";
import MiniDropDownHandler from "../utils/mini.drop.down.actions";
import BaseModal from "@/components/UI/BaseModal.vue";
import BaseButton from "@/components/UI/BaseButton.vue";
import CloseIcon from "@/components/UI/Icons/CloseIcon.vue";
export default {
  name: "ProceedingsParagraph",
  components: {CloseIcon, BaseButton, BaseModal, BaseMiniDropDown},
  props:["paragraphIndex","paragraph","isProceedingsCreated","paragraphStatus"],
  data(){
    return {
      paragraphText:'',
      assignedParticipant:'',
      isParagraphInputFocused: false,
      isAssignedParticipantInputFocused: false,
      isParagraphCompleted:false,
      isParticipantAssigned:false,
      foundParticipants:[],
      timer: null,
      assignedParticipantName:'',
      dropDownIsOpen: {flag: false},
      editMode:false,
      isDeleteParagraphOpen:false,
      dropDownItems: [
        {
          label: 'ویرایش', itHasIcon:true,imgSrc:'/img/editt.svg'
        },
        {
          label: 'حذف',itHasIcon:true,imgSrc:'/img/delete.svg'
        },


      ],
      isParagraphExpand:false,
      paragraphTextWidth : 0,
    }
  },
  watch:{
    isParagraphCompleted:{
      immediate :true,
      handler(){
        this.dropDownIsOpen.flag = false;
          setTimeout(()=>{
            this.paragraphTextWidth = this.$refs.spann?.offsetWidth  ? this.$refs.spann?.offsetWidth   : '100%'
          },0)
      }
    },
    paragraph:{
      immediate:true,
      deep:true,
      handler(val){
        if (this.isProceedingsCreated){
          setTimeout(()=>{
            this.paragraphTextWidth = val.paragraphText.length > 48 ? 300 : 0
          },10)

        }
      }
    },
    paragraphStatus:{
      immediate:true,
      handler(val){
        if (val === 'update'){
          setTimeout(()=>{
            this.editMode = true
            this.isParagraphCompleted = false
            if (this.paragraph.assignedParticipant.length < 3){
              this.isParticipantAssigned = false
              this.assignedParticipant = ''
            }
          },1000)
        }
      }
    },
  },
  computed:{
    characterCounter(){
      return this.paragraphText.length
    },
  },
  methods:{
    blurParagraphText(){
      this.eventBus.emit("is-writing-paragraph", false);
      this.isParagraphInputFocused = false
      this.eventBus.emit('is-blured')
    },
    focusParagraphText(){
      this.eventBus.emit('is-focused')

      this.isParagraphInputFocused = true
      this.eventBus.emit("is-writing-paragraph", true);
    },
    blurAssignedParticipant(){
      this.eventBus.emit('is-blured')
      this.eventBus.emit("is-writing-paragraph", false);
      setTimeout(()=>{
        this.isAssignedParticipantInputFocused = false
        if (this.assignedParticipant.length > 2) {
          this.isParticipantAssigned = true
          this.assignedParticipantName = this.assignedParticipant
        }
      },100)
    },
    focusAssignedParticipant(){
      this.eventBus.emit('is-focused')
      this.eventBus.emit("is-writing-paragraph", true);
      this.isAssignedParticipantInputFocused = true
      const inpValue = this.assignedParticipant;
      clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
        this.foundParticipants = this.$store.getters.participants.filter((el) => {
          if ((el.displayName)?.includes(inpValue)) {
            return true
          }
        })
      },100)
    },
    deleteAssignParticipant(){
      this.isParticipantAssigned = false
      this.assignedParticipant = ''
    },
    closeParagraph(){
      this.paragraphText = ''
      this.assignedParticipant = ''
      this.isParagraphInputFocused = false
      this.isAssignedParticipantInputFocused = false
      this.isParagraphCompleted = false
      this.isParticipantAssigned = false
      this.$emit('delete-paragraph',{paragraphId:this.paragraph.paragraphId, paragraphText:this.paragraphText, assignee:this.assignedParticipantName.length > 0 ? this.assignedParticipantName : this.assignedParticipant, status:'delete', createTime: this.paragraph.createTime})
    },
    searchParticipantForAssignment(){
      const inpValue = this.assignedParticipant;
      clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
        this.foundParticipants = this.$store.getters.participants.filter((el) => {
          if ((el.displayName)?.includes(inpValue)) {
            return true
          }
        })
      },100)
    },
    chooseParticipantToAssignParagraph(participant){
      this.isAssignedParticipantInputFocused = false
      this.foundParticipants = []
      this.assignedParticipant = ''
      this.assignedParticipantName = participant.displayName
      this.isParticipantAssigned = true
      this.isParagraphCompleted = false
    },
    getSelectedItem(item){
      this.dropDownIsOpen.flag = false
      const foundAction = this.dropDownItems.find(
          (dropDownItem) => dropDownItem.label === item
      );
      if (foundAction){
        switch (foundAction.label) {
          case 'ویرایش':
            this.editMode = true
            this.isParagraphCompleted = false
            this.$emit('edit-paragraph', {paragraphId:this.paragraph.paragraphId,paragraphIndex:this.paragraphIndex, createTime: this.paragraph.createTime,paragraphText:this.paragraphText, assignee:this.assignedParticipantName.length > 0 ? this.assignedParticipantName : this.assignedParticipant})
            break;
          case 'حذف':
            this.isDeleteParagraphOpen = true
            break;
        }
      }
    },
    confirmProceedings(){
        this.$emit('complete-paragraph',{paragraphId:this.paragraph.paragraphId, paragraphText:this.paragraphText, assignee:this.assignedParticipantName.length > 0 ? this.assignedParticipantName : this.assignedParticipant, status:'done', createTime: this.paragraph.createTime})
        this.editMode = false
    },
    closeDeleteParagraphModal() {
      this.isDeleteParagraphOpen = false
    },

    deleteParagraph() {
      this.isDeleteParagraphOpen = false
      this.$emit('delete-paragraph',{paragraphId:this.paragraph.paragraphId, paragraphText:this.paragraphText, assignee:this.assignedParticipantName.length > 0 ? this.assignedParticipantName : this.assignedParticipant, status:'delete', createTime: this.paragraph.createTime})
    },

  },
  mounted() {
    this.eventBus.on('complete-paragraph-join-to-room',(data)=>{
      this.paragraphText = this.paragraph.paragraphText
      this.assignedParticipant = this.paragraph.assignedParticipant
      this.assignedParticipantName = this.paragraph.assignedParticipant
      if (data.id === this.paragraph.paragraphId){
        if (data.status === 'done'){
          this.isParagraphCompleted = true
          this.isParticipantAssigned = true
        }else if (data.status === 'edit') {
          this.isParagraphCompleted = true
          this.isParticipantAssigned = false
          setTimeout(()=>{
            this.editMode = true
            this.isParagraphCompleted = false
          },10)

        }else {
          this.editMode = false
          this.isParagraphCompleted = true
          setTimeout(()=>{
            this.editMode = false
            this.isParagraphCompleted = false
          },10)
        }

      }
    })
    new MiniDropDownHandler(
        this.$refs["mini-drop-down-in-paragraph"],
        this.dropDownIsOpen
    );
  }
}
</script>
<style scoped>
.proceedings-paragraph__container{
  width: 99%;
  position: relative;
  left: 0.5%;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  border-radius: 0.8rem;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  margin-bottom: 0.1rem;
  border: 0.1rem solid #DCDADA;
}
.proceedings-paragraph__header {
  width: 100%;
  height:2.5rem;
  display: flex;
  justify-content: space-between;
  direction: rtl;
}
.proceedings-paragraph__header > div:last-child {
  position: relative;
}
.proceedings-paragraph__header > div:first-child {
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  font-size:1.2rem;
  font-weight: 400;
  color: #1B76FF;
}
.proceedings-paragraph__text{
  width: 100%;
  min-height: 3rem;
}
.proceedings-paragraph__text > textarea{
  height: 100%;
  width: 100%;
  border: none;
  direction: rtl;
  resize: none;
}
.proceedings-paragraph__text > textarea:focus{
  outline: none;
}
.proceedings-paragraph__text > textarea::placeholder{
  color: #9E9EB2;
}
.proceedings-paragraph__assign-participant{
  width: 100%;
  height:2.6rem;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  position: relative;
  border-top: 0.1rem solid #DCDADA;
}

.proceedings-paragraph__assign-participant > input{
  width: calc(100% - 13rem);
  height: 100%;
  border: none;
  direction: rtl;
}
.proceedings-paragraph__assign-participant > input:focus{
  outline: none;
}
.proceedings-paragraph__assign-participant > input::placeholder{
  color: #9E9EB2;
}
.proceedings-paragraph__assign-participant--ul{
  width: 99%;
  left: 0.5%;
  max-height: 17rem;
  //display: flex;
  //flex-direction: column;
  overflow-y: auto;
  border: 0.1rem solid #DCDADA;
  border-bottom: none;
  border-radius: 0.8rem;
  padding: 0.8rem 1.6rem 1.6rem 1.6rem;
  border-bottom: none;
  position: absolute;
  bottom: 3.5rem;
  z-index: 10;
  background-color: white;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
}
.proceedings-paragraph__assign-participant--ul > li{
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  direction: rtl;
  color: #75758F;
  font-size: 1.4rem;
  cursor: pointer;
}
.proceedings-paragraph__assign-participant--ul > li:hover{
background-color: #F2F2F2 ;
  color: #292933;
}
.confirm-paragraph{
  display: flex;
  gap: 1.6rem;
  align-items: center;
}
.confirm-paragraph > div{
  display: flex;
  gap: 0.4rem;
  align-items: center;
}
.confirm-paragraph  input{
  cursor: pointer;
}
.confirm-paragraph  label{
  cursor: pointer;
}
.proceedings-paragraph__chosen-participant{
  width: calc(100% - 13rem);
  height: 100%;
  display: flex;
  gap: 0.8rem;
  align-items: center;
  direction: rtl;
  font-size: 1.4rem;
}
.proceedings-paragraph__chosen-participant > span{
  max-width: calc(100% - 4rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.delete-paragraph-modal-header {
  width: 40rem;
  height: 5rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.1rem solid #DCDADA;
}

.delete-paragraph-modal-body {
  width: 40rem;
  height: 5rem;
  border-bottom: 0.1rem solid #DCDADA;
  font-size: 1.6rem;
  font-weight: 400;
  justify-content: flex-start;
}

.delete-paragraph-modal-action {
  width: 40rem;
  height: 5rem;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
}
@media (max-width: 630px) {
  .delete-paragraph-modal-header {
    width: 33rem;

  }

  .delete-paragraph-modal-body {
    width: 33rem;

  }

  .delete-paragraph-modal-action {
    width: 33rem;

  }
}
</style>

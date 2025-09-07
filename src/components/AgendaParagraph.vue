<template>
  <div class="agenda-paragraph-container">
    <div class="agenda-counter-paragraph-container" >
      <span>{{ characterCounter }}</span> <span>/</span> <span>255</span>
    </div>
    <div class="agenda-paragraph__fragment" :style="{backgroundColor: isParagraphCompleted || isProceedingsCreated || (!isParagraphInputFocused  && !isAssignedParticipantInputFocused && !isTimeMinuteInputFocused) ? '#F2F2F2' : ''}">
      <div class="agenda-paragraph__header">
        <div>
          <span>{{ isParagraphCompleted ? 'مورد' : 'شماره' }}</span>
          <span>{{paragraphIndex + 1}}</span>
        </div>
        <div class="confirm-paragraph" v-if="!isProceedingsCreated" ref="mini-drop-down-in-paragraph">
          <div v-if="(+this.meetingTime > 0 && (+this.timeInMinutes <= +this.meetingTime) || +this.meetingTime <= 0) &&(!isParagraphCompleted && paragraphText.length > 2 && (assignedParticipantName.length > 2 || assignedParticipant.length > 2 || assignedParticipantName === '' || assignedParticipant === ''))">
            <input type="checkbox" name="isParagraphCompleted" :id="paragraph.paragraphId" @input="confirmParagraph" v-model="isParagraphCompleted">
            <label :for="paragraph.paragraphId">{{'انجام شود'}}</label>
          </div>
          <close-icon v-if="!isParagraphCompleted" width="16" height="16" color="#75758F" @click-icon="closeParagraph" ></close-icon>
          <img draggable="false" v-else-if="!isProceedingsCreated" src="/img/more.svg" style="cursor: pointer" alt="not-loaded">
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
      <div class="agenda-paragraph__text">
        <textarea v-if="!isParagraphCompleted" type="text" :disabled="isParagraphCompleted" @blur="blurParagraphText"  @focus="focusParagraphText" maxlength="255" :style="{backgroundColor: isParagraphCompleted || isProceedingsCreated || (!isParagraphInputFocused  && !isAssignedParticipantInputFocused && !isTimeMinuteInputFocused) ? '#F2F2F2' : ''}"   v-model.trim="paragraphText" placeholder="متن مورد را وارد کنید"></textarea>
        <div v-else style="height: auto;width: 100%;display: flex;flex-direction: column">
          <div :style="{width: '100%',height: '2rem',display: 'flex','justify-content': 'space-between'}">
            <span ref="spann" style="direction: rtl;font-size: 1.2rem;width: 100%">{{paragraphText}}</span>
          </div>
          <div style="width: 100%;height: max-content;direction: rtl;font-size: 1.2rem" v-if="isParagraphExpand">
            {{paragraph.paragraphText}}
          </div>
        </div>
      </div>
      <div class="agenda-paragraph__assign-participant" :style="{ 'justify-content': isAssignedParticipantInputFocused ?  'flex-start' :  'space-between',gap:isAssignedParticipantInputFocused ?  '0.8rem' :  ''}">
        <span v-show="isAssignedParticipantInputFocused" style="color:#1B76FF;font-size: 1.4rem">@</span>
        <input v-if="!isParticipantAssigned" type="text" :disabled="isParagraphCompleted" :style="{width: isAssignedParticipantInputFocused ? '100%': 'calc(100% - 10.8rem)',backgroundColor: isParagraphCompleted || isProceedingsCreated || (!isParagraphInputFocused  && !isAssignedParticipantInputFocused && !isTimeMinuteInputFocused) ? '#F2F2F2' : ''}"   v-model.trim="assignedParticipant" @blur="blurAssignedParticipant"  @focus="focusAssignedParticipant" @input="changeInput" placeholder="نام شخص را وارد کنید">
        <div v-else class="agenda-paragraph__chosen-participant">
          <span> {{assignedParticipantName ?assignedParticipantName : paragraph.assignedParticipant }} </span>
          <close-icon v-if="!isParagraphCompleted" width="16" height="16" color="#75758F" @click-icon="deleteAssignParticipant" ></close-icon>
        </div>
        <div v-show="!isAssignedParticipantInputFocused" style="color: #9E9EB2;display: flex;height: 100%;align-items: center">
          <span style="font-size: 1.2rem"> شخص ارائه دهنده: </span>
        </div>
      </div>
      <div v-show="hasTime" class="agenda-paragraph__assign-participant" :style="{flexDirection:'row',gap:  '1rem' }">
        <label style="color: #9E9EB2;font-size: 1.2rem">زمان ارائه (دقیقه):</label>
        <input v-if="!isParagraphCompleted" type="number"  :disabled="isParagraphCompleted" :style="{backgroundColor: isParagraphCompleted  || (!isParagraphInputFocused  && !isAssignedParticipantInputFocused && !isTimeMinuteInputFocused) ? '#F2F2F2' : '',width: '12rem',color: (+meetingTime > 0)&&(+timeInMinutes > +meetingTime) ? 'red' : ''}"   v-model.trim="timeInMinutes" @blur="blurTimeMinuteInput"  @focus="focusTimeMinuteInput"  placeholder="زمان را وارد کنید">
        <div v-else class="agenda-paragraph__chosen-participant">
          <span> {{timeInMinutes}} </span>
        </div>
      </div>
    </div>
    <ul class="agenda-paragraph__assign-participant--ul" v-if="foundParticipants.length > 0 && isAssignedParticipantInputFocused">
      <li v-for="participant in  foundParticipants" class="agenda-paragraph__assign-participant--li"  :key="participant.participantId" @click="chooseParticipantToAssignParagraph(participant)">
        {{participant.firstName + ' ' + participant.lastName}}
      </li>
    </ul>
    <div style="color: red;font-size: 1.1rem;position: absolute;bottom: -1.7rem;display: flex;flex-direction: row;gap: 0.3rem" v-if=" (+meetingTime > 0) && (+timeInMinutes > +meetingTime)">
     <span> زمان ارائه نباید از زمان کل جلسه بیشتر باشد</span>

       <span>{{'('}}</span>
       <span>زمان جلسه</span>
       <span>{{meetingTime + ' ' + 'دقیقه'}}</span>
       <span>می باشد</span>
       <span>{{')'}}</span>

    </div>
  </div>
</template>



<script>
import CloseIcon from "@/components/UI/Icons/CloseIcon.vue";
import BaseMiniDropDown from "@/components/UI/BaseMiniDropDown.vue";
import MiniDropDownHandler from "@/utils/mini.drop.down.actions";
import {calc} from "caniuse-lite/data/features";

export default {
  name: "AgendaParagraph",
  components: {BaseMiniDropDown, CloseIcon},
  props:["paragraphIndex","paragraph","meetingTime","isEventDetail","hasTime","allUsers"],
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
      timeInMinutes:'',
      isTimeMinuteInputFocused: false,
    }
  },
  watch:{
    timeInMinutes:{
      immediate:true,
      handler(val){
        console.error('tiemeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
        console.error(val)
        console.error(this.meetingTime)
      }
    },
    isParagraphCompleted:{
      immediate :true,
      handler(){
        this.dropDownIsOpen.flag = false;
        setTimeout(()=>{
          this.paragraphTextWidth = this.$refs?.spann?.offsetWidth
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
  },
  computed:{
    calc() {
      return calc
    },
    characterCounter(){
      return this.paragraphText?.length ? this.paragraphText?.length : 0
    },
  },
  methods:{
    confirmParagraph(){
      this.$emit('complete-paragraph',{paragraphId:this.paragraph.paragraphId, paragraphText:this.paragraphText, assignedParticipant:this.assignedParticipant.length > 0 ? this.assignedParticipant : this.assignedParticipant,timeInMinutes:this.timeInMinutes ,editMode:this.editMode,isEditing:false})
      this.editMode = false
    },
    blurParagraphText(){
      this.isParagraphInputFocused = false
    },
    focusParagraphText(){
      this.isParagraphInputFocused = true
    },
    blurAssignedParticipant(){
      setTimeout(()=>{
        this.isAssignedParticipantInputFocused = false
        if (this.assignedParticipant.length > 2) {
          this.isParticipantAssigned = true
          this.assignedParticipantName = this.assignedParticipant
        }
      },100)
    },
    focusAssignedParticipant(){
      this.isAssignedParticipantInputFocused = true
    },
    changeInput(){
      const inpValue = this.assignedParticipant;
      clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
        this.foundParticipants = this.allUsers.filter((el) => {
          if ((el.firstName)?.includes(inpValue)) {
            return true
          }
        })
      },100)
    },
    blurTimeMinuteInput(){
      this.isTimeMinuteInputFocused = false
    },
    focusTimeMinuteInput(){
      this.isTimeMinuteInputFocused = true
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
      this.$emit('delete-paragraph',{paragraphId:this.paragraph.paragraphId, paragraphIndex:this.paragraphIndex})
    },
    // searchParticipantForAssignment(){
    //   const inpValue = this.assignedParticipant;
    //   clearTimeout(this.timer);
    //   this.timer = setTimeout(()=>{
    //     this.foundParticipants = [...this.$store.getters.innerParticipants, ...this.$store.getters.outerParticipants].filter((el) => {
    //       if ((el.participantName)?.includes(inpValue)) {
    //         return true
    //       }
    //     })
    //     console.error(this.foundParticipants)
    //   },100)
    // },
    // chooseParticipantToAssignParagraph(participant){
    //   this.isAssignedParticipantInputFocused = false
    //   this.foundParticipants = []
    //   this.assignedParticipant = ''
    //   this.assignedParticipantName = participant.participantName
    //   this.isParticipantAssigned = true
    //   this.isParagraphCompleted = false
    // },
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
            this.$emit('edit-paragraph', {paragraphId:this.paragraph.paragraphId,paragraphIndex:this.paragraphIndex})
            break;
          case 'حذف':
            this.closeParagraph()
            break;
        }
      }
    },

    chooseParticipantToAssignParagraph(participant){
      console.error('choooooooooooooooooseeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      console.error(participant)
      this.isParticipantAssigned = true
      this.assignedParticipantName = participant.firstName + ' ' + participant.lastName
    },

  },
  mounted() {
    this.assignedParticipant = this.paragraph.assignedParticipant
    this.timeInMinutes = this.paragraph.timeInMinutes
    this.paragraphText = this.paragraph.paragraphText
    this.isParagraphCompleted = this.paragraph.isDone
    new MiniDropDownHandler(
        this.$refs["mini-drop-down-in-paragraph"],
        this.dropDownIsOpen
    );
  }
}
</script>
<style scoped>
.agenda-paragraph-container {
  position:relative;
  width: 100%;

}
.agenda-paragraph__fragment{
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
.agenda-counter-paragraph-container {
  position: absolute;
  right: 8rem;
  top:0.8rem;
  z-index: 10;
  font-size: 1.2rem;
}
.agenda-paragraph__header {
  width: 100%;
  height:2.5rem;
  display: flex;
  justify-content: space-between;
  direction: rtl;
}
.agenda-paragraph__header > div:last-child {
  position: relative;
}
.agenda-paragraph__header > div:first-child {
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  font-size:1.2rem;
  font-weight: 400;
  color: #1B76FF;
}
.agenda-paragraph__text{
  width: 100%;
  min-height: 3rem;
}
.agenda-paragraph__text > textarea{
  height: 100%;
  width: 100%;
  border: none;
  direction: rtl;
  resize: none;
}
.agenda-paragraph__text > textarea:focus{
  outline: none;
}
.agenda-paragraph__text > textarea::placeholder{
  color: #9E9EB2;
}
.agenda-paragraph__assign-participant{
  width: 100%;
  height:2.6rem;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  position: relative;
  border-top: 0.1rem solid #DCDADA;
}

.agenda-paragraph__assign-participant > input{
  height: 100%;
  border: none;
  direction: rtl;
}
.agenda-paragraph__assign-participant > input:focus{
  outline: none;
}
.agenda-paragraph__assign-participant > input::placeholder{
  color: #9E9EB2;
}
.agenda-paragraph__assign-participant--ul{
  width: 99%;
  max-height: 17rem;
  left: 1.5%;
  overflow-y: auto;
  border: 0.1rem solid #DCDADA;
  border-bottom: none;
  border-radius: 0.8rem;
  padding: 0.8rem 1.6rem 1.6rem 1.6rem;
  border-bottom: none;
  position: absolute;
  top: 13rem;
  z-index: 10;
  background-color: white;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
}
.agenda-paragraph__assign-participant--li{
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  direction: rtl;
  color: black;
  font-size: 1.4rem;
  cursor: pointer;
}
.agenda-paragraph__assign-participant--li:hover{
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
.agenda-paragraph__chosen-participant{
  width: calc(100% - 10.8rem);
  height: 100%;
  display: flex;
  gap: 0.8rem;
  align-items: center;
  direction: rtl;
  font-size: 1.4rem;
}
.agenda-paragraph__chosen-participant > span{
  max-width: calc(100% - 4rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>

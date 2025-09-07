<template>
  <div
      :style="{'background-color' :optionsList ? 'rgb(255, 254, 254)' : '#F6F6F7','box-shadow':optionsList ?  '0 1rem 2rem rgba(0, 0, 0, 0.26)':'','border':borderColor ? '0.1rem solid #DA0202' :'',cursor:isDisable ? 'not-allowed' : 'pointer'}"
      :class="side">

    <div
        :tabindex="addLabel? '' : 0 "
        class="selected-option"
        @mouseup="toggleOptionsVisibility"
        ref="selected"
        @keydown=" selectAndMoveAlongOptions"
        @blur="closeOptionsVisibility"
    >
      <div class="selected-option__label" :style="{ 'border-bottom':optionsList ? '0.1rem solid #DCDADA' : ''}">
        <span class="selected-option__icon">
          <svg style="width: 16px; height: 16px" width="16" height="16" viewBox="0 0 16 16" fill="none"
               xmlns="http://www.w3.org/2000/svg">
<path
    d="M4.70696 7.70711L7.29274 10.2929C7.68327 10.6834 8.31643 10.6834 8.70696 10.2929L11.2927 7.70711C11.6833 7.31658 11.6833 6.68342 11.2927 6.29289C11.1052 6.10536 10.8509 6 10.5856 6H5.41406C4.86178 6 4.41406 6.44772 4.41406 7C4.41406 7.26522 4.51942 7.51957 4.70696 7.70711Z"
    :fill=" downImgColor ? '#1B76FF' : 'black'"/>
</svg>

        </span>
        <div style="display: flex;align-items: center;gap: 0.5rem;" :style="{width: isWaitingRoom === 'yes' ? 'calc(100% - 5rem)': 'calc(100% - 2rem)', direction:$i18n.locale === 'fa' ? 'rtl' : 'ltr'}">
          <span v-if="modelValue?.color" style="padding: 0.5rem;border-radius: 50%"
                :style="{'background-color' : modelValue?.color}"></span>
          <span v-show="isGroup ? isFirstTime : true" class="selected-option__text"
                :style="{'color' : textColor || 'black', direction: arrowDirection === 'arrow-down-icon-ltr' ? 'ltr' : 'rtl'}">{{ selectedOptionText }}</span>
        </div>

        <span class="selected-option__icon" v-if="$slots['icon']">
          <slot name="icon"> </slot>
        </span>
      </div>
      <span
          class="selected-option__functional-icon"
          v-if="$slots['functional-icon']"
      >
        <slot name="functional-icon"> </slot>
      </span>
    </div>
    <transition
        enter-active-class="select__options-list--enter"
        leave-active-class="select__options-list--leave"
    >
      <ul
          :class="(isMobile && (isChat)) ?'select__options-list-mobile-chat' :  'select__options-list'"
          v-if="optionsList"
          :style="{ maxHeight:(isMobile && (isChat)) ? '30rem' :   maxHeight, width: selectSide==='list-item__label-lrt' ? '100%' : '100%',left: selectSide==='list-item__label-lrt' ? '0%' : '0%' }"
          tabindex="0"
          ref="ulOptions"
      >
        <li
            v-for="(optionValue,index) in optionValues"
            class="list-item"
            :class="focusedOption(index)"
            :key="optionValue"
            @mousedown="selectOption(optionValue)"
        >
            <span v-if="selectedOptionText === optionValue.label && !optionValue.color && $i18n.locale !== 'en'"
                  :style="{'color': selectedOptionText === optionValue.label ? '#1B76FF' :'black','position': 'absolute','right':  selectSide === 'list-item__label-lrt' ? '' :'0.8rem','left':  selectSide === 'list-item__label-lrt' ? '0.8rem' :'','top': selectSide === 'list-item__label-lrt' ?'35%' : '25%'}">
                        <img draggable="false" src="/img/selected.svg" style="width: 16px; height: 16px" alt="not loaded">
            </span>

          <div :class="optionValue.color ? 'list-item__div-width-color' : 'list-item__div'" :style="{ height: divHeight,  'direction': $i18n.locale === 'fa'? 'rtl' : 'ltr' }">
           <span v-if="optionValue.color" style="padding: 0.5rem;border-radius: 50%"
                 :style="{'background-color' : optionValue.color}">

            </span>
            <span :class="selectSide"
                  :style="{'color': selectedOptionText === optionValue.label ? '#1B76FF' :'black' }">{{
                optionValue.label
              }} </span>
<!--            <span class="numberOfOption" v-if="optionValue.numbers">{{-->
<!--                "(" + optionValue.numbers + ")"-->
<!--              }}</span>-->
            <img draggable="false" v-if="optionValue.isDeletable" src="/img/delete.svg"
                 style="position: absolute;left: 0.8rem;z-index: 20" @mousedown.stop="deleteLabel(optionValue.label)">
          </div>
          <span v-if="selectedOptionText === optionValue.label && !optionValue.color && $i18n.locale === 'en'"
                :style="{'color': selectedOptionText === optionValue.label ? '#1B76FF' :'black','position': 'absolute','left':'0.8rem','top':'25%'}">
                        <img draggable="false" src="/img/selected.svg" style="width: 16px; height: 16px" alt="not loaded">
            </span>
        </li>
        <div v-if="addLabel" :class="side" style="position: relative" @click="togglePlusOptionList"
             @mousedown="plusDivClicked">
          <div
              style="width: 100%;color:#1B76FF;text-align: right;display: flex;flex-direction: row-reverse;gap: 0.3rem;align-items: center;border-top: 0.1rem solid #DCDADA;padding: 0.8rem 0 0 0 ">
            <span style="font-weight: 400;font-size: 1.4rem">+</span>
            <span>{{ $store.getters.t('add-tags') }}</span>
          </div>
          <div v-if="plusOptionList"
               style="width: 100%;display: flex;flex-direction: column;gap: 0.8rem;padding: 0.8rem 0 0 0"
               @click.stop="doNotClosePlusOptionList">
            <div style="width: 100%;display: flex;flex-direction: column;gap: 0.4rem">
              <span style="text-align: right;font-size: 1.2rem;color:#75758F">نام برچسب</span>
              <input class="add-label-input" v-model="labelMeeting">
            </div>
            <div style="width: 100%;display: flex;flex-direction: column;gap: 0.4rem">
              <span style="text-align: right;font-size: 1.2rem;color:#75758F">رنگ برچسب</span>
              <div
                  style="border: 0.1rem solid rgb(128,128,128);width: 100%;height: 3.2rem;border: 0.1rem solid #e6e6e7;display: flex;flex-direction: row-reverse;align-items: center;justify-content: space-around;border-radius: 0.8rem">
                <span v-for="color in colors" :key="color" style="padding: 0.5rem;border-radius: 50%;cursor: pointer"
                      :style="{'background-color':color,'border' : colorMeeting === color ? '0.1rem solid black' : '','box-shadow' : colorMeeting === color ? '0px 0px 3px 2px rgba(0,0,0,0.58)' : ''}"
                      @click="this.colorMeeting = color"></span>
              </div>
              <div
                  style="width: 100%;display: flex;flex-direction: row-reverse;align-items: center;justify-content: space-between;padding: 0.4rem 0">
                <div >
                  <base-button
                      button-inner-txt="انصراف"
                      :continuous-params="['color=#1B76FF', 'background-color=#F6F6F7','width=5.8rem','height=3.2rem',
          'font-size=1.2rem', 'font-weight= 700',
          'border-radius=0.6rem']"
                      :is-active="true"
                      @click="this.plusOptionList = false"
                  ></base-button>
                </div>
                <div >
                  <base-button
                      button-inner-txt="ایجاد برچسب"
                      :continuous-params="['color=#F6F6F7', 'background-color=#1B76FF','width=8.6rem','height=3.2rem',
          'font-size=1.2rem', 'font-weight= 700',
          'border-radius=0.6rem']"
                      :is-active="true"
                      @click="createLabel"
                  ></base-button>
                </div>

              </div>
            </div>
            <div></div>
          </div>
        </div>
      </ul>
    </transition>

  </div>
</template>

<script>
import BaseButton from "./BaseButton";

export default {
  name: "BaseSelect",
  components: {BaseButton},
  props: [
    "optionValues",
    "modelValue",
    "maxHeight",
    "side",
    "arrowDirection",
    "selectSide",
    "isDropDownOpen",
    "divHeight",
    "isWaitingRoom",
    'isGroup',
    "isChat",
    "isMobile",
    "textColor",
    "backgroundColor",
    "meetingLabel",
    "addLabel",
    "colors",
    "downImgColor",
    "borderColor",
      "isDisable"
  ],
  emits: ["update:modelValue"],
  data() {
    return {
      selectedOption: this.modelValue,
      selectedIndex: 0,
      optionsList: false,
      isEnable: true,
      focusedIndex: -1,
      scroll: 0,
      isFirstTime: false,
      plusOptionList: false,
      isAddActionClicked: false,
      labelMeeting: '',
      colorMeeting: '',
    };
  },
  watch: {
    isDropDownOpen(value) {
      this.optionsList = value;
      if (!value) {
        this.plusOptionList = value
      }

    },
    modelValue(currentVal) {
      this.selectOption(currentVal);
    },
    optionsList(currentVal) {
      if (!currentVal) {
        if (!this.optionsList) {
          this.$refs.selected.blur();
        }
      } else {
        this.$refs.selected.focus()
      }
    },
  },
  computed: {
    selectedOptionText() {
      if (this.selectedOption) {
        return this.selectedOption.label;
      } else {
        return "";
      }
    },
  },
  methods: {
    deleteLabel(label) {
      this.eventBus.emit('delete-label', label)

    },
    createLabel() {
      if (this.colorMeeting && this.labelMeeting && this.labelMeeting.length > 2 && this.labelMeeting.length < 20) {
        this.eventBus.emit('create-label', {label: this.labelMeeting, color: this.colorMeeting, isDeletable: true})
        this.labelMeeting = ''
        this.colorMeeting = ''
      }
    },
    togglePlusOptionList() {
      this.labelMeeting = ''
      this.colorMeeting = ''
      this.plusOptionList = !this.plusOptionList
    },
    doNotClosePlusOptionList() {
      this.isAddActionClicked = true
    },
    plusDivClicked() {
      this.isAddActionClicked = true
    },
    blurPlusDivClicked() {
      this.isAddActionClicked = false
    },
    selectAndMoveAlongOptions(e) {
      if (this.isWaitingRoom === 'yes') {
        if (e.key === "ArrowDown") {
          if (this.focusedIndex < this.optionValues.length - 1) {
            this.$refs.ulOptions.scrollTo(0, this.scroll)
            this.focusedIndex++;
            this.scroll += 52
          }
        } else if (e.key === "ArrowUp") {
          if (this.focusedIndex >= 0) {
            this.focusedIndex--;
            this.$refs.ulOptions.scrollTo(0, this.scroll - 104)
            this.scroll -= 52
          }
        } else if (e.key === "Enter") {
          this.selectOption(this.optionValues[this.focusedIndex])
          this.focusedIndex = -1
          this.optionsList = false
          this.plusOptionList = false
          this.labelMeeting = ''
          this.colorMeeting = ''
          this.scroll = -52
        }
      } else {
        return
      }

    },
    focusedOption(index) {
      if (index === this.focusedIndex) {
        return "focused";
      }
      return "";
    },
    selectOption(opt) {
      if (typeof opt === "object") {
        this.selectedIndex = this.optionValues.findIndex(
            (option) => option.label === opt.label
        );
        if (this.selectedIndex !== -1) {
          this.isFirstTime = true
          if (this.isGroup) {
            this.eventBus.emit('base-select-value', opt)
          }
          this.selectedOption = opt;
        } else {
          this.selectedIndex = 0;
          this.selectedOption = this.optionValues[0];
        }
        this.$emit("update:modelValue", opt);
      }
      if (this.addLabel) {
        setTimeout(() => {
          this.optionsList = false;
        }, 0)

      }
      this.$emit('change-index', this.selectedIndex)
    },
    toggleOptionsVisibility() {
      if (!this.isDisable){
        this.optionsList = !this.optionsList;
        this.plusOptionList = false
        this.labelMeeting = ''
        this.colorMeeting = ''
      }


    },
    closeOptionsVisibility() {
      this.optionsList = false;
      this.plusOptionList = false
      this.focusedIndex = -1
      this.labelMeeting = ''
      this.colorMeeting = ''

    },
  },
  mounted() {
    if (this.isGroup) {
      this.eventBus.emit('set-max-height')
    }
    this.selectOption(this.modelValue);
  },
};
</script>

<style scoped>

.select-ltr {
  direction: ltr;
  position: relative;
  width: 100%;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0.8rem 1.4rem;
  border-radius: 0.8rem;
  background-color: white;
}

.select-rtl {
  direction: rtl;
  position: relative;
  width: 100%;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0.8rem 1.4rem;
  border-radius: 0.8rem;
  background-color: #F6F6F7;
}

.select__options-list {
  z-index: 4;
  position: absolute;
  background-color: rgb(255, 254, 254);
  width: 100%;
  top: 3rem;
  left: 0;
  max-height: 10rem;
  overflow-y: auto;
  border-radius: 1rem;
  -moz-border-radius-topright: 0;
  -moz-border-radius-topleft: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  list-style: none;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.26);
  backface-visibility: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.select__options-list-mobile-chat {
  z-index: 4;
  position: absolute;
  background-color: rgb(255, 254, 254);
  width: 100%;
  bottom: 100%;
  left: 0;
  max-height: 10rem;
  overflow-y: auto;
  border-radius: 1rem;
  list-style: none;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.26);
  backface-visibility: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.select__options-list::-webkit-scrollbar {
  width: 0.6rem;
  height: 100%;
  background-color: transparent;
}

.select__options-list::-webkit-scrollbar-thumb {
  width: 100%;
  border-radius: 20rem;
  background-color: #7A7A7A;
}

.select__options-list li:last-child hr {
  border-top: 0.1rem solid transparent;
}


.select__options-list-mobile-chat::-webkit-scrollbar {
  width: 0.6rem;
  height: 100%;
  background-color: transparent;
}

.select__options-list-mobile-chat::-webkit-scrollbar-thumb {
  width: 100%;
  border-radius: 20rem;
  background-color: rgb(170, 168, 168);
}

.select__options-list-mobile-chat li:last-child hr {
  border-top: 0.1rem solid transparent;
}


.horizontal-line {
  width: 80%;
  margin-top: 0.5rem;

  border: 0.0001rem solid #c9c5c5;
}

.select__options-list li:first-child {
  border-radius: 1rem 1rem 0 0;
}

.select__options-list li:last-child .horizontal-line {
  border-radius: 0 0 1rem 1rem;
  border: 0.1rem solid transparent;
}

.select__options-list li:hover {
  background-color: #ece7e7;
  color: black;
  cursor: pointer;
}


.select__options-list-mobile-chat li:first-child {
  border-radius: 1rem 1rem 0 0;
}

.select__options-list-mobile-chat li:last-child .horizontal-line {
  border-radius: 0 0 1rem 1rem;
  border: 0.1rem solid transparent;
}

.select__options-list-mobile-chat li:hover {
  background-color: #ece7e7;
  color: black;
  cursor: pointer;
}


.selected-option {
  backface-visibility: hidden;
  position: relative;
  height: 100%;
  outline: none;
  z-index: 2;
  align-items: center;
}

.selected-option__label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  padding: 0 0 0.3rem 0;
}

.selected-option__icon {
  width: 2rem;
  display: flex;
  align-items: center;
}

.selected-option__functional-icon {
  width: 3rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: -2.5rem;
}

.arrow-down-icon-rtl {
  transform: rotateZ(-90deg);
  font-size: 0.8rem;
  right: 0;
}

.selected-option__text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: calc(100% - 1.7rem);
}

.list-item {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem 0;
}
.list-item__div-width-color{
  width: calc(100% - 4rem);
  display: flex;
  gap: 0.8rem;
  align-items: center;
  height: fit-content;
  padding: 0.4rem 0.4rem;
}
.list-item__div{
  width: calc(100% - 4rem);
  display: flex;
  align-items: center;
  height: fit-content;
  padding: 0.4rem 0.8rem;
}
.list-item:last-child div {
  border-bottom: 0.1rem solid transparent;
}

.list-item__label-rtl {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1.1rem;
}

.list-item__label-lrt {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 2.6rem;

}

.list-item--selected {
  background-color: #1a73e8;
  color: white;
}

.select__options-list--enter {
  animation: list-animation 0.1s ease-out forwards;
}

.select__options-list--leave {
  animation: list-animation 0.1s ease-in reverse forwards;
}

.numberOfOption {
  margin-right: 2.4rem;
}

.focused {
  color: #00A9FF;
}

.add-label-input {
  width: 100%;
  height: 3rem;
  border: 0.1rem solid #e6e6e7;
  direction: rtl;
  padding: 0 0.5rem 0 0;
  font-size: 1.2rem;
  border-radius: 0.8rem;
}

.add-label-input:focus {
  outline: none;
}

@keyframes list-animation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

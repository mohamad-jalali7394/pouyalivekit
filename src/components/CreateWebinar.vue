<template>
  <div class="create-webinar__container">
    <div class="create-webinar-header">
      <div style="width: fit-content">
        <input ref="title-input" v-model="meetingTitle"
               :style="{'border':isCreateMeetingClicked && !meetingTitle ? '0.1rem solid #DA0202' : 'none'}"
               class="create-webinar__title" :placeholder="$store.getters.t('enter-webinar-title')">
        <span v-if="isCreateMeetingClicked && !meetingTitle">
          <img draggable="false" src="/img/Vector.svg">
        </span>
      </div>
      <div style="display: flex;gap: 1.2rem;align-items: center">

        <base-button
            :is-active="true"
            :button-inner-txt="'انصراف'"
            :continuous-params="['color=#1B76FF', 'background-color=#F6F6F7','width=10.7rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem']"

            @click="closeCreateMeeting"
        ></base-button>


        <base-button
            v-if="createOrEditMeeting !== 'edit'"
            :is-active="true"
            button-inner-txt="ذخیره وبینار"
            :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=16.1rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
            @click="storeMeeting"
        ></base-button>

        <base-button
            v-else
            :is-active="true"
            button-inner-txt="ویرایش وبینار"
            :continuous-params="[
          'background-color=#1B76FF',
          'color=white', 'width=16.1rem','height=4.8rem',
          'font-size=1.4rem', 'font-weight= 700',
          'border-radius=0.6rem'
          ]"
            @click="updateMeeting"
        ></base-button>
      </div>
    </div>
    <div class="separate-info "></div>
    <div class="create-webinar-set-time">
      <div class="create-webinar-set-time-items">
      <span style="color: #75758F;display: flex;align-items: center">
        <span v-if="isCreateMeetingClicked && !startTime">
          <img draggable="false" src="/img/Vector.svg">
        </span>
        <span>زمان شروع وبینار</span>
      </span>
        <div style="width: 24.7rem;position: relative">
          <svg @click="showStartDatePicker = true"
               style="cursor: pointer;width: 16px;height: 16px;position: absolute;left:0.8rem;top: 0.8rem;z-index: 10"
               width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4.70696 7.70711L7.29274 10.2929C7.68327 10.6834 8.31643 10.6834 8.70696 10.2929L11.2927 7.70711C11.6833 7.31658 11.6833 6.68342 11.2927 6.29289C11.1052 6.10536 10.8509 6 10.5856 6H5.41406C4.86178 6 4.41406 6.44772 4.41406 7C4.41406 7.26522 4.51942 7.51957 4.70696 7.70711Z"
                fill="#1B76FF"/>
          </svg>

          <input
              type="text"
              id="custom-input-start"
              :style="{color: '#292933','font-size':'1.4rem','background-color':startTime ? 'white': '#F2F2F2','border': startTime ? '0.1rem solid #DCDADA': isCreateMeetingClicked ? '0.1rem solid #DA0202' : '0.1rem solid transparent' }"
          />
          <persian-date-picker
              color="#1B76FF"
              :disabled="showEndDatePicker"
              :show="showStartDatePicker"
              :format="'jDD jMMMM jYYYY HH:mm'"
              v-model="startTime"
              type="datetime"
              popover="bottom-right"
              custom-input="#custom-input-start"
              @close="closeStartDatePicker"
          >
            <template #header-date="{formattedDate }">
              {{
                formattedDate.toString().split(' ')[0] + formattedDate.toString().split(' ')[1] + formattedDate.toString().split(' ')[2]
              }}
            </template>
            <template #month-name="{date}">
              {{ date.xFormat('jDD jMMMM jYYYY') }}
            </template>
            <template #submit-btn="{canSubmit, submit, lang }">
              <button
                  type="button"
                  :disabled="!canSubmit"
                  :style="{ 'background-color':'#1B76FF','border-radius':'0.8rem','color':'white','position':'relative','left':'-19.5rem' }"
                  @click="submit"
                  v-text="lang.submit"
              />
            </template>
            <template #cancel-btn="{vm}">
              <button
                  type="button"
                  :style="{ 'color':'white','position':'absolute','top':'-8rem','left':'-1rem' }"
                  class="cancel-btn-date-picker"
                  @click="vm.visible = false"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M11.0191 3.56764L7.99812 6.58868L4.97715 3.56764C4.5874 3.17789 3.9555 3.17789 3.56575 3.56764L3.49724 3.64344C3.17752 4.03543 3.20036 4.61366 3.56575 4.97905L6.58678 8.00001L3.56575 11.021C3.176 11.4107 3.176 12.0426 3.56575 12.4324L3.64155 12.5009C4.03354 12.8206 4.61176 12.7978 4.97715 12.4324L7.99812 9.41134L11.0191 12.4324C11.4088 12.8221 12.0407 12.8221 12.4305 12.4324L12.499 12.3566C12.8187 11.9646 12.7959 11.3864 12.4305 11.021L9.40945 8.00001L12.4305 4.97905C12.8202 4.5893 12.8202 3.95739 12.4305 3.56764C12.0407 3.17789 11.4088 3.17789 11.0191 3.56764Z"
                      fill="white"/>
                </svg>

              </button>
            </template>
            <template #now-btn="{color, goToday, lang }">
              <button
                  type="button"
                  :style="{ color,'position':'relative','right':'-9rem' }"
                  @click="goToday"
                  v-text="lang.now"
              />
            </template>
          </persian-date-picker>
        </div>
      </div>
      <div class="column-separate-info column-separate-info-meeting-date-display-none"></div>
      <div class="create-webinar-set-time-items">
       <span style="color: #75758F;display: flex;align-items: center">
        <span v-if="isCreateMeetingClicked && !endTime">
          <img draggable="false" src="/img/Vector.svg">
        </span>
        <span>زمان پایان وبینار</span>
      </span>
        <div style="width: 24.7rem;position: relative">
          <svg @click="showEndDatePicker = true"
               style="cursor: pointer;width: 16px;height: 16px;position: absolute;left:0.8rem;top: 0.8rem;z-index: 10"
               width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4.70696 7.70711L7.29274 10.2929C7.68327 10.6834 8.31643 10.6834 8.70696 10.2929L11.2927 7.70711C11.6833 7.31658 11.6833 6.68342 11.2927 6.29289C11.1052 6.10536 10.8509 6 10.5856 6H5.41406C4.86178 6 4.41406 6.44772 4.41406 7C4.41406 7.26522 4.51942 7.51957 4.70696 7.70711Z"
                fill="#1B76FF"/>
          </svg>

          <input
              type="text"
              id="custom-input-end"
              :style="{color: '#292933','font-size':'1.4rem','background-color':endTime ? 'white': '#F2F2F2','border': endTime ? '0.1rem solid #DCDADA': isCreateMeetingClicked ? '0.1rem solid #DA0202' : '0.1rem solid transparent' }"
          />
          <persian-date-picker
              color="#1B76FF"
              :disabled="showStartDatePicker"
              :show="showEndDatePicker"
              :format="'jDD jMMMM jYYYY - ساعت HH:mm'"
              v-model="endTime"
              type="datetime"
              popover="bottom-right"
              @close="closeStartDatePicker"
              custom-input="#custom-input-end"
          >
            <template #header-date="{formattedDate }">
              {{
                formattedDate.toString().split(' ')[0] + formattedDate.toString().split(' ')[1] + formattedDate.toString().split(' ')[2]
              }}
            </template>
            <template #month-name="{date}">
              {{ date.xFormat('jDD jMMMM jYYYY') }}
            </template>
            <template #submit-btn="{canSubmit, submit, lang }">
              <button
                  type="button"
                  :disabled="!canSubmit"
                  :style="{ 'background-color':'#1B76FF','border-radius':'0.8rem','color':'white','position':'relative','left':'-19.5rem' }"
                  @click="submit"
                  v-text="lang.submit"
              />
            </template>
            <template #cancel-btn="{vm}">
              <button
                  type="button"
                  :style="{ 'color':'white','position':'absolute','top':'-8rem','left':'-1rem' }"
                  class="cancel-btn-date-picker"
                  @click="vm.visible = false"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M11.0191 3.56764L7.99812 6.58868L4.97715 3.56764C4.5874 3.17789 3.9555 3.17789 3.56575 3.56764L3.49724 3.64344C3.17752 4.03543 3.20036 4.61366 3.56575 4.97905L6.58678 8.00001L3.56575 11.021C3.176 11.4107 3.176 12.0426 3.56575 12.4324L3.64155 12.5009C4.03354 12.8206 4.61176 12.7978 4.97715 12.4324L7.99812 9.41134L11.0191 12.4324C11.4088 12.8221 12.0407 12.8221 12.4305 12.4324L12.499 12.3566C12.8187 11.9646 12.7959 11.3864 12.4305 11.021L9.40945 8.00001L12.4305 4.97905C12.8202 4.5893 12.8202 3.95739 12.4305 3.56764C12.0407 3.17789 11.4088 3.17789 11.0191 3.56764Z"
                      fill="white"/>
                </svg>

              </button>
            </template>
            <template #now-btn="{color, goToday, lang }">
              <button
                  type="button"
                  :style="{ color,'position':'relative','right':'-9rem' }"
                  @click="goToday"
                  v-text="lang.now"
              />
            </template>
          </persian-date-picker>
        </div>

      </div>

    </div>
    <div class="separate-info-large "></div>
    <div class="create-webinar-body">
      <div class="create-webinar-body-meeting-info">
        <div v-if="createOrEditMeeting === 'edit'" class="edit-meeting-body-meeting-info__link">
          <span style="color: #75758F;width: 100%;direction: rtl">لینک وبینار</span>
          <div class="edit-meeting-body-meeting-info__link--input-container">
            <div>
              <input class="meeting-link-input" disabled ref="linkURL"
                     v-model="meetingLink">
            </div>
            <div style="width: fit-content;height: fit-content" @click="copyMeetingLink">
              <base-button
                  :button-inner-txt="$store.getters.t('copy-link')"
                  :continuous-params="['color=#F6F6F7', 'background-color=#1B76FF','width=8.6rem','height=2.4rem',
          'font-size=1.2rem', 'font-weight= 700',
          'border-radius=0.6rem']"
                  :is-active="true"
                  @click="copyLink"
              >
                <template #pre-button-slot>
                  <img draggable="false" v-show="!isLinkCopied" src="/img/copy-icon.svg" style="width: 16px; height: 16px"
                       alt="not loaded"
                       class="fade-image">
                  <svg class="fade-image" style="width: 16px;height: 16px" v-show="isLinkCopied" width="24" height="24"
                       viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18.7104 7.2101C18.6175 7.11638 18.5069 7.04198 18.385 6.99121C18.2632 6.94044 18.1324 6.91431 18.0004 6.91431C17.8684 6.91431 17.7377 6.94044 17.6159 6.99121C17.494 7.04198 17.3834 7.11638 17.2904 7.2101L9.84044 14.6701L6.71044 11.5301C6.61392 11.4369 6.49998 11.3636 6.37512 11.3143C6.25026 11.2651 6.11694 11.241 5.98276 11.2433C5.84858 11.2457 5.71617 11.2744 5.59309 11.3279C5.47001 11.3814 5.35868 11.4586 5.26544 11.5551C5.1722 11.6516 5.09889 11.7656 5.04968 11.8904C5.00048 12.0153 4.97635 12.1486 4.97867 12.2828C4.98099 12.417 5.00972 12.5494 5.06321 12.6725C5.1167 12.7955 5.19392 12.9069 5.29044 13.0001L9.13044 16.8401C9.2234 16.9338 9.334 17.0082 9.45586 17.059C9.57772 17.1098 9.70843 17.1359 9.84044 17.1359C9.97245 17.1359 10.1032 17.1098 10.225 17.059C10.3469 17.0082 10.4575 16.9338 10.5504 16.8401L18.7104 8.68011C18.8119 8.58646 18.893 8.47281 18.9484 8.34631C19.0038 8.21981 19.0324 8.08321 19.0324 7.94511C19.0324 7.807 19.0038 7.6704 18.9484 7.5439C18.893 7.4174 18.8119 7.30375 18.7104 7.2101Z"
                        fill="white"/>
                  </svg>

                </template>
              </base-button>
            </div>
          </div>
        </div>
        <div class="meeting-types-container">

          <div class="column-separate-info column-separate-info-notice"></div>
          <div class="meeting-type-notice">
            <span style="color: #75758F">نوع اطلاع رسانی</span>
            <div style="width: 100%">
              <base-select down-img-color="#1B76FF" :option-values="meetingNotificationTypeList"
                           v-model="selectedNotificationTypeList"
                           max-height="24rem" :side="'select-ltr'" :arrow-direction="'arrow-down-icon-ltr'"
                           :div-height="'3rem'" :select-side="'list-item__label-ltr'"
                           is-calendar-view="yes"></base-select>
            </div>
          </div>

          <div class="column-separate-info column-separate-info-password"></div>
          <!--          <div class="meeting-type-password">-->
          <!--          <span style="color: #75758F">-->
          <!--            رمز ورود به جلسه-->
          <!--          </span>-->
          <!--            <input style="width: 100%" class="entrancePassword" v-model="entrancePassword">-->
          <!--          </div>-->
          <!--          <div class="column-separate-info column-separate-info-entrance"></div>-->
          <!--          <div class="meeting-type-entrance-permission">-->
          <!--            <span style="color: #75758F">ورود به جلسه</span>-->
          <!--            <div-->
          <!--                style="display: flex;width: 100%;height: 3.2rem;background-color: #F6F6F7;flex-direction: row;gap: 0.8rem;align-items: center;padding: 0 0.8rem;border-radius: 0.8rem">-->
          <!--              <input type="checkbox" id="entrancePermission" name="entrancePermission" style="cursor: pointer"-->
          <!--                     v-model="entrancePermission">-->
          <!--              <label for="entrancePermission" style="font-size: 1.4rem;cursor: pointer">ورود به جلسه با اجازه مدیر-->
          <!--                باشد</label>-->
          <!--            </div>-->

          <!--          </div>-->
          <div class="column-separate-info column-separate-info-tenant"></div>
          <div class="meeting-type-entrance-permission">
            <span style="color: #75758F"> وبینار بین تننتی</span>
            <div
                style="display: flex;width: 100%;height: 3.2rem;background-color: #F6F6F7;flex-direction: row;gap: 0.8rem;align-items: center;padding: 0 0.8rem;border-radius: 0.8rem">
              <input type="checkbox" id="haveOuterTenant" name="haveOuterTenant" style="cursor: pointer"
                     v-model="haveOuterTenant">
              <label for="haveOuterTenant" style="font-size: 1.4rem;cursor: pointer"> وبینار بین تننتی باشد
                باشد</label>
            </div>

          </div>
        </div>
        <div class="separate-info"></div>
        <div style="display: flex;flex-direction: column;height: 5rem;justify-content: space-between;gap: 0.8rem">
         <span style="color: #75758F;display: flex;gap: 0.8rem;align-items: center;width: 100%">
        <span v-if="isCreateMeetingClicked && !selectedRoom.label">
          <img draggable="false" src="/img/Vector.svg">
        </span>
        <span>اتاق وبینار</span>
      </span>
          <div ref="groupSelector"  class="choose-room-selector-container">
            <base-select
                down-img-color="#1B76FF"
                :border-color="isCreateMeetingClicked && !selectedRoom.label ? '0.1rem solid #DA0202' : ''"
                :is-drop-downOpen="isRoomDropDownOpen"
                :option-values="roomList"
                :max-height="maxHeight"
                :is-group="true"
                :side="'select-ltr'" :arrow-direction="'arrow-down-icon-rtl'"
                :select-side="'list-item__label-ltr'"
                :is-waiting-room="'yes'"
                v-model="selectedRoom" :div-height="'5rem'"></base-select>
          </div>
        </div>
        <div class="separate-info"></div>
        <div
            style="display: flex;flex-direction: column;height: 10rem;justify-content: space-between;align-items: flex-start">
          <span style="color: #75758F">توضیح وبینار</span>
          <textarea v-model="meetingDescription" class="meeting-description-input" maxlength="240"
                    placeholder="توضیحات وبینار را بنویسید(حداکثر 300 کاراکتر)">
        </textarea>
        </div>
        <div class="separate-info"></div>
<!--        <div-->
<!--            style="display: flex;flex-direction: column;justify-content: space-between;align-items: flex-start">-->
<!--          <span style="color: #75758F">دستور جلسه:</span>-->
<!--          <span v-if="!hasAgenda" style="color: #1B76FF;cursor: pointer;font-size: 1.4rem" @click="openAgendaModalBeforeCreateMeeting">تدوین دستور جلسه</span>-->
<!--          <span v-else style="color: #1B76FF;cursor: pointer;font-size: 1.4rem" @click="openAgendaModalBeforeCreateMeeting">ویرایش دستور جلسه</span>-->
<!--        </div>-->
        <!--        <div class="separate-info"></div>-->
        <!--        <div style="display: flex;flex-direction: row-reverse;justify-content: space-between;min-height: 5rem">-->
        <!--          <span style="color: #75758F">افزودن فایل های جلسه</span>-->
        <!--          <span style="color:#1B76FF;cursor: pointer">افزودن فایل</span>-->
        <!--        </div>-->
      </div>
      <div class="separate-info-large__column" ></div>
      <div class="create-webinar-body-invite-info">

        <div  class="choose-moderator-container__fragment" >
          <div class="choose-moderator-container">
         <span style="color: #75758F;display: flex;align-items: center;width: 100%">
        <span v-if="isCreateMeetingClicked && !meetingModerator.firstName">
          <img draggable="false" src="/img/Vector.svg">
        </span>
        <span>مدیر جلسه</span>
      </span>
            <div
                :style="{'background-color': isModeratorChosen || !isModeratorFocused ? '#F6F6F7' : 'white','border': isModeratorChosen|| !isModeratorFocused ? '0.1rem solid transparent' : isCreateMeetingClicked  ? '0.1rem solid #DA0202' : '0.1rem solid #DCDADA','max-height':addedUsersForModerator.length > 0 ? '20rem' : '3.2rem','box-shadow':isModeratorChosen || !isModeratorFocused  ? '' : '0px 0px 8px 0px rgba(0, 0, 0, 0.25)','position':addedUsersForModerator.length > 0 ? 'absolute' : '','z-index':addedUsersForModerator.length > 0 ? '20' : '0',top:addedUsersForModerator.length > 0 ? '1.8rem' : '0'}"
                class="choose-moderator-input">
              <div class="moderator-chosen" v-if="isModeratorChosen">
                <div style="display: flex;flex-direction: row;align-items: center;height: 100%;gap: 0.8rem">
                  <div style="font-weight: 400;font-size: 1.2rem">
                    {{
                      meetingModerator.firstName +
                      " " +
                      meetingModerator.lastName
                    }}
                  </div>

                  <img draggable="false" src="/img/close.svg" style="width: 16px;height: 16px;cursor: pointer" @click="deleteModerator">

                </div>
              </div>
              <input
                  v-else
                  class="moderator-chosen-input"
                  ref="chooseModeratorInput"
                  :style="{'border-bottom':addedUsersForModerator.length > 0 ? '0.1rem solid #DCDADA' : ''}"
                  @keyup="searchModerator"
                  @focus="focusModerator"
                  @blur="blurModerator"
                  v-model="moderatorMeetingValue"
              />
              <div
                  class="found-users-container"
                  v-if="addedUsersForModerator.length > 0"
                  :style="{'max-height':'15rem'}"
              >
                <ul>
                  <li
                      v-for="user in addedUsersForModerator"
                      :key="user.id"
                      class="found-user-invite-list"
                      @mousedown="clickToChooseModerator(user)"
                  >
                    {{ user.firstName + " " + user.lastName }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="choose-moderator-container">
         <span style="color: #75758F;display: flex;align-items: center;width: 100%">
        <span v-if="isCreateMeetingClicked && !meetingFirstPresenter.firstName">
          <img draggable="false" src="/img/Vector.svg">
        </span>
        <span> ارائه دهنده اول</span>
      </span>
            <div
                :style="{'background-color': isFirstPresenterChosen || !isFirstPresenterFocused ? '#F6F6F7' : 'white','border': isFirstPresenterChosen || !isFirstPresenterFocused  ? '0.1rem solid transparent' : isCreateMeetingClicked  ? '0.1rem solid #DA0202' : '0.1rem solid #DCDADA','max-height':addedUsersForFirstPresenter.length > 0 ? '20rem' : '3.2rem','box-shadow':isFirstPresenterChosen || !isFirstPresenterFocused ? '' : '0px 0px 8px 0px rgba(0, 0, 0, 0.25)','position':addedUsersForFirstPresenter.length > 0 ? 'absolute' : '','z-index':addedUsersForFirstPresenter.length > 0 ? '20' : '0',top:addedUsersForFirstPresenter.length > 0 ? '1.8rem' : '0'}"
                class="choose-moderator-input">
              <div class="moderator-chosen" v-if="isFirstPresenterChosen">
                <div style="display: flex;flex-direction: row;align-items: center;height: 100%;gap: 0.8rem">
                  <div style="font-weight: 400;font-size: 1.2rem">
                    {{
                      meetingFirstPresenter.firstName +
                      " " +
                      meetingFirstPresenter.lastName
                    }}
                  </div>

                  <img draggable="false" src="/img/close.svg" style="width: 16px;height: 16px;cursor: pointer" @click="deleteFirstPresenter">

                </div>
              </div>
              <input
                  v-else
                  class="moderator-chosen-input"
                  ref="chooseFirstPresenterInput"
                  :style="{'border-bottom':addedUsersForFirstPresenter.length > 0 ? '0.1rem solid #DCDADA' : ''}"
                  @keyup="searchFirstPresenter"
                  @focus="focusFirstPresenter"
                  @blur="blurFirstPresenter"
                  v-model="firstPresenterMeetingValue"
              />
              <div
                  class="found-users-container"
                  v-if="addedUsersForFirstPresenter.length > 0"
                  :style="{'max-height':'15rem'}"
              >
                <ul :style="{'max-height':'15rem'}">
                  <li
                      v-for="user in foundUsersForFirstPresenter"
                      :key="user.id"
                      class="found-user-invite-list"
                      @mousedown="clickToChooseSFirstPresenter(user)"
                  >
                    {{ user.firstName + " " + user.lastName }}
                  </li>
                </ul>
              </div>
            </div>
          </div>






          <div class="choose-moderator-container">
         <span style="color: #75758F;display: flex;align-items: center;width: 100%">
        <span v-if="isCreateMeetingClicked && !meetingSecondPresenter.firstName">
          <img draggable="false" src="/img/Vector.svg">
        </span>
        <span> ارائه دهنده دوم</span>
      </span>
            <div
                :style="{'background-color': isSecondPresenterChosen || !isSecondPresenterFocused ? '#F6F6F7' : 'white','border': isSecondPresenterChosen || !isSecondPresenterFocused  ? '0.1rem solid transparent' : isCreateMeetingClicked  ? '0.1rem solid #DA0202' : '0.1rem solid #DCDADA','max-height':addedUsersForSecondPresenter.length > 0 ? '20rem' : '3.2rem','box-shadow':isSecondPresenterChosen || !isSecondPresenterFocused ? '' : '0px 0px 8px 0px rgba(0, 0, 0, 0.25)','position':addedUsersForSecondPresenter.length > 0 ? 'absolute' : '','z-index':addedUsersForSecondPresenter.length > 0 ? '20' : '0',top:addedUsersForSecondPresenter.length > 0 ? '1.8rem' : '0'}"
                class="choose-moderator-input">
              <div class="moderator-chosen" v-if="isSecondPresenterChosen">
                <div style="display: flex;flex-direction: row;align-items: center;height: 100%;gap: 0.8rem">
                  <div style="font-weight: 400;font-size: 1.2rem">
                    {{
                      meetingSecondPresenter.firstName +
                      " " +
                      meetingSecondPresenter.lastName
                    }}
                  </div>

                  <img draggable="false" src="/img/close.svg" style="width: 16px;height: 16px;cursor: pointer" @click="deleteSecondPresenter">

                </div>
              </div>
              <input
                  v-else
                  class="moderator-chosen-input"
                  ref="chooseSecondPresenterInput"
                  :style="{'border-bottom':addedUsersForSecondPresenter.length > 0 ? '0.1rem solid #DCDADA' : ''}"
                  @keyup="searchSecondPresenter"
                  @focus="focusSecondPresenter"
                  @blur="blurSecondPresenter"
                  v-model="secondPresenterMeetingValue"
              />
              <div
                  class="found-users-container"
                  v-if="addedUsersForSecondPresenter.length > 0"
                  :style="{'max-height':'15rem'}"
              >
                <ul :style="{'max-height':'15rem'}">
                  <li
                      v-for="user in foundUsersForSecondPresenter"
                      :key="user.id"
                      class="found-user-invite-list"
                      @mousedown="clickToChooseSecondPresenter(user)"
                  >
                    {{ user.firstName + " " + user.lastName }}
                  </li>
                </ul>
              </div>
            </div>
          </div>


        </div>

        <div class="separate-info"></div>















<!--        <div class="invite-user-element">-->
<!--          <span ref="chooseTenant" style="color: #75758F;width: 100%;direction: rtl">{{$store.getters.t('choose-tenant')}}</span>-->
<!--          <div :style="{'background-color': !isTenantFocused ? '#F6F6F7' : 'white','border': isTenantFocused ? '0.1rem solid #DCDADA' : '0.1rem solid transparent',padding: foundTenants.length > 0 ? '0 0.8rem 0 0.8rem' : '0 0.8rem','max-height':foundTenants.length > 0 ? '20rem' : '5rem','position':foundTenants.length > 0 ? 'absolute' : '','z-index':foundTenants.length > 0 ? '20' : '0',top:foundTenants.length > 0 ? '1.8rem' : '0'}"-->
<!--               class="invite-user-element-input-container">-->
<!--            <input v-if="!isTenantChosen" type="text"   class="moderator-chosen-input" v-model="searchedTenant" @keyup="searchTenant"-->
<!--                   @focus="focusTenant" @blur="blurTenant"/>-->
<!--            <div v-else  style="display: flex;gap: 0.8rem;align-items: center;border: none;background-color: transparent;-->
<!--  height: 3.2rem;-->
<!--  width: 100%;-->
<!--  right: 0;-->
<!--  padding: 0 0.8rem;-->
<!--  direction: rtl;">-->
<!--              <span style="font-size: 1.2rem">{{chosenTenant}}</span>-->
<!--              <close-icon  width="16" height="16" color="#75758F" @click-icon="deleteChosenTenant" ></close-icon>-->
<!--            </div>-->
<!--            <div-->
<!--                class="found-users-container"-->
<!--                v-if="foundTenants.length > 0 && isTenantFocused"-->
<!--                :style="{'max-height':'21rem'}"-->
<!--            >-->
<!--              <ul  :style="{'max-height':'21rem'}">-->
<!--                <li-->
<!--                    v-for="tenant in foundTenants"-->
<!--                    :key="tenant.id"-->
<!--                    class="found-user-invite-list"-->
<!--                    @mousedown="clickToChooseTenant(tenant)"-->
<!--                >-->
<!--                  {{ tenant.tenantName}}-->
<!--                </li>-->
<!--              </ul>-->
<!--            </div>-->
<!--          </div>-->


<!--        </div>-->



















        <div class="invite-user-container">
          <div class="invite-user-element">
            <span ref="inviteUSer" style="color: #75758F;width: 100%;direction: rtl">دعوت فردی</span>
            <div
                :style="{'background-color': !isUserFocused ? '#F6F6F7' : 'white','border': isUserFocused ? '0.1rem solid #DCDADA' : '0.1rem solid transparent',padding: addedUsersInvite.length > 0 ? '0 0.8rem 1rem 0.8rem' : '0 0.8rem','max-height':addedUsersInvite.length > 0 ? '20rem' : '5rem','position':addedUsersInvite.length > 0 ? 'absolute' : '','z-index':addedUsersInvite.length > 0 ? '20' : '0',top:addedUsersInvite.length > 0 ? '1.8rem' : '0'}"
                class="invite-user-element-input-container">
              <input
                  class="moderator-chosen-input"
                  ref="chooseFirstPresenterInput"
                  :style="{'border-bottom':addedUsersInvite.length > 0 ? '0.1rem solid #DCDADA' : ''}"
                  @keyup="searchUserForInvite"
                  @focus="focusUser"
                  @blur="blurUser"
                  v-model="userValue"
              />
              <div
                  class="found-users-container"
                  v-if="addedUsersInvite.length > 0"
                  :style="{'max-height':'15rem'}"
              >
                <ul :style="{'max-height':'15rem'}">
                  <li
                      v-for="user in foundUsersForInvite"
                      :key="user.id"
                      class="found-user-invite-list"
                      @mousedown="clickToInviteUser(user)"
                  >
                    {{ user.firstName + " " + user.lastName }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="invite-user-element">
            <span ref="inviteUSer" style="color: #75758F;width: 100%;direction: rtl">دعوت گروهی</span>
            <div
                :style="{'background-color': !isGroupFocused ? '#F6F6F7' : 'white','border': isGroupFocused ? '0.1rem solid #DCDADA' : '0.1rem solid transparent',padding: addedGroups.length > 0 ? '0 0.8rem 1rem 0.8rem' : '0 0.8rem' ,'position':addedGroups.length > 0 ? 'absolute' : '','z-index':addedGroups.length > 0 ? '20' : '0',top:addedGroups.length > 0 ? '1.6rem' : '0'}"
                class="invite-user-element-input-container">
              <input
                  class="moderator-chosen-input"
                  ref="chooseFirstPresenterInput"
                  :style="{'border-bottom':addedGroups.length > 0 ? '0.1rem solid #DCDADA' : ''}"
                  @keyup="searchGroupForInvite"
                  @focus="focusGroup"
                  @blur="blurGroup"
                  v-model="groupValue"
              />
              <div
                  class="found-users-container"
                  v-if="addedGroups.length > 0"
                  :style="{'max-height':'15rem'}"
              >
                <ul :style="{'max-height':'15rem'}">
                  <li
                      v-for="group in foundGroups"
                      :key="group.groupId"
                      class="found-user-invite-list"
                      @mousedown="clickToInviteGroup(group)"
                  >
                    {{ group.label }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
        <div style="width: 100%;overflow-y: auto"
             :style="{'max-height':invitedUsersMaxHeight, 'min-height':'30rem'}">
          <ul style="width: 100%">
            <li v-for="user in invitedUsers" :key="user"
                style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: space-between">
              <div class="invited-table-display-name">
                <img draggable="false" src="/img/profile.svg" style="width: 32px;height: 32px;cursor: pointer">
                <span
                    style="text-align: right;direction: rtl ;max-width: 14rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">  {{
                    user.firstName + ' ' + user.lastName
                  }}</span>
              </div>
              <span class="invited-table-user-name">{{
                  user.username
                }}</span>
              <div class="invited-table-close-action">
                <close-icon width="24" height="24" color="#75758F" @click-icon="deleteUser(user.id)"></close-icon>
              </div>

            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <base-modal v-if="createOrEditMeeting !== 'edit'" :open="showLinkModal">
    <template #modal-header>
      <div class="show-link-modal__header">
        <h2>لینک جلسه</h2>
      </div>
    </template>
    <template #modal-body>
      <div class="create-webinar-body-meeting-info__link" style="direction: ltr">
        <div class="create-webinar-body-meeting-info__link--input-container">
          <div>
            <input class="meeting-link-input" disabled ref="linkURL"
                   v-model="meetingLink">
          </div>
          <div style="width: fit-content;height: fit-content" @click="copyMeetingLink">
            <base-button
                :button-inner-txt="$store.getters.t('copy-link')"
                :continuous-params="['color=white', 'background-color=#1B76FF']"
                :style-types="[ 'small--button']"
                :is-active="true"
                @click="copyLink"
            >
              <template #pre-button-slot>
                <img draggable="false" v-show="!isLinkCopied" src="/img/copy-icon.svg" style="width: 16px; height: 16px" alt="not loaded"
                     class="fade-image">
                <svg class="fade-image" style="width: 16px;height: 16px" v-show="isLinkCopied" width="24" height="24"
                     viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M18.7104 7.2101C18.6175 7.11638 18.5069 7.04198 18.385 6.99121C18.2632 6.94044 18.1324 6.91431 18.0004 6.91431C17.8684 6.91431 17.7377 6.94044 17.6159 6.99121C17.494 7.04198 17.3834 7.11638 17.2904 7.2101L9.84044 14.6701L6.71044 11.5301C6.61392 11.4369 6.49998 11.3636 6.37512 11.3143C6.25026 11.2651 6.11694 11.241 5.98276 11.2433C5.84858 11.2457 5.71617 11.2744 5.59309 11.3279C5.47001 11.3814 5.35868 11.4586 5.26544 11.5551C5.1722 11.6516 5.09889 11.7656 5.04968 11.8904C5.00048 12.0153 4.97635 12.1486 4.97867 12.2828C4.98099 12.417 5.00972 12.5494 5.06321 12.6725C5.1167 12.7955 5.19392 12.9069 5.29044 13.0001L9.13044 16.8401C9.2234 16.9338 9.334 17.0082 9.45586 17.059C9.57772 17.1098 9.70843 17.1359 9.84044 17.1359C9.97245 17.1359 10.1032 17.1098 10.225 17.059C10.3469 17.0082 10.4575 16.9338 10.5504 16.8401L18.7104 8.68011C18.8119 8.58646 18.893 8.47281 18.9484 8.34631C19.0038 8.21981 19.0324 8.08321 19.0324 7.94511C19.0324 7.807 19.0038 7.6704 18.9484 7.5439C18.893 7.4174 18.8119 7.30375 18.7104 7.2101Z"
                      fill="white"/>
                </svg>

              </template>
            </base-button>
          </div>
        </div>
      </div>
    </template>
    <template #modal-buttons>
      <div class="create-webinar-action">
        <base-button
            :is-active="true"
            :button-inner-txt="'بستن'"
            :continuous-params="['color=white', 'background-color=#EC3737']"
            :style-types="[ 'large--button']"
            @click="closeCreateMeeting">

        </base-button>
      </div>
    </template>
  </base-modal>
</template>

<script>
import BaseButton from "./UI/BaseButton";
import PersianDatePicker from "vue3-persian-datetime-picker";
import BaseSelect from "./UI/BaseSelect";
import RestClient from "../api/restClient";
import entityTypes from "@/statics/entityTypes";
import momentJalali from "moment-jalaali";
import {nextTick} from "vue";
import BaseModal from "@/components/UI/BaseModal.vue";
import CloseIcon from "@/components/UI/Icons/CloseIcon.vue";
// import moment from "moment/moment";

const restClientUserGroup = new RestClient("userGroup");
const restClientAgenda = new RestClient(entityTypes.agenda);
export default {
  name: "CreateWebinar",
  components: {CloseIcon, BaseModal, BaseButton, PersianDatePicker, BaseSelect},
  emits: ['close-create-meeting'],
  props: ['createOrEditMeeting', 'editableMeetingId', 'chosenModerator', 'chosenFirstPresenter','chosenSecondPresenter'],
  data() {
    return {
      meetingTitle: '',
      startTime: '',
      minTime: '',
      endTime: '',
      meetingLabelList: [
        {
          label: 'عادی', color: '#5392F2'
        },
        {
          label: 'محرمانه', color: '#444444'
        },
        {
          label: 'مهم', color: '#DA0202'
        },
      ],
      selectedLabelList: {label: 'عادی', color: '#5392F2'},
      meetingNotificationTypeList: [
        {
          label: 'ایمیل و پیامک'
        },
        {
          label: 'ایمیل'
        },
        {
          label: 'پیامک'
        },
      ],
      selectedNotificationTypeList: {label: 'ایمیل و پیامک'},
      entrancePassword: '',
      entrancePermission: false,
      isRoomDropDownOpen: false,
      roomList: [{label: ""}],
      selectedRoom: {label: ""},
      restClientRoom: new RestClient(entityTypes.room),
      restClientMeetingAttribute: new RestClient(entityTypes.meetingAttribute),
      restClientUser: new RestClient("user"),
      restClientGroup: new RestClient("group"),
      restClientInvite: new RestClient("invite"),
      restClient: new RestClient(entityTypes.scheduledMeeting),
      maxHeight: '',
      meetingDescription: '',
      agendaDescription: '',
      isLinkCopied: false,
      meetingLink: '',
      meetingModerator: {},
      isModeratorChosen: false,
      isUserFound: false,
      isModeratorFocused: false,
      moderatorMeetingValue: "",
      meetingFirstPresenter: {},
      meetingSecondPresenter:{},
      isFirstPresenterChosen: false,
      isSecondPresenterChosen: false,
      isFirstPresenterFocused: false,
      isSecondPresenterFocused: false,
      firstPresenterMeetingValue: "",
      secondPresenterMeetingValue: "",
      allUsers: [],
      addedUsersForFirstPresenter: [],
      addedUsersForSecondPresenter: [],
      addedUsersForModerator: [],
      addedUsersInvite: [],
      userValue: '',
      isUserFocused: '',
      invitedUsers: [],
      invitedGroups: [],
      listOfAllGroups: [],
      userIds: [],
      invitedUsersMaxHeight: '',
      groupValue: '',
      isGroupFocused: false,
      addedGroups: [],
      showStartDatePicker: false,
      showEndDatePicker: false,
      isCreateMeetingClicked: false,
      meetingId: '',
      showLinkModal: false,
      haveOuterTenant: false,
      hasAgenda:false,
      agendaId:null,
      createdDate:'',
      createdBy:'',
      meetingName:'',
      purposeOfMeeting:'',
      withoutModerator:false,
      searchedTenant:'',
      allTenants:[{tenantName:'شوکا' , id:1}, {tenantName:'ایرانخودرو' , id:2}, {tenantName:'سایپا' , id:3}, {tenantName:'نفت' , id:4}],
      isTenantFound:false,
      foundTenants:[],
      isTenantFocused: '',
      isTenantChosen:false,
      chosenTenant:'',
      whichTenant:{},
      presenters: [],
    }
  },
  watch: {
    // startTime(val) {
    //   console.error(val)
    //   let date = momentJalali(val, 'jDD jMMMM jYYYY HH:mm').format('jYYYY/jM/jD HH:mm')
    //   console.error(date)
    // },
    isLinkCopied(val) {
      if (val) {
        setTimeout(() => {
          this.toggleCopiedLinkStatus()
        }, 3000)
      }
    },
    createOrEditMeeting: {
      immediate:true,
      handler(val){
        if (val === 'edit') {
          this.getMeetingData();
          // this.getMeetingAgenda()
        }
      }
    },
    startTime:{
      immediate: true,
      handler(val){
        if (val !== ''){
          const startDate = momentJalali(val, 'jDD jMMMM jYYYY HH:mm').format('jYYYY/jM/jD H:m').split(' ')[1].split(':')
          this.$store.dispatch('setMeetingStartTime',parseInt(startDate[0])*60 + parseInt(startDate[1]))
        }

      }
    },
    endTime:{
      immediate: true,
      handler(val){
        if (val !== ''){
          const endDate = momentJalali(val, 'jDD jMMMM jYYYY HH:mm').format('jYYYY/jM/jD H:m').split(' ')[1].split(':')
          this.$store.dispatch('setMeetingEndTime',parseInt(endDate[0])*60 + parseInt(endDate[1]))
        }

      }
    }
  },
  computed: {
    fromSchd() {
      return momentJalali(this.startTime, 'jDD jMMMM jYYYY HH:mm').format('jYYYY/jM/jD HH:mm')
    },
    toSchd() {
      return momentJalali(this.endTime, 'jDD jMMMM jYYYY HH:mm').format('jYYYY/jM/jD HH:mm')
    },
    foundUsersForModerator() {
      return this.addedUsersForModerator;
    },
    foundUsersForFirstPresenter() {
      return this.addedUsersForFirstPresenter;
    },
    foundUsersForSecondPresenter() {
      return this.addedUsersForSecondPresenter;
    },
    foundUsersForInvite() {
      return this.addedUsersInvite;
    },
    foundGroups() {
      return this.addedGroups;
    },
  },
  methods: {
    closeCreateMeeting() {
      this.$emit('close-create-meeting')
    },
    openAgendaModalBeforeCreateMeeting(){
      if (this.createOrEditMeeting === 'edit'){
        this.$emit('open-agenda-modal-before-create-meeting',{meetingId:this.editableMeetingId, createOrEdit : 'edit'})
      }else {
        this.$emit('open-agenda-modal-before-create-meeting',{meetingId:this.meetingId, createOrEdit : 'create'})
      }

    },
    openAgendaModal(){
      if (this.createOrEditMeeting === 'edit'){
        this.$emit('open-agenda-modal', {meetingId:this.editableMeetingId, createOrEdit : 'edit'})
      }else {
        this.$emit('open-agenda-modal', {meetingId:this.meetingId, createOrEdit : 'create'})
      }


    },
    createMeeting() {
      this.isCreateMeetingClicked = true
      this.isLoadingCreateMeeting = true;
      // EventBus.$emit('roomId', this.roomId)
      return new Promise((resolve, reject) => {
        let inputData = {};
          this.presenters.push(this.meetingFirstPresenter?.id)
          this.presenters.push(this.meetingSecondPresenter?.id)
          inputData = {
            meetingType: 0,
            fromSchd: this.fromSchd,
            toSchd: this.toSchd,
            title: this.meetingTitle,
            meetingPinCode: this.meetingPinCode,
            description: this.meetingDescription,
            publishSize: "16",
            isWebinar: true,
            notificationType: this.getNotificationTypeByName(
                this.selectedNotificationTypeList.label
            ),
            managerUserId: this.meetingModerator.id,
            substitutionUserId:'',
            roomId: this.selectedRoom.id,
            entrancePermission: false,
            presenters: this.presenters,
          }

        console.error(inputData)
        this.restClient
            .create(inputData)
            .then((data) => {
              this.isCreateOrEditMeeting = true;
              this.isLoadingCreateMeeting = false;
              this.isFirstPresenterFocused = false
              this.isModeratorFocused = false
              this.eventBus.emit("notification", {
                title: "پیام",
                type: "success",
                bodyText: this.$store.getters.t('webinar-created'),
                time: 5000,
              });
              this.meetingId = data.data
              // this.createMeetingAttributes(data.meetingId)
              this.generateLink(data.data);
              if (this.$store.getters.agendaParagraphs.length > 0){
                this.createAgenda()
              }
              resolve(data)
            })
            .catch((error) => {
              this.isLoadingCreateMeeting = false;
              console.error(error);
              reject(error)
            });
      });
    },
    editMeeting() {
      this.isCreateMeetingClicked = true
      this.isLoadingCreateMeeting = true;
      // EventBus.$emit('roomId', this.roomId)
      return new Promise((resolve, reject) => {
        let inputData = {};
        inputData = {
          id: this.editableMeetingId,
          meetingType: 0,
          fromSchd: this.fromSchd,
          toSchd: this.toSchd,
          title: this.meetingTitle,
          meetingPinCode: this.meetingPinCode,
          description: this.meetingDescription,
          publishSize: "16",
          isWebinar: true,
          notificationType: this.getNotificationTypeByName(
              this.selectedNotificationTypeList.label
          ),
          managerUserId: this.meetingModerator.id,
          substitutionUserId:0,
          roomId: this.selectedRoom.id,
          entrancePermission: false,
          presenters: this.presenters,
        }

        console.error(inputData)
        this.restClient
            .update(inputData)
            .then((data) => {
              this.isCreateOrEditMeeting = true;
              this.isLoadingCreateMeeting = false;
              this.isFirstPresenterFocused = false
              this.isModeratorFocused = false
              this.eventBus.emit("notification", {
                title: "پیام",
                type: "success",
                bodyText: this.$store.getters.t('webinar-edited'),
                time: 5000,
              });
              // this.meetingId = data.id
              // this.createMeetingAttributes(this.editableMeetingId)
              // this.generateLink(this.editableMeetingId);
              resolve(data)
            })
            .catch((error) => {
              this.isLoadingCreateMeeting = false;
              console.error(error);
              reject(error)
            });
      });
    },
    inviteUsers() {
      const userIds = this.invitedUsers.map((el) => {
        return el.id;
      });
      let meetingId = null
      if (this.createOrEditMeeting !== 'edit'){
        meetingId = this.meetingId
      }else  {
        meetingId = this.editableMeetingId
      }
      this.restClientInvite
          .modifyUserOfPublicRoom(meetingId, [], userIds)
          .then(() => {
            this.stepOfCreateMeeting = "stepOne";
            this.startTime = "";
            this.endTime = "";
            this.meetingTitle = "";
            this.meetingPinCode = "";
            this.description = "";
            this.selectedNotice.label = this.$store.getters.t('Email');
            this.selectedRoom = {};
            this.createMeetingIsOpen = false;
            this.meetingData = "";
            this.isModeratorChosen = false;
            this.isFirstPresenterChosen = false;
            this.invitedUsers = [];
            this.userIds = [];
          })
          .catch((err) => {
            console.log(err);
          });
    },
    async storeMeeting() {
      let startTime = ''
      let endTime = ''
      let meetingTime = 0
      let sumWithInitial = 0
      const initialValue = 0;
      if (this.startTime && this.endTime){
        startTime = momentJalali(this.startTime, 'jDD jMMMM jYYYY HH:mm').format('jYYYY/jM/jD H:m').split(' ')[1].split(':')
        endTime = momentJalali(this.endTime, 'jDD jMMMM jYYYY HH:mm').format('jYYYY/jM/jD H:m').split(' ')[1].split(':')
        meetingTime = (parseInt(endTime[0])*60 +  parseInt(endTime[1])) - (parseInt(startTime[0])*60 +  parseInt(startTime[1]))
        console.error(meetingTime)
        if (this.$store.getters.agendaParagraphs?.length > 0){
          sumWithInitial = this.$store.getters.agendaParagraphs.reduce(
              (accumulator, currentValue) => accumulator + parseInt(currentValue.timeInMinutes),
              initialValue,
          );
        }
        if (!this.$store.getters.agendaHasTime ||  meetingTime >= sumWithInitial){
          try {
            await this.createMeeting()
            if (this.invitedUsers.length > 0) {
              await this.inviteUsers()
            }
            this.showLinkModal = true

          } catch (error) {
            console.error(error)
          }
        }else {
          this.eventBus.emit("notification", {
            title: "پیام",
            type: "error",
            bodyText: 'جمع زمان ارائه موارد دستور جلسه از زمان برگزاری جلسه بزرگتر است، لطفا زمان پایان جلسه را تغییر دهید ',
            time: 7000,
          });
        }
      }





    },
    async updateMeeting(){
      let startTime = ''
      let endTime = ''
      let meetingTime = 0
      let sumWithInitial = 0
      const initialValue = 0;
      if (this.$store.getters.agendaParagraphs?.length > 0) {

        if (this.startTime && this.endTime) {
          startTime = momentJalali(this.startTime, 'jDD jMMMM jYYYY HH:mm').format('jYYYY/jM/jD H:m').split(' ')[1].split(':')
          endTime = momentJalali(this.endTime, 'jDD jMMMM jYYYY HH:mm').format('jYYYY/jM/jD H:m').split(' ')[1].split(':')
          meetingTime = (parseInt(endTime[0]) * 60 + parseInt(endTime[1])) - (parseInt(startTime[0]) * 60 + parseInt(startTime[1]))

          sumWithInitial = this.$store.getters.agendaParagraphs.reduce(
              (accumulator, currentValue) => accumulator + parseInt(currentValue.timeInMinutes),
              initialValue,
          );
          console.error(sumWithInitial)
        }
      }
      if (!this.$store.getters.agendaHasTime || meetingTime >= sumWithInitial){
        try {
          await this.editMeeting()
          if (this.agendaId){
            await this.editAgenda()
          }else if (this.$store.getters.agendaParagraphs?.length > 0) {
            await this.createAgenda()
          }
          if (this.invitedUsers.length > 0) {
            await this.inviteUsers()
          }
          this.closeCreateMeeting()
        } catch (error) {
          console.error(error)
        }
      }else {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "error",
          bodyText: 'جمع زمان ارائه موارد دستور جلسه از زمان برگزاری جلسه بزرگتر است، لطفا زمان پایان جلسه را تغییر دهید ',
          time: 7000,
        });
      }

    },
    copyMeetingLink() {
      this.$refs.linkURL.select();
      this.$refs.linkURL.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(this.meetingLink);
      nextTick(() => {
        this.isLinkCopied = true
      })
    },
    toggleCopiedLinkStatus() {
      this.isLinkCopied = false
    },
    getRooms() {
      this.roomList = [];
      this.restClientRoom
          .getAll(true)
          .then((response) => {
            this.roomList = [];
            for (let i = 0; i < response.data.length; i++) {
              this.roomList.push({
                label: response.data[i].name,
                id: response.data[i].id,
              });
            }
            // this.selectedRoom = {
            //   label: this.roomList[0].label,
            //   id: this.roomList[0].id,
            // };
          })
          .catch((error) => {
            // eslint-disable-next-line no-undef
            reject(error);
          });
    },
    deleteModerator() {
      this.isModeratorChosen = false;
      this.meetingModerator = {};
      setTimeout(() => {
        this.$refs.chooseModeratorInput.focus()
      }, 10)
    },
    deleteFirstPresenter() {
      this.isFirstPresenterChosen = false;
      this.meetingFirstPresenter = {};
      this.firstPresenterMeetingValue = ''
      setTimeout(() => {
        this.$refs.chooseFirstPresenterInput.focus()
      }, 10)
    },
    deleteSecondPresenter() {
      this.isSecondPresenterChosen = false;
      this.meetingSecondPresenter = {};
      this.secondPresenterMeetingValue = ''
      setTimeout(() => {
        this.$refs.chooseSecondPresenterInput.focus()
      }, 10)
    },
    searchModerator() {
      const inpValue = this.moderatorMeetingValue;
      if (this.moderatorMeetingValue === "") {
        this.isUserFound = false;
      }
      this.addedUsersForModerator = this.allUsers.filter((el) => {
        if (
            ((el.firstName + " " + el.lastName).includes(inpValue) ||
                el.username.includes(inpValue)) &&
            inpValue.length !== 0
        ) {
          return true;
        }
      });

      // if (this.foundUsers.length > 0) {
      //   this.isUserFound = true;
      // }else{
      //   this.isUserFound = false;
      // }
      // this.groupIsFound = false
      // this.groupNameInput = ''
    },
    searchFirstPresenter() {
      const inpValue = this.firstPresenterMeetingValue;
      if (this.firstPresenterMeetingValue === "") {
        this.isUserFound = false;
      }
      this.addedUsersForFirstPresenter = this.allUsers.filter((el) => {
        if (
            ((el.firstName + " " + el.lastName).includes(inpValue) ||
                el.username.includes(inpValue)) &&
            inpValue.length !== 0
        ) {
          return true;
        }
      });
      // if (this.foundUsers.length > 0) {
      //   this.isUserFound = true;
      // }else{
      //   this.isUserFound = false;
      // }
      // this.groupIsFound = false
      // this.groupNameInput = ''
    },
    searchSecondPresenter() {
      const inpValue = this.secondPresenterMeetingValue;
      if (this.secondPresenterMeetingValue === "") {
        this.isUserFound = false;
      }
      this.addedUsersForSecondPresenter = this.allUsers.filter((el) => {
        if (
            ((el.firstName + " " + el.lastName).includes(inpValue) ||
                el.username.includes(inpValue)) &&
            inpValue.length !== 0
        ) {
          return true;
        }
      });
      // if (this.foundUsers.length > 0) {
      //   this.isUserFound = true;
      // }else{
      //   this.isUserFound = false;
      // }
      // this.groupIsFound = false
      // this.groupNameInput = ''
    },
    searchUserForInvite() {
      const inpValue = this.userValue;
      if (this.userValue === "") {
        this.isUserFound = false;
      }
      this.addedUsersInvite = this.allUsers.filter((el) => {
        if (
            ((el.firstName + " " + el.lastName).includes(inpValue) ||
                el.username.includes(inpValue)) &&
            inpValue.length !== 0
        ) {
          return true;
        }
      });
      // if (this.foundUsers.length > 0) {
      //   this.isUserFound = true;
      // }else{
      //   this.isUserFound = false;
      // }
      // this.groupIsFound = false
      // this.groupNameInput = ''
    },
    searchGroupForInvite() {
      const inpValue = this.groupValue;
      // if (this.firstPresenterMeetingValue === '') {
      //   this.isUserFound = false;
      //
      //
      // }

      this.addedGroups = this.listOfAllGroups.filter((el) => {
        if (el.groupName.includes(inpValue) && inpValue.length !== 0) {
          return true;
        }
      });
    },
    focusModerator() {
      this.isModeratorFocused = true;
    },
    blurModerator() {
      this.isModeratorFocused = false;
    },
    focusFirstPresenter() {
      this.isFirstPresenterFocused = true;
    },
    focusSecondPresenter() {
      this.isSecondPresenterFocused = true;
    },
    blurFirstPresenter() {
      this.isFirstPresenterFocused = false;
    },
    blurSecondPresenter() {
      this.isSecondPresenterFocused = false;
    },

    focusUser() {
      this.isUserFocused = true;
    },
    blurUser() {
      this.isUserFocused = false;
    },
    focusGroup() {
      this.isGroupFocused = true;
    },
    blurGroup() {
      this.isGroupFocused = false;
    },
    focusTenant() {
      this.isTenantFocused = true;
      this.foundTenants = this.allTenants
    },
    blurTenant() {
      this.isTenantFocused = false;
    },


    // focusGroup() {
    //   this.isGroupFocused = true;
    // },
    // blurGroup() {
    //   this.this.isGroupFocused = false;
    // },
    clickToChooseModerator(user) {
      this.meetingModerator = user;
      this.isModeratorChosen = true;
      this.moderatorMeetingValue = "";
      this.addedUsersForModerator = [];
      this.addedUsersForFirstPresenter = [];
    },
    clickToChooseSFirstPresenter(user) {
      this.meetingFirstPresenter = user;
      this.isFirstPresenterChosen = true;
      this.firstPresenterMeetingValue = "";
      this.addedUsersForModerator = [];
      this.addedUsersForFirstPresenter = [];
    },
    clickToChooseSecondPresenter(user) {
      this.meetingSecondPresenter = user;
      this.isSecondPresenterChosen = true;
      this.secondPresenterMeetingValue = "";
      this.addedUsersForModerator = [];
      this.addedUsersForSecondPresenter = [];
    },
    getAllUsers() {
      this.allUsers = [];
      this.restClientUser
          .getAll()
          .then((users) => {
            this.allUsers = users;
            if (this.createOrEditMeeting === 'edit' && this.editableMeetingId )
              this.getById(this.editableMeetingId)
          })
          .catch((err) => {
            console.log(err);
          });
    },
    clickToInviteUser(user) {
      const index = this.invitedUsers.findIndex((el) => {
        return el.id == user.id;
      });
      if (index === -1) {
        this.invitedUsers.push(user);
      }
      this.addedUsersInvite = []
      this.userValue = ''
    },
    clickToInviteGroup(group) {
      this.getAllUsersByGroupId(group.groupId);
      this.invitedGroups.push(group);
      this.addedGroups = []
      this.groupValue = ''
    },
    getAllGroups() {
      this.listOfAllGroups = [];
      this.restClientGroup
          .getAll()
          .then((groups) => {
            for (const el of groups) {
              this.listOfAllGroups.push({
                label: el.name,
                groupName: el.name,
                groupId: el.id,
                users: [],
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
    },
    getAllUsersByGroupId(id) {
      restClientUserGroup
          .getAllUsersByGroupId(id)
          .then((response) => {
            // this.addGroupToListParticipant(id);
            const index = this.listOfAllGroups.findIndex((el) => {
              return el.groupId == id;
            });

            if (this.listOfAllGroups[index].users.length === 0) {
              for (let element of response) {
                this.listOfAllGroups[index].users.push(element);
              }
            }
            const idx = this.invitedGroups.findIndex((el) => {
              return el.groupName === this.listOfAllGroups[index].groupName;
            });
            if (idx === -1) {
              this.invitedGroups.push(this.listOfAllGroups[index]);
            }
            const groupUsers = this.listOfAllGroups[index].users;
            for (let el of groupUsers) {
              const index = this.invitedUsers.findIndex((element) => {
                return (
                    element.firstName + element.lastName ===
                    el.firstName + el.lastName
                );
              });
              if (index === -1) {
                this.invitedUsers.push(el);
                this.userIds.push(el.id);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
    },
    deleteUser(id) {
      const foundUserIndex = this.invitedUsers.findIndex((user) => {
        return +user.id === +id;
      });
      if (foundUserIndex !== -1) {
        this.invitedUsers.splice(foundUserIndex, 1);
      }
    },
    closeStartDatePicker() {
      this.showStartDatePicker = false
      this.showEndDatePicker = false
    },
    closeEndDatePicker() {
      this.showStartDatePicker = false
      this.showEndDatePicker = false
    },
    getAllInvited() {
      this.invitedUsers = [];
      this.restClientInvite
          .getInvitedPublic(this.editableMeetingId)
          .then((invitedUsers) => {
            for (const el of invitedUsers) {
              if (
                  el.id != this.meetingModerator.id &&
                  el.id != this.meetingSubModerator.id
              ) {
                this.invitedUsers.push(el);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
    },
    async getMeetingData() {
      try {
        await this.getAllUsers()
        await this.getAllGroups()
        this.meetingModerator = this.chosenModerator
        this.meetingFirstPresenter = this.chosenFirstPresenter
        this.meetingSecondPresenter = this.chosenSecondPresenter
        await this.getAllInvited()
      } catch (error) {
        console.error(error)
      }
    },

    getNotificationTypeByName(value) {
      if (value === this.$store.getters.t('SMS')) {
        return 0;
      } else if (value === this.$store.getters.t('Email')) {
        return 1;
      } else {
        return 2;
      }
    },
    getNotificationTypeByValue(value) {
      if (value === 0) {
        return this.$store.getters.t('SMS');
      } else if (value === 1) {
        return this.$store.getters.t('Email');
      } else {
        return this.$store.getters.t('both');
      }
    },
    getById(id) {
      this.restClient
          .getById(id)
          .then((data) => {
            this.generateLink(id)
            this.meetingDescription = data.data.description
            this.selectedNotificationTypeList.label = this.getNotificationTypeByValue(data.data.notificationType)
            this.haveOuterTenant = data.data.haveOuterTenant
            this.selectedRoom = {label:data.data.roomName , id:data.data.roomId}
            this.startTime = momentJalali(data.data.fromSchd,'jYYYY/jM/jD HH:mm').format('jDD jMMMM jYYYY - ساعت HH:mm')
            this.endTime =  momentJalali(data.data.toSchd,'jYYYY/jM/jD HH:mm').format('jDD jMMMM jYYYY - ساعت HH:mm')

              // this.selectedMeetingType.label = this.$store.getters.t('without-moderator');
            this.presenters = data.data?.presenters
              let firstPresenter = this.allUsers.filter((el) => {
                return +el.id === +data.data?.presenters[0];
              });
            let secondPresenter = this.allUsers.filter((el) => {
              return +el.id === +data.data?.presenters[1];
            });
              let moderator = this.allUsers.filter((el) => {
                return +el.id === +data.data.managerUserId;
              });
              this.meetingFirstPresenter = firstPresenter[0]
              this.meetingSecondPresenter = secondPresenter[0]

              this.meetingModerator= moderator[0]
              // console.error(moderator[0])
              // this.selectedMeetingType.label = this.$store.getters.t('with-moderator');
              this.isFirstPresenterChosen = true;
              this.isSecondPresenterChosen = true;
              this.isModeratorChosen = true;

            // this.withoutModerator = data.withoutModerator
            this.meetingTitle = data.data.title;

            this.selectedNotice.label = this.getNotificationTypeByValue(data.data.notificationType);
            const foundRoomIndex = this.roomList.findIndex((el) => {
              return el.label === data.data.roomName;
            });
            if (foundRoomIndex === -1) {
              this.roomList.push({label: data.data.roomName});
            }
            this.selectedRoom = {
              label: data.data.roomName,
              id: data.data.roomId,
            };
          })
          .catch((err) => {
            console.log(err);
          });
    },
    generateLink(meetingId) {
      this.restClientInvite
          .generateLink(meetingId)
          .then((response) => {
            this.meetingLink = response;
            // this.createMeetingAttributes(this.meetingId)
          })
          .catch((error) => {
            console.log(error);
          });
    },
    getTagCodeByColor(color) {
      let code = 1
      switch (color) {
        case '#5392F2':
          code = 1;
          break
        case '#444444':
          code = 2
          break
        case '#DA0202':
          code = 3
          break
        case '#10CC72':
          code = 4
          break
        case '#EBA112':
          code = 5
          break
        case '#923CE8':
          code = 6
          break
        case '#DA6BE3':
          code = 7
          break
        case '#6DD6DD':
          code = 8
          break
      }
      return code
    },
    getTagColorByCode(code) {
      let color = '#5392F2'
      switch (code) {
        case 1:
          color = '#5392F2';
          break
        case 2:
          color = '#444444'
          break
        case 3:
          color = '#DA0202'
          break
        case 4:
          color = '#10CC72'
          break
        case 5:
          color = '#EBA112'
          break
        case 6:
          color = '#923CE8'
          break
        case 7:
          color = '#DA6BE3'
          break
        case 8:
          color = '#6DD6DD'
          break
      }
      return color
    },
    // createMeetingAttributes(id) {
    //   const data = {
    //     tagName: this.selectedLabelList.label,
    //     tagColor: parseInt(this.getTagCodeByColor(this.selectedLabelList.color)),
    //     meetingId: parseInt(id)
    //   }
    //   this.restClientMeetingAttribute.create(data)
    //       .then((response) => {
    //         console.error(response)
    //       })
    //       .catch((error) => {
    //         console.error(error)
    //       })
    // },
    getMeetingAgenda(){
      restClientAgenda.getAgenda(this.editableMeetingId).then((response)=>{
        this.$store.dispatch('setAgendaHasTime',response.data.hasTiming)
        const paragraphs = response.data.agendas.map((agenda) => {
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
        this.$store.dispatch('setAgendaParagraphs',paragraphs)
        this.$store.dispatch('setPurposeOfMeeting',response.data.purposeOfMeeting)
        if (response.data.id){
          this.agendaId = response.data.id
          console.error('there is an agenda')
          this.hasAgenda = true
          this.createdDate = response.data.createdDate
          this.createdBy = response.data.createdBy
          this.meetingName = response.data.meetingName
          this.purposeOfMeeting = response.data.purposeOfMeeting
        }
      })
          .catch((error)=>{
            console.error(error)
          })
    },
    createAgenda(){
      const agendas = this.$store.getters.agendaParagraphs.map((paragraph) =>{
        return {
          presenter: paragraph.assignedParticipant,
          timeInMinutes: paragraph.timeInMinutes,
          agenda:paragraph.paragraphText
        }
      })
      console.error(agendas)
      const data = {
        meetingId:this.createOrEditMeeting !== 'edit' ? this.meetingId : this.editableMeetingId,
        createdDate:'1402/10/15 09:40',
        createdBy:"John Doe",
        meetingName:'تست جلالی',
        purposeOfMeeting: this.$store.getters?.purposeOfMeeting,
        agendas: agendas,
        hasTiming:this.$store.getters.agendaHasTime
      }
      restClientAgenda.createAgenda(data).then(() => {
      }).catch((error) => {
        console.error(error)
      })
    },
    editAgenda(){
      const agendas = this.$store.getters.agendaParagraphs.map((paragraph) =>{
        return {
          presenter: paragraph.assignedParticipant,
          timeInMinutes: paragraph.timeInMinutes,
          agenda:paragraph.paragraphText,
          id:paragraph.paragraphId
        }
      })
      const data = {
        id:this.agendaId,
        meetingId:this.editableMeetingId,
        createdDate:'1402/10/15 09:40',
        createdBy:"John Doe",
        meetingName:'تست جلالی',
        purposeOfMeeting: this.$store.getters?.purposeOfMeeting,
        agendas: agendas,
        hasTiming:this.$store.getters.agendaHasTime
      }
      restClientAgenda.editAgenda(data).then(() => {
        console.log('agenda edited')
      }).catch((error) => {
        console.error(error)
      })


    },

    searchTenant() {
      const inpValue = this.searchedTenant;
      if (this.searchedTenant === "") {
        console.error('fooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooound')
        this.foundTenants = this.allTenants
      }else {
        this.foundTenants = this.allTenants.filter((el) => {
          if (
              el.tenantName.includes(inpValue)  && inpValue.length !== 0
          ) {
            return true;
          }
        });
      }

      // if (this.foundUsers.length > 0) {
      //   this.isUserFound = true;
      // }else{
      //   this.isUserFound = false;
      // }
      // this.groupIsFound = false
      // this.groupNameInput = ''
    },
    clickToChooseTenant(tenant){
      this.isTenantChosen = true
      this.chosenTenant = tenant.tenantName
      this.whichTenant = tenant
      this.getAllUsersTenantByCustomerId(this.whichTenant.id)
      console.error('whichhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
      console.error(this.whichTenant)
    },
    deleteChosenTenant(){
      this.isTenantChosen = false
      this.chosenTenant = ''
    },
    getAllUsersTenantByCustomerId(id){
      this.restClient.getAllGroupsTenantByCustomerId(id).then( (response)=>{
        for (const el of response) {
          this.listOfAllGroups.push({
            label: el.name,
            groupName: el.name,
            groupId: el.id,
            users: [],
          });
        }
      } ).catch((error) => {
        console.error(error)
      })
    },
  },
  mounted() {
    // const foundIndex  = this.allTenants.findIndex((el)=>{
    //   console.error('idddddddddddddddddddddddddddddddddddddddddddddddddddddddd')
    //   console.error()
    //   return +el.id === +this.$store.getters.customerId
    // })
    // if (foundIndex !== -1) {
    //   this.searchedTenant = this.allTenants[foundIndex].tenantName
    // }
    this.eventBus.on('agenda-id',(id)=>{
      this.agendaId = id
    })
    this.eventBus.on('create-label', (data) => {
      if (this.meetingLabelList.length === 4) {
        this.meetingLabelList[3] = data
      } else {
        this.meetingLabelList.push(data)
      }
    })
    this.eventBus.on('delete-label', (data) => {
      const index = this.meetingLabelList.findIndex((el) => {
        return el.label === data
      })
      if (index !== -1) {
        this.meetingLabelList.splice(index, 1)
      }
    })
    nextTick(() => {
      this.$refs['title-input'].focus()
      this.invitedUsersMaxHeight = (window.innerHeight - this.$refs.inviteUSer.getBoundingClientRect().bottom - 130) > 200 ? window.innerHeight - this.$refs.inviteUSer.getBoundingClientRect().bottom - 130 + 'px' : '200' + 'px'
      console.error(this.invitedUsersMaxHeight)
    })
    this.maxHeight = (window.innerHeight - this.$refs.groupSelector.getBoundingClientRect().bottom - 15) > 200 ? window.innerHeight - this.$refs.groupSelector.getBoundingClientRect().bottom - 15 + 'px' : '200' + 'px'
    window.addEventListener("resize", () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.$refs.groupSelector) {
          this.maxHeight = (window.innerHeight - this.$refs.groupSelector.getBoundingClientRect().bottom - 15) > 200 ? window.innerHeight - this.$refs.groupSelector.getBoundingClientRect().bottom - 15 + 'px' : '200' + 'px'
        }
        if (this.$refs.inviteUSer) {
          this.invitedUsersMaxHeight = (window.innerHeight - this.$refs.inviteUSer.getBoundingClientRect().bottom - 100) > 100 ? window.innerHeight - this.$refs.inviteUSer.getBoundingClientRect().bottom - 100 + 'px' : '100' + 'px'
        }

      }, 80);
    });

    this.minTime = momentJalali(new Date()).format('jYYYY/jMM/jDD HH:mm:ss')
    this.getRooms()
    if (this.createOrEditMeeting !== 'edit' ){
      this.getAllUsers()
      this.getAllGroups()
    }

  },


}
</script>

<style scoped>
.create-webinar__container {
  width: 145rem;
  height: 100%;
  padding: 1.6rem 2.4rem 0 2.4rem;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  direction: rtl;
  overflow-x: hidden;
  overflow-y: auto;
}

.create-webinar-header {
  width: 100%;
  height: 8rem;
  display: flex;
  justify-content: space-between;
}

.create-webinar__title {
  height: 80%;
  background-color: transparent;
  border: none;
  direction: rtl;
  font-size: 2.5rem;
  color: #292933;
  width: 55vw;
  border-radius: 0.8rem;
}

.create-webinar__title::placeholder {
  color: #75758F;
  font-size: 2.5rem;
}

.create-webinar__title:focus {
  outline: none;
}

.fade-image {
  animation: fadeIn 1s;
}
.choose-room-selector-container {
  width:48rem
}
.meeting-type-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 18rem;
  justify-content: space-between;
  height: 5.8rem;
  gap: 0.8rem;
}

.meeting-type-notice {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 16rem;
  justify-content: space-between;
  height: 5.8rem;
  gap: 0.8rem;
}

.meeting-type-password {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 15rem;
  justify-content: space-between;
  height: 5.8rem;
  gap: 0.8rem;
}

.meeting-type-entrance-permission {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 23.6rem;
  justify-content: space-between;
  height: 5.8rem;
  gap: 0.8rem;
}

#custom-input-start {
  width: 24.7rem;
  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
}

#custom-input-start:focus {
  outline: none;
}

#custom-input-end {
  width: 24.7rem;
  height: 3.2rem;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;
  direction: rtl;
  padding: 0 0.8rem;
}

#custom-input-end:focus {
  outline: none;
}

.separate-info {
  width: 100%;
  margin: 0 auto;
  border: 0.1rem solid #F6F6F7;
}

.separate-info-large {
  width: 100%;
  margin: 0 auto;
  border: 0.3rem solid #F6F6F7;
}

.column-separate-info {
  width: 0;
  height: 5rem;
  margin: auto 0;
  border: 0.1rem solid #F6F6F7;
}
.column-separate-info-tenant{
  display: none;
}
.create-webinar-set-time {
  width: 100%;
  height: 10rem;
  display: flex;
  gap: 2.4rem;
  align-items: center;
  padding: 2rem 0;
}

.create-webinar-set-time-items {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.create-webinar-body {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 2.2rem;
}

.column-seprator-large {
  width: 0;
  height: calc(100vh - 26.5rem);
  margin: auto 0;
  border: 0.3rem solid #F6F6F7;
  position: relative;
  top: -1rem;
}

.entrancePassword {
  width: 100%;
  background-color: #F6F6F7;
  border-radius: 0.8rem;
  height: 3.2rem;
  direction: rtl;
  border: none;
  padding: 0 0.8rem;
}

.entrancePassword:focus {
  outline: none;
  background-color: white;
  border: 0.1rem solid #DCDADA;
}

.meeting-description-input {
  width: 100%;
  background-color: #F6F6F7;
  border-radius: 0.8rem;
  height: 8rem;
  direction: rtl;
  border: none;
  padding: 0.8rem;
}

.meeting-description-input:focus {
  outline: none;
  background-color: white;
  border: 0.1rem solid #DCDADA;
}

.meeting-description-input::placeholder {
  color: #9E9EB2;
}

.agenda-description-input {
  width: 100%;
  background-color: #F6F6F7;
  border-radius: 0.8rem;
  height: 8rem;
  direction: rtl;
  border: none;
  padding: 0.8rem;
}

.agenda-description-input:focus {
  outline: none;
  background-color: white;
  border: 0.1rem solid #DCDADA;
}

.agenda-description-input::placeholder {
  color: #9E9EB2;
}

.meeting-link-input {
  font-size: 1.4rem;
  width: 40rem;
  border: none;
  padding: 0 0 0 1rem;
}

.meeting-link-input:focus {
  outline: none;
  direction: ltr;
  border: 0.1rem solid #DCDADA;
}

.moderator-chosen {
  width: 100%;
  height: 3.2rem;
  direction: rtl;
  padding-right: 0.5rem;
  position: relative;

}

.moderator-chosen-input {
  border: none;
  background-color: transparent;
  height: 3.2rem;
  width: 100%;
  right: 0;
  padding: 0 0.8rem;
  direction: rtl;
}

.moderator-chosen-input:focus {
  outline: none;
}

.found-users-container {
  width: 100%;
  max-height: 20rem;
  overflow-y: auto;
  direction: rtl;
  padding: 0 0 0.8rem 0;
}

.found-user-invite-list {
  width: 100%;
  height: 3rem;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 400;
  color: #75758F;
}

.found-user-invite-list:hover {
  background-color: #F2F2F2;
  border: 0.1rem solid transparent;
  border-radius: 0.8rem;

}

.cancel-btn-date-picker:hover {
  background-color: transparent;
}

.invite-user-container {
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2.4rem;
}

.invite-user-element {
  display: flex;
  flex-direction: column;
  height: 5rem;
  justify-content: space-between;
  width: 100%;
  position: relative;
  gap: 0.8rem;
}

.invite-user-element-input-container {
  width: 100%;
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.choose-moderator-container {
  display: flex;
  flex-direction: column;
  height: 5rem;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  width: 100%;
  gap: 0.8rem;
}

.choose-moderator-input {
  width: 100%;
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 0 0.8rem;
}

.invited-table-display-name {
  width: 30%;
  display: flex;
  justify-content: right;
  padding: 0.8rem 0;
  font-size: 1.2rem;
  font-weight: 400;
  gap: 0.8rem;
  align-items: center;
}

.invited-table-user-name {
  width: 30%;
  display: flex;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 400;
}

.invited-table-close-action {
  width: 30%;
  display: flex;
  justify-content: left;
  padding: 0.8rem 0;
}


.meeting-types-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  direction: rtl;
  gap: 2.4rem;
  padding: 1rem 0;
}


.create-webinar-body-meeting-info {
  width: 90rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0.8rem 0;
}
.separate-info-large__column{
  width: 0;height:100%;border: 0.3rem solid #F6F6F7;
}

.create-webinar-body-invite-info {
  width: calc(100% - 92rem);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  position: relative;
  padding: 2rem 0 0 0;
}
.choose-moderator-container__fragment{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.create-webinar-body-meeting-info__link {
  display: flex;
  flex-direction: column;
  height: 5rem;
  justify-content: space-between;
  align-items: flex-end;
}

.create-webinar-body-meeting-info__link--input-container {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
  width: 54rem;
  background-color: #F6F6F7;
  padding: 1.6rem;
  border-radius: 0.8rem;
}

.edit-meeting-body-meeting-info__link{
  display: flex;
  width: 100%;
  flex-direction: column;
  direction: rtl;
  align-items: flex-start;
  gap: 0.8rem;
}
.edit-meeting-body-meeting-info__link--input-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  width: 54rem;
  background-color: #F6F6F7;
  padding: 1.6rem;
  border-radius: 0.8rem;
}
.create-webinar-action{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 1.6rem;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.show-link-modal__header {
  width: 100%;
  direction: rtl;
}

@media (max-width: 1450px) {
  .create-webinar__container {
    width: 100vw;

  }
  .invited-table-display-name {
    width: 45%;
    display: flex;
    justify-content: right;
    padding: 0.8rem;
    font-size: 1.2rem;
    font-weight: 400;
    gap: 0.8rem;
    align-items: center;
  }

  .invited-table-user-name {
    width: 40%;
    display: flex;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: 400;
  }

  .invited-table-close-action {
    width: 15%;
    display: flex;
    justify-content: left;
    padding: 0.8rem;
  }

}

@media (max-width: 1380px) {
  .meeting-types-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    direction: rtl;
    gap: 2.4rem;
  }
  .create-webinar-body-meeting-info {
    width: 70rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 0.8rem 0;
  }

  .meeting-type-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 17rem;

  }

  .meeting-type-notice {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 15rem;
  }

  .meeting-type-password {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 17.4rem;
    justify-content: space-between;
    height: 5.8rem;
  }


  .create-webinar-body-meeting-info__link--input-container {
    width: 100%;
  }

  .meeting-link-input {
    font-size: 1.3rem;
    width: 37rem;
    border: none;
    padding: 0 0 0 1rem;
  }
  .column-separate-info-password{
    display: none;
  }
  .column-separate-info-tenant{
    display: none;
  }
  .meeting-type-label {
    width: 24.7rem;
  }

  .meeting-type-notice {
    width: 24.7rem;
  }

  .meeting-type-password {
    width: 24.7rem;

  }

  .meeting-type-entrance-permission {
    width: 24.7rem;

  }
  .create-webinar-body-invite-info{
    width: calc(100% - 72rem) ;
  }
}

@media (max-width: 1200px) {
  .create-webinar-body-meeting-info {
    width: 60vw;
  }

  .meeting-types-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    direction: rtl;
    gap: 2.4rem;
  }

  .meeting-type-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 17rem;

  }

  .meeting-type-notice {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 15rem;

  }

  .meeting-type-password {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 17.4rem;
    justify-content: space-between;
    height: 5.8rem;
  }

  .create-webinar-body-meeting-info__link--input-container {
    width: 50rem;
  }

  .meeting-link-input {
    font-size: 1.3rem;
    width: 35rem;
    border: none;
    padding: 0 0 0 0;
  }
  .meeting-type-label {
    width: 24.7rem;
  }

  .meeting-type-notice {
    width: 24.7rem;
  }

  .meeting-type-password {
    width: 24.7rem;

  }

  .meeting-type-entrance-permission {
    width: 24.7rem;

  }
  .create-webinar-body-invite-info{
    width:40vw;
  }

}

@media (max-width: 1024px) {
  .create-webinar__container{
    height: calc(100% + 15rem);
  }

  .create-webinar-header {
    width: 100%;
    height: 8rem;
    display: flex;
    justify-content: space-between;
    padding: 0 0 1rem 0;
  }

  .column-separate-info-entrance {
    display: block;
  }

  .column-separate-info {
    margin: 0;
  }

  .create-webinar-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .create-webinar-body-meeting-info {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem 0;
    border-left: none;
    border-bottom: 0.6rem solid #F6F6F7;
  }

  .create-webinar-body-invite-info {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem 0;
    position: relative;
  }

  .column-seprator-large {
    width: 98vw;
    height: 0;
    margin: 0 auto;
    border: 0.3rem solid #F6F6F7;
  }

  .create-webinar__title {
    height: 80%;
    font-size: 2.8rem;
    width: 45vw;
  }

  .create-webinar__title::placeholder {
    font-size: 2.8rem;
  }
  .column-separate-info-password{
    display: block;
  }
  .column-separate-info-entrance{
    display: none;
  }
  .column-separate-info-tenant{
    display: block;
  }

  .meeting-type-label {
    width: 24.7rem;
  }

  .meeting-type-notice {
    width: 24.7rem;
  }

  .meeting-type-password {
    width: 24.7rem;

  }

  .meeting-type-entrance-permission {
    width: 24.7rem;

  }
  .separate-info-large__column{
    display: none;
  }
  .choose-moderator-container {
    align-items: flex-start;
    width: 100%;
  }
  .choose-moderator-container__fragment{
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 2.4rem;
  }
}
@media (max-width: 893px) {
  .column-separate-info-password{
    display: block;
    border-color:transparent ;
  }
  .column-separate-info-entrance{
    display: block;
  }
  .column-separate-info-tenant{
    display: block;
    border-color:transparent ;
  }
}

@media (max-width: 695px) {
  .create-webinar-header {
    flex-direction: column !important;
    gap: 2rem;
    height: fit-content;
  }

  .create-webinar-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
  }

  .meeting-types-container {
    width: 100%;
    direction: rtl;
  }

  .column-separate-info {
    display: none;
  }

  .create-webinar-body-meeting-info {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem 0;
  }

  .create-webinar-body-invite-info {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem 0;
    position: relative;
  }

  .column-seprator-large {
    width: 98vw;
    height: 0;
    margin: 0 auto;
    border: 0.3rem solid #F6F6F7;
  }

  .create-webinar__title {
    height: 80%;
    font-size: 2.5rem;
    width: 45vw;
  }

  .create-webinar__title::placeholder {
    font-size: 2.5rem;
  }

  .column-separate-info-meeting-date-display-none {
    display: none;
  }

  .create-webinar-set-time {
    width: 100%;
    height: 14rem;
    display: flex;
    gap: 2rem;
    align-items: flex-end;
  }

}

@media (max-width: 565px) {
  .create-webinar-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .create-webinar-body-meeting-info {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem 0;
  }

  .create-webinar-body-invite-info {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem 0;
    position: relative;
  }

  .column-seprator-large {
    width: 98vw;
    height: 0;
    margin: 0 auto;
    border: 0.3rem solid #F6F6F7;
  }

  .create-webinar__title {
    height: 80%;
    font-size: 2.5rem;
    width: 45vw;
  }

  .create-webinar__title::placeholder {
    font-size: 2.5rem;
  }

  .column-separate-info-meeting-date-display-none {
    display: none;
  }

  .create-webinar-set-time {
    width: 100%;
    height: 17rem;
    display: flex;
    flex-direction: column !important;
    gap: 2rem;
    align-items: flex-start;
  }

  .create-webinar-body-meeting-info__link--input-container {
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
    justify-content: space-between;
    height: 5rem;
    width: 45rem;
    background-color: #F6F6F7;
    padding: 1.6rem;
  }

  .meeting-link-input {
    font-size: 1.2rem;
    width: 32.5rem;
    border: none
  }
  .choose-moderator-container__fragment{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }
  .choose-moderator-container {
    align-items: flex-start;
    width: 100%;
  }
  .choose-room-selector-container {
    width:90%;
  }
}

@media (max-width: 500px) {
  .create-webinar-header {
    width: 100%;
    height: 15rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .create-webinar__title {
    height: 80%;
    background-color: transparent;
    border: none;
    direction: rtl;
    font-size: 2.5rem;
    color: #292933;
    width: 90vw;
  }

  .create-webinar__title::placeholder {
    color: #75758F;
    font-size: 2.5rem;
  }

  .create-webinar-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .create-webinar-body-meeting-info {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem 0;
  }

  .create-webinar-body-invite-info {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem 0;
    position: relative;
  }

  .column-seprator-large {
    width: 98vw;
    height: 0;
    margin: 0 auto;
    border: 0.3rem solid #F6F6F7;
  }

  .column-separate-info-meeting-date-display-none {
    display: none;
  }

  .create-webinar-body-meeting-info__link--input-container {
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
    justify-content: space-between;
    height: 5rem;
    width: 45rem;
    background-color: #F6F6F7;
    padding: 1.6rem;
  }

  .meeting-link-input {
    font-size: 1.2rem;
    width: 32.5rem;
    border: none
  }
}
</style>

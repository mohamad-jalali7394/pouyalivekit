<template>
  <div
      ref="footer-container"
      class="conference-footer"
  >
    <transition>
      <div class="toggle-button__shape" v-if="!isToggled && isMobile && showToggleButton && isScreenTouched"
           @click="ToggleToolBarInMobile">
        <div class="border--shape__toggle-button"></div>
        <img draggable="false"
             alt="not loaded"
             src="/img/chevron.svg"
        />
      </div>
    </transition>
    <transition>
      <div v-if="isToggled && isMobile && showToggleButton && isScreenTouched"
           class="toggle-button__shape"
           @click="ToggleToolBarInMobile">
        <div class="border--shape__toggle-button"></div>
        <img draggable="false"
             alt="not loaded"
             src="/img/chevron.svg"
             style="rotate: 180deg;"
        />
      </div>
    </transition>

    <div v-if="!isMobile" class="conference-footer__meeting-title">
      <div style="display: block;right: 1.7rem;max-width: 15rem;  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;">
        <span> {{ meetingTitle }}</span>
      </div>

      <div v-if="!$store.getters.isPrivate && !amIGuestUser">
        <!--        <img draggable="false" src="/img/chevron-u.svg" style="cursor: pointer" @click="showMeetingDetails" alt="not-loaded">-->
        <div style="display: flex;align-items: center;gap: 0.5rem">
          <span>{{ $store.getters.fromSchd.from }}</span>
          <span>{{ ' ' + 'تا' + ' ' }}</span>
          <span>{{ $store.getters.toSchd.to }}</span>
        </div>
        <span class="column-separator"></span>
        <div style="direction: rtl;display: flex;align-items: center;gap: 0.5rem">
          <span>{{ $store.getters.fromSchd.dayName }}</span>
          <span>{{ $store.getters.fromSchd.dayNum }}</span>
          <span>{{ $store.getters.fromSchd.monthName }}</span>
        </div>
      </div>

    </div>
    <div class="conference-footer__control-meeting">
      <div
          v-if="!amIGuestUser"
          v-show="(((amIModerator || isModeratorSubstituteActivated) && $store.getters.hasModerator) || !$store.getters.hasModerator && !isGuest ) && !isMeetingInRecordingMode "
          class="control-icon-fragment control-icon-fragment"
          @click="controlMeetingHandler('record', 'start')"
          @mouseenter="showTooltip($store.getters.t('record-meeting'))"
          @mouseleave="hideTooltip($store.getters.t('record-meeting'))"
      >
        <base-tool-tip :is-hovered="isRecordMeetingHoverd">{{
            $store.getters.t("record-meeting")
          }}
        </base-tool-tip>
        <img draggable="false"
             alt="not loaded"
             src="/img/record.svg"
             style="cursor: pointer"
        />
      </div>

      <div
          v-if="!amIGuestUser"
          v-show="(((amIModerator || isModeratorSubstituteActivated) && $store.getters.hasModerator) || !$store.getters.hasModerator && !isGuest )&& isMeetingInRecordingMode"
          class="control-icon-fragment control-icon-fragment"
          @click="controlMeetingHandler('record', 'end')"
          @mouseenter="showTooltip($store.getters.t('record-meeting'))"
          @mouseleave="hideTooltip($store.getters.t('record-meeting'))"
      >
        <base-tool-tip :is-hovered="isRecordMeetingHoverd">{{
            $store.getters.t("record-meeting")
          }}
        </base-tool-tip>
        <img draggable="false"
             alt="not loaded"
             src="/img/record-end.svg"
             style="cursor: pointer"
             class="animated-recording-icon"
        />
      </div>
      <div
          v-show="(!screenShareAllowed && roomHasModerator) && !isMobile"
          class="control-icon-fragment control-icon-fragment--disabled"
      >
        <base-tool-tip :is-hovered="isShareHovered">{{
            $store.getters.t("disallow-share")
          }}
        </base-tool-tip>
        <img draggable="false" style="cursor: not-allowed" src="/img/share-disable.svg" alt="not loaded"/>
      </div>
      <div
          v-show="
         ((( screenShareAllowed && ((!shareStatus && !videoShareStatus)) ) || (!roomHasModerator && !shareStatus && !videoShareStatus) )  && !isMobile)
                 "
          class="control-icon-fragment-with-setting"
          style="cursor: pointer"
          ref="shareDropDown"
          @mouseenter="showTooltip($store.getters.t('share'))"
          @mouseleave="hideTooltip($store.getters.t('share'))"
      >
        <chevron-up  style="cursor: pointer;" color="#1B76FF"></chevron-up>
        <base-tool-tip :is-hovered="isShareHovered && !dropDownShare.flag ">{{
            $store.getters.t("share")
          }}
        </base-tool-tip>
        <base-mini-drop-down
            :items="ShareDropDownItems"
            :open="dropDownShare.flag"
            direction-x="middle"
            direction-y="upward"
            @select-item="getSelectedItemShareDropDown"
        ></base-mini-drop-down>
        <img draggable="false" src="/img/share-off.svg" alt="not loaded"/>
      </div>
      <div
          v-show="
         ((( (screenShareAllowed || !roomHasModerator) && ((shareStatus || videoShareStatus)) ) )  && !isMobile)
                 "
          class="control-icon-fragment-with-setting"
          style="background-color: #1B76FF;cursor: pointer"
          @click="controlMeetingHandler('end-share')"
          @mouseenter="showTooltip($store.getters.t('end-share'))"
          @mouseleave="hideTooltip($store.getters.t('end-share'))"
      >
        <chevron-up style="cursor: pointer;" color="white"  ></chevron-up>
        <base-tool-tip :is-hovered="isShareHovered">{{$store.getters.t("end-share") }}
        </base-tool-tip>
        <img draggable="false" src="/img/share-on.svg" alt="not loaded"/>
      </div>

      <div
          v-if="roomHasModerator ? (!amIModerator && !isModeratorSubstituteActivated) : false "
      >
        <div
            v-if="!amIModerator && !isModeratorSubstituteActivated"
            v-show="!isModeratorJoined"
            class="control-icon-fragment control-icon-fragment--disabled"
        >
          <img draggable="false"
               alt="not loaded"
               src="/img/hand-raise-disable.svg"
               style="cursor: not-allowed"
          />
        </div>
        <div
            v-if="!amIModerator && !isModeratorSubstituteActivated "
            v-show="isModeratorJoined && handStatus === 'none'"
            class="control-icon-fragment"
            @click="controlMeetingHandler('hand-raise', 'none')"
            @mouseenter="showTooltip($store.getters.t('hand-raise'))"
            @mouseleave="hideTooltip($store.getters.t('hand-raise'))"
        >
          <base-tool-tip :is-hovered="isHandRaiseHovered">{{
              $store.getters.t("hand-raise")
            }}
          </base-tool-tip>
          <img draggable="false"
               alt="not loaded"
               class="hand-raise-icon__disable"
               src="/img/hand-raise.svg"
          />
        </div>
        <div
            v-if="!amIModerator && !isModeratorSubstituteActivated"
            v-show="isModeratorJoined && handStatus === 'waiting'"
            class="control-icon-fragment"
            @click="controlMeetingHandler('hand-raise', 'waiting')"
            @mouseenter="showTooltip($store.getters.t('hand-down'))"
            @mouseleave="hideTooltip($store.getters.t('hand-down'))"
        >
          <base-tool-tip :is-hovered="isHandRaiseHovered">{{
              $store.getters.t("hand-down")
            }}
          </base-tool-tip>
          <img draggable="false"
               alt="not loaded"
               style="width: 21px;height: 21px;position: relative;top: 2px"
               class="hand-raise-icon__disable"
               src="/img/hand-raise-waiting.svg"
          />
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div
            v-if="!amIModerator && !isModeratorSubstituteActivated"
            v-show="isModeratorJoined && handStatus === 'granted'"
            class="control-icon-fragment"
        >
          <img draggable="false" src="\img\hand-raise-granted.svg" alt="nor-loaded" style="width: 21px;height: 21px">
        </div>
      </div>
      <div
          v-show="(!micControlAllowed && roomHasModerator)"
          class="control-icon-fragment control-icon-fragment--disabled"
          @mouseenter="showTooltip($store.getters.t('mic-disallowed'))"
          @mouseleave="hideTooltip($store.getters.t('mic-disallowed'))"
      >
        <base-tool-tip :is-hovered="isMicHovered">{{
            $store.getters.t("mic-disallowed")
          }}
        </base-tool-tip>
        <img draggable="false" alt="not loaded" src="/img/mic-disable.svg" style="cursor: not-allowed"/>
      </div>

      <div
          v-show="(micControlAllowed || !roomHasModerator) && !micStatus"
          class="control-icon-fragment-with-setting"
          :style="{backgroundColor: (micControlAllowed || !roomHasModerator) && !micStatus ? '#EC3737' : ''}"
      >
        <base-tool-tip
            :is-hovered="isMicSettingHovered"
        >{{ $store.getters.t('microphone-setting') }}
        </base-tool-tip>
        <chevron-up style="cursor: pointer;" color="white" @mouseenter="showTooltip($store.getters.t('microphone-setting'))"
                    @mouseleave="hideTooltip($store.getters.t('microphone-setting'))" @click="controlMeetingHandler('microphone_setting')"></chevron-up>
        <base-tool-tip :is-hovered="isMicHovered">{{
            $store.getters.t("microphone")
          }}
        </base-tool-tip>
        <microphone-icon style="cursor: pointer;" color="white" :mic-status="false" @mouseenter="showTooltip($store.getters.t('microphone'))"
                         @mouseleave="hideTooltip($store.getters.t('microphone'))" @click="controlMeetingHandler('microphone', true)"
        ></microphone-icon>

      </div>

      <div
          v-show="(micControlAllowed || !roomHasModerator) && micStatus"
          class="control-icon-fragment-with-setting"
      >
        <base-tool-tip
            :is-hovered="isMicSettingHovered"
        >{{ $store.getters.t('microphone-setting') }}
        </base-tool-tip>
        <chevron-up style="cursor: pointer;" color="#1B76FF" @mouseenter="showTooltip($store.getters.t('microphone-setting'))"
                    @mouseleave="hideTooltip($store.getters.t('microphone-setting'))" @click="controlMeetingHandler('microphone_setting')"></chevron-up>
        <base-tool-tip :is-hovered="isMicHovered">{{
            $store.getters.t("microphone")
          }}
        </base-tool-tip>
        <microphone-icon style="cursor: pointer;" color="#1B76FF" :mic-status="true" @mouseenter="showTooltip($store.getters.t('microphone'))"
                         @mouseleave="hideTooltip($store.getters.t('microphone'))"  @click="controlMeetingHandler('microphone', false)"></microphone-icon>
      </div>
      <div
          v-show="!cameraControlAllowed"
          class="control-icon-fragment control-icon-fragment--disabled"
          @mouseenter="showTooltip($store.getters.t('camera-disallowed'))"
          @mouseleave="hideTooltip($store.getters.t('camera-disallowed'))"
      >
        <base-tool-tip :is-hovered="isCameraHovered">{{
            $store.getters.t("camera-disallowed")
          }}
        </base-tool-tip>
        <img draggable="false"
             alt="not loaded"
             src="/img/camera-disable.svg"
             style="cursor: not-allowed"
        />
      </div>

      <div
          v-show="cameraControlAllowed && !cameraStatus && !isMobile"
          class="control-icon-fragment-with-setting"
          :style="{backgroundColor: cameraControlAllowed && !cameraStatus   ? '#EC3737' : ''}"

      >
        <base-tool-tip
            :is-hovered="isCameraSettingHovered"
        >{{ $store.getters.t('camera-setting') }}
        </base-tool-tip>
        <chevron-up style="cursor: pointer;" color="white" @mouseenter="showTooltip($store.getters.t('camera-setting'))"
                    @mouseleave="hideTooltip($store.getters.t('camera-setting'))" @click="controlMeetingHandler('camera_setting')"></chevron-up>
        <base-tool-tip :is-hovered="isCameraHovered">{{
            $store.getters.t("camera")
          }}
        </base-tool-tip>
        <camera-icon style="cursor: pointer;" color="white" video-length="60%" :camera-status="false" @mouseenter="showTooltip($store.getters.t('camera'))"
                     @mouseleave="hideTooltip($store.getters.t('camera'))" @click="controlMeetingHandler('camera', true)"></camera-icon>
      </div>

      <div
          v-show="cameraControlAllowed && !cameraStatus && isMobile"
          class="control-icon-fragment"
          :style="{backgroundColor: cameraControlAllowed && !cameraStatus   ? '#EC3737' : ''}"

      >
        <base-tool-tip :is-hovered="isCameraHovered">{{
            $store.getters.t("camera")
          }}
        </base-tool-tip>
        <camera-icon style="cursor: pointer;" color="white" video-length="60%" :camera-status="false" @mouseenter="showTooltip($store.getters.t('camera'))"
                     @mouseleave="hideTooltip($store.getters.t('camera'))" @click="controlMeetingHandler('camera', true)"></camera-icon>
      </div>

      <div
          v-show="cameraControlAllowed && cameraStatus && !isMobile"
          class="control-icon-fragment-with-setting"
      >
        <base-tool-tip
            :is-hovered="isCameraSettingHovered"
        >{{ $store.getters.t('camera-setting') }}
        </base-tool-tip>
        <chevron-up style="cursor: pointer;" color="#1B76FF" @mouseenter="showTooltip($store.getters.t('camera-setting'))"
                    @mouseleave="hideTooltip($store.getters.t('camera-setting'))" @click="controlMeetingHandler('camera_setting')"></chevron-up>
        <base-tool-tip :is-hovered="isCameraHovered">{{
            $store.getters.t("camera")
          }}
        </base-tool-tip>
        <camera-icon style="cursor: pointer;" color="#1B76FF"  :camera-status="true" @mouseenter="showTooltip($store.getters.t('camera'))"
                     @mouseleave="hideTooltip($store.getters.t('camera'))"   @click="controlMeetingHandler('camera', false)"></camera-icon>
      </div>


      <div
          v-show="cameraControlAllowed && cameraStatus && isMobile"
          class="control-icon-fragment"
          :style="{backgroundColor: cameraControlAllowed && !cameraStatus   ? '#EC3737' : ''}"

      >
        <base-tool-tip :is-hovered="isCameraHovered">{{
            $store.getters.t("camera")
          }}
        </base-tool-tip>
        <camera-icon style="cursor: pointer;" color="#1B76FF"  :camera-status="true" @mouseenter="showTooltip($store.getters.t('camera'))"
                     @mouseleave="hideTooltip($store.getters.t('camera'))"   @click="controlMeetingHandler('camera', false)"></camera-icon>
      </div>

      <div
          v-if="!isMobile"
          class="control-icon-fragment"
          @click="controlMeetingHandler('changeLayout')"
          @mouseenter="showTooltip($store.getters.t('change-layout'))"
          @mouseleave="hideTooltip($store.getters.t('change-layout'))"
      >
        <base-tool-tip :is-hovered="isChangeLayoutHovered">{{
            $store.getters.t("change-layout")
          }}
        </base-tool-tip>
        <div
            style="width: 3rem;height: 3rem;display: flex;flex-direction: column;gap: 0.1rem;justify-content: center;align-items: center">
          <div
              style="display: flex;flex-direction: row;gap: 0.1rem;justify-content: center;align-items: center;width: 2.6rem">
            <div style="width: 1rem;height: 1rem;border: 0.2rem solid #1B76FF;border-radius: 2px"></div>
            <div style="width: 1rem;height: 1rem;border: 0.2rem solid #1B76FF;border-radius: 2px"></div>
          </div>
          <div
              style="display: flex;flex-direction: row;gap: 0.1rem;justify-content: center;align-items: center;width: 2.6rem">
            <div style="width: 1rem;height: 1rem;border: 0.2rem solid #1B76FF;border-radius: 2px"></div>
            <div style="width: 1rem;height: 1rem;border: 0.2rem solid #1B76FF;border-radius: 2px"></div>
          </div>

        </div>
      </div>

      <div class="leave-icon" @click="controlMeetingHandler('leave', true)">
        <img draggable="false" alt="not loaded" src="/img/leave-meeting.svg"/>
      </div>
<!--      <div-->
<!--          v-if=" (amIGuestUser || !roomHasModerator) && !isMobile"-->
<!--          ref="more-drop-down-container-participant"-->
<!--          class="control-icon-fragment"-->
<!--      >-->
<!--        <base-tool-tip :is-hovered="isChaneDeviceHovered">{{-->
<!--            $store.getters.t("change-devices")-->
<!--          }}-->
<!--        </base-tool-tip>-->
<!--        <base-mini-drop-down-->
<!--            :items="moreDropDownItemsForParticipant"-->
<!--            :open="moreDropDown.flag"-->
<!--            direction-x="middle"-->
<!--            direction-y="upward"-->
<!--            @select-item="getSelectedItemInMoreDropDown"-->
<!--        ></base-mini-drop-down>-->
<!--        <span-->
<!--            class="options"-->
<!--            @mouseenter="showTooltip($store.getters.t('more'))"-->
<!--            @mouseleave="hideTooltip($store.getters.t('more'))"-->
<!--        >-->
<!--           <img draggable="false" src="/img/more.svg" alt="not loaded"/>-->
<!--        </span>-->
<!--      </div>-->
<!--      <div-->
<!--          v-else-if="(amIGuestUser || !roomHasModerator || (!amIModerator && !isModeratorSubstituteActivated) ) && isMobile"-->
<!--          ref="more-drop-down-container-participant"-->
<!--          class="control-icon-fragment"-->
<!--      >-->
<!--        <base-tool-tip v-if="!moreDropDown.flag" :is-hovered="isChaneDeviceHovered">{{-->
<!--            $store.getters.t("change-devices")-->
<!--          }}-->
<!--        </base-tool-tip>-->
<!--        <base-mini-drop-down-->
<!--            :items="moreDropDownItemsForParticipantMobile"-->
<!--            :open="moreDropDown.flag"-->
<!--            direction-x="middle"-->
<!--            direction-y="upward"-->
<!--            @select-item="getSelectedItemInMoreDropDownParticipantMobile"-->
<!--        ></base-mini-drop-down>-->
<!--        <span-->
<!--            class="options"-->
<!--            @mouseenter="showTooltip($store.getters.t('change-devices'))"-->
<!--            @mouseleave="hideTooltip($store.getters.t('change-devices'))"-->
<!--        >-->
<!--           <img draggable="false" src="/img/more.svg" alt="not loaded"/>-->
<!--        </span>-->
<!--      </div>-->



      <div
          v-if="(amIModerator || isModeratorSubstituteActivated) && roomHasModerator && !isMobile"
          ref="more-drop-down-container"
          class="control-icon-fragment"
          @mouseenter="showTooltip($store.getters.t('more'))"
          @mouseleave="hideTooltip($store.getters.t('more'))"
      >
        <base-tool-tip v-if="!moreDropDown.flag" :is-hovered="isMoreOptionsHovered">{{
            $store.getters.t("more")
          }}
        </base-tool-tip>
        <base-mini-drop-down
            :items="moreDropDownItems"
            :open="moreDropDown.flag"
            direction-x="middle"
            direction-y="upward"
            @select-item="getSelectedItemInMoreDropDown"
        ></base-mini-drop-down>
        <img draggable="false" src="/img/more.svg" alt="not loaded"/>
      </div>
      <div
          v-else-if="amIModerator && !roomHasModerator && !isMobile"
          ref="more-drop-down-container"
          class="control-icon-fragment"
          @mouseenter="showTooltip($store.getters.t('more'))"
          @mouseleave="hideTooltip($store.getters.t('more'))"
      >
        <base-tool-tip v-if="!moreDropDown.flag" :is-hovered="isMoreOptionsHovered">{{
            $store.getters.t("more")
          }}
        </base-tool-tip>
        <base-mini-drop-down
            :items="moreDropDownItemsWithoutModerator"
            :open="moreDropDown.flag"
            direction-x="middle"
            direction-y="upward"
            @select-item="getSelectedItemInMoreDropDown"
        ></base-mini-drop-down>
        <img draggable="false" src="/img/more.svg" alt="not loaded"/>
      </div>
<!--      <div-->
<!--          v-if="(!roomHasModerator && !isGuest) && isMobile"-->
<!--          ref="more-drop-down-container"-->
<!--          class="control-icon-fragment"-->
<!--          @mouseenter="showTooltip($store.getters.t('more'))"-->
<!--          @mouseleave="hideTooltip($store.getters.t('more'))"-->
<!--      >-->
<!--        <base-tool-tip v-if="!moreDropDown.flag" :is-hovered="isMoreOptionsHovered">{{-->
<!--            $store.getters.t("more")-->
<!--          }}-->
<!--        </base-tool-tip>-->
<!--        <base-mini-drop-down-->
<!--            :items="moreDropDownItemsWithoutModeratorInMobile"-->
<!--            :open="moreDropDown.flag"-->
<!--            direction-x="middle"-->
<!--            direction-y="upward"-->
<!--            @select-item="getSelectedItemInMoreDropDownWithoutModeratorInMobile"-->
<!--        ></base-mini-drop-down>-->
<!--        <img draggable="false" src="/img/more.svg" alt="not loaded"/>-->
<!--      </div>-->
      <div
          v-show="(amIModerator || isModeratorSubstituteActivated) && isMobile"
          ref="more-drop-down-container-mobile"
          class="control-icon-fragment"
      >
        <base-mini-drop-down
            :items="moreDropDownItemsForModeratorInMobile"
            :open="moreDropDown.flag"
            direction-x="middle"
            direction-y="upward"
            @select-item="getSelectedItemInMoreDropDownMobileModerator"
        ></base-mini-drop-down>
        <more-icon></more-icon>
      </div>
      <div
          v-show="(!amIModerator && !isModeratorSubstituteActivated) && isMobile"
          ref="more-drop-down-container-participant-mobile"
          class="control-icon-fragment"
      >
        <base-mini-drop-down
            :items="moreDropDownItemsForParticipantMobile"
            :open="moreDropDown.flag"
            direction-x="middle"
            direction-y="upward"
            @select-item="getSelectedItemInMoreDropDownParticipantMobile"
        ></base-mini-drop-down>
        <more-icon></more-icon>
      </div>
    </div>
    <div>
      <div
          v-if="!isMobile"
          style="width: 3.6rem;height: 3.6rem;border-radius: 50%; display: flex;justify-content: center;align-items: center;position: relative;bottom: 0.2rem"
          :style="{backgroundColor: isMyVideoStreamDisplayed ? '#1B76FF' : 'white'}"
          @mouseenter="showTooltip($store.getters.t('selfView'))"
          @mouseleave="hideTooltip($store.getters.t('selfView'))"
      >
        <base-tool-tip :is-hovered="isSelfViewHovered">{{
            $store.getters.t("selfView")
          }}
        </base-tool-tip>
        <img
            v-show="!isMyVideoStreamDisplayed"
            draggable="false"
             alt="not loaded"
             src="/img/selfView-off.svg"
            style="width: 3rem"
             @click="controlSideBarHandler('selfView', 'on')"
        />
        <img
            v-show="isMyVideoStreamDisplayed"
            draggable="false"
             alt="not loaded"
             src="/img/selfView-on.svg"
            style="width: 3rem"
             @click="controlSideBarHandler('selfView', 'off')"
        />
      </div>
      <div
          v-if="
          (amIModerator) && isMobile === false"
          ref="drop-down-container-polling"
          style="cursor: pointer; position: relative;"

      >
        <!--        <base-mini-drop-down-->
        <!--            :items="dropDownItemsPolling"-->
        <!--            :open="dropDownPolling.flag"-->
        <!--            direction-x="middle"-->
        <!--            direction-y="upward"-->
        <!--            @select-item="getSelectedItemPolling"></base-mini-drop-down>-->
        <div v-if="isRegisteredAllPolling" class="notification-badge">
          <div></div>
        </div>
        <img draggable="false"
             v-if="sideBarInterior !== 'polling'"
             alt="not loaded"
             src="/img/polling-off.svg"
             @mouseenter="showTooltip($store.getters.t('create-minutes'))"
             @mouseleave="hideTooltip($store.getters.t('create-minutes'))"
             @click="controlSideBarHandler('polling', 'off')"
        />
        <img draggable="false"
             v-else-if=" sideBarIsVisible && sideBarInterior === 'polling'"
             alt="not loaded"
             src="/img/polling-on.svg"
             @mouseenter="showTooltip($store.getters.t('create-minutes'))"
             @mouseleave="hideTooltip($store.getters.t('create-minutes'))"
             @click="controlSideBarHandler('polling', 'on')"
        />
        <base-tool-tip :is-hovered="isProceedings">{{
            $store.getters.t("polling")
          }}
        </base-tool-tip>
      </div>

      <div
          v-if="
          (isModeratorSubstituteActivated) && isMobile === false"
          ref="drop-down-container-polling-sub-moderator"
          style="cursor: pointer; position: relative;"
      >
        <!--        <base-mini-drop-down-->
        <!--            :items="dropDownItemsPolling"-->
        <!--            :open="dropDownPolling.flag"-->
        <!--            direction-x="middle"-->
        <!--            direction-y="upward"-->
        <!--            @select-item="getSelectedItemPolling"></base-mini-drop-down>-->
        <div v-if="isRegisteredAllPolling" class="notification-badge">
          <div></div>
        </div>
        <img draggable="false"
             v-if="!sideBarIsVisible || sideBarIsVisible && sideBarInterior !== 'polling'"
             alt="not loaded"
             src="/img/polling-off.svg"
             @mouseenter="showTooltip($store.getters.t('create-minutes'))"
             @mouseleave="hideTooltip($store.getters.t('create-minutes'))"
             @click="controlSideBarHandler('polling', 'off')"
        />
        <img draggable="false"
             v-else-if=" sideBarIsVisible && sideBarInterior === 'polling'"
             alt="not loaded"
             src="/img/polling-on.svg"
             @mouseenter="showTooltip($store.getters.t('create-minutes'))"
             @mouseleave="hideTooltip($store.getters.t('create-minutes'))"
             @click="controlSideBarHandler('polling', 'on')"
        />
        <base-tool-tip :is-hovered="isProceedings">{{
            $store.getters.t("polling")
          }}
        </base-tool-tip>
      </div>


      <div
          v-else-if="
          (!amIModerator && !isModeratorSubstituteActivated && $store.getters.hasModerator ||  isGuest && !$store.getters.hasModerator) && isMobile === false  && allPolling.length > 0 "
          style="cursor: pointer; position: relative;"
          @mouseenter="showTooltip($store.getters.t('create-minutes'))"
          @mouseleave="hideTooltip($store.getters.t('create-minutes'))"
      >
        <div v-if="isRegisteredAllPolling" class="notification-badge">
          <div></div>
        </div>
        <img draggable="false"
             v-if="!sideBarIsVisible || sideBarIsVisible && sideBarInterior !== 'polling'"
             alt="not loaded"
             src="/img/polling-off.svg"
             @click="controlSideBarHandler('polling', 'off')"
        />
        <img draggable="false"
             v-else-if=" sideBarIsVisible && sideBarInterior === 'polling'"
             alt="not loaded"
             src="/img/polling-on.svg"
             @click="controlSideBarHandler('polling', 'on')"
        />
        <base-tool-tip :is-hovered="isProceedings">{{
            $store.getters.t("polling")
          }}
        </base-tool-tip>
      </div>

      <!--      <div-->
      <!--        v-if="(amIModerator || pdfSharingAllowed) && isMobile === false"-->
      <!--        style="cursor: pointer; position: relative; width: 2.5rem"-->
      <!--        @mouseenter="showTooltip('اشتراک گذاری فایل')"-->
      <!--        @mouseleave="hideTooltip('اشتراک گذاری فایل')"-->
      <!--        @click="openPdfSharing"-->
      <!--      >-->
      <!--        <img draggable="false"-->
      <!--          src="/img/pdf.png"-->
      <!--          style="width: 2.2rem"-->
      <!--          alt="not loaded"-->
      <!--        />-->
      <!--      </div>-->
      <!--      <div-->
      <!--        v-if="pdfUrl && isEnableDownloadPdf"-->
      <!--        style="cursor: pointer; position: relative; width: 2.5rem"-->
      <!--      >-->
      <!--        <base-tool-tip :is-hovered="isDownloadPDF">  PDF  دانلود</base-tool-tip>-->
      <!--                <img draggable="false"-->
      <!--                  src="/img/pdf.png"-->
      <!--                  style="width: 2.2rem;position: relative;top: 1.6rem;cursor: none"-->
      <!--                  alt="not loaded"-->
      <!--                />-->
      <!--        <a :href="pdfUrl" style="color: white;opacity: 0;cursor: pointer ;position: relative;width: 2.2rem;height:2.2rem;z-index: 2;bottom: 1.2rem" target="_blank"    @mouseenter="showTooltip('دانلود pdf')"-->
      <!--           @mouseleave="hideTooltip('دانلود pdf')">دانلود PDF</a>-->
      <!--      </div>-->
      <div
          v-if="listOfPollings.length > 0 && isMobile === false"
          style="margin-top: 0.7rem; cursor: pointer; position: relative"
          @click="togglePollingDropDown"
      >
        <!--        <div class="notification-circle">-->
        <!--          <div></div>-->
        <!--        </div>-->
        <img draggable="false"
             alt="not loaded"
             src="/img/Polling.png"
             style="position: relative; bottom: 0.3rem"
             @mouseenter="showTooltip($store.getters.t('polling-list'))"
             @mouseleave="hideTooltip($store.getters.t('polling-list'))"
        />
        <base-tool-tip :is-hovered="isListOfPollings">{{
            $store.getters.t("polling-list")
          }}
        </base-tool-tip>
        <div
            v-if="isPollingMiniDropDownOpen"
            ref="polling"
            class="unopened__polling--container"
        >
          <img draggable="false"
               alt="not loaded"
               class="close-polling"
               src="/img/close.svg"
               @click.stop="closePollingDropDown"
          />
          <ul class="unopened__polling">
            <li
                v-for="poll in pollingList"
                :key="poll.pollingId"
                class="list-of-polls"
                style="width: 100%"
                @click.stop="
                openPolling(poll.pollingId, poll.pollingType, poll.isAnonymous)
              "
            >
              <div style="margin-left: 1rem; width: 3rem; height: 3rem">
                <img draggable="false" alt="not loaded" src="/img/polling-off.svg"/>
              </div>
              <div
                  style="
                  width: calc(100% - 4rem);
                  direction: rtl;
                  text-align: right;
                "
              >
                <div style="display: flex;flex-direction: column">
                  <p class="polling__text">
                    {{ poll.question }}
                  </p>
                  <span style="direction: ltr;font-size: 1.1rem">{{ poll.date }}</span>
                </div>

              </div>
            </li>
          </ul>
        </div>
      </div>
      <div
          v-if="!isMobile"
          v-show="
          !sideBarIsVisible || (sideBarIsVisible && sideBarInterior !== 'chat')
        "
          @mouseenter="showTooltip($store.getters.t('chat'))"
          @mouseleave="hideTooltip($store.getters.t('chat'))"
      >
        <base-tool-tip :is-hovered="isChatHovered">{{
            $store.getters.t("chat")
          }}
        </base-tool-tip>
        <div v-if="unreadGroupChatLength > 0 || unreadPrivateChatLength > 0 || proceedingsNotificationBadge"
             class="notification-badge">
          <div></div>
        </div>
        <img draggable="false"
             alt="not loaded"
             src="/img/chat-off.svg"
             @click="controlSideBarHandler('chat', 'off')"
        />
      </div>
      <div
          v-if="!isMobile"
          v-show="sideBarIsVisible && sideBarInterior === 'chat'"
          @mouseenter="showTooltip($store.getters.t('chat'))"
          @mouseleave="hideTooltip($store.getters.t('chat'))"
      >
        <base-tool-tip :is-hovered="isChatHovered">{{
            $store.getters.t("chat")
          }}
        </base-tool-tip>
        <img draggable="false"
             alt="not loaded"
             src="/img/chat-on.svg"
             @click="controlSideBarHandler('chat', 'on')"
        />
      </div>
      <div
          v-if="!isMobile"
          v-show="
          !sideBarIsVisible || (sideBarIsVisible && (sideBarInterior === 'chat' || sideBarInterior === 'polling' ))
        "
          @mouseenter="showTooltip($store.getters.t('participants'))"
          @mouseleave="hideTooltip($store.getters.t('participants'))"
      >
        <base-tool-tip :is-hovered="isParticipantListHovered">{{
            $store.getters.t("participants")
          }}
        </base-tool-tip>
        <div
            v-if="
            waitingHandRaiseParticipants === true
          "
            class="notification-badge"
        >
          <div></div>
        </div>

        <img draggable="false"
             alt="not loaded"
             src="/img/participants-off.svg"
             @click="controlSideBarHandler('participants', 'off')"
        />
      </div>
      <div
          v-if="!isMobile"
          v-show="sideBarIsVisible && sideBarInterior !== 'chat' && sideBarInterior !== 'polling'"
          @mouseenter="showTooltip($store.getters.t('participants'))"
          @mouseleave="hideTooltip($store.getters.t('participants'))"
      >
        <base-tool-tip :is-hovered="isParticipantListHovered">{{
            $store.getters.t("participants")
          }}
        </base-tool-tip>
        <img draggable="false"
             alt="not loaded"
             src="/img/participants-on.svg"
             @click="controlSideBarHandler('participants', 'on')"
        />
      </div>
      <div v-if="!isMobile" @click="fullScreenPage">
        <base-tool-tip :is-hovered="isMaximizeHovered">{{
            $store.getters.t("maximize-screen")
          }}
        </base-tool-tip>
        <base-tool-tip :is-hovered="isMinimizeHovered">{{
            $store.getters.t("minimize-screen")
          }}
        </base-tool-tip>

        <img draggable="false"
             v-if="!isFullScreen && !isIphone"
             alt="not loaded"
             src="/img/expand.svg"
             @mouseenter="showTooltip($store.getters.t('maximize-screen'))"
             @mouseleave="hideTooltip($store.getters.t('maximize-screen'))"
        />
        <img draggable="false"
             v-else-if="isFullScreen && !isIphone"
             alt="not loaded"
             src="/img/expand.svg"
             @mouseenter="showTooltip($store.getters.t('minimize-screen'))"
             @mouseleave="hideTooltip($store.getters.t('minimize-screen'))"
        />
      </div>
      <!--      <div-->
      <!--          v-if="isMobile"-->
      <!--          style="position: absolute; right: 1rem"-->
      <!--          @click="fullScreenPage"-->
      <!--      >-->
      <!--        <base-tool-tip :is-hovered="isMaximizeHovered">{{-->
      <!--            $store.getters.t("maximize-screen")-->
      <!--          }}-->
      <!--        </base-tool-tip>-->
      <!--        <base-tool-tip :is-hovered="isMinimizeHovered">{{-->
      <!--            $store.getters.t("minimize-screen")-->
      <!--          }}-->
      <!--        </base-tool-tip>-->

      <!--        <img draggable="false"-->
      <!--            v-if="!isFullScreen && !isIphone"-->
      <!--            alt="not loaded"-->
      <!--            src="/img/expand.svg"-->
      <!--            @mouseenter="showTooltip($store.getters.t('maximize-screen'))"-->
      <!--            @mouseleave="hideTooltip($store.getters.t('maximize-screen'))"-->
      <!--        />-->
      <!--        <img draggable="false"-->
      <!--            v-else-if="isFullScreen && !isIphone"-->
      <!--            alt="not loaded"-->
      <!--            src="/img/expand.svg"-->
      <!--            @mouseenter="showTooltip($store.getters.t('minimize-screen'))"-->
      <!--            @mouseleave="hideTooltip($store.getters.t('minimize-screen'))"-->
      <!--        />-->
      <!--      </div>-->
    </div>
  </div>
  <base-modal
      :open="isBoardColorDialogOpen"
      page="conference"
      @close-modal="closeBoardColorModal"
  >
    <template #modal-header>
      <span style="cursor: pointer" @click="closeBoardColorModal">&#10060;</span>
    </template>
    <template #modal-body>
      <div style="display: flex;flex-direction: column;gap: 2rem;width: 30rem">
        <div>
          رنگ تخته را انتخاب کنید
        </div>
        <div style="display: flex;flex-direction: row;gap: 5rem">
          <div>
            <label for="black" class="label-color">سیاه</label>
            <input type="checkbox" style="cursor: pointer" id="black" name="black" @click="chooseBlackColor"
                   v-model="isBoardBlack">
          </div>
          <div>
            <label for="white" class="label-color">سفید</label>
            <input type="checkbox" style="cursor: pointer" id="white" name="white" @click="chooseWhiteColor"
                   v-model="isBoardWhite">
          </div>
        </div>
        <div style="width: 100%;display: flex;justify-content: center;align-items: center">
          <button :disabled="!isBoardWhite && !isBoardBlack"
                  :style="{padding: '0.4rem 3rem','background-color': !isBoardWhite && !isBoardBlack ? 'gray' : '#4fd5ca',color:'white',border:'none','border-radius':'0.7rem',cursor: !isBoardWhite && !isBoardBlack ? 'not-allowed' :'pointer'}"
                  @click="openWhiteBoard">ثبت
          </button>
        </div>
      </div>
    </template>
  </base-modal>
  <div
      v-if="isPollingMiniDropDownOpen && isMobile"
      ref="polling"
      style="  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90vw;
  border: solid 0.1rem lightgray;
  background-color: white;
  border-radius: 1rem;
  padding: 2.5rem 1.5rem;
  cursor: auto;
  -webkit-box-shadow: -2px 8px 19px -3px #000000;
  box-shadow: -2px 8px 19px -3px #000000;"
  >
    <img draggable="false"
         alt="not loaded"
         class="close-polling"
         src="/img/close.svg"
         @click.stop="closePollingDropDown"
    />
    <ul class="unopened__polling">
      <li
          v-for="poll in pollingList"
          :key="poll.pollingId"
          class="list-of-polls"
          style="width: 100%"
          @click.stop="
                openPolling(poll.pollingId, poll.pollingType, poll.isAnonymous)
              "
      >
        <div style="margin-left: 1rem; width: 3rem; height: 3rem">
          <img draggable="false" alt="not loaded" src="/img/Poll.svg"/>
        </div>
        <div
            style="
                  width: calc(100% - 4rem);
                  direction: rtl;
                  text-align: right;
                "
        >
          <div style="display: flex;flex-direction: column">
            <p class="polling__text">
              {{ poll.question }}
            </p>
            <span style="direction: ltr;font-size: 1.1rem">{{ poll.date }}</span>
          </div>

        </div>
      </li>
    </ul>
  </div>

  <div
      v-if="isProceedingsMiniDropDownOPen && isMobile"
      ref="polling"
      style="  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90vw;
  border: solid 0.1rem lightgray;
  background-color: white;
  border-radius: 1rem;
  padding: 2.5rem 1.5rem;
  cursor: auto;
  -webkit-box-shadow: -2px 8px 19px -3px #000000;
  box-shadow: -2px 8px 19px -3px #000000;"
  >
    <img draggable="false"
         alt="not loaded"
         class="close-polling"
         src="/img/close.svg"
         @click.stop="closeProceedingsDropDown"
    />

    <ul class="unopened__polling">
      <li
          v-for="proceedings in proceedingsList"
          :key="proceedings.proceedingsId"
          :class="
                $i18n.locale === 'fa' ? 'list-of-polls' : 'list-of-polls-ltr'
              "
          style="width: 100%"
          @click.stop="
                openConfirmationProceedings(proceedings.proceedingsId)
              "
      >
        <div
            style="
                  margin-left: 1rem;
                  width: 3rem;
                  height: 3rem;
                  background-color: #1a73e8;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 1rem;
                "
        >
          <img draggable="false"
               alt="not loaded"
               src="/img/recive-minutes.png"
               style="width: 65%"
          />
        </div>
        <div
            style="
                  width: calc(100% - 4rem);
                  direction: rtl;
                  text-align: right;

                "
        >
          <div style="display: flex;flex-direction: column">
            <p
                :class="
                    $i18n.locale === 'fa'
                      ? 'polling__text'
                      : 'polling__text-ltr'
                  "
            >
              {{ $store.getters.t("Minutes-with-meeting-number") }}
              <span style="margin: 0 0.3rem">{{
                  proceedings.proceedingsNumber
                }}</span>
            </p>
            <span style="direction: ltr;font-size: 1.1rem">{{ proceedings.date }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <the-poll v-if="isCreatePollOpened" :current-layout-container-height="currentLayoutContainerHeight"
            :is-open="isCreatePollOpened" @close-polling-modal="isCreatePollOpened = false"></the-poll>
  <div v-if="isMeetingInfoShowed" class="meeting-information-in-conference"
       :style="{direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
    <close-icon width="16" height="16" color="#75758F" @click-icon="isMeetingInfoShowed = false"></close-icon>
    <div>
      <span>{{ $store.getters.t('meeting-name') + ':' }}</span>
      <span> {{ roomInfo.meetingName }}  </span>
    </div>
    <div>
      <span>{{ $store.getters.t('meeting-moderator') }}</span>
      <span>{{ roomInfo.moderatorName }}</span>
    </div>
    <div>
      <span>{{ $store.getters.t('meeting-room') }}</span>
      <span>{{ roomInfo.meetingRoomName }}</span>
    </div>
    <div>
      <span>{{ $store.getters.t('vr') + ':' }}</span>
      <span>{{ roomInfo.videoRouter }}</span>
    </div>
    <div>
      <span>{{ $store.getters.t('onlineParticipants') + ':' }}</span>
      <span>{{ allOnlineParticipantsLength }}</span>
    </div>
    <div>
      <span>{{ $store.getters.t('meeting-time') + ':' }}</span>
      <span>{{
          this.$store.getters.t('from-to', {
            from: $store.getters.fromSchd.from,
            to: $store.getters.toSchd.to
          })
        }}</span>
    </div>
  </div>
</template>
<script>
import MiniDropDownHandler from "../utils/mini.drop.down.actions";
import BaseMiniDropDown from "./UI/BaseMiniDropDown";
import BaseToolTip from "./UI/BaseToolTip";
import BaseModal from "./UI/BaseModal";
import {nextTick} from "vue";
import MoreIcon from "@/components/UI/Icons/MoreIcon.vue";
import ThePoll from "@/components/ThePoll.vue";
import CameraIcon from "@/components/UI/Icons/CameraIcon.vue";
import MicrophoneIcon from "@/components/UI/Icons/MicrophoneIcon.vue";
import ChevronUp from "@/components/UI/Icons/ChevronUp.vue";
import RestClient from "@/api/restClient";
import entityTypes from "@/statics/entityTypes";
import CloseIcon from "@/components/UI/Icons/CloseIcon.vue";

export default {
  name: "ControlMeetingActions",
  components: {CloseIcon, MicrophoneIcon, CameraIcon, ThePoll, MoreIcon, BaseMiniDropDown, BaseToolTip, BaseModal, ChevronUp},
  emits: [
    "control-meeting-handler",
    "control-side-bar-handler",
    "video-sharing-stat",
    "control-more-options-handler",
  ],
  props: [
    "amIModerator",
    "isModeratorJoined",
    "handStatus",
    "micControlAllowed",
    "micStatus",
    "cameraControlAllowed",
    "cameraStatus",
    "sideBarIsVisible",
    "sideBarInterior",
    "screenShareAllowed",
    "boardIsActive",
    "shareStatus",
    "videoSharingAllowed",
    "videoSharingStatus",
    "isBoardActivated",
    "isMessageReceived",
    "waitingHandRaiseParticipants",
    "listOfPollings",
    "isPollingOpen",
    "testPolling",
    "descriptivePolling",
    "isProceedingsOpen",
    "listOfProceedings",
    "proceedingsAllowed",
    "pdfSharingAllowed",
    "pdfUrl",
    "isPDFSharingEnabled",
    "isEnableDownloadPdf",
    "isMobile",
    "amIShare",
    "isVideoSharingEnabled",
    "boardSharingAllowed",
    "amISelectedModerator",
    "boardName",
    "roomIsBlock",
    "isIphone",
    "unreadPrivateChatLength",
    "unreadGroupChatLength",
    "isProceedingsAnswered",
    "proceedingsCreated",
    "isProceedingsStarted",
    "currentLayoutContainerHeight",
    "allPolling",
    "isConfirmPollingOpen",
    "isMeetingInRecordingMode",
    "amIGuestUser",
    "isScreenTouched",
    "isMyVideoStreamDisplayed",
    "videoShareStatus",
    "isScreenFullSize",
    "isModeratorSubstituteActivated"
  ],
  data() {
    return {
      restClientMeetingAttribute: new RestClient(entityTypes.meetingAttribute),
      isBoardWhite: false,
      isBoardBlack: false,
      isFullScreen: false,
      isMaximizeHovered: false,
      isMinimizeHovered: false,
      isPollingMiniDropDownOpen: false,
      isListOfPollings: false,
      isChaneDeviceHovered: false,
      isChatHovered: false,
      isParticipantListHovered: false,
      isMoreOptionsHovered: false,
      isShareHovered: false,
      isCameraHovered: false,
      isMicHovered: false,
      isHandRaiseHovered: false,
      isSpaceBarPress: false,

      moreDropDownItems: [
        // {
        //   label: this.$store.getters.t("change-video-quality"),
        // },
        // {
        //   label: this.$store.getters.t("change-meeting-video-quality"),
        // },
        // {
        //   label: this.$store.getters.t("pdf-sharing"),
        // },
        // {
        //   label: this.$store.getters.t("block-room")
        // },
        // {
        //   label: this.$store.getters.t("change-layout")
        // },
        {
          label: this.$store.getters.t("active-moderator-substitution"),
        },
        {
          label: this.$store.getters.t("turn-off-active-speaker"),
        },
        {
          label: this.$store.getters.t("disableRotation"),
        },
        {
          label:  this.$store.getters.t("maximize_active_speaker"),
        },
      ],
      moreDropDownItemsWithoutModerator: [

        {
          label: this.$store.getters.t("turn-off-active-speaker"),
        },
        {
          label:  this.$store.getters.t("maximize_active_speaker"),
        },
      ],
      moreDropDownItemsForModeratorInMobile: [
        {
          label: this.$store.getters.t("participant-list"),
        },
        {
          label: this.$store.getters.t("chat"),
        },
        {
          label: this.$store.getters.t("active-moderator-substitution"),
        },
        {
          label: this.$store.getters.t("polling"),
        },
        {
          label: this.$store.getters.t("turn-off-active-speaker"),
        },
        {
          label: this.$store.getters.t("change-layout")
        },
        {
          label:  this.$store.getters.t("maximize_active_speaker"),
        },
        {
          label: this.$store.getters.t("disableRotation"),
        },
      ],
      moreDropDownItemsWithoutModeratorInMobile: [
        // {
        //   label: this.$store.getters.t("change-video-quality"),
        // },
        // {
        //   label: this.$store.getters.t("pdf-sharing"),
        // },
        {
          label: this.$store.getters.t("change-layout")
        },
        {
          label: this.$store.getters.t("polling"),
        },
      ],
      moreDropDownItemsForParticipant: [
        // {
        //   label: this.$store.getters.t("change-video-quality"),
        // },
        // {
        //   label: this.$store.getters.t("change-layout")
        // },
      ],
      moreDropDownItemsForParticipantMobile: [
        {
          label: this.$store.getters.t("participant-list"),
        },
        {
          label: this.$store.getters.t("chat"),
        },
        {
          label: this.$store.getters.t("change-layout")
        },
      ],
      moreDropDownItemsMobile: [
        // {
        //   label: this.$store.getters.t("change-devices"),
        // },
        // {
        //   label: this.$store.getters.t("change-video-quality"),
        // },
        {
          label: this.$store.getters.t("participant-list"),
        },
        {
          label: this.$store.getters.t("chat"),
        },

        // {
        //   label: this.$store.getters.t("block-room")
        // },
        {
          label: this.$store.getters.t("polling"),
        },
      ],
      moreDropDownItemsParticipants: [
        {
          label: this.$store.getters.t("participant-list"),
        },
        {
          label: this.$store.getters.t("chat"),
        },
        // {
        //   label: this.$store.getters.t("change-devices"),
        // },
        // {
        //   label: this.$store.getters.t("change-video-quality"),
        // },
      ],
      // newFeaturesDropDownItems : [
      //   {
      //     label : 'اشتراک ویدیو'
      //   },
      //   {
      //     label : 'وایت برد'
      //   }
      // ],
      moreDropDown: {flag: false},
      moreDropDownMobile: {flag: false},
      moreDropDownParticipant: {flag: false},
      isListOfProceedings: false,
      isProceedings: false,
      isProceedingsMiniDropDownOPen: false,
      isMiniDropDownOpen: false,

      newFeaturesDropDown: {flag: false},
      isDownloadPDF: false,
      amIShareMyScreen: false,
      isBoardShared: false,
      isBoardColorDialogOpen: false,
      isRecordMeetingHoverd: false,
      isMeetingRecord: false,
      isPollingOpend: false,
      dropDownItemsPolling: [
        {
          label: this.$store.getters.t("Conduct-multi-choice-polling"), imgSrc: '/img/add-plus.svg',
        },
        {
          label: this.$store.getters.t("Conduct-descriptive-polling"), imgSrc: '/img/add-plus.svg',
        },
        {
          label: this.$store.getters.t("polling-result"),
          imgSrc: '/img/observe.svg',
        },
      ],
      dropDownPolling: {flag: false},
      whichPollingItem: null,
      isCreatePollOpened: false,
      isWritingParagraph: false,
      isMeetingInfoShowed: false,
      roomInfo: {},
      isGuest: false,
      isChangeLayoutHovered: false,
      isToggled: false,
      showToggleButton: true,
      isMicSettingHovered:false,
      isCameraSettingHovered:false,
      isSelfViewHovered:false,
      ShareDropDownItems: [
        {
          label: this.$store.getters.t("share_screen"), imgSrc: '/img/screen.svg'
        },
        {
          label: this.$store.getters.t("share_video_screen"), imgSrc: '/img/video-share.svg'
        },
      ],
      dropDownShare: {flag: false},

    };
  },
  computed: {
    proceedingsList() {
      const proceedings = this.listOfProceedings
      return proceedings.reverse()
    },
    pollingList() {
      const pollings = this.listOfPollings
      return pollings.reverse()
    },
    meetingTitle() {
      return this.$store.getters.session_name;
    },
    roomHasModerator() {
      return this.$store.getters.hasModerator
    },
    proceedingsNotificationBadge() {
      return !this.isProceedingsAnswered && (this.proceedingsCreated || this.isProceedingsStarted)
    },
    isRegisteredAllPolling() {
      const idx = this.allPolling.findIndex((polling) => {
        return polling.isAnswered === false
      })
      return idx !== -1;
    },
    allOnlineParticipantsLength() {
      return [...this.$store.getters.innerParticipants, ...this.$store.getters.outerParticipants].length - 1
    },
  },
  watch: {
    allPolling: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val?.length > 0) {
          this.moreDropDownItemsForParticipantMobile = [
            // {
            //   label: this.$store.getters.t("change-devices"),
            // },
            {
              label: this.$store.getters.t("change-layout"),
            },
            {
              label: this.$store.getters.t("participant-list"),
            },
            {
              label: this.$store.getters.t("chat"),
            },
            {
              label: this.$store.getters.t("polling"),
            },
          ]

        } else {
          this.moreDropDownItemsForParticipantMobile = [
            // {
            //   label: this.$store.getters.t("change-devices"),
            // },
            {
              label: this.$store.getters.t("change-layout"),
            },
            {
              label: this.$store.getters.t("participant-list"),
            },
            {
              label: this.$store.getters.t("chat"),
            },
          ]
        }
      }
    },
    // listOfProceedings: {
    //   immediate: true,
    //   deep: true,
    //   handler(val) {
    //     if (val.length > 0) {
    //       if (this.listOfPollings.length > 0) {
    //         this.moreDropDownItemsForParticipantMobile = [
    //           {
    //             label: this.$store.getters.t("change-devices"),
    //           },
    //           {
    //             label: this.$store.getters.t("participant-list"),
    //           },
    //           {
    //             label: this.$store.getters.t("chat"),
    //           },
    //           {
    //             label: 'نظرسنجی',
    //           },
    //           {
    //             label: 'صورتجلسه',
    //           },
    //         ]
    //       } else {
    //         this.moreDropDownItemsForParticipantMobile = [
    //           {
    //             label: this.$store.getters.t("change-devices"),
    //           },
    //           {
    //             label: this.$store.getters.t("participant-list"),
    //           },
    //           {
    //             label: this.$store.getters.t("chat"),
    //           },
    //           {
    //             label: 'صورتجلسه',
    //           },
    //         ]
    //       }
    //     } else {
    //       if (this.listOfPollings.length > 0) {
    //         this.moreDropDownItemsForParticipantMobile = [
    //           {
    //             label: this.$store.getters.t("change-devices"),
    //           },
    //           {
    //             label: this.$store.getters.t("participant-list"),
    //           },
    //           {
    //             label: this.$store.getters.t("chat"),
    //           },
    //           {
    //             label: 'نظرسنجی',
    //           },
    //         ]
    //       } else {
    //         this.moreDropDownItemsForParticipantMobile = [
    //           {
    //             label: this.$store.getters.t("change-devices"),
    //           },
    //           {
    //             label: this.$store.getters.t("participant-list"),
    //           },
    //           {
    //             label: this.$store.getters.t("chat"),
    //           },
    //         ]
    //       }
    //     }
    //   }
    // },
    // roomIsBlock: {
    //   immediate: true,
    //   handler(val) {
    //     if (val) {
    //       this.moreDropDownItems[1].label = this.$store.getters.t("unblock-room");
    //       this.moreDropDownItemsMobile[3].label = this.$store.getters.t("unblock-room");
    //     } else {
    //       this.moreDropDownItems[1].label = this.$store.getters.t("block-room");
    //       this.moreDropDownItemsMobile[3].label = this.$store.getters.t("block-room");
    //     }
    //   }
    // },
    isModeratorSubstituteActivated: {
      handler(val) {
        if (val) {
          new MiniDropDownHandler(
              this.$refs["more-drop-down-container"],
              this.moreDropDown
          );
          new MiniDropDownHandler(
              this.$refs["more-drop-down-container-mobile"],
              this.moreDropDown
          );
          new MiniDropDownHandler(
              this.$refs["more-drop-down-container-participant"],
              this.moreDropDown
          );
          new MiniDropDownHandler(
              this.$refs["drop-down-container-polling"],
              this.dropDownPolling
          );
          setTimeout(() => {
            new MiniDropDownHandler(
                this.$refs["drop-down-container-polling-sub-moderator"],
                this.dropDownPolling
            );
          }, 10)

        } else {
          setTimeout(() => {
            new MiniDropDownHandler(
                this.$refs["more-drop-down-container-participant"],
                this.moreDropDown
            );
          }, 10)
        }
      }

    },
    // isScreenFullSize(val){
    //   this.isFullScreen = val
    // },
  },
  methods: {
    showTooltip(icon) {
      switch (icon) {
        case this.$store.getters.t("hand-raise"):
          this.isHandRaiseHovered = true;
          break;
        case this.$store.getters.t("hand-down"):
          this.isHandRaiseHovered = true;
          break;
        case this.$store.getters.t("mic-disallowed"):
          this.isMicHovered = true;
          break;
        case this.$store.getters.t("microphone"):
          this.isMicHovered = true;
          break;
        case this.$store.getters.t("camera-disallowed"):
          this.isCameraHovered = true;
          break;
        case this.$store.getters.t("camera"):
          this.isCameraHovered = true;
          break;
        case this.$store.getters.t("share"):
          this.isShareHovered = true;
          break;
        case this.$store.getters.t("end-share"):
          this.isShareHovered = true;
          break;
        case this.$store.getters.t("disallow-share"):
          this.isShareHovered = true;
          break;
        case this.$store.getters.t("more"):
          this.isMoreOptionsHovered = true;
          break;
        case this.$store.getters.t("create-minutes"):
          this.isProceedings = true;
          break;
        case this.$store.getters.t("proceedings-list"):
          this.isListOfProceedings = true;
          break;
        case this.$store.getters.t("polling-list"):
          this.isListOfPollings = true;
          break;
        case this.$store.getters.t("chat"):
          this.isChatHovered = true;
          break;
        case this.$store.getters.t("participants"):
          this.isParticipantListHovered = true;
          break;
        case this.$store.getters.t("change-devices"):
          this.isChaneDeviceHovered = true;
          break;
        case this.$store.getters.t("maximize-screen"):
          this.isMaximizeHovered = true;
          break;
        case this.$store.getters.t("minimize-screen"):
          this.isMinimizeHovered = true;
          break;
        case 'دانلود pdf':
          this.isDownloadPDF = true;
          break;
        case this.$store.getters.t("record-meeting"):
          this.isRecordMeetingHoverd = true;
          break;
        case this.$store.getters.t("end-record-meeting"):
          this.isRecordMeetingHoverd = true;
          break;
        case this.$store.getters.t("change-layout"):
          this.isChangeLayoutHovered = true;
          break;
        case this.$store.getters.t("microphone-setting"):
          this.isMicSettingHovered = true;
          break;
        case this.$store.getters.t("camera-setting"):
          this.isCameraSettingHovered = true;
          break;
        case this.$store.getters.t("selfView"):
          this.isSelfViewHovered = true;
          break;
        default:
          return;
      }
    },
    hideTooltip() {
      this.isHandRaiseHovered = false;

      this.isHandRaiseHovered = false;

      this.isMicHovered = false;

      this.isMicHovered = false;

      this.isCameraHovered = false;

      this.isCameraHovered = false;

      this.isShareHovered = false;

      this.isShareHovered = false;

      this.isShareHovered = false;

      this.isMoreOptionsHovered = false;

      this.isProceedings = false;

      this.isListOfProceedings = false;

      this.isListOfPollings = false;

      this.isChatHovered = false;

      this.isParticipantListHovered = false;

      this.isMaximizeHovered = false;

      this.isMinimizeHovered = false;
      this.isChaneDeviceHovered = false;
      this.isDownloadPDF = false;
      this.isRecordMeetingHoverd = false;
      this.isChangeLayoutHovered = false
      this.isMicSettingHovered = false
      this.isCameraSettingHovered = false;
      this.isSelfViewHovered = false;
    },
    getSelectedItemInMoreDropDown(item) {
      const selectedItem = this.moreDropDownItems.find(
          (dropDownItem) => dropDownItem.label === item
      );
      const selectedIndex = this.moreDropDownItems.findIndex(
          (dropDownItem) => dropDownItem.label === item
      );
      switch (selectedItem.label) {
          // case this.$store.getters.t("record-meeting"):
          //   this.moreDropDownItems[1].label = this.$store.getters.t("stop-recording");
          //   this.isMeetingRecord = true
          //   this.controlMoreOptionsHandler("record", true);
          //   break;
          // case this.$store.getters.t("stop-recording"):
          //   this.moreDropDownItems[1].label = this.$store.getters.t("record-meeting");
          //   this.controlMoreOptionsHandler("record", false);
          //   break;
        case this.$store.getters.t("active-moderator-substitution"):
          this.moreDropDownItems[selectedIndex].label =
              this.$store.getters.t("deny-moderator-substitution");
          this.controlMoreOptionsHandler("moderator-substitute", true);
          break;
        case this.$store.getters.t("deny-moderator-substitution"):
          // if (this.boardName === )
          // room_handler.sendCancellationForSubMod(this.$store.getters.moderatorSubstituteId)
          this.moreDropDownItems[selectedIndex].label =
              this.$store.getters.t("active-moderator-substitution");
          this.controlMoreOptionsHandler("moderator-substitute", false);
          break;
          // case this.$store.getters.t("invite-to-meeting"):
          //   this.controlMoreOptionsHandler("invite", true);
          //   break;
        case this.$store.getters.t("white-board"):
          if (this.isBoardActivated) {
            this.eventBus.emit("notification", {
              title: "پیام",
              type: "error",
              bodyText: this.$store.getters.t("exist-whiteboard"),
              time: 5000,
            });
            return
          }
          this.moreDropDownItems[selectedIndex].label = this.$store.getters.t("close-whiteboard");
          this.controlMoreOptionsHandler("whiteBoard", true);

          break;
        case this.$store.getters.t("close-whiteboard"):
          this.moreDropDownItems[selectedIndex].label = this.$store.getters.t("white-board");
          this.controlMoreOptionsHandler("whiteBoard", false);

          break;
        case this.$store.getters.t("pdf-sharing"):
          this.controlMoreOptionsHandler("PDF", true);
          break;
        case this.$store.getters.t("change-devices"):
          this.eventBus.emit('TOGGLE_SETTINGS_PANEL')
          break;
        case this.$store.getters.t("change-video-quality"):
          this.eventBus.emit('TOGGLE_VIDEO_QUALITY')
          break;
        case this.$store.getters.t("change-meeting-video-quality"):
          this.eventBus.emit('CHANGE_MEETING_VIDEO_QUALITY')
          break;
          case this.$store.getters.t("disableRotation"):
            this.controlMoreOptionsHandler("rotation", 'disable');
            this.moreDropDownItems[selectedIndex].label = this.$store.getters.t("enableRotation");
            break;
        case this.$store.getters.t("enableRotation"):
          this.controlMoreOptionsHandler("rotation", 'enable');
          this.moreDropDownItems[selectedIndex].label = this.$store.getters.t("disableRotation");
          break;
        case this.$store.getters.t("turn-off-active-speaker"):
          this.controlMoreOptionsHandler("active_speaker", 'off');
          this.moreDropDownItems[selectedIndex].label = this.$store.getters.t("turn-on-active-speaker");
          break;
        case this.$store.getters.t("turn-on-active-speaker"):
          this.controlMoreOptionsHandler("active_speaker", 'on');
          this.moreDropDownItems[selectedIndex].label = this.$store.getters.t("turn-off-active-speaker");
          break;
          // case this.$store.getters.t("block-room"):
          //   this.moreDropDownItems[1].label = this.$store.getters.t("unblock-room");
          //   this.controlMoreOptionsHandler("blockRoom", true);
          //   break;
          // case this.$store.getters.t("unblock-room"):
          //   this.moreDropDownItems[1].label = this.$store.getters.t("block-room");
          //   this.controlMoreOptionsHandler("blockRoom", false);
          //   break;
        case this.$store.getters.t("change-layout"):
          this.controlMoreOptionsHandler("changeLayout", true);
          break;
        case this.$store.getters.t("maximize_active_speaker"):
          this.controlMoreOptionsHandler("maximize_active_speaker", 'off');
          this.moreDropDownItems[selectedIndex].label = this.$store.getters.t("minimize_active_speaker");
          break;
        case this.$store.getters.t("minimize_active_speaker"):
          this.controlMoreOptionsHandler("maximize_active_speaker", 'on');
          this.moreDropDownItems[selectedIndex].label = this.$store.getters.t("maximize_active_speaker");
          break;
      }
      this.eventBus.emit("close-drop-down");
    },
    getSelectedItemInMoreDropDownMobileParticipant(item) {
      const selectedItem = this.moreDropDownItemsMobile.find(
          (dropDownItem) => dropDownItem.label === item
      );
      switch (selectedItem.label) {
        case this.$store.getters.t("chat"):
          this.controlSideBarHandler("chat", "off");
          break;
        case this.$store.getters.t("participant-list"):
          this.controlSideBarHandler("participants", "off");
          break;
        case this.$store.getters.t("video-sharing"):
          this.controlMoreOptionsHandler("videoSharing", true);
          break;
          // case this.$store.getters.t("invite-to-meeting"):
          //   this.controlMoreOptionsHandler("invite", true);
          //   break;
          // case this.$store.getters.t("block-room"):
          //   console.log(2)
          //   this.moreDropDownItems[4].label = this.$store.getters.t("unblock-room");
          //   this.controlMoreOptionsHandler("blockRoom", true);
          //   break;
          // case this.$store.getters.t("unblock-room"):
          //   this.moreDropDownItems[4].label = this.$store.getters.t("block-room");
          //   this.controlMoreOptionsHandler("blockRoom", false);
          //   break;
        case this.$store.getters.t("change-devices"):
          this.isToggled = !this.isToggled
          this.eventBus.emit('TOGGLE_SETTINGS_PANEL')
          break;
        case this.$store.getters.t("change-video-quality"):
          this.eventBus.emit('TOGGLE_VIDEO_QUALITY')
          break;
      }
      this.eventBus.emit("close-drop-down");
    },
    getSelectedItemInMoreDropDownMobileModerator(item) {
      const selectedItem = this.moreDropDownItemsForModeratorInMobile.find(
          (dropDownItem) => dropDownItem.label === item
      );
      const selectedIndex = this.moreDropDownItems.findIndex(
          (dropDownItem) => dropDownItem.label === item
      );
      console.log(selectedItem, item)
      switch (selectedItem.label) {
        case this.$store.getters.t("chat"):
          this.controlSideBarHandler("chat", "off");
          break;
        case this.$store.getters.t("participant-list"):
          this.controlSideBarHandler("participants", "off");
          break;
        case this.$store.getters.t("video-sharing"):
          this.controlMoreOptionsHandler("videoSharing", true);
          break;
        case this.$store.getters.t("change-layout"):
          this.controlMeetingHandler('changeLayout')
          break;
          // case this.$store.getters.t("invite-to-meeting"):
          //   this.controlMoreOptionsHandler("invite", true);
          //   break;
          // case this.$store.getters.t("block-room"):
          //   this.moreDropDownItemsMobile[3].label = this.$store.getters.t("unblock-room");
          //   this.controlMoreOptionsHandler("blockRoom", true);
          //   break;
          // case this.$store.getters.t("unblock-room"):
          //   this.moreDropDownItemsMobile[3].label = this.$store.getters.t("block-room");
          //   this.controlMoreOptionsHandler("blockRoom", false);
          //   break;
        case this.$store.getters.t("change-devices"):
          this.isToggled = !this.isToggled
          this.eventBus.emit('TOGGLE_SETTINGS_PANEL')
          break;
        case this.$store.getters.t("change-video-quality"):
          this.eventBus.emit('TOGGLE_VIDEO_QUALITY')
          break;
        case this.$store.getters.t("active-moderator-substitution"):
          this.moreDropDownItemsMobile[selectedIndex].label =
              this.$store.getters.t("deny-moderator-substitution");
          this.controlMoreOptionsHandler("moderator-substitute", true);
          break;
        case this.$store.getters.t("deny-moderator-substitution"):
          // if (this.boardName === )
          // room_handler.sendCancellationForSubMod(this.$store.getters.moderatorSubstituteId)
          this.moreDropDownItemsMobile[selectedIndex].label =
              this.$store.getters.t("active-moderator-substitution");
          this.controlMoreOptionsHandler("moderator-substitute", false);
          break;
        case this.$store.getters.t("polling"):
          this.controlSideBarHandler('polling', 'off');
          break;
        case this.$store.getters.t("maximize_active_speaker"):
          this.controlMoreOptionsHandler("maximize_active_speaker", 'off');
          this.moreDropDownItems[selectedIndex].label = this.$store.getters.t("minimize_active_speaker");
          break;
        case this.$store.getters.t("minimize_active_speaker"):
          this.controlMoreOptionsHandler("maximize_active_speaker", 'on');
          this.moreDropDownItems[selectedIndex].label = this.$store.getters.t("maximize_active_speaker");
          break;
      }
      this.eventBus.emit("close-drop-down");
    },
    getSelectedItemInMoreDropDownWithoutModeratorInMobile(item) {
      const selectedItem = this.moreDropDownItemsWithoutModeratorInMobile.find(
          (dropDownItem) => dropDownItem.label === item
      );
      console.log(selectedItem, item)
      switch (selectedItem.label) {
        case this.$store.getters.t("chat"):
          this.controlSideBarHandler("chat", "off");
          break;
        case this.$store.getters.t("participant-list"):
          this.controlSideBarHandler("participants", "off");
          break;
        case this.$store.getters.t("video-sharing"):
          this.controlMoreOptionsHandler("videoSharing", true);
          break;
          // case this.$store.getters.t("invite-to-meeting"):
          //   this.controlMoreOptionsHandler("invite", true);
          //   break;
          // case this.$store.getters.t("block-room"):
          //   this.moreDropDownItemsMobile[3].label = this.$store.getters.t("unblock-room");
          //   this.controlMoreOptionsHandler("blockRoom", true);
          //   break;
          // case this.$store.getters.t("unblock-room"):
          //   this.moreDropDownItemsMobile[3].label = this.$store.getters.t("block-room");
          //   this.controlMoreOptionsHandler("blockRoom", false);
          //   break;
        case this.$store.getters.t("change-devices"):
          this.isToggled = !this.isToggled
          this.eventBus.emit('TOGGLE_SETTINGS_PANEL')
          break;
        case this.$store.getters.t("change-video-quality"):
          this.eventBus.emit('TOGGLE_VIDEO_QUALITY')
          break;
        case this.$store.getters.t("active-moderator-substitution"):
          this.moreDropDownItemsMobile[this.moreDropDownItemsMobile.length - 1].label =
              this.$store.getters.t("deny-moderator-substitution");
          this.controlMoreOptionsHandler("moderator-substitute", true);
          break;
        case this.$store.getters.t("deny-moderator-substitution"):
          // if (this.boardName === )
          // room_handler.sendCancellationForSubMod(this.$store.getters.moderatorSubstituteId)
          this.moreDropDownItemsMobile[this.moreDropDownItemsMobile.length - 1].label =
              this.$store.getters.t("active-moderator-substitution");
          this.controlMoreOptionsHandler("moderator-substitute", false);
          break;
        case this.$store.getters.t("polling"):
          this.controlSideBarHandler('polling', 'off');
          break;
      }
      this.eventBus.emit("close-drop-down");
    },
    getSelectedItemInMoreDropDownParticipantMobile(item) {
      const selectedItem = this.moreDropDownItemsForParticipantMobile.find(
          (dropDownItem) => dropDownItem.label === item
      );
      switch (selectedItem.label) {
        case this.$store.getters.t("chat"):
          this.controlSideBarHandler("chat", "off");
          break;
        case this.$store.getters.t("participant-list"):
          this.controlSideBarHandler("participants", "off");
          break;
        case this.$store.getters.t("change-devices"):
          this.isToggled = !this.isToggled
          this.eventBus.emit('TOGGLE_SETTINGS_PANEL')
          break;
        case this.$store.getters.t("change-video-quality"):
          this.eventBus.emit('TOGGLE_VIDEO_QUALITY')
          break;
        case this.$store.getters.t("polling"):
          this.controlSideBarHandler('polling', 'off');
          break;
        case this.$store.getters.t("change-layout"):
          this.controlMeetingHandler('changeLayout')
          break;
      }
      this.eventBus.emit("close-drop-down");
    },
    getSelectedItemInNewFeaturesDropDown(item) {
      this.$emit("select-new-feature", item);
      this.eventBus.emit("close-drop-down");
    },
    getSelectedItemPolling(item) {
      const selectedItem = this.dropDownItemsPolling.find(
          (dropDownItem) => dropDownItem.label === item
      );
      this.isCreatePollOpened = true
      this.whichPollingItem = selectedItem.label
      this.dropDownPolling.flag = false
    },
    getSelectedItemShareDropDown(item) {
      const selectedItem = this.ShareDropDownItems.find(
          (dropDownItem) => dropDownItem.label === item
      );
      switch (selectedItem.label) {
        case this.$store.getters.t("share_screen"):
          this.controlMeetingHandler('share', 'on')
          break;
        case this.$store.getters.t("share_video_screen"):
          this.controlMeetingHandler("video-share", "on");
          break;
      }
      this.eventBus.emit("close-drop-down");
    },
    controlMeetingHandler(controllerType, status) {
      // this.eventBus.emit('share-started-in-jitsi')
      this.$emit("control-meeting-handler", controllerType, status);
      if (controllerType === 'share') {
        this.isShareModalOpen = false
      }
      if (controllerType === 'record' && status === 'end') {
        this.isMeetingRecord = false
      }
    },
    controlSideBarHandler(sideBarType, status) {
      this.eventBus.emit('chat-notification')
      this.$emit("control-side-bar-handler", sideBarType, status);
    },
    controlMoreOptionsHandler(sideBarType, status) {
      this.$emit("control-more-options-handler", sideBarType, status);
    },
    togglePollingDropDown() {
      this.isPollingMiniDropDownOpen = !this.isPollingMiniDropDownOpen;
      this.isProceedingsMiniDropDownOPen = false;
      // this.sideBarIsVisible = false;
    },
    closePollingDropDown() {
      this.isPollingMiniDropDownOpen = false;
    },
    openPolling(pollingId, pollingType, isAnonymous) {
      this.$emit("open-polling", pollingId, pollingType, isAnonymous);
      nextTick(() => {
        this.isPollingMiniDropDownOpen = false;
      });
    },
    fullScreenPage() {
      const elem = document.documentElement;
      if (
          (document.fullScreenElement !== undefined &&
              document.fullScreenElement === null) ||
          (document.msFullscreenElement !== undefined &&
              document.msFullscreenElement === null) ||
          (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
          (document.webkitIsFullScreen !== undefined &&
              !document.webkitIsFullScreen)
      ) {
        if (elem.requestFullScreen) {
          elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
          elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
        this.isFullScreen = true;
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.isFullScreen = false;
      }
    },
    openProceedings() {
      this.$emit("open-proceedings");
    },
    closeProceedingsDropDown() {
      this.isProceedingsMiniDropDownOPen = false;
    },
    toggleProceedingsDropDown() {
      this.isProceedingsMiniDropDownOPen = !this.isProceedingsMiniDropDownOPen;
      this.isPollingMiniDropDownOpen = false;
      // this.sideBarIsVisible = false;
    },
    openConfirmationProceedings(data) {
      this.$emit("open-confirmation-proceedings", data);
      this.closeProceedingsDropDown();
    },
    statMethod(stat) {
      if (stat) {
        this.moreDropDownItems[this.moreDropDownItems.length - 1].label =
            this.$store.getters.t("deny-moderator-substitution");
      } else {
        this.moreDropDownItems[this.moreDropDownItems.length - 1].label =
            this.$store.getters.t("active-moderator-substitution");
      }
    },
    openBoardSharing() {
      this.isShareModalOpen = false
      this.isBoardColorDialogOpen = true
    },
    closeBoardColorModal() {
      this.isBoardColorDialogOpen = false
      this.isBoardBlack = false
      this.isBoardWhite = false
    },
    chooseWhiteColor() {
      this.isBoardBlack = false
      this.isBoardWhite = !this.isBoardWhite
    },
    chooseBlackColor() {
      this.isBoardWhite = false
      this.isBoardBlack = !this.isBoardBlack
    },
    openWhiteBoard() {
      this.isBoardColorDialogOpen = false
      const color = this.isBoardWhite ? '#fff' : "#000000"
      this.isBoardShared = true
      this.controlMoreOptionsHandler("whiteBoard", true);
      this.eventBus.emit('board-color', color)
      // others_handler.selectBackgroundColor(color)
      this.isBoardBlack = false
      this.isBoardWhite = false
    },
    showMeetingDetails() {
      this.isMeetingInfoShowed = true
      this.restClientMeetingAttribute.getMeetingInfo(this.$store.getters.roomId).then((response) => {
        this.roomInfo = response
        console.error(response)
      }).catch((error) => {
        console.error(error)
      })
    },
    ToggleToolBarInMobile() {
      this.isToggled = !this.isToggled
      this.$emit('toggle-in-mobile', this.isToggled)
    }

  },
  created() {
  },
  mounted() {
    this.eventBus.on('sub-moderator-is-active',()=>{
      this.moreDropDownItems[0].label =
          this.$store.getters.t("deny-moderator-substitution");
    })
    this.eventBus.on('screen-is-full-size',()=>{
      this.isFullScreen = true
    })
    this.eventBus.on('isModeratorMaximizeActiveSpeaker',()=>{
      this.moreDropDownItems = [
        // {
        //   label: this.$store.getters.t("change-video-quality"),
        // },
        // {
        //   label: this.$store.getters.t("change-meeting-video-quality"),
        // },
        // {
        //   label: this.$store.getters.t("pdf-sharing"),
        // },
        // {
        //   label: this.$store.getters.t("block-room")
        // },
        // {
        //   label: this.$store.getters.t("change-layout")
        // },
        {
          label: this.$store.getters.t("active-moderator-substitution"),
        },
        {
          label: this.$store.getters.t("turn-off-active-speaker"),
        },
        {
          label: this.$store.getters.t("disableRotation"),
        },
        {
          label:  this.$store.getters.t("minimize_active_speaker"),
        },
      ]
      this.moreDropDownItemsForModeratorInMobile = [
        {
          label: this.$store.getters.t("active-moderator-substitution"),
        },
        {
          label: this.$store.getters.t("polling"),
        },
        {
          label: this.$store.getters.t("turn-off-active-speaker"),
        },
        {
          label: this.$store.getters.t("change-layout")
        },
        {
          label:  this.$store.getters.t("minimize_active_speaker"),
        },
        {
          label: this.$store.getters.t("disableRotation"),
        },

      ]
    })
    this.eventBus.on("your_permission",()=>{
      this.eventBus.emit('change-mic-from-pre-meeting', this.$store.getters.isAudioMuted)
    })
    if (this.isMobile) {
      this.$refs['footer-container'].style.justifyContent = 'center'
    }
    if (this.$store.getters.isVideoMuted) {
      this.eventBus.emit('change-camera-off')
    }
    this.eventBus.on('guest-user-joined', () => {
      this.isGuest = true
    })
    this.eventBus.on('view-polling-result', () => {
      console.error('gggggggggeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeet')
      this.isCreatePollOpened = true
    })
    // this.eventBus.on('is-sub-moderator-activated', (data) => {
    //   this.isModeratorSubstituteActivated = data
    // })
    this.eventBus.on("cancel-my-board-permission", () => {
      this.isBoardShared = false
    })
    this.eventBus.on('cancel-full-screen', () => {
      this.isFullScreen = false
    })
    // const foundIndex = this.moreDropDownItems.findIndex((el) => {
    //   return el.label === this.$store.getters.t("active-moderator-substitution")
    // })
    // if (!this.roomHasModerator && !this.$store.getters.amIGuest && foundIndex !== -1) {
    //
    //   this.moreDropDownItems.splice(foundIndex, 1);
    // }
    // if (this.$store.getters.amIGuest && this.roomHasModerator && foundIndex !== -1) {
    //   this.moreDropDownItems.splice(foundIndex, 1);
    // }

    // this.eventBus.on('audio-is-on',()=>{
    //   this.controlMeetingHandler('microphone',true)
    // })

    if (this.amIModerator) {
      let data = localStorage.getItem(`moderator-substitute`);
      data = JSON.parse(data);
      if (data?.roomId === this.$store?.getters?.roomId) {
        if (data?.stat) {
          this.moreDropDownItems[this.moreDropDownItems.length - 1].label =
              this.$store.getters.t("deny-moderator-substitution");
          this.moreDropDownItemsMobile[this.moreDropDownItemsMobile.length - 1].label =
              this.$store.getters.t("deny-moderator-substitution");
        } else {
          this.moreDropDownItems[this.moreDropDownItems.length - 1].label =
              this.$store.getters.t("active-moderator-substitution");
          this.moreDropDownItemsMobile[this.moreDropDownItemsMobile.length - 1].label =
              this.$store.getters.t("active-moderator-substitution");
        }
      }
    }

    // this.eventBus.on("toggle-moderator-substitute", ({stat, permission}) => {
    //   try {
    //     this.isModeratorSubstituteActivated = stat;
    //     // this.$emit('isModeratorSubstituteActivated')
    //     // store.dispatch("setAmIModerator", stat);
    //     if (stat) {
    //       this.$store.dispatch('setSelectedModeratorSubstituteId', this.$store.getters.myUserId)
    //       this.$store.dispatch('setAmISelectedModeratorSubstitute', true)
    //       nextTick(() => {
    //         this.eventBus.emit("notification", {
    //           title: "پیام",
    //           type: "success",
    //           bodyText: this.$store.getters.t("meeting-management-available"),
    //           time: 5000,
    //         });
    //       })
    //       const permissions = ["microphone", "share", "videoSharing", "pdfSharing", "board"];
    //       for (let i = 0; i < permissions.length; i++) {
    //         const type = permissions[i];
    //         this.eventBus.emit("myPermissionsChanged", {type, stat});
    //       }
    //     } else {
    //       this.isBoardShared = false
    //       if (this.amISelectedModerator) {
    //         // room_handler.selectedModeratorLeft()
    //       }
    //       this.$store.dispatch('setAmISelectedModeratorSubstitute', false)
    //       for (const statKey in permission) {
    //         this.eventBus.emit("myPermissionsChanged", {type: statKey, stat: permission[statKey]});
    //       }
    //       nextTick(() => {
    //         this.eventBus.emit("notification", {
    //           title: "پیام",
    //           type: "warning",
    //           bodyText: this.$store.getters.t("meeting-management-unavailable"),
    //           time: 5000,
    //         });
    //       });
    //       this.eventBus.emit("myPermissionsChanged", {type: "board", stat: false});
    //
    //     }
    //
    //
    //   } catch (error) {
    //     console.error(error);
    //   }
    // });
    // this.eventBus.on("toggle-moderator-substitute", ({stat}) => {
    //   this.isModeratorSubstituteActivated = stat;
    //   if (stat) {
    //     this.eventBus.emit("notification", {
    //       title: "پیام",
    //       type: "success",
    //       bodyText: this.$store.getters.t("meeting-management-available"),
    //       time: 5000,
    //     });
    //     new MiniDropDownHandler(
    //         this.$refs["more-drop-down-container"],
    //         this.moreDropDown
    //     );
    //     new MiniDropDownHandler(
    //         this.$refs["more-drop-down-container-mobile"],
    //         this.moreDropDown
    //     );
    //     new MiniDropDownHandler(
    //         this.$refs["more-drop-down-container-participant"],
    //         this.moreDropDown
    //     );
    //     new MiniDropDownHandler(
    //         this.$refs["drop-down-container-polling"],
    //         this.dropDownPolling
    //     );
    //   } else {
    //     this.eventBus.emit("notification", {
    //       title: "پیام",
    //       type: "success",
    //       bodyText: this.$store.getters.t("meeting-management-unavailable"),
    //       time: 5000,
    //     });
    //   }
    //
    // });
    // this.eventBus.on("toggle-custom-moderator-substitute", ({stat, permission}) => {
    //   try {
    //     this.isModeratorSubstituteActivated = stat;
    //     // this.$emit('isModeratorSubstituteActivated')
    //     // store.dispatch("setAmIModerator", stat);
    //     if (stat) {
    //       this.$store.dispatch('setSelectedModeratorSubstituteId', this.$store.getters.myUserId)
    //       this.$store.dispatch('setAmISelectedModeratorSubstitute', true)
    //       nextTick(() => {
    //         this.eventBus.emit("notification", {
    //           title: "پیام",
    //           type: "success",
    //           bodyText: this.$store.getters.t("meeting-management-available"),
    //           time: 5000,
    //         });
    //       })
    //       const permissions = ["microphone", "share", "videoSharing", "pdfSharing", "board"];
    //       for (let i = 0; i < permissions.length; i++) {
    //         const type = permissions[i];
    //         this.eventBus.emit("myPermissionsChanged", {type, stat});
    //       }
    //     } else {
    //       this.isBoardShared = false
    //       if (this.amISelectedModerator) {
    //         // room_handler.selectedModeratorLeft()
    //       }
    //       this.$store.dispatch('setAmISelectedModeratorSubstitute', false)
    //       for (const statKey in permission) {
    //         this.eventBus.emit("myPermissionsChanged", {type: statKey, stat: permission[statKey]});
    //       }
    //       nextTick(() => {
    //         this.eventBus.emit("notification", {
    //           title: "پیام",
    //           type: "warning",
    //           bodyText: this.$store.getters.t("meeting-management-unavailable"),
    //           time: 5000,
    //         });
    //       });
    //       this.eventBus.emit("myPermissionsChanged", {type: "board", stat: false});
    //
    //     }
    //
    //
    //   } catch (error) {
    //     console.error(error);
    //   }
    // });


    this.eventBus.on("is-focused", () => {
      this.isInputFocused = true;
    });
    this.eventBus.on("is-blured", () => {
      this.isInputFocused = false;
    });
    this.eventBus.on("is-writing-paragraph", (data) => {
      this.isWritingParagraph = data;
    });


    window.addEventListener("keydown", (e) => {
      if (
          !this.isCreatePollOpened &&
          !this.isConfirmPollingOpen &&
          !this.isInputFocused &&
          !this.isProceedingsOpen &&
          !this.isWritingParagraph &&
          this.micControlAllowed &&
          this.micStatus &&
          e.keyCode === 32 &&
          !e.repeat
      ) {
        this.controlMeetingHandler("microphone", false);
        this.isSpaceBarPress = true;
      } else if (
          !this.isCreatePollOpened &&
          !this.isConfirmPollingOpen &&
          !this.isInputFocused &&
          !this.isProceedingsOpen &&
          this.micControlAllowed &&
          !this.micStatus &&
          e.keyCode === 32 &&
          !e.repeat
      ) {
        this.controlMeetingHandler("microphone", true);
        this.isSpaceBarPress = true;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (
          !this.isProceedingsOpen &&
          !this.isConfirmPollingOpen &&
          !this.isCreatePollOpened &&
          !this.isInputFocused &&
          this.micControlAllowed &&
          this.micStatus &&
          e.keyCode === 32 &&
          this.isSpaceBarPress
      ) {
        this.isSpaceBarPress = false;
        this.controlMeetingHandler("microphone", false);
      } else if (
          !this.isProceedingsOpen &&
          !this.isConfirmPollingOpen &&
          !this.isCreatePollOpened &&
          !this.isInputFocused &&
          this.micControlAllowed &&
          !this.micStatus &&
          e.keyCode === 32 &&
          this.isSpaceBarPress
      ) {
        this.isSpaceBarPress = false;
        this.controlMeetingHandler("microphone", true);
      }
    });
    // this.eventBus.on("board-activation", (stat) => {
    //   if (stat === true) {
    //     this.moreDropDownItems[5].label =this.$store.getters.t("close-whiteboard");
    //   } else {
    //     this.moreDropDownItems[5].label = this.$store.getters.t("white-board");
    //   }
    // });

    new MiniDropDownHandler(
        this.$refs["more-drop-down-container"],
        this.moreDropDown
    );
    new MiniDropDownHandler(
        this.$refs["more-drop-down-container-mobile"],
        this.moreDropDown
    );
    new MiniDropDownHandler(
        this.$refs["more-drop-down-container-participant"],
        this.moreDropDown
    );
    new MiniDropDownHandler(
        this.$refs["drop-down-container-polling"],
        this.dropDownPolling
    );
    new MiniDropDownHandler(
        this.$refs["shareDropDown"],
        this.dropDownShare
    );
    new MiniDropDownHandler(
        this.$refs["more-drop-down-container-mobile"],
        this.moreDropDown
    );
    new MiniDropDownHandler(
        this.$refs["more-drop-down-container-participant-mobile"],
        this.moreDropDown
    );
    this.eventBus.on('start-recording-from-browser-api', () => {
      this.isMeetingRecord = true
      this.$emit('record-meeting-notification', true)
      // this.eventBus.emit("notification", {
      //   title: "پیام",
      //   type: "success",
      //   bodyText: this.$store.getters.t('recording-meeting'),
      //   time: 5000,
      // });

    })
    this.eventBus.on('end-recording-from-browser-api', () => {
      this.isMeetingRecord = false
      this.$emit('record-meeting-notification', false)
    })
    this.eventBus.on('stop-recording-from-browser-api', () => {
      this.isMeetingRecord = false
      this.$emit('record-meeting-notification', false)
    })
    this.eventBus.on('sub-moderator-activated-for-moderator', (data) => {
      if (data) {
        this.moreDropDownItems[this.moreDropDownItems.length - 1].label =
            this.$store.getters.t("deny-moderator-substitution");
      }
    })
    this.eventBus.on('close-mini-dropdown', () => {
      this.moreDropDown = {flag: false}
      this.moreDropDownMobile = {flag: false}
      this.moreDropDownParticipant = {flag: false}
      new MiniDropDownHandler(
          this.$refs["more-drop-down-container"],
          this.moreDropDown
      );
      new MiniDropDownHandler(
          this.$refs["more-drop-down-container-participant"],
          this.moreDropDown
      );
      new MiniDropDownHandler(
          this.$refs["drop-down-container-polling"],
          this.dropDownPolling
      );

    })
    this.eventBus.on('hide-toggle-control-meeting', () => {
      this.showToggleButton = false
      this.isToggled = false
    })
    this.eventBus.on('show-toggle-control-meeting', () => {
      this.showToggleButton = true
      this.isToggled = false
    })
  },
};
</script>
<style scoped>
.conference-footer {
  width: 100%;
  height: 5.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6rem;
  border-top: 0.1rem solid #75758F;
  background-color: rgba(12, 12, 12, 0.3);
}

.conference-footer__mobile {
  width: 100%;
  height: 5.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  border-top: 0.1rem solid #75758F;
  background-color: rgba(12, 12, 12, 0.3);
}

.toggle-button__shape {
  border-radius: 0.4rem 0.4rem 0 0;
  background-color: #75758F;
  position: absolute;
  top: -2.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 4rem;
  height: 2.5rem;
  border: 0.1rem solid #75758F;
  display: flex;
  align-items: center;
  justify-content: center
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.conference-footer__meeting-title {
  //position: relative; //top: 2.5rem; //right: 1rem; height: 100%;
  direction: rtl;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 18.5rem;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  position: relative;
}

.conference-footer__meeting-title > span {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
}

.conference-footer__meeting-title > div {
  color: white;
  font-size: 1rem;
  font-weight: 400;
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  align-items: center;
}

.column-separator {
  width: 0;
  height: 1rem;
  border: 0.1rem solid white;
}

.conference-footer__control-meeting {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.control-icon-fragment {
  position: relative;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 1rem;
  cursor: pointer;
  background-color: white;
  direction: rtl;
}
.control-icon-fragment-with-setting {
  position: relative;
  width: 6rem;
  height: 4rem;
  border-radius:2rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-around;
  align-items: center;
  margin: 0 1rem;
  background-color: white;
  direction: rtl;
  padding-right: 0.4rem;
}

.control-icon-fragment__share {
  position: relative;
  width: 6rem;
  height: 4rem;
  border-radius: 2rem;
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-around;
  align-items: center;
  margin: 0 1rem;
  cursor: pointer;
  background-color: white;
}

.control-icon-fragment--disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

.leave-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 1rem;
  height: 4rem;
  width: 6rem;
  border-radius: 2rem;
  cursor: pointer;
  background-color: #EC3737;
}

.conference-footer > div:last-child {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
}

.conference-footer > div:last-child > div {
  margin: 0 1rem;
}

.conference-footer > div:last-child > div {
  position: relative;
}

.conference-footer > div:last-child > img {
  margin: 0 1rem;
  cursor: pointer;
}

.video-sharing-icon-fragment {
  margin: 0 1rem;
  width: 2.2rem;
  height: 2.2rem;
  cursor: pointer;
}

.video-sharing-icon-fragment > img {
  width: 100%;
  height: 100%;
}

.options {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.4rem;
  color: white;
}

.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 15px;
  height: 3px;
  top: 0.1rem;
  left: 0.2rem;

  animation: infinite alternate;
  z-index: 10000;
}

.lds-ellipsis div {
  position: absolute;
  top: 100%;
  /*transform: translateY(100%);*/
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgb(252, 250, 250);
  z-index: 10000;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.unopened__polling {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  margin: 0;
  direction: ltr;
  max-height: 22rem;
  overflow-y: auto;
}

.unopened__polling--container {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, -110%);
  z-index: 1000;
  width: 30rem;
  border: solid 0.1rem lightgray;
  background-color: white;
  border-radius: 1rem;
  padding: 2.5rem 1.5rem;
  cursor: auto;
  -webkit-box-shadow: -2px 8px 19px -3px #000000;
  box-shadow: -2px 8px 19px -3px #000000;
}

.close-polling {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
}

.list-of-polls {
  font-size: 1.3rem;
  width: 100%;
  padding: 0.7rem 0.5rem;
  display: flex;
  flex-direction: row;
  direction: rtl;
  align-items: center;

  margin: 0.5rem 0;
  border: solid 1px #c5c6c7;
  border-radius: 1.6rem;
  cursor: pointer;
}

.list-of-polls-ltr {
  font-size: 1.3rem;
  width: 100%;
  padding: 0.7rem 0.5rem;
  display: flex;
  flex-direction: row-reverse;
  direction: rtl;
  align-items: center;
  height: 4.6rem;
  margin: 0.5rem 0;
  border: solid 1px #c5c6c7;
  border-radius: 1.6rem;
  cursor: pointer;
}

.polling__text {
  max-width: 37rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.polling__text-ltr {
  max-width: 37rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: ltr;
  margin-left: 1rem;
}

.label-color {
  margin: 0 0.5rem;
  cursor: pointer
}


.lds-ellipsis div:nth-child(1) {
  left: 0;
  animation: lds-ellipsis1 0.5s infinite;
}

.lds-ellipsis div:nth-child(2) {
  left: 0;
  animation: lds-ellipsis2 0.5s infinite;
}

.lds-ellipsis div:nth-child(3) {
  left: 4px;
  animation: lds-ellipsis2 0.5s infinite;
}

.lds-ellipsis div:nth-child(4) {
  left: 8px;
  animation: lds-ellipsis3 0.5s infinite;
}
.animated-recording-icon{
  animation: pulse 1s infinite ease-in-out;
}
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(4px, 0);
  }
}

@keyframes ripple {
  from {
    opacity: 1;
    transform: scale(0);
  }
  to {
    opacity: 0;
    transform: scale(2);
  }
}

@keyframes ripple {
  0% {
    width: 15px;
    height: 15px;
    opacity: 1;
  }
  96% {
    width: 30px;
    height: 30px;
    opacity: 0;
  }
  100% {
    width: 35px;
    height: 35px;
    opacity: 0;
  }
}

.notification-badge {
  position: absolute;
  width: 1.3rem;
  height: 1.3rem;
  background-color: #292933;
  border-radius: 50%;
  bottom: 0.1rem;
  right: -0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.notification-badge div {
  width: 1.1rem;
  height: 1.1rem;
  background-color: #2AB459;
  border-radius: 50%;
  position: relative;
}

img {
  cursor: pointer;
}

.header-close-icon-share--modal {
  width: 55rem;
  height: 3rem;
  display: flex;
  justify-content: left;

}

.header-close-icon-share--modal span {
  cursor: pointer;
}

.sharing-fragment {
  width: 55rem;
  height: 15rem;
  gap: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sharing-fragment > div {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.sharing-icon-container {
  width: 8rem;
  height: 8rem;
  border: 0.1rem solid #4cc9b7;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.sharing-icon-container:hover {
  border: 0.3rem solid #95d1cc;
  -webkit-box-shadow: -1px 6px 15px -4px rgba(0, 0, 0, 0.62);
  box-shadow: -1px 6px 15px -4px rgba(0, 0, 0, 0.62);
}

.sharing-icon-container-disable {
  width: 8rem;
  height: 8rem;
  border: 0.1rem solid darkgray;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: not-allowed;
}

.meeting-information-in-conference {
  position: absolute;
  width: 30rem;
  border-radius: 0.8rem;
  border: 0.1rem solid transparent;
  background-color: white;
  z-index: 10;
  bottom: 5.5rem;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  direction: rtl;
  padding: 0.8rem 1.6rem;
}

.meeting-information-in-conference > div {
  display: flex;
  flex-direction: column;
  font-size: 1.2rem;
  font-weight: 400;
}

.meeting-information-in-conference > div > span:first-child {
  font-size: 1.2rem;
  font-weight: 700;
}

@media (max-width: 580px) {
  .header-close-icon-share--modal {
    width: 90vw;

  }

  .sharing-fragment {
    width: 90vw;
    height: 30rem;
    gap: 5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
}

@media (max-width: 280px) {
  .header-close-icon-share--modal {
    width: 90vw;

  }

  .sharing-fragment {
    width: 90vw;
    height: 30rem;
    gap: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  .sharing-icon-container {
    width: 5rem;
    height: 5rem;
    border: 0.1rem solid #4cc9b7;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .sharing-icon-container-disable {
    width: 5rem;
    height: 5rem;
    border: 0.1rem solid darkgray;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: not-allowed;
  }
}
</style>

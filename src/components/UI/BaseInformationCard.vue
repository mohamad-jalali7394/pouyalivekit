<template>
  <div class="polling-information-container">
    <div :class=" $i18n.locale !== 'en' ?  'polling-information-header' : 'polling-information-header-ltr'" v-if="$slots['modal-header']">
     <slot></slot>
    </div>
    <div class="polling-information-body">
      <div
          :class="$i18n.locale !== 'en' ?  'polling-information-body-question-fragment' : 'polling-information-body-question-fragment-ltr'">
        <div
            :class="  $i18n.locale !== 'en' ?  'polling-information-body-question' : 'polling-information-body-question-ltr'">
          <div style="height: 2rem">
            <div style="height: 2rem">
                  <span>
                    {{ $store.getters.t('proceedings-brief') }}
                  </span>
              <span style="max-width: 90%;white-space: pre-line;overflow-wrap: break-word">
            {{ proceedingsNumber }}
        </span>
            </div>

          </div>
          <div style="height: 2rem">
             <span>
               {{ $store.getters.t('answers-number') }}
            </span>
            <span style="color: #00abfc">
            {{ proceedingsResultList.length }}
        </span>
          </div>
          <div style="height: 2rem">
            <span>{{ $store.getters.t('creation-time') }} </span>
            <span style="color: #00abfc">{{createDate}}</span>
          </div>
        </div>
      </div>
      <div
          :style="{width: '100%','text-align': $i18n.locale !== 'en' ? 'right' : 'left',direction: $i18n.locale !== 'en' ? 'rtl' : 'ltr'}">
        <span style="width: 20px">
            <svg v-if="$i18n.locale !== 'en'" @click="openDetailInformation"
                 :class="isInformationShown ? $i18n.locale!=='en' ?  'rotation-svg-90' :  'rotation-svg-90-ltr' :$i18n.locale!=='en' ? 'rotation-svg-zero' : 'rotation-svg-zero-ltr' "
                 style="width: 15px ; cursor: pointer;position: relative;top: 5px;z-index: 1000" data-name="Layer 1"
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                  d="M16.617,22a.5082.5082,0,0,0,.3583-.8685L7.966,12.1749l9.1467-9.31a.5081.5081,0,0,0-.7245-.7127l-9.5011,9.67a.5083.5083,0,0,0,.004.7166l9.3676,9.313A.5079.5079,0,0,0,16.617,22Z"/>
            </svg>
          <img draggable="false" v-else src="/img/arrow-right.svg" alt="not-loaded"
               style="width: 20px ; cursor: pointer;position: relative;top:5px;z-index: 1000"
               @click="openDetailInformation"
               :class="isInformationShown ? 'rotation-svg-90-ltr' :'rotation-svg-zero-ltr' ">
            </span>

        <span>{{ $store.getters.t('more-detail') }}</span>
      </div>
    </div>
    <div :class="isInformationShown ? 'height-animation-expand' : 'height-animation-collapse'">
      <div style="margin-bottom: 1rem;color: #00abfc">مطالب صورت جلسه</div>
      <div :style="{direction: $i18n.locale === 'fa' ? 'rtl':'ltr'}" class="preview-meeting-result-container" ref="meetingResultFragment">
        <div class="preview-meeting-result">
          <div :class="(proceedingsDescription !== '') ?'meeting-result-text-container' : 'is-not-text'">
            {{(proceedingsDescription === '') ? $store.getters.t("no-topic-set") : proceedingsDescription}}
          </div>
        </div>
      </div>
      <div v-if="proceedingsNumber !== 0" style="max-height:19.5rem;overflow-y: auto">
        <div class="table-container--polling">
          <div class="table__header--polling" :style="{direction: $i18n.locale !== 'en'  ? 'rtl' : 'ltr'}">
            <span>{{ $store.getters.t("full-name") }}</span>
            <span>اولین ورود</span>
            <span>مدت زمان حضور</span>
            <span>{{ $store.getters.t("answer") }}</span>
          </div>
          <div class="ul-container">
            <ul>
              <participant-list-element
                  :is-proceedings-information="true"
                  v-for="user in proceedingsResultList"
                  :key="user"
                  :participant-full-name="user.displayName"
                  :time-in="'2:48'"
                  :participant-agreement="user.agree"
                  :first-entrance="'10:58'"
              ></participant-list-element>
            </ul>
          </div>
        </div>
      </div>
      <div style="width: 100%;margin-top: 2rem;display: flex;justify-content: center;align-items: center">
        <button
            style="padding: 0.5rem 3rem; background-color: #00abfc;color: white;border: 0.1rem solid transparent;border-radius: 2rem;cursor: pointer"
            @click="downloadPdf({id:proceedingsId,meetingName:meetingTitle,proceedingsNumber:proceedingsNumber})">
          {{ $store.getters.t('download-pdf') }}
        </button>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: "BaseInformationCard"
}
</script>

<style scoped>

</style>
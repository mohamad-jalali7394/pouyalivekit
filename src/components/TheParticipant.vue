<template>
  <!--  <li class="participant">-->
  <!--    <div v-if="isAbsent " class="absents__participants"></div>-->

  <!--    <div class="participant__inner">-->
  <!--      <span-->
  <!--          v-if="isMobile === false"-->
  <!--          class="participant__name&#45;&#45;tool-tip"-->
  <!--          :style="{ visibility: isNameVisible }"-->
  <!--      >-->
  <!--        {{ participantName }}</span-->
  <!--      >-->
  <!--      <div-->
  <!--          style="display: flex; flex-direction: row; justify-content: space-between;align-items: center"-->
  <!--      >-->
  <!--        <div v-if="!disableParticipant" class="participant__icon">-->
  <!--          <img draggable="false" src="/img/avatar.svg" alt="not loaded" class="mic&#45;&#45;icon"/>-->
  <!--        </div>-->
  <!--        <div v-else class="participant__icon">-->
  <!--          <img draggable="false" src="/img/disableUser.png" alt="not loaded" class="mic&#45;&#45;icon" style="width:32px; height: 32px"/>-->
  <!--        </div>-->
  <!--        <div class="participant__name">-->
  <!--          <span-->
  <!--              ref="participant-name"-->
  <!--              @mouseenter="showNameToolTip"-->
  <!--              @mouseleave="hideNameToolTip"-->
  <!--          >-->
  <!--            {{ participantName }}-->
  <!--          </span>-->
  <!--          <div v-if="participantRole === 'Moderator' && amIModerator" class="moderator__name">-->
  <!--            <span>{{ "(" + " " }}</span>-->
  <!--            <span> {{ $t("moderator") }} </span>-->
  <!--            <span>{{ " " + ")" }}</span>-->
  <!--          </div>-->
  <!--          <div-->
  <!--              v-else-if="participantRole === 'Presenter'"-->
  <!--              class="moderator__name"-->
  <!--          >-->
  <!--            <span>{{ "(" + " " }}</span>-->
  <!--            <span> {{ $t("presenter") }} </span>-->
  <!--            <span>{{ " " + ")" }}</span>-->

  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      &lt;!&ndash;    <div class="participant"></div>&ndash;&gt;-->
  <!--      <div class="participant__moderator-controls&#45;&#45;1">-->
  <!--        <div-->
  <!--            class="moderator-controls"-->
  <!--            v-if="-->
  <!--            (amIModerator && participantStatus === 'ONLINE') ||-->
  <!--              (amISub && participantStatus === 'ONLINE')-->
  <!--          "-->
  <!--        >-->
  <!--          <div-->
  <!--              class="moderator-controls__item"-->
  <!--              v-if="-->
  <!--              !isWebinar ||-->
  <!--                (isWebinar &&-->
  <!--                  (participantRole === 'Presenter' ||-->
  <!--                    participantRole === 'Moderator'))-->
  <!--            "-->
  <!--          >-->
  <!--            <svg-->
  <!--                fill="#444"-->
  <!--                @click="changeCameraStatus('open')"-->
  <!--                style="cursor: pointer"-->
  <!--                v-if="-->
  <!--                permission.camera === true && permission.cameraAllow === true && !disableParticipant-->
  <!--              "-->
  <!--                data-name="Layer 1"-->
  <!--                xmlns="http://www.w3.org/2000/svg"-->
  <!--                viewBox="0 0 24 24"-->
  <!--            >-->
  <!--              <path-->
  <!--                  d="M24,16.31a1.7748,1.7748,0,0,1-.7475,1.0592,1.4218,1.4218,0,0,1-1.469.09c-.7573-.4006-1.4955-.8375-2.24-1.2617-.6163-.3509-1.2276-.7107-1.8474-1.0552a.3259.3259,0,0,1-.189-.3317q.0075-2.8216-.0011-5.6433A.3469.3469,0,0,1,17.71,8.82c1.2655-.7228,2.5414-1.4289,3.7849-2.1881a1.6133,1.6133,0,0,1,2.4673.9538c.0046.02.0246.0374.0374.0561Z"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M8.1093,4.9439q2.6589,0,5.3178-.001a2.6635,2.6635,0,0,1,2.2738,1.08,2.5719,2.5719,0,0,1,.5114,1.5744c.0041,2.9361.0117,5.8722-.0023,8.8083a2.6157,2.6157,0,0,1-2.7,2.6435q-5.4.0218-10.7995.0005A2.61,2.61,0,0,1,.0357,16.7822a2.6753,2.6753,0,0,1-.0228-.4666C.0117,13.45.04,10.5836,0,7.7183A2.7047,2.7047,0,0,1,2.7681,4.9405C4.5484,4.9558,6.3289,4.9439,8.1093,4.9439Z"-->
  <!--              />-->
  <!--            </svg>-->
  <!--            <svg-->
  <!--                fill="#444"-->
  <!--                @click="handleCameraDisable()"-->
  <!--                style="cursor: pointer"-->
  <!--                v-if="-->
  <!--                permission.camera === true && permission.cameraAllow === false && !disableParticipant-->
  <!--              "-->
  <!--                data-name="Layer 1"-->
  <!--                xmlns="http://www.w3.org/2000/svg"-->
  <!--                viewBox="0 0 24 24"-->
  <!--            >-->
  <!--              <path-->
  <!--                  d="M24,17.66a1.7746,1.7746,0,0,1-.719,1.0592,1.3235,1.3235,0,0,1-1.4129.09c-.7284-.4006-1.4384-.8375-2.1547-1.2617-.5928-.3509-1.1807-.7107-1.7769-1.0552a.3284.3284,0,0,1-.1818-.3317q.0072-2.8216-.001-5.6433a.3488.3488,0,0,1,.1969-.3464c1.2171-.7228,2.4443-1.4289,3.64-2.1881a1.5356,1.5356,0,0,1,2.3731.9538.1952.1952,0,0,0,.036.056Z"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M8.01,6.2984l.5444-.0038s3.5452.0023,5.3178-.001a2.6635,2.6635,0,0,1,2.2738,1.08,2.5718,2.5718,0,0,1,.5114,1.5743c.0038,2.763.0108,3.2949,0,6.0578Z"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M20.1618,20.7357,1.9192,2.4931a.5454.5454,0,0,0-.7713.7712L4.242,6.3584l-.0656-.06c-.9912.0016-.4172.0015-1.4083-.007A2.7047,2.7047,0,0,0,0,9.069C.04,11.9342.0116,14.8.0129,17.6663a2.6753,2.6753,0,0,0,.0228.4666A2.61,2.61,0,0,0,2.71,20.4005c3.6.0123,7.6448.014,11.2446-.0005a2.6172,2.6172,0,0,0,2.5493-1.78l2.8865,2.8866a.5454.5454,0,0,0,.7713-.7713Z"-->
  <!--              />-->
  <!--            </svg>-->

  <!--            <svg-->
  <!--                fill="lightgray"-->
  <!--                @click="changeCameraStatus('close')"-->
  <!--                style="cursor: pointer"-->
  <!--                v-if="permission.camera === false && !disableParticipant"-->
  <!--                data-name="Layer 1"-->
  <!--                xmlns="http://www.w3.org/2000/svg"-->
  <!--                viewBox="0 0 24 24"-->
  <!--            >-->
  <!--              <path-->
  <!--                  d="M21.9694,17.6521a1.6813,1.6813,0,0,1-.7358-.1718c-.5216-.252-1.034-.5207-1.5454-.79l-1.1448-.6c-.3434-.18-.686-.361-1.0331-.5373a.6148.6148,0,0,1-.3656-.5909q.0069-2.3432-.0009-4.6844a.6344.6344,0,0,1,.3785-.6037l.8383-.4358c.87-.45,1.74-.9,2.5933-1.3756a2.034,2.034,0,0,1,1.7855-.1061,1.6715,1.6715,0,0,1,.96,1.0663l.0166.024.0416.1634-.0194,7.3118a1.83,1.83,0,0,1-.8438,1.0746A1.8939,1.8939,0,0,1,21.9694,17.6521Zm-.0055-9.3457a1.3651,1.3651,0,0,0-.6647.1745c-.86.48-1.7366.9333-2.6127,1.3866l-.8374.4349c.01,1.5344.0093,3.0973.0047,4.66.3268.1358.6739.3176,1.02.5l1.1448.5992c.5041.2659,1.0091.5308,1.5233.7792a1.0341,1.0341,0,0,0,1.01-.0656,1.0925,1.0925,0,0,0,.4967-.63l-.025-7.106a.9565.9565,0,0,0-.5668-.6333A1.236,1.236,0,0,0,21.9639,8.3064Z"-->
  <!--                  stroke="#000"-->
  <!--                  stroke-miterlimit="10"-->
  <!--                  stroke-width="0.5"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M16.4388,16.006l-9.53-9.8608,1.6027-.012c.0037,0,3.2645.0027,4.8958-.001h.0046a2.8936,2.8936,0,0,1,2.47,1.2168,2.937,2.937,0,0,1,.5613,1.7652l.0028,1.66c.0028,1.3479.0046,2.1243-.0028,4.0695ZM9.1251,7.0785l6.3767,6.5982c.0027-1.1605.0018-1.86-.001-2.9L15.4981,9.116a2.01,2.01,0,0,0-.38-1.21,1.9458,1.9458,0,0,0-1.7061-.8281h-.0028C12.2151,7.0813,10.15,7.08,9.1251,7.0785Z"-->
  <!--                  stroke="#000"-->
  <!--                  stroke-miterlimit="10"-->
  <!--                  stroke-width="0.5"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M15.5671,18.2587l2.5977,2.7289a.4741.4741,0,0,0,.6941,0,.534.534,0,0,0,0-.7292L2.4418,3.0124a.4742.4742,0,0,0-.6941,0,.5342.5342,0,0,0,0,.7292L4.2633,6.3842l.21.2255Z"-->
  <!--                  stroke="#000"-->
  <!--                  stroke-miterlimit="10"-->
  <!--                  stroke-width="0.5"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M8.2136,20.4235c-1.7209,0-3.4417-.0037-5.062-.0092A2.8694,2.8694,0,0,1,.28,17.8773a2.7536,2.7536,0,0,1-.0267-.47l.0037-2.4991c.0046-1.8917.01-3.7824-.0148-5.6732a3.1732,3.1732,0,0,1,.901-2.272A2.9067,2.9067,0,0,1,3.2107,6.13c.8881.0074,1.1106.0083,2.0024.0064h.2041L16.4486,17.7712l-.084.2658a3.6411,3.6411,0,0,1-3.09,2.3764C11.6544,20.42,9.9335,20.4235,8.2136,20.4235ZM3.1821,7.0758a1.8814,1.8814,0,0,0-1.3682.5548,2.2156,2.2156,0,0,0-.626,1.5916c.025,1.8963.0194,3.7916.0148,5.6879L1.199,17.3566a2.3306,2.3306,0,0,0,.0139.3638,1.9149,1.9149,0,0,0,1.9424,1.7485c3.24.013,6.8779.0139,10.1156-.0009a2.7347,2.7347,0,0,0,2.0911-1.47L5.011,7.0822c-.7266.0037-.9869.0009-1.81-.0064Z"-->
  <!--                  stroke="#000"-->
  <!--                  stroke-miterlimit="10"-->
  <!--                  stroke-width="0.5"-->
  <!--              />-->
  <!--            </svg>-->
  <!--          </div>-->
  <!--          <div-->
  <!--              class="moderator-controls__item"-->
  <!--              v-if="-->
  <!--              !isWebinar ||-->
  <!--                (isWebinar &&-->
  <!--                  (participantRole === 'Presenter' ||-->
  <!--                    participantRole === 'Moderator'))-->
  <!--            "-->
  <!--          >-->
  <!--            <svg-->
  <!--                fill="#444"-->
  <!--                @click="changeMicStatus('open')"-->
  <!--                style="cursor: pointer"-->
  <!--                v-if="permission.mic === true && permission.micAllow === true && !disableParticipant"-->
  <!--                data-name="Layer 1"-->
  <!--                xmlns="http://www.w3.org/2000/svg"-->
  <!--                viewBox="0 0 24 24"-->
  <!--            >-->
  <!--              <path-->
  <!--                  d="M7.8751,24a.9255.9255,0,0,1-.6165-.617.8227.8227,0,0,1,.767-1.0673c.9369-.0167,1.8743-.0075,2.8115-.0091h.3175V20.0747c-.391-.0837-.7758-.1433-1.1473-.2493a7.54,7.54,0,0,1-5.2335-4.8321,7.3926,7.3926,0,0,1-.455-2.5889.8461.8461,0,0,1,1.6506-.272,2.3061,2.3061,0,0,1,.0652.4853,5.8449,5.8449,0,0,0,3.58,5.2555,5.9617,5.9617,0,0,0,8.3509-5.2555,2.0143,2.0143,0,0,1,.0644-.4853.8462.8462,0,0,1,1.6509.272,7.5558,7.5558,0,0,1-.5765,2.9174,7.49,7.49,0,0,1-4.0991,4.1529,14.8662,14.8662,0,0,1-1.9042.5375c-.0742.02-.1518.0283-.2409.0443v2.25h.2553c.9451.0011,1.89,0,2.8351.0047a.8381.8381,0,0,1,.6558,1.34A2.2447,2.2447,0,0,1,16.1246,24Z"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M16.8826,8.5818c0,1.2341.0078,2.4682-.002,3.7021A4.719,4.719,0,0,1,8.4193,15.255a4.8125,4.8125,0,0,1-.9847-2.9642q-.01-3.749,0-7.498a4.7217,4.7217,0,0,1,9.1238-1.7689,5.2491,5.2491,0,0,1,.3224,1.8323C16.886,6.0981,16.8826,7.34,16.8826,8.5818Z"-->
  <!--              />-->
  <!--            </svg>-->
  <!--            <svg-->
  <!--                fill="#444"-->
  <!--                @click="handleMicDisable()"-->
  <!--                style="cursor: pointer"-->
  <!--                v-if="permission.mic === true && permission.micAllow === false && !disableParticipant"-->
  <!--                data-name="Layer 1"-->
  <!--                xmlns="http://www.w3.org/2000/svg"-->
  <!--                viewBox="0 0 24 24"-->
  <!--            >-->
  <!--              <path-->
  <!--                  d="M19.0194,16.0675a7.2408,7.2408,0,0,0,.5525-2.7961.8111.8111,0,0,0-1.5823-.2607,1.9337,1.9337,0,0,0-.0617.465,5.537,5.537,0,0,1-.306,1.6662l1.2524,1.2524Q18.95,16.2336,19.0194,16.0675Z"-->
  <!--                  stroke="#000"-->
  <!--                  stroke-miterlimit="10"-->
  <!--                  stroke-width="0.5"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M16.907,14.5759,7.2364,4.9053l.029-.233a4.9994,4.9994,0,0,1,9.6313-1.22,5.5688,5.5688,0,0,1,.3388,1.9225q.0042,1.2369.0019,2.4738l-.001,1.0988.0019,1.09c.0009.82.0028,1.6408-.0037,2.4617a5.7266,5.7266,0,0,1-.1367,1.2289ZM8.251,4.5646l8.0232,8.0233c.001-.0318.0019-.0637.0019-.0964h0c.0066-.8181.0047-1.6352.0038-2.4523L16.278,8.9469l.0009-1.1q.0015-1.2341-.0018-2.4691a4.55,4.55,0,0,0-.279-1.5921A4.0329,4.0329,0,0,0,10.9073,1.43,4.0791,4.0791,0,0,0,8.251,4.5646Z"-->
  <!--                  stroke="#000"-->
  <!--                  stroke-miterlimit="10"-->
  <!--                  stroke-width="0.5"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M15.0841,16.0813l.802.802a5.727,5.727,0,0,1-6.0943.9686A5.6018,5.6018,0,0,1,6.36,12.8148a2.2014,2.2014,0,0,0-.0625-.4651.8109.8109,0,0,0-1.582.2607,7.0852,7.0852,0,0,0,.4361,2.4812,7.2258,7.2258,0,0,0,5.0159,4.6313c.3562.1017.725.1588,1.1.239v2.1392c-.1262,0-.2152,0-.3043,0-.8982.0016-1.7967-.0072-2.6947.0087a.7886.7886,0,0,0-.7351,1.0229.8873.8873,0,0,0,.5909.5914h7.9067a2.1517,2.1517,0,0,0,.462-.3344.8032.8032,0,0,0-.6284-1.2841c-.9058-.0046-1.8116-.0035-2.7173-.0045h-.2448V19.9445c.0855-.0154.16-.0231.231-.0424a14.2731,14.2731,0,0,0,1.825-.5152,7.2892,7.2892,0,0,0,2.0916-1.34l3.6744,3.6744a.5477.5477,0,0,0,.7745-.7745l-3.6936-3.6936h0l-1.1745-1.1745v0l-.7867-.7868v0L7.6972,7.1444v.0011L3.2756,2.7239a.5477.5477,0,0,0-.7745.7745L7.6986,8.6958"-->
  <!--                  stroke="#000"-->
  <!--                  stroke-miterlimit="10"-->
  <!--                  stroke-width="0.5"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M12.3883,17.2a5.3525,5.3525,0,0,1-4.2795-2.1275,5.4931,5.4931,0,0,1-1.12-3.37q-.0054-2.07-.0036-4.1414V6.4385l9.19,9.19-.3925.3262c-.1144.1026-.1662.1489-.2262.1935A5.27,5.27,0,0,1,12.3883,17.2ZM7.9153,8.6841q0,1.5084.0036,3.0168a4.528,4.528,0,0,0,.933,2.8124,4.4706,4.4706,0,0,0,5.9319,1.04Z"-->
  <!--                  stroke="#000"-->
  <!--                  stroke-miterlimit="10"-->
  <!--                  stroke-width="0.5"-->
  <!--              />-->
  <!--            </svg>-->
  <!--            <svg-->
  <!--                fill="lightgray"-->
  <!--                @click="changeMicStatus('close')"-->
  <!--                style="cursor: pointer"-->
  <!--                v-if="permission.mic === false && !disableParticipant"-->
  <!--                data-name="Layer 1"-->
  <!--                xmlns="http://www.w3.org/2000/svg"-->
  <!--                viewBox="0 0 24 24"-->
  <!--            >-->
  <!--              <path-->
  <!--                  d="M19.0194,16.0675a7.2408,7.2408,0,0,0,.5525-2.7961.8111.8111,0,0,0-1.5823-.2607,1.9337,1.9337,0,0,0-.0617.465,5.537,5.537,0,0,1-.306,1.6662l1.2524,1.2524Q18.95,16.2336,19.0194,16.0675Z"-->
  <!--                  stroke="#000"-->
  <!--                  stroke-miterlimit="10"-->
  <!--                  stroke-width="0.5"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M16.907,14.5759,7.2364,4.9053l.029-.233a4.9994,4.9994,0,0,1,9.6313-1.22,5.5688,5.5688,0,0,1,.3388,1.9225q.0042,1.2369.0019,2.4738l-.001,1.0988.0019,1.09c.0009.82.0028,1.6408-.0037,2.4617a5.7266,5.7266,0,0,1-.1367,1.2289ZM8.251,4.5646l8.0232,8.0233c.001-.0318.0019-.0637.0019-.0964h0c.0066-.8181.0047-1.6352.0038-2.4523L16.278,8.9469l.0009-1.1q.0015-1.2341-.0018-2.4691a4.55,4.55,0,0,0-.279-1.5921A4.0329,4.0329,0,0,0,10.9073,1.43,4.0791,4.0791,0,0,0,8.251,4.5646Z"-->
  <!--                  stroke="#000"-->
  <!--                  stroke-miterlimit="10"-->
  <!--                  stroke-width="0.5"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M15.0841,16.0813l.802.802a5.727,5.727,0,0,1-6.0943.9686A5.6018,5.6018,0,0,1,6.36,12.8148a2.2014,2.2014,0,0,0-.0625-.4651.8109.8109,0,0,0-1.582.2607,7.0852,7.0852,0,0,0,.4361,2.4812,7.2258,7.2258,0,0,0,5.0159,4.6313c.3562.1017.725.1588,1.1.239v2.1392c-.1262,0-.2152,0-.3043,0-.8982.0016-1.7967-.0072-2.6947.0087a.7886.7886,0,0,0-.7351,1.0229.8873.8873,0,0,0,.5909.5914h7.9067a2.1517,2.1517,0,0,0,.462-.3344.8032.8032,0,0,0-.6284-1.2841c-.9058-.0046-1.8116-.0035-2.7173-.0045h-.2448V19.9445c.0855-.0154.16-.0231.231-.0424a14.2731,14.2731,0,0,0,1.825-.5152,7.2892,7.2892,0,0,0,2.0916-1.34l3.6744,3.6744a.5477.5477,0,0,0,.7745-.7745l-3.6936-3.6936h0l-1.1745-1.1745v0l-.7867-.7868v0L7.6972,7.1444v.0011L3.2756,2.7239a.5477.5477,0,0,0-.7745.7745L7.6986,8.6958"-->
  <!--                  stroke="#000"-->
  <!--                  stroke-miterlimit="10"-->
  <!--                  stroke-width="0.5"-->
  <!--              />-->
  <!--              <path-->
  <!--                  d="M12.3883,17.2a5.3525,5.3525,0,0,1-4.2795-2.1275,5.4931,5.4931,0,0,1-1.12-3.37q-.0054-2.07-.0036-4.1414V6.4385l9.19,9.19-.3925.3262c-.1144.1026-.1662.1489-.2262.1935A5.27,5.27,0,0,1,12.3883,17.2ZM7.9153,8.6841q0,1.5084.0036,3.0168a4.528,4.528,0,0,0,.933,2.8124,4.4706,4.4706,0,0,0,5.9319,1.04Z"-->
  <!--                  stroke="#000"-->
  <!--                  stroke-miterlimit="10"-->
  <!--                  stroke-width="0.5"-->
  <!--              />-->
  <!--            </svg>-->
  <!--          </div>-->
  <!--          <div-->
  <!--              class="moderator-controls__item_handraise"-->
  <!--              v-if="isWebinar === false"-->
  <!--          >-->
  <!--            <svg-->
  <!--                @click="changeHandStatus('waiting')"-->
  <!--                style="cursor: pointer"-->
  <!--                v-if="permission.handStatus === 'waiting' && !disableParticipant"-->
  <!--                data-name="Layer 1"-->
  <!--                fill="#ffc600"-->
  <!--                xmlns="http://www.w3.org/2000/svg"-->
  <!--                viewBox="0 0 24 24"-->
  <!--            >-->
  <!--              <path-->
  <!--                  d="M5.8128,10.7047h.792v-.2125q0-3.7173,0-7.4345A1.3188,1.3188,0,1,1,9.2377,3.052Q9.24,6.7609,9.2382,10.47v.2286h.78v-.2159q0-4.5673,0-9.1348a1.314,1.314,0,1,1,2.6272-.0039q.0012,4.5674,0,9.1347v.2227h.78V10.49q0-3.6255,0-7.2511a1.3121,1.3121,0,0,1,2.6231-.0742q.002,4.2173,0,8.4346,0,1.7419.0006,3.4839c0,.3121.2383.52.503.4237a.5339.5339,0,0,0,.2524-.22c.5174-.88,1.024-1.7658,1.5362-2.6487a1.3484,1.3484,0,0,1,2.1374-.2563,1.321,1.321,0,0,1,.1442,1.5621q-1.3947,2.4229-2.7946,4.8429c-.1414.2449-.2956.4837-.42.737a6.23,6.23,0,0,1-1.5149,1.8982,9.97,9.97,0,0,1-4.2089,2.3307,6.8382,6.8382,0,0,1-4.5129-.2937A6.2516,6.2516,0,0,1,3.8153,19.915,8.7388,8.7388,0,0,1,3.2046,16.95c-.0087-.2162-.015-.4327-.0151-.6491q-.0013-5.1424,0-10.2849A1.3252,1.3252,0,0,1,4.5254,4.6523a1.3069,1.3069,0,0,1,1.2873,1.302q.0007,2.267,0,4.534Z"-->
  <!--              />-->
  <!--            </svg>-->

  <!--            <svg-->
  <!--                @click="changeHandStatus('granted')"-->
  <!--                style="cursor: pointer"-->
  <!--                v-if="permission.handStatus === 'granted' && !disableParticipant"-->
  <!--                data-name="Layer 1"-->
  <!--                fill="#37dd5e"-->
  <!--                xmlns="http://www.w3.org/2000/svg"-->
  <!--                viewBox="0 0 24 24"-->
  <!--            >-->
  <!--              <path-->
  <!--                  d="M5.8128,10.7047h.792v-.2125q0-3.7173,0-7.4345A1.3188,1.3188,0,1,1,9.2377,3.052Q9.24,6.7609,9.2382,10.47v.2286h.78v-.2159q0-4.5673,0-9.1348a1.314,1.314,0,1,1,2.6272-.0039q.0012,4.5674,0,9.1347v.2227h.78V10.49q0-3.6255,0-7.2511a1.3121,1.3121,0,0,1,2.6231-.0742q.002,4.2173,0,8.4346,0,1.7419.0006,3.4839c0,.3121.2383.52.503.4237a.5339.5339,0,0,0,.2524-.22c.5174-.88,1.024-1.7658,1.5362-2.6487a1.3484,1.3484,0,0,1,2.1374-.2563,1.321,1.321,0,0,1,.1442,1.5621q-1.3947,2.4229-2.7946,4.8429c-.1414.2449-.2956.4837-.42.737a6.23,6.23,0,0,1-1.5149,1.8982,9.97,9.97,0,0,1-4.2089,2.3307,6.8382,6.8382,0,0,1-4.5129-.2937A6.2516,6.2516,0,0,1,3.8153,19.915,8.7388,8.7388,0,0,1,3.2046,16.95c-.0087-.2162-.015-.4327-.0151-.6491q-.0013-5.1424,0-10.2849A1.3252,1.3252,0,0,1,4.5254,4.6523a1.3069,1.3069,0,0,1,1.2873,1.302q.0007,2.267,0,4.534Z"-->
  <!--              />-->
  <!--            </svg>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="participant__moderator-controls&#45;&#45;2" @click="openDropDown">-->
  <!--        <div class="more" v-if="(amIModerator || amISub) && !isWebinar">-->
  <!--          ...-->
  <!--          <div-->
  <!--              class="drop-down&#45;&#45;background"-->
  <!--              v-if="dropDownIsOpen"-->
  <!--              @click="closeDropDown"-->
  <!--          ></div>-->
  <!--          <div class="drop-down-container" v-if="dropDownIsOpen">-->
  <!--&lt;!&ndash;            <mini-drop-down&ndash;&gt;-->
  <!--&lt;!&ndash;                :open="dropDownIsOpen"&ndash;&gt;-->
  <!--&lt;!&ndash;                :drop-down-items="dropDownItems"&ndash;&gt;-->
  <!--&lt;!&ndash;                @select-item="getSelectedItem"&ndash;&gt;-->
  <!--&lt;!&ndash;                @close-drop-down="closeDropDown"&ndash;&gt;-->
  <!--&lt;!&ndash;            >&ndash;&gt;-->
  <!--&lt;!&ndash;            </mini-drop-down>&ndash;&gt;-->
  <!--          </div>-->
  <!--        </div>-->
  <!--        <div-->
  <!--            class="more"-->
  <!--            v-else-if="-->
  <!--            (amIModerator || amISub) &&-->
  <!--              isWebinar &&-->
  <!--                (participantRole === 'Presenter' ||-->
  <!--                  participantRole === 'Moderator')-->
  <!--          "-->
  <!--        >-->
  <!--          ...-->
  <!--          <div-->
  <!--              class="drop-down&#45;&#45;background"-->
  <!--              v-if="dropDownIsOpen"-->
  <!--              @click="closeDropDown"-->
  <!--          ></div>-->
  <!--          <div class="drop-down-container" v-if="dropDownIsOpen">-->
  <!--&lt;!&ndash;            <mini-drop-down&ndash;&gt;-->
  <!--&lt;!&ndash;                :open="dropDownIsOpen"&ndash;&gt;-->
  <!--&lt;!&ndash;                :drop-down-items="&ndash;&gt;-->
  <!--&lt;!&ndash;                isChatEnable&ndash;&gt;-->
  <!--&lt;!&ndash;                  ? WebinarPresenterDropDownItemsWithChat&ndash;&gt;-->
  <!--&lt;!&ndash;                  : WebinarPresenterDropDownItems&ndash;&gt;-->
  <!--&lt;!&ndash;              "&ndash;&gt;-->
  <!--&lt;!&ndash;                @select-item="getSelectedItem"&ndash;&gt;-->
  <!--&lt;!&ndash;                @close-drop-down="closeDropDown"&ndash;&gt;-->
  <!--&lt;!&ndash;            >&ndash;&gt;-->
  <!--&lt;!&ndash;            </mini-drop-down>&ndash;&gt;-->
  <!--          </div>-->
  <!--        </div>-->
  <!--        <div-->
  <!--            class="more"-->
  <!--            v-else-if="-->
  <!--            (amIModerator || amISub) &&-->
  <!--              isWebinar &&-->
  <!--              participantRole === 'Participant'-->
  <!--          "-->
  <!--        >-->
  <!--          ...-->
  <!--          <div-->
  <!--              class="drop-down&#45;&#45;background"-->
  <!--              v-if="dropDownIsOpen"-->
  <!--              @click="closeDropDown"-->
  <!--          ></div>-->
  <!--          <div class="drop-down-container" v-if="dropDownIsOpen">-->
  <!--&lt;!&ndash;            <mini-drop-down&ndash;&gt;-->
  <!--&lt;!&ndash;                :open="dropDownIsOpen"&ndash;&gt;-->
  <!--&lt;!&ndash;                :drop-down-items="&ndash;&gt;-->
  <!--&lt;!&ndash;                isChatEnable&ndash;&gt;-->
  <!--&lt;!&ndash;                  ? WebinarParticipantDropDownItemsWithChat&ndash;&gt;-->
  <!--&lt;!&ndash;                  : WebinarParticipantDropDownItems&ndash;&gt;-->
  <!--&lt;!&ndash;              "&ndash;&gt;-->
  <!--&lt;!&ndash;                @select-item="getSelectedItem"&ndash;&gt;-->
  <!--&lt;!&ndash;                @close-drop-down="closeDropDown"&ndash;&gt;-->
  <!--&lt;!&ndash;            >&ndash;&gt;-->
  <!--&lt;!&ndash;            </mini-drop-down>&ndash;&gt;-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div-->
  <!--        v-if="-->
  <!--        !isWebinar &&-->
  <!--          !amIModerator &&-->
  <!--          !amISub &&-->
  <!--          this.$store.getters.displayName !== participantName &&-->
  <!--          !isAbsent-->
  <!--      "-->
  <!--        class="chat__container"-->
  <!--        @click="goToPrivateChat"-->
  <!--    >-->
  <!--      <svg-->
  <!--          fill="black"-->
  <!--          class="chat-and-participants__icon"-->
  <!--          data-name="Layer 1"-->
  <!--          xmlns="http://www.w3.org/2000/svg"-->
  <!--          viewBox="0 0 24 24"-->
  <!--      >-->
  <!--        <path-->
  <!--            d="M.0451,11.0506C.11,10.62.149,10.1828.2416,9.7578a10.48,10.48,0,0,1,20.7159,2.0486A20.4947,20.4947,0,0,0,21.1117,14a13.8689,13.8689,0,0,0,1.4052,4.3613c.4505.9072.9117,1.809,1.3674,2.7135a.97.97,0,0,1-.9232,1.4122c-4.1547-.022-8.3095-.0072-12.4643-.0155a10.7065,10.7065,0,0,1-1.5624-.107A10.4711,10.4711,0,0,1,.1851,13.9464C.109,13.5428.061,13.1338,0,12.7273v-1.453C.0152,11.2.0338,11.1257.0451,11.0506ZM6.95,9.185a1.8147,1.8147,0,0,0-.5084.0564.9011.9011,0,0,0-.6393.8708,1.1048,1.1048,0,0,0,.01.1777.9384.9384,0,0,0,.962.7866c1.2413.0043,2.4826.0014,3.7239.0014,1.2335,0,2.467.0023,3.7005-.0013a.9708.9708,0,0,0,.9844-.96.9428.9428,0,0,0-.1874-.5384.99.99,0,0,0-.8792-.3956c-.7963.002-1.5926.0005-2.3889.0005Q9.3385,9.1827,6.95,9.185Zm7.5908,3.81a1.3826,1.3826,0,0,0-.4135-.06c-1.1784-.0045-2.3568-.0069-3.5351-.001a.9437.9437,0,0,0-1.0411.9154q-.0014.0538.0027.11a.935.935,0,0,0,.96.8663c.6164.007,1.233.0016,1.85.0016s1.2331.0055,1.8495-.0017a.9542.9542,0,0,0,.9594-.8234.8052.8052,0,0,0,.01-.158A.9456.9456,0,0,0,14.54,12.9951Z"-->
  <!--        />-->
  <!--      </svg>-->
  <!--    </div>-->
  <!--    <div-->
  <!--        v-else-if="-->
  <!--        isWebinar &&-->
  <!--          isChatEnable &&-->
  <!--          !amIModerator &&-->
  <!--          !amISub &&-->
  <!--          this.$store.getters.displayName !== participantName &&-->
  <!--          !isAbsent &&-->
  <!--          this.$store.getters.amIPresenter-->
  <!--      "-->
  <!--        class="chat__container"-->
  <!--        @click="goToPrivateChat"-->
  <!--    >-->
  <!--      <svg-->
  <!--          fill="black"-->
  <!--          class="chat-and-participants__icon"-->
  <!--          data-name="Layer 1"-->
  <!--          xmlns="http://www.w3.org/2000/svg"-->
  <!--          viewBox="0 0 24 24"-->
  <!--      >-->
  <!--        <path-->
  <!--            d="M.0451,11.0506C.11,10.62.149,10.1828.2416,9.7578a10.48,10.48,0,0,1,20.7159,2.0486A20.4947,20.4947,0,0,0,21.1117,14a13.8689,13.8689,0,0,0,1.4052,4.3613c.4505.9072.9117,1.809,1.3674,2.7135a.97.97,0,0,1-.9232,1.4122c-4.1547-.022-8.3095-.0072-12.4643-.0155a10.7065,10.7065,0,0,1-1.5624-.107A10.4711,10.4711,0,0,1,.1851,13.9464C.109,13.5428.061,13.1338,0,12.7273v-1.453C.0152,11.2.0338,11.1257.0451,11.0506ZM6.95,9.185a1.8147,1.8147,0,0,0-.5084.0564.9011.9011,0,0,0-.6393.8708,1.1048,1.1048,0,0,0,.01.1777.9384.9384,0,0,0,.962.7866c1.2413.0043,2.4826.0014,3.7239.0014,1.2335,0,2.467.0023,3.7005-.0013a.9708.9708,0,0,0,.9844-.96.9428.9428,0,0,0-.1874-.5384.99.99,0,0,0-.8792-.3956c-.7963.002-1.5926.0005-2.3889.0005Q9.3385,9.1827,6.95,9.185Zm7.5908,3.81a1.3826,1.3826,0,0,0-.4135-.06c-1.1784-.0045-2.3568-.0069-3.5351-.001a.9437.9437,0,0,0-1.0411.9154q-.0014.0538.0027.11a.935.935,0,0,0,.96.8663c.6164.007,1.233.0016,1.85.0016s1.2331.0055,1.8495-.0017a.9542.9542,0,0,0,.9594-.8234.8052.8052,0,0,0,.01-.158A.9456.9456,0,0,0,14.54,12.9951Z"-->
  <!--        />-->
  <!--      </svg>-->
  <!--    </div>-->
  <!--    <div-->
  <!--        v-else-if="-->
  <!--        isWebinar &&-->
  <!--          isChatEnable &&-->
  <!--          !amIModerator &&-->
  <!--          !amISub &&-->
  <!--          this.$store.getters.displayName !== participantName &&-->
  <!--          !isAbsent &&-->
  <!--          (participantRole === 'Moderator' ||-->
  <!--            participantRole === 'Presenter') &&-->
  <!--          !this.$store.getters.amIPresenter-->
  <!--      "-->
  <!--        class="chat__container"-->
  <!--        @click="goToPrivateChat"-->
  <!--    >-->
  <!--      <svg-->
  <!--          fill="black"-->
  <!--          class="chat-and-participants__icon"-->
  <!--          data-name="Layer 1"-->
  <!--          xmlns="http://www.w3.org/2000/svg"-->
  <!--          viewBox="0 0 24 24"-->
  <!--      >-->
  <!--        <path-->
  <!--            d="M.0451,11.0506C.11,10.62.149,10.1828.2416,9.7578a10.48,10.48,0,0,1,20.7159,2.0486A20.4947,20.4947,0,0,0,21.1117,14a13.8689,13.8689,0,0,0,1.4052,4.3613c.4505.9072.9117,1.809,1.3674,2.7135a.97.97,0,0,1-.9232,1.4122c-4.1547-.022-8.3095-.0072-12.4643-.0155a10.7065,10.7065,0,0,1-1.5624-.107A10.4711,10.4711,0,0,1,.1851,13.9464C.109,13.5428.061,13.1338,0,12.7273v-1.453C.0152,11.2.0338,11.1257.0451,11.0506ZM6.95,9.185a1.8147,1.8147,0,0,0-.5084.0564.9011.9011,0,0,0-.6393.8708,1.1048,1.1048,0,0,0,.01.1777.9384.9384,0,0,0,.962.7866c1.2413.0043,2.4826.0014,3.7239.0014,1.2335,0,2.467.0023,3.7005-.0013a.9708.9708,0,0,0,.9844-.96.9428.9428,0,0,0-.1874-.5384.99.99,0,0,0-.8792-.3956c-.7963.002-1.5926.0005-2.3889.0005Q9.3385,9.1827,6.95,9.185Zm7.5908,3.81a1.3826,1.3826,0,0,0-.4135-.06c-1.1784-.0045-2.3568-.0069-3.5351-.001a.9437.9437,0,0,0-1.0411.9154q-.0014.0538.0027.11a.935.935,0,0,0,.96.8663c.6164.007,1.233.0016,1.85.0016s1.2331.0055,1.8495-.0017a.9542.9542,0,0,0,.9594-.8234.8052.8052,0,0,0,.01-.158A.9456.9456,0,0,0,14.54,12.9951Z"-->
  <!--        />-->
  <!--      </svg>-->
  <!--    </div>-->
  <!--  </li>-->









  <li class="participant">
    <div v-if="isAbsent" class="absents__participants"></div>
    <div class="participant__inner">
      <span class="participant__name--tool-tip" ref="participantNameToolTip">
        {{ participantName }}</span
      >
      <div
          style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;

        "
          :style="{width: (!isModeratorSubstituteActivated && !amIModerator) ? '25rem': '19.7rem' }"
      >
        <div class="participant__icon">
          <!--          <img draggable="false" v-if="!imgURL && parseInt(this.$store.getters.moderatorId) !== parseInt(participantId)  &&  (this.subModerator.isActive !== true || ((this.subModerator.isActive == true )&& (this.subModerator.id != userId)))  && newModeratorUserId != userId " src="/img/contact.svg" alt="not loaded" style="width: 3.2rem;height: 3.2rem" />-->
          <!--          <img draggable="false" v-if="!imgURL && parseInt(this.$store.getters.moderatorId) === parseInt(participantId)" src="/img/star.svg" alt="not loaded" style="width: 1.2rem;height: 1.2rem;position: absolute;top: 0" />-->

          <img draggable="false" v-if="!imgURL" src="/img/contact.svg" alt="not loaded" style="width: 3.2rem;height: 3.2rem" />
          <img draggable="false" v-else :src="imgURL" style="width:3.2rem;height: 3.2rem;border-radius: 50%" alt="not loaded">
        </div>
        <div class="participant__name">

          <span
              v-show="(!amIModerator && !isModeratorSubstituteActivated) "
              ref="participantName"
              class="participant__name--span-participant"
              @mouseenter="showNameToolTip"
              @mouseleave="hideNameToolTip"
          >
            {{ participantName }}
          </span>
          <span
              v-show="(amIModerator || isModeratorSubstituteActivated) "

              class="participant__name--span-moderator"
              ref="participantNameModerator"
              @mouseenter="showNameToolTip"
              @mouseleave="hideNameToolTip"
          >
            {{ participantName }}
          </span>
          <div
              v-if="parseInt(this.$store.getters.moderatorId)  === parseInt(participantId) "
              class="moderator__name"
          >

            <span> {{ $store.getters.t("moderator") }} </span>

          </div>
          <!--          <div-->
          <!--              v-else-if="(this.subModerator.id == userId && (this.subModerator.isActive === true) )"-->
          <!--              class="moderator__name"-->
          <!--          >-->
          <!--            <span>{{ "(" + " " }}</span>-->
          <!--            <span> {{ $store.getters.t("sub-moderator") }} </span>-->
          <!--            <span>{{ " " + ")" }}</span>-->
          <!--          </div>-->
        </div>
      </div>
      <div class="participant__moderator-controls--1">
        <div
            v-if="
        (!amIModerator && !isModeratorSubstituteActivated) &&
        participantName !== $store.getters.displayName
      "
            class="chat__container"
            @click="goToPrivateChat"
        >
          <img draggable="false" src="/img/chat-in-participant.svg" alt="not-loaded">
        </div>
        <div
            class="moderator-controls"
            v-if="
          (  (amIModerator && (participantStatus === 'ONLINE' || participantStatus === false || participantStatus === true)) ||
            (isModeratorSubstituteActivated && (participantStatus === 'ONLINE' || participantStatus === false || participantStatus === true))) && this.$store.getters.hasModerator
          "
        >

          <div class="moderator-controls__item--more">
            <div  v-show="amIModerator || isModeratorSubstituteActivated" ref="mini-drop-down-container" style="width: 1rem;cursor: pointer">
              <img draggable="false" src="/img/more-participant.svg" alt="not-loaded">
              <base-mini-drop-down
                  :open="dropDownIsOpen.flag"
                  direction-y="downward"
                  direction-x="right"
                  :items="dropDownItems"
                  :is-guest="isGuest"
                  :is-proceedings-started="isProceedingsStarted"
                  @select-item="getSelectedItem"
                  @toggle-item="toggleItem"
              >

              </base-mini-drop-down>
            </div>
            <!--            <div  v-show=" isModeratorSubstituteActivated && !amIModerator" ref="mini-drop-down-container-sub" style="width: 1rem;cursor: pointer">-->
            <!--              <img draggable="false" src="/img/more-participant.svg" alt="not-loaded">-->
            <!--              <base-mini-drop-down-->
            <!--                  :open="subDropDownIsOpen.flag"-->
            <!--                  direction-y="downward"-->
            <!--                  direction-x="right"-->
            <!--                  :items="dropDownItemsSub"-->
            <!--                  :is-proceedings-started="isProceedingsStarted"-->
            <!--                  @select-item="getSelectedItem"-->
            <!--                  @toggle-item="toggleItem"-->
            <!--              >-->
            <!--              </base-mini-drop-down>-->
            <!--            </div>-->
          </div>


          <div class="moderator-controls__item">
            <img draggable="false" v-show="permission.camera === true" src="/img/camera-on.svg" alt="not-loaded" @click="changeCameraStatus"  style="cursor: pointer;width: 2.2rem">
            <img draggable="false" v-show="permission.camera === false" src="/img/camera-off.svg" alt="not-loaded"  @click="changeCameraStatus" style="cursor: pointer;width: 2.2rem">
          </div>
          <div class="moderator-controls__item">
            <img draggable="false" v-show="permission.mic === true && !disableParticipant" src="/img/mic-on.svg" alt="not-loaded"    @click="changeMicStatus('open')" style="cursor: pointer">
            <img draggable="false" v-show="permission.mic === false  && !disableParticipant" src="/img/mic-off.svg" alt="not-loaded"    @click="changeMicStatus('close')" style="cursor: pointer">
          </div>
          <div v-if="this.participantsLength > 2" class="moderator-controls__item">
            <img draggable="false" v-show="!permission.pin && this.participantsLength > 2" src="/img/pin-off.svg" alt="not-loaded" style="cursor: pointer" @click="changePinPermission(false)">
            <img draggable="false" v-show="permission.pin && this.participantsLength > 2" src="/img/pin-on.svg" alt="not-loaded" style="cursor: pointer" @click="changePinPermission(true)">
          </div>
          <div class="moderator-controls__item_handraise" style="position: relative;left: -0.2rem">
            <img draggable="false"  v-show="permission.handStatus === 'waiting' " src="/img/hand-raise-waiting.svg" alt="not-loaded" @click="changeHandStatus('waiting')" style="cursor: pointer; height: 2rem">
            <img draggable="false"  v-show="permission.handStatus === 'granted'" src="/img/hand-raise-granted.svg" alt="not-loaded" @click="changeHandStatus('granted')" style="cursor: pointer; height: 2rem">
          </div>

        </div>

        <!--        <div class="moderator-controls__item" v-if="!amIModerator">-->
        <!--          <img draggable="false"  src="/img/chat-on.png" alt="not loaded" @click="goToPrivateChat('chat','on')" />-->
        <!--        </div>-->
        <div>

        </div>
      </div>

    </div>
    <!--    <div-->
    <!--        v-if="-->
    <!--        !amIModerator &&-->
    <!--        !isModeratorSubstituteActivated &&-->
    <!--        participantName !== $store.getters.displayName-->
    <!--      "-->
    <!--        class="chat__container"-->
    <!--        @click="goToPrivateChat"-->
    <!--    >-->
    <!--      <img draggable="false" src="/img/chat-in-participant.svg" alt="not-loaded">-->
    <!--    </div>-->
  </li>
</template>







<!--</template>-->

<script>
// import MiniDropDown from "./MiniDropDown";
import DetectMobile from '../utils/detectMobile'
import BaseMiniDropDown from "@/components/UI/BaseMiniDropDown.vue";
import RestClient from "@/api/restClient";
import MiniDropDownHandler from "../utils/mini.drop.down.actions";
export default {
  name: "TheParticipant",
  components: {BaseMiniDropDown},
  props: [
    "participantName",
    "amIModerator",
    "permission",
    "participantStatus",
    "isAbsent",
    "participantRole",
    "amISubstitutionModerator",
    "participantId",
    "isWebinar",
    "isChatEnable",
    "loginWayEnum",
    "participants",
    "disableParticipant",
    "micOnCount",
    "participantsLength",
    "isModeratorSubstituteActivated",
    "isGuest",
    "connectionId"
  ],
  data() {
    return {
      isNameVisible: "hidden",
      controlsIsVisible: true,
      filterType: 1,
      userPermissions: this.permissions,
      // userHandRaiseStat: this.handRaiseStat,
      dropDownIsOpen: {flag: false},
      allDropDownItems: [
        {
          label: this.$store.getters.t("privateChat"),
        },
        {
          label:this.$store.getters.t("sharePermission") ,miniDropDownSlot: this.$store.getters.t("sharePermission"),isToggled:false
        },
        {
          label:  this.$store.getters.t("allow-proceedings-permission"),
          miniDropDownSlot: this.$store.getters.t("allow-proceedings-permission"),isToggled:false
        },
        {
          label: this.$store.getters.t("removeVideo"),
        },
        {
          label: this.$store.getters.t("removeFromMeeting"),
        },
        // {
        // label: this.permissions?.showStream ? this.$store.getters.t("remove-video-stream"):  this.$store.getters.t('Restore-video-stream'),
        // },
        // {
        //   label: !this.permissions?.board ? this.$store.getters.t('board-permission') : this.$store.getters.t('deny-board-permission'),
        // },
        // {
        //   label: !this.permissions?.videoSharing ? this.$store.getters.t('video-permission') : this.$store.getters.t('deny-video-permission'),
        // },
        // {
        //   label: !this.permissions?.pdfSharing ? this.$store.getters.t('pdf-permission') : this.$store.getters.t('deny-pdf-permission'),
        // },
        // {
        //   label: this.$store.getters.t('set-as-moderator'),
        // },
      ],
      allDropDownItemsSub: [
        {
          label: this.$store.getters.t("privateChat"),
        },
        {
          label:this.$store.getters.t("sharePermission") ,miniDropDownSlot: this.$store.getters.t("sharePermission"),isToggled:false
        },
        {
          label:  this.$store.getters.t("allow-proceedings-permission"),
          miniDropDownSlot: this.$store.getters.t("allow-proceedings-permission"),isToggled:false
        },
        {
          label: this.$store.getters.t("removeVideo"),
        },
        {
          label: this.$store.getters.t("removeFromMeeting"),
        },
        // {
        // label: this.permissions?.showStream ? this.$store.getters.t("remove-video-stream"):  this.$store.getters.t('Restore-video-stream'),
        // },
        // {
        //   label: !this.permissions?.board ? this.$store.getters.t('board-permission') : this.$store.getters.t('deny-board-permission'),
        // },
        // {
        //   label: !this.permissions?.videoSharing ? this.$store.getters.t('video-permission') : this.$store.getters.t('deny-video-permission'),
        // },
        // {
        //   label: !this.permissions?.pdfSharing ? this.$store.getters.t('pdf-permission') : this.$store.getters.t('deny-pdf-permission'),
        // },

      ],
      storedPermissions:[],
      isParticipantPinned: false,
      subDropDownIsOpen:{flag: false},
      imgURL:'',
      restClientUser: new RestClient('user'),
      isCustomModeratorInMeeting:false,
      publishCount: sessionStorage.getItem("publishCount"),
    };
  },
  computed: {
    amISub() {
      return this.amISubstitutionModerator;
    },
    dropDownItems() {
      let data = localStorage?.getItem(`custom-moderator-substitute`);
      data = JSON.parse(data);
      if (this.participantId === data?.id) {
        if (data?.roomId === this.$store?.getters?.roomId) {
          const foundAction = this.allDropDownItems.find(
              (dropDownItem) => dropDownItem.label === this.$store.getters.t('set-as-moderator')
          );
          if (data?.stat) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            if (foundAction?.label) {
              foundAction.label = this.$store.getters.t('cancel-set-as-moderator');
              localStorage.removeItem(`custom-moderator-substitute`)
            }
          } else {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            if (foundAction?.label) {
              foundAction.label = this.$store.getters.t('set-as-moderator');
              // localStorage.removeItem(`custom-moderator-substitute`)
            }
          }
        }
      }
      // if (+this.userId === +this.$store.getters.moderatorSubstituteId || +this.userId === +this.$store.getters.moderatorId){
      //   let allDropDownItems = this.allDropDownItems
      //   allDropDownItems.pop()
      //   return (this.participantsLength > 2) ? allDropDownItems : allDropDownItems.slice(1);
      // }else {
      //   return (this.participantsLength > 2) ? this.allDropDownItems : this.allDropDownItems.slice(1);
      // }
      const dropDownItems = this.allDropDownItems.slice()
      if (this.participantName.includes('(مهمان)')){
        const index = dropDownItems.findIndex((el)=>{
          return el.label === this.$store.getters.t("allow-proceedings-permission")
        })
        if (index !== -1){
          dropDownItems.splice(index, 1)
        }
      }
      return dropDownItems

    },
    dropDownItemsSub() {
      const dropDownItems = this.allDropDownItemsSub.slice()
      if (this.participantName.includes('(مهمان)')){
        const index = dropDownItems.findIndex((el)=>{
          return el.label === this.$store.getters.t("allow-proceedings-permission")
        })
        if (index !== -1){
          dropDownItems.splice(index, 1)
        }
      }
      return (this.participantsLength > 2) ? dropDownItems : dropDownItems.slice(1);
    }
  },
  created() {
    const mobileDetector = new DetectMobile();
    this.isMobile = mobileDetector.isMobile();
  },
  mounted() {

    new MiniDropDownHandler(
        this.$refs["mini-drop-down-container"],
        this.dropDownIsOpen
    );
    new MiniDropDownHandler(
        this.$refs["mini-drop-down-container-sub"],
        this.dropDownItemsSub
    );

    this.eventBus.on("change-pin-text", (data) => {
      if (data === true) {
        this.dropDownItems[0].label = this.$t("cancelPin");
      } else {
        this.dropDownItems[0].label = this.$t("pin");
      }
    });
    this.eventBus.on("change-share-text", (data) => {
      if (data === true) {
        this.dropDownItems[2].label = this.$t("shareCancellation");
        // this.WebinarPresenterDropDownItems[0].label = this.$t(
        //     "shareCancellation"
        // );
      } else {
        this.dropDownItems[2].label = this.$t("sharePermission");
        // this.WebinarPresenterDropDownItems[0].label = this.$t(
        //     "sharePermission"
        // );
      }
    });

    this.eventBus.on("unpin-participant", () => {
      this.dropDownItems[0].label = this.$t("pin");
    });
    this.eventBus.on("DontChangeRemoveVideoBtn", () => {
      this.dropDownItems[this.dropDownItems.length - 1].label = this.$t("removeVideo")
    })
    this.eventBus.on("publish_change_status", ({status,id}) => {
      if ( id.toString() === this.participantId.toString() && status){
        this.dropDownItems[this.dropDownItems.length - 1].label = this.$t("removeVideo")
      }else if (id.toString() === this.participantId.toString() && !status) {
        this.dropDownItems[this.dropDownItems.length - 1].label = this.$t("bring_video")
      }


    })
  },
  watch:{
    permission:{
      deep:true,
      immediate:true,
      handler(val){
        this.handlePermissions(val)
      }
    },
    isModeratorSubstituteActivated:{
      immediate: true,
      handler(val) {
        if (val){
          setTimeout(()=>{
            new MiniDropDownHandler(
                this.$refs["mini-drop-down-container"],
                this.dropDownIsOpen
            );
          },100)
        }
      }
    },
    dropDownIsOpen:{
      deep: true,
      handler(val){
        if (val){

          if (this.participantRole === "GUEST"){
            this.allDropDownItems =  this.allDropDownItems.filter((el)=>{
              return el.label !== this.$store.getters.t("allow-proceedings-permission")
            })
          }
          const index = this.allDropDownItems.findIndex((el)=>{
            return el.label === this.$store.getters.t("removeVideo") || el.label === this.$store.getters.t("add-participant-to-audience")
          })
          if (this.permission.publishStatus && index > -1){
            this.allDropDownItems[index].label = this.$store.getters.t("removeVideo")
          }else if (!this.permission.publishStatus && index > -1) {
            this.allDropDownItems[index].label = this.$store.getters.t("add-participant-to-audience")
          }
        }
      }
    }
  },
  methods: {
    goToPrivateChat() {
      this.eventBus.emit('go-to-private-chat',{label:this.participantName, participantId: this.participantId})
    },
    showNameToolTip() {
      if (this.$refs["participantName"].offsetWidth >= 170 || this.$refs["participantNameModerator"].offsetWidth >= 150) {
        this.$refs["participantNameToolTip"].style.visibility = "visible";
      }
    },
    hideNameToolTip() {
      this.$refs["participantNameToolTip"].style.visibility = "hidden";
    },
    closeDropDown() {
      this.dropDownIsOpen = false;
    },
    // changeHandStatus(row) {
    //   if (row === "waiting") {
    //     this.$store.dispatch("sendHandRiseGranted", this.participantId);
    //     this.eventBus.emit("receive-hand-raise");
    //   } else {
    //     this.$store.dispatch("sendHandRiseDenied", this.participantId);
    //   }
    // },
    changeHandStatus(row) {
      if (row === "waiting" && +this.micOnCount < +this.publishCount) {
        this.eventBus.emit("OPEN_PARTICIPANT_MICROPHONE", {
          connectionId: this.connectionId,
          userId: this.participantId,
          name:this.participantName
        })
        this.eventBus.emit("receive-hand-raise");
        this.$store.dispatch("sendHandRiseGranted", this.participantId);
      } else if (row === "waiting" && +this.micOnCount > +this.publishCount - 1) {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "warning",
          bodyText: this.$t("participants-mic-on-exceeded"),
          time: 5000,
        });
      } else {
        this.$store.dispatch("sendHandRiseDenied", this.participantId);
        this.eventBus.emit("CLOSE_PARTICIPANT_MICROPHONE", {connectionId: this.connectionId, userId: this.participantId,name:this.participantName});
      }
      // if (this.$store.getters.amISubstitutionModerator)
      //   this.eventBus.emit("notifySubstitutionForUserListUpdate", {});
      // else if (this.$store.getters.amIModerator)
      //   this.eventBus.emit("notifyModeratorForUserListUpdate", {});
    },
    // changeCameraStatus() {
    //   if (!this.permission.camera) {
    //     this.$store.dispatch("close_PARTICIPANT_MICROPHONE", this.participantId);
    //   } else {
    //     this.$store.dispatch("muteCameraParticipant", this.participantId);
    //   }
    // },
    // changeMicStatus() {
    //   if (!this.permission.mic) {
    //     this.$store.dispatch("unmuteMicParticipant", this.participantId);
    //   }else {
    //     this.$store.dispatch("muteMicParticipant", this.participantId);
    //   }
    //
    // },
    changePinPermission(state){
      this.isParticipantPinned = !this.isParticipantPinned
      if (!state){
        this.eventBus.emit("pinParticipant", {connectionId: this.connectionId, userId: this.participantId, name:this.participantName});

      }else {
        this.eventBus.emit("unPinParticipant", {connectionId: this.connectionId, userId: this.participantId, name:this.participantName});

      }
    },
    changeCameraStatus() {
      if (!this.permission.camera) {
        this.eventBus.emit("OPEN_PARTICIPANT_CAMERA", {connectionId: this.connectionId, userId: this.participantId,name:this.participantName});
      } else {
        this.eventBus.emit("CLOSE_PARTICIPANT_CAMERA", {connectionId: this.connectionId, userId: this.participantId,name:this.participantName});
      }
      // if (this.$store.getters.amISubstitutionModerator)
      //   this.eventBus.emit("notifySubstitutionForUserListUpdate", {});
      // else if (this.$store.getters.amIModerator)
      //   this.eventBus.emit("notifyModeratorForUserListUpdate", {});
    },
    changeMicStatus() {
      if (!this.permission.mic && +this.micOnCount < +this.publishCount) {
          const userInfo = {
            userId: this.participantId,
            displayName: this.participantName,
            status: true,
          };
          this.$store.dispatch("removeParticipantFromLayout", userInfo);

          this.eventBus.emit("OPEN_PARTICIPANT_MICROPHONE", {
            connectionId: this.connectionId,
            userId: this.participantId,
            name:this.participantName
          })
      } else if (!this.permission.mic && +this.micOnCount > +this.publishCount - 1) {
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "warning",
          bodyText: this.$t("participants-mic-on-exceeded"),
          time: 5000,
        });
      } else if (this.permission.mic) {
        this.eventBus.emit("CLOSE_PARTICIPANT_MICROPHONE", {connectionId: this.connectionId, userId: this.participantId,name:this.participantName});
        this.$store.dispatch("muteMicParticipant", this.participantId);
      }
      // if (this.$store.getters.amISubstitutionModerator)
      //   this.eventBus.emit("notifySubstitutionForUserListUpdate", {});
      // else if (this.$store.getters.amIModerator)
      //   this.eventBus.emit("notifyModeratorForUserListUpdate", {});
    },
    

    handleCameraDisable() {
      if (!this.permission.cameraAllow)
        this.eventBus.emit("notification", {
          title: "پیام",
          type: "warning",
          bodyText: this.$t("user_closed_camera"),
          time: 5000,
        });
    },

    openDropDown() {
      this.dropDownIsOpen = !this.dropDownIsOpen;
    },
    getSelectedItem(item) {
      const foundAction = this.allDropDownItems.find(
          (dropDownItem) => dropDownItem.label === item
      );
      const foundActionSub = this.allDropDownItemsSub.find(
          (dropDownItem) => dropDownItem.label === item
      );
      console.error(foundAction === this.$store.getters.t("removeFromMeeting"))
      switch (foundAction.label || foundActionSub.label) {
        case this.$store.getters.t("removeFromMeeting"):
          this.$store.dispatch("throwOutParticipant", this.participantId);
          this.eventBus.emit("throwOutParticipant", {connectionId: this.connectionId, userId: this.participantId, name:this.participantName});
          break;
        case this.$store.getters.t("privateChat"):
          this.goToPrivateChat()
          // this.eventBus.emit("private-message", this.participantId);
          break;
        case this.$store.getters.t("removeVideo"):
          this.eventBus.emit("removeParticipantFromLayout", {
            connectionId: this.connectionId,
            userId: this.participantId,
            name:this.participantName
          });
          break;
        case this.$store.getters.t("add-participant-to-audience"):
          this.eventBus.emit("bringParticipantFromLayout", {connectionId: this.connectionId, userId: this.participantId, name:this.participantName})

          break;
          // case this.$store.getters.t("remove-video-stream"):
          //   if (this.$store.getters.moderatorId == this.userId) {
          //     this.eventBus.emit("notification", {
          //       title: "پیام",
          //       type: "error",
          //       bodyText: this.$store.getters.t('can-not-delete-stream'),
          //       time: 5000,
          //     });
          //   } else {
          //     this.eventBus.emit("removeStreamParticipant", this.participantId);
          //     foundAction.label = this.$store.getters.t('Restore-video-stream');
          //     foundActionSub.label = this.$store.getters.t('Restore-video-stream');
          //   }
          //   break;
          // case this.$store.getters.t("Restore-video-stream"):
          //   this.eventBus.emit(
          //       "cancelRemoveStreamParticipant",
          //       this.participantId
          //   );
          //   foundAction.label = this.$store.getters.t("remove-video-stream");
          //   foundActionSub.label = this.$store.getters.t("remove-video-stream");
          //   break;
          // case this.$store.getters.t("pin"):
          //   setTimeout(() => {
          //     if(this.$store.getters.maximumPinSizeExceeds){
          //       foundAction.label = this.$t("pin");
          //       foundActionSub.label = this.$t("pin");
          //     }
          //   }, 1000)
          //   this.eventBus.emit("pinParticipant", this.participantId);
          //   foundAction.label = this.$store.getters.t("cancelPin");
          //   foundActionSub.label = this.$store.getters.t("cancelPin");
          //   break;
          // case this.$store.getters.t("cancelPin"):
          //   this.$store.dispatch('setHasMaximumPinExceeds', false);
          //   this.eventBus.emit("unPinParticipant", this.participantId);
          //   foundAction.label = this.$store.getters.t("pin");
          //   foundActionSub.label = this.$store.getters.t("pin");
          //   break;

          // case this.$store.getters.t('remove-user'):
          //   if (this.$store.getters.moderatorId == this.participantId) {
          //     this.eventBus.emit("notification", {
          //       title: "پیام",
          //       type: "error",
          //       bodyText: this.$store.getters.t('can-not-kick-out'),
          //       time: 5000,
          //     });
          //   } else {
          //     this.eventBus.emit("remove-participant", this.participantId);
          //   }
          //
          //   // this.$store.dispatch("throwOutParticipant", this.participantName);
          //   break;
        case this.$store.getters.t('board-permission'):
          foundAction.label = this.$store.getters.t('deny-board-permission');
          foundActionSub.label = this.$store.getters.t('deny-board-permission');
          this.changeBoardPermission(true);
          break;
        case this.$store.getters.t('deny-board-permission'):
          foundAction.label = this.$store.getters.t('board-permission');
          foundActionSub.label = this.$store.getters.t('board-permission');
          this.changeBoardPermission(false);
          break;
        case this.$store.getters.t('video-permission'):
          foundAction.label = this.$store.getters.t('deny-video-permission');
          foundActionSub.label = this.$store.getters.t('deny-video-permission');
          this.changeVideoSharingPermission(true);
          // foundAction.label = 'لغو اشتراک گذاری ویدیو';
          break;
        case this.$store.getters.t('deny-video-permission'):
          foundAction.label = this.$store.getters.t('video-permission');
          foundActionSub.label = this.$store.getters.t('video-permission');
          this.changeVideoSharingPermission(false);
          // foundAction.label = 'اجازه اشتراک گذاری ویدیو';
          break;
        case this.$store.getters.t('pdf-permission'):
          foundAction.label = this.$store.getters.t('deny-pdf-permission');
          foundActionSub.label = this.$store.getters.t('deny-pdf-permission');
          this.changepdfSharingPermission(true);
          // foundAction.label = 'لغو اشتراک گذاری ویدیو';
          break;
        case this.$store.getters.t('deny-pdf-permission'):
          foundAction.label = this.$store.getters.t('pdf-permission');
          foundActionSub.label = this.$store.getters.t('pdf-permission');
          this.changepdfSharingPermission(false);
          // foundAction.label = 'اجازه اشتراک گذاری ویدیو';
          break;
          // case this.$store.getters.t("sharePermission"):
          //   this.changeSharePermission(true);
          //   foundAction.label = this.$store.getters.t("shareCancellation");
          //   foundActionSub.label = this.$store.getters.t("shareCancellation");
          //   break;
          // case this.$store.getters.t("shareCancellation"):
          //   this.changeSharePermission(false);
          //   foundAction.label = this.$store.getters.t("sharePermission");
          //   foundActionSub.label = this.$store.getters.t("sharePermission");
          //   break;
          // case this.$store.getters.t("allow-proceedings-permission"):
          //   if (!this.isGuest) {
          //     foundAction.label = this.$store.getters.t("disallow-proceedings-permission");
          //     foundActionSub.label = this.$store.getters.t("disallow-proceedings-permission");
          //     this.changeProceedingsPermission(true);
          //   }else {
          //     this.eventBus.emit("notification", {
          //       title: "پیام",
          //       type: "error",
          //       bodyText: 'کاربر مهمان نمیتواند صورتجلسه برگزار کند',
          //       time: 5000,
          //     });
          //   }
          //
          //   break;
          // case this.$store.getters.t("disallow-proceedings-permission"):
          //   foundAction.label = this.$store.getters.t("allow-proceedings-permission");
          //   foundActionSub.label = this.$store.getters.t("allow-proceedings-permission");
          //   this.changeProceedingsPermission(false);
          //   break;
        case this.$store.getters.t('set-as-moderator') :
          if (!this.isGuest) {
            this.sendForPermission(true,this.userId)
          } else {
            this.eventBus.emit("notification", {
              title: "پیام",
              type: "error",
              bodyText: this.$store.getters.t('guest-can-not-be-moderator'),
              time: 5000,
            });
          }

          break
        case this.$store.getters.t('cancel-set-as-moderator') :
          foundAction.label = this.$store.getters.t('set-as-moderator')
          // others_handler.sendCancellation([this.$store.getters.newModeratorId, this.$store.getters.moderatorSubstituteId, this.$store.getters.moderatorId], this.extServicesId)
          this.$emit("change-hand-raise", {stat: false, id: this.participantId})
          this.userPermissions = {
            camera: true,
            microphone: false,
            pdfSharing: false,
            share: false,
            videoSharing: false,
          }
          this.setAsModerator({flag: false, id: ""})
          for (const item of [...this.allDropDownItems, ...this.allDropDownItemsSub]) {
            switch (item.label) {
                // case this.$store.getters.t('deny-board-permission') :
                //   item.label = this.$store.getters.t('board-permission');
                //   break;
                // case this.$store.getters.t('deny-video-permission'):
                //   item.label = this.$store.getters.t('video-permission');
                //   break;
                // case this.$store.getters.t('deny-pdf-permission'):
                //   item.label = this.$store.getters.t('pdf-permission');
                //   break;
              case this.$store.getters.t("shareCancellation"):
                item.label = this.$store.getters.t("sharePermission");
                break;
            }
          }
          break
      }
      this.eventBus.emit("close-drop-down");
    },

    toggleItem(data){
      let index = -1
      switch (data.item){
        case this.$store.getters.t("allow-proceedings-permission"):
          index = this.allDropDownItems.findIndex((el)=>{
            return el.label === this.$store.getters.t("allow-proceedings-permission")
          })
          if (data.status){
            this.allDropDownItems[index].isToggled = true
            this.changeProceedingsPermission(true);
          }else {
            this.allDropDownItems[index].isToggled = false
            this.changeProceedingsPermission(false);
          }
          break;
        case this.$store.getters.t("sharePermission"):
          index = this.allDropDownItems.findIndex((el)=>{
            return el.label === this.$store.getters.t("sharePermission")
          })
          if (data.status){
            this.allDropDownItems[index].isToggled = true
            this.changeSharePermission(true);
          }else {
            this.allDropDownItems[index].isToggled = false
            this.changeSharePermission(false);
          }
          break;

      }
    },
    changeSharePermission(stat) {
      if (stat){
        this.$store.dispatch("unmuteShareParticipant", this.participantId);
        this.eventBus.emit("unmuteShareParticipant", {connectionId: this.connectionId, userId: this.participantId, name:this.participantName});

      }else {
        this.$store.dispatch("muteShareParticipant", this.participantId);
        this.eventBus.emit("muteShareParticipant", {connectionId: this.connectionId, userId: this.participantId, name:this.participantName});

      }


      // this.eventBus.emit("changePermissions", {
      //   id: this.participantId,
      //   type: "share",
      //   stat,
      // });
      // this.userPermissions.share = stat;
    },
    handlePermissions(val){
      if ( val.share === true){
        const index =  this.allDropDownItems.findIndex((el) =>{
          return el.label === this.$store.getters.t("sharePermission")
        })
        if (index!== -1){
          this.allDropDownItems[index].isToggled = true
        }
        const indexSub =  this.allDropDownItemsSub.findIndex((el) =>{
          return el.label === this.$store.getters.t("sharePermission")
        })
        if (indexSub!== -1){
          this.allDropDownItemsSub[indexSub].isToggled = true
        }

      }else {
        const index =  this.allDropDownItems.findIndex((el) =>{
          return el.label === this.$store.getters.t("sharePermission")
        })
        if (index!== -1){
          this.allDropDownItems[index].isToggled = false
        }
        const indexSub =  this.allDropDownItemsSub.findIndex((el) =>{
          return el.label === this.$store.getters.t("sharePermission")
        })
        if (indexSub!== -1){
          this.allDropDownItemsSub[indexSub].isToggled = false
        }
      }
      if (val.proceedingsAllow === true){
        const index =  this.allDropDownItems.findIndex((el) =>{
          return el.label === this.$store.getters.t("allow-proceedings-permission")
        })
        if (index!== -1){
          this.allDropDownItems[index].isToggled = true
        }
        const indexSub =  this.allDropDownItemsSub.findIndex((el) =>{
          return el.label === this.$store.getters.t("allow-proceedings-permission")
        })
        if (indexSub!== -1){
          this.allDropDownItemsSub[indexSub].isToggled = true
        }
      }else {
        const index =  this.allDropDownItems.findIndex((el) =>{
          return el.label === this.$store.getters.t("allow-proceedings-permission")
        })
        if (index!== -1){
          this.allDropDownItems[index].isToggled = false
        }
        const indexSub =  this.allDropDownItemsSub.findIndex((el) =>{
          return el.label === this.$store.getters.t("allow-proceedings-permission")
        })
        if (indexSub!== -1){
          this.allDropDownItemsSub[indexSub].isToggled = false
        }
      }
    },
    changeProceedingsPermission(permissionAllow){
      // console.error('1111111111111111111111111111111111111111111111111')
      // console.error(this.$store.getters.moderatorId)
      // console.error(this.participantId)

      // console.error(this.$store.getters.proceedingsSecretaryId)
      if (permissionAllow){
        if (this.$store.getters.proceedingsSecretaryId){
          this. proceedingsPermissionHandler(false,this.$store.getters.proceedingsSecretaryId.toString())
        }
        this. proceedingsPermissionHandler(true,this.participantId)
        this.$store.dispatch('setProceedingsSecretaryId', this.participantId)
      }else {
        this. proceedingsPermissionHandler(false,this.participantId)
        this. proceedingsPermissionHandler(true,this.$store.getters.moderatorId.toString())
        this.$store.dispatch('setProceedingsSecretaryId',this.$store.getters.moderatorId)
      }
      // console.error('22222222222222222222222222222222222222222222222')
      // console.error(this.$store.getters.proceedingsSecretaryId)
    },
    proceedingsPermissionHandler(allow,id){
      console.error(allow)
      console.error(id)
      console.error(typeof id)
      this.$store.dispatch("updateProceedingsStatus", {
        userId: id,
        proceedingsStatus: allow,
        meetingId: this.$store.getters.roomId,
      });
    },
  },
};
</script>

<style scoped>
li {
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.4rem;
}

.participant__inner {
  width: 100%;
  height: 4.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.participant__icon {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
}

.participant__name {
  position: relative;
  width: 17rem;
  font-size: 1.2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 1rem;
  text-overflow: ellipsis;
}

.participant__name--span-moderator{
  max-width: 15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}
.participant__name--span-participant{
  max-width: 17rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}
.participant__name--tool-tip {
  visibility: hidden;
  max-width: 30rem;
  background-color: rgba(60, 64, 67, 0.8);
  text-align: center;
  border-radius: 5px;
  color: #fff;
  padding: 0.3rem;
  position: absolute;
  z-index: 1;
  top: 70%;
  right: 14%;
}

.participant__moderator-controls--1 {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  justify-content: left;
  width: 13.5rem;
  position: relative;
  left: -1rem;
}

.moderator-controls {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 0.8rem;
}

.moderator-controls__item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem;
}
.moderator-controls__item--more{
  position: relative;
  left: -0.3rem;
}

.moderator-controls__item_handraise {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem;
  width: 2rem;
}

.moderator-controls__item:hover {
  background-color: #f1f1f1;
}

.participant__moderator-controls--2 {
  width: 1.4rem;
  margin-left: 2.4rem;
  font-size: 1.6rem;
  font-weight: bold;
}

.more {
  padding-bottom: 0.5rem;
  position: relative;
  cursor: pointer;
}

.drop-down-container {
  width: 12rem;
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(0, 2.5rem);
  z-index: 20;
}

.participant {
  border-bottom: none;
  position: relative;
  margin-bottom: 0.3rem;
  /*pointer-events: none;*/
}

.absents__participants {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;

  background-color: rgba(255, 255, 255, 0.6);
}

.moderator__name {
  font-size: 1.2rem;
  z-index: 3;
  font-weight: 700;
  color: #292933;
}

.drop-down--background {
  position: absolute;
  z-index: 10000;
  width: 4rem;
  height: 2rem;
  top: 0;
}

.chat__container {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  left: 0.4rem;
}

@keyframes hand-wave {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(16deg);
  }
  20% {
    transform: rotate(-6deg);
  }
  30% {
    transform: rotate(16deg);
  }
  40% {
    transform: rotate(-4deg);
  }
  50% {
    transform: rotate(16deg);
  }
  60% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@media (max-width: 767px) {
  .drop-down-container {
    position: fixed;
    width: 100%;
    height: 60rem;
    left: 0;
    top: 100%;
    transform: translateY(-45%);
    z-index: 100000000;
  }
}
</style>

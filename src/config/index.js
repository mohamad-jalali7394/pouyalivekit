
export default {
  REST_API: process.env.VUE_APP_REST_API_SERVER || "https://360gw.shooka.com",
  SHOOKA_SERVER_URL: process.env.VUE_APP_SHOOKA_SERVER_URL || 'https://360gw.shooka.com/control-meeting/ws',
  OPENVIDU_SERVER_SECRET: process.env.VUE_APP_OPENVIDU_SERVER_SECRET || 'YOUR_SECRET',
  EXTERNAL_SERVICES: process.env.VUE_APP_EXTERNAL_SERVICES || 'https://extir.ancerz.com/',
  MEDIASOUP_SERVER: process.env.VUE_APP_MEDIASOUP_SERVER || 'https://mediair2.ancerz.com/',
  VUE_APP_LOGO_LOGIN: process.env.VUE_APP_LOGO_LOGIN || '/img/logo-login.svg',
  VUE_APP_LOGO_CALENDAR: process.env.VUE_APP_LOGO_CALENDAR || '/img/logo-calendar.svg',
  VUE_APP_JITSI_VR: process.env.VUE_APP_JITSI_VR || "vrj.shooka.com" ,
  VUE_APP_TENANT:process.env.VUE_APP_TENANT || '',
  TURN_ADDRESS: process.env.VUE_APP_TURN_ADDRESS,
  TURN_PORT: process.env.VUE_APP_TURN_PORT,
  SCHEDULE_URL: process.env.VUE_APP_SCHEDULE_URL,
  CALENDAR_URL: process.env.VUE_APP_CALENDAR_URL,
  MEETING_ENDED: process.env.VUE_APP_MEETING_ENDED,
  LANCHING_URL: process.env.VUE_APP_LANCHING_URL || 'https://360.shooka.com',
  LANCHING_URL_GUESTPRIVATE: process.env.VUE_APP_LANCHING_URL_GUESTPRIVATE || 'https://360.shooka.com/lg',
  LANCHING_URL_GUESTPUBLIC: process.env.VUE_APP_LANCHING_URL_GUESTPUBLIC || 'https://360.shooka.com/lgp',
  LANCHING_URL_BYEBYE: process.env.VUE_APP_LANCHING_URL_BYEBYE || 'https://360.shooka.com/meetingEnded',
  MAX_PARTICIPANTCOUNT: process.env.VUE_APP_MAX_PARTICIPANTCOUNT || 9,
  MAX_PARTICIPANTCOUNT_MOBILE_AND_TABLET: process.env.VUE_APP_MAX_PARTICIPANTCOUNT_MOBILE_AND_TABLET || 9,
  MAX_RETRY_JOIN: process.env.VUE_APP_MAX_RETRY_JOIN || 2
}

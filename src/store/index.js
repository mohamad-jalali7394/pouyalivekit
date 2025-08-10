import { createStore } from 'vuex'
import room from './module/room/index'
import userInfo from './module/user/userInfo'
import userState from './module/user/userState'
import subscribedStreams from './module/controlMeeting/subscribedStrems'
import streams from './module/controlMeeting/streams'
import permissions from './module/controlMeeting/permissions'
import chat from './module/chat/index'
import i18n from './module/i18n/index'
import invite from './module/invite/index'
import devices from './module/devices/index'
import board from "./module/board/index";
import videoSharing from "./module/videoSharing";
import privateRoom from './module/privateRoom/index'
import roles from './module/controlMeeting/roles'
import participants from './module/controlMeeting/participants'
import participantInfo from './module/participants/index'
import userTypesInConfrance from './module/userTypesInConfrance/index'
import guest from './module/guest/index'
import getters from './getters'
import pdfSharing from "./module/pdfSharing";
import loadBalancing from "./module/loadBalancing";
import layoutType from "./module/layoutType/index"
import meetingInfos from "./module/meetingInfos/index"
import session from "./module/session/index"
import recording from './module/controlMeeting/recording'


const store = createStore({
        modules: {
                userInfo,
                userState,
                room,
                subscribedStreams,
                streams,
                invite,
                devices,
                board,
                videoSharing,
                permissions,
                chat,
                privateRoom,
                roles,
                participants,
                userTypesInConfrance,
                guest,
                pdfSharing,
                loadBalancing,
                i18n,
                layoutType,
                meetingInfos,
                participantInfo,
                session,
                recording
        },
        getters
})

export default store;

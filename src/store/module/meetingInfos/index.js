const meetingInfos = {
    state:{
        agendaParagraphs: [],
        purposeOfMeeting:'',
        meetingStartTime:0,
        meetingEndTime:0,
        agendaHasTime:false,


    },

    mutations:{
        SET_AGENDAS_PARAGRAPH: (state, paragraphs) => {
            state.agendaParagraphs = paragraphs
        },
        SET_PURPOSE_OF_MEETING: (state, purposeOfMeeting) => {
            state.purposeOfMeeting = purposeOfMeeting
        },
        SET_START_Time: (state, meetingStartTime) => {
            state.meetingStartTime = meetingStartTime
        },
        SET_END_TIME: (state, meetingEndTime) => {
            state.meetingEndTime = meetingEndTime
        },
        SET_Has_TIME: (state, agendaHasTime) => {
            state.agendaHasTime = agendaHasTime
        },


    },

    actions:{
        setAgendaParagraphs({ commit }, paragraphs) {
            commit('SET_AGENDAS_PARAGRAPH', paragraphs)
        },
        setPurposeOfMeeting({ commit }, purposeOfMeeting) {
            commit('SET_PURPOSE_OF_MEETING', purposeOfMeeting)
        },
        setMeetingStartTime({ commit }, meetingStartTime) {
            commit('SET_START_Time', meetingStartTime)
        },
        setMeetingEndTime({ commit }, meetingEndTime) {
            commit('SET_END_TIME', meetingEndTime)
        },
        setAgendaHasTime({ commit }, agendaHasTime) {
            commit('SET_Has_TIME', agendaHasTime)
        },

    }
}
export default meetingInfos

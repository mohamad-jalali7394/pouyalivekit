
const pdfSharing = {
    state:{
        tempVideoTag : null,
        isSharedVideoPlaying : false,
        amIShareAVideo : false
    },

    mutations:{
        SET_USER_PDF_SHARING : (state, userpdfSharing) => {
            state.userpdfSharing = userpdfSharing;
        },
    },

    actions:{
        setUserpdfSharing({commit}, userpdfSharing){
            commit('SET_USER_PDF_SHARING', userpdfSharing);
        },
    }
}

export default pdfSharing

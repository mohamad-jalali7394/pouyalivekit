
const videoSharing = {
    state:{
        tempVideoTag : null,
        isSharedVideoPlaying : false,
        amIShareAVideo : false
    },

    mutations:{
        SET_TEMP_VIDEO_TAG : (state, tempVideoTag) => {
            state.tempVideoTag = tempVideoTag;
        },
        AM_I_SHARE_A_VIDEO : (state, amIShareAVideo) => {
          state.amIShareAVideo = amIShareAVideo;
        },
        SET_SHARED_VIDEO_STAT : (state, isSharedVideoPlaying) => {
            state.isSharedVideoPlaying = isSharedVideoPlaying;
        }
    },

    actions:{
        setTempVideoTag({commit}, tempVideoTag){
            commit('SET_TEMP_VIDEO_TAG', tempVideoTag);
        },
        setSharedVideoStat({commit}, isSharedVideoPlaying){
            commit('SET_SHARED_VIDEO_STAT', isSharedVideoPlaying);
        },
        setMyVideoSharingStat({commit}, amIShareAVideo){
            commit('AM_I_SHARE_A_VIDEO', amIShareAVideo);
        }
    }
}

export default videoSharing

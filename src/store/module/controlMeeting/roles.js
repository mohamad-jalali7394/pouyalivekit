
const roles = {
    state:{
        amIModerator: false,
        amIModeratorSubstitute: false,
        moderatorId : null,
        moderatorSubstituteId : null,
        newModeratorSubstituteId : null,
        amISelectedModeratorSubstitute : false,
        selectedModeratorSubstituteId:null,
        newModeratorId: "",
        proceedingsSecretaryId:null,
    },

    mutations:{
        SET_AM_I_MODERATOR: (state, amIModerator) => {
            state.amIModerator = amIModerator
        },
        SET_AM_I_SUBSTITUTION: (state, amIModeratorSubstitute) => {
            state.amIModeratorSubstitute = amIModeratorSubstitute
        },
        SET_MODERATOR_ID : (state, moderatorId) => {
            state.moderatorId = moderatorId;
        },
        SET_MODERATOR_SUBSTITUTE_ID : (state, moderatorSubstituteId) => {
            state.moderatorSubstituteId = moderatorSubstituteId
        },
        SET_AM_I__SELECTED_SUBSTITUTION: (state, amISelectedModeratorSubstitute) => {
            state.amISelectedModeratorSubstitute = amISelectedModeratorSubstitute
        },
        SET_SELECTED_MODERATOR_SUBSTITUTE_ID : (state, selectedModeratorSubstituteId) => {
            state.selectedModeratorSubstituteId = selectedModeratorSubstituteId
        },
        SET_NEW_MODERATOR_ID: (state, newModeratorId) => {
            state.newModeratorId = newModeratorId
        },
        SET_PROCEEDINGS_SECRETARY_ID: (state, proceedingsSecretaryId) => {
            state.proceedingsSecretaryId = proceedingsSecretaryId
        }
    },

    actions:{
        setAmIModerator({ commit }, amIModerator) {
            commit('SET_AM_I_MODERATOR', amIModerator)
        },
        setAmIModeratorSubstitute({ commit }, amIModeratorSubstitute) {
            commit('SET_AM_I_SUBSTITUTION', amIModeratorSubstitute)
        },
        setAmISelectedModeratorSubstitute({ commit }, amISelectedModeratorSubstitute) {
            commit('SET_AM_I__SELECTED_SUBSTITUTION', amISelectedModeratorSubstitute)
        },
        setModeratorId({commit}, moderatorId) {
            commit('SET_MODERATOR_ID', moderatorId);
        },
        setModeratorSubstituteId({ commit }, moderatorSubstituteId){
            commit('SET_MODERATOR_SUBSTITUTE_ID', moderatorSubstituteId);
        },
        setNewModeratorId({ commit }, newModeratorId){
            commit('SET_NEW_MODERATOR_ID', newModeratorId);
        },
        setSelectedModeratorSubstituteId({ commit }, selectedModeratorSubstituteId){
            commit('SET_SELECTED_MODERATOR_SUBSTITUTE_ID', selectedModeratorSubstituteId);
        },
        setProceedingsSecretaryId({ commit }, proceedingsSecretaryId){
            commit('SET_PROCEEDINGS_SECRETARY_ID', proceedingsSecretaryId);
        },
    }
}
export default roles
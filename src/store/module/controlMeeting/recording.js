const recording = {
    state: {
        egressId: '',
    },
    mutations: {
        SAVE_EGRESS_ID: (state, egressId) => {
            state.egressId = egressId
        }
    },
    actions: {
        saveEgressID({commit}, egressId) {
            console.log('egress id is : ' + egressId)
            commit('SAVE_EGRESS_ID', egressId)
        }
    }
}
export default recording
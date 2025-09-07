
const loadBalancing = {
    state:{
       vrURL:'',
    },

    mutations:{
        SET_VR_ADDRESS: (state, vrURL) => {
            state.vrURL = vrURL
        },

    },

    actions:{
        setvrURL({ commit }, vrURL) {
            commit('SET_VR_ADDRESS', vrURL)
        },


    }
}
export default loadBalancing

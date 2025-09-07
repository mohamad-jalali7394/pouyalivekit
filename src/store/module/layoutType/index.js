const layoutType = {
    state:{
        layoutType: 'flat',

    },

    mutations:{
        LAYOUT_TYPE: (state, layoutType) => {
            state.layoutType = layoutType
        },

    },

    actions:{
        setLayoutType({ commit }, layotType) {
            commit('LAYOUT_TYPE', layotType)
        },

    }
}
export default layoutType

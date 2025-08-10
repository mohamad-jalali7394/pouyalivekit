const i18n = {
    state : {
        textHandler : null
    },
    mutations : {
        SET_I18N_TEXT_HANDLER : (state, textHandler) => {
            state.textHandler = textHandler
        }
    },
    actions : {
        setI18NTextHandler({ commit }, textHandler){
            commit('SET_I18N_TEXT_HANDLER', textHandler);
        }
    }
}
export default i18n;
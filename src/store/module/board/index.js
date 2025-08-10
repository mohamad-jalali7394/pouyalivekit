
const board = {
    state:{
        drawingTools : new Map(),
        boardsMainCanvases : new Map(),
        boardsTempCanvasesCtx : new Map(),
        boardsHistory : new Map(),
        boardsNumber : 20
    },

    mutations:{
        SET_DRAWING_TOOLS : (state, {number, drawingTools}) => {
            state.drawingTools.set(number, drawingTools);
        },
        SET_BOARDS_TEMP_CANVASES_CTX : (state, {number, tempCanvasCtx}) => {
            state.boardsTempCanvasesCtx.set(number, tempCanvasCtx);
        },
        SET_BOARDS_MAIN_CANVASES : (state, {number ,mainCanvas}) => {
          state.boardsMainCanvases.set(number, mainCanvas);
        },
        SET_BOARDS_HISTORY : (state, {number, mainCanvas}) => {
            state.boardsHistory.set(number, mainCanvas);
        },
        SET_CURRENT_BOARDS_NUMBER : (state, boardNumber) => {
            state.boardNumber = boardNumber;
        },
    },

    actions:{
        setDrawingTools({commit}, {number, drawingTools}){
            commit('SET_DRAWING_TOOLS', {number, drawingTools});
        },
        setBoardsTempCanvasesCtx({commit}, {number, tempCanvasCtx}){
            commit('SET_BOARDS_TEMP_CANVASES_CTX', {number, tempCanvasCtx})
        },
        setBoardsMainCanvases({commit}, {number, mainCanvas}){
          commit('SET_BOARDS_MAIN_CANVASES', {number, mainCanvas})
        },
        setBoardsHistory({commit}, {number, mainCanvas}){
            commit('SET_BOARDS_HISTORY', {number, mainCanvas})
        },
        setCurrentBoardNumber({commit}, boardNumber){
            commit('SET_CURRENT_BOARDS_NUMBER', boardNumber)
        },
    }
}

export default board

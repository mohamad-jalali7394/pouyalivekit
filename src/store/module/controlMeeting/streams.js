
const streams = {
    state:{
        streams: []
    },

    mutations:{
        ADD_TO_STREAMS: (state, event) => {
            state.streams.push(event)
        },
        REMOVED_FROM_STREAMS: (state, event) => {
            // Delete the HTML element with the user's nickname. HTML videos are automatically removed from DOM
            const index = state.streams.findIndex(function(element) {
                return element.streamObject && element.streamObject.stream.connection.connectionId === event.stream.connection.connectionId
            })
            if (index > -1) {
                state.streams.splice(index, 1)
            }
        },
        LEAVE_SESSION: (state) => {
            try {
                state.streams = []
            } catch (error) {
                console.error(error)
            }
        }
    },

    actions:{
        addToStreams({ commit}, event) {
            commit('ADD_TO_STREAMS', event)
        },
        removeFromstreams({ commit}, subscriber) {
            commit('REMOVED_FROM_STREAMS', subscriber)
        }
    }
}
export default streams
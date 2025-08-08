import eventBus from "../../../utils/event.bus";
const subscribedStreams = {
    state:{
        subscribedStreams: []
    },

    mutations:{
        ADD_TO_SUBSCRIBED_STREAMS: (state, event) => {
            state.subscribedStreams.push(event)
        },
        REMOVED_FROM_SUBSCRIBED_STREAMS: (state, event) => {
            const index = state.subscribedStreams.findIndex(function(element) {
                return element.stream && element.stream.connection.connectionId === event.stream.connection.connectionId
            })
            if (index > -1) {
                state.subscribedStreams.splice(index, 1)
            }
            eventBus.$emit('streamDestroyed', event.stream.connection.connectionId)
        }
    },

    actions:{
        addToSubscribedStreams({ commit}, event) {
            commit('ADD_TO_SUBSCRIBED_STREAMS', event)
        },
        removeFromSubscribedStreams({ commit,}, subscriber) {
            commit('REMOVED_FROM_SUBSCRIBED_STREAMS', subscriber)
        }
    }
}
export default subscribedStreams
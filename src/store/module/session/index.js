
import eventBus from "@/utils/event.bus";
const session = {
    state: {
        OV: undefined,
        session: '',
        session_name: '',
        session_id: '',
        publisher: null,
        sessionToken: '',
        shareToken: '',
        webinar: false,
        startTime : '',
        endTime : '',
        rotationStatus:true,
        vrAddress:'',
        vrPort:'',
    },

    mutations: {

        SET_SESSION: (state, session) => {
            state.session = session
        },
        SET_PUBLISHER: (state, publisher) => {
            state.publisher = publisher.publisher
        },
        SET_SESSION_ID: (state, session_id) => {
            state.session_id = session_id
        },
        SET_SESSION_NAME: (state, session_name) => {
            state.session_name = session_name
        },
        SET_SCHEDULE_ID: (state, session_id) => {
            state.session_id = session_id
        },
        SET_SESSION_TOKEN: (state, token) => {
            state.sessionToken = token
        },
        SET_SHARE_TOKEN: (state, shareToken) => {
            state.shareToken = shareToken
        },
        SET_IS_WEBINAR_MEETING: (state, webinar) => {
            state.webinar = webinar
        },
        SET_START_TIME: (state,time) => {
            state.startTime = time
        },
        SET_END_TIME: (state,time) => {
            state.endTime = time
        },
        SET_ROTATION_STATUS: (state,status) => {
            state.rotationStatus = status
        },
        // INIT_OPENVIDU: (state) => {
        //     state.OV = new OpenVidu()
        //     state.OV.setAdvancedConfiguration({
        //         screenShareChromeExtension: 'https://chrome.google.com/webstore/detail/YOUR_EXTENSION_NAME/YOUR_EXTENSION_ID',
        //         publisherSpeakingEventsOptions: {
        //             interval: 200, // Frequency of the polling of audio streams in ms (default 100)
        //             threshold: -40 // Threshold volume in dB (default -50)
        //         }
        //     })
        //     state.OV.enableProdMode()
        //     var openviduSupported = state.OV.checkSystemRequirements()
        //     if (openviduSupported === 1) {
        //     console.log('supported')
        //     }
        //     var shareSupported = state.OV.checkScreenSharingCapabilities
        //     if (shareSupported === 1) {
        //         console.log('supported')
        //     }
        // },
        SET_VR_ADDRESS: (state,vrAddress) => {
            state.vrAddress = vrAddress
        },
        SET_VR_PORT: (state,vrPort) => {
            state.vrPort = vrPort
        },

    },
    actions: {
        initOpenVidu({ commit }) {
            commit('INIT_OPENVIDU')
        },
        setSession({ commit, state, dispatch }) {
            const session = state.OV.initSession()
            commit('SET_SESSION', session)
            state.session.on('streamCreated', event => {
                try {
                    // let userData
                    let nodeId
                    const connection = event.stream.connection
                    if (typeof connection === 'string') {
                        nodeId = connection
                    } else {
                        nodeId = connection.connectionId
                    }
                    const participant = {
                        streamObject: event,
                        id: nodeId,
                        connection: connection,
                        connectionId: nodeId,
                        layout_area: null,
                        subscriber: null
                    }
                    // TODO prevent subscribing if max user reached
                    participant.isItMe = false
                    dispatch('streams/addToStreams', participant, { root: true })
                    eventBus.$emit('streamCreated', participant)
                } catch (error) {
                    console.error(error)
                }
            })
            state.session.on('streamDestroyed', event => {
                try {
                    dispatch('streams/removeFromStreams', event, { root: true })
                    dispatch('subscribedStreams/removeFromSubscribedStreams', event, { root: true })
                } catch (error) {
                    console.error(error)
                }
            })
            this.session.on('exception', ({ exception }) => {
                console.error(exception);
            });
            state.session.on('sessionDisconnected ', (event) => {
                console.log(event)
            })
            state.session.on('connectionCreated', (event) => { console.log(event) })
            state.session.on('connectionDestroyed', (event) => {
                eventBus.$emit('connectionDestroyed', event)
            })
            state.session.on('publisherStartSpeaking', (event) => {
                eventBus.$emit('publisherStartSpeaking', event)
            })

            state.session.on('publisherStopSpeaking', (event) => {
                eventBus.$emit('publisherStopSpeaking', event)
            })
            state.session.on('signal', () => { })
            commit('SET_SESSION', session)
        },
        setSessionName({ commit }, session_name) {
            commit('SET_SESSION_NAME', session_name)
        },
        setSessionId({ commit }, session_name) {
            commit('SET_SESSION_ID', session_name)
        },
        setScheduleId({ commit }, schedule_id) {
            commit('SET_SCHEDULE_ID', schedule_id)
        },
        setSessionToken({ commit }, token) {
            commit('SET_SESSION_TOKEN', token)
        },
        setSessionShareToken({commit} , shareToken) {
            commit ('SET_SHARE_TOKEN', shareToken)
        },
        setIsWebinarMeeting({ commit }, webinar) {
            commit('SET_IS_WEBINAR_MEETING', webinar)
        },
        setStartTime({ commit }, time) {
            commit('SET_START_TIME', time)
        },
        setEndTime({ commit }, time) {
            commit('SET_END_TIME', time)
        },
        setRotationStatus({ commit }, status) {
            commit('SET_ROTATION_STATUS', status)
        },
        setPublisher({ commit, state, dispatch }, publisher) {
            commit('SET_PUBLISHER', publisher)
            const participant = {
                display_name: publisher.display_name,
                layout_area: publisher.layout_area,
                isModerator: state.amIModerator,
                isItMe: true,
                pin: false,
                streamObject: event
            }
            dispatch('streams/addToStreams', participant, { root: true })
            for (let i = 0; i < state.participants.length; i++) {
                if (state.participants[i].display_name === publisher.display_name) { return }
            }
        },
        setvrAddress({ commit }, vrAddress) {
            commit('SET_VR_ADDRESS', vrAddress)
        },
        setvrPort({ commit }, vrPort) {
            commit('SET_VR_PORT', vrPort)
        },

    }
}
export default session

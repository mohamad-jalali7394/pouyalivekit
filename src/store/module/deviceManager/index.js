import DeviceService from "../../../services/Device.service";

const deviceManager = {
    state:{
        devices: [],
        selectedAudio: DeviceService.getَAudioDevice(),
        selectedVideo: DeviceService.getَVideoDevice()
    },

    mutations:{
        SET_DEVICES: (state, devices) => {
            state.devices = devices
        },
        SET_AUDIO_DEVICE: (state, deviceId) => {
            state.selectedAudio = deviceId
            DeviceService.saveAudioDevice(deviceId)
        },
        SET_VIDEO_DEVICE: (state, deviceId) => {
            state.selectedVideo = deviceId
            DeviceService.saveVideoDevice(deviceId)
        }
    },

    actions:{
        getDevices({ commit, rootGetters, dispatch }) {
            dispatch('openviduClient/initialize', {}, { root: true })
            const OV = rootGetters['openviduClient/OV']
            if (!OV) return
            OV.getDevices()
                .then((devices) => {
                    commit('SET_DEVICES', devices)
                })
                .catch((error) => {
                    console.error(error)
                    commit('SET_DEVICES', null)
                })
        },
        getSelectedDevices({ state }) {
            state.selectedAudio = DeviceService.getَAudioDevice()
            state.selectedVideo = DeviceService.getَVideoDevice()
        },
        async setAudioDevice({ commit }, deviceId) {
            commit('SET_AUDIO_DEVICE', deviceId)
        },
        async setVideoDevice({ commit }, deviceId) {
            commit('SET_VIDEO_DEVICE', deviceId)
        }
    }
}
export default deviceManager
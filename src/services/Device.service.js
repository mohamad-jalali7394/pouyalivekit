const AUDIO_DEVICE_KEY = 'access_token'
const VIDEO_DEVICE_KEY = 'refresh_token'

const DeviceService = {
  getَAudioDevice() {
    return localStorage.getItem(AUDIO_DEVICE_KEY)
  },

  saveAudioDevice(audioDevice) {
    localStorage.setItem(AUDIO_DEVICE_KEY, audioDevice)
  },

  removeAudioDevice() {
    localStorage.removeItem(AUDIO_DEVICE_KEY)
  },

  getَVideoDevice() {
    return localStorage.getItem(VIDEO_DEVICE_KEY)
  },

  saveVideoDevice(videoDevice) {
    localStorage.setItem(VIDEO_DEVICE_KEY, videoDevice)
  },

  removeVideoDevice() {
    localStorage.removeItem(VIDEO_DEVICE_KEY)
  }
}

export default DeviceService

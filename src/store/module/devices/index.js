const devices = {
  state: {
    camVideoStream: null,
    micAudioStream: null,
    selectedCamera:null,
    selectedMic:null,
    cameraId: "",
    microphoneId: "",
    speaker: null,
    cameraAspectRatio: 0,
  },

  mutations: {
    SET_CAMERA_ID: (state, cameraid) => {
      state.cameraId = cameraid;
    },
    SET_MICROPHONE_AUDIO_STREAM: (state, micAudioStream) => {
      state.micAudioStream = micAudioStream;
    },
    SET_CAMERA_VIDEO_STREAM: (state, camVideoStream) => {
      state.camVideoStream = camVideoStream;
    },
    REMOVE_MICROPHONE_AUDIO_STREAM: state => {
      state.micAudioStream.getTracks().forEach((track) => {
        track.stop();
      });
    state.micAudioStream = null;
  },
  REMOVE_CAMERA_VIDEO_STREAM: state => {
    state.camVideoStream.getTracks().forEach((track) => {
      track.stop();
    });
    state.camVideoStream = null;
  },
    SET_MIC_ID: (state, micId) => {
      state.microphoneId = micId;
    },
    SET_CAMERA_ASPECT_RATIO: (state, aspectRatio) => {
      state.cameraAspectRatio = aspectRatio;
    },
    SET_SPEAKER:(state, speaker) => {
      state.speaker = speaker;
    },
    SET_CAMERA:(state, selectedCamera) => {
      state.selectedCamera = selectedCamera;
    },
    SET_MICROPHONE:(state, selectedMic) => {
      state.selectedMic = selectedMic;
    },

  },

  actions: {
    setCameraVideoStream({ commit }, camVideoStream) {
      commit("SET_CAMERA_VIDEO_STREAM", camVideoStream);
    },
    setMicrophoneAudioStream({ commit }, micAudioStream) {
      commit("SET_MICROPHONE_AUDIO_STREAM", micAudioStream);
    },
    setCameraId({ commit }, cameraId) {
      commit("SET_CAMERA_ID", cameraId);
    },
    setMicrophoneId({ commit }, micId) {
      commit("SET_MIC_ID", micId);
    },
    setspeaker({ commit }, speaker) {
      commit("SET_SPEAKER", speaker);
    },
    setCamera({ commit }, selectedCamera) {
      commit("SET_CAMERA", selectedCamera);
    },
    setMicrophone({ commit }, selectedMic) {
      commit("SET_MICROPHONE", selectedMic);
    },
    setCameraAspectRatio({ commit }, aspectRatio) {
      commit("SET_CAMERA_ASPECT_RATIO", aspectRatio);
    },
    removeCameraVideoStream({ commit }) {
      commit("REMOVE_CAMERA_VIDEO_STREAM");
    },
    removeMicrophoneAudioStream({ commit }) {
      commit("REMOVE_MICROPHONE_AUDIO_STREAM");
    },
  },
};
export default devices;

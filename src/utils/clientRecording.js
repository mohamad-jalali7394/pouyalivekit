import store from '../store'
import eventBus from "../utils/event.bus";
function download() {
    const link = document.createElement("a");
    link.href = recording;
    link.download =  `${store.getters.session_name}`;
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
}

let chunks = [];
let stream, desktopStream, voiceStream, mediaRecorder, recording;
let micTrack = null;
let isMicEnabled = true; // Track mic status for recording

export async function startCapture(element, micStatus = true) {
    try {
        chunks = [];
        recording = null;
        isMicEnabled = micStatus;
        desktopStream = await navigator.mediaDevices.getDisplayMedia(
            displayMediaOptions
        );
        voiceStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        });
        desktopStream.addEventListener("inactive", () => {
            console.log("Capture stream inactive - stop recording!");
            stopCapture(element);
        });
        const audioTracks = mergeAudioStreams(desktopStream, voiceStream);
        micTrack = voiceStream.getAudioTracks()[0];
        if (micTrack) {
            micTrack.enabled = !!micStatus;
        }
        const tracks = [...desktopStream.getVideoTracks(), ...audioTracks];
        stream = new MediaStream(tracks);

        mediaRecorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp9,opus",
        });
        mediaRecorder.addEventListener("dataavailable", (event) => {
            if (event.data && event.data.size > 0) {
                chunks.push(event.data);
            }
        });
        mediaRecorder.start(10);
        eventBus.emit('start-recording-from-browser-api')
    } catch (err) {
        console.error("Error: " + err);
    }
}

// Call this function when micStatus changes in TheConference
export function setRecordingMicStatus(enabled) {
    isMicEnabled = !!enabled;
    if (micTrack) {
        micTrack.enabled = isMicEnabled;
    }
}

export function stopCapture() {
    if (mediaRecorder && stream) {
        mediaRecorder.stop();
        mediaRecorder = null;
        stream.getTracks().forEach((track) => track.stop());
        desktopStream.getTracks().forEach((track) => track.stop());
        stream = null;
        desktopStream = null;
        voiceStream = null;
        recording = window.URL.createObjectURL(
            new Blob(chunks, {type: "video/webm"})
        );
        eventBus.emit('end-recording-from-browser-api')
        download();
    }
}
var displayMediaOptions = {
    video: {
        cursor: "always",
        displaySurface: "browser",

    },
    selfBrowserSurface: "include",
    preferCurrentTab: "true",
    videoConstraints: {
        mandatory: {
            chromeMediaSource: "tab",
        },
    },
    audio: {
        echoCancellation: false,
        noiseSuppression: false,
        sampleRate: 44100,
    },
};

const mergeAudioStreams = (desktopStream, voiceStream) => {
    const context = new AudioContext();
    // Create a couple of sources
    const source1 = context.createMediaStreamSource(desktopStream);
    const source2 = context.createMediaStreamSource(voiceStream);
    const destination = context.createMediaStreamDestination();
    const desktopGain = context.createGain();
    const voiceGain = context.createGain();
    desktopGain.gain.value = 0.7;
    voiceGain.gain.value = 0.7;
    source1.connect(desktopGain).connect(destination);
    // Connect source2
    source2.connect(voiceGain).connect(destination);
    return destination.stream.getAudioTracks();
};



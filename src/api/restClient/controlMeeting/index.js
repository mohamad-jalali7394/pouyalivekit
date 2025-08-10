import genericClient from '../genericClient'
import config from '@/config'
import eventBus from "../../../utils/event.bus";
class controlMeeting extends genericClient {
  iWantToJoin(schedule_id,meetingPinCode) {
  // iWantToJoin(schedule_id) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth.getKilid()
          }
        })
        .get(this.localSettings.endpoints.controlMeeting.iWantToJoin + schedule_id +'?meetingPinCode=' +meetingPinCode.toString())
        // .get(this.localSettings.endpoints.controlMeeting.iWantToJoin + schedule_id)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
          resolve(result.data.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  iWantToJoinPrivate(schedule_id) {
    // iWantToJoin(schedule_id) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth.getKilid()
          }
        })
        .get(this.localSettings.endpoints.controlMeeting.iWantToJoinPrivate + schedule_id)
      // .get(this.localSettings.endpoints.controlMeeting.iWantToJoin + schedule_id)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
          resolve(result.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  iWantToJoinAsGuest(schedule_id, displayName, password, uniqueId, customerId, meetingType) {
    // iWantToJoin(schedule_id) {
      return new Promise((resolve, reject) => {
          this.axios
              .create({
                  baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                      'Content-Type': 'application/json'
                      // 'Authorization': 'Bearer ' + this.auth.getkilid()
                  }
              })
              .get(this.localSettings.endpoints.controlMeeting.iWantToJoinAsGuest + schedule_id, {
                  params: {
                      displayName: displayName,
                      uniqueId: uniqueId,
                      customerId: customerId,
                      meetingType: meetingType
                  }
              })
              // .get(this.localSettings.endpoints.controlMeeting.iWantToJoin + schedule_id)
              .then(response => {
                  const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
                  resolve(result.data)
              })
              .catch((error) => {
                  reject(error)
              })
      })
  }
  iWantToJoinPrivateAsGuest(schedule_id, displayName, password, uniqueId, customerId) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json'
            // 'Authorization': 'Bearer ' + this.auth.getkilid()
          }
        })
        .get(this.localSettings.endpoints.controlMeeting.iWantToJoinPrivateAsGuest + schedule_id, { params: { displayName: displayName, password: password, uniqueId: uniqueId, customerId: customerId }})
      // .get(this.localSettings.endpoints.controlMeeting.iWantToJoin + schedule_id)
        .then(response => {
          const result = this.ApiResponseService.checkResponse(response, reject, response.data.success)
          resolve(result.data)
        })
        .catch((error) => {
          if (Number(error.response.status) === 401) {
            eventBus.emit('notification', {
              type: 'warning',
              title: 'پیام',
              text: 'گذرواژه اشتباه است',
              duration: 5000
            })
          }
          reject(error)
        })
    })
  }
  rotation(schedule_id) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth.getKilid()
          }
        })
        .post(this.localSettings.endpoints.controlMeeting.rotation + { params: { meetingId: schedule_id }})
        .then(response => {
          if (this.checkResponse(response, reject)) {
            resolve(response.data.data)
          } else reject()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  getPublisherList(schedule_id) {
    return new Promise((resolve, reject) => {
      this.axios
        .create({
          baseURL: config.REST_API,
          timeout: this.localSettings.http_request_general_timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth.getKilid()
          }
        })
        .post(this.localSettings.endpoints.controlMeeting.publisherList + { params: { meetingId: schedule_id }})
        .then(response => {
          if (this.checkResponse(response, reject)) {
            resolve(response.data.data)
          } else reject()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

    saveJoinTimeHistory(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.saveJoinTimeHistory ,data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response.data.data)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    saveLeftTimeHistory(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: this.localSettings.http_request_general_timeout,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.saveLeftTimeHistory ,data)
                // .get(this.localSettings.endpoints.controlMeeting.iWantToJoin + schedule_id)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response.data.data)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    openMic(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.openMic, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    closeMic(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.closeMic, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    openVideo(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.openVideo, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    openCamera(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.openCamera, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    closeCamera(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.closeCamera, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    openShare(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.openShare, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    closeShare(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.closeShare, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    iWantToPublish(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.iWantToPublish, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    iWantToLeave(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.iWantToLeave, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    removeVideo(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.removeVideo, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    pin(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.pin, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    unPin(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.unPin, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    handRaiseRequest(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.handraiseRequest, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    handRaiseResponse(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.handraiseResponse, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    participantLeft(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.participantLeft, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    publishList(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.publishList, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    kickOut(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.kickOut, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    enableSubstitutionModerator(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.enableSubstitutionModerator, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    disableSubstitutionModerator(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.disableSubstitutionModerator, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    getUserList(meetingId) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .get(this.localSettings.endpoints.controlMeeting.getUserList + meetingId)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }


    userInForGround(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.userInForGround, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    userInBackGround(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.userInBackGround, data)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    startRecording(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.startRecording, null, {
                    params: {
                        customerId:data.customerId,
                        customerName: data.customerName,
                        meetingName: data.meetingName,
                        meetingTime: data.meetingTime,
                        roomName: data.roomName,
                    },
                })
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    stopRecording(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.stopRecording, null, {
                    params: {
                        customerId:data.customerId,
                        egressId: data.egressId,
                    },
                })
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    downloadRecordedFiles(customerId,filename) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API,
                    timeout: 1000000,
                    headers: {
                        'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.controlMeeting.downloadRecordedFile, {
                    params: { customerId: +customerId,
                        filename: filename },
                    responseType: 'blob' // ✅ IMPORTANT for file download
                })
                .then(response => {
                    // ✅ Trigger browser download
                    const blob = new Blob([response.data]);
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;

                    // Optional: get filename from Content-Disposition header
                    const disposition = response.headers['content-disposition'];
                    let suggestedFilename = filename;
                    if (disposition && disposition.includes('filename=')) {
                        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                        if (match && match[1]) {
                            suggestedFilename = decodeURIComponent(match[1].replace(/['"]/g, ''));
                        }
                    }

                    link.setAttribute('download', suggestedFilename);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);

                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }


    getListOfRecordedFiles(customerId, customerName, roomId, meetingName) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.controlMeeting.getListOfRecordedFiles, {
                    params: {
                        customerId:customerId,
                        customerName:customerName,
                        roomId:roomId,
                        meetingName:meetingName
                    },
                })
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    deleteRecordingFile(customerId, filename) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.controlMeeting.deleteRecordingFile + "/" + customerId + "/" + filename)
                .then(response => {
                    // if (this.checkResponse(response, reject)) {
                    resolve(response)
                    // } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    streamRecording(customerId,filename) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .get(this.localSettings.endpoints.controlMeeting.streamRecordingFile + "/" + customerId + "/" + filename)
                .then(response => {
                    if (this.checkResponse(response, reject)) {
                        resolve(response)
                    } else reject()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    changeActiveSpeakerView(data) {
        return new Promise((resolve, reject) => {
            this.axios
                .create({
                    baseURL: config.REST_API, timeout: this.localSettings.http_request_general_timeout, headers: {
                        'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.auth.getKilid()
                    }
                })
                .post(this.localSettings.endpoints.controlMeeting.changeActiveSpeakerView, data)
                .then(response => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }


}

export default controlMeeting
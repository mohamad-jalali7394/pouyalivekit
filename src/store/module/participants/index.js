import store from "../../index";
// import leave_handler from "../../../utilities/leave_handler";
const participantInfo = {
    state : {
        myInfo : {amIMobile: false, amIHaveCamera: true, amIHaveMicrophone : true},
        innerParticipants : [
            {participantId: "null-break", position: "null-break", stream: null}
        ],
        outerParticipants : [],
        pinnedParticipants : [],
        participantsCounter : 0,
        extServicesJoinedParticipants : [],
        combinedExtServicesAndMediaServerParticipants : [],
        removedParticipantsAfterSplicingForLeave : [],
        shareData : null,
        activeSpeaker: null,
        consumersPool: new Map()
    },
    mutations: {
            ADD_TO_CONSUMERS_POOL: (state, info) => {
              state.consumersPool.set(info.consumerTransportId, {consumerId : info.consumerId, inner: info.inner, isInnerForMobiles: info.isInnerForMobiles})
            },
            SET_MY_INFO: (state, info) => {
                state.myInfo[info.type] = info.payload;
            },
            SET_NEW_DEVICE_STREAMS_FOR_DEVICE_CHANGE : (state, {
                videoStream
            }) => {
                const me = [...state.innerParticipants, ...state.outerParticipants].
                find(participant => participant.participantId === state.myInfo.myId);
                if(!me) return;
                me.videoStream = videoStream;
            },
            SET_INNER_STREAMS_FOR_CONSUMING_NEW_PRODUCERS: (state, {
                participantId,
                videoStream,
                audioStream,
            }) => {
                const foundInnerParticipant = state.innerParticipants.find(
                    (participant) => participant?.participantId === participantId
                );
                if(foundInnerParticipant){
                    foundInnerParticipant.videoStream = videoStream;
                    foundInnerParticipant.audioStream = audioStream;
                } else {
                    alert('an error occurred inner participants');
                }
            },
            SET_OUTER_STREAMS_FOR_CONSUMING_NEW_PRODUCERS: (state, {
                participantId,
                videoStream,
                audioStream
            }) => {
                const foundOuterParticipant = state.outerParticipants.find(
                    (participant) => participant?.participantId === participantId
                );
                if(foundOuterParticipant){
                    foundOuterParticipant.videoStream = videoStream;
                    foundOuterParticipant.audioStream = audioStream;
                } else {
                    alert('an error occurred outer participants');
                }
            },
            SET_INITIAL_INNER_PARTICIPANT_FOR_NEW_PRODUCERS: (state, {
                participantName,
                participantId,
                audioProducerId,
                videoProducerId,
                isVideoMute,
                isAudioMute,
                handRaiseStat,
                inner,
                isInnerForMobiles,
                permissions,
                isSubModerator,
                isGuest
            }) => {
                const foundInnerParticipant = state.innerParticipants.find(
                    (participant) => participant?.participantId === participantId
                );
                if (!foundInnerParticipant) {
                    ++state.participantsCounter;
                    let innerParticipant = {
                        participantName,
                        participantId,
                        permissions,
                        producers: {video: videoProducerId, audio: audioProducerId},
                        inner,
                        isInnerForMobiles,
                        isAudioMute,
                        isVideoMute,
                        handRaiseStat,
                        isSubModerator,
                        isGuest,
                    };

                    if (state.participantsCounter === 1) {
                        innerParticipant.position = "upper";
                        state.innerParticipants.unshift(innerParticipant);
                    } else {
                        innerParticipant.position = "lower";
                        state.innerParticipants.push(innerParticipant);
                    }
                } else {
                    foundInnerParticipant.producers.video = videoProducerId;
                    foundInnerParticipant.producers.audio = audioProducerId;
                }
            },
            SET_INITIAL_OUTER_PARTICIPANT_FOR_NEW_PRODUCERS: (state, {
                participantName,
                participantId,
                audioProducerId,
                videoProducerId,
                isVideoMute,
                isAudioMute,
                handRaiseStat,
                inner,
                isInnerForMobiles,
                permissions,
                isSubModerator,
                isGuest
            }) => {
                const foundOuterParticipant = state.outerParticipants.find(
                    (participant) => participant?.participantId === participantId
                );
                if (!foundOuterParticipant) {
                    let outerParticipant = {
                        participantName,
                        participantId,
                        permissions,
                        producers: {video: videoProducerId, audio: audioProducerId},
                        inner,
                        isInnerForMobiles,
                        isAudioMute,
                        isVideoMute,
                        handRaiseStat,
                        isSubModerator,
                        isGuest
                    };
                    outerParticipant.position = "lower";
                    state.outerParticipants.push(outerParticipant);
                } else {
                    foundOuterParticipant.producers.video = videoProducerId;
                    foundOuterParticipant.producers.audio = audioProducerId;
                }
            },
            SET_INNER_PARTICIPANT: (state, {
                participantName,
                participantId,
                stream,
                producerId,
                isVideoMute,
                isAudioMute,
                handRaiseStat,
                inner,
                isInnerForMobiles,
                kind,
                permissions,
                isSubModerator,
                isGuest
            }) => {
                const foundInnerParticipant = state.innerParticipants.find(
                    (participant) => participant?.participantId === participantId
                );
                if (!foundInnerParticipant) {
                  ++state.participantsCounter;
                  let innerParticipant = {
                    participantName,
                    participantId,
                    permissions,
                    [kind === "video" ? "videoStream" : "audioStream"]: stream,
                    producers: {[kind === "video" ? "video" : "audio"]: producerId},
                    inner,
                    isInnerForMobiles,
                    isAudioMute,
                    isVideoMute,
                    handRaiseStat,
                    isSubModerator,
                    isGuest,
                  };

                  if (state.participantsCounter === 1) {
                    innerParticipant.position = "upper";
                    state.innerParticipants.unshift(innerParticipant);
                  } else {
                    innerParticipant.position = "lower";
                    state.innerParticipants.push(innerParticipant);
                  }
                } else {
                  foundInnerParticipant[
                      kind === "video" ? "videoStream" : "audioStream"
                      ] = stream;
                  foundInnerParticipant.producers[kind === "video" ? "video" : "audio"] =
                      producerId;
                }
            },
            SET_OUTER_PARTICIPANT: (state, {
                participantName,
                participantId,
                stream,
                producerId,
                isVideoMute,
                isAudioMute,
                handRaiseStat,
                inner,
                isInnerForMobiles,
                kind,
                permissions,
                isSubModerator,
                isGuest
            }) => {
                const foundOuterParticipant = state.outerParticipants.find(
                    (participant) => participant?.participantId === participantId
                );
                if (!foundOuterParticipant) {
                  let outerParticipant = {
                    participantName,
                    participantId,
                    permissions,
                    [kind === "video" ? "videoStream" : "audioStream"]: stream,
                    producers: {[kind === "video" ? "video" : "audio"]: producerId},
                    inner,
                    isInnerForMobiles,
                    isAudioMute,
                    isVideoMute,
                    handRaiseStat,
                    isSubModerator,
                    isGuest
                  };
                  outerParticipant.position = "lower";
                  state.outerParticipants.push(outerParticipant);
                } else {
                  foundOuterParticipant[
                      kind === "video" ? "videoStream" : "audioStream"
                      ] = stream;
                  foundOuterParticipant.producers[kind === "video" ? "video" : "audio"] =
                      producerId;
                }
            },
            SET_EXTERNALSERVICES_PARTICIPANTS: (state, extServicesParticipants) => {
                state.extServicesJoinedParticipants = extServicesParticipants;
            },
            SET_NEW_EXTERNALSERVICES_PARTICIPANT: (state, extServicesParticipant) => {
                state.extServicesJoinedParticipants.push(extServicesParticipant);
            },
            PARTICIPANT_LEFT_FROM_EXTERNALSERVICES: (state, extServicesParticipantUserId) => {
                const leftParticipantIdx = state.extServicesJoinedParticipants.findIndex(
                    (participant) => participant.userId === extServicesParticipantUserId
                );
                if (leftParticipantIdx !== -1) {
                  state.extServicesJoinedParticipants.splice(leftParticipantIdx, 1);
                }
            },
            // PARTICIPANT_LEFT: (
            //     state,
            //     {
            //         signal,
            //         leftParticipantId,
            //         substitutedParticipantId,
            //         leftParticipantInner,
            //         leftParticipantIsInnerForMobiles,
            //         substitutedParticipantInner,
            //         substitutedParticipantIsInnerForMobiles
            //     }
            // ) => {
            //     leave_handler(
            //         state.innerParticipants,
            //         state.outerParticipants,
            //         signal,
            //         leftParticipantId,
            //         substitutedParticipantId,
            //         leftParticipantInner,
            //         leftParticipantIsInnerForMobiles,
            //         substitutedParticipantInner,
            //         substitutedParticipantIsInnerForMobiles,
            //         )
            // },
            COMBINE_EXTERNALSERVICES_AND_MEDIASERVER_PARTICIPANTS: state => {
                const combineParticipantsWithoutCompare = [...state.innerParticipants, ...state.outerParticipants].filter(participant => participant.participantId !== 'null-break');
                for(let i = 0 ; i < combineParticipantsWithoutCompare.length ; i++){
                  const foundParticipant =
                      state.extServicesJoinedParticipants.find(
                          participant => {
                            console.log(participant.userId);
                              return participant.participantName === combineParticipantsWithoutCompare[i].participantName &&
                              participant.userId !== +store.getters.userId}
                      );
                  if(foundParticipant){
                    state.combinedExtServicesAndMediaServerParticipants.push(
                        {
                          label : combineParticipantsWithoutCompare[i].participantName,
                          userId : foundParticipant.userId,
                          extServicesId : foundParticipant.extServicesId
                        }
                    )
                  }
                }
                if(!state.combinedExtServicesAndMediaServerParticipants.find(participant => participant.userId === 'all'))
                state.combinedExtServicesAndMediaServerParticipants.unshift({label : store.getters.t('all') , userId : 'all'})
            },
        SWAP_INNER_PARTICIPANTS: (state, originAndTargetIdxs) => {
                if (originAndTargetIdxs?.originIdx >= 0 && originAndTargetIdxs?.targetIdx >= 0) {
                    if (originAndTargetIdxs.originIdx !== originAndTargetIdxs.targetIdx) {
                        state.innerParticipants[originAndTargetIdxs.targetIdx].position = 'lower';
                        state.innerParticipants[originAndTargetIdxs.originIdx].position = 'upper';
                        let temp = state.innerParticipants[originAndTargetIdxs.originIdx];
                        state.innerParticipants[originAndTargetIdxs.originIdx] = state.innerParticipants[originAndTargetIdxs.targetIdx];
                        state.innerParticipants[originAndTargetIdxs.targetIdx] = temp;
                    }
                } else {
                    console.log('an error from inner participants replacer')
                }


        },
        CHANGE_INNER_STAT: (state, info) => {
          switch (info.innerOrOuter){
              case 'inner' :
                  state.innerParticipants[info.idx].inner = info?.newStat;
                  break;
              case 'outer' :
                  state.outerParticipants[info.idx].inner = info?.newStat;
                  break;
              default : return;
          }
        },
        CHANGE_INNER_FOR_MOBILES: (state, info) => {
                switch (info.innerOrOuter){
                    case 'inner':
                        state.innerParticipants[info.idx].isInnerForMobiles = info?.newStat;
                        break;
                    case 'outer':
                        state.outerParticipants[info.idx].isInnerForMobiles = info?.newStat;
                        break;
                    default : return;
                }

        },
        UNSHIFT_PARTICIPANTS : (state, info) => {
          switch (info.innerOrOuter){
              case 'inner':
                  state.innerParticipants.unshift(info?.participant);
                  break;
              case 'outer':
                  state.outerParticipants.unshift(info?.participant);
                  break;
              default: return;
          }
        },
        SPLICE_PARTICIPANTS : (state, info) => {
          switch (info.innerOrOuter){
              case 'inner':
                  state.innerParticipants.splice(info.startingIdx, info.length);
                  break;
              case 'outer':
                  state.outerParticipants.splice(info.startingIdx, info.length);
                  break;
              default: return;
          }
        },
        SUBSTITUTE_OUTER_PARTICIPANT : (state, originAndTargetIdxs) => {
            if(originAndTargetIdxs?.originIdx >= 0 && originAndTargetIdxs?.targetIdx >= 0){
                if(originAndTargetIdxs.targetIdx === 0){
                    state.outerParticipants[originAndTargetIdxs.originIdx].position = 'upper';
                    state.innerParticipants[originAndTargetIdxs.targetIdx].position = 'lower';
                }
                let temp = state.outerParticipants[originAndTargetIdxs.originIdx];
                state.outerParticipants[originAndTargetIdxs.originIdx] = state.innerParticipants[originAndTargetIdxs.targetIdx];
                state.innerParticipants[originAndTargetIdxs.targetIdx] = temp;
            }
        },
        SET_ACTIVE_SPEAKER: (state, activeSpeaker) => {
                state.activeSpeaker = activeSpeaker;
        },
        PIN_PARTICIPANT: (state, pinnedParticipantId) => {
                state.pinnedParticipants.push(pinnedParticipantId);
        },
        UNPIN_PARTICIPANT: (state, unPinnedParticipantId) => {
            const unPinnedParticipantIdx = store.getters.pinnedParticipants.findIndex(
                (pinnedParticipantId) =>
                    pinnedParticipantId === unPinnedParticipantId
            );
                state.pinnedParticipants.splice(unPinnedParticipantIdx, 1);
        }
        // UNPIN_PARTICIPANT: (state, participantId) => {
        //
        // }
    } ,
    actions: {
        setNewStreamsForDeviceChange({ commit }, streams){
            commit('SET_NEW_DEVICE_STREAMS_FOR_DEVICE_CHANGE', streams);
        },
        addToConsumersPool({ commit }, info){
            commit('ADD_TO_CONSUMERS_POOL', info);
        },
        setMyInfo({ commit }, info){
          commit('SET_MY_INFO', info);
        },
        setInnerStreamsForConsumingNewProducers({ commit }, streamsInfo){
            commit('SET_INNER_STREAMS_FOR_CONSUMING_NEW_PRODUCERS', streamsInfo);
        },
        setOuterStreamsForConsumingNewProducers({ commit }, streamsInfo){
            commit('SET_OUTER_STREAMS_FOR_CONSUMING_NEW_PRODUCERS', streamsInfo);
        },
        setInitialInnerParticipantForNewProducers({ commit, state , rootGetters }, innerParticipant){
            commit('SET_INITIAL_INNER_PARTICIPANT_FOR_NEW_PRODUCERS', innerParticipant);
            if (state.innerParticipants.length === 3 && +state.innerParticipants[0].participantId === +rootGetters.userId ) {
                [state.innerParticipants[0] , state.innerParticipants[2]] =[state.innerParticipants[2] , state.innerParticipants[0]]
                state.innerParticipants[0].position = 'upper'
                state.innerParticipants[2].position = 'lower'
            }else if (state.innerParticipants.length === 4 && +rootGetters.activeSpeaker.participantId === +rootGetters.userId) {
                const myIdx = state.innerParticipants.findIndex((el)=>{
                    return +el.participantId === +rootGetters.userId
                })
                if (myIdx !== -1){
                    [state.innerParticipants[0] , state.innerParticipants[myIdx]] =[state.innerParticipants[myIdx] , state.innerParticipants[0]]
                    state.innerParticipants[0].position = 'upper'
                    state.innerParticipants[myIdx].position = 'lower'
                }
            }
        },
        setInitialOuterParticipantForNewProducers({ commit }, outerParticipant){
            commit('SET_INITIAL_OUTER_PARTICIPANT_FOR_NEW_PRODUCERS', outerParticipant);
        },
        setInnerParticipant({ commit, state , rootGetters }, innerParticipant) {
            commit("SET_INNER_PARTICIPANT", innerParticipant);
            if (state.innerParticipants.length === 3 && +state.innerParticipants[0].participantId === +rootGetters.userId ) {
                [state.innerParticipants[0] , state.innerParticipants[2]] =[state.innerParticipants[2] , state.innerParticipants[0]]
                state.innerParticipants[0].position = 'upper'
                state.innerParticipants[2].position = 'lower'
            }
        },
        setOuterParticipant({ commit }, outerParticipant) {
            commit("SET_OUTER_PARTICIPANT", outerParticipant);
        },
        setExtServisesParticipants({ commit , state , rootGetters }, extServicesParticipants) {
            commit('SET_EXTERNALSERVICES_PARTICIPANTS', extServicesParticipants);
            commit('COMBINE_EXTERNALSERVICES_AND_MEDIASERVER_PARTICIPANTS');
            if (state.innerParticipants.length === 3 && +state.innerParticipants[0].participantId === +rootGetters.userId ) {
                [state.innerParticipants[0] , state.innerParticipants[2]] =[state.innerParticipants[2] , state.innerParticipants[0]]
                state.innerParticipants[0].position = 'upper'
                state.innerParticipants[2].position = 'lower'
            }
        },
        setNewExtServicesParticipant({ commit , state , rootGetters }, extServicesParticipant) {
            commit('SET_NEW_EXTERNALSERVICES_PARTICIPANT', extServicesParticipant);
            commit('COMBINE_EXTERNALSERVICES_AND_MEDIASERVER_PARTICIPANTS');
            if (state.innerParticipants.length === 3 && +state.innerParticipants[0].participantId === +rootGetters.userId ) {
                [state.innerParticipants[0] , state.innerParticipants[2]] =[state.innerParticipants[2] , state.innerParticipants[0]]
                state.innerParticipants[0].position = 'upper'
                state.innerParticipants[2].position = 'lower'
            }
        },
        // setExternalServicesParticipantsAfterSomeoneLeave({ commit, state , rootGetters }, extServicesParticipantUserId) {
        //     commit('PARTICIPANT_LEFT_FROM_EXTERNALSERVICES' , extServicesParticipantUserId);
        //     commit('COMBINE_EXTERNALSERVICES_AND_MEDIASERVER_PARTICIPANTS');
        //     if (state.innerParticipants.length === 3 && +state.innerParticipants[0].participantId === +rootGetters.userId ) {
        //         [state.innerParticipants[0] , state.innerParticipants[2]] =[state.innerParticipants[2] , state.innerParticipants[0]]
        //         state.innerParticipants[0].position = 'upper'
        //         state.innerParticipants[2].position = 'lower'
        //     }
        // },
        changeInnerStat({ commit }, info){
          commit('CHANGE_INNER_STAT', info);
        },
        changeInnerForMobiles({ commit }, info){
            commit('CHANGE_INNER_FOR_MOBILES', info);
        },
        spliceParticipants({ commit }, info){
            commit('SPLICE_PARTICIPANTS', info);
        },
        unshiftParticipants({ commit , state , rootGetters }, info){
          commit('UNSHIFT_PARTICIPANTS', info);
            if (state.innerParticipants.length === 3 && +state.innerParticipants[0].participantId === +rootGetters.userId ) {
                [state.innerParticipants[0] , state.innerParticipants[2]] =[state.innerParticipants[2] , state.innerParticipants[0]]
                state.innerParticipants[0].position = 'upper'
                state.innerParticipants[2].position = 'lower'
            }
        },
        swapInnerParticipants({ commit,state ,rootGetters }, originAndTargetIdxs){
            if (state.innerParticipants.length < 4) {
                console.log('turn off active speaker mode')
            }else {
                commit('SWAP_INNER_PARTICIPANTS', originAndTargetIdxs,rootGetters.userId);
            }

        },
        substituteOuterParticipant({ commit }, originAndTargetIdxs){
          commit('SUBSTITUTE_OUTER_PARTICIPANT', originAndTargetIdxs);
        },
        setActiveSpeaker({ commit }, activeSpeaker){
          commit('SET_ACTIVE_SPEAKER', activeSpeaker);
        },
        pinParticipant({ commit }, pinnedParticipantId){
          commit('PIN_PARTICIPANT', pinnedParticipantId);
        },
        unPinParticipant({ commit }, unPinnedParticipantId){
            commit('UNPIN_PARTICIPANT', unPinnedParticipantId);
        },
        participantLeft({ commit , state , rootGetters }, participantLeftInfo){
            commit('PARTICIPANT_LEFT', participantLeftInfo);
            if (state.innerParticipants.length === 3 && +state.innerParticipants[0].participantId === +rootGetters.userId ) {
                [state.innerParticipants[0] , state.innerParticipants[2]] =[state.innerParticipants[2] , state.innerParticipants[0]]
                state.innerParticipants[0].position = 'upper'
                state.innerParticipants[2].position = 'lower'
            }
        }
        // combineExternalServicesAndMediaServerParticipants({ commit }){
        //     commit('COMBINE_EXTERNALSERVICES_AND_MEDIASERVER_PARTICIPANTS')
        // }
    }
}

export default participantInfo;

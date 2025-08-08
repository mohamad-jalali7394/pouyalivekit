

const getters = {
    //i18n text handler
    t : state => state.i18n.textHandler,
    //participants
    // myInfo : state => state.participants.myInfo,
    // combinedExtServicesAndMediaServerParticipants : state => state.participants.combinedExtServicesAndMediaServerParticipants,
    // extServicesJoinedParticipants : state => state.participants.extServicesJoinedParticipants,
    // innerParticipants : state => state.participants.innerParticipants,
    // outerParticipants : state => state.participants.outerParticipants,
    // pinnedParticipants : state => state.participants.pinnedParticipants,
    // activeSpeaker : state => state.participants.activeSpeaker,
    // removedParticipantsAfterSplicingForLeave : state => state.participants.removedParticipantsAfterSplicingForLeave,
    // consumersPool: state => state.participants.consumersPool,
    participants: state => state.participants.participants,
    secondParticipantList : state => state.participants.secondParticipantList,
    substitutionStatus: state => state.participants.substitutionStatus,
    //layout
    upperFrameSize: state => state.layout.upperFrameSize,
    lowerFramesSize: state => state.layout.lowerFramesSize,

    //user Confrence types
    isPrivateGuest: state => state.userTypesInConfrance.isPrivateGuest,
    isPublicGuest: state => state.userTypesInConfrance.isPublicGuest,
    isPrivateUser: state => state.userTypesInConfrance.isPrivateUser,
    isPublicUser: state => state.userTypesInConfrance.isPublicUser,

    //chat
    selected: (state) => state.chat.selected,
    displayedMessages: (state) => state.chat.displayedMessages,
    showChatList: (state) => state.chat.showChatList,
    chatList: (state) => state.chat.chatList,
    displayedChatList: (state) => state.chat.displayedChatList,
    totalUnread: (state) => state.chat.totalUnread,
    isChatOpen: (state) => state.chat.isChatOpen,

    //permissions
    cameraControlAllowed: (state) => state.permissions.cameraControlAllowed,
    cameraStatus: (state) => state.permissions.cameraStatus,
    micStatus: (state) => state.permissions.micStatus,
    micControlAllowed: (state) => state.permissions.micControlAllowed,
    speakerStatus: (state) => state.permissions.speakerStatus,
    speakerControlAllowed: (state) => state.permissions.speakerControlAllowed,

    //userInfo
    token: state => state.userInfo.token,
    userId: state => state.userInfo.userId,
    displayName: state => state.userInfo.displayName,
    firstName: state => state.userInfo.firstName,
    lastName: state => state.userInfo.lastName,
    tenant: state => state.userInfo.tenant,
    connectionId: state => state.userInfo.connectionId,
    authenticated: state => state.userInfo.authenticated,
    customerId: state => state.userInfo.customerId,
    phoneNumber: state => state.userInfo.phoneNumber,
    email: state => state.userInfo.email,
    LDAPID: state => state.userInfo.LDAPID,
    imgSrc: state => state.userInfo.imgSrc,
    userName: state => state.userInfo.userName,
    gender: state => state.userInfo.gender,
    isVideoMuted: state => state.userInfo.isVideoMuted,
    isAudioMuted: state => state.userInfo.isAudioMuted,
    userRoleInMeeting:state => state.userInfo.userRoleInMeeting,


    //session
    sessionToken: state => state.session.sessionToken,
    session_id: state => state.session.session_id,
    session_name: state => state.session.session_name,
    webinar: state => state.session.webinar,
    startTime: state => state.session.startTime,
    endTime: state => state.session.endTime,
    shareToken: state => state.session.shareToken,
    rotationStatus : state => state.session.rotationStatus,
    vrAddress : state => state.session.vrAddress,

    //board
    boardDrawingTools: state => state.board.drawingTools,
    boardsTempCanvasesCtx: state => state.board.boardsTempCanvasesCtx,
    boardsMainCanvases: state => state.board.boardsMainCanvases,
    boardsHistory: state => state.board.boardsHistory,
    boardsNumber: state => state.board.boardsNumber,
    amIHaveBoardPermission: state => state.room.amIHaveBoardPermission,



    //video sharing
    tempVideoTag: state => state.videoSharing.tempVideoTag,
    amIShareAVideo: state => state.videoSharing.amIShareAVideo,
    isSharedVideoPlaying: state => state.videoSharing.isSharedVideoPlaying,

    //pdf sharing
    userpdfSharing: state => state.pdfSharing.userpdfSharing,
    // //room
    // sessionToken: state => state.room.sessionToken,
    // session_id:state => state.room.session_id,




    //room
    isRoomBlock: state => state.room.isBlock,
    screenShareInfo: state => state.room.screenShareInfo,
    hasModerator: state => state.room.hasModerator,
    isModeratorSubstituteActivated: state => state.room.isModeratorSubstituteActivated,
    roomId: state => state.room.roomId,
    amIShareMyScreen: state => state.room.amIShareMyScreen,
    publishCount: state => state.room.publishCount,
    maximumPinSizeExceeds: state => state.room.maximumPinSizeExceeds,
    toSchd: state => state.room.toSchd,
    fromSchd: state => state.room.fromSchd,
    meetingAgenda: state => state.room.meetingAgenda,
    prRoomID: state => state.room.prRoomID,


    //Confrence
    streams: state => state.session.streams,
    session: state => state.session.session,
    OV: state => state.session.OV,
    publisher: state => state.session.publisher,
    subscribedStreams: state => state.session.subscribedStreams,

    //guest
    amIGuest: state => state.guest.amIGuest,
    isRoomExistedOrStarted: state => state.guest.isRoomExistedOrStarted,
    meetingInfo: state => state.guest.meetingInfo,
    meetingType: state => state.guest.meetingType,
    username: state => state.guest.username,
    meetingName: state => state.guest.meetingName,
    ownerName: state => state.guest.ownerName,
    uniqueId: state => state.guest.uniqueId,
    password: state => state.guest.password,
    conferenceId: state => state.guest.conferenceIdG,
    link: state => state.guest.link,

    //userState
    privateRoomId: state => state.userState.privateRoomId,
    privateRoomOwnerUserId: state => state.userState.privateRoomOwnerUserId,
    status: state => state.userState.status,
    conferenceState: state => state.userState.conferenceState,
    isPrivate: state => state.userTypesInConfrance.isPrivate,
    cameraStat: state => state.userState.cameraStat,
    micStat: state => state.userState.micStat,
// participantInfo
    myInfo : state => state.participants.myInfo,

    //participants
    // participants: state => state.participants.participants,

    //roles
    amIModerator: state => state.roles.amIModerator,
    amIModeratorSubstitute: state => state.roles.amIModeratorSubstitute,
    moderatorId: state => state.roles.moderatorId,
    moderatorSubstituteId: state => state.roles.moderatorSubstituteId,
    newModeratorId: state => state.roles.newModeratorId,
    amISelectedModeratorSubstitute: state => state.roles.amISelectedModeratorSubstitute,
    selectedModeratorSubstituteId: state => state.roles.selectedModeratorSubstituteId,
    proceedingsSecretaryId: state => state.roles.proceedingsSecretaryId,
    //invite
    invitedUsers: (state) => state.invite.invitedUsers,
    invitePasswordPrivate: (state) => state.invite.invitePasswordPrivate,

    //privateRoom
    inviteLink: state => state.invite.inviteLink,
    roomIdPublic: state => state.privateRoom.roomIdPublic,

    //devices
    cameraVideoStream: state => state.devices.camVideoStream,
    microphoneAudioStream: state => state.devices.micAudioStream,
    cameraId: state => state.devices.cameraId,
    selectedCamera: state => state.devices.selectedCamera,
    selectedMic: state => state.devices.selectedMic,
    microphoneId: state => state.devices.microphoneId,
    speaker: state => state.devices.speaker,
    cameraAspectRatio: state => state.devices.cameraAspectRatio,
    //loadBalancing
    vrURL: state => state.loadBalancing.vrURL,


    //layoutType
    layoutType: state => state.layoutType.layoutType,

    //meetingInfos
    agendaParagraphs: state => state.meetingInfos.agendaParagraphs,
    purposeOfMeeting: state => state.meetingInfos.purposeOfMeeting,
    meetingStartTime: state => state.meetingInfos.meetingStartTime,
    meetingEndTime: state => state.meetingInfos.meetingEndTime,
    agendaHasTime: state => state.meetingInfos.agendaHasTime,

    //recording
    egressId : state => state.recording.egressId
}
export default getters

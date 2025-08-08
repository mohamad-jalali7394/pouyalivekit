/**
 * Tile View Layout Calculator
 * 
 * This function calculates responsive layout parameters for video conferencing tiles.
 * It determines optimal CSS classes and sizing based on screen dimensions and participant count.
 * 
 * @param {boolean} isShared - Whether screen sharing is active
 * @param {number} screenHeight - Height of the viewport
 * @param {number} width - Width of the viewport
 * @param {boolean} sideBarIsVisible - Whether sidebar is open
 * @param {number} videoSubscribersLength - Number of active video participants
 * @returns {Object} Layout configuration object
 */
export function tileView(isShared, screenHeight, width, sideBarIsVisible, videoSubscribersLength) {
    // Initialize return values
    const layoutConfig = {
        pinClassMode: '',
        classMode: '',
        firstCameraRatio: '',
        cameraRatio: '',
        isSharedWithSidebar: false,
        layoutWith: "100%"
    };

    // Adjust screen width if sidebar is visible
    const SIDEBAR_WIDTH = 350;
    const MEETING_CONTROLS_HEIGHT = 60;
    let screenWidth = sideBarIsVisible ? width - SIDEBAR_WIDTH : width;

    // Handle screen sharing mode
    if (isShared) {
        layoutConfig.classMode = "tile-view__with--share";
        return layoutConfig;
    }

    // Calculate layout based on number of participants
    switch (videoSubscribersLength) {
        case 1:
            layoutConfig.classMode = "first__video--stream";
            layoutConfig.cameraRatio = calculateSingleParticipantSize(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT);
            break;
            
        case 2:
            if (screenHeight >= 1.4 * screenWidth){
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.48);
            }else {
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.75);
            }

            layoutConfig.classMode = getLayoutClassFor2Participants(screenHeight, screenWidth);
            break;
            
        case 3:
            if (screenHeight >= 1.4 * screenWidth){
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.32);
            }else {
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.49);
            }

            layoutConfig.classMode = getLayoutClassFor3Participants(screenHeight, screenWidth);
            break;

        case 4:
            if (screenHeight >= 1.4 * screenWidth){
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.48);
            }else {
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.49);
            }
            layoutConfig.classMode = getLayoutClassFor4Participants(screenHeight, screenWidth);
            break;

        case 5:
        case 6:
            if (screenHeight > screenWidth){
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.33);

            }else {
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.49);
            }
            layoutConfig.classMode = getLayoutClassFor5To6Participants(screenHeight, screenWidth);
            break;
            
        case 7:
        case 8:
            if (screenHeight > screenWidth){
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.245);

            }else {
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.49);
            }
            layoutConfig.classMode = getLayoutClassFor7To8Participants(screenHeight, screenWidth);
            break;
            
        case 9:
            if (screenHeight > screenWidth){
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.245);
            }else {
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.328);
            }
            layoutConfig.classMode = getLayoutClassFor9Participants(screenHeight, screenWidth);
            break;
            
        case 10:
        case 11:
        case 12:
            if (screenHeight > screenWidth){
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.245);
            }else {
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.328);
            }
            layoutConfig.classMode = getLayoutClassFor10To12Participants(screenHeight, screenWidth);
            break;
            
        case 13:
        case 14:
        case 15:
            if (screenHeight > screenWidth){
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.245);
            }else {
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.328);
            }
            layoutConfig.classMode = getLayoutClassFor13To15Participants(screenHeight, screenWidth);
            break;
            
        case 16:
        case 17:
            if (screenHeight > screenWidth){
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.245);
            }else {
                layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.35);
            }
            layoutConfig.classMode = getLayoutClassFor16To17Participants(screenHeight, screenWidth);
            break;
            
        default:
            // Handle 18+ participants with default layout
            layoutConfig.cameraRatio = calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, 0.3);
            layoutConfig.classMode = "tile-view__with--default";
    }

    return layoutConfig;
}

/**
 * Calculate camera ratio based on screen dimensions
 * @param {number} screenHeight - Screen height
 * @param {number} screenWidth - Screen width
 * @param {number} MEETING_CONTROLS_HEIGHT - MEETING_CONTROLS_HEIGHT value
 * @param {number} ratio - Base ratio multiplier
 * @returns {string} Camera ratio in pixels
 */
function calculateCameraRatio(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT, ratio) {
    console.error('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    console.error(ratio)
    console.error(screenHeight, MEETING_CONTROLS_HEIGHT)
    console.error(`${ratio * (screenHeight - MEETING_CONTROLS_HEIGHT)}px`)
    return `${ratio * (screenHeight - MEETING_CONTROLS_HEIGHT)}px`;
}

/**
 * Calculate size for single participant layout
 * @param {number} screenHeight - Screen height
 * @param {number} screenWidth - Screen width
 * @param {number} MEETING_CONTROLS_HEIGHT - MEETING_CONTROLS_HEIGHT value
 * @returns {string} Camera size in pixels
 */
function calculateSingleParticipantSize(screenHeight, screenWidth, MEETING_CONTROLS_HEIGHT) {
    if (screenHeight * 1.6 < screenWidth) {
        return `${screenHeight - MEETING_CONTROLS_HEIGHT}px`;
    } else if (screenHeight * 1.3 < screenWidth) {
        return `${0.85 * (screenHeight - MEETING_CONTROLS_HEIGHT)}px`;
    } else if (screenHeight < screenWidth) {
        return `${0.7 * (screenHeight - MEETING_CONTROLS_HEIGHT)}px`;
    } else {
        return `${0.5 * (screenHeight - MEETING_CONTROLS_HEIGHT)}px`;
    }
}

/**
 * Get layout class for 2 participants
 * @param {number} screenHeight - Screen height
 * @param {number} screenWidth - Screen width
 * @returns {string} CSS class name
 */
function getLayoutClassFor2Participants(screenHeight, screenWidth) {
    if (screenHeight >= screenWidth * 1.4) {
        return "tile-view__mobile-1-2-3__video-streams";
    } else if (screenHeight >= screenWidth) {
        return "tile-view__tablet-1-2-3__video-streams";
    } else {
        return "tile-view__with--2__video-streams";
    }
}

/**
 * Get layout class for 3 participants
 * @param {number} screenHeight - Screen height
 * @param {number} screenWidth - Screen width
 * @returns {string} CSS class name
 */
function getLayoutClassFor3Participants(screenHeight, screenWidth) {
    if (screenHeight >= screenWidth * 1.4) {
        return "tile-view__mobile-1-2-3__video-streams";
    } else if (screenHeight >= screenWidth) {
        return "tile-view__tablet-1-2-3__video-streams";
    } else {
        return "tile-view__with--3-4__video-streams";
    }
}


/**
 * Get layout class for 3 participants
 * @param {number} screenHeight - Screen height
 * @param {number} screenWidth - Screen width
 * @returns {string} CSS class name
 */
function getLayoutClassFor4Participants(screenHeight, screenWidth) {
    if (screenHeight >= screenWidth * 1.4) {
        return "tile-view__mobile-1-2-3-4__video-streams";
    } else if (screenHeight >= screenWidth) {
        return "tile-view__tablet-1-2-3-4__video-streams";
    } else {
        return "tile-view__with--3-4__video-streams";
    }
}

/**
 * Get layout class for 4 participants
 * @param {number} screenHeight - Screen height
 * @param {number} screenWidth - Screen width
 * @returns {string} CSS class name
 */
// function getLayoutClassFor4Participants(screenHeight, screenWidth) {
//     return screenHeight >= screenWidth
//         ? "tile-view__with--3-4__video-streams--mobile"
//         : "tile-view__with--3-4__video-streams";
// }

/**
 * Get layout class for 5-6 participants
 * @param {number} screenHeight - Screen height
 * @param {number} screenWidth - Screen width
 * @returns {string} CSS class name
 */
function getLayoutClassFor5To6Participants(screenHeight, screenWidth) {
    return screenHeight >= screenWidth
        ? "tile-view__with--2__video-streams"
        : "tile-view__with--5-6__video-streams";
}

/**
 * Get layout class for 7-8 participants
 * @param {number} screenHeight - Screen height
 * @param {number} screenWidth - Screen width
 * @returns {string} CSS class name
 */
function getLayoutClassFor7To8Participants(screenHeight, screenWidth) {
    if (screenHeight >= screenWidth * 1.4) {
        return "tile-view__with--2__video-streams";
    } else if (screenHeight >= screenWidth) {
        return "tile-view__with--5-6__video-streams";
    } else {
        return "tile-view__with--7-8__video-streams";
    }
}

/**
 * Get layout class for 9 participants
 * @param {number} screenHeight - Screen height
 * @param {number} screenWidth - Screen width
 * @returns {string} CSS class name
 */
function getLayoutClassFor9Participants(screenHeight, screenWidth) {
    if (screenHeight >= screenWidth * 1.4) {
        return "tile-view__with--2__video-streams";
    } else if (screenHeight >= screenWidth || screenHeight * 1.076 > screenWidth || screenHeight * 1.5 > screenWidth) {
        return "tile-view__with--5-6__video-streams";
    } else {
        return "tile-view__with--9__video-streams";
    }
}

/**
 * Get layout class for 10-12 participants
 * @param {number} screenHeight - Screen height
 * @param {number} screenWidth - Screen width
 * @returns {string} CSS class name
 */
function getLayoutClassFor10To12Participants(screenHeight, screenWidth) {
    if (screenHeight >= screenWidth * 1.72) {
        return "tile-view__with--2__video-streams";
    } else if (screenHeight >= screenWidth * 1.4 || screenHeight >= screenWidth) {
        return "tile-view__with--5-6__video-streams";
    } else if (screenHeight * 1.076 > screenWidth || screenHeight * 1.5 > screenWidth) {
        return "tile-view__with--7-8__video-streams";
    } else {
        return "tile-view__with--10-11-12__video-streams";
    }
}

/**
 * Get layout class for 13-15 participants
 * @param {number} screenHeight - Screen height
 * @param {number} screenWidth - Screen width
 * @returns {string} CSS class name
 */
function getLayoutClassFor13To15Participants(screenHeight, screenWidth) {
    if (screenHeight >= screenWidth * 1.72) {
        return "tile-view__with--2__video-streams";
    } else if (screenHeight >= screenWidth * 1.4 || screenHeight >= screenWidth) {
        return "tile-view__with--5-6__video-streams";
    } else if (screenHeight * 1.076 > screenWidth) {
        return "tile-view__with--7-8__video-streams";
    } else {
        return "tile-view__with--13-14-15__video-streams";
    }
}

/**
 * Get layout class for 16-17 participants
 * @param {number} screenHeight - Screen height
 * @param {number} screenWidth - Screen width
 * @returns {string} CSS class name
 */
function getLayoutClassFor16To17Participants(screenHeight, screenWidth) {
    if (screenHeight >= screenWidth * 1.72) {
        return "tile-view__with--2__video-streams";
    } else if (screenHeight >= screenWidth * 1.4 || screenHeight >= screenWidth) {
        return "tile-view__with--5-6__video-streams";
    } else if (screenHeight * 1.076 > screenWidth || screenHeight * 1.5 > screenWidth) {
        return "tile-view__with--7-8__video-streams";
    } else if (screenHeight * 2.5 <= screenWidth) {
        return "tile-view__with--16__video-streams-wide";
    } else {
        return "tile-view__with--16__video-streams";
    }
}

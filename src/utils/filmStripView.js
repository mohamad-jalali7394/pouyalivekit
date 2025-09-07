export function filmStripView(isShared,screenHeight, screenWidth, sideBarIsVisible, videoSubscribersLength) {
    let pinClassMode = ''
    let classMode = ''
    let firstCameraRatio = ''
    let cameraRatio = ''
    let isSharedWithSidebar = false
    let layoutWith = '0'
    if (isShared === true) {
        pinClassMode = "pinned__video--stream__with--share";
        classMode = "video--stream__with--share";
        layoutWith = "100%";
        if (sideBarIsVisible) {
            if (screenHeight * 2.2 <= screenWidth) {
                firstCameraRatio = 0.36 * (screenHeight - 60) + "px";
                cameraRatio = 0.19 * (screenHeight - 60) + "px";
            } else if (screenHeight * 2 <= screenWidth) {
                firstCameraRatio = 0.34 * (screenHeight - 60) + "px";
                cameraRatio = 0.17 * (screenHeight - 60) + "px";
            } else if (screenHeight * 1.8 <= screenWidth) {
                firstCameraRatio = 0.28 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else if (screenHeight * 1.6 <= screenWidth) {
                firstCameraRatio = 0.25 * (screenHeight - 60) + "px";
                cameraRatio = 0.13 * (screenHeight - 60) + "px";
            } else if (screenHeight * 1.4 <= screenWidth) {
                firstCameraRatio = 0.17 * (screenHeight - 60) + "px";
                cameraRatio = 0.17 * (screenHeight - 60) + "px";

                classMode = "pinned__video--stream__with--share";
            } else if (screenHeight * 1.2 <= screenWidth) {
                isSharedWithSidebar = true;
                pinClassMode = "video--stream__with--share";
                classMode = "video--stream__with--share";
                firstCameraRatio = 0.25 * screenHeight + "px";
                cameraRatio = 0.25 * screenHeight + "px";
            } else if (screenHeight < screenWidth) {
                isSharedWithSidebar = true;
                pinClassMode = "video--stream__with--share";
                classMode = "video--stream__with--share";
                firstCameraRatio = 0.2 * screenHeight + "px";
                cameraRatio = 0.2 * screenHeight + "px";
            } else if (screenHeight > screenWidth) {
                isSharedWithSidebar = false;
                pinClassMode = "video--stream__with--share";

                firstCameraRatio = 0.25 * (screenHeight - 60) + "px";
                cameraRatio = 0.25 * (screenHeight - 60) + "px";
            }
        } else {
            if (screenWidth > 1024) {
                if (screenHeight * 2.2 <= screenWidth) {
                    firstCameraRatio = 0.5 * (screenHeight - 60) + "px";
                    cameraRatio = 0.3 * (screenHeight - 60) + "px";
                } else if (screenHeight * 2 <= screenWidth) {
                    firstCameraRatio = 0.46 * (screenHeight - 60) + "px";
                    cameraRatio = 0.26 * (screenHeight - 60) + "px";
                } else if (screenHeight * 1.8 <= screenWidth) {
                    firstCameraRatio = 0.36 * (screenHeight - 60) + "px";
                    cameraRatio = 0.19 * (screenHeight - 60) + "px";
                } else if (screenHeight * 1.6 <= screenWidth) {
                    firstCameraRatio = 0.33 * (screenHeight - 60) + "px";
                    cameraRatio = 0.16 * (screenHeight - 60) + "px";
                } else if (screenHeight * 1.4 <= screenWidth) {
                    firstCameraRatio = 0.26 * (screenHeight - 60) + "px";
                    cameraRatio = 0.13 * (screenHeight - 60) + "px";
                } else if (screenHeight * 1.2 <= screenWidth) {
                    firstCameraRatio = 0.2 * (screenHeight - 60) + "px";
                    cameraRatio = 0.1 * (screenHeight - 60) + "px";
                } else if (screenHeight < screenWidth) {
                    classMode = "pinned__video--stream__with--share";
                    firstCameraRatio = 0.16 * (screenHeight - 60) + "px";
                    cameraRatio = 0.16 * (screenHeight - 60) + "px";
                } else if (screenHeight > screenWidth * 1.8) {
                    pinClassMode = "video--stream__with--share";

                    firstCameraRatio = 0.15 * (screenHeight - 60) + "px";
                    cameraRatio = 0.15 * (screenHeight - 60) + "px";
                } else if (screenHeight > screenWidth * 1.5) {
                    pinClassMode = "video--stream__with--share";

                    firstCameraRatio = 0.17 * (screenHeight - 60) + "px";
                    cameraRatio = 0.17 * (screenHeight - 60) + "px";
                } else if (screenHeight > screenWidth) {
                    pinClassMode = "video--stream__with--share";

                    firstCameraRatio = 0.2 * (screenHeight - 60) + "px";
                    cameraRatio = 0.2 * (screenHeight - 60) + "px";
                }
            } else if (screenWidth <= 1024 && screenWidth > 767) {
                pinClassMode = "video--stream__with--share__mobile";
                classMode = "video--stream__with--share__mobile";
                if (
                    screenHeight > screenWidth &&
                    screenHeight < screenWidth * 1.5
                ) {
                    firstCameraRatio = 0.18 * (screenHeight - 60) + "px";
                    cameraRatio = 0.18 * (screenHeight - 60) + "px";
                } else if (
                    screenHeight > screenWidth * 1.5 &&
                    screenHeight < screenWidth * 1.8
                ) {
                    firstCameraRatio = 0.15 * (screenHeight - 60) + "px";
                    cameraRatio = 0.15 * (screenHeight - 60) + "px";
                } else if (screenHeight > screenWidth * 1.8) {
                    firstCameraRatio = 0.12 * (screenHeight - 60) + "px";
                    cameraRatio = 0.12 * (screenHeight - 60) + "px";
                } else {
                    firstCameraRatio = 0.2 * (screenHeight - 60) + "px";
                    cameraRatio = 0.2 * (screenHeight - 60) + "px";
                }
            } else if (screenWidth <= 767) {
                pinClassMode = "video--stream__with--share";
                classMode = "video--stream__with--share";
                if (
                    screenHeight > screenWidth &&
                    screenHeight < screenWidth * 1.5
                ) {
                    firstCameraRatio = 0.2 * (screenHeight - 60) + "px";
                    cameraRatio = 0.2 * (screenHeight - 60) + "px";
                } else if (
                    screenHeight > screenWidth * 1.5 &&
                    screenHeight < screenWidth * 1.8
                ) {
                    firstCameraRatio = 0.17 * (screenHeight - 60) + "px";
                    cameraRatio = 0.17 * (screenHeight - 60) + "px";
                } else if (screenHeight > screenWidth * 1.8) {
                    firstCameraRatio = 0.15 * (screenHeight - 60) + "px";
                    cameraRatio = 0.15 * (screenHeight - 60) + "px";
                } else {
                    firstCameraRatio = 0.22 * (screenHeight - 60) + "px";
                    cameraRatio = 0.22 * (screenHeight - 60) + "px";
                }
            }
        }
    } else if (videoSubscribersLength === 1) {
        firstCameraRatio = (screenHeight - 100) + "px";
        pinClassMode = "first__video--stream";
        if (screenHeight * 1.6 < screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = screenHeight - 100 + "px";
        } else if (screenHeight * 1.3 < screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = 0.85 * (screenHeight - 60) + "px";
        } else if (screenHeight < screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = 0.7 * (screenHeight - 60) + "px";
        } else {
            layoutWith = "100%";
            firstCameraRatio = 0.5 * (screenHeight - 60) + "px";
        }
    } else if (videoSubscribersLength === 2) {
        pinClassMode = "first__video--stream";
        if (screenHeight * 2 < screenWidth) {
            layoutWith = "80%";
            firstCameraRatio = screenHeight - 120 + "px";
            if (sideBarIsVisible) {
                cameraRatio = 0.15 * (screenWidth - 60) + "px";
            } else {
                cameraRatio = 0.18 * (screenWidth) + "px";
            }
        } else if (screenHeight * 1.6 < screenWidth) {
            layoutWith = "90%";
            firstCameraRatio = screenHeight - 130 + "px";
        } else if (screenHeight * 1.3 < screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = 0.85 * (screenHeight - 100) + "px";
        } else if (screenHeight < screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = 0.7 * (screenHeight - 60) + "px";
        } else {
            layoutWith = "100%";
            firstCameraRatio = 0.5 * (screenHeight - 60) + "px";
        }
        if (sideBarIsVisible) {
            cameraRatio = 0.15 * (screenWidth - 250) + "px";
        } else {
            cameraRatio = 0.15 * (screenWidth) + "px";
        }
        pinClassMode = "pinned__video--stream-private";
        classMode = "video__streams__2--columns-private";

    } else if (videoSubscribersLength <= 5 && videoSubscribersLength > 1) {
        if (screenHeight > screenWidth * 2) {
            layoutWith = "100%";
            firstCameraRatio = 0.3 * (screenHeight - 60) + "px";
            cameraRatio = 0.155 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.75) {
            layoutWith = "100%";
            firstCameraRatio = 0.32 * (screenHeight - 60) + "px";
            cameraRatio = 0.15 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.5) {
            layoutWith = "100%";
            firstCameraRatio = 0.4 * (screenHeight - 60) + "px";
            cameraRatio = 0.18 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.25) {
            layoutWith = "100%";
            firstCameraRatio = 0.4 * (screenHeight - 60) + "px";
            cameraRatio = 0.21 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = 0.55 * (screenHeight - 60) + "px";
            cameraRatio = 0.3 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight * 2 <= screenWidth) {
            layoutWith = screenHeight * 2 + "px";
            firstCameraRatio = 0.7 * (screenHeight - 60) + "px";
            cameraRatio = 0.28 * (screenHeight - 60) + "px";
            classMode = "video--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.8 <= screenWidth) {
            layoutWith =
                screenHeight * 1.8 + "px";
            firstCameraRatio = 0.7 * (screenHeight - 60) + "px";
            cameraRatio = 0.27 * (screenHeight - 60) + "px";
            classMode = "video--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.6 <= screenWidth) {
            layoutWith =
                screenHeight * 1.6 + "px";
            firstCameraRatio = 0.72 * (screenHeight - 60) + "px";
            cameraRatio = 0.26 * (screenHeight - 60) + "px";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
            classMode = "video--streams";
        } else if (screenHeight * 1.4 <= screenWidth) {
            layoutWith =
                screenHeight * 1.4 + "px";
            firstCameraRatio = 0.73 * (screenHeight - 60) + "px";
            cameraRatio = 0.23 * (screenHeight - 60) + "px";
            classMode = "video--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams--middle";
            }
        } else if (screenHeight * 1.2 <= screenWidth) {
            layoutWith =
                screenHeight * 1.2 + "px";
            classMode = "video--streams";
            pinClassMode = "pinned__video--stream";
            if (sideBarIsVisible) {
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.16 * (screenHeight - 60) + "px";
            } else {
                firstCameraRatio = 0.73 * (screenHeight - 60) + "px";
                cameraRatio = 0.23 * (screenHeight - 60) + "px";
            }
        } else if (screenHeight < screenWidth) {
            layoutWith = screenWidth;
            classMode = "video--streams";
            pinClassMode = "pinned__video--stream";
            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--stream";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.18 * (screenHeight - 60) + "px";
            }
        }
    } else if (videoSubscribersLength === 6) {
        if (screenHeight > screenWidth * 2) {
            layoutWith = "100%";
            firstCameraRatio = 0.3 * (screenHeight - 60) + "px";
            cameraRatio = 0.155 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.75) {
            layoutWith = "100%";
            firstCameraRatio = 0.32 * (screenHeight - 60) + "px";
            cameraRatio = 0.15 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.5) {
            layoutWith = "100%";
            firstCameraRatio = 0.4 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.25) {
            layoutWith = "100%";
            firstCameraRatio = 0.4 * (screenHeight - 60) + "px";
            cameraRatio = 0.21 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = 0.55 * (screenHeight - 60) + "px";
            cameraRatio = 0.3 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight * 2 <= screenWidth) {
            layoutWith = screenHeight * 2 + "px";
            firstCameraRatio = 0.75 * (screenHeight - 60) + "px";
            cameraRatio = 0.2 * (screenHeight - 60) + "px";
            classMode = "video__with__6--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.8 <= screenWidth) {
            layoutWith =
                screenHeight * 1.8 + "px";
            firstCameraRatio = 0.73 * (screenHeight - 60) + "px";
            cameraRatio = 0.21 * (screenHeight - 60) + "px";
            classMode = "video__with__6--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.6 <= screenWidth) {
            layoutWith =
                screenHeight * 1.6 + "px";
            firstCameraRatio = 0.73 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video__with__6--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.4 <= screenWidth) {
            layoutWith =
                screenHeight * 1.4 + "px";

            firstCameraRatio = 0.7 * (screenHeight - 60) + "px";
            cameraRatio = 0.16 * (screenHeight - 60) + "px";
            classMode = "video__with__6--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams--middle";
            }
        } else if (screenHeight * 1.2 <= screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = 0.55 * (screenHeight - 60) + "px";
            cameraRatio = 0.17 * (screenHeight - 60) + "px";
            classMode = "video__with__6--streams";
            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                pinClassMode = "pinned__video--streams--middle";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.18 * (screenHeight - 60) + "px";
            }
        } else if (screenHeight < screenWidth) {
            layoutWith = screenWidth;
            firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
            cameraRatio = 0.15 * (screenHeight - 60) + "px";

            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                classMode = "video__with__6--streams";
                pinClassMode = "pinned__video--stream";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.18 * (screenHeight - 60) + "px";
            }
        }
    } else if (videoSubscribersLength === 7 || videoSubscribersLength === 8) {
        if (screenHeight > screenWidth * 2) {
            layoutWith = "100%";
            firstCameraRatio = 0.3 * (screenHeight - 60) + "px";
            cameraRatio = 0.155 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.75) {
            layoutWith = "100%";
            firstCameraRatio = 0.32 * (screenHeight - 60) + "px";
            cameraRatio = 0.15 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.5) {
            layoutWith = "100%";
            firstCameraRatio = 0.4 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.25) {
            layoutWith = "100%";
            firstCameraRatio = 0.4 * (screenHeight - 60) + "px";
            cameraRatio = 0.23 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = 0.55 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video__streams__3--columns";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight * 2 <= screenWidth) {
            layoutWith = screenHeight * 2 + "px";
            firstCameraRatio = 0.74 * (screenHeight - 60) + "px";
            cameraRatio = 0.2 * (screenHeight - 60) + "px";
            classMode = "video__with__8--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.8 <= screenWidth) {
            layoutWith =
                screenHeight * 1.8 + "px";
            firstCameraRatio = 0.73 * (screenHeight - 60) + "px";
            cameraRatio = 0.17 * (screenHeight - 60) + "px";
            classMode = "video__with__8--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.6 <= screenWidth) {
            layoutWith =
                screenHeight * 1.6 + "px";
            firstCameraRatio = 0.73 * (screenHeight - 60) + "px";
            cameraRatio = 0.18 * (screenHeight - 60) + "px";
            classMode = "video__with__8--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.4 <= screenWidth) {
            layoutWith =
                screenHeight * 1.4 + "px";
            firstCameraRatio = 0.7 * (screenHeight - 60) + "px";
            cameraRatio = 0.17 * (screenHeight - 60) + "px";
            classMode = "video__with__8--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.3 <= screenWidth) {
            layoutWith =
                screenHeight * 1.4 + "px";
            firstCameraRatio = 0.7 * (screenHeight - 60) + "px";
            cameraRatio = 0.16 * (screenHeight - 60) + "px";
            classMode = "video__with__8--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.2 <= screenWidth) {
            layoutWith = "100%";
            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                classMode = "video__with__8--streams";
                pinClassMode = "pinned__video--streams";
                firstCameraRatio = 0.55 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            }
        } else if (screenHeight < screenWidth) {
            layoutWith = screenWidth;
            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                classMode = "video__with__8--streams";
                pinClassMode = "pinned__video--stream";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.13 * (screenHeight - 60) + "px";
            }
        }
    } else if (videoSubscribersLength === 9) {
        if (screenHeight > screenWidth * 2) {
            layoutWith = "100%";
            firstCameraRatio = 0.3 * (screenHeight - 60) + "px";
            cameraRatio = 0.155 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.75) {
            layoutWith = "100%";
            firstCameraRatio = 0.32 * (screenHeight - 60) + "px";
            cameraRatio = 0.15 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.5) {
            layoutWith = "100%";
            firstCameraRatio = 0.4 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.25) {
            layoutWith = "100%";
            firstCameraRatio = 0.4 * (screenHeight - 60) + "px";
            cameraRatio = 0.23 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = 0.55 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video__streams__3--columns";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight * 2 <= screenWidth) {
            layoutWith = screenHeight * 2 + "px";
            firstCameraRatio = 0.77 * (screenHeight - 60) + "px";
            cameraRatio = 0.2 * (screenHeight - 60) + "px";
            classMode = "video__with__9--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.8 <= screenWidth) {
            layoutWith =
                screenHeight * 1.8 + "px";
            firstCameraRatio = 0.75 * (screenHeight - 60) + "px";
            cameraRatio = 0.17 * (screenHeight - 60) + "px";
            classMode = "video__with__9--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.6 <= screenWidth) {
            layoutWith =
                screenHeight * 1.6 + "px";
            firstCameraRatio = 0.73 * (screenHeight - 60) + "px";

            classMode = "video__with__9--streams";
            if (sideBarIsVisible) {
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                cameraRatio = 0.18 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.4 <= screenWidth) {
            layoutWith =
                screenHeight * 1.4 + "px";
            firstCameraRatio = 0.7 * (screenHeight - 60) + "px";
            classMode = "video__with__9--streams";
            if (sideBarIsVisible) {
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
            } else {
                cameraRatio = 0.17 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.3 <= screenWidth) {
            layoutWith =
                screenHeight * 1.4 + "px";
            firstCameraRatio = 0.7 * (screenHeight - 60) + "px";
            classMode = "video__with__9--streams";
            if (sideBarIsVisible) {
                cameraRatio = 0.14 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
            } else {
                cameraRatio = 0.16 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.2 <= screenWidth) {
            layoutWith = "100%";
            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                classMode = "video__with__9--streams";
                pinClassMode = "pinned__video--streams";
                firstCameraRatio = 0.55 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            }
        } else if (screenHeight < screenWidth) {
            layoutWith = screenWidth;
            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                classMode = "video__with__9--streams";
                pinClassMode = "pinned__video--stream";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.13 * (screenHeight - 60) + "px";
            }
        }
    } else if (videoSubscribersLength === 10) {
        if (screenHeight > screenWidth * 2) {
            layoutWith = "100%";
            firstCameraRatio = 0.3 * (screenHeight - 60) + "px";
            cameraRatio = 0.155 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.75) {
            layoutWith = "100%";
            firstCameraRatio = 0.32 * (screenHeight - 60) + "px";
            cameraRatio = 0.15 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.5) {
            layoutWith = "100%";
            firstCameraRatio = 0.4 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth * 1.25) {
            layoutWith = "100%";
            firstCameraRatio = 0.4 * (screenHeight - 60) + "px";
            cameraRatio = 0.23 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight > screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = 0.55 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video__streams__3--columns";
            pinClassMode = "pinned__video--stream";
        } else if (screenHeight * 2 <= screenWidth) {
            layoutWith = screenHeight * 2 + "px";
            firstCameraRatio = 0.77 * (screenHeight - 60) + "px";

            classMode = "video__with__10--streams";
            if (sideBarIsVisible) {
                cameraRatio = 0.17 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                cameraRatio = 0.2 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.8 <= screenWidth) {
            layoutWith =
                screenHeight * 1.8 + "px";
            firstCameraRatio = 0.75 * (screenHeight - 60) + "px";

            classMode = "video__with__10--streams";
            if (sideBarIsVisible) {
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                cameraRatio = 0.17 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.6 <= screenWidth) {
            layoutWith =
                screenHeight * 1.6 + "px";
            firstCameraRatio = 0.73 * (screenHeight - 60) + "px";

            classMode = "video__with__10--streams";
            if (sideBarIsVisible) {
                cameraRatio = 0.14 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams__with--sidebar";
            } else {
                cameraRatio = 0.17 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.4 <= screenWidth) {
            layoutWith =
                screenHeight * 1.4 + "px";
            firstCameraRatio = 0.7 * (screenHeight - 60) + "px";

            classMode = "video__with__10--streams";
            if (sideBarIsVisible) {
                cameraRatio = 0.14 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
            } else {
                cameraRatio = 0.17 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.3 <= screenWidth) {
            layoutWith =
                screenHeight * 1.4 + "px";
            firstCameraRatio = 0.7 * (screenHeight - 60) + "px";

            classMode = "video__with__10--streams";
            if (sideBarIsVisible) {
                cameraRatio = 0.14 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
            } else {
                cameraRatio = 0.16 * (screenHeight - 60) + "px";
                pinClassMode = "pinned__video--streams";
            }
        } else if (screenHeight * 1.2 <= screenWidth) {
            layoutWith = "100%";
            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                classMode = "video__with__10--streams";
                pinClassMode = "pinned__video--streams";
                firstCameraRatio = 0.55 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            }
        } else if (screenHeight < screenWidth) {
            layoutWith = screenWidth;
            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--streams--middle__with--sidebar";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                classMode = "video__with__10--streams";
                pinClassMode = "pinned__video--stream";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.13 * (screenHeight - 60) + "px";
            }
        }
    } else if (videoSubscribersLength > 10 && videoSubscribersLength < 16) {
        if (screenHeight > screenWidth * 2) {
            layoutWith = "100%";
            firstCameraRatio = 0.3 * (screenHeight - 60) + "px";
            cameraRatio = 0.155 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--streams";
        } else if (screenHeight > screenWidth * 1.75) {
            layoutWith = "100%";
            firstCameraRatio = 0.32 * (screenHeight - 60) + "px";
            cameraRatio = 0.15 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--streams";
        } else if (screenHeight > screenWidth * 1.5) {
            layoutWith = "100%";
            firstCameraRatio = 0.3 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--streams--full";
        } else if (screenHeight > screenWidth * 1.25) {
            layoutWith = "100%";
            firstCameraRatio = 0.4 * (screenHeight - 60) + "px";
            cameraRatio = 0.23 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--streams--full";
        } else if (screenHeight > screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = 0.55 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video__streams__3--columns";
            pinClassMode = "pinned__video--streams--full";
        } else if (screenHeight * 2 <= screenWidth) {
            layoutWith = screenHeight * 2 + "px";
            firstCameraRatio = 0.59 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video__with__8--streams";
            if (!sideBarIsVisible) {
                pinClassMode = "pinned__video--streams--grater--8";
            } else {
                pinClassMode = "pinned__video--streams--grater--8-with-sidebar";
            }
        } else if (screenHeight * 1.8 <= screenWidth) {
            layoutWith =
                screenHeight * 1.8 + "px";
            firstCameraRatio = 0.59 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video__with__8--streams";
            if (!sideBarIsVisible) {
                pinClassMode = "pinned__video--streams--grater--8";
            } else {
                pinClassMode = "pinned__video--streams--grater--8-with-sidebar";
            }
        } else if (screenHeight * 1.6 <= screenWidth) {
            layoutWith =
                screenHeight * 1.6 + "px";
            firstCameraRatio = 0.62 * (screenHeight - 60) + "px";
            cameraRatio = 0.17 * (screenHeight - 60) + "px";
            classMode = "video__with__8--streams";
            if (!sideBarIsVisible) {
                pinClassMode = "pinned__video--streams--grater--8";
            } else {
                pinClassMode = "pinned__video--streams--grater--8-with-sidebar";
            }
        } else if (screenHeight * 1.4 <= screenWidth) {
            layoutWith =
                screenHeight * 1.4 + "px";
            firstCameraRatio = 0.55 * (screenHeight - 60) + "px";
            cameraRatio = 0.16 * (screenHeight - 60) + "px";
            classMode = "video__with__8--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams--middle--grater--8";
            } else {
                pinClassMode = "pinned__video--streams--middle--grater--8";
            }
        } else if (screenHeight * 1.2 <= screenWidth) {
            layoutWith = "100%";
            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--streams--middle--grater--8";
                firstCameraRatio = 0.45 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                classMode = "video__with__8--streams";
                pinClassMode = "pinned__video--streams--middle--grater--8";
                firstCameraRatio = 0.45 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            }
        } else if (screenHeight < screenWidth) {
            layoutWith = screenWidth;
            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--streams--middle--grater--8";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                classMode = "video__with__8--streams";
                pinClassMode = "pinned__video--streams";
                firstCameraRatio = 0.45 * (screenHeight - 60) + "px";
                cameraRatio = 0.13 * (screenHeight - 60) + "px";
            }
        }
    } else if (videoSubscribersLength === 16 || videoSubscribersLength === 17) {
        if (screenHeight > screenWidth * 2) {
            layoutWith = "100%";
            firstCameraRatio = 0.3 * (screenHeight - 60) + "px";
            cameraRatio = 0.155 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--streams";
        } else if (screenHeight > screenWidth * 1.75) {
            layoutWith = "100%";
            firstCameraRatio = 0.32 * (screenHeight - 60) + "px";
            cameraRatio = 0.15 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--streams";
        } else if (screenHeight > screenWidth * 1.5) {
            layoutWith = "100%";
            firstCameraRatio = 0.3 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--streams--full";
        } else if (screenHeight > screenWidth * 1.25) {
            layoutWith = "100%";
            firstCameraRatio = 0.4 * (screenHeight - 60) + "px";
            cameraRatio = 0.23 * (screenHeight - 60) + "px";
            classMode = "video--stream";
            pinClassMode = "pinned__video--streams--full";
        } else if (screenHeight > screenWidth) {
            layoutWith = "100%";
            firstCameraRatio = 0.55 * (screenHeight - 60) + "px";
            cameraRatio = 0.19 * (screenHeight - 60) + "px";
            classMode = "video__streams__3--columns";
            pinClassMode = "pinned__video--streams--full";
        } else if (screenHeight * 2 <= screenWidth) {
            layoutWith = screenHeight * 2 + "px";
            firstCameraRatio = 0.54 * (screenHeight - 60) + "px";
            cameraRatio = 0.22 * (screenHeight - 60) + "px";
            classMode = "video__with__9--streams";
            if (!sideBarIsVisible) {
                pinClassMode = "pinned__video--streams--grater--8";
            } else {
                pinClassMode = "pinned__video--streams--grater--8-with-sidebar";
            }
        } else if (screenHeight * 1.8 <= screenWidth) {
            layoutWith =
                screenHeight * 1.8 + "px";
            firstCameraRatio = 0.53 * (screenHeight - 60) + "px";
            cameraRatio = 0.2 * (screenHeight - 60) + "px";
            classMode = "video__with__9--streams";
            if (!sideBarIsVisible) {
                pinClassMode = "pinned__video--streams--grater--8";
            } else {
                pinClassMode = "pinned__video--streams--grater--8-with-sidebar";
            }
        } else if (screenHeight * 1.6 <= screenWidth) {
            layoutWith =
                screenHeight * 1.6 + "px";
            firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
            cameraRatio = 0.18 * (screenHeight - 60) + "px";
            classMode = "video__with__9--streams";
            if (!sideBarIsVisible) {
                pinClassMode = "pinned__video--streams--grater--8";
            } else {
                pinClassMode = "pinned__video--streams--grater--8-with-sidebar";
            }
        } else if (screenHeight * 1.4 <= screenWidth) {
            layoutWith =
                screenHeight * 1.4 + "px";
            firstCameraRatio = 0.5 * (screenHeight - 60) + "px";
            cameraRatio = 0.17 * (screenHeight - 60) + "px";
            classMode = "video__with__9--streams";
            if (sideBarIsVisible) {
                pinClassMode = "pinned__video--streams--middle--grater--8";
            } else {
                pinClassMode = "pinned__video--streams--middle--grater--8";
            }
        } else if (screenHeight * 1.2 <= screenWidth) {
            layoutWith = "100%";
            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--streams--middle--grater--8";
                firstCameraRatio = 0.45 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                classMode = "video__with__9--streams";
                pinClassMode = "pinned__video--streams--middle--grater--8";
                firstCameraRatio = 0.45 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            }
        } else if (screenHeight < screenWidth) {
            layoutWith = screenWidth;
            if (sideBarIsVisible) {
                classMode = "video--streams";
                pinClassMode = "pinned__video--streams--middle--grater--8";
                firstCameraRatio = 0.6 * (screenHeight - 60) + "px";
                cameraRatio = 0.15 * (screenHeight - 60) + "px";
            } else {
                classMode = "video__with__9--streams";
                pinClassMode = "pinned__video--streams";
                firstCameraRatio = 0.45 * (screenHeight - 60) + "px";
                cameraRatio = 0.13 * (screenHeight - 60) + "px";
            }
        }
    }
    console.error(pinClassMode)
return {pinClassMode, classMode, firstCameraRatio, cameraRatio, isSharedWithSidebar, layoutWith}
}
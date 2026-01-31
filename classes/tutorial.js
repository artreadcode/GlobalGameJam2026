class Tutorial extends Stage {
    constructor() {
        super();
        this.bg = 255;
    }

    goingBack(mX, mY) {
        // Calculate returnBtn bounds as drawn in show()
        let btnW = returnBtn.width * 0.5;
        let btnH = returnBtn.height * 0.5;
        let btnX = 0 + returnBtn.width * 0.1 / 2;
        let btnY = 0 + returnBtn.height * 0.3;

        if (
            mX >= btnX && mX <= btnX + btnW &&
            mY >= btnY && mY <= btnY + btnH
        ) {
            console.log('going back, right?');
            return true;
        }
    }

    show() {
        background(this.bg);

        // image()

        if (gameMode === 0 && video) {
            // Use forced video size for reliability
            let videoW = video.width;
            let videoH = video.height;
            // Scale to fit window while preserving aspect ratio
            let scale = min(windowWidth / videoW, windowHeight / videoH);
            let vidW = videoW * scale;
            let vidH = videoH * scale;
            // TRUE centering
            let vidX = (windowWidth - vidW) * 0.5;
            let vidY = (windowHeight - vidH) * 0.5;
            // Draw video
            // image(video, vidX, vidY, vidW, vidH);
            // Overlay FaceMesh keypoints mapped to the video area
            if (faces.length > 0) {
                let kp = faces[0].keypoints;
                noStroke();
                fill(100);
                for (let i = 0; i < kp.length; i++) {
                    // For mirrored webcam, use: let mappedX = vidX + ((videoW - kp[i].x) / videoW) * vidW;
                    let mappedX = vidX + ((videoW - kp[i].x) / videoW) * vidW;
                    let mappedY = vidY + (kp[i].y / videoH) * vidH;
                    ellipse(mappedX, mappedY, 4, 4);
                }
            }

            image(returnBtn, 0 + returnBtn.width * 0.1 / 2, 0 + returnBtn.height * 0.3, returnBtn.width * 0.5, returnBtn.height * 0.5);
            

        }
        else if (gameMode === 1) {
            console.log('Keyboard tutorial is activated.');
        }
    }
}
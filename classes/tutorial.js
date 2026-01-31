class Tutorial extends Stage {
    constructor() {
        super();
        this.bg = 255;
        this.counter = 3; // 3 -> 2 -> 1 -> GO
        this.smileStartTime = null;
        this.mode = 0; // smile (1 will be the covering)
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

            push();

            textAlign(CENTER);
            fill(0);
            textSize(min(windowWidth, windowHeight) * 0.03);

            if (this.mode === 0) {
                if (detectSmile()) {
                    if (this.smileStartTime === null) {
                        this.smileStartTime = millis();
                    }
                    text('keep smiling', windowWidth / 2, windowHeight / 2);
                    if (millis() - this.smileStartTime > 500 && this.counter > 0) {
                        this.counter--;
                        console.log('Counter decremented:', this.counter);
                        this.smileStartTime = millis();
                    }
                } else {
                    if (this.counter === 0) {
                        this.mode = 1;
                        console.log('Mode changed to 1');
                        this.counter = 3;
                    } else {
                        this.counter = 3;
                    }
                    this.smileStartTime = null;
                }
            }
            else if (this.mode === 1) {
                text('cover your mouth to hide', windowWidth / 2, windowHeight / 2);
            }


            pop();
        }
        else if (gameMode === 1) {
            console.log('Keyboard tutorial is activated.');

            image(returnBtn, 0 + returnBtn.width * 0.1 / 2, 0 + returnBtn.height * 0.3, returnBtn.width * 0.5, returnBtn.height * 0.5);
        }
    }
}
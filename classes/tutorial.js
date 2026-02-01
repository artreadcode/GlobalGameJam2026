class Tutorial extends Stage {
    constructor() {
        super();
        this.bg = 255;
        this.started = 0;
        // this.counter = 3; // 3 -> 2 -> 1 -> GO
        this.smileStartTime = null;
        this.tutorialMode = 0; // smile (1 will be the covering)
        this.willMove = false; // will it move onto the next stage?
        this.bar;
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

    show(energyI, energyE) {

        ellipseMode(CENTER);
        rectMode(CENTER);
        background(this.bg);
        this.bar = new Bar();

        let btnW = returnBtn.width * 0.5;
        let btnH = returnBtn.height * 0.5;
        let btnX = 0 + returnBtn.width * 0.1 / 2;
        let btnY = 0 + returnBtn.height * 0.3;
        image(returnBtn, btnX, btnY, btnW, btnH);

        this.bar.show('tutorial', energyI, energyE);

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

            if (this.tutorialMode === 0) {
                if (detectSmile()) {
                    console.log('smile is detected');
                    if (this.smileStartTime === null) {
                        this.smileStartTime = millis(); // store the thing
                    }
                    text('keep smiling', windowWidth / 2, windowHeight / 2);
                    if (millis() - this.smileStartTime > 0 && millis() - this.smileStartTime < 1500) {
                        // this.counter--;
                        console.log('keep smile.');
                        // this.smileStartTime = millis();
                    }
                    else {
                        console.log('mode should be changed.');
                        this.smileStartTime = null; // reset
                        this.tutorialMode = 1;
                    } 
                }
            }
            else if (this.tutorialMode === 1) {
                text('cover your mouth to hide', windowWidth / 2, windowHeight / 2);

                if (detectHide()) {
                    console.log('your face is hidden');
                    // I'll just reuse smileStartTime because I'm about to go insane
                    if (this.smileStartTime === null) {
                        this.smileStartTime = millis();
                    }
                    
                    if (millis() - this.smileStartTime > 0 && millis() - this.smileStartTime < 1500) {
                        console.log('countdown...');
                    }
                    else {
                        console.log('the game starts.')
                        this.smileStartTime = null; // reset
                        this.tutorialMode = 2; 
                        this.willMove = true;
                        this.started = 0;
                    }
                }
            }


            pop();
        }
        else if (gameMode === 1) {
            console.log('Keyboard tutorial is activated.');
            // c.f. Keyboard tutorial doesn't exist.
            image(returnBtn, 0 + returnBtn.width * 0.1 / 2, 0 + returnBtn.height * 0.3, returnBtn.width * 0.5, returnBtn.height * 0.5);
        }
    }
}
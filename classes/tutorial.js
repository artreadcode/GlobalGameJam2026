class Tutorial extends Stage {
    constructor() {
        super();
        this.bg = 255;
        
        // Tracking variables
        this.testDuration = 0; // How long have they successfully tested?
        this.showLaunchButton = false;
        this.willMove = false; // Trigger to go to next stage
        
        this.bar = new Bar();
    }

    // Check if user clicked the "Return" (Back) button
    goingBack(mX, mY) {
        let btnW = returnBtn.width * 0.5;
        let btnH = returnBtn.height * 0.5;
        let btnX = 0 + returnBtn.width * 0.1 / 2;
        let btnY = 0 + returnBtn.height * 0.3;

        if (mX >= btnX && mX <= btnX + btnW && mY >= btnY && mY <= btnY + btnH) {
            return true;
        }
        return false;
    }

    // Check if user clicked the "Launch" (Start Game) button
    checkLaunch(mX, mY) {
        if (!this.showLaunchButton) return false;

        // Calculate bounds based on where we draw the image
        let imgW = launch.width * 0.5;
        let imgH = launch.height * 0.5;
        // The image is drawn at CENTER, so we calculate edges:
        let cX = windowWidth / 2;
        let cY = windowHeight / 6 * 5;
        
        let left = cX - imgW / 2;
        let right = cX + imgW / 2;
        let top = cY - imgH / 2;
        let bottom = cY + imgH / 2;

        if (mX >= left && mX <= right && mY >= top && mY <= bottom) {
            this.willMove = true; // This tells Game.js to switch scenes
            return true;
        }
        return false;
    }

    show(energyI, energyE) {
        push();
        ellipseMode(CENTER);
        rectMode(CENTER);
        background(this.bg);
        
        // 1. Draw UI (Bar and Return Button)
        let btnW = returnBtn.width * 0.5;
        let btnH = returnBtn.height * 0.5;
        let btnX = 0 + returnBtn.width * 0.1 / 2;
        let btnY = 0 + returnBtn.height * 0.3;
        image(returnBtn, btnX, btnY, btnW, btnH);

        this.bar.show('tutorial', energyI, energyE);

        // 2. Face Detection Visualization (Dots)
        if (gameMode === 0 && video) {
            if (faces.length > 0) {
                let videoW = video.width;
                let videoH = video.height;
                let scale = min(windowWidth / videoW, windowHeight / videoH);
                let vidW = videoW * scale;
                let vidH = videoH * scale;
                let vidX = (windowWidth - vidW) * 0.5;
                let vidY = (windowHeight - vidH) * 0.5;

                let kp = faces[0].keypoints;
                noStroke();
                fill(100);
                for (let i = 0; i < kp.length; i++) {
                    let mappedX = vidX + ((videoW - kp[i].x) / videoW) * vidW;
                    let mappedY = vidY + (kp[i].y / videoH) * vidH;
                    ellipse(mappedX, mappedY, 4, 4);
                }
            }
        
            // 3. Logic: Detect Inputs
            // We run both every frame so the bar updates and player can do either
            let isSmiling = detectSmile();
            let isHiding = detectHide();

            // 4. Instructions
            push();
            textAlign(CENTER);
            fill(0);
            textSize(min(windowWidth, windowHeight) * 0.03);
            text('Smile or cover your mouth to\nrecharge your introverted or\nextroverted energy.', windowWidth / 2, windowHeight / 2);
            pop();

            // 5. Accumulate "Test Time"
            // If they are doing EITHER action, we count it as "testing"
            if (isSmiling || isHiding) {
                this.testDuration += deltaTime; // Adds time in milliseconds
            }

            // 6. Show Launch Button after 1.5 seconds of testing
            if (this.testDuration > 1500) {
                this.showLaunchButton = true;
            }

            if (this.showLaunchButton) {
                imageMode(CENTER);
                image(launch, windowWidth / 2, windowHeight / 6 * 5, launch.width * 0.5, launch.height * 0.5);
                
                
            }
        }
        else if (gameMode === 1) {
            // Keyboard mode placeholder
            image(returnBtn, 0 + returnBtn.width * 0.1 / 2, 0 + returnBtn.height * 0.3, returnBtn.width * 0.5, returnBtn.height * 0.5);
        }
        pop();
    }
}
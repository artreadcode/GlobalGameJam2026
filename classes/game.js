class Game {

    constructor() {
        this.started = false; // Did the player start playing? 
        this.ended = false; // Did the player reach to the ending?

        this.parallax = new Parallax();
        this.player = new Player(width/4);
        this.camera = new Camera();
        this.worldX = 0;
        this.mirrorObstacle = new Obstacle(0, null, null, { actionId: "1", actionType: "transition", visible: false });
        this.mirrorExitObstacle = new Obstacle(0, 40, 0, { actionId: "1", actionType: "return", visible: false });
        // Back door to go from living room back to bedroom
        this.backDoorObstacle = new Obstacle(0, 100, 300, { actionId: "2", actionType: "transition", visible: false });
        // this.minigame = new Game1();
        // this.minigameActive = false;
        // this.minigameTrigger = new Obstacle(0, 120, 120, { sprite: placeholderSprite, actionId: "1", actionType: "minigame" });
        this.obstacles = [this.mirrorObstacle];
        /*
        this.w = windowWidth;
        this.h = windowHeight;
        */

        // For the current stage; Where are you?
        this.stage = 0;

        // To store what was the previous stage
        this.youprev = -1;
        this.after = 1; // The next stage of a starting screen is 1.

        // Shall we move on? (Triggered from each scene)
        this.next = false;

        // For each play
        this.play;


        this.loop = 1;
        this.bg = 0; // for now
        this.returnStage = null;
        this.returnX = null;
        this.mirrorEntryCooldownFrames = 0;
        this.backDoorCooldownFrames = 0;

        // Progress bars (0-100)
        this.bar1Value = 50;
        this.bar2Value = 30;

        //Dialogue box
        this.dialogue = null;

        // Transition effect
        this.transition = new Transition();
    }

    // Draw compact UI panel with about/help buttons, face, and progress bars
    drawBars() {
        let panelX = 20;
        let panelY = 20;

        push();

        // Draw about and help buttons at top
        let btnScale = 0.3;
        let btnY = panelY + 15;
        image(aboutBtn, panelX + 20, btnY, aboutBtn.width * btnScale, aboutBtn.height * btnScale);
        image(helpBtn, panelX + 20 + aboutBtn.width * btnScale + 10, btnY, helpBtn.width * btnScale, helpBtn.height * btnScale);

        // Draw face area (video will be replaced by face mesh)
        let faceX = panelX + 15;
        let faceY = panelY + 55;
        let faceSize = 70;

        if (video) {
            // TODO: Replace with face mesh visualization
            image(video, faceX, faceY, faceSize, faceSize);
        } else {
            stroke(100);
            strokeWeight(1);
            noFill();
            ellipse(faceX + faceSize/2, faceY + faceSize/2, faceSize, faceSize);
        }

        // Progress bars - compact version
        let barX = faceX + faceSize + 15;
        let barY = faceY + 15;
        let barW = 150;
        let barH = 18;
        let spacing = 30;
        let padding = 3;

        textFont(schoolbellFont);
        textAlign(LEFT, CENTER);
        textSize(14);
        fill(0);
        noStroke();

        // First bar
        text("label", barX, barY);
        image(barImg, barX + 40, barY - barH / 2, barW, barH);
        fill(0);
        let fill1Width = (this.bar1Value / 100) * (barW - padding * 2);
        rect(barX + 40 + padding, barY - barH / 2 + padding, fill1Width, barH - padding * 2);

        // Second bar
        fill(0);
        text("label", barX, barY + spacing);
        image(barImg, barX + 40, barY + spacing - barH / 2, barW, barH);
        fill(0);
        let fill2Width = (this.bar2Value / 100) * (barW - padding * 2);
        rect(barX + 40 + padding, barY + spacing - barH / 2 + padding, fill2Width, barH - padding * 2);

        pop();
    }

    show() {
        background(this.bg);

        // Play background music for start screen and stage 1 only
        if (this.stage === 0 || this.stage === 1) {
            if (bgMusic && !bgMusic.isPlaying() && getAudioContext().state === "running") {
                bgMusic.setLoop(true);
                bgMusic.play();
            }
        } else if (bgMusic && bgMusic.isPlaying()) {
            bgMusic.stop();
        }

        let walkingActive = false;

        switch (this.stage) {
            case 0: // Start screen
                if (!this.started) {
                    console.log('Hello world');
                    this.started = true;
                    this.play = new startScreen();
                }
                else {
                    this.play.play();
                    this.play.show();
                    // console.log('?????');

                    if (this.play.isFaceThere) {
                        this.stage = 5; // Move onto the tutorial screen.
                    }
                }
                break;

            case 1: {           //stage 1
                if (!(this.play instanceof Stage)) this.play = new Stage();

                //Dialogue box 
                if(!this.dialogue){
                    this.dialogue = new dialogueBox(
                        "Testing dialogue box hiiiiiii",
                        "character Name"
                    );
                }

                const moveRight = keyIsDown(68);
                const moveLeft = keyIsDown(65);
                walkingActive = moveRight || moveLeft;

                const prevWorldX = this.worldX;
                // if (!this.minigameActive) {
                if (moveRight) this.worldX += this.player.speed;
                if (moveLeft) this.worldX -= this.player.speed;
                // }

                // Use scene width from parallax (based on back_bedroom image)
                const sceneWidth = this.parallax.getSceneWidth();
                // Allow player to walk past the door (add extra 200px)
                const maxWorldX = Math.max(0, sceneWidth - width / 2);
                this.worldX = constrain(this.worldX, 0, maxWorldX);

                const cameraX = this.worldX;
                this.player.x = cameraX + width / 2;

                const deltaX = this.worldX - prevWorldX;
                this.parallax.update(deltaX);
                this.parallax.draw(cameraX);

                // Position door obstacle to match parallax door position
                let doorRatio = bedroomDoor.width / bedroomDoor.height;
                let doorDrawH = height * 0.4;
                let doorDrawW = doorDrawH * doorRatio;
                let doorWorldX = sceneWidth - doorDrawW + 70;
                this.mirrorObstacle.x = doorWorldX;
                this.mirrorObstacle.w = doorDrawW;
                this.mirrorObstacle.h = doorDrawH;

                // Update player animation based on movement
                this.player.updateAnimation(moveLeft, moveRight);

                // Draw player on top of door
                this.player.draw(cameraX);

                // Draw front parallax layer (in front of player)
                this.parallax.drawFront();

                // Handle obstacle collisions
                if (this.mirrorEntryCooldownFrames > 0) {
                    this.mirrorEntryCooldownFrames -= 1;
                }
                for (const obstacle of this.obstacles) {
                    // if (this.minigameActive) {
                    //     continue;
                    // }
                    if (obstacle === this.mirrorObstacle && this.mirrorEntryCooldownFrames > 0) {
                        continue;
                    }
                    if (obstacle.hit(this.player)) {
                        if (obstacle.actionType) {
                            Actions.run(obstacle.actionType, obstacle.actionId, this, obstacle);
                            break;
                        }
                    }
                }
                if (this.minigameTrigger && this.minigameTrigger.triggered && !this.minigameTrigger.overlaps(this.player)) {
                    this.minigameTrigger.triggered = false;
                }
                if (this.minigameActive) {
                    this.minigame.update();
                    this.minigame.draw();
                    if (this.minigame.isDone && this.minigame.isDone()) {
                        this.minigameActive = false;
                        this.minigame.stop();
                    }
                    if (keyIsDown(27)) {
                        this.minigameActive = false;
                        this.minigame.stop();
                    }
                }


                break;
            }
            case 2: {           //stage 2 - Living Room
                if (!(this.play instanceof Stage)) this.play = new Stage();

                const moveRight = keyIsDown(68);
                const moveLeft = keyIsDown(65);
                walkingActive = moveRight || moveLeft;

                const prevWorldX = this.worldX;
                if (moveRight) this.worldX += this.player.speed;
                if (moveLeft) this.worldX -= this.player.speed;

                // Use scene width from parallax
                const sceneWidth = this.parallax.getSceneWidth();
                const maxWorldX = Math.max(0, sceneWidth - width / 2);
                this.worldX = constrain(this.worldX, 0, maxWorldX);

                const cameraX = this.worldX;
                this.player.x = cameraX + width / 2;

                const deltaX = this.worldX - prevWorldX;
                this.parallax.update(deltaX);
                this.parallax.draw(cameraX);

                // Update player animation based on movement
                this.player.updateAnimation(moveLeft, moveRight);

                // Draw player
                this.player.draw(cameraX);

                // Draw front parallax layer (in front of player)
                this.parallax.drawFront();

                // Back door on left side to go back to bedroom
                if (this.backDoorCooldownFrames > 0) {
                    this.backDoorCooldownFrames--;
                }
                // Only trigger back door when player is at far left (worldX near 0)
                if (this.worldX <= 10 && this.backDoorCooldownFrames <= 0) {
                    this.backDoorCooldownFrames = 60;
                    Actions.run("transition", "2", this, null);
                }
                break;
            }
            case 3: {           //stage 3
                walkingActive = keyIsDown(68) || keyIsDown(65);
                this.player.update(this.play);
                const cameraX = this.camera.update(this.play, this.player.x);
                this.player.draw(cameraX);
                break;
            }
            case 4: {           //mirror transition scene/stage, the "inbetween" of each level
                if (!(this.play instanceof MirrorScreen)) {
                    this.play = new MirrorScreen();
                    this.mirrorExitObstacle.triggered = false;
                }
                this.play.updateBounds();

                const moveRight = keyIsDown(68);
                const moveLeft = keyIsDown(65);
                walkingActive = moveRight || moveLeft;
                if (moveRight) this.player.x += this.player.speed;
                if (moveLeft) this.player.x -= this.player.speed;
                this.player.x = constrain(this.player.x, this.play.xMin, this.play.xMax);

                this.play.show();
                this.player.updateAnimation(moveLeft, moveRight);
                this.player.draw(0);

                const exitOffset = Math.round(width * (400 / 1920));
                this.mirrorExitObstacle.x = exitOffset;
                this.mirrorExitObstacle.w = 40;
                this.mirrorExitObstacle.h = height;
                if (this.mirrorExitObstacle.hit(this.player)) {
                    Actions.run(this.mirrorExitObstacle.actionType, this.mirrorExitObstacle.actionId, this, this.mirrorExitObstacle);
                }
                break;
            }
            case 5: { // Tutorial page
                if (!(this.play instanceof Tutorial)) {
                    this.play = new Tutorial();
                }
                this.play.show();
                if (this.play.willMove) {
                    this.stage = 1;
                    this.play.willMove = false;
                    this.play.tutorialMode = 0;
                    this.play.smileStartTime = null;
                }
                break;
            }
        }

        if (this.stage !== 4 && this.stage !== 0) {
            this.drawBars();
        }

        // Footstep loop on any walking stage
        if (walkSfx) {
            if (walkingActive && getAudioContext().state === "running") {
                if (!walkSfx.isPlaying()) {
                    walkSfx.setLoop(true);
                    walkSfx.play();
                }
            } else if (!walkingActive && walkSfx.isPlaying()) {
                walkSfx.stop();
            }
        }

        // Draw transition effect on top of everything
        if (this.transition.active) {
            this.transition.show();
        }
    }

    // Test method to trigger transition
    testTransition() {
        this.transition.capture();
        this.transition.start(1);
    }
}

// Handle window resizing event so our game won't be seen weird.
// Ref: https://p5js.org/reference/p5/windowResized/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

}

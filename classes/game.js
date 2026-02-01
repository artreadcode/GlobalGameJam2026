class Game {

    constructor() {
        this.started = false; // Did the player start playing?
        this.ended = false; // Did the player reach to the ending?

        this.parallax = new Parallax();
        this.player = new Player(width/4);
        this.camera = new Camera();
        this.worldX = 0;
        this.mirrorObstacle = new Obstacle(0, 400, 400, { sprite: bedroomDoor, actionId: "1", actionType: "transition", visible: true });
        this.mirrorExitObstacle = new Obstacle(0, 40, 0, { actionId: "1", actionType: "return", visible: false });
        this.minigame = new Game1();
        this.minigameActive = false;
        this.minigameTriggerMum = new Obstacle(0, 110, 400, { sprite: mumSprite, actionId: "1", actionType: "minigame", yOffset: 42 });
        this.minigameTriggerMumCamera = new Obstacle(0, 400, 400, { sprite: mumCameraSprite, actionId: null, actionType: null, yOffset: 0 });
        this.minigameTriggerDad = new Obstacle(0, 260, 500, { sprite: dadSprite, actionId: null, actionType: null, yOffset: 42 });
        this.Camera = new Obstacle(0, 400, 400, { sprite: cameraBorder, actionId: null, actionType: null, yOffset: 42 });
        this.takingPicture = new Obstacle(0, 700, 700, { sprite: takingPictureSprite, actionId: null, actionType: null, yOffset: 42 });
        this.takingPictureSmile = new Obstacle(0, 700, 700, { sprite: takingPictureSpriteSmile, actionId: null, actionType: null, yOffset: 42 });



        this.minigameCompleted = false;
        this.obstacles = [this.mirrorObstacle];
        // Back door to go from living room back to bedroom
        this.backDoorObstacle = new Obstacle(0, 100, 300, { actionId: "2", actionType: "transition", visible: false });
        /*
        this.w = windowWidth;
        this.h = windowHeight;
        */

        // Stage structure:
        // Stage 0: Start screen
        // Stage 1: Bedroom (scene 0) → Living room (scene 1) → Stage 2
        // Stage 2: High school (scene 0) → Toilet (scene 1)
        // Stage 4: Mirror transition
        // Stage 5: Tutorial
        // DEBUG: Start directly in toilet scene
        this.stage = 0;
        this.scene = 0; // Toilet scene
        this.started =false;

        // Shall we move on? (Triggered from each scene)
        this.next = false;

        // // For each play - start in toilet
        // this.play = new Stage();
        // this.parallax.setStage(2, 1); // Toilet scene
        // // DEBUG: Spawn at door (right side), press D to go to high school, A to walk into toilet
        // // Will be set properly after parallax calculates scene width
        // this.worldX = 0; // Temporary, will be set in show() on first frame
        // this.toiletFirstFrame = true; // Flag to set proper position on first frame
        // console.log('DEBUG Toilet: initial worldX =', this.worldX);

        this.loop = 1;
        this.bg = 0;
        this.returnStage = null;
        this.returnScene = null;
        this.returnX = null;
        this.mirrorEntryCooldownFrames = 0;
        this.sceneCooldownFrames = 0; // Cooldown for scene transitions within a stage

        // Progress bars (0-100)
        this.bar1Value = 50;
        this.bar2Value = 30;

        //Dialogue box
        this.dialogue = null;

        // Transition effect
        this.transition = new Transition();

        // *** Energy level: They will keep changing throughout the entire game.
        this.introvert = 0.5; // default
        this.extrovert = 0.5; // default
        this.isTutorialStarted = 0; // default
        this.isTutorialFinished = 0; // default

        this.smiled = 0; // 0: false, 1: neutral, 2: true
        this.hid = 0; // 0: false, 1: neutral, 2: true
    }

    // Draw compact UI panel with about/help buttons, face, and progress bars
    drawBars() {
        let panelX = 20;
        let panelY = 20;

        push();

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

        rectMode(CORNER);
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

        // Play background music for stage 1 (toddler music for both scenes)
        if (this.stage === 1) {
            if (bgMusic && !bgMusic.isPlaying() && getAudioContext().state === "running") {
                bgMusic.setLoop(true);
                bgMusic.play();
            }
        } else if (this.stage !== 0 && bgMusic && bgMusic.isPlaying()) {
            bgMusic.stop();
        }

        let walkingActive = false;

        // Handle scene cooldown
        if (this.sceneCooldownFrames > 0) {
            this.sceneCooldownFrames--;
        }

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

                    if (this.play.isFaceThere) {
                        this.stage = 7; // Move onto the tutorial screen.
                    }
                }
                break;

            case 1: {           //stage 1
                if (!(this.play instanceof Stage)) this.play = new Stage();

                const lockMovement = this.minigameActive && this.minigame && this.minigame.locksMovement;
                const moveRight = keyIsDown(68);
                const moveLeft = keyIsDown(65);
                walkingActive = !lockMovement && (moveRight || moveLeft);

                const prevWorldX = this.worldX;
                if (!lockMovement) {
                    if (moveRight) this.worldX += this.player.speed;
                    if (moveLeft) this.worldX -= this.player.speed;
                }

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
            if (bedroomDoor && bedroomDoor.width && bedroomDoor.height) {
                let doorRatio = bedroomDoor.width / bedroomDoor.height;
                let doorDrawH = height * 0.4; // use 0.7 if you want the mirror
                let doorDrawW = doorDrawH * doorRatio;
                let doorWorldX = sceneWidth - doorDrawW + 70;
                this.mirrorObstacle.x = doorWorldX;
                this.mirrorObstacle.w = doorDrawW;
                this.mirrorObstacle.h = doorDrawH;
            } else {
                this.mirrorObstacle.x = sceneWidth - 200;
            }

            // Update player animation if this method exists
            this.player.updateAnimation?.(moveLeft, moveRight);

                // Handle obstacle collisions + draw obstacles (except minigame trigger, drawn later)
                if (this.mirrorEntryCooldownFrames > 0) {
                    this.mirrorEntryCooldownFrames -= 1;
                }
                for (const obstacle of this.obstacles) {
                    obstacle.draw(cameraX);
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

                // Draw player on top of door
                this.player.draw(cameraX);

                // Draw front parallax layer (in front of player)
                this.parallax.drawFront();

                break;
            }
            case 2: {           //stage 2 - Living Room
                if (!(this.play instanceof Stage)) this.play = new Stage();

                const lockMovement = this.minigameActive && this.minigame && this.minigame.locksMovement;
                const moveRight = keyIsDown(68);
                const moveLeft = keyIsDown(65);
                walkingActive = !lockMovement && (moveRight || moveLeft);

                const prevWorldX = this.worldX;
                if (!lockMovement) {
                    if (moveRight) this.worldX += this.player.speed;
                    if (moveLeft) this.worldX -= this.player.speed;
                }

                const sceneWidth = this.parallax.getSceneWidth();
                const maxWorldX = Math.max(0, sceneWidth - width / 2);
                this.worldX = constrain(this.worldX, 0, maxWorldX);

                const cameraX = this.worldX;
                this.player.x = cameraX + width / 2;

                const deltaX = this.worldX - prevWorldX;
                this.parallax.update(deltaX);
                this.parallax.draw(cameraX);

                // Update player animation based on movement
                this.player.updateAnimation(!lockMovement && moveLeft, !lockMovement && moveRight);

                // Draw player
                this.player.draw(cameraX);
                this.parallax.drawFront();

                // Scene transitions within stage 1
                if (this.sceneCooldownFrames <= 0) {
                    if (this.scene === 0 && this.worldX >= maxWorldX - 5) {
                        // Bedroom door -> Living room
                        this.scene = 1;
                        this.parallax.setStage(1, 1);
                        this.worldX = 0;
                        this.sceneCooldownFrames = 60;
                        console.log('Stage 1: Bedroom -> Living room');
                    } else if (this.scene === 1 && this.worldX <= 10) {
                        // Living room -> Bedroom (go left)
                        this.scene = 0;
                        this.parallax.setStage(1, 0);
                        const newSceneWidth = this.parallax.getSceneWidth();
                        this.worldX = Math.max(0, newSceneWidth - width / 2);
                        this.sceneCooldownFrames = 60;
                        console.log('Stage 1: Living room -> Bedroom');
                    } else if (this.scene === 1 && this.worldX >= maxWorldX - 5) {
                        // Living room door -> Stage 2: High school
                        this.stage = 2;
                        this.scene = 0;
                        this.parallax.setStage(2, 0);
                        this.worldX = 0;
                        this.sceneCooldownFrames = 60;
                        console.log('Stage 1: Living room -> Stage 2: High school');
                    }
                }
                if (this.minigameTriggerMum) {
                    const centerX = Math.max(sceneWidth * 0.5, width * 0.5);
                    this.minigameTriggerMum.x = centerX - 2100;
                    if (this.minigameTriggerDad) {
                        this.minigameTriggerDad.x = this.minigameTriggerMum.x + 150;
                    }
                }

                if (!this.minigameCompleted && this.minigameTriggerMum) {
                    if (this.minigameTriggerMum.hit(this.player)) {
                        if (this.minigameTriggerMum.actionType) {
                            Actions.run(this.minigameTriggerMum.actionType, this.minigameTriggerMum.actionId, this, this.minigameTriggerMum);
                        }
                    }
                }

                if (this.minigameTriggerMum) {
                    this.minigameTriggerMum.draw(cameraX);
                }
                if (this.minigameTriggerDad) {
                    this.minigameTriggerDad.draw(cameraX);
                }
                if (!this.minigameCompleted && this.minigameTriggerMum && this.minigameTriggerMum.triggered && !this.minigameTriggerMum.overlaps(this.player)) {
                    this.minigameTriggerMum.triggered = false;
                }

                if (this.minigameActive) {
                    this.minigame.update();
                    this.minigame.draw();
                    if (this.minigame.isDone && this.minigame.isDone()) {
                        this.minigameActive = false;
                        this.minigame.stop();
                        this.minigameCompleted = true;
                        if (this.minigameTriggerMum) {
                            this.minigameTriggerMum.visible = false;
                        }
                        if (this.minigameTriggerDad) {
                            this.minigameTriggerDad.visible = false;
                        }
                    }
                    if (keyIsDown(27)) {
                        this.minigameActive = false;
                        this.minigame.stop();
                    }
                }

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

            case 2: { // Stage 2: High school (scene 0) + Toilet (scene 1)
                if (!(this.play instanceof Stage)) this.play = new Stage();

                const sceneWidth = this.parallax.getSceneWidth();
                const maxWorldX = Math.max(0, sceneWidth - width / 2);

                // Set proper spawn position on first frame for toilet
                if (this.scene === 1 && this.toiletFirstFrame) {
                    this.worldX = 1398; // Spawn at door position
                    this.toiletFirstFrame = false;
                    console.log('Toilet: Spawned at door, worldX =', this.worldX, 'maxWorldX =', maxWorldX);
                }

                const moveRight = keyIsDown(68);
                const moveLeft = keyIsDown(65);
                walkingActive = moveRight || moveLeft;

                const prevWorldX = this.worldX;
                if (moveRight) this.worldX += this.player.speed;
                if (moveLeft) this.worldX -= this.player.speed;

                // Allow negative worldX for toilet to walk further left
                const minWorldX = (this.scene === 1) ? -200 : 0;
                this.worldX = constrain(this.worldX, minWorldX, maxWorldX);

                // DEBUG: Show position info every 60 frames
                if (frameCount % 60 === 0 && this.scene === 1) {
                    console.log('Toilet DEBUG - worldX:', Math.round(this.worldX), 'maxWorldX:', Math.round(maxWorldX), 'sceneWidth:', Math.round(sceneWidth));
                }

                const cameraX = this.worldX;
                this.player.x = cameraX + width / 2;

                const deltaX = this.worldX - prevWorldX;
                this.parallax.update(deltaX);
                this.parallax.draw(cameraX);

                this.player.updateAnimation(moveLeft, moveRight);
                this.player.draw(cameraX);
                this.parallax.drawFront();

                // Scene transitions within stage 2
                if (this.sceneCooldownFrames <= 0) {
                    if (this.scene === 0 && this.worldX <= 10) {
                        // High school -> Stage 1 Living room (go left to previous stage)
                        this.stage = 1;
                        this.scene = 1;
                        this.parallax.setStage(1, 1);
                        const newSceneWidth = this.parallax.getSceneWidth();
                        this.worldX = Math.max(0, newSceneWidth - width / 2);
                        this.sceneCooldownFrames = 60;
                        console.log('Stage 2 -> Stage 1: Living room');
                    } else if (this.scene === 0 && this.worldX >= maxWorldX - 5) {
                        // High school -> Toilet (go right, spawn at door position)
                        this.scene = 1;
                        this.parallax.setStage(2, 1);
                        // Spawn at door position
                        this.worldX = 1398;
                        this.sceneCooldownFrames = 60;
                        console.log('Stage 2: High school -> Toilet, worldX:', this.worldX);
                    } else if (this.scene === 1 && this.worldX >= 1390 && moveRight) {
                        // Toilet -> High school (press D at door position ~1398)
                        this.scene = 0;
                        this.parallax.setStage(2, 0);
                        const newSceneWidth = this.parallax.getSceneWidth();
                        this.worldX = Math.max(0, newSceneWidth - width / 2);
                        this.sceneCooldownFrames = 60;
                        console.log('Stage 2: Toilet -> High school');
                    }
                }
                break;
            }
            case 4: {           //stage 4 (placeholder)
                walkingActive = keyIsDown(68) || keyIsDown(65);
                this.player.update(this.play);
                const cameraX = this.camera.update(this.play, this.player.x);
                this.player.draw(cameraX);
                break;
            }
            case 5: {           //stage 5 (placeholder)
                walkingActive = keyIsDown(68) || keyIsDown(65);
                this.player.update(this.play);
                const cameraX = this.camera.update(this.play, this.player.x);
                this.player.draw(cameraX);
                break;
            }
            case 6: {           //stage 6 (placeholder)
                walkingActive = keyIsDown(68) || keyIsDown(65);
                this.player.update(this.play);
                const cameraX = this.camera.update(this.play, this.player.x);
                this.player.draw(cameraX);
                break;
            }
            case 7: { // Tutorial page
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
            case 8: {           //mirror transition scene/stage, the "inbetween" of each level
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
                    this.isTutorialStarted = 1; // true
                }
                this.play.show(this.introvert, this.extrovert);
                if (this.play.willMove) {
                    this.stage = 1;
                    this.scene = 0;
                    this.parallax.setStage(1, 0);
                    this.worldX = 0;
                    this.play.willMove = false;
                    this.play.tutorialMode = 0;
                    this.play.smileStartTime = null;
                    this.isTutorialEnded = 1; // true

                    console.log('Tutorial -> Stage 1: Bedroom');
                }
                break;
            }
        }

        if (this.stage !== 4 && this.stage !== 0 && this.stage !== 5) {
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

        // Draw dialogue box if active
        if (this.dialogue) {
            this.dialogue.draw();
        }

        // Draw header with buttons on top of everything
        header.display(this.stage);
    }

    // Test method to trigger transition
    testTransition() {
        this.transition.capture();
        this.transition.start(1);
        header.display(this.stage);
    }
}

// Handle window resizing event so our game won't be seen weird.
// Ref: https://p5js.org/reference/p5/windowResized/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

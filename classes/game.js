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
        /*
        this.w = windowWidth;
        this.h = windowHeight;
        */

        // Stage structure:
        // Stage 0: Start screen
        // Stage 1: Bedroom
        // Stage 2: Living Room
        // Stage 3: High School
        // Stage 4: Toilet
        // Stage 8: Mirror transition
        // Stage 9: Tutorial
        this.stage = 0;
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

        this.hideQuestionText = new JiggleText("?", 0, 0, 20, {color: 0});
        // Bar used in header/playing mode
        this.bar = new Bar();
    }

    // Draw compact UI panel with about/help buttons, face, and progress bars
    drawBars() {
        let padding = 40;           // Distance from window edge
        let faceSize = 70;          // Size of face circle
        let faceSpacing = 10;       // Gap between face and bar
        let barWidth = 250;         // Width of the bar UI

        push();

        // Ensure Bar instance exists
        if (!this.bar) this.bar = new Bar();

        // Calculate positions working backwards from right edge
        let rightEdge = windowWidth - padding-barWidth;
        let barLeft = Math.max(padding, rightEdge - barWidth);  // Ensure bar doesn't go past left edge
        let faceRight = barLeft - faceSpacing;
        let faceLeft = Math.max(padding, faceRight - faceSize); // Ensure face doesn't go past left edge
        
        let centerX = faceLeft + faceSize / 2;
        let centerY = padding + faceSize / 2;

        // Draw face mesh area
        if (video && faces.length > 0) {
            if (detectHide()) {
                // Show only border and question mark when face is hidden                
                imageMode(CENTER);
                image(question, centerX, centerY, faceSize, faceSize);
                imageMode(CORNER);
                this.hideQuestionText.setPosition(centerX, centerY);
                this.hideQuestionText.show();
            } else {
                // Show face mesh dots when face is visible
                let kp = faces[0].keypoints;
                
                // Calculate bounding box of keypoints
                let minX = Infinity, maxX = -Infinity;
                let minY = Infinity, maxY = -Infinity;
                
                for (let i = 0; i < kp.length; i++) {
                    minX = min(minX, kp[i].x);
                    maxX = max(maxX, kp[i].x);
                    minY = min(minY, kp[i].y);
                    maxY = max(maxY, kp[i].y);
                }
                
                let bboxWidth = maxX - minX;
                let bboxHeight = maxY - minY;
                let scale = min((faceSize * 0.9) / bboxWidth, (faceSize * 0.9) / bboxHeight);
                
                let bboxCenterX = minX + bboxWidth / 2;
                let bboxCenterY = minY + bboxHeight / 2;
                
                // Draw keypoint dots
                noStroke();
                fill(0);
                
                for (let i = 0; i < kp.length; i++) {
                    let x = centerX - (kp[i].x - bboxCenterX) * scale;
                    let y = centerY + (kp[i].y - bboxCenterY) * scale;
                    ellipse(x, y, 2, 2);
                }
            }
        } else {
            // No video or no faces detected
            this.hideQuestionText.setPosition(centerX, centerY);
            this.hideQuestionText.show();
            
            imageMode(CENTER);
            image(question, centerX, centerY, faceSize, faceSize);
            imageMode(CORNER);
        }

        rectMode(CORNER);

        // Position bar to the right of face, aligned to top with padding
        // Make sure bar stays within right edge
        this.bar.headertx = constrain(barLeft, padding, windowWidth - padding - barWidth);
        this.bar.headerty = padding;
        
        // Draw the bar
        this.bar.show('playing', this.introvert, this.extrovert);

        pop();
    }

    show() {
        background(this.bg);

        // Play background music based on stage
        if (this.stage === 1 || this.stage === 2) {
            // Stage 1-2 (Bedroom, Living Room): Play toddler music
            if (teenMusic && teenMusic.isPlaying()) teenMusic.stop();
            if (bgMusic && !bgMusic.isPlaying() && getAudioContext().state === "running") {
                bgMusic.setLoop(true);
                bgMusic.play();
            }
        } else if (this.stage === 3 || this.stage === 4) {
            // Stage 3-4 (High School, Toilet): Play teen music
            if (bgMusic && bgMusic.isPlaying()) bgMusic.stop();
            if (teenMusic && !teenMusic.isPlaying() && getAudioContext().state === "running") {
                teenMusic.setLoop(true);
                teenMusic.play();
            }
        } else {
            // Other stages: Stop all music
            if (bgMusic && bgMusic.isPlaying()) bgMusic.stop();
            if (teenMusic && teenMusic.isPlaying()) teenMusic.stop();
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
                        this.stage = 9; // Move onto the tutorial screen.
                    }
                }
                break;

            case 1: {           // Stage 1: Bedroom
                if (!(this.play instanceof Stage)) this.play = new Stage();

                const moveRight = keyIsDown(68);
                const moveLeft = keyIsDown(65);
                walkingActive = moveRight || moveLeft;

                const prevWorldX = this.worldX;
                if (moveRight) this.worldX += this.player.speed;
                if (moveLeft) this.worldX -= this.player.speed;

                const sceneWidth = this.parallax.getSceneWidth();
                const maxWorldX = Math.max(0, sceneWidth - width / 2);
                this.worldX = constrain(this.worldX, 0, maxWorldX);

                const cameraX = this.worldX;
                this.player.x = cameraX + width / 2;

                const deltaX = this.worldX - prevWorldX;
                this.parallax.update(deltaX);
                this.parallax.draw(cameraX);

                this.player.updateAnimation(moveLeft, moveRight);
                this.player.draw(cameraX);
                this.parallax.drawFront();

                // Transition: Bedroom -> Living Room (go right)
                if (this.sceneCooldownFrames <= 0 && this.worldX >= maxWorldX - 5) {
                    this.stage = 2;
                    this.parallax.setStage(1, 1);
                    this.worldX = 0;
                    this.sceneCooldownFrames = 60;
                    console.log('Bedroom -> Living Room');
                }
                break;
            }

            case 2: {           // Stage 2: Living Room
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

                // Draw mum and dad - behind front layer
                if (this.minigameTriggerMum) {
                    const centerX = Math.max(sceneWidth * 0.5, width * 0.5);
                    this.minigameTriggerMum.x = centerX - 2100;
                    if (this.minigameTriggerDad) {
                        this.minigameTriggerDad.x = this.minigameTriggerMum.x + 150;
                    }
                    this.minigameTriggerMum.draw(cameraX);
                }
                if (this.minigameTriggerDad) {
                    this.minigameTriggerDad.draw(cameraX);
                }

                this.player.updateAnimation(!lockMovement && moveLeft, !lockMovement && moveRight);
                this.player.draw(cameraX);
                this.parallax.drawFront();

                // Transitions
                if (this.sceneCooldownFrames <= 0) {
                    if (this.worldX <= 10) {
                        // Living Room -> Bedroom (go left)
                        this.stage = 1;
                        this.parallax.setStage(1, 0);
                        const newSceneWidth = this.parallax.getSceneWidth();
                        this.worldX = Math.max(0, newSceneWidth - width / 2);
                        this.sceneCooldownFrames = 60;
                        console.log('Living Room -> Bedroom');
                    } else if (this.worldX >= maxWorldX - 5) {
                        // Living Room -> High School (go right)
                        this.stage = 3;
                        this.parallax.setStage(2, 0);
                        this.worldX = 0;
                        this.sceneCooldownFrames = 60;
                        this.player.setCharacterType('teen');
                        console.log('Living Room -> High School');
                    }
                }

                // Minigame collision and logic
                if (!this.minigameCompleted && this.minigameTriggerMum) {
                    if (this.minigameTriggerMum.hit(this.player)) {
                        if (this.minigameTriggerMum.actionType) {
                            Actions.run(this.minigameTriggerMum.actionType, this.minigameTriggerMum.actionId, this, this.minigameTriggerMum);
                        }
                    }
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

                break;
            }

            case 3: {           // Stage 3: High School
                if (!(this.play instanceof Stage)) this.play = new Stage();

                const moveRight = keyIsDown(68);
                const moveLeft = keyIsDown(65);
                walkingActive = moveRight || moveLeft;

                const prevWorldX = this.worldX;
                if (moveRight) this.worldX += this.player.speed;
                if (moveLeft) this.worldX -= this.player.speed;

                const sceneWidth = this.parallax.getSceneWidth();
                const maxWorldX = Math.max(0, sceneWidth - width / 2);
                this.worldX = constrain(this.worldX, 0, maxWorldX);

                const cameraX = this.worldX;
                this.player.x = cameraX + width / 2;

                const deltaX = this.worldX - prevWorldX;
                this.parallax.update(deltaX);
                this.parallax.draw(cameraX);

                this.player.updateAnimation(moveLeft, moveRight);
                this.player.draw(cameraX);
                this.parallax.drawFront();

                // Transitions
                if (this.sceneCooldownFrames <= 0) {
                    if (this.worldX <= 10) {
                        // High School -> Living Room (go left)
                        this.stage = 2;
                        this.parallax.setStage(1, 1);
                        const newSceneWidth = this.parallax.getSceneWidth();
                        this.worldX = Math.max(0, newSceneWidth - width / 2);
                        this.sceneCooldownFrames = 60;
                        this.player.setCharacterType('toddler');
                        console.log('High School -> Living Room');
                    } else if (this.worldX >= maxWorldX - 5) {
                        // High School -> Toilet (go right)
                        this.stage = 4;
                        this.parallax.setStage(2, 1);
                        this.worldX = 1398; // Spawn at door position
                        this.sceneCooldownFrames = 60;
                        console.log('High School -> Toilet');
                    }
                }
                break;
            }

            case 4: {           // Stage 4: Toilet
                if (!(this.play instanceof Stage)) this.play = new Stage();

                const moveRight = keyIsDown(68);
                const moveLeft = keyIsDown(65);
                walkingActive = moveRight || moveLeft;

                const prevWorldX = this.worldX;
                if (moveRight) this.worldX += this.player.speed;
                if (moveLeft) this.worldX -= this.player.speed;

                const sceneWidth = this.parallax.getSceneWidth();
                const maxWorldX = Math.max(0, sceneWidth - width / 2);
                // Allow negative worldX for toilet to walk further left
                this.worldX = constrain(this.worldX, -200, maxWorldX);

                const cameraX = this.worldX;
                this.player.x = cameraX + width / 2;

                const deltaX = this.worldX - prevWorldX;
                this.parallax.update(deltaX);
                this.parallax.draw(cameraX);

                this.player.updateAnimation(moveLeft, moveRight);
                this.player.draw(cameraX);
                this.parallax.drawFront();

                // Transition: Toilet -> High School (go right at door position)
                if (this.sceneCooldownFrames <= 0 && this.worldX >= 1390 && moveRight) {
                    this.stage = 3;
                    this.parallax.setStage(2, 0);
                    const newSceneWidth = this.parallax.getSceneWidth();
                    this.worldX = Math.max(0, newSceneWidth - width / 2);
                    this.sceneCooldownFrames = 60;
                    console.log('Toilet -> High School');
                }
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

            case 9: { // Tutorial page
                if (!(this.play instanceof Tutorial)) {
                    this.play = new Tutorial();
                    this.isTutorialStarted = 1; // true
                }
                this.play.show(this.introvert, this.extrovert);
                if (this.play.willMove) {
                    this.stage = 1;
                    this.parallax.setStage(1, 0);
                    this.worldX = 0;
                    this.play.willMove = false;
                    this.play.tutorialMode = 0;
                    this.play.smileStartTime = null;
                    this.isTutorialEnded = 1; // true

                    console.log('Tutorial -> Bedroom');
                }
                break;
            }
        }

        if (this.stage !== 0 && this.stage !== 8 && this.stage !== 9) {
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
        if (this.stage !== 9) {
            header.display(this.stage);
        }
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

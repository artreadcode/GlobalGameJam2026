class Game {
    constructor() {
        this.started = false; // Did the player start playing? 
        this.ended = false; // Did the player reach to the ending?

        this.parallax = new Parallax();
        
        this.player = new Player(width/4);
        this.camera = new Camera();
        this.worldX = 0;
        this.mirrorObstacle = new Obstacle(0, 100, 100, { sprite: mirrorSprite, actionId: null, actionType: null });
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

        
    }

    show() {
        background(this.bg);

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
                }
                if (this.next) {
                    this.after = this.after + 1; // The stage 1's next step is 2.
                    this.prev = this.prev + 1;
                    this.stage = 1; // Move onto the next stage.
                }
                break;

            case 1: {           //stage 1
                if (!this.play) this.play = new Stage();

                const moveRight = keyIsDown(68);
                const moveLeft = keyIsDown(65);
                const prevWorldX = this.worldX;
                if (moveRight) this.worldX += this.player.speed;
                if (moveLeft) this.worldX -= this.player.speed;

                const maxWorldX = Math.max(this.play.xMin, this.play.xMax - width / 2);
                this.worldX = constrain(this.worldX, this.play.xMin, maxWorldX);

                const cameraX = this.worldX;
                this.player.x = cameraX + width / 2;

                const deltaX = this.worldX - prevWorldX;
                this.parallax.update(deltaX);
                this.parallax.draw();
                if (blackScreenSprite) {
                    const wallW = width;
                    const wallH = height;
                    const wallX = this.play.xMax;
                    image(blackScreenSprite, wallX - cameraX, 0, wallW, wallH);
                }
                this.player.draw(cameraX);

                this.mirrorObstacle.x = this.play.xMax - 200;
                for (const obstacle of this.obstacles) {
                    obstacle.draw(cameraX);
                    if (obstacle.hit(this.player)) {
                        if (obstacle.actionType) {
                            Actions.run(obstacle.actionType, obstacle.actionId, this, obstacle);
                            break;
                        }
                    }
                }
            if (frameCount % 60 === 0) {
            console.log('worldX', this.worldX, 'camera', cameraX);
            }
                break;
            }
            case 2: {           //stage 2
                if (!this.play) this.play = new Stage();

                const moveRight = keyIsDown(68);
                const moveLeft = keyIsDown(65);
                const prevWorldX = this.worldX;
                if (moveRight) this.worldX += this.player.speed;
                if (moveLeft) this.worldX -= this.player.speed;

                const maxWorldX = Math.max(this.play.xMin, this.play.xMax - width / 2);
                this.worldX = constrain(this.worldX, this.play.xMin, maxWorldX);

                const cameraX = this.worldX;
                this.player.x = cameraX + width / 2;

                const deltaX = this.worldX - prevWorldX;
                this.parallax.update(deltaX);
                this.parallax.draw();
                this.player.draw(cameraX);
                break;
            }
            case 3: {           //stage 3
                if (!this.play) this.play = new Stage();

                const moveRight = keyIsDown(68);
                const moveLeft = keyIsDown(65);
                const prevWorldX = this.worldX;
                if (moveRight) this.worldX += this.player.speed;
                if (moveLeft) this.worldX -= this.player.speed;

                const maxWorldX = Math.max(this.play.xMin, this.play.xMax - width / 2);
                this.worldX = constrain(this.worldX, this.play.xMin, maxWorldX);

                const cameraX = this.worldX;
                this.player.x = cameraX + width / 2;

                const deltaX = this.worldX - prevWorldX;
                this.parallax.update(deltaX);
                this.parallax.draw();
                this.player.draw(cameraX);
                break;
            }
            case 4: {           //mirror transition scene/stage, the "inbetween" of each level
                if (!(this.play instanceof MirrorScreen)) {
                    this.play = new MirrorScreen();
                }
                this.player.update(this.play);
                this.play.show();
                this.player.draw(0);

                if (this.play.shouldExit(this.player)) {
                    const targetStage = this.returnStage ?? 1;
                    const targetX = this.returnX ?? width / 2;
                    this.stage = targetStage;
                    this.play = new Stage();
                    this.player.x = targetX;
                    this.camera.x = 0;
                }
                break;
            }
        }
    }
}

// Handle window resizing event so our game won't be seen weird.
// Ref: https://p5js.org/reference/p5/windowResized/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

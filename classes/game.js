class Game {
    constructor() {
        this.started = false; // Did the player start playing? 
        this.ended = false; // Did the player reach to the ending?

        this.player = new Player(width/4);
        this.camera = new Camera();
        this.obstacles = [ //X position, image size(x,y) ,name of sprite, actionId, actionType, refer to actions.JS
           //new Obstacle(2700,100,100, { sprite: mirrorSprite, actionId: '1', actionType: 'transition' }),
           new Obstacle(2700,100,100, { sprite: mirrorSprite, actionId: null, actionType: null }),
        ];
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

                    if (this.play.isFaceThere) {
                        this.stage = 5; // Move onto the tutorial screen.
                    }
                }
                if (this.next) {
                    this.after = this.after + 1; // The stage 1's next step is 2.
                    this.prev = this.prev + 1;
                    this.stage = 1; // Move onto the next stage.
                }
                break;

            case 1: {           //stage 1
                this.player.update(this.play);
                const cameraX = this.camera.update(this.play, this.player.x);
                
                if (frameCount % 60 === 0) {
                console.log('x=', this.player.x, 'xMax=', this.play?.xMax, 'cam=', cameraX);
  }
                this.player.draw(cameraX);

                for (const obstacle of this.obstacles) {
                    obstacle.draw(cameraX);
                    if (obstacle.hit(this.player)) {
                        if (obstacle.actionType) {
                            Actions.run(obstacle.actionType, obstacle.actionId, this, obstacle);
                            break;
                        }
                    }
                }
                break;
            }
            case 2: {           //stage 2
                this.player.update(this.play);
                const cameraX = this.camera.update(this.play, this.player.x);
                this.player.draw(cameraX);
                break;
            }
            case 3: {           //stage 3
                this.player.update(this.play);
                const cameraX = this.camera.update(this.play, this.player.x);
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
            case 5: { // Tutorial page
                let tutorial = new Tutorial();
                tutorial.show();
            }
        }
    }
}

// Handle window resizing event so our game won't be seen weird.
// Ref: https://p5js.org/reference/p5/windowResized/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

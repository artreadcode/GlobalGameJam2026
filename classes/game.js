class Game {
    constructor() {
        this.started = false; // Did the player start playing? 
        this.ended = false; // Did the player reach to the ending?

        /*
        this.w = windowWidth;
        this.h = windowHeight;
        */

        // For the current stage; Where are you?
        this.stage = 0;

        // To store what was the previous stage
        this.prev = -1;
        this.after = 1; // The next stage of a starting screen is 1.

        // Shall we move on? (Triggered from each scene)
        this.next = false;

        // For each play
        this.play;

        this.background = 0; // for now

        this.loop = 1;
    }

    show() {
        background(this.background);
        // console.log('Game is on loop. - Playing');

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

            case 1: // Stage 01
            // Same structure will happen here...
            case 2: // Stage 02
            case 3: // Stage 03
            case 4: // Ending scene
        }
    }
}

// Handle window resizing event so our game won't be seen weird.
// Ref: https://p5js.org/reference/p5/windowResized/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
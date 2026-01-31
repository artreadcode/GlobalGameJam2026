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
        this.prev = 0;

        // Shall we move on? (Triggered from each scene)
        this.next = false;

        // For each play
        this.play;

        this.background = 0;
    }

    show() {

        background(this.background);
        switch (this.scene) {
            case 0: // Start screen
                if (!this.started) {
                    this.started = true;
                    this.play = new Stage();
                }
                else {
                    this.play.show();
                }

                if (this.next) {
                    this.scene = 1; // Move onto the next stage.
                    
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
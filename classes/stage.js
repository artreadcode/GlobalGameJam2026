class Stage {
    constructor() {
        this.background = 100;
        // this.background = Background() => For now, I left it in comment.

        this.whichStage = 0 // default
        // 0: start screen
        // 1: stage 1
        // 2: stage 2
        // 3: stage 3
        // 4: ending

        this.started = true; // It starts from the start screen.
        this.ended = false;
    }

    play() {
        // image(this.background, 0, 0);
        background(this.background); // for now
    }
}
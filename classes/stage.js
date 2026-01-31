class Stage {
    constructor() {
        this.bg = 0;
        // this.background = Background() => For now, I left it in comment.
        this.xMin = 0;
        this.xMax = Math.max(3000, width * 3);
        this.whichStage = 0 // default
        // 0: start screen
        // 1: stage 1
        // 2: stage 2
        // 3: stage 3
        // 4: ending

        this.started = true; // It starts from the start screen.
        this.ended = false;

        this.moved = false;

        this.indicator = 1; // for debugging, console.log()
        this.alarm = [
            "Now you're in the starting screen.",
            "Now you're in the stage 1.",
            "Now you're in the stage 2.",
            "Now you're in the stage 3.",
            "What will the ending be?"
        ];
    } 

    play() {
        if (this.indicator) {
            console.log(this.alarm[this.whichStage]);
            this.indicator = 0;
        }

        if (this.moved) {
            this.whichStage++;
        }
        // image(this.background, 0, 0);
        // background(this.background); // for now
    }
}

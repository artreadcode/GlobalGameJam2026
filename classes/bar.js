class Bar {
    constructor() {
        // this.bgPATH = 'assets/tutorial_emptyBar.png';
        this.bg = tutorialbarImg;

        this.tx = windowWidth / 2 - this.bg.width * 0.5 / 2;
        this.ty = windowHeight / 4 * 3 + this.bg.height * 0.5;
        this.tw = this.bg.width * 0.5;
        this.th = this.bg.height * 0.5;
    }

    show(whichScene, eI, eE) {
        rectMode(CENTER);

        if (whichScene === 'tutorial') {
            let eEBar = image(this.bg, this.tx, this.ty + this.th, this.tw, this.th);
            let eIBar = image(this.bg, this.tx, this.ty, this.tw, this.th);

            // console.log(eE, eI);

            fill(0);

            rectMode(CORNER);
            // Introvert bar
            rect(this.tx, this.ty, this.tw / 1.7 + eI * 100, this.th - 0.3);

            // Extrovert bar
            rect(this.tx, this.ty + this.th, this.tw / 1.7 + eE * 100, this.th - 0.3);
        }
    }
}
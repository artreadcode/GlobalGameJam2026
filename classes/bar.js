class Bar {
    constructor() {
        // this.bgPATH = 'assets/tutorial_emptyBar.png';
        this.bg = tutorialbarImg;

        this.tx = windowWidth / 2 - this.bg.width * 0.5 / 2;
        this.ty = windowHeight / 4 * 3 + this.bg.height * 0.5;
        this.tw = this.bg.width * 0.5;
        this.th = this.bg.height * 0.5;
    }

    show(whichScene, eE, eI) {
        rectMode(CENTER);

        if (whichScene === 'tutorial') {
            image(this.bg, this.tx, this.ty, this.tw, this.th);

            console.log(eE, eI);
            
            fill(0);
            rect(100, 100, 30, 50);

        }
    }
}
class startScreen extends Stage {

    constructor() {
        super();
        this.bg = 255;

        // Create jiggle text objects (black color)
        this.titleText = new JiggleText("non-Duchenne", windowWidth / 2, windowHeight / 2, min(windowWidth, windowHeight) * 0.05, {
            color: 0
        });

        this.subtitleText = new JiggleText("Smile to start the game.", windowWidth / 2, windowHeight / 2 + 110, min(windowWidth, windowHeight) * 0.02, {
            color: 0,
            jiggleX: 1,
            jiggleY: 1,
            jiggleRot: 0.03
        });
    }

    show() {
        background(this.bg);
        textAlign(CENTER, CENTER);
        // text(gameTitle, windowWidth / 2, windowHeight / 2 - min(windowWidth, windowHeight) * 0.06);

        // Update positions and sizes in case of window resize
        this.titleText.setPosition(windowWidth / 2, windowHeight / 2);
        this.titleText.size = min(windowWidth, windowHeight) * 0.05;

        this.subtitleText.setPosition(windowWidth / 2, windowHeight / 2 + 50);
        this.subtitleText.size = min(windowWidth, windowHeight) * 0.02;

        // Show jiggle texts
        this.titleText.show();
        this.subtitleText.show();
    }
}

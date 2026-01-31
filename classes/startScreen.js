class startScreen extends Stage {

    constructor() {
        super();
        this.bg = 255;

        // Create jiggle text objects (black color)
        this.titleText = new JiggleText("non-Duchenne", width / 4, height / 2, min(width, height) * 0.05, {
            color: 0
        });
        this.subtitleText = new JiggleText("Smile to start the game.", width / 4, height / 2 + 110, min(width, height) * 0.02, {
            color: 0,
            jiggleX: 1,
            jiggleY: 1,
            jiggleRot: 0.03
        });
    }

    show() {
        background(this.bg);
        // textAlign(CENTER, CENTER);
        // text(gameTitle, windowWidth / 2, windowHeight / 2 - min(windowWidth, windowHeight) * 0.06);

        // Update positions and sizes in case of window resize
        this.titleText.setPosition(width / 4, height / 2);
        this.titleText.size = min(width, height) * 0.05;

        this.subtitleText.setPosition(width / 4, height / 2 + 110);
        this.subtitleText.size = min(width, height) * 0.02;

        // Show jiggle texts
        this.titleText.show();
        this.subtitleText.show();
    }
}

class startScreen extends Stage {

    constructor() {
        super();
        this.bg = 255;
        
        // this.backgroundPATH = {filePATH};
        // this.background = 
    }

    show() {
        let gameTitle = 'non-Duchenne';
        let gamesubTitle = 'Smile to start the game.';

        background(this.bg);

        textSize(min(windowWidth, windowHeight) * 0.05 );
        text(gameTitle, windowWidth / 4, windowHeight / 2);
        textSize(min(windowWidth, windowHeight) * 0.02);
        text(gamesubTitle, windowWidth / 4, windowHeight / 2 + 110);
    }
}
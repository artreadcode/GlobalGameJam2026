class startScreen extends Stage {

    constructor() {
        super();
        
        // this.backgroundPATH = {filePATH};
        // this.background = 
    }

    show() {
        gameTitle = 'non-Duchenne';
        gamesubTitle = 'Smile to start the game.'

        textSize(200);
        text(gameTitle, windowWidth / 2, windowHeight / 2);
    }
}
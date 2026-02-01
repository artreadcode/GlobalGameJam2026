class Bar {
    constructor() {
        // this.bgPATH = 'assets/tutorial_emptyBar.png';
        this.bg = tutorialbarImg;

        this.intro = tutorialIImg;
        this.extro = tutorialEImg;

        // Actual displayed width and height of the bar image
        this.tw = this.bg.width * 0.5;
        this.th = this.bg.height * 0.5;

        // X and Y position (Top-Left corner)
        this.tx = windowWidth / 2 - this.tw / 2; 
        
        // I adjusted this slightly to ensure it stays on screen
        this.ty = windowHeight / 4 * 3; 
    }

    show(whichScene, eI, eE) {
        
        // 1. Draw the Background Images
        // We generally draw images from CORNER to align them easily with rects
        imageMode(CORNER); 
        
        if (whichScene === 'tutorial') {
            
            image(this.intro, this.tx - this.tw * 0.30, this.ty, this.intro.width * 0.5, this.intro.height * 0.5);
            image(this.extro, this.tx - this.tw * 0.32, this.ty + this.th + 8, this.extro.width * 0.5, this.extro.height * 0.5);

            // Draw Introvert Background (Top)
            image(this.bg, this.tx, this.ty, this.tw, this.th);
            
            // Draw Extrovert Background (Bottom)
            image(this.bg, this.tx, this.ty + this.th + 10, this.tw, this.th); // +10 for a little gap

            // 2. Calculate Bar Dimensions
            // Assuming the bar should start a bit inside the image (padding)
            let paddingX = 3; 
            let paddingY = 1;
            
            // The maximum width the colored bar can grow
            let maxBarWidth = this.tw - (paddingX); 
            let barHeight = this.th

            // 3. Draw the Colored Fills
            noStroke();
            fill(0);
            rectMode(CORNER);

            // -- Introvert Bar (Top) --
            // If eI is 0.5, width is 50% of maxBarWidth. If 1.0, it is 100%.
            rect(this.tx + paddingX * 0.2, this.ty, maxBarWidth * eI, barHeight);

            // -- Extrovert Bar (Bottom) --
            rect(this.tx + paddingX * 0.2, this.ty + this.th + 10, maxBarWidth * eE, barHeight - paddingY * 2 );
            
        }
    }
}
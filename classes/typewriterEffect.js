class TypewriterEffect {
    constructor(fullText, x, y, size, options = {}) {

        //store text
        //store position (x,y)
        //store speed option (ms per char)
        this.speed = options.speed || 50; 
        this.lastUpdateTime = millis(); 
        this.fullText = fullText;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = options.color || 0; //default black
        this.align = options.align || LEFT;
        this.currentIndex = 0;
        this.displayedText = "";
       // this.typewriterMessage = new TypewriterEffect(" ", 200,300,24,{speed:50, color:0}); 
    }

    // Update the text content (and restart typing)
    setText(newText) {
        this.fullText = newText;
        this.currentIndex = 0;
        this.displayedText = "";
        this.lastUpdateTime = millis();
    }

    // Update position (for window resizing)
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    update(){
        const currentTime = millis();
        //check if enocugh time has passed to add next char
        if (this.currentIndex >= this.fullText.length){
            return;
        }

        if(currentTime - this.lastUpdateTime >= this.speed){
            //add next char
            this.displayedText += this.fullText[this.currentIndex];

            //increment current index
            this.currentIndex++;

            //reset timer
            this.lastUpdateTime = currentTime;
        }

    }

    draw(){
            //use p5 text() to draw displayedText at (x,y)
            push(); //save current drawing state
            textFont(schoolbellFont);  
            textSize(this.size);
            textAlign(this.align, TOP);
            fill(this.color);

            //draw the text
            text(this.displayedText, this.x, this.y);

            pop(); //restores settings
    }

    show(){
            //call update andthen draw
            //this.titleText.update();
            //this.typewriterMessage.show();

            this.update();
            this.draw();

    }

}



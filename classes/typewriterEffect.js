

//get a div reference
const div = document.querySelector(".text");
const text = " ";

//textTypingEffect(div,text,0);

function textTypingEffect(div, text, i=0){
    div.textContent += text[i];

    if (i < text.length) {
        setTimeout(()=> textTypingEffect(div, text, i+1), 50);
    }

}


class TypewriterEffect {
    constructor(fullText, x, y, size, options = {}) {

        //store text
        //store position (x,y)
        //store speed option (ms per char)
        this.speed = 50; 
        this.lastUpdateTime = millis(); 
        this.fullText = fullText;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = options.color || 0; //default black
        this.currentIndex = 0;
        this.displayedText = "";
       // this.typewriterMessage = new TypewriterEffect(" ", 200,300,24,{speed:50, color:0}); 
    }

    update(){
        const currentTime = millis();
        //check if enocugh time has passed to add next char
        if (currentTime - this.lastUpdateTime >= this.speed) {
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
            textSize(this.size);
            textAlign(LEFT, TOP);
            fill(this.color);

            //draw the text
            text(this.displayedText, this.x, this.y);

            pop(); //restores settings
    }

    show(){
            //call update andthen draw
            this.titleText.update();
            this.typewriterMessage.show();

    }

}



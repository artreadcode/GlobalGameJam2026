class dialogueBox{
    constructor(text, characterName = " ", options = {}){

        //dimensions (relative to widndow size)
        this.h = options.height || windowHeight*0.2;
        this.w = options.width || windowWidth*0.5;
        this.padding = options.padding || 20;

        //position rel to window size
        this.x = windowWidth/2 - this.w/2;
        this.y = windowHeight - this.h -windowHeight*0.08;
       
        //box style 
        this.bgColor = options.bgColor || color(255, 255, 255);
        this.strokeColor = options.strokeColor || [0];
        this.strokeWeight = options.strokeWeight || 2;

        //text content
        this.textSize = options.textSize || 24;
        this.lineHeight = options.textSize *1.4;
        this.textColor = options.textColor || color(0);

        //word wrap
        this.wrappedText = this.wrapText(text);
         
        //typewriter effect
        this.typewriter = new TypewriterEffect(
            this.wrappedText,
            this.x + this.padding,
            this.y + this.padding,
            this.textSize,
            {
                color: this.textColor,
                speed: 30,
                align: LEFT, 
                sound: options.sound 
            }
        );

        //character name tag
        this.characterName = characterName;
        this.showNameTag = characterName.trim().length > 0;

        this.nameTagHeight = 40;
        this.nameTagWidth = Math.max(150, textWidth(characterName) + 40);
        this.nameTagX = this.x;
        this.nameTagY = this.y - this.nameTagHeight;
        this.nameTagBg = options.nameTagBg || color(0);
        this.nameTagTextColor = options.nameTagTextColor || color(255);
        this.nameTagTextSize = options.nameTagTextSize || 20;


    }


    //wrap text 
    wrapText(text){
        push();
        textSize(this.textSize);
        let words = text.split(' ');
        let lines = [];
        let currentLine = '';
        let maxWidth = this.w - 2 * this.padding;

        for (let word of words){
            let testLine = currentLine + word + ' ';
            if (textWidth(testLine) > maxWidth && currentLine.length > 0){
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        }

        // Add the last line if there's any content left
        if (currentLine.length > 0){
            lines.push(currentLine.trim());
        }

        pop();
        return lines.join('\n');
    }

    //update position on window resize
    updatePosition(){
        this.x = windowWidth/2 - this.w/2;
        this.y = windowHeight - this.h -windowHeight*0.08;
        this.typewriter.setPosition(this.x + this.padding, this.y + this.padding);

        //update name tag position
        this.nameTagX = this.x;
        this.nameTagY = this.y - this.nameTagHeight;
    }

    //check if typewriting effect is done
    isComplete(){
        return this.typewriter.currentIndex >= this.typewriter.fullText.length;
    }

    //set new text and restart typewriter
    setText(newText){
        this.wrappedText = this.wrapText(newText);
        this.typewriter.setText(this.wrappedText);
    }

    //skip to end immediately
    skipToEnd(){
        this.typewriter.currentIndex = this.typewriter.fullText.length;
        this.typewriter.displayedText = this.typewriter.fullText;

        this.typewriter.stop();
    }

    draw(){

        rectMode(CORNER);
        push();

        //draw name tag container
        if(this.showNameTag){
            fill(this.nameTagBg);
            stroke(0);
            strokeWeight(2);
            rect(this.nameTagX, this.nameTagY, this.nameTagWidth, this.nameTagHeight);
            
        
        //draw name tag text
            noStroke();
            fill(this.nameTagTextColor);
            textSize(this.nameTagTextSize);
            textAlign(CENTER, CENTER);
            textFont(schoolbellFont);
            text(this.characterName,
                this.nameTagX + this.nameTagWidth/2,
                this.nameTagY + this.nameTagHeight/2);

        }

        //draw box
        fill(this.bgColor);
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeight);
        rect(this.x, this.y, this.w, this.h);

        //draw text with typewriter effect
        noStroke();
        this.typewriter.update();
        this.typewriter.draw();

        pop();
    }

    show(){
        this.draw();
    }
}
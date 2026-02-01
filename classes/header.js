class Header {
  constructor() {
    this.targetY = windowHeight * 0.1;
    this.y = windowHeight + 500;
    this.easing = 0.15;
    this.showOverlay = false;
    this.currentType = "about"; 

    this.scrollY = 0;
    this.maxScroll = 0;

    // ============================================================
    //  CONFIGURATION
    // ============================================================
    this.layout = {
        help: {
            width: 0.7,        
            height: 0.9,       
            allowScroll: true, 
            // imageHeight is no longer strictly needed for scaling, 
            // but we keep it in case you want to force a limit later.
            bg: null           
        },
        about: {
            width: 0.7,         
            height: 0.9,       
            allowScroll: true, 
            bg: null            
        }
    };

    this.content = {
      help: { 
        h: "Help", 
        p: "The goal of this game is to adapt to different situations by smiling or hiding.\n\nWe’re using your webcam to detect your expressions. If you prefer, you can disable the camera and use your keyboard instead. Just switch modes at the start screen.",
        p2: "Walk",
        p4: "Smile",
        p6: "Hide",
        p3: "Use your A and D keys to move forward or backwards.",
        p5: "Smile to increase your extroversion energy.",
        p7: "Cover your mouth to increase your introversion energy.",
      },
      about: { 
        h: "About", 
        p: "This is a game created by creative humans in 48h for the GGJ26.\n\nA non-Duchenne smile is a scientific term for a fake smile. We sometimes are forced to wear a mask of a non-Duchenne smile in order to participate in society. We wanted to make this game to reflect on the importance of balance. Thank you and have fun!",
        h2: "Credits",
        p2: "Bam - UX | Grace - artist | Pearl - developer\nPan - music | Astryd - developer | Jake - developer | Ceci - UX"
      }
    };
    
    // IMAGE VARIABLES
    this.helpImg1 = help01; 
    this.helpImg2 = help02; 
    this.helpImg3 = help03; 
    this.helpImg4 = help04; 

    this.updateButtonBounds();
  }

  handleScroll(delta) {
    if (this.layout[this.currentType].allowScroll === false) return;
    if (this.maxScroll > 0) {
        this.scrollY -= delta; 
        this.scrollY = constrain(this.scrollY, -this.maxScroll, 0);
    }
  }

  updateButtonBounds() {
    this.layout.help.bg = longPaper;
    this.layout.about.bg = longPaper;

    // Update image references
    this.helpImg1 = help01; 
    this.helpImg2 = help02; 
    this.helpImg3 = help03; 
    this.helpImg4 = help04; 

    let currentSettings = this.layout[this.currentType];
    this.overlayW = windowWidth * currentSettings.width;
    this.overlayH = windowHeight * currentSettings.height;
    
    this.startY = windowHeight + 500;
    
    this.aboutX = aboutBtn.width * 0.3 / 2;
    this.btnY = aboutBtn.height * 0.3; 
    this.aboutW = aboutBtn.width * 0.5;
    this.aboutH = aboutBtn.height * 0.5;

    this.helpX = this.aboutX + aboutBtn.width * 0.6;
    this.helpW = helpBtn.width * 0.5;
    this.helpH = helpBtn.height * 0.5;

    this.closeW = 50; 
    this.closeH = 50;
    this.paperX = windowWidth / 2 - this.overlayW / 2;
    this.closeX = this.paperX + this.overlayW - (this.closeW + 20); 
    this.closeY = this.y + 20; 
  }

  update() {
    let goal = this.showOverlay ? this.targetY : this.startY;
    this.y += (goal - this.y) * this.easing;
  }

  display(stage) {
    if (stage === undefined) stage = 0;

    this.update();
    this.updateButtonBounds(); 

    push();
    imageMode(CORNER);
    noTint();

    if (stage === 5) { /* Nothing */ } 
    else if (stage === 0) {
        image(aboutBtn, this.aboutX, this.btnY, this.aboutW, this.aboutH);
        image(helpBtn, this.helpX, this.btnY, this.helpW, this.helpH);
    } 
    else {
        image(helpBtn, this.aboutX, this.btnY, this.helpW, this.helpH);
    }
    pop();

    if (this.y < windowHeight) { 
      push();
      
      let bgAlpha = map(this.y, this.startY, this.targetY, 0, 150, true);
      fill(0, bgAlpha); 
      rect(0, 0, windowWidth, windowHeight);
      
      translate(this.paperX, this.y); 
      
      let bgImage = this.layout[this.currentType].bg;
      image(bgImage, 0, 0, this.overlayW, this.overlayH);
      image(closeBtn, this.overlayW - (this.closeW + 20), 20, this.closeW, this.closeH);
      
      fill(50);
      textAlign(CENTER, TOP); 
      
      if (this.currentType !== "") {
        let textCenterX = this.overlayW / 2;
        let wrapWidth = this.overlayW * 0.8;
        let boxX = textCenterX - (wrapWidth / 2);
        
        let headingS = min(windowWidth, windowHeight) * 0.055;
        let paraS = min(windowWidth, windowHeight) * 0.04;
        textLeading(paraS * 1.2); 

        let contentTopMargin = this.overlayH * 0.15; 
        let viewHeight = this.overlayH * 0.85; 

        // Clip
        let ctx = drawingContext;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, contentTopMargin, this.overlayW, viewHeight);
        ctx.clip();

        push();
        translate(0, this.scrollY);

        let cursorY = contentTopMargin; 

        // --- DRAWING LOGIC ---

        if (this.currentType === 'help') {
            // 1. HELP TITLE
            textSize(headingS);
            textAlign(CENTER);
            text(this.content.help.h, textCenterX, cursorY);
            cursorY += headingS * 1.5;

            // 2. INTRO PARAGRAPH
            textSize(paraS);
            textAlign(LEFT);
            text(this.content.help.p, boxX, cursorY, wrapWidth);
            cursorY += this.getTextHeight(this.content.help.p, wrapWidth, paraS) + 20;

            // 3. IMAGE 1 (Intro)
            if (this.helpImg1) {
                // CHANGED: We now pass the full 'wrapWidth' instead of multiplying by 0.3.
                // The new function handles the sizing automatically.
                let imgH = this.drawImageCentered(this.helpImg1, boxX, cursorY, wrapWidth);
                cursorY += imgH + 30;
            }

            // 4. SECTIONS WITH LINES
            cursorY = this.drawSectionWithLines("Walk", this.content.help.p3, this.helpImg2, cursorY, headingS, paraS, boxX, wrapWidth, textCenterX);
            cursorY = this.drawSectionWithLines("Smile", this.content.help.p5, this.helpImg3, cursorY, headingS, paraS, boxX, wrapWidth, textCenterX);
            cursorY = this.drawSectionWithLines("Hide", this.content.help.p7, this.helpImg4, cursorY, headingS, paraS, boxX, wrapWidth, textCenterX);
        
        } else {
            // ABOUT PAGE LOGIC
            textSize(headingS);
            textAlign(CENTER);
            text(this.content.about.h, textCenterX, cursorY);
            cursorY += headingS * 1.5;

            textSize(paraS);
            text(this.content.about.p, boxX, cursorY, wrapWidth);
            cursorY += this.getTextHeight(this.content.about.p, wrapWidth, paraS) + 30;

            textSize(headingS);
            text(this.content.about.h2, textCenterX, cursorY);
            cursorY += headingS * 1.5;

            textSize(paraS);
            text(this.content.about.p2, boxX, cursorY, wrapWidth);
            cursorY += this.getTextHeight(this.content.about.p2, wrapWidth, paraS) + 50;
        }

        // --- SCROLL CALCULATION ---
        let totalContentHeight = cursorY - contentTopMargin;
        if (this.layout[this.currentType].allowScroll) {
            if (totalContentHeight > viewHeight) {
                this.maxScroll = totalContentHeight - viewHeight;
            } else {
                this.maxScroll = 0;
            }
        } else {
            this.maxScroll = 0;
        }

        pop(); 
        ctx.restore(); 

        if (this.maxScroll > 0) {
            let barH = map(viewHeight, 0, totalContentHeight, 0, viewHeight);
            let barY = map(-this.scrollY, 0, this.maxScroll, contentTopMargin, contentTopMargin + viewHeight - barH);
            fill(0, 50);
            noStroke();
            rect(this.overlayW - 15, barY, 4, barH, 10);
        }
      }
      pop();
    }
  }

  // --- UPDATED FUNCTION: Uses Natural Image Size ---
  drawImageCentered(img, containerX, y, containerW) {
      // 1. Start with Actual Image Dimensions
      let finalW = img.width;
      let finalH = img.height;

      // 2. Check if the image is wider than the text area
      if (finalW > containerW) {
          // It's too big! Scale it down to fit the container.
          let scale = containerW / finalW;
          finalW = containerW;
          finalH = finalH * scale; // Keep aspect ratio
      }

      // 3. Center it
      let centerX = containerX + (containerW - finalW) / 2;

      // 4. Draw
      image(img, centerX, y, finalW, finalH);
      
      return finalH; 
  }

  drawSectionWithLines(headerText, bodyText, img, y, hSize, pSize, x, w, cx) {
      textAlign(CENTER);
      textSize(hSize * 0.8);
      fill(50);
      text(headerText, cx, y);

      let tw = textWidth(headerText);
      let linePad = 15; 
      let lineY = y + (hSize * 0.8) / 2; 
      
      stroke(50);
      strokeWeight(2);
      line(x, lineY, cx - tw/2 - linePad, lineY);
      line(cx + tw/2 + linePad, lineY, x + w, lineY);
      noStroke();

      y += hSize * 1.2;

      textAlign(LEFT);
      textSize(pSize);
      text(bodyText, x, y, w);
      y += this.getTextHeight(bodyText, w, pSize) + 20;

      if (img) {
          // Pass the full width (w) so the image can be its real size if possible
          let imgH = this.drawImageCentered(img, x, y, w);
          y += imgH + 30; 
      }

      return y; 
  }

  getTextHeight(str, wrapW, size) {
    textSize(size);
    let paragraphs = str.split('\n');
    let lineCount = 0;
    for (let p of paragraphs) {
        if (p === "") { lineCount++; continue; }
        let words = p.split(' ');
        let currentLine = "";
        for(let i=0; i<words.length; i++) {
            let testLine = currentLine + words[i] + ' ';
            if (textWidth(testLine) > wrapW) {
                lineCount++;
                currentLine = words[i] + ' ';
            } else {
                currentLine = testLine;
            }
        }
        lineCount++;
    }
    return lineCount * (size * 1.2);
  }

  clicked(mx, my, stage) {
    if (stage === undefined) stage = 0;
    this.updateButtonBounds(); 

    if (this.showOverlay) {
      if (mx > this.closeX && mx < this.closeX + this.closeW &&
          my > this.closeY && my < this.closeY + this.closeH) {
        this.showOverlay = false;
        return true; 
      }
      return true; 
    }

    if (stage === 5) return false;

    if (stage === 0) {
        if (mx > this.aboutX && mx < this.aboutX + this.aboutW &&
            my > this.btnY && my < this.btnY + this.aboutH) {
          this.toggleOverlay("about");
          return true; 
        }
        if (mx > this.helpX && mx < this.helpX + this.helpW &&
            my > this.btnY && my < this.btnY + this.helpH) {
          this.toggleOverlay("help");
          return true;
        }
    } 
    else {
        if (mx > this.aboutX && mx < this.aboutX + this.aboutW &&
            my > this.btnY && my < this.btnY + this.aboutH) {
          this.toggleOverlay("help"); 
          return true; 
        }
    }
    return false;
  }

  toggleOverlay(type) {
    this.currentType = type;
    this.showOverlay = true;
    this.scrollY = 0; 
  }
}
class Header {
  constructor() {
    this.targetY = windowHeight * 0.1; 
    this.y = windowHeight + 500; 
    this.easing = 0.15; 
    this.showOverlay = false;
    this.currentType = ""; 
    
    this.content = {
      help: { 
        h: "Help", 
        p: "We using webcam to do face detection, if you don’t want to do that you can use keyboard input instead",
        h2: "Interaction",
        p2: "Walk: Use your A and D keys to move forward or backwards\nSmile: Smile and cover your mouth to at your webcam or press Q and E to keep your social and peace levels"
      },
      about: { 
        h: "About", 
        p: "This is a game created by creative humans in 48h for the GGJ26.\n\nA non-Duchenne smile is a scientific term for a fake smile. We sometimes are forced to wear a mask of a non-Duchenne smile in order to participate in society. We wanted to make this game to reflect on the importance of balance. We hope anyone playing this game can relate and have a better balance in their social life. Thank you and have fun!",
        h2: "Credits",
        p2: "Bam - UX | Grace - artist | Pearl - developer\nPan - music | Astryd - developer | Jake - developer | Ceci - UX"
      }
    };

    // Run this once to set initial positions
    this.updateButtonBounds();
  }

  updateButtonBounds() {
    this.overlayW = windowWidth * 0.7;
    this.overlayH = windowHeight * 0.85;
    this.startY = windowHeight + 500;
    
    // Position A (Left Side)
    this.aboutX = aboutBtn.width * 0.3 / 2;
    this.btnY = aboutBtn.height * 0.3; 
    this.aboutW = aboutBtn.width * 0.5;
    this.aboutH = aboutBtn.height * 0.5;

    // Position B (Right Side)
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
    // Safety: If stage is undefined (not passed), assume it is Stage 0 (Start Screen)
    if (stage === undefined) stage = 0;

    this.update();
    this.updateButtonBounds();

    push();
    imageMode(CORNER);
    noTint(); // Force buttons to be fully visible (fixes invisible button issue)

    // --- BUTTON VISIBILITY RULES ---

    if (stage === 5) {
        // RULE 1: STAGE 5 -> Show NOTHING.
        // (Do not draw any buttons)
    } 
    else if (stage === 0) {
        // RULE 2: STAGE 0 -> Show BOTH buttons.
        // About on Left
        image(aboutBtn, this.aboutX, this.btnY, this.aboutW, this.aboutH);
        // Help on Right
        image(helpBtn, this.helpX, this.btnY, this.helpW, this.helpH);
    } 
    else {
        // RULE 3: STAGES 1-4 -> Show ONLY Help, at About Position.
        // We draw the Help Button image, but we use 'this.aboutX' coordinates.
        image(helpBtn, this.aboutX, this.btnY, this.helpW, this.helpH);
    }
    pop();

    // --- OVERLAY DRAWER ---
    if (this.y < windowHeight) { 
      push();
      // Background Fade
      let bgAlpha = map(this.y, this.startY, this.targetY, 0, 150, true);
      fill(0, bgAlpha); 
      rect(0, 0, windowWidth, windowHeight);
      
      translate(this.paperX, this.y); 
      image(paper, 0, 0, this.overlayW, this.overlayH);
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

        // Title & Description
        let section1Y = this.overlayH * 0.075;
        textSize(headingS);
        text(this.content[this.currentType].h, textCenterX, section1Y);
        textSize(paraS);
        text(this.content[this.currentType].p, boxX, section1Y + headingS * 1.4, wrapWidth);

        // Sub-content (Credits or Controls)
        let spacing = (this.currentType === "about") ? 10 : 4;
        let midPoint = section1Y + (headingS * 1.5) + (paraS * spacing);
        
        textSize(headingS);
        text(this.content[this.currentType].h2, textCenterX, midPoint);
        textSize(paraS);
        text(this.content[this.currentType].p2, boxX, midPoint + (headingS * 1.4), wrapWidth);
      }
      pop();
    }
  }

  clicked(mx, my, stage) {
    // Safety: Default to 0 if undefined
    if (stage === undefined) stage = 0;
    
    this.updateButtonBounds(); 

    // 1. Overlay Interaction
    if (this.showOverlay) {
      if (mx > this.closeX && mx < this.closeX + this.closeW &&
          my > this.closeY && my < this.closeY + this.closeH) {
        this.showOverlay = false;
        return true; 
      }
      return true; // Block clicks
    }

    // 2. Stage 5: No Interaction
    if (stage === 5) return false;

    // 3. Stage 0: Check Both Buttons
    if (stage === 0) {
        // Check About (Left)
        if (mx > this.aboutX && mx < this.aboutX + this.aboutW &&
            my > this.btnY && my < this.btnY + this.aboutH) {
          this.toggleOverlay("about");
          return true; 
        }
        // Check Help (Right)
        if (mx > this.helpX && mx < this.helpX + this.helpW &&
            my > this.btnY && my < this.btnY + this.helpH) {
          this.toggleOverlay("help");
          return true;
        }
    } 
    
    // 4. Other Stages: Check Help (at Left position)
    else {
        // The Help button is visually at 'aboutX', so we check 'aboutX' for clicks
        if (mx > this.aboutX && mx < this.aboutX + this.aboutW &&
            my > this.btnY && my < this.btnY + this.aboutH) {
          this.toggleOverlay("help"); // Open Help overlay
          return true; 
        }
    }
    return false;
  }

  toggleOverlay(type) {
    this.currentType = type;
    this.showOverlay = true;
  }
}
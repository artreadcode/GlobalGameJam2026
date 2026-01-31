class startScreen extends Stage {
    constructor() {
        super();
        // Set to -1 initially so it forces the logic to run on the very first frame
        this.lastMode = -1; 
        this.bg = 255;
        this.isFaceThere = false;

        this.infos = [
            "Smile to start the game.",
            "Press 'E' to start the game." 
        ];

        // Create jiggle text objects (black color)
        this.titleText = new JiggleText("non-Duchenne", windowWidth / 2, windowHeight / 2, min(windowWidth, windowHeight) * 0.05, {
            color: 0
        });

        // Initialize subtitle (will be updated in show() loop anyway)
        this.subtitleText = new JiggleText(this.infos[0], windowWidth / 2, windowHeight / 2 + 110, min(windowWidth, windowHeight) * 0.02, {
            color: 150,
            jiggleX: 1,
            jiggleY: 1,
            jiggleRot: 0.03
        });

        // Properties
        this.tooltipMSG = "This game uses webcam face detection without storing data. If you’re not comfortable with this, you can choose keyboard mode.";
        this.tooltipW = 32;
        this.tooltipH = 32;
        this.tooltipOffset = min(windowWidth, windowHeight) * 0.01; 
    }

    modeChanging(mX, mY) {
        let modeW = cameraMode.width * 0.3;
        let modeH = cameraMode.height * 0.3;
        let rectX = windowWidth - modeW * 4.5;
        let rectY = modeH - modeH * 0.2;
        let rectW = modeW * 2;
        let rectH = modeH * 1.4;

        // Check if mouse is inside the toggle background rectangle
        if (mX > rectX && mX < rectX + rectW && mY > rectY && mY < rectY + rectH) {
            // Toggle global gameMode variable
            if (gameMode === 0) {
                gameMode = 1;
            } else if (gameMode === 1) {
                gameMode = 0;
            }
        }
    }

    show() {
        background(this.bg);
        textAlign(CENTER, CENTER);

        // Update positions and sizes in case of window resize
        this.titleText.setPosition(windowWidth / 2, windowHeight / 2);
        this.titleText.size = min(windowWidth, windowHeight) * 0.1;

        this.subtitleText.setPosition(windowWidth / 2, windowHeight / 2 + windowHeight * 0.08);
        this.subtitleText.size = min(windowWidth, windowHeight) * 0.045;

        // Show jiggle texts
        this.titleText.show();
        this.subtitleText.show();

        // --- TOOLTIP LOGIC ---
        
        // 1. Calculate positioning based on subtitle
        // Use push/pop here to ensure textWidth doesn't mess up other things
        push(); 
        textSize(this.subtitleText.size);
        let subtitleWidth = textWidth(this.subtitleText.text);
        pop();

        let isNarrow = windowWidth < 600; 
        let tooltipX, tooltipY;
        
        if (isNarrow) {
            tooltipX = windowWidth / 2 - this.tooltipW / 2;
            tooltipY = windowHeight / 2 + 50 + this.subtitleText.size + 50;
        } else {
            tooltipX = windowWidth / 2 + subtitleWidth / 2 + this.tooltipOffset;
            tooltipY = windowHeight / 2 + 55;
        }
        
        image(tooltip, tooltipX, tooltipY, this.tooltipW, this.tooltipH);

        // 2. Check Hover & Draw Box
        // We use push() here to isolate the tooltip text settings
        // This prevents the "jumping" bug
        push(); 
        if (
            mouseX > tooltipX &&
            mouseX < tooltipX + this.tooltipW &&
            mouseY > tooltipY - this.tooltipH / 2 &&
            mouseY < tooltipY + this.tooltipH / 2
        ) {
            textSize(16); // Hardcode tooltip text size
            textAlign(LEFT, TOP);
            let boxPadding = 12;
            let maxBoxWidth = min(windowWidth * 0.5, 320); 

            // Word wrap logic
            let words = this.tooltipMSG.split(' ');
            let lines = [];
            let line = '';
            for (let w of words) {
                let testLine = line + w + ' ';
                if (textWidth(testLine) > maxBoxWidth - boxPadding * 2 && line.length > 0) {
                    lines.push(line.trim());
                    line = w + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line.trim());

            // Calculate box width
            let boxWidth = boxPadding * 2;
            for (let l of lines) {
                boxWidth = max(boxWidth, textWidth(l) + boxPadding * 2);
            }
            boxWidth = min(boxWidth, maxBoxWidth);

            // Calculate box height
            let lineHeight = textAscent() + textDescent();
            let boxHeight = lines.length * lineHeight + boxPadding * 2;

            let boxX = tooltipX + this.tooltipW / 2 - boxWidth / 2;
            let boxY = tooltipY + this.tooltipH / 2 + 30;

            // Draw Box
            fill(130, 130, 130);
            noStroke();
            rect(boxX, boxY, boxWidth, boxHeight);

            // Draw Triangle
            let triBase = 20; 
            let triHeight = 12; 
            let triX = boxX + boxWidth / 2;
            let triY = boxY;

            triangle(
                triX - triBase / 2, triY, 
                triX + triBase / 2, triY, 
                tooltipX + this.tooltipW / 2, triY - triHeight 
            );

            // Draw Text
            fill(255, 240);
            let textX = boxX + boxPadding;
            let textY = boxY + boxPadding;
            for (let i = 0; i < lines.length; i++) {
                text(lines[i], textX, textY + i * lineHeight);
            }
        }
        pop(); // Restore previous text settings

        
        // --- MODE SELECTION & CAMERA LOGIC ---

        let modeW = cameraMode.width * 0.3;
        let modeH = cameraMode.height * 0.3;
        image(cameraMode, windowWidth - modeW * 6, modeH, modeW, modeH);
        image(keyboardMode, windowWidth - modeW * 2, modeH, modeW, modeH);

        fill(0); noStroke();

        let rectX = windowWidth - modeW * 4.5;
        let rectY = modeH - modeH * 0.2;
        let rectW = modeW * 2;
        let rectH = modeH * 1.4;
        let leftX = rectX + modeW * 0.5;
        let rightX = rectX + rectW - modeW * 0.5;
        let toggleY = rectY + rectH / 2;
        let toggleRadius = modeW * 0.85;
        let toggleX = (gameMode === 0) ? leftX : rightX;
        
        rect(rectX, rectY, rectW, rectH, 300);
        fill(244);
        ellipseMode(CENTER);
        ellipse(toggleX, toggleY, toggleRadius, toggleRadius);
        
        // Check if mode has changed (or if it is the very first frame)
        if (gameMode !== this.lastMode) {
            // Only update subtitle text on mode change
            this.subtitleText = new JiggleText(this.infos[gameMode], windowWidth / 2, windowHeight / 2 + 110, min(windowWidth, windowHeight) * 0.02, {
                color: 150,
                jiggleX: 1,
                jiggleY: 1,
                jiggleRot: 0.03
            });
            this.lastMode = gameMode;
        }

        // Call the smile detection when the camera mode is on.
        if (gameMode === 0) {
            // detectSmile is a global function in sketch.js
            let f = detectSmile();
            if (f) {
                this.isFaceThere = true;
                // Optional: Transition to next stage here if smile is valid
                // game.stage = ... 
            }
        }

        image(aboutBtn, 0 + aboutBtn.width * 0.3 / 2, 0 + aboutBtn.height * 0.3, aboutBtn.width * 0.5, aboutBtn.height * 0.5);
        image(helpBtn, 0 + aboutBtn.width * 0.3 / 2 + aboutBtn.width * 0.6, 0 + aboutBtn.height * 0.3, helpBtn.width * 0.5, helpBtn.height * 0.5);
    }
}
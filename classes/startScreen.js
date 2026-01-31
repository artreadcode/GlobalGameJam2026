class startScreen extends Stage {
    constructor() {
        super();
        this.lastMode = null;
        this.bg = 255;

        this.infos = [
            "Smile to start the game.",
            "Press 'E' to start the game." 
        ]

        // Create jiggle text objects (black color)
        this.titleText = new JiggleText("non-Duchenne", windowWidth / 2, windowHeight / 2, min(windowWidth, windowHeight) * 0.05, {
            color: 0
        });

        // this.subtitleText = new JiggleText(this.infos[gameMode], windowWidth / 2, windowHeight / 2 + 110, min(windowWidth, windowHeight) * 0.02, {
        //     color: 150,
        //     jiggleX: 1,
        //     jiggleY: 1,
        //     jiggleRot: 0.03
        // });

        this.subtitleText = new TypewriterEffect(
            this.infos[gameMode],
            windowWidth / 2, windowHeight / 2 + 110, 
            min(windowWidth, windowHeight) * 0.02,
            { color:150,
              speed:50,
              align: CENTER
            }
        );

        // Properties
        this.tooltipMSG = "This game uses webcam face detection without storing data. If you’re not comfortable with this, you can choose keyboard mode.";
        this.tooltipW = 32;
        this.tooltipH = 32;
        this.tooltipOffset = min(windowWidth, windowHeight) * 0.01; // the blank between the subTitle and the tooltip '?'
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
        // If clicked on left half, set to camera; right half, set to keyboard
        if (gameMode === 0) {
            gameMode = 1;
        }
        else if (gameMode === 1) {
            gameMode = 0;
        }
    }
}

    show() {
        background(this.bg);
        textAlign(CENTER, CENTER);
        // text(gameTitle, windowWidth / 2, windowHeight / 2 - min(windowWidth, windowHeight) * 0.06);

        // Update positions and sizes in case of window resize
        this.titleText.setPosition(windowWidth / 2, windowHeight / 2);
        this.titleText.size = min(windowWidth, windowHeight) * 0.1;

        this.subtitleText.setPosition(windowWidth / 2, windowHeight / 2 + windowHeight * 0.08);
        this.subtitleText.size = min(windowWidth, windowHeight) * 0.045;

        // Show jiggle texts
        this.titleText.show();
        this.subtitleText.show();

        // Display tooltip
        // Calculate subtitle width for precise tooltip PNG alignment
        textSize(this.subtitleText.size);
        let subtitleWidth = textWidth(this.subtitleText.text);
        let isNarrow = windowWidth < 600; // threshold for mobile/tablet
        let tooltipX, tooltipY;
        if (isNarrow) {
            // Place tooltip PNG underneath subtitle, centered
            tooltipX = windowWidth / 2 - this.tooltipW / 2;
            tooltipY = windowHeight / 2 + 50 + this.subtitleText.size + 50;
        } else {
            // Place tooltip PNG to the right of subtitle
            tooltipX = windowWidth / 2 + subtitleWidth / 2 + this.tooltipOffset;
            tooltipY = windowHeight / 2 + 55;
        }
        image(tooltip, tooltipX, tooltipY, this.tooltipW, this.tooltipH);

        push();

        // Check mouse hovering event
        if (
            mouseX > tooltipX &&
            mouseX < tooltipX + this.tooltipW &&
            mouseY > tooltipY - this.tooltipH / 2 &&
            mouseY < tooltipY + this.tooltipH / 2
        ) {
            // textSize(this.subtitleText.size * 0.4);
            textSize(16);
            textAlign(LEFT, TOP);
            let boxPadding = 12;
            let maxBoxWidth = min(windowWidth * 0.5, 320); // max width for wrapping

            // Word wrap and measure lines
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

            // Calculate dynamic box width (longest line)
            let boxWidth = boxPadding * 2;
            for (let l of lines) {
                boxWidth = max(boxWidth, textWidth(l) + boxPadding * 2);
            }
            boxWidth = min(boxWidth, maxBoxWidth);

            // Calculate box height
            let lineHeight = textAscent() + textDescent();
            let boxHeight = lines.length * lineHeight + boxPadding * 2;

            // Draw message box underneath the PNG
            let boxX = tooltipX + this.tooltipW / 2 - boxWidth / 2;
            let boxY = tooltipY + this.tooltipH / 2 + 30;
            fill(130, 130, 130);
            noStroke();
            rect(boxX, boxY, boxWidth, boxHeight);

            // Draw triangle (speech box tail) on top center of the box
            let triBase = 20; // width of the triangle base
            let triHeight = 12; // height of the triangle
            let triX = boxX + boxWidth / 2;
            let triY = boxY;

            triangle(
                triX - triBase / 2, triY,         // left point
                triX + triBase / 2, triY,         // right point
                tooltipX + this.tooltipW / 2, triY - triHeight // tip (points to PNG)
            );

            fill(255, 240);
            
            let textX = boxX + boxPadding;
            let textY = boxY + boxPadding;
            for (let i = 0; i < lines.length; i++) {
                text(lines[i], textX, textY + i * lineHeight);
            }
        }

        push();
        // Display camera and keyboard mode selection on top.
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
        
        if (gameMode !== this.lastMode) {
            if (gameMode === 0) {
                if (!video) {
                    video = createCapture(VIDEO);
                    video.hide();
                }

                // this.subtitleText = new JiggleText(this.infos[gameMode], windowWidth / 2, windowHeight / 2 + 110, min(windowWidth, windowHeight) * 0.02, {
                //     color: 150,
                //     jiggleX: 1,
                //     jiggleY: 1,
                //     jiggleRot: 0.03
                // });

                this.subtitleText = new TypewriterEffect(
                    this.infos[gameMode],
                    windowWidth / 2,
                    windowHeight / 2 + 110,
                    min(windowWidth, windowHeight) * 0.02,
                    {
                        color: 150,
                        speed: 50,
                        align: CENTER
                    }
                );
            }
            else if (gameMode === 1) {
                if (video) {
                    video.stop();
                    video.remove();
                    video = null;
                }

                // this.subtitleText = new JiggleText(this.infos[gameMode], windowWidth / 2, windowHeight / 2 + 110, min(windowWidth, windowHeight) * 0.02, {
                //     color: 150,
                //     jiggleX: 1,
                //     jiggleY: 1,
                //     jiggleRot: 0.03
                // });

                this.subtitleText = new TypewriterEffect(
                    this.infos[gameMode],
                    windowWidth / 2,
                    windowHeight / 2 + 110,
                    min(windowWidth, windowHeight) * 0.02,
                    {
                        color: 150,
                        speed: 50,
                        align: CENTER
                    }
                );
            }
            this.lastMode = gameMode;
        }

        pop();

        image(aboutBtn, 0 + aboutBtn.width * 0.3 / 2, 0 + aboutBtn.height * 0.3, aboutBtn.width * 0.5, aboutBtn.height * 0.5);
        image(helpBtn, 0 + aboutBtn.width * 0.3 / 2 + aboutBtn.width * 0.6, 0 + aboutBtn.height * 0.3, helpBtn.width * 0.5, helpBtn.height * 0.5);
    }
}
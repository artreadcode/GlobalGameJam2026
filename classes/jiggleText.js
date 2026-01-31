class JiggleText {
    constructor(text, x, y, size, options = {}) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;

        // Options with defaults (use !== undefined to allow 0 values)
        this.color = options.color !== undefined ? options.color : 255;
        this.frameInterval = options.frameInterval || 15;
        this.jiggleX = options.jiggleX !== undefined ? options.jiggleX : 2;
        this.jiggleY = options.jiggleY !== undefined ? options.jiggleY : 2;
        this.jiggleRot = options.jiggleRot !== undefined ? options.jiggleRot : 0.05;

        // Initialize jiggle for each letter
        this.jiggles = [];
        for (let i = 0; i < this.text.length; i++) {
            this.jiggles.push({ x: 0, y: 0, rot: 0 });
        }
    }

    // Update text content
    setText(newText) {
        if (newText !== this.text) {
            this.text = newText;
            this.jiggles = [];
            for (let i = 0; i < this.text.length; i++) {
                this.jiggles.push({ x: 0, y: 0, rot: 0 });
            }
        }
    }

    // Update position
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        if (frameCount % this.frameInterval === 0) {
            for (let i = 0; i < this.jiggles.length; i++) {
                this.jiggles[i].x = random(-this.jiggleX, this.jiggleX);
                this.jiggles[i].y = random(-this.jiggleY, this.jiggleY);
                this.jiggles[i].rot = random(-this.jiggleRot, this.jiggleRot);
            }
        }
    }

    draw() {
        push();
        textFont(schoolbellFont);
        textSize(this.size);
        textAlign(CENTER, CENTER);
        fill(this.color);

        let totalWidth = textWidth(this.text);
        let startX = this.x - totalWidth / 2;
        let offsetX = 0;

        for (let i = 0; i < this.text.length; i++) {
            let letter = this.text[i];
            let letterW = textWidth(letter);
            let jig = this.jiggles[i];

            push();
            translate(startX + offsetX + letterW / 2 + jig.x, this.y + jig.y);
            rotate(jig.rot);
            text(letter, 0, 0);
            pop();

            offsetX += letterW;
        }
        pop();
    }

    // Convenience method to update and draw
    show() {
        this.update();
        this.draw();
    }
}

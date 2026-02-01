class Transition {
    constructor() {
        this.size = 5; // Size of each pixel block
        this.cols = 0;
        this.rows = 0;

        this.xoff = 0;
        this.yoff = 0;
        this.zoff = 0;
        this.increment = 0.5;

        this.colorThreshold = 50;
        this.ditheredThreshold = 127;
        this.gradientDepth = 0.3;

        // Animation properties
        this.active = false;
        this.progress = 0; // 0 = fully hidden, 1 = fully revealed
        this.speed = 0.05; // How fast the transition animates
        this.direction = 1; // 1 = reveal, -1 = hide

        // Capture the current canvas as the transition image
        this.capturedImage = null;

        this.updateDimensions();
    }

    updateDimensions() {
        this.cols = width / this.size;
        this.rows = height / this.size;
    }

    // Capture the current canvas state
    capture() {
        this.capturedImage = get();
    }

    // Start transition (reveal or hide)
    start(direction = 1) {
        this.active = true;
        this.direction = direction; // 1 = reveal (fade in), -1 = hide (fade out)
        if (direction === 1) {
            this.progress = 0;
        } else {
            this.progress = 1;
        }
    }

    // Stop the transition
    stop() {
        this.active = false;
    }

    // Check if transition is complete
    isComplete() {
        if (this.direction === 1) {
            return this.progress >= 1;
        } else {
            return this.progress <= 0;
        }
    }

    // Update animation
    update() {
        if (!this.active) return;

        this.progress += this.speed * this.direction;
        this.progress = constrain(this.progress, 0, 1);

        // Animate the noise
        this.zoff += 0.005;

        // Auto-stop when complete
        if (this.isComplete()) {
            this.active = false;
        }
    }

    // Draw the transition effect
    draw() {
        if (!this.capturedImage) return;

        push();
        noStroke();

        // Draw the captured image in grayscale
        image(this.capturedImage, 0, 0);
        filter(GRAY);

        // Calculate gradient based on progress instead of scroll
        let gradientStart = this.progress * this.rows;
        let gradientEnd = gradientStart + (height * this.gradientDepth) / this.size;

        this.yoff = 0;
        for (let i = 0; i < this.cols; i++) {
            this.xoff = 0;
            for (let j = 0; j < this.rows; j++) {
                let x = i * this.size;
                let y = j * this.size;

                let gradientValue = map(j, gradientStart, gradientEnd, 0, 255);
                let noiseValue = map(noise(this.xoff, this.yoff, this.zoff), 0, 1, 0, 255);
                let combinedValue = gradientValue + (noiseValue - this.colorThreshold);

                let ditheredValue;
                if (combinedValue < this.ditheredThreshold) {
                    ditheredValue = 255; // White (reveals underlying content)
                } else {
                    ditheredValue = null; // Don't draw (shows captured image)
                }

                if (ditheredValue != null) {
                    fill(ditheredValue);
                    rect(x, y, this.size, this.size);
                }

                this.xoff += this.increment;
            }
            this.yoff += this.increment;
        }

        pop();
    }

    // Draw the full effect (update + draw)
    show() {
        this.update();
        this.draw();
    }

    // Configure transition parameters
    setSpeed(speed) {
        this.speed = speed;
    }

    setGradientDepth(depth) {
        this.gradientDepth = depth;
    }

    setPixelSize(size) {
        this.size = size;
        this.updateDimensions();
    }
}

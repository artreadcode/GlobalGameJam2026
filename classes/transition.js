class Transition {
  constructor() {
    this.active = false;
    this.alpha = 0;
    this.fadeIn = true;
    this.duration = 30; // frames
    this.frame = 0;
    this.targetStage = null;
  }

  capture() {
    // Placeholder for screen capture if needed
  }

  start(targetStage) {
    this.active = true;
    this.fadeIn = true;
    this.frame = 0;
    this.targetStage = targetStage;
  }

  show() {
    if (!this.active) return;

    this.frame++;

    if (this.fadeIn) {
      this.alpha = map(this.frame, 0, this.duration, 0, 255);
      if (this.frame >= this.duration) {
        this.fadeIn = false;
        this.frame = 0;
      }
    } else {
      this.alpha = map(this.frame, 0, this.duration, 255, 0);
      if (this.frame >= this.duration) {
        this.active = false;
        this.alpha = 0;
      }
    }

    push();
    noStroke();
    fill(0, this.alpha);
    rect(0, 0, width, height);
    pop();
  }
}

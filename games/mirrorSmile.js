class MirrorSmileGame {
  constructor(options = {}) {
    const durationMs = typeof options.durationMs === "number" ? options.durationMs : 4000;
    const drainMultiplier = typeof options.drainMultiplier === "number" ? options.drainMultiplier : 1;
    const type = typeof options.type === "number" ? options.type : 1;

    this.active = false;
    this.done = false;
    this.success = false;
    this.smile = new Smile({ durationMs, type, drainMultiplier });
  }

  start() {
    this.active = true;
    this.done = false;
    this.success = false;
    this.smile.start();
  }

  stop() {
    this.active = false;
    this.smile.stop();
  }

  update() {
    if (!this.active) return;
    this.smile.update();

    if (this.smile.complete) {
      this.done = true;
      this.success = true;
    } else if (this.smile.failed) {
      this.done = true;
      this.success = false;
    }
  }

  draw() {
    if (!this.active) return;

    const progress = this.smile.getProgress();
    const clamped = Math.max(0, Math.min(1, progress));
    const alpha = Math.round(255 * clamped);

    push();
    textAlign(CENTER, TOP);
    textFont(schoolbellFont);
    textSize(Math.max(16, Math.min(width, height) * 0.04));
    fill(255);
    stroke(0);
    strokeWeight(3);
    text("Smile!", width / 2, height * 0.05);
    pop();

    if (alpha <= 0) return;

    push();
    noStroke();
    fill(255, alpha);
    rect(0, 0, width, height);
    pop();
  }

  isDone() {
    return this.done;
  }
}

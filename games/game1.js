class Game1 {
  constructor(options = {}) {
    const durationMs = typeof options.durationMs === "number" ? options.durationMs : 7000;
    const type = Number(options.type) === 2 ? 2 : 1;

    this.active = false;
    this.status = "idle";
    this.durationMs = durationMs;
    this.type = type;
    this.smile = new Smile({ durationMs, type });
  }

  start() {
    this.active = true;
    this.status = "playing";
    this.smile.start();
  }

  stop() {
    this.active = false;
    this.smile.stop();
  }

  update() {
    if (!this.active) return;

    this.smile.update();

    if (this.status === "playing") {
      if (this.smile.complete) {
        this.status = "success";
      } else if (this.smile.failed) {
        this.status = "fail";
      }
    }
  }

  draw() {
    if (!this.active) return;

    const progress = this.smile.getProgress();
    const remainingSec = this.smile.getTimeRemainingMs() / 1000;

    push();
    noStroke();
    fill(0, 180);
    rect(0, 0, width, height);

    textAlign(CENTER, CENTER);
    textFont(schoolbellFont);

    const titleSize = Math.max(18, Math.min(width, height) * 0.06);
    const bodySize = Math.max(12, Math.min(width, height) * 0.028);
    const smallSize = Math.max(12, Math.min(width, height) * 0.024);

    fill(255);
    textSize(titleSize);
    text("Smile Exercise", width / 2, height * 0.22);

    textSize(bodySize);
    if (this.status === "playing") {
      if (this.type === 1) {
        text("Smile to fill the bar. Stop and it drains.", width / 2, height * 0.32);
      } else {
        text("Keep smiling for the full time. Any break fails.", width / 2, height * 0.32);
      }
    } else if (this.status === "success") {
      fill(140, 255, 140);
      text("Nice! You did it.", width / 2, height * 0.32);
    } else if (this.status === "fail") {
      fill(255, 140, 140);
      text("Oops! Try again.", width / 2, height * 0.32);
    }

    const barW = Math.min(width * 0.7, 520);
    const barH = Math.max(18, Math.min(width, height) * 0.035);
    const barX = width / 2 - barW / 2;
    const barY = height * 0.5;
    const radius = barH / 2;

    noFill();
    stroke(255);
    strokeWeight(2);
    rect(barX, barY, barW, barH, radius);

    noStroke();
    fill(255, 216, 0);
    const fillW = Math.max(0, Math.min(barW, barW * progress));
    rect(barX, barY, fillW, barH, radius);

    textSize(smallSize);
    fill(255);
    text(`${remainingSec.toFixed(1)}s remaining`, width / 2, barY + barH + 28);

    const smileStatus = this.smile.isSmiling ? "Smiling" : "Not smiling";
    if (this.smile.isSmiling) {
      fill(120, 255, 120);
    } else {
      fill(255, 140, 140);
    }
    text(smileStatus, width / 2, barY + barH + 55);

    fill(255);
    text("Press Esc to close", width / 2, height * 0.82);
    pop();
  }
}

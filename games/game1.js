class Game1 {
  constructor(options = {}) {
    const durationMs = typeof options.durationMs === "number" ? options.durationMs : 7000;
    const type = Number(options.type) === 2 ? 2 : 1;

    this.active = false;
    this.status = "idle";
    this.done = false;
    this.durationMs = durationMs;
    this.type = type;
    this.countdownSeconds = 5;
    this.countdownStartMs = null;
    this.smile = new Smile({ durationMs, type });

    this.titleText = new JiggleText("Smile Exercise", width / 2, height * 0.22, 32, {
      color: 255,
      jiggleX: 1,
      jiggleY: 1,
      jiggleRot: 0.02,
    });
    this.bodyText = new JiggleText("", width / 2, height * 0.32, 18, {
      color: 255,
      jiggleX: 1,
      jiggleY: 1,
      jiggleRot: 0.02,
    });
    this.countdownText = new JiggleText("5", width / 2, height * 0.45, 64, {
      color: 255,
      jiggleX: 2,
      jiggleY: 2,
      jiggleRot: 0.04,
    });
  }

  start() {
    this.active = true;
    this.status = "countdown";
    this.done = false;
    this.countdownStartMs = this._nowMs();
  }

  stop() {
    this.active = false;
    this.countdownStartMs = null;
    this.smile.stop();
  }

  update() {
    if (!this.active) return;

    if (this.status === "countdown") {
      const elapsed = Math.max(0, this._nowMs() - this.countdownStartMs);
      if (elapsed >= this.countdownSeconds * 1000) {
        this.status = "playing";
        this.smile.start();
      }
      return;
    }

    this.smile.update();

    if (this.status === "playing") {
      if (this.smile.complete) {
        this.status = "success";
        this.done = true;
      } else if (this.smile.failed) {
        this.status = "fail";
        this.done = true;
      }
    }
  }

  isDone() {
    return this.done;
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

    this.titleText.setPosition(width / 2, height * 0.22);
    this.titleText.size = titleSize;
    this.titleText.show();

    textSize(bodySize);
    if (this.status === "countdown") {
      const elapsed = Math.max(0, this._nowMs() - this.countdownStartMs);
      const remaining = Math.max(1, Math.ceil((this.countdownSeconds * 1000 - elapsed) / 1000));
      this.bodyText.color = 255;
      this.bodyText.setText("Get ready to smile");
      this.bodyText.setPosition(width / 2, height * 0.32);
      this.bodyText.size = bodySize;
      this.bodyText.show();

      this.countdownText.color = 255;
      this.countdownText.setText(String(remaining));
      this.countdownText.setPosition(width / 2, height * 0.45);
      this.countdownText.size = Math.max(36, Math.min(width, height) * 0.12);
      this.countdownText.show();
    } else if (this.status === "playing") {
      if (this.type === 1) {
        this.bodyText.color = 255;
        this.bodyText.setText("Smile to fill the bar. Stop and it drains.");
      } else {
        this.bodyText.color = 255;
        this.bodyText.setText("Keep smiling for the full time. Any break fails.");
      }
      this.bodyText.setPosition(width / 2, height * 0.32);
      this.bodyText.size = bodySize;
      this.bodyText.show();
    } else if (this.status === "success") {
      this.bodyText.color = [140, 255, 140];
      this.bodyText.setText("Nice! You did it.");
      this.bodyText.setPosition(width / 2, height * 0.32);
      this.bodyText.size = bodySize;
      this.bodyText.show();
    } else if (this.status === "fail") {
      this.bodyText.color = [255, 140, 140];
      this.bodyText.setText("Oops! Try again.");
      this.bodyText.setPosition(width / 2, height * 0.32);
      this.bodyText.size = bodySize;
      this.bodyText.show();
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

    if (this.status !== "countdown") {
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
    }

    fill(255);
    text("Press Esc to close", width / 2, height * 0.82);
    pop();
  }

  _nowMs() {
    if (typeof millis === "function") return millis();
    return Date.now();
  }
}

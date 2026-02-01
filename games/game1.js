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
    this.locksMovement = true;
    this.introDurationMs = 5000;
    this.introStartMs = null;
    this.flashDurationMs = 200;
    this.photoDurationMs = 3000;
    this.fadeDurationMs = 600;
    this.flashStartMs = null;
    this.photoStartMs = null;
    this.fadeStartMs = null;

    this.titleText = new JiggleText("Smile for the camera!", width / 2, height * 0.37, 32, {
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
    this.status = "intro";
    this.done = false;
    this.countdownStartMs = null;
    this.introStartMs = this._nowMs();
    this.flashStartMs = null;
    this.photoStartMs = null;
    this.fadeStartMs = null;
  }

  stop() {
    this.active = false;
    this.countdownStartMs = null;
    this.smile.stop();
  }

  update() {
    if (!this.active) return;

    if (this.status === "intro") {
      const elapsed = Math.max(0, this._nowMs() - this.introStartMs);
      if (elapsed >= this.introDurationMs) {
        this.status = "countdown";
        this.countdownStartMs = this._nowMs();
      }
      return;
    }

    if (this.status === "countdown") {
      const elapsed = Math.max(0, this._nowMs() - this.countdownStartMs);
      if (elapsed >= this.countdownSeconds * 1000) {
        this.status = "playing";
        this.smile.start();
      }
      return;
    }

    if (this.status === "flash") {
      const elapsed = Math.max(0, this._nowMs() - this.flashStartMs);
      if (elapsed >= this.flashDurationMs) {
        this.status = "photo";
        this.photoStartMs = this._nowMs();
        // Play camera shutter sound
        if (cameraSfx && !cameraSfx.isPlaying()) {
          cameraSfx.play();
        }
      }
      return;
    }

    if (this.status === "photo") {
      const elapsed = Math.max(0, this._nowMs() - this.photoStartMs);
      if (elapsed >= this.photoDurationMs) {
        this.status = "fadeout";
        this.fadeStartMs = this._nowMs();
      }
      return;
    }

    if (this.status === "fadeout") {
      const elapsed = Math.max(0, this._nowMs() - this.fadeStartMs);
      if (elapsed >= this.fadeDurationMs) {
        this.done = true;
      }
      return;
    }

    this.smile.update();

    if (this.status === "playing") {
      if (this.smile.complete) {
        this.status = "flash";
        this.flashStartMs = this._nowMs();
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
    background(255);

    textAlign(CENTER, CENTER);
    textFont(schoolbellFont);

    const titleSize = Math.max(18, Math.min(width, height) * 0.06);
    const bodySize = Math.max(12, Math.min(width, height) * 0.028);
    const smallSize = Math.max(12, Math.min(width, height) * 0.024);

    if (this.status === "intro") {
      this._drawIntroScene();
    } else if (this.status === "flash") {
      this._drawFlash();
    } else if (this.status === "photo") {
      this._drawPhoto(255);
    } else if (this.status === "fadeout") {
      const elapsed = Math.max(0, this._nowMs() - this.fadeStartMs);
      const alpha = Math.max(0, Math.min(255, 255 - (elapsed / this.fadeDurationMs) * 255));
      this._drawPhoto(alpha);
    } else {
      this._drawCameraScene();
    }

    this.titleText.color = 0;
    this.titleText.setPosition(width / 2, height * 0.06);
    this.titleText.size = titleSize;
    this.titleText.show();

    textSize(bodySize);
    if (this.status === "countdown") {
      const elapsed = Math.max(0, this._nowMs() - this.countdownStartMs);
      const remaining = Math.max(1, Math.ceil((this.countdownSeconds * 1000 - elapsed) / 1000));
      this.bodyText.color = 0;
      this.bodyText.setText("Get ready to smile");
      this.bodyText.setPosition(width / 2, height * 0.12);
      this.bodyText.size = bodySize;
      this.bodyText.show();

      this.countdownText.color = [255, 0, 0];
      this.countdownText.setText(String(remaining));
      this.countdownText.setPosition(width / 2, height * 0.5);
      this.countdownText.size = Math.max(36, Math.min(width, height) * 0.12);
      this.countdownText.show();
    } else if (this.status === "playing") {
      if (this.type !== 1) {
        this.bodyText.color = 0;
        this.bodyText.setText("Keep smiling for the full time. Any break fails.");
        this.bodyText.setPosition(width / 2, height * 0.12);
        this.bodyText.size = bodySize;
        this.bodyText.show();
      }
    } else if (this.status === "success") {
      this.bodyText.color = [140, 255, 140];
      this.bodyText.setText("Nice! You did it.");
      this.bodyText.setPosition(width / 2, height * 0.12);
      this.bodyText.size = bodySize;
      this.bodyText.show();
    } else if (this.status === "fail") {
      this.bodyText.color = [255, 140, 140];
      this.bodyText.setText("Oops! Try again.");
      this.bodyText.setPosition(width / 2, height * 0.12);
      this.bodyText.size = bodySize;
      this.bodyText.show();
    }

    if (this.status === "playing" && (this.smile.isSmiling || this.smile.getProgress() > 0)) {
      const barW = Math.min(width * 0.7, 520);
      const barH = Math.max(18, Math.min(width, height) * 0.035);
      const barX = width / 2 - barW / 2;
      const barY = height * 0.11;
      const radius = barH / 2;

      noFill();
      stroke(0);
      strokeWeight(2);
      rect(barX, barY, barW, barH, radius);

      noStroke();
      fill(255, 216, 0);
      const fillW = Math.max(0, Math.min(barW, barW * progress));
      rect(barX, barY, fillW, barH, radius);

      textSize(smallSize);
      fill(0);
      text(`${remainingSec.toFixed(1)}s remaining`, width / 2, barY + barH + 14);

      const smileStatus = this.smile.isSmiling ? "Smiling" : "Not smiling";
      if (this.smile.isSmiling) {
        fill(120, 255, 120);
      } else {
        fill(255, 140, 140);
      }
      text(smileStatus, width / 2, barY + barH + 30);
    }

    // Esc hint removed per request
    pop();
  }

  _drawIntroScene() {
    if (mumCameraSprite) {
      const baseX = width * 0.65;
      const groundY = height - 20;
      const scale = 1;
      const drawW = mumCameraSprite.width * scale;
      const drawH = mumCameraSprite.height * scale;
      const y = groundY - drawH;
      image(mumCameraSprite, baseX, y, drawW, drawH);
      if (dadSprite) {
        const dadW = dadSprite.width * scale;
        const dadH = dadSprite.height * scale;
        const dadY = groundY - dadH;
        image(dadSprite, baseX + 320, dadY, dadW, dadH);
      }
    }

    if (playerStand) {
      const scale = 0.9;
      const drawW = playerStand.width * scale;
      const drawH = playerStand.height * scale;
      const x = width * 0.45 - drawW / 2;
      const y = height - drawH - 20;
      image(playerStand, x, y, drawW, drawH);
    }
  }

  _drawCameraScene() {
    if (cameraBorder) {
      push();
      imageMode(CENTER);
      image(cameraBorder, windowWidth / 2, windowHeight / 2, width * 0.5, height * 0.5);
      pop();
    }
    if (takingPictureSprite) {
      const scale = height / takingPictureSprite.height;
      const drawW = takingPictureSprite.width * scale;
      const drawH = takingPictureSprite.height * scale;
      image(takingPictureSprite, width / 2 - drawW / 2, height - drawH, drawW, drawH);
    }
  }

  _drawPhoto(alpha) {
    if (cameraBorder) {
      push();
      tint(255, alpha);
      imageMode(CENTER)
      image(cameraBorder, windowWidth / 2, windowHeight / 2, width * 0.5, height * 0.5);
      pop();
    }
    if (takingPictureSpriteSmile) {
      const scale = height / takingPictureSpriteSmile.height;
      const drawW = takingPictureSpriteSmile.width * scale;
      const drawH = takingPictureSpriteSmile.height * scale;
      push();
      tint(255, alpha);
      image(takingPictureSpriteSmile, 0, 0, drawW, drawH);
      pop();
    }
  }

  _drawFlash() {
    push();
    noStroke();
    fill(255);
    rect(0, 0, width, height);
    pop();
  }

  _nowMs() {
    if (typeof millis === "function") return millis();
    return Date.now();
  }
}

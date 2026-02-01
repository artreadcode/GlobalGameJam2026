class HeartbeatGame {
  constructor() {
    this.active = false;
    this.heartbeatSound = null;
    this.bpm = 72; // heartbeat tempo (beats per minute)
    this.beatInterval = 60000 / this.bpm; // ms between beats
    this.lastBeatTime = 0;
    this.nextBeatTime = 0;
    this.beatPhase = 0; // 0 = Q beat, 1 = E beat (lub-dub)

    // Timing windows (randomized on start)
    this.perfectWindow = 100; // ms
    this.goodWindow = 200; // ms
    this.okWindow = 300; // ms

    // Survival bar
    this.survivalBar = 100; // 0-100
    this.drainRate = 0; // calculated based on duration
    this.perfectBoost = 8; // how much perfect adds
    this.goodBoost = 4;
    this.okBoost = 1;
    this.missedBeatPenalty = 10; // penalty for missing a beat
    this.lowWarningThreshold = 30;
    this.lowWarningMessages = ["you need to clam down", "call NHS 999", "take a deep breath"];
    this.lowWarningIndex = 0;
    this.lowWarningTimer = 0;
    this.lowWarningInterval = 900;

    // Score
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hits = { perfect: 0, good: 0, ok: 0, miss: 0 };

    // Visual feedback
    this.feedbackText = "";
    this.feedbackAlpha = 0;
    this.feedbackColor = [255, 255, 255];

    // Camera shake
    this.shakeIntensity = 0;
    this.shakeX = 0;
    this.shakeY = 0;

    // Beat indicators
    this.qPressed = false;
    this.ePressed = false;
    this.beatIndicatorAlpha = 0;

    // Heart visual
    this.heartScale = 1;
    this.heartTargetScale = 1;

    // Game duration (randomized 8-13 seconds)
    this.duration = 10000;
    this.startTime = 0;
    this.gameOver = false;
    this.survived = false;

    // Key tracking to prevent holding
    this.qHeld = false;
    this.eHeld = false;

    // Track if beat was hit this phase
    this.beatHitThisPhase = true;
    this.lowWarningIndex = 0;
    this.lowWarningTimer = 0;
  }

  start() {
    this.active = true;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hits = { perfect: 0, good: 0, ok: 0, miss: 0 };
    this.gameOver = false;
    this.survived = false;

    // Randomize duration (8-13 seconds)
    this.duration = random(8000, 13000);

    // Randomize tempo/difficulty (60-90 BPM)
    this.bpm = random(60, 90);
    this.beatInterval = 60000 / this.bpm;

    // Randomize timing windows based on difficulty
    let difficultyMod = map(this.bpm, 60, 90, 1.2, 0.8); // faster = harder
    this.perfectWindow = 100 * difficultyMod;
    this.goodWindow = 200 * difficultyMod;
    this.okWindow = 300 * difficultyMod;

    // Calculate drain rate so bar empties in ~60% of duration if no input
    this.drainRate = 100 / (this.duration * 0.6 / 16.67); // per frame (~60fps)

    // Reset survival bar
    this.survivalBar = 100;

    this.startTime = millis();
    this.lastBeatTime = millis();
    this.nextBeatTime = millis() + this.beatInterval / 2;
    this.beatPhase = 0;
    this.qHeld = false;
    this.eHeld = false;
    this.beatHitThisPhase = false;

    // Play heartbeat sound
    if (heartbeatSound && !heartbeatSound.isPlaying()) {
      heartbeatSound.setLoop(true);
      heartbeatSound.play();
    }
  }

  stop() {
    this.active = false;
    if (heartbeatSound && heartbeatSound.isPlaying()) {
      heartbeatSound.stop();
    }
  }

  update() {
    if (!this.active || this.gameOver) return;

    let currentTime = millis();

    // Check if game is over
    if (currentTime - this.startTime >= this.duration) {
      this.gameOver = true;
      return;
    }

    // Update beat timing
    if (currentTime >= this.nextBeatTime) {
      // Trigger beat
      this.triggerBeat();

      // Set next beat time
      if (this.beatPhase === 0) {
        // After lub, short pause before dub
        this.nextBeatTime = currentTime + this.beatInterval * 0.3;
        this.beatPhase = 1;
      } else {
        // After dub, longer pause before next lub
        this.nextBeatTime = currentTime + this.beatInterval * 0.7;
        this.beatPhase = 0;
      }
    }

    // Update camera shake
    if (this.shakeIntensity > 0) {
      this.shakeX = random(-this.shakeIntensity, this.shakeIntensity);
      this.shakeY = random(-this.shakeIntensity, this.shakeIntensity);
      this.shakeIntensity *= 0.9;
      if (this.shakeIntensity < 0.5) this.shakeIntensity = 0;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
    }

    // Update heart scale animation
    this.heartScale = lerp(this.heartScale, this.heartTargetScale, 0.2);
    if (abs(this.heartScale - this.heartTargetScale) < 0.01) {
      this.heartTargetScale = 1;
    }

    // Update feedback alpha
    if (this.feedbackAlpha > 0) {
      this.feedbackAlpha -= 5;
    }

    // Update beat indicator
    if (this.beatIndicatorAlpha > 0) {
      this.beatIndicatorAlpha -= 10;
    }

    // Drain survival bar over time
    this.survivalBar -= this.drainRate;
    this.survivalBar = constrain(this.survivalBar, 0, 100);
    if (this.survivalBar <= 0) {
      this.gameOver = true;
      return;
    }

    if (this.survivalBar <= this.lowWarningThreshold) {
      this.lowWarningTimer += deltaTime;
      if (this.lowWarningTimer >= this.lowWarningInterval) {
        this.lowWarningTimer = 0;
        this.lowWarningIndex = (this.lowWarningIndex + 1) % this.lowWarningMessages.length;
      }
    } else {
      this.lowWarningTimer = 0;
      this.lowWarningIndex = 0;
    }

    // Check for key presses
    this.checkInput();
  }

  triggerBeat() {
    // If the previous beat window was missed, apply penalty
    if (!this.beatHitThisPhase && this.lastBeatTime !== 0) {
      this.hits.miss++;
      this.combo = 0;
      this.survivalBar = max(0, this.survivalBar - this.missedBeatPenalty);
      this.showFeedback("MISS", [100, 100, 100]);
      if (this.survivalBar <= 0) {
        this.gameOver = true;
        return;
      }
    }

    this.beatHitThisPhase = false;
    this.lastBeatTime = millis();

    // Visual pulse
    this.heartTargetScale = 1.3;
    this.beatIndicatorAlpha = 255;

    // Light camera shake on beat
    this.shakeIntensity = max(this.shakeIntensity, 3);
  }

  checkInput() {
    let currentTime = millis();
    let timeToBeat = this.nextBeatTime - currentTime;
    let timeSinceBeat = currentTime - (this.nextBeatTime - this.beatInterval * (this.beatPhase === 0 ? 0.7 : 0.3));

    // Q key for first beat (lub)
    if (keyIsDown(81) && !this.qHeld) { // Q key
      this.qHeld = true;
      if (this.beatPhase === 1 || (this.beatPhase === 0 && timeToBeat < this.okWindow)) {
        this.registerHit(timeToBeat, timeSinceBeat);
      }
    }
    if (!keyIsDown(81)) this.qHeld = false;

    // E key for second beat (dub)
    if (keyIsDown(69) && !this.eHeld) { // E key
      this.eHeld = true;
      if (this.beatPhase === 0 || (this.beatPhase === 1 && timeToBeat < this.okWindow)) {
        this.registerHit(timeToBeat, timeSinceBeat);
      }
    }
    if (!keyIsDown(69)) this.eHeld = false;
  }

  registerHit(timeToBeat, timeSinceBeat) {
    let timing = min(abs(timeToBeat), abs(timeSinceBeat));

    if (timing <= this.perfectWindow) {
      this.hits.perfect++;
      this.score += 100;
      this.combo++;
      this.survivalBar = min(100, this.survivalBar + this.perfectBoost);
      this.showFeedback("PERFECT!", [255, 255, 255]); // White
      this.shakeIntensity = 8;
    } else if (timing <= this.goodWindow) {
      this.hits.good++;
      this.score += 50;
      this.combo++;
      this.showFeedback("GOOD!", [200, 200, 200]); // Light gray
      this.shakeIntensity = 5;
    } else if (timing <= this.okWindow) {
      this.hits.ok++;
      this.score += 25;
      this.combo++;
      this.showFeedback("OK", [150, 150, 150]); // Gray
      this.shakeIntensity = 3;
    } else {
      this.hits.miss++;
      this.combo = 0;
      this.showFeedback("MISS", [100, 100, 100]); // Dark gray
    }

    this.beatHitThisPhase = true;

    // Update max combo
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }

    // Bonus for combo
    if (this.combo >= 5) {
      this.score += this.combo * 2;
    }
  }

  showFeedback(text, color) {
    this.feedbackText = text;
    this.feedbackColor = color;
    this.feedbackAlpha = 255;
  }

  draw() {
    if (!this.active) return;

    push();

    // Apply camera shake
    translate(this.shakeX, this.shakeY);

    // Semi-transparent overlay
    fill(0, 0, 0, 180);
    noStroke();
    rect(0, 0, width, height);

    // Draw heart in center
    this.drawHeart(width / 2, height / 2 - 50, 100 * this.heartScale);

    // Draw beat indicators
    this.drawBeatIndicators();

    // Draw timing guide
    this.drawTimingGuide();

    // Draw feedback text
    if (this.feedbackAlpha > 0) {
      textAlign(CENTER, CENTER);
      textSize(48);
      textFont(schoolbellFont);
      fill(this.feedbackColor[0], this.feedbackColor[1], this.feedbackColor[2], this.feedbackAlpha);
      text(this.feedbackText, width / 2, height / 2 + 80);
    }

    // Draw survival bar
    this.drawSurvivalBar();

    // Draw time remaining
    let timeLeft = max(0, this.duration - (millis() - this.startTime));
    textAlign(RIGHT, TOP);
    textSize(18);
    textFont(schoolbellFont);
    fill(255);
    text("Time: " + (timeLeft / 1000).toFixed(1) + "s", width - 50, 50);

    // Draw low bar warning
    if (this.survivalBar <= this.lowWarningThreshold) {
      this.drawLowWarning();
    }

    // Draw instructions
    textAlign(CENTER, BOTTOM);
    textSize(20);
    fill(200);
    textFont(schoolbellFont);

    pop();
  }

  drawHeart(x, y, size) {
    push();
    translate(x, y);

    // Heart color pulses with beat (black and white)
    let brightness = map(this.heartScale, 1, 1.3, 220, 255);
    fill(brightness);
    stroke(0);
    strokeWeight(3);

    // Draw heart shape
    beginShape();
    let s = size / 100;
    vertex(0, -30 * s);
    bezierVertex(-50 * s, -80 * s, -100 * s, -20 * s, 0, 50 * s);
    vertex(0, 50 * s);
    bezierVertex(100 * s, -20 * s, 50 * s, -80 * s, 0, -30 * s);
    endShape(CLOSE);

    // Highlight
    fill(255, 255, 255, 100);
    noStroke();
    ellipse(-20 * s, -20 * s, 20 * s, 15 * s);

    pop();
  }

  drawBeatIndicators() {
    let centerY = height / 2 + 150;

    // Q indicator (left)
    push();
    let qAlpha = this.beatPhase === 0 ? 255 : 100;
    fill(255, qAlpha);
    stroke(0, qAlpha);
    strokeWeight(3);
    ellipse(width / 2 - 100, centerY, 80, 80);
    fill(0, qAlpha);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(32);
    textFont(schoolbellFont);
    text("Q", width / 2 - 100, centerY);
    pop();

    // E indicator (right)
    push();
    let eAlpha = this.beatPhase === 1 ? 255 : 100;
    fill(255, eAlpha);
    stroke(0, eAlpha);
    strokeWeight(3);
    ellipse(width / 2 + 100, centerY, 80, 80);
    fill(0, eAlpha);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(32);
    textFont(schoolbellFont);
    text("E", width / 2 + 100, centerY);
    pop();
  }

  drawTimingGuide() {
    let currentTime = millis();
    let progress = (currentTime - this.lastBeatTime) % this.beatInterval / this.beatInterval;

    // Draw timing bar
    let barWidth = 300;
    let barHeight = 10;
    let barX = width / 2 - barWidth / 2;
    let barY = height / 2 + 220;

    // Background bar
    fill(80);
    stroke(255);
    strokeWeight(2);
    rect(barX, barY, barWidth, barHeight, 5);

    // Progress indicator
    fill(255);
    stroke(0);
    strokeWeight(2);
    let indicatorX = barX + progress * barWidth;
    ellipse(indicatorX, barY + barHeight / 2, 20, 20);
  }

  drawSurvivalBar() {
    let barWidth = 260;
    let barHeight = 16;
    let barX = width / 2 - barWidth / 2;
    let barY = 40;

    // Background
    fill(50);
    stroke(255);
    strokeWeight(2);
    rect(barX, barY, barWidth, barHeight, 8);

    // Fill (white to gray gradient based on survival)
    let fillWidth = barWidth * (this.survivalBar / 100);
    noStroke();
    let brightness = map(this.survivalBar, 0, 100, 100, 255);
    fill(brightness);
    rect(barX, barY, fillWidth, barHeight, 8);

    // Label
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(14);
    textFont(schoolbellFont);
    text("SURVIVAL", width / 2, barY + barHeight / 2);
  }

  drawLowWarning() {
    let message = this.lowWarningMessages[this.lowWarningIndex];
    textAlign(CENTER, CENTER);
    textSize(22);
    textFont(schoolbellFont);
    fill(180);
    text(message, width / 2, 90);
  }

  // Get camera offset for shake effect
  getCameraOffset() {
    return { x: this.shakeX, y: this.shakeY };
  }
}

// Global instance
let heartbeatGame = null;

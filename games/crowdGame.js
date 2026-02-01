// Crowd Puzzle Minigame for High School (Stage 3)
// Random unbalance mechanic:
// - Extrovert mode: extro bar drains -15%/sec → player must HIDE
// - Introvert mode: intro bar drains -15%/sec → player must SMILE

class CrowdGame {
  constructor() {
    this.active = false;
    this.status = "idle"; // idle, intro, playing, success, fail
    this.done = false;
    this.locksMovement = true;
    
    // Game timing
    this.introDurationMs = 3000; // 3 second intro
    this.phaseDurationMs = 10000; // 10 seconds per phase
    this.introStartMs = null;
    this.phaseStartMs = null;
    
    // Current phase: "extrovert" (must hide) or "introvert" (must smile)
    this.currentPhase = null;
    
    // Bar drain rate (15% per second = 0.15 per second)
    this.drainRatePerSecond = 0.15;
    
    // Survival bar for this minigame (0-1)
    this.survivalBar = 1.0;
    
    // Phase completion tracking
    this.phaseCompleted = false;
    
    // Visual feedback
    this.feedbackText = "";
    this.feedbackAlpha = 0;
    this.feedbackColor = [255, 255, 255];
    
    // Camera shake for stress effect
    this.shakeIntensity = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    
    // Heartbeat integration
    this.heartbeatActive = false;
    this.heartScale = 1;
    this.heartTargetScale = 1;
    this.lastBeatTime = 0;
    this.bpm = 100; // Faster heartbeat during stress
    
    // Jiggle text for instructions
    this.titleText = new JiggleText("", width / 2, height * 0.15, 36, {
      color: 0,
      jiggleX: 2,
      jiggleY: 2,
      jiggleRot: 0.03,
    });
    this.instructionText = new JiggleText("", width / 2, height * 0.22, 24, {
      color: 0,
      jiggleX: 1,
      jiggleY: 1,
      jiggleRot: 0.02,
    });
    this.countdownText = new JiggleText("", width / 2, height * 0.5, 64, {
      color: [255, 0, 0],
      jiggleX: 3,
      jiggleY: 3,
      jiggleRot: 0.05,
    });
    
    // Fail state timing
    this.failStartMs = null;
    this.failDurationMs = 2000; // 2 seconds to show fail message before heartbeat
    this.triggerHeartbeat = false;
  }

  start() {
    this.active = true;
    this.status = "intro";
    this.done = false;
    this.introStartMs = this._nowMs();
    this.phaseStartMs = null;
    this.failStartMs = null;
    this.survivalBar = 1.0;
    this.phaseCompleted = false;
    this.triggerHeartbeat = false;
    
    // Randomly choose phase: "extrovert" (hide) or "introvert" (smile)
    this.currentPhase = Math.random() < 0.5 ? "extrovert" : "introvert";
    
    // Start heartbeat sound
    if (heartbeatSound && !heartbeatSound.isPlaying()) {
      heartbeatSound.setLoop(true);
      heartbeatSound.play();
    }
    
    console.log('CrowdGame started - Phase:', this.currentPhase);
  }

  stop() {
    this.active = false;
    this.status = "idle";
    
    // Stop heartbeat sound
    if (heartbeatSound && heartbeatSound.isPlaying()) {
      heartbeatSound.stop();
    }
  }

  update() {
    if (!this.active || this.done) return;
    
    const now = this._nowMs();
    
    // Update camera shake
    if (this.shakeIntensity > 0) {
      this.shakeX = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeY = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeIntensity *= 0.95;
      if (this.shakeIntensity < 0.5) this.shakeIntensity = 0;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
    }
    
    // Update heart animation (heartbeat effect)
    this.heartScale = lerp(this.heartScale, this.heartTargetScale, 0.2);
    if (Math.abs(this.heartScale - this.heartTargetScale) < 0.01) {
      this.heartTargetScale = 1;
    }
    
    // Heartbeat pulse
    const beatInterval = 60000 / this.bpm;
    if (now - this.lastBeatTime > beatInterval) {
      this.lastBeatTime = now;
      this.heartTargetScale = 1.15;
      this.shakeIntensity = Math.max(this.shakeIntensity, 2);
    }
    
    // Update feedback alpha
    if (this.feedbackAlpha > 0) {
      this.feedbackAlpha -= 5;
    }
    
    // Handle phases
    if (this.status === "intro") {
      const elapsed = now - this.introStartMs;
      if (elapsed >= this.introDurationMs) {
        this.status = "playing";
        this.phaseStartMs = now;
      }
      return;
    }
    
    if (this.status === "playing") {
      const elapsed = now - this.phaseStartMs;
      const deltaTime = 1 / 60; // Approximate frame time
      
      // Check if player is doing the correct action
      const isHiding = game && game.hid === 2;
      const isSmiling = game && game.smiled === 2;
      
      if (this.currentPhase === "extrovert") {
        // Must hide to survive
        if (isHiding) {
          // Player is hiding correctly - bar recovers slowly
          this.survivalBar = Math.min(1.0, this.survivalBar + 0.05 * deltaTime);
          this.showFeedback("Hidden!", [180, 180, 180]);
        } else {
          // Player not hiding - bar drains
          this.survivalBar -= this.drainRatePerSecond * deltaTime;
          this.shakeIntensity = Math.max(this.shakeIntensity, 4);
        }
      } else {
        // Introvert phase - must smile to survive
        if (isSmiling) {
          // Player is smiling correctly - bar recovers slowly
          this.survivalBar = Math.min(1.0, this.survivalBar + 0.05 * deltaTime);
          this.showFeedback("Smiling!", [200, 200, 200]);
        } else {
          // Player not smiling - bar drains
          this.survivalBar -= this.drainRatePerSecond * deltaTime;
          this.shakeIntensity = Math.max(this.shakeIntensity, 4);
        }
      }
      
      // Clamp survival bar
      this.survivalBar = Math.max(0, Math.min(1, this.survivalBar));
      
      // Check for failure
      if (this.survivalBar <= 0) {
        this.status = "fail";
        this.failStartMs = this._nowMs();
        console.log('CrowdGame failed - starting panic attack sequence');
        return;
      }
      
      // Check for phase completion (survived 10 seconds)
      if (elapsed >= this.phaseDurationMs) {
        this.status = "success";
        this.done = true;
        console.log('CrowdGame completed successfully');
        return;
      }
    }
    
    // Handle fail state - wait then trigger heartbeat game
    if (this.status === "fail") {
      const elapsed = this._nowMs() - this.failStartMs;
      if (elapsed >= this.failDurationMs) {
        this.triggerHeartbeat = true;
        this.done = true;
        console.log('Triggering heartbeat panic attack game');
      }
    }
  }

  isDone() {
    return this.done;
  }

  showFeedback(text, color) {
    this.feedbackText = text;
    this.feedbackColor = color;
    this.feedbackAlpha = 200;
  }

  draw() {
    if (!this.active) return;
    
    push();
    
    // Apply camera shake
    translate(this.shakeX, this.shakeY);
    
    // Draw the crowd overlay
    if (crowdSprite) {
      // Scale crowd to fit screen width, maintaining aspect ratio
      const crowdRatio = crowdSprite.width / crowdSprite.height;
      const crowdH = height * 0.8;
      const crowdW = crowdH * crowdRatio;
      const crowdX = width / 2 - crowdW / 2;
      const crowdY = height - crowdH;
      
      // Draw crowd with slight pulse based on heartbeat
      push();
      imageMode(CORNER);
      const scale = this.heartScale;
      const scaledW = crowdW * scale;
      const scaledH = crowdH * scale;
      const offsetX = (crowdW - scaledW) / 2;
      const offsetY = (crowdH - scaledH) / 2;
      image(crowdSprite, crowdX + offsetX, crowdY + offsetY, scaledW, scaledH);
      pop();
    }
    
    // Draw character close-up sprite based on current action
    // For extrovert phase (hiding): show teenStandHide (Stand_teenClose.png)
    // For introvert phase (smiling): show mirrorTeenSmiling (SMirror_Teen.png)
    // Default: show mirrorTeenNotSmiling (Mirror_Teen.png)
    
    let characterSprite;
    if (this.currentPhase === "extrovert" && game && game.hid === 2) {
      // Player is hiding - show close-up hiding sprite
      characterSprite = teenStandHide;
    } else if (this.currentPhase === "introvert" && game && game.smiled === 2) {
      // Player is smiling - show smiling mirror sprite
      characterSprite = mirrorTeenSmiling;
    } else {
      // Default - show neutral mirror sprite
      characterSprite = mirrorTeenNotSmiling;
    }
    
    if (characterSprite) {
      // Zoom in and crop - show upper body (top 60% of sprite)
      const cropRatio = 0.6; // Show top 60% of the sprite
      const srcH = characterSprite.height * cropRatio;
      const srcW = characterSprite.width;
      
      // Scale to fit nicely on screen with heartbeat pulse
      const displayScale = 1.5 * this.heartScale;
      const drawW = srcW * displayScale;
      const drawH = srcH * displayScale;
      const drawX = width / 2 - drawW / 2;
      const drawY = height - drawH - 20;
      
      // Draw cropped sprite (top portion only)
      push();
      imageMode(CORNER);
      // Use copy to crop: image, sx, sy, sw, sh, dx, dy, dw, dh
      copy(characterSprite, 0, 0, srcW, srcH, drawX, drawY, drawW, drawH);
      pop();
    }
    
    // Draw UI elements
    textAlign(CENTER, CENTER);
    textFont(schoolbellFont);
    
    if (this.status === "intro") {
      // Show phase intro
      const elapsed = this._nowMs() - this.introStartMs;
      const countdown = Math.ceil((this.introDurationMs - elapsed) / 1000);
      
      // Dark overlay during intro
      fill(0, 0, 0, 150);
      rect(0, 0, width, height);
      
      // Title based on phase
      if (this.currentPhase === "extrovert") {
        this.titleText.setText("CROWD APPROACHING!");
        this.instructionText.setText("Cover your face to HIDE!");
      } else {
        this.titleText.setText("FEELING ISOLATED!");
        this.instructionText.setText("SMILE to connect!");
      }
      
      this.titleText.color = 255;
      this.titleText.setPosition(width / 2, height * 0.35);
      this.titleText.size = Math.max(32, Math.min(width, height) * 0.06);
      this.titleText.show();
      
      this.instructionText.color = 255;
      this.instructionText.setPosition(width / 2, height * 0.45);
      this.instructionText.size = Math.max(20, Math.min(width, height) * 0.035);
      this.instructionText.show();
      
      this.countdownText.setText(String(countdown));
      this.countdownText.setPosition(width / 2, height * 0.6);
      this.countdownText.size = Math.max(48, Math.min(width, height) * 0.1);
      this.countdownText.show();
      
    } else if (this.status === "playing") {
      // Draw survival bar at top
      this.drawSurvivalBar();
      
      // Draw time remaining
      const elapsed = this._nowMs() - this.phaseStartMs;
      const timeLeft = Math.max(0, (this.phaseDurationMs - elapsed) / 1000);
      
      fill(0);
      textSize(Math.max(18, Math.min(width, height) * 0.03));
      text("Time: " + timeLeft.toFixed(1) + "s", width / 2, 90);
      
      // Draw instruction reminder
      if (this.currentPhase === "extrovert") {
        this.instructionText.setText("HIDE your face!");
        this.instructionText.color = game && game.hid === 2 ? [100, 200, 100] : [200, 100, 100];
      } else {
        this.instructionText.setText("SMILE!");
        this.instructionText.color = game && game.smiled === 2 ? [100, 200, 100] : [200, 100, 100];
      }
      this.instructionText.setPosition(width / 2, 120);
      this.instructionText.size = Math.max(18, Math.min(width, height) * 0.03);
      this.instructionText.show();
      
      // Draw feedback
      if (this.feedbackAlpha > 0) {
        fill(this.feedbackColor[0], this.feedbackColor[1], this.feedbackColor[2], this.feedbackAlpha);
        textSize(32);
        text(this.feedbackText, width / 2, height / 2 - 100);
      }
      
    } else if (this.status === "success") {
      // Success screen
      fill(0, 0, 0, 150);
      rect(0, 0, width, height);
      
      fill(200, 255, 200);
      textSize(48);
      text("You made it through!", width / 2, height / 2);
      
    } else if (this.status === "fail") {
      // Fail screen - panic attack incoming
      fill(0, 0, 0, 180);
      rect(0, 0, width, height);
      
      // Pulsing text effect
      const elapsed = this._nowMs() - this.failStartMs;
      const pulse = 1 + 0.1 * Math.sin(elapsed * 0.01);
      
      push();
      translate(width / 2, height / 2 - 40);
      scale(pulse);
      fill(255, 150, 150);
      textSize(48);
      text("Overwhelmed...", 0, 0);
      pop();
      
      // "Try again" message with countdown
      const timeLeft = Math.max(0, (this.failDurationMs - elapsed) / 1000);
      fill(200, 200, 200);
      textSize(28);
      text("Panic Attack incoming!", width / 2, height / 2 + 30);
      
      fill(255, 100, 100);
      textSize(36);
      text("Calm down in " + Math.ceil(timeLeft) + "...", width / 2, height / 2 + 80);
    }
    
    pop();
  }

  drawSurvivalBar() {
    const barWidth = Math.min(width * 0.6, 400);
    const barHeight = 24;
    const barX = width / 2 - barWidth / 2;
    const barY = 40;
    const radius = barHeight / 2;
    
    // Background
    fill(50);
    stroke(0);
    strokeWeight(3);
    rect(barX, barY, barWidth, barHeight, radius);
    
    // Fill based on survival
    const fillWidth = barWidth * this.survivalBar;
    noStroke();
    
    // Color gradient: green -> yellow -> red based on survival
    let barColor;
    if (this.survivalBar > 0.6) {
      barColor = color(180, 220, 180); // Light green
    } else if (this.survivalBar > 0.3) {
      barColor = color(220, 220, 150); // Yellow
    } else {
      barColor = color(220, 150, 150); // Red
    }
    fill(barColor);
    rect(barX, barY, fillWidth, barHeight, radius);
    
    // Label
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    textFont(schoolbellFont);
    text("COMPOSURE", width / 2, barY + barHeight / 2);
  }

  _nowMs() {
    if (typeof millis === "function") return millis();
    return Date.now();
  }
}

// Global instance
let crowdGame = null;

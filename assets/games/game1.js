//sketch.js detect smile, copy code from astryd  

class Game1 {
  constructor() {
    this.active = false;
  }

  start() {
    this.active = true;
  }

  stop() {
    this.active = false;
  }

  update() {
    // Placeholder for minigame logic
  }

  draw() {
    if (!this.active) return;
    push();
    noStroke();
    fill(0, 180);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(Math.max(16, Math.min(width, height) * 0.05));
    text('Minigame 1 (placeholder)', width / 2, height / 2 - 20);
    textSize(Math.max(12, Math.min(width, height) * 0.025));
    text('Press Esc to close', width / 2, height / 2 + 30);
    pop();
  }
}

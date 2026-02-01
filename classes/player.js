
class Player {
  constructor(x) {
    this.x = x;

    this.speed = 8;
    this.spriteW = 120;
    this.spriteH = 120;

    // Animation
    this.animFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 8; // frames between animation changes
    this.direction = 0; // 0 = idle, -1 = left, 1 = right
  }

  update(stage) {
    if (stage) {
      this.x = constrain(this.x, stage.xMin, stage.xMax);
    }
  }

  // Call this to update animation based on movement
  updateAnimation(movingLeft, movingRight) {
    if (movingLeft) {
      this.direction = -1;
      this.animTimer++;
      if (this.animTimer >= this.animSpeed) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 3;
      }
    } else if (movingRight) {
      this.direction = 1;
      this.animTimer++;
      if (this.animTimer >= this.animSpeed) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 3;
      }
    } else {
      // Not moving - reset to idle
      this.direction = 0;
      this.animFrame = 0;
      this.animTimer = 0;
    }
  }

  draw(cameraX = 0) {
    let sprite;

    if (this.direction === -1) {
      // Walking left
      sprite = playerWalkLeft[this.animFrame];
    } else if (this.direction === 1) {
      // Walking right
      sprite = playerWalkRight[this.animFrame];
    } else {
      // Standing idle
      sprite = playerStand;
    }

    if (sprite) {
      // Use original aspect ratio, scaled up
      let scale = 1; // Scale factor to make it bigger
      let drawW = sprite.width * scale;
      let drawH = sprite.height * scale;

      // Update collision dimensions
      this.spriteW = drawW;
      this.spriteH = drawH;

      let y = height - drawH - 20;
      image(sprite, this.x - cameraX - drawW / 2, y, drawW, drawH);
    }
  }
}

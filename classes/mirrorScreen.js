class MirrorScreen extends Stage {
  constructor() {
    super();
    this.bg = 110;
    this.exitMargin = 100;
    this.spriteW = null;
    this.spriteH = null;
    this.exitCooldownFrames = 0;
    this.mirrorX = width / 2;
  }

  updateBounds() {
    this.xMin = -this.exitMargin;
    this.xMax = width + this.exitMargin;
  }

  show() {
    this.updateBounds();
    background(this.bg);

    const sprite = mirrorTeenSprite || mirrorSprite;
    const w = this.spriteW ?? (sprite ? sprite.width : 100);
    const h = this.spriteH ?? (sprite ? sprite.height : 100);
    const scale = 0.8;
    const drawW = w * scale;
    const drawH = h * scale;
    const x = this.mirrorX - drawW / 2;
    const y = height - drawH;

    if (sprite) {
      image(sprite, x, y, drawW, drawH);
    }

    // Foreground overlay
    if (mirrorSCSprite) {
      image(mirrorSCSprite, 0, 0, width, height);
    }
  }

  updateMirrorPosition(moveLeft, moveRight, speed = 8) {
    if (moveLeft) this.mirrorX -= speed;
    if (moveRight) this.mirrorX += speed;
  }

  shouldExit(player) {
    if (this.exitCooldownFrames > 0) {
      this.exitCooldownFrames -= 1;
      return false;
    }
    return player.x < -this.exitMargin || player.x > width + this.exitMargin;
  }
}

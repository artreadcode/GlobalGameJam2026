class MirrorScreen extends Stage {
  constructor() {
    super();
    this.bg = 20;
    this.exitMargin = 100;
    this.spriteW = null;
    this.spriteH = null;
    this.exitCooldownFrames = 0;
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
    const x = width / 2 - w / 2;
    const y = height - h;

    if (sprite) {
      image(sprite, x, y, w, h);
    }
  }

  shouldExit(player) {
    if (this.exitCooldownFrames > 0) {
      this.exitCooldownFrames -= 1;
      return false;
    }
    return player.x < -this.exitMargin || player.x > width + this.exitMargin;
  }
}

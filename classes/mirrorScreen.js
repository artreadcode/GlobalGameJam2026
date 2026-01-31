class MirrorScreen extends Stage {
  constructor() {
    super();
    this.bg = 20;
    this.exitMargin = 100;
    this.spriteW = null;
    this.spriteH = null;
  }

  updateBounds() {
    this.xMin = -this.exitMargin;
    this.xMax = width + this.exitMargin;
  }

  show() {
    this.updateBounds();
    background(this.bg);

    const w = this.spriteW ?? (mirrorSprite ? mirrorSprite.width : 100);
    const h = this.spriteH ?? (mirrorSprite ? mirrorSprite.height : 100);
    const x = width / 2 - w / 2;
    const y = height - h;

    if (mirrorSprite) {
      image(mirrorSprite, x, y, w, h);
    }
  }

  shouldExit(player) {
    return player.x < -this.exitMargin || player.x > width + this.exitMargin;
  }
}

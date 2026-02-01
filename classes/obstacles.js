class Obstacle {
  constructor(x, w, h, options = {}) {
    this.x = x;
    this.sprite = options.sprite ?? null;
    this.w = w ?? (this.sprite ? this.sprite.width : 64);
    this.h = h ?? (this.sprite ? this.sprite.height : 64);
    this.yOffset = options.yOffset ?? 0;
    this.actionType = options.actionType ?? null;
    this.actionId = options.actionId ?? null;
    this.triggerOnce = options.triggerOnce ?? true;
    this.triggered = false;
    this.visible = options.visible ?? true;
    this.color = options.color ?? [200, 200, 200];
  }

  draw(cameraX = 0) {
    if (!this.visible) return;
    const y = height - this.h - this.yOffset;
    if (this.sprite) {
      image(this.sprite, this.x - cameraX, y, this.w, this.h);
      return;
    }

    push();
    fill(this.color[0], this.color[1], this.color[2]);
    rect(this.x - cameraX, y, this.w, this.h);
    pop();
  }

  overlaps(player) {
    // Player x is center-based
    const playerLeft = player.x - player.spriteW / 2;
    const playerRight = player.x + player.spriteW / 2;
    const playerTop = height - player.spriteH - 20;
    const playerBottom = height - 20;

    const obsLeft = this.x;
    const obsRight = this.x + this.w;
    const obsTop = height - this.h - this.yOffset;
    const obsBottom = height - this.yOffset;

    return (
      playerRight > obsLeft &&
      playerLeft < obsRight &&
      playerBottom > obsTop &&
      playerTop < obsBottom
    );
  }

  hit(player) {
    if (this.triggerOnce && this.triggered) return false;
    if (!this.overlaps(player)) return false;
    if (this.triggerOnce) this.triggered = true;
    return true;
  }
}

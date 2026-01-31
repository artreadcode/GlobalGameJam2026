class Obstacle {
  constructor(x, w, h, options = {}) {
    this.x = x;
    this.sprite = options.sprite ?? null;
    this.w = w ?? (this.sprite ? this.sprite.width : 64);
    this.h = h ?? (this.sprite ? this.sprite.height : 64);
    this.actionType = options.actionType ?? null;
    this.actionId = options.actionId ?? null;
    this.triggerOnce = options.triggerOnce ?? true;
    this.triggered = false;
    this.color = options.color ?? [200, 200, 200];
  }

  draw(cameraX = 0) {
    const y = height - this.h;
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
    const playerLeft = player.x;
    const playerRight = player.x + player.spriteW;
    const playerTop = height - player.spriteH;
    const playerBottom = height;

    const obsLeft = this.x;
    const obsRight = this.x + this.w;
    const obsTop = height - this.h;
    const obsBottom = height;

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

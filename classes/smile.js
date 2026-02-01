class Smile {
  constructor(options = {}) {
    if (typeof options === "number") {
      options = { durationMs: options };
    }

    const durationSeconds = typeof options.durationSeconds === "number"
      ? options.durationSeconds
      : (typeof options.duration === "number" ? options.duration : null);
    const durationMs = typeof options.durationMs === "number"
      ? options.durationMs
      : (durationSeconds !== null ? durationSeconds * 1000 : 7000);

    this.targetMs = Math.max(0, durationMs);
    this.type = Number(options.type) === 2 ? 2 : 1;
    this.drainMultiplier = typeof options.drainMultiplier === "number"
      ? Math.max(0, options.drainMultiplier)
      : 1;
    this.detector = typeof options.detector === "function"
      ? options.detector
      : (typeof detectSmile === "function" ? detectSmile : null);

    this.reset();
  }

  reset() {
    this.active = false;
    this.progressMs = 0;
    this.isSmiling = false;
    this.complete = false;
    this.failed = false;
    this.smileStartTime = null;
    this.noSmileStartTime = null;
    this.progressAtSmileStart = 0;
    this.progressAtNoSmileStart = 0;
  }

  start() {
    this.active = true;
    this.progressMs = 0;
    this.isSmiling = false;
    this.complete = false;
    this.failed = false;
    this.smileStartTime = null;
    this.noSmileStartTime = null;
    this.progressAtSmileStart = 0;
    this.progressAtNoSmileStart = 0;
  }

  stop() {
    this.active = false;
    this.smileStartTime = null;
    this.noSmileStartTime = null;
  }

  update() {
    if (!this.active || this.complete || this.failed) return;

    const now = this._nowMs();
    this.isSmiling = this.detector ? !!this.detector() : false;

    if (this.isSmiling) {
      this.noSmileStartTime = null;
      if (this.smileStartTime === null) {
        this.smileStartTime = now;
        this.progressAtSmileStart = this.progressMs;
      }
      const elapsed = Math.max(0, now - this.smileStartTime);
      if (this.type === 1) {
        this.progressMs = Math.min(this.targetMs, this.progressAtSmileStart + elapsed);
      } else {
        this.progressMs = Math.min(this.targetMs, elapsed);
      }
      if (this.progressMs >= this.targetMs) {
        this.complete = true;
      }
      return;
    }

    this.smileStartTime = null;
    if (this.type === 1) {
      if (this.noSmileStartTime === null) {
        this.noSmileStartTime = now;
        this.progressAtNoSmileStart = this.progressMs;
      }
      const elapsed = Math.max(0, now - this.noSmileStartTime);
      this.progressMs = Math.max(0, this.progressAtNoSmileStart - elapsed * this.drainMultiplier);
    } else {
      if (this.progressMs > 0) {
        this.failed = true;
      }
    }
  }

  getProgress() {
    if (this.targetMs <= 0) return 1;
    return this.progressMs / this.targetMs;
  }

  getTimeRemainingMs() {
    return Math.max(0, this.targetMs - this.progressMs);
  }

  _nowMs() {
    if (typeof millis === "function") return millis();
    return Date.now();
  }
}

class Camera {
  constructor() {
    this.x = 0;
  }

  update(stage, targetX) {
    if (!stage) {
      this.x = 0;
      return this.x;
    }

    const stageWidth = stage.xMax - stage.xMin;
    const maxCam = stage.xMin + Math.max(0, stageWidth - width);
    this.x = constrain(targetX - width / 2, stage.xMin, maxCam);
    return this.x;
  }
}

// Parallax layers for different stages
// Stage 1 (bedroom): wall -> floor -> back -> mid -> player -> front
// Stage 2 (living room): wall -> floor -> mid -> player -> front

class Parallax {
  constructor() {
    this.currentStage = 1;

    // Layers drawn BEFORE player (background)
    this.backLayers = [
      { name: "wall", x: 0, speed: 0.1, img: null },
      { name: "floor", x: 0, speed: 0, img: null },
      { name: "back", x: 0, speed: 0.3, img: null },
      { name: "mid", x: 0, speed: 0.5, img: null },
    ];
    // Layers drawn AFTER player (foreground)
    this.frontLayers = [
      { name: "front", x: 0, speed: 1.0, img: null },
    ];
  }

  // Set stage and load appropriate images
  setStage(stageNum) {
    this.currentStage = stageNum;
    // Reset layer positions
    for (let layer of this.backLayers) {
      layer.x = 0;
    }
    for (let layer of this.frontLayers) {
      layer.x = 0;
    }

    if (stageNum === 1) {
      // Stage 1: Bedroom
      this.backLayers = [
        { name: "wall", x: 0, speed: 0.1, img: bedroomWall },
        { name: "floor", x: 0, speed: 0, img: bedroomFloor },
        { name: "back", x: 0, speed: 0.3, img: bedroomBack },
        { name: "mid", x: 0, speed: 0.5, img: bedroomMid },
      ];
      this.frontLayers = [
        { name: "front", x: 0, speed: 1.0, img: bedroomFront },
      ];
      console.log('Parallax set to Stage 1: Bedroom');
    } else if (stageNum === 2) {
      // Stage 2: Living room (wall -> floor -> mid -> player -> front)
      this.backLayers = [
        { name: "wall", x: 0, speed: 0.1, img: livingroomWall },
        { name: "floor", x: 0, speed: 0, img: livingroomFloor },
        { name: "mid", x: 0, speed: 0.5, img: livingroomMid },
      ];
      this.frontLayers = [
        { name: "front", x: 0, speed: 1.0, img: livingroomFront },
      ];
      console.log('Parallax set to Stage 2: Living Room');
    }
  }

  // Call this after images are loaded (for initial stage 1)
  setImages() {
    this.setStage(1);
  }

  update(deltaX) {
    for (let layer of this.backLayers) {
      if (layer.speed > 0) {
        layer.x -= deltaX * layer.speed;
      }
    }
    for (let layer of this.frontLayers) {
      if (layer.speed > 0) {
        layer.x -= deltaX * layer.speed;
      }
    }
  }

  draw() {
    // Set images if not already set
    if (!this.backLayers[0].img) {
      this.setImages();
    }

    // Black background behind everything
    background(0);

    // Draw back layers (wall -> mid) before player
    for (let layer of this.backLayers) {
      this.drawLayer(layer);
    }
  }

  // Draw the front layers (call this after drawing the player)
  drawFront() {
    // Draw front layers (floor -> front) after player
    for (let layer of this.frontLayers) {
      this.drawLayer(layer);
    }
  }

  // Helper to draw a single layer
  drawLayer(layer) {
    if (!layer.img) return;

    let imgRatio = layer.img.width / layer.img.height;
    let drawH = height;
    let drawW = drawH * imgRatio;

    let xPos = layer.x % drawW;
    if (xPos > 0) xPos -= drawW;

    for (let x = xPos; x < width; x += drawW) {
      image(layer.img, x, 0, drawW, drawH);
    }
  }
}

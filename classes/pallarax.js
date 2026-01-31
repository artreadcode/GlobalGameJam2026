// Bedroom parallax layers for Stage 1
// Layer order (back to front): wall -> mid -> player -> floor -> front

class Parallax {
  constructor() {
    // Layers drawn BEFORE player (background)
    this.backLayers = [
      { name: "wall", x: 0, speed: 0.1, img: null },    // 5: wall background, slowest
      { name: "back", x: 0, speed: 0.3, img: null },    // 4: furniture (bed, lamp, bookshelf)
      { name: "mid", x: 0, speed: 0.5, img: null },     // 3: decorations (window, papers)
      { name: "floor", x: 0, speed: 0, img: null },     // 2: floor, stable
    ];
    // Layers drawn AFTER player (foreground)
    this.frontLayers = [
      { name: "front", x: 0, speed: 1.0, img: null },   // 1: front, topmost
    ];
  }

  // Call this after images are loaded
  setImages() {
    this.backLayers[0].img = bedroomWall;
    this.backLayers[1].img = bedroomBack;
    this.backLayers[2].img = bedroomMid;
    this.backLayers[3].img = bedroomFloor;
    this.frontLayers[0].img = bedroomFront;

    // Debug: check if images loaded
    console.log('Wall loaded:', !!bedroomWall);
    console.log('Back loaded:', !!bedroomBack);
    console.log('Mid loaded:', !!bedroomMid);
    console.log('Floor loaded:', !!bedroomFloor);
    console.log('Front loaded:', !!bedroomFront);
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

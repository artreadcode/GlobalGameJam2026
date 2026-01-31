// Dark urban parallax - Little Nightmares style
// Use as a class to integrate with existing game

class Parallax {
  constructor() {
    this.layers = [
      { name: "far_buildings", x: 0, speed: 0.2, color: [60, 75, 95] },
      { name: "mid_buildings", x: 0, speed: 0.4, color: [50, 65, 85] },
      { name: "clothesline_back", x: 0, speed: 0.6, color: [70, 85, 105] },
      { name: "clothesline_mid", x: 0, speed: 0.8, color: [80, 95, 115] },
      { name: "clothesline_front", x: 0, speed: 1.0, color: [40, 50, 65] },
      { name: "foreground", x: 0, speed: 1.2, color: [35, 45, 55] },
    ];
  }

  update(pressedKeys) {
    for (let layer of this.layers) {
      // Move layers based on player movement
      if (pressedKeys.d) {
        layer.x -= layer.speed;
      }
      if (pressedKeys.a) {
        layer.x += layer.speed;
      }

      // Wrap layers
      if (layer.x < -width) layer.x = 0;
      if (layer.x > 0) layer.x = -width;
    }
  }

  draw() {
    // Gradient sky background (foggy blue)
    for (let y = 0; y < height; y++) {
      let inter = map(y, 0, height, 0, 1);
      let c = lerpColor(color(85, 105, 130), color(55, 70, 90), inter);
      stroke(c);
      line(0, y, width, y);
    }
    noStroke();

    // Draw parallax layers
    for (let layer of this.layers) {
      this.drawLayer(layer, layer.x);
      this.drawLayer(layer, layer.x + width);
    }

    // Draw floor
    fill(30, 38, 48);
    rect(0, height - 26, width, 30);

    // Floor details (debris)
    fill(25, 32, 42);
    rect(50, height - 24, 20, 5);
    rect(150, height - 22, 15, 4);
    rect(280, height - 23, 25, 5);
    rect(350, height - 21, 18, 3);

    // Fog overlay
    this.drawFog();
  }

  drawLayer(layer, xOffset) {
    push();
    translate(xOffset, 0);

    let groundY = height - 26;

    switch (layer.name) {
      case "far_buildings":
        fill(layer.color);
        // Tall distant buildings
        rect(20, 20, 50, groundY - 20);
        rect(80, 40, 40, groundY - 40);
        rect(280, 10, 60, groundY - 10);
        rect(350, 30, 45, groundY - 30);
        // Windows (dim lights)
        fill(90, 110, 130);
        for (let i = 0; i < 5; i++) {
          rect(30, 40 + i * 30, 8, 12);
          rect(52, 50 + i * 30, 8, 12);
          rect(295, 30 + i * 30, 8, 12);
        }
        break;

      case "mid_buildings":
        fill(layer.color);
        rect(0, 50, 70, groundY - 50);
        rect(150, 30, 80, groundY - 30);
        rect(320, 60, 65, groundY - 60);
        // Balconies
        fill(40, 52, 68);
        rect(150, 80, 80, 5);
        rect(150, 130, 80, 5);
        break;

      case "clothesline_back":
        // Rope
        stroke(60, 70, 85);
        strokeWeight(1);
        line(0, 60, width, 70);
        line(0, 100, width, 95);
        noStroke();
        // Hanging clothes (small, distant)
        fill(layer.color);
        this.drawClothes(50, 62, 0.6);
        this.drawClothes(150, 65, 0.6);
        this.drawClothes(250, 68, 0.6);
        this.drawClothes(100, 97, 0.6);
        this.drawClothes(200, 95, 0.6);
        this.drawClothes(320, 96, 0.6);
        break;

      case "clothesline_mid":
        // Rope
        stroke(70, 85, 100);
        strokeWeight(1);
        line(0, 45, width, 55);
        line(0, 120, width, 115);
        noStroke();
        // Hanging clothes (medium)
        fill(55, 65, 80);
        this.drawClothes(80, 48, 0.8);
        this.drawClothes(180, 52, 0.8);
        this.drawClothes(300, 54, 0.8);
        fill(70, 80, 95);
        this.drawClothes(40, 117, 0.8);
        this.drawClothes(140, 115, 0.8);
        this.drawClothes(260, 116, 0.8);
        break;

      case "clothesline_front":
        // Rope
        stroke(50, 60, 75);
        strokeWeight(2);
        line(0, 35, width, 40);
        noStroke();
        // Hanging clothes (larger, closer)
        fill(35, 45, 60);
        this.drawClothes(60, 38, 1.2);
        this.drawClothes(160, 39, 1.2);
        fill(45, 55, 70);
        this.drawClothes(280, 40, 1.2);
        this.drawClothes(350, 39, 1.2);
        break;

      case "foreground":
        // Side walls/structures
        fill(layer.color);
        rect(-10, 100, 40, groundY - 80);
        rect(360, 80, 40, groundY - 60);
        // Railings
        fill(45, 55, 70);
        rect(30, groundY - 20, 60, 4);
        rect(300, groundY - 15, 50, 4);
        // Railing posts
        rect(30, groundY - 20, 4, 20);
        rect(86, groundY - 20, 4, 20);
        rect(300, groundY - 15, 4, 18);
        rect(346, groundY - 15, 4, 18);
        break;
    }
    pop();
  }

  drawClothes(x, y, s) {
    push();
    translate(x, y);
    scale(s, s);

    // Different clothing types based on position
    let type = int(x * 0.1) % 4;

    if (type === 0) {
      // Shirt
      rect(-8, 0, 16, 20);
      rect(-12, 0, 4, 12);
      rect(8, 0, 4, 12);
    } else if (type === 1) {
      // Pants
      rect(-6, 0, 5, 25);
      rect(1, 0, 5, 25);
      rect(-6, 0, 12, 8);
    } else if (type === 2) {
      // Dress/coat
      beginShape();
      vertex(-5, 0);
      vertex(5, 0);
      vertex(10, 30);
      vertex(-10, 30);
      endShape(CLOSE);
    } else {
      // Towel/blanket
      rect(-10, 0, 20, 18);
    }
    pop();
  }

  drawFog() {
    noStroke();

    // Light beam from center top
    fill(100, 120, 145, 15);
    beginShape();
    vertex(150, 0);
    vertex(250, 0);
    vertex(300, height);
    vertex(100, height);
    endShape(CLOSE);

    // Bottom fog
    for (let i = 0; i < 3; i++) {
      fill(70, 85, 105, 20 - i * 5);
      rect(0, height - 56 + i * 15, width, 60);
    }

    // Side vignette
    for (let i = 0; i < 50; i++) {
      let alpha = map(i, 0, 50, 40, 0);
      fill(30, 40, 55, alpha);
      rect(0, 0, i * 2, height);
      rect(width - i * 2, 0, i * 2, height);
    }
  }
}

// Parallax layers for different stages
// Stage 1 (bedroom): white bg -> floor -> back -> mid -> door (rightmost) -> player -> front
// Stage 2 (living room): wall -> floor -> mid -> player -> front

class Parallax {
  constructor() {
    this.currentStage = 1;

    // Layers drawn BEFORE player (background)
    this.backLayers = [
      { name: "floor", x: 0, speed: 0, img: null },
      { name: "back", x: 0, speed: 0.3, img: null },
      { name: "mid", x: 0, speed: 0.5, img: null },
    ];
    // Layers drawn AFTER player (foreground)
    this.frontLayers = [
      { name: "front", x: 0, speed: 1.0, img: null },
    ];

    // Door for scene transition (positioned at rightmost, same speed as back layer)
    this.door = { x: 0, speed: 0.3, img: null };
    this.sceneWidth = 0; // Will be set based on back_bedroom image
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
      // Stage 1: Bedroom - white background (no wall), mid layer, door at rightmost
      this.backLayers = [
        { name: "floor", x: 0, speed: 0, img: bedroomFloor },
        { name: "back", x: 0, speed: 0.3, img: bedroomBack },
        { name: "mid", x: 0, speed: 0.5, img: bedroomMid },
      ];
      this.frontLayers = [
        { name: "front", x: 0, speed: 1.0, img: bedroomFront },
      ];
      // Door handled by mirror obstacle; keep parallax door hidden.
      this.door = { x: 0, speed: 0.3, img: null };
      // Scene width will be calculated in draw based on back image
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
      this.door = { x: 0, speed: 0, img: null };
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
    // Door uses cameraX directly, no parallax update needed
  }

  draw(cameraX = 0) {
    // Set images if not already set
    if (!this.backLayers[0].img) {
      this.setImages();
    }

    // White background for stage 1 (bedroom), black for others
    if (this.currentStage === 1) {
      background(255);
    } else {
      background(0);
    }

    // Draw back layers before player, with door between back and mid
    for (let layer of this.backLayers) {
      this.drawLayer(layer);
      // Draw door after "back" layer but before "mid" layer (so desk is in front of door)
      if (layer.name === "back" && this.currentStage === 1 && this.door && this.door.img) {
        this.drawDoor(cameraX);
      }
    }
  }

  // Draw the door at a fixed world position (like obstacles)
  drawDoor(cameraX) {
    if (!this.door.img) return;

    // Get scene width
    let sceneWidth = this.getSceneWidth();

    // Door dimensions
    let doorRatio = this.door.img.width / this.door.img.height;
    let doorDrawH = height * 0.4; // Door height (70% of screen)
    let doorDrawW = doorDrawH * doorRatio;

    // Door world position (at the right edge of scene)
    let doorWorldX = sceneWidth - doorDrawW + 70; // Further to the right

    // Convert to screen position using cameraX
    let doorScreenX = doorWorldX - cameraX;
    let floorHeight = height * 0.18; // Move door up a bit
    let doorY = height - doorDrawH - floorHeight; // Position door above floor

    image(this.door.img, doorScreenX, doorY, doorDrawW, doorDrawH);
  }

  // Draw the front layers (call this after drawing the player)
  drawFront() {
    // Draw front layers (floor -> front) after player
    for (let layer of this.frontLayers) {
      this.drawLayer(layer);
    }
  }

  // Helper to draw a single layer (no tiling - shows white background when scrolled)
  drawLayer(layer) {
    if (!layer.img) return;

    let imgRatio = layer.img.width / layer.img.height;
    let drawH = height;
    let drawW = drawH * imgRatio;

    // Floor layer tiles to fill screen (speed 0, static background)
    if (layer.name === "floor") {
      // Overlap tiles by 1 pixel to eliminate seam lines
      for (let x = 0; x < width + drawW; x += drawW - 1) {
        image(layer.img, x, 0, drawW, drawH);
      }
    } else {
      // Other layers draw once at parallax position (no repeating)
      image(layer.img, layer.x, 0, drawW, drawH);
    }
  }

  // Get the scene width based on back layer
  getSceneWidth() {
    let backLayer = this.backLayers.find(l => l.name === "back");
    if (!backLayer || !backLayer.img) return width;

    let backRatio = backLayer.img.width / backLayer.img.height;
    let baseWidth = height * backRatio;
    // Extend the room to push the door farther away
    return baseWidth * 2.5;
  }

  // Check if player has reached the door
  isPlayerAtDoor(playerX, cameraX) {
    if (!this.door || !this.door.img) return false;

    let sceneWidth = this.getSceneWidth();

    let doorRatio = this.door.img.width / this.door.img.height;
    let doorDrawH = height * 0.6;
    let doorDrawW = doorDrawH * doorRatio;

    // Door position at most right of extended scene
    let doorX = (sceneWidth - doorDrawW - 50) + this.door.x;

    // Player screen position
    let playerScreenX = playerX - cameraX;

    // Check if player overlaps with door area
    return playerScreenX >= doorX && playerScreenX <= doorX + doorDrawW;
  }
}

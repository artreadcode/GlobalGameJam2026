// Parallax layers for different stages
// Stage 1 Scene 0: Bedroom → door → Stage 1 Scene 1
// Stage 1 Scene 1: Living room → door → Stage 2
// Stage 2 Scene 0: High school → end → Stage 2 Scene 1
// Stage 2 Scene 1: Toilet → door

class Parallax {
  constructor() {
    this.currentStage = 1;
    this.currentScene = 0;

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

  // Set stage and scene, load appropriate images
  setStage(stageNum, sceneNum = 0) {
    this.currentStage = stageNum;
    this.currentScene = sceneNum;
    // Reset layer positions
    for (let layer of this.backLayers) {
      layer.x = 0;
    }
    for (let layer of this.frontLayers) {
      layer.x = 0;
    }

    if (stageNum === 1) {
      if (sceneNum === 0) {
        // Stage 1 Scene 0: Bedroom - door at end leads to Living room
        this.backLayers = [
          { name: "floor", x: 0, speed: 0, img: bedroomFloor },
          { name: "back", x: 0, speed: 0.3, img: bedroomBack },
          { name: "mid", x: 0, speed: 0.5, img: bedroomMid },
        ];
        this.frontLayers = [
          { name: "front", x: 0, speed: 1.0, img: bedroomFront },
        ];
        // Door at end of bedroom
        this.door = { x: 0, speed: 0.3, img: bedroomDoor };
        console.log('Parallax set to Stage 1 Scene 0: Bedroom');
      } else if (sceneNum === 1) {
        // Stage 1 Scene 1: Living room - door at end leads to Stage 2 (High school)
        // Draw order (back to front): wall -> floor -> door -> mid -> player -> front
        this.backLayers = [
          { name: "wall", x: 0, speed: 0, img: livingroomWall },
          { name: "floor", x: 0, speed: 0, img: livingroomFloor },
          { name: "mid", x: 0, speed: 0.5, img: livingroomMid },
        ];
        this.frontLayers = [
          { name: "front", x: 0, speed: 1.0, img: livingroomFront },
        ];
        // Door at end of living room - leads to high school
        this.door = { x: 0, speed: 0.3, img: livingroomDoor };
        console.log('Parallax set to Stage 1 Scene 1: Living room');
      }
    } else if (stageNum === 2) {
      if (sceneNum === 0) {
        // Stage 2 Scene 0: High school
        this.backLayers = [
          { name: "school", x: 0, speed: 0, img: schoolAssemble },
        ];
        this.frontLayers = [];
        this.door = { x: 0, speed: 0, img: null };
        console.log('Parallax set to Stage 2 Scene 0: High school');
      } else if (sceneNum === 1) {
        // Stage 2 Scene 1: Toilet - camera scrolling, door behind player
        // Draw order (back to front): wall -> floor -> back -> door -> mid -> player
        this.backLayers = [
          { name: "wall", x: 0, speed: 0, img: toiletWall },
          { name: "toiletfloor", x: 0, speed: 0, img: toiletFloor },
          { name: "back", x: 0, speed: 0, img: toiletBack },
          { name: "toiletdoor", x: 0, speed: 0, img: toiletDoor },
          { name: "mid", x: 0, speed: 0, img: toiletMid },
        ];
        this.frontLayers = [];
        this.door = { x: 0, speed: 0, img: null };
        console.log('Parallax set to Stage 2 Scene 1: Toilet');
      }
    }
  }

  // Call this after images are loaded (for initial stage 1)
  setImages() {
    this.setStage(1);
  }

  update(deltaX) {
    // Stage 2 scene 0 (school) uses camera scrolling instead of parallax
    if (this.currentStage === 2 && this.currentScene === 0) return;
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
    this.cameraX = cameraX;
    // Set images if not already set
    if (!this.backLayers[0].img) {
      this.setImages();
    }

    // White background for all stages
    background(255);

    // Draw back layers before player, with door at appropriate position
    for (let layer of this.backLayers) {
      this.drawLayer(layer);
      // Draw door after appropriate layer based on scene
      if (this.currentStage === 1 && this.door && this.door.img) {
        // Living room: draw door after floor (wall -> floor -> door -> mid)
        if (this.currentScene === 1 && layer.name === "floor") {
          this.drawDoor(cameraX);
        }
        // Bedroom: draw door after back layer (floor -> back -> door -> mid)
        else if (this.currentScene === 0 && layer.name === "back") {
          this.drawDoor(cameraX);
        }
      }
    }
  }

  // Draw the door at a fixed world position (like obstacles)
  drawDoor(cameraX) {
    if (!this.door.img) return;

    // Get scene width
    let sceneWidth = this.getSceneWidth();

    // Door dimensions - living room door is bigger
    let doorRatio = this.door.img.width / this.door.img.height;
    let doorDrawH, doorWorldX, floorHeight;

    if (this.currentStage === 1 && this.currentScene === 1) {
      // Living room door - bigger and more to the left
      doorDrawH = height * 0.55;
      let doorDrawW = doorDrawH * doorRatio;
      doorWorldX = sceneWidth - doorDrawW - 100; // More to the left
      floorHeight = height * 0.15;
    } else {
      // Bedroom door
      doorDrawH = height * 0.4;
      let doorDrawW = doorDrawH * doorRatio;
      doorWorldX = sceneWidth - doorDrawW + 70;
      floorHeight = height * 0.18;
    }

    let doorDrawW = doorDrawH * doorRatio;

    // Convert to screen position using cameraX
    let doorScreenX = doorWorldX - cameraX;
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
    let drawY = 0;
    let drawX = layer.x;

    // Stage 2 (school and toilet) uses camera scrolling instead of parallax
    if (this.currentStage === 2) {
      drawX = layer.x - (this.cameraX || 0);
    }

    // Floor layer tiles to fill screen (speed 0, static background)
    if (layer.name === "floor") {
      // Overlap tiles by 1 pixel to eliminate seam lines
      for (let x = 0; x < width + drawW; x += drawW - 1) {
        image(layer.img, x, drawY, drawW, drawH);
      }
    } else {
      // Other layers draw once at parallax position (no repeating)
      image(layer.img, drawX, drawY, drawW, drawH);
    }
  }

  // Get the scene width based on back layer
  getSceneWidth() {
    // Try "back" for stage 1, "wall"/"school" for stage 2
    let backLayer = this.backLayers.find(l => l.name === "back") ||
                    this.backLayers.find(l => l.name === "wall") ||
                    this.backLayers.find(l => l.name === "school");
    if (!backLayer || !backLayer.img) return width;

    let backRatio = backLayer.img.width / backLayer.img.height;
    let baseWidth = height * backRatio;

    // Stage 2 scene 0 (school) - use base width for camera scrolling
    if (this.currentStage === 2 && this.currentScene === 0) {
      return baseWidth;
    }
    // Stage 2 scene 1 (toilet) - extend scene so player can walk further left
    if (this.currentStage === 2 && this.currentScene === 1) {
      // Find the wall layer and extend its width for more walking room
      let wallLayer = this.backLayers.find(l => l.name === "wall");
      if (wallLayer && wallLayer.img) {
        let wallRatio = wallLayer.img.width / wallLayer.img.height;
        let imgWidth = height * wallRatio;
        // Extend scene width to allow walking further left
        let extendedWidth = imgWidth + width * 2.0;
        console.log('DEBUG Toilet scene width:', extendedWidth, 'img width:', imgWidth, 'screen width:', width);
        return extendedWidth;
      }
      return width * 1.5; // fallback
    }
    // Stage 1 scene 1 (living room) - extend the room
    if (this.currentStage === 1 && this.currentScene === 1) {
      return baseWidth * 2.0;
    }
    // Stage 1 scene 0 (bedroom) - extend the room to push the door farther away
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

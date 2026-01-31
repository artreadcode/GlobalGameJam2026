
class Player {
  constructor(x) {
    this.x = x;
    
    this.speed = 4;
    this.spriteW = 64;
    this.spriteH = 64;
  }
  
  update(stage) {
    let mvmt = createVector(0);
    
    if(pressedKeys.a) {
      mvmt.x -= 1;
    }
    if(pressedKeys.d) {
      mvmt.x += 1;
    }

    if (mvmt.magSq() > 0) mvmt.setMag(this.speed);

    this.x += mvmt.x;

    if (stage) {
      this.x = constrain(this.x, stage.xMin, stage.xMax);
    }
  }
  
  draw(cameraX = 0) {
    const y = height - this.spriteH;
    image(playerSprite, this.x - cameraX, y, this.spriteW, this.spriteH);
  }
}


class Player {
  constructor(x) {
    this.x = x;
    
    this.speed = 4;
    this.spriteW = 64;
    this.spriteH = 64;
  }
  
  update() {
    let mvmt = createVector(0);
    
    if(pressedKeys.a) {
      mvmt.x -= 1;
    }
    if(pressedKeys.d) {
      mvmt.x += 1;
    }

    
    mvmt.setMag(this.speed);
    
    this.x += mvmt.x;
  }
  
  draw() {
    const y = height - this.spriteH;
    image(playerSprite, this.x, y, this.spriteW, this.spriteH);
  }
}


class Player {
  constructor(x) {
    this.x = x;

    this.speed = 8;
    this.spriteW = 120;
    this.spriteH = 120;

    // Animation
    this.animFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 8; // frames between animation changes
    this.direction = 0; // 0 = idle, -1 = left, 1 = right
    this.lastDirection = 0; // Remember last movement direction for idle sprite

    // Character type: 'toddler' (stage 1-2), 'teen' (stage 3-4), or 'adult' (stage 5)
    this.characterType = 'toddler';
  }

  // Set character type based on stage
  setCharacterType(type) {
    this.characterType = type;
  }

  update(stage) {
    if (stage) {
      this.x = constrain(this.x, stage.xMin, stage.xMax);
    }
  }

  // Call this to update animation based on movement
  updateAnimation(movingLeft, movingRight) {
    if (movingLeft) {
      this.direction = -1;
      this.lastDirection = -1; // Remember we were moving left
      this.animTimer++;
      if (this.animTimer >= this.animSpeed) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 3;
      }
    } else if (movingRight) {
      this.direction = 1;
      this.lastDirection = 1; // Remember we were moving right
      this.animTimer++;
      if (this.animTimer >= this.animSpeed) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 3;
      }
    } else {
      // Not moving - reset to idle but keep lastDirection
      this.direction = 0;
      this.animFrame = 0;
      this.animTimer = 0;
    }
  }

  draw(cameraX = 0) {
    let sprite;

    // Select sprite set based on character type
    let standSprite, standLeftSprite, standRightSprite, walkLeftSprites, walkRightSprites;
    if (this.characterType === 'adult') {
      standSprite = adultStand;
      standLeftSprite = adultStandLeft;
      standRightSprite = adultStandRight;
      walkLeftSprites = adultWalkLeft;
      walkRightSprites = adultWalkRight;
    } else if (this.characterType === 'teen') {
      standSprite = teenStand;
      standLeftSprite = teenStandLeft;
      standRightSprite = teenStandRight;
      walkLeftSprites = teenWalkLeft;
      walkRightSprites = teenWalkRight;
    } else {
      // Default to toddler
      standSprite = playerStand;
      standLeftSprite = playerStandLeft;
      standRightSprite = playerStandRight;
      walkLeftSprites = playerWalkLeft;
      walkRightSprites = playerWalkRight;
    }

    if (this.direction === -1) {
      // Walking left
      sprite = walkLeftSprites[this.animFrame];
    } else if (this.direction === 1) {
      // Walking right
      sprite = walkRightSprites[this.animFrame];
    } else {
      // Standing idle - check for smile/hide expressions

      // Check for character type according to level/scene
      let smileSprite, hideSprite;
      if (this.characterType === 'adult') {
        smileSprite = adultStandSmile;
        hideSprite = adultStandHide;
      } else if (this.characterType === 'teen') {
        smileSprite = teenStandSmile;
        hideSprite = teenStandHide;
      } else {
        smileSprite = playerStandSmile;
        hideSprite = playerStandHide;
      }

      if (game && game.smiled === 2 && smileSprite) {
        sprite = smileSprite;
      } else if (game && game.hid === 2 && hideSprite) {
        sprite = hideSprite;
      } else {
        // Use directional idle sprite based on last movement direction
        if (this.lastDirection === -1 && standLeftSprite) {
          sprite = standLeftSprite;
        } else if (this.lastDirection === 1 && standRightSprite) {
          sprite = standRightSprite;
        } else {
          sprite = standSprite;
        }
      }
    }

    if (sprite) {
      // Use original aspect ratio, scaled up
      let scale = 1; // Scale factor to make it bigger
      let drawW = sprite.width * scale;
      let drawH = sprite.height * scale;

      // Update collision dimensions
      this.spriteW = drawW;
      this.spriteH = drawH;

      let y = height - drawH - 20;
      image(sprite, this.x - cameraX - drawW / 2, y, drawW, drawH);
    }
  }
}

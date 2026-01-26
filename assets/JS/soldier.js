class Soldier {
  constructor(startX, startY, targetX, targetY) {
    this.x = startX;
    this.y = startY;
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;

    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.walkSpriteSheet = new Image();
    this.frames = [];
    this.currentFrame = 0;
    this.totalFrames = 8;
    this.isPlaying = false;
    this.isLoaded = false;
    this.isMoving = false;

    this.frameWidth = 112;
    this.frameHeight = 68;
    this.columns = 8;

    this.speed = 100; // milliseconds per frame
    this.walkSpeed = 2; // pixels per update
    this.direction = 1; // 1 for right, -1 for left
    this.lastUpdate = 0;

    this.loadSpriteSheet();
  }

  loadSpriteSheet() {
    this.walkSpriteSheet.onload = () => {
      console.log("Soldier sprite sheet loaded");
      this.isLoaded = true;
      // this.start();
    };
    this.walkSpriteSheet.onerror = () => {
      console.error("Failed to load soldier sprite sheet");
    };
    this.walkSpriteSheet.src = "assets/soldier/Soldier_1/Walk2.png";
  }

  // start() {
  //   if (!this.isLoaded) return;
  //   this.isPlaying = true;
  //   this.currentFrame = 0;
  //   this.lastUpdate = Date.now();
  //   this.draw();
  // }

  startWalking() {
    if (!this.isLOaded) return;

    const dx = this.targetX - this.startX;
    const dy = this.targetY - this.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.direction = dx > 0 ? 1 : -1;

    this.isPLaying = true;
    this.isMoving = true;
    this.currentFrame = 0;
    this.lastUPdate = Date.now();
  }
  update() {
    if (!this.isPlaying || !this.isLoaded) return false;

    const now = Date.now();
    if (now - this.lastUpdate >= this.speed) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      this.lastUpdate = now;

      // move soldier
      if (this.isMoving) {
        const oldX = this.x;
        const oldY = this.y;

        this.x += this.walkSpeed * this.direction;

        if (this.direction > 0 && this.x >= this.targetX) {
          this.x = this.targetX;
          this.isMoving = false;
          this.onReachedTarget();
        } else if (this.direction < 0 && this.x <= this.targetX) {
          this.x = this.targetX;
          this.isMoving = false;
          this.onReachedTarget();
        }
      }
    }
    return true;
  }
  onReachedTarget() {
    console.log("Soldier reached target at", this.x, this.y);
    this.isPLaying = false;
  }

  getFramePosition() {
    // Calculate which ROW and COLUMN in spritesheet
    const col = this.currentFrame % this.columns;
    const row = Math.floor(this.currentFrame / this.columns);

    return {
      sx: col * this.frameWidth, // Source X in spritesheet
      sy: row * this.frameHeight, // Source Y in spritesheet
      sw: this.frameWidth, // Source width to crop
      sh: this.frameHeight, // Source height to crop
    };
  }

  draw() {
    if (!this.isPlaying || !this.isLoaded) return;

    const frame = this.getFramePosition();
    const drawX = this.x - this.frameWidth / 2;
    const drawY = this.y - this.frameHeight / 2;

    this.ctx.save();

    if (this.direction === -1) {
      // Flip for left direction
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(
        this.walkSpriteSheet,
        frame.sx,
        frame.sy,
        frame.sw,
        frame.sh, // Source rectangle
        -drawX - this.frameWidth,
        drawY, // Flipped position
        this.frameWidth,
        this.frameHeight, // Draw size
      );
    } else {
      // Normal for right direction
      this.ctx.drawImage(
        this.walkSpriteSheet,
        frame.sx,
        frame.sy,
        frame.sw,
        frame.sh, // Source rectangle
        drawX,
        drawY, // Position
        this.frameWidth,
        this.frameHeight, // Draw size
      );
    }

    this.ctx.restore();
  }
}
const soldier = new Soldier(100, 300, 500, 300);
soldier.startWalking();
// function createSoldier(x, y) {
//   const soldier = new Soldier(x, y);

//   if (typeof AnimationManager !== "undefined") {
//     AnimationManager.add(soldier, "soldiers");
//   }
//   return soldier;
// }

// window.Soldier = Soldier;
// window.createSoldier = createSoldier;

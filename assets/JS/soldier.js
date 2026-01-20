class Soldier{
    constructor (x, y) {
        this.x = x;
        this.y = y;
    

this.canvas = document.getElementById("gameCanvas");
this.ctx = this.canvas.getcontext("2d");


this.walkSpriteSheet = new Image();
this.frames= [];
this.currentFrame = 0;
this.totalFrames = 8;
this.isPlaying = false;
this.isLoaded = false;

this.frameWidth = 112;
this.frameHeight = 68;
this.colums= 8;



this.speed = 100; // milliseconds per frame
this.walkSpeed = 2; // pixels per update
this.direction = 1; // 1 for right, -1 for left
this.lastUpdate = 0;

this.loadSpriteSheet = function() {
    loadSpriteSheet(){
        this.walkSpriteSheet.onload = () => {
            console.log("Soldier sprite sheet loaded");
            this.isLoaded = true;
            this.start();
        };
        this.walkSpriteSheet.oneerror = () => {
            console.error("Failed to load soldier sprite sheet");
        };
        this.walkSpriteSheet.src = "assets/soldier/Soldier_1/Walk2.png";

    }
}
}

start(){
    if (!this.isLoaded) return;
    this.isPlaying = true;
    this.currentFrame = 0;
    this.lastUpdate = Date.now();
    this.draw();
}
update(){
    if (!this.isPlaying || !this.isLoaded)return false;

    const now = Date.now();
    if (now - this.lastUpdate >= this.speed){
        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        this.lastUpdate = now;

        //move soldier 
        this.x += this.walkSpeed * this.direction;
        
        //turn at screen edges 
        if (this.x > this.canvas.width - 50){
            this.direction = -1;
        } else if (this.x < 50){
            this.direction = 1;
        }
    }
    return true;
}
getFramePosition(){
        // Calculate which ROW and COLUMN in spritesheet
        const rol = this.currentFrame % this.columns;
        const row = Math.floor (this.currentFrame / this.columns);

        return {
  sx: col * this.frameWidth,  // Source X in spritesheet
      sy: row * this.frameHeight, // Source Y in spritesheet
      sw: this.frameWidth,        // Source width to crop
      sh: this.frameHeight        // Source height to crop
        };
}
draw(){
    if (this.isPlaying || this.isLoaded) return;

    const frame = this.getFramePosition();
    const drawX = this.x - this.frameWidth / 2;
    const drawY = this.y - this.frameHeight / 2;

    this.ctx.save();

    if (this.direction === -1) {
      // Flip for left direction
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(
        this.walkSpriteSheet,
        frame.sx, frame.sy, frame.sw, frame.sh, // Source rectangle
        -drawX - this.frameWidth, drawY,        // Flipped position
        this.frameWidth, this.frameHeight       // Draw size
      );
    } else {
      // Normal for right direction
      this.ctx.drawImage(
        this.walkSpriteSheet,
        frame.sx, frame.sy, frame.sw, frame.sh, // Source rectangle
        drawX, drawY,                           // Position
        this.frameWidth, this.frameHeight       // Draw size
      );
    }
    
    this.ctx.restore();
}

}
function createSoldier(x,y) {
    const soldier = new Soldier(x,y);

    if(typeof AnimationManager !== 'undefined'){
        AnimationManager.add(soldier, 'soldiers');
    }
    return soldier;
}
window.Soldier = Soldier;
window.createSoldier = createSoldier;
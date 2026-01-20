const flames = [];

class Flame {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
  }
}
this.frames = [];
this.currentFrame = 0; 
this.totalFrames = 20;
this.loadImages ();
loadImages(){
for (let i = 1; i <= 35; i++) {
    const frameNum = i.toString().padStart(4, '0'); // "0001", "0002", ... "0035"
    const img = new Image();
    img.src = `assets/effects/flame4/image/2Me_VFX${frameNum}.png`;
}
this.start();
}


start() {
  this.isPlaying = true;
  this.lastUpdate = Date.now();
}

update(){
const now = Date.now();
if(now - this.lastUPdate > 100){
  this.currentFrame++;
  this.lastUpdate = now;

}
if(this.currentFrame >=this.totalFrames){
  this.isPlaying = false;
}

}
draw(){
  if (!this.isPlaying) return;
  
  const frame = this.frames[this.currentFrame];
  if (!frame) return;
  const width= frame.width;
  const height = frame.height;
  const x = this.x - width / 2;
  const y = this.y - height / 2;
  this.ctx.drawImage(frame,x,y,width,height);

}
function createFlame(x,y){
  const flame = new Flame(x,y);
  flames.push(flame);
  return flame;
}
flames.forEach(flame => {
  flame.update();
  flame.draw();
})
flames = flames.filter (flame => flame.isPlaying);


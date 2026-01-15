class Explosion {
  constructor(x, y, scale = 1.0, speed = 80) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.speed = speed;
    this.totalFrames = 27;

    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.frames = new Array(this.totalFrames);
    this.currentFrame = 0;
    this.isPlaying = false;
    this.isLoaded = false;
    this.loadedCount = 0;
    this.lastUpdate = 0;

    this.loadImages();
  }

  loadImages() {
    console.log("Loading explosion images...");

    for (let i = 1; i <= this.totalFrames; i++) {
      const img = new Image();
      const frameIndex = i - 1;
      const frameName = `Sek_${("0000" + i).slice(-5)}.png`;

      img.onload = () => {
        this.frames[frameIndex] = img;
        this.loadedCount++;

        if (this.loadedCount === this.totalFrames) {
          console.log("All images loaded for explosion!");
          this.isLoaded = true;
          this.start();
        }
      };

      img.onerror = () => {
        console.warn(`Failed to load: ${frameName}`);
        this.loadedCount++;

        // Create placeholder
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#333";
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(i.toString(), 50, 60);

        const placeholder = new Image();
        placeholder.src = canvas.toDataURL();
        this.frames[frameIndex] = placeholder;

        if (this.loadedCount === this.totalFrames) {
          this.isLoaded = true;
          this.start();
        }
      };

      img.src = `assets/effects/flame1/images/${frameName}`;
    }
  }

  start() {
    if (!this.isLoaded) {
      console.log("Cannot start - images not loaded yet");
      return;
    }

    this.isPlaying = true;
    this.currentFrame = 0;
    this.lastUpdate = Date.now();
    console.log(
      `Explosion started at (${Math.round(this.x)}, ${Math.round(this.y)})`
    );

    // Force first draw
    this.draw();
  }

  update() {
    if (!this.isPlaying || !this.isLoaded) return false;

    const now = Date.now();
    if (now - this.lastUpdate >= this.speed) {
      this.currentFrame++;
      this.lastUpdate = now;

      if (this.currentFrame >= this.totalFrames) {
        this.isPlaying = false;
        console.log("Explosion animation completed");
        return false;
      }
    }
    return true;
  }

  draw() {
    if (!this.isPlaying || !this.isLoaded) return;

    const frame = this.frames[this.currentFrame];
    if (!frame) return;

    // Calculate explosion growth
    const progress = this.currentFrame / this.totalFrames;
    const sizeMultiplier = 0.3 + progress * 1.7;
    const width = frame.width * this.scale * sizeMultiplier;
    const height = frame.height * this.scale * sizeMultiplier;
    const x = this.x - width / 2;
    const y = this.y - height / 2;

    // Draw the explosion frame
    this.ctx.drawImage(frame, x, y, width, height);
  }
}

// Global game state
const explosions = [];
let animationId = null;
let isFirstExplosion = true;

// Create new explosion
function createExplosion() {
  const canvas = document.getElementById("gameCanvas");
  const x = Math.random() * (canvas.width - 200) + 100;
  const y = Math.random() * (canvas.height - 200) + 100;
  const scale = 0.5 + Math.random() * 1.0;
  const speed = 50 + Math.random() * 100;

  console.log(
    `Creating explosion #${explosions.length + 1} at (${Math.round(
      x
    )}, ${Math.round(y)})`
  );

  const explosion = new Explosion(x, y, scale, speed);
  explosions.push(explosion);

  // If this is the first explosion, start the animation loop immediately
  if (isFirstExplosion) {
    isFirstExplosion = false;
    console.log("Starting animation loop for first explosion");
    animationLoop();
  }
}

// Main animation loop
function animationLoop() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Clear canvas with dark background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw all explosions
  let hasActiveExplosions = false;

  for (let i = explosions.length - 1; i >= 0; i--) {
    const explosion = explosions[i];

    if (explosion.isPlaying) {
      const isActive = explosion.update();
      if (isActive) {
        explosion.draw();
        hasActiveExplosions = true;
      } else {
        // Remove finished explosions
        console.log(`Removing finished explosion #${i + 1}`);
        explosions.splice(i, 1);
      }
    } else if (explosion.isLoaded) {
      // Draw explosion even if it's not "playing" yet (just loaded)
      explosion.draw();
      hasActiveExplosions = true;
    }
  }

  // Draw explosion count
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Arial";
  ctx.fillText(
    `Active Explosions: ${explosions.filter((e) => e.isPlaying).length}`,
    20,
    30
  );
  ctx.fillText(`Total Loaded: ${explosions.length}`, 20, 50);

  // Continue or stop animation loop
  if (hasActiveExplosions || explosions.length > 0) {
    animationId = requestAnimationFrame(animationLoop);
  } else {
    animationId = null;
    isFirstExplosion = true; // Reset for next time
    console.log("Animation loop stopped - no active explosions");
  }
}

// Clear all explosions
function clearExplosions() {
  console.log(`Clearing ${explosions.length} explosions`);
  explosions.length = 0;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  isFirstExplosion = true;

  // Clear canvas
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Pre-load some images to avoid first-click delay
window.addEventListener("load", function () {
  console.log("Page loaded, ready for explosions!");

  // Create a hidden pre-loader explosion
  const preloader = new Explosion(-100, -100, 0.1, 1000);

  // Create initial explosion after 1 second
  setTimeout(() => {
    createExplosion();
  }, 1000);
});

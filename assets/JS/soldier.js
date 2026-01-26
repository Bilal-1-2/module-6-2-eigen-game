class Soldier {
  constructor(x, y) {
    // Position on canvas - this represents the CENTER of the soldier at the feet
    this.x = x;
    this.y = y;
    console.log(
      "🆕 Soldier created! Total soldiers:",
      window.soldierCount || 0,
    );
    window.soldierCount = (window.soldierCount || 0) + 1;
    // Canvas context for drawing
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Spritesheet
    this.walkSpriteSheet = new Image();
    this.runSpriteSheet = new Image();
    this.deathSpriteSheet = new Image();

    // FIXED: Individual frame data (from your measurements)
    this.frames = [
      // Frame 0: x=49,  y=1, width=31, height=67
      { x: 49, y: 1, width: 34, height: 67 },
      // Frame 1: x=177, y=1, width=32, height=67
      { x: 177, y: 1, width: 34, height: 67 },
      // Frame 2: x=303, y=2, width=33, height=66
      { x: 303, y: 2, width: 33, height: 68 },
      // Frame 3: x=336, y=1, width=112, height=67 ⚠ (this frame fills the cell)
      // { x: 336, y: 1, width: 112, height: 67 },
      // Frame 4: x=448, y=4, width=19, height=64
      { x: 428, y: 3, width: 34, height: 68 },
      // Frame 5: x=561, y=0, width=34, height=68
      { x: 561, y: 3, width: 34, height: 68 },
      // Frame 6: x=686, y=2, width=35, height=66
      { x: 686, y: 2, width: 35, height: 68 },
      // Frame 7: x=814, y=2, width=34, height=66
      { x: 814, y: 2, width: 34, height: 68 },
    ];

    this.runFrames = [
      { x: 38, y: 4, width: 37, height: 60 },
      { x: 165, y: 4, width: 38, height: 60 },
      { x: 290, y: 4, width: 41, height: 60 },
      { x: 420, y: 4, width: 39, height: 60 },
      { x: 554, y: 3, width: 33, height: 61 },
      { x: 674, y: 4, width: 41, height: 60 },
      { x: 801, y: 4, width: 42, height: 60 },
      { x: 934, y: 4, width: 37, height: 60 },
    ];

    this.deathFrames = [
      { x: 18, y: 6, width: 34, height: 58 },
      { x: 88, y: 6, width: 34, height: 58 },
      { x: 158, y: 6, width: 34, height: 58 },
      { x: 228, y: 6, width: 34, height: 58 },
    ];

    this.activeFrames = this.frames;
    this.totalFrames = this.frames.length;
    this.currentFrame = 0;

    this.deathAnimationPlaying = false;
    this.deathAnimationComplete = false;
    this.deathFrameIndex = 0;
    this.deathAnimationSpeed = 300;
    this.lastDeathFrameUpdate = Date.now();

    // Health

    this.health = 100;
    this.maxHealth = 100;
    this.isAlive = true;
    this.isTakingDamage = false;
    this.damageFlashTimer = 0;

    // Animation timing
    this.speed = 100;
    this.lastUpdate = Date.now();

    // Movement
    this.walkSpeed = 3;
    this.runSpeed = 6;

    this.direction = 1; // 1 = right, -1 = left
    this.isRunning = false;

    // State
    this.isPlaying = false;
    this.isLoaded = false;
    this.keys = {};

    // Reference dimensions (use the largest frame for positioning)
    this.maxFrameWidth = Math.max(...this.frames.map((f) => f.width));
    this.maxFrameHeight = Math.max(...this.frames.map((f) => f.height));

    // Position offsets - center horizontally, feet at bottom
    this.drawOffsetX = this.maxFrameWidth / 2; // Center horizontally
    this.drawOffsetY = this.maxFrameHeight; // Feet at (x, y), body above

    this.loadSpriteSheets();
    this.setupControls();
  }

  loadSpriteSheets() {
    console.log("📷 Loading sprite sheets...");

    // Add timestamps to prevent caching
    const timestamp = new Date().getTime();

    this.walkSpriteSheet.onload = () => {
      console.log(
        "✅ Walk sprite loaded, size:",
        this.walkSpriteSheet.width + "x" + this.walkSpriteSheet.height,
      );
      this.isLoaded = true;
      this.draw();
    };

    this.walkSpriteSheet.onerror = () => {
      console.error("❌ Failed to load soldier spritesheet!");
    };

    this.walkSpriteSheet.src = "assets/soldier/Soldier_1/Walk2.png";

    this.runSpriteSheet.onload = () => {
      console.log("✅ Running spritesheet loaded!");
    };
    this.runSpriteSheet.onerror = () => {
      console.error("❌ Failed to load running spritesheet!");
    };
    this.runSpriteSheet.src = "assets/soldier/Soldier_1/Run.png";

    this.deathSpriteSheet.onload = () => {
      console.log("✅ Running spritesheet loaded!");
    };
    this.deathSpriteSheet.onerror = () => {
      console.error("❌ Failed to load running spritesheet!");
    };
    this.deathSpriteSheet.src = "assets/soldier/Soldier_1/dead.png";
  }

  setupControls() {
    document.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        this.keys[key] = true;
        this.checkMovement();
      }
      if (key === "control") {
        toggleSoldierRun();
        this.switchAnimationMode();
      }
    });

    document.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        this.keys[key] = false;
        // this.isRunning = false;
        this.checkMovement();
      }
      if (key === "control") {
        // toggleSoldierRun();
        this.switchAnimationMode();
      }
    });
  }

  checkMovement() {
    const movingLeft = this.keys["a"];
    const movingRight = this.keys["d"];
    const movingUp = this.keys["w"];
    const movingDown = this.keys["s"];

    if (movingLeft || movingRight || movingUp || movingDown) {
      if (!this.isPlaying && this.isLoaded) {
        this.isPlaying = true;
        this.currentFrame = 0;
        this.lastUpdate = Date.now();
      }

      if (movingLeft) {
        this.direction = -1;
      } else if (movingRight) {
        this.direction = 1;
      }
    } else {
      this.isPlaying = false;
    }
  }
  switchAnimationMode() {
    if (this.isRunning) {
      console.log("Switching to run mode");
      this.activeFrames = this.runFrames;
      this.currentFrame = this.runFrames;
      this.speed = 50;
    } else {
      console.log("🚶 Switching to WALK mode");
      this.activeFrames = this.frames;
      this.currentFrame = this.frames;
      this.speed = 100;
    }

    this.currentFrame = 0;
    this.lastUpdate = Date.now();
  }

  update() {
    if (!this.isLoaded) return true;
    if (!this.isAlive && this.deathAnimationComplete) return false;

    const now = Date.now();

    // Handle death animation
    if (this.deathAnimationPlaying) {
      if (now - this.lastDeathFrameUpdate >= this.deathAnimationSpeed) {
        this.deathFrameIndex++;
        this.currentFrame = this.deathFrameIndex;
        this.lastDeathFrameUpdate = now;

        // Check if death animation is complete
        if (this.deathFrameIndex >= this.deathFrames.length) {
          // FIXED
          this.deathAnimationPlaying = false;
          this.deathAnimationComplete = true;
          this.currentFrame = this.deathFrames.length - 1;
        }
      }
      return true;
    }

    // Original movement code continues here...
    const isMoving =
      this.keys["a"] || this.keys["d"] || this.keys["w"] || this.keys["s"];

    if (isMoving && this.isPlaying && now - this.lastUpdate >= this.speed) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      this.lastUpdate = now;
    }

    const currentSpeed = this.isRunning ? this.runSpeed : this.walkSpeed;
    // Move soldier
    if (this.keys["a"]) this.x -= currentSpeed;
    if (this.keys["d"]) this.x += currentSpeed;
    if (this.keys["w"]) this.y -= currentSpeed;
    if (this.keys["s"]) this.y += currentSpeed;

    // Keep soldier on screen (account for largest frame)
    const padding = 30;
    this.x = Math.max(
      padding + this.drawOffsetX,
      Math.min(this.canvas.width - padding - this.drawOffsetX, this.x),
    );
    this.y = Math.max(
      padding + this.drawOffsetY,
      Math.min(this.canvas.height - padding, this.y),
    );

    return true;
  }
  drawHealthBar() {
    if (!this.isLoaded || this.health >= this.maxHealth) return;

    const healthBarWidth = 50;
    const healthBarHeight = 6;
    const healthBarYOffset = -10; // Above the soldier

    const barX = this.x - healthBarWidth / 2;
    const barY = this.y - this.maxFrameHeight + healthBarYOffset;

    this.ctx.fillStyle = "rgba(0,0,0,0.7)";
    this.ctx.fillRect(barX, barY, healthBarWidth, healthBarHeight);

    const healthPercent = this.health / this.maxHealth;
    const healthWidth = healthBarWidth * healthPercent;

    if (healthPercent > 0.5) {
      this.ctx.fillStyle = "#4CAF50";
    } else if (healthPercent > 0.25) {
      this.ctx.fillStyle = "#FF9800";
    } else {
      this.ctx.fillStyle = "#F44336";
    }

    this.ctx.fillRect(barX, barY, healthWidth, healthBarHeight);

    this.ctx.strokeStyle = "rgba(255,255,255,0.5)";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(barX, barY, healthBarWidth, healthBarHeight);
  }

  takeDamage(amount) {
    if (!this.isAlive) return false;

    this.health = Math.max(0, this.health - amount);
    this.damageFlashTimer = 10;
    this.isTakingDamage = true;

    if (this.health <= 0) {
      this.isAlive = false;
      this.isPlaying = false;
      this.startDeathAnimation();
      console.log("💀 Soldier has died.");
    }
    return true;
  }
  startDeathAnimation() {
    this.deathAnimationPlaying = true;
    this.deathAnimationComplete = false;
    this.deathFrameIndex = 0;
    this.lastDeathFrameUpdate = Date.now();

    this.activeFrames = this.deathFrames;
    this.totalFrames = this.deathFrames.length;
    this.currentFrame = 0;
  }

  draw() {
    if (!this.isLoaded) return;

    const frame = this.activeFrames[this.currentFrame];

    // Calculate where to draw on canvas
    // For consistent positioning, we'll draw each frame centered horizontally
    // and aligned at the feet vertically
    const frameCenterOffsetX = frame.width / 2;
    const drawX = this.x - frameCenterOffsetX;
    const drawY = this.y - frame.height; // Feet at (x, y)

    if (this.isTakingDamage && this.damageFlashTimer > 0) {
      // Flash red overlay
      this.ctx.save();
      this.ctx.globalAlpha = 0.5;
      // this.ctx.fillStyle = "#FF0000";
      // this.ctx.fillRect(
      //   this.x - this.drawOffsetX,
      //   this.y - this.drawOffsetY,
      //   this.maxFrameWidth,
      //   this.maxFrameHeight,
      // );
      this.ctx.restore(); // Move this inside the if block

      this.damageFlashTimer--;
      if (this.damageFlashTimer <= 0) {
        this.isTakingDamage = false;
      }
    }

    // DEBUG: Draw the center point (red dot at soldier's feet)
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.x - 2, this.y - 2, 4, 4);

    this.ctx.save();

    if (this.deathAnimationPlaying || this.deathAnimationComplete) {
      // Draw death animation
      if (this.direction === -1) {
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(
          this.deathSpriteSheet,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          -drawX - frame.width,
          drawY,
          frame.width,
          frame.height,
        );
      } else {
        this.ctx.drawImage(
          this.deathSpriteSheet,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          drawX,
          drawY,
          frame.width,
          frame.height,
        );
      }
    } else {
      // Draw normal walk/run animation (original code)
      if (this.direction === -1) {
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(
          this.isRunning ? this.runSpriteSheet : this.walkSpriteSheet,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          -drawX - frame.width,
          drawY,
          frame.width,
          frame.height,
        );
      } else {
        this.ctx.drawImage(
          this.isRunning ? this.runSpriteSheet : this.walkSpriteSheet,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          drawX,
          drawY,
          frame.width,
          frame.height,
        );
      }
    }

    this.ctx.restore();

    // DEBUG: Draw green bounding box around current frame
    this.ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
    this.ctx.strokeRect(drawX, drawY, frame.width, frame.height);

    // DEBUG: Draw yellow center line
    this.ctx.strokeStyle = "rgba(255, 255, 0, 0.3)";
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, drawY);
    this.ctx.lineTo(this.x, drawY + frame.height);
    this.ctx.stroke();
    this.drawHealthBar();
  }
}
function toggleSoldierRun() {
  if (window.currentSoldier) {
    window.currentSoldier.isRunning = !window.currentSoldier.isRunning;
    window.currentSoldier.switchAnimationMode();
    console.log("Run mode:", window.currentSoldier.isRunning);
  }
}

function createSoldier(x, y) {
  const soldier = new Soldier(x, y);

  // Store for debugging
  window.currentSoldier = soldier;

  if (typeof AnimationManager !== "undefined") {
    AnimationManager.add(soldier, "soldiers");
  }

  return soldier;
}

window.Soldier = Soldier;
window.createSoldier = createSoldier;

function damageCurrentSoldier(amount = 10) {
  if (window.currentSoldier) {
    window.currentSoldier.takeDamage(amount);
  } else {
    console.log("No soldier to damage!");
  }
}

window.damageCurrentSoldier = damageCurrentSoldier;

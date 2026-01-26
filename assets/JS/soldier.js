class Soldier {
  constructor(x, y) {
    // Position on canvas
    this.x = x;
    this.y = y;

    // Canvas context for drawing
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Spritesheet
    this.walkSpriteSheet = new Image();

    // Animation properties
    this.currentFrame = 0; // Which frame to show (0-7)
    this.totalFrames = 8; // You have 8 frames total

    // Your frame dimensions
    this.frameWidth = 112; // Width of EACH frame in spritesheet
    this.frameHeight = 68; // Height of EACH frame

    // Animation timing
    this.speed = 100; // Milliseconds between frames
    this.lastUpdate = Date.now(); // When last frame changed

    // Movement
    this.walkSpeed = 5; // Pixels to move per update
    this.direction = 1; // 1 = right, -1 = left

    // State
    this.isPlaying = false; // Is animation running?
    this.isLoaded = false; // Is spritesheet loaded?

    // Keyboard controls
    this.keys = {}; // Store which keys are pressed

    // Load images and setup controls
    this.loadSpriteSheet();
    this.setupControls();
  }

  loadSpriteSheet() {
    this.walkSpriteSheet.onload = () => {
      console.log("✅ Soldier spritesheet loaded!");
      this.isLoaded = true; // FIXED: Changed from "isLOaded" to "isLoaded"
      this.draw(); // Draw immediately when loaded
    };

    this.walkSpriteSheet.onerror = () => {
      console.error("❌ Failed to load soldier spritesheet!");
    };

    this.walkSpriteSheet.src = "assets/soldier/Soldier_1/Walk2.png";
  }

  setupControls() {
    // Listen for key DOWN events
    document.addEventListener("keydown", (event) => {
      this.keys[event.key.toLowerCase()] = true;
      this.checkMovement(); // Check movement immediately when key is pressed
    });

    // Listen for key UP events
    document.addEventListener("keyup", (event) => {
      this.keys[event.key.toLowerCase()] = false;
      this.checkMovement();
    });
  }

  checkMovement() {
    const movingLeft = this.keys["a"];
    const movingRight = this.keys["d"];
    const movingUp = this.keys["w"];
    const movingDown = this.keys["s"];

    // If ANY movement key is pressed
    if (movingLeft || movingRight || movingUp || movingDown) {
      // Start animation if not already playing
      if (!this.isPlaying && this.isLoaded) {
        this.isPlaying = true;
        this.currentFrame = 0;
        this.lastUpdate = Date.now();
      }

      // Set direction for animation (left/right)
      if (movingLeft) {
        this.direction = -1; // Face left
      } else if (movingRight) {
        this.direction = 1; // Face right
      }
      // If moving up/down only, keep last direction
    } else {
      // No keys pressed - stop animation
      this.isPlaying = false;
    }
  }

  update() {
    // Always return true to keep soldier alive
    if (!this.isLoaded) return true;

    const now = Date.now();

    // Advance animation frame if playing and enough time passed
    if (this.isPlaying && now - this.lastUpdate >= this.speed) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      this.lastUpdate = now;
    }

    // Move based on pressed keys
    if (this.keys["a"]) {
      // A = left
      this.x -= this.walkSpeed;
    }
    if (this.keys["d"]) {
      // D = right
      this.x += this.walkSpeed;
    }
    if (this.keys["w"]) {
      // W = up
      this.y -= this.walkSpeed;
    }
    if (this.keys["s"]) {
      // S = down
      this.y += this.walkSpeed;
    }

    // Keep soldier on screen
    this.x = Math.max(50, Math.min(this.canvas.width - 50, this.x));
    this.y = Math.max(50, Math.min(this.canvas.height - 50, this.y));

    return true; // Soldier stays alive
  }

  draw() {
    // Don't draw if not loaded
    if (!this.isLoaded) return;

    // Calculate which part of spritesheet to show
    const sourceX = this.currentFrame * this.frameWidth;
    const sourceY = 0; // All frames on same row

    // Calculate where to draw on canvas (centered)
    const drawX = this.x - this.frameWidth / 2;
    const drawY = this.y - this.frameHeight / 2;

    // Save canvas state
    this.ctx.save();

    // If facing left, flip horizontally
    if (this.direction === -1) {
      this.ctx.scale(-1, 1); // Flip X axis
      this.ctx.drawImage(
        this.walkSpriteSheet,
        sourceX,
        sourceY, // Crop FROM spritesheet
        this.frameWidth,
        this.frameHeight,
        -drawX - this.frameWidth, // Draw AT (flipped position)
        drawY,
        this.frameWidth,
        this.frameHeight,
      );
    } else {
      // Facing right - draw normally
      this.ctx.drawImage(
        this.walkSpriteSheet,
        sourceX,
        sourceY,
        this.frameWidth,
        this.frameHeight,
        drawX,
        drawY,
        this.frameWidth,
        this.frameHeight,
      );
    }

    // Restore canvas state
    this.ctx.restore();
  }
}

function createSoldier(x, y) {
  const soldier = new Soldier(x, y);

  if (typeof AnimationManager !== "undefined") {
    AnimationManager.add(soldier, "soldiers");
  }

  // Log for debugging
  console.log("Soldier created at:", x, y);
  console.log("Soldier added to AnimationManager");

  return soldier;
}

window.Soldier = Soldier;
window.createSoldier = createSoldier;

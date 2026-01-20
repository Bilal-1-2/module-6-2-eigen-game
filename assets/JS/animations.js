// animations.js - FIXED VERSION
const animations = {
  explosions: [],
  flames: [],
  smokes: [],
  sparkles: [],
};

let animationLoopId = null;

// Animation Manager Class
class AnimationManager {
  static add(animation, type) {
    if (animations[type]) {
      animations[type].push(animation);

      // ⭐ CRITICAL FIX: Always try to start loop when adding animation
      AnimationManager.startLoop();

      // ⭐ DOUBLE CHECK: If loop didn't start, force it
      if (!animationLoopId) {
        console.log(`Starting animation loop for ${type}`);
        animationLoopId = requestAnimationFrame(() =>
          AnimationManager.gameLoop(),
        );
      }
    }
  }

  static startLoop() {
    if (!animationLoopId) {
      console.log("🔄 Starting main animation loop");
      animationLoopId = requestAnimationFrame(() =>
        AnimationManager.gameLoop(),
      );
    }
  }

  static gameLoop() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let hasActiveAnimations = false;

    // Check ALL animation types
    Object.keys(animations).forEach((type) => {
      const animList = animations[type];

      // If there are ANY animations in this list
      if (animList.length > 0) {
        hasActiveAnimations = true;

        for (let i = animList.length - 1; i >= 0; i--) {
          const anim = animList[i];

          if (anim.isPlaying) {
            const active = anim.update();
            if (active) {
              anim.draw();
            } else {
              animList.splice(i, 1);
            }
          } else if (anim.isLoaded) {
            // Draw loading animations too
            anim.draw();
          }
        }
      }
    });

    // Draw counters
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.fillText(`Explosions: ${animations.explosions.length}`, 20, 30);
    ctx.fillText(`Flames: ${animations.flames.length}`, 20, 50);

    // ⭐ SIMPLER CHECK: If ANY animations exist, keep looping
    const totalAnimations = Object.values(animations).reduce(
      (total, list) => total + list.length,
      0,
    );

    if (totalAnimations > 0) {
      animationLoopId = requestAnimationFrame(() =>
        AnimationManager.gameLoop(),
      );
    } else {
      console.log("⏹️ Stopping animation loop - no animations");
      animationLoopId = null;
    }
  }

  static clearAll() {
    Object.keys(animations).forEach((type) => {
      animations[type] = [];
    });

    if (animationLoopId) {
      cancelAnimationFrame(animationLoopId);
      animationLoopId = null;
    }

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// ⭐ AUTO-START: Start loop immediately when page loads
window.addEventListener("load", () => {
  console.log("🚀 Animation Manager loaded and ready!");

  // Create a hidden dummy animation to kickstart the loop
  setTimeout(() => {
    if (!animationLoopId) {
      console.log("⚡ Auto-starting animation loop");
      AnimationManager.startLoop();
    }
  }, 500);
});

window.AnimationManager = AnimationManager;

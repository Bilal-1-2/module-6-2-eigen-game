// animations.js - MANAGES ALL ANIMATIONS
const animations = {
  explosions: [],
  flames: [],
  smokes: [], // For future animations
  sparkles: [], // For future animations
};

let animationLoopId = null;

// Animation Manager Class
class AnimationManager {
  static add(animation, type) {
    if (animations[type]) {
      animations[type].push(animation);
      AnimationManager.startLoop();
    } else {
      console.error(`Unknown animation type: ${type}`);
    }
  }

  static remove(animation, type) {
    if (animations[type]) {
      const index = animations[type].indexOf(animation);
      if (index > -1) {
        animations[type].splice(index, 1);
      }
    }
  }

  static startLoop() {
    if (!animationLoopId) {
      animationLoopId = requestAnimationFrame(AnimationManager.gameLoop);
    }
  }

  static stopLoop() {
    if (animationLoopId) {
      cancelAnimationFrame(animationLoopId);
      animationLoopId = null;
    }
  }

  static gameLoop() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Clear canvas once
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let hasActiveAnimations = false;

    // Update and draw ALL animation types
    Object.keys(animations).forEach((type) => {
      const animList = animations[type];

      for (let i = animList.length - 1; i >= 0; i--) {
        const anim = animList[i];

        if (anim.isPlaying) {
          const active = anim.update();
          if (active) {
            anim.draw();
            hasActiveAnimations = true;
          } else {
            animList.splice(i, 1);
          }
        } else if (anim.isLoaded) {
          // Draw even if not "playing" yet
          anim.draw();
          hasActiveAnimations = true;
        }
      }
    });

    // Draw counters
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.fillText(`Explosions: ${animations.explosions.length}`, 20, 30);
    ctx.fillText(`Flames: ${animations.flames.length}`, 20, 50);

    // Continue loop if any animations exist
    if (hasActiveAnimations) {
      animationLoopId = requestAnimationFrame(AnimationManager.gameLoop);
    } else {
      animationLoopId = null;
    }
  }

  static clearAll() {
    Object.keys(animations).forEach((type) => {
      animations[type] = [];
    });
    AnimationManager.stopLoop();

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// Make AnimationManager available globally
window.AnimationManager = AnimationManager;

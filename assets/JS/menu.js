console.log("📱 Menu system loading...");

// Step 1: Variables
let currentScreen = "mainMenu";
let gamePaused = false;

function showScreen(screenId) {
  console.log(`Switching to: ${screenId}`);

  ["mainMenu", "gameScreen", "pauseMenu"].forEach((screen) => {
    const element = document.getElementById(screen);
    if (element) element.style.display = "none";
  });

  const screenToShow = document.getElementById(screenId);
  if (screenToShow) {
    screenToShow.style.display = "flex";
    currentScreen = screenId;
  }
}
function startGame() {
  console.log("🚀 Starting game!");

  // Reset game state
  resetGame();

  // Show game screen
  showScreen("gameScreen");

  // Optional: Auto-create a soldier when game starts
  setTimeout(() => {
    if (window.createSoldier) {
      createSoldier(50, 450); // Create soldier in center
    }
  }, 100);
}

function newGame() {
  console.log("🆕 Starting NEW game");

  // Completely clear everything
  if (window.AnimationManager) {
    AnimationManager.clearAll();
  }

  // Reset all game state
  window.currentSoldier = null;
  window.soldierCount = 0;

  // Show game screen
  showScreen("gameScreen");

  // Start fresh animation loop
  if (window.AnimationManager) {
    AnimationManager.startLoop();
  }

  // Create new soldier
  setTimeout(() => {
    if (window.createSoldier) {
      createSoldier(50, 450);
    }
  }, 500);
}

// Continue existing game
function continueGame() {
  console.log("▶️ Continuing game");

  // Just show the game screen
  showScreen("gameScreen");

  // Ensure animation loop is running
  if (window.AnimationManager && !animationLoopId) {
    AnimationManager.startLoop();
  }
}

function showPauseMenu() {
  console.log("⏸️ Game paused");
  showScreen("pauseMenu");
  gamePaused = true;
}

function resumeGame() {
  console.log("▶️ Resuming game");
  showScreen("gameScreen");
  gamePaused = false;
}

function quitToMenu() {
  gamePaused = true;

  // Hide the game screen
  showScreen("mainMenu");
}

function quitGame() {
  console.log("👋 Quitting");
  if (confirm("Quit game?")) alert("Thanks for playing!");
}

function showOptions() {
  console.log("⚙️ Options");
  alert("Options coming soon!");
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (currentScreen === "gameScreen") showPauseMenu();
    else if (currentScreen === "pauseMenu") resumeGame();
  }
});

function resetGame() {
  console.log("🔄 Resetting game...");

  // Clear the canvas but keep it ready
  const canvas = document.getElementById("gameCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    // Just clear to white, don't stop the loop
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Clear soldier references but don't stop animation loop
  window.currentSoldier = null;

  // If animation loop stopped, restart it
  if (window.AnimationManager && !animationLoopId) {
    AnimationManager.startLoop();
  }
}
window.startGame = startGame;
window.showPauseMenu = showPauseMenu;
window.resumeGame = resumeGame;
window.quitToMenu = quitToMenu;
window.quitGame = quitGame;
window.showOptions = showOptions;
window.newGame = newGame;
window.continueGame = continueGame;
console.log("✅ Menu system ready!");

// ==========================================
// 1. Global Variables & Selections
// ==========================================
let duration = 1000;
let blocksContainer = document.querySelector(".memory-game-blocks");
let blocks = Array.from(blocksContainer.children);
let orderRange = Array.from(Array(blocks.length).keys());

let maxWrongTries = 5; // الحد الأقصى للمحاولات الخاطئة
let totalSeconds = 300; // 5 دقائق (5 * 60)
let timerInterval; // مؤقت الوقت
let gameStarted = false; // حالة بدء اللعبة

// ==========================================
// 2. Game Initialization
// ==========================================
shuffle(orderRange);

// Add Order CSS Property To Game Blocks & Click Events
blocks.forEach((block, index) => {
  block.style.order = orderRange[index];

  block.addEventListener("click", function () {
    if (!gameStarted) return; // منع اللعب قبل بدء اللعبة
    flipBlock(block);
  });
});

// Start Game Button Action
document.querySelector(".control-buttons span").onclick = function () {
  let yourName = prompt("Whats Your Name?");

  if (yourName == null || yourName == "") {
    document.querySelector(".name span").innerHTML = "Unknown";
  } else {
    document.querySelector(".name span").innerHTML = yourName;
  }

  // Remove Splash Screen & Start Game
  document.querySelector(".control-buttons").remove();
  startGame();
};

// Start Game Function
function startGame() {
  gameStarted = true;
  startTimer();
}

// ==========================================
// 3. Timer Function (5 Minutes Countdown)
// ==========================================
function startTimer() {
  let timerElement = document.getElementById("time");

  timerInterval = setInterval(() => {
    totalSeconds--;

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    // تنسيق شكل الدقائق والثواني (مثلاً 04:09)
    let formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    timerElement.innerHTML = formattedTime;

    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      endGame(false, "⏰ Game Over! Run Out of Time!<br>Try Again!");
    }
  }, 1000);
}

// ==========================================
// 4. Game Logic Functions
// ==========================================

// Flip Block Function
function flipBlock(selectedBlock) {
  if (
    selectedBlock.classList.contains("has-match") ||
    selectedBlock.classList.contains("is-flipped")
  ) {
    return;
  }

  selectedBlock.classList.add("is-flipped");

  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped"),
  );

  if (allFlippedBlocks.length === 2) {
    stopClicking();
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

// Stop Clicking Function
function stopClicking() {
  blocksContainer.classList.add("no-clicking");

  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

// Check Matched Block Function
function checkMatchedBlocks(firstBlock, secondBlock) {
  let triesElement = document.querySelector(".tries span");

  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    document.getElementById("success").play();

    // التحقق هل اللاعب فاز بكل الكروت؟
    checkWinCondition();
  } else {
    let currentTries = parseInt(triesElement.innerHTML) + 1;
    triesElement.innerHTML = currentTries;

    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);

    document.getElementById("fail").play();

    // التحقق هل وصل للحد الأقصى للأخطاء (10 مرات)؟
    if (currentTries >= maxWrongTries) {
      clearInterval(timerInterval);
      setTimeout(() => {
        endGame(false, "❌ Game Over! Too Many Mistakes!<br>Try Again!");
      }, 500);
    }
  }
}

// Check Win Condition
function checkWinCondition() {
  let matchedBlocks = blocks.filter((block) =>
    block.classList.contains("has-match"),
  );
  if (matchedBlocks.length === blocks.length) {
    clearInterval(timerInterval);
    setTimeout(() => {
      endGame(true, "🎉 Awesome! You Won The Game! 🏆");
    }, 500);
  }
}

// End Game Function (Game Over or Win)
function endGame(isWin, message) {
  gameStarted = false;
  blocksContainer.classList.add("no-clicking");

  // إنشاء شاشة النهاية وعرضها
  let screenDiv = document.createElement("div");
  screenDiv.className = "game-over-screen";
  screenDiv.innerHTML = `
    <h1>${message}</h1>
    <button onclick="window.location.reload()">Play Again 🚀</button>
  `;
  document.body.appendChild(screenDiv);
}

// ==========================================
// 5. Shuffle Algorithm Function
// ==========================================
function shuffle(array) {
  // Current Array [9, 2, 10, 4, 5, 6, 7, 3, 1, 8]
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    // Get Random Number
    random = Math.floor(Math.random() * current);

    // Decrease Length By One
    current--;

    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }

  return array;
}

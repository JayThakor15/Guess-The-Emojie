const emojiDetails = [
  { description: "Smiling face with sunglasses", emoji: "😎" },
  { description: "Thumbs up", emoji: "👍" },
  { description: "Heart eyes", emoji: "😍" },
  { description: "Crying face", emoji: "😢" },
  { description: "Party popper", emoji: "🎉" },
  { description: "Rocket", emoji: "🚀" },
  { description: "Fire", emoji: "🔥" },
  { description: "Clapping hands", emoji: "👏" },
  { description: "Face with tears of joy", emoji: "😂" },
  { description: "Thinking face", emoji: "🤔" },
  { description: "Star-struck", emoji: "🤩" },
  { description: "Sleeping face", emoji: "😴" },
  { description: "Face screaming in fear", emoji: "😱" },
  { description: "Winking face", emoji: "😉" },
  { description: "Face with medical mask", emoji: "😷" },
  { description: "Alien", emoji: "👽" },
  { description: "Ghost", emoji: "👻" },
  { description: "Unicorn", emoji: "🦄" },
  { description: "Panda", emoji: "🐼" },
  { description: "Pizza", emoji: "🍕" },
  { description: "Soccer ball", emoji: "⚽" },
  { description: "Rainbow", emoji: "🌈" },
  { description: "Crown", emoji: "👑" },
  { description: "Robot", emoji: "🤖" },
  { description: "Sunflower", emoji: "🌻" },
  { description: "Penguin", emoji: "🐧" },
  { description: "Ice cream", emoji: "🍦" }
];

let timerInterval;
let currentEmojiIndex = 0;
let score = 0;
let streak = 0;
let highScore = localStorage.getItem("emojiHighScore") || 0;
let seconds = 20;
let shuffledEmojis = [];
const time = document.getElementById("time");
const restartGamebtn = document.getElementById("restart-button");
const descriptionElement = document.getElementById("description");
const guessInput = document.getElementById("guess-input");
const resultElement = document.getElementById("result");
const scoreElement = document.getElementById("score");
const guessBtn = document.getElementById("guess-button");
const hintBtn = document.getElementById("hint-button");

// 🆕 Add UI elements
const streakElement = document.createElement("div");
streakElement.id = "streak";
scoreElement.after(streakElement);

const highScoreElement = document.createElement("div");
highScoreElement.id = "high-score";
streakElement.after(highScoreElement);

const progressBar = document.createElement("div");
progressBar.id = "progress-bar";
progressBar.style.height = "10px";
progressBar.style.background = "#00c6ff";
progressBar.style.width = "100%";
progressBar.style.margin = "10px 0";
progressBar.style.borderRadius = "5px";
progressBar.style.transition = "width 0.2s";
time.after(progressBar);

let hintShown = false;

function shuffleArray(array) {
  // Fisher-Yates shuffle
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function updateUI() {
  scoreElement.textContent = `Score: ${score}`;
  streakElement.textContent = `🔥 Streak: ${streak}`;
  highScoreElement.textContent = `🏆 High Score: ${highScore}`;
}

function showConfetti() {
  // Simple emoji confetti
  for (let i = 0; i < 20; i++) {
    const conf = document.createElement("span");
    conf.textContent = ["🎉", "✨", "🥳", "💥", "🎊"][Math.floor(Math.random() * 5)];
    conf.style.position = "fixed";
    conf.style.left = Math.random() * 100 + "vw";
    conf.style.top = "-30px";
    conf.style.fontSize = "2rem";
    conf.style.zIndex = 9999;
    conf.style.transition = "top 1.2s linear, opacity 1.2s";
    document.body.appendChild(conf);
    setTimeout(() => {
      conf.style.top = Math.random() * 80 + 10 + "vh";
      conf.style.opacity = 0;
    }, 10);
    setTimeout(() => conf.remove(), 1300);
  }
}

function showHint() {
  if (!hintShown) {
    resultElement.textContent = `Hint: ${shuffledEmojis[currentEmojiIndex].description}`;
    resultElement.style.color = "#007bff";
    hintShown = true;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  shuffledEmojis = shuffleArray(emojiDetails);
  descriptionElement.textContent = shuffledEmojis[currentEmojiIndex].emoji;
  updateUI();
  startTimer();
});

restartGamebtn.addEventListener("click", () => {
  restartGame();
});

guessInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") guessBtn.click();
});

function restartTimer() {
  clearInterval(timerInterval);
  seconds = 20;
  startTimer();
}

const nextEmojie = () => {
  currentEmojiIndex++;
  if (currentEmojiIndex >= shuffledEmojis.length) {
    endgame();
    return;
  }
  descriptionElement.textContent = shuffledEmojis[currentEmojiIndex].emoji;
  guessInput.value = "";
  resultElement.textContent = "";
  resultElement.style.color = "#333";
  hintShown = false;
  progressBar.style.width = "100%";
  restartTimer();
};

const clearResult = () => {
  resultElement.textContent = "";
};

guessBtn.addEventListener("click", () => {
  const guess = guessInput.value;

  if (
    guess.trim().toLowerCase() ===
    shuffledEmojis[currentEmojiIndex].description.toLowerCase()
  ) {
    score++;
    streak++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("emojiHighScore", highScore);
    }
    updateUI();
    guessInput.value = "";
    resultElement.textContent = "🎉 Correct!";
    resultElement.style.color = "green";
    showConfetti();
    setTimeout(nextEmojie, 1000);
    setTimeout(clearResult, 1000);
  } else {
    resultElement.textContent = "❌ Incorrect!";
    const result = document.createElement("p");
    result.textContent = `Correct answer: ${shuffledEmojis[currentEmojiIndex].description}`;
    resultElement.appendChild(result);
    resultElement.style.color = "red";
    streak = 0;
    updateUI();
    setTimeout(nextEmojie, 2000);
    setTimeout(clearResult, 2000);
  }
});

const endgame = () => {
  guessInput.disabled = true;
  guessBtn.disabled = true;
  hintBtn.disabled = true;
  resultElement.textContent = "🎮 Game Over!";
  resultElement.style.color = "red";
  restartGamebtn.style.display = "inline-block";
};

function restartGame() {
  score = 0;
  streak = 0;
  currentEmojiIndex = 0;
  shuffledEmojis = shuffleArray(emojiDetails);
  scoreElement.textContent = `Score: ${score}`;
  descriptionElement.textContent = shuffledEmojis[currentEmojiIndex].emoji;
  guessInput.disabled = false;
  guessBtn.disabled = false;
  hintBtn.disabled = false;
  resultElement.textContent = "";
  restartGamebtn.style.display = "none";
  hintShown = false;
  updateUI();
  restartTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  time.textContent = seconds;
  progressBar.style.width = "100%";
  let total = seconds;
  timerInterval = setInterval(() => {
    time.textContent = seconds;
    progressBar.style.width = `${(seconds / total) * 100}%`;
    seconds--;

    if (seconds < 0) {
      clearInterval(timerInterval);
      endgame();
      time.textContent = 0;
      progressBar.style.width = "0%";
    }
  }, 1000);
}

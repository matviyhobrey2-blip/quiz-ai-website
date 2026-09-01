const quizData = [
  {
    category: "General Knowledge",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    answer: 1,
    explanation: "Mars appears red because its surface is rich in iron oxide, or rust."
  },
  {
    category: "Science",
    question: "What gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"],
    answer: 2,
    explanation: "Plants take in carbon dioxide during photosynthesis and release oxygen."
  },
  {
    category: "History",
    question: "Who was the first president of the United States?",
    options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
    answer: 1,
    explanation: "George Washington served as the first U.S. president from 1789 to 1797."
  },
  {
    category: "Technology",
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "Hyper Transfer Markup Logic",
      "Home Tool Markup Language"
    ],
    answer: 0,
    explanation: "HTML is the standard markup language used to create web pages."
  },
  {
    category: "Math",
    question: "What is 12 × 8?",
    options: ["96", "88", "104", "92"],
    answer: 0,
    explanation: "12 multiplied by 8 equals 96."
  }
];

const quizContent = document.getElementById("quizContent");
const questionNumber = document.getElementById("questionNumber");
const timerText = document.getElementById("timerText");
const progressFill = document.getElementById("progressFill");
const restartBtn = document.getElementById("restartBtn");

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerId = null;
let answered = false;

function resetQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 15;
  answered = false;
  clearInterval(timerId);
  renderQuestion();
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = 15;
  timerText.textContent = `${timeLeft}s`;

  timerId = setInterval(() => {
    timeLeft -= 1;
    timerText.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleAnswer(null, true);
    }
  }, 1000);
}

function renderQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;

  questionNumber.textContent = `${currentQuestionIndex + 1} / ${quizData.length}`;
  progressFill.style.width = `${progress}%`;
  answered = false;

  quizContent.innerHTML = `
    <div class="question-wrap">
      <span class="question-tag">${currentQuestion.category}</span>
      <h3 class="question-title">${currentQuestion.question}</h3>
      <div class="option-list">
        ${currentQuestion.options
          .map(
            (option, index) => `
              <button class="option-btn" data-index="${index}" type="button">
                ${option}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;

  document.querySelectorAll(".option-btn").forEach((button) => {
    button.addEventListener("click", () => handleAnswer(Number(button.dataset.index), false));
  });

  startTimer();
}

function handleAnswer(selectedIndex, timedOut) {
  if (answered) return;

  answered = true;
  clearInterval(timerId);

  const currentQuestion = quizData[currentQuestionIndex];
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === currentQuestion.answer) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && index !== currentQuestion.answer) {
      button.classList.add("wrong");
    }
  });

  const isCorrect = selectedIndex === currentQuestion.answer;
  if (isCorrect) {
    score += 1;
  }

  const feedbackText = timedOut
    ? `Time's up! The correct answer was: ${currentQuestion.options[currentQuestion.answer]}.`
    : isCorrect
      ? `Correct! ${currentQuestion.explanation}`
      : `Not quite. ${currentQuestion.explanation}`;

  const feedbackClass = isCorrect || timedOut ? "success" : "error";

  const feedback = document.createElement("div");
  feedback.className = `feedback ${feedbackClass}`;
  feedback.textContent = feedbackText;
  quizContent.appendChild(feedback);

  setTimeout(() => {
    currentQuestionIndex += 1;

    if (currentQuestionIndex < quizData.length) {
      renderQuestion();
    } else {
      renderResult();
    }
  }, 1400);
}

function renderResult() {
  const percent = Math.round((score / quizData.length) * 100);
  let resultText = "Great effort!";

  if (percent >= 80) {
    resultText = "Excellent work! You are a quiz expert.";
  } else if (percent >= 50) {
    resultText = "Nice job! You know your stuff.";
  } else if (percent >= 30) {
    resultText = "Solid try! A little more practice will make you shine.";
  }

  questionNumber.textContent = "Finished";
  progressFill.style.width = "100%";
  timerText.textContent = "0s";

  quizContent.innerHTML = `
    <div class="result-card">
      <span class="result-badge">Final score</span>
      <div class="score-value">${score}/${quizData.length}</div>
      <p>${resultText}</p>
      <p>You answered ${percent}% of the questions correctly.</p>

      <div class="result-actions">
        <button class="btn btn-primary" type="button" id="playAgainBtn">Play Again</button>
      </div>
    </div>
  `;

  document.getElementById("playAgainBtn").addEventListener("click", resetQuiz);
}

restartBtn.addEventListener("click", resetQuiz);
resetQuiz();

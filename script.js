const quizData = [
  {
    category: "Історія AI",
    question: "Хто вважається одним із засновників сучасного комп’ютерного мислення та ранніх ідей про штучний інтелект?",
    options: ["Алан Тюрінг", "Стів Джобс", "Білл Гейтс", "Ада Лавлейс"],
    answer: 0,
    explanation: "Алан Тюрінг сильно вплинув на розвиток теорії обчислень та ідей про AI."
  },
  {
    category: "Історія AI",
    question: "У якому році відбулася конференція в Дартмуті, яка вважається початком AI як науки?",
    options: ["1949", "1956", "1968", "1982"],
    answer: 1,
    explanation: "1956 рік вважається роком народження штучного інтелекту."
  },
  {
    category: "Машинне навчання",
    question: "Що в першу чергу вміє робити машинне навчання?",
    options: [
      "Швидше зберігати файли",
      "Вчитися на даних",
      "Замінювати все обладнання",
      "Вимикати комп’ютер"
    ],
    answer: 1,
    explanation: "Машинне навчання допомагає системам знаходити закономірності в даних."
  },
  {
    category: "AI та роботика",
    question: "Яка технологія допомагає комп’ютерам обробляти інформацію шарами, як людський мозок?",
    options: ["Нейронні мережі", "Масиви JavaScript", "USB-порти", "Бінарні дерева"],
    answer: 0,
    explanation: "Нейронні мережі створені для роботи з інформацією через багато шарів."
  },
  {
    category: "Marvel / AI",
    question: "У світі Marvel, яка AI-помічниця була першою системою Тоні Старка перед F.R.I.D.A.Y.?",
    options: ["J.A.R.V.I.S.", "HAL 9000", "Cortana", "Samantha"],
    answer: 0,
    explanation: "J.A.R.V.I.S. була першою AI-помічницею Тоні Старка, а потім з’явилася F.R.I.D.A.Y."
  }
];

const quizContent = document.getElementById("quizContent");
const questionNumber = document.getElementById("questionNumber");
const timerText = document.getElementById("timerText");
const progressFill = document.getElementById("progressFill");
const restartBtn = document.getElementById("restartBtn");

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 10;
let timerId = null;
let answered = false;

function resetQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 10;
  answered = false;
  clearInterval(timerId);
  renderQuestion();
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = 10;
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
    ? `Час вийшов! Правильна відповідь: ${currentQuestion.options[currentQuestion.answer]}.`
    : isCorrect
      ? `Правильно! ${currentQuestion.explanation}`
      : `Не зовсім. ${currentQuestion.explanation}`;

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
  let resultText = "Молодець!";

  if (percent >= 80) {
    resultText = "Чудово! Ти справжній фанат AI.";
  } else if (percent >= 50) {
    resultText = "Непогано! У тебе добрий розум для технологій.";
  } else if (percent >= 30) {
    resultText = "Гарна спроба! AI тільки набирає обертів.";
  }

  questionNumber.textContent = "Finished";
  progressFill.style.width = "100%";
  timerText.textContent = "0s";

  quizContent.innerHTML = `
    <div class="result-card">
      <span class="result-badge">Результат AI</span>
      <div class="score-value">${score}/${quizData.length}</div>
      <p>${resultText}</p>
      <p>Ти вгадав ${percent}% відповідей.</p>
      <p>Фінальна думка: J.A.R.V.I.S. — це вигадка, але AI вже реально змінює світ.</p>

      <div class="result-actions">
        <button class="btn btn-primary" type="button" id="playAgainBtn">Грати ще</button>
      </div>
    </div>
  `;

  document.getElementById("playAgainBtn").addEventListener("click", resetQuiz);
}

restartBtn.addEventListener("click", resetQuiz);
resetQuiz();

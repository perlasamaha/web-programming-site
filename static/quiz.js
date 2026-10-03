// ======================================================
// QUESTIONS
// ======================================================

const questions = [
  {
    question: "Which JavaScript operator tests strict equality?",
    choices: ["=", "==", "===", "!="],
    answer: 2,
    explanation:
      "The === operator compares both value and type.",
  },

  {
    question: "Which keyword declares a block-scoped variable that can later be reassigned?",
    choices: ["var", "let", "const", "static"],
    answer: 1,
    explanation:
      "let declares a block-scoped variable whose value may later be reassigned.",
  },

  {
    question: "Which keyword is used to declare a constant?",
    choices: ["var", "let", "const", "static"],
    answer: 2,
    explanation:
      "const declares a variable whose binding cannot be reassigned.",
  },

  {
    question: "Which data structure stores multiple values in an ordered collection?",
    choices: ["Object", "Array", "Function", "String"],
    answer: 1,
    explanation:
      "An array stores multiple values in an ordered collection.",
  },

  {
    question: "Which keyword is used to declare a function?",
    choices: ["function", "define", "method", "func"],
    answer: 0,
    explanation:
      "The function keyword is used to declare a function.",
  },

    {
    question: "Which symbol is used to write a single-line comment in JavaScript?",
    choices: ["//", "/*", "#", "<!--"],
    answer: 0,
    explanation:
      "Two forward slashes (//) are used to create a single-line comment in JavaScript.",
  },

  {
    question: "Which statement is used to execute a block of code when a condition is true?",
    choices: ["for", "if", "switch", "while"],
    answer: 1,
    explanation:
      "The if statement executes a block of code when its condition evaluates to true.",
  },

  {
    question: "Which JavaScript value represents the absence of an assigned value?",
    choices: ["false", "0", "undefined", "empty"],
    answer: 2,
    explanation:
      "undefined is the value of a variable that has been declared but has not been assigned a value.",
  },

  {
    question: "Which structure is used to store key-value pairs in JavaScript?",
    choices: ["Array", "Object", "String", "Loop"],
    answer: 1,
    explanation:
      "An object stores data as key-value pairs.",
  },

  {
    question: "What does a function return when there is no return statement?",
    choices: ["null", "0", "false", "undefined"],
    answer: 3,
    explanation:
      "A JavaScript function returns undefined when it does not explicitly return a value.",
  },
];

// ======================================================
// APPLICATION STATE
// ======================================================

let currentQuestion = 0;
const userAnswers = new Array(questions.length);

// ======================================================
// SAVE AN ANSWER
// ======================================================

function saveAnswer(choiceIndex) {
  // Save the selected answer for the current question.
  userAnswers[currentQuestion] = choiceIndex;
}

// ======================================================
// NAVIGATION
// ======================================================

function goNext() {
  // Move to the next question if not at the last question.
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  }
}

function goPrevious() {
  // Move to the previous question if not at the first question.
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function goFirst() {
  // Move to the first question.
  currentQuestion = 0;
  renderQuestion();
}

function goLast() {
  // Move to the last question.
  currentQuestion = questions.length - 1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================

function calculateScore() {
  let score = 0;

  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].answer) {
      score++;
    }
  }

  return score;
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================

function calculatePercentage(score) {
  if (questions.length === 0) {
    return 0;
  }

  const percentage = (score / questions.length) * 100;

  return Math.round(percentage);
}

// ======================================================
// PERFORMANCE MESSAGE
// ======================================================

function getPerformanceMessage(percentage) {
  if (percentage >= 80) {
    return "Excellent";
  } else if (percentage >= 60) {
    return "Good";
  } else if (percentage >= 50) {
    return "Pass";
  } else {
    return "Needs improvement";
  }
}

// ======================================================
// BUILD CORRECTION
// ======================================================

function buildCorrection() {
  let correction = "";

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    const userAnswer =
      userAnswers[i] !== undefined
        ? q.choices[userAnswers[i]]
        : "Not Answered";

    const correctAnswer = q.choices[q.answer];

    const result =
      userAnswers[i] === q.answer
        ? "Correct"
        : "Incorrect";

    correction +=
      "Question " + (i + 1) + "\n";
    correction +=
      q.question + "\n";
    correction +=
      "Your answer: " + userAnswer + "\n";
    correction +=
      "Correct answer: " + correctAnswer + "\n";
    correction +=
      "Result: " + result + "\n";
    correction +=
      "Explanation: " + q.explanation + "\n";
    correction += "\n";
  }

  return correction;
}

// ======================================================
// PROVIDED INTERFACE CODE
//
// DOM manipulation and events will be studied later.
// ======================================================

// ======================================================
// SUBMIT QUIZ
// ======================================================

function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();

  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const q = questions[currentQuestion];

  // --------------------------------------------------
  // QUESTION NUMBER
  // --------------------------------------------------

  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  // --------------------------------------------------
  // QUESTION
  // --------------------------------------------------

  document.getElementById("questionText").textContent =
    q.question;

  // --------------------------------------------------
  // CHOICES
  // --------------------------------------------------

  const choicesContainer =
    document.getElementById("choices");

  choicesContainer.innerHTML = "";

  for (let i = 0; i < q.choices.length; i++) {
    const label = document.createElement("label");

    label.className = "choice";

    const radio = document.createElement("input");

    radio.type = "radio";
    radio.name = "answer";
    radio.value = i;

    // Restore an answer previously selected
    // by the user.

    if (userAnswers[currentQuestion] === i) {
      radio.checked = true;
    }

    // When the user selects this answer,
    // save its index.

    radio.onclick = function () {
      saveAnswer(i);
    };

    label.appendChild(radio);

    label.appendChild(
      document.createTextNode(" " + q.choices[i])
    );

    choicesContainer.appendChild(label);
  }

  // --------------------------------------------------
  // NAVIGATION BUTTONS
  // --------------------------------------------------

  document.getElementById("firstBtn").disabled =
    currentQuestion === 0;

  document.getElementById("previousBtn").disabled =
    currentQuestion === 0;

  document.getElementById("nextBtn").disabled =
    currentQuestion === questions.length - 1;

  document.getElementById("lastBtn").disabled =
    currentQuestion === questions.length - 1;
}

// ======================================================
// DISPLAY RESULTS
// ======================================================

function showResults(
  score,
  percentage,
  message,
  correction
) {
  document.getElementById("quizPanel").style.display =
    "none";

  document.getElementById("resultsPanel").style.display =
    "block";

  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;

  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;

  document.getElementById("performanceText").textContent =
    message;

  document.getElementById("correction").textContent =
    correction;
}

// ======================================================
// START APPLICATION
// ======================================================

renderQuestion();


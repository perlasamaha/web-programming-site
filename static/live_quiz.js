// ======================================================
// QUESTIONS
// ======================================================

let total = 0;         // how many questions (from the server) 
const cache = {};      // cache[i] = a fetched question object 

// ======================================================
// APPLICATION STATE
// ======================================================

let currentQuestion = 0;
const userAnswers = [];

async function getQuestion(index) {
    if (cache[index] !== undefined) {
        return cache[index];
    }
    const response = await fetch(`/api/question/${index}`)
     if (!response.ok) {
        throw new Error("HTTP " + response.status);
  }
  const data = await response.json();
  cache[index] = data;
  return data;
}
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
  if (currentQuestion < total - 1) {
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
  currentQuestion = total - 1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================

async function calculateScore() {
  let score = 0;
  for (let i = 0; i < total; i++) {
    const q = await getQuestion(i);
    if (userAnswers[i] === q.answer) {
      score++;
    }
  }

  return score;
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================

function calculatePercentage(score) {
  if (total === 0) {
    return 0;
  }

  const percentage = (score / total) * 100;

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

async function buildCorrection() {
  let correction = "";

  for (let i = 0; i < total; i++) {
    const q = await getQuestion(i);

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

async function submitQuiz() {
  const score = await calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = await buildCorrection();

  showResults(score, percentage, message, correction);
}

async function renderQuestion() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  loading.hidden = false;
  error.hidden = true;
  try {
    const q = await getQuestion(currentQuestion);
    document.getElementById("progress").textContent = `Question ${currentQuestion + 1} of ${total}`;

    document.getElementById("questionText").textContent = q.question;

    const choicesContainer = document.getElementById("choices");

    choicesContainer.innerHTML = ""; // clears any old choices from previous questions so new choices can be rendered

    for (let i = 0; i < q.choices.length; i++) {
        const label = document.createElement("label");

        label.className = "choice";

        const radio = document.createElement("input");

        radio.type = "radio";
        radio.name = "answer";
        radio.value = i;

        if (userAnswers[currentQuestion] === i) {
        radio.checked = true;
        }

        radio.onclick = function () {
        saveAnswer(i);
        };

        label.appendChild(radio); // creates <input type="radio"> inside a label element

        label.appendChild(
        document.createTextNode(" " + q.choices[i])  //creates a text node containing the actual answer choice text and appends it to the same label
        );

        choicesContainer.appendChild(label);  //Takes the fully assembled <label> and inserts it into the main container on the web page so it appears on the screen for the user
    }

    document.getElementById("firstBtn").disabled =
    currentQuestion === 0;

    document.getElementById("previousBtn").disabled =
    currentQuestion === 0;

    document.getElementById("nextBtn").disabled =
    currentQuestion === total - 1;

    document.getElementById("lastBtn").disabled =
    currentQuestion === total - 1;
    }
  catch(err) {
    error.hidden = false;
    error.textContent = "Unable to load question: " + err.message;
    }
  finally {
    loading.hidden = true;
  }
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
    `Score: ${score} / ${total}`;

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
async function init() { 
    const error = document.getElementById("error");
    try {
    const response = await fetch(`/api/questions/count`);
     if (!response.ok) {
        throw new Error("HTTP " + response.status);
  }
    const data = await response.json();
    total = data.count;
    await renderQuestion(); 
    }
    catch(err) {
        error.hidden = false;
        error.textContent = "Unable to load question: " + err.message;
    }
}

init();
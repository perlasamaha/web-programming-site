const form = document.getElementById("profile-form");
const panel = document.getElementById("review");
const list = document.getElementById("review-list");
const editBtn = document.getElementById("edit-btn");
const confirmBtn = document.getElementById("confirm-btn");

const simpleFields = [
  ["Student ID", "student_id"],
  ["Full Name", "fullname"],
  ["USEK Email", "email"],
  ["Mobile Number", "phone"],
  ["Date of Birth", "birthdate"],
  ["GitHub", "portfolio"],
  ["GIN446 website", "gin446"],
  ["Engineering Major", "major"],
  ["Current GPA / 100", "gpa"],
  ["Credits Completed", "credits"],
  ["Expected Graduation Month & Year", "graduation_month"],
  ["Primary Programming Language", "language"],
  ["Proposed Project Title", "project_title"],
  ["Preferred Project Area", "project_area"],
  ["Brief Project Description", "description"],
  ["Preferred Team Size", "team_size"],
  ["Project Dashboard Color", "project_color"],
  ["Preferred Meeting Date", "meeting_date"],
  ["Preferred Meeting Time", "meeting_time"]
];

function addRow(label, value) {
  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = label + ": ";
  p.appendChild(strong);
  p.appendChild(document.createTextNode(value || "—"));
  list.appendChild(p);
}

function buildReview() {
  list.textContent = "";

  simpleFields.forEach(function (field) {
    addRow(field[0], document.getElementById(field[1]).value);
  });

  const grad = document.querySelector('input[name="graduation"]:checked')?.value;
  const internship = document.querySelector('input[name="internship_completed"]:checked')?.value;
  addRow("Expected Graduation", grad);
  addRow("Completed an internship", internship);

  const skills = [...document.querySelectorAll('input[name="skills"]:checked')]
    .map(cb => cb.value);
  addRow("Areas of experience", skills.join(", "));

  const software = [...document.getElementById("software").selectedOptions]
    .map(opt => opt.value);
  addRow("Engineering Software Used", software.join(", "));

  addRow("Confirmation", document.getElementById("confirmation").checked ? "Yes" : "No");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  buildReview();
  form.classList.add("hidden");
  panel.classList.add("open");       
});

editBtn.addEventListener("click", function () {
  panel.classList.remove("open");
  form.classList.remove("hidden");
});


confirmBtn.addEventListener("click", function () {
  HTMLFormElement.prototype.submit.call(form);
});
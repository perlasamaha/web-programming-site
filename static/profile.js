
const form = document.getElementById("profile-form");
const reviewPanel = document.getElementById("review");
const reviewList = document.getElementById("review-list");
const editButton = document.getElementById("edit-btn");
const confirmButton = document.getElementById("confirm-btn");

let confirmed = false;

// Show the form and hide the review panel initially.
form.classList.remove("hidden");
reviewPanel.classList.add("hidden");

// Return a radio button's selected value.
function getRadioValue(name) {
  const selected = document.querySelector(
    `input[name="${name}"]:checked`
  );

  return selected ? selected.value : "Not provided";
}

// Convert a numeric input to a number.
function getNumber(id) {
  const value = document.getElementById(id).value;

  return value === "" ? "Not provided" : Number(value);
}

// Add one item to the review list.
function addLine(label, value) {
  const item = document.createElement("li");
  const heading = document.createElement("strong");

  heading.textContent = label + ": ";
  item.appendChild(heading);
  item.appendChild(document.createTextNode(String(value)));

  reviewList.appendChild(item);
}

// Add a list of selected items, such as skills or software.
function addList(label, values) {
  const item = document.createElement("li");
  const heading = document.createElement("strong");
  const subList = document.createElement("ul");

  heading.textContent = label + ":";
  item.appendChild(heading);

  if (values.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "None selected";
    subList.appendChild(emptyItem);
  } else {
    values.forEach(function (value) {
      const subItem = document.createElement("li");
      subItem.textContent = value;
      subList.appendChild(subItem);
    });
  }

  item.appendChild(subList);
  reviewList.appendChild(item);
}

// Read the form values and display them in the review panel.
function buildReview() {
  reviewList.textContent = "";

  // 1. Personal Information
  addLine("Student ID", document.getElementById("student_id").value);
  addLine("Full Name", document.getElementById("fullname").value);
  addLine("USEK Email", document.getElementById("email").value);
  addLine("Mobile Number", document.getElementById("phone").value);

  addLine(
    "Date of Birth",
    document.getElementById("birthdate").value || "Not provided"
  );

  addLine(
    "GitHub",
    document.getElementById("portfolio").value || "Not provided"
  );

  addLine(
    "GIN446 Website",
    document.getElementById("gin446").value || "Not provided"
  );

  // 2. Academic Information
  addLine("Engineering Major", document.getElementById("major").value);
  addLine("Current GPA / 100", getNumber("gpa"));
  addLine("Credits Completed", getNumber("credits"));
  addLine("Expected Graduation Season", getRadioValue("graduation"));

  addLine(
    "Graduation Month and Year",
    document.getElementById("graduation_month").value || "Not provided"
  );

  addLine(
    "Engineering Internship Completed",
    getRadioValue("internship_completed")
  );

  // 3. Technical Background
  const skills = [
    ...document.querySelectorAll('input[name="skills"]:checked')
  ].map(function (checkbox) {
    return checkbox.value;
  });

  addList("Areas of Experience", skills);

  addLine(
    "Primary Programming Language",
    document.getElementById("language").value || "Not provided"
  );

  const software = [
    ...document.getElementById("software").selectedOptions
  ].map(function (option) {
    return option.value;
  });

  addList("Engineering Software Used", software);

  // 4. Final Year Project
  addLine(
    "Proposed Project Title",
    document.getElementById("project_title").value
  );

  addLine(
    "Preferred Project Area",
    document.getElementById("project_area").value
  );

  addLine(
    "Project Description",
    document.getElementById("description").value || "Not provided"
  );

  addLine("Preferred Team Size", getNumber("team_size"));

  addLine(
    "Project Dashboard Color",
    document.getElementById("project_color").value
  );

  addLine(
    "Preferred Meeting Date",
    document.getElementById("meeting_date").value || "Not provided"
  );

  addLine(
    "Preferred Meeting Time",
    document.getElementById("meeting_time").value || "Not provided"
  );

  addLine(
    "Information Confirmed",
    document.getElementById("confirmation").checked ? "Yes" : "No"
  );
}

// Listen for form submission and show the review first.
form.addEventListener("submit", function (event) {
  // If the user has confirmed, allow the form to submit to Flask.
  if (confirmed) {
    return;
  }

  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  buildReview();

  form.classList.add("hidden");
  reviewPanel.classList.remove("hidden");
});

// Return to the form so the user can make changes.
editButton.addEventListener("click", function () {
  confirmed = false;

  reviewPanel.classList.add("hidden");
  form.classList.remove("hidden");
});

// Confirm and submit the form to the Flask route.
confirmButton.addEventListener("click", function () {
  if (!form.checkValidity()) {
    reviewPanel.classList.add("hidden");
    form.classList.remove("hidden");
    form.reportValidity();
    return;
  }

  confirmed = true;

  // Reuses browser validation and submits to the form's action URL.
  form.requestSubmit();
});

// If the user clears the form, return to the form view.
form.addEventListener("reset", function () {
  confirmed = false;

  reviewPanel.classList.add("hidden");
  form.classList.remove("hidden");
});

// =====================================================
// HireLane Job Portal - simple version
// =====================================================

// ---------- 1. Sample jobs ----------
var defaultJobs = [
  { id: 1, title: "Frontend Developer", company: "Zoho Labs", location: "Chennai", type: "Full-time", level: "1-3 yrs", salary: "Rs 6-10 LPA", skills: ["HTML", "CSS", "JavaScript", "React"], desc: "Build responsive web interfaces for our SaaS products.\nWork with designers and backend engineers.", posted: "2026-09-28" },
  { id: 2, title: "UI/UX Designer", company: "Pixelwave Studio", location: "Remote", type: "Remote", level: "Fresher", salary: "Rs 4-6 LPA", skills: ["Figma", "Prototyping"], desc: "Design wireframes and high-fidelity screens.\nRun usability tests.", posted: "2026-09-27" },
  { id: 3, title: "Software Engineer Intern", company: "Freshworks", location: "Chennai", type: "Internship", level: "Fresher", salary: "Rs 25,000 / month", skills: ["Java", "SQL", "Git"], desc: "6-month internship on the core platform team.", posted: "2026-09-25" },
  { id: 4, title: "Python Backend Developer", company: "Kovai Tech", location: "Coimbatore", type: "Full-time", level: "3+ yrs", salary: "Rs 12-18 LPA", skills: ["Python", "Django", "PostgreSQL"], desc: "Design REST APIs and background jobs.", posted: "2026-09-24" },
  { id: 5, title: "Data Analyst", company: "Insightly", location: "Bengaluru", type: "Full-time", level: "1-3 yrs", salary: "Rs 7-11 LPA", skills: ["SQL", "Excel", "Power BI"], desc: "Turn raw data into dashboards and weekly reports.", posted: "2026-09-22" },
  { id: 6, title: "Content Writer", company: "Wordcraft", location: "Remote", type: "Part-time", level: "Fresher", salary: "Rs 15,000 / month", skills: ["Writing", "SEO"], desc: "Write blog posts and website copy.", posted: "2026-09-20" },
  { id: 7, title: "Mobile App Developer", company: "Appnest", location: "Hyderabad", type: "Contract", level: "1-3 yrs", salary: "Rs 80,000 / month", skills: ["Flutter", "Dart", "Firebase"], desc: "3-month contract to build a delivery app.", posted: "2026-09-18" },
  { id: 8, title: "Machine Learning Engineer", company: "Neuronix", location: "Chennai", type: "Full-time", level: "3+ yrs", salary: "Rs 15-25 LPA", skills: ["Python", "PyTorch", "OpenCV"], desc: "Train and deploy computer vision models.", posted: "2026-09-15" }
];

// ---------- 2. Save and load data (localStorage) ----------
function loadData(key, defaultValue) {
  var text = localStorage.getItem(key);
  if (text === null) {
    return defaultValue;
  }
  return JSON.parse(text);
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

var jobs = loadData("jobs", defaultJobs);          // all jobs
var savedIds = loadData("savedIds", []);           // ids of saved jobs
var applications = loadData("applications", []);   // applied jobs

// ---------- 3. Small helper functions ----------
// Make text safe before putting it inside HTML
function safe(text) {
  text = String(text);
  text = text.replace(/&/g, "&amp;");
  text = text.replace(/</g, "&lt;");
  text = text.replace(/>/g, "&gt;");
  text = text.replace(/"/g, "&quot;");
  return text;
}

function isSaved(id) {
  return savedIds.indexOf(id) !== -1;
}

function hasApplied(id) {
  for (var i = 0; i < applications.length; i++) {
    if (applications[i].jobId === id) {
      return true;
    }
  }
  return false;
}

function findJob(id) {
  for (var i = 0; i < jobs.length; i++) {
    if (jobs[i].id === id) {
      return jobs[i];
    }
  }
  return null;
}

// Small popup message at the bottom
function showToast(message) {
  var toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 2000);
}

function updateBadges() {
  document.getElementById("savedCount").textContent = savedIds.length;
  document.getElementById("appCount").textContent = applications.length;
}

// ---------- 4. Switch between pages (tabs) ----------
function showView(name) {
  var views = document.querySelectorAll(".view");
  for (var i = 0; i < views.length; i++) {
    views[i].classList.remove("active");
  }
  document.getElementById("view-" + name).classList.add("active");

  var buttons = document.querySelectorAll("#nav button");
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].classList.remove("active");
    if (buttons[j].getAttribute("data-view") === name) {
      buttons[j].classList.add("active");
    }
  }

  if (name === "saved") { showSavedJobs(); }
  if (name === "applications") { showApplications(); }
  window.scrollTo(0, 0);
}

var navButtons = document.querySelectorAll("#nav button");
for (var n = 0; n < navButtons.length; n++) {
  navButtons[n].onclick = function () {
    showView(this.getAttribute("data-view"));
  };
}

// ---------- 5. Build HTML for one job card ----------
function makeJobCard(job) {
  var saveText = isSaved(job.id) ? "Saved" : "Save";
  var skillsHtml = "";
  for (var i = 0; i < job.skills.length; i++) {
    skillsHtml += '<span class="tag skill">' + safe(job.skills[i]) + "</span>";
  }
  var salaryHtml = "";
  if (job.salary !== "") {
    salaryHtml = '<span class="tag">' + safe(job.salary) + "</span>";
  }
  var statusHtml = "<span>View details</span>";
  if (hasApplied(job.id)) {
    statusHtml = '<span class="status">Applied</span>';
  }

  return (
    '<article class="card job" onclick="openModal(' + job.id + ')">' +
      '<div class="job-head">' +
        "<div>" +
          "<h3>" + safe(job.title) + "</h3>" +
          '<div class="company">' + safe(job.company) + " - " + safe(job.location) + "</div>" +
        "</div>" +
        '<button class="btn ghost sm" onclick="toggleSave(event, ' + job.id + ')">' + saveText + "</button>" +
      "</div>" +
      '<div class="tags">' +
        '<span class="tag">' + safe(job.type) + "</span>" +
        '<span class="tag">' + safe(job.level) + "</span>" +
        salaryHtml + skillsHtml +
      "</div>" +
      '<div class="job-foot">' +
        "<span>Posted " + safe(job.posted) + "</span>" + statusHtml +
      "</div>" +
    "</article>"
  );
}

// ---------- 6. Show jobs (with search and filters) ----------
function showJobs() {
  var q = document.getElementById("q").value.toLowerCase();
  var loc = document.getElementById("loc").value.toLowerCase();
  var type = document.getElementById("type").value;
  var level = document.getElementById("level").value;

  var html = "";
  var count = 0;

  for (var i = 0; i < jobs.length; i++) {
    var job = jobs[i];
    var searchText = (job.title + " " + job.company + " " + job.skills.join(" ")).toLowerCase();

    var matchSearch = (q === "") || (searchText.indexOf(q) !== -1);
    var matchLocation = (loc === "") || (job.location.toLowerCase().indexOf(loc) !== -1);
    var matchType = (type === "") || (job.type === type);
    var matchLevel = (level === "") || (job.level === level);

    if (matchSearch && matchLocation && matchType && matchLevel) {
      html += makeJobCard(job);
      count++;
    }
  }

  if (count === 0) {
    html = '<div class="empty">No jobs found. Try a different keyword or clear the filters.</div>';
  }

  document.getElementById("resultCount").textContent = count + " job(s) found";
  document.getElementById("jobList").innerHTML = html;
  updateBadges();
}

// Run showJobs whenever the user types or changes a filter
document.getElementById("q").oninput = showJobs;
document.getElementById("loc").oninput = showJobs;
document.getElementById("type").onchange = showJobs;
document.getElementById("level").onchange = showJobs;

document.getElementById("clear").onclick = function () {
  document.getElementById("q").value = "";
  document.getElementById("loc").value = "";
  document.getElementById("type").value = "";
  document.getElementById("level").value = "";
  showJobs();
};

// ---------- 7. Saved jobs ----------
function toggleSave(event, id) {
  event.stopPropagation();   // do not open the popup when Save is clicked

  var index = savedIds.indexOf(id);
  if (index === -1) {
    savedIds.push(id);
    showToast("Job saved");
  } else {
    savedIds.splice(index, 1);
    showToast("Removed from saved");
  }
  saveData("savedIds", savedIds);

  showJobs();
  showSavedJobs();
}

function showSavedJobs() {
  var html = "";
  for (var i = 0; i < jobs.length; i++) {
    if (isSaved(jobs[i].id)) {
      html += makeJobCard(jobs[i]);
    }
  }
  if (html === "") {
    html = '<div class="empty">No saved jobs yet. Click Save on any job.</div>';
  }
  document.getElementById("savedList").innerHTML = html;
}

// ---------- 8. Job details popup + apply form ----------
var modal = document.getElementById("modal");

function openModal(id) {
  var job = findJob(id);

  var skillsHtml = "";
  for (var i = 0; i < job.skills.length; i++) {
    skillsHtml += '<span class="tag skill">' + safe(job.skills[i]) + "</span>";
  }

  var bottomHtml = "";
  if (hasApplied(id)) {
    bottomHtml = '<p class="status">You have already applied to this job.</p>';
  } else {
    bottomHtml =
      '<form class="apply" onsubmit="return submitApplication(' + id + ')">' +
        '<label>Full name<input id="applyName" required></label>' +
        '<label>Email<input id="applyEmail" type="email" required></label>' +
        '<label>Why are you a good fit?<textarea id="applyNote" rows="3"></textarea></label>' +
        '<button class="btn" type="submit">Apply now</button>' +
      "</form>";
  }

  document.getElementById("modalBody").innerHTML =
    '<div class="modal-in">' +
      '<div class="modal-top">' +
        "<div>" +
          "<h2>" + safe(job.title) + "</h2>" +
          '<div class="company">' + safe(job.company) + " - " + safe(job.location) + "</div>" +
        "</div>" +
        '<button class="close" onclick="closeModal()">&times;</button>' +
      "</div>" +
      '<p class="desc">' + safe(job.desc) + "</p>" +
      '<div class="tags" style="margin-bottom:18px">' + skillsHtml + "</div>" +
      bottomHtml +
    "</div>";

  modal.showModal();
}

function closeModal() {
  modal.close();
}

// Close the popup when clicking on the dark background
modal.onclick = function (event) {
  if (event.target === modal) {
    modal.close();
  }
};

// ---------- 9. Apply for a job ----------
function submitApplication(id) {
  var job = findJob(id);

  var application = {
    jobId: id,
    title: job.title,
    company: job.company,
    name: document.getElementById("applyName").value,
    email: document.getElementById("applyEmail").value,
    note: document.getElementById("applyNote").value,
    date: new Date().toDateString(),
    status: "Applied"
  };

  applications.push(application);
  saveData("applications", applications);

  modal.close();
  showToast("Application sent");
  showJobs();
  return false;   // stop the page from reloading
}

// ---------- 10. My applications ----------
function showApplications() {
  var html = "";
  for (var i = 0; i < applications.length; i++) {
    var a = applications[i];
    html +=
      '<article class="card">' +
        '<div class="job-head">' +
          "<div>" +
            "<h3>" + safe(a.title) + "</h3>" +
            '<div class="company">' + safe(a.company) + " - Applied on " + safe(a.date) + "</div>" +
          "</div>" +
          '<span class="status">' + safe(a.status) + "</span>" +
        "</div>" +
        '<div class="job-foot">' +
          "<span>" + safe(a.name) + " - " + safe(a.email) + "</span>" +
          '<button class="btn danger sm" onclick="withdrawApplication(' + a.jobId + ')">Withdraw</button>' +
        "</div>" +
      "</article>";
  }
  if (html === "") {
    html = '<div class="empty">You have not applied to any jobs yet.</div>';
  }
  document.getElementById("appList").innerHTML = html;
}

function withdrawApplication(jobId) {
  var remaining = [];
  for (var i = 0; i < applications.length; i++) {
    if (applications[i].jobId !== jobId) {
      remaining.push(applications[i]);
    }
  }
  applications = remaining;
  saveData("applications", applications);

  showToast("Application withdrawn");
  showApplications();
  showJobs();
}

// ---------- 11. Post a new job ----------
document.getElementById("postForm").onsubmit = function (event) {
  event.preventDefault();   // stop the page from reloading

  var form = document.getElementById("postForm");

  // turn "HTML, CSS, JS" into a list: ["HTML", "CSS", "JS"]
  var skillParts = form.elements["skills"].value.split(",");
  var skills = [];
  for (var i = 0; i < skillParts.length; i++) {
    var skill = skillParts[i].trim();
    if (skill !== "") {
      skills.push(skill);
    }
  }

  var newJob = {
    id: Date.now(),
    title: form.elements["title"].value,
    company: form.elements["company"].value,
    location: form.elements["location"].value,
    type: form.elements["type"].value,
    level: form.elements["level"].value,
    salary: form.elements["salary"].value,
    skills: skills,
    desc: form.elements["desc"].value,
    posted: new Date().toISOString().slice(0, 10)
  };

  jobs.unshift(newJob);   // add at the top of the list
  saveData("jobs", jobs);

  form.reset();
  showToast("Job published");
  showView("jobs");
  showJobs();
};

// ---------- 12. Start the app ----------
showJobs();
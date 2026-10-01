/* ---------- Storage helpers ---------- */
const load = (k, fallback) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; }
};
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

/* ---------- Seed data ---------- */
const SEED_JOBS = [
  { id: 1, title: "Frontend Developer", company: "Zoho Labs", location: "Chennai", type: "Full-time", level: "1-3 yrs", salary: "₹6–10 LPA", skills: ["HTML", "CSS", "JavaScript", "React"], desc: "Build responsive web interfaces for our SaaS products.\nWork closely with designers and backend engineers.\nWrite clean, testable code and review pull requests.", posted: "2026-09-28" },
  { id: 2, title: "UI/UX Designer", company: "Pixelwave Studio", location: "Remote", type: "Remote", level: "Fresher", salary: "₹4–6 LPA", skills: ["Figma", "Prototyping", "User research"], desc: "Design wireframes, flows and high-fidelity screens.\nRun usability tests and turn findings into improvements.", posted: "2026-09-27" },
  { id: 3, title: "Software Engineer Intern", company: "Freshworks", location: "Chennai", type: "Internship", level: "Fresher", salary: "₹25,000 / month", skills: ["Java", "SQL", "Git"], desc: "6-month internship on the core platform team.\nYou will ship real features with a mentor.", posted: "2026-09-25" },
  { id: 4, title: "Python Backend Developer", company: "Kovai Tech", location: "Coimbatore", type: "Full-time", level: "3+ yrs", salary: "₹12–18 LPA", skills: ["Python", "Django", "PostgreSQL", "AWS"], desc: "Design REST APIs and background jobs.\nOptimise database queries and own services end to end.", posted: "2026-09-24" },
  { id: 5, title: "Data Analyst", company: "Insightly", location: "Bengaluru", type: "Full-time", level: "1-3 yrs", salary: "₹7–11 LPA", skills: ["SQL", "Excel", "Power BI"], desc: "Turn raw data into dashboards and weekly business reports.", posted: "2026-09-22" },
  { id: 6, title: "Content Writer", company: "Wordcraft", location: "Remote", type: "Part-time", level: "Fresher", salary: "₹15,000 / month", skills: ["Writing", "SEO"], desc: "Write blog posts and landing page copy for tech clients.\nFlexible hours, 20 hours per week.", posted: "2026-09-20" },
  { id: 7, title: "Mobile App Developer", company: "Appnest", location: "Hyderabad", type: "Contract", level: "1-3 yrs", salary: "₹80,000 / month", skills: ["Flutter", "Dart", "Firebase"], desc: "3-month contract to build a delivery app MVP.\nExtension possible based on performance.", posted: "2026-09-18" },
  { id: 8, title: "Machine Learning Engineer", company: "Neuronix", location: "Chennai", type: "Full-time", level: "3+ yrs", salary: "₹15–25 LPA", skills: ["Python", "PyTorch", "OpenCV"], desc: "Train and deploy computer vision models in production.\nWork with large image datasets and optimise inference speed.", posted: "2026-09-15" }
];

/* ---------- State ---------- */
let jobs = load("hl_jobs", SEED_JOBS);
let saved = load("hl_saved", []);          // array of job ids
let applications = load("hl_apps", []);    // array of application objects

/* ---------- Utils ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (str) => String(str ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const hasApplied = (id) => applications.some(a => a.jobId === id);

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Navigation ---------- */
function showView(name) {
  $$(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + name));
  $$("#nav button").forEach(b => b.classList.toggle("active", b.dataset.view === name));
  if (name === "saved") renderSaved();
  if (name === "applications") renderApplications();
  window.scrollTo({ top: 0 });
}
$("#nav").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (b) showView(b.dataset.view);
});

/* ---------- Render: job cards ---------- */
function jobCard(j) {
  const isSaved = saved.includes(j.id);
  return `
    <article class="card job" data-id="${j.id}" tabindex="0">
      <div class="job-head">
        <div>
          <h3>${esc(j.title)}</h3>
          <div class="company">${esc(j.company)} · ${esc(j.location)}</div>
        </div>
        <button class="btn ghost sm" data-save="${j.id}" aria-pressed="${isSaved}">${isSaved ? "Saved" : "Save"}</button>
      </div>
      <div class="tags">
        <span class="tag">${esc(j.type)}</span>
        <span class="tag">${esc(j.level)}</span>
        ${j.salary ? `<span class="tag">${esc(j.salary)}</span>` : ""}
        ${j.skills.slice(0, 4).map(s => `<span class="tag skill">${esc(s)}</span>`).join("")}
      </div>
      <div class="job-foot">
        <span>Posted ${fmtDate(j.posted)}</span>
        ${hasApplied(j.id) ? `<span class="status">Applied</span>` : `<span>View details</span>`}
      </div>
    </article>`;
}

function renderJobs() {
  const q = $("#q").value.trim().toLowerCase();
  const loc = $("#loc").value.trim().toLowerCase();
  const type = $("#type").value;
  const level = $("#level").value;

  const result = jobs.filter(j =>
    (!q || [j.title, j.company, ...j.skills].join(" ").toLowerCase().includes(q)) &&
    (!loc || j.location.toLowerCase().includes(loc)) &&
    (!type || j.type === type) &&
    (!level || j.level === level)
  ).sort((a, b) => new Date(b.posted) - new Date(a.posted));

  $("#resultCount").textContent = `${result.length} job${result.length === 1 ? "" : "s"} found`;
  $("#jobList").innerHTML = result.length
    ? result.map(jobCard).join("")
    : `<div class="empty">No jobs match these filters. Clear a filter or try a different keyword.</div>`;
  updateBadges();
}

function renderSaved() {
  const list = jobs.filter(j => saved.includes(j.id));
  $("#savedList").innerHTML = list.length
    ? list.map(jobCard).join("")
    : `<div class="empty">No saved jobs yet. Tap Save on any job to keep it here.</div>`;
}

function renderApplications() {
  $("#appList").innerHTML = applications.length
    ? applications.map(a => `
      <article class="card">
        <div class="job-head">
          <div>
            <h3>${esc(a.title)}</h3>
            <div class="company">${esc(a.company)} · Applied ${fmtDate(a.date)}</div>
          </div>
          <span class="status">${esc(a.status)}</span>
        </div>
        <div class="job-foot">
          <span>${esc(a.name)} · ${esc(a.email)}</span>
          <button class="btn danger sm" data-withdraw="${a.jobId}">Withdraw</button>
        </div>
      </article>`).join("")
    : `<div class="empty">You haven't applied to any jobs yet. Find a job and press Apply.</div>`;
}

function updateBadges() {
  $("#savedCount").textContent = saved.length;
  $("#appCount").textContent = applications.length;
}

/* ---------- Filters ---------- */
["#q", "#loc"].forEach(s => $(s).addEventListener("input", renderJobs));
["#type", "#level"].forEach(s => $(s).addEventListener("change", renderJobs));
$("#clear").addEventListener("click", () => {
  $("#q").value = ""; $("#loc").value = ""; $("#type").value = ""; $("#level").value = "";
  renderJobs();
});

/* ---------- Card clicks (save / open) ---------- */
function handleCardClick(e) {
  const saveBtn = e.target.closest("[data-save]");
  if (saveBtn) {
    e.stopPropagation();
    toggleSave(+saveBtn.dataset.save);
    return;
  }
  const card = e.target.closest(".job");
  if (card) openModal(+card.dataset.id);
}
["#jobList", "#savedList"].forEach(s => {
  $(s).addEventListener("click", handleCardClick);
  $(s).addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.classList.contains("job")) openModal(+e.target.dataset.id);
  });
});

function toggleSave(id) {
  saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
  save("hl_saved", saved);
  toast(saved.includes(id) ? "Job saved" : "Removed from saved");
  renderJobs();
  if ($("#view-saved").classList.contains("active")) renderSaved();
}

/* ---------- Modal: details + apply ---------- */
const modal = $("#modal");

function openModal(id) {
  const j = jobs.find(x => x.id === id);
  if (!j) return;
  $("#modalBody").innerHTML = `
    <div class="modal-in">
      <div class="modal-top">
        <div>
          <h2>${esc(j.title)}</h2>
          <div class="company">${esc(j.company)} · ${esc(j.location)}</div>
        </div>
        <button class="close" data-close aria-label="Close">&times;</button>
      </div>
      <div class="tags">
        <span class="tag">${esc(j.type)}</span>
        <span class="tag">${esc(j.level)}</span>
        ${j.salary ? `<span class="tag">${esc(j.salary)}</span>` : ""}
      </div>
      <p class="desc">${esc(j.desc)}</p>
      <div class="tags" style="margin-bottom:18px">${j.skills.map(s => `<span class="tag skill">${esc(s)}</span>`).join("")}</div>
      ${hasApplied(id)
        ? `<p class="status">You have already applied to this job.</p>`
        : `<form class="apply" id="applyForm" data-id="${id}">
             <label>Full name<input name="name" required></label>
             <label>Email<input name="email" type="email" required></label>
             <label>Why are you a good fit?<textarea name="note" rows="3"></textarea></label>
             <button class="btn" type="submit">Apply now</button>
           </form>`}
    </div>`;
  modal.showModal();
}

modal.addEventListener("click", e => {
  if (e.target === modal || e.target.closest("[data-close]")) modal.close();
});

modal.addEventListener("submit", e => {
  if (e.target.id !== "applyForm") return;
  e.preventDefault();
  const id = +e.target.dataset.id;
  const j = jobs.find(x => x.id === id);
  const f = new FormData(e.target);
  applications.push({
    jobId: id, title: j.title, company: j.company,
    name: f.get("name").trim(), email: f.get("email").trim(), note: f.get("note").trim(),
    date: new Date().toISOString(), status: "Applied"
  });
  save("hl_apps", applications);
  modal.close();
  toast("Application sent");
  renderJobs();
});

/* ---------- Withdraw application ---------- */
$("#appList").addEventListener("click", e => {
  const b = e.target.closest("[data-withdraw]");
  if (!b) return;
  applications = applications.filter(a => a.jobId !== +b.dataset.withdraw);
  save("hl_apps", applications);
  toast("Application withdrawn");
  renderApplications();
  renderJobs();
});

/* ---------- Post a job ---------- */
$("#postForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  jobs.push({
    id: Date.now(),
    title: f.get("title").trim(),
    company: f.get("company").trim(),
    location: f.get("location").trim(),
    type: f.get("type"),
    level: f.get("level"),
    salary: f.get("salary").trim(),
    skills: f.get("skills").split(",").map(s => s.trim()).filter(Boolean),
    desc: f.get("desc").trim(),
    posted: new Date().toISOString().slice(0, 10)
  });
  save("hl_jobs", jobs);
  e.target.reset();
  toast("Job published");
  showView("jobs");
  renderJobs();
});

/* ---------- Init ---------- */
renderJobs();

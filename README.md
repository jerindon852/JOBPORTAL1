# HireLane - Job Portal

A simple job portal built with plain HTML, CSS and JavaScript. No framework, no backend, no build step.

## Features

- Browse job listings (8 sample jobs included)
- Search by job title, company or skill
- Filter by location, job type and experience level
- View full job details in a popup
- Apply for a job with name, email and a short note
- Save jobs and view them later in the Saved tab
- Track your applications and withdraw them
- Post a new job, which appears at the top of the list
- Data stays after refresh (stored in the browser's `localStorage`)
- Responsive layout with automatic light and dark mode

## Project Structure

```
job-portal/
├── index.html          # Page structure (tabs, filters, forms, popup)
├── style.css           # All styling
├── script.js           # App logic (beginner-friendly version)
├── script-advanced.js  # Optional: same logic in modern JavaScript
└── README.md
```

To use the advanced version, change the script tag in `index.html` to `<script src="script-advanced.js"></script>`.

## How to Run

No installation is needed. Use any one of these:

**Option 1: Open the file**
Double-click `index.html` to open it in your browser.

**Option 2: VS Code Live Server**
1. Install the **Live Server** extension.
2. Right-click `index.html` and choose **Open with Live Server**.

**Option 3: Terminal (needs Node.js 18+)**
```bash
cd job-portal
npx serve
```
Open `http://localhost:3000` in your browser.

**Option 4: Terminal (needs Python)**
```bash
cd job-portal
python -m http.server 5500
```
Open `http://localhost:5500` in your browser.

> Note: `script.js` runs in the browser only. Running `node script.js` will fail because it uses `document` and `localStorage`.

## How to Use

1. **Find jobs:** type in the search box or use the filters. Click a job card to see details.
2. **Apply:** open a job, fill in your name and email, then click **Apply now**.
3. **Saved:** click **Save** on any card. See all saved jobs in the Saved tab.
4. **Applications:** see everything you applied to. Click **Withdraw** to remove one.
5. **Post a job:** fill the form and click **Publish job**.

## Data Storage

All data is saved in your browser's `localStorage` under these keys:

| Key            | Contains                  |
| -------------- | ------------------------- |
| `jobs`         | All job listings          |
| `savedIds`     | IDs of saved jobs         |
| `applications` | Jobs you applied to       |

To reset the app: open browser DevTools, go to **Application > Local Storage**, and clear the entries (or run `localStorage.clear()` in the Console), then refresh.

Data is local to one browser on one device. There is no server or database.

## Browser Support

Latest Chrome, Edge, Firefox and Safari. The job popup uses the HTML `<dialog>` element.

## Possible Improvements

- Backend with Node.js/Express or Firebase for real storage
- User login for job seekers and employers
- Resume upload
- Pagination and sorting options

## Tech Stack

HTML5, CSS3, JavaScript (ES5 style), localStorage
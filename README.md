# ResuMate – Resume & Progress Mini-Project

ResuMate is a small but production-style web application that helps you:

- Build and edit a resume using structured sections
- Preview multiple resume templates
- Generate a PDF resume from HTML templates
- Track learning progress, skills, streak, goals, and daily motivational quotes
- Manage tasks with scheduling and reminders
- Get AI-powered recommendations

The app supports **user authentication** and **multi-user functionality**.

## 🚀 Quick Start with Docker

The easiest way to run ResuMate is using Docker:

```bash
# Build the Docker image
docker build -t resumate .

# Run the container
docker run -p 4000:4000 resumate
```

Then open `http://localhost:4000` in your browser!

## 🏃‍♂️ Local Development

If you prefer to run locally:

---

## 1. Tech Stack

- **Backend**
  - Node.js
  - Express.js
  - SQLite
  - Sequelize ORM
  - JWT Authentication
  - Puppeteer (HTML → PDF)
- **Frontend**
  - HTML + CSS
  - Vanilla JavaScript (ES modules)
  - Fetch API for requests

Project layout (top-level):

- `backend/` – Express server, Sequelize models, controllers, routes, services, PDF templates
- `frontend/` – Static HTML pages, CSS, JS components, Axios API layer

---

## 2. Project Structure (important files)

**Backend**

- `backend/index.js` – Express app, static file serving, route registration, DB sync
- `backend/db.js` – Sequelize + SQLite connection
- `backend/models/Resume.js` – Resume model (summary + JSON sections)
- `backend/models/Progress.js` – Progress model (tasks, skillsProgress, goals, dailyQuotes)
- `backend/controllers/resume.controller.js` – Resume API logic
- `backend/controllers/progress.controller.js` – Progress API logic
- `backend/routes/resume.routes.js` – `/api/resume/*` endpoints
- `backend/routes/progress.routes.js` – `/api/progress/*` endpoints
- `backend/services/pdfGenerator.js` – HTML template reading + PDF generation (Puppeteer)
- `backend/services/goalsService.js` – Default + merged goals
- `backend/services/quotesService.js` – Daily and random quotes
- `backend/utils/errorHandler.js` – Central error response handler
- `backend/templates/*.html` – Resume templates:
  - `simple.html`
  - `modern.html`
  - `minimal.html`
  - `creative.html`

**Frontend**

- `frontend/pages/`
  - `index.html` – Home
  - `resume-editor.html`
  - `resume-viewer.html`
  - `resume-templates.html`
  - `progress-dashboard.html`
  - `goals.html`
  - `daily-quotes.html`
- `frontend/css/`
  - `global.css` – Theme, layout, navigation, cards
  - `home.css` – Home page buttons/loader
  - `resume.css` – Resume editor/viewer/templates styles
  - `progress.css` – Progress, goals, and quotes styling
- `frontend/components/`
  - `TemplateCard.js`
  - `ExperienceCard.js`
  - `SkillsBadge.js`
  - `SkillProgressBar.js`
  - `StreakBadge.js`
  - `GoalCard.js`
  - `Button.js`
  - `Input.js`
  - `Loader.js`
- `frontend/api/`
  - `axiosConfig.js` – Axios instance with `/api` baseURL
  - `resumeApi.js`
  - `progressApi.js`
- `frontend/js/`
  - `home.js`
  - `resumeEditor.js`
  - `resumeViewer.js`
  - `resumeTemplates.js`
  - `progressDashboard.js`
  - `goalsPage.js`
  - `quotesPage.js`

---

## 3. Database Models

### Resume

- `summary` – `TEXT`
- `experience` – `JSON` (stored as JSONB), default `[]`
- `education` – `JSON` (JSONB), default `[]`
- `skills` – `JSON` (JSONB), default `[]`
- `projects` – `JSON` (JSONB), default `[]`

> The app treats `experience`, `education`, `skills`, and `projects` as arrays. The editor lets you paste structured JSON for simplicity in this mini-project.

### Progress

- `tasksCompleted` – `INTEGER`, default `0`
- `tasksTotal` – `INTEGER`, default `0`
- `skillsProgress` – `JSON` (JSONB), default `[]`
- `streak` – `INTEGER`, default `0`
- `goals` – `JSON` (JSONB), default `[]`
- `dailyQuotes` – `JSON` (JSONB), default `[]`

---

## 4. API Endpoints

All endpoints are prefixed with `/api` on the Express server.

### Resume

- `POST /api/resume/save`  
  Save (or update) the single stored resume.
- `GET /api/resume/get`  
  Get the current resume (auto-creates an empty one if none exists).
- `POST /api/resume/generate-pdf`  
  Request body:

  ```json
  {
    "template": "simple | modern | minimal | creative",
    "meta": {
      "name": "Your Name",
      "title": "Headline",
      "contact": "Email • Phone • Location • Links"
    }
  }
  ```

  Returns a PDF file as a binary response (downloaded on the frontend).

### Progress

- `GET /api/progress/get`  
  Get the current progress entry (auto-creates one if none exists).
- `POST /api/progress/update`  
  Body fields (all optional; only provided fields are updated):

  ```json
  {
    "tasksCompleted": 5,
    "tasksTotal": 10,
    "skillsProgress": [{ "name": "JavaScript", "level": 70 }],
    "streak": 3,
    "goals": [{ "title": "...", "description": "...", "priority": "High" }]
  }
  ```

- `GET /api/progress/goals`  
  Returns merged goals: default suggested goals + any user goals from DB.
- `GET /api/progress/quotes`  
  Returns:

  ```json
  {
    "today": { "text": "...", "author": "..." },
    "list": [{ "text": "...", "author": "..." }, ...]
  }
  ```

Also updates `progress.dailyQuotes` in the DB.

---

## 5. Running ResuMate Locally

### 5.1. Prerequisites

- Node.js (LTS)
- Docker (for containerized deployment)

### 5.2. Local Development

For local development without Docker:

- SQLite is file-based, no additional setup required

### 5.3. Environment variables

Create a `.env` file in the project root (same folder as `package.json`):

```env
DB_NAME=resumate_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
PORT=4000
```

Alternatively, you can define a `DATABASE_URL` instead of the individual DB vars.

### 5.4. Install dependencies

```bash
npm install
```

### 5.5. Start the server

```bash
npm start
```

This will:

- Connect to PostgreSQL via Sequelize
- Sync the `Resume` and `Progress` models
- Serve the frontend statically from `frontend/`
- Expose APIs under `/api`

### 5.6. Open the app

Open this URL in your browser:

```text
http://localhost:4000/frontend/pages/index.html
```

From the home page, you can navigate to:

- `resume-editor.html` – Build/edit your resume
- `resume-viewer.html` – Read-only view of your current resume
- `resume-templates.html` – Template gallery + PDF export
- `progress-dashboard.html` – Tasks / skills / streak dashboard
- `goals.html` – Goals board
- `daily-quotes.html` – Daily and extra quotes

---

## 6. Feature Overview

### 6.1. Resume Module

- **Resume Editor (`resume-editor.html`)**
  - Edit:
    - Summary (plain text)
    - Experience (JSON array)
    - Education (JSON array)
    - Skills (JSON array)
    - Projects (JSON array)
  - Stores everything in PostgreSQL through `/api/resume/save`.
  - Quick inline preview panel on the right side.

- **Resume Viewer (`resume-viewer.html`)**
  - Fetches data via `/api/resume/get`.
  - Renders summary, experience, education, skills, and projects as responsive cards.

- **Resume Templates (`resume-templates.html`)**
  - Shows four selectable template cards:
    - `simple`
    - `modern`
    - `minimal`
    - `creative`
  - Collects basic metadata (name, headline, contact).
  - Calls `/api/resume/generate-pdf` and triggers a PDF download.

### 6.2. Progress Module

- **Progress Dashboard (`progress-dashboard.html`)**
  - Overall tasks completed vs total with a progress bar.
  - Skill-specific progress bars (from `skillsProgress` JSON).
  - Streak badge (🔥) for current streak in days.
  - Data persisted via `/api/progress/get` and `/api/progress/update`.

- **Goals (`goals.html`)**
  - Left: board of goals (default + user-defined) via `/api/progress/goals`.
  - Right: form to add a new goal (title, description, priority).
  - New goals are saved by updating `Progress.goals`.

- **Daily Quotes (`daily-quotes.html`)**
  - Primary daily quote highlighted in a large card.
  - Additional quotes listed as small cards.
  - All data comes from `/api/progress/quotes` (backed by a simple quotes service).

---

## 7. UI / UX Notes

- Clean, modern, **card-based UI** with:
  - Soft indigo/violet/blue gradients
  - Rounded corners (xl / 2xl)
  - Subtle shadows
  - Smooth hover and focus transitions
- Layout built with CSS **Flexbox/Grid**, fully responsive:
  - Single-column on mobile
  - Two-column cards on tablet/desktop
- Navigation bar:
  - Sticky, translucent gradient background
  - Clear active state per page
- Components:
  - Buttons, loader, template cards, experience cards, skills badges, progress bars, streak badge, goal cards, quote cards.




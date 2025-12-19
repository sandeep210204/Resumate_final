# ResuMate Complete Startup Guide

## Prerequisites
- Node.js installed
- Python 3.x installed
- npm installed

## Step 1: Install Dependencies

### Frontend & Backend (Resumate)
```bash
cd "c:\Users\Sandeep\Downloads\Resumate-main\Resumate-main"
npm install
```

### Project Backend (Content Generator)
```bash
cd "c:\Users\Sandeep\Downloads\Resumate-main\Resumate-main\project\backend"
pip install -r requirements.txt
```

## Step 2: Start Servers

### Terminal 1 - Resumate Backend & Frontend
```bash
cd "c:\Users\Sandeep\Downloads\Resumate-main\Resumate-main"
npm start
```
Server runs on: http://localhost:4000

### Terminal 2 - Content Generator Backend
```bash
cd "c:\Users\Sandeep\Downloads\Resumate-main\Resumate-main\project\backend"
python main.py
```
Server runs on: http://localhost:8000

## Step 3: Use the Application

### First Time Setup
1. Open browser: http://localhost:4000
2. Click "Register" to create account
3. Login with your credentials

### Features Available

#### 1. Resume Editor
- Navigate to "Resume Editor"
- Fill in your details (summary, experience, education, skills, projects)
- Click "Save Resume"
- Data is stored in SQLite database

#### 2. Resume Templates & PDF Download
- Navigate to "Templates"
- Select template (Simple, Modern, Minimal, Creative)
- Click "Generate PDF"
- PDF downloads automatically with your resume data

#### 3. Progress Dashboard
- Navigate to "Progress"
- Track your learning progress
- View streak and skill progress bars

#### 4. Goals
- Navigate to "Goals"
- Set and track your career goals

#### 5. Daily Quotes
- Navigate to "Daily Quotes"
- Get motivational quotes

#### 6. Tasks
- Navigate to "Tasks"
- Create and manage tasks with scheduling

#### 7. Content Generator (NEW)
- Navigate to "Content Generator"
- Enter topic (e.g., "Python Programming")
- Select type:
  - **Educational Video**: Generates AI video
  - **Learning Path**: Generates learning roadmap
- Click "Generate Content"
- View/download generated content

## Troubleshooting

### Port Already in Use
```bash
# Find process
netstat -ano | findstr :4000
# Kill process
taskkill /PID [PID_NUMBER] /F
```

### Database Issues
```bash
# Delete and recreate database
cd "c:\Users\Sandeep\Downloads\Resumate-main\Resumate-main"
del database.sqlite
npm start
```

### CORS Errors
- Ensure both servers are running
- Backend on port 8000
- Frontend on port 4000

## All Features Working Checklist
- ✅ User Registration
- ✅ User Login
- ✅ Resume Editor (Save/Load)
- ✅ Resume Templates Preview
- ✅ PDF Download (Puppeteer)
- ✅ Progress Dashboard
- ✅ Goals Management
- ✅ Daily Quotes
- ✅ Tasks Management
- ✅ Content Generator (Video)
- ✅ Content Generator (Learning Path)

## Tech Stack
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Backend**: Node.js, Express
- **Database**: SQLite with Sequelize ORM
- **PDF Generation**: Puppeteer
- **Content Generator**: FastAPI, Python
- **Authentication**: JWT tokens

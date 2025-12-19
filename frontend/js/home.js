import { getResume } from './api/resumeApi.js';
import { getProgress, getQuotes } from './api/progressApi.js';

// Optional: Check Auth for personalized content
const isLoggedIn = !!localStorage.getItem('token');

async function initHome() {
  const resumeStatusEl = document.getElementById('home-resume-status');
  const tasksEl = document.getElementById('home-tasks');
  const streakEl = document.getElementById('home-streak');
  const quoteEl = document.getElementById('home-quote');

  if (!isLoggedIn) {
    resumeStatusEl.textContent = 'Login required';
    tasksEl.textContent = '–';
    streakEl.textContent = '–';
    quoteEl.textContent = 'Login required';
    return;
  }

  try {
    const resume = await getResume();
    const filledSections = [
      resume.summary,
      (resume.experience || []).length,
      (resume.education || []).length,
      (resume.skills || []).length,
      (resume.projects || []).length,
    ].filter((v) => (Array.isArray(v) ? v > 0 : !!v)).length;
    resumeStatusEl.textContent =
      filledSections > 0 ? 'Draft in progress' : 'No content yet – start editing';
  } catch (e) {
    resumeStatusEl.textContent = 'Unable to load';
  }

  try {
    const progress = await getProgress();
    tasksEl.textContent = `${progress.tasksCompleted}/${progress.tasksTotal || 0}`;
    streakEl.textContent =
      progress.streak > 0 ? `${progress.streak} day${progress.streak === 1 ? '' : 's'}` : '–';
  } catch (e) {
    tasksEl.textContent = '–';
    streakEl.textContent = '–';
  }

  try {
    const quotes = await getQuotes();
    if (quotes && quotes.today) {
      quoteEl.textContent = `"${quotes.today.text}" – ${quotes.today.author}`;
    } else {
      quoteEl.textContent = 'Stay consistent. Small steps compound over time.';
    }
  } catch (e) {
    quoteEl.textContent = 'Stay consistent. Small steps compound over time.';
  }
}

document.addEventListener('DOMContentLoaded', initHome);



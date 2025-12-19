import { getProgress, updateProgress } from '../api/progressApi.js';
import { createSkillProgressBar } from '../components/SkillProgressBar.js';
import { createStreakBadge } from '../components/StreakBadge.js';

function safeParseJson(value, fallback) {
  if (!value || !value.trim()) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function renderProgressUi(progress) {
  const tasksLabel = document.getElementById('tasks-label');
  const tasksBar = document.getElementById('tasks-bar');
  const skillsContainer = document.getElementById('skills-container');

  const total = progress.tasksTotal || 0;
  const completed = progress.tasksCompleted || 0;
  tasksLabel.textContent = `${completed}/${total}`;
  const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  tasksBar.style.width = `${pct}%`;

  skillsContainer.innerHTML = '';
  const streakBadge = createStreakBadge(progress.streak || 0);
  skillsContainer.appendChild(streakBadge);

  (progress.skillsProgress || []).forEach((skill) => {
    skillsContainer.appendChild(createSkillProgressBar(skill));
  });
}

async function init() {
  const statusEl = document.getElementById('progress-status');
  const form = document.getElementById('progress-form');

  try {
    const progress = await getProgress();
    document.getElementById('tasksCompleted').value = progress.tasksCompleted || 0;
    document.getElementById('tasksTotal').value = progress.tasksTotal || 0;
    document.getElementById('streak').value = progress.streak || 0;
    document.getElementById('skillsProgress').value = JSON.stringify(
      progress.skillsProgress || [],
      null,
      2
    );
    renderProgressUi(progress);
    statusEl.textContent = 'Loaded from backend';
  } catch {
    statusEl.textContent = 'Failed to load – you can still submit values';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Saving...';
    const payload = {
      tasksCompleted: Number(document.getElementById('tasksCompleted').value) || 0,
      tasksTotal: Number(document.getElementById('tasksTotal').value) || 0,
      streak: Number(document.getElementById('streak').value) || 0,
      skillsProgress: safeParseJson(document.getElementById('skillsProgress').value, []),
    };
    try {
      const updated = await updateProgress(payload);
      renderProgressUi(updated);
      statusEl.textContent = 'Saved';
    } catch {
      statusEl.textContent = 'Save failed – check console';
    }
  });
}

document.addEventListener('DOMContentLoaded', init);



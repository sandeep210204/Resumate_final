import { getGoals, getProgress, updateProgress } from '../api/progressApi.js';
import { createGoalCard } from '../components/GoalCard.js';

async function loadGoals() {
  const container = document.getElementById('goals-container');
  container.textContent = 'Loading...';
  try {
    const goals = await getGoals();
    container.innerHTML = '';
    goals.forEach((g) => container.appendChild(createGoalCard(g)));
  } catch {
    container.textContent = 'Failed to load goals.';
  }
}

async function init() {
  await loadGoals();

  const form = document.getElementById('goal-form');
  const statusEl = document.getElementById('goals-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Saving goal...';
    try {
      const progress = await getProgress();
      const goals = Array.isArray(progress.goals) ? [...progress.goals] : [];
      goals.push({
        title: document.getElementById('goalTitle').value,
        description: document.getElementById('goalDescription').value,
        priority: document.getElementById('goalPriority').value,
      });
      await updateProgress({ goals });
      statusEl.textContent = 'Goal saved';
      form.reset();
      await loadGoals();
    } catch {
      statusEl.textContent = 'Failed to save goal.';
    }
  });
}

document.addEventListener('DOMContentLoaded', init);



export function createGoalCard(goal) {
  const card = document.createElement('div');
  card.className = 'goal-card';

  const title = document.createElement('div');
  title.className = 'goal-card-title';
  title.textContent = goal.title || 'Goal';

  const desc = document.createElement('div');
  desc.className = 'goal-card-desc';
  desc.textContent = goal.description || '';

  const meta = document.createElement('div');
  meta.className = 'goal-card-meta';
  meta.textContent = goal.priority ? `Priority: ${goal.priority}` : '';

  card.appendChild(title);
  if (goal.description) {
    card.appendChild(desc);
  }
  if (goal.priority) {
    card.appendChild(meta);
  }

  return card;
}



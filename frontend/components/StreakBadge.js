export function createStreakBadge(streak) {
  const badge = document.createElement('div');
  badge.className = 'streak-badge';

  const icon = document.createElement('span');
  icon.className = 'streak-badge-icon';
  icon.textContent = '🔥';

  const text = document.createElement('span');
  text.className = 'streak-badge-text';
  text.textContent = streak > 0 ? `${streak}-day streak` : 'Start your streak today';

  badge.appendChild(icon);
  badge.appendChild(text);

  return badge;
}



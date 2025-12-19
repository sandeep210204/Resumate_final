export function createSkillsBadges(skills) {
  const container = document.createElement('div');
  container.className = 'skills-badge-group';
  (skills || []).forEach((skill) => {
    const badge = document.createElement('span');
    badge.className = 'skills-badge';
    badge.textContent = typeof skill === 'string' ? skill : skill.name || '';
    container.appendChild(badge);
  });
  return container;
}



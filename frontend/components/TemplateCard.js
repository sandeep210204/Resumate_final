export function createTemplateCard({ id, name, description, accent, active, onSelect }) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'template-card' + (active ? ' template-card-active' : '');
  card.dataset.templateId = id;

  const accentBar = document.createElement('div');
  accentBar.className = 'template-card-accent';
  accentBar.style.background = accent;

  const title = document.createElement('div');
  title.className = 'template-card-title';
  title.textContent = name;

  const body = document.createElement('div');
  body.className = 'template-card-body';
  body.textContent = description;

  const badge = document.createElement('div');
  badge.className = 'template-card-badge';
  badge.textContent = active ? 'Active' : 'Preview';

  card.appendChild(accentBar);
  card.appendChild(title);
  card.appendChild(body);
  card.appendChild(badge);

  if (onSelect) {
    card.addEventListener('click', () => onSelect(id, card));
  }

  return card;
}



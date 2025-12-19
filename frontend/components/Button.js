// Button component - small utility to create consistently styled buttons

export function createPrimaryButton(label, { onClick, icon, type = 'button' } = {}) {
  const btn = document.createElement('button');
  btn.type = type;
  btn.className =
    'rm-btn rm-btn-primary'; /* styled in page-specific CSS or global if needed */
  if (icon) {
    const spanIcon = document.createElement('span');
    spanIcon.className = 'rm-btn-icon';
    spanIcon.textContent = icon;
    const spanLabel = document.createElement('span');
    spanLabel.textContent = label;
    btn.appendChild(spanIcon);
    btn.appendChild(spanLabel);
  } else {
    btn.textContent = label;
  }
  if (onClick) {
    btn.addEventListener('click', onClick);
  }
  return btn;
}

export function createGhostButton(label, { onClick } = {}) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'rm-btn rm-btn-ghost';
  btn.textContent = label;
  if (onClick) {
    btn.addEventListener('click', onClick);
  }
  return btn;
}



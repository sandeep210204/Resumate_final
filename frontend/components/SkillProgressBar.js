export function createSkillProgressBar(skill) {
  const wrapper = document.createElement('div');
  wrapper.className = 'skill-progress-row';

  const label = document.createElement('div');
  label.className = 'skill-progress-label';
  label.textContent = skill.name || 'Skill';

  const meter = document.createElement('div');
  meter.className = 'skill-progress-meter';

  const fill = document.createElement('div');
  fill.className = 'skill-progress-fill';
  const percent = Math.max(0, Math.min(100, Number(skill.level) || 0));
  fill.style.width = `${percent}%`;

  const value = document.createElement('div');
  value.className = 'skill-progress-value';
  value.textContent = `${percent}%`;

  meter.appendChild(fill);

  wrapper.appendChild(label);
  wrapper.appendChild(meter);
  wrapper.appendChild(value);

  return wrapper;
}



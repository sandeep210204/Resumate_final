export function createExperienceCard(item) {
  const wrapper = document.createElement('div');
  wrapper.className = 'experience-card';

  const header = document.createElement('div');
  header.className = 'experience-card-header';

  const role = document.createElement('div');
  role.className = 'experience-card-role';
  role.textContent = item.role || 'Role / Position';

  const company = document.createElement('div');
  company.className = 'experience-card-company';
  company.textContent = item.company || 'Company';

  const meta = document.createElement('div');
  meta.className = 'experience-card-meta';
  meta.textContent = item.period || '';

  const desc = document.createElement('div');
  desc.className = 'experience-card-desc';
  desc.textContent = item.description || '';

  header.appendChild(role);
  header.appendChild(company);

  wrapper.appendChild(header);
  wrapper.appendChild(meta);
  if (item.description) {
    wrapper.appendChild(desc);
  }

  return wrapper;
}



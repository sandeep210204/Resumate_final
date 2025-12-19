import { getResume } from '../api/resumeApi.js';
import { createExperienceCard } from '../components/ExperienceCard.js';
import { createSkillsBadges } from '../components/SkillsBadge.js';

function renderViewer(root, resume) {
  root.innerHTML = '';

  const summaryBlock = document.createElement('div');
  summaryBlock.className = 'experience-card';
  summaryBlock.textContent = resume.summary || 'No summary yet.';
  root.appendChild(summaryBlock);

  const sectionTitle = (label) => {
    const el = document.createElement('div');
    el.className = 'field-label';
    el.style.marginTop = '10px';
    el.textContent = label;
    return el;
  };

  root.appendChild(sectionTitle('Experience'));
  (resume.experience || []).forEach((e) => root.appendChild(createExperienceCard(e)));

  root.appendChild(sectionTitle('Education'));
  (resume.education || []).forEach((e) => {
    const card = document.createElement('div');
    card.className = 'experience-card';
    card.textContent = `${e.degree || ''} – ${e.institution || ''} ${e.year || ''}`;
    root.appendChild(card);
  });

  root.appendChild(sectionTitle('Skills'));
  const skillsData = resume.skills || [];
  if (typeof skillsData === 'object' && !Array.isArray(skillsData)) {
    // Handle object format
    Object.entries(skillsData).forEach(([category, skills]) => {
      const skillCard = document.createElement('div');
      skillCard.className = 'experience-card';
      skillCard.innerHTML = `<strong>${category}:</strong> ${Array.isArray(skills) ? skills.join(', ') : skills}`;
      root.appendChild(skillCard);
    });
  } else {
    root.appendChild(createSkillsBadges(skillsData));
  }

  root.appendChild(sectionTitle('Projects'));
  (resume.projects || []).forEach((p) => {
    const card = document.createElement('div');
    card.className = 'experience-card';
    const tech = Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || p.tech || '');
    card.innerHTML = `<strong>${p.name || ''}</strong> (${tech}) – ${p.description || ''}`;
    root.appendChild(card);
  });
  
  if (resume.certifications && resume.certifications.length > 0) {
    root.appendChild(sectionTitle('Certifications'));
    (resume.certifications || []).forEach((c) => {
      const card = document.createElement('div');
      card.className = 'experience-card';
      card.innerHTML = `<strong>${c.name || ''}</strong> – ${c.issuer || ''} (${c.date || ''})`;
      root.appendChild(card);
    });
  }
}

async function init() {
  const root = document.getElementById('viewer-root');
  root.textContent = 'Loading...';
  try {
    const resume = await getResume();
    renderViewer(root, resume);
  } catch {
    root.textContent = 'Failed to load resume.';
  }
}

document.addEventListener('DOMContentLoaded', init);



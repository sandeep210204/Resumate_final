import { getResume, saveResume } from '../api/resumeApi.js';
import { createExperienceCard } from '../components/ExperienceCard.js';
import { createSkillsBadges } from '../components/SkillsBadge.js';

function safeParseJson(value, fallback) {
  if (!value || !value.trim()) return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch (error) {
    console.error('JSON Parse Error:', error, 'Value:', value);
    return fallback;
  }
}

function renderPreview(root, resume) {
  root.innerHTML = '';
  const summary = document.createElement('div');
  summary.className = 'field-helper';
  summary.textContent = resume.summary || 'No summary yet.';
  root.appendChild(summary);

  const expTitle = document.createElement('div');
  expTitle.className = 'field-label';
  expTitle.textContent = 'Experience';
  root.appendChild(expTitle);

  (resume.experience || []).forEach((e) => root.appendChild(createExperienceCard(e)));

  const eduTitle = document.createElement('div');
  eduTitle.className = 'field-label';
  eduTitle.style.marginTop = '6px';
  eduTitle.textContent = 'Education';
  root.appendChild(eduTitle);

  (resume.education || []).forEach((e) => {
    const item = document.createElement('div');
    item.className = 'experience-card';
    item.textContent = `${e.degree || ''} – ${e.institution || ''} ${e.year || ''}`;
    root.appendChild(item);
  });

  const skillsTitle = document.createElement('div');
  skillsTitle.className = 'field-label';
  skillsTitle.style.marginTop = '6px';
  skillsTitle.textContent = 'Skills';
  root.appendChild(skillsTitle);
  
  const skillsData = resume.skills || [];
  if (typeof skillsData === 'object' && !Array.isArray(skillsData)) {
    // Handle object format
    const skillsDiv = document.createElement('div');
    Object.entries(skillsData).forEach(([category, skills]) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'experience-card';
      categoryDiv.innerHTML = `<strong>${category}:</strong> ${Array.isArray(skills) ? skills.join(', ') : skills}`;
      skillsDiv.appendChild(categoryDiv);
    });
    root.appendChild(skillsDiv);
  } else {
    root.appendChild(createSkillsBadges(skillsData));
  }
}

async function init() {
  const form = document.getElementById('resume-form');
  const preview = document.getElementById('preview-panel');
  const statusEl = document.getElementById('save-status');

  try {
    const resume = await getResume();
    document.getElementById('summary').value = resume.summary || '';
    document.getElementById('experience').value = JSON.stringify(resume.experience || [], null, 2);
    document.getElementById('education').value = JSON.stringify(resume.education || [], null, 2);
    document.getElementById('skills').value = JSON.stringify(resume.skills || [], null, 2);
    document.getElementById('projects').value = JSON.stringify(resume.projects || [], null, 2);
    document.getElementById('certifications').value = JSON.stringify(resume.certifications || [], null, 2);
    renderPreview(preview, resume);
    statusEl.textContent = 'Loaded from backend';
  } catch {
    statusEl.textContent = 'Failed to load – you can still start from scratch';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Saving...';

    const payload = {
      summary: document.getElementById('summary').value,
      experience: safeParseJson(document.getElementById('experience').value, []),
      education: safeParseJson(document.getElementById('education').value, []),
      skills: safeParseJson(document.getElementById('skills').value, []),
      projects: safeParseJson(document.getElementById('projects').value, []),
      certifications: safeParseJson(document.getElementById('certifications').value, []),
    };

    try {
      const saved = await saveResume(payload);
      statusEl.textContent = 'Saved';
      renderPreview(preview, saved);
    } catch (error) {
      console.error('Save error:', error);
      statusEl.textContent = `Save failed: ${error.message}`;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);



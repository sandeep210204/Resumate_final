import { generatePdf } from '../api/resumeApi.js';
import { createTemplateCard } from '../components/TemplateCard.js';

const templates = [
  {
    id: 'ats',
    name: 'ATS-Friendly',
    description: 'Optimized for Applicant Tracking Systems. Clean, keyword-friendly format that recruiters love.',
    accent: 'linear-gradient(90deg,#059669,#10b981)',
  },
  {
    id: 'simple',
    name: 'Simple',
    description: 'Clean, traditional layout with clear hierarchy and soft accents.',
    accent: 'linear-gradient(90deg,#4f46e5,#a855f7)',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Dark, modern, two-column layout with emphasis on experience.',
    accent: 'linear-gradient(90deg,#6366f1,#0ea5e9)',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'White, print-friendly layout optimized for readability.',
    accent: 'linear-gradient(90deg,#4b5563,#9ca3af)',
  },
];

let activeTemplate = 'ats';

async function init() {
  const grid = document.getElementById('template-grid');
  const statusEl = document.getElementById('template-status');
  const form = document.getElementById('template-form');

  const render = () => {
    grid.innerHTML = '';
    templates.forEach((tpl) => {
      const card = createTemplateCard({
        ...tpl,
        active: tpl.id === activeTemplate,
        onSelect: (id) => {
          activeTemplate = id;
          statusEl.textContent = `Selected template: ${id}`;
          render();
        },
      });
      grid.appendChild(card);
    });
  };

  render();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Generating PDF...';
    try {
      const meta = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value,
        portfolio: document.getElementById('portfolio').value,
      };
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login first');
      }
      
      const response = await fetch('/api/resume/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ template: activeTemplate, meta })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resumate-resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      statusEl.textContent = 'PDF downloaded';
    } catch (err) {
      console.error('PDF generation error:', err);
      statusEl.textContent = `Generation failed: ${err.message}`;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);



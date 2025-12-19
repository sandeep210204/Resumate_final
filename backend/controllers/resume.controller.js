const Resume = require('../models/Resume');
const User = require('../models/User');
const { generatePdfFromTemplate } = require('../services/pdfGenerator');

// Helper to get resume specific to the logged-in user
async function getOrCreateResume(userId) {
  // First verify the user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  let resume = await Resume.findOne({ where: { UserId: userId } });
  if (!resume) {
    resume = await Resume.create({ UserId: userId });
  }
  return resume;
}

exports.saveResume = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const { summary, experience, education, skills, projects, certifications } = req.body;
    const resume = await getOrCreateResume(req.user.id);
    
    resume.summary = summary || '';
    resume.experience = experience || [];
    resume.education = education || [];
    resume.skills = skills || [];
    resume.projects = projects || [];
    resume.certifications = certifications || [];

    await resume.save();
    res.json({ success: true, resume });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    next(err);
  }
};

exports.getResume = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const resume = await getOrCreateResume(req.user.id);
    res.json({ success: true, resume });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    next(err);
  }
};

function buildSectionList(items, formatter) {
  if (!items || !items.length) return '<p class="empty-section">No data provided yet.</p>';
  return items
    .map((item) => `<li>${formatter(item)}</li>`)
    .join('');
}

function buildExperienceHTML(experiences) {
  if (!experiences.length) return '<p>No experience added yet.</p>';
  return experiences.map(exp => {
    const achievements = exp.achievements || [];
    return `<div class="job" style="margin-bottom: 15pt; page-break-inside: avoid;">
<div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5pt;">
<div>
<div class="job-title" style="font-size: 12pt; font-weight: bold; color: #000;">${exp.title || exp.role || ''}</div>
<div class="company" style="font-size: 11pt; font-weight: bold; font-style: italic; margin-top: 2pt;">${exp.company || ''}</div>
<div class="location" style="font-size: 10pt; color: #333; margin-top: 1pt;">${exp.location || ''}</div>
</div>
<div class="date" style="font-size: 10pt; font-style: italic; color: #666; text-align: right;">${exp.startDate || ''} - ${exp.endDate || ''}</div>
</div>
<ul style="margin: 8pt 0 0 20pt; padding: 0; list-style-type: disc;">${achievements.map(a => `<li style="margin-bottom: 4pt; text-align: justify; line-height: 1.3;">${a}</li>`).join('')}</ul>
</div>`;
  }).join('');
}

function buildSkillsHTML(skills) {
  if (!skills) return '<p>No skills added yet.</p>';
  if (Array.isArray(skills)) {
    return `<div>${skills.join(', ')}</div>`;
  }
  return Object.entries(skills).map(([cat, list]) => 
    `<div class="skills-category"><strong>${cat}:</strong> ${Array.isArray(list) ? list.join(', ') : list}</div>`
  ).join('');
}

function buildProjectsHTML(projects) {
  if (!projects.length) return '<p>No projects added yet.</p>';
  return projects.map(p => `<div style="margin-bottom: 8pt;">
<div><strong>${p.name || ''}</strong></div>
<div style="font-style: italic; font-size: 10pt;">${Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies || ''}</div>
<p>${p.description || ''}</p>
${p.achievements ? `<ul>${p.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
</div>`).join('');
}

function buildEducationHTML(education) {
  if (!education.length) return '<p>No education added yet.</p>';
  return education.map(e => `<div class="education-item">
<div class="degree">${e.degree || ''}</div>
<div class="school">${e.institution || ''}, ${e.location || ''}</div>
<div>${e.startYear || ''} - ${e.endYear || ''} ${e.cgpa ? `| GPA: ${e.cgpa}` : ''}</div>
</div>`).join('');
}

function buildCertificationsHTML(certifications) {
  if (!certifications.length) return '<p>No certifications added yet.</p>';
  return certifications.map(c => `<div style="margin-bottom: 4pt;">
<div class="degree">${c.name || ''}</div>
<div class="school">${c.issuer || ''} - ${c.date || ''}</div>
</div>`).join('');
}

function getTemplateHTML(template, meta, resume) {
  const commonStyles = `
    body { font-family: 'Times New Roman', serif; margin: 0.5in; color: #000; line-height: 1.4; text-align: justify; }
    .header { text-align: center; margin-bottom: 20pt; padding-bottom: 10pt; }
    .name { font-size: 18pt; font-weight: bold; margin-bottom: 5pt; text-align: center; }
    .contact { font-size: 10pt; margin-bottom: 3pt; text-align: center; }
    .section { margin-bottom: 15pt; }
    .section-title { font-size: 12pt; font-weight: bold; text-transform: uppercase; margin-bottom: 8pt; text-align: left; }
    .job { margin-bottom: 10pt; }
    .job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3pt; }
    .job-title { font-weight: bold; }
    .company { font-weight: bold; }
    .date { font-style: italic; text-align: right; }
    ul { margin: 5pt 0 5pt 15pt; text-align: justify; }
    li { margin-bottom: 2pt; text-align: justify; }
    p { text-align: justify; margin: 0 0 8pt 0; }
  `;

  const templates = {
    ats: `
    <!DOCTYPE html>
    <html><head><style>
    ${commonStyles}
    .header { border-bottom: 1pt solid #000; }
    .section-title { border-bottom: 1pt solid #000; padding-bottom: 2pt; }
    </style></head><body>
    <div class="header">
      <div class="name">${meta.name || ''}</div>
      <div class="contact">${meta.email || ''} | ${meta.phone || ''} | ${meta.location || ''}</div>
      <div class="contact">${meta.linkedin || ''} | ${meta.github || ''}</div>
    </div>
    <div class="section"><div class="section-title">Professional Summary</div><p>${resume.summary || ''}</p></div>
    <div class="section"><div class="section-title">Technical Skills</div>${buildSkillsHTML(resume.skills || [])}</div>
    <div class="section"><div class="section-title">Professional Experience</div>${buildExperienceHTML(resume.experience || [])}</div>
    <div class="section"><div class="section-title">Education</div>${buildEducationHTML(resume.education || [])}</div>
    <div class="section"><div class="section-title">Projects</div>${buildProjectsHTML(resume.projects || [])}</div>
    <div class="section"><div class="section-title">Certifications</div>${buildCertificationsHTML(resume.certifications || [])}</div>
    </body></html>`,

    simple: `
    <!DOCTYPE html>
    <html><head><style>
    body { font-family: 'Times New Roman', serif; margin: 0.7in; background: #f8fafc; color: #2d3748; text-align: justify; }
    .header { text-align: center; background: #667eea; color: white; padding: 20pt; margin: -0.7in -0.7in 20pt -0.7in; }
    .name { font-size: 22pt; font-weight: bold; margin-bottom: 8pt; }
    .contact { font-size: 11pt; margin-bottom: 3pt; }
    .section-title { font-size: 14pt; font-weight: bold; color: #667eea; margin: 18pt 0 10pt 0; border-bottom: 2pt solid #667eea; padding-bottom: 3pt; }
    .job { background: white; padding: 12pt; margin-bottom: 10pt; border-radius: 8pt; box-shadow: 0 2pt 4pt rgba(0,0,0,0.1); }
    .job-title { font-weight: bold; color: #2d3748; }
    .company { color: #667eea; font-weight: 600; }
    ul { margin: 8pt 0 0 20pt; }
    li { margin-bottom: 3pt; }
    </style></head><body>
    <div class="header">
      <div class="name">${meta.name || ''}</div>
      <div class="contact">${meta.email || ''} • ${meta.phone || ''} • ${meta.location || ''}</div>
    </div>
    <div class="section-title">Professional Summary</div>
    <p style="background: white; padding: 12pt; border-radius: 8pt;">${resume.summary || ''}</p>
    <div class="section-title">Professional Experience</div>
    ${buildExperienceHTML(resume.experience || [])}
    <div class="section-title">Technical Skills</div>
    <div style="background: white; padding: 12pt; border-radius: 8pt;">${buildSkillsHTML(resume.skills || [])}</div>
    <div class="section-title">Education</div>
    <div style="background: white; padding: 12pt; border-radius: 8pt;">${buildEducationHTML(resume.education || [])}</div>
    </body></html>`,

    modern: `
    <!DOCTYPE html>
    <html><head><style>
    body { font-family: 'Times New Roman', serif; margin: 0; background: #2d3748; color: #fff; text-align: justify; }
    .container { display: flex; }
    .sidebar { width: 35%; background: #1a202c; padding: 30pt; }
    .main { width: 65%; padding: 30pt; }
    .name { font-size: 24pt; font-weight: bold; color: #63b3ed; margin-bottom: 10pt; }
    .contact { font-size: 9pt; margin-bottom: 5pt; color: #a0aec0; }
    .section-title { font-size: 14pt; font-weight: bold; color: #63b3ed; margin: 15pt 0 8pt 0; }
    .job { margin-bottom: 15pt; border-left: 3pt solid #63b3ed; padding-left: 10pt; }
    .job-title { font-weight: bold; font-size: 12pt; }
    .company { color: #a0aec0; font-size: 10pt; }
    </style></head><body>
    <div class="container">
      <div class="sidebar">
        <div class="name">${meta.name || ''}</div>
        <div class="contact">${meta.email || ''}</div>
        <div class="contact">${meta.phone || ''}</div>
        <div class="contact">${meta.location || ''}</div>
        <div class="section-title">Skills</div>
        ${buildSkillsHTML(resume.skills || [])}
        <div class="section-title">Education</div>
        ${buildEducationHTML(resume.education || [])}
      </div>
      <div class="main">
        <div class="section-title">Professional Summary</div>
        <p>${resume.summary || ''}</p>
        <div class="section-title">Experience</div>
        ${buildExperienceHTML(resume.experience || [])}
        <div class="section-title">Projects</div>
        ${buildProjectsHTML(resume.projects || [])}
      </div>
    </div>
    </body></html>`,

    minimal: `
    <!DOCTYPE html>
    <html><head><style>
    body { font-family: 'Times New Roman', serif; margin: 1in; color: #000; line-height: 1.6; text-align: justify; }
    .header { margin-bottom: 30pt; }
    .name { font-size: 18pt; font-weight: bold; text-transform: uppercase; letter-spacing: 2pt; }
    .contact { font-size: 10pt; margin-top: 8pt; }
    .section-title { font-size: 12pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1pt; margin: 20pt 0 8pt 0; }
    .job { margin-bottom: 15pt; }
    .job-title { font-weight: bold; text-decoration: underline; }
    .company { font-style: italic; }
    .date { float: right; }
    ul { list-style-type: none; margin: 5pt 0 0 0; padding: 0; }
    li { margin-bottom: 2pt; }
    li:before { content: '> '; font-weight: bold; }
    </style></head><body>
    <div class="header">
      <div class="name">${meta.name || ''}</div>
      <div class="contact">${meta.email || ''} | ${meta.phone || ''} | ${meta.location || ''}</div>
    </div>
    <div class="section-title">SUMMARY</div>
    <p>${resume.summary || ''}</p>
    <div class="section-title">EXPERIENCE</div>
    ${buildExperienceHTML(resume.experience || [])}
    <div class="section-title">SKILLS</div>
    ${buildSkillsHTML(resume.skills || [])}
    <div class="section-title">EDUCATION</div>
    ${buildEducationHTML(resume.education || [])}
    </body></html>`
  };

  return templates[template] || templates.ats;
}

exports.generatePdf = async (req, res, next) => {
  try {
    const pdf = require('html-pdf');
    const { template = 'ats', meta = {} } = req.body || {};
    const resume = await getOrCreateResume(req.user.id);

    const html = getTemplateHTML(template, meta, resume);

    const options = {
      format: 'A4',
      border: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      childProcessOptions: {
        env: {
          OPENSSL_CONF: '/dev/null'
        }
      }
    };

    pdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        console.error('PDF Error:', err);
        return res.status(500).json({ error: 'PDF generation failed' });
      }
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${meta.name || 'resume'}.pdf"`,
        'Content-Length': buffer.length
      });
      res.send(buffer);
    });
  } catch (err) {
    console.error('PDF Error:', err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
};





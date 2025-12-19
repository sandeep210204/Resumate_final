import api from '../api/axiosConfig.js';

let currentJob = null;

async function loadJobDetails() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');
    
    if (!jobId) {
      window.location.href = 'job-search.html';
      return;
    }

    const response = await api.get(`/jobs/${jobId}`);
    currentJob = response.data.job;
    
    displayJobDetails(currentJob);
    setupApplicationForm(currentJob);
    
  } catch (error) {
    console.error('Failed to load job:', error);
    document.getElementById('job-details').innerHTML = 
      '<div class="empty-state"><div class="empty-body-title">Job not found</div><div class="empty-body-subtitle">This job may have been removed</div></div>';
  }
}

function displayJobDetails(job) {
  const container = document.getElementById('job-details');
  
  container.innerHTML = `
    <div class="job-header" style="margin-bottom: 24px;">
      <h1 style="margin: 0 0 8px 0; color: #1f2937;">${job.title}</h1>
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
        <h2 style="margin: 0; color: #6b7280; font-size: 18px;">${job.Company?.name || 'Company'}</h2>
        ${job.Company?.logo ? `<img src="${job.Company.logo}" alt="Company logo" style="width: 40px; height: 40px; border-radius: 4px;">` : ''}
      </div>
      <div style="color: #6b7280; margin-bottom: 16px;">
        📍 ${job.location} • 💼 ${job.jobType} • 📊 ${job.experienceLevel} level
      </div>
      ${job.salaryMin && job.salaryMax ? `<div style="color: #059669; font-weight: 600; font-size: 16px;">$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}</div>` : ''}
    </div>

    <div class="job-section" style="margin-bottom: 24px;">
      <h3 style="color: #1f2937; margin-bottom: 12px;">Job Description</h3>
      <div style="color: #4b5563; line-height: 1.6;">${job.description.replace(/\n/g, '<br>')}</div>
    </div>

    ${job.requirements ? `
    <div class="job-section" style="margin-bottom: 24px;">
      <h3 style="color: #1f2937; margin-bottom: 12px;">Requirements</h3>
      <div style="color: #4b5563; line-height: 1.6;">${job.requirements.replace(/\n/g, '<br>')}</div>
    </div>
    ` : ''}

    <div class="job-section" style="margin-bottom: 24px;">
      <h3 style="color: #1f2937; margin-bottom: 12px;">Required Skills</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${(job.requiredSkills || []).map(skill => 
          `<span style="background: #dc2626; color: white; padding: 4px 12px; border-radius: 16px; font-size: 14px;">${skill}</span>`
        ).join('')}
      </div>
    </div>

    ${job.preferredSkills?.length ? `
    <div class="job-section" style="margin-bottom: 24px;">
      <h3 style="color: #1f2937; margin-bottom: 12px;">Preferred Skills</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${job.preferredSkills.map(skill => 
          `<span style="background: #059669; color: white; padding: 4px 12px; border-radius: 16px; font-size: 14px;">${skill}</span>`
        ).join('')}
      </div>
    </div>
    ` : ''}

    ${job.benefits?.length ? `
    <div class="job-section" style="margin-bottom: 24px;">
      <h3 style="color: #1f2937; margin-bottom: 12px;">Benefits</h3>
      <ul style="color: #4b5563; line-height: 1.6;">
        ${job.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <div class="job-meta" style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
      <div>Posted by: ${job.Recruiter?.username || 'Recruiter'}</div>
      <div>Applications: ${job.applicationCount || 0}</div>
      <div>Views: ${job.viewCount || 0}</div>
    </div>
  `;
}

function setupApplicationForm(job) {
  const form = document.getElementById('apply-form');
  const status = document.getElementById('apply-status');
  
  if (job.hasApplied) {
    status.innerHTML = `
      <div style="background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 16px; border-radius: 8px; text-align: center;">
        <strong>Already Applied</strong><br>
        You have already applied to this job
      </div>
    `;
    return;
  }

  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    status.innerHTML = `
      <div style="background: #fee2e2; border: 1px solid #ef4444; color: #dc2626; padding: 16px; border-radius: 8px; text-align: center;">
        <strong>Login Required</strong><br>
        <a href="../login.html" style="color: #dc2626; text-decoration: underline;">Login</a> to apply for this job
      </div>
    `;
    return;
  }

  form.style.display = 'block';
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const coverLetter = document.getElementById('coverLetter').value;
      
      await api.post('/applications/apply', {
        jobId: job.id,
        coverLetter
      });
      
      status.innerHTML = `
        <div style="background: #d1fae5; border: 1px solid #10b981; color: #065f46; padding: 16px; border-radius: 8px; text-align: center;">
          <strong>Application Submitted!</strong><br>
          Your application has been sent to the employer
        </div>
      `;
      
      form.style.display = 'none';
      
    } catch (error) {
      console.error('Application failed:', error);
      status.innerHTML = `
        <div style="background: #fee2e2; border: 1px solid #ef4444; color: #dc2626; padding: 16px; border-radius: 8px; text-align: center;">
          <strong>Application Failed</strong><br>
          ${error.response?.data?.message || 'Please try again'}
        </div>
      `;
    }
  });
}

document.addEventListener('DOMContentLoaded', loadJobDetails);
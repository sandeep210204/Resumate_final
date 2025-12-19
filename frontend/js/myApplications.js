import api from '../api/axiosConfig.js';

async function loadApplications(status = '') {
  try {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/applications/my-applications${params}`);
    const { applications } = response.data;
    
    displayApplications(applications);
    
  } catch (error) {
    console.error('Failed to load applications:', error);
    if (error.response?.status === 401) {
      window.location.href = '../login.html';
      return;
    }
    
    document.getElementById('applications-list').innerHTML = 
      '<div class="empty-state"><div class="empty-body-title">Failed to load applications</div><div class="empty-body-subtitle">Please try again</div></div>';
  }
}

function displayApplications(applications) {
  const container = document.getElementById('applications-list');
  
  if (!applications.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📄</div>
        <div class="empty-body-title">No applications found</div>
        <div class="empty-body-subtitle">
          <a href="job-search.html" style="color: #4f46e5;">Search for jobs</a> to start applying
        </div>
      </div>
    `;
    return;
  }

  const statusColors = {
    'submitted': '#6b7280',
    'under_review': '#f59e0b',
    'shortlisted': '#10b981',
    'interview_scheduled': '#3b82f6',
    'interviewed': '#8b5cf6',
    'offered': '#059669',
    'hired': '#10b981',
    'rejected': '#ef4444'
  };

  const statusLabels = {
    'submitted': 'Submitted',
    'under_review': 'Under Review',
    'shortlisted': 'Shortlisted',
    'interview_scheduled': 'Interview Scheduled',
    'interviewed': 'Interviewed',
    'offered': 'Job Offered',
    'hired': 'Hired',
    'rejected': 'Rejected'
  };

  container.innerHTML = applications.map(app => `
    <div class="application-card" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
        <div>
          <h3 style="margin: 0 0 8px 0; color: #1f2937;">${app.Job.title}</h3>
          <p style="margin: 0; color: #6b7280; font-weight: 500;">${app.Job.Company?.name || 'Company'}</p>
          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">📍 ${app.Job.location}</p>
        </div>
        <div style="text-align: right;">
          <div style="background: ${statusColors[app.status] || '#6b7280'}; color: white; padding: 4px 12px; border-radius: 16px; font-size: 12px; margin-bottom: 8px;">
            ${statusLabels[app.status] || app.status}
          </div>
          ${app.skillMatchScore ? `<div style="color: #6b7280; font-size: 12px;">${app.skillMatchScore}% Match</div>` : ''}
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
        <div style="color: #6b7280; font-size: 14px;">
          Applied: ${new Date(app.appliedAt).toLocaleDateString()}
          ${app.lastStatusUpdate !== app.appliedAt ? ` • Updated: ${new Date(app.lastStatusUpdate).toLocaleDateString()}` : ''}
        </div>
        <div>
          <button onclick="viewApplication(${app.id})" class="rm-btn rm-btn-ghost">View Details</button>
          ${app.status === 'submitted' || app.status === 'under_review' ? 
            `<button onclick="withdrawApplication(${app.id})" class="rm-btn rm-btn-ghost" style="color: #ef4444; border-color: #ef4444;">Withdraw</button>` : ''
          }
        </div>
      </div>
      
      ${app.recruiterNotes ? `
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 12px; margin-top: 12px;">
          <strong style="color: #374151;">Recruiter Notes:</strong>
          <p style="margin: 4px 0 0 0; color: #6b7280;">${app.recruiterNotes}</p>
        </div>
      ` : ''}
      
      ${app.interviewDate ? `
        <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 4px; padding: 12px; margin-top: 12px;">
          <strong style="color: #1e40af;">Interview Scheduled:</strong>
          <p style="margin: 4px 0 0 0; color: #1e40af;">${new Date(app.interviewDate).toLocaleString()}</p>
        </div>
      ` : ''}
    </div>
  `).join('');
}

window.viewApplication = (applicationId) => {
  // Could navigate to detailed application view
  alert(`Viewing application ${applicationId} - Feature coming soon!`);
};

window.withdrawApplication = async (applicationId) => {
  if (!confirm('Are you sure you want to withdraw this application?')) {
    return;
  }
  
  try {
    await api.put(`/applications/${applicationId}/withdraw`);
    alert('Application withdrawn successfully');
    loadApplications(); // Reload the list
  } catch (error) {
    console.error('Failed to withdraw application:', error);
    alert('Failed to withdraw application');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const statusFilter = document.getElementById('status-filter');
  
  statusFilter.addEventListener('change', (e) => {
    loadApplications(e.target.value);
  });
  
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../login.html';
    return;
  }
  
  loadApplications();
});
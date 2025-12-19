import api from '../api/axiosConfig.js';

let currentPage = 1;
let currentFilters = {};

async function searchJobs(page = 1) {
  try {
    const params = new URLSearchParams({
      ...currentFilters,
      page,
      limit: 10
    });

    const response = await api.get(`/jobs/search?${params}`);
    const { jobs, pagination } = response.data;

    displayJobs(jobs);
    displayPagination(pagination);
    
    document.getElementById('results-count').textContent = 
      `Found ${pagination.total} jobs`;

  } catch (error) {
    console.error('Job search failed:', error);
    document.getElementById('job-results').innerHTML = 
      '<div class="empty-state"><div class="empty-body-title">Search failed</div><div class="empty-body-subtitle">Please try again</div></div>';
  }
}

function displayJobs(jobs) {
  const container = document.getElementById('job-results');
  
  if (!jobs.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-body-title">No jobs found</div><div class="empty-body-subtitle">Try adjusting your search criteria</div></div>';
    return;
  }

  container.innerHTML = jobs.map(job => `
    <div class="job-card" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
        <div>
          <h3 style="margin: 0 0 8px 0; color: #1f2937;">${job.title}</h3>
          <p style="margin: 0; color: #6b7280; font-weight: 500;">${job.Company?.name || 'Company'}</p>
          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">${job.location}</p>
        </div>
        <div style="text-align: right;">
          ${job.matchScore ? `<div style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 8px;">${job.matchScore}% Match</div>` : ''}
          <div style="color: #6b7280; font-size: 12px;">${job.jobType}</div>
        </div>
      </div>
      
      <p style="margin: 0 0 12px 0; color: #4b5563; line-height: 1.5;">${job.description.substring(0, 200)}...</p>
      
      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
        ${(job.requiredSkills || []).slice(0, 5).map(skill => 
          `<span style="background: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${skill}</span>`
        ).join('')}
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="color: #6b7280; font-size: 14px;">
          ${job.salaryMin && job.salaryMax ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}` : 'Salary not specified'}
        </div>
        <div>
          <button onclick="saveJob(${job.id})" class="rm-btn rm-btn-ghost" style="margin-right: 8px;">Save</button>
          <button onclick="viewJob(${job.id})" class="rm-btn rm-btn-primary">View Details</button>
        </div>
      </div>
    </div>
  `).join('');
}

function displayPagination(pagination) {
  const container = document.getElementById('pagination');
  
  if (pagination.pages <= 1) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.gap = '8px';
  container.style.marginTop = '20px';

  let paginationHTML = '';
  
  if (pagination.page > 1) {
    paginationHTML += `<button onclick="changePage(${pagination.page - 1})" class="rm-btn rm-btn-ghost">Previous</button>`;
  }
  
  for (let i = Math.max(1, pagination.page - 2); i <= Math.min(pagination.pages, pagination.page + 2); i++) {
    paginationHTML += `<button onclick="changePage(${i})" class="rm-btn ${i === pagination.page ? 'rm-btn-primary' : 'rm-btn-ghost'}">${i}</button>`;
  }
  
  if (pagination.page < pagination.pages) {
    paginationHTML += `<button onclick="changePage(${pagination.page + 1})" class="rm-btn rm-btn-ghost">Next</button>`;
  }

  container.innerHTML = paginationHTML;
}

window.changePage = (page) => {
  currentPage = page;
  searchJobs(page);
};

window.viewJob = (jobId) => {
  window.location.href = `job-details.html?id=${jobId}`;
};

window.saveJob = async (jobId) => {
  try {
    await api.post(`/jobs/${jobId}/save`);
    alert('Job saved successfully!');
  } catch (error) {
    if (error.response?.status === 401) {
      alert('Please login to save jobs');
      window.location.href = '../login.html';
    } else {
      alert('Failed to save job');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('job-search-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    currentFilters = {
      keywords: document.getElementById('keywords').value,
      location: document.getElementById('location').value,
      jobType: document.getElementById('jobType').value
    };
    
    // Remove empty filters
    Object.keys(currentFilters).forEach(key => {
      if (!currentFilters[key]) delete currentFilters[key];
    });
    
    currentPage = 1;
    searchJobs(1);
  });

  // Load initial jobs
  searchJobs(1);
});
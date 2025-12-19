import api from './axiosConfig.js';

export async function getResume() {
  const res = await api.get('/resume/get');
  return res.data.resume;
}

export async function saveResume(payload) {
  const res = await api.post('/resume/save', payload);
  return res.data.resume;
}

export async function generatePdf({ template, meta }) {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.body = JSON.stringify({ template, meta });

  const response = await fetch('/api/resume/generate-pdf', config);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.arrayBuffer();
}



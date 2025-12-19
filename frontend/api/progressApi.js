import api from './axiosConfig.js';

export async function getProgress() {
  const res = await api.get('/progress/get');
  return res.data.progress;
}

export async function updateProgress(payload) {
  const res = await api.post('/progress/update', payload);
  return res.data.progress;
}

export async function getGoals() {
  const res = await api.get('/progress/goals');
  return res.data.goals;
}

export async function getQuotes() {
  const res = await api.get('/progress/quotes');
  return res.data;
}



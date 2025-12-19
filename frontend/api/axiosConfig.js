// Fetch-based API client for browser compatibility
const BASE_URL = '/api';

class ApiClient {
  async request(method, url, data = null) {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      const error = new Error(errorData.message || `HTTP ${response.status}`);
      error.response = { status: response.status, data: errorData };
      throw error;
    }

    return { data: await response.json() };
  }

  get(url) {
    return this.request('GET', url);
  }

  post(url, data) {
    return this.request('POST', url, data);
  }

  put(url, data) {
    return this.request('PUT', url, data);
  }

  delete(url) {
    return this.request('DELETE', url);
  }
}

const api = new ApiClient();

export default api;



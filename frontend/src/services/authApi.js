const API_BASE_URL = 'http://127.0.0.1:8000';

async function request(path, payload = {}, method = 'POST', token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (method !== 'GET') {
    config.body = JSON.stringify(payload);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data?.detail || 'Request failed';
    throw new Error(errorMessage);
  }

  return data;
}

export function registerUser(payload) {
  return request('/users/register', payload);
}

export function loginUser(payload) {
  return request('/users/login', payload);
}

// Admin API functions
export function registerAdmin(payload) {
  return request('/admin/register', payload);
}

export function loginAdmin(payload) {
  return request('/admin/login', payload);
}

export function createJob(jobData, token) {
  return request('/jobs/create', jobData, 'POST', token);
}

export function getAllJobs(token) {
  return request('/jobs/all', {}, 'GET', token);
}

export function updateJob(jobId, jobData, token) {
  return request(`/jobs/${jobId}`, jobData, 'PUT', token);
}

export function deleteJob(jobId, token) {
  return request(`/jobs/${jobId}`, {}, 'DELETE', token);
}

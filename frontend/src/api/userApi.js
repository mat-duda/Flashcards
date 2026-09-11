const API_BASE = 'http://localhost:8080/api';

// Helper to get the stored JWT token
function getToken() {
  return localStorage.getItem('flashcards_token');
}

// Helper to build headers with JWT token
export function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ====== AUTH ENDPOINTS ======

export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Registration failed');
  }
  return res.json(); // returns { token, user }
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Invalid email or password');
  }
  return res.json(); // returns { token, user }
}

export async function googleLogin(credential) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Google login failed');
  }
  return res.json(); // returns { token, user }
}

// ====== USER ENDPOINTS ======

export async function getUserById(id) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function updateUser(id, userData) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function changePassword(id, passwordData) {
  const res = await fetch(`${API_BASE}/users/${id}/password`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(passwordData),
  });
  if (!res.ok) throw new Error('Failed to change password');
  return res.json();
}

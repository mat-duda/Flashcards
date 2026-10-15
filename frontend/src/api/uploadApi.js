import { authHeaders } from './userApi';

const API_BASE = 'http://localhost:8080/api';

export async function uploadImage(file, userId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);

  const headers = authHeaders();
  // Remove Content-Type so browser sets multipart boundary automatically
  delete headers['Content-Type'];

  const res = await fetch(`${API_BASE}/uploads`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload image');
  return res.json(); // { id, url }
}

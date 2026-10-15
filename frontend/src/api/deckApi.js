import { authHeaders } from './userApi';

const API_BASE = 'http://localhost:8080/api';

export async function getAllDecks() {
  const res = await fetch(`${API_BASE}/decks`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch decks');
  return res.json();
}

export async function getPublicDecks() {
  const res = await fetch(`${API_BASE}/decks/public`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch public decks');
  return res.json();
}

export async function cloneDeck(id){
  const res = await fetch(`${API_BASE}/decks/${id}/clone`, {method:'Post', headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to clone deck');
  return res.json();
}
export async function getDeckById(id) {
  const res = await fetch(`${API_BASE}/decks/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch deck');
  return res.json();
}

export async function createDeck(deck) {
  const res = await fetch(`${API_BASE}/decks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(deck),
  });
  if (!res.ok) throw new Error('Failed to create deck');
  return res.json();
}

export async function deleteDeck(id) {
  const res = await fetch(`${API_BASE}/decks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete deck');
}

export async function updateDeck(id, deck) {
  const res = await fetch(`${API_BASE}/decks/${id}`, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(deck),
  });
  if (!res.ok) throw new Error('Failed to update deck');
  return res.json();
}

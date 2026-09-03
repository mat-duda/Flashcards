import { authHeaders } from './userApi';

const API_BASE = 'http://localhost:8080/api';

export async function getAllFlashcards() {
  const res = await fetch(`${API_BASE}/flashcards`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch flashcards');
  return res.json();
}

export async function getFlashcardById(id) {
  const res = await fetch(`${API_BASE}/flashcards/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch flashcard');
  return res.json();
}

export async function getFlashcardsByDeckId(deckId) {
  const res = await fetch(`${API_BASE}/flashcards/deck/${deckId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch flashcards for deck');
  return res.json();
}

export async function createFlashcard(flashcard) {
  const res = await fetch(`${API_BASE}/flashcards`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(flashcard),
  });
  if (!res.ok) throw new Error('Failed to create flashcard');
  return res.json();
}

export async function deleteFlashcard(id) {
  const res = await fetch(`${API_BASE}/flashcards/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete flashcard');
}

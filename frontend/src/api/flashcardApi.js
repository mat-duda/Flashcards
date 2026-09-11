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
  if (deckId == null) return [];
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
}

export async function updateFlashcard(id, flashcard) {
  const res = await fetch(`${API_BASE}/flashcards/${id}`, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(flashcard),
  });
  if (!res.ok) throw new Error('Failed to update flashcard');
  return res.json();
}


export async function submitReview(id, rating) {
  const res = await fetch(`${API_BASE}/flashcards/${id}/review`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ rating }),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return res.json();
}

export async function getCardsToStudy(deckId) {
  if (deckId == null) return [];
  const res = await fetch(`${API_BASE}/flashcards/deck/${deckId}/study`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch study cards');
  return res.json();
}

export async function calculateProgress(deckId) {
  const allCards = await getFlashcardsByDeckId(deckId);
  const dueCards = await getCardsToStudy(deckId);

  if (allCards.length === 0) return 0;

  return (allCards.length - dueCards.length) / allCards.length;
}
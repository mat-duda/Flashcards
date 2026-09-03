import { useState, useEffect } from 'react';
import { getAllDecks, createDeck, deleteDeck } from './api/deckApi';
import { getFlashcardsByDeckId, createFlashcard, deleteFlashcard } from './api/flashcardApi';
import AuthPage from './components/AuthPage';
import DeckCard from './components/DeckCard';
import DeckView from './components/DeckView';
import CreateDeckModal from './components/CreateDeckModal';
import CreateFlashcardModal from './components/CreateFlashcardModal';
import StudyMode from './components/StudyMode';
import ProfilePage from './components/ProfilePage';
import './index.css';

export default function App() {
  // Auth state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('flashcards_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Data state
  const [decks, setDecks] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);

  // UI state
  const [view, setView] = useState('decks'); // 'decks' | 'deck' | 'study' | 'profile'
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load decks when user logs in
  useEffect(() => {
    if (user) {
      fetchDecks();
    }
  }, [user]);

  // Auth handlers
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('flashcards_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('flashcards_user');
    localStorage.removeItem('flashcards_token');
    setDecks([]);
    setFlashcards([]);
    setSelectedDeck(null);
    setView('decks');
  };

  // If not logged in, show auth page
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const data = await getAllDecks();
      setDecks(data);
      setError(null);
    } catch (err) {
      setError('Failed to connect to server. Is the backend running on port 8080?');
    } finally {
      setLoading(false);
    }
  };

  const fetchFlashcards = async (deckId) => {
    try {
      const data = await getFlashcardsByDeckId(deckId);
      setFlashcards(data);
    } catch (err) {
      setError('Failed to load flashcards');
    }
  };

  // Deck actions
  const handleCreateDeck = async (deck) => {
    await createDeck({ ...deck, userId: user.id });
    await fetchDecks();
  };

  const handleDeleteDeck = async (id) => {
    if (!window.confirm('Delete this deck and all its cards?')) return;
    await deleteDeck(id);
    await fetchDecks();
  };

  const handleSelectDeck = async (deck) => {
    setSelectedDeck(deck);
    await fetchFlashcards(deck.id);
    setView('deck');
  };

  // Flashcard actions
  const handleCreateFlashcard = async (flashcard) => {
    await createFlashcard({ ...flashcard, userId: user.id });
    await fetchFlashcards(selectedDeck.id);
  };

  const handleDeleteFlashcard = async (id) => {
    await deleteFlashcard(id);
    await fetchFlashcards(selectedDeck.id);
  };

  // Navigation
  const goToDecks = () => {
    setView('decks');
    setSelectedDeck(null);
    setFlashcards([]);
  };

  const startStudy = () => {
    setView('study');
  };

  const getCardCount = (deckId) => {
    return '—';
  };

  // User initials for avatar
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={goToDecks} style={{ cursor: 'pointer' }}>
          📚 <span>Flashcards</span>
        </div>
        <div className="navbar-links">
          <a className={view === 'decks' || view === 'deck' || view === 'study' ? 'active' : ''} onClick={goToDecks}>My Decks</a>
          <a className={view === 'profile' ? 'active' : ''} onClick={() => setView('profile')}>Profile</a>
        </div>
        <div className="navbar-right">
          <span className="navbar-username">{user.name}</span>
          <div className="navbar-profile" onClick={() => setView('profile')} style={{ cursor: 'pointer' }}>
            <div className="avatar">{initials}</div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Log Out</button>
        </div>
      </nav>

      {/* Main content */}
      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}

        {/* DECKS LIST VIEW */}
        {view === 'decks' && (
          <>
            <div className="page-header">
              <div>
                <h1>My Decks</h1>
                <p className="page-subtitle">Select a deck to view or study its flashcards</p>
              </div>
              <button className="btn-primary" onClick={() => setShowCreateDeck(true)}>
                + New Deck
              </button>
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading decks...</p>
              </div>
            ) : decks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No decks yet</h3>
                <p>Create your first deck to start adding flashcards!</p>
                <button className="btn-primary" onClick={() => setShowCreateDeck(true)}>
                  + Create Deck
                </button>
              </div>
            ) : (
              <div className="deck-grid">
                {decks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    cardCount={getCardCount(deck.id)}
                    onClick={() => handleSelectDeck(deck)}
                    onDelete={handleDeleteDeck}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* SINGLE DECK VIEW */}
        {view === 'deck' && selectedDeck && (
          <>
            <DeckView
              deck={selectedDeck}
              flashcards={flashcards}
              onBack={goToDecks}
              onAddCard={() => setShowCreateCard(true)}
              onDeleteCard={handleDeleteFlashcard}
            />
            {flashcards.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button className="btn-primary" onClick={startStudy}>
                  📖 Study This Deck
                </button>
              </div>
            )}
          </>
        )}

        {/* STUDY MODE */}
        {view === 'study' && (
          <StudyMode
            flashcards={flashcards}
            onExit={() => setView('deck')}
          />
        )}

        {/* PROFILE */}
        {view === 'profile' && (
          <ProfilePage
            userId={user.id}
            onBack={goToDecks}
          />
        )}
      </main>

      {/* Modals */}
      {showCreateDeck && (
        <CreateDeckModal
          onCreated={handleCreateDeck}
          onClose={() => setShowCreateDeck(false)}
        />
      )}
      {showCreateCard && selectedDeck && (
        <CreateFlashcardModal
          deckId={selectedDeck.id}
          onCreated={handleCreateFlashcard}
          onClose={() => setShowCreateCard(false)}
        />
      )}
    </div>
  );
}

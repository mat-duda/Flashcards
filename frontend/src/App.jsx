import { useState, useEffect } from 'react';
import { getAllDecks, createDeck, deleteDeck, updateDeck } from './api/deckApi';
import {getFlashcardsByDeckId, createFlashcard, deleteFlashcard, getCardsToStudy, updateFlashcard} from './api/flashcardApi';
import AuthPage from './components/AuthPage';
import DeckCard from './components/DeckCard';
import DeckView from './components/DeckView';
import CreateDeckModal from './components/CreateDeckModal';
import CreateFlashcardModal from './components/CreateFlashcardModal';
import EditDeckModal from './components/EditDeckModal';
import EditFlashcardModal from './components/EditFlashcardModal';
import StudyMode from './components/StudyMode';
import ProfilePage from './components/ProfilePage';
import { SearchIcon, PlusCircleIcon } from './components/icons';
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
  const [cardCounts, setCardCounts] = useState({});
  const [dueCounts, setDueCounts] = useState({});

  // UI state
  const [view, setView] = useState('decks'); // 'decks' | 'deck' | 'study' | 'profile' | 'community'
  const [search, setSearch] = useState('');  // Modals
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [editingDeck, setEditingDeck] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
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
      fetchCardCounts(data);
    } catch (err) {
      setError('Failed to connect to server. Is the backend running on port 8080?');
    } finally {
      setLoading(false);
    }
  };

  const fetchCardCounts = async (deckList) => {
    const validDecks = deckList.filter((d) => d.id != null);
    const [counts, dues] = await Promise.all([
      Promise.all(
        validDecks.map((deck) =>
          getFlashcardsByDeckId(deck.id).then((cards) => cards.length).catch(() => 0)
        )
      ),
      Promise.all(
        validDecks.map((deck) =>
          getCardsToStudy(deck.id).then((cards) => cards.length).catch(() => 0)
        )
      ),
    ]);
    const countMap = {};
    const dueMap = {};
    validDecks.forEach((deck, i) => {
      countMap[deck.id] = counts[i];
      dueMap[deck.id] = dues[i];
    });
    setCardCounts(countMap);
    setDueCounts(dueMap);
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

  const handleEditDeck = async (id, updatedDeck) => {
    const updated = await updateDeck(id, updatedDeck);
    setSelectedDeck(updated);
    await fetchDecks();
  };

  const handleEditFlashcard = async (id, updatedFlashcard) => {
    await updateFlashcard(id, updatedFlashcard);
    await fetchFlashcards(selectedDeck.id);
  };

  // Navigation
  const goToDecks = () => {
    setView('decks');
    setSelectedDeck(null);
    setFlashcards([]);
    fetchDecks();
  };

  const startStudy = async () => {
    const dueCards = await getCardsToStudy(selectedDeck.id);
    setFlashcards(dueCards);
    setView('study');
  };

  // User initials for avatar
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const filteredDecks = decks.filter((deck) =>
    deck.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="topbar">
        <div className="tab-pill">
          <button className={`tab-item ${view === 'profile' ? 'active' : ''}`} onClick={() => setView('profile')}>
            Profile
          </button>
          <button
            className={`tab-item ${view === 'decks' || view === 'deck' || view === 'study' ? 'active' : ''}`}
            onClick={goToDecks}
          >
            Decks
          </button>
          <button className={`tab-item ${view === 'community' ? 'active' : ''}`} onClick={() => setView('community')}>
            Community
          </button>
        </div>
        <div className="avatar" onClick={() => setView('profile')} title={`${user.name} — click for profile`}>
          {initials}
        </div>
      </nav>

      {/* Main content */}
      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}

        {/* DECKS LIST VIEW */}
        {view === 'decks' && (
          <div className="decks-page">
            <div className="decks-search">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <SearchIcon />
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
                {filteredDecks.map((deck, i) => (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    index={i}
                    cardCount={cardCounts[deck.id] ?? 0}
                    dueCount={dueCounts[deck.id] ?? 0}
                    onClick={() => handleSelectDeck(deck)}
                    onDelete={handleDeleteDeck}
                  />
                ))}
                <button className="deck-card add-new-card" onClick={() => setShowCreateDeck(true)}>
                  <span>Add New</span>
                  <PlusCircleIcon size={70} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* COMMUNITY VIEW */}
        {view === 'community' && (
          <div className="empty-state">
            <div className="empty-icon">🌐</div>
            <h3>Community coming soon</h3>
            <p>Share and discover decks from other learners here.</p>
            <button className="btn-secondary" onClick={goToDecks}>Back to Decks</button>
          </div>
        )}

        {/* SINGLE DECK VIEW */}
        {view === 'deck' && selectedDeck && (
          <>
            <DeckView
              deck={selectedDeck}
              flashcards={flashcards}
              onBack={goToDecks}
              onAddCard={() => setShowCreateCard(true)}
              onEditDeck={() => setEditingDeck(true)}
              onEditCard={(fc) => setEditingFlashcard(fc)}
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
            deckName={selectedDeck?.name}
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
          userId={user.id}
          onCreated={handleCreateFlashcard}
          onClose={() => setShowCreateCard(false)}
        />
      )}
      {editingDeck && selectedDeck && (
        <EditDeckModal
          deck={selectedDeck}
          onEdited={handleEditDeck}
          onClose={() => setEditingDeck(false)}
        />
      )}
      {editingFlashcard && (
        <EditFlashcardModal
          flashcard={editingFlashcard}
          userId={user.id}
          onEdited={handleEditFlashcard}
          onClose={() => setEditingFlashcard(null)}
        />
      )}
    </div>
  );
}

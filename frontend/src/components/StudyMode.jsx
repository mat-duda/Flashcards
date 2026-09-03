import { useState } from 'react';

export default function StudyMode({ flashcards, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);

  if (flashcards.length === 0) {
    return (
      <div className="study-container">
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No cards to study</h3>
          <p>Add some flashcards first!</p>
          <button className="btn-secondary" onClick={onExit}>Go Back</button>
        </div>
      </div>
    );
  }

  const card = flashcards[currentIndex];
  const isFinished = currentIndex >= flashcards.length;
  const progress = Math.round((currentIndex / flashcards.length) * 100);

  const handleNext = (knew) => {
    if (knew) setKnown((k) => k + 1);
    setFlipped(false);
    setCurrentIndex((i) => i + 1);
  };

  if (isFinished) {
    return (
      <div className="study-container">
        <div className="study-results">
          <div className="empty-icon">🎉</div>
          <h2>Study Complete!</h2>
          <p>You knew <strong>{known}</strong> out of <strong>{flashcards.length}</strong> cards</p>
          <div className="study-results-bar">
            <div
              className="study-results-fill"
              style={{ width: `${Math.round((known / flashcards.length) * 100)}%` }}
            ></div>
          </div>
          <div className="study-controls">
            <button className="btn-secondary" onClick={onExit}>Back to Deck</button>
            <button className="btn-primary" onClick={() => { setCurrentIndex(0); setKnown(0); setFlipped(false); }}>
              Study Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="study-container">
      <div className="study-header">
        <button className="btn-secondary" onClick={onExit}>✕ Exit</button>
        <span className="study-counter">Card {currentIndex + 1} of {flashcards.length}</span>
      </div>

      <div className="study-progress">
        <div className="study-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div
        className={`study-card ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <span className="card-label">QUESTION</span>
            <p>{card.frontText}</p>
            <span className="card-hint">Tap to reveal answer</span>
          </div>
          <div className="flashcard-back">
            <span className="card-label">ANSWER</span>
            <p>{card.backText}</p>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="study-controls">
          <button className="btn-danger" onClick={() => handleNext(false)}>
            ✕ Still Learning
          </button>
          <button className="btn-success" onClick={() => handleNext(true)}>
            ✓ Got It
          </button>
        </div>
      )}
    </div>
  );
}

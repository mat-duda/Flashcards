import { useState } from 'react';
import { submitReview } from '../api/flashcardApi';
import { UndoIcon, EllipsisIcon } from './icons';
export default function StudyMode({ flashcards, deckName, onExit }) {
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

  const handleRating = async (rating) => {
    try {
      // 1=Again, 2=Hard, 3=Good, 4=Easy
      await submitReview(card.id, rating);
    } catch (err) {
      console.error("Failed to submit review", err);
    }

    if (rating >= 3) setKnown((k) => k + 1);
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
      <div className="study-review-card">
        <div className="study-review-header">
          <button onClick={onExit} title="Back to deck">
            <UndoIcon size={36} />
          </button>
          <span className="study-review-deck-name">{deckName || 'Study'}</span>
          <button title="Options">
            <EllipsisIcon size={36} />
          </button>
        </div>
        <div className="study-review-divider"></div>
        <div
          className="study-review-content"
          onClick={() => setFlipped(!flipped)}
        >
          <div style={{ width: '100%' }}>
            <div 
              className="study-review-text tiptap-editor-content"
              dangerouslySetInnerHTML={{ __html: flipped ? card.backText : card.frontText }}
            />
            {!flipped && (
              <p className="study-review-hint">Tap to reveal answer</p>
            )}
          </div>
        </div>
      </div>

      {flipped && (
        <div className="study-rating-buttons">
          <button className="study-rating-btn bad" onClick={() => handleRating(1)}>
            Bad
          </button>
          <button className="study-rating-btn hard" onClick={() => handleRating(2)}>
            Hard
          </button>
          <button className="study-rating-btn good" onClick={() => handleRating(3)}>
            Good
          </button>
          <button className="study-rating-btn perfect" onClick={() => handleRating(4)}>
            Perfect
          </button>
        </div>
      )}
    </div>
  );
}

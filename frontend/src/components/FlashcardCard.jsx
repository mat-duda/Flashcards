import { useState } from 'react';

export default function FlashcardCard({ flashcard, onDelete }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`flashcard-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <span className="card-label">FRONT</span>
          <p>{flashcard.frontText}</p>
          <span className="card-hint">Click to flip</span>
        </div>
        <div className="flashcard-back">
          <span className="card-label">BACK</span>
          <p>{flashcard.backText}</p>
          <button
            className="btn-danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(flashcard.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

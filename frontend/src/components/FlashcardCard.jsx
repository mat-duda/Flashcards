import { useState } from 'react';

export default function FlashcardCard({ flashcard, onEdit, onDelete }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`flashcard-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <span className="card-label">FRONT</span>
          <div className="flashcard-content-wrapper">
            <div 
              className="tiptap-editor-content flashcard-text-content" 
              dangerouslySetInnerHTML={{ __html: flashcard.frontText }} 
            />
          </div>
          <span className="card-hint">Click to flip</span>
        </div>
        <div className="flashcard-back">
          <span className="card-label">BACK</span>
          <div className="flashcard-content-wrapper">
            <div 
              className="tiptap-editor-content flashcard-text-content" 
              dangerouslySetInnerHTML={{ __html: flashcard.backText }} 
            />
          </div>
          <div className="flashcard-action-row">
            <button
              className="btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(flashcard);
              }}
            >
              Edit
            </button>
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
    </div>
  );
}

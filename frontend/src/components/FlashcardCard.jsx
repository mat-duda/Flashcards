import { useState } from 'react';

export default function FlashcardCard({ flashcard, onEdit, onDelete }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`flashcard-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <span className="card-label">FRONT</span>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%' }}>
            <div 
              className="tiptap-editor-content" 
              style={{ width: '100%', maxHeight: '100%', overflowY: 'auto', textAlign: 'center' }}
              dangerouslySetInnerHTML={{ __html: flashcard.frontText }} 
            />
          </div>
          <span className="card-hint">Click to flip</span>
        </div>
        <div className="flashcard-back">
          <span className="card-label">BACK</span>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%' }}>
            <div 
              className="tiptap-editor-content" 
              style={{ width: '100%', maxHeight: '100%', overflowY: 'auto', textAlign: 'center' }}
              dangerouslySetInnerHTML={{ __html: flashcard.backText }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: 'auto' }}>
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

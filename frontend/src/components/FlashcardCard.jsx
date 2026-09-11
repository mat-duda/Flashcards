import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
export default function FlashcardCard({ flashcard, onEdit, onDelete }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`flashcard-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <span className="card-label">FRONT</span>
          <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{flashcard.frontText}</ReactMarkdown>
        </div>
          <span className="card-hint">Click to flip</span>
        </div>
        <div className="flashcard-back">
          <span className="card-label">BACK</span>
          <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{flashcard.backText}</ReactMarkdown>
        </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
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

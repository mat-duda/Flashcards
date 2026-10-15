import React from 'react';

export default function CommunityDeckPreviewModal({ previewDeck, previewCards, onClose, onClone }) {
  if (!previewDeck) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-wide preview-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="preview-modal-header">
          <h2>{previewDeck.deck.name}</h2>
          <div className="preview-author-row">
            <img 
              src={previewDeck.authorProfilePictureUrl} 
              alt={previewDeck.authorName} 
              className="community-author-avatar"
            />
            <span className="community-author-name">
              Created by {previewDeck.authorName}
            </span>
          </div>
        </div>

        <div className="preview-cards-container">
          <h3>Flashcards Preview ({previewCards.length})</h3>
          {previewCards.length === 0 ? (
            <p>This deck has no flashcards yet.</p>
          ) : (
            <div className="preview-cards-list">
              {previewCards.map((card, index) => (
                <div key={card.id || index} className="preview-card-item">
                  <div className="preview-card-label">FRONT</div>
                  <div className="tiptap-editor-content" dangerouslySetInnerHTML={{ __html: card.frontText }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="preview-modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onClone(previewDeck.deck.id)}>
            Copy to My Decks
          </button>
        </div>
      </div>
    </div>
  );
}

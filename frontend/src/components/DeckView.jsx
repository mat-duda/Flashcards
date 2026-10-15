import FlashcardCard from './FlashcardCard';
import {useState} from "react";

export default function DeckView({ deck, flashcards, onBack, onAddCard, onEditDeck, onEditCard, onDeleteCard , onGoPublic,onGoPrivate}) {
  return (
    <div className="deck-view">
      <div className="deck-view-header">
        <button className="btn-secondary" onClick={onBack}>← Back to Decks</button>
        <div className="deck-view-action-row">
          <div>
            <h1>{deck.name}</h1>
            <p className="deck-view-meta">{flashcards.length} cards</p>
          </div>
          <button className="btn-secondary" onClick={onEditDeck}>Edit Name</button>
        </div>
        <button className="btn-primary" onClick={onAddCard}>+ Add Card</button>
        {deck.isPublic === false ? (
          <button className="btn-secondary" onClick={() => onGoPublic(deck)}>Make Public</button>
        ) : (
          <button className="btn-secondary" onClick={() => onGoPrivate(deck)}>Make Private</button>
        )}
      </div>
      {flashcards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No cards yet</h3>
          <p>Add your first flashcard to this deck!</p>
          <button className="btn-primary" onClick={onAddCard}>+ Add Flashcard</button>
        </div>
      ) : (
        <div className="flashcard-grid">
          {flashcards.map((fc) => (
            <FlashcardCard key={fc.id} flashcard={fc} onEdit={onEditCard} onDelete={onDeleteCard} />
          ))}
        </div>
      )}
    </div>
  );
}

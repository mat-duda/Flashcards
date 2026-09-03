export default function DeckCard({ deck, cardCount, onClick, onDelete }) {
  const colors = ['#0d9488', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const accentColor = colors[deck.id % colors.length];

  return (
    <div className="deck-card" onClick={onClick}>
      <div className="deck-card-accent" style={{ backgroundColor: accentColor }}></div>
      <div className="deck-card-body">
        <h3 className="deck-card-title">{deck.name}</h3>
        <p className="deck-card-meta">
          <span className="badge">{cardCount} cards</span>
        </p>
      </div>
      <div className="deck-card-actions">
        <button
          className="btn-icon btn-danger-subtle"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(deck.id);
          }}
          title="Delete deck"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

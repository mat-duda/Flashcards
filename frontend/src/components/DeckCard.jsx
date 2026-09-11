import { ArmchairIcon, BanknoteIcon, BeefIcon, CatIcon, CrownIcon, EllipsisIcon } from './icons';

const PALETTE = [
  { bg: '#94A3B8', Icon: ArmchairIcon },
  { bg: '#D6D3D1', Icon: BanknoteIcon },
  { bg: '#78716C', Icon: BeefIcon },
  { bg: '#FDE047', Icon: CatIcon },
  { bg: '#99F6E4', Icon: CrownIcon },
];

export default function DeckCard({ deck, index, cardCount, dueCount, onClick, onDelete }) {
  const { bg, Icon } = PALETTE[index % PALETTE.length];
  const progress = cardCount > 0 ? Math.round(((cardCount - dueCount) / cardCount) * 100) : 0;

  return (
    <div className="deck-card" style={{ backgroundColor: bg }} onClick={onClick}>
      <div className="deck-card-top">
        <div className="deck-card-icon">
          <Icon />
        </div>
        <span className="deck-card-title">{deck.name}</span>
        <button
          className="deck-card-menu"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(deck.id);
          }}
          title="Delete deck"
        >
          <EllipsisIcon />
        </button>
      </div>
      <div className="deck-card-footer">
        <span>{cardCount} Cards</span>
        <span>Left: {dueCount}</span>
      </div>
      <div className="deck-progress">
        <div className="deck-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

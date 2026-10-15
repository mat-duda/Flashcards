import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

export default function CreateFlashcardModal({ deckId, userId, onCreated, onClose }) {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!frontText.trim() || !backText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await onCreated({
        frontText,
        backText,
        deckId,
        userId: userId,
        whenCreatedDate: new Date().toISOString(),
      });
      setFrontText('');
      setBackText('');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Add New Flashcard</h2>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Front (Question)</label>
            <RichTextEditor content={frontText} onChange={setFrontText} userId={userId} />
          </div>

          <div className="form-group">
            <label>Back (Answer)</label>
            <RichTextEditor content={backText} onChange={setBackText} userId={userId} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Flashcard'}
          </button>
        </form>
      </div>
    </div>
  );
}

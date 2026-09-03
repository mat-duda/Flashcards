import { useState } from 'react';

export default function CreateFlashcardModal({ deckId, onCreated, onClose }) {
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
        userId: 1,
        whenCreatedDate: new Date().toISOString().split('T')[0],
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Add New Flashcard</h2>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="frontText">Front (Question)</label>
            <textarea
              id="frontText"
              value={frontText}
              onChange={(e) => setFrontText(e.target.value)}
              placeholder="Enter the question..."
              required
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="backText">Back (Answer)</label>
            <textarea
              id="backText"
              value={backText}
              onChange={(e) => setBackText(e.target.value)}
              placeholder="Enter the answer..."
              required
              rows={3}
            />
          </div>

          <button type="submit" className="btn-primary submit-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Flashcard'}
          </button>
        </form>
      </div>
    </div>
  );
}

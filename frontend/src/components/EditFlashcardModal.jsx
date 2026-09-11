import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

export default function EditFlashcardModal({ flashcard, userId, onEdited, onClose }) {
  const [frontText, setFrontText] = useState(flashcard.frontText);
  const [backText, setBackText] = useState(flashcard.backText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!frontText.trim() || !backText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await onEdited(flashcard.id, {
        ...flashcard,
        frontText,
        backText,
      });
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
        <h2>Edit Flashcard</h2>

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

          <button type="submit" className="btn-primary submit-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

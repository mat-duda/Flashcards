import { useState, useEffect } from 'react';
import { getUserById } from '../api/userApi';
import { getAllDecks } from '../api/deckApi';

export default function ProfilePage({ userId, onBack }) {
  const [user, setUser] = useState(null);
  const [deckCount, setDeckCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [userData, decks] = await Promise.all([
        getUserById(userId),
        getAllDecks().catch(() => []),
      ]);
      setUser(userData);
      setDeckCount(decks.filter((d) => d.userId === userId).length);
      setError(null);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="empty-state">
        <div className="empty-icon">😕</div>
        <h3>User not found</h3>
        <button className="btn-secondary" onClick={onBack}>Go Back</button>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const profileCreated = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : '—';

  return (
    <div className="profile-page">
      <button className="btn-secondary profile-back-btn" onClick={onBack}>← Back to Decks</button>

      {error && <div className="error-banner">{error}</div>}

      <div className="profile-stats-card">
        <div className="profile-avatar-circle">{initials}</div>
        <h1 className="profile-username">@{user.name.replace(/\s+/g, '')}</h1>

        <div className="profile-stats-row">
          <div className="profile-stat">
            <span className="profile-stat-label">Decks created:</span>
            <span className="profile-stat-value">{deckCount ?? '—'}</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-label">Streak:</span>
            <span className="profile-stat-value">—</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-label">Profile created:</span>
            <span className="profile-stat-value">{profileCreated}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

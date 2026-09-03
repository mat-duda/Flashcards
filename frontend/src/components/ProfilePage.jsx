import { useState, useEffect } from 'react';
import { getUserById, updateUser, changePassword } from '../api/userApi';

export default function ProfilePage({ userId, onBack }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saving, setSaving] = useState(false);

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUserById(userId);
      setUser(data);
      setEditName(data.name);
      setEditEmail(data.email);
      setError(null);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) return;

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateUser(userId, {
        name: editName,
        email: editEmail,
      });
      setUser(updated);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      await changePassword(userId, {
        currentPassword,
        newPassword,
      });
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Password changed successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditName(user.name);
    setEditEmail(user.email);
    setError(null);
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

  return (
    <div className="profile-page">
      <button className="btn-secondary profile-back-btn" onClick={onBack}>← Back to Decks</button>

      {success && <div className="success-banner">{success}</div>}
      {error && <div className="error-banner">{error}</div>}

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-large">{initials}</div>
        <div className="profile-header-info">
          <h1>{user.name}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="profile-card">
        <div className="profile-card-header">
          <h2>Personal Information</h2>
          {!editing && (
            <button className="btn-secondary" onClick={() => setEditing(true)}>
              ✏️ Edit
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label htmlFor="profileName">Name</label>
              <input
                id="profileName"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="profileEmail">Email</label>
              <input
                id="profileEmail"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
            </div>
            <div className="profile-card-actions">
              <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">Name</span>
              <span className="profile-info-value">{user.name}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{user.email}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">User ID</span>
              <span className="profile-info-value">#{user.id}</span>
            </div>
          </div>
        )}
      </div>

      {/* Password Card */}
      <div className="profile-card">
        <div className="profile-card-header">
          <h2>Security</h2>
        </div>

        {showPasswordForm ? (
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="profile-card-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowPasswordForm(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setError(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-security-row">
            <div>
              <p className="profile-info-label">Password</p>
              <p className="profile-info-value">••••••••</p>
            </div>
            <button className="btn-secondary" onClick={() => setShowPasswordForm(true)}>
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

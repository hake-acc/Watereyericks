import React, { useState, useEffect, useCallback } from 'react';
import {
  Youtube,
  Search,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Trash2,
  ExternalLink,
  Users,
  RefreshCw,
  ArrowDownNarrowWide,
  Check,
} from 'lucide-react';
import Tape from '../Tape.jsx';
import creatorsFallback from '../../data/creators.json';

export default function ManageCreators({ onCreatorChanged }) {
  const [channelUrlInput, setChannelUrlInput] = useState('');
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Fetched data
  const [fetchedData, setFetchedData] = useState(null);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [subscribers, setSubscribers] = useState('');
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [avatarBase64, setAvatarBase64] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Submit status
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  // Creators list
  const [creatorsList, setCreatorsList] = useState(() => {
    const list = Array.isArray(creatorsFallback.creators) ? [...creatorsFallback.creators] : [];
    return list.sort((a, b) => (b.subscribersCount || 0) - (a.subscribersCount || 0));
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Load creators from API
  const loadCreators = useCallback(async () => {
    try {
      const resp = await fetch('/api/admin/creators');
      if (resp.ok) {
        const data = await resp.json();
        if (data.creators) {
          const sorted = [...data.creators].sort((a, b) => (b.subscribersCount || 0) - (a.subscribersCount || 0));
          setCreatorsList(sorted);
        }
      }
    } catch (err) {
      console.warn('Could not fetch live creators list, using cached list:', err);
    }
  }, []);

  useEffect(() => {
    loadCreators();
  }, [loadCreators]);

  // Handle auto-fetch from YouTube
  const handleAutoFetch = async (e) => {
    if (e) e.preventDefault();
    if (!channelUrlInput.trim()) return;

    setFetching(true);
    setFetchError(null);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      const resp = await fetch('/api/admin/creators?action=fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: channelUrlInput.trim() }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to auto-fetch YouTube channel details.');
      }

      const c = data.creator;
      setFetchedData(c);
      setName(c.name || '');
      setHandle(c.handle || '');
      setYoutubeUrl(c.youtubeUrl || channelUrlInput.trim());
      setSubscribers(c.subscribers || '');
      setSubscribersCount(c.subscribersCount || 0);
      setAvatarBase64(c.avatarBase64 || '');
      setAvatarUrl(c.avatarUrl || '');
    } catch (err) {
      setFetchError(err.message);
      setFetchedData(null);
    } finally {
      setFetching(false);
    }
  };

  // Handle saving creator
  const handleAddCreator = async (e) => {
    e.preventDefault();
    if (!name.trim() || !youtubeUrl.trim()) {
      setSaveError('Channel name and YouTube URL are required.');
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveStatus('Saving to GitHub & auto-arranging by subscribers count...');

    try {
      const resp = await fetch('/api/admin/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          handle: handle.trim(),
          youtubeUrl: youtubeUrl.trim(),
          subscribers: subscribers.trim(),
          subscribersCount: Number(subscribersCount) || 0,
          avatarBase64,
          avatarUrl,
        }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to save creator.');
      }

      setSaveSuccess(data.message || `Creator "${name}" successfully added and auto-arranged!`);
      setSaveStatus('');

      // Reset form
      setChannelUrlInput('');
      setFetchedData(null);
      setName('');
      setHandle('');
      setYoutubeUrl('');
      setSubscribers('');
      setSubscribersCount(0);
      setAvatarBase64('');
      setAvatarUrl('');

      loadCreators();
      if (onCreatorChanged) onCreatorChanged();
    } catch (err) {
      setSaveError(err.message);
      setSaveStatus('');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDeleteCreator = async (creatorId, creatorName) => {
    if (!window.confirm(`Are you sure you want to remove "${creatorName}" from the portfolio?`)) {
      return;
    }

    setDeletingId(creatorId);
    try {
      const resp = await fetch('/api/admin/creators?action=delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: creatorId }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to delete creator.');
      }

      loadCreators();
      if (onCreatorChanged) onCreatorChanged();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered list
  const filteredCreators = creatorsList.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.handle && c.handle.toLowerCase().includes(q)) ||
      (c.subscribers && c.subscribers.toLowerCase().includes(q))
    );
  });

  return (
    <div className="manage-creators-container">
      {/* 1. ADD CREATOR CARD */}
      <div className="admin-form-card">
        <Tape position="tl" />
        <Tape position="br" />

        <div className="admin-form-header">
          <div className="admin-form-icon" aria-hidden="true">
            <Youtube size={24} />
          </div>
          <div>
            <h2 className="admin-form-title">Add YouTube Creator</h2>
            <p className="admin-form-sub">
              Paste a YouTube channel link or @handle. The system automatically fetches their avatar, subscriber count, and arranges them by subs.
            </p>
          </div>
        </div>

        {fetchError && (
          <div className="admin-alert admin-alert--error" role="alert">
            <AlertCircle size={18} />
            <span>{fetchError}</span>
          </div>
        )}

        {saveError && (
          <div className="admin-alert admin-alert--error" role="alert">
            <AlertCircle size={18} />
            <span>{saveError}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-alert admin-alert--success" role="alert">
            <CheckCircle size={18} />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Step 1: Input URL and Auto-Fetch */}
        <form onSubmit={handleAutoFetch} className="creator-fetch-bar">
          <div className="creator-input-wrap">
            <span className="creator-input-icon">
              <Youtube size={18} />
            </span>
            <input
              type="text"
              placeholder="e.g. https://www.youtube.com/@yessmartypie or @justapepper"
              value={channelUrlInput}
              onChange={(e) => setChannelUrlInput(e.target.value)}
              disabled={fetching || saving}
              className="creator-url-input"
            />
          </div>

          <button
            type="submit"
            className="paper-btn paper-btn--filled creator-fetch-btn"
            disabled={fetching || saving || !channelUrlInput.trim()}
          >
            {fetching ? (
              <>
                <RefreshCw size={16} className="spin-icon" />
                <span>Auto-Fetching...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Auto-Fetch YT Info</span>
              </>
            )}
          </button>
        </form>

        {/* Step 2: Review and Save Fetched Creator */}
        {fetchedData && (
          <form onSubmit={handleAddCreator} className="fetched-creator-form">
            <div className="creator-preview-card">
              <div className="creator-preview-avatar-wrap">
                {avatarBase64 || avatarUrl ? (
                  <img
                    src={avatarBase64 || avatarUrl}
                    alt="Fetched avatar"
                    className="creator-preview-avatar"
                  />
                ) : (
                  <div className="creator-preview-avatar-empty">
                    <Users size={32} />
                  </div>
                )}
                <span className="creator-preview-badge">Auto-Fetched</span>
              </div>

              <div className="creator-preview-details">
                <div className="creator-preview-row">
                  <div className="creator-field-half">
                    <label>Channel Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Creator Name"
                    />
                  </div>
                  <div className="creator-field-half">
                    <label>YouTube Handle</label>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="@handle"
                    />
                  </div>
                </div>

                <div className="creator-preview-row">
                  <div className="creator-field-half">
                    <label>Subscriber Count (Auto-Arranged)</label>
                    <input
                      type="text"
                      value={subscribers}
                      onChange={(e) => setSubscribers(e.target.value)}
                      placeholder="e.g. 524K or 6.89M"
                      required
                    />
                  </div>
                  <div className="creator-field-half">
                    <label>Channel Link</label>
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="creator-actions-bar">
              <span className="creator-sort-hint">
                <ArrowDownNarrowWide size={15} />
                <span>Will automatically be arranged in the portfolio by subscriber rank.</span>
              </span>

              <button
                type="submit"
                className="paper-btn paper-btn--filled creator-save-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <RefreshCw size={16} className="spin-icon" />
                    <span>{saveStatus || 'Saving Creator...'}</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Add to Portfolio & Deploy</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. CURRENT CREATORS LIST */}
      <div className="creators-management-section">
        <div className="creators-section-top">
          <div className="creators-count-info">
            <h3 className="creators-section-title">Current Creators ({creatorsList.length})</h3>
            <span className="creators-arranged-badge">
              <ArrowDownNarrowWide size={13} />
              Auto-arranged by subscriber count
            </span>
          </div>

          <div className="creators-search-wrap">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="creators-search-input"
            />
          </div>
        </div>

        <div className="creators-admin-grid">
          {filteredCreators.map((creator, index) => (
            <div className="creator-admin-card" key={creator.id || index}>
              <div className="creator-admin-rank">#{index + 1}</div>

              <div className="creator-admin-avatar-wrap">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="creator-admin-avatar"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="creator-admin-avatar-fallback">
                  {creator.name ? creator.name.slice(0, 2).toUpperCase() : 'YT'}
                </span>
              </div>

              <div className="creator-admin-info">
                <h4 className="creator-admin-name">{creator.name}</h4>
                <span className="creator-admin-handle">{creator.handle}</span>
                <span className="creator-admin-subs">
                  <Youtube size={12} />
                  {creator.subscribers} Subscribers
                </span>
              </div>

              <div className="creator-admin-actions">
                <a
                  href={creator.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="creator-admin-link-btn"
                  title="Visit YouTube Channel"
                >
                  <ExternalLink size={14} />
                </a>

                <button
                  type="button"
                  className="creator-admin-delete-btn"
                  onClick={() => handleDeleteCreator(creator.id, creator.name)}
                  disabled={deletingId === creator.id}
                  title="Remove from portfolio"
                >
                  {deletingId === creator.id ? (
                    <RefreshCw size={14} className="spin-icon" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

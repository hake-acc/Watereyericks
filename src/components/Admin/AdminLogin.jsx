import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Tape from '../Tape.jsx';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side strict length verification
    if (username.length !== 128) {
      setError(`Owner ID must be exactly 128 characters (currently ${username.length}).`);
      return;
    }

    if (password.length !== 209) {
      setError(`Password must be exactly 209 characters (currently ${password.length}).`);
      return;
    }

    setLoading(true);

    try {
      const resp = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        // Immediate security wipe on failure
        setPassword('');
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      onLoginSuccess(data.user || 'Owner');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isUserValid = username.length === 128;
  const isPassValid = password.length === 209;

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <Tape position="tl" />
        <Tape position="br" />

        <div className="admin-login-header">
          <div className="admin-shield-icon" aria-hidden="true">
            <ShieldCheck size={28} />
          </div>
          <span className="admin-login-badge">PORTFOLIO CMS • PRIVATE OWNER ACCESS</span>
          <h1 className="admin-login-title">Water Eye Admin</h1>
          <p className="admin-login-subtitle">
            Secure GitHub-backed portfolio manager. Enter hardened credentials.
          </p>
        </div>

        {error && (
          <div className="admin-alert admin-alert--error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          {/* Owner ID (128 Chars) */}
          <div className="admin-field">
            <div className="admin-field-label-row">
              <label htmlFor="admin-username">Owner ID</label>
              <span
                className={`admin-counter-pill ${isUserValid ? 'valid' : ''}`}
                title="Must be exactly 128 characters"
              >
                {username.length} / 128
              </span>
            </div>
            <div className="admin-input-wrap">
              <span className="input-icon"><User size={16} /></span>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                required
                maxLength={128}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                placeholder="Paste 128-character Owner ID"
              />
            </div>
          </div>

          {/* Password (209 Chars) */}
          <div className="admin-field">
            <div className="admin-field-label-row">
              <label htmlFor="admin-password">Password</label>
              <span
                className={`admin-counter-pill ${isPassValid ? 'valid' : ''}`}
                title="Must be exactly 209 characters"
              >
                {password.length} / 209
              </span>
            </div>
            <div className="admin-input-wrap">
              <span className="input-icon"><Lock size={16} /></span>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={209}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                placeholder="Paste 209-character Password"
              />
              <button
                type="button"
                className="admin-pw-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="paper-btn paper-btn--filled admin-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <span>Enforces 128-char Owner ID & 209-char Password • Rate-limited</span>
        </div>
      </div>
    </div>
  );
}

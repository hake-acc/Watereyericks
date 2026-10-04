import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Tape from '../Tape.jsx';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resp = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      onLoginSuccess(data.user || username);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <Tape position="tl" />
        <Tape position="br" />

        <div className="admin-login-header">
          <div className="admin-shield-icon" aria-hidden="true">
            <ShieldCheck size={28} />
          </div>
          <span className="admin-login-badge">PORTFOLIO CMS • PRIVATE ACCESS</span>
          <h1 className="admin-login-title">Water Eye Admin</h1>
          <p className="admin-login-subtitle">
            Secure GitHub-backed content management system.
          </p>
        </div>

        {error && (
          <div className="admin-alert admin-alert--error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="admin-username">Username</label>
            <div className="admin-input-wrap">
              <span className="input-icon"><User size={16} /></span>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Owner username"
              />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-input-wrap">
              <span className="input-icon"><Lock size={16} /></span>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter password"
              />
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
          <span>Protected by HttpOnly session cookies & GitHub API integration.</span>
        </div>
      </div>
    </div>
  );
}

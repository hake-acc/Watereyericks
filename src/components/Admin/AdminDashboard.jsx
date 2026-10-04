import React, { useState, useEffect, useCallback } from 'react';
import AdminLogin from './AdminLogin.jsx';
import UploadThumbnail from './UploadThumbnail.jsx';
import UploadSlider from './UploadSlider.jsx';
import PortfolioList from './PortfolioList.jsx';
import {
  ShieldCheck,
  LogOut,
  ExternalLink,
  Image as ImageIcon,
  Sliders,
  RefreshCw,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import Tape from '../Tape.jsx';
import portfolioFallback from '../../data/portfolio.json';
import './admin.css';

export default function AdminDashboard({ onNavigateHome }) {
  const [authState, setAuthState] = useState({ checking: true, authenticated: false, user: null });
  const [activeTab, setActiveTab] = useState('thumbnail'); // 'thumbnail' | 'slider'
  const [portfolio, setPortfolio] = useState(portfolioFallback);
  const [deployStatus, setDeployStatus] = useState({ status: 'READY', lastChecked: Date.now() });

  // Add noindex meta tag dynamically
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Water Eye — Private Admin Dashboard';

    let metaRobots = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
      created = true;
    }
    const prevContent = metaRobots.getAttribute('content');
    metaRobots.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');

    return () => {
      document.title = originalTitle;
      if (created) {
        metaRobots.remove();
      } else if (prevContent) {
        metaRobots.setAttribute('content', prevContent);
      } else {
        metaRobots.removeAttribute('content');
      }
    };
  }, []);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const resp = await fetch('/api/admin/auth-check');
      if (resp.ok) {
        const data = await resp.json();
        setAuthState({ checking: false, authenticated: true, user: data.user });
        loadPortfolio();
      } else {
        setAuthState({ checking: false, authenticated: false, user: null });
      }
    } catch {
      setAuthState({ checking: false, authenticated: false, user: null });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Load portfolio from API or fallback
  const loadPortfolio = async () => {
    try {
      const resp = await fetch('/api/admin/portfolio');
      if (resp.ok) {
        const data = await resp.json();
        if (data && (data.thumbnails || data.comparisons)) {
          setPortfolio(data);
        }
      }
    } catch (err) {
      console.warn('Using bundled portfolio data fallback:', err);
    }
  };

  // Poll deployment status
  const pollDeployStatus = useCallback(async () => {
    try {
      const resp = await fetch('/api/admin/deploy-status');
      if (resp.ok) {
        const data = await resp.json();
        setDeployStatus({ status: data.status || 'READY', url: data.url, lastChecked: Date.now() });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (authState.authenticated) {
      pollDeployStatus();
      const interval = setInterval(pollDeployStatus, 15000);
      return () => clearInterval(interval);
    }
  }, [authState.authenticated, pollDeployStatus]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setAuthState({ checking: false, authenticated: false, user: null });
  };

  const handleItemPublished = (newItem) => {
    loadPortfolio();
    pollDeployStatus();
    // Temporary set status to building/queued
    setDeployStatus({ status: 'BUILDING', lastChecked: Date.now() });
  };

  const handleItemDeleted = (deletedId) => {
    loadPortfolio();
    pollDeployStatus();
    setDeployStatus({ status: 'BUILDING', lastChecked: Date.now() });
  };

  if (authState.checking) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner" />
        <span>Verifying admin session...</span>
      </div>
    );
  }

  if (!authState.authenticated) {
    return <AdminLogin onLoginSuccess={(u) => { setAuthState({ checking: false, authenticated: true, user: u }); loadPortfolio(); }} />;
  }

  const thumbCount = portfolio.thumbnails?.length || 0;
  const sliderCount = portfolio.comparisons?.length || 0;

  return (
    <div className="admin-dashboard-container">
      {/* Top Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <span className="admin-brand-chip">WE CMS</span>
          <div className="admin-title-wrap">
            <h1 className="admin-topbar-title">Water Eye Portfolio Manager</h1>
            <span className="admin-branch-tag">Branch: main • GitHub</span>
          </div>
        </div>

        <div className="admin-topbar-right">
          {/* Deployment Pill */}
          <div className={`deploy-status-pill status-${(deployStatus.status || '').toLowerCase()}`}>
            <span className="status-dot" aria-hidden="true" />
            <span>
              {deployStatus.status === 'READY'
                ? 'Production Live'
                : deployStatus.status === 'BUILDING'
                ? 'Vercel Building...'
                : 'Deploying...'}
            </span>
          </div>

          <div className="admin-user-pill">
            <ShieldCheck size={14} />
            <span>{authState.user || 'Owner'}</span>
          </div>

          <button
            type="button"
            className="admin-nav-btn"
            onClick={onNavigateHome}
            title="View Live Website"
          >
            <ExternalLink size={14} />
            <span>View Site</span>
          </button>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Log Out"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        {/* Upload Mode Switcher */}
        <div className="admin-tabs-wrap">
          <div className="admin-tabs-list" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'thumbnail'}
              className={`admin-tab-btn ${activeTab === 'thumbnail' ? 'active' : ''}`}
              onClick={() => setActiveTab('thumbnail')}
            >
              <ImageIcon size={18} />
              <span>Normal Thumbnail</span>
              <span className="tab-badge">{thumbCount}</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'slider'}
              className={`admin-tab-btn ${activeTab === 'slider' ? 'active' : ''}`}
              onClick={() => setActiveTab('slider')}
            >
              <Sliders size={18} />
              <span>Before / After Slider</span>
              <span className="tab-badge">{sliderCount}</span>
            </button>
          </div>
        </div>

        {/* Tab Form Panels */}
        <div className="admin-panel-wrap">
          {activeTab === 'thumbnail' ? (
            <UploadThumbnail onPublished={handleItemPublished} />
          ) : (
            <UploadSlider onPublished={handleItemPublished} />
          )}
        </div>

        {/* Content Management Grid */}
        <PortfolioList portfolio={portfolio} onDeleted={handleItemDeleted} />
      </main>
    </div>
  );
}

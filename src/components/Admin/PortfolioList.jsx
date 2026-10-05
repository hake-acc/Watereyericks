import React, { useState } from 'react';
import {
  Trash2,
  AlertTriangle,
  Layers,
  Sliders,
  Image as ImageIcon,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';
import Tape from '../Tape.jsx';

export default function PortfolioList({ portfolio, onDeleted, onRefreshLive, isRefreshing }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'thumbnail' | 'slider'
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState('');
  const [deleteError, setDeleteError] = useState(null);
  const [statusNotification, setStatusNotification] = useState(null);

  const thumbnails = Array.isArray(portfolio?.thumbnails) ? portfolio.thumbnails : [];
  const comparisons = Array.isArray(portfolio?.comparisons) ? portfolio.comparisons : [];

  // Combine for search/display
  const allItems = [
    ...comparisons.map((c) => ({ ...c, itemType: 'slider' })),
    ...thumbnails.map((t) => ({ ...t, itemType: 'thumbnail' })),
  ];

  const filteredItems = allItems.filter((item) => {
    if (filterType === 'thumbnail' && item.itemType !== 'thumbnail') return false;
    if (filterType === 'slider' && item.itemType !== 'slider') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title || item.name || '').toLowerCase().includes(q);
      const matchCat = (item.category || item.subcat || '').toLowerCase().includes(q);
      const matchId = (item.id || '').toLowerCase().includes(q);
      return matchTitle || matchCat || matchId;
    }
    return true;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const targetItem = deleteTarget;
    setIsDeleting(true);
    setDeleteError(null);
    setDeleteProgress('1/3: Locating item in GitHub main branch...');

    try {
      setDeleteProgress('2/3: Removing asset & updating portfolio.json on GitHub...');

      const resp = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetItem.id,
          type: targetItem.itemType,
        }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data.error || 'Failed to delete item from GitHub.');
      }

      setDeleteProgress('3/3: Triggering automated production deployment...');

      // Notify parent immediately with updated portfolio so item vanishes from view in real-time
      if (onDeleted) {
        onDeleted(targetItem.id, data.portfolio);
      }

      if (data.alreadyDeleted) {
        setStatusNotification({
          type: 'info',
          message: `Item "${targetItem.title || targetItem.name}" was already removed from the GitHub repository. Portfolio view has been synchronized.`,
        });
      } else {
        setStatusNotification({
          type: 'success',
          message: `Successfully deleted "${data.deletedTitle || targetItem.title || targetItem.name}" from GitHub repository. Production deployment in progress.`,
          commitSha: data.commitSha,
        });
      }

      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err.message || 'Deletion failed. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteProgress('');
    }
  };

  return (
    <div className="admin-portfolio-section">
      <div className="admin-section-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 className="admin-section-title">Current Portfolio Content</h2>
            {portfolio?.source === 'github-live' && (
              <span
                style={{
                  background: '#064e3b',
                  color: '#34d399',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                ● Live from GitHub
              </span>
            )}
          </div>
          <p className="admin-section-sub">
            {thumbnails.length} normal thumbnails and {comparisons.length} comparison sliders stored in GitHub.
          </p>
        </div>

        {/* Sync with GitHub Button */}
        {onRefreshLive && (
          <button
            type="button"
            className="admin-sync-btn"
            onClick={onRefreshLive}
            disabled={isRefreshing}
            title="Force pull latest live portfolio state directly from GitHub"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1e293b',
              color: '#cbd5e1',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '13px',
              cursor: isRefreshing ? 'wait' : 'pointer',
              fontWeight: 500,
            }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
            <span>{isRefreshing ? 'Syncing with GitHub...' : 'Sync with GitHub'}</span>
          </button>
        )}
      </div>

      {/* Real-time Status Alert */}
      {statusNotification && (
        <div
          className={`admin-alert ${
            statusNotification.type === 'info' ? 'admin-alert--info' : 'admin-alert--success'
          }`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {statusNotification.type === 'info' ? (
              <Info size={18} style={{ color: '#38bdf8' }} />
            ) : (
              <CheckCircle size={18} style={{ color: '#10b981' }} />
            )}
            <span>{statusNotification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusNotification(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar" style={{ marginBottom: '16px' }}>
        <div className="search-wrap">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search by title, category, or #id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <div className="type-filter-group">
          <button
            className={`type-filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All ({allItems.length})
          </button>
          <button
            className={`type-filter-btn ${filterType === 'thumbnail' ? 'active' : ''}`}
            onClick={() => setFilterType('thumbnail')}
          >
            Thumbnails ({thumbnails.length})
          </button>
          <button
            className={`type-filter-btn ${filterType === 'slider' ? 'active' : ''}`}
            onClick={() => setFilterType('slider')}
          >
            Sliders ({comparisons.length})
          </button>
        </div>
      </div>

      {/* Grid of Portfolio Items */}
      {filteredItems.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: '#0f172a',
            borderRadius: '8px',
            border: '1px dashed #334155',
            color: '#94a3b8',
          }}
        >
          <p style={{ margin: 0, fontSize: '15px' }}>
            {searchQuery
              ? `No portfolio items matched "${searchQuery}".`
              : 'No items found in this section.'}
          </p>
        </div>
      ) : (
        <div className="admin-items-grid">
          {filteredItems.map((it) => {
            const isSlider = it.itemType === 'slider';
            const imgUrl = isSlider ? it.afterImage || it.afterImg : it.gridImage || it.image || it.img;
            const title = it.title || it.name;
            const isTargetDeleting = isDeleting && deleteTarget?.id === it.id;

            return (
              <div
                className={`admin-item-card ${isTargetDeleting ? 'card-deleting' : ''}`}
                key={it.id}
                style={{
                  position: 'relative',
                  opacity: isTargetDeleting ? 0.4 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <div className="item-card-media">
                  <img src={imgUrl} alt={title} loading="lazy" />
                  <span className={`item-type-badge ${isSlider ? 'badge-slider' : 'badge-thumb'}`}>
                    {isSlider ? <Sliders size={12} /> : <ImageIcon size={12} />}
                    <span>{isSlider ? 'Before/After Slider' : 'Thumbnail'}</span>
                  </span>
                </div>

                <div className="item-card-info">
                  <div className="item-card-meta">
                    <span className="item-cat-tag">{it.subcat || it.category || 'Portfolio'}</span>
                    {it.id && <span className="item-id-tag">#{it.id}</span>}
                  </div>
                  <h4 className="item-card-title" title={title}>
                    {title}
                  </h4>
                  {it.subtitle && <p className="item-card-sub">{it.subtitle}</p>}

                  <div className="item-card-footer">
                    <button
                      type="button"
                      className="delete-item-btn"
                      disabled={isDeleting}
                      onClick={() => {
                        setDeleteError(null);
                        setDeleteProgress('');
                        setDeleteTarget(it);
                      }}
                      aria-label={`Delete ${title}`}
                      title="Delete item permanently from GitHub"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="modal-backdrop admin-modal-backdrop"
          onClick={() => !isDeleting && setDeleteTarget(null)}
        >
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <Tape position="tl" />
            <div className="modal-icon-alert">
              <AlertTriangle size={32} />
            </div>

            <h3 className="modal-alert-title">
              Delete "{deleteTarget.title || deleteTarget.name}"?
            </h3>

            {/* Target Item Details Preview */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                background: '#0b1120',
                border: '1px solid #1e293b',
                padding: '10px',
                borderRadius: '6px',
                margin: '12px 0',
              }}
            >
              <img
                src={
                  deleteTarget.itemType === 'slider'
                    ? deleteTarget.afterImage || deleteTarget.afterImg
                    : deleteTarget.gridImage || deleteTarget.image || deleteTarget.img
                }
                alt="Delete preview"
                style={{
                  width: '80px',
                  height: '45px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid #334155',
                }}
              />
              <div style={{ fontSize: '12px', textAlign: 'left', overflow: 'hidden' }}>
                <strong style={{ display: 'block', color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {deleteTarget.title || deleteTarget.name}
                </strong>
                <span style={{ color: '#94a3b8' }}>
                  ID: <code style={{ color: '#38bdf8' }}>{deleteTarget.id}</code> • Type: {deleteTarget.itemType}
                </span>
              </div>
            </div>

            <p className="modal-alert-desc">
              This action will remove the portfolio entry and delete its image files directly from the
              GitHub <strong>main</strong> branch, followed by an automatic live production redeployment.
            </p>

            {/* Live Progress Indicator */}
            {isDeleting && (
              <div
                style={{
                  background: '#1e293b',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  margin: '12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#38bdf8',
                  fontSize: '13px',
                }}
              >
                <RefreshCw size={15} className="spin" />
                <span>{deleteProgress || 'Processing deletion in GitHub...'}</span>
              </div>
            )}

            {deleteError && (
              <div className="admin-alert admin-alert--error" style={{ margin: '12px 0' }}>
                <AlertCircle size={16} />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="modal-alert-actions">
              <button
                type="button"
                className="paper-btn admin-cancel-btn"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="paper-btn admin-danger-btn"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting from GitHub...' : 'Yes, Delete from Portfolio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

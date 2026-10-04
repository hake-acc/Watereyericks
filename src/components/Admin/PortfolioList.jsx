import React, { useState } from 'react';
import { Trash2, AlertTriangle, Layers, Sliders, Image as ImageIcon, Search, CheckCircle, AlertCircle } from 'lucide-react';
import Tape from '../Tape.jsx';

export default function PortfolioList({ portfolio, onDeleted }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'thumbnail' | 'slider'
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  const thumbnails = portfolio?.thumbnails || [];
  const comparisons = portfolio?.comparisons || [];

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
      return matchTitle || matchCat;
    }
    return true;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const resp = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: deleteTarget.id,
          type: deleteTarget.itemType,
        }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to delete item.');
      }

      setDeleteSuccess(`"${deleteTarget.title || deleteTarget.name}" deleted from GitHub and live deployment triggered.`);
      setDeleteTarget(null);
      if (onDeleted) onDeleted(deleteTarget.id);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-portfolio-section">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Current Portfolio Content</h2>
          <p className="admin-section-sub">
            {thumbnails.length} normal thumbnails and {comparisons.length} comparison sliders stored in GitHub.
          </p>
        </div>

        {/* Filters */}
        <div className="admin-filter-bar">
          <div className="search-wrap">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search by title..."
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
      </div>

      {deleteSuccess && (
        <div className="admin-alert admin-alert--success">
          <CheckCircle size={18} />
          <span>{deleteSuccess}</span>
        </div>
      )}

      {/* Grid */}
      <div className="admin-items-grid">
        {filteredItems.map((it) => {
          const isSlider = it.itemType === 'slider';
          const imgUrl = isSlider ? it.afterImage || it.afterImg : it.image || it.img;
          const title = it.title || it.name;

          return (
            <div className="admin-item-card" key={it.id}>
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
                <h4 className="item-card-title" title={title}>{title}</h4>
                {it.subtitle && <p className="item-card-sub">{it.subtitle}</p>}

                <div className="item-card-footer">
                  <button
                    type="button"
                    className="delete-item-btn"
                    onClick={() => {
                      setDeleteError(null);
                      setDeleteTarget(it);
                    }}
                    aria-label={`Delete ${title}`}
                    title="Delete item"
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-backdrop admin-modal-backdrop" onClick={() => !isDeleting && setDeleteTarget(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <Tape position="tl" />
            <div className="modal-icon-alert">
              <AlertTriangle size={32} />
            </div>

            <h3 className="modal-alert-title">
              Delete "{deleteTarget.title || deleteTarget.name}"?
            </h3>
            <p className="modal-alert-desc">
              This action will remove the portfolio record and associated image asset(s) directly from the
              GitHub <strong>main</strong> branch and automatically trigger a Vercel production redeployment.
            </p>

            {deleteError && (
              <div className="admin-alert admin-alert--error">
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

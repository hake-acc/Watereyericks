import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Sparkles } from 'lucide-react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';
import BeforeAfterSection from './ComparisonSlider.jsx';

import portfolioData from '../data/portfolio.json';

// Version-controlled Portfolio Thumbnails by Water Eye
const THUMBNAILS = portfolioData.thumbnails || [];

const CATEGORIES = ['All', 'Minecraft', 'Cobblemon', 'Boss Battles', 'SMP & Adventure', '3D & Cinema 4D'];

export default function ThumbnailGallery() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [activeModal, setActiveModal] = useState(null);

  const filtered = useMemo(() => {
    // Exclude featured thumbnail from the grid on 'All' view since it is already showcased above
    if (selectedCat === 'All') return THUMBNAILS.filter((t) => !t.featured);
    if (selectedCat === 'Minecraft') return THUMBNAILS.filter((t) => t.category === 'Minecraft');
    if (selectedCat === 'Cobblemon') return THUMBNAILS.filter((t) => t.subcat === 'Cobblemon');
    if (selectedCat === 'Boss Battles') return THUMBNAILS.filter((t) => t.subcat === 'Boss Battles');
    if (selectedCat === 'SMP & Adventure') return THUMBNAILS.filter((t) => t.subcat === 'SMP & Adventure');
    if (selectedCat === '3D & Cinema 4D') return THUMBNAILS.filter((t) => t.category === '3D & Cinema 4D' || t.subcat === '3D & Cinema 4D');
    return THUMBNAILS.filter((t) => t.category === selectedCat || t.subcat === selectedCat);
  }, [selectedCat]);

  const featured = useMemo(() => THUMBNAILS.find((t) => t.featured), []);

  const getCatCount = useCallback((cat) => {
    if (cat === 'All') return THUMBNAILS.length;
    if (cat === 'Minecraft') return THUMBNAILS.filter((t) => t.category === 'Minecraft').length;
    if (cat === 'Cobblemon') return THUMBNAILS.filter((t) => t.subcat === 'Cobblemon').length;
    if (cat === 'Boss Battles') return THUMBNAILS.filter((t) => t.subcat === 'Boss Battles').length;
    if (cat === 'SMP & Adventure') return THUMBNAILS.filter((t) => t.subcat === 'SMP & Adventure').length;
    if (cat === '3D & Cinema 4D') return THUMBNAILS.filter((t) => t.category === '3D & Cinema 4D' || t.subcat === '3D & Cinema 4D').length;
    return THUMBNAILS.filter((t) => t.category === cat || t.subcat === cat).length;
  }, []);

  const handleOpenModal = useCallback((thumb) => {
    setActiveModal(thumb);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Keyboard accessibility: Close modal on Escape key
  React.useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, handleCloseModal]);

  return (
    <section id="work" className="section work-section">
      <div className="section-title">
        <span className="section-num">02</span>
        <div>
          <h2 className="section-name">Selected Thumbnails</h2>
          <p className="section-subtitle">
            Every thumbnail is built from scratch in Photoshop, Cinema 4D, and Blender —
            engineered to stand out in YouTube home and suggested feeds.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="category-filter-wrap" role="tablist" aria-label="Thumbnail categories">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCat === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              className={`cat-pill ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
              <span className="cat-count">{getCatCount(cat)}</span>
            </button>
          );
        })}
      </div>

      {/* Featured Large Showcase (Only shown on 'All') */}
      {selectedCat === 'All' && featured && (
        <div className="featured-showcase-wrap">
          <Tape position="tr" />
          <div className="featured-badge">
            <Sparkles size={14} /> FEATURED SHOWCASE
          </div>
          <div
            className="featured-showcase-card"
            onClick={() => handleOpenModal(featured)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOpenModal(featured)}
            aria-label={`View full preview of ${featured.title}`}
          >
            <div className="featured-showcase-media">
              <img
                src={featured.image || featured.img}
                alt={featured.title || featured.name}
                loading="eager"
                className="featured-showcase-img"
              />
              <div className="showcase-hover-overlay">
                <span className="showcase-zoom-btn">
                  <Maximize2 size={16} /> Click to Inspect 4K Quality
                </span>
              </div>
            </div>
            <div className="featured-showcase-info">
              <div className="showcase-tags">
                <span className="chip-category">{featured.category}</span>
                {(featured.tools || []).map((t) => (
                  <span className="chip-tool" key={t}>{t}</span>
                ))}
              </div>
              <h3 className="featured-showcase-title">{featured.title || featured.name}</h3>
              <p className="featured-showcase-desc">{featured.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Thumbnail Grid */}
      <div className="thumbnail-grid">
        {filtered.map((item, idx) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
            className="thumb-card"
            onClick={() => handleOpenModal(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOpenModal(item)}
            aria-label={`Inspect ${item.title || item.name}`}
          >
            <Tape position={idx % 2 === 0 ? 'tl' : 'tr'} />
            
            <div className="thumb-media-wrap">
              <img
                src={item.image || item.img}
                alt={`${item.title || item.name} — YouTube Thumbnail by Water Eye`}
                loading="lazy"
                className="thumb-img"
              />
              <div className="thumb-overlay">
                <span className="thumb-zoom-icon">
                  <Maximize2 size={16} />
                </span>
              </div>
            </div>

            <div className="thumb-details">
              <div className="thumb-meta-row">
                <span className="thumb-category-tag">{item.subcat || item.category}</span>
                <div className="thumb-tools">
                  {(item.tools || []).map((t) => (
                    <span key={t} className="thumb-tool-tag">{t}</span>
                  ))}
                </div>
              </div>
              <h3 className="thumb-card-title">{item.title || item.name}</h3>
              <p className="thumb-card-sub">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Before & After Thumbnail Comparison Subsection */}
      <BeforeAfterSection />

      {/* Lightbox Inspection Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="modal-panel"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="modal-cat">{activeModal.subcat || activeModal.category}</span>
                  <h3 className="modal-title">{activeModal.title || activeModal.name}</h3>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={handleCloseModal}
                  aria-label="Close preview modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-image-wrap">
                <img
                  src={activeModal.image || activeModal.img}
                  alt={activeModal.title || activeModal.name}
                  className="modal-full-img"
                />
              </div>

              <div className="modal-footer">
                <div className="modal-tools">
                  <span className="modal-label">Software:</span>
                  {(activeModal.tools || []).map((t) => (
                    <span key={t} className="tech-chip">{t}</span>
                  ))}
                </div>
                <div className="modal-sub">{activeModal.subtitle}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Doodle kind="sparkle" size={28} style={{ top: 25, right: 30, color: 'var(--purple)' }} />
    </section>
  );
}

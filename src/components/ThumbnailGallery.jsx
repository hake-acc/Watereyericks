import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Sparkles, Filter, Layers, ExternalLink } from 'lucide-react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';

// Actual thumbnails from Water Eye's work
const THUMBNAILS = [
  {
    id: 'we-1',
    title: 'Best Pack? Sharpness 500K',
    subtitle: 'Cinema 4D Render & Dynamic Lighting',
    category: 'Minecraft',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/Watereye-1.webp',
    featured: true,
  },
  {
    id: 'we-2',
    title: 'WASD Movement & Controls Guide',
    subtitle: '3D Character Posing with Vivid Chroma Glow',
    category: 'Minecraft',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/Watereye (2).png',
    featured: true,
  },
  {
    id: 'we-kitkat',
    title: 'KitKat 4K Extreme Speedrun',
    subtitle: 'Ultra High-Res Action Composition',
    category: 'Gaming',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/kitkat.webp',
    featured: true,
  },
  {
    id: 'we-livinglegend',
    title: 'LivingLegend Revamp Texture Pack',
    subtitle: 'Brand Texture Showcase with Cinematic Depth',
    category: 'Minecraft',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/1945ad233122041.6a4b6ab3c6f5c.jpg',
  },
  {
    id: 'we-anchorcloud',
    title: 'AnchorCloud 24/7 Hosting',
    subtitle: 'Commercial Cloud Hosting Campaign',
    category: 'Brand & Packs',
    tools: ['Photoshop', '3D Modeling'],
    img: '/samples/24a4df233122041.6a4b672b40ac7.png',
  },
  {
    id: 'we-rank1',
    title: 'Rank 1 Gladiator PvP Montage',
    subtitle: 'High-Contrast Arena Highlight',
    category: 'Gaming',
    tools: ['Photoshop', 'Color Grading'],
    img: '/samples/Watereye-2.webp',
  },
  {
    id: 'we-netherite',
    title: 'Netherite Armor Master Build',
    subtitle: 'Dramatic Dark Atmospheric Lighting',
    category: 'Minecraft',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/05fa45233122041.69c780c5aab84.png',
  },
  {
    id: 'we-c4d-anim',
    title: 'Cinema 4D Character Animation',
    subtitle: 'Full 3D Character Rigging & Camera Depth',
    category: '3D & Cinema 4D',
    tools: ['Cinema 4D', 'Photoshop'],
    img: '/samples/6f787a233122041.6a4b672b41247.png',
  },
  {
    id: 'we-senpai',
    title: 'SenpaiSpider Custom Review',
    subtitle: 'Bold Red Glow & Dramatic Text Hierarchy',
    category: 'Gaming',
    tools: ['Photoshop', 'Typography'],
    img: '/samples/1a60ae233122041.69c780c5ab473.png',
  },
  {
    id: 'we-c4d-light',
    title: 'Cinema 4D Studio Lighting Setup',
    subtitle: 'Volumetric Rays & Custom Shaders',
    category: '3D & Cinema 4D',
    tools: ['Cinema 4D', 'Octane'],
    img: '/samples/dfd2ec233122041.6a4b672baf967.png',
  },
  {
    id: 'we-bedwars-pack',
    title: 'Best Texture Packs for Bedwars',
    subtitle: 'Vibrant Split Screen Contrast',
    category: 'Minecraft',
    tools: ['Photoshop', 'Asset Compositing'],
    img: '/samples/95f711233122041.6a4b6ab3c738d.png',
  },
  {
    id: 'we-tournament',
    title: 'The $10,000 Tournament Clutch',
    subtitle: 'High Energy Competitive Esports Visual',
    category: 'Gaming',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/dacd91233122041.6a4b6ab3c77ec.jpg',
  },
  {
    id: 'we-parkour',
    title: 'Extreme Parkour Speedrun Record',
    subtitle: 'Motion Blur & Perspective Distortion',
    category: 'Minecraft',
    tools: ['Photoshop', 'Blender'],
    img: '/samples/2b856e233122041.69d7fc783d085.png',
  },
  {
    id: 'we-hardcore',
    title: 'Hardcore 100 Days Survival',
    subtitle: 'Cinematic Storytelling Scene',
    category: 'Minecraft',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/5262e3233122041.69d7fc783ddad.png',
  },
  {
    id: 'we-secrets',
    title: 'Top 10 Secret Combat Mechanics',
    subtitle: 'Intrigue & Mystery Hook Design',
    category: 'Gaming',
    tools: ['Photoshop', 'Visual FX'],
    img: '/samples/Watereye-3.webp',
  },
  {
    id: 'we-pro-movement',
    title: 'Pro Movement & Keyboard Secrets',
    subtitle: 'Keyboard Overlay & Motion Tracking',
    category: 'Gaming',
    tools: ['Photoshop', 'Typography'],
    img: '/samples/9bc4d2233122041.68fda9e967b6d.jpg',
  },
  {
    id: 'we-ranked-bedwars',
    title: 'Ranked Bedwars Season Finale',
    subtitle: 'Climactic Lighting & Epic Color Palette',
    category: 'Gaming',
    tools: ['Photoshop', 'Color Grading'],
    img: '/samples/d22e61233122041.6a4b672c22527.jpg',
  },
  {
    id: 'we-end-series',
    title: 'Survival Series: The Final Dragon',
    subtitle: 'Atmospheric Fog & Particle Rendering',
    category: 'Minecraft',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/19b45d233122041.6a4b672baf324.png',
  },
  {
    id: 'we-pvp-tricks',
    title: 'Secret PvP Tricks You Never Knew',
    subtitle: 'High CTR Curiosity Composition',
    category: 'Gaming',
    tools: ['Photoshop', 'Lighting'],
    img: '/samples/e8034a233122041.6a4b672c220c3.jpg',
  },
  {
    id: 'we-live-stream',
    title: 'Minecraft Championship Live',
    subtitle: 'Streaming Banner & Broadcast Visual',
    category: 'Brand & Packs',
    tools: ['Photoshop', 'Cinema 4D'],
    img: '/samples/f4043e233122041.693da2adbafb9.jpg',
  },
];

const CATEGORIES = ['All', 'Minecraft', 'Gaming', '3D & Cinema 4D', 'Brand & Packs'];

export default function ThumbnailGallery() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [activeModal, setActiveModal] = useState(null);

  const filtered = useMemo(() => {
    if (selectedCat === 'All') return THUMBNAILS;
    return THUMBNAILS.filter((t) => t.category === selectedCat);
  }, [selectedCat]);

  const featured = useMemo(() => THUMBNAILS.find((t) => t.featured), []);

  const handleOpenModal = useCallback((thumb) => {
    setActiveModal(thumb);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

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
              {cat === 'All' && <span className="cat-count">{THUMBNAILS.length}</span>}
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
                src={featured.img}
                alt={featured.title}
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
                {featured.tools.map((t) => (
                  <span className="chip-tool" key={t}>{t}</span>
                ))}
              </div>
              <h3 className="featured-showcase-title">{featured.title}</h3>
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
            aria-label={`Inspect ${item.title}`}
          >
            <Tape position={idx % 2 === 0 ? 'tl' : 'tr'} />
            
            <div className="thumb-media-wrap">
              <img
                src={item.img}
                alt={`${item.title} — YouTube Thumbnail by Water Eye`}
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
                <span className="thumb-category-tag">{item.category}</span>
                <div className="thumb-tools">
                  {item.tools.map((t) => (
                    <span key={t} className="thumb-tool-tag">{t}</span>
                  ))}
                </div>
              </div>
              <h3 className="thumb-card-title">{item.title}</h3>
              <p className="thumb-card-sub">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

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
                  <span className="modal-cat">{activeModal.category}</span>
                  <h3 className="modal-title">{activeModal.title}</h3>
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
                  src={activeModal.img}
                  alt={activeModal.title}
                  className="modal-full-img"
                />
              </div>

              <div className="modal-footer">
                <div className="modal-tools">
                  <span className="modal-label">Software:</span>
                  {activeModal.tools.map((t) => (
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

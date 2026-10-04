import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Eye, Youtube, Sparkles, Quote } from 'lucide-react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';

const CREATORS = [
  {
    name: 'Robbie XYZ',
    handle: '@robbietonfr',
    platform: 'YouTube',
    avgViews: '18K Views',
    rating: 5.0,
    quote: 'Delivered exactly what I needed — first draft, no back-and-forth.',
    avatar: '/avatars/robbietonfr.jpg',
    category: 'Gaming',
  },
  {
    name: 'Mitsuha Gaming',
    handle: '@Mitsuha_Gaming',
    platform: 'YouTube',
    avgViews: '22K Views',
    rating: 5.0,
    quote: 'The thumbnail actually got more clicks than the video deserved.',
    avatar: '/avatars/mitsuha_gaming.jpg',
    category: 'Gaming',
  },
  {
    name: 'Aadmi Infinity',
    handle: '@AadmiPlays',
    platform: 'YouTube',
    avgViews: '31K Views',
    rating: 5.0,
    quote: 'Came back for a second batch — that says everything.',
    avatar: '/avatars/aadmiplays.jpg',
    category: 'Entertainment',
  },
  {
    name: 'DeadLegend',
    handle: '@LivingLegendOP',
    platform: 'YouTube',
    avgViews: '9K Views',
    rating: 4.9,
    quote: 'Clean style, fast delivery, understood the vibe immediately.',
    avatar: '/avatars/livinglegendop.jpg',
    category: 'Gaming',
  },
  {
    name: 'MC ThunderPlayz',
    handle: '@MCThunderXDOfficial',
    platform: 'YouTube',
    avgViews: '7K Views',
    rating: 4.9,
    quote: 'The 3D treatment on the Minecraft thumbnails was fire.',
    avatar: '/avatars/mcthunderxd.jpg',
    category: 'Minecraft',
  },
  {
    name: 'PYES KING',
    handle: '@PYES_KING',
    platform: 'YouTube',
    avgViews: '25K Views',
    rating: 4.9,
    quote: 'Consistent quality across every single thumbnail. Very reliable.',
    avatar: '/avatars/pyes_king.jpg',
    category: 'Entertainment',
  },
  {
    name: 'ItzNect4r',
    handle: '@ItzNect4r',
    platform: 'YouTube',
    avgViews: '12K Views',
    rating: 4.8,
    quote: 'First draft was almost perfect. Minor tweaks and it was done.',
    avatar: '/avatars/itznect4r.jpg',
    category: 'Minecraft',
  },
  {
    name: 'Real Ayaz',
    handle: '@Real_Ayaz',
    platform: 'YouTube',
    avgViews: '6K Views',
    rating: 4.8,
    quote: 'Knew exactly what to do without too many references.',
    avatar: '/avatars/real_ayaz.jpg',
    category: 'Shorts',
  },
];

export default function Creators() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? CREATORS
    : CREATORS.filter(c => c.category === filter);

  return (
    <section id="creators" className="section creators-section">
      <div className="section-title">
        <span className="section-num">03</span>
        <div>
          <h2 className="section-name">Creators Worked With</h2>
          <p className="section-subtitle">
            Trusted by creators across gaming, Minecraft, and entertainment for channel thumbnails.
          </p>
        </div>
      </div>

      <div className="creators-filter-row">
        {['All', 'Gaming', 'Minecraft', 'Entertainment', 'Shorts'].map((cat) => (
          <button
            key={cat}
            className={`creator-tab ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of 2-Layer Atmospheric Creator Cards */}
      <div className="creators-grid">
        {filtered.map((creator, i) => (
          <div className="atmospheric-creator-card" key={creator.name}>
            <Tape position={i % 2 === 0 ? 'tl' : 'tr'} />

            {/* Reconstructed Two-Layer Atmospheric Background System */}
            <div className="card-background" aria-hidden="true">
              <div className="upper-atmosphere" />
              <div className="transition-glow" />
              <div className="lower-atmosphere" />
            </div>

            {/* Creator Card Content */}
            <div className="creator-card-inner">
              {/* Avatar crossing the atmospheric transition line */}
              <div className="creator-avatar-wrap">
                <div className="creator-avatar-ring">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="creator-avatar-img"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="creator-avatar-fallback">
                    {creator.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Lower Surface Info */}
              <div className="creator-info-zone">
                <div className="creator-name-row">
                  <h3 className="creator-name">{creator.name}</h3>
                </div>
                
                <span className="creator-handle">{creator.handle}</span>

                <div className="creator-meta-pill">
                  <span className="platform-tag">
                    <Youtube size={12} /> {creator.platform}
                  </span>
                  <span className="meta-dot">●</span>
                  <span className="views-tag">{creator.avgViews}</span>
                </div>

                <div className="creator-quote-box">
                  <Quote size={14} className="quote-icon" />
                  <p className="creator-quote">{creator.quote}</p>
                </div>

                <div className="creator-rating-row">
                  <div className="stars">
                    {[...Array(5)].map((_, s) => (
                      <Star
                        key={s}
                        size={12}
                        className={s < Math.floor(creator.rating) ? 'star-filled' : 'star-half'}
                      />
                    ))}
                  </div>
                  <span className="rating-num">{creator.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Doodle kind="sparkle" size={24} style={{ top: 30, right: 30, color: 'var(--purple)' }} />
    </section>
  );
}

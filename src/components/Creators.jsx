import React from 'react';
import { Youtube, ExternalLink } from 'lucide-react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';

import creatorsData from '../data/creators.json';

// Auto-arranged by subscriber count descending
const CREATORS = (creatorsData.creators || [])
  .slice()
  .sort((a, b) => (b.subscribersCount || 0) - (a.subscribersCount || 0));

export default function Creators() {
  // Proactively warm up creator avatar cache during idle browser time
  React.useEffect(() => {
    const warmAvatarCache = () => {
      CREATORS.forEach((creator) => {
        const img = new Image();
        img.src = creator.avatar;
      });
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(warmAvatarCache, { timeout: 2000 });
      } else {
        setTimeout(warmAvatarCache, 800);
      }
    }
  }, []);

  return (
    <section id="creators" className="section creators-section">
      <div className="section-title">
        <span className="section-num">03</span>
        <div>
          <h2 className="section-name">Creators Worked With</h2>
          <p className="section-subtitle">
            Trusted by YouTube creators and channels for high-CTR thumbnails and visual branding.
          </p>
        </div>
      </div>

      {/* Grid of 2-Layer Atmospheric Creator Cards */}
      <div className="creators-grid">
        {CREATORS.map((creator, i) => (
          <div className="atmospheric-creator-card" key={creator.id}>
            <Tape position={i % 2 === 0 ? 'tl' : 'tr'} />

            {/* Reconstructed Two-Layer Atmospheric Background System */}
            <div className="card-background" aria-hidden="true">
              <div className="upper-atmosphere" />
              <div className="transition-glow" />
              <div className="lower-atmosphere" />
            </div>

            {/* Creator Card Content */}
            <div className="creator-card-inner">
              {/* Channel Icon crossing the atmospheric transition line */}
              <div className="creator-avatar-wrap">
                <div className="creator-avatar-ring">
                  <img
                    src={creator.avatar}
                    alt={`${creator.name} channel icon`}
                    className="creator-avatar-img"
                    width="74"
                    height="74"
                    loading={i < 6 ? 'eager' : 'lazy'}
                    fetchPriority={i < 3 ? 'high' : 'auto'}
                    decoding="async"
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
                <h3 className="creator-name">{creator.name}</h3>
                <span className="creator-handle">{creator.handle}</span>

                <div className="creator-subs-badge">
                  <Youtube size={13} className="subs-yt-icon" />
                  <span>{creator.subscribers} Subscribers</span>
                </div>

                <a
                  href={creator.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="creator-channel-btn"
                  aria-label={`Visit ${creator.name} YouTube Channel (opens in a new tab)`}
                >
                  <span>Channel</span>
                  <ExternalLink size={12} className="btn-arrow" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Doodle kind="sparkle" size={24} style={{ top: 30, right: 30, color: 'var(--purple)' }} />
    </section>
  );
}

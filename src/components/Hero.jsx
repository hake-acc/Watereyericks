import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, MapPin, Mail, Youtube, ExternalLink,
  Flame, Zap, Clock
} from 'lucide-react';

export default function Hero({ onNavigate }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <section id="home" className="hero">
      {/* Background ambient lighting */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg-glow" />
        <div className="hero-bg-grid" />
      </div>

      <div className="hero-inner">
        {/* ============ LEFT ============ */}
        <div className="hero-left">
          {/* TOP zone */}
          <div className="hero-top">
            <motion.div
              className="id-card"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div className="id-avatar">WE</div>
              <div className="id-body">
                <div className="id-name">
                  Water Eye
                  <span className="id-verified" title="Verified Creator">●</span>
                </div>
                <div className="id-meta">
                  <span>YouTube Thumbnail Designer</span>
                  <span className="id-dot" />
                  <span className="id-loc"><MapPin size={10} /> India</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="hero-badge-pill"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 }}
            >
              <span className="chip-dot" />
              <span>Available for new YouTube projects</span>
            </motion.div>

            <motion.h1
              className="hero-name"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
            >
              <span>Thumbnails that make people </span>
              <span className="hero-name-accent">stop.</span>
            </motion.h1>

            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              Crafted in Photoshop, Cinema 4D & Blender.
            </motion.p>

            <motion.p
              className="hero-desc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              Water Eye creates high-impact, scroll-stopping YouTube thumbnails designed to
              maximize your click-through rate. Custom 3D character renders, cinematic lighting,
              and aggressive visual hierarchy that commands attention in competitive feeds.
            </motion.p>
          </div>

          {/* BOTTOM zone */}
          <div className="hero-bottom">
            <motion.div
              className="hero-toolbar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <button
                className="paper-btn paper-btn--filled"
                onClick={() => onNavigate('work')}
                aria-label="View thumbnail portfolio"
              >
                Explore Work <ArrowRight size={14} />
              </button>
              <button
                className="paper-btn"
                onClick={() => onNavigate('contact')}
                aria-label="Contact for thumbnail commission"
              >
                Book a Thumbnail <Zap size={14} />
              </button>
              <div className="toolbar-divider" />
              <div className="toolbar-socials">
                <a
                  href="mailto:watereyebusiness@gmail.com"
                  className="social-icon"
                  aria-label="Email Water Eye"
                  title="Email"
                >
                  <Mail size={16} />
                </a>
                <a
                  href="https://youtube.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon"
                  aria-label="Water Eye YouTube"
                  title="YouTube"
                >
                  <Youtube size={16} />
                </a>
              </div>
            </motion.div>

            <motion.div
              className="hero-stack"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="stack-label">Crafted with</span>
              <div className="stack-line" />
              <div className="stack-tags">
                <span>Adobe Photoshop</span>
                <span>Cinema 4D</span>
                <span>Blender 3D</span>
                <span>After Effects</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ============ RIGHT — Portrait with Floating Thumbnail Showcase ============ */}
        <div className="hero-right">
          <div className="portrait">
            <div className="portrait-halo" aria-hidden="true" />

            {/* Status chip */}
            <motion.div
              className="portrait-chip"
              initial={{ opacity: 0, y: -10, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <span className="chip-dot" />
              <span>Fast 24–48h Turnaround</span>
            </motion.div>

            {/* Central Water Eye Avatar */}
            <motion.div
              className="portrait-image"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            >
              {imgOk ? (
                <div className="portrait-avatar-wrapper">
                  <motion.img
                    src="/images/watereye-avatar.png"
                    alt="Water Eye — YouTube Thumbnail Designer"
                    onError={() => setImgOk(false)}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="portrait-avatar-img"
                  />
                  <div className="portrait-avatar-ring" aria-hidden="true" />
                </div>
              ) : (
                <div className="portrait-fallback">WE</div>
              )}
            </motion.div>

            {/* Floating Thumbnail Card 1 — Top Right */}
            <motion.div
              className="hero-float-card hero-float-card--top"
              initial={{ opacity: 0, x: 25, y: -15, rotate: 6 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 4 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              onClick={() => onNavigate('work')}
            >
              <img
                src="/samples/sample-19-primal-groudon.webp"
                alt="100 Days Cobblemon Primal Groudon Thumbnail Preview"
                loading="eager"
              />
              <span className="hero-float-label">PRIMAL GROUDON</span>
            </motion.div>

            {/* Floating Thumbnail Card 2 — Bottom Left */}
            <motion.div
              className="hero-float-card hero-float-card--bottom"
              initial={{ opacity: 0, x: -25, y: 15, rotate: -6 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: -5 }}
              transition={{ delay: 0.95, duration: 0.6 }}
              onClick={() => onNavigate('work')}
            >
              <img
                src="/samples/sample-06-diamond-legion-wither-storm.webp"
                alt="Diamond Legion vs Wither Storm Thumbnail Preview"
                loading="eager"
              />
              <span className="hero-float-label">WITHER STORM</span>
            </motion.div>

            {/* Turnaround Badge */}
            <motion.div
              className="portrait-badge"
              initial={{ opacity: 0, y: 20, rotate: 6 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ delay: 0.85 }}
            >
              <div className="badge-num">24<span>h</span></div>
              <div className="badge-lbl">Fast<br/>delivery</div>
            </motion.div>

            {/* Quality Badge */}
            <motion.div
              className="portrait-badge portrait-badge--alt"
              initial={{ opacity: 0, y: 20, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: -4 }}
              transition={{ delay: 0.95 }}
            >
              <div className="badge-num">100<span>%</span></div>
              <div className="badge-lbl">PSD<br/>source</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
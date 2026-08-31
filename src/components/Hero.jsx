import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Github, Linkedin, Mail, Instagram, ArrowRight, Download,
  MapPin,
} from 'lucide-react';

export default function Hero({ onNavigate }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <section id="home" className="hero">
      {/* Premium background */}
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
              <div className="id-avatar">MK</div>
              <div className="id-body">
                <div className="id-name">
                  Manish Kumar
                  <span className="id-verified">●</span>
                </div>
                <div className="id-meta">
                  <span>Full Stack Developer</span>
                  <span className="id-dot" />
                  <span className="id-loc"><MapPin size={10} /> Delhi</span>
                </div>
              </div>
            </motion.div>

            <motion.p
              className="hero-hello"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              Hi there — I'm
            </motion.p>

            <motion.h1
              className="hero-name"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
            >
              <span className="hero-name-word">Manish.</span>
            </motion.h1>

            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              I build things for the web.
            </motion.p>

            <motion.p
              className="hero-desc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              Computer Science student at{' '}
              <span className="hl-purple">NSUT, Delhi</span> with a strong
              foundation in <span className="hl-mint">DSA</span>. Passionate
              about full-stack development and shipping real-world solutions.
            </motion.p>
          </div>

          {/* BOTTOM zone — anchored to bottom */}
          <div className="hero-bottom">
            <motion.div
              className="hero-toolbar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <button className="paper-btn paper-btn--filled" onClick={() => onNavigate('contact')}>
                Contact me <ArrowRight size={14} />
              </button>
              <a href="/resume.pdf" className="paper-btn" download>
                Resume <Download size={14} />
              </a>
              <div className="toolbar-divider" />
              <div className="toolbar-socials">
                <a href="https://github.com/" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub"><Github size={16} /></a>
                <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn"><Linkedin size={16} /></a>
                <a href="mailto:manishkr28092003@gmail.com" className="social-icon" aria-label="Email"><Mail size={16} /></a>
                <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram"><Instagram size={16} /></a>
              </div>
            </motion.div>

            <motion.div
              className="hero-stack"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="stack-label">Currently working with</span>
              <div className="stack-line" />
              <div className="stack-tags">
                <span>React</span>
                <span>Next.js</span>
                <span>Node</span>
                <span>MongoDB</span>
                <span>C++</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ============ RIGHT — big portrait, floating chips ============ */}
        <div className="hero-right">
          <div className="portrait">
            <div className="portrait-halo" aria-hidden="true" />

            {/* Available chip — top */}
            <motion.div
              className="portrait-chip"
              initial={{ opacity: 0, y: -10, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: -4 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <span className="chip-dot" />
              <span>Available for work</span>
            </motion.div>

            {/* THE cartoon — huge, free-floating */}
            <motion.div
              className="portrait-image"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            >
              {imgOk ? (
                <motion.img
                  src="/images/manish-cartoon.png"
                  alt="Manish Kumar"
                  onError={() => setImgOk(false)}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              ) : (
                <div className="portrait-fallback">MK</div>
              )}
            </motion.div>

            {/* Stats badge — bottom right */}
            <motion.div
              className="portrait-badge"
              initial={{ opacity: 0, y: 20, rotate: 6 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ delay: 0.85 }}
            >
              <div className="badge-num">3<span>+</span></div>
              <div className="badge-lbl">Years<br/>coding</div>
            </motion.div>

            {/* Stats badge — bottom left */}
            <motion.div
              className="portrait-badge portrait-badge--alt"
              initial={{ opacity: 0, y: 20, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: -5 }}
              transition={{ delay: 0.95 }}
            >
              <div className="badge-num">500<span>+</span></div>
              <div className="badge-lbl">DSA<br/>solved</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
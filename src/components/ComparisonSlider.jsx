import React, { useState, useRef, useCallback } from 'react';
import { Sliders, Sparkles } from 'lucide-react';
import Tape from './Tape.jsx';

import portfolioData from '../data/portfolio.json';

export const COMPARISONS = portfolioData.comparisons || [];

function SingleComparison({ item, idx }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleSliderChange = useCallback((e) => {
    setSliderPos(Number(e.target.value));
  }, []);

  return (
    <div className="comparison-card">
      <Tape position={idx % 2 === 0 ? 'tl' : 'tr'} />
      <div className="comparison-media-wrap">
        {/* AFTER — Full Background */}
        <img
          src={item.afterImage || item.afterImg}
          alt={`${item.title || item.name} — After Polish`}
          className="comparison-img comparison-img--after"
          loading="lazy"
        />

        {/* BEFORE — Clipped on Top */}
        <div
          className="comparison-clip"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={item.beforeImage || item.beforeImg}
            alt={`${item.title || item.name} — Before Draft`}
            className="comparison-img comparison-img--before"
            loading="lazy"
          />
        </div>

        {/* Divider Line & Handle */}
        <div
          className="comparison-divider"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="comparison-handle" aria-hidden="true">
            <span className="comparison-arrows">⟨ ⟩</span>
          </div>
        </div>

        {/* Floating Labels */}
        <span className="comparison-badge comparison-badge--before">BEFORE</span>
        <span className="comparison-badge comparison-badge--after">AFTER</span>

        {/* Native Range Input for Mouse, Touch & Keyboard Accessibility */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={handleSliderChange}
          aria-label={`Slide to compare before and after for ${item.title}`}
          className="comparison-range-input"
        />
      </div>

      <div className="comparison-info">
        <div className="comparison-meta-row">
          <span className="comparison-tag">Transformation</span>
          <div className="comparison-tools">
            {item.tools.map((t) => (
              <span key={t} className="thumb-tool-tag">{t}</span>
            ))}
          </div>
        </div>
        <h4 className="comparison-title">{item.title}</h4>
        <p className="comparison-desc">{item.description}</p>
        <div className="comparison-footer">
          <span className="comparison-hint">
            <Sliders size={13} /> Drag slider or use arrow keys
          </span>
          <span className="comparison-position">{sliderPos}% Revealed</span>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterSection() {
  return (
    <div className="before-after-section">
      <div className="before-after-header">
        <div className="before-after-tag">
          <Sparkles size={14} /> BEFORE &amp; AFTER
        </div>
        <h3 className="before-after-title">Show the Transformation</h3>
        <p className="before-after-subtitle">
          Interactive comparisons showcasing the progression from initial concept drafts to final, high-CTR thumbnails engineered for maximum feed impact.
        </p>
      </div>

      <div className="before-after-grid">
        {COMPARISONS.map((item, idx) => (
          <SingleComparison key={item.id} item={item} idx={idx} />
        ))}
      </div>
    </div>
  );
}

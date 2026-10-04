import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Palette, Box, Compass, Layers, CheckCircle } from 'lucide-react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Niche & Hook Strategy',
    desc: 'Analyzing your video title, concept, and competitors in the YouTube feed to identify the single most compelling visual hook.',
  },
  {
    step: '02',
    title: '3D Modeling & Lighting',
    desc: 'Creating custom 3D character poses, volumetric atmosphere, and cinematic rim lighting using Cinema 4D and Blender.',
  },
  {
    step: '03',
    title: 'Photoshop Compositing',
    desc: 'Layering textures, color grading, high-contrast shadows, and bold typography crafted for small mobile screens.',
  },
  {
    step: '04',
    title: 'Final Polish & PSD Delivery',
    desc: 'Full-resolution exports in 4K & 1080p, plus cleanly organized PSD source files delivered directly to you.',
  },
];

export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="section-title">
        <span className="section-num">05</span>
        <div>
          <h2 className="section-name">About Water Eye</h2>
          <p className="section-subtitle">
            Indian YouTube Thumbnail Designer specializing in high-CTR visual hooks for digital creators.
          </p>
        </div>
      </div>

      <div className="about-grid">
        {/* Left Column: Portrait & Card */}
        <div className="about-left-card">
          <Tape position="tl" />
          <Tape position="br" />
          
          <div className="about-portrait-wrap">
            <img
              src="/images/watereye-avatar.png"
              alt="Water Eye — Thumbnail Designer"
              className="about-portrait-img"
              loading="lazy"
            />
            <div className="about-portrait-glow" aria-hidden="true" />
          </div>

          <div className="about-badge-row">
            <span className="about-brand-tag">Water Eye</span>
            <span className="about-loc-tag">India</span>
          </div>

          <p className="about-bio">
            "Your thumbnail is the first 10 milliseconds of your video's pitch. If the thumbnail doesn't stop the scroll, nothing else gets seen."
          </p>

          <div className="about-tools-block">
            <span className="about-tools-label">PRIMARY SOFTWARE</span>
            <div className="about-tools-list">
              <span className="tech-chip">Adobe Photoshop</span>
              <span className="tech-chip">Cinema 4D</span>
              <span className="tech-chip">Blender 3D</span>
              <span className="tech-chip">After Effects</span>
            </div>
          </div>
        </div>

        {/* Right Column: Creative Process */}
        <div className="about-right-card">
          <Tape position="tr" />
          <div className="process-header">
            <Compass size={18} className="process-icon" />
            <h3 className="process-heading">How Every Thumbnail Is Built</h3>
          </div>

          <div className="process-timeline">
            {PROCESS_STEPS.map((p) => (
              <div className="process-item" key={p.step}>
                <div className="process-step-num">{p.step}</div>
                <div className="process-content">
                  <h4 className="process-item-title">{p.title}</h4>
                  <p className="process-item-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="about-guarantee">
            <CheckCircle size={18} className="guarantee-icon" />
            <span>
              Every design includes unlimited revisions until you are completely confident to publish.
            </span>
          </div>
        </div>
      </div>

      <Doodle kind="sparkle" size={26} style={{ top: 20, right: 25, color: 'var(--purple)' }} />
    </section>
  );
}

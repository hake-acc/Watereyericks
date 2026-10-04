import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Flame, Layers, Box, Clock, Check, Sparkles } from 'lucide-react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';

const SERVICES = [
  {
    num: '01',
    title: 'YouTube Thumbnail Design',
    desc: 'The core offering. Comprehensive audience and feed analysis before a single asset is placed. Engineered to maximize CTR and earn the click against competing videos.',
    icon: Eye,
    features: ['Custom 16:9 High-Res Output', 'Audience Hook & Feed Optimization', 'Bold Visual Hierarchy', 'Photoshop PSD Included'],
  },
  {
    num: '02',
    title: 'Gaming & 3D Renders',
    desc: 'Custom 3D character poses, volumetric lighting, and dramatic shaders rendered in Cinema 4D and Blender, then composited in Photoshop for maximum punch.',
    icon: Box,
    features: ['Cinema 4D / Blender Renders', 'Custom Character Rigging', 'Vibrant Lighting & Particle FX', 'High-Energy Composition'],
  },
  {
    num: '03',
    title: 'Series & Bulk Packs',
    desc: 'Cohesive thumbnail packs (5 to 20+ designs) for video series, episodic content, and creators posting regularly. Guaranteed turnaround on a dedicated queue.',
    icon: Layers,
    features: ['Consistent Episodic Theme', 'Priority Turnaround Queue', 'Reusable PSD Templates', 'Cost-Effective Volume Rate'],
  },
  {
    num: '04',
    title: 'Channel Visual Branding',
    desc: 'Full channel visual identity alignment. Thumbnail style guides, banner artwork, and complementary graphics that give your channel an unmistakable signature look.',
    icon: Flame,
    features: ['Cohesive Visual Style Guide', 'Channel Banner & Avatar', 'Distinctive Color Harmony', 'Unified Brand Impression'],
  },
];

const PERKS = [
  { label: '24–48h Delivery', desc: 'Fast turnaround so your upload schedule never waits' },
  { label: 'Full .PSD Source', desc: 'Organized layers, smart objects, and original assets included' },
  { label: 'Unlimited Revisions', desc: 'Fine-tuned until you are completely proud to publish' },
  { label: '4K & 1080p Exports', desc: 'Crystal clear resolution optimized for every device' },
];

export default function Services() {
  return (
    <section id="services" className="section services-section">
      <div className="section-title">
        <span className="section-num">04</span>
        <div>
          <h2 className="section-name">Services & Delivery</h2>
          <p className="section-subtitle">
            Focused exclusively on YouTube thumbnail design and visual creator assets.
          </p>
        </div>
      </div>

      <div className="services-grid">
        {SERVICES.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              className="service-card"
              key={s.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Tape position={idx % 2 === 0 ? 'tl' : 'tr'} />
              <div className="service-top">
                <span className="service-num">{s.num}</span>
                <span className="service-icon"><Icon size={20} /></span>
              </div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
              <ul className="service-features">
                {s.features.map((feat) => (
                  <li key={feat}>
                    <Check size={14} className="feature-check" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Perks Banner */}
      <div className="services-perks-box">
        <Tape position="tl" />
        <Tape position="br" />
        <div className="perks-header">
          <Sparkles size={16} />
          <span>INCLUDED WITH EVERY COMMISSSION</span>
        </div>
        <div className="perks-grid">
          {PERKS.map((p) => (
            <div className="perk-cell" key={p.label}>
              <div className="perk-title">{p.label}</div>
              <div className="perk-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <Doodle kind="sparkle" size={26} style={{ top: 30, right: 40, color: 'var(--purple)' }} />
    </section>
  );
}

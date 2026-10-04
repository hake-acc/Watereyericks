import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Layers, Sparkles, Flame } from 'lucide-react';
import Tape from './Tape.jsx';

const facts = [
  { icon: Clock, label: 'Turnaround', value: '24–48 Hours' },
  { icon: Layers, label: 'Source Files', value: 'Full .PSD Included' },
  { icon: Sparkles, label: 'Revisions', value: 'Unlimited Iterations' },
  { icon: Flame, label: 'Specialty', value: 'High-CTR YouTube Thumbnails' },
];

export default function QuickFacts() {
  return (
    <motion.div
      className="quickfacts-strip"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <Tape position="tl" />
      <Tape position="tr" />
      <div className="qf-header">
        <span className="qf-header-code">// DESIGN STANDARDS</span>
        <span className="qf-header-line" />
      </div>
      <div className="qf-strip-grid">
        {facts.map((f) => {
          const Icon = f.icon;
          return (
            <div className="qf-strip-cell" key={f.label}>
              <span className="qf-strip-icon"><Icon size={18} /></span>
              <div>
                <div className="qf-label">{f.label}</div>
                <div className="qf-value">{f.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Cake, MapPin, Briefcase, Sparkles } from 'lucide-react';
import Tape from './Tape.jsx';

const facts = [
  { icon: Cake, label: 'Age', value: '23 Years Old' },
  { icon: MapPin, label: 'Location', value: 'Delhi, India' },
  { icon: Briefcase, label: 'Role', value: 'Full Stack Developer' },
  { icon: Sparkles, label: 'Currently', value: 'Always Learning' },
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
        <span className="qf-header-code">// QUICK FACTS</span>
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
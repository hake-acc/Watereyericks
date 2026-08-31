import React from 'react';
import { ArrowRight } from 'lucide-react';
import Doodle from './Doodle.jsx';
import Tape from './Tape.jsx';

const items = [
  {
    badge: 'RUNNER-UP',
    title: 'NSUT Cricket Team',
    desc: 'Represented NSUT and became Runner-up.',
    doodle: 'trophy',
  },
  {
    badge: 'WINNER',
    title: 'NSUT Cricket Champion',
    desc: 'Won the tournament in 3rd year.',
    doodle: 'trophy',
  },
  {
    badge: 'PARTICIPANT',
    title: 'Science Olympiad',
    desc: 'Participated during Class 8 & 9.',
    doodle: 'flask',
  },
  {
    badge: 'PARTICIPANT',
    title: 'Math Olympiad',
    desc: 'Participated during Class 8 & 9.',
    doodle: 'calc',
  },
];

export default function Achievements() {
  return (
    <section id="achievements" className="section">
      <div className="section-title">
        <span className="section-num">04</span>
        <h2 className="section-name">Achievements &amp; Certifications</h2>
      </div>

      <div className="ach-grid">
        {items.map((it, i) => (
          <div className="ach-card" key={i}>
            <Tape position={i % 2 === 0 ? 'tl' : 'tr'} />
            <div className="ach-icon-wrap">
              <Doodle kind={it.doodle} size={30} style={{ position: 'static' }} />
            </div>
            <div>
              <span className="ach-badge">{it.badge}</span>
              <h3 className="ach-title">{it.title}</h3>
              <p className="ach-desc">{it.desc}</p>
              <a href="#" className="ach-link" onClick={(e) => e.preventDefault()}>
                View Certificate <ArrowRight size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

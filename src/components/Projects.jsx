import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';

const projects = [
  {
    title: 'Portfolio Website',
    desc: 'Modern personal portfolio built with React',
    tech: ['React', 'CSS', 'Framer Motion'],
    img: '/images/portfolio.png',
    placeholder: 'Portfolio',
  },
  {
    title: 'E-commerce UI',
    desc: 'Responsive shopping UI with clean design',
    tech: ['HTML', 'CSS', 'JavaScript'],
    img: '/images/ecommerce.png',
    placeholder: 'E-commerce',
  },
  {
    title: 'Dashboard UI',
    desc: 'Analytics dashboard with charts & stats',
    tech: ['React', 'Charts', 'API'],
    img: '/images/dashboard.png',
    placeholder: 'Dashboard',
  },
];

function ProjectImage({ src, placeholder }) {
  const [ok, setOk] = useState(true);
  if (!ok) return <span>{placeholder}</span>;
  return <img src={src} alt={placeholder} onError={() => setOk(false)} />;
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="section-title">
        <span className="section-num">05</span>
        <h2 className="section-name">Projects</h2>
      </div>

      <div className="projects-grid">
        {projects.map((p, i) => (
          <div className="project-card" key={p.title}>
            <Tape position={i % 2 === 0 ? 'tl' : 'tr'} />
            <div className="project-thumb">
              <ProjectImage src={p.img} placeholder={p.placeholder} />
            </div>
            <h3 className="project-title">{p.title}</h3>
            <p className="project-desc">{p.desc}</p>
            <div className="project-tech">
              {p.tech.map((t) => (
                <span className="tech-chip" key={t}>{t}</span>
              ))}
            </div>
            <a href="#" className="project-arrow" onClick={(e) => e.preventDefault()}>
              View project <ArrowUpRight size={12} />
            </a>
          </div>
        ))}
      </div>

      <div className="projects-cta">
        <a href="#" onClick={(e) => e.preventDefault()}>View all projects →</a>
      </div>

      <Doodle kind="sparkle" size={26} style={{ top: 40, right: 20, color: 'var(--purple)' }} />
    </section>
  );
}

import React from 'react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';

const groups = [
  { title: 'Languages',     items: ['C++', 'JavaScript', 'Python'] },
  { title: 'Frontend',      items: ['HTML', 'CSS', 'Tailwind CSS', 'React', 'Next.js'] },
  { title: 'Backend',       items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth'] },
  { title: 'Database',      items: ['MongoDB', 'MySQL'] },
  { title: 'Tools',         items: ['Git', 'GitHub', 'VS Code', 'Postman'] },
  { title: 'Core Strength', items: ['DSA', 'System Design', 'Docker', 'Deployment', 'AI/ML Basics'] },
];

export default function Skills() {
  return (
    <section id="skills" className="section section--tight">
      <div className="section-title">
        <span className="section-num">02</span>
        <h2 className="section-name">Skills</h2>
        <span className="section-tagline">— Tech I work with</span>
      </div>

      <div className="skills-sheet">
        <Tape position="tl" />
        <Tape position="tr" />
        <Doodle kind="scribble" size={40} style={{ top: -20, right: 120, color: 'var(--purple-dark)' }} />
        <Doodle kind="star" size={20} style={{ top: 20, right: 40, color: 'var(--purple)' }} />

        <div className="skills-masonry">
          {groups.map((g) => (
            <div className="skill-block" key={g.title}>
              <h3 className="skill-cat-title">{g.title}</h3>
              <div className="skill-tags">
                {g.items.map((item) => (
                  <span className="skill-tag" key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
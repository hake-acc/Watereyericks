import React from 'react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';

const edu = [
  {
    badge: 'PURSUING',
    title: 'Netaji Subhas University of Technology (NSUT), Delhi',
    degree: 'Bachelor of Technology in Computer Science and Engineering',
    date: 'Aug 2023 – Apr 2027',
    desc: 'Currently pursuing my degree while gaining practical exposure and hands-on experience in software development and problem solving.',
  },
  {
    badge: '2020–2022',
    title: "St. Karen's High School, Patna",
    degree: 'Intermediate (PCM with IP)',
    date: 'Apr 2020 – May 2022',
    desc: 'Strong foundation in Mathematics and Computer Science.',
  },
  {
    badge: '2020',
    title: "St. Karen's High School, Patna",
    degree: 'Matriculation',
    date: '2020',
    desc: 'Built strong academic foundation and discipline.',
  },
];

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="section-title">
        <span className="section-num">03</span>
        <h2 className="section-name">Education</h2>
      </div>

      <div className="education-sheet" style={{ position: 'relative' }}>
        <Tape position="tl" />
        <Tape position="br" />
        <Doodle kind="star" size={30} style={{ top: 20, right: 30, color: 'var(--purple-dark)' }} />

        <div className="timeline">
          {edu.map((e, i) => (
            <div className="timeline-item" key={i}>
              <span className="timeline-dot">{i + 1}</span>
              <span className="timeline-badge">{e.badge}</span>
              <h3 className="timeline-title">{e.title}</h3>
              <p className="timeline-degree">{e.degree}</p>
              <p className="timeline-date">{e.date}</p>
              <p className="timeline-desc">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

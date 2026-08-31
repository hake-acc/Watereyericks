import React from 'react';
import { Phone, Mail, Github, Linkedin, Instagram } from 'lucide-react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="section-title">
        <span className="section-num">06</span>
        <h2 className="section-name">Contact me</h2>
      </div>

      <div className="contact-wrap">
        <div className="contact-card">
          <Tape position="tl" />
          <Tape position="br" />
          <p>Discuss an opportunity or just want to say hi? My inbox is open for all :)</p>

          <div className="contact-row">
            <span className="icon"><Phone size={16} /></span>
            <a href="tel:+919334418671">+91-9334418671</a>
          </div>
          <div className="contact-row">
            <span className="icon"><Mail size={16} /></span>
            <a href="mailto:manishkr28092003@gmail.com">manishkr28092003@gmail.com</a>
          </div>

          <div className="contact-socials">
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub"><Github size={18} /></a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="mailto:manishkr28092003@gmail.com" className="social-icon" aria-label="Email"><Mail size={18} /></a>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram"><Instagram size={18} /></a>
          </div>
        </div>

        <div className="contact-visual">
          <div className="contact-note">Let's connect and create something great!</div>
          <span className="paper-plane">
            <Doodle kind="plane" size={90} style={{ position: 'static', color: 'var(--purple-dark)' }} />
          </span>
          <Doodle kind="arrowCurve" size={50} style={{ bottom: 130, left: 150, color: 'var(--purple)', transform: 'rotate(80deg)' }} />
          <Doodle kind="sparkle" size={22} style={{ top: 140, left: 80, color: 'var(--purple-dark)' }} />
        </div>
      </div>
    </section>
  );
}

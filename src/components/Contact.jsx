import React from 'react';
import { Mail, Youtube, Send, Clock, Sparkles, MessageSquare } from 'lucide-react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';

export default function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <div className="section-title">
        <span className="section-num">06</span>
        <div>
          <h2 className="section-name">Contact & Commission</h2>
          <p className="section-subtitle">
            Let's build thumbnails that command attention in your audience's feed.
          </p>
        </div>
      </div>

      <div className="contact-wrap">
        <div className="contact-card">
          <Tape position="tl" />
          <Tape position="br" />
          
          <h3 className="contact-card-title">Book a Thumbnail or Channel Package</h3>
          <p className="contact-card-desc">
            Currently accepting commissions for YouTube thumbnails, episodic bulk packs, and complete channel visual branding.
          </p>

          <div className="contact-row">
            <span className="icon"><Mail size={16} /></span>
            <a href="mailto:watereyebusiness@gmail.com">watereyebusiness@gmail.com</a>
          </div>

          <div className="contact-row">
            <span className="icon"><Clock size={16} /></span>
            <span>24–48h Turnaround (Rush delivery available)</span>
          </div>

          <div className="contact-cta-row">
            <a
              href="mailto:watereyebusiness@gmail.com?subject=Thumbnail%20Design%20Inquiry%20-%20Water%20Eye"
              className="paper-btn paper-btn--filled"
              aria-label="Send email to Water Eye"
            >
              Start a Project <Send size={14} />
            </a>
          </div>

          <div className="contact-socials">
            <a
              href="mailto:watereyebusiness@gmail.com"
              className="social-icon"
              aria-label="Email Water Eye"
              title="Email"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="YouTube Channel"
              title="YouTube"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>

        <div className="contact-visual">
          <div className="contact-note">
            "Every click starts with a thumbnail. Make it count."
          </div>
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

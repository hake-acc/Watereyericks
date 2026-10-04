import React, { useState } from 'react';
import { Mail, Send, Clock, Copy, Check, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import Tape from './Tape.jsx';
import Doodle from './Doodle.jsx';
import { DiscordIcon, XIcon, BehanceIcon, YTJobsIcon, SocialButtonsRow } from './SocialIcons.jsx';

export default function Contact() {
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyDiscord = async () => {
    try {
      await navigator.clipboard.writeText('watereyetheog');
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2200);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = 'watereyetheog';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2200);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('hakebusinesswork@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = 'hakebusinesswork@gmail.com';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

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

          {/* MAIN CONTACT: DISCORD SPOTLIGHT */}
          <div className="contact-spotlight-box">
            <div className="contact-spotlight-top">
              <span className="spotlight-badge">
                <span className="spotlight-dot" aria-hidden="true" />
                PRIMARY CONTACT • FASTEST RESPONSE
              </span>
            </div>
            <div className="contact-spotlight-body">
              <div className="spotlight-icon-wrap" aria-hidden="true">
                <DiscordIcon size={24} />
              </div>
              <div className="spotlight-details">
                <span className="spotlight-platform">Discord</span>
                <span className="spotlight-handle">watereyetheog</span>
              </div>
              <div className="spotlight-actions">
                <button
                  type="button"
                  onClick={handleCopyDiscord}
                  className={`copy-btn ${copiedDiscord ? 'copied' : ''}`}
                  aria-label="Copy Discord username watereyetheog"
                >
                  {copiedDiscord ? (
                    <>
                      <Check size={14} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* EMAIL ROW */}
          <div className="contact-row contact-row--email">
            <span className="icon" aria-hidden="true"><Mail size={16} /></span>
            <div className="contact-row-info">
              <span className="contact-row-label">EMAIL COMMISSION</span>
              <a
                href="mailto:hakebusinesswork@gmail.com"
                className="contact-row-value"
                title="Send email to hakebusinesswork@gmail.com"
              >
                hakebusinesswork@gmail.com
              </a>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className={`mini-copy-btn ${copiedEmail ? 'copied' : ''}`}
              aria-label="Copy email address"
              title="Copy email to clipboard"
            >
              {copiedEmail ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>

          {/* TURNAROUND ROW */}
          <div className="contact-row">
            <span className="icon" aria-hidden="true"><Clock size={16} /></span>
            <div className="contact-row-info">
              <span className="contact-row-label">ESTIMATED TURNAROUND</span>
              <span className="contact-row-value">24–48h Turnaround (Rush delivery available)</span>
            </div>
          </div>

          {/* CTA BUTTONS */}
          <div className="contact-cta-row">
            <a
              href="mailto:hakebusinesswork@gmail.com?subject=Thumbnail%20Design%20Inquiry%20-%20Water%20Eye"
              className="paper-btn paper-btn--filled"
              aria-label="Send email inquiry to Water Eye"
            >
              Start a Project <Send size={14} />
            </a>
            <button
              type="button"
              onClick={handleCopyDiscord}
              className="paper-btn"
              aria-label="Add Water Eye on Discord"
            >
              <DiscordIcon size={15} />
              <span>{copiedDiscord ? 'Discord ID Copied!' : 'Add on Discord'}</span>
            </button>
          </div>

          {/* SOCIALS SHOWCASE */}
          <div className="contact-socials-wrapper">
            <span className="contact-socials-label">FIND WATER EYE ACROSS THE WEB</span>
            <SocialButtonsRow size={18} className="contact-socials" />
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

import React from 'react';
import { SocialButtonsRow } from './SocialIcons.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-info">
        <span>© 2026 Water Eye. Indian YouTube Thumbnail Designer. All rights reserved.</span>
        <span>Crafted for creators • Photoshop, Cinema 4D & Blender</span>
      </div>
      <div className="footer-socials">
        <SocialButtonsRow size={16} />
      </div>
    </footer>
  );
}

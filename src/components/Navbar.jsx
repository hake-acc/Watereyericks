import React from 'react';
import { motion } from 'framer-motion';
import { Home, Image as ImageIcon, Users, Sparkles, User, Mail, Sun, Moon, Circle } from 'lucide-react';

const items = [
  { id: 'home', num: '01', label: 'HOME', icon: Home },
  { id: 'work', num: '02', label: 'THUMBNAILS', icon: ImageIcon },
  { id: 'creators', num: '03', label: 'CREATORS', icon: Users },
  { id: 'services', num: '04', label: 'SERVICES', icon: Sparkles },
  { id: 'about', num: '05', label: 'ABOUT', icon: User },
  { id: 'contact', num: '06', label: 'CONTACT', icon: Mail },
];

export default function Navbar({ active, onNavigate, theme, setTheme }) {
  return (
    <aside className="navbar" aria-label="Primary Navigation">
      <div className="nav-brand">
        <div className="nav-brand-row">
          <span className="nav-brand-code">WE FX</span>
        </div>
        <span className="nav-brand-name">WATER EYE</span>
        <span className="nav-brand-sub">YouTube Thumbnail Designer</span>
      </div>

      <ul className="nav-list">
        {items.map((it, i) => {
          const Icon = it.icon;
          const isActive = active === it.id;
          return (
            <React.Fragment key={it.id}>
              <li>
                <button
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onNavigate(it.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-highlight"
                      className="nav-highlight"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="nav-num">{it.num}</span>
                  <span className="nav-icon"><Icon size={16} /></span>
                  <span>{it.label}</span>
                </button>
              </li>
              {i < items.length - 1 && <li className="nav-divider" aria-hidden="true" />}
            </React.Fragment>
          );
        })}
      </ul>

      <div className="nav-theme">
        <span className="nav-theme-label">THEME</span>
        <div className="theme-toggle" role="group" aria-label="Theme selector">
          <button
            className={theme === 'dark' ? 'active' : ''}
            onClick={() => setTheme('dark')}
            aria-label="Dark theme"
            title="Dark theme"
          ><Moon size={12} /></button>
          <button
            className={theme === 'system' ? 'active' : ''}
            onClick={() => setTheme('system')}
            aria-label="System theme"
            title="System theme"
          ><Circle size={10} /></button>
          <button
            className={theme === 'light' ? 'active' : ''}
            onClick={() => setTheme('light')}
            aria-label="Light theme"
            title="Light theme"
          ><Sun size={12} /></button>
        </div>

        <p className="nav-quote">Stop the scroll.<br />Drive the click.</p>
      </div>
    </aside>
  );
}

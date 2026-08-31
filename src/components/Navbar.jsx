import React from 'react';
import { motion } from 'framer-motion';
import { Home, Layers, GraduationCap, Trophy, FolderGit2, Mail, Sun, Moon, Circle } from 'lucide-react';

const items = [
  { id: 'home', num: '01', label: 'HOME', icon: Home },
  { id: 'skills', num: '02', label: 'SKILLS', icon: Layers },
  { id: 'education', num: '03', label: 'EDUCATION', icon: GraduationCap },
  { id: 'achievements', num: '04', label: 'ACHIEVEMENTS', icon: Trophy },
  { id: 'projects', num: '05', label: 'PROJECTS', icon: FolderGit2 },
  { id: 'contact', num: '06', label: 'CONTACT', icon: Mail },
];

export default function Navbar({ active, onNavigate, theme, setTheme }) {
  return (
    <aside className="navbar" aria-label="Primary">
      <div className="nav-brand">
        <span className="nav-brand-code">&lt;MK/&gt;</span>
        <span className="nav-brand-name">MANISH KUMAR</span>
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
        <div className="theme-toggle" role="group" aria-label="Theme">
          <button
            className={theme === 'dark' ? 'active' : ''}
            onClick={() => setTheme('dark')}
            aria-label="Dark theme"
          ><Moon size={12} /></button>
          <button
            className={theme === 'system' ? 'active' : ''}
            onClick={() => setTheme('system')}
            aria-label="System theme"
          ><Circle size={10} /></button>
          <button
            className={theme === 'light' ? 'active' : ''}
            onClick={() => setTheme('light')}
            aria-label="Light theme"
          ><Sun size={12} /></button>
        </div>

        <p className="nav-quote">Let's build<br />something amazing!</p>
      </div>
    </aside>
  );
}

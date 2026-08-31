import React, { useEffect, useState, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Skills from './components/Skills.jsx';
import Education from './components/Education.jsx';
import Achievements from './components/Achievements.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import QuickFacts from './components/QuickFacts.jsx';

const SECTIONS = ['home', 'skills', 'education', 'achievements', 'projects', 'contact'];

export default function App() {
  const [active, setActive] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('mk-theme') || 'light');

  useEffect(() => {
    const resolved =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem('mk-theme', theme);
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="app">
      <Navbar active={active} onNavigate={handleNavigate} theme={theme} setTheme={setTheme} />
      <main className="main">
        <Hero onNavigate={handleNavigate} />
        <QuickFacts />
        <Skills />
        <Education />
        <Achievements />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
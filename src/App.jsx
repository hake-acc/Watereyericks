import React, { useEffect, useState, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import QuickFacts from './components/QuickFacts.jsx';
import ThumbnailGallery from './components/ThumbnailGallery.jsx';
import Creators from './components/Creators.jsx';
import Services from './components/Services.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

const SECTIONS = ['home', 'work', 'creators', 'services', 'about', 'contact'];

export default function App() {
  const [active, setActive] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('we-theme') || 'dark');

  useEffect(() => {
    const resolved =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem('we-theme', theme);
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
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
        <ThumbnailGallery />
        <Creators />
        <Services />
        <About />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
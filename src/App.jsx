import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import QuickFacts from './components/QuickFacts.jsx';
import ThumbnailGallery from './components/ThumbnailGallery.jsx';
import Creators from './components/Creators.jsx';
import Services from './components/Services.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard.jsx'));

const SECTIONS = ['home', 'work', 'creators', 'services', 'about', 'contact'];

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.startsWith('/admin');
  });

  const [active, setActive] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('we-theme') || 'dark');

  // Handle client-side URL changes for private /admin route
  useEffect(() => {
    const handlePopState = () => {
      setIsAdmin(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateHome = useCallback(() => {
    window.history.pushState({}, '', '/');
    setIsAdmin(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
    if (isAdmin) return; // Don't run observer in admin mode

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
  }, [isAdmin]);

  const handleNavigate = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (isAdmin) {
    return (
      <Suspense
        fallback={
          <div className="admin-loading-screen">
            <div className="admin-spinner" />
            <span>Loading Water Eye Admin...</span>
          </div>
        }
      >
        <AdminDashboard onNavigateHome={navigateHome} />
      </Suspense>
    );
  }

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
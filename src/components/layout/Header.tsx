import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { BRAND } from '../../config/brand';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'Industries', path: '/industries' },
    { label: 'Case Studies', path: '/case-studies' },
    { label: 'Process', path: '/process' },
    { label: 'About', path: '/about' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Blueprint', path: '/blueprint' }
  ];

  return (
    <header className="site-header" role="banner">
      <div className="nav-wrapper">
        {/* 1. Circular Logo & Brand Moniker */}
        <Link to="/" className="site-logo-link" aria-label={`${BRAND.name} Home`}>
          <img src="assets/logo.svg" alt={`${BRAND.shortName} Logo`} className="site-logo-img" />
          <span className="brand-logo-text" style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '0.875rem', 
            letterSpacing: '0.08em', 
            fontWeight: 700, 
            marginLeft: '6px',
            color: 'var(--text)'
          }}>
            {BRAND.shortName}
          </span>
        </Link>

        {/* 2. Main Navigation Pill */}
        <nav className="main-nav-pill" aria-label="Main Navigation">
          <ul className="nav-list">
            {navLinks.slice(0, 6).map((link) => {
              const isActive = location.pathname === link.path || 
                (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <li key={link.path} className="nav-item">
                  <Link to={link.path} className={`nav-link ${isActive ? 'active' : ''}`}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 3. Action Pill (Start a Project) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/contact" className="nav-action-pill">
            Start a Project
          </Link>

          {/* 4. Theme Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'dark' ? (
              <i className="fa-solid fa-sun theme-icon-light" style={{ display: 'block' }}></i>
            ) : (
              <i className="fa-solid fa-moon theme-icon-dark" style={{ display: 'block' }}></i>
            )}
          </button>

          {/* Mobile Burger Button */}
          <button
            className={`mobile-burger-btn ${mobileMenuOpen ? 'is-active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="burger-bar"></span>
            <span className="burger-bar"></span>
            <span className="burger-bar"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      <div 
        className={`mobile-menu-backdrop ${mobileMenuOpen ? 'is-open' : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
        style={{ display: mobileMenuOpen ? 'block' : 'none' }}
      ></div>

      <div 
        className={`mobile-menu-sheet ${mobileMenuOpen ? 'is-open' : ''}`} 
        role="dialog" 
        aria-modal="true" 
        aria-label="Mobile Navigation"
        style={{ 
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', letterSpacing: '0.1em', color: 'var(--muted)' }}>
            NAVIGATION
          </span>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '1.25rem' }}
          >
            &times;
          </button>
        </div>

        <ul className="mobile-nav-list">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/book" className="mobile-nav-link">Book Consultation</Link>
          </li>
          <li>
            <Link to="/admin" className="mobile-nav-link" style={{ color: '#10b981' }}>
              <i className="fa-solid fa-gauge-high" style={{ marginRight: '8px' }}></i>
              Operations Portal
            </Link>
          </li>
        </ul>

        <div className="mobile-theme-switch-row" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
            Theme:
          </span>
          <button onClick={toggleTheme} className="mobile-theme-switch-btn">
            <span>{theme === 'light' ? 'Light' : 'Dark'}</span> Mode
            <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`} style={{ marginLeft: '8px' }}></i>
          </button>
        </div>

        <div style={{ marginTop: '24px' }}>
          <Link to="/contact" className="mobile-cta-btn">
            Start a Project
          </Link>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        {/* Massive Editorial Typography Statement */}
        <div className="footer-statement-massive">
          {BRAND.tagline}
        </div>

        <div className="footer-nav-grid">
          {/* Brand & Mission Column */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <img src="assets/logo.svg" alt={`${BRAND.shortName} Logo`} />
              <span className="footer-brand-name">{BRAND.entityName}</span>
            </div>
            <p className="footer-desc-text">
              {BRAND.description}
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
              <a href={BRAND.socials.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', fontSize: '1.125rem' }} aria-label="GitHub">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href={BRAND.socials.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', fontSize: '1.125rem' }} aria-label="Twitter">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href={BRAND.socials.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', fontSize: '1.125rem' }} aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Navigation Column 1 */}
          <div>
            <h4 className="footer-col-heading">Company</h4>
            <ul className="footer-link-list">
              <li className="footer-link-item"><Link to="/about">About Us</Link></li>
              <li className="footer-link-item"><Link to="/process">Our Process</Link></li>
              <li className="footer-link-item"><Link to="/case-studies">Case Studies</Link></li>
              <li className="footer-link-item"><Link to="/pricing">Pricing & Scope</Link></li>
              <li className="footer-link-item"><Link to="/blueprint">Technical Blueprint</Link></li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div>
            <h4 className="footer-col-heading">Solutions</h4>
            <ul className="footer-link-list">
              <li className="footer-link-item"><Link to="/solutions/ai-automation">AI Automation</Link></li>
              <li className="footer-link-item"><Link to="/solutions/ai-agents">Autonomous Agents</Link></li>
              <li className="footer-link-item"><Link to="/solutions/ai-voice">AI Voice Telephony</Link></li>
              <li className="footer-link-item"><Link to="/solutions/document-intelligence">Document Intelligence</Link></li>
              <li className="footer-link-item"><Link to="/solutions/ai-knowledge">Enterprise RAG</Link></li>
            </ul>
          </div>

          {/* Direct Contact Column */}
          <div>
            <h4 className="footer-col-heading">Direct Inquiry</h4>
            <ul className="footer-link-list">
              <li>
                <a 
                  href={`mailto:${BRAND.contactEmail}`} 
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
                >
                  {BRAND.contactEmail}
                </a>
              </li>
              <li style={{ marginTop: '8px', color: 'var(--muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>
                {BRAND.address}
              </li>
              <li style={{ marginTop: '16px' }}>
                <Link to="/book" className="btn btn-outline btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                  Book Discovery Call
                </Link>
              </li>
              <li style={{ marginTop: '12px' }}>
                <Link to="/admin" style={{ color: '#10b981', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-solid fa-lock" style={{ fontSize: '0.7rem' }}></i>
                  Internal Operations Cockpit
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom-strip">
          <div>&copy; {currentYear} {BRAND.name}. All rights reserved. Built with precision systems engineering.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>
              SYSTEM STATUS: <span style={{ color: '#10b981' }}>OPERATIONAL (99.98%)</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

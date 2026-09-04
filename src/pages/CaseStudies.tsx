import React from 'react';
import { Link } from 'react-router-dom';
import { CASE_STUDIES } from '../data/caseStudies';

export const CaseStudies: React.FC = () => {
  return (
    <div className="case-studies-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Proven Production Engineering</span>
          <h1 className="page-hero-title">Verified Systems Case Studies</h1>
          <p className="page-hero-desc">
            Detailed technical breakdowns of autonomous pipelines deployed in mission-critical enterprise environments.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {CASE_STUDIES.map((cs) => (
              <div
                key={cs.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: 'clamp(24px, 4vw, 48px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    CASE STUDY // {cs.number} • {cs.industry.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                    CLIENT: {cs.client}
                  </span>
                </div>

                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>
                  {cs.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.6, maxWidth: '820px', marginBottom: '32px' }}>
                  {cs.summary}
                </p>

                {/* Metrics Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginBottom: '32px'
                }}>
                  {cs.results.map((r, rIdx) => (
                    <div
                      key={rIdx}
                      style={{
                        background: 'var(--surface-strong)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '20px'
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
                        {r.metric}
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>
                        {r.context}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Executive Quote */}
                <div style={{
                  borderLeft: '2px solid #10b981',
                  paddingLeft: '20px',
                  marginBottom: '32px',
                  fontStyle: 'italic',
                  color: 'var(--text-secondary)'
                }}>
                  "{cs.quote.text}"
                  <div style={{ fontStyle: 'normal', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text)', marginTop: '8px' }}>
                    — {cs.quote.author}, {cs.quote.role}
                  </div>
                </div>

                <Link to={`/case-studies/${cs.slug}`} className="btn btn-primary btn-sm">
                  Inspect Architecture Breakdown &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

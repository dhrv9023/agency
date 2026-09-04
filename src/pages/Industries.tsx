import React from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRIES } from '../data/industries';

export const Industries: React.FC = () => {
  return (
    <div className="industries-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Sector Specialization</span>
          <h1 className="page-hero-title">Architected for Industry Bottlenecks</h1>
          <p className="page-hero-desc">
            We understand the specific unit economics, regulatory boundaries, and operational handoffs across complex vertical markets.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                      SECTOR // {ind.number}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 10px 0' }}>
                    {ind.title}
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '24px' }}>
                    {ind.description}
                  </p>

                  {/* Impact Metric Chips */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    background: 'var(--surface-strong)',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '24px'
                  }}>
                    {ind.metrics.map((m, mIdx) => (
                      <div key={mIdx} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: '#10b981' }}>
                          {m.value}
                        </div>
                        <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: '2px' }}>
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Primary Bottlenecks Resolved
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ind.bottlenecks.slice(0, 2).map((b, bIdx) => (
                      <li key={bIdx} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                        <span style={{ color: '#ef4444' }}>✕</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={`/industries/${ind.slug}`} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Explore Industry Solutions &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

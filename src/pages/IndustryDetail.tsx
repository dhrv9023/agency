import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { INDUSTRIES } from '../data/industries';

export const IndustryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const industry = INDUSTRIES.find((i) => i.slug === slug);

  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  return (
    <div className="industry-detail-page">
      <section className="page-hero">
        <div className="container">
          <Link to="/industries" style={{ color: 'var(--muted)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            &larr; Back to Industries Matrix
          </Link>
          <span className="eyebrow">Sector Architecture // {industry.number}</span>
          <h1 className="page-hero-title">{industry.title}</h1>
          <p className="page-hero-desc">{industry.tagline}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>
                Operational Context & Opportunity
              </h2>
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '32px' }}>
                {industry.description}
              </p>

              {/* Verified Metrics Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '40px'
              }}>
                {industry.metrics.map((m, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: '4px' }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
                Legacy Bottlenecks We Eliminate
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
                {industry.bottlenecks.map((b, idx) => (
                  <div key={idx} style={{
                    background: 'var(--surface-strong)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>✕</span>
                    <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>{b}</span>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
                Automated Systems We Deploy
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {industry.solutions.map((s, idx) => (
                  <div key={idx} style={{
                    background: 'var(--surface)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: '0.9375rem', color: 'var(--text)' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar CTA */}
            <div>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                position: 'sticky',
                top: '100px'
              }}>
                <span className="eyebrow">Sector Roadmap</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '8px 0 16px 0' }}>
                  Deploy Intelligent Pipelines for {industry.title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  Our technical partners conduct an audit of your software stack, map high-impact automation quick-wins, and design your phased rollout.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link to="/book" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Schedule Technical Audit
                  </Link>
                  <Link to="/case-studies" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    View Case Studies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SOLUTIONS } from '../data/solutions';

export const SolutionDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const solution = SOLUTIONS.find((s) => s.slug === slug);

  if (!solution) {
    return <Navigate to="/solutions" replace />;
  }

  return (
    <div className="solution-detail-page">
      <section className="page-hero">
        <div className="container">
          <Link to="/solutions" style={{ color: 'var(--muted)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            &larr; Back to Solutions Index
          </Link>
          <span className="eyebrow">{solution.badge}</span>
          <h1 className="page-hero-title">{solution.title}</h1>
          <p className="page-hero-desc">{solution.tagline}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
            {/* Main Content Column */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>
                System Architecture & Overview
              </h2>
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '32px' }}>
                {solution.description}
              </p>

              {/* Pipeline Diagram */}
              <div style={{
                background: 'var(--surface-strong)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '40px'
              }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#10b981', textTransform: 'uppercase' }}>
                  Deterministic Execution Pipeline
                </span>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  lineHeight: 1.8,
                  marginTop: '12px',
                  color: 'var(--text)'
                }}>
                  {solution.flow}
                </div>
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>
                Engineered Capabilities
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                {solution.features.map((feature, idx) => (
                  <div key={idx} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}>
                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1rem' }}>✓</span>
                    <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Column: Deliverables & Tech Stack */}
            <div>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                position: 'sticky',
                top: '100px'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '16px' }}>
                  Enterprise Deliverables
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {solution.deliverables.map((deliv, idx) => (
                    <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '10px' }}>
                      <span style={{ color: '#3b82f6' }}>●</span>
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '16px' }}>
                  Production Tech Stack
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                  {solution.techStack.map((tech, idx) => (
                    <span key={idx} style={{
                      background: 'var(--surface-strong)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text)'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link to="/book" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Schedule Discovery Session
                  </Link>
                  <Link to="/contact" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    Request Scope Estimate
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

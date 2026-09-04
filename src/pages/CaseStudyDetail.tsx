import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { CASE_STUDIES } from '../data/caseStudies';

export const CaseStudyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const study = CASE_STUDIES.find((cs) => cs.slug === slug);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'after' | 'before'>('after');

  if (!study) {
    return <Navigate to="/case-studies" replace />;
  }

  return (
    <div className="case-study-detail-page">
      <section className="page-hero">
        <div className="container">
          <Link to="/case-studies" style={{ color: 'var(--muted)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            &larr; Back to Case Studies Gallery
          </Link>
          <span className="eyebrow">CASE STUDY // {study.number} • {study.client.toUpperCase()}</span>
          <h1 className="page-hero-title">{study.title}</h1>
          <p className="page-hero-desc">{study.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Key Metrics Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '48px'
          }}>
            {study.results.map((r, idx) => (
              <div key={idx} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>
                  {r.metric}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>
                  {r.label}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '4px' }}>
                  {r.context}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>
                The Operational Bottleneck
              </h2>
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '40px' }}>
                {study.challenge}
              </p>

              {/* Before vs After Interactive Workflow Diff */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '28px',
                marginBottom: '40px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
                    Workflow Transformation Diff
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setActiveWorkflowTab('before')}
                      style={{
                        background: activeWorkflowTab === 'before' ? '#ef4444' : 'var(--surface-strong)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer'
                      }}
                    >
                      Traditional Flow (Manual)
                    </button>
                    <button
                      onClick={() => setActiveWorkflowTab('after')}
                      style={{
                        background: activeWorkflowTab === 'after' ? '#10b981' : 'var(--surface-strong)',
                        color: activeWorkflowTab === 'after' ? '#000' : '#fff',
                        fontWeight: activeWorkflowTab === 'after' ? 700 : 400,
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer'
                      }}
                    >
                      Automated Pipeline
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(activeWorkflowTab === 'after' ? study.afterFlow : study.beforeFlow).map((step, idx) => (
                    <div key={idx} style={{
                      background: 'var(--surface-strong)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      <span style={{ color: activeWorkflowTab === 'after' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                        0{idx + 1}
                      </span>
                      <span style={{ color: 'var(--text)' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>
                Engineered Architecture Components
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                {study.architecture.map((item, idx) => (
                  <div key={idx} style={{
                    background: 'var(--surface-strong)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ color: '#10b981' }}>✓</span>
                    <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Column */}
            <div>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                position: 'sticky',
                top: '100px'
              }}>
                <div style={{
                  borderLeft: '3px solid #10b981',
                  paddingLeft: '16px',
                  marginBottom: '28px',
                  fontStyle: 'italic',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6
                }}>
                  "{study.quote.text}"
                  <div style={{ fontStyle: 'normal', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text)', marginTop: '12px' }}>
                    — {study.quote.author}<br />
                    <span style={{ color: 'var(--muted)' }}>{study.quote.role}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link to="/book" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Replicate These Results
                  </Link>
                  <Link to="/contact" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    Submit Architecture Request
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

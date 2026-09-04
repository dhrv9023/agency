import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SOLUTIONS } from '../data/solutions';

export const Solutions: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'agents' | 'pipelines' | 'knowledge'>('all');

  const filteredSolutions = SOLUTIONS.filter((sol) => {
    if (activeFilter === 'agents') return sol.slug.includes('agent') || sol.slug.includes('voice');
    if (activeFilter === 'pipelines') return sol.slug.includes('automation') || sol.slug.includes('sales') || sol.slug.includes('document');
    if (activeFilter === 'knowledge') return sol.slug.includes('knowledge') || sol.slug.includes('custom') || sol.slug.includes('support');
    return true;
  });

  return (
    <div className="solutions-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Production Architecture</span>
          <h1 className="page-hero-title">Intelligent Systems Engineered for Scale</h1>
          <p className="page-hero-desc">
            Explore our specialized capabilities in autonomous agents, event-driven integrations, document intelligence, and real-time voice telemetry.
          </p>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '32px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveFilter('all')}
              className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            >
              All Systems ({SOLUTIONS.length})
            </button>
            <button
              onClick={() => setActiveFilter('agents')}
              className={`btn btn-sm ${activeFilter === 'agents' ? 'btn-primary' : 'btn-outline'}`}
            >
              Autonomous Agents & Voice
            </button>
            <button
              onClick={() => setActiveFilter('pipelines')}
              className={`btn btn-sm ${activeFilter === 'pipelines' ? 'btn-primary' : 'btn-outline'}`}
            >
              Event Pipelines & OCR
            </button>
            <button
              onClick={() => setActiveFilter('knowledge')}
              className={`btn btn-sm ${activeFilter === 'knowledge' ? 'btn-primary' : 'btn-outline'}`}
            >
              Enterprise RAG & Custom
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {filteredSolutions.map((sol) => (
              <div
                key={sol.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: 'clamp(24px, 4vw, 40px)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '32px',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    {sol.badge}
                  </span>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '8px 0 12px 0' }}>
                    {sol.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '20px' }}>
                    {sol.description}
                  </p>

                  <div style={{
                    background: 'var(--surface-strong)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '20px'
                  }}>
                    <strong style={{ color: 'var(--text)' }}>Pipeline Architecture:</strong><br />
                    <span style={{ color: '#10b981' }}>{sol.flow}</span>
                  </div>

                  <Link to={`/solutions/${sol.slug}`} className="btn btn-primary btn-sm">
                    Inspect Technical Specification &rarr;
                  </Link>
                </div>

                <div style={{
                  background: 'var(--surface-strong)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h4 style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
                    Key Architectural Capabilities
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {sol.features.map((feat, fIdx) => (
                      <li key={fIdx} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ color: '#10b981' }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>
                      Technology Harness:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {sol.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            color: 'var(--text)'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

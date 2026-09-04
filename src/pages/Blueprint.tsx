import React, { useState } from 'react';
import { BLUEPRINT_CHAPTERS } from '../data/blueprints';
import { Link } from 'react-router-dom';

export const Blueprint: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState<string>(BLUEPRINT_CHAPTERS[0].id);
  const chapter = BLUEPRINT_CHAPTERS.find((c) => c.id === activeChapterId) || BLUEPRINT_CHAPTERS[0];

  return (
    <div className="blueprint-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Internal Knowledge & Methodology</span>
          <h1 className="page-hero-title">The Applied Systems Blueprint</h1>
          <p className="page-hero-desc">
            Our open architectural documentation on how to build, deploy, and operate autonomous agent systems and enterprise automation pipelines.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {/* Chapter Navigation Sidebar */}
            <div>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
                position: 'sticky',
                top: '100px'
              }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>
                  BLUEPRINT SECTIONS
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                  {BLUEPRINT_CHAPTERS.map((c) => {
                    const isSelected = c.id === activeChapterId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveChapterId(c.id)}
                        style={{
                          background: isSelected ? 'var(--surface-strong)' : 'transparent',
                          border: isSelected ? '1px solid #10b981' : '1px solid transparent',
                          borderRadius: '8px',
                          padding: '12px 14px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: isSelected ? '#10b981' : 'var(--muted)' }}>
                          {c.part} • {c.readTime}
                        </span>
                        <span style={{ fontSize: '0.875rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--text)' : 'var(--text-secondary)' }}>
                          {c.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                  <Link to="/book" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Consult With Lead Architect
                  </Link>
                </div>
              </div>
            </div>

            {/* Chapter Content Main Area */}
            <div style={{ flex: 2 }}>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: 'clamp(24px, 4vw, 40px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#10b981', fontWeight: 600 }}>
                    {chapter.part} // TECHNICAL SPECIFICATION
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {chapter.readTime}
                  </span>
                </div>

                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, margin: '0 0 16px 0' }}>
                  {chapter.title}
                </h2>

                <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '32px' }}>
                  {chapter.summary}
                </p>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '16px' }}>
                  Core Engineering Principles
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {chapter.topics.map((topic, tIdx) => (
                    <div key={tIdx} style={{
                      background: 'var(--surface-strong)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.9375rem',
                      color: 'var(--text)'
                    }}>
                      <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>0{tIdx + 1}</span>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>

                {chapter.codeSnippet && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>
                        Production Code Pattern
                      </span>
                    </div>
                    <pre style={{
                      background: '#040406',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      padding: '20px',
                      overflowX: 'auto',
                      fontSize: '0.8125rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#a7f3d0',
                      lineHeight: 1.6
                    }}>
                      <code>{chapter.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

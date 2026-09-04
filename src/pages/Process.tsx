import React from 'react';
import { Link } from 'react-router-dom';

export const Process: React.FC = () => {
  const steps = [
    {
      step: '01',
      phase: 'AUDIT & BOTTLENECK DISCOVERY',
      duration: 'Week 1',
      title: 'Mapping the Real Economic Friction',
      description: 'We don’t start with technology; we start with your balance sheet and team hours. We interview your department heads, shadow repetitive workflows, and identify where manual handoffs and data entry destroy operating margins.',
      deliverables: [
        'Comprehensive Operational Bottleneck Heatmap',
        'Quantified Hours Lost & EBITDA Drain Calculation',
        'Architecture Feasibility & Priority Matrix'
      ]
    },
    {
      step: '02',
      phase: 'ARCHITECTURE & PROTOTYPE',
      duration: 'Weeks 2 – 3',
      title: 'Deterministic Schema & Guardrail Design',
      description: 'We design the end-to-end data schemas, API contracts, fallback cascades, and guardrail policies. We construct a sandbox prototype to validate accuracy against your historical edge cases with zero hallucination risk.',
      deliverables: [
        'Interactive Architecture Flowchart & Technical Spec',
        'Sandbox Demonstration with Live Edge-Case Stress Testing',
        'Production Security & Data Privacy Review'
      ]
    },
    {
      step: '03',
      phase: 'PRODUCTION DEPLOYMENT',
      duration: 'Weeks 4 – 5',
      title: 'Hardened Integration & Parallel Run',
      description: 'We deploy the pipelines into your production environment with dead-letter queues, idempotent retry loops, and human-in-the-loop escalation switches. We execute parallel runs alongside your existing team to verify 100% data integrity.',
      deliverables: [
        'Live Enterprise System Integration (ERP / CRM / Telephony)',
        'Parallel Validation Report with 99.8%+ Accuracy Verification',
        'Real-Time Observability & Latency Alerting Cockpit'
      ]
    },
    {
      step: '04',
      phase: 'EVOLUTION & SLA SLA RETENTION',
      duration: 'Ongoing',
      title: 'Continuous Optimization & Model Upgrades',
      description: 'Autonomous systems require continuous calibration. As foundation models advance and your volume scales, we maintain prompt hygiene, update tool harnesses, patch breaking API changes, and ensure ongoing SLA adherence.',
      deliverables: [
        'Sub-1-hour Emergency Triage & Escalation SLA',
        'Monthly Model Benchmark & Efficiency Audits',
        'Continuous Feature Expansion for Adjacent Workflows'
      ]
    }
  ];

  return (
    <div className="process-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Engineering Methodology</span>
          <h1 className="page-hero-title">How We Engineer Autonomous Systems</h1>
          <p className="page-hero-desc">
            A disciplined, four-stage engineering sprint designed to transform manual corporate friction into production-grade automated leverage.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {steps.map((s, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: 'clamp(24px, 4vw, 40px)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '32px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#10b981',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '4px 12px',
                      borderRadius: '6px'
                    }}>
                      {s.step}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>
                      {s.phase} • {s.duration.toUpperCase()}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.625rem', fontWeight: 700, margin: '0 0 16px 0' }}>
                    {s.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                    {s.description}
                  </p>
                </div>

                <div style={{
                  background: 'var(--surface-strong)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h4 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
                    Stage Deliverables
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {s.deliverables.map((deliv, dIdx) => (
                      <li key={dIdx} style={{ fontSize: '0.875rem', color: 'var(--text)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ color: '#10b981' }}>✓</span>
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '64px' }}>
            <Link to="/book" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1rem' }}>
              Initiate Stage 01 Discovery &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

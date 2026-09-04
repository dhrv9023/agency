import React from 'react';
import { Link } from 'react-router-dom';

export const Pricing: React.FC = () => {
  const tiers = [
    {
      name: 'Architectural Audit',
      badge: 'STAGE 01 DISCOVERY',
      price: '$5,000',
      period: 'one-time investment',
      description: 'Comprehensive operational bottleneck discovery, workflow shadowing, unit economics mapping, and technical system blueprint.',
      features: [
        'Complete workflow mapping & EBITDA drain audit',
        'Architecture specification & data schema design',
        'Tool harness & model feasibility evaluation',
        'Credited 100% toward production deployment'
      ],
      ctaText: 'Book Architecture Audit',
      ctaLink: '/book',
      isPopular: false
    },
    {
      name: 'Targeted Pipeline',
      badge: 'MOST FREQUENT ENGAGEMENT',
      price: '$22,500',
      period: 'average single deployment',
      description: 'End-to-end design, implementation, and deployment of a mission-critical automated pipeline or autonomous agent system.',
      features: [
        'Production integration with ERP / CRM / Telephony',
        'Custom multi-modal extraction or ReAct reasoning loop',
        'Deterministic guardrails & policy approval gates',
        'Zero-hallucination benchmark test suite',
        '30 days post-launch warranty & tuning'
      ],
      ctaText: 'Deploy Targeted Pipeline',
      ctaLink: '/contact',
      isPopular: true
    },
    {
      name: 'Enterprise Overhaul',
      badge: 'FULL DIGITAL AUTONOMY',
      price: '$55,000+',
      period: 'multi-system transformation',
      description: 'Complete operational re-architecture across customer support, document ingestion, sales qualification, and internal knowledge RAG.',
      features: [
        'Multi-agent collaborative network with orchestrator',
        'Air-gapped deployment in your dedicated cloud / on-prem',
        'Custom internal operations cockpit & dashboard',
        'Enterprise SSO, audit logging & SOC2 compliance',
        'Full IP and source code ownership transfer'
      ],
      ctaText: 'Initiate Enterprise Overhaul',
      ctaLink: '/contact',
      isPopular: false
    }
  ];

  return (
    <div className="pricing-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Predictable Investment & Scope</span>
          <h1 className="page-hero-title">Transparent Systems Engineering Pricing</h1>
          <p className="page-hero-desc">
            Fixed-scope sprints with verifiable milestones. We don’t bill ambiguous endless hours; we ship functioning production pipelines.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {tiers.map((t, idx) => (
              <div
                key={idx}
                style={{
                  background: t.isPopular ? 'var(--surface-strong)' : 'var(--surface)',
                  border: t.isPopular ? '2px solid #10b981' : '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: t.isPopular ? '#10b981' : 'var(--muted)',
                    fontWeight: 700,
                    letterSpacing: '0.08em'
                  }}>
                    {t.badge}
                  </span>

                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '12px 0 8px 0' }}>
                    {t.name}
                  </h2>

                  <div style={{ margin: '16px 0 20px 0' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)' }}>
                      {t.price}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginLeft: '8px' }}>
                      / {t.period}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '28px' }}>
                    {t.description}
                  </p>

                  <h4 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
                    Included Scope & Deliverables
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {t.features.map((feat, fIdx) => (
                      <li key={fIdx} style={{ fontSize: '0.875rem', color: 'var(--text)', display: 'flex', gap: '10px' }}>
                        <span style={{ color: '#10b981' }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={t.ctaLink}
                  className={t.isPopular ? 'btn btn-primary' : 'btn btn-outline'}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {t.ctaText} &rarr;
                </Link>
              </div>
            ))}
          </div>

          {/* Ongoing SLA Retainer Box */}
          <div style={{
            marginTop: '64px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}>
            <div>
              <span className="eyebrow">Maintenance & Support Guarantee</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '8px 0 12px 0' }}>
                Continuous Operations & SLA Retainers
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                Foundation models evolve rapidly and enterprise APIs change. Our retainer agreements guarantee sub-1-hour emergency incident response, prompt maintenance, model upgrades, and proactive monitoring.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'var(--surface-strong)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>Standard Production SLA</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 700 }}>$3,500 / mo</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>
                  4-hour incident response, model maintenance, 10 hrs monthly engineering.
                </div>
              </div>

              <div style={{ background: 'var(--surface-strong)', padding: '16px', borderRadius: '8px', border: '1px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>Mission-Critical Enterprise SLA</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 700 }}>$7,500 / mo</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>
                  1-hour dedicated on-call engineer, continuous drift tuning, 25 hrs monthly engineering.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

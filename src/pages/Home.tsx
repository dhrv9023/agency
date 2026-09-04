import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { SOLUTIONS } from '../data/solutions';
import { WorkflowSimulator } from '../components/interactive/WorkflowSimulator';
import { RoiCalculator } from '../components/interactive/RoiCalculator';

export const Home: React.FC = () => {

  return (
    <div className="home-page">
      {/* SECTION 1: HOMEPAGE HERO (Video & Direct Composition) */}
      <section className="hero-section" aria-label="Hero">
        <video className="hero-video-bg" autoPlay muted loop playsInline preload="auto">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay-gradient"></div>

        <div className="hero-content">
          {/* Trust Indicator Pill */}
          <div className="trust-badge">
            <span className="trust-badge-dot"></span>
            <span>Trusted by Engineering & Operations Leaders</span>
          </div>

          {/* Retro Dot-Matrix Headline */}
          <h1 className="hero-title">
            <span>INTELLIGENCE</span>
            <span>DESIGNED TO EVOLVE</span>
          </h1>

          {/* Subheadline */}
          <p className="hero-subtitle">
            {BRAND.name} builds autonomous, deterministic systems that eliminate manual bottlenecks, orchestrate enterprise workflows, and scale your operations without linear hiring.
          </p>

          {/* CTAs */}
          <div className="hero-cta-group">
            <Link to="/contact" className="btn btn-primary">Start a Project</Link>
            <Link to="/solutions" className="btn btn-secondary">Explore Solutions</Link>
          </div>

          {/* 4 Statistics Typographic Strip */}
          <div className="hero-stats-wrapper">
            <div className="stats-strip">
              <div className="stat-cell">
                <span className="stat-label-top">&lt; Latency</span>
                <div className="stat-value">{BRAND.stats.latency}</div>
                <div className="stat-label">Inference-Ready Execution</div>
              </div>
              <div className="stat-cell">
                <span className="stat-label-top">Scope</span>
                <div className="stat-value">{BRAND.stats.scope}</div>
                <div className="stat-label">Scalable Workflows</div>
              </div>
              <div className="stat-cell">
                <span className="stat-label-top">Uptime</span>
                <div className="stat-value">{BRAND.stats.uptime}</div>
                <div className="stat-label">Autonomous Operation</div>
              </div>
              <div className="stat-cell">
                <span className="stat-label-top">Precision</span>
                <div className="stat-value">{BRAND.stats.precision}</div>
                <div className="stat-label">Deterministic Guardrails</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE OPERATIONAL BOTTLENECK (Editorial Comparison) */}
      <section className="section section-secondary" aria-labelledby="problem-heading">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">01 // The Operational Bottleneck</span>
            <h2 id="problem-heading" className="section-title" style={{ maxWidth: '960px' }}>
              Your business is already running on systems.<br />
              Most of them just aren't intelligent.
            </h2>
            <p className="section-subtitle">
              Your team loses hundreds of hours moving information between fragmented SaaS tools, answering repetitive questions, extracting data from PDF invoices, and reconciling records. We identify those operational chokepoints and re-engineer them into self-healing, automated pipelines.
            </p>
          </div>

          {/* Editorial Monochromatic Workflow Comparison */}
          <div className="workflow-editorial-comparison">
            {/* Traditional Flow */}
            <div className="workflow-band">
              <div className="workflow-band-meta">
                <span className="text-muted">TRADITIONAL FRAGMENTED WORKFLOW (MANUAL LATENCY)</span>
                <span className="text-muted">AVG LATENCY: 4–24 HOURS</span>
              </div>
              <div className="workflow-seq-chain">
                <span className="seq-node">Inbound Lead</span>
                <span className="seq-arrow">&rarr;</span>
                <span className="seq-node">Manual CRM Entry</span>
                <span className="seq-arrow">&rarr;</span>
                <span className="seq-node">SDR Email</span>
                <span className="seq-arrow">&rarr;</span>
                <span className="seq-node">Human Triage</span>
                <span className="seq-arrow">&rarr;</span>
                <span className="seq-node">Spreadsheet Sync</span>
                <span className="seq-arrow">&rarr;</span>
                <span className="seq-node">Delayed Follow-up</span>
              </div>
            </div>

            {/* Intelligent Flow */}
            <div className="workflow-band highlight-band">
              <div className="workflow-band-meta">
                <span style={{ color: '#10b981', fontWeight: 600 }}>{BRAND.shortName} AUTONOMOUS EVENT PIPELINE</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>AVG LATENCY: &lt; 400 MILLISECONDS</span>
              </div>
              <div className="workflow-seq-chain">
                <span className="seq-node active">Webhook Trigger</span>
                <span className="seq-arrow active">&rarr;</span>
                <span className="seq-node active">Clearbit Enrichment</span>
                <span className="seq-arrow active">&rarr;</span>
                <span className="seq-node active">Deterministic Gating</span>
                <span className="seq-arrow active">&rarr;</span>
                <span className="seq-node active">Autonomous Tool Dispatch</span>
                <span className="seq-arrow active">&rarr;</span>
                <span className="seq-node active">Instant Meeting Booked</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE PIPELINE SIMULATOR */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <WorkflowSimulator />
        </div>
      </section>

      {/* SECTION 4: SIGNATURE SOLUTIONS INDEX */}
      <section className="section section-secondary" aria-labelledby="solutions-heading">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">02 // Core Capabilities</span>
            <h2 id="solutions-heading" className="section-title">
              Engineered for Production. Deployed with Guardrails.
            </h2>
            <p className="section-subtitle">
              We specialize in deterministic systems architecture—connecting generative reasoning with reliable, enterprise-grade software engineering.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginTop: '40px'
          }}>
            {SOLUTIONS.map((sol, idx) => (
              <div
                key={sol.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s ease'
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                      {sol.badge}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.375rem', fontWeight: 700, margin: '0 0 12px 0' }}>
                    {sol.title}
                  </h3>

                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '20px' }}>
                    {sol.description}
                  </p>

                  <div style={{
                    background: 'var(--surface-strong)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    marginBottom: '20px',
                    lineHeight: 1.5
                  }}>
                    <strong style={{ color: 'var(--text)' }}>Flow:</strong> {sol.flow}
                  </div>
                </div>

                <Link
                  to={`/solutions/${sol.slug}`}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Inspect Architecture &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE FINANCIAL ROI MODELING */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <RoiCalculator />
        </div>
      </section>

      {/* SECTION 6: CONVERSION STATEMENT */}
      <section className="section section-secondary">
        <div className="container">
          <div className="editorial-conversion-banner">
            <span className="eyebrow">Enterprise Engagement</span>
            <h2 className="editorial-conversion-title">
              Ready to replace manual friction with autonomous precision?
            </h2>
            <p className="editorial-conversion-desc">
              Book a 45-minute architectural discovery session with our founding engineering team. We audit your workflows and deliver a clear systems roadmap.
            </p>
            <div className="hero-cta-group" style={{ justifyContent: 'center', marginTop: '24px' }}>
              <Link to="/book" className="btn btn-primary">Schedule Discovery Call</Link>
              <Link to="/contact" className="btn btn-secondary">Submit Project Brief</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

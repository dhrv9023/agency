import React from 'react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Engineering Philosophy</span>
          <h1 className="page-hero-title">Engineering systems for a more intelligent way of working.</h1>
          <p className="page-hero-desc">
            We believe AI is most valuable when it becomes part of how a company operates—not another disconnected tool employees have to remember to log into.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Large Editorial Statement */}
          <div className="principle-editorial-box">
            <span className="eyebrow">01 // CORE BELIEF</span>
            <h2 className="principle-statement">
              AI IS NOT THE PRODUCT.<br />
              THE SYSTEM IS.
            </h2>
            <p className="text-muted" style={{ fontSize: '1.125rem', lineHeight: 1.7, maxWidth: '820px', marginBottom: '48px' }}>
              The market is saturated with brittle AI wrappers that create more operational friction than they solve. Real business leverage comes from redesigning fundamental workflows around autonomous pipelines, clean data schemas, and verifiable deterministic guardrails.
            </p>

            <span className="eyebrow">02 // MULTIDISCIPLINARY RIGOR</span>
            <table className="principle-matrix-table">
              <tbody>
                <tr className="principle-matrix-row">
                  <td className="principle-cell-when">Business Understanding</td>
                  <td className="principle-cell-use">Deep mapping of economic bottlenecks, team workflows, and unit economics before writing a single line of code.</td>
                </tr>
                <tr className="principle-matrix-row">
                  <td className="principle-cell-when">Automation Engineering</td>
                  <td className="principle-cell-use">Event-driven queues, webhooks, and idempotent API dispatch across enterprise tools with zero data loss.</td>
                </tr>
                <tr className="principle-matrix-row">
                  <td className="principle-cell-when">Software Engineering</td>
                  <td className="principle-cell-use">Robust full-stack systems, type safety, error boundaries, telemetry logging, and production SLAs.</td>
                </tr>
                <tr className="principle-matrix-row">
                  <td className="principle-cell-when">Foundation AI Models</td>
                  <td className="principle-cell-use">Multi-modal reasoning, structured entity extraction, and grounded RAG pipelines with line-level source attribution.</td>
                </tr>
                <tr className="principle-matrix-row">
                  <td className="principle-cell-when">Systems Thinking</td>
                  <td className="principle-cell-use">Designing feedback loops, self-healing architectures, and scalable operating principles.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
              <span className="eyebrow">Zero Hype</span>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 700, margin: '8px 0 12px 0' }}>Production Over Prototypes</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                We don't build demos that look good in a pitch video and break in production. Every agent and pipeline we ship is backed by integration tests, fallback cascades, and observability.
              </p>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
              <span className="eyebrow">Full Sovereignty</span>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 700, margin: '8px 0 12px 0' }}>Your Code, Your IP</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                You own 100% of the intellectual property, code, and system configurations. Deployed in your cloud infrastructure or on-premise, with strict zero-data-retention guarantees.
              </p>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
              <span className="eyebrow">Senior Engineering</span>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 700, margin: '8px 0 12px 0' }}>Partner-Led Execution</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                You work directly with senior systems architects who understand both software engineering and corporate economics—never passed down to junior offshore contractors.
              </p>
            </div>
          </div>

          <div className="editorial-conversion-banner" style={{ marginTop: '80px' }}>
            <span className="eyebrow">Start Working Smarter</span>
            <h2 className="editorial-conversion-title">Build systems that work while you work.</h2>
            <p className="editorial-conversion-desc">Let's audit your processes and architect an intelligent automation pipeline.</p>
            <div className="hero-cta-group" style={{ justifyContent: 'center', marginBottom: 0 }}>
              <Link to="/contact" className="btn btn-primary">Start a Project</Link>
              <Link to="/book" className="btn btn-secondary">Schedule Discovery Call</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

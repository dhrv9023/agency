import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { BRAND } from '../config/brand';

export const Contact: React.FC = () => {
  const { addLead } = useLeads();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState('AI Automation Pipelines');
  const [budget, setBudget] = useState('$20k – $35k');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addLead({
      name,
      email,
      company: company || 'Confidential Client',
      service,
      budget,
      status: 'New Inquiry',
      notes: notes || 'Direct inquiry via project intake form.',
      source: 'Contact Form'
    });

    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Direct Engineering Inquiry</span>
          <h1 className="page-hero-title">Initiate an Architecture Engagement</h1>
          <p className="page-hero-desc">
            Tell us about your current operational friction. Our technical partners review every submission and respond within 24 business hours.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
            {/* Form Column */}
            <div>
              {submitted ? (
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid #10b981',
                  borderRadius: '16px',
                  padding: '48px 32px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    margin: '0 auto 20px auto'
                  }}>
                    ✓
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
                    Project Brief Received
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', marginBottom: '24px' }}>
                    Thank you, {name}. Your requirements have been routed to our founding systems engineering team. We will review your stack and contact you at <strong>{email}</strong>.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-outline btn-sm">
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: 'clamp(24px, 4vw, 40px)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '8px' }}>
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Elena Rostova"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'var(--surface-strong)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text)',
                          fontSize: '0.9375rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '8px' }}>
                        WORK EMAIL *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="elena@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'var(--surface-strong)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text)',
                          fontSize: '0.9375rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '8px' }}>
                        COMPANY / ORGANIZATION
                      </label>
                      <input
                        type="text"
                        placeholder="Acme Global Logistics"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'var(--surface-strong)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text)',
                          fontSize: '0.9375rem'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '8px' }}>
                          FOCUS AREA
                        </label>
                        <select
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            background: 'var(--surface-strong)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text)',
                            fontSize: '0.875rem'
                          }}
                        >
                          <option value="AI Automation Pipelines">AI Automation Pipelines</option>
                          <option value="Autonomous AI Agents">Autonomous AI Agents</option>
                          <option value="Document Intelligence">Document Intelligence</option>
                          <option value="AI Voice Telephony">AI Voice Telephony</option>
                          <option value="Enterprise RAG">Enterprise RAG</option>
                          <option value="Full Systems Overhaul">Full Systems Overhaul</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '8px' }}>
                          BUDGET RANGE
                        </label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            background: 'var(--surface-strong)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text)',
                            fontSize: '0.875rem'
                          }}
                        >
                          <option value="$10k – $20k">$10k – $20k</option>
                          <option value="$20k – $35k">$20k – $35k</option>
                          <option value="$35k – $60k">$35k – $60k</option>
                          <option value="$60k+">$60k+ (Enterprise)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '8px' }}>
                        PROJECT CONTEXT & BOTTLENECKS
                      </label>
                      <textarea
                        rows={4}
                        placeholder="What systems are involved (e.g. SAP, Salesforce, Zendesk)? Where is your team losing the most operational hours?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'var(--surface-strong)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text)',
                          fontSize: '0.9375rem',
                          resize: 'vertical'
                        }}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem', marginTop: '8px' }}
                    >
                      Transmit Project Specification &rarr;
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Direct Details Column */}
            <div>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px'
              }}>
                <div>
                  <span className="eyebrow">Direct Access</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '8px 0 12px 0' }}>
                    Speak With Systems Architects
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                    For urgent RFPs, enterprise security questionnaires, or live inquiries, reach out directly to our engineering partnership:
                  </p>
                  <div style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.9375rem' }}>
                    <a href={`mailto:${BRAND.contactEmail}`} style={{ color: '#10b981', textDecoration: 'none' }}>
                      {BRAND.contactEmail}
                    </a>
                  </div>
                </div>

                <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                  <span className="eyebrow">Instant Calendar Booking</span>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '8px 0 8px 0' }}>
                    Prefer to schedule immediately?
                  </h4>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
                    Lock in a 45-minute technical discovery session directly on our calendar.
                  </p>
                  <a href="/book" className="btn btn-secondary btn-sm">
                    Open Booking Scheduler &rarr;
                  </a>
                </div>

                <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    Global Locations
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    {BRAND.address}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

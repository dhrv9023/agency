import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const RoiCalculator: React.FC = () => {
  const [headcount, setHeadcount] = useState<number>(25);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  const [hourlyRate, setHourlyRate] = useState<number>(45);

  // Calculations
  const annualHoursSpent = headcount * hoursPerWeek * 50;
  const annualCostOfBottleneck = annualHoursSpent * hourlyRate;
  const projectedReclaimedHours = Math.round(annualHoursSpent * 0.75);
  const projectedAnnualSavings = Math.round(annualCostOfBottleneck * 0.75);

  return (
    <div className="roi-calculator-container" style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: 'clamp(24px, 4vw, 48px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      margin: '40px 0'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
        <span className="eyebrow">Interactive Financial Impact Modeling</span>
        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, margin: '12px 0' }}>
          Quantify the Cost of Your Operational Inefficiencies
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
          Manual data entry, repetitive inquiry triage, and disconnected software handoffs silently drain enterprise EBITDA. Adjust the parameters below to compute your projected capital reclamation.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        alignItems: 'center'
      }}>
        {/* Sliders Input Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Slider 1: Headcount */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Knowledge Workers & Operations Team
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)' }}>
                {headcount} Employees
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="250"
              step="1"
              value={headcount}
              onChange={(e) => setHeadcount(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>
              <span>3</span>
              <span>125</span>
              <span>250+</span>
            </div>
          </div>

          {/* Slider 2: Hours per Week */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Manual Admin & Ingestion Hours / Wk / Person
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)' }}>
                {hoursPerWeek} hrs / week
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>
              <span>2 hrs</span>
              <span>12 hrs</span>
              <span>25 hrs</span>
            </div>
          </div>

          {/* Slider 3: Hourly Rate */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Fully-Loaded Hourly Cost (Salary + Benefits)
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)' }}>
                ${hourlyRate} / hour
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>
              <span>$20/hr</span>
              <span>$85/hr</span>
              <span>$150/hr</span>
            </div>
          </div>
        </div>

        {/* Real-time Calculation Display Panel */}
        <div style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border-strong)',
          borderRadius: '12px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>
              Projected Annual Reclaimed Capital
            </span>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#10b981',
              marginTop: '4px',
              letterSpacing: '-0.02em'
            }}>
              ${projectedAnnualSavings.toLocaleString()}
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', margin: '4px 0 0 0' }}>
              Based on a conservative 75% target workflow automation benchmark.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)'
          }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                HOURS RECLAIMED / YR
              </span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>
                {projectedReclaimedHours.toLocaleString()} hrs
              </div>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                EST. PAYBACK PERIOD
              </span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6', marginTop: '4px' }}>
                &lt; 45 Days
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '8px' }}>
            <Link
              to="/book"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', fontSize: '0.9375rem' }}
            >
              Architect Your Automation Strategy &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

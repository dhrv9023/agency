import React, { useState } from 'react';
import { useLeads } from '../../context/LeadContext';

interface BookingDate {
  dateStr: string;
  dayName: string;
  dayNum: string;
  month: string;
  available: boolean;
}

const AVAILABLE_DATES: BookingDate[] = [
  { dateStr: '2026-09-08', dayName: 'Tue', dayNum: '08', month: 'Sep', available: true },
  { dateStr: '2026-09-09', dayName: 'Wed', dayNum: '09', month: 'Sep', available: true },
  { dateStr: '2026-09-10', dayName: 'Thu', dayNum: '10', month: 'Sep', available: true },
  { dateStr: '2026-09-11', dayName: 'Fri', dayNum: '11', month: 'Sep', available: true },
  { dateStr: '2026-09-14', dayName: 'Mon', dayNum: '14', month: 'Sep', available: true },
  { dateStr: '2026-09-15', dayName: 'Tue', dayNum: '15', month: 'Sep', available: true }
];

const TIME_SLOTS = [
  '09:00 AM EST',
  '11:00 AM EST',
  '01:30 PM EST',
  '03:00 PM EST',
  '04:30 PM EST'
];

export const BookingScheduler: React.FC = () => {
  const { addLead } = useLeads();
  const [selectedDate, setSelectedDate] = useState<BookingDate>(AVAILABLE_DATES[0]);
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[1]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState('AI Automation & Agent Pipelines');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addLead({
      name,
      email,
      company: company || 'Confidential Client',
      service,
      budget: '$25,000 – $50,000',
      status: 'Discovery Booked',
      notes: notes || 'Booked via interactive discovery scheduler.',
      slot: `${selectedDate.dayName}, ${selectedDate.month} ${selectedDate.dayNum}, 2026 @ ${selectedTime}`,
      source: 'Discovery Scheduler'
    });

    setIsSubmitted(true);
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: 'clamp(24px, 4vw, 40px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      {isSubmitted ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10b981',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 20px auto'
          }}>
            ✓
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
            Discovery Architecture Session Confirmed
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 24px auto' }}>
            We have locked in your 45-minute technical roadmap session for:
          </p>
          <div style={{
            display: 'inline-block',
            background: 'var(--surface-strong)',
            border: '1px solid var(--border)',
            padding: '12px 24px',
            borderRadius: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            color: '#10b981',
            marginBottom: '24px'
          }}>
            {selectedDate.dayName}, {selectedDate.month} {selectedDate.dayNum}, 2026 at {selectedTime}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
            A calendar invitation and pre-meeting architectural questionnaire have been dispatched to <strong>{email}</strong>.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '20px' }}
          >
            Book Another Session
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {/* Left Column: Calendar Date & Time Slot Picker */}
            <div>
              <span className="eyebrow">Step 01 // Select Session Window</span>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '8px 0 16px 0' }}>
                Available Engineering Slots
              </h4>

              {/* Date Pills Grid */}
              <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Select Date
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '8px', marginBottom: '20px' }}>
                {AVAILABLE_DATES.map((date) => {
                  const isSelected = selectedDate.dateStr === date.dateStr;
                  return (
                    <button
                      type="button"
                      key={date.dateStr}
                      onClick={() => setSelectedDate(date)}
                      style={{
                        background: isSelected ? 'var(--text)' : 'var(--surface-strong)',
                        color: isSelected ? 'var(--bg)' : 'var(--text)',
                        border: isSelected ? '1px solid var(--text)' : '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '10px 6px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8 }}>{date.dayName}</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: 'var(--font-mono)', margin: '2px 0' }}>{date.dayNum}</div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{date.month}</div>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots */}
              <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Select Time Slot (45 Minutes)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {TIME_SLOTS.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      style={{
                        background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--surface-strong)',
                        color: isSelected ? '#10b981' : 'var(--text)',
                        border: isSelected ? '1px solid #10b981' : '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{time}</span>
                      {isSelected && <span>● Selected</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Contact & Scope Questionnaire */}
            <div>
              <span className="eyebrow">Step 02 // Engineering Scope</span>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '8px 0 16px 0' }}>
                Your Organization
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '6px' }}>
                    YOUR FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--surface-strong)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '6px' }}>
                    WORK EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--surface-strong)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '6px' }}>
                    COMPANY / DOMAIN
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Global Inc."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--surface-strong)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '6px' }}>
                    CORE ARCHITECTURAL FOCUS
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
                    <option value="AI Automation & Agent Pipelines">AI Automation & Autonomous Agents</option>
                    <option value="Document Intelligence & 3-Way Matching">Document Intelligence & Financial OCR</option>
                    <option value="Real-Time Telephony & Voice Dispatch">AI Voice Telephony & 24/7 Dispatch</option>
                    <option value="Enterprise Knowledge Retrieval (RAG)">Enterprise Knowledge Retrieval (RAG)</option>
                    <option value="Full Operations Overhaul">Full Operational Systems Audit</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '6px' }}>
                    CURRENT OPERATIONAL BOTTLENECK
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what repetitive manual process or software friction you want re-engineered..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--surface-strong)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px' }}
                >
                  Confirm Technical Consultation &rarr;
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

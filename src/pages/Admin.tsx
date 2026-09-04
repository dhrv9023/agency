import React, { useState } from 'react';
import { useLeads, Lead } from '../context/LeadContext';
import { BRAND } from '../config/brand';

export const Admin: React.FC = () => {
  const { leads, updateLeadStatus, deleteLead } = useLeads();
  const [activeTab, setActiveTab] = useState<'leads' | 'telemetry' | 'add'>('leads');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtering
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Email', 'Company', 'Service', 'Budget', 'Status', 'Source', 'Notes'];
    const rows = leads.map((l) => [
      l.id,
      l.date,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.company}"`,
      `"${l.service}"`,
      `"${l.budget}"`,
      `"${l.status}"`,
      `"${l.source}"`,
      `"${l.notes.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `valence_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-portal" style={{ minHeight: '100vh', background: '#070709', color: '#fff', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Top Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: '24px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#10b981', letterSpacing: '0.1em' }}>
                OPERATIONS COMMAND COCKPIT
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: 800, margin: '6px 0 0 0' }}>
              {BRAND.name} // System Portal
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={exportCSV}
              className="btn btn-outline btn-sm"
              style={{ padding: '8px 14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <i className="fa-solid fa-download"></i> Export CSV ({leads.length})
            </button>
            <span style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              padding: '6px 12px',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem'
            }}>
              Cluster: US-EAST-1 // 99.98% Healthy
            </span>
          </div>
        </div>

        {/* 4 KPI Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{ background: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#888' }}>TOTAL INQUIRIES & LEADS</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              {leads.length}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#10b981' }}>+2 New This Week</span>
          </div>

          <div style={{ background: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#888' }}>DISCOVERY CALLS BOOKED</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
              {leads.filter((l) => l.status === 'Discovery Booked').length}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#888' }}>Confirmed On Calendar</span>
          </div>

          <div style={{ background: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#888' }}>INSPECTION TELEMETRY</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: '#3b82f6', marginTop: '6px' }}>
              340ms
            </div>
            <span style={{ fontSize: '0.7rem', color: '#888' }}>Average Inference Latency</span>
          </div>

          <div style={{ background: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#888' }}>RECLAIMED CLIENT VALUE</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>
              $1.2M+
            </div>
            <span style={{ fontSize: '0.7rem', color: '#888' }}>Cumulative Annual EBITDA</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('leads')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'leads' ? '2px solid #10b981' : '2px solid transparent',
              color: activeTab === 'leads' ? '#fff' : '#888',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              padding: '10px 16px',
              cursor: 'pointer'
            }}
          >
            Leads & Intake Pipeline ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'telemetry' ? '2px solid #10b981' : '2px solid transparent',
              color: activeTab === 'telemetry' ? '#fff' : '#888',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              padding: '10px 16px',
              cursor: 'pointer'
            }}
          >
            Cluster Telemetry & Health
          </button>
        </div>

        {/* Tab 1: Leads Table */}
        {activeTab === 'leads' && (
          <div>
            {/* Filter Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search by company, name, email, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: '#0e0f14',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  minWidth: '320px',
                  flex: 1
                }}
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'New Inquiry', 'Discovery Booked', 'Under Review', 'Proposal Sent', 'Closed Won'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      background: statusFilter === st ? '#10b981' : '#0e0f14',
                      color: statusFilter === st ? '#000' : '#888',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{
              background: '#0e0f14',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              overflowX: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#12141c' }}>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#888', fontSize: '0.75rem' }}>ID & DATE</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#888', fontSize: '0.75rem' }}>CLIENT / CONTACT</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#888', fontSize: '0.75rem' }}>SERVICE SCOPE</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#888', fontSize: '0.75rem' }}>BUDGET</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#888', fontSize: '0.75rem' }}>STATUS</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#888', fontSize: '0.75rem' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((l) => (
                    <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#888' }}>
                        <div style={{ color: '#fff', fontWeight: 600 }}>{l.id}</div>
                        <div>{l.date}</div>
                        {l.slot && <div style={{ color: '#10b981', marginTop: '2px' }}>{l.slot}</div>}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{l.name}</div>
                        <div style={{ color: '#888', fontSize: '0.8125rem' }}>{l.email}</div>
                        <div style={{ color: '#3b82f6', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{l.company}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: '#fff' }}>{l.service}</div>
                        <div style={{ color: '#888', fontSize: '0.75rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {l.notes}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#10b981' }}>
                        {l.budget}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={l.status}
                          onChange={(e) => updateLeadStatus(l.id, e.target.value as Lead['status'])}
                          style={{
                            background: '#14151d',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '6px',
                            color: l.status === 'Closed Won' ? '#10b981' : l.status === 'Discovery Booked' ? '#3b82f6' : '#f59e0b',
                            padding: '6px 8px',
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          <option value="New Inquiry">New Inquiry</option>
                          <option value="Discovery Booked">Discovery Booked</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Closed Won">Closed Won</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => deleteLead(l.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                          title="Delete Lead"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        No inquiries match the active filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Telemetry */}
        {activeTab === 'telemetry' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px' }}>API Dispatch Health</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>Claude 3.5 Sonnet Router:</span>
                  <span style={{ color: '#10b981' }}>285ms (Healthy)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>GPT-4o Extraction Pipeline:</span>
                  <span style={{ color: '#10b981' }}>312ms (Healthy)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>Qdrant Vector Cluster:</span>
                  <span style={{ color: '#10b981' }}>24ms (Instant)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>Twilio SIP Telephony Trunk:</span>
                  <span style={{ color: '#10b981' }}>18ms (Live)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>Temporal Worker Queues:</span>
                  <span style={{ color: '#10b981' }}>0 Backlogged</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#0e0f14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px' }}>Security & Policy Boundaries</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>SOC2 Policy Verification:</span>
                  <span style={{ color: '#10b981' }}>Enforced</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>Zero Model Training Gate:</span>
                  <span style={{ color: '#10b981' }}>Active (Opt-Out 100%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>PII Masking Filter:</span>
                  <span style={{ color: '#10b981' }}>Grounded Pre-Inference</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>Idempotent Mutation Hash:</span>
                  <span style={{ color: '#10b981' }}>Enabled</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

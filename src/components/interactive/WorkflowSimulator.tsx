import React, { useState } from 'react';

interface Scenario {
  id: string;
  name: string;
  trigger: string;
  steps: { stage: string; action: string; durationMs: number; status: 'ok' | 'flagged' }[];
  resultSummary: string;
  confidence: string;
  totalLatency: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'lead',
    name: 'Enterprise Inbound Triage',
    trigger: 'Webhook: Form Submitted (VP Ops @ Fortune 500 Freight Co.)',
    steps: [
      { stage: '01 // INGESTION', action: 'Deduplicated event payload, extracted domain @fortune500freight.com', durationMs: 42, status: 'ok' },
      { stage: '02 // ENRICHMENT', action: 'Queried Clearbit + Apollo: Company ARR $2.4B, 8,200 FTEs, CRM Salesforce', durationMs: 110, status: 'ok' },
      { stage: '03 // ICP SCORING', action: 'Gating Matrix evaluated: Tier-1 Strategic Target (Score: 98/100)', durationMs: 35, status: 'ok' },
      { stage: '04 // ROUTING', action: 'Generated customized discovery calendar slot, synced CRM contact & account', durationMs: 88, status: 'ok' },
      { stage: '05 // DISPATCH', action: 'Dispatched personalized calendar invite & prepared pre-meeting brief for Managing Partner', durationMs: 65, status: 'ok' }
    ],
    resultSummary: 'Enterprise lead qualified, Salesforce account updated, and meeting booked with zero human lag.',
    confidence: '99.8%',
    totalLatency: '340ms'
  },
  {
    id: 'invoice',
    name: 'Multi-Modal Invoice & 3-Way Match',
    trigger: 'SFTP Ingest: Multi-page PDF Bill of Lading & Commercial Invoice (EUR 84,250.00)',
    steps: [
      { stage: '01 // OCR EXTRACT', action: 'Multi-modal vision model extracted 48 line items across 3 scanned pages', durationMs: 195, status: 'ok' },
      { stage: '02 // MATH VERIFY', action: 'Deterministic ledger balance test: Line items sum matches gross EUR 84,250.00', durationMs: 22, status: 'ok' },
      { stage: '03 // ERP LOOKUP', action: 'SAP S/4HANA PO #49021 queried: item quantities and vendor tax ID verified', durationMs: 94, status: 'ok' },
      { stage: '04 // TOLERANCE GATE', action: 'Variance within approved threshold (< 0.01%). Safe auto-approval verified', durationMs: 40, status: 'ok' },
      { stage: '05 // RECONCILE', action: 'Wrote approval transaction code to SAP ledger with immutable audit hash', durationMs: 78, status: 'ok' }
    ],
    resultSummary: '100% automated 3-way reconciliation completed without human manual data entry.',
    confidence: '99.9%',
    totalLatency: '429ms'
  },
  {
    id: 'support',
    name: 'Autonomous Customer Action Resolver',
    trigger: 'Inbound API: Customer requested urgent shipping address update for in-transit order #89214',
    steps: [
      { stage: '01 // INTENT CLASSIFY', action: 'Identified high-priority order mutation intent with verified customer email', durationMs: 50, status: 'ok' },
      { stage: '02 // GUARDRAIL CHECK', action: 'Evaluated fraud prevention policy: Destination country matches billing KYC', durationMs: 38, status: 'ok' },
      { stage: '03 // CARRIER API', action: 'Dispatched direct address mutation webhook to FedEx ShipManager API', durationMs: 145, status: 'ok' },
      { stage: '04 // DB COMMIT', action: 'Updated Shopify order fulfillment record & generated tracking confirmation email', durationMs: 62, status: 'ok' },
      { stage: '05 // RESOLUTION', action: 'Closed Zendesk ticket with automated customer response containing updated label', durationMs: 45, status: 'ok' }
    ],
    resultSummary: 'Order rerouted at carrier level in sub-second time without customer support agent intervention.',
    confidence: '100.0%',
    totalLatency: '340ms'
  }
];

export const WorkflowSimulator: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('lead');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [visibleStepsCount, setVisibleStepsCount] = useState<number>(0);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  const runSimulation = () => {
    setIsRunning(true);
    setVisibleStepsCount(0);
    setHasCompleted(false);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setVisibleStepsCount(current);
      if (current >= scenario.steps.length) {
        clearInterval(interval);
        setIsRunning(false);
        setHasCompleted(true);
      }
    }, 450);
  };

  return (
    <div className="workflow-simulator-wrapper" style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: 'clamp(20px, 3vw, 40px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      margin: '40px 0'
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div>
          <span className="eyebrow">Real-Time Telemetry Sandbox</span>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: 700, margin: '4px 0' }}>
            Autonomous Pipeline Simulator
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', margin: 0 }}>
            Inspect how deterministic guardrails and event-driven agents execute in live production.
          </p>
        </div>

        {/* Scenario Selector Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => {
                setActiveScenarioId(sc.id);
                setVisibleStepsCount(0);
                setHasCompleted(false);
              }}
              style={{
                background: activeScenarioId === sc.id ? 'var(--text)' : 'var(--surface-strong)',
                color: activeScenarioId === sc.id ? 'var(--bg)' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '8px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {sc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Terminal Panel */}
      <div style={{
        background: '#040406',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)'
      }}>
        {/* Terminal Header */}
        <div style={{
          background: '#0d0e12',
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            <span style={{ color: '#888', fontSize: '0.75rem', marginLeft: '12px' }}>
              pipeline_runner.ts — [TENANT: PROD_DISPATCH_CLUSTER_01]
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
            <span style={{ color: '#10b981' }}>● KERNEL ACTIVE</span>
          </div>
        </div>

        {/* Trigger Banner */}
        <div style={{
          padding: '14px 20px',
          background: 'rgba(59, 130, 246, 0.08)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
          fontSize: '0.8125rem',
          color: '#93c5fd',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ color: '#3b82f6', fontWeight: 700 }}>[EVENT_INGEST]</span>
          <span>{scenario.trigger}</span>
        </div>

        {/* Console Steps Log */}
        <div style={{ padding: '20px', minHeight: '220px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visibleStepsCount === 0 && !isRunning && !hasCompleted && (
            <div style={{ color: '#666', fontSize: '0.8125rem', padding: '24px 0', textAlign: 'center' }}>
              Press "Simulate Pipeline Execution" below to stream live execution telemetry...
            </div>
          )}

          {scenario.steps.slice(0, visibleStepsCount).map((step, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.8125rem',
                animation: 'fadeIn 0.2s ease-in'
              }}
            >
              <span style={{ color: '#10b981', minWidth: '140px', fontWeight: 600 }}>
                {step.stage}
              </span>
              <span style={{ color: '#ffffff', flex: 1 }}>
                {step.action}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                +{step.durationMs}ms
              </span>
            </div>
          ))}

          {isRunning && (
            <div style={{ color: '#10b981', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', animation: 'spin 1s infinite linear' }}>⟳</span>
              ReAct reasoning loop evaluating next tool call...
            </div>
          )}

          {hasCompleted && (
            <div style={{
              marginTop: '12px',
              padding: '12px 16px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '8px',
              color: '#10b981',
              fontSize: '0.8125rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>[EXECUTION_RESOLVED]</strong> {scenario.resultSummary}
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                <span>LATENCY: <strong>{scenario.totalLatency}</strong></span>
                <span>CONFIDENCE: <strong>{scenario.confidence}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Action Bottom Bar */}
        <div style={{
          padding: '12px 20px',
          background: '#090a0e',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#666' }}>
            IDEMPOTENCY: STRICT • MEMORY: SANDBOXED • TELEMETRY: LOGGED
          </span>

          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="btn btn-primary btn-sm"
            style={{ padding: '8px 16px', fontSize: '0.8125rem', opacity: isRunning ? 0.6 : 1 }}
          >
            {isRunning ? 'Processing Event...' : hasCompleted ? 'Re-Run Pipeline' : 'Simulate Pipeline Execution ▶'}
          </button>
        </div>
      </div>
    </div>
  );
};

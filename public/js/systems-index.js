/**
 * AI SYSTEMS & AUTOMATION AGENCY — INTERACTIVE AI SYSTEMS INDEX
 * Powers Section 02: "02 // WHAT WE BUILD"
 * 
 * Features:
 * - Radial / Orbital coordinate interface with 6 system modules
 * - Dynamic SVG vector rays and traveling data particles
 * - System Readout panel with smooth 300ms transitions
 * - Dynamic Micro-Flow signal strip (strictly internal to readout)
 * - Persistent fast-switcher System Index ribbon
 * - Full keyboard accessibility (Arrow keys, Tab, Enter/Space)
 * - Auto-rotation with manual lock upon interaction
 * - prefers-reduced-motion graceful degradation
 */

(function () {
  'use strict';

  // System Definitions strictly preserving all 6 solutions, flows, and tools
  const SYSTEMS_DATA = {
    '01': {
      id: '01',
      code: 'SYS_01',
      category: 'REVENUE ENGINE',
      shortCat: 'REVENUE',
      title: 'AI Lead Qualification & Booking',
      desc: 'Engage inbound inquiries promptly, qualify requirements and availability, and schedule sales calls directly on your calendar.',
      flowSteps: ['INBOUND', 'QUALIFY', 'SCORE', 'BOOK'],
      stack: ['WHATSAPP', 'HUBSPOT / CRM', 'CALENDAR'],
      outcome: 'RAPID RESPONSE',
      latency: 'AUTOMATED',
      link: 'solutions/ai-sales.html',
      angleDeg: 300, // Top-Left
      nodePos: { cx: 135, cy: 95 }
    },
    '02': {
      id: '02',
      code: 'SYS_02',
      category: '24/7 OPERATIONS',
      shortCat: 'OPERATIONS',
      title: 'Autonomous Customer Support Agent',
      desc: 'Resolve high-volume routine customer tickets across WhatsApp, Web & Email with structured human handoff for edge cases.',
      flowSteps: ['MESSAGE', 'UNDERSTAND', 'RESOLVE', 'HANDOFF'],
      stack: ['WHATSAPP', 'ZENDESK / INTERCOM', 'EMAIL'],
      outcome: 'ROUTINE DEFLECTION',
      latency: 'REAL-TIME',
      link: 'solutions/ai-customer-support.html',
      angleDeg: 0, // Top
      nodePos: { cx: 270, cy: 30 }
    },
    '03': {
      id: '03',
      code: 'SYS_03',
      category: 'TELEPHONY',
      shortCat: 'TELEPHONY',
      title: 'AI Voice Phone Receptionist',
      desc: 'Natural conversational voice AI that answers inbound phone calls promptly, answers FAQs, qualifies prospects, and books appointments.',
      flowSteps: ['CALL', 'ANSWER', 'QUALIFY', 'BOOK'],
      stack: ['TWILIO / SIP', 'VAPI / RETELL', 'CALENDAR'],
      outcome: 'PROMPT RESPONSE',
      latency: 'LOW LATENCY',
      link: 'solutions/ai-voice.html',
      angleDeg: 60, // Top-Right
      nodePos: { cx: 405, cy: 95 }
    },
    '04': {
      id: '04',
      code: 'SYS_04',
      category: 'TEAM EFFICIENCY',
      shortCat: 'KNOWLEDGE',
      title: 'Company SOP & Knowledge Assistant',
      desc: 'Turn scattered Notion docs, contracts, and training manuals into an internal Slack/Teams bot delivering verified answers with source citations.',
      flowSteps: ['QUESTION', 'RETRIEVE', 'VERIFY', 'ANSWER'],
      stack: ['NOTION', 'GOOGLE DRIVE', 'SLACK', 'TEAMS'],
      outcome: 'VERIFIED CITATIONS',
      latency: 'GROUNDED RETRIEVAL',
      link: 'solutions/ai-knowledge.html',
      angleDeg: 120, // Bottom-Right
      nodePos: { cx: 405, cy: 445 }
    },
    '05': {
      id: '05',
      code: 'SYS_05',
      category: 'PAPERWORK',
      shortCat: 'DOCUMENTS',
      title: 'Document & Invoice Intelligence',
      desc: 'Extract table items, line totals, and tax data from PDF invoices automatically with structured validation and direct post to QuickBooks or ERP.',
      flowSteps: ['DOCUMENT', 'EXTRACT', 'VALIDATE', 'POST'],
      stack: ['PDF / OCR', 'QUICKBOOKS', 'XERO / SAP'],
      outcome: 'VALIDATED DATA',
      latency: 'BATCH / STREAM',
      link: 'solutions/document-intelligence.html',
      angleDeg: 180, // Bottom
      nodePos: { cx: 270, cy: 510 }
    },
    '06': {
      id: '06',
      code: 'SYS_06',
      category: 'DATAFLOW',
      shortCat: 'DATAFLOW',
      title: 'Autonomous Workflow Pipelines',
      desc: 'Connect your disconnected software tools into self-healing, event-driven pipelines that eliminate manual spreadsheet data transfers.',
      flowSteps: ['EVENT', 'DECIDE', 'EXECUTE', 'SYNC'],
      stack: ['WEBHOOKS', 'POSTGRES', 'STRIPE', 'AIRTABLE'],
      outcome: 'ZERO BOTTLENECK',
      latency: 'EVENT-DRIVEN',
      link: 'solutions/ai-automation.html',
      angleDeg: 240, // Bottom-Left
      nodePos: { cx: 135, cy: 445 }
    }
  };

  class SystemsIndexController {
    constructor() {
      this.console = document.getElementById('systems-index-console');
      if (!this.console) return;

      this.activeId = '01';
      this.isLockedByUser = false;
      this.autoTimer = null;
      this.particleAnimId = null;
      this.particles = [];
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // DOM Elements
      this.nodes = Array.from(this.console.querySelectorAll('.radial-node-module'));
      this.fastItems = Array.from(this.console.querySelectorAll('.fast-switch-item'));
      this.mobileRows = Array.from(this.console.querySelectorAll('.mobile-index-row'));
      this.ribbonActiveId = document.getElementById('ribbon-active-id');
      this.vectorRay = document.getElementById('active-vector-ray');
      this.particleLayer = document.getElementById('radial-particles-layer');
      this.readoutFrame = document.querySelector('.readout-frame');

      // Readout Elements
      this.readoutSysId = document.getElementById('readout-sys-id');
      this.readoutTitle = document.getElementById('readout-title');
      this.readoutDesc = document.getElementById('readout-desc');
      this.readoutOutcome = document.getElementById('readout-outcome-text');
      this.readoutLatency = document.getElementById('readout-latency-badge');
      this.readoutFlow = document.getElementById('readout-micro-flow');
      this.readoutStack = document.getElementById('readout-stack-pills');
      this.readoutLink = document.getElementById('readout-link');

      this.init();
    }

    init() {
      this.bindEvents();
      this.updateSystem(this.activeId, false);
      this.setupObserver();

      if (!this.reducedMotion) {
        this.startParticleLoop();
      }
    }

    bindEvents() {
      // Radial nodes: hover and click
      this.nodes.forEach((node) => {
        const sysId = node.dataset.sysId;

        node.addEventListener('mouseenter', () => {
          this.isLockedByUser = true;
          this.clearAutoTimer();
          this.updateSystem(sysId, true);
        });

        node.addEventListener('click', (e) => {
          e.preventDefault();
          this.isLockedByUser = true;
          this.clearAutoTimer();
          this.updateSystem(sysId, true);
        });

        // Keyboard navigation
        node.addEventListener('keydown', (e) => {
          this.handleKeyNav(e, sysId);
        });
      });

      // Bottom fast switch list items
      this.fastItems.forEach((btn) => {
        const sysId = btn.dataset.fastId;

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.isLockedByUser = true;
          this.clearAutoTimer();
          this.updateSystem(sysId, true);
        });

        btn.addEventListener('mouseenter', () => {
          this.isLockedByUser = true;
          this.clearAutoTimer();
          this.updateSystem(sysId, true);
        });
      });

      // Mobile stacked index rows
      this.mobileRows.forEach((row) => {
        const sysId = row.dataset.sysId;

        row.addEventListener('click', (e) => {
          e.preventDefault();
          this.isLockedByUser = true;
          this.clearAutoTimer();
          this.updateSystem(sysId, true);
        });
      });
    }

    handleKeyNav(e, currentId) {
      const keys = ['01', '02', '03', '04', '05', '06'];
      const idx = keys.indexOf(currentId);
      let nextId = null;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextId = keys[(idx + 1) % keys.length];
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextId = keys[(idx - 1 + keys.length) % keys.length];
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.updateSystem(currentId, true);
        return;
      }

      if (nextId) {
        this.isLockedByUser = true;
        this.clearAutoTimer();
        this.updateSystem(nextId, true);
        const targetBtn = this.console.querySelector(`.radial-node-module[data-sys-id="${nextId}"]`);
        if (targetBtn) targetBtn.focus();
      }
    }

    updateSystem(sysId, animated = true) {
      const data = SYSTEMS_DATA[sysId];
      if (!data) return;

      this.activeId = sysId;

      // 1. Update Ribbon
      if (this.ribbonActiveId) {
        this.ribbonActiveId.textContent = `${data.code} // ${data.category}`;
      }

      // 2. Update Radial Nodes active class
      this.nodes.forEach((node) => {
        const isActive = node.dataset.sysId === sysId;
        node.classList.toggle('is-active-node', isActive);
        node.setAttribute('aria-selected', isActive ? 'true' : 'false');
        node.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      // 3. Update Fast Switch Ribbon
      this.fastItems.forEach((btn) => {
        const isActive = btn.dataset.fastId === sysId;
        btn.classList.toggle('is-active', isActive);
      });

      // 4. Update Mobile Stacked Index Rows
      this.mobileRows.forEach((row) => {
        const isActive = row.dataset.sysId === sysId;
        row.classList.toggle('is-active', isActive);
        row.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // 4. Update SVG Active Vector Ray (Connects Center 270,270 to target node)
      if (this.vectorRay) {
        const target = data.nodePos;
        this.vectorRay.setAttribute('x1', '270');
        this.vectorRay.setAttribute('y1', '270');
        this.vectorRay.setAttribute('x2', target.cx);
        this.vectorRay.setAttribute('y2', target.cy);
        this.vectorRay.classList.add('pulse-active');
        setTimeout(() => this.vectorRay.classList.remove('pulse-active'), 400);
      }

      // Spawn a signal packet on node switch
      if (!this.reducedMotion) {
        this.spawnParticle(data.nodePos);
      }

      // 5. Update Readout with smooth 250ms fade transition
      if (animated && this.readoutFrame) {
        this.readoutFrame.classList.add('is-transitioning');
        setTimeout(() => {
          this.renderReadoutContent(data);
          this.readoutFrame.classList.remove('is-transitioning');
        }, 150);
      } else {
        this.renderReadoutContent(data);
      }
    }

    renderReadoutContent(data) {
      if (this.readoutSysId) this.readoutSysId.textContent = `SYSTEM ${data.id} // ${data.category}`;
      if (this.readoutTitle) this.readoutTitle.textContent = data.title;
      if (this.readoutDesc) this.readoutDesc.textContent = data.desc;
      if (this.readoutOutcome) this.readoutOutcome.textContent = data.outcome;
      if (this.readoutLatency) this.readoutLatency.textContent = data.latency;
      if (this.readoutLink) {
        this.readoutLink.setAttribute('href', data.link);
        const span = this.readoutLink.querySelector('span');
        if (span) span.textContent = `Inspect ${data.category} Spec`;
      }

      // Render Micro-Flow Track (Only inside Readout Panel)
      if (this.readoutFlow) {
        this.readoutFlow.innerHTML = data.flowSteps
          .map((step, idx) => {
            const isLast = idx === data.flowSteps.length - 1;
            return `
              <div class="flow-node-step ${isLast ? 'is-flow-end' : ''}">
                <span class="step-badge">${step}</span>
                ${!isLast ? '<span class="step-connector"><i class="fa-solid fa-angle-right" aria-hidden="true"></i></span>' : ''}
              </div>
            `;
          })
          .join('');
      }

      // Render Connected Stack Pills
      if (this.readoutStack) {
        this.readoutStack.innerHTML = data.stack
          .map(tool => `<span class="stack-tool-pill"><span class="tool-dot"></span>${tool}</span>`)
          .join('');
      }
    }

    spawnParticle(targetPos) {
      // Particle travels from center (270, 270) to node position
      this.particles.push({
        x: 270,
        y: 270,
        startX: 270,
        startY: 270,
        endX: targetPos.cx,
        endY: targetPos.cy,
        progress: 0,
        speed: 0.025 + Math.random() * 0.015,
        radius: 3.5,
        opacity: 1
      });
    }

    startParticleLoop() {
      const render = () => {
        if (!this.particleLayer) return;

        // Auto spawn occasional subtle ambient pulses if not locked
        if (Math.random() < 0.015 && this.particles.length < 3) {
          const activeData = SYSTEMS_DATA[this.activeId];
          if (activeData) this.spawnParticle(activeData.nodePos);
        }

        // Update existing particles
        let svgHtml = '';
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.progress += p.speed;

          if (p.progress >= 1) {
            this.particles.splice(i, 1);
            continue;
          }

          const currentX = p.startX + (p.endX - p.startX) * p.progress;
          const currentY = p.startY + (p.endY - p.startY) * p.progress;
          const fade = p.progress < 0.2 ? p.progress / 0.2 : (p.progress > 0.8 ? (1 - p.progress) / 0.2 : 1);

          svgHtml += `<circle cx="${currentX.toFixed(1)}" cy="${currentY.toFixed(1)}" r="${p.radius}" class="radial-data-particle" style="opacity: ${fade.toFixed(2)};" />`;
        }

        this.particleLayer.innerHTML = svgHtml;
        this.particleAnimId = requestAnimationFrame(render);
      };

      this.particleAnimId = requestAnimationFrame(render);
    }

    setupObserver() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!this.isLockedByUser && !this.autoTimer) {
                this.startAutoTimer();
              }
            } else {
              this.clearAutoTimer();
            }
          });
        },
        { threshold: 0.25 }
      );

      observer.observe(this.console);
    }

    startAutoTimer() {
      const keys = ['01', '02', '03', '04', '05', '06'];
      this.autoTimer = setInterval(() => {
        if (this.isLockedByUser) {
          this.clearAutoTimer();
          return;
        }
        const currentIdx = keys.indexOf(this.activeId);
        const nextId = keys[(currentIdx + 1) % keys.length];
        this.updateSystem(nextId, true);
      }, 4800);
    }

    clearAutoTimer() {
      if (this.autoTimer) {
        clearInterval(this.autoTimer);
        this.autoTimer = null;
      }
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SystemsIndexController());
  } else {
    new SystemsIndexController();
  }
})();

/**
 * AI SYSTEMS & AUTOMATION AGENCY — LIVING ORCHESTRATION ENGINE
 * Powers Section 01: Business Chaos (Inputs) -> AI Orchestration Engine -> System Outcomes
 * Features dynamic SVG bezier paths, particle propagation, responsive re-anchoring,
 * hover path tracing, and reduced-motion graceful degradation.
 */

(function () {
  'use strict';

  // Route definitions linking inputs to core and corresponding outcomes
  const SYSTEM_ROUTES = [
    {
      id: 'whatsapp',
      inputId: 'whatsapp',
      outcomeId: 'lead',
      module: 'LEADS',
      label: 'WhatsApp Message',
      stateText: 'SCREENING ICP',
      color: '#00f0ff'
    },
    {
      id: 'web-lead',
      inputId: 'web-lead',
      outcomeId: 'crm',
      module: 'CRM',
      label: 'High-Intent Web Lead',
      stateText: 'ENRICHING RECORD',
      color: '#38bdf8'
    },
    {
      id: 'support-ticket',
      inputId: 'support-ticket',
      outcomeId: 'support',
      module: 'SUPPORT',
      label: 'Support Inquiry',
      stateText: 'DIAGNOSING TICKET',
      color: '#00f0ff'
    },
    {
      id: 'email',
      inputId: 'email',
      outcomeId: 'meeting',
      module: 'OPS',
      label: 'Inbound Email',
      stateText: 'SCHEDULING DISCOVERY',
      color: '#38bdf8'
    },
    {
      id: 'invoice',
      inputId: 'invoice',
      outcomeId: 'invoice',
      module: 'DATA',
      label: 'PDF Invoice Attachment',
      stateText: 'EXTRACTING LINE-ITEMS',
      color: '#00f0ff'
    },
    {
      id: 'data-sync',
      inputId: 'data-sync',
      outcomeId: 'report',
      module: 'DATA',
      label: 'Telemetry & Stripe Data',
      stateText: 'SYNTHESIZING BRIEF',
      color: '#38bdf8'
    }
  ];

  class OrchestrationEngine {
    constructor() {
      this.stage = document.getElementById('automation-stage');
      this.wrapper = document.getElementById('stage-canvas-wrapper');
      this.svg = document.getElementById('stage-connections-svg');
      this.pathGroup = document.getElementById('path-network');
      this.particleGroup = document.getElementById('particle-layer');
      this.core = document.getElementById('engine-core');
      this.coreState = document.getElementById('core-state-indicator');
      this.counterEl = document.getElementById('live-throughput-counter');

      if (!this.stage || !this.wrapper || !this.svg || !this.core) return;

      this.paths = new Map(); // id -> { inPath, outPath, inEl, outEl }
      this.activeParticles = [];
      this.isPaused = false;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.lastSpawnTime = 0;
      this.spawnInterval = 1800; // ms between automatic packets
      this.totalEvents = 1428;
      this.animFrameId = null;

      this.init();
    }

    init() {
      this.buildDomReferences();
      this.renderPaths();
      this.bindEvents();
      this.setupObserver();

      if (!this.reducedMotion) {
        this.startLoop();
      }
    }

    buildDomReferences() {
      SYSTEM_ROUTES.forEach((route) => {
        const inEl = document.querySelector(`.input-chip[data-node-id="${route.inputId}"]`);
        const outEl = document.querySelector(`.outcome-chip[data-outcome-id="${route.outcomeId}"]`);
        if (inEl && outEl) {
          this.paths.set(route.id, {
            route,
            inEl,
            outEl,
            inSvgPath: null,
            outSvgPath: null,
            inLength: 0,
            outLength: 0
          });
        }
      });
    }

    isVerticalLayout() {
      return window.innerWidth <= 992;
    }

    renderPaths() {
      if (!this.pathGroup || !this.wrapper) return;
      this.pathGroup.innerHTML = '';

      const wrapperRect = this.wrapper.getBoundingClientRect();
      const coreRect = this.core.getBoundingClientRect();
      const isVertical = this.isVerticalLayout();

      // Calculate Core Anchors
      const coreCenterX = coreRect.left + coreRect.width / 2 - wrapperRect.left;
      const coreCenterY = coreRect.top + coreRect.height / 2 - wrapperRect.top;

      const coreInAnchor = isVertical
        ? { x: coreCenterX, y: coreRect.top - wrapperRect.top }
        : { x: coreRect.left - wrapperRect.left, y: coreCenterY };

      const coreOutAnchor = isVertical
        ? { x: coreCenterX, y: coreRect.bottom - wrapperRect.top }
        : { x: coreRect.right - wrapperRect.left, y: coreCenterY };

      this.paths.forEach((data, id) => {
        const inRect = data.inEl.getBoundingClientRect();
        const outRect = data.outEl.getBoundingClientRect();

        // Calculate Input & Output Anchors
        const inAnchor = isVertical
          ? {
              x: inRect.left + inRect.width / 2 - wrapperRect.left,
              y: inRect.bottom - wrapperRect.top
            }
          : {
              x: inRect.right - wrapperRect.left,
              y: inRect.top + inRect.height / 2 - wrapperRect.top
            };

        const outAnchor = isVertical
          ? {
              x: outRect.left + outRect.width / 2 - wrapperRect.left,
              y: outRect.top - wrapperRect.top
            }
          : {
              x: outRect.left - wrapperRect.left,
              y: outRect.top + outRect.height / 2 - wrapperRect.top
            };

        // Compute Smooth Bezier Curves
        let inD = '';
        let outD = '';

        if (isVertical) {
          const dyIn = (coreInAnchor.y - inAnchor.y) * 0.5;
          inD = `M ${inAnchor.x} ${inAnchor.y} C ${inAnchor.x} ${inAnchor.y + dyIn}, ${coreInAnchor.x} ${coreInAnchor.y - dyIn}, ${coreInAnchor.x} ${coreInAnchor.y}`;

          const dyOut = (outAnchor.y - coreOutAnchor.y) * 0.5;
          outD = `M ${coreOutAnchor.x} ${coreOutAnchor.y} C ${coreOutAnchor.x} ${coreOutAnchor.y + dyOut}, ${outAnchor.x} ${outAnchor.y - dyOut}, ${outAnchor.x} ${outAnchor.y}`;
        } else {
          const dxIn = (coreInAnchor.x - inAnchor.x) * 0.55;
          inD = `M ${inAnchor.x} ${inAnchor.y} C ${inAnchor.x + dxIn} ${inAnchor.y}, ${coreInAnchor.x - dxIn} ${coreInAnchor.y}, ${coreInAnchor.x} ${coreInAnchor.y}`;

          const dxOut = (outAnchor.x - coreOutAnchor.x) * 0.55;
          outD = `M ${coreOutAnchor.x} ${coreOutAnchor.y} C ${coreOutAnchor.x + dxOut} ${coreOutAnchor.y}, ${outAnchor.x - dxOut} ${outAnchor.y}, ${outAnchor.x} ${outAnchor.y}`;
        }

        // Create Input SVG Path
        const inPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        inPath.setAttribute('d', inD);
        inPath.setAttribute('class', 'stream-path stream-path-input');
        inPath.setAttribute('data-route-id', id);
        this.pathGroup.appendChild(inPath);

        // Create Output SVG Path
        const outPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        outPath.setAttribute('d', outD);
        outPath.setAttribute('class', 'stream-path stream-path-output');
        outPath.setAttribute('data-route-id', id);
        this.pathGroup.appendChild(outPath);

        data.inSvgPath = inPath;
        data.outSvgPath = outPath;
        data.inLength = inPath.getTotalLength();
        data.outLength = outPath.getTotalLength();
      });
    }

    bindEvents() {
      // Debounced Resize
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this.renderPaths();
        }, 150);
      });

      // Hover / Touch interaction on Input Chips
      this.paths.forEach((data, id) => {
        const handleEnter = () => this.highlightRoute(id, true);
        const handleLeave = () => this.highlightRoute(id, false);
        const handleClick = () => this.triggerPacket(id, true);

        data.inEl.addEventListener('mouseenter', handleEnter);
        data.inEl.addEventListener('mouseleave', handleLeave);
        data.inEl.addEventListener('click', handleClick);

        data.outEl.addEventListener('mouseenter', handleEnter);
        data.outEl.addEventListener('mouseleave', handleLeave);
      });

      // Core hover interaction
      if (this.core) {
        this.core.addEventListener('mouseenter', () => {
          this.core.classList.add('is-hovered');
          const rings = document.querySelectorAll('.orbit-ring');
          rings.forEach((r) => r.classList.add('speed-boost'));
        });
        this.core.addEventListener('mouseleave', () => {
          this.core.classList.remove('is-hovered');
          const rings = document.querySelectorAll('.orbit-ring');
          rings.forEach((r) => r.classList.remove('speed-boost'));
        });
      }

      // Reduced motion changes
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        this.reducedMotion = e.matches;
        if (this.reducedMotion) {
          this.stopLoop();
        } else {
          this.startLoop();
        }
      });
    }

    setupObserver() {
      // Pause animation loop when offscreen for 60fps battery & CPU optimization
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.isPaused = !entry.isIntersecting;
            if (entry.isIntersecting && !this.reducedMotion && !this.animFrameId) {
              this.startLoop();
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(this.stage);
    }

    highlightRoute(routeId, active) {
      const data = this.paths.get(routeId);
      if (!data) return;

      if (active) {
        data.inEl.classList.add('is-active-route');
        data.outEl.classList.add('is-active-route');
        if (data.inSvgPath) data.inSvgPath.classList.add('is-path-highlight');
        if (data.outSvgPath) data.outSvgPath.classList.add('is-path-highlight');
        if (this.coreState) this.coreState.textContent = data.route.stateText;
      } else {
        data.inEl.classList.remove('is-active-route');
        data.outEl.classList.remove('is-active-route');
        if (data.inSvgPath) data.inSvgPath.classList.remove('is-path-highlight');
        if (data.outSvgPath) data.outSvgPath.classList.remove('is-path-highlight');
        if (this.coreState) this.coreState.textContent = 'ORCHESTRATING';
      }
    }

    triggerPacket(routeId, manual = false) {
      const data = this.paths.get(routeId);
      if (!data || !data.inSvgPath || !data.outSvgPath) return;

      // Particle element
      const pEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pEl.setAttribute('r', manual ? '4.5' : '3.5');
      pEl.setAttribute('class', manual ? 'stream-particle manual-particle' : 'stream-particle');
      this.particleGroup.appendChild(pEl);

      // Flash input node
      data.inEl.classList.add('is-emitting');
      setTimeout(() => data.inEl.classList.remove('is-emitting'), 400);

      // Momentarily illuminate input path
      data.inSvgPath.classList.add('is-firing');
      setTimeout(() => data.inSvgPath.classList.remove('is-firing'), 850);

      const packet = {
        id: Math.random().toString(36).substring(2, 9),
        routeId,
        data,
        pEl,
        phase: 'input', // 'input' -> 'core' -> 'output' -> 'done'
        progress: 0,
        speed: manual ? 0.024 : 0.016, // Progress step per frame
        inPath: data.inSvgPath,
        outPath: data.outSvgPath,
        inLength: data.inLength,
        outLength: data.outLength
      };

      this.activeParticles.push(packet);
    }

    onPacketReachCore(packet) {
      if (this.core) {
        this.core.classList.add('core-hit');
        setTimeout(() => this.core.classList.remove('core-hit'), 250);
      }

      if (this.coreState) {
        this.coreState.textContent = packet.data.route.stateText;
      }

      // Highlight target module on rings briefly
      const moduleNode = document.querySelector(`.node-${packet.data.route.module.toLowerCase()}`);
      if (moduleNode) {
        moduleNode.classList.add('module-ping');
        setTimeout(() => moduleNode.classList.remove('module-ping'), 600);
      }

      // Briefly illuminate output path
      packet.data.outSvgPath.classList.add('is-firing');
      setTimeout(() => packet.data.outSvgPath.classList.remove('is-firing'), 850);
    }

    onPacketReachOutcome(packet) {
      const outEl = packet.data.outEl;
      if (outEl) {
        outEl.classList.add('is-triggered');
        setTimeout(() => outEl.classList.remove('is-triggered'), 700);

        // Update live counter
        this.totalEvents += 1;
        if (this.counterEl) {
          this.counterEl.textContent = this.totalEvents.toLocaleString();
        }
      }

      if (this.coreState) {
        this.coreState.textContent = 'ORCHESTRATING';
      }
    }

    updateParticles() {
      for (let i = this.activeParticles.length - 1; i >= 0; i--) {
        const p = this.activeParticles[i];

        if (p.phase === 'input') {
          p.progress += p.speed;
          if (p.progress >= 1) {
            // Reached core
            p.progress = 0;
            p.phase = 'output';
            this.onPacketReachCore(p);
          } else {
            const pt = p.inPath.getPointAtLength(p.progress * p.inLength);
            p.pEl.setAttribute('cx', pt.x);
            p.pEl.setAttribute('cy', pt.y);
          }
        } else if (p.phase === 'output') {
          p.progress += p.speed * 1.1; // Exit slightly faster for dynamic velocity
          if (p.progress >= 1) {
            // Reached outcome
            this.onPacketReachOutcome(p);
            p.pEl.remove();
            this.activeParticles.splice(i, 1);
          } else {
            const pt = p.outPath.getPointAtLength(p.progress * p.outLength);
            p.pEl.setAttribute('cx', pt.x);
            p.pEl.setAttribute('cy', pt.y);
          }
        }
      }
    }

    tick(time) {
      if (this.isPaused) {
        this.animFrameId = null;
        return;
      }

      // Check spawn timer for automatic organic flow
      if (time - this.lastSpawnTime > this.spawnInterval) {
        this.lastSpawnTime = time;
        // Organic interval jitter between 1.4s and 2.4s
        this.spawnInterval = 1400 + Math.random() * 1000;

        // Pick random route
        const keys = Array.from(this.paths.keys());
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        this.triggerPacket(randomKey, false);
      }

      this.updateParticles();
      this.animFrameId = requestAnimationFrame((t) => this.tick(t));
    }

    startLoop() {
      if (!this.animFrameId && !this.reducedMotion) {
        this.lastSpawnTime = performance.now();
        this.animFrameId = requestAnimationFrame((t) => this.tick(t));
      }
    }

    stopLoop() {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      this.activeParticles.forEach((p) => p.pEl.remove());
      this.activeParticles = [];
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new OrchestrationEngine());
  } else {
    new OrchestrationEngine();
  }
})();

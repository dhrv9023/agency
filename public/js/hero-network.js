/**
 * AI SYSTEMS & AUTOMATION AGENCY — HERO AUTOMATION SIGNAL LAYER & METRIC COUNTERS
 * Powers the peripheral automation network, subtle data particles, and entrance metric counters in the hero section.
 * Lightweight, GPU-friendly, IntersectionObserver-throttled, and respects prefers-reduced-motion.
 */

(function () {
  'use strict';

  // Hero Route Definitions connecting peripheral inputs to center core and outputs
  const HERO_ROUTES = [
    {
      id: 'email-to-crm',
      inputSelector: '[data-hero-node="email"]',
      outputSelector: '[data-hero-out="crm"]',
      color: '#00f0ff',
      speed: 0.016
    },
    {
      id: 'web-to-lead',
      inputSelector: '[data-hero-node="web"]',
      outputSelector: '[data-hero-out="lead"]',
      color: '#38bdf8',
      speed: 0.018
    },
    {
      id: 'whatsapp-to-meeting',
      inputSelector: '[data-hero-node="whatsapp"]',
      outputSelector: '[data-hero-out="meeting"]',
      color: '#00f0ff',
      speed: 0.015
    },
    {
      id: 'support-to-resolved',
      inputSelector: '[data-hero-node="support"]',
      outputSelector: '[data-hero-out="support"]',
      color: '#38bdf8',
      speed: 0.017
    },
    {
      id: 'invoice-to-crm',
      inputSelector: '[data-hero-node="invoice"]',
      outputSelector: '[data-hero-out="crm"]',
      color: '#00f0ff',
      speed: 0.016
    },
    {
      id: 'crm-to-lead',
      inputSelector: '[data-hero-node="crm"]',
      outputSelector: '[data-hero-out="lead"]',
      color: '#38bdf8',
      speed: 0.019
    }
  ];

  class HeroAutomationNetwork {
    constructor() {
      this.hero = document.getElementById('hero-section');
      this.layer = document.getElementById('hero-automation-layer');
      this.svg = document.getElementById('hero-network-svg');
      this.pathGroup = document.getElementById('hero-paths-group');
      this.particleGroup = document.getElementById('hero-particles-group');
      this.core = document.getElementById('hero-central-core');

      if (!this.hero || !this.layer || !this.svg || !this.core) return;

      this.routes = [];
      this.activeParticles = [];
      this.isPaused = false;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.lastSpawnTime = 0;
      this.spawnInterval = 2800; // ms between subtle pulses
      this.animFrameId = null;
      this.metricsAnimated = false;

      this.init();
    }

    init() {
      this.buildRoutes();
      this.renderPaths();
      this.bindEvents();
      this.setupObserver();

      if (!this.reducedMotion) {
        this.startLoop();
      }
    }

    buildRoutes() {
      HERO_ROUTES.forEach((cfg) => {
        const inEl = this.layer.querySelector(cfg.inputSelector);
        const outEl = this.layer.querySelector(cfg.outputSelector);
        if (inEl && outEl) {
          this.routes.push({
            cfg,
            inEl,
            outEl,
            inPath: null,
            outPath: null,
            inLength: 0,
            outLength: 0
          });
        }
      });
    }

    renderPaths() {
      if (!this.pathGroup || !this.layer) return;
      this.pathGroup.innerHTML = '';

      const layerRect = this.layer.getBoundingClientRect();
      const coreRect = this.core.getBoundingClientRect();

      // Center Core Anchor
      const coreCenter = {
        x: coreRect.left + coreRect.width / 2 - layerRect.left,
        y: coreRect.top + coreRect.height / 2 - layerRect.top
      };

      this.routes.forEach((route) => {
        const inRect = route.inEl.getBoundingClientRect();
        const outRect = route.outEl.getBoundingClientRect();

        const inAnchor = {
          x: inRect.left + inRect.width / 2 - layerRect.left,
          y: inRect.top + inRect.height / 2 - layerRect.top
        };

        const outAnchor = {
          x: outRect.left + outRect.width / 2 - layerRect.left,
          y: outRect.top + outRect.height / 2 - layerRect.top
        };

        // Smooth Bezier Curve In: input -> core
        const dxIn = (coreCenter.x - inAnchor.x) * 0.45;
        const dyIn = (coreCenter.y - inAnchor.y) * 0.45;
        const dIn = `M ${inAnchor.x} ${inAnchor.y} Q ${inAnchor.x + dxIn} ${inAnchor.y + dyIn * 1.3}, ${coreCenter.x} ${coreCenter.y}`;

        // Smooth Bezier Curve Out: core -> output
        const dxOut = (outAnchor.x - coreCenter.x) * 0.45;
        const dyOut = (outAnchor.y - coreCenter.y) * 0.45;
        const dOut = `M ${coreCenter.x} ${coreCenter.y} Q ${coreCenter.x + dxOut * 0.7} ${coreCenter.y + dyOut * 1.3}, ${outAnchor.x} ${outAnchor.y}`;

        // SVG Path Elements
        const pIn = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pIn.setAttribute('d', dIn);
        pIn.setAttribute('class', 'hero-stream-path hero-path-in');
        this.pathGroup.appendChild(pIn);

        const pOut = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pOut.setAttribute('d', dOut);
        pOut.setAttribute('class', 'hero-stream-path hero-path-out');
        this.pathGroup.appendChild(pOut);

        route.inPath = pIn;
        route.outPath = pOut;
        route.inLength = pIn.getTotalLength();
        route.outLength = pOut.getTotalLength();
      });
    }

    bindEvents() {
      // Debounced resize
      let timer = null;
      window.addEventListener('resize', () => {
        clearTimeout(timer);
        timer = setTimeout(() => this.renderPaths(), 150);
      });

      // Subtle desktop parallax (only on Layer 2, max 4px offset)
      if (window.innerWidth > 992 && !this.reducedMotion) {
        window.addEventListener('mousemove', (e) => {
          const moveX = (e.clientX / window.innerWidth - 0.5) * 6;
          const moveY = (e.clientY / window.innerHeight - 0.5) * 6;
          if (this.layer) {
            this.layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
          }
        }, { passive: true });
      }

      // Reduced motion listener
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
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.isPaused = !entry.isIntersecting;
            if (entry.isIntersecting) {
              if (!this.metricsAnimated) {
                this.animateMetrics();
                this.metricsAnimated = true;
              }
              if (!this.reducedMotion && !this.animFrameId) {
                this.startLoop();
              }
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(this.hero);
    }

    animateMetrics() {
      if (this.reducedMotion) return; // Keep static values

      const cells = this.hero.querySelectorAll('.stat-cell[data-target]');
      cells.forEach((cell) => {
        const valEl = cell.querySelector('.stat-value');
        if (!valEl) return;

        const target = parseInt(cell.getAttribute('data-target'), 10);
        const format = cell.getAttribute('data-format') || '{val}';
        const duration = 1200; // ms
        const startTime = performance.now();

        const step = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);

          valEl.textContent = format.replace('{val}', current);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            valEl.textContent = format.replace('{val}', target);
          }
        };

        requestAnimationFrame(step);
      });
    }

    spawnParticle(route) {
      if (!route || !route.inPath || !route.outPath) return;

      const pEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pEl.setAttribute('r', '2.5');
      pEl.setAttribute('class', 'hero-data-particle');
      this.particleGroup.appendChild(pEl);

      // Light up input node momentarily
      route.inEl.classList.add('is-active-signal');
      setTimeout(() => route.inEl.classList.remove('is-active-signal'), 600);

      // Momentarily illuminate in-path
      route.inPath.classList.add('is-active-path');
      setTimeout(() => route.inPath.classList.remove('is-active-path'), 900);

      const packet = {
        route,
        pEl,
        phase: 'in', // 'in' -> 'core' -> 'out' -> 'done'
        progress: 0,
        speed: route.cfg.speed || 0.016
      };

      this.activeParticles.push(packet);
    }

    onParticleReachCore(packet) {
      if (this.core) {
        this.core.classList.add('core-pulse');
        setTimeout(() => this.core.classList.remove('core-pulse'), 350);
      }

      // Briefly illuminate out-path
      packet.route.outPath.classList.add('is-active-path');
      setTimeout(() => packet.route.outPath.classList.remove('is-active-path'), 900);
    }

    onParticleReachOutput(packet) {
      const outEl = packet.route.outEl;
      if (outEl) {
        outEl.classList.add('is-active-out');
        setTimeout(() => outEl.classList.remove('is-active-out'), 1100);
      }
    }

    updateParticles() {
      for (let i = this.activeParticles.length - 1; i >= 0; i--) {
        const p = this.activeParticles[i];

        if (p.phase === 'in') {
          p.progress += p.speed;
          if (p.progress >= 1) {
            p.progress = 0;
            p.phase = 'out';
            this.onParticleReachCore(p);
          } else {
            const pt = p.route.inPath.getPointAtLength(p.progress * p.route.inLength);
            p.pEl.setAttribute('cx', pt.x);
            p.pEl.setAttribute('cy', pt.y);
          }
        } else if (p.phase === 'out') {
          p.progress += p.speed * 1.1;
          if (p.progress >= 1) {
            this.onParticleReachOutput(p);
            p.pEl.remove();
            this.activeParticles.splice(i, 1);
          } else {
            const pt = p.route.outPath.getPointAtLength(p.progress * p.route.outLength);
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

      // Check spawn timer (non-repetitive interval between 2.2s and 4.0s)
      if (time - this.lastSpawnTime > this.spawnInterval) {
        this.lastSpawnTime = time;
        this.spawnInterval = 2200 + Math.random() * 1800;

        if (this.routes.length > 0) {
          const randomRoute = this.routes[Math.floor(Math.random() * this.routes.length)];
          this.spawnParticle(randomRoute);
        }
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

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HeroAutomationNetwork());
  } else {
    new HeroAutomationNetwork();
  }
})();

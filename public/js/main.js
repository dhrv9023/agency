/**
 * AI SYSTEMS & AUTOMATION AGENCY — MAIN JS
 * Handles Theme Management (Dark/Light Modes), Navigation, Mobile Drawer, Scroll Reveals, and Accordions
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initScrollReveals();
  initFaqAccordions();
  initCopyrightYear();
});

/**
 * Dynamic Copyright Year Runtime Updater
 */
function initCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
}


/**
 * Global Theme Manager for Light and Dark Modes
 */
function initThemeManager() {
  const root = document.documentElement;
  const desktopToggle = document.getElementById('theme-toggle-btn');
  const mobileToggle = document.getElementById('mobile-theme-toggle-btn');
  const mobileThemeState = document.getElementById('mobile-theme-state');

  // Check stored preference or system preference
  const storedTheme = localStorage.getItem('agency_theme') || localStorage.getItem('varah_admin_theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  let currentTheme = storedTheme ? storedTheme : (systemPrefersLight ? 'light' : 'dark');
  applyTheme(currentTheme);

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('agency_theme', theme);
    localStorage.setItem('varah_admin_theme', theme);
    currentTheme = theme;

    if (desktopToggle) {
      desktopToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`);
      desktopToggle.setAttribute('title', `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`);
    }

    if (mobileThemeState) {
      mobileThemeState.textContent = theme === 'light' ? 'Light' : 'Dark';
    }
  }

  function toggleTheme() {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  }

  if (desktopToggle) {
    desktopToggle.addEventListener('click', toggleTheme);
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleTheme);
  }

  // Listen to OS theme changes if user has not explicitly set a preference
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('agency_theme')) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });
}

// Note: Navigation drawer, focus trap, and scroll lock are managed by public/js/nav.js

/**
 * Intersection Observer for Crisp Scroll Reveals
 */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (!reveals.length) return;

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    reveals.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/**
 * FAQ Accordion Expansion
 */
function initFaqAccordions() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.closest('.faq-item');
      if (!parent) return;

      const isOpen = parent.classList.contains('is-open');

      // Close all siblings for cleaner UX
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('is-open');
        const btn = item.querySelector('.faq-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        parent.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

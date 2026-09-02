/**
 * AI SYSTEMS & AUTOMATION AGENCY — MAIN JS
 * Handles Theme Management (Dark/Light Modes), Navigation, Mobile Drawer, Scroll Reveals, and Accordions
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initNavigation();
  initScrollReveals();
  initFaqAccordions();
});

/**
 * Global Theme Manager for Light and Dark Modes
 */
function initThemeManager() {
  const root = document.documentElement;
  const desktopToggle = document.getElementById('theme-toggle-btn');
  const mobileToggle = document.getElementById('mobile-theme-toggle-btn');
  const mobileThemeState = document.getElementById('mobile-theme-state');

  // Check stored preference or system preference
  const storedTheme = localStorage.getItem('agency_theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  let currentTheme = storedTheme ? storedTheme : (systemPrefersLight ? 'light' : 'dark');
  applyTheme(currentTheme);

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('agency_theme', theme);
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

/**
 * Mobile Navigation Drawer & Escape Listener
 */
function initNavigation() {
  const burgerBtn = document.querySelector('.mobile-burger-btn');
  const menuSheet = document.querySelector('.mobile-menu-sheet');
  const menuBackdrop = document.querySelector('.mobile-menu-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta-btn');

  if (!burgerBtn || !menuSheet || !menuBackdrop) return;

  function openMenu() {
    burgerBtn.classList.add('is-active');
    burgerBtn.setAttribute('aria-expanded', 'true');
    menuSheet.classList.add('is-open');
    menuBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    burgerBtn.classList.remove('is-active');
    burgerBtn.setAttribute('aria-expanded', 'false');
    menuSheet.classList.remove('is-open');
    menuBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = menuSheet.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  burgerBtn.addEventListener('click', toggleMenu);
  menuBackdrop.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Escape key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuSheet.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Window resize > 768px closes mobile menu
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menuSheet.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

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

/**
 * ============================================================================
 * VARAH SYSTEMS — Accessible Navigation, Focus Trap & Scroll Lock Controller
 * ============================================================================
 * Features:
 *   - WCAG 2.1 AA Compliant Mobile Menu Drawer (role="dialog", aria-modal="true")
 *   - Strict Tab & Shift+Tab focus trapping within drawer boundaries
 *   - Bulletproof iOS Safari fixed-body scroll lock (zero layout shift / bounce)
 *   - Auto-close on anchor clicks, resize past 900px, and bfcache pageshow
 *   - Inert background gating for assistive technology
 *   - Smooth scroll-to-top on homepage logo click (respecting prefers-reduced-motion)
 */

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initNavigationDrawer();
    initHomepageLogoScroll();
    initStickyMobileCta();
  });

  function initNavigationDrawer() {
    const burgerBtn = document.querySelector('.mobile-burger-btn');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.querySelector('.mobile-menu-backdrop');
    const closeBtn = document.querySelector('.mobile-sheet-close-btn');

    if (!burgerBtn || !drawer) return;

    let previousActiveElement = null;
    let savedScrollY = 0;
    let isMenuOpen = false;

    // Elements to set inert when drawer is active
    const backgroundElements = Array.from(document.querySelectorAll('main, footer, .main-nav, .header-actions > .btn'));

    // Focusable selector within drawer
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function getFocusableElements() {
      return Array.from(drawer.querySelectorAll(focusableSelector)).filter(el => {
        return !el.hasAttribute('disabled') && el.offsetParent !== null;
      });
    }

    function openMenu() {
      if (isMenuOpen) return;
      isMenuOpen = true;
      previousActiveElement = document.activeElement;

      // 1. Update ARIA state
      burgerBtn.setAttribute('aria-expanded', 'true');
      burgerBtn.setAttribute('aria-label', 'Close menu');

      // 2. Lock Body Scroll (Bulletproof iOS Safari approach + Scrollbar shift compensation)
      savedScrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // 3. Set background inert
      backgroundElements.forEach(el => {
        if ('inert' in el) {
          el.inert = true;
        } else {
          el.setAttribute('aria-hidden', 'true');
        }
      });

      // 4. Reveal drawer & backdrop
      drawer.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');

      // 5. Move focus into drawer
      const focusables = getFocusableElements();
      if (closeBtn) {
        closeBtn.focus();
      } else if (focusables.length > 0) {
        focusables[0].focus();
      }
    }

    function closeMenu() {
      if (!isMenuOpen) return;
      isMenuOpen = false;

      // 1. Update ARIA state
      burgerBtn.setAttribute('aria-expanded', 'false');
      burgerBtn.setAttribute('aria-label', 'Open menu');

      // 2. Hide drawer & backdrop
      drawer.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');

      // 3. Remove background inert
      backgroundElements.forEach(el => {
        if ('inert' in el) {
          el.inert = false;
        } else {
          el.removeAttribute('aria-hidden');
        }
      });

      // 4. Restore Body Scroll and position
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      window.scrollTo(0, savedScrollY);

      // 5. Restore focus to trigger button
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      } else {
        burgerBtn.focus();
      }
    }

    // Toggle on burger click
    burgerBtn.addEventListener('click', () => {
      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close button inside drawer
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Backdrop click
    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    // Auto-close on drawer link or anchor clicks
    drawer.addEventListener('click', (e) => {
      const targetLink = e.target.closest('a');
      if (targetLink) {
        closeMenu();
      }
    });

    // Keyboard handlers: Escape key and Focus Trap
    document.addEventListener('keydown', (e) => {
      if (!isMenuOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getFocusableElements();
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement || !drawer.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement || !drawer.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });

    // Auto-close on viewport resize past desktop breakpoint (900px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && isMenuOpen) {
        closeMenu();
      }
    });

    // Auto-close on bfcache restoration (pageshow)
    window.addEventListener('pageshow', (e) => {
      if (e.persisted && isMenuOpen) {
        closeMenu();
      }
    });
  }

  /**
   * Smooth Scroll-to-Top on Homepage Logo Click
   */
  function initHomepageLogoScroll() {
    const isHomePage = window.location.pathname === '/' ||
                       window.location.pathname.endsWith('/index.html') ||
                       window.location.pathname === '';
    if (!isHomePage) return;

    const logoLinks = document.querySelectorAll('.site-logo-link');
    logoLinks.forEach(logo => {
      logo.addEventListener('click', (e) => {
        // If already on homepage, scroll smoothly to top without page reload
        e.preventDefault();
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
        history.replaceState(null, '', window.location.pathname);
      });
    });
  }

  /**
   * Workstream 12: Sticky Mobile CTA Controller
   * Gated on sessionStorage['varah_cta_dismissed']
   * 44x44 accessible tap target dismiss button
   * Collapses reserved body padding on dismissal
   */
  function initStickyMobileCta() {
    const ctaBar = document.getElementById('sticky-mobile-cta');
    if (!ctaBar) return;

    const dismissBtn = document.getElementById('sticky-cta-dismiss-btn');
    const isDismissed = sessionStorage.getItem('varah_cta_dismissed') === 'true';
    const isContactPage = window.location.pathname.endsWith('contact.html') || window.location.pathname.endsWith('thank-you.html');

    if (isDismissed || isContactPage) {
      ctaBar.classList.add('is-dismissed');
      document.body.classList.remove('has-sticky-cta');
      return;
    }

    document.body.classList.add('has-sticky-cta');

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        ctaBar.classList.add('is-dismissed');
        document.body.classList.remove('has-sticky-cta');
        sessionStorage.setItem('varah_cta_dismissed', 'true');
      });
    }
  }
})();

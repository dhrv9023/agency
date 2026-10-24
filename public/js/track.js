/**
 * ==============================================================================
 * VARAH SYSTEMS — Unified Analytics & Event Tracking Engine (Workstream 11)
 * ==============================================================================
 * Standards:
 *   - Zero dependencies (vanilla browser JavaScript).
 *   - Strictly consent-gated: No-ops unless window.consent.get().analytics === true.
 *   - Zero PII: Strictly strips emails, phone numbers, free-form text, and query strings.
 *   - Idempotent: Deduplicates page views, scroll milestones, and form starts.
 *   - First-touch attribution: Captures UTMs and referrer strictly upon consent.
 */

(function () {
  'use strict';

  const STORAGE_KEY_ATTRIBUTION = 'varah_first_touch_attribution';
  const ATTRIBUTION_MAX_LEN = 100;
  const SAFE_ATTR_REGEX = /^[a-zA-Z0-9_\-\.\/]+$/;

  // ----------------------------------------------------------------------------
  // 1. Consent State Check
  // ----------------------------------------------------------------------------
  function isAnalyticsConsented() {
    return Boolean(
      window.consent &&
      typeof window.consent.get === 'function' &&
      window.consent.get().analytics === true
    );
  }

  // ----------------------------------------------------------------------------
  // 2. Strict Zero-PII Sanitization
  // ----------------------------------------------------------------------------
  const PII_PATTERNS = {
    email: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
    phone: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,
    longDigits: /\b\d{7,}\b/,
  };

  function sanitizeValue(val) {
    if (val === null || val === undefined) return '';
    if (typeof val === 'number' || typeof val === 'boolean') return val;
    if (typeof val !== 'string') return '';

    const str = val.trim();

    // Check for email or phone PII
    if (PII_PATTERNS.email.test(str) || PII_PATTERNS.phone.test(str) || PII_PATTERNS.longDigits.test(str)) {
      console.warn('[ANALYTICS_PRIVACY] Value stripped due to potential PII pattern.');
      return '[REDACTED_PII]';
    }

    // Strip URLs containing query parameters down to origin + pathname
    if (str.startsWith('http://') || str.startsWith('https://')) {
      try {
        const u = new URL(str);
        return `${u.origin}${u.pathname}`;
      } catch (e) {
        return str.split('?')[0].split('#')[0];
      }
    }

    // Truncate length to maximum 120 chars
    return str.length > 120 ? str.slice(0, 120) : str;
  }

  function sanitizeProps(props) {
    if (!props || typeof props !== 'object') return {};
    const clean = {};
    for (const key of Object.keys(props)) {
      if (props[key] !== undefined && props[key] !== null) {
        clean[key] = sanitizeValue(props[key]);
      }
    }
    return clean;
  }

  // ----------------------------------------------------------------------------
  // 3. First-Touch Lead Attribution Capture (Consent-Gated)
  // ----------------------------------------------------------------------------
  function captureFirstTouchAttribution() {
    if (!isAnalyticsConsented()) return;

    try {
      if (sessionStorage.getItem(STORAGE_KEY_ATTRIBUTION)) {
        return; // First touch already recorded in session
      }

      const url = new URL(window.location.href);
      const params = url.searchParams;

      const sanitizeParam = (raw) => {
        if (!raw) return null;
        const trimmed = raw.trim();
        if (trimmed.length > ATTRIBUTION_MAX_LEN || !SAFE_ATTR_REGEX.test(trimmed)) {
          return null;
        }
        return trimmed;
      };

      // Strip query parameters and hash from referrer
      let cleanReferrer = null;
      if (document.referrer) {
        try {
          const refUrl = new URL(document.referrer);
          // Only record if external
          if (refUrl.origin !== window.location.origin) {
            cleanReferrer = `${refUrl.origin}${refUrl.pathname}`;
          }
        } catch (e) {}
      }

      const attribution = {
        utmSource: sanitizeParam(params.get('utm_source')),
        utmMedium: sanitizeParam(params.get('utm_medium')),
        utmCampaign: sanitizeParam(params.get('utm_campaign')),
        utmTerm: sanitizeParam(params.get('utm_term')),
        utmContent: sanitizeParam(params.get('utm_content')),
        referrerUrl: cleanReferrer ? cleanReferrer.slice(0, ATTRIBUTION_MAX_LEN) : null,
        landingPath: window.location.pathname.slice(0, ATTRIBUTION_MAX_LEN),
        capturedAt: Date.now(),
      };

      // Only save if at least one parameter or external referrer exists
      if (
        attribution.utmSource ||
        attribution.utmMedium ||
        attribution.utmCampaign ||
        attribution.utmTerm ||
        attribution.utmContent ||
        attribution.referrerUrl
      ) {
        sessionStorage.setItem(STORAGE_KEY_ATTRIBUTION, JSON.stringify(attribution));
      }
    } catch (err) {
      console.warn('[ATTRIBUTION_ERR]', err);
    }
  }

  // ----------------------------------------------------------------------------
  // 4. Global Window Track Dispatcher
  // ----------------------------------------------------------------------------
  window.track = function (eventName, props) {
    if (!isAnalyticsConsented()) {
      return; // Strictly no-ops when unconsented
    }

    if (!eventName || typeof eventName !== 'string') return;

    const cleanProps = sanitizeProps(props);

    // 1. Dispatch to Plausible if loaded
    if (typeof window.plausible === 'function') {
      window.plausible(eventName, { props: cleanProps });
    }

    // 2. Dispatch custom DOM event for local subscribers & test harnesses
    window.dispatchEvent(
      new CustomEvent('varah:analytics-event', {
        detail: { event: eventName, props: cleanProps, timestamp: Date.now() },
      })
    );
  };

  // Safe accessor for contact form to retrieve attribution
  window.getConsentedAttribution = function () {
    if (!isAnalyticsConsented()) return null;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_ATTRIBUTION);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  // ----------------------------------------------------------------------------
  // 5. Delegated Event Listeners & Observers
  // ----------------------------------------------------------------------------
  function initEventTracking() {
    captureFirstTouchAttribution();

    // Track initial page view (once)
    window.track('page_view', {
      pagePath: window.location.pathname,
      pageTitle: document.title,
    });

    // Page-specific automated events
    const path = window.location.pathname;
    if (path.includes('/case-studies/')) {
      const slug = path.split('/').pop().replace('.html', '');
      window.track('case_study_view', { slug });
    } else if (path.includes('pricing.html') || path.includes('calculator.html')) {
      window.track('pricing_view', { page: path.includes('pricing') ? 'pricing' : 'calculator' });
    }

    // 75% Scroll Depth Milestone (IntersectionObserver)
    let scrollTracked = false;
    const scrollSentinel = document.createElement('div');
    scrollSentinel.id = 'analytics-scroll-sentinel-75';
    scrollSentinel.style.cssText = 'position:absolute;top:75%;left:0;width:1px;height:1px;pointer-events:none;opacity:0;';
    document.body.appendChild(scrollSentinel);

    if ('IntersectionObserver' in window) {
      const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !scrollTracked) {
            scrollTracked = true;
            window.track('scroll_depth_75', { pagePath: window.location.pathname });
            scrollObserver.disconnect();
          }
        });
      });
      scrollObserver.observe(scrollSentinel);
    }

    // Delegated Click Listener
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button');
      if (!target) return;

      // CTA Click tracking (explicit attribute or button class)
      const ctaLabel = target.getAttribute('data-track-cta') || (target.classList.contains('btn') ? target.textContent.trim() : null);
      if (ctaLabel) {
        const ctaLocation = target.getAttribute('data-track-location') || target.closest('header') ? 'header' : target.closest('footer') ? 'footer' : 'body';
        window.track('cta_click', {
          ctaLabel: ctaLabel.slice(0, 50),
          ctaLocation: ctaLocation,
        });
      }

      // Outbound Click tracking
      if (target.tagName === 'A' && target.href) {
        try {
          const destUrl = new URL(target.href);
          if (destUrl.origin !== window.location.origin) {
            if (target.href.startsWith('mailto:')) {
              window.track('email_click', {
                location: target.closest('footer') ? 'footer' : 'header',
              });
            } else if (target.href.startsWith('tel:')) {
              window.track('phone_click', {
                location: target.closest('footer') ? 'footer' : 'body',
              });
            } else {
              window.track('outbound_click', {
                targetHostname: destUrl.hostname,
              });
            }
          }
        } catch (err) {}
      }
    });

    // Form Telemetry: First Focus & Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      let formStartTracked = false;
      contactForm.addEventListener('focusin', () => {
        if (!formStartTracked) {
          formStartTracked = true;
          window.track('form_start', {
            formId: 'contact-form',
            pagePath: window.location.pathname,
          });
        }
      });

      contactForm.addEventListener('submit', () => {
        window.track('form_submit', {
          formId: 'contact-form',
          pagePath: window.location.pathname,
        });
      });
    }
  }

  // Initialize once DOM is interactive
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventTracking);
  } else {
    initEventTracking();
  }

  // Re-check attribution and track initial page view if consent changes mid-session
  if (window.consent && typeof window.consent.onChange === 'function') {
    window.consent.onChange((categories) => {
      if (categories.analytics) {
        captureFirstTouchAttribution();
        window.track('page_view', {
          pagePath: window.location.pathname,
          pageTitle: document.title,
        });
      }
    });
  }
})();

/**
 * ==============================================================================
 * VARAH SYSTEMS — Vanilla Consent & Script Gating Engine (Workstream 10)
 * ==============================================================================
 * Standards:
 *   - Zero dependencies (vanilla browser JavaScript).
 *   - Granular categories: Necessary (locked), Analytics, Marketing.
 *   - Visual parity: Reject All equals Accept All in prominence and styling.
 *   - Global Privacy Control (GPC): Auto-opts out non-essential categories.
 *   - Expiry: 180 days (6 months) with automatic version bump re-prompting.
 *   - Script gating: Blocks <script type="text/plain" data-consent="..."> until granted.
 *   - Accessible: role="region" banner, native <dialog> with focus trap & Esc support.
 */

(function () {
  'use strict';

  const CONSENT_STORAGE_KEY = 'varah_consent_state';
  const CONSENT_VERSION = 1;
  const CONSENT_EXPIRY_DAYS = 180;
  const CONSENT_EXPIRY_MS = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  let inMemoryConsent = null;
  const changeListeners = [];

  // 1. Storage Helpers (with private browsing fallback)
  function getStoredConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      // Validate schema, expiry and version
      if (
        typeof data === 'object' &&
        data.version === CONSENT_VERSION &&
        typeof data.timestamp === 'number' &&
        Date.now() - data.timestamp < CONSENT_EXPIRY_MS &&
        data.categories
      ) {
        return data;
      }
      return null;
    } catch (e) {
      return inMemoryConsent;
    }
  }

  function setStoredConsent(consentData) {
    inMemoryConsent = consentData;
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
    } catch (e) {
      console.warn('[CONSENT_STORAGE] LocalStorage unavailable; using in-memory consent.');
    }
  }

  function isGpcActive() {
    return typeof navigator !== 'undefined' && Boolean(navigator.globalPrivacyControl);
  }

  // 2. Default State Calculation
  function getCurrentConsent() {
    const stored = getStoredConsent();
    if (stored) return stored.categories;

    // Default state before choice
    return {
      necessary: true,
      analytics: false,
      marketing: false,
    };
  }

  // 3. Script Gating Dispatcher
  function activateGatedScripts(categories) {
    const scripts = document.querySelectorAll('script[type="text/plain"][data-consent]');
    scripts.forEach((oldScript) => {
      const requiredCategory = oldScript.getAttribute('data-consent');
      if (requiredCategory && categories[requiredCategory] === true) {
        const newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.setAttribute('data-consent-activated', requiredCategory);

        // Copy all attributes (including data-src to src)
        Array.from(oldScript.attributes).forEach((attr) => {
          if (attr.name === 'type' || attr.name === 'data-consent') return;
          if (attr.name === 'data-src') {
            newScript.src = attr.value;
          } else {
            newScript.setAttribute(attr.name, attr.value);
          }
        });

        if (oldScript.textContent) {
          newScript.textContent = oldScript.textContent;
        }

        oldScript.parentNode.replaceChild(newScript, oldScript);
      }
    });
  }

  function purgeRevokedCookies() {
    // Attempt best-effort first-party cookie purge on consent withdrawal
    try {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        // Do not delete server session cookies if on admin path
        if (!name.startsWith('__Host-') && !name.startsWith('varah_admin')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      }
    } catch (e) {
      console.warn('[CONSENT_PURGE] Error clearing cookies:', e);
    }
  }

  function notifyChange(categories) {
    changeListeners.forEach((fn) => {
      try {
        fn(categories);
      } catch (err) {
        console.error('[CONSENT_LISTENER_ERR]', err);
      }
    });

    window.dispatchEvent(
      new CustomEvent('varah:consent-changed', {
        detail: { categories, gpc: isGpcActive() },
      })
    );

    if (categories.analytics || categories.marketing) {
      activateGatedScripts(categories);
    } else {
      purgeRevokedCookies();
    }
  }

  // 4. Save Consent Action
  function saveConsent(categories) {
    const payload = {
      version: CONSENT_VERSION,
      timestamp: Date.now(),
      categories: {
        necessary: true,
        analytics: Boolean(categories.analytics),
        marketing: Boolean(categories.marketing),
      },
      gpc: isGpcActive(),
    };

    setStoredConsent(payload);
    hideBanner();
    closePreferencesModal();
    notifyChange(payload.categories);
  }

  // 5. DOM & Modal Management
  let lastFocusedElement = null;

  function showBanner() {
    const banner = document.getElementById('consent-banner');
    if (banner) {
      banner.hidden = false;
      banner.setAttribute('aria-hidden', 'false');
      document.body.classList.add('has-consent-banner');
    }
  }

  function hideBanner() {
    const banner = document.getElementById('consent-banner');
    if (banner) {
      banner.hidden = true;
      banner.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('has-consent-banner');
    }
  }

  function openPreferencesModal() {
    lastFocusedElement = document.activeElement;
    const dialog = document.getElementById('consent-preferences-dialog');
    if (!dialog) return;

    // Sync checkboxes with current consent
    const current = getCurrentConsent();
    const gpcActive = isGpcActive();

    const analyticsCheckbox = document.getElementById('consent-toggle-analytics');
    const marketingCheckbox = document.getElementById('consent-toggle-marketing');
    const gpcNotice = document.getElementById('consent-gpc-notice');

    if (analyticsCheckbox) analyticsCheckbox.checked = current.analytics;
    if (marketingCheckbox) marketingCheckbox.checked = current.marketing;

    if (gpcNotice) {
      if (gpcActive) {
        gpcNotice.hidden = false;
        gpcNotice.removeAttribute('hidden');
        gpcNotice.style.display = 'flex';
      } else {
        gpcNotice.hidden = true;
        gpcNotice.setAttribute('hidden', '');
        gpcNotice.style.display = 'none';
      }
    }

    // Open via native showModal or fallback
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', 'true');
    }

    dialog.setAttribute('aria-hidden', 'false');
    trapFocus(dialog);
  }

  function closePreferencesModal() {
    const dialog = document.getElementById('consent-preferences-dialog');
    if (!dialog) return;

    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }

    dialog.setAttribute('aria-hidden', 'true');

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    element.onkeydown = function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePreferencesModal();
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
  }

  // 6. Public API Interface
  window.consent = {
    get: getCurrentConsent,
    set: function (choices) {
      saveConsent(choices);
    },
    onChange: function (callback) {
      if (typeof callback === 'function') changeListeners.push(callback);
    },
    openPreferences: openPreferencesModal,
    closePreferences: closePreferencesModal,
    isGpcActive: isGpcActive,
    reset: function () {
      try {
        localStorage.removeItem(CONSENT_STORAGE_KEY);
      } catch (e) {}
      inMemoryConsent = null;
      showBanner();
      notifyChange({ necessary: true, analytics: false, marketing: false });
    },
  };

  // 7. Initialize Banner on DOM Ready
  function initConsentUI() {
    const stored = getStoredConsent();

    // Wire Banner Actions
    const acceptAllBtn = document.getElementById('consent-accept-all-btn');
    const rejectAllBtn = document.getElementById('consent-reject-all-btn');
    const manageBtn = document.getElementById('consent-manage-btn');
    const dialogCloseBtn = document.getElementById('consent-dialog-close-btn');
    const savePrefBtn = document.getElementById('consent-save-preferences-btn');
    const acceptAllModalBtn = document.getElementById('consent-modal-accept-all-btn');
    const rejectAllModalBtn = document.getElementById('consent-modal-reject-all-btn');

    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', () => {
        saveConsent({ analytics: true, marketing: true });
      });
    }

    if (rejectAllBtn) {
      rejectAllBtn.addEventListener('click', () => {
        saveConsent({ analytics: false, marketing: false });
      });
    }

    if (manageBtn) {
      manageBtn.addEventListener('click', openPreferencesModal);
    }

    if (dialogCloseBtn) {
      dialogCloseBtn.addEventListener('click', closePreferencesModal);
    }

    if (acceptAllModalBtn) {
      acceptAllModalBtn.addEventListener('click', () => {
        saveConsent({ analytics: true, marketing: true });
      });
    }

    if (rejectAllModalBtn) {
      rejectAllModalBtn.addEventListener('click', () => {
        saveConsent({ analytics: false, marketing: false });
      });
    }

    if (savePrefBtn) {
      savePrefBtn.addEventListener('click', () => {
        const analyticsCheckbox = document.getElementById('consent-toggle-analytics');
        const marketingCheckbox = document.getElementById('consent-toggle-marketing');
        saveConsent({
          analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
          marketing: marketingCheckbox ? marketingCheckbox.checked : false,
        });
      });
    }

    // Delegate footer trigger buttons
    document.addEventListener('click', (e) => {
      const target = e.target.closest('#open-cookie-preferences-btn, .footer-cookie-settings-btn');
      if (target) {
        e.preventDefault();
        openPreferencesModal();
      }
    });

    // Check if re-prompt needed
    if (!stored) {
      // If GPC is active, respect user preference automatically
      if (isGpcActive()) {
        console.log('[CONSENT_GPC] Global Privacy Control signal detected. Defaulting non-essential categories to disabled.');
      }
      showBanner();
    } else {
      hideBanner();
      // Execute any allowed scripts on initial page load
      if (stored.categories.analytics || stored.categories.marketing) {
        activateGatedScripts(stored.categories);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsentUI);
  } else {
    initConsentUI();
  }
})();

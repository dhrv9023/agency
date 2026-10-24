/**
 * ==============================================================================
 * VARAH SYSTEMS — Analytics Provider Loader (Workstream 11)
 * Provider: Plausible Analytics (EU-hosted, cookieless, privacy-first)
 * ==============================================================================
 * Contract:
 *   - Strictly consent-gated via Workstream 10 (<script type="text/plain" data-consent="analytics">).
 *   - Zero cookies, zero local storage items created by the provider script.
 *   - Configured via domain constant; .invalid placeholder used until live domain attachment.
 *   - On consent withdrawal: terminates queue dispatch and deregisters handlers.
 */

(function () {
  'use strict';

  // Verification guard: Ensure user has granted analytics consent
  if (!window.consent || typeof window.consent.get !== 'function' || !window.consent.get().analytics) {
    return;
  }

  // Derive domain from current script tag attribute or site config constant
  const currentScript = document.currentScript || document.querySelector('script[data-analytics-provider="plausible"]');
  const configuredDomain = (currentScript && currentScript.getAttribute('data-domain')) || 'domain-pending.invalid';
  const apiHost = (currentScript && currentScript.getAttribute('data-api-host')) || 'https://plausible.io';

  // Initialize Plausible stub function if not already present
  window.plausible = window.plausible || function () {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };

  // Prevent duplicate script injection
  if (document.getElementById('plausible-runtime-script')) {
    return;
  }

  const script = document.createElement('script');
  script.id = 'plausible-runtime-script';
  script.async = true;
  script.defer = true;
  script.setAttribute('data-domain', configuredDomain);
  script.src = `${apiHost}/js/script.js`;

  script.onerror = function () {
    console.warn('[ANALYTICS] Plausible script failed to load. Telemetry will safely no-op.');
  };

  document.head.appendChild(script);

  // Listen for consent revocation from Workstream 10 engine
  if (typeof window.consent.onChange === 'function') {
    window.consent.onChange((categories) => {
      if (!categories.analytics) {
        // Disarm stub and remove runtime script tag
        window.plausible = function () {};
        const activeScript = document.getElementById('plausible-runtime-script');
        if (activeScript && activeScript.parentNode) {
          activeScript.parentNode.removeChild(activeScript);
        }
      }
    });
  }
})();

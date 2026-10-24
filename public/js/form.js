/**
 * ============================================================================
 * VARAH SYSTEMS — Contact Form Controller (Workstream 9)
 * ============================================================================
 * Submits project scoping inquiries to /api/contact, enforces field validation,
 * lazy-loads Cloudflare Turnstile on first user focus, verifies honeypot,
 * manages button loading states with zero layout jump, and routes to /thank-you.html.
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('project-inquiry-form');
  if (!contactForm) return;

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const errorBanner = document.getElementById('form-error-banner');

  // Turnstile Lazy-Loading State
  let turnstileLoaded = false;
  let turnstileWidgetId = null;
  let currentTurnstileToken = '';

  const TURNSTILE_SITEKEY =
    window.VARAH_CONFIG?.turnstileSiteKey || '1x00000000000000000000AA'; // Official Cloudflare test key (always passes)

  function loadTurnstile() {
    if (turnstileLoaded) return;
    turnstileLoaded = true;

    const container = document.getElementById('turnstile-container');
    if (!container) return;

    // Third-Party Origin: challenges.cloudflare.com (Flagged for Workstreams 10 & 12 CSP)
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile) {
        turnstileWidgetId = window.turnstile.render('#turnstile-container', {
          sitekey: TURNSTILE_SITEKEY,
          theme: 'auto',
          size: 'flexible',
          callback: (token) => {
            currentTurnstileToken = token;
          },
          'error-callback': () => {
            currentTurnstileToken = '';
          },
          'expired-callback': () => {
            currentTurnstileToken = '';
          },
        });
      }
    };
    document.head.appendChild(script);
  }

  // Load Turnstile only on first form focus or pointer entry
  contactForm.addEventListener('focusin', loadTurnstile, { once: true });
  contactForm.addEventListener('pointerenter', loadTurnstile, { once: true });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function showError(message) {
    if (errorBanner) {
      errorBanner.innerHTML = `<i class="fa-solid fa-triangle-exclamation" aria-hidden="true" style="margin-right: 8px;"></i><span>${escapeHtml(message)}</span>`;
      errorBanner.style.display = 'block';
      errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      alert(message);
    }
  }

  function hideError() {
    if (errorBanner) {
      errorBanner.style.display = 'none';
      errorBanner.innerHTML = '';
    }
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const name = document.getElementById('client-name')?.value.trim();
    const email = document.getElementById('client-email')?.value.trim();
    const company = document.getElementById('client-company')?.value.trim();
    const website = document.getElementById('client-website')?.value.trim();
    const overview = document.getElementById('client-overview')?.value.trim();
    const bottleneck = document.getElementById('client-bottleneck')?.value.trim();
    const tools = document.getElementById('client-tools')?.value.trim();
    const teamSizeSelect = document.getElementById('client-team-size');
    const teamSize = teamSizeSelect ? teamSizeSelect.value : '';
    const projectTypeSelect = document.getElementById('client-project-type');
    const projectType = projectTypeSelect ? projectTypeSelect.options[projectTypeSelect.selectedIndex]?.text : 'AI Automation Workflows';
    const budgetSelect = document.getElementById('client-budget');
    const budget = budgetSelect ? budgetSelect.options[budgetSelect.selectedIndex]?.text : '$10k – $25k';
    const timelineSelect = document.getElementById('client-timeline');
    const timeline = timelineSelect ? timelineSelect.value : '';
    const preferredTimes = document.getElementById('client-preferred-times')?.value.trim();
    const context = document.getElementById('client-context')?.value.trim();
    const honeypot = document.getElementById('website_hp')?.value || '';

    // Client-side required field check
    if (!name || !email || !company || !bottleneck) {
      showError('Please complete all required fields: Your Name, Work Email, Company Name, and Process Description.');
      return;
    }

    // Preserve button width to guarantee zero layout jump
    let originalText = '';
    if (submitBtn) {
      originalText = submitBtn.innerHTML;
      const currentWidth = submitBtn.offsetWidth;
      submitBtn.style.minWidth = `${currentWidth}px`;
      submitBtn.classList.add('is-loading');
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting Inquiry...';
    }

    const payload = {
      name,
      email,
      company,
      website: website || undefined,
      overview: overview || undefined,
      message: bottleneck,
      tools: tools || undefined,
      teamSize: teamSize || undefined,
      serviceInterest: projectType,
      budgetRange: budget,
      timeline: timeline || undefined,
      preferredTimes: preferredTimes || undefined,
      context: context || undefined,
      turnstileToken: currentTurnstileToken || undefined,
      website_hp: honeypot || undefined,
      convertedOnPage: window.location.pathname || '/contact.html',
    };

    // Attach attribution strictly if analytics consent was granted
    const isConsented = Boolean(window.consent && typeof window.consent.get === 'function' && window.consent.get().analytics);
    payload.analyticsConsented = isConsented;

    if (isConsented && typeof window.getConsentedAttribution === 'function') {
      const attr = window.getConsentedAttribution();
      if (attr) {
        payload.utmSource = attr.utmSource || undefined;
        payload.utmMedium = attr.utmMedium || undefined;
        payload.utmCampaign = attr.utmCampaign || undefined;
        payload.utmTerm = attr.utmTerm || undefined;
        payload.utmContent = attr.utmContent || undefined;
        payload.referrerUrl = attr.referrerUrl || undefined;
        payload.landingPath = attr.landingPath || undefined;
      }
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'The system could not process your request. Please verify your information and retry.');
      }

      // Record valid session submission token for /thank-you.html access gating
      sessionStorage.setItem('varah_lead_submitted', 'true');
      sessionStorage.setItem('varah_lead_name', name);
      sessionStorage.setItem('varah_lead_company', company);
      sessionStorage.setItem('varah_lead_timestamp', Date.now().toString());

      // Workstream 10 & 11 Hook: Trigger conversion tracking ONLY if analytics consent is granted
      if (isConsented && typeof window.track === 'function') {
        window.track('lead_submitted', {
          serviceInterest: projectType || 'General Inquiry',
          budgetRange: budget || 'Not specified',
        });
        sessionStorage.setItem('varah_lead_tracked', 'true');
      }

      // Redirect immediately to canonical Thank-You page
      window.location.href = 'thank-you.html';
    } catch (err) {
      console.error('[SUBMISSION_ERROR]', err);
      const contactEmail = window.VARAH_CONFIG?.contactEmail;
      const isRealEmail = contactEmail && !contactEmail.includes('.invalid');
      const fallbackSuffix = isRealEmail ? ` or email ${contactEmail}.` : '.';
      showError(err.message || `Network error: Transmission failed. Please try again${fallbackSuffix}`);

      // Reset Turnstile token on error
      if (window.turnstile && turnstileWidgetId !== null) {
        window.turnstile.reset(turnstileWidgetId);
        currentTurnstileToken = '';
      }

      // Restore button state cleanly
      if (submitBtn) {
        submitBtn.classList.remove('is-loading');
        submitBtn.removeAttribute('aria-busy');
        submitBtn.disabled = false;
        submitBtn.style.minWidth = '';
        submitBtn.innerHTML = originalText;
      }
    }
  });
});

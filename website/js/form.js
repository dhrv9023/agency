/**
 * AI SYSTEMS & AUTOMATION AGENCY — CONTACT FORM LOGIC
 * Validates project scoping inquiries with client-side feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('project-inquiry-form');
  const successState = document.getElementById('form-success-state');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check required fields
    const name = document.getElementById('client-name')?.value.trim();
    const email = document.getElementById('client-email')?.value.trim();
    const company = document.getElementById('client-company')?.value.trim();
    const bottleneck = document.getElementById('client-bottleneck')?.value.trim();

    if (!name || !email || !company || !bottleneck) {
      alert('Please fill in all required fields (Name, Work Email, Company, and Bottleneck description).');
      return;
    }

    // Simulate clean async submission without page reload
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Submitting Scope Inquiry...';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      contactForm.style.display = 'none';
      if (successState) {
        successState.style.display = 'block';
        successState.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 600);
  });
});

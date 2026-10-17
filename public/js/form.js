/**
 * AI SYSTEMS & AUTOMATION AGENCY — CONTACT FORM LOGIC
 * Validates project scoping inquiries and records submissions locally
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
    const projectTypeSelect = document.getElementById('client-project-type');
    const projectType = projectTypeSelect ? projectTypeSelect.options[projectTypeSelect.selectedIndex]?.text : 'Custom AI Automation';
    const budgetSelect = document.getElementById('client-budget');
    const budget = budgetSelect ? budgetSelect.options[budgetSelect.selectedIndex]?.text : '$10k – $25k';

    if (!name || !email || !company || !bottleneck) {
      alert('Please fill in all required fields (Name, Work Email, Company, and Bottleneck description).');
      return;
    }

    // Save submission to local pipeline for Admin portal
    try {
      const stored = localStorage.getItem('agency_leads');
      const leads = stored ? JSON.parse(stored) : [];
      const newLead = {
        id: 'lead_' + Date.now(),
        name: name,
        email: email,
        company: company,
        source: 'Contact Form',
        service: projectType,
        message: bottleneck,
        budget: budget,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'New'
      };
      leads.unshift(newLead);
      localStorage.setItem('agency_leads', JSON.stringify(leads));
    } catch (err) {
      console.warn('Local lead storage error:', err);
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

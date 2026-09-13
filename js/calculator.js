/**
 * VARAH REVENUE LEAK & ROI CALCULATOR
 * Precision interactive calculation engine for business leaders
 */

const INDUSTRY_PRESETS = {
  realestate: {
    name: "Real Estate",
    leakPct: 0.18,      // 18% of leads lost specifically to competitor speed-to-lead
    recoveryPct: 0.12,  // 12% additional deals closed via 60s follow-up
    hoursPerLead: 0.35  // Hours wasted manually answering FAQs and coordinating showings
  },
  clinic: {
    name: "Clinics & Healthcare",
    leakPct: 0.22,      // 22% callers hang up or go elsewhere after-hours
    recoveryPct: 0.16,  // 16% recovered via 24/7 AI booking & follow-up
    hoursPerLead: 0.40  // Hours spent on receptionist scheduling phone calls
  },
  ecommerce: {
    name: "E-Commerce / D2C",
    leakPct: 0.25,      // Abandoned carts and unanswered pre-purchase questions
    recoveryPct: 0.14,  // Recovered via automated WhatsApp re-engagement
    hoursPerLead: 0.25  // Repetitive order status, RMA, and sizing inquiries
  },
  legal: {
    name: "Legal & Professional",
    leakPct: 0.15,      // High-value prospects seeking immediate consultation
    recoveryPct: 0.10,  // Recovered with 24/7 confidential intake bot
    hoursPerLead: 0.50  // Manual client intake and document back-and-forth
  },
  b2b: {
    name: "B2B SaaS & Services",
    leakPct: 0.20,      // Inbound forms waiting >4 hours for SDR outreach
    recoveryPct: 0.13,  // Recovered via instant calendar qualification & booking
    hoursPerLead: 0.30  // Manual CRM sorting, qualifying, and rescheduling
  }
};

let currentIndustry = "realestate";

function initRevenueCalculator() {
  const leadsSlider = document.getElementById('calc-leads-slider');
  const dealSlider = document.getElementById('calc-deal-slider');
  const leadsValText = document.getElementById('calc-leads-val');
  const dealValText = document.getElementById('calc-deal-val');

  const leakedRevText = document.getElementById('calc-out-leaked');
  const wastedHoursText = document.getElementById('calc-out-hours');
  const recoveredRevText = document.getElementById('calc-out-recovered');

  const chips = document.querySelectorAll('.calc-chip');

  if (!leadsSlider || !dealSlider || !leakedRevText) return;

  function formatCurrency(val) {
    return '$' + Math.round(val).toLocaleString('en-US');
  }

  function updateCalculations() {
    const leads = parseInt(leadsSlider.value, 10);
    const deal = parseInt(dealSlider.value, 10);
    const preset = INDUSTRY_PRESETS[currentIndustry] || INDUSTRY_PRESETS.realestate;

    leadsValText.textContent = `${leads} inquiries`;
    dealValText.textContent = formatCurrency(deal);

    // Calculate core business impacts
    const leakedRevenue = leads * preset.leakPct * deal;
    const wastedHours = Math.round(leads * preset.hoursPerLead);
    const recoveredRevenue = leads * preset.recoveryPct * deal;

    leakedRevText.textContent = formatCurrency(leakedRevenue);
    wastedHoursText.textContent = `${wastedHours} hrs / mo`;
    recoveredRevText.textContent = formatCurrency(recoveredRevenue);
  }

  leadsSlider.addEventListener('input', updateCalculations);
  dealSlider.addEventListener('input', updateCalculations);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      currentIndustry = chip.getAttribute('data-industry');
      updateCalculations();
    });
  });

  // Initial calculation run
  updateCalculations();
}

document.addEventListener('DOMContentLoaded', () => {
  initRevenueCalculator();
});

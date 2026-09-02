/**
 * AI SYSTEMS & AUTOMATION AGENCY — INTERACTIVE FEATURES
 * Filterable Use-Case Hub, Calendar Scheduler, and Bottleneck Scope Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  initUseCaseFilters();
  initBookingScheduler();
});

/**
 * Filterable Use Cases Grid
 */
function initUseCaseFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.usecase-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/**
 * Interactive Booking Scheduler for Discovery Calls (/book)
 */
function initBookingScheduler() {
  const dayButtons = document.querySelectorAll('.calendar-day-btn');
  const timeButtons = document.querySelectorAll('.time-slot-btn');
  const confirmBtn = document.getElementById('book-confirm-btn');
  const selectedSummary = document.getElementById('booking-selected-summary');
  const confirmationAlert = document.getElementById('booking-confirmation-alert');
  const bookingForm = document.getElementById('booking-details-form');

  let selectedDay = null;
  let selectedTime = null;

  if (!dayButtons.length) return;

  dayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      dayButtons.forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selectedDay = btn.getAttribute('data-date');
      updateSummary();
    });
  });

  timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeButtons.forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selectedTime = btn.getAttribute('data-time');
      updateSummary();
    });
  });

  function updateSummary() {
    if (!selectedSummary) return;
    if (selectedDay && selectedTime) {
      selectedSummary.textContent = `Selected: ${selectedDay} at ${selectedTime} (45-Min Discovery Session)`;
      if (confirmBtn) confirmBtn.removeAttribute('disabled');
    } else if (selectedDay) {
      selectedSummary.textContent = `Selected Date: ${selectedDay} — Please select a time slot below.`;
    }
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!selectedDay || !selectedTime) {
        alert('Please select both a date and a time slot before confirming.');
        return;
      }

      if (confirmationAlert) {
        confirmationAlert.style.display = 'block';
        bookingForm.style.display = 'none';
        confirmationAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}

/**
 * AI SYSTEMS & AUTOMATION AGENCY — INTERACTIVE FEATURES
 * Filterable Use-Case Hub, Calendar Scheduler, and Bottleneck Scope Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  initUseCaseFilters();
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


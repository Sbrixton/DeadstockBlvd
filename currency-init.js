// currency-init.js ✅ Updated for Live Currency Switching
import { getCurrency, setCurrency, formatPrice } from './currency.js';

// 🔁 Update all prices on the page
async function updateAllPrices() {
  // Update individual elements using `.converted-price`
  const priceEls = document.querySelectorAll('.converted-price');
  for (let el of priceEls) {
    const gbp = parseFloat(el.dataset.gbp);
    el.innerText = await formatPrice(gbp);
  }

  // Update main product price (optional fallback)
  const mainPrice = document.getElementById('convertedPrice');
  if (mainPrice && mainPrice.dataset.gbp) {
    mainPrice.innerHTML = await formatPrice(parseFloat(mainPrice.dataset.gbp));
  }

  // Trigger cart re-render (if cart module loaded)
  if (window.renderMobileDrawer) {
    window.renderMobileDrawer();
  }

  if (typeof window.render === 'function') {
    window.render(); // desktop cart
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const customSelect = document.getElementById('customSelect');
  const optionsList = document.getElementById('optionsList');

  // Default currency
  if (!localStorage.getItem('selectedCurrency')) {
    setCurrency('GBP');
  }

  // Custom dropdown logic
  optionsList.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', async (e) => {
      const value = e.target.dataset.value;
      setCurrency(value);
      await updateAllPrices(); // 🔥 update prices site-wide
    });
  });

  // Initial render
  updateAllPrices();
});


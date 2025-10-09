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
  const selectedOption = document.getElementById('selectedOption');
  const optionsList = document.getElementById('optionsList');
  const arrow = document.getElementById('dropdownArrow');

  let isDropdownOpen = false;

  // Set default currency if not already set
  if (!localStorage.getItem('selectedCurrency')) {
    setCurrency('GBP');
  }

  // ✅ Sync visible text with stored currency
  const currencyMap = {
    GBP: 'GBP (£)',
    USD: 'USD ($)',
    EUR: 'EUR (€)'
  };
  const currentCurrency = getCurrency();
  selectedOption.textContent = currencyMap[currentCurrency] || 'GBP (£)';

  // 🔁 Dropdown toggle
  customSelect.addEventListener('click', () => {
    isDropdownOpen = !isDropdownOpen;
    optionsList.style.display = isDropdownOpen ? 'block' : 'none';
    arrow.textContent = isDropdownOpen ? '^' : 'v';
  });

  // 🔄 Handle currency change
  optionsList.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', async (e) => {
      const value = e.target.dataset.value;
      selectedOption.textContent = currencyMap[value] || value;
      optionsList.style.display = 'none';
      arrow.textContent = 'v';
      isDropdownOpen = false;

      setCurrency(value);
      await updateAllPrices(); // 🔥 update prices site-wide
    });
  });

  // ❌ Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
      optionsList.style.display = 'none';
      arrow.textContent = 'v';
      isDropdownOpen = false;
    }
  });

  // ✅ Initial render
  updateAllPrices();
});



import { getCurrency, setCurrency, formatPrice } from './currency.js';

async function updateAllPrices() {
  const priceEls = document.querySelectorAll('.converted-price');
  for (let el of priceEls) {
    const gbp = parseFloat(el.dataset.gbp);
    el.innerText = await formatPrice(gbp);
  }

  const mainPrice = document.getElementById('convertedPrice');
  if (mainPrice && mainPrice.dataset.gbp) {
    mainPrice.innerHTML = await formatPrice(parseFloat(mainPrice.dataset.gbp));
  }

  // ✅ Update cart drawer and desktop cart if functions exist
  if (typeof window.renderMobileDrawer === 'function') {
    window.renderMobileDrawer();
  }

  if (typeof window.render === 'function') {
    window.render();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const customSelect = document.getElementById('customSelect');
  const selectedOption = document.getElementById('selectedOption');
  const optionsList = document.getElementById('optionsList');

  if (!localStorage.getItem('selectedCurrency')) {
    setCurrency('GBP');
  }

  const currentCurrency = getCurrency();
  const selectedText = {
    'GBP': 'GBP (£)',
    'USD': 'USD ($)',
    'EUR': 'EUR (€)'
  }[currentCurrency];
  selectedOption.textContent = selectedText;

  optionsList.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', async (e) => {
      const value = e.target.dataset.value;
      setCurrency(value);
      selectedOption.textContent = e.target.textContent;
      await updateAllPrices();
    });
  });

  updateAllPrices();
});


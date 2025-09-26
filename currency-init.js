// 💷 Default Currency Selection Script (GBP)
import { getCurrency, setCurrency } from './currency.js';

document.addEventListener("DOMContentLoaded", () => {
  const currencySelect = document.getElementById("currencySelect");

  // Force set GBP on first load if not already set
  if (!localStorage.getItem('selectedCurrency')) {
    setCurrency('GBP');
  }

  // Sync dropdown to stored currency
  const selected = getCurrency();
  if (currencySelect) {
    currencySelect.value = selected;

    currencySelect.addEventListener("change", (e) => {
      const newCurrency = e.target.value;
      setCurrency(newCurrency);
      window.location.reload(); // optional: reload to re-render prices
    });
  }
});

// currency.js

const API_KEY = 'c483f69d404b3072a225d9bb';
const BASE_CURRENCY = 'GBP';

const SYMBOLS = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

// Save user's selected currency
export function setCurrency(currencyCode) {
  localStorage.setItem('selectedCurrency', currencyCode);
}

// Get saved or default currency
export function getCurrency() {
  const selected = localStorage.getItem('selectedCurrency');
  return ['GBP', 'USD', 'EUR'].includes(selected) ? selected : BASE_CURRENCY;
}

// Fetch exchange rates
export async function getRates() {
  const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`);
  const data = await res.json();
  return data.conversion_rates;
}

// Format price for display
export async function formatPrice(gbpAmount) {
  const currency = getCurrency();
  const rates = await getRates();
  const rate = rates[currency];
  const converted = (gbpAmount * rate).toFixed(2);
  return `${SYMBOLS[currency]}${converted}`;
}

// Convert to selected currency numerically
export async function convertAmount(gbpAmount) {
  const currency = getCurrency();
  const rates = await getRates();
  const rate = rates[currency];
  return (gbpAmount * rate).toFixed(2);
}

// Convert to a specific currency (e.g. ZAR for PayFast)
export async function convertFromGBP(gbpAmount, targetCurrency) {
  const rates = await getRates();
  const rate = rates[targetCurrency];
  return gbpAmount * rate;
}

// Get just the symbol of selected currency
export function getCurrencySymbol() {
  return SYMBOLS[getCurrency()];
}


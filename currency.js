// currency.js

const API_KEY = '707765ced38f75bafba30225';
const BASE_CURRENCY = 'GBP';

const SYMBOLS = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

let cachedRates = null; // ✅ Add in-memory cache

// Save user's selected currency
export function setCurrency(currencyCode) {
  localStorage.setItem('selectedCurrency', currencyCode);
}

// Get saved or default currency
export function getCurrency() {
  const selected = localStorage.getItem('selectedCurrency');
  return ['GBP', 'USD', 'EUR'].includes(selected) ? selected : BASE_CURRENCY;
}

// ✅ Fetch & cache exchange rates
export async function getRates() {
  if (cachedRates) return cachedRates;

  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`);
    const data = await res.json();

    if (!data || !data.conversion_rates) {
      console.warn("[currency.js] Missing conversion_rates in response. Returning default rates.");
      cachedRates = { GBP: 1, USD: 1.3, EUR: 1.15 };
      return cachedRates;
    }

    cachedRates = data.conversion_rates;
    return cachedRates;
  } catch (error) {
    console.error("[currency.js] Failed to fetch exchange rates:", error);
    cachedRates = { GBP: 1, USD: 1.3, EUR: 1.15 };
    return cachedRates;
  }
}

// Format price for display
export async function formatPrice(gbpAmount) {
  const currency = getCurrency();
  const rates = await getRates();
  const rate = rates[currency] || 1;
  const converted = (gbpAmount * rate).toFixed(2);
  return `${SYMBOLS[currency] || '£'}${converted}`;
}

// Convert to selected currency numerically
export async function convertAmount(gbpAmount) {
  const currency = getCurrency();
  const rates = await getRates();
  const rate = rates[currency] || 1;
  return (gbpAmount * rate).toFixed(2);
}

// Convert to a specific currency (e.g. ZAR for PayFast)
export async function convertFromGBP(gbpAmount, targetCurrency) {
  const rates = await getRates();
  const rate = rates[targetCurrency];

  if (!rate) {
    console.warn(`[currency.js] No exchange rate found for ${targetCurrency}, using 1 as fallback.`);
    return gbpAmount;
  }

  return gbpAmount * rate;
}

// Get just the symbol of selected currency
export function getCurrencySymbol() {
  return SYMBOLS[getCurrency()] || '£';
}


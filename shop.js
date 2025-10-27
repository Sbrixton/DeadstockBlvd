// shop.js
import { updateCartCountInDOM } from './cart-utils.js';
import { formatPrice } from './currency.js';

formatPrice(1); // Warm up currency conversion

document.addEventListener("DOMContentLoaded", async () => {
  // ✅ Update cart count on page load
  updateCartCountInDOM();

  // ✅ Format all visible product prices if you use converted-price elements
  const priceEls = document.querySelectorAll(".converted-price");
  for (let el of priceEls) {
    const gbp = parseFloat(el.dataset.gbp);
    el.innerText = await formatPrice(gbp);
  }

  // ⚠️ No Add-to-Cart event listeners here!
  // cart.js now handles all .add-to-cart-btn clicks globally:
  //   • Prevents duplicates
  //   • Updates cart + drawer
  //   • Keeps product page message behavior
});



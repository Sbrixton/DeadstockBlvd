import { addToCart, updateCartCountInDOM } from './cart-utils.js';
import { renderMobileDrawer } from './cart.js';
import { formatPrice } from './currency.js'; // ✅ Import formatPrice for warm-up

// ✅ Preload currency formatter to reduce cart delay
formatPrice(1); // Pre-fetch exchange rates & symbol early

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Only attach to add-to-cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const product = {
        id: parseInt(button.dataset.id),
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        image: button.dataset.image,
      };

      addToCart(product);
      renderMobileDrawer(); // ✅ Update drawer immediately (without opening)
    });
  });

  updateCartCountInDOM();
});

import { addToCart, updateCartCountInDOM } from './cart-utils.js';
import { renderMobileDrawer } from './cart.js';
import { formatPrice } from './currency.js';

formatPrice(1); // Warm up currency conversion

document.addEventListener("DOMContentLoaded", () => {
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

      // ✅ Always re-render mobile drawer after adding
      if (typeof window.renderMobileDrawer === 'function') {
        window.renderMobileDrawer();
      }
    });
  });

  updateCartCountInDOM();
});


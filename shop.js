import { addToCart, updateCartCountInDOM } from './cart-utils.js';
import { renderMobileDrawer } from './cart.js';
import { formatPrice } from './currency.js'; // ✅ Import formatPrice for warm-up

// ✅ Preload currency formatter to reduce cart delay
formatPrice(1); // Pre-fetch exchange rates & symbol early

document.addEventListener("DOMContentLoaded", () => {
  const cartIcons = document.querySelectorAll(".cart, .add-to-cart-btn");

  cartIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const product = {
        id: parseInt(icon.dataset.id),
        name: icon.dataset.name,
        price: parseFloat(icon.dataset.price),
        image: icon.dataset.image,
      };

      addToCart(product);
      renderMobileDrawer(); // ✅ Update drawer immediately (without opening)
    });
  });

  updateCartCountInDOM();
});


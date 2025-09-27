import { addToCart, updateCartCountInDOM } from './cart-utils.js';
import { renderMobileDrawer } from './cart.js'; // ✅ Import to update cart drawer

document.addEventListener("DOMContentLoaded", () => {
  const cartIcons = document.querySelectorAll(".cart, .add-to-cart-btn");

  cartIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const product = {
        id: parseInt(icon.dataset.id), // ✅ REQUIRED for cart logic
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

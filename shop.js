import { addToCart, updateCartCountInDOM } from './cart-utils.js';

document.addEventListener("DOMContentLoaded", () => {
  const cartIcons = document.querySelectorAll(".cart");

  cartIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const product = {
        id: parseInt(icon.dataset.id), // ✅ REQUIRED for cart logic
        name: icon.dataset.name,
        price: parseFloat(icon.dataset.price),
        image: icon.dataset.image,
      };
      addToCart(product);
    });
  });

  updateCartCountInDOM();
});


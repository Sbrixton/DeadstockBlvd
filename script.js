// script.js//
import { updateCartCountInDOM, addToCart } from './cart-utils.js';

document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("bar");
  const close = document.getElementById("close");
  const navWrapper = document.querySelector(".nav-wrapper");

  bar?.addEventListener("click", () => navWrapper.classList.add("active"));
  close?.addEventListener("click", () => navWrapper.classList.remove("active"));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) navWrapper.classList.remove("active");
  });

  // ✅ Attach to Cart buttons — just call addToCart()
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const id = parseInt(button.getAttribute("data-id"));
      const name = button.getAttribute("data-name");
      const price = parseFloat(button.getAttribute("data-price"));
      const image = button.getAttribute("data-image");

      const product = { id, name, price, image };

      addToCart(product); // ✅ Use central function
    });
  });

  updateCartCountInDOM();
});



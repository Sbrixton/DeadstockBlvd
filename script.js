// script.js
import { updateCartCountInDOM, addToCart } from './cart-utils.js';

document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("bar");
  const close = document.getElementById("close");
  const navWrapper = document.querySelector(".nav-wrapper");

  // ===== Navbar toggle =====
  bar?.addEventListener("click", () => navWrapper.classList.add("active"));
  close?.addEventListener("click", () => navWrapper.classList.remove("active"));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) navWrapper.classList.remove("active");
  });

  // ===== Add-to-Cart Buttons =====
  // ✅ Only attach these listeners on non-product pages
  const isProductPage = window.location.pathname.includes("product");
  if (!isProductPage) {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const id = parseInt(button.dataset.id);
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const image = button.dataset.image;
        const size = button.dataset.size?.trim() || "N/A";

        const product = { id, name, price, image, size, quantity: 1 };

        console.log("🛒 Added from script.js:", product);
        addToCart(product);
      });
    });
  } else {
    console.log("🛑 script.js: Skipped Add-to-Cart setup on product page");
  }

  // ===== Cart Count =====
  updateCartCountInDOM();
});


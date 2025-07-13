import { updateCartCountInDOM } from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("bar");
  const navWrapper = document.getElementById("navWrapper");
  const close = document.getElementById("close");

  bar?.addEventListener("click", () => navWrapper.classList.add("active"));
  close?.addEventListener("click", () => navWrapper.classList.remove("active"));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) navWrapper.classList.remove("active");
  });

  // ✅ Show cart count on page load
  updateCartCountInDOM();
});

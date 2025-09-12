// script.js
document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("bar");
  const close = document.getElementById("close");
  const navWrapper = document.querySelector(".nav-wrapper");

  bar?.addEventListener("click", () => navWrapper.classList.add("active"));
  close?.addEventListener("click", () => navWrapper.classList.remove("active"));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) navWrapper.classList.remove("active");
  });

  // ✅ Add to Cart Functionality
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevents link click if button is inside <a>

      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-name");
      const price = parseFloat(button.getAttribute("data-price"));
      const image = button.getAttribute("data-image");

      const item = {
        id,
        name,
        price,
        image,
        quantity: 1,
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItem = cart.find((product) => product.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push(item);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${name} added to cart!`);
    });
  });
});



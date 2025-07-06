import {
  getCart,
  saveCart,
  updateCartCountInDOM,
  showToast
} from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // MAIN IMAGE LOGIC
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("mainProductImage");

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;
    });
  });

  // ADD TO CART LOGIC
  const addToCartBtn = document.getElementById("addToCartBtn");

  addToCartBtn.addEventListener("click", () => {
    const cart = getCart();

    // This is your example product — make sure to pull from real product data if needed
    const product = {
      id: 1,
      name: "GitHub T-Shirt",
      price: 25.99,
      quantity: 1,
      image: "assets/github-shirt.png", // adjust path
    };

    // Check if item already in cart
    const index = cart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push(product);
    }

    saveCart(cart);
    updateCartCountInDOM();
    showToast("✅ GitHub says it added to cart.");
  });

  // Optional: Update cart count immediately on load
  updateCartCountInDOM();
});

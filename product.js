import {
  getCart,
  saveCart,
  updateCartCountInDOM,
  showToast
} from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("addToCartBtn");
  const cartCount = document.getElementById("cart-count");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("mainProductImage");

  // MAIN IMAGE SWAP
  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;
    });
  });

  // ADD TO CART FUNCTIONALITY
  addToCartBtn.addEventListener("click", () => {
    const cart = getCart();

    const product = {
      id: 1,
      name: "GitHub T-Shirt",
      price: 25.99,
      quantity: 1,
      image: "assets/github-shirt.png", // Adjust path as needed
    };

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
});

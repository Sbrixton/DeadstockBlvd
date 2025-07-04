// product.js
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
  const cartCount = document.getElementById("cart-count");

  addToCartBtn.addEventListener("click", () => {
    let current = parseInt(cartCount.textContent, 10);
    cartCount.textContent = current + 1;

    // Optional: feedback
    alert("Added to cart!");
  });
});

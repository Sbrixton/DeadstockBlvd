import {
  getCart,
  saveCart,
  updateCartCountInDOM
} from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("addToCartBtn");

  addToCartBtn?.addEventListener("click", async () => {
    const cart = getCart();

    const product = {
      id: parseInt(addToCartBtn.dataset.id),
      name: addToCartBtn.dataset.name,
      price: parseFloat(addToCartBtn.dataset.price),
      quantity: 1,
      image: addToCartBtn.dataset.image,
    };

    const index = cart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push(product);
    }

    saveCart(cart);
    updateCartCountInDOM();

    const drawer = document.getElementById("mobileCartDrawer");
    if (drawer?.classList.contains("open")) {
      const module = await import("./cart.js");
      module.renderMobileDrawer();
    }
  });

  updateCartCountInDOM();
});

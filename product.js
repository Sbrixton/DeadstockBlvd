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

import { getCart, saveCart } from "./cart-utils.js";

if (window.paypal) {
  paypal.Buttons({
    createOrder: function (data, actions) {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: total.toFixed(2),
          },
        }],
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        console.log("Transaction completed by " + details.payer.name.given_name);
        // Redirect to checkout page silently
        window.location.href = "checkout.html";
      });
    },
    onError: function (err) {
      console.error("PayPal error:", err);
      alert("There was a problem processing your payment.");
    },
  }).render("#paypal-button-container");
}

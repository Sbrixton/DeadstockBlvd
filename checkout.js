import { getCart, updateCartCountInDOM } from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("checkoutCartItems");
  const subtotalElement = document.getElementById("checkoutSubtotal");
  const shippingSelect = document.getElementById("shippingOption");
  const freeShippingText = document.getElementById("freeShippingText");
  const subtotalValue = calculateSubtotal(cart);

  updateCartCountInDOM();
  renderCartItems(cart);
  subtotalElement.textContent = `R${subtotalValue.toFixed(2)}`;

  // Show free shipping text on option select
  shippingSelect?.addEventListener("change", () => {
    if (shippingSelect.value === "standard") {
      freeShippingText.style.display = "block";
    }
  });

  // Setup PayPal button
  if (typeof paypal !== "undefined") {
    paypal.Buttons({
      style: {
        layout: "vertical",
        color: "black",
        shape: "rect",
        label: "paypal"
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: subtotalValue.toFixed(2),
              currency_code: "USD"
            }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(details => {
          alert(`✅ Payment completed by ${details.payer.name.given_name}`);
          localStorage.removeItem("cart");
          window.location.href = "thankyou.html";
        });
      },
      onError: (err) => {
        console.error("PayPal Checkout error", err);
        alert("There was an issue processing your payment.");
      }
    }).render("#paypal-button-container");
  }
});

function calculateSubtotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderCartItems(cart) {
  const container = document.getElementById("checkoutCartItems");

  if (!container || cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  container.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${cart.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>R${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

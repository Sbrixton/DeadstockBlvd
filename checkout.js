import { getCart, updateCartCountInDOM } from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("[checkout.js] Page loaded");

  const cart = getCart();
  updateCartCountInDOM();

  const subtotalElement = document.getElementById("checkoutSubtotal");
  const shippingSelect = document.getElementById("shippingOption");
  const freeShippingText = document.getElementById("freeShippingText");
  const subtotalValue = calculateSubtotal(cart);

  if (subtotalElement) {
    subtotalElement.textContent = `R${subtotalValue.toFixed(2)}`;
  }

  // ✅ Show free shipping note
  if (shippingSelect && freeShippingText) {
    shippingSelect.addEventListener("change", () => {
      if (shippingSelect.value === "standard") {
        freeShippingText.style.display = "block";
      }
    });
  }

  // ✅ Render products in right panel
  renderCheckoutProducts(cart);

  // ✅ PayPal button setup
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

function renderCheckoutProducts(cart) {
  const container = document.getElementById("checkoutProducts");

  if (!container) {
    console.warn("[checkout.js] #checkoutProducts not found in DOM.");
    return;
  }

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "checkout-item";
    
    itemDiv.innerHTML = `
      <div class="checkout-img-wrapper">
        <img src="${item.image}" alt="${item.name}" class="checkout-item-img" />
        <span class="checkout-qty-badge">${item.quantity}</span>
      </div>
      <div class="checkout-item-details">
        <h4>${item.name}</h4>
      </div>
      <div class="checkout-item-price">R${(item.price * item.quantity).toFixed(2)}</div>
    `;
    
    container.appendChild(itemDiv);
  });

  console.log("[checkout.js] Rendered products:", cart);
}

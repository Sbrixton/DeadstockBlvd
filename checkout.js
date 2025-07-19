document.addEventListener("DOMContentLoaded", () => {
  console.log("[checkout.js] Page loaded");

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  updateCartCountInDOM();

  const subtotalElement = document.getElementById("checkoutSubtotal");
  const subtotalValue = calculateSubtotal(cart);

  if (subtotalElement) {
    subtotalElement.textContent = `R${subtotalValue.toFixed(2)}`;
  }

  renderCheckoutProducts(cart);

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

function updateCartCountInDOM() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartCount = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCount) {
    cartCount.textContent = totalItems;
  } else {
    console.warn("[checkout.js] #cart-count element not found.");
  }
}

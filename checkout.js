const checkbox = document.getElementById('agree-check');
const paypalContainer = document.getElementById('paypal-button-container');
const pageOverlay = document.getElementById('pageOverlay');
const termsModal = document.getElementById('termsModal');
const closeTermsBtn = document.getElementById('closeTermsBtn');
const viewTermsLink = document.getElementById('view-terms-link');

// === Load and render cart ===
const cart = JSON.parse(sessionStorage.getItem('checkoutCart')) || [];
const cartBody = document.getElementById('cart-body');
const totalDisplay = document.getElementById('cart-total');
let total = 0;

cart.forEach(item => {
  const price = parseFloat(item.price);
  const subtotal = price * item.quantity;
  total += subtotal;

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${item.name}</td>
    <td>$${price.toFixed(2)}</td>
    <td>${item.quantity}</td>
    <td>$${subtotal.toFixed(2)}</td>
  `;
  cartBody.appendChild(row);
});

totalDisplay.textContent = `$${total.toFixed(2)}`;

// === Overlay lock ===
document.addEventListener('DOMContentLoaded', () => {
  pageOverlay.style.display = 'block';
  paypalContainer.classList.remove('enabled');
});

// === Checkbox control to unlock page ===
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    pageOverlay.style.display = 'none';
    paypalContainer.classList.add('enabled');
  } else {
    pageOverlay.style.display = 'block';
    paypalContainer.classList.remove('enabled');
  }
});

// === Show/hide Terms Modal ===
viewTermsLink.addEventListener('click', (e) => {
  e.preventDefault();
  termsModal.classList.remove('hidden');
});

closeTermsBtn.addEventListener('click', () => {
  termsModal.classList.add('hidden');
});

// === PayPal Integration ===
paypal.Buttons({
  onInit: function (data, actions) {
    actions.disable();

    checkbox.addEventListener('change', function () {
      if (this.checked) {
        actions.enable();
      } else {
        actions.disable();
      }
    });
  },
  createOrder: function (data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: total.toFixed(2)
        }
      }]
    });
  },
  onApprove: function (data, actions) {
    return actions.order.capture().then(function (details) {
      alert(`✅ Thanks, ${details.payer.name.given_name}. Order confirmed.`);
      sessionStorage.removeItem('checkoutCart');
      // Optional: show acknowledgment later here
    });
  }
}).render('#paypal-button-container');

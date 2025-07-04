// checkout.js

// Retrieve and render cart
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

// Terms checkbox logic
const checkbox = document.getElementById('agree-check');
const paypalContainer = document.getElementById('paypal-button-container');

// Watch checkbox state and toggle PayPal
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    paypalContainer.classList.add('enabled');
  } else {
    paypalContainer.classList.remove('enabled');
  }
});

// PayPal integration
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
      alert(`✅ Thanks, ${details.payer.name.given_name}. Your order is confirmed.`);
      sessionStorage.removeItem('checkoutCart');
      window.location.href = "thankyou.html";
    });
  }
}).render('#paypal-button-container');

// ===== Terms Modal Logic =====
const termsModal = document.getElementById('termsModal');
const agreeBtn = document.getElementById('agreeBtn');
const agreeCheckbox = document.getElementById('agree-check');
const pageWrapper = document.querySelector('.page-wrapper');

// Lock the page until terms are accepted
document.addEventListener('DOMContentLoaded', () => {
  termsModal.style.display = 'flex';
  pageWrapper.style.pointerEvents = 'none';
  pageWrapper.style.filter = 'blur(4px)';
});

// Close modal and allow interaction
agreeBtn.addEventListener('click', () => {
  termsModal.style.display = 'none';
  pageWrapper.style.pointerEvents = 'auto';
  pageWrapper.style.filter = 'none';
  agreeCheckbox.checked = true;

  // Enable PayPal button once agreed
  document.getElementById('paypal-button-container').classList.add('enabled');
});


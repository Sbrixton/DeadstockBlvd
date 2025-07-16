// checkout.js

// ===== Render Cart from Session =====
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

// ===== Modal Logic =====
const termsModal = document.getElementById('termsModal');
const modalCheckbox = document.getElementById('modalCheck'); // This checkbox lives inside the modal
const agreeBtn = document.getElementById('agreeBtn');
const agreeCheckbox = document.getElementById('agree-check'); // This is the one under PayPal
const pageWrapper = document.querySelector('.page-wrapper');

// Lock page until terms accepted
document.addEventListener('DOMContentLoaded', () => {
  termsModal.style.display = 'flex';
  pageWrapper.style.pointerEvents = 'none';
  pageWrapper.style.filter = 'blur(4px)';
  agreeBtn.disabled = true; // Disable the button until checkbox is checked
});

// Enable "Agree" button once checkbox checked
modalCheckbox.addEventListener('change', () => {
  agreeBtn.disabled = !modalCheckbox.checked;
});

// When user agrees
agreeBtn.addEventListener('click', () => {
  termsModal.style.display = 'none';
  pageWrapper.style.pointerEvents = 'auto';
  pageWrapper.style.filter = 'none';
  agreeCheckbox.checked = true;

  // Enable PayPal container styling
  document.getElementById('paypal-button-container').classList.add('enabled');
});

// ===== Checkbox Logic (below payment) =====
agreeCheckbox.addEventListener('change', () => {
  if (agreeCheckbox.checked) {
    document.getElementById('paypal-button-container').classList.add('enabled');
  } else {
    document.getElementById('paypal-button-container').classList.remove('enabled');
  }
});

// ===== PayPal Button Logic =====
paypal.Buttons({
  onInit: function (data, actions) {
    actions.disable();

    agreeCheckbox.addEventListener('change', function () {
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
      // Stay on page – no redirect
    });
  }
}).render('#paypal-button-container');

const checkbox = document.getElementById('agree-check');
const paypalContainer = document.getElementById('paypal-button-container');
const pageWrapper = document.querySelector('.page-wrapper');
const termsWrapper = document.getElementById('termsWrapper');
const termsLink = document.getElementById('view-terms-link');
const termsModal = document.getElementById('termsModal');
const closeModalBtn = document.getElementById('closeTermsModal');

// Lock page on load
document.addEventListener('DOMContentLoaded', () => {
  pageWrapper.classList.add('blurred');
  termsWrapper.classList.remove('hidden');
  paypalContainer.classList.remove('enabled');
});

// Handle checkbox interaction
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    pageWrapper.classList.remove('blurred');
    termsWrapper.classList.add('hidden');
    paypalContainer.classList.add('enabled');
  } else {
    pageWrapper.classList.add('blurred');
    termsWrapper.classList.remove('hidden');
    paypalContainer.classList.remove('enabled');
  }
});

// Show Terms modal when "Terms & Conditions" link is clicked
termsLink.addEventListener('click', (e) => {
  e.preventDefault();
  termsModal.classList.remove('hidden');
});

// Close modal
closeModalBtn.addEventListener('click', () => {
  termsModal.classList.add('hidden');
});

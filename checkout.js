const checkbox = document.getElementById('agree-check');
const paypalContainer = document.getElementById('paypal-button-container');
const pageWrapper = document.querySelector('.page-wrapper');
const termsWrapper = document.getElementById('termsWrapper');

// Lock the page until terms are accepted
document.addEventListener('DOMContentLoaded', () => {
  pageWrapper.classList.add('blurred');
});

// When checkbox is checked, unlock page
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

// cart-utils.js

export function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateCartCountInDOM() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = total;
      cartCount.style.display = "inline-block";
  }
}

export function showToast(msg) {
  let toast = document.createElement("div");
  toast.className = "toast show";
  toast.innerText = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("show");
    toast.remove();
  }, 3000);
}

export function addToCart(product) {
  let cart = getCart();
  const existing = cart.find((item) => item.name === product.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartCountInDOM();
  showToast("🛒 Added to cart!");
}

export function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateCartCountInDOM() {
  const cart = getCart();
  const cartCount = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = `Cart (${totalItems})`;
}

export function showToast(message) {
  alert(message); // Simple fallback, replace with toast UI if needed
}

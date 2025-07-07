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

  if (cartCount) {
    cartCount.textContent = totalItems; // ✅ just show the number
  } else {
    console.warn("[cart-utils] #cart-count element not found");
  }
}

export function showToast(message) {
  alert(message); // Optional
}

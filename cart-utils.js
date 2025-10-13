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
    cartCount.textContent = totalItems;
  } else {
    console.warn("[cart-utils] #cart-count element not found");
  }
}

// Optional toast function (disabled for better UX)
export function showToast(message) {
  // alert(message); // Disabled
}

// ✅ Updated to track product by both ID and SIZE
export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id && item.size === product.size);

  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  saveCart(cart);
  updateCartCountInDOM();
}


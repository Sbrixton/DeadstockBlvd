import {
  getCart,
  saveCart,
  updateCartCountInDOM
} from "./cart-utils.js";

import {
  formatPrice
} from "./currency.js";

formatPrice(1); // preload formatting

function updateDrawerCheckoutState() {
  const cart = getCart();
  const drawerCheckoutBtn = document.getElementById("drawerCheckoutBtn");
  if (!drawerCheckoutBtn) return;
  drawerCheckoutBtn.disabled = cart.length === 0;
}

window.addEventListener("load", () => {
  const cartIcon = document.getElementById("cartIcon");
  const mobileDrawer = document.getElementById("mobileCartDrawer");
  const closeCartDrawer = document.getElementById("closeCartDrawer");
  const drawerCheckoutBtn = document.getElementById("drawerCheckoutBtn");
  const cartBackdrop = document.getElementById("cartBackdrop");
  const proceedBtn = document.getElementById("proceedBtn");

  proceedBtn?.addEventListener("click", () => {
    window.location.href = "shop.html";
  });

  if (cartIcon && mobileDrawer) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      renderMobileDrawer();
      mobileDrawer.classList.add("open");
      if (cartBackdrop) cartBackdrop.style.display = "block";
    });
  }

  closeCartDrawer?.addEventListener("click", () => {
    mobileDrawer.classList.remove("open");
    if (cartBackdrop) cartBackdrop.style.display = "none";
  });

  cartBackdrop?.addEventListener("click", () => {
    mobileDrawer.classList.remove("open");
    if (cartBackdrop) cartBackdrop.style.display = "none";
  });

  drawerCheckoutBtn?.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) return;
    window.location.href = "checkout.html";
  });

  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-id]");
    if (!target) return;

    const id = parseInt(target.dataset.id);
    if (!id) return;

    let cart = getCart();
    const itemIndex = cart.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    const itemDiv = target.closest(".cart-item");
    const messageDiv = itemDiv?.parentElement?.querySelector(".limit-message");

    if (target.classList.contains("qty-btn")) {
      if (target.classList.contains("plus")) {
        if (cart[itemIndex].quantity >= 1) {
          target.classList.add("loading");
          if (messageDiv) {
            messageDiv.textContent = "Only 1 item was added due to availability.";
            messageDiv.style.display = "block";
          }
          setTimeout(() => {
            target.classList.remove("loading");
            if (messageDiv) messageDiv.style.display = "none";
          }, 2000);
          return;
        }
        cart[itemIndex].quantity += 1;
      } else {
        cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity - 1);
        if (messageDiv) messageDiv.style.display = "none";
        target.classList.remove("loading");
      }
      saveCart(cart);
      renderMobileDrawer();
    }

    if (target.classList.contains("remove-item-mobile")) {
      cart.splice(itemIndex, 1);
      saveCart(cart);
      renderMobileDrawer();
    }
  });

  renderMobileDrawer();
});

export async function renderMobileDrawer() {
  const cart = getCart();
  const mobileCartItems = document.getElementById("mobileCartItems");
  const drawerSubtotal = document.getElementById("drawerCartSubtotal");

  if (!mobileCartItems || !drawerSubtotal) return;

  mobileCartItems.innerHTML = "";
  drawerSubtotal.textContent = "0.00";

  let subtotal = 0;

  if (cart.length === 0) {
    mobileCartItems.innerHTML = `
      <div class="empty-cart-message">
        <p>Your cart is empty.</p>
        <button id="drawerProceedBtn" class="proceed-to-shop-btn">Proceed to Shop</button>
      </div>`;
    updateCartCountInDOM();
    document.getElementById("drawerProceedBtn")
      ?.addEventListener("click", () => window.location.href = "shop.html");
    return;
  }

  for (const item of cart) {
    if (!item || typeof item.price !== "number" || typeof item.quantity !== "number") continue;

    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const wrapper = document.createElement("div");
    wrapper.className = "cart-item-wrapper";

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    const sizeDisplay = item.size ? `<p class="cart-size">Size: ${item.size}</p>` : "";

    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-img" />
      <div class="cart-details">
        <p class="cart-name">${item.name}</p>
        <p class="cart-price">Price: 0.00</p>
        ${sizeDisplay}
        <div class="quantity-controls">
          <button class="qty-btn minus" data-id="${item.id}">−</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn plus" data-id="${item.id}">
            <span class="plus-text">+</span>
            <span class="plus-loader">
              <span class="plus-spinner"></span>
            </span>
          </button>
        </div>
      </div>
      <button class="remove-item-mobile" data-id="${item.id}">
        <img src="assets/bin-icon.png" alt="Remove" class="bin-icon" />
      </button>
    `;

    wrapper.appendChild(itemDiv);

    const messageDiv = document.createElement("div");
    messageDiv.className = "limit-message";
    messageDiv.style.display = "none";
    wrapper.appendChild(messageDiv);

    mobileCartItems.appendChild(wrapper);

    formatPrice(item.price).then(formatted => {
      const priceEl = itemDiv.querySelector(".cart-price");
      if (priceEl) priceEl.textContent = `Price: ${formatted}`;
    });
  }

  formatPrice(subtotal).then(formatted => {
    drawerSubtotal.textContent = formatted;
  });

  updateCartCountInDOM();
  updateDrawerCheckoutState();
}




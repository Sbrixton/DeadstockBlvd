import {
  getCart,
  saveCart,
  updateCartCountInDOM
} from "./cart-utils.js";

import { formatPrice } from "./currency.js";

formatPrice(1); // preload formatting

/* -------------------------------------------------------------------------- */
/*                        CART DRAWER + ICON CONTROLS                         */
/* -------------------------------------------------------------------------- */

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

  /* -------------------------- MOBILE DRAWER LOGIC -------------------------- */
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
      const item = cart[itemIndex];

      if (target.classList.contains("plus")) {
        // Prevent exceeding 1
        if (item.quantity >= 1) {
          target.classList.add("loading");

          if (messageDiv) {
            messageDiv.textContent = "Only 1 product was added due to availability.";
            messageDiv.classList.add("visible");
          }

          setTimeout(() => {
            target.classList.remove("loading");
            if (messageDiv) messageDiv.classList.remove("visible");
          }, 2000);

          return;
        }

        item.quantity += 1;
      } else {
        // Decrease qty (not below 1)
        item.quantity = Math.max(1, item.quantity - 1);
        if (messageDiv) messageDiv.classList.remove("visible");
      }

      saveCart(cart);
      renderMobileDrawer();
      return;
    }

    if (target.classList.contains("remove-item-mobile")) {
      cart.splice(itemIndex, 1);
      saveCart(cart);
      renderMobileDrawer();
    }
  });

  renderMobileDrawer();
});

/* -------------------------------------------------------------------------- */
/*                        PRODUCT PAGE MESSAGE HANDLER                        */
/* -------------------------------------------------------------------------- */

function showGlobalLimitMessage(button, text) {
  let msg = button.parentElement.querySelector(".global-limit-message");
  if (!msg) {
    msg = document.createElement("div");
    msg.className = "global-limit-message";
    button.parentElement.insertBefore(msg, button);
  }

  msg.textContent = text;
  msg.classList.add("visible");

  setTimeout(() => {
    msg.classList.remove("visible");
  }, 2000);
}

/* -------------------------------------------------------------------------- */
/*                         ADD TO CART HANDLERS (GLOBAL)                      */
/* -------------------------------------------------------------------------- */

window.addEventListener("load", () => {
  // --- Product Page Button ---
  const productBtn = document.getElementById("addToCartBtn");
  if (productBtn) {
    productBtn.addEventListener("click", () => {
      const id = parseInt(productBtn.dataset.id);
      if (!id) return;

      const cart = getCart();
      const alreadyInCart = cart.find(item => item.id === id);

      if (alreadyInCart) {
        showGlobalLimitMessage(productBtn, "Only 1 product was added due to availability.");
        return;
      }

      const newItem = {
        id,
        name: productBtn.dataset.name,
        price: parseFloat(productBtn.dataset.price),
        size: productBtn.dataset.size,
        image: productBtn.dataset.image,
        quantity: 1
      };

      cart.push(newItem);
      saveCart(cart);
      updateCartCountInDOM();
    });
  }

  // --- Shop & Recommendation Buttons (NO MESSAGE) ---
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart-btn");
    if (!btn) return;

    const id = parseInt(btn.dataset.id);
    if (!id) return;

    const cart = getCart();
    const alreadyInCart = cart.find(item => item.id === id);
    if (alreadyInCart) return; // silently ignore duplicates

    const newItem = {
      id,
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price),
      size: btn.dataset.size,
      image: btn.dataset.image,
      quantity: 1
    };

    cart.push(newItem);
    saveCart(cart);
    updateCartCountInDOM();
  });
});

/* -------------------------------------------------------------------------- */
/*                        RENDER MOBILE CART DRAWER                           */
/* -------------------------------------------------------------------------- */

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
        <img src="Trash2.png" alt="Remove" class="bin-icon" />
      </button>
    `;

    wrapper.appendChild(itemDiv);

    const messageDiv = document.createElement("div");
    messageDiv.className = "limit-message";
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



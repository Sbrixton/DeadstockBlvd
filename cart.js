import {
  getCart,
  saveCart,
  updateCartCountInDOM
} from "./cart-utils.js";

import {
  formatPrice
} from "./currency.js";

// Preload currency formatting
formatPrice(1);

function updateDrawerCheckoutState() {
  const cart = getCart();
  const drawerCheckoutBtn = document.getElementById("drawerCheckoutBtn");
  if (!drawerCheckoutBtn) return;
  drawerCheckoutBtn.disabled = cart.length === 0;
}

window.addEventListener("load", () => {
  const empty = document.getElementById("emptyCart");
  const section = document.getElementById("cartSection");
  const cartWrapper = document.getElementById("cart-items-wrapper");
  const subEl = document.getElementById("CartSubtotal");
  const totalEl = document.getElementById("Total");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const proceedBtn = document.getElementById("proceedBtn");

  const hasDesktopCart = cartWrapper && subEl && totalEl;

  const cartIcon = document.getElementById("cartIcon");
  const mobileDrawer = document.getElementById("mobileCartDrawer");
  const closeCartDrawer = document.getElementById("closeCartDrawer");
  const drawerCheckoutBtn = document.getElementById("drawerCheckoutBtn");

  proceedBtn?.addEventListener("click", () => {
    window.location.href = "shop.html";
  });

  async function render() {
    if (!hasDesktopCart) return;

    let cart = getCart();
    cartWrapper.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
      empty.style.display = "flex";
      section.style.display = "none";
      checkoutBtn.style.display = "none";
      proceedBtn.style.display = "inline-block";
      subEl.textContent = "0.00";
      totalEl.textContent = "0.00";
      updateCartCountInDOM();
      updateDrawerCheckoutState();
      return;
    }

    empty.style.display = "none";
    section.style.display = "block";
    checkoutBtn.style.display = "block";
    proceedBtn.style.display = "none";

    for (const item of cart) {
      if (!item || typeof item.price !== "number") continue;

      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";

      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-img">
        <div class="cart-details">
          <p class="cart-name">${item.name}</p>
          <p class="cart-price">Price: 0.00</p>
          <div class="quantity-controls">
            <button class="qty-btn minus" data-id="${item.id}">-</button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn plus" data-id="${item.id}">
              +
              <span class="plus-loader" style="display:none;">
                <span class="plus-spinner"></span>
              </span>
            </button>
          </div>
          <p class="cart-total">Total: 0.00</p>
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </div>
        <div class="limit-message" style="display:none;"></div>
      `;

      cartWrapper.appendChild(itemDiv);

      // Format price
      formatPrice(item.price).then(formatted => {
        itemDiv.querySelector(".cart-price").textContent = `Price: ${formatted}`;
      });
      formatPrice(itemTotal).then(formatted => {
        itemDiv.querySelector(".cart-total").textContent = `Total: ${formatted}`;
      });
    }

    formatPrice(subtotal).then(formatted => {
      subEl.textContent = formatted;
      totalEl.textContent = formatted;
    });

    updateCartCountInDOM();
    updateDrawerCheckoutState();
  }

  if (cartIcon && mobileDrawer) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      renderMobileDrawer();
      mobileDrawer.classList.add("open");
    });
  }

  closeCartDrawer?.addEventListener("click", () => {
    mobileDrawer.classList.remove("open");
  });

  drawerCheckoutBtn?.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) return;
    window.location.href = "checkout.html";
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    const id = parseInt(target.dataset.id);
    if (!id) return;

    let cart = getCart();
    const itemIndex = cart.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    if (target.classList.contains("qty-btn")) {
      const itemDiv = target.closest(".cart-item");
      const messageDiv = itemDiv.querySelector(".limit-message");
      const plusLoader = itemDiv.querySelector(".plus-loader");

      if (target.classList.contains("plus")) {
        if (cart[itemIndex].quantity >= 1) {
          plusLoader.style.display = "inline-flex";
          messageDiv.textContent = "Only 1 item was added due to availability.";
          messageDiv.style.display = "block";

          setTimeout(() => {
            plusLoader.style.display = "none";
            messageDiv.style.display = "none";
          }, 2000);
          return;
        }
        cart[itemIndex].quantity += 1;
      } else if (target.classList.contains("minus")) {
        cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity - 1);
        messageDiv.style.display = "none";
        plusLoader.style.display = "none";
      }

      saveCart(cart);
      render();
    }

    if (target.classList.contains("remove-item")) {
      cart.splice(itemIndex, 1);
      saveCart(cart);
      render();
    }
  });

  render();
});

// ---------- Mobile Cart Drawer ----------
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

    // Create wrapper to hold cart-item and message vertically
    const wrapper = document.createElement("div");
    wrapper.className = "cart-item-wrapper";

    // Create cart-item div
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-img" />
      <div class="cart-details">
        <p class="cart-name">${item.name}</p>
        <p class="cart-price">Price: 0.00</p>
        <div class="quantity-controls">
          <button class="qty-btn minus" data-id="${item.id}">−</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn plus" data-id="${item.id}">
            ＋
            <span class="plus-loader" style="display:none;">
              <span class="plus-spinner"></span>
            </span>
          </button>
        </div>
      </div>
      <button class="remove-item-mobile" data-id="${item.id}">✕</button>
    `;

    // Append itemDiv and messageDiv inside wrapper
    wrapper.appendChild(itemDiv);

    const messageDiv = document.createElement("div");
    messageDiv.className = "limit-message";
    messageDiv.style.display = "none";
    wrapper.appendChild(messageDiv);

    // Append wrapper to mobileCartItems
    mobileCartItems.appendChild(wrapper);

    formatPrice(item.price).then(formatted => {
      itemDiv.querySelector(".cart-price").textContent = `Price: ${formatted}`;
    });
  }

  formatPrice(subtotal).then(formatted => {
    drawerSubtotal.textContent = formatted;
  });

  // Attach event listeners for quantity buttons and remove buttons inside mobile drawer
  mobileCartItems.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      let cart = getCart();
      const itemIndex = cart.findIndex(i => i.id === id);
      if (itemIndex === -1) return;

      const itemDiv = btn.closest(".cart-item");
      const messageDiv = itemDiv.parentElement.querySelector(".limit-message");
      const plusLoader = itemDiv.querySelector(".plus-loader");

      if (btn.classList.contains('plus')) {
        if (cart[itemIndex].quantity >= 1) {
          plusLoader.style.display = "inline-flex";
          messageDiv.textContent = "Only 1 item was added due to availability.";
          messageDiv.style.display = "block";
          setTimeout(() => {
            plusLoader.style.display = "none";
            messageDiv.style.display = "none";
          }, 2000);
          return;
        }
        cart[itemIndex].quantity++;
      } else if (btn.classList.contains('minus')) {
        cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity - 1);
        messageDiv.style.display = "none";
        plusLoader.style.display = "none";
      }

      saveCart(cart);
      updateCartCountInDOM();
      renderMobileDrawer();
    });
  });

  mobileCartItems.querySelectorAll('.remove-item-mobile').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      let cart = getCart().filter(i => i.id !== id);
      saveCart(cart);
      updateCartCountInDOM();
      renderMobileDrawer();
    });
  });

  updateCartCountInDOM();
  updateDrawerCheckoutState();
}


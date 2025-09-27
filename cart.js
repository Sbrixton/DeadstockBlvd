import {
  getCart,
  saveCart,
  updateCartCountInDOM
} from "./cart-utils.js";

import {
  formatPrice
} from "./currency.js";

function updateDrawerCheckoutState() {
  const cart = getCart();
  const drawerCheckoutBtn = document.getElementById("drawerCheckoutBtn");
  if (!drawerCheckoutBtn) return;
  drawerCheckoutBtn.disabled = cart.length === 0;
}

window.addEventListener("load", () => {
  const cart = getCart();
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

      const formattedItemTotal = await formatPrice(itemTotal);
      const formattedItemPrice = await formatPrice(item.price);

      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-img">
        <div class="cart-details">
          <p class="cart-name">${item.name}</p>
          <p class="cart-price">Price: ${formattedItemPrice}</p>
          <div class="quantity-controls">
            <button class="qty-btn minus" data-id="${item.id}">-</button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn plus" data-id="${item.id}">+</button>
          </div>
          <p class="cart-total">Total: ${formattedItemTotal}</p>
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </div>
      `;

      cartWrapper.appendChild(itemDiv);
    }

    const formattedSubtotal = await formatPrice(subtotal);
    subEl.textContent = formattedSubtotal;
    totalEl.textContent = formattedSubtotal;

    updateCartCountInDOM();
    updateDrawerCheckoutState();
  }

  if (cartIcon && mobileDrawer) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      renderMobileDrawer(); // ✅ opens with updated cart
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
      if (target.classList.contains("plus")) {
        cart[itemIndex].quantity += 1;
      } else if (target.classList.contains("minus")) {
        cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity - 1);
      }
      saveCart(cart);
      render();
      renderMobileDrawer(); // ✅ keeps mobile drawer in sync
    }

    if (target.classList.contains("remove-item")) {
      cart.splice(itemIndex, 1);
      saveCart(cart);
      render();
      renderMobileDrawer();
    }
  });

  render();
});

export async function renderMobileDrawer() {
  const cart = getCart();
  const mobileCartItems = document.getElementById("mobileCartItems");
  const drawerSubtotal = document.getElementById("drawerCartSubtotal");

  if (!mobileCartItems || !drawerSubtotal) {
    console.error("Mobile cart drawer elements not found.");
    return;
  }

  mobileCartItems.innerHTML = "";
  let subtotal = 0;

  if (cart.length === 0) {
    mobileCartItems.innerHTML = `
      <div class="empty-cart-message">
        <p>Your cart is empty.</p>
        <button id="drawerProceedBtn" class="proceed-to-shop-btn">Proceed to Shop</button>
      </div>`;
    drawerSubtotal.textContent = "0.00";
    document.getElementById("drawerProceedBtn")
      ?.addEventListener("click", () => window.location.href = "shop.html");
    updateCartCountInDOM();
    updateDrawerCheckoutState();
    return;
  }

  for (const item of cart) {
    if (!item || typeof item.price !== "number" || typeof item.quantity !== "number") continue;

    subtotal += item.price * item.quantity;

    const formattedItemPrice = await formatPrice(item.price);

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-img" />
      <div class="cart-details">
        <p class="cart-name">${item.name}</p>
        <p class="cart-price">${formattedItemPrice}</p>
        <div class="quantity-controls">
          <button class="qty-btn minus" data-id="${item.id}">−</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn plus" data-id="${item.id}">＋</button>
        </div>
      </div>
      <button class="remove-item-mobile" data-id="${item.id}">✕</button>
    `;

    mobileCartItems.appendChild(itemDiv);
  }

  const formattedSubtotal = await formatPrice(subtotal);
  drawerSubtotal.textContent = formattedSubtotal;

  mobileCartItems.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      let cart = getCart();
      const prod = cart.find(i => i.id === id);
      if (!prod) return;
      if (btn.classList.contains('plus')) prod.quantity++;
      if (btn.classList.contains('minus')) prod.quantity = Math.max(1, prod.quantity - 1);
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


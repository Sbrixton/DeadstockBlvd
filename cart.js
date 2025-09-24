import {
  getCart,
  saveCart,
  updateCartCountInDOM
} from "./cart-utils.js";


import {
  getCurrency,
  formatPrice,
  convertPrice
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

  function render() {
    if (!hasDesktopCart) return;

    let cart = getCart();

    cartWrapper.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
      empty.style.display = "flex";
      section.style.display = "none";
      checkoutBtn.style.display = "none";
      proceedBtn.style.display = "inline-block";
      subEl.textContent = "R0.00";
      totalEl.textContent = "R0.00";
      updateCartCountInDOM();
      updateDrawerCheckoutState();
      return;
    }

    empty.style.display = "none";
    section.style.display = "block";
    checkoutBtn.style.display = "block";
    proceedBtn.style.display = "none";

    cart.forEach((item) => {
      if (!item || typeof item.price !== "number") return;

      subtotal += item.price * item.quantity;

      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-img">
        <div class="cart-details">
          <p class="cart-name">${item.name}</p>
          <p class="cart-price">Price: R${item.price.toFixed(2)}</p>
          <div class="quantity-controls">
            <button class="qty-btn minus" data-id="${item.id}">-</button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn plus" data-id="${item.id}">+</button>
          </div>
          <p class="cart-total">Total: R${(item.price * item.quantity).toFixed(2)}</p>
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </div>
      `;

      cartWrapper.appendChild(itemDiv);
    });

    formatPrice(subtotal).then((formatted) => {
      subEl.textContent = formatted;
      totalEl.textContent = formatted;
    });
    updateCartCountInDOM();
    updateDrawerCheckoutState();
  }

  // Open cart drawer when icon clicked
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

  // Handle quantity and remove buttons on desktop cart
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
    }

    if (target.classList.contains("remove-item")) {
      cart.splice(itemIndex, 1);
      saveCart(cart);
      render();
    }
  });

  render();
});

// Exported for dynamic import from product page
export function renderMobileDrawer() {
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
    drawerSubtotal.textContent = "R0.00";
    document.getElementById("drawerProceedBtn")
      ?.addEventListener("click", () => window.location.href = "shop.html");
    updateCartCountInDOM();
    return;
  }

  cart.forEach((item) => {
    if (
      !item ||
      typeof item.price !== "number" ||
      typeof item.quantity !== "number" ||
      !item.image ||
      !item.name
    ) {
      return;
    }

    subtotal += item.price * item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.style.position = 'relative';
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-img" />
      <div class="cart-details">
        <p class="cart-name">${item.name}</p>
        <p class="cart-price">R${item.price.toFixed(2)}</p>
        <div class="quantity-controls">
          <button class="qty-btn minus" data-id="${item.id}">−</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn plus" data-id="${item.id}">＋</button>
        </div>
      </div>
      <button class="remove-item-mobile" data-id="${item.id}">✕</button>
    `;
    mobileCartItems.appendChild(itemDiv);
  });

  formatPrice(subtotal).then((formatted) => {
    drawerSubtotal.textContent = formatted;
  });
  // Bind quantity buttons on mobile drawer
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

  // Bind remove buttons on mobile drawer
  mobileCartItems.querySelectorAll('.remove-item-mobile').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      let cart = getCart();
      cart = cart.filter(i => i.id !== id);
      saveCart(cart);
      updateCartCountInDOM();
      renderMobileDrawer();
    });
  });

  updateCartCountInDOM();
  updateDrawerCheckoutState();
}


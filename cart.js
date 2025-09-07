import {
  getCart,
  saveCart,
  updateCartCountInDOM
} from "./cart-utils.js";

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

  function updateDrawerCheckoutState() {
    const cart = getCart();
    const drawerCheckoutBtn = document.getElementById("drawerCheckoutBtn");

    if (!drawerCheckoutBtn) return;

    if (cart.length === 0) {
      drawerCheckoutBtn.disabled = true;
    } else {
      drawerCheckoutBtn.disabled = false;
    }
  }

  function render() {
    if (!hasDesktopCart) return;

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
      updateDrawerCheckoutState(); // 👈 Added here
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
            <button class="qty-btn minus" data-name="${item.name}">-</button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn plus" data-name="${item.name}">+</button>
          </div>

          <p class="cart-total">Total: R${(item.price * item.quantity).toFixed(2)}</p>
          <button class="remove-item" data-name="${item.name}">Remove</button>
        </div>
      `;

      cartWrapper.appendChild(itemDiv);
    });

    subEl.textContent = `R${subtotal.toFixed(2)}`;
    totalEl.textContent = `R${subtotal.toFixed(2)}`;
    updateCartCountInDOM();
    updateDrawerCheckoutState(); // 👈 Also added here
  }

  // 👉 Open cart drawer on all screen sizes
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
    window.location.href = "checkout.html";
  });
  
  // Desktop cart quantity & remove
  document.addEventListener("click", (e) => {
    const target = e.target;
    const name = target.dataset.name;
    const item = cart.find((i) => i.name === name);
    if (!item) return;

    if (target.classList.contains("qty-btn")) {
      if (target.classList.contains("plus")) {
        item.quantity += 1;
      } else if (target.classList.contains("minus")) {
        item.quantity = Math.max(1, item.quantity - 1);
      }
      saveCart(cart);
      render();
    }

    if (target.classList.contains("remove-item")) {
      const index = cart.findIndex((i) => i.name === name);
      if (index > -1) {
        cart.splice(index, 1);
        saveCart(cart);
        render();
      }
    }
  });

  checkoutBtn?.addEventListener("click", () => {
    window.location.href = cart.length > 0 ? "checkout.html" : "shop.html";
  });

  render();
});

// ✅ Exported so product.js can dynamically import & call it
export function renderMobileDrawer() {
  const cart = getCart();
  const mobileCartItems = document.getElementById("mobileCartItems");
  const drawerSubtotal = document.getElementById("drawerCartSubtotal");

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
    return;
  }

  cart.forEach(item => {
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

  drawerSubtotal.textContent = `R${subtotal.toFixed(2)}`;

  mobileCartItems.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const cart = getCart();
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
      let cart = getCart();
      cart = cart.filter(i => i.id !== id);
      saveCart(cart);
      updateCartCountInDOM();
      renderMobileDrawer();
    });
  });
}

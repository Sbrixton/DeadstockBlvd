import {
  getCart,
  saveCart,
  updateCartCountInDOM
} from "./cart-utils.js";

import {
  getCurrency,
  formatPrice
} from "./currency.js";

// Preload exchange rates
formatPrice(1);

// Update checkout button in mobile drawer
function updateDrawerCheckoutState() {
  const cart = getCart();
  const drawerCheckoutBtn = document.getElementById("drawerCheckoutBtn");
  if (!drawerCheckoutBtn) return;
  drawerCheckoutBtn.disabled = cart.length === 0;
}

window.addEventListener("load", () => {
  const cartWrapper = document.getElementById("cart-items-wrapper");
  const subEl = document.getElementById("CartSubtotal");
  const totalEl = document.getElementById("Total");
  const empty = document.getElementById("emptyCart");
  const section = document.getElementById("cartSection");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const proceedBtn = document.getElementById("proceedBtn");

  const cartIcon = document.getElementById("cartIcon");
  const mobileDrawer = document.getElementById("mobileCartDrawer");
  const closeCartDrawer = document.getElementById("closeCartDrawer");
  const drawerCheckoutBtn = document.getElementById("drawerCheckoutBtn");

  proceedBtn?.addEventListener("click", () => {
    window.location.href = "shop.html";
  });

  async function render() {
    const cart = getCart();
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
            <button class="qty-btn plus" data-id="${item.id}">+</button>
          </div>
          <p class="cart-total">Total: 0.00</p>
          <div class="limit-message" style="display: none;"></div>
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </div>
      `;

      cartWrapper.appendChild(itemDiv);

      // Format prices
      formatPrice(item.price).then(f => {
        itemDiv.querySelector(".cart-price").textContent = `Price: ${f}`;
      });

      formatPrice(itemTotal).then(f => {
        itemDiv.querySelector(".cart-total").textContent = `Total: ${f}`;
      });
    }

    formatPrice(subtotal).then(f => {
      subEl.textContent = f;
      totalEl.textContent = f;
    });

    updateCartCountInDOM();
    updateDrawerCheckoutState();
  }

  // Cart icon toggle
  cartIcon?.addEventListener("click", (e) => {
    e.preventDefault();
    renderMobileDrawer();
    mobileDrawer.classList.add("open");
  });

  closeCartDrawer?.addEventListener("click", () => {
    mobileDrawer.classList.remove("open");
  });

  drawerCheckoutBtn?.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) return;
    window.location.href = "checkout.html";
  });

  document.addEventListener("click", async (e) => {
    const target = e.target;
    const id = parseInt(target.dataset.id);
    if (!id) return;

    let cart = getCart();
    const itemIndex = cart.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    const item = cart[itemIndex];
    const itemContainer = target.closest(".cart-item");
    const qtyDisplay = itemContainer.querySelector(".qty-num");
    const limitMsg = itemContainer.querySelector(".limit-message");

    if (target.classList.contains("qty-btn")) {
      if (target.classList.contains("plus")) {
        // Show mini loader
        const originalHTML = target.innerHTML;
        target.innerHTML = `<span class="mini-loader"></span>`;
        target.disabled = true;

        // Simulate delay
        setTimeout(() => {
          if (item.quantity >= 1) {
            // Don't increase quantity
            limitMsg.textContent = "Only 1 item was added due to availability.";
            limitMsg.style.display = "block";
          } else {
            item.quantity++;
            limitMsg.style.display = "none";
          }

          saveCart(cart);
          render();
          target.innerHTML = originalHTML;
          target.disabled = false;
        }, 1000);
      }

      if (target.classList.contains("minus")) {
        item.quantity = Math.max(1, item.quantity - 1);
        saveCart(cart);
        render();
      }
    }

    if (target.classList.contains("remove-item")) {
      cart.splice(itemIndex, 1);
      saveCart(cart);
      render();
    }
  });

  render();
});


// ✅ Mobile Drawer Renderer
export async function renderMobileDrawer() {
  const cart = getCart();
  const mobileCartItems = document.getElementById("mobileCartItems");
  const drawerSubtotal = document.getElementById("drawerCartSubtotal");

  if (!mobileCartItems || !drawerSubtotal) {
    console.error("Mobile cart drawer elements not found.");
    return;
  }

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
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

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
          <button class="qty-btn plus" data-id="${item.id}">＋</button>
        </div>
        <div class="limit-message" style="display: none;"></div>
      </div>
      <button class="remove-item-mobile" data-id="${item.id}">✕</button>
    `;

    mobileCartItems.appendChild(itemDiv);

    // Format price
    formatPrice(item.price).then(f => {
      itemDiv.querySelector(".cart-price").textContent = `Price: ${f}`;
    });
  }

  formatPrice(subtotal).then(f => {
    drawerSubtotal.textContent = f;
  });

  // Button events
  mobileCartItems.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      let cart = getCart();
      const prod = cart.find(i => i.id === id);
      const container = btn.closest(".cart-item");
      const limitMsg = container.querySelector(".limit-message");

      if (!prod) return;

      if (btn.classList.contains('plus')) {
        btn.innerHTML = `<span class="mini-loader"></span>`;
        btn.disabled = true;

        setTimeout(() => {
          if (prod.quantity >= 1) {
            limitMsg.textContent = "Only 1 item was added due to availability.";
            limitMsg.style.display = "block";
          } else {
            prod.quantity++;
            limitMsg.style.display = "none";
          }

          saveCart(cart);
          renderMobileDrawer();
        }, 1000);
      }

      if (btn.classList.contains('minus')) {
        prod.quantity = Math.max(1, prod.quantity - 1);
        saveCart(cart);
        renderMobileDrawer();
      }
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




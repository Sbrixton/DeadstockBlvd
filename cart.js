import {
  getCart,
  saveCart,
  updateCartCountInDOM
} from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const cart = getCart();
  const empty = document.getElementById("emptyCart");
  const section = document.getElementById("cartSection");
  const cartWrapper = document.getElementById("cart-items-wrapper");
  const subEl = document.getElementById("CartSubtotal");
  const totalEl = document.getElementById("Total");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const proceedBtn = document.getElementById("proceedBtn");

  // Mobile drawer elements
  const cartIcon = document.getElementById("cartIcon");
  const mobileDrawer = document.getElementById("mobileCartDrawer");
  const mobileCartItems = document.getElementById("mobileCartItems");
  const drawerSubtotal = document.getElementById("drawerCartSubtotal");
  const drawerCheckoutBtn = document.getElementById("drawerCheckoutBtn");
  const closeCartDrawer = document.getElementById("closeCartDrawer");

  // Proceed to Shop button (for empty cart)
  proceedBtn?.addEventListener("click", () => {
    window.location.href = "shop.html";
  });

  function render() {
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
  }

  function renderMobileDrawer() {
    mobileCartItems.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
      mobileCartItems.innerHTML = `<p>Your cart is empty.</p>`;
      drawerSubtotal.textContent = "R0.00";
      return;
    }

    cart.forEach(item => {
      subtotal += item.price * item.quantity;

      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-img">
        <div class="cart-details">
          <p class="cart-name">${item.name}</p>
          <p class="cart-price">Price: R${item.price.toFixed(2)}</p>
          <p class="cart-total">Total: R${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `;
      mobileCartItems.appendChild(itemDiv);
    });

    drawerSubtotal.textContent = `R${subtotal.toFixed(2)}`;
  }

  // Quantity & Remove buttons (desktop logic)
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

  // Desktop checkout
  checkoutBtn?.addEventListener("click", () => {
    if (cart.length > 0) {
      window.location.href = "checkout.html";
    } else {
      window.location.href = "shop.html";
    }
  });

  // Mobile drawer behavior
  cartIcon.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      renderMobileDrawer();
      mobileDrawer.classList.add("open");
    }
  });

  closeCartDrawer?.addEventListener("click", () => {
    mobileDrawer.classList.remove("open");
  });

  drawerCheckoutBtn?.addEventListener("click", () => {
    if (cart.length > 0) {
      window.location.href = "checkout.html";
    }
  });

  render();
});

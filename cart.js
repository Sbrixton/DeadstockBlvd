import {
  getCart,
  saveCart,
  updateCartCountInDOM,
  showToast
} from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const cart = getCart();
  const empty = document.getElementById("emptyCart");
  const section = document.getElementById("cartSection");
  const tbody = document.getElementById("cart-table-body");
  const subEl = document.getElementById("CartSubtotal");
  const totalEl = document.getElementById("Total");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const proceedBtn = document.getElementById("proceedBtn");

  // Make proceed button redirect to shop
  proceedBtn?.addEventListener("click", () => {
    window.location.href = "shop.html";
  });

  function render() {
    tbody.innerHTML = "";
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
      subtotal += item.price * item.quantity;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><button class="remove-btn" data-name="${item.name}">&times;</button></td>
        <td><img src="${item.image}" width="70" alt="${item.name}"></td>
        <td>${item.name}</td>
        <td>R${item.price.toFixed(2)}</td>
        <td><input type="number" class="quantity" min="1" data-name="${item.name}" value="${item.quantity}"></td>
        <td>R${(item.price * item.quantity).toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });

    subEl.textContent = `R${subtotal.toFixed(2)}`;
    totalEl.textContent = `R${subtotal.toFixed(2)}`;
    updateCartCountInDOM();
  }

  // Remove item
  tbody.addEventListener("click", (e) => {
    if (e.target.matches(".remove-btn")) {
      const name = e.target.dataset.name;
      const index = cart.findIndex((i) => i.name === name);
      if (index > -1) {
        cart.splice(index, 1);
        saveCart(cart);
        render();
        showToast("❌ Item removed");
      }
    }
  });

  // Update quantity
  tbody.addEventListener("input", (e) => {
    if (e.target.matches(".quantity")) {
      const name = e.target.dataset.name;
      const item = cart.find((i) => i.name === name);
      if (item) {
        item.quantity = Math.max(1, parseInt(e.target.value));
        saveCart(cart);
        render();
        showToast("🛍️ Quantity updated");
      }
    }
  });

  checkoutBtn?.addEventListener("click", () => {
    if (cart.length > 0) {
      window.location.href = "checkout.html";
    } else {
      window.location.href = "shop.html";
    }
  });

  render();
});

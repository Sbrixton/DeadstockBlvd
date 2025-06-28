// cart.js
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

  function render() {
    tbody.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
      empty.style.display = "flex";
      section.style.display = "none";
      checkoutBtn?.style.display = "none";
      updateCartCountInDOM();
      return;
    }

    empty.style.display = "none";
    section.style.display = "block";
    checkoutBtn?.style.display = "block";

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
      showToast("Cart is empty!");
    }
  });

  document
    .querySelector("#emptyCart .btn-proceed")
    ?.addEventListener("click", () => {
      window.location.href = "shop.html";
    });

  render();
});

document.addEventListener('DOMContentLoaded', () => {
  const cartTableBody = document.getElementById('cart-table-body');
  const subtotalElem = document.getElementById('CartSubtotal');
  const totalElem = document.getElementById('Total');
  const emptyCartSection = document.getElementById('emptyCart');
  const cartSection = document.getElementById('cartSection');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const toast = document.getElementById('toast');
  const cartIconCount = document.getElementById('cart-count');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCartUI() {
    cartTableBody.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
      emptyCartSection.style.display = 'block';
      cartSection.style.display = 'none';
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      subtotalElem.textContent = 'R0.00';
      totalElem.textContent = 'R0.00';
      if (cartIconCount) cartIconCount.textContent = '0';
      return;
    }

    emptyCartSection.style.display = 'none';
    cartSection.style.display = 'block';
    if (checkoutBtn) checkoutBtn.style.display = 'block';

    cart.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><button class="remove-btn" data-name="${product.name}">&times;</button></td>
        <td><img src="${product.image}" alt="${product.name}"></td>
        <td>${product.name}</td>
        <td>R${product.price.toFixed(2)}</td>
        <td>
          <input type="number" class="quantity" min="1" value="${product.quantity}" data-name="${product.name}">
        </td>
        <td class="item-subtotal">R${(product.price * product.quantity).toFixed(2)}</td>
      `;
      cartTableBody.appendChild(row);
      subtotal += product.price * product.quantity;
    });

    subtotalElem.textContent = `R${subtotal.toFixed(2)}`;
    totalElem.textContent = `R${subtotal.toFixed(2)}`;
    if (cartIconCount) cartIconCount.textContent = cart.length;
  }

  updateCartUI();

  cartTableBody.addEventListener('click', e => {
    if (e.target.classList.contains('remove-btn')) {
      const name = e.target.dataset.name;
      cart = cart.filter(p => p.name !== name);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartUI();
    }
  });

  cartTableBody.addEventListener('input', e => {
    if (e.target.classList.contains('quantity')) {
      const name = e.target.dataset.name;
      const newQty = parseInt(e.target.value);
      if (isNaN(newQty) || newQty < 1) {
        e.target.value = 1;
        return;
      }
      cart = cart.map(p => p.name === name ? { ...p, quantity: newQty } : p);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartUI();
    }
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }
      sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
      window.location.href = 'checkout.html';
    });
  }
});

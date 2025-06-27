document.addEventListener('DOMContentLoaded', () => {
  const cartTableBody = document.getElementById('cart-table-body');
  const subtotalElem = document.getElementById('CartSubtotal');
  const totalElem = document.getElementById('Total');
  const emptyCartSection = document.getElementById('emptyCart');
  const cartSection = document.getElementById('cartSection');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const toast = document.getElementById('toast');
  const cartCount = document.getElementById('cart-count');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function updateCartUI() {
    if (!cartTableBody) return;

    cartTableBody.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
      emptyCartSection.style.display = 'flex'; // Centered layout
      cartSection.style.display = 'none';
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      subtotalElem.textContent = 'R0.00';
      totalElem.textContent = 'R0.00';
      updateCartCount();
      return;
    }

    emptyCartSection.style.display = 'none';
    cartSection.style.display = 'block';
    if (checkoutBtn) checkoutBtn.style.display = 'block';

    cart.forEach(product => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td><button class="remove-btn" data-name="${product.name}" aria-label="Remove ${product.name}">&times;</button></td>
        <td><img src="${product.image}" alt="${product.name}" width="70" loading="lazy"></td>
        <td>${product.name}</td>
        <td>R${product.price.toFixed(2)}</td>
        <td>
          <input type="number" class="quantity" min="1" value="${product.quantity}" data-name="${product.name}" aria-label="Quantity for ${product.name}">
        </td>
        <td class="item-subtotal">R${(product.price * product.quantity).toFixed(2)}</td>
      `;

      cartTableBody.appendChild(row);
      subtotal += product.price * product.quantity;
    });

    subtotalElem.textContent = `R${subtotal.toFixed(2)}`;
    totalElem.textContent = `R${subtotal.toFixed(2)}`;
    updateCartCount();
  }

  // Initial render
  updateCartUI();

  // Handle removing items
  if (cartTableBody) {
    cartTableBody.addEventListener('click', e => {
      if (e.target.classList.contains('remove-btn')) {
        const name = e.target.dataset.name;
        cart = cart.filter(product => product.name !== name);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        showToast('Item removed from cart');
      }
    });

    // Handle quantity change
    cartTableBody.addEventListener('input', e => {
      if (e.target.classList.contains('quantity')) {
        const name = e.target.dataset.name;
        const newQty = parseInt(e.target.value, 10);
        if (isNaN(newQty) || newQty < 1) {
          e.target.value = 1;
          return;
        }

        cart = cart.map(product => {
          if (product.name === name) {
            product.quantity = newQty;
          }
          return product;
        });

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        showToast('Cart updated');
      }
    });
  }

  // Checkout redirection
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

  // If "Proceed to Thrift" button is clicked
  const proceedBtn = document.querySelector('#emptyCart .btn-proceed');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      window.location.href = 'shop.html';
    });
  }
});

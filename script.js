document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("bar");
  const close = document.getElementById("close");
  const nav = document.getElementById("navbar");

  if (bar && close && nav) {
    bar.addEventListener("click", () => {
      nav.classList.add("active");
    });

    close.addEventListener("click", () => {
      nav.classList.remove("active");
    });

    // IMPORTANT: Close nav if resizing to large screen (without refresh)
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        nav.classList.remove("active");
      }
    });
  }
});


// ====== ADD TO CART FUNCTIONALITY FROM SHOP PAGE ======
document.addEventListener("DOMContentLoaded", () => {
    const addToCartBtns = document.querySelectorAll('.cart');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = btn.dataset.price;
            const image = btn.dataset.image;

            const product = {
                name: name,
                price: price,
                image: image,
                quantity: 1
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Check if already in cart
            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${name} added to cart.`);
        });
    });
});

// ====== DISPLAY CART ITEMS ON CART PAGE ======
document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-table-body");
    const subtotalElement = document.getElementById("cartSubtotal");
    const totalElement = document.getElementById("Total");

    if (!cartItemsContainer) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = 0;

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        subtotal = 0;

        cart.forEach((item, index) => {
            const price = parseFloat(item.price.replace("R", "").replace(",", ""));
            const itemSubtotal = price * item.quantity;
            subtotal += itemSubtotal;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><i class="far fa-times-circle remove-btn" data-index="${index}" style="cursor: pointer;"></i></td>
                <td><img src="${item.image}" style="width: 70px;" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>R${price.toFixed(2)}</td>
                <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}"></td>
                <td>R${itemSubtotal.toFixed(2)}</td>
            `;
            cartItemsContainer.appendChild(row);
        });

        subtotalElement.textContent = `R${subtotal.toFixed(2)}`;
        totalElement.textContent = `R${subtotal.toFixed(2)}`;
    }

    cartItemsContainer.addEventListener("input", (e) => {
        if (e.target.classList.contains("quantity-input")) {
            const index = e.target.dataset.index;
            cart[index].quantity = parseInt(e.target.value);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartDisplay();
        }
    });

    cartItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartDisplay();
        }
    });

    updateCartDisplay();
});

// ====== CHECKOUT FORM DISPLAY ======
document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            document.getElementById("myForm").style.display = "block";
            document.getElementById("myForm").scrollIntoView({ behavior: "smooth" });
        });
    }
});

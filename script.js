const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', ()=>{
        nav.classList.add('active'); 
    } )
}

if (close) {
    close.addEventListener('click', ()=>{
        nav.classList.remove('active'); 
    } )
}


document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('.order-btn');
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
  
          
  
        const productName = button.getAttribute('data-product');
        const subtotalElem = document.getElementById('cartSubtotal');
        const productImage = button.getAttribute('data-image');
        
        const product = {
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1
        };
  
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
  
        window.location.href = "Cart.html";
      });
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-table-body"); // ✅ match your HTML
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const subtotalElement = document.getElementById("cartSubtotal");
    const totalElement = document.getElementById("Total");



    let subtotal = 0;

    // Function to update the cart display
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Clear current cart display
        subtotal = 0;

        cart.forEach((item, index) => {
    const row = document.createElement("tr");

    // Parse price correctly if it's a string
    const itemPrice = typeof item.price === "string"
        ? parseFloat(item.price.replace("R", "").replace(",", ""))
        : parseFloat(item.price);

    // Calculate item subtotal
    const itemSubtotal = itemPrice * item.quantity;

    // Add the item row to the cart table
    row.innerHTML = `
        <td><i class="far fa-times-circle remove-btn" style="cursor: pointer;" data-index="${index}"></i></td>
        <td><img src="${item.image}" alt="${item.name}" style="width: 70px;"></td>
        <td>${item.name}</td>
        <td>R${itemPrice.toFixed(2)}</td>
        <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}"></td>
        <td class="item-subtotal">R${itemSubtotal.toFixed(2)}</td>
    `;

    cartItemsContainer.appendChild(row);

    // Update subtotal
    subtotal += itemSubtotal;
});

// After looping through all items, update subtotal and total elements
        subtotalElement.textContent = `R${subtotal.toFixed(2)}`;
        totalElement.textContent = `R${subtotal.toFixed(2)}`;


        // Update totals
        // Update totals only if the elements exist
        if (subtotalElement) {
            subtotalElement.textContent = `R${subtotal.toFixed(2)}`;
        }
        if (totalElement) {
            totalElement.textContent = `R${subtotal.toFixed(2)}`;
        }

    }

    // Event listener for quantity change
    cartItemsContainer.addEventListener("input", (e) => {
        if (e.target.classList.contains("quantity-input")) {
            const index = e.target.dataset.index;
            const newQuantity = parseInt(e.target.value, 10);

            if (newQuantity > 0) {
                cart[index].quantity = newQuantity;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartDisplay();
            }
        }
    });

    // Event listener for item removal
    cartItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartDisplay();
        }
    });

    // Initial cart display
    updateCartDisplay();

    // Checkout button functionality
    document.getElementById("checkoutBtn").addEventListener("click", () => {
        document.getElementById("myForm").style.display = "block";
        document.getElementById("myForm").scrollIntoView({ behavior: "smooth" });
    });
});

document.getElementById('searchBtn').addEventListener('click', performSearch);
function performSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '';

  // You can update this with however you're storing products
  const allProducts = JSON.parse(localStorage.getItem('products')) || [];

  const filtered = allProducts.filter(product =>
    product.name.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
    return;
  }

  filtered.forEach(product => {
    const item = document.createElement('div');
    item.classList.add('search-result');

    item.innerHTML = `
      <h3>${product.name}</h3>
      <img src="${product.image}" alt="${product.name}" width="200">
      <p>Price: R${product.price}</p>
    `;

    resultsContainer.appendChild(item);
  });
}


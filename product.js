import {
  getCart,
  saveCart,
  updateCartCountInDOM
} from "./cart-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("addToCartBtn");

  addToCartBtn?.addEventListener("click", async () => {
    const cart = getCart();

    const product = {
      id: parseInt(addToCartBtn.dataset.id),
      name: addToCartBtn.dataset.name,
      price: parseFloat(addToCartBtn.dataset.price),
      quantity: 1,
      image: addToCartBtn.dataset.image,
    };

    const index = cart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push(product);
    }

    saveCart(cart);
    updateCartCountInDOM();

    const drawer = document.getElementById("mobileCartDrawer");
    if (drawer?.classList.contains("open")) {
      const module = await import("./cart.js");
      module.renderMobileDrawer();
    }
  });

  updateCartCountInDOM();

  // ======= Product Gallery Slider Logic =======
  const mainImage = document.getElementById("mainImage");
  const thumbnails = Array.from(document.querySelectorAll(".thumb"));
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");

  if (mainImage && thumbnails.length > 0) {
    let currentIndex = 0;

    function updateMainImage(index) {
      mainImage.src = thumbnails[index].src;

      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === index);
      });

      currentIndex = index;
    }

    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        updateMainImage(index);
      });
    });

    prevBtn?.addEventListener("click", () => {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = thumbnails.length - 1;
      updateMainImage(newIndex);
    });

    nextBtn?.addEventListener("click", () => {
      let newIndex = currentIndex + 1;
      if (newIndex >= thumbnails.length) newIndex = 0;
      updateMainImage(newIndex);
    });

    // Initialize first image
    updateMainImage(0);
  }

  // ======= PayPal Init =======
  if (window.paypal) {
    paypal.Buttons({
      createOrder(data, actions) {
        const cart = getCart();
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: total.toFixed(2),
            },
          }],
        });
      },
      onApprove(data, actions) {
        return actions.order.capture().then(details => {
          window.location.href = "checkout.html";
        });
      },
      onError(err) {
        console.error("PayPal error:", err);
        alert("There was a problem processing your payment.");
      }
    }).render("#paypal-button-container");
  } else {
    console.error("window.paypal is undefined — PayPal SDK may not be loaded.");
  }
});

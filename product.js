// product.js
import {
  getCart,
  saveCart,
  updateCartCountInDOM
} from "./cart-utils.js";

import { convertFromGBP } from "./currency.js"; // ✅ Import currency conversion

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
      size: addToCartBtn.dataset.size || "N/A" // ✅ Include size from data attribute
    };

    const index = cart.findIndex(
      (item) => item.id === product.id && item.size === product.size // ✅ check both ID & size
    );

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
  const dotContainer = document.querySelector(".mobile-dots");

  if (mainImage && thumbnails.length > 0) {
    let currentIndex = 0;

    let dots = [];
    if (dotContainer) {
      dots = thumbnails.map((_, i) => {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dotContainer.appendChild(dot);
        return dot;
      });
    }

    function updateDots(index) {
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }

    function updateMainImage(index) {
      mainImage.src = thumbnails[index].src;

      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === index);
      });

      updateDots(index);
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

    updateMainImage(0);

    // ===== Swipe Support (Mobile Touch Gestures) =====
    let touchStartX = 0;
    let touchEndX = 0;

    mainImage.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    mainImage.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const threshold = 40;
      const swipeDistance = touchEndX - touchStartX;

      if (swipeDistance > threshold) {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = thumbnails.length - 1;
        updateMainImage(newIndex);
      } else if (swipeDistance < -threshold) {
        let newIndex = currentIndex + 1;
        if (newIndex >= thumbnails.length) newIndex = 0;
        updateMainImage(newIndex);
      }
    }
  }

  // ✅ PAYFAST AMOUNT CONVERSION (GBP → ZAR)
  (async () => {
    const pfAmountInput = document.getElementById("pfAmount");
    const pfCurrencyInput = document.querySelector('input[name="currency"]');

    if (!pfAmountInput || !pfCurrencyInput) return;

    const basePriceGBP = parseFloat(pfAmountInput.dataset.basePrice);

    try {
      const amountZAR = await convertFromGBP(basePriceGBP, "ZAR");
      pfAmountInput.value = amountZAR.toFixed(2);
      pfCurrencyInput.value = "ZAR";
    } catch (err) {
      console.error("[product.js] Failed to convert amount to ZAR:", err);
    }
  })();
});


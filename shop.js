// shop.js\\

document.addEventListener("DOMContentLoaded", () => {
  const cartIcons = document.querySelectorAll(".cart");

  cartIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const name = icon.dataset.name;
      const price = parseFloat(icon.dataset.price);
      const image = icon.dataset.image;

      // Get current cart
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if item already exists
      const existing = cart.find((item) => item.name === name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          name,
          price,
          image,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      showToast("🛒 Added to Cart!");
    });
  });

  // Toast popup
  function showToast(msg) {
    let toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      toast.remove();
    }, 3000);
  }
});

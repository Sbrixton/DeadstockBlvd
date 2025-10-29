document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("bar");
  const close = document.getElementById("close");
  const navWrapper = document.querySelector(".nav-wrapper");

  // ===== Navbar toggle =====
  bar?.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent bubbling
    navWrapper.classList.add("active");

    // Add temporary backdrop listener for closing when clicking outside
    document.body.addEventListener("click", handleOutsideClick);
  });

  close?.addEventListener("click", () => {
    navWrapper.classList.remove("active");
    document.body.removeEventListener("click", handleOutsideClick);
  });

  // ✅ Close when clicking outside
  function handleOutsideClick(e) {
    const clickedInsideNav = e.target.closest(".nav-wrapper");
    const clickedBar = e.target.closest("#bar");

    // If user clicked outside both nav and hamburger icon
    if (!clickedInsideNav && !clickedBar) {
      navWrapper.classList.remove("active");
      document.body.removeEventListener("click", handleOutsideClick);
    }
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      navWrapper.classList.remove("active");
      document.body.removeEventListener("click", handleOutsideClick);
    }
  });

  // ===== Cart count setup (keep yours here) =====
  updateCartCountInDOM();
});





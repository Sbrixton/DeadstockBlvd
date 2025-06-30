document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const bar = document.getElementById("bar");
  const navWrapper = document.getElementById("navWrapper");
  const close = document.getElementById("close");

  const searchIcon = document.getElementById("searchIcon");
  const searchOverlay = document.getElementById("searchOverlay");
  const closeSearch = document.getElementById("closeSearch");

  // Toggle mobile nav menu
  if (bar && navWrapper) {
    bar.addEventListener("click", () => {
      navWrapper.classList.add("active");
    });
  }

  if (close && navWrapper) {
    close.addEventListener("click", () => {
      navWrapper.classList.remove("active");
    });
  }

  // Toggle search overlay
  if (searchIcon && searchOverlay) {
    searchIcon.addEventListener("click", () => {
      searchOverlay.classList.add("active");
    });
  }

  if (closeSearch && searchOverlay) {
    closeSearch.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
    });
  }

  // Optional: Close nav or search if user clicks outside them
  document.addEventListener("click", (e) => {
    // Close nav if click outside nav
    if (
      navWrapper?.classList.contains("active") &&
      !navWrapper.contains(e.target) &&
      !bar.contains(e.target)
    ) {
      navWrapper.classList.remove("active");
    }

    // Close search overlay if click outside
    if (
      searchOverlay?.classList.contains("active") &&
      !searchOverlay.contains(e.target) &&
      !searchIcon.contains(e.target)
    ) {
      searchOverlay.classList.remove("active");
    }
  });
});

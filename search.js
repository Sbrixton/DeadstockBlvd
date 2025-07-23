console.log("search.js loaded");
document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.getElementById("searchIcon");
  console.log("searchIcon:", searchIcon);
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const closeSearch = document.getElementById("closeSearch");

  const products = JSON.parse(localStorage.getItem("products")) || [];

  const showOverlay = () => {
    searchOverlay.classList.add("active");
    searchInput.focus();
  };

  const hideOverlay = () => {
    searchOverlay.classList.remove("active");
    searchInput.value = "";
    searchResults.innerHTML = "";
  };

  searchIcon?.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("🔍 Search icon clicked!");
    showOverlay();
  });

  closeSearch?.addEventListener("click", hideOverlay);

  searchOverlay?.addEventListener("click", (e) => {
    if (e.target === searchOverlay) hideOverlay();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideOverlay();
  });

  searchInput?.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = products.filter((p) => p.name.toLowerCase().includes(query));
    renderResults(filtered);
  });

  searchResults?.addEventListener("click", (e) => {
    const link = e.target.closest(".search-item-link");
    if (!link) return;

    e.preventDefault();
    const url = link.getAttribute("href");

    // Fade out overlay before redirecting
    searchOverlay.style.transition = "opacity 0.3s ease";
    searchOverlay.style.opacity = "0";

    setTimeout(() => {
      window.location.href = url;
    }, 300);
  });

  function renderResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = `<p style="color:#555;">No matching products found.</p>`;
      return;
    }

    searchResults.innerHTML = results
      .map((product) => `
          <a href="${product.page}?id=${product.id}" class="search-item-link">
            <div class="search-item">
              <img src="${product.image}" alt="${product.name}">
              <div class="search-info">
                <h4>${product.name}</h4>
                <p>R${product.price.toFixed(2)}</p>
              </div>
            </div>
          </a>
      `).join("");
  }
});

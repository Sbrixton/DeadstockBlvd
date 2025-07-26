console.log("search.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.getElementById("searchIcon");
  const searchInput = document.getElementById("searchInput");
  const searchBarContainer = document.getElementById("searchBarContainer");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchResults = document.getElementById("searchResults");
  const noResultsMessage = document.getElementById("noResultsMessage");
  const clearSearch = document.getElementById("clearSearch");

  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Show search bar
  function showSearch() {
    searchBarContainer.classList.add("active");
    searchInput.focus();
  }

  // Hide search bar + results
  function hideSearch() {
    searchBarContainer.classList.remove("active");
    searchInput.value = "";
    searchResults.innerHTML = "";
    noResultsMessage.style.display = "none";
  }

  // Handle search input
  function handleSearchInput() {
    const query = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = "";
    noResultsMessage.style.display = "none";

    if (!query) return;

    const matches = products.filter(p =>
      p.name.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      noResultsMessage.style.display = "block";
      return;
    }

    renderResults(matches);
  }

  // Render matched results
  function renderResults(results) {
    searchResults.innerHTML = results.map(product => `
      <a href="${product.page}?id=${product.id}" class="search-item-link">
        <div class="search-item">
          <img src="${product.image}" alt="${product.name}" />
          <div class="search-info">
            <h4>${product.name}</h4>
            <p>R${product.price.toFixed(2)}</p>
          </div>
        </div>
      </a>
    `).join("");
  }

  // Click handlers
  searchIcon?.addEventListener("click", (e) => {
    e.stopPropagation();
    showSearch();
  });

  clearSearch?.addEventListener("click", (e) => {
    e.stopPropagation();
    searchInput.value = "";
    searchResults.innerHTML = "";
    noResultsMessage.style.display = "none";
    searchInput.focus();
  });

  document.addEventListener("click", (e) => {
    const clickedInside = e.target.closest("#searchBarContainer") || e.target.closest("#searchIcon");
    if (!clickedInside) hideSearch();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideSearch();
  });

  searchInput?.addEventListener("input", handleSearchInput);

  searchResults?.addEventListener("click", (e) => {
    const link = e.target.closest(".search-item-link");
    if (!link) return;

    e.preventDefault();
    searchOverlay.style.opacity = "0";

    setTimeout(() => {
      window.location.href = link.href;
    }, 300);
  });
});

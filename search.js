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

  function showSearch() {
    searchBarContainer.classList.add("active");
    searchInput.focus();
  }

  function hideSearch() {
    searchBarContainer.classList.remove("active", "typing");
    searchInput.value = "";
    searchResults.innerHTML = "";
    noResultsMessage.style.display = "none";
  }

  function handleSearchInput() {
    const query = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = "";
    noResultsMessage.style.display = "none";

    if (query) {
      searchBarContainer.classList.add("typing");
    } else {
      searchBarContainer.classList.remove("typing");
      return;
    }

    const matches = products.filter(p =>
      p.name.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      noResultsMessage.style.display = "block";
      return;
    }

    renderResults(matches);
  }

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

  searchIcon?.addEventListener("click", (e) => {
    e.stopPropagation();
    showSearch();
  });

  clearSearch?.addEventListener("click", (e) => {
    e.stopPropagation();
    searchInput.value = "";
    searchResults.innerHTML = "";
    noResultsMessage.style.display = "none";
    searchBarContainer.classList.remove("typing");
    searchInput.focus();
  });

  document.addEventListener("click", (e) => {
    const clickedInside = e.target.closest("#searchBarContainer") || e.target.closest("#searchIcon");
    if (!clickedInside) hideSearch();
  });

  // 👇 Tapping the overlay itself will also close search
  searchOverlay?.addEventListener("click", () => {
    hideSearch();
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

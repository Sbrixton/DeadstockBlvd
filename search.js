console.log("search.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.getElementById("searchIcon");
  const searchInput = document.getElementById("searchInput");
  const searchBarContainer = document.getElementById("searchBarContainer");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchResults = document.getElementById("searchResults");
  const noResultsMessage = document.getElementById("noResultsMessage");
  const clearSearch = document.getElementById("clearSearch");
  const searchSuggestions = document.getElementById("searchSuggestions");

  const products = JSON.parse(localStorage.getItem("products")) || [];

  // ✅ Show search bar & overlay
  function showSearch() {
    searchBarContainer.classList.add("active");
    searchOverlay.classList.add("visible");
    searchInput.focus();
  }

  // ✅ Hide everything
  function hideSearch() {
    searchBarContainer.classList.remove("active", "typing");
    searchOverlay.classList.remove("visible");
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchSuggestions.innerHTML = "";
    noResultsMessage.style.display = "none";
  }

  // ✅ Typing in search input
  function handleSearchInput() {
    const query = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = "";
    searchSuggestions.innerHTML = "";
    noResultsMessage.style.display = "none";

    if (!query) {
      searchBarContainer.classList.remove("typing");
      return;
    }

    searchBarContainer.classList.add("typing");

    const matches = products.filter(p =>
      p.name.toLowerCase().includes(query)
    );

    // 🔍 Show top 5 suggestions
    const topSuggestions = matches.slice(0, 5);
    searchSuggestions.innerHTML = topSuggestions.map(product => `
      <li data-id="${product.id}" data-page="${product.page}">
        ${product.name}
      </li>
    `).join("");

    // Show full results
    if (matches.length > 0) {
      renderResults(matches);
    } else {
      noResultsMessage.style.display = "block";
    }
  }

  // ✅ Render full search results
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

  // ✅ Open search
  searchIcon?.addEventListener("click", (e) => {
    e.stopPropagation();
    showSearch();
  });

  // ✅ Clear button
  clearSearch?.addEventListener("click", (e) => {
    e.stopPropagation();
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchSuggestions.innerHTML = "";
    noResultsMessage.style.display = "none";
    searchBarContainer.classList.remove("typing");
    searchInput.focus();
  });

  // ✅ Click outside closes search
  document.addEventListener("click", (e) => {
    const isInsideSearch = e.target.closest("#searchBarContainer");
    const isSearchIcon = e.target.closest("#searchIcon");
    if (!isInsideSearch && !isSearchIcon) {
      hideSearch();
    }
  });

  // ✅ Escape closes search
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideSearch();
  });

  // ✅ Typing triggers search + suggestions
  searchInput?.addEventListener("input", handleSearchInput);

  // ✅ Click result → go to page
  searchResults?.addEventListener("click", (e) => {
    const link = e.target.closest(".search-item-link");
    if (!link) return;

    e.preventDefault();
    searchOverlay.style.opacity = "0"; // optional: fade effect

    setTimeout(() => {
      window.location.href = link.href;
    }, 300);
  });

  // ✅ Click suggestion → go to product
  searchSuggestions?.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    const id = li.getAttribute("data-id");
    const page = li.getAttribute("data-page");

    searchOverlay.style.opacity = "0";

    setTimeout(() => {
      window.location.href = `${page}?id=${id}`;
    }, 300);
  });

  // ✅ Clicking overlay also closes everything
  searchOverlay?.addEventListener("click", () => {
    hideSearch();
  });
});


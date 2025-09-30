import { formatPrice } from './currency.js'; // ✅ Import currency formatter
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

  function showSearch() {
    searchBarContainer.classList.add("active");
    searchOverlay.classList.add("visible");
    searchInput.focus();
  }

  function hideSearch() {
    searchBarContainer.classList.remove("active", "typing");
    searchOverlay.classList.remove("visible");
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchSuggestions.innerHTML = "";
    noResultsMessage.style.display = "none";
  }

  // 🔁 NOW async
  async function handleSearchInput() {
    const query = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = "";
    searchSuggestions.innerHTML = "";
    noResultsMessage.style.display = "none";

    if (!query) {
      searchBarContainer.classList.remove("typing");
      return;
    }

    searchBarContainer.classList.add("typing");

    const matches = products
      .filter(p => p.name.toLowerCase().startsWith(query))
      .sort((a, b) => a.name.localeCompare(b.name));

    const topSuggestions = matches.slice(0, 5);
    searchSuggestions.innerHTML = topSuggestions.map(product => `
      <li data-id="${product.id}" data-page="${product.page}">
        ${product.name}
      </li>
    `).join("");

    if (matches.length > 0) {
      await renderResults(matches); // ✅ await async render
    } else {
      noResultsMessage.style.display = "block";
    }
  }

  // 🔁 NOW async
  async function renderResults(results) {
    const items = await Promise.all(results.map(async (product) => {
      const price = await formatPrice(product.price);
      return `
        <a href="${product.page}?id=${product.id}" class="search-item-link">
          <div class="search-item">
            <img src="${product.image}" alt="${product.name}" />
            <div class="search-info">
              <h4>${product.name}</h4>
              <p>${price}</p>
            </div>
          </div>
        </a>
      `;
    }));

    searchResults.innerHTML = items.join("");
  }

  searchIcon?.addEventListener("click", (e) => {
    e.stopPropagation();
    showSearch();
  });

  clearSearch?.addEventListener("click", (e) => {
    e.stopPropagation();
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchSuggestions.innerHTML = "";
    noResultsMessage.style.display = "none";
    searchBarContainer.classList.remove("typing");
    searchInput.focus();
  });

  document.addEventListener("click", (e) => {
    const isInsideSearch = e.target.closest("#searchBarContainer");
    const isSearchIcon = e.target.closest("#searchIcon");
    if (!isInsideSearch && !isSearchIcon) {
      hideSearch();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideSearch();
  });

  searchInput?.addEventListener("input", handleSearchInput); // ✅ async works fine here

  searchResults?.addEventListener("click", (e) => {
    const link = e.target.closest(".search-item-link");
    if (!link) return;

    e.preventDefault();
    searchOverlay.style.opacity = "0";

    setTimeout(() => {
      window.location.href = link.href;
    }, 300);
  });

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

  searchOverlay?.addEventListener("click", () => {
    hideSearch();
  });
});




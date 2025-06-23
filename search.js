document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.getElementById("searchIcon");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  
  const products = JSON.parse(localStorage.getItem("products")) || [];
  
  const showOverlay = () => {
    searchOverlay.style.display = "flex";
    searchInput.focus();
  };
  
  const hideOverlay = () => {
    searchOverlay.style.display = "none";
    searchInput.value = "";
    searchResults.innerHTML = "";
  };
  
  const closeSearch = document.getElementById("closeSearch");
  if (closeSearch) {
    closeSearch.addEventListener("click", hideOverlay);
  }
  
  searchIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    showOverlay();
  });
  
  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) {
      hideOverlay();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideOverlay();
  });

  const renderResults = (results) => {
    if (results.length === 0) {
      searchResults.innerHTML = `<p style="color:#555;">No matching products found.</p>`;
      return;
    }

    searchResults.innerHTML = results
      .map((product) => {
        const imgSrc = product.image.startsWith("/") ? product.image : "images/" + product.image;
        const pageHref = product.page || "product.html";

        return `
          <div class="search-item">
            <a href="${pageHref}">
              <img src="${imgSrc}" alt="${product.name}">
            </a>
            <div class="search-info">
              <a href="${pageHref}"><h4>${product.name}</h4></a>
              <p>R${product.price}</p>
            </div>
          </div>
        `;
      })
      .join("");
  };

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = products.filter((p) => p.name.toLowerCase().includes(query));
    renderResults(filtered);
  });
});

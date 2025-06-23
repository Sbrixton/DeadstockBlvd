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
    
    searchResults.addEventListener('click', e => {
      const link = e.target.closest('.search-item-link');
      if (!link) return;
      
      e.preventDefault();
      const url = link.getAttribute('href');
      
      // Play overlay fade-out
      searchOverlay.style.transition = 'opacity 0.3s ease';
      searchOverlay.style.opacity = '0';
      
      // Redirect after animation
      setTimeout(() => {
        window.location.href = url;
      }, 300);
    });

    searchResults.innerHTML = results
      .map(product => {
        const href = `product.html?id=${product.id}`;
        const imgSrc = product.image.startsWith("/") ? product.image : "images/" + product.image;
        return `
          <a href="${href}" class="search-item-link">
            <div class="search-item">
              <img src="${imgSrc}" alt="${product.name}">
              <div class="search-info">
                <h4>${product.name}</h4>
                <p>R${product.price}</p>
              </div>
            </div>
          </a>
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

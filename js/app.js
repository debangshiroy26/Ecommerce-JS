// =========================
// WISHLIST
// =========================

let wishlist = JSON.parse(localStorage.getItem("novaWishlist")) || [];

function saveWishlist() {
  localStorage.setItem("novaWishlist", JSON.stringify(wishlist));
}

function toggleWishlist(productId) {
  const productIndex = wishlist.indexOf(productId);

  if (productIndex === -1) {
    wishlist.push(productId);
  } else {
    wishlist.splice(productIndex, 1);
  }

  saveWishlist();

  displayProducts(getCurrentProducts());
}

function getCurrentProducts() {
  const activeFilter = document.querySelector(".filter-btn.active");

  if (!activeFilter) {
    return products;
  }

  const category = activeFilter.dataset.category;

  if (category === "all") {
    return products;
  }

  return products.filter(function (product) {
    return product.category === category;
  });
}

// =========================
// MOBILE MENU
// =========================

const mobileMenuButton = document.getElementById("mobileMenuButton");

const mobileMenu = document.getElementById("mobileMenu");

mobileMenuButton.addEventListener("click", function () {
  mobileMenu.classList.toggle("active");

  // Check whether menu is open

  const isOpen = mobileMenu.classList.contains("active");

  // Update accessibility attribute

  mobileMenuButton.setAttribute("aria-expanded", isOpen);

  // Change hamburger icon

  mobileMenuButton.textContent = isOpen ? "✕" : "☰";
});

// =========================
// CLOSE MOBILE MENU
// WHEN LINK IS CLICKED
// =========================

const mobileLinks = document.querySelectorAll(".mobile-menu a");

mobileLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    mobileMenu.classList.remove("active");

    mobileMenuButton.textContent = "☰";

    mobileMenuButton.setAttribute("aria-expanded", "false");
  });
});

// =========================
// NAVBAR SCROLL EFFECT
// =========================

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// =========================
// PRODUCT RENDERING
// =========================

const productGrid = document.getElementById("productGrid");

function displayProducts(productList) {
  productGrid.innerHTML = "";

  productList.forEach(function (product) {
    const productCard = document.createElement("article");

    productCard.className = "product-card";

    productCard.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                <span class="product-badge">
                    ${product.badge}
                </span>


                <button
                    class="product-wishlist"
                    aria-label="Add ${product.name} to wishlist"
                >
                    ♡
                </button>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>


                <h3 class="product-name">
                    ${product.name}
                </h3>


                <div class="product-bottom">

                    <span class="product-price">
                        ₹${product.price}
                    </span>


                    <button
                        class="add-to-cart"
                        data-product-id="${product.id}"
                    >
                        Add +
                    </button>

                </div>

            </div>

        `;

    productGrid.appendChild(productCard);

    const wishlistButton = productCard.querySelector(".product-wishlist");

    if (wishlist.includes(product.id)) {
      wishlistButton.textContent = "♥";

      wishlistButton.classList.add("liked");
    }

    wishlistButton.addEventListener("click", function () {
      toggleWishlist(product.id);
    });
  });
}

const wishlistBtn = document.getElementById("wishlistBtn");

wishlistBtn.addEventListener("click", function () {
  const wishlistProducts = products.filter(function (product) {
    return wishlist.includes(product.id);
  });

  if (wishlistProducts.length === 0) {
    alert("Your wishlist is empty ❤️");

    return;
  }

  displayProducts(wishlistProducts);

  document.getElementById("shop").scrollIntoView({
    behavior: "smooth",
  });
});

// Display all products when page loads

displayProducts(products);

// =========================
// PRODUCT FILTERING
// =========================

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Remove active class from all buttons

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    // Activate clicked button

    button.classList.add("active");

    // Get selected category

    const selectedCategory = button.dataset.category;

    // Show all products

    if (selectedCategory === "all") {
      displayProducts(products);

      return;
    }

    // Filter products

    const filteredProducts = products.filter(function (product) {
      return product.category === selectedCategory;
    });

    // Display filtered products

    displayProducts(filteredProducts);
  });
});

// =========================
// SEARCH
// =========================

const searchBtn = document.getElementById("searchBtn");

const searchOverlay = document.getElementById("searchOverlay");

const closeSearch = document.getElementById("closeSearch");

const searchInput = document.getElementById("searchInput");

const searchResults = document.getElementById("searchResults");

// =========================
// OPEN SEARCH
// =========================

function openSearch() {
  searchOverlay.classList.add("active");

  document.body.style.overflow = "hidden";

  searchInput.focus();
}

// =========================
// CLOSE SEARCH
// =========================

function closeSearchOverlay() {
  searchOverlay.classList.remove("active");

  document.body.style.overflow = "";

  searchInput.value = "";

  searchResults.innerHTML = `
        <p class="search-placeholder">
            Start typing to search products.
        </p>
    `;
}

// =========================
// BUTTON EVENTS
// =========================

searchBtn.addEventListener("click", openSearch);

closeSearch.addEventListener("click", closeSearchOverlay);

// =========================
// CLOSE WITH ESC
// =========================

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && searchOverlay.classList.contains("active")) {
    closeSearchOverlay();
  }
});

// =========================
// LIVE SEARCH
// =========================

searchInput.addEventListener("input", function () {
  const query = searchInput.value.trim().toLowerCase();

  // Nothing typed

  if (query === "") {
    searchResults.innerHTML = `
                <p class="search-placeholder">
                    Start typing to search products.
                </p>
            `;

    return;
  }

  // Search products

  const matchingProducts = products.filter(function (product) {
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  displaySearchResults(matchingProducts);
});

// =========================
// DISPLAY SEARCH RESULTS
// =========================

function displaySearchResults(productList) {
  if (productList.length === 0) {
    searchResults.innerHTML = `
            <p class="no-results">
                No products found.
            </p>
        `;

    return;
  }

  searchResults.innerHTML = "";

  productList.forEach(function (product) {
    const resultCard = document.createElement("div");

    resultCard.className = "search-result-card";

    resultCard.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="search-result-info">

                <span>
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <strong>
                    ₹${product.price}
                </strong>

            </div>

        `;

    searchResults.appendChild(resultCard);
  });
}

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

    productCard.addEventListener("click", function (event) {
      // Don't navigate if user
      // clicked a button

      if (event.target.closest("button")) {
        return;
      }

      window.location.href = `product.html?id=${product.id}`;
    });

    const wishlistButton = productCard.querySelector(".product-wishlist");

    const cartButton = productCard.querySelector(".add-to-cart");

    cartButton.addEventListener("click", function () {
      addToCart(product.id);
    });

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
// CART STATE
// =========================

let cart = JSON.parse(localStorage.getItem("novaCart")) || [];

function saveCart() {
  localStorage.setItem("novaCart", JSON.stringify(cart));
}

function addToCart(productId) {
  const existingItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,

      quantity: 1,
    });
  }

  saveCart();

  updateCartCount();

  renderCart();

  openCart();
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");

  const totalItems = cart.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);

  cartCount.textContent = totalItems;
}

// =========================
// CART DRAWER
// =========================

const cartBtn = document.getElementById("cartBtn");

const cartOverlay = document.getElementById("cartOverlay");

const closeCart = document.getElementById("closeCart");

function openCart() {
  cartOverlay.classList.add("active");

  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  cartOverlay.classList.remove("active");

  document.body.style.overflow = "";
}

cartBtn.addEventListener("click", function () {
  renderCart();

  openCart();
});

closeCart.addEventListener("click", closeCartDrawer);

cartOverlay.addEventListener("click", function (event) {
  if (event.target === cartOverlay) {
    closeCartDrawer();
  }
});

function renderCart() {
  const cartItems = document.getElementById("cartItems");

  const emptyCart = document.getElementById("emptyCart");

  const cartFooter = document.getElementById("cartFooter");

  // Empty cart

  if (cart.length === 0) {
    cartItems.innerHTML = "";

    emptyCart.classList.remove("hidden");

    cartFooter.classList.add("hidden");

    return;
  }

  // Cart has items

  emptyCart.classList.add("hidden");

  cartFooter.classList.remove("hidden");

  cartItems.innerHTML = "";

  cart.forEach(function (cartItem) {
    const product = products.find(function (item) {
      return item.id === cartItem.id;
    });

    if (!product) return;

    const itemElement = document.createElement("div");

    itemElement.className = "cart-item";

    itemElement.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="cart-item-info">

                <span class="cart-item-category">
                    ${product.category}
                </span>


                <h3 class="cart-item-name">
                    ${product.name}
                </h3>


                <span class="cart-item-price">
                    ₹${product.price}
                </span>


                <div class="cart-item-bottom">

                    <div class="quantity-controls">

                        <button
                            class="decrease-btn"
                            data-id="${product.id}"
                        >
                            −
                        </button>


                        <span>
                            ${cartItem.quantity}
                        </span>


                        <button
                            class="increase-btn"
                            data-id="${product.id}"
                        >
                            +
                        </button>

                    </div>


                    <button
                        class="remove-item"
                        data-id="${product.id}"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;

    cartItems.appendChild(itemElement);
  });

  updateCartTotal();

  attachCartEvents();
}

function updateCartTotal() {
  const subtotal = cart.reduce(function (total, cartItem) {
    const product = products.find(function (item) {
      return item.id === cartItem.id;
    });

    if (!product) {
      return total;
    }

    return total + product.price * cartItem.quantity;
  }, 0);

  document.getElementById("cartSubtotal").textContent = `₹${subtotal}`;
}

function changeQuantity(productId, change) {
  const cartItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (!cartItem) return;

  cartItem.quantity += change;

  if (cartItem.quantity <= 0) {
    cart = cart.filter(function (item) {
      return item.id !== productId;
    });
  }

  saveCart();

  updateCartCount();

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });

  saveCart();

  updateCartCount();

  renderCart();
}

function attachCartEvents() {
  const increaseButtons = document.querySelectorAll(".increase-btn");

  const decreaseButtons = document.querySelectorAll(".decrease-btn");

  const removeButtons = document.querySelectorAll(".remove-item");

  increaseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const id = Number(button.dataset.id);

      changeQuantity(id, 1);
    });
  });

  decreaseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const id = Number(button.dataset.id);

      changeQuantity(id, -1);
    });
  });

  removeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const id = Number(button.dataset.id);

      removeFromCart(id);
    });
  });
}

const startShopping = document.getElementById("startShopping");

startShopping.addEventListener("click", function () {
  closeCartDrawer();

  document.getElementById("shop").scrollIntoView({
    behavior: "smooth",
  });
});

const mobileCartBtn = document.getElementById("mobileCartBtn");

mobileCartBtn.addEventListener("click", function () {
  mobileMenu.classList.remove("active");

  mobileMenuButton.textContent = "☰";

  renderCart();

  openCart();
});
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
// INITIALIZE CART
// =========================

updateCartCount();

renderCart();

const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      return;
    }

    window.location.href = "checkout.html";
  });
}

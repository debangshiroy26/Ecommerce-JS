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
  });
}

// Display all products when page loads

displayProducts(products);

// =========================
// PRODUCT FILTERING
// =========================

const filterButtons =
    document.querySelectorAll(".filter-btn");


filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Remove active class from all buttons

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        // Activate clicked button

        button.classList.add("active");


        // Get selected category

        const selectedCategory =
            button.dataset.category;


        // Show all products

        if (selectedCategory === "all") {

            displayProducts(products);

            return;
        }


        // Filter products

        const filteredProducts =
            products.filter(function (product) {

                return product.category === selectedCategory;

            });


        // Display filtered products

        displayProducts(filteredProducts);

    });

});


// =========================
// GET PRODUCT ID FROM URL
// =========================

const urlParams = new URLSearchParams(window.location.search);

const productId = Number(urlParams.get("id"));

// =========================
// FIND PRODUCT
// =========================

const product = products.find(function (item) {
  return item.id === productId;
});

if (!product) {
  document.body.innerHTML = `

        <div style="
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 20px;
            font-family: Arial, sans-serif;
            background: #f8f7f2;
            color: #173f35;
        ">

            <h1>
                Product not found
            </h1>

            <a
                href="index.html"
                style="
                    color: #173f35;
                    text-decoration: underline;
                "
            >
                Back to shop →
            </a>

        </div>

    `;

  throw new Error("Product not found");
}

// =========================
// DISPLAY PRODUCT
// =========================

document.title = `${product.name} | NOVA`;

document.getElementById("productImage").src = product.image;

document.getElementById("productImage").alt = product.name;

const productImage = document.getElementById("productImage");

productImage.alt = product.name;

productImage.addEventListener("error", function () {
  this.src = "https://placehold.co/600x700/e8efea/173f35?text=NOVA";
});

productImage.src = product.image;

document.getElementById("productBadge").textContent = product.badge;

document.getElementById("productCategory").textContent = product.category;

document.getElementById("productName").textContent = product.name;

document.getElementById("productPrice").textContent = product.price;

document.getElementById("breadcrumbProduct").textContent = product.name;

document.getElementById("productDescription").textContent = product.description;

// =========================
// PRODUCT QUANTITY
// =========================

let quantity = 1;

const quantityDisplay = document.getElementById("detailQuantity");

document
  .getElementById("detailIncrease")
  .addEventListener("click", function () {
    quantity++;

    quantityDisplay.textContent = quantity;
  });

document
  .getElementById("detailDecrease")
  .addEventListener("click", function () {
    if (quantity > 1) {
      quantity--;
    }

    quantityDisplay.textContent = quantity;
  });

// =========================
// CART
// =========================

let cart = JSON.parse(localStorage.getItem("novaCart")) || [];

function saveCart() {
  localStorage.setItem("novaCart", JSON.stringify(cart));
}

function addProductToCart() {
  const existingItem = cart.find(function (item) {
    return item.id === product.id;
  });

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,

      quantity: quantity,
    });
  }

  saveCart();

  updateProductCartCount();

  showProductToast();
}

document
  .getElementById("detailAddToCart")
  .addEventListener("click", function () {
    const button = this;

    const originalText = button.innerHTML;

    addProductToCart();

    button.classList.add("added");

    button.innerHTML = `Added ✓`;

    setTimeout(function () {
      button.innerHTML = originalText;

      button.classList.remove("added");
    }, 1200);
  });

function updateProductCartCount() {
  const cartCount = document.getElementById("productCartCount");

  const totalItems = cart.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);

  cartCount.textContent = totalItems;
}

let productToastTimeout;

function showProductToast(message = "Added to your cart ✓") {
  const toast = document.getElementById("productToast");

  if (!toast) {
    return;
  }

  toast.textContent = message;

  toast.classList.add("active");

  clearTimeout(productToastTimeout);

  productToastTimeout = setTimeout(function () {
    toast.classList.remove("active");
  }, 2500);
}

// =========================
// PRODUCT WISHLIST
// =========================

let wishlist = JSON.parse(localStorage.getItem("novaWishlist")) || [];

const detailWishlist = document.getElementById("detailWishlist");

function updateWishlistButton() {
  if (wishlist.includes(product.id)) {
    detailWishlist.textContent = "♥";

    detailWishlist.classList.add("liked");
  } else {
    detailWishlist.textContent = "♡";

    detailWishlist.classList.remove("liked");
  }
}

updateWishlistButton();

detailWishlist.addEventListener("click", function () {
  const index = wishlist.indexOf(product.id);

  if (index === -1) {
    wishlist.push(product.id);
  } else {
    wishlist.splice(index, 1);
  }

  localStorage.setItem("novaWishlist", JSON.stringify(wishlist));

  updateWishlistButton();
});

// =========================
// RELATED PRODUCTS
// =========================

const relatedProductsContainer = document.getElementById("relatedProducts");

const relatedProducts = products
  .filter(function (item) {
    return item.category === product.category && item.id !== product.id;
  })
  .slice(0, 4);

relatedProducts.forEach(function (item) {
  const card = document.createElement("article");

  card.className = "product-card";

  card.innerHTML = `

            <div class="product-image">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    loading="lazy"
                >

                <span class="product-badge">
                    ${item.badge}
                </span>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${item.category}
                </span>

                <h3 class="product-name">
                    ${item.name}
                </h3>

                <div class="product-bottom">

                    <span class="product-price">
                        ₹${item.price}
                    </span>

                    <button
                        class="add-to-cart"
                    >
                        View →
                    </button>

                </div>

            </div>

        `;

  relatedProductsContainer.appendChild(card);

  card.addEventListener("click", function () {
    window.location.href = `product.html?id=${item.id}`;
  });
});

updateProductCartCount();

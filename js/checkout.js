// =========================
// CHECKOUT STATE
// =========================

let cart = JSON.parse(localStorage.getItem("novaCart")) || [];

// =========================
// ELEMENTS
// =========================

const checkoutItems = document.getElementById("checkoutItems");

const checkoutSubtotal = document.getElementById("checkoutSubtotal");

const checkoutDelivery = document.getElementById("checkoutDelivery");

const checkoutTotal = document.getElementById("checkoutTotal");

const placeOrderBtn = document.getElementById("placeOrderBtn");

const orderSuccess = document.getElementById("orderSuccess");

// =========================
// DELIVERY FEE
// =========================

const DELIVERY_FEE = 50;

// =========================
// RENDER ORDER
// =========================

function renderCheckout() {
  checkoutItems.innerHTML = "";

  // No cart items

  if (cart.length === 0) {
    checkoutItems.innerHTML = `

            <div class="empty-checkout">

                <p>
                    Your cart is empty.
                </p>

                <a href="index.html#shop">
                    Continue shopping →
                </a>

            </div>

        `;

    checkoutSubtotal.textContent = "₹0";

    checkoutDelivery.textContent = "₹0";

    checkoutTotal.textContent = "₹0";

    placeOrderBtn.disabled = true;

    placeOrderBtn.style.opacity = "0.5";

    return;
  }

  let subtotal = 0;

  cart.forEach(function (cartItem) {
    const product = products.find(function (item) {
      return item.id === cartItem.id;
    });

    if (!product) return;

    const itemTotal = product.price * cartItem.quantity;

    subtotal += itemTotal;

    const itemElement = document.createElement("div");

    itemElement.className = "checkout-summary-item";

    itemElement.innerHTML = `

            <div class="checkout-summary-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="checkout-summary-info">

                <span>
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    Qty: ${cartItem.quantity}
                </p>

            </div>


            <strong
                class="checkout-summary-price"
            >
                ₹${itemTotal}
            </strong>

        `;

    checkoutItems.appendChild(itemElement);
  });

  const total = subtotal + DELIVERY_FEE;

  checkoutSubtotal.textContent = `₹${subtotal}`;

  checkoutDelivery.textContent = `₹${DELIVERY_FEE}`;

  checkoutTotal.textContent = `₹${total}`;
}

// =========================
// PAYMENT OPTIONS
// =========================

const paymentOptions = document.querySelectorAll(".payment-option");

paymentOptions.forEach(function (option) {
  option.addEventListener("click", function () {
    paymentOptions.forEach(function (item) {
      item.classList.remove("active");
    });

    option.classList.add("active");
  });
});

// =========================
// VALIDATE FORM
// =========================

function validateCheckout() {
  const requiredFields = [
    "email",

    "firstName",

    "lastName",

    "address",

    "city",

    "pincode",

    "state",

    "phone",
  ];

  let valid = true;

  requiredFields.forEach(function (fieldId) {
    const field = document.getElementById(fieldId);

    if (field.value.trim() === "") {
      field.classList.add("checkout-error");

      valid = false;
    } else {
      field.classList.remove("checkout-error");
    }
  });

  // Basic PIN validation

  const pincode = document.getElementById("pincode");

  if (!/^\d{6}$/.test(pincode.value.trim())) {
    pincode.classList.add("checkout-error");

    valid = false;
  }

  // Basic email validation

  const email = document.getElementById("email");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    email.classList.add("checkout-error");

    valid = false;
  }

  return valid;
}

// =========================
// PLACE ORDER
// =========================

placeOrderBtn.addEventListener("click", function () {
  if (!validateCheckout()) {
    alert("Please complete all required fields.");

    return;
  }

  // Generate demo order number

  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  const orderNumber = `NOVA-${randomNumber}`;

  document.getElementById("orderNumber").textContent = orderNumber;

  // Show success

  orderSuccess.classList.add("active");

  // Clear cart

  cart = [];

  localStorage.setItem("novaCart", JSON.stringify(cart));
});

// =========================
// INITIALIZE
// =========================

renderCheckout();

// =========================
// MOBILE MENU
// =========================

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileMenu =
    document.getElementById("mobileMenu");


mobileMenuButton.addEventListener("click", function () {

    mobileMenu.classList.toggle("active");


    // Check whether menu is open

    const isOpen =
        mobileMenu.classList.contains("active");


    // Update accessibility attribute

    mobileMenuButton.setAttribute(
        "aria-expanded",
        isOpen
    );


    // Change hamburger icon

    mobileMenuButton.textContent =
        isOpen ? "✕" : "☰";

});


// =========================
// CLOSE MOBILE MENU
// WHEN LINK IS CLICKED
// =========================

const mobileLinks =
    document.querySelectorAll(".mobile-menu a");


mobileLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        mobileMenu.classList.remove("active");

        mobileMenuButton.textContent = "☰";

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    });

});


// =========================
// NAVBAR SCROLL EFFECT
// =========================

const navbar =
    document.getElementById("navbar");


window.addEventListener("scroll", function () {

    if (window.scrollY > 30) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


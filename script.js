// =====================================
// VELVOORA PRODUCT SYSTEM
// =====================================

const STORAGE_KEY = "velvooraProducts";
const WISHLIST_KEY = "velvooraWishlist";
const CART_KEY = "velvooraCart";

// =====================================
// DEMO PRODUCTS
// =====================================

const demoProducts = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        link: "#",
        inStock: true
    },
    {
        id: 2,
        name: "Stylish Wristwatch",
        category: "Watches",
        price: 1999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        link: "#",
        inStock: true
    },
    {
        id: 3,
        name: "Sports Sneakers",
        category: "Footwear",
        price: 2499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        link: "#",
        inStock: true
    },
    {
        id: 4,
        name: "Premium Sunglasses",
        category: "Fashion",
        price: 999,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
        link: "#",
        inStock: true
    },
    {
        id: 5,
        name: "Skincare Products",
        category: "Beauty",
        price: 799,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500",
        link: "#",
        inStock: true
    },
    {
        id: 6,
        name: "Modern Home Decor",
        category: "Home",
        price: 1299,
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500",
        link: "#",
        inStock: true
    },
    {
        id: 7,
        name: "Baby Products",
        category: "Baby",
        price: 899,
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500",
        link: "#",
        inStock: true
    },
    {
        id: 8,
        name: "Fitness Equipment",
        category: "Sports",
        price: 1599,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
        link: "#",
        inStock: true
    }
];

// =====================================
// LOAD PRODUCTS
// =====================================

function getProducts() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Product loading error:", error);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoProducts));

    return demoProducts;
}

let products = getProducts();
let filteredProducts = [...products];

// =====================================
// SAFE HTML
// =====================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// =====================================
// SAFE URL
// =====================================

function safeURL(value) {
    try {
        const url = new URL(value);

        if (url.protocol === "https:" || url.protocol === "http:") {
            return url.href;
        }
    } catch (error) {
        return "";
    }

    return "";
}

// =====================================
// WISHLIST
// =====================================

function getWishlist() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(WISHLIST_KEY) || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function toggleWishlist(encodedName) {
    const productName = decodeURIComponent(encodedName);

    let wishlist = getWishlist();

    if (wishlist.includes(productName)) {
        wishlist = wishlist.filter(name => name !== productName);
    } else {
        wishlist.push(productName);
    }

    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );

    updateWishlistCount();
    displayProducts(filteredProducts);
}

function showWishlist() {
    const wishlist = getWishlist();
    const products = getProducts();

    // Match saved products using their names
    const savedProducts = products.filter(product =>
        wishlist.includes(String(product.name))
    );

    const oldModal = document.getElementById("wishlistModal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.id = "wishlistModal";
    modal.className = "wishlist-modal";

    let productHTML = "";

    if (savedProducts.length === 0) {
        productHTML = `
            <div class="empty-wishlist">
                <h2>❤️ Your Wishlist is Empty</h2>
                <p>Save your favourite products and find them here.</p>
            </div>
        `;
    } else {
        productHTML = savedProducts.map(product => `
            <div class="wishlist-item">
                <img src="${safeURL(product.image)}"
                     alt="${escapeHTML(product.name)}">

                <div class="wishlist-details">
                    <h3>${escapeHTML(product.name)}</h3>

                    <p>₹${Number(product.price).toLocaleString("en-IN")}</p>

                    <button onclick="addWishlistToBag('${String(product.id).replace(/'/g, "\\'")}')">
                        🛍️ Add to Bag
                    </button>

                    <button class="remove-wishlist"
                        onclick="removeWishlistItem('${encodeURIComponent(product.name)}')">
                        Remove ❤️
                    </button>
                </div>
            </div>
        `).join("");
    }

    modal.innerHTML = `
        <div class="wishlist-content">
            <button class="wishlist-close" onclick="closeWishlist()">×</button>

            <h2>❤️ My Wishlist</h2>

            <div class="wishlist-products">
                ${productHTML}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}
function closeWishlist() {
    const modal = document.getElementById("wishlistModal");
    if (modal) modal.remove();
}
function removeWishlistItem(encodedName) {
    const productName = decodeURIComponent(encodedName);

    let wishlist = getWishlist();

    wishlist = wishlist.filter(name => name !== productName);

    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );

    updateWishlistCount();
    showWishlist();
}

function addWishlistToBag(id) {
    addToCart(id);
    showCart();
}

// =====================================
// SHOPPING BAG
// =====================================

function getCart() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(CART_KEY) || "[]"
        );

      return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function updateCartCount() {

    const totalItems = getCart().reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    // Desktop Bag Counter
    const desktopCount = document.getElementById("cartCount");

    if (desktopCount) {
        desktopCount.textContent = totalItems;
    }

    // Mobile Bag Counter
    const mobileCount = document.getElementById("mobileCartCount");

    if (mobileCount) {
        mobileCount.textContent = totalItems;
    }
}


function updateWishlistCount() {

    const totalItems = getWishlist().length;

    // Desktop Wishlist Counter
    const desktopCount = document.getElementById("wishlistCount");

    if (desktopCount) {
        desktopCount.textContent = totalItems;
    }

    // Mobile Wishlist Counter
    const mobileCount = document.getElementById("mobileWishlistCount");

    if (mobileCount) {
        mobileCount.textContent = totalItems;
    }
}
function addToCart(encodedName) {
    const productName = decodeURIComponent(encodedName);

    const product = products.find(
        item => item.name === productName
    );

    if (!product) return;

    if (product.inStock === false) {
        alert("This product is out of stock.");
        return;
    }

    let cart = getCart();

    const existing = cart.find(
        item => item.name === productName
    );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name: product.name,
            price: Number(product.price),
            quantity: 1
        });
    }

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();

    alert("Product added to your shopping bag!");
}

function showCart() {
    const cart = getCart();

    const oldModal = document.getElementById("cartModal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.id = "cartModal";
    modal.className = "cart-modal";

    let total = 0;
    let cartHTML = "";

    if (cart.length === 0) {
        cartHTML = `
            <div class="empty-cart">
                <h2>🛍️ Your Shopping Bag is Empty</h2>
                <p>Discover something special at VelVoora.</p>
            </div>
        `;
    } else {
        cartHTML = cart.map(item => {
            const subtotal = Number(item.price) * Number(item.quantity);
            total += subtotal;

            const product = products.find(
                p => p.name === item.name
            );

            const image = product ? safeURL(product.image) : "";

            return `
                <div class="cart-item">

                    <img src="${image}"
                         alt="${escapeHTML(item.name)}">

                    <div class="cart-details">

                        <h3>${escapeHTML(item.name)}</h3>

                        <p>₹${Number(item.price).toLocaleString("en-IN")}</p>

                        <div class="quantity-controls">

                            <button onclick="changeCartQuantity('${encodeURIComponent(item.name)}', -1)">−</button>

                            <span>${Number(item.quantity)}</span>

                            <button onclick="changeCartQuantity('${encodeURIComponent(item.name)}', 1)">+</button>

                        </div>

                        <button class="remove-cart"
                            onclick="removeCartItem('${encodeURIComponent(item.name)}')">
                            Remove
                        </button>

                    </div>

                    <div class="cart-subtotal">
                        ₹${subtotal.toLocaleString("en-IN")}
                    </div>

                </div>
            `;
        }).join("");
    }

    modal.innerHTML = `
        <div class="cart-content">

            <button class="cart-close"
                onclick="closeCart()">×</button>

            <h2>🛍️ My Shopping Bag</h2>

            <div class="cart-products">
                ${cartHTML}
            </div>

            ${cart.length > 0 ? `
                <div class="cart-summary">

                    <h3>Order Summary</h3>

                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>₹${total.toLocaleString("en-IN")}</span>
                    </div>

                    <div class="summary-row">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                    </div>

                    <div class="summary-row total-row">
                        <span>Total</span>
                        <span>₹${total.toLocaleString("en-IN")}</span>
                    </div>

                    <button class="checkout-btn"
                        onclick="checkoutCart()">
                        PROCEED TO CHECKOUT →
                    </button>

                    <p class="checkout-note">
                        Secure checkout will be available after payment integration.
                    </p>

                </div>
            ` : ""}

        </div>
    `;

    document.body.appendChild(modal);
}
function closeCart() {
    const modal = document.getElementById("cartModal");
    if (modal) modal.remove();
}

function changeCartQuantity(encodedName, change) {
    const productName = decodeURIComponent(encodedName);
    let cart = getCart();

    const item = cart.find(
        product => product.name === productName
    );

    if (!item) return;

    item.quantity += change;

    if (item.quantity < 1) {
        item.quantity = 1;
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    updateCartCount();
    showCart();
}

function removeCartItem(encodedName) {
    const productName = decodeURIComponent(encodedName);
    let cart = getCart();

    cart = cart.filter(
        item => item.name !== productName
    );

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    updateCartCount();
    showCart();
}

function checkoutCart() {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Your shopping bag is empty!");
        return;
    }

    const oldModal = document.getElementById("affiliateCheckoutModal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.id = "affiliateCheckoutModal";
    modal.className = "cart-modal";

    let checkoutHTML = "";

    cart.forEach(item => {
        const product = products.find(
            p => p.name === item.name
        );

        const affiliateLink = product ? safeURL(product.link) : "";

        checkoutHTML += `
            <div class="affiliate-checkout-item">
                <div>
                    <h3>${escapeHTML(item.name)}</h3>
                    <p>Quantity: ${Number(item.quantity)}</p>
                    <p>Price: ₹${(
                        Number(item.price) * Number(item.quantity)
                    ).toLocaleString("en-IN")}</p>
                </div>

                ${
                    affiliateLink
                    ? `<button onclick="openAffiliateLink('${encodeURIComponent(affiliateLink)}')">
                        Continue to Store →
                       </button>`
                    : `<p class="missing-link">Affiliate link not added yet.</p>`
                }
            </div>
        `;
    });

    modal.innerHTML = `
        <div class="cart-content affiliate-checkout-content">
            <button class="cart-close"
                onclick="closeAffiliateCheckout()">×</button>

            <h2>🛍️ VelVoora Checkout</h2>

            <p class="affiliate-intro">
                Your selected products are ready!
                Continue to the retailer's website to complete your purchase.
            </p>

            <div class="affiliate-checkout-products">
                ${checkoutHTML}
            </div>

            <div class="affiliate-disclaimer">
                <strong>Important:</strong>
                Prices and availability may change on the retailer's website.
                VelVoora may earn a commission from qualifying purchases.
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function openAffiliateLink(encodedLink) {
    const link = decodeURIComponent(encodedLink);
    const url = safeURL(link);

    if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
    } else {
        alert("This affiliate link is not valid.");
    }
}

function closeAffiliateCheckout() {
    const modal = document.getElementById("affiliateCheckoutModal");
    if (modal) modal.remove();
}
// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayProducts(items, gridId = "productGrid") {

    const grid = document.getElementById(gridId);

    if (!grid) return;

    if (!items || items.length === 0) {
        grid.innerHTML = `
            <p style="padding:30px;">
                No products found.
            </p>
        `;
        return;
    }

    grid.innerHTML = items.map(product => {

        const image = safeURL(product.image);
        const link = safeURL(product.link);

        const saved = getWishlist().includes(product.name);

        return `
            <div class="product-card">

                <img src="${escapeHTML(image)}"
                     alt="${escapeHTML(product.name)}">

                <h3>${escapeHTML(product.name)}</h3>

                <p>${escapeHTML(product.category)}</p>

                <h4>₹${escapeHTML(product.price)}</h4>

                <p>
                    ${product.inStock === false
                        ? "Out of Stock"
                        : "In Stock"}
                </p>

                <button
                    class="wishlist-btn"
                    onclick="toggleWishlist('${encodeURIComponent(product.name)}')">
                    ${saved ? "❤️ Added to Wishlist" : "♡ Add to Wishlist"}
                </button>

                <button
                    class="header-action"
                    onclick="addToCart('${encodeURIComponent(product.name)}')">
                    🛍️ Add to Bag
                </button>

                <a href="${link || "#"}"
                   class="buy-btn"
                   ${link ? 'target="_blank" rel="noopener noreferrer"' : ""}
                   onclick="return handleBuy(event, this)">
                    View Deal
                </a>

            </div>
        `;

    }).join("");

}
// =====================================
// TRENDING PRODUCTS
// =====================================

function displayTrendingProducts() {

    const section = document.getElementById("trendingSection");

    if (!section) return;

    const trendingProducts = products.filter(
        product => product.trending === true
    );

    if (trendingProducts.length === 0) {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";

    displayProducts(trendingProducts, "trendingProductGrid");
}

function showAllProducts() {
    // Clear search
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.value = "";
    }

    // Reset category and price filters
    if (typeof resetFilters === "function") {
        resetFilters();
    } else {
        displayProducts(products);
    }

    // Show all products
    window.scrollTo({
        top: document.getElementById("products").offsetTop,
        behavior: "smooth"
    });
}

// =====================================
// CATEGORY FILTER
// =====================================

function filterCategory(category) {

    document.querySelectorAll(".category-filter").forEach(box => {
        box.checked = box.value === category;
    });

    applyFilters();

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}

// =====================================
// SEARCH
// =====================================

function searchProducts() {
    applyFilters();
}

// =====================================
// APPLY FILTERS
// =====================================

function applyFilters() {

    const searchText =
        document.getElementById("searchInput")?.value
            .toLowerCase().trim() || "";

    const selectedCategories = [
        ...document.querySelectorAll(".category-filter:checked")
    ].map(box => box.value.toLowerCase());

    const minPrice =
        Number(document.getElementById("minPrice")?.value) || 0;

    const maxInput =
        document.getElementById("maxPrice")?.value;

    const maxPrice =
        maxInput === "" ? Infinity : Number(maxInput);

    const showInStock =
        document.getElementById("inStock").checked;

    const showOutStock =
        document.getElementById("outStock").checked;

    filteredProducts = products.filter(product => {

        const matchesSearch =
            String(product.name).toLowerCase().includes(searchText) ||
            String(product.category).toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(
                String(product.category).toLowerCase()
            );

        const price = Number(product.price) || 0;

        const matchesPrice =
            price >= minPrice && price <= maxPrice;

        const isInStock = product.inStock !== false;

        const matchesStock =
            (showInStock && isInStock) ||
            (showOutStock && !isInStock);

        return matchesSearch &&
            matchesCategory &&
            matchesPrice &&
            matchesStock;

    });

    sortProducts(false);

    updateActiveFilters();
}

// =====================================
// SORT PRODUCTS
// =====================================

function sortProducts(reapply = true) {

    if (reapply) {
        applyFilters();
        return;
    }

    const sortValue =
        document.getElementById("sortSelect").value;

    if (sortValue === "low") {
        filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
    }

    else if (sortValue === "high") {
        filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
    }

    else if (sortValue === "name") {
        filteredProducts.sort((a, b) =>
            String(a.name).localeCompare(String(b.name))
        );
    }

    displayProducts(filteredProducts);
}

// =====================================
// RESET FILTERS
// =====================================

function resetFilters() {

    document.querySelectorAll(".category-filter").forEach(box => {
        box.checked = false;
    });

    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";

    document.getElementById("inStock").checked = true;
    document.getElementById("outStock").checked = false;

    document.getElementById("searchInput").value = "";

    document.getElementById("sortSelect").value = "default";

    filteredProducts = [...products];

    updateActiveFilters();

    displayProducts(filteredProducts);
}

// =====================================
// ACTIVE FILTER DISPLAY
// =====================================

function updateActiveFilters() {

    const container = document.getElementById("activeFilters");

    if (!container) return;

    const selected = [
        ...document.querySelectorAll(".category-filter:checked")
    ].map(box => box.value);

    container.innerHTML = `
        <span>
            ${selected.length
                ? escapeHTML(selected.join(", "))
                : "All Products"}
        </span>

        <span>
            ${filteredProducts.length} Products Found
        </span>
    `;
}

// =====================================
// BUY BUTTON
// =====================================

function handleBuy(event, button) {

    if (button.getAttribute("href") === "#") {

        event.preventDefault();

        alert("Affiliate purchase link has not been added yet.");

        return false;
    }

    return true;
}

// =====================================
// LIVE PRODUCT UPDATES
// =====================================

window.addEventListener("storage", function(event) {

    if (event.key === STORAGE_KEY) {

        products = getProducts();

        resetFilters();

        displayTrendingProducts();
    }

});

// =====================================
// INITIALIZE WEBSITE
// =====================================

function initializeVelVoora() {

    products = getProducts();
    filteredProducts = [...products];

    document.querySelectorAll(".category-filter").forEach(box => {
        box.addEventListener("change", applyFilters);
    });

    document.getElementById("inStock")?.addEventListener("change", applyFilters);

    document.getElementById("outStock")?.addEventListener("change", applyFilters);

    document.getElementById("searchInput")?.addEventListener("input", applyFilters);

    document.getElementById("minPrice")?.addEventListener("change", applyFilters);

    document.getElementById("maxPrice")?.addEventListener("change", applyFilters);

    updateActiveFilters();
    updateWishlistCount();
    updateCartCount();

    displayProducts(products);
    displayTrendingProducts();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeVelVoora);
} else {
    initializeVelVoora();
}
// === PRODUCT DATA ===
const products = [
  // HOODIES
  { id: "h1", name: "White Hoodie", price: 65, img: "whiteh.jpg", tag: "new", category: "hoodie" },
  { id: "h2", name: "Black Hoodie", price: 70, img: "blackh.jpg", tag: "popular", category: "hoodie" },
  { id: "h3", name: "Graphite Hoodie", price: 62, img: "greyh.jpg", tag: "old", category: "hoodie" },
  { id: "h4", name: "Gray Hoodie", price: 68, img: "greyho.jpg", tag: "new", category: "hoodie" },

  // SWEATSHIRTS
  { id: "s1", name: "Black Sweatshirt", price: 55, img: "blackt.jpg", tag: "new", category: "sweatshirt" },
  { id: "s2", name: "White Cream Sweatshirt", price: 58, img: "whitet.jpg", tag: "popular", category: "sweatshirt" },
  { id: "s3", name: "Gray Sweatshirt", price: 52, img: "greyt.jpg", tag: "old", category: "sweatshirt" },
  { id: "s4", name: "Brown Sweatshirt", price: 60, img: "brownt.jpg", tag: "new", category: "sweatshirt" },

  // T-SHIRTS
  { id: "t1", name: "White T-shirt", price: 30, img: "whites.jpg", tag: "new", category: "tshirt" },
  { id: "t2", name: "Black T-shirt", price: 35, img: "blasks.jpg", tag: "popular", category: "tshirt" },
  { id: "t3", name: "Brown T-shirt", price: 32, img: "browns.jpg", tag: "old", category: "tshirt" },
  { id: "t4", name: "Graphite T-shirt", price: 38, img: "greys.jpg", tag: "new", category: "tshirt" },
];

// === RENDER PRODUCTS ===
function renderProducts(filter = "all") {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";

  const filtered = products.filter(p => filter === "all" || p.tag === filter);

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "col-md-4 col-lg-3";
    card.innerHTML = `
      <div class="card product h-100">
        <img src="${p.img}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column text-center">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">$${p.price}</p>
          <p class="text-muted">${p.category.toUpperCase()} • ${p.tag.toUpperCase()}</p>
          <button class="btn btn-dark mt-auto add-to-cart"
            data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}">
            Add to Cart
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// === INITIAL LOAD ===
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      renderProducts(filter);
    });
  });

  // Add to cart
  document.body.addEventListener("click", e => {
    if (e.target.classList.contains("add-to-cart")) {
      const { id, name, price, img } = e.target.dataset;
      addToCart({ id, name, price: parseFloat(price), img });
    }
  });

  updateCartCount();
  renderCartItems();
});

// === CART FUNCTIONS ===
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(p => p.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

function removeFromCart(id) {
  const cart = getCart().filter(p => p.id !== id);
  saveCart(cart);
  renderCartItems();
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((sum, p) => sum + p.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

function renderCartItems() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!container || !totalEl) return;

  const cart = getCart();
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">Your cart is empty.</p>`;
    totalEl.textContent = "0";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card h-100 text-center">
        <img src="${item.img}" class="card-img-top" alt="${item.name}">
        <div class="card-body">
          <h5>${item.name}</h5>
          <p>Price: $${item.price} × ${item.qty}</p>
          <button class="btn btn-outline-dark remove-item" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  totalEl.textContent = total.toFixed(2);
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("remove-item")) {
    const id = e.target.getAttribute("data-id");
    removeFromCart(id);
  }
});

document.addEventListener("click", e => {
  if (e.target.id === "checkout-btn") {
    alert("Thank you for your purchase!");
    localStorage.removeItem("cart");
    renderCartItems();
    updateCartCount();
  }
});

// ===5 FEATURES ===

/// === ROBUST POPUP SUBSCRIBE ===
(function() {
  // ждём, пока DOM полностью загружен
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Popup module init");

    const popup = document.getElementById("popup");
    const openBtn = document.getElementById("subscribe-btn");
    const closeBtn = document.getElementById("close-popup");
    const submitBtn = document.getElementById("popup-submit");
    const emailInput = document.getElementById("popup-email");
    const msg = document.getElementById("popup-msg");

    if (!popup) return console.warn("Popup element not found (#popup).");
    if (!openBtn) return console.warn("Open button not found (#subscribe-btn).");

    // open
    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      popup.style.display = "flex";
      // ensure popup is on top
      popup.style.zIndex = 9999;
      if (emailInput) emailInput.focus();
      if (msg) { msg.textContent = ""; msg.style.color = ""; }
      console.log("Popup opened");
    });

    // close via X
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
      });
    }

    // close by clicking outside content
    popup.addEventListener("click", (e) => {
      if (e.target === popup) popup.style.display = "none";
    });

    // submit
    if (submitBtn) {
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault(); 
        const email = emailInput ? emailInput.value.trim() : "";
        if (!email) {
          if (msg) { msg.textContent = "Введите email."; msg.style.color = "red"; }
          if (emailInput) emailInput.focus();
          return;
        }
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email)) {
          if (msg) { msg.textContent = "Некорректный email."; msg.style.color = "red"; }
          if (emailInput) emailInput.focus();
          return;
        }
        if (msg) { msg.textContent = "Спасибо! Вы подписаны."; msg.style.color = "green"; }
        if (emailInput) emailInput.value = "";
        setTimeout(() => popup.style.display = "none", 1400);
      });
    }

    console.log("Popup module ready");
  });
})();


// 3. Change Theme / Background
const themeBtn = document.getElementById("theme-btn");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const colors = ["#f5f3ef", "#082a08ff", "#111036ff", "#d5b88eff", "#450e12ff"];
    const random = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = random;
  });
}

// === DISPLAY CURRENT DATE & TIME ===
function updateDateTime() {
  const now = new Date();

  // Форматирование даты и времени (удобное для чтения)
  const options = {
    year: 'numeric',
    month: 'long',   // "октября"
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    };

  // Локализация (русская версия)
  const formatted = now.toLocaleString('en-US', options);

  // Найдём элемент и обновим текст
  const dt = document.getElementById("datetime");
  if (dt) {
    dt.textContent = `Now: ${formatted}`;
  }
}

// Обновлять каждую секунду
setInterval(updateDateTime, 1000);
updateDateTime();

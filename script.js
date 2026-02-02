// ====== CONFIGURABLE SHOE DATA ======
// You can freely customize this list; IDs should be unique
const SHOES = [
  {
    id: "shoe-1",
    name: "Classic Leather",
    price: 2499,
    img: "Material/shoe1.jpg",
  },
  {
    id: "shoe-2",
    name: "Urban Runner",
    price: 3199,
    img: "Material/shoe2.jpg",
  },
  {
    id: "shoe-3",
    name: "Everyday Canvas",
    price: 1999,
    img: "Material/shoe3.jpg",
  },
  {
    id: "shoe-4",
    name: "Premium Derby",
    price: 3999,
    img: "Material/shoe4.jpg",
  },
  {
    id: "shoe-5",
    name: "Sport Flex",
    price: 2799,
    img: "Material/shoe5.jpg",
  },
  {
    id: "shoe-6",
    name: "Street High-Top",
    price: 3499,
    img: "Material/shoe6.jpg",
  },
];

// ====== GLOBAL STATE ======
const state = {
  cart: new Map(), // id -> { item, qty }
  bookingMode: "cart", // 'cart' or 'single'
  bookingSingleItem: null, // used when Buy Now is clicked
};

// ====== HELPERS ======
const INR = (n) => n.toLocaleString("en-IN");
const getSubtotal = () =>
  Array.from(state.cart.values()).reduce((acc, { item, qty }) => acc + item.price * qty, 0);
const getDiscount = (subtotal) => {
  // Simple discount: 10% off if subtotal >= ₹5000
  return subtotal >= 5000 ? Math.round(subtotal * 0.1) : 0;
};
const getTotal = () => {
  const sub = getSubtotal();
  const disc = getDiscount(sub);
  return { sub, disc, total: sub - disc };
};
const cartCount = () =>
  Array.from(state.cart.values()).reduce((acc, { qty }) => acc + qty, 0);

// ====== DOM REFS ======
const refs = {
  loader: document.getElementById("loader"),
  loaderProgressFill: document.getElementById("loaderProgressFill"),
  loaderProgressLabel: document.getElementById("loaderProgressLabel"),
  navLinks: document.getElementById("navLinks"),
  hamburger: document.getElementById("hamburger"),
  scrollToShoes: document.getElementById("scrollToShoes"),

  shoeGrid: document.getElementById("shoeGrid"),
  basketFab: document.getElementById("basketFab"),
  basketCount: document.getElementById("basketCount"),
  basketPanel: document.getElementById("basketPanel"),
  basketItems: document.getElementById("basketItems"),
  basketOverlay: document.getElementById("basketOverlay"),
  closeBasket: document.getElementById("closeBasket"),
  clearBasket: document.getElementById("clearBasket"),
  subtotal: document.getElementById("subtotal"),
  discount: document.getElementById("discount"),
  total: document.getElementById("total"),
  proceedToBook: document.getElementById("proceedToBook"),

  bookingModal: document.getElementById("bookingModal"),
  bookingOverlay: document.getElementById("bookingOverlay"),
  bookingSummary: document.getElementById("bookingSummary"),
  closeBooking: document.getElementById("closeBooking"),
  bookingForm: document.getElementById("bookingForm"),
  bookingStatus: document.getElementById("bookingStatus"),

  contactForm: document.getElementById("contactForm"),
  contactStatus: document.getElementById("contactStatus"),
};

// ====== INITIALIZE ======
let progressDone = false;
let windowLoaded = false;

function tryHideLoader() {
  if (progressDone && windowLoaded) {
    refs.loader.classList.add("hidden");
  }
}

function startLoaderProgress(duration = 10000) {
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const pct = Math.min(100, Math.max(1, Math.floor((elapsed / duration) * 100)));
    if (refs.loaderProgressFill) refs.loaderProgressFill.style.width = pct + "%";
    if (refs.loaderProgressLabel) refs.loaderProgressLabel.textContent = pct + "%";
    if (elapsed < duration) {
      requestAnimationFrame(tick);
    } else {
      progressDone = true;
      tryHideLoader();
    }
  }
  requestAnimationFrame(tick);
}
startLoaderProgress(10000);

window.addEventListener("load", () => {
  windowLoaded = true;
  tryHideLoader();
});

// Build shoe grid
function renderShoes() {
  const frag = document.createDocumentFragment();
  SHOES.forEach((s) => {
    const card = document.createElement("div");
    card.className = "card reveal";
    card.innerHTML = `
      <div class="card-media">
        <img src="${s.img}" alt="${s.name}" />
      </div>
      <div class="card-body">
        <h4 class="card-title">${s.name}</h4>
        <div class="card-price">₹ ${INR(s.price)}</div>
        <div class="card-actions">
          <button class="btn outline" data-action="add" data-id="${s.id}">Add to Basket</button>
          <button class="btn primary" data-action="buy" data-id="${s.id}">Buy Now</button>
        </div>
      </div>
    `;
    frag.appendChild(card);
  });
  refs.shoeGrid.innerHTML = "";
  refs.shoeGrid.appendChild(frag);
}
renderShoes();

// ====== NAV / SCROLL ======
// Mobile menu toggle
refs.hamburger.addEventListener("click", () => {
  refs.hamburger.classList.toggle("active");
  refs.navLinks.classList.toggle("open");
});
// Close menu on link click (mobile)
refs.navLinks.addEventListener("click", (e) => {
  if (e.target.matches("a")) {
    refs.hamburger.classList.remove("active");
    refs.navLinks.classList.remove("open");
  }
});
// Smooth scroll to shoes
refs.scrollToShoes.addEventListener("click", () => {
  document.querySelector("#shoes").scrollIntoView({ behavior: "smooth" });
});
// Active section highlight
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (entry.isIntersecting) {
          document
            .querySelectorAll(".nav-link")
            .forEach((a) => a.classList.remove("active"));
          link.classList.add("active");
        }
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
);
["home", "about", "shoes", "contact", "location"].forEach((id) =>
  navObserver.observe(document.getElementById(id))
);

// Reveal on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Subtle parallax for shapes
window.addEventListener("scroll", () => {
  const sc = window.scrollY;
  document.querySelectorAll(".shape").forEach((shape, i) => {
    const speed = 0.02 + (i % 3) * 0.01;
    shape.style.transform = `translateY(${Math.sin(sc * speed) * 8}px)`;
  });
});

// ====== CART LOGIC ======
function updateBasketUI() {
  // Count
  refs.basketCount.textContent = cartCount();

  // Items
  refs.basketItems.innerHTML = "";
  if (state.cart.size === 0) {
    refs.basketItems.innerHTML =
      '<p style="color: var(--muted);">Your basket is empty.</p>';
  } else {
    state.cart.forEach(({ item, qty }) => {
      const row = document.createElement("div");
      row.className = "basket-item";
      row.innerHTML = `
        <div>
          <div class="title">${item.name}</div>
          <div class="qty">₹ ${INR(item.price)} × ${qty}</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">-</button>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
          <button class="qty-btn" data-action="remove" data-id="${item.id}">✕</button>
        </div>
      `;
      refs.basketItems.appendChild(row);
    });
  }

  // Totals
  const { sub, disc, total } = getTotal();
  refs.subtotal.textContent = INR(sub);
  refs.discount.textContent = INR(disc);
  refs.total.textContent = INR(total);
}
updateBasketUI();

function addToCart(id) {
  const item = SHOES.find((s) => s.id === id);
  if (!item) return;
  const existing = state.cart.get(id);
  if (existing) existing.qty += 1;
  else state.cart.set(id, { item, qty: 1 });
  updateBasketUI();
}
function incItem(id) {
  const existing = state.cart.get(id);
  if (!existing) return;
  existing.qty += 1;
  updateBasketUI();
}
function decItem(id) {
  const existing = state.cart.get(id);
  if (!existing) return;
  existing.qty -= 1;
  if (existing.qty <= 0) state.cart.delete(id);
  updateBasketUI();
}
function removeItem(id) {
  state.cart.delete(id);
  updateBasketUI();
}
function clearBasket() {
  state.cart.clear();
  updateBasketUI();
}

// Shoe card actions
refs.shoeGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  const action = btn.getAttribute("data-action");
  if (action === "add") {
    addToCart(id);
    openBasket();
  } else if (action === "buy") {
    const item = SHOES.find((s) => s.id === id);
    if (!item) return;
    state.bookingMode = "single";
    state.bookingSingleItem = { item, qty: 1 };
    openBooking();
  }
});

// Basket panel open/close
function openBasket() {
  refs.basketPanel.classList.add("open");
  refs.basketOverlay.classList.add("open");
}
function closeBasket() {
  refs.basketPanel.classList.remove("open");
  refs.basketOverlay.classList.remove("open");
}
refs.basketFab.addEventListener("click", openBasket);
refs.closeBasket.addEventListener("click", closeBasket);
refs.basketOverlay.addEventListener("click", closeBasket);
refs.clearBasket.addEventListener("click", clearBasket);
// Basket item controls
refs.basketItems.addEventListener("click", (e) => {
  const el = e.target.closest(".qty-btn");
  if (!el) return;
  const action = el.getAttribute("data-action");
  const id = el.getAttribute("data-id");
  if (action === "inc") incItem(id);
  else if (action === "dec") decItem(id);
  else if (action === "remove") removeItem(id);
});

// Proceed to Book (cart)
refs.proceedToBook.addEventListener("click", () => {
  state.bookingMode = "cart";
  state.bookingSingleItem = null;
  openBooking();
});

// ====== BOOKING MODAL ======
function openBooking() {
  // Build summary
  let summaryHtml = "";
  let shoesSummary = [];
  if (state.bookingMode === "single" && state.bookingSingleItem) {
    const { item, qty } = state.bookingSingleItem;
    const lineTotal = item.price * qty;
    summaryHtml += `<div>• ${item.name} — ₹ ${INR(item.price)} × ${qty} = ₹ ${INR(
      lineTotal
    )}</div>`;
    shoesSummary.push({ name: item.name, price: item.price, qty });
  } else {
    if (state.cart.size === 0) {
      summaryHtml = `<div style="color: var(--muted)">Your basket is empty.</div>`;
    } else {
      state.cart.forEach(({ item, qty }) => {
        const lineTotal = item.price * qty;
        summaryHtml += `<div>• ${item.name} — ₹ ${INR(item.price)} × ${qty} = ₹ ${INR(
          lineTotal
        )}</div>`;
        shoesSummary.push({ name: item.name, price: item.price, qty });
      });
    }
  }
  const totals = getTotal();
  summaryHtml += `<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.12); margin: 8px 0">`;
  summaryHtml += `<div>Subtotal: ₹ ${INR(totals.sub)}</div>`;
  summaryHtml += `<div>Discount: - ₹ ${INR(totals.disc)}</div>`;
  summaryHtml += `<div><strong>Total: ₹ ${INR(totals.total)}</strong></div>`;

  refs.bookingSummary.innerHTML = summaryHtml;
  refs.bookingModal.classList.add("open");
  refs.bookingOverlay.classList.add("open");
  refs.bookingStatus.textContent = "";
  closeBasket();
}
function closeBooking() {
  refs.bookingModal.classList.remove("open");
  refs.bookingOverlay.classList.remove("open");
}
refs.closeBooking.addEventListener("click", closeBooking);
refs.bookingOverlay.addEventListener("click", closeBooking);

// ====== EMAIL INTEGRATION (Web3Forms) ======
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = "32784d7c-d6fe-48b8-a2c3-783c8d09580f";

// Booking submission
refs.bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const pickup = document.getElementById("pickupTime").value.trim();
  const totals = getTotal();

  // Build shoe summary string
  let lines = [];
  if (state.bookingMode === "single" && state.bookingSingleItem) {
    const { item, qty } = state.bookingSingleItem;
    lines.push(`${item.name} — ₹ ${INR(item.price)} × ${qty}`);
  } else {
    state.cart.forEach(({ item, qty }) => {
      lines.push(`${item.name} — ₹ ${INR(item.price)} × ${qty}`);
    });
  }
  const summary = lines.join("\n");

  // Compose payload (Web3Forms accepts JSON)
  const payload = {
    access_key: WEB3FORMS_KEY,
    subject: "New Shoe Booking – M+ Shoes",
    from_name: "M+ Shoes Website",
    customer_name: name,
    phone_number: phone,
    pickup_time: pickup,
    shoe_summary: summary,
    total_price: `₹ ${INR(totals.total)}`,
  };

  refs.bookingStatus.textContent = "Submitting...";
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      refs.bookingStatus.textContent = "Booked successfully! We’ll contact you soon.";
      // Clear only on cart bookings
      if (state.bookingMode === "cart") clearBasket();
      setTimeout(closeBooking, 1200);
    } else {
      refs.bookingStatus.textContent = "Failed to submit. Please try again.";
    }
  } catch (err) {
    refs.bookingStatus.textContent = "Network error. Please retry.";
  }
});

// Contact form submission
refs.contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("enquiryName").value.trim();
  const phone = document.getElementById("enquiryPhone").value.trim();
  const message = document.getElementById("enquiryMessage").value.trim();

  const payload = {
    access_key: WEB3FORMS_KEY,
    subject: "Contact Enquiry – M+ Shoes",
    from_name: "M+ Shoes Website",
    customer_name: name,
    phone_number: phone,
    enquiry_message: message,
  };

  refs.contactStatus.textContent = "Submitting...";
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      refs.contactStatus.textContent = "Sent successfully! We’ll get back soon.";
      refs.contactForm.reset();
    } else {
      refs.contactStatus.textContent = "Failed to submit. Please try again.";
    }
  } catch (err) {
    refs.contactStatus.textContent = "Network error. Please retry.";
  }
});

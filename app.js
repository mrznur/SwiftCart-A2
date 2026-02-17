const API = "https://fakestoreapi.com";

const trendingEl = document.getElementById("trending");
const categoryEl = document.getElementById("category");
const productEl = document.getElementById("product");
const loaderEl = document.getElementById("loader");

const cartCountEl = document.getElementById("cartCount");

const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalRating = document.getElementById("modalRating");
const modalAddToCart = document.getElementById("modalAddToCart");

const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterMessage = document.getElementById("newsletterMessage");

let allProducts = [];
let cart = [];
let currentModalProduct = null;

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

function showLoader() {
  loaderEl.classList.remove("hidden");
}
function hideLoader() {
  loaderEl.classList.add("hidden");
}

function shortTitle(text, max = 25) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

function renderTrending(products) {
  const top3 = [...products]
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 3);

  trendingEl.innerHTML = "";

  top3.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card bg-stone-200 shadow-xl h-80 flex flex-col";

    card.innerHTML = `
      <figure class="p-4 flex-shrink-0">
        <img src="${p.image}" class="h-40 w-80 w-full object-contain" />
      </figure>
      <div class="card-body flex-1 flex flex-col justify-between">
        <h2 class="card-title text-xl">${shortTitle(p.title, 35)}</h2>
        <div>
          <p class="font-semibold">$${p.price}</p>
          <p><i class="fa-regular fa-star"></i> ${p.rating.rate}</p>
        </div>
      </div>
    `;

    trendingEl.appendChild(card);
  });
}

function renderProducts(products) {
  productEl.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card bg-base-200 shadow";

    card.innerHTML = `
      <figure class="p-4">
        <img src="${p.image}" class="h-40 w-full object-contain" />
      </figure>

      <div class="card-body">
        <span class="badge badge-outline">${p.category}</span>

        <h2 class="card-title text-sm" title="${p.title}">
          ${shortTitle(p.title, 40)}
        </h2>

        <p class="font-semibold">$${p.price}</p>
        <p><i class="fa-regular fa-star"></i> ${p.rating.rate} (${p.rating.count})</p>

        <div class="card-actions justify-between">
          <button class="btn btn-sm" onclick="showDetails(${p.id})"><i class="fa-regular fa-eye"></i>Details</button>
          <button class="btn btn-sm btn-primary" onclick="addToCart(${p.id})">Add</button>
        </div>
      </div>
    `;

    productEl.appendChild(card);
  });
}

function renderCategories(categories) {
  categoryEl.innerHTML = "";

  // All button
  const allBtn = document.createElement("button");
  allBtn.className = "btn btn-sm btn-primary";
  allBtn.textContent = "All";
  allBtn.onclick = () => loadProducts("all");
  categoryEl.appendChild(allBtn);

  // Others
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline";
    btn.textContent = cat;
    btn.onclick = () => loadProducts(cat);
    categoryEl.appendChild(btn);
  });
}

// ====== API Loading ======
async function loadCategories() {
  const categories = await fetchJSON(`${API}/products/categories`);
  renderCategories(categories);
}

async function loadProducts(category) {
  showLoader();

  try {
    if (category === "all") {
      renderProducts(allProducts);
    } else {
      const products = await fetchJSON(
        `${API}/products/category/${encodeURIComponent(category)}`,
      );
      renderProducts(products);
    }
  } catch (err) {
    productEl.innerHTML = `<p class="text-red-500">Failed to load products.</p>`;
  }

  hideLoader();
}

// ====== Modal (Details) ======
async function showDetails(id) {
  const product = await fetchJSON(`${API}/products/${id}`);
  currentModalProduct = product;

  modalTitle.textContent = product.title;
  modalImage.src = product.image;
  modalDescription.textContent = product.description;
  modalPrice.textContent = "$" + product.price;
  modalRating.textContent = `${product.rating.rate} (${product.rating.count})`;

  modal.showModal();
}

// IMPORTANT: make showDetails accessible from HTML onclick
window.showDetails = showDetails;

// ====== Cart (simple) ======
function updateCartCount() {
  if (cartCountEl) cartCountEl.textContent = cart.length;
}

function addToCart(id) {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  cart.push(product);
  updateCartCount();
}

// IMPORTANT: make addToCart accessible from HTML onclick
window.addToCart = addToCart;

// Add from modal button
modalAddToCart.addEventListener("click", () => {
  if (!currentModalProduct) return;
  cart.push(currentModalProduct);
  updateCartCount();
  modal.close();
});

// ====== Newsletter (simple) ======
newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = newsletterEmail.value.trim();
  newsletterMessage.textContent = `Subscribed: ${email}`;
  newsletterForm.reset();
});

// ====== Init ======
function showAllProducts() {
  const productsSection = document.getElementById("products");
  productsSection.classList.remove("hidden");
  loadProducts("all");
  productsSection.scrollIntoView({ behavior: "smooth" });
}

// IMPORTANT: make showAllProducts accessible from HTML onclick
window.showAllProducts = showAllProducts;

async function init() {
  showLoader();

  allProducts = await fetchJSON(`${API}/products`);
  renderTrending(allProducts);
  renderProducts(allProducts);
  await loadCategories();

  hideLoader();
}

init();

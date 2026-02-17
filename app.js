const API = "https://fakestoreapi.com";
const allCategories = "https://fakestoreapi.com/products/categories";
const productID = "https://fakestoreapi.com/products/${id}";

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

  top3.forEach((prod) => {
    const card = document.createElement("div");
    card.className = "card bg-stone-200 shadow-xl h-80 flex flex-col";

    card.innerHTML = `
      <figure class="p-4 flex-shrink-0">
        <img src="${prod.image}" class="h-40 w-80 w-full object-contain" />
      </figure>
      <div class="card-body flex-1 flex flex-col justify-between w-full">
        <h2 class="card-title lg:text-2xl">${shortTitle(prod.title, 35)}</h2>
        <div class="flex justify-between w-full border border-red-500">
          <p class="font-semibold text-lg">$${prod.price}</p>
          <p><i class="fa-regular fa-star text-lg"></i> ${prod.rating.rate}</p>
        </div>
      </div>
    `;

    trendingEl.appendChild(card);
  });
}

function renderProducts(products) {
  productEl.innerHTML = "";

  products.forEach((prod) => {
    const card = document.createElement("div");
    card.className = "card bg-base-200 shadow";

    card.innerHTML = `
      <figure class="p-4">
        <img src="${prod.image}" class="h-40 w-full object-contain" />
      </figure>

      <div class="card-body">
        <span class="badge badge-outline">${prod.category}</span>

        <h2 class="card-title text-sm" title="${prod.title}">
          ${shortTitle(prod.title, 40)}
        </h2>

        <p class="font-semibold">$${prod.price}</p>
        <p><i class="fa-regular fa-star"></i> ${prod.rating.rate} (${prod.rating.count})</p>

        <div class="card-actions justify-between">
          <button class="btn btn-sm" onclick="showDetails(${prod.id})"><i class="fa-regular fa-eye"></i>Details</button>
          <button class="btn btn-sm btn-primary" onclick="addToCart(${prod.id})">Add</button>
        </div>
      </div>
    `;

    productEl.appendChild(card);
  });
}

function renderCategories(categories) {
  categoryEl.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "btn btn-sm btn-primary";
  allBtn.textContent = "All";
  allBtn.onclick = () => loadProducts("all");
  categoryEl.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline";
    btn.textContent = cat;
    btn.onclick = () => loadProducts(cat);
    categoryEl.appendChild(btn);
  });
}

async function loadCategories() {
  const categories = await fetchJSON(`${allCategories}`);
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

async function showDetails(id) {
  const product = await fetchJSON(`${productID}`);
  currentModalProduct = product;

  modalTitle.textContent = product.title;
  modalImage.src = product.image;
  modalDescription.textContent = product.description;
  modalPrice.textContent = "$" + product.price;
  modalRating.textContent = `${product.rating.rate} (${product.rating.count})`;

  modal.showModal();
}

window.showDetails = showDetails;

function updateCartCount() {
  if (cartCountEl) cartCountEl.textContent = cart.length;
}

function addToCart(id) {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  cart.push(product);
  updateCartCount();
}

window.addToCart = addToCart;

const cartModal = document.getElementById("cartModal");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const cartTotalEl = document.getElementById("cartTotal");
const cartClearBtn = document.getElementById("cartClear");

function renderCartModal() {
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartEmptyEl.classList.remove("hidden");
    cartTotalEl.innerHTML = "";
    return;
  }

  cartEmptyEl.classList.add("hidden");

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const itemDiv = document.createElement("div");
    itemDiv.className =
      "flex justify-between items-center bg-base-200 p-4 rounded";
    itemDiv.innerHTML = `
      <div class="flex-1">
        <h4 class="font-semibold">${shortTitle(item.title, 40)}</h4>
        <p class="text-sm text-gray-600">$${item.price}</p>
      </div>
      <button class="btn btn-sm btn-outline" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsEl.appendChild(itemDiv);
  });

  cartTotalEl.innerHTML = `Total: $${total.toFixed(2)}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCartModal();
}

function openCartModal() {
  renderCartModal();
  cartModal.showModal();
}

cartClearBtn.addEventListener("click", () => {
  cart = [];
  updateCartCount();
  renderCartModal();
});

window.removeFromCart = removeFromCart;

window.openCartModal = openCartModal;

modalAddToCart.addEventListener("click", () => {
  if (!currentModalProduct) return;
  cart.push(currentModalProduct);
  updateCartCount();
  modal.close();
});

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = newsletterEmail.value.trim();
  newsletterMessage.textContent = `Subscribed: ${email}`;
  newsletterForm.reset();
});

function showAllProducts() {
  const heroSection = document.querySelector(".hero");
  const whyChooseUsSection = document.getElementById("whyChooseUs");
  const trendingSection = document.getElementById("trendingSection");
  const productsSection = document.getElementById("products");

  heroSection.classList.add("hidden");
  whyChooseUsSection.classList.add("hidden");
  trendingSection.classList.add("hidden");

  productsSection.classList.remove("hidden");

  loadProducts("all");
  productsSection.scrollIntoView({ behavior: "smooth" });
}

window.showAllProducts = showAllProducts;

function goHome() {
  const heroSection = document.querySelector(".hero");
  const productsSection = document.getElementById("products");
  const whyChooseUsSection = document.getElementById("whyChooseUs");
  const trendingSection = document.getElementById("trendingSection");
  
  heroSection.classList.remove("hidden");
  whyChooseUsSection.classList.remove("hidden");
  trendingSection.classList.remove("hidden");
  
  productsSection.classList.add("hidden");

  heroSection.scrollIntoView({ behavior: "smooth" });
}

window.goHome = goHome;async function init() {
  showLoader();

  allProducts = await fetchJSON(`${API}/products`);
  renderTrending(allProducts);
  await loadCategories();

  hideLoader();
}

init();

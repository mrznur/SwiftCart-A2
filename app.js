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
    card.className = "card bg-gradient-to-b from-white to-stone-50 shadow-lg hover:shadow-2xl transition-shadow min-h-96 w-full flex flex-col overflow-hidden rounded-xl";

    card.innerHTML = `
  <figure class="p-3 sm:p-4 flex-shrink-0">
    <img src="${prod.image}" class="h-32 sm:h-40 w-full object-contain" />
  </figure>
  <div class="px-3 sm:px-4 py-2 sm:py-3 flex-1 flex flex-col justify-between">
    <div class="flex justify-between items-center w-full gap-2">
      <span class="badge badge-primary font-semibold text-xs sm:text-sm uppercase tracking-wider">${prod.category}</span>
      <p class="flex items-center gap-1 font-medium text-xs sm:text-sm">
        <i class="fa-solid fa-star text-yellow-400"></i> 
        <span class="font-semibold">$${prod.rating.rate}</span>
        <span class="text-gray-500">(${prod.rating.count})</span>
      </p>
    </div>
    <h2 class="text-base sm:text-lg font-semibold leading-snug mt-2 text-gray-800">${shortTitle(prod.title, 35)}</h2>
    <div class="flex justify-between items-center w-full mt-2">
      <p class="font-bold text-xl sm:text-2xl text-black">$${prod.price}</p>
    </div>
    <div class="border-t border-gray-300 my-2 sm:my-3"></div>
    <div class="flex gap-2 w-full">
        <button class="btn btn-sm sm:btn-md flex-1 btn-outline font-medium text-xs sm:text-sm hover:bg-gray-200 transition-all" onclick="showDetails(${prod.id})"><i class="fa-regular fa-eye"></i> Details</button>
          <button class="btn btn-sm sm:btn-md flex-1 bg-purple-600 hover:bg-purple-700 text-white border-none font-medium text-xs sm:text-sm transition-all" onclick="addToCart(${prod.id})">
            <i class="fa-solid fa-cart-shopping"></i> Add
          </button>
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
    card.className = "card bg-gradient-to-b from-white to-stone-50 shadow-lg hover:shadow-2xl transition-shadow min-h-96 w-full flex flex-col overflow-hidden rounded-xl";

    card.innerHTML = `
      <figure class="p-3 sm:p-4 flex-shrink-0">
        <img src="${prod.image}" class="h-32 sm:h-40 w-full object-contain" />
      </figure>
      <div class="px-3 sm:px-4 py-2 sm:py-3 flex-1 flex flex-col justify-between">
        <div class="flex justify-between items-center w-full gap-2">
          <span class="badge badge-primary font-semibold text-xs sm:text-sm uppercase tracking-wider">${prod.category}</span>
          <p class="flex items-center gap-1 font-medium text-xs sm:text-sm">
            <i class="fa-solid fa-star text-yellow-400"></i> 
            <span class="font-semibold">${prod.rating.rate}</span>
            <span class="text-gray-500">(${prod.rating.count})</span>
          </p>
        </div>
        <h2 class="text-base sm:text-lg font-semibold leading-snug mt-2 text-gray-800">${shortTitle(prod.title, 40)}</h2>
        <div class="flex justify-between items-center w-full mt-2">
          <p class="font-bold text-xl sm:text-2xl text-black">$${prod.price}</p>
        </div>
        <div class="border-t border-gray-300 my-2 sm:my-3"></div>
        <div class="flex gap-2 w-full">
          <button class="btn btn-sm sm:btn-md flex-1 btn-outline font-medium text-xs sm:text-sm hover:bg-gray-200 transition-all" onclick="showDetails(${prod.id})"><i class="fa-regular fa-eye"></i> Details</button>
          <button class="btn btn-sm sm:btn-md flex-1 bg-purple-600 hover:bg-purple-700 text-white border-none font-medium text-xs sm:text-sm transition-all" onclick="addToCart(${prod.id})">
            <i class="fa-solid fa-cart-shopping"></i> Add
          </button>
        </div>
      </div>
    `;

    productEl.appendChild(card);
  });
}

let selectedCategory = "all";

function renderCategories(categories) {
  categoryEl.innerHTML = "";
  categoryEl.className = "flex flex-wrap gap-3 p-4";

  const allBtn = document.createElement("button");
  allBtn.className = "btn btn-md btn-primary text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl";
  allBtn.textContent = "All";
  allBtn.id = "cat-all";
  allBtn.onclick = () => {
    selectedCategory = "all";
    loadProducts("all");
    updateCategoryButtons();
  };
  categoryEl.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-md btn-outline text-base font-semibold shadow-md transition-all duration-300 hover:shadow-lg capitalize";
    btn.textContent = cat;
    btn.id = `cat-${cat}`;
    btn.onclick = () => {
      selectedCategory = cat;
      loadProducts(cat);
      updateCategoryButtons();
    };
    categoryEl.appendChild(btn);
  });
}

function updateCategoryButtons() {
  const buttons = categoryEl.querySelectorAll("button");
  buttons.forEach((btn) => {
    if (btn.id === `cat-${selectedCategory}` || (selectedCategory === "all" && btn.id === "cat-all")) {
      btn.classList.remove("btn-outline", "shadow-md");
      btn.classList.add("btn-primary", "bg-purple-600", "hover:bg-purple-700", "text-white", "shadow-lg","px-3");
    } else {
      btn.classList.remove("btn-primary", "bg-purple-600", "hover:bg-purple-700", "text-white", "shadow-lg");
      btn.classList.add("btn-outline", "shadow-md");
    }
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
  const product = await fetchJSON(`${API}/products/${id}`);
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

window.goHome = goHome;
async function init() {
  showLoader();

  allProducts = await fetchJSON(`${API}/products`);
  renderTrending(allProducts);
  await loadCategories();

  hideLoader();
}

init();

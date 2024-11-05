const listProductHTML = document.getElementById("product-list");
const cartContainer = document.querySelector(".cart-container h2");
const cartProductsContainer = document.getElementById("cart-products");
let listProduct = [];
let cart = {}; // Object to hold the cart items and their quantities

// Function to render products into HTML
const addToHTML = () => {
  listProductHTML.innerHTML = "";
  if (listProduct.length > 0) {
    listProduct.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("product");
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = `
        <img class="product-img" src="${product.image.desktop}" alt="${product.name}" />
        <div class="addToCartBtns">
          <button class="cart addToCart">
            <img src="assets/images/icon-add-to-cart.svg" alt="Add to cart" />
            <p>Add to cart</p>
          </button>
          <div class="addToCartQty" style="display: none;">
            <svg class="decrement-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
              <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z" />
            </svg>
            <span class="numberOfProducts">1</span>
            <svg class="increment-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 10 10">
              <path fill="currentColor" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
            </svg>
          </div>
        </div>
        <p class="category">${product.category}</p>
        <p class="productName">${product.name}</p>
        <p class="price">$${product.price}</p>`;
      listProductHTML.appendChild(newProduct);
    });
  }
};

// Function to update the cart count display
const updateCartCount = () => {
  const totalItems = Object.values(cart).reduce((total, qty) => total + qty, 0);
  cartContainer.textContent = `Your Cart (${totalItems})`;
};

// Function to update the cart display
// Function to update the cart display
// Function to update the cart display
const updateCartDisplay = () => {
  cartProductsContainer.innerHTML = ""; // Clear current cart display
  let cartTotal = 0; // Variable to hold the total cart amount

  if (Object.keys(cart).length === 0) {
    document.querySelector(".products-shown-here").style.display = "flex"; // Show empty cart message
    document.querySelector(".total").style.display = "none";
  } else {
    document.querySelector(".products-shown-here").style.display = "none"; // Hide empty cart message
    document.querySelector(".total").style.display = "block";

    // Iterate over each item in the cart
    for (let productId in cart) {
      let cartItem = document.createElement("div");
      cartItem.classList.add("cart-product");
      cartItem.dataset.id = productId;
      const productData = listProduct.find((p) => p.id == productId);

      // Calculate total for this specific item and add to cart total
      const itemTotal = productData.price * cart[productId];
      cartTotal += itemTotal;

      cartItem.innerHTML = `
        <div class="cart-prodcut-info">
          <p class="product-name-cart">${productData.name}</p>
          <div class="cart-product-sub-info">
            <span class="cart-product-amount">${cart[productId]}x</span>
            <span class="single-prodcut-price-cart">$${productData.price.toFixed(
              2
            )}</span>
            <p class="total-price-cart">$${itemTotal.toFixed(2)}</p>
          </div>
        </div>
        <button class="removeProduct" aria-label="Remove Product">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="black" viewBox="0 0 10 10">
            <path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" />
          </svg>
        </button>`;
      cartProductsContainer.appendChild(cartItem);
    }

    // Update the total amount in the predefined HTML element
    document.querySelector(".totalAmount").innerHTML = `$${cartTotal.toFixed(
      2
    )}`;
  }
};

// Event listener for "Add to Cart" button and other actions
listProductHTML.addEventListener("click", (event) => {
  if (
    event.target.classList.contains("cart") ||
    event.target.closest(".cart")
  ) {
    let productElement = event.target.closest(".product");
    let productId = productElement.dataset.id;
    const quantityElement = productElement.querySelector(".addToCartQty");
    const numberOfProducts = quantityElement.querySelector(".numberOfProducts");

    if (cart[productId]) {
      cart[productId]++;
    } else {
      cart[productId] = 1;
      quantityElement.style.display = "flex"; // Show the quantity controls
      productElement.querySelector(".addToCart").style.display = "none"; // Hide "Add to Cart" button
    }

    numberOfProducts.textContent = cart[productId];
    updateCartCount();
    updateCartDisplay();
  }

  if (
    event.target.classList.contains("increment-icon") ||
    event.target.classList.contains("decrement-icon")
  ) {
    let quantityElement = event.target.closest(".addToCartQty");
    let productElement = quantityElement.closest(".product");
    let productId = productElement.dataset.id;
    const numberOfProducts = quantityElement.querySelector(".numberOfProducts");

    if (event.target.classList.contains("increment-icon")) {
      cart[productId]++;
      numberOfProducts.textContent = cart[productId];
    } else if (event.target.classList.contains("decrement-icon")) {
      if (cart[productId] > 1) {
        cart[productId]--;
        numberOfProducts.textContent = cart[productId];
      } else {
        delete cart[productId];
        quantityElement.style.display = "none"; // Hide quantity controls
        productElement.querySelector(".addToCart").style.display = "flex"; // Show "Add to Cart" button
      }
    }
    updateCartCount();
    updateCartDisplay();
  }
});

// Remove product from cart
cartProductsContainer.addEventListener("click", (event) => {
  if (event.target.closest(".removeProduct")) {
    let cartItem = event.target.closest(".cart-product");
    let productId = cartItem.dataset.id;
    delete cart[productId];

    // Reset quantity and display for the removed product in product list
    const productElement = document.querySelector(
      `.product[data-id="${productId}"]`
    );
    if (productElement) {
      const quantityElement = productElement.querySelector(".addToCartQty");
      quantityElement.style.display = "none";
      productElement.querySelector(".addToCart").style.display = "flex";
      quantityElement.querySelector(".numberOfProducts").textContent = "1";
    }

    updateCartCount();
    updateCartDisplay();
  }
});

// Initialize app and fetch product data
const initApp = () => {
  fetch("../../assets/data/data.json")
    .then((response) => response.json())
    .then((data) => {
      listProduct = data;
      addToHTML();
      console.log(data);
    });
};
initApp();
updateCartDisplay();

// Reference to the complete order button and modal elements
const completeOrderButton = document.querySelector(".completeOrder");
const modalOverlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");

// Show modal when "Complete Order" button is clicked
completeOrderButton.addEventListener("click", () => {
  modalOverlay.style.display = "block";
  modal.style.display = "block";
  updateModalContent();
});

// Hide modal when clicking outside the modal (optional)
modalOverlay.addEventListener("click", () => {
  modalOverlay.style.display = "none";
  modal.style.display = "none";
});

// Function to update modal content with cart items and total amount
const updateModalContent = () => {
  const modalContent = modal.querySelector(".cart-prodcut-info");
  modalContent.innerHTML = "";

  let modalTotal = 0;
  for (let productId in cart) {
    const product = listProduct.find((p) => p.id == productId);
    const quantity = cart[productId];
    const productTotal = quantity * product.price;
    modalTotal += productTotal;

    modalContent.innerHTML += `
      <div class="cart-prodcut-info">
        <p class="product-name-cart">${product.name}</p>
        <div class="cart-product-sub-info-1">
          <div>
            <span class="cart-product-amount">${quantity}x</span>
            <span class="single-prodcut-price-cart">$${product.price.toFixed(
              2
            )}</span>
          </div>
          <p class="total-price-cart">$${productTotal.toFixed(2)}</p>
        </div>
      </div>
      <hr class="hr-end" />`;
  }

  modal.querySelector(".totalAmount").textContent = `$${modalTotal.toFixed(2)}`;
};

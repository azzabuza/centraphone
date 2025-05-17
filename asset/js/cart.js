function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.reverse();

  const cartItems = document.getElementById("cart-items");
  const subTotalElement = document.getElementById("cart-subtotal");
  const insuranceElement = document.getElementById("cart-insurance");
  const packingElement = document.getElementById("cart-packing");
  const adminElement = document.getElementById("cart-administration");
  const totalElement = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("cart-button");

  let subtotal = 0;
  let totalInsurance = 0;
  let totalPacking = 0;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="not-found" style="margin: 0; padding: 0;">
        <div class="product-not-found" style="margin:0 0 10px 0;">
          You have not added any products to your shopping cart.
        </div>
      </div>`;

    subTotalElement.textContent = "0";
    insuranceElement.textContent = "0";
    packingElement.textContent = "0";
    adminElement.textContent = "0";
    totalElement.textContent = "0";

    if (checkoutButton) checkoutButton.style.display = "none";
    return;
  }

  if (checkoutButton) checkoutButton.style.display = "block";

  let cartHTML = "";
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    const itemInsurance = item.price * 0.003 * item.quantity;
    const itemPacking = 6000 * item.quantity;

    subtotal += itemTotal;
    totalInsurance += itemInsurance;
    totalPacking += itemPacking;

    cartHTML += `
      <div class="cart-item">
        <div class="cart-image">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.product)}">
        </div>
        <div class="cart-info">
          <h3>${escapeHTML(item.product)}</h3>
          <div class="cart-price">
            <p class="cart-getprice">${item.price.toLocaleString("id-ID")}</p>
            <p class="cart-total">${itemTotal.toLocaleString("id-ID")}</p>
          </div>
          <div class="quantity-btn">
            <button class="cart-minus" data-product="${escapeHTML(item.product)}"><svg class="line" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="none" stroke="currentColor">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" />
</svg>
</button>
            <input type="number" class="cart-quantity" value="${item.quantity}" min="1" data-product="${escapeHTML(item.product)}">
            <button class="cart-plus" data-product="${escapeHTML(item.product)}"><svg class="line" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="none" stroke="currentColor">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" />
</svg>
</button>
            <button class="cart-delete" onclick='removeFromCart("${escapeHTML(item.product)}")'><svg class="line" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="none" stroke="currentColor">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
</svg>
</button>
          </div>
        </div>
      </div>`;
  });

  cartItems.innerHTML = cartHTML;

  document.querySelectorAll(".cart-minus").forEach((btn) =>
    btn.addEventListener("click", function () {
      updateQuantity(this.dataset.product, -1);
    })
  );
  document.querySelectorAll(".cart-plus").forEach((btn) =>
    btn.addEventListener("click", function () {
      updateQuantity(this.dataset.product, 1);
    })
  );
  document.querySelectorAll(".cart-quantity").forEach((input) =>
    input.addEventListener("input", function () {
      updateQuantity(this.dataset.product, 0, parseInt(this.value));
    })
  );

  const adminFee = 3000;
  const finalTotal = subtotal + totalInsurance + totalPacking + adminFee;

  subTotalElement.textContent = subtotal.toLocaleString("id-ID");
  insuranceElement.textContent = totalInsurance.toLocaleString("id-ID");
  packingElement.textContent = totalPacking.toLocaleString("id-ID");
  adminElement.textContent = adminFee.toLocaleString("id-ID");
  totalElement.textContent = finalTotal.toLocaleString("id-ID");

  if (typeof updateCartCount === "function") updateCartCount();
}

function updateQuantity(productName, change, newValue = null) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let item = cart.find((item) => item.product === productName);

  if (item) {
    if (newValue !== null) {
      if (newValue > 20) {
        alert(`Maximum purchase of ${productName} is only 20 items`);
        newValue = 20;
      }
      item.quantity = Math.min(20, Math.max(1, newValue));
    } else {
      const newQuantity = item.quantity + change;
      if (newQuantity > 20) {
        alert(`Maximum purchase of ${productName} is only 20 items`);
        return;
      }
      item.quantity = Math.min(20, Math.max(1, newQuantity));
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  }
}

function removeFromCart(productName) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.product !== productName);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  if (typeof updateCartCount === "function") updateCartCount();
}

document.addEventListener("DOMContentLoaded", loadCart);

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

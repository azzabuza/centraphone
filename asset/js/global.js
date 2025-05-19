// WIDGET
const header = document.getElementById("header");
const footer = document.getElementById("footer");
const mobile = document.getElementById("mobile");

fetch("../component/header.html").then(function (snap) {
  snap.text().then(function (result) {
    if (header) {
      header.innerHTML = result;
      updateCartCount();
    }
  });
});
fetch("../component/footer.html").then(function (snap) {
  snap.text().then(function (result) {
    if (footer) {
      footer.innerHTML = result;
    }
  });
});
fetch("../component/mobile.html").then(function (snap) {
  snap.text().then(function (result) {
    if (mobile) {
      mobile.innerHTML = result;
    }
  });
});

// CART COUNTER
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.querySelector("#cart-count");

  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

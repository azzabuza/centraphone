// IMG LAZY LOAD
document.addEventListener("DOMContentLoaded", function () {
  const imgOptions = {
    threshold: 0,
    rootMargin: "0px 0px 100px 0px",
  };

  const bgOptions = {
    threshold: 0,
    rootMargin: "0px 0px 100px 0px",
  };

  const imgObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.lazyLoaded !== "true") {
          const src = img.src;
          img.src = "";
          img.dataset.lazyLoaded = "true";
          img.src = src;
        }
        imgObserver.unobserve(img);
      }
    });
  }, imgOptions);

  const bgObserver = new IntersectionObserver((entries, bgObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const bgValue = window.getComputedStyle(element).background;

        if (bgValue.includes("url(") && element.dataset.lazyLoaded !== "true") {
          const imageUrl = bgValue.match(/url\(["']?(.*?)["']?\)/)[1];
          element.style.background = bgValue.replace(
            /url\(["']?.*?["']?\)/,
            `url(${imageUrl})`
          );
          element.dataset.lazyLoaded = "true";
        }
        bgObserver.unobserve(element);
      }
    });
  }, bgOptions);

  function observeImages() {
    const images = document.querySelectorAll("img:not([data-lazy-loaded])");
    images.forEach((img) => {
      if (img.complete) return;
      imgObserver.observe(img);
    });
  }

  function observeBackgrounds() {
    const elements = document.querySelectorAll("*:not([data-lazy-loaded])");
    elements.forEach((element) => {
      const bgValue = window.getComputedStyle(element).background;
      if (bgValue.includes("url(")) {
        bgObserver.observe(element);
      }
    });
  }

  observeImages();
  observeBackgrounds();

  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        observeImages();
        observeBackgrounds();
      }
    }
  };

  const mutationObserver = new MutationObserver(callback);
  mutationObserver.observe(targetNode, config);
});

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

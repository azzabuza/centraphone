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



// Fungsi untuk membuat popup
function createPopup() {
  // Cek apakah user sudah menutup popup sebelumnya
  if (localStorage.getItem('popupClosed') === 'true') {
    return;
  }

  // Buat elemen popup
  const popup = document.createElement('div');
  popup.className = 'popup-alert';
  popup.innerHTML = `
    <h2>Selamat Datang</h2>
    <p>Ini adalah proyek web yang saya buat menggunakan html, css, dan js vanilla</p>
    <button id="closePopup">Tutup, Jangan tampilkan lagi</button>
  `;

  // Buat overlay
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';

  // Tambahkan ke dokumen
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  // Fungsi untuk menutup popup
  function closePopup() {
    document.body.removeChild(popup);
    document.body.removeChild(overlay);
    localStorage.setItem('popupClosed', 'true');
  }

  // Tambahkan event listener ke tombol
  document.getElementById('closePopup').addEventListener('click', closePopup);
}

// Jalankan fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', createPopup);

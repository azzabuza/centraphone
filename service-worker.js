const CACHE_NAME = "SW-001";
const myCache = [
  "/",
  "asset/image/favicon.png",
  "asset/image/app.webp",
  "asset/image/logo.webp",
  "asset/css/global.css",
  "asset/css/responsive.css",
  "asset/js/register.js",
  "asset/js/global.js",
  "asset/js/pwa-installer.js",
  "data/manifest.json",
  "data/product.json",
  "data/shipping.json",
  "data/brand-menu.json",
  "data/category-menu.json",
  "data/slide.json",
  "config/product.js",
  "config/shopping.js",
  "config/recommendation.js",
  "config/related.js",
  "config/category.js",
  "config/search.js",
  "config/slide.js",
  "config/category-menu.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        cache.addAll(myCache);
      })
      .then(self.skipWaiting())
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request);
      });
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("[ServiceWorker] Hapus cache lama", key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

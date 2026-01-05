const CACHE_NAME = "canine-haven-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./js/app.js",
  "./js/views.js",
  "./js/utils.js",
  "./js/config.js",
  "./js/products.js",
  "./assets/login-screen.png",
  "./assets/hero-malinois.png",
  "./assets/product-placeholder.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k===CACHE_NAME ? null : caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e)=>{
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(()=>cached))
  );
});

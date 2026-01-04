const CACHE_NAME = "canine-haven-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/login-screen.png",
  "./assets/hero-malinois.png",
  "./js/app.js",
  "./js/views.js",
  "./js/utils.js",
  "./js/config.js",
  "./js/products.js"
];

self.addEventListener("install", (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=> k!==CACHE_NAME ? caches.delete(k):null))));
  self.clients.claim();
});
self.addEventListener("fetch", (e)=>{
  e.respondWith(caches.match(e.request).then(res=> res || fetch(e.request)));
});

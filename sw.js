const CACHE_NAME = "canine-haven-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",

  "./js/app.js",
  "./js/views.js",
  "./js/config.js",
  "./js/products.js",
  "./js/utils.js",

  "./manifest.webmanifest",
  "./assets/login-screen.png",
  "./assets/hero-malinois.png",
  "./icon-192.png",
  "./icon-512.png"
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

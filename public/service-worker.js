// Simple dummy service worker for PWA
self.addEventListener("install", function (e) {
  console.log("✅ Service Worker installed");
});

self.addEventListener("fetch", function (event) {
  // You can cache requests here
});

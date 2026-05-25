// sw.js — Service Worker for Agutay NHS SHS Scheduler
const CACHE = "agutay-sched-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./css/intro-panel.css",
  "./js/core.js",
  "./js/faculty.js",
  "./js/classes.js",
  "./js/rooms.js",
  "./js/subjects.js",
  "./js/assignments.js",
  "./js/schedule-gen.js",
  "./js/schedule-render.js",
  "./js/export.js",
  "./js/modal.js",
  "./js/intro-panel.js",
  "./manifest.json",
  "./img/ANHS.png",
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap",
  ,
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Cache-first for app shell; network-first for Google Fonts
  if (e.request.url.includes("fonts.g")) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request)),
  );
});

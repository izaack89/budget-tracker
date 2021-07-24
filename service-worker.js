const CACHE_NAME = "budget-tracker-cache-v1";
const DATA_CACHE_NAME = "budget-data-cache-v1";

let urlToCache = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/style.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];

self.addEventListener("install",function(evt){
    evt.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            console.log("Cache");
            return cache.addAll(urlToCache);
        })
    );
});
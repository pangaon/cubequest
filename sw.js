/* CubeQuest service worker — installable + offline (caches app shell + the 3D library) */
const CACHE = "cubequest-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./AdonisMegaminxHelper.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()).catch(()=>{}));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      return resp;
    }).catch(() => caches.match("./index.html")))
  );
});

/* 글씨 탐험대 오프라인 캐시 */
const VERSION = "gw-v3";
const DINO_NAMES = ["koreanosaurus", "protoceratops", "giganotosaurus", "dilophosaurus", "therizinosaurus", "iguanodon", "diplodocus", "carnotaurus", "mosasaurus", "allosaurus", "parasaurolophus", "pachycephalosaurus", "pteranodon", "ankylosaurus", "velociraptor", "spinosaurus", "stegosaurus", "brachiosaurus", "triceratops", "tyrannosaurus"];
const DINO_FILES = DINO_NAMES.flatMap((n, i) => ["angry", "friendly"].map(k => "images/dinos/" + String(i + 1).padStart(2, "0") + "_" + n + "_" + k + ".jpg"));
const FILES = ["./", "index.html", "manifest.webmanifest", "lib/jspdf.umd.min.js", "fonts/fonts.css", "fonts/jua.woff2", "fonts/noto-sans-kr-500.woff2", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"].concat(DINO_FILES);
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, {cache:"reload"})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch:true}).then(hit => hit || fetch(e.request).then(res => {
      if (res && res.ok && new URL(e.request.url).origin === location.origin){
        const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => e.request.mode === "navigate" ? caches.match("index.html") : undefined))
  );
});

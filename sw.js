/* 글씨 탐험대 오프라인 캐시 */
const VERSION = "gw-v4";
/* 상대 40명 그림 (index.html의 FOES와 같은 순서). 폴더별 파일 이름 앞부분 */
const FOE_IMAGES = {
  dinos: ["01_koreanosaurus", "02_protoceratops", "03_giganotosaurus", "04_dilophosaurus", "05_therizinosaurus", "06_iguanodon", "07_diplodocus", "08_carnotaurus", "09_mosasaurus", "10_allosaurus", "11_parasaurolophus", "12_pachycephalosaurus", "13_pteranodon", "14_ankylosaurus", "15_velociraptor", "16_spinosaurus", "17_stegosaurus", "18_brachiosaurus", "19_triceratops", "20_tyrannosaurus"],
  robots: ["r01_kongkongball", "r02_cosmo", "r03_pokri", "r04_guardon", "r05_bulkkeumi", "r06_syungsyungjet", "r07_burungred", "r08_mecharex", "r09_taekwonking", "r10_ultraking"],
  samguk: ["s01_zhouyu", "s02_huangzhong", "s03_machao", "s04_caocao", "s05_lvbu", "s06_liubei", "s07_zhangfei", "s08_zhugeliang", "s09_zhaozilong", "s10_guanyu"]
};
const DINO_FILES = Object.entries(FOE_IMAGES).flatMap(([dir, names]) => names.flatMap(n => ["angry", "friendly"].map(k => "images/" + dir + "/" + n + "_" + k + ".jpg")));
const FILES = ["./", "index.html", "manifest.webmanifest","fonts/fonts.css", "fonts/jua.woff2", "fonts/noto-sans-kr-500.woff2", "fonts/hakgyoansim-badasseugi-b.otf","icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"].concat(DINO_FILES);
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

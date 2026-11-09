// 동방열국지 β(베타 채널, scope /fareast/beta/) service worker — build_html.py CHANNEL=beta 가 release/web/sw.js 에서 만듦. 직접 고치지 말 것.
// 동방열국지 service worker: plays offline after the first visit.
// Bump VERSION whenever index.html changes so phones pick up the new build.
// v180(D15): 같은 출처에 베타(/fareast/beta/, 캐시 dongbang-beta-*)가 함께 있으므로 라이브 SW는 제 캐시(dongbang-v*)만 지우고 /beta/ 요청에는 손대지 않음.
const VERSION = 'v228';
const PREFIX = 'dongbang-beta-';
const CACHE = PREFIX + VERSION;
const MINE = k => k.startsWith('dongbang-beta-');
const SKIP = null;
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
const fromMine = req => caches.open(CACHE).then(c => c.match(req));
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => MINE(k) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (SKIP && url.origin === location.origin && SKIP.test(url.pathname)) return;   // 베타 채널 경로는 베타 SW 몫
  if (req.mode === 'navigate' || url.origin === location.origin) {
    // network first for the game itself (so updates arrive), cache as fallback when offline
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; })
      .catch(() => fromMine(req).then(r => r || fromMine('./index.html'))));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    // fonts: cache first
    e.respondWith(fromMine(req).then(r => r || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })));
  }
});

/* SHE Master — 오프라인 캐시(서비스 워커). https 또는 localhost로 열었을 때만 등록된다(파일로 열면 이미 로컬 파일로 동작).
   - 설치 시 index.html과, 거기서 불러오는 assets/ 파일(?v= 포함)을 모두 받아 둔다.
   - 화면(index.html)은 네트워크 우선 → 실패하면 캐시. 버전 번호가 붙은 자산은 캐시 우선.
   - Google Fonts는 받아 둔 것을 먼저 쓰고 뒤에서 갱신한다(오프라인이면 시스템 글꼴).
   index.html의 ?v= 번호를 올릴 때 VERSION도 같은 번호로 올린다(이전 캐시 정리용). */
const VERSION = 'v64';
const CACHE = 'she-master-' + VERSION;
const FONTS = 'she-master-fonts';
const CORE = ['./', './manifest.webmanifest', './assets/icons/icon.svg', './assets/icons/icon-192.png', './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png', './assets/icons/apple-touch-icon.png', './assets/img/profile.jpg'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const res = await fetch('./index.html', { cache: 'reload' });
    if (!res.ok) throw new Error('index.html ' + res.status);
    const html = await res.clone().text();
    const assets = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map((m) => './' + m[1]);
    await cache.put('./index.html', res);
    await cache.addAll([...new Set(CORE.concat(assets))]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('she-master-') && k !== CACHE && k !== FONTS).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

const isShell = (url) => url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate') {
      if (!isShell(url)) return;   /* README 등 다른 파일은 그대로 네트워크 */
      /* 브라우저 HTTP 캐시에 남은 옛 화면을 쓰지 않도록 서버에 항상 재확인(no-cache) — 바뀐 게 없으면 304로 가볍게 끝난다 */
      event.respondWith(fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); }
        return res;
      }).catch(() => caches.match('./index.html')));
      return;
    }
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok && res.type === 'basic' && url.pathname.includes('/assets/')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    })));
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(caches.open(FONTS).then((c) => c.match(req).then((hit) => {
      const net = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }).catch(() => hit || Response.error());
      return hit || net;
    })));
  }
});

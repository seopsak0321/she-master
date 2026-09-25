/* SHE Master — boot: global event delegation and first render */
(function () {
  const S = window.SHE;

  const theme = S.load('theme', null);
  if (theme) document.documentElement.setAttribute('data-theme', theme);

  document.addEventListener('click', (e) => {
    const lang = e.target.closest('[data-lang]');
    if (lang) { S.state.lang = lang.dataset.lang; S.save('lang', S.state.lang); S.refresh(); return; }

    const site = e.target.closest('[data-site]');
    if (site) { S.state.site = site.dataset.site; S.save('site', S.state.site); S.refresh(); return; }

    const tab = e.target.closest('[data-tabs]');
    if (tab) { S.save('tab.' + tab.dataset.tabs, tab.dataset.val); S.refresh(); return; }

    const guide = e.target.closest('[data-guide]');
    if (guide) { e.preventDefault(); S.guide.open(guide.dataset.guide); return; }

    if (e.target.closest('[data-profile]')) { e.preventDefault(); if (S.profile) S.profile.open(); return; }

    /* PC 버전 ↔ 모바일 버전 (휴대폰에서만 보이는 링크) */
    const view = e.target.closest('[data-view]');
    if (view) {
      S.save('view', view.dataset.view === 'pc' ? 'pc' : 'auto');
      S.applyView(); S.refresh(); window.scrollTo(0, 0);
      return;
    }

    if (e.target.closest('#themeBtn') || e.target.closest('[data-theme-toggle]')) {
      const cur = document.documentElement.getAttribute('data-theme') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      S.save('theme', next);
      return;
    }

    const nav = document.getElementById('sidenav');
    if (e.target.closest('#menuBtn') || e.target.closest('[data-open-menu]')) {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      document.getElementById('menuBtn').setAttribute('aria-expanded', String(open));
      return;
    }
    if (nav.classList.contains('open') && (e.target.closest('#sidenav a') || !e.target.closest('#sidenav'))) {
      nav.classList.remove('open');
      document.getElementById('menuBtn').setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('hashchange', () => {
    if (S.guide) S.guide.close(true);
    S.render();
    const sub = S.state.sub;
    const target = sub && document.getElementById('anchor-' + sub);
    if (target) target.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0);
    document.getElementById('view').focus({ preventScroll: true });
  });

  S.render();
  const sub = S.state.sub;
  const target = sub && document.getElementById('anchor-' + sub);
  if (target) target.scrollIntoView({ block: 'start' });

  /* 화면 폭이 바뀌어 PC·모바일 배치가 달라지면 다시 그린다 (창 크기 조절, 기기 회전) */
  const relayout = () => { const was = document.documentElement.classList.contains('m'); if (S.applyView() !== was) S.refresh(); };
  if (S.VIEW_Q.addEventListener) S.VIEW_Q.addEventListener('change', relayout); else if (S.VIEW_Q.addListener) S.VIEW_Q.addListener(relayout);

  /* 오프라인 사용(PWA) — 웹 서버(https·localhost)로 열었을 때만. 자체 점검(#qa)의 검사용 화면에서는 등록하지 않는다 */
  /* 앱 설치 정보(manifest)는 웹 서버로 열었을 때만 붙인다 — 파일로 열면 브라우저가 CORS로 막아 콘솔 오류만 남는다 */
  if (/^https?:$/.test(location.protocol) && !document.querySelector('link[rel="manifest"]')) {
    const m = document.createElement('link'); m.rel = 'manifest'; m.href = 'manifest.webmanifest'; document.head.appendChild(m);
  }
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !S.QA_FRAME) {
    const had = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (had) S.toast(S.T('포털 새 버전을 받았습니다 — 새로고침하면 적용됩니다', 'A new portal version is ready — reload to use it'));
    });
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { /* 등록 실패 시 온라인으로만 동작 */ }); });
  }
})();

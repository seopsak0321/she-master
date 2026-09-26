/* SHE Master — boot: global event delegation and first render */
(function () {
  const S = window.SHE;

  const theme = S.load('theme', null);
  if (theme) document.documentElement.setAttribute('data-theme', theme);

  document.addEventListener('click', (e) => {
    /* 지금 주소와 같은 링크(예: 이미 #home/cycles인데 다시 누름)는 주소가 바뀌지 않아 아무 일이 없다 — 해당 섹션으로 다시 이동한다 */
    const same = e.target.closest('a[href^="#"]');
    if (same && !e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      const dec = (x) => { try { return decodeURIComponent(x); } catch (err) { return x; } };
      if (dec(same.getAttribute('href')) === dec(location.hash || '#home')) {
        e.preventDefault();
        if (S.state.sub) S.render();   /* 주소의 하위 경로로 탭을 다시 맞춘다(예: 다른 탭을 보다가 #psm/tq를 다시 누름) */
        const t = S.state.sub && document.getElementById('anchor-' + S.state.sub);
        if (t) S.reveal(t); else window.scrollTo(0, 0);
        return;
      }
    }
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

    /* 글자 크기 — 가−·가+로 한 단계씩, 가운데 %를 누르면 기본(100%) */
    const fzb = e.target.closest('[data-fz]');
    if (fzb) {
      const i = S.FZ.indexOf(S.fz()), act = fzb.dataset.fz;
      const next = act === 'reset' ? 1 : S.FZ[Math.max(0, Math.min(S.FZ.length - 1, i + (act === 'up' ? 1 : -1)))];
      S.save('fz', next); S.applyFz(); S.refresh();
      const again = document.querySelector(`#${fzb.closest('#sidenav') ? 'sidenav' : 'fzCtl'} [data-fz="${act}"]`);
      if (again && !again.disabled) again.focus();
      S.toast(S.T(`글자 크기 ${Math.round(next * 1000) / 10}%`, `Text size ${Math.round(next * 1000) / 10}%`));
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

    /* 단계 표시기 — 단계 이동은 표시만 바꾸고, ‘모두 펼쳐 보기’ 전환은 다시 그린다 */
    const sg = e.target.closest('[data-step-go]');
    if (sg) {
      const [key, n] = sg.dataset.stepGo.split(':'); S.save('step.' + key, n); S.stepApply(key);
      const nav = document.querySelector(`.stepper[data-stepper="${key}"]`);
      if (nav && sg.closest('.step-nav')) S.reveal(nav);
      return;
    }
    const sa = e.target.closest('[data-step-all]');
    if (sa) { const k = sa.dataset.stepAll; S.save('step.' + k + '.all', !S.load('step.' + k + '.all', false)); S.refresh(); return; }
    /* 왼쪽 메뉴 대분류 접기·펼치기 — 화면 상태(aria-expanded)를 기준으로 뒤집고, 접은 그룹은 nav.fold에 기억 */
    const nf = e.target.closest('[data-nav-fold]');
    if (nf) {
      const k = nf.dataset.navFold, open = nf.getAttribute('aria-expanded') !== 'true';
      const g = nf.closest('.nav-group'), box = g && g.querySelector('.nav-items');
      nf.setAttribute('aria-expanded', String(open)); if (g) g.classList.toggle('folded', !open); if (box) box.hidden = !open;
      const f = S.load('nav.fold', []).filter((x) => x !== k); if (!open) f.push(k); S.save('nav.fold', f);
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
    if (target) S.reveal(target); else window.scrollTo(0, 0);
    document.getElementById('view').focus({ preventScroll: true });
  });

  S.render();
  const sub = S.state.sub;
  const target = sub && document.getElementById('anchor-' + sub);
  if (target) S.reveal(target);
  /* 상단 도구(시계·메모장·계산기·단위 환산) — 본문 밖에 한 번 만들어 페이지를 옮겨도 유지 */
  if (S.utilsInit) S.utilsInit();

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

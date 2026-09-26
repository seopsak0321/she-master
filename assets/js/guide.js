/* 이용 가이드 — 페이지 제목 옆 ‘이 페이지 가이드’ 버튼(오른쪽 서랍)과 가이드 전체 화면(#guide) */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui;
  const rn = (r) => S.routeName(r);
  const ulist = (arr) => (arr && arr.length ? `<ul class="g-list">${arr.map((x) => `<li>${x}</li>`).join('')}</ul>` : '');
  const sec = (title, inner) => (inner ? `<section class="g-sec"><h3>${title}</h3>${inner}</section>` : '');
  /* 첫 문장 — 약어(incl.·e.g.·No.·Art. 등) 뒤나 열린 괄호 안의 마침표에서는 자르지 않는다 */
  const ABBR = /\b(?:incl|e\.g|i\.e|etc|vs|No|Nos|Art|Arts|approx|cf|Fig)\.$/i;
  const firstSentence = (s) => {
    s = String(s); const re = /[.!?](?=\s|$)/g; let m;
    while ((m = re.exec(s))) {
      const head = s.slice(0, m.index + 1);
      if (ABBR.test(head) || (head.match(/\(/g) || []).length > (head.match(/\)/g) || []).length) continue;
      return head;
    }
    return s;
  };

  function subBlock(s, open, key) {
    return `<details class="g-sub" data-sub="${key}" ${open ? 'open' : ''}><summary>${L(s.t)}</summary><div class="g-sub-body">
      <p>${L(s.what)}</p>
      ${s.how ? `<ol class="g-steps sm">${L(s.how).map((x) => `<li>${x}</li>`).join('')}</ol>` : ''}
      ${s.read ? `<p class="small"><b>${T('결과 읽는 법', 'Reading the result')}</b> — ${L(s.read)}</p>` : ''}
      ${s.example ? `<p class="small">${ui.ex()} ${L(s.example)}</p>` : ''}
    </div></details>`;
  }

  /* guide content for a route — shared by the drawer and the full page */
  function body(r, opts) {
    const g = S.GUIDES[r]; if (!g) return '';
    const o = opts || {};
    const subs = Object.keys(g.subs || {});
    const cur = r === 'measure' ? S.tab('measure', 'chem') : r === 'risk' ? S.tab('risk', 'fs') : null;
    return `
      <p class="g-what">${L(g.what)}</p>
      ${sec(T('이럴 때 쓰세요', 'When to use it'), ulist(L(g.when || [])))}
      ${g.steps ? sec(T('사용 방법', 'How to use it'), `<ol class="g-steps">${L(g.steps).map((x) => `<li>${x}</li>`).join('')}</ol>`) : ''}
      ${subs.length ? sec(r === 'measure' ? T('도구별 설명', 'Each tool') : T('기법별 설명', 'Each method'),
        `${o.all ? '' : `<p class="xs muted">${T('지금 열려 있는 탭의 설명이 펼쳐져 있습니다.', 'The tab you have open is expanded.')}</p>`}${subs.map((k) => subBlock(g.subs[k], o.all || k === cur, k)).join('')}`) : ''}
      ${g.example ? sec(T('활용 예시', 'Example'), `<div class="callout small">${ui.ex()} ${L(g.example)}</div>`) : ''}
      ${g.real && g.real.length ? sec(T('실제 선례·공식 자료', 'Real-world precedents'), `<ul class="g-list">${g.real.map((x) => `<li>${L(x.t)}${S.cite(x.src)}</li>`).join('')}</ul>`) : ''}
      ${sec(T('알아둘 점', 'Good to know'), ulist(L(g.tips || [])))}
      ${g.related && g.related.length ? sec(T('함께 쓰면 좋은 기능', 'Works well with'), `<div class="row">${g.related.map((x) => `<a class="chip" href="#${x}">${S.esc(rn(x))}</a>`).join('')}</div>`) : ''}`;
  }

  /* ---------- 만든 사람 약력 (같은 서랍을 쓴다) ---------- */
  const PROFILE = '__profile';
  function profileBody() {
    const P = S.PROFILE; if (!P) return '';
    const esc = S.esc;
    const rows = (arr) => `<ul class="pf-list">${arr.map((x) => `<li><span>${esc(L(x.t))}</span><span class="pf-d">${esc(x.d)}</span></li>`).join('')}</ul>`;
    return `<div class="pf-head">
        <img class="pf-photo" src="${esc(P.photo)}" alt="${esc(T('이성호 증명사진', 'Photo of Sung-Ho Lee'))}" width="96" height="128" decoding="async">
        <div class="stack" style="gap:6px"><p class="pf-lead">${esc(L(P.lead))}</p>
          <div class="row" style="gap:6px">${L(P.interests).map((x) => `<span class="chip">${esc(x)}</span>`).join('')}</div></div>
      </div>
      ${sec(T('학력', 'Education'), rows(P.edu))}
      ${sec(T('자격', 'Qualifications'), rows(P.certs))}
      ${sec(T('어학', 'Language'), rows(P.langs))}
      ${sec(T('연구', 'Research'), rows(P.research) + `<div class="pf-paper"><b>${esc(L(P.paper.t))}</b><br><span class="small">${esc(L(P.paper.by))}</span><br><span class="small muted">${esc(L(P.paper.venue))}</span> · <a class="small" href="${esc(P.paper.url)}" target="_blank" rel="noopener">DOI ↗</a></div>`)}
      ${sec(T('경험', 'Experience'), rows(P.exp))}`;
  }

  /* ---------- drawer ---------- */
  const drawer = document.getElementById('drawer'), scrim = document.getElementById('scrim');
  let openRoute = null, lastFocus = null, hideTimer = 0;
  /* 일반 상세 보기(물질 상세 등) — 같은 서랍. 언어를 바꾸면 다시 그리도록 내용을 함수로 받는다 */
  const DETAIL = '__detail';
  let detailFn = null;
  function fill() {
    drawer.classList.toggle('profile', openRoute === PROFILE);
    if (openRoute === DETAIL) {
      const d = detailFn() || {};
      document.getElementById('drawerEyebrow').textContent = d.eyebrow || '';
      document.getElementById('drawerTitle').textContent = d.title || '';
      document.getElementById('drawerBody').innerHTML = d.body || '';
      document.getElementById('drawerFoot').innerHTML = d.foot || '';
      document.getElementById('drawerClose').setAttribute('aria-label', T('닫기', 'Close'));
      if (d.mount) d.mount(drawer);
      return;
    }
    if (openRoute === PROFILE) {
      document.getElementById('drawerEyebrow').textContent = T('만든 사람', 'About the author');
      document.getElementById('drawerTitle').textContent = L(S.AUTHOR);
      document.getElementById('drawerBody').innerHTML = profileBody();
      document.getElementById('drawerFoot').innerHTML = `<span class="xs muted">${T('이 포털은 이성호의 개인 포트폴리오이며 SK하이닉스 공식 시스템이 아닙니다.', 'This portal is Sung-Ho Lee’s personal portfolio, not an official SK hynix system.')}</span>`;
      document.getElementById('drawerClose').setAttribute('aria-label', T('약력 닫기', 'Close profile'));
      return;
    }
    document.getElementById('drawerEyebrow').textContent = T('이 페이지 가이드', 'Page guide');
    document.getElementById('drawerTitle').textContent = rn(openRoute);
    document.getElementById('drawerBody').innerHTML = body(openRoute);
    document.getElementById('drawerFoot').innerHTML = `<a href="#guide/${openRoute}">${T('전체 화면으로 보기', 'Open as a full page')} →</a><a href="#guide">${T('모든 가이드', 'All guides')}</a>`;
    document.getElementById('drawerClose').setAttribute('aria-label', T('가이드 닫기', 'Close guide'));
  }
  S.guide = {
    open(r) {
      if (r !== PROFILE && r !== DETAIL && !S.GUIDES[r]) return;
      clearTimeout(hideTimer);
      openRoute = r; lastFocus = document.activeElement;
      fill();
      drawer.hidden = false; scrim.hidden = false;
      document.documentElement.classList.add('drawer-lock');
      void drawer.offsetWidth;   /* commit the closed position first so the slide-in transition runs */
      drawer.classList.add('open');
      document.getElementById('drawerBody').scrollTop = 0;
      document.getElementById('drawerClose').focus();
    },
    close(noFocus) {
      if (!openRoute) return;
      openRoute = null;
      drawer.classList.remove('open'); scrim.hidden = true;
      document.documentElement.classList.remove('drawer-lock');
      hideTimer = setTimeout(() => {
        if (openRoute) return;
        drawer.hidden = true;
        ['drawerBody', 'drawerFoot', 'drawerTitle'].forEach((id) => { document.getElementById(id).innerHTML = ''; });   /* no stale text after a language switch */
      }, 240);
      if (!noFocus && lastFocus && document.contains(lastFocus)) lastFocus.focus();
    },
    isOpen: () => !!openRoute,
    body
  };
  S.profile = { open: () => S.guide.open(PROFILE), body: profileBody };
  /* fn() → { eyebrow, title, body, foot, mount } */
  S.detail = { open(fn) { detailFn = fn; S.guide.open(DETAIL); }, isOpen: () => openRoute === DETAIL };
  document.getElementById('drawerClose').addEventListener('click', () => S.guide.close());
  scrim.addEventListener('click', () => S.guide.close());
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); S.guide.close(); return; }
    if (e.key !== 'Tab') return;
    const f = [...drawer.querySelectorAll('a[href], button, summary')].filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openRoute) S.guide.close(); });
  /* language switch while open: redraw in the new language */
  S.after.push(() => { if (openRoute) fill(); });

  /* ---------- full page ---------- */
  function start() {
    const groups = S.NAV.map((g) => g.items.filter(([id]) => S.GUIDES[id])).flat();
    return `
      <section class="panel stack">${ui.title(T('처음 오셨다면 — 6곳 둘러보기', 'A six-stop tour for first-time visitors'), T('포트폴리오를 빠르게 보는 순서', 'A quick route through the portfolio'))}
        <ol class="tour">${S.TOUR.map((t, i) => `<li><a href="#${t.r}"><span class="no">${i + 1}</span><span class="stack" style="gap:2px"><b>${S.esc(rn(t.r))}</b><span class="small muted">${L(t.d)}</span></span></a></li>`).join('')}</ol>
      </section>
      <section class="panel stack">${ui.title(T('검색 활용법', 'Using search'), T('상단 검색창 · ‘/’ 키', 'Top search box · “/” key'))}
        <ol class="g-steps">${L(S.GUIDES.search.steps).map((x) => `<li>${x}</li>`).join('')}</ol>
      </section>
      <section class="panel stack">${ui.title(T('페이지별 가이드', 'Guides by page'), T('작은 창으로 보거나 자세히 읽기', 'Quick view or full read'))}
        <div class="guide-cards">${groups.map(([id]) => `<div class="gcard"><b>${S.esc(rn(id))}</b><p class="small muted">${firstSentence(L(S.GUIDES[id].what))}</p>
          <div class="row"><button class="btn ghost sm" type="button" data-guide="${id}">${T('작은 창으로', 'Quick view')}</button><a class="btn ghost sm" href="#guide/${id}">${T('자세히', 'Read')} →</a></div></div>`).join('')}</div>
      </section>`;
  }
  function terms() {
    const loc = S.state.lang === 'en' ? 'en' : 'ko';
    const list = S.GLOSSARY.slice().sort((a, b) => L(a.t).localeCompare(L(b.t), loc));
    const both = (o) => (o == null ? '' : typeof o === 'string' ? o : [].concat(o.ko || '', o.en || '').join(' '));
    return `<section class="panel stack">${ui.title(T('용어 사전', 'Glossary'), T('법령·기준에서 온 정의는 출처 번호를 달았습니다', 'Definitions from law or standards carry a source number'))}
      ${S.listbar({ id: 'terms', ph: T('용어 찾기 — 예: IDLH, 도급, 밀폐공간', 'Find a term — e.g. IDLH, subcontracting, confined space'), total: list.length })}
      <dl class="glossary">${list.map((t) => `<div class="term" id="term-${t.id}" data-li="${S.esc(both(t.t))}"><dt>${S.esc(L(t.t))}</dt><dd>${L(t.d)}${S.cite(t.src || [])}${t.link ? ` <a class="xs" href="#${t.link}">${T('관련 화면', 'Related page')} →</a>` : ''}</dd></div>`).join('')}</dl>
      <p class="lb-empty" data-lb-empty hidden>${T('찾는 용어가 없습니다. 포털 전체 검색(‘/’ 키)도 써 보세요.', 'No matching term. Try the portal-wide search (“/” key).')}</p>
    </section>`;
  }
  function one(r) {
    return `<section class="panel stack guide-one">
      <div class="row" style="justify-content:space-between;align-items:flex-start"><div class="stack" style="gap:2px"><span class="eyebrow">${T('가이드', 'Guide')}</span><h2 style="font-size:calc(22px * var(--fz))">${S.esc(rn(r))}</h2></div>
        <a class="btn ghost sm" href="#${r === 'search' ? 'search' : r}">${T('이 페이지 열기', 'Open this page')} →</a></div>
      ${body(r, { all: true })}
    </section>`;
  }

  S.pages.guide = {
    render(sub) {
      const cur = sub === 'terms' || (sub && S.GUIDES[sub]) ? sub : 'start';
      const groups = S.NAV.map((g) => ({ g: g.g, ic: g.ic, items: g.items.filter(([id]) => S.GUIDES[id]) })).filter((x) => x.items.length);
      const opts = [['start', T('시작하기', 'Getting started')]].concat(groups.flatMap((x) => x.items.map(([id, l]) => [id, L(l)])), [['search', T('검색', 'Search')], ['terms', T('용어 사전', 'Glossary')]]);
      /* 지금 보고 있는 항목은 링크 없이 표시만 한다 (눌러도 변화 없는 링크 방지) */
      const link = (id, label) => (cur === id ? `<a aria-current="page">${S.esc(label)}</a>` : `<a href="${id === 'start' ? '#guide' : '#guide/' + id}">${S.esc(label)}</a>`);
      return `
      ${ui.head(T('도움말', 'Help'), T('이용 가이드', 'User guide'),
        T('각 기능이 무엇이고 어떻게 쓰는지 설명합니다.', 'What each feature is and how to use it.'),
        T('현장 활용 예시도 함께 싣습니다. 각 페이지 제목 옆 ‘이 페이지 가이드’ 버튼을 누르면 같은 내용을 작은 창으로 볼 수 있습니다.', 'Field examples are included. The “Page guide” button next to each page title shows the same content in a side panel.'))}
      <div class="guide-layout">
        <nav class="guide-toc" aria-label="${T('가이드 목차', 'Guide contents')}">
          <div>${link('start', T('시작하기', 'Getting started'))}</div>
          ${groups.map(({ g, ic, items }) => `<div><h4>${S.navIcon(ic)}${L(g)}</h4>${items.map(([id, l]) => link(id, L(l))).join('')}</div>`).join('')}
          <div><h4>${T('도움말', 'Help')}</h4>${link('search', T('검색', 'Search'))}${link('terms', T('용어 사전', 'Glossary'))}</div>
        </nav>
        <div class="guide-main stack">
          <label class="guide-sel field"><span class="lbl">${T('가이드 선택', 'Choose a guide')}</span><select id="guideSel">${opts.map(([id, l]) => `<option value="${id}" ${cur === id ? 'selected' : ''}>${S.esc(l)}</option>`).join('')}</select></label>
          ${cur === 'start' ? start() : cur === 'terms' ? terms() : one(cur)}
        </div>
      </div>`;
    },
    mount(root, sub) {
      const s = root.querySelector('#guideSel');
      if (s) s.addEventListener('change', () => { location.hash = s.value === 'start' ? '#guide' : '#guide/' + s.value; });
      if (sub === 'terms') {
        /* 검색 결과로 용어를 찾아온 경우 필터를 비워 그 용어가 가려지지 않게 */
        if (S.state.jump) S.save('lb.terms', {});
        S.listFilter(root, 'terms');
      }
    }
  };
})();

/* 포털 전체 검색 — 상단 검색창(추천 결과), 검색 결과 화면(#search/검색어), 결과로 이동 후 강조
   색인: 각 페이지를 실제로 그려서(탭·사업장별 포함) 제목이 있는 패널을 섹션으로 모으고,
   SOP·사고사례·물질·자료실·출처·동향·가이드·용어는 데이터에서 직접 항목을 만든다. */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui;

  const KIND = {
    page: { ko: '페이지', en: 'Page' }, tool: { ko: '도구', en: 'Tool' }, sec: { ko: '섹션', en: 'Section' }, sop: { ko: 'SOP', en: 'SOP' },
    case: { ko: '사고사례', en: 'Incident' }, chem: { ko: '물질', en: 'Substance' }, res: { ko: '자료실', en: 'Library' },
    news: { ko: '동향', en: 'Update' }, src: { ko: '출처', en: 'Source' }, guide: { ko: '가이드', en: 'Guide' }, term: { ko: '용어', en: 'Term' }
  };
  const ORDER = ['page', 'tool', 'guide', 'sop', 'case', 'chem', 'res', 'term', 'news', 'sec', 'src'];
  const BOOST = { page: 12, tool: 6, guide: 3, sop: 5, case: 5, chem: 5, res: 4, term: 3, news: 1, sec: 0, src: 0 };
  const SUGGEST = () => S.T(['불소', '밀폐공간', '도급승인', 'PSM', 'TMAH', '작업허가서', 'IDLH', '경보 설정값', '특별관리물질', 'LOTO', '접근한계거리', 'X선'],
    ['fluorine', 'confined space', 'subcontract approval', 'PSM', 'TMAH', 'permit', 'IDLH', 'alarm set point', 'specially controlled', 'LOTO', 'approach limit', 'X-ray']);

  /* ---------- text helpers ---------- */
  const SUBD = '₀₁₂₃₄₅₆₇₈₉';
  /* lower-case and turn subscript digits into plain digits (NF₃ → nf3); keeps string length for highlighting */
  const lite = (s) => String(s == null ? '' : s).toLowerCase().replace(/[₀-₉]/g, (d) => String(SUBD.indexOf(d)));
  const norm = (s) => lite(s).replace(/\s+/g, ' ').trim();
  const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  const flat = (x) => (x == null ? '' : Array.isArray(x) ? x.join(' ') : String(x));
  const both = (o) => (o == null ? '' : typeof o === 'string' ? o : [flat(o.ko), flat(o.en)].join(' '));
  const tokens = (q) => norm(q).split(' ').filter(Boolean).slice(0, 6);

  function ranges(low, tks) {
    const r = [];
    tks.forEach((t) => { if (!t) return; let i = 0; while ((i = low.indexOf(t, i)) >= 0) { r.push([i, i + t.length]); i += t.length; } });
    r.sort((a, b) => a[0] - b[0]);
    const out = [];
    r.forEach(([a, b]) => { const last = out[out.length - 1]; if (last && a <= last[1]) last[1] = Math.max(last[1], b); else out.push([a, b]); });
    return out;
  }
  /* escape and wrap matches in <mark> */
  function markText(raw, tks) {
    raw = String(raw == null ? '' : raw);
    const rg = tks && tks.length ? ranges(lite(raw), tks) : [];
    let out = '', p = 0;
    rg.forEach(([a, b]) => { out += S.esc(raw.slice(p, a)) + '<mark>' + S.esc(raw.slice(a, b)) + '</mark>'; p = b; });
    return out + S.esc(raw.slice(p));
  }
  S.markText = markText;
  function snippet(e, tks, n) {
    const raw = e.text; if (!raw) return '';
    const low = lite(raw);
    let i = -1; for (const t of tks) { i = low.indexOf(t); if (i >= 0) break; }
    const len = n || 150, start = Math.max(0, (i < 0 ? 0 : i) - Math.round(len / 3));
    /* 잘린 쪽 끝에 칸 구분자(·)가 걸리면 떼어 낸다 — ‘…· 화기작업’처럼 보이지 않게 */
    const cutL = start > 0, cutR = start + len < raw.length;
    let s = raw.slice(start, start + len);
    if (cutL) s = s.replace(/^[\s·]+/, '');
    if (cutR) s = s.replace(/[\s·]+$/, '');
    return (cutL ? '…' : '') + markText(s, tks) + (cutR ? '…' : '');
  }

  /* ---------- index ---------- */
  let cache = null, dirty = true;
  const save0 = S.save, drop0 = S.drop;
  S.save = function (k, v) { save0(k, v); if (!/^(tab\.|lb\.|search\.|res\.st|theme|lang|site)/.test(k)) dirty = true; };
  S.drop = function (k) { drop0(k); dirty = true; };

  const CUSTOM = { sop: 1, cases: 1, hazards: 1, sources: 1, news: 1, resources: 1, guide: 1 };
  const TABKEY = { measure: 'measure', risk: 'risk', fire: 'scen', gas: 'gas', bench: 'bench', psm: 'psm' };
  const VARIANTS = { sites: ['common', 'icheon', 'cheongju'] };
  const FILTERS = {};
  /* text of an element with a space between separate text pieces (textContent would glue labels together).
     Pieces from different blocks (table cells, list items, paragraphs) get a “ · ” between them, so a step name and its
     description (“분해” + “분해·잔류물 처리”) do not read as a repeated word in the result snippet */
  const BLOCK = /^(P|LI|TD|TH|DIV|H[1-6]|DT|DD|TR|SECTION|ARTICLE|FIGCAPTION|LABEL|SUMMARY)$/;
  const txt = (el) => {
    if (!el) return '';
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), parts = []; let n, prev = null;
    const blockOf = (t) => { for (let p = t.parentElement; p && p !== el; p = p.parentElement) if (BLOCK.test(p.tagName)) return p; return el; };
    while ((n = w.nextNode())) {
      const v = n.nodeValue; if (!v.trim()) continue;
      const b = blockOf(n);
      if (parts.length && b !== prev && !/[.:;!?·—–,→]\s*$/.test(parts[parts.length - 1]) && !/^\s*[.,:;)\]·—–→]/.test(v)) parts.push('·');
      parts.push(v); prev = b;
    }
    return clean(parts.join(' ')).replace(/([^·]) ([,.)\]:;!?])/g, '$1$2').replace(/([([]) /g, '$1');
  };
  const strip = (box) => { box.querySelectorAll('script,style,svg,select,textarea,button,input,.src,.ex-flag,.sr,.tabs').forEach((e) => e.remove()); return box; };
  const draw = (r) => { const box = document.createElement('div'); box.innerHTML = S.pages[r].render(''); return box; };

  function build() {
    const items = [], seen = new Set();
    const add = (e) => {
      e.title = clean(e.title); e.text = clean(e.text);
      if (!e.title) return;
      const key = e.k + '|' + e.href + '|' + e.title + '|' + e.text.slice(0, 80);
      if (seen.has(key)) return; seen.add(key);
      e.h = norm(e.title + ' ' + e.text + ' ' + (e.alt || '')); e.hn = e.h.replace(/ /g, '');
      e.tn = norm(e.title); e.tnn = e.tn.replace(/ /g, '');
      e.an = e.at ? norm(e.at) : '';   /* the title in the other language counts as a title match too */
      items.push(e);
    };
    const keep = S.state.site;
    S.state.indexing = true;
    try { indexPages(add); indexData(add); } catch (err) { console.error('search index', err); }
    finally { S.state.indexing = false; S._tabOv = null; S.state.site = keep; }
    cache = { lang: S.state.lang, items }; dirty = false;
  }

  function indexPages(add) {
    S.NAV.forEach((g) => g.items.forEach(([r]) => {
      if (!S.pages[r]) return;
      (VARIANTS[r] || [null]).forEach((site, vi) => {
        S.state.site = site || 'common';
        S._tabOv = Object.assign({}, FILTERS);
        const box = draw(r);
        if (vi === 0) {
          const head = box.querySelector('.page-head');
          add({ k: 'page', title: S.routeName(r), crumb: txt(head && head.querySelector('.eyebrow')), href: '#' + r, text: txt(head && head.querySelector('.lead')), alt: r });
        }
        if (CUSTOM[r]) return;
        const tk = TABKEY[r];
        const tabs = tk ? [...box.querySelectorAll(`[data-tabs="${tk}"]`)].map((b) => [b.dataset.val, clean(b.textContent)]) : [[null, '']];
        tabs.forEach(([v, label]) => {
          let b2 = box;
          if (tk) {
            S._tabOv = Object.assign({}, FILTERS, { [tk]: v }); b2 = draw(r);
            /* the tab's own content = whatever follows the tab bar; the panel that holds the tab bar is covered by this entry */
            const bar = b2.querySelector(`[data-tabs="${tk}"]`); const tabsEl = bar && bar.closest('.tabs');
            if (tabsEl) {
              for (let n = tabsEl.nextElementSibling; n; n = n.nextElementSibling) if (!n.hasAttribute('data-shared')) n.setAttribute('data-pane', '1');
              const host = tabsEl.parentElement.closest('.panel'); if (host) host.setAttribute('data-hostpanel', '1');
            }
          }
          strip(b2);
          const siteLabel = site && site !== 'common' ? L(S.SITES[site].name) : '';
          const crumb = S.routeName(r) + (label ? ' › ' + label : '') + (siteLabel ? ' › ' + siteLabel : '');
          const go = {}; if (tk) go.tab = [tk, v]; if (site) go.site = site;
          if (tk) add({ k: 'tool', title: label, crumb: S.routeName(r), href: '#' + r, go: Object.assign({}, go, { pane: tk }), text: [...b2.querySelectorAll('[data-pane]')].map(txt).join(' ').slice(0, 5000) });
          b2.querySelectorAll('.panel, .card5').forEach((p) => {
            if (p.parentElement && p.parentElement.closest('.panel, .card5')) return;
            if (p.hasAttribute('data-hostpanel')) return;
            const h = p.querySelector('h2, h3') || p.querySelector('.k');
            if (!h) return;
            const title = txt(h), body = txt(p);
            if (!title || body.length < 16) return;
            add({ k: 'sec', title, crumb, href: '#' + r, go: Object.assign({}, go, { jump: title }), text: body.slice(0, 4000) });
          });
        });
      });
    }));
  }

  function indexData(add) {
    const rn = S.routeName;
    S.SOPS.forEach((s) => add({ k: 'sop', title: L(s.t), crumb: rn('sop') + ' · ' + L(s.area), href: '#sop/' + s.id,
      text: [L(s.hz).join(' · '), s.steps.map((st) => [L(st.s), L(st.h), L(st.c)].join(' · ')).join(' · '), L(s.stop).join(' · '), L(s.emer).join(' · '), s.legal.map(L).join(' · '), L(s.card.do).join(' · '), L(s.card.dont).join(' · ')].join(' · '),
      alt: both(s.t) + ' ' + s.id + ' ' + s.kosha.join(' '), at: both(s.t) }));
    S.CASES.concat(S.load('cases.user', [])).forEach((c) => add({ k: 'case', title: L(c.t), crumb: rn('cases') + ' · ' + (L(c.dateLabel) || c.date), href: '#cases/' + c.id,
      text: [L(c.impact), (c.facts || []).map((f) => L(f.t)).join(' '), (c.officialFindings || []).map((f) => L(f.t)).join(' '), (c.why || []).map((w) => L(w.t)).join(' '), (c.actions || []).map((a) => L(a.t)).join(' '), L(c.lesson)].join(' '),
      alt: both(c.t), at: both(c.t) }));
    add({ k: 'sec', title: T('업계 공통 지적 사항 자가점검', 'Self-check against industry findings'), crumb: rn('cases'), href: '#cases/selfcheck',
      text: S.MOEL_FINDINGS.map((f) => L(f.t) + ' (' + L(f.where) + ')').join(' '), alt: S.MOEL_FINDINGS.map((f) => both(f.t)).join(' ') });
    S.TIMELINE.filter((x) => !x.caseId).forEach((x) => add({ k: 'news', title: L(x.t), crumb: rn('cases') + ' · ' + T('사고 타임라인', 'Incident timeline') + ' · ' + x.date, href: '#cases/timeline', alt: both(x.t) }));
    S.CHEMICALS.forEach((c) => add({ k: 'chem', title: `${L(c)} (${c.f})`, crumb: rn('hazards') + ' · CAS ' + c.cas, href: '#hazards/' + c.id,
      text: `TWA ${c.twa ?? '–'} · STEL ${c.stel ?? '–'} · C ${c.c ?? '–'} ${c.unit} · IDLH ${c.idlh ?? '–'} · ${L(S.CHEM_CATS[c.cat])} ${L(c.note) || ''} ${L(c.icsc) || ''}`,
      alt: both(c) + ' ' + c.f + ' ' + c.cas + ' ' + c.id, at: both(c) + ' ' + c.f }));
    S.PROCESSES.forEach((p) => add({ k: 'sec', title: L(p), crumb: rn('hazards') + ' › ' + T('공정 단계', 'Process steps'), href: '#hazards/' + p.id,
      text: L(p.d) + ' ' + L(p.hz).join(' '), alt: both(p) }));
    S.RESOURCES.forEach((x) => add({ k: 'res', title: L(x.name), crumb: rn('resources') + ' · ' + L(x.org), href: '#resources/' + x.id,
      text: L(x.desc).join(' ') + ' · ' + L(S.RES_TYPES[x.type]) + ' · ' + x.subj.map((s) => L(S.RES_SUBJECTS[s])).join(', ') + ' · ' + x.url, alt: both(x.name) + ' ' + both(x.org), at: both(x.name) }));
    S.SOURCES.forEach((s, i) => add({ k: 'src', title: L(s.title), crumb: rn('sources') + ' · [' + (i + 1) + ']', href: '#sources/' + s.id, text: L(s.note) || '', alt: both(s.title) }));
    S.NEWS.forEach((x) => add({ k: 'news', title: L(x.t), crumb: rn('news') + ' · ' + x.date, href: '#news', go: { save: { 'lb.news': {} } }, alt: both(x.t) }));
    Object.keys(S.GUIDES).forEach((r) => {
      const g = S.GUIDES[r];
      add({ k: 'guide', title: T('가이드 · ', 'Guide · ') + rn(r), crumb: rn('guide'), href: '#guide/' + r,
        text: [L(g.what), flat(L(g.when)), flat(L(g.steps)), L(g.example), (g.real || []).map((x) => L(x.t)).join(' '), flat(L(g.tips))].join(' '), alt: both(g.what) });
      Object.keys(g.subs || {}).forEach((k) => { const s = g.subs[k];
        add({ k: 'guide', title: T('가이드 · ', 'Guide · ') + rn(r) + ' › ' + L(s.t), crumb: rn('guide'), href: '#guide/' + r, go: { jump: L(s.t) },
          text: [L(s.what), flat(L(s.how)), L(s.read), L(s.example)].join(' '), alt: both(s.t) }); });
    });
    S.GLOSSARY.forEach((t) => add({ k: 'term', title: L(t.t), crumb: rn('guide') + ' · ' + T('용어 사전', 'Glossary'), href: '#guide/terms', go: { jump: L(t.t) }, text: L(t.d), alt: both(t.t), at: both(t.t) }));
  }

  function run(q) {
    if (!cache || cache.lang !== S.state.lang || dirty) build();
    const tks = tokens(q); if (!tks.length) return [];
    const full = norm(q), fulln = full.replace(/ /g, '');
    const out = [];
    for (const e of cache.items) {
      let sc = 0, ok = true;
      for (const t of tks) {
        if (e.tn.includes(t) || e.tnn.includes(t)) sc += 10;
        else if (e.an && e.an.includes(t)) sc += 8;
        else if (e.h.includes(t) || e.hn.includes(t)) sc += 2;
        else { ok = false; break; }
      }
      if (!ok) { if (tks.length > 1 && e.hn.includes(fulln)) sc = 6; else continue; }
      if (e.tn === full) sc += 20; else if (e.tn.startsWith(full)) sc += 12; else if (e.tnn.includes(fulln)) sc += 6;
      sc += BOOST[e.k] || 0;
      out.push([sc, e]);
    }
    out.sort((a, b) => b[0] - a[0] || ORDER.indexOf(a[1].k) - ORDER.indexOf(b[1].k));
    return out.map((x) => x[1]);
  }

  /* ---------- open a result: apply its state, navigate, then scroll to and highlight the match ---------- */
  function remember(q) {
    q = clean(q); if (!q) return;
    const list = S.load('search.recent', []).filter((x) => x !== q); list.unshift(q); S.save('search.recent', list.slice(0, 8));
  }
  function open(e, q) {
    remember(q);
    const go = e.go || {};
    if (go.save) Object.keys(go.save).forEach((k) => S.save(k, go.save[k]));
    if (go.tab) S.save('tab.' + go.tab[0], go.tab[1]);
    if (go.site && go.site !== S.state.site) { S.state.site = go.site; S.save('site', go.site); }
    S.state.jump = { title: go.jump || '', pane: go.pane || '', terms: tokens(q || '') };
    closePop(); input.blur(); closeMobile();
    if (location.hash === e.href || decodeURIComponent(location.hash) === e.href) { S.render(); window.scrollTo(0, 0); } else location.hash = e.href;
  }

  function markLive(root, tks) {
    if (!root || !tks.length) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.nodeValue.trim() && !n.parentElement.closest('script,style,textarea,select,option,mark,svg,.src,button') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
    const nodes = []; let n; while ((n = walker.nextNode())) nodes.push(n);
    let count = 0;
    for (const node of nodes) {
      if (count >= 40) break;
      const raw = node.nodeValue, rg = ranges(lite(raw), tks);
      if (!rg.length) continue;
      const frag = document.createDocumentFragment(); let p = 0;
      rg.forEach(([a, b]) => { if (a > p) frag.appendChild(document.createTextNode(raw.slice(p, a))); const m = document.createElement('mark'); m.className = 'hit'; m.textContent = raw.slice(a, b); frag.appendChild(m); p = b; count++; });
      if (p < raw.length) frag.appendChild(document.createTextNode(raw.slice(p)));
      node.parentNode.replaceChild(frag, node);
    }
    return count;
  }
  /* scroll so the element sits just under the sticky top bar */
  const scrollToEl = (el) => { const bar = document.querySelector('.topbar'); const top = el.getBoundingClientRect().top + window.scrollY - ((bar ? bar.offsetHeight : 0) + 12); window.scrollTo(0, Math.max(0, top)); };
  S.after.push(function () {
    const j = S.state.jump; if (!j) return;
    S.state.jump = null;
    setTimeout(() => {
      const view = document.getElementById('view'); if (!view) return;
      let region = null, anchor = null;
      if (j.title) {
        const ns = (s) => norm(s).replace(/ /g, ''), want = ns(j.title);   /* compare without spaces */
        const hs = [...view.querySelectorAll('h1, h2, h3, .k, summary, dt, b')];
        const h = hs.find((x) => ns(x.textContent) === want) || hs.find((x) => ns(x.textContent).startsWith(want));
        if (h) { region = h.closest('.term, .res, details, .panel, .card5, section') || h; anchor = region; }
      }
      if (!region && j.pane) {   /* a tool/tab result: show the tab bar and flash the tab's content */
        const sel = view.querySelector(`[data-tabs="${j.pane}"][aria-selected="true"]`);
        const tabsEl = sel && sel.closest('.tabs');
        if (tabsEl) { region = tabsEl.nextElementSibling || tabsEl; anchor = tabsEl; }
      }
      if (!region) region = view.querySelector('#sop-detail, #case-detail, .res.hl');
      if (region) {
        if (region.tagName === 'DETAILS') region.open = true;
        S.reveal(region, true);   /* 접힌 곳 안이면 펼친다 */
        if (anchor) scrollToEl(anchor);
        region.classList.add('flash'); setTimeout(() => region.classList.remove('flash'), 2400);
      }
      markLive(region || view, j.terms);
      /* 찾은 글자가 ‘근거·참고’ 같은 접기 안에만 있으면 펼쳐서 보이게 한다 */
      const hit = (region || view).querySelector('mark.hit');
      if (hit && hit.closest('details:not([open])')) S.reveal(hit, true);
    }, 60);
  });

  /* ---------- top-bar search box ---------- */
  const box = document.getElementById('search'), input = document.getElementById('q'), pop = document.getElementById('qPop'),
    list = document.getElementById('qList'), foot = document.getElementById('qFoot'), toggle = document.getElementById('searchToggle'),
    topbar = document.querySelector('.topbar');
  let shown = [], active = -1, timer = 0;

  function openPop() { pop.hidden = false; input.setAttribute('aria-expanded', 'true'); }
  function closePop() { pop.hidden = true; input.setAttribute('aria-expanded', 'false'); active = -1; input.removeAttribute('aria-activedescendant'); }
  function closeMobile() { topbar.classList.remove('search-open'); toggle.setAttribute('aria-expanded', 'false'); }
  function setActive(i) {
    const lis = list.querySelectorAll('li[role="option"]');
    active = Math.max(-1, Math.min(i, lis.length - 1));
    lis.forEach((li, k) => li.setAttribute('aria-selected', String(k === active)));
    if (active >= 0) { input.setAttribute('aria-activedescendant', lis[active].id); lis[active].scrollIntoView({ block: 'nearest' }); } else input.removeAttribute('aria-activedescendant');
  }
  function update() {
    const q = input.value.trim();
    shown = []; active = -1;
    if (!q) {
      const recent = S.load('search.recent', []);
      list.innerHTML = `${recent.length ? `<li class="q-head">${T('최근 검색', 'Recent searches')}</li><li class="q-chips">${recent.map((x) => `<button type="button" class="chip" data-qs="${S.esc(x)}">${S.esc(x)}</button>`).join('')}</li>` : ''}
        <li class="q-head">${T('추천 검색어', 'Try')}</li><li class="q-chips">${SUGGEST().map((x) => `<button type="button" class="chip" data-qs="${S.esc(x)}">${S.esc(x)}</button>`).join('')}</li>`;
      foot.innerHTML = `<span class="xs muted">${T('‘/’ 키로 어디서든 검색 · 페이지·SOP·사고사례·물질·자료실·가이드·용어', 'Press “/” anywhere · pages, SOPs, incidents, substances, library, guides, terms')}</span>`;
      openPop(); return;
    }
    const res = run(q), tks = tokens(q);
    shown = res.slice(0, 8);
    list.innerHTML = shown.length ? shown.map((e, i) => `<li role="option" id="qo-${i}" aria-selected="false"><a href="${S.esc(e.href)}" data-qi="${i}" tabindex="-1">
        <span class="qk">${L(KIND[e.k])}</span><span class="qt">${markText(e.title, tks)}</span>${e.crumb ? `<span class="qc">${S.esc(e.crumb)}</span>` : ''}${e.text ? `<span class="qs">${snippet(e, tks, 110)}</span>` : ''}</a></li>`).join('')
      : `<li class="q-empty">${T('일치하는 결과가 없습니다. 다른 단어나 영문 약어로 찾아보세요.', 'No matches. Try other words or an abbreviation.')}</li>`;
    foot.innerHTML = `<a href="#search/${encodeURIComponent(q)}" data-qall>${res.length ? T(`‘${S.esc(q)}’ 전체 결과 ${res.length}건 보기`, `See all ${res.length} results for “${S.esc(q)}”`) : T('검색 결과 화면 열기', 'Open the results page')}</a><span class="xs muted">${T('↑↓ 이동 · Enter 열기 · Esc 닫기', '↑↓ move · Enter open · Esc close')}</span>`;
    openPop();
  }

  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(update, 90); });
  input.addEventListener('focus', update);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (pop.hidden) update(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const q = input.value.trim();
      if (active >= 0 && shown[active]) open(shown[active], q);
      else if (q) { remember(q); S.state.srn = 20; S.save('tab.srk', 'all'); closePop(); input.blur(); closeMobile(); location.hash = '#search/' + encodeURIComponent(q); }
    } else if (e.key === 'Escape') { e.preventDefault(); if (!pop.hidden) closePop(); else { input.blur(); closeMobile(); } }
  });
  list.addEventListener('mousedown', (e) => { if (e.target.closest('a, button')) e.preventDefault(); });   /* keep focus in the box */
  list.addEventListener('click', (e) => {
    const a = e.target.closest('[data-qi]');
    if (a) { e.preventDefault(); open(shown[Number(a.dataset.qi)], input.value); return; }
    const c = e.target.closest('[data-qs]');
    if (c) { e.preventDefault(); input.value = c.dataset.qs; update(); input.focus(); }
  });
  foot.addEventListener('click', (e) => { if (e.target.closest('[data-qall]')) { remember(input.value); S.state.srn = 20; S.save('tab.srk', 'all'); closePop(); closeMobile(); input.blur(); } });
  document.addEventListener('mousedown', (e) => { if (!pop.hidden && !box.contains(e.target)) closePop(); });
  toggle.addEventListener('click', () => {
    const openNow = !topbar.classList.contains('search-open');
    topbar.classList.toggle('search-open', openNow); toggle.setAttribute('aria-expanded', String(openNow));
    if (openNow) { input.focus(); update(); } else closePop();
  });
  document.addEventListener('keydown', (e) => {
    const tg = e.target, tag = (tg.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || tg.isContentEditable;
    const slash = e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey;
    const ctrlK = (e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K');
    if (!slash && !ctrlK) return;
    if (S.guide && S.guide.isOpen()) return;
    e.preventDefault();
    if (getComputedStyle(box).display === 'none') { topbar.classList.add('search-open'); toggle.setAttribute('aria-expanded', 'true'); }
    input.focus(); input.select(); update();   /* show suggestions even if no focus event fires */
  });
  window.addEventListener('hashchange', closePop);

  /* ---------- results page ---------- */
  function startBlock() {
    const recent = S.load('search.recent', []);
    return `<section class="panel stack">${ui.title(T('이렇게 찾아보세요', 'Search tips'))}
        <ol class="g-steps">${L(S.GUIDES.search.steps).map((x) => `<li>${x}</li>`).join('')}</ol></section>
      <section class="grid g2">
        <div class="panel stack">${ui.title(T('추천 검색어', 'Try these'))}<div class="row">${SUGGEST().map((x) => `<a class="chip" href="#search/${encodeURIComponent(x)}">${S.esc(x)}</a>`).join('')}</div></div>
        <div class="panel stack">${ui.title(T('최근 검색', 'Recent searches'))}${recent.length ? `<div class="row">${recent.map((x) => `<a class="chip" href="#search/${encodeURIComponent(x)}">${S.esc(x)}</a>`).join('')}</div><div><button class="btn ghost sm" type="button" id="srClear">${T('기록 지우기', 'Clear history')}</button></div>` : `<p class="small muted">${T('아직 검색 기록이 없습니다.', 'No searches yet.')}</p>`}</div>
      </section>`;
  }
  const kindList = (q, res) => { const k0 = S.tab('srk', 'all'); return k0 === 'all' || !res.some((e) => e.k === k0) ? res : res.filter((e) => e.k === k0); };

  S.pages.search = {
    render(sub) {
      const q = clean(sub);
      const res = q ? run(q) : [];
      const counts = {}; res.forEach((e) => { counts[e.k] = (counts[e.k] || 0) + 1; });
      const k0 = S.tab('srk', 'all'), kind = k0 !== 'all' && counts[k0] ? k0 : 'all';
      const items = kindList(q, res), n = S.state.srn || 20, tks = tokens(q);
      return `
      ${ui.head(T('검색', 'Search'), q ? T(`‘${S.esc(q)}’ 검색 결과`, `Results for “${S.esc(q)}”`) : T('포털 검색', 'Search the portal'),
        T('페이지·섹션·SOP·사고사례·물질·자료실·동향·출처·가이드·용어를 한 번에 찾습니다.', 'Pages, sections, SOPs, incidents, substances, library items, updates, sources, guides and terms in one search.'))}
      <form class="search-big" id="sForm" role="search"><input type="search" id="sq" value="${S.esc(q)}" placeholder="${T('검색어를 입력하세요', 'Enter a search term')}" aria-label="${T('검색어', 'Search term')}" autocomplete="off"><button class="btn" type="submit">${T('검색', 'Search')}</button></form>
      ${q ? `${ui.tabs('srk', [{ id: 'all', label: T(`전체 ${res.length}`, `All ${res.length}`) }].concat(ORDER.filter((k) => counts[k]).map((k) => ({ id: k, label: `${L(KIND[k])} ${counts[k]}` }))), kind)}
        <section class="sr-list" aria-live="polite">${items.slice(0, n).map((e, i) => `<article class="sr">
            <div class="row small"><span class="chip">${L(KIND[e.k])}</span><span class="muted">${S.esc(e.crumb || '')}</span></div>
            <h3><a href="${S.esc(e.href)}" data-sr="${i}">${markText(e.title, tks)}</a></h3>
            ${e.text ? `<p class="small">${snippet(e, tks, 220)}</p>` : ''}</article>`).join('') || `<div class="callout small">${T('일치하는 결과가 없습니다. 띄어쓰기를 바꾸거나 영문 약어·화학식으로 찾아보세요.', 'No matches. Try different spacing, an abbreviation or a chemical formula.')}</div>`}</section>
        ${items.length > n ? `<div><button class="btn ghost" type="button" id="srMore">${T(`더 보기 (${items.length - n}건 남음)`, `Show more (${items.length - n} left)`)}</button></div>` : ''}` : startBlock()}`;
    },
    mount(root, sub) {
      const q = clean(sub);
      root.querySelector('#sForm').addEventListener('submit', (e) => {
        e.preventDefault(); const v = root.querySelector('#sq').value.trim(); if (!v) return;
        remember(v); S.state.srn = 20; S.save('tab.srk', 'all'); location.hash = '#search/' + encodeURIComponent(v);
      });
      if (!q && !S.state.refreshing) setTimeout(() => { const el = root.querySelector('#sq'); if (el) el.focus(); }, 0);
      const items = q ? kindList(q, run(q)) : [];
      root.querySelectorAll('[data-sr]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); open(items[Number(a.dataset.sr)], q); }));
      const more = root.querySelector('#srMore'); if (more) more.addEventListener('click', () => { S.state.srn = (S.state.srn || 20) + 20; S.refresh(); });
      const clr = root.querySelector('#srClear'); if (clr) clr.addEventListener('click', () => { S.drop('search.recent'); S.refresh(); });
    }
  };

  S.search = { run, open, tokens, build: () => { dirty = true; build(); return cache.items.length; } };
})();

/* SHE Master — core runtime (state, i18n, storage, citations, UI helpers, router) */
(function () {
  const S = window.SHE = window.SHE || {};

  /* ---------- storage (per-browser convenience only) ---------- */
  /* 자체 점검(#qa)이 여는 검사용 화면(?qa=1)은 별도 이름공간 ‘sheqa.’를 써서 사용자의 입력값을 건드리지 않는다 */
  S.QA_FRAME = /[?&]qa=1(?:&|$)/.test(location.search);
  S.NS = S.QA_FRAME ? 'sheqa.' : 'she.';
  S.load = function (k, d) {
    try { const v = localStorage.getItem(S.NS + k); const p = v == null ? null : JSON.parse(v); return p == null ? d : p; } catch (e) { return d; }
  };
  S.save = function (k, v) {
    try { localStorage.setItem(S.NS + k, JSON.stringify(v)); } catch (e) { /* storage blocked: keep working in memory */ }
  };
  S.drop = function (k) {
    try { localStorage.removeItem(S.NS + k); } catch (e) { /* storage blocked */ }
  };

  S.state = { lang: S.load('lang', 'ko'), site: S.load('site', 'common'), route: 'home', sub: '' };

  /* ---------- 모바일 버전 ----------
     휴대폰(화면 가로 760px 이하, 또는 터치 화면의 짧은 변 500px 이하)으로 열면 <html class="m">이 붙어 모바일 전용 배치가 된다.
     PC 배치는 그대로이고, 휴대폰에서 ‘PC 버전으로 보기’를 고르면 가로 1200px 기준의 PC 화면을 보여 준다(설정 ‘view’). */
  const DEVICE_VP = 'width=device-width, initial-scale=1, viewport-fit=cover';
  S.VIEW_Q = window.matchMedia('(max-width: 760px)');
  S.isPhone = () => S.VIEW_Q.matches || (window.matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) <= 500);
  S.viewPref = () => (S.QA_FRAME ? 'auto' : S.load('view', 'auto'));
  S.viewMode = () => { const p = S.viewPref(); return p === 'pc' ? 'pc' : p === 'm' ? 'm' : (S.isPhone() ? 'm' : 'pc'); };
  S.applyView = function () {
    const m = S.viewMode() === 'm';
    document.documentElement.classList.toggle('m', m);
    const vp = document.querySelector('meta[name="viewport"]');
    const want = S.viewPref() === 'pc' && S.isPhone() ? 'width=1200' : DEVICE_VP;
    if (vp && vp.getAttribute('content') !== want) vp.setAttribute('content', want);
    return m;
  };
  S.applyView();

  /* ---------- 글자 크기 ----------
     지금 크기를 100%로 두고 5단계(85·92.5·100·115·130%)로 줄이고 키운다. 글자만 비례해서 바뀌고 배치는 그대로다(인쇄 양식은 고정).
     설정 ‘fz’. 자체 점검(#qa)의 검사용 화면은 주소의 fz= 값으로 크기를 정해 가장 큰 글자에서도 넘침을 확인한다 */
  S.FZ = [0.85, 0.925, 1, 1.15, 1.3];
  S.fz = () => {
    const q = S.QA_FRAME ? Number(new URLSearchParams(location.search).get('fz')) : NaN;
    const v = S.QA_FRAME ? (S.FZ.includes(q) ? q : 1) : Number(S.load('fz', 1));
    return S.FZ.includes(v) ? v : 1;
  };
  S.applyFz = function () { document.documentElement.style.setProperty('--fz', String(S.fz())); };
  S.applyFz();
  /* 가− · 100% · 가+ 버튼 (상단 막대와 휴대폰 메뉴에 같은 모양) */
  S.fzCtl = function () {
    const i = S.FZ.indexOf(S.fz());
    return `<div class="fz-ctl" role="group" aria-label="${S.T('글자 크기', 'Text size')}">
      <button type="button" data-fz="dn" ${i <= 0 ? 'disabled' : ''} aria-label="${S.T('글자 작게', 'Smaller text')}" title="${S.T('글자 작게', 'Smaller text')}">${S.T('가', 'A')}<span aria-hidden="true">−</span></button>
      <button type="button" data-fz="reset" class="fz-val" aria-label="${S.T(`글자 크기 ${Math.round(S.fz() * 1000) / 10}% — 누르면 기본(100%)으로`, `Text size ${Math.round(S.fz() * 1000) / 10}% — click to reset to 100%`)}" title="${S.T('기본 크기로', 'Reset to default')}">${Math.round(S.fz() * 1000) / 10}%</button>
      <button type="button" data-fz="up" ${i >= S.FZ.length - 1 ? 'disabled' : ''} aria-label="${S.T('글자 크게', 'Larger text')}" title="${S.T('글자 크게', 'Larger text')}">${S.T('가', 'A')}<span aria-hidden="true">+</span></button>
    </div>`;
  };

  /* ---------- i18n ---------- */
  S.T = (ko, en) => (S.state.lang === 'en' ? en : ko);
  S.L = (o) => {
    if (o == null) return '';
    if (typeof o === 'string' || typeof o === 'number') return String(o);
    if (Array.isArray(o)) return o;
    const v = o[S.state.lang];
    return v == null ? (o.ko == null ? '' : o.ko) : v;
  };
  S.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- numbers & dates ---------- */
  S.fmt = (n, d) => {
    if (n == null || n === '' || isNaN(n)) return '–';
    const v = Number(n);
    if (d == null) d = Math.abs(v) >= 100 ? 0 : Math.abs(v) >= 10 ? 1 : Math.abs(v) >= 1 ? 2 : 3;
    return v.toLocaleString(S.state.lang === 'en' ? 'en-US' : 'ko-KR', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  };
  S.today = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
  S.iso = (d) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); };
  S.addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  S.daysBetween = (a, b) => Math.round((b - a) / 86400000);
  S.dateLabel = (d) => d.toLocaleDateString(S.state.lang === 'en' ? 'en-GB' : 'ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });

  /* ---------- citations ---------- */
  S.srcIndex = (id) => S.SOURCES.findIndex((s) => s.id === id) + 1;
  S.cite = function () {
    const ids = [].concat.apply([], arguments).filter(Boolean);
    return ids.map((id) => {
      const i = S.srcIndex(id);
      if (!i) return '';
      const s = S.SOURCES[i - 1];
      return `<a class="src" href="#sources/${id}" title="${S.esc(S.L(s.title))}">[${i}]</a>`;
    }).join('');
  };

  /* ---------- small UI helpers ---------- */
  S.ui = {
    /* 머리말은 한 문장(lead). 덧붙일 설명은 more로 넘기면 ‘자세히’ 아래에 접혀 들어간다 */
    head(eyebrow, title, lead, more) {
      const r = S.state.route;
      const guide = !S.state.indexing && r !== 'guide' && S.GUIDES && S.GUIDES[r];
      return `<header class="page-head"><div class="head-top"><div class="eyebrow">${eyebrow}</div>${guide ? `<button type="button" class="guide-btn" data-guide="${r}" aria-haspopup="dialog">${S.ICON_HELP}${S.T('이 페이지 가이드', 'Page guide')}</button>` : ''}</div><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${more ? `<details class="more"><summary>${S.T('자세히', 'More')}</summary><div class="more-body">${/^\s*</.test(more) ? more : `<p>${more}</p>`}</div></details>` : ''}</header>`;
    },
    /* 근거·해설처럼 일부만 필요한 내용 — 접어 둔다 */
    fine(inner, label) { return `<details class="fine"><summary>${label || S.T('근거·참고', 'Notes & sources')}</summary><div class="fine-body">${inner}</div></details>`; },
    title(t, sub) { return `<div class="section-title"><h2>${t}</h2>${sub ? `<span class="sub">${sub}</span>` : ''}</div>`; },
    pill(level, text) { return `<span class="pill ${level}">${text}</span>`; },
    ex() { return `<span class="ex-flag">${S.T('예시', 'Example')}</span>`; },
    tabs(key, items, current) {
      return `<div class="tabs" role="tablist">${items.map((it) =>
        `<button type="button" role="tab" data-tabs="${key}" data-val="${it.id}" aria-selected="${it.id === current}">${it.label}</button>`).join('')}</div>`;
    },
    basis(b) {
      if (!b) return '';
      if (b.startsWith('law:')) return `<span class="basis law" title="${S.T('법령 조문 근거', 'Statutory basis')}">${S.T('법', 'Law')} ${S.esc(S.lawRef(b))}</span>`;
      if (b.startsWith('kosha:')) return `<span class="basis kosha" title="${S.T('KOSHA GUIDE 기술지침 조항', 'KOSHA GUIDE clause')}">KOSHA ${S.esc(S.lawRef(b))}</span>`;
      if (b === 'guide') return `<span class="basis" title="${S.T('공개 지침의 일반 원칙', 'General principle from public guidance')}">${S.T('지침', 'Guide')}</span>`;
      return `<span class="basis" title="${S.T('업계 일반 관행', 'Common industry practice')}">${S.T('관행', 'Practice')}</span>`;
    }
  };
  /* the search index renders pages with fixed tabs through S._tabOv, without touching saved choices */
  S.tab = (key, def) => { const ov = S._tabOv && S._tabOv[key]; return ov != null ? ov : S.load('tab.' + key, def); };
  S.ICON_HELP = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.7 9.4a2.4 2.4 0 1 1 3.5 2.1c-.8.4-1.2.9-1.2 1.8v.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16.9" r="1.1" fill="currentColor"/></svg>';
  /* 'law:한국어|English' or 'kosha:…' → the label for the current language ('law:619②' has no translation and is shown as is) */
  S.lawRef = (b) => { const [ko, en] = b.slice(b.indexOf(':') + 1).split('|'); return S.T(ko, en || ko); };
  /* a basis tag as plain text (print, CSV) */
  S.basisText = (b) => (!b ? '' : b.startsWith('law:') ? S.T('법', 'Law') + ' ' + S.lawRef(b) : b.startsWith('kosha:') ? 'KOSHA ' + S.lawRef(b) : b === 'guide' ? S.T('지침', 'Guide') : S.T('관행', 'Practice'));
  /* statutory status chips for a substance (SHE.REG / c.rg in data/standards.js) and its ICSC / KOSHA MSDS links */
  S.regChips = (c) => {
    const rg = (c && c.rg) || '';
    const chips = 'pwsmx'.split('').filter((k) => rg.includes(k)).map((k) => `<span class="chip reg" title="${S.esc(S.L(S.REG[k].t))}">${S.esc(S.L(S.REG[k]))}</span>`).join(' ');
    return (chips || `<span class="chip muted" title="${S.esc(S.T('시행규칙 별표21·22, 안전보건규칙 별표12, 시행령 제88조 어디에도 해당하지 않음', 'Not in Rule Annexes 21–22, Standards Rules Annex 12 or Decree Art. 88'))}">${S.T('법정 관리 목록 외', 'Not on statutory lists')}</span>`)
      + (c && c.rgc ? ` <span class="xs muted">${S.esc(S.L(c.rgc))}</span>` : '');
  };
  S.chemLinks = (c) => {
    const ic = S.icscUrl ? S.icscUrl(c, S.state.lang) : '', ms = S.msdsUrl ? S.msdsUrl(c) : '';
    return [ic ? `<a href="${ic}" target="_blank" rel="noopener noreferrer">ICSC ${S.esc(c.ic)}</a>` : '', ms ? `<a href="${ms}" target="_blank" rel="noopener noreferrer">${S.T('KOSHA MSDS', 'KOSHA MSDS')}</a>` : ''].filter(Boolean).join(' · ');
  };
  /* KOSHA GUIDE: current number, title, official PDF link and former numbers (SHE.KOSHA in data/sop.js). Old numbers resolve to the current guide */
  S.koshaInfo = (code) => { const K = S.KOSHA || {}; const id = K[code] ? code : (S.KOSHA_OLD || {})[code]; return id ? Object.assign({ id }, K[id]) : null; };
  S.koshaUrl = (k) => (k && k.f ? `https://portal.kosha.or.kr/openapi/v1/file/down/${k.f}/${k.s || 1}` : '');
  S.koshaTitle = (k) => (!k ? '' : S.L(k) + (k.old ? ' — ' + S.T('구 ', 'formerly ') + [].concat(k.old).join(', ') : ''));
  S.koshaTag = (code) => {
    const k = S.koshaInfo(code);
    if (!k) return `<span class="chip">KOSHA ${S.esc(code)}</span>`;
    const u = S.koshaUrl(k), t = S.esc(S.koshaTitle(k));
    return u ? `<a class="chip kosha" href="${u}" target="_blank" rel="noopener noreferrer" title="${t}">${S.esc(k.id)}</a>` : `<span class="chip" title="${t}">${S.esc(k.id)}</span>`;
  };
  /* Korean item letters (가·나·다…) as a, b, c… for English citations */
  S.rowEn = (r) => ({ 가: 'a', 나: 'b', 다: 'c', 라: 'd', 마: 'e', 바: 'f', 사: 'g', 아: 'h' }[r] || r);

  S.toast = function (msg) {
    const el = document.createElement('div');
    el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  };

  /* save a generated file (CSV, JSON backup, calendar) through the browser's download */
  S.download = function (filename, text, type) {
    const blob = new Blob([text], { type: type || 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  S.csv = function (rows, filename) {
    const body = rows.map((r) => r.map((c) => '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"').join(',')).join('\r\n');
    S.download(filename, '﻿' + body, 'text/csv;charset=utf-8');
    S.toast(S.T('CSV 파일을 내보냈습니다', 'CSV exported'));
  };

  /* which saved keys are the user's own work (as opposed to screen preferences) — used by backup and the dashboard reminder */
  S.PREF_KEYS = /^(lang|site|theme|view|fz|tab\..*|lb\..*|res\.st|sop\.sel|cases\.sel|hz\.q|hz\.rg|search\.recent|backup\.last|ptw\.cur|trn\.ref)$/;

  /* ---------- 늘어나는 목록의 공통 도구막대: 검색 + 분류 칩(건수) + ‘n / 전체’ ----------
     S.listbar({ id, ph, facets: [{ key, label, opts: [{ id, label, n }] }] })을 목록 위에 두고, mount에서 S.listFilter(root, id)를 부른다.
     목록 항목에는 data-li(검색에 더할 글자, 예: 영문명·CAS)와 data-f-<key>="값 값"을 단다. 다시 그리지 않고 즉시 거르며 고른 값은 lb.<id>에 기억한다 */
  const SUBD = '₀₁₂₃₄₅₆₇₈₉';
  S.norm = (s) => String(s == null ? '' : s).toLowerCase().replace(/[₀-₉]/g, (d) => String(SUBD.indexOf(d))).replace(/\s+/g, ' ').trim();
  S.ICON_SEARCH = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  S.lbState = (id) => { const v = S.load('lb.' + id, null); return v && typeof v === 'object' ? v : {}; };
  S.listbar = function (cfg) {
    const st = S.lbState(cfg.id);
    return `<div class="listbar" data-lb="${cfg.id}">
      <div class="lb-top"><label class="lb-search">${S.ICON_SEARCH}<input type="search" data-lb-q value="${S.esc(st.q || '')}" placeholder="${S.esc(cfg.ph)}" aria-label="${S.esc(cfg.ph)}" autocomplete="off" spellcheck="false" enterkeyhint="search"></label>
        <span class="lb-count" data-lb-count aria-live="polite"></span></div>
      ${(cfg.facets || []).map((f) => { const cur = st[f.key] || 'all'; return `<div class="lb-facet" role="group" aria-label="${S.esc(f.label)}"><span class="lbl">${f.label}</span>${[{ id: 'all', label: S.T('전체', 'All'), n: cfg.total }].concat(f.opts).map((o) =>
        `<button type="button" class="fchip" data-lb-f="${f.key}" data-val="${o.id}" aria-pressed="${o.id === cur}">${o.label}${o.n != null ? ` <span class="num">${o.n}</span>` : ''}</button>`).join('')}</div>`; }).join('')}
    </div>`;
  };
  S.listFilter = function (root, id, opts) {
    const bar = root.querySelector(`[data-lb="${id}"]`); if (!bar) return;
    const o = opts || {};
    const scope = o.scope ? root.querySelector(o.scope) : root;
    const items = [...scope.querySelectorAll('[data-li]')];
    const st = S.lbState(id);
    const input = bar.querySelector('[data-lb-q]'), count = bar.querySelector('[data-lb-count]'), empty = scope.querySelector('[data-lb-empty]');
    const keys = [...new Set([...bar.querySelectorAll('[data-lb-f]')].map((b) => b.dataset.lbF))];
    keys.forEach((k) => { if (st[k] && st[k] !== 'all' && !bar.querySelector(`[data-lb-f="${k}"][data-val="${st[k]}"]`)) st[k] = 'all'; });
    /* 화면을 저장된 선택과 맞춘다 (mount에서 선택을 비운 경우 등) */
    input.value = st.q || '';
    bar.querySelectorAll('[data-lb-f]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.val === (st[b.dataset.lbF] || 'all'))));
    const apply = () => {
      const tks = S.norm(st.q).split(' ').filter(Boolean);
      let n = 0;
      items.forEach((el) => {
        if (el._h == null) { el._h = S.norm(el.dataset.li + ' ' + el.textContent); el._hn = el._h.replace(/ /g, ''); }
        let ok = tks.every((t) => el._h.includes(t) || el._hn.includes(t));
        keys.forEach((k) => { const v = st[k]; if (ok && v && v !== 'all') ok = (el.getAttribute('data-f-' + k) || '').split(' ').includes(v); });
        el.hidden = !ok; if (ok) n++;
      });
      count.textContent = `${n} / ${items.length}`;
      if (empty) empty.hidden = n > 0;
      if (o.after) o.after(n);
    };
    let t = 0;
    input.addEventListener('input', () => { st.q = input.value; clearTimeout(t); t = setTimeout(() => { apply(); S.save('lb.' + id, st); }, 80); });
    bar.querySelectorAll('[data-lb-f]').forEach((b) => b.addEventListener('click', () => {
      st[b.dataset.lbF] = b.dataset.val;
      bar.querySelectorAll(`[data-lb-f="${b.dataset.lbF}"]`).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      apply(); S.save('lb.' + id, st);
    }));
    apply();
  };

  /* 접힌 곳(<details>) 안의 요소로 갈 때: 감싼 접기를 모두 펼치고, 상단 막대 아래로 스크롤 */
  S.reveal = function (el, noScroll) {
    if (!el) return;
    for (let d = el.closest('details'); d; d = d.parentElement && d.parentElement.closest('details')) d.open = true;
    if (noScroll) return;
    const bar = document.querySelector('.topbar');
    const top = el.getBoundingClientRect().top + window.scrollY - ((bar ? bar.offsetHeight : 0) + 12);
    window.scrollTo(0, Math.max(0, top));
  };
  S.storedKeys = function () {
    const out = [];
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(S.NS)) out.push(k.slice(S.NS.length)); } } catch (e) { /* storage blocked */ }
    return out.sort();
  };
  S.userKeys = () => S.storedKeys().filter((k) => !S.PREF_KEYS.test(k));

  /* SK하이닉스 뉴스룸 공식 사진 (data/company.js의 SHE.PHOTOS) — 원본 비율 그대로, 사진마다 출처·원문 링크 */
  S.photo = function (k) {
    const p = (S.PHOTOS || {})[k]; if (!p) return '';
    return `<figure class="photo"><img src="${p.f}" width="${p.w}" height="${p.h}" alt="${S.esc(S.L(p.t))}" loading="lazy" decoding="async"><figcaption>${S.esc(S.L(p.t))} · ${S.T('사진', 'Photo')}: <a href="${p.url}" target="_blank" rel="noopener noreferrer">${S.T('SK하이닉스 뉴스룸', 'SK hynix Newsroom')}</a> (${p.d})${S.cite('nrGuide')}</figcaption></figure>`;
  };

  /* printable documents open at #print/<doc>/<id> */
  S.ICON_PRINT = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  S.printLink = (path, label) => `<a class="btn ghost sm print-link" href="#print/${path}">${S.ICON_PRINT}${label || S.T('인쇄', 'Print')}</a>`;

  /* ---------- pages & navigation ---------- */
  S.pages = {};
  S.after = [];   /* functions run after every render (search jump, guide drawer) */
  S.NAV = [
    { g: { ko: '업무', en: 'Workspace' }, items: [
      ['home', { ko: '안전관리자 업무판', en: 'SHE manager dashboard' }],
      ['training', { ko: '교육 이수 관리', en: 'Training records' }],
      ['guide', { ko: '이용 가이드', en: 'User guide' }],
      ['data', { ko: '데이터 백업·복원', en: 'Backup & restore' }] ] },
    { g: { ko: '6대 직무', en: 'Six SHE functions' }, items: [
      ['psm', { ko: '공정안전 (PSM)', en: 'Process safety (PSM)' }],
      ['prevent', { ko: '예방안전', en: 'Preventive safety' }],
      ['sdx', { ko: 'SDX', en: 'SDX' }],
      ['partner', { ko: '상생협력', en: 'Contractor partnership' }],
      ['fire', { ko: '소방·방재', en: 'Fire & emergency' }],
      ['culture', { ko: '안전문화', en: 'Safety culture' }] ] },
    { g: { ko: '사고 학습', en: 'Learning from incidents' }, items: [
      ['cases', { ko: '사고사례 분석·재발방지', en: 'Incident analysis & prevention' }],
      ['news', { ko: '최신 안전 동향', en: 'Latest safety updates' }] ] },
    { g: { ko: '판정·평가 도구', en: 'Tools' }, items: [
      ['measure', { ko: '수치 판정', en: 'Measurement check' }],
      ['risk', { ko: '위험성평가 워크벤치', en: 'Risk assessment workbench' }],
      ['ptw', { ko: '작업허가서 작성기', en: 'Permit-to-work builder' }],
      ['gas', { ko: '가스 안전 도구', en: 'Gas safety tools' }],
      ['ppe', { ko: '호흡보호구 선정', en: 'Respirator selection' }] ] },
    { g: { ko: '라이브러리', en: 'Library' }, items: [
      ['sop', { ko: 'SOP·작업 안전', en: 'SOPs & job safety' }],
      ['hazards', { ko: '공정·물질 위험', en: 'Process & chemical hazards' }],
      ['resources', { ko: '안전 정보 자료실', en: 'Resource library' }] ] },
    { g: { ko: '회사·근거', en: 'Company & evidence' }, items: [
      ['company', { ko: 'SK하이닉스 이해', en: 'Understanding SK hynix' }],
      ['sites', { ko: '사업장 (공통·이천·청주)', en: 'Sites (company-wide, Icheon, Cheongju)' }],
      ['bench', { ko: '벤치마킹', en: 'Benchmarks' }],
      ['sources', { ko: '출처·검증', en: 'Sources & verification' }] ] }
  ];
  /* page name in the current language (pages outside the menu fall back to a fixed label) */
  S.routeName = function (r) {
    for (const g of S.NAV) for (const [id, l] of g.items) if (id === r) return S.L(l);
    return { search: S.T('검색', 'Search'), print: S.T('인쇄 미리보기', 'Print preview'), qa: S.T('포털 자체 점검', 'Portal self-check') }[r] || r;
  };

  S.renderShell = function () {
    document.documentElement.lang = S.state.lang;
    document.getElementById('brandSub').textContent = S.T('반도체 사업장 안전관리 통합 포털', 'Integrated SHE portal for semiconductor fabs');
    const q = document.getElementById('q');
    if (q) { q.placeholder = S.T('포털 검색 — 예: 불소, 밀폐공간', 'Search — e.g. fluorine, confined space'); q.setAttribute('aria-label', S.T('포털 전체 검색', 'Search the whole portal')); }
    const labels = [['menuBtn', '메뉴 열기', 'Open menu'], ['themeBtn', '밝은·어두운 테마 전환', 'Toggle light/dark theme'], ['searchToggle', '검색 열기', 'Open search'], ['sidenav', '주 메뉴', 'Main menu'], ['langSeg', '언어', 'Language'], ['qList', '검색 추천 결과', 'Search suggestions'], ['drawerClose', '가이드 닫기', 'Close guide']];
    labels.forEach(([id, ko, en]) => { const el = document.getElementById(id); if (el) el.setAttribute('aria-label', S.T(ko, en)); });
    /* 만든 사람 이름 — 누르면 약력 서랍이 열린다 (페이지 이동 없음) */
    const who = () => `<button type="button" class="author-link" data-profile aria-haspopup="dialog" title="${S.T('약력 보기', 'View profile')}">${S.L(S.AUTHOR)}</button>`;
    const mobile = document.documentElement.classList.contains('m');
    /* 휴대폰에서 PC 버전·모바일 버전을 오가는 링크 (넓은 화면의 PC에서는 보이지 않는다) */
    const viewLink = () => (!S.isPhone() ? '' : mobile
      ? `<button type="button" class="view-link" data-view="pc">${S.T('PC 버전으로 보기', 'View PC version')}</button>`
      : `<button type="button" class="view-link" data-view="m">${S.T('모바일 버전으로 보기', 'View mobile version')}</button>`);
    document.getElementById('notice').innerHTML = mobile
      ? S.T(`<b>개인 포트폴리오</b>(제작 ${who()}) · SK하이닉스 공식 시스템 아님 · <b>예시</b>는 가상 데이터`,
        `<b>Personal portfolio</b> (by ${who()}) · not an official SK hynix system · <b>Example</b> = fictional`)
      : S.T(
        `<b>개인 포트폴리오</b>(제작 ${who()}) · SK하이닉스 공식 시스템이 아닙니다. 회사 정보는 공개자료(지속가능경영보고서·뉴스룸)만 사용했고, 수치 기준은 법령 원문으로 확인했습니다. <b>예시</b> 표시는 가상 데이터입니다.`,
        `<b>Personal portfolio</b> (by ${who()}) · not an official SK hynix system. Company facts come only from public sources (sustainability reports, newsroom); thresholds were checked against the original statutes. Items marked <b>Example</b> are fictional.`) + (S.isPhone() ? ` ${viewLink()}` : '');
    const sites = [['common', S.T('공통', 'All')], ['icheon', S.T('이천', 'Icheon')], ['cheongju', S.T('청주', 'Cheongju')]];
    const siteBtns = sites.map(([id, l]) => `<button type="button" data-site="${id}" aria-pressed="${S.state.site === id}">${l}</button>`).join('');
    document.getElementById('siteSeg').innerHTML = siteBtns;
    document.getElementById('siteSeg').setAttribute('aria-label', S.T('사업장', 'Site'));
    document.querySelectorAll('#langSeg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === S.state.lang)));
    /* 모바일에서는 사업장·언어·테마를 메뉴 맨 위로 옮긴다 (PC 화면에서는 숨김) */
    const prefs = `<div class="m-prefs" aria-label="${S.T('화면 설정', 'Display settings')}">
      <div class="seg" role="group" aria-label="${S.T('사업장', 'Site')}">${siteBtns}</div>
      <div class="row" style="gap:8px"><div class="seg" role="group" aria-label="${S.T('언어', 'Language')}">${['ko', 'en'].map((l) => `<button type="button" data-lang="${l}" aria-pressed="${S.state.lang === l}">${l.toUpperCase()}</button>`).join('')}</div>
      <button type="button" class="btn ghost sm" data-theme-toggle>${S.T('밝게·어둡게', 'Light / dark')}</button></div>
      <div class="row" style="gap:8px"><span class="lbl">${S.T('글자 크기', 'Text size')}</span>${S.fzCtl()}</div>
      ${S.isPhone() ? `<div>${viewLink()}</div>` : ''}</div>`;
    const fzBox = document.getElementById('fzCtl'); if (fzBox) fzBox.innerHTML = S.fzCtl();
    document.getElementById('sidenav').innerHTML = prefs + S.NAV.map((grp) => `<div class="nav-group"><h4>${S.L(grp.g)}</h4>${grp.items.map(([id, l]) =>
      `<a href="#${id}" data-route="${id}" ${S.state.route === id ? 'aria-current="page"' : ''}>${S.L(l)}</a>`).join('')}</div>`).join('');
    /* 모바일 아래 탭 막대 — 현장에서 자주 여는 네 곳과 전체 메뉴 */
    let bar = document.getElementById('mTabbar');
    if (!bar) { bar = document.createElement('nav'); bar.id = 'mTabbar'; bar.className = 'm-tabbar'; document.body.appendChild(bar); }
    const ICON = {
      home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
      measure: '<path d="M5 19V9M10 19V5M15 19v-7M20 19v-4"/>',
      sop: '<path d="M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6"/>',
      ptw: '<path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h3"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
    };
    const icon = (k) => `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">${ICON[k]}</svg>`;
    const tab = (r, ko, en) => `<a href="#${r}" ${S.state.route === r ? 'aria-current="page"' : ''}>${icon(r)}<span>${S.T(ko, en)}</span></a>`;
    bar.setAttribute('aria-label', S.T('주요 메뉴', 'Main shortcuts'));
    bar.innerHTML = tab('home', '업무판', 'Home') + tab('measure', '수치 판정', 'Checks') + tab('sop', 'SOP', 'SOPs') + tab('ptw', '작업허가', 'Permits')
      + `<button type="button" data-open-menu aria-controls="sidenav">${icon('menu')}<span>${S.T('전체 메뉴', 'Menu')}</span></button>`;
    document.getElementById('footer').innerHTML = S.T(
      `<div class="credit"><span class="brand-mark" aria-hidden="true"><i></i><i></i></span><span><b>© 2026 ${who()}</b> · 이 포털은 ${who()}가 직접 기획하고 자료를 조사해 디자인·개발한 개인 포트폴리오입니다. <span class="xs muted">(이름을 누르면 약력이 열립니다)</span></span></div>
       <div>법령·동향 기준일 ${S.LAW_ASOF} · 실제 업무 적용 전 최신 법령과 사내 기준을 반드시 확인하세요. <a href="#sources">출처·검증 방법 보기</a> · <a href="#sources/lawcheck">법령 변경 점검</a> · <a href="#guide">이용 가이드</a></div>`,
      `<div class="credit"><span class="brand-mark" aria-hidden="true"><i></i><i></i></span><span><b>© 2026 ${who()}</b> · A personal portfolio planned, researched, designed and built by ${who()}. <span class="xs muted">(click the name for a short profile)</span></span></div>
       <div>Law and news as of ${S.LAW_ASOF} · always confirm current law and company rules before real use. <a href="#sources">See sources & method</a> · <a href="#sources/lawcheck">Law-change check</a> · <a href="#guide">User guide</a></div>`)
      + (S.isPhone() ? `<div class="view-row">${viewLink()}</div>` : '');
  };

  /* 모바일에서 머리글이 있는 표는 한 줄씩 카드로 보여 준다 — 칸마다 머리글을 data-label로 붙여 두고 CSS(html.m)가 배치를 바꾼다.
     입력 표(table.edit)·인쇄 양식·머리글 없는 표는 그대로 두고 가로로 넘겨 본다 */
  S.after.push(() => {
    const mobile = document.documentElement.classList.contains('m');
    document.querySelectorAll('#view table.data').forEach((t) => {
      if (t.closest('.doc') || t.classList.contains('edit') || t.dataset.cards === 'no') return;
      const heads = [...t.querySelectorAll('thead th')].map((th) => th.textContent.trim());
      if (!heads.length) return;
      t.classList.add('cards');
      t.querySelectorAll('tbody tr').forEach((tr) => {
        let i = 0;
        [...tr.children].forEach((cell) => {
          const span = Number(cell.getAttribute('colspan')) || 1;
          if (!cell.hasAttribute('data-label')) cell.setAttribute('data-label', span >= heads.length ? '' : (heads[i] || ''));
          /* 모바일에서만: 칸 내용을 하나로 묶어 ‘머리글 | 내용’ 두 칸 배치가 깨지지 않게 한다 (입력칸의 이벤트는 그대로 따라간다) */
          if (mobile && !(cell.firstElementChild && cell.firstElementChild.classList.contains('cv') && cell.childNodes.length === 1)) {
            const box = document.createElement('div'); box.className = 'cv';
            while (cell.firstChild) box.appendChild(cell.firstChild);
            cell.appendChild(box);
          }
          i += span;
        });
      });
    });
  });

  /* 패널 끝에 이어지는 작은 회색 설명(p.xs.muted)은 ‘근거·참고’로 접는다 — 지우지 않고 한 번 누르면 보인다.
     출처 번호만 있는 짧은 줄과 .keep은 그대로 둔다. 펼친 상태는 다시 그려도(입력 변경 등) 유지한다 */
  const fineOpen = new Set();
  S.after.push(() => {
    const view = document.getElementById('view'); if (!view || S.state.route === 'print') return;
    const boxes = [...view.querySelectorAll('.panel, .card5')].concat([...view.querySelectorAll(':scope > .wrap')]);
    boxes.forEach((box, bi) => {
      if (box.closest('.doc')) return;
      const kids = [...box.children], run = [];
      for (let i = kids.length - 1; i >= 0; i--) { const k = kids[i]; if (k.matches('p.xs.muted') && !k.classList.contains('keep')) run.unshift(k); else break; }
      if (!run.length) return;
      const plain = run.map((p) => p.textContent.replace(/\[\d+\]/g, '')).join(' ').replace(/[\s·:,]+/g, ' ').trim();
      if (plain.length < 40) return;
      const h = box.querySelector('h2, h3');
      const key = S.state.route + '|' + (h ? h.textContent.trim() : bi);
      const det = document.createElement('details'); det.className = 'fine';
      det.innerHTML = `<summary>${S.T('근거·참고', 'Notes & sources')}${run.length > 1 ? ` <span class="fine-n">${run.length}</span>` : ''}</summary>`;
      const body = document.createElement('div'); body.className = 'fine-body';
      run.forEach((p) => body.appendChild(p));
      det.appendChild(body); box.appendChild(det);
      if (fineOpen.has(key)) det.open = true;
      det.addEventListener('toggle', () => { if (det.open) fineOpen.add(key); else fineOpen.delete(key); });
    });
  });

  /* 긴 선택 목록(물질 등 25개 이상)에는 ‘입력해서 찾기’ 칸을 붙인다 — 입력하면 맞는 항목만 남기고, 고른 값은 항상 남긴다 */
  S.after.push(() => {
    const view = document.getElementById('view'); if (!view) return;
    view.querySelectorAll('select').forEach((sel) => {
      if (sel.closest('table, .doc') || sel.dataset.find === 'no' || sel.options.length < 25) return;
      const orig = [...sel.children].map((n) => n.cloneNode(true));
      const inp = document.createElement('input');
      inp.type = 'search'; inp.className = 'sel-find'; inp.autocomplete = 'off'; inp.spellcheck = false;
      inp.placeholder = S.T(`${sel.options.length}개 중 입력해서 찾기`, `Type to filter ${sel.options.length} items`);
      inp.setAttribute('aria-label', S.T('목록에서 찾기', 'Filter the list'));
      sel.before(inp);
      const hay = (o, g) => S.norm(o.textContent + ' ' + o.value + ' ' + (g ? g.label : ''));
      inp.addEventListener('input', () => {
        const tks = S.norm(inp.value).split(' ').filter(Boolean), cur = sel.value;
        const hit = (o, g) => o.value === cur || tks.every((t) => hay(o, g).includes(t));
        sel.innerHTML = '';
        orig.forEach((n) => {
          if (n.tagName === 'OPTGROUP') { const g = n.cloneNode(false); [...n.children].forEach((o) => { if (hit(o, n)) g.appendChild(o.cloneNode(true)); }); if (g.children.length) sel.appendChild(g); }
          else if (hit(n)) sel.appendChild(n.cloneNode(true));
        });
        sel.value = cur;
      });
    });
  });

  /* ‘이 페이지’ 목차 — 제목 있는 섹션이 4개 이상인 화면에 칩으로 단다(페이지 탭이 있으면 그 탭의 내용 기준) */
  S.after.push(() => {
    const view = document.getElementById('view'), wrap = view && view.querySelector(':scope > .wrap');
    if (!wrap || S.state.route === 'print' || S.state.route === 'guide' || S.state.route === 'search') return;
    const ok = (h) => !h.closest('.drawer, .doc, details:not([open]), [hidden]') && h.closest('.panel, .card5') && !h.closest('.panel .panel');
    let heads = [...wrap.querySelectorAll('.section-title > h2, .card5 h3')].filter(ok);
    /* 큰 양식 하나로 된 화면(예: 작업허가서)은 번호 붙은 소제목까지 목차에 넣는다 */
    if (heads.length < 4) {
      const subs = [...wrap.querySelectorAll('h3.sub-h')].filter(ok);
      if (subs.length >= 4) heads = heads.concat(subs).sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    }
    if (heads.length < 4) return;
    const label = (h) => { const c = h.cloneNode(true); c.querySelectorAll('.xs, .sub, .src, .ex-flag, .muted').forEach((n) => n.remove()); return c.textContent.replace(/\s+/g, ' ').trim(); };
    let at = wrap.querySelector(':scope > .page-head'); if (!at) return;
    if (at.nextElementSibling && at.nextElementSibling.matches('.tabs')) at = at.nextElementSibling;
    const nav = document.createElement('nav'); nav.className = 'toc'; nav.setAttribute('aria-label', S.T('이 페이지 목차', 'On this page'));
    nav.innerHTML = `<span class="toc-lbl">${S.T('이 페이지', 'On this page')}</span>` + heads.map((h, i) => {
      const t = label(h);
      return `<button type="button" data-toc="${i}" title="${S.esc(t)}">${S.esc(t.length > 22 ? t.slice(0, 21) + '…' : t)}</button>`;
    }).join('');
    at.after(nav);
    nav.addEventListener('click', (e) => { const b = e.target.closest('[data-toc]'); if (!b) return; const h = heads[Number(b.dataset.toc)]; S.reveal(h.matches('.sub-h') ? h : (h.closest('.panel, .card5') || h)); });
  });

  S.render = function () {
    let raw = (location.hash || '#home').slice(1);
    try { raw = decodeURIComponent(raw); } catch (e) { /* malformed escape: use the raw hash */ }
    const [route, ...rest] = raw.split('/');
    S.state.route = S.pages[route] ? route : 'home';
    S.state.sub = rest.join('/');
    S.renderShell();
    const page = S.pages[S.state.route];
    const view = document.getElementById('view');
    view.innerHTML = `<div class="wrap">${page.render(S.state.sub)}</div>`;
    if (page.mount) page.mount(view, S.state.sub);
    document.body.classList.toggle('print-mode', S.state.route === 'print');
    const base = S.T('SHE Master 반도체 안전 포털', 'SHE Master semiconductor safety portal');
    document.title = S.state.route === 'home' ? base : S.routeName(S.state.route) + ' · ' + base;
    S.after.forEach((fn) => { try { fn(); } catch (err) { console.error(err); } });
  };

  /* re-render the current page but keep the scroll position (for in-page state changes) */
  S.refresh = function () {
    const y = window.scrollY;
    S.state.refreshing = true;
    try { S.render(); } finally { S.state.refreshing = false; }
    window.scrollTo(0, y);
  };
})();

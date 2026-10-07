/* SHE 가이드북 — 자료 라이브러리
   #book/find[/조건]  대분류·소분류 체크로 거르기(같은 대분류 안 ‘또는’, 대분류끼리 ‘그리고’), 검색, 정렬, 쪽 나누기, 고르기
   #book/item/<id>   자료 한 건(분류·요약·원문 링크·포털 연결), 고르기, 이 자료 PDF
   고른 자료는 교과서 절과 같은 목록(book.sel)에 모여 #book/sel 모아 보기와 #print/book/sel PDF로 이어진다.
   항목은 data/library.js의 분류표로 포털의 원문 확인 자료(출처·KOSHA GUIDE·사고사례·물질·사이트·SOP·교과서 절)와 새 공식 선례(LIB_ITEMS)를 묶어 만든다. */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui, esc = S.esc;
  const B = (ko, en) => ({ ko, en });
  const words = (v) => [...new Set((Array.isArray(v) ? v : String(v == null ? '' : v).split(/\s+/)).map(String).filter(Boolean))];
  const FACETS = S.LIB_FACETS || [];
  const FIDS = FACETS.map((f) => f.id);
  const LABEL = {}; FACETS.forEach((f) => { LABEL[f.id] = {}; f.v.forEach(([k, l]) => { LABEL[f.id][k] = l; }); });
  const lab = (f, v) => (f === 'y' ? (S.state.lang === 'en' ? v : v + '년') : LABEL[f] && LABEL[f][v] ? L(LABEL[f][v]) : v);

  /* ---------- 항목 ---------- */
  const ITEMS = [], IDX = {};
  const add = (it) => {
    if (!it || IDX[it.id]) return;
    it.c = words(it.c); it.y = words(it.y); it.i = words(it.i); it.h = words(it.h); it.m = words(it.m); it.a = words(it.a); it.tier = String(it.tier);
    it.src = words(it.src); it.sum = it.sum || B([], []);
    ITEMS.push(it); IDX[it.id] = it;
  };
  const sum1 = (ko, en) => B([].concat(ko || []).filter(Boolean), [].concat(en || []).filter(Boolean));
  const hash = (s) => { let h = 5381; for (const ch of String(s)) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0; return h.toString(36); };

  /* 1) 교과서 절 */
  const BOOK_M = { 'ra-basics': 'ra', 'ra-law': 'ra', 'prev-principles': 'ra', hoc: 'ra ppe', 'ilo-c155': 'org', 'ilo-fund': 'org', 'law-map': 'org', 'duty-employer': 'org', 'duty-worker': 'org' };
  (S.BOOK_ORDER || []).forEach((id) => {
    const x = S.BOOK_IDX[id]; if (!x || x.s.st !== 'ok') return;
    const src = []; (x.s.body || []).forEach((b) => words(b.src).forEach((s) => { if (!src.includes(s)) src.push(s); }));
    add({ id, k: 'book', c: x.s.cty || [], y: [], i: 'all', h: '', m: BOOK_M[id] || '', tier: 'B', title: x.s.t, sum: x.s.sum, href: '#book/' + id, num: x.num, src, checked: x.s.checked });
  });
  /* 2) 출처 목록 — 같은 문서를 가리키는 동향(NEWS)의 요약을 붙인다 */
  const newsBy = {};
  (S.NEWS || []).forEach((n) => { if (n.kind === 'acc') return; const s0 = words(n.src)[0]; (newsBy[s0] = newsBy[s0] || []).push(n); });
  Object.keys(S.LIB_SRC || {}).forEach((sid) => {
    const s = (S.SOURCES || []).find((x) => x.id === sid); if (!s) return;
    const [k, c, y, i, h, m, tier] = S.LIB_SRC[sid];
    const ns = newsBy[sid] || [];
    const ko = [].concat(s.note ? s.note.ko : [], ns.map((n) => n.t.ko)), en = [].concat(s.note ? s.note.en : [], ns.map((n) => n.t.en));
    add({ id: 's-' + sid, k, c, y, d: ns.length ? ns[0].date : '', i, h, m, a: (S.LIB_SRC_A || {})[sid], tier, title: s.title, sum: sum1(ko, en), url: s.url, src: [sid], go: [['#sources/' + sid, B('출처·검증의 이 출처', 'This source in Sources & verification')]].concat(ns.filter((n) => n.link).map((n) => [n.link, B('관련 포털 화면', 'Related portal page')])), checked: s.checked });
  });
  /* 3) KOSHA GUIDE — 출처 목록의 같은 지침(koshaCC49 등)은 여기로 합친다 */
  const srcOfKosha = {}; Object.keys(S.LIB_SRC_KOSHA || {}).forEach((sid) => { srcOfKosha[S.LIB_SRC_KOSHA[sid]] = sid; });
  Object.keys(S.LIB_KOSHA || {}).forEach((code) => {
    const g = (S.KOSHA || {})[code]; if (!g) return;
    const [i, h, m] = S.LIB_KOSHA[code], sid = srcOfKosha[code], s = sid && S.SOURCES.find((x) => x.id === sid);
    const old = g.old ? [].concat(g.old).join(', ') : '';
    add({ id: 'g-' + code, k: 'guide', c: 'KR', y: (g.d || '').slice(0, 4), d: g.d, i, h, m, tier: 2,
      title: B(`KOSHA GUIDE ${code} 「${g.ko}」`, `KOSHA GUIDE ${code} “${g.en || g.ko}”`), org: B('한국산업안전보건공단', 'KOSHA'),
      sum: sum1([].concat(s ? s.title.ko : [], old ? `구 번호: ${old}` : []), [].concat(s ? s.title.en : [], old ? `Former number: ${old}` : [])),
      url: S.koshaUrl ? S.koshaUrl(Object.assign({ id: code }, g)) : '', src: sid ? [sid, 'koshaGuide'] : ['koshaGuide'], checked: s ? s.checked : '' });
  });
  /* 4) 사고사례 */
  (S.CASES || []).forEach((c) => {
    const hz = []; words(c.types).map((t) => (S.LIB_CASE_HZ || {})[t]).concat((S.LIB_CASE_HZX || {})[c.id]).forEach((v) => words(v).forEach((h) => { if (!hz.includes(h)) hz.push(h); }));
    const ind = (S.LIB_CASE_IND || {})[c.id] || (/^gov-/.test(c.id) ? '' : 'semi');
    const ca = []; words(c.types).forEach((t) => words((S.LIB_CASE_A || {})[t]).forEach((v) => { if (!ca.includes(v)) ca.push(v); }));
    add({ id: 'x-' + c.id, k: 'case', c: 'KR', y: (c.date || '').slice(0, 4), d: c.date, i: ind, h: hz, a: ca, m: 'inv' + (words(c.types).includes('reg') ? ' contract liab' : ''), tier: c.official ? 3 : 4,
      title: c.t, sum: sum1([].concat(c.impact ? c.impact.ko : [], c.lesson ? c.lesson.ko : []), [].concat(c.impact ? c.impact.en : [], c.lesson ? c.lesson.en : [])), href: '#cases/' + c.id, src: words(c.src) });
  });
  /* 5) 법령 개정·시행 소식(동향의 ‘법령’) — 포털 화면과 바뀐 조문 출처로 분류 */
  const LINK_M = { training: ['', 'training'], 'risk/timing': ['', 'ra'], 'prevent/report': ['', 'inv'], 'home/cycles': ['', 'org'], 'cases/': ['', 'inv'], 'sop/confined': ['conf', 'ptw'], 'sop/hot-work': ['fire', 'ptw'], 'sop/xray': ['rad', 'training'], 'measure/heat': ['heat', ''], psm: ['gas', ''], 'sources/kosha': ['', ''] };
  (S.NEWS || []).forEach((n) => {
    if (n.kind !== 'law') return;
    const key = Object.keys(LINK_M).find((k) => String(n.link || '').slice(1).startsWith(k)) || '';
    const [h, m] = LINK_M[key] || ['', ''];
    add({ id: 'n-' + n.date + '-' + hash(n.t.ko), k: 'news', c: 'KR', y: n.date.slice(0, 4), d: n.date, i: n.link === '#psm' ? 'semi all' : 'all', h, m, tier: 2,
      title: B(n.t.ko.split(' — ')[0], n.t.en.split(' — ')[0]), sum: sum1(n.t.ko, n.t.en), href: n.link, src: words(n.src) });
  });
  /* 6) 물질 정보 */
  (S.CHEMICALS || []).forEach((c) => {
    const hz = ['chem'].concat(['toxgas', 'fgas', 'inert'].includes(c.cat) ? ['gas'] : [], ['pyro', 'solv'].includes(c.cat) ? ['fire'] : []);
    const lim = [c.twa != null ? `TWA ${c.twa}` : '', c.stel != null ? `STEL ${c.stel}` : '', c.c != null ? `C ${c.c}` : ''].filter(Boolean).join(' · ');
    const ko = [`CAS ${c.cas}` + (lim ? ` · 국내 노출기준 ${lim} ${c.unit || ''}` : ' · 국내 노출기준 없음'), c.idlh != null ? `IDLH ${c.idlh} ${c.idlhUnit || c.unit || ''}` : ''].filter(Boolean);
    const en = [`CAS ${c.cas}` + (lim ? ` · Korean OEL ${lim} ${c.unit || ''}` : ' · no Korean OEL'), c.idlh != null ? `IDLH ${c.idlh} ${c.idlhUnit || c.unit || ''}` : ''].filter(Boolean);
    add({ id: 'm-' + c.id, k: 'chem', c: 'INT KR', y: [], i: 'semi', h: hz, m: 'signs monitor', tier: 2, title: B(`${c.ko} (${c.f})`, `${c.en} (${c.f})`), sum: sum1(ko, en),
      urlFn: () => (S.icscUrl ? S.icscUrl(c, S.state.lang) : ''), href: '#hazards/' + c.id, src: ['moelOel'].concat(c.ic ? ['icsc'] : []) });
  });
  /* 7) 공식 사이트 */
  (S.RESOURCES || []).forEach((r) => {
    const meta = (S.LIB_RES || {})[r.id]; if (!meta) return;
    const hz = [], mt = []; r.subj.forEach((s) => { const [h, m] = (S.LIB_RES_SUBJ || {})[s] || ['', '']; words(h).forEach((x) => hz.includes(x) || hz.push(x)); words(m).forEach((x) => mt.includes(x) || mt.push(x)); });
    add({ id: 'w-' + r.id, k: r.subj.includes('stats') ? 'stat' : 'site', c: meta[0], y: [], i: r.subj.includes('company') ? 'semi' : 'all', h: hz, m: mt, tier: meta[1], title: r.name, org: r.org,
      sum: sum1(r.desc.ko, r.desc.en), url: r.url, go: (r.use || []).map((u) => ['#' + u, () => T('포털 활용: ', 'Used in: ') + S.routeName(u)]), checked: r.checked });
  });
  /* 8) 포털 SOP */
  (S.SOPS || []).forEach((s) => {
    const [h, m] = (S.LIB_SOP || {})[s.id] || ['', ''];
    add({ id: 'p-' + s.id, k: 'sop', c: 'KR', y: [], i: 'semi', h, m, tier: 'P', title: s.t, sum: sum1(s.area ? s.area.ko : '', s.area ? s.area.en : ''), href: '#sop/' + s.id, src: words(s.src) });
  });
  /* 9) 새로 모은 공식 선례·자료 */
  (S.LIB_ITEMS || []).forEach(add);
  /* 10) 일본 후생노동성 労働災害事例(data/lib-jp.js) — 분류는 원 데이터 코드를 S.LIB_JP_MAP으로 대응, 원문을 읽고 요약한 사례(X)는 그 제목·요약을 쓴다 */
  if (S.LIB_JP && S.LIB_JP_MAP) {
    const JP = S.LIB_JP, MAP = S.LIB_JP_MAP, LB = JP.L;
    const lb = (f, c) => (c && LB[f] && LB[f][c] ? B(LB[f][c][0], LB[f][c][1]) : null);
    const ORG_JP = B('일본 후생노동성 — 職場のあんぜんサイト 노동재해 사례', 'Japan MHLW — Workplace Safety Site accident cases');
    JP.C.forEach(([id, t, g, k, j, mo, hi, ka, y]) => {
      const x = JP.X[id], gl = lb('g', g), kl = lb('k', k), jl = lb('j', j);
      const fac = [['물적', 'conditions', lb('m', mo)], ['인적', 'people', lb('h', hi)], ['관리', 'management', lb('n', ka)]].filter((r) => r[2]);
      const facKo = fac.length ? '발생 요인(일본 분류) — ' + fac.map((r) => `${r[0]}: ${r[2].ko}`).join(' · ') : '';
      const facEn = fac.length ? 'Contributing factors (Japanese classification) — ' + fac.map((r) => `${r[1]}: ${r[2].en}`).join('; ') : '';
      const clsKo = [jl && `사고 유형: ${jl.ko}`, kl && `기인물: ${kl.ko}`, gl && `업종: ${gl.ko}`].filter(Boolean).join(' · ');
      const clsEn = [jl && `Type: ${jl.en}`, kl && `Agent: ${kl.en}`, gl && `Industry: ${gl.en}`].filter(Boolean).join('; ');
      const title = x ? B(x[0], x[1]) : B(`${jl ? jl.ko : '사고'} — ${kl ? kl.ko : '기인물 미분류'}${gl ? ` (${gl.ko})` : ''}`, `${jl ? jl.en : 'Accident'} — ${kl ? kl.en : 'agent not classified'}${gl ? ` (${gl.en})` : ''}`);
      add({ id: 'jp-' + id, k: 'case', c: 'JP', y: y || [], i: x && x[4] ? x[4] : MAP.ind(g), h: [MAP.hzKiin(k), MAP.hzJiko(j, t)].join(' '), a: MAP.a(j, t), m: MAP.m(mo, ka), tier: 3,
        title, orig: t, cur: !!x, size: x && x[5] ? B(x[5][0], x[5][1]) : null, org: ORG_JP,
        sum: x ? sum1(x[2].concat(facKo || []), x[3].concat(facEn || [])) : sum1([clsKo, facKo], [clsEn, facEn]),
        url: 'https://anzeninfo.mhlw.go.jp/jirei/sai_' + String(id).padStart(6, '0') + '.html', src: ['jpAnzenCases'], checked: JP.asof });
    });
  }

  /* ---------- 연도 대분류: 자료에 있는 연도를 10년 단위로 묶는다 ---------- */
  const YEARS = [...new Set([].concat(...ITEMS.map((it) => it.y)))].sort((a, b) => b - a);
  const decade = (y) => (y >= 2020 ? '2020' : y >= 2010 ? '2010' : y >= 2000 ? '2000' : '1990');
  const YGROUPS = ['2020', '2010', '2000', '1990'].map((d) => [d, YEARS.filter((y) => decade(Number(y)) === d)]).filter((g) => g[1].length);
  const yGroupLabel = (d) => (d === '1990' ? T('1990년대 이전', '1990s and earlier') : T(`${d}년대`, `${d}s`));
  const KIND_ORDER = (FACETS[0] ? FACETS[0].v.map((v) => v[0]) : []);

  /* ---------- 상태(조건): 저장값 또는 주소 #book/find/k=case,report;c=US;y=2022 ---------- */
  const DEF = () => ({ s: {}, q: '', sort: 'new', per: 20, page: 1 });
  const parseSub = (sub) => {
    const st = DEF();
    String(sub || '').split(';').forEach((kv) => {
      const [k, v] = kv.split('='); if (!v) return;
      if (k === 'q') st.q = decodeURIComponent(v); else if (FIDS.includes(k)) st.s[k] = v.split(',').filter((x) => valid(k, x));
    });
    return st;
  };
  const valid = (f, v) => (f === 'y' ? YEARS.includes(v) : !!(LABEL[f] && LABEL[f][v]));
  const encode = (st) => FIDS.filter((f) => (st.s[f] || []).length).map((f) => `${f}=${st.s[f].join(',')}`).concat(st.q ? ['q=' + encodeURIComponent(st.q)] : []).join(';');
  const loadState = (sub) => {
    const rest = String(sub || '').split('/').slice(1).join('/');
    const saved = S.load('book.lf', null);
    const st = rest ? Object.assign(DEF(), parseSub(rest), saved ? { sort: saved.sort, per: saved.per } : {}) : Object.assign(DEF(), saved && typeof saved === 'object' ? saved : {});
    FIDS.forEach((f) => { st.s[f] = (st.s[f] || []).filter((v) => valid(f, v)); });
    if (![20, 50, 100].includes(Number(st.per))) st.per = 20;
    return st;
  };
  const saveState = (st) => S.save('book.lf', st);

  /* ---------- 거르기 ---------- */
  const valOf = (it, f) => (f === 'k' ? [it.k] : f === 't' ? [it.tier] : it[f] || []);
  const hayCache = {};
  const hay = (it) => { const k = S.state.lang + '|' + it.id; if (!hayCache[k]) hayCache[k] = S.norm([L(it.title), it.title.ko, it.title.en, [].concat(L(it.sum) || []).join(' '), L(it.org) || '', it.loc && typeof it.loc === 'object' ? it.loc.ko + ' ' + it.loc.en : it.loc || '', it.orig || '', it.id].join(' ')); return hayCache[k]; };
  const toks = (q) => S.norm(q).split(' ').filter(Boolean).slice(0, 8);
  const match = (it, st, skip) => {
    for (const f of FIDS) {
      if (f === skip) continue;
      const sel = st.s[f] || [];
      if (sel.length && !valOf(it, f).some((v) => sel.includes(v))) return false;
    }
    const tk = toks(st.q);
    if (tk.length) { const h = hay(it), hn = h.replace(/ /g, ''); if (!tk.every((t) => h.includes(t) || hn.includes(t))) return false; }
    return true;
  };
  const sortKey = (it) => it.d || (it.y.length ? Math.max(...it.y.map(Number)) + '-00-00' : '');
  function results(st) {
    const list = ITEMS.filter((it) => match(it, st));
    const byTitle = (a, b) => L(a.title).localeCompare(L(b.title), S.state.lang === 'en' ? 'en' : 'ko');
    const byKind = (a, b) => KIND_ORDER.indexOf(a.k) - KIND_ORDER.indexOf(b.k);
    if (st.sort === 'title') list.sort(byTitle);
    else if (st.sort === 'kind') list.sort((a, b) => byKind(a, b) || sortKey(b).localeCompare(sortKey(a)) || byTitle(a, b));
    else if (st.sort === 'old') list.sort((a, b) => (!sortKey(a)) - (!sortKey(b)) || sortKey(a).localeCompare(sortKey(b)) || byTitle(a, b));
    else list.sort((a, b) => (!sortKey(a)) - (!sortKey(b)) || sortKey(b).localeCompare(sortKey(a)) || byKind(a, b) || byTitle(a, b));
    return list;
  }
  const counts = (st, f) => { const n = {}; ITEMS.forEach((it) => { if (!match(it, st, f)) return; valOf(it, f).forEach((v) => { n[v] = (n[v] || 0) + 1; }); }); return n; };

  /* ---------- 공통 부품 ---------- */
  const kindChip = (it) => `<span class="bk-tag lib-k lib-k-${esc(it.k)}">${esc(lab('k', it.k))}</span>`;
  const dateText = (it) => (it.d ? it.d : it.y.length ? it.y.join(', ') : '');
  const hrefOf = (it) => (it.k === 'book' ? '#book/' + it.id : '#book/item/' + it.id);
  const locOf = (it) => (it.loc && typeof it.loc === 'object' ? L(it.loc) : it.loc || '');
  const meta1 = (it) => [it.c.map((c) => lab('c', c)).join(', '), dateText(it), locOf(it), L(it.org) || ''].filter(Boolean).join(' · ');
  const getSel = () => (S.bookApi ? S.bookApi.getSel() : []);
  const putSel = (ids) => S.bookApi && S.bookApi.putSel(ids);
  const urlOf = (it) => (it.urlFn ? it.urlFn() : it.url || '');
  const ext = (u, label) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${label}<span class="ext" aria-hidden="true">↗</span><span class="sr-only">${T(' (새 창)', ' (opens in a new window)')}</span></a>`;

  function card(it, sel, tk) {
    const t = L(it.title), first = [].concat(L(it.sum) || [])[0] || '';
    const tags = [].concat(it.a.map((v) => lab('a', v)), it.i.filter((v) => v !== 'all').map((v) => lab('i', v)), it.h.map((v) => lab('h', v)), it.m.map((v) => lab('m', v))).filter((v, n, arr) => arr.indexOf(v) === n).slice(0, 6);
    const mk = (s) => (tk.length && S.markText ? S.markText(s, tk) : esc(s));
    return `<li class="lib-card">
      <input type="checkbox" data-lib-sel="${esc(it.id)}" ${sel.includes(it.id) ? 'checked' : ''} aria-label="${esc(T(`${t} 고르기`, `Select ${t}`))}">
      <div class="lib-main"><div class="lib-top">${kindChip(it)}<span class="xs muted">${esc(meta1(it))}</span></div>
        <a class="lib-title" href="${hrefOf(it)}">${it.num ? `<span class="bk-n">${it.num}</span> ` : ''}${mk(t)}</a>
        ${first ? `<p class="lib-sum">${mk(first.length > 220 ? first.slice(0, 219) + '…' : first)}</p>` : ''}
        ${tags.length ? `<div class="bk-chips">${tags.map((x) => `<span class="chip">${esc(x)}</span>`).join('')}</div>` : ''}</div>
      ${urlOf(it) ? `<div class="lib-act">${ext(urlOf(it), T('원문', 'Original'))}</div>` : ''}</li>`;
  }

  /* 공식 데이터베이스 — 라이브러리에 아직 없는 자료를 찾을 곳 (2026-10-04 접속 확인, 사람 확인 단계가 있는 곳은 표시) */
  const DB = {
    KR: [[B('국가법령정보센터 — 법령·행정규칙', 'National Law Information Center — statutes and rules'), 'https://www.law.go.kr/'], [B('국가법령정보센터 — 판례 검색', 'National Law Information Center — case law'), 'https://www.law.go.kr/LSW/precSc.do?menuId=7&subMenuId=47&tabMenuId=213'], [B('고용노동부 — 재해조사보고서 공개', 'MOEL — published accident investigation reports'), ((S.SOURCES || []).find((s) => s.id === 'moelRpt') || {}).url], [B('산업안전포털(KOSHA) — 기술지원규정·재해사례', 'KOSHA portal — guides and accident cases'), 'https://portal.kosha.or.kr/']],
    US: [[B('OSHA 사고조사 검색(IMIS) — 업종 코드·기간으로 검색, 사람 확인(CAPTCHA) 단계 있음', 'OSHA Accident Investigation Search (IMIS) — by industry code and period; has a human-verification step'), 'https://www.osha.gov/ords/imis/accidentsearch.html'], [B('OSHA 중대 재해 보고 — 2015년부터 전체 데이터 내려받기(연방 OSHA 관할)', 'OSHA Severe Injury Reports — full data set since 2015 (federal OSHA jurisdiction)'), 'https://www.osha.gov/severeinjury'],[B('CSB — 완료된 사고조사', 'CSB — completed investigations'), 'https://www.csb.gov/investigations/completed-investigations/'], [B('eCFR — 29 CFR(노동 안전보건 규정)', 'eCFR — Title 29 (labor)'), 'https://www.ecfr.gov/current/title-29']],
    UK: [[B('legislation.gov.uk — 영국 법령', 'legislation.gov.uk — UK legislation'), 'https://www.legislation.gov.uk/'], [B('HSE 언론센터 — 기소 보도자료', 'HSE media centre — prosecutions'), 'https://press.hse.gov.uk/category/prosecution/'], [B('HSE — 산업재해 통계', 'HSE — statistics'), 'https://www.hse.gov.uk/statistics/']],
    EU: [[B('EUR-Lex — EU 법령', 'EUR-Lex — EU law'), 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:31989L0391'], [B('EU-OSHA — 지침·법령 해설', 'EU-OSHA — directives and guidance'), 'https://osha.europa.eu/en']],
    JP: [[B('職場のあんぜんサイト — 労働災害事例検索(재해 사례)', 'Workplace safety site — accident case search'), 'https://anzeninfo.mhlw.go.jp/jirei/sai_search.html'], [B('e-Gov 法令検索 — 일본 법령 현행본', 'e-Gov law search — current Japanese law'), 'https://laws.e-gov.go.jp/']],
    TW: [[B('全國法規資料庫 — 대만 법령(중국어 현행본·영문판)', 'Laws & Regulations Database of Taiwan (current Chinese text and English versions)'), 'https://law.moj.gov.tw/'], [B('職業安全衛生署 職災案例宣導 — 대만 직업재해 사례', 'Taiwan OSHA — occupational accident case bulletins'), 'https://www.osha.gov.tw/48110/48417/48427/lpsimplelist'], [B('勞動部職業安全衛生署 — 대만 직업안전위생서', 'Occupational Safety and Health Administration, Taiwan'), 'https://www.osha.gov.tw/']],
    INT: [[B('ILO NORMLEX — 국제노동기준·비준 현황', 'ILO NORMLEX — standards and ratifications'), 'https://normlex.ilo.org/dyn/nrmlx_en/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:C155'], [B('ILO ICSC — 국제화학물질안전카드', 'ILO ICSC — chemical safety cards'), 'https://chemicalsafety.ilo.org/dyn/icsc/showcard.home']]
  };
  function dbPanel(st, n) {
    const cs = (st.s.c && st.s.c.length ? st.s.c : Object.keys(DB)).filter((c) => DB[c]);
    return `<section class="panel lib-db"><div class="section-title"><h2>${T('공식 데이터베이스에서 더 찾기', 'Search the official databases')}</h2><span class="sub">${n ? T('라이브러리 밖의 원문까지', 'beyond the library') : T('이 조건의 자료가 아직 라이브러리에 없습니다', 'nothing in the library matches yet')}</span></div>
      <p class="small">${T('라이브러리는 원문을 확인한 자료만 싣기 때문에 아직 모으지 못한 자료가 있습니다. 아래 공식 데이터베이스에서 같은 조건(나라·연도·업종)으로 찾아보세요. 찾은 자료는 다음 업데이트에서 원문을 확인해 라이브러리에 더합니다.', 'The library holds only items checked against their originals, so some material is not in it yet. Search these official databases with the same conditions (country, year, industry); what you find can be checked and added in a later update.')}</p>
      <div class="lib-dbgrid">${cs.map((c) => `<div><b>${esc(lab('c', c))}</b><ul>${DB[c].filter((d) => d[1]).map(([l, u]) => `<li>${ext(u, esc(L(l)))}</li>`).join('')}</ul></div>`).join('')}</div></section>`;
  }

  /* ---------- #book/find ---------- */
  function facetBox(st, f) {
    const sel = st.s[f.id] || [], n = counts(st, f.id);
    const chk = (v, l) => `<label class="lib-opt${n[v] ? '' : ' zero'}"><input type="checkbox" data-lib-f="${f.id}" value="${esc(v)}" ${sel.includes(v) ? 'checked' : ''}><span>${esc(l)}</span><span class="num">${S.fmt(n[v] || 0, 0)}</span></label>`;
    const grp = (title, vals) => `<div class="lib-grp"><label class="lib-gh"><input type="checkbox" data-lib-g="${f.id}" data-vals="${esc(vals.join(','))}" ${vals.every((v) => sel.includes(v)) ? 'checked' : ''}><span>${esc(title)}</span></label><div class="lib-opts">${vals.map((v) => chk(v, lab(f.id, v))).join('')}</div></div>`;
    let body;
    if (f.id === 'y') body = YGROUPS.map(([d, ys]) => grp(yGroupLabel(d), ys)).join('');
    else if (f.groups) body = f.groups.map(([gl, vals]) => grp(L(gl), vals)).join('');
    else body = `<div class="lib-opts">${f.v.map(([v, l]) => chk(v, L(l))).join('')}</div>`;
    /* PC는 주요 대분류 4개를 펼쳐 두고, 휴대폰은 결과가 먼저 보이도록 고른 값이 있는 대분류만 펼친다 */
    const open = S.load('book.lfo', document.documentElement.classList.contains('m') ? [] : ['k', 'c', 'y', 'i']).includes(f.id) || sel.length;
    return `<div class="lib-facet" data-lib-box="${f.id}"><button type="button" class="lib-fh" data-lib-fold="${f.id}" aria-expanded="${!!open}"><svg class="chev" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg><span>${esc(L(f.t))}</span>${sel.length ? `<span class="lib-on">${T(`${sel.length}개 선택`, `${sel.length} selected`)}</span>` : ''}</button><div class="lib-fb" ${open ? '' : 'hidden'}>${body}</div></div>`;
  }
  function renderFind(sub) {
    const st = loadState(sub), list = results(st), sel = getSel(), tk = toks(st.q);
    const pages = Math.max(1, Math.ceil(list.length / st.per)); st.page = Math.min(Math.max(1, Number(st.page) || 1), pages);
    const shown = list.slice((st.page - 1) * st.per, st.page * st.per);
    const chosen = [].concat(...FIDS.map((f) => (st.s[f] || []).map((v) => [f, v])));
    return `${ui.head(T('라이브러리', 'Library'), T('SHE 가이드북 — 자료 라이브러리', 'SHE Guidebook — resource library'),
      T(`법령·지침·선례·데이터 ${S.fmt(ITEMS.length, 0)}건을 대분류·소분류로 골라 찾습니다. 같은 대분류 안은 ‘또는’, 대분류끼리는 ‘그리고’로 거릅니다.`, `Find any of ${S.fmt(ITEMS.length, 0)} laws, guides, precedents and data items by ticking categories. Values in one group combine with “or”, groups combine with “and”.`),
      T('<p>예: 연도 2022 + 나라 미국 + 업종 반도체 + 유형 선례를 고르면 그 조건을 모두 갖춘 자료만 남습니다. 결과에서 자료를 열어 보거나 원문으로 이동하고, 체크한 자료는 교과서 절과 함께 ‘고른 자료 모아 보기’와 PDF로 묶을 수 있습니다. 모든 자료는 원문을 확인한 것이며 분류 기준은 가이드북 0.1.2에 있습니다.</p>', '<p>For example, ticking 2022 + United States + semiconductors + precedents leaves only items meeting all four. Open an item or go to its original; ticked items join guidebook sections in “Read selected” and the PDF. Every item was checked against its original; the classification rules are in guidebook 0.1.2.</p>'))}
      ${S.bookApi ? S.bookApi.tabs('find') : ''}
      <section class="panel lib-filters" aria-label="${T('카테고리', 'Categories')}">
        <label class="bk-search">${S.ICON_SEARCH}<input type="search" id="lib-q" value="${esc(st.q)}" placeholder="${esc(T('자료에서 찾기 — 예: 불화수소, 화기작업, CSB', 'Search items — e.g. hydrogen fluoride, hot work, CSB'))}" aria-label="${esc(T('자료에서 찾기', 'Search items'))}" autocomplete="off" spellcheck="false" enterkeyhint="search"></label>
        <div class="lib-chosen">${chosen.length ? chosen.map(([f, v]) => `<button type="button" class="fchip" aria-pressed="true" data-lib-x="${f}:${esc(v)}" title="${esc(T('빼기', 'Remove'))}"><span class="xs">${esc(L(FACETS.find((x) => x.id === f).t))}</span> ${esc(lab(f, v))} ✕</button>`).join('') + `<button type="button" class="btn ghost sm" data-lib-clear>${T('조건 모두 해제', 'Clear all')}</button>` : `<span class="xs muted">${T('아래 대분류를 펼쳐 소분류를 체크하세요. 체크할 때마다 결과와 숫자가 바로 바뀝니다.', 'Open a group below and tick values; results and counts update at once.')}</span>`}
          <button type="button" class="btn ghost sm" data-lib-link>${T('이 조건 링크 복사', 'Copy link to these filters')}</button></div>
        <div class="lib-facets">${FACETS.map((f) => facetBox(st, f)).join('')}</div>
      </section>
      <section class="panel lib-results" id="anchor-${esc(String(sub || 'find'))}">
        <div class="lib-bar"><span class="lib-cnt"><b class="num">${S.fmt(list.length, 0)}</b>${T('건', '')} <span class="xs muted">${list.length ? `· ${S.fmt((st.page - 1) * st.per + 1, 0)}–${S.fmt((st.page - 1) * st.per + shown.length, 0)}` : ''}</span></span>
          <select id="lib-sort" aria-label="${T('정렬', 'Sort')}">${[['new', T('최신순', 'Newest')], ['old', T('오래된순', 'Oldest')], ['kind', T('유형순', 'By type')], ['title', T('제목순', 'By title')]].map(([v, l]) => `<option value="${v}" ${st.sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
          <select id="lib-per" aria-label="${T('쪽당 개수', 'Per page')}">${[20, 50, 100].map((p) => `<option value="${p}" ${st.per === p ? 'selected' : ''}>${T(`${p}건씩`, `${p} per page`)}</option>`).join('')}</select>
          <button type="button" class="btn ghost sm" data-lib-all ${shown.length ? '' : 'disabled'}>${T('이 쪽 모두 고르기', 'Select this page')}</button>
          <span class="lib-selc">${T('고른 자료', 'Selected')} <b class="num" data-lib-n>${sel.length}</b></span>
          <a class="btn sm" href="#book/sel">${T('모아 보기', 'Read selected')}</a>
          <a class="btn ghost sm print-link" href="#print/book/sel">${S.ICON_PRINT}${T('PDF로 저장', 'Save as PDF')}</a></div>
        ${shown.length ? `<ol class="lib-list">${shown.map((it) => card(it, sel, tk)).join('')}</ol>` : `<div class="callout small">${T('조건에 맞는 자료가 없습니다. 조건을 줄이거나 아래 공식 데이터베이스에서 찾아보세요.', 'No items match. Remove a condition or search the official databases below.')}</div>`}
        ${pages > 1 ? `<nav class="pager" aria-label="${T('쪽 이동', 'Pages')}"><button type="button" data-lib-p="${st.page - 1}" ${st.page === 1 ? 'disabled' : ''} aria-label="${T('이전 쪽', 'Previous page')}">‹</button>${Array.from({ length: pages }, (_, i) => `<button type="button" data-lib-p="${i + 1}" ${st.page === i + 1 ? 'aria-current="page"' : ''}>${i + 1}</button>`).join('')}<button type="button" data-lib-p="${st.page + 1}" ${st.page === pages ? 'disabled' : ''} aria-label="${T('다음 쪽', 'Next page')}">›</button></nav>` : ''}
      </section>
      ${dbPanel(st, list.length)}`;
  }
  function mountFind(root, sub) {
    const st = loadState(sub);
    const apply = (patch, scrollTop) => {
      Object.assign(st, patch || {}); saveState(st);
      const enc = encode(st);
      history.replaceState(null, '', '#book/find' + (enc ? '/' + enc : ''));
      S.state.sub = 'find' + (enc ? '/' + enc : '');
      S.refresh();
      if (scrollTop) { const r = document.querySelector('.lib-results'); if (r) r.scrollIntoView({ block: 'start' }); }
    };
    root.querySelectorAll('[data-lib-f]').forEach((cb) => cb.addEventListener('change', () => {
      const f = cb.dataset.libF, cur = st.s[f] || [];
      st.s[f] = cb.checked ? cur.concat(cb.value) : cur.filter((v) => v !== cb.value);
      apply({ page: 1 });
    }));
    root.querySelectorAll('[data-lib-g]').forEach((cb) => cb.addEventListener('change', () => {
      const f = cb.dataset.libG, vals = cb.dataset.vals.split(','), cur = st.s[f] || [];
      st.s[f] = cb.checked ? [...new Set(cur.concat(vals))] : cur.filter((v) => !vals.includes(v));
      apply({ page: 1 });
    }));
    root.querySelectorAll('[data-lib-x]').forEach((b) => b.addEventListener('click', () => { const [f, v] = b.dataset.libX.split(':'); st.s[f] = (st.s[f] || []).filter((x) => x !== v); apply({ page: 1 }); }));
    const clr = root.querySelector('[data-lib-clear]'); if (clr) clr.addEventListener('click', () => { st.s = {}; st.q = ''; apply({ page: 1 }); });
    root.querySelectorAll('[data-lib-fold]').forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.libFold, body = b.nextElementSibling, open = body.hidden;
      body.hidden = !open; b.setAttribute('aria-expanded', String(open));
      const o = S.load('book.lfo', ['k', 'c', 'y', 'i']).filter((x) => x !== id); if (open) o.push(id); S.save('book.lfo', o);
    }));
    let tm = 0;
    const q = root.querySelector('#lib-q');
    q.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { const pos = q.selectionStart; apply({ q: q.value, page: 1 }); const q2 = document.getElementById('lib-q'); if (q2) { q2.focus(); try { q2.setSelectionRange(pos, pos); } catch (e) { /* search input */ } } }, 250); });
    root.querySelector('#lib-sort').addEventListener('change', (e) => apply({ sort: e.target.value, page: 1 }));
    root.querySelector('#lib-per').addEventListener('change', (e) => apply({ per: Number(e.target.value), page: 1 }));
    root.querySelectorAll('[data-lib-p]').forEach((b) => b.addEventListener('click', () => apply({ page: Number(b.dataset.libP) }, true)));
    root.querySelector('[data-lib-link]').addEventListener('click', () => {
      const u = location.href.split('#')[0] + '#book/find' + (encode(st) ? '/' + encode(st) : '');
      const done = () => S.toast(T('조건 링크를 복사했습니다', 'Link copied'));
      try { navigator.clipboard.writeText(u).then(done, () => S.toast(u)); } catch (e) { S.toast(u); }
    });
    const n = root.querySelector('[data-lib-n]');
    root.addEventListener('change', (e) => {
      const el = e.target; if (!el.matches('[data-lib-sel]')) return;
      const sel = getSel(); putSel(el.checked ? sel.concat(el.dataset.libSel) : sel.filter((x) => x !== el.dataset.libSel));
      if (n) n.textContent = String(getSel().length);
    });
    const all = root.querySelector('[data-lib-all]');
    if (all) all.addEventListener('click', () => {
      const ids = [...root.querySelectorAll('[data-lib-sel]')].map((c) => c.dataset.libSel);
      putSel(getSel().concat(ids)); root.querySelectorAll('[data-lib-sel]').forEach((c) => { c.checked = true; });
      if (n) n.textContent = String(getSel().length);
    });
  }

  /* ---------- #book/item/<id> ---------- */
  const ORIG_L = { ja: B('원제(일본어)', 'Original title (Japanese)'), en: B('원제(영어)', 'Original title (English)'), 'zh-Hant': B('원제(중국어)', 'Original title (Chinese)') };
  /* 다른 나라의 같은 주제 — 같은 묶음(법령·기준 / 선례)에서 나라가 다른 자료 가운데 위험 요인·사고 유형(겹칠 때마다 3점)과
     관리 주제(최대 2점)·업종(1점)이 겹치는 것을 점수순으로(나라마다 2건, 모두 8건까지). 위험 요인·사고 유형이 있는 자료는 그중 하나는 겹쳐야 하고,
     너무 흔한 주제(사고 보고·법적 책임·일반 의무)와 ‘전 산업’, 사고 유형 ‘기타’는 세지 않는다.
     위험 요인·사고 유형이 겹치는 자료끼리는 영문 제목의 핵심 낱말(물질·설비 이름 등, 흔한 낱말 제외)이 겹칠 때마다 1점(최대 2점)을 더해 같은 물질·설비의 사례가 앞에 오게 한다(#25) */
  const KGROUP = {}; ((FACETS[0] || {}).groups || []).forEach(([, ks], n) => ks.forEach((k) => { KGROUP[k] = n; }));
  const COMMON_M = ['inv', 'liab', 'org'];
  const STOPW = new Set(('with from into after during while over under near about against without within when where that this than their there were been being have also only more most less other another some such each upon '
    + 'worker workers employee employees killed died dies death injured injury injuries fined company companies case cases report reports accident accidents incident incidents contact harmful substances substance classified agent type manufacturing industry').split(' '));
  const TERMS = new Map();
  const termsOf = (x) => { if (!TERMS.has(x)) TERMS.set(x, new Set((String((x.title && x.title.en) || '').toLowerCase().match(/[a-z][a-z0-9]{3,}/g) || []).filter((w) => !STOPW.has(w)))); return TERMS.get(x); };
  function related(it, max) {
    const g = KGROUP[it.k]; if (g == null || g > 1) return [];
    const share = (a, b) => a.filter((v) => b.includes(v)).length;
    const im = it.m.filter((v) => !COMMON_M.includes(v)), ii = it.i.filter((v) => v !== 'all'), ia = it.a.filter((v) => v !== 'other');
    const t0 = termsOf(it), scored = [];
    ITEMS.forEach((x) => {
      if (x === it || KGROUP[x.k] !== g || !x.c.length || x.c.some((c) => it.c.includes(c))) return;
      const ha = share(it.h, x.h) + share(ia, x.a);
      if ((it.h.length || ia.length) && !ha) return;
      let tw = 0;
      if (ha) { const tx = termsOf(x); t0.forEach((w) => { if (tx.has(w)) tw += 1; }); }
      const s = ha * 3 + Math.min(2, share(im, x.m)) + share(ii, x.i) + Math.min(2, tw);
      if (s >= 3) scored.push([s, x]);
    });
    scored.sort((p, q) => q[0] - p[0] || sortKey(q[1]).localeCompare(sortKey(p[1])) || p[1].id.localeCompare(q[1].id));
    const per = {}, out = [];
    for (const [, x] of scored) { const c = x.c[0]; per[c] = (per[c] || 0) + 1; if (per[c] > 2) continue; out.push(x); if (out.length >= max) break; }
    return out;
  }
  function relatedBox(it) {
    const rel = related(it, 8); if (!rel.length) return '';
    return `<section class="lib-rel"><h3>${T('다른 나라의 같은 주제', 'Same topic in other countries')}</h3>
      <p class="xs muted">${T('위험 요인·사고 유형·관리 주제·업종이 겹치는 다른 나라 자료입니다(분류로 자동 추천, 내용 비교는 각 원문으로).', 'Items from other countries that share hazards, accident types, topics or industries (suggested from the categories; compare the substance in each original).')}</p>
      <ul>${rel.map((x) => { const t = L(x.title), s = t.length > 90 ? t.slice(0, 89) + '…' : t; return `<li><span class="chip">${esc(lab('c', x.c[0]))}</span> ${kindChip(x)} <a href="${hrefOf(x)}"${s !== t ? ` title="${esc(t)}"` : ''}>${esc(s)}</a> <span class="xs muted">${esc(dateText(x))}</span></li>`; }).join('')}</ul></section>`;
  }
  function details(it, pr) {
    const row = (k, v) => (v ? (pr ? `<tr><th>${esc(k)}</th><td>${v}</td></tr>` : `<dt>${esc(k)}</dt><dd>${v}</dd>`) : '');
    const list = (f, vs) => vs.map((v) => esc(lab(f, v))).join(', ');
    const d2 = it.d2 ? `${it.d2l ? L(it.d2l) : T('최종보고서 공개', 'final report')} ${it.d2}` : it.open ? T('조사 진행 중 — 최종보고서 미공개', 'investigation ongoing — no final report yet') : '';
    const rows = row(T('유형', 'Type'), esc(lab('k', it.k))) + row(T('나라·지역', 'Country / region'), list('c', it.c)) + row(T('날짜·연도', 'Date / year'), esc(dateText(it)) + (d2 ? ` <span class="${pr ? 'doc-small' : 'xs muted'}">(${esc(d2)})</span>` : ''))
      + row(T('기관', 'Body'), esc(L(it.org) || '')) + row(L(ORIG_L[it.ol] || ORIG_L.ja), it.orig ? `<span lang="${esc(it.ol || 'ja')}">${esc(it.orig)}</span>` : '') + row(T('장소', 'Place'), esc(locOf(it))) + row(T('규모·피해', 'Size / harm'), esc(it.size ? L(it.size) : ''))
      + row(T('산업·업종', 'Industry'), list('i', it.i)) + row(T('사고 유형', 'Accident type'), list('a', it.a)) + row(T('위험 요인', 'Hazard'), list('h', it.h))
      + row(T('관리 주제', 'Topic'), list('m', it.m)) + row(T('출처 등급', 'Source tier'), esc(lab('t', it.tier))) + row(T('원문 확인', 'Checked'), esc(it.checked || ''));
    return pr ? `<table class="doc-table doc-kv"><tbody>${rows}</tbody></table>` : `<dl class="kv lib-kv">${rows}</dl>`;
  }
  function itemBody(it) {
    const sums = [].concat(L(it.sum) || []);
    return `${details(it)}
      ${sums.length ? `<div class="bk-sum"><b>${T('요약', 'Summary')}</b><ul>${sums.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
      <div class="lib-links">${urlOf(it) ? ext(urlOf(it), T('원문 열기', 'Open the original')) : ''}${it.href ? `<a href="${esc(it.href)}">${T('포털 화면으로', 'Open in the portal')} →</a>` : ''}${(it.go || []).map(([h, l]) => { const lt = esc(typeof l === 'function' ? l() : L(l)); return /^https?:\/\//.test(h) ? ext(h, lt) : `<a href="${esc(h)}">${lt}</a>`; }).join('')}</div>
      ${it.src.length ? `<p class="bk-cite">${T('출처', 'Sources')} ${S.cite(it.src)}</p>` : ''}`;
  }
  function renderItem(id) {
    const it = IDX[id], sel = getSel();
    const same = encode({ s: { k: [it.k], c: it.c.slice(0, 1) }, q: '' });
    return `${ui.head(`<a href="#book/find">${T('자료 라이브러리', 'Resource library')}</a> · ${esc(lab('k', it.k))}`, esc(L(it.title)))}
      <article class="panel lib-item" id="anchor-item/${esc(id)}">
        <div class="bk-actions"><label class="bk-pick"><input type="checkbox" data-bk-sel="${esc(id)}" ${sel.includes(id) ? 'checked' : ''}> ${T('이 자료 고르기', 'Select this item')}</label>
          <a class="btn ghost sm" href="#book/sel">${T('고른 자료 모아 보기', 'Read selected')} <span class="num" data-bk-n>${sel.length}</span></a>
          <a class="btn ghost sm print-link" href="#print/book/${esc(id)}">${S.ICON_PRINT}${T('이 자료 PDF', 'This item as PDF')}</a>
          <a class="btn ghost sm" href="#book/find/${same}">${T('같은 유형·나라 자료', 'Same type and country')}</a></div>
        ${itemBody(it)}
        ${relatedBox(it)}
      </article>`;
  }
  /* 모아 보기·인쇄에서 쓰는 자료 한 건 */
  function itemArticle(id) {
    const it = IDX[id];
    return `<article class="panel bk-sec lib-item" data-bk-art="${esc(id)}"><div class="section-title"><h2>${kindChip(it)} ${esc(L(it.title))}</h2><span class="sub"><a href="${hrefOf(it)}">${T('자료 화면', 'Open item')}</a> · <button type="button" class="linkish" data-bk-drop="${esc(id)}">${T('빼기', 'Remove')}</button></span></div>${itemBody(it)}</article>`;
  }
  function itemPrint(id, brk) {
    const it = IDX[id], sums = [].concat(L(it.sum) || []);
    const u0 = urlOf(it), u = u0 ? (S.state.lang === 'en' ? (() => { try { return encodeURI(decodeURI(u0)); } catch (e) { return u0; } })() : u0) : '';
    return `<section class="doc-bk${brk ? ' brk' : ''}"><h2>${esc(L(it.title))}</h2>${details(it, true)}
      ${sums.length ? `<div class="doc-bk-sum"><b>${T('요약', 'Summary')}</b><ul>${sums.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
      ${u ? `<p class="doc-small">${T('원문', 'Original')}: <span class="doc-url">${esc(u)}</span></p>` : ''}${it.src.length ? `<p class="doc-small">${T('출처', 'Sources')} ${S.cite(it.src)}</p>` : ''}</section>`;
  }

  S.libApi = {
    ITEMS, IDX, has: (id) => !!IDX[id], get: (id) => IDX[id], count: () => ITEMS.length,
    order: (ids) => ids.filter((id) => IDX[id]).sort((a, b) => (KIND_ORDER.indexOf(IDX[a].k) - KIND_ORDER.indexOf(IDX[b].k)) || sortKey(IDX[b]).localeCompare(sortKey(IDX[a])) || a.localeCompare(b)),
    srcOf: (id) => (IDX[id] ? IDX[id].src : []), title: (id) => (IDX[id] ? L(IDX[id].title) : id),
    renderFind, mountFind, renderItem, itemArticle, itemPrint, encode, parseSub, relatedBox
  };
})();

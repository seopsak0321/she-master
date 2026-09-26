/* 안전 정보 자료실 — 가나다(A–Z)·유형·주제별 리스트, 검색 분류·키워드, 정렬, 페이지당 개수, 페이지 이동 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui;
  const CHO = ['가', '가', '나', '다', '다', '라', '마', '바', '바', '사', '사', '아', '자', '자', '차', '카', '타', '파', '하'];
  const KO_ROW = ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하'];
  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const PER = [10, 20, 30, 50];
  const DEF = { view: 'az', letter: 'all', type: 'all', subj: 'all', field: 'all', q: '', sort: 'name', dir: 'asc', per: 10, page: 1 };

  /* first letter of a name: Hangul syllable → its row (가…하), Latin → A–Z, anything else → 'etc' */
  const initial = (s) => {
    const c = String(s).trim().charAt(0), code = c.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) return CHO[Math.floor((code - 0xAC00) / 588)];
    return /[a-z]/i.test(c) ? c.toUpperCase() : 'etc';
  };
  const flat = (x) => (x == null ? '' : Array.isArray(x) ? x.join(' ') : String(x));
  const both = (o) => (o == null ? '' : typeof o === 'string' ? o : flat(o.ko) + ' ' + flat(o.en));
  const host = (u) => { try { return new URL(u).host; } catch (e) { return u; } };
  const state = () => {
    const s = Object.assign({}, DEF, S.load('res.st', {}));
    if (!PER.includes(Number(s.per))) s.per = 10;
    s.per = Number(s.per);
    return s;
  };
  const put = (s) => { S.save('res.st', s); S.refresh(); };
  const FIELDS = () => [['all', T('전체', 'All')], ['name', T('자료명', 'Name')], ['org', T('제공기관', 'Provider')], ['type', T('자료유형', 'Type')], ['desc', T('내용', 'Content')], ['url', 'URL']];
  const SORTS = () => [['name', T('가나다순', 'Name')], ['type', T('자료유형순', 'Type')], ['checked', T('확인일순', 'Date checked')]];

  function hay(r, f) {
    const name = both(r.name), org = both(r.org), type = both(S.RES_TYPES[r.type]) + ' ' + r.subj.map((x) => both(S.RES_SUBJECTS[x])).join(' ');
    const desc = both(r.desc), url = r.url;
    const v = f === 'name' ? name : f === 'org' ? org : f === 'type' ? type : f === 'desc' ? desc : f === 'url' ? url : [name, org, type, desc, url].join(' ');
    return v.toLowerCase();
  }
  const toks = (q) => String(q || '').toLowerCase().split(/\s+/).filter(Boolean);

  function filtered(s) {
    let list = S.RESOURCES.slice();
    if (s.view === 'az' && s.letter !== 'all') list = list.filter((r) => initial(L(r.name)) === s.letter);
    if (s.view === 'topic') {
      if (s.type !== 'all') list = list.filter((r) => r.type === s.type);
      if (s.subj !== 'all') list = list.filter((r) => r.subj.includes(s.subj));
    }
    const tk = toks(s.q);
    if (tk.length) list = list.filter((r) => { const h = hay(r, s.field), hn = h.replace(/\s+/g, ''); return tk.every((t) => h.includes(t) || hn.includes(t)); });
    const loc = S.state.lang === 'en' ? 'en' : 'ko';
    const byName = (a, b) => L(a.name).localeCompare(L(b.name), loc);
    const order = Object.keys(S.RES_TYPES);
    list.sort(s.sort === 'type' ? (a, b) => order.indexOf(a.type) - order.indexOf(b.type) || byName(a, b)
      : s.sort === 'checked' ? (a, b) => a.checked.localeCompare(b.checked) || byName(a, b) : byName);
    if (s.dir === 'desc') list.reverse();
    return list;
  }

  const mk = (raw, q) => (S.markText ? S.markText(raw, toks(q)) : S.esc(raw));
  function card(r, s, hl) {
    return `<article class="res ${hl ? 'hl' : ''}" id="res-${r.id}">
      <div class="res-head">
        <h3><a href="${S.esc(r.url)}" target="_blank" rel="noopener noreferrer">${mk(L(r.name), s.field === 'all' || s.field === 'name' ? s.q : '')}<span class="ext" aria-hidden="true">↗</span><span class="sr">${T(' (새 창)', ' (opens in a new window)')}</span></a></h3>
        <div class="row"><span class="chip">${L(S.RES_TYPES[r.type])}</span><span class="chip">${L(S.RES_LANG[r.lang])}</span><span class="chip">${L(S.RES_ACCESS[r.access])}</span></div>
      </div>
      <div class="small muted">${mk(L(r.org), s.field === 'all' || s.field === 'org' ? s.q : '')} · <span class="mono">${S.esc(host(r.url))}</span></div>
      <ul class="res-desc">${L(r.desc).map((d) => `<li>${mk(d, s.field === 'all' || s.field === 'desc' ? s.q : '')}</li>`).join('')}</ul>
      <div class="res-meta">
        <span><b>${T('자료유형', 'Type')}</b>${L(S.RES_TYPES[r.type])}</span>
        <span><b>${T('주제분야', 'Subjects')}</b>${r.subj.map((x) => L(S.RES_SUBJECTS[x])).join(', ')}</span>
        <span><b>${T('포털 활용', 'Used in')}</b>${r.use.map((u) => `<a href="#${u}">${S.esc(S.routeName(u))}</a>`).join(' · ')}</span>
        ${r.src ? `<span><b>${T('포털 인용', 'Cited as')}</b>${S.cite(r.src)}</span>` : ''}
        <span class="muted">${T('확인', 'Checked')} <span class="num">${r.checked}</span></span>
      </div>
    </article>`;
  }

  /* resolve the view for a deep link #resources/<id>: clear filters and open the page that contains it */
  function resolve(sub) {
    let s = state();
    if (S.state.lang === 'en' && (KO_ROW.includes(s.letter) || s.letter === 'etc')) s.letter = 'all';   /* the Hangul row is hidden in English */
    const focus = sub ? S.RESOURCES.find((r) => r.id === sub) : null;
    if (focus) s = Object.assign(s, { letter: 'all', type: 'all', subj: 'all', q: '', field: 'all' });
    const list = filtered(s);
    const pages = Math.max(1, Math.ceil(list.length / s.per));
    s.page = Math.min(Math.max(1, Number(s.page) || 1), pages);
    if (focus) { const i = list.findIndex((r) => r.id === focus.id); if (i >= 0) s.page = Math.floor(i / s.per) + 1; }
    return { s, list, pages, focus };
  }

  S.pages.resources = {
    render(sub) {
      const { s, list, pages, focus } = resolve(sub);
      const shown = list.slice((s.page - 1) * s.per, s.page * s.per);
      const from = list.length ? (s.page - 1) * s.per + 1 : 0, to = (s.page - 1) * s.per + shown.length;
      const cnt = {}; S.RESOURCES.forEach((r) => { const k = initial(L(r.name)); cnt[k] = (cnt[k] || 0) + 1; });
      const letterBtn = (k, label) => `<button type="button" data-rl="${k}" aria-pressed="${s.letter === k}" ${k !== 'all' && !cnt[k] && s.letter !== k ? 'disabled' : ''} title="${k === 'all' ? '' : T(`${cnt[k] || 0}건`, `${cnt[k] || 0}`)}">${label}</button>`;
      const chipBtn = (attr, k, label, n, cur) => `<button type="button" class="fchip" data-${attr}="${k}" aria-pressed="${cur === k}">${label}<span class="num">${n}</span></button>`;
      return `
      ${ui.head(T('라이브러리', 'Library'), T('안전 정보 자료실', 'Resource library'),
        T(`포털을 만들며 직접 확인한 공식 사이트 ${S.RESOURCES.length}곳입니다.`, `${S.RESOURCES.length} official sites checked while building the portal.`),
        T('SK하이닉스 공식 채널, 국내 법령·공공기관, 해외 규제기관·국제 표준, 화학물질 데이터베이스, 반도체 기업·산업계의 안전 프로그램, 사고 교훈 영상·교육자료를 가나다·유형·주제로 찾을 수 있습니다.',
          'SK hynix channels, Korean law and agencies, foreign regulators and standards, chemical databases, safety programmes of chipmakers and industry bodies, incident videos and learning material — browse A–Z, by type or by subject.'))}
      <section class="panel stack" id="res-top">
        <div class="tabs" role="tablist" aria-label="${T('목록 방식', 'List view')}">
          <button type="button" role="tab" data-rv="az" aria-selected="${s.view === 'az'}">${T('가나다 리스트', 'A–Z list')}</button>
          <button type="button" role="tab" data-rv="topic" aria-selected="${s.view === 'topic'}">${T('유형·주제별 리스트', 'By type & subject')}</button>
        </div>
        ${s.view === 'az' ? `<div class="letters" role="group" aria-label="${T('첫 글자', 'First letter')}">
            <div class="letter-row">${letterBtn('all', T('전체', 'All'))}${AZ.map((k) => letterBtn(k, k)).join('')}</div>
            ${S.state.lang === 'ko' ? `<div class="letter-row">${KO_ROW.map((k) => letterBtn(k, k)).join('')}${letterBtn('etc', '기타')}</div>` : ''}
          </div>`
        : `<div class="facets">
            <div class="facet"><span class="lbl">${T('자료유형', 'Type')}</span><div class="row">${chipBtn('rt', 'all', T('전체', 'All'), S.RESOURCES.length, s.type)}${Object.keys(S.RES_TYPES).map((k) => chipBtn('rt', k, L(S.RES_TYPES[k]), S.RESOURCES.filter((r) => r.type === k).length, s.type)).join('')}</div></div>
            <div class="facet"><span class="lbl">${T('주제분야', 'Subject')}</span><div class="row">${chipBtn('rs', 'all', T('전체', 'All'), S.RESOURCES.length, s.subj)}${Object.keys(S.RES_SUBJECTS).map((k) => chipBtn('rs', k, L(S.RES_SUBJECTS[k]), S.RESOURCES.filter((r) => r.subj.includes(k)).length, s.subj)).join('')}</div></div>
          </div>`}
        <form class="res-search" id="resForm" role="search">
          <select id="res-field" aria-label="${T('검색 분류', 'Search field')}">${FIELDS().map(([v, l]) => `<option value="${v}" ${s.field === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
          <input type="search" id="res-q" value="${S.esc(s.q)}" placeholder="${T('검색 키워드', 'Keyword')}" aria-label="${T('검색 키워드', 'Keyword')}">
          <button class="btn" type="submit">${T('검색', 'Search')}</button>
          <button class="btn ghost" type="button" id="res-reset">${T('초기화', 'Reset')}</button>
        </form>
      </section>
      <section class="stack" id="res-list">
        <div class="res-bar">
          <span class="small"><b class="num">${from}–${to}</b>${T('건 출력', ' shown')} / ${T('총', 'of')} <b class="num">${list.length}</b>${T('건', '')}${s.q ? ` · ${T('검색어', 'keyword')} “${S.esc(s.q)}”` : ''}</span>
          <span class="row" style="gap:6px">
            <select id="res-sort" aria-label="${T('정렬 기준', 'Sort by')}">${SORTS().map(([v, l]) => `<option value="${v}" ${s.sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
            <select id="res-dir" aria-label="${T('정렬 순서', 'Order')}"><option value="asc" ${s.dir === 'asc' ? 'selected' : ''}>${T('오름차순', 'Ascending')}</option><option value="desc" ${s.dir === 'desc' ? 'selected' : ''}>${T('내림차순', 'Descending')}</option></select>
            <select id="res-per" aria-label="${T('페이지당 개수', 'Per page')}">${PER.map((p) => `<option value="${p}" ${s.per === p ? 'selected' : ''}>${T(`${p}개씩 보기`, `${p} per page`)}</option>`).join('')}</select>
          </span>
        </div>
        <div class="res-list">${shown.map((r) => card(r, s, focus && focus.id === r.id)).join('') || `<div class="callout small">${T('조건에 맞는 자료가 없습니다. 첫 글자·유형·주제를 ‘전체’로 바꾸거나 검색 분류를 ‘전체’로 해 보세요.', 'Nothing matches. Set the letter, type or subject back to “All”, or search in all fields.')}</div>`}</div>
        ${pages > 1 ? `<nav class="pager" aria-label="${T('페이지 이동', 'Pages')}"><button type="button" data-rp="prev" ${s.page === 1 ? 'disabled' : ''} aria-label="${T('이전 페이지', 'Previous page')}">‹</button>${Array.from({ length: pages }, (_, i) => `<button type="button" data-rp="${i + 1}" ${s.page === i + 1 ? 'aria-current="page"' : ''}>${i + 1}</button>`).join('')}<button type="button" data-rp="next" ${s.page === pages ? 'disabled' : ''} aria-label="${T('다음 페이지', 'Next page')}">›</button></nav>` : ''}
        <p class="xs muted">${T('자료명을 누르면 원문 사이트가 새 창으로 열립니다. 내용과 주소는 확인일 기준이며 바뀔 수 있고, 이용 조건(로그인·유료)은 각 기관의 정책을 따릅니다. 포털 본문의 근거 출처 전체는 ', 'Names open the original site in a new window. Content and addresses are as of the date checked and may change; access terms (login, paid) follow each provider. For every citation behind the portal, see ')}<a href="#sources">${T('출처·검증', 'Sources & verification')}</a>${T('에 있습니다.', '.')}</p>
      </section>`;
    },
    mount(root, sub) {
      const { s, focus } = resolve(sub);
      if (focus) {
        S.save('res.st', s);
        history.replaceState(null, '', '#resources');   /* later filter changes should not re-apply the deep link */
        if (!S.state.refreshing) setTimeout(() => { const el = root.querySelector('#res-' + focus.id); if (el) el.scrollIntoView({ block: 'center' }); }, 0);
      }
      const upd = (patch, toList) => { put(Object.assign(state(), patch)); if (toList) { const t = document.getElementById('res-list'); if (t) t.scrollIntoView({ block: 'start' }); } };
      root.querySelectorAll('[data-rv]').forEach((b) => b.addEventListener('click', () => upd({ view: b.dataset.rv, page: 1 })));
      root.querySelectorAll('[data-rl]').forEach((b) => b.addEventListener('click', () => upd({ letter: b.dataset.rl, page: 1 })));
      root.querySelectorAll('[data-rt]').forEach((b) => b.addEventListener('click', () => upd({ type: b.dataset.rt, page: 1 })));
      root.querySelectorAll('[data-rs]').forEach((b) => b.addEventListener('click', () => upd({ subj: b.dataset.rs, page: 1 })));
      root.querySelector('#resForm').addEventListener('submit', (e) => { e.preventDefault(); upd({ field: root.querySelector('#res-field').value, q: root.querySelector('#res-q').value.trim(), page: 1 }); });
      root.querySelector('#res-reset').addEventListener('click', () => upd({ letter: 'all', type: 'all', subj: 'all', field: 'all', q: '', page: 1 }));
      root.querySelector('#res-sort').addEventListener('change', (e) => upd({ sort: e.target.value, page: 1 }));
      root.querySelector('#res-dir').addEventListener('change', (e) => upd({ dir: e.target.value, page: 1 }));
      root.querySelector('#res-per').addEventListener('change', (e) => upd({ per: Number(e.target.value), page: 1 }));
      root.querySelectorAll('[data-rp]').forEach((b) => b.addEventListener('click', () => {
        const v = b.dataset.rp;   /* s.page is the page actually shown (clamped), not the stored one */
        upd({ page: v === 'prev' ? s.page - 1 : v === 'next' ? s.page + 1 : Number(v) }, true);
      }));
    }
  };
})();

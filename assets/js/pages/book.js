/* SHE 가이드북 (#book) — 편·장·절 목차(접기·체크 상자), 검색·필터(나라·분야·수준), 절 화면(#book/<id>: 핵심 요약·출처·이전/다음),
   고른 절 모아 보기(#book/sel), 인쇄·PDF(#print/book/sel|all|<id> — print.js가 S.bookApi로 그린다).
   고른 절(book.sel)·필터(book.f)·접힌 장(book.fold)은 이 브라우저에만 저장한다. 내용은 data/book.js의 SHE.BOOK */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui, esc = S.esc;
  const BK = S.BOOK || [];

  /* ---------- 색인: 절 id → { s 절, p 편, c 장, num '1.2.1' } — 번호는 목차 순서에서 자동으로 매긴다 ---------- */
  const IDX = {}, ORDER = [];
  BK.forEach((p) => (p.ch || []).forEach((c, ci) => {
    c.num = `${p.no}.${ci + 1}`;
    (c.sec || []).forEach((s, si) => { IDX[s.id] = { s, p, c, num: `${c.num}.${si + 1}` }; ORDER.push(s.id); });
  }));
  const PUB = ORDER.filter((id) => IDX[id].s.st === 'ok');   /* 원문 확인을 마친 절만 목차·검색·PDF에 나온다 */
  S.BOOK_IDX = IDX; S.BOOK_ORDER = ORDER;

  const partLabel = (p) => (p.no === 'A' ? L(p.t) : T(`${p.no}편 `, `Part ${p.no} · `) + L(p.t));
  const ctyName = (k) => L(S.BOOK_CTY[k]);

  /* ---------- 저장값 ---------- */
  const getSel = () => { const v = S.load('book.sel', []); return Array.isArray(v) ? PUB.filter((id) => v.includes(id)) : []; };
  const putSel = (ids) => S.save('book.sel', PUB.filter((id) => ids.includes(id)));
  const FDEF = { q: '', cty: 'all', fld: 'all', lv: 'all' };
  const fst = () => { const v = S.load('book.f', null); return Object.assign({}, FDEF, v && typeof v === 'object' ? v : {}); };
  const folded = () => { const v = S.load('book.fold', []); return Array.isArray(v) ? v : []; };

  /* ---------- 글자 ---------- */
  /* **굵게**, {{절 id}} → 절 번호 링크(인쇄에서는 번호만) */
  const inl = (s, pr) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\{\{([\w-]+)\}\}/g, (m, id) => {
    const x = IDX[id]; if (!x) return esc(id);
    return pr ? x.num : `<a class="bk-ref" href="#book/${id}" title="${esc(L(x.s.t))}">${x.num}</a>`;
  });
  const plain = (s) => String(s == null ? '' : s).replace(/\*\*(.+?)\*\*/g, '$1').replace(/\{\{([\w-]+)\}\}/g, (m, id) => (IDX[id] ? IDX[id].num : id));
  const isCty = (c) => typeof c === 'string' && c.charAt(0) === '@' && !!S.BOOK_CTY[c.slice(1)];
  const cellTxt = (c) => (isCty(c) ? ctyName(c.slice(1)) : L(c));
  const cites = (b) => (b.src && b.src.length ? S.cite(b.src) : '');

  /* 검색용 본문 — 현재 언어의 요약·블록 글자 */
  S.bookText = function (s) {
    const out = [];
    const add = (v) => { if (v == null) return; if (Array.isArray(v)) v.forEach(add); else out.push(plain(v)); };
    add(L(s.sum));
    (s.body || []).forEach((b) => {
      if (b.t) add(L(b.t));
      if (b.cap) add(L(b.cap));
      if (b.head) add(L(b.head));
      (b.rows || []).forEach((r) => r.forEach((c) => add(cellTxt(c))));
      (b.items || []).forEach((it) => add(L(it[1])));
    });
    return out.join(' ');
  };

  /* ---------- 블록 (pr: 인쇄용) ---------- */
  function planTable(pr) {
    const rows = BK.map((p) => {
      const chs = p.ch.map((c) => {
        const n = (c.sec || []).filter((s) => s.st === 'ok').length;
        const label = `${c.num} ${L(c.t)}`;
        const st = c.plan ? `${T('준비 중', 'Planned')} · ${c.plan}` : T(`공개 ${n}절`, `${n} published`);
        if (pr) return `<li>${esc(label)} <span class="doc-small">[${esc(st)}]</span></li>`;
        return `<li class="${c.plan ? 'plan' : 'pub'}">${c.plan ? `<span>${esc(label)}</span>` : `<a href="#book/${c.sec[0].id}">${esc(label)}</a>`} <span class="chip ${c.plan ? 'plan' : 'pub'}">${esc(st)}</span></li>`;
      }).join('');
      return `<tr><th scope="row">${esc(partLabel(p))}</th><td><ul class="${pr ? '' : 'bk-plan-list'}">${chs}</ul></td></tr>`;
    }).join('');
    const head = `<thead><tr><th scope="col">${T('편', 'Part')}</th><th scope="col">${T('장과 진행 상태', 'Chapters and status')}</th></tr></thead>`;
    return pr ? `<table class="doc-table">${head}<tbody>${rows}</tbody></table>` : `<div class="table-wrap"><table class="data bk-tbl bk-plan">${head}<tbody>${rows}</tbody></table></div>`;
  }

  function blk(b, pr) {
    const t = b.t ? L(b.t) : null, cite = cites(b);
    const srcLine = (lbl) => (cite ? (pr ? `<p class="doc-small">${lbl} ${cite}</p>` : `<div class="bk-cite">${lbl} ${cite}</div>`) : '');
    switch (b.k) {
      case 'p': return `<p>${inl(t, pr)}${cite ? ' ' + cite : ''}</p>`;
      case 'h': return pr ? `<h3>${inl(t, pr)}</h3>` : `<h3 class="sub-h bk-h">${inl(t)}</h3>`;
      case 'ul': case 'ol': return `<${b.k}${pr ? '' : ' class="bk-list"'}>${t.map((x) => `<li>${inl(x, pr)}</li>`).join('')}</${b.k}>${srcLine(T('출처', 'Sources'))}`;
      case 'tbl': {
        const head = L(b.head), cap = b.cap ? L(b.cap) : '';
        const rows = b.rows.map((r) => `<tr>${r.map((c, i) => (i === 0 && isCty(c) ? `<th scope="row">${esc(cellTxt(c))}</th>` : `<td>${inl(cellTxt(c), pr)}</td>`)).join('')}</tr>`).join('');
        const tag = b.cmp ? T('나라별 비교', 'Country comparison') : '';
        if (pr) return `${tag || cap ? `<p class="doc-small">${tag ? `[${tag}] ` : ''}${esc(cap)}</p>` : ''}<table class="doc-table"><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>${srcLine(T('출처', 'Sources'))}`;
        return `${tag || cap ? `<div class="bk-cap">${tag ? `<span class="bk-tag cmp">${tag}</span>` : ''}${cap ? `<span>${esc(cap)}</span>` : ''}</div>` : ''}<div class="table-wrap"><table class="data bk-tbl${b.cmp ? ' bk-cmp' : ''}"><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>${srcLine(T('출처', 'Sources'))}`;
      }
      case 'syn': {
        const items = t.map((x) => `<li>${inl(x, pr)}</li>`).join('');
        if (pr) return `<div class="doc-syn"><b>${T('정리', 'Synthesis')}</b> <span class="doc-small">${T('작성자가 원문을 비교·요약한 부분', 'compared and summarised by the author from the originals')}</span><ul>${items}</ul>${srcLine(T('근거', 'Based on'))}</div>`;
        return `<aside class="bk-syn" aria-label="${T('정리', 'Synthesis')}"><div class="bk-syn-h"><span class="bk-tag syn">${T('정리', 'Synthesis')}</span><span>${T('작성자가 원문을 비교·요약한 부분입니다. 근거가 된 원문 번호를 함께 붙였습니다.', 'Compared and summarised by the author; the originals it rests on are cited.')}</span></div><ul class="bk-list">${items}</ul>${srcLine(T('근거', 'Based on'))}</aside>`;
      }
      case 'note': return pr ? `<p class="doc-note">※ ${inl(t, pr)}${cite ? ' ' + cite : ''}</p>` : `<div class="callout warn small">${inl(t)}${cite ? ' ' + cite : ''}</div>`;
      case 'q': return `<div class="${pr ? 'doc-q' : 'bk-q'}"><b>${T('학습 확인', 'Check your understanding')}</b> <span class="${pr ? 'doc-small' : 'xs muted'}">${T('답은 이 절의 본문에 있습니다', 'The answers are in this section')}</span><ol>${t.map((x) => `<li>${inl(x, pr)}</li>`).join('')}</ol></div>`;
      case 'go': return pr ? '' : `<div class="bk-go"><span class="lbl">${T('포털에서 해 보기', 'Try it in the portal')}</span><ul>${b.items.map(([h, l]) => `<li><a href="${esc(h)}">${esc(L(l))}</a></li>`).join('')}</ul></div>`;
      case 'plan': return planTable(pr);
    }
    return '';
  }

  /* 절의 출처 id — 블록 순서대로, 중복 없이 */
  const srcIds = (ids) => {
    const out = [];
    [].concat(ids).forEach((id) => (IDX[id].s.body || []).forEach((b) => [].concat(b.src || []).forEach((x) => { if (!out.includes(x)) out.push(x); })));
    return out;
  };
  const shownUrl = (u) => { if (S.state.lang !== 'en') return u; try { return encodeURI(decodeURI(u)); } catch (e) { return u; } };
  function srcItems(ids, pr) {
    return ids.map((id) => {
      const i = S.srcIndex(id); if (!i) return '';
      const x = S.SOURCES[i - 1];
      return pr ? `<li><b>[${i}]</b> ${esc(L(x.title))}<br><span class="doc-url">${esc(shownUrl(x.url))}</span> · ${T('확인', 'checked')} ${x.checked}</li>`
        : `<li><a class="src" href="#sources/${id}">[${i}]</a> <a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(L(x.title))}<span class="ext" aria-hidden="true">↗</span><span class="sr-only">${T(' (새 창)', ' (opens in a new window)')}</span></a> <span class="xs muted">${T('확인', 'checked')} ${x.checked}</span></li>`;
    }).join('');
  }

  const chips = (s) => (s.cty || []).map((k) => `<span class="chip bk-cty">${esc(ctyName(k))}</span>`).join('')
    + `<span class="chip">${esc(L(S.BOOK_LV[s.lv]))}</span>`;
  const status = (s) => (s.meta ? `<span class="chip">${T('가이드북 안내', 'About the book')}</span>` : `<span class="chip ok-chip" title="${esc(T('작성자가 원문을 직접 읽고 확인한 날짜', 'Date the author checked the originals'))}">${T('원문 확인', 'Checked')} ${s.checked}</span>`);

  /* 절 본문 — 화면용 */
  function secBody(id) {
    const x = IDX[id], s = x.s, ids = srcIds(id);
    return `<div class="bk-sum"><b>${T('핵심 요약', 'Key points')}</b><ul>${L(s.sum).map((v) => `<li>${inl(v)}</li>`).join('')}</ul></div>
      <div class="bk-body">${(s.body || []).map((b) => blk(b)).join('')}</div>
      ${ids.length ? `<section class="bk-srcs"><h3>${T('이 절의 출처', 'Sources for this section')} <span class="xs muted">${T(`${ids.length}건 · 번호는 포털 출처 목록 번호`, `${ids.length} · numbers match the portal source list`)}</span></h3><ol>${srcItems(ids)}</ol></section>` : ''}`;
  }
  /* 인쇄용 절 (print.js) */
  function secPrint(id, brk) {
    const x = IDX[id], s = x.s;
    const meta = [`${partLabel(x.p)} › ${x.c.num} ${L(x.c.t)}`, (s.cty || []).map(ctyName).join(', '), L(S.BOOK_LV[s.lv]), s.meta ? T('가이드북 안내', 'About the book') : `${T('원문 확인', 'Checked')} ${s.checked}`].filter(Boolean);
    return `<section class="doc-bk${brk ? ' brk' : ''}"><h2>${x.num} ${esc(L(s.t))}</h2><p class="doc-small">${meta.map(esc).join(' · ')}</p>
      <div class="doc-bk-sum"><b>${T('핵심 요약', 'Key points')}</b><ul>${L(s.sum).map((v) => `<li>${inl(v, 1)}</li>`).join('')}</ul></div>
      ${(s.body || []).map((b) => blk(b, 1)).join('')}</section>`;
  }
  S.bookApi = { IDX, PUB, getSel, partLabel, secPrint, srcIds, srcPrint: (ids) => srcItems(ids, 1) };

  /* ---------- 목차 (#book) ---------- */
  function rowHtml(id, sel) {
    const x = IDX[id], s = x.s, t = L(s.t);
    return `<li class="bk-row" data-bk-row data-id="${id}">
      <input type="checkbox" data-bk-sel="${id}" ${sel.includes(id) ? 'checked' : ''} aria-label="${esc(T(`${x.num} ${t} 고르기`, `Select ${x.num} ${t}`))}">
      <div class="bk-row-main"><a href="#book/${id}"><span class="bk-n">${x.num}</span> <span data-bk-t>${esc(t)}</span></a>
        <div class="bk-chips">${chips(s)}</div><div class="bk-snip" data-bk-snip hidden></div></div></li>`;
  }
  function chHtml(c, sel, fold) {
    if (c.plan) return `<li class="bk-ch plan" data-bk-plan><span class="bk-n">${c.num}</span><span>${esc(L(c.t))}</span><span class="chip plan" title="${esc(L(S.BOOK_STAGE[c.plan]))}">${T('준비 중', 'Planned')} · ${esc(c.plan)}</span></li>`;
    const ids = c.sec.filter((s) => s.st === 'ok').map((s) => s.id), open = !fold.includes(c.id);
    return `<li class="bk-ch" data-bk-ch="${c.id}">
      <div class="bk-ch-head"><input type="checkbox" data-bk-cchk="${c.id}" aria-label="${esc(T(`${c.num} ${L(c.t)} — 장 전체 고르기`, `Select all of ${c.num} ${L(c.t)}`))}">
        <button type="button" class="bk-fold" data-bk-fold="${c.id}" aria-expanded="${open}" aria-controls="bkc-${c.id}"><svg class="chev" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg><span class="bk-n">${c.num}</span><span class="bk-ct">${esc(L(c.t))}</span><span class="num muted">${ids.length}</span></button></div>
      <ol class="bk-secs" id="bkc-${c.id}" ${open ? '' : 'hidden'}>${ids.map((id) => rowHtml(id, sel)).join('')}</ol></li>`;
  }
  function partHtml(p, sel, fold) {
    const n = p.ch.reduce((a, c) => a + (c.sec || []).filter((s) => s.st === 'ok').length, 0);
    const nPlan = p.ch.filter((c) => c.plan).length;
    return `<section class="panel bk-part" data-bk-part="${p.id}">
      <div class="section-title"><h2>${n ? `<input type="checkbox" data-bk-pchk="${p.id}" aria-label="${esc(T(`${partLabel(p)} — 편 전체 고르기`, `Select all of ${partLabel(p)}`))}">` : ''}<span>${esc(partLabel(p))}</span></h2>
        <span class="sub">${n ? T(`공개 ${n}절`, `${n} published`) + ' · ' : ''}${T(`장 ${p.ch.length}개`, `${p.ch.length} chapters`)}${nPlan ? T(` (준비 중 ${nPlan})`, ` (${nPlan} planned)`) : ''}</span></div>
      <p class="bk-pdesc">${esc(L(p.d))}</p>
      <ol class="bk-chs">${p.ch.map((c) => chHtml(c, sel, fold)).join('')}</ol></section>`;
  }
  function renderToc() {
    const f = fst(), sel = getSel(), fold = folded();
    const nCh = BK.reduce((a, p) => a + p.ch.length, 0), nChPub = BK.reduce((a, p) => a + p.ch.filter((c) => !c.plan).length, 0);
    const cnt = (key, val) => PUB.filter((id) => { const s = IDX[id].s; return key === 'lv' ? s.lv === val : (s[key] || []).includes(val); }).length;
    const chip = (key, val, label) => `<button type="button" class="fchip" data-bk-f="${key}" data-val="${val}" aria-pressed="${f[key] === val}">${esc(label)}${val !== 'all' ? ` <span class="num">${cnt(key, val)}</span>` : ''}</button>`;
    const facet = (key, label, map) => `<div class="bk-facet" role="group" aria-label="${esc(label)}"><span class="lbl">${esc(label)}</span>${chip(key, 'all', T('전체', 'All'))}${Object.keys(map).filter((k) => cnt(key, k)).map((k) => chip(key, k, L(map[k]))).join('')}</div>`;
    return `${ui.head(T('라이브러리', 'Library'), T('SHE 가이드북 — 안전보건 교과서', 'SHE Guidebook — a safety and health textbook'),
      T('분야·사업장·나라를 아우르는 안전보건 교과서를 목표로, 원문을 확인한 절부터 채워 가는 가이드북입니다.', 'A guidebook aiming to be a safety and health textbook across fields, workplaces and countries, filled section by section as the originals are checked.'),
      T(`<p>목차는 편 → 장 → 절이고, 절마다 핵심 요약, 법·기준 원문, 나라별 비교, ‘정리’(작성자의 비교·요약), 학습 확인, 출처를 담습니다. 체크 상자로 절을 골라 한 화면에 모아 보고 PDF로 저장할 수 있습니다. 쓰는 원칙은 {{trust}}, 쓰는 법은 {{use}}에 있습니다.</p>`.replace(/\{\{(\w+)\}\}/g, (m, id) => `<a href="#book/${id}">${IDX[id].num}</a>`),
        `<p>The contents run part → chapter → section; each section has key points, the original law and standards, country comparisons, a “synthesis” by the author, review questions and its sources. Tick sections to read them together and save them as a PDF. The rules are in {{trust}} and how to use the book in {{use}}.</p>`.replace(/\{\{(\w+)\}\}/g, (m, id) => `<a href="#book/${id}">${IDX[id].num}</a>`)))}
      <section class="panel bk-status" aria-label="${T('진행 현황', 'Progress')}">
        <span><b>${T('1판', '1st edition')}</b> · ${T('최근 원문 확인', 'latest check of originals')} <span class="num">${S.BOOK_ASOF}</span></span>
        <span>${T(`공개 절 <b class="num">${PUB.length}</b>개`, `<b class="num">${PUB.length}</b> sections published`)}</span>
        <span>${T(`장 <b class="num">${nCh}</b>개 중 <b class="num">${nChPub}</b>개 집필`, `<b class="num">${nChPub}</b> of <b class="num">${nCh}</b> chapters written`)}</span>
        <span>${T(`비교 나라·지역 ${Object.keys(S.BOOK_CTY).length}곳(1차)`, `${Object.keys(S.BOOK_CTY).length} jurisdictions compared (first wave)`)}</span>
        <a href="#book/plan">${T('전체 목차 계획', 'Contents plan')} →</a>
      </section>
      <section class="panel bk-tools" aria-label="${T('찾기와 고르기', 'Find and select')}">
        <label class="bk-search">${S.ICON_SEARCH}<input type="search" id="bk-q" value="${esc(f.q)}" placeholder="${esc(T('가이드북에서 찾기 — 예: 위험성평가, 보호구, so far as', 'Search the guidebook — e.g. risk assessment, PPE, so far as'))}" aria-label="${esc(T('가이드북에서 찾기', 'Search the guidebook'))}" autocomplete="off" spellcheck="false" enterkeyhint="search"></label>
        ${facet('cty', T('나라', 'Country'), S.BOOK_CTY)}
        ${facet('fld', T('분야', 'Field'), S.BOOK_FIELD)}
        ${facet('lv', T('수준', 'Level'), S.BOOK_LV)}
        <div class="bk-selbar">
          <span class="bk-cnt"><span data-bk-cnt></span> <span class="xs muted" data-bk-shown aria-live="polite"></span></span>
          <a class="btn sm" href="#book/sel">${T('고른 절 모아 보기', 'Read selected')}</a>
          <a class="btn ghost sm print-link" href="#print/book/sel">${S.ICON_PRINT}${T('고른 절 PDF', 'Selected as PDF')}</a>
          <a class="btn ghost sm print-link" href="#print/book/all">${S.ICON_PRINT}${T('전체 PDF', 'Whole book as PDF')}</a>
          <button type="button" class="btn ghost sm" data-bk-clear>${T('선택 해제', 'Clear selection')}</button>
          <button type="button" class="btn ghost sm" data-bk-foldall>${T('장 모두 접기·펼치기', 'Fold or unfold all chapters')}</button>
          <button type="button" class="btn ghost sm" data-bk-reset>${T('찾기·필터 초기화', 'Reset search and filters')}</button>
        </div>
      </section>
      <div class="bk-toc">${BK.map((p) => partHtml(p, sel, fold)).join('')}
        <div class="callout small" data-bk-empty hidden>${T('조건에 맞는 절이 없습니다. 검색어를 지우거나 칩을 ‘전체’로 바꿔 보세요.', 'No sections match. Clear the search or set the chips back to “All”.')}</div></div>`;
  }

  const toks = (q) => S.norm(q).split(' ').filter(Boolean).slice(0, 6);
  const hayCache = {};
  const hay = (id) => {
    const k = S.state.lang + '|' + id;
    if (!hayCache[k]) { const s = IDX[id].s; const h = S.norm(L(s.t) + ' ' + s.t.ko + ' ' + s.t.en + ' ' + S.bookText(s) + ' ' + (s.cty || []).map(ctyName).join(' ')); hayCache[k] = [h, h.replace(/ /g, '')]; }
    return hayCache[k];
  };
  function snippet(id, tks) {
    const txt = S.bookText(IDX[id].s), low = txt.toLowerCase();
    /* 검색어 전체가 이어서 나오는 곳을 먼저, 없으면 낱말 순서대로 */
    let i = tks.length > 1 ? low.indexOf(tks.join(' ')) : -1;
    if (i < 0) for (const t of tks) { i = low.indexOf(t); if (i >= 0) break; }
    if (i < 0) return '';
    const a = Math.max(0, i - 50), b = Math.min(txt.length, i + 90);
    const mk = S.markText || ((r) => esc(r));
    return (a > 0 ? '…' : '') + mk(txt.slice(a, b), tks) + (b < txt.length ? '…' : '');
  }

  function mountToc(root) {
    const f = fst();
    const rows = [...root.querySelectorAll('[data-bk-row]')];
    const visible = (el) => !el.hidden && !el.closest('[hidden]');
    const rowsIn = (box) => [...box.querySelectorAll('[data-bk-row]')].filter((r) => !r.hidden);
    function sync() {
      const sel = getSel();
      rows.forEach((r) => { r.querySelector('[data-bk-sel]').checked = sel.includes(r.dataset.id); });
      const tri = (cb, box) => { const rs = rowsIn(box), n = rs.filter((r) => sel.includes(r.dataset.id)).length; cb.checked = rs.length > 0 && n === rs.length; cb.indeterminate = n > 0 && n < rs.length; cb.disabled = !rs.length; };
      root.querySelectorAll('[data-bk-cchk]').forEach((cb) => tri(cb, cb.closest('[data-bk-ch]')));
      root.querySelectorAll('[data-bk-pchk]').forEach((cb) => tri(cb, cb.closest('[data-bk-part]')));
      root.querySelector('[data-bk-cnt]').textContent = T(`고른 절 ${sel.length}개`, `${sel.length} selected`);
      root.querySelector('[data-bk-clear]').disabled = !sel.length;
    }
    function apply() {
      const tks = toks(f.q), any = tks.length || f.cty !== 'all' || f.fld !== 'all' || f.lv !== 'all';
      let n = 0;
      rows.forEach((r) => {
        const id = r.dataset.id, s = IDX[id].s;
        let ok = (f.cty === 'all' || (s.cty || []).includes(f.cty)) && (f.fld === 'all' || (s.fld || []).includes(f.fld)) && (f.lv === 'all' || s.lv === f.lv);
        if (ok && tks.length) { const [h, hn] = hay(id); ok = tks.every((t) => h.includes(t) || hn.includes(t.replace(/ /g, ''))); }
        r.hidden = !ok; if (ok) n++;
        const t = r.querySelector('[data-bk-t]'), sn = r.querySelector('[data-bk-snip]'), title = L(s.t);
        t.innerHTML = tks.length && S.markText ? S.markText(title, tks) : esc(title);
        const sp = ok && tks.length ? snippet(id, tks) : '';
        sn.innerHTML = sp; sn.hidden = !sp;
      });
      root.querySelectorAll('[data-bk-ch]').forEach((c) => { c.hidden = !rowsIn(c).length; });
      root.querySelectorAll('[data-bk-plan]').forEach((c) => { c.hidden = !!any; });
      /* 찾는 중에는 맞는 절이 있는 장을 펼쳐 보여 준다(접힌 상태 저장은 그대로) */
      root.querySelectorAll('[data-bk-fold]').forEach((b) => { const ol = root.querySelector('#bkc-' + b.dataset.bkFold); const open = any || !folded().includes(b.dataset.bkFold); ol.hidden = !open; b.setAttribute('aria-expanded', String(open)); });
      root.querySelectorAll('[data-bk-part]').forEach((p) => { p.hidden = !!any && !rowsIn(p).length; });
      root.querySelector('[data-bk-shown]').textContent = any ? T(` · 조건에 맞는 절 ${n} / ${rows.length}`, ` · ${n} of ${rows.length} match`) : '';
      root.querySelector('[data-bk-empty]').hidden = n > 0;
      sync();
    }
    const save = () => S.save('book.f', f);
    let tm = 0;
    root.querySelector('#bk-q').addEventListener('input', (e) => { f.q = e.target.value; clearTimeout(tm); tm = setTimeout(() => { apply(); save(); }, 90); });
    root.querySelectorAll('[data-bk-f]').forEach((b) => b.addEventListener('click', () => {
      f[b.dataset.bkF] = b.dataset.val;
      root.querySelectorAll(`[data-bk-f="${b.dataset.bkF}"]`).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      apply(); save();
    }));
    root.addEventListener('change', (e) => {
      const el = e.target; let sel = getSel();
      if (el.matches('[data-bk-sel]')) sel = el.checked ? sel.concat(el.dataset.bkSel) : sel.filter((x) => x !== el.dataset.bkSel);
      else if (el.matches('[data-bk-cchk], [data-bk-pchk]')) {
        const ids = rowsIn(el.closest(el.matches('[data-bk-cchk]') ? '[data-bk-ch]' : '[data-bk-part]')).map((r) => r.dataset.id);
        sel = el.checked ? sel.concat(ids) : sel.filter((x) => !ids.includes(x));
      } else return;
      putSel(sel); sync();
    });
    root.querySelectorAll('[data-bk-fold]').forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.bkFold, ol = root.querySelector('#bkc-' + id), open = ol.hidden;
      ol.hidden = !open; b.setAttribute('aria-expanded', String(open));
      const fd = folded().filter((x) => x !== id); if (!open) fd.push(id); S.save('book.fold', fd);
    }));
    root.querySelector('[data-bk-foldall]').addEventListener('click', () => {
      const ids = [...root.querySelectorAll('[data-bk-fold]')].map((b) => b.dataset.bkFold);
      const anyOpen = [...root.querySelectorAll('.bk-secs')].some(visible);
      S.save('book.fold', anyOpen ? ids : []); S.refresh();
    });
    root.querySelector('[data-bk-clear]').addEventListener('click', () => { putSel([]); sync(); });
    root.querySelector('[data-bk-reset]').addEventListener('click', () => { S.save('book.f', FDEF); S.refresh(); });
    /* 찾는 중에 절을 열면 그 절에서도 찾은 낱말을 강조한다 (search.js의 강조 처리) */
    root.querySelector('.bk-toc').addEventListener('click', (e) => { const a = e.target.closest('a[href^="#book/"]'); if (a && toks(f.q).length) S.state.jump = { title: '', pane: '', terms: toks(f.q) }; });
    apply();
  }

  /* ---------- 절 화면 (#book/<id>) ---------- */
  function renderSec(id) {
    const x = IDX[id], s = x.s, i = PUB.indexOf(id), prev = PUB[i - 1], next = PUB[i + 1], sel = getSel();
    const nav = (nid, dir) => (nid ? `<a class="bk-navl ${dir}" href="#book/${nid}"><span class="xs muted">${dir === 'prev' ? T('← 이전 절', '← Previous') : T('다음 절 →', 'Next →')}</span><span><span class="bk-n">${IDX[nid].num}</span> ${esc(L(IDX[nid].s.t))}</span></a>` : '<span></span>');
    return `${ui.head(`<a href="#book">${T('SHE 가이드북', 'SHE Guidebook')}</a> · ${esc(partLabel(x.p))}`, `<span class="bk-num">${x.num}</span> ${esc(L(s.t))}`)}
      <article class="panel bk-sec" id="anchor-${id}">
        <div class="bk-crumb"><a href="#book">${T('목차', 'Contents')}</a><span aria-hidden="true">›</span><span>${esc(partLabel(x.p))}</span><span aria-hidden="true">›</span><span>${x.c.num} ${esc(L(x.c.t))}</span></div>
        <div class="bk-meta">${chips(s)}${status(s)}</div>
        <div class="bk-actions"><label class="bk-pick"><input type="checkbox" data-bk-sel="${id}" ${sel.includes(id) ? 'checked' : ''}> ${T('이 절 고르기', 'Select this section')}</label>
          <a class="btn ghost sm" href="#book/sel">${T('고른 절 모아 보기', 'Read selected')} <span class="num" data-bk-n>${sel.length}</span></a>
          <a class="btn ghost sm print-link" href="#print/book/${id}">${S.ICON_PRINT}${T('이 절 PDF', 'This section as PDF')}</a></div>
        ${secBody(id)}
      </article>
      <nav class="bk-nav" aria-label="${T('이전·다음 절', 'Previous and next section')}">${nav(prev, 'prev')}${nav(next, 'next')}</nav>`;
  }
  function mountSel(root) {
    root.addEventListener('change', (e) => {
      const el = e.target; if (!el.matches('[data-bk-sel]')) return;
      const id = el.dataset.bkSel, sel = getSel();
      putSel(el.checked ? sel.concat(id) : sel.filter((x) => x !== id));
      const n = root.querySelector('[data-bk-n]'); if (n) n.textContent = String(getSel().length);
    });
  }
  /* 찾은 낱말이 있으면 첫 곳으로 (강조는 search.js가 S.state.jump로 한다) */
  const toHit = () => setTimeout(() => { const m = document.querySelector('#view mark.hit'); if (m) S.reveal(m); }, 160);

  /* ---------- 고른 절 모아 보기 (#book/sel) ---------- */
  function renderCollected() {
    const ids = getSel();
    return `${ui.head(`<a href="#book">${T('SHE 가이드북', 'SHE Guidebook')}</a>`, T('고른 절 모아 보기', 'Selected sections'),
      ids.length ? T(`고른 ${ids.length}개 절을 목차 순서대로 보여 줍니다.`, `The ${ids.length} selected section(s), in contents order.`) : T('아직 고른 절이 없습니다.', 'No sections selected yet.'))}
      <section class="panel bk-selbar2" id="anchor-sel">
        <span class="bk-cnt">${T(`고른 절 ${ids.length}개`, `${ids.length} selected`)}</span>
        <a class="btn ghost sm" href="#book">← ${T('목차로', 'Back to contents')}</a>
        ${ids.length ? `<a class="btn sm print-link" href="#print/book/sel">${S.ICON_PRINT}${T('PDF로 저장', 'Save as PDF')}</a><button type="button" class="btn ghost sm" data-bk-clear>${T('선택 모두 해제', 'Clear all')}</button>` : ''}
      </section>
      ${ids.length ? ids.map((id) => { const x = IDX[id]; return `<article class="panel bk-sec" data-bk-art="${id}">
          <div class="section-title"><h2><span class="bk-num">${x.num}</span> ${esc(L(x.s.t))}</h2><span class="sub"><a href="#book/${id}">${T('절 화면', 'Open section')}</a> · <button type="button" class="linkish" data-bk-drop="${id}">${T('빼기', 'Remove')}</button></span></div>
          <div class="bk-meta">${chips(x.s)}${status(x.s)}</div>${secBody(id)}</article>`; }).join('')
        : `<div class="callout">${T('가이드북 목차에서 절 왼쪽의 체크 상자로 고르면 여기에 목차 순서대로 모입니다.', 'Tick the boxes beside sections in the contents and they gather here in contents order.')} <a href="#book">${T('목차 열기', 'Open the contents')}</a></div>`}`;
  }
  function mountCollected(root) {
    const c = root.querySelector('[data-bk-clear]'); if (c) c.addEventListener('click', () => { putSel([]); S.refresh(); });
    root.querySelectorAll('[data-bk-drop]').forEach((b) => b.addEventListener('click', () => { putSel(getSel().filter((x) => x !== b.dataset.bkDrop)); S.refresh(); }));
  }

  S.pages.book = {
    render(sub) {
      const id = String(sub || '').split('/')[0];
      if (id === 'sel') return renderCollected();
      if (id && IDX[id] && IDX[id].s.st === 'ok') return renderSec(id);
      return renderToc();
    },
    mount(root, sub) {
      const id = String(sub || '').split('/')[0];
      const j = S.state.jump;
      if (id === 'sel') return mountCollected(root);
      if (id && IDX[id] && IDX[id].s.st === 'ok') { mountSel(root); if (j && j.terms && j.terms.length) toHit(); return; }
      if (id) history.replaceState(null, '', '#book');   /* 없는 절 주소는 목차로 */
      mountToc(root);
    }
  };
})();

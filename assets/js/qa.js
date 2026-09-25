/* 4단계 — 포털 자체 점검(회귀 점검) #qa
   전 페이지 × 탭 × 한/영 × 3개 사업장 × 화면 폭(1024·375·320px)을 숨긴 검사용 화면(index.html?qa=1)에서 렌더링하고
   스크립트 오류, 빈 화면, 영문 화면의 한글, 가로 넘침, 깨진 내부 링크, 없는 출처·KOSHA 번호, 데이터 참조 오류를 찾는다.
   검사용 화면은 저장 이름공간 ‘sheqa.’를 써서 사용자의 입력값을 바꾸지 않고, 끝나면 그 이름공간을 지운다. */
(function () {
  const S = window.SHE, T = S.T, esc = S.esc, ui = S.ui;
  const WIDTHS = [1024, 375, 320];
  const SKIP = /^(ptw\/new|qa)(\/|$)/;           /* 방문만 해도 기록을 만드는 링크, 자기 자신 */
  const BILINGUAL = /^print\/card\/[^/]+\/both$/; /* 한·영 병기 카드는 영문 검사 제외 */
  let last = null, running = false;

  /* MessageChannel 양보 — 창이 가려져 있어도 타이머처럼 느려지지 않는다 */
  const tick = () => new Promise((r) => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });

  /* ---------- 데이터 참조 점검 (현재 창의 데이터로 한 번) ---------- */
  function integrity(add) {
    const src = new Set(S.SOURCES.map((s) => s.id));
    const sops = new Set(S.SOPS.map((s) => s.id));
    const chems = new Set(S.CHEMICALS.map((c) => c.id));
    const dup = (arr, what) => { const seen = new Set(); arr.forEach((id) => { if (seen.has(id)) add('bad', T('중복 id', 'Duplicate id'), what, id); seen.add(id); }); };
    dup(S.SOURCES.map((s) => s.id), 'SOURCES'); dup(S.SOPS.map((s) => s.id), 'SOPS'); dup(S.CASES.map((c) => c.id), 'CASES'); dup(S.CHEMICALS.map((c) => c.id), 'CHEMICALS');
    S.SOURCES.forEach((s) => {
      if (!/^https?:\/\//.test(s.url || '')) add('bad', T('출처 URL', 'Source URL'), s.id, s.url || '–');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s.checked || '')) add('warn', T('출처 확인일', 'Source date'), s.id, s.checked || '–');
    });
    /* 모든 데이터 객체를 훑어 src·sops·link·kosha 참조를 확인 */
    const seen = new WeakSet();
    const walk = (o, path, depth) => {
      if (!o || typeof o !== 'object' || depth > 8 || seen.has(o)) return;
      seen.add(o);
      if (Array.isArray(o)) { o.forEach((v, i) => walk(v, path + '[' + i + ']', depth + 1)); return; }
      Object.keys(o).forEach((k) => {
        const v = o[k];
        if (k === 'src' && (typeof v === 'string' || Array.isArray(v))) [].concat(v).forEach((id) => { if (id && !src.has(id)) add('bad', T('없는 출처 id', 'Unknown source id'), path + '.src', id); });
        else if (k === 'sops' && Array.isArray(v)) v.forEach((id) => { if (!sops.has(id)) add('bad', T('없는 SOP id', 'Unknown SOP id'), path + '.sops', id); });
        else if (k === 'kosha' && Array.isArray(v)) v.forEach((c) => { if (!S.koshaInfo(c)) add('bad', T('없는 KOSHA 번호', 'Unknown KOSHA code'), path + '.kosha', c); });
        else if (k === 'link' && typeof v === 'string' && v.startsWith('#')) { const r = v.slice(1).split('/')[0]; if (!S.pages[r]) add('bad', T('없는 경로', 'Unknown route'), path + '.link', v); }
        else if (k === 'chems' && Array.isArray(v)) v.forEach((id) => { if (!chems.has(id)) add('bad', T('없는 물질 id', 'Unknown substance id'), path + '.chems', id); });
        else walk(v, path + '.' + k, depth + 1);
      });
    };
    ['SOPS', 'CASES', 'NEWS', 'PROCESSES', 'CYCLES', 'GUIDES', 'GLOSSARY', 'RESOURCES', 'CHEMICALS', 'PTW_CHECKS', 'LAWCHECK', 'TIMELINE', 'CAMPAIGNS'].forEach((k) => { if (S[k]) walk(S[k], k, 0); });
    S.SOPS.forEach((s) => (s.permits || []).forEach((p) => { if (!S.PTW_FROM_SOP[p]) add('bad', T('SOP 허가 종류', 'SOP permit type'), s.id, p); }));
    (S.LAWCHECK || []).forEach((r) => { if (!src.has(r.id)) add('bad', T('법령 점검표 출처', 'Law-check source'), 'LAWCHECK', r.id); });
    for (let i = 1; i < S.NEWS.length; i++) if (S.NEWS[i].date > S.NEWS[i - 1].date) add('warn', T('동향 날짜 순서', 'News order'), 'NEWS[' + i + ']', S.NEWS[i].date);
    Object.keys(S.KOSHA).forEach((k) => { const g = S.KOSHA[k]; if (!g.f || !/^\d{4}-\d{2}-\d{2}$/.test(g.d || '')) add('warn', T('KOSHA 원문 정보', 'KOSHA file info'), k, g.f || '–'); });
  }

  /* ---------- 검사용 화면 ---------- */
  function openFrame(w) {
    return new Promise((resolve, reject) => {
      const f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
      f.style.cssText = `position:fixed;left:-20000px;top:0;width:${w}px;height:900px;border:0;visibility:hidden`;
      f.src = location.pathname.replace(/[^/]*$/, '') + 'index.html?qa=1#home';
      const to = setTimeout(() => reject(new Error('timeout')), 20000);
      f.addEventListener('load', () => {
        clearTimeout(to);
        try { if (!f.contentWindow.SHE || !f.contentWindow.SHE.render) throw new Error('no app'); resolve(f); } catch (e) { reject(e); }
      });
      document.body.appendChild(f);
    });
  }

  const ITEM = { sop: 'SOPS', cases: 'CASES', resources: 'RESOURCES' };
  function checkLink(F, h) {
    const [r, ...rest] = h.split('/'); const sub = rest.join('/');
    if (!F.pages[r]) return T('없는 경로', 'unknown route');
    if (!sub) return '';
    if (ITEM[r]) return F[ITEM[r]].some((x) => x.id === rest[0]) || (r === 'cases' && rest[0] === 'selfcheck') ? '' : T('없는 항목', 'unknown item');
    if (r === 'guide') return F.GUIDES[rest[0]] || rest[0] === 'terms' || rest[0] === 'search' ? '' : T('없는 가이드', 'unknown guide');
    if (r === 'print') return (F.printDocs || []).includes(rest[0]) ? '' : T('없는 인쇄 양식', 'unknown print doc');
    return '';
  }

  async function sweepFrame(f, w, opts, add, prog) {
    const W = f.contentWindow, F = W.SHE, D = W.document;
    const errs = [];
    W.addEventListener('error', (e) => errs.push(String(e.message)));
    const ce = W.console.error.bind(W.console); W.console.error = (...a) => { errs.push(a.map(String).join(' ').slice(0, 200)); ce(...a); };
    const srcIds = new Set(F.SOURCES.map((s) => s.id));
    const cite0 = F.cite; F.cite = (...ids) => { [].concat(...ids).filter(Boolean).forEach((id) => { if (!srcIds.has(id)) errs.push('cite:' + id); }); return cite0.apply(F, ids); };
    const tag0 = F.koshaTag; F.koshaTag = (c) => { if (!F.koshaInfo(c)) errs.push('kosha:' + c); return tag0.call(F, c); };
    const routes = F.NAV.flatMap((g) => g.items.map((i) => i[0]));
    let tag = '';
    const flushErr = (where) => { while (errs.length) add('bad', T('스크립트 오류', 'Script error'), where, errs.shift()); };
    const render = (h) => { W.history.replaceState(null, '', '#' + h); try { F.render(); return true; } catch (e) { add('bad', T('렌더링 예외', 'Render exception'), tag + h, e.message); return false; } };
    const inspect = (h, lang, label) => {
      const view = D.getElementById('view');
      const where = `${w}px · ${lang} · ${label}`;
      if (!view || view.innerText.trim().length < 20) add('bad', T('빈 화면', 'Empty page'), where, '');
      if (lang === 'en' && !BILINGUAL.test(h)) {
        const clone = view.cloneNode(true); clone.querySelectorAll('[lang="ko"],[data-qa-ko]').forEach((n) => n.remove());
        const m = (clone.textContent || '').match(/[^\n]{0,24}[가-힣]+[^\n]{0,24}/);
        if (m) add('warn', T('영문 화면에 한글', 'Korean text on EN page'), where, m[0].trim());
      }
      const de = D.documentElement, CW = de.clientWidth;
      if (de.scrollWidth > CW + 1) {
        const off = [...view.querySelectorAll('*')].find((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.right > CW + 1 && !el.closest('.table-wrap, .tabs'); });
        add('bad', T('가로 넘침', 'Horizontal overflow'), where, `${de.scrollWidth}px > ${CW}px` + (off ? ` · ${off.tagName.toLowerCase()}.${String(off.className).split(' ')[0]} “${(off.textContent || '').trim().slice(0, 30)}”` : ''));
      }
      flushErr(where);
    };
    const clearNs = () => { try { Object.keys(W.localStorage).filter((k) => k.startsWith('sheqa.')).forEach((k) => W.localStorage.removeItem(k)); } catch (e) { /* storage blocked */ } };
    for (const lang of opts.langs) {
      clearNs();   /* 이전 언어 패스가 남긴 선택값(SOP·사례 선택 등)이 방문 범위를 바꾸지 않게 매번 빈 상태에서 시작 */
      F.state.lang = lang; F.state.site = 'common';
      const seen = new Set(), queue = routes.slice(), bad = new Set();
      let n = 0;
      while (queue.length && seen.size < 1500) {
        const h = queue.shift(); if (seen.has(h) || SKIP.test(h)) continue; seen.add(h);
        tag = '';
        if (!render(h)) continue;
        n++; inspect(h, lang, '#' + h);
        const sub = F.state.sub;
        if (sub && F.state.route !== 'print' && F.state.route !== 'search' && !ITEM[F.state.route] && F.state.route !== 'guide' && F.state.route !== 'ptw' && F.state.route !== 'measure' && !D.getElementById('anchor-' + sub)) add('warn', T('앵커 없음', 'Missing anchor'), `${w}px · ${lang}`, '#' + h);
        if (F.state.route === 'print' && /인쇄할 문서를 찾지 못했습니다|document was not found/.test(D.getElementById('view').innerText)) add('bad', T('인쇄 양식 없음', 'Print doc not found'), `${w}px · ${lang}`, '#' + h);
        const links = [...D.querySelectorAll('#view a[href^="#"]')].map((a) => a.getAttribute('href').slice(1)).filter(Boolean);
        const tabs = [...D.querySelectorAll('#view [data-tabs]')].map((b) => [b.dataset.tabs, b.dataset.val]);
        for (const [k, v] of tabs) {
          F.save('tab.' + k, v); F.state.refreshing = true;
          try { F.render(); } catch (e) { add('bad', T('렌더링 예외', 'Render exception'), `${w}px · ${lang} · #${h} [${k}=${v}]`, e.message); }
          F.state.refreshing = false;
          inspect(h, lang, `#${h} [${k}=${v}]`);
          D.querySelectorAll('#view a[href^="#"]').forEach((a) => links.push(a.getAttribute('href').slice(1)));
        }
        tabs.forEach(([k]) => F.drop('tab.' + k));
        links.forEach((x) => { if (!x || SKIP.test(x)) return; const why = checkLink(F, x); if (why && !bad.has(x)) { bad.add(x); add('bad', T('깨진 내부 링크', 'Broken internal link'), `${lang} · #${h}`, `#${x} — ${why}`); } if (!seen.has(x)) queue.push(x); });
        if (n % 20 === 0) { prog(`${w}px · ${lang} · ${seen.size}`); await tick(); }
      }
      add('info', T('방문한 화면', 'Pages visited'), `${w}px · ${lang}`, String(n));
      if (opts.sites && w === opts.widths[0]) {
        for (const site of ['icheon', 'cheongju']) { F.state.site = site; for (const r of routes) { tag = site + ' · '; if (render(r)) inspect(r, lang, `${site} #${r}`); } await tick(); }
        F.state.site = 'common';
      }
    }
  }

  async function run(opts, prog) {
    const issues = [], add = (sev, type, where, detail) => issues.push({ sev, type, where, detail });
    const t0 = performance.now();
    prog(T('데이터 참조 점검', 'Checking data references'));
    integrity(add);
    for (const w of opts.widths) {
      prog(`${w}px ${T('화면 준비', 'loading')}`);
      let f;
      try { f = await openFrame(w); } catch (e) { add('bad', T('검사용 화면을 열지 못함', 'Could not open the test frame'), w + 'px', e.message); continue; }
      try { await sweepFrame(f, w, opts, add, prog); } catch (e) { add('bad', T('점검 중단', 'Run aborted'), w + 'px', e.message); }
      f.remove();
      await tick();
    }
    /* 검사용 이름공간 정리 */
    try { Object.keys(localStorage).filter((k) => k.startsWith('sheqa.')).forEach((k) => localStorage.removeItem(k)); } catch (e) { /* storage blocked */ }
    return { issues, ms: Math.round(performance.now() - t0), at: new Date(), opts };
  }

  const SEV = () => ({ bad: [T('오류', 'Error'), 'bad'], warn: [T('확인', 'Check'), 'warn'], info: [T('정보', 'Info'), 'info'] });
  function report(res) {
    const bad = res.issues.filter((x) => x.sev === 'bad'), warn = res.issues.filter((x) => x.sev === 'warn'), info = res.issues.filter((x) => x.sev === 'info');
    const rows = bad.concat(warn).slice(0, 400);
    return `<div class="row" style="gap:10px">${ui.pill(bad.length ? 'bad' : 'ok', T(`오류 ${bad.length}건`, `${bad.length} errors`))}${ui.pill(warn.length ? 'warn' : 'ok', T(`확인 ${warn.length}건`, `${warn.length} to check`))}<span class="xs muted">${S.iso(res.at)} ${res.at.toTimeString().slice(0, 5)} · ${S.fmt(res.ms / 1000, 1)}${T('초', ' s')} · ${info.map((x) => `${esc(x.where)} ${esc(x.detail)}`).join(' / ')}</span></div>
      ${rows.length ? `<div class="table-wrap"><table class="data"><thead><tr><th>${T('구분', 'Level')}</th><th>${T('종류', 'Type')}</th><th>${T('위치', 'Where')}</th><th>${T('내용', 'Detail')}</th></tr></thead><tbody>
        ${rows.map((x) => `<tr><td>${ui.pill(SEV()[x.sev][1], SEV()[x.sev][0])}</td><td class="small">${esc(x.type)}</td><td class="small">${esc(x.where)}</td><td class="small">${esc(x.detail)}</td></tr>`).join('')}</tbody></table></div>`
        : `<div class="callout ok small">${T('발견된 문제가 없습니다.', 'No problems found.')}</div>`}
      <div class="row"><button class="btn ghost sm" type="button" id="qa-dl">${T('결과 내려받기 (.txt)', 'Download results (.txt)')}</button></div>`;
  }
  const asText = (res) => [`SHE Master self-check ${res.at.toISOString()} (${res.ms} ms) widths=${res.opts.widths.join(',')} langs=${res.opts.langs.join(',')}`]
    .concat(res.issues.map((x) => `[${x.sev}] ${x.type} | ${x.where} | ${x.detail}`)).join('\n');

  S.pages.qa = {
    render() {
      return `${ui.head(T('포털 관리', 'Maintenance'), T('포털 자체 점검', 'Portal self-check'),
        T('수정할 때마다 전 페이지를 자동으로 열어 보며 오류를 찾는 회귀 점검입니다. 숨긴 검사용 화면에서 실행하므로 입력해 둔 데이터는 바뀌지 않습니다.', 'A regression check that opens every page after each change and looks for problems. It runs in a hidden test frame, so your saved data is not touched.'))}
      <section class="panel stack">${ui.title(T('점검 항목', 'What it checks'))}
        <ul class="facts small">${[T('모든 메뉴·하위 화면·탭·인쇄 양식을 한국어·영어로 렌더링 — 스크립트 오류와 빈 화면', 'Renders every page, sub-page, tab and print doc in Korean and English — script errors and empty pages'),
          T('영문 화면에 남은 한글 (한·영 병기 카드와 사람 이름 제외)', 'Korean text left on English pages (bilingual cards and personal names excepted)'),
          T('화면 폭 1024·375·320px에서 가로 넘침 (표·탭처럼 가로 스크롤이 의도된 곳 제외)', 'Horizontal overflow at 1024, 375 and 320 px (intended scrollers such as tables and tabs excepted)'),
          T('깨진 내부 링크, 없는 앵커, 없는 인쇄 양식', 'Broken internal links, missing anchors, missing print docs'),
          T('데이터 참조 — 출처 id·SOP id·물질 id·KOSHA 번호·경로, 중복 id, 동향 날짜 순서, 출처 URL·확인일 형식', 'Data references — source, SOP and substance ids, KOSHA codes, routes, duplicate ids, news order, source URL and date format'),
          T('사업장 3곳(공통·이천·청주) 전환 시 각 메뉴 화면', 'Every menu page for all three sites')].map((x) => `<li>${x}</li>`).join('')}</ul>
        <div class="row" style="gap:14px">
          ${WIDTHS.map((w) => `<label class="check"><input type="checkbox" data-qw="${w}" checked> ${w}px</label>`).join('')}
          <label class="check"><input type="checkbox" data-ql="ko" checked> KO</label><label class="check"><input type="checkbox" data-ql="en" checked> EN</label>
          <label class="check"><input type="checkbox" id="qa-sites" checked> ${T('사업장 3곳', 'All three sites')}</label>
        </div>
        <div class="row"><button class="btn" type="button" id="qa-run" ${running ? 'disabled' : ''}>${T('점검 시작', 'Run check')}</button><span class="small muted" id="qa-prog" aria-live="polite">${running ? T('점검 중…', 'Running…') : ''}</span></div>
        ${/^https?:$/.test(location.protocol) ? '' : `<div class="callout warn small">${T('파일로 연 화면에서는 브라우저 보안 정책 때문에 검사용 화면을 읽을 수 없습니다. 폴더에서 “python -m http.server”로 띄운 뒤 http://localhost 주소로 열어 실행하세요.', 'Browsers block reading the test frame when the portal is opened as a file. Serve the folder (e.g. “python -m http.server”) and open it via http://localhost.')}</div>`}
      </section>
      <section class="panel stack" id="anchor-result">${ui.title(T('결과', 'Results'))}<div id="qa-out">${last ? report(last) : `<p class="small muted">${T('아직 실행하지 않았습니다. 보통 1~2분 걸립니다.', 'Not run yet. It usually takes a minute or two.')}</p>`}</div></section>`;
    },
    mount(root) {
      const bindDl = () => { const d = root.querySelector('#qa-dl'); if (d && last) d.addEventListener('click', () => S.download(`SHE-Master-selfcheck-${S.iso(last.at)}.txt`, asText(last), 'text/plain;charset=utf-8')); };
      bindDl();
      root.querySelector('#qa-run').addEventListener('click', async (e) => {
        if (running) return;
        const widths = [...root.querySelectorAll('[data-qw]:checked')].map((x) => Number(x.dataset.qw));
        const langs = [...root.querySelectorAll('[data-ql]:checked')].map((x) => x.dataset.ql);
        if (!widths.length || !langs.length) { S.toast(T('화면 폭과 언어를 하나 이상 고르세요', 'Pick at least one width and language')); return; }
        running = true; e.target.disabled = true;
        const pg = root.querySelector('#qa-prog');
        try { last = await run({ widths, langs, sites: root.querySelector('#qa-sites').checked }, (m) => { if (pg.isConnected) pg.textContent = T('점검 중… ', 'Running… ') + m; }); }
        finally { running = false; }
        if (S.state.route === 'qa') { S.refresh(); const r = document.getElementById('anchor-result'); if (r) r.scrollIntoView({ block: 'start' }); }
      });
    }
  };
  S.qa = { run, integrity };
})();

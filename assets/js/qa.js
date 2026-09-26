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
        if ((k === 'src' || k === 'psrc') && (typeof v === 'string' || Array.isArray(v))) [].concat(v).forEach((id) => { if (id && !src.has(id)) add('bad', T('없는 출처 id', 'Unknown source id'), path + '.' + k, id); });
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
    /* 패치노트 — 바닥글 버전(SHE.BUILD)이 실제로 불러온 스크립트 번호(?v=)와 같은지, 번호·날짜가 최신순인지 */
    const sv = (document.querySelector('script[src*="core.js?v="]') || {}).src || '';
    const vNow = (sv.match(/[?&]v=(\d+)/) || [])[1];
    if (!S.BUILD || !vNow || S.BUILD !== 'v' + vNow) add('bad', T('버전 표시', 'Version label'), 'SHE.BUILD', `${S.BUILD || '–'} ≠ v${vNow || '?'}`);
    const U = S.UPDATES || [];
    if (!U.length || U[0].v !== S.BUILD) add('bad', T('패치노트 최신 버전', 'Latest patch note'), 'UPDATES[0].v', U[0] ? U[0].v : '–');
    U.forEach((u, i) => {
      if (u.no !== U.length - i) add('bad', T('패치노트 번호', 'Patch-note number'), 'UPDATES[' + i + ']', String(u.no));
      if (!/^\d{4}-\d{2}-\d{2}/.test(u.date || '')) add('bad', T('패치노트 날짜', 'Patch-note date'), 'UPDATES[' + i + ']', u.date || '–');
      if (i && String(u.date).slice(0, 10) > String(U[i - 1].date).slice(0, 10)) add('warn', T('패치노트 날짜 순서', 'Patch-note order'), 'UPDATES[' + i + ']', u.date);
      if (u.commit && !/^[0-9a-f]{7,40}$/.test(u.commit)) add('bad', T('패치노트 커밋', 'Patch-note commit'), 'UPDATES[' + i + ']', u.commit);
      if (!((u.add || []).length + (u.chg || []).length + (u.fix || []).length)) add('warn', T('패치노트 내용', 'Patch-note content'), 'UPDATES[' + i + ']', '–');
    });
  }

  /* ---------- 검사용 화면 ---------- */
  function openFrame(w, fz) {
    return new Promise((resolve, reject) => {
      const f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
      f.style.cssText = `position:fixed;left:-20000px;top:0;width:${w}px;height:900px;border:0;visibility:hidden`;
      /* 매번 다른 주소로 열어 브라우저 캐시의 옛 버전이 아닌 현재 파일을 점검한다 */
      f.src = location.pathname.replace(/[^/]*$/, '') + 'index.html?qa=1&t=' + Date.now() + (fz && fz !== 1 ? '&fz=' + fz : '') + '#home';
      const to = setTimeout(() => reject(new Error('timeout')), 20000);
      f.addEventListener('load', () => {
        clearTimeout(to);
        try { if (!f.contentWindow.SHE || !f.contentWindow.SHE.render) throw new Error('no app'); resolve(f); } catch (e) { reject(e); }
      });
      document.body.appendChild(f);
    });
  }

  /* 한 줄의 괄호 짝 — 여는 괄호 없이 닫는 괄호가 오면, 바로 앞이 조항 번호(1)·2)·가)·a) 또는 3)가) 같은 이어진 번호)일 때만 허용.
     말줄임(…)으로 앞이나 뒤가 잘린 줄(검색 결과 발췌 등)은 괄호가 잘렸을 수 있어 보지 않는다 */
  const ENUM = /(?:\d{1,2}|[가나다라마바사아자차카타파하]|(?:^|[^A-Za-z])[a-z])$/;
  function unbalanced(ln) {
    if (/^\s*…|…\s*$/.test(ln)) return false;
    let d = 0;
    for (let i = 0; i < ln.length; i++) {
      const c = ln[i];
      if (c === '(') d++;
      else if (c === ')') { if (d > 0) d--; else if (!ENUM.test(ln.slice(Math.max(0, i - 3), i))) return true; }
    }
    return d > 0;
  }

  const ITEM = { sop: 'SOPS', cases: 'CASES', resources: 'RESOURCES' };
  function checkLink(F, h) {
    const [r, ...rest] = h.split('/'); const sub = rest.join('/');
    if (!F.pages[r]) return T('없는 경로', 'unknown route');
    if (!sub) return '';
    if (ITEM[r]) return F[ITEM[r]].some((x) => x.id === rest[0]) || (r === 'cases' && rest[0] === 'selfcheck') ? '' : T('없는 항목', 'unknown item');
    if (r === 'guide') return F.GUIDES[rest[0]] || rest[0] === 'terms' || rest[0] === 'search' ? '' : T('없는 가이드', 'unknown guide');
    if (r === 'print') return (F.printDocs || []).includes(rest[0]) ? '' : T('없는 인쇄 양식', 'unknown print doc');
    if (r === 'hazards') return F.CHEMICALS.some((x) => x.id === rest[0]) || F.PROCESSES.some((x) => x.id === rest[0]) ? '' : T('없는 물질·공정', 'unknown substance or process');
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
      /* 문구 검사 (9-A A2) — 값 누출, 같은 낱말 반복, 짝이 맞지 않는 괄호 */
      const txt = view ? view.innerText : '';
      const leak = txt.match(/[^\n]{0,24}(\bundefined\b|\bNaN\b|\bInfinity\b|\[object \w+\]|(?:^|[\s(:=])null(?=[\s),.]|$))[^\n]{0,24}/);
      if (leak) add('bad', T('값 누출(undefined·NaN 등)', 'Value leak (undefined, NaN…)'), where, leak[0].trim());
      /* 한 문장(텍스트 노드) 안에서 띄어쓰기만 두고 같은 낱말이 되풀이된 곳 — 칩+제목, 단위 기호+이름, 표의 이웃 칸처럼
         서로 다른 요소가 붙어 보이는 경우는 오타가 아니므로 요소 단위로 본다 */
      let rep = null;
      if (view) { const tw = D.createTreeWalker(view, 4); for (let n = tw.nextNode(); n && !rep; n = tw.nextNode()) rep = n.data.match(/(?:^|[ (])([가-힣A-Za-z][가-힣A-Za-z·]{1,})[ ]+\1(?=[ .,)·]|$)/); }
      if (rep) add('warn', T('같은 낱말 반복', 'Repeated word'), where, rep[0].trim());
      const unb = txt.split('\n').find(unbalanced);
      if (unb) add('warn', T('괄호 짝 불일치', 'Unbalanced brackets'), where, unb.trim().slice(0, 80));
      /* 줄표(—)는 앞뒤를 띄어 쓴다 — 템플릿에서 값을 이어 붙이다 빠진 공백을 잡는다 */
      const dash = txt.match(/[^\n]{0,20}(?:[가-힣A-Za-z0-9]—|—[가-힣A-Za-z0-9])[^\n]{0,20}/);
      if (dash) add('warn', T('줄표 띄어쓰기', 'Dash spacing'), where, dash[0].trim());
      const de = D.documentElement, CW = de.clientWidth;
      if (de.scrollWidth > CW + 1) {
        /* 가로 스크롤이 의도된 곳(표·탭·목차·분류 칩)은 빼고, 본문 밖 고정 요소(아래 탭 막대 등)도 본다 */
        /* 표를 휴대폰 카드로 바꾸면 .table-wrap도 스크롤되지 않으므로, 실제로 가로 스크롤되는 조상이 있을 때만 뺀다 */
        const scrolls = (el) => { for (let p = el.parentElement; p && p !== D.body; p = p.parentElement) { const ox = W.getComputedStyle(p).overflowX; if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return true; } return false; };
        const off = [...D.body.querySelectorAll('*')].find((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.right > CW + 1 && !el.closest('#sidenav, .drawer') && !scrolls(el); });
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
        /* 지금 화면과 같은 주소로 가는 링크는 눌러도 아무 일이 없다 — 연결할 곳을 정해야 한다 */
        const dec = (x) => { try { return decodeURIComponent(x); } catch (e) { return x; } };
        /* (#페이지/섹션 링크는 같은 주소라도 해당 섹션으로 다시 스크롤하므로 제외) */
        [...new Set(links.filter((x) => dec(x) === dec(h) && !x.includes('/')))].forEach((x) => add('bad', T('눌러도 변화 없는 링크', 'Link to the same screen'), `${lang} · #${h}`, `#${x}`));
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

  /* ---------- 전수 클릭 시연 (9-A A1) ----------
     모든 메뉴 화면·탭에서 버튼·링크·체크·선택 상자·접힘 제목을 하나씩 실제로 누른다(누를 때마다 화면을 새로 그려 상태를 초기화).
     삭제 확인창은 ‘취소’, 다운로드·인쇄·새 창·클립보드·외부 링크 이동은 가로채 실제 동작 없이 넘긴다. 검사용 저장 공간(sheqa.)에서만 동작 */
  const CLICK_SEL = '#view button:not([disabled]), #view a[href], #view input[type=checkbox]:not([disabled]), #view input[type=radio]:not([disabled]), #view select:not([disabled]), #view summary';
  async function clickSweep(f, lang, add, prog) {
    const W = f.contentWindow, F = W.SHE, D = W.document, errs = [];
    W.addEventListener('error', (e) => errs.push(String(e.message)));
    W.addEventListener('unhandledrejection', (e) => errs.push('promise: ' + String(e.reason && e.reason.message || e.reason)));
    const ce = W.console.error.bind(W.console); W.console.error = (...a) => { errs.push(a.map(String).join(' ').slice(0, 200)); ce(...a); };
    W.confirm = () => false; W.alert = () => {}; W.print = () => {}; W.open = () => null;
    F.download = () => {};
    try { Object.defineProperty(W.navigator, 'clipboard', { value: { writeText: () => Promise.resolve() }, configurable: true }); } catch (e) { /* ignore */ }
    D.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('a[href]'); if (a && !a.getAttribute('href').startsWith('#')) e.preventDefault(); }, true);
    F.state.lang = lang; F.state.site = 'common';
    const routes = F.NAV.flatMap((g) => g.items.map((i) => i[0]));
    const wait = () => new Promise((r) => W.setTimeout(r, 0));
    const label = (el) => (el.getAttribute('aria-label') || el.innerText || el.value || el.title || el.getAttribute('href') || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40);
    let clicks = 0;
    for (const r of routes) {
      W.history.replaceState(null, '', '#' + r); F.render();
      const tabs = [...D.querySelectorAll('#view [data-tabs]')].map((b) => [b.dataset.tabs, b.dataset.val]);
      for (const [k, v] of (tabs.length ? tabs : [[null, null]])) {
        const setup = () => { if (F.guide) F.guide.close(true); if (k) { F.save('tab.' + k, v); F.state.refreshing = true; } W.history.replaceState(null, '', '#' + r); F.render(); F.state.refreshing = false; };
        setup();
        const n = D.querySelectorAll(CLICK_SEL).length;
        for (let i = 0; i < n; i++) {
          setup();
          const el = D.querySelectorAll(CLICK_SEL)[i];
          if (!el) break;
          if (el.matches('#qa-run, input[type=file]')) continue;
          const where = `${lang} · #${r}${k ? ` [${k}=${v}]` : ''} · ${el.tagName.toLowerCase()} “${label(el)}”`;
          errs.length = 0;
          try {
            if (el.tagName === 'SELECT') { if (el.options.length > 1) { el.selectedIndex = (el.selectedIndex + 1) % el.options.length; el.dispatchEvent(new W.Event('change', { bubbles: true })); } }
            else el.click();
          } catch (e) { errs.push(String(e.message)); }
          await wait(); await wait();
          clicks++;
          [...new Set(errs)].forEach((m) => add('bad', T('누르면 스크립트 오류', 'Script error on click'), where, m));
          const view = D.getElementById('view');
          if (!view || view.innerText.trim().length < 20) add('bad', T('누른 뒤 빈 화면', 'Empty page after click'), where, W.location.hash);
          const dr = D.getElementById('drawer');
          if (dr && !dr.hidden && (D.getElementById('drawerBody').innerText || '').trim().length < 10) add('bad', T('빈 옆 창', 'Empty side panel'), where, '');
          if ((clicks % 40) === 0) { prog(`${T('전수 클릭', 'Click test')} · ${lang} · #${r} · ${clicks}`); await tick(); }
        }
        if (k) F.drop('tab.' + k);
      }
    }
    if (F.guide) F.guide.close(true);
    add('info', T('눌러 본 요소', 'Elements clicked'), lang, String(clicks));
  }

  async function run(opts, prog) {
    const issues = [], add = (sev, type, where, detail) => issues.push({ sev, type, where, detail });
    const t0 = performance.now();
    prog(T('데이터 참조 점검', 'Checking data references'));
    integrity(add);
    /* 글자 크기(fzs)마다 — 기본 100%, 선택하면 가장 큰 130%에서도 넘침을 본다 */
    for (const fz of (opts.fzs && opts.fzs.length ? opts.fzs : [1])) {
      const tag = fz === 1 ? '' : ` · ${T('글자', 'text')} ${Math.round(fz * 100)}%`;
      const addF = fz === 1 ? add : (sev, type, where, detail) => add(sev, type, where + tag, detail);
      for (const w of opts.widths) {
        prog(`${w}px${tag} ${T('화면 준비', 'loading')}`);
        let f;
        try { f = await openFrame(w, fz); } catch (e) { addF('bad', T('검사용 화면을 열지 못함', 'Could not open the test frame'), w + 'px', e.message); continue; }
        try { await sweepFrame(f, w, fz === 1 ? opts : Object.assign({}, opts, { sites: false }), addF, (m) => prog(m + tag)); } catch (e) { addF('bad', T('점검 중단', 'Run aborted'), w + 'px', e.message); }
        f.remove();
        await tick();
      }
    }
    /* 전수 클릭 시연 — 1024px 한 화면에서 언어마다 */
    if (opts.clicks) {
      for (const lang of opts.langs) {
        let f;
        try { f = await openFrame(1024, 1); await clickSweep(f, lang, add, prog); } catch (e) { add('bad', T('클릭 시연 중단', 'Click test aborted'), lang, e.message); }
        if (f) f.remove();
        try { Object.keys(localStorage).filter((k) => k.startsWith('sheqa.')).forEach((k) => localStorage.removeItem(k)); } catch (e) { /* storage blocked */ }
        await tick();
      }
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
        T('수정할 때마다 전 페이지를 자동으로 열어 오류를 찾습니다.', 'Opens every page after each change and looks for problems.'),
        T('숨긴 검사용 화면에서 실행하므로 입력해 둔 데이터는 바뀌지 않습니다.', 'It runs in a hidden test frame, so your saved data is not touched.'))}
      <section class="panel stack">${ui.title(T('점검 항목', 'What it checks'))}
        <ul class="facts small">${[T('모든 메뉴·하위 화면·탭·인쇄 양식을 한국어·영어로 렌더링 — 스크립트 오류와 빈 화면', 'Renders every page, sub-page, tab and print doc in Korean and English — script errors and empty pages'),
          T('영문 화면에 남은 한글 (한·영 병기 카드와 사람 이름 제외)', 'Korean text left on English pages (bilingual cards and personal names excepted)'),
          T('화면 폭 1024·375·320px에서 가로 넘침 (표·탭처럼 가로 스크롤이 의도된 곳 제외)', 'Horizontal overflow at 1024, 375 and 320 px (intended scrollers such as tables and tabs excepted)'),
          T('깨진 내부 링크, 없는 앵커, 없는 인쇄 양식, 눌러도 변화 없는(같은 화면으로 가는) 링크', 'Broken internal links, missing anchors, missing print docs, links that lead back to the same screen'),
          T('데이터 참조 — 출처 id·SOP id·물질 id·KOSHA 번호·경로, 중복 id, 동향 날짜 순서, 출처 URL·확인일 형식', 'Data references — source, SOP and substance ids, KOSHA codes, routes, duplicate ids, news order, source URL and date format'),
          T('바닥글 버전과 실제 스크립트 번호(?v=)의 일치, 패치노트 번호·날짜 순서', 'Footer version matches the loaded script number (?v=); patch-note numbering and date order'),
          T('문구 — 값 누출(undefined·NaN 등), 같은 낱말 반복, 괄호 짝, 줄표(—) 띄어쓰기', 'Wording — value leaks (undefined, NaN…), repeated words, unbalanced brackets, dash spacing'),
          T('선택 시 — 글자 130%에서의 넘침, 모든 버튼·링크를 실제로 눌러 스크립트 오류·빈 화면·빈 옆 창 확인', 'Optional — overflow at 130 % text; actually clicking every button and link to catch script errors, empty screens and empty side panels'),
          T('사업장 3곳(공통·이천·청주) 전환 시 각 메뉴 화면', 'Every menu page for all three sites')].map((x) => `<li>${x}</li>`).join('')}</ul>
        <div class="row" style="gap:14px">
          ${WIDTHS.map((w) => `<label class="check"><input type="checkbox" data-qw="${w}" checked> ${w}px</label>`).join('')}
          <label class="check"><input type="checkbox" data-ql="ko" checked> KO</label><label class="check"><input type="checkbox" data-ql="en" checked> EN</label>
          <label class="check"><input type="checkbox" id="qa-sites" checked> ${T('사업장 3곳', 'All three sites')}</label>
          <label class="check"><input type="checkbox" id="qa-fz"> ${T('글자 130%에서도 (시간 2배)', 'Also at 130 % text (twice as long)')}</label>
          <label class="check"><input type="checkbox" id="qa-clicks"> ${T('모든 버튼·링크 눌러 보기 (수 분 더)', 'Also click every button and link (a few more minutes)')}</label>
        </div>
        <div class="row"><button class="btn" type="button" id="qa-run" ${running ? 'disabled' : ''}>${T('점검 시작', 'Run check')}</button><span class="small muted" id="qa-prog" aria-live="polite">${running ? T('점검 중…', 'Running…') : ''}</span></div>
        ${/^https?:$/.test(location.protocol) ? '' : `<div class="callout warn small">${T('파일로 연 화면에서는 브라우저 보안 정책 때문에 검사용 화면을 읽을 수 없습니다. 폴더에서 “python -m http.server”로 띄운 뒤 http://localhost 주소로 열어 실행하세요.', 'Browsers block reading the test frame when the portal is opened as a file. Serve the folder (e.g. “python -m http.server”) and open it via http://localhost.')}</div>`}
      </section>
      <section class="panel stack" id="anchor-result">${ui.title(T('결과', 'Results'))}<div id="qa-out">${last ? report(last) : `<p class="small muted">${T('아직 실행하지 않았습니다. 고른 폭·언어·사업장 수에 따라 몇 분 걸립니다.', 'Not run yet. It takes a few minutes, depending on the widths, languages and sites chosen.')}</p>`}</div></section>`;
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
        try { last = await run({ widths, langs, sites: root.querySelector('#qa-sites').checked, fzs: root.querySelector('#qa-fz').checked ? [1, 1.3] : [1], clicks: root.querySelector('#qa-clicks').checked }, (m) => { if (pg.isConnected) pg.textContent = T('점검 중… ', 'Running… ') + m; }); }
        finally { running = false; }
        if (S.state.route === 'qa') { S.refresh(); const r = document.getElementById('anchor-result'); if (r) r.scrollIntoView({ block: 'start' }); }
      });
    }
  };
  S.qa = { run, integrity };
})();

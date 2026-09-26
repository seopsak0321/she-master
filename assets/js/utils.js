/* 상단 공용 도구 — 디지털 시계, 떠 있는 창(메모장·계산기·단위 환산)
   떠 있는 창은 본문(#view) 밖에 한 번만 만들어 두므로 페이지를 옮겨도 닫히거나 내용이 지워지지 않는다.
   창 위치·크기·열림 상태는 fp.<id>(화면 설정), 메모 내용은 memo.text, 계산 기록은 calc.hist, 단위 입력값은 units.last에 저장 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, esc = S.esc;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const pad = (n) => String(n).padStart(2, '0');
  const isM = () => document.documentElement.classList.contains('m');

  /* ---------- 숫자 표시 ---------- */
  function fmtNum(v, sig) {
    if (v == null || !isFinite(v)) return T('계산할 수 없음', 'Not a number');
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a >= 1e15 || a < 1e-9) return v.toExponential((sig || 12) - 1).replace(/\.?0+e/, 'e').replace('e+', 'E').replace('e-', 'E-');
    const s = String(Number(v.toPrecision(sig || 12)));
    if (/e/.test(s)) return Number(s).toExponential(6).replace(/\.?0+e/, 'e').replace('e+', 'E').replace('e-', 'E-');
    return s;
  }
  const grp = (s) => { const m = /^(-?)(\d+)(\.\d+)?(E.*)?$/.exec(s); if (!m) return s; return m[1] + m[2].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (m[3] || '') + (m[4] || ''); };

  /* ---------- 떠 있는 창 ---------- */
  const DEF = { memo: { w: 340, h: 320 }, calc: { w: 330, h: 470 }, units: { w: 380, h: 460 } };
  const MIN = { w: 250, h: 200 };
  const panels = {};
  let zTop = 70;
  const getGeo = (id) => S.load('fp.' + id, null);
  const setGeo = (id, g) => S.save('fp.' + id, g);
  function defaultGeo(id) {
    const d = DEF[id], vw = window.innerWidth, vh = window.innerHeight;
    if (isM()) { const h = Math.min(d.h, Math.round(vh * 0.55)); return { x: 8, y: Math.max(60, vh - h - 76), w: vw - 16, h, open: false }; }
    /* 오른쪽부터 메모장·계산기·단위 환산 순서로 나란히, 자리가 모자라면 계단식으로 */
    const ids = ['memo', 'calc', 'units'], order = ids.indexOf(id);
    const left = vw - 24 - ids.slice(0, order + 1).reduce((a, k) => a + DEF[k].w + 12, 0) + 12;
    return left >= 8 ? { x: left, y: 70, w: d.w, h: d.h, open: false } : { x: Math.max(8, vw - d.w - 24 - order * 28), y: 70 + order * 28, w: d.w, h: d.h, open: false };
  }
  function clamp(g) {
    const vw = window.innerWidth, vh = window.innerHeight;
    g.w = Math.max(MIN.w, Math.min(g.w, vw - 8)); g.h = Math.max(MIN.h, Math.min(g.h, vh - 16));
    g.x = Math.max(4, Math.min(g.x, vw - g.w - 4)); g.y = Math.max(4, Math.min(g.y, vh - g.h - 4));
    return g;
  }
  function place(id) {
    const p = panels[id]; if (!p) return;
    const g = clamp(Object.assign(defaultGeo(id), getGeo(id) || {}));
    Object.assign(p.el.style, { left: g.x + 'px', top: g.y + 'px', width: g.w + 'px', height: g.h + 'px' });
    return g;
  }
  function front(id) { const p = panels[id]; if (p) p.el.style.zIndex = String(++zTop); }
  function openPanel(id, focus) {
    const p = panels[id]; if (!p) return;
    const g = place(id); g.open = true; setGeo(id, g);
    p.el.hidden = false; front(id); syncBtns();
    if (p.onOpen) p.onOpen();
    if (focus !== false) { const f = p.el.querySelector('[data-autofocus]') || p.el; setTimeout(() => f.focus({ preventScroll: true }), 0); }
  }
  function closePanel(id) {
    const p = panels[id]; if (!p) return;
    p.el.hidden = true; const g = getGeo(id) || defaultGeo(id); g.open = false; setGeo(id, g); syncBtns();
  }
  function togglePanel(id) { const p = panels[id]; if (p) (p.el.hidden ? openPanel(id) : closePanel(id)); }
  S.fp = { open: openPanel, close: closePanel, toggle: togglePanel };

  function makePanel(id, titleFn, bodyHtml, extraHead) {
    const el = document.createElement('section');
    el.className = 'fpanel fp-' + id; el.id = 'fp-' + id; el.hidden = true; el.tabIndex = -1;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-labelledby', 'fp-' + id + '-t');
    el.innerHTML = `<header class="fp-head" data-fp-drag><b id="fp-${id}-t" class="fp-title"></b><span class="fp-extra">${extraHead || ''}</span>
      <button type="button" class="icon-btn fp-x" data-fp-close="${id}"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></header>
      <div class="fp-body">${bodyHtml}</div><span class="fp-grip" data-fp-resize="${id}" aria-hidden="true"></span>`;
    document.body.appendChild(el);
    panels[id] = { el, titleFn };
    el.addEventListener('pointerdown', () => front(id));
    /* 끌어서 옮기기 — 제목 줄(버튼·입력칸 제외) */
    const head = el.querySelector('.fp-head');
    head.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button, input, select, textarea, a')) return;
      const r = el.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
      head.setPointerCapture(e.pointerId); el.classList.add('dragging');
      const move = (ev) => { const g = clamp({ x: ev.clientX - dx, y: ev.clientY - dy, w: r.width, h: r.height }); el.style.left = g.x + 'px'; el.style.top = g.y + 'px'; };
      const up = () => { head.removeEventListener('pointermove', move); head.removeEventListener('pointerup', up); head.removeEventListener('pointercancel', up); el.classList.remove('dragging');
        const b = el.getBoundingClientRect(); setGeo(id, { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height), open: true }); };
      head.addEventListener('pointermove', move); head.addEventListener('pointerup', up); head.addEventListener('pointercancel', up);
    });
    /* 오른쪽 아래 모서리를 끌어 크기 조절 (마우스·터치 모두) */
    const grip = el.querySelector('.fp-grip');
    grip.addEventListener('pointerdown', (e) => {
      e.preventDefault(); const r = el.getBoundingClientRect(); grip.setPointerCapture(e.pointerId);
      const move = (ev) => { const g = clamp({ x: r.left, y: r.top, w: r.width + ev.clientX - e.clientX, h: r.height + ev.clientY - e.clientY }); el.style.width = g.w + 'px'; el.style.height = g.h + 'px'; };
      const up = () => { grip.removeEventListener('pointermove', move); grip.removeEventListener('pointerup', up); grip.removeEventListener('pointercancel', up);
        const b = el.getBoundingClientRect(); setGeo(id, { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height), open: true }); if (panels[id].onResize) panels[id].onResize(); };
      grip.addEventListener('pointermove', move); grip.addEventListener('pointerup', up); grip.addEventListener('pointercancel', up);
    });
    el.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !(id === 'calc' && e.target.closest('.fp-body'))) { closePanel(id); const b = document.querySelector(`[data-fp="${id}"]`); if (b && b.offsetParent) b.focus(); } });
    return panels[id];
  }

  /* ---------- 메모장 ---------- */
  function buildMemo() {
    const p = makePanel('memo', () => T('메모장', 'Notepad'), `<textarea class="memo-ta" id="memoText" data-autofocus spellcheck="false"></textarea>
      <div class="fp-foot"><div class="row fp-acts">
        <button type="button" class="btn ghost sm" data-memo="time"></button><button type="button" class="btn ghost sm" data-memo="page"></button>
        <button type="button" class="btn ghost sm" data-memo="copy"></button><button type="button" class="btn ghost sm" data-memo="save"></button><button type="button" class="btn ghost sm" data-memo="clear"></button></div>
        <span class="xs muted" id="memoState" aria-live="polite"></span></div>`);
    const ta = $('#memoText', p.el), st = $('#memoState', p.el);
    ta.value = S.load('memo.text', '');
    let timer = null;
    const stamp = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
    const status = (saved) => { st.textContent = `${ta.value.length.toLocaleString()}${T('자', ' chars')}${saved ? ' · ' + T('자동 저장 ', 'saved ') + saved : ''}`; };
    const save = () => { S.save('memo.text', ta.value); status(stamp()); };
    ta.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(save, 250); status(''); });
    ta.addEventListener('blur', () => { clearTimeout(timer); save(); });
    const insert = (txt) => { const s = ta.selectionStart ?? ta.value.length, e = ta.selectionEnd ?? s, before = ta.value.slice(0, s), sep = before && !/\n$/.test(before) ? '\n' : '';
      ta.value = before + sep + txt + ta.value.slice(e); const pos = (before + sep + txt).length; ta.focus(); ta.setSelectionRange(pos, pos); save(); };
    p.el.querySelector('.fp-acts').addEventListener('click', (e) => {
      const b = e.target.closest('[data-memo]'); if (!b) return;
      const a = b.dataset.memo, d = new Date();
      if (a === 'time') insert(`[${S.iso(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}] `);
      else if (a === 'page') insert(`[${S.routeName(S.state.route)}] ${location.href.split('#')[0]}#${S.state.route}${S.state.sub ? '/' + S.state.sub : ''}\n`);
      else if (a === 'copy') { const done = () => S.toast(T('메모를 복사했습니다', 'Notes copied')); if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(done, () => { ta.select(); document.execCommand('copy'); done(); }); else { ta.select(); document.execCommand('copy'); done(); } }
      else if (a === 'save') { if (!ta.value.trim()) { S.toast(T('저장할 내용이 없습니다', 'Nothing to save')); return; } S.download(`SHE-Master-memo-${S.iso(d)}-${pad(d.getHours())}${pad(d.getMinutes())}.txt`, ta.value.replace(/\n/g, '\r\n'), 'text/plain;charset=utf-8'); }
      else if (a === 'clear') { if (!ta.value) return; if (window.confirm(T('메모를 모두 지울까요? 지운 뒤에는 되돌릴 수 없습니다(먼저 .txt로 저장해 두세요).', 'Clear all notes? This cannot be undone (save a .txt first).'))) { ta.value = ''; save(); ta.focus(); } }
    });
    /* 다른 탭에서 고친 메모를 반영 (이 창에서 입력 중일 때는 건드리지 않음) */
    window.addEventListener('storage', (e) => { if (e.key === S.NS + 'memo.text' && document.activeElement !== ta) { try { ta.value = JSON.parse(e.newValue) || ''; status(''); } catch (x) { /* ignore */ } } });
    p.labels = () => {
      ta.placeholder = T('떠오르는 생각·확인할 것·조문 번호를 적으세요. 페이지를 옮겨도 그대로 남고, 이 브라우저에 자동 저장됩니다.', 'Jot ideas, to-dos and article numbers. Notes stay as you move between pages and are saved in this browser.');
      ta.setAttribute('aria-label', T('메모 내용', 'Notes'));
      const lab = { time: T('시각 넣기', 'Time'), page: T('현재 페이지 넣기', 'This page'), copy: T('복사', 'Copy'), save: T('.txt로 저장', 'Save .txt'), clear: T('지우기', 'Clear') };
      p.el.querySelectorAll('[data-memo]').forEach((b) => { b.textContent = lab[b.dataset.memo]; });
      status('');
    };
    p.onOpen = () => status('');
  }

  /* ---------- 계산기 — eval 없이 직접 해석 (사칙·괄호·거듭제곱·% ·! ·삼각·로그·루트) ---------- */
  const FN = { sin: 1, cos: 1, tan: 1, asin: 1, acos: 1, atan: 1, ln: 1, log: 1, '√': 1, '∛': 1, abs: 1 };
  function tokenize(src) {
    const s = src.replace(/\s+/g, '').replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
    const out = []; let i = 0;
    const prevIsValue = () => { const t = out[out.length - 1]; return t && (t.t === 'num' || t.t === ')' || t.t === 'post'); };
    const pushVal = (tok) => { if (prevIsValue()) out.push({ t: 'op', v: '×' }); out.push(tok); };
    while (i < s.length) {
      const c = s[i];
      const num = /^(\d+\.?\d*|\.\d+)(E[+−]?\d+)?/.exec(s.slice(i));
      if (num) { pushVal({ t: 'num', v: Number(num[0].replace('−', '-')) }); i += num[0].length; continue; }
      const fn = /^(asin|acos|atan|sin|cos|tan|ln|log|abs|√|∛)/.exec(s.slice(i));
      if (fn) { pushVal({ t: 'fn', v: fn[0] }); i += fn[0].length; continue; }
      if (c === 'π') { pushVal({ t: 'num', v: Math.PI }); i++; continue; }
      if (c === 'e') { pushVal({ t: 'num', v: Math.E }); i++; continue; }
      if (c === '(') { pushVal({ t: '(' }); i++; continue; }
      if (c === ')') { out.push({ t: ')' }); i++; continue; }
      if (c === '!' || c === '%') { out.push({ t: 'post', v: c }); i++; continue; }
      if ('+−×÷^'.includes(c)) {
        if ((c === '−' || c === '+') && !prevIsValue()) { if (c === '−') out.push({ t: 'neg' }); i++; continue; }
        out.push({ t: 'op', v: c }); i++; continue;
      }
      throw new Error('bad');
    }
    return out;
  }
  const PREC = { '+': 1, '−': 1, '×': 2, '÷': 2, neg: 3, '^': 4 };
  function toRpn(tokens) {
    const out = [], st = [];
    tokens.forEach((t) => {
      if (t.t === 'num' || t.t === 'post') out.push(t);
      else if (t.t === 'fn' || t.t === '(') st.push(t);
      else if (t.t === 'neg') st.push({ t: 'op', v: 'neg' });
      else if (t.t === 'op') {
        while (st.length) {
          const top = st[st.length - 1];
          if (top.t !== 'op') break;
          const p1 = PREC[t.v], p2 = PREC[top.v];
          if (p2 > p1 || (p2 === p1 && t.v !== '^')) out.push(st.pop()); else break;
        }
        st.push(t);
      } else if (t.t === ')') {
        while (st.length && st[st.length - 1].t !== '(') out.push(st.pop());
        if (!st.length) throw new Error('paren');
        st.pop();
        if (st.length && st[st.length - 1].t === 'fn') out.push(st.pop());
      }
    });
    while (st.length) { const t = st.pop(); if (t.t === '(') continue; out.push(t); }   /* 닫지 않은 괄호는 끝에서 닫는다 */
    return out;
  }
  function evalRpn(rpn, deg) {
    const st = [];
    const val = (x) => (x && typeof x === 'object' ? x.pct : x);
    const rad = (x) => (deg ? x * Math.PI / 180 : x), unrad = (x) => (deg ? x * 180 / Math.PI : x);
    rpn.forEach((t) => {
      if (t.t === 'num') st.push(t.v);
      else if (t.t === 'post') {
        const a = st.pop(); if (a == null) throw new Error('arg');
        if (t.v === '%') st.push({ pct: val(a) / 100 });
        else { const n = val(a); if (n < 0 || n > 170 || Math.floor(n) !== n) throw new Error('fact'); let r = 1; for (let k = 2; k <= n; k++) r *= k; st.push(r); }
      } else if (t.t === 'fn') {
        const x = val(st.pop()); if (x == null) throw new Error('arg');
        const f = { sin: () => Math.sin(rad(x)), cos: () => Math.cos(rad(x)), tan: () => Math.tan(rad(x)), asin: () => unrad(Math.asin(x)), acos: () => unrad(Math.acos(x)), atan: () => unrad(Math.atan(x)),
          ln: () => Math.log(x), log: () => Math.log10(x), '√': () => Math.sqrt(x), '∛': () => Math.cbrt(x), abs: () => Math.abs(x) }[t.v];
        let r = f();
        /* 도(°) 모드의 sin 180°·cos 90° 같은 값이 1e-16이 되지 않게 정리 */
        if (/^(sin|cos|tan)$/.test(t.v) && Math.abs(r) < 1e-12) r = 0;
        st.push(r);
      } else if (t.v === 'neg') { const a = st.pop(); if (a == null) throw new Error('arg'); st.push(-val(a)); }
      else {
        const b = st.pop(), a = st.pop(); if (a == null || b == null) throw new Error('arg');
        const A = val(a);
        /* % 규칙(일반 계산기와 같게): a + b% = a × (1 + b/100), a − b% = a × (1 − b/100), a × b% = a × b/100 */
        const B = b && typeof b === 'object' && (t.v === '+' || t.v === '−') ? A * b.pct : val(b);
        st.push({ '+': () => A + B, '−': () => A - B, '×': () => A * B, '÷': () => A / B, '^': () => Math.pow(A, B) }[t.v]());
      }
    });
    if (st.length !== 1) throw new Error('syntax');
    return val(st[0]);
  }
  function calcEval(expr, deg) { const r = evalRpn(toRpn(tokenize(expr)), deg); if (!isFinite(r)) throw new Error('range'); return r; }
  S.calcEval = calcEval;   /* 자체 점검·시연용 */

  function buildCalc() {
    const SCI = [['sin', 'sin('], ['cos', 'cos('], ['tan', 'tan('], ['π', 'π'], ['e', 'e'],
      ['sin⁻¹', 'asin('], ['cos⁻¹', 'acos('], ['tan⁻¹', 'atan('], ['(', '('], [')', ')'],
      ['ln', 'ln('], ['log', 'log('], ['x²', '^2'], ['xʸ', '^'], ['√', '√('],
      ['eˣ', 'e^'], ['10ˣ', '10^'], ['1/x', '^(−1)'], ['n!', '!'], ['∛', '∛('],
      ['|x|', 'abs('], ['EXP', 'E'], ['Ans', 'ans']];
    const BASIC = [['C', 'clear'], ['⌫', 'back'], ['%', '%'], ['÷', '÷'], ['7', '7'], ['8', '8'], ['9', '9'], ['×', '×'], ['4', '4'], ['5', '5'], ['6', '6'], ['−', '−'], ['1', '1'], ['2', '2'], ['3', '3'], ['+', '+'], ['±', 'neg'], ['0', '0'], ['.', '.'], ['=', 'eq']];
    const key = ([l, v]) => `<button type="button" class="ck${/^[0-9.]$/.test(v) ? ' num' : ''}${v === 'eq' ? ' eq' : ''}${'÷×−+%'.includes(v) && v.length === 1 ? ' op' : ''}" data-ck="${esc(v)}">${l}</button>`;
    const head = `<span class="seg calc-mode" role="group"><button type="button" data-cmode="basic"></button><button type="button" data-cmode="sci"></button></span>`;
    const p = makePanel('calc', () => T('계산기', 'Calculator'), `<div class="calc" tabindex="0" data-autofocus>
        <div class="calc-disp"><div class="calc-expr" id="calcExpr" aria-live="polite"></div><div class="calc-res" id="calcRes"></div></div>
        <div class="calc-sci-bar"><span class="seg calc-ang" role="group"><button type="button" data-cang="deg">DEG</button><button type="button" data-cang="rad">RAD</button></span><span class="xs muted calc-hint"></span></div>
        <div class="calc-keys sci">${SCI.map(key).join('')}</div>
        <div class="calc-keys basic">${BASIC.map(key).join('')}</div>
        <details class="calc-hist"><summary class="xs"></summary><ul class="clean small" id="calcHist"></ul></details></div>`, head);
    const box = $('.calc', p.el), ex = $('#calcExpr', p.el), res = $('#calcRes', p.el), hist = $('#calcHist', p.el);
    let expr = '', ans = 0, justEq = false;
    const mode = () => S.load('calc.mode', 'basic'), ang = () => S.load('calc.angle', 'deg');
    const render = () => {
      box.classList.toggle('is-sci', mode() === 'sci');
      p.el.querySelectorAll('[data-cmode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cmode === mode())));
      p.el.querySelectorAll('[data-cang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cang === ang())));
      ex.textContent = expr || '0';
      let pre = '';
      if (expr && !justEq) { try { pre = '= ' + grp(fmtNum(calcEval(expr.replace(/ans/g, '(' + ans + ')'), ang() === 'deg'))); } catch (e) { pre = ''; } }
      res.textContent = justEq ? grp(fmtNum(ans)) : pre;
      res.classList.toggle('final', justEq);
      const h = S.load('calc.hist', []);
      hist.innerHTML = h.length ? h.map((x, i) => `<li><button type="button" class="link-btn" data-hist="${i}">${esc(x.e)} = <b>${esc(grp(x.r))}</b></button></li>`).join('') : `<li class="muted">${T('아직 계산 기록이 없습니다', 'No calculations yet')}</li>`;
    };
    const input = (v) => {
      if (v === 'clear') { expr = ''; justEq = false; }
      else if (v === 'back') { expr = justEq ? '' : expr.replace(/(asin\(|acos\(|atan\(|sin\(|cos\(|tan\(|ln\(|log\(|abs\(|ans|.)$/, ''); justEq = false; }
      else if (v === 'eq') {
        if (!expr) return;
        try { const r = calcEval(expr.replace(/ans/g, '(' + ans + ')'), ang() === 'deg'); ans = r; const h = S.load('calc.hist', []); h.unshift({ e: expr, r: fmtNum(r) }); S.save('calc.hist', h.slice(0, 20)); expr = fmtNum(r).replace('-', '−'); justEq = true; }
        catch (e) { res.textContent = T('식을 확인하세요', 'Check the expression'); res.classList.remove('final'); return; }
      } else if (v === 'neg') {
        const m = /(\(−)?(\d*\.?\d+(?:E[+−]?\d+)?)\)?$/.exec(expr);
        if (!expr) expr = '−';
        else if (m && m[1]) expr = expr.slice(0, m.index) + m[2];
        else if (m) expr = expr.slice(0, m.index) + '(−' + m[2] + ')';
        justEq = false;
      } else {
        /* 계산 직후 숫자를 누르면 새 식, 연산자를 누르면 결과에 이어서 */
        if (justEq && /^[0-9.(πe√∛a-z]/.test(v)) expr = '';
        if (v === 'E' && !/\d$/.test(expr)) return;
        expr += v; justEq = false;
      }
      render();
    };
    p.el.querySelector('.fp-body').addEventListener('click', (e) => {
      const k = e.target.closest('[data-ck]'); if (k) { input(k.dataset.ck); box.focus({ preventScroll: true }); return; }
      const a = e.target.closest('[data-cang]'); if (a) { S.save('calc.angle', a.dataset.cang); render(); return; }
      const h = e.target.closest('[data-hist]'); if (h) { const x = S.load('calc.hist', [])[Number(h.dataset.hist)]; if (x) { if (justEq) expr = ''; expr += x.r.replace('-', '−'); justEq = false; render(); } }
    });
    p.el.querySelector('.fp-head').addEventListener('click', (e) => {
      const m = e.target.closest('[data-cmode]'); if (!m) return;
      S.save('calc.mode', m.dataset.cmode); render();
      /* 공학용은 버튼이 5줄 늘어나므로, 창이 작으면 화면 안에서 높이를 늘린다 */
      if (m.dataset.cmode === 'sci') {
        const b = p.el.getBoundingClientRect(), want = Math.min(660, window.innerHeight - 16);
        if (b.height < want) { const g = clamp({ x: b.left, y: Math.min(b.top, window.innerHeight - want - 8), w: b.width, h: want }); Object.assign(p.el.style, { top: g.y + 'px', height: g.h + 'px' }); setGeo('calc', Object.assign(g, { open: true })); }
      }
    });
    box.addEventListener('keydown', (e) => {
      const k = e.key; const map = { Enter: 'eq', '=': 'eq', Backspace: 'back', Escape: 'clear', Delete: 'clear', '*': '×', x: '×', '/': '÷', '-': '−', '+': '+', '^': '^', '(': '(', ')': ')', '%': '%', '!': '!', '.': '.', ',': '.' };
      const v = /^[0-9]$/.test(k) ? k : map[k];
      if (v && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); e.stopPropagation(); input(v); }
    });
    p.labels = () => {
      p.el.querySelector('[data-cmode="basic"]').textContent = T('일반', 'Basic');
      p.el.querySelector('[data-cmode="sci"]').textContent = T('공학용', 'Scientific');
      p.el.querySelector('.calc-mode').setAttribute('aria-label', T('계산기 종류', 'Calculator type'));
      p.el.querySelector('.calc-ang').setAttribute('aria-label', T('각도 단위', 'Angle unit'));
      p.el.querySelector('.calc-hint').textContent = T('키보드로도 입력 · Enter = 계산', 'Keyboard works · Enter = equals');
      p.el.querySelector('.calc-hist summary').textContent = T('계산 기록 (최근 20개, 누르면 이어서 계산)', 'History (last 20 — click to reuse)');
      box.setAttribute('aria-label', T('계산기 — 숫자와 연산자를 키보드로 입력할 수 있습니다', 'Calculator — you can type numbers and operators'));
      render();
    };
  }

  /* ---------- 단위 환산 (떠 있는 창과 #units 페이지가 같은 화면을 씀) ---------- */
  const Q = () => S.UNITS;
  const uState = () => Object.assign({ q: 'pres', v: '1', from: 'MPa', to: 'kgfcm2', mw: '', ppm: '1', mg: '', tc: '25', kpa: '101.325', f: 'ppm' }, S.load('units.last', {}));
  const qOf = (id) => Q().find((q) => q.id === id) || Q()[0];
  const toBase = (q, u, v) => (q.affine ? u.to(v) : v * u.f);
  const fromBase = (q, u, b) => (q.affine ? u.from(b) : b / u.f);
  function unitsHtml(st, full) {
    const q = qOf(st.q);
    if (st.q === 'gas') return gasHtml(st, full);
    const from = q.units.find((u) => u.id === st.from) || q.units[0], to = q.units.find((u) => u.id === st.to) || q.units[1] || q.units[0];
    const v = Number(st.v);
    const ok = st.v !== '' && isFinite(v);
    const base = ok ? toBase(q, from, v) : null;
    const out = ok ? fromBase(q, to, base) : null;
    const opt = (u, sel) => `<option value="${u.id}" ${u.id === sel ? 'selected' : ''}>${esc(u.sym)} — ${esc(L(u))}</option>`;
    return `<div class="uc stack" style="gap:10px">
      ${qSelect(st)}
      <div class="uc-row"><input type="number" step="any" data-u="v" value="${esc(st.v)}" aria-label="${T('값', 'Value')}"><select data-u="from" aria-label="${T('바꿀 단위', 'From unit')}">${q.units.map((u) => opt(u, from.id)).join('')}</select></div>
      <div class="uc-row"><button type="button" class="btn ghost sm uc-swap" data-u-swap title="${T('단위 바꾸기', 'Swap units')}" aria-label="${T('단위 바꾸기', 'Swap units')}">⇅</button><select data-u="to" aria-label="${T('결과 단위', 'To unit')}">${q.units.map((u) => opt(u, to.id)).join('')}</select></div>
      <div class="uc-out" aria-live="polite">${ok ? `<b class="num">${grp(fmtNum(out, 10))}</b> <span>${esc(to.sym)}</span>` : `<span class="muted small">${T('숫자를 입력하세요', 'Enter a number')}</span>`}</div>
      ${ok && q.note ? `<p class="xs muted keep">${L(q.note)}</p>` : ''}
      <div class="uc-all"><div class="xs muted" style="margin-bottom:4px">${T('모든 단위로 보기', 'In every unit')}</div><table class="uc-table"><tbody>
        ${q.units.map((u) => `<tr class="${u.id === to.id ? 'on' : ''}"><td class="num">${ok ? esc(grp(fmtNum(fromBase(q, u, base), 10))) : '–'}</td><td><b>${esc(u.sym)}</b> <span class="muted xs">${esc(L(u))}</span></td></tr>`).join('')}
      </tbody></table></div>
      <p class="xs muted keep">${T('환산계수', 'Factors')}: ${S.cite('nistSp811', 'bipmSi')}${full ? '' : ` · <a href="#units">${T('전체 화면으로', 'Full page')} →</a>`}</p></div>`;
  }
  function qSelect(st) {
    return `<label class="field"><span class="lbl">${T('물리량', 'Quantity')}</span><select data-u="q">${Q().map((q) => `<option value="${q.id}" ${q.id === st.q ? 'selected' : ''}>${esc(L(q))} (${q.affine ? q.units.map((u) => u.sym).join('·') : q.units.length + T('개 단위', ' units')})</option>`).join('')}
      <option value="gas" ${st.q === 'gas' ? 'selected' : ''}>${T('가스 농도 ppm ↔ mg/m³ (분자량)', 'Gas concentration ppm ↔ mg/m³ (molar mass)')}</option></select></label>`;
  }
  /* 가스 농도 — mg/m³ = ppm × M / Vm, Vm = R·T/P (NIOSH 환산 조건 25 °C·1 atm에서 24.465 L/mol) */
  function gasCalc(st) {
    const M = Number(st.mw), T0 = Number(st.tc) + 273.15, P = Number(st.kpa) * 1000;
    if (!(M > 0) || !(T0 > 0) || !(P > 0)) return null;
    const vm = S.GAS_R * T0 / P * 1000;   /* L/mol */
    return { vm, k: M / vm };   /* 1 ppm = k mg/m³ */
  }
  function gasHtml(st, full) {
    const g = gasCalc(st);
    const ppm = Number(st.ppm), mg = Number(st.mg);
    const fromPpm = st.f !== 'mg';
    const outMg = g && st.ppm !== '' && isFinite(ppm) ? ppm * g.k : null, outPpm = g && st.mg !== '' && isFinite(mg) ? mg / g.k : null;
    return `<div class="uc stack" style="gap:10px">${qSelect(st)}
      <div class="form-grid"><div class="field"><label for="u-mw">${T('분자량 M (g/mol)', 'Molar mass M (g/mol)')}</label><input id="u-mw" type="number" step="any" min="0" data-u="mw" value="${esc(st.mw)}" placeholder="${T('예: HF 20.01', 'e.g. HF 20.01')}"></div>
        <div class="field"><label for="u-tc">${T('온도 (°C)', 'Temperature (°C)')}</label><input id="u-tc" type="number" step="any" data-u="tc" value="${esc(st.tc)}"></div>
        <div class="field"><label for="u-kpa">${T('압력 (kPa)', 'Pressure (kPa)')}</label><input id="u-kpa" type="number" step="any" min="0" data-u="kpa" value="${esc(st.kpa)}"></div></div>
      <div class="form-grid"><div class="field"><label for="u-ppm">ppm</label><input id="u-ppm" type="number" step="any" min="0" data-u="ppm" value="${esc(fromPpm ? st.ppm : (outPpm == null ? '' : fmtNum(outPpm, 6)))}"></div>
        <div class="field"><label for="u-mg">mg/m³</label><input id="u-mg" type="number" step="any" min="0" data-u="mg" value="${esc(!fromPpm ? st.mg : (outMg == null ? '' : fmtNum(outMg, 6)))}"></div></div>
      <div class="uc-out small" aria-live="polite">${g ? `${T('몰부피', 'Molar volume')} <b class="num">${fmtNum(g.vm, 5)} L/mol</b> · 1 ppm = <b class="num">${fmtNum(g.k, 5)} mg/m³</b>` : `<span class="muted">${T('분자량을 넣으세요', 'Enter the molar mass')}</span>`}</div>
      <p class="xs muted keep">${T('mg/m³ = ppm × 분자량 ÷ 몰부피, 몰부피 = R·T ÷ P (이상기체). NIOSH는 25 °C·1기압(101.325 kPa) 조건으로 환산합니다. 교재·지침에 따라 반올림한 24.45 L/mol을 쓰기도 해서 0.1% 안쪽의 차이가 날 수 있습니다. 증기·가스 상태 물질에만 쓰고, 분진·미스트는 mg/m³ 그대로 봅니다.', 'mg/m³ = ppm × molar mass ÷ molar volume, with molar volume = R·T ÷ P (ideal gas). NIOSH converts at 25 °C and 1 atm (101.325 kPa). Some texts round to 24.45 L/mol, so results can differ by under 0.1 %. Use only for vapours and gases; dusts and mists stay in mg/m³.')} ${S.cite('nioshNpg', 'bipmSi')}${full ? '' : ` · <a href="#units">${T('전체 화면으로', 'Full page')} →</a>`}</p></div>`;
  }
  function bindUnits(root, full, rerender) {
    const st = uState();
    root.querySelectorAll('[data-u]').forEach((el) => {
      const ev = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(ev, () => {
        const k = el.dataset.u; st[k] = el.value;
        if (k === 'q') { const q = qOf(el.value); if (el.value !== 'gas') { st.from = q.units[0].id; st.to = (q.units[1] || q.units[0]).id; } }
        if (k === 'ppm') st.f = 'ppm'; if (k === 'mg') st.f = 'mg';
        S.save('units.last', st);
        /* 숫자를 입력하는 중에는 커서를 지키려고 결과 부분만 다시 그린다 */
        rerender(el.tagName === 'INPUT' ? el.dataset.u : null);
      });
    });
    const sw = root.querySelector('[data-u-swap]'); if (sw) sw.addEventListener('click', () => { const t = st.from; st.from = st.to; st.to = t; S.save('units.last', st); rerender(null); });
  }
  function mountUnits(host, full) {
    const draw = (keepKey) => {
      const st = uState();
      const active = keepKey ? host.querySelector(`[data-u="${keepKey}"]`) : null;
      const caret = active ? [active.selectionStart, active.selectionEnd] : null;
      host.innerHTML = unitsHtml(st, full);
      bindUnits(host, full, draw);
      if (keepKey) { const el = host.querySelector(`[data-u="${keepKey}"]`); if (el) { el.focus({ preventScroll: true }); try { if (caret && caret[0] != null) el.setSelectionRange(caret[0], caret[1]); } catch (e) { /* number inputs */ } } }
    };
    draw(null);
  }
  function buildUnits() {
    const p = makePanel('units', () => T('단위 환산', 'Unit converter'), '<div class="uc-host"></div>');
    p.labels = () => mountUnits(p.el.querySelector('.uc-host'), false);
  }

  /* #units 페이지 */
  S.pages.units = {
    render() {
      return `${S.ui.head(T('판정·평가 도구', 'Tools'), T('단위 환산', 'Unit converter'),
        T(`물리량 ${S.UNITS.length}종의 단위 ${S.UNITS.reduce((a, q) => a + q.units.length, 0)}개와 가스 농도(ppm ↔ mg/m³)를 바꿉니다.`, `Convert ${S.UNITS.reduce((a, q) => a + q.units.length, 0)} units across ${S.UNITS.length} quantities, plus gas concentration (ppm ↔ mg/m³).`),
        T('환산계수는 미국 NIST SP 811 부록 B와 BIPM SI 정의값을 따르고, 인치·파운드·미국 갤런·표준중력처럼 정의로 정해진 단위는 정의에서 계산한 정확한 값을 씁니다. 상단의 ‘단위’ 버튼으로 어느 페이지에서나 작은 창으로 열 수 있습니다.', 'Factors follow US NIST SP 811 Appendix B and the BIPM SI definitions; units fixed by definition (inch, pound, US gallon, standard gravity) use exact values computed from them. The “Units” button at the top opens the same tool in a small window on any page.'))}
      <section class="grid g2" style="align-items:start">
        <div class="panel"><div id="ucPage"></div></div>
        <div class="panel stack">${S.ui.title(T('물리량별 단위', 'Units by quantity'))}
          <div class="uc-cats">${S.UNITS.map((q) => `<button type="button" class="chip" data-ucq="${q.id}">${esc(L(q))} <span class="muted">${q.units.length}</span></button>`).join('')}<button type="button" class="chip" data-ucq="gas">${T('가스 농도', 'Gas concentration')}</button></div>
          <p class="small">${T('현장에서 자주 쓰는 예 — 가스 실린더 압력(MPa ↔ kgf/cm² ↔ psi), 국소배기 풍속(m/s ↔ ft/min), 환기량(m³/min ↔ CFM), 조도(lx ↔ fc), 방사선량(mSv ↔ rem), 에너지(kWh ↔ kcal).', 'Common field uses — cylinder pressure (MPa ↔ kgf/cm² ↔ psi), hood velocity (m/s ↔ ft/min), ventilation (m³/min ↔ CFM), illuminance (lx ↔ fc), dose (mSv ↔ rem), energy (kWh ↔ kcal).')}</p>
          <div class="row"><a class="btn ghost sm" href="#measure/lev">${T('국소배기 제어풍속 판정', 'Local exhaust capture velocity')} →</a><a class="btn ghost sm" href="#measure/chem">${T('화학물질 노출 판정', 'Chemical exposure check')} →</a></div>
        </div>
      </section>`;
    },
    mount(root) {
      const host = root.querySelector('#ucPage'); mountUnits(host, true);
      root.querySelectorAll('[data-ucq]').forEach((b) => b.addEventListener('click', () => {
        const st = uState(); st.q = b.dataset.ucq;
        if (st.q !== 'gas') { const q = qOf(st.q); st.from = q.units[0].id; st.to = (q.units[1] || q.units[0]).id; }
        S.save('units.last', st); mountUnits(host, true); S.reveal(host);
      }));
    }
  };

  /* ---------- 상단 버튼·시계 ---------- */
  const ICON = {
    memo: '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4M8 11h8M8 15h8M8 19h5"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v4M8 19h.01M12 19h.01"/>',
    units: '<path d="M3 17 17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
    tools: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'
  };
  const svg = (k) => `<svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg>`;
  const NAME = () => ({ memo: T('메모', 'Notes'), calc: T('계산기', 'Calculator'), units: T('단위', 'Units') });
  function drawBtns() {
    const box = document.getElementById('miniTools'); if (!box) return;
    const n = NAME();
    box.setAttribute('aria-label', T('도구', 'Tools'));
    box.innerHTML = `${['memo', 'calc', 'units'].map((id) => `<button type="button" class="mt-btn" data-fp="${id}" aria-pressed="false" title="${esc(n[id])}">${svg(id)}<span class="mt-l">${esc(n[id])}</span></button>`).join('')}
      <button type="button" class="mt-btn mt-more" id="mtMore" aria-haspopup="true" aria-expanded="false" title="${T('도구', 'Tools')}">${svg('tools')}<span class="mt-l">${T('도구', 'Tools')}</span></button>
      <div class="mt-menu" id="mtMenu" hidden role="menu">${['memo', 'calc', 'units'].map((id) => `<button type="button" role="menuitem" data-fp="${id}">${svg(id)} ${esc(id === 'units' ? T('단위 환산', 'Unit converter') : n[id])}</button>`).join('')}<div class="mt-menu-clock" id="clockAlt"></div></div>`;
    syncBtns();
  }
  function syncBtns() { document.querySelectorAll('#miniTools [data-fp]').forEach((b) => { const p = panels[b.dataset.fp]; b.setAttribute('aria-pressed', String(!!(p && !p.el.hidden))); }); }
  const DOW = { ko: ['일', '월', '화', '수', '목', '금', '토'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
  function tick() {
    const c = document.getElementById('clock'); if (!c) return;
    const d = new Date(), en = S.state.lang === 'en';
    const date = en ? `${DOW.en[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}` : `${d.getMonth() + 1}.${d.getDate()}(${DOW.ko[d.getDay()]})`;
    c.innerHTML = `<span class="ck-d">${date}</span> <span class="ck-t">${pad(d.getHours())}:${pad(d.getMinutes())}<span class="ck-s">:${pad(d.getSeconds())}</span></span>`;
    c.setAttribute('datetime', d.toISOString());
    c.title = d.toLocaleString(en ? 'en-GB' : 'ko-KR');
    const alt = document.getElementById('clockAlt'); if (alt) alt.textContent = `${date} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function relabel() {
    Object.keys(panels).forEach((id) => { const p = panels[id]; $('.fp-title', p.el).textContent = p.titleFn(); $('.fp-x', p.el).setAttribute('aria-label', T('닫기', 'Close')); if (p.labels) p.labels(); });
    drawBtns(); tick();
  }

  function init() {
    /* 자체 점검 화면에는 떠 있는 창을 만들지 않고, 상단 바 넘침 점검을 위해 시계·버튼만 그린다 */
    if (S.QA_FRAME) { let lang = null; S.after.push(() => { if (S.state.lang !== lang) { lang = S.state.lang; drawBtns(); tick(); } }); drawBtns(); tick(); return; }
    buildMemo(); buildCalc(); buildUnits();
    let lastLang = null;
    S.after.push(() => { if (S.state.lang !== lastLang) { lastLang = S.state.lang; relabel(); } syncBtns(); });
    relabel();
    Object.keys(panels).forEach((id) => { const g = getGeo(id); if (g && g.open) openPanel(id, false); });
    tick(); setInterval(tick, 1000);
    document.addEventListener('click', (e) => {
      const more = e.target.closest('#mtMore'), menu = document.getElementById('mtMenu');
      if (more) { const open = menu.hidden; menu.hidden = !open; more.setAttribute('aria-expanded', String(open)); return; }
      const b = e.target.closest('[data-fp]');
      if (b) { togglePanel(b.dataset.fp); if (menu) { menu.hidden = true; const m = document.getElementById('mtMore'); if (m) m.setAttribute('aria-expanded', 'false'); } return; }
      const x = e.target.closest('[data-fp-close]'); if (x) { closePanel(x.dataset.fpClose); return; }
      if (menu && !menu.hidden && !e.target.closest('#mtMenu')) { menu.hidden = true; const m = document.getElementById('mtMore'); if (m) m.setAttribute('aria-expanded', 'false'); }
    });
    window.addEventListener('resize', () => Object.keys(panels).forEach((id) => { if (!panels[id].el.hidden) place(id); }));
  }
  S.utilsInit = init;
})();

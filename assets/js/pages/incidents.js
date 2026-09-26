/* 사고 학습 — 사고사례 분석·재발방지 워크북, 최신 동향 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui;
  const n = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));
  const LIKE = [1, 2, 3, 4, 5], SEV = [1, 2, 3, 4];
  const STATUS = () => [['plan', T('계획', 'Planned')], ['doing', T('진행', 'In progress')], ['done', T('완료', 'Done')], ['hold', T('보류', 'On hold')]];
  const LAT = () => [['todo', T('미착수', 'Not started')], ['doing', T('진행', 'In progress')], ['done', T('완료', 'Done')]];
  const VER = () => [['na', T('미측정', 'Not measured')], ['met', T('달성', 'Met')], ['miss', T('미달', 'Missed')]];
  /* case type → risk-workbench hazard type (the workbench has no asphyxiation or enforcement type) */
  const TYPE_TO_RA = { asphyx: 'other', reg: 'other' };

  /* ---------- data helpers ---------- */
  const userCases = () => S.load('cases.user', []);
  const allCases = () => S.CASES.concat(userCases());
  const findCase = (id) => allCases().find((c) => c.id === id);
  const stateOf = (id) => Object.assign({ risk: null, act: {}, lat: {}, ver: {} }, S.load('case.st.' + id, null) || {});
  const saveState = (id, st) => S.save('case.st.' + id, st);
  const riskOf = (c) => {
    const st = stateOf(c.id).risk;
    const r = c.risk || { before: { l: 3, s: 3 }, after: { l: 1, s: 3 } };
    return { bl: st ? st.bl : r.before.l, bs: st ? st.bs : r.before.s, al: st ? st.al : r.after.l, as: st ? st.as : r.after.s };
  };
  const band = (score) => (score <= 3 ? 'ok' : score <= 6 ? 'warn' : 'bad');
  const lawBasis = (b, ref) => {
    if (!b) return '';
    if (b.startsWith('law:')) return `<span class="basis law">${S.T('법령', 'Law')} · ${S.esc(S.lawRef(b))}</span>`;
    return ui.basis(b) + (ref ? ' KOSHA ' + S.koshaTag(ref) : '');
  };
  /* shared with the printable report (print.js) */
  S.caseApi = { findCase, stateOf, riskOf, status: STATUS, lat: LAT, ver: VER };
  S.caseStats = function () {
    let total = 0, done = 0;
    allCases().forEach((c) => { const st = stateOf(c.id); (c.actions || []).forEach((a, i) => { total++; if ((st.act[i] || {}).st === 'done') done++; }); });
    return { total, done };
  };
  S.newCaseFromIncident = function (inc) {
    const id = 'u' + Date.now();
    /* keep both languages when the record has them (sample data); user text is stored as typed */
    const bi = (x) => (x == null ? { ko: '', en: '' } : typeof x === 'string' ? { ko: x, en: x } : { ko: x.ko || '', en: x.en || x.ko || '' });
    const cut = (o, n) => { const c1 = (s) => (s.length > n ? s.slice(0, n).trimEnd() + '…' : s); return { ko: c1(o.ko), en: c1(o.en) }; };
    const what = bi(inc.what), fix = bi(inc.fix);
    const c = {
      id, user: true, date: inc.date || S.iso(S.today()), dateLabel: { ko: inc.date || '', en: inc.date || '' }, site: inc.site || S.state.site,
      types: [S.CASE_TYPES[inc.type] ? inc.type : 'other'], official: false,
      t: what.ko ? cut(what, 40) : { ko: '새 사고', en: 'New incident' },
      impact: { ko: '', en: '' },
      facts: what.ko ? [{ t: what, src: [] }] : [], officialFindings: [],
      why: (inc.why || []).map(bi).filter((w) => w.ko).map((w) => ({ k: 'an', t: w })),
      m4: ['man', 'machine', 'media', 'management'].reduce((o, k) => { const hit = (inc.m4 || []).includes(k); o[k] = { ko: hit ? '해당 (조사 기록에서 선택)' : '', en: hit ? 'Applies (from the investigation)' : '' }; return o; }, {}),
      barriers: { held: { ko: [], en: [] }, failed: { ko: [], en: [] } },
      risk: { before: { l: 3, s: 3 }, after: { l: 1, s: 3 }, why: { ko: '', en: '' } },
      actions: fix.ko ? [{ lvl: inc.level || 'adm', t: fix, b: 'gp' }] : [],
      lateral: { ko: [], en: [] }, verify: [], lesson: { ko: '', en: '' }, sops: [], src: []
    };
    const list = userCases(); list.unshift(c); S.save('cases.user', list);
    return id;
  };

  /* ---------- small renderers ---------- */
  const sel = (id, opts, val, attrs) => `<select id="${id}" ${attrs || ''}>${opts.map(([v, l]) => `<option value="${v}" ${String(v) === String(val) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  const typeChips = (c) => (c.types || []).map((t) => `<span class="chip">${L(S.CASE_TYPES[t])}</span>`).join(' ');
  const siteName = (s) => L((S.SITES[s] || S.SITES.common).name);
  /* 업계 사례(타사)는 사업장 대신 '업계 사례 · 회사명'을 표시 */
  const placeOf = (x) => x.peer ? L(x.peer) : siteName(x.site);

  function processStrip() {
    const steps = [T('사실 확인', 'Establish facts'), T('원인 분석', 'Find causes'), T('위험성 평가', 'Assess risk'), T('제거·저감 대책', 'Eliminate / reduce'), T('잔여 위험 확인', 'Check residual risk'), T('수평전개', 'Share laterally'), T('효과성 검증', 'Verify effect')];
    return `<ol class="proc" aria-label="${T('재발방지 절차', 'Recurrence-prevention steps')}">${steps.map((s, i) => `<li><span class="no">${i + 1}</span>${s}</li>`).join('')}</ol>`;
  }

  /* 사례의 출처 구분 — 목록 분류 칩에 쓴다 */
  const originOf = (c) => (c.user ? 'mine' : /^gov-/.test(c.id) ? 'gov' : c.peer ? 'peer' : 'sk');
  const ORIGIN = { sk: { ko: 'SK하이닉스', en: 'SK hynix' }, peer: { ko: '업계 사례', en: 'Industry' }, gov: { ko: '정부 보고서', en: 'Government reports' }, mine: { ko: '내 사례', en: 'My cases' } };
  const bothText = (o) => (o == null ? '' : typeof o === 'string' ? o : [].concat(o.ko || '', o.en || '').join(' '));
  function caseCard(c, active) {
    return `<a class="sop-card case-card" href="#cases/${c.id}" ${active ? 'aria-current="true"' : ''} style="text-decoration:none"
      data-li="${S.esc([c.id, bothText(c.t), bothText(c.impact), bothText(c.peer), c.date].join(' '))}" data-f-ty="${(c.types || []).join(' ')}" data-f-o="${originOf(c)}">
      <div class="row" style="justify-content:space-between"><span class="num small">${S.esc(L(c.dateLabel) || c.date)}</span><span class="chip">${S.esc(placeOf(c))}</span></div>
      <h3>${S.esc(L(c.t))}</h3>
      <span class="small muted">${S.esc(L(c.impact))}</span>
      <div class="row">${typeChips(c)} ${c.user ? `<span class="chip">${T('내 사례', 'My case')}</span>` : c.official ? ui.pill('info', T('공식 원인 확인', 'Official cause')) : ui.pill('plain', T('공식 원인 미공개', 'No official cause'))}</div>
    </a>`;
  }

  function exposurePanel(c) {
    if (!c.exposure) return '';
    const chem = S.CHEMICALS.find((x) => x.id === c.exposure.chem);
    const v = c.exposure.value;
    const rows = [];
    if (chem.twa) rows.push(`<tr><td>${T('국내 노출기준 TWA', 'Korean TWA')}${S.cite('moelOel')}</td><td class="n">${chem.twa} ${chem.unit}</td><td class="n"><b>${S.fmt(v / chem.twa, 0)}${T('배', '×')}</b></td></tr>`);
    if (chem.idlh) rows.push(`<tr><td>NIOSH IDLH${S.cite('nioshIdlh')}</td><td class="n">${chem.idlh} ${chem.idlhUnit}</td><td class="n"><b>${S.fmt(v / chem.idlh * 100, 0)}%</b></td></tr>`);
    return `<div class="panel">${ui.title(T('보도된 농도와 기준 비교', 'Reported level vs limits'), `${S.esc(L(chem))} ${v} ${chem.unit}`)}
      <div class="table-wrap"><table class="data"><thead><tr><th>${T('기준', 'Limit')}</th><th class="n">${T('기준값', 'Value')}</th><th class="n">${T('보도값 대비', 'Reported vs limit')}</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>
      <p class="xs muted" style="margin-top:6px">${L(c.exposure.note)}</p></div>`;
  }

  function riskPanel(c) {
    const r = riskOf(c);
    const before = r.bl * r.bs, after = r.al * r.as;
    const gb = S.skGrade(before), ga = S.skGrade(after);
    const target = after <= 3 ? ui.pill('ok', T('최저 구간(1–3, C) 도달 — 현재의 안전대책 유지로 작업 가능', 'Lowest band reached (1–3, C) — work may continue with current measures'))
      : after <= 6 ? ui.pill('warn', T('허용 가능(4–6, C) — 안전정보·주기 교육 유지, 더 낮추려면 제거·대체 검토', 'Acceptable (4–6, C) — keep information and training; to go lower, look at elimination'))
        : ui.pill('bad', T('아직 허용 불가(8 이상) — 추가 대책 필요', 'Still not acceptable (8+) — more measures needed'));
    const opt = (arr) => arr.map((v) => [v, v]);
    return `<div class="panel" id="anchor-risk">${ui.title(T('위험성 평가 — 대책 전 → 후', 'Risk — before → after measures'), T('SK하이닉스 공개 수준표(1–20) 적용', 'Using the SK hynix published scale (1–20)'))}
      <div class="grid g2">
        <div class="stack">
          <div class="row"><b style="min-width:70px">${T('대책 전', 'Before')}</b>
            <label class="xs muted" for="rk-bl">${T('가능성', 'L')}</label>${sel('rk-bl', opt(LIKE), r.bl, 'data-rk="bl"')}
            <label class="xs muted" for="rk-bs">${T('중대성', 'S')}</label>${sel('rk-bs', opt(SEV), r.bs, 'data-rk="bs"')}
            <span class="num big-inline">${before}</span><span class="grade ${gb.g}">${gb.g}</span></div>
          <div class="row"><b style="min-width:70px">${T('대책 후', 'After')}</b>
            <label class="xs muted" for="rk-al">${T('가능성', 'L')}</label>${sel('rk-al', opt(LIKE), r.al, 'data-rk="al"')}
            <label class="xs muted" for="rk-as">${T('중대성', 'S')}</label>${sel('rk-as', opt(SEV), r.as, 'data-rk="as"')}
            <span class="num big-inline">${after}</span><span class="grade ${ga.g}">${ga.g}</span></div>
          ${ui.bars([{ label: T('대책 전', 'Before'), v: before, tone: before >= 8 ? 'bad' : before >= 4 ? 'warn' : 'ok' }, { label: T('대책 후', 'After'), v: after, tone: after >= 8 ? 'bad' : after >= 4 ? 'warn' : 'ok' }],
            { max: 20, unit: T('점', 'pts'), caption: T('위험도 점수 = 가능성 × 중대성 (최대 20)', 'Risk score = likelihood × severity (max 20)'), refs: [{ v: 3, label: T('최저 구간 상한 3점', 'Lowest band ≤ 3') }, { v: 6, label: T('허용 가능 상한 6점', 'Acceptable ≤ 6') }], aria: T('위험도 대책 전후 비교', 'Risk before and after') })}
          <div>${target.replace('class="pill ', 'class="pill wrap ')}</div>
          <p class="xs muted">${T('목표는 “무시 가능한 수준” = SK하이닉스 수준표 최저 구간 1–3점(C, 현재의 안전대책 유지로 작업 가능)입니다. 중대성 4(사망)인 위험은 가능성을 1로 낮춰도 4점이므로, 최저 구간에 들어가려면 위험원 자체를 없애는 설계가 필요합니다.', 'The target (“negligible”) is the lowest SK hynix band, 1–3 (C: continue with current measures). A severity-4 (fatal) hazard still scores 4 at likelihood 1, so reaching the lowest band means designing the hazard out.')}${S.cite('sr2026')}</p>
        </div>
        <div class="stack">
          <div class="callout small"><b>${T('평가 근거 (포털 예시)', 'Rationale (portal example)')}</b><br>${S.esc(L(c.risk && c.risk.why) || T('근거를 입력하세요', 'Add your rationale'))}</div>
          <div class="gauge" aria-hidden="true" style="height:14px"><i style="width:${before / 20 * 100}%;background:var(--bad);opacity:.35"></i><i style="width:${after / 20 * 100}%;background:${after <= 3 ? 'var(--ok)' : after <= 6 ? 'var(--warn)' : 'var(--bad)'}"></i></div>
          <div class="gauge-scale" aria-hidden="true">${[0, 3, 6, 10, 15, 20].map((v) => `<span style="left:${v / 20 * 100}%">${v}</span>`).join('')}</div>
          <p class="xs muted">${T('옅은 막대 = 대책 전, 진한 막대 = 대책 후', 'Light bar = before, solid bar = after')}</p>
        </div>
      </div></div>`;
  }

  function actionsPanel(c) {
    const st = stateOf(c.id);
    const acts = c.actions || [];
    const levels = S.CTRL_LEVELS;
    const done = acts.filter((a, i) => (st.act[i] || {}).st === 'done').length;
    return `<div class="panel" id="anchor-actions">${ui.title(T('재발방지 대책 — 대책 위계 순', 'Recurrence prevention — by control hierarchy'), T(`${done}/${acts.length} 완료 · 포털 제안이며 회사의 실제 조치가 아닙니다`, `${done}/${acts.length} done · portal proposals, not the company’s actual measures`))}
      <div class="table-wrap"><table class="data"><thead><tr><th>${T('위계', 'Level')}</th><th>${T('대책', 'Measure')}</th><th>${T('근거', 'Basis')}</th><th>${T('담당', 'Owner')}</th><th>${T('기한', 'Due')}</th><th>${T('상태', 'Status')}</th>${c.user ? '<th></th>' : ''}</tr></thead><tbody>
      ${levels.map((lv) => acts.map((a, i) => a.lvl !== lv.id ? '' : `<tr><td><span class="chip">${L(lv.t)}</span></td><td class="small">${S.esc(L(a.t))}</td><td>${lawBasis(a.b, a.ref)}</td>
        <td><input type="text" data-act="${i}" data-k="own" value="${S.esc((st.act[i] || {}).own || '')}" aria-label="${T('담당', 'Owner')}" style="min-width:90px"></td>
        <td><input type="date" data-act="${i}" data-k="due" value="${S.esc((st.act[i] || {}).due || '')}" aria-label="${T('기한', 'Due')}"></td>
        <td>${sel('act-st-' + i, STATUS(), (st.act[i] || {}).st || 'plan', `data-act="${i}" data-k="st"`)}</td>
        ${c.user ? `<td><button class="btn danger sm" type="button" data-act-del="${i}">×</button></td>` : ''}</tr>`).join('')).join('')}
      </tbody></table></div>
      ${c.user ? `<form class="row" id="actForm" style="margin-top:8px">${sel('act-lvl', levels.map((l) => [l.id, L(l.t)]), 'eng')}<input type="text" id="act-t" placeholder="${T('대책 내용', 'Measure')}" style="flex:1;min-width:200px" required><button class="btn" type="submit">${T('대책 추가', 'Add measure')}</button></form>` : ''}
      <p class="xs muted" style="margin-top:6px">${T('위에서부터 제거·대체 → 공학적 → 행정적 → 보호구 순으로 검토합니다. 아래로 갈수록 사람의 행동에 기대는 대책이라 효과가 약합니다.', 'Work top-down: eliminate/substitute → engineering → administrative → PPE. Lower levels rely more on behaviour and are weaker.')}</p>
    </div>`;
  }

  function lateralVerify(c) {
    const st = stateOf(c.id);
    const lat = L(c.lateral) || [];
    const ver = c.verify || [];
    return `<div class="grid g2">
      <div class="panel">${ui.title(T('수평전개', 'Lateral deployment'), T('같은 위험이 있는 다른 곳에도 적용', 'Apply wherever the same hazard exists'))}
        <div class="stack">${lat.map((x, i) => `<div class="row" style="justify-content:space-between;gap:8px"><span class="small" style="flex:1">${S.esc(x)}</span>${sel('lat-' + i, LAT(), st.lat[i] || 'todo', `data-lat="${i}"`)}</div>`).join('') || `<p class="small muted">${T('항목이 없습니다', 'No items yet')}</p>`}</div>
        ${c.user ? `<form class="row" id="latForm" style="margin-top:8px"><input type="text" id="lat-t" placeholder="${T('수평전개 대상', 'Where else')}" style="flex:1;min-width:180px" required><button class="btn sm" type="submit">${T('추가', 'Add')}</button></form>` : ''}
      </div>
      <div class="panel">${ui.title(T('효과성 검증', 'Effectiveness check'), T('30·90·180일 후 확인 권장', 'Check at 30, 90 and 180 days'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('지표', 'Indicator')}</th><th>${T('목표', 'Target')}</th><th>${T('실적', 'Actual')}</th><th>${T('판정', 'Result')}</th></tr></thead><tbody>
          ${ver.map((v, i) => `<tr><td class="small">${S.esc(L(v.k))}</td><td class="small">${S.esc(L(v.target))}</td>
            <td><input type="text" data-ver="${i}" data-k="val" value="${S.esc((st.ver[i] || {}).val || '')}" aria-label="${T('실적', 'Actual')}" style="min-width:80px"></td>
            <td>${sel('ver-' + i, VER(), (st.ver[i] || {}).st || 'na', `data-ver="${i}" data-k="st"`)}</td></tr>`).join('') || `<tr><td colspan="4" class="small muted">${T('지표가 없습니다', 'No indicators yet')}</td></tr>`}
        </tbody></table></div>
        ${c.user ? `<form class="row" id="verForm" style="margin-top:8px"><input type="text" id="ver-k" placeholder="${T('지표', 'Indicator')}" style="flex:1;min-width:140px" required><input type="text" id="ver-t" placeholder="${T('목표', 'Target')}" style="max-width:140px"><button class="btn sm" type="submit">${T('추가', 'Add')}</button></form>` : ''}
      </div></div>`;
  }

  function userEditor(c) {
    const lines = (arr) => arr.map((x) => L(x.t || x)).join('\n');
    return `<section class="panel stack" id="anchor-edit">${ui.title(T('사례 편집', 'Edit this case'), T('내 사례는 이 브라우저에만 저장됩니다', 'Your cases are saved in this browser only'))}
      <form id="caseEdit" class="stack">
        <div class="form-grid">
          <div class="field"><label for="ce-t">${T('제목', 'Title')}</label><input type="text" id="ce-t" value="${S.esc(L(c.t))}" required></div>
          <div class="field"><label for="ce-date">${T('발생일', 'Date')}</label><input type="date" id="ce-date" value="${S.esc(c.date)}"></div>
          <div class="field"><label for="ce-site">${T('사업장', 'Site')}</label>${sel('ce-site', [['common', siteName('common')], ['icheon', siteName('icheon')], ['cheongju', siteName('cheongju')]], c.site)}</div>
          <div class="field"><label for="ce-impact">${T('피해 요약', 'Impact')}</label><input type="text" id="ce-impact" value="${S.esc(L(c.impact))}"></div>
        </div>
        <div class="row">${Object.keys(S.CASE_TYPES).map((k) => `<label class="check"><input type="checkbox" data-ce-type="${k}" ${(c.types || []).includes(k) ? 'checked' : ''}> ${L(S.CASE_TYPES[k])}</label>`).join('')}</div>
        <div class="field"><label for="ce-facts">${T('사실관계 (한 줄에 하나)', 'Facts (one per line)')}</label><textarea id="ce-facts" rows="3">${S.esc(lines(c.facts || []))}</textarea></div>
        <div class="field"><label for="ce-why">${T('왜-왜 분석 (한 줄에 하나, 위에서 아래로)', '5-Why (one per line, top to bottom)')}</label><textarea id="ce-why" rows="5">${S.esc(lines(c.why || []))}</textarea></div>
        <div class="form-grid">${['man', 'machine', 'media', 'management'].map((k) => `<div class="field"><label for="ce-m4-${k}">4M · ${k}</label><input type="text" id="ce-m4-${k}" value="${S.esc(L((c.m4 || {})[k]))}"></div>`).join('')}</div>
        <div class="field"><label for="ce-rw">${T('위험성 평가 근거', 'Risk rationale')}</label><input type="text" id="ce-rw" value="${S.esc(L(c.risk && c.risk.why))}"></div>
        <div class="field"><label for="ce-lesson">${T('교훈 한 줄', 'One-line lesson')}</label><input type="text" id="ce-lesson" value="${S.esc(L(c.lesson))}"></div>
        <div class="row"><button class="btn" type="submit">${T('저장', 'Save')}</button><button class="btn danger" type="button" id="ce-del">${T('사례 삭제', 'Delete case')}</button></div>
      </form></section>`;
  }

  function detail(c) {
    const m4 = c.m4 || {};
    const held = L(c.barriers && c.barriers.held) || [], failed = L(c.barriers && c.barriers.failed) || [];
    return `
    <section class="panel stack" id="case-detail">
      <div class="row" style="justify-content:space-between">
        <div class="stack" style="gap:4px"><span class="eyebrow">${S.esc(L(c.dateLabel) || c.date)} · ${S.esc(placeOf(c))}</span><h2 style="font-size:calc(22px * var(--fz))">${S.esc(L(c.t))}</h2><span class="small">${S.esc(L(c.impact))}</span></div>
        <div class="row">${typeChips(c)}</div>
      </div>
      <div class="row small"><span class="tag-off">${T('공식', 'Official')}</span> ${T('정부·법원 등 공식 확인', 'Confirmed by government or court')} <span class="tag-an">${T('분석', 'Analysis')}</span> ${T('공개정보 기반 포털 분석(가설)', 'Portal analysis from public information (hypothesis)')}</div>
      <div class="grid g2">
        <div><b class="small">${T('1. 사실관계', '1. Facts')}</b><ul class="facts" style="margin-top:6px">${(c.facts || []).map((f) => `<li>${S.esc(L(f.t))}${S.cite(f.src || [])}</li>`).join('')}</ul></div>
        <div><b class="small">${T('공식 확인 사항', 'Official findings')}</b>${(c.officialFindings || []).length ? `<ul class="facts" style="margin-top:6px">${c.officialFindings.map((f) => `<li><span class="tag-off">${T('공식', 'Official')}</span> ${S.esc(L(f.t))}${S.cite(f.src || [])}</li>`).join('')}</ul>` : `<p class="small muted" style="margin-top:6px">${T('공식 원인 조사 결과가 공개되지 않았습니다. 아래 원인분석은 공개 정보에 기반한 가설입니다.', 'No official cause has been published. The analysis below is a hypothesis from public information.')}</p>`}</div>
      </div>
    </section>
    <section class="grid g3">
      <div class="panel span2">${ui.title(T('2. 원인 분석 — 왜-왜 분석(5-Why)', '2. Cause analysis — 5-Why'))}
        <ol class="why">${(c.why || []).map((w) => `<li><span class="${w.k === 'off' ? 'tag-off' : 'tag-an'}">${w.k === 'off' ? T('공식', 'Official') : T('분석', 'Analysis')}</span> ${S.esc(L(w.t))}</li>`).join('')}</ol>
        <div class="table-wrap" style="margin-top:12px"><table class="data"><thead><tr><th>4M</th><th>${T('요인', 'Factor')}</th></tr></thead><tbody>
          ${[['man', T('사람 (Man)', 'Man')], ['machine', T('기계·설비 (Machine)', 'Machine')], ['media', T('작업 환경·방법 (Media)', 'Media')], ['management', T('관리 (Management)', 'Management')]].map(([k, l]) => `<tr><td>${l}</td><td class="small">${S.esc(L(m4[k])) || '–'}</td></tr>`).join('')}
        </tbody></table></div>
      </div>
      <div class="panel">${ui.title(T('방호벽 점검', 'Barrier check'))}
        <b class="small" style="color:var(--ok)">${T('작동한 방호벽', 'Barriers that held')}</b><ul class="facts" style="margin:6px 0 12px">${held.map((x) => `<li>${S.esc(x)}</li>`).join('') || `<li class="muted">–</li>`}</ul>
        <b class="small" style="color:var(--bad)">${T('뚫린 방호벽', 'Barriers that failed')}</b><ul class="facts" style="margin-top:6px">${failed.map((x) => `<li>${S.esc(x)}</li>`).join('') || `<li class="muted">–</li>`}</ul>
      </div>
    </section>
    ${exposurePanel(c)}
    ${riskPanel(c)}
    ${actionsPanel(c)}
    ${lateralVerify(c)}
    <section class="panel stack">${ui.title(T('교훈과 연결', 'Lesson and links'))}
      ${L(c.lesson) ? `<p style="font-size:calc(17px * var(--fz));font-weight:600;line-height:1.5">“${S.esc(L(c.lesson))}”</p>` : ''}
      <div class="row">${(c.sops || []).map((id) => { const s = S.SOPS.find((x) => x.id === id); return s ? `<a class="chip" href="#sop/${id}">SOP · ${L(s.t)}</a>` : ''; }).join('')}
        <button class="btn ghost sm" type="button" id="to-ra">${T('위험성평가(빈도·강도법)로 보내기', 'Send to risk assessment (frequency–severity)')}</button>${S.printLink('case/' + c.id, T('재발방지 보고서 인쇄', 'Print the recurrence report'))}</div>
    </section>
    ${c.user ? userEditor(c) : ''}`;
  }

  /* ---------- pages ---------- */
  /* cases for the current site, and the one to show: #cases/<id> wins, then the last one viewed if it is in the list */
  const pick = (sub) => {
    const site = S.state.site;
    const list = allCases().filter((c) => site === 'common' || c.site === site || c.site === 'common').sort((a, b) => (Number(!!a.peer) - Number(!!b.peer)) || String(b.date).localeCompare(String(a.date)));
    const direct = sub ? findCase(sub) : null;
    let cur = direct || findCase(S.load('cases.sel', null));
    if (!direct && cur && !list.some((x) => x.id === cur.id)) cur = null;
    return { list, cur: cur || list[0] || S.CASES[0], direct: !!direct };
  };
  S.pages.cases = {
    render(sub) {
      const site = S.state.site;
      const { list, cur } = pick(sub);
      /* #cases/timeline · #cases/selfcheck · #cases/<사례 id> → 해당 탭 (탭 클릭에 의한 재렌더 때는 선택 유지) */
      if (!S.state.refreshing && sub) {
        const t = sub === 'timeline' ? 'timeline' : sub === 'selfcheck' ? 'selfcheck' : findCase(sub) ? 'cases' : null;
        if (t) S.save('tab.casev', t);
        if (t === 'cases') S.save('lb.cases', {});   /* 찾아온 사례가 필터에 가려지지 않게 */
      }
      const view = S.tab('casev', 'cases');
      const tl = S.TIMELINE.filter((x) => site === 'common' || x.site === site || x.site === 'common');
      const ck = S.load('moelck', {});
      const ckCount = (s, v) => S.MOEL_FINDINGS.filter((f) => ((ck[f.id] || {})[s] || '') === v).length;
      const tyN = {}, oN = {};
      list.forEach((c) => { (c.types || []).forEach((t) => { tyN[t] = (tyN[t] || 0) + 1; }); const o = originOf(c); oN[o] = (oN[o] || 0) + 1; });
      return `
      ${ui.head(T('사고 학습', 'Learning from incidents'), T('사고사례 분석·재발방지', 'Incident analysis & recurrence prevention'),
        T('실제 사고를 공식 자료로 확인하고, 원인 분석부터 재발방지까지 사례별로 연습합니다.', 'Real incidents checked against official records, worked through from cause analysis to recurrence prevention.'),
        T('SK하이닉스에서 실제로 일어난 사고를 공식 자료와 보도로 확인하고, 원인을 분석해 위험을 없애거나 무시 가능한 수준까지 낮추는 재발방지 과정을 사례별로 연습합니다. 공식 확인과 포털 분석(가설)을 구분해 표시합니다. 반도체 업계에서 정부가 공식 조사 결과를 공개한 타사 사고는 ‘업계 사례’로, 고용노동부가 공개한 재해조사보고서 중 SOP와 같은 작업 유형의 사고는 ‘정부 보고서’로 함께 싣습니다.', 'Real SK hynix incidents, checked against official records and reporting, worked through case by case: find the causes, then eliminate the risk or cut it to a negligible level so it cannot happen again. Official findings and portal analysis (hypotheses) are labelled separately. Accidents at other chipmakers are included as industry cases only where the government has published its investigation, and MOEL accident-investigation reports on the same kinds of work as the SOPs appear as government reports.'))}
      ${ui.tabs('casev', [{ id: 'cases', label: T(`사례 분석 ${list.length}`, `Cases ${list.length}`) }, { id: 'timeline', label: T(`사고 타임라인 ${tl.length}`, `Timeline ${tl.length}`) }, { id: 'selfcheck', label: T(`업계 지적 자가점검 ${S.MOEL_FINDINGS.length}`, `Industry findings ${S.MOEL_FINDINGS.length}`) }], view)}
      ${view === 'cases' ? `
      ${processStrip()}
      <section class="panel stack">
        ${ui.title(T('사례 목록', 'Cases'), T(`${L(S.SITES[site].name)} 기준`, `${L(S.SITES[site].name)}`))}
        ${S.listbar({ id: 'cases', ph: T('사고명·물질·장소로 찾기 — 예: 가스, 질소, 청주', 'Search by incident, substance or place — e.g. gas, nitrogen, Cheongju'), total: list.length,
          facets: [{ key: 'o', label: T('출처', 'Origin'), opts: Object.keys(ORIGIN).filter((k) => oN[k]).map((k) => ({ id: k, label: L(ORIGIN[k]), n: oN[k] })) },
            { key: 'ty', label: T('사고 유형', 'Type'), opts: Object.keys(S.CASE_TYPES).filter((k) => tyN[k]).map((k) => ({ id: k, label: L(S.CASE_TYPES[k]), n: tyN[k] })) }] })}
        <div class="sop-grid">${list.map((c) => caseCard(c, c.id === cur.id)).join('')}</div>
        <p class="lb-empty" data-lb-empty hidden>${T('조건에 맞는 사례가 없습니다.', 'No cases match.')}</p>
        <div class="row"><button class="btn ghost sm" type="button" id="case-new">+ ${T('내 사례 새로 만들기', 'Create my own case')}</button><span class="xs muted">${T('예방안전의 사고조사 기록에서도 사례를 만들 수 있습니다.', 'You can also start a case from an investigation in Preventive safety.')}</span></div>
      </section>
      ${cur ? detail(cur) : ''}` : ''}
      ${view === 'timeline' ? `
      <section class="panel" id="anchor-timeline">${ui.title(T('사고 타임라인', 'Incident timeline'), T('분석 사례와 짧은 기록', 'Analysed cases and short records'))}
        <ol class="timeline">${tl.map((x) => `<li><span class="num">${x.date}</span><span class="chip">${S.esc(placeOf(x))}</span> <span>${S.esc(L(x.t))}${S.cite(x.src)}</span>${x.caseId ? ` <a class="xs" href="#cases/${x.caseId}">${T('분석 보기', 'Open analysis')} →</a>` : ''}</li>`).join('')}</ol>
      </section>` : ''}
      ${view === 'selfcheck' ? `
      <section class="panel" id="anchor-selfcheck">${ui.title(T('업계 공통 지적 사항 자가점검', 'Self-check against industry findings'), T('고용노동부 2026 반도체 집중점검 지적 사항으로 우리 사업장을 수평 점검', 'Use MOEL’s 2026 chipmaker findings to check your own sites'))}
        <div class="row small" style="margin-bottom:8px"><span>${T('이천', 'Icheon')}: ${ui.pill('ok', T(`적합 ${ckCount('icheon', 'ok')}`, `OK ${ckCount('icheon', 'ok')}`))} ${ui.pill('bad', T(`개선 ${ckCount('icheon', 'ng')}`, `Fix ${ckCount('icheon', 'ng')}`))}</span><span>${T('청주', 'Cheongju')}: ${ui.pill('ok', T(`적합 ${ckCount('cheongju', 'ok')}`, `OK ${ckCount('cheongju', 'ok')}`))} ${ui.pill('bad', T(`개선 ${ckCount('cheongju', 'ng')}`, `Fix ${ckCount('cheongju', 'ng')}`))}</span></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('점검 항목', 'Check')}</th><th>${T('지적된 곳', 'Where found')}</th><th>${T('이천', 'Icheon')}</th><th>${T('청주', 'Cheongju')}</th></tr></thead><tbody>
          ${S.MOEL_FINDINGS.map((f) => `<tr><td class="small">${L(f.t)}</td><td class="xs muted">${L(f.where)}</td>${['icheon', 'cheongju'].map((s) => `<td>${sel(`ck-${f.id}-${s}`, [['', T('미확인', 'Unchecked')], ['ok', T('적합', 'OK')], ['ng', T('개선 필요', 'Needs fix')]], (ck[f.id] || {})[s] || '', `data-ck="${f.id}" data-s="${s}"`)}</td>`).join('')}</tr>`).join('')}
        </tbody></table></div>
        <div class="row" style="margin-top:8px">${S.printLink('selfcheck', T('자가점검표 인쇄', 'Print the self-check sheet'))}</div>
        <p class="xs muted" style="margin-top:6px">${T('고용노동부는 위반 사례를 협·단체를 통해 전파해 점검을 받지 않은 사업장도 스스로 확인·개선하도록 유도하겠다고 밝혔습니다. 입력값은 예시·연습용이며 이 브라우저에만 저장됩니다.', 'MOEL said it will circulate the findings so uninspected sites can check and fix themselves. Entries are for practice and are saved in this browser only.')}${S.cite('moel0920')}</p>
      </section>` : ''}`;
    },
    mount(root, sub) {
      const { cur: c, direct } = pick(sub);
      root.querySelectorAll('[data-ck]').forEach((el) => el.addEventListener('change', () => { const ck = S.load('moelck', {}); ck[el.dataset.ck] = Object.assign({}, ck[el.dataset.ck], { [el.dataset.s]: el.value }); S.save('moelck', ck); S.refresh(); }));
      if (S.tab('casev', 'cases') !== 'cases') return;
      S.save('cases.sel', c.id);
      S.listFilter(root, 'cases');
      if (direct && !S.state.refreshing) setTimeout(() => { const d = root.querySelector('#case-detail'); if (d) S.reveal(d); }, 0);
      const st = stateOf(c.id);
      const persist = () => { saveState(c.id, st); S.refresh(); };
      root.querySelectorAll('[data-rk]').forEach((s) => s.addEventListener('change', () => { const r = riskOf(c); r[s.dataset.rk] = Number(s.value); st.risk = r; persist(); }));
      root.querySelectorAll('[data-act]').forEach((el) => el.addEventListener('change', () => { const i = el.dataset.act; st.act[i] = Object.assign({}, st.act[i], { [el.dataset.k]: el.value }); persist(); }));
      root.querySelectorAll('[data-lat]').forEach((el) => el.addEventListener('change', () => { st.lat[el.dataset.lat] = el.value; persist(); }));
      root.querySelectorAll('[data-ver]').forEach((el) => el.addEventListener('change', () => { const i = el.dataset.ver; st.ver[i] = Object.assign({}, st.ver[i], { [el.dataset.k]: el.value }); persist(); }));
      root.querySelector('#case-new').addEventListener('click', () => { const id = S.newCaseFromIncident({ what: '', why: [], m4: [], fix: '', date: S.iso(S.today()), site: S.state.site, type: 'contact' }); location.hash = '#cases/' + id; });
      root.querySelector('#to-ra').addEventListener('click', () => {
        const r = riskOf(c); const rows = S.load('ra.fs', null) || [];
        const firstAn = (c.why || [])[0];
        const t0 = (c.types || [])[0] || 'other';
        rows.push({ task: L(c.t), haz: firstAn ? L(firstAn.t).split('→').pop().trim() : L(c.impact), type: TYPE_TO_RA[t0] || t0, now: '', l: r.bl, s: r.bs, fix: (c.actions || []).slice(0, 3).map((a) => L(a.t)).join(' / '), l2: r.al, s2: r.as, own: '' });
        S.save('ra.fs', rows); S.save('tab.risk', 'fs'); location.hash = '#risk';
      });
      if (!c.user) return;
      const updateUser = (fn) => { const lst = userCases(); const u = lst.find((x) => x.id === c.id); if (!u) return; fn(u); S.save('cases.user', lst); S.refresh(); };
      const both = (v) => ({ ko: v, en: v });
      const af = root.querySelector('#actForm'); if (af) af.addEventListener('submit', (e) => { e.preventDefault(); const t = root.querySelector('#act-t').value.trim(); if (!t) return; updateUser((u) => { u.actions.push({ lvl: root.querySelector('#act-lvl').value, t: both(t), b: 'gp' }); }); });
      root.querySelectorAll('[data-act-del]').forEach((b) => b.addEventListener('click', () => updateUser((u) => {
        const i = Number(b.dataset.actDel); u.actions.splice(i, 1);
        /* keep owner/due/status with their measures: shift the entries after the deleted one */
        const s2 = stateOf(c.id), nx = {};
        Object.keys(s2.act).forEach((k) => { const j = Number(k); if (j < i) nx[j] = s2.act[k]; else if (j > i) nx[j - 1] = s2.act[k]; });
        s2.act = nx; saveState(c.id, s2);
      })));
      const lf = root.querySelector('#latForm'); if (lf) lf.addEventListener('submit', (e) => { e.preventDefault(); const t = root.querySelector('#lat-t').value.trim(); if (!t) return; updateUser((u) => { u.lateral.ko.push(t); u.lateral.en.push(t); }); });
      const vf = root.querySelector('#verForm'); if (vf) vf.addEventListener('submit', (e) => { e.preventDefault(); const k = root.querySelector('#ver-k').value.trim(); if (!k) return; updateUser((u) => { u.verify.push({ k: both(k), target: both(root.querySelector('#ver-t').value.trim()) }); }); });
      const ce = root.querySelector('#caseEdit');
      if (ce) ce.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = (id) => root.querySelector(id).value;
        const t = v('#ce-t').trim(); if (!t) { S.toast(S.T('제목을 입력하세요', 'Enter a title')); return; }
        updateUser((u) => {
          u.t = both(t); u.date = v('#ce-date'); u.dateLabel = both(v('#ce-date')); u.site = v('#ce-site'); u.impact = both(v('#ce-impact'));
          u.types = [...root.querySelectorAll('[data-ce-type]:checked')].map((x) => x.dataset.ceType);
          u.facts = v('#ce-facts').split('\n').map((x) => x.trim()).filter(Boolean).map((x) => ({ t: both(x), src: [] }));
          u.why = v('#ce-why').split('\n').map((x) => x.trim()).filter(Boolean).map((x) => ({ k: 'an', t: both(x) }));
          ['man', 'machine', 'media', 'management'].forEach((k) => { u.m4[k] = both(v('#ce-m4-' + k)); });
          u.risk.why = both(v('#ce-rw')); u.lesson = both(v('#ce-lesson'));
        });
        S.toast(S.T('사례를 저장했습니다', 'Case saved'));
      });
      const del = root.querySelector('#ce-del');
      if (del) del.addEventListener('click', () => {
        if (del.dataset.armed !== '1') { del.dataset.armed = '1'; del.textContent = S.T('한 번 더 누르면 삭제', 'Click again to delete'); return; }
        S.save('cases.user', userCases().filter((x) => x.id !== c.id)); S.drop('case.st.' + c.id); S.drop('cases.sel'); location.hash = '#cases';
      });
    }
  };

  const KIND = { reg: { ko: '규제·감독', en: 'Regulator', lv: 'bad' }, sk: { ko: 'SK하이닉스', en: 'SK hynix', lv: 'info' }, acc: { ko: '사고', en: 'Incident', lv: 'warn' }, law: { ko: '법령', en: 'Law', lv: 'ok' } };
  S.pages.news = {
    render() {
      const kN = {}; S.NEWS.forEach((x) => { kN[x.kind] = (kN[x.kind] || 0) + 1; });
      const yN = {}; S.NEWS.forEach((x) => { const y = String(x.date).slice(0, 4); yN[y] = (yN[y] || 0) + 1; });
      return `
      ${ui.head(T('사고 학습', 'Learning from incidents'), T('최신 안전 동향', 'Latest safety updates'),
        T('정부 발표·법령 개정·회사 공식 발표·사고 보도를 한 줄씩 모았습니다.', 'Government announcements, law changes, company releases and incident reports, one line each.'),
        T(`기준일 ${S.NEWS_ASOF}. 각 항목의 [번호]는 원문 출처이고, ‘관련 화면’은 포털에서 이어서 볼 곳입니다.`, `As of ${S.NEWS_ASOF}. Each [number] links to the original source; “Related page” opens the matching part of the portal.`))}
      <section class="panel stack">
        ${S.listbar({ id: 'news', ph: T('동향 검색 — 예: 도급, 가스, 과태료', 'Search updates — e.g. contracting, gas, fine'), total: S.NEWS.length,
          facets: [{ key: 'k', label: T('분류', 'Kind'), opts: Object.keys(KIND).filter((id) => kN[id]).map((id) => ({ id, label: L(KIND[id]), n: kN[id] })) },
            { key: 'y', label: T('연도', 'Year'), opts: Object.keys(yN).sort().reverse().map((y) => ({ id: y, label: y, n: yN[y] })) }] })}
        <ol class="timeline news">${S.NEWS.map((x) => `<li data-li="${S.esc(bothText(x.t))}" data-f-k="${x.kind}" data-f-y="${String(x.date).slice(0, 4)}"><span class="num">${x.date}</span>${ui.pill(KIND[x.kind].lv, L(KIND[x.kind]))} <span>${S.esc(L(x.t))}${S.cite(x.src)}</span>${x.link ? ` <a class="xs" href="${x.link}">${T('관련 화면', 'Related page')} →</a>` : ''}</li>`).join('')}</ol>
        <p class="lb-empty" data-lb-empty hidden>${T('조건에 맞는 동향이 없습니다.', 'No updates match.')}</p>
      </section>
      <p class="xs muted">${T('업데이트 방법: assets/js/data/cases.js 의 SHE.NEWS 배열에 날짜·분류·내용·출처 id를 추가하고, 새 출처는 sources.js 에 등록합니다.', 'To update: add date, kind, text and source ids to SHE.NEWS in assets/js/data/cases.js, and register new sources in sources.js.')}</p>`;
    },
    mount(root) { S.listFilter(root, 'news'); }
  };
})();

/* 작업허가서 작성기 — PSM 고시 제33·46조, KOSHA C-C-49-2026, 안전보건규칙 조문을 한 흐름으로 묶은 작성·발급·종료 도구
   #ptw — 목록과 편집 · #ptw/<id> — 해당 허가서 · #ptw/new/<sopId> — SOP에서 새 허가서 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui, esc = S.esc;
  const num = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));
  const STATUS = () => ({ draft: T('작성 중', 'Draft'), issued: T('발급됨', 'Issued'), active: T('작업 중', 'In progress'), closed: T('종료', 'Closed'), cancelled: T('취소', 'Cancelled') });
  const ST_LEVEL = { draft: 'info', issued: 'warn', active: 'bad', closed: 'ok', cancelled: 'info' };
  const nowTime = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  const stamp = () => S.iso(new Date()) + ' ' + nowTime();

  const list = () => S.load('ptw.list', []);
  const example = () => JSON.parse(JSON.stringify(S.PTW_EXAMPLE));
  const find = (id) => (id === 'ex1' ? example() : list().find((p) => p.id === id));
  S.ptwFind = find;

  /* gas rows: the four acceptable-air gases plus flammables, and any ppm substance in the DB (judged against its TWA, or C) */
  const gasDef = (id) => {
    const g = S.PTW_GAS.find((x) => x.id === id);
    if (g) return { t: L(g.t), u: g.u, ok: g.ok, rule: L(g.rule), b: g.b };
    const c = S.CHEMICALS.find((x) => x.id === id);
    if (!c) return null;
    const lim = c.twa != null ? c.twa : c.c;
    return { t: `${L(c)} (${c.f})`, u: c.unit, ok: lim == null ? null : (v) => v < lim, rule: lim == null ? '–' : `${c.twa != null ? 'TWA' : 'C'} ${lim} ${c.unit} ${T('미만', 'or less')}`, b: 'kosha:C-C-87 7.2(2)|C-C-87 7.2(2)' };
  };
  const gasOptions = (sel) => S.PTW_GAS.map((g) => `<option value="${g.id}" ${g.id === sel ? 'selected' : ''}>${esc(L(g.t))}</option>`).join('')
    + `<optgroup label="${esc(T('물질 DB (TWA 기준)', 'Substance DB (vs TWA)'))}">${S.CHEMICALS.filter((c) => c.unit === 'ppm' && S.hasOel(c)).map((c) => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${esc(L(c))} (${c.f})</option>`).join('')}</optgroup>`;
  const gasVerdict = (row) => {
    const d = gasDef(row.id), v = num(row.v);
    if (!d || v == null || !d.ok) return null;
    return d.ok(v) ? 'ok' : 'bad';
  };

  /* which check groups apply to a permit */
  const groups = (p) => ['common', p.main].concat(p.supp || []).filter((g) => S.PTW_CHECKS[g]);
  const groupTitle = (g) => (g === 'common' ? T('공통 — 허가 절차', 'Common — permit procedure') : S.PTW_MAIN[g] ? L(S.PTW_MAIN[g].t) : T('보충 허가 · ', 'Supplementary · ') + L(S.PTW_SUPP[g].t));
  const required = (p, item) => item.req || (item.id === 'h12' && p.fw);

  /* reasons the permit cannot be issued yet (empty = ready) */
  function blockers(p) {
    const out = [];
    if (!p.date || !p.from || !p.to) out.push(T('작업일과 시작·종료 시각을 적으세요 (PSM 고시 제46조 제5호)', 'Enter the work date and start and end times (PSM Notice Art. 46(5))'));
    else if (p.to <= p.from) out.push(T('종료 시각이 시작 시각보다 늦어야 합니다 — 허가는 당일 정상근무시간 안에서만 유효합니다 (C-C-49 5.6)', 'The end time must be after the start — a permit is valid within one day’s normal working hours (C-C-49 5.6)'));
    if (!String(L(p.area) || '').trim()) out.push(T('작업장소를 적으세요', 'Enter the work location'));
    if (!String(L(p.task) || '').trim()) out.push(T('작업 개요를 적으세요', 'Describe the work'));
    const miss = [];
    groups(p).forEach((g) => S.PTW_CHECKS[g].forEach((it) => { if (required(p, it) && !(p.checks || {})[it.id]) miss.push(it.id); }));
    if (miss.length) out.push(T(`필수 확인 항목 ${miss.length}개가 남았습니다`, `${miss.length} required checks are still open`));
    const gas = p.gas || [];
    if (p.main === 'hot' && !gas.some((r) => r.id === 'lel' && num(r.v) != null)) out.push(T('화기작업은 인화성 가스(HC) 측정값이 필요합니다 (제241조②5)', 'Hot work needs a flammable-gas (HC) reading (Art. 241(2)5)'));
    if ((p.supp || []).includes('confined') && !gas.some((r) => r.id === 'o2' && num(r.v) != null)) out.push(T('밀폐공간은 산소 측정값이 필요합니다 (제619조의2)', 'Confined-space entry needs an oxygen reading (Art. 619-2)'));
    const bad = gas.filter((r) => gasVerdict(r) === 'bad');
    if (bad.length) out.push(T(`기준을 벗어난 가스 측정값 ${bad.length}건 — 환기·격리 후 재측정`, `${bad.length} gas readings out of range — ventilate or isolate and re-test`));
    const r = p.roles || {};
    [['applicant', T('신청인을 적으세요 (C-C-49 5.2)', 'Name the applicant (C-C-49 5.2)')], ['issuer', T('발급자를 적으세요 (C-C-49 5.2)', 'Name the issuer (C-C-49 5.2)')], ['approver', T('승인자를 적으세요 (C-C-49 5.2)', 'Name the approver (C-C-49 5.2)')]].forEach(([k, msg]) => { if (!String(L(r[k]) || '').trim()) out.push(msg); });
    if (p.main === 'hot' && p.fw && !String(L(r.firewatch) || '').trim()) out.push(T('화재감시자를 적으세요 (제241조의2)', 'Name the fire watch (Art. 241-2)'));
    if ((p.supp || []).includes('confined') && !String(L(r.watcher) || '').trim()) out.push(T('밀폐공간 감시인을 적으세요 (제623조)', 'Name the confined-space attendant (Art. 623)'));
    return out;
  }
  /* 모니터링(별지3)·절차 평가(별지4) 응답 집계 */
  const ANS = () => [['y', T('예', 'Yes')], ['n', T('아니오', 'No')], ['na', T('해당없음', 'N/A')]];
  const tally = (a, keys) => keys.reduce((o, k) => { const v = (a || {})[k]; if (v) o[v] = (o[v] || 0) + 1; else o.blank++; return o; }, { y: 0, n: 0, na: 0, blank: 0 });
  const monKeys = () => S.PTW_MON.map((_, i) => 'm' + (i + 1));
  const audKeys = () => [].concat(...S.PTW_AUDIT.map((g) => g.q.map(([n]) => 'q' + n)));
  const audit = () => S.load('ptw.audit', { date: '', by: '', a: {}, note: '' });
  const retention = (p) => ((p.supp || []).includes('confined') ? 3 : 1);
  S.ptwApi = { find, groups, groupTitle, required, gasDef, gasVerdict, status: STATUS, blockers, ANS, tally, monKeys, audKeys, audit, retention };

  const progress = (p) => {
    let n = 0, done = 0, req = 0, reqDone = 0;
    groups(p).forEach((g) => S.PTW_CHECKS[g].forEach((it) => { n++; const d = !!(p.checks || {})[it.id]; if (d) done++; if (required(p, it)) { req++; if (d) reqDone++; } }));
    return { n, done, req, reqDone };
  };

  function newPermit(from) {
    const today = S.iso(S.today());
    const same = list().filter((p) => p.date === today).length;
    const p = { id: 'p' + Date.now(), no: `PTW-${today.replace(/-/g, '')}-${String(same + 1).padStart(2, '0')}`, status: 'draft', site: S.state.site,
      date: today, from: '09:00', to: '17:00', main: 'general', supp: [], area: '', equip: '', task: '', team: '', workers: '',
      pre: {}, checks: {}, gas: [], roles: {}, fw: false, log: [{ at: stamp(), st: 'draft' }] };
    if (from && from.sop) {
      const s = S.SOPS.find((x) => x.id === from.sop);
      if (s) {
        const types = [].concat(...(s.permits || []).map((k) => S.PTW_FROM_SOP[k] || []));
        p.main = types.includes('hot') ? 'hot' : 'general';
        p.supp = [...new Set(types.filter((t) => S.PTW_SUPP[t]))];
        p.task = L(s.t); p.sop = s.id;
      }
    }
    if (from && from.copy) {
      const c = from.copy;
      ['site', 'main', 'area', 'equip', 'task', 'team', 'workers', 'sop'].forEach((k) => { p[k] = L(c[k]) || c[k] || p[k]; });
      p.supp = (c.supp || []).slice();
    }
    return p;
  }

  S.pages.ptw = {
    render(sub) {
      const all = list();
      const parts = String(sub || '').split('/');
      const cid = parts[0] && parts[0] !== 'new' && parts[0] !== 'audit' ? parts[0] : S.load('ptw.cur', null);
      const p = (cid && find(cid)) || all[0] || example();
      const isEx = !!p.ex;
      const lock = isEx || p.status === 'closed' || p.status === 'cancelled';
      const dis = lock ? 'disabled' : '';
      const pr = progress(p), bl = blockers(p);
      const today = S.iso(S.today());
      const stale = all.filter((x) => (x.status === 'issued' || x.status === 'active') && x.date && x.date < today);
      const R = p.roles || {};
      const ck = (it) => `<label class="check ptw-ck"><input type="checkbox" data-ck="${it.id}" ${(p.checks || {})[it.id] ? 'checked' : ''} ${dis}> <span>${esc(L(it))} ${required(p, it) ? `<span class="req-tag">${T('필수', 'Req.')}</span>` : ''} ${ui.basis(it.b)}</span></label>`;
      const field = (k, label, type, val, attrs) => `<div class="field"><label for="pf-${k}">${label}</label>${type === 'area'
        ? `<textarea id="pf-${k}" data-f="${k}" ${dis}>${esc(val)}</textarea>`
        : `<input type="${type}" id="pf-${k}" data-f="${k}" value="${esc(val)}" ${attrs || ''} ${dis}>`}</div>`;
      const trans = {
        draft: [['issued', T('발급', 'Issue'), bl.length > 0], ['cancelled', T('취소', 'Cancel')]],
        issued: [['active', T('작업 시작', 'Start work')], ['cancelled', T('취소', 'Cancel')]],
        active: [['closed', T('작업 종료', 'Close out'), !p.restored]],
        closed: [], cancelled: []
      }[p.status] || [];
      /* 단계 표시기 상태 (가독성 2차 개편 D14) — 입력 현황으로 완료·진행·부적합을 표시 */
      const stepItems = () => {
        const has = (v) => !!(v != null && String(L(v)).trim());
        const s1 = [p.date, p.from, p.to, p.area, p.task, p.workers].filter(has).length;
        const pre = S.PTW_PRE.filter((it) => (p.pre || {})[it.id]).length;
        const gasRows = (p.gas || []).filter((r) => r.v !== '' && r.v != null);
        const gasBad = gasRows.some((r) => gasVerdict(r) === 'bad');
        const roles = S.PTW_ROLES.filter(([k]) => (k !== 'firewatch' || (p.main === 'hot' && p.fw)) && (k !== 'watcher' || (p.supp || []).includes('confined')));
        const rf = roles.filter(([k]) => has(R[k])).length;
        const live = !isEx && (p.status === 'issued' || p.status === 'active');
        const st = (done, some) => (done ? 'done' : some ? 'part' : 'todo');
        return [
          { n: 1, t: T('작업 정보', 'Job details'), st: st(s1 === 6, s1 > 0) },
          { n: 2, t: T('허가 종류', 'Permit types'), st: p.main ? 'done' : 'todo' },
          { n: 3, t: T('허가 전 점검', 'Pre-permit review'), st: st(pre === S.PTW_PRE.length, pre > 0) },
          { n: 4, t: T('안전조치', 'Safety measures'), st: st(pr.req > 0 && pr.reqDone === pr.req, pr.done > 0) },
          { n: 5, t: T('가스 측정', 'Gas tests'), st: gasBad ? 'bad' : st(gasRows.length > 0, false) },
          { n: 6, t: T('역할·서명', 'Roles & sign-off'), st: st(roles.length > 0 && rf === roles.length, rf > 0) },
          { n: 7, t: T('발급·종료', 'Issue & close-out'), st: p.status === 'closed' ? 'done' : p.status === 'issued' || p.status === 'active' ? 'part' : p.status === 'cancelled' ? 'na' : 'todo' },
          { n: 8, t: T('모니터링', 'Monitoring'), st: (p.mon || []).length ? 'done' : live ? 'todo' : 'na' }
        ];
      };
      const page = `
      ${ui.head(T('판정·평가 도구', 'Tools'), T('작업허가서 작성기', 'Permit-to-work builder'),
        T('작업허가서를 만들고 발급부터 종료까지 기록합니다.', 'Build a permit to work and record it from issue to close-out.'),
        T('화기·일반위험 허가에 밀폐공간·정전·굴착·방사선·고소·중장비 보충 허가를 붙여, 법령 조문과 KOSHA 안전작업허가 기술지원규정(C-C-49-2026)의 확인 항목을 빠짐없이 체크하고 가스 측정값을 판정한 뒤 발급 → 작업 중 → 종료까지 기록합니다. 완성된 허가서는 A4로 인쇄해 현장에 게시합니다.',
          'Combine a hot-work or general permit with supplementary permits (confined space, isolation, excavation, radiation, height, heavy equipment), tick every check drawn from the statutes and KOSHA’s permit guide (C-C-49-2026), judge gas readings, then record issue → work → close-out. Print the finished permit on A4 and post it at the job.'))}
      ${stale.length ? `<div class="callout bad small">${T(`어제 이전 날짜의 발급·작업 중 허가서가 ${stale.length}건 있습니다 — 허가는 당일에만 유효하므로 종료하거나 재발급하세요 (C-C-49 5.6②).`, `${stale.length} issued or active permits are dated before today — permits are valid for one day only, so close them or re-issue (C-C-49 5.6(2)).`)} ${stale.map((x) => `<a href="#ptw/${esc(x.id)}">${esc(x.no)}</a>`).join(' · ')}</div>` : ''}
      <section class="panel" id="anchor-list">${ui.title(T('허가서 목록', 'Permits'), `${all.length}${T('건', '')} ${all.length ? '' : ui.ex()}`)}
        <div class="row" style="margin-bottom:10px"><button class="btn sm" type="button" id="ptw-new">+ ${T('새 허가서', 'New permit')}</button>
          ${isEx ? `<button class="btn ghost sm" type="button" id="ptw-from-ex">${T('예시를 복사해 시작', 'Start from the example')}</button>` : `<button class="btn ghost sm" type="button" id="ptw-dup">${T('이 허가서 복제 (익일 재발급 등)', 'Duplicate (e.g. re-issue next day)')}</button>`}
          ${S.printLink('ptw/' + p.id, T('허가서 인쇄', 'Print permit'))}</div>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('허가번호', 'No.')}</th><th>${T('작업일', 'Date')}</th><th>${T('장소', 'Location')}</th><th>${T('허가 종류', 'Permits')}</th><th>${T('상태', 'Status')}</th><th></th></tr></thead><tbody>
          ${(all.length ? all : [example()]).map((x) => `<tr ${x.id === p.id ? 'class="sel"' : ''}><td class="num nowrap">${esc(x.no)}${x.ex ? ' ' + ui.ex() : ''}</td><td class="num nowrap">${esc(x.date)}</td><td class="small">${esc(L(x.area))}</td>
            <td class="small">${esc(L(S.PTW_MAIN[x.main].t))}${(x.supp || []).map((s) => ' + ' + esc(L(S.PTW_SUPP[s].t))).join('')}</td><td class="nowrap">${ui.pill(ST_LEVEL[x.status] || 'info', STATUS()[x.status] || x.status)}</td>
            <td class="nowrap"><a class="btn ghost sm" href="#ptw/${esc(x.id)}">${T('열기', 'Open')}</a> ${x.ex ? '' : `<button class="btn danger sm" type="button" data-del="${esc(x.id)}">${T('삭제', 'Delete')}</button>`}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="xs muted" style="margin-top:6px">${T('허가서는 작업 완료 후 1년간 보관합니다(PSM 고시 제46조 제6호). C-C-49-2026은 밀폐공간 출입작업 허가서를 3년 보존하고(5.5(2)), 허가서·위험성평가 결과 등은 작업 완료 후 최소 30일 현장에 둔 뒤 1년간 보관하도록 권고합니다(8(2)). 밀폐공간 산소·유해가스 측정 기록은 법정 3년 보존입니다(제619조의2④). 입력값은 이 브라우저에만 저장되므로 백업하세요.', 'Keep permits for one year after the work (PSM Notice Art. 46(6)). C-C-49-2026 keeps confined-space entry permits for three years (5.5(2)) and advises keeping permits and risk assessments at the site for at least 30 days after the work, then for one year (8(2)). Confined-space gas records must be kept for three years by law (Art. 619-2(4)). Entries live in this browser only — back them up.')}${S.cite('moelPsm', 'koshaCC49', 'lawStd')}</p>
      </section>

      <section class="panel stack" id="anchor-edit">
        ${ui.title(`${esc(p.no)} · ${esc(STATUS()[p.status])}`, isEx ? ui.ex() : T(`확인 ${pr.done}/${pr.n} · 필수 ${pr.reqDone}/${pr.req}`, `Checks ${pr.done}/${pr.n} · required ${pr.reqDone}/${pr.req}`))}
        ${isEx ? `<div class="callout small">${T('예시 허가서입니다(가상 데이터, 수정 불가). ‘새 허가서’ 또는 ‘예시를 복사해 시작’을 누르세요.', 'This is an example permit (fictional, read-only). Press “New permit” or “Start from the example”.')}</div>` : ''}
        ${lock && !isEx ? `<div class="callout small">${T('종료·취소된 허가서는 수정할 수 없습니다. 같은 작업을 다시 하려면 복제해 새로 발급하세요.', 'Closed or cancelled permits cannot be edited. Duplicate it to issue a new one for the same job.')}</div>` : ''}
        <!--step:1--><h3 class="sub-h">1. ${T('작업 정보', 'Job details')}</h3>
        <div class="form-grid">
          ${field('no', T('허가번호', 'Permit no.'), 'text', p.no)}
          <div class="field"><label for="pf-site">${T('사업장', 'Site')}</label><select id="pf-site" data-f="site" ${dis}>${Object.keys(S.SITES).map((k) => `<option value="${k}" ${p.site === k ? 'selected' : ''}>${esc(L(S.SITES[k].name))}</option>`).join('')}</select></div>
          ${field('date', T('작업일 (허가일)', 'Work date'), 'date', p.date)}
          ${field('from', T('허가 시작', 'Valid from'), 'time', p.from)}
          ${field('to', T('허가 종료', 'Valid to'), 'time', p.to)}
          ${field('team', T('신청 부서·업체', 'Requesting team / contractor'), 'text', L(p.team))}
        </div>
        <div class="form-grid">
          ${field('area', T('작업장소', 'Location'), 'text', L(p.area))}
          ${field('equip', T('설비(기기)·장치번호', 'Equipment / tag'), 'text', L(p.equip))}
          ${field('workers', T('작업자 (성명·인원)', 'Workers (names / number)'), 'text', L(p.workers))}
        </div>
        ${field('task', T('작업 개요', 'Work description'), 'area', L(p.task))}
        ${p.sop ? `<p class="xs">${T('연결 SOP', 'Linked SOP')}: <a href="#sop/${esc(p.sop)}">${esc(L((S.SOPS.find((s) => s.id === p.sop) || {}).t))}</a> · ${S.printLink('card/' + p.sop, T('5분 카드 인쇄', 'Print 5-minute card'))}</p>` : ''}

        <!--step:2--><h3 class="sub-h">2. ${T('허가 종류', 'Permit types')} <span class="xs muted">${T('주 허가 1개 + 해당하는 보충 허가 (C-C-49 5.1)', 'One main permit plus any supplementary ones (C-C-49 5.1)')}</span></h3>
        <div class="grid g2">
          ${Object.keys(S.PTW_MAIN).map((k) => `<label class="check opt-card ${p.main === k ? 'on' : ''}"><input type="radio" name="ptw-main" data-main="${k}" ${p.main === k ? 'checked' : ''} ${dis}> <span><b>${esc(L(S.PTW_MAIN[k].t))}</b><br><span class="xs muted">${esc(L(S.PTW_MAIN[k].d))}</span></span></label>`).join('')}
        </div>
        <div class="grid g3">
          ${Object.keys(S.PTW_SUPP).map((k) => { const s = S.PTW_SUPP[k]; const on = (p.supp || []).includes(k);
            return `<label class="check opt-card ${on ? 'on' : ''}"><input type="checkbox" data-supp="${k}" ${on ? 'checked' : ''} ${dis}> <span><b>${esc(L(s.t))}</b><br><span class="xs muted">${esc(L(s.d))}</span>${s.edu ? `<br><span class="xs">${T(`특별교육 대상 작업 제${s.edu}호`, `Special training item ${s.edu}`)}</span>` : ''}</span></label>`; }).join('')}
        </div>
        ${p.main === 'hot' ? `<label class="check"><input type="checkbox" id="ptw-fw" ${p.fw ? 'checked' : ''} ${dis}> ${T('화재감시자 배치 대상 — 작업반경 11m 이내 건물 구조·내부에 가연성물질, 11m 밖이라도 바닥 하부 가연물이 불꽃에 쉽게 발화, 금속 칸막이·벽 반대편에 가연물 인접 중 하나 (제241조의2①)', 'Fire watch required — combustibles within 11 m in the structure; combustibles below the floor that sparks could ignite even beyond 11 m; or combustibles against the far side of a metal partition, wall or roof (Art. 241-2(1))')}</label>` : ''}

        <!--step:3--><h3 class="sub-h">3. ${T('작업허가 전 점검', 'Pre-permit review')} <span class="xs muted">${T('발급자와 현장 감독자가 서류·도면·현장으로 확인 (C-C-49 6.1)', 'Issuer and supervisor check papers, drawings and the site (C-C-49 6.1)')}</span></h3>
        <div class="grid g2">${S.PTW_PRE.map((it) => { const sp = S.PTW_PRE_SUPP[it.id]; const on = sp && (p.supp || []).includes(sp);
          return `<label class="check ptw-ck"><input type="checkbox" data-pre="${it.id}" ${(p.pre || {})[it.id] ? 'checked' : ''} ${dis}> <span>${esc(L(it))}${sp ? ` <span class="chip ${on ? '' : 'muted'}">${T('보충', 'Supp.')}: ${esc(L(S.PTW_SUPP[sp].t))} ${on ? '✓' : T('— 해당하면 선택', '— select if it applies')}</span>` : ''}</span></label>`; }).join('')}</div>

        <!--step:4--><h3 class="sub-h">4. ${T('안전조치 확인', 'Safety measures')} <span class="xs muted">${T('‘필수’는 포털이 발급 전에 요구하는 항목', '“Req.” items must be ticked before issue (portal rule)')}</span></h3>
        ${groups(p).map((g) => `<details class="ptw-grp" open><summary><b>${esc(groupTitle(g))}</b> <span class="xs muted">${S.PTW_CHECKS[g].filter((it) => (p.checks || {})[it.id]).length}/${S.PTW_CHECKS[g].length}</span></summary>
          <div class="stack" style="gap:6px;margin-top:8px">${S.PTW_CHECKS[g].map(ck).join('')}</div></details>`).join('')}

        <!--step:5--><h3 class="sub-h">5. ${T('가스 농도 측정', 'Gas tests')} <span class="xs muted">${T('작업 전·재개 전마다 측정 (제619조의2, C-C-49 7.1(3)(아)·7.3(1)(마)④)', 'Before work and before every restart (Art. 619-2; C-C-49 7.1(3)(h), 7.3(1)(e)4)')}</span></h3>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('항목', 'Gas')}</th><th class="n">${T('측정값', 'Reading')}</th><th>${T('기준', 'Criterion')}</th><th>${T('측정 시각', 'Time')}</th><th>${T('측정자', 'Tester')}</th><th>${T('판정', 'Result')}</th><th></th></tr></thead><tbody>
          ${(p.gas || []).map((r, i) => { const d = gasDef(r.id) || { u: '', rule: '–' }; const v = gasVerdict(r);
            return `<tr><td><select data-gas="${i}" data-k="id" aria-label="${T('항목', 'Gas')} ${i + 1}" ${dis}>${gasOptions(r.id)}</select></td>
              <td class="n"><input type="number" step="any" min="0" data-gas="${i}" data-k="v" value="${esc(r.v)}" style="max-width:100px" aria-label="${T('측정값', 'Reading')} ${i + 1}" ${dis}> <span class="xs">${esc(d.u)}</span></td>
              <td class="small">${esc(d.rule)}</td><td><input type="time" data-gas="${i}" data-k="time" value="${esc(r.time)}" aria-label="${T('측정 시각', 'Time')} ${i + 1}" ${dis}></td>
              <td><input type="text" data-gas="${i}" data-k="by" value="${esc(L(r.by))}" aria-label="${T('측정자', 'Tester')} ${i + 1}" ${dis}></td>
              <td>${v ? ui.pill(v, v === 'ok' ? T('적합', 'OK') : T('부적합', 'Fail')) : '<span class="xs muted">–</span>'}</td>
              <td>${lock ? '' : `<button class="btn danger sm" type="button" data-gas-del="${i}" aria-label="${T('삭제', 'Delete')}">×</button>`}</td></tr>`; }).join('') || `<tr><td colspan="7" class="small muted">${T('측정값이 없습니다', 'No readings yet')}</td></tr>`}
        </tbody></table></div>
        ${lock ? '' : `<div class="row"><button class="btn ghost sm" type="button" id="gas-add">+ ${T('측정값 추가', 'Add reading')}</button>
          <button class="btn ghost sm" type="button" id="gas-set">${T('적정공기 4종 + 인화성 행 추가', 'Add O₂, flammable, CO, CO₂, H₂S rows')}</button></div>`}
        ${ui.fine(`<p class="xs muted">${T('측정 대상은 작업에 따라 다릅니다 — 불활성가스 공정은 산소, 인화성물질 설비 내부는 산소와 그 물질, 유해화학물질 설비 내부는 산소와 그 물질, 유기물 부패 가능 장소는 산소·CO₂·CO·H₂S·메탄 (C-C-49 7.3(1)(마)②). 물질 행은 밀폐공간 작업 측정용 경보 기준인 TWA로 판정합니다(C-C-87 7.2(2)).', 'What to test depends on the job — inert-gas processes: oxygen; inside flammable-material equipment: oxygen and that material; inside toxic-chemical equipment: oxygen and that chemical; where organic matter may rot: O₂, CO₂, CO, H₂S and methane (C-C-49 7.3(1)(e)2). Substance rows are judged against the TWA, the alarm basis for confined-space testing instruments (C-C-87 7.2(2)).')}${S.cite('lawStd', 'koshaCC49', 'koshaCC87')} <a href="#gas">${T('가스 경보 설정값 검토 →', 'Alarm set-point review →')}</a></p>`, T('측정 대상·판정 기준', 'What to test and how it is judged'))}

        <!--step:6--><h3 class="sub-h">6. ${T('역할·서명', 'Roles and sign-off')} <span class="xs muted">${T('발급: 운전부서 담당자가 현장 확인 후 · 승인: 운전부서 책임자 (C-C-49 5.2·5.3)', 'Issued by operations after a site check; approved by the operations head (C-C-49 5.2–5.3)')}</span></h3>
        <div class="form-grid">${S.PTW_ROLES.filter(([k]) => (k !== 'firewatch' || (p.main === 'hot' && p.fw)) && (k !== 'watcher' || (p.supp || []).includes('confined'))).map(([k, l]) =>
          `<div class="field"><label for="pr-${k}">${esc(L(l))}</label><input type="text" id="pr-${k}" data-role="${k}" value="${esc(L(R[k]))}" ${dis}></div>`).join('')}</div>

        <!--step:7--><h3 class="sub-h">7. ${T('발급·작업·종료', 'Issue, work and close-out')}</h3>
        ${p.status === 'draft' ? (bl.length ? `<div class="callout warn small"><b>${T('아직 발급할 수 없습니다', 'Not ready to issue')}</b><ul class="clean">${bl.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : `<div class="callout small">${ui.pill('ok', T('발급 가능', 'Ready to issue'))} ${T('발급자는 현장 조치를 직접 확인한 뒤 발급하고, 승인자는 서면으로 확인해 승인합니다.', 'The issuer confirms the measures on site before issuing; the approver checks in writing.')}</div>`) : ''}
        ${p.status === 'active' ? `<div class="form-grid">
            <div class="field"><label for="pf-extTo">${T('연장 종료 시각 (당일, 작업자·발급자 변경 없을 때)', 'Extend to (same day, same crew and issuer)')}</label><input type="time" id="pf-extTo" value="${esc(p.extTo || '')}"></div>
            <div class="field" style="align-self:end"><button class="btn ghost sm" type="button" id="ptw-ext">${T('연장 기록', 'Record extension')}</button></div></div>
          <p class="xs muted">${T('교대시간 이후로 연장하면 발급자(또는 위임받은 사람)가 현장을 다시 확인하고 서명합니다. 다음 날까지 이어지거나 작업·안전요구사항이 바뀌면 재발급합니다(C-C-49 5.4(5)·5.6).', 'Extending past a shift change means the issuer (or delegate) re-checks the site and signs again. Work running into the next day, or any change in the job or safety requirements, needs a new permit (C-C-49 5.4(5), 5.6).')}</p>
          <label class="check"><input type="checkbox" id="ptw-restored" ${p.restored ? 'checked' : ''}> ${T('작업 완료 — 공구·잠금·맹판·임시 설비를 정리하고 설비를 복원(조치)했으며, 전원 복구는 운전부서 입회자 요청으로 함', 'Work complete — tools, locks, blinds and temporary kit removed and the plant restored; power restored only at the operations attendant’s request')}</label>
          <div class="field"><label for="pf-closeNote">${T('복원(조치) 상태·특별사항', 'Restoration and remarks')}</label><input type="text" id="pf-closeNote" value="${esc(p.closeNote || '')}"></div>` : ''}
        ${trans.length ? `<div class="row">${trans.map(([st, l, off]) => `<button class="btn ${st === 'cancelled' ? 'danger' : ''} sm" type="button" data-st="${st}" ${off || isEx ? 'disabled' : ''}>${esc(l)}</button>`).join('')}</div>` : ''}
        ${(p.log || []).length ? `<ol class="clean xs muted">${p.log.map((x) => `<li>${esc(x.at)} — ${esc(STATUS()[x.st] || x.st)}${x.note ? ' · ' + esc(x.note) : ''}</li>`).join('')}</ol>` : ''}
        <p class="callout small">${T('허가의 효력은 허가서에 적은 기간에만 있고 일일 정상근무시간을 넘을 수 없습니다. 식사 등으로 멈췄다가 다시 시작할 때는 입회자나 현장 책임자에게 안전상태를 다시 확인받고 서명한 뒤 작업합니다(C-C-49 5.6). 이 도구는 포털의 판단 보조이며, 실제 허가 기준·양식·권한은 사내 안전작업허가 규정을 따르세요.', 'A permit is valid only for the period written on it and never beyond one day’s normal working hours. After a break (e.g. a meal) the attendant or site lead re-confirms safe conditions and signs before work resumes (C-C-49 5.6). This tool is a portal aid; follow your site’s own permit rules, forms and authorities.')}${S.cite('koshaCC49', 'moelPsm')}</p>

        <!--step:8--><h3 class="sub-h" id="anchor-monitor">8. ${T('작업허가 모니터링', 'Permit monitoring')} <span class="xs muted">${T('발급자 점검과 별도로 현장 관리자·감독자가 작업 중 확인 (C-C-49 8(3), 별지 양식3)', 'Checked during the work by site managers and supervisors, on top of the issuer’s checks (C-C-49 8(3), Form 3)')}</span></h3>
        ${(() => {
          const live = !isEx && (p.status === 'issued' || p.status === 'active');
          const md = p.monDraft || {}, ma = md.a || {}, mons = p.mon || [], mt = tally(ma, monKeys());
          const mdis = live ? '' : 'disabled';
          return `${live ? '' : `<p class="xs muted">${isEx ? T('예시 허가서에는 기록할 수 없습니다. 새 허가서를 발급한 뒤 작업 중에 기록하세요.', 'You cannot record on the example permit. Issue a new permit and record during the work.') : T('발급됨·작업 중 상태에서 기록합니다.', 'Recorded while the permit is issued or in progress.')}</p>`}
            ${mt.n ? `<div class="callout bad small">${T('‘아니오’ 항목이 있습니다 — 안전하지 않은 조건이면 작업을 중지하고 담당부서에 즉시 알리세요 (별지 양식3).', 'Some answers are “No” — if conditions are unsafe, stop the work and tell the responsible department at once (Form 3).')}</div>` : ''}
            <div class="table-wrap"><table class="data"><thead><tr><th class="n">No.</th><th>${T('확인 사항', 'Check')}</th><th>${T('응답', 'Answer')}</th></tr></thead><tbody>
              ${S.PTW_MON.map((m, i) => `<tr><td class="n">${i + 1}</td><td class="small">${esc(L(m))}</td><td class="nowrap"><select data-mon="m${i + 1}" aria-label="${T('응답', 'Answer')} ${i + 1}" ${mdis}><option value=""></option>${ANS().map(([v, l]) => `<option value="${v}" ${ma['m' + (i + 1)] === v ? 'selected' : ''}>${l}</option>`).join('')}</select></td></tr>`).join('')}
            </tbody></table></div>
            <div class="form-grid">
              <div class="field"><label for="mon-by">${T('검토자', 'Reviewer')}</label><input type="text" id="mon-by" value="${esc(md.by || '')}" ${mdis}></div>
              <div class="field"><label for="mon-lead">${T('작업수행 책임자', 'Person in charge of the work')}</label><input type="text" id="mon-lead" value="${esc(md.lead || '')}" ${mdis}></div>
              <div class="field"><label for="mon-note">${T('의견', 'Comments')}</label><input type="text" id="mon-note" value="${esc(md.note || '')}" ${mdis}></div>
            </div>
            <div class="row">${live ? `<button class="btn sm" type="button" id="mon-save">${T('모니터링 기록 저장', 'Save monitoring record')}</button>` : ''}
              <span class="xs muted">${T(`응답 ${20 - mt.blank}/20 · 예 ${mt.y} · 아니오 ${mt.n} · 해당없음 ${mt.na}`, `Answered ${20 - mt.blank}/20 · yes ${mt.y} · no ${mt.n} · n/a ${mt.na}`)}</span>
              ${S.printLink('ptwmon/' + p.id + '/blank', T('빈 체크리스트 인쇄', 'Print blank checklist'))}</div>
            ${mons.length ? `<div class="table-wrap"><table class="data"><thead><tr><th>${T('기록 시각', 'Recorded')}</th><th>${T('검토자', 'Reviewer')}</th><th class="n">${T('예', 'Yes')}</th><th class="n">${T('아니오', 'No')}</th><th class="n">${T('해당없음', 'N/A')}</th><th></th></tr></thead><tbody>
              ${mons.map((r, i) => { const t2 = tally(r.a, monKeys()); return `<tr><td class="num nowrap">${esc(r.at)}</td><td class="small">${esc(r.by)}</td><td class="n">${t2.y}</td><td class="n">${t2.n ? `<b style="color:var(--bad)">${t2.n}</b>` : 0}</td><td class="n">${t2.na}</td><td class="nowrap">${S.printLink('ptwmon/' + p.id + '/' + i)}</td></tr>`; }).join('')}
            </tbody></table></div>` : ''}
            <p class="xs muted">${T('모니터링 기록은 현장에 보관하고 주기적인 작업허가 감사 때 검토합니다. 해결할 수 없는 부적합은 즉시 경영진에게 보고합니다(C-C-49 8(3)·(6)).', 'Keep monitoring records at the site and review them in the periodic permit audit. Report any non-conformity that cannot be resolved to management at once (C-C-49 8(3), (6)).')}${S.cite('koshaCC49')}</p>`;
        })()}
        <!--steps-end-->
      </section>

      <section class="panel stack" id="anchor-audit">
        ${(() => {
          const au = audit(), keys = audKeys(), at = tally(au.a, keys), total = keys.length;
          return `${ui.title(T('작업허가 절차 평가', 'Permit-system audit'), T(`별지 양식4 · ${total}문항`, `Form 4 · ${total} questions`))}
          <p class="small">${T('새 작업허가 절차를 도입하거나 기존 절차를 감사할 때 씁니다. PSM 자체감사의 ‘작업허가’ 분야에 포함할 수 있고, 감사는 가급적 현장을 잘 아는 타 부서 인원이 정기적으로 하며, 경영진과 함께 최소 3년마다 절차 전반을 검토합니다(C-C-49 8(4)·(5)·(7)).', 'Use it when introducing a permit system or auditing the existing one. It can form the “permit to work” part of the PSM self-audit; audits are ideally done regularly by people from another department who know the site, and the whole system is reviewed with management at least every three years (C-C-49 8(4), (5), (7)).')}${S.cite('koshaCC49')}</p>
          <div class="form-grid">
            <div class="field"><label for="aud-date">${T('평가일', 'Date')}</label><input type="date" id="aud-date" value="${esc(au.date || '')}"></div>
            <div class="field"><label for="aud-by">${T('평가자 (소속·성명)', 'Auditor (team, name)')}</label><input type="text" id="aud-by" value="${esc(au.by || '')}"></div>
            <div class="field"><label for="aud-note">${T('주요 개선 사항', 'Main improvements')}</label><input type="text" id="aud-note" value="${esc(au.note || '')}"></div>
          </div>
          <div class="row"><span class="small">${T(`응답 ${total - at.blank}/${total} · 예 ${at.y} · 아니오 ${at.n} · 해당없음 ${at.na}`, `Answered ${total - at.blank}/${total} · yes ${at.y} · no ${at.n} · n/a ${at.na}`)}</span>
            ${S.printLink('ptwaudit', T('평가표 인쇄', 'Print audit'))} <button class="btn ghost sm" type="button" id="aud-reset">${T('응답 지우기', 'Clear answers')}</button></div>
          ${S.PTW_AUDIT.map((g) => { const gt = tally(au.a, g.q.map(([n]) => 'q' + n));
            return `<details class="ptw-grp"><summary><b>${esc(L(g.t))}</b> <span class="xs muted">${g.q.length - gt.blank}/${g.q.length}${gt.n ? ` · ${T('아니오', 'No')} ${gt.n}` : ''}</span></summary>
            <div class="table-wrap" style="margin-top:8px"><table class="data"><tbody>${g.q.map(([n, q]) => `<tr><td class="n">${n}</td><td class="small">${esc(L(q))}</td><td class="nowrap"><select data-aud="q${n}" aria-label="${T('응답', 'Answer')} ${n}"><option value=""></option>${ANS().map(([v, l]) => `<option value="${v}" ${au.a['q' + n] === v ? 'selected' : ''}>${l}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div></details>`; }).join('')}`;
        })()}
      </section>`;
      return S.stepify(page, 'ptw', stepItems());
    },

    mount(root, sub) {
      const parts = String(sub || '').split('/');
      const go = (id) => { S.save('ptw.cur', id); location.hash = '#ptw/' + id; };
      const put = (p) => { const l = list(); const i = l.findIndex((x) => x.id === p.id); if (i >= 0) l[i] = p; else l.unshift(p); S.save('ptw.list', l); S.save('ptw.cur', p.id); };
      if (parts[0] === 'new') {
        const p = newPermit({ sop: parts[1] });
        put(p);
        setTimeout(() => { history.replaceState(null, '', '#ptw/' + p.id); S.render(); window.scrollTo(0, 0); }, 0);
        return;
      }
      const cid = (parts[0] !== 'audit' && parts[0]) || S.load('ptw.cur', null);
      const all = list();
      const p = (cid && find(cid)) || all[0] || example();
      const q = (s) => root.querySelector(s);
      q('#ptw-new').addEventListener('click', () => { const n = newPermit(); put(n); go(n.id); });
      const fromEx = q('#ptw-from-ex'); if (fromEx) fromEx.addEventListener('click', () => {
        const e = example(), n = newPermit({ copy: e });
        n.pre = Object.assign({}, e.pre); n.checks = Object.assign({}, e.checks); n.gas = e.gas.map((r) => Object.assign({}, r)); n.fw = e.fw;
        n.roles = Object.keys(e.roles).reduce((a, k) => (a[k] = L(e.roles[k]), a), {});
        put(n); go(n.id);
      });
      const dup = q('#ptw-dup'); if (dup) dup.addEventListener('click', () => { const n = newPermit({ copy: p }); put(n); go(n.id); S.toast(T('복제했습니다 — 확인 항목과 측정값은 새로 확인하세요', 'Duplicated — re-check the items and re-test')); });
      root.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
        if (!window.confirm(T('이 허가서를 삭제할까요? 되돌릴 수 없습니다.', 'Delete this permit? This cannot be undone.'))) return;
        S.save('ptw.list', list().filter((x) => x.id !== b.dataset.del)); S.drop('ptw.cur'); location.hash = '#ptw';
      }));
      /* 절차 평가(별지4) — 사업장 단위, 허가서 상태와 무관 */
      const saveAud = (fn) => { const a = audit(); fn(a); S.save('ptw.audit', a); S.refresh(); };
      root.querySelectorAll('[data-aud]').forEach((el) => el.addEventListener('change', () => saveAud((a) => { a.a = Object.assign({}, a.a, { [el.dataset.aud]: el.value }); })));
      [['#aud-date', 'date'], ['#aud-by', 'by'], ['#aud-note', 'note']].forEach(([sel, k]) => { const el = q(sel); if (el) el.addEventListener('change', () => saveAud((a) => { a[k] = el.value; })); });
      const ar = q('#aud-reset'); if (ar) ar.addEventListener('click', () => { if (window.confirm(T('절차 평가 응답을 모두 지울까요?', 'Clear all audit answers?'))) { S.drop('ptw.audit'); S.refresh(); } });
      if (p.ex || p.status === 'closed' || p.status === 'cancelled') return;
      const save = (fn) => { const cur = find(p.id); if (!cur) return; fn(cur); put(cur); S.refresh(); };
      root.querySelectorAll('[data-f]').forEach((el) => el.addEventListener('change', () => save((c) => { c[el.dataset.f] = el.value; })));
      root.querySelectorAll('[data-main]').forEach((el) => el.addEventListener('change', () => save((c) => { c.main = el.dataset.main; })));
      root.querySelectorAll('[data-supp]').forEach((el) => el.addEventListener('change', () => save((c) => { const s = new Set(c.supp || []); el.checked ? s.add(el.dataset.supp) : s.delete(el.dataset.supp); c.supp = Object.keys(S.PTW_SUPP).filter((k) => s.has(k)); })));
      root.querySelectorAll('[data-pre]').forEach((el) => el.addEventListener('change', () => save((c) => { c.pre = Object.assign({}, c.pre, { [el.dataset.pre]: el.checked }); })));
      root.querySelectorAll('[data-ck]').forEach((el) => el.addEventListener('change', () => save((c) => { c.checks = Object.assign({}, c.checks, { [el.dataset.ck]: el.checked }); })));
      root.querySelectorAll('[data-role]').forEach((el) => el.addEventListener('change', () => save((c) => { c.roles = Object.assign({}, c.roles, { [el.dataset.role]: el.value }); })));
      const fw = q('#ptw-fw'); if (fw) fw.addEventListener('change', () => save((c) => { c.fw = fw.checked; }));
      root.querySelectorAll('[data-gas]').forEach((el) => el.addEventListener('change', () => save((c) => { c.gas[Number(el.dataset.gas)][el.dataset.k] = el.value; })));
      root.querySelectorAll('[data-gas-del]').forEach((b) => b.addEventListener('click', () => save((c) => { c.gas.splice(Number(b.dataset.gasDel), 1); })));
      const ga = q('#gas-add'); if (ga) ga.addEventListener('click', () => save((c) => { c.gas = (c.gas || []).concat([{ id: 'o2', v: '', time: nowTime(), by: '' }]); }));
      const gs = q('#gas-set'); if (gs) gs.addEventListener('click', () => save((c) => { const have = new Set((c.gas || []).map((r) => r.id)); c.gas = (c.gas || []).concat(S.PTW_GAS.filter((g) => !have.has(g.id)).map((g) => ({ id: g.id, v: '', time: nowTime(), by: '' }))); }));
      /* 모니터링(별지3) — 발급·작업 중에만 */
      root.querySelectorAll('[data-mon]').forEach((el) => el.addEventListener('change', () => save((c) => { const d = c.monDraft || {}; d.a = Object.assign({}, d.a, { [el.dataset.mon]: el.value }); c.monDraft = d; })));
      [['#mon-by', 'by'], ['#mon-lead', 'lead'], ['#mon-note', 'note']].forEach(([sel, k]) => { const el = q(sel); if (el) el.addEventListener('change', () => save((c) => { c.monDraft = Object.assign({}, c.monDraft, { [k]: el.value }); })); });
      const ms = q('#mon-save'); if (ms) ms.addEventListener('click', () => {
        const cur = find(p.id), d = (cur && cur.monDraft) || {}, t2 = tally(d.a, monKeys());
        if (t2.blank) { S.toast(T(`응답하지 않은 항목이 ${t2.blank}개 있습니다`, `${t2.blank} questions are unanswered`)); return; }
        if (!String(d.by || '').trim()) { S.toast(T('검토자를 적으세요', 'Enter the reviewer')); return; }
        save((c) => { c.mon = (c.mon || []).concat([{ at: stamp(), by: d.by, lead: d.lead || '', note: d.note || '', a: Object.assign({}, d.a) }]); c.monDraft = {}; });
        S.toast(t2.n ? T('저장했습니다 — ‘아니오’ 항목은 작업 중지·통보 여부를 판단하세요', 'Saved — decide on stopping the work for any “No”') : T('모니터링 기록을 저장했습니다', 'Monitoring record saved'));
      });
      const rs = q('#ptw-restored'); if (rs) rs.addEventListener('change', () => save((c) => { c.restored = rs.checked; }));
      const cn = q('#pf-closeNote'); if (cn) cn.addEventListener('change', () => save((c) => { c.closeNote = cn.value; }));
      const ex = q('#ptw-ext'); if (ex) ex.addEventListener('click', () => {
        const v = q('#pf-extTo').value;
        if (!v || v <= (p.extTo || p.to)) { S.toast(T('기존 종료 시각보다 늦은 시각을 넣으세요', 'Enter a time after the current end')); return; }
        save((c) => { c.extTo = v; c.log = (c.log || []).concat([{ at: stamp(), st: c.status, note: T(`연장 ${c.to} → ${v}`, `extended ${c.to} → ${v}`) }]); });
      });
      root.querySelectorAll('[data-st]').forEach((b) => b.addEventListener('click', () => {
        const st = b.dataset.st;
        if (st === 'cancelled' && !window.confirm(T('이 허가서를 취소할까요?', 'Cancel this permit?'))) return;
        if (st === 'issued' && blockers(find(p.id)).length) return;
        save((c) => { c.status = st; c.log = (c.log || []).concat([{ at: stamp(), st }]); if (st === 'closed') c.closedAt = stamp(); });
        S.toast({ issued: T('발급했습니다 — 인쇄해 현장에 게시하세요', 'Issued — print it and post it at the job'), active: T('작업 시작을 기록했습니다', 'Work start recorded'), closed: retention(p) === 3 ? T('종료했습니다 — 밀폐공간 허가서는 3년 보관 권고(C-C-49)', 'Closed — C-C-49 advises keeping confined-space permits for three years') : T('종료했습니다 — 1년간 보관', 'Closed — keep for one year'), cancelled: T('취소했습니다', 'Cancelled') }[st]);
      }));
    }
  };
})();

/* 교육 이수 관리 — 산안법 시행규칙 제26·27조·별표4, 화학물질관리법 시행규칙 제37조·별표6의3 기준으로 사람별 부족 시간을 계산
   입력한 이름·기록은 이 브라우저에만 저장된다 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui, esc = S.esc;
  const num = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));
  const d0 = (s) => { const d = new Date(s + 'T00:00:00'); return isNaN(d) ? null : d; };
  const OPT = { noAcc: false, ccaCount: true, ccaAll: true };

  const EX_PEOPLE = [
    { id: 'e1', name: B2('작업자 A', 'Worker A'), org: B2('설비팀', 'Facilities'), kind: 'field', hire: '2026-03-02', special: [34], first: '2026-09-01', cca: true },
    { id: 'e2', name: B2('관리감독자 B', 'Supervisor B'), org: B2('가스운영팀', 'Gas operations'), kind: 'sup', hire: '2019-01-02', special: [], cca: true },
    { id: 'e3', name: B2('협력사 작업자 C', 'Contractor worker C'), org: B2('협력사 A', 'Contractor A'), kind: 'field', hire: '2026-09-15', special: [38], first: '2026-09-22' }
  ];
  const EX_RECS = [
    { id: 'r1', pid: 'e1', date: '2026-03-02', course: 'hire', hours: 8 }, { id: 'r2', pid: 'e1', date: '2026-08-20', course: 'special', hours: 4, no: 34 },
    { id: 'r3', pid: 'e1', date: '2026-09-10', course: 'special', hours: 6, no: 34 }, { id: 'r4', pid: 'e1', date: '2026-07-15', course: 'periodic', hours: 6 },
    { id: 'r5', pid: 'e1', date: '2026-08-05', course: 'cca', hours: 2 }, { id: 'r6', pid: 'e2', date: '2026-04-10', course: 'periodic', hours: 8 },
    { id: 'r7', pid: 'e2', date: '2026-08-05', course: 'cca', hours: 2 }, { id: 'r8', pid: 'e3', date: '2026-09-15', course: 'hire', hours: 8 },
    { id: 'r9', pid: 'e3', date: '2026-09-19', course: 'special', hours: 4, no: 38 }, { id: 'r10', pid: 'e2', date: '2019-01-02', course: 'hire', hours: 8 }
  ];
  function B2(ko, en) { return { ko, en }; }

  const data = () => {
    const ppl = S.load('trn.people', null), recs = S.load('trn.recs', null);
    return ppl ? { ex: false, people: ppl, recs: recs || [] } : { ex: true, people: EX_PEOPLE, recs: EX_RECS };
  };
  const kindL = (k) => L((S.TRN_KINDS.find(([v]) => v === k) || [, B2(k, k)])[1]);
  const courseL = (k) => L((S.TRN_COURSES.find(([v]) => v === k) || [, B2(k, k)])[1]);

  /* requirement rows for one person as of a reference date */
  function assess(p, recs, ref, opt) {
    const mine = recs.filter((r) => r.pid === p.id);
    const sum = (f) => mine.filter(f).reduce((a, r) => a + (num(r.hours) || 0), 0);
    const y = ref.getFullYear(), half = ref.getMonth() < 6 ? 0 : 1;
    const hs = new Date(y, half * 6, 1), he = new Date(y, half * 6 + 6, 0);
    const ys = new Date(y, 0, 1), ye = new Date(y, 11, 31);
    const inR = (r, a, b) => { const d = d0(r.date); return d && d >= a && d <= b; };
    const rows = [];
    /* 1. 정기교육 — 별표4 제1호가목·제1호의2가목 */
    if (p.kind === 'office' || p.kind === 'field' || p.kind === 'sup') {
      const base = p.kind === 'office' ? 6 : p.kind === 'field' ? 12 : 16;
      const need = opt.noAcc ? base / 2 : base;
      const [a, b] = p.kind === 'sup' ? [ys, ye] : [hs, he];
      const done = sum((r) => r.course === 'periodic' && inR(r, a, b)) + (opt.ccaCount ? sum((r) => r.course === 'cca' && inR(r, a, b)) : 0);
      rows.push({ k: 'periodic', t: T(p.kind === 'sup' ? `관리감독자 정기교육 (${y}년)` : `정기교육 (${y}년 ${half ? '하' : '상'}반기)`, p.kind === 'sup' ? `Supervisor periodic (${y})` : `Periodic (${y} H${half + 1})`), need, done,
        note: (opt.noAcc ? T('전년도 무재해 50% 면제 적용 · ', '50 % no-accident exemption applied · ') : '') + (opt.ccaCount ? T('화관법 안전교육 시간 포함', 'incl. chemical-safety hours') : ''), b: p.kind === 'sup' ? T('별표4 제1호의2가목', 'Annex 4, 1-2(a)') : T('별표4 제1호가목', 'Annex 4, 1(a)'), soft: true });
    }
    /* 2. 채용 시 교육 — 특별교육을 받았으면 한 것으로 봄 (제26조①) */
    if (p.hire) {
      const need = p.kind === 'day' ? 1 : p.kind === 'month' ? 4 : 8;
      const sp = sum((r) => r.course === 'special');
      const done = sum((r) => r.course === 'hire');
      rows.push({ k: 'hire', t: T('채용 시 교육', 'On hiring'), need, done: Math.max(done, (p.special || []).length && sp >= need ? sp : 0), note: sp && !done ? T('특별교육으로 갈음 (제26조①)', 'covered by special training (Art. 26(1))') : '', b: T('별표4 제1호나목', 'Annex 4, 1(b)') });
    }
    /* 3. 특별교육 — 별표4 제1호라목 */
    if ((p.special || []).length) {
      const done = sum((r) => r.course === 'special');
      const first = d0(p.first || '');
      if (p.kind === 'day' || p.short) {
        const need = p.kind === 'day' && (p.special || []).includes(39) ? 8 : 2;
        rows.push({ k: 'special', t: T('특별교육', 'Special training'), need, done, note: p.short ? T('단기간·간헐적 작업', 'short-term or intermittent work') : T('일용·1주 이하 기간제', 'day / ≤ 1 week'), b: T('별표4 제1호라목', 'Annex 4, 1(d)') });
      } else {
        const before = first ? sum((r) => r.course === 'special' && d0(r.date) && d0(r.date) <= first) : 0;
        const due = first ? S.addDays(first, 92) : null;
        const pastDue = due && ref > due;
        rows.push({ k: 'special4', t: T('특별교육 — 최초 작업 전 4시간', 'Special — 4 h before first task'), need: 4, done: before, note: first ? T(`최초 작업일 ${p.first}`, `first task ${p.first}`) : T('최초 작업일을 입력하세요', 'enter the first-task date'), b: T('별표4 제1호라목3)가)', 'Annex 4, 1(d)3)a)'), pending: !first });
        rows.push({ k: 'special16', t: T('특별교육 — 합계 16시간 (나머지 12시간은 3개월 이내)', 'Special — 16 h in total (12 h within 3 months)'), need: 16, done, note: due ? T(`기한 ${S.iso(due)}`, `due ${S.iso(due)}`) : '', b: T('별표4 제1호라목3)가)', 'Annex 4, 1(d)3)a)'), soft: !pastDue });
      }
    }
    /* 4. 화학물질관리법 유해화학물질 안전교육 — 시행규칙 제37조①④·별표6의3 */
    if (opt.ccaAll) rows.push({ k: 'ccaAll', t: T(`유해화학물질 안전교육 — 전 종사자 (${y}년)`, `Chemical safety — all workers (${y})`), need: 2, done: sum((r) => r.course === 'cca' && inR(r, ys, ye)), b: T('화관법 시행규칙 제37조④', 'Chemicals Rule 37(4)'), soft: true });
    if (p.cca) rows.push({ k: 'cca2', t: T('유해화학물질 안전교육 — 취급 담당자 등 (최근 2년)', 'Chemical safety — handlers etc. (last 2 years)'), need: 16, done: sum((r) => r.course === 'cca' && inR(r, S.addDays(ref, -730), ref)), b: T('화관법 시행규칙 제37조①·별표6의3', 'Chemicals Rule 37(1), Annex 6-3'), soft: !(p.hire && d0(p.hire) && d0(p.hire) < S.addDays(ref, -730)) });
    rows.forEach((r) => { r.short = Math.max(0, r.need - r.done); r.level = r.pending ? 'info' : r.short <= 0 ? 'ok' : r.soft ? 'warn' : 'bad'; });
    return rows;
  }
  S.trnApi = { data, assess, OPT, kindL, courseL };

  S.pages.training = {
    render() {
      const dt = data(), opt = Object.assign({}, OPT, S.load('trn.opt', {}));
      const refS = S.load('trn.ref', null) || S.iso(S.today()), ref = d0(refS) || S.today();
      const res = dt.people.map((p) => ({ p, rows: assess(p, dt.recs, ref, opt) }));
      const short = res.filter((x) => x.rows.some((r) => r.level === 'bad'));
      const warn = res.filter((x) => !x.rows.some((r) => r.level === 'bad') && x.rows.some((r) => r.level === 'warn'));
      const per = res.map((x) => x.rows.find((r) => r.k === 'periodic')).filter(Boolean);
      const perOk = per.filter((r) => r.level === 'ok').length;
      const SP = Object.keys(S.SPECIAL_EDU).map(Number);
      return `
      ${ui.head(T('업무', 'Workspace'), T('교육 이수 관리', 'Training records'),
        T('사람별 교육 이수 시간과 부족분을 법정 기준으로 계산합니다.', 'Each person’s training hours and shortfall, measured against the legal minimums.'),
        T('교육 대상자와 교육 기록을 넣으면 산업안전보건법 시행규칙 별표4(정기·채용 시·특별교육)와 화학물질관리법 유해화학물질 안전교육 기준 대비 이수 시간과 부족분을 사람별로 계산합니다. 특별교육은 최초 작업 전 4시간·3개월 이내 16시간을 따로 확인합니다.',
          'Enter people and training records; the tool compares hours with OSH Rule Annex 4 (periodic, hiring, special training) and the Chemicals Control Act safety training, person by person. Special training is checked for 4 h before the first task and 16 h within three months.'))}
      <section class="grid g4">
        <div class="kpi"><span class="k">${T('대상자', 'People')}</span><span class="v">${dt.people.length}</span></div>
        <div class="kpi"><span class="k">${T('부족 (기한 지남)', 'Short (overdue)')}</span><span class="v" style="color:var(--bad)">${short.length}</span></div>
        <div class="kpi"><span class="k">${T('진행 중 (기한 전)', 'In progress (not yet due)')}</span><span class="v">${warn.length}</span></div>
        <div class="kpi"><span class="k">${T('정기교육 충족률', 'Periodic training met')}</span><span class="v">${per.length ? S.fmt(perOk / per.length * 100, 0) + '%' : '–'}</span></div>
      </section>
      <section class="panel stack" id="anchor-status">${ui.title(T('사람별 이수 현황', 'Status by person'), dt.ex ? ui.ex() : '')}
        <div class="row">
          <div class="field" style="max-width:180px"><label for="tr-ref">${T('기준일', 'As of')}</label><input type="date" id="tr-ref" value="${esc(refS)}"></div>
          <label class="check"><input type="checkbox" data-opt="noAcc" ${opt.noAcc ? 'checked' : ''}> ${T('전년도 산업재해 없음 — 정기교육 50% 면제 적용 (제27조①)', 'No accident last year — 50 % off periodic training (Art. 27(1))')}</label>
          <label class="check"><input type="checkbox" data-opt="ccaCount" ${opt.ccaCount ? 'checked' : ''}> ${T('유해화학물질 안전교육 시간을 정기교육에서 면제 (제27조③1)', 'Count chemical-safety hours toward periodic training (Art. 27(3)1)')}</label>
          <label class="check"><input type="checkbox" data-opt="ccaAll" ${opt.ccaAll ? 'checked' : ''}> ${T('유해화학물질 취급 사업장 — 전 종사자 연 2시간', 'Hazardous-chemical site — 2 h a year for everyone')}</label>
        </div>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('성명·소속', 'Name / team')}</th><th>${T('구분', 'Type')}</th><th>${T('교육 과정', 'Course')}</th><th class="n">${T('이수/기준 (시간)', 'Done / required (h)')}</th><th>${T('판정', 'Result')}</th></tr></thead><tbody>
          ${res.map(({ p, rows }) => rows.map((r, i) => `<tr>${i === 0 ? `<td rowspan="${rows.length}"><b>${esc(L(p.name))}</b><br><span class="xs muted">${esc(L(p.org))}</span>${(p.special || []).length ? `<br>${p.special.map((n) => `<span class="chip">${T('특별', 'Spec.')} ${n}</span>`).join(' ')}` : ''}${dt.ex ? '' : `<br><button class="btn danger sm" type="button" data-pdel="${esc(p.id)}">${T('삭제', 'Delete')}</button>`}</td><td rowspan="${rows.length}" class="small">${esc(kindL(p.kind))}${p.hire ? `<br><span class="xs muted">${T('채용', 'hired')} ${esc(p.hire)}</span>` : ''}</td>` : ''}
            <td class="small">${esc(r.t)}<br><span class="xs muted">${esc(r.b)}${r.note ? ' · ' + esc(r.note) : ''}</span></td><td class="n">${S.fmt(r.done, 1)} / ${S.fmt(r.need, 1)}${r.need > 0 ? `<div class="gauge mini" aria-hidden="true"><i style="width:${Math.min(100, r.done / r.need * 100)}%;background:var(--${r.level === 'info' ? 'line-2' : r.level})"></i></div>` : ''}</td>
            <td>${r.level === 'info' ? `<span class="xs muted">${T('정보 부족', 'Need data')}</span>` : ui.pill(r.level, r.level === 'ok' ? T('충족', 'Met') : r.level === 'warn' ? T(`${S.fmt(r.short, 1)}시간 남음`, `${S.fmt(r.short, 1)} h to go`) : T(`${S.fmt(r.short, 1)}시간 부족`, `${S.fmt(r.short, 1)} h short`))}</td></tr>`).join('') || `<tr><td><b>${esc(L(p.name))}</b></td><td class="small">${esc(kindL(p.kind))}</td><td colspan="3" class="small muted">${T('계산할 과정이 없습니다', 'Nothing to check')}</td></tr>`).join('') || `<tr><td colspan="5" class="small muted">${T('대상자를 추가하세요', 'Add people below')}</td></tr>`}
        </tbody></table></div>
        <div class="row">${S.printLink('training', T('이수 현황표 인쇄', 'Print the status sheet'))}<button class="btn ghost sm" type="button" id="tr-csv">${T('교육 기록 CSV', 'Records CSV')}</button></div>
        <p class="xs muted">${T('정기교육은 반기(관리감독자는 연간) 단위로, 화관법 전 종사자 교육은 연 단위로, 취급 담당자 16시간은 기준일 전 2년 동안의 합계로 봅니다. 일용·단기 기간제는 채용 시·특별교육만 계산합니다. 교육 면제는 사업주가 ‘할 수 있는’ 것이므로 사내 기준을 확인하세요.', 'Periodic training counts per half-year (per year for supervisors), all-worker chemical training per year, and the 16 h for handlers over the two years before the reference date. Day and short fixed-term workers are checked for hiring and special training only. Exemptions are optional for the employer — check your in-house rules.')}${S.cite('lawRule', 'lawCcaRule')}</p>
      </section>
      <section class="grid g2">
        <form class="panel stack" id="tr-pform">${ui.title(T('대상자 추가', 'Add a person'))}
          <div class="form-grid">
            <div class="field"><label for="tp-name">${T('성명', 'Name')}</label><input type="text" id="tp-name" required></div>
            <div class="field"><label for="tp-org">${T('소속 (부서·협력사)', 'Team / contractor')}</label><input type="text" id="tp-org"></div>
            <div class="field"><label for="tp-kind">${T('구분', 'Type')}</label><select id="tp-kind">${S.TRN_KINDS.map(([v, l]) => `<option value="${v}" ${v === 'field' ? 'selected' : ''}>${esc(L(l))}</option>`).join('')}</select></div>
            <div class="field"><label for="tp-hire">${T('채용일 (배치일)', 'Hired / assigned')}</label><input type="date" id="tp-hire"></div>
            <div class="field"><label for="tp-first">${T('특별교육 대상 작업 최초 종사일', 'First day on special-training work')}</label><input type="date" id="tp-first"></div>
          </div>
          <fieldset style="border:0;padding:0;margin:0"><legend class="lbl">${T('특별교육 대상 작업 (별표5 제1호라목)', 'Special-training work (Annex 5, 1(d))')}</legend>
            <div class="stack" style="gap:4px">${SP.map((n) => `<label class="check"><input type="checkbox" data-sp="${n}"> <span class="small">${T(`제${n}호`, `No. ${n}`)} ${esc(L(S.SPECIAL_EDU[n]))}</span></label>`).join('')}</div></fieldset>
          <label class="check"><input type="checkbox" id="tp-short"> ${T('단기간·간헐적 작업 (특별교육 2시간)', 'Short-term or intermittent work (2 h special training)')}</label>
          <label class="check"><input type="checkbox" id="tp-cca"> ${T('유해화학물질 취급 담당자·관리자·기술인력 (2년 16시간)', 'Hazardous-chemical handler, manager or technical staff (16 h per 2 years)')}</label>
          <div class="row"><button class="btn" type="submit">${T('추가', 'Add')}</button></div>
        </form>
        <form class="panel stack" id="tr-rform">${ui.title(T('교육 기록 추가', 'Add a training record'))}
          <div class="form-grid">
            <div class="field"><label for="tt-pid">${T('대상자', 'Person')}</label><select id="tt-pid" ${dt.ex ? 'disabled' : ''}>${dt.ex ? `<option>${T('먼저 대상자를 추가하세요', 'Add a person first')}</option>` : dt.people.map((p) => `<option value="${esc(p.id)}">${esc(L(p.name))} · ${esc(L(p.org))}</option>`).join('')}</select></div>
            <div class="field"><label for="tt-date">${T('교육일', 'Date')}</label><input type="date" id="tt-date" value="${S.iso(S.today())}" required></div>
            <div class="field"><label for="tt-course">${T('과정', 'Course')}</label><select id="tt-course">${S.TRN_COURSES.map(([v, l]) => `<option value="${v}">${esc(L(l))}</option>`).join('')}</select></div>
            <div class="field"><label for="tt-hours">${T('시간', 'Hours')}</label><input type="number" id="tt-hours" min="0" step="0.5" required></div>
            <div class="field"><label for="tt-note">${T('비고 (교육명·강사)', 'Note (title, trainer)')}</label><input type="text" id="tt-note"></div>
          </div>
          <div class="row"><button class="btn" type="submit" ${dt.ex ? 'disabled' : ''}>${T('기록 추가', 'Add record')}</button></div>
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('교육일', 'Date')}</th><th>${T('대상자', 'Person')}</th><th>${T('과정', 'Course')}</th><th class="n">${T('시간', 'h')}</th><th></th></tr></thead><tbody>
            ${dt.recs.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 30).map((r) => { const p = dt.people.find((x) => x.id === r.pid); return `<tr><td class="num">${esc(r.date)}</td><td class="small">${esc(p ? L(p.name) : '–')}</td><td class="small">${esc(courseL(r.course))}${r.no ? ` ${T('제', 'No. ')}${esc(r.no)}${T('호', '')}` : ''}${r.note ? `<br><span class="xs muted">${esc(r.note)}</span>` : ''}</td><td class="n">${S.fmt(num(r.hours), 1)}</td><td>${dt.ex ? '' : `<button class="btn danger sm" type="button" data-rdel="${esc(r.id)}" aria-label="${T('삭제', 'Delete')}">×</button>`}</td></tr>`; }).join('') || `<tr><td colspan="5" class="small muted">${T('기록이 없습니다', 'No records')}</td></tr>`}
          </tbody></table></div>
        </form>
      </section>
      <section class="panel">${ui.title(T('알아둘 기준', 'Rules to know'))}
        <ul class="facts">
          <li>${T('특별교육을 실시하면 채용 시 교육·작업내용 변경 시 교육을 한 것으로 봅니다 (시행규칙 제26조①).', 'Special training also counts as hiring and change-of-work training (Rule Art. 26(1)).')}</li>
          <li>${T('원자력안전법 방사선작업종사자 정기교육, 화관법 유해화학물질 안전교육을 받은 시간은 근로자(관리감독자) 정기교육 시간에서 면제할 수 있습니다 (제27조③, 2025.5.30 신설).', 'Hours of radiation-worker periodic training or chemical safety training may be credited against periodic training (Art. 27(3), added 2025-05-30).')}</li>
          <li>${T('같은 업종에 6개월 이상 일한 사람을 이직 후 1년 안에 채용하거나, 같은 특별교육 대상 작업을 6개월 이상 한 사람이 1년 안에 같은 작업을 하면 채용 시·특별교육 시간을 50% 이상으로 할 수 있고, 같은 도급인 사업장에서 같은 업무를 이어 하면 면제할 수 있습니다 (제27조⑤).', 'Hiring or special training may be halved for people with 6+ months in the same industry or the same special-training work who return within a year, and waived when they carry on the same work at the same principal’s site (Art. 27(5)).')}</li>
          <li>${T('일용근로자가 교육받은 날부터 1주일 안에 같은 사업장·업무로 다시 오면 채용 시·특별교육을 면제합니다 (별표4 비고 2).', 'A day labourer returning to the same site and job within a week of training is exempt from hiring and special training (Annex 4, note 2).')}</li>
          <li>${T('중처법 시행령 제5조②3: 유해·위험작업 법정 교육 실시 여부를 반기 1회 이상 점검합니다 — 업무판 법정 주기와 함께 쓰세요.', 'SAPA Decree Art. 5(2)3: check at least half-yearly that statutory training for hazardous work was delivered — use with the dashboard cycles.')}</li>
          <li>${T('시행 예정 — 2027.1.8부터 고용허가제 외국인근로자 등을 채용하면 공단 또는 지정 교육기관의 ‘외국인근로자 기초안전보건교육’을 이수하게 해야 합니다(법 제31조의2, 법률 제21853호). 채용 전 이수했거나 외국인 취업교육 등을 받은 경우 전부·일부 면제될 수 있고, 시간·내용은 시행규칙으로 정해질 예정이라 이 도구의 계산에는 아직 넣지 않았습니다.', 'Coming — from 2027-01-08, foreign workers hired under the employment-permit system and similar visas must complete basic safety training from KOSHA or a designated body (Act Art. 31-2, Act No. 21853). Training done before hiring or the foreign-worker employment course may count in full or part; hours and content will be set by the Rule, so this tool does not calculate it yet.')}</li>
        </ul>
        <p class="xs muted" style="margin-top:6px">${S.cite('lawRule', 'lawCcaRule', 'lawSapa', 'lawActNext')} · ${T('대상자 이름 등 개인정보는 이 브라우저에만 저장됩니다. 백업 파일을 공유 폴더에 두지 마세요.', 'Names stay in this browser only; do not leave backup files in shared folders.')} <a href="#culture/special">${T('별표4·5 교육시간 표 보기 →', 'See the Annex 4 and 5 tables →')}</a></p>
      </section>`;
    },
    mount(root) {
      const q = (s) => root.querySelector(s);
      const opt = Object.assign({}, OPT, S.load('trn.opt', {}));
      const real = () => ({ people: S.load('trn.people', null) || [], recs: S.load('trn.recs', null) || [] });
      q('#tr-ref').addEventListener('change', (e) => { if (e.target.value) S.save('trn.ref', e.target.value); else S.drop('trn.ref'); S.refresh(); });
      root.querySelectorAll('[data-opt]').forEach((c) => c.addEventListener('change', () => { opt[c.dataset.opt] = c.checked; S.save('trn.opt', opt); S.refresh(); }));
      q('#tr-pform').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = q('#tp-name').value.trim(); if (!name) return;
        const d = real();
        d.people.push({ id: 'u' + Date.now(), name, org: q('#tp-org').value.trim(), kind: q('#tp-kind').value, hire: q('#tp-hire').value, first: q('#tp-first').value,
          special: [...root.querySelectorAll('[data-sp]:checked')].map((x) => Number(x.dataset.sp)), short: q('#tp-short').checked, cca: q('#tp-cca').checked });
        S.save('trn.people', d.people); if (!S.load('trn.recs', null)) S.save('trn.recs', []);
        S.toast(T('대상자를 추가했습니다', 'Person added')); S.refresh();
      });
      q('#tr-rform').addEventListener('submit', (e) => {
        e.preventDefault();
        const d = real(); const pid = q('#tt-pid').value; const h = num(q('#tt-hours').value);
        if (!d.people.some((p) => p.id === pid) || h == null) return;
        d.recs.push({ id: 'r' + Date.now(), pid, date: q('#tt-date').value, course: q('#tt-course').value, hours: h, note: q('#tt-note').value.trim() });
        S.save('trn.recs', d.recs); S.toast(T('교육 기록을 추가했습니다', 'Record added')); S.refresh();
      });
      root.querySelectorAll('[data-pdel]').forEach((b) => b.addEventListener('click', () => {
        if (!window.confirm(T('이 대상자와 교육 기록을 삭제할까요?', 'Delete this person and their records?'))) return;
        const d = real(); S.save('trn.people', d.people.filter((p) => p.id !== b.dataset.pdel)); S.save('trn.recs', d.recs.filter((r) => r.pid !== b.dataset.pdel)); S.refresh();
      }));
      root.querySelectorAll('[data-rdel]').forEach((b) => b.addEventListener('click', () => { const d = real(); S.save('trn.recs', d.recs.filter((r) => r.id !== b.dataset.rdel)); S.refresh(); }));
      q('#tr-csv').addEventListener('click', () => {
        const d = data();
        S.csv([[T('교육일', 'Date'), T('성명', 'Name'), T('소속', 'Team'), T('구분', 'Type'), T('과정', 'Course'), T('시간', 'Hours'), T('비고', 'Note')]].concat(d.recs.map((r) => { const p = d.people.find((x) => x.id === r.pid) || {}; return [r.date, L(p.name), L(p.org), kindL(p.kind), courseL(r.course) + (r.no ? ' ' + r.no : ''), r.hours, r.note || '']; })), 'SHE-training-' + S.iso(S.today()) + '.csv');
      });
    }
  };
})();

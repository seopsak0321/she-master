/* 인쇄 미리보기 — #print/<문서>/<id>. 화면에서 확인한 뒤 브라우저 인쇄(또는 PDF로 저장)로 내보낸다.
   모든 양식은 교육·포트폴리오용이며 SK하이닉스 사내 공식 양식이 아니다. */
(function () {
  const S = window.SHE, T = S.T, L = S.L, esc = S.esc;
  /* text in a given language (used for the bilingual card) */
  const Lx = (o, lang) => (o == null ? '' : typeof o === 'string' || Array.isArray(o) ? o : (o[lang] == null ? o.ko : o[lang]));
  const today = () => S.iso(S.today());
  const siteName = (id) => L((S.SITES[id || S.state.site] || S.SITES.common).name);
  const basisText = S.basisText;
  const box = '☐';

  const approvals = (labels) => `<table class="doc-approve" aria-label="${esc(T('결재', 'Sign-off'))}"><tr>${labels.map((l) => `<th>${esc(l)}</th>`).join('')}</tr><tr>${labels.map(() => '<td></td>').join('')}</tr></table>`;
  const APPROVE = () => [T('작성', 'Prepared'), T('검토', 'Reviewed'), T('승인', 'Approved')];
  const pairs = (meta) => {
    const rows = [];
    for (let i = 0; i < meta.length; i += 2) {
      const cell = (p) => (p ? `<th>${esc(p[0])}</th><td class="${p[1] ? '' : 'blank'}">${esc(p[1] || '')}</td>` : '<th></th><td></td>');
      rows.push(`<tr>${cell(meta[i])}${cell(meta[i + 1])}</tr>`);
    }
    return rows.join('');
  };
  function head(o) {
    return `<header class="doc-head"><div class="doc-hl"><div class="doc-brand"><span class="brand-mark" aria-hidden="true"><i></i><i></i></span>SHE Master · ${esc(o.kind)}</div>
      <h1>${esc(o.title)}</h1>${o.sub ? `<p class="doc-sub">${esc(o.sub)}</p>` : ''}</div>
      ${o.approve ? approvals(Array.isArray(o.approve) ? o.approve : APPROVE()) : ''}</header>
      ${o.meta && o.meta.length ? `<table class="doc-meta"><tbody>${pairs(o.meta)}</tbody></table>` : ''}
      ${o.example ? `<p class="doc-note">${esc(T('※ 표시된 값에는 포털의 예시(가상) 데이터가 포함되어 있습니다.', '※ Some values shown are portal example (fictional) data.'))}</p>` : ''}`;
  }
  const sec = (title, body, cls) => `<section class="doc-sec ${cls || ''}"><h2>${esc(title)}</h2>${body}</section>`;
  const ul = (arr) => `<ul>${(arr || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const blankRows = (cols, n, numbered) => `<table class="doc-table"><thead><tr>${numbered ? '<th class="n">No.</th>' : ''}${cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>
    ${Array.from({ length: n }, (_, i) => `<tr class="write">${numbered ? `<td class="n">${i + 1}</td>` : ''}${cols.map(() => '<td></td>').join('')}</tr>`).join('')}</tbody></table>`;
  function foot(srcIds, note) {
    const srcs = [...new Set([].concat(srcIds || []))].map((id) => S.SOURCES.find((s) => s.id === id)).filter(Boolean);
    return `<footer class="doc-foot">${note ? `<p>${esc(note)}</p>` : ''}
      <p>${esc(T('교육·포트폴리오용 양식입니다. SK하이닉스 사내 공식 양식이 아니며, 실제로 쓰기 전에 사내 기준과 최신 법령을 확인하세요.', 'A teaching and portfolio template, not an official SK hynix form. Check in-house rules and current law before real use.'))}</p>
      ${srcs.length ? `<p class="doc-src">${esc(T('근거', 'Basis'))}: ${srcs.map((s) => esc(L(s.title).split(' — ')[0])).join(' / ')}</p>` : ''}
      <p class="doc-stamp">SHE Master · ${esc(T('출력일', 'Printed'))} ${today()} · © 2026 ${esc(L(S.AUTHOR))}</p></footer>`;
  }
  const notFound = () => `<p>${esc(T('인쇄할 문서를 찾지 못했습니다. 원래 화면에서 다시 열어 주세요.', 'The document was not found. Open it again from its page.'))}</p>`;

  /* ---------- documents ---------- */
  const DOCS = {
    card(id, opt) {
      const s = S.SOPS.find((x) => x.id === id); if (!s) return notFound();
      const one = (lang) => `<div class="doc-card">
        <div class="doc-card-top"><span>${esc(Lx({ ko: '작업 전 5분 안전카드', en: '5-minute pre-job card' }, lang))}</span><span>${esc(Lx({ ko: '협력사·현장용', en: 'For contractors & field crews' }, lang))}</span></div>
        <h2>${esc(Lx(s.t, lang))}</h2><p class="doc-sub">${esc(Lx(s.area, lang))}</p>
        <div class="doc-card-cols"><div class="do"><h3>✓ ${esc(Lx({ ko: '이렇게 하세요', en: 'Do' }, lang))}</h3>${ul(Lx(s.card.do, lang))}</div>
          <div class="dont"><h3>✕ ${esc(Lx({ ko: '절대 하지 마세요', en: 'Never' }, lang))}</h3>${ul(Lx(s.card.dont, lang))}</div></div>
        <div class="doc-card-cols"><div><h3>${esc(Lx({ ko: '이럴 땐 작업을 멈춘다', en: 'Stop work if' }, lang))}</h3>${ul(Lx(s.stop, lang))}</div>
          <div><h3>${esc(Lx({ ko: '비상 시', en: 'In an emergency' }, lang))}</h3>${ul(Lx(s.emer, lang))}</div></div>
        <p class="doc-card-foot"><b>${esc(Lx({ ko: '이상하면 멈추고 알리세요.', en: 'If something seems wrong, stop and tell someone.' }, lang))}</b> · SHE Master</p></div>`;
      return (opt === 'both' ? one('ko') + '<div class="doc-cut" aria-hidden="true"></div>' + one('en') : one(S.state.lang)) + foot(s.src);
    },

    sop(id) {
      const s = S.SOPS.find((x) => x.id === id); if (!s) return notFound();
      return head({ kind: 'SOP', title: L(s.t), sub: L(s.area), approve: true,
        meta: [[T('위험 등급', 'Risk level'), s.level === 'A' ? T('고위험', 'High') : T('중위험', 'Medium')], [T('작업허가 유형', 'Permits'), s.permits.map((p) => L(S.PERMITS[p])).join(', ')], [T('사업장', 'Site'), siteName()], [T('개정일', 'Revised'), '']] })
        + sec(T('주요 유해·위험요인', 'Key hazards'), ul(L(s.hz)))
        + sec(T('법령·지침 근거', 'Legal and guidance basis'), ul(s.legal.map(L)) + `<p class="doc-small">KOSHA GUIDE: ${esc(s.kosha.map((k) => `${k} ${L(S.KOSHA[k] || '')}`).join(' · '))}</p>`)
        + sec(T('단계별 절차 (JSA)', 'Step-by-step (JSA)'), `<table class="doc-table"><thead><tr><th class="n">#</th><th>${esc(T('단계', 'Step'))}</th><th>${esc(T('위험', 'Hazard'))}</th><th>${esc(T('대책', 'Control'))}</th><th>${esc(T('근거', 'Basis'))}</th></tr></thead><tbody>
          ${s.steps.map((st, i) => `<tr><td class="n">${i + 1}</td><td><b>${esc(L(st.s))}</b></td><td>${esc(L(st.h))}</td><td>${esc(L(st.c))}</td><td class="doc-small">${esc(basisText(st.b))}</td></tr>`).join('')}</tbody></table>`)
        + `<div class="doc-two">${sec(T('작업 중지 기준', 'Stop work if'), ul(L(s.stop)))}${sec(T('비상 시 행동', 'In an emergency'), ul(L(s.emer)))}</div>`
        + ((s.edu || []).length ? sec(T('관련될 수 있는 특별교육 (산안법 시행규칙 별표5)', 'Special training that may apply (OSH Rule Annex 5)'), ul(s.edu.map((no) => T(`제${no}호 `, `No. ${no} `) + L(S.SPECIAL_EDU[no])))) : '')
        + sec(T('교육 확인', 'Training record'), `<table class="doc-meta"><tbody>${pairs([[T('교육 일시', 'Date'), ''], [T('교육자', 'Trainer'), ''], [T('장소', 'Place'), ''], [T('교육 시간', 'Hours'), '']])}</tbody></table>`
          + blankRows([T('성명', 'Name'), T('소속', 'Company / team'), T('서명', 'Signature')], 10, true), 'keep')
        + foot(s.src.concat(['lawRule']));
    },

    tbm() {
      const s = S.PREV.tbmSop();
      const checks = [T('작업허가·절차서 확인', 'Permit and procedure read'), T('보호구 착용 상호 확인', 'PPE checked by a partner'), T('비상 연락·대피로 공유', 'Emergency contact and exit shared')].concat(L(s.card.do));
      return head({ kind: 'TBM', title: T('작업 전 안전점검회의(TBM) 기록', 'Pre-job toolbox meeting (TBM) record'), approve: [T('작업책임자', 'Job lead'), T('관리감독자', 'Supervisor')],
        meta: [[T('일시', 'Date & time'), ''], [T('장소', 'Place'), ''], [T('작업', 'Job'), L(s.t)], [T('작업허가 번호', 'Permit no.'), ''], [T('사업장', 'Site'), siteName()], [T('작업 인원', 'Crew size'), '']] })
        + `<div class="doc-two">${sec(T('오늘의 위험', 'Today’s hazards'), ul(L(s.hz)))}${sec(T('이럴 땐 멈춘다', 'We stop if'), ul(L(s.stop)))}</div>`
        + sec(T('작업 전 확인', 'Checks before starting'), `<ul class="doc-checks">${checks.map((c) => `<li>${box} ${esc(c)}</li>`).join('')}</ul>`)
        + sec(T('오늘 추가로 확인한 위험과 대책', 'Other hazards and controls raised today'), blankRows([T('위험', 'Hazard'), T('대책', 'Control'), T('담당', 'Owner')], 3))
        + sec(T('참석자 서명', 'Attendance'), blankRows([T('성명', 'Name'), T('소속', 'Company / team'), T('서명', 'Signature')], 12, true), 'keep')
        + foot(s.src, T('허가 대상에서 빠지는 작업(Gray Zone)에도 같은 양식으로 TBM을 기록할 수 있습니다.', 'The same sheet works for grey-zone jobs outside the permit scope.'));
    },

    ra() {
      const api = S.riskApi, m = api.current(), def = api.methods[m];
      const { rows, ex } = api.rows(m), cols = def.cols();
      const meta = S.load('ra.meta', { name: T('M15X 가스 공급 설비 정기평가', 'M15X gas-supply periodic assessment'), date: today(), team: T('SHE·설비·협력사 작업자', 'SHE, facilities, contractor workers') });
      const cell = (c, r) => {
        const v = r[c.k];
        if (c.t === 'calc') return c.f(r);
        if (c.t === 'sel') { const o = (c.o || []).find(([ov]) => String(ov) === String(v)); return o ? esc(c.short ? o[0] : o[1]) : ''; }
        return esc(v == null ? '' : v);
      };
      return `<div class="doc-landscape">` + head({ kind: T('위험성평가', 'Risk assessment'), title: meta.name || T('위험성평가', 'Risk assessment'), sub: def.name() + ' — ' + def.desc(), approve: true, example: ex,
        meta: [[T('평가일', 'Date'), meta.date], [T('사업장', 'Site'), siteName()], [T('참여자 (근로자 참여)', 'Participants (incl. workers)'), meta.team], [T('평가 기법', 'Method'), def.name()]] })
        + `<table class="doc-table doc-ra"><thead><tr><th class="n">#</th>${cols.map((c) => `<th>${esc(c.l)}</th>`).join('')}</tr></thead><tbody>
          ${rows.map((r, i) => `<tr><td class="n">${i + 1}</td>${cols.map((c) => `<td>${cell(c, r)}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${cols.length + 1}">${esc(T('행이 없습니다', 'No rows'))}</td></tr>`}</tbody></table>`
        + (m === 'fs' ? sec(T('등급 기준 (SK하이닉스 공개 수준표)', 'Grades (SK hynix published scale)'), `<table class="doc-table"><tbody>${[2, 5, 9, 12, 16].map((v) => { const g = S.skGrade(v); return `<tr><td class="n">${g.band}</td><td class="n"><b>${g.g}</b></td><td>${esc(g.acc)} — ${esc(g.act)}</td></tr>`; }).join('')}</tbody></table>`) : '')
        + foot([def.basis, 'lawAct', m === 'fs' ? 'sr2026' : null].filter(Boolean), T('산안법 제36조: 위험성평가에는 해당 근로자가 참여하고, 결과는 기록·보존하며 근로자에게 알려야 합니다.', 'OSH Act Art. 36: workers take part, and results are recorded, kept and shared with them.')) + '</div>';
    },

    inc(id) {
      const rec = S.PREV.incidents().find((x) => String(x.id) === String(id)); if (!rec) return notFound();
      const m4 = S.PREV.m4(), hier = S.PREV.hier();
      const why = (rec.why || []).map(L).filter(Boolean);
      return head({ kind: T('사고조사', 'Investigation'), title: T('사고·아차사고 조사 보고서', 'Incident / near-miss investigation report'), approve: true, example: !rec.user,
        meta: [[T('발생일', 'Date'), rec.date], [T('사업장', 'Site'), siteName(rec.site)], [T('유형', 'Type'), L(S.CASE_TYPES[rec.type] || S.CASE_TYPES.other)], [T('조사자', 'Investigator'), '']] })
        + sec(T('경위', 'What happened'), `<p class="doc-text">${esc(L(rec.what))}</p>`)
        + sec(T('원인 분석 — 왜-왜 분석', 'Cause analysis — 5-Why'), why.length ? `<ol>${why.map((w) => `<li>${esc(w)}</li>`).join('')}</ol>` : `<p class="doc-small">–</p>`)
        + `<div class="doc-two">${sec(T('4M 원인 분류', '4M categories'), ul(m4.map(([v, l]) => ((rec.m4 || []).includes(v) ? '☑ ' : '☐ ') + l)))}${sec(T('대책 위계 (최상위)', 'Highest control level'), ul(hier.map(([v, l]) => (rec.level === v ? '☑ ' : '☐ ') + l)))}</div>`
        + sec(T('재발방지 대책', 'Corrective actions'), `<p class="doc-text">${esc(L(rec.fix)) || '–'}</p>`)
        + sec(T('조치 계획', 'Action plan'), blankRows([T('대책', 'Measure'), T('담당', 'Owner'), T('기한', 'Due'), T('완료 확인', 'Verified')], 4))
        + foot(['lawRule', 'moelRa', 'sr2026'], T('중대산업사고·산업재해가 난 작업은 관련 작업을 시작하기 전에 수시 위험성평가를 합니다(시행규칙 제37조②3). SK하이닉스는 아차사고 때도 수시평가를 한다고 공개했습니다.', 'After a major industrial accident or injury, run an ad-hoc risk assessment before the related work starts (Rule Art. 37(2)3). SK hynix says it also does so after near misses.'));
    },

    report() {
      const ev = S.PREV.report(), r = ev.r;
      const yes = (b) => (b ? T('예', 'Yes') : T('아니오', 'No'));
      const inputs = [
        [T('사망자', 'Deaths'), r.dead], [T('3개월 이상 요양 부상자 (동시)', 'Injured, 3+ months’ care (at once)'), r.sev3],
        [T('부상·직업성 질병자 (동시)', 'Injured or ill (at once)'), r.many], [T('6개월 이상 치료 부상자 (동일 사고)', 'Injured, 6+ months’ treatment (same accident)'), r.sev6],
        [T('급성중독 등 직업성 질병자 (동일 유해요인, 1년 이내)', 'Occupational illness (same agent, within a year)'), r.ill], [T('3일 이상 휴업자', '3+ days off work'), yes(r.lost3)],
        [T('화학물질 유출·누출', 'Chemical release'), yes(r.leak)], [T('물질', 'Substance'), r.leak ? L(ev.sub) : '–'],
        [T('유출·누출량 (kg·L)', 'Quantity (kg or L)'), r.leak ? r.qty : '–'], [T('인명 피해 (입원·진단서)', 'Harm (hospital / certificate)'), yes(r.hurt)],
        [T('고압가스 시설·용기 관련', 'High-pressure gas involved'), yes(r.gas)], [T('폭발·화재 / 대피·공급중단 / 저장탱크 누출', 'Explosion or fire / evacuation or supply cut / tank leak'), r.gas ? [r.fire, r.evac, r.tank].map(yes).join(' / ') : '–']
      ];
      const res = [
        [T('산안법 중대재해 (규칙 제3조)', 'OSH Act serious accident (Rule 3)'), ev.osh ? T('해당 — 즉시 작업중지·대피, 지체 없이 관할 지방고용노동관서에 보고', 'Yes — stop work and evacuate; report to the labour office without delay') : T('해당 없음', 'No'), T('법 제54조, 규칙 제67조', 'Act 54; Rule 67')],
        [T('산업재해조사표', 'Accident report form'), ev.form ? T('발생일부터 1개월 이내 제출', 'Submit within 1 month') : T('해당 없음', 'No'), T('규칙 제73조①', 'Rule 73(1)')],
        [T('중처법 중대산업재해', 'SAPA serious industrial accident'), ev.sapa ? T('해당', 'Yes') : T('해당 없음', 'No'), T('중처법 제2조 제2호', 'SAPA Art. 2(2)')],
        [T('화학사고 신고', 'Chemical accident report'), ev.chem ? `${ev.chem.t} (${T('별표1 ' + ev.chem.row + '목', 'Annex 1(' + S.rowEn(ev.chem.row) + ')')})` : T('해당 없음', 'No'), T('화학물질관리법 제43조, 즉시 신고 규정', 'Chemicals Act 43; reporting rules')],
        [T('가스사고 통보', 'Gas accident notification'), ev.gas ? (ev.gas.row ? ev.gas.t + ' (' + T('별표34 ' + ev.gas.row + '목', 'Annex 34(' + S.rowEn(ev.gas.row) + ')') + ')' : T('통보 대상 유형 아님', 'Not a listed type')) : T('해당 없음', 'No'), T('고압가스법 제26조, 규칙 별표34', 'Gas Act 26; Rule Annex 34')]
      ];
      return head({ kind: T('사고 보고', 'Accident reporting'), title: T('사고 보고·신고 의무 판정 결과', 'Accident reporting duties — result'), approve: true, example: ev.ex,
        meta: [[T('판정일', 'Checked on'), today()], [T('사업장', 'Site'), siteName()], [T('사고 일시·장소', 'Accident date and place'), ''], [T('작성자', 'Prepared by'), '']] })
        + sec(T('입력한 사실', 'Facts entered'), `<table class="doc-meta"><tbody>${pairs(inputs.map(([k, v]) => [k, String(v == null || v === '' ? '0' : v)]))}</tbody></table>`)
        + sec(T('판정 결과', 'Result'), `<table class="doc-table"><thead><tr><th>${esc(T('구분', 'Item'))}</th><th>${esc(T('결과', 'Result'))}</th><th>${esc(T('근거', 'Basis'))}</th></tr></thead><tbody>${res.map(([a, b, c]) => `<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td><td class="doc-small">${esc(c)}</td></tr>`).join('')}</tbody></table>`)
        + sec(T('보고·신고 기록', 'Report log'), blankRows([T('보고처', 'Reported to'), T('일시', 'Date & time'), T('방법', 'Method'), T('보고자', 'By'), T('접수자', 'Received by')], 6))
        + foot(['lawAct', 'lawRule', 'lawSapaAct', 'lawCca', 'mceReport', 'lawHpg', 'lawHpgRule'], T('판단 보조 결과입니다. 실제 보고 여부와 방법은 법령 원문과 관할 기관 안내를 따르세요.', 'A decision aid only; follow the statutes and the authorities on whether and how to report.'));
    },

    selfcheck() {
      const ck = S.load('moelck', {});
      const mark = (v) => (v === 'ok' ? T('적합', 'OK') : v === 'ng' ? T('개선 필요', 'Needs fix') : `${box} ${T('적합', 'OK')}  ${box} ${T('개선', 'Fix')}`);
      return head({ kind: T('자가점검', 'Self-check'), title: T('반도체 제조업 정부 점검 지적 사항 자가점검표', 'Self-check against the 2026 chipmaker inspection findings'), approve: true,
        meta: [[T('점검일', 'Date'), ''], [T('점검자', 'Checked by'), ''], [T('사업장', 'Site'), siteName()], [T('기준', 'Reference'), T('고용노동부 발표 (2026.9.20)', 'MOEL release (2026-09-20)')]] })
        + `<table class="doc-table"><thead><tr><th class="n">#</th><th>${esc(T('점검 항목', 'Check'))}</th><th>${esc(T('지적된 곳', 'Where found'))}</th><th>${esc(T('이천', 'Icheon'))}</th><th>${esc(T('청주', 'Cheongju'))}</th><th>${esc(T('조치 계획·담당·기한', 'Action, owner, due'))}</th></tr></thead><tbody>
          ${S.MOEL_FINDINGS.map((f, i) => `<tr class="write"><td class="n">${i + 1}</td><td>${esc(L(f.t))}</td><td class="doc-small">${esc(L(f.where))}</td><td class="doc-small">${esc(mark((ck[f.id] || {}).icheon))}</td><td class="doc-small">${esc(mark((ck[f.id] || {}).cheongju))}</td><td></td></tr>`).join('')}</tbody></table>`
        + foot(['moel0920']);
    },

    duty() {
      const d = Object.assign({}, S.PARTNER_DUTY_DEFAULT, S.load('pt.duty', {}));
      return head({ kind: T('도급 관리', 'Contractor management'), title: T('도급인 법정 의무 이행 점검표', 'Principal’s statutory duties checklist'), approve: true,
        meta: [[T('점검일', 'Date'), ''], [T('점검자', 'Checked by'), ''], [T('사업장', 'Site'), siteName()], [T('대상 도급 작업', 'Contracted work'), '']] })
        + `<table class="doc-table"><thead><tr><th class="n">#</th><th>${esc(T('의무', 'Duty'))}</th><th>${esc(T('근거', 'Basis'))}</th><th>${esc(T('이행', 'Done'))}</th><th>${esc(T('확인일·증빙', 'Date / evidence'))}</th></tr></thead><tbody>
          ${S.PARTNER_DUTIES.map((x, i) => `<tr class="write"><td class="n">${i + 1}</td><td>${esc(L(x.t))}</td><td class="doc-small">${esc(L(x.b))}</td><td class="n">${d[x.id] ? '☑' : box}</td><td></td></tr>`).join('')}</tbody></table>`
        + foot(['lawAct', 'lawDecree', 'lawRule', 'lawSapa']);
    },

    chem() {
      return head({ kind: T('자체 점검', 'Self-inspection'), title: T('유해화학물질 취급시설 자체 점검표', 'Hazardous-chemical facility self-inspection'), sub: T('화학물질관리법 제26조 — 주 1회 이상 점검, 결과 5년간 기록·비치', 'Chemicals Control Act Art. 26 — inspect at least weekly and keep records for 5 years'),
        approve: [T('점검자', 'Inspector'), T('유해화학물질관리자', 'Chemical manager'), T('확인', 'Confirmed')],
        meta: [[T('사업장', 'Site'), siteName()], [T('취급시설·구역', 'Facility / area'), ''], [T('점검 월', 'Month'), ''], [T('주요 취급 물질', 'Main chemicals'), '']] })
        + `<p class="doc-note">${esc(T('표기: ○ 양호 · × 이상(아래 조치 기록에 적기) · – 해당 없음', 'Mark: ○ OK · × problem (log it below) · – not applicable'))}</p>`
        + `<table class="doc-table"><thead><tr><th class="n">#</th><th>${esc(T('점검 항목', 'Check'))}</th><th>${esc(T('근거', 'Basis'))}</th>${[1, 2, 3, 4, 5].map((w) => `<th class="n doc-w">${esc(T(`${w}주`, `Wk ${w}`))}<br><span class="doc-small">__/__</span></th>`).join('')}</tr></thead><tbody>
          ${S.CCA_SELF.map((x, i) => `<tr class="write"><td class="n">${i + 1}</td><td>${esc(L(x))}</td><td class="doc-small">${esc(x.b.replace('법', T('법', 'Act')).replace('규칙', T('규칙', 'Rule')))}</td>${[1, 2, 3, 4, 5].map(() => '<td></td>').join('')}</tr>`).join('')}</tbody></table>`
        + sec(T('이상 발견 시 조치 기록', 'Problems found and actions'), blankRows([T('일자', 'Date'), T('설비·위치', 'Equipment / place'), T('이상 내용', 'Problem'), T('조치', 'Action'), T('확인', 'Checked')], 5))
        + foot(['lawCca', 'lawCcaRule'], T('법정 서식은 화학물질관리법 시행규칙 별지 제42호서식(점검대장)입니다. 이 표는 법정 점검 항목을 담은 연습용 양식입니다.', 'The statutory form is Form 42 of the Chemicals Control Rule (inspection register); this sheet is a practice template with the statutory items.'));
    },

    cycles() {
      const list = S.cycleData().slice().sort((a, b) => a.due - b.due);
      const every = (c) => (c.choices ? L((c.choices.find(([d]) => d === c.days) || c.choices[0])[1]) : L(c.every));
      const ids = [...new Set([].concat(...S.CYCLES.map((c) => [].concat(c.src))))];
      return `<div class="doc-landscape">` + head({ kind: T('법정 주기', 'Statutory cycles'), title: T('법정 주기 업무 기한 계획표', 'Statutory deadline schedule'), approve: true, example: list.some((c) => c.example),
        meta: [[T('기준일', 'As of'), today()], [T('사업장', 'Site'), siteName()], [T('담당 부서', 'Team'), ''], [T('작성자', 'Prepared by'), '']] })
        + `<table class="doc-table"><thead><tr><th>${esc(T('직무', 'Function'))}</th><th>${esc(T('업무', 'Obligation'))}</th><th>${esc(T('주기', 'Cycle'))}</th><th>${esc(T('근거', 'Basis'))}</th><th>${esc(T('최근 실시일', 'Last done'))}</th><th>${esc(T('다음 기한', 'Next due'))}</th><th>${esc(T('담당', 'Owner'))}</th><th>${esc(T('완료 확인', 'Done'))}</th></tr></thead><tbody>
          ${list.map((c) => `<tr class="write"><td class="doc-small">${esc(L(S.MOD[c.mod]))}</td><td>${esc(L(c.t))}</td><td class="doc-small">${esc(every(c))}</td><td class="doc-small">${esc(L(c.basis))}</td><td class="n">${S.iso(c.last)}${c.example ? ' *' : ''}</td><td class="n"><b>${S.iso(c.due)}</b></td><td></td><td></td></tr>`).join('')}</tbody></table>`
        + (list.some((c) => c.example) ? `<p class="doc-note">${esc(T('* 예시 날짜 — 업무판에 실제 실시일을 입력하면 바뀝니다.', '* Example date — replaced once you enter the real date on the dashboard.'))}</p>` : '')
        + foot(ids, T('법령상 최소 주기입니다. 사내 기준이 더 짧으면 사내 기준을 따릅니다.', 'Statutory minimums; follow shorter in-house cycles.')) + '</div>';
    },

    case(id) {
      const api = S.caseApi, c = api.findCase(id); if (!c) return notFound();
      const st = api.stateOf(c.id), rk = api.riskOf(c);
      const g = (v) => { const x = S.skGrade(v); return x ? x.g : ''; };
      const label = (list, v, d) => { const f = list().find(([k]) => k === v); return f ? f[1] : d; };
      const tag = (k) => (k === 'off' ? T('[공식] ', '[Official] ') : T('[분석] ', '[Analysis] '));
      const acts = c.actions || [];
      return head({ kind: T('재발방지', 'Recurrence prevention'), title: L(c.t), sub: L(c.impact), approve: true,
        meta: [[T('발생일', 'Date'), L(c.dateLabel) || c.date], [T('사업장', 'Site'), c.peer ? L(c.peer) : siteName(c.site)], [T('유형', 'Type'), (c.types || []).map((t) => L(S.CASE_TYPES[t])).join(', ')], [T('공식 원인', 'Official cause'), c.official ? T('확인됨', 'Confirmed') : T('공개되지 않음', 'Not published')]] })
        + sec(T('1. 사실관계', '1. Facts'), ul((c.facts || []).map((f) => L(f.t))))
        + ((c.officialFindings || []).length ? sec(T('공식 확인 사항', 'Official findings'), ul(c.officialFindings.map((f) => L(f.t)))) : '')
        + sec(T('2. 원인 분석 (5-Why)', '2. Cause analysis (5-Why)'), `<ol>${(c.why || []).map((w) => `<li>${esc(tag(w.k) + L(w.t))}</li>`).join('')}</ol>`
          + `<table class="doc-table"><tbody>${[['man', T('사람', 'Man')], ['machine', T('기계·설비', 'Machine')], ['media', T('작업 환경·방법', 'Media')], ['management', T('관리', 'Management')]].map(([k, l]) => `<tr><th>${esc(l)}</th><td>${esc(L((c.m4 || {})[k])) || '–'}</td></tr>`).join('')}</tbody></table>`)
        + sec(T('3. 위험성 (SK하이닉스 공개 수준표)', '3. Risk (SK hynix published scale)'), `<p class="doc-text">${esc(T('대책 전', 'Before'))} ${rk.bl}×${rk.bs} = <b>${rk.bl * rk.bs}</b> (${g(rk.bl * rk.bs)}) → ${esc(T('대책 후', 'After'))} ${rk.al}×${rk.as} = <b>${rk.al * rk.as}</b> (${g(rk.al * rk.as)})</p>`)
        + sec(T('4. 재발방지 대책', '4. Measures'), `<table class="doc-table"><thead><tr><th>${esc(T('위계', 'Level'))}</th><th>${esc(T('대책', 'Measure'))}</th><th>${esc(T('근거', 'Basis'))}</th><th>${esc(T('담당', 'Owner'))}</th><th>${esc(T('기한', 'Due'))}</th><th>${esc(T('상태', 'Status'))}</th></tr></thead><tbody>
          ${S.CTRL_LEVELS.map((lv) => acts.map((a, i) => (a.lvl !== lv.id ? '' : `<tr class="write"><td class="doc-small">${esc(L(lv.t))}</td><td>${esc(L(a.t))}</td><td class="doc-small">${esc(basisText(a.b))}</td><td>${esc((st.act[i] || {}).own || '')}</td><td class="n">${esc((st.act[i] || {}).due || '')}</td><td class="doc-small">${esc(label(api.status, (st.act[i] || {}).st || 'plan', ''))}</td></tr>`)).join('')).join('') || `<tr><td colspan="6">–</td></tr>`}</tbody></table>`)
        + `<div class="doc-two">${sec(T('5. 수평전개', '5. Lateral deployment'), ul((L(c.lateral) || []).map((x, i) => `${x} — ${label(api.lat, st.lat[i] || 'todo', '')}`)))}
          ${sec(T('6. 효과성 검증', '6. Effectiveness'), ul((c.verify || []).map((v, i) => `${L(v.k)}: ${T('목표', 'target')} ${L(v.target)} / ${T('실적', 'actual')} ${(st.ver[i] || {}).val || '—'} (${label(api.ver, (st.ver[i] || {}).st || 'na', '')})`)))}</div>`
        + (L(c.lesson) ? sec(T('교훈', 'Lesson'), `<p class="doc-text"><b>${esc(L(c.lesson))}</b></p>`) : '')
        + foot((c.src || []).concat(['sr2026']), c.user ? '' : T('대책·수평전개·검증 항목은 학습용 포털 제안이며 회사의 실제 조치가 아닙니다.', 'Measures, lateral items and checks are portal proposals for learning, not the company’s actual actions.'));
    }
  };

  /* 2단계 — 안전작업허가서 (KOSHA C-C-49 별지 양식1의 통합 서식 구성을 따름) */
  DOCS.ptw = function (id) {
    const api = S.ptwApi, p = api && api.find(id); if (!p) return notFound();
    const R = p.roles || {}, st = api.status();
    const mark = (on) => (on ? '☑' : box);
    const role = (k) => esc(L(R[k]) || '');
    const types = L(S.PTW_MAIN[p.main].t) + (p.supp || []).map((s) => ' + ' + L(S.PTW_SUPP[s].t)).join('');
    const itemTable = (g) => `<table class="doc-table"><thead><tr><th class="n">✓</th><th>${esc(T('확인 사항', 'Check'))}</th><th>${esc(T('근거', 'Basis'))}</th></tr></thead><tbody>
      ${S.PTW_CHECKS[g].map((it) => `<tr><td class="n">${mark((p.checks || {})[it.id])}</td><td>${esc(L(it))}${api.required(p, it) ? ` <b>(${esc(T('필수', 'req.'))})</b>` : ''}</td><td class="doc-small">${esc(basisText(it.b))}</td></tr>`).join('')}</tbody></table>`;
    const gasRows = (p.gas || []).map((r) => { const d = api.gasDef(r.id) || { t: r.id, u: '', rule: '' }; const v = api.gasVerdict(r);
      return `<tr><td>${esc(d.t)}</td><td class="n">${esc(r.v)} ${esc(d.u)}</td><td class="doc-small">${esc(d.rule)}</td><td class="n">${v ? esc(v === 'ok' ? T('적합', 'OK') : T('부적합', 'Fail')) : ''}</td><td class="n">${esc(r.time || '')}</td><td>${esc(L(r.by) || '')}</td></tr>`; }).join('');
    return head({ kind: T('안전작업허가', 'Permit to work'), title: T('안전작업허가서', 'Safe work permit') + ' — ' + types, sub: L(p.task), example: !!p.ex,
      approve: [T('발급자', 'Issuer'), T('승인자', 'Approver'), T('작업부서 책임자', 'Work-team lead')],
      meta: [[T('허가번호', 'Permit no.'), p.no], [T('상태', 'Status'), st[p.status] || p.status], [T('작업허가기간', 'Valid'), `${p.date || ''} ${p.from || ''}–${p.extTo || p.to || ''}${p.extTo ? T(' (연장)', ' (extended)') : ''}`], [T('사업장', 'Site'), siteName(p.site)],
        [T('작업장소', 'Location'), L(p.area)], [T('설비·장치번호', 'Equipment / tag'), L(p.equip)], [T('신청 부서·업체', 'Requesting team'), L(p.team)], [T('작업자', 'Workers'), L(p.workers)],
        [T('신청인', 'Applicant'), L(R.applicant)], [T('입회자', 'Attendant'), L(R.attendant)]] })
      + sec(T('작업허가 전 점검 (C-C-49 6.1)', 'Pre-permit review (C-C-49 6.1)'), `<ul class="doc-checks">${S.PTW_PRE.map((it) => `<li>${mark((p.pre || {})[it.id])} ${esc(L(it))}</li>`).join('')}</ul>`)
      + api.groups(p).map((g) => sec(api.groupTitle(g), itemTable(g) + (S.PTW_SUPP[g] ? `<table class="doc-meta"><tbody>${pairs([[T('허가기간', 'Valid'), ''], [T('확인자 (서명)', 'Checked by (signature)'), '']])}</tbody></table>` : ''), 'keep')).join('')
      + (p.main === 'hot' ? `<p class="doc-note">${esc(T('화재감시자 배치 대상', 'Fire watch required'))}: ${p.fw ? `☑ ${esc(T('예', 'Yes'))} — ${role('firewatch')}` : `${box} ${esc(T('해당 없음', 'No'))}`}</p>` : '')
      + ((p.supp || []).includes('electrical') ? `<p class="doc-note">${esc(T('전원 복구: 모든 작업이 끝난 뒤 운전부서 입회자의 요청으로만 복구 — 요청자 ______ 복구시간 ______ 확인자 ______', 'Power restoration: only after all work is done, at the operations attendant’s request — requested by ______ time ______ checked by ______'))}</p>` : '')
      + sec(T('가스 농도 측정', 'Gas tests'), `<table class="doc-table"><thead><tr><th>${esc(T('물질', 'Gas'))}</th><th class="n">${esc(T('결과', 'Result'))}</th><th>${esc(T('기준', 'Criterion'))}</th><th class="n">${esc(T('판정', 'OK?'))}</th><th class="n">${esc(T('측정시간', 'Time'))}</th><th>${esc(T('측정자/확인자', 'Tester / checker'))}</th></tr></thead><tbody>${gasRows}
        ${Array.from({ length: Math.max(0, 4 - (p.gas || []).length) }, () => '<tr class="write"><td></td><td></td><td></td><td></td><td></td><td></td></tr>').join('')}</tbody></table>`, 'keep')
      + sec(T('작업허가 연장', 'Extension'), `<table class="doc-meta"><tbody>${pairs([[T('연장 종료 시각', 'Extended to'), p.extTo || ''], [T('발급자 재확인 (서명)', 'Issuer re-check (signature)'), '']])}</tbody></table>`)
      + sec(T('작업 완료', 'Completion'), `<table class="doc-meta"><tbody>${pairs([[T('작업완료 시간', 'Completed at'), p.closedAt || ''], [T('입회자', 'Attendant'), L(R.attendant) || ''], [T('작업자', 'Worker'), ''], [T('복원(조치) 상태', 'Restoration'), p.restored ? T('복원 확인', 'Restored') + (p.closeNote ? ' — ' + p.closeNote : '') : '']])}</tbody></table>`, 'keep')
      + sec(T('서명', 'Signatures'), `<table class="doc-table"><thead><tr><th>${esc(T('구분', 'Role'))}</th><th>${esc(T('부서·직책', 'Team / position'))}</th><th>${esc(T('성명', 'Name'))}</th><th>${esc(T('서명', 'Signature'))}</th></tr></thead><tbody>
        ${[['applicant', T('신청인', 'Applicant')], ['issuer', T('발급자', 'Issuer')], ['approver', T('승인자', 'Approver')], ['attendant', T('입회자', 'Attendant')], ['workLead', T('작업(공무)부서 책임자', 'Work-team lead')], ['coop', T('관련부서 협조자', 'Other department')]].concat((p.supp || []).includes('confined') ? [['watcher', T('밀폐공간 감시인', 'Confined-space attendant')]] : [])
          .map(([k, l]) => `<tr class="write"><td>${esc(l)}</td><td></td><td>${role(k)}</td><td></td></tr>`).join('')}</tbody></table>`, 'keep')
      + foot(['moelPsm', 'koshaCC49', 'lawStd'], T(`허가서는 작업 현장에 게시하고, 작업 완료 후 회수해 ${api.retention(p)}년간 보관합니다(PSM 고시 제46조, C-C-49 5.4·5.5 — 밀폐공간 출입작업 허가서는 3년). 밀폐공간 산소·유해가스 측정 기록은 3년간 보존합니다(안전보건규칙 제619조의2④). 허가는 허가서에 적은 기간에만 유효하며 일일 정상근무시간을 넘을 수 없습니다(C-C-49 5.6).`, `Post the permit at the job; collect it afterwards and keep it for ${api.retention(p) === 3 ? 'three years' : 'one year'} (PSM Notice Art. 46; C-C-49 5.4–5.5 — three years for confined-space entry permits). Keep confined-space gas records for three years (Standards Rules Art. 619-2(4)). The permit is valid only for the period written on it and never beyond one day’s normal working hours (C-C-49 5.6).`));
  };

  /* 3단계 — 작업허가 모니터링 체크리스트 (C-C-49-2026 별지 양식3). idx: 저장된 기록 번호 또는 'blank' */
  DOCS.ptwmon = function (id, idx) {
    const api = S.ptwApi, p = api && api.find(id); if (!p) return notFound();
    const rec = idx === 'blank' || idx == null ? null : (p.mon || [])[Number(idx)];
    if (idx !== 'blank' && idx != null && !rec) return notFound();
    const a = (rec && rec.a) || {}, ans = api.ANS();
    const mark = (k, v) => (a[k] === v ? '☑' : box);
    return head({ kind: T('안전작업허가', 'Permit to work'), title: T('작업허가 모니터링 체크리스트', 'Permit monitoring checklist'), sub: L(p.task), example: !!p.ex,
      meta: [[T('날짜·시간', 'Date & time'), rec ? rec.at : ''], [T('작업위치', 'Location'), L(p.area)], [T('허가서 종류', 'Permit type'), L(S.PTW_MAIN[p.main].t) + (p.supp || []).map((s) => ' + ' + L(S.PTW_SUPP[s].t)).join('')], [T('허가서 번호', 'Permit no.'), p.no],
        [T('검토자', 'Reviewer'), rec ? rec.by : ''], [T('작업수행 책임자', 'Person in charge'), rec ? rec.lead : '']] })
      + `<p class="doc-note"><b>${esc(T('안전하지 않은 조건이 발견되면 작업을 중지하고 담당부서에 즉시 통보해야 합니다.', 'If unsafe conditions are found, stop the work and tell the responsible department at once.'))}</b></p>`
      + `<table class="doc-table"><thead><tr><th class="n">No.</th><th>${esc(T('확인 사항', 'Check'))}</th>${ans.map(([, l]) => `<th class="n">${esc(l)}</th>`).join('')}</tr></thead><tbody>
        ${S.PTW_MON.map((m, i) => `<tr><td class="n">${i + 1}</td><td>${esc(L(m))}</td>${ans.map(([v]) => `<td class="n">${mark('m' + (i + 1), v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`
      + sec(T('의견', 'Comments'), `<p class="doc-text">${esc(rec ? rec.note : '') || '&nbsp;'}</p>`)
      + `<table class="doc-meta"><tbody>${pairs([[T('검토자 서명', 'Reviewer signature'), ''], [T('작업수행 책임자 서명', 'Person in charge signature'), '']])}</tbody></table>`
      + foot(['koshaCC49'], T('C-C-49-2026 8(3): 모니터링 기록은 현장에 보관하고 주기적인 작업허가 감사 때 검토합니다.', 'C-C-49-2026 8(3): keep monitoring records at the site and review them in the periodic permit audit.'));
  };

  /* 3단계 — 작업허가 절차 평가 체크리스트 (C-C-49-2026 별지 양식4) */
  DOCS.ptwaudit = function () {
    const api = S.ptwApi; if (!api) return notFound();
    const au = api.audit(), ans = api.ANS();
    const mark = (k, v) => (au.a[k] === v ? '☑' : box);
    return head({ kind: T('안전작업허가', 'Permit to work'), title: T('작업허가 절차 평가 체크리스트', 'Permit-system audit checklist'), approve: true,
      sub: T('새 작업허가 절차를 도입할 때나 기존 절차를 감사할 때 사용', 'For introducing a permit system or auditing the existing one'),
      meta: [[T('평가일', 'Date'), au.date || ''], [T('평가자', 'Auditor'), au.by || ''], [T('사업장', 'Site'), siteName()], [T('주요 개선 사항', 'Main improvements'), au.note || '']] })
      + S.PTW_AUDIT.map((g) => sec(L(g.t), `<table class="doc-table"><thead><tr><th class="n">No.</th><th>${esc(T('평가 항목', 'Question'))}</th>${ans.map(([, l]) => `<th class="n">${esc(l)}</th>`).join('')}</tr></thead><tbody>
        ${g.q.map(([n, q]) => `<tr><td class="n">${n}</td><td>${esc(L(q))}</td>${ans.map(([v]) => `<td class="n">${mark('q' + n, v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`, 'keep')).join('')
      + foot(['koshaCC49', 'moelPsm'], T('C-C-49-2026 8(4)~(7): PSM 자체감사의 ‘작업허가’ 분야에 포함해 수행할 수 있고, 부적합은 기록해 개선조치를 추적하며, 해결할 수 없는 부적합은 즉시 경영진에게 보고합니다. 최소 3년마다 경영진과 함께 절차 전반을 검토합니다.', 'C-C-49-2026 8(4)–(7): may be run as the “permit to work” part of the PSM self-audit; record non-conformities and track fixes, report any that cannot be resolved to management at once, and review the whole system with management at least every three years.'));
  };

  /* 2단계 — 교육 이수 현황표 */
  DOCS.training = function () {
    const api = S.trnApi; if (!api) return notFound();
    const dt = api.data(), opt = Object.assign({}, api.OPT, S.load('trn.opt', {}));
    const refS = S.load('trn.ref', null) || today(), ref = new Date(refS + 'T00:00:00');
    const rows = dt.people.map((p) => ({ p, a: api.assess(p, dt.recs, ref, opt) }));
    return `<div class="doc-landscape">` + head({ kind: T('교육 관리', 'Training'), title: T('안전보건교육 이수 현황표', 'Safety & health training status'), approve: true, example: dt.ex,
      meta: [[T('기준일', 'As of'), refS], [T('사업장', 'Site'), siteName()], [T('작성 부서', 'Team'), ''], [T('작성자', 'Prepared by'), '']] })
      + `<table class="doc-table"><thead><tr><th>${esc(T('성명', 'Name'))}</th><th>${esc(T('소속', 'Team'))}</th><th>${esc(T('구분', 'Type'))}</th><th>${esc(T('교육 과정', 'Course'))}</th><th class="n">${esc(T('이수/기준(시간)', 'Done / req. (h)'))}</th><th>${esc(T('판정', 'Result'))}</th><th>${esc(T('조치 계획', 'Action'))}</th></tr></thead><tbody>
        ${rows.map(({ p, a }) => a.map((r, i) => `<tr class="write">${i === 0 ? `<td rowspan="${a.length}">${esc(L(p.name))}</td><td rowspan="${a.length}" class="doc-small">${esc(L(p.org))}</td><td rowspan="${a.length}" class="doc-small">${esc(api.kindL(p.kind))}</td>` : ''}<td class="doc-small">${esc(r.t)}</td><td class="n">${S.fmt(r.done, 1)} / ${S.fmt(r.need, 1)}</td><td class="doc-small">${esc(r.level === 'ok' ? T('충족', 'Met') : r.level === 'info' ? T('정보 부족', 'Need data') : r.level === 'warn' ? T(`${S.fmt(r.short, 1)}시간 남음`, `${S.fmt(r.short, 1)} h to go`) : T(`${S.fmt(r.short, 1)}시간 부족`, `${S.fmt(r.short, 1)} h short`))}</td><td></td></tr>`).join('')).join('') || `<tr><td colspan="7">–</td></tr>`}</tbody></table>`
      + foot(['lawRule', 'lawCcaRule'], T('산안법 시행규칙 별표4(교육시간)·제27조(면제), 화학물질관리법 시행규칙 제37조·별표6의3 기준으로 계산한 참고표입니다. 교육 일지·수료증 등 증빙은 따로 보관하세요.', 'A reference sheet computed from OSH Rule Annex 4 (hours) and Art. 27 (exemptions) and Chemicals Control Rule Art. 37 and Annex 6-3. Keep training logs and certificates separately.')) + '</div>';
  };

  /* 4단계 — 월간 법령 변경 점검표 (포털 기준 판과 현행본 대조) */
  DOCS.lawcheck = function () {
    if (!S.LAWCHECK) return notFound();
    const G = { law: T('법령', 'Statute'), adm: T('고시·예규', 'Notice'), code: T('기술기준', 'Code') };
    const lc = S.lawLog ? S.lawLog() : { by: '', log: [] };
    const other = [T('고용노동부 보도자료 (반도체·화학·PSM 관련)', 'MOEL press releases (chips, chemicals, PSM)'), T('산업안전포털 KOSHA GUIDE 목록 — 인용 지침의 새 공표·폐지', 'KOSHA Guide list — new or withdrawn cited guides'), T('KGS 코드 목록 — FU211·FU212 승인일', 'KGS code list — FU211 and FU212 approval dates'), T('출처 확인일·최신 안전 동향 기준일 갱신', 'Update the sources’ checked dates and the news date')];
    return `<div class="doc-landscape">` + head({ kind: T('법령 변경 점검', 'Law-change check'), title: T('월간 법령 변경 점검표', 'Monthly law-change checklist'), approve: true,
      sub: T('포털이 인용한 법령·고시·기술기준의 현행본을 국가법령정보센터 등에서 확인', 'Confirm the current text of every cited law, notice and code'),
      meta: [[T('점검일', 'Date'), ''], [T('점검자', 'Checked by'), lc.by || ''], [T('포털 기준일', 'Portal as of'), S.LAW_ASOF], [T('사업장', 'Site'), siteName()]] })
      + `<table class="doc-table"><thead><tr><th class="n">No.</th><th>${esc(T('구분', 'Type'))}</th><th>${esc(T('법령·기준', 'Law / code'))}</th><th>${esc(T('포털 기준', 'Portal version'))}</th><th class="n">${esc(T('같음', 'Same'))}</th><th class="n">${esc(T('바뀜', 'Changed'))}</th><th>${esc(T('시행 예정·유의', 'Upcoming / notes'))}</th><th>${esc(T('조치', 'Action'))}</th></tr></thead><tbody>
        ${S.LAWCHECK.map((r, i) => `<tr class="write"><td class="n">${i + 1}</td><td class="doc-small">${esc(G[r.g])}</td><td class="doc-small">${esc(L(r.n))}</td><td class="doc-small">${esc(L(r.v))}</td><td class="n">${box}</td><td class="n">${box}</td><td class="doc-small">${esc(r.next ? L(r.next) : '')}</td><td></td></tr>`).join('')}</tbody></table>`
      + sec(T('그 밖에 확인', 'Also check'), `<ul>${other.map((x) => `<li>${box} ${esc(x)}</li>`).join('')}</ul>`, 'keep')
      + sec(T('바뀐 법령과 포털 수정 내용', 'Changes found and portal fixes'), blankRows([T('법령·조문', 'Law / article'), T('바뀐 내용', 'What changed'), T('포털에서 고친 곳', 'Portal pages fixed')], 4, true), 'keep')
      + foot([], T('확인 방법: 국가법령정보센터 법령 화면 제목 옆 [시행 …] [… 제○호]를 ‘포털 기준’과 비교하고, 다르면 ‘신구법비교’로 바뀐 조문을 확인합니다. 공포됐지만 시행 전인 개정은 부칙의 시행일을 확인합니다.', 'Method: compare the [in force …] [No. …] line on each law page with “Portal version”; if it differs, read the changed articles in “old vs new”. For amendments not yet in force, read the effective date in the addendum.')) + '</div>';
  };

  /* where the “back” button goes for each document */
  const BACK = { lawcheck: () => '#sources/lawcheck', ptw: (id) => '#ptw/' + id, ptwmon: (id) => '#ptw/' + id, ptwaudit: () => '#ptw/audit', training: () => '#training', card: (id) => '#sop/' + id, sop: (id) => '#sop/' + id, tbm: () => '#prevent/tbm', ra: () => '#risk', inc: () => '#prevent/incident', report: () => '#prevent/report',
    selfcheck: () => '#cases/selfcheck', duty: () => '#partner', chem: () => '#psm/chem', cycles: () => '#home/cycles', case: (id) => '#cases/' + id };

  S.pages.print = {
    render(sub) {
      const [doc, id, opt] = String(sub || '').split('/');
      const fn = DOCS[doc];
      let body;
      try { body = fn ? fn(id, opt) : notFound(); } catch (err) { console.error(err); body = notFound(); }
      const back = BACK[doc] ? BACK[doc](id) : '#home';
      return `<div class="print-bar">
          <a class="btn ghost sm" href="${esc(back)}">← ${esc(T('돌아가기', 'Back'))}</a>
          <button class="btn sm" type="button" id="pr-go">${S.ICON_PRINT}${esc(T('인쇄 / PDF로 저장', 'Print / save as PDF'))}</button>
          ${doc === 'card' ? `<a class="btn ghost sm" href="#print/card/${esc(id)}${opt === 'both' ? '' : '/both'}">${esc(opt === 'both' ? T('현재 언어만', 'Current language only') : T('한·영 병기', 'Korean + English'))}</a>` : ''}
          <span class="xs muted">${esc(T('인쇄 창에서 대상(프린터)을 ‘PDF로 저장’으로 고르면 PDF 파일이 됩니다. A4 기준이며, 여백·배율은 인쇄 창에서 조정하세요.', 'In the print dialog choose “Save as PDF” as the printer to get a PDF. Laid out for A4; adjust margins and scale in the dialog.'))}</span>
        </div>
        <article class="doc" aria-label="${esc(T('인쇄 미리보기', 'Print preview'))}">${body}</article>`;
    },
    mount(root) {
      const b = root.querySelector('#pr-go'); if (b) b.addEventListener('click', () => window.print());
    }
  };
  S.printDocs = Object.keys(DOCS);
})();

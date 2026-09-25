/* 안전관리자 업무판 (Dashboard) */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui;

  const MOD = {
    psm: { ko: '공정안전', en: 'PSM' }, prevent: { ko: '예방안전', en: 'Prevention' }, sdx: { ko: 'SDX', en: 'SDX' },
    partner: { ko: '상생협력', en: 'Partners' }, fire: { ko: '소방·방재', en: 'Fire' }, culture: { ko: '안전문화', en: 'Culture' }
  };
  S.MOD = MOD;

  /* 예시 최근 실시일: 상태가 골고루 보이도록 오늘 기준으로 생성 (사용자가 수정하면 예시 표시가 사라진다) */
  const EXAMPLE_AGO = { council: 20, rounds: 1, joint: 70, sapa3: 150, sapa5: 190, sapa7: 40, sapa8: 100, sapa9: 170, fireop: 300, firefull: 120, drill: 380, edu: 60, supedu: 200, ra: 250,
    oshc: 40, 'sapa-law': 120, 'sapa-edu': 90, wem: 150, she: 200, inspect: 500, 'psm-eval': 900, disclose: 55, mgredu: 400,
    'cca-self': 3, 'cca-insp': 200, 'cca-plan': 900, 'cca-notice': 150, 'cca-edu': 100, 'cca-edu2': 300, 'hpg-insp': 335, 'hpg-edu': 500 };
  /* 매년 정해진 날짜까지 하는 의무(예: 4월 30일 공시)는 최근 실시일 다음에 오는 그 날짜를 기한으로 본다 */
  const nextFixed = (from, md) => {
    const [m, d] = md.split('-').map(Number);
    const x = new Date(from.getFullYear(), m - 1, d);
    return x > from ? x : new Date(from.getFullYear() + 1, m - 1, d);
  };
  const CYC_SHOW = 10;
  const validDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + 'T00:00:00'));
  function cycleData() {
    const saved = S.load('cycles', {}), picked = S.load('cycles.days', {});
    const t = S.today();
    return S.CYCLES.map((c) => {
      const userDate = validDate(saved[c.id]) ? saved[c.id] : null;
      /* items with legal alternatives (e.g. 1–4-year inspections) keep the interval the user picked */
      const days = c.choices && c.choices.some(([d]) => d === Number(picked[c.id])) ? Number(picked[c.id]) : c.days;
      const last = userDate ? new Date(userDate + 'T00:00:00') : S.addDays(t, -(EXAMPLE_AGO[c.id] || 30));
      const due = c.fixed ? nextFixed(last, c.fixed) : S.addDays(last, days);
      const left = S.daysBetween(t, due);
      const warnWindow = Math.max(1, Math.round(days * 0.15));
      const level = left < 0 ? 'bad' : left <= warnWindow ? 'warn' : 'ok';
      return Object.assign({}, c, { days, last, due, left, level, example: !userDate });
    }).sort((a, b) => a.left - b.left);
  }
  S.cycleData = cycleData;

  /* ---------- calendar export (RFC 5545) ---------- */
  const icsEsc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  /* fold lines longer than 75 octets without splitting a UTF-8 character */
  const icsFold = (line) => {
    const enc = new TextEncoder(); const out = []; let cur = '', size = 0;
    for (const ch of line) {
      const b = enc.encode(ch).length;
      if (size + b > (out.length ? 74 : 75)) { out.push(cur); cur = ''; size = 0; }
      cur += ch; size += b;
    }
    out.push(cur);
    return out.join('\r\n ');
  };
  const ymd = (d) => S.iso(d).replace(/-/g, '');
  S.cyclesIcs = function () {
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const site = L(S.SITES[S.state.site].name);
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SHE Master//Statutory cycles//KO', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'X-WR-CALNAME:' + icsEsc(T('SHE Master 법정 주기', 'SHE Master statutory cycles'))];
    cycleData().forEach((c) => {
      const lead = Math.min(14, Math.max(1, Math.round(c.days * 0.15)));
      const desc = [
        T('주기', 'Cycle') + ': ' + L(c.every),
        T('근거', 'Basis') + ': ' + L(c.basis),
        T('사업장', 'Site') + ': ' + site,
        T('최근 실시일', 'Last done') + ': ' + S.iso(c.last) + (c.example ? T(' (예시)', ' (example)') : ''),
        T('완료하면 SHE Master 업무판에 최근 실시일을 입력하고 다시 내보내세요. 법정 최소 주기이며 사내 기준이 더 짧으면 그 기준을 따릅니다.', 'When done, enter the date on the SHE Master dashboard and export again. These are statutory minimums; follow shorter in-house cycles.')
      ].join('\n');
      lines.push('BEGIN:VEVENT', 'UID:she-' + c.id + '@she-master', 'DTSTAMP:' + stamp,
        'DTSTART;VALUE=DATE:' + ymd(c.due), 'DTEND;VALUE=DATE:' + ymd(S.addDays(c.due, 1)),
        'SUMMARY:' + icsEsc('[SHE] ' + L(c.t)), 'DESCRIPTION:' + icsEsc(desc), 'CATEGORIES:' + icsEsc(L(MOD[c.mod])), 'TRANSP:TRANSPARENT',
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEsc(L(c.t)), 'TRIGGER:-P' + lead + 'D', 'END:VALARM', 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.map(icsFold).join('\r\n') + '\r\n';
  };

  const DEFAULT_TASKS = [
    { id: 1, t: { ko: 'M15X 반입 장비 가동 전 안전점검(PSSR) 체크리스트 검토', en: 'Review PSSR checklist for tools moving into M15X' }, mod: 'psm', site: 'cheongju', st: 'todo' },
    { id: 2, t: { ko: '9월 안전·보건 협의체 안건: 건설·셋업 혼재작업 조정', en: 'September safety council agenda: coordinate overlapping construction and set-up work' }, mod: 'partner', site: 'cheongju', st: 'doing' },
    { id: 3, t: { ko: 'P&S Room 순찰 로봇 열화상 이상 알림 3건 조치 확인', en: 'Close out 3 thermal alerts from the P&S room patrol robot' }, mod: 'sdx', site: 'icheon', st: 'todo' },
    { id: 4, t: { ko: '하반기 비상대응 훈련 계획 (ERT·관할 소방서 합동)', en: 'Plan the H2 emergency drill (ERT with the local fire station)' }, mod: 'fire', site: 'icheon', st: 'doing' },
    { id: 5, t: { ko: '10월 캠페인 “추락·끼임·부딪힘” 콘텐츠 제작', en: 'Build the October “falls, caught-in, struck-by” campaign' }, mod: 'culture', site: 'common', st: 'todo' },
    { id: 6, t: { ko: '가스 캐비닛 경보 아차사고 5-Why 원인조사', en: '5-Why investigation of a gas-cabinet alarm near miss' }, mod: 'prevent', site: 'common', st: 'done' },
    { id: 7, t: { ko: '협력사 SHE 평가표 반기 점검 (중처법 시행령 제4조 제9호)', en: 'Half-year check of contractor SHE scorecards (SAPA Decree Art. 4(9))' }, mod: 'partner', site: 'common', st: 'todo' },
    { id: 8, t: { ko: '가스 작업 “허가 없이 개시” 방지 — 허가 연동 인터록 검토 (2026 청주 사례 재발방지)', en: 'Stop gas work starting without a permit — review permit-linked interlocks (2026 Cheongju lesson)' }, mod: 'psm', site: 'cheongju', st: 'doing' }
  ];
  const tasks = () => S.load('tasks', null) || DEFAULT_TASKS;

  function barChart(data, opts) {
    const w = 320, h = 150, pad = { l: 34, r: 8, t: 14, b: 24 };
    const max = opts.max || Math.max.apply(null, data.map((d) => d.v)) * 1.25;
    const bw = (w - pad.l - pad.r) / data.length;
    const ticks = opts.ticks || [0, max / 2, max];
    const y = (v) => pad.t + (h - pad.t - pad.b) * (1 - v / max);
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${S.esc(opts.label)}">
      ${ticks.map((tk) => `<line class="grid-line" x1="${pad.l}" x2="${w - pad.r}" y1="${y(tk)}" y2="${y(tk)}"/><text x="${pad.l - 6}" y="${y(tk) + 4}" text-anchor="end">${S.fmt(tk, 2)}</text>`).join('')}
      ${data.map((d, i) => {
        const x = pad.l + i * bw + bw * 0.22, bwid = bw * 0.56, top = y(d.v);
        return `<rect class="bar ${i === data.length - 1 ? 'hi' : ''}" x="${x}" y="${top}" width="${bwid}" height="${Math.max(0, h - pad.b - top)}" rx="2"/>
          <text x="${x + bwid / 2}" y="${top - 4}" text-anchor="middle" class="${i === data.length - 1 ? 'lbl-strong' : ''}">${S.fmt(d.v, 2)}</text>
          <text x="${x + bwid / 2}" y="${h - 8}" text-anchor="middle">${d.y}</text>`;
      }).join('')}
    </svg>`;
  }

  function gapChart() {
    const rows = S.COMPANY.kpi.trirTarget;
    const w = 340, h = 170, cx = 150, scale = 4.2, top = 14, rh = 34;
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${T('통합재해율 목표 대비 실적', 'Integrated injury rate: target vs actual')}">
      <line class="grid-line" x1="${cx}" x2="${cx}" y1="6" y2="${h - 18}"/>
      <text x="${cx - 4}" y="${h - 4}" text-anchor="end">← ${T('저감(목표)', 'reduction (target)')}</text>
      <text x="${cx + 4}" y="${h - 4}">${T('증가(실적)', 'increase (actual)')} →</text>
      ${rows.map((r, i) => {
        const yy = top + i * rh;
        const tw = Math.abs(r.target) * scale;
        const target = `<rect x="${cx - tw}" y="${yy}" width="${tw}" height="11" rx="2" fill="var(--ok)" opacity=".75"/><text x="${cx - tw - 4}" y="${yy + 9}" text-anchor="end">${r.target}%</text>`;
        const actual = r.actual == null ? `<text x="${cx + 6}" y="${yy + 21}">${T('미공개·진행 중', 'not yet reported')}</text>`
          : `<rect x="${cx}" y="${yy + 13}" width="${r.actual * scale}" height="11" rx="2" fill="var(--bad)"/><text x="${cx + r.actual * scale + 4}" y="${yy + 22}" class="lbl-strong">+${r.actual}%</text>`;
        return `<text x="6" y="${yy + 16}" class="lbl-strong">${r.y}</text>${target}${actual}`;
      }).join('')}
    </svg>`;
  }

  S.pages.home = {
    render() {
      const k = S.COMPANY.kpi, site = S.state.site, siteInfo = S.SITES[site];
      const cyc = cycleData();
      const overdue = cyc.filter((c) => c.level === 'bad').length, soon = cyc.filter((c) => c.level === 'warn').length;
      const showAll = S.state.indexing || S.state.cycAll || cyc.length <= CYC_SHOW;
      const cycRows = showAll ? cyc : cyc.slice(0, CYC_SHOW);
      const tk = tasks().filter((x) => site === 'common' || x.site === site || x.site === 'common');
      const cols = [['todo', T('할 일', 'To do')], ['doing', T('진행 중', 'In progress')], ['done', T('완료', 'Done')]];
      const ra = k.ra[k.ra.length - 1];

      return `
      ${ui.head(T('업무판', 'Dashboard') + ' · ' + S.dateLabel(S.today()) + ' · ' + L(siteInfo.name),
        T('안전관리자 업무판', 'SHE manager dashboard'),
        T('법정 주기 업무의 기한, 회사가 공개한 안전 KPI, 6대 직무별 할 일을 한 화면에서 확인합니다. 상단에서 사업장(공통·이천·청주)과 언어를 바꿀 수 있습니다.',
          'Statutory deadlines, the company’s published safety KPIs and tasks across the six SHE functions on one screen. Switch site (all, Icheon, Cheongju) and language at the top.'))}
      ${(() => {
        if (S.state.indexing || !S.userKeys().length) return '';
        const ago = S.backup ? S.backup.lastAgo() : null;
        if (ago != null && ago <= 30) return '';
        return `<div class="callout warn small" id="backup-nudge">${ago == null ? T('입력한 데이터가 이 브라우저에만 저장돼 있고 아직 백업하지 않았습니다.', 'Your data lives only in this browser and has never been backed up.') : T(`마지막 백업이 ${ago}일 전입니다.`, `Your last backup was ${ago} days ago.`)} <a href="#data">${T('백업하기', 'Back up now')} →</a></div>`;
      })()}
      ${(() => {
        /* 법령 변경 점검(월 1회)을 한 번이라도 기록한 사용자에게만, 31일이 지나면 알림 */
        if (S.state.indexing) return '';
        const lc = S.load('lawchk', null), last = lc && Array.isArray(lc.log) && lc.log[0];
        if (!last || !last.at) return '';
        const ago = S.daysBetween(new Date(last.at + 'T00:00:00'), S.today());
        return ago > 31 ? `<div class="callout warn small" id="lawchk-nudge">${T(`마지막 법령 변경 점검이 ${ago}일 전입니다(월 1회 권장).`, `Your last law-change check was ${ago} days ago (monthly is recommended).`)} <a href="#sources/lawcheck">${T('점검하기', 'Check now')} →</a></div>` : '';
      })()}

      <section class="grid g4" aria-label="KPI">
        <div class="panel kpi"><span class="k">${T('재해율 (국내, 2025)', 'Injury rate (Korea, 2025)')}${S.cite('sr2026')}</span><span class="v">0.09<small>%</small></span><span class="d">${T('2024년 0.10% · 2023년 0.10%', '2024: 0.10 % · 2023: 0.10 %')}</span></div>
        <div class="panel kpi"><span class="k">LTIFR ${T('(20만 근무시간당, 2025)', '(per 200k hours, 2025)')}${S.cite('sr2026')}</span><span class="v">0.03</span><span class="d">${T('2024년 0.02', '2024: 0.02')}</span></div>
        <div class="panel kpi"><span class="k">${T('산재 사망자 (2025)', 'Work fatalities (2025)')}${S.cite('sr2026')}</span><span class="v">0<small>${T('명', '')}</small></span><span class="d">${T('2024년 1명 — 무재해가 당연하지 않다는 기록', '2024: 1 — a reminder zero is never automatic')}</span></div>
        <div class="panel kpi"><span class="k">${T('작업 위험성평가 (2025)', 'Job risk assessments (2025)')}${S.cite('sr2026')}</span><span class="v">${S.fmt(ra.jobs)}</span><span class="d">${T(`개선 필요 ${S.fmt(ra.hazards)}건 · 평균 위험도 ${ra.before}→${ra.after}`, `${S.fmt(ra.hazards)} hazards fixed · mean risk ${ra.before}→${ra.after}`)}</span></div>
      </section>

      <section class="grid g3">
        <div class="panel span2" id="anchor-cycles">
          ${ui.title(T('법정 주기 트래커', 'Statutory cycle tracker'), T(`경과 ${overdue} · 임박 ${soon} — 최근 실시일을 입력하면 다음 기한을 계산합니다`, `${overdue} overdue · ${soon} due soon — enter the last date to recalculate`))}
          <div class="table-wrap"><table class="data">
            <thead><tr><th>${T('업무', 'Obligation')}</th><th>${T('주기', 'Cycle')}</th><th>${T('근거', 'Basis')}</th><th>${T('최근 실시일', 'Last done')}</th><th>${T('다음 기한', 'Next due')}</th><th>${T('상태', 'Status')}</th></tr></thead>
            <tbody>${cycRows.map((c) => `<tr>
              <td><span class="chip">${L(MOD[c.mod])}</span> ${L(c.t)}</td>
              <td class="small">${c.choices ? `<select data-cycdays="${c.id}" aria-label="${S.esc(T('주기 선택', 'Choose the interval') + ' — ' + L(c.t))}" style="max-width:min(220px,100%)">${c.choices.map(([d, l]) => `<option value="${d}" ${d === c.days ? 'selected' : ''}>${S.esc(L(l))}</option>`).join('')}</select>` : L(c.every)}</td>
              <td class="small">${L(c.basis)}${S.cite(c.src)}</td>
              <td><input type="date" id="cyc-${c.id}" data-cycle="${c.id}" value="${S.iso(c.last)}" aria-label="${S.esc(L(c.t))}"> ${c.example ? ui.ex() : ''}</td>
              <td class="n">${S.iso(c.due)}</td>
              <td>${ui.pill(c.level, c.left < 0 ? T(`경과 ${-c.left}일`, `${-c.left} d overdue`) : c.left === 0 ? T('오늘', 'Today') : T(`D-${c.left}`, `${c.left} d left`))}</td>
            </tr>`).join('')}</tbody></table></div>
          <div class="row" style="margin-top:8px">${cyc.length > CYC_SHOW && !S.state.indexing ? `<button class="btn ghost sm" type="button" id="cycAll" aria-expanded="${showAll}">${showAll ? T('기한 임박 10개만 보기', 'Show the 10 most urgent') : T(`전체 ${cyc.length}개 보기`, `Show all ${cyc.length}`)}</button>` : ''}<button class="btn ghost sm" type="button" id="cycIcs">${T('캘린더로 내보내기 (.ics)', 'Export to calendar (.ics)')}</button>${S.printLink('cycles', T('기한 계획표 인쇄', 'Print the schedule'))}</div>
          <p class="xs muted" style="margin-top:8px">${T('주기는 법령 원문 기준의 최소 요건입니다. 소방 점검 시기는 사용승인월·대상물 등급에 따라 달라지므로 “소방·방재”에서 계산하세요. 작업환경측정·특수건강진단은 보건관리자 소관이지만 화학물질 노출 관리와 맞물려 함께 봅니다.', 'Cycles are statutory minimums. Fire-inspection timing depends on the approval month and property grade — use “Fire & emergency” to calculate it. Exposure monitoring and special health checks belong to the health manager but are tracked here because they tie into chemical-exposure control.')}</p>
        </div>
        <div class="stack">
          <div class="panel">
            ${ui.title(T('통합재해율 목표 vs 실적', 'Injury-rate target vs actual'), T('2021년 대비', 'vs 2021'))}
            ${gapChart()}
            <p class="xs muted">${T('PRISM 2030 목표는 10% 저감이지만 2024·2025년 모두 증가해 미달성했다고 회사가 공개했습니다. 이 격차가 안전관리자가 풀어야 할 과제입니다.', 'The PRISM 2030 goal is a 10 % cut, yet the company reports increases in both 2024 and 2025. Closing this gap is the SHE team’s job.')}${S.cite('sr2026', 'sr2025')}</p>
          </div>
          <div class="panel">
            ${ui.title(T('재해율 추이', 'Injury-rate trend'), T('국내, %', 'Korea, %'))}
            ${barChart(k.injuryRate, { max: 0.12, ticks: [0, 0.06, 0.12], label: T('재해율 추이', 'Injury rate trend') })}
            <p class="xs muted">${S.cite('sr2026')}</p>
          </div>
        </div>
      </section>

      <section class="grid g3">
        <div class="panel span2">
          ${ui.title(T('최신 안전 동향', 'Latest safety updates'), T(`기준일 ${S.NEWS_ASOF}`, `As of ${S.NEWS_ASOF}`) + ` · <a href="#news">${T('전체 보기', 'See all')} →</a>`)}
          ${(() => { const d = S.daysBetween(new Date(S.LAW_ASOF + 'T00:00:00'), S.today()); return d > 45 ? `<div class="callout warn small">${T(`포털의 법령·동향 기준일(${S.LAW_ASOF}) 이후 ${d}일이 지났습니다. 그 사이 개정이 있을 수 있으니 국가법령정보센터에서 최신본을 확인하세요.`, `${d} days have passed since the portal’s law and news date (${S.LAW_ASOF}); laws may have changed, so check the current text on the National Law Information Center.`)} <a href="#sources/lawcheck">${T('점검 방법', 'How to check')} →</a></div>` : ''; })()}
          <ol class="timeline news">${S.NEWS.slice(0, 6).map((x) => `<li><span class="num">${x.date}</span>${ui.pill({ reg: 'bad', sk: 'info', acc: 'warn', law: 'ok' }[x.kind], { reg: T('규제·감독', 'Regulator'), sk: 'SK hynix', acc: T('사고', 'Incident'), law: T('법령', 'Law') }[x.kind])} <span>${S.esc(L(x.t))}${S.cite(x.src)}</span>${x.link ? ` <a class="xs" href="${x.link}">→</a>` : ''}</li>`).join('')}</ol>
        </div>
        <div class="panel stack">
          ${ui.title(T('재발방지 현황', 'Recurrence prevention'), `<a href="#cases">${T('사고사례 분석', 'Incident analysis')} →</a>`)}
          ${(() => { const st = S.caseStats(); const pct = st.total ? Math.round(st.done / st.total * 100) : 0; return `<div class="kpi"><span class="k">${T('대책 이행률 (내가 입력한 상태 기준)', 'Measures completed (from the status you enter)')}</span><span class="v">${pct}<small>%</small></span><span class="d">${T(`${st.total}개 대책 중 ${st.done}개 완료`, `${st.done} of ${st.total} measures done`)}</span></div><div class="gauge" aria-hidden="true"><i style="width:${pct}%;background:var(--ok)"></i></div>`; })()}
          <div class="callout bad small"><b>${T('2026 정부 점검', '2026 MOEL inspection')}</b> — ${T('SK하이닉스 청주 119건 위반, 이천 도급승인 취소. 6월 가스룸 사고의 공식 원인은 사전점검 미실시·허가 없는 가스 작업 개시.', 'SK hynix Cheongju: 119 violations; Icheon: approval revoked. Official cause of the June gas-room events: skipped pre-checks and gas work without a permit.')}${S.cite('moel0920')}</div>
        </div>
      </section>

      <section class="panel" id="anchor-tasks">
        ${ui.title(T('6대 직무 업무 보드', 'Six-function task board'), T('예시 업무 포함 · 이 브라우저에만 저장', 'Includes example tasks · saved in this browser only'))}
        <form class="row" id="taskForm" style="margin-bottom:12px">
          <input type="text" id="taskText" placeholder="${T('새 업무 입력', 'New task')}" style="flex:1;min-width:200px" required>
          <select id="taskMod" aria-label="${T('직무', 'Function')}">${Object.keys(MOD).map((m) => `<option value="${m}">${L(MOD[m])}</option>`).join('')}</select>
          <button class="btn" type="submit">${T('추가', 'Add')}</button>
          <button class="btn ghost" type="button" id="taskReset">${T('예시로 초기화', 'Reset to examples')}</button>
        </form>
        <div class="board">${cols.map(([st, label]) => `<div class="col"><h4>${label}<span class="muted num">${tk.filter((x) => x.st === st).length}</span></h4>
          ${tk.filter((x) => x.st === st).map((x) => `<div class="task">
            <span>${S.esc(L(x.t))}</span>
            <div class="row"><span class="row" style="gap:6px"><span class="chip">${L(MOD[x.mod])}</span>${x.site !== 'common' ? `<span class="chip">${L(S.SITES[x.site].name)}</span>` : ''}${x.id <= 8 && !x.user ? ui.ex() : ''}</span>
            <span class="row" style="gap:4px">${st !== 'done' ? `<button class="btn ghost sm" data-task-move="${x.id}" aria-label="${T('다음 단계로', 'Move forward')}">→</button>` : ''}<button class="btn danger sm" data-task-del="${x.id}" aria-label="${T('삭제', 'Delete')}">×</button></span></div>
          </div>`).join('')}</div>`).join('')}</div>
      </section>

      <section class="grid g2">
        <div class="panel">
          ${ui.title(T('사업장 스냅샷', 'Site snapshot') + ' — ' + L(siteInfo.name), `<a href="#sites">${T('사업장 상세', 'Site details')} →</a>`)}
          <ul class="facts">${siteInfo.facts.slice(0, 5).map((f) => `<li>${L(f.t)}${S.cite(f.src)}</li>`).join('')}</ul>
        </div>
        <div class="panel">
          ${ui.title(T('바로 가기', 'Quick launch'))}
          <div class="grid g2">
            <a class="btn ghost" href="#measure">${T('화학물질 노출 판정', 'Chemical exposure check')}</a>
            <a class="btn ghost" href="#measure">${T('밀폐공간 적정공기 판정', 'Confined-space air check')}</a>
            <a class="btn ghost" href="#risk">${T('위험성평가 (SK하이닉스 수준표)', 'Risk assessment (SK hynix scale)')}</a>
            <a class="btn ghost" href="#partner">${T('도급승인 대상 판별', 'Subcontract approval check')}</a>
            <a class="btn ghost" href="#fire">${T('소방 자체점검 일정', 'Fire self-inspection schedule')}</a>
            <a class="btn ghost" href="#sop">${T('작업 전 5분 안전카드', '5-minute pre-job card')}</a>
            <a class="btn ghost" href="#prevent/report">${T('사고 보고 의무 판정', 'Accident reporting check')}</a>
            <a class="btn ghost" href="#psm/tq">${T('PSM 대상(규정량) 판정', 'PSM threshold check')}</a>
          </div>
        </div>
      </section>`;
    },
    mount(root) {
      root.querySelectorAll('[data-cycle]').forEach((inp) => inp.addEventListener('change', () => {
        const saved = S.load('cycles', {});
        if (inp.value) saved[inp.dataset.cycle] = inp.value; else delete saved[inp.dataset.cycle];
        S.save('cycles', saved); S.refresh();
      }));
      const ca = root.querySelector('#cycAll');
      if (ca) ca.addEventListener('click', () => { S.state.cycAll = !S.state.cycAll; S.refresh(); });
      root.querySelectorAll('[data-cycdays]').forEach((s) => s.addEventListener('change', () => {
        const p = S.load('cycles.days', {}); p[s.dataset.cycdays] = Number(s.value); S.save('cycles.days', p); S.refresh();
      }));
      const ic = root.querySelector('#cycIcs');
      if (ic) ic.addEventListener('click', () => {
        S.download(`SHE-Master-cycles-${S.iso(S.today())}.ics`, S.cyclesIcs(), 'text/calendar;charset=utf-8');
        S.toast(T('캘린더 파일을 내려받았습니다', 'Calendar file downloaded'));
      });
      const form = root.querySelector('#taskForm');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = root.querySelector('#taskText').value.trim();
        if (!text) return;
        const list = tasks();
        list.push({ id: Date.now(), t: { ko: text, en: text }, mod: root.querySelector('#taskMod').value, site: S.state.site, st: 'todo', user: true });
        S.save('tasks', list); S.refresh(); S.toast(S.T('업무를 추가했습니다', 'Task added'));
      });
      root.querySelector('#taskReset').addEventListener('click', () => { S.save('tasks', null); S.refresh(); });
      root.querySelectorAll('[data-task-move]').forEach((b) => b.addEventListener('click', () => {
        const list = tasks(); const x = list.find((i) => String(i.id) === b.dataset.taskMove);
        x.st = x.st === 'todo' ? 'doing' : 'done'; S.save('tasks', list); S.refresh();
      }));
      root.querySelectorAll('[data-task-del]').forEach((b) => b.addEventListener('click', () => {
        S.save('tasks', tasks().filter((i) => String(i.id) !== b.dataset.taskDel)); S.refresh();
      }));
    }
  };
})();

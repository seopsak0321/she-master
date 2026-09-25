/* SK하이닉스 이해 · 사업장 · 벤치마킹 · 출처 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui, C = S.COMPANY, esc = S.esc;

  const AREA = { psm: { ko: '공정안전', en: 'PSM' }, prevent: { ko: '예방안전', en: 'Prevention' }, sdx: { ko: 'SDX', en: 'SDX' }, partner: { ko: '상생협력', en: 'Partners' }, fire: { ko: '소방·방재', en: 'Fire' }, culture: { ko: '안전문화', en: 'Culture' } };

  const MAP = [
    { c: 'VWBE', p: { ko: '모든 모듈에 “위험 제보·제안” 입력과 조치 결과 공개 — 자발적 참여를 기록으로 남김', en: 'Every module takes hazard reports and ideas and shows the outcome — voluntary participation leaves a trace' } },
    { c: 'One Team', p: { ko: '임직원과 협력사가 같은 SOP를 보고, 협력사용 “작업 전 5분 카드”만 요약 수준을 달리함', en: 'Employees and contractors read the same SOPs; only the 5-minute card changes the level of detail' } },
    { c: 'SUPEX', p: { ko: '목표 대비 실적(통합재해율 격차)을 숨기지 않고 업무판 첫 화면에 표시', en: 'The dashboard shows the target-vs-actual gap in the injury rate instead of hiding it' } },
    { c: { ko: '예외 없는 Safety First', en: 'Safety First, no exceptions' }, p: { ko: '모든 SOP에 “작업 중지 기준”을 절차와 같은 무게로 배치', en: 'Every SOP gives its stop-work criteria the same weight as its steps' } },
    { c: 'Tenacity · Advanced Tech', p: { ko: 'SDX 모듈에서 로봇·AI 감지 이벤트를 조치 완료까지 추적', en: 'The SDX module tracks robot/AI detections through to closure' } },
    { c: 'Prosperity Together', p: { ko: '상생협력 모듈의 법정 의무 체크·협력사 평가·컨설팅 이력', en: 'Partner module: statutory duties, contractor scoring, consulting history' } }
  ];

  S.pages.company = {
    render() {
      return `
      ${ui.head(T('회사 이해', 'Company'), T('SK하이닉스 이해', 'Understanding SK hynix'),
        T('포털 설계의 출발점입니다. 회사가 직접 공개한 지속가능경영보고서(2024·2025·2026)와 뉴스룸만 근거로 정리했습니다.', 'The starting point for the portal’s design, drawn only from the company’s own sustainability reports (2024–2026) and newsroom.'))}
      <section class="grid g2">
        <div class="panel">${ui.title(T('회사 개요', 'Overview'))}
          <div class="table-wrap"><table class="data"><tbody>${C.overview.map((o) => `<tr><th scope="row" style="width:34%">${L(o.k)}</th><td>${L(o.v)}${S.cite(o.src)}</td></tr>`).join('')}</tbody></table></div>
        </div>
        <div class="panel">${ui.title('Brand Identity', T('회사 BI', 'Company BI'))}
          <p style="font-size:17px;font-weight:600;line-height:1.5">“${L(C.bi.purpose)}”${S.cite(C.bi.src)}</p>
          <div class="grid g3" style="margin-top:14px">${C.bi.values.map((v) => `<div class="kpi"><span class="k">Value</span><span style="font-weight:600">${v.en}</span>${S.state.lang === 'ko' ? `<span class="d">${v.ko}</span>` : ''}</div>`).join('')}</div>
          <p class="small muted" style="margin-top:12px">Drivers — ${C.bi.drivers.join(' · ')}</p>
        </div>
      </section>
      <section class="grid g2">
        <div class="panel">${ui.title(T('일하는 방식', 'How the company works'))}
          <div class="stack">${C.culture.map((c) => `<div><b>${c.t}</b> — ${L(c.d)}${S.cite(c.src)}</div>`).join('')}</div>
        </div>
        <div class="panel">${ui.title(T('안전 메시지', 'Safety messages'))}
          <div class="stack">${C.slogans.map((s) => `<div><b>${L(s.t)}</b>${S.cite(s.src)}<br><span class="small muted">${L(s.d)}</span></div>`).join('')}</div>
        </div>
      </section>
      <section class="panel">${ui.title(T('안전보건 거버넌스', 'Safety & health governance'))}
        <div class="grid g4">${C.governance.map((g) => `<div class="stack" style="gap:4px;border-top:2px solid var(--ink);padding-top:10px"><b>${L(g.t)}</b><span class="small muted">${L(g.d)}${S.cite(g.src)}</span></div>`).join('')}</div>
      </section>
      <section class="panel">${ui.title(T('회사가 공개한 안전 제도·시스템', 'Safety programmes the company has disclosed'), T('포털은 이 제도를 대체하지 않고 연결합니다', 'The portal links to these rather than replacing them'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('제도', 'Programme')}</th><th>${T('내용', 'What it does')}</th><th>${T('직무', 'Function')}</th><th>${T('공개 시점', 'Disclosed')}</th></tr></thead>
        <tbody>${C.programs.map((p) => `<tr><td><b>${typeof p.t === 'string' ? p.t : L(p.t)}</b></td><td>${L(p.d)}${S.cite(p.src)}</td><td><span class="chip">${L(AREA[p.area])}</span></td><td class="n">${p.year}</td></tr>`).join('')}</tbody></table></div>
        <p class="xs muted" style="margin-top:8px">${T('Golden Rules의 7개 항목, BBS 등 일부 제도는 2015~2022년 자료 기준이며 세부 내용은 공개되지 않아 포털에 임의로 채우지 않았습니다.', 'Some items (e.g. the seven Golden Rules, BBS) come from 2015–2022 material and their details are not public, so the portal does not invent them.')}</p>
      </section>
      <section class="panel">${ui.title(T('문화를 포털 설계로', 'From culture to portal design'), T('포털 제안', 'Portal proposal'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('SK하이닉스 방식', 'SK hynix way')}</th><th>${T('포털에 반영한 방식', 'How the portal reflects it')}</th></tr></thead>
        <tbody>${MAP.map((m) => `<tr><td><b>${typeof m.c === 'string' ? m.c : L(m.c)}</b></td><td>${L(m.p)}</td></tr>`).join('')}</tbody></table></div>
      </section>`;
    }
  };

  S.pages.sites = {
    render() {
      const cur = S.state.site;
      const s = S.SITES[cur];
      return `
      ${ui.head(T('사업장', 'Sites'), T('사업장별 안전 프로필', 'Site safety profiles'),
        T('공통 체계는 공통으로, 이천·청주는 각 사업장이 공개한 특징과 그에 따른 관리 포인트로 나눴습니다. 상단 사업장 선택과 연동됩니다.', 'Company-wide systems stay common; Icheon and Cheongju each get their disclosed characteristics and resulting focus points. Linked to the site switch at the top.'))}
      <div class="seg" role="group" aria-label="${T('사업장', 'Site')}">${['common', 'icheon', 'cheongju'].map((id) => `<button type="button" data-site="${id}" aria-pressed="${cur === id}">${L(S.SITES[id].name)}</button>`).join('')}</div>
      <section class="grid g3">
        <div class="panel span2">${ui.title(L(s.name), L(s.lead))}
          <ul class="facts">${s.facts.map((f) => `<li>${L(f.t)}${S.cite(f.src)}</li>`).join('')}</ul>
        </div>
        <div class="panel">${ui.title(T('안전관리 포인트', 'Focus points'), T('포털 제안 — 공개자료 기반 해석', 'Portal proposal — interpretation of public data'))}
          ${s.focus.length ? `<div class="stack">${s.focus.map((f) => `<div class="callout">${L(f)}</div>`).join('')}</div>` :
            `<p class="small">${T('공통 탭에서는 전사 체계를 봅니다. 이천·청주를 선택하면 사업장별 포인트가 나타납니다.', 'The company-wide tab shows shared systems. Pick Icheon or Cheongju for site-specific focus points.')}</p>`}
          <hr class="sep">
          <div class="small"><b>${T('관련 SOP', 'Related SOPs')}</b><div class="row" style="margin-top:6px">${(cur === 'cheongju' ? ['equip-move', 'height', 'hot-work', 'loto'] : cur === 'icheon' ? ['pm-chamber', 'line-break', 'pump-scrubber', 'gas-cylinder'] : ['confined', 'chem-supply', 'implant'])
            .map((id) => `<a class="chip" href="#sop/${id}">${L(S.SOPS.find((x) => x.id === id).t)}</a>`).join('')}</div></div>
        </div>
      </section>
      <section class="panel">${ui.title(T('사업장 비교', 'Side by side'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('항목', 'Item')}</th><th>${T('이천', 'Icheon')}</th><th>${T('청주', 'Cheongju')}</th></tr></thead><tbody>
          <tr><td>${T('주요 Fab', 'Main fabs')}</td><td>M14, M16 ${T('(운영)', '(operating)')}${S.cite('sr2026')}</td><td>M15X ${T('(2025.10 오픈)', '(opened Oct 2025)')}, P&T7 ${T('(건설 중)', '(under construction)')}${S.cite('sr2026')}</td></tr>
          <tr><td>${T('순찰 로봇', 'Patrol robot')}</td><td>${T('가온', 'Gaon')}${S.cite('inews2026')}</td><td>${T('다온 1~3호', 'Daon units 1–3')}${S.cite('inews2026')}</td></tr>
          <tr><td>${T('상생협력 성과', 'Partnership recognition')}</td><td>${T('2025 우수 사업장', '2025 top performer')}${S.cite('sr2026')}</td><td>${T('3년 연속 우수 → 자율이행 사업장', '3 years running → self-compliance worksite')}${S.cite('nrbp2026')}</td></tr>
          <tr><td>${T('비상대응·지역 연계', 'Emergency & community')}</td><td>${T('이천소방서 주관 긴급구조종합훈련(2025), 경기도 화학물질지역협의회', 'Icheon Fire Station rescue exercise (2025); Gyeonggi chemical council')}${S.cite('sr2026')}</td><td>${T('충청지역 화학안전공동체 협의회 가입', 'Member of the Chungcheong chemical-safety community council')}${S.cite('sr2026')}</td></tr>
          <tr><td>${T('교육 인프라', 'Training infrastructure')}</td><td>–</td><td>${T('SHE 체험교육관 (2025.5)', 'SHE Experience Center (May 2025)')}${S.cite('nr2025she')}</td></tr>
          <tr><td>ISO 45001</td><td>~2027-01-16${S.cite('sr2026')}</td><td>~2027-01-16${S.cite('sr2026')}</td></tr>
        </tbody></table></div>
      </section>`;
    }
  };

  const BENCH = [
    { who: 'Samsung Semiconductor', src: 'samsung',
      facts: { ko: ['작업중지권(Right to Work Suspension): 2018년 도입, 2021년 1월 협력사·작업자 보상 체계 강화', '2024년 작업중지 4,537건', '협력사 ISO 45001/KOSHA-MS 인증 확대: 2021~2024년 285개사'], en: ['Right to Work Suspension: introduced 2018, compensation for suppliers and workers strengthened Jan 2021', '4,537 work stoppages in 2024', 'Supplier ISO 45001/KOSHA-MS certification: 285 companies in 2021–2024'] },
      take: { ko: '작업중지를 “건수”로 공개하면 작업중지가 실패가 아니라 정상 행동이 됩니다 → SOP마다 작업중지 기준 배치, 업무판에 작업중지 기록 지표 제안', en: 'Publishing stoppage counts makes stopping normal, not failure → stop-work criteria on every SOP; propose a stop-work log KPI' } },
    { who: 'TSMC', src: 'tsmc2023',
      facts: { ko: ['2022년 하루 협력사 출입 5만 1천 명 이상', '디지털 산업안전 교육과 출입 권한·공사 신청 연동', '고위험 작업·구역 AI 위험 식별 — 천장 작업, 탱크로리 충전 구역 모듈 (Fab 15A)', '협력사 ESH 감독자 소통회의, 현장 작업자에게 불안전 작업 중지 권한 부여 요청', '협력사용 ESH Blue Book 수시 개정'], en: ['Over 51,000 contractor entries per day in 2022', 'Digital safety training linked to access rights and work applications', 'AI hazard identification for high-risk work — ceiling work and tanker-filling modules (Fab 15A)', 'ESH supervisor meetings; front-line workers empowered to stop unsafe work', 'Rolling updates to the contractor ESH Blue Book'] },
      take: { ko: '교육 이수와 출입·작업 신청을 연결하는 구조 → 상생협력 모듈의 “작업 전 5분 카드 + 협력사교육시스템 연계”', en: 'Tying training completion to access and work requests → the partner module’s 5-minute card plus link to the partner education system' } },
    { who: { ko: '미국 OSHA', en: 'US OSHA' }, src: 'osha146',
      facts: { ko: ['허가 필요 밀폐공간의 위험 분위기: 가연성 가스가 LFL의 10% 초과, 산소 19.5% 미만 또는 23.5% 초과 등', '반도체 공정별 유해위험을 공정 단위로 정리해 공개'], en: ['Hazardous atmosphere in permit spaces: flammable gas > 10 % of LFL, O₂ < 19.5 % or > 23.5 %, etc.', 'Publishes semiconductor hazards step by step'] },
      take: { ko: '국내 기준과 나란히 비교해 보여주면 판단 근거가 분명해짐 → 밀폐공간 판정기에 한·미 기준 병기', en: 'Showing Korean and US limits side by side makes judgments clearer → dual criteria in the confined-space checker' } }
  ];

  /* 3단계 — 한·미 규제 비교. 각 칸은 원문을 확인한 조항만 적는다(한국: 국가법령정보센터 현행본, 미국: OSHA 표준 원문, 2026-09-24).
     “규정 없음”은 인용한 조문에 없다는 뜻으로만 쓴다 */
  const X = (ko, en) => ({ ko, en });
  const CMP = [
    { id: 'psm', t: X('공정안전관리 (PSM)', 'Process safety management (PSM)'), kr: ['lawDecree', 'moelPsm'], us: ['osha119'], note: X('한국 PSM 고시 제43~52조는 공단이 공정안전보고서와 이행 상태를 심사하는 기준 조항입니다.', 'Korean PSM Notice Arts. 43–52 are the criteria KOSHA uses to review PSM reports and their implementation.'), rows: [
      [X('적용 대상', 'Scope'), X('시행령 제43조·별표13 규정량 이상 유해·위험물질을 제조·취급·저장하는 설비 — 실란·포스핀·삼불화질소 등 반도체 가스를 물질별로 열거', 'Decree Art. 43 and Annex 13 — plants above threshold quantities; semiconductor gases such as silane, phosphine and NF₃ are listed by name'), X('(a) 부록 A 물질의 기준량 이상 공정, 인화성 가스·인화점 100°F(37.8°C) 미만 액체 10,000lb(4,535.9kg) 이상', '(a) processes above Appendix A thresholds, or 10,000 lb (4,535.9 kg) of flammable gas or liquid with flash point < 100 °F (37.8 °C)')],
      [X('위험성평가 재검토', 'Hazard analysis review'), X('공정위험성평가를 최대 4년 이내 주기로 수행 (PSM 고시 제43조)', 'Process hazard analysis at least every 4 years (PSM Notice Art. 43)'), X('5년마다 갱신·재검증 ((e)(6))', 'Updated and revalidated every 5 years ((e)(6))')],
      [X('운전절차 확인', 'Operating procedures'), X('안전보건총괄책임자가 매년 현재 설비와 일치하는지 확인·기록 (고시 제44조)', 'The site head confirms and records each year that they match the plant (Notice Art. 44)'), X('매년 최신·정확함을 인증 ((f)(3))', 'Certified current and accurate every year ((f)(3))')],
      [X('운전원 재교육', 'Refresher training'), X('최소 3년마다 1회 이상 (고시 제48조)', 'At least every 3 years (Notice Art. 48)'), X('최소 3년마다 ((g)(2))', 'At least every 3 years ((g)(2))')],
      [X('사고조사 착수', 'Incident investigation'), X('사고 발생 즉시, 늦어도 24시간 이내 (고시 제52조)', 'At once, within 24 hours at the latest (Notice Art. 52)'), X('48시간 이내 착수, 보고서 5년 보관 ((m)(2)·(7))', 'Within 48 hours; reports kept 5 years ((m)(2), (7))')],
      [X('자체 감사', 'Self-audit'), X('1년마다 자체감사, 보고서 3년 이상 보관 (고시 제51조)', 'Every year; reports kept at least 3 years (Notice Art. 51)'), X('3년마다 준수 감사 인증, 최근 2회 보고서 보관 ((o)(1)·(5))', 'Compliance audit certified every 3 years; last two reports kept ((o)(1), (5))')],
      [X('정부 정기 평가', 'Regulator’s periodic review'), X('공단 이행상태평가: 신규(확인 1년 경과 후 2년 이내), 정기 4년마다 (고시 제54조)', 'KOSHA implementation assessment: first within 2 years after year one, then every 4 years (Notice Art. 54)'), X('1910.119에는 정기 평가 조항이 없음 — 사업주 준수 감사로 운영', 'No periodic regulator review in 1910.119 — relies on the employer’s audit')]
    ] },
    { id: 'cs', t: X('밀폐공간', 'Confined spaces'), kr: ['lawStd', 'koshaSop3'], us: ['osha146'], rows: [
      [X('공기 기준', 'Atmosphere'), X('적정공기: 산소 18% 이상 23.5% 미만, CO₂ 1.5% 미만, CO 30ppm 미만, H₂S 10ppm 미만 (제618조)', 'Acceptable air: O₂ ≥ 18 % and < 23.5 %, CO₂ < 1.5 %, CO < 30 ppm, H₂S < 10 ppm (Art. 618)'), X('위험 분위기: 산소 19.5% 미만 또는 23.5% 초과, 인화성 가스가 LFL의 10% 초과, 허용노출기준 초과 등 ((b))', 'Hazardous atmosphere: O₂ < 19.5 % or > 23.5 %, flammable gas > 10 % of LFL, above a PEL, etc. ((b))')],
      [X('프로그램', 'Programme'), X('밀폐공간 작업 프로그램 수립·시행 (제619조①), KOSHA E-G-18은 2년에 1회 이상 평가 권고', 'Confined-space programme (Art. 619(1)); KOSHA E-G-18 advises review at least every 2 years'), X('허가공간 프로그램을 취소된 허가서로 입장 후 1년 이내 검토 ((d)(14))', 'Permit-space programme reviewed within a year using cancelled permits ((d)(14))')],
      [X('작업 전 확인·게시', 'Before entry'), X('작업 정보·작업자·측정결과·유입 가능성·보호구·비상연락 6개 항목 확인, 종료까지 출입구 게시 (제619조②③)', 'Six items checked — job, people, test results, inflow risks, PPE, emergency contacts — and posted at the entrance until the end (Art. 619(2)(3))'), X('입장 허가서를 입구에 게시, 허가 기간은 작업 소요 시간 이내 ((e)(3)·(4))', 'Entry permit posted at the portal; valid only for the time the job needs ((e)(3), (4))')],
      [X('기록 보존', 'Records'), X('측정자·일시·장소·결과 3년 보존 (제619조의2④)', 'Tester, time, place and results kept 3 years (Art. 619-2(4))'), X('취소된 허가서 1년 이상 보관 ((e)(6))', 'Cancelled permits kept at least 1 year ((e)(6))')],
      [X('감시·구조', 'Attendant and rescue'), X('감시인 외부 배치, 이상 시 소방관서 신고 (제623조), 구출자 공기호흡기·송기마스크 (제643조)', 'Attendant outside who reports to the fire service (Art. 623); rescuers wear SCBA or airline respirators (Art. 643)'), X('감시인 의무 ((i)), 구조 훈련 12개월마다 1회 이상 ((k)(2)(iv))', 'Attendant duties ((i)); rescue practice at least every 12 months ((k)(2)(iv))')]
    ] },
    { id: 'loto', t: X('에너지 차단 (LOTO)', 'Energy isolation (LOTO)'), kr: ['lawStd'], us: ['osha147'], rows: [
      [X('근거', 'Basis'), X('정비 시 운전정지·기동장치 잠금·열쇠 별도 관리 또는 표지판 (제92조), 전로 차단 절차 (제319조)', 'Stop machines for maintenance, lock the start control and keep the key or post a sign (Art. 92); circuit isolation (Art. 319)'), X('에너지 통제 프로그램과 설비별 절차 ((c)(1)·(4))', 'Energy-control programme and machine-specific procedures ((c)(1), (4))')],
      [X('순서', 'Sequence'), X('도면으로 전원 확인 → 차단·단로기 개방 → 잠금·꼬리표 → 잔류전하 방전 → 검전 → 필요 시 단락접지 (제319조②)', 'Confirm sources on drawings → open breakers and disconnectors → lock and tag → discharge → prove dead → earth if needed (Art. 319(2))'), X('준비 → 정지 → 격리 → 잠금·표지 → 축적 에너지 해소 → 격리 확인 ((d))', 'Prepare → shut down → isolate → lock/tag → relieve stored energy → verify isolation ((d))')],
      [X('해제', 'Removal'), X('잠금장치·꼬리표는 설치한 근로자가 직접 철거 (제319조③3)', 'Locks and tags removed by the worker who fitted them (Art. 319(3)3)'), X('설치한 작업자가 해제, 부재 시 사업주 확인 등 예외 절차 ((e)(3))', 'Removed by whoever applied them; strict exception procedure if absent ((e)(3))')],
      [X('정기 점검', 'Periodic inspection'), X('제92조·제319조에는 점검 주기 규정이 없음 — 사업장 절차로 관리', 'No inspection interval in Arts. 92 or 319 — set by site procedure'), X('절차 점검을 연 1회 이상, 해당 절차를 쓰지 않는 다른 권한자가 수행 ((c)(6)(i))', 'Procedures inspected at least yearly by another authorised employee ((c)(6)(i))')],
      [X('교육', 'Training'), X('75V 이상 정전·활선작업은 특별교육 (시행규칙 별표5 제17호)', 'Special training for de-energised and live work at 75 V or more (Rule Annex 5 item 17)'), X('교육과 재교육 ((c)(7))', 'Training and retraining ((c)(7))')]
    ] },
    { id: 'hot', t: X('화기작업', 'Hot work'), kr: ['lawStd', 'moelPsm'], us: ['osha252', 'osha119'], rows: [
      [X('화재감시자 배치', 'Fire watch'), X('작업반경 11m 이내 건물 구조·내부에 가연물, 11m 밖이라도 불꽃으로 쉽게 발화, 금속 칸막이·벽 반대편 가연물 중 하나 (제241조의2①)', 'Combustibles within 11 m in the structure or contents; beyond 11 m but easily ignited; or against the far side of metal partitions (Art. 241-2(1))'), X('작업 지점에서 35피트(10.7m) 이내 가연물, 35피트 밖이라도 불꽃으로 쉽게 발화, 개구부 너머 가연물, 금속 칸막이 반대편 가연물 ((a)(2)(iii)(A))', 'Combustibles within 35 ft (10.7 m); beyond but easily ignited; exposed through openings; or against the far side of metal partitions ((a)(2)(iii)(A))')],
      [X('작업 후 감시', 'After the job'), X('안전보건규칙 제241조·제241조의2에는 작업 후 감시 시간 규정이 없음', 'Arts. 241 and 241-2 set no watch period after the job'), X('작업 종료 후 최소 30분 감시 ((a)(2)(iii)(B))', 'Watch at least 30 minutes after the job ((a)(2)(iii)(B))')],
      [X('허가·게시', 'Permit and posting'), X('작업 전 작업내용·일시·안전점검·조치사항 서면 게시 (제241조④), PSM 사업장은 안전작업허가 (고시 제46조)', 'Written posting of task, time, checks and measures (Art. 241(4)); permits at PSM sites (Notice Art. 46)'), X('작업 전 책임자가 현장을 점검하고 허가 — 서면 허가 권장 ((a)(2)(iv)), PSM 공정은 화기작업 허가 의무 (1910.119(k))', 'The responsible person inspects the area and authorises the work — preferably by written permit ((a)(2)(iv)); a hot-work permit is mandatory on PSM processes (1910.119(k))')],
      [X('감시자 장비', 'Fire-watch kit'), X('확성기·휴대용 조명·화재 대피용 마스크 지급 (제241조의2③)', 'Loudhailer, portable light and escape mask (Art. 241-2(3))'), X('소화 장비를 곁에 두고 사용법·경보 방법 숙지 ((a)(2)(iii)(B))', 'Extinguishing equipment at hand; trained in its use and in raising the alarm ((a)(2)(iii)(B))')]
    ] },
    { id: 'resp', t: X('호흡보호구', 'Respiratory protection'), kr: ['lawStd', 'moelPpe'], us: ['oshaResp'], rows: [
      [X('프로그램', 'Programme'), X('분진 노출기준 초과 사업장 등은 호흡기보호 프로그램 (제616조)', 'Respiratory programme where dust exceeds limits, etc. (Art. 616)'), X('호흡보호구가 필요한 모든 작업장에 서면 프로그램 ((c)(1))', 'A written programme wherever respirators are needed ((c)(1))')],
      [X('밀착도 검사', 'Fit testing'), X('제450조·제616조·제617조에는 밀착도 검사 주기 규정이 없음', 'Arts. 450, 616 and 617 set no fit-test interval'), X('최초 사용 전, 면체 변경 시, 이후 연 1회 이상 ((f)(2))', 'Before first use, when the facepiece changes, then at least yearly ((f)(2))')],
      [X('의학적 평가', 'Medical evaluation'), X('제450조·제616조·제617조에는 착용 전 의학적 평가 규정이 없음', 'Arts. 450, 616 and 617 require no medical evaluation before use'), X('밀착도 검사·착용 전 의학적 평가 ((e)(1))', 'Medical evaluation before fit testing or use ((e)(1))')],
      [X('선정 기준', 'Selection'), X('보호구 안전인증 고시의 방진·방독 등급·사용장소(산소 18% 이상에서 방독마스크)', 'Classes and uses in the PPE certification notice (gas masks only where O₂ ≥ 18 %)'), X('할당보호계수(APF)·최대사용농도(MUC) ((d)(3))', 'Assigned protection factors and maximum use concentration ((d)(3))')]
    ] }
  ];

  S.pages.bench = {
    render(sub) {
      /* #bench/<주제>로 들어오면 비교 탭을 연다 (탭 클릭에 의한 재렌더 때는 사용자의 선택 유지) */
      if (!S.state.refreshing && CMP.some((c) => c.id === sub)) S.save('tab.bench', 'reg');
      const tab = S.tab('bench', 'peer');
      return `
      ${ui.head(T('벤치마킹', 'Benchmarks'), T('타사·해외 사례에서 가져온 것', 'What the portal borrows from others'),
        T('회사가 공개한 공식 페이지와 해외 규제기관 자료만 사용했습니다. 사례 탭은 포털에 반영한 점을, 규제 비교 탭은 한국 법령과 미국 OSHA 표준의 조항별 차이를 보여 줍니다.', 'Only official company pages and foreign regulators are used. The cases tab shows what the portal takes from each; the regulation tab compares Korean law with US OSHA standards clause by clause.'))}
      ${ui.tabs('bench', [{ id: 'peer', label: T('타사·해외 사례', 'Peer and overseas cases') }, { id: 'reg', label: T('한·미 규제 비교', 'Korea–US regulation') }], tab)}
      ${tab === 'reg' ? `
        <div class="callout small">${T('원문을 확인한 조항만 비교했습니다. 한쪽이 더 엄격하다고 단정하기보다, 사내 기준을 정할 때 두 기준 중 더 보호적인 쪽을 고르는 참고로 쓰세요. “규정이 없음”은 인용한 조문에 없다는 뜻입니다.', 'Only clauses read in the original are compared. Rather than declaring one side stricter, use this to pick the more protective of the two when setting in-house rules. “No provision” means none in the articles cited.')}</div>
        <nav class="row">${CMP.map((c) => `<a class="chip" href="#bench/${c.id}">${esc(L(c.t))}</a>`).join('')}</nav>
        ${CMP.map((c) => `<section class="panel" id="anchor-${c.id}">${ui.title(esc(L(c.t)), `${T('한국', 'Korea')} ${S.cite(c.kr)} · ${T('미국', 'US')} ${S.cite(c.us)}`)}
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('항목', 'Item')}</th><th>${T('한국 (조문)', 'Korea (article)')}</th><th>${T('미국 OSHA (조항)', 'US OSHA (paragraph)')}</th></tr></thead><tbody>
            ${c.rows.map(([k, kr, us]) => `<tr><td><b>${esc(L(k))}</b></td><td class="small">${esc(L(kr))}</td><td class="small">${esc(L(us))}</td></tr>`).join('')}
          </tbody></table></div>${c.note ? `<p class="xs muted" style="margin-top:6px">${esc(L(c.note))}</p>` : ''}</section>`).join('')}
        <p class="xs muted">${T('포털 반영: 작업허가서에 C-C-49 모니터링·절차 평가(OSHA PSM 준수감사와 같은 방향), 밀폐공간 SOP에 E-G-18 환기량·2년 평가, 판정 도구에 한·미 기준 병기.', 'Applied here: C-C-49 monitoring and system audit in the permit tool (in line with the OSHA PSM compliance audit), E-G-18 ventilation and two-yearly review in the confined-space SOP, and Korean and US criteria side by side in the checkers.')}</p>`
      : `<section class="grid g3">${BENCH.map((b) => `<div class="panel stack">
        <h3 style="font-size:16px">${typeof b.who === 'string' ? b.who : L(b.who)}${S.cite(b.src)}</h3>
        <ul class="facts">${L(b.facts).map((f) => `<li>${f}</li>`).join('')}</ul>
        <div class="callout ok small"><b>${T('포털 반영', 'Applied here')}</b> — ${L(b.take)}</div>
      </div>`).join('')}</section>`}`;
    }
  };
  S.BENCH_CMP = CMP;

  const TYPE = { sk: { ko: 'SK하이닉스 공식', en: 'SK hynix official' }, law: { ko: '법령·고시', en: 'Statute / notice' }, gov: { ko: '공공기관', en: 'Public agency' }, court: { ko: '법원', en: 'Court' }, intl: { ko: '해외·국제 기관', en: 'Foreign / international body' }, peer: { ko: '타사 공식', en: 'Peer company' }, press: { ko: '언론', en: 'Press' } };

  S.pages.sources = {
    render(sub) {
      return `
      ${ui.head(T('출처·검증', 'Sources & verification'), T('이 포털의 근거', 'Evidence behind this portal'),
        T('모든 수치와 회사 정보에는 [번호]로 출처를 달았습니다. 확인 방법과 한계도 함께 밝힙니다.', 'Every figure and company fact carries a [number] citation. The method and its limits are stated below.'))}
      <section class="grid g2">
        <div class="callout ok"><b>${T('검증 방법', 'How facts were checked')}</b><br>${T('법령 수치(적정공기·소음·고온·조도·교육시간·도급 주기·소방 점검)는 국가법령정보센터 원문 조문을 직접 확인했고, 화학물질 노출기준은 고시 출력본의 별표 표 이미지와 한 줄씩 대조했습니다. SK하이닉스 정보는 회사 지속가능경영보고서 3개년 원문과 뉴스룸에서만 가져왔습니다.', 'Statutory values (acceptable air, noise, heat, illumination, training hours, subcontract cycles, fire inspections) were read in the original articles on the National Law Information Center; chemical exposure limits were matched line by line against the annex tables of the official notice. SK hynix facts come only from three years of its sustainability reports and its newsroom.')}<br>${T('법령은 매월 아래 ‘법령 변경 점검’으로 현행본과 대조하고, 수정할 때마다 ', 'Laws are compared with the current text every month (see “Law-change check” below), and after every edit the ')}<a href="#qa">${T('포털 자체 점검', 'portal self-check')}</a>${T('으로 전 페이지·한영·화면 폭을 자동 점검합니다.', ' renders every page in both languages at three widths.')}</div>
        <div class="callout warn"><b>${T('한계', 'Limits')}</b><br>${T('SOP는 SK하이닉스 사내 절차가 아니라 공개 법령·지침으로 재구성한 교육용 예시입니다. KOSHA GUIDE는 법적 강제 기준이 아닌 기술적 권고이며, 수치·절 번호를 옮긴 지침(안전작업허가·가스감지경보기·혼합가스·세안설비·밀폐공간 등)은 원문 PDF로 확인했고 나머지는 번호·명칭·공표일을 확인했습니다. 법령은 개정될 수 있으므로 실제 적용 전 최신본을 확인해야 합니다. 언론 출처는 회사 공식 자료로 확인되지 않는 경우에만 보조로 썼습니다.', 'SOPs are teaching examples rebuilt from public law and guidance, not SK hynix internal procedures. KOSHA Guides are technical recommendations, not binding law; guides whose values or clause numbers are quoted (permits, gas detectors, gas mixtures, eyewash, confined spaces and others) were read in the original PDF, and the rest were checked for number, title and date. Laws change, so confirm the current text before real use. Press sources are used only as a supplement where no official source exists.')}</div>
      </section>
      <section class="panel stack" id="anchor-lawcheck">${ui.title(T('법령 변경 점검 (월 1회)', 'Law-change check (monthly)'), T(`포털 기준일 ${S.LAW_ASOF}`, `Portal as of ${S.LAW_ASOF}`))}
        ${(() => {
          const G = { law: T('법령', 'Statute'), adm: T('고시·예규', 'Notice'), code: T('기술기준', 'Code') };
          const src = (id) => S.SOURCES.find((s) => s.id === id) || {};
          const lc = lawLog(), last = lc.log[0];
          const ago = last ? S.daysBetween(new Date(last.at + 'T00:00:00'), S.today()) : null;
          return `<p class="small">${T('인용한 법령이 바뀌면 판정 기준·주기·조문 번호가 함께 바뀝니다. 매월 한 번 아래 순서로 점검하고 기록을 남기세요. 표의 ‘포털 기준’은 포털이 대조한 판(版)입니다.', 'When a cited law changes, thresholds, intervals and article numbers change with it. Check monthly in the order below and keep a record. “Portal version” is the edition the portal was checked against.')}</p>
          <ol class="proc p5">${[
            T('‘현행 확인’을 눌러 국가법령정보센터 제목 옆 [시행 …] [… 제○호]가 ‘포털 기준’과 같은지 봅니다.', 'Open “Current text” and compare the [in force …] [No. …] line on the National Law Information Center with “Portal version”.'),
            T('다르면 화면 위 ‘신구법비교’로 바뀐 조문을 보고, 포털 검색에 조문 번호를 넣어 인용한 곳을 찾아 고칩니다.', 'If it differs, use “old vs new” on that page, then search the portal for the article number and fix every place that cites it.'),
            T('공포됐지만 아직 시행 전인 개정은 부칙의 시행일로 확인해 ‘시행 예정·유의’와 최신 안전 동향에 예고합니다.', 'For amendments promulgated but not yet in force, read the effective date in the addendum and flag it here and in the news.'),
            T('고용노동부 보도자료, 산업안전포털 KOSHA GUIDE 목록(공표일), KGS 코드 목록(승인일)도 봅니다.', 'Also scan MOEL press releases, the KOSHA Guide list (publication dates) and the KGS code list (approval dates).'),
            T('출처의 확인일과 동향 기준일을 고치고, 아래에서 이달 점검을 기록합니다.', 'Update the sources’ checked dates and the news date, then record this month’s check below.')
          ].map((s, i) => `<li><span class="no">${i + 1}</span>${s}</li>`).join('')}</ol>
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('구분', 'Type')}</th><th>${T('법령·기준', 'Law / code')}</th><th>${T('포털 기준', 'Portal version')}</th><th>${T('시행 예정·유의', 'Upcoming / notes')}</th><th>${T('원문', 'Source')}</th></tr></thead><tbody>
            ${S.LAWCHECK.map((r) => { const s = src(r.id); return `<tr><td class="nowrap small">${G[r.g]}</td><td class="small" style="min-width:9.5em;word-break:keep-all"><b>${esc(L(r.n))}</b></td><td class="small" style="min-width:10em">${esc(L(r.v))}</td><td class="small">${r.next ? esc(L(r.next)) : '<span class="muted">–</span>'}</td>
              <td class="nowrap small">${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${T('현행 확인', 'Current text')} ↗</a>` : ''}${r.id === 'koshaGuide' ? ` · <a href="#sources/kosha">${T('대조표', 'Table')}</a>` : ''}<br><span class="xs muted">${T('확인', 'Checked')} ${esc(s.checked || '')}</span></td></tr>`; }).join('')}
          </tbody></table></div>
          <div class="grid g2">
            <div class="stack">
              <b class="small">${T('이달 점검 기록', 'Record this month’s check')}</b>
              <div class="form-grid">
                <div class="field"><label for="lc-at">${T('점검일', 'Date')}</label><input type="date" id="lc-at" value="${S.iso(S.today())}"></div>
                <div class="field"><label for="lc-by">${T('점검자', 'Checked by')}</label><input type="text" id="lc-by" value="${esc(lc.by || '')}"></div>
              </div>
              <div class="field"><label for="lc-note">${T('바뀐 법령과 조치 (없으면 ‘변경 없음’)', 'Changes found and action taken (or “no change”)')}</label><textarea id="lc-note"></textarea></div>
              <div class="row"><button class="btn sm" type="button" id="lc-save">${T('점검 기록 저장', 'Save check')}</button>${S.printLink('lawcheck', T('점검표 인쇄', 'Print checklist'))}</div>
            </div>
            <div class="stack">
              <b class="small">${T('점검 기록', 'Check log')} ${last ? `<span class="xs muted">· ${T(`마지막 ${ago}일 전`, `last ${ago} days ago`)}</span>` : ''}</b>
              ${lc.log.length ? `<ul class="clean small">${lc.log.slice(0, 6).map((x, i) => `<li><span class="num">${esc(x.at)}</span> · ${esc(x.by || '–')} — ${esc(x.note || '')} <button class="btn ghost sm" type="button" data-lc-del="${i}" aria-label="${T('삭제', 'Delete')}">×</button></li>`).join('')}</ul>` : `<p class="small muted">${T('아직 기록이 없습니다. 포털 작성자의 최근 점검: ', 'No checks recorded in this browser yet. The portal author’s latest check: ')}${S.LAW_ASOF}</p>`}
              <p class="xs muted">${T('기록은 이 브라우저에만 저장되며 백업 파일에 함께 들어갑니다. 한 번 기록하면 31일이 지났을 때 업무판에 알림이 뜹니다.', 'Records stay in this browser and are included in backups. Once you have recorded a check, the dashboard reminds you after 31 days.')}</p>
            </div>
          </div>`;
        })()}
      </section>
      <section class="panel" id="anchor-kosha">${ui.title(T('KOSHA GUIDE 현행화 대조표', 'KOSHA GUIDE currency check'), T('2026-09-25 산업안전포털 목록·원문 PDF와 대조', 'Checked against the KOSHA portal list and PDFs, 2026-09-25'))}
        <p class="small">${T('2026.1.30 정비(437건: 제정 11·개정 164·폐지 262)로 많은 지침의 번호가 바뀌었습니다. 포털은 현행 번호로 적고, 번호를 누르면 공단 원문 PDF가 열립니다. 구 번호는 “구 ○○”로 함께 표시합니다.', 'The 2026-01-30 overhaul (437 guides: 11 new, 164 revised, 262 withdrawn) renumbered many guides. The portal uses current numbers; each number opens KOSHA’s PDF, and former numbers are shown as “formerly …”.')}${S.cite('koshaGuide', 'moelKosha2026')}</p>
        ${(() => {
          const REL = { succ: T('새 번호로 개정', 'Revised under a new number'), merge: T('통폐합', 'Merged'), topic: T('구 지침 폐지 — 같은 주제의 현행 지침', 'Old guide withdrawn — current guide on the same topic') };
          const rows = Object.keys(S.KOSHA).map((k) => Object.assign({ id: k }, S.KOSHA[k])).sort((a, b) => (a.rel ? 0 : 1) - (b.rel ? 0 : 1) || a.id.localeCompare(b.id));
          const changed = rows.filter((r) => r.rel).length;
          return `<p class="xs muted">${T(`인용 지침 ${rows.length}건 · 번호 변경·폐지 ${changed}건 · 변경 없음 ${rows.length - changed}건`, `${rows.length} guides cited · ${changed} renumbered or withdrawn · ${rows.length - changed} unchanged`)}</p>
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('현행 번호', 'Current no.')}</th><th>${T('명칭', 'Title')}</th><th class="n">${T('공표일', 'Published')}</th><th>${T('이전 번호·관계', 'Former no. / change')}</th></tr></thead><tbody>
            ${rows.map((r) => `<tr><td class="nowrap">${S.koshaTag(r.id)}</td><td class="small">${esc(L(r))}</td><td class="num nowrap">${esc(r.d || '')}</td><td class="small">${r.old ? `${esc([].concat(r.old).join(', '))} — ${esc(REL[r.rel] || '')}` : `<span class="muted">${T('변경 없음', 'Unchanged')}</span>`}</td></tr>`).join('')}
          </tbody></table></div>`;
        })()}
      </section>
      <p class="small">${T('업무에 자주 쓰는 공식 사이트는 ', 'The official sites most useful day to day are curated in the ')}<a href="#resources">${T('안전 정보 자료실', 'resource library')}</a>${T('에 가나다·유형·주제별로 따로 정리했습니다.', ', by name, type and subject.')}</p>
      <section class="panel"><div class="table-wrap"><table class="data">
        <thead><tr><th>#</th><th>${T('출처', 'Source')}</th><th>${T('유형', 'Type')}</th><th>${T('확인일', 'Checked')}</th></tr></thead>
        <tbody>${S.SOURCES.map((s, i) => `<tr id="anchor-${s.id}" ${sub === s.id ? 'style="background:var(--accent-bg)"' : ''}><td class="n">${i + 1}</td>
          <td><a href="${s.url}" target="_blank" rel="noopener">${L(s.title)}</a>${s.note ? `<div class="xs muted">${L(s.note)}</div>` : ''}</td>
          <td><span class="chip">${L(TYPE[s.type])}</span></td><td class="n">${s.checked}</td></tr>`).join('')}</tbody>
      </table></div></section>`;
    },
    mount(root) {
      const sv = root.querySelector('#lc-save');
      if (sv) sv.addEventListener('click', () => {
        const at = root.querySelector('#lc-at').value, by = root.querySelector('#lc-by').value.trim(), note = root.querySelector('#lc-note').value.trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(at)) { S.toast(T('점검일을 넣으세요', 'Enter the date')); return; }
        if (!note) { S.toast(T('바뀐 법령과 조치를 적으세요 (없으면 ‘변경 없음’)', 'Describe the changes (or “no change”)')); return; }
        const lc = lawLog();
        lc.log = [{ at, by, note }].concat(lc.log).sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 24);
        lc.by = by;
        S.save('lawchk', lc); S.refresh();
        S.toast(T('법령 변경 점검을 기록했습니다', 'Law-change check recorded'));
      });
      root.querySelectorAll('[data-lc-del]').forEach((b) => b.addEventListener('click', () => {
        if (!window.confirm(T('이 점검 기록을 지울까요?', 'Delete this check record?'))) return;
        const lc = lawLog(); lc.log.splice(Number(b.dataset.lcDel), 1); S.save('lawchk', lc); S.refresh();
      }));
    }
  };

  /* 법령 변경 점검 기록 { by, log: [{ at, by, note }] } — 최신이 앞 */
  function lawLog() {
    const v = S.load('lawchk', null);
    return v && Array.isArray(v.log) ? { by: typeof v.by === 'string' ? v.by : '', log: v.log.filter((x) => x && typeof x.at === 'string') } : { by: '', log: [] };
  }
  S.lawLog = lawLog;
})();

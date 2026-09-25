/* 위험성평가 워크벤치 — 고시 제7조 4개 기법 + 시행규칙 제50조 PSM 기법 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui;
  const n = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));

  /* SK하이닉스 공개 작업 위험성평가 수준표 (2026 지속가능경영보고서 p.56) */
  S.skGrade = function (r) {
    if (r == null) return null;
    if (r <= 3) return { g: 'C', band: '1–3', acc: T('허용 가능', 'Acceptable'), act: T('현재의 안전대책 유지 — 현 상태로 계속 작업 가능', 'Keep current measures — work may continue as is') };
    if (r <= 6) return { g: 'C', band: '4–6', acc: T('허용 가능', 'Acceptable'), act: T('안전 정보 및 주기적 표준 작업 안전 교육 제공 필요', 'Provide safety information and periodic standard-work training') };
    if (r <= 10) return { g: 'B', band: '8–10', acc: T('허용 불가', 'Not acceptable'), act: T('계획된 정비·보수기간에 감소 대책 수립 — 조건부 작업 허용', 'Plan reduction measures for the scheduled maintenance window — conditional work') };
    if (r <= 15) return { g: 'B', band: '12–15', acc: T('허용 불가', 'Not acceptable'), act: T('긴급 임시 안전대책 후 작업, 계획된 정비·보수기간에 안전대책 수립', 'Work only after urgent interim measures; fix permanently in the maintenance window') };
    return { g: 'A', band: '16–20', acc: T('허용 불가', 'Not acceptable'), act: T('즉시 작업 중지 — 작업을 계속하려면 즉시 개선', 'Stop work now — improve immediately to continue') };
  };

  const LIKE = [
    { v: 1, ko: '1 최하 — 거의 없음', en: '1 Rare — almost never' },
    { v: 2, ko: '2 하 — 드물게 발생 가능', en: '2 Unlikely — could happen rarely' },
    { v: 3, ko: '3 중 — 가끔 발생 가능', en: '3 Possible — happens occasionally' },
    { v: 4, ko: '4 상 — 자주 발생 가능', en: '4 Likely — happens often' },
    { v: 5, ko: '5 최상 — 상시 발생 가능', en: '5 Almost certain — can happen any time' }
  ];
  const SEV = [
    { v: 1, ko: '1 소 — 치료 불필요', en: '1 Minor — no treatment' },
    { v: 2, ko: '2 중 — 치료 필요, 휴업 없음', en: '2 Moderate — treatment, no lost time' },
    { v: 3, ko: '3 대 — 휴업 필요 부상·질병', en: '3 Major — lost-time injury or illness' },
    { v: 4, ko: '4 최대 — 사망·영구장해', en: '4 Critical — death or permanent disability' }
  ];
  const TYPES = [
    ['fall', { ko: '추락', en: 'Fall from height' }], ['caught', { ko: '끼임', en: 'Caught-in' }], ['struck', { ko: '부딪힘', en: 'Struck-by' }],
    ['leak', { ko: '가스·화학물질 누출', en: 'Gas/chemical leak' }], ['contact', { ko: '화학물질 접촉', en: 'Chemical contact' }], ['shock', { ko: '감전', en: 'Electric shock' }],
    ['fire', { ko: '화재·폭발', en: 'Fire/explosion' }], ['burn', { ko: '화상', en: 'Burn' }], ['rad', { ko: '방사선', en: 'Radiation' }],
    ['collapse', { ko: '무너짐', en: 'Collapse' }], ['slip', { ko: '넘어짐', en: 'Slip/trip' }], ['other', { ko: '기타', en: 'Other' }]
  ];
  const FOCUS_TYPES = ['fall', 'caught', 'struck', 'leak', 'contact'];
  const lvOpts = (arr) => arr.map((x) => [x.v, L(x)]);
  const typeOpts = () => TYPES.map(([v, l]) => [v, L(l)]);
  const GUIDE = [['no', { ko: '없음 (No/None)', en: 'No / None' }], ['more', { ko: '증가 (More)', en: 'More' }], ['less', { ko: '감소 (Less)', en: 'Less' }], ['aswell', { ko: '부가 (As well as)', en: 'As well as' }], ['partof', { ko: '부분 (Part of)', en: 'Part of' }], ['reverse', { ko: '반대 (Reverse)', en: 'Reverse' }], ['other', { ko: '기타 (Other than)', en: 'Other than' }], ['early', { ko: '이른 (Early)', en: 'Early' }], ['late', { ko: '늦은 (Late)', en: 'Late' }], ['before', { ko: '전 (Before)', en: 'Before' }], ['after', { ko: '후 (After)', en: 'After' }]];
  const PARAM = [['flow', { ko: '유량', en: 'Flow' }], ['press', { ko: '압력', en: 'Pressure' }], ['temp', { ko: '온도', en: 'Temperature' }], ['level', { ko: '레벨', en: 'Level' }], ['comp', { ko: '조성·농도', en: 'Composition' }], ['react', { ko: '반응', en: 'Reaction' }], ['seq', { ko: '순서·시간', en: 'Sequence / time' }]];
  const labelOf = (list, v) => { const f = list.find(([k]) => k === v); return f ? L(f[1]) : ''; };
  const three = () => [['H', T('상 (고)', 'High')], ['M', T('중', 'Medium')], ['Lo', T('하 (저)', 'Low')]];
  const judge3 = () => [['ok', T('적합', 'Compliant')], ['ng', T('부적합', 'Non-compliant')], ['na', T('해당 없음', 'N/A')]];

  /* ---------- method definitions ---------- */
  const M = {
    fs: {
      name: () => T('빈도·강도법', 'Frequency–severity'), basis: 'moelRa', kosha: 'C-C-67-2026',
      desc: () => T('가능성(1–5)×중대성(1–4)으로 위험도를 곱해 SK하이닉스가 공개한 수준표(1–20점, A·B·C 등급)로 판정합니다.', 'Multiplies likelihood (1–5) by severity (1–4) and grades with the level table SK hynix has published (1–20, grades A/B/C).'),
      cols: () => [
        { k: 'task', l: T('단위작업', 'Unit task'), t: 'text', w: 130 },
        { k: 'haz', l: T('유해·위험요인', 'Hazard'), t: 'area', w: 170 },
        { k: 'type', l: T('재해유형', 'Accident type'), t: 'sel', o: typeOpts(), w: 120 },
        { k: 'now', l: T('현재 안전대책', 'Current controls'), t: 'area', w: 150 },
        { k: 'l', l: T('가능성', 'Likelihood'), t: 'sel', o: lvOpts(LIKE), w: 90, short: true },
        { k: 's', l: T('중대성', 'Severity'), t: 'sel', o: lvOpts(SEV), w: 90, short: true },
        { k: 'r', l: T('위험도', 'Risk'), t: 'calc', f: (r) => { const v = n(r.l) * n(r.s); return v ? `<b>${v}</b>` : '–'; } },
        { k: 'g', l: T('등급', 'Grade'), t: 'calc', f: (r) => { const g = S.skGrade(n(r.l) * n(r.s) || null); return g ? `<span class="grade ${g.g}" title="${S.esc(g.act)}">${g.g}</span>` : '–'; } },
        { k: 'focus', l: T('집중관리', 'Focus'), t: 'calc', f: (r) => { const v = n(r.l) * n(r.s); return v && (v >= 8 || (v >= 6 && FOCUS_TYPES.includes(r.type))) ? ui.pill('warn', T('대상', 'Yes')) : ''; } },
        { k: 'fix', l: T('감소대책', 'Reduction measures'), t: 'area', w: 170 },
        { k: 'l2', l: T('개선 후 가능성', 'Residual L'), t: 'sel', o: lvOpts(LIKE), w: 90, short: true },
        { k: 's2', l: T('개선 후 중대성', 'Residual S'), t: 'sel', o: lvOpts(SEV), w: 90, short: true },
        { k: 'r2', l: T('개선 후', 'Residual'), t: 'calc', f: (r) => { const v = n(r.l2) * n(r.s2); const g = S.skGrade(v || null); return v ? `<b>${v}</b> <span class="grade ${g.g}">${g.g}</span>` : '–'; } },
        { k: 'own', l: T('담당·기한', 'Owner / due'), t: 'text', w: 110 }
      ],
      sample: () => [
        { task: T('가스 캐비닛 실린더 교체', 'Gas-cabinet cylinder change'), haz: T('연결부 퍼지 불충분 시 독성가스 방출', 'Toxic gas release if the pigtail is not fully purged'), type: 'leak', now: T('자동 차단 감지기, 캐비닛 배기', 'Auto shut-off detectors, cabinet exhaust'), l: 2, s: 4, fix: T('퍼지 횟수 인터록, 교체 전 2인 확인', 'Purge-count interlock, two-person check'), l2: 1, s2: 4, own: T('예방안전 / 10월', 'Prevention / Oct') },
        { task: T('OHT 레일 상부 점검', 'Inspection above OHT rail'), haz: T('안전대 체결점 부족으로 추락', 'Fall due to lack of anchor points'), type: 'fall', now: T('고소작업대 사용', 'Aerial platform'), l: 3, s: 4, fix: T('수평 구명줄 설치, 반송 정지 구간 잠금', 'Horizontal lifeline; lock the transport stop zone'), l2: 1, s2: 4, own: T('설비 / 11월', 'Facilities / Nov') },
        { task: T('펌프 분해 정비', 'Pump teardown'), haz: T('고온 표면 접촉', 'Contact with hot surfaces'), type: 'burn', now: T('냉각 대기', 'Cool-down wait'), l: 2, s: 2, fix: T('표면온도 확인 절차 추가', 'Add surface-temperature check'), l2: 1, s2: 2, own: T('설비 / 10월', 'Facilities / Oct') },
        { task: T('케미컬 탱크로리 하역', 'Chemical tanker unloading'), haz: T('호스 분리 시 잔액 비산으로 피부·눈 접촉', 'Splash on disconnect — skin/eye contact'), type: 'contact', now: T('보안면·내화학 장갑', 'Face shield, chemical gloves'), l: 3, s: 2, fix: T('드레인 후 분리, 비산 방지 커버', 'Drain before disconnect; splash cover'), l2: 1, s2: 2, own: T('인프라 / 10월', 'Infra / Oct') },
        { task: T('이온주입기 PM', 'Ion implanter PM'), haz: T('차폐 패널 미복구 상태 가동 시 X선 노출', 'X-ray exposure if run with shield panels off'), type: 'rad', now: T('인터록', 'Interlocks'), l: 2, s: 4, fix: T('복구 체크리스트 + 인터록 시험 기록', 'Reassembly checklist + interlock test record'), l2: 1, s2: 4, own: T('장비 / 11월', 'Equipment / Nov') },
        { task: T('밀폐 피트 청소', 'Sump pit cleaning'), haz: T('질소 퍼지 잔류로 산소결핍', 'Oxygen deficiency from residual N₂ purge'), type: 'other', now: T('작업 전 측정', 'Pre-entry test'), l: 3, s: 4, fix: T('연속 측정기, 송풍 환기, 감시인 상주', 'Continuous monitor, forced ventilation, attendant'), l2: 1, s2: 4, own: T('인프라 / 즉시', 'Infra / Now') }
      ],
      summary: (rows) => fsSummary(rows)
    },
    three: {
      name: () => T('위험성수준 3단계 판단법', 'Three-level judgment'), basis: 'moelRa',
      desc: () => T('위험성 수준을 상·중·하(고·중·저)로 직관적으로 구분합니다. 소규모·단순 작업에 적합합니다.', 'Rates risk intuitively as high, medium or low — suited to small or simple jobs.'),
      cols: () => [
        { k: 'task', l: T('단위작업', 'Unit task'), t: 'text', w: 140 }, { k: 'haz', l: T('유해·위험요인', 'Hazard'), t: 'area', w: 190 },
        { k: 'now', l: T('현재 조치', 'Current controls'), t: 'area', w: 160 }, { k: 'lv', l: T('수준', 'Level'), t: 'sel', o: three(), w: 90 },
        { k: 'act', l: T('권장 대응', 'Suggested action'), t: 'calc', f: (r) => r.lv === 'H' ? ui.pill('bad', T('즉시 개선', 'Fix now')) : r.lv === 'M' ? ui.pill('warn', T('계획적 개선', 'Planned fix')) : r.lv === 'Lo' ? ui.pill('ok', T('현 상태 유지·교육', 'Maintain, train')) : '–' },
        { k: 'fix', l: T('감소대책', 'Measures'), t: 'area', w: 170 }, { k: 'own', l: T('담당·기한', 'Owner / due'), t: 'text', w: 110 }
      ],
      sample: () => [
        { task: T('사무실 전선 정리', 'Office cable tidy'), haz: T('통로 전선에 걸려 넘어짐', 'Trip on cables in walkway'), now: T('없음', 'None'), lv: 'M', fix: T('케이블 덕트 설치', 'Install cable ducts'), own: T('총무 / 10월', 'Admin / Oct') },
        { task: T('박스 적재', 'Box stacking'), haz: T('상단 박스 낙하', 'Top box falls'), now: T('적재 높이 표시', 'Height marks'), lv: 'Lo', fix: T('교육 유지', 'Keep training'), own: T('물류', 'Logistics') }
      ],
      summary: (rows) => countSummary(rows, 'lv', three())
    },
    check: {
      name: () => T('체크리스트법', 'Checklist'), basis: 'moelRa', kosha: 'C-C-36-2026', checklist: true,
      desc: () => T('미리 준비한 점검 목록으로 적합·부적합을 판단합니다. SOP 라이브러리의 절차 항목을 체크리스트로 불러옵니다.', 'Judges compliant / non-compliant against a prepared list. Loads the SOP library steps as checklist items.'),
      cols: () => [
        { k: 'item', l: T('점검 항목', 'Check item'), t: 'area', w: 300 }, { k: 'basis', l: T('근거', 'Basis'), t: 'calc', f: (r) => ui.basis(r.b) },
        { k: 'res', l: T('결과', 'Result'), t: 'sel', o: judge3(), w: 110 }, { k: 'note', l: T('비고·개선', 'Note / action'), t: 'area', w: 200 }
      ],
      sample: () => checklistFrom('hot-work'),
      summary: (rows) => countSummary(rows, 'res', judge3())
    },
    key: {
      name: () => T('핵심요인 기술법', 'Key-factor description'), basis: 'moelRa',
      desc: () => T('핵심 질문에 답하는 서술형 기법입니다: 무엇이 위험한가, 누가 어떻게 다치는가, 지금 무엇을 하고 있나, 무엇을 더 해야 하나.', 'A narrative method answering key questions: what is hazardous, who gets hurt and how, what is done now, what more is needed.'),
      cols: () => [
        { k: 'q1', l: T('유해·위험요인은?', 'What is the hazard?'), t: 'area', w: 180 }, { k: 'q2', l: T('누가, 어떻게 다치나?', 'Who is harmed, how?'), t: 'area', w: 180 },
        { k: 'q3', l: T('현재 조치는?', 'What is done now?'), t: 'area', w: 180 }, { k: 'q4', l: T('추가 조치는?', 'What more is needed?'), t: 'area', w: 180 }, { k: 'own', l: T('담당·기한', 'Owner / due'), t: 'text', w: 110 }
      ],
      sample: () => [{ q1: T('스크러버 정비 시 배기라인 파우더', 'Powder in exhaust lines during scrubber work'), q2: T('협력사 정비원이 분해 중 흡입·피부 접촉', 'Contract technician inhales or touches it while dismantling'), q3: T('방진마스크, 국소배기', 'Dust mask, local exhaust'), q4: T('습식 세정 절차, 호흡보호구 밀착검사, 잔류물 밀폐 용기', 'Wet-cleaning step, respirator fit test, sealed residue containers'), own: T('설비 / 11월', 'Facilities / Nov') }],
      summary: (rows) => `<p class="small">${T(`${rows.length}개 요인 기술됨 · 추가 조치 미기재 ${rows.filter((r) => !r.q4).length}건`, `${rows.length} factors described · ${rows.filter((r) => !r.q4).length} without further action`)}</p>`
    },
    jsa: {
      name: () => T('작업안전분석 (JSA)', 'Job safety analysis (JSA)'), kosha: 'C-C-67-2026', sopImport: true,
      desc: () => T('작업을 단계로 나눠 단계별 위험요인과 대책을 적습니다. SOP 라이브러리의 절차를 불러와 시작할 수 있습니다.', 'Breaks the job into steps with hazards and controls for each. Start from an SOP in the library.'),
      cols: () => [
        { k: 'step', l: T('작업 단계', 'Step'), t: 'area', w: 170 }, { k: 'haz', l: T('위험요인', 'Hazard'), t: 'area', w: 200 },
        { k: 'ctl', l: T('안전대책', 'Controls'), t: 'area', w: 240 }, { k: 'own', l: T('담당', 'Owner'), t: 'text', w: 100 }
      ],
      sample: () => jsaFrom('loto'),
      summary: (rows) => `<p class="small">${T(`${rows.length}단계 · 대책 미기재 ${rows.filter((r) => !r.ctl).length}건`, `${rows.length} steps · ${rows.filter((r) => !r.ctl).length} without controls`)}</p>`
    },
    hazop: {
      name: () => 'HAZOP', basis: 'lawRule', kosha: 'C-C-37-2026',
      desc: () => T('노드별로 파라미터와 가이드워드를 조합해 설계 의도에서 벗어나는 “이탈”을 찾고 원인·결과·안전장치를 검토합니다 (공정위험성평가 기법, 시행규칙 제50조).', 'For each node, combines parameters with guide words to find deviations and reviews causes, consequences and safeguards (a PSM technique under Rule Art. 50).'),
      cols: () => [
        { k: 'node', l: T('노드', 'Node'), t: 'text', w: 120 }, { k: 'p', l: T('파라미터', 'Parameter'), t: 'sel', o: PARAM.map(([v, l]) => [v, L(l)]), w: 100 },
        { k: 'gw', l: T('가이드워드', 'Guide word'), t: 'sel', o: GUIDE.map(([v, l]) => [v, L(l)]), w: 120 },
        { k: 'dev', l: T('이탈', 'Deviation'), t: 'calc', f: (r) => r.p && r.gw ? `${labelOf(PARAM, r.p)} · ${labelOf(GUIDE, r.gw).split(' (')[0]}` : '–' },
        { k: 'cause', l: T('원인', 'Causes'), t: 'area', w: 160 }, { k: 'cons', l: T('결과', 'Consequences'), t: 'area', w: 160 },
        { k: 'safe', l: T('안전장치', 'Safeguards'), t: 'area', w: 150 },
        { k: 's', l: T('중대성', 'S'), t: 'sel', o: lvOpts(SEV), w: 80, short: true }, { k: 'l', l: T('가능성', 'L'), t: 'sel', o: lvOpts(LIKE), w: 80, short: true },
        { k: 'r', l: T('위험도', 'Risk'), t: 'calc', f: (r) => { const v = n(r.l) * n(r.s); const g = S.skGrade(v || null); return v ? `<b>${v}</b> <span class="grade ${g.g}">${g.g}</span>` : '–'; } },
        { k: 'rec', l: T('권고사항', 'Recommendations'), t: 'area', w: 170 }
      ],
      sample: () => [
        { node: T('SiH₄ 가스 캐비닛 → VMB', 'SiH₄ gas cabinet → VMB'), p: 'flow', gw: 'more', cause: T('레귤레이터 고장', 'Regulator failure'), cons: T('하류 과압, 연결부 누출 시 자연발화', 'Downstream over-pressure; pyrophoric release at joints'), safe: T('과류차단밸브, 가스 감지 자동차단', 'Excess-flow valve, detector auto shut-off'), s: 4, l: 2, rec: T('과류차단밸브 작동 시험 주기화', 'Schedule excess-flow valve tests') },
        { node: T('HF 공급 배관', 'HF supply line'), p: 'press', gw: 'less', cause: T('배관 누설', 'Line leak'), cons: T('누출·접촉, 공정 불량', 'Leak and contact; process loss'), safe: T('이중관·누액 감지', 'Double containment, leak sensor'), s: 3, l: 2, rec: T('이중관 누액 감지 경보 점검', 'Check double-containment leak alarm') }
      ],
      summary: (rows) => fsSummary(rows.map((r) => ({ l: r.l, s: r.s })), true)
    },
    whatif: {
      name: () => 'What-if', basis: 'lawRule', kosha: 'C-C-38-2026',
      desc: () => T('“만약 ~라면?” 질문으로 사고 시나리오를 브레인스토밍합니다 (사고예상질문분석, 시행규칙 제50조).', 'Brainstorms accident scenarios with “What if…?” questions (a PSM technique under Rule Art. 50).'),
      cols: () => [
        { k: 'q', l: T('만약 ~라면?', 'What if…?'), t: 'area', w: 200 }, { k: 'cons', l: T('결과', 'Consequence'), t: 'area', w: 180 },
        { k: 'safe', l: T('현재 안전장치', 'Safeguards'), t: 'area', w: 170 },
        { k: 's', l: T('중대성', 'S'), t: 'sel', o: lvOpts(SEV), w: 80, short: true }, { k: 'l', l: T('가능성', 'L'), t: 'sel', o: lvOpts(LIKE), w: 80, short: true },
        { k: 'r', l: T('위험도', 'Risk'), t: 'calc', f: (r) => { const v = n(r.l) * n(r.s); const g = S.skGrade(v || null); return v ? `<b>${v}</b> <span class="grade ${g.g}">${g.g}</span>` : '–'; } },
        { k: 'rec', l: T('권고', 'Recommendation'), t: 'area', w: 170 }
      ],
      sample: () => [
        { q: T('정전으로 배기팬이 멈춘다면?', 'What if a power cut stops the exhaust fans?'), cons: T('가스 캐비닛 음압 상실, 누출 시 확산', 'Cabinets lose negative pressure; leaks spread'), safe: T('비상전원, 저배기 경보', 'Emergency power, low-exhaust alarm'), s: 4, l: 2, rec: T('비상전원 절체 시험 분기 1회', 'Quarterly emergency-power transfer test') },
        { q: T('협력사가 다른 약품 포트에 접속한다면?', 'What if a contractor connects to the wrong chemical port?'), cons: T('이종 약품 혼합 반응', 'Incompatible mixing reaction'), safe: T('포트 형상 구분', 'Keyed port shapes'), s: 3, l: 2, rec: T('2인 확인 + 바코드 대조', 'Two-person check + barcode match') }
      ],
      summary: (rows) => fsSummary(rows.map((r) => ({ l: r.l, s: r.s })), true)
    },
    fmea: {
      name: () => T('FMEA / 이상위험도 분석', 'FMEA / FMECA'), basis: 'lawRule', kosha: 'C-C-40-2026', rpn: true,
      desc: () => T('부품·기능별 고장모드의 심각도(S)·발생도(O)·검출도(D)를 1–10으로 매겨 RPN=S×O×D로 우선순위를 정합니다.', 'Rates severity, occurrence and detection (1–10) for each failure mode and ranks by RPN = S × O × D.'),
      cols: () => [
        { k: 'item', l: T('항목·기능', 'Item / function'), t: 'text', w: 140 }, { k: 'mode', l: T('고장모드', 'Failure mode'), t: 'area', w: 150 },
        { k: 'eff', l: T('영향', 'Effect'), t: 'area', w: 150 }, { k: 'cause', l: T('원인', 'Cause'), t: 'area', w: 140 }, { k: 'ctl', l: T('현재 관리', 'Current control'), t: 'area', w: 130 },
        { k: 's', l: 'S', t: 'num', w: 60 }, { k: 'o', l: 'O', t: 'num', w: 60 }, { k: 'd', l: 'D', t: 'num', w: 60 },
        { k: 'rpn', l: 'RPN', t: 'calc', f: (r) => { const v = n(r.s) * n(r.o) * n(r.d); const th = n(S.load('ra.rpnTh', 100)) || 100; return v ? `<b>${v}</b> ${v >= th ? ui.pill('bad', T('조치', 'Act')) : ''}` : '–'; } },
        { k: 'act', l: T('조치', 'Action'), t: 'area', w: 160 }
      ],
      sample: () => [
        { item: T('가스 감지기', 'Gas detector'), mode: T('센서 감도 저하', 'Sensor drift'), eff: T('누출 미감지', 'Leak not detected'), cause: T('교정 주기 초과', 'Overdue calibration'), ctl: T('연 1회 교정', 'Yearly calibration'), s: 9, o: 3, d: 6, act: T('범프 테스트 도입', 'Introduce bump tests') },
        { item: T('배기 댐퍼', 'Exhaust damper'), mode: T('고착', 'Stuck'), eff: T('캐비닛 배기 저하', 'Low cabinet exhaust'), cause: T('부식', 'Corrosion'), ctl: T('저배기 경보', 'Low-exhaust alarm'), s: 7, o: 2, d: 3, act: '' },
        { item: T('실린더 밸브', 'Cylinder valve'), mode: T('시트 누설', 'Seat leak'), eff: T('교체 시 가스 방출', 'Release during change'), cause: T('반복 사용 마모', 'Wear'), ctl: T('교체 후 누설 확인', 'Post-change leak check'), s: 8, o: 2, d: 4, act: '' }
      ],
      summary: (rows) => { const th = n(S.load('ra.rpnTh', 100)) || 100; const top = rows.map((r) => ({ r, v: n(r.s) * n(r.o) * n(r.d) || 0 })).sort((a, b) => b.v - a.v).slice(0, 3);
        return `<div class="row"><label class="lbl" for="rpnTh">${T('조치 기준 RPN (포털 예시값, 조직이 정함)', 'Action RPN (portal example — set by your organisation)')}</label><input type="number" id="rpnTh" value="${S.esc(th)}" style="max-width:90px"></div>
          <p class="small">${T('상위 RPN', 'Top RPN')}: ${top.map((x) => `<b>${S.esc(x.r.item || '?')}</b> ${x.v}`).join(' · ')}</p>`; }
    },
    lopa: {
      name: () => T('방호계층분석 (LOPA)', 'Layers of protection (LOPA)'), basis: 'koshaGuide', kosha: 'C-C-62-2026',
      desc: () => T('초기사건 빈도에 독립방호계층(IPL)의 요구시 고장확률(PFD)을 곱해 완화된 사고 빈도를 구하고 목표 빈도와 비교합니다. 모든 값은 조직 기준에 따라 입력합니다.', 'Multiplies the initiating-event frequency by each independent protection layer’s probability of failure on demand to get the mitigated frequency, then compares it with the target. Enter all values per your organisation’s criteria.'),
      cols: () => [
        { k: 'sc', l: T('시나리오', 'Scenario'), t: 'area', w: 190 }, { k: 'ief', l: T('초기사건 빈도 (/년)', 'Initiating freq. (/yr)'), t: 'num', w: 110 },
        { k: 'p1', l: 'IPL1 PFD', t: 'num', w: 90 }, { k: 'p2', l: 'IPL2 PFD', t: 'num', w: 90 }, { k: 'p3', l: 'IPL3 PFD', t: 'num', w: 90 },
        { k: 'cm', l: T('조건부 수정계수', 'Conditional modifier'), t: 'num', w: 100 },
        { k: 'mf', l: T('완화 빈도 (/년)', 'Mitigated (/yr)'), t: 'calc', f: (r) => { const v = lopaF(r); return v == null ? '–' : `<b>${v.toExponential(1)}</b>`; } },
        { k: 'tg', l: T('목표 빈도 (/년)', 'Target (/yr)'), t: 'num', w: 100 },
        { k: 'ok', l: T('판정', 'Result'), t: 'calc', f: (r) => { const v = lopaF(r), tg = n(r.tg); if (v == null || tg == null) return '–'; return v <= tg ? ui.pill('ok', T('목표 충족', 'Meets target')) : ui.pill('bad', T(`추가 위험감소 ×${Math.ceil(v / tg)}`, `Needs RRF ×${Math.ceil(v / tg)}`)); } }
      ],
      sample: () => [
        { sc: T('SiH₄ 공급 과압으로 연결부 누출·화재', 'SiH₄ over-pressure → joint leak and fire'), ief: 0.1, p1: 0.1, p2: 0.01, p3: '', cm: 1, tg: 0.00001 },
        { sc: T('HF 탱크 과충전으로 방류벽 내 누출', 'HF tank overfill → release inside bund'), ief: 0.1, p1: 0.1, p2: 0.1, p3: 0.1, cm: 1, tg: 0.0001 }
      ],
      summary: () => `<p class="xs muted">${T('초기사건 빈도·PFD·목표 빈도는 조직의 기준(KOSHA C-C-62-2026 참고)에 따라 입력하세요. 예시 숫자는 계산을 보여주기 위한 가상값입니다.', 'Enter initiating frequencies, PFDs and targets per your organisation’s criteria (see KOSHA C-C-62-2026). The example numbers are fictional and only show the arithmetic.')}</p>`
    }
  };

  function lopaF(r) {
    const ief = n(r.ief); if (ief == null) return null;
    let f = ief; ['p1', 'p2', 'p3'].forEach((k) => { const p = n(r[k]); if (p != null) f *= p; });
    const cm = n(r.cm); if (cm != null) f *= cm;
    return f;
  }

  function checklistFrom(sopId) {
    const s = S.SOPS.find((x) => x.id === sopId);
    return s.steps.map((st) => ({ item: `${L(st.s)} — ${L(st.c)}`, b: st.b, res: '', note: '' }));
  }
  function jsaFrom(sopId) {
    const s = S.SOPS.find((x) => x.id === sopId);
    return s.steps.map((st) => ({ step: L(st.s), haz: L(st.h), ctl: L(st.c), own: '' }));
  }

  function fsSummary(rows, compact) {
    const cnt = {}; let sumB = 0, nB = 0, sumA = 0, nA = 0, focus = 0; const g = { A: 0, B: 0, C: 0 };
    rows.forEach((r) => {
      const l = n(r.l), s = n(r.s); if (!l || !s) return;
      cnt[l + '-' + s] = (cnt[l + '-' + s] || 0) + 1; sumB += l * s; nB++;
      g[S.skGrade(l * s).g]++;
      if (l * s >= 8 || (l * s >= 6 && FOCUS_TYPES.includes(r.type))) focus++;
      const l2 = n(r.l2), s2 = n(r.s2); if (l2 && s2) { sumA += l2 * s2; nA++; }
    });
    const matrix = `<div class="matrix" style="grid-template-columns:70px repeat(4, minmax(0,1fr))">
      <div class="ax"></div>${SEV.map((x) => `<div class="ax">${T('중대성', 'S')} ${x.v}</div>`).join('')}
      ${LIKE.slice().reverse().map((lk) => `<div class="ax">${T('가능성', 'L')} ${lk.v}</div>${SEV.map((sv) => { const r = lk.v * sv.v; const gg = S.skGrade(r).g; const c = cnt[lk.v + '-' + sv.v]; return `<div class="cell ${gg}">${r}${c ? `<span class="cnt">${c}</span>` : ''}</div>`; }).join('')}`).join('')}
    </div>`;
    return `<div class="grid g2">
      <div>${matrix}<p class="xs muted" style="margin-top:6px">${T('셀 숫자 = 위험도, 검은 원 = 해당 항목 수. 색상은 SK하이닉스 공개 수준표 등급(A 즉시 작업중지·B 조건부·C 허용).', 'Cell = risk score; black badge = item count. Colours follow the SK hynix grades (A stop now · B conditional · C acceptable).')}${S.cite('sr2026')}</p></div>
      <div class="stack">
        <div class="row"><span class="grade A">A</span> ${g.A} <span class="grade B">B</span> ${g.B} <span class="grade C">C</span> ${g.C}</div>
        ${compact ? '' : `<div class="kpi"><span class="k">${T('평균 위험도 (개선 전 → 후)', 'Mean risk (before → after)')}</span><span class="v">${nB ? S.fmt(sumB / nB, 1) : '–'} → ${nA ? S.fmt(sumA / nA, 1) : '–'}</span><span class="d">${T('SK하이닉스는 2025년 평균 5.7 → 2.5를 공개했습니다', 'SK hynix reported 5.7 → 2.5 for 2025')}${S.cite('sr2026')}</span></div>
        <div class="callout warn small"><b>${T('집중관리 대상', 'Focus items')}: ${focus}</b> — ${T('위험도 8 이상, 또는 가스·화학물질·추락·끼임·부딪힘 유형의 위험도 6 이상 (SK하이닉스 2024년 현장 이행 확인 기준)', 'risk ≥ 8, or risk ≥ 6 in gas/chemical, fall, caught-in or struck-by types (SK hynix 2024 field-verification rule)')}${S.cite('sr2025')}</div>`}
      </div></div>`;
  }
  function countSummary(rows, key, opts) {
    return `<div class="row">${opts.map(([v, l]) => `<span class="chip">${l}: <b>${rows.filter((r) => r[key] === v).length}</b></span>`).join('')}</div>`;
  }

  /* ---------- state ---------- */
  const key = (m) => 'ra.' + m;
  function getRows(m) { const saved = S.load(key(m), null); return saved ? { rows: saved, ex: false } : { rows: M[m].sample(), ex: true }; }
  function setRows(m, rows) { S.save(key(m), rows); }
  /* shared with the printable assessment (print.js) */
  S.riskApi = { methods: M, rows: (m) => getRows(m), current: () => { const m0 = S.tab('risk', 'fs'); return M[m0] ? m0 : 'fs'; }, like: LIKE, sev: SEV };

  function cell(c, r, i) {
    const v = r[c.k] == null ? '' : r[c.k];
    const id = `ra-${i}-${c.k}`;
    if (c.t === 'calc') return `<td class="calc">${c.f(r)}</td>`;
    if (c.t === 'sel') return `<td><select id="${id}" data-r="${i}" data-k="${c.k}" aria-label="${S.esc(c.l)}" style="min-width:${c.short ? 64 : c.w}px"><option value="">–</option>${c.o.map(([ov, ol]) => `<option value="${ov}" ${String(ov) === String(v) ? 'selected' : ''}>${c.short ? ov : S.esc(ol)}</option>`).join('')}</select></td>`;
    if (c.t === 'area') return `<td><textarea id="${id}" data-r="${i}" data-k="${c.k}" aria-label="${S.esc(c.l)}" style="min-width:${c.w}px">${S.esc(v)}</textarea></td>`;
    if (c.t === 'num') return `<td><input type="number" step="any" id="${id}" data-r="${i}" data-k="${c.k}" value="${S.esc(v)}" aria-label="${S.esc(c.l)}" style="min-width:${c.w}px"></td>`;
    return `<td><input type="text" id="${id}" data-r="${i}" data-k="${c.k}" value="${S.esc(v)}" aria-label="${S.esc(c.l)}" style="min-width:${c.w}px"></td>`;
  }

  S.pages.risk = {
    render() {
      const m0 = S.tab('risk', 'fs'); const m = M[m0] ? m0 : 'fs'; const def = M[m];
      const meta = S.load('ra.meta', { name: T('M15X 가스 공급 설비 정기평가', 'M15X gas-supply periodic assessment'), date: S.iso(S.today()), team: T('SHE·설비·협력사 작업자', 'SHE, facilities, contractor workers') });
      const { rows, ex } = getRows(m);
      const cols = def.cols();
      return `
      ${ui.head(T('판정 도구', 'Tools'), T('위험성평가 워크벤치', 'Risk assessment workbench'),
        T('고용노동부 「사업장 위험성평가에 관한 지침」 제7조의 기법과 공정안전보고서용 기법(시행규칙 제50조)을 직접 실행합니다. 결과는 이 브라우저에 저장되고 CSV로 내보낼 수 있습니다.', 'Runs the methods listed in Art. 7 of MOEL’s workplace risk-assessment guideline and the PSM techniques in Rule Art. 50. Results stay in this browser and export to CSV.'))}
      <section class="panel stack">
        <div class="form-grid">
          <div class="field"><label for="meta-name">${T('평가명', 'Assessment')}</label><input type="text" id="meta-name" value="${S.esc(meta.name)}"></div>
          <div class="field"><label for="meta-date">${T('평가일', 'Date')}</label><input type="date" id="meta-date" value="${S.esc(meta.date)}"></div>
          <div class="field"><label for="meta-team">${T('참여자 (근로자 참여 필수)', 'Participants (workers must take part)')}</label><input type="text" id="meta-team" value="${S.esc(meta.team)}"></div>
          <div class="field"><span class="lbl">${T('사업장', 'Site')}</span><span>${L(S.SITES[S.state.site].name)}</span></div>
        </div>
        <p class="xs muted">${T('산안법 제36조(2026.6.1 시행): 위험성평가에 해당 사업장 근로자를 참여시켜야 하며(사업장 순회 점검 방식이 기본, 시행규칙 제37조의2), 근로자대표가 요구하면 근로자대표도 참여시켜야 합니다. 실시 일정과 결과를 근로자에게 알리고, 결과는 3년간 보존합니다(제37조의3·제37조의4).', 'OSH Act Art. 36 (in force 2026-06-01): workers must take part — mainly through site rounds (Rule Art. 37-2) — and the workers’ representative too if they ask. Share the schedule and results with workers and keep the records for three years (Arts. 37-3, 37-4).')}${S.cite('lawAct', 'lawRule')} <a class="xs" href="#risk/timing">${T('언제 평가해야 하나 →', 'When to assess →')}</a></p>
      </section>
      ${ui.tabs('risk', Object.keys(M).map((id) => ({ id, label: M[id].name() })), m)}
      <section class="panel stack">
        <div class="row" style="justify-content:space-between">
          <div class="stack" style="gap:2px;max-width:780px"><b>${def.name()}</b><span class="small muted">${def.desc()} ${def.basis ? S.cite(def.basis) : ''} ${def.kosha ? 'KOSHA ' + S.koshaTag(def.kosha) : ''}</span></div>
          ${ex ? ui.ex() : ''}
        </div>
        ${def.checklist ? `<div class="row"><label class="lbl" for="ck-src">${T('체크리스트 불러오기 (SOP)', 'Load checklist from SOP')}</label><select id="ck-src" style="max-width:min(320px,100%)">${S.SOPS.map((s) => `<option value="${s.id}">${S.esc(L(s.t))}</option>`).join('')}</select><button class="btn ghost sm" type="button" id="ck-load">${T('불러오기', 'Load')}</button></div>` : ''}
        ${def.sopImport ? `<div class="row"><label class="lbl" for="jsa-src">${T('SOP 절차로 시작', 'Start from an SOP')}</label><select id="jsa-src" style="max-width:min(320px,100%)">${S.SOPS.map((s) => `<option value="${s.id}">${S.esc(L(s.t))}</option>`).join('')}</select><button class="btn ghost sm" type="button" id="jsa-load">${T('불러오기', 'Load')}</button></div>` : ''}
        <div class="table-wrap"><table class="data edit"><thead><tr><th>#</th>${cols.map((c) => `<th>${c.l}</th>`).join('')}<th></th></tr></thead>
          <tbody>${rows.map((r, i) => `<tr><td class="n">${i + 1}</td>${cols.map((c) => cell(c, r, i)).join('')}<td><button class="btn danger sm" type="button" data-row-del="${i}" aria-label="${T('행 삭제', 'Delete row')}">×</button></td></tr>`).join('')}</tbody></table></div>
        <div class="row">
          <button class="btn" type="button" id="row-add">+ ${T('행 추가', 'Add row')}</button>
          <button class="btn ghost" type="button" id="ra-sample">${T('예시 불러오기', 'Load example')}</button>
          <button class="btn ghost" type="button" id="ra-clear">${T('비우기', 'Clear')}</button>
          <button class="btn ghost" type="button" id="ra-csv">${T('CSV 내보내기', 'Export CSV')}</button>
          ${S.printLink('ra', T('평가표 인쇄 (결재란 포함)', 'Print (with sign-off boxes)'))}
        </div>
      </section>
      <section class="panel">${ui.title(T('결과 요약', 'Summary'))}${def.summary(rows)}</section>
      ${m === 'fs' ? `<section class="panel">${ui.title(T('척도와 등급 기준', 'Scales and grades'))}
        <div class="grid g3">
          <div><b class="small">${T('가능성', 'Likelihood')}</b><ul class="clean small">${LIKE.map((x) => `<li>${L(x)}</li>`).join('')}</ul></div>
          <div><b class="small">${T('중대성', 'Severity')}</b><ul class="clean small">${SEV.map((x) => `<li>${L(x)}</li>`).join('')}</ul></div>
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('위험도', 'Risk')}</th><th>${T('등급', 'Grade')}</th><th>${T('관리기준', 'Management')}</th></tr></thead><tbody>
            ${[2, 5, 9, 12, 16].map((r) => { const g = S.skGrade(r); return `<tr><td class="n">${g.band}</td><td><span class="grade ${g.g}">${g.g}</span></td><td class="small">${g.acc} — ${g.act}</td></tr>`; }).join('')}</tbody></table></div>
        </div>
        <p class="xs muted" style="margin-top:8px">${T('등급 구간·관리기준은 SK하이닉스 2026 지속가능경영보고서의 “작업 위험성평가 수준표”를 옮긴 것입니다. 가능성·중대성 단계별 정의는 회사가 공개하지 않아 포털 예시로 작성했습니다.', 'Bands and actions are transcribed from the “job risk-assessment level table” in SK hynix’s 2026 sustainability report. Step definitions for likelihood and severity are not public, so the portal supplies example wording.')}${S.cite('sr2026')}</p></section>` : ''}
      <section class="panel stack" id="anchor-timing" data-shared>${ui.title(T('언제 평가해야 하나 — 실시 시기', 'When to assess — timing'), T('산안법 시행규칙 제37조~제37조의4 · 위험성평가 지침 제15조', 'OSH Rule Arts. 37–37-4 · RA guideline Art. 15'))}
        <div class="callout small">${T('2026.6.1부터 위험성평가의 시기·근로자 참여·공유·기록을 시행규칙(고용노동부령 제470호)이 직접 정합니다. 세부 기준을 담은 위험성평가 지침(고시 제2024-76호)은 아직 개정 전이어서 최초평가 시기(“사업 성립일부터 1개월이 되는 날까지 착수”) 등 표현이 시행규칙과 다르므로, 다를 때는 시행규칙을 먼저 확인하세요.', 'Since 2026-06-01 the Rule itself (Ordinance No. 470) sets the timing, worker participation, sharing and records. The detailed guideline (Notice No. 2024-76) has not been revised yet and words some points differently — e.g. it says to start the initial assessment “within a month of the business starting” — so check the Rule first where they differ.')}${S.cite('lawRule', 'moelRa')}</div>
        <div class="grid g2">
          <div><b class="small">${T('법정 시기 (시행규칙 제37조②)', 'Statutory timing (Rule Art. 37(2))')}</b><ul class="facts" style="margin-top:6px">
            <li>${T('최초평가 — 해당 사업장에서 최초로 작업을 시작하기 전까지', 'Initial — before work first starts at the site')}</li>
            <li>${T('정기평가 — 최초평가를 한 연도의 다음 연도부터 매년 1회 이상', 'Periodic — at least once a year from the year after the initial assessment')}</li>
            <li>${T('수시평가 — 기존 평가에서 파악되지 않은 유해·위험요인이 생길 우려가 있거나 중대산업사고·산업재해가 발생하면 관련 작업을 시작하기 전까지', 'Ad-hoc — before the related work starts, whenever hazards missed by earlier assessments may arise or a major industrial accident or injury occurs')}</li></ul>
            <p class="xs muted" style="margin-top:6px">${T('정기평가 때는 설비 성능 저하, 근로자 교체에 따른 지식·경험 변화, 새로운 안전보건 지식, 감소대책의 유효성을 함께 봅니다(지침 제15조③).', 'Periodic reviews also consider equipment wear, staff changes, new knowledge and whether controls still work (guideline Art. 15(3)).')}</p></div>
          <div><b class="small">${T('수시평가 사유 예시 (지침 제15조②)', 'Ad-hoc triggers listed in the guideline (Art. 15(2))')}</b><ul class="facts" style="margin-top:6px">
            <li>${T('건설물 설치·이전·변경·해체', 'Buildings are installed, moved, altered or demolished')}</li>
            <li>${T('기계·기구·설비·원재료 신규 도입 또는 변경', 'Machines, equipment or raw materials are introduced or changed')}</li>
            <li>${T('정비·보수 (주기적·반복 작업으로 이미 평가한 경우 제외)', 'Maintenance or repair (unless routine and already assessed)')}</li>
            <li>${T('작업방법·작업절차 신규 도입 또는 변경', 'Work methods or procedures are introduced or changed')}</li>
            <li>${T('중대산업사고 또는 휴업 이상 산업재해 발생 — 재해가 난 작업은 재개하기 전에', 'A major industrial accident or a lost-time injury — before the job restarts')}</li>
            <li>${T('그 밖에 사업주가 필요하다고 판단할 때', 'Whenever the employer judges it necessary')}</li></ul></div>
        </div>
        <div class="grid g3">
          <div><b class="small">${T('근로자 참여 (제37조의2)', 'Worker participation (Art. 37-2)')}</b><p class="small" style="margin-top:6px">${T('사업장 순회 점검에 근로자를 참여시키는 방법이 기본이고, 설문조사·면담 등을 함께 쓸 수 있습니다. 순회 점검에 참여시킬 수 없는 특별한 사정이 있으면 설문·면담 등 하나 이상의 방법으로 참여시킵니다.', 'Workers take part mainly by joining site rounds, optionally with surveys or interviews; where they genuinely cannot join rounds, use at least one other method such as a survey or interview.')}</p></div>
          <div><b class="small">${T('근로자 공유 (제37조의3)', 'Sharing with workers (Art. 37-3)')}</b><p class="small" style="margin-top:6px">${T('실시 전에는 실시 일정을, 실시 후에는 파악한 유해·위험요인, 위험성 수준 결정 결과, 개선대책 수립 내용과 이행 결과를 알립니다(교육·설명회·게시·서면·전자적 방법, 법 제36조④).', 'Before: the schedule. After: the hazards found, the risk decisions, and the measures planned and carried out — through training, briefings, notices, writing or electronic means (Act Art. 36(4)).')}</p></div>
          <div><b class="small">${T('기록·보존 (제37조의4)', 'Records (Art. 37-4)')}</b><p class="small" style="margin-top:6px">${T('실시 시기와 담당자, 참여한 근로자·근로자대표, 공유한 결과를 기록해 3년간 보존합니다.', 'Record when it was done and by whom, which workers and representatives took part, and the results shared; keep for three years.')}</p></div>
        </div>
        <div class="callout warn small">${T('과태료 예고 — 위험성평가 미실시 1천만원 이하, 근로자 참여·공유 위반 500만원 이하, 결과 기록·보존 위반 300만원 이하(법 제175조④2의2·⑤1·⑥2의2). 상시 50명 이상 사업장(건설업은 공사금액 50억원 이상)은 2027.1.1, 그 밖에는 2028.1.1부터 적용됩니다(법률 제21374호 부칙 제1조).', 'Fines ahead — up to KRW 10 million for not assessing, 5 million for skipping worker participation or sharing, 3 million for not keeping records (Act Art. 175(4)2-2, (5)1, (6)2-2). They apply from 2027-01-01 at sites with 50+ workers (construction: contracts of KRW 5 bn+) and from 2028-01-01 elsewhere (Act No. 21374, Addendum Art. 1).')}${S.cite('lawAct')}</div>
        <div class="callout ok small"><b>${T('상시평가로 대신하기 (지침 제15조④)', 'Continuous assessment instead (guideline Art. 15(4))')}</b> — ${T('① 매월 1회 이상 근로자 제안·아차사고·순회점검으로 유해·위험요인을 찾아 위험성 결정과 감소대책까지 하고, ② 매주 안전보건관리책임자·안전관리자·보건관리자·관리감독자 등(도급 시 수급사업장 관리자 포함)이 결과를 논의·공유하며 이행을 점검하고, ③ 매 작업일 TBM 등으로 근로자에게 공유·주지하면 수시·정기평가를 한 것으로 봅니다.', '(1) At least monthly, find hazards through worker suggestions, near misses and site rounds and carry them through to risk decisions and controls; (2) weekly, the site head, safety and health managers and supervisors (with contractors’ managers where relevant) discuss, share and check progress; (3) every working day, brief workers through the TBM. Doing all three counts as the ad-hoc and periodic assessments.')}</div>
        <div class="small"><b>${T('SK하이닉스가 공개한 평가 흐름', 'The flow SK hynix discloses')}</b>
          <ol class="proc p5" style="margin-top:6px">${[T('사전 준비 — 작업목록 확보·작업절차서 등록', 'Prepare — job list and registered procedures'), T('유해·위험요인 파악', 'Identify hazards'), T('위험성 결정', 'Decide the risk'), T('허용 불가 시 감소대책 수립·실행', 'If unacceptable, plan and carry out controls'), T('기록·교육 — 남은 유해·위험요인 게시·교육', 'Record and train — post and teach the residual hazards')].map((s, i) => `<li><span class="no">${i + 1}</span>${s}</li>`).join('')}</ol></div>
        <p class="xs muted">${T('상시평가는 고시 조항이므로 개정 시행규칙에 맞춘 고시 개정 여부를 함께 확인하세요.', 'Continuous assessment is a notice provision — watch for a notice revised to match the new Rule.')} ${S.cite('lawRule', 'moelRa', 'sr2026')}</p>
      </section>`;
    },
    mount(root) {
      const m0 = S.tab('risk', 'fs'); const m = M[m0] ? m0 : 'fs'; const def = M[m];
      const cur = () => getRows(m).rows;
      /* start from what is on screen, so changing one field does not blank the others */
      const meta = { name: root.querySelector('#meta-name').value, date: root.querySelector('#meta-date').value, team: root.querySelector('#meta-team').value };
      ['name', 'date', 'team'].forEach((k) => root.querySelector('#meta-' + k).addEventListener('change', (e) => { meta[k] = e.target.value; S.save('ra.meta', meta); }));
      root.querySelectorAll('[data-r]').forEach((el) => el.addEventListener('change', () => {
        const rows = cur(); rows[Number(el.dataset.r)][el.dataset.k] = el.value; setRows(m, rows); S.refresh();
      }));
      root.querySelectorAll('[data-row-del]').forEach((b) => b.addEventListener('click', () => { const rows = cur(); rows.splice(Number(b.dataset.rowDel), 1); setRows(m, rows); S.refresh(); }));
      root.querySelector('#row-add').addEventListener('click', () => { const rows = cur(); rows.push({}); setRows(m, rows); S.refresh(); });
      root.querySelector('#ra-sample').addEventListener('click', () => { S.save(key(m), null); S.refresh(); });
      root.querySelector('#ra-clear').addEventListener('click', () => { setRows(m, []); S.refresh(); });
      root.querySelector('#ra-csv').addEventListener('click', () => {
        const cols = def.cols(); const rows = cur();
        const strip = (h) => String(h).replace(/<[^>]+>/g, '').trim();
        const out = [[S.T('평가명', 'Assessment'), meta.name, S.T('평가일', 'Date'), meta.date, S.T('기법', 'Method'), def.name()], cols.map((c) => c.l)];
        rows.forEach((r) => out.push(cols.map((c) => c.t === 'calc' ? strip(c.f(r)) : c.t === 'sel' ? ((c.o.find(([v]) => String(v) === String(r[c.k])) || [, ''])[1]) : (r[c.k] == null ? '' : r[c.k]))));
        S.csv(out, `risk-${m}-${meta.date}.csv`);
      });
      const ck = root.querySelector('#ck-load'); if (ck) ck.addEventListener('click', () => { setRows(m, checklistFrom(root.querySelector('#ck-src').value)); S.refresh(); });
      const jl = root.querySelector('#jsa-load'); if (jl) jl.addEventListener('click', () => { setRows(m, jsaFrom(root.querySelector('#jsa-src').value)); S.refresh(); });
      const th = root.querySelector('#rpnTh'); if (th) th.addEventListener('change', () => { S.save('ra.rpnTh', th.value); S.refresh(); });
    }
  };
})();

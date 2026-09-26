/* 6대 직무 모듈 — 공정안전 · 예방안전 · SDX · 상생협력 · 소방·방재 · 안전문화 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui, C = S.COMPANY;
  const n = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));
  const facts = (arr) => `<ul class="facts">${arr.map((f) => `<li>${L(f.t)}${S.cite(f.src)}</li>`).join('')}</ul>`;
  const sopLink = (id) => { const s = S.SOPS.find((x) => x.id === id); return `<a class="chip" href="#sop/${id}">${L(s.t)}</a>`; };
  const statusSel = (id, val, opts) => `<select id="${id}" data-status="${id}">${opts.map(([v, l]) => `<option value="${v}" ${v === val ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  const saveRefresh = (k, v) => { S.save(k, v); S.refresh(); };

  /* ======================= 공정안전 PSM ======================= */
  /* req: 고용노동부고시 제2025-30호(PSM 고시)가 각 요소에 반드시 담도록 정한 사항 (원문 확인, src: moelPsm) */
  const PSM12 = [
    { id: 'psi', t: { ko: '공정안전자료', en: 'Process safety information' }, law: '①1', d: { ko: '유해·위험물질 종류·수량, MSDS, 설비 목록·사양, 공정도면, 배치도, 폭발위험장소 구분도·전기단선도, 안전설계 지침서', en: 'Hazardous substances and quantities, MSDS, equipment list/specs, process drawings, layouts, hazardous-area classification and single-line diagrams, design guides' }, link: 'hazards',
      req: { art: '41', ko: ['화학물질 안전보건자료 (원료·중간제품·완제품 포함, 화재·폭발·반응위험성·독성)', '제조공정 기술자료·도면', '공정설비 기술자료·도면'], en: ['Chemical safety data (raw, intermediate and finished; fire, explosion, reactivity, toxicity)', 'Process technology data and drawings', 'Equipment data and drawings'] } },
    { id: 'pha', t: { ko: '공정위험성평가', en: 'Process hazard analysis' }, law: '①2', d: { ko: '체크리스트·상대위험순위·HEA·What-if·HAZOP·FMECA·FTA·ETA·CCA 중 1가지 이상 (동등 이상 기법 포함)', en: 'One or more of checklist, Dow/Mond, HEA, What-if, HAZOP, FMECA, FTA, ETA, CCA (or equivalent)' }, link: 'risk',
      req: { art: '27–30', ko: ['단위공정 특성에 맞는 기법 선정 (반응·분리·이송·전기계장은 HAZOP·FMECA·FTA 등, 저장·유틸리티는 체크리스트·What-if 등)', '인화성 가스·액체 화재·폭발, 독성물질 누출별 최악 1건·대안 1건 이상 사고 시나리오의 정량적 피해예측', '위험성평가·설계·공정운전 전문가 참여, 명단 기록', '설비 설치·개보수 등 작업은 JSA 등으로 별도 위험성평가 규정 마련'], en: ['Choose methods to suit each unit (HAZOP, FMECA, FTA… for reaction, separation, transfer and E&I; checklist, What-if… for storage and utilities)', 'Quantitative consequence analysis of one worst-case and at least one alternative scenario each for flammable fire/explosion and toxic release', 'Risk-assessment, design and operations experts take part and are listed', 'A separate job risk-assessment rule (e.g. JSA) for installation, repair and similar work'] } },
    { id: 'sop', t: { ko: '안전운전지침서', en: 'Operating procedures' }, law: '①3가', d: { ko: '설비·작업별 안전운전 절차', en: 'Safe operating procedures by unit and task' }, link: 'sop',
      req: { art: '31', ko: ['최초 시운전·정상운전·비상시 운전', '정상 운전 정지·비상정지·정비 후 운전 개시', '운전범위를 벗어났을 때 조치 절차', '물성·유해위험성, 누출 예방, 보호구, 폭로 시 조치요령', '안전설비 계통의 기능·운전방법'], en: ['Initial start-up, normal and emergency operation', 'Normal shutdown, emergency shutdown, restart after maintenance', 'Actions when operating limits are exceeded', 'Properties and hazards, leak prevention, PPE, exposure response', 'Function and operation of safety systems'] } },
    { id: 'mi', t: { ko: '설비점검·검사·보수·유지', en: 'Inspection, testing & maintenance' }, law: '①3나', d: { ko: '설비점검·검사 및 보수계획, 유지계획 및 지침서 — 로봇 순찰(SDX)과 연계', en: 'Inspection, testing, maintenance plans and guides — linked to robot patrols (SDX)' }, link: 'home/cycles',
      req: { art: '32', ko: ['구성 기기의 우선순위 등급', '기기 점검·결함관리·정비', '기기·기자재 품질관리', '외주업체 관리', '설비 유지관리'], en: ['Priority grading of components', 'Inspection, defect management and repair', 'Quality control of equipment and materials', 'Managing outside contractors', 'Equipment upkeep'] } },
    { id: 'ptw', t: { ko: '안전작업허가', en: 'Permit to work' }, law: '①3다', d: { ko: '화기·밀폐·배관개방 등 위험작업 허가', en: 'Permits for hot work, confined space, line breaking, etc.' }, link: 'ptw',
      req: { art: '33', ko: ['안전작업허가 일반사항·안전작업 준비', '화기작업 허가', '일반위험작업 허가', '밀폐공간 출입작업 허가', '정전작업 허가', '굴착작업 허가', '방사선 사용작업 허가'], en: ['General rules and preparation', 'Hot-work permit', 'General hazardous-work permit', 'Confined-space entry permit', 'Electrical isolation permit', 'Excavation permit', 'Radiation-work permit'] } },
    { id: 'contr', t: { ko: '도급업체 안전관리', en: 'Contractor safety' }, law: '①3라', d: { ko: '도급업체 안전관리계획', en: 'Contractor safety management plan' }, link: 'partner',
      req: { art: '34', ko: ['법 제63~66조 도급인 조치', '도급업체 선정과 안전관리수준 평가', '비상조치계획(최악·대안 시나리오) 제공 및 훈련', '도급업체: 조치 이행, 작업자 교육·훈련, 작업표준·작업 위험성평가'], en: ['Principal’s duties under Act Arts. 63–66', 'Selecting contractors and rating their safety performance', 'Sharing the emergency plan (worst and alternative scenarios) and drilling it', 'Contractor: carry out measures, train workers, write work standards and job risk assessments'] } },
    { id: 'train', t: { ko: '근로자 등 교육', en: 'Training' }, law: '①3마', d: { ko: '근로자 등 교육계획', en: 'Training plan for workers and others' }, link: 'training',
      req: { art: '35', ko: ['교육대상·종류', '교육계획 수립·실시', '교육 평가 및 사후관리'], en: ['Who and what kind of training', 'Planning and delivery', 'Evaluation and follow-up'] } },
    { id: 'pssr', t: { ko: '가동 전 점검', en: 'Pre-startup safety review' }, law: '①3바', d: { ko: '가동 전 점검지침 (KOSHA C-C-52-2026)', en: 'Pre-startup review guide (KOSHA C-C-52-2026)' }, link: 'psm/pssr',
      req: { art: '36', ko: ['점검팀 구성·점검시기', '점검표 작성', '점검보고서와 결과 처리'], en: ['Review team and timing', 'Checklists', 'Report and handling of findings'] } },
    { id: 'moc', t: { ko: '변경요소 관리', en: 'Management of change' }, law: '①3사', d: { ko: '변경요소 관리계획 (KOSHA C-C-53-2026) — 아래 MOC 트래커', en: 'MOC plan (KOSHA C-C-53-2026) — see the tracker below' }, link: 'psm/moc',
      req: { art: '37', ko: ['변경요소 관리 원칙', '정상변경·비상변경 관리절차', '변경관리위원회 구성', '변경 시 검토항목·업무분담·기술적 근거', '변경요구서 서식'], en: ['MOC principles', 'Normal and emergency change procedures', 'Change committee', 'Review items, responsibilities, technical basis', 'Change request form'] } },
    { id: 'audit', t: { ko: '자체감사', en: 'Compliance audit' }, law: '①3아', d: { ko: '자체감사 계획', en: 'Self-audit plan' }, link: 'psm/audit',
      req: { art: '38', ko: ['감사계획·감사팀 구성', '감사 시행', '평가 및 시정, 문서화'], en: ['Audit plan and team', 'Conducting the audit', 'Evaluation, corrective action, documentation'] } },
    { id: 'inv', t: { ko: '공정사고 조사', en: 'Incident investigation' }, law: '①3아', d: { ko: '사고조사 계획 — 예방안전의 사고조사 도구와 연계', en: 'Investigation plan — linked to the incident tool in Preventive safety' }, link: 'prevent/incident',
      req: { art: '39', ko: ['공정사고 조사팀 구성', '조사 보고서 작성', '조사 결과 처리'], en: ['Investigation team', 'Investigation report', 'Handling the findings'] } },
    { id: 'erp', t: { ko: '비상조치계획', en: 'Emergency response plan' }, law: '①4', d: { ko: '장비·인력, 비상연락체계, 조직 임무·절차, 교육계획, 주민홍보계획 (KOSHA C-C-55-2026)', en: 'Equipment and people, contact chain, roles and procedures, training, public information (KOSHA C-C-55-2026)' }, link: 'fire',
      req: { art: '40', ko: ['비상사태 구분, 위험성·재해 파악, 물질 성질·상태 조사', '최악·대안 사고 시나리오 피해예측을 반영한 대응계획', '비상대피 계획, 비상사태 발령(중대산업사고 보고 포함)·종결', '사업장 내·외부 대응기관과 피해범위 내 주민에게 비상경보 전파', '비상조치위원회·비상통제 조직, 장비·비상통제소, 운전정지 절차', '비상훈련 실시, 주민 홍보계획'], en: ['Emergency levels, hazard analysis, substance properties', 'Response plan reflecting worst and alternative scenario consequences', 'Evacuation plan; declaring (incl. reporting major accidents) and ending emergencies', 'Alerting on- and off-site responders and residents in the impact zone', 'Emergency committee and control organisation, equipment and control room, shutdown procedure', 'Drills and public information'] } }
  ];
  const PSM_DEFAULT = { psi: 'done', pha: 'doing', sop: 'done', mi: 'doing', ptw: 'done', contr: 'doing', train: 'done', pssr: 'gap', moc: 'doing', audit: 'todo', inv: 'done', erp: 'doing' };
  const MOC_DEFAULT = [
    { id: 1, t: { ko: 'M15X 신규 식각 장비 반입', en: 'New etch tools into M15X' }, type: 'equip', site: 'cheongju', ra: 'hazop', pssr: false, sop: true, edu: false },
    { id: 2, t: { ko: 'HF 공급 농도 변경', en: 'Change of HF supply concentration' }, type: 'chem', site: 'icheon', ra: 'whatif', pssr: true, sop: true, edu: true },
    { id: 3, t: { ko: 'P&S Room 스크러버 교체', en: 'P&S room scrubber replacement' }, type: 'equip', site: 'icheon', ra: 'fs', pssr: false, sop: false, edu: false }
  ];
  const MOC_TYPES = () => [['equip', T('설비', 'Equipment')], ['proc', T('공정 조건', 'Process conditions')], ['chem', T('물질', 'Chemicals')], ['proc2', T('절차', 'Procedure')], ['org', T('조직·인력', 'Organisation')]];
  /* 화학물질관리법·고압가스 안전관리법 핵심 의무 (원문 확인, 2026-09-24) */
  const CCA_DUTIES = () => [
    [T('취급기준 — 시설 성능 유지, 방재장비·약품 비치, 다른 유해화학물질 혼합 보관 금지, 용기 성능 유지, 차에 싣거나 내릴 때 유해화학물질관리자 또는 안전교육 이수자 참여', 'Handling rules — maintain facilities, keep response equipment and neutralisers, never store different hazardous chemicals together, keep containers sound, and have a hazardous-chemical manager or trained person present when loading or unloading'), T('법 제13조', 'Art. 13')],
    [T('기체 취급·증기 발생·분말 날림 우려가 있으면 물질에 맞는 개인보호장구 착용', 'Wear PPE suited to the chemical when handling gases or where vapour or dust may arise'), T('법 제14조', 'Art. 14')],
    [T('화학사고예방관리계획서 — 설치·운영 전 제출, 취급량 증가·시설 신설 등 변경 시 변경 제출, 주요취급시설은 5년마다 재제출, 인근 주민 고지 매년 1회 이상', 'Accident prevention plan — submit before operating, resubmit on changes such as more quantity or new facilities, every 5 years for major facilities, and notify nearby residents at least yearly'), T('법 제23조·제23조의3', 'Arts. 23, 23-3')],
    [T('취급시설 검사 — 설치검사 후 정기검사(1군 가위험도 1년, 1군 나·다 2년, 2군 3년, 그 밖 4년), 사고 등으로 통지되면 7일 이내 수시검사, 네 번째 정기검사 기한에 안전진단', 'Facility inspections — installation, then periodic (group 1 risk A: 1 yr; group 1 B/C: 2 yrs; group 2: 3 yrs; others: 4 yrs), ad-hoc within 7 days of notice, and a safety diagnosis at the fourth periodic deadline'), T('법 제24조, 규칙 제23·24조', 'Art. 24; Rule 23–24')],
    [T('자체 점검 — 주 1회 이상, 결과 5년간 기록·비치 (배관·밸브 누출, 밀폐 보관, 용기·운반장비 손상, 감지·경보설비 작동, 보호장구, 방류벽 등)', 'Self-inspection — at least weekly, records kept 5 years (leaks from lines and valves, sealed storage, container and vehicle damage, detectors and alarms, PPE, bunds)'), T('법 제26조, 규칙 제26조', 'Art. 26; Rule 26')],
    [T('유해화학물질 사용업 등 영업허가, 유해화학물질관리자 사업 개시 전 선임(해임·퇴직 시 30일 이내 재선임)', 'Business licence (e.g. user business); appoint a hazardous-chemical manager before starting (replace within 30 days)'), T('법 제28조·제32조', 'Arts. 28, 32')],
    [T('취급을 도급하면 수급인·도급계획·화학사고 안전관리계획 신고 — 수급인의 위반 효과는 도급인에게도 미침', 'Subcontracted handling must be notified (contractor, plan, accident safety plan); the contractor’s breaches also bind the principal'), T('법 제31조', 'Art. 31')],
    [T('안전교육 — 기술인력·관리자·취급 담당자 매 2년 16시간(운반자 8시간), 전 종사자 매년 1회 2시간 이상', 'Training — technical staff, managers and handlers 16 h every 2 years (transporters 8 h); all workers at least 2 h yearly'), T('법 제33조, 규칙 제37조·별표6의3', 'Art. 33; Rule 37, Annex 6-3')],
    [T('화학사고 발생 시 즉시 응급조치, 인명피해나 기준량 이상 누출이면 15분 이내 즉시 신고', 'On a chemical accident, take emergency measures at once and report within 15 minutes if people are harmed or the threshold is exceeded'), T('법 제43조, 즉시 신고 규정', 'Art. 43; reporting rules')]
  ];
  const HPG_DUTIES = () => [
    [T('특정고압가스 — 수소·산소·액화암모니아·아세틸렌·액화염소·천연가스·압축모노실란·압축디보레인·액화알진, 포스핀·셀렌화수소·게르만·디실란·오불화비소·오불화인·삼불화인·삼불화질소·삼불화붕소·사불화유황·사불화규소', 'Specified gases — hydrogen, oxygen, liquefied ammonia, acetylene, liquefied chlorine, natural gas, compressed monosilane, compressed diborane, liquefied arsine, phosphine, hydrogen selenide, germane, disilane, arsenic pentafluoride, phosphorus pentafluoride, phosphorus trifluoride, nitrogen trifluoride, boron trifluoride, sulfur tetrafluoride, silicon tetrafluoride'), T('법 제20조①, 영 제16조', 'Art. 20(1); Decree 16')],
    [T('사용신고 — 사용개시 7일 전까지 시장·군수·구청장에게. 압축모노실란·포스핀·삼불화질소 등 14종과 액화염소·액화암모니아는 양과 관계없이 신고(시험용 등 제외), 그 밖에는 저장능력 500kg(액화)·50㎥(압축) 이상 또는 배관 공급', 'Use notification — to the local authority 7 days before first use; required regardless of quantity for monosilane, phosphine, NF₃ and 11 other gases plus liquefied chlorine and ammonia (testing excepted); otherwise from 500 kg (liquefied) or 50 m³ (compressed) storage or piped supply'), T('법 제20조①, 규칙 제46조', 'Art. 20(1); Rule 46')],
    [T('사용시설 기준 충족, 사용 전 완성검사, 완성검사증명서 발급일 기준 매 1년 전후 15일 이내 정기검사', 'Meet facility standards; completion inspection before use; periodic inspection within ±15 days of each anniversary'), T('법 제20조③④, 규칙 제48조', 'Art. 20(3)(4); Rule 48')],
    [T('안전관리자 사용 전 선임(총괄자·부총괄자·책임자·안전관리원), 해임·퇴직 시 신고하고 30일 이내 재선임 — 자격·선임 인원(시행령 별표3) 개정분은 2027.7.1 시행', 'Appoint safety managers before use (general, deputy, officer, staff); report changes and replace within 30 days — revised qualifications and numbers (Decree Annex 3) apply from 2027-07-01'), T('법 제15조, 영 제12조', 'Art. 15; Decree 12')],
    [T('안전관리책임자 전문교육 — 신규 종사 후 6개월 이내, 이후 3년이 되는 해마다 1회 (교육 실시방법 별표31 개정분은 2027.7.1 시행)', 'Specialist training for the safety officer — within 6 months of starting, then every third year (the revised training annex, Annex 31, applies from 2027-07-01)'), T('법 제23조, 규칙 별표31', 'Art. 23; Rule Annex 31')],
    [T('사고 시 한국가스안전공사에 즉시 속보, 사망 20일·부상·중독 10일 이내 상보', 'On an accident, flash-report to the Korea Gas Safety Corporation at once; detailed report within 20 days (death) or 10 days (injury, poisoning)'), T('법 제26조, 규칙 별표34', 'Art. 26; Rule Annex 34')],
    [T('공급자는 사용신고·검사 여부를 확인하고, 안 된 곳에는 공급을 중지해야 함', 'Suppliers must check notification and inspections and stop supplying if they are missing'), T('법 제20조⑥⑦', 'Art. 20(6)(7)')]
  ];
  /* one row per substance that any of the three regimes names */
  const REG_ROWS = () => S.CHEMICALS.map((c) => ({
    c, hpg: S.HPG[c.id], tq: S.PSM_TQ.filter((t) => t.chem === c.id).map((t) => ({ tq: t.tq, memo: /%|무수/.test(t.ko) ? L(t).replace(/^[^(]*\(|\)$/g, '') : '' })),
    rq: (S.CHEM_REPORT.find((r) => r.id === c.id) || {}).q
  })).filter((x) => x.hpg || x.tq.length || x.rq != null);
  /* 규정량 판정 예시 수량(가상) — 합산 원리를 보여주기 위한 값 */
  /* 12대 요소 현황판의 ‘연결’ — 요소별로 실제 업무를 이어서 하는 화면 */
  const PSM_GO = () => ({
    hazards: T('물질·공정 위험', 'Chemical & process hazards'), risk: T('위험성평가 워크벤치', 'Risk workbench'), sop: T('SOP·작업 안전', 'SOPs'),
    'home/cycles': T('법정 주기(안전검사)', 'Statutory cycles (inspections)'), ptw: T('작업허가서 작성기', 'Permit builder'), partner: T('상생협력', 'Contractor partnership'),
    training: T('교육 이수 관리', 'Training records'), 'psm/pssr': T('가동 전 점검표', 'Pre-startup review'), 'psm/moc': T('MOC 트래커', 'MOC tracker'),
    'psm/audit': T('자체감사표', 'Self-audit'), 'prevent/incident': T('사고·아차사고 조사', 'Incident investigation'), fire: T('소방·방재 비상대응', 'Fire & emergency')
  });

  /* PSM 고시(제2025-30호) 제49조 가동전 안전점검 — 시운전 전 최소 확인 7항목, 결과 기록·보존 (원문 확인 2026-09-25) */
  const PSSR_ITEMS = () => [
    T('추가·변경 설비가 설계기준에 맞게 설계되었는지', 'Added or changed equipment is designed to the design standards'),
    T('제작기준대로 제작되었고 규정된 검사에서 합격 판정을 받았는지', 'It was built to the fabrication standards and passed the required inspections'),
    T('설치공사가 설치 기준·사양대로 되었는지', 'It was installed to the installation standards and specifications'),
    T('안전운전절차·지침, 정비기준, 비상시 운전절차가 준비되어 있고 내용이 적절한지', 'Safe operating procedures, maintenance standards and emergency operating procedures are ready and adequate'),
    T('신설 설비는 위험성평가를 했고 제시된 개선사항을 이행했는지', 'For new equipment, a hazard assessment was done and its recommendations carried out'),
    T('변경된 설비는 규정된 변경관리 절차에 따라 변경되었는지', 'For changed equipment, the change followed the management-of-change procedure'),
    T('신설·변경 공정·설비 운전절차에 대해 운전원 교육·훈련을 하고 숙지했는지', 'Operators were trained on the new or changed operating procedures and know them')
  ];
  /* 제51조 자체감사 — 1년마다, 심사기준 5항목 (원문 확인 2026-09-25) */
  const AUDIT_CHECK = () => [
    T('사용 중인 안전작업지침·절차 등 각종 기준과 절차가 현재의 공정·설비에 맞는지 확인했다', 'Checked that the work instructions and procedures in use fit the current process and equipment'),
    T('감사팀에 감사 대상 공정에 전문 지식을 갖춘 사람이 1명 이상 참여했다', 'At least one person with expert knowledge of the audited process was on the team'),
    T('지속적인 조사·연구나 정밀검토가 필요한 사항은 계속 조사·연구하고 있다', 'Items needing further study or detailed review are being followed up'),
    T('도출된 문제점에 필요한 조치를 이행하고 문서로 기록·관리한다', 'Actions on the findings are carried out and documented'),
    T('자체감사 보고서를 3년 이상 보관한다', 'Audit reports are kept for at least 3 years')
  ];
  S.PSSR_ITEMS = PSSR_ITEMS; S.AUDIT_CHECK = AUDIT_CHECK;
  const pssrBlank = () => ({ t: '', moc: '', date: S.iso(S.today()), team: '', ck: {}, note: {} });
  const pssrState = () => { const v = S.load('psm.pssr', null); return v && v.draft ? { draft: Object.assign(pssrBlank(), v.draft), list: Array.isArray(v.list) ? v.list : [] } : { draft: pssrBlank(), list: [] }; };
  const pssrResult = (d) => { const vals = PSSR_ITEMS().map((_, i) => (d.ck || {})[i] || ''); const ng = vals.filter((v) => v === 'ng').length, open = vals.filter((v) => !v).length; return { ng, open, ok: !ng && !open && vals.includes('ok') }; };
  const auditBlank = () => ({ date: S.iso(S.today()), scope: '', team: '', el: {}, ck: {} });
  const auditState = () => Object.assign(auditBlank(), S.load('psm.audit', null) || {});
  S.pssrApi = { state: pssrState, result: pssrResult }; S.auditApi = { state: auditState }; S.PSM12 = PSM12;

  /* 5단계 — 위험물안전관리법 (법·시행령·시행규칙 원문 확인 2026-09-25). 지정수량은 data/standards.js의 SHE.DG_ITEMS(시행령 별표1) */
  const DG_EX = { type: 'gen', rows: [{ id: 'k4al', q: '1000' }, { id: 'k3aa', q: '20' }, { id: 'k42n', q: '3000' }] };
  /* 시설 종류와 예방규정·정기점검 대상 배수(시행령 제15조①·제16조) */
  const DG_TYPES = () => [
    ['mfg', T('제조소', 'Manufacturing facility'), 10],
    ['gen', T('일반취급소', 'General handling facility'), 10],
    ['indoor', T('옥내저장소', 'Indoor storage'), 150],
    ['outdoor', T('옥외저장소', 'Outdoor storage'), 100],
    ['tank', T('옥외탱크저장소', 'Outdoor tank storage'), 200]
  ];
  const DG_DUTIES = () => [
    [T('지정수량 이상은 허가받은 제조소등에서만 저장·취급(관할 소방서장 승인을 받으면 90일 이내 임시 저장·취급 가능). 여러 위험물은 각 수량을 지정수량으로 나눈 값의 합이 1 이상이면 지정수량 이상으로 봄', 'At or above the designated quantity, store and handle only in a licensed facility (up to 90 days temporarily with fire-station approval). For several substances, the sum of each quantity divided by its designated quantity counts; 1 or more means at or above'), T('법 제5조①②⑤', 'Art. 5(1)(2)(5)')],
    [T('지정수량 미만은 시·도 조례가 정한 기준을 따름', 'Below the designated quantity, follow the city or provincial ordinance'), T('법 제4조', 'Art. 4')],
    [T('제조소등 설치·변경은 시·도지사 허가. 위치·구조·설비 변경 없이 품명·수량·지정수량 배수만 바꿀 때는 1일 전까지 신고', 'Installing or altering a facility needs a provincial licence; changing only the substance, quantity or multiple needs notice one day before'), T('법 제6조①②', 'Art. 6(1)(2)')],
    [T('위험물안전관리자 — 제조소등마다 선임, 선임 14일 이내 소방서 신고, 해임·퇴직 후 30일 이내 재선임, 부재 시 대리자(30일 이내). 화학물질관리법상 인체·생태 유해성 물질이면 안전교육을 받은 유해화학물질관리자를 선임할 수 있음', 'Hazardous-materials safety manager — one per facility, reported within 14 days, replaced within 30 days, deputy for up to 30 days. For substances hazardous under the Chemicals Control Act, a trained hazardous-chemical manager may be appointed'), T('법 제15조①②③⑤, 시행령 제11조', 'Art. 15(1)(2)(3)(5); Decree 11')],
    [T('위험물취급자격자가 아닌 사람은 안전관리자나 대리자가 참여한 상태에서만 위험물을 취급', 'People without a handling qualification may handle hazardous materials only with the manager or deputy present'), T('법 제15조⑦', 'Art. 15(7)')],
    [T('예방규정 — 사용 시작 전 작성해 시·도지사에게 제출(변경 때도). 지정수량 10배 이상 제조소·일반취급소, 100배 옥외저장소, 150배 옥내저장소, 200배 옥외탱크저장소, 암반탱크저장소, 이송취급소. 합 3천배 이상은 이행 실태 평가 대상', 'Prevention rules — written and submitted before use (and on change) for manufacturing and general handling facilities at 10×, outdoor storage at 100×, indoor storage at 150×, outdoor tank storage at 200×, rock-cavern tanks and pipelines; 3,000× or more is subject to implementation reviews'), T('법 제17조, 시행령 제15조', 'Art. 17; Decree 15')],
    [T('정기점검 — 예방규정 대상과 지하탱크·이동탱크저장소, 지하 매설 탱크가 있는 제조소 등은 연 1회 이상. 안전관리자가 점검하고 30일 이내 결과 제출, 기록 3년 보존', 'Periodic check — at least yearly for facilities needing prevention rules, underground and mobile tanks, and sites with buried tanks; done by the safety manager, results filed within 30 days and kept 3 years'), T('법 제18조①②, 시행령 제16조, 규칙 제64·67·68조', 'Art. 18(1)(2); Decree 16; Rule 64, 67, 68')],
    [T('정기검사 — 액체위험물 50만L 이상 옥외탱크저장소는 소방본부·소방서의 정기검사', 'Periodic inspection by the fire service for outdoor tank storage of 500,000 L or more of liquids'), T('법 제18조③, 시행령 제17조', 'Art. 18(3); Decree 17')],
    [T('자체소방대 — 같은 사업소에서 제4류를 취급하는 제조소·일반취급소의 최대수량 합이 지정수량 3천배 이상이면 화학소방자동차와 대원을 둠', 'On-site fire brigade — when Class 4 handled in manufacturing and general handling facilities at one site totals 3,000× or more, keep chemical fire engines and crew'), T('법 제19조, 시행령 제18조·별표8', 'Art. 19; Decree 18, Annex 8')],
    [T('안전교육 — 안전관리자가 되려는 사람 강습교육 24시간(최초 선임 전), 안전관리자 실무교육 8시간(선임 6개월 이내, 이후 2년마다, 한국소방안전원)', 'Training — 24 h course before first appointment for would-be managers; 8 h refresher within 6 months of appointment and every 2 years after (Korea Fire Safety Institute)'), T('법 제28조, 규칙 제78조·별표24', 'Art. 28; Rule 78, Annex 24')],
    [T('제조소등은 지정된 장소가 아니면 흡연 금지, 금연구역 표지 설치', 'No smoking at facilities except in designated places; post no-smoking signs'), T('법 제19조의2', 'Art. 19-2')]
  ];
  const dgOf = (id) => S.DG_ITEMS.find((x) => x.id === id);
  function dgCalc(v) {
    const rows = (v.rows || []).map((r) => { const it = dgOf(r.id); const q = n(r.q); return { it, q, x: it && q != null ? q / it.q : null }; });
    const sum = rows.reduce((a, r) => a + (r.x || 0), 0);
    const sum4 = rows.filter((r) => r.it && r.it.cls === 4).reduce((a, r) => a + (r.x || 0), 0);
    const liters = rows.filter((r) => r.it && r.it.u === 'L').reduce((a, r) => a + (r.q || 0), 0);
    return { rows, sum, sum4, liters, any: rows.some((r) => r.x != null) };
  }

  const TQ_EX = { sih4: '300', nf3: '6000', hfaq: '4000', h2: '800' };
  const tqRatioOf = (v) => (r) => {
    if (r.tqs) {
      const h = n(v[r.id + '.h']), s = n(v[r.id + '.s']);
      return h == null && s == null ? null : Math.max(h == null ? 0 : h / r.tq, s == null ? 0 : s / r.tqs);
    }
    const q = n(v[r.id]); return q == null ? null : q / r.tq;
  };

  S.pages.psm = {
    render(sub) {
      /* #psm/tq · #psm/moc · #psm/eval · #psm/chem → 해당 탭 (탭 클릭에 의한 재렌더 때는 선택 유지) */
      if (!S.state.refreshing && ['tq', 'moc', 'pssr', 'audit', 'eval', 'chem', 'dg'].includes(sub)) S.save('tab.psm', sub);
      const tab = S.tab('psm', 'board');
      const board = Object.assign({}, PSM_DEFAULT, S.load('psm.board', {}));
      const isEx = !S.load('psm.board', null);
      const st = () => [['done', T('이행', 'In place')], ['doing', T('보완 중', 'Improving')], ['gap', T('미흡', 'Gap')], ['todo', T('예정', 'Planned')]];
      const cnt = (v) => PSM12.filter((e) => board[e.id] === v).length;
      const moc = S.load('psm.moc', null) || MOC_DEFAULT;
      const gasSt = S.load('psm.gas', { id: 'ph3', v: '0.4' });
      const gc = S.CHEMICALS.find((c) => c.id === gasSt.id);
      const gj = S.judgeExposure(gc, null, null, n(gasSt.v));
      const tqSaved = S.load('psm.tq', null), tqEx = !tqSaved, tqv = tqSaved || TQ_EX;
      const tqRatio = tqRatioOf(tqv);
      const tqAny = S.PSM_TQ.some((r) => tqRatio(r) != null);
      const tqR = S.PSM_TQ.reduce((a, r) => a + (tqRatio(r) || 0), 0);
      return `
      ${ui.head(T('6대 직무 · 공정안전', 'Six functions · Process safety'), T('공정안전 (PSM)', 'Process safety (PSM)'),
        T('PSM 요소와 관련 지침을 관리하고, 위험성평가로 화재·폭발·누출 위험을 찾아 개선합니다.', 'Manage PSM elements and guides, and find and fix fire, explosion and release risks through hazard analysis.'),
        T('장비 안전관리, 변경관리, 법규 준수를 지원합니다.', 'Also supports equipment safety, management of change and compliance.'))}
      ${ui.tabs('psm', [{ id: 'board', label: T('현황판', 'Board') }, { id: 'tq', label: T('대상 판정', 'Threshold check') }, { id: 'moc', label: T('변경관리(MOC)', 'Change (MOC)') }, { id: 'pssr', label: T('가동 전 점검', 'Pre-startup review') }, { id: 'audit', label: T('자체감사', 'Self-audit') }, { id: 'eval', label: T('이행상태평가', 'Implementation assessment') }, { id: 'chem', label: T('화학·고압가스 의무', 'Chemical & gas duties') }, { id: 'dg', label: T('위험물', 'Hazardous materials') }, { id: 'gas', label: T('감지값·SOP·지침', 'Readings, SOPs, guides') }], tab)}
      ${tab === 'dg' ? (() => {
        const dv = S.load('psm.dg', null) || DG_EX, dEx = !S.load('psm.dg', null);
        const r = dgCalc(dv), types = DG_TYPES(), ty = types.find(([k]) => k === dv.type) || types[1];
        const on = (ok, yes, no) => ok ? ui.pill('warn', yes) : ui.pill('ok', no);
        const itemOpts = (sel) => Object.keys(S.DG_CLASS).map((c) => `<optgroup label="${S.esc(L(S.DG_CLASS[c]))}">${S.DG_ITEMS.filter((x) => String(x.cls) === c).map((x) => `<option value="${x.id}" ${x.id === sel ? 'selected' : ''}>${S.esc(L(x))} — ${S.fmt(x.q)} ${x.u}</option>`).join('')}</optgroup>`).join('');
        return `
      <section class="panel stack" id="anchor-dg">${ui.title(T('위험물 지정수량 배수 판정', 'Designated-quantity multiple'), `${T('위험물안전관리법 제5조⑤ · 시행령 별표1', 'Dangerous Substances Act Art. 5(5) · Decree Annex 1')} ${dEx ? ui.ex() : ''}`)}
        <p class="small">${T('같은 장소에서 저장·취급하는 위험물마다 품명과 최대 수량을 넣으면 지정수량으로 나눈 값을 더해 배수를 구하고, 시설 종류에 따라 예방규정·정기점검·정기검사·자체소방대 대상인지 보여 줍니다. 품명(인화점·수용성 등)은 사용하는 제품의 MSDS 15번 항목(법적 규제)으로 확인하세요.', 'Enter each hazardous material stored or handled in the same place and its maximum quantity. The ratios to the designated quantities are summed, and the facility type shows whether prevention rules, periodic checks, periodic inspection or an on-site fire brigade apply. Confirm the category (flash point, water solubility…) from section 15 of the product MSDS.')}</p>
        <div class="field" style="max-width:320px"><label for="dg-type">${T('시설 종류', 'Facility type')}</label><select id="dg-type" data-dg-type>${types.map(([k, l]) => `<option value="${k}" ${k === ty[0] ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('품명 (지정수량)', 'Category (designated quantity)')}</th><th>${T('최대 수량', 'Maximum quantity')}</th><th class="n">${T('배수', 'Multiple')}</th><th></th></tr></thead><tbody>
          ${r.rows.map((row, i) => `<tr><td style="min-width:14em"><select data-dg-row="${i}" data-k="id" aria-label="${T('품명', 'Category')} ${i + 1}">${itemOpts(row.it ? row.it.id : '')}</select>${row.it && row.it.d ? `<div class="xs muted" style="margin-top:4px">${S.esc(L(row.it.d))}</div>` : ''}</td>
            <td class="nowrap"><input type="number" min="0" step="any" data-dg-row="${i}" data-k="q" value="${S.esc((dv.rows[i] || {}).q || '')}" style="max-width:130px" aria-label="${T('최대 수량', 'Maximum quantity')} ${i + 1}"> ${row.it ? row.it.u : ''}</td>
            <td class="n nowrap">${row.x == null ? '–' : `<b>${S.fmt(row.x, 2)}</b>`}</td>
            <td><button class="btn danger sm" type="button" data-dg-del="${i}" aria-label="${T('삭제', 'Delete')}">×</button></td></tr>`).join('') || `<tr><td colspan="4" class="small muted">${T('품명을 추가하세요', 'Add a category')}</td></tr>`}
        </tbody></table></div>
        <div class="row"><button class="btn ghost sm" type="button" id="dg-add">+ ${T('품명 추가', 'Add category')}</button><button class="btn ghost sm" type="button" id="dg-clear">${T('비우기', 'Clear')}</button><button class="btn ghost sm" type="button" id="dg-ex">${T('예시 불러오기', 'Load example')}</button></div>
        <div class="result">
          <div class="row" style="justify-content:space-between"><b>${T('지정수량 배수 합', 'Sum of multiples')}</b><span class="num" style="font-size:calc(22px * var(--fz));font-weight:600">${S.fmt(r.sum, 2)}${T('배', '×')}</span></div>
          ${!r.any ? `<span class="small muted">${T('수량을 입력하세요', 'Enter quantities')}</span>` : `
          <div>${r.sum >= 1 ? ui.pill('bad', T('지정수량 이상 — 허가받은 제조소등에서만 저장·취급, 위험물안전관리자 선임 (법 제5조①·제6조·제15조)', 'At or above — only in a licensed facility, with a safety manager (Arts. 5(1), 6, 15)')) : ui.pill('ok', T('지정수량 미만 — 시·도 조례 기준 적용 (법 제4조)', 'Below — the city or provincial ordinance applies (Art. 4)'))}</div>
          ${r.sum >= 1 ? `<div class="table-wrap"><table class="data"><tbody>
            <tr><td>${T('예방규정 작성·제출', 'Prevention rules')} <span class="xs muted">${ty[1]} ${S.fmt(ty[2])}${T('배 이상', '× or more')}</span></td><td>${on(r.sum >= ty[2], T('해당', 'Applies'), T('해당 없음', 'No'))}</td></tr>
            <tr><td>${T('정기점검 (연 1회 이상)', 'Periodic check (yearly)')} <span class="xs muted">${T('예방규정 대상과 같음', 'Same scope as prevention rules')}</span></td><td>${on(r.sum >= ty[2], T('해당', 'Applies'), T('해당 없음', 'No'))}</td></tr>
            <tr><td>${T('예방규정 이행 실태 평가', 'Implementation review')} <span class="xs muted">${T('예방규정 대상 중 3천배 이상', '3,000× or more among those')}</span></td><td>${on(r.sum >= ty[2] && r.sum >= 3000, T('해당', 'Applies'), T('해당 없음', 'No'))}</td></tr>
            ${ty[0] === 'tank' ? `<tr><td>${T('정기검사 (소방본부·소방서)', 'Periodic inspection (fire service)')} <span class="xs muted">${T('액체위험물 50만L 이상', '500,000 L of liquid or more')} · ${S.fmt(r.liters)} L</span></td><td>${on(r.liters >= 500000, T('해당', 'Applies'), T('해당 없음', 'No'))}</td></tr>` : ''}
            ${ty[0] === 'mfg' || ty[0] === 'gen' ? `<tr><td>${T('자체소방대', 'On-site fire brigade')} <span class="xs muted">${T('제4류 합', 'Class 4 total')} ${S.fmt(r.sum4, 2)}${T('배 — 같은 사업소의 제4류 제조소·일반취급소 전체 합으로 판단', '× — judged on all Class 4 manufacturing and handling facilities at the site')}</span></td><td>${on(r.sum4 >= 3000, T('해당 (3천배 이상)', 'Applies (3,000×+)'), T('이 시설만으로는 미만', 'Below for this facility alone'))}</td></tr>` : ''}
          </tbody></table></div>` : ''}`}
        </div>
        ${ty[0] === 'gen' ? `<p class="small muted">${T('일반취급소 예외: 제4류(특수인화물 제외)만 50배 이하로 취급하고 제1석유류·알코올류가 10배 이하이면서, 보일러·버너 등 소비 설비이거나 용기에 옮겨 담는·차량 탱크에 주입하는 일반취급소는 예방규정·정기점검 대상에서 빠집니다(시행령 제15조①7).', 'Exception: a general handling facility with only Class 4 (no special flammables) at 50× or less, Class 1 petroleum and alcohols at 10× or less, that burns fuel (boilers, burners) or fills containers or vehicle tanks, is exempt (Decree 15(1)7).')}</p>` : ''}
        <p class="xs muted">${T('과산화수소는 농도 36중량% 이상, 질산은 비중 1.49 이상만 제6류 위험물입니다. 알코올류는 탄소 1~3개 포화1가 알코올(예: 아이소프로필알코올)이며 60중량% 미만 수용액 등은 제외됩니다. 예시 수량은 가상 값입니다. 지하탱크·이동탱크저장소와 지하 매설 탱크가 있는 제조소 등은 배수와 관계없이 정기점검 대상입니다(시행령 제16조).', 'Hydrogen peroxide counts as Class 6 only at 36 wt% or more, nitric acid only at specific gravity 1.49 or more. Alcohols are saturated monohydric alcohols with 1–3 carbons (e.g. isopropyl alcohol); aqueous solutions under 60 wt% etc. are excluded. Example quantities are fictional. Underground and mobile tanks and sites with buried tanks need periodic checks regardless of the multiple (Decree 16).')}${S.cite('lawDg', 'lawDgDecree', 'lawDgRule')}</p>
      </section>
      <section class="panel">${ui.title(T('위험물안전관리법 핵심 의무', 'Key duties under the Dangerous Substances Safety Act'), T('반도체 용제·전구체를 저장·취급하는 제조소등', 'Facilities storing or handling fab solvents and precursors'))}
        <ul class="facts">${DG_DUTIES().map(([t, b]) => `<li>${t} <span class="basis law">${b}</span></li>`).join('')}</ul>
        <p class="xs muted" style="margin-top:8px">${T('위험물안전관리법은 소방청 소관으로, 산업안전보건법의 PSM·화학물질관리법과 별도로 적용됩니다. 같은 물질이 세 법에 동시에 해당할 수 있으니 물질별로 각각 확인하세요.', 'The Act is administered by the National Fire Agency and applies alongside OSH Act PSM and the Chemicals Control Act; one substance may fall under all three, so check each law.')}${S.cite('lawDg', 'lawDgDecree', 'lawDgRule')}</p>
      </section>`; })() : ''}
      ${tab === 'board' ? `
      <section class="grid g3">
        <div class="panel span2">${ui.title(T('SK하이닉스 공개 현황', 'What SK hynix discloses'))}
          ${facts([
            { t: { ko: 'ISO 45001·ISO 14001·공정안전관리(PSM)를 하나의 SHE경영시스템으로 통합 운영', en: 'ISO 45001, ISO 14001 and PSM run as one SHE management system' }, src: 'sr2026' },
            { t: { ko: 'SHE·PSM 담당자가 자발적 제안기구 SHE Committee에 참여', en: 'SHE and PSM staff take part in the voluntary SHE Committee' }, src: 'sr2026' },
            { t: { ko: '가스·화학물질 누출 감시: Target형(장비·설비)·Ambient형(구역) 감지기를 중앙방재실에서 24시간 모니터링, 이상 시 ERT 출동', en: 'Leak surveillance: target-type and ambient-type detectors watched 24/7 from the central control room; ERT responds' }, src: 'sr2026' },
            { t: { ko: '경기남부·충북권 공정안전협의회 회원사', en: 'Member of the Southern Gyeonggi and Chungbuk process-safety councils' }, src: 'sr2025' },
            { t: { ko: 'MSDS 사전 검토에 2023년부터 AI 기술 도입, 정기·수시 개정 제도 운영', en: 'AI used since 2023 to pre-review MSDS; periodic and ad-hoc revision system' }, src: 'sr2026' },
            { t: { ko: '2026.6 청주 가스룸 사고 2건은 공정안전보고서 부적정 이행(사전점검 미실시, 허가 없이 가스 작업 개시)에 따른 사고로 고용노동부가 확인 — PSM이 서류가 아니라 현장에서 작동해야 하는 이유', en: 'MOEL found the two June 2026 Cheongju gas-room events resulted from improper PSM implementation (pre-checks skipped, gas work without a permit) — why PSM must work in the field, not just on paper' }, src: 'moel0920' }
          ])}
          <p class="small" style="margin-top:8px"><a href="#cases/cj-2026-gasroom">${T('청주 가스룸 사고 재발방지 분석 보기', 'Open the Cheongju gas-room recurrence analysis')} →</a> · <a href="#cases/selfcheck">${T('업계 공통 지적 사항 자가점검', 'Industry findings self-check')} →</a></p>
        </div>
        <div class="panel">${ui.title(T('요소 이행 현황', 'Element status'), isEx ? ui.ex() : '')}
          <div class="grid g2">
            <div class="kpi"><span class="k">${T('이행', 'In place')}</span><span class="v">${cnt('done')}</span></div>
            <div class="kpi"><span class="k">${T('보완 중', 'Improving')}</span><span class="v">${cnt('doing')}</span></div>
            <div class="kpi"><span class="k">${T('미흡', 'Gap')}</span><span class="v" style="color:var(--bad)">${cnt('gap')}</span></div>
            <div class="kpi"><span class="k">${T('예정', 'Planned')}</span><span class="v">${cnt('todo')}</span></div>
          </div>
        </div>
      </section>
      <section class="panel">${ui.title(T('PSM 12대 요소 현황판', 'PSM 12-element board'), T('공정안전보고서 구성(시행규칙 제50조)을 실행 단위로 나눈 정리', 'Rule Art. 50 report contents organised as working elements'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>#</th><th>${T('요소', 'Element')}</th><th>${T('제50조', 'Art. 50')}</th><th>${T('내용', 'Contents')}</th><th>${T('상태', 'Status')}</th><th>${T('연결', 'Go to')}</th></tr></thead><tbody>
          ${PSM12.map((e, i) => `<tr><td class="n">${i + 1}</td><td><b>${L(e.t)}</b></td><td class="n">${S.state.lang === 'ko' ? e.law : e.law.replace('①', '(1)').replace(/[가나다라마바사아]/, (c) => '(' + 'abcdefgh'['가나다라마바사아'.indexOf(c)] + ')')}</td><td class="small">${L(e.d)}
            ${e.req ? `<details class="req"><summary>${T(`고시 제${e.req.art}조 필수 포함사항`, `Must include (Notice Art. ${e.req.art})`)}</summary><ul class="clean">${L(e.req).map((x) => `<li>${x}</li>`).join('')}</ul></details>` : ''}</td>
            <td>${statusSel('psm-' + e.id, board[e.id], st())}</td><td class="small"><a href="#${e.link}">${PSM_GO()[e.link] || T('열기', 'Open')} →</a></td></tr>`).join('')}
        </tbody></table></div>
        <p class="xs muted" style="margin-top:8px">${T('법령상 공정안전보고서는 공정안전자료·공정위험성평가서·안전운전계획·비상조치계획 4부분으로 구성되며, 흔히 말하는 “12대 요소”는 이를 실행 단위로 나눈 것입니다. ‘필수 포함사항’은 PSM 고시가 각 계획에 담도록 정한 항목입니다. 상태값은 예시이며 이 브라우저에 저장됩니다.', 'By law the PSM report has four parts — safety information, hazard analysis, safe operating plan and emergency plan; the common “12 elements” split these into working units. “Must include” lists what the PSM notice requires in each plan. Status values are examples saved in this browser.')}${S.cite('lawRule', 'moelPsm')}</p>
      </section>` : ''}
      ${tab === 'moc' ? `
      <section class="panel" id="anchor-moc">${ui.title(T('변경요소 관리(MOC) 트래커', 'Management-of-change tracker'), T('위험성평가 · 가동 전 점검 · SOP 개정 · 교육이 모두 끝나야 가동', 'Start-up only after assessment, PSSR, SOP update and training'))}
        <form class="row" id="mocForm" style="margin-bottom:10px">
          <input type="text" id="moc-t" placeholder="${T('변경 내용', 'Change')}" style="flex:1;min-width:200px" required>
          <select id="moc-type" aria-label="${T('유형', 'Type')}">${MOC_TYPES().map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select>
          <button class="btn" type="submit">${T('등록', 'Register')}</button>
        </form>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('변경', 'Change')}</th><th>${T('유형', 'Type')}</th><th>${T('사업장', 'Site')}</th><th>${T('평가 기법', 'Method')}</th><th>PSSR</th><th>${T('SOP 개정', 'SOP update')}</th><th>${T('교육', 'Training')}</th><th>${T('가동 판단', 'Start-up')}</th><th></th></tr></thead><tbody>
          ${moc.map((m) => { const ready = m.pssr && m.sop && m.edu; return `<tr><td>${S.esc(L(m.t))} ${m.id <= 3 && !m.user ? ui.ex() : ''}</td><td class="small">${(MOC_TYPES().find(([v]) => v === m.type) || [, ''])[1]}</td><td class="small">${L(S.SITES[m.site].name)}</td>
            <td class="small">${({ fs: T('빈도·강도법', 'Frequency–severity'), hazop: 'HAZOP', whatif: 'What-if', fmea: 'FMEA', lopa: 'LOPA' })[m.ra] || T('미정', 'TBD')}</td>${['pssr', 'sop', 'edu'].map((k) => `<td><input type="checkbox" data-moc="${m.id}" data-k="${k}" ${m[k] ? 'checked' : ''} aria-label="${k}"></td>`).join('')}
            <td>${ready ? ui.pill('ok', T('가동 가능', 'Ready')) : ui.pill('warn', T('미완료', 'Not ready'))}
              ${ready ? '' : `<div class="xs" style="margin-top:4px;display:grid;gap:2px">${!m.pssr ? `<a href="#psm/pssr" data-pssr-moc="${m.id}">${T('가동 전 점검 작성', 'Write the PSSR')} →</a>` : ''}${!m.sop ? `<a href="#sop">${T('SOP 개정 확인', 'Update the SOP')} →</a>` : ''}${!m.edu ? `<a href="#training">${T('교육 기록', 'Record training')} →</a>` : ''}</div>`}</td><td><button class="btn danger sm" type="button" data-moc-del="${m.id}">×</button></td></tr>`; }).join('')}
        </tbody></table></div>
        <p class="xs muted" style="margin-top:8px">KOSHA C-C-53-2026 · C-C-52-2026 ${S.cite('koshaGuide')} · ${T('PSM 고시 제37조는 변경요소 관리계획에 정상변경·비상변경 절차, 변경관리위원회, 변경요구서 서식을 담도록 정합니다.', 'PSM Notice Art. 37 requires normal and emergency change procedures, a change committee and a change-request form.')}${S.cite('moelPsm')}</p>
      </section>` : ''}
      ${tab === 'pssr' ? (() => {
        const ps = pssrState(), d = ps.draft, mocs = S.load('psm.moc', null) || MOC_DEFAULT, r = pssrResult(d);
        const OPTS = [['', T('미확인', 'Unchecked')], ['ok', T('적합', 'OK')], ['ng', T('부적합', 'Not OK')], ['na', T('해당 없음', 'N/A')]];
        const RES = (x) => x.ok ? ui.pill('ok', T('시운전 가능', 'Ready for trial run')) : ui.pill('bad', T('시운전 보류', 'Hold'));
        return `
      <section class="panel stack" id="anchor-pssr">${ui.title(T('가동 전 안전점검 (PSSR)', 'Pre-startup safety review (PSSR)'), T('PSM 고시 제49조 — 시운전 전 최소 확인 7항목', 'PSM Notice Art. 49 — seven minimum checks before the trial run'))}
        <p class="small">${T('새 설비를 설치하거나 공정·설비를 바꾸면 시운전 전에 안전점검을 하고 결과를 기록·보존합니다. 연결할 MOC를 고르고 모든 항목이 적합이면 저장할 때 그 변경 건의 PSSR 칸이 자동으로 체크됩니다.', 'After installing new equipment or changing a process or equipment, do a safety review before the trial run and keep the record. Pick the linked MOC; if every item is OK, saving ticks its PSSR box automatically.')}</p>
        <div class="form-grid">
          <div class="field"><label for="ps-t">${T('점검 대상 (설비·변경 내용)', 'What is reviewed (equipment / change)')}</label><input type="text" id="ps-t" data-ps="t" value="${S.esc(d.t)}"></div>
          <div class="field"><label for="ps-moc">${T('연결된 MOC', 'Linked MOC')}</label><select id="ps-moc" data-ps="moc"><option value="">${T('없음 (신설 설비 등)', 'None (new equipment etc.)')}</option>${mocs.map((m) => `<option value="${m.id}" ${String(d.moc) === String(m.id) ? 'selected' : ''}>${S.esc(L(m.t))}${m.pssr ? ' ✓' : ''}</option>`).join('')}</select></div>
          <div class="field"><label for="ps-date">${T('점검일', 'Date')}</label><input type="date" id="ps-date" data-ps="date" value="${S.esc(d.date)}"></div>
          <div class="field"><label for="ps-team">${T('점검팀', 'Review team')}</label><input type="text" id="ps-team" data-ps="team" value="${S.esc(d.team)}"></div>
        </div>
        <div class="table-wrap"><table class="data"><thead><tr><th class="n">#</th><th>${T('확인 항목 (고시 제49조)', 'Check (Notice Art. 49)')}</th><th>${T('결과', 'Result')}</th><th>${T('근거·메모', 'Evidence / notes')}</th></tr></thead><tbody>
          ${PSSR_ITEMS().map((it, i) => `<tr><td class="n">${i + 1}</td><td class="small" style="min-width:14em">${it}</td>
            <td><select data-ps-ck="${i}" aria-label="${T('결과', 'Result')} ${i + 1}">${OPTS.map(([k, l]) => `<option value="${k}" ${((d.ck || {})[i] || '') === k ? 'selected' : ''}>${l}</option>`).join('')}</select></td>
            <td><input type="text" data-ps-note="${i}" value="${S.esc((d.note || {})[i] || '')}" aria-label="${T('근거·메모', 'Evidence / notes')} ${i + 1}"></td></tr>`).join('')}
        </tbody></table></div>
        <div class="result">
          <div>${r.ok ? ui.pill('ok', T('모든 항목 적합 — 시운전 가능, 결과를 기록·보존', 'All items OK — ready for trial run; keep the record')) : r.ng ? ui.pill('bad', T(`부적합 ${r.ng}건 — 조치 후 재점검, 시운전 보류`, `${r.ng} not OK — fix and review again; hold the trial run`)) : ui.pill('warn', T(`미확인 ${r.open}항목`, `${r.open} items unchecked`))}</div>
          <div class="row"><button class="btn sm" type="button" id="ps-save" ${r.ok || r.ng ? '' : 'disabled'}>${T('점검 기록 저장', 'Save review')}</button><button class="btn ghost sm" type="button" id="ps-new">${T('새 점검으로 비우기', 'Start a new review')}</button>${S.printLink('pssr', T('점검표 인쇄', 'Print checklist'))}</div>
        </div>
        <p class="xs muted">${T('가동전 점검지침에는 목적·적용범위·점검팀 구성·점검시기·점검표 작성·점검보고서·점검결과 처리를 담아야 합니다(고시 제36조). 기록은 이 브라우저에 저장됩니다.', 'The pre-startup procedure must cover purpose, scope, team, timing, checklist, report and follow-up (Notice Art. 36). Records are saved in this browser.')}${S.cite('moelPsm')}</p>
      </section>
      <section class="panel">${ui.title(T('점검 기록', 'Review records'), T(`${ps.list.length}건`, `${ps.list.length}`))}
        ${ps.list.length ? `<div class="table-wrap"><table class="data"><thead><tr><th>${T('점검일', 'Date')}</th><th>${T('대상', 'Subject')}</th><th>${T('결과', 'Result')}</th><th></th></tr></thead><tbody>
          ${ps.list.map((x) => `<tr><td class="num nowrap">${S.esc(x.date)}</td><td class="small">${S.esc(x.t || '–')}</td><td>${RES(pssrResult(x))}</td><td class="nowrap">${S.printLink('pssr/' + x.id, T('인쇄', 'Print'))} <button class="btn danger sm" type="button" data-ps-del="${x.id}" aria-label="${T('삭제', 'Delete')}">×</button></td></tr>`).join('')}
        </tbody></table></div>` : `<p class="small muted">${T('저장한 점검이 없습니다. MOC 트래커의 ‘가동 전 점검 작성’이나 위 양식으로 시작하세요.', 'No reviews saved yet. Start from “Write the PSSR” in the MOC tracker or the form above.')}</p>`}
      </section>`; })() : ''}
      ${tab === 'audit' ? (() => {
        const au = auditState();
        const ST = [['', T('미확인', 'Unchecked')], ['ok', T('적합', 'Adequate')], ['imp', T('개선 필요', 'Needs work')], ['gap', T('미흡', 'Gap')]];
        const c = (v) => PSM12.filter((e) => ((au.el[e.id] || {}).st || '') === v).length;
        const GO = PSM_GO();
        return `
      <section class="panel stack" id="anchor-audit">${ui.title(T('PSM 자체감사', 'PSM self-audit'), T('PSM 고시 제51조 — 1년마다, 보고서 3년 이상 보관', 'PSM Notice Art. 51 — every year; keep reports at least 3 years'))}
        <p class="small">${T('공정안전관리가 규정대로 이행되는지 12대 요소별로 평가하고 문제점의 조치를 기록합니다. ‘감사 완료 기록’을 누르면 업무판 법정 주기(PSM 자체감사)의 최근 실시일이 감사일로 바뀝니다.', 'Rate how each of the 12 elements is carried out and record actions on the findings. “Record audit done” sets the last-done date of the PSM self-audit cycle on the dashboard to the audit date.')}</p>
        <div class="form-grid">
          <div class="field"><label for="au-date">${T('감사일', 'Audit date')}</label><input type="date" id="au-date" data-au="date" value="${S.esc(au.date)}"></div>
          <div class="field"><label for="au-scope">${T('감사 대상 공정', 'Process audited')}</label><input type="text" id="au-scope" data-au="scope" value="${S.esc(au.scope)}"></div>
          <div class="field"><label for="au-team">${T('감사팀 (공정 전문가 포함)', 'Audit team (incl. a process expert)')}</label><input type="text" id="au-team" data-au="team" value="${S.esc(au.team)}"></div>
        </div>
        <div class="row" style="gap:8px">${ui.pill('ok', T(`적합 ${c('ok')}`, `Adequate ${c('ok')}`))}${ui.pill('warn', T(`개선 필요 ${c('imp')}`, `Needs work ${c('imp')}`))}${ui.pill('bad', T(`미흡 ${c('gap')}`, `Gap ${c('gap')}`))}${ui.pill('plain', T(`미확인 ${c('')}`, `Unchecked ${c('')}`))}</div>
        <div class="table-wrap"><table class="data"><thead><tr><th class="n">#</th><th>${T('요소', 'Element')}</th><th>${T('평가', 'Rating')}</th><th>${T('발견 사항·조치', 'Findings / action')}</th><th>${T('이어서', 'Follow up')}</th></tr></thead><tbody>
          ${PSM12.map((e, i) => { const v = au.el[e.id] || {}; return `<tr><td class="n">${i + 1}</td><td><b>${L(e.t)}</b></td>
            <td><select data-au-el="${e.id}" data-k="st" aria-label="${S.esc(T('평가', 'Rating') + ' — ' + L(e.t))}">${ST.map(([k, l]) => `<option value="${k}" ${(v.st || '') === k ? 'selected' : ''}>${l}</option>`).join('')}</select></td>
            <td><input type="text" data-au-el="${e.id}" data-k="note" value="${S.esc(v.note || '')}" aria-label="${S.esc(T('발견 사항·조치', 'Findings / action') + ' — ' + L(e.t))}"></td>
            <td class="small">${e.link === 'psm/audit' ? '<span class="muted">–</span>' : `<a href="#${e.link}">${GO[e.link] || T('열기', 'Open')} →</a>`}</td></tr>`; }).join('')}
        </tbody></table></div>
        <div class="stack" style="gap:6px"><b class="small">${T('자체감사 심사기준 (고시 제51조)', 'Self-audit review criteria (Notice Art. 51)')}</b>
          ${AUDIT_CHECK().map((x, i) => `<label class="check"><input type="checkbox" data-au-ck="${i}" ${au.ck[i] ? 'checked' : ''}> <span>${x}</span></label>`).join('')}</div>
        <div class="row"><button class="btn sm" type="button" id="au-done">${T('감사 완료 기록 (업무판 주기 갱신)', 'Record audit done (update dashboard)')}</button>${S.printLink('psmaudit', T('자체감사 보고서 인쇄', 'Print audit report'))}<button class="btn ghost sm" type="button" id="au-clear">${T('비우기', 'Clear')}</button></div>
        <p class="xs muted">${T('자체감사 계획에는 목적·적용범위·감사계획·감사팀 구성·감사 시행·평가 및 시정·문서화를 담아야 합니다(고시 제38조). 이행상태평가에서 같은 기준으로 심사받습니다. 입력값은 이 브라우저에 저장됩니다.', 'The self-audit plan must cover purpose, scope, plan, team, conduct, evaluation and correction, and documentation (Notice Art. 38); the implementation assessment reviews against the same criteria. Entries are saved in this browser.')}${S.cite('moelPsm')}</p>
      </section>`; })() : ''}
      ${tab === 'tq' ? `
      <section class="panel stack" id="anchor-tq">${ui.title(T('공정안전보고서 제출 대상 판정 — 규정량', 'PSM report requirement — threshold quantities'), `${T('산안법 시행령 제43조 · 별표13', 'OSH Decree Art. 43 · Annex 13')} ${tqEx ? ui.ex() : ''}`)}
        <p class="small">${T('반도체 제조업은 제43조의 7개 업종이 아니므로 <b>별표13 유해·위험물질을 규정량 이상 제조·취급·저장하는 설비</b>인지로 판단합니다. 물질마다 하루 동안 최대로 제조·취급·저장할 수 있는 양(공정 중 저장량 포함)을 넣으면 규정량 대비 비율을 합산(R)합니다. R이 1 이상이면 유해·위험설비입니다.', 'Chipmaking is not one of the seven industries in Art. 43, so the test is whether equipment makes, handles or stores <b>Annex 13 substances at or above the threshold</b>. Enter each substance’s maximum daily quantity (including in-process inventory); the ratios are summed as R. R ≥ 1 means a hazardous installation.')}</p>
        <div class="table-wrap"><table class="data"><thead><tr><th class="n">${T('별표13', 'No.')}</th><th>${T('물질', 'Substance')}</th><th>CAS</th><th class="n">${T('규정량(kg)', 'Threshold (kg)')}</th><th>${T('하루 최대량(kg)', 'Max per day (kg)')}</th><th class="n">C/T</th></tr></thead><tbody>
          ${S.PSM_TQ.map((r) => { const ratio = tqRatio(r); return `<tr><td class="n">${r.n}</td><td><b class="small">${L(r)}</b>${r.memo ? `<div class="xs muted">${L(r.memo)}</div>` : ''}</td><td class="n small">${r.cas}</td>
            <td class="n small">${r.tqs ? `${T('취급', 'Use')} ${S.fmt(r.tq)}<br>${T('저장', 'Store')} ${S.fmt(r.tqs)}` : S.fmt(r.tq)}</td>
            <td>${r.tqs ? `<div class="stack" style="gap:4px"><input type="number" min="0" step="any" data-tq="${r.id}.h" value="${S.esc(tqv[r.id + '.h'] || '')}" placeholder="${T('제조·취급', 'Make/use')}" aria-label="${S.esc(L(r))} ${T('제조·취급량', 'use')}" style="max-width:130px"><input type="number" min="0" step="any" data-tq="${r.id}.s" value="${S.esc(tqv[r.id + '.s'] || '')}" placeholder="${T('저장', 'Storage')}" aria-label="${S.esc(L(r))} ${T('저장량', 'storage')}" style="max-width:130px"></div>`
              : `<input type="number" min="0" step="any" data-tq="${r.id}" value="${S.esc(tqv[r.id] || '')}" aria-label="${S.esc(L(r))}" style="max-width:130px">`}</td>
            <td class="n">${ratio == null ? '–' : `<b${ratio >= 1 ? ' style="color:var(--bad)"' : ''}>${S.fmt(ratio, 3)}</b>`}</td></tr>`; }).join('')}
        </tbody></table></div>
        <div class="result"><div class="row" style="justify-content:space-between"><b>R = ΣC/T</b><span class="num" style="font-size:calc(20px * var(--fz));font-weight:600">${S.fmt(tqR, 3)}</span></div>
          ${tqAny ? (tqR >= 1 ? ui.pill('bad', T('R ≥ 1 — 유해·위험설비: 공정안전보고서 작성·제출 대상 (법 제44조)', 'R ≥ 1 — hazardous installation: a PSM report is required (Act Art. 44)')) : ui.pill('ok', T('R < 1 — 규정량 미만 (증설·물질 추가 때 다시 계산)', 'R < 1 — below threshold (recalculate when capacity or substances change)'))) : `<span class="small muted">${T('수량을 입력하세요', 'Enter quantities')}</span>`}</div>
        <div class="row"><button class="btn ghost sm" type="button" id="tq-clear">${T('비우기', 'Clear')}</button><button class="btn ghost sm" type="button" id="tq-ex">${T('예시 불러오기', 'Load example')}</button></div>
        <p class="xs muted">${T('별표13 비고: 규정량은 순도 100% 기준(농도가 정해진 물질은 그 농도 기준), 인화성 가스·액체는 제조·취급과 저장 규정량이 다르며 물질별로 가장 큰 비율을 씁니다. 가스를 전문으로 저장·판매하는 시설의 가스는 제외합니다. 이 표는 별표13의 51종 가운데 반도체 공정과 관련될 수 있는 물질만 추렸습니다. 예시 수량은 가상 값입니다.', 'Annex 13 notes: thresholds assume 100 % purity (or the stated concentration); flammable gases and liquids have separate use and storage thresholds and the larger ratio counts; gas held by dedicated gas storage/sales facilities is excluded. This table lists only the Annex 13 substances likely in chipmaking; example quantities are fictional.')}${S.cite('lawDecree')}</p>
      </section>` : ''}
      ${tab === 'eval' ? `
      <section class="panel" id="anchor-eval">${ui.title(T('PSM 이행상태평가', 'PSM implementation assessment'), T('고용노동부고시 제2025-30호 제54·57·58조', 'MOEL Notice 2025-30, Arts. 54, 57, 58'))}
        <div class="grid g3">
          <div><b class="small">${T('종류와 시기', 'Types and timing')}</b><ul class="facts" style="margin-top:6px">
            <li>${T('신규평가 — 보고서 심사·확인 후 1년이 지난 날부터 2년 이내', 'First assessment — within 2 years, starting 1 year after the report is reviewed and confirmed')}</li>
            <li>${T('정기평가 — 신규평가 후 4년마다 (재평가를 받으면 재평가일 기준 4년마다)', 'Periodic — every 4 years after the first (or after a re-assessment)')}</li>
            <li>${T('재평가 — 평가 후 1년이 지난 사업장: 사업주가 요청하면 6개월 이내, P·S등급 사업장이 지도·점검에서 ① 위험물질 제거·격리 없이 용접·용단 등 화기작업을 하거나 ② 변경관리절차를 지키지 않은 것이 확인되면 6개월 이내', 'Re-assessment — for sites assessed over a year ago: within 6 months of the employer’s request, or within 6 months after a P/S-grade site is found (1) doing hot work without removing or isolating hazardous substances or (2) skipping the change-management procedure')}</li></ul></div>
          <div><b class="small">${T('방법과 기준', 'Method and scoring')}</b><ul class="facts" style="margin-top:6px">
            <li>${T('지방고용노동관서 평가반(중대산업사고예방센터 감독관)이 방문해 관계자 면담, 보고서·이행 문서 확인, 현장 확인', 'A regional MOEL team (major-accident prevention centre inspectors) visits: interviews, document review, field checks')}</li>
            <li>${T('총배점 1,620점을 최고 100점으로 환산', '1,620 raw points scaled to a maximum of 100')}</li>
            <li>${T('세부항목 5단계: 우수 A(10)·양호 B(8)·보통 C(6)·미흡 D(4)·불량 E(2)', 'Items scored in five steps: A 10, B 8, C 6, D 4, E 2')}</li></ul></div>
          <div><b class="small">${T('등급 (환산점수)', 'Grades (scaled score)')}</b>
            <div class="table-wrap" style="margin-top:6px"><table class="data"><tbody>
              <tr><td><span class="grade C">P</span> ${T('우수', 'Excellent')}</td><td class="n">≥ 90</td></tr>
              <tr><td><span class="grade C">S</span> ${T('양호', 'Good')}</td><td class="n">80–90</td></tr>
              <tr><td><span class="grade B">M+</span> ${T('보통', 'Fair')}</td><td class="n">70–80</td></tr>
              <tr><td><span class="grade A">M-</span> ${T('불량', 'Poor')}</td><td class="n">&lt; 70</td></tr></tbody></table></div>
            <p class="xs muted">${T('결과는 평가 후 1개월 이내 통보되고 다음 반기부터 적용됩니다.', 'Results are notified within a month and apply from the next half-year.')}</p></div>
        </div>
        <div class="callout warn small" style="margin-top:10px">${T('재평가 사유 두 가지는 이 포털에서 바로 점검할 수 있습니다 — 화기작업은 ', 'Both re-assessment triggers can be checked here — hot work in the ')}${sopLink('hot-work')}${T(', 변경관리는 ', ', change management in the ')}<a href="#psm/moc">${T('MOC 트래커', 'MOC tracker')}</a>.</div>
        <p class="xs muted" style="margin-top:8px">${S.cite('moelPsm')}</p>
      </section>` : ''}
      ${tab === 'chem' ? `
      <section class="panel stack" id="anchor-chem">${ui.title(T('화학물질·고압가스 법정 의무', 'Chemical and high-pressure gas duties'), T('화학물질관리법 · 고압가스 안전관리법', 'Chemicals Control Act · High-Pressure Gas Safety Control Act'))}
        <p class="small">${T('반도체 사업장은 산업안전보건법의 PSM과 함께, 유해화학물질 취급시설로서 화학물질관리법을, 실란·포스핀·아르신 같은 특정고압가스 사용시설로서 고압가스 안전관리법을 적용받습니다. 두 법의 핵심 의무를 원문 기준으로 정리했습니다.', 'Besides PSM under the OSH Act, a fab is a hazardous-chemical facility under the Chemicals Control Act and, for silane, phosphine, arsine and similar gases, a specified high-pressure gas user under the High-Pressure Gas Act. The key duties are summarised from the statutes.')}</p>
        <div class="grid g2">
          <div><b class="small">${T('화학물질관리법 — 유해화학물질 취급시설', 'Chemicals Control Act — hazardous-chemical facilities')}</b><ul class="facts" style="margin-top:6px">
            ${CCA_DUTIES().map(([t, b]) => `<li>${t} <span class="basis law">${b}</span></li>`).join('')}</ul></div>
          <div><b class="small">${T('고압가스 안전관리법 — 특정고압가스 사용시설', 'High-Pressure Gas Act — specified-gas facilities')}</b><ul class="facts" style="margin-top:6px">
            ${HPG_DUTIES().map(([t, b]) => `<li>${t} <span class="basis law">${b}</span></li>`).join('')}</ul></div>
        </div>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('물질', 'Substance')}</th><th>${T('특정고압가스 (사용신고)', 'Specified gas (use notice)')}</th><th>${T('PSM 규정량 (kg)', 'PSM threshold (kg)')}</th><th>${T('화학사고 즉시 신고 기준량', 'Accident reporting threshold')}</th></tr></thead><tbody>
          ${REG_ROWS().map((x) => `<tr><td><a href="#hazards/${x.c.id}"><b class="small">${S.esc(L(x.c))}</b></a> <span class="xs muted">${x.c.f}</span></td>
            <td class="small">${x.hpg ? `${ui.pill('warn', T('해당', 'Yes'))} <span class="xs">${S.esc(L(x.hpg))}</span>` : '–'}</td>
            <td class="small">${x.tq.length ? x.tq.map((t) => `${S.fmt(t.tq)}${t.memo ? ` <span class="xs muted">(${S.esc(t.memo)})</span>` : ''}`).join('<br>') : '–'}</td>
            <td class="small">${x.rq != null ? `${x.rq} kg·L` : '–'}</td></tr>`).join('')}
        </tbody></table></div>
        <div class="row">${S.printLink('chem', T('유해화학물질 취급시설 주간 자체점검표 인쇄', 'Print the weekly facility self-inspection sheet'))}<a class="btn ghost sm" href="#prevent/chemreport">${T('화학사고·가스사고 신고 판정', 'Chemical/gas accident reporting check')} →</a></div>
        <p class="xs muted">${T('특정고압가스 명칭은 법 제20조①·시행령 제16조, 사용신고는 시행규칙 제46조①4호(양과 관계없이 신고, 시험용 등 예외)를 따랐습니다. 즉시 신고 기준량은 「화학사고 즉시 신고에 관한 규정」 별표1이며, 표에 없는 유해화학물질은 5 kg·L입니다. 유해화학물질 해당 여부와 사업장 구분(1군·2군)은 사업장 자료로 확인하세요.', 'Specified-gas names follow Act Art. 20(1) and Decree Art. 16; use notification follows Rule Art. 46(1)4 (required regardless of quantity, except testing). Reporting thresholds come from Annex 1 of the immediate-reporting rules; other hazardous chemicals use 5 kg or L. Confirm hazardous-chemical status and site group (1 or 2) from your site records.')}${S.cite('lawCca', 'lawCcaRule', 'mceReport', 'lawHpg', 'lawHpgDecree', 'lawHpgRule', 'lawDecree')}</p>
      </section>` : ''}
      ${tab === 'gas' ? `
      <section class="grid g2">
        <div class="panel stack">${ui.title(T('가스 감지기 값 즉시 판정', 'Instant gas-detector reading check'))}
          <div class="form-grid"><div class="field"><label for="gas-id">${T('가스', 'Gas')}</label><select id="gas-id">${S.chemOptions(gasSt.id)}</select></div>
          <div class="field"><label for="gas-v">${T('감지값', 'Reading')} (${gc.unit})</label><input type="number" step="any" min="0" id="gas-v" value="${S.esc(gasSt.v)}"></div></div>
          ${gj.map((x) => `<div class="row">${ui.pill(x.level, x.k)} <span class="small">${x.msg}${x.lim != null ? ` — ${S.fmt(x.v, 4)} / ${S.fmt(x.lim, 4)} ${gc.unit}` : ''}</span></div>`).join('') || `<p class="small muted">${T('감지값을 입력하세요', 'Enter a reading')}</p>`}
          <p class="xs muted">${T('순간값은 최고노출기준(C)과 NIOSH IDLH로만 비교합니다. TWA·STEL 판정은 “수치 판정”에서 하세요.', 'Instant readings are compared only with ceilings and NIOSH IDLH. Use “Measurement check” for TWA/STEL.')} ${S.cite('moelOel', 'nioshIdlh')} · <a href="#measure">${T('수치 판정 열기', 'Open measurement check')}</a></p>
          <p class="small"><a href="#gas">${T('경보 설정값 검토·혼합가스 폭발하한계·비상 이격거리', 'Alarm set points, mixture LEL, isolation distances')} →</a> · <a href="#ppe">${T('호흡보호구 선정', 'Respirator selection')} →</a></p>
        </div>
        <div class="panel">${ui.title(T('관련 SOP와 지침', 'Related SOPs & guides'))}
          <div class="row">${['gas-cylinder', 'line-break', 'pm-chamber', 'pump-scrubber', 'equip-move'].map(sopLink).join('')}</div>
          <ul class="clean small" style="margin-top:12px">${['P-12-2012', 'P-16-2012', 'P-122-2012', 'C-C-87-2026', 'P-179-2022', 'C-C-49-2026', 'C-C-37-2026', 'C-C-62-2026', 'C-C-52-2026', 'C-C-53-2026', 'C-C-55-2026'].map((k) => `<li>${S.koshaTag(k)} ${L(S.KOSHA[k])}</li>`).join('')}</ul>
          <p class="xs muted">${S.cite('koshaGuide')}</p>
        </div>
      </section>` : ''}`;
    },
    mount(root) {
      root.querySelectorAll('[data-status^="psm-"]').forEach((s) => s.addEventListener('change', () => { const b = S.load('psm.board', {}); b[s.id.slice(4)] = s.value; saveRefresh('psm.board', b); }));
      const moc = () => S.load('psm.moc', null) || MOC_DEFAULT;
      const on = (sel, ev, fn) => { const el = root.querySelector(sel); if (el) el.addEventListener(ev, fn); };   /* 탭마다 있는 요소가 다르다 */
      on('#mocForm', 'submit', (e) => { e.preventDefault(); const t = root.querySelector('#moc-t').value.trim(); if (!t) return; const list = moc(); list.push({ id: Date.now(), t: { ko: t, en: t }, type: root.querySelector('#moc-type').value, site: S.state.site, ra: '-', pssr: false, sop: false, edu: false, user: true }); saveRefresh('psm.moc', list); });
      root.querySelectorAll('[data-moc]').forEach((c) => c.addEventListener('change', () => { const list = moc(); const m = list.find((x) => String(x.id) === c.dataset.moc); m[c.dataset.k] = c.checked; saveRefresh('psm.moc', list); }));
      root.querySelectorAll('[data-moc-del]').forEach((b) => b.addEventListener('click', () => saveRefresh('psm.moc', moc().filter((x) => String(x.id) !== b.dataset.mocDel))));
      const g = S.load('psm.gas', { id: 'ph3', v: '0.4' });
      on('#gas-id', 'change', (e) => { g.id = e.target.value; g.v = ''; saveRefresh('psm.gas', g); });
      on('#gas-v', 'change', (e) => { g.v = e.target.value; saveRefresh('psm.gas', g); });
      root.querySelectorAll('[data-tq]').forEach((i) => i.addEventListener('change', () => {
        const cur = Object.assign({}, S.load('psm.tq', null) || TQ_EX); cur[i.dataset.tq] = i.value; saveRefresh('psm.tq', cur);
      }));
      on('#tq-clear', 'click', () => saveRefresh('psm.tq', {}));
      on('#tq-ex', 'click', () => { S.drop('psm.tq'); S.refresh(); });
      /* MOC → 가동 전 점검: 누른 변경 건을 점검 양식에 미리 채운다 */
      root.querySelectorAll('[data-pssr-moc]').forEach((a) => a.addEventListener('click', () => {
        const ps = pssrState(), m = moc().find((x) => String(x.id) === a.dataset.pssrMoc);
        ps.draft = Object.assign(pssrBlank(), { moc: a.dataset.pssrMoc, t: m ? L(m.t) : '' });
        S.save('psm.pssr', ps); S.save('tab.psm', 'pssr');
      }));
      /* 가동 전 점검 */
      const psSet = (fn, redraw) => { const ps = pssrState(); fn(ps.draft, ps); S.save('psm.pssr', ps); if (redraw) S.refresh(); };
      root.querySelectorAll('[data-ps]').forEach((el) => el.addEventListener('change', () => psSet((d) => {
        d[el.dataset.ps] = el.value;
        if (el.dataset.ps === 'moc' && el.value && !d.t) { const m = moc().find((x) => String(x.id) === el.value); if (m) d.t = L(m.t); }
      }, el.dataset.ps === 'moc')));
      root.querySelectorAll('[data-ps-ck]').forEach((el) => el.addEventListener('change', () => psSet((d) => { d.ck = Object.assign({}, d.ck, { [el.dataset.psCk]: el.value }); }, true)));
      root.querySelectorAll('[data-ps-note]').forEach((el) => el.addEventListener('change', () => psSet((d) => { d.note = Object.assign({}, d.note, { [el.dataset.psNote]: el.value }); })));
      on('#ps-save', 'click', () => {
        const ps = pssrState(), d = ps.draft, r = pssrResult(d);
        ps.list.unshift(Object.assign({ id: 'p' + Date.now() }, d));
        if (r.ok && d.moc) { const list = moc().map((x) => (String(x.id) === String(d.moc) ? Object.assign({}, x, { pssr: true }) : x)); S.save('psm.moc', list); }
        ps.draft = pssrBlank(); S.save('psm.pssr', ps); S.refresh();
        S.toast(r.ok && d.moc ? T('점검을 저장하고 MOC의 PSSR을 완료로 표시했습니다', 'Saved; the MOC’s PSSR is now ticked') : T('점검 기록을 저장했습니다', 'Review saved'));
      });
      on('#ps-new', 'click', () => psSet((d, ps) => { ps.draft = pssrBlank(); }, true));
      root.querySelectorAll('[data-ps-del]').forEach((b) => b.addEventListener('click', () => {
        if (!window.confirm(T('이 점검 기록을 지울까요?', 'Delete this review record?'))) return;
        const ps = pssrState(); ps.list = ps.list.filter((x) => x.id !== b.dataset.psDel); S.save('psm.pssr', ps); S.refresh();
      }));
      /* 자체감사 */
      const auSet = (fn, redraw) => { const au = auditState(); fn(au); S.save('psm.audit', au); if (redraw) S.refresh(); };
      root.querySelectorAll('[data-au]').forEach((el) => el.addEventListener('change', () => auSet((au) => { au[el.dataset.au] = el.value; })));
      root.querySelectorAll('[data-au-el]').forEach((el) => el.addEventListener('change', () => auSet((au) => { au.el = Object.assign({}, au.el); au.el[el.dataset.auEl] = Object.assign({}, au.el[el.dataset.auEl], { [el.dataset.k]: el.value }); }, el.dataset.k === 'st')));
      root.querySelectorAll('[data-au-ck]').forEach((el) => el.addEventListener('change', () => auSet((au) => { au.ck = Object.assign({}, au.ck, { [el.dataset.auCk]: el.checked }); })));
      on('#au-done', 'click', () => {
        const au = auditState();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(au.date)) { S.toast(T('감사일을 넣으세요', 'Enter the audit date')); return; }
        const cy = S.load('cycles', {}); cy['psm-audit'] = au.date; S.save('cycles', cy);
        S.toast(T(`업무판의 PSM 자체감사 최근 실시일을 ${au.date}로 기록했습니다`, `Dashboard PSM self-audit set to ${au.date}`));
      });
      on('#au-clear', 'click', () => { if (window.confirm(T('자체감사 입력값을 모두 지울까요?', 'Clear all self-audit entries?'))) { S.drop('psm.audit'); S.refresh(); } });
      /* 위험물 지정수량 배수 */
      const dgv = () => JSON.parse(JSON.stringify(S.load('psm.dg', null) || DG_EX));
      on('[data-dg-type]', 'change', (e) => { const v = dgv(); v.type = e.target.value; saveRefresh('psm.dg', v); });
      root.querySelectorAll('[data-dg-row]').forEach((el) => el.addEventListener('change', () => {
        const v = dgv(), i = Number(el.dataset.dgRow); v.rows[i] = Object.assign({}, v.rows[i], { [el.dataset.k]: el.value }); saveRefresh('psm.dg', v);
      }));
      root.querySelectorAll('[data-dg-del]').forEach((b) => b.addEventListener('click', () => { const v = dgv(); v.rows.splice(Number(b.dataset.dgDel), 1); saveRefresh('psm.dg', v); }));
      on('#dg-add', 'click', () => { const v = dgv(); v.rows.push({ id: 'k41n', q: '' }); saveRefresh('psm.dg', v); });
      on('#dg-clear', 'click', () => { const v = dgv(); saveRefresh('psm.dg', { type: v.type, rows: [] }); });
      on('#dg-ex', 'click', () => { S.drop('psm.dg'); S.refresh(); });
    }
  };

  /* ======================= 예방안전 ======================= */
  const INC_DEFAULT = [{
    id: 1, date: '2026-09-02', site: 'common', type: 'leak', what: { ko: '가스 캐비닛 실린더 교체 직후 캐비닛 내부 감지기 1차 경보(아차사고). 자동 차단으로 외부 누출 없음.', en: 'Level-1 alarm inside a gas cabinet right after a cylinder change (near miss). Auto shut-off; no release outside.' },
    why: [{ ko: '연결부에 잔류가스가 남아 있었다', en: 'Residual gas remained at the joint' }, { ko: '퍼지가 규정 횟수보다 적게 수행됐다', en: 'Fewer purge cycles than specified' }, { ko: '퍼지 횟수를 확인할 표시가 없었다', en: 'No indicator showed purge count' }, { ko: '절차서에 확인 방법이 없었다', en: 'The procedure had no verification step' }, { ko: '변경된 캐비닛 모델이 절차서에 반영되지 않았다', en: 'A new cabinet model never reached the procedure' }],
    m4: ['machine', 'management'], fix: { ko: '공학적: 퍼지 횟수 인터록 / 행정적: 절차서에 2인 확인 단계 추가, 변경관리에 절차 개정 연결', en: 'Engineering: purge-count interlock / Administrative: add two-person check to the procedure; tie MOC to procedure updates' }, level: 'eng'
  }];
  const M4 = () => [['man', T('사람 (Man)', 'Man')], ['machine', T('기계·설비 (Machine)', 'Machine')], ['media', T('작업 환경·방법 (Media)', 'Media')], ['management', T('관리 (Management)', 'Management')]];
  /* 사고 보고 의무 판정 — 예시 입력(가상) */
  const REP_DEFAULT = { dead: '0', sev3: '2', many: '2', sev6: '0', ill: '0', lost3: true,
    leak: true, chem: 'hf', qty: '60', hurt: false, urgent: false, gas: false, fire: false, evac: false, tank: false };
  /* one evaluation shared by the page and the printable report */
  function repEval() {
    const saved = S.load('prev.rep', null), r = Object.assign({}, REP_DEFAULT, saved || {});
    const rn = (k) => n(r[k]) || 0;
    const injured = rn('sev3') + rn('many') + rn('sev6') + rn('ill') > 0 || !!r.lost3 || !!r.hurt;
    const osh = rn('dead') >= 1 || rn('sev3') >= 2 || rn('many') >= 10;
    const form = rn('dead') >= 1 || !!r.lost3;
    const sapa = rn('dead') >= 1 || rn('sev6') >= 2 || rn('ill') >= 3;
    /* 화학사고 즉시 신고 (화학물질관리법 제43조②, 즉시 신고 규정 별표1 가~마목) */
    const sub = S.CHEM_REPORT.find((c) => c.id === r.chem) || S.CHEM_REPORT[0];
    const qty = n(r.qty);
    let chem = null;
    if (r.leak) {
      if (sub.q == null) chem = { level: 'warn', row: '마', t: T('관련 법령(위험물·고압가스·산안법 등)에 따라 신고하거나 빠른 시간 내 신고', 'Report under the relevant law (hazardous materials, gas, OSH, etc.) or as soon as possible') };
      else if (r.urgent) chem = { level: 'warn', row: '다', t: T('긴급 사유가 해소되면 빠른 시간 내 신고 — 신고할 수 있는 다른 종사자가 있으면 그 사람이 15분 이내 신고', 'Report as soon as the emergency allows — if another handler can report, they must do so within 15 minutes') };
      else if (r.hurt || (qty != null && qty >= sub.q)) chem = { level: 'bad', row: r.hurt ? '가' : '나', t: T('15분 이내 즉시 신고', 'Report immediately — within 15 minutes') };
      else chem = { level: 'warn', row: '라', t: T('빠른 시간 내 신고', 'Report as soon as possible'), waive: qty != null && qty < 1 };
    }
    /* 고압가스 사고 통보 (고압가스 안전관리법 제26조, 시행규칙 별표34) — 가목부터 순서대로 하나만 해당 */
    let gas = null;
    if (r.gas) {
      if (rn('dead') >= 1) gas = { row: '가', t: T('사람이 사망한 사고 — 속보 즉시 + 상보 사고 후 20일 이내', 'Fatality — immediate flash report + detailed report within 20 days') };
      else if (injured) gas = { row: '나', t: T('부상·중독 사고 — 속보 즉시 + 상보 사고 후 10일 이내', 'Injury or poisoning — immediate flash report + detailed report within 10 days') };
      else if (r.fire) gas = { row: '다', t: T('가스 누출에 의한 폭발·화재 — 속보 즉시', 'Explosion or fire from a gas leak — immediate flash report') };
      else if (r.evac) gas = { row: '라', t: T('가스시설 손괴·누출로 인명 대피 또는 공급 중단 — 속보 즉시', 'Evacuation or supply cut from damage or a leak — immediate flash report') };
      else if (r.tank) gas = { row: '마', t: T('저장탱크에서 가스 누출 — 속보 즉시', 'Gas leak from a storage tank — immediate flash report') };
      else gas = { row: '', t: '' };
    }
    return { r, ex: !saved, osh, form, sapa, sub, qty, chem, gas, injured };
  }
  const REP_FIELDS = () => [
    ['dead', T('사망자 (명)', 'Deaths')],
    ['sev3', T('3개월 이상 요양이 필요한 부상자 — 동시 발생 (명)', 'Injured needing 3+ months’ care — at once')],
    ['many', T('부상자·직업성 질병자 — 동시 발생 (명)', 'Injured or ill — at once')],
    ['sev6', T('6개월 이상 치료가 필요한 부상자 — 동일 사고 (명)', 'Injured needing 6+ months’ treatment — same accident')],
    ['ill', T('급성중독 등 직업성 질병자 — 동일 유해요인, 1년 이내 (명)', 'Occupational illness such as acute poisoning — same agent, within a year')]
  ];
  /* 5단계 — 중대재해처벌법 시행령 제4조(안전보건관리체계 구축·이행)·제5조②(관계 법령 의무이행 관리) 점검표 (원문 확인 2026-09-25, src: lawSapa)
     반기: 시행령이 ‘반기 1회 이상’ 점검·평가를 정한 항목. link: 포털에서 이어서 볼 곳 */
  const SAPA_ITEMS = () => [
    { id: 's41', art: T('제4조 제1호', 'Art. 4(1)'), t: T('안전·보건에 관한 목표와 경영방침 설정', 'Set safety and health goals and a management policy'), link: 'company', ll: T('회사 안전보건 거버넌스', 'Company governance') },
    { id: 's42', art: T('제4조 제2호', 'Art. 4(2)'), t: T('안전·보건 업무를 총괄·관리하는 전담 조직 — 안전관리자·보건관리자 등 법정 인력이 총 3명 이상이고 상시근로자 500명 이상(또는 시공능력 상위 200위 이내 건설사업자)인 경우', 'A dedicated safety and health unit — where the statutory safety and health staff total 3 or more and there are 500 or more regular workers (or a top-200 builder)'), link: 'company', ll: T('회사 안전보건 거버넌스', 'Company governance') },
    { id: 's43', art: T('제4조 제3호', 'Art. 4(3)'), half: true, t: T('유해·위험요인 확인·개선 업무절차 마련, 반기 1회 이상 점검 — 위험성평가 절차에 따라 실시하거나 결과를 보고받으면 점검한 것으로 봄', 'A procedure to find and fix hazards, checked at least half-yearly — running risk assessments under their procedure, or receiving their results, counts'), link: 'risk', ll: T('위험성평가 워크벤치', 'Risk workbench') },
    { id: 's44', art: T('제4조 제4호', 'Art. 4(4)'), t: T('예산 편성·집행 — 안전·보건 인력·시설·장비, 유해·위험요인 개선, 고용노동부장관 고시 사항', 'Budget set and spent for safety and health staff, facilities and equipment, fixing hazards, and items in the MOEL notice'), link: '', ll: '' },
    { id: 's45', art: T('제4조 제5호', 'Art. 4(5)'), half: true, t: T('안전보건관리책임자·관리감독자·안전보건총괄책임자에게 권한과 예산 부여, 평가기준 마련 후 반기 1회 이상 평가·관리', 'Give site heads, supervisors and the overall safety head authority and budget; set criteria and evaluate them at least half-yearly'), link: 'home/cycles', ll: T('업무판 법정 주기', 'Dashboard cycles') },
    { id: 's46', art: T('제4조 제6호', 'Art. 4(6)'), t: T('안전관리자·보건관리자·안전보건관리담당자·산업보건의 법정 인원 배치(다른 업무를 겸하면 고시 기준으로 업무시간 보장)', 'Assign the statutory number of safety managers, health managers, safety officers and occupational physicians (guarantee their time if they hold other duties)'), link: '', ll: '' },
    { id: 's47', art: T('제4조 제7호', 'Art. 4(7)'), half: true, t: T('종사자 의견청취 절차, 개선방안 이행 여부 반기 1회 이상 점검 — 산업안전보건위원회·안전보건 협의체 논의로 갈음 가능', 'A procedure to hear workers and check follow-up at least half-yearly — safety committee and partner council discussions count'), link: 'partner', ll: T('상생협력(협의체)', 'Partnership (council)') },
    { id: 's48', art: T('제4조 제8호', 'Art. 4(8)'), half: true, t: T('중대산업재해 대비 매뉴얼(작업중지·근로자 대피·위험요인 제거, 구호, 추가 피해방지) 마련, 반기 1회 이상 점검', 'A manual for serious accidents (stop work, evacuate, remove the hazard; rescue; prevent further harm), checked at least half-yearly'), link: 'fire', ll: T('소방·방재 비상대응', 'Fire & emergency') },
    { id: 's49', art: T('제4조 제9호', 'Art. 4(9)'), half: true, t: T('도급·용역·위탁 시 수급인의 조치 능력·기술 평가기준, 안전·보건 관리비용 기준(건설·조선은 공사·건조기간 기준) 마련, 반기 1회 이상 점검', 'For contracting out: criteria for the contractor’s capability and technology and for safety and health budgets (build time for construction and shipbuilding), checked at least half-yearly'), link: 'partner/score', ll: T('협력사 SHE 평가표', 'Contractor scorecard') },
    { id: 's51', art: T('제5조② 제1호', 'Art. 5(2)1'), half: true, t: T('안전·보건 관계 법령에 따른 의무 이행 여부 반기 1회 이상 점검(기관에 위탁 가능, 직접 하지 않으면 결과를 지체 없이 보고받음)', 'Check compliance with safety and health laws at least half-yearly (may be delegated; if not done in person, get the results without delay)'), link: 'home/cycles', ll: T('업무판 법정 주기', 'Dashboard cycles') },
    { id: 's52', art: T('제5조② 제2호', 'Art. 5(2)2'), t: T('의무 미이행이 확인되면 인력 배치·예산 추가 편성 등 이행에 필요한 조치', 'Where a duty is not met, add staff or budget as needed'), link: '', ll: '' },
    { id: 's53', art: T('제5조② 제3호', 'Art. 5(2)3'), half: true, t: T('유해·위험한 작업에 관한 법정 안전·보건교육 실시 여부 반기 1회 이상 점검', 'Check at least half-yearly that statutory training for hazardous work was given'), link: 'training', ll: T('교육 이수 관리', 'Training records') },
    { id: 's54', art: T('제5조② 제4호', 'Art. 5(2)4'), t: T('실시되지 않은 교육은 지체 없이 이행 지시·예산 확보 등 조치', 'Order any missing training at once and secure the budget'), link: 'training', ll: T('교육 이수 관리', 'Training records') }
  ];
  S.SAPA_ITEMS = SAPA_ITEMS;
  const SAPA_ST = () => [['', T('미확인', 'Unchecked')], ['ok', T('이행', 'In place')], ['part', T('보완 중', 'Improving')], ['ng', T('미흡', 'Gap')]];

  const HIER = () => [['elim', T('제거·대체', 'Eliminate / substitute')], ['eng', T('공학적 대책', 'Engineering controls')], ['adm', T('행정적 대책', 'Administrative controls')], ['ppe', T('개인보호구', 'PPE')]];

  S.pages.prevent = {
    render() {
      const k = C.kpi.ra;
      const inc = S.load('prev.inc', null) || INC_DEFAULT;
      const draft = S.load('prev.draft', { date: S.iso(S.today()), type: 'leak', what: '', why: ['', '', '', '', ''], m4: [], fix: '', level: 'eng' });
      const tbmSop = S.SOPS.find((s) => s.id === S.load('prev.tbm', 'confined'));
      const w = 320, h = 150;
      const x = (v) => 40 + (v / 6) * (w - 60);
      const dumbbell = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${T('평균 위험도 개선 전후', 'Mean risk before and after')}">
        ${[0, 2, 4, 6].map((t) => `<line class="grid-line" x1="${x(t)}" x2="${x(t)}" y1="10" y2="${h - 22}"/><text x="${x(t)}" y="${h - 8}" text-anchor="middle">${t}</text>`).join('')}
        ${k.map((r, i) => { const yy = 28 + i * 38; return `<text x="6" y="${yy + 4}" class="lbl-strong">${r.y}</text><line x1="${x(r.after)}" x2="${x(r.before)}" y1="${yy}" y2="${yy}" stroke="var(--line-2)" stroke-width="3"/>
          <circle cx="${x(r.before)}" cy="${yy}" r="6" fill="var(--bad)"/><circle cx="${x(r.after)}" cy="${yy}" r="6" fill="var(--ok)"/>
          <text x="${x(r.before) + 10}" y="${yy + 4}">${r.before}</text><text x="${x(r.after) - 10}" y="${yy + 4}" text-anchor="end">${r.after}</text>`; }).join('')}
      </svg>`;
      const quizRows = S.SOPS.map((s) => { const q = S.load('quiz.' + s.id, {}); const ans = s.quiz.filter((_, i) => q[i] != null).length; const ok = s.quiz.filter((qq, i) => Number(q[i]) === qq.a).length; return { s, ans, ok }; });
      const ev = repEval(), rep = ev.r, repEx = ev.ex, repOsh = ev.osh, repForm = ev.form, repSapa = ev.sapa;
      return `
      ${ui.head(T('6대 직무 · 예방안전', 'Six functions · Preventive safety'), T('예방안전', 'Preventive safety'),
        T('산업재해·사고조사·점검 같은 예방 활동과 위험작업 안전을 관리합니다.', 'Injuries, investigations, inspections and high-risk work in fab operations.'),
        T('산업재해 관리, 사고조사와 재발방지 대책, 점검 등 예방 활동과 반도체 제조·설비 운영의 위험작업 안전을 관리합니다. 작업 절차서 교육과 검증을 포함합니다.', 'Manage injuries, investigations and corrective actions, inspections, and high-risk work in fab operations — including procedure training and verification.'))}
      <section class="grid g3">
        <div class="panel span2">${ui.title(T('SK하이닉스 공개 운영 방식', 'SK hynix disclosed practice'))}
          ${facts([
            { t: { ko: '매년 전 사업장 모든 정기 작업 위험성평가, 중대산업사고·아차사고 발생이나 작업장 변경점 시 수시평가 — 관리감독자·작업자 직접 참여', en: 'Yearly assessment of all routine jobs at every site; ad-hoc assessment after serious accidents, near misses or workplace changes — supervisors and workers take part' }, src: 'sr2026' },
            { t: { ko: '평가 결과를 사내 ‘SHE Portal’에 게시해 관련 인원이 언제든 위험요인을 확인', en: 'Results posted on the in-house “SHE Portal” so anyone involved can see the hazards' }, src: 'sr2026' },
            { t: { ko: '예방안전팀이 ‘유해위험요인 현실화 가이드’·‘위험성산출표’를 작업자에게 안내', en: 'The Preventive Safety team issues a hazard realisation guide and risk calculation sheet' }, src: 'sr2025' },
            { t: { ko: '위험도 8 이상 또는 가스·화학물질·3대 사고유형(추락·끼임·부딪힘) 위험도 6 단위작업 943건은 현장 이행 확인·컨설팅 (2024)', en: '943 unit tasks with risk ≥ 8, or risk 6 in gas/chemical and top-3 accident types (falls, caught-in, struck-by), got field verification and consulting (2024)' }, src: 'sr2025' },
            { t: { ko: '고위험 작업을 시작부터 종료까지 관찰해 위험성평가·절차서·작업허가와 현장의 불일치 확인 (2024)', en: 'Observed high-risk jobs start to finish to find mismatches between assessments, procedures, permits and reality (2024)' }, src: 'sr2025' },
            { t: { ko: '허가 대상에서 빠지는 Gray Zone 작업을 위해 모바일 TBM 앱 구축', en: 'Mobile TBM app built for “grey-zone” jobs outside the permit scope' }, src: 'sr2024' }
          ])}
        </div>
        <div class="panel">${ui.title(T('평균 위험도 개선 전→후', 'Mean risk before → after'))}${dumbbell}
          <p class="xs muted">${T('평가 건수', 'Jobs assessed')}: ${k.map((r) => `${r.y} ${S.fmt(r.jobs)}`).join(' · ')}${S.cite('sr2024', 'sr2025', 'sr2026')}</p>
          <p class="xs muted">${T('주의: 보고서마다 위험도 척도 표기가 다릅니다(2025 보고서는 “10점 만점”, 2026 보고서는 1–20점 수준표). 연도 간 수치는 추이만 참고하세요.', 'Note: the reports describe the scale differently (2025 report: “out of 10”; 2026 report: a 1–20 level table). Read year-to-year numbers as a trend only.')}</p></div>
      </section>

      <section class="panel">${ui.title(T('위험작업 허가 매트릭스', 'High-risk permit matrix'), T('법령 원문으로 확인한 요구사항', 'Requirements checked against the statutes'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('허가 유형', 'Permit')}</th><th>${T('핵심 법적 요구', 'Key legal requirement')}</th><th>${T('측정·감시', 'Testing / watch')}</th><th>SOP</th></tr></thead><tbody>
          <tr><td><b>${T('화기작업', 'Hot work')}</b></td><td class="small">${T('준수사항 6항목, 작업 전 확인, 작업 시작~종료 서면 게시, 통풍 불충분 장소 산소 환기 금지 (규칙 제241조)', 'Six requirements, pre-job check, written posting start to finish, no oxygen for ventilation (Rule Art. 241)')}</td><td class="small">${T('11m 조건 시 화재감시자, 가스 검지·경보 (제241조의2, 제232조)', 'Fire watch under 11 m conditions; gas detection (Arts. 241-2, 232)')}</td><td>${sopLink('hot-work')}</td></tr>
          <tr><td><b>${T('밀폐공간', 'Confined space')}</b></td><td class="small">${T('작업 프로그램, 작업 전 확인 6항목, 출입구 게시 (제619조)', 'Programme, six pre-entry checks, entrance posting (Art. 619)')}</td><td class="small">${T('시작·재시작 전 산소·유해가스 측정, 기록 3년 (제619조의2), 환기 (제620조)', 'Test before start/restart, records 3 years (Art. 619-2), ventilation (Art. 620)')}</td><td>${sopLink('confined')}</td></tr>
          <tr><td><b>${T('배관 개방·화학설비', 'Line break / chemical equipment')}</b></td><td class="small">${T('도급 시 작업 전 안전·보건 정보 문서 제공 (법 제65조), 1% 이상 황산·HF·질산·염산 설비 개조·해체·내부작업은 도급승인 (시행령 제51조)', 'Written safety information before contracted work (Act Art. 65); ≥ 1 wt% sulfuric/HF/nitric/HCl equipment work needs subcontract approval (Decree Art. 51)')}</td><td class="small">${T('잔압·잔류물 확인', 'Confirm no pressure or residue')}</td><td>${sopLink('line-break')}</td></tr>
          <tr><td><b>${T('정전·에너지 차단', 'Electrical / energy isolation')}</b></td><td class="small">${T('잠금·표지 (KOSHA B-M-25-2026), 정전전로 작업 (B-E-10-2026)', 'Lockout/tagout (KOSHA B-M-25-2026), work on de-energised circuits (B-E-10-2026)')}</td><td class="small">${T('제로에너지 확인', 'Verify zero energy')}</td><td>${sopLink('loto')}</td></tr>
          <tr><td><b>${T('고소작업', 'Work at height')}</b></td><td class="small">${T('고소작업대 지침 (KOSHA C-74-2015)', 'Aerial-platform guide (KOSHA C-74-2015)')}</td><td class="small">${T('반송(OHT) 정지 구간 확인', 'Confirm the OHT stop zone')}</td><td>${sopLink('height')}</td></tr>
          <tr><td><b>${T('중량물·양중', 'Heavy lifting')}</b></td><td class="small">${T('건설장비 작업계획서 (KOSHA D-C-10-2026)', 'Construction-equipment work plan (KOSHA D-C-10-2026)')}</td><td class="small">${T('신호수·경로 통제', 'Signaller, route control')}</td><td>${sopLink('equip-move')}</td></tr>
        </tbody></table></div>
        <div class="row" style="margin-top:8px"><a class="btn sm" href="#ptw">${T('작업허가서 작성기 열기', 'Open the permit-to-work builder')} →</a><span class="xs muted">${T('PSM 고시 제46조·KOSHA C-C-49-2026 기준 — 허가 종류, 발급·승인·입회, 가스 측정, 1년 보관(밀폐공간 3년), 모니터링·절차 평가', 'Per PSM Notice Art. 46 and KOSHA C-C-49-2026 — permit types, issue, approval, attendance, gas tests, one-year retention (three years for confined space), monitoring and procedure audit')}</span></div>
        <p class="xs muted" style="margin-top:8px">${S.cite('lawStd', 'lawAct', 'lawDecree', 'koshaGuide', 'koshaCC49')}</p>
      </section>

      ${(() => {
        const sp = S.load('prev.sapa', {}), items = SAPA_ITEMS();
        const cnt = (v) => items.filter((x) => ((sp[x.id] || {}).st || '') === v).length;
        return `<section class="panel stack" id="anchor-sapa">${ui.title(T('중대재해처벌법 안전보건관리체계 점검표', 'Serious Accidents Act — safety management system check'), T('시행령 제4조 1~9호 · 제5조②', 'Decree Art. 4(1)–(9) · Art. 5(2)'))}
          <p class="small">${T('경영책임자가 갖춰야 할 안전보건관리체계와 관계 법령 의무이행 관리 조치를 한 표에 모았습니다. 반기 점검 때 항목마다 상태와 증빙을 적고 인쇄해 보고용으로 씁니다.', 'The management system and compliance-control duties of the responsible executive in one table. At each half-yearly review, record status and evidence per item and print it for reporting.')}</p>
          <div class="row" style="gap:8px">${ui.pill('ok', T(`이행 ${cnt('ok')}`, `In place ${cnt('ok')}`))}${ui.pill('warn', T(`보완 중 ${cnt('part')}`, `Improving ${cnt('part')}`))}${ui.pill('bad', T(`미흡 ${cnt('ng')}`, `Gap ${cnt('ng')}`))}${ui.pill('plain', T(`미확인 ${cnt('')}`, `Unchecked ${cnt('')}`))}</div>
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('의무', 'Duty')}</th><th>${T('주기', 'Cycle')}</th><th>${T('상태', 'Status')}</th><th>${T('증빙·메모', 'Evidence / notes')}</th></tr></thead><tbody>
            ${items.map((x) => { const v = sp[x.id] || {}; return `<tr><td style="min-width:16em">${x.t} <span class="basis law">${x.art}</span>${x.link ? ` <a class="xs" href="#${x.link}">${x.ll} →</a>` : ''}</td>
              <td class="small nowrap">${x.half ? T('반기 1회 이상', 'Half-yearly') : '–'}</td>
              <td><select data-sapa="${x.id}" data-k="st" aria-label="${S.esc(T('상태', 'Status') + ' — ' + x.art)}">${SAPA_ST().map(([k, l]) => `<option value="${k}" ${(v.st || '') === k ? 'selected' : ''}>${l}</option>`).join('')}</select></td>
              <td><input type="text" data-sapa="${x.id}" data-k="note" value="${S.esc(v.note || '')}" aria-label="${S.esc(T('증빙·메모', 'Evidence / notes') + ' — ' + x.art)}" placeholder="${T('예: 회의록·결재 문서 번호', 'e.g. minutes or approval no.')}"></td></tr>`; }).join('')}
          </tbody></table></div>
          <div class="row">${S.printLink('sapa', T('반기 점검표 인쇄', 'Print the half-yearly checklist'))}<button class="btn ghost sm" type="button" id="sapa-clear">${T('기록 비우기', 'Clear entries')}</button></div>
          <p class="xs muted">${T('반기 1회 이상 점검 항목은 업무판 법정 주기(유해·위험요인 확인·개선 절차 이행 점검, 안전보건관리책임자 등 업무수행 평가, 종사자 의견청취, 중대산업재해 대비 매뉴얼, 도급 기준 이행 점검)와 이어집니다. 법은 사업주·경영책임자의 의무를 정하며, 이 표의 상태·증빙은 연습용으로 이 브라우저에만 저장됩니다.', 'Half-yearly items tie into the dashboard cycles (hazard procedure check, evaluation of safety managers, worker feedback, serious-accident manual, contracting criteria). The law sets duties for the business owner and responsible executive; statuses and evidence here are practice entries saved in this browser only.')}${S.cite('lawSapaAct', 'lawSapa')}</p>
        </section>`;
      })()}

      <section class="grid g2">
        <div class="panel stack" id="anchor-incident">${ui.title(T('사고·아차사고 조사', 'Incident & near-miss investigation'), T('5-Why · 4M · 대책 위계', '5-Why · 4M · hierarchy of controls'))}
          <form id="incForm" class="stack">
            <div class="form-grid">
              <div class="field"><label for="inc-date">${T('발생일', 'Date')}</label><input type="date" id="inc-date" value="${S.esc(draft.date)}"></div>
              <div class="field"><label for="inc-type">${T('유형', 'Type')}</label><select id="inc-type">${[['leak', T('가스·화학물질 누출', 'Gas/chemical leak')], ['fall', T('추락', 'Fall')], ['caught', T('끼임', 'Caught-in')], ['struck', T('부딪힘', 'Struck-by')], ['shock', T('감전', 'Shock')], ['fire', T('화재·폭발', 'Fire/explosion')], ['burn', T('화상', 'Burn')], ['rad', T('방사선', 'Radiation')], ['other', T('기타', 'Other')]].map(([v, l]) => `<option value="${v}" ${draft.type === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
            </div>
            <div class="field"><label for="inc-what">${T('경위', 'What happened')}</label><textarea id="inc-what">${S.esc(draft.what)}</textarea></div>
            ${draft.why.map((w, i) => `<div class="field"><label for="inc-why${i}">${T('왜?', 'Why?')} ${i + 1}</label><input type="text" id="inc-why${i}" data-why="${i}" value="${S.esc(w)}"></div>`).join('')}
            <fieldset style="border:0;padding:0;margin:0"><legend class="lbl">${T('4M 원인 분류', '4M cause categories')}</legend><div class="row">${M4().map(([v, l]) => `<label class="check"><input type="checkbox" data-m4="${v}" ${draft.m4.includes(v) ? 'checked' : ''}> ${l}</label>`).join('')}</div></fieldset>
            <div class="form-grid"><div class="field"><label for="inc-level">${T('대책 위계 (최상위)', 'Highest control level')}</label><select id="inc-level">${HIER().map(([v, l]) => `<option value="${v}" ${draft.level === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>
            <div class="field"><label for="inc-fix">${T('재발방지 대책', 'Corrective actions')}</label><textarea id="inc-fix">${S.esc(draft.fix)}</textarea></div>
            ${draft.level === 'ppe' || draft.level === 'adm' ? `<div class="callout warn small">${T('보호구·행정적 대책만으로는 근본 대책이 되기 어렵습니다. 제거·대체 → 공학적 → 행정적 → 보호구 순으로 검토하세요 (SK하이닉스 작업환경관리지수의 기본 원칙).', 'PPE or administrative controls alone rarely fix the root cause. Work down the order: eliminate/substitute → engineering → administrative → PPE (the principle behind SK hynix’s work-environment index).')}${S.cite('sr2026')}</div>` : ''}
            <div class="callout small">${T('사고·아차사고가 발생하면 해당 작업은 <b>수시 위험성평가</b> 대상입니다 (SK하이닉스 공개 운영 기준).', 'After an accident or near miss, the job needs an <b>ad-hoc risk assessment</b> (SK hynix disclosed practice).')}${S.cite('sr2026')} <a href="#risk">${T('위험성평가 열기', 'Open risk assessment')} →</a></div>
            <div class="row"><button class="btn" type="submit">${T('조사 기록 저장', 'Save investigation')}</button></div>
          </form>
        </div>
        <div class="stack">
          <div class="panel">${ui.title(T('조사 기록', 'Investigations'), `${inc.length}`)}
            ${inc.map((r) => `<div class="stack" style="gap:4px;border-top:1px solid var(--line);padding-top:10px;margin-top:10px">
              <div class="row" style="justify-content:space-between"><b class="small">${S.esc(r.date)} · ${S.esc(L(r.what).slice(0, 60))}${L(r.what).length > 60 ? '…' : ''}</b>${r.id === 1 && !r.user ? ui.ex() : ''}</div>
              <ol class="clean xs">${r.why.filter((w) => L(w)).map((w) => `<li>${S.esc(L(w))}</li>`).join('')}</ol>
              <div class="row">${r.m4.map((m) => `<span class="chip">${(M4().find(([v]) => v === m) || [, m])[1]}</span>`).join('')}<span class="chip">${(HIER().find(([v]) => v === r.level) || [, ''])[1]}</span></div>
              <p class="small">${S.esc(L(r.fix))}</p>
              <div class="row"><button class="btn ghost sm" type="button" data-inc-case="${r.id}">${T('재발방지 분석 시작', 'Start recurrence analysis')} →</button>${S.printLink('inc/' + r.id, T('조사 보고서 인쇄', 'Print report'))}<button class="btn danger sm" type="button" data-inc-del="${r.id}">${T('삭제', 'Delete')}</button></div></div>`).join('')}
          </div>
          <div class="panel">${ui.title(T('SOP 교육·검증 현황', 'SOP training & verification'), T('SOP 퀴즈 결과 (이 브라우저)', 'SOP quiz results (this browser)'))}
            <div class="table-wrap"><table class="data"><thead><tr><th>SOP</th><th class="n">${T('응답', 'Answered')}</th><th class="n">${T('정답', 'Correct')}</th><th></th></tr></thead><tbody>
              ${quizRows.map((q) => `<tr><td class="small">${L(q.s.t)}</td><td class="n">${q.ans}/${q.s.quiz.length}</td><td class="n">${q.ok}</td><td>${q.ans === q.s.quiz.length && q.ok === q.s.quiz.length ? ui.pill('ok', T('검증', 'Verified')) : `<a class="small" href="#sop/${q.s.id}">${T('풀기', 'Take')}</a>`}</td></tr>`).join('')}
            </tbody></table></div>
          </div>
        </div>
      </section>

      <section class="panel stack" id="anchor-report">${ui.title(T('사고 보고·조치 의무 판정', 'Accident reporting & response duties'), `${T('산안법 제54조·규칙 제3·67·73조 · 중처법 제2조', 'OSH Act 54; Rule 3, 67, 73 · SAPA 2')} ${repEx ? ui.ex() : ''}`)}
        <div class="form-grid">
          ${REP_FIELDS().map(([k, l]) => `<div class="field"><label for="rep-${k}">${l}</label><input type="number" min="0" step="1" id="rep-${k}" data-rep="${k}" value="${S.esc(rep[k])}"></div>`).join('')}
        </div>
        <label class="check"><input type="checkbox" id="rep-lost3" data-rep="lost3" ${rep.lost3 ? 'checked' : ''}> ${T('3일 이상 휴업이 필요한 부상·질병자가 있다', 'Someone needs 3 or more days off work (injury or illness)')}</label>
        <div class="grid g3">
          <div class="result stack" style="gap:6px"><b class="small">${T('산안법 중대재해 (규칙 제3조)', 'Serious accident under the OSH Act (Rule 3)')}</b>
            ${repOsh ? ui.pill('bad', T('해당 — 지체 없이 보고', 'Yes — report without delay')) : ui.pill('ok', T('해당 없음', 'No'))}
            ${repOsh ? `<ul class="clean xs"><li>${T('즉시 작업을 중지하고 근로자를 대피시키는 등 필요한 조치 (법 제54조①)', 'Stop the work at once and evacuate workers (Act 54(1))')}</li><li>${T('관할 지방고용노동관서에 전화·팩스 등으로 발생 개요·피해 상황, 조치·전망, 그 밖의 중요 사항 보고 (법 제54조②, 규칙 제67조)', 'Report to the regional labour office by phone, fax or similar: what happened and the damage, actions and outlook, other key facts (Act 54(2), Rule 67)')}</li><li>${T('발생 현장 훼손·원인조사 방해 금지 (법 제56조⑤)', 'Do not disturb the scene or obstruct the investigation (Act 56(5))')}</li></ul>` : `<span class="xs muted">${T('사망 1명 이상, 3개월 이상 요양 부상자 동시 2명 이상, 부상·직업성 질병자 동시 10명 이상 중 하나', 'Any of: 1+ death; 2+ people at once needing 3+ months’ care; 10+ injured or ill at once')}</span>`}</div>
          <div class="result stack" style="gap:6px"><b class="small">${T('산업재해조사표 (규칙 제73조①)', 'Accident report form (Rule 73(1))')}</b>
            ${repForm ? ui.pill('warn', T('발생일부터 1개월 이내 제출', 'Submit within 1 month of the accident')) : ui.pill('ok', T('해당 없음', 'No'))}
            <span class="xs muted">${T('사망자 또는 3일 이상 휴업이 필요한 부상·질병자가 생긴 경우, 관할 지방고용노동관서에 제출(전자문서 포함)', 'Required for a death or anyone needing 3+ days off; file with the regional labour office (electronic filing allowed)')}</span></div>
          <div class="result stack" style="gap:6px"><b class="small">${T('중처법 중대산업재해 (법 제2조 제2호)', 'Serious industrial accident under the SAPA (Art. 2(2))')}</b>
            ${repSapa ? ui.pill('bad', T('해당', 'Yes')) : ui.pill('ok', T('해당 없음', 'No'))}
            <span class="xs muted">${repSapa ? T('안전보건관리체계 구축·이행 기록(시행령 제4조)과 관계 법령 의무이행 점검 기록(시행령 제5조)을 확인하세요.', 'Check the records of the safety & health management system (Decree Art. 4) and of the compliance reviews (Decree Art. 5).') : T('사망 1명 이상, 동일 사고로 6개월 이상 치료 부상자 2명 이상, 동일 유해요인으로 급성중독 등 직업성 질병자 1년 이내 3명 이상 중 하나', 'Any of: 1+ death; 2+ people from one accident needing 6+ months’ treatment; 3+ cases within a year of occupational illness such as acute poisoning from the same agent')}</span></div>
        </div>
        <h3 class="sub-h" id="anchor-chemreport">${T('화학사고·가스사고 신고', 'Chemical and gas accident reports')} <span class="xs muted">${T('화학물질관리법 제43조 · 고압가스 안전관리법 제26조', 'Chemicals Control Act 43 · High-Pressure Gas Act 26')}</span></h3>
        <div class="grid g2">
          <div class="stack">
            <label class="check"><input type="checkbox" data-rep="leak" ${rep.leak ? 'checked' : ''}> ${T('화학물질이 유출·누출됐다 (화재·폭발 포함)', 'A chemical was released (including fire or explosion)')}</label>
            <div class="form-grid">
              <div class="field"><label for="rep-chem">${T('물질 (즉시 신고 기준량)', 'Substance (reporting threshold)')}</label><select id="rep-chem" data-rep="chem" ${rep.leak ? '' : 'disabled'}>${S.CHEM_REPORT.map((c) => `<option value="${c.id}" ${c.id === ev.sub.id ? 'selected' : ''}>${S.esc(L(c))}${c.q != null ? ` — ${c.q} kg·L` : ''}</option>`).join('')}</select></div>
              <div class="field"><label for="rep-qty">${T('유출·누출량 (kg 또는 L)', 'Quantity released (kg or L)')}</label><input type="number" min="0" step="any" id="rep-qty" data-rep="qty" value="${S.esc(rep.qty)}" ${rep.leak ? '' : 'disabled'}></div>
            </div>
            <label class="check"><input type="checkbox" data-rep="hurt" ${rep.hurt ? 'checked' : ''} ${rep.leak ? '' : 'disabled'}> ${T('인명 피해가 있다 (병원 입원 또는 진단서로 확인)', 'Someone was harmed (hospital admission or a medical certificate)')}</label>
            <label class="check"><input type="checkbox" data-rep="urgent" ${rep.urgent ? 'checked' : ''} ${rep.leak ? '' : 'disabled'}> ${T('중상·인명구조·누출 확대 방지 긴급조치 때문에 지금 신고할 수 없다', 'Serious injury, rescue or emergency containment prevents reporting right now')}</label>
            <div class="result stack" style="gap:6px"><b class="small">${T('화학사고 신고 (즉시 신고 규정 별표1)', 'Chemical accident report (Annex 1 criteria)')}</b>
              ${ev.chem ? `${ui.pill(ev.chem.level, ev.chem.t)} <span class="xs muted">${T(`별표1 제1호 ${ev.chem.row}목`, `Annex 1, item 1(${S.rowEn(ev.chem.row)})`)}${ev.sub.q != null ? T(` · 기준량 ${ev.sub.q} kg·L`, ` · threshold ${ev.sub.q} kg or L`) : ''}</span>
                ${ev.chem.waive ? `<span class="xs">${T('1kg·L 미만이고 인명·환경 피해 없이 방재 조치를 마쳤다면 신고하지 않을 수 있습니다(사고대비물질은 제외).', 'Under 1 kg or L with no harm to people or the environment and clean-up complete, a report may be skipped (not for accident-preparedness substances).')}</span>` : ''}
                <ul class="clean xs"><li>${T('신고처 — 관할 지방자치단체, 지방환경관서, 국가경찰관서, 소방관서 또는 지방고용노동관서 (법 제43조②)', 'Report to — the local government, regional environment office, police, fire service or regional labour office (Act 43(2))')}</li>
                <li>${T('신고 내용 — 발생 시간·장소, 사고 내용·원인, 피해 현황, 신고자·사업장 책임자 연락처 (규정 제4조)', 'Contents — time and place, what happened and why, damage, contact details of the reporter and the site manager (Rules Art. 4)')}</li>
                <li>${T('즉시 화학사고예방관리계획서에 따라 응급조치, 중대·시급하면 취급시설 가동 중단 (법 제43조①)', 'Take emergency measures under the prevention plan at once; stop the facility if the accident is serious and urgent (Act 43(1))')}</li></ul>`
                : `<span class="small muted">${T('유출·누출이 없으면 해당 없음', 'Not applicable without a release')}</span>`}</div>
          </div>
          <div class="stack">
            <label class="check"><input type="checkbox" data-rep="gas" ${rep.gas ? 'checked' : ''}> ${T('고압가스(특정고압가스 포함) 시설·용기와 관련된 사고다', 'The accident involves high-pressure gas facilities or cylinders (incl. specified gases)')}</label>
            ${[['fire', T('가스 누출에 의한 폭발·화재', 'Explosion or fire from a gas leak')], ['evac', T('가스시설 손괴·누출로 인명 대피나 공급 중단이 있었다', 'Damage or a leak caused evacuation or a supply cut')], ['tank', T('저장탱크에서 가스가 누출됐다', 'Gas leaked from a storage tank')]].map(([k, l]) => `<label class="check"><input type="checkbox" data-rep="${k}" ${rep[k] ? 'checked' : ''} ${rep.gas ? '' : 'disabled'}> ${l}</label>`).join('')}
            <div class="result stack" style="gap:6px"><b class="small">${T('가스사고 통보 (시행규칙 별표34)', 'Gas accident notification (Rule Annex 34)')}</b>
              ${ev.gas ? (ev.gas.row ? `${ui.pill('bad', ev.gas.t)} <span class="xs muted">${T(`별표34 제1호 ${ev.gas.row}목 · 사망·부상 인원은 위 입력값을 씁니다`, `Annex 34, item 1(${S.rowEn(ev.gas.row)}) · deaths and injuries come from the inputs above`)}</span>`
                : ui.pill('ok', T('별표34의 통보 대상 사고 유형이 아님', 'Not one of the Annex 34 accident types')))
                + `<ul class="clean xs"><li>${T('통보처 — 한국가스안전공사 (속보: 전화·팩스, 상보: 서면)', 'Notify — Korea Gas Safety Corporation (flash: phone or fax; detailed: in writing)')}</li>
                <li>${T('통보 내용 — 통보자 소속·지위·성명·연락처, 발생 일시·장소, 사고 내용(가스 종류·양·확산거리), 시설 현황, 인명·재산 피해', 'Contents — reporter details, date, time and place, what happened (gas, amount, spread), facility, casualties and damage')}</li></ul>`
                : `<span class="small muted">${T('고압가스 관련 사고가 아니면 해당 없음', 'Not applicable unless high-pressure gas is involved')}</span>`}</div>
          </div>
        </div>
        <div class="row">${S.printLink('report', T('판정 결과·보고 기록지 인쇄', 'Print the result and report log'))}</div>
        <p class="xs muted">${T('판단 보조 도구입니다. 실제 보고 여부는 법령 원문과 관할 관서 안내를 따르세요. 2026.2.19 개정으로 고용노동부는 중대재해 외에 화재·폭발·붕괴 등으로 난 산업재해도 원인조사를 할 수 있고(2026.12.1 이후 발생분부터), 공단·관계전문가의 재해조사보고서를 공소 제기 뒤 공개합니다(법 제56조·제56조의2, 2026.6.1 시행).', 'A decision aid only — follow the statute and the labour office. Under the 2026-02-19 amendment MOEL may also investigate fires, explosions, collapses and similar accidents that are not serious accidents (for accidents from 2026-12-01), and publishes investigation reports once charges are filed (Act 56, 56-2, in force 2026-06-01).')}${S.cite('lawAct', 'lawRule', 'lawSapaAct', 'lawSapa', 'lawCca', 'lawCcaRule', 'mceReport', 'lawHpg', 'lawHpgRule')}</p>
      </section>

      <section class="panel stack" id="anchor-tbm">${ui.title(T('TBM 시트 (작업 전 안전점검회의)', 'TBM sheet (pre-job toolbox meeting)'), T('허가 대상 밖 Gray Zone 작업에도 사용', 'Also for grey-zone jobs outside the permit scope'))}
        <div class="row"><label class="lbl" for="tbm-sop">${T('작업', 'Job')}</label><select id="tbm-sop" style="max-width:min(340px,100%)">${S.SOPS.filter((s) => s.kind !== 'emer').map((s) => `<option value="${s.id}" ${s.id === tbmSop.id ? 'selected' : ''}>${S.esc(L(s.t))}</option>`).join('')}</select></div>
        <div class="grid g3">
          <div><b class="small">${T('오늘의 위험', 'Today’s hazards')}</b><ul class="facts" style="margin-top:6px">${L(tbmSop.hz).slice(0, 3).map((x) => `<li>${x}</li>`).join('')}</ul></div>
          <div><b class="small" style="color:var(--bad)">${T('이럴 땐 멈춘다', 'We stop if')}</b><ul class="facts" style="margin-top:6px">${L(tbmSop.stop).map((x) => `<li>${x}</li>`).join('')}</ul></div>
          <div class="stack"><b class="small">${T('확인', 'Confirm')}</b>${[T('작업허가·절차서 확인', 'Permit and procedure read'), T('보호구 착용 상호 확인', 'PPE checked by a partner'), T('비상 연락·대피로 공유', 'Emergency contact and exit shared')].map((c, i) => `<label class="check"><input type="checkbox" id="tbm-c${i}"> ${c}</label>`).join('')}
            <div class="field"><label for="tbm-who">${T('참석자', 'Attendees')}</label><input type="text" id="tbm-who" placeholder="${T('이름을 쉼표로 구분', 'Names, comma-separated')}"></div></div>
        </div>
        <div class="row">${S.printLink('tbm', T('TBM 시트 인쇄 (서명란 포함)', 'Print the TBM sheet (with sign-off)'))}</div>
      </section>`;
    },
    mount(root) {
      const draft = S.load('prev.draft', { date: S.iso(S.today()), type: 'leak', what: '', why: ['', '', '', '', ''], m4: [], fix: '', level: 'eng' });
      const keep = () => S.save('prev.draft', draft);
      root.querySelector('#inc-date').addEventListener('change', (e) => { draft.date = e.target.value; keep(); });
      root.querySelector('#inc-type').addEventListener('change', (e) => { draft.type = e.target.value; keep(); });
      root.querySelector('#inc-what').addEventListener('input', (e) => { draft.what = e.target.value; keep(); });
      root.querySelector('#inc-fix').addEventListener('input', (e) => { draft.fix = e.target.value; keep(); });
      root.querySelector('#inc-level').addEventListener('change', (e) => { draft.level = e.target.value; keep(); S.refresh(); });
      root.querySelectorAll('[data-why]').forEach((i) => i.addEventListener('input', () => { draft.why[Number(i.dataset.why)] = i.value; keep(); }));
      root.querySelectorAll('[data-m4]').forEach((c) => c.addEventListener('change', () => { draft.m4 = [...root.querySelectorAll('[data-m4]:checked')].map((x) => x.dataset.m4); keep(); }));
      /* 중처법 점검표 — 상태는 바로 다시 그리고, 메모는 입력을 마쳤을 때 저장 */
      root.querySelectorAll('[data-sapa]').forEach((el) => el.addEventListener('change', () => {
        const sp = S.load('prev.sapa', {}); sp[el.dataset.sapa] = Object.assign({}, sp[el.dataset.sapa], { [el.dataset.k]: el.value });
        S.save('prev.sapa', sp); if (el.dataset.k === 'st') S.refresh();
      }));
      const sc = root.querySelector('#sapa-clear');
      if (sc) sc.addEventListener('click', () => { if (window.confirm(T('중처법 점검표의 상태와 메모를 모두 지울까요?', 'Clear all statuses and notes in this checklist?'))) { S.drop('prev.sapa'); S.refresh(); } });
      root.querySelector('#incForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!draft.what.trim()) { S.toast(S.T('경위를 입력하세요', 'Describe what happened')); root.querySelector('#inc-what').focus(); return; }
        const list = S.load('prev.inc', null) || INC_DEFAULT;
        list.unshift({ id: Date.now(), user: true, date: draft.date, site: S.state.site, type: draft.type, what: { ko: draft.what, en: draft.what }, why: draft.why.map((w) => ({ ko: w, en: w })), m4: draft.m4, fix: { ko: draft.fix, en: draft.fix }, level: draft.level });
        S.save('prev.inc', list); S.drop('prev.draft'); S.refresh(); S.toast(S.T('조사 기록을 저장했습니다', 'Investigation saved'));
      });
      root.querySelectorAll('[data-inc-del]').forEach((b) => b.addEventListener('click', () => saveRefresh('prev.inc', (S.load('prev.inc', null) || INC_DEFAULT).filter((x) => String(x.id) !== b.dataset.incDel))));
      root.querySelectorAll('[data-inc-case]').forEach((b) => b.addEventListener('click', () => {
        const rec = (S.load('prev.inc', null) || INC_DEFAULT).find((x) => String(x.id) === b.dataset.incCase);
        if (!rec) return;
        const id = S.newCaseFromIncident(rec);
        S.toast(S.T('사고조사 기록으로 재발방지 사례를 만들었습니다', 'Created a recurrence-prevention case from the investigation'));
        location.hash = '#cases/' + id;
      }));
      root.querySelector('#tbm-sop').addEventListener('change', (e) => saveRefresh('prev.tbm', e.target.value));
      root.querySelectorAll('[data-rep]').forEach((i) => i.addEventListener('change', () => {
        const r = Object.assign({}, REP_DEFAULT, S.load('prev.rep', null) || {});
        r[i.dataset.rep] = i.type === 'checkbox' ? i.checked : i.value; saveRefresh('prev.rep', r);
      }));
    }
  };

  /* shared with the printable documents (print.js) */
  S.PREV = { report: repEval, incidents: () => S.load('prev.inc', null) || INC_DEFAULT, m4: M4, hier: HIER, tbmSop: () => S.SOPS.find((s) => s.id === S.load('prev.tbm', 'confined')) || S.SOPS[0] };

  /* ======================= SDX ======================= */
  const EVT_DEFAULT = [
    { id: 1, at: 'P&S Room B-2', kind: 'temp', base: 42, now: 61, st: 'open' },
    { id: 2, at: 'Gas room GC-07', kind: 'gas', gas: 'ph3', v: 0.2, st: 'open' },
    { id: 3, at: 'P&S Room A-4', kind: 'change', st: 'closed' }
  ];
  const IDEA_DEFAULT = [
    { id: 1, t: { ko: '4족 보행 로봇 무인 순찰 (가온·다온)', en: 'Quadruped patrol robots (Gaon, Daon)' }, st: 'scale', off: true, src: 'sr2024' },
    { id: 2, t: { ko: 'Safety Vision AI (CCTV 영상 분석)', en: 'Safety Vision AI (CCTV analytics)' }, st: 'scale', off: true, src: 'sr2024' },
    { id: 3, t: { ko: 'LLM+RPA 작업절차서·위험성평가서 자동 생성', en: 'LLM + RPA drafting of procedures and assessments' }, st: 'scale', off: true, src: 'sr2026' },
    { id: 4, t: { ko: '디지털 트윈 기반 비상 상황 정보 제공 (Virtual Safety)', en: 'Digital-twin emergency information (Virtual Safety)' }, st: 'poc', off: true, src: 'sr2026' },
    { id: 7, t: { ko: '안전 감독 로봇·고소 작업용 VLM 드론 배치 (계획 발표)', en: 'Safety-supervision robots and VLM drones for work at height (announced plan)' }, st: 'poc', off: true, src: 'nr0909' },
    { id: 5, t: { ko: 'VLM/VLA 멀티모달로 자율형 Fab 지향', en: 'VLM/VLA multimodal models toward an autonomous fab' }, st: 'idea', off: true, src: 'sr2026' },
    { id: 6, t: { ko: '순찰 이벤트 → 수시 위험성평가 자동 연결', en: 'Auto-link patrol events to ad-hoc risk assessment' }, st: 'idea', off: false }
  ];

  S.pages.sdx = {
    render() {
      const th = n(S.load('sdx.dt', 10)) || 10;
      const ev = S.load('sdx.ev', null) || EVT_DEFAULT;
      const ideas = S.load('sdx.ideas', null) || IDEA_DEFAULT;
      const judge = (e) => {
        if (e.kind === 'temp') { const d = e.now - e.base; return d >= th * 2 ? ['bad', T(`ΔT ${d}℃ — 기준의 2배 이상`, `ΔT ${d} °C — ≥ 2× threshold`)] : d >= th ? ['warn', T(`ΔT ${d}℃ — 기준 초과`, `ΔT ${d} °C — above threshold`)] : ['ok', T(`ΔT ${d}℃`, `ΔT ${d} °C`)]; }
        if (e.kind === 'gas') { const c = S.CHEMICALS.find((x) => x.id === e.gas); const r = S.judgeExposure(c, null, null, e.v); const lv = r.some((x) => x.level === 'bad') ? 'bad' : r.some((x) => x.level === 'warn') ? 'warn' : 'ok'; return [lv, `${c.f} ${e.v} ${c.unit}`]; }
        return ['info', T('현장 변경점 감지 (3S)', 'Field change detected (3S)')];
      };
      const flow = [T('로봇·AI 감지', 'Robot/AI detection'), T('담당자 실시간 알림', 'Live alert to owner'), T('현장 확인', 'Field check'), T('필요 시 수시 위험성평가', 'Ad-hoc risk assessment if needed'), T('조치·종결', 'Fix & close'), T('기준 이미지·임계값 갱신', 'Refresh baseline & thresholds')];
      return `
      ${ui.head(T('6대 직무 · SDX', 'Six functions · SDX'), 'SDX — Safety Digital Transformation',
        T('로봇 기반 무인 순찰과 ICT로 현장 위험성을 분석하고, 안전 개선 솔루션을 설계·적용합니다.', 'Use robot patrols and ICT to analyse field risk, then design and deploy safety solutions.'))}
      <section class="grid g3">
        <div class="panel span2">${ui.title(T('SK하이닉스 SDX 공개 현황', 'SK hynix SDX as disclosed'))}
          ${facts([
            { t: { ko: 'SDX = Safety + DX: 로봇·AI·센서 등 ICT로 안전관리 체계를 전환', en: 'SDX = Safety + DX: shifting safety management with robots, AI, sensors and other ICT' }, src: 'nrgaon' },
            { t: { ko: '4족 보행 로봇 가온·다온(2023~): 매일 약 3.3만㎡ 공간과 1,000대 이상 장비의 단순 반복 일일 점검을 로봇이 수행 (2026 보고서). 이전 보고서는 “약 3만 평 규모 P&S Room”으로 표기', en: 'Quadruped robots Gaon/Daon (since 2023): daily routine checks of ≈ 33,000 m² and 1,000+ tools (2026 report); earlier reports described a “≈ 30,000-pyeong P&S room”' }, src: 'sr2026' },
            { t: { ko: '로봇 센서: 적외선·초음파 카메라, 가스 감지기, 라이다, 30배 줌 카메라 — 24시간 순찰(자동 충전 제외)', en: 'Robot sensors: IR and ultrasonic cameras, gas detector, LiDAR, 30× zoom — 24 h patrols except charging' }, src: 'inews2026' },
            { t: { ko: '이상 온도 탐지·육안 점검 대체 알고리즘 2종 (SK AI Summit 2024 소개)', en: 'Two in-house algorithms: abnormal-temperature detection and visual-inspection replacement (shown at SK AI Summit 2024)' }, src: 'sr2025' },
            { t: { ko: 'Safety Vision AI: 인적이 드문 지역의 침입·쓰러짐·추락·화재를 CCTV로 24시간 탐지', en: 'Safety Vision AI: 24/7 CCTV detection of intrusion, collapse, falls and fire in low-traffic areas' }, src: 'sr2024' },
            { t: { ko: '분산된 안전 시스템 통합 → 사고 대응 시간 약 84% 단축 (초기 57%, 후속 90%)', en: 'Integrated safety systems cut total response time ≈ 84 % (first response 57 %, follow-up 90 %)' }, src: 'sr2024' },
            { t: { ko: 'KOROS 표준 ‘반도체 제조 시설 사족보행 감시로봇 운용 지침’ 제정, LLM+RPA 안전문서 자동 생성, 디지털 트윈 ‘Virtual Safety’ 로드맵', en: 'KOROS standard for quadruped surveillance robots in fabs, LLM + RPA safety documents, digital-twin “Virtual Safety” roadmap' }, src: 'sr2026' },
            { t: { ko: '2026 미래포럼: 안전 감독 로봇과 고소 작업용 VLM(Vision-Language Model) 드론을 배치하는 등 AI 활용 계획 발표', en: 'Future Forum 2026: plans to deploy safety-supervision robots and VLM (vision-language model) drones for work at height' }, src: 'nr0909' }
          ])}
        </div>
        <div class="panel">${ui.title(T('이벤트 처리 흐름', 'Event workflow'), T('포털 제안', 'Portal proposal'))}
          <ol class="clean small">${flow.map((f) => `<li>${f}</li>`).join('')}</ol>
          <hr class="sep"><p class="xs muted">${T('벤치마크: TSMC는 천장 작업·탱크로리 충전 구역에 AI 위험 식별 모듈을 적용했습니다.', 'Benchmark: TSMC applied AI hazard-identification modules to ceiling work and tanker-filling areas.')}${S.cite('tsmc2023')}</p>
        </div>
      </section>
      <section class="panel stack">${ui.title(T('순찰 이벤트 판정기', 'Patrol event triage'), ui.ex())}
        <div class="row"><label class="lbl" for="sdx-dt">${T('온도 이상 판단 ΔT (℃) — 조직이 정하는 값', 'Temperature alert ΔT (°C) — set by your organisation')}</label><input type="number" id="sdx-dt" value="${S.esc(th)}" style="max-width:90px"></div>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('위치', 'Location')}</th><th>${T('유형', 'Type')}</th><th>${T('값', 'Value')}</th><th>${T('판정', 'Triage')}</th><th>${T('상태', 'Status')}</th><th></th></tr></thead><tbody>
          ${ev.map((e) => { const [lv, msg] = judge(e); return `<tr><td>${S.esc(e.at)}</td><td class="small">${e.kind === 'temp' ? T('열화상 온도', 'Thermal') : e.kind === 'gas' ? T('가스', 'Gas') : T('변경점', 'Change')}</td>
            <td class="small num">${e.kind === 'temp' ? `${e.base}→${e.now}℃` : e.kind === 'gas' ? e.v : '–'}</td><td>${ui.pill(lv, msg)}</td>
            <td>${e.st === 'open' ? `<button class="btn ghost sm" data-ev-close="${e.id}">${T('종결 처리', 'Close')}</button>` : ui.pill('plain', T('종결', 'Closed'))}</td><td><button class="btn danger sm" data-ev-del="${e.id}">×</button></td></tr>`; }).join('')}
        </tbody></table></div>
        <form class="row" id="evForm">
          <input type="text" id="ev-at" placeholder="${T('위치', 'Location')}" style="max-width:160px" required>
          <input type="number" step="any" id="ev-base" placeholder="${T('기준 ℃', 'Baseline °C')}" style="max-width:110px">
          <input type="number" step="any" id="ev-now" placeholder="${T('측정 ℃', 'Measured °C')}" style="max-width:110px">
          <button class="btn" type="submit">${T('온도 이벤트 추가', 'Add thermal event')}</button>
        </form>
        <p class="xs muted">${T('가스 이벤트는 국내 최고노출기준(C)·NIOSH IDLH로 판정합니다. 온도 ΔT 기준은 법령 기준이 아니라 사업장이 설비별로 정하는 값입니다.', 'Gas events are triaged against Korean ceilings and NIOSH IDLH. The ΔT threshold is not a legal limit; each site sets it per equipment.')}</p>
      </section>
      <section class="panel">${ui.title(T('SDX 과제 파이프라인', 'SDX pipeline'), T('회사 공개 과제 + 포털 제안', 'Disclosed projects + portal ideas'))}
        <div class="board">${[['idea', T('아이디어', 'Idea')], ['poc', 'PoC'], ['scale', T('확산·운영', 'Scaled / running')]].map(([st, l]) => `<div class="col"><h4>${l}<span class="muted num">${ideas.filter((i) => i.st === st).length}</span></h4>
          ${ideas.filter((i) => i.st === st).map((i) => `<div class="task"><span>${S.esc(L(i.t))}</span><div class="row">${i.off ? `<span class="chip">${T('회사 공개', 'Disclosed')}</span>${S.cite(i.src)}` : `<span class="chip">${T('제안', 'Proposal')}</span>`}${!i.off && st !== 'scale' ? `<button class="btn ghost sm" data-idea-move="${i.id}">→</button>` : ''}</div></div>`).join('')}</div>`).join('')}</div>
        <form class="row" id="ideaForm" style="margin-top:10px"><input type="text" id="idea-t" placeholder="${T('새 아이디어', 'New idea')}" style="flex:1;min-width:200px" required><button class="btn" type="submit">${T('추가', 'Add')}</button></form>
      </section>`;
    },
    mount(root) {
      const ev = () => S.load('sdx.ev', null) || EVT_DEFAULT;
      root.querySelector('#sdx-dt').addEventListener('change', (e) => saveRefresh('sdx.dt', e.target.value));
      root.querySelectorAll('[data-ev-close]').forEach((b) => b.addEventListener('click', () => { const l = ev(); l.find((x) => String(x.id) === b.dataset.evClose).st = 'closed'; saveRefresh('sdx.ev', l); }));
      root.querySelectorAll('[data-ev-del]').forEach((b) => b.addEventListener('click', () => saveRefresh('sdx.ev', ev().filter((x) => String(x.id) !== b.dataset.evDel))));
      root.querySelector('#evForm').addEventListener('submit', (e) => {
        e.preventDefault(); const base = n(root.querySelector('#ev-base').value), now = n(root.querySelector('#ev-now').value);
        if (base == null || now == null) { S.toast(S.T('기준·측정 온도를 입력하세요', 'Enter baseline and measured temperature')); return; }
        const l = ev(); l.push({ id: Date.now(), at: root.querySelector('#ev-at').value, kind: 'temp', base, now, st: 'open' }); saveRefresh('sdx.ev', l);
      });
      const ideas = () => S.load('sdx.ideas', null) || IDEA_DEFAULT;
      root.querySelectorAll('[data-idea-move]').forEach((b) => b.addEventListener('click', () => { const l = ideas(); const i = l.find((x) => String(x.id) === b.dataset.ideaMove); i.st = i.st === 'idea' ? 'poc' : 'scale'; saveRefresh('sdx.ideas', l); }));
      root.querySelector('#ideaForm').addEventListener('submit', (e) => { e.preventDefault(); const t = root.querySelector('#idea-t').value.trim(); if (!t) return; const l = ideas(); l.push({ id: Date.now(), t: { ko: t, en: t }, st: 'idea', off: false }); saveRefresh('sdx.ideas', l); });
    }
  };

  /* ======================= 상생협력 ======================= */
  const DUTIES = [
    { id: 'd0', t: { ko: '안전보건총괄책임자 지정 — 관계수급인 근로자가 도급인 사업장에서 일하면 안전보건관리책임자를 지정 (상시근로자 100명 이상 사업)', en: 'Appoint a general safety & health manager — when contractors’ workers work at the principal’s site, the site safety & health head takes the role (businesses with 100+ workers)' }, b: { ko: '법 제62조, 시행령 제52조', en: 'Act 62, Decree 52' } },
    { id: 'd1', t: { ko: '안전·보건 협의체 구성·운영 (도급인·수급인 전원, 매월 1회 이상 정기회의, 결과 기록·보존)', en: 'Safety council with the principal and all contractors; monthly meetings, minutes kept' }, b: { ko: '법 제64조①1, 규칙 제79조', en: 'Act 64(1)1, Rule 79' } },
    { id: 'd2', t: { ko: '작업장 순회점검 — 제조업 2일에 1회 이상', en: 'Site rounds — manufacturing: at least every 2 days' }, b: { ko: '법 제64조①2, 규칙 제80조', en: 'Act 64(1)2, Rule 80' } },
    { id: 'd3', t: { ko: '수급인의 안전보건교육 장소·자료 제공 등 지원과 실시 확인', en: 'Support contractors’ training (venue, materials) and confirm it happened' }, b: { ko: '법 제64조①3·4', en: 'Act 64(1)3–4' } },
    { id: 'd4', t: { ko: '화재·폭발·붕괴·지진 등 대비 경보체계 운영과 대피 훈련', en: 'Alarm system and evacuation drills for fire, explosion, collapse, earthquake' }, b: { ko: '법 제64조①5', en: 'Act 64(1)5' } },
    { id: 'd5', t: { ko: '위생시설 장소 제공 또는 도급인 위생시설 이용 협조', en: 'Provide space for, or share, welfare facilities' }, b: { ko: '법 제64조①6', en: 'Act 64(1)6' } },
    { id: 'd6', t: { ko: '같은 장소 작업의 시기·내용·안전조치 확인, 혼재작업 위험 시 작업 시기·내용 조정', en: 'Check timing, content and controls of co-located work; reschedule where overlap creates risk' }, b: { ko: '법 제64조①7·8', en: 'Act 64(1)7–8' } },
    { id: 'd7', t: { ko: '합동 안전·보건점검 — 분기 1회 이상 (건설업 2개월 1회)', en: 'Joint inspection — at least quarterly (construction: every 2 months)' }, b: { ko: '법 제64조②, 규칙 제82조', en: 'Act 64(2), Rule 82' } },
    { id: 'd8', t: { ko: '유해 화학설비 개조·분해·해체 등 도급 시 작업 전 안전·보건 정보 문서 제공과 조치 확인', en: 'Written safety information before contracted work on hazardous-chemical equipment; confirm measures' }, b: { ko: '법 제65조', en: 'Act 65' } },
    { id: 'd9', t: { ko: '수급인 조치능력·기술 평가기준, 안전·보건 관리비용 기준 마련과 반기 1회 이상 점검', en: 'Criteria for contractors’ capability and S&H budget; check at least half-yearly' }, b: { ko: '중처법 시행령 제4조 제9호', en: 'SAPA Decree 4(9)' } }
  ];
  const DUTY_DEFAULT = { d0: true, d1: true, d2: true, d3: true, d4: true, d6: false, d7: true, d8: false, d9: false };
  S.PARTNER_DUTIES = DUTIES; S.PARTNER_DUTY_DEFAULT = DUTY_DEFAULT;
  const CRIT = [
    { id: 'sys', w: 20, t: { ko: '안전보건 관리체계 (방침·조직·ISO 45001/KOSHA-MS)', en: 'S&H management system (policy, organisation, ISO 45001/KOSHA-MS)' } },
    { id: 'ra', w: 20, t: { ko: '위험성평가 실행·근로자 참여', en: 'Risk assessment and worker participation' } },
    { id: 'edu', w: 15, t: { ko: '법정교육 이수 (협력사교육시스템 수료)', en: 'Statutory training completed (partner education system)' } },
    { id: 'ptw', w: 15, t: { ko: '작업허가·SOP 준수 (점검 결과)', en: 'Permit and SOP compliance (inspection results)' } },
    { id: 'inc', w: 10, t: { ko: '재해·아차사고 관리', en: 'Injury and near-miss management' } },
    { id: 'emer', w: 10, t: { ko: '비상대응 준비', en: 'Emergency preparedness' } },
    { id: 'cost', w: 10, t: { ko: '안전·보건 관리비용 계획', en: 'Safety & health budget plan' } }
  ];
  const VENDORS_DEFAULT = [
    { id: 1, name: { ko: 'A사 — 장비 PM 정비', en: 'Company A — tool PM' }, sc: { sys: 4, ra: 3, edu: 5, ptw: 3, inc: 4, emer: 3, cost: 3 } },
    { id: 2, name: { ko: 'B사 — 가스·케미컬 공급', en: 'Company B — gas & chemical supply' }, sc: { sys: 5, ra: 4, edu: 5, ptw: 4, inc: 4, emer: 5, cost: 4 } },
    { id: 3, name: { ko: 'C사 — 건설·셋업', en: 'Company C — construction & set-up' }, sc: { sys: 2, ra: 2, edu: 3, ptw: 2, inc: 3, emer: 2, cost: 2 } }
  ];
  const vScore = (v) => CRIT.reduce((a, c) => a + (Number(v.sc[c.id]) || 0) / 5 * c.w, 0);

  S.pages.partner = {
    render() {
      const duty = S.load('pt.duty', DUTY_DEFAULT);
      const ap = S.load('pt.ap', { acid: 'yes', work: 'yes', removed: 'no' });
      const approval = ap.acid === 'yes' && ap.work === 'yes' ? (ap.removed === 'yes' ? 'exempt' : 'need') : 'none';
      const vendors = S.load('pt.v', null) || VENDORS_DEFAULT;
      return `
      ${ui.head(T('6대 직무 · 상생협력', 'Six functions · Contractor partnership'), T('상생협력', 'Contractor partnership'),
        T('협력사의 SHE 정책·프로그램을 기획·운영하고 안전관리 체계 구축을 지원합니다.', 'Plan and run contractor SHE programmes and help partners build their systems.'),
        T('도급 안전조치 이행, 작업환경 개선, 근로자 건강증진으로 Legal Risk를 줄이고 도급사업주 의무 이행 수준을 높입니다.', 'Deliver subcontract safety duties, better work environments and worker health — cutting legal risk and raising the principal’s compliance.'))}
      <section class="grid g4">
        <div class="panel kpi"><span class="k">${T('1차 협력사 (2025)', 'Tier-1 suppliers (2025)')}${S.cite('sr2026')}</span><span class="v">${S.fmt(C.kpi.partners.tier1)}</span><span class="d">${L(C.kpi.partners.note)}</span></div>
        <div class="panel kpi"><span class="k">${T('SHE 컨설팅 (2025)', 'SHE consulting (2025)')}${S.cite('sr2026')}</span><span class="v">206<small>${T('개사', '')}</small></span><span class="d">${T('불합리 사항 3,100여 건 발굴 · 만족도 93%', '≈ 3,100 issues found · 93 % satisfaction')}</span></div>
        <div class="panel kpi"><span class="k">${T('직업건강 프로그램 (2025)', 'Occupational health (2025)')}${S.cite('sr2026')}</span><span class="v">4,900<small>${T('명+', '+')}</small></span><span class="d">${T('108개사 · 35종 · 332회, 24개사 42품목 개선 보조금', '108 firms · 35 programmes · 332 sessions; grants for 42 items at 24 firms')}</span></div>
        <div class="panel kpi"><span class="k">${T('상생협력사업 평가', 'Cooperation programme rating')}${S.cite('sr2026', 'nrbp2026')}</span><span class="v">${T('상위 10%', 'Top 10 %')}</span><span class="d">${T('2025 이천·청주 우수(233개사 중), 청주 3년 연속 → 자율이행', '2025 Icheon & Cheongju top (of 233); Cheongju 3 years → self-compliance')}</span></div>
      </section>
      <section class="grid g2">
        <div class="panel">${ui.title(T('도급인 법정 의무 체크', 'Principal’s statutory duties'), T(`${Object.values(duty).filter(Boolean).length}/${DUTIES.length} 이행`, `${Object.values(duty).filter(Boolean).length}/${DUTIES.length} done`))}
          <div class="stack">${DUTIES.map((d) => `<label class="check"><input type="checkbox" data-duty="${d.id}" ${duty[d.id] ? 'checked' : ''}> <span>${L(d.t)} <span class="basis law">${L(d.b)}</span></span></label>`).join('')}</div>
          <p class="xs muted" style="margin-top:8px">${S.cite('lawAct', 'lawDecree', 'lawRule', 'lawSapa')} · ${T('체크 상태는 예시로 시작하며 이 브라우저에 저장됩니다.', 'Checks start as examples and are saved in this browser.')}</p>
          <div class="row" style="margin-top:6px">${S.printLink('duty', T('의무 점검표 인쇄', 'Print the duty checklist'))}</div>
        </div>
        <div class="panel stack" id="anchor-approval">${ui.title(T('도급승인 대상 판별', 'Subcontract approval check'), T('산안법 제59조 · 시행령 제51조', 'OSH Act 59 · Decree 51'))}
          ${[['acid', T('설비가 황산·불화수소·질산·염화수소를 중량비율 1% 이상 취급하나요?', 'Does the equipment handle sulfuric, hydrofluoric, nitric or hydrochloric acid at ≥ 1 wt%?')],
             ['work', T('작업이 그 설비의 개조·분해·해체·철거 또는 설비 내부 작업인가요?', 'Is the job modifying, dismantling, removing the equipment, or working inside it?')],
             ['removed', T('도급인이 해당 화학물질을 모두 제거하고 증명자료를 첨부해 신고했나요?', 'Has the principal removed all such chemicals and filed proof?')]].map(([k, q]) => `<fieldset style="border:0;padding:0;margin:0"><legend class="small" style="font-weight:600">${q}</legend><div class="row">
              ${[['yes', T('예', 'Yes')], ['no', T('아니오', 'No')]].map(([v, l]) => `<label class="check"><input type="radio" name="ap-${k}" data-ap="${k}" value="${v}" ${ap[k] === v ? 'checked' : ''}> ${l}</label>`).join('')}</div></fieldset>`).join('')}
          <div class="result">${approval === 'need' ? ui.pill('bad', T('도급 시 고용노동부장관 승인 필요 (안전·보건 평가 포함)', 'Ministerial approval needed before subcontracting (incl. safety evaluation)'))
            : approval === 'exempt' ? ui.pill('warn', T('시행령 제51조 제1호 단서에 따른 제외 — 신고 증빙 보관', 'Exempt under the proviso of Decree 51(1) — keep the filing'))
              : ui.pill('ok', T('제51조 제1호 대상 아님 — 다른 도급 의무는 계속 적용', 'Not covered by Decree 51(1) — other subcontract duties still apply'))}
            ${ap.work === 'yes' ? `<p class="small">${T('유해 화학설비의 개조·분해·해체·철거·내부 작업을 도급한다면, 작업 시작 전 수급인에게 안전·보건 정보를 문서로 제공해야 합니다(법 제65조). 정보를 받지 못한 수급인은 작업을 하지 않을 수 있습니다.', 'If you contract out modification, dismantling or internal work on hazardous-chemical equipment, give written safety information before work starts (Act 65). A contractor without it may refuse the work.')}</p>` : ''}
          </div>
          <div class="callout warn small">${T('실제 사례: 2026년 이천캠퍼스는 도급승인 작업을 승인받은 작업절차서대로 하지 않아 도급승인이 취소됐습니다(질산 폐액 노동자 접촉 재해 발생).', 'Real case: in 2026 Icheon had an approval revoked because approved work did not follow the approved procedure (a worker contacted nitric-acid waste).')}${S.cite('moel0920')} <a href="#cases/ic-2026-hno3">${T('재발방지 분석', 'Recurrence analysis')} →</a></div>
          <p class="xs muted">${S.cite('lawAct', 'lawDecree')}</p>
        </div>
      </section>
      <section class="panel" id="anchor-score">${ui.title(T('협력사 SHE 평가표', 'Contractor SHE scorecard'), T('중처법 시행령 제4조 제9호(조치능력·기술, 관리비용) 기반 — 배점은 포털 예시', 'Based on SAPA Decree 4(9) (capability, budget) — weights are portal examples'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('협력사', 'Contractor')}</th>${CRIT.map((c) => `<th title="${S.esc(L(c.t))}" class="n">${L(c.t).split(' (')[0]}<div class="xs muted">${c.w}${T('점', ' pts')}</div></th>`).join('')}<th class="n">${T('총점', 'Total')}</th><th>${T('등급', 'Grade')}</th></tr></thead><tbody>
          ${vendors.map((v) => { const s = vScore(v); return `<tr><td>${S.esc(L(v.name))} ${v.id <= 3 && !v.user ? ui.ex() : ''}</td>${CRIT.map((c) => `<td class="n"><select data-vs="${v.id}" data-c="${c.id}" aria-label="${S.esc(L(c.t))}">${[0, 1, 2, 3, 4, 5].map((k) => `<option ${Number(v.sc[c.id]) === k ? 'selected' : ''}>${k}</option>`).join('')}</select></td>`).join('')}
            <td class="n"><b>${S.fmt(s, 0)}</b></td><td>${s >= 80 ? ui.pill('ok', T('우수', 'Good')) : s >= 60 ? ui.pill('warn', T('개선 권고', 'Improve')) : ui.pill('bad', T('개선계획 제출', 'Action plan required'))}</td></tr>`; }).join('')}
        </tbody></table></div>
        <form class="row" id="vForm" style="margin-top:10px"><input type="text" id="v-name" placeholder="${T('협력사명·작업', 'Contractor & scope')}" style="flex:1;min-width:200px" required><button class="btn" type="submit">${T('추가', 'Add')}</button></form>
        <p class="xs muted" style="margin-top:6px">${T('각 항목 0–5점 × 배점/5. 등급 구간(80·60점)도 포털 예시입니다. SK하이닉스는 신규 협력사 100%에 SHE 적격성 평가(인권노동·환경·안전)를 적용한다고 공개했습니다.', 'Each item 0–5 × weight/5. The 80/60 bands are portal examples too. SK hynix states that 100 % of new suppliers pass an SHE qualification review (human rights/labour, environment, safety).')}${S.cite('sr2026', 'lawSapa')}</p>
      </section>
      <section class="grid g2">
        <div class="panel stack" style="gap:14px">${ui.title(T('SK하이닉스 협력사 지원 체계', 'SK hynix partner support'))}
          ${S.photo('partner')}
          ${facts([
            { t: { ko: '협력사 SHE 컨설팅 (2018~): 맞춤형 무상 컨설팅, 법적 서류·기술 지도', en: 'Partner SHE consulting (since 2018): free tailored support, legal documents and technical coaching' }, src: 'sr2026' },
            { t: { ko: '대·중소기업 안전보건 상생협력사업: 매년 50~60개 협력사와 컨설팅·안전용품·세미나·교육·시설 개선', en: 'Large–small business S&H cooperation: 50–60 partners a year — consulting, safety kit, seminars, training, facility upgrades' }, src: 'sr2026' },
            { t: { ko: '일환경건강센터 (2019 설립, 고용노동부 인가 공익재단)', en: 'Work Environment Health Center (founded 2019, MOEL-approved non-profit)' }, src: 'nrbp2026' },
            { t: { ko: 'SHE 협력사교육시스템 — 협력사 법정교육 온라인 이수·수료증', en: 'SHE Partner Education System — online statutory training and certificates' }, src: 'bpshe' },
            { t: { ko: '특별안전지원기간 — 구성원·협력사 구성원 대상 (2025)', en: 'Special Safety Support Period for employees and partner workers (2025)' }, src: 'sr2026' },
            { t: { ko: '협력업체 안전보건 상생협력 행사 분기 정례화 — 2026.6.8 약 150개사 200여 명 참석, 작업중지권 활용·아차사고 발굴 우수업체 5곳 시상', en: 'Quarterly partner S&H events — 8 Jun 2026: ≈200 staff from ≈150 firms; 5 firms recognised for using stop-work authority and reporting near misses' }, src: 'nr0609' }
          ])}
        </div>
        <div class="panel">${ui.title(T('협력사 작업자용 콘텐츠', 'For contractor workers'))}
          <p class="small">${T('모든 SOP에는 협력사·현장용 “작업 전 5분 안전카드”가 있습니다. 상단 KO/EN으로 언어를 바꿉니다.', 'Every SOP has a 5-minute pre-job card for contractors and field crews. Switch KO/EN at the top.')}</p>
          <div class="row" style="margin-top:10px">${S.SOPS.slice(0, 8).map((s) => sopLink(s.id)).join('')}</div>
          <hr class="sep"><p class="xs muted">${T('벤치마크: 삼성전자 반도체는 작업중지권 운영 건수(2024년 4,537건)를 공개, TSMC는 교육 이수와 출입·공사 신청을 연동합니다.', 'Benchmarks: Samsung publishes stop-work counts (4,537 in 2024); TSMC ties training to access and work requests.')}${S.cite('samsung', 'tsmc2023')} <a href="#bench">${T('벤치마킹', 'Benchmarks')} →</a></p>
        </div>
      </section>
      <section class="panel stack" id="anchor-build">${ui.title(T('건설공사 발주자 의무', 'Duties of the construction client'), T('산안법 제67~73조 — Fab 신·증설처럼 회사가 발주하는 공사', 'OSH Act Arts. 67–73 — works the company commissions, such as new fabs'))}
        <p class="small">${T('총공사금액 50억원 이상 공사의 발주자는 계획·설계·시공 단계마다 안전보건대장을 작성·제공·확인해야 합니다. 회사가 발주하는 Fab 건설(예: 청주 P&T7, 건설 중)이 여기에 해당합니다.', 'Clients of works worth 5 billion won or more must write, hand over and check a safety and health ledger at the planning, design and construction stages. Fab construction the company commissions (e.g. P&T7 at Cheongju, under construction) is covered.')}${S.cite('lawAct', 'lawDecree', 'sr2026')}</p>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('단계', 'Stage')}</th><th>${T('발주자가 할 일 (법 제67조①)', 'Client’s task (Act 67(1))')}</th><th>${T('대장에 담을 내용 (시행규칙 제86조)', 'Ledger contents (Rule 86)')}</th></tr></thead><tbody>
          <tr><td class="nowrap"><b>${T('계획', 'Planning')}</b></td><td class="small">${T('중점 관리할 유해·위험요인과 감소방안을 담은 기본안전보건대장 작성', 'Write the basic ledger with the key hazards and how to reduce them')}</td><td class="small">${T('공사 개요, 공사현장 제반 정보, 설치·사용 예정 구조물·기계·기구 등 고시 유해·위험요인과 안전조치·위험성 감소방안, 발주자의 법령상 주요 의무와 확인', 'Outline, site information, hazards of planned structures, machines and tools listed in the notice with safety and risk-reduction measures, the client’s main legal duties and their confirmation')}</td></tr>
          <tr><td class="nowrap"><b>${T('설계', 'Design')}</b></td><td class="small">${T('기본대장을 설계자에게 주고, 설계자가 작성한 설계안전보건대장 확인', 'Give the basic ledger to the designer and check the design ledger they write')}</td><td class="small">${T('안전한 작업을 위한 적정 공사기간·공사금액 산출서(건설사업관리 결과보고서로 갈음 가능), 공사 중 유해·위험요인과 시공단계 감소방안, 산업안전보건관리비 산출내역서', 'A calculation of safe duration and cost (may be covered by the construction-management report), hazards during works and reduction measures for construction, the itemised safety and health budget')}</td></tr>
          <tr><td class="nowrap"><b>${T('시공', 'Construction')}</b></td><td class="small">${T('최초 수급인에게 설계대장을 주고, 수급인이 작성한 공사안전보건대장의 이행 여부 확인', 'Give the design ledger to the main contractor and check that the construction ledger they write is carried out')}</td><td class="small">${T('설계대장 감소방안을 반영한 안전보건 조치 이행계획, 유해위험방지계획서 심사·확인 결과 조치, 고시 건설기계·기구 배치·이동계획, 기술지도 계약·지도결과·조치', 'Safety plan reflecting the design ledger, action on the hazard-prevention plan review, layout and movement plan for listed construction machinery, technical-guidance contract, findings and action')}</td></tr>
        </tbody></table></div>
        <ul class="facts">
          <li>${T('대장 내용의 적정성은 건설안전 분야 전문가(건설안전 분야 산업안전지도사, 건설안전기술사, 건설안전기사 실무 3년·산업기사 5년 이상)에게 확인받음', 'Have a construction-safety expert confirm the ledgers (construction-safety consultant, professional engineer, or engineer with 3 years’ / industrial engineer with 5 years’ experience)')} <span class="basis law">${T('법 제67조②, 시행령 제55조의2', 'Act 67(2); Decree 55-2')}</span></li>
          <li>${T('설계자와 최초 수급인이 안전을 우선할 수 있게 적정한 비용과 기간을 계상·설정', 'Budget and schedule so the designer and main contractor can put safety first')} <span class="basis law">${T('법 제67조③', 'Act 67(3)')}</span></li>
          <li>${T('같은 장소에서 2개 이상 공사를 도급하고 금액 합이 50억원 이상이면 안전보건조정자 배치', 'Appoint a safety and health coordinator when two or more contracts at one place total 5 billion won or more')} <span class="basis law">${T('법 제68조, 시행령 제56조', 'Act 68; Decree 56')}</span></li>
          <li>${T('설계도서 등으로 산정한 공사기간 단축 금지, 공사비를 줄이려고 위험한 공법을 쓰거나 정당한 사유 없이 공법 변경 금지', 'No cutting the calculated construction period; no risky methods to save cost and no unjustified method changes')} <span class="basis law">${T('법 제69조', 'Act 69')}</span></li>
          <li>${T('산업안전보건관리비를 고용노동부 고시에 따라 도급금액·사업비에 계상. 도급인은 기준대로 쓰고 사용명세서를 작성·보존하며, 산업재해 예방 외 목적으로 쓰지 않음', 'Include the safety and health budget in the contract per the MOEL notice; the contractor spends it as set, keeps a usage statement, and uses it only for accident prevention')} <span class="basis law">${T('법 제72조①③⑤', 'Act 72(1)(3)(5)')}</span></li>
          <li>${T('공사금액 1억원 이상 120억원(토목공사업 150억원) 미만 공사와 건축허가 대상 공사는 착공 전날까지 건설재해예방전문지도기관과 기술지도계약(유해위험방지계획서 제출 대상 등은 제외)', 'Works of 100 million to under 12 billion won (15 billion for civil works) and works needing a building permit sign a technical-guidance contract with a designated agency by the day before start (exceptions include works needing a hazard-prevention plan)')} <span class="basis law">${T('법 제73조, 시행령 제59조', 'Act 73; Decree 59')}</span></li>
        </ul>
        <p class="xs muted">${T('대장 작성·확인의 방법과 절차는 시행규칙 제86조④에 따라 고용노동부장관이 고시로 정합니다. 산업안전보건관리비의 규모별 계상 기준과 사용 기준도 고시(법 제72조②)를 확인하세요.', 'How ledgers are written and checked is set by MOEL notice under Rule 86(4); the budget rates by project size and the rules for spending it are also in a MOEL notice (Act 72(2)).')}${S.cite('lawAct', 'lawDecree', 'lawRule')}</p>
      </section>`;
    },
    mount(root) {
      root.querySelectorAll('[data-duty]').forEach((c) => c.addEventListener('change', () => { const d = Object.assign({}, DUTY_DEFAULT, S.load('pt.duty', {})); d[c.dataset.duty] = c.checked; saveRefresh('pt.duty', d); }));
      root.querySelectorAll('[data-ap]').forEach((r) => r.addEventListener('change', () => { const a = S.load('pt.ap', { acid: 'yes', work: 'yes', removed: 'no' }); a[r.dataset.ap] = r.value; saveRefresh('pt.ap', a); }));
      const vs = () => S.load('pt.v', null) || VENDORS_DEFAULT;
      root.querySelectorAll('[data-vs]').forEach((s) => s.addEventListener('change', () => { const l = vs(); l.find((x) => String(x.id) === s.dataset.vs).sc[s.dataset.c] = Number(s.value); saveRefresh('pt.v', l); }));
      root.querySelector('#vForm').addEventListener('submit', (e) => { e.preventDefault(); const t = root.querySelector('#v-name').value.trim(); if (!t) return; const l = vs(); l.push({ id: Date.now(), user: true, name: { ko: t, en: t }, sc: {} }); saveRefresh('pt.v', l); });
    }
  };

  /* ======================= 소방·방재 ======================= */
  const DRILL_DEFAULT = [
    { id: 1, date: '2026-04-16', sc: { ko: 'Fab 특수가스 누출 — 대피·ERT 초동대응', en: 'Specialty-gas leak in fab — evacuation and ERT first response' }, people: 320, min: 14, fix: { ko: '서브팹 집결지 안내 표지 보강', en: 'Better signs to the sub-fab muster point' } },
    { id: 2, date: '2025-11-07', sc: { ko: '웨트 장비 화재 — 소화설비 작동·연기 확산 차단', en: 'Wet-bench fire — suppression and smoke control' }, people: 180, min: 11, fix: { ko: '협력사 신규 인원 비상연락 누락 개선', en: 'Add new contractor staff to the contact chain' } }
  ];
  const SCEN = [
    { id: 'gas', t: { ko: '특수가스 누출', en: 'Specialty-gas leak' } },
    { id: 'chem', t: { ko: '케미컬 누출', en: 'Chemical spill' } },
    { id: 'fire', t: { ko: '화재', en: 'Fire' } },
    { id: 'power', t: { ko: '정전·배기 정지', en: 'Power or exhaust failure' } }
  ];
  const SCEN_STEPS = {
    gas: { a: { ko: ['감지기 경보 즉시 해당 구역 작업 중지·대피 (자동 차단 확인)', '중앙방재실 보고 → ERT 출동: 누출 차단, 확산 방지, 농도 측정, 대피 판단', '농도 측정 결과로 재진입 여부 결정 — IDLH 이상이면 출입 통제'], en: ['On alarm, stop work and evacuate the zone (confirm auto shut-off)', 'Report to the central control room → ERT: isolate, contain, measure, decide evacuation', 'Re-entry decided on measured levels — control entry at or above IDLH'] },
      b: { ko: ['노출 의심자 신선한 공기로 이동, 즉시 의료기관 인계 (아르신·HF 등은 증상 지연 가능)'], en: ['Move suspected victims to fresh air and hand over to medical care (arsine, HF effects can be delayed)'] },
      c: { ko: ['배기·스크러버 가동 확인, 원인 설비 격리', '지역사회 영향 가능성 검토 — 중대시민재해 예방 체계와 연계'], en: ['Confirm exhaust and scrubbers; isolate the source', 'Assess community impact — link to civic-disaster prevention'] } },
    chem: { a: { ko: ['누출 확인 즉시 주변 작업 중지, 방류벽 밖으로 대피', 'ERT가 흡착·중화·확산 방지'], en: ['Stop nearby work, move outside the bund', 'ERT absorbs, neutralises and contains'] },
      b: { ko: ['피부·눈 접촉자 긴급 샤워·세안 후 의료 인계'], en: ['Safety shower/eyewash for contact, then medical care'] },
      c: { ko: ['배수·우수 계통 유입 차단', '회수 폐액 분리 보관'], en: ['Block drains and storm-water paths', 'Segregate recovered waste'] } },
    fire: { a: { ko: ['초기 소화 가능 여부 판단 — 어려우면 즉시 대피·신고', '소화설비 작동과 연기 확산 차단 확인'], en: ['Judge whether it can be fought early — if not, evacuate and report', 'Confirm suppression and smoke control'] },
      b: { ko: ['인원 확인 (협력사 포함) 후 미확인 인원 구조 요청'], en: ['Headcount incl. contractors; request rescue for anyone missing'] },
      c: { ko: ['가스·케미컬 공급 차단, 인접 구역 보호'], en: ['Cut gas and chemical supply; protect adjacent areas'] } },
    power: { a: { ko: ['배기 저하 경보 시 가스·케미컬 작업 즉시 중지', '비상전원 절체 확인'], en: ['On low-exhaust alarm, stop gas/chemical work at once', 'Confirm emergency power transfer'] },
      b: { ko: ['밀폐공간·설비 내부 작업자 즉시 철수'], en: ['Withdraw anyone in confined spaces or inside equipment'] },
      c: { ko: ['배기 복구 전 재개 금지, 복구 후 가스 농도 확인'], en: ['No restart until exhaust returns; check gas levels after'] } }
  };

  /* 소방안전관리대상물 등급 (화재예방법 시행령 별표4, 아파트 제외 기준) — 예시 입력(가상) */
  const FG_DEFAULT = { above: '6', below: '1', height: '60', area: '200000', gas: '0', sprk: true, afd: true, ctrl: true };
  const FG_NAME = { special: { ko: '특급 소방안전관리대상물', en: 'Special grade' }, first: { ko: '1급 소방안전관리대상물', en: '1st grade' }, second: { ko: '2급 소방안전관리대상물', en: '2nd grade' }, third: { ko: '3급 소방안전관리대상물', en: '3rd grade' } };
  const FG_QUAL = {
    special: { ko: '소방안전관리자 1명 이상 — 특급 자격증 소지자(소방기술사·소방시설관리사, 소방설비기사 취득 후 1급 대상물 실무 5년, 소방설비산업기사 취득 후 7년, 소방공무원 20년, 특급 시험 합격 중 하나)', en: '1+ manager with a special-grade certificate (fire-protection PE or licensed fire-system manager; fire-protection engineer + 5 yrs managing a 1st-grade property; fire-protection technician + 7 yrs; 20 yrs as a fire officer; or the special-grade exam)' },
    first: { ko: '소방안전관리자 1명 이상 — 1급(또는 특급) 자격증 소지자(소방설비기사·산업기사, 소방공무원 7년, 1급 시험 합격 중 하나)', en: '1+ manager with a 1st-grade (or special) certificate (fire-protection engineer or technician; 7 yrs as a fire officer; or the 1st-grade exam)' },
    second: { ko: '소방안전관리자 1명 이상 — 2급(또는 상위) 자격증 소지자(위험물기능장·산업기사·기능사, 소방공무원 3년, 2급 시험 합격 등)', en: '1+ manager with a 2nd-grade (or higher) certificate (hazardous-materials qualifications, 3 yrs as a fire officer, the 2nd-grade exam, etc.)' },
    third: { ko: '소방안전관리자 1명 이상 — 3급(또는 상위) 자격증 소지자(소방공무원 1년, 3급 시험 합격 등)', en: '1+ manager with a 3rd-grade (or higher) certificate (1 yr as a fire officer, the 3rd-grade exam, etc.)' }
  };
  const fireGrade = (f) => {
    const up = n(f.above) || 0, dn = n(f.below) || 0, ht = n(f.height) || 0, ar = n(f.area) || 0, gs = n(f.gas) || 0;
    if (up + dn >= 30 || ht >= 120 || ar >= 100000) return 'special';
    if (ar >= 15000 || up >= 11 || gs >= 1000) return 'first';
    if (f.sprk || (gs >= 100 && gs < 1000)) return 'second';
    if (f.afd) return 'third';
    return null;
  };
  const fireAssist = (f) => { const ar = n(f.area) || 0; return ar < 15000 ? 0 : 1 + Math.floor((ar - 15000) / (f.ctrl ? 30000 : 15000)); };

  S.pages.fire = {
    render() {
      const fgSaved = S.load('fire.grade', null), fgEx = !fgSaved, fg = Object.assign({}, FG_DEFAULT, fgSaved || {});
      const fgGrade = fireGrade(fg), fgAssist = fireAssist(fg);
      const fs = S.load('fire.sch', { month: 3, full: true, special: true, year: 2026 });
      const mname = (m) => S.state.lang === 'en' ? new Date(2000, m - 1, 1).toLocaleString('en', { month: 'long' }) : m + '월';
      const opMonth = ((fs.month - 1 + 6) % 12) + 1;
      const fw = S.load('fire.fw', { c1: true, c2: false, c3: false, routine: false });
      const needWatch = (fw.c1 || fw.c2 || fw.c3) && !fw.routine;
      const drills = S.load('fire.drills', null) || DRILL_DEFAULT;
      const sc0 = S.tab('scen', 'gas');
      const sc = SCEN_STEPS[sc0] ? sc0 : 'gas';
      const ss = SCEN_STEPS[sc];
      return `
      ${ui.head(T('6대 직무 · 소방·방재', 'Six functions · Fire & emergency'), T('소방·방재', 'Fire & emergency'),
        T('소방시설 점검과 비상대피 훈련으로 사업장을 지키고 비상대응 체계를 표준화합니다.', 'Keep the site safe through fire-system inspection and evacuation drills, and standardise emergency response.'),
        T('소방시설 운영·점검, 경보·소화설비 관리, 소방공사 시공·검수, 비상대피 훈련 기획·실행을 다룹니다.', 'Covers running and inspecting fire systems, alarms and suppression, fire-works construction and acceptance, and planning and running evacuation drills.'))}
      <section class="panel">${ui.title(T('SK하이닉스 비상대응 체계 (공개)', 'SK hynix emergency response (disclosed)'))}
        ${facts([
          { t: { ko: '중앙방재실이 감지기를 24시간 모니터링, 이상 시 ERT 출동 — 누출 차단·확산 방지·농도 측정·대피 유도 초동대응', en: 'Central control room monitors detectors 24/7; ERT handles first response — isolate, contain, measure, evacuate' }, src: 'sr2026' },
          { t: { ko: '화학물질 누출 시나리오 기반 ECT(Emergency Control Tower) 모의훈련 정기 실시, 소방서·화학물질안전원과 연계', en: 'Regular ECT (Emergency Control Tower) drills on leak scenarios, with fire services and the National Institute of Chemical Safety' }, src: 'sr2026' },
          { t: { ko: '2025년 하반기 이천소방서 주관 재난대비 긴급구조종합훈련 — 28개 기관·단체, 장비 58대, 278명', en: 'H2 2025 Icheon Fire Station rescue exercise — 28 organisations, 58 units, 278 people' }, src: 'sr2026' },
          { t: { ko: '중대시민재해 예방: 사고 시나리오·영향 범위 파악, 주민 대피 장소·신고 방법 안내서 고지', en: 'Civic-disaster prevention: scenarios and impact zones; residents told where to evacuate and how to report' }, src: 'sr2026' },
          { t: { ko: 'CMS — 사고 유형별 비상대응 프로세스 20종 (2015 공개)', en: 'CMS — 20 response processes by accident type (disclosed 2015)' }, src: 'nr2015' },
          { t: { ko: '사업연속성계획(BCP) 2015년부터 운영, 매년 CEO가 참여하는 모의훈련과 ISO 22301 인증 심사 — 이천·청주 2025년 11월 심사 통과', en: 'Business continuity plan since 2015; yearly CEO-led exercises and ISO 22301 audits — Icheon and Cheongju passed in Nov 2025' }, src: 'sr2026' }
        ])}
      </section>
      <section class="panel stack" id="anchor-grade">${ui.title(T('소방안전관리대상물 등급·선임 판정', 'Fire-safety property grade & staffing'), `${T('화재예방법 시행령 별표4·별표5', 'Fire Prevention Decree Annexes 4 & 5')} ${fgEx ? ui.ex() : ''}`)}
        <div class="form-grid">
          ${[['above', T('지상 층수', 'Floors above ground')], ['below', T('지하 층수', 'Basement floors')], ['height', T('지상으로부터 높이 (m)', 'Height above ground (m)')], ['area', T('연면적 (㎡)', 'Total floor area (m²)')], ['gas', T('가연성 가스 저장·취급량 (톤)', 'Flammable gas stored/handled (t)')]].map(([k, l]) => `<div class="field"><label for="fg-${k}">${l}</label><input type="number" min="0" step="any" id="fg-${k}" data-fg="${k}" value="${S.esc(fg[k])}"></div>`).join('')}
        </div>
        <label class="check"><input type="checkbox" data-fg="sprk" ${fg.sprk ? 'checked' : ''}> ${T('옥내소화전·스프링클러·물분무등소화설비 설치 대상이다', 'Indoor hydrants, sprinklers or water-spray-type systems are required')}</label>
        <label class="check"><input type="checkbox" data-fg="afd" ${fg.afd ? 'checked' : ''}> ${T('자동화재탐지설비 설치 대상이다', 'Automatic fire detection is required')}</label>
        <label class="check"><input type="checkbox" data-fg="ctrl" ${fg.ctrl ? 'checked' : ''}> ${T('방재실에 자위소방대가 24시간 상시 근무하고 소방펌프차 등 소방자동차를 운용한다', 'An in-house fire brigade staffs the control room 24/7 and runs fire engines')}</label>
        <div class="grid g2">
          <div class="result stack" style="gap:6px"><b class="small">${T('등급', 'Grade')}</b>${fgGrade ? ui.pill(fgGrade === 'special' || fgGrade === 'first' ? 'bad' : 'warn', L(FG_NAME[fgGrade])) : ui.pill('ok', T('별표4 대상 아님', 'Not an Annex 4 property'))}
            ${fgGrade ? `<span class="xs">${L(FG_QUAL[fgGrade])}</span>` : ''}</div>
          <div class="result stack" style="gap:6px"><b class="small">${T('소방안전관리보조자 (연면적 기준)', 'Assistant managers (by floor area)')}</b><span class="num" style="font-size:calc(20px * var(--fz));font-weight:600">${fgAssist ? fgAssist + T('명 이상', '+') : T('연면적 기준 해당 없음', 'Not required by area')}</span>
            <span class="xs muted">${T(`연면적 1만5천㎡ 이상이면 1명, 초과 ${fg.ctrl ? '3만' : '1만5천'}㎡마다 1명 추가`, `1 from 15,000 m², plus 1 per extra ${fg.ctrl ? '30,000' : '15,000'} m²`)}</span></div>
        </div>
        <p class="xs muted">${T('아파트가 아닌 특정소방대상물 기준입니다(특급: 30층 이상(지하 포함)·높이 120m 이상·연면적 10만㎡ 이상 / 1급: 연면적 1만5천㎡ 이상·지상 11층 이상·가연성 가스 1천톤 이상). 위험물 제조소등·불연성 물품 창고 등은 특급·1급에서 제외되고, 기숙사·의료시설 등의 보조자 기준은 따로 있습니다. 예시 값은 가상입니다.', 'For non-residential properties (special: 30+ floors incl. basement, 120 m+ or 100,000 m²+; 1st: 15,000 m²+, 11+ floors above ground or 1,000 t+ flammable gas). Hazardous-material facilities and non-combustible storage are excluded from special/1st grade; dormitories, hospitals and others have their own assistant rules. Example values are fictional.')}${S.cite('lawFireDecree')}</p>
      </section>
      <section class="grid g2">
        <div class="panel stack" id="anchor-schedule">${ui.title(T('소방시설 자체점검 일정', 'Fire-system self-inspection schedule'), T('소방시설법 시행규칙 별표3', 'Fire-Systems Rule Annex 3'))}
          <div class="form-grid">
            <div class="field"><label for="fs-month">${T('건축물 사용승인월', 'Occupancy-approval month')}</label><select id="fs-month">${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}" ${fs.month === i + 1 ? 'selected' : ''}>${mname(i + 1)}</option>`).join('')}</select></div>
          </div>
          <label class="check"><input type="checkbox" id="fs-full" ${fs.full ? 'checked' : ''}> ${T('종합점검 대상 (예: 스프링클러설비 설치, 또는 물분무등소화설비 설치 연면적 5,000㎡ 이상 — 제조소등 제외)', 'Subject to full inspection (e.g. sprinklers installed, or water-spray-type systems with ≥ 5,000 m² — excluding hazardous-material facilities)')}</label>
          <label class="check"><input type="checkbox" id="fs-special" ${fs.special ? 'checked' : ''} ${fs.full ? '' : 'disabled'}> ${T('특급 소방안전관리대상물', 'Special-grade fire-safety property')}</label>
          <div class="result">
            ${fs.full ? `<div class="row" style="justify-content:space-between"><b>${T('종합점검', 'Full inspection')}</b><span class="num">${mname(fs.month)}${fs.special ? T(' + 반기 1회 이상', ' + at least half-yearly') : ''}</span></div>
              <div class="row" style="justify-content:space-between"><b>${T('작동점검', 'Operational inspection')}</b><span class="num">${fs.special ? T('종합점검 받은 달부터 6개월 되는 달 원칙 — 특급은 종합점검 일정과 함께 확인', '6 months after the full inspection in principle — check against the special-grade schedule') : mname(opMonth)}</span></div>`
              : `<div class="row" style="justify-content:space-between"><b>${T('작동점검', 'Operational inspection')}</b><span class="num">${T(`${mname(fs.month)} 말일까지 (연 1회 이상)`, `by the end of ${mname(fs.month)} (at least yearly)`)}</span></div>`}
            <p class="xs muted">${T('종합점검: 연 1회 이상(특급은 반기 1회 이상), 사용승인일이 속하는 달에 실시. 작동점검: 연 1회 이상, 종합점검 대상은 종합점검을 받은 달부터 6개월이 되는 달에 실시.', 'Full: at least yearly (special grade: half-yearly), in the approval month. Operational: at least yearly; for full-inspection sites, in the sixth month after the full inspection.')}${S.cite('lawFire')}</p>
          </div>
        </div>
        <div class="panel stack">${ui.title(T('화재감시자 배치 판단', 'Fire-watch requirement'), T('안전보건규칙 제241조의2', 'OSH Standards Rules Art. 241-2'))}
          ${[['c1', T('작업반경 11m 이내에 건물 구조·내부(개구부 포함)에 가연성물질이 있다', 'Combustibles in the structure or interior (incl. openings) within 11 m')],
             ['c2', T('11m 이내 바닥 하부에 가연성물질이 11m 이상 떨어져 있지만 불꽃으로 쉽게 발화될 우려가 있다', 'Combustibles below the floor, more than 11 m away but easily ignited by sparks')],
             ['c3', T('가연성물질이 금속 칸막이·벽·천장·지붕의 반대쪽 면에 인접해 열전도·복사로 발화될 우려가 있다', 'Combustibles against the far side of metal partitions, walls, ceilings or roofs — ignition by conduction or radiation')],
             ['routine', T('같은 장소 상시·반복 작업이며 경보용 설비·기구, 소화설비 또는 소화기가 갖춰져 있다 (예외)', 'Routine work at the same place with alarms and suppression or extinguishers in place (exception)')]].map(([k, l]) => `<label class="check"><input type="checkbox" data-fw="${k}" ${fw[k] ? 'checked' : ''}> ${l}</label>`).join('')}
          <div class="result">${needWatch ? ui.pill('bad', T('화재감시자 지정·배치 필요', 'Assign and post a fire watch')) : ui.pill('ok', T('제241조의2 배치 요건 해당 없음', 'Art. 241-2 does not require a watch'))}
            ${needWatch ? `<p class="small">${T('감시자 업무: 가연물 확인, 가스 검지·경보장치 작동 확인, 화재 시 대피 유도 / 지급: 확성기, 휴대용 조명, 화재 대피용 마스크 등 방연장비', 'Watch duties: check combustibles, confirm gas detection works, lead evacuation / Issue: loudhailer, portable light, escape mask and other smoke equipment')}</p>` : ''}</div>
          <p class="xs muted">${S.cite('lawStd')} · ${sopLink('hot-work')}</p>
        </div>
      </section>
      <section class="panel stack">${ui.title(T('비상대응 시나리오 카드', 'Emergency scenario cards'), T('중처법 시행령 제4조 제8호의 3가지 조치로 구성', 'Built on the three measures in SAPA Decree 4(8)'))}
        ${ui.tabs('scen', SCEN.map((s) => ({ id: s.id, label: L(s.t) })), sc)}
        <div class="grid g3">
          <div><b class="small">${T('가. 작업 중지·대피·위험요인 제거', 'a. Stop work, evacuate, remove the hazard')}</b><ul class="facts" style="margin-top:6px">${L(ss.a).map((x) => `<li>${x}</li>`).join('')}</ul></div>
          <div><b class="small">${T('나. 재해자 구호', 'b. Rescue and care for casualties')}</b><ul class="facts" style="margin-top:6px">${L(ss.b).map((x) => `<li>${x}</li>`).join('')}</ul></div>
          <div><b class="small">${T('다. 추가 피해 방지', 'c. Prevent further harm')}</b><ul class="facts" style="margin-top:6px">${L(ss.c).map((x) => `<li>${x}</li>`).join('')}</ul></div>
        </div>
        <p class="xs muted">${T('중대산업재해 대비 매뉴얼은 반기 1회 이상 조치 이행을 점검해야 합니다. ERT 역할은 회사 공개 내용, 세부 행동은 포털 예시입니다.', 'The serious-accident manual must be checked at least half-yearly. ERT roles are as disclosed; the detailed actions are portal examples.')}${S.cite('lawSapa', 'sr2026')}</p>
      </section>
      <section class="panel">${ui.title(T('소방훈련·교육 기록', 'Fire drill & training log'), T('연 1회 이상 · 기록 2년 보관', 'At least yearly · keep 2 years'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('일자', 'Date')}</th><th>${T('시나리오', 'Scenario')}</th><th class="n">${T('인원', 'People')}</th><th class="n">${T('대피 완료(분)', 'Evac. (min)')}</th><th>${T('개선사항', 'Improvement')}</th><th>${T('보관 기한', 'Keep until')}</th><th></th></tr></thead><tbody>
          ${drills.map((d) => { const keep = S.addDays(new Date(d.date + 'T00:00:00'), 730); return `<tr><td class="n">${S.esc(d.date)} ${d.id <= 2 && !d.user ? ui.ex() : ''}</td><td>${S.esc(L(d.sc))}</td><td class="n">${S.esc(d.people)}</td><td class="n">${S.esc(d.min)}</td><td class="small">${S.esc(L(d.fix))}</td><td class="n">${S.iso(keep)}</td><td><button class="btn danger sm" data-drill-del="${d.id}">×</button></td></tr>`; }).join('')}
        </tbody></table></div>
        <form class="form-grid" id="drillForm" style="margin-top:10px">
          <div class="field"><label for="dr-date">${T('일자', 'Date')}</label><input type="date" id="dr-date" value="${S.iso(S.today())}" required></div>
          <div class="field"><label for="dr-sc">${T('시나리오', 'Scenario')}</label><input type="text" id="dr-sc" required></div>
          <div class="field"><label for="dr-p">${T('인원', 'People')}</label><input type="number" id="dr-p" min="0"></div>
          <div class="field"><label for="dr-m">${T('대피 완료(분)', 'Evacuation (min)')}</label><input type="number" id="dr-m" min="0" step="any"></div>
          <div class="field"><label for="dr-f">${T('개선사항', 'Improvement')}</label><input type="text" id="dr-f"></div>
          <div class="field" style="align-self:end"><button class="btn" type="submit">${T('기록 추가', 'Add record')}</button></div>
        </form>
        <p class="xs muted" style="margin-top:6px">${T('소방안전관리대상물 관계인은 연 1회 이상 소방훈련·교육을 하고(소방서 요청 시 2회 범위 추가), 특급·1급은 소방기관과 합동 실시할 수 있으며, 결과를 기록부에 적어 2년간 보관합니다.', 'Fire-safety properties drill at least yearly (up to 2 more on fire-service request); special and 1st grade may drill jointly with fire services; results go in a log kept 2 years.')}${S.cite('lawFirePrev')}</p>
      </section>`;
    },
    mount(root) {
      const fs = S.load('fire.sch', { month: 3, full: true, special: true, year: 2026 });
      root.querySelectorAll('[data-fg]').forEach((i) => i.addEventListener('change', () => {
        const f = Object.assign({}, FG_DEFAULT, S.load('fire.grade', null) || {});
        f[i.dataset.fg] = i.type === 'checkbox' ? i.checked : i.value; saveRefresh('fire.grade', f);
      }));
      root.querySelector('#fs-month').addEventListener('change', (e) => { fs.month = Number(e.target.value); saveRefresh('fire.sch', fs); });
      root.querySelector('#fs-full').addEventListener('change', (e) => { fs.full = e.target.checked; if (!fs.full) fs.special = false; saveRefresh('fire.sch', fs); });
      root.querySelector('#fs-special').addEventListener('change', (e) => { fs.special = e.target.checked; saveRefresh('fire.sch', fs); });
      root.querySelectorAll('[data-fw]').forEach((c) => c.addEventListener('change', () => { const f = S.load('fire.fw', { c1: true, c2: false, c3: false, routine: false }); f[c.dataset.fw] = c.checked; saveRefresh('fire.fw', f); }));
      const dr = () => S.load('fire.drills', null) || DRILL_DEFAULT;
      root.querySelectorAll('[data-drill-del]').forEach((b) => b.addEventListener('click', () => saveRefresh('fire.drills', dr().filter((x) => String(x.id) !== b.dataset.drillDel))));
      root.querySelector('#drillForm').addEventListener('submit', (e) => {
        e.preventDefault(); const l = dr(); const v = (id) => root.querySelector(id).value;
        l.unshift({ id: Date.now(), user: true, date: v('#dr-date'), sc: { ko: v('#dr-sc'), en: v('#dr-sc') }, people: n(v('#dr-p')) ?? '–', min: n(v('#dr-m')) ?? '–', fix: { ko: v('#dr-f'), en: v('#dr-f') } });
        saveRefresh('fire.drills', l);
      });
    }
  };

  /* ======================= 안전문화 ======================= */
  S.pages.culture = {
    render() {
      const nowM = S.today().getMonth() + 1;
      const kp = S.load('cul.kpi', { workers: '32000', injured: '29', cases: '27', hours: '64000000', lostDays: '410', deaths: '0', lti: '10' });
      const w = n(kp.workers), inj = n(kp.injured), cs = n(kp.cases), hr = n(kp.hours), ld = n(kp.lostDays), dt = n(kp.deaths), lti = n(kp.lti);
      const res = [
        { k: T('재해율 (%)', 'Injury rate (%)'), f: T('재해자수 ÷ 근로자수 × 100', 'injured ÷ workers × 100'), v: w && inj != null ? inj / w * 100 : null, d: 3, cmp: '0.09 (2025)', src: 'eindex' },
        { k: T('사망만인율 (‱)', 'Fatalities per 10,000 (‱)'), f: T('사고 사망자수 ÷ 근로자수 × 10,000', 'accident deaths ÷ workers × 10,000'), v: w && dt != null ? dt / w * 10000 : null, d: 2, cmp: '', src: 'eindex' },
        { k: 'LTIFR', f: T('근로손실재해 건수 × 200,000 ÷ 총근로시간', 'lost-time cases × 200,000 ÷ hours'), v: hr && lti != null ? lti * 200000 / hr : null, d: 3, cmp: '0.03 (2025)', src: 'sr2026' },
        { k: T('도수율', 'Frequency rate'), f: T('재해건수 ÷ 연근로시간 × 1,000,000', 'cases ÷ hours × 1,000,000'), v: hr && cs != null ? cs / hr * 1e6 : null, d: 2, cmp: '', src: null },
        { k: T('강도율', 'Severity rate'), f: T('근로손실일수 ÷ 연근로시간 × 1,000', 'lost days ÷ hours × 1,000'), v: hr && ld != null ? ld / hr * 1000 : null, d: 3, cmp: '', src: null }
      ];
      return `
      ${ui.head(T('6대 직무 · 안전문화', 'Six functions · Safety culture'), T('안전문화', 'Safety culture'),
        T('안전문화 활동과 교육, 안전보건경영시스템 인증과 KPI를 관리합니다.', 'Safety-culture activities, training, management-system certification and KPIs.'),
        T('전사 안전문화를 만들고 교육과정을 개발·운영하며, SHE 체험관을 관리하고, 안전보건경영시스템 인증과 KPI를 관리해 조직 전반의 안전문화를 활성화합니다.', 'Build company-wide safety culture, develop and run training, manage the SHE Experience Center, and look after management-system certification and KPIs.'))}
      <section class="grid g3">
        <div class="panel span2">${ui.title(T('SK하이닉스 안전문화 활동 (공개)', 'SK hynix safety-culture activities (disclosed)'))}
          ${facts([
            { t: { ko: '안전문화팀 신설(2023년 말), 참여형 캠페인 확대', en: 'Safety Culture team created (late 2023); participatory campaigns expanded' }, src: 'sr2024' },
            { t: { ko: 'HSCA(안전문화 수준평가) 2024년 자체 개발 — 매년 실시해 취약점 분석', en: 'HSCA safety-culture assessment developed in 2024 and run yearly to find weak spots' }, src: 'sr2026' },
            { t: { ko: 'SHE Committee — SHE·PSM 담당자와 현장 안전업무 종사자의 자발적 제안 기구', en: 'SHE Committee — voluntary proposal body of SHE/PSM and field safety staff' }, src: 'sr2026' },
            { t: { ko: 'CSO 주관 Safety Talk Concert, 리더 안전 퀴즈대회, 안전보건 챌린지, 안전문화 공모전', en: 'CSO-led Safety Talk Concert, leader safety quiz, S&H challenge, culture contest' }, src: 'sr2024' },
            { t: { ko: 'SCC 팀장임무카드(팀별 고위험 10대 과제), Leader Patrol(주간 현장점검)', en: 'SCC team-leader mission card (top-10 high-risk items), weekly Leader Patrol' }, src: 'nr2022' },
            { t: { ko: '청주 SHE 체험교육관(2025.5) — 화학물질안전·가상안전(VR/AR)·FAB안전·보건·일반안전·소방안전·환경 7개 분야 31개 체험', en: 'Cheongju SHE Experience Center (May 2025) — 31 activities in 7 fields: chemical, VR/AR, FAB, health, general, fire, environment' }, src: 'nr2025she' },
            { t: { ko: '건강관리 앱 ‘하이헬스(Hi health)’(2024.10 출시)와 대사증후군 저감 목표 — 2025년 목표 미달성 공개', en: '“Hi health” app (Oct 2024) and a metabolic-syndrome target — 2025 target missed, as disclosed' }, src: 'sr2026' }
          ])}
        </div>
        <div class="panel">${ui.title(T('인증', 'Certification'))}
          <div class="stack small">${C.kpi.iso45001.map((c) => `<div class="row" style="justify-content:space-between"><span>ISO 45001 · ${L(S.SITES[c.site].name)}</span><span class="num">~${c.until}</span></div>`).join('')}
            <div class="row" style="justify-content:space-between"><span>${T('사업연속성 ISO 22301', 'Business continuity ISO 22301')}</span><span>${T('매년 인증', 'Yearly')}</span></div></div>
          <p class="xs muted" style="margin-top:8px">${S.cite('sr2026')}</p>
        </div>
      </section>
      <section class="panel" id="anchor-campaign">${ui.title(T('연간 캠페인 캘린더', 'Annual campaign calendar'), T('포털 제안 · 이번 달 강조', 'Portal proposal · this month highlighted'))}
        <div class="grid g4">${S.CAMPAIGNS.map((c) => `<div class="stack" style="gap:4px;padding:12px;border:1px solid ${c.m === nowM ? 'var(--ink)' : 'var(--line)'};border-radius:var(--r-sm);background:${c.m === nowM ? 'var(--panel-2)' : 'var(--panel)'}">
          <div class="row" style="justify-content:space-between"><span class="num" style="font-weight:600">${S.state.lang === 'en' ? new Date(2000, c.m - 1, 1).toLocaleString('en', { month: 'short' }) : c.m + '월'}</span>${c.m === nowM ? ui.pill('info', T('이번 달', 'Now')) : ''}</div>
          <b class="small">${L(c.t)}</b><span class="xs muted">${L(c.focus)}</span><a class="xs" href="#sop/${c.sop}">${L(S.SOPS.find((s) => s.id === c.sop).t)} →</a></div>`).join('')}</div>
        <p class="xs muted" style="margin-top:8px">${T('4.16 국민안전의 날, 7월 산업안전보건 강조주간, 11월 불조심 강조의 달·11.9 소방의 날은 공식 기념일·행사이며, 나머지 주제는 계절 위험과 SK하이닉스 공개 고위험 유형(추락·끼임·부딪힘, 가스·화학물질)을 반영한 포털 제안입니다.', 'National Safety Day (16 Apr), OSH Week (July), Fire Prevention Month (Nov) and Fire Day (9 Nov) are official; other themes are portal proposals based on seasonal risks and the high-risk types SK hynix discloses.')}</p>
      </section>
      <section class="grid g2">
        <div class="panel">${ui.title(T('법정 안전보건교육 시간', 'Statutory training hours'), T('산안법 시행규칙 별표4 (2025.5.30 개정)', 'OSH Rule Annex 4 (amended 2025-05-30)'))}
          <div class="table-wrap"><table class="data"><tbody>${S.TRAINING.map((g) => `<tr><th colspan="2" style="background:var(--panel-2)">${L(g.g)}</th></tr>${g.rows.map((r) => `<tr><td class="small">${L(r.who)}</td><td class="small">${L(r.h)}</td></tr>`).join('')}`).join('')}</tbody></table></div>
          <p class="xs muted" style="margin-top:6px">${T('영 별표1 제1호 사업, 상시근로자 50명 미만 도매·숙박·음식점업은 2분의 1 이상. 일용근로자가 1주일 내 같은 사업장·업무에 재취업하면 채용 시·특별교육 면제.', 'Half the hours for businesses in Decree Annex 1(1) and wholesale, lodging and restaurants under 50 workers. Day labourers re-hired for the same job at the same site within a week are exempt from hiring and special training.')}${S.cite('lawRule')}</p>
          <div id="anchor-special" style="margin-top:12px"><b class="small">${T('반도체 사업장과 관련될 수 있는 특별교육 대상 작업 (별표5 제1호라목)', 'Special-training jobs likely in a fab (Annex 5, 1-d)')}</b>
            <ul class="clean small" style="margin-top:6px">${Object.keys(S.SPECIAL_EDU).map((no) => { const sops = S.SOPS.filter((s) => (s.edu || []).includes(Number(no))); return `<li><span class="chip">${T(`제${no}호`, `No. ${no}`)}</span> ${L(S.SPECIAL_EDU[no])}${sops.length ? ` — ${sops.map((s) => `<a href="#sop/${s.id}">${S.esc(L(s.t))}</a>`).join(', ')}` : ''}</li>`; }).join('')}</ul>
            <p class="xs muted">${T('별표5는 39개 작업을 정합니다. 여기서는 반도체 사업장에서 흔한 작업만 추리고 관련 SOP를 연결했습니다.', 'Annex 5 lists 39 jobs; only those common in fabs are shown, linked to the related SOPs.')}${S.cite('lawRule')}</p>
            <p class="small"><a href="#training">${T('교육 이수 관리 — 사람별 부족 시간 계산', 'Training records — shortfalls by person')} →</a></p></div>
        </div>
        <div class="panel stack" id="anchor-kpi">${ui.title(T('안전 KPI 계산기', 'Safety KPI calculator'), ui.ex())}
          <div class="form-grid">
            ${[['workers', T('근로자수', 'Workers')], ['injured', T('재해자수', 'Injured')], ['cases', T('재해건수', 'Cases')], ['hours', T('총근로시간', 'Hours worked')], ['lostDays', T('근로손실일수', 'Lost days')], ['deaths', T('사고 사망자수', 'Accident deaths')], ['lti', T('근로손실재해 건수', 'Lost-time cases')]].map(([k, l]) => `<div class="field"><label for="kp-${k}">${l}</label><input type="number" min="0" step="any" id="kp-${k}" value="${S.esc(kp[k])}"></div>`).join('')}
          </div>
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('지표', 'Indicator')}</th><th>${T('산식', 'Formula')}</th><th class="n">${T('값', 'Value')}</th><th>${T('SK하이닉스 공개값', 'SK hynix reported')}</th></tr></thead><tbody>
            ${res.map((r) => `<tr><td><b>${r.k}</b></td><td class="xs">${r.f}${r.src ? S.cite(r.src) : ` <span class="basis">${T('통용 산식', 'Common formula')}</span>`}</td><td class="n"><b>${r.v == null ? '–' : S.fmt(r.v, r.d)}</b></td><td class="small">${r.cmp}${r.cmp ? S.cite('sr2026') : ''}</td></tr>`).join('')}
          </tbody></table></div>
          <p class="xs muted">${T('입력값은 가상의 예시입니다. SK하이닉스는 LTIFR을 20만 근무시간당으로 공개합니다.', 'Inputs are fictional examples. SK hynix reports LTIFR per 200,000 hours.')}</p>
        </div>
      </section>`;
    },
    mount(root) {
      const kp = S.load('cul.kpi', { workers: '32000', injured: '29', cases: '27', hours: '64000000', lostDays: '410', deaths: '0', lti: '10' });
      Object.keys(kp).forEach((k) => { const el = root.querySelector('#kp-' + k); if (el) el.addEventListener('change', () => { kp[k] = el.value; saveRefresh('cul.kpi', kp); }); });
    }
  };
})();

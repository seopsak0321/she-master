/* SHE 가이드북 — 자료 라이브러리(카테고리로 찾기, #book/find)
   항목 = 교과서 절 + 포털이 원문을 확인한 자료(출처 목록의 법령·고시·지침·국제 문서·선례·발표, KOSHA GUIDE, 사고사례, 물질, 공식 사이트, SOP)
        + 라이브러리용으로 새로 모은 공식 선례(LIB_ITEMS — 미국 CSB 조사 등).
   대분류(facet)와 소분류(값):
     k 자료 유형 · c 나라·지역 · y 연도 · i 산업·업종 · h 위험 요인 · m 관리 주제 · t 출처 등급
   같은 대분류 안에서 여러 값을 고르면 ‘또는’, 대분류끼리는 ‘그리고’로 거른다(예: 2022 + 미국 + 반도체 + 선례).
   분류 규칙: 연도 = 그 자료의 발생일(선례)·공포/시행/공표일(법령·지침)·발행 연도. 판을 모르는 현행 원문(예: eCFR 조항)은 연도를 비운다.
   산업 ‘all’은 업종을 가리지 않는 자료. 위험 요인·관리 주제는 자료가 직접 다루는 것만 단다. */
window.SHE = window.SHE || {};
(function () {
  const S = window.SHE;
  const B = (ko, en) => ({ ko, en });

  /* ---------- 대분류·소분류 ---------- */
  S.LIB_FACETS = [
    { id: 'k', t: B('자료 유형', 'Type'), v: [
      ['law', B('법령(법률·시행령·규칙)', 'Statutes & regulations')], ['notice', B('고시·행정규칙', 'Notices & admin rules')], ['code', B('법정 기술기준', 'Mandatory technical codes')],
      ['treaty', B('국제협약', 'International conventions')], ['guide', B('기술지침·공공 지침', 'Technical & official guidance')], ['std', B('표준(본문 유료)', 'Standards (paid text)')],
      ['case', B('사고 사례', 'Accident cases')], ['report', B('공식 사고조사 보고서', 'Official investigation reports')], ['court', B('판례', 'Court rulings')], ['enf', B('감독·처분 결과', 'Inspection & enforcement')],
      ['news', B('정부 발표·법령 개정 소식', 'Government announcements')], ['stat', B('통계·공개 데이터', 'Statistics & open data')], ['edu', B('교육·학습 자료', 'Training material')],
      ['corp', B('기업 공개자료', 'Company publications')], ['chem', B('물질 정보', 'Substance data')], ['site', B('공식 사이트·데이터베이스', 'Official sites & databases')],
      ['book', B('가이드북 절', 'Guidebook sections')], ['sop', B('포털 SOP(교육용)', 'Portal SOPs (teaching)')]],
      groups: [[B('법령·기준', 'Law & standards'), ['law', 'notice', 'code', 'treaty', 'guide', 'std']], [B('선례', 'Precedents'), ['case', 'report', 'court', 'enf']], [B('자료·데이터', 'Data & material'), ['news', 'stat', 'edu', 'corp', 'chem', 'site']], [B('포털 작성', 'Written for the portal'), ['book', 'sop']]] },
    { id: 'c', t: B('나라·지역', 'Country / region'), v: [
      ['INT', B('국제', 'International')], ['KR', B('한국', 'Korea')], ['US', B('미국', 'United States')], ['UK', B('영국', 'United Kingdom')], ['EU', B('EU', 'EU')], ['JP', B('일본', 'Japan')], ['TW', B('대만', 'Taiwan')]] },
    { id: 'y', t: B('연도', 'Year'), v: [] },   /* 자료에 있는 연도로 채운다 */
    { id: 'i', t: B('산업·업종', 'Industry'), v: [
      ['all', B('전 산업(공통)', 'All industries')], ['semi', B('반도체·전자', 'Semiconductors & electronics')], ['chem', B('화학 제조', 'Chemical manufacturing')], ['oil', B('정유·석유·가스 생산', 'Refining, oil & gas')],
      ['energy', B('발전·에너지·유틸리티', 'Power & utilities')], ['metal', B('금속·철강', 'Metals & steel')], ['mfg', B('제조 일반(제지·포장·목재 등)', 'General manufacturing')], ['food', B('식품·농업', 'Food & agriculture')],
      ['logi', B('물류·저장·운송', 'Storage, distribution & transport')], ['waste', B('폐기물·수처리', 'Waste & water treatment')], ['const', B('건설', 'Construction')], ['lab', B('연구·교육·실험실', 'Labs, research & education')], ['pub', B('공공·상업 시설', 'Public & commercial premises')]] },
    { id: 'h', t: B('위험 요인', 'Hazard'), v: [
      ['chem', B('화학물질 노출·누출', 'Chemical exposure & release')], ['gas', B('가스(고압·독성·특수)', 'Gases')], ['fire', B('화재·폭발', 'Fire & explosion')], ['dust', B('분진 폭발', 'Combustible dust')], ['reactive', B('반응성·폭주반응', 'Reactive chemicals')],
      ['press', B('압력설비·용기 파열', 'Pressure equipment')], ['elec', B('전기', 'Electrical')], ['mach', B('기계·끼임·운반', 'Machinery, caught-in & handling')], ['fall', B('추락', 'Falls')], ['collapse', B('붕괴·도괴', 'Collapse')],
      ['conf', B('밀폐공간·질식', 'Confined space & asphyxiation')], ['rad', B('방사선', 'Radiation')], ['noise', B('소음', 'Noise')], ['heat', B('온열·한랭', 'Heat & cold')], ['ergo', B('인간공학·근골격계', 'Ergonomics')],
      ['psych', B('직무스트레스·심리', 'Work stress')], ['health', B('보건·건강관리', 'Health & first aid')], ['env', B('환경(대기·수질·폐기물·온실가스)', 'Environment')]] },
    { id: 'm', t: B('관리 주제', 'Management topic'), v: [
      ['org', B('일반 의무·관리체제', 'General duties & organisation')], ['ra', B('위험성평가·대책', 'Risk assessment & controls')], ['psm', B('공정안전·변경관리', 'Process safety & MOC')], ['ptw', B('작업허가·위험작업', 'Permits & high-risk work')],
      ['contract', B('도급·협력사', 'Contractors')], ['training', B('교육', 'Training')], ['emer', B('비상대응', 'Emergency response')], ['inv', B('사고 보고·조사', 'Incident reporting & investigation')],
      ['liab', B('중대재해·법적 책임', 'Serious accidents & liability')], ['ppe', B('보호구', 'PPE')], ['signs', B('표지·경고표지·MSDS', 'Signs, labels & SDS')], ['monitor', B('작업환경측정·건강진단', 'Monitoring & health checks')],
      ['ms', B('경영시스템·안전문화', 'Management systems & culture')], ['tech', B('스마트 안전·디지털', 'Digital & smart safety')], ['proc', B('공정 이해', 'Process knowledge')]] },
    { id: 't', t: B('출처 등급', 'Source tier'), v: [
      ['1', B('1등급 — 법령·조약·판례 원문', 'Tier 1 — statutes, treaties, rulings')], ['2', B('2등급 — 정부·공공기관 지침·고시·발표', 'Tier 2 — official guidance & notices')],
      ['3', B('3등급 — 공식 조사보고서·통계', 'Tier 3 — official reports & statistics')], ['4', B('4등급 — 기업·단체 공개자료·언론 기반', 'Tier 4 — company/association material, press-based')],
      ['B', B('가이드북(1~2등급 원문 정리)', 'Guidebook (from tier 1–2 originals)')], ['P', B('포털 작성 교육자료', 'Portal teaching material')]] }
  ];

  /* ---------- 출처 목록(SHE.SOURCES) 항목의 분류 ----------
     [유형, 나라, '연도 연도', 산업, '위험 요인', '관리 주제', 등급] — 목록에 없는 출처(언론 기사, 단위 표준 등)는 라이브러리 항목으로 만들지 않는다 */
  S.LIB_SRC = {
    /* SK하이닉스 공식(4등급) */
    sr2026: ['corp', 'KR', '2026', 'semi', 'env', 'ms contract emer', 4], sr2025: ['corp', 'KR', '2025', 'semi', 'env', 'ms contract emer', 4], sr2024: ['corp', 'KR', '2024', 'semi', 'env', 'ms contract emer', 4],
    nr2022: ['corp', 'KR', '2022', 'semi', '', 'ms', 4], nr2015: ['corp', 'KR', '2015', 'semi', 'env', 'ms', 4], nr2025she: ['corp', 'KR', '2025', 'semi', '', 'training', 4],
    nrgaon: ['corp', 'KR', '', 'semi', '', 'tech', 4], nrbp2026: ['corp', 'KR', '2026', 'semi', '', 'contract', 4], nrconsult: ['corp', 'KR', '2025', 'semi', '', 'contract', 4],
    nrThanks0917: ['corp', 'KR', '2026', 'semi', '', 'contract ms', 4], nrWater0910: ['corp', 'KR', '2026', 'semi', 'env', '', 4], nr0609: ['corp', 'KR', '2026', 'semi', '', 'contract', 4],
    nr0909: ['corp', 'KR', '2026', 'semi', '', 'tech', 4], nrMetal: ['corp', 'KR', '2023', 'semi', '', 'proc', 4], nrDepo: ['corp', 'KR', '2022', 'semi', '', 'proc', 4], nrAld: ['corp', 'KR', '2018', 'semi', '', 'proc', 4],
    nrScrubber: ['corp', 'KR', '2024', 'semi', 'env', 'tech', 4], nrLowGwp: ['corp', 'KR', '2024', 'semi', 'env', '', 4], nrCmp: ['corp', 'KR', '2022', 'semi', '', 'proc', 4], nrWlp: ['corp', 'KR', '2023', 'semi', '', 'proc', 4],
    bpshe: ['site', 'KR', '', 'semi', '', 'training contract', 4],
    /* 한국 법령·고시·기술기준(1~2등급) */
    lawAct: ['law', 'KR', '2026', 'all', '', 'org ra contract inv training', 1], lawActNext: ['law', 'KR', '2026 2027', 'all', '', 'training', 1],
    lawDecree: ['law', 'KR', '2026', 'all', '', 'org psm contract', 1], lawRule: ['law', 'KR', '2026', 'all', 'health', 'org ra training inv monitor', 1],
    lawStd: ['law', 'KR', '2025 2026', 'all', 'mach fall elec conf chem fire heat health collapse', 'ptw ppe', 1], lawActHist: ['law', 'KR', '1981 1982', 'all', '', 'org', 1],
    lawSapa: ['law', 'KR', '2025', 'all', '', 'liab ms', 1], lawSapaAct: ['law', 'KR', '2022', 'all', '', 'liab', 1],
    lawFire: ['law', 'KR', '2026', 'all', 'fire', 'emer', 1], lawFirePrev: ['law', 'KR', '2026', 'all', 'fire', 'training emer', 1], lawFireDecree: ['law', 'KR', '2024 2026', 'all', 'fire', 'org', 1],
    lawCca: ['law', 'KR', '2025', 'all', 'chem env', 'emer org', 1], lawCcaDecree: ['law', 'KR', '2025', 'all', 'chem env', '', 1], lawCcaRule: ['law', 'KR', '2025', 'all', 'chem', 'training', 1],
    nicsErp: ['notice', 'KR', '2025', 'all', 'chem env', '', 2], envPrtr: ['notice', 'KR', '2025', 'all', 'chem env', '', 2], mceReport: ['notice', 'KR', '2025', 'all', 'chem', 'inv emer', 2],
    lawHpg: ['law', 'KR', '2026', 'all', 'gas', 'org training inv', 1], lawHpgDecree: ['law', 'KR', '2026', 'all', 'gas', 'org', 1], lawHpgRule: ['law', 'KR', '2026', 'all semi', 'gas', 'training inv', 1],
    lawDg: ['law', 'KR', '2025', 'all', 'fire chem', 'org', 1], lawDgDecree: ['law', 'KR', '2026', 'all', 'fire chem', 'org', 1], lawDgRule: ['law', 'KR', '2026', 'all', 'fire', 'training', 1],
    lawNsa: ['law', 'KR', '2026', 'all', 'rad', 'training org', 1], lawNsaDecree: ['law', 'KR', '2026', 'all', 'rad', 'training', 1], lawNsaRule: ['law', 'KR', '2026', 'all semi', 'rad', '', 1],
    moelOel: ['notice', 'KR', '2018 2020', 'all', 'chem health noise', 'monitor', 2], lawRuleSigns: ['law', 'KR', '2026', 'all', '', 'signs', 1],
    envIp: ['law', 'KR', '2026', 'all', 'env', 'org', 1], envIpDecree: ['law', 'KR', '2026', 'all', 'env', '', 1], envIpRule: ['law', 'KR', '2025', 'all', 'env', '', 1],
    envAir: ['law', 'KR', '2026', 'all', 'env chem', '', 1], envAirDecree: ['law', 'KR', '2026', 'all', 'env', '', 1], envAirRule: ['law', 'KR', '2026', 'all', 'env chem', '', 1],
    envWater: ['law', 'KR', '2026', 'all', 'env chem', '', 1], envWaterDecree: ['law', 'KR', '2026', 'all', 'env', '', 1], envWaterRule: ['law', 'KR', '2026', 'all', 'env chem', '', 1],
    envWaste: ['law', 'KR', '2026', 'all', 'env', '', 1], envWasteDecree: ['law', 'KR', '2026', 'all', 'env', '', 1], envWasteRule: ['law', 'KR', '2026', 'all', 'env', '', 1],
    cnAct: ['law', 'KR', '2026', 'all semi', 'env', '', 1], ets: ['law', 'KR', '2026', 'all', 'env', '', 1], etsDecree: ['law', 'KR', '2026', 'all', 'env', '', 1], etsMrv: ['notice', 'KR', '2025', 'all', 'env', '', 2],
    lawEms: ['law', 'KR', '2026', 'all', 'health', 'emer', 1], moelGhs: ['notice', 'KR', '2026', 'all', 'chem', 'signs', 2], moelMsd: ['notice', 'KR', '2020', 'all', 'ergo', 'ra', 2],
    moelRa: ['notice', 'KR', '2024 2025', 'all', '', 'ra', 2], moelPsm: ['notice', 'KR', '2025', 'chem semi oil', 'chem fire', 'psm', 2], moelPpe: ['notice', 'KR', '2023', 'all', '', 'ppe', 2],
    moelWem: ['notice', 'KR', '2020', 'all', 'chem noise health', 'monitor', 2],
    kgsFu211: ['code', 'KR', '2026', 'all', 'gas', '', 2], kgsFu212: ['code', 'KR', '2026', 'semi', 'gas', '', 2],
    /* 한국 정부 발표·감독·조사·데이터 */
    moel0830: ['news', 'KR', '2026', 'mfg all', 'mach', '', 2], moel0916: ['news', 'KR', '2026', 'all', 'mach', 'signs', 2], moel0928: ['news', 'KR', '2026', 'all const', 'fall mach', 'ppe', 2],
    moel0930: ['news', 'KR', '2026', 'all', 'chem', '', 2], moel0920: ['enf', 'KR', '2026', 'semi', 'chem gas', 'contract inv', 2], moel0626: ['news', 'KR', '2026', 'semi', 'chem gas', '', 2],
    moelNotice1201: ['news', 'KR', '2025', 'all', 'conf', 'ptw', 2], moelKosha2026: ['news', 'KR', '2026', 'all', '', '', 2], moelRpt0527: ['news', 'KR', '2026', 'all', '', 'inv', 2],
    eindex: ['stat', 'KR', '', 'all', '', 'inv', 3], koshaGuide: ['site', 'KR', '2026', 'all', '', '', 2], koshaMsds: ['site', 'KR', '', 'all', 'chem', 'signs', 2], moelRpt: ['site', 'KR', '2026', 'all', '', 'inv', 3],
    nsscSamsung: ['report', 'KR', '2024', 'semi', 'rad', 'inv', 3], safekoreaCpr: ['guide', 'KR', '', 'all', 'health', 'emer', 2], icisPrtr: ['stat', 'KR', '2024', 'all semi', 'chem env', '', 3],
    nierGhgTest: ['news', 'KR', '2023', 'semi', 'env', '', 2], girPr0921: ['stat', 'KR', '2026', 'all', 'env', '', 3],
    scourt2021: ['court', 'KR', '2021', 'semi const', 'conf', 'liab', 1],
    /* 국제·해외 */
    nioshIdlh: ['guide', 'US', '', 'all', 'chem gas', 'emer', 2], osha146: ['law', 'US', '', 'all', 'conf', 'ptw', 1], osha119: ['law', 'US', '', 'chem oil', 'chem fire', 'psm', 1],
    osha147: ['law', 'US', '', 'all', 'mach elec', 'ptw', 1], osha252: ['law', 'US', '', 'all', 'fire', 'ptw', 1], oshaResp: ['law', 'US', '', 'all', 'chem', 'ppe', 1],
    erg2024: ['guide', 'US', '2024', 'logi all', 'chem fire gas', 'emer', 2], epaAegl: ['guide', 'US', '', 'all', 'chem', 'emer', 2], nioshNpg: ['guide', 'US', '', 'all', 'chem', '', 2],
    oshaSemi: ['guide', 'US', '', 'semi', 'chem gas', 'proc', 2], oshaSemiFs: ['guide', 'US', '2024', 'semi', 'chem gas elec', '', 2], epaGhg: ['law', 'US', '2025', 'semi all', 'env', '', 1],
    icsc: ['chem', 'INT', '2018', 'all', 'chem', 'signs', 2], hseRisk: ['guide', 'UK', '', 'all', '', 'ra', 2], oira: ['site', 'EU', '', 'all', '', 'ra', 2],
    csbVideos: ['edu', 'US', '', 'chem oil', 'chem fire', 'inv training', 3], ccpsBeacon: ['edu', 'INT', '', 'chem oil', 'chem fire', 'psm training', 4],
    iso45001: ['std', 'INT', '2018 2024', 'all', '', 'ms', 4], semiEhs: ['std', 'INT', '', 'semi', 'chem gas elec', '', 4], nfpa318: ['std', 'US', '2025', 'semi', 'fire', '', 4],
    nioshHoc: ['guide', 'US', '2024', 'all', '', 'ra', 2], oshaPicto: ['guide', 'US', '2024', 'all', 'chem', 'signs', 2], iogpLsr: ['guide', 'INT', '', 'oil', 'fall mach', 'ptw ms', 4],
    iloC155: ['treaty', 'INT', '1981', 'all', '', 'org', 1], iloC187: ['treaty', 'INT', '2006', 'all', '', 'org ms', 1], iloRatify: ['stat', 'INT', '2026', 'all', '', 'org', 3], iloFund: ['guide', 'INT', '2022', 'all', '', 'org', 2],
    eu89391: ['law', 'EU', '1989', 'all', '', 'org ra training', 1], euOshaFd: ['guide', 'EU', '', 'all', '', 'org', 2],
    ukHswa: ['law', 'UK', '1974', 'all', '', 'org', 1], hseHswa: ['guide', 'UK', '', 'all', '', 'org', 2], ukMhswr: ['law', 'UK', '1999', 'all', '', 'ra', 1],
    oshAct: ['law', 'US', '1970', 'all', '', 'org', 1], cfr1910_132: ['law', 'US', '', 'all', '', 'ppe ra', 1], oshaRp: ['guide', 'US', '2016', 'all', '', 'ms ra', 2],
    jpIshl: ['law', 'JP', '1972 2025 2026', 'all', 'chem', 'org ra', 1],
    /* 타사 공식(4등급) */
    tsmc2023: ['corp', 'TW', '2023', 'semi', '', 'contract tech', 4], tsmcTsia: ['corp', 'TW', '2017', 'semi', 'health chem rad noise', 'contract', 4],
    samsung: ['corp', 'KR', '', 'semi', '', 'contract', 4], intelEhs: ['corp', 'US', '', 'semi', '', 'contract', 4]
  };
  /* 출처 → 같은 문서의 KOSHA GUIDE 항목(중복 대신 하나로 합친다) */
  S.LIB_SRC_KOSHA = { koshaCC49: 'C-C-49-2026', koshaCC87: 'C-C-87-2026', koshaP179: 'P-179-2022', koshaCC85: 'C-C-85-2026', koshaHf: 'H-123-2013', koshaStatic: 'E-188-2021', koshaCleanroom: 'P-46-2012', koshaH178: 'H-178-2022', koshaEG2: 'E-G-2-2025', koshaW23: 'W-23-2016', koshaE187: 'E-187-2021', koshaCC65: 'C-C-65-2026', koshaReactive: 'C-C-3-2025', koshaToxGas: 'P-153-2016', koshaLeak: 'M-150-2022' };

  /* ---------- KOSHA GUIDE(SHE.KOSHA) 분류: [산업, 위험 요인, 관리 주제] — 연도는 공표일 ---------- */
  S.LIB_KOSHA = {
    'P-12-2012': ['semi', 'gas', ''], 'P-16-2012': ['semi', 'fire', ''], 'P-122-2012': ['semi', 'gas', ''], 'P-139-2013': ['all', 'gas', 'emer'], 'P-167-2020': ['all', 'chem', ''],
    'P-179-2022': ['all', 'gas fire', ''], 'H-171-2023': ['semi', 'chem health', 'monitor'], 'X-68-2015': ['all', 'conf', 'ra'], 'C-74-2015': ['const', 'fall', ''], 'X-44-2016': ['all', 'fall', 'ra'],
    'H-62-2021': ['all', 'rad health', 'monitor'], 'H-155-2019': ['all', 'rad health', 'monitor'], 'C-C-65-2026': ['semi', 'chem gas fire', 'proc'], 'C-C-87-2026': ['all', 'gas', ''], 'C-C-49-2026': ['all', '', 'ptw'],
    'E-G-18-2026': ['all', 'conf', 'ptw'], 'A-G-14-2026': ['all', 'fire', 'ptw'], 'A-G-11-2025': ['all', 'fire', ''], 'B-M-25-2026': ['all', 'mach elec', 'ptw'], 'A-G-4-2025': ['all', 'fall', ''],
    'B-M-7-2025': ['all', 'mach', ''], 'C-C-36-2026': ['chem all', '', 'ra psm'], 'C-C-37-2026': ['chem oil', '', 'ra psm'], 'C-C-38-2026': ['chem all', '', 'ra psm'], 'C-C-40-2026': ['chem all', '', 'ra psm'],
    'C-C-62-2026': ['chem oil', '', 'ra psm'], 'C-C-55-2026': ['all', '', 'emer psm'], 'C-C-52-2026': ['chem all', '', 'psm'], 'C-C-53-2026': ['chem all', '', 'psm'], 'C-C-67-2026': ['all', '', 'ra'],
    'E-G-19-2026': ['all', 'chem', 'ppe'], 'A-G-12-2026': ['all', '', 'ppe'], 'B-E-10-2026': ['all', 'elec', 'ptw'], 'D-C-10-2026': ['const', 'mach', 'ptw'], 'B-M-34-2026': ['all', 'mach', ''],
    'B-M-12-2025': ['all', 'mach', ''], 'B-E-11-2026': ['all', 'elec', 'ptw'], 'B-E-12-2026': ['all', 'elec', ''], 'B-M-11-2025': ['all logi', 'mach', ''], 'C-C-16-2026': ['all', 'chem', 'emer'],
    'D-C-11-2026': ['const', 'collapse', ''], 'M-150-2022': ['all', 'gas press', ''], 'C-C-17-2026': ['chem all', 'press', ''], 'C-C-85-2026': ['chem semi', 'gas fire conf', 'ptw'], 'H-123-2013': ['all semi', 'chem health', 'emer'],
    'P-21-2010': ['chem', 'chem', ''], 'P-153-2016': ['all', 'gas chem', 'emer'], 'P-46-2012': ['semi', 'fire chem', ''], 'E-188-2021': ['all', 'fire', ''], 'C-C-3-2025': ['chem semi', 'chem fire reactive', ''],
    'E-187-2021': ['all', 'gas fire', ''], 'W-23-2016': ['all', 'noise', 'monitor'], 'H-178-2022': ['all', 'health', ''], 'E-G-2-2025': ['all', 'psych', '']
  };

  /* ---------- 사고사례(SHE.CASES)의 사고 유형 → 위험 요인 ---------- */
  S.LIB_CASE_HZ = { fire: 'fire', leak: 'chem gas', contact: 'chem', reg: '', asphyx: 'conf', fall: 'fall', rad: 'rad', shock: 'elec', burn: 'elec', caught: 'mach' };
  /* 정부 재해조사보고서 사례의 업종(보고서에 적힌 범위) */
  S.LIB_CASE_IND = { 'gov-2024-excavator': 'const', 'gov-2024-falls': 'const all' };

  /* ---------- SOP(SHE.SOPS): [위험 요인, 관리 주제] ---------- */
  S.LIB_SOP = {
    confined: ['conf', 'ptw'], 'hot-work': ['fire', 'ptw'], 'gas-cylinder': ['gas', ''], 'chem-supply': ['chem', ''], 'pm-chamber': ['chem gas mach', 'ptw'], 'pump-scrubber': ['chem mach', 'ptw'],
    'line-break': ['chem gas', 'ptw'], loto: ['elec mach', 'ptw'], height: ['fall', 'ptw'], 'equip-move': ['mach', ''], implant: ['gas rad elec', ''], photo: ['chem', ''], 'wet-bench': ['chem', ''],
    xray: ['rad', ''], crane: ['mach', ''], 'live-elec': ['elec', 'ptw'], forklift: ['mach', ''], eyewash: ['chem', 'emer'], excavation: ['collapse', 'ptw'], 'gas-alarm': ['gas', 'emer'],
    'chem-spill': ['chem', 'emer'], 'solvent-transfer': ['fire chem', ''], 'leak-test': ['gas press', ''], noise: ['noise', 'monitor'], 'manual-lifting': ['ergo', ''], 'cardiac-arrest': ['health', 'emer'],
    'cleanroom-chem': ['chem', ''], pyrophoric: ['chem fire reactive', ''], 'hf-exposure': ['chem health', 'emer']
  };

  /* ---------- 공식 사이트(SHE.RESOURCES): 나라·등급 (출처 목록과 주소가 같은 곳은 출처 항목 하나로 합친다) ---------- */
  S.LIB_RES = {
    skhynix: ['KR', 4], newsroom: ['KR', 4], lawgo: ['KR', 1], moel: ['KR', 2], koshaPortal: ['KR', 2], koshaGuide: ['KR', 2], msds: ['KR', 2], nics: ['KR', 2], nfa: ['KR', 2], kgs: ['KR', 2],
    osha1910: ['US', 1], oshaSemi: ['US', 2], hse: ['UK', 2], safekorea: ['KR', 2], nfds: ['KR', 3], kfsi: ['KR', 2], nssc: ['KR', 2], icis: ['KR', 3], gir: ['KR', 3], koshaResearch: ['KR', 3],
    ergPhmsa: ['US', 2], aegl: ['US', 2], pubchem: ['US', 3], euosha: ['EU', 2], jpAnzen: ['JP', 2]
  };
  S.LIB_RES_SUBJ = { law: ['', 'org'], chem: ['chem', 'signs'], fire: ['fire', 'emer'], psm: ['', 'psm'], risk: ['', 'ra'], incident: ['', 'inv'], stats: ['', ''], culture: ['', 'ms'], company: ['', ''] };

  /* ---------- 라이브러리용으로 새로 모은 공식 자료 ---------- */
  /* 미국 CSB(화학안전·위험조사위원회) 완료 조사 — 2026-10-04 CSB 누리집 ‘Completed Investigations’의 조사 상세(사고명·장소·발생일·최종보고서 공개일·사고 유형·요약)에서 확인.
     요약은 CSB 상세 화면의 문장만 옮겼다(사상자 수는 CSB가 적은 경우에만). 발생일은 상세 화면의 ‘Accident Occurred On’ 값.
     같은 화면의 나머지 조사 78건은 CSB 서버가 연속 요청에 오류(HTTP 500)를 돌려 다음 업데이트에서 천천히 이어서 모은다 */
  const ORG_CSB = B('미국 화학안전·위험조사위원회(CSB)', 'US Chemical Safety and Hazard Investigation Board (CSB)');
  const iso = (mdy) => { const [m, d, y] = mdy.split('/'); return `${y}-${m}-${d}`; };
  const csb = (slug, ko, en, loc, occ, fin, ind, hz, m, sko, sen, k) => ({
    id: 'csb-' + slug.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), k: k || 'report', c: ['US'], y: [occ.slice(-4)], d: iso(occ), d2: iso(fin), loc,
    i: ind, h: hz, m: (k === 'guide' ? '' : 'inv ') + m, tier: 3, title: B(ko, en), org: ORG_CSB, sum: B(sko, sen), url: 'https://www.csb.gov/' + slug + '/', src: ['csbInv']
  });
  S.LIB_ITEMS = [
    csb('shell-polymers-furnace-explosion-and-fire', 'Shell Polymers 에탄 분해로 폭발·화재', 'Shell Polymers Furnace Explosion and Fire', 'Monaca, PA', '06/04/2025', '09/16/2026', 'chem', 'fire', 'psm ra',
      ['2025년 6월 4일 에탄 분해로에서 폭발, 화재와 에틸렌 분해가스·연소생성물 방출, 재산 피해 추정 9,500만 달러.', 'CSB 권고: 공정위험성분석에서 행정적 대책만으로 다루는 공정 이탈 시나리오를 찾아, 사망·중상·큰 재산 피해로 이어질 수 있는 시나리오에는 본질안전 설계나 공학적 대책을 적용.'],
      ['Explosion in an ethane cracking furnace on 4 June 2025, causing a fire and a release of cracked gas and combustion products; estimated property damage USD 95 million.', 'CSB recommendation: find process deviations handled only by administrative controls in the PHA, and apply inherently safer design or engineered controls where they could cause a fatality, serious injury or major damage.']),
    csb('united-states-steel-corporation-clairton-plant-coke-oven-explosion-', 'US Steel Clairton 코크스 오븐 가스 폭발', 'United States Steel Corporation Clairton Plant Coke Oven Explosion', 'Clairton, PA', '08/11/2025', '08/10/2026', 'metal', 'fire gas', '',
      ['2025년 8월 11일 코크스 오븐 배터리 13·14호기에서 폭발 — 2명 사망, 여러 명 부상.'], ['Explosion at coke oven batteries 13 and 14 on 11 August 2025 — two deaths and multiple injuries.']),
    csb('bio-lab-inc-conyers-fire-and-chemical-release-', 'Bio-Lab Conyers 화재·화학물질 방출', 'Bio-Lab Inc. Conyers Fire and Chemical Release', 'Conyers, GA', '09/29/2024', '07/21/2026', 'chem', 'fire chem', 'emer',
      ['2024년 9월 29일 수영장·스파 약품 공장 화재 — 유색·검은 연기와 화학물질 가스 발생, 인근 주민 실내 대피(shelter-in-place).'], ['Fire at a pool and spa chemicals plant on 29 September 2024 — coloured and dark smoke plumes with chemical off-gassing; nearby residents told to shelter in place.']),
    csb('givaudan-sense-colour-explosion-', 'Givaudan Sense Colour 폭발', 'Givaudan Sense Colour Explosion', 'Louisville, KY', '11/12/2024', '05/27/2026', 'chem', 'fire press', '',
      ['2024년 11월 12일 대형 폭발 — 2명 사망, 2명 중상. 압력용기 일부가 경계 밖으로 날아가 주택을 파손.'], ['Massive explosion on 12 November 2024 — two deaths and two serious injuries; part of a pressure vessel was thrown beyond the fence line and damaged a home.']),
    csb('dow-louisiana-operations-explosions', 'Dow Louisiana 산화에틸렌 정제 설비 연쇄 폭발', 'Dow Louisiana Operations Explosions', 'Plaquemine, LA', '07/14/2023', '02/26/2026', 'chem', 'fire reactive', 'psm',
      ['2023년 7월 14일 글리콜 II 산화에틸렌 정제 설비에서 여러 차례 폭발 — 큰 재산 피해, 부상자 없음.'], ['Multiple explosions in the Glycol II ethylene oxide finishing unit on 14 July 2023 — substantial property damage, no injuries.']),
    csb('pemex-deer-park-chemical-release-', 'PEMEX Deer Park 정유공장 황화수소 누출', 'PEMEX Deer Park Chemical Release', 'Deer Park, TX', '10/10/2024', '02/23/2026', 'oil', 'gas chem', 'ptw',
      ['2024년 10월 10일 아민 회수 설비에서 황화수소 배관의 차단판(블라인드)을 떼어 내던 중 황화수소 누출 — 2명 사망, 13명 부상.'], ['Hydrogen sulfide release at the amine recovery unit on 10 October 2024 while workers were removing an isolation blind from H₂S piping — two deaths, 13 injuries.']),
    csb('cuisine-solutions-ammonia-release-', 'Cuisine Solutions 식품공장 암모니아 누출', 'Cuisine Solutions Ammonia Release', 'Sterling, VA', '07/31/2024', '09/25/2025', 'food', 'chem gas', 'emer',
      ['2024년 7월 31일 식품 가공공장(직원 약 350명) 암모니아 누출 — 40명이 병원 진료, 4명 입원(1명 중환자실).'], ['Ammonia release at a food processing plant (about 350 employees) on 31 July 2024 — 40 people evaluated at hospitals, four admitted, one to intensive care.']),
    csb('ts-usa-molten-salt-eruption', 'TS USA 액체 질화 설비 용융염 분출', 'TS USA Molten Salt Eruption', 'Chattanooga, TN', '05/30/2024', '06/03/2025', 'metal', 'chem reactive', '',
      ['2024년 5월 30일 액체 질화(금속 열처리) 설비의 공정 용기에서 화학물질 분출 — 근로자 1명 사망.'], ['Chemical release and eruption from a process vessel at a liquid nitriding (metal heat-treating) facility on 30 May 2024 — one worker died.']),
    csb('honeywell-geismar-chlorine-and-hydrogen-fluoride-releases', 'Honeywell Geismar 염소·불화수소 누출', 'Honeywell Geismar Chlorine and Hydrogen Fluoride Releases', 'Geismar, LA', '01/23/2023', '05/27/2025', 'chem', 'chem gas press', '',
      ['2023년 1월 23일 열교환기 파열로 불화수소(HF) 가스·염소 가스와 공정 유체 누출 — 부상자 없음.', '같은 설비의 2024년 6월 7일 불화수소산 누출(근로자 1명 중상)도 CSB가 조사 중이라고 적음.'], ['Heat exchanger rupture on 23 January 2023 released hydrogen fluoride gas, chlorine and other process fluids — no injuries.', 'CSB notes it is also investigating a 7 June 2024 hydrofluoric acid release at the site that seriously injured one worker.']),
    csb('marathon-martinez-renewable-fuels-fire-', 'Marathon Martinez 재생연료 설비 가열로 튜브 파열·화재', 'Marathon Martinez Renewable Fuels Fire', 'Martinez, CA', '11/19/2023', '03/13/2025', 'oil', 'fire', '',
      ['2023년 11월 19일 수소화탈산소 설비 재순환 가열로 화재 — 운전원 1명 중증 화상.'], ['Fire at the hydrodeoxygenation unit recycle furnace on 19 November 2023 — one operator seriously burned.']),
    csb('csb-safety-study-remote-isolation-of-process-equipment', 'CSB 안전 연구 — 공정 설비의 원격 차단', 'CSB Safety Study: Remote Isolation of Process Equipment', '', '07/25/2024', '07/25/2024', 'chem oil', 'chem fire', 'emer psm',
      ['2024년 7월 25일 공개. 누출(loss of containment) 뒤 효과적인 원격 차단 설비가 없어 피해가 커진 여러 사고를 검토한 안전 연구 — 중상·사망·환경 오염·설비 파손으로 이어진 사례들.'], ['Released 25 July 2024. A safety study of incidents whose consequences escalated after a loss of containment because effective remote isolation equipment was lacking — leading to serious injuries, deaths, contamination and severe damage.'], 'guide'),
    csb('bp---husky-oregon-chemical-release-and-fire-', 'BP-Husky Toledo 정유공장 나프타 누출·화재', 'BP - Husky Oregon Chemical Release and Fire', 'Oregon, OH', '09/20/2022', '06/24/2024', 'oil', 'fire', '',
      ['2022년 9월 20일 가연성 물질 누출에 불이 붙어 화재 — 근로자 2명 사망, 큰 재산 피해.'], ['Accidental release of flammable chemicals ignited on 20 September 2022 — two workers died; substantial property damage.']),
    csb('wendland-1h-well-fatal-explosion-', 'Wendland 1H 가스정 폭발', 'Wendland 1H Well Fatal Explosion', 'Burleson County, TX', '01/29/2020', '12/26/2023', 'oil', 'fire gas', 'contract',
      ['2020년 1월 29일 가스정 폭발 — 협력업체 근로자 3명 사망.', 'CSB 권고: 관련 정보를 API RP 59(유정 제어 작업 권장 실무) 등 적절한 문서에 반영.'], ['Gas well explosion on 29 January 2020 — three contractors died.', 'CSB recommendation: publish the related information in a document such as API RP 59 (well control operations).']),
    csb('kmco-llc-fatal-fire-and-explosion-', 'KMCO 특수화학 공장 화재·폭발', 'KMCO LLC Fatal Fire and Explosion', 'Crosby, TX', '04/02/2019', '12/21/2023', 'chem', 'fire', '',
      ['2019년 4월 2일 위탁·특수화학 제조 공장 화재·폭발 — 1명 사망, 여러 명 부상.'], ['Fire and explosion at a custom and specialty chemical plant on 2 April 2019 — one death and multiple injuries.']),
    csb('foundation-food-group-fatal-chemical-release-', 'Foundation Food Group 액체질소 누출(질식)', 'Foundation Food Group Fatal Chemical Release', 'Gainesville, GA', '01/28/2021', '12/11/2023', 'food', 'gas conf', '',
      ['2021년 1월 28일 식품공장 액체질소 누출 — 6명 사망, 여러 명 부상.'], ['Liquid nitrogen release at a prepared-foods plant on 28 January 2021 — six deaths and multiple injuries.']),
    csb('yenkin-majestic-resin-plant-vapor-cloud-explosion-and-fire', 'Yenkin-Majestic 수지 공장 증기운 폭발·화재', 'Yenkin-Majestic Resin Plant Vapor Cloud Explosion and Fire', 'Columbus, OH', '04/08/2021', '11/30/2023', 'chem', 'fire', '',
      ['2021년 4월 8일 도료·수지 공장 폭발·화재 — 1명 사망, 8명 병원 이송, 인근 건물 진동·업체 피해.'], ['Explosion and fire at a paint and resin plant on 8 April 2021 — one death, eight taken to hospital; nearby buildings shaken and a business damaged.']),
    csb('intercontinental-terminals-company-itc-tank-fire', 'ITC 저장 터미널 탱크 화재', 'Intercontinental Terminals Company (ITC) Tank Fire', 'Deer Park, TX', '03/17/2019', '07/06/2023', 'logi oil', 'fire', 'emer',
      ['2019년 3월 17일 저장 터미널에서 대형 탱크 화재.'], ['Massive storage tank fire at a terminal on 17 March 2019.']),
    csb('bio-lab-conyers-chemical-release-', 'Bio-Lab Conyers 열분해·유독가스 방출', 'Bio Lab Conyers Chemical Release', 'Conyers, GA', '09/14/2020', '04/24/2023', 'chem', 'chem reactive', 'emer',
      ['2020년 9월 14일 염소 함유 제품의 열분해 — 부상자 없음, 연기로 주간고속도로 I-20 일시 폐쇄.'], ['Thermal decomposition of a chlorine-containing product on 14 September 2020 — no injuries; Interstate 20 closed temporarily by the smoke.']),
    csb('bio-lab-lake-charles-chemical-fire-and-release-', 'Bio-Lab Lake Charles 화재·염소 가스 방출', 'Bio-Lab Lake Charles Chemical Fire and Release', 'Lake Charles, LA', '08/27/2020', '04/24/2023', 'chem', 'fire chem reactive', '',
      ['2020년 8월 27일 수영장·스파 약품 공장 화재로 염소 가스 방출 — 부상자 없음, 설비 큰 피해.'], ['Fire at a pool and spa chemicals plant on 27 August 2020 released chlorine gas — no injuries, significant damage.']),
    csb('husky-energy-superior-refinery-explosion-and-fire', 'Husky Superior 정유공장 폭발·화재(취성 파괴)', 'Husky Energy Superior Refinery Explosion and Fire', 'Superior, WI', '04/26/2018', '12/29/2022', 'oil', 'fire press', '',
      ['2018년 4월 26일 5주간 정기보수를 앞두고 설비를 정지하던 중 폭발 — 여러 명 병원 이송. 최종보고서 부록에 취성 파괴 분석.'], ['Explosion on 26 April 2018 while the refinery was shutting down for a five-week turnaround — several people hospitalised; an appendix of the final report analyses brittle fracture.']),
    csb('philadelphia-energy-solutions-pes-refinery-fire-and-explosions-', 'PES 정유공장 불산 알킬화 설비 화재·폭발', 'Philadelphia Energy Solutions (PES) Refinery Fire and Explosions', 'Philadelphia, PA', '06/21/2019', '10/11/2022', 'oil', 'fire chem', 'psm',
      ['2019년 6월 21일 알킬화 설비에서 증기 누출, 점화원에 닿아 화재와 여러 차례 폭발.', 'CSB 권고: API RP 751(불화수소산 알킬화 설비 안전 운전) 개정.'], ['Vapour release in the alkylation unit on 21 June 2019 found an ignition source — fire and multiple explosions.', 'CSB recommendation: update API RP 751 on the safe operation of hydrofluoric acid alkylation units.']),
    csb('sunoco-logistics-partners-flash-fire', 'Sunoco 저장 터미널 화기작업 중 순간화재', 'Sunoco Logistics Partners Flash Fire', 'Nederland, TX', '08/12/2016', '09/28/2022', 'logi oil', 'fire', 'ptw',
      ['2016년 8월 12일 터미널의 화기작업 중 순간화재 — 7명 부상(3명 위중).'], ['Flash fire during hot work at a terminal on 12 August 2016 — seven workers injured, three critically.']),
    csb('ab-specialty-silicones-llc', 'AB Specialty Silicones 폭발·화재', 'AB Specialty Silicones, LLC', 'Waukegan, IL', '05/03/2019', '09/24/2021', 'chem', 'fire gas', '',
      ['2019년 5월 3일 대형 폭발·화재 — 근로자 4명 사망, 인근 사업장 큰 피해.', 'CSB 권고: 제조사 사양·현행 기준·업계 모범 지침에 따라 모든 유해가스의 감지·경보 프로그램과 절차를 마련.'], ['Massive explosion and fire on 3 May 2019 — four workers died; extensive damage to nearby businesses.', 'CSB recommendation: develop hazardous gas detection and alarm programmes and procedures for all hazardous gases, based on manufacturer specifications, current codes and good practice.']),
    csb('evergreen-packaging-paper-mill---fire-during-hot-work', 'Evergreen Packaging 제지공장 화기작업 중 화재', 'Evergreen Packaging Paper Mill - Fire During Hot Work', 'Canton, NC', '09/21/2020', '09/24/2021', 'mfg', 'fire', 'ptw contract',
      ['2020년 9월 21일 정기 정비 중 공정 설비 수리에서 화재 — 협력업체 근로자 2명 사망.', 'CSB 권고: 협력업체에 주는 화기작업 문서·교육·안내 자료를 회사 내부의 화기작업 정의에 맞게 고칠 것.'], ['Fire during a repair to a process unit in scheduled maintenance on 21 September 2020 — two contractors died.', 'CSB recommendation: update all hot-work documents, training and orientation for contractors to match the company’s own definition of hot work.']),
    csb('aghorn-operating-inc-waterflood-station-hydrogen-sulfide-release-', 'Aghorn 원유 생산 주입 시설 황화수소 누출', 'Aghorn Operating Inc. Waterflood Station Hydrogen Sulfide Release', 'Odessa, TX', '10/26/2019', '05/21/2021', 'oil', 'gas chem', 'ppe',
      ['2019년 10월 26일 황화수소 누출 — 근로자 1명과 일반인 1명 사망.', 'CSB 권고: 10ppm 이상 노출 가능성이 있는 시설은 근로자·방문자의 개인용 황화수소 감지기 사용을 필수로.'], ['Hydrogen sulfide release on 26 October 2019 — one worker and one member of the public died.', 'CSB recommendation: where H₂S exposure at or above 10 ppm is possible, make personal H₂S detectors mandatory for employees and visitors.']),
    csb('midland-resource-recovery-explosion-', 'Midland Resource Recovery 탱크 폭발', 'Midland Resource Recovery Explosion', 'Barbour County, WV', '05/24/2017', '12/17/2019', '', 'reactive fire', '',
      ['2017년 5월 24일 내용물을 비우던 탱크가 격렬하게 폭발.'], ['A tank exploded violently on 24 May 2017 while it was being emptied.']),
    csb('dupont-la-porte-facility-toxic-chemical-release-', 'DuPont La Porte 메틸메르캅탄 누출', 'DuPont La Porte Facility Toxic Chemical Release', 'La Porte, TX', '11/15/2014', '06/25/2019', 'chem', 'chem gas', '',
      ['2014년 11월 15일 살충제·살균제 제조에 쓰는 독성물질 메틸메르캅탄 누출 — 근로자 4명 사망, 1명 부상.'], ['Release of methyl mercaptan, a toxic chemical used in insecticide and fungicide manufacture, on 15 November 2014 — four workers died and one was injured.']),
    csb('enterprise-pascagoula-gas-plant-explosion-and-fire-', 'Enterprise Pascagoula 가스 처리 공장 폭발·화재', 'Enterprise Pascagoula Gas Plant Explosion and Fire', 'Moss Point, MS', '06/27/2016', '02/13/2019', 'oil', 'fire press', '',
      ['2016년 6월 27일 가스 처리 공장 폭발·화재.', 'CSB 권고: 브레이징 알루미늄 판형 열교환기(BAHX)의 안전한 운전·정비·수리 지침을 API 표준(API 668) 개정 등에 반영.'], ['Explosions and fire at a gas plant on 27 June 2016.', 'CSB recommendation: add guidance on the safe operation, maintenance and repair of brazed aluminium heat exchangers to API Standard 668 or a new product.']),
    csb('arkema-inc-chemical-plant-fire-', 'Arkema Crosby 유기과산화물 화재(허리케인 침수)', 'Arkema Inc. Chemical Plant Fire', 'Crosby, TX', '08/29/2017', '05/24/2018', 'chem', 'fire reactive', 'emer',
      ['2017년 8월 29일 허리케인 하비의 홍수로 유기과산화물 공장 냉동 설비가 멈춤 — 다음 날 반경 1.5마일 주민 대피, 8월 31일 트레일러의 과산화물이 자연발화, 9월 3일 당국이 남은 트레일러를 소각.'], ['Flooding from Hurricane Harvey disabled refrigeration at an organic peroxide plant on 29 August 2017 — residents within 1.5 miles evacuated the next day; peroxides in trailers ignited spontaneously on 31 August and officials burned the rest on 3 September.']),
    csb('packaging-corporation-of-america-hot-work-explosion-', 'Packaging Corporation of America(DeRidder) 화기작업 중 탱크 폭발', 'Packaging Corporation of America Hot Work Explosion', 'DeRidder, LA', '02/08/2017', '04/24/2018', 'mfg', 'fire', 'ptw contract',
      ['2017년 2월 8일 가연성 분위기가 찬 탱크 근처에서 화기작업 중 폭발 — 협력업체 근로자 3명 사망, 7명 부상.'], ['Explosion on 8 February 2017 during hot work near a tank holding a flammable atmosphere — three contractors died and seven were injured.']),
    csb('mgpi-processing-inc-toxic-chemical-release-', 'MGPI Processing 화학물질 잘못 하역으로 유독가스 발생', 'MGPI Processing, Inc. Toxic Chemical Release', 'Atchison, KS', '10/20/2016', '01/03/2018', 'food logi', 'chem reactive', 'emer',
      ['2016년 10월 증류주·밀 단백질 공장에서 화학물질 운반 차량을 혼합 금지 물질이 든 탱크에 잘못 연결 — 화학반응으로 생긴 가스 구름에 주민 수천 명 실내 대피.'], ['At a distilled spirits and wheat protein plant in October 2016, a chemical delivery truck was connected to a tank holding incompatible material — the plume led to a shelter-in-place order for thousands of residents.']),
    csb('exxonmobil-baton-rouge-refinery-chemical-release-and-fire', 'ExxonMobil Baton Rouge 정유공장 이소부탄 누출·화재', 'ExxonMobil Baton Rouge Refinery Chemical Release and Fire', 'Baton Rouge, LA', '11/22/2016', '09/18/2017', 'oil', 'fire', 'ptw',
      ['2016년 11월 22일 황산 알킬화 설비의 경미한 정비 중 이소부탄 배관이 파손돼 누출·점화 — 4명 중상, 2명 부상.'], ['An isobutane line failed during minor maintenance in the sulfuric acid alkylation unit on 22 November 2016 and the release ignited — four serious injuries and two others hurt.']),
    csb('delaware-city-refining-company', 'Delaware City 정유공장 알킬화 설비 화상 사고', 'Delaware City Refining Company', 'Delaware City, DE', '11/29/2015', '05/18/2017', 'oil', 'fire chem', 'ptw',
      ['2015년 11월 29일 배관 스풀 분리를 위해 용기의 내용물을 빼던 운전원이 얼굴·목에 2도 화상. 같은 시설에서 2015년 8월에 두 건의 사고가 앞서 있었음.'], ['On 29 November 2015 an operator de-inventorying a vessel before removing a pipe spool suffered second-degree burns to the face and neck; two other incidents had occurred at the site in August 2015.']),
    csb('airgas-facility-fatal-explosion-', 'AirGas 아산화질소 시설 폭발(사망)', 'AirGas Facility Fatal Explosion', 'Pensacola, FL', '08/28/2016', '04/20/2017', 'chem', 'gas fire reactive', '',
      ['2016년 8월 28일 아산화질소 시설의 사망 폭발 사고.', 'CSB 권고: 아산화질소의 분해 위험을 효과적으로 경고할 것.'], ['Fatal explosion at a nitrous oxide facility on 28 August 2016.', 'CSB recommendation: provide effective warnings about nitrous oxide decomposition hazards.']),
    csb('tesoro-martinez-sulfuric-acid-spill', 'Tesoro Martinez 정유공장 황산 분출', 'Tesoro Martinez Sulfuric Acid Spill', 'Martinez, CA', '02/12/2014', '08/02/2016', 'oil', 'chem', 'ptw',
      ['2014년 2월 12일 산 시료채취 계통을 되돌리려 차단 밸브를 연 직후 하류 튜브가 빠져 황산 분출 — 운전원 2명 화상, 헬기로 화상센터 이송.'], ['On 12 February 2014, tubing downstream of a block valve came apart just after the valve was opened to return an acid sampling system to service, spraying two operators with sulfuric acid; both were flown to a burn unit.']),
    csb('macondo-blowout-and-explosion', 'Macondo(딥워터 호라이즌) 유정 분출·폭발', 'Macondo Blowout and Explosion', 'Gulf of Mexico', '04/20/2010', '04/20/2016', 'oil', 'fire env', '',
      ['2010년 4월 20일 해양 시추선에서 폭발·화재 — 11명 사망, 멕시코만 대규모 원유 유출. 승선 인원 126명.'], ['Explosion and fire on the drilling rig on 20 April 2010 — 11 deaths and a massive oil spill into the Gulf of Mexico; 126 crew on board.']),
    csb('west-fertilizer-explosion-and-fire-', 'West 비료 저장·유통 시설 폭발·화재', 'West Fertilizer Explosion and Fire', 'West, TX', '04/17/2013', '01/28/2016', 'logi', 'fire chem', 'emer',
      ['2013년 4월 17일 비료 저장·유통 시설 대폭발 — 자원봉사 소방관 12명과 일반인 2명 사망, 수백 명 부상.'], ['Massive explosion at a fertilizer storage and distribution facility on 17 April 2013 — 12 volunteer firefighters and two members of the public died; hundreds injured.']),
    csb('caribbean-petroleum-corporation-capeco-refinery-tank-explosion-and-fire', 'CAPECO 저장탱크 폭발·화재(푸에르토리코)', 'Caribbean Petroleum Corporation (CAPECO) Refinery Tank Explosion and Fire', 'Bayamón, PR', '10/23/2009', '10/21/2015', 'oil logi', 'fire', '',
      ['2009년 10월 23일 대형 화재·폭발로 압력파가 주변 건물과 주행 차량에 피해.', 'CSB 권고: API 2350(석유 저장탱크 과충전 방지)을 개정해 기존·신규 지상 대형 저장탱크에 자동 과충전 방지 장치를 요구.'], ['Massive fire and explosion on 23 October 2009; the pressure wave damaged buildings and moving vehicles.', 'CSB recommendation: revise API 2350 to require automatic overfill prevention on existing and new bulk aboveground storage tanks.']),
    csb('horsehead-holding-company-fatal-explosion-and-fire', 'Horsehead 아연 재활용 시설 폭발·화재', 'Horsehead Holding Company Fatal Explosion and Fire', 'Monaca, PA', '07/22/2010', '03/11/2015', 'metal', 'fire', '',
      ['2010년 7월 22일 고온 증류로 아연을 재활용·정제하는 시설에서 폭발·화재 — 근로자 2명 사망.'], ['Explosion and fire on 22 July 2010 at a zinc recycling plant using high-temperature distillation — two workers died.']),
    csb('us-ink-fire', 'US Ink 잉크 공장 분진 폭발·화재', 'US Ink Fire', 'East Rutherford, NJ', '10/09/2012', '01/15/2015', 'chem', 'dust fire', '',
      ['2012년 10월 9일 폭발·화재 — 근로자 7명 부상.', 'CSB 권고: 가연성 분진을 다루는 제조 설비도 국제건축코드의 설계·운전 요건을 따르도록 주 건축 규정의 예외 조항 개정.'], ['Explosion and fire on 9 October 2012 — seven workers injured.', 'CSB recommendation: change the state construction code exemption so equipment handling combustible dust follows the International Building Code.']),
    csb('key-lessons-for-preventing-incidents-from-flammable-chemicals-in-educational-demonstrations', 'CSB 안전 회보 — 교육용 실험 시연의 인화성 물질 사고', 'Key Lessons for Preventing Incidents from Flammable Chemicals in Educational Demonstrations', 'Reno, NV', '10/30/2014', '10/30/2014', 'lab', 'fire chem', 'training',
      ['2014년 10월 30일 공개. 메탄올로 색 불꽃을 보여 주던 실험 시연에서 어린이가 다친 사고 3건 — 모두 메탄올 대용기로 불이 역화해 보호벽 없이 보던 관람자를 덮침.'], ['Released 30 October 2014. Three methanol flame-colour demonstrations that injured children — in each, the fire flashed back to the bulk methanol container and engulfed unprotected spectators.'], 'guide'),
    csb('al-solutions-fatal-dust-explosion', 'AL Solutions 티타늄 분진 폭발', 'AL Solutions Fatal Dust Explosion', 'New Cumberland, WV', '12/09/2010', '07/16/2014', 'metal', 'dust fire', '',
      ['2010년 12월 9일 티타늄 분말 가공 중 폭발 — 근로자 3명 사망.', 'CSB 권고: 가연성 분진·분말을 다루는 설비에 NFPA 484-2012(가연성 금속) 적용.'], ['Explosion during titanium powder processing on 9 December 2010 — three workers died.', 'CSB recommendation: apply NFPA 484-2012 (combustible metals) to equipment handling combustible dust or powder.']),
    csb('tesoro-anacortes-refinery-fatal-explosion-and-fire-', 'Tesoro Anacortes 정유공장 열교환기 파열·화재', 'Tesoro Anacortes Refinery Fatal Explosion and Fire', 'Anacortes, WA', '04/02/2010', '05/01/2014', 'oil', 'fire press', 'ptw',
      ['2010년 4월 2일 약 40년 된 열교환기가 공정 전환 정비 중 파열 — 근로자 7명 사망.', 'CSB 권고: API RP 941(고온 수소 환경용 강재) 개정.'], ['A nearly 40-year-old heat exchanger failed during a maintenance switch-over on 2 April 2010 — seven employees died.', 'CSB recommendation: revise API RP 941 on steels for hydrogen service at elevated temperatures.']),
    csb('ndk-crystal-inc-explosion-with-offsite-fatality-', 'NDK Crystal 고압 용기 폭발(공장 밖 사망)', 'NDK Crystal Inc. Explosion with Offsite Fatality', 'Belvidere, IL', '12/07/2009', '11/14/2013', 'mfg', 'press', '',
      ['2009년 12월 7일 석영 결정 제조 공장 폭발 — 파편이 약 300야드 날아가 공장 밖 일반인 1명 사망, 2명 경상.', 'CSB 권고: ASME 보일러·압력용기 코드에 특정 재료 관련 요건 추가.'], ['Explosion at a quartz crystal plant on 7 December 2009 — debris thrown about 300 yards killed a member of the public; two people had minor injuries.', 'CSB recommendation: revise the ASME Boiler and Pressure Vessel Code with specific material requirements.']),
    csb('carbide-industries-fire-explosion', 'Carbide Industries 전기아크로 화재·폭발', 'Carbide Industries Fire and Explosion', 'Louisville, KY', '03/21/2011', '02/07/2013', 'chem', 'fire', '',
      ['2011년 3월 21일 칼슘카바이드 공장 화재·폭발 — 근로자 2명 사망, 2명 부상.', 'CSB 권고: 전기아크로와 통제실 등의 설계·절차를 NFPA 기준에 맞게 변경.'], ['Fire and explosion at a calcium carbide plant on 21 March 2011 — two workers died and two were injured.', 'CSB recommendation: change the electric arc furnace and control room design and procedures to meet the NFPA standard.']),
    csb('goodyear-heat-exchanger-rupture', 'Goodyear 합성고무 공장 열교환기 파열', 'Goodyear Heat Exchanger Rupture', 'Houston, TX', '06/11/2008', '01/27/2011', 'chem', 'press chem', 'emer',
      ['2008년 6월 11일 열교환기 정비 중 암모니아 과압으로 파열 — 1명 사망, 약 7명 부상.', 'CSB 사례 연구: 비상훈련과 압력용기 규정 준수의 필요성.'], ['Ammonia overpressure ruptured a heat exchanger during maintenance on 11 June 2008 — one death, about seven injuries.', 'CSB case study cites the need for emergency drills and following pressure vessel codes.']),
    csb('xcel-energy-company-hydroelectric-tunnel-fire', 'Xcel Energy 수력발전소 터널 화재', 'Xcel Energy Company Hydroelectric Tunnel Fire', 'Georgetown, CO', '10/02/2007', '08/25/2010', 'energy', 'fire conf', 'ptw',
      ['2007년 10월 2일 지하 1,000피트 터널 안에서 인화성 용제로 에폭시 도장 중 화재 — 5명 사망(갇힘), 3명 부상.'], ['Fire on 2 October 2007 while workers coated a tunnel 1,000 feet underground with epoxy using highly flammable solvents — five trapped and killed, three injured.']),
    csb('veolia-environmental-services-flammable-vapor-explosion-and-fire', 'Veolia 폐용제 처리 시설 증기 폭발·화재', 'Veolia Environmental Services Flammable Vapor Explosion and Fire', 'West Carrollton, OH', '05/04/2009', '07/21/2010', 'waste', 'fire', 'psm',
      ['2009년 5월 4일 가연성 증기가 갑자기 대기로 퍼져 점화 — 근로자 2명 중상, 주택 20채 파손.', 'CSB 권고: 가연성 액체의 다양한 특성(무거운 증기 등)을 반영해 통제실 배치 지침 개정.'], ['Flammable vapours suddenly released on 4 May 2009 found an ignition source — two workers seriously injured, 20 homes damaged.', 'CSB recommendation: revise control room siting guidance to reflect the behaviour of Class IB flammable liquids (heavy vapour, congestion).']),
    csb('packaging-corporation-storage-tank-explosion', 'Packaging Corporation(Tomahawk) 저장탱크 폭발', 'Packaging Corporation Storage Tank Explosion', 'Tomahawk, WI', '07/29/2008', '03/04/2010', 'mfg', 'fire', 'ptw',
      ['2008년 7월 29일 골판지 공장의 높이 80피트 저장탱크 위 통로에서 용접(화기작업) 중 탱크 내부 폭발 — 3명 사망, 1명 부상.'], ['Explosion inside an 80-foot storage tank at a corrugated cardboard mill on 29 July 2008 while workers welded on a catwalk above — three deaths, one injury.']),
    csb('conagra-natural-gas-explosion-and-ammonia-release', 'ConAgra 식품공장 천연가스 폭발·암모니아 누출', 'ConAgra Natural Gas Explosion and Ammonia Release', 'Garner, NC', '06/09/2009', '02/04/2010', 'food', 'gas fire chem', 'ptw',
      ['2009년 6월 9일 식품공장 폭발 — 근로자 4명 사망, 수십 명 부상.', 'CSB 안전 회보: 가스 배관을 건물 안으로 퍼지(purge)하는 위험, NFPA 54(연료가스 코드) 개정 권고.'], ['Explosion at a food plant on 9 June 2009 — four workers died, dozens injured.', 'CSB safety bulletin on the dangers of purging gas piping into buildings; recommended changes to NFPA 54 (National Fuel Gas Code).']),
    csb('indspec-chemical-corporation-oleum-release', 'INDSPEC 발연황산(올레움) 누출', 'INDSPEC Chemical Corporation Oleum Release', 'Petrolia, PA', '10/11/2008', '09/30/2009', 'chem', 'chem', 'emer',
      ['2008년 10월 11일 이송 중 올레움 탱크가 넘쳐 황산 미스트 구름이 건물과 지역사회로 확산 — 주민 약 2,500명 대피.'], ['An oleum tank overflowed during transfer on 11 October 2008, sending a sulfuric acid mist cloud through the site and community — about 2,500 residents evacuated.']),
    csb('t2-laboratories-inc-reactive-chemical-explosion', 'T2 Laboratories 반응 폭주 폭발', 'T2 Laboratories Inc. Reactive Chemical Explosion', 'Jacksonville, FL', '12/19/2007', '09/15/2009', 'chem', 'reactive fire', 'psm',
      ['2007년 12월 19일 휘발유 첨가제(methylcyclopentadienyl manganese tricarbonyl) 생산 중 폭발 — 4명 사망, 13명 병원 이송.', 'CSB 권고 대상에 미국 공학교육인증원(ABET)이 포함됨.'], ['Explosion during production of a gasoline additive (methylcyclopentadienyl manganese tricarbonyl) on 19 December 2007 — four deaths, 13 taken to hospital.', 'Recommendation recipients included ABET, the engineering accreditation body.']),
    csb('allied-terminals-fertilizer-tank-collapse', 'Allied Terminals 액체비료 탱크 붕괴', 'Allied Terminals Fertilizer Tank Collapse', 'Chesapeake, VA', '11/11/2008', '05/26/2009', 'logi', 'collapse chem', 'contract',
      ['2008년 11월 액체비료 200만 갤런 저장탱크 붕괴 — 협력업체 근로자 2명 위중, 도우려던 일반인 2명은 비료의 암모니아 증기 노출로 치료. 비료가 방류벽을 넘어 범람.'], ['A two-million-gallon liquid fertilizer tank collapsed in November 2008 — two contract workers critically injured; two members of the public who helped were treated, likely for ammonia vapour; the fertilizer overtopped the dike.']),
    csb('little-general-store-propane-explosion', 'Little General 편의점 프로판 폭발', 'Little General Store Propane Explosion', 'Ghent, WV', '01/30/2007', '09/25/2008', 'pub', 'gas fire', 'emer',
      ['2007년 1월 30일 편의점·주유소의 프로판 저장탱크에서 나온 증기가 점화·폭발 — 4명 사망, 5명 중상, 건물 완파.', 'CSB 권고: 911 상황실이 프로판 비상 정보를 수집하도록 돕는 안내 카드 개발.'], ['Propane vapour from a storage tank ignited and exploded at a convenience store and petrol station on 30 January 2007 — four deaths, five seriously injured; the building was destroyed.', 'CSB recommendation: develop a propane emergency guide card for 911 call-takers.']),
    csb('barton-solvents-flammable-liquid-explosion-and-fire', 'Barton Solvents 화학물질 유통 시설 정전기 화재·폭발', 'Barton Solvents Flammable Liquid Explosion and Fire', 'Des Moines, IA', '10/29/2007', '09/18/2008', 'logi chem', 'fire', '',
      ['2007년 10월 29일 300갤런 이동식 강철 탱크에 아세트산에틸을 채우던 포장 구역에서 화재·연쇄 폭발 — CSB는 정전기 불꽃이 원인이라고 발표.'], ['Fire and explosions on 29 October 2007 began in the packaging area while a 300-gallon portable steel tank was being filled with ethyl acetate — CSB found a static spark set it off.']),
    csb('valero-mckee-refinery-propane-fire', 'Valero McKee 정유공장 프로판 화재', 'Valero McKee Refinery Propane Fire', 'Sunray, TX', '02/16/2007', '07/09/2008', 'oil', 'fire', '',
      ['2007년 2월 16일 프로판 탈아스팔트 설비 누출로 화재 — 3명 중증 화상, 정유공장 가동 중단. 내화 처리되지 않은 배관 지지대 기둥이 빨리 무너지며 불이 번짐.'], ['Leak in the propane deasphalting unit started a fire on 16 February 2007 — three workers seriously burned, refinery shut down; the fire spread as non-fireproofed pipe rack columns collapsed.'])
  ];
})();

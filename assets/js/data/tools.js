/* 2단계 판정·작성 도구 데이터 (2026-09-24 원문 확인)
   - 폭발하한계·Tci·질소등가계수: KOSHA GUIDE P-179-2022 부록1·2 (src: koshaP179). IPA·PGME는 NIOSH NPG (src: nioshNpg)
   - AEGL-2(60분): 미국 EPA 물질별 페이지 (src: epaAegl). i = Interim(잠정)
   - 비상 이격거리: ERG 2024 표1·표3, 가이드 116·122 (src: erg2024)
   - 할당보호계수: 미국 OSHA 29 CFR 1910.134 Table 1 (src: oshaResp)
   - 방독·방진마스크: 보호구 안전인증 고시 별표4·5 (src: moelPpe)
   - 전체환기 물성: NIOSH NPG 분자량·비중 (src: nioshNpg), 산식은 안전보건규칙 제430조 (src: lawStd) */
window.SHE = window.SHE || {};
(function () {
  const B = (ko, en) => ({ ko, en });

  /* 물질 DB(SHE.CHEMICALS)에 없는 가스 — 이름만 */
  SHE.GAS_EXTRA = {
    h2: B('수소', 'Hydrogen'), ch4: B('메탄', 'Methane'), dcs: B('디클로로실란', 'Dichlorosilane'), mcs: B('모노클로로실란', 'Monochlorosilane'),
    ms: B('메틸실란', 'Methylsilane'), tms: B('트리메틸실란', 'Trimethylsilane'), h2se: B('셀렌화수소', 'Hydrogen selenide'),
    no: B('일산화질소', 'Nitric oxide'), bcl3: B('삼염화붕소', 'Boron trichloride'), sif4: B('사불화규소', 'Silicon tetrafluoride'),
    wf6: B('육불화텅스텐', 'Tungsten hexafluoride'), sf4: B('사불화황', 'Sulfur tetrafluoride'),
    n2: B('질소', 'Nitrogen'), ar: B('아르곤', 'Argon'), he: B('헬륨', 'Helium'), ne: B('네온', 'Neon'), kr: B('크립톤', 'Krypton'), xe: B('제논', 'Xenon'),
    cf4: B('사불화탄소', 'Tetrafluoromethane'), c2f6: B('육불화에탄', 'Hexafluoroethane')
  };
  SHE.gasName = (id) => { const c = (SHE.CHEMICALS || []).find((x) => x.id === id); return c || SHE.GAS_EXTRA[id] || B(id, id); };

  /* 인화성 가스·증기 — tci: 질소와 섞였을 때 공기 중에서 인화성이 없어지는 최대 함유량(mol%), lel: 폭발하한계(vol%)
     est: P-179가 ‘estimated’로 표시한 값, src: 값의 출처 */
  SHE.FLAM = {
    sih4: { tci: 1, lel: 1.0, est: true }, ph3: { tci: 1.7, lel: 1.6 }, ash3: { tci: 3.9, lel: 3.9 }, b2h6: { tci: 0.9, lel: 0.9 },
    geh4: { tci: 1, lel: 1.0, est: true }, dcs: { tci: 2.5, lel: 2.5 }, mcs: { tci: 1, lel: 1.0, est: true }, ms: { tci: 1.3, lel: 1.3 }, tms: { tci: 1.3, lel: 1.3 },
    h2: { tci: 5.5, lel: 4 }, h2se: { tci: 4, lel: 4 }, nh3: { tci: 40.1, lel: 15.4 }, h2s: { tci: 8.9, lel: 3.9 }, co: { tci: 15.2, lel: 10.9 },
    ch4: { tci: 8.7, lel: 4.4 }, hcn: { tci: 5.4, lel: 5.4 }, acetone: { tci: 4, lel: 2.5 },
    ipa: { tci: null, lel: 2.0, src: 'nioshNpg' }, pgme: { tci: null, lel: 1.6, src: 'nioshNpg', calc: true }
  };
  /* 불활성 가스 질소등가계수 Ki — P-179 부록1 (화학식의 원자가 3개 이상인 그 밖의 물질은 1.5) */
  SHE.INERT_K = { n2: 1, ar: 0.55, he: 0.9, ne: 0.7, kr: 0.5, xe: 0.5, co2: 1.5, sf6: 4, cf4: 2, c2f6: 1.5, hcl: 1.5, hf: 1.5, hbr: 1.5, bcl3: 1.5, bf3: 1.5, sif4: 1.5, wf6: 1.5 };

  /* AEGL-2 (60분) — [값, 단위, 잠정 여부] */
  SHE.AEGL2 = {
    nh3: [160, 'ppm'], ash3: [0.17, 'ppm'], bf3: [29, 'mg/m³'], co: [83, 'ppm'], cl2: [2.0, 'ppm'], b2h6: [1.0, 'ppm'], f2: [5.0, 'ppm'],
    geh4: [0.17, 'ppm', 1], hbr: [40, 'ppm'], hcl: [22, 'ppm'], hcn: [7.1, 'ppm'], hf: [24, 'ppm'], h2s: [27, 'ppm'], hno3: [24, 'ppm'],
    no2: [12, 'ppm'], nf3: [530, 'ppm', 1], ph3: [2.0, 'ppm'], sbh3: [1.5, 'ppm', 1], sih4: [130, 'ppm', 1], h2so4: [8.7, 'mg/m³', 1]
  };

  /* 비상 이격거리 — ERG 2024 표1. s/l = 소량/대량 누출 [초기 이격(m), 주간 방호(km), 야간 방호(km)]
     t3: 표3 ‘소형 실린더 여러 개 또는 톤 실린더 1개’ 대량 누출 [이격(m), 주간 저·중·고풍(km), 야간 저·중·고풍(km)]
     plus: 11.0+ km(기상 조건에 따라 더 멀 수 있음) */
  SHE.ERG = [
    { id: 'ash3', un: '2188', g: '119', s: [150, 1.0, 3.9], l: [1000, 6.2, 10.5] },
    { id: 'ph3', un: '2199', g: '119', s: [60, 0.3, 1.1], l: [400, 1.3, 3.7] },
    { id: 'b2h6', un: '1911', g: '119', s: [60, 0.3, 1.2], l: [300, 1.6, 4.6] },
    { id: 'geh4', un: '2192', g: '119', s: [150, 0.9, 3.3], l: [600, 3.6, 7.4] },
    { id: 'sbh3', un: '2676', g: '119', s: [60, 0.3, 1.6], l: [200, 1.3, 4.1] },
    { id: 'h2se', un: '2202', g: '117', s: [300, 1.7, 6.0], l: [1000, 11.0, 11.0], plus: true },
    { id: 'dcs', un: '2189', g: '119', s: [30, 0.1, 0.4], l: [300, 1.4, 3.1] },
    { id: 'cl2', un: '1017', g: '124', s: [60, 0.3, 1.5], t3: [150, [1.3, 0.7, 0.5], [2.4, 1.2, 0.6]] },
    { id: 'hf', un: '1052', g: '125', s: [30, 0.1, 0.5], t3: [100, [0.8, 0.4, 0.3], [1.7, 0.5, 0.3]] },
    { id: 'hcl', un: '1050', g: '125', s: [30, 0.1, 0.3], t3: [30, [0.3, 0.2, 0.1], [0.9, 0.3, 0.2]] },
    { id: 'nh3', un: '1005', g: '125', s: [30, 0.1, 0.2], t3: [30, [0.3, 0.2, 0.1], [0.7, 0.3, 0.2]] },
    { id: 'hbr', un: '1048', g: '125', s: [30, 0.1, 0.2], l: [150, 1.0, 3.2] },
    { id: 'f2', un: '1045', g: '124', s: [30, 0.1, 0.2], l: [100, 0.5, 2.3] },
    { id: 'clf3', un: '1749', g: '124', s: [30, 0.2, 1.1], l: [300, 1.4, 3.7] },
    { id: 'bf3', un: '1008', g: '125', s: [30, 0.2, 0.7], l: [400, 2.4, 4.7] },
    { id: 'bcl3', un: '1741', g: '125', s: [30, 0.1, 0.3], l: [100, 0.6, 1.3], note: B('땅에 누출 시. 물에 누출되면 대량 100m·0.9km·2.8km', 'Spilled on land. In water, large spill 100 m / 0.9 km / 2.8 km') },
    { id: 'wf6', un: '2196', g: '125', s: [30, 0.2, 0.8], l: [150, 0.8, 2.8] },
    { id: 'sif4', un: '1859', g: '125', s: [30, 0.2, 0.8], l: [100, 0.5, 1.8] },
    { id: 'sf4', un: '2418', g: '125', s: [100, 0.5, 2.4], l: [400, 2.4, 5.9] },
    { id: 'no', un: '1660', g: '124', s: [30, 0.1, 0.6], l: [100, 0.6, 2.2] },
    { id: 'h2s', un: '1053', g: '117', s: [30, 0.1, 0.5], l: [400, 2.4, 6.3] },
    { id: 'co', un: '1016', g: '119', s: [30, 0.1, 0.2], l: [200, 1.2, 3.9] },
    { id: 'hcn', un: '1051', g: '117P', s: [60, 0.2, 0.7], l: [200, 0.7, 1.8] }
  ];
  /* 표1에 없는 가스 — 해당 가이드의 EVACUATION 항목 [즉시 이격(m), 대량 누출 풍하 대피(m), 화재 시 이격·대피(m)] */
  SHE.ERG_GUIDE = [
    { id: 'sih4', un: '2203', g: '116', ev: [100, 800, 1600] },
    { id: 'nf3', un: '2451', g: '122', ev: [100, 500, 800] }
  ];

  /* 호흡보호구 할당보호계수 — OSHA 1910.134 Table 1. sup: 송기식(공기 공급) 여부, full: 전면형 여부 */
  SHE.APF = [
    { id: 'aprH', apf: 10, t: B('공기정화식 반면형 (방진·방독 반면형, 안면부여과식 포함)', 'Air-purifying half mask (incl. filtering facepiece)') },
    { id: 'aprF', apf: 50, full: true, t: B('공기정화식 전면형 (방진·방독 전면형)', 'Air-purifying full facepiece') },
    { id: 'paprL', apf: 25, t: B('전동식 호흡보호구 — 느슨한 안면부·후드·보안면', 'PAPR — loose-fitting facepiece, hood or helmet') },
    { id: 'paprH', apf: 50, t: B('전동식 호흡보호구 — 반면형', 'PAPR — half mask') },
    { id: 'paprF', apf: 1000, full: true, t: B('전동식 호흡보호구 — 전면형', 'PAPR — full facepiece') },
    { id: 'sarDH', apf: 10, sup: true, t: B('송기마스크 디맨드형 — 반면형', 'Supplied-air, demand — half mask') },
    { id: 'sarDF', apf: 50, sup: true, full: true, t: B('송기마스크 디맨드형 — 전면형', 'Supplied-air, demand — full facepiece') },
    { id: 'sarCL', apf: 25, sup: true, t: B('송기마스크 연속흐름형 — 느슨한 안면부·후드', 'Supplied-air, continuous flow — loose-fitting or hood') },
    { id: 'sarCH', apf: 50, sup: true, t: B('송기마스크 연속흐름형·압력디맨드형 — 반면형', 'Supplied-air, continuous flow or pressure-demand — half mask') },
    { id: 'sarPF', apf: 1000, sup: true, full: true, t: B('송기마스크 연속흐름형·압력디맨드형 — 전면형', 'Supplied-air, continuous flow or pressure-demand — full facepiece') },
    { id: 'scbaD', apf: 50, sup: true, full: true, t: B('공기호흡기(SCBA) 디맨드형 — 전면형', 'SCBA, demand — full facepiece') },
    { id: 'scbaP', apf: 10000, sup: true, full: true, t: B('공기호흡기(SCBA) 압력디맨드(양압)형 — 전면형', 'SCBA, pressure-demand — full facepiece') }
  ];

  /* 방독마스크 정화통 — 보호구 안전인증 고시 별표5 표1·표5 */
  SHE.CANISTER = {
    org: { t: B('유기화합물용', 'Organic vapour'), color: B('갈색', 'Brown'), test: B('시클로헥산·디메틸에테르·이소부탄', 'cyclohexane, dimethyl ether, isobutane') },
    hal: { t: B('할로겐용', 'Halogen'), color: B('회색', 'Grey'), test: B('염소', 'chlorine') },
    h2s: { t: B('황화수소용', 'Hydrogen sulfide'), color: B('회색', 'Grey'), test: B('황화수소', 'hydrogen sulfide') },
    hcn: { t: B('시안화수소용', 'Hydrogen cyanide'), color: B('회색', 'Grey'), test: B('시안화수소', 'hydrogen cyanide') },
    so2: { t: B('아황산용', 'Sulfur dioxide'), color: B('노랑색', 'Yellow'), test: B('아황산가스', 'sulfur dioxide') },
    nh3: { t: B('암모니아용', 'Ammonia'), color: B('녹색', 'Green'), test: B('암모니아', 'ammonia') }
  };
  /* 방독마스크 등급 — 별표5 표2: 사용 가능한 최대 농도(%) [일반, 암모니아] */
  SHE.GASMASK_GRADE = [
    { id: 'high', t: B('고농도', 'High concentration'), max: [2, 3], full: true },
    { id: 'mid', t: B('중농도', 'Medium concentration'), max: [1, 1.5], full: true },
    { id: 'low', t: B('저농도·최저농도', 'Low / lowest concentration'), max: [0.1, 0.1], note: B('긴급용이 아닌 것', 'not for emergencies') }
  ];
  /* 방진마스크 등급 — 별표4 표1 */
  SHE.DUSTMASK = [
    { id: 'special', t: B('특급', 'Special class'), where: B('베릴륨 등과 같이 독성이 강한 물질을 함유한 분진 등 발생장소, 석면 취급장소', 'Dust from highly toxic substances such as beryllium; asbestos work') },
    { id: 'first', t: B('1급', 'Class 1'), where: B('특급 착용장소를 제외한 분진 등 발생장소, 금속흄 등 열적으로 생기는 분진 발생장소, 기계적으로 생기는 분진 발생장소(규소 등 2급으로도 무방한 경우 제외)', 'Other dust sources, thermally generated dust such as metal fume, mechanically generated dust (except where class 2 is enough, e.g. silicon)') },
    { id: 'second', t: B('2급', 'Class 2'), where: B('특급·1급 착용장소를 제외한 분진 등 발생장소', 'All other dust sources') }
  ];
  /* 물질 → 정화통 종류 (포털 분류: 고시 별표5의 6종과 시험가스에 비춰 명확히 대응하는 것만).
     aerosol: mg/m³ 기준 미스트·분진 → 방진 필터, none: 고시 6종에 대응 종류 없음 */
  SHE.RESP_MAP = {
    ipa: 'org', acetone: 'org', pgme: 'org', teos: 'org', nh3: 'nh3', h2s: 'h2s', hcn: 'hcn', cl2: 'hal',
    h2so4: 'aerosol', h3po4: 'aerosol', naoh: 'aerosol', koh: 'aerosol', tmah: 'aerosol', as: 'aerosol'
  };

  /* 전체환기 필요환기량 — 안전보건규칙 제430조 산식, 물성은 NIOSH NPG. annex12: 별표12 관리대상 유기화합물 여부 */
  SHE.VENT = {
    ipa: { mw: 60.1, sg: 0.79, annex12: true },
    acetone: { mw: 58.1, sg: 0.79, annex12: true },
    pgme: { mw: 90.1, sg: 0.96, annex12: false },
    teos: { mw: 208.3, sg: 0.93, annex12: false }
  };
  SHE.VENT_K = [[1, B('공기 혼합이 원활한 경우', 'Good mixing')], [2, B('공기 혼합이 보통인 경우', 'Average mixing')], [3, B('공기 혼합이 불완전한 경우', 'Poor mixing')]];

  /* 작업환경측정 주기 단축 대상 — 고시 제5조: 허가대상유해물질(영 제88조), 특별관리물질(안전보건규칙 별표12) */
  SHE.WEM_SPECIAL = {
    as: { t: B('허가대상 유해물질 — 비소 및 그 무기화합물 (영 제88조 제6호)', 'Licensed substance — arsenic and its inorganic compounds (Decree Art. 88(6))'), always: true },
    h2so4: { t: B('특별관리물질 — pH 2.0 이하인 강산인 황산 (별표12)', 'Specially controlled — sulfuric acid as a strong acid at pH 2.0 or below (Annex 12)'), ph: true },
    hg: { t: B('특별관리물질 — 수은 및 그 화합물(아릴·알킬 화합물 제외) (별표12)', 'Specially controlled — mercury and its compounds, except aryl and alkyl compounds (Annex 12)'), always: true },
    egeea: { t: B('특별관리물질 — 2-에톡시에틸 아세테이트 (별표12)', 'Specially controlled — 2-ethoxyethyl acetate (Annex 12)'), always: true }
  };
  /* 특수건강진단 기본 주기(개월) — 시행규칙 별표23. 물질 DB의 가스·약액은 모두 제6호(12개월) */
  SHE.SHE_CYCLE = [
    { id: 'g6', t: B('별표23 제6호 — 그 밖의 대상 유해인자 (물질 DB 전부)', 'Annex 23 item 6 — all other agents (everything in the substance DB)'), m: 12 },
    { id: 'g1', t: B('제1~3호 — 디메틸포름아미드·벤젠·염화비닐 등', 'Items 1–3 — DMF, benzene, vinyl chloride and others'), m: 6 },
    { id: 'g5', t: B('제5호 — 소음·충격소음, 광물성·목재 분진', 'Item 5 — noise, impulse noise, mineral and wood dust'), m: 24 },
    { id: 'g4', t: B('제4호 — 석면·면분진', 'Item 4 — asbestos, cotton dust'), m: 12 }
  ];

  /* 교육 과정 — 시행규칙 별표4(2025.5.30 개정) 제1호·제1호의2, 화학물질관리법 시행규칙 제37조·별표6의3 */
  SHE.TRN_KINDS = [
    ['office', B('사무직 종사 근로자', 'Office worker')],
    ['field', B('생산·설비 등 그 밖의 근로자', 'Production, facilities and other workers')],
    ['sup', B('관리감독자', 'Supervisor')],
    ['day', B('일용·계약기간 1주일 이하 기간제', 'Day labourer / fixed-term ≤ 1 week')],
    ['month', B('계약기간 1주일 초과 1개월 이하 기간제', 'Fixed-term > 1 week and ≤ 1 month')]
  ];
  SHE.TRN_COURSES = [
    ['periodic', B('정기교육', 'Periodic')],
    ['hire', B('채용 시 교육', 'On hiring')],
    ['change', B('작업내용 변경 시 교육', 'Change of work')],
    ['special', B('특별교육', 'Special training')],
    ['cca', B('유해화학물질 안전교육 (화관법)', 'Hazardous-chemical safety training (Chemicals Act)')],
    ['other', B('그 밖의 교육', 'Other training')]
  ];
})();

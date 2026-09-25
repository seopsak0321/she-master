/* SOP 라이브러리 — 교육·포트폴리오용 표준 절차 예시.
   SK하이닉스 사내 SOP가 아니다. 각 단계의 근거(b)는
   'law:조문'(원문 확인한 법령) | 'guide'(KOSHA·OSHA 등 공개 지침의 일반 원칙) | 'gp'(업계 일반 관행) 로 표시한다. */
window.SHE = window.SHE || {};

SHE.PERMITS = {
  hot:       { ko: '화기작업', en: 'Hot work' },
  confined:  { ko: '밀폐공간', en: 'Confined space' },
  electrical:{ ko: '정전·에너지 차단', en: 'Electrical / energy isolation' },
  height:    { ko: '고소작업', en: 'Work at height' },
  lifting:   { ko: '중량물·양중', en: 'Heavy lifting' },
  linebreak: { ko: '배관 개방', en: 'Line breaking' },
  chemical:  { ko: '화학물질 취급', en: 'Chemical handling' },
  gas:       { ko: '특수가스', en: 'Specialty gas' },
  radiation: { ko: '방사선(X선)', en: 'Radiation (X-ray)' },
  excavation:{ ko: '굴착', en: 'Excavation' }
};

/* KOSHA GUIDE(기술지원규정) — 2026-09-24 KOSHA 산업안전포털 기술지원규정 목록(현행 1,039건)과 대조. 2026.1.30 정비(제정 11·개정 164·폐지 262)로
   번호가 바뀐 지침은 현행 번호로 적고 old에 구 번호를 둔다. rel: succ(같은 지침의 새 번호) | merge(통폐합) | topic(구 지침 폐지 — 같은 주제의 현행 지침)
   f·s: 포털 원문 PDF 파일 번호(https://portal.kosha.or.kr/openapi/v1/file/down/<f>/<s>), d: 공표일. 표지 번호·제목은 PDF로 확인 (src: koshaGuide, moelKosha2026) */
SHE.KOSHA = {
  /* 현행 — 번호 변경 없음 */
  'P-12-2012':  { ko: '전자산업에서의 특수가스 취급안전 기술지침', en: 'Safe handling of specialty gases in the electronics industry', f: 'FL00015884118', s: 3, d: '2012-07-18' },
  'P-16-2012':  { ko: '반도체 제조설비의 화재 방지 및 방호 기술지침', en: 'Fire prevention and protection for semiconductor manufacturing equipment', f: 'FL00015884161', s: 3, d: '2012-07-18' },
  'P-122-2012': { ko: '반도체 공정에서 가스를 취급하는 벌크시스템의 안전에 관한 기술지침', en: 'Safety of bulk gas systems in semiconductor processes', f: 'FL00015884121', s: 3, d: '2012-11-29' },
  'P-139-2013': { ko: '가스용기의 비상조치방법에 관한 기술지침', en: 'Emergency measures for gas cylinders', f: 'FL00015884138', s: 3, d: '2013-11-25' },
  'P-167-2020': { ko: '화학물질의 취급 및 시료채취 등에 관한 기술지침', en: 'Handling and sampling of chemicals', f: 'FL00015988163', s: 2, d: '2020-12-29' },
  'P-179-2022': { ko: '혼합가스의 폭발성 여부 판정 및 폭발하한계 산정에 관한 기술지침', en: 'Flammability of gas mixtures and their lower explosive limit', f: 'FL00020124089', s: 2, d: '2022-12-31' },
  'H-171-2023': { ko: '수산화테트라메틸암모늄(TMAH) 취급 전자산업 근로자의 보건관리지침', en: 'Health management for electronics workers handling TMAH', f: 'FL00020455156', s: 4, d: '2023-08-24' },
  'X-68-2015':  { ko: '밀폐공간 위험관리에 관한 기술지침', en: 'Confined-space risk management', f: 'FL00015884363', s: 3, d: '2015-12-07' },
  'C-74-2015':  { ko: '건설공사의 고소작업대 안전보건작업지침', en: 'Aerial work platforms in construction', f: 'FL00015883319', s: 3, d: '2015-06-18' },
  'X-44-2016':  { ko: '고소작업대 작업의 리스크 확인지침', en: 'Risk checks for aerial work platforms', f: 'FL00015884337', s: 3, d: '2016-08-30' },
  'H-62-2021':  { ko: '전리방사선 노출 근로자 건강관리지침', en: 'Health management for workers exposed to ionising radiation', f: 'FL00015883870', s: 6, d: '2021-10-01' },
  'H-155-2019': { ko: '비파괴 작업근로자의 방사선 노출 관리지침', en: 'Managing radiation exposure of non-destructive testing workers', f: 'FL00015883763', s: 3, d: '2019-10-01' },
  /* 2025.3.26·2026.1.30 정비로 새 번호 */
  'C-C-65-2026': { ko: '반도체 제조공정의 안전작업에 관한 기술지원규정', en: 'Safe work in semiconductor manufacturing processes', old: 'P-127-2012', rel: 'succ', f: 'CTC2026012916185883611316', s: 1, d: '2026-01-30' },
  'C-C-87-2026': { ko: '가스누출감지경보기 설치 및 유지보수에 관한 기술지원규정', en: 'Installing and maintaining gas-leak detectors and alarms', old: 'P-166-2020', rel: 'succ', f: 'CTC2026012916323595581595', s: 1, d: '2026-01-30' },
  'C-C-49-2026': { ko: '안전작업허가에 관한 기술지원규정', en: 'Safe work permits', old: 'P-94-2021', rel: 'succ', f: 'CTC2026012916110491082899', s: 2, d: '2026-01-30' },
  'E-G-18-2026': { ko: '밀폐공간 작업 프로그램 수립 및 시행에 관한 기술지원규정', en: 'Establishing and running a confined-space programme', old: 'H-80-2021', rel: 'succ', f: 'CTC2026012914540778798257', s: 1, d: '2026-01-30' },
  'A-G-14-2026': { ko: '용접·용단 작업 시 화재예방에 관한 기술지원규정', en: 'Fire prevention during welding and cutting', old: 'F-1-2023', rel: 'merge', f: 'CTC2026012909355295338479', s: 1, d: '2026-01-30' },
  'A-G-11-2025': { ko: '용접방화포 등의 성능 및 설치기준에 관한 기술지원규정', en: 'Performance and installation of welding fire blankets', old: ['F-4-2025', 'F-4-2021'], rel: 'succ', f: 'FL00021380051', s: 3, d: '2025-03-26' },
  'B-M-25-2026': { ko: '에너지 차단장치의 잠금·표지에 관한 기술지원규정', en: 'Lockout/tagout of energy-isolating devices', old: 'E-91-2016', rel: 'succ', f: 'CTC2026012911192551670615', s: 2, d: '2026-01-30' },
  'A-G-4-2025':  { ko: '이동식 사다리의 사용에 관한 기술지원규정', en: 'Use of portable ladders', old: ['G-130-2025', 'G-130-2020'], rel: 'succ', f: 'FL00021379904', s: 2, d: '2025-03-26' },
  'B-M-7-2025':  { ko: '양중기 일반 안전에 관한 기술지원규정', en: 'General safety of lifting equipment', old: 'M-79-2011', rel: 'merge', f: 'CTC2026012910450950727868', s: 1, d: '2026-01-30' },
  'C-C-36-2026': { ko: '위험성평가에서의 체크리스트(Checklist) 기법에 관한 기술지원규정', en: 'Checklist technique in risk assessment', old: 'P-81-2023', rel: 'succ', f: 'CTC2026012916050020586865', s: 1, d: '2026-01-30' },
  'C-C-37-2026': { ko: '연속공정의 위험과 운전분석(HAZOP) 기법에 관한 기술지원규정', en: 'HAZOP for continuous processes', old: 'P-82-2023', rel: 'succ', f: 'CTC2026013015285726898044', s: 1, d: '2026-01-30' },
  'C-C-38-2026': { ko: '사고예상 질문분석(WHAT-IF) 기법에 관한 기술지원규정', en: 'What-if analysis', old: 'P-83-2021', rel: 'succ', f: 'CTC2026013015301192320093', s: 1, d: '2026-01-30' },
  'C-C-40-2026': { ko: '이상위험도 분석기법에 관한 기술지원규정', en: 'Failure mode, effects and criticality analysis', old: 'P-85-2021', rel: 'succ', f: 'CTC2026012916060387180913', s: 1, d: '2026-01-30' },
  'C-C-62-2026': { ko: '방호계층분석(LOPA) 기법에 관한 기술지원규정', en: 'Layers of protection analysis (LOPA)', old: 'P-113-2023', rel: 'succ', f: 'CTC2026012916173653615148', s: 1, d: '2026-01-30' },
  'C-C-55-2026': { ko: '비상조치계획 수립에 관한 기술지원규정', en: 'Preparing an emergency response plan', old: 'P-101-2023', rel: 'succ', f: 'CTC2026012916142255516525', s: 1, d: '2026-01-30' },
  'C-C-52-2026': { ko: '가동전 안전점검에 관한 기술지원규정', en: 'Pre-startup safety review', old: 'P-97-2023', rel: 'succ', f: 'CTC2026012916125852275078', s: 1, d: '2026-01-30' },
  'C-C-53-2026': { ko: '변경요소관리에 관한 기술지원규정', en: 'Management of change', old: 'P-98-2017', rel: 'succ', f: 'CTC2026012916132790869610', s: 1, d: '2026-01-30' },
  'C-C-67-2026': { ko: '작업위험성평가에 관한 기술지원규정', en: 'Job risk assessment', old: 'P-140-2020', rel: 'succ', f: 'CTC2026012916194591033768', s: 2, d: '2026-01-30' },
  'E-G-19-2026': { ko: '호흡보호구의 선정·사용 및 관리에 관한 기술지원규정', en: 'Selecting, using and managing respirators', old: 'H-82-2020', rel: 'succ', f: 'CTC2026012914545778028675', s: 1, d: '2026-01-30' },
  'A-G-12-2026': { ko: '개인보호구의 사용 및 관리에 관한 기술지원규정', en: 'Use and management of personal protective equipment', old: 'G-12-2013', rel: 'succ', f: 'CTC2026012909222643246624', s: 1, d: '2026-01-30' },
  'B-E-10-2026': { ko: '정전전로 및 그 인근에서의 전기작업에 관한 기술지원규정', en: 'Electrical work on and near de-energised circuits', old: ['E-86-2011', 'E-59-2012'], rel: 'topic', f: 'CTC2026012913263450093332', s: 1, d: '2026-01-30' },
  'D-C-10-2026': { ko: '건설장비(이동식크레인, 항타기 및 항발기, 타워크레인) 작업계획서 작성에 관한 기술지원규정', en: 'Work plans for construction equipment (mobile and tower cranes, pile drivers)', old: 'C-102-2023', rel: 'topic', f: 'CTC2026012914313984348485', s: 1, d: '2026-01-30' },
  /* 3단계 신규 SOP 근거 */
  'B-M-34-2026': { ko: '크레인 안전작업에 관한 기술지원규정', en: 'Safe crane work', f: 'CTC2026012913080347832828', s: 1, d: '2026-01-30' },
  'B-M-12-2025': { ko: '크레인 달기기구 및 줄걸이 작업용 와이어로프의 작업에 관한 기술지원규정', en: 'Crane lifting gear and wire-rope slinging', f: 'FL00021380385', s: 2, d: '2025-03-26' },
  'B-E-11-2026': { ko: '충전전로 및 그 인근에서의 전기작업에 관한 기술지원규정', en: 'Electrical work on and near live circuits', f: 'CTC2026012913300640598489', s: 1, d: '2026-01-30' },
  'B-E-12-2026': { ko: '전기작업안전에 관한 기술지원규정', en: 'Electrical work safety', f: 'CTC2026012913315457127282', s: 1, d: '2026-01-30' },
  'B-M-11-2025': { ko: '지게차의 안전작업에 관한 기술지원규정', en: 'Safe forklift work', f: 'FL00021380370', s: 3, d: '2025-03-26' },
  'C-C-16-2026': { ko: '세안설비 등의 성능 및 설치에 관한 기술지원규정', en: 'Performance and installation of eyewash stations and safety showers', f: 'CTC2026012915515810755562', s: 2, d: '2026-01-30' },
  'D-C-11-2026': { ko: '굴착 및 토공 안전작업에 관한 기술지원규정', en: 'Safe excavation and earthworks', f: 'CTC2026012914341697414755', s: 1, d: '2026-01-30' }
};
/* 구 번호 → 현행 번호 (예전 번호로 적힌 데이터도 현행 지침으로 연결) */
SHE.KOSHA_OLD = {};
Object.keys(SHE.KOSHA).forEach((k) => [].concat(SHE.KOSHA[k].old || []).forEach((o) => { SHE.KOSHA_OLD[o] = k; }));

const B = (ko, en) => ({ ko, en });

SHE.SOPS = [
  {
    id: 'confined', level: 'A', edu: [34], permits: ['confined'], chems: ['co', 'h2s', 'co2'],
    t: B('밀폐공간 작업', 'Confined-space entry'),
    area: B('피트·탱크·덕트·설비 내부 등 안전보건규칙 별표18 해당 장소', 'Pits, tanks, ducts and equipment interiors listed in Annex 18 of the OSH Standards Rules'),
    hz: B(['산소결핍 (질소 등 불활성가스 퍼지·유입)', '유해가스 (일산화탄소·황화수소·공정가스 잔류)', '인화성 가스에 의한 화재·폭발', '구조자 2차 질식'], ['Oxygen deficiency (nitrogen purge or inflow)', 'Toxic gases (CO, H₂S, residual process gas)', 'Fire or explosion from flammable gas', 'Rescuers overcome in turn']),
    legal: [B('안전보건규칙 제618조 — 적정공기: 산소 18% 이상 23.5% 미만, CO₂ 1.5% 미만, CO 30ppm 미만, H₂S 10ppm 미만', 'OSH Standards Rules Art. 618 — acceptable air: O₂ ≥ 18 % and < 23.5 %, CO₂ < 1.5 %, CO < 30 ppm, H₂S < 10 ppm'),
            B('제619조 — 작업 전 확인 6항목, 작업 종료 시까지 출입구 게시', 'Art. 619 — six pre-entry checks, posted at the entrance until the job ends'),
            B('제619조의2 — 작업 시작·재시작 전 측정·평가, 기록 3년 보존', 'Art. 619-2 — test before start and every restart; keep records 3 years'),
            B('제620조 — 작업 전·중 환기, 환기 곤란 시 공기호흡기·송기마스크', 'Art. 620 — ventilate before and during work; if impossible, SCBA or airline respirator'),
            B('제623조 — 감시인을 밀폐공간 외부에 배치하고 연락 설비 설치. 근로자에게 이상이 있으면 감시인이 지체 없이 관할 소방관서에 신고하고 협조를 받아 조치 (2025.12.1 개정)', 'Art. 623 — post an attendant outside with a means of contact; if anything goes wrong the attendant reports at once to the local fire service and acts with its help (amended 2025-12-01)'),
            B('제641조 — 작업 시작 전 위험성·측정·환기·보호구·비상연락·대피기구를 작업자(감시인 포함)에게 알리고 숙지 여부 확인·교육 (2025.12.1 개정)', 'Art. 641 — before work, brief entrants and the attendant on hazards, testing, ventilation, PPE, emergency contacts and escape equipment, and confirm they understand (amended 2025-12-01)'),
            B('제643조 — 위급한 근로자를 구출하는 작업자에게 공기호흡기 또는 송기마스크를 지급해 착용하도록 함', 'Art. 643 — anyone rescuing a worker in distress must be given, and must wear, SCBA or an airline respirator')],
    src: ['lawStd'], kosha: ['E-G-18-2026', 'X-68-2015'],
    steps: [
      { s: B('작업 정보 확정', 'Fix the job details'), h: B('인원·범위 불명확 → 구조 지연', 'Unclear crew/scope delays rescue'), c: B('작업 일시·기간·장소·내용, 관리감독자·작업자·감시인 지정', 'Record date, duration, place, task; name supervisor, entrants and attendant'), b: 'law:619②' },
      { s: B('유입 가능성 차단', 'Block possible inflow'), h: B('불활성가스·유해가스 누출·유입', 'Leak or inflow of inert/toxic gas'), c: B('연결 배관 차단·잠금, 누출·유입 가능성 검토와 후속조치 기록', 'Isolate and lock connected lines; review and record inflow risks and actions'), b: 'law:619②4' },
      { s: B('산소·유해가스 측정', 'Test O₂ and toxic gases'), h: B('측정 누락·오측정', 'Missed or faulty test'), c: B('지정된 측정자가 작업 시작(재시작 포함) 전 측정해 적정공기 여부 평가 — 포털 “수치 판정 › 밀폐공간”으로 판정', 'A designated tester measures before every start/restart and judges acceptable air — use “Measurement check › Confined space”'), b: 'law:619-2①' },
      { s: B('환기', 'Ventilate'), h: B('적정공기 미유지', 'Air drifts out of range'), c: B('작업 전·중 환기. 환기가 곤란하면 공기호흡기·송기마스크 착용', 'Ventilate before and during work; if not possible, wear SCBA or airline respirators'), b: 'law:620' },
      { s: B('환기량 확보', 'Enough air'), h: B('환기 부족으로 잔류가스 체류', 'Pockets of gas left by too little airflow'), c: B('작업 전 밀폐공간 체적의 10배 이상 신선한 공기로 환기하고 적정공기를 확인한 뒤 출입, 작업 중에는 시간당 공기교환 20회 이상으로 계속 환기 (예: 체적 600m³ → 12,000m³/h = 200m³/min)', 'Before entry, purge with fresh air of at least 10 × the space volume and confirm acceptable air; during work keep ≥ 20 air changes an hour (e.g. 600 m³ → 12,000 m³/h = 200 m³/min)'), b: 'kosha:E-G-18-2026 9.1(1)' },
      { s: B('보호구·비상연락 확인', 'Check PPE & emergency contacts'), h: B('비상 시 대응 불가', 'No way to respond in an emergency'), c: B('착용할 보호구 종류와 비상연락체계 확인', 'Confirm required PPE and the emergency contact chain'), b: 'law:619②5·6' },
      { s: B('출입구 게시', 'Post at the entrance'), h: B('무단 출입', 'Unauthorised entry'), c: B('제619조② 각 호 내용을 작업 종료 시까지 출입구에 게시', 'Post the Art. 619(2) items at the entrance until the job ends'), b: 'law:619③' },
      { s: B('작업 전 주지·숙지 확인', 'Brief and confirm understanding'), h: B('위험을 모른 채 진입', 'Entering without knowing the hazards'), c: B('위험성, 측정, 환기, 보호구, 비상연락·응급조치, 대피기구 위치를 작업자와 감시인에게 알리고 숙지 여부를 확인', 'Tell entrants and the attendant about hazards, testing, ventilation, PPE, emergency contacts and escape equipment, then confirm they understand'), b: 'law:641' },
      { s: B('감시인 배치', 'Post an attendant'), h: B('이상 발생 후 대응 지연', 'Slow response to trouble'), c: B('감시인을 외부에 배치하고 연락 설비 유지. 이상 시 지체 없이 관할 소방관서에 신고하고 협조를 받아 조치', 'Keep an attendant outside with a means of contact; if anything goes wrong, report at once to the fire service and act with its help'), b: 'law:623' },
      { s: B('작업 중 감시', 'Attend during work'), h: B('상태 변화 미인지', 'Changes go unnoticed'), c: B('작업 재개 시마다 재측정, 필요 시 연속 측정', 'Retest at each restart; monitor continuously where needed'), b: 'gp' },
      { s: B('종료·기록', 'Close out & record'), h: B('기록 미보존', 'Records lost'), c: B('측정자 성명·일시·장소·결과 기록 3년 보존 (영상기록도 가능). KOSHA C-C-49-2026 5.5(2)는 밀폐공간 출입 허가서도 3년 보존을 권고', 'Keep tester name, time, place and results for 3 years (video records allowed). KOSHA C-C-49-2026 5.5(2) also advises keeping the entry permit for 3 years'), b: 'law:619-2④' },
      { s: B('프로그램 평가', 'Review the programme'), h: B('프로그램이 현장과 어긋남', 'Programme drifts from reality'), c: B('밀폐공간 작업 프로그램을 최소 2년에 1회 이상 평가해 보완하고 기록 보존', 'Evaluate the confined-space programme at least every 2 years, update it and keep the record'), b: 'kosha:E-G-18-2026 5.2(2)' }
    ],
    stop: B(['측정값이 적정공기를 벗어남', '감시인이 자리를 비움', '가스 경보 또는 이상 냄새'], ['Readings fall outside acceptable air', 'Attendant leaves the post', 'Gas alarm or unusual odour']),
    emer: B(['즉시 대피하고, 감시인은 지체 없이 관할 소방관서(119)에 신고한 뒤 그 협조를 받아 조치', '구조자도 공기호흡기·송기마스크 없이 진입하지 않음 (2015 이천 사례: 구조하러 들어간 4명도 증상)', '측정·환기 후 원인 확인 전 재진입 금지'], ['Evacuate at once; the attendant reports straight away to the fire service (119) and acts with its help', 'Rescuers never enter without SCBA or airline respirators (Icheon 2015: four rescuers were affected)', 'No re-entry until tested, ventilated and the cause is known']),
    card: { do: B(['들어가기 전 산소·가스 측정값 확인', '감시인과 신호 약속', '출입구 게시물 확인'], ['Check O₂/gas readings before entry', 'Agree signals with the attendant', 'Read the entrance posting']),
            dont: B(['측정 없이 진입', '동료가 쓰러져도 맨몸으로 구조 진입', '환기 장치 임의 정지'], ['Enter without a test', 'Go in unprotected to rescue a collapsed co-worker', 'Switch off ventilation']) },
    quiz: [
      { q: B('적정공기의 산소 농도 범위는?', 'What oxygen range counts as acceptable air?'), o: [B('16% 이상 21% 미만', '≥ 16 % and < 21 %'), B('18% 이상 23.5% 미만', '≥ 18 % and < 23.5 %'), B('19.5% 이상 25% 미만', '≥ 19.5 % and < 25 %')], a: 1 },
      { q: B('산소·유해가스 측정·평가 기록의 보존 기간은?', 'How long must O₂/gas test records be kept?'), o: [B('1년', '1 year'), B('2년', '2 years'), B('3년', '3 years')], a: 2 },
      { q: B('환기가 곤란한 경우 필요한 조치는?', 'What if ventilation is not possible?'), o: [B('방진마스크 착용', 'Wear a dust mask'), B('공기호흡기·송기마스크 착용', 'Wear SCBA or an airline respirator'), B('작업 시간 단축', 'Shorten the job')], a: 1 },
      { q: B('작업자에게 이상이 생기면 감시인이 가장 먼저 할 일은? (2025.12 개정)', 'If an entrant gets into trouble, what must the attendant do first? (amended Dec 2025)'), o: [B('혼자 들어가 구조한다', 'Go in alone to rescue'), B('지체 없이 관할 소방관서에 신고하고 협조를 받아 조치한다', 'Report at once to the fire service and act with its help'), B('작업이 끝날 때까지 기다린다', 'Wait until the job ends')], a: 1 }
    ]
  },
  {
    id: 'hot-work', level: 'A', edu: [38], permits: ['hot'], chems: [],
    t: B('화기작업 (용접·용단·그라인딩)', 'Hot work (welding, cutting, grinding)'),
    area: B('Fab·유틸리티·건설 현장의 가연물 인접 장소', 'Near combustibles in fabs, utilities and construction areas'),
    hz: B(['불꽃·불티 비산으로 가연물 착화', '인화성 증기·가스 잔존 시 폭발', '용접 흄·연기'], ['Sparks igniting combustibles', 'Explosion where flammable vapour/gas remains', 'Welding fume and smoke']),
    legal: [B('안전보건규칙 제241조 — 통풍 불충분 장소에서 산소 사용 금지, 준수사항 6항목, 작업 전 확인, 서면 게시', 'OSH Standards Rules Art. 241 — no oxygen for ventilation, six requirements, pre-job check, written posting'),
            B('제241조의2 — 작업반경 11m 이내 가연물 등 해당 시 화재감시자 배치, 확성기·휴대 조명·화재 대피용 마스크 지급', 'Art. 241-2 — fire watch when combustibles are within 11 m (and other listed cases); supply loudhailer, portable light and escape mask'),
            B('제232조② — 가스 검지 및 경보 장치 설치', 'Art. 232(2) — gas detection and alarm devices')],
    src: ['lawStd'], kosha: ['A-G-14-2026', 'A-G-11-2025', 'P-16-2012'],
    steps: [
      { s: B('작업 준비·절차 수립', 'Plan the job and procedure'), h: B('절차 없는 즉흥 작업', 'Improvised work'), c: B('작업 준비 및 작업 절차 수립, 화기작업 허가', 'Prepare the job, set the procedure, issue a hot-work permit'), b: 'law:241②1' },
      { s: B('위험물 현황 파악', 'Map hazardous materials'), h: B('주변 위험물 미인지', 'Nearby hazards overlooked'), c: B('작업장 내 위험물 사용·보관 현황 파악', 'Identify hazardous materials used or stored nearby'), b: 'law:241②2' },
      { s: B('가연물 방호·소화기구', 'Protect combustibles, place extinguishers'), h: B('인근 가연물 착화', 'Nearby combustibles ignite'), c: B('인근 가연성물질 방호조치, 소화기구 비치', 'Shield nearby combustibles and place extinguishers'), b: 'law:241②3' },
      { s: B('비산 방지', 'Stop spark spread'), h: B('불티 비산', 'Flying sparks'), c: B('비산방지덮개·용접방화포 설치 — 방화포는 소방시설법 제40조 성능인증품', 'Use spark covers and welding blankets — blankets must be certified under Fire-Systems Act Art. 40'), b: 'law:241②4' },
      { s: B('잔존 증기·가스 제거', 'Clear residual vapour/gas'), h: B('인화성 증기·가스 폭발', 'Flammable vapour/gas explodes'), c: B('환기 등으로 인화성 액체 증기·인화성 가스가 남지 않도록 조치, 가스 검지로 확인', 'Ventilate so no flammable vapour or gas remains; confirm with gas detection'), b: 'law:241②5' },
      { s: B('교육·화재감시자', 'Brief crew, post a fire watch'), h: B('초기 화재 대응 지연', 'Slow first response'), c: B('화재예방·피난 교육, 11m 조건 해당 시 화재감시자 배치 및 대피용 방연장비 지급', 'Brief on fire prevention and escape; post a fire watch where the 11 m conditions apply, with escape equipment'), b: 'law:241②6·241-2' },
      { s: B('서면 게시', 'Post in writing'), h: B('주변 작업자 미인지', 'Others unaware'), c: B('작업 시작부터 종료까지 작업내용·일시·안전점검·조치사항을 작업장소에 서면 게시', 'Post task, time, checks and measures at the site from start to finish'), b: 'law:241④' },
      { s: B('종료 후 확인', 'After-work check'), h: B('잔불·은폐된 발화', 'Smouldering or hidden ignition'), c: B('작업 종료 후 일정 시간 잔불 여부 확인', 'Watch for smouldering for a period after the job'), b: 'gp' }
    ],
    stop: B(['가스 경보 발생', '화재감시자 부재', '방화포·소화기 미비치'], ['Gas alarm', 'No fire watch present', 'Blankets or extinguishers missing']),
    emer: B(['소화기로 초기 진화가 어려우면 즉시 대피·신고', '화재감시자가 대피 유도', '방재실(중앙 감시)과 연계'], ['If an extinguisher cannot control it, evacuate and report', 'Fire watch leads the evacuation', 'Coordinate with the central control room']),
    card: { do: B(['허가서·게시물 확인', '주변 11m 가연물 확인', '방화포 덮고 소화기 옆에 두기'], ['Check permit and posting', 'Look for combustibles within 11 m', 'Lay the blanket, keep an extinguisher close']),
            dont: B(['산소로 환기', '가스 검지 없이 작업 시작', '감시자 없이 용접'], ['Use oxygen to ventilate', 'Start without gas testing', 'Weld without a fire watch']) },
    quiz: [
      { q: B('화재감시자 배치 판단 기준이 되는 작업반경은?', 'Which work radius triggers a fire watch?'), o: [B('5m', '5 m'), B('11m', '11 m'), B('20m', '20 m')], a: 1 },
      { q: B('통풍이 불충분한 장소에서 환기용으로 사용하면 안 되는 것은?', 'What must never be used for ventilation in a poorly ventilated place?'), o: [B('질소', 'Nitrogen'), B('산소', 'Oxygen'), B('압축공기', 'Compressed air')], a: 1 },
      { q: B('화기작업 서면 게시는 언제까지 유지하나?', 'How long must the hot-work notice stay posted?'), o: [B('작업 시작 시에만', 'Only at start'), B('작업 시작부터 종료까지', 'From start to finish'), B('다음 날까지', 'Until the next day')], a: 1 }
    ]
  },
  {
    id: 'gas-cylinder', level: 'A', edu: [35], permits: ['gas'], chems: ['sih4', 'ash3', 'ph3', 'b2h6', 'nf3', 'cl2'],
    t: B('특수가스 실린더 교체', 'Specialty-gas cylinder change'),
    area: B('가스 캐비닛·가스룸', 'Gas cabinets and gas rooms'),
    hz: B(['독성 가스 노출 (아르신 IDLH 3ppm)', '자연발화성 가스 (실란·포스핀·디보란)', '고압 가스 급방출', '연결부 잔류가스'], ['Toxic gas exposure (arsine IDLH 3 ppm)', 'Pyrophoric gases (silane, phosphine, diborane)', 'Sudden high-pressure release', 'Residual gas at connections']),
    legal: [B('안전보건규칙 제232조② — 가스 검지 및 경보 장치 설치', 'OSH Standards Rules Art. 232(2) — gas detection and alarm devices'),
            B('산안법 시행규칙 제50조 — 공정안전보고서 안전운전계획에 안전작업허가·가동 전 점검 포함', 'OSH Rule Art. 50 — the PSM operating plan includes permits to work and pre-start checks'),
            B('고용노동부(2026.9.20) — 청주 가스룸 사고는 “사전점검 미실시, 안전작업허가 대상임에도 허가 없이 가스 작업 개시”에 따른 사고로 확인', 'MOEL (2026-09-20) — the Cheongju gas-room events resulted from skipped pre-checks and gas work started without the required permit'),
            B('OSHA — 자동 차단·경보 기능의 가스 감시 시스템 사용 권고', 'OSHA — use gas monitoring systems with automatic shut-offs and alarms'),
            B('고압가스 안전관리법 제20조, 시행규칙 제46·48조 — 실란(압축모노실란)·포스핀·아르신(액화알진)·삼불화질소 등 특정고압가스는 사용개시 7일 전까지 사용신고, 사용시설 기준 충족, 사용 전 완성검사와 매년 정기검사', 'High-Pressure Gas Act Art. 20; Rule Arts. 46, 48 — silane, phosphine, arsine, NF₃ and other specified gases need a use notice 7 days before first use, compliant facilities, a completion inspection and yearly periodic inspections'),
            B('고압가스 사고(누출에 의한 폭발·화재, 인명 대피 등)는 한국가스안전공사에 즉시 통보 (법 제26조)', 'Gas accidents (explosion or fire from a leak, evacuation, etc.) are reported at once to the Korea Gas Safety Corporation (Art. 26)')],
    src: ['lawStd', 'lawRule', 'moel0920', 'oshaSemi', 'icsc', 'nioshIdlh', 'lawHpg', 'lawHpgRule'], kosha: ['P-12-2012', 'P-122-2012', 'P-139-2013', 'C-C-87-2026'],
    steps: [
      { s: B('허가·사전점검 완료 확인', 'Confirm permit and pre-checks'), h: B('허가 없이 가스 작업 개시 (2026 청주 사고 공식 원인)', 'Gas work without a permit (official cause of the 2026 Cheongju events)'), c: B('안전작업허가 발급과 공정안전보고서에 따른 사전점검 기록을 확인하기 전에는 가스 공급을 열지 않음', 'Do not open gas supply until the permit is issued and PSM pre-check records are confirmed'), b: 'law:시행규칙 50|Enf. Rule 50' },
      { s: B('물질 확인', 'Gas identity'), h: B('다른 가스 접속', 'Wrong gas connected'), c: B('가스명·MSDS·실린더 라벨 대조', 'Match gas name, MSDS and cylinder label'), b: 'gp' },
      { s: B('감지·배기 확인', 'Verify detection and exhaust'), h: B('누출 미감지', 'Leak goes undetected'), c: B('가스 감지기·자동 차단·캐비닛 배기 정상 여부 확인', 'Confirm detectors, auto shut-off and cabinet exhaust work'), b: 'guide' },
      { s: B('공급 차단·퍼지', 'Isolate and purge'), h: B('연결부 잔류가스 방출', 'Residual gas released at disconnect'), c: B('공급 밸브 차단 후 연결 라인 퍼지로 잔류가스 제거', 'Close supply, purge the pigtail to remove residual gas'), b: 'gp' },
      { s: B('실린더 교체·고정', 'Swap and secure'), h: B('용기 전도·밸브 손상', 'Cylinder falls, valve damage'), c: B('용기 고정 후 교체, 밸브·가스켓 상태 확인', 'Secure cylinder before swapping; inspect valve and gasket'), b: 'gp' },
      { s: B('누설 확인', 'Leak check'), h: B('접속부 누설', 'Leak at the joint'), c: B('공급 재개 전 접속부 누설 확인', 'Leak-test the connection before restoring supply'), b: 'gp' },
      { s: B('재개·기록', 'Restore and record'), h: B('이력 누락', 'Missing history'), c: B('공급 재개, 교체 이력 기록', 'Restore supply and log the change'), b: 'gp' }
    ],
    stop: B(['허가서 또는 사전점검 기록이 없음', '가스 경보 발생', '캐비닛 배기 이상', '누설 확인'], ['No permit or pre-check record', 'Gas alarm', 'Cabinet exhaust fault', 'Leak confirmed']),
    emer: B(['경보 시 즉시 대피, 재진입 금지', 'ERT가 누출 차단·확산 방지·농도 측정·대피 판단', '아르신 노출 의심자는 증상이 늦게 나타날 수 있어 즉시 의료기관 인계'], ['On alarm, evacuate and do not re-enter', 'ERT isolates, contains, measures and decides evacuation', 'Suspected arsine exposure: symptoms can be delayed — hand over to medical care at once']),
    card: { do: B(['라벨·MSDS 대조', '감지기 정상 표시 확인', '교체 후 누설 확인'], ['Match label and MSDS', 'Check detector status', 'Leak-check after the swap']),
            dont: B(['퍼지 없이 분리', '경보 무시·리셋 후 작업 계속', '용기 고정 없이 작업'], ['Disconnect without purging', 'Reset an alarm and carry on', 'Work on an unsecured cylinder']) },
    quiz: [
      { q: B('NIOSH 기준 아르신의 IDLH는?', 'What is arsine’s NIOSH IDLH?'), o: [B('0.005 ppm', '0.005 ppm'), B('3 ppm', '3 ppm'), B('50 ppm', '50 ppm')], a: 1 },
      { q: B('ICSC에 따른 실란의 특성은?', 'Per ICSC, silane is…'), o: [B('불연성', 'Non-flammable'), B('공기 접촉 시 자연발화 가능', 'May ignite spontaneously in air'), B('물에 닿을 때만 위험', 'Hazardous only with water')], a: 1 },
      { q: B('국내 노출기준상 아르신의 TWA는?', 'Korean TWA for arsine?'), o: [B('0.005 ppm', '0.005 ppm'), B('0.05 ppm', '0.05 ppm'), B('0.5 ppm', '0.5 ppm')], a: 0 },
      { q: B('고용노동부가 확인한 2026년 청주 가스룸 사고의 원인은?', 'What did MOEL find caused the 2026 Cheongju gas-room events?'), o: [B('노후 배관 파열', 'Old pipe rupture'), B('사전점검 미실시와 허가 없는 가스 작업 개시', 'Skipped pre-checks and gas work without a permit'), B('외부 협력사 장비 결함', 'A contractor’s faulty equipment')], a: 1 }
    ]
  },
  {
    id: 'chem-supply', level: 'A', edu: [35], permits: ['chemical'], chems: ['hf', 'h2so4', 'hno3', 'hcl', 'h2o2', 'nh3', 'tmah'],
    t: B('케미컬 공급 교체·탱크로리 하역', 'Chemical supply change & tanker unloading'),
    area: B('케미컬 공급실·하역장', 'Chemical supply rooms and unloading bays'),
    hz: B(['피부·눈 접촉 (불화수소는 피부 흡수·지연 독성)', '미스트·증기 흡입', '이종 약품 오충전에 의한 반응'], ['Skin/eye contact (HF absorbs through skin with delayed toxicity)', 'Mist and vapour inhalation', 'Reaction from filling the wrong chemical']),
    legal: [B('OSHA — 부식성 물질 노출 가능 장소에 눈·신체 긴급 세척 설비 (29 CFR 1910.151)', 'OSHA — eye and body flushing facilities where corrosives are handled (29 CFR 1910.151)'),
            B('ICSC 0283 — 불화수소: 모든 접촉을 피하고, 중독 시 특이 치료 필요', 'ICSC 0283 — hydrogen fluoride: avoid all contact; specific treatment needed'),
            B('화학물질관리법 제13조 — 유해화학물질을 차에 싣거나 내릴 때 운반자·작업자 외에 유해화학물질관리자 또는 대표자가 지정한 안전교육 이수자가 참여, 다른 유해화학물질 혼합 보관 금지', 'Chemicals Control Act Art. 13 — a hazardous-chemical manager or a trained person designated by the employer must be present, besides the driver and workers, when loading or unloading; never store different hazardous chemicals together'),
            B('화학사고가 나면 즉시 응급조치하고, 인명 피해나 기준량(예: 불산 50kg) 이상 누출이면 15분 이내 즉시 신고 (법 제43조, 즉시 신고 규정)', 'On a chemical accident take emergency measures at once; report within 15 minutes if people are harmed or the threshold (e.g. 50 kg of HF) is exceeded (Art. 43; reporting rules)')],
    src: ['oshaSemi', 'icsc', 'moelOel', 'lawCca', 'mceReport'], kosha: ['P-167-2020', 'H-171-2023'],
    steps: [
      { s: B('허가·물질 확인', 'Permit and chemical identity'), h: B('오충전', 'Wrong fill'), c: B('물질명·농도·수량을 서류·라벨·저장조 표지와 이중 확인', 'Double-check name, concentration and volume against papers, label and tank marking'), b: 'gp' },
      { s: B('하역 입회', 'Attend the unloading'), h: B('운반자 혼자 하역', 'Driver unloads alone'), c: B('유해화학물질관리자 또는 지정된 안전교육 이수자가 하역에 참여', 'A hazardous-chemical manager or a designated trained person takes part in unloading'), b: 'law:화학물질관리법 제13조4호|Chemicals Control Act Art. 13(4)' },
      { s: B('비상 세척 설비 확인', 'Check emergency showers'), h: B('노출 시 즉시 세척 불가', 'No immediate flushing'), c: B('작업 전 긴급 샤워·세안기 작동 확인', 'Test the safety shower and eyewash before work'), b: 'guide' },
      { s: B('보호구 착용', 'Put on PPE'), h: B('피부·눈 접촉', 'Skin/eye contact'), c: B('물질별 내화학 보호구(장갑·앞치마·보안면 등) 착용', 'Wear chemical-resistant PPE suited to the chemical (gloves, apron, face shield, etc.)'), b: 'guide' },
      { s: B('접속 전 확인', 'Check before connecting'), h: B('포트 오접속', 'Wrong port'), c: B('이송 라인·포트 일치 여부를 2인이 확인', 'Two people confirm the line and port match'), b: 'gp' },
      { s: B('이송 감시', 'Watch the transfer'), h: B('누출 확산', 'Leak spreads'), c: B('이송 중 자리 이탈 금지, 누출 감지·방류벽 상태 확인', 'Stay present; watch leak detection and bund condition'), b: 'gp' },
      { s: B('분리·정리', 'Disconnect and tidy'), h: B('잔액 비산', 'Residue splashes'), c: B('분리 시 잔액 처리, 세척 후 기록', 'Handle residue at disconnect, rinse and record'), b: 'gp' }
    ],
    stop: B(['라벨·서류 불일치', '세척 설비 이상', '누출 발견'], ['Label/paper mismatch', 'Shower or eyewash fault', 'Any leak']),
    emer: B(['피부 노출: 오염된 옷 제거 후 다량의 물로 세척하고 즉시 의료기관 인계 (ICSC)', '불화수소 노출은 증상이 지연될 수 있어 증상이 없어도 의료 조치', '누출 시 ERT 출동 요청, 방류벽 밖으로 대피'], ['Skin contact: remove clothing, flush with plenty of water, get medical help at once (ICSC)', 'HF effects can be delayed — seek care even without symptoms', 'For a leak, call ERT and move outside the bund']),
    card: { do: B(['물질명 2번 확인', '세안기 위치 확인', '보안면·장갑 착용'], ['Check the chemical name twice', 'Know where the eyewash is', 'Wear face shield and gloves']),
            dont: B(['라벨이 다르면 “일단” 접속', '이송 중 자리 비우기', '증상 없다고 HF 노출 무시'], ['Connect “just this once” when labels differ', 'Leave during transfer', 'Ignore HF exposure because you feel fine']) },
    quiz: [
      { q: B('불화수소 노출의 특징으로 맞는 것은?', 'Which is true of HF exposure?'), o: [B('증상이 지연될 수 있다', 'Symptoms may be delayed'), B('피부로는 흡수되지 않는다', 'It is not absorbed through skin'), B('물 세척이 필요 없다', 'No water flushing needed')], a: 0 },
      { q: B('긴급 세척 설비는 언제 확인하나?', 'When do you check the emergency shower?'), o: [B('사고 발생 후', 'After an accident'), B('작업 시작 전', 'Before starting'), B('월 1회만', 'Only monthly')], a: 1 },
      { q: B('국내 노출기준상 불화수소의 최고노출기준(C)은?', 'Korean ceiling (C) for HF?'), o: [B('0.5 ppm', '0.5 ppm'), B('3 ppm', '3 ppm'), B('30 ppm', '30 ppm')], a: 1 }
    ]
  },
  {
    id: 'pm-chamber', level: 'A', edu: [35, 17], permits: ['electrical', 'gas'], chems: ['hcl', 'ash3', 'ph3'],
    t: B('장비 PM — 챔버 오픈', 'Equipment PM — chamber opening'),
    area: B('식각·증착·확산 장비 (Fab)', 'Etch, deposition and diffusion tools (fab)'),
    hz: B(['반응 부산물 잔류물 노출 (HCl·아르신·포스핀 등)', '잔류 전기·RF 에너지', '고온 부품 화상', '부품 협착'], ['Reaction-product residues (HCl, arsine, phosphine, etc.)', 'Residual electrical/RF energy', 'Burns from hot parts', 'Pinch points']),
    legal: [B('OSHA — 반응 챔버·펌프 정비자는 반응 부산물 잔류물에 노출될 수 있음', 'OSHA — maintenance staff on chambers and pumps may meet reaction-product residues'),
            B('KOSHA B-M-25-2026 — 에너지 차단장치의 잠금·표지', 'KOSHA B-M-25-2026 — lockout/tagout of energy-isolating devices')],
    src: ['oshaSemi', 'koshaGuide'], kosha: ['C-C-65-2026', 'B-M-25-2026', 'C-C-52-2026'],
    steps: [
      { s: B('허가·위험성평가 확인', 'Permit and risk assessment'), h: B('위험요인 누락', 'Hazards missed'), c: B('PM 허가와 해당 작업 위험성평가·절차서 확인, TBM', 'Check the PM permit, job risk assessment and procedure; hold a TBM'), b: 'gp' },
      { s: B('가스 차단·퍼지', 'Isolate gas and purge'), h: B('공정가스 잔류', 'Process gas remains'), c: B('공정가스 공급 차단, 챔버·라인 퍼지', 'Shut off process gases; purge chamber and lines'), b: 'gp' },
      { s: B('에너지 차단(LOTO)', 'Isolate energy (LOTO)'), h: B('예기치 않은 기동·감전', 'Unexpected start, shock'), c: B('전원·RF·공압 차단, 잠금·표지 후 제로에너지 확인', 'Isolate power, RF and pneumatics; lock, tag and verify zero energy'), b: 'guide' },
      { s: B('냉각·잔류물 확인', 'Cool down, check residues'), h: B('화상·잔류물 흡입', 'Burns, residue inhalation'), c: B('충분히 냉각 후 개방, 필요 시 가스 농도 측정', 'Open only when cool; measure gas where needed'), b: 'guide' },
      { s: B('개방·세정', 'Open and clean'), h: B('분진·가스 비산', 'Dust or gas release'), c: B('국소배기 가동, 호흡·피부 보호구 착용, 잔류물 폐기물 분리', 'Run local exhaust; wear respiratory and skin PPE; segregate residue waste'), b: 'guide' },
      { s: B('복구·가동 전 점검', 'Reassemble, pre-startup check'), h: B('누설·인터록 불량', 'Leaks, interlock faults'), c: B('누설 시험, 인터록 확인, 잠금 해제 전 인원 확인', 'Leak test, check interlocks, account for all people before removing locks'), b: 'guide' }
    ],
    stop: B(['제로에너지 확인 불가', '개방 시 이상 냄새·경보', '냉각 미완료'], ['Zero energy not proven', 'Odour or alarm on opening', 'Not yet cool']),
    emer: B(['노출 의심 시 즉시 이탈·신고', '잔류물 비산 시 구역 통제 후 ERT 요청'], ['Leave and report if exposure is suspected', 'If residue spreads, cordon the area and call ERT']),
    card: { do: B(['잠금장치에 내 자물쇠 걸기', '열기 전 냉각·측정', '국소배기 켜기'], ['Put your own lock on', 'Cool and test before opening', 'Turn on local exhaust']),
            dont: B(['남의 자물쇠로 대신 잠금', '인터록 우회', '맨손으로 잔류물 청소'], ['Rely on someone else’s lock', 'Bypass interlocks', 'Clean residues bare-handed']) },
    quiz: [
      { q: B('챔버 정비 시 OSHA가 경고하는 주요 노출원은?', 'What does OSHA warn chamber maintainers about?'), o: [B('소음', 'Noise'), B('반응 부산물 잔류물', 'Reaction-product residues'), B('자외선', 'UV light')], a: 1 },
      { q: B('잠금·표지 후 반드시 할 일은?', 'After lock and tag you must…'), o: [B('제로에너지 확인', 'Verify zero energy'), B('즉시 개방', 'Open immediately'), B('인터록 해제', 'Defeat interlocks')], a: 0 }
    ]
  },
  {
    id: 'pump-scrubber', level: 'B', edu: [35], permits: ['electrical', 'lifting'], chems: ['hcl', 'nf3', 'hf'],
    t: B('진공펌프·스크러버 정비', 'Vacuum pump & scrubber maintenance'),
    area: B('P&S Room (Pump & Scrubber Room) — SK하이닉스 무인 순찰 로봇의 순찰 구역', 'P&S Room (pump & scrubber room) — patrolled by SK hynix robots'),
    hz: B(['배기라인·펌프 내부 반응 부산물 (파우더·가스)', '고온 표면', '펌프 중량물 취급', '배관 연결부 누출'], ['Reaction by-products inside exhaust lines and pumps (powder, gas)', 'Hot surfaces', 'Heavy pump handling', 'Leaks at pipe joints']),
    legal: [B('OSHA — 펌프 등 부대설비의 반응 부산물 잔류물', 'OSHA — reaction-product residues in pumps and ancillary equipment'),
            B('SK하이닉스 — 로봇이 P&S Room 배관 이음부 열화상·가스 누출·변경점 점검', 'SK hynix — robots check pipe joints in P&S rooms by thermal imaging, gas sensing and change detection')],
    src: ['oshaSemi', 'sr2024'], kosha: ['C-C-65-2026', 'B-M-25-2026', 'B-M-7-2025'],
    steps: [
      { s: B('허가·연계 장비 확인', 'Permit and linked tools'), h: B('가동 중 장비 배기 차단', 'Cutting exhaust from a running tool'), c: B('연결된 공정 장비 정지 여부 확인, 허가', 'Confirm the connected process tool is idle; permit'), b: 'gp' },
      { s: B('차단·퍼지·LOTO', 'Isolate, purge, LOTO'), h: B('잔류가스·기동', 'Residual gas, start-up'), c: B('배기·질소 라인 차단과 퍼지, 전원 잠금·표지', 'Isolate and purge exhaust/N₂ lines; lock and tag power'), b: 'guide' },
      { s: B('냉각·측정', 'Cool and test'), h: B('화상·흡입', 'Burns, inhalation'), c: B('표면 온도·가스 농도 확인 후 분해', 'Check surface temperature and gas levels before dismantling'), b: 'guide' },
      { s: B('분해·잔류물 처리', 'Dismantle, handle residue'), h: B('파우더 비산', 'Powder release'), c: B('국소배기·보호구, 잔류물 밀폐 포장', 'Local exhaust, PPE, seal residues in containers'), b: 'guide' },
      { s: B('중량물 이동', 'Move heavy parts'), h: B('협착·요통', 'Crushing, back injury'), c: B('운반 기구 사용, 경로 확보', 'Use handling aids; clear the route'), b: 'gp' },
      { s: B('복구·누설 확인', 'Reinstall and leak-check'), h: B('연결부 누출', 'Joint leak'), c: B('누설 시험 후 가동, 순찰 기준 이미지 갱신 요청', 'Leak test before restart; ask SDX to refresh patrol baseline images'), b: 'gp' }
    ],
    stop: B(['연계 장비 가동 중', '가스 경보', '파우더 비산 발생'], ['Linked tool still running', 'Gas alarm', 'Powder released']),
    emer: B(['비산·누출 시 구역 이탈, ERT 요청', '화상 시 냉각 후 의료 인계'], ['On release, leave the area and call ERT', 'Cool burns and hand over to medical care']),
    card: { do: B(['연결된 장비 정지 확인', '식은 뒤 분해', '잔류물은 밀폐 포장'], ['Confirm the tool is idle', 'Dismantle only when cool', 'Seal residues']),
            dont: B(['뜨거운 펌프 분해', '파우더를 에어로 불기', '혼자 중량물 들기'], ['Open a hot pump', 'Blow powder off with air', 'Lift heavy parts alone']) },
    quiz: [
      { q: B('SK하이닉스 순찰 로봇이 P&S Room에서 하는 일이 아닌 것은?', 'Which is NOT a task of SK hynix patrol robots in P&S rooms?'), o: [B('열화상 온도 진단', 'Thermal checks'), B('가스 누출 확인', 'Gas-leak checks'), B('펌프 분해 정비', 'Dismantling pumps')], a: 2 }
    ]
  },
  {
    id: 'line-break', level: 'A', edu: [35], permits: ['linebreak', 'chemical'], chems: ['hf', 'h2so4', 'hno3', 'hcl'],
    t: B('가스·케미컬 배관 개방 (라인 브레이킹)', 'Gas / chemical line breaking'),
    area: B('공급 배관·밸브 박스·설비 연결부', 'Supply lines, valve boxes, tool connections'),
    hz: B(['잔류 약액·가스 분출', '압력 잔존', '도급 작업 시 정보 부족'], ['Residual chemical or gas spray', 'Trapped pressure', 'Contractors lacking hazard information']),
    legal: [B('산안법 제65조 — 유해 화학물질 설비의 개조·분해·해체·철거 및 내부 작업을 도급할 때 작업 시작 전 수급인에게 안전·보건 정보를 문서로 제공', 'OSH Act Art. 65 — before contracted modification, dismantling or internal work on hazardous-chemical equipment, give the contractor written safety information'),
            B('산안법 시행령 제51조 — 중량비율 1% 이상 황산·불화수소·질산·염화수소 취급 설비의 개조·분해·해체·철거 또는 내부 작업은 도급 승인 대상 (화학물질을 모두 제거하고 증명자료를 신고한 경우 제외)', 'OSH Decree Art. 51 — modifying, dismantling or working inside equipment handling ≥ 1 wt% sulfuric, hydrofluoric, nitric or hydrochloric acid needs subcontracting approval (unless all chemicals are removed and proof is filed)')],
    src: ['lawAct', 'lawDecree'], kosha: ['C-C-65-2026', 'P-167-2020', 'B-M-25-2026'],
    steps: [
      { s: B('범위·물질 확인', 'Define scope and contents'), h: B('개방 범위 오인', 'Wrong section opened'), c: B('개방 구간과 내부 물질·농도 확인, 도급이면 제65조 정보 문서 제공·도급승인 해당 여부 판정', 'Confirm section and contents; if contracted, provide Art. 65 information and check whether approval applies'), b: 'law:65·dec51' },
      { s: B('격리', 'Isolate'), h: B('역류·유입', 'Backflow or inflow'), c: B('상·하류 밸브 차단·잠금, 필요 시 맹판', 'Close and lock upstream/downstream valves; blind where needed'), b: 'guide' },
      { s: B('배출·퍼지·세척', 'Drain, purge, flush'), h: B('잔류물 분출', 'Residue spray'), c: B('배출·퍼지·세척 후 잔압·잔류 확인', 'Drain, purge and flush; confirm no pressure or residue'), b: 'guide' },
      { s: B('보호구·배기', 'PPE and exhaust'), h: B('피부·흡입 노출', 'Skin or inhalation exposure'), c: B('내화학 보호구, 국소배기, 비산 방향 통제', 'Chemical PPE, local exhaust, control spray direction'), b: 'guide' },
      { s: B('개방', 'Open'), h: B('갑작스런 분출', 'Sudden release'), c: B('몸을 비켜 서서 천천히 체결부를 푼다', 'Stand aside and loosen fittings slowly'), b: 'gp' },
      { s: B('복구·누설시험', 'Restore and leak test'), h: B('재가동 시 누출', 'Leak on restart'), c: B('누설 시험 후 격리 해제', 'Leak-test before removing isolation'), b: 'gp' }
    ],
    stop: B(['잔압·잔류 확인 불가', '도급 정보 미제공', '밸브 잠금 불가'], ['Pressure or residue not proven clear', 'Contractor information not given', 'Valves cannot be locked']),
    emer: B(['분출 시 즉시 세척·대피', 'ERT 출동 요청, 누출 구역 통제'], ['On spray, flush and evacuate', 'Call ERT and cordon the leak area']),
    card: { do: B(['정보 문서 받고 읽기', '잔압 0 확인', '옆으로 비켜서 풀기'], ['Get and read the information sheet', 'Confirm zero pressure', 'Stand aside when loosening']),
            dont: B(['정보 없이 작업 시작', '정면에서 체결부 풀기', '잠금 없이 밸브만 닫고 작업'], ['Start without information', 'Loosen fittings face-on', 'Rely on a closed but unlocked valve']) },
    quiz: [
      { q: B('도급 승인 대상 설비의 기준 농도는 중량비율 몇 % 이상인가?', 'Approval applies to equipment handling these acids at what wt% or more?'), o: [B('0.1%', '0.1 %'), B('1%', '1 %'), B('10%', '10 %')], a: 1 },
      { q: B('수급인이 정보를 받지 못한 경우 할 수 있는 것은?', 'If the contractor gets no information, it may…'), o: [B('작업을 하지 않을 수 있다', 'Decline the work'), B('반드시 작업해야 한다', 'Must work anyway'), B('벌금을 문다', 'Pay a fine')], a: 0 }
    ]
  },
  {
    id: 'loto', level: 'A', edu: [17], permits: ['electrical'], chems: [],
    t: B('정전작업·에너지 차단 (LOTO)', 'Electrical isolation & LOTO'),
    area: B('전기실·장비 전원·유틸리티 설비', 'Electrical rooms, tool power, utilities'),
    hz: B(['감전·아크', '예기치 않은 기동 (전기·공압·유압·중력)', '잔류 에너지 (콘덴서·스프링·압력)'], ['Shock and arc flash', 'Unexpected start-up (electric, pneumatic, hydraulic, gravity)', 'Stored energy (capacitors, springs, pressure)']),
    legal: [B('안전보건규칙 제92조 — 정비·청소·수리 등의 작업 시 운전 정지, 기동장치 잠금·열쇠 별도 관리 또는 표지판, 압축 기체·액체 미리 방출', 'OSH Standards Rules Art. 92 — stop the machine for maintenance, cleaning or repair; lock the start control and keep the key separately or post a sign; release stored gas or liquid first'),
            B('제319조② — 전로 차단 6단계: 도면으로 전원 확인 → 차단·단로기 개방 → 잠금장치·꼬리표 → 잔류전하 방전 → 검전기로 확인 → 역송전 우려 시 단락 접지', 'Art. 319(2) — six steps to isolate a circuit: confirm sources on drawings → open breakers and disconnectors → locks and tags → discharge stored charge → prove dead with a tester → short-circuit earthing if back-feed is possible'),
            B('제319조③ — 재통전 전 단락 접지기구 제거, 작업자 이격 확인, 잠금장치·꼬리표는 설치한 근로자가 직접 철거', 'Art. 319(3) — before re-energising, remove earthing, confirm everyone is clear; each lock and tag is removed by the worker who fitted it'),
            B('KOSHA B-M-25-2026 잠금·표지, B-E-10-2026 정전전로 작업(6.2.6 단락접지) — 구 E-86·E-59 지침은 2026.1.30 폐지', 'KOSHA B-M-25-2026 lockout/tagout; B-E-10-2026 work on de-energised circuits (6.2.6 short-circuit earthing) — the old E-86 and E-59 guides were withdrawn on 2026-01-30')],
    src: ['lawStd', 'koshaGuide'], kosha: ['B-M-25-2026', 'B-E-10-2026'],
    steps: [
      { s: B('에너지원 파악', 'Identify energy sources'), h: B('숨은 에너지원', 'Hidden sources'), c: B('전기·공압·유압·중력·열 등 모든 에너지원 목록화', 'List every source: electrical, pneumatic, hydraulic, gravity, thermal'), b: 'guide' },
      { s: B('통보·정지', 'Notify and stop'), h: B('타인 조작', 'Someone restarts'), c: B('관계자 통보 후 정상 절차로 정지', 'Notify those affected; stop by the normal procedure'), b: 'guide' },
      { s: B('차단·잠금·표지', 'Isolate, lock, tag'), h: B('차단 해제', 'Isolation undone'), c: B('차단장치 조작 후 개인 자물쇠·표지 부착', 'Operate isolators; fit personal locks and tags'), b: 'law:319②3|319(2)3' },
      { s: B('잔류 에너지 해소', 'Release stored energy'), h: B('잔류 에너지 방출', 'Stored-energy release'), c: B('방전·배압·지지 등으로 잔류 에너지 제거', 'Discharge, vent, block to remove stored energy'), b: 'law:319②4·92④|319(2)4, 92(4)' },
      { s: B('제로에너지 확인', 'Verify zero energy'), h: B('차단 오류', 'Wrong isolation'), c: B('검전기로 충전 여부를 확인하고, 역송전·유도 우려가 있으면 단락 접지 후 작업', 'Prove dead with a tester; apply short-circuit earthing where back-feed or induction is possible'), b: 'law:319②5·6|319(2)5–6' },
      { s: B('복구', 'Restore'), h: B('인원 잔류 상태 기동', 'Start-up with people inside'), c: B('접지기구 제거, 인원·공구 확인 후 본인이 자물쇠 해제', 'Remove earthing, account for people and tools; each person removes their own lock'), b: 'law:319③|319(3)' }
    ],
    stop: B(['자물쇠 부족·공용 열쇠 사용', '검전 결과 이상', '도면과 현장 불일치'], ['Not enough locks or shared keys', 'Voltage check fails', 'Drawings differ from the field']),
    emer: B(['감전 시 전원 차단 후 구조, 심폐소생술', '아크 화상 시 냉각 후 의료 인계'], ['For shock, cut power before touching; start CPR if needed', 'For arc burns, cool and hand over to medical care']),
    card: { do: B(['내 자물쇠는 내가 걸고 내가 푼다', '검전기로 확인', '표지에 이름·연락처'], ['My lock — I fit it and I remove it', 'Prove dead with a tester', 'Name and contact on the tag']),
            dont: B(['“잠깐이니까” 잠금 생략', '다른 사람 자물쇠 제거', '표지만 걸고 잠금 생략'], ['Skip locking “because it’s quick”', 'Remove someone else’s lock', 'Tag without a lock']) },
    quiz: [
      { q: B('LOTO에서 작업 직전 반드시 해야 하는 것은?', 'What must you do right before work under LOTO?'), o: [B('제로에너지 확인', 'Verify zero energy'), B('표지 제거', 'Remove tags'), B('동료 자물쇠 공유', 'Share a co-worker’s lock')], a: 0 },
      { q: B('자물쇠는 누가 해제하나?', 'Who removes a lock?'), o: [B('관리자 누구나', 'Any manager'), B('자물쇠를 건 본인', 'The person who fitted it'), B('다음 교대조', 'The next shift')], a: 1 }
    ]
  },
  {
    id: 'height', level: 'A', edu: [], permits: ['height'], chems: [],
    t: B('고소작업 (반송 레일·천장·고소작업대)', 'Work at height (transport rails, ceiling, aerial platforms)'),
    area: B('Fab 천장부 자동반송(OHT) 레일, 덕트·배관 상부, 건설 현장', 'Fab ceiling transport (OHT) rails, above ducts and pipes, construction'),
    hz: B(['추락 (SK하이닉스 3대 사고 유형 중 하나로 관리)', '반송 설비 충돌·끼임', '낙하물'], ['Falls (managed by SK hynix as one of the top-3 accident types)', 'Collision or caught-in by transport systems', 'Falling objects']),
    legal: [B('SK하이닉스 — 위험도 6 이상이면서 추락·끼임·부딪힘 유형인 단위작업은 현장 이행 확인·컨설팅 대상', 'SK hynix — unit tasks rated 6+ in fall, caught-in or struck-by types get field verification and consulting'),
            B('TSMC — 천장 작업 AI 위험 식별 모듈 도입 (벤치마크)', 'TSMC — AI hazard-identification module for ceiling work (benchmark)')],
    src: ['sr2025', 'tsmc2023', 'koshaGuide'], kosha: ['C-74-2015', 'X-44-2016', 'A-G-4-2025'],
    steps: [
      { s: B('작업계획·허가', 'Plan and permit'), h: B('동시 작업 충돌', 'Clashing activities'), c: B('고소작업 허가, 하부 작업 조정', 'Height permit; coordinate work below'), b: 'gp' },
      { s: B('반송 설비 정지 구간', 'Isolate transport zone'), h: B('OHT 충돌', 'OHT strike'), c: B('작업 구간 반송 정지·차단 설정 및 잠금', 'Stop and block transport in the zone; lock out'), b: 'gp' },
      { s: B('장비 점검', 'Inspect equipment'), h: B('작업대 전도·파손', 'Platform tip-over or failure'), c: B('고소작업대·사다리 작업 전 점검', 'Pre-use check of platforms and ladders'), b: 'guide' },
      { s: B('추락 방지', 'Fall protection'), h: B('추락', 'Fall'), c: B('안전대 체결 위치 확보 후 작업', 'Secure an anchor for the harness before working'), b: 'guide' },
      { s: B('하부 통제', 'Control below'), h: B('낙하물', 'Dropped objects'), c: B('하부 출입 통제, 공구 낙하 방지', 'Barricade below; tether tools'), b: 'gp' },
      { s: B('복구', 'Restore'), h: B('반송 재가동 사고', 'Restart accident'), c: B('인원 철수 확인 후 반송 재가동', 'Confirm everyone is clear before restarting transport'), b: 'gp' }
    ],
    stop: B(['반송 정지 확인 불가', '안전대 체결점 없음', '하부 통제 불가'], ['Transport stop not confirmed', 'No anchor point', 'Area below not controlled']),
    emer: B(['추락자 발생 시 2차 사고 방지 후 구조, 무리한 이동 금지', '매달린 상태는 즉시 구조 요청 (시간이 지날수록 위험)'], ['After a fall, prevent secondary accidents; do not move the casualty unnecessarily', 'If someone is suspended, call rescue at once — time matters']),
    card: { do: B(['반송 정지 표시 확인', '안전대 먼저 걸고 이동', '공구에 끈 달기'], ['Check the transport-stop sign', 'Clip on before moving', 'Tether tools']),
            dont: B(['난간 넘어 작업', '작업대 위 사다리 올리기', '하부 통제 없이 작업'], ['Lean over guardrails', 'Put a ladder on a platform', 'Work without a barricade below']) },
    quiz: [
      { q: B('SK하이닉스가 관리하는 3대 사고 유형은?', 'SK hynix’s top-3 accident types are…'), o: [B('추락·끼임·부딪힘', 'Falls, caught-in, struck-by'), B('화재·폭발·누출', 'Fire, explosion, leak'), B('감전·화상·질식', 'Shock, burns, asphyxiation')], a: 0 }
    ]
  },
  {
    id: 'equip-move', level: 'B', edu: [14], permits: ['lifting'], chems: [],
    t: B('신규 장비 반입·셋업', 'New tool move-in & set-up'),
    area: B('반입 경로·Fab·서브팹', 'Move-in route, fab, sub-fab'),
    hz: B(['중량물 전도·협착', '양중 장비 사고', '유틸리티 연결 오류', '변경 미관리'], ['Heavy loads tipping or crushing', 'Lifting-equipment accidents', 'Utility hook-up errors', 'Unmanaged change']),
    legal: [B('안전보건규칙 제38조①11·별표4 — 중량물 취급작업은 사전조사 후 추락·낙하·전도·협착·붕괴 위험 예방대책을 담은 작업계획서 작성, 제39조 작업지휘자 지정', 'OSH Standards Rules Art. 38(1)11 and Annex 4 — heavy-load handling needs a prior survey and a work plan covering falls, dropped loads, tipping, crushing and collapse; Art. 39 appoint a work leader'),
            B('KOSHA D-C-10-2026 건설장비(이동식크레인 등) 작업계획서, B-M-7-2025 양중기 일반 안전 (구 C-102-2023·M-79-2011은 2026.1.30 폐지·통폐합)', 'KOSHA D-C-10-2026 work plans for construction equipment incl. mobile cranes; B-M-7-2025 general lifting safety (old C-102-2023 and M-79-2011 withdrawn or merged on 2026-01-30)'),
            B('KOSHA C-C-52-2026 가동전 안전점검, C-C-53-2026 변경요소 관리 (PSM 안전운전계획 항목)', 'KOSHA C-C-52-2026 pre-startup review, C-C-53-2026 management of change (PSM operating-plan items)')],
    src: ['lawStd', 'koshaGuide', 'lawRule'], kosha: ['D-C-10-2026', 'B-M-7-2025', 'C-C-52-2026', 'C-C-53-2026'],
    steps: [
      { s: B('변경관리 등록', 'Register the change'), h: B('변경 위험 미검토', 'Change risks unreviewed'), c: B('신규 장비를 변경요소로 등록, 위험성평가', 'Log the tool as a change; assess risk'), b: 'guide' },
      { s: B('작업계획서', 'Work plan'), h: B('경로·하중 미확인', 'Route/load unchecked'), c: B('중량·경로·장비·신호체계를 담은 작업계획서 작성', 'Write a plan with weight, route, equipment and signals'), b: 'guide' },
      { s: B('양중·운반', 'Lift and move'), h: B('전도·협착', 'Tipping, crushing'), c: B('신호수 배치, 하부·경로 통제', 'Post a signaller; control the route and area below'), b: 'guide' },
      { s: B('반입·하역 전 잔류물 확인', 'Check for residue before unloading'), h: B('장비 내부 잔류 약액 유출 (2026.6.10 청주 TMAH 접촉 사례)', 'Chemical left inside leaks out (Cheongju TMAH contact, 10 Jun 2026)'), c: B('보내는 쪽의 배액·세정 확인서와 개방부 마개를 확인하고, 운송·하역자에게 물질 정보 제공', 'Check the sender’s drain-and-rinse certificate and capped openings; give drivers and unloaders substance information'), b: 'gp' },
      { s: B('설치·유틸 연결', 'Install and hook up'), h: B('가스·전기 오연결', 'Wrong gas or power hook-up'), c: B('도면 대조, 연결부 누설 확인', 'Check against drawings; leak-test connections'), b: 'gp' },
      { s: B('가동 전 안전점검', 'Pre-startup safety review'), h: B('미완료 상태 가동', 'Start-up with open items'), c: B('PSSR 체크리스트 완료 후 가동', 'Start only after the PSSR checklist is complete'), b: 'guide' }
    ],
    stop: B(['작업계획서와 현장 불일치', '신호수 부재', 'PSSR 미완료'], ['Plan differs from the field', 'No signaller', 'PSSR incomplete']),
    emer: B(['전도·협착 시 추가 이동 금지, 구조 요청'], ['After tipping or crushing, stop moving the load; call rescue']),
    card: { do: B(['작업계획서 경로 확인', '신호수 신호만 따르기', '연결 후 누설 확인'], ['Follow the planned route', 'Take signals from the signaller only', 'Leak-test after hook-up']),
            dont: B(['매달린 짐 아래 통과', '임의 경로 변경', '점검 전 전원 투입'], ['Walk under a suspended load', 'Change the route on the fly', 'Power up before checks']) },
    quiz: [
      { q: B('신규 장비 가동 전에 완료해야 하는 PSM 항목은?', 'Which PSM element must be completed before start-up?'), o: [B('가동 전 점검', 'Pre-startup review'), B('자체감사', 'Self-audit'), B('주민홍보', 'Public information')], a: 0 }
    ]
  },
  {
    id: 'implant', level: 'A', edu: [35, 17, 33], permits: ['radiation', 'gas', 'electrical'], chems: ['ash3', 'ph3', 'bf3', 'b2h6'],
    t: B('이온주입 장비 작업', 'Ion implanter work'),
    area: B('이온주입 장비 (도핑 공정)', 'Ion implanters (doping)'),
    hz: B(['X선 방사 (SK하이닉스 2025 평가에서 방사선이 고위험 항목)', '고전압', '독성·자연발화성 도펀트 가스', '비소 등 반응 부산물 잔류물'], ['X-ray radiation (radiation ranked high-risk in SK hynix’s 2025 assessment)', 'High voltage', 'Toxic, pyrophoric dopant gases', 'Residues such as arsenic']),
    legal: [B('OSHA — 도핑 공정 유해위험: X선, 고전압, 인화성·독성 가스, 반응 부산물(비소·아르신·포스핀)', 'OSHA — doping hazards: X-rays, high voltage, flammable/toxic gases, residues (arsenic, arsine, phosphine)'),
            B('SK하이닉스 — 2025년 평가에서 방사선·무너짐·화상·화재 항목이 높은 위험도', 'SK hynix — radiation, collapse, burns and fire scored highest in 2025'),
            B('원자력안전위원회(2024.9.26) — 반도체 사업장 X선 분석장비 정비 중 피폭 사건: 인터락 배선 임의 변경과 전원을 켠 채 한 정비가 원인. 연동장치 임의 해제는 원자력안전법 제59조① 등 위반', 'NSSC (2024-09-26) — X-ray analyser exposure during maintenance at a chip plant: altered interlock wiring and work with power on; defeating interlocks breached Nuclear Safety Act Art. 59(1) and related rules')],
    src: ['oshaSemi', 'sr2026', 'nsscSamsung'], kosha: ['C-C-65-2026', 'P-12-2012', 'B-M-25-2026'],
    steps: [
      { s: B('허가·차폐 확인', 'Permit and shielding'), h: B('X선 노출', 'X-ray exposure'), c: B('작업 전 차폐·인터록 정상 확인, 인터록 우회 금지', 'Confirm shielding and interlocks; never bypass interlocks'), b: 'guide' },
      { s: B('고전압 차단·방전', 'Isolate and discharge HV'), h: B('감전', 'Shock'), c: B('전원 차단·잠금 후 방전 확인', 'Isolate and lock; verify discharge'), b: 'guide' },
      { s: B('도펀트 가스 차단·퍼지', 'Isolate dopant gas'), h: B('독성 가스', 'Toxic gas'), c: B('소스 가스 차단·퍼지, 가스 농도 확인', 'Shut off and purge source gas; measure gas'), b: 'guide' },
      { s: B('잔류물 세정', 'Clean residues'), h: B('비소 등 잔류물 노출', 'Arsenic residues'), c: B('국소배기·호흡보호구, 폐기물 밀폐', 'Local exhaust, respirator, sealed waste'), b: 'guide' },
      { s: B('복구·차폐 시험', 'Restore, test shielding'), h: B('차폐 누락', 'Shielding gap'), c: B('차폐 부품 복구 후 인터록 시험, 가동 전 점검', 'Refit shielding; test interlocks; pre-startup check'), b: 'guide' }
    ],
    stop: B(['인터록 이상', '차폐 패널 미복구', '가스 경보'], ['Interlock fault', 'Shield panel not refitted', 'Gas alarm']),
    emer: B(['방사선 노출 의심 시 즉시 작업 중지·보고', '가스 누출 시 대피 후 ERT'], ['Stop and report any suspected radiation exposure', 'For a gas leak, evacuate and call ERT']),
    card: { do: B(['인터록 표시 확인', '방전 확인 후 접촉', '잔류물은 젖은 방식으로 청소'], ['Check interlock status', 'Touch only after discharge', 'Clean residues wet']),
            dont: B(['인터록 우회', '차폐 패널 빼고 가동', '잔류물 건식 솔질'], ['Bypass interlocks', 'Run with shield panels off', 'Dry-brush residues']) },
    quiz: [
      { q: B('이온주입 작업의 방사선 위험원은?', 'The radiation hazard in implant work is…'), o: [B('X선', 'X-rays'), B('적외선만', 'Infrared only'), B('없음', 'None')], a: 0 }
    ]
  },
  {
    id: 'photo', level: 'B', edu: [35], permits: ['chemical'], chems: ['tmah', 'pgme', 'o3', 'naoh'],
    t: B('포토 공정 작업 (도포·노광·현상)', 'Photolithography work (coat, expose, develop)'),
    area: B('포토(노광) 구역 — 감광재료 취급 작업장', 'Photo (litho) area — photosensitive-material workplace'),
    hz: B(['감광액·용제 증기', '자외선과 오존', '노광 램프 파손 시 수은', '알칼리 현상액(TMAH 등) 접촉'], ['Photoresist and solvent vapour', 'UV light and ozone', 'Mercury if a lamp breaks', 'Alkaline developer (e.g. TMAH) contact']),
    legal: [B('안전보건규칙 제8조 — 감광재료를 취급하는 작업장은 조도 기준 적용 제외', 'OSH Standards Rules Art. 8 — photosensitive-material workplaces are exempt from the illumination minimums'),
            B('OSHA — 노광 UV·오존·수은·X선/전자빔, 현상액·용제 유해위험', 'OSHA — UV, ozone, mercury, X-ray/e-beam, developer and solvent hazards'),
            B('KOSHA H-171-2023 — TMAH 취급 전자산업 근로자 보건관리', 'KOSHA H-171-2023 — health management for TMAH handlers')],
    src: ['lawStd', 'oshaSemi', 'koshaGuide'], kosha: ['H-171-2023', 'C-C-65-2026'],
    steps: [
      { s: B('배기 확인', 'Check exhaust'), h: B('용제 증기 축적', 'Solvent vapour build-up'), c: B('도포·현상 설비 배기 정상 확인', 'Confirm exhaust on coat and develop tools'), b: 'guide' },
      { s: B('현상액 취급', 'Handle developer'), h: B('피부·눈 접촉', 'Skin/eye contact'), c: B('내화학 장갑·보안경, 비상 세척 설비 위치 확인', 'Chemical gloves and goggles; know the eyewash location'), b: 'guide' },
      { s: B('UV 차폐', 'UV shielding'), h: B('자외선 노출', 'UV exposure'), c: B('노광 설비 차폐·인터록 유지, 오존 배기', 'Keep enclosures and interlocks; exhaust ozone'), b: 'guide' },
      { s: B('램프 교체', 'Lamp change'), h: B('수은 노출·화상', 'Mercury, burns'), c: B('냉각 후 조심스럽게 교체, 파손 시 수은 누출 대응', 'Change only when cool; follow mercury-spill steps if broken'), b: 'guide' },
      { s: B('폐액·용기 관리', 'Waste and containers'), h: B('혼합 반응', 'Incompatible mixing'), c: B('폐액 분리 보관, 용기 밀폐', 'Segregate waste; keep containers closed'), b: 'gp' }
    ],
    stop: B(['배기 이상', '차폐·인터록 이상', '현상액 누출'], ['Exhaust fault', 'Shield or interlock fault', 'Developer leak']),
    emer: B(['현상액 접촉 시 즉시 다량의 물로 세척 후 의료 인계', '램프 파손 시 구역 통제 후 전문 처리'], ['Developer contact: flush with plenty of water, then medical care', 'Broken lamp: cordon the area and call specialists']),
    card: { do: B(['세안기 위치 확인', '장갑·보안경 착용', '램프는 식은 뒤 교체'], ['Know the eyewash location', 'Wear gloves and goggles', 'Change lamps only when cool']),
            dont: B(['차폐 열고 노광', '현상액 맨손 취급', '폐액 섞어 버리기'], ['Expose with covers open', 'Handle developer bare-handed', 'Mix wastes']) },
    quiz: [
      { q: B('감광재료 취급 작업장의 조도 기준은?', 'Illumination minimums in photosensitive-material areas?'), o: [B('750 lux 이상', '≥ 750 lux'), B('제8조 기준 적용 제외', 'Exempt from Art. 8 minimums'), B('75 lux 이상', '≥ 75 lux')], a: 1 }
    ]
  },
  {
    id: 'wet-bench', level: 'B', edu: [35], permits: ['chemical'], chems: ['hf', 'h2so4', 'h2o2', 'nh3', 'hcl', 'ipa'],
    t: B('웨트(세정) 장비 작업', 'Wet-bench (cleaning) work'),
    area: B('세정·습식 식각 장비', 'Cleaning and wet-etch tools'),
    hz: B(['산·알칼리 약액 접촉 (HF, H₂SO₄+H₂O₂, NH₄OH 등)', '용제 증기·인화', '약액 혼합 반응'], ['Acid/caustic contact (HF, H₂SO₄ + H₂O₂, NH₄OH, etc.)', 'Solvent vapour and flammability', 'Reactions from mixing chemicals']),
    legal: [B('OSHA — 세정 공정: 용제, 산(HF·H₂SO₄·H₂O₂·HCl·HNO₃ 및 혼합), 알칼리(NH₄OH)', 'OSHA — cleaning: solvents, acids (HF, H₂SO₄, H₂O₂, HCl, HNO₃, mixtures), caustic NH₄OH'),
            B('KOSHA P-16-2012 — 반도체 제조설비 화재 방지 및 방호', 'KOSHA P-16-2012 — fire prevention for semiconductor equipment')],
    src: ['oshaSemi', 'koshaGuide'], kosha: ['P-16-2012', 'C-C-65-2026', 'P-167-2020'],
    steps: [
      { s: B('약액·배스 확인', 'Check chemicals and baths'), h: B('약액 오인', 'Wrong chemical'), c: B('배스별 약액·농도·온도 표시 확인', 'Read each bath’s chemical, concentration and temperature'), b: 'gp' },
      { s: B('배기·보호구', 'Exhaust and PPE'), h: B('증기 흡입·접촉', 'Vapour, contact'), c: B('배기 정상 확인, 내화학 보호구 착용', 'Confirm exhaust; wear chemical PPE'), b: 'guide' },
      { s: B('약액 보충·교체', 'Top-up or change'), h: B('혼합 반응·비산', 'Reaction, splashing'), c: B('지정 약액만 지정 배스에, 이종 약액 혼합 금지', 'Only the specified chemical in the specified bath; never mix'), b: 'gp' },
      { s: B('정비 전 배수·세척', 'Drain and rinse before maintenance'), h: B('잔류 약액', 'Residual chemical'), c: B('배수·세척·중화 확인 후 정비', 'Drain, rinse and confirm neutral before maintenance'), b: 'gp' }
    ],
    stop: B(['배기 이상', '약액 표시 불일치', '누출·비산'], ['Exhaust fault', 'Label mismatch', 'Leak or splash']),
    emer: B(['접촉 시 즉시 긴급 샤워·세안 후 의료 인계', '화재 시 소화설비 작동 확인, 대피'], ['On contact, use the safety shower/eyewash and get medical care', 'In a fire, confirm suppression and evacuate']),
    card: { do: B(['배스 표시 읽기', '세안기 위치 확인', '보호구 착용'], ['Read bath labels', 'Know the eyewash', 'Wear PPE']),
            dont: B(['약액 섞기', '배기 멈춘 채 작업', '맨손으로 웨이퍼 캐리어 잡기'], ['Mix chemicals', 'Work with exhaust off', 'Handle carriers bare-handed']) },
    quiz: [
      { q: B('OSHA가 세정 공정의 대표 알칼리로 든 물질은?', 'OSHA’s example caustic in cleaning is…'), o: [B('NH₄OH', 'NH₄OH'), B('HF', 'HF'), B('IPA', 'IPA')], a: 0 }
    ]
  },

  /* ---------- 3단계(2026-09-24) — 법령·KOSHA 원문과 정부 재해조사보고서로 확인한 6종 ---------- */
  {
    id: 'xray', level: 'A', edu: [33], permits: ['radiation', 'electrical'], chems: [],
    t: B('X선 분석장비·이온주입기 정비 (방사선발생장치)', 'Servicing X-ray analysers and ion implanters (radiation generators)'),
    area: B('X선 형광·회절분석 장비(막 두께·성분 측정), 가속이온주입기 — 원자력안전법의 방사선발생장치', 'X-ray fluorescence and diffraction tools (film thickness, composition) and ion implanters — radiation generators under the Nuclear Safety Act'),
    hz: B(['차폐체를 떼거나 인터락이 무력화되면 국소 고선량 X선 피폭 (2024 기흥 사건: 손 피부 94 Sv)', '고전압', '이온주입기 내부의 비소·아르신·포스핀 등 반응 부산물'], ['High local X-ray dose if shields come off or interlocks are defeated (Giheung 2024: 94 Sv to the hand skin)', 'High voltage', 'Arsenic, arsine, phosphine and other reaction residues inside implanters']),
    legal: [B('원자력안전법 제53조②·시행규칙 제66조 — X선 형광분석용·X선 회절분석용·가속이온주입용 장치가 자체 차폐되고 최대전압 170kV 이하, 표면방사선량률 10μSv/h 이하이면 사용 신고, 그 밖에는 허가', 'Nuclear Safety Act Art. 53(2); Rule Art. 66 — X-ray fluorescence, X-ray diffraction and ion-implant generators that are self-shielded, ≤ 170 kV and ≤ 10 μSv/h at the surface are notified; all others need a licence'),
            B('시행령 제82조의3 — 허가·신고사용자 모두 사업소마다 방사선안전관리자를 선임하고 사용 개시 전 신고', 'Decree Art. 82-3 — both licensed and notified users appoint a radiation safety officer for each site and report it before use'),
            B('법 제59조① — 허가·신고사용자는 원자력안전위원회규칙의 기술기준 준수. 원안위는 2024 기흥 사건에서 연동장치(인터락) 임의 해제를 기술기준 위반으로 판단', 'Act Art. 59(1) — licensed and notified users follow the NSSC technical standards; in the 2024 Giheung case the NSSC ruled that defeating the interlock breached them'),
            B('법 제91조·시행령 별표1 — 선량한도: 방사선작업종사자 유효선량 연 50mSv(5년 100mSv), 수정체 연 150mSv, 손·발·피부 연 500mSv / 수시출입자 연 6mSv / 그 밖의 사람 연 1mSv. 측정·건강진단·피폭관리는 허가사용자 의무(신고사용자 제외)', 'Act Art. 91; Decree Annex 1 — dose limits: radiation workers 50 mSv/yr effective (100 mSv over 5 years), lens 150 mSv/yr, hands, feet and skin 500 mSv/yr / frequent visitors 6 mSv/yr / others 1 mSv/yr. Dosimetry, health checks and dose control are duties of licensed users (not notified users)'),
            B('법 제106조·시행령 제148조 — 허가사용자는 방사선작업종사자 신규(작업 전)·정기 교육, 신고사용자는 방사선안전관리자 정기교육. 2027.1.1부터 개정 제106조 시행: 방사선안전관리자 기본교육, 방사선작업종사자 기본교육·직장교육, 관리구역 출입자 직장교육 또는 안전수칙 교육(신고사용자는 방사선안전관리자만), 방사선안전관리자는 방사선작업종사자 중에서 선임(제53조의3)', 'Act Art. 106; Decree Art. 148 — licensed users train radiation workers before work and periodically; notified users train the radiation safety officer periodically. From 2027-01-01 the amended Art. 106 applies: basic training for the officer, basic plus workplace training for radiation workers, workplace or safety-rule training for others entering controlled areas (notified users: the officer only); the officer must be a radiation worker (Art. 53-3)'),
            B('안전보건규칙 제574조①1·제575조·제576조 — X선 장치 사용·검사 업무: 차폐·경보 등 조치, 방사선관리구역 지정·게시·관계자 외 출입금지, 전용 장치실(차폐 구조이면 예외)', 'OSH Standards Rules Arts. 574(1)1, 575, 576 — X-ray work: shielding and alarms, a posted radiation control area closed to others, a dedicated room unless the unit is itself shielded')],
    src: ['lawNsa', 'lawNsaDecree', 'lawNsaRule', 'lawStd', 'lawRule', 'nsscSamsung'], kosha: ['H-62-2021'],
    steps: [
      { s: B('장비 구분·책임자 확인', 'Check the device class and the officer'), h: B('관리 체계 밖의 정비', 'Maintenance outside the control system'), c: B('신고·허가 장비인지, 방사선안전관리자가 누구인지 확인하고 제조사·판매사 정비 절차서를 준비', 'Confirm whether the device is notified or licensed and who the radiation safety officer is; get the maker’s or vendor’s service procedure'), b: 'law:원자력안전법 제53조②, 영 제82조의3|Nuclear Safety Act 53(2); Decree 82-3' },
      { s: B('방사선안전관리자 검토·승인', 'Radiation safety officer approves'), h: B('처음 하는 작업을 절차 없이 진행', 'First-time work without a procedure'), c: B('정비 범위·방법을 방사선안전관리자가 검토·승인한 뒤 착수 (원안위가 기흥 사건 뒤 요구)', 'Start only after the radiation safety officer has reviewed and approved the scope and method (required by the NSSC after Giheung)'), b: 'guide' },
      { s: B('X선 전원 차단·잠금', 'Isolate and lock the X-ray supply'), h: B('정비 중 X선 발생', 'X-rays generated during work'), c: B('X선 전원을 차단·잠금·표지한 상태가 정비 진입조건. 전원이 필요한 작업은 제작사·판매사 전문 인력에게 맡김', 'X-ray power isolated, locked and tagged is the entry condition; hand any powered work to the maker or vendor'), b: 'law:안전보건규칙 제92조②|Standards Rules Art. 92(2)' },
      { s: B('인터락·경고등 확인', 'Check interlocks and warning lights'), h: B('인터락 무력화', 'Defeated interlock'), c: B('인터락이 작동하는지 확인하고 배선·스위치를 절대 우회하지 않음. 경고등은 멀리서도 보여야 함', 'Prove the interlock works and never bypass its wiring or switches; the warning light must be visible from a distance'), b: 'law:원자력안전법 제59조①|Nuclear Safety Act 59(1)' },
      { s: B('관리구역 설정', 'Set the control area'), h: B('관계자 외 출입', 'Others walking in'), c: B('방사선관리구역을 정하고 선량계 착용·주의사항·응급조치를 게시, 관계자 외 출입 금지', 'Mark the radiation control area, post dosimeter, precaution and first-aid notices, keep others out'), b: 'law:안전보건규칙 제575조|Standards Rules Art. 575' },
      { s: B('선량계 착용', 'Wear dosimeters'), h: B('피폭량 파악 불가', 'Dose unknown'), c: B('정비작업자 개인선량계 착용 (기흥 사건 뒤 사업자 시정조치)', 'Maintenance staff wear personal dosimeters (operator’s corrective action after Giheung)'), b: 'guide' },
      { s: B('복구·누설 확인', 'Restore and check leakage'), h: B('차폐 누락', 'Shielding left open'), c: B('차폐 부품 복구 후 인터락 재시험, 표면 선량률 측정·기록 뒤 가동 (신고 장비 기준 10μSv/h 이하)', 'Refit shielding, re-test the interlock, measure and record surface dose rate before use (≤ 10 μSv/h for notified devices)'), b: 'gp' }
    ],
    stop: B(['인터락 작동을 확인할 수 없음', '경고등·표시등 이상', '방사선안전관리자 승인 없음', '제조사·판매사 절차서가 없는 첫 작업'], ['Interlock cannot be proven', 'Warning or status light fault', 'No approval from the radiation safety officer', 'First-time job with no maker or vendor procedure']),
    emer: B(['피폭이 의심되면 즉시 전원 차단·작업 중지하고 방사선안전관리자에게 보고', '피부 발적·부종은 늦게 나타날 수 있으므로 증상이 없어도 진료', '원인을 확인하기 전 장비 재가동 금지'], ['If exposure is suspected, cut power, stop and report to the radiation safety officer', 'Redness or swelling can appear late — see a doctor even without symptoms', 'Do not restart the device until the cause is known']),
    card: { do: B(['X선 전원 차단·잠금 확인', '인터락·경고등 작동 확인', '개인선량계 착용'], ['Confirm X-ray power is isolated and locked', 'Prove the interlock and warning light', 'Wear a dosimeter']),
            dont: B(['인터락 우회·배선 변경', '전원이 켜진 채 차폐체 분리', '승인 없이 처음 하는 정비'], ['Bypass or rewire an interlock', 'Remove shielding with power on', 'Do first-time work without approval']) },
    quiz: [
      { q: B('신고 대상 X선 분석장치의 표면방사선량률 기준은?', 'Surface dose-rate limit for a notified X-ray analyser?'), o: [B('시간당 1μSv 이하', '≤ 1 μSv/h'), B('시간당 10μSv 이하', '≤ 10 μSv/h'), B('시간당 100μSv 이하', '≤ 100 μSv/h')], a: 1 },
      { q: B('방사선작업종사자의 연간 유효선량한도(5년 100mSv 이내)는?', 'Annual effective dose limit for radiation workers (within 100 mSv over 5 years)?'), o: [B('1mSv', '1 mSv'), B('6mSv', '6 mSv'), B('50mSv', '50 mSv')], a: 2 },
      { q: B('인터락이 작동하지 않으면?', 'If the interlock does not work…'), o: [B('작업을 멈추고 보고한다', 'Stop and report'), B('배선을 바꿔 작동시킨다', 'Rewire it to make it work'), B('조심해서 계속한다', 'Carry on carefully')], a: 0 }
    ]
  },
  {
    id: 'crane', level: 'A', edu: [14], permits: ['lifting'], chems: [],
    t: B('크레인·호이스트 작업', 'Crane and hoist work'),
    area: B('유틸리티동·반입구·정비장의 천장크레인·호이스트, 장비 반입용 크레인', 'Overhead cranes and hoists in utility buildings, loading bays and workshops; cranes for tool move-in'),
    hz: B(['인양물 낙하·충돌', '달기구·와이어로프 파단', '과부하·권과로 인한 전도·파손', '주행 크레인과 작업자 접촉'], ['Dropped or swinging loads', 'Broken rigging or wire rope', 'Overload or over-hoisting damage', 'Travelling cranes striking people']),
    legal: [B('안전보건규칙 제133조·제134조·제135조 — 정격하중·운전속도·경고 표시, 과부하방지·권과방지(훅 윗면과 권상장치 간격 0.25m 이상)·비상정지·제동장치 조정, 정격하중 초과 금지', 'OSH Standards Rules Arts. 133–135 — rated load, speed and warnings posted; overload limiter, over-hoist limiter (≥ 0.25 m clearance), emergency stop and brakes set; never exceed the rated load'),
            B('제137조·제146조① — 해지장치 사용, 하물 끌기·고정물 분리 금지, 위험물 용기는 보관함에 담아 운반, 인양물이 작업자 머리 위로 지나가지 않게 출입 통제, 하물이 보이지 않으면 신호수 없이 동작 금지', 'Arts. 137, 146(1) — use hook latches; no dragging loads or pulling fixed objects; carry hazardous containers in a cradle; keep people from under the load; no movement without a signaller when the load is out of sight'),
            B('제146조② — 조종석 없는 크레인은 고시 기준에 맞는 무선원격제어기·펜던트 스위치를 쓰고 조작자에게 안전조작을 주지', 'Art. 146(2) — cab-less cranes use compliant radio remotes or pendants, and operators are taught safe operation'),
            B('제163조·제168조 — 달기구 안전계수: 화물용 와이어로프·체인 5 이상, 훅·샤클·클램프·리프팅 빔 3 이상. 변형·균열 있는 훅·샤클 사용 금지', 'Arts. 163, 168 — rigging safety factors: 5 for wire ropes and chains carrying loads, 3 for hooks, shackles, clamps and lifting beams; no deformed or cracked hooks or shackles'),
            B('제35조②·별표3 제4호 — 작업 시작 전 권과방지장치·브레이크·클러치·운전장치 기능, 주행로·트롤리 레일, 와이어로프 통과부 점검 / 제40조 신호방법', 'Art. 35(2), Annex 3 item 4 — before work, check limiters, brakes, clutches, controls, runway and trolley rails and rope paths / Art. 40 signals'),
            B('산안법 시행령 제78조①3·시행규칙 제126조 — 정격하중 2톤 이상 크레인은 안전검사: 설치 후 3년 이내 최초, 이후 2년마다(건설현장 6개월마다)', 'OSH Decree Art. 78(1)3; Rule Art. 126 — cranes rated 2 t or more need safety inspection: within 3 years of installation, then every 2 years (every 6 months on construction sites)')],
    src: ['lawStd', 'lawDecree', 'lawRule', 'koshaSop3'], kosha: ['B-M-34-2026', 'B-M-12-2025', 'B-M-7-2025'],
    steps: [
      { s: B('작업 전 점검', 'Pre-use check'), h: B('방호장치 고장', 'Failed safety devices'), c: B('권과방지장치·브레이크·클러치·운전장치, 주행로·레일, 와이어로프 통과부 점검', 'Check limiters, brakes, clutches, controls, runway and rails, and rope paths'), b: 'law:35②·별표3 4|35(2), Annex 3 item 4' },
      { s: B('정격하중·달기구 확인', 'Rated load and rigging'), h: B('과부하·달기구 파단', 'Overload, rigging failure'), c: B('인양물 무게와 정격하중 비교, 달기구 표식·안전계수·변형 확인', 'Compare load weight with the rating; check rigging markings, safety factors and deformation'), b: 'law:135·163·168' },
      { s: B('인양 구역 통제·신호', 'Control the area and signals'), h: B('머리 위 인양물 통과', 'Loads passing over people'), c: B('출입 통제선 설치, 신호방법을 정하고 신호수 지정', 'Barricade the area, agree signals and name a signaller'), b: 'law:146①4·40|146(1)4, 40' },
      { s: B('걸기·시험 인양', 'Hook up and trial lift'), h: B('훅 이탈·편하중', 'Hook slip, off-centre load'), c: B('해지장치 사용, 끌거나 고정물 분리 금지, 지면에서 살짝 들어 균형·제동 확인', 'Use the latch; no dragging or pulling fixed items; lift just clear to check balance and brakes'), b: 'law:137·146①1·3|137, 146(1)1, 3' },
      { s: B('인양·이동', 'Lift and travel'), h: B('시야 밖 동작', 'Moving blind'), c: B('하물이 보이지 않으면 신호수 신호로만 동작, 위험물 용기는 보관함에 담아 운반', 'If the load is out of sight, move only on the signaller’s signal; carry hazardous containers in a cradle'), b: 'law:146①2·5|146(1)2, 5' },
      { s: B('정리·기록', 'Park and record'), h: B('매달린 채 방치', 'Load left hanging'), c: B('하물을 내려놓고 훅을 올려 정위치, 이상 사항 기록·보고', 'Land the load, raise and park the hook, record and report defects'), b: 'gp' }
    ],
    stop: B(['방호장치·브레이크 이상', '정격하중을 넘거나 무게를 모름', '인양 구역에 사람이 있음', '신호가 끊김'], ['Faulty limiter or brake', 'Load over the rating or unknown', 'People in the lift zone', 'Signals lost']),
    emer: B(['비상정지로 즉시 정지, 하물 아래에서 대피', '끼임·충돌 시 추가 동작 금지 후 구조 요청'], ['Hit the emergency stop and clear from under the load', 'After a crush or strike, stop all movement and call rescue']),
    card: { do: B(['정격하중 표시 확인', '해지장치 확인', '신호수와 신호 맞추기'], ['Read the rated load', 'Check the hook latch', 'Agree signals with the signaller']),
            dont: B(['하물 밑으로 지나가기', '하물을 끌거나 고정물 뜯기', '변형된 훅·샤클 사용'], ['Walk under the load', 'Drag loads or pull fixed items', 'Use a bent hook or shackle']) },
    quiz: [
      { q: B('화물을 직접 지지하는 와이어로프의 안전계수 기준은?', 'Safety factor for a wire rope carrying the load directly?'), o: [B('3 이상', '≥ 3'), B('5 이상', '≥ 5'), B('10 이상', '≥ 10')], a: 1 },
      { q: B('안전검사 대상 크레인의 정기 검사 주기(건설현장 외)는?', 'Periodic inspection interval for cranes outside construction sites?'), o: [B('매년', 'Every year'), B('2년마다', 'Every 2 years'), B('5년마다', 'Every 5 years')], a: 1 }
    ]
  },
  {
    id: 'live-elec', level: 'A', edu: [17], permits: ['electrical'], chems: [],
    t: B('충전전로 근접 전기작업 (수변전·배전반)', 'Electrical work near live parts (substations and switchboards)'),
    area: B('유틸리티동 특고압 수변전실, 배전반·MCC, 전기실 안에서 하는 비전기 작업(방화재·배관 등)', 'High-voltage substations in utility buildings, switchboards and MCCs, and non-electrical work inside electrical rooms (fire-stopping, piping)'),
    hz: B(['충전부 접촉·접근에 의한 감전', '아크(Arc) 화상·폭발', '전기실 안 비전기 작업자의 무심코 한 접근'], ['Shock from touching or approaching live parts', 'Arc burns and blast', 'Non-electrical workers straying close inside electrical rooms']),
    legal: [B('안전보건규칙 제319조① — 노출 충전부나 그 부근 작업은 먼저 전로 차단. 예외: 생명유지·비상경보·폭발위험장소 환기·비상조명 등 정지로 위험이 커지는 경우, 설계상 차단 불가, 감전·아크 위험이 없다고 확인된 경우', 'OSH Standards Rules Art. 319(1) — isolate before working on or near exposed live parts. Exceptions: where stopping life-support, alarms, hazardous-area ventilation or emergency lighting raises the risk; where design prevents isolation; where no shock or arc risk is confirmed'),
            B('제318조 — 전기작업은 자격·면허·경험을 갖춘 유자격자만', 'Art. 318 — electrical work only by qualified persons'),
            B('제321조①8 — 유자격자 접근한계거리(선간전압): 0.3kV 이하 접촉금지, 0.75kV 이하 30cm, 2kV 이하 45cm, 15kV 이하 60cm, 37kV 이하 90cm, 88kV 이하 110cm, 121kV 이하 130cm, 145kV 이하 150cm, 169kV 이하 170cm, 242kV 이하 230cm, 362kV 이하 380cm, 550kV 이하 550cm, 800kV 이하 790cm', 'Art. 321(1)8 — approach limits for qualified workers (line voltage): ≤ 0.3 kV no contact, ≤ 0.75 kV 30 cm, ≤ 2 kV 45 cm, ≤ 15 kV 60 cm, ≤ 37 kV 90 cm, ≤ 88 kV 110 cm, ≤ 121 kV 130 cm, ≤ 145 kV 150 cm, ≤ 169 kV 170 cm, ≤ 242 kV 230 cm, ≤ 362 kV 380 cm, ≤ 550 kV 550 cm, ≤ 800 kV 790 cm'),
            B('제321조①7·② — 유자격자가 아닌 근로자는 대지전압 50kV 이하 충전전로에 300cm 이내 접근 금지, 울타리·감시인', 'Art. 321(1)7, (2) — non-qualified workers keep 300 cm from circuits up to 50 kV to earth; fences or watchers'),
            B('제323조 — 절연용 보호구·방호구·활선작업용 기구를 용도에 맞게 쓰고 정기적으로 성능 확인', 'Art. 323 — use suitable insulating PPE, covers and live-work tools and check them regularly'),
            B('제38조①5·별표4 제5호 — 50V 또는 250VA를 넘는 전기작업은 작업계획서(작업책임자, 접근한계거리, 전로차단·재투입 절차, 절연용 보호구 등)', 'Art. 38(1)5, Annex 4 item 5 — a work plan for electrical work above 50 V or 250 VA (person in charge, approach limits, isolation and re-energising, insulating PPE, etc.)')],
    src: ['lawStd', 'koshaSop3', 'moelRpt'], kosha: ['B-E-11-2026', 'B-E-10-2026', 'B-E-12-2026'],
    steps: [
      { s: B('정전 가능 여부 판단', 'Can it be made dead?'), h: B('불필요한 활선 근접작업', 'Needless live work'), c: B('정전작업을 먼저 검토하고, 제319조① 예외에 해당할 때만 활선 근접작업 허가', 'Consider isolation first; allow work near live parts only under the Art. 319(1) exceptions'), b: 'law:319①' },
      { s: B('작업계획서·허가', 'Work plan and permit'), h: B('즉흥적인 간헐 작업', 'Improvised odd jobs'), c: B('작업책임자·접근한계거리·보호구·재투입 절차를 담은 작업계획서와 정전작업 허가서', 'A work plan naming the person in charge, approach limits, PPE and re-energising, plus an isolation permit'), b: 'law:38①5·별표4 5|38(1)5, Annex 4 item 5' },
      { s: B('수배전반 개방 통제', 'Control who opens panels'), h: B('마스터키로 임의 개방', 'Opening panels with a master key'), c: B('고압·특고압반은 지정 관리책임자만 열고, 전기실 안의 비전기 작업도 전기 담당이 입회', 'Only the named person opens HV panels; an electrical attendant stays with any non-electrical work in the room'), b: 'guide' },
      { s: B('접근한계거리 표시', 'Mark the approach limit'), h: B('충전부 접근', 'Getting too close'), c: B('전압별 접근한계거리를 바닥·패널에 표시하고, 비유자격자는 300cm 밖에 두며 울타리·감시인 배치', 'Mark the limit for the voltage on the floor or panel; keep unqualified people 300 cm away with fences or a watcher'), b: 'law:321①7·8·②·③|321(1)7–8, (2), (3)' },
      { s: B('보호구·방호구', 'PPE and covers'), h: B('아크 화상', 'Arc burns'), c: B('절연장갑·절연소매, 난연·방염 작업복, 절연용 방호구 — 사용 전 손상 확인', 'Insulating gloves and sleeves, flame-resistant clothing, insulating covers — checked before use'), b: 'law:321①3·4·323|321(1)3–4, 323' },
      { s: B('유자격자 작업', 'Qualified persons only'), h: B('무자격 작업', 'Unqualified work'), c: B('유자격자가 활선작업용 기구·장치로 작업하고, 고압 이상은 활선작업용 기구 사용', 'Qualified staff do the job with live-work tools, which are mandatory at high voltage'), b: 'law:318·321①5|318, 321(1)5' }
    ],
    stop: B(['정전 가능한데 활선으로 하려 함', '접근한계거리를 지킬 공간이 없음', '절연 보호구 손상·미지급', '작업계획서·허가서 없음'], ['Live work where isolation is possible', 'No room to keep the approach limit', 'Damaged or missing insulating PPE', 'No work plan or permit']),
    emer: B(['감전자는 전원을 차단한 뒤에만 접촉하고 심폐소생술', '아크 화상은 냉각 후 즉시 병원 이송'], ['Touch a shock victim only after cutting power; start CPR', 'Cool arc burns and get to hospital at once']),
    card: { do: B(['정전 먼저 검토', '접근한계거리 확인', '절연장갑·방염복 착용'], ['Think isolation first', 'Know the approach limit', 'Wear insulating gloves and FR clothing']),
            dont: B(['마스터키로 수배전반 열기', '반코팅 장갑으로 작업', '“잠깐”이라고 계획서 생략'], ['Open switchboards with a master key', 'Work in coated cotton gloves', 'Skip the plan “because it’s quick”']) },
    quiz: [
      { q: B('선간전압 22.9kV 충전전로의 접근한계거리는?', 'Approach limit for a 22.9 kV line?'), o: [B('60cm', '60 cm'), B('90cm', '90 cm'), B('110cm', '110 cm')], a: 1 },
      { q: B('전기작업 작업계획서가 필요한 기준은?', 'When is an electrical work plan required?'), o: [B('50V 또는 250VA 초과', 'Above 50 V or 250 VA'), B('380V 이상만', 'Only 380 V and up'), B('특고압만', 'Only extra-high voltage')], a: 0 }
    ]
  },
  {
    id: 'forklift', level: 'B', edu: [13], permits: [], chems: [],
    t: B('지게차 하역·운반', 'Forklift loading and transport'),
    area: B('반입구·자재창고·약품·가스 하역장, 건설 현장 자재 운반 (AGV·무인운반차는 별도 조항이 없어 제조사 기준·위험성평가로 관리)', 'Loading bays, stores, chemical and gas docks, site material handling (AGVs have no dedicated article — manage them by the maker’s rules and risk assessment)'),
    hz: B(['보행자 충돌', '적재물 낙하·붕괴', '전도', '마스트·백레스트 끼임', '경사로 밀림'], ['Striking pedestrians', 'Falling or collapsing loads', 'Tip-over', 'Crushing at the mast or backrest', 'Rolling away on slopes']),
    legal: [B('안전보건규칙 제38조①2·별표4 제2호·제39조 — 작업계획서(추락·낙하·전도·협착·붕괴 예방대책, 운행경로·작업방법)와 작업지휘자', 'OSH Standards Rules Art. 38(1)2, Annex 4 item 2, Art. 39 — a work plan (falls, falling objects, tip-over, crushing, collapse; route and method) and a work leader'),
            B('제172조·제173조·제178조 — 접촉 위험 장소 출입 금지(작업지휘자·유도자 배치 시 예외), 편하중·시야 가림 적재 금지, 허용하중·최대적재량 초과 금지', 'Arts. 172, 173, 178 — keep people out of the danger zone (unless a work leader or banksman guides); no off-centre or view-blocking loads; never exceed the rated or maximum load'),
            B('제175조 — 주된 용도(적재·하역) 외 사용 제한', 'Art. 175 — use only for loading and unloading'),
            B('제179조~제183조 — 전조등·후미등, 후진경보기·경광등 또는 후방감지기, 헤드가드, 백레스트, 적합한 팔레트, 좌석 안전띠 착용', 'Arts. 179–183 — head and tail lights, reversing alarm and beacon or rear sensors, head guard, backrest, sound pallets, seat belts'),
            B('제99조 — 운전위치 이탈 시 포크를 가장 낮은 위치·지면에 내리고, 원동기 정지·브레이크, 시동키 분리', 'Art. 99 — before leaving the seat, lower the forks to the floor, stop the engine and brake, remove the key'),
            B('제35조②·별표3 제9호 — 작업 시작 전 제동·조종장치, 하역·유압장치, 바퀴, 전조등·후미등·방향지시기·경보장치 점검', 'Art. 35(2), Annex 3 item 9 — pre-use check of brakes, controls, lifting and hydraulics, wheels, lights, indicators and alarms')],
    src: ['lawStd', 'lawRule', 'koshaSop3', 'moelRpt'], kosha: ['B-M-11-2025'],
    steps: [
      { s: B('작업 전 점검', 'Pre-use check'), h: B('제동·조종장치 이상', 'Brake or control faults'), c: B('제동·조종장치, 하역·유압장치, 바퀴, 등화·경보장치 점검. 조작레버를 묶는 등 임의 개조 금지', 'Check brakes, controls, lifting and hydraulics, wheels, lights and alarms; no tampering such as tying levers down'), b: 'law:35②·별표3 9|35(2), Annex 3 item 9' },
      { s: B('작업계획서·지휘자', 'Work plan and leader'), h: B('경로·방법 미정', 'Route and method undecided'), c: B('운행경로·작업방법·위험 예방대책을 정한 작업계획서와 작업지휘자 지정', 'Write a plan with route, method and controls; name a work leader'), b: 'law:38①2·39|38(1)2, 39' },
      { s: B('보행자 분리', 'Separate pedestrians'), h: B('보행자 충돌', 'Striking people'), c: B('보행로·운행로 분리, 위험 장소 출입 금지, 필요 시 유도자 배치', 'Separate walkways from routes; keep people out; post a banksman where needed'), b: 'law:172' },
      { s: B('적재', 'Load'), h: B('낙하·전도', 'Dropped load, tip-over'), c: B('허용하중 이내, 편하중·시야 가림 없이 적재, 적합한 팔레트 사용', 'Stay within the rating; no off-centre or view-blocking loads; use sound pallets'), b: 'law:173·178·182' },
      { s: B('운행', 'Travel'), h: B('사람을 태운 사용', 'Carrying people'), c: B('적재·하역 외 용도 금지 — 사람을 포크·팔레트에 태워 올리지 않고 고소작업은 고소작업대 사용', 'Loading and unloading only — never lift people on forks or pallets; use an aerial platform for work at height'), b: 'law:175' },
      { s: B('운전석 이탈', 'Leaving the seat'), h: B('경사로 밀림 끼임', 'Rolling away and crushing'), c: B('포크를 바닥에 내리고 원동기 정지·주차브레이크, 경사로는 고임목, 시동키 분리', 'Forks on the floor, engine off, parking brake on, chocks on slopes, key out'), b: 'law:99' }
    ],
    stop: B(['제동·조종장치 이상 또는 임의 개조', '보행자와 운행로가 분리되지 않음', '허용하중을 넘거나 시야를 가리는 적재', '사람을 태우라는 요구'], ['Brake or control fault or tampering', 'No separation from pedestrians', 'Over-rated or view-blocking load', 'Asked to lift a person']),
    emer: B(['충돌·끼임 시 무리하게 지게차를 움직이지 말고 즉시 구조 요청', '전도·적재물 붕괴 시 주변 작업을 멈추고 2차 붕괴에 대비해 구역 통제'], ['After a strike or crush, do not move the truck hastily; call rescue at once', 'After a tip-over or load collapse, stop nearby work and cordon off against a second collapse']),
    card: { do: B(['작업 전 점검표 확인', '안전띠 착용', '내릴 때 포크 바닥·브레이크'], ['Do the pre-use check', 'Wear the seat belt', 'Forks down and brake on before leaving']),
            dont: B(['포크·팔레트에 사람 태우기', '조작레버 묶어 두기', '무자격자 운전 (KOSHA B-M-11 핵심안전조치)'], ['Lift people on forks or pallets', 'Tie control levers down', 'Let unqualified people drive (KOSHA B-M-11 key measures)']) },
    quiz: [
      { q: B('운전위치를 이탈할 때 포크는?', 'Before leaving the seat, the forks go…'), o: [B('가장 낮은 위치·지면에', 'To the lowest position / floor'), B('운반 높이 그대로', 'Stay at travel height'), B('최대 높이로', 'Fully raised')], a: 0 },
      { q: B('작업자를 높은 곳에 올려야 할 때 맞는 방법은?', 'You need to lift a worker to a high shelf. Use…'), o: [B('포크 위 팔레트', 'A pallet on the forks'), B('고소작업대·계단식 작업대', 'An aerial platform or step platform'), B('포크 끝', 'The fork tips')], a: 1 }
    ]
  },
  {
    id: 'eyewash', level: 'B', edu: [], permits: [], chems: ['hf', 'h2so4', 'naoh', 'tmah'],
    t: B('비상샤워·세안설비 점검', 'Emergency shower and eyewash checks'),
    area: B('약품 공급실·습식 공정·하역장·실험실 등 부식성·자극성 물질 취급 장소', 'Chemical supply rooms, wet benches, unloading bays, laboratories and other places handling corrosive or irritant substances'),
    hz: B(['설비 고장·차단밸브 잠김으로 노출 직후 세척 불가', '녹물·찌꺼기로 2차 오염', '너무 뜨겁거나 찬 세척수'], ['No flushing right after exposure because of a fault or a closed isolation valve', 'Rust or sediment contaminating the eyes', 'Water that is too hot or cold']),
    legal: [B('안전보건규칙 제451조③ — 관리대상 유해물질이 피부·눈에 직접 닿을 우려가 있으면 즉시 물로 씻어낼 수 있는 세척시설 설치', 'OSH Standards Rules Art. 451(3) — where controlled substances could reach the skin or eyes, provide facilities to wash them off at once'),
            B('제465조 — 허가대상 유해물질 작업장에 긴급 세척시설·세안설비를 두고, 배관 찌꺼기·녹물 없이 맑은 물이 나오도록 유지', 'Art. 465 — emergency showers and eyewash where licensed substances are used, kept delivering clear water free of rust and sediment'),
            B('PSM 고시 제23조 제8호 — 공정안전보고서 배치도에 세척·세안시설 설치계획·배치 포함', 'PSM Notice Art. 23(8) — the PSM layout includes the plan and locations of showers and eyewash'),
            B('KOSHA C-C-16-2026 — 긴급샤워: 분당 80L 이상, 꼭지 높이 210~240cm, 150cm 높이에서 지름 50cm 이상 분사, 반경 45cm 방해물 금지, 조작밸브 1초 내 개방·유지, 10초 이내 도달, 층마다, 수온 40℃ 이하 / 세안설비: 분당 1.5L 이상 양안 동시, 노즐 85~115cm, 강산·강염기는 바로 옆, 수압 0.21MPa 이상, 차단밸브는 열린 상태로 시건', 'KOSHA C-C-16-2026 — showers: ≥ 80 L/min, head at 210–240 cm, ≥ 50 cm spray at 150 cm, 45 cm clear radius, valve opens within 1 s and stays open, reachable within 10 s, on every floor, water ≤ 40 °C / eyewash: ≥ 1.5 L/min to both eyes, nozzles at 85–115 cm, right next to strong acids or bases, ≥ 0.21 MPa, supply valve locked open')],
    src: ['lawStd', 'moelPsm', 'koshaSop3'], kosha: ['C-C-16-2026'],
    steps: [
      { s: B('위치·접근성', 'Location and access'), h: B('도달 지연', 'Delayed access'), c: B('취급 장소에서 10초 이내(강산·강염기는 바로 옆)에 있고, 층마다 설치, 통로·샤워 반경 45cm·세안기 주위 15cm에 방해물 없음, 안내표지 부착', 'Within 10 s of the hazard (right next to strong acids or bases), on every floor, clear path, 45 cm clear around showers and 15 cm around eyewash, signs posted'), b: 'kosha:C-C-16-2026 5.1(3)·5.5·6.4' },
      { s: B('작동 확인', 'Function check'), h: B('밸브 고착', 'Stuck valve'), c: B('조작밸브를 한 번에 열어 1초 안에 열리고 손을 떼도 계속 나오는지 확인, 공급 차단밸브는 열린 상태로 시건', 'Open the valve in one action — it must open within 1 s and stay open hands-free; supply isolation valve locked open'), b: 'kosha:C-C-16-2026 5.2·6.2·5.5(6)' },
      { s: B('유량·분사 모양', 'Flow and pattern'), h: B('세척 부족', 'Too little water'), c: B('샤워는 분당 80L 이상·지름 50cm 이상 고르게, 세안기는 분당 1.5L 이상으로 두 물줄기가 거의 같은 높이', 'Showers ≥ 80 L/min spread ≥ 50 cm; eyewash ≥ 1.5 L/min with two streams at about the same height'), b: 'kosha:C-C-16-2026 5.1(4)·6.1(4)·6.3' },
      { s: B('수질·수온', 'Water quality and temperature'), h: B('녹물·화상·저체온', 'Rust, scalding, chilling'), c: B('맑은 물이 나올 때까지 흘려보내고, 수온 40℃ 이하·동파 방지 확인', 'Run until the water is clear; check it is ≤ 40 °C and frost-protected'), b: 'law:465' },
      { s: B('기록·보수', 'Record and repair'), h: B('불량 방치', 'Faults left'), c: B('점검 결과를 기록하고 불량은 즉시 사용금지 표시 후 보수 (점검 주기는 사내 기준으로 정함)', 'Record results; tag faulty units out of use and repair at once (set the frequency in-house)'), b: 'gp' }
    ],
    stop: B(['세척수가 나오지 않거나 약함', '녹물·이물질', '가는 길이 막힘', '차단밸브가 잠겨 있음'], ['No or weak flow', 'Rusty or dirty water', 'Blocked route', 'Supply valve closed']),
    emer: B(['눈·피부 노출 시 즉시 세척하고 오염된 옷을 벗으며 계속 씻음', '불화수소 노출은 증상이 없어도 병원 진료 (ICSC)'], ['After eye or skin contact, flush at once, remove contaminated clothing and keep flushing', 'After HF exposure, see a doctor even without symptoms (ICSC)']),
    card: { do: B(['세안기 위치를 먼저 확인', '작업 전 한 번 틀어보기', '노출되면 바로 씻기'], ['Find the eyewash first', 'Run it before work', 'Flush straight away if exposed']),
            dont: B(['세안기 앞에 물건 쌓기', '차단밸브 잠가 두기', '증상 없다고 씻기 생략'], ['Stack things in front of it', 'Leave the supply valve closed', 'Skip flushing because it doesn’t hurt']) },
    quiz: [
      { q: B('KOSHA 기준 긴급샤워의 최소 분사량은?', 'KOSHA minimum flow for an emergency shower?'), o: [B('분당 15L', '15 L/min'), B('분당 80L', '80 L/min'), B('분당 200L', '200 L/min')], a: 1 },
      { q: B('강산·강염기 취급 장소의 세안설비 위치는?', 'Where should eyewash be for strong acids or bases?'), o: [B('바로 옆', 'Right next to the work'), B('같은 층 어디든', 'Anywhere on the floor'), B('건물 입구', 'At the building entrance')], a: 0 }
    ]
  },
  {
    id: 'excavation', level: 'A', edu: [19], permits: ['excavation'], chems: [],
    t: B('굴착작업 (배관·케이블 매설, 옥외 유틸리티)', 'Excavation (burying pipes and cables, outdoor utilities)'),
    area: B('사업장 안 옥외 배관·전력선 매설, 신축·증설 현장 터파기', 'Burying pipes and power lines outdoors on site; trenching on new-build and expansion sites'),
    hz: B(['굴착면 붕괴', '매설 가스배관·전력선 파손', '굴착기 선회·후진에 의한 끼임·충돌', '추락'], ['Trench collapse', 'Damaging buried gas lines or power cables', 'Crushing or striking by a slewing or reversing excavator', 'Falls']),
    legal: [B('안전보건규칙 제38조①6·별표4 제6호 — 굴착면 2m 이상: 형상·지질·균열·함수·매설물·지하수위 사전조사, 굴착방법·순서, 장비계획, 매설물 이설·보호, 연락·신호, 흙막이·계측, 작업지휘자를 담은 작업계획서', 'OSH Standards Rules Art. 38(1)6, Annex 4 item 6 — for excavations 2 m or deeper: survey ground, cracks, water, buried services and water table; plan method, sequence, equipment, protection of services, signals, shoring and monitoring, and a work leader'),
            B('제338조~제340조 — 부석·균열·함수·동결 점검, 굴착면 기울기(모래 1:1.8, 연암·풍화암 1:1.0, 경암 1:0.5, 그 밖의 흙 1:1.2 — 별표11), 빗물 대비, 흙막이·방호망·출입금지', 'Arts. 338–340 — check for loose rock, cracks, water and frost; slope angles (sand 1:1.8, soft or weathered rock 1:1.0, hard rock 1:0.5, other soil 1:1.2 — Annex 11); rain protection; shoring, nets and exclusion'),
            B('제341조·제342조 — 매설물 보강·이설·방호(관리감독자 지휘), 굴착기계가 가스도관·지중전선로를 파손할 우려가 있으면 기계 굴착 중지', 'Arts. 341, 342 — reinforce, relocate or protect buried services under a supervisor; stop machine digging where it could damage gas pipes or underground cables'),
            B('제200조·제344조·제99조 — 굴착기 접촉 위험 장소 출입 금지(유도자 배치 시 예외), 후진·전락 우려 시 유도자, 운전석 이탈 시 버킷을 지면에 내리고 원동기 정지·시동키 분리', 'Arts. 200, 344, 99 — keep people out of the excavator’s reach unless a banksman guides; banksman for reversing or tipping risks; bucket down, engine off and key out before leaving the seat'),
            B('KOSHA C-C-49-2026 7.3(3) — 깊이 30cm 이상 굴착은 굴착작업 허가: 매설물 도면 검토, 관장 부서 확인, 매설물 주변은 수동 굴착', 'KOSHA C-C-49-2026 7.3(3) — digging 30 cm or deeper needs an excavation permit: check drawings, confirm with the owners, hand-dig near services')],
    src: ['lawStd', 'koshaCC49', 'koshaSop3', 'moelRpt'], kosha: ['D-C-11-2026', 'C-C-49-2026'],
    steps: [
      { s: B('매설물 확인·허가', 'Services check and permit'), h: B('가스배관·전력선 파손', 'Striking gas lines or cables'), c: B('도면으로 배관·전력선·계장선·통신선·접지선 위치를 검토하고 관장 부서 확인을 받아 굴착작업 허가', 'Locate pipes, power, instrument, telecom and earth cables on drawings, get the owners’ agreement and issue an excavation permit'), b: 'kosha:C-C-49-2026 7.3(3)' },
      { s: B('사전조사·작업계획서', 'Survey and work plan'), h: B('지반 조건 미파악', 'Ground not understood'), c: B('지질·균열·함수·지하수위 조사 후 굴착 방법·순서, 흙막이, 신호, 작업지휘자를 담은 작업계획서 (2m 이상)', 'Survey soil, cracks, water and water table, then plan method, sequence, shoring, signals and a work leader (2 m or deeper)'), b: 'law:38①6·별표4 6|38(1)6, Annex 4 item 6' },
      { s: B('기울기·흙막이', 'Slopes and shoring'), h: B('굴착면 붕괴', 'Collapse'), c: B('별표11 기울기 유지 또는 흙막이 설치, 빗물 측구·비닐 덮개, 작업 전 균열·함수 점검', 'Keep Annex 11 slopes or shore; drains and sheeting for rain; check cracks and water before work'), b: 'law:338·339·340' },
      { s: B('매설물 주변 수동 굴착', 'Hand-dig near services'), h: B('기계 파손', 'Machine damage'), c: B('매설물 주변은 수동으로 파고, 노출된 매설물은 방호·지지', 'Hand-dig around services and protect or support any exposed'), b: 'law:341·342' },
      { s: B('장비 반경 통제', 'Control the machine zone'), h: B('선회·후진 끼임', 'Crushed by slewing or reversing'), c: B('굴착기 선회 반경 출입 금지, 유도자 배치, 측·후방 감지장치를 끄지 않음', 'Keep people out of the slew radius, post a banksman and never switch off side and rear sensors'), b: 'law:200·344' },
      { s: B('운전석 이탈·마감', 'Leaving the seat and finishing'), h: B('장비 이동·추락', 'Machine moving, falls'), c: B('버킷을 지면에 내리고 원동기 정지·시동키 분리, 개구부 방호·되메우기', 'Bucket down, engine off, key out; guard or backfill openings'), b: 'law:99' }
    ],
    stop: B(['도면에 없는 매설물 발견', '굴착면 균열·용수', '유도자 없이 선회 반경에 사람', '가스 냄새·케이블 손상'], ['Unmapped services found', 'Cracks or water in the face', 'People in the slew radius without a banksman', 'Gas smell or cable damage']),
    emer: B(['붕괴 시 추가 붕괴에 대비해 구조자 안전 확보 후 구조', '가스배관 파손 시 즉시 대피·점화원 제거·관장 부서 신고, 케이블 손상 시 접근 금지'], ['After a collapse, make rescuers safe from further falls before rescuing', 'If a gas line is hit, evacuate, remove ignition sources and call the owner; keep away from damaged cables']),
    card: { do: B(['허가서·매설물 도면 확인', '굴착기 반경 밖에 있기', '균열·물이 보이면 알리기'], ['Check the permit and service drawings', 'Stay outside the excavator’s radius', 'Report cracks or water']),
            dont: B(['매설물 주변 기계 굴착', '굴착기와 구조물 사이 통과', '감지장치 꺼두기'], ['Machine-dig near services', 'Pass between the excavator and a structure', 'Switch off sensors']) },
    quiz: [
      { q: B('KOSHA 기준으로 굴착작업 허가가 필요한 깊이는?', 'KOSHA: an excavation permit is needed from what depth?'), o: [B('30cm 이상', '30 cm'), B('1m 이상', '1 m'), B('2m 이상', '2 m')], a: 0 },
      { q: B('별표11의 ‘그 밖의 흙’ 굴착면 기울기는?', 'Annex 11 slope for “other soil”?'), o: [B('1 : 0.5', '1 : 0.5'), B('1 : 1.2', '1 : 1.2'), B('1 : 1.8', '1 : 1.8')], a: 1 }
    ]
  }
];

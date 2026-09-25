/* 안전작업허가(PTW) — 허가 종류와 유형별 확인 항목 (2026-09-24 원문 확인)
   - 허가 종류·절차: PSM 고시 제2025-30호 제33조·제46조(src: moelPsm), KOSHA GUIDE C-C-49-2026(src: koshaCC49)
   - 법정 조치: 산업안전보건기준에 관한 규칙(src: lawStd) — 조문 번호는 각 항목의 b에 적는다
   - b 형식: 'law:한국어|English'(법령·고시), 'kosha:한국어|English'(KOSHA GUIDE 조항)
   - req: true 인 항목은 ‘발급’ 전에 반드시 확인해야 하는 항목(포털 설정). 나머지는 해당할 때 확인 */
window.SHE = window.SHE || {};
(function () {
  const B = (ko, en) => ({ ko, en });
  const I = (id, ko, en, b, req) => ({ id, ko, en, b, req: !!req });

  /* 주 허가 — C-C-49 5.1: 화기작업 허가, 일반위험작업 허가 (C-C-49-2026 = 구 P-94-2021) */
  SHE.PTW_MAIN = {
    hot: { t: B('화기작업 허가', 'Hot-work permit'),
      d: B('용접·용단·연마·드릴 등 화염이나 스파크를 내는 작업, 또는 가연성물질의 점화원이 될 수 있는 기기를 쓰는 작업', 'Welding, cutting, grinding, drilling and any other work that makes flames or sparks, or uses equipment that could ignite flammable material'),
      b: 'kosha:C-C-49 3(1)(가)·7.1|C-C-49 3(1)(a), 7.1' },
    general: { t: B('일반위험작업 허가', 'General hazardous-work permit'),
      d: B('화기작업이 아닌 위험작업 — 유해·위험물 취급, 위험설비 해체·개방, 배관 개방, 특수가스·약액 설비 정비 등. 대상 작업의 종류는 사업장이 정함', 'Hazardous work that is not hot work — handling hazardous substances, dismantling or opening hazardous equipment, line breaking, gas or chemical system maintenance. The site decides which jobs are covered'),
      b: 'kosha:C-C-49 3(1)(나)·7.2|C-C-49 3(1)(b), 7.2' }
  };

  /* 보충적인 작업허가 — C-C-49 5.1(3): 화기·일반위험 허가와 함께 발급 */
  SHE.PTW_SUPP = {
    confined: { t: B('밀폐공간 출입', 'Confined-space entry'), d: B('안전보건규칙 제618조 제1호(별표18)의 장소, 가열로·건조기 내부 등', 'Places in Annex 18 of the Standards Rules (Art. 618(1)), furnace and dryer interiors, etc.'), b: 'kosha:C-C-49 7.3(1)|C-C-49 7.3(1)', sop: 'confined', edu: 34 },
    electrical: { t: B('정전작업', 'Electrical isolation'), d: B('전기설비 불꽃이 점화원이 되거나 감전 위험이 있는 전기 구동기계·전기회로 작업', 'Work on electrical drives or circuits where sparks could ignite material or where there is a shock risk'), b: 'kosha:C-C-49 7.3(2)|C-C-49 7.3(2)', sop: 'loto', edu: 17 },
    excavation: { t: B('굴착작업', 'Excavation'), d: B('깊이 30cm 이상 지반을 파고 배관·케이블 등 지하 매설작업을 하는 경우', 'Digging 30 cm or deeper, e.g. to lay pipes or cables'), b: 'kosha:C-C-49 7.3(3)|C-C-49 7.3(3)' },
    radiation: { t: B('방사선 사용작업', 'Radiation work'), d: B('방사선으로 기기를 점검하거나 비파괴검사를 하는 경우', 'Using radiation to inspect equipment or for non-destructive testing'), b: 'kosha:C-C-49 7.3(4)|C-C-49 7.3(4)', sop: 'implant', edu: 33 },
    height: { t: B('고소작업', 'Work at height'), d: B('2m 이상 높이의 정비·점검·도장·보온, 또는 2m 미만이라도 고열물·강산 등 위험물 위에서 하는 작업', 'Maintenance, inspection, painting or insulation at 2 m or more, or work above hot material, strong acids and the like even below 2 m'), b: 'kosha:C-C-49 7.3(5)|C-C-49 7.3(5)', sop: 'height' },
    heavy: { t: B('중장비 사용작업', 'Heavy equipment'), d: B('이동식 크레인 등으로 중량물을 들어 올려 설치·교체·정비·충전물 교체 등을 하는 작업', 'Lifting loads with mobile cranes or similar to install, replace or service equipment'), b: 'kosha:C-C-49 7.3(6)|C-C-49 7.3(6)', sop: 'equip-move', edu: 14 }
  };

  /* SOP의 허가 유형 → 작업허가서 유형 */
  SHE.PTW_FROM_SOP = { hot: ['hot'], confined: ['confined'], electrical: ['electrical'], height: ['height'], lifting: ['heavy'], linebreak: ['general'], chemical: ['general'], gas: ['general'], radiation: ['radiation'], excavation: ['excavation'] };

  /* 작업허가 전 점검사항 — C-C-49 6.1 (1)~(14). s: 해당하면 필요한 보충 허가 */
  SHE.PTW_PRE = [
    I('p1', '수행 작업이 밀폐공간 안에서 이루어지는가', 'Is the work inside a confined space?', 'kosha:C-C-49 6.1(1)|C-C-49 6.1(1)'),
    I('p2', '안전상 정전(전기 차단)이 필요한가', 'Does the work need electrical isolation?', 'kosha:C-C-49 6.1(2)|C-C-49 6.1(2)'),
    I('p3', '굴착작업과 함께 수행되는가', 'Is excavation involved?', 'kosha:C-C-49 6.1(3)|C-C-49 6.1(3)'),
    I('p4', '점검·정비·검사에 방사선을 쓰는가', 'Is radiation used for inspection or testing?', 'kosha:C-C-49 6.1(4)|C-C-49 6.1(4)'),
    I('p5', '위험지역 대신 안전한 장소에서 할 수 있는가', 'Could the work be done in a safe place instead?', 'kosha:C-C-49 6.1(5)|C-C-49 6.1(5)'),
    I('p6', '인화성·독성 물질 발생 가능성, 처리·세정 방법이 적정한가', 'Can flammable or toxic substances arise, and are treatment and cleaning adequate?', 'kosha:C-C-49 6.1(6)|C-C-49 6.1(6)'),
    I('p7', '잠긴 밸브·막힌 배관 사이 액체가 열팽창할 수 있는가', 'Could liquid trapped between closed valves or blinds expand with heat?', 'kosha:C-C-49 6.1(7)|C-C-49 6.1(7)'),
    I('p8', '설비 내부 구조(포켓·드레인 등)에 유해·위험물질이 남을 수 있는가', 'Could hazardous material remain in pockets, drains or other internal parts?', 'kosha:C-C-49 6.1(8)|C-C-49 6.1(8)'),
    I('p9', '산소·유해가스 농도 측정과 강제환기가 필요한가', 'Are oxygen and toxic-gas testing and forced ventilation needed?', 'kosha:C-C-49 6.1(9)|C-C-49 6.1(9)'),
    I('p10', '초기소화설비 배치 계획', 'Plan for first-aid fire-fighting equipment', 'kosha:C-C-49 6.1(10)|C-C-49 6.1(10)'),
    I('p11', '출입 제한구역 계획', 'Plan for restricted areas', 'kosha:C-C-49 6.1(11)|C-C-49 6.1(11)'),
    I('p12', '작업 중 현장 입회자를 둘 것인가', 'Is an attendant needed on site during the work?', 'kosha:C-C-49 6.1(12)|C-C-49 6.1(12)'),
    I('p13', '고소작업 사고 예방대책', 'Fall-prevention measures for work at height', 'kosha:C-C-49 6.1(13)|C-C-49 6.1(13)'),
    I('p14', '중장비 작업 사고 예방대책', 'Accident-prevention measures for heavy equipment', 'kosha:C-C-49 6.1(14)|C-C-49 6.1(14)')
  ];
  SHE.PTW_PRE_SUPP = { p1: 'confined', p2: 'electrical', p3: 'excavation', p4: 'radiation', p13: 'height', p14: 'heavy' };

  /* 유형별 확인 항목 */
  SHE.PTW_CHECKS = {
    common: [
      I('c1', '허가서 발급 전 발급자와 현장 감독자(작업담당자)가 함께 현장을 확인하고 필요한 안전조치를 정함', 'Before issuing, the issuer and the job supervisor check the site together and agree the safety measures', 'kosha:C-C-49 5.4(1)|C-C-49 5.4(1)', true),
      I('c2', '사전 안전조치 실행 여부, 작업 관련 위험성평가, 작업계획서 등 신청서류·기술자료·도면을 현장과 대조해 검토함', 'Prior safety measures, the job risk assessment, the work plan, technical data and drawings reviewed against the site', 'kosha:C-C-49 6.1|C-C-49 6.1', true),
      I('c3', '작업 절차서 확인 — 없거나 오래돼 맞지 않으면 작업 전 위험성평가로 절차서를 만들거나 고치고 작업자에게 교육', 'Procedure confirmed — if missing, out of date or different, a pre-job risk assessment produces or revises it and workers are trained', 'kosha:C-C-49 6.2(5)|C-C-49 6.2(5)', true),
      I('c4', '작업자에게 공정 위험과 안전교육을 실시함', 'Workers briefed on process hazards and safety', 'kosha:C-C-49 6.2(4)|C-C-49 6.2(4)', true),
      I('c5', '허가서가 요구하는 안전장구를 준비함', 'Safety equipment required by the permit prepared', 'kosha:C-C-49 6.2(2)|C-C-49 6.2(2)', true),
      I('c6', '필요하면 특수작업절차서(압력용기·배관 개방, 내용물 처리)를 첨부함', 'Special procedures attached where needed (opening vessels or lines, handling contents)', 'kosha:C-C-49 6.2(3)|C-C-49 6.2(3)'),
      I('c7', '허가일시와 작업일시를 명확히 적음', 'Permit date/time and work date/time clearly stated', 'law:PSM 고시 제46조 제5호|PSM Notice Art. 46(5)', true),
      I('c8', '작업 시작 전 해당·인접 지역의 운전원·정비원·도급업체 등 영향받는 작업자에게 작업 내용을 알림', 'Operators, maintenance staff and contractors in and around the area told about the work before it starts', 'law:PSM 고시 제46조 제7호|PSM Notice Art. 46(7)', true),
      I('c9', '다른 공정지역에 영향이 있으면 그 지역 운전부서 책임자의 협조를 받음', 'Where other process areas are affected, their operations head agrees', 'kosha:C-C-49 5.4(2)|C-C-49 5.4(2)'),
      I('c10', '허가서를 해당 작업 현장에 게시함', 'The permit posted at the work site', 'kosha:C-C-49 5.4(7)|C-C-49 5.4(7)', true),
      I('c11', '작업대상(설비·배관·기기)이 허가서의 작업대상과 일치하는지 현장에서 확인함', 'The equipment, line or device on site matches the one on the permit', 'kosha:C-C-49 6.2(6)|C-C-49 6.2(6)', true),
      I('c12', '발급자·승인자가 작업허가에 필요한 교육을 받은 사람임', 'The issuer and approver have had permit-to-work training', 'kosha:C-C-49 5.4(6)|C-C-49 5.4(6)')
    ],
    hot: [
      I('h1', '작업구역을 표시하고 통행·출입을 제한함', 'Work zone marked; access restricted', 'kosha:C-C-49 7.1(3)(가)|C-C-49 7.1(3)(a)', true),
      I('h2', '작업 준비 및 작업 절차 수립', 'Job prepared and procedure set', 'law:제241조②1|Art. 241(2)1', true),
      I('h3', '작업장 내 위험물의 사용·보관 현황 파악', 'Hazardous materials used or stored in the area identified', 'law:제241조②2|Art. 241(2)2', true),
      I('h4', '인근 가연성물질 방호조치와 소화기구 비치(필요하면 소화전·소방차 대기)', 'Nearby combustibles protected; extinguishers in place (hydrant or fire engine on standby if needed)', 'law:제241조②3 · C-C-49 7.1(3)(자)|Art. 241(2)3 · C-C-49 7.1(3)(i)', true),
      I('h5', '비산방지덮개·용접방화포 등 불티 비산 방지(방화포는 소방시설법 제40조 성능인증품), 개방된 맨홀·하수구 밀폐', 'Spark covers and welding blankets (blankets certified under Fire-Systems Act Art. 40); open manholes and drains sealed', 'law:제241조②4 · C-C-49 7.1(3)(사)|Art. 241(2)4 · C-C-49 7.1(3)(g)', true),
      I('h6', '인화성 액체 증기·인화성 가스가 남지 않도록 환기하고, 인화성·독성 가스농도 측정과 분진 잔류 확인', 'Ventilated so no flammable vapour or gas remains; flammable and toxic gas tested and dust residues checked', 'law:제241조②5 · C-C-49 7.1(3)(나)|Art. 241(2)5 · C-C-49 7.1(3)(b)', true),
      I('h7', '배관·탱크·드럼 등 용기 안의 위험물·인화성 유류를 제거(비우고 세정)한 뒤 작업', 'Hazardous materials and flammable oils removed from lines, tanks and drums (emptied and cleaned) before work', 'law:제240조 · C-C-49 7.1(3)(마)|Art. 240 · C-C-49 7.1(3)(e)'),
      I('h8', '작업 전 작업대상에 식별표시를 붙이고, 밸브 차단·맹판 설치 시 밸브잠금 표지·맹판설치 표시판 부착', 'Work target labelled before work; valve-lock and blind tags fitted where valves are closed or blinds installed', 'kosha:C-C-49 7.1(3)(라)|C-C-49 7.1(3)(d)'),
      I('h9', '불꽃을 내는 내연설비 장비·차량의 작업구역 출입 통제 (사전안전조치로 승인된 경우만 출입)', 'Engine-driven equipment and vehicles kept out of the work zone (unless approved after prior safety measures)', 'kosha:C-C-49 7.1(3)(다)|C-C-49 7.1(3)(c)'),
      I('h10', '통풍·환기가 충분하지 않은 장소에서 환기용으로 산소를 쓰지 않음', 'No oxygen used for ventilation where airflow is poor', 'law:제241조①|Art. 241(1)', true),
      I('h11', '작업근로자 화재예방·피난교육 등 비상조치', 'Fire-prevention and evacuation briefing for the crew', 'law:제241조②6|Art. 241(2)6', true),
      I('h12', '작업반경 11m 이내 가연물 등 해당 시 화재감시자 지정·배치, 확성기·휴대용 조명·화재 대피용 마스크 지급', 'Fire watch named and posted where the 11 m conditions apply, with loudhailer, portable light and escape mask', 'law:제241조의2|Art. 241-2'),
      I('h13', '가연성물질은 화재위험이 없는 장소에 보관하고 작업장에는 필요한 양만 둠', 'Combustibles stored away from the job; only what the job needs kept at the site', 'law:제236조②|Art. 236(2)'),
      I('h14', '작업 시작부터 종료까지 작업내용·일시·안전점검·조치사항을 작업장소에 서면 게시', 'Task, time, checks and measures posted in writing at the site from start to finish', 'law:제241조④|Art. 241(4)', true),
      I('h15', '입회자가 작업 전·중 입회하고, 식사·휴식 후 재개 전에 가스·분진 농도를 다시 측정', 'The attendant is present before and during work and re-tests gas and dust before restarting after meals or breaks', 'kosha:C-C-49 7.1(3)(아)|C-C-49 7.1(3)(h)', true)
    ],
    general: [
      I('g1', '점화원 유입을 막도록 작업구역을 정하고 통행·차량 출입을 제한함', 'Work zone set to keep ignition sources out; foot and vehicle access restricted', 'kosha:C-C-49 7.2(3)(가)|C-C-49 7.2(3)(a)', true),
      I('g2', '압력·온도·유해위험물질이 있는 설비는 압력 방출·냉각·내용물 배출로 위험요인을 없앤 뒤 작업', 'Equipment with pressure, heat or hazardous contents depressurised, cooled and drained first', 'kosha:C-C-49 7.2(3)(나)|C-C-49 7.2(3)(b)', true),
      I('g3', '작업 전 작업대상에 식별표시를 붙이고, 밸브 차단 표지·맹판 설치 표지 부착', 'Work target labelled before work; valve-isolation and blind tags fitted', 'kosha:C-C-49 7.2(3)(다)|C-C-49 7.2(3)(c)', true),
      I('g4', '배관·용기 안의 가연성·독성·불활성 물질을 비우고 세정한 뒤 가스농도 측정·잔류 확인', 'Flammable, toxic and inert contents emptied and cleaned out; gas tested and residues checked', 'kosha:C-C-49 7.2(3)(라)|C-C-49 7.2(3)(d)', true),
      I('g5', '화학설비 개조·수리·청소로 분해하거나 내부 작업을 하면 작업책임자를 정해 지휘', 'For dismantling or entering chemical equipment for repair or cleaning, a job leader directs the work', 'law:제278조1|Art. 278(1)'),
      I('g6', '작업장소에 위험물 누출이나 고온 수증기가 새지 않도록 함', 'No hazardous material or hot steam can escape into the work area', 'law:제278조2|Art. 278(2)'),
      I('g7', '작업장과 주변의 인화성 증기·가스 농도를 수시로 측정', 'Flammable vapour and gas in and around the area tested frequently', 'law:제278조3|Art. 278(3)'),
      I('g8', '화학설비·부속설비 사용작업이면 작업계획서(별표4 제4호) 작성', 'For work using chemical equipment, a work plan (Annex 4, item 4)', 'law:제38조①4|Art. 38(1)4'),
      I('g9', '급성 독성물질 취급설비의 연결부 점검, 누출 감지·경보설비 작동 확인', 'Joints on acute-toxic systems checked; leak detection and alarms working', 'law:제299조|Art. 299'),
      I('g10', '분해·개조·수리한 화학설비는 다시 쓰기 전에 안전검사 내용을 점검', 'Chemical equipment that was dismantled, modified or repaired is checked before it is used again', 'law:제277조①2|Art. 277(1)2'),
      I('g11', '설비 내부 위험물질이 샐 수 있는 플랜지 개방·배관 절단 등은 작업준비 상태와 안전조치 이행을 적합한 방법(고정형·이동형 영상기기 기록 포함)으로 확인', 'For flange opening, line cutting and other jobs that could release contents, readiness and safety measures are verified in a suitable way (fixed or body-worn video included)', 'kosha:C-C-49 5.2(2)(나)|C-C-49 5.2(2)(b)')
    ],
    confined: [
      I('k1', '작업 일시·기간·장소·내용 등 작업 정보', 'Work details — date, duration, place and task', 'law:제619조②1|Art. 619(2)1', true),
      I('k2', '관리감독자·근로자·감시인 등 작업자 정보', 'People — supervisor, entrants and attendant', 'law:제619조②2|Art. 619(2)2', true),
      I('k3', '지정 측정자가 측정장비로 작업 시작(재시작 포함) 전 산소·유해가스를 측정하고 결과와 후속조치를 기록', 'A designated tester measures oxygen and toxic gases with issued instruments before every start and restart; results and follow-up recorded', 'law:제619조의2①·제619조②3|Art. 619-2(1), 619(2)3', true),
      I('k4', '불활성가스·유해가스 누출·유입·발생 가능성 검토와 후속조치(배관 격리, 밸브 이중잠금 또는 맹판, 잠금 표지)', 'Inert or toxic gas leaks, inflow or generation reviewed and dealt with (isolation, double block or blinds, lock tags)', 'law:제619조②4 · C-C-49 7.3(1)(다)③|Art. 619(2)4 · C-C-49 7.3(1)(c)3', true),
      I('k5', '착용할 보호구 종류', 'PPE to be worn', 'law:제619조②5|Art. 619(2)5', true),
      I('k6', '비상연락체계', 'Emergency contacts', 'law:제619조②6|Art. 619(2)6', true),
      I('k7', '위 6개 사항을 작업이 끝날 때까지 출입구에 게시', 'The six items above posted at the entrance until the job ends', 'law:제619조③|Art. 619(3)', true),
      I('k8', '작업 전·중 적정공기가 유지되도록 환기(환기가 곤란하면 공기호흡기·송기마스크 착용)', 'Ventilated before and during work to keep acceptable air (SCBA or airline respirators if that is impossible)', 'law:제620조|Art. 620', true),
      I('k9', '입장·퇴장할 때마다 인원 점검', 'Head count at every entry and exit', 'law:제621조|Art. 621', true),
      I('k10', '감시인을 외부에 배치하고 연락 설비 유지 — 이상 시 지체 없이 관할 소방관서에 신고', 'Attendant posted outside with a means of contact — reports straight away to the fire service if anything goes wrong', 'law:제623조|Art. 623', true),
      I('k11', '추락 우려가 있으면 안전대·구명밧줄·공기호흡기·송기마스크 지급·착용', 'Harness, lifeline or breathing apparatus where a fall could follow', 'law:제624조|Art. 624'),
      I('k12', '공기호흡기·송기마스크·사다리·섬유로프 등 대피·구출 기구 비치', 'Escape and rescue kit on hand — SCBA or airline respirator, ladder, fibre rope', 'law:제625조|Art. 625', true),
      I('k13', '작업 전 위험성·측정·환기·보호구·비상연락·대피기구를 작업자와 감시인에게 알리고 숙지 여부 확인', 'Entrants and the attendant briefed on hazards, testing, ventilation, PPE, emergency contacts and escape kit, and their understanding checked', 'law:제641조|Art. 641', true),
      I('k14', '측정자의 위험성·장비 점검·측정방법·적정공기 기준 숙지 확인과 교육', 'The tester’s knowledge of hazards, instrument checks, method and acceptance criteria confirmed', 'law:제619조의2②|Art. 619-2(2)', true),
      I('k15', '출입 전 용기 내부를 세척·치환 — 수증기·질소를 썼으면 공기나 물로 완전히 치환', 'Vessel cleaned and purged before entry — fully replaced with air or water after steam or nitrogen', 'kosha:C-C-49 7.3(1)(마)①|C-C-49 7.3(1)(e)1'),
      I('k16', '측정은 상·중·하로 나눠 하고, 작업 전·식사 후·휴식 후 들어갈 때마다 다시 측정', 'Test at top, middle and bottom, and again at every entry — before work, after meals and breaks', 'kosha:C-C-49 7.3(1)(마)④⑤|C-C-49 7.3(1)(e)4–5', true),
      I('k17', '조명은 저전압 방폭등, 폭발 위험이 있으면 공기작동식·방폭형 공구', 'Low-voltage explosion-proof lighting; air-driven or explosion-proof tools where there is an explosion risk', 'kosha:C-C-49 7.3(1)(바)⑥⑦|C-C-49 7.3(1)(f)6–7'),
      I('k18', '구출 작업자는 공기호흡기·송기마스크 착용', 'Rescuers wear SCBA or airline respirators', 'law:제643조|Art. 643', true)
    ],
    electrical: [
      I('e1', '전기작업은 자격·면허·경험을 갖춘 유자격자가 수행', 'Electrical work done by qualified persons', 'law:제318조|Art. 318', true),
      I('e2', '공급되는 모든 전원을 도면·배선도로 확인하고, 차단할 기기 번호·이름을 허가서에 적음', 'All supplies confirmed on drawings; the devices to isolate are listed on the permit', 'law:제319조②1 · C-C-49 7.3(2)(나)|Art. 319(2)1 · C-C-49 7.3(2)(b)', true),
      I('e3', '전원을 차단한 뒤 단로기 등을 개방하고 확인', 'Supply switched off, disconnectors opened and checked', 'law:제319조②2|Art. 319(2)2', true),
      I('e4', '차단장치·단로기에 잠금장치와 꼬리표 부착(열쇠 보관자, 표지에 작업명·시간·작업자·연락처)', 'Locks and tags on isolators (key holder named; tag shows job, time, worker, contact)', 'law:제319조②3 · C-C-49 7.3(2)(다)④|Art. 319(2)3 · C-C-49 7.3(2)(c)4', true),
      I('e5', '잔류전하를 완전히 방전', 'Stored charge fully discharged', 'law:제319조②4|Art. 319(2)4', true),
      I('e6', '검전기로 충전 여부 확인', 'Dead-tested with a voltage detector', 'law:제319조②5|Art. 319(2)5', true),
      I('e7', '다른 충전부 접촉·유도·예비전원 역송전 우려가 있으면 단락 접지', 'Short-circuit earthing where contact, induction or back-feed is possible', 'law:제319조②6|Art. 319(2)6'),
      I('e8', '용도에 맞는 절연용 보호구·방호구를 쓰고 사용 전 손상 확인', 'Suitable insulating PPE and covers used and checked before use', 'law:제323조|Art. 323', true),
      I('e9', '전압 50V 또는 250VA를 넘는 전기작업은 작업계획서(별표4 제5호) 작성', 'A work plan (Annex 4, item 5) for electrical work above 50 V or 250 VA', 'law:제38조①5|Art. 38(1)5'),
      I('e10', '복전 전: 작업기구·단락접지 제거, 작업자 이격 확인, 잠금·꼬리표는 설치한 사람이 직접 철거, 이상 유무 확인 후 투입', 'Before re-energising: tools and earths removed, everyone clear, locks and tags removed by whoever fitted them, all checked', 'law:제319조③|Art. 319(3)', true),
      I('e11', '전원 복구는 모든 작업이 끝난 뒤 운전부서 입회자의 요청으로만 함', 'Power restored only after all work is done and at the request of the operations attendant', 'kosha:C-C-49 별지 양식1|C-C-49 Form 1')
    ],
    excavation: [
      I('x1', '매설 배관·전력선·계장선·통신선·접지선 위치를 도면으로 검토', 'Buried pipes, power, instrument, telecom and earth cables located on drawings', 'kosha:C-C-49 7.3(3)(나)①|C-C-49 7.3(3)(b)1', true),
      I('x2', '지하시설물 관장 부서의 안전요구사항 확인', 'Safety requirements from the owners of underground services confirmed', 'kosha:C-C-49 7.3(3)(나)②|C-C-49 7.3(3)(b)2', true),
      I('x3', '매설물이 있는 곳은 수동으로 굴착', 'Hand-dig where services are present', 'kosha:C-C-49 7.3(3)(다)①|C-C-49 7.3(3)(c)1', true),
      I('x4', '굴착면 높이 2m 이상이면 사전조사와 작업계획서', 'Pre-survey and work plan for excavations 2 m or deeper', 'law:제38조①6|Art. 38(1)6')
    ],
    radiation: [
      I('r1', '방사선 방사 위치를 도면에 표시해 첨부', 'Radiation source position marked on an attached drawing', 'kosha:C-C-49 7.3(4)(나)|C-C-49 7.3(4)(b)', true),
      I('r2', '자격 있는 작업자가 안전수칙에 따라 수행', 'Done by qualified workers following the safety rules', 'kosha:C-C-49 7.3(4)(다)①|C-C-49 7.3(4)(c)1', true),
      I('r3', '작업지역 주위에 출입제한 표지를 게시하고 통행·출입 제한', 'Restricted-area signs posted and access controlled', 'kosha:C-C-49 7.3(4)(다)②|C-C-49 7.3(4)(c)2', true),
      I('r4', '방사선 위험표지와 점멸등 설치', 'Radiation warning signs and flashing lights in place', 'kosha:C-C-49 7.3(4)(다)③|C-C-49 7.3(4)(c)3', true),
      I('r5', '작업이 끝나면 방사선 물질을 즉시 안전하게 회수', 'Radioactive material recovered safely as soon as the work ends', 'kosha:C-C-49 7.3(4)(다)④|C-C-49 7.3(4)(c)4', true)
    ],
    height: [
      I('t1', '비계·작업발판을 견고하게 설치(곤란하면 추락방호망, 그것도 곤란하면 안전대 등)', 'Scaffold or working platform fitted (else a safety net; failing that, harnesses and similar)', 'law:제42조①②|Art. 42(1)(2)', true),
      I('t2', '안전대를 착용하고 안전대 부착설비에 체결 — 부착설비는 작업 전 점검', 'Harness worn and clipped to an anchorage checked before work', 'law:제44조|Art. 44', true),
      I('t3', '안전모 착용(2m 이상 추락 위험 장소는 안전대 함께)', 'Hard hats worn (with a harness where a fall of 2 m or more is possible)', 'law:제32조①1·2|Art. 32(1)1–2', true),
      I('t4', '이동식 사다리는 제42조④ 준수 — 바닥면에서 3.5m 이하, 최상부 발판과 그 아래 디딤대에 올라서지 않음, 2m 이상이면 안전대', 'Portable ladders per Art. 42(4) — no higher than 3.5 m, never on the top two steps, harness at 2 m or more', 'law:제42조④|Art. 42(4)')
    ],
    heavy: [
      I('v1', '중량물 취급 작업계획서 — 추락·낙하·전도·협착·붕괴 위험 예방대책', 'Heavy-load work plan covering falls, falling objects, overturning, crushing and collapse', 'law:제38조①11·별표4|Art. 38(1)11, Annex 4', true),
      I('v2', '작업지휘자를 지정해 작업계획서대로 지휘', 'A work leader directs the job to the plan', 'law:제39조①|Art. 39(1)', true),
      I('v3', '자격을 갖춘 지정 운전자가 운전하고 작업 전반을 관리할 감독자 배치', 'A qualified, named operator and a supervisor for the whole job', 'kosha:C-C-49 7.3(6)(다)①|C-C-49 7.3(6)(c)1', true),
      I('v4', '시야 간섭이 예상되면 통신장비를 가진 지정 신호수 배치', 'A signaller with radio where the view is blocked', 'kosha:C-C-49 7.3(6)(다)②|C-C-49 7.3(6)(c)2', true),
      I('v5', '연약지반·협소공간 작업 금지, 허용하중·붐 안전각도 유지', 'No work on soft ground or in cramped spaces; rated load and boom angle respected', 'kosha:C-C-49 7.3(6)(다)③④|C-C-49 7.3(6)(c)3–4', true),
      I('v6', '적재·하역 시 운전자 탑승 금지, 규정품 보조 달기구 사용', 'Driver out of the vehicle during loading; approved rigging only', 'kosha:C-C-49 7.3(6)(다)⑤⑥|C-C-49 7.3(6)(c)5–6'),
      I('v7', '중장비 일상점검, 투입 전 운전부서·관련부서와 계획 협의', 'Daily equipment checks; plan agreed with operations and other departments before arrival', 'kosha:C-C-49 7.3(6)(다)⑦⑧|C-C-49 7.3(6)(c)7–8', true)
    ]
  };

  /* 가스 측정 기준 — 안전보건규칙 제618조(적정공기), C-C-49 별지 양식1(인화성 HC 0%) */
  SHE.PTW_GAS = [
    { id: 'o2', t: B('산소 O₂', 'Oxygen O₂'), u: '%', ok: (v) => v >= 18 && v < 23.5, rule: B('18% 이상 23.5% 미만', '≥ 18 % and < 23.5 %'), b: 'law:제618조|Art. 618' },
    { id: 'lel', t: B('인화성 가스(HC)', 'Flammable gas (HC)'), u: '%LEL', ok: (v) => v <= 0, rule: B('0% (C-C-49 별지 서식 기준)', '0 % (C-C-49 form)'), b: 'kosha:C-C-49 별지 양식1|C-C-49 Form 1' },
    { id: 'co', t: B('일산화탄소 CO', 'Carbon monoxide CO'), u: 'ppm', ok: (v) => v < 30, rule: B('30ppm 미만', '< 30 ppm'), b: 'law:제618조|Art. 618' },
    { id: 'co2', t: B('이산화탄소 CO₂', 'Carbon dioxide CO₂'), u: '%', ok: (v) => v < 1.5, rule: B('1.5% 미만', '< 1.5 %'), b: 'law:제618조|Art. 618' },
    { id: 'h2s', t: B('황화수소 H₂S', 'Hydrogen sulfide H₂S'), u: 'ppm', ok: (v) => v < 10, rule: B('10ppm 미만', '< 10 ppm'), b: 'law:제618조|Art. 618' }
  ];

  /* 역할 — C-C-49 5.2·5.3, 별지 양식1 */
  SHE.PTW_ROLES = [
    ['applicant', B('신청인 (작업부서)', 'Applicant (work team)')],
    ['issuer', B('발급자 (운전부서 담당자)', 'Issuer (operations)')],
    ['approver', B('승인자 (운전부서 책임자)', 'Approver (operations head)')],
    ['attendant', B('입회자', 'Attendant')],
    ['workLead', B('작업(공무)부서 책임자', 'Work-team lead')],
    ['firewatch', B('화재감시자', 'Fire watch')],
    ['watcher', B('밀폐공간 감시인', 'Confined-space attendant')]
  ];

  /* 작업허가 모니터링 체크리스트 — C-C-49-2026 8(3), 별지 양식3 (20문항, 예·아니오·해당없음). 안전하지 않은 조건이 발견되면 작업을 중지하고 담당부서에 즉시 통보 */
  const M = (ko, en) => ({ ko, en });
  SHE.PTW_MON = [
    M('작업의 범위가 명확하게 표시되어 있는가', 'Is the scope of work clearly marked?'),
    M('필요한 위험성평가를 적합하게 수행하고 있는가', 'Is the necessary risk assessment being done properly?'),
    M('작업허가서에 확인된 위험이 반영되어 있는가', 'Does the permit reflect the hazards identified?'),
    M('작업허가서에 적절한 예방조치(명확하게 지정된 차단조치 포함)가 목록화되어 있는가', 'Does the permit list suitable precautions, including clearly specified isolations?'),
    M('작업허가 시간제한이 분명하고, 연장 시 안전조치가 제대로 확인되도록 운영하는가', 'Is the permit time limit clear, and are safety measures re-checked when it is extended?'),
    M('작업 관련 첨부서류가 적절하게 작성되어 허가서에 추가되었는가', 'Are the related attachments properly completed and added to the permit?'),
    M('다른 부서에 영향을 미치는 작업에 대한 협조가 적절하게 실행되었는가', 'Has work affecting other departments been properly coordinated?'),
    M('허가서·증명서·첨부 파일의 사본을 읽을 수 있는가', 'Are copies of the permit, certificates and attachments legible?'),
    M('서명은 추적 가능하고 읽을 수 있는가', 'Are signatures traceable and legible?'),
    M('허가서와 첨부자료 사본이 올바른 위치에 게시되어 있는가', 'Are copies of the permit and attachments posted in the right place?'),
    M('부착물·도면 등이 올바른 위치에 고정되어 있는가', 'Are tags, drawings and the like fixed in the right place?'),
    M('작업관계자는 작업허가에 대한 설명을 받고 요구사항을 이해했는가', 'Have the people doing the work been briefed on the permit and understood its requirements?'),
    M('작업관계자들은 비상시 해야 할 일을 알고 있는가', 'Do they know what to do in an emergency?'),
    M('차단 조치가 작업에 적합하고, 허가서·차단 첨부서류에 명확히 표시되어 올바르게 실행되었는가', 'Are the isolations suitable, clearly shown on the permit or isolation papers, and correctly carried out?'),
    M('작업관계자(또는 지정된 담당자)가 차단 조치된 설비를 알고 있는가', 'Do the people doing the work (or the named person) know which plant is isolated?'),
    M('작업지역 책임자가 작업을 알고 있는가', 'Does the person in charge of the area know about the work?'),
    M('허가에 따라 작업이 수행되고 있는가', 'Is the work being done as the permit says?'),
    M('제어 조치와 개인보호구가 작업에 적합한가', 'Are the controls and PPE suitable for the work?'),
    M('작업도구와 장비가 적합하고 양호한 상태인가', 'Are the tools and equipment suitable and in good condition?'),
    M('작업장 정리정돈이 만족스러운가', 'Is housekeeping at the job satisfactory?')
  ];
  /* 작업허가 절차 평가 체크리스트 — C-C-49-2026 8(4)·(5), 별지 양식4 (문항 2~43). 새 절차 도입 또는 기존 절차 감사 때 사용, PSM 자체감사의 ‘작업허가’ 분야에 포함 가능 */
  SHE.PTW_AUDIT = [
    { t: M('정책', 'Policy'), q: [
      [2, M('고위험 작업·유지보수 활동의 위험 평가와 그 제어 절차에 대한 명확한 정책이 있는가', 'Is there a clear policy on assessing and controlling the risks of high-risk work and maintenance?')],
      [3, M('작업허가 절차의 목표가 명확히 정의되고 이해되고 있는가', 'Are the aims of the permit procedure clearly defined and understood?')],
      [4, M('특정 위험으로 확인된 작업 외의 잠재적 위험 작업에도 적용할 수 있을 만큼 유연한가', 'Is the procedure flexible enough to cover other potentially hazardous work, not just the tasks already identified?')] ] },
    { t: M('조직관리', 'Organisation'), q: [
      [5, M('작업허가 절차 관리, 허가서 양식 설계와 절차 범위, 허가가 필요한 작업 유형, 도급업체 관리에 대한 책임이 명확한가', 'Are responsibilities clear for running the procedure, designing the form and scope, deciding which work needs a permit, and managing contractors?')],
      [6, M('허가가 필요한 작업 유형·영역이 모든 관련자에게 명확히 정의되고 이해되고 있는가', 'Are the types of work and areas needing a permit clearly defined and understood by everyone involved?')],
      [7, M('허가를 발급할 수 있는 사람이 명확히 정해져 있는가', 'Is it clear who may issue permits?')],
      [8, M('특정 작업의 허가를 어떻게 받는지가 명확한가', 'Is it clear how to obtain a permit for a given job?')],
      [9, M('본인이 수행하는 작업의 허가를 스스로 승인하는 것을 금지하고 있는가', 'Is self-authorisation of one’s own work prohibited?')],
      [10, M('작업허가 절차가 현장·설비 전반의 작업에 필수라는 인식이 있는가', 'Is the permit procedure recognised as essential for work across the site and plant?')],
      [11, M('같은 설비·지역에 발급된 허가서 사본을 함께 보관·게시하는가', 'Are copies of permits for the same plant or area kept and displayed together?')],
      [12, M('서로 영향을 줄 수 있는 작업을 조정하는 방법이 있는가', 'Is there a way to coordinate jobs that could affect each other?')],
      [13, M('허가서 양식에 관련 첨부서류·다른 허가서와 교차 참조할 항목이 있는가', 'Does the form allow cross-reference to related attachments and other permits?')],
      [14, M('작업 시작 전 영향을 받는 다른 사람들의 동의를 확보하는 방법이 있는가', 'Is there a way to make sure others affected agree before the work starts?')],
      [15, M('여러 허가서에 공통된 격리는 모든 허가서가 끝나기 전에 해제되지 않도록 하는 절차가 있는가', 'Where several permits share an isolation, is there a procedure stopping it from being removed before all of them are finished?')],
      [16, M('전자 시스템을 쓰는 경우, 시스템 장애 시 작업 조정을 복구할 유효한 방법이 있는가', 'If an electronic system is used, is there a working fallback for coordinating work when it fails?')] ] },
    { t: M('의사소통', 'Communication'), q: [
      [17, M('수령자가 허가서를 보유하고, 진행 중·일시 중지된 허가서의 기록이 유지되는가', 'Does the holder keep the permit, and is a record kept of live and suspended permits?')],
      [18, M('작업장에 허가서 사본을 표시하도록 요구하는가', 'Must a copy of the permit be displayed at the job?')],
      [19, M('허가서가 수행할 작업을 명확히 적는가', 'Does the permit state the work clearly?')],
      [20, M('허가서가 발급 대상자를 명확히 적는가', 'Does it name who it is issued to?')],
      [21, M('허가서가 작업할 공장·지역을 명확히 표시하는가', 'Does it clearly identify the plant or area?')],
      [22, M('수령자가 서명해 위험과 제어조치를 읽고 이해하도록 운영하는가', 'Does the holder sign to confirm they have read and understood the hazards and controls?')],
      [23, M('허가서에 종료·연장 시간 제한이 명확한가', 'Are the time limits for ending or extending the permit clear?')],
      [24, M('교대·작업기간 초과·일시 중단 작업의 인수인계 절차와 내용이 있는가', 'Does it cover hand-over for shift changes, over-running and suspended work?')],
      [25, M('작업이 끝나면 반납 서명을 요구하는가', 'Is a hand-back signature required when the work is finished?')] ] },
    { t: M('교육 및 역량', 'Training and competence'), q: [
      [26, M('작업허가 절차를 현장·공사 안전교육에서 충분히 다루는가', 'Is the permit procedure covered thoroughly in site and project safety training?')],
      [27, M('특별한 책임이 있는 인원(허가 발급·격리 권한자 등)이 지정되고 훈련받았는가', 'Are people with special duties (e.g. permit issuers, isolation authorities) appointed and trained?')],
      [28, M('그들이 의무를 수행할 충분한 시간이 있는가', 'Do they have enough time to carry out those duties?')],
      [29, M('책임을 부여하기 전 정식 역량 평가를 요구하는가', 'Is a formal competence assessment required before the duty is assigned?')],
      [30, M('교육·역량 기록이 유지되는가', 'Are training and competence records kept?')],
      [31, M('교육·역량 요구사항에 작업하는 도급업체가 포함되는가', 'Do the training and competence requirements include contractors doing the work?')],
      [32, M('허가 발급 권한자가 관련 설비의 위험을 충분히 아는가', 'Do permit issuers know the hazards of the plant concerned well enough?')] ] },
    { t: M('계획 및 실행', 'Planning and execution'), q: [
      [33, M('허가서가 수행할 작업을 명확히 적는가', 'Does the permit state clearly the work to be done?')],
      [34, M('잠재적 위험 설비 작업에 문서화된 격리 절차가 있고, 작업·공사 종료까지 격리가 유지되는가', 'Is there a documented isolation procedure for work on potentially hazardous plant, and does the isolation last until the work or project is finished?')],
      [35, M('작업 현황이 바뀌거나 새 위험이 생기면 작업을 중지하라는 명확한 요구가 있는가', 'Is there a clear requirement to stop work if conditions change or a new hazard appears?')],
      [36, M('비상시 작업을 어떻게 통제·중단할지 명확한 규칙이 있는가', 'Does the permit set clear rules for controlling or abandoning work in an emergency?')],
      [37, M('작업 현장의 잠재 위험을 확인해 허가서에 기록하도록 요구하는가', 'Does the procedure require hazards at the job to be identified and recorded on the permit?')],
      [38, M('허가서가 사용자와 책임자가 취할 예방조치를 명확히 적는가', 'Does the permit state clearly the precautions the holder and others must take?')] ] },
    { t: M('성과 측정', 'Performance measurement'), q: [
      [39, M('안전장치(화재·가스 감지기 등)를 차단해야 하는 작업을 식별하고 모니터링하는 절차가 있는가', 'Is there a procedure to identify and monitor work that requires safety devices (e.g. fire and gas detectors) to be inhibited?')] ] },
    { t: M('감사 및 검토', 'Audit and review'), q: [
      [40, M('허가서 준수를 확인하는 모니터링 절차나 정기 현장점검이 있는가', 'Is there monitoring or a regular site check that permits are followed?')],
      [41, M('작업허가 하에서 수행된 작업 중 발생한 사건을 보고하는 절차가 있는가', 'Is there a procedure for reporting incidents during permitted work?')],
      [42, M('절차를 적절히 감사하고, 외부 전문가 또는 현장을 잘 아는 타 부서 인원이 감사하는가', 'Is the procedure audited properly — ideally by outside experts or people from another department who know the site?')],
      [43, M('정기적으로 작업허가 절차를 검토하는 절차가 있는가', 'Is there a procedure for reviewing the permit system at regular intervals?')] ] }
  ];

  /* 예시 허가서 — 가상 데이터 */
  SHE.PTW_EXAMPLE = {
    id: 'ex1', ex: true, no: 'PTW-EX-001', status: 'issued', site: 'cheongju', date: '2026-09-24', from: '09:00', to: '17:00',
    main: 'general', supp: ['electrical', 'height'],
    area: B('M15X 가스룸 — 실린더 캐비닛 GC-07', 'M15X gas room — cylinder cabinet GC-07'),
    equip: B('GC-07 출구 배관 공압 밸브', 'GC-07 outlet line pneumatic valve'),
    task: B('질소 퍼지를 마친 캐비닛 출구 배관 밸브 교체, 캐비닛 상부 배기 덕트 점검(높이 2.4m)', 'Replace the outlet valve after nitrogen purge; inspect the exhaust duct above the cabinet (2.4 m)'),
    team: B('설비팀 · 협력사 A', 'Facilities · Contractor A'), workers: B('작업자 3명 (가상)', 'Three workers (fictional)'),
    pre: { p2: true, p6: true, p8: true, p9: true, p10: true, p11: true, p12: true, p13: true },
    checks: { c1: true, c2: true, c3: true, c4: true, c5: true, c7: true, c8: true, c10: true, g1: true, g2: true, g3: true, g4: true, g9: true, e1: true, e2: true, e3: true, e4: true, e5: true, e6: true, e8: true, e10: true, t1: true, t2: true, t3: true },
    gas: [{ id: 'o2', v: '20.8', time: '08:40' }, { id: 'lel', v: '0', time: '08:40' }, { id: 'ph3', v: '0', time: '08:42' }],
    roles: { applicant: B('설비팀 (가상)', 'Facilities (fictional)'), issuer: B('가스운영 담당 (가상)', 'Gas operations (fictional)') }
  };
})();

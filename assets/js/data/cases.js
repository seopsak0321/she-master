/* 사고사례·최신 동향 데이터 (기준일 2026-09-25)
   - facts: 확인된 사실(출처 src). 언론 보도끼리 수치가 다르면 범위로 적고 그 사실을 밝힌다.
   - official: 정부·법원 등 공식 판단(원문 확인).
   - why[].k: 'off' = 공식 확인, 'an' = 포털 분석(가설). 분석은 사실로 단정하지 않는다.
   - actions / lateral / verify / risk 는 재발방지 학습을 위한 포털 제안이며 회사의 실제 조치가 아니다. */
window.SHE = window.SHE || {};
(function () {
  const B = (ko, en) => ({ ko, en });

  SHE.CASE_TYPES = {
    fire: B('화재', 'Fire'), leak: B('누출', 'Release'), contact: B('화학물질 접촉', 'Chemical contact'),
    asphyx: B('질식', 'Asphyxiation'), fall: B('추락', 'Fall'), caught: B('끼임', 'Caught-in'), struck: B('부딪힘', 'Struck-by'),
    shock: B('감전', 'Electric shock'), burn: B('화상', 'Burn'), rad: B('방사선', 'Radiation'), other: B('기타', 'Other'),
    reg: B('행정처분', 'Enforcement')
  };
  SHE.CTRL_LEVELS = [
    { id: 'elim', t: B('제거·대체', 'Eliminate / substitute') },
    { id: 'eng', t: B('공학적 대책', 'Engineering') },
    { id: 'adm', t: B('행정적 대책', 'Administrative') },
    { id: 'ppe', t: B('보호구', 'PPE') }
  ];

  SHE.CASES = [
    {
      id: 'cj-2026-gasroom', site: 'cheongju', date: '2026-06-01', dateLabel: B('2026.6.1 · 6.12', '1 & 12 Jun 2026'),
      types: ['fire', 'leak'], official: true,
      t: B('청주캠퍼스 가스룸 화재·불소 누출', 'Cheongju gas-room fires and fluorine release'),
      impact: B('대피 3,600여 명·4,000여 명, 경상·진료 다수, 정부 감독 119건 위반', '≈3,600 and ≈4,000 evacuated, minor injuries, 119 violations found on inspection'),
      facts: [
        { t: B('6.1 10시 32분경 청주 4캠퍼스 M15·M15X 연결동 6층 가스룸에서 화재. 스프링클러가 작동해 약 10분 만에 진화', 'About 10:32 on 1 June, fire in the 6th-floor gas room linking M15 and M15X at Cheongju Campus 4; sprinklers put it out in about 10 minutes'), src: ['etnews0601'] },
        { t: B('가스룸 내부 불소 농도 5ppm이 측정됐다고 보도. 약 3,600명이 1시간 30분가량 대피했고, 사내 의원 이송 인원은 매체에 따라 7~11명으로 달리 보도됨(중상자 없음 보도)', 'A fluorine level of 5 ppm inside the gas room was reported. About 3,600 people evacuated for roughly 90 minutes; outlets reported 7–11 people taken to the on-site clinic (no serious injuries reported)'), src: ['etnews0601', 'safetimes0602'] },
        { t: B('6.12 9시 50분경 M15X 2층 가스룸 캐비닛에서 불소·질소 혼합 작업 중 화재, 약 10분 내 진화. 약 4,000명 대피, 1명 발목 화상, 어지럼증 등으로 사내 병원 이송 8~12명(보도별 상이). 소방 측정 결과 외부 누출은 없었음', 'About 09:50 on 12 June, fire in a cabinet in the M15X 2nd-floor gas room during fluorine–nitrogen mixing; out in about 10 minutes. About 4,000 evacuated; one ankle burn; 8–12 taken to the on-site clinic with dizziness (reports differ). Fire-service readings found no release outside'), src: ['mbc0612', 'seoul0612'] },
        { t: B('회사는 6.4부터 “전사 안전 체계 대정비 주간”을 시행해 고위험 작업을 점검하고, 가스 사용 등 일부 고위험 작업을 일시 보류한 뒤 안전조치 적정성을 재확인', 'From 4 June the company ran a “company-wide safety system overhaul week”, reviewing high-risk work and pausing some high-risk jobs such as gas work until controls were re-confirmed'), src: ['newspim0604'] },
        { t: B('고용노동부는 6.26 SK하이닉스 등 반도체 제조업 집중 점검에 착수(발표 당시 25개소)하고, 9.20 27개소 결과를 발표', 'MOEL began a focused inspection of chipmakers including SK hynix on 26 June (25 sites at launch) and published results for 27 sites on 20 September'), src: ['moel0626', 'moel0920'] }
      ],
      officialFindings: [
        { t: B('6월 화재 폭발 사고는 공정안전보고서 부적정 이행에 따른 사고로 확인 — 공정안전보고서에 따른 사전점검 미실시, 안전작업허가 대상임에도 허가 없이 가스 작업 개시', 'The June fire/explosion accidents were confirmed as resulting from improper implementation of the process safety report — required pre-checks not done, and gas work started without the required permit'), src: ['moel0920'] },
        { t: B('청주캠퍼스 감독 결과 산업안전보건법 위반 119건: 사법처리 28건(안전밸브 전·후단 차단밸브 설치, 폭발위험장소 내 방폭 성능 없는 전기 기계·기구 사용 등), 과태료 84건 약 3,200만원(경고표시 미부착, MSDS 미게시 등), 공정안전보고서 보완 시정조치 7건', '119 violations at Cheongju: 28 referred for prosecution (e.g. isolation valves before/after safety valves, non-explosion-proof electrical equipment in hazardous areas), 84 fines ≈ KRW 32 million (missing warning labels, MSDS not posted, etc.), 7 corrective orders to supplement the PSM report'), src: ['moel0920'] },
        { t: B('고용노동부 산업안전보건본부장: “이번 SK하이닉스 청주캠퍼스 사고는 경고등이었다”', 'MOEL’s head of occupational safety: “The SK hynix Cheongju accident was a warning light.”'), src: ['moel0920'] }
      ],
      why: [
        { k: 'off', t: B('왜 화재·누출이 났나? → 가스(불소·질소) 작업의 이상을 작업 전에 걸러내지 못했다', 'Why the fire and release? → Problems in the fluorine–nitrogen job were not caught before work began') },
        { k: 'off', t: B('왜 걸러내지 못했나? → 공정안전보고서에 정한 사전점검을 하지 않았고, 허가 없이 가스 작업을 시작했다', 'Why not caught? → The pre-checks set in the PSM report were skipped and gas work began without a permit') },
        { k: 'an', t: B('왜 허가 없이 시작할 수 있었나? → 허가·점검이 끝나지 않아도 가스 공급을 열 수 있는 구조(물리적 차단 부재)였을 가능성', 'Why could it start without a permit? → Possibly nothing physically stopped gas supply before checks and permits were complete') },
        { k: 'an', t: B('왜 11일 만에 같은 유형으로 재발했나? → 1차 사고 원인이 확정되기 전 동일 작업의 재개 기준과 수평전개가 충분히 작동하지 않았을 가능성', 'Why a repeat within 11 days? → Possibly restart rules and lateral learning for the same job did not work before the first cause was established') },
        { k: 'an', t: B('근본 원인 → 절차(사전점검·작업허가)는 문서로 있었지만 현장 이행을 검증하는 장치(감사·인터록·지표)가 약했다. 감독에서 안전밸브·방폭 등 설비 기준 위반이 함께 적발된 점도 같은 방향을 가리킨다', 'Root cause → Procedures existed on paper, but checks that they happen in the field (audits, interlocks, metrics) were weak — the equipment violations found on inspection point the same way') }
      ],
      m4: {
        man: B('허가 없이 가스 작업 개시 (공식 확인)', 'Gas work started without a permit (confirmed)'),
        machine: B('안전밸브 전·후단 차단밸브, 비방폭 전기기계·기구 (감독 적발 — 사고와의 직접 관련성은 발표되지 않음)', 'Isolation valves around safety valves; non-explosion-proof equipment (found on inspection — link to the accidents not stated)'),
        media: B('불소·질소 혼합이라는 고위험 작업, 인접 공장을 잇는 가스룸 (분석)', 'High-hazard fluorine–nitrogen mixing; a gas room linking two fabs (analysis)'),
        management: B('PSM 사전점검 미실시(공식), 1차 사고 후 11일 만의 재발(분석)', 'PSM pre-checks skipped (confirmed); repeat within 11 days (analysis)')
      },
      barriers: {
        held: B(['스프링클러·초기 소화로 두 번 모두 약 10분 내 진화', '수천 명 규모 대피 체계 작동', '6.12 사고는 소방 측정상 외부 누출 없음'], ['Sprinklers/first response put both fires out in about 10 minutes', 'Evacuation of thousands worked', 'No outside release in the 12 June event per fire-service readings']),
        failed: B(['PSM 사전점검', '안전작업허가', '6.1 가스룸 내 불소 누출 억제'], ['PSM pre-checks', 'Permit to work', 'Containment of fluorine inside the gas room on 1 June'])
      },
      exposure: { chem: 'f2', value: 5, note: B('보도된 5ppm은 가스룸 공간 농도로, 작업자 개인 노출량이 아닙니다. 기준 대비 위치를 이해하기 위한 교육용 비교입니다.', 'The reported 5 ppm is a room concentration, not a personal exposure. This comparison is for teaching only.') },
      risk: { before: { l: 4, s: 4 }, after: { l: 1, s: 3 },
        why: B('전: 한 달 안에 같은 유형 2건(가능성 4), 독성가스·화재(중대성 4). 후: 허가 연동 인터록으로 가능성 1, 자동차단·음압 캐비닛·조기감지로 노출 규모를 줄여 중대성 3 목표', 'Before: two events of the same kind within a month (L4), toxic gas and fire (S4). After: a permit-linked interlock for L1; auto shut-off, negative-pressure cabinets and early detection to limit the consequence to S3') },
      actions: [
        { lvl: 'elim', t: B('현장 혼합 작업을 줄이는 방안 검토 — 사전 혼합 가스 공급 또는 자동 혼합 설비 전환 가능성 평가', 'Reduce manual on-site mixing — assess premixed supply or automated mixing'), b: 'gp' },
        { lvl: 'eng', t: B('작업허가·사전점검이 완료되기 전에는 가스 공급 밸브가 열리지 않는 허가 연동 인터록', 'Permit-linked interlock: gas supply cannot open until the permit and pre-checks are complete'), b: 'gp' },
        { lvl: 'eng', t: B('적발된 안전밸브 전·후단 차단밸브 제거·봉인, 폭발위험장소 전기기계·기구 방폭형 교체', 'Remove/seal isolation valves around safety valves; replace equipment in hazardous areas with explosion-proof types'), b: 'law:고용노동부 감독 지적|MOEL inspection finding' },
        { lvl: 'eng', t: B('불소 감지기 위치·경보값·자동차단 연동 재검증', 'Re-verify fluorine detector location, alarm set-points and shut-off linkage'), b: 'guide', ref: 'C-C-87-2026' },
        { lvl: 'adm', t: B('공정안전보고서 안전운전계획(안전작업허가·가동 전 점검) 이행 감사 — 월간 샘플링, 누락 발견 시 해당 작업 중지', 'Audit PSM operating-plan items (permits, pre-start checks) monthly by sampling; stop the job if anything is missing'), b: 'law:시행규칙 제50조①3|Enforcement Rule Art. 50(1)3' },
        { lvl: 'adm', t: B('1차 사고 뒤 원인 확정 전까지 동일·유사 작업은 “보류 → 재개 승인” 절차 적용 (6.4 시행한 고위험 작업 일시 보류를 상시 규칙화)', 'After a first event, hold identical/similar jobs until the cause is known and restart is approved — make the 4 June pause a standing rule'), b: 'gp' },
        { lvl: 'adm', t: B('경고표시 부착·MSDS 게시 전수 점검 (감독 지적 사항)', 'Full check of warning labels and MSDS posting (inspection finding)'), b: 'law:고용노동부 감독 지적|MOEL inspection finding' },
        { lvl: 'ppe', t: B('가스 작업자 호흡보호구·내화학복 기준과 착용 확인을 TBM 체크 항목에 포함', 'Add respirator and chemical-suit checks for gas workers to the TBM checklist'), b: 'gp' }
      ],
      lateral: B(['이천·청주 전 가스룸·가스 캐비닛에 동일 점검표 적용', '같은 캐비닛 모델·혼합 공정을 쓰는 라인 우선 점검', '용인 1기 Fab·청주 P&T7 설계 단계에 허가 연동 인터록 반영', '해외 사업장(우시·충칭)에 사례 공유'], ['Apply the same checklist to every gas room and cabinet at Icheon and Cheongju', 'Prioritise lines using the same cabinet model or mixing process', 'Design permit-linked interlocks into Yongin Fab 1 and Cheongju P&T7', 'Share the case with overseas sites (Wuxi, Chongqing)']),
      verify: [
        { k: B('허가 없이 시작된 가스 작업', 'Gas jobs started without a permit'), target: B('0건 (월간 샘플 감사)', '0 (monthly sample audit)') },
        { k: B('PSM 사전점검 이행률', 'PSM pre-check completion'), target: B('100%', '100 %') },
        { k: B('가스룸 화재·누출 재발', 'Repeat gas-room fire or release'), target: B('0건 / 12개월', '0 in 12 months') },
        { k: B('재점검 시 동일 지적', 'Repeat findings on re-inspection'), target: B('0건', '0') }
      ],
      lesson: B('작은 누출(6.1)이 11일 뒤 같은 작업 유형의 화재(6.12)로 이어졌습니다. 첫 사고를 “경고등”으로 받아들여 동일 작업을 멈추고 원인을 확정하는 것이 재발방지의 출발점입니다.', 'A small release (1 June) was followed 11 days later by a fire in the same kind of job (12 June). Treating the first event as a warning light — stopping the same work until the cause is known — is where recurrence prevention starts.'),
      sops: ['gas-cylinder', 'hot-work', 'gas-alarm'], src: ['moel0920', 'etnews0601', 'mbc0612']
    },
    {
      id: 'ic-2026-hno3', site: 'icheon', date: '2026-09-20', dateLabel: B('2026 (9.20 발표)', '2026 (announced 20 Sep)'),
      types: ['contact', 'reg'], official: true,
      t: B('이천캠퍼스 질산 폐액 접촉 재해 → 도급승인 취소', 'Icheon nitric-acid waste contact → subcontract approval revoked'),
      impact: B('노동자 질산 폐액 접촉 재해, 도급승인 취소, 시정지시 39건·과태료 8건(2,770만원)', 'Worker contact with nitric-acid waste; approval revoked; 39 corrective orders and 8 fines (KRW 27.7 million)'),
      facts: [
        { t: B('고용노동부 점검(2026.6.26~9.18)에서 이천캠퍼스의 도급승인 작업에 대한 작업절차서 미준수를 적발해 도급승인 취소 처분 — 질산 폐액 노동자 접촉 재해가 발생', 'The MOEL inspection (26 Jun–18 Sep 2026) found the approved work procedure for a subcontracted job at Icheon was not followed and revoked the approval — a worker had come into contact with nitric-acid waste'), src: ['moel0920'] },
        { t: B('이천캠퍼스: 시정지시 39건, 도급승인 취소 1건, 과태료 8건(27,700,000원)', 'Icheon: 39 corrective orders, 1 approval revoked, 8 fines (KRW 27,700,000)'), src: ['moel0920'] },
        { t: B('재해 발생 일자와 세부 경위는 공개되지 않았습니다', 'The date and details of the injury were not disclosed'), src: ['moel0920'] }
      ],
      officialFindings: [
        { t: B('산업안전보건법 제59조에 따라 불산·황산·염산·질산 등 급성 독성·피부 부식성 물질 취급 작업을 도급하려면 승인을 받아야 하며, 승인받은 작업절차서를 지키지 않아 승인이 취소됨', 'Under OSH Act Art. 59, contracting out work with acutely toxic or corrosive substances such as HF, sulfuric, hydrochloric and nitric acid needs approval; the approval was revoked because the approved procedure was not followed'), src: ['moel0920', 'lawAct'] }
      ],
      why: [
        { k: 'off', t: B('왜 접촉했나? → 질산 폐액 취급 작업 중 노출이 발생했다', 'Why the contact? → Exposure occurred during nitric-acid waste handling') },
        { k: 'off', t: B('왜 노출됐나? → 승인받은 작업절차서대로 작업하지 않았다', 'Why exposed? → The approved work procedure was not followed') },
        { k: 'an', t: B('왜 절차서와 달랐나? → 승인 조건(절차서)과 현장 작업 방법의 차이를 작업 전에 대조하는 장치가 없었을 가능성', 'Why different? → Possibly nothing compared the approved procedure with the actual method before work') },
        { k: 'an', t: B('왜 도급인이 몰랐나? → 순회점검·조치 확인이 서류 수준에 머물러 절차서 이행까지 보지 못했을 가능성', 'Why didn’t the principal notice? → Site rounds and follow-up checks may have stopped at paperwork') },
        { k: 'an', t: B('근본 원인 → 도급승인을 “받으면 끝나는 서류 절차”로 운영', 'Root cause → Treating approval as paperwork that ends once granted') }
      ],
      m4: {
        man: B('승인 절차서 미준수 (공식 확인)', 'Approved procedure not followed (confirmed)'),
        machine: B('폐액 취급 설비·이송 방식 (세부 비공개)', 'Waste-handling equipment and transfer method (details not public)'),
        media: B('부식성 강산 폐액을 사람이 다루는 작업 (분석)', 'People handling corrosive acid waste (analysis)'),
        management: B('도급인의 절차서 이행 확인 미흡 (분석)', 'Weak principal checks on procedure compliance (analysis)')
      },
      barriers: { held: B(['정부 점검에서 절차 미준수가 확인·시정됨'], ['The inspection caught and corrected the non-compliance']), failed: B(['승인 절차서 준수', '도급인의 현장 이행 확인'], ['Compliance with the approved procedure', 'Principal’s field verification']) },
      risk: { before: { l: 3, s: 3 }, after: { l: 1, s: 3 }, why: B('전: 절차 미준수 상태의 반복 작업(가능성 3), 강산 접촉 부상(중대성 3). 후: 밀폐 이송·절차 이행 점검으로 가능성 1', 'Before: repeated work outside the procedure (L3), acid-contact injury (S3). After: closed transfer and procedure audits for L1') },
      actions: [
        { lvl: 'elim', t: B('폐액 이송을 밀폐·자동화해 사람이 직접 다루는 단계를 없앰', 'Close and automate waste transfer so no one handles it directly'), b: 'gp' },
        { lvl: 'eng', t: B('폐액 취급 설비 누액 방지·드립 트레이, 긴급 세척 설비 근접 배치', 'Drip prevention and trays on waste equipment; emergency showers close by'), b: 'guide' },
        { lvl: 'adm', t: B('도급승인 작업 목록화 후 “승인 절차서 ↔ 현장” 대조 항목을 순회점검(제조업 2일 1회)에 포함', 'List every approved subcontracted job and add a procedure-vs-field check to site rounds (every 2 days in manufacturing)'), b: 'law:시행규칙 제80조|Enforcement Rule Art. 80' },
        { lvl: 'adm', t: B('작업 전 안전·보건 정보 문서 제공과 조치 확인', 'Give written safety information before work and confirm the measures'), b: 'law:법 제65조|Act Art. 65' },
        { lvl: 'ppe', t: B('질산 폐액 작업용 내산 보호구 기준 재확인', 'Re-confirm acid-resistant PPE for nitric-acid waste work'), b: 'gp' }
      ],
      lateral: B(['황산·불산·질산·염산 1% 이상 취급 설비의 모든 도급승인 작업 재점검 (이천·청주)', '폐액 이송 경로 전체 위험성평가 갱신'], ['Recheck every approved job on equipment with ≥ 1 wt% sulfuric, HF, nitric or hydrochloric acid (Icheon, Cheongju)', 'Update risk assessments for all waste-transfer routes']),
      verify: [
        { k: B('승인 작업 현장 대조 점검 이행률', 'Approved jobs checked against procedure'), target: B('100%', '100 %') },
        { k: B('절차서-현장 불일치', 'Procedure vs field mismatches'), target: B('0건', '0') }
      ],
      lesson: B('도급승인은 “허가증”이 아니라 “약속”입니다. 승인받은 절차서대로 현장이 움직이는지 도급인이 확인해야 합니다.', 'A subcontract approval is a promise, not a pass. The principal must check that the field follows the approved procedure.'),
      sops: ['line-break', 'chem-supply'], src: ['moel0920']
    },
    {
      id: 'cj-2026-tmah', site: 'cheongju', date: '2026-06-10', dateLabel: B('2026.6.10', '10 Jun 2026'),
      types: ['contact'], official: false,
      t: B('청주 장비 하역 중 TMAH 접촉', 'TMAH contact while unloading equipment at Cheongju'),
      impact: B('운송자·장비 담당자 2명 병원 이송 (이송 당시 특이 증상 없음 보도)', 'Driver and equipment handler taken to hospital (no particular symptoms reported at transfer)'),
      facts: [
        { t: B('6.10 15시 39분경 청주 사업장에서 이천 공장에서 옮겨 온 장비를 트럭에서 내리던 중, 장비에서 흘러나온 액체(TMAH)에 운송자와 장비 담당자 2명이 접촉한 것으로 보도', 'About 15:39 on 10 June at Cheongju, while unloading equipment brought from Icheon, a driver and an equipment handler reportedly touched liquid (TMAH) that had leaked from it'), src: ['seoul0610'] },
        { t: B('사내 의원에서 세척 후 정밀검사를 위해 외부 병원으로 이송, 회사 자체 방재 인력이 현장 조치', 'They were rinsed at the on-site clinic and sent to hospital for tests; the company’s own response team secured the scene'), src: ['seoul0610'] },
        { t: B('공식 원인 조사 결과는 공개되지 않았습니다', 'No official cause has been published'), src: [] }
      ],
      officialFindings: [],
      why: [
        { k: 'an', t: B('왜 접촉했나? → 장비 내부에 남아 있던 약액이 하역 중 흘러나왔다', 'Why the contact? → Chemical left inside the equipment leaked during unloading') },
        { k: 'an', t: B('왜 남아 있었나? → 반출 전 배액·세정이 충분하지 않았을 가능성', 'Why left inside? → Draining and rinsing before shipment may have been incomplete') },
        { k: 'an', t: B('왜 확인되지 않았나? → “잔류물 없음” 확인·표지 없이 반출할 수 있었을 가능성', 'Why not caught? → Equipment may have been able to leave without a “no residue” check or tag') },
        { k: 'an', t: B('왜 하역자가 몰랐나? → 운송·하역자(외부 인력 포함)에게 물질 정보가 전달되지 않았을 가능성', 'Why didn’t the handlers know? → Substance information may not have reached the drivers and unloaders, including outside staff') },
        { k: 'an', t: B('근본 원인 → 사업장 간 장비 이설을 변경관리(MOC) 대상으로 다루지 않았을 가능성', 'Root cause → Moving equipment between sites may not have been treated as a managed change (MOC)') }
      ],
      m4: {
        man: B('잔류 가능성 정보 부재 (분석)', 'No information about possible residue (analysis)'),
        machine: B('장비 내부 잔류 약액 (보도)', 'Chemical left inside the equipment (reported)'),
        media: B('하역장 — 공정 밖 장소, 외부 인력 참여', 'Unloading bay — outside the process area, outside staff involved'),
        management: B('장비 이설 시 세정 확인·정보 전달 절차 (분석)', 'Clean-out verification and information hand-off when moving equipment (analysis)')
      },
      barriers: { held: B(['사내 의원 즉시 세척', '자체 방재 인력 투입'], ['Immediate rinse at the clinic', 'In-house response team deployed']), failed: B(['반출 전 잔류물 제거 확인', '하역자 정보 제공'], ['Residue removal check before shipment', 'Information for unloaders']) },
      exposure: null,
      risk: { before: { l: 3, s: 3 }, after: { l: 1, s: 2 }, why: B('전: 장비 이설이 잦은 증설기(가능성 3), TMAH 피부 접촉(중대성 3). 후: 반출 확인서로 가능성 1, 개방부 마감·보호구로 중대성 2', 'Before: frequent equipment moves during expansion (L3), TMAH skin contact (S3). After: shipment certificate for L1; capped openings and PPE for S2') },
      actions: [
        { lvl: 'elim', t: B('반출 전 배액·세정·건조 후 “잔류물 없음” 확인서 부착 — 확인서 없으면 반출 불가', 'Drain, rinse and dry before shipment and attach a “no residue” certificate — no certificate, no shipment'), b: 'gp' },
        { lvl: 'eng', t: B('배관·개방부 캡·마개 체결, 누액 트레이에 적재', 'Cap all pipes and openings; ship on drip trays'), b: 'gp' },
        { lvl: 'adm', t: B('장비 이설을 변경관리(MOC) 대상에 포함하고, 운송·하역자에게 물질 정보를 문서로 제공', 'Treat equipment moves as MOC and give drivers and unloaders written substance information'), b: 'guide', ref: 'C-C-53-2026' },
        { lvl: 'ppe', t: B('하역 시 내화학 장갑·보안경 착용', 'Chemical gloves and goggles for unloading'), b: 'gp' }
      ],
      lateral: B(['이천↔청주 장비 이설 전체에 확인서 적용', '용인 이설·반입 계획에 반영'], ['Apply the certificate to every Icheon–Cheongju move', 'Build it into Yongin move-in plans']),
      verify: [
        { k: B('반출 장비 확인서 부착률', 'Shipments with a certificate'), target: B('100%', '100 %') },
        { k: B('하역 중 약액 접촉', 'Chemical contact during unloading'), target: B('0건', '0') }
      ],
      lesson: B('위험은 설비와 함께 이동합니다. 장비를 옮길 때 잔류물 확인은 보내는 쪽의 책임입니다.', 'Hazards travel with the equipment. Proving it is empty is the sender’s job.'),
      sops: ['chem-supply', 'equip-move'], src: ['seoul0610']
    },
    {
      id: 'cj-2026-h3po4', site: 'cheongju', date: '2026-01-19', dateLabel: B('2026.1.19', '19 Jan 2026'),
      types: ['contact'], official: false,
      t: B('청주 폐수 배관 작업 중 폐인산 접촉', 'Waste phosphoric-acid contact during pipe work at Cheongju'),
      impact: B('작업자 5명 접촉 (검사 결과 이상 없음), 설비 가동 중단', '5 workers contaminated (no abnormal findings), equipment stopped'),
      facts: [
        { t: B('1.19 9시 40~50분경 청주 사업장 폐수 배관 구역에서 배관 작업 중 상부 배관에서 폐인산 약 30L가 떨어져 작업자 5명이 방진복 위로 접촉', 'Around 09:40–09:50 on 19 January, about 30 L of waste phosphoric acid dripped from an overhead pipe onto five workers (over their cleanroom suits) during pipe work in the Cheongju wastewater-pipe area'), src: ['jbnews0119'] },
        { t: B('병원·사내 의원 검사 결과 모두 이상 없음, 회사는 설비 가동을 중단하고 누출 물질을 폐기', 'Hospital and clinic checks found nothing abnormal; the company stopped the equipment and disposed of the spill'), src: ['jbnews0119'] }
      ],
      officialFindings: [],
      why: [
        { k: 'an', t: B('왜 접촉했나? → 작업 위치 위쪽 배관에서 약액이 떨어졌다', 'Why the contact? → Liquid fell from a pipe above the work position') },
        { k: 'an', t: B('왜 떨어졌나? → 상부 배관의 내용물·압력이 격리되지 않았을 가능성', 'Why did it fall? → The overhead pipe may not have been isolated') },
        { k: 'an', t: B('왜 격리하지 않았나? → 작업허가 범위가 작업 대상 배관에 한정되고 주변·상부 설비는 검토에서 빠졌을 가능성', 'Why not isolated? → The permit may have covered only the target pipe, not surrounding or overhead lines') },
        { k: 'an', t: B('왜 위험성평가에서 놓쳤나? → “상부 누액·낙하” 위험이 평가 항목에 없었을 가능성', 'Why missed in the assessment? → “Overhead leak/drop” may not have been an assessment item') },
        { k: 'an', t: B('근본 원인 → 동시·인접 설비 위험을 검토하는 체계 미흡', 'Root cause → Weak review of adjacent and simultaneous hazards') }
      ],
      m4: {
        man: B('상부 위험 인지 부족 (분석)', 'Overhead hazard not recognised (analysis)'),
        machine: B('상부 배관 누액 (보도)', 'Overhead pipe leak (reported)'),
        media: B('다층 배관이 밀집한 폐수 배관 구역', 'Dense multi-level piping in the wastewater area'),
        management: B('작업허가 범위·위험성평가 항목 (분석)', 'Permit scope and assessment items (analysis)')
      },
      barriers: { held: B(['즉시 가동 중단·검사'], ['Immediate shutdown and medical checks']), failed: B(['상부 배관 격리', '작업복의 화학물질 차단'], ['Overhead isolation', 'Chemical protection of workwear']) },
      exposure: null,
      risk: { before: { l: 3, s: 2 }, after: { l: 1, s: 2 }, why: B('전: 다층 배관 구역의 반복 작업(가능성 3), 폐인산 접촉(중대성 2) = 6점 — 화학물질 유형이라 SK하이닉스 기준상 집중관리 대상. 후: 상부 격리·누액 받이로 가능성 1', 'Before: routine work under multi-level piping (L3), acid contact (S2) = 6 — a chemical type, so a focus item under the SK hynix rule. After: overhead isolation and drip catchers for L1') },
      actions: [
        { lvl: 'eng', t: B('작업 구역 상부 배관 배액·격리, 누액 받이·차폐 설치', 'Drain and isolate overhead pipes; fit drip catchers and shields'), b: 'guide' },
        { lvl: 'adm', t: B('작업허가서에 “상부·인접 설비 확인” 항목 추가, 위험성평가에 “상부 누액” 항목 추가', 'Add “check overhead and adjacent equipment” to the permit and “overhead leak” to the assessment'), b: 'gp' },
        { lvl: 'ppe', t: B('방진복은 오염 방지용 — 약액 배관 작업은 내화학 보호구 기준을 적용', 'Cleanroom suits prevent contamination, not chemicals — use chemical PPE for wet-pipe work'), b: 'gp' }
      ],
      lateral: B(['폐수·약액 배관 구역의 모든 작업허가 양식 개정'], ['Revise permit forms for all wastewater and chemical pipe areas']),
      verify: [ { k: B('허가서 상부 확인 항목 기재율', 'Permits with the overhead check filled in'), target: B('100%', '100 %') } ],
      lesson: B('작업하는 배관만 보지 말고 머리 위를 보세요.', 'Don’t just look at the pipe you’re working on — look up.'),
      sops: ['line-break', 'wet-bench'], src: ['jbnews0119']
    },
    {
      id: 'ic-2015-n2', site: 'icheon', date: '2015-04-30', dateLabel: B('2015.4.30', '30 Apr 2015'),
      types: ['asphyx'], official: true,
      t: B('이천 M14 신축 현장 배기덕트 질소 질식', 'Nitrogen asphyxiation in an exhaust duct at the new M14 fab, Icheon'),
      impact: B('협력업체 작업자 3명 사망, 구조하던 동료 4명 경상', '3 contract workers died; 4 co-workers hurt while rescuing'),
      facts: [
        { t: B('4.30 12시 25분경 이천 M14(신축) 8층 배기덕트(약 5㎡, 깊이 3m) 내부를 오전 시운전 뒤 점검하던 작업자 3명이 질식해 모두 사망', 'About 12:25 on 30 April, three workers inspecting inside an 8th-floor exhaust duct (≈5 m², 3 m deep) at the new M14 fab after a morning test run were asphyxiated and died'), src: ['seoul2015'] },
        { t: B('밖에 있던 동료 4명이 들어가 구조했고, 이들도 두통 등 경상을 입음', 'Four co-workers went in to pull them out and also suffered headaches and minor injuries'), src: ['seoul2015'] },
        { t: B('대법원이 2021년 관계자들의 업무상과실치사 등을 유죄로 확정(책임자 3명 금고 6월·집행유예 1년 등)', 'In 2021 the Supreme Court upheld convictions for involuntary manslaughter and related charges (three managers: 6 months’ imprisonment, suspended for 1 year, among others)'), src: ['scourt2021', 'newsis2021'] }
      ],
      officialFindings: [
        { t: B('법원: 설비 정상가동이 늦어진다는 이유로 공기가 아닌 질소를 공급했고, 현장 관리자에게 질소 공급 사실을 명확히 알리지 않았으며, 안전점검·조치를 하지 않았다. 다른 공장 밀폐공간에서 질소 질식 사망 사고가 이미 있었음에도 교훈이 반영되지 않았다', 'Court: nitrogen instead of air was supplied because start-up was running late; site managers were not clearly told; safety checks and measures were not taken — despite an earlier nitrogen death in a confined space at another plant'), src: ['newsis2021'] },
        { t: B('법원: SK하이닉스가 공사 전반을 관리·감독하고 사고 원인인 질소를 직접 관리했다며 도급인 책임을 인정', 'Court: SK hynix managed the whole project and controlled the nitrogen itself, so it bore responsibility as the principal'), src: ['newsis2021'] }
      ],
      why: [
        { k: 'off', t: B('왜 질식했나? → 덕트 내부가 질소로 산소결핍 상태였다', 'Why asphyxiated? → The duct was oxygen-deficient with nitrogen') },
        { k: 'off', t: B('왜 질소가 있었나? → 가동 지연을 이유로 공기 대신 질소가 공급되고 있었다', 'Why nitrogen? → It was being supplied instead of air because of start-up delays') },
        { k: 'off', t: B('왜 몰랐나? → 질소 공급 사실이 현장 관리자에게 명확히 전달되지 않았다', 'Why unknown? → Site managers were not clearly told nitrogen was flowing') },
        { k: 'off', t: B('왜 막지 못했나? → 진입 전 산소농도 측정·감시·대피 조치 없이 점검이 진행됐다', 'Why not stopped? → Entry went ahead without oxygen testing, attendance or evacuation measures') },
        { k: 'an', t: B('근본 원인 → 시운전 일정 압박이 안전 절차보다 앞섰고, 앞선 질소 질식 사례의 교훈이 공유되지 않았다', 'Root cause → Schedule pressure outranked procedure, and lessons from an earlier nitrogen death were not shared') }
      ],
      m4: {
        man: B('측정 없이 진입, 보호구 없이 구조 진입', 'Entry without testing; rescue without respirators'),
        machine: B('질소 공급 라인이 격리되지 않음', 'Nitrogen line not isolated'),
        media: B('배기덕트 — 좁고 깊은 밀폐공간', 'Exhaust duct — a narrow, deep confined space'),
        management: B('정보 미공유, 일정 우선, 선행 사고 교훈 미반영 (법원 판단)', 'No information sharing, schedule first, lessons ignored (court)')
      },
      barriers: { held: B([], []), failed: B(['불활성가스 격리', '진입 전 측정', '감시인·비상연락', '구조자 보호구'], ['Inert-gas isolation', 'Pre-entry testing', 'Attendant and emergency contact', 'Rescuer respirators']) },
      exposure: null,
      risk: { before: { l: 4, s: 4 }, after: { l: 1, s: 4 }, why: B('전: 시운전 중 질소가 흐르는 덕트 진입(가능성 4), 사망(중대성 4) = 16점 A. 후: 격리·측정으로 가능성 1이 돼도 중대성 4는 그대로여서 4점(C 4–6)입니다. 가장 낮은 1–3 구간에 들어가려면 사람이 들어가지 않는 점검(제거)이 필요합니다', 'Before: entering a duct with nitrogen flowing during commissioning (L4), fatal (S4) = 16, A. After: isolation and testing bring L to 1, but S stays 4 → 4 (C 4–6). Reaching the lowest band (1–3) needs inspection without entry (elimination)') },
      actions: [
        { lvl: 'elim', t: B('덕트 내부 점검을 무진입 방식(카메라·로봇)으로 대체', 'Replace in-duct inspection with no-entry methods (cameras, robots)'), b: 'gp' },
        { lvl: 'eng', t: B('시운전 중 불활성가스 공급 라인 물리적 차단·잠금, 덕트 내 연속 산소 측정·경보', 'Physically isolate and lock inert-gas lines during commissioning; continuous O₂ monitoring with alarms'), b: 'guide', ref: 'B-M-25-2026' },
        { lvl: 'adm', t: B('작업 시작·재시작 전 산소·유해가스 측정·평가, 기록 3년 보존', 'Test O₂ and toxic gases before every start/restart; keep records 3 years'), b: 'law:안전보건규칙 제619조의2|Standards Rules Art. 619-2' },
        { lvl: 'adm', t: B('감시인 외부 배치, 이상 시 지체 없이 관할 소방관서에 신고하고 협조를 받아 조치 (2025.12 개정)', 'Post an attendant outside who, if anything goes wrong, reports at once to the local fire service and acts with its help (amended Dec 2025)'), b: 'law:안전보건규칙 제623조|Standards Rules Art. 623' },
        { lvl: 'adm', t: B('작업 전 위험성·측정·환기·보호구·비상연락·대피기구 주지와 숙지 여부 확인 (2025.12 개정)', 'Brief hazards, testing, ventilation, PPE, emergency contacts and escape equipment before work and confirm understanding (amended Dec 2025)'), b: 'law:안전보건규칙 제641조|Standards Rules Art. 641' },
        { lvl: 'adm', t: B('도급 시 작업 시작 전 안전·보건 정보 문서 제공 (질식 위험 작업 포함)', 'Give contractors written safety information before work, including asphyxiation risks'), b: 'law:법 제65조|Act Art. 65' },
        { lvl: 'ppe', t: B('구조 시 공기호흡기·송기마스크 없이 진입 금지', 'No rescue entry without SCBA or airline respirators'), b: 'law:안전보건규칙 제643조|Standards Rules Art. 643' }
      ],
      lateral: B(['전 사업장 덕트·스크러버·피트 밀폐공간 목록 갱신', '신규 Fab(용인·P&T7) 시운전 절차에 불활성가스 격리 확인 단계 추가'], ['Update the confined-space list (ducts, scrubbers, pits) at every site', 'Add inert-gas isolation checks to commissioning at new fabs (Yongin, P&T7)']),
      verify: [
        { k: B('진입 전 측정 기록 보존율', 'Pre-entry test records kept'), target: B('100% (3년)', '100 % (3 years)') },
        { k: B('무진입 점검 전환율', 'Share of inspections done without entry'), target: B('단계적 확대', 'Increasing') },
        { k: B('감시인 배치율', 'Jobs with an attendant'), target: B('100%', '100 %') }
      ],
      lesson: B('이 사고에서도 구조하러 들어간 4명이 증상을 호소했습니다. 보호구 없이 구조하러 들어가지 않는 것이 밀폐공간의 제1원칙입니다.', 'Here too, four rescuers were affected. Never go in to rescue without breathing apparatus — the first rule of confined spaces.'),
      sops: ['confined', 'loto'], src: ['seoul2015', 'newsis2021', 'scourt2021']
    },
    {
      id: 'cj-2013-cl2', site: 'cheongju', date: '2013-03-22', dateLabel: B('2013.3.22', '22 Mar 2013'),
      types: ['leak'], official: false,
      t: B('청주 M8 가스라인 작업 중 염소 누출과 신고 지연', 'Chlorine release during gas-line work at Cheongju M8, and late reporting'),
      impact: B('인명피해 없음, 약 100명 대피·라인 50분 중단, 신고 약 4시간 지연 논란', 'No injuries; ≈100 evacuated, line stopped 50 min; ≈4-hour reporting delay'),
      facts: [
        { t: B('3.22 10시 10분경 청주 M8라인(비메모리) 식각장비에 연결된 가스라인 밸브 공사 중 배관 접속부에서 염소가 약 30초간 소량 누출. 협력업체 4명·직원 1명 작업, 사내 부속병원 진찰 결과 이상 없음', 'About 10:10 on 22 March, a small amount of chlorine leaked for about 30 seconds from a pipe joint during valve work on a gas line to an etch tool on the M8 (non-memory) line; four contractors and one employee were working; clinic checks found no problems'), src: ['etoday2013', 'seoul2013'] },
        { t: B('약 100명 대피, 생산라인 약 50분 중단. 누출 직후 신고하지 않아 약 4시간 뒤 익명 제보로 당국이 인지 — 회사는 “피해가 없고 극소량이라 신고하지 않았다”고 설명', 'About 100 evacuated and the line stopped for about 50 minutes. It was not reported; authorities learned of it about 4 hours later from an anonymous tip. The company said it did not report because there was no harm and the amount was tiny'), src: ['seoul2013'] },
        { t: B('보도에 따르면 환경당국은 “가스밸브를 잠그고 작업하는 기초적 안전상식이 지켜지지 않은 것 같다”고 언급, 회사는 사과', 'Environmental officials were quoted as saying basic practice — closing the gas valve before work — seemed not to have been followed; the company apologised'), src: ['seoul2013', 'etoday2013'] }
      ],
      officialFindings: [],
      why: [
        { k: 'an', t: B('왜 누출됐나? → 배관 접속부가 열리면서 라인 내 염소가 새어 나왔다', 'Why the release? → Chlorine in the line escaped when the joint opened') },
        { k: 'an', t: B('왜 라인에 가스가 있었나? → 작업 전 밸브 차단·퍼지로 라인을 비우지 않았을 가능성 (당국 발언 보도)', 'Why was gas in the line? → Valves may not have been closed and the line purged first (as officials were quoted)') },
        { k: 'an', t: B('왜 확인하지 않았나? → 라인 개방 전 격리·잔압 확인 절차가 없었거나 지켜지지 않았을 가능성', 'Why not checked? → An isolation and residual-pressure check before opening may have been missing or skipped') },
        { k: 'an', t: B('왜 늦게 신고했나? → “인명피해가 없으면 신고하지 않아도 된다”는 현장 판단', 'Why reported late? → A field judgement that no-injury events need not be reported') },
        { k: 'an', t: B('근본 원인 → 누출 보고 기준을 현장 판단에 맡긴 구조', 'Root cause → Leaving leak reporting to on-the-spot judgement') }
      ],
      m4: {
        man: B('밸브 미차단 상태 작업 (보도)', 'Working without closing the valve (reported)'),
        machine: B('배관 접속부(유니온)', 'Pipe joint (union)'),
        media: B('식각장비 연결 가스라인', 'Gas line feeding an etch tool'),
        management: B('격리 확인 절차, 누출 보고 기준', 'Isolation checks; reporting rules')
      },
      barriers: { held: B(['자체 정화 시스템 처리(회사 설명)', '대피'], ['On-site scrubbing (company account)', 'Evacuation']), failed: B(['작업 전 격리', '즉시 보고'], ['Isolation before work', 'Immediate reporting']) },
      exposure: null,
      risk: { before: { l: 3, s: 3 }, after: { l: 1, s: 2 }, why: B('전: 가스라인 개방 작업의 격리 미흡(가능성 3), 독성가스 흡입(중대성 3). 후: 격리·퍼지·잔압 확인으로 가능성 1, 소량·단시간 노출로 중대성 2', 'Before: line opening without isolation (L3), toxic inhalation (S3). After: isolation, purge and pressure checks for L1; brief small exposure for S2') },
      actions: [
        { lvl: 'eng', t: B('작업 전 상·하류 밸브 차단·잠금, 퍼지 후 잔압 확인', 'Close and lock upstream and downstream valves; purge and confirm no pressure'), b: 'guide', ref: 'B-M-25-2026' },
        { lvl: 'adm', t: B('가스라인 개방은 배관 개방(Line Breaking) 허가 대상으로 운영', 'Run gas-line opening under a line-breaking permit'), b: 'gp' },
        { lvl: 'adm', t: B('누출은 규모와 관계없이 즉시 보고하고, 대외 신고 판단은 현장이 아닌 비상대응 조직이 결정', 'Report every release at once regardless of size; the emergency organisation, not the field, decides on external reporting'), b: 'gp' },
        { lvl: 'ppe', t: B('가스라인 작업 시 호흡보호구 준비', 'Respirators ready for gas-line work'), b: 'gp' }
      ],
      lateral: B(['독성가스 라인 작업 전체에 격리 체크리스트 적용'], ['Apply the isolation checklist to all toxic-gas line work']),
      verify: [ { k: B('누출 발생 → 비상조직 보고 시간', 'Time from release to emergency-team report'), target: B('즉시 (지연 0건)', 'Immediate (no delays)') } ],
      lesson: B('작은 누출도 즉시 보고해야 신뢰가 지켜집니다. 늦은 보고는 사고 자체보다 큰 신뢰 비용을 만듭니다.', 'Report even small releases at once. Late reporting costs more trust than the incident itself.'),
      sops: ['line-break', 'gas-cylinder'], src: ['seoul2013', 'etoday2013']
    },
    {
      id: 'ic-2021-hf', site: 'icheon', date: '2021-04-06', dateLabel: B('2021.4.6', '6 Apr 2021'),
      types: ['contact'], official: false,
      t: B('이천 장비 점검 중 불산 비산', 'Hydrofluoric acid splash during equipment inspection at Icheon'),
      impact: B('3명 부상 — 협력업체 직원 1명 팔·다리 화상, 2명 흡입 (생명 지장 없음)', '3 hurt — one contractor with arm and leg burns, two inhaled (not life-threatening)'),
      facts: [
        { t: B('4.6 11시 35분경 이천 공장 5층에서 장비 점검 중 불산이 튀어 협력업체 직원 2명·SK하이닉스 직원 1명 부상. 협력업체 직원 1명은 팔·다리 화상, 2명은 흡입', 'About 11:35 on 6 April, HF splashed during equipment inspection on the 5th floor at Icheon, injuring two contractors and one employee; one contractor had arm and leg burns, two inhaled it'), src: ['aju2021'] },
        { t: B('회사는 “누출이 아니라 (작업자에게) 튄 것”이라며 책임 소재를 파악 중이라고 설명', 'The company said it was a splash onto workers, not a leak, and that responsibility was being examined'), src: ['aju2021'] }
      ],
      officialFindings: [],
      why: [
        { k: 'an', t: B('왜 튀었나? → 점검 중 장비 내부에 남은 불산이 노출됐다', 'Why the splash? → HF left in the tool was exposed during inspection') },
        { k: 'an', t: B('왜 남아 있었나? → 개방 전 배액·세정·확인이 부족했을 가능성', 'Why left inside? → Draining, rinsing and verification before opening may have been insufficient') },
        { k: 'an', t: B('왜 다쳤나? → 비산 방지와 보호구 수준이 불산 특성(피부 흡수·지연 독성)에 못 미쳤을 가능성', 'Why injured? → Splash control and PPE may not have matched HF’s hazards (skin absorption, delayed toxicity)') },
        { k: 'an', t: B('근본 원인 → PM 작업의 잔류 약액 관리 기준 미흡', 'Root cause → Weak rules for residual chemicals in maintenance work') }
      ],
      m4: {
        man: B('잔류물 확인 없이 점검 진행 (분석)', 'Inspection without residue check (analysis)'),
        machine: B('장비 내부 잔류 불산', 'HF left inside the tool'),
        media: B('Fab 장비 점검(PM) 작업', 'Fab equipment maintenance'),
        management: B('PM 전 배액·세정 확인 기준 (분석)', 'Pre-PM drain and rinse rules (analysis)')
      },
      barriers: { held: B(['즉시 당국 신고·조사 (보도)'], ['Reported to authorities at once (reported)']), failed: B(['잔류물 제거', '비산 방지·보호구'], ['Residue removal', 'Splash control and PPE']) },
      exposure: null,
      risk: { before: { l: 3, s: 4 }, after: { l: 1, s: 4 }, why: B('전: PM 중 잔류 불산 노출(가능성 3), 피부 흡수·저칼슘혈증 위험(중대성 4). 후: 배액·세정 확인으로 가능성 1 — 불산의 중대성 4는 남으므로 개방이 필요 없는 설계·원격 세정 검토', 'Before: residual HF during PM (L3), skin absorption and hypocalcaemia risk (S4). After: verified drain and rinse for L1 — S4 remains, so consider designs that avoid opening or allow remote rinsing') },
      actions: [
        { lvl: 'eng', t: B('개방 전 배액·순수 세척·확인 절차와 비산 방지 커버', 'Drain, rinse with ultrapure water and verify before opening; splash covers'), b: 'guide' },
        { lvl: 'adm', t: B('불산 작업 전 응급처치 준비 확인 — ICSC: 중독 시 특이 치료가 필요', 'Confirm HF first-aid readiness before work — ICSC: specific treatment is needed'), b: 'guide' },
        { lvl: 'ppe', t: B('전신 내화학 보호복·안면보호', 'Full chemical suit and face protection'), b: 'gp' }
      ],
      lateral: B(['불산 사용 장비의 모든 PM 절차서에 잔류 확인 단계 반영'], ['Add a residue check to every PM procedure on HF equipment']),
      verify: [ { k: B('PM 전 잔류 확인 기록률', 'PM jobs with residue checks recorded'), target: B('100%', '100 %') } ],
      lesson: B('“누출이 아니라 튄 것”이어도 사람이 다쳤다면 막아야 할 사고입니다.', '“A splash, not a leak” still hurt people — it still has to be prevented.'),
      sops: ['pm-chamber', 'wet-bench', 'chem-supply'], src: ['aju2021']
    },
    {
      id: 'ic-2019-fall', site: 'icheon', date: '2019-05-20', dateLabel: B('2019.5.20', '20 May 2019'),
      types: ['fall'], official: false,
      t: B('이천 사업장 내 건설현장 고소작업 추락', 'Fall from height at a construction site on the Icheon campus'),
      impact: B('작업자 1명 사망 (보도)', '1 worker died (reported)'),
      facts: [
        { t: B('5.20 이천 사업장 직원 주차장 관리동 건설 현장(시공사 SK건설)에서 고소작업차 위에서 외벽 패널 작업을 하던 작업자가 약 9m 아래로 추락해 사망한 것으로 노동 전문지가 보도(건설노조 성명 인용)', 'A labour paper reported (citing a construction-union statement) that on 20 May a worker fitting wall panels from an aerial work vehicle at a staff car-park building site on the Icheon campus (contractor: SK E&C) fell about 9 m and died'), src: ['labortoday2019'] },
        { t: B('사고 원인에 대한 공식 조사 결과는 확인하지 못했습니다', 'No official investigation result could be found'), src: [] }
      ],
      officialFindings: [],
      why: [
        { k: 'an', t: B('왜 추락했나? → 고소작업 중 추락 방지 장치가 역할을 하지 못했다 (세부 원인 미확인)', 'Why the fall? → Fall protection did not hold during work at height (details unconfirmed)') },
        { k: 'an', t: B('왜 막지 못했나? → 작업대·안전대·부착설비의 작업 전 점검이 충분했는지 확인 필요', 'Why not prevented? → Whether platforms, harnesses and anchors were checked before work needs verifying') },
        { k: 'an', t: B('근본 원인 → 사업장 안 건설공사를 도급인의 순회·합동 점검 범위로 충분히 관리했는지 점검 필요', 'Root cause → Whether on-campus construction was fully covered by the principal’s rounds and joint inspections') }
      ],
      m4: {
        man: B('세부 미확인', 'Not confirmed'), machine: B('고소작업차·안전대 (보도)', 'Aerial vehicle, harness (reported)'),
        media: B('외벽 패널 고소작업', 'Façade work at height'), management: B('건설 도급 안전관리 (분석)', 'Construction subcontract safety (analysis)')
      },
      barriers: { held: B([], []), failed: B(['추락 방지'], ['Fall protection']) },
      exposure: null,
      risk: { before: { l: 3, s: 4 }, after: { l: 1, s: 4 }, why: B('추락은 중대성 4(사망). 가능성을 1로 낮춰도 4점이므로, 지상 조립 등 고소작업 자체를 줄이는 설계가 우선입니다', 'Falls are S4 (fatal). Even at L1 the score is 4, so designing out work at height (e.g. ground assembly) comes first') },
      actions: [
        { lvl: 'elim', t: B('패널 지상 조립·모듈화로 고소작업 시간 축소', 'Pre-assemble panels on the ground to cut time at height'), b: 'gp' },
        { lvl: 'eng', t: B('작업대 난간·안전대 부착설비 작업 전 점검', 'Pre-use checks of platform rails and anchor points'), b: 'guide', ref: 'C-74-2015' },
        { lvl: 'adm', t: B('사업장 내 건설공사를 순회점검(2일 1회)·합동점검 대상에 포함', 'Include on-campus construction in site rounds (every 2 days) and joint inspections'), b: 'law:시행규칙 제80조·제82조|Enforcement Rule Art. 80, 82' }
      ],
      lateral: B(['증설 현장(용인·P&T7) 고소작업 관리 기준 통일'], ['Unify work-at-height rules across expansion sites (Yongin, P&T7)']),
      verify: [ { k: B('고소작업 전 점검 기록률', 'Work-at-height pre-checks recorded'), target: B('100%', '100 %') } ],
      lesson: B('사업장 안 건설현장도 도급인의 안전관리 범위입니다.', 'Construction inside the campus is still the principal’s safety responsibility.'),
      sops: ['height', 'equip-move'], src: ['labortoday2019']
    },
    /* ---------- 업계 사례: 정부 공식 조사 결과가 공개된 타사 사고만 싣는다 ---------- */
    {
      id: 'peer-2024-xray', site: 'common', peer: B('업계 사례 · 삼성전자 기흥', 'Industry case · Samsung Giheung'), date: '2024-05-27', dateLabel: B('2024.5.27 (원안위 조사결과 9.26)', '27 May 2024 (NSSC findings 26 Sep)'),
      types: ['rad'], official: true,
      t: B('[업계 사례] 삼성전자 기흥 X선 분석장비 정비 중 방사선 피폭', '[Industry case] Radiation exposure while servicing an X-ray analyser at Samsung Giheung'),
      impact: B('정비작업자 2명 손 피부 등가선량이 선량한도(연 0.5 Sv)를 넘음(94 Sv·28 Sv), 1명은 전신 유효선량 한도(연 50 mSv)도 넘음', 'Two maintenance workers exceeded the skin (hand) dose limit of 0.5 Sv/yr (94 Sv and 28 Sv); one also exceeded the 50 mSv/yr whole-body limit'),
      facts: [
        { t: B('2024.5.27 정비작업자 2명이 전원을 켠 상태로 캐비닛형 방사선발생장치(웨이퍼에 도포된 화학물질 두께를 재는 X선 형광분석장비)의 차폐체(셔터베이스)를 떼어내고 내부 확인·사진 촬영을 함', 'On 27 May 2024 two maintenance workers removed the shield (shutter base) of a cabinet X-ray fluorescence analyser — used to measure chemical film thickness on wafers — with the power on, then looked inside and took photos'), src: ['nsscSamsung'] },
        { t: B('셔터베이스 인터락이 작동하지 않아 약 14분간 방사선이 방출된 것으로 추정. 작업자들은 장비 전면 표시등을 보고 방출을 알아채 전원을 껐고, 다음 날 부종을 느껴 보고한 뒤 병원으로 이송됨', 'The shutter-base interlock did not work and radiation was emitted for an estimated 14 minutes. The workers noticed from the front panel light and switched off; the next day they felt swelling, reported it and were taken to hospital'), src: ['nsscSamsung'] },
        { t: B('선량 평가: 피폭자 A 피부 등가선량 94 Sv(전신 15 mSv), B 28 Sv(전신 130 mSv). 주변 일반작업자 12명은 일반인 연간 한도(1 mSv) 미만', 'Dose assessment: worker A 94 Sv skin (15 mSv whole body), worker B 28 Sv skin (130 mSv whole body). Twelve nearby workers stayed below the public limit of 1 mSv/yr'), src: ['nsscSamsung'] },
        { t: B('원안위는 해당 장비 사용정지(5.29)와 동일 모델 7대 정비 중지(6.4)를 명령하고, 기흥사업장 방사선기기 694대 특별점검과 삼성전자 전 사업장 방사선발생장치 147대 인터락 점검을 실시', 'NSSC ordered the unit out of use (29 May) and maintenance on the seven other units of the model halted (4 Jun), then inspected all 694 radiation devices at Giheung and the interlocks of 147 X-ray generators across the company'), src: ['nsscSamsung'] }
      ],
      officialFindings: [
        { t: B('인터락 미작동 원인: 사건 전부터 인터락 스위치 접점이 벌어져 있고 배선이 바뀌어 있어 셔터베이스를 떼도 X선이 차단되지 않았음. 교체·재장착 과정에서 X선이 나오지 않자 나오도록 배선을 바꾼 것으로 추정(변경 시점·인물은 확인 불가). 동일 모델 7대 중 2대에서도 같은 오류가 발견됨', 'Why the interlock failed: before the event the switch contacts were apart and the wiring had been changed, so removing the shutter base did not cut the X-rays. NSSC believes the wiring was altered to restore X-ray output after a part swap (when and by whom could not be established). Two of the seven other units had the same fault'), src: ['nsscSamsung'] },
        { t: B('경고등(작은 LED로 교체)은 식별이 어려웠고, 정비 때 방사선안전관리자의 검토·승인 절차가 없었으며, 절차서의 진입조건(X선 정지)과 달리 X선이 켜진 채 정비함. 판매사 유지보수 설명서와 제작사 안전수칙(인터락 임의 해제 금지 등)도 지켜지지 않음', 'The warning light (replaced with a small LED) was hard to see; maintenance needed no review or approval by the radiation safety officer; work was done with X-rays on although the procedure required them off; the vendor’s maintenance manual and the maker’s rules (never defeat interlocks) were not followed'), src: ['nsscSamsung'] },
        { t: B('원자력안전법 위반: 연동장치 임의 해제(제59조①, 기술기준 규칙 제63조의3 — 과태료 최대 450만원), 방사선장해방지조치 미준수(제91조 — 최대 600만원)', 'Nuclear Safety Act breaches: defeating the interlock (Art. 59(1), technical rule Art. 63-3 — fine up to KRW 4.5 m) and failing to prevent radiation injury (Art. 91 — up to KRW 6 m)'), src: ['nsscSamsung'] }
      ],
      why: [
        { k: 'off', t: B('왜 피폭됐나? → 전원이 켜진 장비의 차폐체를 떼고 내부에서 작업했다', 'Why the exposure? → The shield was removed and work done inside a powered unit') },
        { k: 'off', t: B('왜 X선이 멈추지 않았나? → 인터락 배선이 바뀌어 차폐체를 떼도 전원이 차단되지 않았다', 'Why didn’t the X-rays stop? → Altered interlock wiring meant removing the shield did not cut power') },
        { k: 'off', t: B('왜 알아채지 못했나? → 경고등이 작아 식별이 어려웠고, 작업 전 인터락 작동을 확인하지 않았다', 'Why unnoticed? → The warning light was hard to see and no one checked the interlock first') },
        { k: 'off', t: B('왜 그렇게 정비했나? → 처음 하는 작업에 맞는 절차가 없었고, 방사선안전관리자 검토·승인 없이 부서 공유만으로 작업을 시작했다', 'Why work that way? → There was no procedure for this first-time job, and it started with a team note instead of review by the radiation safety officer') },
        { k: 'an', t: B('근본 원인 → 인터락을 바꿔도 드러나지 않는 구조(변경 이력·작동 확인 부재)와 방사선안전관리자의 실질적 관리감독 미흡 — 원안위도 관리감독 체계 미흡을 지적', 'Root cause → Interlock changes could go unnoticed (no change history or function checks) and the radiation safety officer had little real oversight — a gap NSSC also named') }
      ],
      m4: {
        man: B('전원을 켠 채 차폐체 탈거·내부 작업 (공식)', 'Shield removed and work done with power on (confirmed)'),
        machine: B('인터락 배선 변경·접점 이격, 식별이 어려운 경고등 (공식)', 'Altered interlock wiring and gapped contacts; hard-to-see warning light (confirmed)'),
        media: B('처음 하는 정비 작업, 맞는 절차 없음 (공식)', 'First-time maintenance with no specific procedure (confirmed)'),
        management: B('방사선안전관리자 검토·승인 부재, 판매사 자료 미활용 (공식)', 'No radiation-safety review or approval; vendor information unused (confirmed)')
      },
      barriers: { held: B(['장비 전면 표시등으로 방출을 알아채 작업 중지', '다음 날 보고·병원 이송, 규제기관 보고'], ['Front panel light noticed and work stopped', 'Reported the next day, hospital care, regulator informed']), failed: B(['셔터베이스 인터락', '경고등 식별', '정비 전 X선 정지(절차 진입조건)', '방사선안전관리자 승인'], ['Shutter-base interlock', 'Visible warning light', 'X-rays off before maintenance (procedure entry condition)', 'Radiation safety officer approval']) },
      exposure: null,
      risk: { before: { l: 3, s: 4 }, after: { l: 1, s: 4 }, why: B('전: 인터락이 무력화된 채 전원을 켜고 정비(가능성 3), 국소 고선량 피폭(중대성 4). 후: 배선 오체결 방지·정비 전 전원 차단·인터락 확인으로 가능성 1 — 중대성 4는 남으므로 전원이 켜진 상태의 정비 자체를 없애는 것이 핵심', 'Before: maintenance on a powered unit with a defeated interlock (L3), high local dose (S4). After: tamper-proof wiring, power-off entry condition and interlock checks for L1 — S4 remains, so the key is to eliminate work on powered units altogether') },
      actions: [
        { lvl: 'elim', t: B('정비는 X선 전원을 차단한 상태에서만 하도록 절차 진입조건을 강제하고, 전원이 필요한 작업은 제작사·판매사 전문 인력에 맡김 (사업자 시정계획: 전문업체 작업·전원 제거 절차 보완)', 'Allow maintenance only with X-ray power isolated; hand powered work to the maker or vendor (operator’s corrective plan: specialist contractors, power-removal step)'), b: 'guide' },
        { lvl: 'eng', t: B('인터락 배선 오체결 방지 — 우회 연결 단자 제거, 핀 타입을 나사 체결 방식으로 변경 (사업자 시정조치)', 'Tamper-proof interlock wiring — remove bypass terminals, change pin connectors to screw terminals (operator’s corrective action)'), b: 'guide' },
        { lvl: 'eng', t: B('경고등을 멀리서도 보이도록 개선', 'Make the warning light visible from a distance'), b: 'guide' },
        { lvl: 'adm', t: B('방사선기기 정비는 방사선안전관리자 검토·승인 후 착수하고, 판매사 사용설명서·안전수칙을 절차서로 만들어 씀 (원안위 요구)', 'Start radiation-device maintenance only after the radiation safety officer’s review and approval, and turn the vendor manual and safety rules into procedures (NSSC requirement)'), b: 'guide' },
        { lvl: 'adm', t: B('작업 전 인터락 작동 확인을 체크리스트에 넣고, 인터락 변경은 변경관리(MOC) 대상으로 이력 관리', 'Put an interlock function check on the pre-job checklist and treat any interlock change as a managed change with history'), b: 'gp' },
        { lvl: 'ppe', t: B('정비작업자 개인선량계 착용', 'Personal dosimeters for maintenance staff'), b: 'guide' }
      ],
      lateral: B(['X선 형광분석기·이온주입기 등 방사선이 나오는 장비의 인터락 전수 점검', '정비 이력에 인터락 관련 작업 여부 기록', '방사선안전관리자 교육 강화 등 원안위 제도개선 반영 여부 확인'], ['Check every interlock on X-ray analysers, implanters and other radiation-emitting tools', 'Record any interlock work in the maintenance history', 'Check whether NSSC’s follow-up reforms (e.g. more training for radiation safety officers) have been adopted']),
      verify: [
        { k: B('정비 전 인터락 작동 확인 기록률', 'Maintenance jobs with an interlock check recorded'), target: B('100%', '100 %') },
        { k: B('방사선안전관리자 승인 없이 시작한 정비', 'Maintenance started without radiation-safety approval'), target: B('0건', '0') }
      ],
      lesson: B('안전장치가 “안 돼서” 우회한 순간 그 장비는 차폐 없는 방사선원이 됩니다. 인터락은 고치는 대상이지 우회하는 대상이 아닙니다.', 'The moment a safety device is bypassed “because it wasn’t working”, the tool becomes an unshielded radiation source. Interlocks are to be fixed, never bypassed.'),
      sops: ['xray', 'implant', 'loto'], src: ['nsscSamsung']
    },

    /* ---------- 정부 재해조사보고서 (산안법 제56조의2, 고용노동부 공개 51건 중 신규 SOP와 연결되는 사례) — 타 업종 ---------- */
    {
      id: 'gov-2024-elec', site: 'common', peer: B('정부 재해조사보고서 · 건설업(전기공사)', 'Government investigation report · construction (electrical)'), date: '2024-01-08', dateLabel: B('2024.1.8 (2026.5.26 공개)', '8 Jan 2024 (published 26 May 2026)'),
      types: ['shock', 'burn'], official: true,
      t: B('[정부 보고서] 충남 서천 몰드변압기 감전 사고 — 특고압 수배전반 아크 화상 사망', '[Government report] Seocheon cast-resin transformer electrocution — fatal arc burn at a high-voltage switchboard'),
      impact: B('전기공 1명 사망 (전기화상 약 30%, 다음 날 사망)', 'One electrician died (about 30 % burns; died the next day)'),
      facts: [
        { t: B('식품공장 증축동 3층 전기실에서 방화폼패드를 설치할 공간을 만들려고 저압·고압 수배전반 사이 전면패널의 고정볼트를 풀던 전기공이, 전원을 차단하지 않은 특고압(22.9kV) 수배전반 안 파워퓨즈 충전부에서 발생한 아크로 화상을 입음', 'An electrician removing panel bolts between the low- and high-voltage switchboards, to make room for fire-stopping pads, was burned by an arc from the energised 22.9 kV power fuses inside the HV board'), src: ['moelRpt'] },
        { t: B('고압 수배전반은 평소 잠겨 있었지만 전기실의 모든 반을 여는 마스터키로 재해자가 열었음. 당일 저압반은 기중차단기(ACB)로 차단했다고 함', 'The HV board was normally locked, but was opened with a master key that fits every panel in the room; the low-voltage board had reportedly been isolated at its ACB'), src: ['moelRpt'] },
        { t: B('패널 문에서 파워퓨즈까지 수평거리 약 77.3cm — 22.9kV의 접근한계거리 90cm(안전보건규칙 제321조) 안. 재해자는 절연용 보호구 없이 반코팅 장갑을 끼고 있었음', 'The power fuses were about 77.3 cm from the panel door — inside the 90 cm approach limit for 22.9 kV (Standards Rules Art. 321). The victim wore coated cotton gloves, no insulating PPE'), src: ['moelRpt', 'lawStd'] },
        { t: B('전기실 정전작업·활선 근접작업의 위험성평가와 전기작업 작업계획서가 없었고, 발주처는 분리 발주한 전기공사의 재해예방 기술지도 계약을 맺지 않았음', 'No risk assessment for isolation or work near live parts in the room and no electrical work plan; the client had not contracted accident-prevention technical guidance for the separately awarded electrical work'), src: ['moelRpt'] }
      ],
      officialFindings: [
        { t: B('사고 원인(조사자 의견): 해당 전로의 전원 차단 미실시, 충전전로 접근한계거리 이내 작업(마스터키로 임의 개방이 가능한데 관리감독·사전훈련 미흡), 절연용 보호구 미지급·착용지도 미실시', 'Causes (investigator): the circuit was not isolated; work inside the approach limit (panels could be opened with a master key, with weak supervision and training); insulating PPE not issued or enforced'), src: ['moelRpt'] },
        { t: B('권고: 활선·활선근접작업은 원칙적으로 금지하고 정전작업 가능 여부 먼저 확인, 고압반은 지정 관리책임자 외 개방 불가, 유자격자·사전 작업허가, 방염 작업복·고무절연소매·절연장갑, 전기 작업절차서와 작업계획', 'Recommendations: no live or near-live work in principle — check isolation first; only a named custodian opens HV boards; qualified staff and a prior permit; flame-resistant clothing, rubber sleeves and insulating gloves; an electrical procedure and work plan'), src: ['moelRpt'] }
      ],
      why: [
        { k: 'off', t: B('왜 화상을 입었나? → 특고압 충전부 근처에서 볼트를 풀다 아크가 발생했다', 'Why the burn? → An arc struck while bolts were undone next to live 22.9 kV parts') },
        { k: 'off', t: B('왜 충전부 근처에서 작업했나? → 전원을 차단하지 않은 고압반을 열고 접근한계거리 안에서 작업했다', 'Why so close? → An energised HV board was opened and the work was inside the approach limit') },
        { k: 'off', t: B('왜 열 수 있었나? → 모든 반을 여는 마스터키가 쓰였고, 개방을 통제하는 규칙이 없었다', 'Why could it be opened? → A master key fitted every panel and nothing controlled who opened them') },
        { k: 'off', t: B('왜 통제되지 않았나? → 전기실 안 작업의 위험성평가·작업계획서·작업허가가 없었다', 'Why no control? → No risk assessment, work plan or permit for work in the electrical room') },
        { k: 'an', t: B('근본 원인 → “전기 작업이 아닌” 방화재 작업으로 여겨져 전기 위험 관리 절차 밖에서 진행됐다 (포털 분석)', 'Root cause → The job was seen as fire-stopping, not electrical work, so it ran outside electrical controls (portal analysis)') }
      ],
      m4: {
        man: B('전원 차단 없이 특고압반 개방·볼트 해체 (보고서)', 'Opened an energised HV board and undid bolts (report)'),
        machine: B('문 쪽으로 돌출된 파워퓨즈, 모든 반을 여는 마스터키 (보고서)', 'Power fuses projecting towards the door; one master key for every panel (report)'),
        media: B('설계 변경 등으로 수시로 생기는 간헐 작업, 좁은 작업 공간 (보고서)', 'Odd jobs arising from design changes; cramped space (report)'),
        management: B('위험성평가·작업계획서·작업허가 부재, 기술지도 미체결 (보고서)', 'No risk assessment, work plan or permit; no technical guidance contract (report)')
      },
      barriers: { held: B(['동료가 곧바로 발견하고 119 신고·이송'], ['A co-worker found him at once and called 119']), failed: B(['전로 차단', '접근한계거리', '절연용 보호구', '고압반 개방 통제', '작업계획서·허가'], ['Isolation', 'Approach limit', 'Insulating PPE', 'Control over opening HV boards', 'Work plan and permit']) },
      exposure: null,
      risk: { before: { l: 3, s: 4 }, after: { l: 1, s: 4 }, why: B('전: 전기실 안 비전기 작업이 통제 없이 반복(가능성 3), 특고압 아크(중대성 4). 후: 정전 원칙·개방 통제·허가로 가능성 1 — 중대성은 그대로이므로 정전 원칙이 핵심', 'Before: uncontrolled non-electrical work in the room (L3), HV arc (S4). After: isolation-first, panel control and permits for L1 — severity stays, so isolation-first is the key') },
      actions: [
        { lvl: 'elim', t: B('전기실 안 작업은 정전작업을 원칙으로 하고, 활선 근접작업은 제319조① 예외에 해당할 때만 허가', 'Make isolation the rule for any work in electrical rooms; allow near-live work only under the Art. 319(1) exceptions'), b: 'law:안전보건규칙 제319조①|Standards Rules Art. 319(1)' },
        { lvl: 'eng', t: B('고압·특고압반은 개별 잠금으로 바꾸고 지정 관리책임자만 열쇠 보관 (마스터키 폐지)', 'Individual locks on HV boards with keys held only by the named custodian (no master key)'), b: 'guide' },
        { lvl: 'adm', t: B('전압별 접근한계거리를 패널·바닥에 표시하고, 활선 근접작업은 유자격자와 사전 작업허가로만', 'Mark approach limits by voltage on panels and floors; near-live work only by qualified staff under a permit'), b: 'law:안전보건규칙 제318조·제321조|Standards Rules Arts. 318, 321' },
        { lvl: 'adm', t: B('50V·250VA를 넘는 전기작업은 작업계획서, 전기실 안 비전기 작업에는 전기 담당 입회', 'A work plan for electrical work above 50 V or 250 VA; an electrical attendant for any non-electrical work in the room'), b: 'law:안전보건규칙 제38조①5|Standards Rules Art. 38(1)5' },
        { lvl: 'ppe', t: B('방염 작업복, 고무절연소매, 절연장갑 지급·착용 확인', 'Issue flame-resistant clothing, rubber sleeves and insulating gloves and check they are worn'), b: 'law:안전보건규칙 제323조|Standards Rules Art. 323' }
      ],
      lateral: B(['Fab 유틸리티 수변전실의 마스터키·열쇠 관리 현황 점검', '방화구획 관통부 보수 등 전기실 안 협력사 작업의 허가·입회 여부 확인', '전압별 접근한계거리 표시 상태 점검'], ['Review master keys and key control in fab utility substations', 'Check that contractor jobs in electrical rooms (e.g. fire-stopping) have permits and an attendant', 'Check approach-limit markings by voltage']),
      verify: [
        { k: B('고압반 개방 시 허가서 첨부율', 'HV-board openings with a permit'), target: B('100%', '100 %') },
        { k: B('무허가 활선 근접작업', 'Near-live work without a permit'), target: B('0건', '0') }
      ],
      lesson: B('전기실 안에서는 방화재 작업도 전기 작업입니다. 문을 열기 전에 전원 차단과 접근한계거리부터 확인하세요.', 'Inside an electrical room, even fire-stopping is electrical work. Before opening a door, isolate and check the approach limit.'),
      sops: ['live-elec', 'loto'], src: ['moelRpt', 'lawStd']
    },
    {
      id: 'gov-2024-forklift', site: 'common', peer: B('정부 재해조사보고서 · 가구 생산 사업장·보세창고', 'Government investigation reports · furniture plant and bonded warehouse'), date: '2024-04-03', dateLabel: B('2024.2.1 · 4.3 (2026.5.26 공개)', '1 Feb & 3 Apr 2024 (published 26 May 2026)'),
      types: ['caught'], official: true,
      t: B('[정부 보고서] 지게차 끼임 사망 2건 — 사람을 태운 사용, 경사로 밀림', '[Government reports] Two fatal forklift crushes — lifting a person, rolling on a slope'),
      impact: B('작업자 2명 사망', 'Two workers died'),
      facts: [
        { t: B('2024.4.3 경기 남양주 가구 제조 사업장: 재해자가 입승식 지게차 포크에 끼운 팔레트에 올라탄 채 지게차를 조종하다 백레스트와 마스트 사이에 목·몸통이 끼여 이틀 뒤 사망. 포크 조작레버를 PP밴드로 묶는 등 조종장치를 임의 개조해 운전석이 아닌 곳에서 조종', 'Namyangju furniture plant, 3 Apr 2024: the victim rode a pallet on the forks of a stand-on truck while operating it, and was caught between the backrest and mast; he died two days later. The levers had been tied with strapping so the truck could be driven from off the seat'), src: ['moelRpt'] },
        { t: B('2024.2.1 인천 중구 보세창고: 4.5톤 지게차로 3톤 합판묶음을 적재하던 재해자가 벽과 합판 사이에 끼여 사망. 바닥 구배 때문에 포크에 하중을 실은 채 시동을 끄고 주차브레이크를 걸어도 지게차가 서서히 밀려 내려감을 재연시험으로 확인', 'Incheon bonded warehouse, 1 Feb 2024: a worker stacking a 3 t plywood bundle with a 4.5 t truck was crushed between the wall and the load. A re-enactment showed that, on the sloping floor, the laden truck crept forward even with the engine off and parking brake on'), src: ['moelRpt'] }
      ],
      officialFindings: [
        { t: B('남양주 원인: 조작레버 임의 개조·운전석 외 조종, 적재·하역 외 목적(사람 이동) 사용, 차량계 하역운반기계 작업계획서 미작성·작업지휘자 미지정', 'Namyangju causes: tampered levers and driving from off the seat; use for something other than loading (moving a person); no work plan or work leader'), src: ['moelRpt'] },
        { t: B('인천 권고: 운전석을 떠날 때 포크를 바닥에 완전히 내리고 주차브레이크, 경사로에서는 구동륜 고임목, 꺼진 바닥 평탄화, 주차브레이크 제동능력 유지관리', 'Incheon recommendations: before leaving the seat, forks fully down and parking brake on, wheel chocks on slopes; level sunken floors; maintain parking-brake performance'), src: ['moelRpt'] }
      ],
      why: [
        { k: 'off', t: B('왜 끼였나? → (남양주) 사람이 포크 위에 탄 채 지게차를 움직였다 / (인천) 멈춘 줄 안 지게차가 경사로를 따라 밀려왔다', 'Why the crush? → (Namyangju) a person rode the forks while the truck moved / (Incheon) a truck thought to be parked rolled down the slope') },
        { k: 'off', t: B('왜 그렇게 썼나? → 높은 곳의 제품을 내리는 다른 수단이 없어 지게차로 사람을 올렸고, 조작레버를 묶어 운전석 밖에서 조종했다', 'Why that way? → There was no other way to reach high stock, so the truck lifted a person, with levers tied so it could be driven from off the seat') },
        { k: 'off', t: B('왜 밀렸나? → 포크를 내리지 않고 고임목 없이 경사 바닥에서 운전석을 떠났다', 'Why did it roll? → The driver left the seat on a slope with the forks up and no chocks') },
        { k: 'off', t: B('왜 막지 못했나? → 작업계획서·작업지휘자가 없었고 바닥 상태 관리가 없었다', 'Why not prevented? → No work plan or leader, and no control of floor condition') }
      ],
      m4: {
        man: B('포크 위 탑승, 운전석 밖 조종, 포크를 올린 채 이탈 (보고서)', 'Riding the forks, driving from off the seat, leaving with forks raised (reports)'),
        machine: B('임의 개조된 조작레버, 주차브레이크 제동력 (보고서)', 'Tampered levers; parking-brake performance (reports)'),
        media: B('높은 적재 단, 구배·꺼짐이 있는 바닥 (보고서)', 'High stacks; sloping, sunken floors (reports)'),
        management: B('작업계획서·작업지휘자 부재 (보고서)', 'No work plan or work leader (reports)')
      },
      barriers: { held: B(['동료가 발견해 응급처치·119 신고'], ['Co-workers found the victims and gave first aid']), failed: B(['주된 용도 외 사용 금지', '조종장치 점검', '운전위치 이탈 시 조치', '작업계획서·작업지휘자'], ['Ban on non-intended use', 'Control checks', 'Leaving-the-seat routine', 'Work plan and leader']) },
      exposure: null,
      risk: { before: { l: 3, s: 4 }, after: { l: 1, s: 4 }, why: B('전: 사람을 올리거나 경사에 세워 두는 일이 일상(가능성 3), 끼임 사망(중대성 4). 후: 고소작업대 사용·운전석 이탈 규칙·바닥 평탄화로 가능성 1', 'Before: lifting people or parking on slopes was routine (L3), fatal crush (S4). After: aerial platforms, a leaving-the-seat routine and level floors for L1') },
      actions: [
        { lvl: 'elim', t: B('사람을 지게차로 올리지 않도록 고소작업대·계단식 작업대를 갖추고, 적재 높이를 낮춤', 'Provide aerial or step platforms so no one is lifted by a forklift, and lower stacking heights'), b: 'law:안전보건규칙 제175조|Standards Rules Art. 175' },
        { lvl: 'eng', t: B('꺼진 바닥 평탄화, 경사 구간 표시·고임목 비치', 'Level sunken floors; mark slopes and provide chocks'), b: 'guide' },
        { lvl: 'adm', t: B('작업 시작 전 제동·조종장치 점검에 임의 개조 여부 포함', 'Include tampering in the pre-use check of brakes and controls'), b: 'law:안전보건규칙 제35조②·별표3|Standards Rules Art. 35(2), Annex 3' },
        { lvl: 'adm', t: B('운전석 이탈 시 포크 바닥·원동기 정지·브레이크·시동키 분리를 습관화', 'Make forks-down, engine-off, brake-on and key-out the routine for leaving the seat'), b: 'law:안전보건규칙 제99조|Standards Rules Art. 99' },
        { lvl: 'adm', t: B('차량계 하역운반기계 작업계획서와 작업지휘자', 'A work plan and work leader for materials-handling vehicles'), b: 'law:안전보건규칙 제38조①2·제39조|Standards Rules Arts. 38(1)2, 39' }
      ],
      lateral: B(['반입구·약품 하역장의 경사·꺼짐 바닥 점검', '지게차 조작레버·안전장치 임의 개조 전수 점검', '고소 적재물 취급 수단(고소작업대) 비치 여부 확인'], ['Check slopes and sunken floors at loading bays and chemical docks', 'Inspect every forklift for tampered levers or safety devices', 'Check that aerial platforms are available for high stock']),
      verify: [
        { k: B('조종장치 임의 개조 발견', 'Tampered controls found'), target: B('0대', '0') },
        { k: B('운전석 이탈 규칙 준수(불시 점검)', 'Leaving-the-seat routine followed (spot checks)'), target: B('100%', '100 %') }
      ],
      lesson: B('지게차는 짐을 옮기는 기계입니다. 사람을 올리는 순간, 그리고 포크를 든 채 내리는 순간 사고가 시작됩니다.', 'A forklift moves loads. Accidents start the moment it lifts a person — or is left with its forks raised.'),
      sops: ['forklift'], src: ['moelRpt', 'lawStd']
    },
    {
      id: 'gov-2024-excavator', site: 'common', peer: B('정부 재해조사보고서 · 건설업(배수로 공사)', 'Government investigation report · construction (drainage works)'), date: '2024-05-16', dateLabel: B('2024.5.16 (2026.5.26 공개)', '16 May 2024 (published 26 May 2026)'),
      types: ['caught'], official: true,
      t: B('[정부 보고서] 경기 평택 굴착기 선회 끼임 사망', '[Government report] Fatal crush by a slewing excavator, Pyeongtaek'),
      impact: B('관로공 1명 사망', 'One pipe layer died'),
      facts: [
        { t: B('폭 2.8m 농로 위에서 관로 터파기 중이던 타이어식 굴착기와 전주 사이로 재해자가 지나가다, 선회하는 굴착기 본체(카운터웨이트)와 전주 사이에 머리가 끼여 사망', 'A worker walking between a wheeled excavator trenching on a 2.8 m farm road and a utility pole was crushed by the slewing counterweight against the pole'), src: ['moelRpt'] },
        { t: B('운전원은 주민 민원(경보음)으로 현장소장 지시에 따라 측·후방 움직임 인식 카메라 4대의 경보를 모두 꺼 두었고, 모니터나 후사경이 아닌 고개를 돌려 전주와의 간격을 보던 중이었음', 'After residents complained about the alarm, the site manager had the four side and rear motion-sensing cameras switched off; the operator was checking the pole clearance by turning his head, not via monitor or mirrors'), src: ['moelRpt'] }
      ],
      officialFindings: [
        { t: B('사고 원인(조사자 의견): 충돌방지조치 미실시 — 좁은 장소에서 굴착기에 접근할 때 출입금지나 유도자 배치를 하지 않음, 차량계 건설기계 작업계획서(종류·성능, 운행경로, 작업방법) 미작성', 'Causes (investigator): no collision prevention — no exclusion zone or banksman in a narrow space; no work plan for the construction machine (type and capacity, route, method)'), src: ['moelRpt'] }
      ],
      why: [
        { k: 'off', t: B('왜 끼였나? → 굴착기가 선회하는 반경 안을 사람이 지나갔다', 'Why the crush? → Someone walked within the slew radius') },
        { k: 'off', t: B('왜 알아채지 못했나? → 측·후방 감지 경보를 꺼 두었고 운전원은 전주만 보고 있었다', 'Why unnoticed? → Side and rear alarms were off and the operator was watching the pole') },
        { k: 'off', t: B('왜 반경 안으로 들어갔나? → 자재 야적장과 작업 지점 사이 통로가 굴착기 옆뿐이었고 출입 통제·유도자가 없었다', 'Why walk there? → The only path between stock and the work ran past the machine, with no exclusion or banksman') },
        { k: 'an', t: B('근본 원인 → 민원 해결을 위해 안전장치를 끄는 결정이 위험성 검토 없이 이뤄졌다 (포털 분석)', 'Root cause → Safety devices were switched off to settle a complaint without any risk review (portal analysis)') }
      ],
      m4: {
        man: B('선회 반경 안 통행, 경보를 끈 채 운전 (보고서)', 'Walking inside the slew radius; operating with alarms off (report)'),
        machine: B('측·후방 감지 경보 꺼짐 (보고서)', 'Side and rear alarms switched off (report)'),
        media: B('폭 2.8m 농로와 전주 사이의 좁은 작업 공간 (보고서)', 'A 2.8 m farm road with a pole alongside (report)'),
        management: B('작업계획서 미작성, 출입통제·유도자 부재 (보고서)', 'No work plan, exclusion or banksman (report)')
      },
      barriers: { held: B([], []), failed: B(['출입금지·유도자', '측·후방 감지 경보', '작업계획서(운행경로)'], ['Exclusion and banksman', 'Side and rear alarms', 'Work plan (route)']) },
      exposure: null,
      risk: { before: { l: 3, s: 4 }, after: { l: 1, s: 4 }, why: B('전: 좁은 통로에서 선회 반경 통행이 반복(가능성 3), 끼임 사망(중대성 4). 후: 출입금지·유도자·경보 유지로 가능성 1', 'Before: repeated passage through the slew radius in a narrow space (L3), fatal crush (S4). After: exclusion, banksman and alarms kept on for L1') },
      actions: [
        { lvl: 'eng', t: B('측·후방 감지 경보는 끄지 않음 — 소음 민원은 경보 방식 변경 등으로 해결', 'Never switch off side and rear alarms — solve noise complaints another way'), b: 'guide' },
        { lvl: 'adm', t: B('굴착기 선회 반경에 출입 금지 구역을 두고, 사람이 가까이 가야 하면 유도자 배치', 'Keep an exclusion zone around the slew radius; post a banksman when people must come close'), b: 'law:안전보건규칙 제200조·제344조|Standards Rules Arts. 200, 344' },
        { lvl: 'adm', t: B('차량계 건설기계 작업계획서(종류·성능, 운행경로, 작업방법)와 자재 이동 동선 분리', 'A work plan for the machine (type and capacity, route, method) and a separate path for materials'), b: 'law:안전보건규칙 제38조①3|Standards Rules Art. 38(1)3' }
      ],
      lateral: B(['사업장 안 옥외 굴착·신축 현장의 굴착기 경보장치 작동 점검', '굴착 작업 허가서에 선회 반경 통제·유도자 항목 포함'], ['Check excavator alarms on outdoor digs and construction sites on campus', 'Add slew-radius control and a banksman to the excavation permit']),
      verify: [
        { k: B('경보장치가 꺼진 채 운전한 굴착기', 'Excavators running with alarms off'), target: B('0대', '0') }
      ],
      lesson: B('안전장치를 끄는 결정도 위험성평가 대상입니다. 민원은 다른 방법으로 풀고, 굴착기 반경은 비워 두세요.', 'Switching off a safety device is itself a change to assess. Solve complaints another way, and keep the slew radius clear.'),
      sops: ['excavation'], src: ['moelRpt', 'lawStd']
    }
  ];

  /* 사고 타임라인 — 분석 사례 + 짧은 기록 */
  SHE.TIMELINE = [
    { date: '2026-06-12', site: 'cheongju', t: B('M15X 2층 가스룸 불소·질소 혼합 작업 중 화재 — 약 4,000명 대피', 'Fire during fluorine–nitrogen mixing, M15X 2F gas room — ≈4,000 evacuated'), src: ['mbc0612'], caseId: 'cj-2026-gasroom' },
    { date: '2026-06-10', site: 'cheongju', t: B('장비 하역 중 TMAH 접촉 — 2명 병원 이송', 'TMAH contact while unloading equipment — 2 to hospital'), src: ['seoul0610'], caseId: 'cj-2026-tmah' },
    { date: '2026-06-01', site: 'cheongju', t: B('M15·M15X 연결 가스룸 화재·불소 누출 — 약 3,600명 대피', 'Gas-room fire and fluorine release — ≈3,600 evacuated'), src: ['etnews0601'], caseId: 'cj-2026-gasroom' },
    { date: '2026-05-27', site: 'cheongju', t: B('M11 설비에서 불꽃 발생 — 직원 약 1시간 대피 (보도)', 'Sparks from M11 equipment — staff evacuated about an hour (reported)'), src: ['bbs0612'] },
    { date: '2026-01-19', site: 'cheongju', t: B('폐수 배관 구역 폐인산 약 30L 낙하 — 작업자 5명 접촉', '≈30 L waste phosphoric acid dripped — 5 workers contaminated'), src: ['jbnews0119'], caseId: 'cj-2026-h3po4' },
    { date: '2026', site: 'icheon', t: B('질산 폐액 노동자 접촉 재해 → 도급승인 취소 (9.20 발표)', 'Nitric-acid waste contact → approval revoked (announced 20 Sep)'), src: ['moel0920'], caseId: 'ic-2026-hno3' },
    { date: '2024', site: 'common', t: B('회사 공개 통계: 국내 사업장 산재 사망자 1명 (세부 내용은 보고서에 없음)', 'Company statistics: 1 work fatality at Korean sites (no details in the report)'), src: ['sr2026'] },
    { date: '2024-05-27', site: 'common', peer: B('업계', 'Industry'), t: B('[업계] 삼성전자 기흥 X선 분석장비 정비 중 피폭 2명 — 원안위 조사결과(9.26): 인터락 배선 변경', '[Industry] Two exposed while servicing an X-ray analyser at Samsung Giheung — NSSC (26 Sep): altered interlock wiring'), src: ['nsscSamsung'], caseId: 'peer-2024-xray' },
    { date: '2021-04-06', site: 'icheon', t: B('장비 점검 중 불산 비산 — 3명 부상', 'HF splash during inspection — 3 injured'), src: ['aju2021'], caseId: 'ic-2021-hf' },
    { date: '2019-05-20', site: 'icheon', t: B('사업장 내 건설현장 고소작업 추락 사망 (보도)', 'Fatal fall at an on-campus construction site (reported)'), src: ['labortoday2019'], caseId: 'ic-2019-fall' },
    { date: '2015-04-30', site: 'icheon', t: B('M14 신축 현장 배기덕트 질소 질식 — 3명 사망', 'Nitrogen asphyxiation in M14 exhaust duct — 3 dead'), src: ['seoul2015'], caseId: 'ic-2015-n2' },
    { date: '2013-03-22', site: 'cheongju', t: B('M8 가스라인 작업 중 염소 누출, 신고 약 4시간 지연', 'Chlorine release on M8, reported ≈4 hours late'), src: ['seoul2013'], caseId: 'cj-2013-cl2' }
  ];

  /* 고용노동부 2026 반도체 집중점검 지적 사항 — 자가점검(수평전개) 체크리스트 */
  SHE.MOEL_FINDINGS = [
    { id: 'sv', t: B('안전밸브 전·후단에 차단밸브를 두지 않는다 (비상시 안전밸브 기능 마비 → 폭발 위험)', 'No isolation valves before or after safety valves (they could disable relief → explosion risk)'), where: B('청주 · 사법처리', 'Cheongju · prosecution') },
    { id: 'ex', t: B('폭발위험장소의 전기 기계·기구는 방폭 성능을 갖춘다 (스파크 → 폭발·화재 위험)', 'Electrical equipment in hazardous areas must be explosion-proof (sparks → explosion/fire)'), where: B('청주 · 사법처리', 'Cheongju · prosecution') },
    { id: 'psm', t: B('공정안전보고서에 따른 사전점검을 실시한다', 'Carry out the pre-checks required by the PSM report'), where: B('청주 · 사고 원인', 'Cheongju · accident cause') },
    { id: 'ptw', t: B('안전작업허가 대상 가스 작업은 허가 후에 시작한다', 'Start permit-required gas work only after the permit is issued'), where: B('청주 · 사고 원인', 'Cheongju · accident cause') },
    { id: 'label', t: B('유해·위험물질 취급 장소에 경고표시를 부착한다', 'Post warning labels where hazardous substances are handled'), where: B('청주·13개소 · 과태료', 'Cheongju and 13 sites · fines') },
    { id: 'msds', t: B('물질안전보건자료(MSDS)를 게시한다', 'Post the MSDS'), where: B('청주·13개소 · 과태료', 'Cheongju and 13 sites · fines') },
    { id: 'endcap', t: B('황산 배관 끝부분에 엔드캡(마개)을 설치한다 (유해가스 누출 위험)', 'Fit end caps on sulfuric-acid pipe ends (toxic-gas release risk)'), where: B('26개소 · 시정', '26 sites · corrective') },
    { id: 'valve', t: B('밸브에 개폐방향을 표기한다 (비상시 차단 지연 방지)', 'Mark open/close directions on valves (avoid delays in an emergency)'), where: B('26개소 · 시정', '26 sites · corrective') },
    { id: 'gd', t: B('필요한 곳에 가스감지기를 설치한다 (누출 감지)', 'Install gas detectors where needed (leak detection)'), where: B('26개소 · 시정', '26 sites · corrective') },
    { id: 'fall', t: B('추락·감전·끼임 방지조치를 갖춘다', 'Provide fall, electrocution and caught-in protection'), where: B('26개소 · 시정', '26 sites · corrective') },
    { id: 'cs', t: B('밀폐공간에 작업 표지를 부착한다', 'Post signs at confined spaces'), where: B('26개소 · 시정', '26 sites · corrective') },
    { id: 'lift', t: B('산업용 리프트는 안전검사를 받고 사용한다', 'Use industrial lifts only after the statutory safety inspection'), where: B('A사업장 · 사용중지명령', 'Site A · prohibition order') },
    { id: 'appr', t: B('도급승인 작업은 승인받은 작업절차서대로 수행한다', 'Carry out approved subcontracted work exactly per the approved procedure'), where: B('이천 · 도급승인 취소', 'Icheon · approval revoked') }
  ];

  /* 최신 동향 (기준일 2026-09-25 — 4단계 법령 변경 점검 결과 반영) */
  SHE.NEWS = [
    { date: '2026-09-20', kind: 'reg', t: B('고용노동부, 반도체 제조업 집중 점검 결과 발표 — 27개소 338건 위반(사법처리 28·과태료 120·시정 188·기타 2), SK하이닉스 청주 119건, 이천 도급승인 취소', 'MOEL publishes chipmaker inspection results — 338 violations at 27 sites (28 prosecutions, 120 fines, 188 corrective, 2 other); SK hynix Cheongju 119; Icheon approval revoked'), src: ['moel0920'], link: '#cases/cj-2026-gasroom' },
    { date: '2026-09-09', kind: 'sk', t: B('SK하이닉스 2026 미래포럼 — 안전 감독 로봇과 고소 작업용 VLM 드론 배치 등 AI 활용 계획 소개', 'SK hynix Future Forum 2026 — plans for safety-supervision robots and VLM drones for work at height'), src: ['nr0909'], link: '#sdx' },
    { date: '2026-08-01', kind: 'law', t: B('개정 산업안전보건법·시행령·시행규칙 시행 — 상시근로자 500명 이상 사업주의 안전보건 현황 공시 의무 신설(매년 4월 30일까지: 안전보건관리체제, 산업재해 발생 현황, 활동 실적·계획, 안전보건 투자, 재발방지 대책 — 도급인은 관계수급인 근로자 사망 현황 포함), 명예산업안전감독관 근로자대표 추천·근로감독 참여', 'Amended OSH Act, Decree and Rule in force — employers with 500+ workers must publish their safety & health status by 30 April each year (management system, injuries, activities and plans, investment, recurrence measures — principals also report contractor deaths); workers’ representatives can nominate honorary inspectors who join inspections'), src: ['lawAct', 'lawDecree', 'lawRule'], link: '#home/cycles' },
    { date: '2026-07-29', kind: 'sk', t: B('2026년 2분기 실적 — 매출 79.3조 원, 영업이익 60.5조 원(분기 최대), HBM4 2분기 양산 공급 시작, M15X 양산 일정 앞당김, 용인 1기 클린룸 2027년 초 목표', 'Q2 2026 results — revenue KRW 79.3 tn, operating profit KRW 60.5 tn (record); HBM4 volume supply from Q2; M15X ramp pulled in; Yongin Fab 1 cleanroom targeted for early 2027'), src: ['nr0729'], link: '#sites' },
    { date: '2026-07-07', kind: 'law', t: B('산업안전보건법 개정 공포(법률 제21853호, 2027.1.8 시행) — 외국인근로자 기초안전보건교육 신설(제31조의2): 고용허가제 외국인근로자 등을 채용할 때 공단·지정기관의 기초안전보건교육을 이수하게 해야 함. 시간·내용은 시행규칙으로 정할 예정', 'OSH Act amended (Act No. 21853, in force 2027-01-08) — new basic safety training for foreign workers (Art. 31-2): when hiring workers under the employment-permit system and similar visas, employers must have them complete basic training from KOSHA or a designated body; hours and content to be set by the Rule'), src: ['lawActNext'], link: '#training' },
    { date: '2026-06-26', kind: 'reg', t: B('고용노동부, “반복 불소 누출 사고” SK하이닉스 등 반도체 제조업 25개소 집중 점검 착수', 'MOEL starts focused inspection of 25 chipmakers including SK hynix after repeated fluorine releases'), src: ['moel0626'], link: '#cases/cj-2026-gasroom' },
    { date: '2026-06-12', kind: 'acc', t: B('청주 M15X 가스룸 화재(불소·질소 혼합 작업 중) — 약 4,000명 대피', 'Cheongju M15X gas-room fire during fluorine–nitrogen mixing — ≈4,000 evacuated'), src: ['mbc0612'], link: '#cases/cj-2026-gasroom' },
    { date: '2026-06-11', kind: 'law', t: B('고압가스 안전관리법 시행규칙 개정 시행(산업통상부령 제15호) — 반도체 제조용 극자외선(EUV) 노광장비를 ‘특정설비’에 추가(제2조⑤11, 종전 규정으로 허가·신고한 장비는 종전 규정). 안전교육 실시방법(별표31) 개정분은 2027.7.1 시행', 'High-Pressure Gas Rule amended (MOIT Ordinance No. 15) — EUV lithography tools for chipmaking added to “specified equipment” (Art. 2(5)11; tools already licensed or notified stay under the old rules). The revised training annex (Annex 31) applies from 2027-07-01'), src: ['lawHpgRule'], link: '#psm' },
    { date: '2026-06-10', kind: 'acc', t: B('청주 장비 하역 중 TMAH 접촉 — 2명 병원 이송', 'TMAH contact while unloading at Cheongju — 2 to hospital'), src: ['seoul0610'], link: '#cases/cj-2026-tmah' },
    { date: '2026-06-08', kind: 'sk', t: B('협력업체 안전보건 상생협력 행사(분기 정례) — 약 150개사 200여 명, 작업중지권 활용·아차사고 발굴 우수업체 시상', 'Quarterly partner S&H event — ≈200 staff from ≈150 firms; awards for using stop-work authority and reporting near misses'), src: ['nr0609'], link: '#partner' },
    { date: '2026-06-04', kind: 'sk', t: B('“전사 안전 체계 대정비 주간” — 고위험 작업 점검, 가스 사용 등 일부 고위험 작업 일시 보류 후 재확인', '“Company-wide safety system overhaul week” — high-risk work reviewed; some gas work paused until re-confirmed'), src: ['newspim0604'], link: '#cases/cj-2026-gasroom' },
    { date: '2026-06-01', kind: 'acc', t: B('청주 가스룸 화재·불소 누출 — 약 3,600명 대피', 'Cheongju gas-room fire and fluorine release — ≈3,600 evacuated'), src: ['etnews0601'], link: '#cases/cj-2026-gasroom' },
    { date: '2026-06-01', kind: 'law', t: B('개정 산업안전보건법(법률 제21374호)·시행규칙(고용노동부령 제470호) 시행 — 위험성평가: 근로자 참여(사업장 순회 점검 방식), 근로자대표가 요구하면 참여, 실시 일정·결과를 근로자에게 공유, 결과 기록 3년 보존. 최초평가는 작업 시작 전까지, 정기평가는 매년 1회 이상(시행규칙 제37조). 관련 과태료는 2027.1.1(상시 50명 이상)부터', 'Amended OSH Act (Act No. 21374) and Rule (Ordinance No. 470) in force — risk assessment: workers take part (through site rounds), the workers’ representative joins on request, schedules and results are shared with workers, and records are kept 3 years. The initial assessment is due before work starts and periodic ones at least yearly (Rule Art. 37). Related fines apply from 2027-01-01 (50+ workers)'), src: ['lawAct', 'lawRule'], link: '#risk/timing' },
    { date: '2026-06-01', kind: 'law', t: B('같은 개정으로 중대재해등 원인조사 확대 — 중대재해가 아니어도 화재·폭발·붕괴 등 산업재해를 원인조사할 수 있고(2026.12.1 이후 발생분부터), 공단·관계전문가의 재해조사보고서를 공소 제기 뒤 공개, 현장 훼손·조사 방해 금지(제56조·제56조의2)', 'The same amendment widens cause investigations — fires, explosions, collapses and similar accidents can be investigated even if not “serious” (for accidents from 2026-12-01), KOSHA or expert investigation reports are published once charges are filed, and disturbing the scene is banned (Arts. 56, 56-2)'), src: ['lawAct'], link: '#prevent/report' },
    { date: '2026-05-27', kind: 'law', t: B('고용노동부, 재해조사보고서 대국민 공개 시작 — 확정판결 51건을 노동부 “재해조사보고서 공개” 게시판과 산업안전포털에 게시, 개정법 시행(6.1) 이후 발생한 중대재해 보고서도 공개 대상. 새 보고서는 유해·위험요인 관리 방식 등 구조적 원인까지 다룸 (포털은 신규 SOP와 연결되는 3건을 사례로 분석)', 'MOEL starts publishing accident investigation reports — 51 cases with final judgments on its disclosure board and the KOSHA portal; reports on serious accidents after the 1 June amendment will also be published, covering structural causes such as hazard management (the portal analyses three that match the new SOPs)'), src: ['moelRpt0527', 'moelRpt', 'lawRule'], link: '#cases/gov-2024-elec' },
    { date: '2026-05-19', kind: 'law', t: B('원자력안전법 개정 공포(법률 제21679호) — 본문은 2027.1.1 시행: 방사선안전관리자는 방사선작업종사자 중에서 선임(제53조의3), 교육훈련을 기본교육·직장교육 체계로 개편(제106조). X선 분석장비 사용 사업장은 시행령 개정과 함께 확인 필요', 'Nuclear Safety Act amended (Act No. 21679) — main part from 2027-01-01: the radiation safety officer must be a radiation worker (Art. 53-3), and training is reorganised into basic and workplace training (Art. 106). Sites using X-ray analysers should follow the decree changes too'), src: ['lawNsa'], link: '#sop/xray' },
    { date: '2026-03-02', kind: 'law', t: B('안전보건규칙 제241조②4 후단 시행 — 화재위험작업에 쓰는 용접방화포는 소방시설법 제40조①에 따른 성능인증품이어야 함(2025.9.1 개정, 공포 6개월 후 시행)', 'Standards Rules Art. 241(2)4, second sentence, in force — welding blankets used for fire-risk work must be performance-certified under Art. 40(1) of the Fire Systems Act (amended 2025-09-01, effective six months later)'), src: ['lawStd'], link: '#sop/hot-work' },
    { date: '2026-01-30', kind: 'law', t: B('KOSHA GUIDE 437건 정비·공표(제정 11·개정 164·폐지 262) — 안전작업허가(C-C-49), 가스누출감지경보기(C-C-87), 밀폐공간 프로그램(E-G-18) 등 번호 변경. 안전작업허가 규정에 영상기록 활용·밀폐공간 허가서 3년 보존 권고·모니터링·감사 절차 신설', 'KOSHA reworks 437 guides (11 new, 164 revised, 262 withdrawn) — permits (C-C-49), gas detectors (C-C-87), confined-space programme (E-G-18) and others renumbered; the permit guide adds video records, a recommended 3-year retention for confined-space permits, and monitoring and audit'), src: ['moelKosha2026', 'koshaCC49', 'koshaGuide'], link: '#sources/kosha' },
    { date: '2026-01-19', kind: 'acc', t: B('청주 폐수 배관 작업 중 폐인산 접촉 — 작업자 5명', 'Waste phosphoric-acid contact at Cheongju — 5 workers'), src: ['jbnews0119'], link: '#cases/cj-2026-h3po4' },
    { date: '2025-12-01', kind: 'law', t: B('안전보건규칙 개정 시행(질식사고 예방) — 측정자 측정장비 지급, 측정·평가 기록 3년 보존, 감시인의 소방관서 신고, 작업 전 숙지 확인·교육', 'OSH Standards Rules amended (asphyxiation prevention) — testers get instruments, 3-year records, attendant reports to fire services, pre-work understanding checks'), src: ['lawStd', 'moelNotice1201'], link: '#sop/confined' },
    { date: '2025-07-17', kind: 'law', t: B('안전보건규칙 개정 시행(고용노동부령 제448호, 폭염 대응) — 체감온도 31℃ 이상 장소의 장시간 작업을 ‘폭염작업’으로 정의, 냉방·통풍·작업시간 조정·휴식 조치, 체감온도 33℃ 이상이면 2시간 이내마다 20분 이상 휴식, 일자별 체감온도·조치 기록', 'Standards Rules amended (Ordinance No. 448, heat) — long work where the apparent temperature is 31 °C or more is “heat-wave work”; cooling, ventilation, rescheduling or rest required; at 33 °C or more, at least 20 minutes’ rest every 2 hours; daily records of apparent temperature and measures'), src: ['lawStd'], link: '#measure/heat' }
  ];
  SHE.NEWS_ASOF = '2026-09-25';
})();

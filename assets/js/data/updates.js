/* 업데이트 현황(패치노트) — 홈페이지의 역사
   - 공개 업데이트: GitHub 공개 저장소(seopsak0321/she-master)에 반영한 커밋 기준. 날짜·시각은 커밋 기록(한국 시간).
   - v번호는 화면·스크립트를 새로 받게 하는 빌드 번호라 공개 업데이트 사이에 건너뛸 수 있다.
   - 공개 전 개발 기록은 ROADMAP.md의 단계별 결과를 요약한 것.
   - SHE.BUILD는 빌드 스크립트(bump.py)가 올리며, 맨 위(최신) 업데이트의 버전으로 쓴다.
     다음 업데이트를 시작할 때 맨 위 항목의 v를 그때 번호로 고정하고 commit·시각을 적은 뒤, 새 항목을 맨 위에 v: SHE.BUILD로 추가한다. */
window.SHE = window.SHE || {};
SHE.BUILD = 'v78';
(function () {
  const B = (ko, en) => ({ ko, en });
  SHE.UPDATES = [
    { no: 11, v: SHE.BUILD, date: '2026-09-26',
      t: B('안전보건표지 새 화면·추락 사례·고소작업 SOP 보강', 'New safety-sign page, fall cases, stronger work-at-height SOP'),
      add: [
        B('새 화면 ‘안전보건표지’(라이브러리) — 시행규칙 별표6~9의 표지 43종(금지 8·경고 15·지시 9·안내 8·출입금지 3)을 번호·용도·설치 장소 예시·KS S ISO 7010 대체 코드로 찾기, 색도기준(별표8), 설치·제작 의무(법 제37조·규칙 제38~40조)', 'New page “Safety signs” (Library) — the 43 signs of Rule Annexes 6–9 (8 prohibition, 15 warning, 9 mandatory, 8 guidance, 3 no-entry) searchable by number, use, example location and KS S ISO 7010 code; colour standards (Annex 8); duties for putting up and making signs (Act Art. 37, Rule Arts. 38–40)'),
        B('사고사례 12 → 13건 — 정부 재해조사보고서 떨어짐 사망 2건(강원 영월 이동식 사다리 약 1.5m, 대구 달성 이동식비계 약 1.8m): 보고서의 경위·원인·권고와 조문 근거 재발방지 대책', 'Incident cases 12 → 13 — two fatal falls from government reports (a ladder at about 1.5 m in Yeongwol, a mobile scaffold at about 1.8 m in Dalseong): sequence, causes and recommendations from the reports, with law-based measures'),
        B('용어 사전에 ‘안전보건표지’ 추가(법 제37조① 정의)', 'Glossary adds “safety and health sign” (definition in Act Art. 37(1))')
      ],
      chg: [B('고소작업 SOP 보강 — 작업발판 우선(제42조①②), 이동식 사다리 7가지 조건(제42조④, 2024.6.28 신설), 이동식비계 기준(제68조), 안전모·안전대(제32조①) 단계와 퀴즈 2문항, 작업중지 기준 2개 추가', 'Work-at-height SOP strengthened — platforms first (Art. 42(1)(2)), the seven ladder conditions (Art. 42(4), added 2024-06-28), mobile-scaffold rules (Art. 68), hard hats and harnesses (Art. 32(1)) as steps, plus two quiz questions and two stop-work criteria')],
      fix: [] },
    { no: 10, v: 'v77', date: '2026-09-26 20:02', commit: '53bddc9',
      t: B('SOP 3종 추가 — 기밀시험·소음·중량물', 'Three new SOPs — pressure testing, noise, manual lifting'),
      add: [
        B('SOP 22 → 25종 — 가스 배관·용기 기밀시험(안전보건규칙 제300조, KOSHA C-C-65-2026 4.1(2)), 소음 작업·청력보존(제512~517조, KOSHA C-C-87-2026 6.1(4)), 중량물 인력 운반(제663~666조, 근골격계부담작업 고시 제3조) — 단계마다 조문 근거, 5분 카드·퀴즈·작업중지 기준', 'SOPs 22 → 25 — pressure testing of gas lines and vessels (Standards Rules Art. 300; KOSHA C-C-65-2026 4.1(2)), noisy work and hearing conservation (Arts. 512–517; KOSHA C-C-87-2026 6.1(4)), manual lifting (Arts. 663–666; MSD-burden notice Art. 3) — each step with its legal basis, five-minute card, quiz and stop-work criteria'),
        B('출처·월간 법령 점검에 근골격계부담작업 고시(고용노동부고시 제2020-12호) 추가 — 점검 대상 30건', 'Sources and the monthly law check gain the MSD-burden notice (MOEL Notice No. 2020-12) — 30 items checked'),
        B('수치 판정의 소음 결과에서 소음 작업·청력보존 SOP로 바로 이동', 'The noise result in the measurement check links straight to the noise SOP')
      ],
      chg: [], fix: [] },
    { no: 9, v: 'v76', date: '2026-09-26 17:35', commit: '63f54a0',
      t: B('화학사고 신고 기준 전체·용어 사전 확충·전자산업 불소계 가스', 'Full chemical-accident reporting list, glossary expansion, electronics F-gases'),
      add: [
        B('화학사고 즉시 신고 판정 — 별표1이 이름으로 정한 44종 전체(산·염기·가스·유기용제·기타), 선택 목록을 ‘반도체 사업장에서 쓰는 물질 / 그 밖의 물질’로 나누고 기준량 전체 표를 접어서 제공', 'Chemical-accident report check — all 44 substances named in Annex 1 (acids, bases, gases, solvents, other); the list is split into “used in fabs” and “other”, with a foldable table of every threshold'),
        B('용어 사전 36 → 46개 — 유해화학물질·사고대비물질·화학사고·밀폐공간·산소결핍·관리대상 유해물질·근골격계부담작업·물질안전보건자료·작업환경측정·지구온난화지수(법령 정의 조항 기준)', 'Glossary 36 → 46 — hazardous chemical, accident-preparedness substance, chemical accident, confined space, oxygen deficiency, controlled hazardous substance, musculoskeletal-burden work, MSDS, work-environment monitoring, GWP (from the statutory definitions)'),
        B('지구온난화지수 비교에 미국 EPA 표 I-21의 전자산업 사용 가스 4종(C₃F₈·c-C₄F₈O·c-C₅F₈·CH₂F₂) 추가 — ICSC 카드가 없어 물질 DB에는 넣지 않고 비교에만', 'GWP comparison adds four electronics gases from EPA Table I-21 (C₃F₈, c-C₄F₈O, c-C₅F₈, CH₂F₂) — no ICSC card, so comparison only, not in the substance DB')
      ],
      chg: [B('물질 DB의 삼염화인에 별표1 즉시 신고 기준량(500kg·L) 연결, 소량 유출 신고 면제 안내에 실험실 기준(100g·mL) 추가', 'Phosphorus trichloride in the substance DB is linked to its Annex 1 threshold (500 kg or L); the small-release exemption note adds the lab figure (100 g or mL)'),
        B('자체 점검 문구 검사에 가운뎃점(·) 한쪽 띄어쓰기 검사 추가', 'Self-check wording test now flags lopsided spacing around the middle dot (·)')],
      fix: [B('검색 결과 발췌의 앞뒤가 칸 구분자(가운뎃점)에서 잘리거나, 구분자가 다음 기호에 붙어 보이던 문제', 'Search snippets could begin or end on a cell separator (middle dot), or run the separator into the next symbol')] },
    { no: 8, v: 'v71', date: '2026-09-26 15:23', commit: 'a42f51c',
      t: B('안전 정보 자료실 확충·국내외 우수 사례 통합', 'Resource library expansion; best practice from home and abroad'),
      add: [
        B('안전 정보 자료실 25곳 → 41곳 — 국민안전24 국민행동요령·국가화재정보시스템·한국소방안전원·원자력안전위원회·온실가스종합정보센터·산업안전보건연구원 연구보고서 / NIOSH 대책 위계·ERG 2024·EPA AEGL·PubChem·EU-OSHA·일본 후생노동성 직장 안전 사이트 / 삼성전자 반도체·TSMC·Intel·IOGP', 'Resource library from 25 to 41 sites — Korean public action guides, national fire data, fire-safety institute, nuclear safety commission, GHG centre, OSHRI research / NIOSH hierarchy of controls, ERG 2024, EPA AEGL, PubChem, EU-OSHA, Japan’s workplace safety site / Samsung Semiconductor, TSMC, Intel, IOGP'),
        B('벤치마킹에 Intel(위험작업 공급사 안전 사전 자격심사·매년 갱신)과 IOGP(생명 보호 규칙 9개) 추가, TSMC에 장비 공급사 현장 인력 직업건강 지침 추가', 'Benchmarks: Intel (safety pre-qualification of hazardous-work suppliers, renewed yearly) and IOGP (nine Life-Saving Rules); TSMC gains its health guideline for equipment suppliers’ on-site staff'),
        B('상생협력 도급인 법정 의무에 산안법 제61조(적격 수급인 선정) 추가 — 11개', 'Principal’s statutory duties gain OSH Act Art. 61 (choosing capable contractors) — now 11'),
        B('사고조사의 대책 위계를 NIOSH 5단계(제거 → 대체 → 공학적 → 행정적 → 보호구)로 한눈에 표시', 'Incident investigation shows the NIOSH five-level hierarchy of controls at a glance'),
        B('불소계 가스 지구온난화지수 비교에 국가 통계 추가 — 2025년 반도체 업종 배출 증가를 +1.3%로 억제(스크러버 고온 분해 등, 온실가스종합정보센터 2026.9.21)', 'GWP panel adds the national figure — chip-sector emissions held to +1.3 % in 2025 (high-temperature scrubbers etc., GIR, 21 Sep 2026)'),
        B('소방·방재 비상대응 시나리오에 정부 국민행동요령(지진·화재·폭발·화학사고·전기·가스 사고) 연결', 'Fire & emergency scenarios link to the government’s public action guides (earthquake, fire, explosion, chemical, electricity and gas accidents)')
      ],
      chg: [B('출처 110 → 115개, README·가이드의 개수 현행화(SOP 22·물질 71·자료실 41·출처 115)', 'Sources 110 → 115; counts in the README and guides brought up to date (22 SOPs, 71 substances, 41 library sites, 115 sources)'),
        B('자체 점검의 클릭 시연 — 같은 주소로 가는 링크는 언어마다 한 번만 눌러 시간을 줄임(버튼·체크·선택 상자·접힘 제목은 모두)', 'Self-check click test — links to the same address are clicked once per language to save time (every button, checkbox, select and fold is still clicked)')],
      fix: [B('이용 가이드의 기능 카드 요약이 ‘incl.’ 같은 약어의 마침표에서 잘려 괄호가 열린 채 끝나던 문제', 'Feature cards in the user guide cut their summary at the full stop of abbreviations such as “incl.”, leaving a bracket open')] },
    { no: 7, v: 'v68', date: '2026-09-26 12:57', commit: 'bd4ed14',
      t: B('검증 도구·법정 목록 전체 보기·패치노트', 'Verification tools, full statutory lists, patch notes'),
      add: [
        B('업데이트 현황(패치노트) 페이지와 바닥글 버전 표시', 'This update-history page and the version in the footer'),
        B('작업허가서 작성기 단계 표시기 — 8단계를 번호·완료 상태와 함께 한 단계씩, ‘모두 펼쳐 보기’로 전체', 'Step indicator for the permit builder — eight steps shown one at a time with status; “Show all steps” for the full form'),
        B('PSM 규정량 판정 — 시행령 별표13 전체 51종 보기(기본은 반도체 관련 25종)', 'PSM threshold check — all 51 Annex 13 substances (default: 25 chip-related)'),
        B('특별교육 대상 작업 — 시행규칙 별표5 전체 39종(반도체 관련 12종을 먼저, 나머지는 접어서)', 'Special-training jobs — all 39 in Rule Annex 5 (12 fab-related first, the rest folded)'),
        B('위험물 지정수량 계산 — 시행령 별표1 제3·4·6류 품명 23개에서 제1~6류 41개로 확대(제1·2·5류 추가, 원문 대조)', 'Designated-quantity calculator — from 23 categories in Classes 3, 4, 6 to 41 across Classes 1–6 of Decree Annex 1 (Classes 1, 2, 5 added, checked against the original)'),
        B('포털 자체 점검에 ‘모든 버튼·링크 눌러 보기’, 문구 검사(값 누출·낱말 반복·괄호 짝·줄표 띄어쓰기), 바닥글 버전과 실제 스크립트 번호 일치 검사 추가', 'Self-check: “click every button and link”, text checks (value leaks, repeated words, brackets, dash spacing) and a footer-version check')
      ],
      chg: [B('수치 원문 대조 — 국내 노출기준 55종(고시 별표1), IDLH 50종(NIOSH 표), PSM 규정량 24종(별표13) 모두 원문과 일치 확인', 'Figures re-checked against the originals — 55 Korean limits (Annex 1), 50 IDLHs (NIOSH table), 24 PSM thresholds (Annex 13) all match')],
      fix: [B('검색 결과 발췌에서 이웃한 칸의 낱말이 붙어 같은 말이 반복된 것처럼 보이던 문제 — 칸 사이를 ‘ · ’로 구분', 'Search snippets ran neighbouring cells together so words looked doubled — cells are now separated by “ · ”'),
        B('오프라인 저장(서비스 워커)이 설치될 때 브라우저 캐시의 옛 파일을 담을 수 있던 문제 — 서버에서 새로 받음', 'The offline cache could store old files from the browser cache when installing — it now fetches fresh copies')] },
    { no: 6, v: 'v64', date: '2026-09-26 10:50', commit: '9b0cf39',
      t: B('크기 비교 그래프·8단계 검증·확충 계획', 'Comparison charts; stage-8 verification and expansion plan'),
      add: [
        B('비교 그래프 공통 부품 — 0에서 시작하는 막대, 값 표시, 기준선, 큰 차이는 로그 눈금 점', 'Shared chart parts — zero-based bars with values and reference lines, log-scale dots for large ranges'),
        B('적용: 물질 상세(노출기준 대 IDLH), 불소계 가스 지구온난화지수, 위험물 배수, PSM 규정량 비율, 사고 위험도 전·후, 호흡보호구 보호계수 순서, 교육 이수 진행률', 'Applied to substance limits vs IDLH, fluorinated-gas GWP, dangerous-goods multiples, PSM ratios, case risk before/after, respirator APF order and training progress'),
        B('가독성·사용성 2차 개편 연구(KRDS·GOV.UK·USWDS·NN/g·FT·토스)와 기준 D13~D20, 8단계 기존 콘텐츠 검증·확충 계획', 'Readability research (KRDS, GOV.UK, USWDS, NN/g, FT, Toss), criteria D13–D20, and the stage-8 plan')
      ],
      chg: [B('포털 자체 점검에 상단 시계·도구 버튼 포함', 'Self-check now includes the top-bar clock and tool buttons'), B('출처·자료실 링크 119개 점검 — 끊긴 링크 0', '119 source and library links checked — none broken')],
      fix: [B('SK하이닉스 뉴스룸 대체가스 문구를 원문대로 수정', 'Corrected the SK hynix replacement-gas statement to match the article')] },
    { no: 5, v: 'v62', date: '2026-09-26 10:29', commit: '5e4e38f',
      t: B('6단계(물질·공정·SOP)·메뉴 개편·상단 도구', 'Stage 6 (substances, processes, SOPs), menu redesign, top-bar tools'),
      add: [
        B('물질 71종(+8: 구리·코발트·트라이메틸알루미늄·CF₄·CHF₃·C₂F₆·c-C₄F₈·C₄F₆) — SK하이닉스 뉴스룸 공정 해설·미국 EPA 근거', '71 substances (+8) — backed by SK hynix Newsroom process articles and US EPA tables'),
        B('공정 단계 10개(+금속배선·CMP·웨이퍼 레벨 패키지), SOP 22종(+가스 누출 경보 대응·화학물질 누출 초기 대응·인화성 용제 이송)', '10 process steps (+metallization, CMP, wafer-level packaging); 22 SOPs (+gas-alarm response, chemical-spill first response, solvent transfer)'),
        B('상단 도구 — 디지털 시계, 메모장(페이지 이동에도 유지·.txt 저장), 계산기(일반·공학용), 단위 환산(물리량 23종·단위 177개)', 'Top-bar tools — clock, notepad (kept across pages, .txt export), calculator (basic/scientific), unit converter (23 quantities, 177 units)')
      ],
      chg: [B('왼쪽 메뉴 — 대분류 아이콘·굵은 제목·구분선·접기, 현재 그룹 강조(Material 3·IBM Carbon·NN/g 근거)', 'Side menu — group icons, bold headings, dividers, folding, current group highlighted')],
      fix: [B('호흡보호구 선정에서 금속 6종(구리·코발트·텅스텐·탄탈륨·안티몬·산화붕소)이 ‘정화통 없음’으로 나오던 오류 — 방진 필터로 연결', 'Six metals (Cu, Co, W, Ta, Sb, B₂O₃) shown as “no canister” in respirator selection — now mapped to particulate filters')] },
    { no: 4, v: 'v57', date: '2026-09-25 22:12', commit: '6da9f9f',
      t: B('가독성 개편·공식 사진·글자 크기·5단계·업무 연결', 'Readability redesign, official photos, text size, stage 5, work-flow links'),
      add: [
        B('SK하이닉스 뉴스룸 공식 사진 5장(출처 표기, 원본 그대로), 글자 크기 85~130%', 'Five official SK hynix Newsroom photos (credited, unaltered); text size 85–130 %'),
        B('5단계 — 위험물 지정수량 배수, 중대재해처벌법 안전보건관리체계 점검표, 건설공사 발주자 의무, 국소배기 제어풍속 판정, 근골격계 유해요인조사 주기', 'Stage 5 — dangerous-goods multiples, SAPA management-system checklist, construction-client duties, capture-velocity check, MSD survey cycle'),
        B('업무 연결 — PSM 12요소를 실제 화면으로, 가동 전 점검(PSSR)·자체감사 탭과 인쇄 양식, MOC 다음 단계, 업무판 주기에 업무 화면 링크, 수치 판정 결과에서 호흡보호구·허가서로', 'Work flow — PSM elements link to real screens, PSSR and self-audit tabs with print forms, MOC next steps, dashboard cycles link to their work screens, results lead to respirators and permits')
      ],
      chg: [B('한 문장 요약+자세히, 근거 접기, 이 페이지 목차, 목록 검색·분류(SOP·물질·사례·동향·용어·출처)', 'One-line leads with “more”, folded evidence, on-page contents, search and filters on every growing list')],
      fix: [B('PSM 8·9·10번 ‘열기’가 제자리로 가던 문제(같은 화면 링크) — 자체 점검에 검사 추가', 'PSM items 8–10 “Open” going nowhere — added a self-check for same-screen links'), B('글자 130%에서 카드 표·분할 버튼이 화면 밖으로 넘치던 문제', 'Card tables and split buttons overflowing at 130 % text')] },
    { no: 3, v: 'v38', date: '2026-09-25 16:10', commit: '89a79dd',
      t: B('모바일 전용 화면·발전 계획', 'Mobile layout and development plan'),
      add: [B('휴대폰 전용 배치 — 아래 탭 막대, 표를 카드로, 메뉴 안 화면 설정, PC 버전 보기', 'Phone layout — bottom tab bar, tables as cards, settings in the menu, “view PC version”'), B('5~7단계 발전 계획 수립', 'Plan for stages 5–7')],
      chg: [],
      fix: [B('브라우저 캐시에 남은 옛 화면이 뜨던 문제(화면은 항상 서버에 재확인), 표시 오류', 'Old pages served from the browser cache (the page is now always revalidated); display bugs')] },
    { no: 2, v: 'v33', date: '2026-09-25 12:05', commit: '7f6a6bc',
      t: B('설명서에 공개 주소 추가', 'Public address added to the README'),
      add: [], chg: [B('README에 공개 주소(seopsak0321.github.io/she-master) 기록', 'README records the public address')], fix: [] },
    { no: 1, v: 'v33', date: '2026-09-25 12:03', commit: 'e1796e8',
      t: B('첫 공개', 'First public release'),
      add: [
        B('업무판·교육 이수 관리·이용 가이드·데이터 백업, 6대 직무(공정안전·예방안전·SDX·상생협력·소방·안전문화)', 'Dashboard, training records, user guide, backup; the six SHE functions'),
        B('판정·평가 도구 — 수치 판정, 위험성평가 워크벤치, 작업허가서 작성기, 가스 안전 도구, 호흡보호구 선정', 'Tools — measurement check, risk workbench, permit builder, gas tools, respirator selection'),
        B('라이브러리 — SOP 19종, 물질 63종, 안전 정보 자료실 25곳 / 사고 학습 — 사고사례·최신 동향', 'Library — 19 SOPs, 63 substances, 25 resource sites / incident cases and news'),
        B('회사·근거 — SK하이닉스 이해, 사업장(공통·이천·청주), 벤치마킹, 출처·검증과 법령 변경 점검', 'Company and evidence — SK hynix profile, sites, benchmarks, sources and law-change checks'),
        B('한·영 전환, 인쇄 양식, 일정(.ics) 내보내기, 오프라인(PWA), 포털 자체 점검', 'Korean/English, print forms, calendar export, offline use, self-check')
      ], chg: [], fix: [] }
  ];
  /* 공개 전 개발 기록 (ROADMAP.md 단계별 결과 요약) */
  SHE.DEV_LOG = [
    { d: '2026-09-23', t: B('포털 최초 제작 — 정적 사이트, 한·영 전환, 사업장 3곳 전환, SK하이닉스 공개자료 기반 회사·사업장, 6대 직무 화면, 수치 판정, 출처 목록', 'First build — static site, Korean/English, three sites, company pages from SK hynix public sources, six SHE functions, measurement check, source list') },
    { d: '2026-09-24', t: B('사고 학습(사고사례·동향), 전체 검색, 페이지별 가이드와 이용 가이드, 안전 정보 자료실 25곳', 'Incident learning, site-wide search, page guides and user guide, 25-site resource library') },
    { d: '2026-09-24', t: B('검증·보완(v9) — IDLH 3건 수정, 법령 현행화, 법정 주기 23개, PSM 규정량·이행상태평가, 사고 보고 판정, 소방 등급 판정, 물질 34종', 'Verification pass (v9) — three IDLH fixes, current law versions, 23 statutory cycles, PSM thresholds and assessment, accident-reporting check, fire grade, 34 substances') },
    { d: '2026-09-24', t: B('1단계 — 백업·복원, 인쇄 양식, 일정(.ics) 내보내기, 화학물질관리법·고압가스법 의무', 'Stage 1 — backup/restore, print forms, calendar export, Chemicals Control and High-Pressure Gas Act duties') },
    { d: '2026-09-24', t: B('2단계(v22) — 작업허가서 작성기, 가스 안전 도구(경보 설정값·혼합가스·ERG), 호흡보호구 선정, 교육 이수 관리, 전체환기·측정 주기', 'Stage 2 (v22) — permit builder, gas tools, respirator selection, training records, ventilation and monitoring cycles') },
    { d: '2026-09-25', t: B('3단계(v25) — 물질 63종, SOP 19종, 정부 재해조사보고서 3건, KOSHA 지침 41건 현행화, 한·미 규제 비교', 'Stage 3 (v25) — 63 substances, 19 SOPs, three government investigation reports, 41 KOSHA guides updated, Korea–US comparison') },
    { d: '2026-09-25', t: B('4단계(v32) — 법령 변경 점검, 오프라인(PWA), 포털 자체 점검, 기능별 내보내기·데이터 사전, 약력', 'Stage 4 (v32) — law-change checks, offline use, self-check, feature export and data dictionary, profile') }
  ];
  /* 콘텐츠 규모 변화 — ROADMAP 기록의 수치 */
  SHE.GROWTH = [
    { k: B('물질', 'Substances'), pts: [['v9', 34], ['v25', 63], ['v62', 71]] },
    { k: B('SOP', 'SOPs'), pts: [['v22', 13], ['v25', 19], ['v62', 22]] },
    { k: B('출처', 'Sources'), pts: [['v22', 83], ['v25', 94], ['v32', 95], ['v62', 110]] },
    { k: B('자료실 사이트', 'Library sites'), pts: [['v33', 25]] },
    { k: B('용어', 'Glossary terms'), pts: [['v64', 36]] }
  ];
})();

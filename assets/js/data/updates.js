/* 업데이트 현황(패치노트) — 홈페이지의 역사
   - 공개 업데이트: GitHub 공개 저장소(seopsak0321/she-master)에 반영한 커밋 기준. 날짜·시각은 커밋 기록(한국 시간).
   - v번호는 화면·스크립트를 새로 받게 하는 빌드 번호라 공개 업데이트 사이에 건너뛸 수 있다.
   - 공개 전 개발 기록은 ROADMAP.md의 단계별 결과를 요약한 것.
   - SHE.BUILD는 빌드 스크립트(bump.py)가 올리며, 맨 위(최신) 업데이트의 버전으로 쓴다.
     다음 업데이트를 시작할 때 맨 위 항목의 v를 그때 번호로 고정하고 commit·시각을 적은 뒤, 새 항목을 맨 위에 v: SHE.BUILD로 추가한다. */
window.SHE = window.SHE || {};
SHE.BUILD = 'v85';
(function () {
  const B = (ko, en) => ({ ko, en });
  SHE.UPDATES = [
    { no: 14, v: SHE.BUILD, date: '2026-09-27',
      t: B('화학물질 배출량조사·온실가스 배출권거래제 탭 — NF₃가 법정 온실가스로(2026.10.8)', 'Chemical release survey and GHG emissions-trading tabs — NF₃ becomes a statutory greenhouse gas (8 Oct 2026)'),
      add: [
        B('환경 화면 새 탭 ‘배출량조사’ — 화학물질관리법 제11조·시행규칙 제5조·기후에너지환경부고시 제2025-52호: 대상 판정(별표1 업종 — 반도체 소자 26111·26112·26121·26129, 배출시설 허가·신고, 별표2 물질 Ⅰ그룹 연 1톤·Ⅱ그룹 연 10톤), 매년 4월 30일 전년도 조사표, 조사 내용·산정 방법 4가지·제외 물질 9가지, 반도체 공정 물질 38종의 별표2 그룹·번호·함유율 대조', 'New environment tab “Release survey” — from Chemicals Control Act Art. 11, Rule Art. 5 and MCEE Notice No. 2025-52: coverage check (Annex 1 industries — semiconductor devices 26111, 26112, 26121, 26129; emission-facility permit or notice; Annex 2 substances at 1 t/yr for group I or 10 t/yr for group II), last year’s form by 30 April, contents, four estimation methods, nine exclusions, and the Annex 2 group, number and content threshold for 38 fab substances'),
        B('SK하이닉스 사업장 6곳의 화학물질 배출·이동량(화학물질종합정보시스템 공개, 2024년) — 합계 배출 28,886kg·이동 143,985,066kg, 이천 배출 상위(과불화탄소·암모니아·IPA 등, 모두 대기)와 이동 상위(황산·IPA·과산화수소 등). 자료실에 화학물질종합정보시스템 추가(42곳)', 'Chemical releases and transfers at six SK hynix sites (chemical information system, 2024) — 28,886 kg released and 143,985,066 kg transferred in total, with Icheon’s top releases (PFCs, ammonia, IPA and more, all to air) and top transfers (sulphuric acid, IPA, hydrogen peroxide and more); the library adds the chemical information system (42 sites)'),
        B('환경 화면 다섯 번째 탭 ‘온실가스·배출권’ — 탄소중립기본법 제2조제5호의 온실가스 7종과 NF₃의 법별 적용: 기본법 정의에는 2026.10.8부터 포함, 관리업체 목표관리(제27조①)와 배출권거래법(제2조제1호)에서는 2026.4.7부터 제외(법률 제21527호). 물질 DB 8종 연결, 불소계 온실가스 측정(국립환경과학원 온실가스공정시험기준 2023.6 개정 — 적외선흡수분광법·저감 효율·부생 가스)', 'Fifth environment tab, “GHG & emissions trading” — the seven greenhouse gases in Carbon Neutrality Act Art. 2(5) and how each act treats NF₃: in the Framework Act’s definition from 2026-10-08, but excluded since 2026-04-07 from managed-entity target management (Art. 27(1)) and the ETS Act (Art. 2(1)) (Act No. 21527); eight substances linked, plus how fluorinated GHGs are measured (NIER test standard revised June 2023 — infrared absorption, abatement efficiency, by-products)'),
        B('배출권 할당대상업체 요건 판정(배출권거래법 제8조① — 업체 연평균 125,000 또는 사업장 25,000 tCO₂-eq 이상 + 직전 할당대상업체·관리업체)과 연간 의무 — 명세서 3개월·인증 5개월·배출권 제출 8개월, 이월·차입(1차 이행연도 차입 한도 15%). 시행령 제39·44·45조, 배출량 보고·인증 지침 제29·37조', 'Allocated-company check (ETS Act Art. 8(1) — company average of 125,000 or a site of 25,000 tCO₂-eq, allocated last period or a managed entity) and the yearly duties — statement within three months, certification five, surrender eight, plus banking and borrowing (15 % borrowing cap in the first year); Decree Arts. 39, 44, 45 and the reporting guideline Arts. 29, 37'),
        B('SK하이닉스 공개 자료(지속가능경영보고서 2026) — Scope 1 가스별 배출량 2022~2025(2025년 NF₃ 973,051 tCO₂eq), 시장 기반 Scope 1&2와 PRISM 목표(2025년 556만 톤, 목표 567만 톤 달성), EPEAT 기준 공정 F-온실가스 1,376,496 tCO₂eq, 제3자 검증 범위(p.18·20·102·127)', 'SK hynix disclosures (Sustainability Report 2026) — Scope 1 emissions by gas 2022–2025 (NF₃ 973,051 tCO₂eq in 2025), market-based Scope 1&2 and the PRISM goal (5.56 Mt in 2025 against 5.67 Mt, met), process F-GHGs of 1,376,496 tCO₂eq on the EPEAT basis, and the verification scope (pp.18, 20, 102, 127)'),
        B('업무판 법정 주기 38 → 41개 — 온실가스 배출량 명세서 제출(매년 3월 31일), 화학물질 배출량조사표 제출(매년 4월 30일), 배출권 제출(매년 8월 31일). 용어 사전 52 → 54개 — 화학물질 배출량조사, 할당대상업체', 'Dashboard cycles 38 → 41 — the GHG emissions statement (31 March), the chemical release survey form (30 April) and allowance surrender (31 August); glossary 52 → 54 — chemical release survey, allocated company')
      ],
      chg: [
        B('물질 상세 ‘환경 법령’ 줄에 배출량조사 칩(별표2 그룹·번호)과 법정 온실가스 칩(NF₃는 법별 적용 표시), 두 탭으로 가는 연결 — 불소계 가스 지구온난화지수 패널에서도 연결', 'Substance details: the “Environmental law” line adds release-survey chips (Annex 2 group and number) and greenhouse-gas chips (with NF₃’s status under each act), linking to both tabs — also linked from the fluorinated-gas GWP panel'),
        B('출처 화학물질관리법·시행규칙에 인용 조문(제11조·제11조의2, 제5조·제5조의2) 표기, 확인일 2026-09-27', 'The Chemicals Control Act and Rule sources now list the cited articles (Arts. 11 and 11-2; Rule Arts. 5 and 5-2), checked 2026-09-27'),
        B('약력 소개 문구를 실제 제작 방식대로 — 기획·작업 원칙·검증 기준은 직접, 원문 조사·개발·자체 점검은 AI 코딩 에이전트(Claude Code)와 함께', 'Profile blurb now states how the portal was actually made — planning, working rules and verification criteria by me; source research, development and self-checks together with an AI coding agent (Claude Code)'),
        B('자체 점검 — 창이 가려져 있으면 검사용 화면의 대기(지연 0 타이머)가 약 1초로 늘어나 클릭 시연이 몇 시간 걸리던 것을 한 줄 메시지 큐로 바꿈', 'Self-check — when the window is hidden, zero-delay waits in the test frame stretched to about a second and the click test took hours; they now run through a single message queue'),
        B('자료실 ‘온실가스종합정보센터’ — 2026.10.8부터 기후에너지환경부 소속 국립기후과학원이 사무 승계(탄소중립기본법 제36조의2, 법률 제21527호 부칙 제3조)', 'Library entry for the GHG Inventory and Research Center — from 2026-10-08 its work passes to the National Institute of Climate Science (Carbon Neutrality Act Art. 36-2; Act No. 21527, addendum Art. 3)'),
        B('월간 법령 점검 47 → 52건 — 탄소중립기본법(2026.10.8·11.12, 2027.3.9·9.23 시행 예정본까지 제2조제5호·제27조① 대조), 배출권거래법(2027.3.9)·시행령(2026.10.8), 배출량 보고·인증 지침, 화학물질 배출량조사 규정', 'Monthly law check 47 → 52 — the Carbon Neutrality Act (Arts. 2(5) and 27(1) compared through the versions due 2026-10-08, 11-12, 2027-03-09 and 09-23), the ETS Act (2027-03-09) and Decree (2026-10-08), the reporting guideline and the release-survey rules')
      ],
      fix: [] },
    { no: 13, v: 'v83', date: '2026-09-27 19:07', commit: 'b592f21',
      t: B('환경(E) 법정 의무 새 화면·불산 노출 응급대응 SOP', 'New page: environmental duties; HF exposure emergency SOP'),
      add: [
        B('SOP ‘클린룸 화학물질 운반·보관’ — KOSHA P-46-2012(클린룸 안전관리): 클린룸 안에는 공구 용량이나 하루(24시간) 공급량만, 섞이면 안 되는 약품 분리·용기 표지, 내용물이 봉해지는 수레(최대 용기 20L·수레 200L 이하), 피난 복도 적재 금지, 1.02mm 강철·자동 폐쇄·잠금 캐비닛, 폐액 별도 배수·2차 봉쇄', 'SOP “Moving and storing chemicals in the cleanroom” — from KOSHA P-46-2012 (cleanroom safety): no more than the tool holds or one day’s supply, incompatibles apart and every container labelled, sealed carts (20 L largest container, 200 L per cart), nothing in escape corridors, 1.02 mm steel self-closing lockable cabinets, separate waste drains and secondary containment'),
        B('비상 대응 SOP ‘불산(불화수소) 노출 응급대응’ (SOP 26 → 28종, 위 클린룸 SOP 포함) — KOSHA H-123-2013(피부: 옷 벗고 흐르는 물 30분 이상·5분 안에 시작, 2.5% 칼슘 글루코네이트 젤, 진통제·마취제 금지 / 눈 30분 / 흡입·섭취 / 즉시 이송 기준)과 P-21-2010(보호구·이중 장갑, 전문병원 사전 확보, 응급 키트 냉장·응급조치자 상주, 소량 누출도 원인 조사), 안전보건규칙 제451조', 'Emergency SOP “HF exposure — first response” (SOPs 26 → 28 with the cleanroom SOP above) — from KOSHA H-123-2013 (skin: strip and flush 30+ minutes starting within 5, 2.5 % calcium gluconate gel, no painkillers or anaesthetics; eyes 30 minutes; inhalation and ingestion; when to go straight to hospital) and P-21-2010 (PPE and double gloves, pre-arranged hospitals, refrigerated kit and first-aider on every shift, investigate even small leaks), with Standards Rules Art. 451'),
        B('새 화면 ‘환경 법정 의무’(라이브러리) — 통합환경관리: 환경오염시설법 제6조①·시행령 별표1(반도체 제조업 2021.1.1)·시행규칙 제4조①·별표14의2로 통합허가 대상과 통합환경관리인(총괄·일반) 인원 판정, 허가 의제·가동개시 신고·금지행위·30일 내 재선임·연간 보고서·허가조건 5년 검토', 'New page “Environmental duties” (Library) — integrated pollution control: checks whether the integrated permit applies and how many environmental managers are needed (Act Art. 6(1), Decree Annex 1 — semiconductors from 2021-01-01, Rule Art. 4(1) and Annex 14-2), plus deemed permits, start-up notice, prohibited acts, 30-day reappointment, annual report and five-year permit review'),
        B('특정 유해물질 — 대기환경보전법 시행규칙 별표2(35종)·물환경보전법 시행규칙 별표3 검색, 설치허가·변경허가(30%) 기준, 물질 DB 11종 연결과 물질 상세의 ‘환경 법령’ 줄', 'Specified pollutants — searchable Air Rule Annex 2 (35) and Water Rule Annex 3, with the permit and 30 % change-permit rules; 11 substances linked, and a new “Environmental law” line in substance details'),
        B('지정폐기물 — 폐기물관리법 시행령 별표1(폐산 pH 2.0 이하·폐알칼리 pH 12.5 이상 등), 시행규칙 별표5 보관 기한 계산(45일·60일·3톤 미만 1년, 행정기본법 제6조에 따라 두 날짜 표시), 보관 요건, 보관표지', 'Designated waste — Waste Decree Annex 1 (waste acid pH ≤ 2.0, alkali pH ≥ 12.5 and more), a storage-deadline calculator from Rule Annex 5 (45 or 60 days, 1 year under 3 t; both dates shown per the Framework Act on Administration Art. 6), store rules and the storage sign'),
        B('환경 화면 네 번째 탭 ‘배출저감계획서’ — 화학물질관리법 제11조의2·시행규칙 제5조의2·화학물질안전원고시 제2025-18호: 제출 대상(고시 물질 연 1톤 이상 + 종업원 30명 이상)과 최초 기한(2·3단계는 부칙 제3조의 종업원 수별 날짜), 5년마다 재제출, 계획서 내용·검토·변경·공개 절차, 1·2단계 53종 검색', 'Fourth environment tab, “Emission-reduction plans” — from Chemicals Control Act Art. 11-2, Rule Art. 5-2 and NICS Notice No. 2025-18: who must file (1 t/yr of a listed substance and 30+ employees) and the first deadline (phases 2–3 by headcount under addendum Art. 3), five-yearly resubmission, contents, review, changes and disclosure, and a search of the 53 phase 1–2 substances'),
        B('SK하이닉스 공개 자료(지속가능경영보고서 2026) — 이천·청주 대기오염물질 배출량 2022→2025, 국내 823톤→315톤과 저감 설비, 국내 지정폐기물 발생량·재활용률(2025년 98.9%), 폐기물 매립 제로(ZWTL) 등급', 'SK hynix disclosures (Sustainability Report 2026) — Icheon and Cheongju air emissions 2022→2025, domestic 823 t → 315 t and abatement systems, domestic designated waste and recycling rate (98.9 % in 2025), and Zero Waste to Landfill grades'),
        B('업무판 법정 주기 36 → 38개 — 통합환경관리 연간 보고서(매년 7월 31일), 화학물질 배출저감계획서 재제출(5년마다 5월 31일, ‘몇 년마다 같은 날짜’ 계산 추가), 직무 구분 ‘환경’. 용어 사전 49 → 52개 — 지정폐기물, 통합환경관리인, 화학물질 배출저감계획서', 'Dashboard cycles 36 → 38 — the integrated-permit annual report (31 July) and five-yearly emission-reduction plan resubmission (31 May, with a new “same date every N years” calculation), plus an “Environment” function; glossary 49 → 52 — designated waste, integrated environmental manager, chemical emission-reduction plan'),
        B('최신 동향 — 고용노동부 지게차·크레인·컨베이어 사용 제조업 1,000개소 집중점검(2026.8.30 발표): 상반기 재해조사 대상 사고사망자 34명(11.8%) 감소·제조업은 증가, 지게차 SOP로 연결', 'News — MOEL’s focused inspection of 1,000 manufacturing sites using forklifts, cranes and conveyors (announced 2026-08-30): first-half fatalities down 34 (11.8 %) but up in manufacturing; links to the forklift SOP')
      ],
      chg: [B('인화성 용제 이송·충전 SOP — KOSHA E-188-2021(정전기 재해예방)로 ‘주입’ 단계를 조항 근거로: 충전 배관을 바닥 가까이(드럼 45mm 이내), 출구가 배관 지름 2배 이상 잠길 때까지 1 m/s 이하, 비불활성 드럼 약 225 L/분 이하, 증기 남은 용기 재충전 금지, 본딩은 뚜껑 열기 전', 'Flammable-solvent transfer SOP — the filling step now cites KOSHA E-188-2021 (static): fill pipe near the bottom (within 45 mm in drums), 1 m/s until submerged by twice the pipe diameter, about 225 L/min for non-inerted drums, no refilling containers with leftover vapour, bond before opening'),
        B('특수가스 실린더 교체 SOP — KOSHA P-153-2016(독성가스 취급시설)으로 ‘관행’ 5단계를 조항 근거로 바꿈: 표기·검사 용기 확인, 감지기-긴급차단 연계, 사용 후 치환, 밸브를 옆에서 천천히·보호캡으로 들지 않기·고정, 상시 누출검사, 실린더 이동 실시간 기록. 작업중지 기준 1개, 다음 업무 연결 3개', 'Specialty-gas cylinder change SOP — five “practice” steps now cite KOSHA P-153-2016 (toxic-gas facilities): markings and inspected cylinders only, detectors linked to shut-off valves, purge after use, work valves slowly from the side, never lift by the cap, keep secured, routine leak checks, real-time cylinder records; one more stop-work criterion and three next-step links'),
        B('월간 법령 점검 32 → 47건 — 환경 법령 12건, 화학물질관리법 시행령, 배출저감계획서 고시, 행정기본법. 시행 예정 개정을 연혁으로 확인해 인용 조문이 그대로임을 대조 — 새로 찾은 화학물질관리법 개정(법률 제21531호, 2026.10.8 시행: 환각물질 표시·광고 금지, 벌칙) 포함, 통합법 2026.12.10, 대기법 2027.1.10, 폐기물법 2027.1.8·7.8, 물환경법 2027.2.20', 'Monthly law check 32 → 47 — 12 environmental laws, the Chemicals Control Decree, the emission-reduction notice and the Framework Act on Administration. Scheduled amendments checked against the cited articles, which are unchanged — including a newly found Chemicals Control Act amendment (Act No. 21531, from 2026-10-08: hallucinogen advertising ban, penalties), integrated act 2026-12-10, air 2027-01-10, waste 2027-01-08 and 07-08, water 2027-02-20')],
      fix: [B('SOP 화면 머리말이 중위험 작업까지 모두 ‘고위험 작업 N종’으로 세던 문구 — ‘작업 N종(고위험·중위험)’으로', 'The SOP page lead counted medium-risk jobs as “high-risk jobs” — now “N jobs (high and medium risk)”'),
        B('SOP 이용 가이드가 ‘작업 20종·비상 대응 2종’으로 남아 있던 수 — 현재 24종·4종으로', 'The SOP user guide still said 20 jobs and 2 emergency responses — now 24 and 4'),
        B('업무판에서 ‘매년 정해진 날짜’ 의무(4월 30일 공시 등)를 기한 전에 마쳐도 같은 해 기한이 다시 잡히던 계산 — 최근 실시일이 속한 해의 다음 해 날짜로', 'Dashboard: fixed-date annual duties (such as the 30 April disclosure) done before the deadline were given the same year’s deadline again — now the next year’s date')] },
    { no: 12, v: 'v80', date: '2026-09-27 09:59', commit: 'ed8688b',
      t: B('화학물질 경고표지·심정지 대응·불활성가스 치환 계산', 'Chemical labels, cardiac-arrest response, inert-gas purge calculator'),
      add: [
        B('안전보건표지 화면에 ‘화학물질 경고표지(GHS)’ 탭 — 고용노동부고시 제2026-26호의 경고표지 6가지 항목, 그림문자 생략 규칙·신호어·소량(100g·mL)·자체 반제품용기 예외·색상·위치, 용기 용량별 크기(별표3), 유해성·위험성 분류 28가지(별표2), 그림문자 9종(미국 OSHA 요약카드)', 'The safety-sign page gains a “Chemical labels (GHS)” tab — from MOEL Notice No. 2026-26: the six label elements, rules for dropping pictograms, signal words, small-quantity (100 g or mL) and in-house intermediate-container exceptions, colour and position, label size by container (Annex 3), the 28 hazard classes (Annex 2), and the nine pictograms (US OSHA quick card)'),
        B('비상 대응 SOP ‘심정지 대응 — 심폐소생술·AED’ (SOP 25 → 26종) — 국민안전24(소방청) 행동요령 순서, 응급의료법 제47조의2(상시근로자 300명 이상 사업장 AED 구비·신고·매월 점검·안내표지), 업무판 법정 주기에 ‘AED 월 점검’ 추가(35 → 36개)', 'Emergency SOP “Cardiac arrest — CPR and AED” (SOPs 25 → 26) — steps from the Safety Korea (National Fire Agency) guide; Emergency Medical Service Act Art. 47-2 (AEDs at workplaces with 300 or more workers: install, register, check monthly, sign); the dashboard adds a monthly AED check (35 → 36 cycles)'),
        B('가스 안전 도구 네 번째 탭 ‘불활성가스 치환’ — KOSHA C-C-85-2026의 진공·압력 치환 횟수(식 9)와 질소 사용량(식 10), 스위프 치환 가스량(식 12), 사이펀 치환, 최소산소농도 추정(식 1)과 권장제어농도(표1)·설정점. 부록1~3 계산 예로 검증', 'Fourth gas-safety tab, “Inert-gas purging” — from KOSHA C-C-85-2026: vacuum and pressure purge cycles (Eq. 9) and nitrogen use (Eq. 10), sweep-purge gas (Eq. 12), siphon purging, the MOC estimate (Eq. 1) with the Table 1 control level and set point; checked against the Annex 1–3 worked examples'),
        B('용어 사전 47 → 49개 — ‘경고표시’(산안법 제115조), ‘최소산소농도(MOC)’(KOSHA C-C-85)', 'Glossary 47 → 49 — “warning label” (OSH Act Art. 115) and “minimum oxygen concentration (MOC)” (KOSHA C-C-85)'),
        B('최신 동향 3건 — SK하이닉스 용수 절감(9.10), 고용노동부 작업장 안전디자인 현장 방문(9.16), 협력사 ThanksFULL Day(9.17). 안전보건표지 화면에 ‘작업장 안전디자인’ 패널(정의·쓰임·클린사업장 지원)', 'Three news items — SK hynix water savings (10 Sep), MOEL workplace-safety-design visit (16 Sep), partner ThanksFULL Day (17 Sep); the safety-sign page adds a workplace-safety-design panel (definition, uses, Clean Workplace support)')
      ],
      chg: [
        B('기밀시험 SOP — KOSHA M-150-2022(절차서·게이지 눈금·설계압력 25% 이하·50% 후 10%씩 승압·15분 유지 거품시험·보고서)와 C-C-17-2026(구 D-54: 안전밸브 설정·10m 통제구역·서서히 감압)으로 ‘관행’ 4단계를 조항 근거로 바꿈, 단계 8 → 9, 퀴즈 3 → 5문항, 작업중지 기준 1개 추가', 'Leak-test SOP — KOSHA M-150-2022 (procedure, gauge range, ≤ 25 % of design pressure, 50 % then 10 % steps, 15-minute bubble test, report) and C-C-17-2026 (formerly D-54: relief-valve setting, 10 m exclusion zone, slow depressurising) turn four “practice” steps into clause-based ones; steps 8 → 9, quiz 3 → 5, one more stop-work criterion'),
        B('월간 법령 점검 30 → 32건 — 응급의료법, 화학물질의 분류·표시 및 물질안전보건자료에 관한 기준(고시 제2026-26호)', 'Monthly law check 30 → 32 — the Emergency Medical Service Act and the chemical classification, labelling and MSDS standard (Notice No. 2026-26)'),
        B('자체 점검 무결성 검사에 원문 계산 예 5건(P-179 부록5, C-C-85 부록1~3·4.1(2))을 넣어 계산식이 바뀌면 바로 잡히게 함', 'The self-check integrity test now reruns five worked examples (P-179 Annex 5; C-C-85 Annexes 1–3 and 4.1(2)) so any change to the formulas is caught')
      ],
      fix: [] },
    { no: 11, v: 'v78', date: '2026-09-26 23:24', commit: 'c4b24c9',
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

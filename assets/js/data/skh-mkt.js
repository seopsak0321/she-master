/* SK하이닉스 이해 — 세계 반도체 시장 (13단계 K5, 업데이트 #35, 2026-10-20)
   출처: WSTS 보도자료·Historical Billings Report(시장), 각 회사가 미국 SEC에 낸 연차보고서(10-K·20-F)와 회사 IR의 감사 재무제표·결산 자료(기업),
   국가법령정보센터·govinfo·EUR-Lex 법령 원문(정책). 확인 노트 she-tools/skh/k5_notes.md.
   규칙: 금액은 각 회사 보고 통화 그대로(환율로 바꾸지 않음), 회계연도가 회사마다 다르다는 것을 함께 적는다.
   비율 가운데 원문에 없는 것(장비 회사 한국 비중 일부, 메모리 비중)은 원문 두 값으로 포털이 계산했다고 표시한다.
   유료 조사(Gartner·IDC 등)의 점유율은 쓰지 않는다. 금액 단위: 백만(각 통화). */
window.SHE = window.SHE || {};
(function () {
  const B = (ko, en) => ({ ko, en });

  SHE.SKH_MKT = {
    asof: '2026-10-20',
    /* 1) 세계 시장 — WSTS */
    wsts: {
      /* 연간 세계 합계(백만 달러) — Historical Billings Report(2026년 8월 자료)의 Worldwide Total Year */
      years: [[2015, 335168], [2016, 338931], [2017, 412221], [2018, 468778], [2019, 412307], [2020, 440389], [2021, 555893], [2022, 574084], [2023, 526885], [2024, 630549], [2025, 795640]],
      /* 봄 2026 전망(2026.6.2) — [연도, 세계, 증가율, 메모리, 증가율, 로직, 증가율] */
      fc: [[2026, 1511248, 89.9, 803941, 249.5, 411371, 37.3], [2027, 1913683, 26.6, 1062085, 32.1, 522820, 27.1]],
      /* 2025년 제품별(백만 달러, 전년 대비 %) — 같은 전망표의 2025년 실적 */
      products: [[B('로직', 'Logic'), 299547, 38.8], [B('메모리', 'Memory'), 230042, 39.0], [B('아날로그', 'Analog'), 86519, 8.7], [B('마이크로(MPU·MCU 등)', 'Micro (MPU, MCU etc.)'), 84867, 7.9], [B('광소자', 'Optoelectronics'), 43042, 4.7], [B('개별소자', 'Discretes'), 30728, -1.0], [B('센서', 'Sensors'), 20894, 10.4]],
      regions: [[B('아시아태평양', 'Asia Pacific'), 439747, 30.3, 87.4], [B('미주', 'Americas'), 256476, 31.4, 112.0], [B('유럽', 'Europe'), 54694, 6.7, 58.4], [B('일본', 'Japan'), 44723, -4.3, 27.6]],
      notes: [
        { t: B('2025년 세계 반도체 시장은 7,956억 달러로 26.2% 커졌고, 4분기만 2,389억 달러(+38.4%)였습니다. 최종 시장 가운데 컴퓨터 분야가 60% 넘게 늘어 성장에 가장 크게 기여했습니다(데이터센터·AI 투자 — WSTS 설명).', 'The world chip market grew 26.2 % to US$795.6 bn in 2025, with Q4 alone at US$238.9 bn (+38.4 %). Among end markets, computing grew more than 60 % and was by far the largest contributor (data-centre and AI investment, per WSTS).'), src: ['wsts2025'] },
        { t: B('2026년 봄 전망: 시장 1조 5,112억 달러(+89.9%), 메모리는 8,039억 달러(+249.5%)로 로직(4,114억 달러)보다 커짐. WSTS는 AI 인프라·HBM·가속 컴퓨팅 수요를 주된 이유로 들었습니다. 2027년은 1조 9,137억 달러(+26.6%), 메모리 +32.1%.', 'Spring 2026 forecast: US$1,511.2 bn in 2026 (+89.9 %), with memory at US$803.9 bn (+249.5 %), overtaking logic (US$411.4 bn). WSTS cites AI infrastructure, HBM and accelerated computing. 2027: US$1,913.7 bn (+26.6 %), memory +32.1 %.'), src: ['wstsSpring26'] },
        { t: B('2026년 상반기 실적은 7,020억 달러(+102%), 메모리 +305%. 2분기 실적만 바꿔 넣으면 2026년은 1조 6,550억 달러(+약 108%), 메모리 +302%가 되지만, WSTS는 이것이 새 전망이 아니라 계산값이라고 밝혔습니다.', 'H1 2026 actuals: US$702 bn (+102 %), memory +305 %. Swapping in Q2 actuals gives US$1,655 bn for 2026 (about +108 %) and memory +302 %, which WSTS says is a calculation, not a new forecast.'), src: ['wstsQ2y26'] },
        { t: B('세계 시장에서 메모리가 차지하는 몫(포털 계산): 2025년 28.9% → 2026년 전망 53.2% → 2027년 전망 55.5%.', 'Memory’s share of the world market (portal calculation): 28.9 % in 2025 → 53.2 % forecast for 2026 → 55.5 % for 2027.'), src: ['wstsSpring26'] }
      ],
      src: ['wstsHbr', 'wstsSpring26']
    },
    /* 2) 기업 — [통화, 매출, 영업이익, 순이익](백만). skh는 화면에서 SHE.SKH 실적(2025년)을 그대로 씀 */
    firms: [
      { id: 'skh', n: 'SK hynix', c: B('한국', 'Korea'), role: B('메모리(D램·낸드·HBM)', 'Memory (DRAM, NAND, HBM)'), fy: B('2025년', 'FY2025 (Jan–Dec)'), cur: 'KRW', src: ['skhH1_2026'] },
      { id: 'samsung', n: B('삼성전자 DS 부문', 'Samsung Electronics, DS division'), c: B('한국', 'Korea'), role: B('메모리·파운드리·시스템LSI', 'Memory, foundry, System LSI'), fy: B('2025년', 'FY2025 (Jan–Dec)'), cur: 'KRW', rev: 130128162, op: 24858075, ni: null,
        note: B('부문 순이익은 공시하지 않음. 메모리 제품 매출 104조 812억 원. 2026년 2분기 DS 매출 127.5조·영업이익 89.2조, 메모리 매출 120.8조 원(실적 발표 자료)', 'No segment net income disclosed. Memory products KRW 104.08 tn. Q2 2026: DS revenue KRW 127.5 tn, operating profit 89.2 tn, memory 120.8 tn (earnings presentation)'), src: ['samsungFs25', 'samsung2q26'] },
      { id: 'micron', n: 'Micron', c: B('미국', 'US'), role: B('메모리(D램·낸드·HBM)', 'Memory (DRAM, NAND, HBM)'), fy: B('FY2026 (2025.8.29~2026.9.3, 53주)', 'FY2026 (29 Aug 2025 – 3 Sep 2026, 53 weeks)'), cur: 'USD', rev: 133188, op: 99340, ni: 84969,
        note: B('매출 +256%: D램 +252%(평균판매가격 약 180%↑), 낸드 +274%(약 200%↑)', 'Revenue +256 %: DRAM +252 % (prices up about 180 %), NAND +274 % (about 200 %)'), src: ['micron10k26'] },
      { id: 'tsmc', n: 'TSMC', c: B('대만', 'Taiwan'), role: B('파운드리(위탁 생산)', 'Foundry'), fy: B('2025년', 'FY2025 (Jan–Dec)'), cur: 'TWD', rev: 3809054, op: 1936092, ni: 1697604,
        note: B('보고서의 달러 환산 매출 1,214억 달러. 북미 고객 75%, 7nm 이하가 웨이퍼 매출의 74%, 2nm 2025년 양산', 'US$121.4 bn as converted in the filing. North American customers 75 %; 7 nm and below 74 % of wafer revenue; 2 nm in volume production in 2025'), src: ['tsmc20f25'] },
      { id: 'nvidia', n: 'NVIDIA', c: B('미국', 'US'), role: B('AI 가속기·GPU(설계 전문)', 'AI accelerators and GPUs (fabless)'), fy: B('FY2026 (2025.1.27~2026.1.25)', 'FY2026 (27 Jan 2025 – 25 Jan 2026)'), cur: 'USD', rev: 215938, op: 130387, ni: 120067,
        note: B('데이터센터 매출 1,937억 달러(전체의 약 90%, 포털 계산)', 'Data centre revenue US$193.7 bn (about 90 % of the total, portal calculation)'), src: ['nvda10k26'] },
      { id: 'asml', n: 'ASML', c: B('네덜란드', 'Netherlands'), role: B('노광 장비', 'Lithography'), fy: B('2025년', 'FY2025 (Jan–Dec)'), cur: 'EUR', rev: 32667.3, op: 11301.4, ni: 9609.4,
        note: B('노광 시스템 327대(2024년 418대), 그중 EUV 48대(44대)', '327 lithography systems (418 in 2024), of which 48 EUV (44)'), src: ['asml20f25'] },
      { id: 'amat', n: 'Applied Materials', c: B('미국', 'US'), role: B('증착·식각·CMP·이온주입 등 장비', 'Deposition, etch, CMP, implant and other tools'), fy: B('FY2025 (~2025.10.26)', 'FY2025 (to 26 Oct 2025)'), cur: 'USD', rev: 28368, op: 8289, ni: 6998, src: ['amat10k'] },
      { id: 'lam', n: 'Lam Research', c: B('미국', 'US'), role: B('식각·증착·세정 장비', 'Etch, deposition, clean'), fy: B('FY2026 (~2026.6.28)', 'FY2026 (to 28 Jun 2026)'), cur: 'USD', rev: 23232.7, op: 8199.8, ni: 7265.4,
        note: B('장비 매출 중 파운드리 54%·메모리 39%·로직/IDM 7%', 'Equipment revenue: foundry 54 %, memory 39 %, logic/IDM 7 %'), src: ['lam10k26'] },
      { id: 'tel', n: 'Tokyo Electron', c: B('일본', 'Japan'), role: B('코터/디벨로퍼·식각·증착·세정 장비', 'Coater/developer, etch, deposition, clean'), fy: B('FY2026 (2025.4~2026.3)', 'FY2026 (Apr 2025 – Mar 2026)'), cur: 'JPY', rev: 2443533, op: 624936, ni: 574454, src: ['tel26'] },
      { id: 'kla', n: 'KLA', c: B('미국', 'US'), role: B('결함 검사·계측', 'Inspection and metrology'), fy: B('FY2026 (~2026.6.30)', 'FY2026 (to 30 Jun 2026)'), cur: 'USD', rev: 13579.5, op: null, ni: 4830.8, src: ['kla10k26'] }
    ],
    /* 3) 장비 회사 매출 중 한국 — [회사, 회계연도, 비중(%), 전년, 기준, 포털 계산 여부, 출처, 원문 소수 자릿수] */
    korea: [
      ['ASML', '2025', 25.0, 22.7, B('한국 고객 매출', 'Customers in South Korea'), false, 'asml20f25', 1],
      ['Tokyo Electron', 'FY2026', 22.2, null, B('지역별 순매출 — 네 분기 합 5,436억 엔 ÷ 2조 4,435억 엔', 'Net sales by region — four quarters ¥543.6 bn ÷ ¥2,443.5 bn'), true, 'tel26', 1],
      ['Applied Materials', 'FY2025', 19.8, null, B('지역별 매출 — 56억 800만 ÷ 283억 6,800만 달러', 'Revenue by region — US$5.61 bn ÷ US$28.37 bn'), true, 'amat10k', 1],
      ['Lam Research', 'FY2026', 19, 22, B('제품 출하·서비스 제공 고객 시설 위치', 'Location of the customer facilities shipped to or served'), false, 'lam10k26', 0],
      ['KLA', 'FY2026', 13.5, 11.9, B('출하지', 'Ship-to location'), false, 'kla10k26', 1]
    ],
    koreaNote: B('보고서는 한국 매출이 어느 고객에게서 나왔는지 밝히지 않습니다. 기준(고객 소재지·출하지)이 회사마다 달라 비중을 그대로 견주기보다 흐름을 보는 데 쓰세요.', 'The reports do not say which customers the Korean revenue came from. Bases differ (customer location vs ship-to), so read the shares as a trend rather than a strict comparison.'),
    /* 4) 다른 회사의 공시에 나오는 SK하이닉스 */
    links: [
      { t: B('NVIDIA — “메모리는 SK Hynix, Micron, Samsung에서 구매한다.” 웨이퍼는 TSMC·Samsung 파운드리, 패키징은 CoWoS 기술', 'NVIDIA — “We purchase memory from SK Hynix, Micron, and Samsung.” Wafers from TSMC and Samsung foundries; CoWoS packaging'), src: ['nvda10k26'] },
      { t: B('Lam Research — 2024~2026회계연도 가장 중요한 고객으로 Micron·Samsung·SK hynix·TSMC를 듦', 'Lam Research — names Micron, Samsung, SK hynix and TSMC among its most significant customers for fiscal 2024–2026'), src: ['lam10k26'] },
      { t: B('Micron — 메모리·스토리지 시장의 경쟁사로 Samsung·SK hynix·Kioxia·Sandisk·CXMT·YMTC를 듦', 'Micron — names Samsung, SK hynix, Kioxia, Sandisk, CXMT and YMTC as competitors in memory and storage'), src: ['micron10k26'] },
      { t: B('ASML — 한국 고객이 2025년 순매출의 25.0%. 한국 평택에 조립·시험 시설', 'ASML — customers in South Korea were 25.0 % of 2025 net sales; assembly and test facility in Pyeongtaek, Korea'), src: ['asml20f25'] }
    ],
    /* 5) 각국 정책 — 법령 원문 */
    policy: [
      { id: 'kr-act', c: B('한국', 'Korea'), t: B('반도체산업 경쟁력 강화 및 지원에 관한 특별법', 'Special Act on the Semiconductor Industry'), d: B('2026.2.10 공포 · 2026.8.11 시행', 'Promulgated 10 Feb 2026 · in force 11 Aug 2026'),
        items: [
          B('산업통상부장관이 반도체클러스터를 지정할 수 있음(제11조)', 'The industry minister may designate semiconductor clusters (Art. 11)'),
          B('국가·지방자치단체가 클러스터의 전력(재생에너지·수소발전 포함)·용수·폐수·폐기물 처리·연결 도로를 조성하고 비용의 전부 또는 일부를 우선 지원(제14조)', 'Central and local governments build cluster power (including renewables and hydrogen), water, wastewater and waste treatment and access roads, and support all or part of the cost first (Art. 14)'),
          B('예비타당성조사 대상 우선 선정, 특히 시급한 사업은 면제 후 국회 보고(제24조)', 'Priority selection for feasibility studies; exemption for especially urgent projects, reported to the National Assembly (Art. 24)'),
          B('인·허가 신속처리 — 처리 계획 15일 안 회신, 처리 결과 15일 안 통보(제27조)', 'Fast-track permits — processing plan within 15 days, decision within 15 more (Art. 27)'),
          B('세제 지원은 조세특례제한법 등 세법이 정한 기준으로(제31조), 반도체산업경쟁력강화특별회계는 2036년 말까지(제35~40조, 부칙 제3조)', 'Tax support follows the tax laws such as the Restriction of Special Taxation Act (Art. 31); a special account runs until the end of 2036 (Arts. 35–40, addendum Art. 3)')
        ], src: ['krSemiAct'] },
      { id: 'kr-tax', c: B('한국', 'Korea'), t: B('조세특례제한법 제24조 — 통합투자세액공제', 'Restriction of Special Taxation Act, Art. 24 — investment tax credit'), d: B('현행 [시행 2026.9.18]', 'Version in force 18 Sep 2026'),
        items: [
          B('반도체 분야 국가전략기술 사업화·연구개발 시설에 2029.12.31까지 투자하면 기본공제 — 중소기업 30%, 중소기업을 벗어난 지 3년 안 25%, 그 밖(대기업 등) 20%', 'Semiconductor national strategic technology facilities invested by 31 Dec 2029: base credit 30 % for SMEs, 25 % within three years of outgrowing SME status, 20 % for others (including large firms)'),
          B('반도체 외 국가전략기술 시설은 25%·20%·15%', 'Other national strategic technologies: 25 %, 20 % and 15 %'),
          B('추가공제: 직전 3년 연평균보다 더 투자한 금액의 10%(기본공제의 2배 한도)', 'Additional credit: 10 % of investment above the prior three-year average (capped at twice the base credit)')
        ], src: ['krTaxInv'] },
      { id: 'us-chips', c: B('미국', 'US'), t: B('CHIPS and Science Act (Public Law 117-167)', 'CHIPS and Science Act (Public Law 117-167)'), d: B('2022.8.9 승인', 'Approved 9 Aug 2022'),
        items: [
          B('CHIPS for America Fund — 2022~2026회계연도 500억 달러: 제조 시설 인센티브 390억, 연구개발 110억(Sec.102)', 'CHIPS for America Fund — US$50 bn over FY2022–2026: US$39 bn for manufacturing incentives, US$11 bn for R&D (Sec. 102)'),
          B('인센티브 재원 중 최대 60억 달러는 직접 대출·보증 비용으로 쓸 수 있음(대출 원금 750억 달러 한도)', 'Up to US$6 bn of the incentive money may cover the cost of direct loans and guarantees (up to US$75 bn of principal)'),
          B('첨단제조 투자세액공제(§48D) — 반도체·반도체 장비 제조 시설 투자의 25%, 2027년 1월 1일 전에 착공한 것(Sec.107)', 'Advanced manufacturing investment credit (§48D) — 25 % of investment in facilities making chips or chip-making equipment, construction begun before 1 Jan 2027 (Sec. 107)'),
          B('Public Law 119-21(2025.7.4) Sec.70308이 §48D를 35%로 높임 — 2025.12.31 뒤에 사용을 시작한 자산부터', 'Public Law 119-21 (4 Jul 2025) Sec. 70308 raised §48D to 35 % for property placed in service after 31 Dec 2025')
        ], src: ['usChipsAct', 'usPl11921'] },
      { id: 'eu-chips', c: B('EU', 'EU'), t: B('반도체법(Chips Act) — Regulation (EU) 2023/1781', 'Chips Act — Regulation (EU) 2023/1781'), d: B('2023.9.13 · 관보 2023.9.18 게재, 사흘째 날 발효', '13 Sep 2023 · OJ 18 Sep 2023, in force on the third day'),
        items: [
          B('Chips for Europe Initiative 설치', 'Sets up the Chips for Europe Initiative'),
          B('공급 안정에 기여하는 ‘최초’ 시설 — 통합 생산 시설·개방형 EU 파운드리 — 인정·지원 기준', 'Criteria to recognise and support first-of-a-kind facilities — integrated production facilities and open EU foundries — that add to security of supply'),
          B('회원국·집행위원회가 반도체 부문을 감시하고 공급 부족 위기를 예방·대응하는 조정 체계', 'A Member State–Commission mechanism to monitor the sector and prevent and respond to shortages')
        ], src: ['euChipsAct'] }
    ],
    policyNote: B('SK하이닉스 미국 법인(인디애나)은 미국 상무부와의 직접 지원 협약(DFA) 이행과 대출 상환에 대해 회사가 1,028백만 달러를 보증하고 있습니다(반기보고서). 지원 금액은 회사 공시·뉴스룸에서 확인하지 못해 넣지 않았습니다. 일본·대만 정책은 다음에 원문으로 확인합니다.', 'SK hynix guarantees US$1,028 million for its Indiana subsidiary’s direct funding agreement (DFA) with the US Commerce Department and loan repayment (half-year report). The award amount itself could not be confirmed in company filings or the newsroom, so it is left out. Japanese and Taiwanese policies are to be checked against originals next.')
  };
})();

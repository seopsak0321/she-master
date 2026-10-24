/* SK하이닉스 이해 — 세계 반도체 시장 (13단계 K5, 업데이트 #35, 2026-10-20) + 반도체 현장 × AI·일본·대만 정책 (K6, #36)
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
    /* 2-1) 최근 분기 — #37 갱신(2026.10.21). 발표가 나온 회사만, 금액은 백만(보고 통화) */
    latest: {
      asof: '2026-10-24',
      rows: [
        { n: 'Lam Research', p: B('2026년 9월 분기 (회계연도 2027년 1분기)', 'Quarter to Sep 2026 (fiscal Q1 2027)'), cur: 'USD', rev: 8219.4, op: 3283.7, ni: 2753.1, yoy: 54.4, yoyCalc: true,
          note: B('영업이익률 40.0%, 분기 매출·이익 최대(회사 설명). 지역 중국 35%·한국 20%·대만 18%. 12월 분기 매출 전망 86억 달러 ± 4억 달러. 전년 같은 분기 대비는 1년 전 분기 매출(53억 2,417만 달러)로 포털이 계산', 'Operating margin 40.0 %, record revenue and profit (company statement). China 35 %, Korea 20 %, Taiwan 18 %. December-quarter guidance US$8.6 bn ± 0.4 bn. YoY computed by the portal from the year-earlier quarter (US$5,324.2 m)'), src: ['lam8k1026'] },
        { n: 'TSMC', p: B('2026년 3분기 (7~9월)', 'Q3 2026 (Jul–Sep)'), cur: 'TWD', rev: 1494243, op: 876445, ni: 763064, yoy: 50.9,
          note: B('웨이퍼 매출 중 2nm 8%·3nm 33%·5nm 28%·7nm 10%(7nm 이하 79%). 4분기 매출 전망 523억~543억 달러. 이사회 승인 전 수치', 'Wafer revenue: 2 nm 8 %, 3 nm 33 %, 5 nm 28 %, 7 nm 10 % (79 % at 7 nm and below). Q4 revenue guidance US$52.3–54.3 bn. Not yet board-approved'), src: ['tsmc3q26'] },
        { n: 'ASML', p: B('2026년 3분기', 'Q3 2026'), cur: 'EUR', rev: 11662, op: null, ni: 4960, yoy: null,
          note: B('분기 최대 순매출, 매출총이익률 57.5%, 신규 노광 시스템 113대(2분기 86대). 2026년 순매출 440억~450억 유로 예상. 현재 계획한 2027·2028년 공급으로는 수요를 다 맞추지 못할 것으로 보고 2028년 생산능력을 더 늘리는 방안을 검토(회사 설명)', 'Record net sales, gross margin 57.5 %, 113 new lithography systems (86 in Q2). 2026 net sales expected at €44–45 bn. Supply as now planned for 2027–2028 is not expected to fully meet demand, so further 2028 capacity is being studied (company statement)'), src: ['asml3q26'] },
        /* #43: 마이크론 4분기 = XBRL 10-K 연간(2025.8.29~2026.9.3) − 10-Q 누계(~2026.5.28). 전년 같은 분기 대비는 보도자료의 FQ4-25 매출로 포털 계산 */
        { n: 'Micron', p: B('회계연도 2026년 4분기 (2026.5.29~9.3)', 'Fiscal Q4 2026 (29 May – 3 Sep 2026)'), cur: 'USD', rev: 54229, op: 43751, ni: 37701, yoy: 379.3, yoyCalc: true,
          note: B('영업이익률 80.7%. 사업부별 매출 — 클라우드 메모리 162.8억·코어 데이터센터 180.0억·모바일·클라이언트 131.1억·자동차·임베디드 68.2억 달러. 회계연도 2027년 1분기 매출 전망 615억 달러 ± 15억 달러(회사 전망). 서버용 LPDDR SOCAMM 매출이 전 분기의 두 배 이상(회사 설명). 전년 같은 분기 대비는 1년 전 분기 매출(113억 1,500만 달러, 2025.5.30~8.28)로 포털이 계산 — 이번 분기가 53주 회계연도의 마지막 분기라 기간 길이가 다름', 'Operating margin 80.7 %. By business unit — Cloud Memory US$16.28 bn, Core Data Center US$18.00 bn, Mobile and Client US$13.11 bn, Automotive and Embedded US$6.82 bn. Fiscal Q1 2027 revenue guidance US$61.5 bn ± 1.5 bn (company guidance). Server LPDDR SOCAMM revenue more than doubled quarter on quarter (company statement). YoY computed by the portal from the year-earlier quarter (US$11,315 m, 30 May – 28 Aug 2025) — this quarter closes a 53-week fiscal year, so the periods differ in length'), src: ['mu8k0930'] },
        { n: 'NVIDIA', p: B('회계연도 2027년 2분기 (2026.4.27~7.26)', 'Fiscal Q2 2027 (27 Apr – 26 Jul 2026)'), cur: 'USD', rev: 96221, op: 63734, ni: 59688, yoy: 106,
          note: B('데이터센터 매출 890억 달러(+117%), 엣지 컴퓨팅 72억 달러(+27%). 3분기 매출 전망 1,080억 달러 ± 2%(회사 전망, 중국 데이터센터 컴퓨트 매출은 가정하지 않음). 분기 하이라이트에 ‘SK하이닉스와 차세대 메모리를 위한 다년 기술 파트너십 발표’가 있음. 3분기 실적은 이 갱신 때 아직 발표 전', 'Data centre revenue US$89.0 bn (+117 %), edge computing US$7.2 bn (+27 %). Q3 revenue outlook US$108.0 bn ± 2 % (company outlook, assuming no data-centre compute revenue from China). The quarter’s highlights list a multi-year technology partnership with SK hynix on next-generation memory. Q3 results were not yet out at this refresh'), src: ['nvda8k0826'] }
      ],
      note: B('SK하이닉스·삼성전자의 2026년 3분기 실적과 KLA의 9월 분기 실적은 이 갱신 때(10.24) 아직 발표 전이라 넣지 않았습니다. 발표가 나오면 다음 갱신에서 사업 현황 탭과 함께 바꿉니다. 마이크론·엔비디아는 회계연도가 달라 각 회사의 가장 최근 발표 분기입니다.', 'SK hynix’s and Samsung’s Q3 2026 results and KLA’s September quarter were not yet out at this refresh (24 Oct), so they are not included; they will be added with the Business tab at the next refresh. Micron and NVIDIA have different fiscal years, so each row is that company’s latest reported quarter.')
    },
    /* 2-2) 한국 반도체 수출 — #41. 산업통상부 ‘수출입 동향’(첨부 PDF 본문). [월, 반도체(억 달러), 전년 같은 달 대비 %, 총수출(억 달러), %, 출처] */
    krExp: {
      months: [[1, 205.4, 102.7, 658.5, 33.9, 'motieExp2601'], [2, 251.6, 160.8, 674.5, 29.0, 'motieExp2602'], [3, 328.3, 151.4, 861.3, 48.3, 'motieExp2603'], [4, 319.0, 173.5, 858.9, 48.0, 'motieExp2604'], [5, 371.6, 169.4, 877.5, 53.2, 'motieExp2605'], [6, 448.2, 199.5, 1022.5, 70.9, 'motieExp2606'], [7, 410.1, 178.8, 988.9, 62.8, 'motieExp2607'], [8, 466.5, 209.0, 982.5, 68.7, 'motieExp2608'], [9, 603.0, 262.8, 1209.4, 83.5, 'motieExp2609']],
      /* 메모리 고정가격(달러) — 각 월 보도자료의 ‘메모리 고정가격 추이’. 같은 달이 여러 보도자료에 나오면 가장 늦은 보도자료 값 */
      price: { ddr5: [28.5, 30.0, 31.0, 35.0, 37.5, 40.0, 45.0, 46.5, 48.0], nand: [9.46, 12.67, 17.7, 24.2, 26.5, 28.8, 30.1, 30.5, 30.6] },
      notes: [
        { t: B('상반기 반도체 수출 1,924억 달러(+162.6%)는 2025년 연간 실적(1,734억 달러)을 이미 넘었습니다. 1~9월 총수출은 8,145억 달러(+56.8%).', 'H1 semiconductor exports of US$192.4 bn (+162.6 %) already exceeded the 2025 full year (US$173.4 bn). Total exports for Jan–Sep were US$814.5 bn (+56.8 %).'), src: ['motieExp2606', 'motieExp2609'] },
        { t: B('정부는 증가 이유로 AI 서버 수요와 하이퍼스케일러·빅테크의 설비투자, 메모리 고정가격 상승을 들었습니다. 5월에는 메모리반도체 321억 달러(+255%)·시스템반도체 45억 달러(+6%), D램 186억(+369.8%)·낸드 17억(+206.8%)이었습니다.', 'The ministry cites AI-server demand, hyperscaler and big-tech capex and rising memory fixed prices. In May memory chips were US$32.1 bn (+255 %) and system chips US$4.5 bn (+6 %); DRAM 18.6 bn (+369.8 %), NAND 1.7 bn (+206.8 %).'), src: ['motieExp2601', 'motieExp2605', 'motieExp2608'] },
        { t: B('메모리 고정가격 DDR5 16Gb는 1년 전(2025.1) 3.75달러에서 2026.1 28.5달러(+661%)로 오른 뒤 9월 48.0달러가 됐습니다. 6월 보도자료의 같은 그래프에는 출처로 Trendforce가 적혀 있습니다.', 'The DDR5 16 Gb fixed price rose from US$3.75 a year earlier (Jan 2025) to US$28.5 in Jan 2026 (+661 %), then to US$48.0 in September. The June release labels the chart’s source as Trendforce.'), src: ['motieExp2601', 'motieExp2606', 'motieExp2609'] }
      ]
    },
    /* 3) 장비 회사 매출 중 한국 — [회사, 회계연도, 비중(%), 전년, 기준, 포털 계산 여부, 출처, 원문 소수 자릿수] */
    korea: [
      ['ASML', '2025', 25.0, 22.7, B('한국 고객 매출', 'Customers in South Korea'), false, 'asml20f25', 1],
      ['Tokyo Electron', 'FY2026', 22.2, null, B('지역별 순매출 — 네 분기 합 5,436억 엔 ÷ 2조 4,435억 엔', 'Net sales by region — four quarters ¥543.6 bn ÷ ¥2,443.5 bn'), true, 'tel26', 1],
      ['Applied Materials', 'FY2025', 19.8, null, B('지역별 매출 — 56억 800만 ÷ 283억 6,800만 달러', 'Revenue by region — US$5.61 bn ÷ US$28.37 bn'), true, 'amat10k', 1],
      ['Lam Research', 'FY2026', 19, 22, B('제품 출하·서비스 제공 고객 시설 위치', 'Location of the customer facilities shipped to or served'), false, 'lam10k26', 0],
      ['KLA', 'FY2026', 13.5, 11.9, B('출하지', 'Ship-to location'), false, 'kla10k26', 1]
    ],
    /* 3-1) 미국(북미) 매출 비중 — #40. [회사, 기간, 비중(%), 기준, 포털 계산 여부, 출처, 소수 자릿수] */
    us: [
      ['TSMC', '2025', 75, B('고객 본사 소재지 — 북미', 'Customer headquarters — North America'), false, 'tsmc20f25', 0],
      ['NVIDIA', 'FY2026', 69, B('고객 본사 소재지 — 미국 밖 본사 고객 31%의 나머지', 'Customer headquarters — the remainder after 31 % from customers headquartered outside the US'), true, 'nvda10k26', 0],
      ['Micron', 'FY2026', 68.6, B('고객 본사 소재지 — 미국 913억 2,300만 ÷ 1,331억 8,800만 달러', 'Customer headquarters — US$91.32 bn ÷ US$133.19 bn'), true, 'micron10k26', 1],
      ['SK hynix', B('2026년 상반기', 'H1 2026'), 64.1, B('반기보고서 지역별 매출 — 84조 5,648억 ÷ 131조 8,950억 원(지역 기준은 보고서에 없음)', 'Half-year report revenue by region — KRW 84.56 tn ÷ 131.90 tn (basis not stated)'), true, 'skhH1_2026', 1],
      ['KLA', 'FY2026', 13.0, B('출하지 — 북미', 'Ship-to — North America'), false, 'kla10k26', 1],
      ['Lam Research', 'FY2026', 7, B('출하·서비스 고객 시설 위치 — 미국', 'Customer facility shipped to or served — US'), false, 'lam10k26', 0]
    ],
    usNote: B('반도체를 파는 회사들은 미국 비중이 크게 나오고(TSMC·엔비디아·마이크론은 고객 본사 기준, SK하이닉스는 기준 미기재), 장비 회사(KLA·램리서치)는 장비가 들어가는 고객 시설·출하지로 집계해 미국 비중이 작게 나옵니다. 회사마다 기준이 달라 같은 잣대의 순위가 아니며, 각 회사가 공시한 기준을 그대로 옮겼습니다.', 'Chip sellers show large US shares (TSMC, NVIDIA and Micron by customer headquarters; SK hynix does not state its basis), while toolmakers (KLA, Lam) count the customer facility or ship-to location, so their US share is small. Bases differ by company, so this is not a like-for-like ranking; each company’s stated basis is kept.'),
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
        ], src: ['euChipsAct'] },
      /* #36: 일본(e-Gov 법령 API 원문)·대만(전국법규자료고) */
      { id: 'jp-5g', c: B('일본', 'Japan'), t: B('특정고도정보통신기술활용시스템 개발공급·도입 촉진법 — 반도체 생산시설 지원', 'Act on Specified Advanced ICT Systems — support for chip fabs'), d: B('반도체 조항: 2021.12.24 공포 · 2022.3.1 시행', 'Chip provisions: promulgated 24 Dec 2021 · in force 1 Mar 2022'),
        items: [
          B('특정반도체 생산시설 정비 등 계획을 주무대신이 인정 — 일정 기간 이상 계속 생산, 수급이 빠듯할 때 증산·생산능력 투자, 기술 정보 관리 체제가 요건(제11조)', 'The competent minister certifies specified-semiconductor production-facility plans — requiring continued production for a set period, more output and capacity investment when supply is tight, and control of technical information (Art. 11)'),
          B('인정받은 사업자에게 신에너지·산업기술종합개발기구(NEDO)가 조성금을 주고, 대출 금융기관에 이자 보급금을 지급(제29조)', 'NEDO pays grants to certified companies and interest subsidies to lending banks (Art. 29)')
        ], src: ['jp5gAct'] },
      { id: 'jp-ipa', c: B('일본', 'Japan'), t: B('정보처리 촉진법 개정 — 첨단 반도체 양산 지원', 'Act on the Promotion of Information Processing, amended — support for leading-edge chip production'), d: B('2025.5.14 공포 · 2025.8.4 시행', 'Promulgated 14 May 2025 · in force 4 Aug 2025'),
        items: [
          B('경제산업대신이 ‘매우 많은 정보를 매우 빠르게 처리하는’ 반도체 가운데 국내에서 안정적으로 생산되지 않는 것을 지정(제61조)', 'METI designates chips that process very large amounts of information at very high speed and are not stably produced in Japan (Art. 61)'),
          B('공모로 실시계획을 받아 심사·평가한 뒤 가장 적절한 사업자를 선정사업자로 선정(제63~65조)', 'A public call for implementation plans; after review and evaluation the most suitable company is selected (Arts. 63–65)'),
          B('2025~2030회계연도에 ‘첨단반도체·인공지능 관련 기술채’를 발행해 선정사업자 지원·첨단 반도체 생산시설·AI 계산 기반 등에 쓸 수 있음(제69조)', 'Advanced-semiconductor and AI technology bonds may be issued in FY2025–2030 to fund the selected company, leading-edge chip facilities and AI computing (Art. 69)')
        ], src: ['jpIpaAct'] },
      { id: 'tw-innov', c: B('대만', 'Taiwan'), t: B('產業創新條例(산업혁신조례) 제10조의2', 'Statute for Industrial Innovation, Art. 10-2'), d: B('2023.1.19 신설 · 2023.1.1~2029.12.31 적용', 'Added 19 Jan 2023 · applies 1 Jan 2023 – 31 Dec 2029'),
        items: [
          B('대만 안에서 기술 혁신을 하고 국제 공급망의 핵심 위치에 있는 회사: 첨단 혁신 R&D 지출의 25%를 영리사업소득세에서 공제(그해 세액의 30% 한도)', 'Companies innovating in Taiwan and holding a key place in global supply chains: 25 % of forward-looking R&D credited against corporate income tax (up to 30 % of the year’s tax)'),
          B('같은 요건의 회사가 첨단 공정에 쓸 새 기계·설비를 일정 규모 이상 사면 그 5% 공제(30% 한도), 두 공제를 합쳐 그해 세액의 50% 한도', 'Such companies buying new advanced-process equipment above a set scale get 5 % (30 % cap); the two credits together are capped at 50 % of the year’s tax'),
          B('조건: R&D 규모·매출 대비 비율, 유효세율(2023년 12%, 2024년부터 15%), 최근 3년 안에 환경보호·노동·식품안전위생 법률을 중대하게 위반한 일이 없을 것', 'Conditions: R&D scale and ratio to sales; effective tax rate (12 % in 2023, 15 % from 2024); no serious violation of environmental, labour or food-safety laws in the past three years')
        ], src: ['twInnovAct'] }
    ],
    policyNote: B('SK하이닉스 미국 법인(인디애나)은 미국 상무부와의 직접 지원 협약(DFA) 이행과 대출 상환에 대해 회사가 1,028백만 달러를 보증하고 있습니다(반기보고서). 지원 금액은 회사 공시·뉴스룸에서 확인하지 못해 넣지 않았습니다. 일본은 e-Gov 법령 원문, 대만은 법무부 전국법규자료고 원문(2026.10.8 정리분)입니다.', 'SK hynix guarantees US$1,028 million for its Indiana subsidiary’s direct funding agreement (DFA) with the US Commerce Department and loan repayment (half-year report). The award amount itself could not be confirmed in company filings or the newsroom, so it is left out. Japan from e-Gov statute texts; Taiwan from the Ministry of Justice database (compiled to 8 Oct 2026).')
  };

  /* 반도체 현장 × AI (13단계 K6, 업데이트 #36) — SK하이닉스 뉴스룸 보도자료·회사 글(임원·담당자 인터뷰 포함)과 다른 회사 연차보고서.
     인터뷰 속 수치는 ‘회사 설명’으로, 앞으로 할 일은 plan:true로 표시한다. 안전 분야 AI는 회사 안전 프로그램(SHE.COMPANY.programs의 sdx)을 그대로 쓴다. */
  SHE.SKH_AI = {
    /* #43: AI 인프라 — 뉴스룸 ‘AI Infrastructure Insight’ 1~4편(회사 글, 외부 칼럼 표시 없음). 글이 인용한 조사기관·국제기구·다른 회사 수치는 원 출처를 확인하지 못해 넣지 않는다 */
    infra: {
      parts: [
        { k: B('컴퓨트', 'Compute'), d: B('GPU·AI 가속기·CPU 같은 연산 장치. 대규모 학습과 추론을 처리하는 엔진이지만, 데이터를 안정적으로 공급받고 다른 자원과 지연 없이 연결될 때 제 역할을 합니다.', 'GPUs, AI accelerators and CPUs — the engine for large-scale training and inference, but it only performs when data arrives steadily and it links to other resources without delay.') },
        { k: B('메모리', 'Memory'), d: B('연산에 필요한 데이터를 담아 두고 필요한 순간 충분한 대역폭으로 연산 장치에 넘기는 계층. 가속기 바로 옆에서 가장 넓은 대역폭을 맡는 HBM과, 용량이 더 크고 서버 전체가 함께 쓰는 서버용 D램이 역할을 나눕니다.', 'The layer that holds the data for computation and hands it to the processors with enough bandwidth at the right moment. HBM, right next to the accelerator, carries the widest bandwidth; server DRAM, larger and shared by the whole server, takes the other role.') },
        { k: B('스토리지', 'Storage'), d: B('학습 데이터·모델 관련 데이터·사용자 요청·연산 결과를 저장하고 다시 불러오는 계층. 얼마나 빨리 저장하고 불러오느냐가 서비스 응답성과 시스템 효율을 가릅니다.', 'The layer that stores and recalls training data, model data, user requests and results. How fast it saves and loads now decides service response and system efficiency.') },
        { k: B('네트워크', 'Network'), d: B('여러 서버와 가속기가 데이터를 주고받으며 한 작업을 나눠 하도록, 흩어진 연산 자원을 하나의 시스템처럼 묶는 통신 인프라. 지연시간·대역폭·전송 효율이 확장성을 가릅니다.', 'The communications infrastructure that ties scattered compute into one system so many servers and accelerators can split a job while exchanging data. Latency, bandwidth and transfer efficiency decide how far it scales.') },
        { k: B('전력·냉각', 'Power and cooling'), d: B('고성능 장비를 촘촘히 놓을수록 전력 밀도와 발열이 높아져, 운영 단계에서 관리하던 요소가 아니라 설계 초기부터 고려해야 하는 요건이 됐습니다.', 'The more densely high-performance equipment is packed, the higher the power density and heat — so this is no longer an operations matter but a requirement from the first design stage.') }
      ],
      units: [
        { k: B('서버', 'Server'), d: B('기존 데이터센터의 성능·운영 기준 단위', 'The unit older data centres were judged and run by') },
        { k: B('랙', 'Rack'), d: B('서버·네트워크·전력·냉각 장비를 한곳에 장착하는 물리적 단위. 랙 스케일 시스템은 CPU·GPU·메모리·네트워크·전력·냉각을 랙 전체 단위로 통합 설계합니다.', 'The physical unit that houses servers, network, power and cooling gear. A rack-scale system designs CPUs, GPUs, memory, network, power and cooling together as one rack.') },
        { k: B('클러스터', 'Cluster'), d: B('여러 서버나 랙을 연결해 하나의 연산 시스템처럼 작동하게 한 집합. 규모가 커질수록 랙 사이 통신 효율과 네트워크 구조가 더 중요해집니다.', 'Servers or racks linked to act as one computing system; the bigger it gets, the more communication between racks and the network structure matter.') },
        { k: B('데이터센터 전체', 'Whole data centre'), d: B('랙 배치와 연결 거리, 전력 분배, 냉각 설비, 건물 구조까지 함께 맞춰야 성능을 충분히 끌어낼 수 있습니다.', 'Rack layout and link distances, power distribution, cooling plant and the building itself must all be matched to get the full performance.') }
      ],
      neck: [
        { t: B('메모리 대역폭이 모자라면 가속기는 계산할 준비가 돼 있어도 데이터를 기다리고, 그만큼 실제 활용률(가속기 활용률)이 떨어집니다.', 'Without enough memory bandwidth an accelerator ready to compute waits for data, and its real utilisation drops accordingly.'), src: ['nrAiInfra2'] },
        { t: B('스토리지 — 추론 때 문서·이미지·로그·검색 결과를 빨리 읽지 못하면 응답이 느려지고, 학습 중 체크포인트를 빨리 저장·복원하지 못하면 학습 클러스터 전체에 대기 시간이 생길 수 있습니다.', 'Storage — slow reads of documents, images, logs or search results slow inference responses, and slow checkpoint saves and restores can leave a whole training cluster waiting.'), src: ['nrAiInfra2'] },
        { t: B('네트워크 — 서버 사이 전송이 늦거나 대역폭이 부족하면 일부 구간의 지체가 전체 작업 속도를 끌어내립니다.', 'Network — slow transfers or too little bandwidth between servers let one lagging segment drag down the whole job.'), src: ['nrAiInfra2'] },
        { t: B('대응 — 자주 쓰는 데이터는 연산 장치 가까이, 대규모 데이터는 스토리지·네트워크로 불러오도록 속도·용량·비용·전력 효율을 함께 따져 데이터의 위치와 경로를 설계하고, 소프트웨어가 작업 순서·데이터를 부르는 시점·장치 배치를 조율합니다. 데이터 이동을 줄이면 전력 효율에도 도움이 됩니다.', 'Response — design where data sits and how it travels by weighing speed, capacity, cost and power together (frequently used data near the processors, bulk data via storage and network), with software ordering jobs, timing data loads and placing work across devices. Moving data less also saves power.'), src: ['nrAiInfra2'] }
      ],
      power: [
        { t: B('냉각은 서버·랙에서 열을 빼는 과정(공랭·액체 냉각 등)과 회수한 열을 밖으로 내보내는 과정(냉각수 순환·열 교환 설비 등)으로 나뉘고, 외부 전력을 장비가 쓰는 형태로 변환·분배할 때도 효율 손실이 생깁니다.', 'Cooling splits into removing heat from servers and racks (air, liquid and other cooling) and rejecting the recovered heat outside (coolant loops, heat exchangers and more); converting and distributing incoming power also loses efficiency.'), src: ['nrAiInfra3'] },
        { t: B('냉각이 모자라면 연산 장치가 스스로 동작 속도를 낮춰 성능이 떨어지고 장비 안정성·수명·유지보수 비용에도 영향을 주므로, 서버·랙·클러스터 구성, 패키징, 전력 공급 구조와 함께 설계 초기부터 고려합니다.', 'Without enough cooling the processors slow themselves down, cutting performance and affecting stability, lifetime and maintenance cost — so cooling is designed in from the start with server, rack and cluster layout, packaging and power delivery.'), src: ['nrAiInfra3'] },
        { t: B('고밀도 AI 시스템에서는 열원 가까이에서 열을 빼는 액체 냉각·칩 인접 냉각이 핵심 기술로 떠오르고, 초점이 데이터센터 공간 전체의 온도 관리에서 랙·프로세서처럼 발열이 몰리는 지점의 직접 제어로 옮겨 가고 있습니다.', 'In dense AI systems, liquid and near-junction cooling that remove heat close to the source are becoming key, and the focus is moving from cooling the whole room to directly controlling hot spots such as racks and processors.'), src: ['nrAiInfra3'] },
        { t: B('전력과 냉각 용량을 수요만큼 빨리 늘리기 어려워 ‘전력당 성능’이 경쟁 기준이 되고, 데이터센터 입지·투자에서도 전력 확보 가능성·계통 연결·냉각 자원·운영 비용이 핵심 변수가 됩니다.', 'Because power and cooling capacity cannot grow as fast as demand, performance per watt becomes a competitive yardstick, and power availability, grid connection, cooling resources and running cost become key factors in where and how data centres are built.'), src: ['nrAiInfra3'] }
      ],
      codesign: [
        { t: B('워크로드가 설계의 출발점 — 학습은 높은 처리량·메모리 대역폭·가속기 간 빠른 연결, 추론은 낮은 지연시간·데이터 접근 속도·처리량·전력과 비용 효율이 주요 조건입니다. 에이전틱 AI처럼 추론과 외부 도구·데이터 접근이 반복되면 데이터 흐름이 더 복잡해집니다.', 'Design starts from the workload — training needs high throughput, memory bandwidth and fast links between accelerators; inference needs low latency, fast data access, throughput and power and cost efficiency. Agentic AI, repeatedly reasoning and calling tools and data, makes data flows more complex.'), src: ['nrAiInfra4'] },
        { t: B('부품을 따로 만든 뒤 마지막에 합치는 방식에서, 컴퓨트·메모리·스토리지·네트워크·전력·냉각 조건을 설계 단계에서 함께 맞추는 공동 설계로 바뀌고 있습니다.', 'Design is moving from building parts separately and integrating them at the end to co-design, matching compute, memory, storage, network, power and cooling from the start.'), src: ['nrAiInfra4'] },
        { t: B('공통 기준 — 전력 인프라는 OCP를 중심으로 차세대 데이터센터의 전력 구조·요구 조건·인터페이스 표준화 논의가 이어지고, 메모리는 JEDEC 같은 표준화 기구가 HBM 등 주요 제품의 기본 규격을 정합니다.', 'Common standards — for power infrastructure, work on standardising next-generation power architecture, requirements and interfaces continues around OCP; for memory, standards bodies such as JEDEC set the base specifications for HBM and other key products.'), src: ['nrAiInfra4'] },
        { t: B('표준 위에서 시스템별 최적화 — 차세대 HBM에서는 베이스 다이를 중심으로 고객 시스템의 요구를 반영하는 커스텀 HBM 논의가 본격화되고 있고, SK하이닉스는 고객의 차세대 AI 시스템 개발에 더 이른 단계부터 참여해 필요한 메모리 조건을 함께 정의하는 방식으로 협력을 넓히고 있다고 설명합니다.', 'Optimising each system on top of the standard — for next-generation HBM, custom HBM built around the base die to reflect customer system needs is under serious discussion, and SK hynix says it is widening cooperation by joining customers’ next-generation AI system development earlier and defining the memory conditions together.'), src: ['nrAiInfra4'] }
      ],
      note: B('모두 SK하이닉스 뉴스룸 연재의 회사 설명입니다. 글이 인용한 조사기관·국제기구·다른 회사의 수치(시장 규모·전력 소비 전망·설문 결과 등)는 이 포털이 원 출처에서 직접 확인하지 못해 넣지 않았습니다.', 'All of this is the company’s explanation in its newsroom series. Figures the articles cite from research firms, international bodies and other companies (market size, power-use projections, survey results and the like) are left out because the portal could not check them at their original source.')
    },
    mem: [
      { t: B('AI 성능은 연산만으로 정해지지 않고 메모리 대역폭·용량·전력 효율·지연시간이 함께 좌우합니다. 프로세서의 연산 속도와 메모리의 데이터 공급 속도 사이 격차를 ‘메모리 월’이라 부르고, HBM은 D램을 수직으로 쌓아 AI 가속기 가까이에서 높은 대역폭을 공급하는 기술입니다(회사 설명).', 'AI performance depends not only on compute but on memory bandwidth, capacity, power efficiency and latency. The gap between processor speed and memory supply is the “memory wall”; HBM stacks DRAM vertically to feed high bandwidth right next to AI accelerators (company explanation).'), src: ['nrAiMem5'] },
      { t: B('수요는 학습에서 추론·서비스·산업 전반으로 넓어지며, HBM뿐 아니라 서버 메모리(AI-DRAM)와 고용량 스토리지(AI-NAND)로 이어진다는 것이 회사의 ‘풀 스택 AI 메모리’ 설명입니다.', 'Demand is spreading from training to inference, services and industry, reaching server memory (AI-DRAM) and high-capacity storage (AI-NAND) as well as HBM — the company’s “full-stack AI memory” explanation.'), src: ['nrAiMem5'] },
      { t: B('SK하이닉스 D램 매출에서 HBM이 2024년 3분기 30%, 4분기 40% 이상이었습니다(실적 보도자료).', 'HBM was 30 % of SK hynix DRAM revenue in Q3 2024 and over 40 % in Q4 (results releases).'), src: ['nrRes24q3', 'nrRes24'] },
      { t: B('엔비디아 FY2026: 데이터센터 매출 1,937억 달러(전체의 약 90%), “메모리는 SK Hynix, Micron, Samsung에서 구매”(연차보고서).', 'NVIDIA FY2026: data-centre revenue US$193.7 bn (about 90 % of the total); “we purchase memory from SK Hynix, Micron and Samsung” (annual report).'), src: ['nvda10k26'] },
      { t: B('2026.6 엔비디아와 장기 기술 파트너십 — 차세대 메모리 공동 개발, 첨단 메모리의 긴 개발 주기를 고려한 안정 공급.', 'June 2026 multi-year partnership with NVIDIA — co-developing next-generation memory and stable supply over long development cycles.'), src: ['nrNvPartner'] },
      { t: B('WSTS는 2026년 메모리 시장이 249.5% 커질 것으로 전망하며 AI 인프라·HBM·가속 컴퓨팅 수요를 주된 이유로 들었습니다.', 'WSTS forecasts the memory market to grow 249.5 % in 2026, citing AI infrastructure, HBM and accelerated computing.'), src: ['wstsSpring26'] }
    ],
    /* 제조 현장의 AI — 날짜순 */
    fab: [
      { d: '2017', t: B('국내 제조업 최초로 데이터 사이언스 조직 출범(회사 설명)', 'Data-science organisation set up — first in Korean manufacturing (company statement)'), src: ['nrGaia'] },
      { d: '2022-12', t: B('가상 계측 AI ‘Panoptes VM’(가우스랩스) 양산 팹 도입 — 장비 센서 데이터(압력·온도·가스 주입량 등)로 계측하지 않은 웨이퍼의 막 두께·굴절률을 예측. 박막 증착 공정에서 APC와 연동해 공정 산포 평균 21.5% 개선, 수율 향상', 'Virtual-metrology AI Panoptes VM (Gauss Labs) in production fabs — predicts film thickness and refractive index for unmeasured wafers from tool sensor data (pressure, temperature, gas flow and more). In thin-film deposition, linked to APC: process variation down 21.5 % on average, yield up'), src: ['nrPanoptes'] },
      { d: '2024', t: B('AI 전환(AIX) 전문 팀 구성', 'AI-transformation (AIX) team formed'), src: ['nrGaia'] },
      { d: '2025-04', t: B('DT 조직 성과(회사 설명) — HBM용 스마트팩토리(전·후공정 연계 생산 계획, 저진동 반송 제어)로 병목 공정 생산성 31%·문제 공정 수율 21% 개선, AI 결함 이미지 분석, 장비 유지보수 자동화, 모든 웨이퍼를 보는 AI 가상 계측, EUV 장비를 여러 라인·연구 조직·해외 법인이 함께 쓰는 운영으로 가동률 30% 향상', 'DT results (company statement) — an HBM smart factory (front/back-end linked planning, low-vibration transport) raising bottleneck productivity 31 % and problem-step yield 21 %; AI defect-image analysis; automated tool maintenance; AI virtual metrology covering every wafer; shared global operation of EUV tools across lines, R&D and overseas sites raising uptime 30 %'), src: ['nrDtAward25'] },
      { d: '2025-07', t: B('유틸리티 설비 AI·DT — 외기 공조(OAC) 머신러닝 자율 운전 14%, 폐열 회수 머신러닝 모델 5.8%, 냉동기 운전 가이드 4.7%(+M14 3.8%) 에너지 절감', 'AI/DT for utilities — machine-learning autonomous outside-air conditioning 14 %, ML waste-heat recovery 5.8 %, chiller operating guides 4.7 % (+3.8 % at M14) energy savings'), src: ['nrAiDtEnergy'] },
      { d: '2025-07', t: B('생성형 AI 플랫폼 GaiA — 장비 보전 에이전트(장비 이상·조치 기록 Inform Note 학습, 이력 요약·조치 가이드), EDA 스크립트, 로그 분석(SSD 스펙 관련 불량 분석 시간 20% 이상 단축), Global Insight. 8월 사내 LLM Chat 베타', 'Generative-AI platform GaiA — equipment-maintenance agent (learns Inform Notes on tool problems and fixes; history summaries and repair guides), EDA scripts, log analysis (spec-related SSD failure analysis over 20 % faster), Global Insight; in-house LLM Chat beta from August'), src: ['nrGaia', 'nrGaiaAgent'] },
      { d: '2026-02', t: B('가상 계측 논문 2편(SPIE) — 장비 간 성능 차이를 찾아 이상을 일찍 탐지·진단, 포토 공정 오버레이 예측의 근거를 설명하는 GRACE(2025년부터 현장 적용)', 'Two virtual-metrology papers (SPIE) — finding tool-to-tool differences for early anomaly detection, and GRACE, which explains photo overlay predictions (in use since 2025)'), src: ['nrSpie26'] },
      { d: '2026-06', t: B('엔비디아와 반도체 설계·제조 AI — TCAD·계산 리소그래피 시뮬레이션 가속, 실제 팹을 3차원 가상 공간에 옮긴 디지털 트윈, 자율 이동 로봇(AMR) 등 운영 최적화. 목표는 완전 자율 팹 운영', 'With NVIDIA, AI for chip design and manufacturing — faster TCAD and computational-lithography simulation, a 3D digital twin of the fab, optimised operation of autonomous mobile robots and other assets; aiming at fully autonomous fab operation'), src: ['nrNvPartner'], plan: true },
      { d: '2026-09', t: B('양산 현장의 표준업무절차(SOP)를 바탕으로 AI와 함께 일하는 방식을 다시 설계 — 라인 이상 때 AI가 데이터를 분석해 원인·대응을 제시하고 사람은 최종 판단, GaiA로 팹 생산 운영 준비(미래포럼 발표)', 'Redesigning work with AI on top of production SOPs — when a line goes wrong AI analyses the data and proposes causes and actions while people make the final call; preparing GaiA for fab operation (Future Forum)'), src: ['nr0909'], plan: true },
      { d: '2026-10', t: B('제19회 반도체의 날 포상 공적(회사 글) — 전사 AX 전담 조직 신설·전문가 양성으로 ‘미래형 자율 운영 팹’ 전환을 이끄는 중, 극저온 공정·장비 제어 업계 최초 도입, 장비 제어 소프트웨어·실시간 데이터 플랫폼 자체 개발, 산학 협력으로 만든 AI 스케줄러 특허 무상 양도', '19th Semiconductor Day citations (company article) — a company-wide AX organisation and expert training leading the move to an autonomous fab, industry-first cryogenic process and tool control, in-house tool-control software and a real-time data platform, an AI scheduler patent from industry–academia work transferred free'), src: ['nrSemiDay26'] }
    ],
    /* #44: 직무로 본 현장의 고민 — 뉴스룸 ‘SK하이닉스 JOB리포트’ 1~5편(뉴스룸이 대학생 앰버서더와 함께 구성원을 인터뷰한 회사 글). 구성원·채용 담당자 이름은 넣지 않는다 */
    jobs: [
      { id: 'base', d: '2026-05', k: B('기반기술', 'Fundamental technology'),
        role: B('공정·소재·계측·분석처럼 반도체 제조의 바탕이 되는 기술을 개발·개선하고, 개발부터 양산까지 공정 안정성을 확인하며 문제가 생기면 근본 원인을 밝혀 개선 방향을 제시합니다. 2024년 기반기술센터를 신설했습니다.', 'Develops and improves the technologies under chipmaking — process, materials, metrology and analysis — checks process stability from development to production, and finds root causes and directions for fixes. The Fundamental Technology Center was set up in 2024.'),
        subs: [B('DMI — 패턴 변화·결함을 검출하는 계측 기술', 'DMI — metrology that detects pattern changes and defects'), B('AT — 분석 장비로 나노 구조·물성 규명', 'AT — nano-structure and material analysis'), B('Mask — DUV·EUV 포토마스크 기획·제작·검증', 'Mask — planning, making and verifying DUV and EUV photomasks'), B('소재 — 첨단 공정용 소재 개발·최적화', 'Materials — new materials for advanced processes'), B('Machine Engineering — AI/AX 기반 양산 장비 품질 향상·고질 문제 해결', 'Machine Engineering — AI/AX-based tool quality and chronic-problem fixes'), B('Defect & Environment Control — 결함 근본 원인 분석, 팹 환경 제어', 'Defect & Environment Control — defect root causes and fab environment control')],
        worry: [B('미세화가 빨라지면서 예전에는 계측할 수 있던 영역도 정확히 재기 어려워져, 새 계측 방법을 찾는 것이 가장 큰 고민 — 사내 소자·공정 조직과 평가를 반복하고 장비 협력사와도 소통', 'With faster scaling, even areas once measurable are hard to measure accurately, so finding new metrology is the main worry — repeated evaluations with in-house device and process teams and ongoing talks with tool suppliers'), B('검사 장비가 찾은 마스크 결함의 분류·제거 절차와 마스크별 이슈 관리를 수작업으로 해 왔음', 'Classifying and removing mask defects found by inspection tools, and tracking each mask’s issues, had been done by hand')],
        ai: [B('AI 전담 부서와 함께 마스크 관리 시스템 전체를 AI 기반으로 자동화하는 중, 머신러닝 기반 웨이퍼 출력 결함 예측과 결함 분류 자동화도 추진', 'Automating the whole mask-management system with AI together with the AI team, and pursuing machine-learning prediction of wafer printability defects and automatic defect classification'), B('AX·DX 전환에 맞춰 AI·DT 기반 분석 툴을 쓰는 능력이 점점 중요해진다는 설명', 'The company says the ability to use AI- and DT-based analysis tools matters more as AX and DX advance')],
        src: ['nrJob1'] },
      { id: 'pkg', d: '2026-06', k: B('PKG개발', 'Package development'),
        role: B('완성된 칩을 연결·집적해 성능·전력 효율·신뢰성을 최적화하는 ‘통합 엔지니어’ 역할 — 칩 사이 거리를 줄이고 데이터 통로를 넓히며, 적층 구조에서 생기는 발열·신뢰성 문제를 풉니다. 양산기술(P&T)이 양산 안정화·수율에 집중한다면 PKG개발은 새 패키지 구조·공정의 설계·검증에 집중합니다.', 'The “integration engineer” who connects and integrates finished chips for performance, power efficiency and reliability — shortening the distance between chips, widening data paths and solving heat and reliability problems in stacks. Where P&T production engineering focuses on stable output and yield, package development designs and verifies new structures and processes.'),
        subs: [B('Package 제품 개발 — 설계·공정·장비를 함께 최적화해 양산 기반 마련', 'Package product development — optimising design, process and tools together for production'), B('혁신·차별화 기술 개발(Package Innovation)', 'Package innovation — breakthrough and differentiated packaging'), B('미래 기술 및 고객 대응 — 차세대 플랫폼, 고객 맞춤 패키지', 'Future technology and customer support — next platforms and customer-specific packages')],
        worry: [B('스탠다드 HBM(JEDEC 표준)은 성능이 높아지며 생기는 발열을 제어하려 신규 공정·소재를 개발하고, 커스텀 HBM은 표준에서 일부 벗어나 고객 요구 스펙과 회사가 대응 가능한 기술 수준을 긴밀히 협의', 'For standard (JEDEC) HBM, new processes and materials to control the heat that comes with higher performance; for custom HBM, which departs partly from the standard, close negotiation between the customer’s spec and what the company can deliver'), B('고객과 약속한 일정 안에 완성도 높은 결과를 내는 것 — 한정된 시간·자원 때문에 일부만 만든 자재를 먼저 받아 셋업 기간을 확보하거나, 실제 구조를 모사한 더미 자재로 미리 평가', 'Delivering mature results within the schedule promised to customers — with limited time and resources, taking partly made materials early to secure set-up time, or pre-testing with dummy materials that mimic the real structure'), B('공정 이상은 단일 원인이 드물어 열·구조·재료 관점에서 데이터로 근본 원인을 추적해야 함', 'Process anomalies rarely have a single cause, so root causes must be traced with data from thermal, structural and material angles')],
        ai: [], src: ['nrJob2'] },
      { id: 'sys', d: '2026-07', k: B('System Architecture & Software Solution', 'System Architecture & Software Solution'),
        role: B('메모리 칩을 설계·제조하는 대신, 제품이 AI 서버·데이터센터에서 어떻게 쓰일지 고려해 시스템 구조를 설계하고(System Architecture), AI 모델의 동작 패턴을 분석해 KV 캐시 저장 방식과 데이터 이동 경로를 설계하며 새 메모리 기술이 AI 성능에 주는 영향을 시뮬레이션합니다(Software Solution).', 'Instead of designing or making memory chips, System Architecture designs the system around how products will be used in AI servers and data centres, and Software Solution analyses AI models’ behaviour to design KV-cache storage and data paths and simulates how new memory affects AI performance.'),
        subs: [B('데이터센터 아키텍처 — 클러스터 수준의 메모리·인터커넥트 구조', 'Data-centre architecture — cluster-level memory and interconnect'), B('xPU/SoC 아키텍처 — 메모리 중심 AI 반도체·직접 연산 구조', 'xPU/SoC architecture — memory-centric AI chips and in-memory computing'), B('메모리 서브 시스템 아키텍처 — 하드웨어·소프트웨어 수직 통합', 'Memory subsystem architecture — vertical hardware–software integration'), B('AI 모델 연구·플랫폼 소프트웨어 연구·시스템 소프트웨어 연구(이종 메모리 관리, 연산 메모리용 컴파일러)', 'AI model research, platform software research, system software research (heterogeneous memory management, compilers for computing memory)')],
        worry: [B('여러 기능을 비교·분석할 때 가장 객관적인 비교 기준을 빨리 세우는 것', 'Quickly setting the most objective yardstick when comparing many functions'), B('새로 제안한 설루션이 시스템 수준의 복합 요인 때문에 기대만큼 성능 향상으로 이어지지 않을 때 — 진행 상황을 팀과 투명하게 공유하며 원인을 여러 각도로 분석', 'When a proposed solution does not deliver the expected gain because of system-level factors — sharing progress openly with the team and analysing causes from many angles')],
        ai: [B('LLM이 메모리를 쓰는 방식을 분석해 성능 병목을 푸는 소프트웨어 방안을 찾아 시스템에 적용', 'Analysing how LLMs use memory and applying software fixes for performance bottlenecks')],
        src: ['nrJob3'] },
      { id: 'fabops', d: '2026-09', k: B('양산관리', 'Production management'),
        role: B('팹 안의 방대한 데이터를 분석해 병목을 미리 풀고 공정 사이 이해관계를 조율해 생산성을 끌어올립니다. 매일 대기 물량(WIP)·장비 생산 능력(Capa)·목표 생산량을 종합해 그날의 최적 운영 계획을 세우고 총 소요 시간(TAT)을 줄이는 것이 핵심입니다.', 'Analyses the fab’s huge data to clear bottlenecks early and balance interests between steps to raise output. Each day it combines work in process (WIP), tool capacity and output targets into the best plan for the day, aiming to cut turnaround time (TAT).'),
        subs: [B('생산 계획 및 진도 관리 — 팹별·제품별 생산 일정, 선제적 양산 포함 진도', 'Production planning and progress — schedules by fab and product, including early production'), B('Capa 및 효율 관리 — 생산 능력 시뮬레이션, 최적 장비 배정', 'Capacity and efficiency — capacity simulation and best tool assignment'), B('물류 개선 및 관리 — 실제 물류 흐름을 시뮬레이션해 팹 간 이동 경로 개선', 'Logistics — simulating real material flow to improve routes between fabs')],
        worry: [B('같은 데이터도 부서마다 다르게 해석하는 ‘시각차’ — 최소 주 1회 유관 부서와 데이터의 의미를 맞추는 미팅', 'Departments reading the same data differently — at least weekly meetings with related teams to align what the data means'), B('기한이 정해진 일보다 ‘지금 당장’ 풀어야 할 이슈가 훨씬 많아, 상황에 맞는 데이터를 즉시 모으고 판단해야 함', 'Far more issues need solving right now than have deadlines, so the right data must be gathered and judged immediately')],
        ai: [B('Python·SQL로 생산 데이터에서 인사이트를 뽑아 시스템화하고 변수를 미리 예측하는 능력이 중요해졌다는 설명', 'Using Python and SQL to draw insight from production data, build it into systems and predict variables ahead has become important'), B('AI 등 지능화 시스템이 들어오면 단순 모니터링을 넘어 장비 이상·병목을 미리 예측해 대응하는 ‘의사결정자’로 역할이 바뀔 것으로 기대', 'With AI and other intelligent systems, the role is expected to move beyond monitoring to a decision-maker who predicts tool faults and bottlenecks and acts first')],
        src: ['nrJob4'] },
      { id: 'qa', d: '2026-10', k: B('품질보증', 'Quality assurance'),
        role: B('개발·양산·출하·고객 사용까지 제품 전 생애주기의 품질을 관리합니다 — 개발 단계에서 성능·신뢰성 기준과 양산 투입 여부를 판단하고, 양산 중에는 수율·불량률·공정 데이터로 품질 변화를 조기에 찾으며, 출하 전 시험 결과·제조 이력을 종합 검토하고, 출하 뒤 불량은 재현·원인 분석·대책과 재발 방지 기준 보완까지 맡습니다.', 'Manages quality over the whole life cycle — judging performance, reliability and readiness for production during development, spotting quality shifts early from yield, defect rates and process data in production, reviewing test results and manufacturing history before shipment, and after shipment reproducing failures, finding causes, fixing them and tightening standards against recurrence.'),
        subs: [B('제품인증 — 인증 평가 기준 수립, 제품 인증(Qualification)', 'Qualification — setting criteria and qualifying products'), B('양산품질보증 — 품질 모니터링, 공정 부적격 자재 처리, 공정 변경 관리, 출하 품질 검사', 'Production QA — monitoring, handling non-conforming material, process-change control, outgoing inspection'), B('고객품질 — 고객 불량 개선 대책, 내부 품질 개선 활동', 'Customer quality — fixes for customer failures, internal improvement'), B('불량분석 — 인증·양산·고객 불량 개선을 위한 전방위 분석', 'Failure analysis — all-round analysis for qualification, production and customer failures')],
        worry: [B('한정된 인력으로 수많은 공정 변수를 어떻게 완벽히 통제할지 — 엔지니어가 모든 데이터를 실시간으로 보고 미세한 이상을 빠짐없이 잡기에는 물리적 한계', 'How to fully control countless process variables with limited staff — engineers cannot watch all data in real time and catch every subtle anomaly'), B('원인을 알 수 없는 돌발 문제를 정해진 기한 안에 해결하는 것. 양산 품질의 목표는 ‘품질 이벤트 제로(Quality Event Zero)’', 'Solving sudden problems of unknown cause within the deadline; the production-quality goal is “Quality Event Zero”')],
        ai: [B('AI로 리스크를 미리 진단하고 자동으로 판정하는 시스템을 구축하는 중', 'Building a system that uses AI to diagnose risk in advance and judge automatically'), B('앞으로 AI로 불량을 미리 감지하는 ‘예측·예방’ 중심으로 발전하겠지만, AI가 찾은 미세한 불량 가능성이 실제 어떤 위험인지 판단하는 것은 엔지니어의 몫이라는 설명', 'The work will move toward AI-based prediction and prevention, but judging what a subtle defect signal found by AI actually means for risk stays with the engineer')],
        src: ['nrJob5'] }
    ],
    notes: [
      B('수치는 회사가 보도자료와 담당 임원·구성원 인터뷰에서 밝힌 것으로, 어느 공정·기간 기준인지 원문에 적힌 범위에서만 옮겼습니다. 외부 업체(가우스랩스·엔비디아)의 제품 설명은 넣지 않았습니다.', 'Figures are those the company gave in press releases and interviews with its executives and staff, copied only to the extent the originals say which step or period they cover. Vendor product claims (Gauss Labs, NVIDIA) are left out.')
    ]
  };
})();

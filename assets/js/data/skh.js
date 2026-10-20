/* SK하이닉스 이해 — 회사·제품·사업 현황 (13단계 K1, 업데이트 #31, 2026-10-11)
   목적: AI 해커톤 준비 — SK하이닉스와 반도체 산업에 대한 공식 자료만 모아 언제든 바로 쓰게 한다.
   출처: skhH1_2026(제79기 반기보고서, 2026.8.14 제출 — 금융위원회·한국거래소 제출 정기보고서, 회사 IR 화면의 PDF), skhProducts(공식 제품 사이트 product.skhynix.com).
   규칙: 수치는 원문 표의 값(백만원)을 조·억 단위로 바꾼 것 — 원문 단위·기준일을 함께 적는다. 회사가 인용한 시장 조사(Gartner·IDC·무역협회) 수치는 ‘회사 보고서가 인용한’으로 표시한다.
   추정·해석은 넣지 않는다. 다음 확장(공정·장비·거점·시장·AI)은 ROADMAP 13단계. */
window.SHE = window.SHE || {};
(function () {
  const B = (ko, en) => ({ ko, en });
  const R = 'skhH1_2026', P = 'skhProducts';
  SHE.SKH = {
    asof: '2026-10-11',
    /* 1) 회사 기본 — 반기보고서 I. 회사의 개요 */
    basics: [
      { k: B('정식 명칭', 'Legal name'), v: B('에스케이하이닉스 주식회사 (영문 SK hynix Inc.)', 'SK hynix Inc.'), src: [R] },
      { k: B('설립과 상호 변경', 'Founding and names'), v: B('1949년 10월 국도건설로 설립 → 1983년 2월 현대전자산업 → 2001년 3월 하이닉스반도체 → 2012년 3월 에스케이하이닉스', 'Founded October 1949 as Kukdo Construction → Hyundai Electronics Industries (February 1983) → Hynix Semiconductor (March 2001) → SK hynix (March 2012)'), src: [R] },
      { k: B('상장', 'Listing'), v: B('유가증권시장 1996년 12월 26일 상장, 종목코드 000660', 'Listed on the KOSPI market on 26 December 1996, ticker 000660'), src: [R] },
      { k: B('본사', 'Head office'), v: B('경기도 이천시 부발읍 경충대로 2091', '2091 Gyeongchung-daero, Bubal-eup, Icheon-si, Gyeonggi-do'), src: [R] },
      { k: B('대표이사', 'CEO'), v: B('곽노정(2022.3.30 선임, 2024.3.27부터 단독 대표이사)', 'Kwak Noh-Jung (appointed 30 March 2022; sole CEO since 27 March 2024)'), src: [R] },
      { k: B('최대주주', 'Largest shareholder'), v: B('SK스퀘어(주) 20.50%(특수관계인 포함, 2026.6.30) — 2021.11.2 SK텔레콤 인적분할로 지분 승계', 'SK Square Co., Ltd., 20.50 % including related parties (30 June 2026) — took over the stake from SK Telecom’s spin-off on 2 November 2021'), src: [R] },
      { k: B('사업 거점', 'Footprint'), v: B('이천 본사를 거점으로 생산기지 4곳·연구개발법인 3곳, 미국·중국·싱가포르·대만·일본·유럽 등에 판매법인과 사무소', 'Four production bases and three R&D subsidiaries around the Icheon head office, with sales subsidiaries and offices in the US, China, Singapore, Taiwan, Japan, Europe and elsewhere'), src: [R] },
      { k: B('연결 종속회사', 'Consolidated subsidiaries'), v: B('57개(2026.6.30) — 2026년 상반기 새로 4개(Solidigm Inc., Solidigm NAND product Solutions (Dalian), SHIFTIX Holdings LLC, SHIFTIX1 LLC)', '57 (30 June 2026) — four added in H1 2026 (Solidigm Inc., Solidigm NAND product Solutions (Dalian), SHIFTIX Holdings LLC, SHIFTIX1 LLC)'), src: [R] },
      { k: B('주력 사업', 'Main business'), v: B('DRAM·NAND Flash·MCP(Multi-chip Package) 메모리 반도체가 주력이고 Foundry 사업도 병행. 2007년 출범한 CIS(CMOS 이미지 센서) 사업부문은 2025년 3월 AI 메모리 분야로 전환', 'Memory chips — DRAM, NAND flash and MCP (multi-chip packages) — with a foundry business alongside. The CIS (CMOS image sensor) unit launched in 2007 was converted to AI memory in March 2025'), src: [R] },
      { k: B('연구개발 조직', 'R&D organisation'), v: B('선행기술연구소, 기반기술연구소, Solution개발연구소 등', 'Advanced Technology, Fundamental Technology and Solution Development research institutes, among others'), src: [R] },
      { k: B('지식재산권', 'Intellectual property'), v: B('22,236건(2026.6.30)', '22,236 rights (30 June 2026)'), src: [R] },
      { k: B('생산 운영', 'Operations'), v: B('4조 3교대, 2026년 상반기 가동일 181일, 생산설비 평균가동률 100%', 'Four teams on three shifts; 181 operating days in H1 2026; average utilisation 100 %'), src: [R] },
      { k: B('신용등급', 'Credit ratings'), v: B('국내 AA+(한국기업평가·한국신용평가·NICE신용평가), 해외 Moody’s A3(2026.8.3 Baa1에서 상향)·S&P BBB+·Fitch BBB+', 'Domestic AA+ (Korea Ratings, Korea Investors Service, NICE); Moody’s A3 (upgraded from Baa1 on 3 August 2026), S&P BBB+, Fitch BBB+'), src: [R] }
    ],
    /* 2) 연혁 중 큰 줄기 — 반기보고서 I.2 */
    history: [
      { d: '1949-10', t: B('국도건설 주식회사로 설립', 'Founded as Kukdo Construction Co.') },
      { d: '1983-02', t: B('현대전자산업주식회사로 상호 변경', 'Renamed Hyundai Electronics Industries') },
      { d: '1996-12', t: B('유가증권시장 상장(12.26)', 'Listed on the KOSPI market (26 December)') },
      { d: '2001-03', t: B('주식회사 하이닉스반도체로 상호 변경', 'Renamed Hynix Semiconductor') },
      { d: '2007', t: B('CIS 사업부문 출범(시스템 LSI 재진출)', 'CIS business launched (re-entry into system LSI)') },
      { d: '2012-03', t: B('에스케이하이닉스 주식회사로 상호 변경', 'Renamed SK hynix') },
      { d: '2021-11', t: B('최대주주가 SK텔레콤에서 SK스퀘어로 변경(인적분할)', 'Largest shareholder changed from SK Telecom to SK Square (spin-off)') },
      { d: '2021-12', t: B('인텔 NAND 사업부문(옵테인 제외) 1단계 인수 완료', 'First stage of the Intel NAND business acquisition (excluding Optane) completed') },
      { d: '2022-08', t: B('키파운드리 지분 100% 인수 완료', 'Acquisition of 100 % of Key Foundry completed') },
      { d: '2025-03', t: B('인텔 NAND 사업부문 인수 최종 완료(3.28), CIS 사업부문을 AI 메모리 분야로 전환', 'Intel NAND acquisition finally closed (28 March); CIS unit converted to AI memory') }
    ],
    /* 3) 실적 — 반기보고서 III.1·II.7(연결, 백만원 → 조·억원) */
    results: {
      unit: B('연결 기준 — 연간과 2025년 2분기·2026년 1·2분기는 반기보고서(백만원), 나머지 분기는 실적 보도자료(억원)', 'Consolidated — years and Q2 2025, Q1–Q2 2026 from the half-year report (KRW million); other quarters from results releases (KRW 100 million)'),
      years: [
        { p: B('2024년(제77기)', 'FY2024'), rev: 66192960, op: 23467319, ni: 19796902 },
        { p: B('2025년(제78기)', 'FY2025'), rev: 97146675, op: 47206319, ni: 42947902 },
        { p: B('2026년 상반기(제79기 반기)', 'H1 2026'), rev: 131895033, op: 98152891, ni: 134268502 }
      ],
      /* #34: 10개 분기 — 실적 보도자료의 억원 값은 ×100 해 백만원으로(표시는 조·억) */
      quarters: [
        { p: B('2024년 1분기', 'Q1 2024'), rev: 12429600, op: 2886000, ni: 1917000 },
        { p: B('2024년 2분기', 'Q2 2024'), rev: 16423300, op: 5468500, ni: 4120000 },
        { p: B('2024년 3분기', 'Q3 2024'), rev: 17573100, op: 7030000, ni: 5753400 },
        { p: B('2024년 4분기', 'Q4 2024'), rev: 19767000, op: 8082800, ni: 8006500 },
        { p: B('2025년 1분기', 'Q1 2025'), rev: 17639100, op: 7440500, ni: 8108200 },
        { p: B('2025년 2분기', 'Q2 2025'), rev: 22231952, op: 9212851, ni: 6996216 },
        { p: B('2025년 3분기', 'Q3 2025'), rev: 24448900, op: 11383400, ni: 12597500 },
        { p: B('2025년 4분기', 'Q4 2025'), rev: 32826700, op: 19169600, ni: 15246000 },
        { p: B('2026년 1분기', 'Q1 2026'), rev: 52576287, op: 37610283, ni: 40345909 },
        { p: B('2026년 2분기', 'Q2 2026'), rev: 79318746, op: 60542608, ni: 93922593 }
      ],
      notes: [
        B('HBM 비중: 2024년 3분기 D램 매출의 30%, 4분기 40% 이상(실적 보도자료). 2025년 3분기 분기 영업이익이 처음 10조 원, 2026년 1분기 분기 매출이 처음 50조 원을 넘었다', 'HBM share: 30 % of DRAM revenue in Q3 2024 and over 40 % in Q4 (results releases). Quarterly operating profit first passed KRW 10 trillion in Q3 2025, and quarterly revenue first passed 50 trillion in Q1 2026'),
        B('2026년 2분기 매출은 전 분기 대비 51%, 전년 동기 대비 257% 늘어 역대 최대, 영업이익률 76%로 영업이익·영업이익률 모두 분기 최대(회사 설명)', 'Q2 2026 revenue rose 51 % quarter on quarter and 257 % year on year to a record; operating margin was 76 %, a record for both operating profit and margin (company’s statement)'),
        B('2026년 2분기 DRAM은 HBM3E와 AI향 서버 DRAM 중심으로 출하량 소폭 증가·평균판매가격(ASP) 30% 중반 상승, NAND는 출하량 10% 중반 증가·ASP 50% 중반 상승(전 분기 대비)', 'Q2 2026: DRAM shipments up slightly, led by HBM3E and AI server DRAM, with ASP up in the mid-30s %; NAND shipments up in the mid-teens % and ASP up in the mid-50s % (quarter on quarter)'),
        B('2026년 상반기 당기순이익(134조 2,685억원)이 영업이익(98조 1,529억원)보다 큰 까닭: 금융수익 82조 9,152억원(금융상품평가이익 63조 1,790억·배당금수익 13조 9,796억·외환차이 5조 805억·이자수익 4,933억)에서 금융비용 6조 6,644억원을 뺀 순금융수익이 76조 2,508억원이어서 법인세차감전순이익이 174조 3,252억원이 됨(연결 주석 24 금융수익 및 금융비용)', 'Why H1 2026 net income (KRW 134.27 trillion) exceeds operating profit (KRW 98.15 trillion): finance income of KRW 82.92 trillion (gains on financial instruments 63.18, dividends 13.98, FX 5.08, interest 0.49) less finance costs of KRW 6.66 trillion left net finance income of KRW 76.25 trillion, so profit before tax reached KRW 174.33 trillion (consolidated note 24, finance income and costs)'),
        B('2026년 상반기 말 자산총계 348조 8,622억원, 유형자산 장부가액 88조 8,891억원, 상반기 유형자산 취득(설비 투자) 17조 5,950억원', 'Total assets KRW 348.86 trillion at end-H1 2026; property, plant and equipment KRW 88.89 trillion; H1 capital spending (PP&E acquired) KRW 17.60 trillion')
      ],
      src: [R, 'nrRes24q1', 'nrRes24q2', 'nrRes24q3', 'nrRes24', 'nrRes25q1', 'nrRes25q2', 'nrRes25q3', 'nrRes25', 'nrRes26q1', 'nr0729']
    },
    /* 4) 연구개발 — 반기보고서 II.6 */
    rnd: {
      cost: [
        { p: B('2024년', 'FY2024'), v: 4954447, r: '7.5%' }, { p: B('2025년', 'FY2025'), v: 6732527, r: '6.9%' }, { p: B('2026년 상반기', 'H1 2026'), v: 6042871, r: '4.6%' }
      ],
      done: [
        B('데이터센터용 PCIe Gen5 SSD — 미주 CSP(클라우드 서비스 사업자)향, DLC(직접 액체 냉각) 적용 — 개발 완료', 'Data-centre PCIe Gen5 SSD for a US cloud service provider, with direct liquid cooling (DLC) — development completed'),
        B('321단 NAND를 적용한 PC용 PCIe Gen5 SSD 개발 완료', 'Client PCIe Gen5 SSD with 321-layer NAND — development completed'),
        B('1cnm(10나노급 6세대) 16Gb LPDDR6 — LPDDR6 세계 첫 제품, 최대 10.7Gbps, LPDDR5X 대비 대역폭 33% 향상·전력 20% 절감(2027년 플래그십 모바일 대응)', '1c-nm (sixth-generation 10-nm class) 16 Gb LPDDR6 — the world’s first LPDDR6, up to 10.7 Gbps, 33 % more bandwidth and 20 % less power than LPDDR5X (for 2027 flagship phones)'),
        B('1cnm 16Gb DDR5 2nd — 속도 범위를 8,000 → 9,200Mbps로 넓혀 서버 RDIMM·MRDIMM과 PC용 모듈에 대응', '1c-nm 16 Gb DDR5 second version — speed range raised from 8,000 to 9,200 Mbps for server RDIMM and MRDIMM and client modules'),
        B('세계 최초 321단 QLC NAND 개발 — 보고서 표현으로 ‘고객 인증을 거치는 등’. 고용량 QLC 기업용 SSD는 Solidigm과의 통합 시너지로 대응', 'World’s first 321-layer QLC NAND developed — in the report’s words, “going through customer qualification”; high-capacity QLC enterprise SSDs are pursued through integration with Solidigm'),
        B('AIN(AI-NAND) Family — AIN P(높은 IOPS의 고성능 설루션, 개발 중)·AIN B(낸드를 고도로 적층해 대역폭을 키운 HBF, High Bandwidth Flash)', 'AIN (AI-NAND) family — AIN P (high-IOPS performance solution, in development) and AIN B (HBF, High Bandwidth Flash, with heavily stacked NAND for bandwidth)')
      ],
      src: [R]
    },
    /* 5) 원재료와 공급 — 반기보고서 II.3 */
    materials: {
      items: [
        { t: B('웨이퍼(Wafer)', 'Wafers'), d: B('단결정 실리콘 기둥(Ingot)을 얇게 잘라 만든 원판 — 300mm 웨이퍼 완제품을 일본·한국·독일·미국에 생산시설을 둔 주요 공급사에서 받음. 상반기 원재료·저장품 매입의 9%', 'Discs sliced from single-crystal silicon ingots — finished 300 mm wafers come from major suppliers with plants in Japan, Korea, Germany and the US; 9 % of H1 purchases') },
        { t: B('Substrate(패키지 기판)', 'Substrates'), d: B('칩을 받치고 전기 신호를 연결하며 습기·충격에서 보호하는 패키지 골격 — 한국·일본·중국에 생산시설을 둔 9개사(전 세계 50여 개 공급사 중)에서 받음, 제품별 맞춤 설계. 매입의 3%', 'The package skeleton that supports the chip, connects signals and protects it from moisture and shock — from nine suppliers with plants in Korea, Japan and China (of 50-plus worldwide), custom-designed per product; 3 % of purchases') },
        { t: B('PCB(인쇄회로기판)', 'PCBs'), d: B('모듈 부품을 고정·연결하는 기판 — 한국·중화권 6개사, 동남아로 생산지 다변화 진행. 매입의 1%', 'Boards that hold and connect module components — six suppliers in Korea and Greater China, with production diversifying to Southeast Asia; 1 % of purchases') },
        { t: B('그 밖의 원재료·저장품', 'Other materials and stores'), d: B('가스·화학약품·소자류 등 기타 원재료 51%, 저장품(예비 부품·부재료) 36%', 'Gases, chemicals, components and other materials 51 %; stores (spare parts and sub-materials) 36 %') }
      ],
      total: B('2026년 상반기 원재료·저장품 매입 10조 9,696억원(원문 10,969,605백만원)', 'H1 2026 purchases of materials and stores: KRW 10.97 trillion (KRW 10,969,605 million)'),
      src: [R]
    },
    /* 6) 시장과 점유율 — 회사 보고서가 인용한 시장 조사 */
    market: {
      size2025: [
        { k: B('세계 반도체', 'Semiconductors'), v: 8090, s: '' }, { k: B('메모리', 'Memory'), v: 2201, s: B('반도체의 약 27%', 'about 27 % of all chips') },
        { k: 'DRAM', v: 1469, s: B('메모리의 67%', '67 % of memory') }, { k: B('NAND 플래시', 'NAND flash'), v: 681, s: B('메모리의 31%', '31 % of memory') }, { k: B('기타 메모리', 'Other memory'), v: 50, s: B('2%', '2 %') }
      ],
      growth: [
        { y: '2022', all: '+1.1%', mem: '-13.7%', dram: B('787억 달러(-15.4%)', 'US$78.7 bn (-15.4 %)'), nand: B('579억 달러(-12.4%)', 'US$57.9 bn (-12.4 %)') },
        { y: '2023', all: '-11.7%', mem: '-35.8%', dram: B('499억 달러(-36.5%)', 'US$49.9 bn (-36.5 %)'), nand: B('371억 달러(-35.9%)', 'US$37.1 bn (-35.9 %)') },
        { y: '2024', all: '+21.0%', mem: '+73.4%', dram: B('916억 달러(+82.7%)', 'US$91.6 bn (+82.7 %)'), nand: B('634억 달러(+71.0%)', 'US$63.4 bn (+71.0 %)') },
        { y: '2025', all: '+23.0%', mem: '+37.8%', dram: B('1,469억 달러(+60.0%)', 'US$146.9 bn (+60.0 %)'), nand: B('681억 달러(+7.0%)', 'US$68.1 bn (+7.0 %)') }
      ],
      share: [
        { p: '2023', dram: '29.9%', nand: '19.6%' }, { p: '2024', dram: '33.4%', nand: '21.4%' }, { p: '2025', dram: '34.8%', nand: '20.9%' }, { p: B('2026년 1분기', 'Q1 2026'), dram: '29.1%', nand: '18.5%' }
      ],
      export: B('한국 반도체 수출 2025년 1,734억 달러 — 총수출 7,093억 달러의 24.4%(2024년 1,419억 달러·20.8%)', 'Korea’s chip exports in 2025: US$173.4 bn — 24.4 % of total exports of US$709.3 bn (2024: US$141.9 bn, 20.8 %)'),
      cite: B('시장 규모·성장률은 회사 보고서가 인용한 Gartner(2026.06), 점유율은 IDC(DRAM 2026.05·NAND 2026.06, 매출액 기준), 수출은 한국무역협회(2026.07) 자료 — 포털은 원 조사 보고서를 직접 보지 못함', 'Market size and growth are Gartner (June 2026) figures and shares are IDC (DRAM May 2026, NAND June 2026, by revenue), as cited in the company’s report; exports are from the Korea International Trade Association (July 2026). The portal has not seen the original research reports'),
      compete: B('회사가 꼽은 핵심 경쟁력: ① 기술·원가 경쟁력 ② 시장 대응 능력(고객 확보, 제품 포트폴리오) ③ 설비투자 능력 — 최근에는 미세화 난도가 높아져 원가 중심에서 제품 가치(응용 복합 제품, DRAM TSV 기술 등) 중심으로 바뀜', 'Key competitive factors the company names: (1) technology and cost, (2) market response (customers, product portfolio), (3) capacity to invest — with harder scaling, competition is shifting from cost to product value (combined solutions, DRAM TSV technology and more)'),
      src: [R]
    },
    /* 7) 제도·환경 — 반기보고서 II.7 마·바 */
    rules: [
      B('반도체 기술을 해외로 이전할 때 — 산업기술보호법 제11조의 국가핵심기술이나 국가첨단전략산업법 제12조의 전략기술이면 산업통상자원부 승인 또는 신고 대상(보고서 표기 그대로)', 'Transferring chip technology abroad — technology designated as national core technology (Industrial Technology Protection Act Art. 11) or strategic technology (National High-tech Strategic Industries Act Art. 12) needs approval from or notification to the industry ministry (as written in the report)'),
      B('안전보건·환경 인증: ISO 45001, ISO 14001, KOSHA-MS 유지', 'Certifications held: ISO 45001, ISO 14001, KOSHA-MS'),
      B('국내 사업장 온실가스 배출량 2025년 5,006,399 tCO₂e, 에너지 사용량 98,070 TJ(정부 신고 기준)', 'Korean sites: 5,006,399 tCO₂e of greenhouse gases and 98,070 TJ of energy in 2025 (as reported to the government)'),
      B('RE100 — 2020년 선언, 2050년 재생에너지 100%, 중간 목표 2030년 33%', 'RE100 — declared in 2020: 100 % renewable electricity by 2050, 33 % by 2030'),
      B('화학물질 입고 관리 시스템 SHE CHEMs — MSDS 등 서류를 안전·보건·환경 전문가가 모두 검토한 물질만 사내 사용', 'SHE CHEMs chemical intake system — a chemical may be used on site only after safety, health and environment experts have reviewed its MSDS and other documents')
    ],
    /* 8) 제품 — 공식 제품 사이트 분류 화면(2026-10-11) */
    products: [
      { id: 'hbm', g: 'DRAM', t: B('HBM(고대역폭 메모리)', 'HBM (High Bandwidth Memory)'),
        d: B('DRAM 칩을 실리콘 관통 전극(TSV)으로 수직 적층한 고대역폭 메모리 — AI·딥러닝 가속기용', 'DRAM dies stacked vertically with through-silicon vias (TSV) for very high bandwidth — for AI and deep-learning accelerators'),
        rows: [['HBM4', '24–48GB', B('11.0Gbps 이상(2.8TB/s 이상)', '11.0 Gbps and above (2.8 TB/s and above)'), '8·12·16Hi'], ['HBM3E', '24–36GB', B('9.6Gbps 이상(1.23TB/s 이상)', '9.6 Gbps and above (1.23 TB/s and above)'), '8·12Hi'], ['HBM3', '16–24GB', B('~6.4Gbps(~819GB/s)', 'up to 6.4 Gbps (up to 819 GB/s)'), '8·12Hi'], ['HBM2E', '8–16GB', B('3.2–3.6Gbps(410–460GB/s)', '3.2–3.6 Gbps (410–460 GB/s)'), '4·8Hi']],
        head: B(['제품', '용량', '속도(대역폭)', '적층'], ['Product', 'Density', 'Speed (bandwidth)', 'Stack']), note: B('패키지 형태는 모두 KGSD(Known Good Stacked Die — 검증된 적층 다이). ‘Hi’는 쌓은 DRAM 칩 수', 'All are supplied as KGSD (known good stacked die); “Hi” is the number of stacked DRAM dies') },
      { id: 'ddr', g: 'DRAM', t: B('DDR(PC·서버용 표준 DRAM)', 'DDR (standard DRAM for PCs and servers)'),
        d: B('컴퓨팅 시스템의 주기억장치용', 'Main memory for computing systems'),
        rows: [['DDR5', '16·24Gb', B('4,800–6,400Mbps 이상', '4,800–6,400 Mbps and above')], ['DDR4', B('8·16Gb(SDP), 16·32Gb(DDP)', '8, 16 Gb (SDP); 16, 32 Gb (DDP)'), '2,666–3,200Mbps'], ['DDR3', '4Gb', '800–2,133Mbps']],
        head: B(['제품', '칩 용량', '속도'], ['Product', 'Die density', 'Speed']) },
      { id: 'lpddr', g: 'DRAM', t: B('LPDDR(저전력 DRAM)', 'LPDDR (low-power DRAM)'),
        d: B('스마트폰 등 모바일·저전력 기기용', 'For phones and other low-power devices'),
        rows: [['LPDDR5T/5X', B('채널당 12·16Gb', '12, 16 Gb per channel'), '8,533–9,600Mbps'], ['LPDDR5', B('채널당 8–32Gb', '8–32 Gb per channel'), '6,400Mbps'], ['LPDDR4X/4', B('2채널 4·12·16·24Gb', '4, 12, 16, 24 Gb (2 channels)'), '3,200–4,266Mbps']],
        head: B(['제품', '용량', '속도'], ['Product', 'Density', 'Speed']), note: B('패키지: PoP·MCP·단품(Discrete)', 'Packages: PoP, MCP, discrete') },
      { id: 'gddr', g: 'DRAM', t: B('GDDR(그래픽 DRAM)', 'GDDR (graphics DRAM)'),
        d: B('그래픽 카드·게임기와 AI용 GPU', 'Graphics cards, consoles and AI GPUs'),
        rows: [['GDDR7', '16Gb', B('최대 32Gbps', 'up to 32 Gbps')], ['GDDR6', '8–16Gb', B('최대 20Gbps', 'up to 20 Gbps')]],
        head: B(['제품', '용량', '속도'], ['Product', 'Density', 'Speed']) },
      { id: 'module', g: 'DRAM', t: B('메모리 모듈', 'Memory modules'),
        d: B('DRAM 칩을 기판에 묶은 장착형 제품', 'DRAM chips mounted on a board for installation'),
        rows: [['MRDIMM', 'DDR5 32–128GB', B('최대 8,800Mbps — 두 랭크를 동시에 움직여 대역폭을 키운 서버용', 'up to 8,800 Mbps — server module running two ranks at once for more bandwidth')], ['RDIMM', B('DDR5 16–256GB, DDR4 16–256GB', 'DDR5 16–256 GB; DDR4 16–256 GB'), B('레지스터(RCD)로 명령·주소 신호를 중계하는 서버용', 'server module with a register clock driver for command/address signals')], ['LRDIMM', 'DDR4 128–256GB', B('데이터 버퍼로 부하를 줄인 서버용', 'server module with data buffers to cut load')], ['SOCAMM2', 'LPDDR5X 32–256GB', B('AI 데이터센터용 저전력·소형 서버 모듈', 'low-power, small server module for AI data centres')], ['LPCAMM2', 'LPDDR5X 16–64GB', B('최대 8,533Mbps — AI PC 노트북용 저전력 모듈', 'up to 8,533 Mbps — low-power module for AI-PC laptops')], ['UDIMM·SODIMM', B('DDR5 8–48GB, DDR4 4–32GB', 'DDR5 8–48 GB; DDR4 4–32 GB'), B('PC용(SODIMM은 소형)', 'for PCs (SODIMM is the small outline)')]],
        head: B(['제품', '세대·용량', '특징'], ['Product', 'Generation and density', 'Feature']) },
      { id: 'cmm', g: 'CXL', t: B('CXL 메모리(CMM)', 'CXL memory (CMM)'),
        d: B('CXL(Compute Express Link)은 PCIe 기반의 표준 인터페이스로, 서버에 정해진 용량·성능을 넘어 메모리를 유연하게 늘릴 수 있게 함', 'CXL (Compute Express Link) is a standard interface built on PCIe that lets servers add memory beyond the capacity and performance fixed by the platform'),
        rows: [['CMM-DDR5', '96GB', B('24Gb DDR5(1anm 공정) 칩, EDSFF E3.S 폼팩터, PCIe 5.0 x8 — 첫 샘플 2022년 4분기', '24 Gb DDR5 dies on the 1a-nm process, EDSFF E3.S form factor, PCIe 5.0 x8 — first samples Q4 2022')]],
        head: B(['제품', '용량', '특징'], ['Product', 'Capacity', 'Feature']) },
      { id: 'essd', g: 'SSD', t: B('기업용 SSD(eSSD)', 'Enterprise SSD'),
        d: B('서버·데이터센터 저장장치', 'Server and data-centre storage'),
        rows: [['PEB000', 'E1.S', 'PCIe Gen5 x4', B('1.92–7.68TB(읽기 위주)', '1.92–7.68 TB (read-intensive)')], ['PS1000', 'E3.S·U.2·U.3', 'PCIe Gen5 x4 · Gen4 x4', B('1.92–15.36TB(읽기 위주), 1.6–12.8TB(혼합)', '1.92–15.36 TB (read-intensive), 1.6–12.8 TB (mixed use)')], ['PE9000', 'E1.S·M.2', 'PCIe Gen4 x4', B('1.92–7.86TB(읽기 위주)', '1.92–7.86 TB (read-intensive)')], ['PE8000', 'U.2·U.3·E1.L·E1.S·M.2', 'PCIe Gen4·Gen3 x4', B('0.96–15.36TB(읽기 위주), 0.8–6.4TB(혼합)', '0.96–15.36 TB (read-intensive), 0.8–6.4 TB (mixed use)')], ['PE6000', 'U.2·M.2', 'PCIe Gen3 x4', B('0.96–7.68TB(읽기 위주), 0.8–6.4TB(혼합)', '0.96–7.68 TB (read-intensive), 0.8–6.4 TB (mixed use)')], ['SE5000', '2.5"', 'SATA 6.0Gbps', '0.48–3.84TB']],
        head: B(['제품', '폼팩터', '인터페이스', '용량'], ['Product', 'Form factor', 'Interface', 'Capacity']), note: B('DWPD(하루 전체 용량 기록 횟수) 1–3 — 원문 표기', 'DWPD (drive writes per day) 1–3, as listed') },
      { id: 'cssd', g: 'SSD', t: B('PC용 SSD(cSSD)', 'Client SSD'),
        d: B('노트북·데스크톱 저장장치', 'Laptop and desktop storage'),
        rows: [['PCB01', 'M.2 2280', 'PCIe Gen5 x4', '512GB–2TB'], ['PVC10', 'M.2 2230/42/80', 'PCIe Gen4 x4', '256GB–1TB'], ['PC801 · BC901', 'M.2 2280 · 2230/42/80', 'PCIe Gen4 x4', '256GB–2TB'], ['PC711 · BC711', 'M.2 2280 · 2230/42/80', 'PCIe Gen3 x4', '128GB–1TB'], ['SC401', '2.5" · M.2 2280', 'SATA 6.0Gbps', '256GB–1TB']],
        head: B(['제품', '폼팩터', '인터페이스', '용량'], ['Product', 'Form factor', 'Interface', 'Capacity']) },
      { id: 'ufs', g: 'NAND', t: B('UFS·eMMC(모바일 저장장치)', 'UFS and eMMC (mobile storage)'),
        d: B('NAND와 컨트롤러를 한 패키지에 넣은 내장형 저장장치', 'Embedded storage combining NAND and a controller in one package'),
        rows: [['UE400', 'UFS 4.0', '256GB–1TB', B('V7 4D NAND — UFS 3.1보다 2배 빠름(원문)', 'V7 4D NAND — twice as fast as UFS 3.1 (as stated)')], ['UD310/220', 'UFS 3.1 / 2.2', '64GB–1TB', B('모바일·소비자 기기', 'mobile and consumer')], ['UD310A/210A', 'UFS 3.1 / 2.1', '64–512GB', B('자동차용, 7세대(176단) 4D NAND', 'automotive, 7th-generation (176-layer) 4D NAND')], ['eMMC 5.1', 'eMMC 5.1', '8–64GB', B('최대 인터페이스 400MB/s, 장기 공급', 'interface up to 400 MB/s, long supply')]],
        head: B(['제품', '규격', '용량', '특징'], ['Product', 'Standard', 'Density', 'Feature']) },
      { id: 'mcp', g: 'MCP', t: B('MCP(멀티칩 패키지)', 'MCP (multi-chip packages)'),
        d: B('NAND 저장장치와 LPDDR DRAM을 한 패키지에 쌓은 모바일용 제품', 'NAND storage and LPDDR DRAM stacked in one package for phones'),
        rows: [['uMCP', 'UFS3.1 + LPDDR5', B('128–512GB + 6–12GB, 6,400Mbps', '128–512 GB + 6–12 GB, 6,400 Mbps')], ['uMCP', 'UFS2.2 + LPDDR4X', B('64–256GB + 3–12GB, 4,266Mbps', '64–256 GB + 3–12 GB, 4,266 Mbps')], ['eMCP', 'eMMC5.1 + LPDDR4X', B('16–128GB + 2–6GB, 3,733–4,266Mbps', '16–128 GB + 2–6 GB, 3,733–4,266 Mbps')]],
        head: B(['제품', '구성', '용량·속도'], ['Product', 'Combination', 'Density and speed']) }
    ],
    productsAsof: '2026-10-11',
    /* 9) 확장 계획 — ROADMAP 13단계 */
    plan: [
      { no: '#32 ✔', t: B('공정·메모리·HBM 기술·반도체 용어 탭 공개 — 웨이퍼부터 전공정 단위 공정 9개, 웨이퍼·패키지 테스트와 신뢰성 시험, 패키지 종류·공정·재료, D램·낸드 구조와 4D 낸드, HBM(TSV·KGSD·MR-MUF·2.5D·하이브리드 본딩·iHBM)과 연표, 용어 64개', 'Processes, memory and HBM technology and chip terms published — wafer and nine front-end unit processes; wafer and package test and reliability; package types, flows and materials; DRAM and NAND structure and 4D NAND; HBM (TSV, KGSD, MR-MUF, 2.5D, hybrid bonding, iHBM) with a timeline; 64 terms') },
      { no: '#33 ✔', t: B('장비·소재 탭 공개 — 공정별 장비 지도 13줄(ASML·TEL·Lam·KLA·Applied Materials·Axcelis·Advantest·DISCO 공식 자료), ASML 노광 사양과 SK하이닉스 EUV·High NA 도입, 소재 국산화(네온·EUV 감광액·디보란·크립톤)와 설비 자산, 순이익>영업이익 까닭(금융수익) 확인', 'Equipment & materials published — 13-row tool map (official material from ASML, TEL, Lam, KLA, Applied Materials, Axcelis, Advantest, DISCO), ASML scanner specs and SK hynix EUV and High-NA adoption, materials localisation (neon, EUV resist, diborane, krypton) and equipment assets; why net income exceeded operating profit (finance income) confirmed') },
      { no: '#34 ✔', t: B('거점·투자 탭 공개 — 이천·청주·용인·서남권·중국 3곳·미국 인디애나 거점별 연혁, 종속기업 영업활동, 투자 공시 9건(총 1,100조 원 중장기 계획 포함), 회사가 공시한 안전·환경 행정 조치 13건. 분기 실적을 10개 분기로, 청주 가스룸 사례를 회사 공시로 보강', 'Sites & investment published — histories for Icheon, Cheongju, Yongin, the southwest, three China sites and Indiana; subsidiaries by activity; nine investment filings (including the KRW 1,100 trillion long-term plan); 13 safety and environmental actions the company disclosed. Results extended to ten quarters; the Cheongju gas-room case strengthened from the company filing') },
      { no: '#35 ✔', t: B('세계 시장 탭 공개 — WSTS 연간 시장(2015~2025)과 2026·2027 전망, 삼성전자 DS·마이크론·TSMC·엔비디아·ASML·Applied Materials·램리서치·도쿄일렉트론·KLA의 최근 회계연도 실적(연차보고서), 장비 회사 매출 중 한국 비중, 한국 반도체특별법·투자세액공제, 미국 CHIPS Act, EU 반도체법(법령 원문)', 'World market published — WSTS yearly market (2015–2025) and 2026–27 forecasts; latest fiscal-year results of Samsung DS, Micron, TSMC, NVIDIA, ASML, Applied Materials, Lam, Tokyo Electron and KLA (annual reports); Korea’s share of toolmakers’ revenue; Korea’s Semiconductor Special Act and investment tax credit, the US CHIPS Act and the EU Chips Act (statute texts)') },
      { no: '#36', t: B('반도체 현장 × AI — SK하이닉스가 공개한 AI 활용(제조·수율·안전), AI 메모리(HBM)와 AI 가속기의 관계를 회사 발표·연차보고서로. 일본·대만 반도체 정책 원문 확인', 'Semiconductor sites × AI — AI uses SK hynix has disclosed (manufacturing, yield, safety) and how AI memory (HBM) ties to AI accelerators, from company releases and annual reports; check Japanese and Taiwanese chip policies in the original') }
    ]
  };

  /* 8) 생산 거점·투자·행정 조치 — #34(K4). 반기보고서(공시)와 뉴스룸 보도자료·FACT 원문만. 계획은 발표 시점의 계획으로 적는다 */
  SHE.SKH_BASE = {
    asof: '2026-10-17',
    running: B('반기보고서(연결 주석 1): 이천·청주와 중국 우시·충칭·다롄에서 생산공장을 가동한다. 미국 인디애나는 건설 중', 'Half-year report (consolidated note 1): production plants operate in Icheon and Cheongju and in Wuxi, Chongqing and Dalian in China; Indiana in the US is under construction'),
    sites: [
      { id: 'icheon', t: B('이천 (본사)', 'Icheon (HQ)'), role: B('본사·R&D와 첨단 공정의 중심, D램 팹', 'Headquarters, centre of R&D and leading-edge processes; DRAM fabs'), items: [
        { d: '2014~', t: B('2014년부터 46조 원을 들여 국내에 새 팹 3곳(이천 M14, 청주 M15, 이천 M16)을 짓는 ‘미래비전’ — 2015년 M14 건설로 시작', 'The “Future Vision”: KRW 46 trillion from 2014 for three new domestic fabs (Icheon M14, Cheongju M15, Icheon M16), starting with M14 in 2015'), src: ['nrM15xPlan', 'nrM15x'] },
        { d: '2021-02', t: B('M16 준공 — 3.5조 원·25개월, D램 주력, 회사 최대 생산시설, 회사 최초 EUV', 'M16 completed — KRW 3.5 trillion over 25 months, mainly DRAM, the company’s largest fab, its first EUV'), src: ['nrm16'] },
        { d: '2025-09', t: B('M16에 메모리 업계 최초 양산용 High NA EUV(EXE:5200B) 반입', 'First production High-NA EUV in the memory industry (EXE:5200B) moved into M16'), src: ['nrHighNa'] },
        { d: '2026-06', t: B('회사 설명: 이천은 앞으로도 R&D와 첨단 공정을 이끄는 본사이자 중심 거점', 'Company statement: Icheon remains the HQ and core site leading R&D and leading-edge processes'), src: ['nrFact05'] }
      ] },
      { id: 'cheongju', t: B('청주', 'Cheongju'), role: B('낸드(M11·M12·M15), D램·HBM(M15X), 어드밴스드 패키징(P&T7), 낸드 신규(M17)', 'NAND (M11, M12, M15), DRAM and HBM (M15X), advanced packaging (P&T7), new NAND (M17)'), items: [
        { d: '2018-10', t: B('M15 준공 — 낸드플래시 팹', 'M15 completed — NAND flash fab'), src: ['nrm15'] },
        { d: '2022-09', t: B('M15X 건설 계획 — 청주 테크노폴리스 약 6만㎡, 복층(M11·M12를 합한 규모), 5년간 15조 원(공정공시)', 'M15X plan — about 60,000 m² in Cheongju Technopolis, two storeys (the size of M11 and M12 combined), KRW 15 trillion over five years (fair-disclosure filing)'), src: ['nrM15xPlan', 'skhH1_2026'] },
        { d: '2024-04', t: B('M15X를 D램 생산기지로 결정 — 건설비 약 5.3조 원, 장기적으로 20조 원 이상. TSV 캐파를 늘리는 M15와 인접해 HBM 생산에 유리', 'M15X chosen as a DRAM base — about KRW 5.3 trillion to build, over 20 trillion in the long run; next to M15, where TSV capacity is growing, which suits HBM'), src: ['nrM15x'] },
        { d: '2025-10', t: B('M15X 클린룸 오픈 — 이후 장비 순차 셋업', 'M15X cleanroom opened — tools then set up in stages'), src: ['nrFact02'] },
        { d: '2026-04', t: B('P&T7 착수 — HBM 등 어드밴스드 패키징 전용, 테크노폴리스 7만 평, 약 19조 원, 2027년 말 완공 목표', 'P&T7 started — dedicated to advanced packaging such as HBM; 70,000 pyeong in Technopolis; about KRW 19 trillion; completion targeted for end-2027'), src: ['nrFact02', 'skhH1_2026'] },
        { d: '2026-08', t: B('M17 결정 — 낸드 팹, 연면적 20.6만 평, 19.1조 원, 2027.2 착공·2028.12 첫 클린룸(투자 2031.4까지)', 'M17 approved — NAND fab, 206,000 pyeong of floor area, KRW 19.1 trillion; construction February 2027, first cleanroom December 2028 (spending to April 2031)'), src: ['nrY2M17'] }
      ] },
      { id: 'yongin', t: B('용인 클러스터 (건설 중)', 'Yongin cluster (under construction)'), role: B('HBM 등 차세대 D램 생산 거점, 팹 4기', 'Next-generation DRAM including HBM; four fabs'), items: [
        { d: '', t: B('용인시 처인구 원삼면 415만㎡(약 126만 평) — SK하이닉스 팹 약 60만 평, 소부장 협력화단지 14만 평, 인프라 12만 평', '4.15 million m² (about 1.26 million pyeong) in Wonsam-myeon, Cheoin-gu — about 600,000 pyeong for SK hynix fabs, 140,000 for suppliers, 120,000 for infrastructure'), src: ['nrYongin'] },
        { d: '2025-02', t: B('1기 팹(Y1) 착공(2.21 건축 허가)', 'Fab 1 (Y1) construction began (building permit 21 February)'), src: ['nrYongin'] },
        { d: '2026-02', t: B('Y1 신규시설투자 약 21.6조 원 추가(2030.12까지) — 2024.7의 약 9.4조 원을 합쳐 약 31조 원, 골조 2개·클린룸 6개, 첫 클린룸 2027.5 → 2027.2로 앞당김', 'A further KRW 21.6 trillion for Y1 (to December 2030) — about 31 trillion with the 9.4 trillion of July 2024; two shells and six cleanrooms; first cleanroom brought forward from May to February 2027'), src: ['nrFact04', 'skhH1_2026'] },
        { d: '2026-06', t: B('2033년까지 4번째 팹 건설 완료 목표(당초 2045년), 클러스터에 총 600조 원(설비·장비는 수요에 맞춰 단계 투자)', 'Target: fourth fab built by 2033 (originally 2045); KRW 600 trillion for the cluster in all (equipment added in stages with demand)'), src: ['nrFact05', 'skhH1_2026'] },
        { d: '2026-08', t: B('Y2 결정 — D램, 연면적 34.1만 평, 35.2조 원, 2027.7 착공·2029.6 첫 클린룸(투자 2031.10까지). 1단계 전력·용수 인프라 공정률 99%', 'Y2 approved — DRAM, 341,000 pyeong, KRW 35.2 trillion; construction July 2027, first cleanroom June 2029 (spending to October 2031). Phase-1 power and water 99 % complete'), src: ['nrY2M17'] }
      ] },
      { id: 'sw', t: B('서남권 클러스터 (계획)', 'Southwest cluster (planned)'), role: B('메모리 전공정 중심의 새 생산 거점', 'A new production base centred on memory front-end'), items: [
        { d: '2026-06', t: B('400조 원을 단계 투자해 새 클러스터 조성 계획 — 부지·인프라(전력·용수)가 핵심 기준, 세부 입지는 관계 기관과 협의해 확정 예정', 'Plan to build a new cluster with KRW 400 trillion in stages — land and infrastructure (power, water) are the key criteria; the exact site will be fixed with the authorities'), src: ['nrFact05', 'nrFact06', 'skhH1_2026'] }
      ] },
      { id: 'wuxi', t: B('중국 우시', 'Wuxi, China'), role: B('반도체 제조 법인 SK hynix Semiconductor (China) Ltd.', 'Manufacturing subsidiary SK hynix Semiconductor (China) Ltd.'), items: [
        { d: '2004', t: B('우시에 처음 진출', 'First entered Wuxi'), src: ['nrDalian'] },
        { d: '2025-10', t: B('우시시 생태환경국 과태료 26.4만 위안 — 폐수처리장 스크러버 물순환 펌프 불량으로 오염물 배출 → 스크러버 개선·예비 스크러버 추가', 'Wuxi environment bureau fine of RMB 264,000 — pollutants released when a wastewater-plant scrubber’s water pump failed → scrubber upgrades and a standby scrubber'), src: ['skhH1_2026'] }
      ] },
      { id: 'dalian', t: B('중국 다롄', 'Dalian, China'), role: B('반도체 제조 법인 SK hynix Semiconductor (Dalian) — 인텔 낸드 팹', 'Manufacturing subsidiary SK hynix Semiconductor (Dalian) — the former Intel NAND fab'), items: [
        { d: '2021-01', t: B('다롄시와 MOU — 인텔 낸드 팹 이전 지원·지역 신규 투자', 'MOU with Dalian — support for the Intel NAND fab transfer and new local investment'), src: ['nrDalian'] },
        { d: '2021-12', t: B('인텔 낸드 사업 1단계 인수 — 다롄 팹 인수(2025.3 최종 완료)', 'First stage of the Intel NAND acquisition — Dalian fab acquired (final completion March 2025)'), src: ['skhH1_2026'] }
      ] },
      { id: 'chongqing', t: B('중국 충칭', 'Chongqing, China'), role: B('후공정(패키지·테스트) 법인 SK hynix Semiconductor (Chongqing)', 'Back-end (package and test) subsidiary SK hynix Semiconductor (Chongqing)'), items: [
        { d: '2014-09', t: B('후공정 생산법인 준공 — 2013.7 착공, 2014.7 양산, 대지 28만㎡, 2억 5천만 달러, 당시 모바일용 낸드', 'Back-end subsidiary completed — construction July 2013, volume production July 2014; 280,000 m² site; US$250 million; mobile NAND at the time'), src: ['nrChongqing'] }
      ] },
      { id: 'indiana', t: B('미국 인디애나 웨스트라피엣 (건설 중)', 'West Lafayette, Indiana, US (under construction)'), role: B('HBM 어드밴스드 패키징·테스트 — SK hynix Semiconductor West Lafayette LLC(2024.8 설립)', 'HBM advanced packaging and test — SK hynix Semiconductor West Lafayette LLC (set up August 2024)'), items: [
        { d: '2024-04', t: B('인디애나주와 투자협약 — 38억 7천만 달러(약 5.2조 원), 퍼듀대와 R&D 협력', 'Investment agreement with Indiana — US$3.87 billion (about KRW 5.2 trillion); R&D with Purdue'), src: ['nrIndiana24'] },
        { d: '2026-08', t: B('기공식 — 40억 달러 이상, 2028.10 클린룸 완공·2029년 하반기 차세대 HBM 양산. 한국에서 만든 웨이퍼를 들여와 패키징·테스트해 미국 고객에게 공급', 'Groundbreaking — over US$4 billion; cleanroom October 2028, next-generation HBM in volume from H2 2029; wafers made in Korea are packaged and tested there for US customers'), src: ['nrIndiana26'] },
        { d: '2026-06', t: B('미국 상무부 DFA 이행·대출 상환을 위한 지급보증 1,028백만 달러(반기보고서)', 'Guarantee of US$1,028 million for the US Commerce Department DFA and loan repayment (half-year report)'), src: ['skhH1_2026'] }
      ] }
    ],
    /* 반기보고서 연결 종속기업 표의 ‘주요 영업활동’ 그대로 */
    subs: [
      { k: B('반도체 제조', 'Semiconductor manufacturing'), v: 'SK hynix Semiconductor (China) · SK hynix Semiconductor (Dalian) · SK hynix Semiconductor (Chongqing) · SK hynix Semiconductor West Lafayette · 에스케이파워텍(SK keyfoundry 자회사)', en: 'SK hynix Semiconductor (China), (Dalian), (Chongqing), SK hynix Semiconductor West Lafayette, SK Powertech (a SK keyfoundry subsidiary)' },
      { k: B('반도체 판매·생산', 'Semiconductor sales and production'), v: '에스케이키파운드리', en: 'SK keyfoundry' },
      { k: B('반도체 연구개발', 'Semiconductor R&D'), v: 'SK hynix memory solutions Taiwan · Poland · America, 에스케이하이닉스시스템아이씨(연구개발 및 서비스), Solidigm 계열 연구개발 법인(캐나다·멕시코·폴란드·상하이·미국 등)', en: 'SK hynix memory solutions Taiwan, Poland and America; SK hynix system ic (R&D and services); Solidigm-group R&D entities (Canada, Mexico, Poland, Shanghai, US and others)' },
      { k: B('반도체 판매', 'Semiconductor sales'), v: '미국·독일·싱가포르·홍콩·영국·대만·일본·인도·중국(우시) 판매 법인과 Solidigm 계열 판매 법인', en: 'Sales subsidiaries in the US, Germany, Singapore, Hong Kong, the UK, Taiwan, Japan, India and China (Wuxi), plus Solidigm-group sales entities' }
    ],
    subsNote: B('회사 개요의 ‘생산기지 4곳·연구개발법인 3곳’이 이 표의 어느 법인인지는 보고서가 이름으로 짚지 않아, 표의 영업활동 그대로 묶어 보여 줍니다(2026.6.30, 연결 종속기업 57곳).', 'The report does not say by name which entities are the “four production bases and three R&D subsidiaries” in its overview, so they are grouped here by the activity the table gives (30 June 2026; 57 consolidated subsidiaries).'),
    /* 투자 공시·발표 — 공정공시·신규시설투자·이사회 */
    invest: [
      { d: '2022-09-06', t: B('청주 M15X 건설 — 5년간 약 15조 원', 'Cheongju M15X — about KRW 15 trillion over five years'), src: ['skhH1_2026', 'nrM15xPlan'] },
      { d: '2024-04-04', t: B('미국 인디애나 어드밴스드 패키징 — 38억 7천만 달러', 'Indiana advanced packaging — US$3.87 billion'), src: ['nrIndiana24'] },
      { d: '2024-04-24', t: B('M15X를 D램 생산기지로 — 건설비 약 5.3조 원, 장기 20조 원 이상', 'M15X as a DRAM base — about KRW 5.3 trillion to build, over 20 trillion in the long run'), src: ['nrM15x', 'skhH1_2026'] },
      { d: '2024-07-26', t: B('용인 1기 팹 건설 — 약 9.4조 원(신규시설투자)', 'Yongin Fab 1 — about KRW 9.4 trillion (new facility investment)'), src: ['skhH1_2026', 'nrFact04'] },
      { d: '2026-02-25', t: B('용인 1기 팹 Phase 2~6 — 약 21.6조 원 추가, 1기 팹 합계 약 31조 원', 'Yongin Fab 1 phases 2–6 — about KRW 21.6 trillion more, about 31 trillion for Fab 1'), src: ['skhH1_2026', 'nrFact04'] },
      { d: '2026-04-22', t: B('청주 P&T7 — 약 19조 원(공정공시)', 'Cheongju P&T7 — about KRW 19 trillion (fair-disclosure filing)'), src: ['skhH1_2026', 'nrFact02'] },
      { d: '2026-06-29', t: B('중장기 투자 전략 — 용인 600조·청주 100조·서남권 400조, 총 1,100조 원(공정공시)', 'Mid- to long-term strategy — Yongin 600, Cheongju 100, southwest 400: KRW 1,100 trillion (fair-disclosure filing)'), src: ['skhH1_2026', 'nrFact05'] },
      { d: '2026-08-07', t: B('용인 Y2 35.2조 원·청주 M17 19.1조 원 — 54조 원(이사회)', 'Yongin Y2 KRW 35.2 trillion and Cheongju M17 19.1 trillion — 54 trillion (board)'), src: ['nrY2M17'] },
      { d: '2026-08-27', t: B('인디애나 기공식 — 40억 달러 이상', 'Indiana groundbreaking — over US$4 billion'), src: ['nrIndiana26'] }
    ],
    investNotes: [
      { t: B('클린룸 1만 평 기준 투자비는 2019년 용인 클러스터 발표 때 약 7.5조 원이었고, 2025년 10월 오픈한 청주 M15X는 약 20조 원 수준이다.', 'Investment per 10,000 pyeong of cleanroom was about KRW 7.5 trillion when the Yongin cluster was announced in 2019, and about 20 trillion for Cheongju M15X, opened in October 2025.'), src: ['nrFact01'] },
      { t: B('용인 투자비가 120조 원(2019)에서 600조 원으로 커진 까닭: 용적률이 법적 상한의 1.4배까지 완화돼 클린룸이 넓어졌고, 건설비가 1.4배 올랐으며, 장비 대수와 미세화에 따른 장비 비용이 늘었다(장비 비용은 별도).', 'Why Yongin grew from KRW 120 trillion (2019) to 600 trillion: the floor-area ratio was eased to 1.4× the legal cap, enlarging cleanrooms; construction costs rose 1.4×; and more, costlier tools are needed as processes shrink (tools counted separately).'), src: ['nrFact01', 'nrFact04'] },
      { t: B('HBM은 TSV를 넣느라 다이가 커져 웨이퍼 한 장에서 나오는 칩 수가 적다 — 같은 용량에 일반 D램보다 웨이퍼가 더 필요하고, 회사는 같은 생산량에 캐파가 최소 2배 이상 든다고 설명한다.', 'HBM dies are larger because of TSVs, so fewer come from each wafer — the same capacity needs more wafers than standard DRAM, and the company says it takes at least twice the capacity for the same output.'), src: ['nrFact05', 'nrM15x'] },
      { t: B('투자 원칙: 한 번에 집행하지 않고 수요 가시성에 맞춰 단계적으로, 재원은 영업이익의 현금흐름을 바탕으로 시점에 맞춰 조달(CapEx Discipline).', 'Principle: not spent at once but in stages as demand becomes visible, funded mainly from operating cash flow as needed (CapEx discipline).'), src: ['nrFact05'] }
    ],
    /* 행정 제재·조치 — 반기보고서 XI.3(회사 공시, 2024~2026.6) */
    sanctions: [
      { d: '2024-10-21', org: B('금강유역환경청', 'Geum River Basin Env. Office'), act: B('경고·과태료 480만 원', 'Warning, KRW 4.8 m fine'), why: B('청주 특별점검(2024.9.13)에서 화학물질관리법 위반', 'Chemical Substances Control Act breaches found at Cheongju (13 Sep 2024)'), fix: B('유해화학물질 취급 도급신고 대상 확대·신고 이행', 'More subcontracted hazardous-chemical jobs reported')},
      { d: '2024-12-24', org: B('고용노동부', 'MOEL'), act: B('과태료 480만 원', 'KRW 4.8 m fine'), why: B('M10 초순수(UPW) 시설 PSM 점검 — 공정안전보고서 미이행, 염산 탱크 MSDS 미부착', 'PSM inspection of the M10 ultrapure-water plant — PSM report not implemented, no MSDS on the HCl tank'), fix: B('시설 개선·다른 시설로 수평전개', 'Fixed and applied across other facilities') },
      { d: '2025-08-25', org: B('한강유역환경청', 'Han River Basin Env. Office'), act: B('과태료(160만 원 납부)', 'Fine (KRW 1.6 m paid)'), why: B('배출구 TMS 설치 기간 자가측정 미이행', 'Self-monitoring skipped while a stack TMS was installed'), fix: B('자가측정 검증 체계', 'Self-monitoring verification') },
      { d: '2025-10-09', org: B('우시시 생태환경국', 'Wuxi Ecology & Environment Bureau'), act: B('과태료 26.4만 위안', 'RMB 264,000 fine'), why: B('폐수처리장 스크러버 펌프 불량으로 오염물 배출', 'Pollutants released when a scrubber pump failed'), fix: B('스크러버 개선·예비 스크러버 추가', 'Scrubber upgrades, standby unit') },
      { d: '2025-11-28', org: B('경기도(이천소방서)', 'Gyeonggi (Icheon Fire Station)'), act: B('과태료(80만 원 납부)', 'Fine (KRW 0.8 m paid)'), why: B('소방계획서·업무수행기록표 작성 미흡', 'Fire-safety plan and duty records incomplete'), fix: B('특정소방대상물 120곳별 문서 작성', 'Documents written for each of 120 fire-protected buildings') },
      { d: '2026-03-17', org: B('충북권 중대산업사고예방센터', 'Chungbuk Major Accident Prevention Center'), act: B('과태료(728만 원 납부)', 'Fine (KRW 7.28 m paid)'), why: B('사고사례 교육·신입 대상 PSM/MSDS 교육 일부 누락', 'Some accident-case and new-starter PSM/MSDS training missed'), fix: B('인사 변동 데이터로 법정교육 누락 관리', 'Statutory training tracked against staff changes') },
      { d: '2026-05-15', org: B('경기도(이천소방서)', 'Gyeonggi (Icheon Fire Station)'), act: B('과태료(80만 원 납부)', 'Fine (KRW 0.8 m paid)'), why: B('방화문 파손 등 피난·방화시설 관리 미흡', 'Damaged fire doors and other escape/fire-separation lapses'), fix: B('방화문 점검 주기 확대, 자동폐쇄장치 변경·개방 경보 검토', 'More frequent fire-door checks; new closers and open-door alarms considered') },
      { d: '2026', org: B('경기도(이천소방서)', 'Gyeonggi (Icheon Fire Station)'), act: B('과태료(400만 원 납부)', 'Fine (KRW 4 m paid)'), why: B('불시점검 — 위험물 지정수량 배수 변경 미실시', 'Spot check — change in hazardous-material quantity multiple not notified'), fix: B('위험물 취급수량 관리 표준화·전산화', 'Hazmat quantities standardised and computerised') },
      { d: '2026-06-04', org: B('금강유역환경청', 'Geum River Basin Env. Office'), act: B('사고 설비 가동중지·수시검사 명령, 6.18 개선명령', 'Shut-down and inspection order; improvement order on 18 Jun'), why: B('6.1 M15 6층 가스룸 불소배관 패시베이션 작업 중 화재·미량 불소 누출(인명·환경 피해 없음)', 'Fire and trace F₂ release during F₂-line passivation, M15 6F gas room, 1 Jun (no injuries or environmental harm)'), fix: B('가동중지 이행, 사고 설비 철거·신규 배관, 패시베이션 작업 방법 개선', 'Shut down; damaged equipment to be removed and new piping; passivation method improved') },
      { d: '2026-06-12', org: B('대전지방고용노동청', 'Daejeon Regional Labour Office'), act: B('작업중지 권고(산안법 제51조)', 'Work-stop recommendation (OSH Act Art. 51)'), why: B('청주사업장 2026년 사고 5건', 'Five accidents at Cheongju in 2026'), fix: B('F2 패시베이션 작업 중지 유지(재발방지대책 승인 때까지), 10개 분야 재발방지대책 제출', 'F₂ passivation kept stopped until prevention measures are approved; measures in ten areas submitted') },
      { d: '2026-06-17', org: B('금강유역환경청', 'Geum River Basin Env. Office'), act: B('사고 설비 가동중지·수시검사 명령, 6.30 개선명령', 'Shut-down and inspection order; improvement order on 30 Jun'), why: B('6.12 M15X 2층 가스룸 같은 작업 중 화재·미량 불소 누출(1명 다리 1도 화상)', 'Fire and trace F₂ release in the same job, M15X 2F gas room, 12 Jun (one first-degree leg burn)'), fix: B('가동중지 이행, 사고 설비 철거·신규 배관, 패시베이션 작업 방법 개선', 'Shut down; equipment to be removed and new piping; passivation method improved') },
      { d: '2026-06-18', org: B('한강유역환경청', 'Han River Basin Env. Office'), act: B('경고', 'Warning'), why: B('도급인 의무 위반 — 협력사의 질산 취급 작업 중 부분 보호복을 입은 작업자 무릎에 질산 노출', 'Principal’s duty breached — nitric acid reached a contractor worker’s knee through partial protective clothing'), fix: B('사고대비물질 취급 작업 보호복 기준 재수립', 'PPE rules for accident-prone substances reset') },
      { d: '2026-06-29', org: B('금강유역환경청', 'Geum River Basin Env. Office'), act: B('수시검사 명령', 'Inspection order'), why: B('정부 특별점검에서 청주 3캠퍼스 폐수처리장 약품 탱크·펌프 주변 누출 흔적', 'Leak traces around chemical tanks and pumps at the Campus 3 wastewater plant found in a special inspection'), fix: B('7.6 수시검사 완료, 주 1회 자체점검', 'Inspection done on 6 Jul; weekly self-checks') }
    ],
    sanctionsNote: B('회사가 반기보고서 ‘제재 등과 관련된 사항’에 적은 행정 조치입니다(수사·사법기관 제재와 한국거래소 제재는 해당 없음). 같은 기간 고용노동부 감독 결과(위반 119건 등)는 사고 사례와 사업장 화면에 따로 있습니다.', 'Administrative actions the company lists under “sanctions” in its half-year report (none from investigative or judicial bodies or the exchange). The MOEL inspection results for the same period (119 violations and more) are in the incident case and site pages.'),
    src: ['skhH1_2026']
  };
})();

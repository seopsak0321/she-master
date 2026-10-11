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
      unit: B('연결 기준, 원문 단위 백만원', 'Consolidated; original unit KRW million'),
      years: [
        { p: B('2024년(제77기)', 'FY2024'), rev: 66192960, op: 23467319, ni: 19796902 },
        { p: B('2025년(제78기)', 'FY2025'), rev: 97146675, op: 47206319, ni: 42947902 },
        { p: B('2026년 상반기(제79기 반기)', 'H1 2026'), rev: 131895033, op: 98152891, ni: 134268502 }
      ],
      quarters: [
        { p: B('2025년 2분기', 'Q2 2025'), rev: 22231952, op: 9212851, ni: 6996216 },
        { p: B('2026년 1분기', 'Q1 2026'), rev: 52576287, op: 37610283, ni: 40345909 },
        { p: B('2026년 2분기', 'Q2 2026'), rev: 79318746, op: 60542608, ni: 93922593 }
      ],
      notes: [
        B('2026년 2분기 매출은 전 분기 대비 51%, 전년 동기 대비 257% 늘어 역대 최대, 영업이익률 76%로 영업이익·영업이익률 모두 분기 최대(회사 설명)', 'Q2 2026 revenue rose 51 % quarter on quarter and 257 % year on year to a record; operating margin was 76 %, a record for both operating profit and margin (company’s statement)'),
        B('2026년 2분기 DRAM은 HBM3E와 AI향 서버 DRAM 중심으로 출하량 소폭 증가·평균판매가격(ASP) 30% 중반 상승, NAND는 출하량 10% 중반 증가·ASP 50% 중반 상승(전 분기 대비)', 'Q2 2026: DRAM shipments up slightly, led by HBM3E and AI server DRAM, with ASP up in the mid-30s %; NAND shipments up in the mid-teens % and ASP up in the mid-50s % (quarter on quarter)'),
        B('2026년 상반기 말 자산총계 348조 8,622억원, 유형자산 장부가액 88조 8,891억원, 상반기 유형자산 취득(설비 투자) 17조 5,950억원', 'Total assets KRW 348.86 trillion at end-H1 2026; property, plant and equipment KRW 88.89 trillion; H1 capital spending (PP&E acquired) KRW 17.60 trillion')
      ],
      src: [R]
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
      { no: '#33', t: B('장비·소재·공급망 — 공정 카드마다 장비 종류와 장비 회사 공식 제품 화면(노광 ASML, 증착·식각·세정·CMP·계측·테스트·패키지 장비), 웨이퍼·특수가스·케미컬·감광액, 정기보고서의 원재료·설비 투자. 이번에 칼럼 수치라서 뺀 노광기 처리량 등은 장비 회사 원문으로만', 'Equipment, materials and supply chain — tool types per process card with toolmakers’ official product pages (ASML lithography; deposition, etch, clean, CMP, metrology, test and packaging tools); wafers, specialty gases, chemicals and photoresist; raw materials and capex in the regular report. Figures left out this time because they came only from columns (such as scanner throughput) will be taken only from toolmakers’ originals') },
      { no: '#34', t: B('생산 거점·투자·로드맵 — 이천·청주·중국·용인·미국 인디애나, 분기 실적 추이', 'Sites, investment and roadmap — Icheon, Cheongju, China, Yongin, Indiana; quarterly results') },
      { no: '#35', t: B('세계 반도체 시장 — WSTS 전망, 삼성전자·마이크론·TSMC·엔비디아·ASML 등 기업 비교, 각국 정책', 'Global market — WSTS forecasts; Samsung, Micron, TSMC, NVIDIA, ASML and others compared; national policies') },
      { no: '#36', t: B('반도체 현장 × AI — SK하이닉스가 공개한 AI 활용, AI 메모리 수요', 'Semiconductor sites × AI — AI uses SK hynix has disclosed; AI memory demand') }
    ]
  };
})();

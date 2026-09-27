/* 환경(E) 법정 의무 — 국가법령정보센터 원문(본문·별표 PDF)으로 확인 (2026-09-26). 부처 명칭은 2025.10.1부터 기후에너지환경부.
   - 통합환경관리: 환경오염시설의 통합관리에 관한 법률 제6·9·10·12·20·21·21조의2·33조, 시행령 별표1, 시행규칙 제4·25조의2·35조·별표14의2 (src: envIp, envIpDecree, envIpRule)
   - 특정대기유해물질: 대기환경보전법 시행규칙 별표2, 시행령 제11조 (src: envAirRule, envAirDecree)
   - 특정수질유해물질: 물환경보전법 시행규칙 별표3, 시행령 제31조 (src: envWaterRule, envWaterDecree)
   - 지정폐기물: 폐기물관리법 시행령 별표1, 시행규칙 제14조·별표5 (src: envWasteDecree, envWasteRule)
   물질 연결(ids)은 원문 항목 이름과 물질 DB가 분명히 일치하는 것만 둔다. */
window.SHE = window.SHE || {};
(function () {
  const B = (ko, en) => ({ ko, en });

  SHE.ENV_IP = {
    /* 시행령 별표1 중 반도체·전자부품 업종 (항목 번호, 표준산업분류 코드, 적용 시기) */
    sectors: [
      { no: 20, code: '261', t: B('반도체 제조업', 'Semiconductor manufacturing'), from: '2021-01-01' },
      { no: 15, code: '262', t: B('전자부품 제조업 중 표시장치, 인쇄회로기판용 적층판, 경성·연성 및 기타 인쇄회로기판, 전자축전기, 전자감지장치, 그 외 기타 전자부품', 'Electronic components — displays, PCB laminates, rigid, flexible and other PCBs, capacitors, sensors, other components'), from: '2020-01-01' }
    ],
    air: 20,      /* 법 제6조①1 — 먼지·질소산화물·황산화물(시행규칙 제4조①) 연간 발생량, 톤 */
    water: 700,   /* 법 제6조①2 — 폐수 1일 배출량, ㎥ */
    mgrAir: 80,   /* 시행규칙 별표14의2 1호 — 대기오염물질 발생량 합계, 톤/년 */
    mgrWater: 2000 /* 같은 호 — 폐수 1일 배출량, ㎥ */
  };

  /* 대기환경보전법 시행규칙 별표2 — 특정대기유해물질 35종 (번호 = 원문 번호) */
  SHE.ENV_AIR = [
    [1, B('카드뮴 및 그 화합물', 'Cadmium and its compounds')], [2, B('시안화수소', 'Hydrogen cyanide'), ['hcn']], [3, B('납 및 그 화합물', 'Lead and its compounds')],
    [4, B('폴리염화비페닐', 'Polychlorinated biphenyls')], [5, B('크롬 및 그 화합물', 'Chromium and its compounds')], [6, B('비소 및 그 화합물', 'Arsenic and its compounds'), ['as', 'ash3']],
    [7, B('수은 및 그 화합물', 'Mercury and its compounds'), ['hg']], [8, B('프로필렌 옥사이드', 'Propylene oxide')], [9, B('염소 및 염화수소', 'Chlorine and hydrogen chloride'), ['cl2', 'hcl']],
    [10, B('불소화물', 'Fluorides'), ['hf', 'nh4f']], [11, B('석면', 'Asbestos')], [12, B('니켈 및 그 화합물', 'Nickel and its compounds')],
    [13, B('염화비닐', 'Vinyl chloride')], [14, B('다이옥신', 'Dioxins')], [15, B('페놀 및 그 화합물', 'Phenol and its compounds')],
    [16, B('베릴륨 및 그 화합물', 'Beryllium and its compounds')], [17, B('벤젠', 'Benzene')], [18, B('사염화탄소', 'Carbon tetrachloride')],
    [19, B('이황화메틸', 'Dimethyl disulfide')], [20, B('아닐린', 'Aniline')], [21, B('클로로포름', 'Chloroform')],
    [22, B('포름알데히드', 'Formaldehyde')], [23, B('아세트알데히드', 'Acetaldehyde')], [24, B('벤지딘', 'Benzidine')],
    [25, B('1,3-부타디엔', '1,3-Butadiene')], [26, B('다환 방향족 탄화수소류', 'Polycyclic aromatic hydrocarbons')], [27, B('에틸렌옥사이드', 'Ethylene oxide')],
    [28, B('디클로로메탄', 'Dichloromethane')], [29, B('스틸렌', 'Styrene')], [30, B('테트라클로로에틸렌', 'Tetrachloroethylene')],
    [31, B('1,2-디클로로에탄', '1,2-Dichloroethane')], [32, B('에틸벤젠', 'Ethylbenzene')], [33, B('트리클로로에틸렌', 'Trichloroethylene')],
    [34, B('아크릴로니트릴', 'Acrylonitrile')], [35, B('히드라진', 'Hydrazine')]
  ].map(([no, t, ids]) => ({ no, t, ids: ids || [] }));

  /* 물환경보전법 시행규칙 별표3 — 특정수질유해물질 (11호는 2016.5.20 삭제) */
  SHE.ENV_WATER = [
    [1, B('구리와 그 화합물', 'Copper and its compounds'), ['cu']], [2, B('납과 그 화합물', 'Lead and its compounds')], [3, B('비소와 그 화합물', 'Arsenic and its compounds'), ['as', 'ash3']],
    [4, B('수은과 그 화합물', 'Mercury and its compounds'), ['hg']], [5, B('시안화합물', 'Cyanide compounds'), ['hcn']], [6, B('유기인 화합물', 'Organophosphorus compounds')],
    [7, B('6가크롬 화합물', 'Hexavalent chromium compounds')], [8, B('카드뮴과 그 화합물', 'Cadmium and its compounds')], [9, B('테트라클로로에틸렌', 'Tetrachloroethylene')],
    [10, B('트리클로로에틸렌', 'Trichloroethylene')], [12, B('폴리클로리네이티드바이페닐', 'Polychlorinated biphenyls')], [13, B('셀레늄과 그 화합물', 'Selenium and its compounds'), ['h2se']],
    [14, B('벤젠', 'Benzene')], [15, B('사염화탄소', 'Carbon tetrachloride')], [16, B('디클로로메탄', 'Dichloromethane')],
    [17, B('1,1-디클로로에틸렌', '1,1-Dichloroethylene')], [18, B('1,2-디클로로에탄', '1,2-Dichloroethane')], [19, B('클로로포름', 'Chloroform')],
    [20, B('1,4-다이옥산', '1,4-Dioxane')], [21, B('디에틸헥실프탈레이트(DEHP)', 'Di(2-ethylhexyl) phthalate (DEHP)')], [22, B('염화비닐', 'Vinyl chloride')],
    [23, B('아크릴로니트릴', 'Acrylonitrile')], [24, B('브로모포름', 'Bromoform')], [25, B('아크릴아미드', 'Acrylamide')],
    [26, B('나프탈렌', 'Naphthalene')], [27, B('폼알데하이드', 'Formaldehyde')], [28, B('에피클로로하이드린', 'Epichlorohydrin')],
    [29, B('페놀', 'Phenol')], [30, B('펜타클로로페놀', 'Pentachlorophenol')], [31, B('스티렌', 'Styrene')],
    [32, B('비스(2-에틸헥실)아디페이트', 'Bis(2-ethylhexyl) adipate')], [33, B('안티몬', 'Antimony'), ['sb']]
  ].map(([no, t, ids]) => ({ no, t, ids: ids || [] }));

  /* 물질 DB id → 해당 항목 번호 (substance chips) */
  SHE.ENV_OF = (id) => ({ air: SHE.ENV_AIR.filter((x) => x.ids.includes(id)).map((x) => x.no), water: SHE.ENV_WATER.filter((x) => x.ids.includes(id)).map((x) => x.no) });

  /* 폐기물관리법 시행령 별표1 중 반도체 사업장에서 나올 수 있는 지정폐기물과, 시행규칙 별표5 보관 기간(45일 또는 60일) */
  SHE.ENV_WASTE = [
    { id: 'acid', t: B('폐산', 'Waste acid'), grp: B('2. 부식성 폐기물', '2. Corrosive waste'), def: B('액체 상태로서 수소이온 농도지수(pH) 2.0 이하', 'Liquid with a pH of 2.0 or less'), days: 45, ex: ['hf', 'hcl', 'h2so4', 'hno3', 'h3po4'] },
    { id: 'alk', t: B('폐알칼리', 'Waste alkali'), grp: B('2. 부식성 폐기물', '2. Corrosive waste'), def: B('액체 상태로서 pH 12.5 이상 — 수산화칼륨·수산화나트륨 포함', 'Liquid with a pH of 12.5 or more — includes potassium and sodium hydroxide'), days: 45, ex: ['naoh', 'koh'] },
    { id: 'solv-hal', t: B('폐유기용제 — 할로겐족', 'Waste organic solvent — halogenated'), grp: B('4. 폐유기용제', '4. Waste organic solvents'), def: B('기후에너지환경부령으로 정하는 할로겐족 물질 또는 그 함유 물질', 'Halogenated substances set by ministerial ordinance, or material containing them'), days: 45 },
    { id: 'solv', t: B('폐유기용제 — 그 밖의 것', 'Waste organic solvent — other'), grp: B('4. 폐유기용제', '4. Waste organic solvents'), def: B('할로겐족 외의 유기용제', 'Organic solvents other than halogenated ones'), days: 45, ex: ['ipa', 'acetone', 'pgme'] },
    { id: 'oil', t: B('폐유', 'Waste oil'), grp: B('6. 폐유', '6. Waste oil'), def: B('기름 성분 5% 이상 함유한 것 포함 (PCB 함유 폐기물·폐식용유·폐흡착제·폐흡수제 제외)', 'Includes material with 5 % or more oil (excluding PCB waste, used cooking oil, spent adsorbents and absorbents)'), days: 45 },
    { id: 'sorb', t: B('폐흡착제·폐흡수제', 'Spent adsorbents and absorbents'), grp: B('3. 유해물질함유 폐기물', '3. Waste containing hazardous substances'), def: B('기후에너지환경부령으로 정하는 물질을 함유한 것', 'Containing substances set by ministerial ordinance'), days: 45 },
    { id: 'cat', t: B('폐촉매', 'Spent catalysts'), grp: B('3. 유해물질함유 폐기물', '3. Waste containing hazardous substances'), def: B('기후에너지환경부령으로 정하는 물질을 함유한 것', 'Containing substances set by ministerial ordinance'), days: 45 },
    { id: 'dust', t: B('분진', 'Dust'), grp: B('3. 유해물질함유 폐기물', '3. Waste containing hazardous substances'), def: B('대기오염 방지시설에서 포집된 것(소각시설 제외)으로 부령이 정하는 물질을 함유한 것', 'Collected in air-pollution control equipment (not incinerators) and containing substances set by ordinance'), days: 60 },
    { id: 'toxic', t: B('폐유독물질', 'Waste toxic chemicals'), grp: B('9. 폐유독물질', '9. Waste toxic chemicals'), def: B('화학물질관리법의 인체급성·인체만성·생태유해성물질, 허가·제한·금지물질, 사고대비물질을 폐기하는 경우 (부식성 폐기물·폐유기용제·PCB·수은폐기물 등은 각 항목으로)', 'Discarded acute or chronic human-health, eco-toxic, permitted, restricted, prohibited or accident-preparedness substances under the Chemicals Control Act (corrosive waste, solvents, PCB and mercury waste go under their own items)'), days: 60 }
  ];
  /* SK하이닉스 공개 자료 — 지속가능경영보고서 2026 (src: sr2026). 쪽수는 보고서 PDF 기준 */
  SHE.ENV_SK = {
    years: [2022, 2023, 2024, 2025],
    /* p.104 ESG Data 대기오염물질 배출량(톤) — 국내 두 사업장 */
    air: {
      icheon: { SOx: [22.6, 10.6, 22.1, 15.8], NOx: [158.2, 142.1, 156.9, 188.9], dust: [0.4, 0.0, 0.4, 0.1], HF: [3.6, 0.6, 0.1, 0.0], HCl: [7.4, 2.9, 2.4, 1.5], NH3: [11.1, 21.7, 3.6, 1.2] },
      cheongju: { SOx: [5.2, 1.4, 2.3, 8.7], NOx: [82.7, 79.2, 78.1, 95.5], dust: [24.9, 4.9, 1.6, 3.4], HF: [2.6, 0.7, 0.1, 0.0], HCl: [3.6, 4.6, 1.2, 0.1], NH3: [22.3, 8.3, 1.2, 0.1] }
    },
    airTotal: { y2020: 823, y2025: 315 },           /* p.39 국내 대기오염물질 배출량(톤), 관리 목표: 2020년 수준 대비 감소 */
    /* p.119 SASB TC-SC-150a.1 — 국내(이천·청주) 지정폐기물 */
    waste: { gen: [254961, 223038, 237402, 257585], rate: [98.1, 98.5, 98.9, 98.9] },
    zwtl: B('폐기물 매립 제로(ZWTL) 인증 — 이천·청주·우시 Platinum, 충칭 Gold (2025, p.38)', 'Zero Waste to Landfill — Icheon, Cheongju and Wuxi Platinum, Chongqing Gold (2025, p.38)'),
    gas: B('PRISM 2030 목표 ‘공정가스 배출량 40% 감축’(2020 기준) — 2025년 52% 감축, 스크러버 처리 효율 95% 유지 (p.18)', 'PRISM 2030 goal “cut process-gas emissions 40 %” (vs 2020) — 52 % cut in 2025, with 95 % scrubber efficiency (p.18)'),
    tech: B('공정가스 분해 때 생기는 질소산화물(NOx)·불화수소(HF)를 처리하는 De-NOx, 암모니아(NH₃)를 처리하는 De-NH₃ 시스템, 챔버 대신 베이 단위로 온실가스를 처리해 NOx 생성을 줄이는 베이형 PFC 스크러버 (p.39)', 'De-NOx systems for the NOx and HF formed when process gases are abated, De-NH₃ for ammonia, and bay-level PFC scrubbers that run cooler than per-chamber units and so form less NOx (p.39)')
  };
  /* 화학물질 배출저감계획서 — 화학물질관리법 제11조의2, 시행규칙 제5조의2, 화학물질안전원고시 제2025-18호(시행 2025.8.7) 본문·부칙·별표1 (src: lawCca, lawCcaRule, nicsErp)
     별표1 1·2단계 53종(원문 번호·CAS, 이름은 원문 띄어쓰기대로 — 53번은 원문의 여는 괄호 누락만 보충), 3단계 = 시행령 제6조 배출량조사 대상 중 나머지 */
  const E = (no, cas, ko, en) => ({ no, cas, t: B(ko, en) });
  SHE.ENV_ERP = {
    p1: [E(1, '71-43-2', '벤젠', 'Benzene'), E(2, '75-01-4', '염화 비닐', 'Vinyl chloride'), E(3, '79-01-6', '트리클로로에틸렌', 'Trichloroethylene'), E(4, '106-99-0', '1,3-부타디엔', '1,3-Butadiene'),
      E(5, '67-66-3', '클로로포름', 'Chloroform'), E(6, '68-12-2', 'N,N-디메틸포름아미드', 'N,N-Dimethylformamide'), E(7, '75-09-2', '디클로로메탄', 'Dichloromethane'), E(8, '107-13-1', '아크릴로니트릴', 'Acrylonitrile'),
      E(9, '127-18-4', '테트라클로로에틸렌', 'Tetrachloroethylene')],
    p2: [E(10, '50-00-0', '포름알데히드', 'Formaldehyde'), E(11, '75-21-8', '산화 에틸렌', 'Ethylene oxide'), E(12, '101-14-4', '3,3′-디클로로-4,4′-디아미노디페닐 메탄', '3,3′-Dichloro-4,4′-diaminodiphenylmethane'),
      E(13, '107-30-2', '클로로메틸 메틸 에테르', 'Chloromethyl methyl ether'), E(14, '56-23-5', '사염화 탄소', 'Carbon tetrachloride'), E(15, '62-53-3', '아닐린', 'Aniline'), E(16, '75-56-9', '산화 프로필렌', 'Propylene oxide'),
      E(17, '77-78-1', '황산 디메틸', 'Dimethyl sulfate'), E(18, '78-79-5', '이소프렌', 'Isoprene'), E(19, '78-93-3', '메틸 에틸 케톤', 'Methyl ethyl ketone'), E(20, '79-06-1', '아크릴아미드', 'Acrylamide'),
      E(21, '80-05-7', '4,4′-비스페놀 에이', '4,4′-Bisphenol A'), E(22, '84-74-2', '디부틸 프탈레이트', 'Dibutyl phthalate'), E(23, '91-20-3', '나프탈렌', 'Naphthalene'), E(24, '95-80-7', '2,4-디아미노톨루엔', '2,4-Diaminotoluene'),
      E(25, '96-23-1', '1,3-디클로로-2-프로판올', '1,3-Dichloro-2-propanol'), E(26, '98-88-4', '염화 벤조일', 'Benzoyl chloride'), E(27, '98-95-3', '니트로벤젠', 'Nitrobenzene'), E(28, '100-41-4', '에틸벤젠', 'Ethylbenzene'),
      E(29, '100-42-5', '스티렌', 'Styrene'), E(30, '100-44-7', '염화 벤질', 'Benzyl chloride'), E(31, '101-77-9', '4,4′-메틸렌디아닐린', '4,4′-Methylenedianiline'), E(32, '106-46-7', '1,4-디클로로벤젠', '1,4-Dichlorobenzene'),
      E(33, '106-89-8', '에피클로로히드린', 'Epichlorohydrin'), E(34, '107-06-2', '1,2-디클로로에탄', '1,2-Dichloroethane'), E(35, '108-05-4', '아세트산 비닐', 'Vinyl acetate'), E(36, '108-88-3', '톨루엔', 'Toluene'),
      E(37, '109-86-4', '2-메톡시에탄올', '2-Methoxyethanol'), E(38, '110-80-5', '2-에톡시에탄올', '2-Ethoxyethanol'), E(39, '111-15-9', '아세트산 2-에톡시에틸', '2-Ethoxyethyl acetate'),
      E(40, '115-96-8', '트리(2-클로로에틸) 포스페이트', 'Tri(2-chloroethyl) phosphate'), E(41, '117-81-7', '디(2-에틸헥실) 프탈레이트', 'Di(2-ethylhexyl) phthalate'), E(42, '121-14-2', '2,4-디니트로톨루엔', '2,4-Dinitrotoluene'),
      E(43, '123-91-1', '1,4-디옥산', '1,4-Dioxane'), E(44, '140-88-5', '아크릴산 에틸', 'Ethyl acrylate'), E(45, '141-78-6', '아세트산 에틸', 'Ethyl acetate'), E(46, '630-08-0', '일산화 탄소', 'Carbon monoxide'),
      E(47, '1163-19-5', '산화 데카브로모디페닐', 'Decabromodiphenyl oxide'), E(48, '1330-20-7', '자일렌(o-,m-,p- 이성질체 혼합물)', 'Xylene (o-, m-, p- isomer mixture)'), E(49, '4098-71-9', '디이소시안산 이소포론', 'Isophorone diisocyanate'),
      E(50, '7803-57-8', '히드라진 수화물', 'Hydrazine hydrate'), E(51, '8001-58-9', '크레오소트', 'Creosote'), E(52, '15096-52-3', '크리올라이트', 'Cryolite'), E(53, '26471-62-5', '디이소시안산 톨루엔(2,4-, 2,6-, 혼합 이성질체 혼합물)', 'Toluene diisocyanate (2,4-, 2,6-, mixed isomer mixture)')],
    /* 고시 부칙 제3조 — 단계별 최초 제출 기한(종업원 수 기준, 폐기물처리업자 위탁분은 같은 해 9월 30일) */
    dl2: [[200, '2026-05-31'], [100, '2027-05-31'], [50, '2028-05-31'], [30, '2029-05-31']],
    dl3: [[300, '2030-05-31'], [200, '2031-05-31'], [100, '2032-05-31'], [50, '2033-05-31'], [30, '2034-05-31']]
  };
  /* 화학물질 배출량조사 — 화학물질관리법 제11조, 시행령 제6조, 시행규칙 제5조, 「화학물질의 배출량조사 및 산정계수에 관한 규정」
     (기후에너지환경부고시 제2025-52호, 2025.12.15) 제3·5·6·8·10·12·13조, 별표1·2 (src: lawCca, lawCcaDecree, lawCcaRule, envPrtr)
     물질 연결 = 별표2 본표 CAS 일치, 또는 ‘X 및 그 화합물’ 물질군 주의 CAS 목록. 물질군은 목록에 없는 화합물도 해당(각 주 머리말)이라
     원소가 분명한 sbh3·b2h6·h2se도 연결. c-C₄F₆는 주24 과불화탄소 목록에 없어 두지 않음 */
  SHE.ENV_PRTR = {
    cut: { I: 1, II: 10 },   /* 제3조② 단서 — 물질별 연간 제조·사용량(톤)이 이 값 미만이면 제외 */
    due: '04-30',            /* 제12조① — 전년도 자료로 조사표 */
    semi: ['26111', '26112', '26121', '26129'],   /* 별표1 중 반도체 소자 (메모리·비메모리 집적회로, 발광다이오드, 기타 반도체소자) */
    grp: {
      15: B('수은 및 그 화합물', 'Mercury and its compounds'), 17: B('비소 및 그 화합물', 'Arsenic and its compounds'),
      381: B('알루미늄 및 그 화합물', 'Aluminium and its compounds'), 382: B('안티몬 및 그 화합물', 'Antimony and its compounds'),
      384: B('붕소 및 그 화합물', 'Boron and its compounds'), 385: B('코발트 및 그 화합물', 'Cobalt and its compounds'),
      386: B('구리 및 그 화합물', 'Copper and its compounds'), 388: B('셀레늄 및 그 화합물', 'Selenium and its compounds'),
      392: B('무기시안화합물', 'Inorganic cyanide compounds'), 394: B('수소화불화탄소', 'Hydrofluorocarbons'), 395: B('과불화탄소', 'Perfluorocarbons')
    },
    /* 물질 DB id → [[그룹, 별표2 번호, 조사대상범위(무게함유율 % 이상)], …] — 두 항목에 걸리면 둘 다 */
    ids: {
      as: [['I', 17, 0.1]], ash3: [['I', 17, 0.1]], hg: [['I', 15, 1]],
      hf: [['II', 274, 1]], hcl: [['II', 272, 1]], h2so4: [['II', 276, 1]], hno3: [['II', 278, 1]], h2o2: [['II', 282, 1]], naoh: [['II', 227, 1]], koh: [['II', 226, 1]],
      nh3: [['II', 275, 1]], ph3: [['II', 293, 1]], bf3: [['II', 271, 1], ['II', 384, 1]], hbr: [['II', 304, 1]], cl2: [['II', 288, 1]], sf6: [['II', 252, 1]],
      ipa: [['II', 27, 1]], co: [['II', 213, 0.1]], h2s: [['II', 289, 1]], hcn: [['II', 38, 1], ['II', 392, 1]], acoh: [['II', 24, 1]], pocl3: [['II', 300, 1]],
      pcl3: [['II', 281, 1]], xylene: [['II', 233, 1]], egeea: [['II', 146, 0.1]],
      sb: [['II', 382, 0.1]], sbh3: [['II', 382, 0.1]], b2h6: [['II', 384, 1]], bcl3: [['II', 384, 1]], b2o3: [['II', 384, 1]], cu: [['II', 386, 1]], cobalt: [['II', 385, 0.1]],
      tma: [['II', 381, 1]], h2se: [['II', 388, 1]], chf3: [['II', 394, 1]], cf4: [['II', 395, 1]], c2f6: [['II', 395, 1]], c4f8: [['II', 395, 1]]
    },
    /* 제5조② 점오염원 조사대상에서 빼는 화학물질 */
    excl: [B('시험·연구·검사용으로 제한된 장소에서 연구자만 쓰는 화학물질', 'Chemicals used only by researchers in restricted places for testing, research or inspection'),
      B('구입해 쓰는 기계·장치에 내장된 화학물질(축전지 등)', 'Chemicals built into purchased machines or devices, such as batteries'),
      B('시설 도색 페인트·건축자재처럼 시설 자체의 일부인 화학물질', 'Chemicals that are part of the facility itself, such as building paint or construction materials'),
      B('사업장에서 운행·가동하는 기기·장비의 가동과 유지에 쓰는 화학물질', 'Chemicals used to run and maintain on-site vehicles and equipment'),
      B('사무기기·약·화장품 등 종업원이 개인 용도로 쓰는 화학물질', 'Chemicals employees use personally, such as office supplies, medicine and cosmetics'),
      B('조경시설 유지용 살충제·비료', 'Pesticides and fertilisers for landscaping'),
      B('고유 형상을 유지한 고체 상태로 취급하며 녹거나 증발·용해되지 않는 중금속과 그 화합물', 'Solid heavy metals and compounds handled in their own shape without melting, evaporating or dissolving'),
      B('난방용 연료', 'Heating fuel'),
      B('화학물질등록평가법 시행령 제2조제1호의 비분리중간체', 'Non-isolated intermediates (Chemical Registration and Evaluation Decree Art. 2(1))')],
    methods: [B('직접측정', 'Direct measurement'), B('물질수지', 'Mass balance'), B('배출계수', 'Emission factors'), B('공학적 계산', 'Engineering calculation')],
    /* 화학물질종합정보시스템(ICIS) 화학물질 배출·이동량 정보공개 — 업체별 검색 2024년, kg/년 (2026-09-27 조회, src: icisPrtr) */
    sk: {
      year: 2024,
      sites: [[B('이천', 'Icheon'), 18773, 108827249], [B('이천 스마트에너지센터', 'Icheon Smart Energy Center'), 2610, 0], [B('청주 1공장', 'Cheongju Plant 1'), 85, 83540],
        [B('청주 2공장', 'Cheongju Plant 2'), 0, 98], [B('청주 3공장', 'Cheongju Plant 3'), 1561, 8519189], [B('청주 4공장', 'Cheongju Plant 4'), 5857, 26554990]],
      icheon: { air: 18773, ww: 56522211, waste: 52305038 },
      /* 이천 — 배출(모두 대기) 상위, 이동 상위 [이름, kg/년, 물질 DB id] */
      rel: [[B('과불화탄소', 'Perfluorocarbons'), 8640, ''], [B('암모니아', 'Ammonia'), 3891, 'nh3'], [B('2-프로판올', '2-Propanol'), 1685, 'ipa'],
        [B('프로필렌', 'Propylene'), 1362, ''], [B('육플루오르화황', 'Sulphur hexafluoride'), 1304, 'sf6'], [B('염소', 'Chlorine'), 968, 'cl2']],
      move: [[B('황산', 'Sulphuric acid'), 61362238, 'h2so4'], [B('2-프로판올', '2-Propanol'), 15262847, 'ipa'], [B('과산화수소', 'Hydrogen peroxide'), 14554285, 'h2o2'],
        [B('플루오르화수소', 'Hydrogen fluoride'), 4239036, 'hf'], [B('수산화나트륨', 'Sodium hydroxide'), 3729959, 'naoh']]
    }
  };
  /* 온실가스·배출권거래제 — 탄소중립기본법 제2조제5호(2026.10.8부터 NF₃ 추가)·제27조①(관리업체 목표관리, NF₃ 제외 2026.4.7)·부칙 제3조(법률 제21527호),
     배출권거래법 제2조제1호(NF₃ 제외, 2026.4.7), 제8·24·25·27·28조, 시행령 제39·44·45조, 보고·인증 지침 제29·37조 (src: cnAct, ets, etsDecree, etsMrv) */
  SHE.ENV_GHG = {
    /* 법에 이름이 적힌 온실가스 — nf3 는 2026-10-08부터 기본법 제2조제5호에 포함, 목표관리(제27조)·배출권거래법에서는 제외 */
    gases: [['CO₂', B('이산화탄소', 'Carbon dioxide')], ['CH₄', B('메탄', 'Methane')], ['N₂O', B('아산화질소', 'Nitrous oxide')], ['HFCs', B('수소불화탄소', 'Hydrofluorocarbons')], ['PFCs', B('과불화탄소', 'Perfluorocarbons')], ['SF₆', B('육불화황', 'Sulphur hexafluoride')], ['NF₃', B('삼불화질소', 'Nitrogen trifluoride')]],
    nf3From: '2026-10-08', nf3Out: '2026-04-07',
    /* 물질 DB id → 법에 적힌 분류 (이름·분자식이 분명히 일치하는 것만: PFC는 CF₄·C₂F₆·c-C₄F₈, HFC는 HFC-23) */
    ids: { co2: 'CO₂', n2o: 'N₂O', sf6: 'SF₆', cf4: 'PFCs', c2f6: 'PFCs', c4f8: 'PFCs', chf3: 'HFCs', nf3: 'NF₃' },
    /* 배출권거래법 제8조①1 — 최근 3년 연평균 */
    coTotal: 125000, siteTotal: 25000,
    /* 차입 한도 — 시행령 제45조②1 (계획기간 1차 이행연도, 제출해야 할 수량 대비 %) */
    borrow1: 15,
    /* SK하이닉스 지속가능경영보고서 2026 p.102 — Scope 1 가스별 배출량(tCO₂eq, GWP AR5, 범위 이천·청주·분당·서울·우시·충칭),
       PRISM 목표 관리용 시장 기반 Scope 1&2, p.18·20 목표·성과(만 톤, 다롄·키파운드리 미반영) */
    sk: {
      years: [2022, 2023, 2024, 2025],
      s1: [['CO₂', [197807, 1165172, 2569211, 2968321]], ['CH₄', [10150, 10434, 8908, 11412]], ['N₂O', [71954, 45438, 28198, 30345]], ['HFCs', [252547, 42789, 54642, 55440]],
        ['PFCs', [1020389, 184136, 171793, 159543]], ['SF₆', [228907, 41874, 48098, 52414]], ['NF₃', [1161003, 848248, 881732, 973051]]],
      s1Total: [2942757, 2338090, 3762584, 4250526],
      mb: [7173550, 5415283, 5502136, 5555285],
      fghg: 1376496,   /* EPEAT 기준 2025년 공정 F-온실가스 (IPCC Tier 2a·DRE 측정 방법론, AR5) */
      goal: { t2025: 567, a2025: 556, t2026: 599 }
    }
  };
  /* 보관창고 표지 — 시행규칙 별표5 9) */
  SHE.ENV_WASTE_SIGN = {
    size: B('가로 60cm 이상 × 세로 40cm 이상 (드럼 등 소형 용기에 붙이면 가로 15cm × 세로 10cm 이상)', 'At least 60 × 40 cm (at least 15 × 10 cm on drums and other small containers)'),
    color: B('노란색 바탕에 검은색 선·검은색 글자', 'Black lines and lettering on yellow'),
    items: [B('폐기물의 종류', 'Type of waste'), B('보관가능용량(톤)', 'Storage capacity (t)'), B('관리책임자', 'Person in charge'), B('보관기간', 'Storage period'), B('취급 시 주의사항 — 보관 시·운반 시·처리 시', 'Handling precautions — storing, transporting, treating'), B('운반(처리) 예정장소', 'Planned transport or treatment site')]
  };
})();

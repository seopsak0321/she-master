/* SK하이닉스 이해 — 공정(전공정·테스트·패키지), 메모리·HBM 기술, 반도체 용어 (13단계 K2, 업데이트 #32, 2026-10-11)
   출처: SK하이닉스 뉴스룸(news.skhynix.co.kr) 원문만. 보도자료·임원 인터뷰·‘Pathfinder’·후공정 연재(서민석 TL)는 회사가 낸 글이고,
   ‘반도체 전공정’ 연재(2022~2023)와 ‘반도체 특강’·‘Tech Note’는 뉴스룸에 실린 외부 전문가 칼럼이다(원문 끝에 “SK하이닉스의 공식 입장과는 다를 수 있습니다” 명시) — SKH_EXT에 모아 화면에 표시한다.
   규칙: 원문에 있는 사실만 옮긴다. 칼럼의 비용·처리량·점유 비율 같은 추정치는 넣지 않는다(장비는 #33에서 장비 회사 공식 자료로 확인).
   회사 고유 기술(MR-MUF·TSV·하이브리드 본딩 등)의 정의는 회사 보도자료·인터뷰 각주를 따른다. 단위 공정 카드의 hz는 포털 공정 유해위험 카드(SHE.PROCESSES) id. */
window.SHE = window.SHE || {};
(function () {
  const B = (ko, en) => ({ ko, en });

  /* 외부 전문가 칼럼(원문에 회사 공식 입장과 다를 수 있다고 명시) */
  SHE.SKH_EXT = ['nrFeOx', 'nrFePhoto', 'nrFeEtch', 'nrDepo', 'nrMetal', 'nrAld', 'nrImplant', 'nrClean', 'nrWafer', 'nrDramNand', 'nrHybrid'];

  SHE.SKH_PROC = {
    asof: '2026-10-11',
    /* 1) 전체 흐름 */
    flow: [
      { id: 'wafer', t: B('웨이퍼', 'Wafer'), d: B('녹인 다결정 실리콘에서 단결정 잉곳을 뽑아 자르고 연마한 기판 — 엄밀히는 반도체 공장 밖에서 만든다', 'A substrate sliced and polished from a single-crystal ingot pulled from molten polysilicon — strictly, it is made outside the chip fab'), src: ['nrWafer', 'nrFeOx'] },
      { id: 'feol', t: B('전공정 ① FEOL', 'Front end ① FEOL'), d: B('산화·포토·식각·증착·이온주입을 되풀이해 웨이퍼에 트랜지스터 같은 소자를 새긴다', 'Oxidation, lithography, etching, deposition and implantation are repeated to form transistors and other devices in the wafer'), src: ['nrFeOx', 'nrBeTest'] },
      { id: 'beol', t: B('전공정 ② BEOL', 'Front end ② BEOL'), d: B('같은 기술로 미세한 금속 배선을 만들어 수십억 개 소자를 잇는다', 'The same techniques build fine metal wiring that connects billions of devices'), src: ['nrFeOx', 'nrMetal'] },
      { id: 'wtest', t: B('웨이퍼 테스트', 'Wafer test'), d: B('프루브 카드로 칩마다 전기 검사 — EPM → 웨이퍼 번인 → 테스트 → 리페어 → 재테스트', 'Probe cards test every chip — EPM → wafer burn-in → test → repair → retest'), src: ['nrBeTest'] },
      { id: 'pkg', t: B('패키지', 'Packaging'), d: B('얇게 갈고 잘라 양품 칩만 기판에 붙이고 연결·밀봉하거나(컨벤셔널), 웨이퍼 상태로 배선·범프를 만든다(웨이퍼 레벨)', 'Thin, saw, attach only good dies, connect and encapsulate (conventional), or build wiring and bumps on the whole wafer (wafer level)'), src: ['nrBeConv', 'nrBeType1'] },
      { id: 'ptest', t: B('패키지 테스트·출하', 'Package test and shipping'), d: B('패키지 번인(TDBI) → 테스트 → 레이저 마킹 → 외관 검사 → 출하', 'Package burn-in (TDBI) → test → laser marking → visual inspection → shipping'), src: ['nrBeTest'] }
    ],
    flowNotes: [
      { t: B('흔히 말하는 ‘8대 공정’(웨이퍼 제조·산화·포토·식각·증착·금속배선·테스트·패키징)은 편의상의 분류입니다. 웨이퍼 제조는 반도체 공장 안의 일이 아니고, 금속배선·테스트·패키징은 하나의 공정이 아니라 여러 공정을 묶은 작업 범주입니다.', 'The familiar “eight major processes” (wafer making, oxidation, photo, etch, deposition, metallization, test, packaging) are a convenience. Wafer making happens outside the fab, and metallization, test and packaging are groups of work rather than single processes.'), src: ['nrFeOx'] },
      { t: B('산화·포토·식각·증착 같은 단위 공정은 FEOL·BEOL과 웨이퍼 레벨 패키지에서 되풀이해 쓰입니다. ‘금속배선 장비’가 따로 있는 게 아니라 식각·증착 장비가 배선을 만듭니다.', 'Unit processes such as oxidation, lithography, etching and deposition recur in FEOL, BEOL and wafer-level packaging. There is no separate metallization tool; etch and deposition tools build the wiring.'), src: ['nrMetal', 'nrBeWlp1'] },
      { t: B('SK하이닉스 뉴스룸은 패키지 앞의 전기 검사를 ‘웨이퍼 테스트’라고 부르고, 순서를 웨이퍼 테스트 → 패키지 → 패키지 테스트로 설명합니다.', 'The SK hynix newsroom calls the electrical check before packaging “wafer test” and gives the order as wafer test → packaging → package test.'), src: ['nrBeTest'] }
    ],
    /* 반도체 업종 — 후공정 1편 */
    biz: [
      { t: B('팹리스', 'Fabless'), d: B('설계만 한다 (예: 퀄컴, 애플)', 'Design only (e.g. Qualcomm, Apple)') },
      { t: B('파운드리', 'Foundry'), d: B('팹리스가 설계한 제품을 웨이퍼로 만든다 (예: TSMC)', 'Makes wafers from fabless designs (e.g. TSMC)') },
      { t: 'OSAT', d: B('패키지와 테스트를 맡는다 (예: ASE, JCET, 앰코)', 'Outsourced assembly and test (e.g. ASE, JCET, Amkor)') },
      { t: B('IDM (종합 반도체)', 'IDM (integrated device maker)'), d: B('설계·웨이퍼·패키지·테스트를 모두 한다 — 원문은 SK하이닉스를 대표적인 예로 든다', 'Does design, wafers, packaging and test in house — the source names SK hynix as a typical example') }
    ],
    /* 2) 단위 공정 카드 — hz: 포털 유해위험 카드 id */
    steps: [
      { id: 'wafer', t: B('웨이퍼', 'Wafer'), hz: [], src: ['nrWafer', 'nrFePhoto'],
        why: B('모든 공정의 바탕이 되는 기판입니다. 웨이퍼 품질이 반도체 성능을 좌우합니다.', 'The substrate for every step; wafer quality shapes chip performance.'),
        how: [
          B('연마 웨이퍼: 고순도 다결정 실리콘과 3가·5가 도펀트를 도가니에서 녹인 뒤, 씨앗(Seed) 결정의 방향을 따라 단결정 잉곳으로 끌어올려 만든다. 반도체 회사는 n형보다 p형 웨이퍼를 많이 쓴다.', 'Polished wafers: high-purity polysilicon and a group-III or group-V dopant are melted in a crucible and pulled into a single-crystal ingot that follows the seed crystal. Chipmakers use p-type more than n-type.'),
          B('결정 방향은 (100)을 가장 많이, 다음으로 (111)을 쓴다.', 'Crystal orientation (100) is the most common, then (111).'),
          B('종류(기본 → 고성능): 연마 웨이퍼 → 에피 웨이퍼(같은 결정 방향의 고순도 단결정층을 위에 성장) → SOI(절연 산화막 위의 실리콘 단결정층).', 'Types, basic to advanced: polished → epitaxial (a high-purity single-crystal layer grown in the same orientation) → SOI (single-crystal silicon on an insulating oxide).'),
          B('쓰임: 생산용 프라임, 라인 이상을 미리 보는 테스트, 프라임과 함께 넣어 보호하는 더미, 재생 웨이퍼.', 'By use: prime (production), test (checks the line first), dummy (loaded alongside to protect prime wafers) and reclaimed wafers.'),
          B('지름 300mm(12인치) 웨이퍼가 쓰이며, 12인치 이상은 주로 양면을 연마한다.', '300 mm (12-inch) wafers are used; at 12 inches and above both sides are usually polished.')
        ] },
      { id: 'ox', t: B('산화', 'Oxidation'), hz: ['ox'], src: ['nrFeOx'],
        why: B('실리콘 표면을 산소와 반응시켜 SiO₂ 막을 키웁니다. 보호막이자 절연막입니다.', 'Reacts the silicon surface with oxygen to grow SiO₂, a protective and insulating film.'),
        how: [
          B('쓰임: 이온주입 때 다른 물질이 들어오지 못하게 막는 차단막, 게이트와 전류 통로 사이의 게이트 산화막. 첨단 제품은 HKMG 등 대체 물질을 쓴다.', 'Uses: a barrier that keeps other substances out during implantation, and the gate oxide between gate and channel; advanced chips use substitutes such as HKMG.'),
          B('웨이퍼의 실리콘을 소모하며 자란다 — 위에 물질을 얹는 증착과 다른 점.', 'It grows by consuming the wafer’s own silicon — unlike deposition, which adds material on top.'),
          B('습식(수증기): Si + 2H₂O → SiO₂ + 2H₂. 빠르지만 균일성·밀도가 낮고 수소가 생긴다.', 'Wet (steam): Si + 2H₂O → SiO₂ + 2H₂. Fast, but less uniform and dense, and it gives off hydrogen.'),
          B('건식(고온 산소): 느리지만 부산물이 없고 치밀·균일해 게이트 산화막에 쓴다.', 'Dry (hot oxygen): slower, with no by-product, dense and uniform — used for gate oxide.'),
          B('라디칼: 산소와 수소를 고온에서 섞어 만든 라디칼로 산화한다. 품질이 가장 높고 입체 구조·모서리에도 고르며 질화규소(Si₃N₄)까지 산화한다.', 'Radical: oxidises with radicals made by mixing oxygen and hydrogen at high temperature — highest quality, even on 3-D shapes and corners, and can oxidise silicon nitride (Si₃N₄).'),
          B('장비: 기체 주입 → 가열 → 수십 장을 한꺼번에 처리(양 끝의 반응 차이를 메우는 더미 웨이퍼 포함). 확산(Diffusion) 공정의 한 분야이자 고온 공정으로 분류된다.', 'Tool: gas in → heat → dozens of wafers at once (with dummy wafers to even out the ends). Classed under diffusion and as a high-temperature process.')
        ] },
      { id: 'photo', t: B('포토 (노광)', 'Photolithography'), hz: ['photo'], src: ['nrFePhoto', 'nrBeWlp1'],
        why: B('웨이퍼 위에 회로 패턴의 ‘틀’을 그립니다. 수십 개 층마다 되풀이됩니다.', 'Draws the stencil of the circuit pattern on the wafer; repeated for each of dozens of layers.'),
        how: [
          B('순서: 감광액(포토레지스트) 도포 → 마스크 정렬 → 노광 → 노광 후 베이크(PEB) → 현상 → 린스.', 'Order: coat photoresist → align the mask → expose → post-exposure bake (PEB) → develop → rinse.'),
          B('도포: 코터(Coater)가 웨이퍼를 고속 회전시켜 고르게 바른 뒤 뒷면·가장자리의 감광액을 지우고 오븐에서 용매를 날린다. 아래에 반사 방지막(BARC), ArF 액침용으로 위에 방수 코팅을 더하기도 한다.', 'Coating: a coater spins the wafer to spread resist evenly, strips it from the back and edge, then bakes off solvent. An anti-reflective coat (BARC) may go underneath and a water-repellent top coat for ArF immersion.'),
          B('포지티브 감광액은 빛 받은 곳이 현상 때 녹아 미세 패턴에 주로 쓰고, 네거티브는 반대로 값싸고 식각에 강하지만 부풀어 미세 패턴에 불리하다.', 'Positive resist dissolves where exposed and is used for fine patterns; negative resist is the reverse — cheaper and etch-resistant, but it swells, so it suits fine patterns less.'),
          B('마스크(포토마스크)가 곧 설계다. 메모리는 규칙적으로 반복되는 패턴, CPU·GPU 같은 로직은 복잡한 패턴이며 여러 장이 필요하다.', 'The photomask is the design itself: memory repeats regular patterns, logic such as CPUs and GPUs is complex, and many masks are needed.'),
          B('정렬은 앞 공정이 남긴 정렬 마크로 맞추고, 노광 뒤 오버레이 마크로 어긋남을 잰다(모든 웨이퍼를 재지는 않는다). 노광은 칩 몇 개 크기의 좁은 영역에 빛을 쏘고 옆으로 옮겨 가며 반복한다.', 'Alignment uses marks from earlier steps; overlay marks measure misalignment after exposure (not on every wafer). Exposure lights a field a few chips wide, then steps across the wafer.'),
          B('분해능 d = λ/(2NA) — 파장(λ)을 줄이거나 개구수(NA)를 키운다: ArF 193nm → EUV 13.5nm, 물을 매질로 쓰는 ArF 액침(DUV), 렌즈를 키운 High NA EUV.', 'Resolution d = λ/(2NA) — shorten the wavelength or raise the numerical aperture: ArF 193 nm → EUV 13.5 nm, ArF immersion (DUV) using water, and High-NA EUV with larger optics.'),
          B('EUV 도입 뒤 감광액에 맞고 튄 고에너지 광선이 마스크를 오염시키자, 감광액 연구와 함께 마스크 보호막(펠리클)을 도입했다.', 'After EUV arrived, high-energy light bouncing off resist contaminated masks; resist research and a protective pellicle solved it.'),
          B('웨이퍼 레벨 패키지의 포토 공정은 두꺼운 감광액(스핀·필름 라미네이션·스프레이 도포)과 마스크 얼라이너·스테퍼를 쓴다.', 'Lithography in wafer-level packaging uses thick resist (spin, film lamination or spray) and mask aligners or steppers.')
        ] },
      { id: 'etch', t: B('식각', 'Etching'), hz: ['etch', 'strip'], src: ['nrFeEtch'],
        why: B('포토로 만든 틀을 따라 필요 없는 부분을 파냅니다.', 'Cuts away unwanted material along the pattern made by lithography.'),
        how: [
          B('세척은 웨이퍼 전체의 불순물을 씻어 내는 일, 식각은 마스크로 원하는 패턴만 파내는 일이다.', 'Cleaning washes contaminants off the whole wafer; etching cuts only the masked pattern.'),
          B('지표: 선택비(지울 물질만 지우는 정도), 방향성(등방성·비등방성), 속도, 균일도.', 'Measures: selectivity (removing only the target), direction (isotropic or anisotropic), rate and uniformity.'),
          B('습식(액체에 담금)은 빠르고 선택비가 높지만 등방성이 강하고, 표면장력 때문에 미세한 틈에 들어가지 못해 현대 반도체의 핵심 층에는 쓸 수 없다.', 'Wet etching (immersion) is fast and selective but isotropic, and surface tension keeps it out of fine gaps, so it cannot be used on critical layers of modern chips.'),
          B('건식은 플라즈마 식각·스퍼터링·반응성 이온 식각(RIE)을 아우른다. RIE는 가속된 양이온(물리)과 반응성 높은 라디칼(화학)을 함께 써서 선택비와 비등방성을 동시에 얻는다. 패턴이 무너지지 않게 하드 마스크를 쓰기도 한다.', 'Dry etching covers plasma etching, sputtering and reactive ion etching (RIE). RIE combines accelerated ions (physical) with reactive radicals (chemical) for selectivity and anisotropy together; hard masks keep fine patterns from collapsing.'),
          B('가스: 불소·염소·브롬 같은 할로겐 화합물. 실리콘은 불소계(SiF₄로 바로 기화), SiO₂는 탄소가 결합된 불소계 가스로 깎고, 산소·질소·수소와 네온 같은 불활성 기체를 더해 특성을 맞춘다.', 'Gases: halogen compounds (fluorine, chlorine, bromine). Fluorine gases etch silicon (SiF₄ vaporises at once), carbon-bearing fluorine gases etch SiO₂, and O₂, N₂, H₂ or inert gases such as neon tune the result.'),
          B('구리는 반응 부산물의 기화점이 1,000°C를 넘어 식각이 어렵다 — 그래서 다마신 공법과 함께 도입됐다.', 'Copper’s etch by-products vaporise only above 1,000 °C, so copper came in with the damascene method instead.'),
          B('메모리와의 관계: D램은 캐패시터를 점점 높게, 낸드는 한 번에 100개 넘는 층을 뚫어야 해서 종횡비(깊이 ÷ 폭)가 매우 높은 식각이 필요하다.', 'For memory: DRAM capacitors keep getting taller and NAND must cut through more than 100 layers at once, so etching needs very high aspect ratios (depth ÷ width).')
        ] },
      { id: 'dep', t: B('증착 (박막)', 'Deposition (thin film)'), hz: ['dep'], src: ['nrDepo', 'nrAld'],
        why: B('웨이퍼 위에 아주 얇고 고른 막을 씌웁니다. 반도체 회사에서는 ‘박막(Thin film) 공정’이라 부릅니다.', 'Lays very thin, even films on the wafer; chip companies call it the thin-film process.'),
        how: [
          B('막의 쓰임: 소자 경계의 누설을 막는 STI, 금속 배선층 사이를 절연하는 IMD(SiO₂·SiC·SiN), 금속 배선(티타늄·구리·알루미늄)과 접점, 게이트 유전막, 멀티 패터닝용 하드 마스크. 게이트 유전막은 과거 산화로 만들었지만 지금은 주로 증착으로 만든다.', 'Uses: STI to stop leakage between devices, IMD to insulate metal layers (SiO₂, SiC, SiN), metal lines (Ti, Cu, Al) and contacts, gate dielectrics and hard masks for multi-patterning. Gate dielectrics were once grown by oxidation but are now mostly deposited.'),
          B('지표: 균일도, 스텝 커버리지(단차 위·아래·옆 두께의 차이 — 1에 가까울수록 좋음), 갭 필(빈틈을 채우는 능력 — 나쁘면 공동(Void)이 생긴다).', 'Measures: uniformity, step coverage (top versus bottom and side thickness; closer to 1 is better) and gap fill (poor fill leaves voids).'),
          B('CVD(화학 기상 증착): 두 기체를 반응시켜 막을 만든다. 빠르고 스텝 커버리지가 좋지만 부산물이 섞일 수 있어 하드 마스크·두꺼운 차단막에 쓴다.', 'CVD: two gases react to form the film — fast with good step coverage, but by-products can get in, so it is used for hard masks and thick barriers.'),
          B('PVD(물리 기상 증착, 주로 스퍼터링): 표적(Target)에 이온을 부딪쳐 떨어진 입자를 붙인다. 부산물이 없어 순도가 높고 순수 텅스텐·코발트도 올릴 수 있어 금속 배선에 쓴다.', 'PVD (mainly sputtering): ions knock atoms off a target onto the wafer — no by-products, high purity, even pure tungsten or cobalt — so it is used for metal wiring.'),
          B('ALD(원자층 증착): 전구체를 한 층만 흡착 → 남은 기체 제거 → 반응 기체 투입을 되풀이해 원자 한 층씩 쌓는다. 균일도·스텝 커버리지가 가장 좋지만 느려서 D램 캐패시터처럼 종횡비가 높은 곳에 쓴다. 예: 트리메틸알루미늄(Al(CH₃)₃)과 물로 Al₂O₃ 막.', 'ALD: adsorb one layer of precursor → purge → add the reactant, repeated one atomic layer at a time. Best uniformity and step coverage but slow, so used where aspect ratios are high, such as DRAM capacitors. Example: trimethylaluminium (Al(CH₃)₃) and water give Al₂O₃.'),
          B('조건: 압력이 낮으면 느리지만 수직 방향 증착이 강해지고, 온도가 높으면 순도가 오르지만 앞 공정의 알루미늄처럼 열에 약한 물질이 상한다. 같은 SiO₂라도 게이트 절연막은 고온·저압(품질), STI는 저온·고압(속도)으로 만든다.', 'Conditions: lower pressure is slower but more vertical; higher temperature raises purity but harms heat-sensitive earlier layers such as aluminium. The same SiO₂ is made hot and at low pressure for gate dielectrics (quality) and cooler at higher pressure for STI (speed).')
        ] },
      { id: 'dope', t: B('이온주입·열처리', 'Ion implantation and anneal'), hz: ['dope'], src: ['nrImplant', 'nrFeOx'],
        why: B('순수 실리콘에 3족·5족 불순물을 넣어 트랜지스터의 소스·드레인·웰을 만듭니다.', 'Adds group-III or group-V impurities to pure silicon to form transistor sources, drains and wells.'),
        how: [
          B('초기에는 확산 방식을 썼고, 지금은 양과 깊이를 정확히 조절하는 이온주입을 쓴다. 문턱전압 조절과 웰 형성에도 쓰인다.', 'Diffusion came first; ion implantation now controls dose and depth precisely and is also used to set threshold voltages and form wells.'),
          B('순서: BF₃·PH₃·AsH₃ 같은 원료 가스에 열전자를 부딪쳐 양이온을 만든다 → 자기장으로 필요한 이온만 고른다 → 가속해 빔으로 웨이퍼를 훑는다(중성으로 바뀐 입자는 휘어진 빔 경로에서 분리).', 'Steps: hot electrons strike source gases such as BF₃, PH₃ or AsH₃ to make positive ions → a magnetic field picks the wanted ions → they are accelerated and scanned across the wafer (neutralised particles are separated by the bent beam path).'),
          B('빔 전류가 크면 주입량(도즈)이, 가속 전압이 크면 깊이가 커진다. 이온이 결정 사이로 너무 깊이 들어가는 채널링은 입사 각도와 에너지로 막는다.', 'Higher beam current raises the dose; higher voltage drives ions deeper. Channelling — ions slipping too deep between crystal rows — is prevented with tilt angle and energy.'),
          B('주입으로 흐트러진 결정 격자는 어닐링(열처리, 빠른 열처리 RTA 포함)으로 되돌린다.', 'Annealing, including rapid thermal annealing (RTA), repairs the crystal damage from implantation.')
        ] },
      { id: 'metal', t: B('금속배선', 'Metallization'), hz: ['metal'], src: ['nrMetal', 'nrDepo'],
        why: B('소자를 서로, 그리고 전원과 잇습니다. 같은 소자도 잇는 방식에 따라 다른 칩이 됩니다.', 'Connects devices to each other and to power; the same devices become different chips depending on how they are wired.'),
        how: [
          B('단일 공정이 아니라 포토·식각·증착을 조합하는 작업이다.', 'Not a single process but a combination of lithography, etching and deposition.'),
          B('컨택(접점): 소자와 배선을 잇는 연결부. 깊은 구멍은 알루미늄이 잘 채워지지 않아 텅스텐(W)으로 먼저 채운다(텅스텐은 저항이 커서 남용하면 전력이 늘어난다).', 'Contacts link devices to wiring. Deep holes are filled first with tungsten because aluminium fills them poorly (tungsten’s higher resistance raises power if overused).'),
          B('배리어 메탈: 티타늄·코발트를 실리콘과 반응시켜 경계 저항을 낮춘다(실리사이드). 알루미늄과 실리콘의 반응을 막고, 구리는 SiO₂로도 퍼지므로 탄탈륨(Ta)으로 경계를 짓는다.', 'Barrier metals: titanium or cobalt reacted with silicon lowers contact resistance (silicide); barriers stop aluminium reacting with silicon, and tantalum fences in copper, which diffuses even into SiO₂.'),
          B('알루미늄 배선은 금속 막 → 패턴 → 식각 → 절연물 채움. 구리 배선(다마신)은 반대로 절연막을 먼저 식각 → 씨드 층 → 전기도금으로 채움 → 남는 구리를 연마.', 'Aluminium lines: metal film → pattern → etch → fill with dielectric. Copper (damascene) is the reverse: etch the dielectric → seed layer → fill by electroplating → polish off excess copper.'),
          B('배선은 위층일수록 두껍고, 상부층에는 익숙한 기존 공정을 다시 쓰기도 한다. 전류가 금속 원자를 밀어내는 일렉트로마이그레이션이 배선 소재를 바꾸게 한 요인이다.', 'Wires get thicker toward the top, where older, familiar processes can be reused. Electromigration — current pushing metal atoms aside — has driven changes in wiring materials.')
        ] },
      { id: 'cmp', t: B('CMP (평탄화)', 'CMP (planarization)'), hz: ['cmp'], src: ['nrCmp', 'nrMetal', 'nrWlp'],
        why: B('웨이퍼 표면을 화학·기계적으로 갈아 평평하게 하고 남는 물질을 없앱니다.', 'Polishes the wafer flat, chemically and mechanically, and removes excess material.'),
        how: [
          B('슬러리(연마액)를 접촉면에 분포한 상태에서 패드로 연마 → 브러시 습식세정 → 건조.', 'Pad polishing with slurry over the contact surface → brush wet clean → dry.'),
          B('구리 다마신 배선에서 남는 구리를 갈아 내고, TSV를 만들 때 구리를 채운 뒤 웨이퍼 윗면의 구리를 없애며 평탄화한다.', 'Removes excess copper in damascene wiring, and after copper fill for TSVs it planarises the wafer and clears copper from the top surface.')
        ] },
      { id: 'clean', t: B('세정', 'Cleaning'), hz: ['clean'], src: ['nrClean', 'nrCmp'],
        why: B('공정마다 남는 화학적·물리적 잔류물을 없애 수율과 신뢰성을 지킵니다.', 'Removes the chemical and physical residues each step leaves, protecting yield and reliability.'),
        how: [
          B('잔류물: 포토 뒤 감광액 찌꺼기, 식각 뒤 남은 산화막, 공기 중 파티클, 유기물·금속 잔류물 등 — 잔류물의 성질부터 확인한다.', 'Residues include resist remnants, oxide left after etching, airborne particles, and organic or metallic residues — identify the residue first.'),
          B('습식(화학 용액)이 가장 많이 쓰이는 기본 방식이다. 과산화수소(H₂O₂) 기반 RCA 세정에서 출발해 암모니아·염산·황산을 섞고 인산·불산도 쓰며, 오존 방식도 나왔다. 세정 뒤에는 린스와 건조가 필요하다.', 'Wet cleaning with chemical solutions is the basic, most common method: from hydrogen-peroxide-based RCA cleaning mixed with ammonia, hydrochloric or sulphuric acid, plus phosphoric and hydrofluoric acid, and ozone-based methods. Rinsing and drying follow.'),
          B('건식(기체·플라즈마 등)과 증기 세정은 패턴이 미세해져 세정액이 깊은 트렌치·비아 바닥에 닿지 못하면서 늘었다. 플라즈마는 효율이 높지만 인접 막을 상하게 할 수 있다.', 'Dry cleaning (gases, plasma and more) and vapour cleaning grew as liquids stopped reaching the bottom of deep trenches and vias; plasma is efficient but can damage neighbouring films.'),
          B('SK하이닉스 C&C(Cleaning & CMP) 기술 조직의 소개: 케미컬을 쓰는 습식세정, 플라즈마 등 가스를 쓰는 건식세정.', 'As SK hynix’s C&C (Cleaning & CMP) team describes it: wet cleaning with chemicals and dry cleaning with gases such as plasma.')
        ] }
    ],
    /* 3) 테스트 — 후공정 1편·11편 */
    test: {
      kinds: [
        [B('온도별', 'By temperature'), B('고온은 스펙 최고 온도보다 10% 이상, 저온은 최저 온도보다 10% 이하, 상온은 보통 25°C. 메모리는 보통 고온 85~90°C, 저온 −5~−40°C.', 'Hot: at least 10 % above the spec maximum; cold: at least 10 % below the minimum; room: usually 25 °C. For memory, typically 85–90 °C hot and −5 to −40 °C cold.')],
        [B('속도별', 'By speed'), B('코어 테스트(셀에 제대로 저장되는지)와 스피드 테스트(원하는 속도로 동작하는지).', 'Core test (does each cell store correctly) and speed test (does it run at the target speed).')],
        [B('동작별', 'By operation'), B('DC 테스트(전류·전압 값), AC 테스트(입출력 스위칭 시간 같은 동적 특성), 기능 테스트(셀과 주변 회로가 정상 동작하는지).', 'DC tests (current and voltage values), AC tests (dynamic behaviour such as switching time) and functional tests (cells and peripheral circuits work).')]
      ],
      wafer: [
        ['EPM', B('단위 소자의 전기 특성(트랜지스터 특성·접촉 저항)을 재서 웨이퍼 공정에 피드백한다.', 'Measures device parameters (transistor behaviour, contact resistance) and feeds them back to the fab.')],
        [B('웨이퍼 번인', 'Wafer burn-in'), B('온도·전압 스트레스로 초기 불량을 미리 드러낸다(욕조 곡선의 초기 고장 구간).', 'Temperature and voltage stress bring out early failures (the early part of the bathtub curve).')],
        [B('테스트', 'Test'), B('프루브 카드의 탐침을 칩 패드에 대고 전기 특성을 검사한다. 양산에서는 웨이퍼당 2~3번 접촉한다.', 'Probe-card needles touch the chip pads for electrical tests; volume production takes two or three touchdowns per wafer.')],
        [B('리페어', 'Repair'), B('불량 셀이 있는 열·줄을 여분 셀(Redundancy)로 바꿔 수율을 높인다. 레이저 리페어는 웨이퍼 단계에서만, e-퓨즈 리페어는 패키지 뒤에도 가능하다.', 'Replaces rows or columns with bad cells by spare (redundancy) cells to raise yield. Laser repair works only at wafer stage; e-fuse repair also works after packaging.')],
        [B('재테스트', 'Retest'), B('바꾼 셀로 칩이 스펙을 만족하는지 다시 확인한다.', 'Confirms the chip meets spec with the replaced cells.')]
      ],
      pkg: [
        ['TDBI', B('패키지 상태의 번인(Test During Burn-In). 대부분의 제품은 웨이퍼 번인과 패키지 번인을 함께 한다.', 'Burn-in on packaged parts (Test During Burn-In); most products get both wafer and package burn-in.')],
        [B('테스트', 'Test'), B('데이터시트보다 가혹한 온도 코너·최악 조건을 조합해 AC/DC·셀·주변 회로를 검증한다.', 'Temperature corners and worst-case combinations harsher than the datasheet, covering AC/DC, cells and peripherals.')],
        [B('마킹', 'Marking'), B('스피드 등급 같은 테스트 결과를 패키지 겉면에 레이저로 새긴다.', 'Laser-marks test results such as the speed grade on the package.')],
        [B('외관 검사', 'Visual inspection'), B('몸체 균열·마킹 오류·트레이 오적재, 솔더 볼 눌림·누락을 걸러 출하한다.', 'Screens out body cracks, marking errors, mis-loaded trays and squashed or missing solder balls before shipping.')]
      ],
      relIntro: B('신뢰성은 품질을 보장 기간 동안 유지하는 능력입니다. 업계 공통 기준은 JEDEC 표준이며(신뢰성은 JC14 위원회, 회사마다 한 표), 가속 시험과 통계로 짧은 시간에 수명을 검증합니다.', 'Reliability is keeping quality for the guaranteed period. The industry yardstick is the JEDEC standard (reliability in committee JC14; one vote per company), and accelerated tests with statistics verify lifetime quickly.'),
      rel: [
        [B('수명', 'Lifetime'), 'EFR · HTOL · LTOL · HTSL · Endurance · Data Retention', B('초기 불량률(EFR — 보통 고객 환경의 약 1년), 고온 동작 수명(HTOL), 저온 동작 수명(LTOL), 고온 보관(HTSL), 낸드의 쓰기·지우기 반복 한계(내구성)와 데이터 보존.', 'Early failure rate (EFR — usually about the first year in the field), high- and low-temperature operating life (HTOL, LTOL), high-temperature storage (HTSL), NAND program/erase endurance and data retention.')],
        [B('환경', 'Environmental'), 'Preconditioning · TC · THS · THB · PCT · UHAST · HAST · HALT', B('출하·보관·실장을 흉내 낸 전처리(TC → 건조 → 흡습 → 리플로우), 온도 주기(TC), 고온·고습(THS·THB), 압력솥 시험(PCT, 상대습도 100%) — 서브스트레이트형 얇은 패키지는 85% RH의 UHAST로.', 'Preconditioning that mimics shipping, storage and mounting (TC → bake → soak → reflow), thermal cycling, temperature-humidity (THS, THB) and the pressure cooker test (PCT, 100 % RH) — thin substrate packages use UHAST at 85 % RH instead.')],
        [B('기계', 'Mechanical'), 'Shock · Drop · Vibration · Bending · Torsion', B('충격·낙하(약 1~1.2m), 운송 진동(사인 진동), PCB 굽힘·비틀림에 대한 솔더 접합부 내성.', 'Shock and drop (about 1–1.2 m), transport vibration (sine) and solder-joint resistance to PCB bending and twisting.')]
      ],
      src: ['nrBeTest', 'nrBeRel']
    },
    /* 4) 패키지 — 후공정 2·3·4·6·7·8·9·10편 */
    pkg: {
      roles: [
        [B('기계적 보호', 'Protection'), B('EMC 같은 재료로 칩을 감싸 물리적·화학적 충격에서 지킨다 — 실리콘은 유리처럼 깨지기 쉽다.', 'Encases the chip in materials such as EMC against physical and chemical damage — silicon breaks as easily as glass.')],
        [B('전기적 연결', 'Electrical connection'), B('전원을 넣고 신호가 드나드는 통로를 만든다. 패키지가 느리면 칩이 빨라도 제품이 느리다.', 'Provides paths for power and signals; a slow package makes a fast chip slow.')],
        [B('기계적 연결', 'Mechanical connection'), B('쓰는 동안 시스템에 단단히 붙어 있게 한다.', 'Keeps the chip firmly attached to the system in use.')],
        [B('열 방출', 'Heat dissipation'), B('동작 중 생기는 열을 빨리 내보낸다 — 속도·기능이 늘수록 중요해진다.', 'Removes the heat generated in operation — more important as speed and functions grow.')]
      ],
      notes: [
        B('업계에서 ‘반도체 패키지’는 웨이퍼에서 칩을 잘라(0차) 단품으로 만드는(1차) 과정을 말한다.', 'In the industry, “semiconductor package” means cutting chips from the wafer (level 0) and making them into single parts (level 1).'),
        B('웨이퍼의 최소 패턴은 10nm 이하인데 PCB는 100µm대여서 그 차이를 패키지가 메운다 — 쓰루홀(DIP·ZIP) → 표면 실장(TSOP) → BGA·플립칩·팬아웃 WLCSP·TSV 순으로 발전.', 'Wafer features are below 10 nm while PCBs are in the 100 µm range, and the package bridges the gap — through-hole (DIP, ZIP) → surface mount (TSOP) → BGA, flip chip, fan-out WLCSP and TSV.'),
        B('새 칩과 새 패키지 기술을 함께 쓰지 않는다 — 불량 원인을 가리기 어려워서, 새 패키지 기술은 불량이 거의 없는 기존 양산 칩으로 먼저 검증한다.', 'A new chip and a new package technology are not introduced together — failures would be hard to trace — so new packaging is proven first on mature production chips.')
      ],
      types: [
        { g: B('컨벤셔널 (칩으로 자른 뒤 패키지)', 'Conventional (cut first, then package)'), items: [
          [B('세라믹', 'Ceramic'), B('열 방출·신뢰성이 좋지만 비싸다 — 고신뢰 로직, CIS 검증용.', 'Good heat dissipation and reliability but costly — high-reliability logic, CIS verification.')],
          [B('플라스틱 · 리드프레임형', 'Plastic · leadframe'), B('DIP·ZIP·TSOP·QFP·SOJ. 금속판 배선이라 금속층이 1층뿐이지만 싸서 고속이 필요 없는 제품에 여전히 쓴다.', 'DIP, ZIP, TSOP, QFP, SOJ. Stamped or etched metal gives only one metal layer, but it is cheap, so still used where high speed is not needed.')],
          [B('플라스틱 · 서브스트레이트형', 'Plastic · substrate'), B('다층 배선, 바닥에 솔더 볼(BGA) 또는 볼 랜드(LGA). 전기 특성이 좋고 작아서 지금 대부분이 이 형태다.', 'Multilayer wiring with solder balls (BGA) or lands (LGA) underneath; better electrically and smaller, so most packages today use it.')]
        ] },
        { g: B('웨이퍼 레벨 (웨이퍼 상태로 진행)', 'Wafer level (done on the wafer)'), items: [
          [B('팬인 WLCSP', 'Fan-in WLCSP'), B('웨이퍼 위에 배선·절연층·솔더 볼을 바로 만든다. 칩 크기 = 패키지 크기로 가장 작고 경로가 짧지만, 보호 기능이 약하고 PCB와의 열팽창 차이로 솔더 접합이 취약하다.', 'Wiring, insulation and solder balls go straight onto the wafer. Package = chip size, smallest and shortest path, but weaker protection and solder joints stressed by the thermal-expansion mismatch with the PCB.')],
          [B('팬아웃 WLCSP', 'Fan-out WLCSP'), B('양품 칩만 캐리어에 간격을 두고 다시 배열해 EMC로 웨이퍼 형태를 만든 뒤 배선 — 패키지 크기와 볼 배열을 자유롭게 정한다.', 'Only good dies are re-spaced on a carrier and moulded into a wafer shape with EMC before wiring, so package size and ball layout are free.')],
          ['RDL', B('웨이퍼에 있는 패드를 금속층을 더해 원하는 위치로 다시 배열한다(칩 적층, 고객별 패드 배열).', 'Adds a metal layer to move pads where needed (chip stacking, customer pad layouts).')],
          [B('플립칩', 'Flip chip'), B('칩 위에 수십 µm 솔더 범프를 만들어 뒤집어 붙인다. 와이어 본딩보다 핀이 많고 경로가 짧으며, 범프 사이를 반드시 언더필로 채운다.', 'Solder bumps tens of micrometres wide are formed on the chip, which is flipped onto the substrate; more pins and shorter paths than wire bonding, and underfill between bumps is mandatory.')],
          ['TSV', B('실리콘을 뚫어 전도성 재료로 채운 전극으로 적층한 칩을 수직 연결한다. 범프 형성을 웨이퍼 레벨로 하므로 웨이퍼 레벨 패키지로도 분류된다.', 'Electrodes drilled through silicon and filled with conductor connect stacked chips vertically; bumps are made at wafer level, so it also counts as wafer-level packaging.')]
        ] },
        { g: B('적층', 'Stacking'), items: [
          [B('패키지 적층 (PoP)', 'Package on package (PoP)'), B('테스트를 마친 패키지를 쌓는다 — 모바일에서 위는 메모리, 아래는 프로세서. 만드는 회사가 달라도 각자 검증한 뒤 쌓고 재작업이 쉽다.', 'Tested packages are stacked — in mobiles, memory on top and processor below; different makers verify their own part and rework is easy.')],
          [B('와이어 본딩 칩 적층', 'Wire-bonded chip stack'), B('한 패키지 안에 칩을 쌓아 와이어로 연결 — 작고 빠르지만 칩 하나가 불량이면 패키지 전체를 버린다.', 'Chips stacked in one package and wired — smaller and faster, but one bad chip scraps the whole package.')],
          [B('TSV 칩 적층', 'TSV chip stack'), B('칩 가운데까지 수직 전극으로 바로 연결 — 핀 수를 크게 늘린다(HBM, 서버 모듈용 3DS).', 'Vertical electrodes even through the chip centre — many more pins (HBM, 3DS for server modules).')]
        ] }
      ],
      conv: [
        [B('백 그라인딩', 'Back grinding'), B('앞면에 보호 테이프 → 거친 휠 → 고운 휠 → 폴리싱 → 마운팅 테이프·링 프레임. 칩 1개 패키지는 200~250µm, 적층용은 더 얇게(얇을수록 휨이 커진다).', 'Protective tape on the front → coarse wheel → fine wheel → polishing → mounting tape and ring frame. 200–250 µm for single-chip packages, thinner for stacks (thinner wafers warp more).')],
        [B('웨이퍼 절단', 'Wafer sawing (dicing)'), B('스크라이브 레인을 다이아몬드 블레이드나 레이저로 자른다. 얇은 웨이퍼는 먼저 일부를 자른 뒤 가는 DBG, 레이저로 내부에 손상을 낸 뒤 테이프를 늘려 가르는 스텔스 다이싱을 쓴다.', 'Scribe lanes are cut with a diamond blade or laser; thin wafers use dicing before grinding (DBG) or stealth dicing (laser damage inside, then tape expansion).')],
        [B('다이 어태치', 'Die attach'), B('자외선을 쬐어 접착력을 낮춘 테이프에서 양품 칩만 떼어, 액상 접착제나 DAF 필름으로 기판에 붙인다.', 'Only good dies are picked from tape whose grip has been weakened by UV, then attached with liquid adhesive or DAF film.')],
        [B('인터커넥션', 'Interconnection'), B('와이어 본딩(주로 금선 — 캐필러리 끝에 전기 스파크로 볼을 만들어 볼 본딩 → 루프 → 스티치 본딩) 또는 플립칩 본딩(MR·열압착)과 언더필(CUF·MUF·선도포).', 'Wire bonding (mostly gold — a spark forms a ball at the capillary tip: ball bond → loop → stitch bond) or flip-chip bonding (mass reflow or thermo-compression) with underfill (CUF, MUF or pre-applied).')],
        [B('몰딩', 'Molding'), B('EMC로 감싼다 — 태블릿을 녹여 흘려 넣는 트랜스퍼 몰딩, 칩 위 간격이 좁거나 기판이 클 때는 가루를 미리 채우는 컴프레션 몰딩.', 'Encapsulation in EMC — transfer molding from melted tablets, or compression molding with pre-filled powder when the gap over the chip is small or the substrate large.')],
        [B('마킹', 'Marking'), B('레이저(음각, 그래서 검은 EMC를 선호) 또는 잉크로 제품 정보를 새긴다 — 불량 추적에도 쓰인다.', 'Product information is laser-engraved (hence black EMC) or inked — also used to trace failures.')],
        [B('솔더 볼 마운팅', 'Solder ball mounting'), B('플럭스 도포 → 스텐실로 볼을 올림 → 리플로우로 녹여 붙임 → 플럭스 세정.', 'Flux → balls placed through a stencil → reflow → flux cleaning.')],
        [B('싱귤레이션', 'Singulation'), B('블레이드로 스트립을 패키지 단위로 잘라 트레이에 담아 패키지 테스트로 보낸다. (리드프레임형은 몰딩 뒤 트리밍 → 솔더 도금 → 포밍)', 'A blade cuts the strip into packages, which go in trays to package test. (Leadframe types instead get trim → solder plating → form after molding.)')]
      ],
      wlp: [
        [B('공통 순서', 'Common sequence'), B('절연층 → 스퍼터링 금속 박막(UBM·씨드 — 접착층·전류 공급층·확산 방지층, 예: Ti/Cu/Ni) → 두꺼운 감광액 패턴 → 전해도금(웨이퍼가 음극) → 감광액 제거(스트립) → 얇은 금속막 습식 식각.', 'Insulating layer → sputtered metal film (UBM or seed: adhesion, current-carrying and diffusion-barrier layers, e.g. Ti/Cu/Ni) → thick resist pattern → electroplating (the wafer is the cathode) → resist strip → wet etch of the thin metal.')],
        [B('팬인 WLCSP', 'Fan-in WLCSP'), B('구리 도금 배선 → 절연층(SR)으로 볼 자리만 열기 → 솔더 볼 → 절단.', 'Copper-plated wiring → insulating layer (SR) opened only where balls go → solder balls → dicing.')],
        [B('플립칩 범프', 'Flip-chip bumps'), B('구리 기둥 범프(CPB)는 구리 위에 무연 Sn-Ag 솔더를 도금하고, 리플로우로 둥글게 만들어 높이 차·산화물을 줄인다.', 'Copper pillar bumps (CPB): lead-free Sn-Ag solder is plated on copper, then reflowed round to even heights and remove oxide.')],
        ['RDL', B('와이어 본딩이 잘 되도록 금(Au)으로 도금한 배선으로 새 패드를 만든 뒤 컨벤셔널 공정으로.', 'New pads are made with gold-plated lines for good wire bonding, then the conventional flow follows.')],
        [B('팬아웃 WLCSP', 'Fan-out WLCSP'), B('캐리어에 양품 칩 배열 → 웨이퍼 몰딩 → 캐리어 제거 → 배선·솔더 볼 → 절단.', 'Good dies on a carrier → wafer molding → carrier removal → wiring and balls → dicing.')]
      ],
      mat: [
        [B('원재료 (패키지에 남음)', 'Direct materials (stay in the package)'), B('리드프레임(Alloy 42·구리 합금), 서브스트레이트(BT 수지를 함침한 유리섬유 코어 + 동박, 솔더 레지스트), 접착제(에폭시·DAF), EMC(에폭시 + 무기 실리카), 솔더(볼 지름 30~760µm, 무연), 와이어(금, 구리 등 — 구리는 산화를 막으려 질소 분위기).', 'Leadframes (Alloy 42, copper alloys), substrates (BT-resin glass-fibre core with copper foil, solder resist), adhesives (epoxy, DAF), EMC (epoxy plus inorganic silica), solder (balls 30–760 µm, lead-free), wire (gold, copper and others — copper bonded under nitrogen to prevent oxidation).')],
        [B('부재료 (공정 중 제거)', 'Indirect materials (removed in process)'), B('백 그라인딩·다이싱 테이프(자외선에 반응하는 점착제), 플럭스.', 'Back-grinding and dicing tapes (UV-sensitive adhesive) and flux.')],
        [B('웨이퍼 레벨 재료', 'Wafer-level materials'), B('감광액, 도금액(Ni·Au·Cu·Sn·SnAg 이온 + 황산·메탄술폰산 + 첨가제), PR 스트리퍼, 에천트, 스퍼터 타깃, 언더필(CUF·MUF·NCP·NCF), WSS 캐리어(실리콘 또는 유리 — 레이저 디본딩은 유리)와 임시 접착제(TBA).', 'Photoresist, plating baths (Ni, Au, Cu, Sn, SnAg ions with sulphuric or methanesulphonic acid and additives), PR strippers, etchants, sputter targets, underfills (CUF, MUF, NCP, NCF), WSS carriers (silicon or glass — glass for laser debonding) and temporary bonding adhesive (TBA).')]
      ],
      src: ['nrBePkg', 'nrBeType1', 'nrBeType2', 'nrBeConv', 'nrBeWlp1', 'nrWlp', 'nrBeMat1', 'nrBeMat2']
    }
  };

  /* 5) 메모리 구조와 HBM — 회사 보도자료·인터뷰·Pathfinder를 우선, 구조 일반론은 칼럼 */
  SHE.SKH_MEM = {
    compare: {
      rows: [
        [B('셀 구조', 'Cell'), B('트랜지스터 1개 + 캐패시터 1개', 'One transistor + one capacitor'), B('트랜지스터 1개에 게이트가 둘(컨트롤 게이트 + 전자를 가두는 플로팅 게이트). SK하이닉스는 플로팅 게이트 대신 부도체에 전자를 저장하는 CTF를 쓴다', 'One transistor with two gates (control gate + a floating gate that traps electrons); SK hynix stores charge in an insulator instead (CTF)')],
        [B('데이터 유지', 'Retention'), B('전원이 켜진 동안 일정 주기로 다시 써 줘야(refresh) 하고, 끄면 사라진다(휘발성)', 'Must be refreshed periodically while powered and is lost at power-off (volatile)'), B('전원이 꺼져도 남는다(비휘발성)', 'Kept without power (non-volatile)')],
        [B('강점', 'Strength'), B('스위칭(동작) 속도가 매우 빠르다', 'Very fast switching'), B('집적도 — 같은 면적에 가장 많이 저장한다', 'Density — stores the most per area')],
        [B('미세화 과제', 'Scaling challenge'), B('캐패시터를 점점 높이 쌓아 전하 용량을 지켜야 한다', 'Capacitors must keep getting taller to hold enough charge'), B('층을 더 쌓아야 한다 — 한 번에 100층 넘게 뚫는 식각', 'More layers — etching through over 100 layers at once')],
        [B('SK하이닉스 제품', 'SK hynix products'), B('DDR5·LPDDR·GDDR·HBM·모듈·CXL 메모리', 'DDR5, LPDDR, GDDR, HBM, modules, CXL memory'), B('기업용·PC용 SSD, UFS·eMMC', 'Enterprise and client SSDs, UFS, eMMC')]
      ],
      src: ['nrBeTest', 'nrDramNand', 'nr4dNand', 'nrFeEtch', 'nrMetal', 'skhProducts']
    },
    dram: {
      facts: [
        B('10나노급 D램 공정은 1x → 1y → 1z → 1a → 1b → 1c 순으로 개발돼 1c가 6세대다.', '10 nm-class DRAM nodes run 1x → 1y → 1z → 1a → 1b → 1c, so 1c is the sixth generation.'),
        B('2024년 8월 세계 최초로 1c 16Gb DDR5 개발 발표 — 동작 속도 8Gbps로 1b DDR5보다 11% 빠르고 전력 효율 9% 이상 개선. EUV 공정에 신소재를 개발해 적용하고 설계 혁신으로 공정 효율·원가를 개선했다.', 'August 2024: the world’s first 1c 16 Gb DDR5 announced — 8 Gbps, 11 % faster than 1b DDR5, with power efficiency improved by over 9 %; new materials were developed for the EUV process and design innovations raised efficiency and cut cost.'),
        B('개발 방식: 검증된 1b 플랫폼을 넓혀 개발하고, 3단계(테스트·설계·양산 준비)를 2단계(설계·양산 준비)로 줄였으며 캐패시터 모듈처럼 어려운 요소는 양산 공정에서 바로 개발했다 — 전 세대보다 2개월 단축.', 'Approach: extend the proven 1b platform, cut development from three phases (test, design, ramp prep) to two (design, ramp prep), and develop hard modules such as the capacitor directly on the production line — two months faster than the previous node.'),
        B('1c 기술은 HBM·LPDDR·GDDR 등 차세대 D램 전반에 적용된다. 10나노 아래로 가면 2D 셀에서 3D 셀로의 구조 변화, 이종접합 같은 혁신이 필요할 것으로 회사 기술진은 내다봤다.', '1c applies across next-generation DRAM — HBM, LPDDR, GDDR. Below 10 nm, the engineers expect a move from 2-D to 3-D cells and hetero-bonding to be needed.'),
        B('개발에 함께한 조직(좌담회 참석): 1c Tech TF, DRAM 설계, DRAM PI, DRAM PE, 개발 TEST, DRAM AE.', 'Teams at the roundtable: 1c Tech TF, DRAM Design, DRAM PI, DRAM PE, Development Test and DRAM AE.')
      ],
      src: ['nr1c']
    },
    nand: {
      cells: [
        ['SLC', 1, 2, 1], ['MLC', 2, 4, 3], ['TLC', 3, 8, 7], ['QLC', 4, 16, 15]
      ],
      cellNote: B('셀에 넣는 전자의 양을 잘게 나눠 상태 수를 늘린다. SLC → QLC로 갈수록 같은 용량에서 원가는 낮아지지만 쓰기·읽기 시간과 신뢰성은 나빠진다. 5비트 PLC도 있다.', 'More states come from finer steps in the amount of stored charge. From SLC to QLC, cost per capacity falls but write and read times and reliability worsen. 5-bit PLC also exists.'),
      tech: [
        { t: B('4D 낸드의 시작', 'Origin of 4D NAND'), d: B('2018년 주변 회로(Peri.)를 셀 아래에 넣는 PUC로 새 구조의 낸드를 구현해 ‘4D 낸드’로 이름 붙였다(96단).', 'In 2018 SK hynix put the peripheral circuitry under the cell array (PUC) and named the new structure “4D NAND” (96 layers).') },
        { t: B('3-Plug', '3-Plug'), d: B('층을 먼저 쌓고 수직 구멍(플러그)을 뚫어 셀을 한 번에 만든다. 2023년 기준 식각 장치로 한 번에 약 100층만 뚫을 수 있어 300층 이상은 100층씩 3번 플러그를 만들고, 나머지 공정은 모든 층에서 한 번에 진행한다(321단).', 'Layers are stacked first and vertical holes (plugs) etched to form all cells at once. As of 2023 an etcher could cut about 100 layers in one go, so 300+ layers use three plugs of about 100 layers, with the other steps done for all layers at once (321 layers).') },
        { t: 'Sideway Source', d: B('플러그 바닥의 CTF막을 위에서 수직으로 깎는 대신 별도 통로로 식각 가스를 넣어 수평으로 제거한다 — 플러그가 어긋나도 손상이 없다. 238단의 제조 효율을 176단 대비 34% 높였다.', 'Instead of etching the CTF film at the plug bottom from above, etch gas enters through a separate path and removes it sideways, so misaligned plugs are not damaged; it raised 238-layer manufacturing efficiency 34 % over 176 layers.') },
        { t: 'All PUC', d: B('구동 회로를 셀과 같거나 더 작게 미세화해 셀 아래에 모두 넣는다 — 238단 512Gb TLC에서 칩과 구동 회로 크기를 이전 세대보다 30% 이상 줄였다.', 'Shrinks the drive circuitry to cell size or smaller and puts all of it under the array; on 238-layer 512 Gb TLC it cut chip and circuit size by over 30 % versus the previous generation.') },
        { t: 'Advanced CTF', d: B('CTF 물질의 불안정한 영역을 수소로 메워 전자가 빠져나가지 않게 한다 — 176단부터 적용, 전자 수 구분 능력 25% 향상.', 'Fills unstable sites in the charge-trap material with hydrogen so electrons do not escape — used from 176 layers, improving the ability to distinguish electron counts by 25 %.') },
        { t: B('MSC (4D2.0)', 'MSC (4D2.0)'), d: B('셀 하나의 전자 저장 공간을 구조적으로 늘린다 — 6비트(HLC)를 8상태 × 2공간으로 구현. 회사는 MSC를 쓰면 읽기·쓰기 속도가 약 20배 빨라지는 것을 확인했다(원문 각주: 5비트 일반 셀과 ‘2.5비트 × 2.5비트 MSC’ 비교).', 'Adds storage sites inside one cell — 6 bits (HLC) as 8 states × 2 sites. SK hynix measured read/write speeds about 20 times faster with MSC (source footnote: a 5-bit conventional cell versus a “2.5-bit × 2.5-bit MSC”).') },
        { t: B('321단', '321 layers'), d: B('2023년 8월 FMS 2023에서 321단 1Tb TLC 낸드 샘플 공개 — 세계 최초 300단 진입.', 'August 2023, FMS 2023: 321-layer 1 Tb TLC NAND sample shown — the first beyond 300 layers.') }
      ],
      src: ['nrSlc', 'nr4dNand']
    },
    hbm: {
      def: B('여러 개의 D램을 수직으로 연결해 기존 D램보다 데이터 처리 속도를 혁신적으로 끌어올린 고부가가치·고성능 제품 — HBM(1세대) → HBM2 → HBM2E → HBM3 → HBM3E → HBM4(6세대) 순으로 개발됐다(회사 정의). 대역폭은 HBM 패키지 1개가 초당 처리하는 데이터 양이다.', 'A high-value, high-performance product that stacks several DRAM dies vertically to raise data throughput far beyond conventional DRAM — developed as HBM (1st gen) → HBM2 → HBM2E → HBM3 → HBM3E → HBM4 (6th) (company definition). Bandwidth is the data one HBM package handles per second.'),
      defSrc: ['nrHbm4'],
      io: B('와이어로 칩을 쌓으면 데이터 핀이 32개(X32)가 한계였지만, TSV로 쌓은 HBM은 1,024개(X1024)를 구현했다. HBM4는 이를 2,048개로 두 배로 늘려 대역폭을 2배로 키웠다.', 'Wire-bonded stacks top out at 32 data pins (X32); TSV-stacked HBM reached 1,024 (X1024), and HBM4 doubles that to 2,048, doubling bandwidth.'),
      ioSrc: ['nrBeType2', 'nrHbm4'],
      parts: [
        { t: 'TSV', src: ['nrHbm3e12', 'nrTsv', 'nrPkgInt', 'nrWlp'], d: [
          B('D램 칩에 수천 개의 미세한 구멍을 뚫고 위·아래 칩의 구멍을 수직 관통 전극으로 잇는 어드밴스드 패키징 기술(회사 정의). 칩 밖으로 돌아가던 와이어 대신 칩 안을 수직으로 지나 신호 지연과 전력 소모를 줄인다.', 'An advanced packaging technology that drills thousands of fine holes in DRAM dies and links them with vertical through-electrodes (company definition); signals pass straight through the chip instead of detouring by wire, cutting delay and power.'),
          B('SK하이닉스는 2000년대 초부터 TSV와 적층을 포함한 WLP 기술을 연구했고, 2013년 1세대 HBM에 TSV를 적용했다.', 'SK hynix researched TSV and wafer-level packaging including stacking from the early 2000s and applied TSV to the first HBM in 2013.'),
          B('만드는 법(비아 미들): 트랜지스터(FEOL) 뒤 하드 마스크로 패턴 → 실리콘 건식 식각으로 깊은 구멍 → CVD 절연막 → 씨드·배리어 금속 → 구리 전해도금 → CMP로 평탄화 → 배선(BEOL).', 'How (via-middle): after the transistors (FEOL), pattern with a hard mask → dry-etch deep holes in silicon → CVD insulating liner → seed and barrier metal → copper electroplating → CMP → wiring (BEOL).')
        ] },
        { t: B('적층 공정 (KGSD)', 'Stacking flow (KGSD)'), src: ['nrWlp'], d: [
          B('KGSD는 칩을 쌓은 뒤 테스트로 양품임을 확인한 적층 다이로, 대표 제품이 HBM이다. 맨 아래 칩을 베이스 다이(베이스 웨이퍼), 그 위 칩을 코어 다이라 한다.', 'A KGSD (known good stacked die) is a stack verified good by test; HBM is the typical example. The bottom die is the base die (base wafer) and those above are core dies.'),
          B('순서: 앞면 범프 → 캐리어 웨이퍼에 임시 접착(WSS) → 뒷면을 갈아 얇게 → 뒷면 범프 → 코어 웨이퍼는 캐리어를 떼고 절단 → 베이스 웨이퍼 위에 코어 칩을 쌓음(칩 투 웨이퍼) → 웨이퍼 몰딩 → 캐리어 제거 → 목표 두께로 그라인딩 → 절단 → 포장해 고객에게.', 'Order: front bumps → temporary bond to a carrier wafer (WSS) → grind the back thin → back bumps → core wafers are debonded and diced → core dies stacked on the base wafer (chip-to-wafer) → wafer molding → carrier removal → grind to target thickness → dice → pack and ship.'),
          B('캐리어 접합 전에 웨이퍼 가장자리를 미리 잘라 내(에지 트리밍) 얇아진 가장자리가 깨지지 않게 한다. 디본딩에는 열·레이저·화학 용해·기계적 분리 방식이 있다.', 'Edge trimming before carrier bonding keeps the thinned edge from chipping; debonding uses heat, laser, chemical dissolution or mechanical lift-off.')
        ] },
        { t: 'MR-MUF', src: ['nrHbm3e', 'nrHbm3e12', 'nrPkgInt', 'nrBeConv', 'nrWlp'], d: [
          B('반도체 칩을 쌓아 올린 뒤 칩과 칩 사이 회로를 보호하기 위해 액체 형태의 보호재를 공간 사이에 주입하고 굳히는 공정. 칩을 하나씩 쌓을 때마다 필름형 소재를 까는 방식보다 공정이 효율적이고 열 방출에도 효과적이라는 평가(회사 정의).', 'A process that stacks the chips and then injects and cures a liquid protective material between them to protect the circuits; judged more efficient than laying film under each chip as it is stacked, and better for heat dissipation (company definition).'),
          B('이름 풀이: MR(Mass Reflow)은 여러 칩을 올린 뒤 한꺼번에 가열해 솔더를 녹여 붙이는 방식, MUF(Molded Underfill)는 몰딩 재료가 범프 사이까지 채워 언더필 역할을 하는 방식이다.', 'In the name, MR (mass reflow) heats many placed parts at once to melt the solder, and MUF (molded underfill) lets the molding compound fill between bumps as underfill.'),
          B('어드밴스드 MR-MUF: 기존 칩보다 40% 얇은 칩을 휘어짐 없이 쌓는 칩 제어 기술(Warpage Control)과 새 보호재로 방열을 높인 차세대 MR-MUF. 칩을 쌓을 때 가해지는 압력도 줄였다.', 'Advanced MR-MUF: warpage control that stacks chips 40 % thinner without bending, plus a new protective material for better heat dissipation; it also lowers the pressure applied during stacking.'),
          B('적용 이력: 2019년 HBM2E(신뢰성 문제를 넘은 돌파구) → 2023년 12단 HBM3부터 어드밴스드 MR-MUF → HBM3E(방열 10% 향상) → HBM4·HBM4E.', 'History: HBM2E in 2019 (the breakthrough past reliability problems) → Advanced MR-MUF from 12-high HBM3 in 2023 → HBM3E (10 % better heat dissipation) → HBM4 and HBM4E.')
        ] },
        { t: B('2.5D 패키지', '2.5D packaging'), src: ['nrBeType2', 'nrWlp'], d: [
          B('HBM은 완성 패키지가 아닌 ‘반 패키지’ 제품이다. 고객(시스템 업체)이 실리콘 인터포저 위에 GPU 같은 로직 칩과 HBM을 나란히 붙여 2.5D 패키지(SiP)를 만든다. HBM 핀은 약 20µm 마이크로 범프다.', 'HBM is a semi-packaged product: the customer mounts it beside a logic chip such as a GPU on a silicon interposer to form a 2.5D package (SiP). HBM pins are micro-bumps of about 20 µm.'),
          B('인터포저: 마이크로 범프가 너무 많아 일반 기판으로는 받을 수 없어, 웨이퍼 공정으로 만든 배선판에서 로직과 HBM을 잇고 일부 신호만 TSV로 기판에 내보낸다.', 'Interposer: too many micro-bumps for an ordinary substrate, so a wafer-made wiring layer links logic and HBM and passes only some signals down to the substrate through TSVs.'),
          B('방식: CoWoS(TSMC가 개발·특허 — 인터포저 웨이퍼 위에 칩을 먼저 붙임), CoCoS(대부분의 OSAT — 인터포저를 잘라 기판에 붙인 뒤 칩을 붙임).', 'Methods: CoWoS (developed and patented by TSMC — chips first on the interposer wafer) and CoCoS (most OSATs — the interposer is diced and mounted on the substrate first).')
        ] },
        { t: B('하이브리드 본딩', 'Hybrid bonding'), src: ['nrPkgInt', 'nrHybrid'], d: [
          B('칩을 쌓을 때 칩 사이에 범프를 만들지 않고 직접 접합하는 기술. 칩 전체 두께가 얇아져 고단 적층이 가능해 16단 이상 HBM에서 필요성이 검토되고 있으며, SK하이닉스는 어드밴스드 MR-MUF와 하이브리드 본딩을 모두 검토한다고 밝혔다(2024.8).', 'Bonds chips directly without bumps between them, making the stack thinner so more dies fit; its need is being weighed for HBM of 16 or more layers, and SK hynix said (August 2024) it is considering both Advanced MR-MUF and hybrid bonding.'),
          B('외부 칼럼(2026.8) 설명: 유전체와 구리를 함께 맞붙인다. 접속 간격(피치)은 솔더 범프 약 100µm, 마이크로 범프 약 20µm, 구리-구리 하이브리드 본딩은 약 1µm 이하. 웨이퍼 투 웨이퍼(W2W)와 다이 투 웨이퍼(D2W) 방식이 있다.', 'External column (August 2026): dielectric and copper are bonded together. Pitch is about 100 µm for solder bumps, about 20 µm for micro-bumps and about 1 µm or less for Cu–Cu hybrid bonding; there are wafer-to-wafer (W2W) and die-to-wafer (D2W) methods.')
        ] },
        { t: 'iHBM', src: ['nrIhbm'], d: [
          B('2026년 5월 공개: HBM 패키지 안에 일체형 냉각 요소(ICE — 전기는 통하지 않고 열은 잘 전하는 실리콘 소재)를 넣어, 발열이 가장 몰리는 D2D PHY(베이스 다이와 GPU 같은 고속 다이를 잇는 물리 연결부) 영역에 전용 열 배출 경로를 만든다.', 'Unveiled May 2026: integrated cooling elements (ICE — silicon that insulates electrically but conducts heat) inside the HBM package create a dedicated heat path in the D2D PHY region, where heat concentrates (the physical link between the base die and a high-speed die such as a GPU).'),
          B('기존 대비 열저항 30% 이상 감소, 어드밴스드 MR-MUF 기반 WLP 공정으로 생산, HBM5 등 차세대 제품부터 적용 계획.', 'Thermal resistance down by over 30 %, built on the Advanced MR-MUF-based WLP process, planned from next-generation products such as HBM5.')
        ] }
      ],
      /* 연표 — 날짜는 보도자료·인터뷰 원문 */
      timeline: [
        { d: '2013', t: B('HBM 1세대 세계 최초 개발 — TSV 적용, 당시 최고속 그래픽 D램 GDDR5보다 4배 이상 빠르고 전력 소모 40% 낮음', 'First HBM in the world — TSV, over four times faster than GDDR5 with 40 % lower power'), src: ['nrHbm3e12', 'nrPkgInt'] },
        { d: '2019', t: B('HBM2E 개발 — MR-MUF 첫 적용, 이때부터 시장 주도권(회사 설명)', 'HBM2E — first use of MR-MUF; the company dates its market lead from here'), src: ['nrPkgInt'] },
        { d: '2022', t: B('HBM3 업계 최초 양산', 'HBM3 — industry-first mass production'), src: ['nrHbm4s'] },
        { d: '2023', t: B('12단 HBM3 세계 최초 개발·양산 — 어드밴스드 MR-MUF 적용', '12-high HBM3 — world first, with Advanced MR-MUF'), src: ['nrPkgInt'] },
        { d: '2024-03', t: B('HBM3E(8단) 세계 최초 양산, 3월 말 공급 — 초당 최대 1.18TB, 방열 10% 향상', 'HBM3E (8-high) — world-first volume production, shipping from end of March; up to 1.18 TB/s, 10 % better heat dissipation'), src: ['nrHbm3e', 'nrHbm3e12'] },
        { d: '2024-09', t: B('HBM3E 12단 세계 최초 양산 — 36GB, 9.6Gbps, D램 칩을 40% 얇게 해 8단과 같은 두께', 'HBM3E 12-high — world-first volume production; 36 GB, 9.6 Gbps, dies 40 % thinner for the same height as 8-high'), src: ['nrHbm3e12'] },
        { d: '2025-03', t: B('HBM4 12단 샘플 세계 최초 공급 — 처음으로 초당 2TB 이상, 36GB', 'HBM4 12-high samples — world first; first above 2 TB/s, 36 GB'), src: ['nrHbm4s'] },
        { d: '2025-09', t: B('HBM4 개발 완료·세계 최초 양산 체제 — I/O 2,048개, 10Gbps 이상(JEDEC 표준 8Gbps), 전력 효율 40% 이상 향상, 10나노급 5세대(1b) D램과 어드밴스드 MR-MUF', 'HBM4 development done, first volume-production system — 2,048 I/O, over 10 Gbps (JEDEC standard 8 Gbps), power efficiency up over 40 %, 1b DRAM with Advanced MR-MUF'), src: ['nrHbm4'] },
        { d: '2026-05', t: B('iHBM 기술 공개 — 패키지 안 냉각 요소, 열저항 30% 이상 감소', 'iHBM unveiled — in-package cooling, thermal resistance down over 30 %'), src: ['nrIhbm'] },
        { d: '2026-06', t: B('HBM4E 12단 샘플 공급 — 핀당 최대 16Gbps, 48GB, 에너지 효율 20% 이상 개선, 열 저항 HBM4 대비 약 17% 감소', 'HBM4E 12-high samples — up to 16 Gbps per pin, 48 GB, energy efficiency up over 20 %, thermal resistance about 17 % lower than HBM4'), src: ['nrHbm4e'] }
      ]
    },
    /* #37: HBM 다음 — 회사가 발표한 차세대 메모리·시스템 로드맵. st = 단계(원문 표현 기준) */
    road: [
      { id: 'hbf', t: 'HBF (High Bandwidth Flash)', st: B('표준 공개', 'Standard published'), d: '2026-08', what: B('HBM과 SSD 사이에 놓는 새 메모리 계층 — 낸드 다이를 TSV로 쌓아 용량과 대역폭을 함께. 첫 표준: 8단·16단 스택으로 최대 512GB, 대역폭 3등급 약 0.4~3.0TB/s, 프로세서와 UCIe로 연결(샌디스크와 함께 OCP로 공개, 구글·텐스토렌트 참여)', 'A new tier between HBM and SSD — NAND dies stacked with TSVs for both capacity and bandwidth. First standard: up to 512 GB with 8- or 16-high stacks, three bandwidth grades of about 0.4–3.0 TB/s, UCIe link to the processor (published with Sandisk through OCP; Google and Tenstorrent joined)'), src: ['nrHbf26', 'nrOcp26'] },
      { id: 'v10', t: B('10세대(V10) 375단 4D 낸드', '10th-gen (V10) 375-layer 4D NAND'), st: B('개발 중 · 2027년 초 eSSD 양산 착수 계획', 'In development · eSSD production planned from early 2027'), d: '2026-08', what: B('이전 세대보다 전력 대비 성능 2.5배 — 웨이퍼·제품 첫 공개', '2.5× performance per watt over the previous generation — wafer and product first shown'), src: ['nrHbf26'] },
      { id: 'qlc321', t: B('321단 QLC 낸드', '321-layer QLC NAND'), st: B('개발 · 고객 인증 진행', 'Developed · in customer qualification'), d: '2026', what: B('세계 최초 321단 QLC — 고용량 기업용 SSD는 Solidigm과의 통합 시너지로 대응(반기보고서)', 'World’s first 321-layer QLC; high-capacity enterprise SSDs pursued with Solidigm (half-year report)'), src: ['skhH1_2026'] },
      { id: 'lpddr6', t: 'LPDDR6 (1cnm 16Gb)', st: B('개발 완료', 'Developed'), d: '2026', what: B('LPDDR6 세계 첫 제품, 최대 10.7Gbps, LPDDR5X보다 대역폭 33%↑·전력 20%↓ — 2027년 플래그십 모바일 대응(반기보고서)', 'World’s first LPDDR6, up to 10.7 Gbps, 33 % more bandwidth and 20 % less power than LPDDR5X — for 2027 flagship phones (half-year report)'), src: ['skhH1_2026'] },
      { id: 'cmm2', t: B('CMM-DDR5 2세대 (CXL 메모리)', 'CMM-DDR5 gen 2 (CXL memory)'), st: B('전시', 'Exhibited'), d: '2026-10', what: B('CXL 3.2, 256GB, 대역폭 80GB/s(이전 세대의 2배 이상), 에너지 효율 약 30% 개선 — 여러 서버가 메모리 풀을 나눠 쓰는 CXL Pooled. 네이버클라우드와 KV 캐시 공유 등을 PoC로 검증', 'CXL 3.2, 256 GB, 80 GB/s (over twice the previous generation), about 30 % better energy efficiency — pooled so several servers share memory. KV-cache sharing and more proven at PoC level with Naver Cloud'), src: ['nrOcp26'] },
      { id: 'cmmax', t: 'CMM-Ax', st: B('시연 · 논문', 'Demonstrated · paper'), d: '2026-10', what: B('메모리 안에서 직접 연산해 데이터 이동을 줄이는 CXL 메모리 — 긴 문맥 LLM 추론 가속 시연, 연구가 MICRO 2026에 채택', 'CXL memory that computes inside the memory to cut data movement — long-context LLM inference demo; the research was accepted at MICRO 2026'), src: ['nrOcp26'] },
      { id: 'mars', t: B('MARS (메모리 중심 AI 랙 시스템)', 'MARS (memory-centric AI rack system)'), st: B('제안 · 시연', 'Proposed · demonstrated'), d: '2026-10', what: B('CXL로 CPU·GPU를 잇는 랙 단위 메모리 풀링 — 파트너사와 KV 캐시 재사용·응답 지연 개선 데모', 'Rack-level memory pooling linking CPUs and GPUs over CXL — demos with partners on KV-cache reuse and lower response latency'), src: ['nrOcp26'] },
      { id: 'srvdram', t: B('서버 D램 모듈', 'Server DRAM modules'), st: B('전시', 'Exhibited'), d: '2026-10', what: B('192GB SOCAMM2(저전력 D램 기반 AI 서버 모듈), 업계 최대 용량 256GB 3DS RDIMM, 128GB DDR5 MRDIMM', '192 GB SOCAMM2 (low-power DRAM module for AI servers), industry-largest 256 GB 3DS RDIMM, 128 GB DDR5 MRDIMM'), src: ['nrOcp26'] },
      { id: 'cpo', t: 'CPO (Co-Packaged Optics)', st: B('연구 · 로드맵 논문', 'Research · roadmap paper'), d: '2026-08', what: B('광 송수신기를 프로세서와 한 패키지에 넣어 랙·포드 사이를 빛으로 연결. 논문 목표: 노드당 100Tb/s 이상, 1pJ/bit 미만, 칩 간 지연 10ns 미만 — 장기적으로 메모리 인터페이스까지 광 연결(네이처 일렉트로닉스, 대학 연구진과 공동)', 'Optical transceivers in the processor package so racks and pods talk by light. Paper targets: over 100 Tb/s per node, under 1 pJ/bit, under 10 ns chip-to-chip — eventually optical links to memory too (Nature Electronics, with university researchers)'), src: ['nrCpo26'] }
    ]
  };

  /* 6) 반도체 용어 — 위 원문에서 정의를 확인한 것만 (id는 st-…) */
  const t = (id, ko, en, dko, den, src) => ({ id: 'st-' + id, t: B(ko, en), d: B(dko, den), src });
  SHE.SEMI_TERMS = [
    t('feol', 'FEOL', 'FEOL', '전공정 가운데 웨이퍼에 트랜지스터 같은 소자를 새기는 앞단계', 'The part of the front end that forms transistors and other devices in the wafer', ['nrFeOx']),
    t('beol', 'BEOL', 'BEOL', '전공정 가운데 미세한 금속 배선으로 소자를 잇는 뒷단계', 'The part of the front end that wires devices together with fine metal lines', ['nrFeOx', 'nrMetal']),
    t('idm', 'IDM (종합 반도체 회사)', 'IDM (integrated device manufacturer)', '설계부터 웨이퍼 제작·패키지·테스트까지 모두 하는 회사', 'A company that designs, makes wafers, packages and tests in house', ['nrBeTest']),
    t('osat', 'OSAT', 'OSAT', '패키지와 테스트를 대신 해 주는 회사(Out Sourced Assembly and Test)', 'Outsourced assembly and test companies', ['nrBeTest']),
    t('pr', '포토레지스트 (감광액)', 'Photoresist', '빛을 받으면 현상액에 녹는 정도가 바뀌는 물질. 포지티브는 빛 받은 곳이, 네거티브는 빛 받지 않은 곳이 지워진다', 'A material whose solubility in developer changes with light; exposed areas wash away in positive resist, unexposed areas in negative resist', ['nrFePhoto', 'nrBeMat2']),
    t('mask', '포토마스크', 'Photomask', '빛이 지나갈 곳과 막힐 곳을 나눈 판 — 반도체 설계를 담는다', 'A plate that passes or blocks light in the circuit pattern — it carries the chip design', ['nrFePhoto']),
    t('na', '분해능·개구수(NA)', 'Resolution and NA', '노광기가 가까운 두 물체를 구분하는 한계 d = λ/(2NA). 파장을 줄이거나 개구수를 키우면 더 미세하게 그린다', 'The limit d = λ/(2NA) for telling two close features apart; shorter wavelength or larger NA draws finer patterns', ['nrFePhoto']),
    t('euv', 'EUV', 'EUV', '파장 13.5nm 극자외선을 쓰는 노광 — ArF 193nm보다 훨씬 미세한 패턴', 'Lithography with 13.5 nm extreme ultraviolet light, far finer than ArF at 193 nm', ['nrFePhoto']),
    t('imm', 'ArF 액침', 'ArF immersion', '빛의 매질로 공기 대신 물을 써서 개구수를 높인 ArF 노광', 'ArF lithography using water instead of air to raise the numerical aperture', ['nrFePhoto']),
    t('pellicle', '펠리클', 'Pellicle', '노광 중 마스크가 오염되지 않게 씌우는 보호막', 'A protective film that keeps the mask clean during exposure', ['nrFePhoto']),
    t('overlay', '정렬·오버레이', 'Alignment and overlay', '정렬은 앞 공정의 마크로 노광 위치를 맞추는 일, 오버레이는 노광이 얼마나 어긋났는지 재는 마크', 'Alignment positions the exposure using earlier marks; overlay marks measure how far it is off', ['nrFePhoto']),
    t('sel', '선택비', 'Selectivity', '식각에서 지울 물질만 얼마나 잘 지우는지 나타내는 값', 'How well an etch removes only the target material', ['nrFeEtch']),
    t('aniso', '등방성·비등방성', 'Isotropic and anisotropic', '모든 방향으로 깎이면 등방성, 한 방향(수직)으로만 깎이면 비등방성', 'Etching in every direction is isotropic; etching in one (vertical) direction is anisotropic', ['nrFeEtch']),
    t('rie', 'RIE (반응성 이온 식각)', 'RIE (reactive ion etching)', '식각 가스를 플라즈마로 만들어 가속한 양이온과 라디칼로 깎는 건식 식각 — 선택비와 비등방성을 함께 얻는다', 'Dry etching with a plasma whose accelerated ions and radicals give both selectivity and anisotropy', ['nrFeEtch']),
    t('hm', '하드 마스크', 'Hard mask', '감광액보다 단단한 패턴용 막 — 미세 패턴이 무너지지 않게 쓴다', 'A patterning layer harder than resist, used so fine patterns do not collapse', ['nrFeEtch', 'nrWlp']),
    t('ar', '종횡비', 'Aspect ratio', '구조의 깊이(높이)를 폭으로 나눈 값 — 클수록 좁고 깊다', 'Depth (height) divided by width; higher means narrower and deeper', ['nrFeEtch', 'nrDepo']),
    t('sc', '스텝 커버리지', 'Step coverage', '단차 위와 아래·옆에 쌓인 막 두께의 차이 — 1에 가까울수록 고르다', 'The film-thickness ratio between the top and the bottom or sides of a step; closer to 1 is more even', ['nrDepo']),
    t('gapfill', '갭 필', 'Gap fill', '증착으로 빈틈을 얼마나 잘 채우는지 — 나쁘면 공동(Void)이 생긴다', 'How well deposition fills gaps; poor fill leaves voids', ['nrDepo', 'nrMetal']),
    t('cvd', 'CVD', 'CVD', '기체끼리 반응시켜 막을 만드는 화학 기상 증착', 'Chemical vapour deposition — films formed by reacting gases', ['nrDepo']),
    t('pvd', 'PVD·스퍼터링', 'PVD and sputtering', '표적에 이온을 부딪쳐 떨어진 입자를 웨이퍼에 붙이는 물리 기상 증착', 'Physical vapour deposition — ions knock atoms off a target onto the wafer', ['nrDepo', 'nrBeWlp1']),
    t('ald', 'ALD', 'ALD', '전구체 흡착과 반응을 되풀이해 원자 한 층씩 쌓는 증착', 'Atomic layer deposition — one atomic layer per cycle of precursor adsorption and reaction', ['nrDepo', 'nrAld']),
    t('sti', 'STI', 'STI', '소자 경계의 누설 전류를 막는 참호 형태의 절연막', 'Shallow trench isolation — trench-shaped insulation that stops leakage between devices', ['nrDepo']),
    t('hkmg', 'HKMG', 'HKMG', '게이트를 금속으로, 절연막을 고유전체로 바꿔 누설 전류를 줄인 트랜지스터 게이트', 'High-k metal gate — a metal gate on a high-k dielectric that cuts leakage', ['nrFeOx']),
    t('contact', '컨택', 'Contact', '아래 소자와 위 금속 배선을 잇는 연결부', 'The link between a device below and the metal wiring above', ['nrMetal']),
    t('barrier', '배리어 메탈·실리사이드', 'Barrier metal and silicide', '금속과 실리콘의 경계 저항을 낮추고 확산을 막는 금속(Ti·Co·Ta 등). Ti·Co를 실리콘과 반응시킨 것이 실리사이드', 'Metals (Ti, Co, Ta) that lower metal–silicon resistance and block diffusion; silicide is Ti or Co reacted with silicon', ['nrMetal']),
    t('dama', '다마신', 'Damascene', '절연막을 먼저 파내고 구리를 채운 뒤 남는 구리를 갈아 내는 구리 배선 공법', 'Copper wiring made by etching the dielectric, filling with copper and polishing off the excess', ['nrMetal', 'nrFeEtch']),
    t('em', '일렉트로마이그레이션', 'Electromigration', '전류가 흐를 때 전자가 금속 원자를 밀어 자리를 옮기는 현상', 'Electrons in a current displacing metal atoms', ['nrDepo', 'nrMetal']),
    t('implant', '이온주입·채널링', 'Ion implantation and channelling', '불순물을 이온으로 만들어 가속해 웨이퍼에 넣는 도핑. 이온이 결정 사이로 너무 깊이 들어가는 현상이 채널링', 'Doping by accelerating impurity ions into the wafer; channelling is ions slipping too deep between crystal rows', ['nrImplant']),
    t('anneal', '어닐링', 'Annealing', '이온주입으로 흐트러진 결정을 열처리로 되돌리는 공정(빠른 열처리 RTA 포함)', 'Heat treatment that repairs implant damage, including rapid thermal annealing (RTA)', ['nrImplant']),
    t('slurry', 'CMP·슬러리', 'CMP and slurry', '슬러리(연마액)를 뿌린 채 패드로 화학·기계적으로 갈아 평탄화하는 공정', 'Chemical-mechanical polishing with a pad and slurry to planarise the wafer', ['nrCmp']),
    t('epm', 'EPM', 'EPM', '웨이퍼 테스트 첫 단계 — 단위 소자의 전기 특성을 재서 웨이퍼 공정에 피드백', 'First step of wafer test — measures device parameters and feeds them back to the fab', ['nrBeTest']),
    t('probe', '프루브 카드', 'Probe card', '칩 패드에 닿는 탐침과 테스터로 가는 배선을 갖춘 웨이퍼 테스트용 카드', 'A wafer-test card with needles that touch chip pads and wiring to the tester', ['nrBeTest']),
    t('burnin', '번인·TDBI', 'Burn-in and TDBI', '온도·전압 스트레스로 초기 불량을 미리 걸러 내는 시험. 패키지 상태에서 하면 TDBI', 'A temperature and voltage stress test that screens early failures; on packaged parts it is TDBI', ['nrBeTest', 'nrBeRel']),
    t('repair', '리페어 (Redundancy)', 'Repair (redundancy)', '불량 셀이 있는 열·줄을 설계 때 넣어 둔 여분 셀로 바꿔 수율을 높이는 공정', 'Replacing rows or columns with bad cells by spare cells designed in, to raise yield', ['nrBeTest']),
    t('jedec', 'JEDEC', 'JEDEC', '반도체 업계의 국제 표준화 기구 — 신뢰성(JC14)·D램(JC4) 등 위원회가 회사당 한 표로 표준을 정한다', 'The semiconductor standards body; committees such as JC14 (reliability) and JC4 (DRAM) vote one company, one vote', ['nrBeRel', 'nrHbm4']),
    t('htol', 'HTOL', 'HTOL', '고온에서 동작시키며 수명을 보는 대표적 신뢰성 시험', 'High-temperature operating life — the standard lifetime reliability test', ['nrBeRel']),
    t('bg', '백 그라인딩', 'Back grinding', '웨이퍼 뒷면을 갈아 패키지에 맞는 두께로 만드는 공정', 'Grinding the wafer back to the thickness the package needs', ['nrBeConv']),
    t('dicing', '다이싱·DBG', 'Dicing and DBG', '스크라이브 레인을 잘라 칩으로 나누는 공정. DBG는 먼저 일부를 자르고 나서 그라인딩하는 방식', 'Cutting along scribe lanes to separate chips; DBG cuts partway first, then grinds', ['nrBeConv']),
    t('wb', '와이어 본딩', 'Wire bonding', '금 등의 가는 선으로 칩 패드와 기판을 잇는 공정', 'Connecting chip pads to the substrate with fine wire such as gold', ['nrBeConv', 'nrBeMat1']),
    t('fc', '플립칩·범프', 'Flip chip and bumps', '칩 위에 솔더 범프를 만들어 뒤집어 기판에 붙이는 연결 방식', 'Forming solder bumps on the chip and flipping it onto the substrate', ['nrBeType1', 'nrWlp']),
    t('underfill', '언더필 (CUF·MUF·NCF)', 'Underfill (CUF, MUF, NCF)', '범프 사이를 채워 접합부 신뢰성을 높이는 재료 — 본딩 뒤 채우는 CUF·MUF, 미리 바르는 NCP·NCF', 'Material filling the space between bumps for joint reliability — CUF or MUF after bonding, NCP or NCF applied beforehand', ['nrBeConv', 'nrBeMat2']),
    t('emc', 'EMC', 'EMC', '칩을 감싸 보호하는 봉지재 — 열경화성 에폭시와 무기 실리카의 복합 재료', 'Epoxy molding compound — the encapsulant of thermosetting epoxy and inorganic silica', ['nrBeMat1']),
    t('sub', '서브스트레이트·BGA', 'Substrate and BGA', '칩과 PCB를 잇는 다층 배선 기판, 바닥에 솔더 볼을 배열한 패키지가 BGA', 'A multilayer wiring board between chip and PCB; with solder balls underneath the package is a BGA', ['nrBeType1', 'nrBeMat1']),
    t('wlcsp', 'WLCSP (팬인·팬아웃)', 'WLCSP (fan-in, fan-out)', '웨이퍼 상태로 배선과 솔더 볼까지 만드는 패키지 — 볼이 칩 크기 안에 있으면 팬인, 밖까지 있으면 팬아웃', 'A package wired and balled at wafer level — fan-in keeps balls within the chip outline, fan-out extends beyond it', ['nrBeType1', 'nrWlp']),
    t('rdl', 'RDL (재배선)', 'RDL (redistribution layer)', '이미 있는 패드를 금속층을 더해 원하는 위치로 다시 배열하는 기술', 'Adding a metal layer to move existing pads where needed', ['nrBeType1', 'nrWlp']),
    t('ubm', 'UBM', 'UBM', '범프 아래의 금속 박막 — 접착층·전류 공급층·확산 방지층', 'Under-bump metallurgy — adhesion, current-carrying and diffusion-barrier films beneath a bump', ['nrBeWlp1', 'nrWlp']),
    t('ep', '전해도금', 'Electroplating', '용액 속 금속 이온이 음극(웨이퍼)에서 전자를 받아 금속으로 쌓이는 공정', 'Metal ions in solution gain electrons at the cathode (the wafer) and deposit as metal', ['nrBeWlp1', 'nrMetal']),
    t('tsv', 'TSV', 'TSV', 'D램 칩에 수천 개 미세 구멍을 뚫어 위·아래 칩을 수직 관통 전극으로 잇는 어드밴스드 패키징 기술(회사 정의)', 'Thousands of fine holes through DRAM dies linked by vertical through-electrodes (company definition)', ['nrHbm3e12', 'nrTsv']),
    t('kgsd', 'KGSD', 'KGSD', '적층한 뒤 테스트로 양품임을 확인한 적층 다이 — 대표 제품이 HBM', 'Known good stacked die — a stack proven good by test; HBM is the typical example', ['nrWlp']),
    t('wss', 'WSS (캐리어 본딩·디본딩)', 'WSS (carrier bond/debond)', '얇게 간 웨이퍼를 캐리어 웨이퍼에 임시로 붙여 뒷면 공정을 하고 다시 떼는 방식', 'Temporarily bonding a thinned wafer to a carrier for back-side processing, then removing it', ['nrWlp', 'nrBeMat2']),
    t('interposer', '인터포저·2.5D', 'Interposer and 2.5D', 'HBM과 로직 칩을 나란히 올려 잇는 웨이퍼 공정 배선판, 이렇게 만든 패키지가 2.5D 패키지', 'A wafer-made wiring layer on which HBM and logic sit side by side; the result is a 2.5D package', ['nrBeType2', 'nrWlp']),
    t('cowos', 'CoWoS·CoCoS', 'CoWoS and CoCoS', '2.5D 패키지 공정 — CoWoS는 TSMC가 개발한 방식(인터포저 웨이퍼 위에 칩 먼저), CoCoS는 대부분의 OSAT 방식', '2.5D flows — CoWoS was developed by TSMC (chips first on the interposer wafer); CoCoS is used by most OSATs', ['nrWlp']),
    t('sip', 'SiP·SoC·칩렛', 'SiP, SoC and chiplets', 'SoC는 여러 기능을 한 칩에, SiP는 여러 칩을 한 패키지에. 칩렛은 로직을 기능별로 나눠 연결하는 방식', 'An SoC puts functions on one chip, a SiP puts chips in one package; chiplets split logic by function and reconnect it', ['nrBeType2']),
    t('netdie', '넷 다이', 'Net die', '웨이퍼 한 장에서 나오는 칩 수 — 칩이 작아 수가 많을수록 같은 결함에도 수율이 높다', 'Chips per wafer; with smaller, more numerous chips the same defects cost less yield', ['nrBeType2', 'nrBeType1']),
    t('mrmuf', 'MR-MUF', 'MR-MUF', '칩을 쌓은 뒤 칩 사이에 액체 보호재를 주입해 굳히는 SK하이닉스의 HBM 패키징 공정(Mass Reflow Molded Underfill)', 'SK hynix’s HBM packaging process that injects and cures liquid protective material between stacked chips (mass reflow molded underfill)', ['nrHbm3e', 'nrPkgInt']),
    t('amrmuf', '어드밴스드 MR-MUF', 'Advanced MR-MUF', '40% 얇은 칩을 휘어짐 없이 쌓는 제어 기술과 새 보호재로 방열을 높인 차세대 MR-MUF', 'Next-generation MR-MUF with warpage control for 40 % thinner dies and a new material for better heat dissipation', ['nrPkgInt', 'nrHbm3e12']),
    t('hb', '하이브리드 본딩', 'Hybrid bonding', '칩 사이에 범프 없이 직접 접합하는 적층 기술 — 16단 이상 HBM에서 필요성 검토', 'Stacking with direct bonds and no bumps between chips — being weighed for HBM of 16+ layers', ['nrPkgInt']),
    t('bw', '대역폭 (HBM)', 'Bandwidth (HBM)', 'HBM 패키지 1개가 초당 처리할 수 있는 총 데이터 양', 'The total data one HBM package can handle per second', ['nrHbm4']),
    t('io', 'I/O (데이터 전송 통로)', 'I/O (data channels)', '데이터를 동시에 내보내는 통로 수 — HBM3E까지 1,024개, HBM4 2,048개', 'The number of parallel data channels — 1,024 through HBM3E, 2,048 on HBM4', ['nrHbm4', 'nrBeType2']),
    t('1c', '1c (10나노급 6세대)', '1c (6th-gen 10 nm class)', '10나노급 D램 공정의 6세대(1x→1y→1z→1a→1b→1c)', 'The sixth 10 nm-class DRAM node (1x → 1y → 1z → 1a → 1b → 1c)', ['nr1c']),
    t('xlc', 'SLC·MLC·TLC·QLC', 'SLC, MLC, TLC, QLC', '낸드 셀 하나에 저장하는 비트 수 1·2·3·4 — 상태 수 2·4·8·16', 'Bits per NAND cell 1, 2, 3, 4 — states 2, 4, 8, 16', ['nrSlc', 'nr4dNand']),
    t('ctf', 'CTF', 'CTF', '전자를 도체인 플로팅 게이트 대신 부도체(산화막·질화막 복합막)에 저장하는 방식', 'Charge trap flash — storing electrons in an insulating oxide–nitride film instead of a conductive floating gate', ['nr4dNand']),
    t('puc', 'PUC (4D 낸드)', 'PUC (4D NAND)', '셀을 제어하는 주변 회로를 셀 아래에 넣어 면적을 줄이는 구조 — SK하이닉스는 이를 4D 낸드로 이름 붙였다', 'Peripheral circuitry under the cell array to save area — SK hynix calls this 4D NAND', ['nr4dNand']),
    t('wl', '워드 라인·비트 라인', 'Word line and bit line', '워드 라인은 각 층 셀의 컨트롤 게이트를 묶어 전압을 거는 구조, 비트 라인은 셀에 저장된 전자 수를 읽어 내는 통로', 'The word line ties cell control gates to apply voltage; the bit line reads out the stored charge', ['nr4dNand']),
    /* #33(K3) 장비·소재 */
    t('scanner', '노광기 (스캐너)', 'Lithography scanner', '마스크 패턴을 빛으로 웨이퍼에 줄여 찍는 장비 — EUV는 반사 거울로 4배 축소하고, 가장 복잡한 층에만 쓰며 나머지 층은 DUV 장비로 찍는다(ASML 설명)', 'The tool that prints the mask pattern onto the wafer with light — EUV shrinks it 4× with mirrors and is used only for the most intricate layers, the rest being printed on DUV tools (ASML)', ['asmlEuv']),
    t('highna', 'High NA EUV', 'High-NA EUV', 'NA 0.55의 차세대 EUV(ASML EXE) — 기존 EUV(NA 0.33)보다 해상도 8nm, 같은 한 번의 노광으로 1.7배 작은 패턴·2.9배 집적도. SK하이닉스는 2025년 9월 메모리 업계 처음으로 양산용 EXE:5200B를 이천 M16에 들였다', 'Next-generation EUV with NA 0.55 (ASML EXE) — 8 nm resolution, features 1.7× smaller and 2.9× denser in a single exposure than NA 0.33 EUV. SK hynix brought the first production EXE:5200B in the memory industry into Icheon M16 in September 2025', ['asmlExe', 'nrHighNa']),
    t('track', '트랙 (코터·디벨로퍼)', 'Track (coater/developer)', '감광액 도포와 현상을 노광기와 한 줄로 이어 처리하는 장비', 'The system that coats and develops resist inline with the scanner', ['telProducts']),
    t('excimer', '엑시머 레이저 가스', 'Excimer laser gas', 'DUV 노광의 짧은 파장 자외선을 만드는 가스 — 성분의 95%가 네온(공기 중 0.00182%뿐인 희귀 자원)', 'The gas that produces the short-wavelength UV for DUV lithography — 95 % neon, a rare resource making up only 0.00182 % of air', ['nrNeon']),
    t('cryo', '극저온 식각', 'Cryogenic etching', '낮은 온도에서 새 화학 조성으로 고종횡비 구멍을 수직으로 깊게 파는 식각 — 3D 낸드 채널 홀에 쓴다(Lam 설명)', 'Low-temperature etching with new chemistries for deep, vertical high-aspect-ratio holes — used for 3D NAND channel holes (Lam)', ['lamCryo']),
    t('bevel', '베벨 공정', 'Bevel processing', '웨이퍼 가장자리에 쌓인 잔류물을 없애거나 가장자리를 막으로 보호해 결함을 줄이는 식각·증착', 'Etching or deposition at the wafer edge to remove residues or protect it, cutting defects', ['lamEtch']),
    t('prober', '웨이퍼 프로버', 'Wafer prober', '웨이퍼를 옮겨 프루브 카드의 탐침에 칩 패드를 맞대 주는 웨이퍼 테스트 장비 — 테스터와 짝을 이룬다', 'The wafer-test tool that brings chip pads into contact with probe-card needles, working with a tester', ['telProducts', 'nrBeTest']),
    t('ate', '메모리 테스터 (ATE)', 'Memory tester (ATE)', '많은 칩을 동시에 측정하는 자동 테스트 장비 — 메모리는 적은 품종을 대량 생산하므로 병렬 측정 능력이 중요하다', 'Automated test equipment measuring many chips at once — memory is low-mix, high-volume, so parallelism matters', ['advMemTest']),
    t('mo', '몰리브덴(Mo) 배선', 'Molybdenum (Mo) wiring', '텅스텐보다 저항이 낮아 차세대 낸드 전극 소재로 쓰일 금속 — 전구체로 증착하며, SK하이닉스는 전구체 품질 분석 기술을 높였다', 'A metal with lower resistance than tungsten, set to be a next-generation NAND electrode; deposited from precursors, whose quality analysis SK hynix has advanced', ['nrMatAward25', 'lamCryo']),
    t('gamma', '1c와 1-gamma', '1c and 1-gamma', '10나노급 D램 6세대를 SK하이닉스는 1c로, 장비 회사 Lam은 1-gamma로 부른다', 'SK hynix calls the sixth 10 nm-class DRAM generation 1c; the toolmaker Lam calls it 1-gamma', ['nr1c', 'lamDram'])
  ];

  /* 7) 장비·소재·공급망 — #33(K3). 장비 회사는 공식 제품 화면·정부 공시(미국 SEC)만, 점유율 같은 자기 평가는 ‘회사 설명’으로 표시.
     step은 SKH_PROC.steps id(공정 카드에 ‘주요 장비’로 다시 보인다) */
  SHE.SKH_EQ = {
    asof: '2026-10-16',
    map: [
      { step: 'photo', t: B('노광기 (스캐너)', 'Lithography scanner'), d: B('마스크 패턴을 빛으로 웨이퍼에 줄여 찍는다. EUV는 가장 복잡한 층에만, 나머지 층은 여러 DUV 장비로 찍으며 두 기술이 오랫동안 함께 쓰인다.', 'Prints the mask pattern onto the wafer with light. EUV prints only the most intricate layers, the rest go on DUV tools, and both will be used side by side for years.'),
        ex: [['ASML', B('EUV — NXE:3800E·NXE:3600D(NA 0.33), High NA EXE:5000·EXE:5200B(NA 0.55) / DUV 액침 — NXT:2150i·2100i·2050i·2000i·1980Fi / 건식 — ArF NXT:1470·XT:1460K, KrF NXT:870B·XT:1060K, i-line XT:400M', 'EUV — NXE:3800E, NXE:3600D (NA 0.33); High NA EXE:5000, EXE:5200B (NA 0.55) / DUV immersion — NXT:2150i, 2100i, 2050i, 2000i, 1980Fi / dry — ArF NXT:1470, XT:1460K; KrF NXT:870B, XT:1060K; i-line XT:400M')]], src: ['asmlEuv', 'asmlDuv'] },
      { step: 'photo', t: B('트랙 (코터·디벨로퍼)', 'Track (coater/developer)'), d: B('감광액 도포·현상을 노광기와 한 줄로 이어 처리한다.', 'Coats and develops resist inline with the scanner.'),
        ex: [['TEL', B('CLEAN TRACK LITHIUS Pro DICE(High NA를 포함한 EUV 공정), LITHIUS Pro Z(EUV), LITHIUS Pro AP(패키징). 회사 설명: 코터·디벨로퍼 시장 점유율 90%, High NA 공정은 거의 100%', 'CLEAN TRACK LITHIUS Pro DICE (EUV including High NA), LITHIUS Pro Z (EUV), LITHIUS Pro AP (packaging). Company’s statement: 90 % of the coater/developer market and almost 100 % for High NA')]], src: ['telProducts'] },
      { step: 'etch', t: B('플라즈마 식각기', 'Plasma etchers'), d: B('도체(트랜지스터·배선)와 절연막을 깎고, 3D 낸드 채널 홀·TSV 같은 깊은 구멍을 판다.', 'Etch conductors (transistors, wiring) and dielectrics, and cut deep holes such as 3D NAND channel holes and TSVs.'),
        ex: [['Lam Research', B('Akara·Kiyo(도체), Flex(절연막 — ALE·극저온), Vantex(고종횡비 — Sense.i 플랫폼), Lam Cryo 3.0(400단 이상 3D 낸드), Syndion(깊은 식각 — TSV·HBM), Coronus(가장자리). 회사 설명: 모든 주요 메모리 회사가 3D 낸드 채널 홀 식각에 Flex·Vantex를 쓴다', 'Akara, Kiyo (conductor), Flex (dielectric — ALE, cryogenic), Vantex (high aspect ratio — Sense.i), Lam Cryo 3.0 (3D NAND of 400+ layers), Syndion (deep etch — TSV, HBM), Coronus (bevel). Company’s statement: all leading memory makers use Flex and Vantex for 3D NAND channel-hole etch')],
          ['TEL', B('Tactras·Episode UL(플라즈마), Certas LEAGA(가스 화학 식각). 회사 설명: 건식 식각 점유율 2위', 'Tactras, Episode UL (plasma), Certas LEAGA (gas chemical etch). Company’s statement: second-largest share in dry etch')]], src: ['lamEtch', 'lamCryo', 'telProducts'] },
      { step: 'dep', t: B('증착 장비', 'Deposition tools'), d: B('절연막·금속막을 화학·물리 방식으로 입힌다 — PECVD·HDP-CVD·ALD·PVD·배치 열처리.', 'Lay insulating and metal films chemically or physically — PECVD, HDP-CVD, ALD, PVD and batch thermal tools.'),
        ex: [['Lam Research', B('VECTOR(PECVD), Striker(ALD 절연막, HBM), SPEED(HDP-CVD 갭필), ALTUS(텅스텐 ALD·CVD)', 'VECTOR (PECVD), Striker (dielectric ALD, HBM), SPEED (HDP-CVD gap fill), ALTUS (tungsten ALD/CVD)')],
          ['TEL', B('NT333(세미배치 ALD), Trias e+ Ti/TiN(TiCl₄ CVD), Episode 1·2 DMR(매엽), EXIM·LEXIA-EX(PVD)', 'NT333 (semi-batch ALD), Trias e+ Ti/TiN (TiCl₄ CVD), Episode 1/2 DMR (single wafer), EXIM, LEXIA-EX (PVD)')]], src: ['lamDep', 'telProducts'] },
      { step: 'ox', t: B('열처리로 (산화·어닐링)', 'Thermal furnaces (oxidation, anneal)'), d: B('300mm 웨이퍼 여러 장을 한꺼번에 가열하는 배치 장비와 낱장을 빠르게 가열하는 급속 열처리(RTP).', 'Batch tools that heat many 300 mm wafers together, and rapid thermal processing (RTP) for single wafers.'),
        ex: [['TEL', B('TELINDY PLUS·EVAROS·ALPHA-8SE i(배치 열처리), TELINDY PLUS IRad(플라즈마 배치 ALD)', 'TELINDY PLUS, EVAROS, ALPHA-8SE i (batch thermal), TELINDY PLUS IRad (plasma batch ALD)')],
          ['Applied Materials', B('반도체 장비 사업에 급속 열처리 포함(연차보고서)', 'Rapid thermal processing within its semiconductor systems business (annual report)')]], src: ['telProducts', 'amat10k'] },
      { step: 'dope', t: B('이온 주입기', 'Ion implanters'), d: B('불순물 이온을 골라 가속해 웨이퍼에 넣는다 — 전류·에너지 영역별 장비.', 'Select and accelerate dopant ions into the wafer — tools for each current and energy range.'),
        ex: [['Axcelis', B('Purion 계열 — 고전류·중에너지·중전류·고에너지를 한 플랫폼에서, 낱장 처리 최대 시간당 500장, 10nm 이하 공정 대상', 'Purion family — high current, medium energy, medium current and high energy on one platform; single-wafer, up to 500 wafers per hour; for processes at 10 nm or below')],
          ['Applied Materials', B('반도체 장비 사업에 이온주입 포함(연차보고서)', 'Ion implantation within its semiconductor systems business (annual report)')]], src: ['axcelisPurion', 'amat10k'] },
      { step: 'metal', t: B('금속 증착·도금', 'Metal deposition and plating'), d: B('텅스텐·몰리브덴으로 구멍을 채우고, 구리 배선은 전해도금(ECD)으로 채운다.', 'Fill holes with tungsten or molybdenum; copper lines are filled by electroplating (ECD).'),
        ex: [['Lam Research', B('ALTUS(텅스텐), ALTUS Halo(몰리브덴 — D램·3D 낸드), SABRE(구리 다마신 전해도금, HBM)', 'ALTUS (tungsten), ALTUS Halo (molybdenum — DRAM, 3D NAND), SABRE (copper damascene electroplating, HBM)')],
          ['TEL', B('Trias e+ W(텅스텐), EXIM(PVD)', 'Trias e+ W (tungsten), EXIM (PVD)')]], src: ['lamDep', 'lamDram', 'lamCryo', 'telProducts'] },
      { step: 'cmp', t: B('CMP 장비', 'CMP tools'), d: B('슬러리와 패드로 웨이퍼를 평탄하게 간다.', 'Planarise the wafer with slurry and pad.'),
        ex: [['Applied Materials', B('반도체 장비 사업에 CMP 포함(연차보고서). 다른 CMP 장비 회사의 공식 화면은 자동 접속이 막혀 이번에 넣지 않았다', 'CMP within its semiconductor systems business (annual report). Another CMP maker’s official pages refuse automated access, so they are not included this time')]], src: ['amat10k'] },
      { step: 'clean', t: B('세정 장비', 'Cleaning tools'), d: B('낱장(매엽)·배치 습식, 스크러버, 가장자리(베벨) 세정.', 'Single-wafer and batch wet cleaning, scrubbers and bevel cleaning.'),
        ex: [['Lam Research', B('EOS(습식, 낮은 결함), DV-Prime·Da Vinci(습식), Coronus(플라즈마 베벨)', 'EOS (wet, low defectivity), DV-Prime, Da Vinci (wet), Coronus (plasma bevel)')],
          ['TEL', B('CELLESTA-i MD(매엽), EXPEDIUS-i(배치 습식), NS300Z(스크러버), ANTARES(극저온 동역학). 회사 설명: 세정 장비 점유율 2위', 'CELLESTA-i MD (single wafer), EXPEDIUS-i (batch wet), NS300Z (scrubber), ANTARES (cryokinetic). Company’s statement: second-largest share in wafer cleaning')]], src: ['lamClean', 'telProducts'] },
      { step: '', t: B('계측·검사', 'Metrology and inspection'), d: B('패턴 치수·막 두께·층간 정렬(오버레이)을 재고 결함을 찾아 수율을 지킨다.', 'Measure pattern size, film thickness and layer alignment (overlay) and find defects to protect yield.'),
        ex: [['KLA', B('3935·3920 EP(광대역 플라즈마 패턴 결함 검사 — 3920 EP는 3D 낸드·D램 전용 알고리즘), eSL10(전자빔 검사), eDR7xxx(전자빔 리뷰), Archer 800(오버레이 계측)', '3935, 3920 EP (broadband plasma patterned-wafer inspection — 3920 EP has 3D NAND and DRAM algorithms), eSL10 (e-beam inspection), eDR7xxx (e-beam review), Archer 800 (overlay metrology)')],
          ['ASML', B('YieldStar 1385·1390·500(광학 오버레이 계측), HMI eScan 1100(멀티 전자빔 검사)·eScan 600·eP5', 'YieldStar 1385, 1390, 500 (optical overlay metrology), HMI eScan 1100 (multibeam inspection), eScan 600, eP5')]], src: ['klaDefect', 'klaMetro', 'asmlMetro'] },
      { step: '', t: B('웨이퍼 테스트 장비', 'Wafer test equipment'), d: B('프로버가 칩 패드를 탐침에 맞대고, 테스터가 전기 신호로 검사한다. 번인 장비는 온도·전압 스트레스를 준다.', 'The prober brings chip pads to the needles and the tester checks them electrically; burn-in systems apply temperature and voltage stress.'),
        ex: [['TEL', B('Prexa(웨이퍼 프로버 — 어드밴스드 패키징용 KGD), Prexa SDP(낱개 칩 프로버 — 발열 큰 소자 KGD), Cellcia(멀티셀 테스트)', 'Prexa (wafer prober — KGD for advanced packaging), Prexa SDP (singulated-die prober — KGD for high-heat devices), Cellcia (multi-cell test)')],
          ['Advantest', B('메모리 테스터 T5800 계열(T5835·T5830·T5833·T5851)·T5500·T5200, 번인 B6700 계열. 회사 설명: 메모리 양산용으로 병렬 측정 능력이 업계 최고', 'Memory testers T5800 series (T5835, T5830, T5833, T5851), T5500, T5200; burn-in B6700 series. Company’s statement: industry-best parallelism for volume memory production')]], src: ['telProducts', 'advMemTest'] },
      { step: '', t: B('그라인딩·절단', 'Grinding and dicing'), d: B('웨이퍼 뒷면을 갈고 칩으로 자른다 — 얇은 웨이퍼는 DBG·SDBG(절단 먼저).', 'Grind the wafer back and cut it into dies — thin wafers use DBG or SDBG (dicing first).'),
        ex: [['DISCO', B('다이싱 쏘·레이저 쏘·그라인더·폴리셔·웨이퍼 마운터·다이 분리기, DBG/SDBG 해법', 'Dicing saws, laser saws, grinders, polishers, wafer mounters and die separators; DBG/SDBG solutions')]], src: ['discoProducts'] },
      { step: '', t: B('본딩·디본딩 (적층)', 'Bonding and debonding (stacking)'), d: B('얇은 웨이퍼를 캐리어에 임시로 붙였다 떼고(WSS), 웨이퍼끼리 직접 붙인다(하이브리드 본딩).', 'Temporarily bond thin wafers to carriers and release them (WSS), and bond wafers directly (hybrid bonding).'),
        ex: [['TEL', B('Synapse V·Synapse Z Plus(임시 본딩·디본딩), Synapse Si(퓨전·구리 하이브리드 본딩)', 'Synapse V, Synapse Z Plus (temporary bonding and debonding), Synapse Si (fusion and Cu hybrid bonding)')],
          ['Lam Research', B('SABRE 3D(패키징 도금), Syndion(TSV 식각)', 'SABRE 3D (packaging plating), Syndion (TSV etch)')]], src: ['telProducts', 'lamPkg'] }
    ],
    /* 노광 — ASML 공식 화면(사양은 제품 화면의 숫자) */
    litho: {
      rows: [
        ['TWINSCAN NXE:3800E', 'EUV 13.5nm', '0.33', '13nm', B('≥220장 (30 mJ/cm²)', '≥220 (30 mJ/cm²)'), B('2nm 로직·최선단 D램 양산', 'Volume 2 nm logic and leading-edge DRAM')],
        ['TWINSCAN EXE:5200B', 'EUV 13.5nm', '0.55', '8nm', B('≥175장 (50 mJ/cm²)', '≥175 (50 mJ/cm²)'), B('2nm 미만 로직·최선단 D램 양산 — High NA 둘째 모델', 'Volume sub-2 nm logic and leading-edge DRAM — second High-NA model')],
        [B('TWINSCAN NXT:2150i 등', 'TWINSCAN NXT:2150i and others'), B('DUV ArF 액침', 'DUV ArF immersion'), '–', '–', B('최신 NXT 하루 6,000장 넘게', 'Latest NXT over 6,000 per day'), B('첨단 로직·메모리 양산의 주력', 'Workhorse for advanced logic and memory')],
        ['TWINSCAN NXT:870B', B('DUV KrF 건식', 'DUV KrF dry'), '–', '–', B('시간당 400장', '400 per hour'), B('300mm 웨이퍼, 덜 복잡한 층', '300 mm wafers, less critical layers')]
      ],
      head: B(['장비', '빛', 'NA', '해상도', '시간당 웨이퍼', '쓰임'], ['System', 'Light', 'NA', 'Resolution', 'Wafers per hour', 'Use']),
      facts: [
        B('EUV 빛: CO₂ 레이저가 빠르게 떨어지는 주석 방울에 펄스를 두 번 쏴서 만든다 — 초당 최대 5만 번.', 'EUV light: a CO₂ laser fires two pulses at a fast-moving tin droplet — up to 50,000 times a second.'),
        B('EUV는 공기에도 흡수되므로 광원에서 웨이퍼까지 모든 경로가 고진공이고, 렌즈 대신 다층 거울로 마스크 패턴을 4배 줄인다.', 'EUV is absorbed even by air, so the whole path from source to wafer is in high vacuum, and multilayer mirrors instead of lenses shrink the mask pattern 4×.'),
        B('웨이퍼 스테이지는 노광마다 4분의 1나노미터 안으로 위치를 맞추고 초당 2만 번 확인·조정한다.', 'The wafer stage positions each exposure within a quarter of a nanometre, checking and adjusting 20,000 times a second.'),
        B('High NA(EXE): NXE보다 이미지 대비 40% 높고, 한 번의 노광으로 1.7배 작은 패턴과 2.9배 높은 트랜지스터 밀도. 첫 High NA 장비는 2023년 12월 납품.', 'High NA (EXE): 40 % more imaging contrast than NXE; in a single exposure, features 1.7× smaller and transistor density 2.9× higher. The first High-NA system was delivered in December 2023.'),
        B('ASML은 17년 동안 EUV 연구개발에 60억 유로 넘게 투자했고, 광원 기술을 위해 Cymer를 인수했다.', 'ASML invested over €6 billion in EUV R&D over 17 years and acquired Cymer for light-source technology.')
      ],
      skh: [
        { d: '2021-02', t: B('이천 M16 준공 — 회사 최초 EUV 노광 장비 도입, EUV 전용 공간', 'Icheon M16 completed — the company’s first EUV scanners, with dedicated EUV space'), src: ['nrm16'] },
        { d: '2021', t: B('10나노급 4세대(1a) D램에 EUV 첫 도입, 이후 최첨단 D램에 적용 확대', 'EUV first used for 4th-gen 10 nm-class (1a) DRAM, then extended to leading-edge DRAM'), src: ['nrHighNa', 'nrm16'] },
        { d: '2024-08', t: B('1c DDR5 개발 — EUV 공정에 신소재 개발·적용', '1c DDR5 developed — new materials developed for the EUV process'), src: ['nr1c'] },
        { d: '2025-09', t: B('메모리 업계 최초 양산용 High NA EUV(ASML EXE:5200B) 이천 M16 반입 — 기존 EUV 공정 단순화·차세대 메모리 개발 가속 계획', 'First production High-NA EUV in the memory industry (ASML EXE:5200B) moved into Icheon M16 — to simplify EUV processing and speed up next-generation memory'), src: ['nrHighNa'] }
      ],
      src: ['asmlEuv', 'asmlNxe', 'asmlExe', 'asmlDuv']
    },
    /* 장비 회사가 공시한 사실 — Applied Materials 연차보고서(Form 10-K, FY2025) */
    amat: {
      t: B('Applied Materials 반도체 장비 매출의 시장별 비중', 'Applied Materials semiconductor systems revenue by market'),
      rows: [['FY2025', 67, 26, 7], ['FY2024', 68, 28, 4], ['FY2023', 77, 17, 6]],
      note: B('파운드리·로직·기타 / D램 / 낸드(%). 회계연도는 10월 마지막 일요일에 끝난다. 사업 범위: 식각·급속 열처리·증착·CMP·계측과 검사·웨이퍼 패키징·이온주입.', 'Foundry, logic and other / DRAM / NAND (%). The fiscal year ends on the last Sunday in October. Scope: etch, rapid thermal processing, deposition, CMP, metrology and inspection, wafer packaging and ion implantation.'),
      src: ['amat10k']
    },
    /* 소재 국산화·공급망 — 회사 보도자료·인터뷰 */
    mat: [
      { d: '2022-04', t: B('노광 공정에 국산 네온 첫 도입(협력사 TEMC·포스코) — 10월까지 사용량의 40%. 발표 당시 계획: 2024년 100%, 식각용 크립톤·제논은 2023년 6월까지 국산화', 'Domestic neon first used in lithography (with partners TEMC and POSCO) — 40 % of use by October. Plans at the time: 100 % by 2024, krypton and xenon for etching by June 2023'), src: ['nrNeon'] },
      { d: '2023', t: B('100% 수입에 의존하던 EUV 감광액(PR) 국산화 — 2021년부터 SK머티리얼즈 퍼포먼스와 협업. 이 경험으로 소재별 위험도를 산출하는 ‘소재 리스크 지수(mRI)’와 협력사와의 고위험 소재 대응 협의체를 운영', 'EUV photoresist, previously 100 % imported, localised — with SK Materials Performance since 2021. The company then built a material Risk Index (mRI) scoring each material and a high-risk-materials council with suppliers'), src: ['nrMatVp'] },
      { d: '2024', t: B('SiCN CVD 장비·웨이퍼 후면 증착 CVD 장비를 국내 장비사와 함께 개발해 양산에 적용(장비 국산화 공로로 정부 포상)', 'SiCN CVD and wafer-backside CVD tools co-developed with domestic toolmakers and put into production (government award for equipment localisation)'), src: ['nrEquipAward24'] },
      { d: '2025', t: B('디보란(B₂H₆, 증착)·크립톤(Kr, 식각) 고순도 가스 국산화, 노광용 네온 회수·정제 재활용 기술 확보, 어닐링용 중수소(D₂) 공급선 다변화, 차세대 낸드 전극 소재 몰리브덴(Mo) 전구체 품질 분석 고도화', 'High-purity diborane (B₂H₆, deposition) and krypton (Kr, etch) localised; neon recovery and purification for reuse in lithography; deuterium (D₂) for annealing sourced from more suppliers; better quality analysis of molybdenum (Mo) precursors for next-gen NAND electrodes'), src: ['nrMatAward25'] }
    ],
    gas: [
      ['b2h6', B('디보란', 'Diborane'), B('증착', 'Deposition')], ['', B('크립톤·제논', 'Krypton, xenon'), B('식각', 'Etch')],
      ['', B('네온', 'Neon'), B('노광 광원(엑시머 레이저 가스의 95%)', 'Lithography light source (95 % of excimer laser gas)')], ['', B('중수소', 'Deuterium'), B('어닐링(손상된 웨이퍼 열처리 복원)', 'Annealing (heat-repair of damaged wafers)')],
      ['tma', B('트리메틸알루미늄(ALD 전구체)', 'Trimethylaluminium (ALD precursor)'), B('증착(ALD)', 'Deposition (ALD)')], ['w', B('텅스텐', 'Tungsten'), B('금속배선 갭필', 'Metallization gap fill')]
    ],
    /* 설비 자산 — 반기보고서 유형자산(연결, 백만원) */
    ppe: { net: 88889146, mach: 49822399, cip: 20830993, acq: 17595043, acqMach: 6052326, acqCip: 10584315, dep: 7133682, machCost: 158216503, src: ['skhH1_2026'] }
  };
})();

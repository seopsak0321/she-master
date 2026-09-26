/* 안전보건표지 — 산업안전보건법 시행규칙 제38~40조, 별표6(종류·형태)·별표7(용도·설치 장소·형태·색채)·별표8(색도기준)·별표9(기본모형)
   원문 PDF 확인 2026-09-26 (src: lawRuleSigns). 이름·용도·예시는 별표 표기 그대로 옮기고, 영문은 포털 번역.
   ex: 별표7 ‘설치·부착 장소 예시’ — 원문 표에서 칸이 분명히 대응하는 것만 적고, 안내표지는 원문의 예시 칸 정렬이 모호해 싣지 않음.
   iso: 별표6 비고 — 한국산업표준 KS S ISO 7010의 안전표지로 대체할 수 있는 28종 */
window.SHE = window.SHE || {};
(function () {
  const B = (ko, en) => ({ ko, en });
  SHE.SIGN_CATS = {
    ban: { t: B('금지표지', 'Prohibition'), model: 1, shape: 'ban',
      color: B('바탕은 흰색, 기본모형은 빨간색, 관련 부호 및 그림은 검은색', 'White background, red model, black symbol') },
    warn: { t: B('경고표지', 'Warning'), model: 2, shape: 'warn',
      color: B('바탕은 노란색, 기본모형·관련 부호 및 그림은 검은색. 다만 인화성·산화성·폭발성·급성독성·부식성 물질 경고와 발암성·변이원성·생식독성·전신독성·호흡기과민성 물질 경고는 바탕 무색, 기본모형 빨간색(검은색도 가능)', 'Yellow background, black model and symbol. Flammable, oxidising, explosive, acutely toxic and corrosive warnings, and the carcinogen/mutagen/reproductive/systemic/respiratory-sensitiser warning, have no background colour and a red (or black) model') },
    order: { t: B('지시표지', 'Mandatory action'), model: 3, shape: 'order',
      color: B('바탕은 파란색, 관련 그림은 흰색', 'Blue background, white symbol') },
    info: { t: B('안내표지', 'Safe condition (guidance)'), model: 4, shape: 'info',
      color: B('바탕은 흰색·기본모형 및 관련 부호는 녹색, 또는 바탕은 녹색·관련 부호 및 그림은 흰색', 'White background with a green model and symbol, or a green background with a white symbol') },
    entry: { t: B('출입금지표지', 'No-entry notice'), model: 5, shape: 'entry',
      color: B('글자는 흰색 바탕에 흑색, 다음 글자(-○○○제조/사용/보관 중, -석면취급/해체 중, -발암물질 취급 중)는 적색', 'Black text on white; the line “– (substance) being made/used/stored”, “– asbestos being handled/removed” or “– carcinogens in use” in red') }
  };
  const S_ = (no, cat, ko, en, use, ex, iso, chem) => ({ no, cat, t: B(ko, en), use, ex: ex || null, iso: iso || null, chem: !!chem });
  SHE.SIGNS = [
    S_(101, 'ban', '출입금지', 'No entry', B('출입을 통제해야 할 장소', 'Places where entry must be controlled'), B('조립·해체 작업장 입구', 'Entrances to assembly or dismantling work')),
    S_(102, 'ban', '보행금지', 'No walking', B('사람이 걸어 다녀서는 안 될 장소', 'Places people must not walk'), B('중장비 운전 작업장', 'Areas where heavy machinery operates'), 'P004'),
    S_(103, 'ban', '차량통행금지', 'No vehicles', B('제반 운반기기 및 차량의 통행을 금지시켜야 할 장소', 'Places closed to handling equipment and vehicles'), B('집단보행 장소', 'Areas where groups walk'), 'P006'),
    S_(104, 'ban', '사용금지', 'Do not use', B('수리 또는 고장 등으로 만지거나 작동시키는 것을 금지해야 할 기계·기구 및 설비', 'Machines and equipment that must not be touched or operated, e.g. under repair or faulty'), B('고장난 기계', 'Broken machines')),
    S_(105, 'ban', '탑승금지', 'No riding', B('엘리베이터 등에 타는 것이나 어떤 장소에 올라가는 것을 금지', 'No riding in lifts or climbing onto a place'), B('고장난 엘리베이터', 'Broken lifts')),
    S_(106, 'ban', '금연', 'No smoking', B('담배를 피워서는 안 될 장소', 'Places where smoking is not allowed'), null, 'P002'),
    S_(107, 'ban', '화기금지', 'No open flames', B('화재가 발생할 염려가 있는 장소로서 화기 취급을 금지하는 장소', 'Places at risk of fire where open flames are banned'), B('화학물질취급 장소', 'Chemical handling areas'), 'P003'),
    S_(108, 'ban', '물체이동금지', 'Do not move', B('정리 정돈 상태의 물체나 움직여서는 안 될 물체를 보존하기 위하여 필요한 장소', 'Places where arranged objects, or objects that must not be moved, need to stay put'), B('절전스위치 옆', 'Next to power-saving switches')),
    S_(201, 'warn', '인화성물질 경고', 'Flammable substances', B('휘발유 등 화기의 취급을 극히 주의해야 하는 물질이 있는 장소', 'Places with substances such as petrol that demand great care with fire'), B('휘발유 저장탱크', 'Petrol storage tanks'), null, true),
    S_(202, 'warn', '산화성물질 경고', 'Oxidising substances', B('가열·압축하거나 강산·알칼리 등을 첨가하면 강한 산화성을 띠는 물질이 있는 장소', 'Places with substances that become strongly oxidising when heated, compressed or mixed with strong acids or alkalis'), B('질산 저장탱크', 'Nitric-acid storage tanks'), null, true),
    S_(203, 'warn', '폭발성물질 경고', 'Explosive substances', B('폭발성 물질이 있는 장소', 'Places with explosive substances'), B('폭발물 저장실', 'Explosives stores'), null, true),
    S_(204, 'warn', '급성독성물질 경고', 'Acutely toxic substances', B('급성독성 물질이 있는 장소', 'Places with acutely toxic substances'), B('농약 제조·보관소', 'Pesticide production and storage'), null, true),
    S_(205, 'warn', '부식성물질 경고', 'Corrosive substances', B('신체나 물체를 부식시키는 물질이 있는 장소', 'Places with substances that corrode the body or materials'), B('황산 저장소', 'Sulfuric-acid stores'), null, true),
    S_(206, 'warn', '방사성물질 경고', 'Radioactive material', B('방사능물질이 있는 장소', 'Places with radioactive material'), B('방사성 동위원소 사용실', 'Radioisotope rooms'), 'W003, W005, W027'),
    S_(207, 'warn', '고압전기 경고', 'High voltage', B('발전소나 고전압이 흐르는 장소', 'Power stations and places with high voltage'), B('감전우려지역 입구', 'Entrances to shock-risk areas'), 'W012'),
    S_(208, 'warn', '매달린 물체 경고', 'Overhead loads', B('머리 위에 크레인 등과 같이 매달린 물체가 있는 장소', 'Places with suspended loads overhead, e.g. cranes'), B('크레인이 있는 작업장 입구', 'Entrances to areas with cranes'), 'W015'),
    S_(209, 'warn', '낙하물 경고', 'Falling objects', B('돌 및 블록 등 떨어질 우려가 있는 물체가 있는 장소', 'Places where stones, blocks and the like may fall'), B('비계 설치장소 입구', 'Entrances to scaffolded areas'), 'W035'),
    S_(210, 'warn', '고온 경고', 'Hot', B('고도의 열을 발하는 물체 또는 온도가 아주 높은 장소', 'Very hot objects or places'), B('주물작업장 입구', 'Foundry entrances'), 'W017'),
    S_(211, 'warn', '저온 경고', 'Cold', B('아주 차가운 물체 또는 온도가 아주 낮은 장소', 'Very cold objects or places'), B('냉동작업장 입구', 'Freezer-work entrances'), 'W010'),
    S_(212, 'warn', '몸균형 상실 경고', 'Loss of balance', B('미끄러운 장소 등 넘어지기 쉬운 장소', 'Slippery or otherwise trip-prone places'), B('경사진 통로 입구', 'Entrances to sloping walkways'), 'W011'),
    S_(213, 'warn', '레이저광선 경고', 'Laser', B('레이저광선에 노출될 우려가 있는 장소', 'Places with possible laser exposure'), B('레이저실험실 입구', 'Laser-lab entrances'), 'W004'),
    S_(214, 'warn', '발암성·변이원성·생식독성·전신독성·호흡기과민성 물질 경고', 'Carcinogenic, mutagenic, reproductive-toxic, systemic-toxic or respiratory-sensitising substances', B('발암성·변이원성·생식독성·전신독성·호흡기과민성 물질이 있는 장소', 'Places with such substances'), B('납 분진 발생장소', 'Places where lead dust arises'), null, true),
    S_(215, 'warn', '위험장소 경고', 'General danger', B('그 밖에 위험한 물체 또는 그 물체가 있는 장소', 'Other dangerous objects or places'), B('맨홀 앞 고열금속찌꺼기 폐기장소', 'Hot-slag disposal points in front of manholes'), 'W001'),
    S_(301, 'order', '보안경 착용', 'Wear eye protection', B('보안경을 착용해야만 작업 또는 출입을 할 수 있는 장소', 'Places that require eye protection'), B('그라인더작업장 입구', 'Grinding-shop entrances'), 'M004'),
    S_(302, 'order', '방독마스크 착용', 'Wear a gas mask', B('방독마스크를 착용해야만 작업 또는 출입을 할 수 있는 장소', 'Places that require a gas mask'), B('유해물질작업장 입구', 'Entrances to hazardous-substance work'), 'M017'),
    S_(303, 'order', '방진마스크 착용', 'Wear a dust mask', B('방진마스크를 착용해야만 작업 또는 출입을 할 수 있는 장소', 'Places that require a dust mask'), B('분진이 많은 곳', 'Dusty places'), 'M016'),
    S_(304, 'order', '보안면 착용', 'Wear a face shield', B('보안면을 착용해야만 작업 또는 출입을 할 수 있는 장소', 'Places that require a face shield'), B('용접실 입구', 'Welding-room entrances'), 'M019'),
    S_(305, 'order', '안전모 착용', 'Wear a hard hat', B('헬멧 등 안전모를 착용해야만 작업 또는 출입을 할 수 있는 장소', 'Places that require a hard hat'), B('갱도의 입구', 'Tunnel entrances'), 'M014'),
    S_(306, 'order', '귀마개 착용', 'Wear ear protection', B('소음장소 등 귀마개를 착용해야만 작업 또는 출입을 할 수 있는 장소', 'Noisy places that require ear protection'), B('판금작업장 입구', 'Sheet-metal shop entrances'), 'M003'),
    S_(307, 'order', '안전화 착용', 'Wear safety shoes', B('안전화를 착용해야만 작업 또는 출입을 할 수 있는 장소', 'Places that require safety shoes'), B('채탄작업장 입구', 'Coal-face entrances'), 'M008'),
    S_(308, 'order', '안전장갑 착용', 'Wear safety gloves', B('안전장갑을 착용해야 작업 또는 출입을 할 수 있는 장소', 'Places that require safety gloves'), B('고온 및 저온물 취급작업장 입구', 'Entrances to hot- or cold-material handling'), 'M009'),
    S_(309, 'order', '안전복 착용', 'Wear protective clothing', B('방열복 및 방한복 등의 안전복을 착용해야만 작업 또는 출입을 할 수 있는 장소', 'Places that require protective clothing such as heat- or cold-protective suits'), B('단조작업장 입구', 'Forge entrances'), 'M010'),
    S_(401, 'info', '녹십자표지', 'Green cross', B('안전의식을 북돋우기 위하여 필요한 장소', 'Places where safety awareness should be promoted')),
    S_(402, 'info', '응급구호표지', 'First aid', B('응급구호설비가 있는 장소', 'Places with first-aid equipment'), null, 'E003'),
    S_(403, 'info', '들것', 'Stretcher', B('구호를 위한 들것이 있는 장소', 'Places with a rescue stretcher'), null, 'E013'),
    S_(404, 'info', '세안장치', 'Eyewash', B('세안장치가 있는 장소', 'Places with an eyewash'), null, 'E011'),
    S_(405, 'info', '비상용기구', 'Emergency equipment', B('비상용기구가 있는 장소', 'Places with emergency equipment')),
    S_(406, 'info', '비상구', 'Emergency exit', B('비상출입구', 'Emergency exits'), null, 'E001, E002'),
    S_(407, 'info', '좌측비상구', 'Emergency exit (left)', B('비상구가 좌측에 있음을 알려야 하는 장소', 'Places that must show the exit is to the left'), null, 'E001'),
    S_(408, 'info', '우측비상구', 'Emergency exit (right)', B('비상구가 우측에 있음을 알려야 하는 장소', 'Places that must show the exit is to the right'), null, 'E002'),
    S_(501, 'entry', '허가대상유해물질 취급', 'Licensed hazardous substances', B('허가대상유해물질 제조, 사용 작업장', 'Workplaces making or using licensed hazardous substances'), B('출입구 (실외 또는 출입구가 없을 때는 근로자가 보기 쉬운 장소)', 'The entrance (outdoors or without an entrance: where workers can easily see it)')),
    S_(502, 'entry', '석면취급 및 해체·제거', 'Asbestos handling and removal', B('석면 제조, 사용, 해체·제거 작업장', 'Workplaces making, using, dismantling or removing asbestos'), B('출입구 (실외 또는 출입구가 없을 때는 근로자가 보기 쉬운 장소)', 'The entrance (outdoors or without an entrance: where workers can easily see it)')),
    S_(503, 'entry', '금지유해물질 취급', 'Prohibited hazardous substances', B('금지유해물질 제조·사용설비가 설치된 장소', 'Places with equipment making or using prohibited hazardous substances'), B('출입구 (실외 또는 출입구가 없을 때는 근로자가 보기 쉬운 장소)', 'The entrance (outdoors or without an entrance: where workers can easily see it)'))
  ];
  /* 별표8 색도기준 — 먼셀 표기(허용 오차 H±2, V±0.3, C±1). hex는 화면 표시용 근삿값이며 기준이 아님 */
  SHE.SIGN_COLORS = [
    { k: B('빨간색', 'Red'), m: '7.5R 4/14', hex: '#C8102E', use: B('금지 — 정지신호, 소화설비 및 그 장소, 유해행위의 금지 / 경고 — 화학물질 취급장소에서의 유해·위험 경고', 'Prohibition — stop signals, fire equipment and its location, forbidden acts / Warning — hazards where chemicals are handled') },
    { k: B('노란색', 'Yellow'), m: '5Y 8.5/12', hex: '#F2C500', use: B('경고 — 화학물질 취급장소에서의 유해·위험경고 이외의 위험경고, 주의표지 또는 기계방호물', 'Warning — hazards other than chemical ones, caution signs, machine guards') },
    { k: B('파란색', 'Blue'), m: '2.5PB 4/10', hex: '#1F5AA6', use: B('지시 — 특정 행위의 지시 및 사실의 고지', 'Mandatory — instructions to do something, and notices of fact') },
    { k: B('녹색', 'Green'), m: '2.5G 4/10', hex: '#00875A', use: B('안내 — 비상구 및 피난소, 사람 또는 차량의 통행표지', 'Guidance — emergency exits and refuges, pedestrian and vehicle routes') },
    { k: B('흰색', 'White'), m: 'N9.5', hex: '#F7F7F7', use: B('파란색 또는 녹색에 대한 보조색', 'Contrast colour for blue or green') },
    { k: B('검은색', 'Black'), m: 'N0.5', hex: '#1A1A1A', use: B('문자 및 빨간색 또는 노란색에 대한 보조색', 'Text, and contrast colour for red or yellow') }
  ];
})();

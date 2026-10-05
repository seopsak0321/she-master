/* SHE 가이드북 — 분야·사업장·나라를 아우르는 안전보건 교과서 (라이브러리 #book)
   구조: 편(part) → 장(ch) → 절(sec). 절이 읽기·선택·모아 보기·PDF의 단위이고 고유 주소 #book/<절 id>를 가진다.
   규칙(GUIDEBOOK.md): 사실이 담긴 블록마다 src(출처 id), 원문을 직접 읽은 절만 공개(st 'ok' + checked),
   작성자가 비교·요약한 부분은 k:'syn'(정리)로 따로 표시, 확인하지 못한 칸은 추정하지 않고 '확인 중'.
   블록: p 문단 · h 소제목 · ul/ol 목록 · tbl 표(cmp: 나라별 비교) · syn 정리 · note 유의 · q 학습 확인 · go 포털 연결 · plan 전체 목차표
   본문 안 {{절 id}}는 그 절의 번호 링크로 바뀐다. 계획만 있는 장은 plan: 'G1' 처럼 단계만 적는다. */
window.SHE = window.SHE || {};
(function () {
  const S = window.SHE;
  const B = (ko, en) => ({ ko, en });
  const D = '2026-10-01', D3 = '2026-10-03';   /* D3: 일본 조문을 e-Gov 현행본으로 다시 대조한 날 */

  S.BOOK_ASOF = '2026-10-05';   /* 가장 최근 원문 확인일(자료 라이브러리의 CSB·일본·영국·EU·OSHA 자료 포함, #qa가 대조) — 절·자료마다 자기 확인일을 따로 표시한다 */
  /* 나라·법역 — 1차 비교 대상 (2차: 독일·싱가포르·호주·캐나다·중국·대만) */
  S.BOOK_CTY = {
    INT: B('국제(ILO)', 'International (ILO)'), KR: B('한국', 'Korea'), US: B('미국', 'United States'),
    UK: B('영국(GB)', 'UK (Great Britain)'), EU: B('EU', 'EU'), JP: B('일본', 'Japan')
  };
  S.BOOK_FIELD = { about: B('가이드북 안내', 'About the book'), base: B('기초 원리', 'Foundations'), law: B('법·제도', 'Law and policy') };
  S.BOOK_LV = { intro: B('입문', 'Introductory'), prac: B('실무', 'Practitioner'), adv: B('심화', 'Advanced') };
  S.BOOK_STAGE = {
    G1: B('G1 — 1편 완성', 'G1 — finish Part 1'), G2: B('G2 — 2편 비교 축', 'G2 — Part 2 comparison axes'),
    G3: B('G3 — 위험 분야 6개', 'G3 — six hazard areas'), G4: B('G4 — 사업장·사고 사례', 'G4 — workplaces and cases'),
    G5: B('G5 — 보건·비상·조사', 'G5 — health, emergency, investigation'), G6: B('G6~ — 이어서 넓히기', 'G6+ — further expansion')
  };

  const plan = (stage, list) => list.map(([id, ko, en]) => ({ id, t: B(ko, en), plan: stage }));

  S.BOOK = [
    /* ================= 0편 ================= */
    { id: 'p0', no: '0', t: B('이 가이드북에 대하여', 'About this guidebook'),
      d: B('무엇을 목표로 하고, 어떤 원칙으로 쓰며, 어떻게 읽고 골라 PDF로 내보내는지.', 'What the book aims at, the rules it is written by, and how to read, select and export it.'),
      ch: [
        { id: 'c0-1', t: B('가이드북 안내', 'Guide to the guidebook'), sec: [
          { id: 'about', t: B('목적과 독자', 'Purpose and readers'), cty: [], fld: ['about'], lv: 'intro', st: 'ok', checked: D, meta: true,
            sum: B(['안전보건을 공부하는 학생, 현장 실무자, 가르치는 사람이 함께 기준으로 삼을 수 있는 안전보건 교과서를 목표로 합니다.',
              '모든 사실 서술에는 원문 출처와 확인일을 붙이고, 원문을 직접 읽어 확인한 절만 공개합니다.',
              '같은 주제를 나라별로 나란히 놓고 공통점과 차이점을 정리합니다.',
              '수많은 물질 정보와 기준값 목록은 옮겨 적지 않고 공식 데이터베이스로 연결합니다.'],
            ['A safety and health textbook that students, practitioners and teachers can all use as a common reference.',
              'Every factual statement carries its original source and the date it was checked; only sections read against the originals are published.',
              'Each topic is laid out country by country, with the common ground and the differences spelled out.',
              'Long substance data and limit-value lists are not copied; the book links to the official databases instead.']),
            body: [
              { k: 'tbl', head: B(['독자', '필요한 것', '이 가이드북에서'], ['Reader', 'Needs', 'What the book offers']), rows: [
                [B('학생(대학·자격시험)', 'Students (university, certification)'), B('개념과 원리, 체계적인 순서', 'Concepts, principles and a clear order'), B('기초 → 법·제도 → 분야별 순서의 목차, 절마다 핵심 요약과 학습 확인', 'Contents running from foundations to law to hazard areas, with a key summary and review questions in each section')],
                [B('실무자(안전·보건관리자, 엔지니어)', 'Practitioners (safety and health managers, engineers)'), B('지금 적용할 기준과 절차', 'Rules and procedures to apply now'), B('근거 조문과 판·시행일, 포털의 판정 도구·SOP 연결', 'The articles behind each rule with version and date, and links to the portal’s tools and SOPs')],
                [B('교육자(교수·사내 강사)', 'Teachers (lecturers, in-house trainers)'), B('믿을 수 있는 교재, 필요한 부분만 묶기', 'Trustworthy material, only the parts needed'), B('절 단위로 골라 모아 보기와 PDF, 출처 목록 자동 첨부', 'Pick sections, read them together and save them as a PDF with the source list attached')],
                [B('다국적 사업장 담당자', 'Staff at multinational sites'), B('나라별 차이', 'Differences between countries'), B('같은 주제의 나라별 비교 표, 각국 공식 원문 링크', 'Country comparison tables and links to each official original')]
              ] },
              { k: 'p', t: B('**1판의 범위** — 1판(2026-10-01)은 모든 분야에 공통인 원리(위험성평가, 예방의 원칙)와 법 체계(ILO와 한국·미국·영국·EU·일본)에서 시작합니다. 분야별·사업장별 장과 다른 나라는 원문을 확인하는 대로 더해 가며, 전체 계획은 {{plan}}에 있습니다.',
                '**Scope of the first edition** — the first edition (2026-10-01) starts with the principles common to every field (risk assessment, principles of prevention) and the legal frameworks of the ILO, Korea, the US, the UK, the EU and Japan. Chapters on hazard areas and workplaces, and more countries, are added as their originals are checked; the full plan is in {{plan}}.') },
              { k: 'note', t: B('이 가이드북은 개인이 공개 원문을 읽고 정리한 교육 자료이며, 정부나 기관의 공식 해석이 아닙니다. 법령은 개정되므로 실제 업무에 적용하기 전에 각 절의 출처 링크에서 현행본을 확인하세요.',
                'This guidebook is teaching material written by an individual from public originals; it is not an official interpretation by any government or body. Laws change, so check the current text through each section’s source links before applying it at work.') }
            ] },
          { id: 'trust', t: B('신뢰성 원칙과 출처 등급', 'Reliability rules and source tiers'), cty: [], fld: ['about'], lv: 'intro', st: 'ok', checked: D, meta: true,
            sum: B(['법령·조약·국제협약 원문을 가장 먼저 쓰고, 정부기관 지침과 공식 통계·조사보고서로 보충합니다.',
              '블로그, 백과사전, 출처 없는 요약, AI가 만든 문장은 쓰지 않습니다.',
              '작성자가 원문을 비교해 요약한 부분은 ‘정리’로 따로 표시합니다.',
              '원문을 확인하지 못한 칸은 추정으로 채우지 않고 ‘확인 중’으로 둡니다.'],
            ['Statutes, treaties and international conventions come first; government guidance and official statistics or investigation reports add to them.',
              'Blogs, encyclopaedias, unsourced summaries and AI-generated text are never used.',
              'Comparisons and summaries written by the author are marked “Synthesis”.',
              'Cells whose original has not been checked are marked “Being checked”, never filled by guesswork.']),
            body: [
              { k: 'tbl', head: B(['등급', '종류', '예'], ['Tier', 'Kind', 'Examples']), rows: [
                ['1', B('법령·조약·국제협약 원문', 'Original statutes, treaties and conventions'), B('국가법령정보센터, EUR-Lex, legislation.gov.uk, OSH Act·eCFR, 일본 법령 공식 번역, ILO NORMLEX', 'Korea’s National Law Information Center, EUR-Lex, legislation.gov.uk, the OSH Act and eCFR, Japan’s official law translations, ILO NORMLEX')],
                ['2', B('정부·공공기관의 공식 지침·고시·기술기준', 'Official guidance, notices and technical codes of public bodies'), B('고용노동부 고시, KOSHA GUIDE, OSHA·NIOSH, HSE, EU-OSHA', 'MOEL notices, KOSHA Guides, OSHA and NIOSH, HSE, EU-OSHA')],
                ['3', B('공식 통계·사고조사 보고서', 'Official statistics and investigation reports'), B('고용노동부 재해조사보고서, 미국 CSB, HSE 통계', 'MOEL accident investigation reports, the US CSB, HSE statistics')],
                ['4', B('기업·단체의 공식 공개 자료', 'Official publications of companies and associations'), B('지속가능경영보고서, 표준기구가 공개한 요약(ISO·NFPA 등)', 'Sustainability reports, summaries published by standards bodies (ISO, NFPA and others)')],
                ['×', B('쓰지 않음', 'Not used'), B('블로그, 백과사전, 출처 없는 요약, AI가 만든 문장, 원 보도자료 없이 기사에만 있는 수치', 'Blogs, encyclopaedias, unsourced summaries, AI-generated text, figures found only in news articles')]
              ] },
              { k: 'h', t: B('화면의 표시', 'Labels used in the book') },
              { k: 'tbl', head: B(['표시', '뜻'], ['Label', 'Meaning']), rows: [
                [B('원문 확인 + 날짜', 'Checked + date'), B('작성자가 원문을 직접 읽고 그 날짜에 확인한 절', 'A section the author read against the originals on that date')],
                [B('정리', 'Synthesis'), B('작성자가 여러 원문을 비교하거나 요약한 부분. 근거가 된 원문 번호를 함께 붙입니다', 'A comparison or summary written by the author, with the numbers of the originals it rests on')],
                [B('확인 중', 'Being checked'), B('원문을 아직 확인하지 못한 칸. 추정해서 채우지 않습니다', 'A cell whose original has not been read yet; it is never filled by guesswork')],
                [B('준비 중', 'Planned'), B('목차 계획에만 있고 아직 쓰지 않은 장', 'A chapter that so far exists only in the contents plan')],
                [B('[번호]', '[number]'), B('포털 출처 목록의 번호. 누르면 ‘출처·검증’ 화면에서 원문 주소와 확인일을 봅니다', 'The number in the portal’s source list; click it to see the original address and the date checked')]
              ] },
              { k: 'h', t: B('쓰는 규칙', 'Writing rules') },
              { k: 'ul', t: B(['법령은 판까지 적습니다 — 법률 번호, 시행일, 고시 번호.',
                '외국 법령은 원어 원문이나 정부 공식 번역을 읽고 뜻을 옮기며, 핵심 표현은 원어를 함께 적습니다(예: so far as is reasonably practicable). 공식 번역을 쓴 경우 그 번역이 반영한 개정 시점을 밝히고, 원어 현행본과 다시 대조합니다.',
                '유료 표준(ISO 45001, NFPA, SEMI S2 등)은 본문을 옮기지 않고, 표준기구가 공개한 요약만 씁니다.',
                '원문 문장은 짧게만 인용하고, 표는 다시 정리한 뒤 출처를 붙입니다.',
                '기준끼리 다르면 둘 다 적고 어느 쪽을 따랐는지 밝힙니다.'],
              ['Laws are cited with their version — act number, date in force, notice number.',
                'Foreign laws are read in the original or an official government translation, and key terms keep their original wording (e.g. so far as is reasonably practicable). Where an official translation is used, the amendment it reflects is stated and the text is re-checked against the current original.',
                'Paid standards (ISO 45001, NFPA, SEMI S2 and others) are not reproduced; only the summaries the standards bodies publish are used.',
                'Original wording is quoted only briefly; tables are redrawn and sourced.',
                'Where two references disagree, both are given and the one followed is named.']) },
              { k: 'h', t: B('한 절을 공개하기까지', 'Before a section is published') },
              { k: 'ol', t: B(['원문 수집(1·2등급)', '사실 추출과 기록 — 원문 문장, 조항, 확인일', '집필 — 블록마다 출처', '교차 확인 — 다른 원문·공식 번역과 대조, 숫자는 두 번', '자동 점검 — 포털 자체 점검으로 출처·확인일·영문·링크·표기', '공개', '매월 다시 확인 — 법령 변경 점검과 함께'],
                ['Collect the originals (tiers 1 and 2)', 'Extract and log the facts — original wording, provision, date checked', 'Write — a source on every block', 'Cross-check — against other originals and official translations; numbers twice', 'Automatic checks — the portal self-check for sources, dates, English, links and typography', 'Publish', 'Re-check every month — together with the law-change check']) }
            ] },
          { id: 'use', t: B('읽는 법 — 찾기, 고르기, 모아 보기, PDF', 'How to use — find, select, collect, PDF'), cty: [], fld: ['about'], lv: 'intro', st: 'ok', checked: D, meta: true,
            sum: B(['목차는 편 → 장 → 절의 3단계이고, 절이 읽기·선택·PDF의 단위입니다.',
              '검색창과 나라·분야·수준 칩으로 목차를 좁힙니다.',
              '절마다 체크 상자로 골라 ‘모아 보기’로 한 화면에서 읽고, ‘PDF로 저장’으로 내보냅니다.'],
            ['The contents have three levels — part, chapter and section; the section is the unit you read, select and export.',
              'Narrow the contents with the search box and the country, field and level chips.',
              'Tick sections, read them together in “Read selected”, and export them with “Save as PDF”.']),
            body: [
              { k: 'ol', t: B(['목차에서 편·장을 펼치고 절 제목을 누르면 그 절이 열립니다. 절 번호(예: 1.2.1)는 편.장.절 순서입니다.',
                '목차 위 검색창에 낱말을 넣으면 제목이나 본문에 그 낱말이 있는 절만 남고, 맞는 곳을 강조합니다. 포털 상단 검색에서도 가이드북 절을 찾습니다.',
                '나라·분야·수준 칩을 누르면 그 조건에 맞는 절만 보입니다.',
                '절 왼쪽 체크 상자로 고릅니다. 장이나 편의 체크 상자는 그 아래 공개된 절을 모두 고르거나 해제합니다. 절 화면에도 ‘이 절 고르기’가 있습니다.',
                '‘고른 절 모아 보기’는 고른 절을 목차 순서대로 한 화면에 보여 줍니다.',
                '‘PDF로 저장’은 표지, 목차, 본문, 출처 목록(주소·확인일)을 담은 인쇄 문서를 엽니다. 인쇄 창에서 대상을 ‘PDF로 저장’으로 고르면 PDF 파일이 됩니다.',
                '절마다 고유 주소(#book/절 id)가 있어 수업 자료나 사내 교육 자료에 그대로 걸 수 있습니다.',
                '‘카테고리로 찾기’ 탭은 교과서 절과 법령·지침·선례·데이터를 한 목록으로 모은 자료 라이브러리입니다. 자료 유형·나라·연도·산업·위험 요인·관리 주제·출처 등급의 7개 대분류에서 소분류를 체크하면, 같은 대분류 안은 ‘또는’, 대분류끼리는 ‘그리고’로 거릅니다. 고른 조건은 주소에 남아 링크로 나눌 수 있고, 결과에서 체크한 자료는 교과서 절과 함께 모아 보기·PDF로 묶입니다.'],
              ['Open a part and chapter in the contents and click a section title. Section numbers (e.g. 1.2.1) read part.chapter.section.',
                'Type in the search box above the contents to keep only sections whose title or text contains the words; matches are highlighted. The portal’s top search also finds guidebook sections.',
                'Click a country, field or level chip to see only the sections that match.',
                'Tick the box to the left of a section. A chapter or part box ticks or clears every published section under it. Each section page also has “Select this section”.',
                '“Read selected” shows the ticked sections on one page, in contents order.',
                '“Save as PDF” opens a print document with a cover, contents, the sections and a source list with addresses and dates. Choose “Save as PDF” as the printer in the print dialog.',
                'Every section has its own address (#book/section-id), so it can be linked from course or training material.',
                'The “Find by category” tab is the resource library: guidebook sections plus laws, guidance, precedents and data in one list. Tick values in seven groups — type, country, year, industry, hazard, management topic and source tier; values in one group combine with “or”, groups with “and”. The filters stay in the address so they can be shared as a link, and ticked results join guidebook sections in the collected view and the PDF.']) },
              { k: 'note', t: B('고른 절 목록은 이 브라우저에만 저장되고 어디로도 보내지 않습니다. 다른 기기에서는 새로 골라야 합니다.', 'Your selection is stored only in this browser and is never sent anywhere; on another device, select again.') }
            ] },
          { id: 'plan', t: B('전체 목차 계획과 진행 현황', 'Contents plan and progress'), cty: [], fld: ['about'], lv: 'intro', st: 'ok', checked: D, meta: true,
            sum: B(['0편부터 10편과 부록까지 전체 목차를 먼저 정하고, 원문을 확인한 절부터 채웁니다.',
              '1차 비교 대상은 국제(ILO), 한국, 미국, 영국, EU, 일본이고, 독일·싱가포르·호주·캐나다·중국·대만이 뒤를 잇습니다.',
              '목차의 ‘준비 중’ 장은 계획만 있는 곳이며, 옆의 단계(G1~G6)에서 채울 예정입니다.'],
            ['The full contents, from Part 0 to Part 10 and the appendix, were set first; sections are filled in as their originals are checked.',
              'The first comparison set is international (ILO), Korea, the US, the UK, the EU and Japan; Germany, Singapore, Australia, Canada, China and Taiwan come next.',
              'Chapters marked “Planned” exist only in the plan; the stage beside them (G1 to G6) says when they are due.']),
            body: [
              { k: 'plan' },
              { k: 'h', t: B('단계', 'Phases') },
              { k: 'tbl', head: B(['단계', '내용', '완료 기준'], ['Phase', 'Content', 'Done when']), rows: [
                [B('G0 (2026-10-01)', 'G0 (2026-10-01)'), B('가이드북 틀(목차·검색·필터·선택·모아 보기·PDF), 0편, 1편 위험성평가·예방 원칙, 2편 국제 기준·법 체계·일반 의무', 'The book’s framework (contents, search, filters, selection, collected view, PDF), Part 0, Part 1 risk assessment and prevention principles, Part 2 international standards, frameworks and general duties'), B('원문 확인 절만 공개, 자체 점검 0건', 'Only checked sections published; zero self-check issues')],
                ['G1', B('1편 나머지(개념·용어, 사고 이론·인적 요인, 근로자 참여, 안전문화, 성과 측정), 일본 위험성평가 지침 원문', 'The rest of Part 1 (concepts and terms, accident theory and human factors, worker participation, safety culture, performance measures), Japan’s risk-assessment guideline'), B('1편 완성', 'Part 1 complete')],
                ['G2', B('2편 비교 축 전부(관리체제·교육·재해 보고·감독·도급·중대재해) × 1차 6개 법역', 'Every Part 2 comparison axis (organisation, training, reporting, inspection, contracting, serious accidents) for the six first-wave jurisdictions'), B('비교 표에 근거 없는 빈칸 없음', 'No unexplained blanks in the comparison tables')],
                ['G3', B('4편 위험 분야 — 화학·가스·밀폐공간·추락·화재·전기를 포털에서 검증한 내용으로 교과서 체계에 맞게', 'Part 4 hazard areas — chemicals, gases, confined spaces, falls, fire and electricity, rebuilt from content already verified in the portal'), B('분야 6개', 'Six areas')],
                ['G4', B('5편 반도체·화학·건설 사업장, 8편 공식 조사보고서 사고 사례', 'Part 5 semiconductor, chemical and construction workplaces; Part 8 cases from official investigation reports'), B('사업장 3개, 사례 10건', 'Three workplaces, ten cases')],
                ['G5', B('6·7편 산업보건, 비상대응, 사고조사', 'Parts 6 and 7 — occupational health, emergency response, investigation'), B('두 편 완성', 'Both parts complete')],
                ['G6~', B('2차 나라 추가, 나머지 분야·사업장, 3편·9편·10편, 부록', 'Second-wave countries, remaining areas and workplaces, Parts 3, 9 and 10, appendix'), B('매달 이어서', 'Monthly, ongoing')]
              ] },
              { k: 'h', t: B('비교할 나라의 순서', 'Order of countries') },
              { k: 'tbl', head: B(['차수', '나라·지역', '고른 이유'], ['Wave', 'Countries and regions', 'Why']), rows: [
                [B('1차', 'First'), B('국제(ILO), 한국, 미국, 영국, EU, 일본', 'International (ILO), Korea, the US, the UK, the EU, Japan'), B('주요 법 체계, 공식 원문과 영어 접근성', 'Major legal systems; official originals accessible in English')],
                [B('2차', 'Second'), B('독일, 싱가포르, 호주, 캐나다, 중국, 대만', 'Germany, Singapore, Australia, Canada, China, Taiwan'), B('반도체·제조 거점, 서로 다른 제도 설계', 'Semiconductor and manufacturing hubs; different system designs')],
                [B('3차', 'Third'), B('프랑스, 네덜란드, 인도, 베트남, 말레이시아, 미국 주(州) 제도 등', 'France, the Netherlands, India, Viet Nam, Malaysia, US state plans and others'), B('공급망·사업장이 넓어지는 순서', 'Following the spread of supply chains and sites')]
              ] }
            ] }
        ] }
      ] },

    /* ================= 1편 ================= */
    { id: 'p1', no: '1', t: B('안전보건의 기초', 'Foundations of safety and health'),
      d: B('모든 분야·사업장·나라에 공통인 원리 — 위험성평가, 예방의 원칙과 대책의 위계, 사고 이론, 안전문화.', 'Principles shared by every field, workplace and country — risk assessment, prevention principles and the hierarchy of controls, accident theory, safety culture.'),
      ch: [
        ...plan('G1', [['c1-1', '기본 개념과 용어', 'Basic concepts and terms']]),
        { id: 'c1-2', t: B('위험성평가', 'Risk assessment'), sec: [
          { id: 'ra-basics', t: B('위험성평가의 뜻과 절차', 'What risk assessment is and how it runs'), cty: ['KR', 'EU', 'UK'], fld: ['base'], lv: 'intro', st: 'ok', checked: D,
            sum: B(['위험성평가는 유해·위험요인을 파악하고, 위험성이 허용 가능한 수준인지 결정한 뒤, 위험성을 낮추는 대책을 세워 실행하는 과정입니다.',
              '한국 고시는 사전준비 → 유해·위험요인 파악 → 위험성 결정 → 감소대책 수립·실행 → 기록·보존의 절차를 정합니다.',
              '판단 기준과 허용 가능한 위험성 수준은 평가 전에 정하고, 해당 작업 근로자를 단계마다 참여시킵니다.',
              'EU와 영국도 사용자가 위험을 평가하고 그 결과로 필요한 조치를 정하도록 요구합니다.'],
            ['Risk assessment is the process of identifying hazards, deciding whether the risk is at a tolerable level, and setting and carrying out measures to reduce it.',
              'Korea’s notice lays down the steps: preparation → hazard identification → risk determination → planning and carrying out reduction measures → recording and keeping results.',
              'The criteria and the tolerable level are fixed before the assessment, and the workers doing the job take part at each step.',
              'The EU and the UK likewise require employers to assess risks and decide the measures needed from the result.']),
            body: [
              { k: 'h', t: B('핵심 용어 — 한국 고시 제3조', 'Key terms — Korean notice Art. 3') },
              { k: 'tbl', cap: B('고용노동부고시 제2024-76호 제3조① 1~3호', 'MOEL Notice No. 2024-76, Art. 3(1) items 1–3 (English by the guidebook)'), head: B(['용어', '정의'], ['Term', 'Definition']), rows: [
                [B('유해·위험요인', 'Hazard'), B('유해·위험을 일으킬 잠재적 가능성이 있는 것의 고유한 특징이나 속성', 'The inherent feature or property of something that has the potential to cause harm or danger')],
                [B('위험성', 'Risk'), B('유해·위험요인이 사망, 부상 또는 질병으로 이어질 수 있는 가능성과 중대성 등을 고려한 위험의 정도', 'The degree of danger, taking into account how likely and how severe it is that a hazard leads to death, injury or illness')],
                [B('위험성평가', 'Risk assessment'), B('사업주가 스스로 유해·위험요인을 파악하고 위험성 수준을 결정하여, 위험성을 낮추기 위한 적절한 조치를 마련하고 실행하는 과정', 'The process in which the employer itself identifies hazards, determines the level of risk, and prepares and carries out appropriate measures to reduce it')]
              ], src: ['moelRa'] },
              { k: 'h', t: B('절차 — 고시 제8조~제12조', 'Steps — notice Arts. 8–12') },
              { k: 'ol', t: B(['**사전준비** — 최초 평가 때 평가의 목적·방법, 담당자·책임자의 역할, 시기·절차, 근로자 참여·공유 방법, 기록·보존을 담은 실시규정을 작성합니다(제9조①). 평가 전에 위험성 수준을 판단하는 기준과 허용 가능한 위험성 수준을 정하며, 허용 수준은 법에서 정한 기준 이상으로 정해야 합니다(제9조②).',
                '**유해·위험요인 파악** — 사업장의 유해·위험요인을 찾습니다(제10조). 작업표준, MSDS, 공정 흐름, 도급 작업과의 혼재 작업, 재해 사례·통계, 작업환경측정·건강진단 결과 같은 안전보건정보를 미리 조사해 쓸 수 있습니다(제9조③).',
                '**위험성 결정** — 파악한 유해·위험요인에 근로자가 노출될 때의 위험성을 미리 정한 기준으로 판단하고, 그 수준이 허용 가능한지 결정합니다(제11조).',
                '**감소대책 수립·실행** — 허용할 수 없는 위험성은 위험성의 수준, 영향을 받는 근로자 수와 대책의 우선순위({{hoc}})를 고려해 줄이는 대책을 세워 실행합니다(제12조).',
                '**기록·보존** — 실시 내용과 결과를 기록해 보존합니다(법 제36조⑤, 고시 제8조 6호). 보존 기간은 시행규칙 제37조②가 정하며(3년), 실시 시기별 평가를 완료한 날부터 셉니다(고시 제14조②).'],
              ['**Preparation** — at the first assessment, write implementation rules covering purpose and method, roles, timing and procedure, how workers take part and are informed, and record keeping (Art. 9(1)). Before assessing, fix the criteria for judging risk levels and the tolerable level, which must be set at least as strictly as the legal standards (Art. 9(2)).',
                '**Hazard identification** — find the hazards in the workplace (Art. 10). Safety and health information gathered beforehand can be used: work standards, MSDSs, process flow, work done alongside contractors, accident cases and statistics, and workplace monitoring and health check results (Art. 9(3)).',
                '**Risk determination** — judge the risk of workers being exposed to each hazard against the preset criteria, and decide whether it is tolerable (Art. 11).',
                '**Reduction measures** — for risks that are not tolerable, plan and carry out measures taking into account the level of risk, the number of workers affected and the order of priority of measures ({{hoc}}) (Art. 12).',
                '**Records** — record and keep what was done and the results (Act Art. 36(5); notice Art. 8 item 6). Rule Art. 37(2) sets the retention period (3 years), counted from the day each assessment is completed (notice Art. 14(2)).']), src: ['moelRa', 'lawAct', 'lawRule'] },
              { k: 'p', t: B('상시근로자 5명 미만 사업장(건설공사는 1억원 미만)은 사전준비 절차를 생략할 수 있습니다(제8조 단서).',
                'Workplaces with fewer than five regular workers (construction work under KRW 100 million) may skip the preparation step (Art. 8, proviso).'), src: ['moelRa'] },
              { k: 'p', t: B('**근로자 참여** — 해당 작업에 종사하는 근로자는 ① 판단 기준과 허용 가능한 위험성 수준을 정하거나 바꿀 때 ② 유해·위험요인을 파악할 때 ③ 허용 가능 여부를 결정할 때 ④ 감소대책을 세워 실행할 때 ⑤ 실행 여부를 확인할 때 참여시켜야 합니다(고시 제6조, 법 제36조②).',
                '**Worker participation** — workers doing the job must take part when (1) the criteria and tolerable levels are set or changed, (2) hazards are identified, (3) tolerability is decided, (4) reduction measures are planned and carried out, and (5) their implementation is checked (notice Art. 6; Act Art. 36(2)).'), src: ['moelRa', 'lawAct'] },
              { k: 'h', t: B('다른 법역의 같은 의무', 'The same duty elsewhere') },
              { k: 'ul', t: B(['**EU** — 사용자는 작업장비, 화학물질, 작업장 설비의 선택 등에서 근로자의 안전·보건에 대한 위험을 평가해야 하고, 평가 뒤의 예방 조치와 작업·생산 방법은 보호 수준을 높이며 모든 활동과 모든 계층에 통합되어야 합니다(지침 89/391/EEC Art.6(3)(a)). 사용자는 위험성평가를 갖추고 있어야 합니다(Art.9(1)(a)).',
                '**영국(GB)** — 모든 사용자는 근로자와 자신이 고용하지 않은 사람에 대한 위험을 ‘적합하고 충분하게(suitable and sufficient)’ 평가해, 법이 요구하는 조치를 파악해야 합니다(MHSWR 1999 reg.3(1)). 평가가 더는 유효하지 않다고 의심되거나 관련 사항이 크게 바뀌면 다시 검토합니다(reg.3(3)).',
                '나라별 의무의 강도, 근로자 참여, 기록 기준의 비교는 {{ra-law}}에 있습니다.'],
              ['**EU** — the employer must evaluate the risks to workers’ safety and health, including in the choice of work equipment, chemical substances and the fitting-out of workplaces; the preventive measures and working and production methods that follow must raise the level of protection and be integrated into all activities and at all levels (Directive 89/391/EEC Art. 6(3)(a)). The employer must be in possession of an assessment of the risks (Art. 9(1)(a)).',
                '**UK (Great Britain)** — every employer must make a “suitable and sufficient” assessment of the risks to its employees and to people not in its employment, to identify the measures it needs to comply with the law (MHSWR 1999 reg. 3(1)), and review it if there is reason to suspect it is no longer valid or there has been a significant change (reg. 3(3)).',
                'How strong the duty is in each country, worker participation and record rules are compared in {{ra-law}}.']), src: ['eu89391', 'ukMhswr'] },
              { k: 'go', items: [['#risk', B('위험성평가 워크벤치 — 평가표 작성과 대책의 위계', 'Risk assessment workbench — worksheet and hierarchy of controls')]] },
              { k: 'q', t: B(['한국 고시가 정한 위험성평가 절차 다섯 단계를 순서대로 말해 보세요.',
                '허용 가능한 위험성 수준은 언제 정해야 하고, 어떤 조건을 지켜야 합니까?',
                '영국 MHSWR reg.3이 평가에 포함하라고 한 두 집단은 누구입니까?'],
              ['Name the five steps of Korea’s risk assessment procedure in order.',
                'When must the tolerable level of risk be fixed, and what condition must it meet?',
                'Which two groups of people does MHSWR reg. 3 require the assessment to cover?']) }
            ] },
          { id: 'ra-law', t: B('위험성평가 의무 — 나라별 비교', 'The duty to assess risks — country comparison'), cty: ['KR', 'US', 'UK', 'EU', 'JP'], fld: ['base', 'law'], lv: 'prac', st: 'ok', checked: D3,
            sum: B(['한국·영국·EU는 위험성평가를 모든 사용자의 의무로 정합니다.',
              '일본은 일반적인 위험성·유해성 조사와 조치를 노력의무로 두고, 지정 화학물질 등의 조사는 의무로 둡니다.',
              '미국 연방 OSHA는 일반의무조항과 개별 기준(예: 보호구가 필요한 위해의 평가)으로 접근하며, 위험 식별·평가를 담은 사업장 프로그램은 의무가 아닌 권고로 안내합니다.',
              '기록 기준이 다릅니다 — 한국은 모든 사업장(3년 보존), 영국은 근로자 5명 이상, EU는 회원국이 활동 성격과 규모에 따라 정합니다.'],
            ['Korea, the UK and the EU make risk assessment a duty of every employer.',
              'Japan makes the general assessment of danger or harm, and the measures that follow, an effort duty, but assessment of designated chemicals is mandatory.',
              'US federal OSHA works through the general duty clause and specific standards (e.g. assessing hazards that require PPE); a workplace program built on hazard identification and assessment is recommended, not required.',
              'Record rules differ — every workplace in Korea (kept 3 years), employers with five or more employees in the UK, and in the EU as each Member State decides by the nature and size of the activity.']),
            body: [
              { k: 'tbl', cmp: true, head: B(['법역', '근거', '의무의 성격', '근로자 참여', '기록·검토'], ['Jurisdiction', 'Basis', 'Nature of the duty', 'Worker involvement', 'Records and review']), rows: [
                ['@KR', B('산업안전보건법 제36조, 고용노동부고시 제2024-76호', 'OSH Act Art. 36; MOEL Notice No. 2024-76'), B('모든 사업주의 의무(제36조①)', 'Duty of every employer (Art. 36(1))'), B('근로자 참여(②), 근로자대표가 요구하면 참여(③, 2026.6.1 시행), 결과를 근로자에게 알림(④)', 'Workers take part (2); the workers’ representative takes part on request (3, from 2026-06-01); results made known to workers (4)'), B('결과 기록·보존(⑤), 시행규칙 제37조②: 3년', 'Results recorded and kept (5); Rule Art. 37(2): 3 years')],
                ['@EU', B('지침 89/391/EEC Art.6(3)(a), 9, 11', 'Directive 89/391/EEC Arts. 6(3)(a), 9, 11'), B('모든 사용자의 의무, 회원국이 국내법으로 이행', 'Duty of every employer, implemented through national law'), B('근로자 대표가 위험성평가 등 Art.9(1)의 정보에 관해 균형 있게 참여하거나 미리 협의받음(Art.11(2)(c))', 'Workers’ representatives take part in a balanced way, or are consulted in advance, on the information in Art. 9(1), including the risk assessment (Art. 11(2)(c))'), B('평가를 갖출 의무(Art.9(1)(a)), 문서 의무의 범위는 회원국이 활동의 성격과 규모에 따라 정함(Art.9(2))', 'Must possess an assessment (Art. 9(1)(a)); Member States set the documentation duties by the nature of the activities and size of the undertaking (Art. 9(2))')],
                ['@UK', B('MHSWR 1999 reg.3 — HSWA 1974가 준 권한으로 제정', 'MHSWR 1999 reg. 3, made under powers in HSWA 1974'), B('모든 사용자의 의무, ‘적합하고 충분한’ 평가', 'Duty of every employer; a “suitable and sufficient” assessment'), B('확인 중 — 이 절에서는 위험성평가 단계의 참여 규정을 아직 확인하지 않음', 'Being checked — participation rules specific to the assessment not yet read'), B('근로자 5명 이상이면 중요한 발견 사항 기록(reg.3(6)), 유효성이 의심되거나 크게 바뀌면 검토(reg.3(3))', 'Record the significant findings if five or more employees (reg. 3(6)); review when no longer valid or after significant change (reg. 3(3))')],
                ['@US', B('OSH Act SEC.5(a)(1) 일반의무조항, 29 CFR 1910.132(d) 등 개별 기준', 'OSH Act SEC. 5(a)(1) general duty clause; specific standards such as 29 CFR 1910.132(d)'), B('개별 기준이 정한 평가는 의무(예: 보호구가 필요한 위해의 평가). 위험 식별·평가를 포함한 사업장 프로그램은 OSHA 권고로, 갖추지 않았다고 위반 처분되지 않음', 'Assessments required by a standard are mandatory (e.g. assessing hazards that call for PPE). A program including hazard identification and assessment is an OSHA recommendation; employers are not cited for lacking one'), B('권고 실무의 7개 핵심 요소 중 하나가 근로자 참여', 'Worker participation is one of the seven core elements of the Recommended Practices'), B('1910.132(d)(2): 평가를 했음을 서면으로 인증(작업장, 평가자, 날짜)', '1910.132(d)(2): written certification that the assessment was done (workplace, person, date)')],
                ['@JP', B('労働安全衛生法 第28条の2, 第57条の3', 'Industrial Safety and Health Act Arts. 28-2 and 57-3'), B('일반 조사와 조치는 노력의무(努めなければならない) — 화학물질 이외의 조사는 제조업 등 성령이 정한 업종에 한정. 지정 화학물질·통지대상물의 조사는 의무(第57条の3①), 그 결과에 따른 조치는 노력의무(②)', 'The general assessment and measures are an effort duty (“must endeavor”), limited to manufacturing and other designated industries for non-chemical hazards. Assessment of designated chemicals and notifiable substances is mandatory (Art. 57-3(1)); measures based on it are an effort duty (2)'), B('확인 중', 'Being checked'), B('확인 중', 'Being checked')]
              ], src: ['lawAct', 'lawRule', 'moelRa', 'eu89391', 'ukMhswr', 'oshAct', 'cfr1910_132', 'oshaRp', 'jpIshl', 'jpIshlEn'] },
              { k: 'note', t: B('일본 조문은 e-Gov 법령검색의 현행본(令和7年法律第33号 반영, 2026.10.1 시행 단계)으로 대조했습니다. 영어 표현(must endeavor 등)은 법무성 공식 번역을 참고했는데, 이 번역은 2018년 개정까지만 반영해 그 뒤 바뀐 조문은 현행본을 따랐습니다.',
                'The Japanese articles were compared with the current text on e-Gov (including Act No. 33 of 2025, stage in force 2026-10-01). English wording such as “must endeavor” follows the Ministry of Justice’s official translation, which reflects amendments only up to 2018, so later changes follow the current text.'), src: ['jpIshl', 'jpIshlEn'] },
              { k: 'syn', t: B([
                '**공통점** — 다섯 법역 모두 위험을 찾아 평가하고 그 결과로 대책을 정하는 구조를 둡니다(한국 제36조①, EU Art.6(3)(a), 영국 reg.3(1), 일본 第28条の2·第57条の3, 미국 1910.132(d)와 OSHA 권고).',
                '**공통점** — 평가는 한 번으로 끝나지 않습니다. 영국은 유효성이 의심되거나 크게 바뀌면 검토하고(reg.3(3)), EU는 상황 변화에 맞춰 조치를 조정하게 하며(Art.6(1)), 한국 고시는 설비·원재료 도입·변경 등이 있으면 수시평가를 하게 합니다(제15조②).',
                '**차이점** — 의무의 강도: 한국·영국·EU는 의무, 일본은 일반 조사가 노력의무(화학물질 조사는 의무), 미국은 개별 기준별 의무와 권고 프로그램입니다.',
                '**차이점** — 기록: 한국은 모든 사업장(3년), 영국은 근로자 5명 이상, EU는 회원국이 정하고, 미국은 기준마다(예: 보호구 평가의 서면 인증) 다릅니다.',
                '**차이점** — 근로자 참여: 한국은 고시가 위험성평가의 단계마다 참여를 정하고, EU는 근로자 대표의 참여·사전 협의 대상에 위험성평가 정보를 넣었습니다.'],
              ['**Common ground** — all five set up the same structure: find and evaluate risks, then decide measures from the result (Korea Art. 36(1), EU Art. 6(3)(a), UK reg. 3(1), Japan Arts. 28-2 and 57-3, US 1910.132(d) and the OSHA recommendations).',
                '**Common ground** — an assessment is never one-off. The UK reviews it when it may no longer be valid or things change significantly (reg. 3(3)); the EU requires measures to be adjusted to changing circumstances (Art. 6(1)); Korea’s notice requires ad-hoc assessments when equipment or materials are introduced or changed (Art. 15(2)).',
                '**Difference** — strength of the duty: mandatory in Korea, the UK and the EU; an effort duty for Japan’s general assessment (mandatory for chemicals); in the US, mandatory per standard plus a recommended program.',
                '**Difference** — records: every workplace in Korea (3 years), five or more employees in the UK, set by Member States in the EU, and standard by standard in the US (e.g. written certification of the PPE assessment).',
                '**Difference** — worker involvement: Korea’s notice sets participation at each step of the assessment; the EU names the risk-assessment information among the matters on which workers’ representatives take part or are consulted in advance.']), src: ['lawAct', 'moelRa', 'eu89391', 'ukMhswr', 'jpIshl', 'cfr1910_132', 'oshaRp'] },
              { k: 'q', t: B(['일본 第28条の2와 第57条の3은 의무의 강도가 어떻게 다릅니까?', '영국에서 위험성평가의 중요한 발견 사항을 기록해야 하는 사용자는 누구입니까?', '미국에서 OSHA 권고 실무에 맞는 프로그램이 없으면 위반 처분을 받습니까? 근거 문서는 무엇입니까?'],
                ['How does the strength of the duty differ between Japan’s Article 28-2 and Article 57-3?', 'In Great Britain, which employers must record the significant findings of their risk assessment?', 'Can a US employer be cited for not having a program that follows OSHA’s Recommended Practices? Which document says so?']) }
            ] }
        ] },
        { id: 'c1-3', t: B('예방의 원칙과 대책의 위계', 'Principles of prevention and the hierarchy of controls'), sec: [
          { id: 'prev-principles', t: B('예방의 일반원칙 — EU 기본지침, 영국, ILO', 'General principles of prevention — EU Framework Directive, UK and ILO'), cty: ['EU', 'UK', 'INT'], fld: ['base'], lv: 'intro', st: 'ok', checked: D,
            sum: B(['EU 기본지침은 사용자가 조치를 할 때 바탕으로 삼을 아홉 가지 예방의 일반원칙을 정합니다(Art.6(2)).',
              '영국 MHSWR은 같은 아홉 원칙을 부록 1(Schedule 1)에 두고, 예방·보호 조치를 이 원칙에 따라 하도록 합니다(reg.4).',
              'ILO C187은 국가 정책의 기본 원칙으로 위험의 평가, 근원에서의 대처, 예방 문화를 듭니다(Art.3(3)).'],
            ['The EU Framework Directive sets nine general principles of prevention on which employers base their measures (Art. 6(2)).',
              'The UK MHSWR puts the same nine principles in Schedule 1 and requires preventive and protective measures to follow them (reg. 4).',
              'ILO C187 names assessing risks, combating them at source and a preventative culture as basic principles of national policy (Art. 3(3)).']),
            body: [
              { k: 'tbl', cap: B('지침 89/391/EEC Art.6(2) — 영국 MHSWR Schedule 1에 같은 문구', 'Directive 89/391/EEC Art. 6(2) — the same wording in UK MHSWR Schedule 1'), head: B(['기호', '원칙'], ['Item', 'Principle']), rows: [
                ['(a)', B('위험을 피한다 (avoiding risks)', 'Avoiding risks')],
                ['(b)', B('피할 수 없는 위험을 평가한다 (evaluating the risks which cannot be avoided)', 'Evaluating the risks which cannot be avoided')],
                ['(c)', B('위험을 근원에서 다스린다 (combating the risks at source)', 'Combating the risks at source')],
                ['(d)', B('작업을 사람에게 맞춘다 — 작업장 설계, 작업장비와 작업·생산 방법의 선택에서. 특히 단조로운 작업과 정해진 속도의 작업을 줄이고 그 건강 영향을 낮춘다', 'Adapting the work to the individual — in workplace design and the choice of work equipment and of working and production methods, in particular to alleviate monotonous work and work at a predetermined rate and reduce their effect on health')],
                ['(e)', B('기술 진보에 맞춘다 (adapting to technical progress)', 'Adapting to technical progress')],
                ['(f)', B('위험한 것을 위험하지 않거나 덜 위험한 것으로 바꾼다', 'Replacing the dangerous by the non-dangerous or the less dangerous')],
                ['(g)', B('기술, 작업 조직, 근로조건, 사회적 관계, 작업환경 요인을 아우르는 일관된 예방 정책을 세운다', 'Developing a coherent overall prevention policy covering technology, organisation of work, working conditions, social relationships and the working environment')],
                ['(h)', B('집단 보호 조치를 개인 보호 조치보다 앞세운다', 'Giving collective protective measures priority over individual protective measures')],
                ['(i)', B('근로자에게 적절한 지시를 한다 (giving appropriate instructions)', 'Giving appropriate instructions to the workers')]
              ], src: ['eu89391', 'ukMhswr'] },
              { k: 'p', t: B('이 원칙은 Art.6(1)의 조치 — 위험 예방, 정보·훈련 제공, 필요한 조직과 수단 마련 — 를 이행하는 바탕입니다. 사용자는 상황 변화에 맞춰 조치를 조정하고 기존 상황을 개선하도록 해야 합니다(Art.6(1)). EU 기본지침은 근로자 보호에 더 유리한 국내 규정을 해치지 않습니다(Art.1(3)).',
                'These principles underpin the measures in Art. 6(1) — prevention of occupational risks, information and training, and the necessary organisation and means. The employer must adjust the measures to changing circumstances and aim to improve existing situations (Art. 6(1)). The Directive is without prejudice to national provisions more favourable to workers’ protection (Art. 1(3)).'), src: ['eu89391'] },
              { k: 'p', t: B('영국 MHSWR reg.4는 사용자가 예방·보호 조치를 할 때 부록 1의 원칙을 바탕으로 하도록 하고, 부록 1은 이 원칙이 지침 89/391/EEC Art.6(2)에 정한 것이라고 밝힙니다. reg.4는 잉글랜드·웨일스·스코틀랜드에 적용됩니다.',
                'UK MHSWR reg. 4 requires employers to base preventive and protective measures on the principles in Schedule 1, which states that they are those set out in Art. 6(2) of Directive 89/391/EEC. Reg. 4 extends to England, Wales and Scotland.'), src: ['ukMhswr'] },
              { k: 'p', t: B('ILO C187은 국가가 노사 대표단체와 협의해 국가 정책을 세울 때 직업적 위험의 평가, 위험을 근원에서 다스리기, 정보·협의·훈련을 포함한 예방적 안전보건 문화를 기본 원칙으로 장려하도록 합니다(Art.3(3)). 같은 협약은 예방적 안전보건 문화를 ‘예방의 원칙을 가장 높은 우선순위로 두는 문화’로 정의합니다(Art.1(d)).',
                'ILO C187 requires states, in consultation with employers’ and workers’ organisations, to promote as basic principles of national policy the assessment of occupational risks, combating risks at source, and a preventative safety and health culture including information, consultation and training (Art. 3(3)). It defines that culture as one in which the principle of prevention is accorded the highest priority (Art. 1(d)).'), src: ['iloC187'] },
              { k: 'syn', t: B(['세 문서 모두 ‘먼저 피하고, 피할 수 없는 것을 평가하고, 근원에서 다스린다’는 흐름을 담고 있습니다(Art.6(2)(a)~(c), C187 Art.3(3)).',
                'EU·영국의 아홉 원칙 가운데 보호 조치 사이의 우선순위를 직접 말하는 것은 (h) ‘집단 보호를 개인 보호보다 앞세운다’입니다. 대책을 단계로 줄 세운 ‘대책의 위계’는 {{hoc}}에서 비교합니다.'],
              ['All three documents follow the same flow: avoid first, evaluate what cannot be avoided, tackle it at source (Art. 6(2)(a)–(c); C187 Art. 3(3)).',
                'Of the nine EU and UK principles, the one that directly ranks protective measures is (h), collective before individual. Ranked “hierarchies of controls” are compared in {{hoc}}.']), src: ['eu89391', 'ukMhswr', 'iloC187'] },
              { k: 'q', t: B(['지침 89/391/EEC Art.6(2)의 아홉 원칙 가운데 보호 조치 사이의 우선순위를 직접 말하는 것은?', '영국 MHSWR의 예방 원칙은 어디에서 왔습니까?', 'C187이 정의한 ‘예방적 안전보건 문화’에서 가장 높은 우선순위를 두는 것은?'],
                ['Which of the nine principles in Art. 6(2) directly ranks protective measures?', 'Where do the UK MHSWR principles of prevention come from?', 'In C187’s definition of a preventative safety and health culture, what is given the highest priority?']) }
            ] },
          { id: 'hoc', t: B('대책의 우선순위 — 한국·미국·EU 비교', 'Order of control measures — Korea, US and EU compared'), cty: ['KR', 'US', 'EU'], fld: ['base'], lv: 'prac', st: 'ok', checked: D,
            sum: B(['한국 고시는 위험성 감소대책을 ① 제거·대체·설계 단계 저감 ② 공학적 대책 ③ 관리적 대책 ④ 개인용 보호구의 순서로 고려하게 합니다(제12조①).',
              '미국 NIOSH의 대책 위계는 제거·대체·공학적 대책·행정적 대책·개인보호구 5단계이고, OSHA 권고 실무도 이 위계로 대책을 고르도록 안내합니다.',
              '대책을 실행한 뒤에는 남은 위험성이 허용 가능한지 다시 확인하고, 중대한 위험은 장기 대책을 마련하는 동안 임시 대책으로 막습니다.'],
            ['Korea’s notice has reduction measures considered in the order (1) elimination, substitution and design-stage reduction, (2) engineering, (3) administrative, (4) personal protective equipment (Art. 12(1)).',
              'NIOSH’s hierarchy of controls has five levels — elimination, substitution, engineering controls, administrative controls and PPE — and OSHA’s Recommended Practices use it for choosing controls.',
              'After measures are in place, check that the remaining risk is tolerable; serious hazards are held with interim controls while longer-term solutions are put in place.']),
            body: [
              { k: 'tbl', cmp: true, head: B(['단계', '한국 고시 제12조①', '미국 NIOSH 대책 위계', 'EU Art.6(2)과의 대응 (정리)'], ['Level', 'Korean notice Art. 12(1)', 'US NIOSH hierarchy of controls', 'Matching EU Art. 6(2) principle (synthesis)']), rows: [
                [B('제거', 'Elimination'), B('1호 — 위험한 작업의 폐지·변경, 설계·계획 단계에서 위험성 제거·저감', 'Item 1 — abolish or change dangerous work; remove or reduce risk at the design and planning stage'), B('Elimination — 위험을 물리적으로 없앤다', 'Elimination — physically remove the hazard'), B('(a) 위험을 피한다', '(a) avoiding risks')],
                [B('대체', 'Substitution'), B('1호 — 유해·위험물질 대체', 'Item 1 — substitute hazardous substances'), B('Substitution — 위험을 다른 것으로 바꾼다', 'Substitution — replace the hazard'), B('(f) 덜 위험한 것으로 바꾼다', '(f) replacing the dangerous by the less dangerous')],
                [B('공학적 대책', 'Engineering'), B('2호 — 연동장치, 환기장치 설치 등', 'Item 2 — interlocks, ventilation and the like'), B('Engineering controls — 사람을 위험에서 격리한다', 'Engineering controls — isolate people from the hazard'), B('(c) 근원에서 다스린다, (h) 집단 보호 우선', '(c) combating risks at source; (h) collective first')],
                [B('관리적(행정적) 대책', 'Administrative'), B('3호 — 작업절차서 정비 등', 'Item 3 — work procedures and the like'), B('Administrative controls — 일하는 방식을 바꾼다', 'Administrative controls — change the way people work'), B('(i) 적절한 지시', '(i) appropriate instructions')],
                [B('개인보호구', 'PPE'), B('4호 — 개인용 보호구', 'Item 4 — personal protective equipment'), B('PPE — 보호구로 근로자를 보호한다', 'PPE — protect the worker with personal protective equipment'), B('(h)에 따라 집단 보호 다음', 'After collective measures, under (h)')]
              ], src: ['moelRa', 'nioshHoc', 'oshaRp', 'eu89391'] },
              { k: 'p', t: B('한국 고시는 이 순서와 함께 위험성의 수준과 영향을 받는 근로자 수를 고려하고, 법령이 정한 사항과 근로자의 위험·건강장해를 막는 데 필요한 조치를 반영하도록 합니다(제12조①). 대책을 실행한 뒤에는 남은 위험성이 허용 가능한 수준인지 확인하고, 아니면 추가 대책을 세워 실행합니다(제12조②③). 중대재해로 이어질 우려가 있는데 대책 실행에 시간이 걸리면 즉시 잠정적인 조치를 합니다(제12조④).',
                'Alongside this order, Korea’s notice requires account to be taken of the level of risk and the number of workers affected, and of what the law prescribes and whatever else is needed to prevent danger or harm to workers (Art. 12(1)). After implementation, check that the remaining risk is tolerable and, if not, add further measures (Art. 12(2)–(3)). Where a serious accident could result and the measures take time, interim measures are taken at once (Art. 12(4)).'), src: ['moelRa'] },
              { k: 'p', t: B('NIOSH는 제거·대체·공학적 대책이 사람의 큰 개입 없이 노출을 통제하므로 더 효과적이고, 행정적 대책과 보호구는 근로자와 감독자의 지속적인 노력이 필요하다고 설명합니다. 다른 효과적인 대책이 있으면 보호구에만 의존하지 않습니다.',
                'NIOSH explains that elimination, substitution and engineering controls work without significant human interaction and are therefore more effective, whereas administrative controls and PPE need ongoing effort by workers and supervisors; PPE should not be relied on alone when other effective controls exist.'), src: ['nioshHoc'] },
              { k: 'p', t: B('OSHA 권고 실무(OSHA 3885)는 공학적 해결(제거·대체 포함)을 먼저, 그다음 안전한 작업 방법과 행정적 대책, 마지막으로 보호구를 쓰도록 하고, 사망이나 심각한 신체 상해를 일으키거나 일으킬 수 있는 위해는 즉시 제거하거나 통제하며, 장기 대책을 마련하는 동안 임시 대책을 쓰고, 새로운 위해를 만드는 대책은 피하라고 안내합니다. 이 문서는 권고이며 법적 의무를 만들지 않습니다.',
                'OSHA’s Recommended Practices (OSHA 3885) say to choose engineering solutions (including elimination or substitution) first, then safe work practices and administrative controls, and PPE last; to eliminate or control at once any hazard causing or likely to cause death or serious physical harm; to use interim controls while longer-term solutions are developed; and to avoid controls that introduce new hazards. The document is advisory and creates no legal obligation.'), src: ['oshaRp'] },
              { k: 'syn', t: B(['**공통점** — 위험의 근원을 없애거나 줄이는 대책을 먼저, 사람의 행동에 기대는 대책(절차·보호구)을 나중에 둡니다.',
                '**차이점** — 한국 고시는 제거와 대체를 1호 하나로 묶어 네 단계로, NIOSH는 다섯 단계로 나눕니다. OSHA 권고는 제거·대체를 공학적 해결 안에 넣어 설명합니다.',
                '**차이점** — EU·영국은 단계표 대신 원칙 목록({{prev-principles}})으로 정하고, 단계 사이의 우선순위는 (h) 집단 보호 우선만 명시합니다. 표의 EU 칸은 작성자가 원칙을 단계에 맞춰 본 것입니다.'],
              ['**Common ground** — measures that remove or reduce the hazard at its source come first; measures that depend on people’s behaviour (procedures, PPE) come last.',
                '**Difference** — Korea’s notice groups elimination and substitution as item 1 and has four steps; NIOSH has five. OSHA’s recommendations treat elimination and substitution as part of engineering solutions.',
                '**Difference** — the EU and the UK use a list of principles ({{prev-principles}}) rather than a ranked ladder; the only explicit ranking is (h), collective before individual. The EU column of the table is the author’s mapping of principles to levels.']), src: ['moelRa', 'nioshHoc', 'oshaRp', 'eu89391'] },
              { k: 'go', items: [['#risk', B('위험성평가 워크벤치 — 대책의 위계 띠로 고른 대책 확인', 'Risk assessment workbench — check chosen controls on the hierarchy band')], ['#ppe', B('호흡보호구 선정 — 보호구가 마지막 단계일 때', 'Respirator selection — when PPE is the last resort')]] },
              { k: 'q', t: B(['한국 고시 제12조①의 네 단계와 NIOSH의 다섯 단계를 짝지어 보세요.', '대책을 실행한 뒤 한국 고시가 요구하는 확인은 무엇입니까?', 'NIOSH의 설명으로 보호구를 마지막 단계에 두는 이유를 말해 보세요.'],
                ['Match the four steps of Korean notice Art. 12(1) with NIOSH’s five levels.', 'What check does the Korean notice require after measures are carried out?', 'Using NIOSH’s explanation, why is PPE the last resort?']) }
            ] }
        ] },
        ...plan('G1', [
          ['c1-4', '사고 발생 이론과 인적 요인', 'Accident causation and human factors'],
          ['c1-5', '안전문화와 리더십', 'Safety culture and leadership'],
          ['c1-6', '근로자 참여와 협의', 'Worker participation and consultation'],
          ['c1-7', '성과 측정 — 선행·후행 지표', 'Measuring performance — leading and lagging indicators']])
      ] },

    /* ================= 2편 ================= */
    { id: 'p2', no: '2', t: B('법과 제도', 'Law and policy'),
      d: B('국제 기준과 나라별 법 체계 — 같은 의무를 각국이 어떻게 정하는지 나란히 비교합니다.', 'International standards and national frameworks — how each country lays down the same duties, side by side.'),
      ch: [
        { id: 'c2-1', t: B('국제 기준 — ILO', 'International standards — ILO'), sec: [
          { id: 'ilo-c155', t: B('ILO 산업안전보건 협약(제155호)', 'ILO Occupational Safety and Health Convention (No. 155)'), cty: ['INT'], fld: ['law'], lv: 'intro', st: 'ok', checked: D,
            sum: B(['C155(1981)는 각 나라가 노사 대표단체와 협의해 산업안전보건 국가 정책을 세우고 이행하며 주기적으로 검토하도록 합니다(Art.4).',
              '사용자는 통제하는 작업장·기계·장비·공정이 ‘합리적으로 실행 가능한 한(so far as is reasonably practicable)’ 안전하고 건강에 위험이 없도록 해야 합니다(Art.16).',
              '사업장 수준에서는 근로자 협력, 대표에 대한 정보 제공, 훈련, 협의, 급박한 위험의 보고와 같은 협력 체계를 둡니다(Art.19).'],
            ['C155 (1981) requires each state, in consultation with employers’ and workers’ organisations, to formulate, implement and periodically review a national OSH policy (Art. 4).',
              'Employers must ensure, “so far as is reasonably practicable”, that the workplaces, machinery, equipment and processes under their control are safe and without risk to health (Art. 16).',
              'At the level of the undertaking there are arrangements for worker co-operation, information to representatives, training, consultation and reporting of imminent danger (Art. 19).']),
            body: [
              { k: 'h', t: B('국가 정책 — Art.4', 'National policy — Art. 4') },
              { k: 'p', t: B('각 회원국은 국가의 조건과 관행에 비추어, 가장 대표적인 사용자·근로자 단체와 협의해 산업안전, 산업보건과 작업환경에 관한 일관된 국가 정책을 수립·이행하고 주기적으로 검토해야 합니다(Art.4(1)). 정책의 목적은 작업에서 생기거나 작업과 관련된 사고와 건강 피해를, 작업환경에 내재한 위험의 원인을 합리적으로 실행 가능한 한 최소화해 예방하는 것입니다(Art.4(2)).',
                'Each Member shall, in the light of national conditions and practice and in consultation with the most representative organisations of employers and workers, formulate, implement and periodically review a coherent national policy on occupational safety, occupational health and the working environment (Art. 4(1)). Its aim is to prevent accidents and injury to health arising out of, linked with or occurring in the course of work, by minimising, so far as is reasonably practicable, the causes of hazards inherent in the working environment (Art. 4(2)).'), src: ['iloC155'] },
              { k: 'h', t: B('사용자의 의무 — Art.16·17', 'Employers’ duties — Arts. 16 and 17') },
              { k: 'ul', t: B(['통제하는 작업장, 기계, 장비, 공정이 합리적으로 실행 가능한 한 안전하고 건강에 위험이 없도록 한다(Art.16(1)).',
                '통제하는 화학적·물리적·생물학적 물질과 인자가, 적절한 보호 조치를 했을 때 합리적으로 실행 가능한 한 건강에 위험이 없도록 한다(Art.16(2)).',
                '필요한 경우 사고나 건강 악영향을 막는 적절한 보호복과 보호구를 제공한다(Art.16(3)).',
                '둘 이상의 사업이 한 작업장에서 동시에 활동하면 협약의 요구를 적용하는 데 협력한다(Art.17).'],
              ['Ensure, so far as is reasonably practicable, that the workplaces, machinery, equipment and processes under their control are safe and without risk to health (Art. 16(1)).',
                'Ensure, so far as is reasonably practicable, that the chemical, physical and biological substances and agents under their control are without risk to health when the appropriate measures of protection are taken (Art. 16(2)).',
                'Provide, where necessary, adequate protective clothing and equipment to prevent the risk of accidents or adverse effects on health (Art. 16(3)).',
                'Where two or more undertakings work at one workplace at the same time, collaborate in applying the Convention (Art. 17).']), src: ['iloC155'] },
              { k: 'h', t: B('사업장 수준의 협력 — Art.19', 'Arrangements in the undertaking — Art. 19') },
              { k: 'ol', t: B(['근로자는 작업을 하면서 사용자의 의무 이행에 협력한다(a).',
                '근로자 대표는 산업안전보건 분야에서 사용자와 협력한다(b).',
                '근로자 대표는 사용자가 한 안전보건 조치에 관해 적절한 정보를 받는다(c).',
                '근로자와 대표는 적절한 안전보건 훈련을 받는다(d).',
                '근로자 또는 대표는 국내법과 관행에 따라 작업과 관련된 안전보건의 모든 측면을 조사하고 사용자와 협의할 수 있다(e).',
                '근로자는 생명이나 건강에 급박하고 심각한 위험이 있다고 믿을 합리적 이유가 있는 상황을 즉시 직속 감독자에게 보고하고, 사용자는 필요한 조치를 할 때까지 그 위험이 계속되는 작업으로 돌아가라고 요구할 수 없다(f).'],
              ['Workers co-operate in the fulfilment by their employer of the obligations placed on it (a).',
                'Workers’ representatives co-operate with the employer in occupational safety and health (b).',
                'Representatives receive adequate information on the measures the employer has taken (c).',
                'Workers and representatives receive appropriate safety and health training (d).',
                'Workers or their representatives may, in accordance with national law and practice, enquire into and be consulted on all aspects of safety and health associated with their work (e).',
                'A worker reports at once to the immediate supervisor any situation reasonably believed to present an imminent and serious danger to life or health; until remedial action is taken, the employer cannot require workers to return to a situation where that danger continues (f).']), src: ['iloC155'] },
              { k: 'p', t: B('‘so far as is reasonably practicable’는 영국 HSWA 1974 s.2(1)의 사용자 일반 의무에도 쓰이는 표현입니다. 나라별 일반 의무의 표현은 {{duty-employer}}에서 비교합니다.',
                '“So far as is reasonably practicable” is also the qualifier of the employer’s general duty in the UK HSWA 1974 s. 2(1). The wording of general duties across countries is compared in {{duty-employer}}.'), src: ['iloC155', 'ukHswa'] },
              { k: 'q', t: B(['C155 Art.16이 사용자 의무에 붙인 한정 표현은 무엇입니까?', 'Art.19(f)에 따르면 급박하고 심각한 위험을 보고한 근로자에게 사용자가 할 수 없는 것은?'],
                ['What qualifying phrase does C155 Art. 16 attach to the employer’s duty?', 'Under Art. 19(f), what may an employer not require of a worker who has reported an imminent and serious danger?']) }
            ] },
          { id: 'ilo-fund', t: B('2022년 ‘기본 원칙’, C187과 비준 현황', 'The 2022 fundamental principle, C187 and ratifications'), cty: ['INT', 'KR', 'US', 'UK', 'EU', 'JP'], fld: ['law'], lv: 'intro', st: 'ok', checked: D,
            sum: B(['ILO는 2022년에 ‘안전하고 건강한 작업환경’을 노동에서의 기본 원칙과 권리로 인정했고, C155와 C187은 기본협약이 되었습니다.',
              'C187(2006)은 국가 정책·국가 체계·국가 프로그램으로 산업안전보건을 지속적으로 개선하는 틀을 정합니다.',
              '2026-10-01 기준 한국은 두 협약을 모두 비준했고, 일본은 C187에 이어 C155를 2026년에 비준했으며(2027.4.1 발효 예정), 영국은 C187만, 미국은 둘 다 비준하지 않았습니다.'],
            ['In 2022 the ILO recognised a safe and healthy working environment as a fundamental principle and right at work, and C155 and C187 became fundamental Conventions.',
              'C187 (2006) sets a framework for continuous improvement of OSH through a national policy, a national system and a national programme.',
              'As of 2026-10-01, Korea had ratified both; Japan, already party to C187, ratified C155 in 2026 (in force 2027-04-01); the UK had ratified C187 only; the US neither.']),
            body: [
              { k: 'p', t: B('ILO는 2022년 안전하고 건강한 작업환경을 노동에서의 기본 원칙과 권리(fundamental principle and right at work)로 인정했습니다. C155(및 권고 제164호)와 C187(및 권고 제197호)은 이제 기본협약으로 인정됩니다.',
                'In 2022 the ILO recognised a safe and healthy working environment as a fundamental principle and right at work. C155 (with Recommendation No. 164) and C187 (with Recommendation No. 197) are now recognised as fundamental Conventions.'), src: ['iloFund'] },
              { k: 'h', t: B('C187의 틀', 'The C187 framework') },
              { k: 'tbl', head: B(['요소', '내용'], ['Element', 'What it requires']), rows: [
                [B('국가 정책 (Art.3)', 'National policy (Art. 3)'), B('안전하고 건강한 작업환경을 위한 국가 정책을 세우고, 근로자의 권리를 증진한다. 기본 원칙 — 직업적 위험의 평가, 근원에서의 대처, 정보·협의·훈련을 포함한 예방 문화', 'Formulate a national policy for a safe and healthy working environment and advance workers’ right to it; basic principles — assessing occupational risks, combating them at source, and a preventative culture including information, consultation and training')],
                [B('국가 체계 (Art.4)', 'National system (Art. 4)'), B('법령(필요하면 단체협약 포함), 담당 기관, 감독 체계를 포함한 이행 확보 장치, 사업장 수준의 노사 협력 장치를 갖추고 주기적으로 검토한다', 'Laws and regulations (and collective agreements where appropriate), responsible authorities, compliance mechanisms including inspection, and arrangements for co-operation between management and workers in the undertaking, reviewed periodically')],
                [B('국가 프로그램 (Art.5)', 'National programme (Art. 5)'), B('국가 상황 분석에 근거해 목표·지표를 담아 세우고, 합리적으로 실행 가능한 한 작업 관련 위험을 없애거나 최소화하며, 널리 공표한다', 'Based on an analysis of the national situation, with objectives, targets and indicators; eliminate or minimise work-related hazards so far as is reasonably practicable; widely publicised')],
                [B('예방 문화 (Art.1(d))', 'Preventative culture (Art. 1(d))'), B('모든 수준에서 안전하고 건강한 작업환경에 대한 권리를 존중하고, 정부·사용자·근로자가 정해진 권리·책임·의무 체계로 참여하며, 예방의 원칙을 가장 높은 우선순위로 두는 문화', 'A culture in which the right to a safe and healthy working environment is respected at all levels, government, employers and workers take part through defined rights, responsibilities and duties, and prevention has the highest priority')]
              ], src: ['iloC187'] },
              { k: 'h', t: B('비준 현황 (2026-10-01 NORMLEX)', 'Ratifications (NORMLEX, 2026-10-01)') },
              { k: 'tbl', cmp: true, head: B(['법역', 'C155 (1981)', 'C187 (2006)'], ['Jurisdiction', 'C155 (1981)', 'C187 (2006)']), rows: [
                ['@KR', B('2008.2.20 비준, 발효 중', 'Ratified 2008-02-20, in force'), B('2008.2.20 비준, 발효 중', 'Ratified 2008-02-20, in force')],
                ['@JP', B('2026.4.1 비준, 2027.4.1 발효 예정', 'Ratified 2026-04-01, in force from 2027-04-01'), B('2007.7.24 비준, 발효 중', 'Ratified 2007-07-24, in force')],
                ['@UK', B('비준하지 않음', 'Not ratified'), B('2008.5.29 비준, 발효 중', 'Ratified 2008-05-29, in force')],
                ['@US', B('비준하지 않음', 'Not ratified'), B('비준하지 않음', 'Not ratified')],
                ['@EU', B('나라별 비준 — 예: 독일 2026.6.9 비준(2027.6.9 발효 예정), 프랑스 2026.2.16 비준(2027.2.16 발효 예정)', 'Ratified country by country — e.g. Germany 2026-06-09 (in force 2027-06-09), France 2026-02-16 (in force 2027-02-16)'), B('나라별 비준 — 예: 독일 2010.7.21, 프랑스 2014.10.29', 'Ratified country by country — e.g. Germany 2010-07-21, France 2014-10-29')]
              ], src: ['iloRatify'] },
              { k: 'note', t: B('비준 현황은 2026-10-01 ILO NORMLEX 조회 결과입니다(같은 날 C155 비준국 94개국, C187 77개국). 비준은 계속 늘어나므로 최신 현황은 NORMLEX에서 확인하세요.',
                'Ratification data are from ILO NORMLEX on 2026-10-01 (94 countries for C155 and 77 for C187 that day). Ratifications keep growing, so check NORMLEX for the latest.'), src: ['iloRatify'] },
              { k: 'syn', t: B(['C155를 비준하지 않은 영국과 미국도 자체 기본법(HSWA 1974, OSH Act 1970)으로 사용자의 일반 의무를 정합니다({{law-map}}, {{duty-employer}}).',
                '일본은 C155를 2026년에 비준해 2027년 4월 1일부터 적용받습니다. 이 가이드북은 발효 뒤 일본 법령의 변화를 다시 확인합니다.'],
              ['The UK and the US, which have not ratified C155, set employers’ general duties in their own framework laws (HSWA 1974, OSH Act 1970) ({{law-map}}, {{duty-employer}}).',
                'Japan ratified C155 in 2026 and is bound from 1 April 2027; the guidebook will re-check Japanese law after it takes effect.']), src: ['iloRatify', 'ukHswa', 'oshAct'] },
              { k: 'q', t: B(['C187이 정한 세 가지 국가 수준 요소는 무엇입니까?', '2026-10-01 기준 이 표에서 C155와 C187을 모두 비준한 법역은?'],
                ['What are the three national-level elements of C187?', 'As of 2026-10-01, which jurisdictions in this table had ratified both C155 and C187?']) }
            ] }
        ] },
        { id: 'c2-2', t: B('주요국 법 체계 개관', 'National frameworks at a glance'), sec: [
          { id: 'law-map', t: B('기본법 한눈에 — 한국·미국·영국·EU·일본', 'Framework laws at a glance — Korea, US, UK, EU and Japan'), cty: ['KR', 'US', 'UK', 'EU', 'JP'], fld: ['law'], lv: 'intro', st: 'ok', checked: D3,
            sum: B(['다섯 법역 모두 기본법(EU는 기본지침)을 두고, 그 아래 규칙·기준으로 구체적인 의무를 정합니다.',
              '기본법이 생긴 순서는 미국 OSH Act(1970) → 일본 労働安全衛生法(1972) → 영국 HSWA(1974) → 한국 산업안전보건법(1981 제정, 1982 시행) → EU 기본지침(1989)입니다.',
              'EU 기본지침은 회원국이 국내법으로 이행해야 하며(1992.12.31까지), 근로자 보호에 더 유리한 국내 규정을 해치지 않습니다.'],
            ['All five have a framework law (a framework directive in the EU), with rules and standards beneath it setting the detailed duties.',
              'In order of adoption: the US OSH Act (1970), Japan’s Industrial Safety and Health Act (1972), the UK HSWA (1974), Korea’s OSH Act (enacted 1981, in force 1982) and the EU Framework Directive (1989).',
              'Member States had to implement the EU Directive in national law (by 31 December 1992), and it does not affect national provisions more favourable to workers.']),
            body: [
              { k: 'tbl', cmp: true, head: B(['법역', '기본법', '제정·시행', '소관·집행', '하위 규정·기준의 예'], ['Jurisdiction', 'Framework law', 'Adopted', 'Responsible body', 'Examples of rules beneath it']), rows: [
                ['@KR', B('산업안전보건법', 'Occupational Safety and Health Act'), B('1981.12.31 제정(법률 제3532호), 1982.7.1 시행. 현행 2026.8.1 시행(법률 제21374호)', 'Enacted 1981-12-31 (Act No. 3532), in force 1982-07-01; current version in force 2026-08-01 (Act No. 21374)'), B('고용노동부', 'Ministry of Employment and Labor'), B('시행령, 시행규칙, 산업안전보건기준에 관한 규칙, 고용노동부 고시(예: 위험성평가 지침)', 'Enforcement Decree, Enforcement Rule, Rules on OSH Standards, MOEL notices (e.g. the risk-assessment guideline)')],
                ['@US', 'Occupational Safety and Health Act of 1970', B('1970년 법', 'Act of 1970'), B('노동부 OSHA(Occupational Safety and Health Administration)', 'Department of Labor, OSHA'), B('29 CFR Part 1910(일반 산업), 1926(건설), 1904(재해 기록·보고) — 사용자는 법에 따라 공포된 기준을 지켜야 함(SEC.5(a)(2))', '29 CFR Parts 1910 (general industry), 1926 (construction), 1904 (recording and reporting) — employers must comply with standards promulgated under the Act (SEC. 5(a)(2))')],
                ['@UK', 'Health and Safety at Work etc. Act 1974', B('1974년 법(c.37) — Great Britain 산업안전보건의 기본 법률(HSE)', 'Act of 1974 (c. 37) — the primary OSH legislation in Great Britain (HSE)'), 'HSE (Health and Safety Executive)', B('HSWA의 권한으로 만든 규정 — 예: Management of Health and Safety at Work Regulations 1999', 'Regulations made under HSWA — e.g. the Management of Health and Safety at Work Regulations 1999')],
                ['@EU', B('이사회 지침 89/391/EEC (기본지침)', 'Council Directive 89/391/EEC (Framework Directive)'), B('1989.6.12 채택, 회원국 이행 기한 1992.12.31(Art.18)', 'Adopted 1989-06-12; national implementation by 1992-12-31 (Art. 18)'), B('회원국이 국내법으로 이행', 'Member States, through national law'), B('개별지침 — 기본지침은 개별지침 영역에도 전부 적용되며, 개별지침의 더 엄격하거나 구체적인 규정은 그대로 유지(Art.16(3))', 'Individual directives — the Framework Directive applies in full to their areas, without prejudice to their more stringent or specific provisions (Art. 16(3))')],
                ['@JP', '労働安全衛生法', B('1972.6.8 법률 제57호. 현행 2026.10.1 시행 단계(令和7年法律第33号 반영)', 'Act No. 57 of 8 June 1972; current stage in force 2026-10-01 (incl. Act No. 33 of 2025)'), B('후생노동성 — 후생노동대신이 지침을 공표(第28条の2②)', 'Ministry of Health, Labour and Welfare — the Minister issues guidelines (Art. 28-2(2))'), B('후생노동성령(省令) — 예: 第28条の2①의 조사는 “厚生労働省令で定めるところにより” 실시', 'Ministerial ordinances — e.g. the Art. 28-2(1) assessment is done “pursuant to Order of the Ministry of Health, Labour and Welfare”')]
              ], src: ['lawActHist', 'lawAct', 'lawDecree', 'lawRule', 'lawStd', 'moelRa', 'oshAct', 'cfr1910_132', 'hseHswa', 'ukHswa', 'ukMhswr', 'eu89391', 'jpIshl'] },
              { k: 'p', t: B('영국 칸은 Great Britain(잉글랜드·웨일스·스코틀랜드) 기준입니다. HSE는 HSWA가 사용자의 근로자·일반 대중에 대한 의무, 근로자 자신과 서로에 대한 의무, 일부 자영업자의 의무를 정한다고 설명합니다. 북아일랜드는 이 가이드북에서 아직 다루지 않습니다.',
                'The UK row covers Great Britain (England, Wales and Scotland). HSE explains that HSWA sets the duties employers have towards employees and the public, employees towards themselves and each other, and certain self-employed people. Northern Ireland is not yet covered by this guidebook.'), src: ['hseHswa'] },
              { k: 'p', t: B('EU 기본지침은 공공·민간의 모든 부문에 적용되며, 군·경찰이나 일부 민방위 활동처럼 특성상 지침과 불가피하게 충돌하는 경우에만 적용되지 않습니다. 그때에도 지침의 목적에 비추어 가능한 한 안전·보건을 보장해야 합니다(Art.2).',
                'The EU Framework Directive applies to all sectors, public and private; it does not apply only where the particular characteristics of certain public services, such as the armed forces, the police or some civil protection activities, inevitably conflict with it — and even then safety and health must be ensured as far as possible (Art. 2).'), src: ['eu89391', 'euOshaFd'] },
              { k: 'syn', t: B(['**공통점** — 기본법이 사용자의 일반 의무를 정하고, 구체적인 의무는 그 아래 규칙·기준이 정합니다(한국 시행령·시행규칙·안전보건규칙, 미국 29 CFR, 영국 MHSWR 등 규정, 일본 성령, EU 개별지침).',
                '**차이점** — EU 기본지침은 회원국이 국내법으로 이행해야 하고(Art.18), 근로자 보호에 더 유리한 국내 규정을 해치지 않습니다(Art.1(3)). 다른 네 법역의 기본법은 그 자체가 국내법입니다.'],
              ['**Common ground** — the framework law sets employers’ general duties, and rules and standards beneath it set the specifics (Korea’s Decree, Rule and OSH Standards Rules; US 29 CFR; UK regulations such as MHSWR; Japanese ministerial ordinances; EU individual directives).',
                '**Difference** — the EU Directive has to be implemented by Member States in national law (Art. 18) and does not affect national provisions more favourable to workers (Art. 1(3)); the other four framework laws are national law in themselves.']), src: ['lawAct', 'lawRule', 'lawStd', 'cfr1910_132', 'ukMhswr', 'jpIshl', 'eu89391'] },
              { k: 'go', items: [['#sources/lawcheck', B('법령 변경 점검 — 한국 인용 법령의 현행 판과 시행 예정 개정', 'Law-change check — current and upcoming versions of the Korean laws cited')]] },
              { k: 'q', t: B(['다섯 기본법을 제정 연도 순으로 나열해 보세요.', 'EU 회원국이 기본지침을 국내법으로 이행해야 했던 기한은 언제입니까?', '미국 사용자가 29 CFR의 기준을 지켜야 하는 근거 조항은?'],
                ['List the five framework laws in order of adoption.', 'By when did EU Member States have to implement the Framework Directive?', 'Which provision obliges US employers to comply with the standards in 29 CFR?']) }
            ] }
        ] },
        { id: 'c2-3', t: B('사업주와 근로자의 일반 의무', 'General duties of employers and workers'), sec: [
          { id: 'duty-employer', t: B('사업주 일반 의무의 표현 비교', 'How the employer’s general duty is worded'), cty: ['INT', 'KR', 'US', 'UK', 'EU', 'JP'], fld: ['law'], lv: 'prac', st: 'ok', checked: D3,
            sum: B(['여섯 법역 모두 일반 의무의 주체는 사용자(사업주)입니다.',
              '의무를 한정하는 방식이 다릅니다 — 영국과 ILO는 ‘합리적으로 실행 가능한 한’, 미국은 ‘사망이나 심각한 신체 상해를 일으키는 인지된 위해’, EU는 ‘작업과 관련된 모든 측면’을 씁니다.',
              '한국과 일본은 법정 기준 준수에 더해 쾌적한 작업환경 조성과 근로조건 개선을 사업주의 책무로 적고, 설계·제조·수입 단계의 주체에게도 의무를 둡니다.'],
            ['In all six, the general duty falls on the employer.',
              'The qualifier differs — “so far as is reasonably practicable” in the UK and the ILO, “recognized hazards causing or likely to cause death or serious physical harm” in the US, and “every aspect related to the work” in the EU.',
              'Korea and Japan add a comfortable working environment and better working conditions to compliance with minimum standards, and also place duties on designers, manufacturers and importers.']),
            body: [
              { k: 'tbl', cmp: true, head: B(['법역', '조문', '핵심 표현', '의무 내용 요지'], ['Jurisdiction', 'Provision', 'Key wording', 'Substance']), rows: [
                ['@INT', 'C155 Art.16', 'so far as is reasonably practicable', B('통제하는 작업장·기계·장비·공정, 화학·물리·생물학적 인자의 안전, 필요한 보호구 제공', 'Safety of workplaces, machinery, equipment and processes under the employer’s control and of chemical, physical and biological agents; protective equipment where necessary')],
                ['@UK', 'HSWA 1974 s.2', 'so far as is reasonably practicable', B('모든 근로자의 작업 중 건강·안전·복지 보장 — 설비와 작업 방식, 물품·물질의 취급, 정보·지시·훈련·감독, 작업장, 작업환경(s.2(2)(a)~(e)), 서면 방침(s.2(3)), 안전대표와 협의(s.2(6))', 'The health, safety and welfare at work of all employees — plant and systems of work, handling of articles and substances, information, instruction, training and supervision, the workplace, the working environment (s. 2(2)(a)–(e)); a written policy (s. 2(3)); consultation with safety representatives (s. 2(6))')],
                ['@EU', B('지침 89/391/EEC Art.5, 6(1)', 'Directive 89/391/EEC Arts. 5, 6(1)'), 'in every aspect related to the work', B('작업과 관련된 모든 측면에서 근로자의 안전·보건 보장, 예방·정보·훈련·조직·수단 등 필요한 조치. 외부 전문 서비스를 써도 책임은 남음(Art.5(2)), 회원국은 이례적이고 예견할 수 없는 사정에서 사용자 책임을 배제·제한할 수 있음(Art.5(4))', 'Ensure workers’ safety and health in every aspect related to the work; the necessary measures, including prevention, information, training, organisation and means. Using external services does not discharge the employer (Art. 5(2)); Member States may exclude or limit liability for unusual and unforeseeable circumstances (Art. 5(4))')],
                ['@US', 'OSH Act SEC.5(a)', 'free from recognized hazards that are causing or are likely to cause death or serious physical harm', B('일반의무조항 — 사망이나 심각한 신체 상해를 일으키거나 일으킬 수 있는 인지된 위해가 없는 고용과 작업장 제공(a)(1), 법에 따라 공포된 기준 준수(a)(2)', 'General duty clause — employment and a place of employment free from recognized hazards causing or likely to cause death or serious physical harm (a)(1); comply with promulgated standards (a)(2)')],
                ['@KR', B('산업안전보건법 제5조①', 'OSH Act Art. 5(1)'), B('안전 및 건강을 유지·증진', 'maintain and promote safety and health'), B('법·명령의 산업재해 예방 기준, 신체적 피로와 정신적 스트레스를 줄이는 쾌적한 작업환경 조성과 근로조건 개선, 안전·보건 정보 제공. 국가의 산업재해 예방정책을 따름. 특수형태근로종사자에게 노무를 제공받는 자, 배달 등 중개자도 포함', 'Meet the injury-prevention standards in the Act and orders; create a comfortable working environment that reduces physical fatigue and mental stress and improve working conditions; provide safety and health information; follow national prevention policy. Also covers those receiving services from special-type workers and delivery platforms')],
                ['@JP', B('労働安全衛生法 第3条①', 'Industrial Safety and Health Act Art. 3(1)'), '快適な職場環境の実現と労働条件の改善', B('최저기준을 지키는 데 그치지 않고 쾌적한 직장환경 실현과 근로조건 개선으로 근로자의 안전과 건강을 확보, 국가 시책에 협력', 'Not only comply with the minimum standards but secure workers’ safety and health through a comfortable work environment and better working conditions; co-operate with government policy')]
              ], src: ['iloC155', 'ukHswa', 'eu89391', 'oshAct', 'lawAct', 'jpIshl'] },
              { k: 'h', t: B('설계·제조 단계의 의무', 'Duties at the design and manufacturing stage') },
              { k: 'p', t: B('한국과 일본은 사용자 말고도 기계·설비를 설계·제조·수입하는 자, 원재료를 제조·수입하는 자, 건설물을 설계·건설하는 자(한국은 발주자 포함)에게 의무를 둡니다. 한국은 기준을 지키고 필요한 조치를 해야 하는 의무(제5조②), 일본은 재해 방지에 이바지하도록 노력하는 의무(第3条②)입니다. 일본은 또 건설공사 발주자 등 일을 남에게 맡기는 자가 시공 방법, 작업 방법, 공기, 납기 등에 안전하고 위생적인 작업을 해칠 우려가 있는 조건을 붙이지 않도록 배려하게 합니다(第3条③).',
                'Korea and Japan also place duties on those who design, manufacture or import machinery and equipment, manufacture or import raw materials, or design and build structures (in Korea, clients too). In Korea it is a duty to meet the standards and take the necessary measures (Art. 5(2)); in Japan an effort duty to help prevent injuries (Art. 3(2)). Japan further requires clients for construction work and others who place work with someone else to take care not to set conditions on construction or work methods, construction periods or delivery dates that could undermine safe and hygienic work (Art. 3(3)).'), src: ['lawAct', 'jpIshl'] },
              { k: 'syn', t: B(['**공통점** — 일반 의무 조항과 함께 세부 기준을 지킬 의무를 둡니다(미국 SEC.5(a)(2), 한국 제5조① 1호, 일본 第3条①의 최저기준, EU Art.6, 영국 s.2와 MHSWR 등 규정).',
                '**차이점** — 의무의 범위를 정하는 말: 영국·ILO는 ‘합리적으로 실행 가능한 한’으로 한정하고, EU는 한정 없이 ‘모든 측면’을 쓰되 회원국이 예외 사정을 둘 수 있게 했으며(Art.5(4)), 미국은 ‘인지된’ 위해와 ‘사망·심각한 신체 상해’라는 문턱을 둡니다.',
                '**차이점** — 한국·일본은 기준 준수를 넘어 쾌적한 환경과 근로조건 개선을 사용자 책무에 넣고, 설계·제조·수입 단계까지 의무 주체를 넓힙니다(한국은 의무, 일본은 노력의무).'],
              ['**Common ground** — besides a general duty, each requires compliance with detailed standards (US SEC. 5(a)(2), Korea Art. 5(1) item 1, the minimum standards in Japan Art. 3(1), EU Art. 6, UK s. 2 and regulations such as MHSWR).',
                '**Difference** — the words that bound the duty: the UK and the ILO qualify it “so far as is reasonably practicable”; the EU says “every aspect” without a qualifier but lets Member States provide for exceptional circumstances (Art. 5(4)); the US sets a threshold of “recognized” hazards causing or likely to cause death or serious physical harm.',
                '**Difference** — Korea and Japan go beyond compliance to a comfortable environment and better working conditions, and extend duties to designers, manufacturers and importers (a duty in Korea, an effort duty in Japan).']), src: ['oshAct', 'lawAct', 'jpIshl', 'eu89391', 'ukHswa', 'ukMhswr', 'iloC155'] },
              { k: 'q', t: B(['미국 일반의무조항이 적용되려면 위해가 어떤 조건을 갖춰야 합니까?', 'EU Art.5(4)가 회원국에 허용하는 것은 무엇입니까?', '영국 HSWA s.2(2)가 나열한 다섯 영역은?'],
                ['What conditions must a hazard meet for the US general duty clause to apply?', 'What does Art. 5(4) of the EU Directive allow Member States to do?', 'What five areas does HSWA s. 2(2) list?']) }
            ] },
          { id: 'duty-worker', t: B('근로자의 의무 비교', 'Workers’ duties compared'), cty: ['INT', 'KR', 'US', 'UK', 'EU', 'JP'], fld: ['law'], lv: 'intro', st: 'ok', checked: D3,
            sum: B(['여섯 법역 모두 근로자에게도 기준 준수나 협력의 의무를 둡니다.',
              'EU 기본지침은 근로자의 의무가 사용자 책임의 원칙에 영향을 주지 않는다고 명시합니다(Art.5(3)).',
              '의무의 강도와 범위가 다릅니다 — 한국은 따라야 할 의무, 일본은 협력 노력, 영국·EU는 다른 사람에 대한 주의까지 포함합니다.'],
            ['All six place duties of compliance or co-operation on workers too.',
              'The EU Directive states that workers’ obligations do not affect the principle of the employer’s responsibility (Art. 5(3)).',
              'Strength and scope differ — a duty to comply in Korea, an effort to co-operate in Japan, and care for others as well in the UK and the EU.']),
            body: [
              { k: 'tbl', cmp: true, head: B(['법역', '조문', '근로자의 의무'], ['Jurisdiction', 'Provision', 'Workers’ duties']), rows: [
                ['@INT', 'C155 Art.19(a)', B('작업을 하면서 사용자의 의무 이행에 협력', 'Co-operate, in the course of their work, in the fulfilment of the employer’s obligations')],
                ['@KR', B('산업안전보건법 제6조 (2026.2.19 개정)', 'OSH Act Art. 6 (amended 2026-02-19)'), B('법·명령의 산업재해 예방 기준을 지키고, 사업주·근로감독관·공단 등 관계인이 하는 예방 조치에 따라야 함', 'Comply with the injury-prevention standards in the Act and orders, and follow prevention measures taken by the employer, labour inspectors, KOSHA and others concerned')],
                ['@US', 'OSH Act SEC.5(b)', B('자신의 행동과 처신에 적용되는 기준과 이 법에 따른 규칙·규정·명령 준수', 'Comply with the standards and all rules, regulations and orders under the Act applicable to their own actions and conduct')],
                ['@UK', 'HSWA 1974 s.7', B('자신과, 자신의 작위·부작위로 영향을 받을 수 있는 다른 사람의 건강·안전에 합리적 주의(reasonable care), 사용자의 법정 의무 이행에 필요한 범위에서 협력', 'Take reasonable care for their own health and safety and that of others who may be affected by their acts or omissions; co-operate as far as necessary for the employer’s duties to be met')],
                ['@EU', B('지침 89/391/EEC Art.13', 'Directive 89/391/EEC Art. 13'), B('훈련과 사용자의 지시에 따라 자신과 자신의 행위로 영향을 받는 사람의 안전·보건을 가능한 한 돌봄. 기계·물질·운반 수단 등과 보호구를 올바르게 쓰고, 안전장치를 임의로 끄거나 바꾸거나 떼지 않음', 'Take care, as far as possible, of their own safety and health and that of others affected by their acts, in line with training and instructions; use machinery, substances, transport and PPE correctly; not disconnect, change or remove safety devices arbitrarily')],
                ['@JP', B('労働安全衛生法 第4条 (현행)', 'Industrial Safety and Health Act Art. 4 (current)'), B('근로자, 그리고 근로자와 같은 장소에서 작업에 종사하는 근로자 아닌 사람은 재해 방지에 필요한 사항을 지키고, 사업자 등이 하는 재해 방지 조치에 협력하도록 노력', 'Workers, and people other than workers who work at the same site as workers, observe what is needed to prevent injuries and endeavour to co-operate with the prevention measures of the employer and others')]
              ], src: ['iloC155', 'lawAct', 'oshAct', 'ukHswa', 'eu89391', 'jpIshl'] },
              { k: 'syn', t: B(['**공통점** — 근로자의 의무는 기준을 지키고 사용자의 조치에 협력하는 것이 중심입니다.',
                '**차이점** — 영국 s.7과 EU Art.13은 자신의 행위로 영향을 받는 다른 사람까지 주의 대상에 넣습니다. 한국은 ‘따라야 한다’, 일본은 ‘협력하도록 노력’으로 강도가 다릅니다.',
                '**차이점** — 일본 현행 第4条는 의무를 지는 사람을 근로자와 같은 장소에서 일하는 근로자 아닌 사람까지 넓혔습니다(2018년 판 공식 번역에는 근로자만 있음).',
                '**관계** — EU는 근로자의 의무가 사용자 책임의 원칙에 영향을 주지 않는다고 명시합니다(Art.5(3)).'],
              ['**Common ground** — workers’ duties centre on following the rules and co-operating with the employer’s measures.',
                '**Difference** — UK s. 7 and EU Art. 13 extend care to others affected by the worker’s acts; Korea says “must follow” while Japan says “endeavour to co-operate”.',
                '**Difference** — Japan’s current Art. 4 extends the duty to people other than workers who work at the same site as workers (the 2018 official translation covers workers only).',
                '**Relationship** — the EU states that workers’ obligations do not affect the principle of the employer’s responsibility (Art. 5(3)).']), src: ['ukHswa', 'eu89391', 'lawAct', 'jpIshl', 'jpIshlEn'] },
              { k: 'q', t: B(['다른 사람에 대한 주의까지 근로자의 의무에 넣은 법역은?', 'EU 기본지침에서 근로자의 의무와 사용자 책임의 관계를 정한 조항은?'],
                ['Which jurisdictions include care for other people in workers’ duties?', 'Which provision of the EU Directive sets the relationship between workers’ obligations and the employer’s responsibility?']) }
            ] }
        ] },
        ...plan('G2', [
          ['c2-4', '안전보건관리체제 — 관리자 선임', 'Safety and health organisation — appointed managers'],
          ['c2-5', '안전보건교육', 'Safety and health training'],
          ['c2-6', '산업재해 보고와 기록', 'Reporting and recording injuries'],
          ['c2-7', '감독과 처벌', 'Inspection and penalties'],
          ['c2-8', '원청·도급 책임', 'Duties of principals, clients and contractors'],
          ['c2-9', '중대재해 처벌 제도', 'Criminal liability for serious accidents'],
          ['c2-10', '나라별 상세', 'Country profiles']])
      ] },

    /* ================= 3편~부록 (계획) ================= */
    { id: 'p3', no: '3', t: B('안전보건경영시스템', 'Safety and health management systems'), d: B('PDCA 구조, ISO 45001(공개 범위), 국가 인증, PSM, 변경관리, 협력사 관리, 감사.', 'PDCA structure, ISO 45001 (public scope), national schemes, PSM, management of change, contractors, audits.'),
      ch: plan('G6', [['c3-1', '경영시스템의 구조(PDCA)', 'Structure of management systems (PDCA)'], ['c3-2', 'ISO 45001 — 공개된 범위', 'ISO 45001 — what is publicly available'], ['c3-3', '국가 인증 제도', 'National certification schemes'], ['c3-4', '공정안전관리(PSM)', 'Process safety management (PSM)'], ['c3-5', '변경관리(MOC)', 'Management of change (MOC)'], ['c3-6', '협력사 관리', 'Contractor management'], ['c3-7', '내부 감사와 경영 검토', 'Internal audit and management review']]) },
    { id: 'p4', no: '4', t: B('위험 분야별', 'Hazards by area'), d: B('기계부터 레이저까지 위험 분야마다 원리, 나라별 기준, 실무 절차.', 'From machinery to lasers — principles, national rules and practice for each hazard area.'),
      ch: [].concat(plan('G6', [['c4-1', '기계·설비', 'Machinery and equipment']]), plan('G3', [['c4-2', '전기', 'Electricity'], ['c4-3', '화재·폭발', 'Fire and explosion'], ['c4-4', '화학물질 — GHS·MSDS·노출기준', 'Chemicals — GHS, SDSs and exposure limits'], ['c4-5', '가스 — 고압·특수가스', 'Gases — high-pressure and special gases'], ['c4-6', '추락·고소작업', 'Falls and work at height'], ['c4-7', '밀폐공간', 'Confined spaces']]),
        plan('G6', [['c4-8', '중량물·운반·하역', 'Lifting, transport and loading'], ['c4-9', '건설 작업', 'Construction work'], ['c4-10', '방사선', 'Radiation'], ['c4-11', '소음·진동', 'Noise and vibration'], ['c4-12', '온열·한랭', 'Heat and cold'], ['c4-13', '생물학적 인자', 'Biological agents'], ['c4-14', '인간공학', 'Ergonomics'], ['c4-15', '직무스트레스·심리사회적 위험', 'Work stress and psychosocial risks'], ['c4-16', '정전기', 'Static electricity'], ['c4-17', '레이저', 'Lasers']])) },
    { id: 'p5', no: '5', t: B('산업·사업장별', 'By industry and workplace'), d: B('사업장의 특성에 따라 달라지는 위험과 관리 방법.', 'How hazards and their management change with the kind of workplace.'),
      ch: [].concat(plan('G4', [['c5-1', '반도체·디스플레이', 'Semiconductors and displays'], ['c5-2', '화학·석유화학', 'Chemicals and petrochemicals'], ['c5-3', '건설', 'Construction']]),
        plan('G6', [['c5-4', '일반 제조', 'General manufacturing'], ['c5-5', '물류·창고', 'Logistics and warehousing'], ['c5-6', '조선·해양', 'Shipbuilding and offshore'], ['c5-7', '발전·에너지', 'Power and energy'], ['c5-8', '실험실·연구소', 'Laboratories and research'], ['c5-9', '의료·돌봄', 'Healthcare and care'], ['c5-10', '사무·서비스', 'Offices and services'], ['c5-11', '농림어업', 'Agriculture, forestry and fishing']])) },
    { id: 'p6', no: '6', t: B('산업보건', 'Occupational health'), d: B('측정, 노출기준, 건강진단, 직업병, 보호구, 환기.', 'Monitoring, exposure limits, health surveillance, occupational disease, PPE, ventilation.'),
      ch: plan('G5', [['c6-1', '작업환경측정', 'Workplace exposure monitoring'], ['c6-2', '노출기준 체계 — 나라별 비교', 'Exposure-limit systems — country comparison'], ['c6-3', '건강진단', 'Health surveillance'], ['c6-4', '직업병', 'Occupational diseases'], ['c6-5', '보호구 — 선정과 인증', 'PPE — selection and certification'], ['c6-6', '환기 — 국소·전체', 'Ventilation — local and general']]) },
    { id: 'p7', no: '7', t: B('비상대응과 사고조사', 'Emergency response and incident investigation'), d: B('비상조치, 화학사고 대응, 응급처치, 조사 기법, 재발방지.', 'Emergency plans, chemical accidents, first aid, investigation methods, preventing recurrence.'),
      ch: plan('G5', [['c7-1', '비상조치계획', 'Emergency action plans'], ['c7-2', '화학사고 대응', 'Chemical accident response'], ['c7-3', '응급처치', 'First aid'], ['c7-4', '사고조사 기법', 'Incident investigation methods'], ['c7-5', '근본원인 분석', 'Root cause analysis'], ['c7-6', '재발방지와 수평전개', 'Preventing recurrence and sharing lessons']]) },
    { id: 'p8', no: '8', t: B('사고 사례 연구', 'Case studies'), d: B('공식 조사보고서로 본 사고와 그 교훈.', 'Accidents and their lessons, from official investigation reports.'),
      ch: plan('G4', [['c8-1', '공식 조사보고서로 본 대형 사고', 'Major accidents in official investigation reports'], ['c8-2', '반도체·화학 사고', 'Semiconductor and chemical accidents'], ['c8-3', '건설 사고', 'Construction accidents'], ['c8-4', '교훈의 공통 패턴', 'Recurring patterns in the lessons']]) },
    { id: 'p9', no: '9', t: B('환경', 'Environment'), d: B('대기·수질·폐기물, 화학물질 배출, 온실가스, 통합환경관리.', 'Air, water, waste, chemical releases, greenhouse gases, integrated permitting.'),
      ch: plan('G6', [['c9-1', '대기·수질·폐기물', 'Air, water and waste'], ['c9-2', '화학물질 배출', 'Chemical releases'], ['c9-3', '온실가스', 'Greenhouse gases'], ['c9-4', '통합환경관리', 'Integrated environmental permitting'], ['c9-5', '나라별 비교', 'Country comparison']]) },
    { id: 'p10', no: '10', t: B('교육과 소통', 'Training and communication'), d: B('성인 교육 설계, 법정 교육, TBM, 표지, 외국인·협력사 교육.', 'Adult training design, statutory training, toolbox talks, signs, training for migrant workers and contractors.'),
      ch: plan('G6', [['c10-1', '성인 교육 설계', 'Designing adult training'], ['c10-2', '법정 교육', 'Statutory training'], ['c10-3', 'TBM·작업 전 회의', 'Toolbox talks and pre-work meetings'], ['c10-4', '안전 소통과 표지', 'Safety communication and signs'], ['c10-5', '외국인·협력사 교육', 'Training for migrant workers and contractors']]) },
    { id: 'pa', no: 'A', t: B('부록', 'Appendix'), d: B('용어집, 나라별 공식 사이트·법령 데이터베이스, 기준값 원문 링크, 약어.', 'Glossary, official sites and law databases by country, links to official limit values, abbreviations.'),
      ch: plan('G6', [['ca-1', '용어집 — 한·영·원어', 'Glossary — Korean, English and original terms'], ['ca-2', '나라별 공식 사이트·법령 데이터베이스', 'Official sites and law databases by country'], ['ca-3', '기준값 원문 링크표', 'Links to official limit values'], ['ca-4', '약어', 'Abbreviations']]) }
  ];
})();

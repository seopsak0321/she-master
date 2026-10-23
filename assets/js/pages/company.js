/* SK하이닉스 이해 · 사업장 · 벤치마킹 · 출처 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui, C = S.COMPANY, esc = S.esc;

  const AREA = { psm: { ko: '공정안전', en: 'PSM' }, prevent: { ko: '예방안전', en: 'Prevention' }, sdx: { ko: 'SDX', en: 'SDX' }, partner: { ko: '상생협력', en: 'Partners' }, fire: { ko: '소방·방재', en: 'Fire' }, culture: { ko: '안전문화', en: 'Culture' } };

  const MAP = [
    { c: 'VWBE', p: { ko: '모든 모듈에 “위험 제보·제안” 입력과 조치 결과 공개 — 자발적 참여를 기록으로 남김', en: 'Every module takes hazard reports and ideas and shows the outcome — voluntary participation leaves a trace' } },
    { c: 'One Team', p: { ko: '임직원과 협력사가 같은 SOP를 보고, 협력사용 “작업 전 5분 카드”만 요약 수준을 달리함', en: 'Employees and contractors read the same SOPs; only the 5-minute card changes the level of detail' } },
    { c: 'SUPEX', p: { ko: '목표 대비 실적(통합재해율 격차)을 숨기지 않고 업무판 첫 화면에 표시', en: 'The dashboard shows the target-vs-actual gap in the injury rate instead of hiding it' } },
    { c: { ko: '예외 없는 Safety First', en: 'Safety First, no exceptions' }, p: { ko: '모든 SOP에 “작업 중지 기준”을 절차와 같은 무게로 배치', en: 'Every SOP gives its stop-work criteria the same weight as its steps' } },
    { c: 'Tenacity · Advanced Tech', p: { ko: 'SDX 모듈에서 로봇·AI 감지 이벤트를 조치 완료까지 추적', en: 'The SDX module tracks robot/AI detections through to closure' } },
    { c: 'Prosperity Together', p: { ko: '상생협력 모듈의 법정 의무 체크·협력사 평가·컨설팅 이력', en: 'Partner module: statutory duties, contractor scoring, consulting history' } }
  ];

  /* #31(13단계 K1): SK하이닉스 이해를 하위 탭으로 — 기본 정보·제품·사업 현황(data/skh.js) + 기존 안전 체계 + 확장 계획 */
  const K = () => S.SKH || {};
  const won = (m) => { const jo = Math.floor(m / 1e6), eok = Math.round((m % 1e6) / 100); return S.state.lang === 'en' ? `KRW ${(m / 1e6).toFixed(2)} tn` : `${jo ? `${jo}조 ` : ''}${eok ? `${eok.toLocaleString('ko-KR')}억` : ''}원`; };
  /* #32(13단계 K2): 공정·메모리·HBM 기술·반도체 용어 탭 추가(data/skh-proc.js) */
  /* #33(13단계 K3): 장비·소재 탭(SHE.SKH_EQ) · #35(K5): 세계 시장 탭(SHE.SKH_MKT) */
  const CO_TABS = [['profile', T => T('기본 정보', 'Profile')], ['products', T => T('제품', 'Products')], ['process', T => T('공정', 'Processes')], ['memtech', T => T('메모리·HBM 기술', 'Memory & HBM tech')], ['equip', T => T('장비·소재', 'Equipment & materials')], ['base', T => T('거점·투자', 'Sites & investment')], ['business', T => T('사업 현황', 'Business')], ['market', T => T('세계 시장', 'World market')], ['ai', T => T('반도체 × AI', 'Chips × AI')], ['terms', T => T('반도체 용어', 'Chip terms')], ['safety', T => T('개요·안전 체계', 'Overview & safety')], ['plan', T => T('확장 계획', 'Coming next')]];
  /* 탭 안의 자리로 바로 가는 주소: #company/pc-<공정>·test·pkg → 공정 탭, cells·dram·nand·hbm → 메모리·HBM 탭, litho·mat·ppe → 장비·소재 탭, mk-<칸> → 세계 시장 탭 */
  const coTabOf = (x) => (CO_TABS.some(([id]) => id === x) ? x : /^pc-/.test(x) || x === 'test' || x === 'pkg' ? 'process' : ['cells', 'dram', 'nand', 'hbm', 'roadmap'].includes(x) ? 'memtech' : ['litho', 'mat', 'ppe'].includes(x) ? 'equip' : /^bs-/.test(x) || x === 'invest' || x === 'sanction' ? 'base' : /^mk-/.test(x) ? 'market' : /^ai-/.test(x) ? 'ai' : x === 'facts' ? 'profile' : x === 'mix' ? 'business' : null);
  const extTag = (ids) => ([].concat(ids || []).some((id) => (S.SKH_EXT || []).includes(id)) ? ` <span class="tag-ext" title="${T('뉴스룸에 실린 외부 전문가 칼럼 — 원문에 SK하이닉스의 공식 입장과 다를 수 있다고 적혀 있음', 'External expert column in the newsroom — the original says it may differ from SK hynix’s official position')}">${T('외부 칼럼', 'External column')}</span>` : '');
  const nm = (x) => esc(typeof x === 'string' ? x : L(x));
  const pairs = (rows) => `<div class="table-wrap"><table class="data"><tbody>${rows.map(([k, v]) => `<tr><th scope="row" style="width:26%">${nm(k)}</th><td class="small">${esc(L(v))}</td></tr>`).join('')}</tbody></table></div>`;
  function tabProcess() {
    const P = S.SKH_PROC || {}, te = P.test || {}, pk = P.pkg || {};
    const hz = (ids) => ids.filter((id) => S.PROCESSES.some((p) => p.id === id)).map((id) => `<a class="chip" href="#hazards/${id}">${esc(L(S.PROCESSES.find((p) => p.id === id)))}</a>`).join(' ');
    return `<section class="panel">${ui.title(T('메모리 반도체가 만들어지는 길', 'How a memory chip is made'), T('웨이퍼에서 출하까지 — SK하이닉스 뉴스룸 공정 해설 원문', 'From wafer to shipment — from SK hynix newsroom process articles'))}
        <ol class="proc p6 flow">${(P.flow || []).map((f, i) => `<li><span class="row" style="gap:8px;flex-wrap:nowrap"><span class="no">${i + 1}</span><b>${nm(f.t)}</b></span><span class="d">${esc(L(f.d))}${S.cite(f.src)}</span></li>`).join('')}</ol>
        <ul class="facts" style="margin-top:12px">${(P.flowNotes || []).map((n) => `<li>${esc(L(n.t))}${S.cite(n.src)}${extTag(n.src)}</li>`).join('')}</ul>
        <div class="grid g4" style="margin-top:10px">${(P.biz || []).map((b) => `<div class="kpi"><span class="k">${nm(b.t)}</span><span class="small">${esc(L(b.d))}</span></div>`).join('')}</div>
        <p class="xs muted" style="margin-top:8px">${T('반도체 업종 구분', 'Industry roles')}${S.cite('nrBeTest')} · ${T('‘외부 칼럼’은 뉴스룸에 실린 외부 전문가 칼럼(원문 끝에 “SK하이닉스의 공식 입장과는 다를 수 있습니다” 명시)입니다. 회사 고유 기술의 정의와 제품 수치는 회사 보도자료·인터뷰에서만 가져왔고, 칼럼의 비용·처리량 같은 추정치는 넣지 않았습니다.', '“External column” marks expert columns in the newsroom whose originals say they may differ from SK hynix’s official position. Company-technology definitions and product figures come only from company press releases and interviews; columnists’ estimates of cost or throughput are left out.')}</p>
      </section>
      <nav class="row" aria-label="${T('공정 바로가기', 'Jump to a step')}">${(P.steps || []).map((s) => `<a class="chip" href="#company/pc-${s.id}">${nm(s.t)}</a>`).join('')}<a class="chip" href="#company/test">${T('테스트', 'Test')}</a><a class="chip" href="#company/pkg">${T('패키지', 'Packaging')}</a></nav>
      <section class="grid g2">${(P.steps || []).map((s) => `<article class="panel stack" style="gap:8px;align-content:start" id="anchor-pc-${s.id}">
          <h3 style="font-size:calc(17px * var(--fz))">${nm(s.t)}${S.cite(s.src)}${extTag(s.src)}</h3>
          <p class="small"><b>${esc(L(s.why))}</b></p>
          <ul class="facts">${s.how.map((h) => `<li>${esc(L(h))}</li>`).join('')}</ul>
          ${(() => { const eq = ((S.SKH_EQ || {}).map || []).filter((r) => r.step === s.id); return eq.length ? `<div class="small"><b>${T('주요 장비', 'Main tools')}</b> · ${eq.map((r) => `${nm(r.t)} (${r.ex.map((e) => esc(e[0])).join(' · ')})`).join(', ')} <a href="#company/equip">${T('장비 지도', 'Tool map')} →</a></div>` : ''; })()}
          ${s.hz.length ? `<div class="small row" style="gap:6px">${T('이 공정의 유해위험 카드', 'Hazard card for this step')} ${hz(s.hz)}</div>` : ''}
        </article>`).join('')}</section>
      <section class="panel" id="anchor-test">${ui.title(T('테스트', 'Test'), T('웨이퍼 테스트 → 패키지 테스트, 신뢰성 시험', 'Wafer test → package test, reliability tests'))}
        <div class="grid g2">
          <div class="stack" style="gap:6px"><b class="small">${T('웨이퍼 테스트 순서', 'Wafer test, in order')}</b>${pairs(te.wafer || [])}</div>
          <div class="stack" style="gap:6px"><b class="small">${T('패키지 테스트 순서', 'Package test, in order')}</b>${pairs(te.pkg || [])}
            <b class="small">${T('테스트 분류', 'Kinds of test')}</b>${pairs(te.kinds || [])}</div>
        </div>
        <p class="small" style="margin-top:10px">${esc(L(te.relIntro || ''))}</p>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('구분', 'Group')}</th><th>${T('시험', 'Tests')}</th><th>${T('무엇을 보나', 'What they check')}</th></tr></thead><tbody>${(te.rel || []).map(([g, n, d]) => `<tr><td class="nowrap"><b>${esc(L(g))}</b></td><td class="small">${esc(n)}</td><td class="small">${esc(L(d))}</td></tr>`).join('')}</tbody></table></div>${S.cite(te.src || [])}
      </section>
      <section class="panel stack" id="anchor-pkg">${ui.title(T('패키지', 'Packaging'), T('역할·종류·공정·재료', 'Roles, types, processes and materials'))}
        <div class="grid g4">${(pk.roles || []).map(([k, v]) => `<div class="kpi"><span class="k">${nm(k)}</span><span class="small">${esc(L(v))}</span></div>`).join('')}</div>
        <ul class="facts">${(pk.notes || []).map((n) => `<li>${esc(L(n))}</li>`).join('')}</ul>
        ${(pk.types || []).map((g) => `<b class="small">${esc(L(g.g))}</b>${pairs(g.items)}`).join('')}
        <b class="small">${T('컨벤셔널 패키지 공정 (서브스트레이트형)', 'Conventional package flow (substrate type)')}</b>${pairs((pk.conv || []).map(([k, v], i) => [`${i + 1}. ${L(k)}`, v]))}
        <b class="small">${T('웨이퍼 레벨 패키지 공정', 'Wafer-level package processes')}</b>${pairs(pk.wlp || [])}
        <b class="small">${T('패키지 재료', 'Package materials')}</b>${pairs(pk.mat || [])}
        <p class="small"><a href="#hazards/wlp">${T('웨이퍼 레벨 패키지의 유해위험 카드', 'Hazard card for wafer-level packaging')} →</a> · <a href="#company/hbm">${T('HBM 적층 공정', 'HBM stacking flow')} →</a></p>
        <div>${S.cite(pk.src || [])}</div>
      </section>`;
  }
  function tabMem() {
    const M = S.SKH_MEM || {}, c = M.compare || {}, d = M.dram || {}, n = M.nand || {}, h = M.hbm || {};
    return `<section class="panel" id="anchor-cells">${ui.title(T('D램과 낸드', 'DRAM and NAND'), T('셀 구조와 성질', 'Cell structure and behaviour'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('항목', 'Item')}</th><th>DRAM</th><th>NAND</th></tr></thead><tbody>${(c.rows || []).map(([k, a, b]) => `<tr><th scope="row">${esc(L(k))}</th><td class="small">${esc(L(a))}</td><td class="small">${esc(L(b))}</td></tr>`).join('')}</tbody></table></div>
        <p class="xs muted">${S.cite(c.src || [])}${extTag(c.src)} · <a href="#company/products">${T('SK하이닉스 제품 전체 지도', 'SK hynix product map')} →</a></p>
      </section>
      <section class="grid g2">
        <div class="panel" id="anchor-dram">${ui.title(T('D램 공정 세대', 'DRAM process nodes'), '1x → 1c')}
          <ul class="facts">${(d.facts || []).map((x) => `<li>${esc(L(x))}</li>`).join('')}</ul>${S.cite(d.src || [])}</div>
        <div class="panel" id="anchor-nand">${ui.title(T('낸드 — 셀당 비트와 4D 낸드', 'NAND — bits per cell and 4D NAND'))}
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('방식', 'Type')}</th><th class="num">${T('셀당 비트', 'Bits per cell')}</th><th class="num">${T('상태 수', 'States')}</th><th class="num">${T('읽기 판별', 'Read levels')}</th></tr></thead><tbody>${(n.cells || []).map(([k, b, s, r]) => `<tr><td><b>${k}</b></td><td class="num">${b}</td><td class="num">${s}</td><td class="num">${r}</td></tr>`).join('')}</tbody></table></div>
          <p class="xs muted">${esc(L(n.cellNote || ''))}</p>
          <div class="stack" style="gap:6px">${(n.tech || []).map((x) => `<div class="small"><b>${nm(x.t)}</b> — ${esc(L(x.d))}</div>`).join('')}</div>${S.cite(n.src || [])}
        </div>
      </section>
      <section class="panel stack" id="anchor-hbm">${ui.title('HBM', T('정의·구조·적층 공정', 'Definition, structure and stacking'))}
        <p>${esc(L(h.def || ''))}${S.cite(h.defSrc || [])}</p>
        <p class="small">${esc(L(h.io || ''))}${S.cite(h.ioSrc || [])}</p>
        <div class="grid g2">${(h.parts || []).map((p) => `<article class="stack" style="gap:6px;align-content:start;border-top:2px solid var(--ink);padding-top:10px"><b>${nm(p.t)}${S.cite(p.src)}${extTag(p.src)}</b><ul class="facts">${p.d.map((x) => `<li>${esc(L(x))}</li>`).join('')}</ul></article>`).join('')}</div>
      </section>
      <section class="panel">${ui.title(T('SK하이닉스 HBM 연표', 'SK hynix HBM timeline'), T('날짜는 보도자료·인터뷰 원문', 'Dates from press releases and interviews'))}
        <ol class="timeline">${(h.timeline || []).map((x) => `<li><span class="num">${esc(x.d)}</span> <span>${esc(L(x.t))}${S.cite(x.src)}</span></li>`).join('')}</ol>
        <p class="xs muted">${T('수치는 각 발표 시점의 값입니다. 지금 파는 제품의 사양은 ‘제품’ 탭(공식 제품 사이트)을 보세요.', 'Figures are as announced at each date; for current specifications see the Products tab (official product site).')}</p>
      </section>
      <section class="panel stack" id="anchor-roadmap">${ui.title(T('HBM 다음 — 차세대 메모리·시스템 로드맵', 'After HBM — next-generation memory and system roadmap'), T('회사가 발표한 것만, 단계는 원문 표현대로', 'Only what the company has announced; stages as the originals put them'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('기술', 'Technology')}</th><th>${T('단계', 'Stage')}</th><th>${T('발표', 'Announced')}</th><th>${T('무엇인가', 'What it is')}</th></tr></thead><tbody>
          ${(M.road || []).map((r) => `<tr><td class="nowrap"><b>${nm(r.t)}</b></td><td class="small">${esc(L(r.st))}</td><td class="nowrap small">${esc(String(r.d).replace(/-/g, '.'))}</td><td class="small">${esc(L(r.what))}${S.cite(r.src)}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="xs muted">${T('‘전시’·‘시연’·‘연구’는 아직 양산 제품이 아니라는 뜻입니다. 계획 시점은 발표 때의 계획입니다. HBM과 AI 가속기의 관계는 ‘반도체 × AI’ 탭에 있습니다.', '“Exhibited”, “demonstrated” and “research” mean not yet a volume product. Planned dates are as announced. How HBM relates to AI accelerators is in the Chips × AI tab.')} <a href="#company/ai-mem">${T('AI 메모리', 'AI memory')} →</a></p>
      </section>`;
  }
  function tabEquip() {
    const E = S.SKH_EQ || {}, li = E.litho || {}, am = E.amat || {}, pp = E.ppe || {};
    const stepLink = (id) => { const s = ((S.SKH_PROC || {}).steps || []).find((x) => x.id === id); return s ? `<a class="xs" href="#company/pc-${id}">${T('공정', 'Step')}: ${nm(s.t)}</a>` : ''; };
    const cell = (c) => esc(typeof c === 'string' ? c : L(c));
    return `<section class="panel">${ui.title(T('공정별 장비 지도', 'Tools by process'), T('장비 회사 공식 제품 화면과 정부 공시로 확인', 'Checked on toolmakers’ official product pages and government filings'))}
        <p class="small">${T('반도체 공장의 단위 공정마다 전문 장비가 있고, 한 공정에도 여러 회사의 장비가 쓰입니다. 아래 제품 이름은 각 회사가 공식 화면에 올린 것을 옮겼습니다.', 'Every unit process in a fab has specialised tools, often from several makers. The product names below are copied from each company’s official pages.')}</p>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('장비', 'Tool')}</th><th>${T('하는 일', 'What it does')}</th><th>${T('회사 공식 자료의 제품 예', 'Examples from company sources')}</th></tr></thead><tbody>
          ${(E.map || []).map((r) => `<tr><td style="min-width:8em"><b>${nm(r.t)}</b>${r.step ? `<div>${stepLink(r.step)}</div>` : ''}</td><td class="small">${esc(L(r.d))}</td><td class="small">${r.ex.map(([v, x]) => `<div style="margin-bottom:4px"><b>${esc(v)}</b> — ${esc(L(x))}</div>`).join('')}${S.cite(r.src)}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="xs muted">${T('SK하이닉스가 어떤 회사의 장비를 쓰는지는 회사가 직접 공개한 경우(아래 노광 장비)만 적었습니다. ‘점유율 2위’ 같은 표현은 그 장비 회사의 설명입니다. 공식 화면이 자동 접속을 막은 회사(Applied Materials 등)는 미국 SEC에 낸 연차보고서로만 적었습니다.', 'Which makers’ tools SK hynix uses is stated only where the company itself has disclosed it (lithography, below). Phrases such as “second-largest share” are each toolmaker’s own statement. Makers whose official pages refuse automated access (such as Applied Materials) are described only from their annual reports filed with the US SEC.')}</p>
      </section>
      <section class="panel stack" id="anchor-litho">${ui.title(T('노광 장비 자세히 — ASML', 'Lithography in depth — ASML'), T('공식 제품 화면의 사양', 'Specifications from official product pages'))}
        <div class="table-wrap"><table class="data"><thead><tr>${L(li.head || B0).map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${(li.rows || []).map((r) => `<tr>${r.map((c, i) => `<td class="${i === 0 ? 'nowrap' : 'small'}">${i === 0 ? `<b>${cell(c)}</b>` : cell(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
        <ul class="facts">${(li.facts || []).map((f) => `<li>${esc(L(f))}</li>`).join('')}</ul>${S.cite(li.src || [])}
        <b class="small">${T('SK하이닉스의 EUV 도입', 'EUV at SK hynix')}</b>
        <ol class="timeline">${(li.skh || []).map((x) => `<li><span class="num">${esc(x.d)}</span> <span>${esc(L(x.t))}${S.cite(x.src)}</span></li>`).join('')}</ol>
        <p class="xs muted">${T('#32에서 칼럼에 있던 ‘노광기 시간당 약 100장’을 넣지 않았는데, 공식 사양(NXE:3800E 220장 이상, EXE:5200B 175장 이상)과 다른 값이었습니다. 처리량은 노광량(mJ/cm²) 조건에 따라 달라집니다.', 'In #32 the column’s “about 100 wafers an hour” was left out; it differs from the official specifications (NXE:3800E ≥220, EXE:5200B ≥175). Throughput depends on the dose (mJ/cm²).')}</p>
      </section>
      <section class="grid g2">
        <div class="panel stack" id="anchor-mat">${ui.title(T('소재 국산화와 공급망', 'Materials: localisation and supply'), T('회사 보도자료·인터뷰', 'Company press releases and interviews'))}
          <ol class="timeline">${(E.mat || []).map((x) => `<li><span class="num">${esc(x.d)}</span> <span>${esc(L(x.t))}${S.cite(x.src)}</span></li>`).join('')}</ol>
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('소재', 'Material')}</th><th>${T('쓰는 공정', 'Used in')}</th></tr></thead><tbody>${(E.gas || []).map(([id, n, p]) => `<tr><td>${id ? `<a href="#hazards/${id}">${esc(L(n))}</a>` : esc(L(n))}</td><td class="small">${esc(L(p))}</td></tr>`).join('')}</tbody></table></div>
          <p class="xs muted">${T('밑줄 친 물질은 포털 물질 DB(노출기준·위험 특성)로 이어집니다.', 'Linked substances open the portal’s substance database (exposure limits, hazards).')}${S.cite('nrMatAward25', 'nrNeon', 'nrAld', 'nrMetal')} · <a href="#company/business">${T('원재료 매입 구성(웨이퍼·Substrate·PCB)은 사업 현황', 'Purchases by material (wafers, substrates, PCBs) are under Business')} →</a></p>
        </div>
        <div class="panel stack" id="anchor-ppe">${ui.title(T('설비 자산과 투자', 'Equipment assets and investment'), T('반기보고서 유형자산(연결, 2026.6.30)', 'Half-year report, property, plant and equipment (consolidated, 30 June 2026)'))}
          <div class="table-wrap"><table class="data"><tbody>
            <tr><th scope="row">${T('유형자산 순장부금액', 'PP&E, net book value')}</th><td class="num">${won(pp.net || 0)}</td></tr>
            <tr><th scope="row">${T('· 그중 기계장치', '· of which machinery')}</th><td class="num">${won(pp.mach || 0)}</td></tr>
            <tr><th scope="row">${T('· 그중 건설중인자산', '· of which construction in progress')}</th><td class="num">${won(pp.cip || 0)}</td></tr>
            <tr><th scope="row">${T('상반기 취득(설비 투자)', 'H1 additions (capital spending)')}</th><td class="num">${won(pp.acq || 0)}</td></tr>
            <tr><th scope="row">${T('· 기계장치 / 건설중인자산', '· machinery / construction in progress')}</th><td class="num">${won(pp.acqMach || 0)} / ${won(pp.acqCip || 0)}</td></tr>
            <tr><th scope="row">${T('상반기 감가상각', 'H1 depreciation')}</th><td class="num">${won(pp.dep || 0)}</td></tr>
            <tr><th scope="row">${T('기계장치 취득원가(누적)', 'Machinery at cost (cumulative)')}</th><td class="num">${won(pp.machCost || 0)}</td></tr>
          </tbody></table></div>${S.cite(pp.src || [])}
          <b class="small">${esc(L(am.t || ''))}</b>
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('회계연도', 'Fiscal year')}</th><th class="num">${T('파운드리·로직', 'Foundry/logic')}</th><th class="num">${T('D램', 'DRAM')}</th><th class="num">${T('낸드', 'NAND')}</th></tr></thead><tbody>${(am.rows || []).map(([y, a, b, c]) => `<tr><td>${y}</td><td class="num">${a}%</td><td class="num">${b}%</td><td class="num">${c}%</td></tr>`).join('')}</tbody></table></div>
          <p class="xs muted">${esc(L(am.note || ''))}${S.cite(am.src || [])}</p>
        </div>
      </section>`;
  }
  const B0 = { ko: [], en: [] };
  /* #34(13단계 K4): 생산 거점·투자·행정 조치(SHE.SKH_BASE) */
  function tabBase() {
    const G = S.SKH_BASE || {};
    const dl = (d) => esc(String(d || '').replace(/-/g, '.'));
    return `<section class="panel stack">${ui.title(T('생산 거점 지도', 'Where SK hynix makes chips'), T('반기보고서와 회사 보도자료·FACT 원문', 'Half-year report and company press releases and FACT notes'))}
        <p class="small">${esc(L(G.running || ''))}${S.cite('skhH1_2026')}</p>
        <nav class="row" aria-label="${T('거점 바로가기', 'Jump to a site')}">${(G.sites || []).map((s) => `<a class="chip" href="#company/bs-${s.id}">${nm(s.t)}</a>`).join('')}<a class="chip" href="#company/invest">${T('투자 공시', 'Investment filings')}</a><a class="chip" href="#company/sanction">${T('행정 조치', 'Administrative actions')}</a><a class="chip" href="#company/mk-policy">${T('각국 반도체 정책', 'National chip policies')}</a></nav>
      </section>
      <section class="grid g2">${(G.sites || []).map((s) => `<article class="panel stack" style="gap:8px;align-content:start" id="anchor-bs-${s.id}">
          <h3 style="font-size:calc(17px * var(--fz))">${nm(s.t)}</h3>
          <p class="small"><b>${esc(L(s.role))}</b></p>
          <ol class="timeline">${s.items.map((x) => `<li><span class="num">${x.d ? dl(x.d) : '–'}</span> <span>${esc(L(x.t))}${S.cite(x.src)}</span></li>`).join('')}</ol>
          ${s.id === 'icheon' || s.id === 'cheongju' ? `<div class="small"><a href="#sites">${T('사업장 안전 프로필', 'Site safety profile')} →</a></div>` : ''}
        </article>`).join('')}</section>
      <section class="panel stack">${ui.title(T('해외·국내 법인 (연결 종속기업)', 'Subsidiaries (consolidated)'), T('반기보고서 종속기업 표의 주요 영업활동', 'Main activity as given in the half-year report’s subsidiary table'))}
        ${pairs((G.subs || []).map((x) => [x.k, { ko: x.v, en: x.en }]))}
        <p class="xs muted">${esc(L(G.subsNote || ''))}${S.cite('skhH1_2026')}</p>
      </section>
      <section class="panel stack" id="anchor-invest">${ui.title(T('투자 공시·발표', 'Investment filings and announcements'), T('공정공시·신규시설투자·이사회 결의 — 날짜순', 'Fair-disclosure filings, new-facility investments and board decisions — by date'))}
        <ol class="timeline">${(G.invest || []).map((x) => `<li><span class="num">${dl(x.d)}</span> <span>${esc(L(x.t))}${S.cite(x.src)}</span></li>`).join('')}</ol>
        <ul class="facts">${(G.investNotes || []).map((n) => `<li>${esc(L(n.t))}${S.cite(n.src)}</li>`).join('')}</ul>
        <p class="xs muted">${T('금액은 발표 때의 계획이며, 회사는 수요에 맞춰 단계적으로 집행한다고 밝혔습니다. 분기 실적과 설비 자산은 ‘사업 현황’과 ‘장비·소재’ 탭에 있습니다.', 'Amounts are plans as announced; the company says it spends in stages with demand. Quarterly results and equipment assets are in the Business and Equipment & materials tabs.')} <a href="#company/business">${T('분기 실적', 'Quarterly results')} →</a> · <a href="#company/ppe">${T('설비 자산', 'Equipment assets')} →</a></p>
      </section>
      <section class="panel stack" id="anchor-sanction">${ui.title(T('안전·환경 행정 조치 (회사 공시)', 'Safety and environmental administrative actions (company filing)'), T('반기보고서 ‘제재 등과 관련된 사항’, 2024~2026년 6월', 'Half-year report, “sanctions”, 2024 – June 2026'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('날짜', 'Date')}</th><th>${T('기관', 'Authority')}</th><th>${T('조치', 'Action')}</th><th>${T('사유', 'Reason')}</th><th>${T('회사 조치', 'Company response')}</th></tr></thead><tbody>
          ${(G.sanctions || []).map((x) => `<tr><td class="nowrap">${dl(x.d)}</td><td class="small">${esc(L(x.org))}</td><td class="small">${esc(L(x.act))}</td><td class="small">${esc(L(x.why))}</td><td class="small">${esc(L(x.fix))}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="xs muted">${esc(L(G.sanctionsNote || ''))}${S.cite(G.src || [])} · <a href="#cases/cj-2026-gasroom">${T('청주 가스룸 사고 사례', 'Cheongju gas-room case')} →</a></p>
      </section>`;
  }
  /* #35(13단계 K5): 세계 반도체 시장(SHE.SKH_MKT) — 금액은 각 회사 보고 통화 그대로(백만 단위) */
  const CUR = { KRW: ['KRW ', '원'], USD: ['US$', '달러'], EUR: ['€', '유로'], TWD: ['NT$', '대만달러'], JPY: ['¥', '엔'] };
  const money = (m, cur) => {
    if (m == null) return '–';
    if (cur === 'KRW') return won(m);
    const [sym, ko] = CUR[cur] || ['', ''];
    if (S.state.lang === 'en') return m >= 1e6 ? `${sym}${(m / 1e6).toFixed(2)} tn` : `${sym}${(m / 1e3).toFixed(1)} bn`;
    const eok = Math.round(m / 100), jo = Math.floor(eok / 1e4), rest = eok % 1e4;
    return `${jo ? `${jo}조 ` : ''}${rest ? `${rest.toLocaleString('ko-KR')}억 ` : ''}${ko}`;
  };
  function tabMarket() {
    const M = S.SKH_MKT || {}, W = M.wsts || {}, en = S.state.lang === 'en';
    const usd = (m) => money(m, 'USD');
    const pct = (g) => `${g > 0 ? '+' : ''}${g.toFixed(1)}%`;
    const sk = ((K().results || {}).years || [])[1] || {};
    const firms = (M.firms || []).map((f) => (f.id === 'skh' ? Object.assign({}, f, { rev: sk.rev, op: sk.op, ni: sk.ni }) : f));
    const yearBars = (W.years || []).map(([y, m]) => ({ label: `<span class="mono">${y}</span>`, v: en ? m / 1e3 : m / 100, tone: y === 2025 ? 'hi' : '' }))
      .concat((W.fc || []).map(([y, m, g]) => ({ label: `<span class="mono">${y}</span> ${T('전망', 'forecast')}`, v: en ? m / 1e3 : m / 100, note: pct(g) })));
    return `<section class="panel stack" id="anchor-mk-wsts">${ui.title(T('세계 반도체 시장 규모', 'Size of the world chip market'), T('WSTS(세계반도체무역통계기구) — 반도체 회사들이 만든 비영리 통계 기구의 공식 발표', 'WSTS (World Semiconductor Trade Statistics) — official releases of the non-profit statistics body formed by chip companies'))}
        <nav class="row" aria-label="${T('세계 시장 바로가기', 'Jump within world market')}"><a class="chip" href="#company/mk-wsts">${T('시장 규모', 'Market size')}</a><a class="chip" href="#company/mk-firms">${T('기업 비교', 'Companies')}</a><a class="chip" href="#company/mk-kr">${T('장비 회사의 한국 매출', 'Toolmakers’ Korean sales')}</a><a class="chip" href="#company/mk-us">${T('미국 매출 비중', 'US share')}</a><a class="chip" href="#company/mk-policy">${T('각국 정책', 'Policies')}</a></nav>
        <div class="grid g2">
          <div class="stack" style="gap:8px">${ui.bars(yearBars, { caption: T('연간 세계 매출(실적 2015~2025, 전망 2026·2027)', 'World sales by year (actual 2015–2025, forecast 2026–2027)'), unit: T('억 달러', 'US$ bn'), fmt: (x) => (en ? x.toLocaleString('en', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : Math.round(x).toLocaleString('ko-KR')), aria: T('연간 세계 반도체 매출', 'World semiconductor sales by year') })}
            <p class="xs muted">${T('실적은 Historical Billings Report(2026년 8월 자료)의 연간 합계, 전망은 2026년 봄 전망(6월 2일).', 'Actuals are the yearly totals in the Historical Billings Report (August 2026 data); forecasts are from the Spring 2026 forecast (2 June).')}${S.cite(W.src || [])}</p></div>
          <div class="stack" style="gap:8px">
            <div class="table-wrap"><table class="data"><thead><tr><th>${T('2025년 제품별', '2025 by product')}</th><th class="num">${T('매출', 'Sales')}</th><th class="num">${T('전년 대비', 'YoY')}</th></tr></thead><tbody>${(W.products || []).map(([k, m, g]) => `<tr><td>${nm(k)}</td><td class="num">${usd(m)}</td><td class="num">${pct(g)}</td></tr>`).join('')}</tbody></table></div>
            <div class="table-wrap"><table class="data"><thead><tr><th>${T('지역', 'Region')}</th><th class="num">${T('2025년', '2025')}</th><th class="num">${T('2025 증가', '2025 growth')}</th><th class="num">${T('2026 전망 증가', '2026 forecast growth')}</th></tr></thead><tbody>${(W.regions || []).map(([k, m, g, f]) => `<tr><td>${nm(k)}</td><td class="num">${usd(m)}</td><td class="num">${pct(g)}</td><td class="num">${pct(f)}</td></tr>`).join('')}</tbody></table></div>
            <div class="table-wrap"><table class="data"><thead><tr><th>${T('전망', 'Forecast')}</th><th class="num">${T('세계', 'World')}</th><th class="num">${T('메모리', 'Memory')}</th><th class="num">${T('로직', 'Logic')}</th></tr></thead><tbody>${(W.fc || []).map(([y, m, g, mm, mg, lm, lg]) => `<tr><td class="mono">${y}</td><td class="num">${usd(m)} <span class="xs muted">${pct(g)}</span></td><td class="num">${usd(mm)} <span class="xs muted">${pct(mg)}</span></td><td class="num">${usd(lm)} <span class="xs muted">${pct(lg)}</span></td></tr>`).join('')}</tbody></table></div>${S.cite('wstsSpring26')}
          </div>
        </div>
        <ul class="facts">${(W.notes || []).map((n) => `<li>${esc(L(n.t))}${S.cite(n.src)}</li>`).join('')}</ul>
        <p class="xs muted">${T('제품·지역 구분은 WSTS 분류를 따릅니다. 회사 보고서가 인용한 조사기관의 메모리 시장·점유율 값은 ‘사업 현황’ 탭에 있습니다.', 'Products and regions follow the WSTS classes. Memory market and share figures that the company’s report cites from research firms are in the Business tab.')} <a href="#company/business">${T('사업 현황', 'Business')} →</a></p>
      </section>
      <section class="panel stack" id="anchor-mk-firms">${ui.title(T('반도체 기업 비교 — 최근 회계연도', 'Chip companies compared — latest fiscal year'), T('각 회사가 미국 SEC에 낸 연차보고서(10-K·20-F)와 회사 IR의 감사 재무제표·결산 자료', 'Annual reports filed with the US SEC (10-K, 20-F) and audited statements and results material on company IR sites'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('회사', 'Company')}</th><th>${T('나라·분야', 'Country, field')}</th><th>${T('회계연도', 'Fiscal year')}</th><th class="num">${T('매출', 'Revenue')}</th><th class="num">${T('영업이익', 'Operating profit')}</th><th class="num">${T('순이익', 'Net income')}</th><th class="num">${T('영업이익률', 'Op. margin')}</th></tr></thead><tbody>
          ${firms.map((f) => `<tr><td class="nowrap"><b>${nm(f.n)}</b>${S.cite(f.src)}</td><td class="small">${nm(f.c)} · ${esc(L(f.role))}</td><td class="small">${esc(L(f.fy))}</td><td class="num">${money(f.rev, f.cur)}</td><td class="num">${money(f.op, f.cur)}</td><td class="num">${money(f.ni, f.cur)}</td><td class="num">${f.rev && f.op != null ? `${(f.op / f.rev * 100).toFixed(1)}%` : '–'}</td></tr>${f.note ? `<tr><td></td><td colspan="6" class="xs muted">${esc(L(f.note))}</td></tr>` : ''}`).join('')}
        </tbody></table></div>
        <p class="xs muted">${T('금액은 각 회사가 보고한 통화 그대로이고 환율로 바꾸지 않았습니다. 회계연도가 회사마다 다르고(마이크론 2026년 9월, 램리서치·KLA 2026년 6월, 도쿄일렉트론 2026년 3월, 엔비디아 2026년 1월 결산 등), SK하이닉스와 삼성전자는 2025년 1~12월입니다. 영업이익률은 표의 두 값으로 포털이 계산했고, ‘–’는 그 보고서에 해당 줄이 없거나 부문 값을 공시하지 않은 것입니다.', 'Amounts are in each company’s reporting currency, not converted. Fiscal years differ (Micron to September 2026, Lam and KLA to June 2026, Tokyo Electron to March 2026, NVIDIA to January 2026), while SK hynix and Samsung report January–December 2025. Operating margin is computed by the portal from the two figures; “–” means the report has no such line or the segment figure is not disclosed.')}</p>
        ${(() => { const Q = M.latest || {}; return (Q.rows || []).length ? `<b class="small" id="anchor-mk-latest">${T(`최근 분기 — ${Q.asof} 갱신`, `Latest quarter — refreshed ${Q.asof}`)}</b>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('회사', 'Company')}</th><th>${T('기간', 'Period')}</th><th class="num">${T('매출', 'Revenue')}</th><th class="num">${T('전년 같은 분기 대비', 'YoY')}</th><th class="num">${T('영업이익', 'Operating profit')}</th><th class="num">${T('순이익', 'Net income')}</th></tr></thead><tbody>
          ${Q.rows.map((f) => `<tr><td class="nowrap"><b>${esc(f.n)}</b>${S.cite(f.src)}</td><td class="small">${esc(L(f.p))}</td><td class="num">${money(f.rev, f.cur)}</td><td class="num">${f.yoy != null ? `+${f.yoy}%${f.yoyCalc ? ` <span class="xs muted">${T('계산', 'calc.')}</span>` : ''}` : '–'}</td><td class="num">${money(f.op, f.cur)}</td><td class="num">${money(f.ni, f.cur)}</td></tr><tr><td></td><td colspan="5" class="xs muted">${esc(L(f.note))}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="xs muted">${esc(L(Q.note || ''))}</p>` : ''; })()}
        <b class="small">${T('다른 회사의 공시에 나오는 SK하이닉스', 'SK hynix in other companies’ filings')}</b>
        <ul class="facts">${(M.links || []).map((x) => `<li>${esc(L(x.t))}${S.cite(x.src)}</li>`).join('')}</ul>
      </section>
      <section class="panel stack" id="anchor-mk-kr">${ui.title(T('장비 회사 매출 가운데 한국', 'Korea in toolmakers’ revenue'), T('각 회사 연차보고서의 지역별 매출', 'Revenue by region in each company’s annual report'))}
        ${ui.bars((M.korea || []).map(([n, fy, v, prev, , calc]) => ({ label: `${esc(n)} <span class="xs muted">${esc(fy)}</span>`, v, note: [prev != null ? T(`전년 ${prev}%`, `prior year ${prev} %`) : '', calc ? T('포털 계산', 'portal calc.') : ''].filter(Boolean).join(' · ') })), { unit: '%', fmt: (x) => { const r = (M.korea || []).find((k) => k[2] === x); return x.toFixed(r ? r[7] : 1); }, max: 30, aria: T('장비 회사 매출 중 한국 비중', 'Korea’s share of toolmakers’ revenue') })}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('회사', 'Company')}</th><th>${T('기준', 'Basis')}</th></tr></thead><tbody>${(M.korea || []).map(([n, , , , b, , s]) => `<tr><td class="nowrap">${esc(n)}${S.cite(s)}</td><td class="small">${esc(L(b))}</td></tr>`).join('')}</tbody></table></div>
        <p class="xs muted">${esc(L(M.koreaNote || ''))} <a href="#company/equip">${T('공정별 장비 지도', 'Tool map by process')} →</a></p>
      </section>
      ${(M.us || []).length ? `<section class="panel stack" id="anchor-mk-us">${ui.title(T('미국(북미) 매출 비중 — 회사별 공시 기준', 'US (North America) share of revenue — each company’s own basis'), T('반도체를 파는 회사와 장비 회사의 차이', 'Chip sellers versus toolmakers'))}
        ${ui.bars(M.us.map(([n, p, v, , calc]) => ({ label: `${esc(n)} <span class="xs muted">${esc(typeof p === 'string' ? p : L(p))}</span>`, v, note: calc ? T('포털 계산', 'portal calc.') : '' })), { unit: '%', max: 100, fmt: (x) => { const r = M.us.find((k) => k[2] === x); return x.toFixed(r ? r[6] : 1); }, aria: T('회사별 미국 매출 비중', 'US share of revenue by company') })}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('회사', 'Company')}</th><th>${T('기준', 'Basis')}</th></tr></thead><tbody>${M.us.map(([n, , , b, , s]) => `<tr><td class="nowrap">${esc(n)}${S.cite(s)}</td><td class="small">${esc(L(b))}</td></tr>`).join('')}</tbody></table></div>
        <p class="xs muted">${esc(L(M.usNote || ''))} <a href="#company/mix">${T('SK하이닉스 지역별 매출', 'SK hynix revenue by region')} →</a></p>
      </section>` : ''}
      <section class="panel stack" id="anchor-mk-policy">${ui.title(T('각국 반도체 정책', 'National chip policies'), T('법령 원문 — 국가법령정보센터·미국 govinfo·EUR-Lex·일본 e-Gov·대만 전국법규자료고', 'Statute texts — Korea’s law portal, US govinfo, EUR-Lex, Japan’s e-Gov, Taiwan’s law database'))}
        <div class="grid g2">${(M.policy || []).map((p) => `<article class="stack" style="gap:6px;align-content:start" id="anchor-mk-${p.id}">
          <h3 style="font-size:calc(16px * var(--fz))"><span class="chip">${nm(p.c)}</span> ${esc(L(p.t))}${S.cite(p.src)}</h3>
          <p class="xs muted">${esc(L(p.d))}</p>
          <ul class="facts">${p.items.map((x) => `<li>${esc(L(x))}</li>`).join('')}</ul>
        </article>`).join('')}</div>
        <p class="xs muted">${esc(L(M.policyNote || ''))}${S.cite('skhH1_2026')} · <a href="#company/bs-indiana">${T('인디애나 거점', 'Indiana site')} →</a> · <a href="#company/invest">${T('투자 공시', 'Investment filings')} →</a></p>
      </section>`;
  }
  /* #36(13단계 K6): 반도체 현장 × AI(SHE.SKH_AI) — 안전 분야는 회사 안전 프로그램(C.programs의 sdx)을 그대로 */
  function tabAi() {
    const A = S.SKH_AI || {};
    const dl = (d) => esc(String(d || '').replace(/-/g, '.'));
    const planTag = ` <span class="chip">${T('계획·방향', 'Plan')}</span>`;
    const sdx = (C.programs || []).filter((p) => p.area === 'sdx').slice().sort((a, b) => String(a.year).localeCompare(String(b.year)));
    return `<section class="panel stack" id="anchor-ai-mem">${ui.title(T('AI 메모리 — HBM과 AI 가속기', 'AI memory — HBM and AI accelerators'), T('회사 설명·실적 보도자료, 엔비디아 연차보고서, WSTS', 'Company explanations and results releases, NVIDIA’s annual report, WSTS'))}
        <nav class="row" aria-label="${T('반도체 × AI 바로가기', 'Jump within Chips × AI')}"><a class="chip" href="#company/ai-mem">${T('AI 메모리', 'AI memory')}</a><a class="chip" href="#company/ai-fab">${T('제조 현장의 AI', 'AI in the fab')}</a><a class="chip" href="#company/ai-safety">${T('안전 분야 AI', 'AI for safety')}</a></nav>
        <ul class="facts">${(A.mem || []).map((x) => `<li>${esc(L(x.t))}${S.cite(x.src)}</li>`).join('')}</ul>
        <p class="small"><a href="#company/hbm">${T('HBM 구조·적층 공정', 'HBM structure and stacking')} →</a> · <a href="#company/mk-firms">${T('엔비디아·마이크론 등 기업 비교', 'NVIDIA, Micron and others compared')} →</a> · <a href="#company/mk-wsts">${T('세계 시장', 'World market')} →</a></p>
      </section>
      <section class="panel stack" id="anchor-ai-fab">${ui.title(T('제조 현장의 AI', 'AI in the fab'), T('SK하이닉스가 공개한 사례 — 날짜순', 'Cases SK hynix has published — by date'))}
        <ol class="timeline">${(A.fab || []).map((x) => `<li><span class="num">${dl(x.d)}</span> <span>${esc(L(x.t))}${x.plan ? planTag : ''}${S.cite(x.src)}</span></li>`).join('')}</ol>
        <ul class="facts">${(A.notes || []).map((n) => `<li class="xs muted">${esc(L(n))}</li>`).join('')}</ul>
        <p class="small"><a href="#company/pc-dep">${T('증착 공정', 'Deposition step')} →</a> · <a href="#company/litho">${T('노광 장비(EUV)', 'Lithography tools (EUV)')} →</a> · <a href="#company/hbm">${T('HBM', 'HBM')} →</a></p>
      </section>
      <section class="panel stack" id="anchor-ai-safety">${ui.title(T('안전 분야 AI·로봇', 'AI and robots for safety'), T('회사 지속가능경영보고서·뉴스룸의 안전 프로그램', 'Safety programmes from the company’s sustainability reports and newsroom'))}
        <ol class="timeline">${sdx.map((p) => `<li><span class="num">${esc(String(p.year))}</span> <span><b>${nm(p.t)}</b> — ${esc(L(p.d))}${S.cite(p.src)}</span></li>`).join('')}</ol>
        <p class="small"><a href="#sdx">${T('포털 SDX 모듈(순찰 이벤트·과제)', 'Portal SDX module (patrol events, pipeline)')} →</a> · <a href="#company/safety">${T('회사 안전 체계', 'Company safety system')} →</a></p>
      </section>`;
  }
  function tabTerms() {
    const list = (S.SEMI_TERMS || []).slice().sort((a, b) => L(a.t).localeCompare(L(b.t), S.state.lang === 'en' ? 'en' : 'ko'));
    const both = (o) => [].concat(o.ko || '', o.en || '').join(' ');
    return `<section class="panel stack">${ui.title(T('반도체 용어', 'Chip terms'), T(`${list.length}개 — 정의는 모두 뉴스룸 원문에서 확인`, `${list.length} terms — every definition checked in the newsroom originals`))}
      ${S.listbar({ id: 'semi', ph: T('용어 찾기 — 예: TSV, 식각, 언더필', 'Find a term — e.g. TSV, etching, underfill'), total: list.length })}
      <dl class="glossary">${list.map((t) => `<div class="term" id="term-${t.id}" data-li="${esc(both(t.t))}"><dt>${esc(L(t.t))}</dt><dd>${esc(L(t.d))}${S.cite(t.src || [])}${extTag(t.src)}</dd></div>`).join('')}</dl>
      <p class="lb-empty" data-lb-empty hidden>${T('찾는 용어가 없습니다. 안전 용어는 이용 가이드의 용어 사전에 있습니다.', 'No matching term. Safety terms are in the user guide’s glossary.')} <a href="#guide/terms">${T('용어 사전', 'Glossary')} →</a></p>
    </section>`;
  }
  function tabProfile() {
    const k = K();
    return `<section class="grid g2">
        <div class="panel">${ui.title(T('공식 기본 정보', 'Official profile'), T('제79기 반기보고서(2026.6.30 기준) — 회사가 금융위원회·한국거래소에 낸 정기보고서', 'Half-year report for the 79th term (as of 30 June 2026), the regular report filed with the FSC and KRX'))}
          <div class="table-wrap"><table class="data"><tbody>${(k.basics || []).map((o) => `<tr><th scope="row" style="width:30%">${L(o.k)}</th><td>${esc(L(o.v))}${S.cite(o.src)}</td></tr>`).join('')}</tbody></table></div>
        </div>
        <div class="panel">${ui.title(T('연혁의 큰 줄기', 'Milestones'), T('같은 보고서의 ‘회사의 연혁’', 'From the report’s company history'))}
          <ol class="timeline">${(k.history || []).map((h) => `<li><span class="num">${esc(h.d)}</span> <span>${esc(L(h.t))}</span></li>`).join('')}</ol>${S.cite('skhH1_2026')}
        </div>
      </section>
      <section class="panel stack" id="anchor-facts">${ui.title(T('회사 공식 설명 — FACT 시리즈', 'Company statements — the FACT series'), T(`뉴스룸에 회사가 직접 낸 설명·입장 ${(k.facts || []).length}건, 날짜순`, `${(k.facts || []).length} explanations and positions the company itself published in its newsroom, by date`))}
        <div class="table-wrap"><table class="data"><thead><tr><th>No.</th><th>${T('날짜', 'Date')}</th><th>${T('주제', 'Topic')}</th><th>${T('요지', 'Gist')}</th></tr></thead><tbody>
          ${(k.facts || []).map((f) => `<tr><td class="mono">${esc(f.no)}</td><td class="nowrap small">${esc(f.d.replace(/-/g, '.'))}</td><td class="small"><b>${esc(L(f.t))}</b>${f.go ? ` <a href="${f.go}" class="xs">${T('관련 화면', 'Related')} →</a>` : ''}</td><td class="small">${esc(L(f.k))}${S.cite(f.src)}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="xs muted">${T('언론 보도에 대한 입장(10·11번)은 보도 내용이 아니라 회사가 밝힌 입장만 옮겼습니다. 금액·일정은 발표 때의 계획입니다.', 'For the responses to press reports (10 and 11) only the company’s stated position is given, not the reports’ content. Amounts and dates are plans as announced.')}</p>
      </section>`;
  }
  function tabProducts() {
    const k = K(), ps = k.products || [];
    const groups = [...new Set(ps.map((p) => p.g))];
    return `<section class="panel">${ui.title(T('제품 전체 지도', 'Product map'), T(`공식 제품 사이트의 분류 화면 12개를 ${ps.length}개 묶음으로(${k.productsAsof} 확인)`, `The official product site’s 12 category pages in ${ps.length} groups (checked ${k.productsAsof})`))}
        <p class="small">${T('SK하이닉스의 주력은 DRAM과 NAND 플래시 메모리입니다. 아래 표는 공식 제품 사이트가 보여 주는 제품군·용량·속도를 옮긴 것으로, 세부 사양은 각 제품 화면에서 확인하세요.', 'SK hynix’s core products are DRAM and NAND flash memory. The tables below copy the families, densities and speeds shown on the official product site; check each product page for full specifications.')}${S.cite('skhProducts')}</p>
        <div class="row">${groups.map((g) => `<span class="chip">${esc(g)} ${ps.filter((p) => p.g === g).length}</span>`).join(' ')}</div>
      </section>
      ${ps.map((p) => `<section class="panel" id="anchor-prod-${p.id}">${ui.title(L(p.t), esc(p.g))}
        <p class="small">${esc(L(p.d))}</p>
        <div class="table-wrap"><table class="data"><thead><tr>${L(p.head).map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${p.rows.map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="nowrap"' : ''}>${i === 0 ? '<b>' : ''}${esc(typeof c === 'string' ? c : L(c))}${i === 0 ? '</b>' : ''}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
        ${p.note ? `<p class="xs muted">${esc(L(p.note))}</p>` : ''}${S.cite('skhProducts')}
      </section>`).join('')}`;
  }
  function tabBusiness() {
    const k = K(), r = k.results || {}, rd = k.rnd || {}, mt = k.materials || {}, mk = k.market || {};
    const row = (x) => `<tr><td class="nowrap">${esc(L(x.p))}</td><td class="num">${won(x.rev)}</td><td class="num">${won(x.op)}</td><td class="num">${won(x.ni)}</td><td class="num">${(x.op / x.rev * 100).toFixed(1)}%</td></tr>`;
    const thead = `<thead><tr><th>${T('기간', 'Period')}</th><th>${T('매출액', 'Revenue')}</th><th>${T('영업이익', 'Operating profit')}</th><th>${T('당기순이익', 'Net income')}</th><th>${T('영업이익률', 'Op. margin')}</th></tr></thead>`;
    return `<section class="grid g2">
        <div class="panel">${ui.title(T('실적', 'Results'), L(r.unit || ''))}
          <div class="table-wrap"><table class="data">${thead}<tbody>${(r.years || []).map(row).join('')}</tbody></table></div>
          <div class="table-wrap" style="margin-top:10px"><table class="data">${thead}<tbody>${(r.quarters || []).map(row).join('')}</tbody></table></div>
          <ul class="facts">${(r.notes || []).map((n) => `<li>${esc(L(n))}</li>`).join('')}</ul>${S.cite(r.src || [])}
          <p class="xs muted">${T('영업이익률은 표의 두 값으로 포털이 계산한 값입니다.', 'Operating margin is computed by the portal from the two figures shown.')}</p>
        </div>
        <div class="panel">${ui.title(T('메모리 시장과 점유율', 'Memory market and share'), T('회사 보고서가 인용한 시장 조사', 'Market research as cited in the company’s report'))}
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('2025년 세계 시장', '2025 world market')}</th><th>${T('규모(억 달러)', 'Size (US$ 100 m)')}</th><th>${T('비중', 'Share')}</th></tr></thead><tbody>${(mk.size2025 || []).map((x) => `<tr><td>${esc(typeof x.k === 'string' ? x.k : L(x.k))}</td><td class="num">${x.v.toLocaleString()}</td><td class="small">${x.s ? esc(L(x.s)) : ''}</td></tr>`).join('')}</tbody></table></div>
          <div class="table-wrap" style="margin-top:10px"><table class="data"><thead><tr><th>${T('연도', 'Year')}</th><th>${T('반도체', 'All chips')}</th><th>${T('메모리', 'Memory')}</th><th>DRAM</th><th>NAND</th></tr></thead><tbody>${(mk.growth || []).map((x) => `<tr><td>${x.y}</td><td class="num">${x.all}</td><td class="num">${x.mem}</td><td class="small">${esc(L(x.dram))}</td><td class="small">${esc(L(x.nand))}</td></tr>`).join('')}</tbody></table></div>
          <div class="table-wrap" style="margin-top:10px"><table class="data"><thead><tr><th>${T('SK하이닉스 점유율(매출액 기준)', 'SK hynix share (by revenue)')}</th><th>DRAM</th><th>NAND</th></tr></thead><tbody>${(mk.share || []).map((x) => `<tr><td>${esc(typeof x.p === 'string' ? x.p : L(x.p))}</td><td class="num">${x.dram}</td><td class="num">${x.nand}</td></tr>`).join('')}</tbody></table></div>
          <p class="small">${esc(L(mk.export || ''))}</p>
          <p class="xs muted">${esc(L(mk.cite || ''))}${S.cite(mk.src || [])} · <a href="#company/mk-wsts">${T('WSTS 세계 시장 통계', 'WSTS world market statistics')} →</a></p>
        </div>
      </section>
      ${r.mix ? (() => { const share = (v, tot) => `${(v / tot * 100).toFixed(1)}%`;
        const tbl = (rows, total) => `<div class="table-wrap"><table class="data"><thead><tr>${L(r.mix.head).map((h, i) => `<th${i ? ' class="num"' : ''}>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(([k, ...v]) => `<tr><td>${nm(k)}</td>${v.map((x, i) => `<td class="num">${won(x)} <span class="xs muted">${share(x, total[i])}</span></td>`).join('')}</tr>`).join('')}<tr><th scope="row">${T('합계', 'Total')}</th>${total.map((x) => `<td class="num"><b>${won(x)}</b></td>`).join('')}</tr></tbody></table></div>`;
        return `<section class="panel stack" id="anchor-mix">${ui.title(T('무엇을 팔고, 어디에 파나', 'What it sells and where'), T('제품별·지역별 매출 — 반기보고서 연결 주석 21', 'Revenue by product and region — half-year report, consolidated note 21'))}
        <div class="grid g2"><div class="stack" style="gap:6px"><b class="small">${T('제품별', 'By product')}</b>${tbl(r.mix.rows, r.mix.total)}</div><div class="stack" style="gap:6px"><b class="small">${T('지역별', 'By region')}</b>${tbl(r.region.rows, r.region.total)}</div></div>
        <p class="xs muted">${esc(L(r.mixNote || ''))}${S.cite('skhH1_2026')} · <a href="#company/mk-us">${T('다른 회사의 미국 매출 비중', 'US share at other companies')} →</a></p>
      </section>`; })() : ''}
      <section class="grid g2">
        <div class="panel">${ui.title(T('연구개발', 'R&D'), T('연구개발비와 2026년 주요 실적', 'R&D spending and 2026 results'))}
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('기간', 'Period')}</th><th>${T('연구개발비', 'R&D spending')}</th><th>${T('매출 대비', 'of revenue')}</th></tr></thead><tbody>${(rd.cost || []).map((x) => `<tr><td>${esc(L(x.p))}</td><td class="num">${won(x.v)}</td><td class="num">${x.r}</td></tr>`).join('')}</tbody></table></div>
          <ul class="facts">${(rd.done || []).map((n) => `<li>${esc(L(n))}</li>`).join('')}</ul>${S.cite(rd.src || [])}
        </div>
        <div class="panel">${ui.title(T('원재료와 공급', 'Materials and supply'), L(mt.total || ''))}
          <div class="stack">${(mt.items || []).map((x) => `<div><b>${esc(L(x.t))}</b> — <span class="small">${esc(L(x.d))}</span></div>`).join('')}</div>${S.cite(mt.src || [])}
        </div>
      </section>
      <section class="grid g2">
        <div class="panel">${ui.title(T('경쟁 요소', 'Competitive factors'))}<p class="small">${esc(L(mk.compete || ''))}${S.cite(mk.src || [])}</p></div>
        <div class="panel">${ui.title(T('제도·환경', 'Rules and environment'))}<ul class="facts">${(k.rules || []).map((n) => `<li>${esc(L(n))}</li>`).join('')}</ul>${S.cite('skhH1_2026')}</div>
      </section>`;
  }
  function tabPlan() {
    return `<section class="panel">${ui.title(T('SK하이닉스·반도체 이해 — 확장 계획', 'Understanding SK hynix and the chip industry — what comes next'), T('AI 해커톤 준비(13단계). 모두 공식 자료로만', 'For the AI hackathon (stage 13); official sources only'))}
        <ol class="proc">${(K().plan || []).map((p) => `<li><span class="no">${esc(p.no)}</span>${esc(L(p.t))}</li>`).join('')}</ol>
        <p class="xs muted">${T('각 업데이트에서 원문을 확인한 내용만 탭으로 공개합니다. 출처 등급은 법령 원문 1, 정부·국제기구 2, 공식 통계 3, 업계 단체(WSTS 등) 4, 회사 공개자료 5입니다.', 'Each update publishes only what has been checked against originals. Source tiers: statute texts 1, governments and international bodies 2, official statistics 3, industry bodies (such as WSTS) 4, company publications 5.')}</p>
      </section>`;
  }
  S.pages.company = {
    render(sub) {
      const want = sub && coTabOf(sub);
      if (!S.state.refreshing && want) S.save('tab.co', want);
      const tab = S.tab('co', 'profile');
      const body = tab === 'products' ? tabProducts() : tab === 'process' ? tabProcess() : tab === 'memtech' ? tabMem() : tab === 'equip' ? tabEquip() : tab === 'base' ? tabBase() : tab === 'business' ? tabBusiness() : tab === 'market' ? tabMarket() : tab === 'ai' ? tabAi() : tab === 'terms' ? tabTerms() : tab === 'plan' ? tabPlan() : tab === 'safety' ? tabSafety() : tabProfile();
      return `
      ${ui.head(T('회사 이해', 'Company'), T('SK하이닉스 이해', 'Understanding SK hynix'),
        T('SK하이닉스가 직접 공개한 자료로 회사·제품·공정·기술·사업과 안전 체계를 정리했습니다.', 'The company, its products, processes, technology, business and safety system, from material SK hynix itself has published.'),
        T('근거는 회사의 정기보고서(제79기 반기보고서), 공식 제품 사이트, 뉴스룸(보도자료·기술 해설)과 지속가능경영보고서(2024~2026)입니다. 시장 수치는 회사 보고서가 인용한 조사기관 값으로, 뉴스룸의 외부 전문가 칼럼은 ‘외부 칼럼’으로 표시했습니다. ‘세계 시장’ 탭은 WSTS 공식 발표, 각 회사의 연차보고서(미국 SEC 제출·IR), 각국 법령 원문이고, ‘반도체 × AI’ 탭은 회사가 공개한 AI 사례입니다.','Sources: the company’s regular report (H1, 79th term), its official product site, its newsroom (press releases and technical articles) and sustainability reports (2024–2026). Market figures are shown as cited from research firms in the company’s report; expert columns in the newsroom are marked “External column”. The World market tab uses WSTS releases, companies’ annual reports (US SEC filings and IR) and statute texts; the Chips × AI tab shows AI cases the company has published.'))}
      ${ui.tabs('co', CO_TABS.map(([id, f]) => ({ id, label: f(T) })), tab)}
      <div id="anchor-${tab}" class="co-body">${body}</div>`;
    },
    mount(root) {
      if (S.tab('co', 'profile') === 'terms') {
        if (S.state.jump) S.save('lb.semi', {});   /* 검색으로 찾아온 용어가 필터에 가려지지 않게 */
        S.listFilter(root, 'semi');
      }
    }
  };
  function tabSafety() {
    return `
      <section class="grid g2">
        <div class="panel stack" style="gap:14px">${ui.title(T('회사 개요', 'Overview'))}
          ${S.photo('m16')}
          <div class="table-wrap"><table class="data"><tbody>${C.overview.map((o) => `<tr><th scope="row" style="width:34%">${L(o.k)}</th><td>${L(o.v)}${S.cite(o.src)}</td></tr>`).join('')}</tbody></table></div>
        </div>
        <div class="panel">${ui.title('Brand Identity', T('회사 BI', 'Company BI'))}
          <p style="font-size:calc(17px * var(--fz));font-weight:600;line-height:1.5">“${L(C.bi.purpose)}”${S.cite(C.bi.src)}</p>
          <div class="grid g3" style="margin-top:14px">${C.bi.values.map((v) => `<div class="kpi"><span class="k">Value</span><span style="font-weight:600">${v.en}</span>${S.state.lang === 'ko' ? `<span class="d">${v.ko}</span>` : ''}</div>`).join('')}</div>
          <p class="small muted" style="margin-top:12px">Drivers — ${C.bi.drivers.join(' · ')}</p>
        </div>
      </section>
      <section class="grid g2">
        <div class="panel">${ui.title(T('일하는 방식', 'How the company works'))}
          <div class="stack">${C.culture.map((c) => `<div><b>${c.t}</b> — ${L(c.d)}${S.cite(c.src)}</div>`).join('')}</div>
        </div>
        <div class="panel">${ui.title(T('안전 메시지', 'Safety messages'))}
          <div class="stack">${C.slogans.map((s) => `<div><b>${L(s.t)}</b>${S.cite(s.src)}<br><span class="small muted">${L(s.d)}</span></div>`).join('')}</div>
        </div>
      </section>
      <section class="panel">${ui.title(T('안전보건 거버넌스', 'Safety & health governance'))}
        <div class="grid g4">${C.governance.map((g) => `<div class="stack" style="gap:4px;border-top:2px solid var(--ink);padding-top:10px"><b>${L(g.t)}</b><span class="small muted">${L(g.d)}${S.cite(g.src)}</span></div>`).join('')}</div>
      </section>
      <section class="panel">${ui.title(T('회사가 공개한 안전 제도·시스템', 'Safety programmes the company has disclosed'), T('포털은 이 제도를 대체하지 않고 연결합니다', 'The portal links to these rather than replacing them'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('제도', 'Programme')}</th><th>${T('내용', 'What it does')}</th><th>${T('직무', 'Function')}</th><th>${T('공개 시점', 'Disclosed')}</th></tr></thead>
        <tbody>${C.programs.map((p) => `<tr><td><b>${typeof p.t === 'string' ? p.t : L(p.t)}</b></td><td>${L(p.d)}${S.cite(p.src)}</td><td><span class="chip">${L(AREA[p.area])}</span></td><td class="n">${p.year}</td></tr>`).join('')}</tbody></table></div>
        <p class="xs muted" style="margin-top:8px">${T('Golden Rules의 7개 항목, BBS 등 일부 제도는 2015~2022년 자료 기준이며 세부 내용은 공개되지 않아 포털에 임의로 채우지 않았습니다.', 'Some items (e.g. the seven Golden Rules, BBS) come from 2015–2022 material and their details are not public, so the portal does not invent them.')}</p>
      </section>
      <section class="panel">${ui.title(T('문화를 포털 설계로', 'From culture to portal design'), T('포털 제안', 'Portal proposal'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('SK하이닉스 방식', 'SK hynix way')}</th><th>${T('포털에 반영한 방식', 'How the portal reflects it')}</th></tr></thead>
        <tbody>${MAP.map((m) => `<tr><td><b>${typeof m.c === 'string' ? m.c : L(m.c)}</b></td><td>${L(m.p)}</td></tr>`).join('')}</tbody></table></div>
      </section>`;
  }

  S.pages.sites = {
    render() {
      const cur = S.state.site;
      const s = S.SITES[cur];
      return `
      ${ui.head(T('사업장', 'Sites'), T('사업장별 안전 프로필', 'Site safety profiles'),
        T('이천·청주 사업장이 공개한 특징과 그에 따른 관리 포인트입니다.', 'What Icheon and Cheongju have disclosed, and the focus points that follow.'),
        T('공통 체계는 ‘공통’에 두었습니다. 상단 사업장 선택과 연동됩니다.', 'Company-wide systems sit under “All”. Linked to the site switch at the top.'))}
      <div class="seg" role="group" aria-label="${T('사업장', 'Site')}">${['common', 'icheon', 'cheongju'].map((id) => `<button type="button" data-site="${id}" aria-pressed="${cur === id}">${L(S.SITES[id].name)}</button>`).join('')}</div>
      <section class="grid g3">
        <div class="panel span2 stack" style="gap:16px">${ui.title(L(s.name), L(s.lead))}
          ${cur === 'common' ? `<div class="grid g2">${S.photo('icheon')}${S.photo('cheongju')}</div>` : S.photo(cur)}
          <ul class="facts">${s.facts.map((f) => `<li>${L(f.t)}${S.cite(f.src)}</li>`).join('')}</ul>
        </div>
        <div class="panel">${ui.title(T('안전관리 포인트', 'Focus points'), T('포털 제안 — 공개자료 기반 해석', 'Portal proposal — interpretation of public data'))}
          ${s.focus.length ? `<div class="stack">${s.focus.map((f) => `<div class="callout">${L(f)}</div>`).join('')}</div>` :
            `<p class="small">${T('공통 탭에서는 전사 체계를 봅니다. 이천·청주를 선택하면 사업장별 포인트가 나타납니다.', 'The company-wide tab shows shared systems. Pick Icheon or Cheongju for site-specific focus points.')}</p>`}
          <hr class="sep">
          <div class="small"><b>${T('관련 SOP', 'Related SOPs')}</b><div class="row" style="margin-top:6px">${(cur === 'cheongju' ? ['equip-move', 'height', 'hot-work', 'loto'] : cur === 'icheon' ? ['pm-chamber', 'line-break', 'pump-scrubber', 'gas-cylinder'] : ['confined', 'chem-supply', 'implant'])
            .map((id) => `<a class="chip" href="#sop/${id}">${L(S.SOPS.find((x) => x.id === id).t)}</a>`).join('')}</div></div>
        </div>
      </section>
      <section class="panel">${ui.title(T('사업장 비교', 'Side by side'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('항목', 'Item')}</th><th>${T('이천', 'Icheon')}</th><th>${T('청주', 'Cheongju')}</th></tr></thead><tbody>
          <tr><td>${T('주요 Fab', 'Main fabs')}</td><td>M14, M16 ${T('(운영)', '(operating)')}${S.cite('sr2026')}</td><td>M15X ${T('(2025.10 오픈)', '(opened Oct 2025)')}, P&T7 ${T('(건설 중)', '(under construction)')}${S.cite('sr2026')}</td></tr>
          <tr><td>${T('순찰 로봇', 'Patrol robot')}</td><td>${T('가온', 'Gaon')}${S.cite('inews2026')}</td><td>${T('다온 1~3호', 'Daon units 1–3')}${S.cite('inews2026')}</td></tr>
          <tr><td>${T('상생협력 성과', 'Partnership recognition')}</td><td>${T('2025 우수 사업장', '2025 top performer')}${S.cite('sr2026')}</td><td>${T('3년 연속 우수 → 자율이행 사업장', '3 years running → self-compliance worksite')}${S.cite('nrbp2026')}</td></tr>
          <tr><td>${T('비상대응·지역 연계', 'Emergency & community')}</td><td>${T('이천소방서 주관 긴급구조종합훈련(2025), 경기도 화학물질지역협의회', 'Icheon Fire Station rescue exercise (2025); Gyeonggi chemical council')}${S.cite('sr2026')}</td><td>${T('충청지역 화학안전공동체 협의회 가입', 'Member of the Chungcheong chemical-safety community council')}${S.cite('sr2026')}</td></tr>
          <tr><td>${T('교육 인프라', 'Training infrastructure')}</td><td>–</td><td>${T('SHE 체험교육관 (2025.5)', 'SHE Experience Center (May 2025)')}${S.cite('nr2025she')}</td></tr>
          <tr><td>ISO 45001</td><td>~2027-01-16${S.cite('sr2026')}</td><td>~2027-01-16${S.cite('sr2026')}</td></tr>
        </tbody></table></div>
      </section>`;
    }
  };

  const BENCH = [
    { who: 'Samsung Electronics (Semiconductor)', src: 'samsungSr2025',
      facts: { ko: ['협력사 작업중지권 제도를 효과적으로 운영하려고 작업중지권 연구회를 두고 개선 제안 활동(보고서 2025 p.50)', '외부 인증이 없는 협력사에 인증 컨설팅·평가, 인증 협력사에 특별교육·사후·갱신 심사 컨설팅, 협력사 위험성평가 전문인력 과정(p.50)', '안전보건경영시스템(ISO 45001 등) 인증 협력사 비율 50 → 51 → 59%(2022~2024, p.66)'], en: ['A Work Stoppage Right Research Group makes improvement suggestions so that the partners’ work stoppage right works effectively (Report 2025 p. 50)', 'Certification consulting and assessment for suppliers without external certification; special training and post/renewal consulting for certified ones; a risk-assessment course for supplier staff (p. 50)', 'Suppliers with a health and safety management system (ISO 45001 etc.): 50 → 51 → 59 % (2022–2024, p. 66)'] },
      more: { ko: ['반도체 사업장: ISO 45001 기반 안전보건경영시스템을 모든 제조 사업장에서 인증, 모든 사업장에 24시간 자체 소방대·화학물질 누출 대응팀(지속가능경영 화면, 2026-10-11 확인)'], en: ['Semiconductor sites: ISO 45001-based management system certified at all manufacturing sites; in-house fire brigades and chemical spill response teams on duty 24/7 at all sites (sustainability page, checked 2026-10-11)'] }, moreSrc: 'samsung',
      take: { ko: '작업중지권을 두는 데서 그치지 않고 ‘잘 쓰이는지’를 따로 다룸 → SOP마다 작업중지 기준 배치, 업무판에 작업중지 기록 지표 제안', en: 'Treating the right to stop work as something whose use must be improved, not just granted → stop-work criteria on every SOP; propose a stop-work log KPI' } },
    { who: 'TSMC', src: 'tsmc2023',
      facts: { ko: ['2022년 하루 협력사 출입 5만 1천 명 이상', '디지털 산업안전 교육과 출입 권한·공사 신청 연동', '고위험 작업·구역 AI 위험 식별 — 천장 작업, 탱크로리 충전 구역 모듈 (Fab 15A)', '협력사 ESH 감독자 소통회의, 현장 작업자에게 불안전 작업 중지 권한 부여 요청', '협력사용 ESH Blue Book 수시 개정'], en: ['Over 51,000 contractor entries per day in 2022', 'Digital safety training linked to access rights and work applications', 'AI hazard identification for high-risk work — ceiling work and tanker-filling modules (Fab 15A)', 'ESH supervisor meetings; front-line workers empowered to stop unsafe work', 'Rolling updates to the contractor ESH Blue Book'] },
      /* 사실마다 출처가 다른 항목 — 번호를 문장 끝에 붙인다 */
      more: { ko: ['2017년 대만반도체산업협회(TSIA)를 대표해 업계 첫 「장비 공급사 현장 서비스 인력 직업건강 관리 지침」 발표 — 설치·예방정비·고장수리 중 화학물질·방사선·소음 노출 파악, 작업환경측정 기록을 검진 의사에게 제공, 출입 전 위험 설명·교육·보호구 확인'], en: ['In 2017, for the Taiwan Semiconductor Industry Association, the industry’s first occupational-health guideline for equipment suppliers’ on-site service staff — exposure to chemicals, radiation and noise during installation, PM and troubleshooting; monitoring records shared with examining doctors; hazard briefing, training and PPE checked before entry'] }, moreSrc: 'tsmcTsia',
      take: { ko: '교육 이수와 출입·작업 신청을 연결하는 구조 → 상생협력 모듈의 “작업 전 5분 카드 + 협력사교육시스템 연계”', en: 'Tying training completion to access and work requests → the partner module’s 5-minute card plus link to the partner education system' } },
    { who: { ko: '미국 OSHA', en: 'US OSHA' }, src: 'osha146',
      facts: { ko: ['허가 필요 밀폐공간의 위험 분위기: 가연성 가스가 LFL의 10% 초과, 산소 19.5% 미만 또는 23.5% 초과 등', '반도체 공정별 유해위험을 공정 단위로 정리해 공개'], en: ['Hazardous atmosphere in permit spaces: flammable gas > 10 % of LFL, O₂ < 19.5 % or > 23.5 %, etc.', 'Publishes semiconductor hazards step by step'] },
      take: { ko: '국내 기준과 나란히 비교해 보여주면 판단 근거가 분명해짐 → 밀폐공간 판정기에 한·미 기준 병기', en: 'Showing Korean and US limits side by side makes judgments clearer → dual criteria in the confined-space checker' } },
    { who: 'Intel', src: 'intelEhs',
      facts: { ko: ['캠퍼스에서 위험할 수 있는 작업을 하는 공급사는 모두 안전 사전 자격심사(Highwire)를 거침', 'Intel 담당자와 작업 범위에 따른 사전 질문을 검토 → 하나라도 “예”면 온라인 안전 프로필·프로그램 문서 제출 → Intel Global EHS가 승인 여부 결정', '출입 자격을 유지하려면 매년 프로필 검토·갱신', '건설 EHS 성과 요구사항·건설 EHS 매뉴얼을 전 세계 공장에 공통 적용'],
        en: ['Every supplier doing potentially hazardous work on campus goes through safety pre-qualification (Highwire)', 'Screening questions reviewed with the Intel sponsor by scope → any “yes” means an online safety profile and programme documents → Intel Global EHS decides on approval', 'The profile is reviewed and renewed every year to keep site access', 'Construction EHS performance requirements and manual apply to every factory worldwide'] },
      take: { ko: '산안법 제61조(적격 수급인 선정 의무)를 “사전 심사 → 승인 → 매년 갱신” 절차로 운영하는 예 → 상생협력의 도급인 법정 의무에 제61조를 넣고, 협력사 SHE 평가표를 선정 전 심사에도 쓰도록 안내', en: 'Runs “contract only with capable contractors” (OSH Act Art. 61) as pre-screen → approval → yearly renewal → Art. 61 added to the principal’s duties, and the contractor scorecard framed for pre-selection too' } },
    { who: 'IOGP', src: 'iogpLsr',
      facts: { ko: ['사망으로 이어지기 쉬운 작업을 회원사 사고 데이터로 골라 만든 9개 생명 보호 규칙(Report 459) — 규칙마다 아이콘과 개인이 지킬 행동', '2008~2017년 사망 376명이 규칙을 지켰다면 막을 수 있었을 것으로 분석', 'Line of Fire 10개 위험 범주·질문·행동, 작업 시작 전 점검(Report 459-1), 포스터·작업카드·번역본'],
        en: ['Nine Life-Saving Rules (Report 459) chosen from fatality data reported to IOGP — each an icon plus actions an individual controls', '376 deaths in 2008–2017 might have been prevented by following them', 'Ten Line of Fire hazard categories with questions and actions, Start-Work Checks (Report 459-1), posters, work cards, translations'] },
      take: { ko: '규칙을 짧은 행동 문장과 아이콘으로 → SOP 5분 카드의 ‘해야 할 것·하면 안 되는 것’과 작업중지 기준도 같은 방식으로 짧게 유지', en: 'Short action sentences with icons → the SOP five-minute card’s do/don’t lists and stop-work criteria stay just as short' } }
  ];

  /* 3단계 — 한·미 규제 비교. 각 칸은 원문을 확인한 조항만 적는다(한국: 국가법령정보센터 현행본, 미국: OSHA 표준 원문, 2026-09-24).
     “규정 없음”은 인용한 조문에 없다는 뜻으로만 쓴다 */
  const X = (ko, en) => ({ ko, en });
  const CMP = [
    { id: 'psm', t: X('공정안전관리 (PSM)', 'Process safety management (PSM)'), kr: ['lawDecree', 'moelPsm'], us: ['osha119'], note: X('한국 PSM 고시 제43~52조는 공단이 공정안전보고서와 이행 상태를 심사하는 기준 조항입니다.', 'Korean PSM Notice Arts. 43–52 are the criteria KOSHA uses to review PSM reports and their implementation.'), rows: [
      [X('적용 대상', 'Scope'), X('시행령 제43조·별표13 규정량 이상 유해·위험물질을 제조·취급·저장하는 설비 — 실란·포스핀·삼불화질소 등 반도체 가스를 물질별로 열거', 'Decree Art. 43 and Annex 13 — plants above threshold quantities; semiconductor gases such as silane, phosphine and NF₃ are listed by name'), X('(a) 부록 A 물질의 기준량 이상 공정, 인화성 가스·인화점 100°F(37.8°C) 미만 액체 10,000lb(4,535.9kg) 이상', '(a) processes above Appendix A thresholds, or 10,000 lb (4,535.9 kg) of flammable gas or liquid with flash point < 100 °F (37.8 °C)')],
      [X('위험성평가 재검토', 'Hazard analysis review'), X('공정위험성평가를 최대 4년 이내 주기로 수행 (PSM 고시 제43조)', 'Process hazard analysis at least every 4 years (PSM Notice Art. 43)'), X('5년마다 갱신·재검증 ((e)(6))', 'Updated and revalidated every 5 years ((e)(6))')],
      [X('운전절차 확인', 'Operating procedures'), X('안전보건총괄책임자가 매년 현재 설비와 일치하는지 확인·기록 (고시 제44조)', 'The site head confirms and records each year that they match the plant (Notice Art. 44)'), X('매년 최신·정확함을 인증 ((f)(3))', 'Certified current and accurate every year ((f)(3))')],
      [X('운전원 재교육', 'Refresher training'), X('최소 3년마다 1회 이상 (고시 제48조)', 'At least every 3 years (Notice Art. 48)'), X('최소 3년마다 ((g)(2))', 'At least every 3 years ((g)(2))')],
      [X('사고조사 착수', 'Incident investigation'), X('사고 발생 즉시, 늦어도 24시간 이내 (고시 제52조)', 'At once, within 24 hours at the latest (Notice Art. 52)'), X('48시간 이내 착수, 보고서 5년 보관 ((m)(2)·(7))', 'Within 48 hours; reports kept 5 years ((m)(2), (7))')],
      [X('자체 감사', 'Self-audit'), X('1년마다 자체감사, 보고서 3년 이상 보관 (고시 제51조)', 'Every year; reports kept at least 3 years (Notice Art. 51)'), X('3년마다 준수 감사 인증, 최근 2회 보고서 보관 ((o)(1)·(5))', 'Compliance audit certified every 3 years; last two reports kept ((o)(1), (5))')],
      [X('정부 정기 평가', 'Regulator’s periodic review'), X('공단 이행상태평가: 신규(확인 1년 경과 후 2년 이내), 정기 4년마다 (고시 제54조)', 'KOSHA implementation assessment: first within 2 years after year one, then every 4 years (Notice Art. 54)'), X('1910.119에는 정기 평가 조항이 없음 — 사업주 준수 감사로 운영', 'No periodic regulator review in 1910.119 — relies on the employer’s audit')]
    ] },
    { id: 'cs', t: X('밀폐공간', 'Confined spaces'), kr: ['lawStd', 'koshaSop3'], us: ['osha146'], rows: [
      [X('공기 기준', 'Atmosphere'), X('적정공기: 산소 18% 이상 23.5% 미만, CO₂ 1.5% 미만, CO 30ppm 미만, H₂S 10ppm 미만 (제618조)', 'Acceptable air: O₂ ≥ 18 % and < 23.5 %, CO₂ < 1.5 %, CO < 30 ppm, H₂S < 10 ppm (Art. 618)'), X('위험 분위기: 산소 19.5% 미만 또는 23.5% 초과, 인화성 가스가 LFL의 10% 초과, 허용노출기준 초과 등 ((b))', 'Hazardous atmosphere: O₂ < 19.5 % or > 23.5 %, flammable gas > 10 % of LFL, above a PEL, etc. ((b))')],
      [X('프로그램', 'Programme'), X('밀폐공간 작업 프로그램 수립·시행 (제619조①), KOSHA E-G-18은 2년에 1회 이상 평가 권고', 'Confined-space programme (Art. 619(1)); KOSHA E-G-18 advises review at least every 2 years'), X('허가공간 프로그램을 취소된 허가서로 입장 후 1년 이내 검토 ((d)(14))', 'Permit-space programme reviewed within a year using cancelled permits ((d)(14))')],
      [X('작업 전 확인·게시', 'Before entry'), X('작업 정보·작업자·측정결과·유입 가능성·보호구·비상연락 6개 항목 확인, 종료까지 출입구 게시 (제619조②③)', 'Six items checked — job, people, test results, inflow risks, PPE, emergency contacts — and posted at the entrance until the end (Art. 619(2)(3))'), X('입장 허가서를 입구에 게시, 허가 기간은 작업 소요 시간 이내 ((e)(3)·(4))', 'Entry permit posted at the portal; valid only for the time the job needs ((e)(3), (4))')],
      [X('기록 보존', 'Records'), X('측정자·일시·장소·결과 3년 보존 (제619조의2④)', 'Tester, time, place and results kept 3 years (Art. 619-2(4))'), X('취소된 허가서 1년 이상 보관 ((e)(6))', 'Cancelled permits kept at least 1 year ((e)(6))')],
      [X('감시·구조', 'Attendant and rescue'), X('감시인 외부 배치, 이상 시 소방관서 신고 (제623조), 구출자 공기호흡기·송기마스크 (제643조)', 'Attendant outside who reports to the fire service (Art. 623); rescuers wear SCBA or airline respirators (Art. 643)'), X('감시인 의무 ((i)), 구조 훈련 12개월마다 1회 이상 ((k)(2)(iv))', 'Attendant duties ((i)); rescue practice at least every 12 months ((k)(2)(iv))')]
    ] },
    { id: 'loto', t: X('에너지 차단 (LOTO)', 'Energy isolation (LOTO)'), kr: ['lawStd'], us: ['osha147'], rows: [
      [X('근거', 'Basis'), X('정비 시 운전정지·기동장치 잠금·열쇠 별도 관리 또는 표지판 (제92조), 전로 차단 절차 (제319조)', 'Stop machines for maintenance, lock the start control and keep the key or post a sign (Art. 92); circuit isolation (Art. 319)'), X('에너지 통제 프로그램과 설비별 절차 ((c)(1)·(4))', 'Energy-control programme and machine-specific procedures ((c)(1), (4))')],
      [X('순서', 'Sequence'), X('도면으로 전원 확인 → 차단·단로기 개방 → 잠금·꼬리표 → 잔류전하 방전 → 검전 → 필요 시 단락접지 (제319조②)', 'Confirm sources on drawings → open breakers and disconnectors → lock and tag → discharge → prove dead → earth if needed (Art. 319(2))'), X('준비 → 정지 → 격리 → 잠금·표지 → 축적 에너지 해소 → 격리 확인 ((d))', 'Prepare → shut down → isolate → lock/tag → relieve stored energy → verify isolation ((d))')],
      [X('해제', 'Removal'), X('잠금장치·꼬리표는 설치한 근로자가 직접 철거 (제319조③3)', 'Locks and tags removed by the worker who fitted them (Art. 319(3)3)'), X('설치한 작업자가 해제, 부재 시 사업주 확인 등 예외 절차 ((e)(3))', 'Removed by whoever applied them; strict exception procedure if absent ((e)(3))')],
      [X('정기 점검', 'Periodic inspection'), X('제92조·제319조에는 점검 주기 규정이 없음 — 사업장 절차로 관리', 'No inspection interval in Arts. 92 or 319 — set by site procedure'), X('절차 점검을 연 1회 이상, 해당 절차를 쓰지 않는 다른 권한자가 수행 ((c)(6)(i))', 'Procedures inspected at least yearly by another authorised employee ((c)(6)(i))')],
      [X('교육', 'Training'), X('75V 이상 정전·활선작업은 특별교육 (시행규칙 별표5 제17호)', 'Special training for de-energised and live work at 75 V or more (Rule Annex 5 item 17)'), X('교육과 재교육 ((c)(7))', 'Training and retraining ((c)(7))')]
    ] },
    { id: 'hot', t: X('화기작업', 'Hot work'), kr: ['lawStd', 'moelPsm'], us: ['osha252', 'osha119'], rows: [
      [X('화재감시자 배치', 'Fire watch'), X('작업반경 11m 이내 건물 구조·내부에 가연물, 11m 밖이라도 불꽃으로 쉽게 발화, 금속 칸막이·벽 반대편 가연물 중 하나 (제241조의2①)', 'Combustibles within 11 m in the structure or contents; beyond 11 m but easily ignited; or against the far side of metal partitions (Art. 241-2(1))'), X('작업 지점에서 35피트(10.7m) 이내 가연물, 35피트 밖이라도 불꽃으로 쉽게 발화, 개구부 너머 가연물, 금속 칸막이 반대편 가연물 ((a)(2)(iii)(A))', 'Combustibles within 35 ft (10.7 m); beyond but easily ignited; exposed through openings; or against the far side of metal partitions ((a)(2)(iii)(A))')],
      [X('작업 후 감시', 'After the job'), X('안전보건규칙 제241조·제241조의2에는 작업 후 감시 시간 규정이 없음', 'Arts. 241 and 241-2 set no watch period after the job'), X('작업 종료 후 최소 30분 감시 ((a)(2)(iii)(B))', 'Watch at least 30 minutes after the job ((a)(2)(iii)(B))')],
      [X('허가·게시', 'Permit and posting'), X('작업 전 작업내용·일시·안전점검·조치사항 서면 게시 (제241조④), PSM 사업장은 안전작업허가 (고시 제46조)', 'Written posting of task, time, checks and measures (Art. 241(4)); permits at PSM sites (Notice Art. 46)'), X('작업 전 책임자가 현장을 점검하고 허가 — 서면 허가 권장 ((a)(2)(iv)), PSM 공정은 화기작업 허가 의무 (1910.119(k))', 'The responsible person inspects the area and authorises the work — preferably by written permit ((a)(2)(iv)); a hot-work permit is mandatory on PSM processes (1910.119(k))')],
      [X('감시자 장비', 'Fire-watch kit'), X('확성기·휴대용 조명·화재 대피용 마스크 지급 (제241조의2③)', 'Loudhailer, portable light and escape mask (Art. 241-2(3))'), X('소화 장비를 곁에 두고 사용법·경보 방법 숙지 ((a)(2)(iii)(B))', 'Extinguishing equipment at hand; trained in its use and in raising the alarm ((a)(2)(iii)(B))')]
    ] },
    { id: 'resp', t: X('호흡보호구', 'Respiratory protection'), kr: ['lawStd', 'moelPpe'], us: ['oshaResp'], rows: [
      [X('프로그램', 'Programme'), X('분진 노출기준 초과 사업장 등은 호흡기보호 프로그램 (제616조)', 'Respiratory programme where dust exceeds limits, etc. (Art. 616)'), X('호흡보호구가 필요한 모든 작업장에 서면 프로그램 ((c)(1))', 'A written programme wherever respirators are needed ((c)(1))')],
      [X('밀착도 검사', 'Fit testing'), X('제450조·제616조·제617조에는 밀착도 검사 주기 규정이 없음', 'Arts. 450, 616 and 617 set no fit-test interval'), X('최초 사용 전, 면체 변경 시, 이후 연 1회 이상 ((f)(2))', 'Before first use, when the facepiece changes, then at least yearly ((f)(2))')],
      [X('의학적 평가', 'Medical evaluation'), X('제450조·제616조·제617조에는 착용 전 의학적 평가 규정이 없음', 'Arts. 450, 616 and 617 require no medical evaluation before use'), X('밀착도 검사·착용 전 의학적 평가 ((e)(1))', 'Medical evaluation before fit testing or use ((e)(1))')],
      [X('선정 기준', 'Selection'), X('보호구 안전인증 고시의 방진·방독 등급·사용장소(산소 18% 이상에서 방독마스크)', 'Classes and uses in the PPE certification notice (gas masks only where O₂ ≥ 18 %)'), X('할당보호계수(APF)·최대사용농도(MUC) ((d)(3))', 'Assigned protection factors and maximum use concentration ((d)(3))')]
    ] }
  ];

  S.pages.bench = {
    render(sub) {
      /* #bench/<주제>로 들어오면 비교 탭을 연다 (탭 클릭에 의한 재렌더 때는 사용자의 선택 유지) */
      if (!S.state.refreshing && CMP.some((c) => c.id === sub)) S.save('tab.bench', 'reg');
      const tab = S.tab('bench', 'peer');
      return `
      ${ui.head(T('벤치마킹', 'Benchmarks'), T('타사·해외 사례에서 가져온 것', 'What the portal borrows from others'),
        T('타사·해외 규제기관에서 포털에 가져온 점과 한·미 규제의 차이입니다.', 'What the portal takes from peers and foreign regulators, and how Korean and US rules differ.'),
        T('회사가 공개한 공식 페이지와 해외 규제기관 자료만 사용했습니다. 사례 탭은 포털에 반영한 점을, 규제 비교 탭은 한국 법령과 미국 OSHA 표준의 조항별 차이를 보여 줍니다.', 'Only official company pages and foreign regulators are used. The cases tab shows what the portal takes from each; the regulation tab compares Korean law with US OSHA standards clause by clause.'))}
      ${ui.tabs('bench', [{ id: 'peer', label: T('타사·해외 사례', 'Peer and overseas cases') }, { id: 'reg', label: T('한·미 규제 비교', 'Korea–US regulation') }], tab)}
      ${tab === 'reg' ? `
        <div class="callout small">${T('원문을 확인한 조항만 비교했습니다. 한쪽이 더 엄격하다고 단정하기보다, 사내 기준을 정할 때 두 기준 중 더 보호적인 쪽을 고르는 참고로 쓰세요. “규정이 없음”은 인용한 조문에 없다는 뜻입니다.', 'Only clauses read in the original are compared. Rather than declaring one side stricter, use this to pick the more protective of the two when setting in-house rules. “No provision” means none in the articles cited.')}</div>
        <nav class="row">${CMP.map((c) => `<a class="chip" href="#bench/${c.id}">${esc(L(c.t))}</a>`).join('')}</nav>
        ${CMP.map((c) => `<section class="panel" id="anchor-${c.id}">${ui.title(esc(L(c.t)), `${T('한국', 'Korea')} ${S.cite(c.kr)} · ${T('미국', 'US')} ${S.cite(c.us)}`)}
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('항목', 'Item')}</th><th>${T('한국 (조문)', 'Korea (article)')}</th><th>${T('미국 OSHA (조항)', 'US OSHA (paragraph)')}</th></tr></thead><tbody>
            ${c.rows.map(([k, kr, us]) => `<tr><td><b>${esc(L(k))}</b></td><td class="small">${esc(L(kr))}</td><td class="small">${esc(L(us))}</td></tr>`).join('')}
          </tbody></table></div>${c.note ? `<p class="xs muted" style="margin-top:6px">${esc(L(c.note))}</p>` : ''}</section>`).join('')}
        <p class="xs muted">${T('포털 반영: 작업허가서에 C-C-49 모니터링·절차 평가(OSHA PSM 준수감사와 같은 방향), 밀폐공간 SOP에 E-G-18 환기량·2년 평가, 판정 도구에 한·미 기준 병기.', 'Applied here: C-C-49 monitoring and system audit in the permit tool (in line with the OSHA PSM compliance audit), E-G-18 ventilation and two-yearly review in the confined-space SOP, and Korean and US criteria side by side in the checkers.')}</p>`
      : `<section class="grid g3">${BENCH.map((b) => `<div class="panel stack">
        <h3 style="font-size:calc(16px * var(--fz))">${typeof b.who === 'string' ? b.who : L(b.who)}${S.cite(b.src)}</h3>
        <ul class="facts">${L(b.facts).map((f) => `<li>${f}</li>`).join('')}${b.more ? L(b.more).map((f) => `<li>${f}${S.cite(b.moreSrc)}</li>`).join('') : ''}</ul>
        <div class="callout ok small"><b>${T('포털 반영', 'Applied here')}</b> — ${L(b.take)}</div>
      </div>`).join('')}</section>`}`;
    }
  };
  S.BENCH_CMP = CMP;

  const TYPE = { sk: { ko: 'SK하이닉스 공식', en: 'SK hynix official' }, law: { ko: '법령·고시', en: 'Statute / notice' }, gov: { ko: '공공기관', en: 'Public agency' }, court: { ko: '법원', en: 'Court' }, intl: { ko: '해외·국제 기관', en: 'Foreign / international body' }, peer: { ko: '타사 공식', en: 'Peer company' }, press: { ko: '언론', en: 'Press' } };

  S.pages.sources = {
    render(sub) {
      /* 주소로 들어오면 해당 탭을 연다: #sources/lawcheck · #sources/kosha · #sources/<출처 id> (탭 클릭에 의한 재렌더 때는 선택 유지) */
      if (!S.state.refreshing && sub) {
        const t = sub === 'lawcheck' ? 'lawcheck' : sub === 'kosha' ? 'kosha' : S.SOURCES.some((s) => s.id === sub) ? 'list' : null;
        if (t) S.save('tab.src', t);
        if (t === 'list') S.save('lb.src', {});   /* 찾아온 출처가 필터에 가려지지 않게 */
      }
      const tab = S.tab('src', 'method');
      const byType = {}, byTier = {}; S.SOURCES.forEach((s) => { byType[s.type] = (byType[s.type] || 0) + 1; const g = S.srcTier(s.id); byTier[g] = (byTier[g] || 0) + 1; });
      const kn = Object.keys(S.KOSHA).length;
      return `
      ${ui.head(T('출처·검증', 'Sources & verification'), T('이 포털의 근거', 'Evidence behind this portal'),
        T('모든 수치와 회사 정보에는 [번호]로 출처를 달았습니다.', 'Every figure and company fact carries a [number] citation.'),
        T('검증 방법과 한계, 출처 목록, 인용한 KOSHA GUIDE의 현행 번호, 매월 하는 법령 변경 점검을 탭으로 나눴습니다. 본문의 [번호]를 누르면 출처 목록의 해당 줄로 옵니다.', 'The method and its limits, the source list, current numbers of the KOSHA Guides cited and the monthly law-change check are split into tabs. Clicking a [number] in the text brings you to that line of the source list.'))}
      ${ui.tabs('src', [
        { id: 'method', label: T('검증 방법', 'Method') },
        { id: 'list', label: T(`출처 목록 ${S.SOURCES.length}`, `Sources ${S.SOURCES.length}`) },
        { id: 'kosha', label: T(`KOSHA 지침 ${kn}`, `KOSHA Guides ${kn}`) },
        { id: 'lawcheck', label: T('법령 변경 점검', 'Law-change check') }], tab)}
      ${tab === 'method' ? `
      <section class="tiles" aria-label="${T('출처 유형별 건수', 'Sources by type')}">
        <div class="tile info"><span class="t">${T('법령·고시', 'Statutes & notices')}</span><span class="n">${byType.law || 0}<small>${T('건', '')}</small></span><span class="d">${T('국가법령정보센터 원문', 'Original text, National Law Information Center')}</span></div>
        <div class="tile info"><span class="t">${T('공공기관', 'Public agencies')}</span><span class="n">${byType.gov || 0}<small>${T('건', '')}</small></span><span class="d">${T('고용노동부·공단·소방청 등', 'MOEL, KOSHA, fire agency and others')}</span></div>
        <div class="tile info"><span class="t">${T('SK하이닉스 공식', 'SK hynix official')}</span><span class="n">${byType.sk || 0}<small>${T('건', '')}</small></span><span class="d">${T('지속가능경영보고서·뉴스룸', 'Sustainability reports, newsroom')}</span></div>
        <div class="tile info"><span class="t">${T('해외·국제·기타', 'Foreign, international, other')}</span><span class="n">${S.SOURCES.length - (byType.law || 0) - (byType.gov || 0) - (byType.sk || 0)}<small>${T('건', '')}</small></span><span class="d">${T('OSHA·NIOSH·ILO, 타사 공식, 법원, 언론(보조)', 'OSHA, NIOSH, ILO, peers, courts, press (supplementary)')}</span></div>
      </section>
      <section class="grid g2">
        <div class="panel">${ui.title(T('검증 방법', 'How facts were checked'))}
          <ul class="facts">
            <li>${T('법령 수치(적정공기·소음·고온·조도·교육시간·도급 주기·소방 점검)는 국가법령정보센터 원문 조문을 직접 확인했습니다.', 'Statutory values (acceptable air, noise, heat, illumination, training hours, subcontract cycles, fire inspections) were read in the original articles on the National Law Information Center.')}</li>
            <li>${T('화학물질 노출기준은 고시 출력본의 별표 표 이미지와 한 줄씩 대조했습니다.', 'Chemical exposure limits were matched line by line against the annex tables of the official notice.')}</li>
            <li>${T('SK하이닉스 정보는 회사 지속가능경영보고서 3개년 원문과 뉴스룸에서만 가져왔습니다.', 'SK hynix facts come only from three years of its sustainability reports and its newsroom.')}</li>
            <li>${T('법령은 매월 ‘법령 변경 점검’ 탭의 순서로 현행본과 대조합니다.', 'Laws are compared with the current text every month, following the “Law-change check” tab.')}</li>
            <li>${T('수정할 때마다 ', 'After every edit the ')}<a href="#qa">${T('포털 자체 점검', 'portal self-check')}</a>${T('으로 전 페이지·한영·화면 폭을 자동 점검합니다.', ' renders every page in both languages at three widths.')}</li>
          </ul></div>
        <div class="panel">${ui.title(T('한계', 'Limits'))}
          <ul class="facts">
            <li>${T('SOP는 SK하이닉스 사내 절차가 아니라 공개 법령·지침으로 재구성한 교육용 예시입니다.', 'SOPs are teaching examples rebuilt from public law and guidance, not SK hynix internal procedures.')}</li>
            <li>${T('KOSHA GUIDE는 법적 강제 기준이 아닌 기술적 권고입니다. 수치·절 번호를 옮긴 지침(안전작업허가·가스감지경보기·혼합가스·세안설비·밀폐공간 등)은 원문 PDF로 확인했고, 나머지는 번호·명칭·공표일을 확인했습니다.', 'KOSHA Guides are technical recommendations, not binding law. Guides whose values or clause numbers are quoted (permits, gas detectors, gas mixtures, eyewash, confined spaces and others) were read in the original PDF; the rest were checked for number, title and date.')}</li>
            <li>${T('법령은 개정될 수 있으므로 실제 적용 전 최신본을 확인해야 합니다.', 'Laws change, so confirm the current text before real use.')}</li>
            <li>${T('언론 출처는 회사 공식 자료로 확인되지 않는 경우에만 보조로 썼습니다.', 'Press sources are used only as a supplement where no official source exists.')}</li>
          </ul></div>
      </section>
      <p class="small">${T('업무에 자주 쓰는 공식 사이트는 ', 'The official sites most useful day to day are curated in the ')}<a href="#resources">${T('안전 정보 자료실', 'resource library')}</a>${T('에 가나다·유형·주제별로 따로 정리했습니다.', ', by name, type and subject.')}</p>` : ''}
      ${tab === 'lawcheck' ? `
      <section class="panel stack" id="anchor-lawcheck">${ui.title(T('법령 변경 점검 (월 1회)', 'Law-change check (monthly)'), T(`포털 기준일 ${S.LAW_ASOF}`, `Portal as of ${S.LAW_ASOF}`))}
        ${(() => {
          const G = { law: T('법령', 'Statute'), adm: T('고시·예규', 'Notice'), code: T('기술기준', 'Code') };
          const src = (id) => S.SOURCES.find((s) => s.id === id) || {};
          const lc = lawLog(), last = lc.log[0];
          const ago = last ? S.daysBetween(new Date(last.at + 'T00:00:00'), S.today()) : null;
          return `<p class="small">${T('인용한 법령이 바뀌면 판정 기준·주기·조문 번호가 함께 바뀝니다. 매월 한 번 아래 순서로 점검하고 기록을 남기세요. 표의 ‘포털 기준’은 포털이 대조한 판(版)입니다.', 'When a cited law changes, thresholds, intervals and article numbers change with it. Check monthly in the order below and keep a record. “Portal version” is the edition the portal was checked against.')}</p>
          <ol class="proc p5">${[
            T('‘현행 확인’을 눌러 국가법령정보센터 제목 옆 [시행 …] [… 제○호]가 ‘포털 기준’과 같은지 봅니다.', 'Open “Current text” and compare the [in force …] [No. …] line on the National Law Information Center with “Portal version”.'),
            T('다르면 화면 위 ‘신구법비교’로 바뀐 조문을 보고, 포털 검색에 조문 번호를 넣어 인용한 곳을 찾아 고칩니다.', 'If it differs, use “old vs new” on that page, then search the portal for the article number and fix every place that cites it.'),
            T('공포됐지만 아직 시행 전인 개정은 부칙의 시행일로 확인해 ‘시행 예정·유의’와 최신 안전 동향에 예고합니다.', 'For amendments promulgated but not yet in force, read the effective date in the addendum and flag it here and in the news.'),
            T('고용노동부 보도자료, 산업안전포털 KOSHA GUIDE 목록(공표일), KGS 코드 목록(승인일)도 봅니다.', 'Also scan MOEL press releases, the KOSHA Guide list (publication dates) and the KGS code list (approval dates).'),
            T('출처의 확인일과 동향 기준일을 고치고, 아래에서 이달 점검을 기록합니다.', 'Update the sources’ checked dates and the news date, then record this month’s check below.')
          ].map((s, i) => `<li><span class="no">${i + 1}</span>${s}</li>`).join('')}</ol>
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('구분', 'Type')}</th><th>${T('법령·기준', 'Law / code')}</th><th>${T('포털 기준', 'Portal version')}</th><th>${T('시행 예정·유의', 'Upcoming / notes')}</th><th>${T('원문', 'Source')}</th></tr></thead><tbody>
            ${S.LAWCHECK.map((r) => { const s = src(r.id); return `<tr><td class="nowrap small">${G[r.g]}</td><td class="small" style="min-width:9.5em;word-break:keep-all"><b>${esc(L(r.n))}</b></td><td class="small" style="min-width:10em">${esc(L(r.v))}</td><td class="small">${r.next ? esc(L(r.next)) : '<span class="muted">–</span>'}</td>
              <td class="nowrap small">${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${T('현행 확인', 'Current text')} ↗</a>` : ''}${r.id === 'koshaGuide' ? ` · <a href="#sources/kosha">${T('대조표', 'Table')}</a>` : ''}<br><span class="xs muted">${T('확인', 'Checked')} ${esc(s.checked || '')}</span></td></tr>`; }).join('')}
          </tbody></table></div>
          <div class="grid g2">
            <div class="stack">
              <b class="small">${T('이달 점검 기록', 'Record this month’s check')}</b>
              <div class="form-grid">
                <div class="field"><label for="lc-at">${T('점검일', 'Date')}</label><input type="date" id="lc-at" value="${S.iso(S.today())}"></div>
                <div class="field"><label for="lc-by">${T('점검자', 'Checked by')}</label><input type="text" id="lc-by" value="${esc(lc.by || '')}"></div>
              </div>
              <div class="field"><label for="lc-note">${T('바뀐 법령과 조치 (없으면 ‘변경 없음’)', 'Changes found and action taken (or “no change”)')}</label><textarea id="lc-note"></textarea></div>
              <div class="row"><button class="btn sm" type="button" id="lc-save">${T('점검 기록 저장', 'Save check')}</button>${S.printLink('lawcheck', T('점검표 인쇄', 'Print checklist'))}</div>
            </div>
            <div class="stack">
              <b class="small">${T('점검 기록', 'Check log')} ${last ? `<span class="xs muted">· ${T(`마지막 ${ago}일 전`, `last ${ago} days ago`)}</span>` : ''}</b>
              ${lc.log.length ? `<ul class="clean small">${lc.log.slice(0, 6).map((x, i) => `<li><span class="num">${esc(x.at)}</span> · ${esc(x.by || '–')} — ${esc(x.note || '')} <button class="btn ghost sm" type="button" data-lc-del="${i}" aria-label="${T('삭제', 'Delete')}">×</button></li>`).join('')}</ul>` : `<p class="small muted">${T('아직 기록이 없습니다. 포털 작성자의 최근 점검: ', 'No checks recorded in this browser yet. The portal author’s latest check: ')}${S.LAW_ASOF}</p>`}
              <p class="xs muted">${T('기록은 이 브라우저에만 저장되며 백업 파일에 함께 들어갑니다. 한 번 기록하면 31일이 지났을 때 업무판에 알림이 뜹니다.', 'Records stay in this browser and are included in backups. Once you have recorded a check, the dashboard reminds you after 31 days.')}</p>
            </div>
          </div>`;
        })()}
      </section>` : ''}
      ${tab === 'kosha' ? `
      <section class="panel" id="anchor-kosha">${ui.title(T('KOSHA GUIDE 현행화 대조표', 'KOSHA GUIDE currency check'), T('2026-09-25 산업안전포털 목록·원문 PDF와 대조', 'Checked against the KOSHA portal list and PDFs, 2026-09-25'))}
        <p class="small">${T('2026.1.30 정비(437건: 제정 11·개정 164·폐지 262)로 많은 지침의 번호가 바뀌었습니다. 포털은 현행 번호로 적고, 번호를 누르면 공단 원문 PDF가 열립니다. 구 번호는 “구 ○○”로 함께 표시합니다.', 'The 2026-01-30 overhaul (437 guides: 11 new, 164 revised, 262 withdrawn) renumbered many guides. The portal uses current numbers; each number opens KOSHA’s PDF, and former numbers are shown as “formerly …”.')}${S.cite('koshaGuide', 'moelKosha2026')}</p>
        ${(() => {
          const REL = { succ: T('새 번호로 개정', 'Revised under a new number'), merge: T('통폐합', 'Merged'), topic: T('구 지침 폐지 — 같은 주제의 현행 지침', 'Old guide withdrawn — current guide on the same topic') };
          const rows = Object.keys(S.KOSHA).map((k) => Object.assign({ id: k }, S.KOSHA[k])).sort((a, b) => (a.rel ? 0 : 1) - (b.rel ? 0 : 1) || a.id.localeCompare(b.id));
          const changed = rows.filter((r) => r.rel).length;
          return `<p class="xs muted">${T(`인용 지침 ${rows.length}건 · 번호 변경·폐지 ${changed}건 · 변경 없음 ${rows.length - changed}건`, `${rows.length} guides cited · ${changed} renumbered or withdrawn · ${rows.length - changed} unchanged`)}</p>
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('현행 번호', 'Current no.')}</th><th>${T('명칭', 'Title')}</th><th class="n">${T('공표일', 'Published')}</th><th>${T('이전 번호·관계', 'Former no. / change')}</th></tr></thead><tbody>
            ${rows.map((r) => `<tr><td class="nowrap">${S.koshaTag(r.id)}</td><td class="small">${esc(L(r))}</td><td class="num nowrap">${esc(r.d || '')}</td><td class="small">${r.old ? `${esc([].concat(r.old).join(', '))} — ${esc(REL[r.rel] || '')}` : `<span class="muted">${T('변경 없음', 'Unchanged')}</span>`}</td></tr>`).join('')}
          </tbody></table></div>`;
        })()}
      </section>` : ''}
      ${tab === 'list' ? `
      <section class="panel stack">
        ${S.listbar({ id: 'src', ph: T('출처 검색 — 예: 안전보건규칙, KOSHA, 지속가능경영보고서', 'Search sources — e.g. Standards Rules, KOSHA, sustainability report'), total: S.SOURCES.length,
          facets: [{ key: 't', label: T('유형', 'Type'), opts: Object.keys(TYPE).filter((k) => byType[k]).map((k) => ({ id: k, label: L(TYPE[k]), n: byType[k] })) },
            { key: 'g', label: T('출처 등급', 'Tier'), opts: S.TIERS.filter(([v]) => byTier[v]).map(([v, l]) => ({ id: v, label: L(l).split(' — ')[0], n: byTier[v] })) }] })}
        <p class="xs muted">${T('출처 등급은 포털 전체가 쓰는 한 가지 기준입니다 — ', 'Source tiers are one scale used across the portal — ')}${S.TIERS.filter(([v]) => /\d/.test(v)).map(([, l]) => esc(L(l))).join(' · ')}</p>
        <div class="table-wrap"><table class="data">
        <thead><tr><th class="n">#</th><th>${T('출처', 'Source')}</th><th>${T('유형', 'Type')}</th><th>${T('등급', 'Tier')}</th><th>${T('확인일', 'Checked')}</th></tr></thead>
        <tbody>${S.SOURCES.map((s, i) => `<tr id="anchor-${s.id}" data-li="${esc(s.id + ' ' + [].concat(s.title.ko || '', s.title.en || '').join(' '))}" data-f-t="${s.type}" data-f-g="${S.srcTier(s.id)}" ${sub === s.id ? 'style="background:var(--accent-bg)"' : ''}><td class="n">${i + 1}</td>
          <td><a href="${s.url}" target="_blank" rel="noopener">${L(s.title)}</a>${s.note ? `<div class="xs muted">${L(s.note)}</div>` : ''}</td>
          <td><span class="chip">${L(TYPE[s.type])}</span></td><td class="num nowrap">${S.srcTier(s.id)}</td><td class="num nowrap">${s.checked}</td></tr>`).join('')}</tbody>
        </table></div>
        <p class="lb-empty" data-lb-empty hidden>${T('조건에 맞는 출처가 없습니다.', 'No sources match.')}</p>
      </section>` : ''}`;
    },
    mount(root) {
      S.listFilter(root, 'src');
      const sv = root.querySelector('#lc-save');
      if (sv) sv.addEventListener('click', () => {
        const at = root.querySelector('#lc-at').value, by = root.querySelector('#lc-by').value.trim(), note = root.querySelector('#lc-note').value.trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(at)) { S.toast(T('점검일을 넣으세요', 'Enter the date')); return; }
        if (!note) { S.toast(T('바뀐 법령과 조치를 적으세요 (없으면 ‘변경 없음’)', 'Describe the changes (or “no change”)')); return; }
        const lc = lawLog();
        lc.log = [{ at, by, note }].concat(lc.log).sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 24);
        lc.by = by;
        S.save('lawchk', lc); S.refresh();
        S.toast(T('법령 변경 점검을 기록했습니다', 'Law-change check recorded'));
      });
      root.querySelectorAll('[data-lc-del]').forEach((b) => b.addEventListener('click', () => {
        if (!window.confirm(T('이 점검 기록을 지울까요?', 'Delete this check record?'))) return;
        const lc = lawLog(); lc.log.splice(Number(b.dataset.lcDel), 1); S.save('lawchk', lc); S.refresh();
      }));
    }
  };

  /* 법령 변경 점검 기록 { by, log: [{ at, by, note }] } — 최신이 앞 */
  function lawLog() {
    const v = S.load('lawchk', null);
    return v && Array.isArray(v.log) ? { by: typeof v.by === 'string' ? v.by : '', log: v.log.filter((x) => x && typeof x.at === 'string') } : { by: '', log: [] };
  }
  S.lawLog = lawLog;
})();

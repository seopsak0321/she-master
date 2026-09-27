/* 안전보건표지·경고표지
   탭 1 안전보건표지 — 산안법 시행규칙 별표6~9 (종류·용도·설치 예시·색채·기본모형), 법 제37조·규칙 제38~40조 (설치·제작 의무)
   탭 2 화학물질 경고표지(GHS) — 고용노동부고시 「화학물질의 분류·표시 및 물질안전보건자료에 관한 기준」 제5~8조·별표2·3, 그림문자 이름·유해성은 미국 OSHA 요약카드
   그림은 모양과 색만 단순하게 그린 것이며, 실제 표지·그림문자는 각 원문을 따른다 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui;
  /* 기본모형 그림 — 금지(빨간 원·사선), 경고(노란 삼각형), 화학물질 경고(빨간 테 마름모), 지시(파란 원), 안내(녹색 사각형), 출입금지(글자판) */
  const shape = (kind, size) => {
    const z = size || 34, a = `width="${z}" height="${z}" viewBox="0 0 40 40" aria-hidden="true" class="sign-ico"`;
    if (kind === 'ban') return `<svg ${a}><circle cx="20" cy="20" r="16" fill="#fff" stroke="#C8102E" stroke-width="5"/><path d="M9 9 31 31" stroke="#C8102E" stroke-width="5"/></svg>`;
    if (kind === 'warn') return `<svg ${a}><path d="M20 4 37 34H3z" fill="#F2C500" stroke="#1A1A1A" stroke-width="3" stroke-linejoin="round"/><path d="M20 15v10M20 28.5v.5" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/></svg>`;
    if (kind === 'chem') return `<svg ${a}><path d="M20 3 37 20 20 37 3 20z" fill="#fff" stroke="#C8102E" stroke-width="3.5" stroke-linejoin="round"/></svg>`;
    if (kind === 'order') return `<svg ${a}><circle cx="20" cy="20" r="17" fill="#1F5AA6"/><circle cx="20" cy="15" r="4" fill="#fff"/><path d="M13 30c0-5 3-8 7-8s7 3 7 8" fill="#fff"/></svg>`;
    if (kind === 'info') return `<svg ${a}><rect x="4" y="4" width="32" height="32" rx="3" fill="#00875A"/><path d="M20 11v18M11 20h18" stroke="#fff" stroke-width="5"/></svg>`;
    return `<svg ${a}><rect x="3" y="8" width="34" height="24" rx="2" fill="#fff" stroke="#1A1A1A" stroke-width="2"/><path d="M9 15h22M9 20h22" stroke="#1A1A1A" stroke-width="2"/><path d="M9 26h16" stroke="#C8102E" stroke-width="2.5"/></svg>`;
  };
  const kindOf = (s) => (s.cat === 'warn' && s.chem ? 'chem' : S.SIGN_CATS[s.cat].shape);

  function lawTab() {
    const cats = Object.keys(S.SIGN_CATS), all = S.SIGNS;
    const n = (c) => all.filter((s) => s.cat === c).length;
    return `
      <section class="grid g3 sign-cats" id="anchor-law">
        ${cats.map((c) => { const k = S.SIGN_CATS[c]; return `<div class="panel stack sign-cat">
          <div class="row" style="gap:10px">${shape(k.shape, 40)}${c === 'warn' ? shape('chem', 40) : ''}<div><b>${L(k.t)}</b> <span class="num muted">${n(c)}${T('종', '')}</span><div class="xs muted">${T(`기본모형 ${k.model}번 (별표9)`, `Basic model ${k.model} (Annex 9)`)}</div></div></div>
          <p class="small">${L(k.color)}</p></div>`; }).join('')}
      </section>
      <section class="panel stack" id="sign-list">
        ${ui.title(T('표지 목록', 'All signs'), T('별표6 번호 · 별표7 용도와 설치 장소 예시', 'Annex 6 numbers · uses and example locations from Annex 7'))}
        ${S.listbar({ id: 'signs', ph: T('표지 이름·용도·장소 찾기 — 예: 부식, 귀마개, 비상구', 'Find a sign — e.g. corrosive, ear, exit'), total: all.length,
          facets: [{ key: 'cat', label: T('종류', 'Type'), opts: cats.map((c) => ({ id: c, label: L(S.SIGN_CATS[c].t), n: n(c) })) }] })}
        <div class="sign-list">${all.map((s) => `<article class="sign-row" data-li="${S.esc(s.t.ko + ' ' + s.t.en + ' ' + s.no + ' ' + (s.iso || ''))}" data-f-cat="${s.cat}">
          ${shape(kindOf(s))}
          <div class="stack" style="gap:2px;min-width:0"><b class="small"><span class="num muted">${s.no}</span> ${S.esc(L(s.t))}</b>
            <span class="xs">${S.esc(L(s.use))}</span>
            ${s.ex ? `<span class="xs muted">${T('예시', 'e.g.')}: ${S.esc(L(s.ex))}</span>` : ''}
            ${s.iso ? `<span class="xs muted">KS S ISO 7010 <span class="mono">${S.esc(s.iso)}</span> ${T('로 대체 가능', 'may be used instead')}</span>` : ''}</div>
        </article>`).join('')}
          <p class="small muted" data-lb-empty hidden>${T('찾는 표지가 없습니다. 검색어나 종류를 바꿔 보세요.', 'No matching sign. Try another word or type.')}</p></div>
        <p class="xs muted">${T('별표6 비고: 102·103·106·107·206~213·215·301~309·402~404·406~408번 28종은 한국산업표준 KS S ISO 7010의 안전표지로 대체할 수 있습니다. 안내표지는 원문 표의 예시 칸 정렬이 모호해 용도만 옮겼습니다.', 'Annex 6 note: 28 signs (102, 103, 106, 107, 206–213, 215, 301–309, 402–404, 406–408) may be replaced by KS S ISO 7010 signs. For guidance signs only the use is shown, as the example column in the original table is ambiguous.')}${S.cite('lawRuleSigns')}</p>
      </section>
      <section class="grid g2">
        <div class="panel stack">${ui.title(T('색도기준과 용도', 'Colour standards and uses'), T('별표8 · 먼셀 표기', 'Annex 8 · Munsell notation'))}
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('색채', 'Colour')}</th><th>${T('색도기준', 'Standard')}</th><th>${T('용도·사용례', 'Use')}</th></tr></thead><tbody>
            ${S.SIGN_COLORS.map((c) => `<tr><td><span class="sign-sw" style="background:${c.hex}" aria-hidden="true"></span> ${L(c.k)}</td><td class="mono">${c.m}</td><td class="small">${L(c.use)}</td></tr>`).join('')}
          </tbody></table></div>
          <p class="xs muted">${T('허용 오차 H±2, V±0.3, C±1. 색 견본은 화면 표시용 근삿값이며 기준은 먼셀 표기입니다. 사업주는 설치한 표지의 색도기준이 유지되도록 관리해야 합니다(규칙 제38조③).', 'Tolerance H±2, V±0.3, C±1. Swatches are screen approximations — the Munsell values are the standard. Employers must keep installed signs within the colour standard (Rule Art. 38(3)).')}${S.cite('lawRuleSigns')}</p>
        </div>
        <div class="panel stack">${ui.title(T('설치·제작 의무', 'Installing and making signs'), T('산안법 제37조 · 시행규칙 제38~40조', 'OSH Act Art. 37 · Rule Arts. 38–40'))}
          <ul class="facts">
            <li>${T('근로자가 쉽게 알아볼 수 있도록 설치·부착. 외국인근로자를 쓰는 사업주는 고용노동부장관이 정하는 바에 따라 그 근로자의 모국어로 작성 (법 제37조①)', 'Put signs where workers can easily see them; employers of foreign workers must make them in the workers’ mother tongue as the Minister sets out (Act Art. 37(1))')}</li>
            <li>${T('표시를 명확히 하려면 표지 주위에 글자를 덧붙일 수 있음 — 흰색 바탕에 검은색 한글고딕체 (규칙 제38조②)', 'Wording may be added around a sign for clarity — black Korean gothic type on white (Rule Art. 38(2))')}</li>
            <li>${T('별표7의 구분에 따라 알아보기 쉬운 장소·시설·물체에, 흔들리거나 쉽게 파손되지 않도록 견고하게. 붙이기 곤란하면 물체에 직접 도색 가능 (규칙 제39조)', 'Fix signs firmly where Annex 7 indicates, so they do not swing or break; paint directly on the object where fixing is impractical (Rule Art. 39)')}</li>
            <li>${T('별표9 기본모형으로 제작, 빠르고 쉽게 알아볼 크기, 그림·부호는 표지 전체 규격의 30% 이상, 쉽게 파손·변형되지 않는 재료, 야간에 필요한 표지는 야광물질 등 (규칙 제40조)', 'Make signs on the Annex 9 basic models, large enough to read quickly, with the symbol at least 30 % of the sign, in durable material, and luminous where needed at night (Rule Art. 40)')}</li>
          </ul>
          <p class="xs muted">${S.cite('lawAct', 'lawRuleSigns')} <a href="#sop/eyewash">${T('비상샤워·세안설비 점검 SOP', 'Eyewash & safety-shower SOP')} →</a></p>
        </div>
      </section>
      <section class="panel stack">${ui.title(T('작업장 안전디자인', 'Workplace safety design'), T('고용노동부 보도자료 2026.9.16', 'MOEL press release, 16 Sep 2026'))}
        <p class="small">${T('고령자·외국인 노동자 등이 현장의 위험정보를 빠르고 정확하게 알아차리도록 색채·표지·동선을 시각적으로 최적화하는 기법입니다.', 'A way of optimising colour, signs and walkways so that everyone, including older and foreign workers, picks up hazard information quickly and correctly.')}</p>
        <ul class="facts">
          <li>${T('주로 지게차 등 하역운반기계 작업구역과 보행자 통로를 나누고, 화재 등 비상시 빠른 대피를 이끄는 데 씁니다.', 'Mainly used to separate forklift and other materials-handling areas from walkways, and to guide fast evacuation in a fire or other emergency.')}</li>
          <li>${T('현장 사례(장관 방문, CJ제일제당 부산공장): 교차로·횡단보도에서 보행자와 지게차 동선을 분리하고, 바닥과 비상구에도 적용해 대피로가 더 잘 보이게 함.', 'Site example (ministerial visit, CJ CheilJedang Busan plant): pedestrian and forklift routes separated at crossings, and floors and emergency exits treated so escape routes stand out.')}</li>
          <li>${T('지원: 고용노동부·한국산업안전보건공단 클린사업장 조성지원사업 — 50인 미만 제조업체 등을 중심으로 개선 비용의 50~70%, 최대 1억원. 원청이 사외 하청의 안전디자인 비용 일부를 부담하는 경우에도 정부 지원 가능(세부는 공단 누리집).', 'Support: the MOEL/KOSHA Clean Workplace programme pays 50–70 % of the cost, up to KRW 100 million, mainly for manufacturers with fewer than 50 workers. Support is also available when a principal contractor pays part of an outside subcontractor’s safety-design costs (details on the KOSHA website).')}</li>
        </ul>
        <p class="xs muted">${S.cite('moel0916')} <a href="#sop/forklift">${T('지게차 SOP', 'Forklift SOP')} →</a> · <a href="#partner">${T('상생협력', 'Contractor partnership')} →</a></p>
      </section>`;
  }

  /* 경고표지 양식(별표3)을 단순한 틀로 보여 준다 — 실제 크기·배치는 원문 */
  const labelMock = () => `<div class="ghs-label" role="img" aria-label="${T('경고표지 양식 — 명칭, 그림문자, 신호어, 유해·위험 문구, 예방조치 문구, 공급자 정보', 'Label layout — name, pictograms, signal word, hazard statements, precautionary statements, supplier')}">
    <b>${T('(명칭)', '(Product name)')}</b>
    <div class="row" style="gap:6px;justify-content:center">${shape('chem', 30)}${shape('chem', 30)}</div>
    <b class="ghs-signal">${T('(신호어) 위험 / 경고', '(Signal word) Danger / Warning')}</b>
    <span>${T('유해·위험 문구', 'Hazard statements')} :</span><span>${T('예방조치 문구', 'Precautionary statements')} :</span><span>${T('공급자 정보', 'Supplier')} :</span></div>`;

  function ghsTab() {
    const C = S.GHS_CLASSES;
    return `
      <section class="grid g2" id="anchor-ghs">
        <div class="panel stack">${ui.title(T('경고표지 구성', 'What a label must show'), T('고시 제6조·별표3', 'Notice Art. 6 · Annex 3'))}
          ${labelMock()}
          <ul class="facts">
            <li>${T('명칭(MSDS의 제품명), 그림문자, 신호어(‘위험’ 또는 ‘경고’), 유해·위험 문구, 예방조치 문구, 공급자 정보', 'Name (the product name on the MSDS), pictograms, signal word (“Danger” or “Warning”), hazard statements, precautionary statements, supplier')}</li>
            <li>${T('내용량 100g·100mL 이하는 명칭·그림문자·신호어·공급자 정보만 표시할 수 있음 (제6조②)', 'Contents of 100 g or 100 mL or less may show only the name, pictograms, signal word and supplier (Art. 6(2))')}</li>
            <li>${T('사업장에서 자체 사용하려고 옮겨 담은 반제품용기는 ‘위험’ 또는 ‘경고’만 표시할 수 있고, 이때 보관·저장장소에 경고표지를 붙이거나 MSDS를 게시 (제6조③)', 'Containers filled on site for in-house use may show just “Danger” or “Warning”, provided the label or MSDS is posted where they are stored (Art. 6(3))')}</li>
          </ul>
        </div>
        <div class="panel stack">${ui.title(T('작성 규칙', 'Drafting rules'), T('고시 제6조의2 · 제8조', 'Notice Arts. 6-2, 8'))}
          <ul class="facts">
            <li>${T('해당하는 그림문자를 모두 표시. 다만 ‘해골과 Ⅹ자형 뼈’가 있으면 ‘감탄부호(!)’는 생략, 부식성이 있으면 피부·눈 자극성은 생략, 호흡기 과민성이 있으면 피부 과민성·피부 자극성·눈 자극성은 생략, 5개 이상이면 4개만 표시 가능', 'Show every pictogram that applies — but drop the exclamation mark if the skull and crossbones applies, drop skin/eye irritation if corrosion applies, drop skin sensitisation and skin/eye irritation if respiratory sensitisation applies, and show four if five or more apply')}</li>
            <li>${T('신호어는 ‘위험’과 ‘경고’에 모두 해당하면 ‘위험’만 표시', 'If both signal words apply, show only “Danger”')}</li>
            <li>${T('예방조치 문구가 7개 이상이면 예방·대응·저장·폐기 각 1개 이상을 넣어 6개만 표시하고, 나머지는 MSDS를 참고하도록 기재', 'With seven or more precautionary statements, show six including at least one each for prevention, response, storage and disposal, and refer to the MSDS for the rest')}</li>
            <li>${T('경고표지 바탕은 흰색, 글씨·테두리는 검은색. 그림문자는 검은 그림에 빨간 테두리, 흰 바탕이 원칙. 취급근로자가 사용 중에도 쉽게 볼 수 있는 위치에 견고하게 부착 (제8조)', 'White label with black text and border; pictograms are a black symbol in a red frame on white; fix the label firmly where users can see it while working (Art. 8)')}</li>
          </ul>
          <p class="xs muted">${S.cite('moelGhs')}</p>
        </div>
      </section>
      <section class="panel stack">
        ${ui.title(T('그림문자 9종', 'The nine pictograms'), T('GHS 공통 · 이름과 해당 유해성은 미국 OSHA 요약카드', 'Common GHS set · names and hazards from the US OSHA quick card'))}
        <div class="ghs-grid">${S.GHS_PICTOS.map((p) => `<div class="ghs-card">
          ${shape('chem', 44)}
          <div class="stack" style="gap:2px;min-width:0"><b class="small">${S.state.lang === 'en' ? p.en : `${p.ko} <span class="xs muted">${p.en}</span>`}</b>
            <ul class="clean xs">${L(p.hz).map((h) => `<li>${S.esc(h)}</li>`).join('')}</ul></div></div>`).join('')}</div>
        <p class="xs muted">${T('모양은 빨간 테두리의 마름모(정사각형을 꼭짓점으로 세운 것)만 단순하게 그렸습니다. 실제 그림문자는 고시 별표2의 GHS 그림문자를 따릅니다. ‘해골과 Ⅹ자형 뼈’·‘감탄부호(!)’·‘부식성’은 고시 표기, 나머지 국문 이름은 영문 이름의 번역입니다. OSHA는 “테두리만 있고 그림이 없는 마름모는 그림문자가 아니며 라벨에 쓸 수 없다”고 밝힙니다.', 'Only the red-framed diamond (a square set on a point) is drawn; real labels use the GHS pictograms in Annex 2 of the notice. OSHA notes that a red frame without a hazard symbol is not a pictogram and may not be used on a label.')}${S.cite('oshaPicto', 'moelGhs')}</p>
      </section>
      <section class="grid g2">
        <div class="panel stack">${ui.title(T('고시의 유해성·위험성 분류', 'Hazard classes in the notice'), T(`별표2 · ${C.phys.items.length + C.health.items.length + C.env.items.length}가지`, `Annex 2 · ${C.phys.items.length + C.health.items.length + C.env.items.length} classes`))}
          ${['phys', 'health', 'env'].map((k) => `<div class="stack" style="gap:4px"><b class="small">${L(C[k].t)} <span class="num muted">${C[k].items.length}</span></b>
            <div class="row" style="gap:4px">${(S.state.lang === 'en' ? C[k].en : C[k].items).map((x) => `<span class="chip">${S.esc(x)}</span>`).join('')}</div></div>`).join('')}
          <p class="xs muted">${T('분류별 그림문자·신호어·유해·위험 문구(H코드)·예방조치 문구(P코드)는 별표2 원문 표에 있습니다. 실제 물질의 분류는 공급자의 물질안전보건자료(MSDS)를 확인하세요.', 'The pictograms, signal words, H-statements and P-statements for each class are in the Annex 2 tables; check the supplier’s MSDS for how a substance is actually classified.')}${S.cite('moelGhs')} <a href="#resources/msds">${T('KOSHA MSDS 검색', 'KOSHA MSDS search')} →</a></p>
        </div>
        <div class="panel stack">${ui.title(T('경고표지 크기', 'Label size'), T('별표3 · 용기·포장 용량별', 'Annex 3 · by container size'))}
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('용기·포장 용량', 'Container')}</th><th>${T('인쇄·표찰 크기', 'Label area')}</th></tr></thead><tbody>
            ${S.GHS_LABEL_SIZES.map(([a, b]) => `<tr><td>${L(a)}</td><td>${L(b)}</td></tr>`).join('')}</tbody></table></div>
          <ul class="facts">
            <li>${T('그림문자 하나의 크기는 인쇄·표찰 규격의 40분의 1 이상, 최소 0.5㎠ 이상', 'Each pictogram at least 1/40 of the label, and no smaller than 0.5 cm²')}</li>
            <li>${T('물질안전보건자료대상물질을 사용·운반·저장하는 사업주는 경고표지 유무를 확인하고, 없으면 붙이거나 양도·제공자에게 부착을 요청 (제5조⑥⑦)', 'Employers who use, move or store MSDS-regulated substances must check for labels, add missing ones, or ask the supplier to (Art. 5(6)(7))')}</li>
            <li>${T('외국인근로자가 취급하면 이해할 수 있는 언어의 경고표지를 추가하거나 병기할 수 있음 (제5조①)', 'Where foreign workers handle them, a label in a language they understand may be added or combined (Art. 5(1))')}</li>
          </ul>
          <p class="xs muted">${S.cite('moelGhs')}</p>
        </div>
      </section>`;
  }

  S.pages.signs = {
    render(sub) {
      /* #signs/ghs·#signs/law로 들어오면 그 탭을 연다 (다시 그릴 때는 고른 탭 유지) */
      if ((sub === 'ghs' || sub === 'law') && !S.state.refreshing) S.save('tab.signs', sub);
      const cur = S.tab('signs', 'law') === 'ghs' ? 'ghs' : 'law';
      return `
      ${ui.head(T('라이브러리', 'Library'), T('안전보건표지·경고표지', 'Safety signs and chemical labels'),
        T(`작업장의 안전보건표지 ${S.SIGNS.length}종(산안법 시행규칙 별표6~9)과 화학물질 경고표지(GHS)의 기준을 한곳에서 봅니다.`, `The ${S.SIGNS.length} workplace safety signs (OSH Rule Annexes 6–9) and the rules for chemical hazard labels (GHS) in one place.`),
        T('안전보건표지는 근로자가 쉽게 알아볼 수 있도록 설치하거나 붙여야 하고(산안법 제37조), 화학물질 용기·포장의 경고표지는 고용노동부고시가 정한 양식을 따릅니다. 화면의 그림은 모양과 색만 단순하게 그린 것이므로 실제 표지·그림문자는 각 원문을 따르세요.',
          'Workplace signs must be put up where workers can easily see them (OSH Act Art. 37); labels on chemical containers follow the MOEL notice. The drawings only show shape and colour — use the originals for real signs and pictograms.'))}
      ${ui.tabs('signs', [{ id: 'law', label: T(`안전보건표지 ${S.SIGNS.length}종`, `Safety signs (${S.SIGNS.length})`) }, { id: 'ghs', label: T('화학물질 경고표지 (GHS)', 'Chemical labels (GHS)') }], cur)}
      ${cur === 'ghs' ? ghsTab() : lawTab()}`;
    },
    mount(root) { S.listFilter(root, 'signs'); }
  };
})();

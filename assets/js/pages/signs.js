/* 안전보건표지 — 산안법 시행규칙 별표6~9 (종류·용도·설치 예시·색채·기본모형), 법 제37조·규칙 제38~40조 (설치·제작 의무)
   그림은 표지의 기본모형(모양·색)만 단순하게 그린 것이며, 실제 표지의 그림·부호는 별표6 원문을 따른다 */
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

  S.pages.signs = {
    render() {
      const cats = Object.keys(S.SIGN_CATS), all = S.SIGNS;
      const n = (c) => all.filter((s) => s.cat === c).length;
      return `
      ${ui.head(T('라이브러리', 'Library'), T('안전보건표지', 'Safety and health signs'),
        T(`산안법 시행규칙 별표6~9가 정한 안전보건표지 ${all.length}종을 종류·용도·색으로 찾아봅니다.`, `The ${all.length} safety and health signs set by Annexes 6–9 of the OSH Rule, by type, use and colour.`),
        T('표지는 근로자가 쉽게 알아볼 수 있도록 설치하거나 붙여야 하고(산안법 제37조), 종류·형태·색채·설치 장소는 시행규칙이 정합니다. 이 화면의 그림은 기본모형의 모양과 색만 단순하게 그린 것이므로, 실제 표지의 그림·부호는 별표6 원문을 따르세요.',
          'Signs must be put up where workers can easily see them (OSH Act Art. 37); their types, shapes, colours and locations are set by the Rule. The drawings here only show the basic shape and colour — use the pictograms in Annex 6 for real signs.'))}
      <section class="grid g3 sign-cats">
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
      </section>`;
    },
    mount(root) { S.listFilter(root, 'signs'); }
  };
})();

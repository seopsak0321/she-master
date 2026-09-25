/* 호흡보호구 선정 — 산소·IDLH·유해비(농도 ÷ 노출기준)로 필요한 보호계수를 구하고, 국내 안전인증 정화통 종류·등급과 대조
   근거: OSHA 29 CFR 1910.134(d) Table 1(src: oshaResp), 보호구 안전인증 고시 별표4·5(src: moelPpe), 안전보건규칙(src: lawStd), NIOSH IDLH(src: nioshIdlh) */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui, esc = S.esc;
  const num = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));
  const chem = (id) => S.CHEMICALS.find((c) => c.id === id);
  const DEF = { id: 'hf', conc: '4', o2: '20.9', unknown: false };

  function evaluate(st) {
    const c = chem(st.id) || S.CHEMICALS[0];
    const conc = num(st.conc), o2 = num(st.o2);
    const lim = c.twa != null ? c.twa : c.c;
    const limK = c.twa != null ? 'TWA' : 'C';
    const map = S.RESP_MAP[c.id] || 'none';
    const aerosol = map === 'aerosol';
    const can = !aerosol && map !== 'none' ? S.CANISTER[map] : null;
    const idlh = c.idlh != null && (c.idlhUnit || c.unit) === c.unit ? c.idlh : null;
    const out = { c, conc, o2, lim, limK, map, aerosol, can, idlh, gates: [] };
    if (o2 != null && o2 < 18) out.gates.push({ lv: 'bad', t: T('산소 18% 미만(산소결핍) — 방독·방진마스크를 쓸 수 없습니다. 공기호흡기 또는 송기마스크만 사용 (보호구 고시 별표4·5, 안전보건규칙 제618·620조)', 'Below 18 % oxygen (deficient) — no gas or dust masks. SCBA or airline respirators only (PPE Notice Annexes 4–5; Standards Rules Arts. 618, 620)') });
    else if (o2 != null && o2 < 19.5) out.gates.push({ lv: 'warn', t: T('산소 19.5% 미만 — 미국 OSHA는 산소결핍 대기를 IDLH로 봅니다(국내 기준 18%는 충족). 원인 확인과 환기를 먼저 하세요.', 'Below 19.5 % oxygen — US OSHA treats oxygen deficiency as IDLH (the Korean 18 % is met). Find the cause and ventilate first.') });
    if (o2 != null && o2 >= 23.5) out.gates.push({ lv: 'warn', t: T('산소 23.5% 이상 — 적정공기 범위를 벗어난 산소 과잉입니다. 화재 위험을 먼저 해소하세요 (제618조).', '23.5 % oxygen or more — oxygen-enriched, outside acceptable air. Deal with the fire risk first (Art. 618).') });
    if (st.unknown || conc == null) { out.idlhCase = true; out.why = T('농도를 모르면 IDLH 대기로 간주합니다 (OSHA 1910.134(d)(1)(iii))', 'An unknown concentration is treated as IDLH (OSHA 1910.134(d)(1)(iii))'); }
    else if (idlh != null && conc >= idlh) { out.idlhCase = true; out.why = T(`측정 농도가 IDLH(${idlh} ${c.unit}) 이상입니다`, `The reading is at or above the IDLH (${idlh} ${c.unit})`); }
    if (lim == null) { out.noLimit = true; return out; }
    if (out.idlhCase) return out;
    out.hr = conc / lim;
    const ppmPct = c.unit === 'ppm' ? conc / 10000 : null;   /* % by volume, for gas-mask class limits */
    const apOk = o2 == null || o2 >= 18;
    /* the lowest class whose concentration limit covers the reading (low → medium → high) */
    out.grade = can && ppmPct != null ? S.GASMASK_GRADE.slice().reverse().find((g) => ppmPct <= g.max[c.id === 'nh3' ? 1 : 0]) || null : null;
    out.rows = S.APF.map((r) => {
      const isAP = !r.sup;
      let ok = r.apf >= out.hr, why = ok ? '' : T('보호계수 부족', 'APF too low');
      if (ok && isAP) {
        if (!apOk) { ok = false; why = T('산소결핍', 'O₂ deficient'); }
        else if (!aerosol && !can) { ok = false; why = T('인증 정화통 종류 없음', 'No certified canister type'); }
        else if (can && !out.grade) { ok = false; why = T('방독마스크 사용 농도 초과', 'Above gas-mask limits'); }
        else if (can && out.grade && out.grade.full && !r.full) { ok = false; why = T(`${L(out.grade.t)}는 전면형만`, `${L(out.grade.t)} needs full face`); }
      }
      /* MUC is capped at the IDLH (OSHA 1910.134(d)(3)(i)(B)(3)) */
      const muc = Math.min(r.apf * lim, idlh != null ? idlh : Infinity);
      return Object.assign({}, r, { ok, why, muc });
    });
    /* simplest adequate choice: air-purifying before supplied air, then the lowest APF */
    out.best = out.rows.filter((r) => r.ok).sort((a, b) => (a.sup ? 1 : 0) - (b.sup ? 1 : 0) || a.apf - b.apf)[0] || null;
    return out;
  }
  S.ppeApi = { evaluate };

  S.pages.ppe = {
    render() {
      const st = Object.assign({}, DEF, S.load('ppe', {}));
      const ev = evaluate(st), c = ev.c;
      const skin = c.cat === 'acid' || c.cat === 'base';
      const lvl = ev.gates.some((g) => g.lv === 'bad') || ev.idlhCase ? 'bad' : ev.best ? (ev.best.sup ? 'warn' : 'ok') : 'info';
      return `
      ${ui.head(T('판정·평가 도구', 'Tools'), T('호흡보호구 선정', 'Respirator selection'),
        T('물질과 예상 농도를 넣으면 쓸 수 있는 호흡보호구를 고릅니다.', 'Enter a substance and the expected concentration to pick a suitable respirator.'),
        T('산소 농도 → IDLH 여부 → 유해비(농도 ÷ 노출기준)에 맞는 할당보호계수 순서로 판단하고, 국내 안전인증 방독마스크 정화통 종류·등급·표시색과 방진마스크 등급을 함께 보여줍니다.',
          'The tool checks oxygen, then IDLH, then the hazard ratio (concentration ÷ limit) against assigned protection factors, and shows the Korean certified canister type, class and colour and the dust-mask class.'))}
      <section class="grid g2">
        <div class="panel stack">
          <div class="form-grid">
            <div class="field"><label for="pp-id">${T('물질', 'Substance')}</label><select id="pp-id">${S.chemOptions(c.id)}</select></div>
            <div class="field"><label for="pp-conc">${T('예상·측정 농도', 'Expected or measured concentration')} (${c.unit})</label><input type="number" step="any" min="0" id="pp-conc" value="${esc(st.conc)}" ${st.unknown ? 'disabled' : ''}></div>
            <div class="field"><label for="pp-o2">${T('산소 농도 (%)', 'Oxygen (%)')}</label><input type="number" step="any" min="0" id="pp-o2" value="${esc(st.o2)}"></div>
          </div>
          <label class="check"><input type="checkbox" id="pp-unk" ${st.unknown ? 'checked' : ''}> ${T('농도를 알 수 없다 (누출 대응·첫 진입 등)', 'Concentration unknown (leak response, first entry)')}</label>
          <div class="small muted">CAS ${c.cas} · ${T('국내 노출기준', 'Korean limit')} ${ev.limK} ${ev.lim ?? '–'} ${c.unit}${S.cite('moelOel')}${ev.idlh != null ? ` · IDLH ${ev.idlh} ${c.unit}${S.cite('nioshIdlh')}` : ''}</div>
          <div class="callout small"><b>${T('정화통·필터', 'Canister / filter')}</b>: ${ev.can ? `${esc(L(ev.can.t))} — ${T('표시색', 'colour')} <b>${esc(L(ev.can.color))}</b> <span class="xs muted">(${T('시험가스', 'test gas')}: ${esc(L(ev.can.test))})</span>`
            : ev.aerosol ? T('미스트·분진(mg/m³ 기준) — 방진 필터. 증기도 함께 나오면 방독 성능을 겸한 겸용 제품', 'Mist or dust (mg/m³ limit) — particulate filter; if vapour is also present, a combined gas-and-dust product')
            : T('보호구 안전인증 고시의 방독마스크 6종(유기화합물·할로겐·황화수소·시안화수소·아황산·암모니아)에 대응 종류가 없습니다. 해당 가스로 성능을 인증받은 제품인지 확인하고, 없으면 송기마스크·공기호흡기를 씁니다.', 'None of the six certified gas-mask types (organic, halogen, H₂S, HCN, SO₂, ammonia) matches. Check for a product certified for this gas; otherwise use supplied air or SCBA.')}${S.cite('moelPpe')}</div>
          ${skin ? `<div class="callout small">${T('피부 자극성·부식성 물질 — 불침투성 보호복·보호장갑·보호장화와 보안경을 갖추고, 몸에 닿으면 바로 씻을 세척시설(세안·샤워)을 둡니다 (안전보건규칙 제451조). 장갑 재질은 공식 선정표가 없으므로 MSDS 8항(노출방지 및 개인보호구)과 제조사 투과 자료로 고릅니다.', 'Skin irritant or corrosive — provide impervious suits, gloves and boots, goggles and an eyewash or shower (Standards Rules Art. 451). There is no official glove chart; choose the material from MSDS section 8 and the maker’s permeation data.')}${S.cite('lawStd')}</div>` : ''}
        </div>
        <div class="result stack" aria-live="polite">
          <div class="row" style="justify-content:space-between"><span class="lbl">${T('최소 요건', 'Minimum')}</span>${ui.pill(lvl, ev.idlhCase ? 'IDLH' : ev.best ? L(ev.best.t) : T('판단 불가', 'Cannot decide'))}</div>
          ${ev.gates.map((g) => `<div class="callout ${g.lv} small">${esc(g.t)}</div>`).join('')}
          ${ev.idlhCase ? `<div class="callout bad small"><b>${esc(ev.why)}</b><br>${T('전면형 압력디맨드(양압) 공기호흡기(30분 이상 인증) 또는 보조 공기호흡기가 달린 전면형 압력디맨드 송기마스크만 씁니다 (OSHA 1910.134(d)(2)). 밀폐공간 구출 작업자도 공기호흡기·송기마스크를 착용합니다 (제643조).', 'Use only a full-facepiece pressure-demand SCBA (rated ≥ 30 min) or a full-facepiece pressure-demand airline respirator with an auxiliary self-contained supply (OSHA 1910.134(d)(2)). Confined-space rescuers also wear SCBA or airline respirators (Art. 643).')}</div>` : ''}
          ${ev.noLimit ? `<p class="small muted">${T('이 물질은 국내 노출기준이 없어 유해비를 계산할 수 없습니다.', 'No Korean limit for this substance, so no hazard ratio.')}</p>` : ''}
          ${ev.hr != null ? `<div class="big">${S.fmt(ev.hr, 2)} <span class="small muted">${T('유해비 = 농도 ÷', 'hazard ratio = conc ÷')} ${ev.limK}</span></div>
            <p class="small">${T('할당보호계수(APF)가 유해비 이상인 보호구를 씁니다. 최대사용농도(MUC) = APF × 노출기준, 단 IDLH를 넘을 수 없습니다.', 'Use a respirator whose APF is at least the hazard ratio. Maximum use concentration = APF × limit, capped at the IDLH.')}</p>
            ${ev.can ? `<p class="small">${T('방독마스크 등급', 'Gas-mask class')}: ${ev.grade ? `<b>${esc(L(ev.grade.t))}</b> (${T('최대', 'max')} ${ev.grade.max[c.id === 'nh3' ? 1 : 0]}%${ev.grade.full ? T(', 전면형', ', full face') : ''})` : T('<b>2%(암모니아 3%) 초과 — 방독마스크 불가</b>', '<b>above 2 % (ammonia 3 %) — no gas mask</b>')}</p>` : ''}
            <div class="table-wrap"><table class="data"><thead><tr><th>${T('보호구', 'Respirator')}</th><th class="n">APF</th><th class="n">MUC (${c.unit})</th><th>${T('판정', 'Result')}</th></tr></thead><tbody>
              ${ev.rows.map((r) => `<tr ${ev.best && r.id === ev.best.id ? 'class="sel"' : ''}><td class="small">${esc(L(r.t))}</td><td class="n">${S.fmt(r.apf, 0)}</td><td class="n">${S.fmt(r.muc)}</td><td>${r.ok ? ui.pill('ok', T('사용 가능', 'Suitable')) : `<span class="xs muted">${esc(r.why)}</span>`}</td></tr>`).join('')}
            </tbody></table></div>` : ''}
          <ul class="clean xs muted">
            <li>${T('가스·증기용 공기정화식은 수명 종료 표시(ESLI)가 있거나, 근거 자료에 따른 정화통 교체 주기를 정해야 합니다 (OSHA 1910.134(d)(3)(iii)). 국내 인증 방독마스크에는 파과곡선도·사용시간 기록카드가 표시됩니다 (별표5).', 'Air-purifying respirators for gases need an end-of-service-life indicator or a data-based change schedule (OSHA 1910.134(d)(3)(iii)). Korean certified gas masks carry a breakthrough curve and a use-time card (Annex 5).')}</li>
            <li>${T('APF는 착용 교육·밀착도 검사·관리가 이뤄지는 호흡보호 프로그램을 전제로 합니다. 전동식·송기식 후드·헬멧은 제조사 시험 근거가 있어야 APF 1,000을 적용합니다.', 'APFs assume a working respirator programme (training, fit testing, upkeep). PAPR and supplied-air hoods or helmets get an APF of 1,000 only with the maker’s test evidence.')}</li>
            <li>${T('금속·산·알칼리·가스상태 물질 취급 작업장은 적절한 호흡용 보호구를 지급하고, 공동 사용으로 감염 우려가 있으면 개인 전용을 지급합니다 (제450조④·제644조).', 'Where metals, acids, alkalis or gases are handled, provide suitable respirators, personal ones where sharing could spread infection (Arts. 450(4), 644).')}</li>
          </ul>
        </div>
      </section>
      <section class="grid g2">
        <div class="panel">${ui.title(T('방독마스크 정화통 (별표5)', 'Gas-mask canisters (Annex 5)'))}
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('종류', 'Type')}</th><th>${T('표시색', 'Colour')}</th><th>${T('시험가스', 'Test gas')}</th></tr></thead><tbody>
            ${Object.keys(S.CANISTER).map((k) => { const x = S.CANISTER[k]; return `<tr><td>${esc(L(x.t))}</td><td>${esc(L(x.color))}</td><td class="small">${esc(L(x.test))}</td></tr>`; }).join('')}
            <tr><td>${T('복합용·겸용', 'Multi-gas / combined')}</td><td colspan="2" class="small">${T('복합용은 해당 가스 색을 모두 표시(2층 분리), 겸용은 백색과 해당 가스 색을 함께 표시', 'Multi-gas: all relevant colours (two bands); combined with dust: white plus the gas colours')}</td></tr>
          </tbody></table></div>
          <div class="table-wrap" style="margin-top:8px"><table class="data"><thead><tr><th>${T('등급', 'Class')}</th><th>${T('사용 장소 (가스·증기 농도)', 'Where (gas or vapour concentration)')}</th></tr></thead><tbody>
            ${S.GASMASK_GRADE.map((g) => `<tr><td>${esc(L(g.t))}</td><td class="small">${g.max[0]}% ${T('이하', 'or less')}${g.max[1] !== g.max[0] ? T(` (암모니아 ${g.max[1]}%)`, ` (ammonia ${g.max[1]} %)`) : ''}${g.full ? T(' — 전면형만', ' — full face only') : ''}${g.note ? ' — ' + esc(L(g.note)) : ''}</td></tr>`).join('')}
          </tbody></table></div>
          <p class="xs muted" style="margin-top:6px">${T('방독마스크는 산소농도 18% 이상인 장소에서 사용합니다.', 'Gas masks are for places with at least 18 % oxygen.')}${S.cite('moelPpe')}</p>
        </div>
        <div class="panel">${ui.title(T('방진마스크 등급 (별표4)', 'Dust-mask classes (Annex 4)'))}
          <div class="table-wrap"><table class="data"><tbody>${S.DUSTMASK.map((d) => `<tr><th>${esc(L(d.t))}</th><td class="small">${esc(L(d.where))}</td></tr>`).join('')}</tbody></table></div>
          <p class="xs muted" style="margin-top:6px">${T('배기밸브가 없는 안면부여과식은 특급·1급 장소에 쓰지 않습니다. 비소 화합물 잔류물처럼 독성이 강한 분진은 특급을 검토하세요(포털 해석).', 'Filtering facepieces without an exhalation valve are not for special or class-1 areas. For highly toxic dust such as arsenic-compound residues, consider the special class (portal reading).')}${S.cite('moelPpe')}</p>
        </div>
      </section>
      <p class="xs muted">${T('근거', 'Basis')}: ${S.cite('oshaResp', 'moelPpe', 'lawStd', 'nioshIdlh', 'moelOel')} · ${T('할당보호계수는 미국 OSHA 기준입니다(국내 법령에 같은 표가 없음). 판단 보조 도구이며, 실제 선정은 사업장 호흡보호 프로그램과 제품 인증 내용을 따르세요.', 'APFs are US OSHA values (Korean law has no equivalent table). A decision aid — follow your respirator programme and the product certification.')}</p>`;
    },
    mount(root) {
      const st = Object.assign({}, DEF, S.load('ppe', {}));
      const up = () => { S.save('ppe', st); S.refresh(); };
      root.querySelector('#pp-id').addEventListener('change', (e) => { st.id = e.target.value; st.conc = ''; up(); });
      root.querySelector('#pp-conc').addEventListener('change', (e) => { st.conc = e.target.value; up(); });
      root.querySelector('#pp-o2').addEventListener('change', (e) => { st.o2 = e.target.value; up(); });
      root.querySelector('#pp-unk').addEventListener('change', (e) => { st.unknown = e.target.checked; up(); });
    }
  };
})();

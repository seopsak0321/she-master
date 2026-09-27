/* 환경(E) 법정 의무 — 데이터·근거는 data/env.js 머리말 참고
   탭 1 통합환경관리 — 대상·통합환경관리인 선임 판정(법 제6조①, 시행규칙 제4조①·별표14의2)과 통합관리사업장 의무
   탭 2 특정 유해물질 — 대기법 시행규칙 별표2, 물환경법 시행규칙 별표3과 허가 기준(각 시행령 제11조·제31조)
   탭 3 지정폐기물 — 폐기물관리법 시행령 별표1, 시행규칙 별표5(보관 기간·보관창고·표지) */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui, esc = S.esc;
  const num = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));
  const chemLink = (id) => { const c = S.CHEMICALS.find((x) => x.id === id); return c ? `<a class="chip" href="#hazards/${id}">${esc(c.f.replace(/<[^>]+>/g, ''))}</a>` : ''; };

  /* ---------- 탭 1 통합환경관리 ---------- */
  const IP0 = { sec: '261', air: '', water: '', sme: false };
  function ipEval(st) {
    const I = S.ENV_IP, air = num(st.air), wat = num(st.water);
    if (st.sec === 'none') return { lv: 'info', out: true };
    if (air == null && wat == null) return { lv: 'none' };
    const hit = (air != null && air >= I.air) || (wat != null && wat >= I.water);
    if (!hit) return { lv: 'ok', hit, partial: air == null || wat == null };
    const big = air != null && wat != null && air >= I.mgrAir && wat >= I.mgrWater;
    const small = air != null && wat != null && air < I.mgrAir && wat < I.mgrWater;
    return { lv: 'bad', hit, gen: big ? 2 : 1, combine: st.sme || small, unsure: !big && !small && (air == null || wat == null) };
  }
  function ipTab() {
    const st = Object.assign({}, IP0, S.load('env.ip', IP0)), I = S.ENV_IP, ev = ipEval(st);
    return `
      <section class="grid g2" id="anchor-ip">
        <div class="panel stack">${ui.title(T('통합허가 대상·통합환경관리인 판정', 'Integrated permit and environmental manager check'), T('법 제6조① · 시행규칙 제4조①·별표14의2', 'Act Art. 6(1) · Rule Art. 4(1), Annex 14-2'))}
          <div class="field"><label for="ip-sec">${T('업종 (시행령 별표1)', 'Industry (Decree Annex 1)')}</label><select id="ip-sec">
            ${I.sectors.map((s) => `<option value="${s.code}" ${st.sec === s.code ? 'selected' : ''}>${esc(`${s.no}. ${L(s.t)} (${s.code})`)}</option>`).join('')}
            <option value="none" ${st.sec === 'none' ? 'selected' : ''}>${T('별표1 업종이 아님', 'Not an Annex 1 industry')}</option></select></div>
          <div class="form-grid">
            <div class="field"><label for="ip-air">${T('먼지·질소산화물·황산화물 연간 발생량 합계 (톤)', 'Dust + NOx + SOx generated per year (t)')}</label><input type="number" step="any" min="0" id="ip-air" value="${esc(st.air)}"></div>
            <div class="field"><label for="ip-water">${T('폐수 1일 배출량 (㎥)', 'Wastewater discharged per day (m³)')}</label><input type="number" step="any" min="0" id="ip-water" value="${esc(st.water)}"></div>
          </div>
          <label class="check"><input type="checkbox" id="ip-sme" ${st.sme ? 'checked' : ''}> ${T('중소기업기본법상 중소기업', 'SME under the Framework Act on SMEs')}</label>
          <p class="xs muted">${T('발생량은 대기환경보전법 시행규칙 제42조①·제43조, 폐수배출량은 물환경보전법 시행령 별표13 비고 제2호의 방법으로 산정합니다 (시행규칙 제4조②③).', 'Air amounts follow Air Rule Arts. 42(1) and 43; wastewater follows Water Decree Annex 13, note 2 (Rule Art. 4(2)(3)).')}${S.cite('envIpRule')}</p>
        </div>
        <div class="result stack" aria-live="polite">
          ${ev.out ? `<div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Result')}</span>${ui.pill('info', T('제6조① 대상 업종 아님', 'Not a covered industry'))}</div><p class="small">${T('통합허가는 시행령 별표1 업종 중 기준 이상인 사업장이 받습니다. 대상이 아니면 대기·물 등 개별 법의 배출시설 허가·신고를 따릅니다.', 'Integrated permits apply to Annex 1 industries above the thresholds; otherwise the air, water and other acts apply separately.')}</p>`
          : ev.lv === 'none' ? `<p class="small muted">${T('발생량이나 배출량을 넣으세요', 'Enter the air or wastewater amount')}</p>`
          : ev.lv === 'ok' ? `<div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Result')}</span>${ui.pill('ok', T('기준 미만', 'Below the thresholds'))}</div>
            <p class="small">${T(`대기 연 ${I.air}톤·폐수 일 ${I.water}㎥ 기준 미만이면 통합관리사업장이 아닙니다. 해당 업종 사업장은 스스로 통합허가를 신청할 수 있습니다 (제6조⑥).`, `Below ${I.air} t a year of air pollutants and ${I.water} m³ a day of wastewater, the site is not an integrated-management site; sites in the industry may still apply voluntarily (Art. 6(6)).`)}</p>
            ${ev.partial ? `<p class="xs" style="color:var(--warn)">${T('두 값 중 하나만 넣었습니다 — 다른 값도 기준 미만인지 확인하세요.', 'Only one value entered — check the other is below its threshold too.')}</p>` : ''}`
          : `<div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Result')}</span>${ui.pill('bad', T('통합허가 대상 (제6조①)', 'Integrated permit required (Art. 6(1))'))}</div>
            <div class="big">${T(`총괄 1 + 일반 ${ev.gen}명 이상`, `1 lead + ${ev.gen} general or more`)}</div>
            <p class="small">${T(`통합환경관리인을 통합환경총괄관리자와 통합환경일반관리자로 나눠 선임합니다 (시행규칙 제25조의2②·별표14의2). 대기 연 ${I.mgrAir}톤 이상이면서 폐수 일 ${S.fmt(I.mgrWater)}㎥ 이상이면 일반관리자 2명 이상, 그 밖에는 1명 이상입니다.`, `Appoint environmental managers split into a lead and general managers (Rule Art. 25-2(2), Annex 14-2): two or more general managers where air is ${I.mgrAir} t a year or more and wastewater ${S.fmt(I.mgrWater)} m³ a day or more, otherwise one or more.`)}</p>
            ${ev.combine ? `<p class="small">${T('대기 80톤 미만·폐수 2,000㎥ 미만인 사업장이나 중소기업은 환경 업무 경력 2년 이상인 일반관리자가 총괄관리자를 겸할 수 있습니다 (별표14의2 제2호).', 'At sites under 80 t and 2,000 m³, or at SMEs, a general manager with two years’ environmental experience may also act as lead (Annex 14-2, item 2).')}</p>` : ''}
            ${ev.unsure ? `<p class="xs" style="color:var(--warn)">${T('두 값을 모두 넣어야 선임 인원을 정확히 판정합니다.', 'Enter both values to size the manager team exactly.')}</p>` : ''}`}
          <p class="xs muted">${T(`반도체 제조업(261)은 ${S.ENV_IP.sectors[0].from.slice(0, 4)}년 1월 1일부터 적용되며, 그때 이미 배출시설을 운영하던 사업자는 적용일부터 4년 이내에 통합허가를 받아야 했습니다 (법 부칙 경과조치).`, `Semiconductor manufacturing (261) has been covered since 1 January ${S.ENV_IP.sectors[0].from.slice(0, 4)}; operators already running facilities then had four years from that date to obtain the permit (transitional provision).`)}${S.cite('envIpDecree', 'envIp')}</p>
        </div>
      </section>
      <section class="panel stack">${ui.title(T('통합관리사업장의 주요 의무', 'Main duties at integrated-management sites'), T('환경오염시설의 통합관리에 관한 법률', 'Act on Integrated Control of Pollution-Discharging Facilities'))}
        <ul class="facts">
          <li><b>${T('허가 의제', 'One permit for many')}</b> — ${T('통합허가를 받으면 대기 배출시설(비산배출·비산먼지·휘발성유기화합물 포함)·소음진동·폐수배출시설(비점오염원 포함)·악취·특정토양오염관리대상시설·폐기물처리시설의 허가·신고를 받은 것으로 보고, 각 법의 ‘배출허용기준’은 ‘허가배출기준’으로 읽습니다 (제10조).', 'The integrated permit counts as the permits and notifications for air emission facilities (including fugitive emissions, dust and VOCs), noise and vibration, wastewater (including non-point sources), odour, specified soil-contamination facilities and waste-treatment facilities; each act’s “emission standard” reads as the “permitted emission standard” (Art. 10).')}</li>
          <li><b>${T('가동개시 신고', 'Start-up notice')}</b> — ${T('배출시설·방지시설의 설치나 변경을 마치고 가동하려면 가동개시 신고 (제12조①)', 'File a start-up notice before running newly installed or changed facilities (Art. 12(1))')}</li>
          <li><b>${T('방지시설 운영 금지행위', 'Prohibited operation')}</b> — ${T('배출시설 가동 중 방지시설을 끄거나 공기를 섞어 배출, 방지시설을 거치지 않는 배출관 설치, 부식·마모·고장 방치, 폐수를 방지시설·최종 방류구를 거치지 않고 배출하거나 물을 섞어 희석 (화재·폭발 예방 등 장관이 인정한 경우 예외) (제21조①)', 'Running emission facilities with control equipment off or diluting with air, bypass ducts, leaving corrosion, wear or faults unrepaired, discharging wastewater around the treatment plant or final outfall, or diluting it (exceptions only where the Minister accepts, e.g. to prevent fire or explosion) (Art. 21(1))')}</li>
          <li><b>${T('측정기기', 'Monitoring instruments')}</b> — ${T('고의로 작동하지 않게 하기, 고장 난 기기 방치, 고의 훼손, 조작해 측정 결과를 빠뜨리거나 거짓 작성 금지 (제20조①)', 'Never switch off deliberately, leave faulty, damage, or manipulate to omit or falsify readings (Art. 20(1))')}</li>
          <li><b>${T('통합환경관리인', 'Environmental managers')}</b> — ${T('선임·해임·퇴직은 지체 없이 신고하고 해임·퇴직일부터 30일 이내 재선임(승인받으면 연장), 일시 부재 시 대리자 지정, 다른 법정 의무고용 직무 겸직 제한 (제21조의2)', 'Report appointments and departures without delay and reappoint within 30 days (extendable with approval); name a deputy during absences; no doubling as another legally required post (Art. 21-2)')}</li>
          <li><b>${T('연간 보고서', 'Annual report')}</b> — ${T('매년 7월 31일까지 지난 연도의 운영·관리 보고서를 통합환경허가시스템으로 제출: 허가조건·허가배출기준 이행, 시설 설치·운영, 사후 모니터링·유지관리, 환경오염사고 예방·사후조치 (제33조①, 시행규칙 제35조). 2026.12.10부터 요건을 갖춘 통합허가대행업자에게 작성을 맡길 수 있음 (제33조②, 법률 제21783호)', 'By 31 July each year, submit last year’s operations report through the integrated permit system: permit conditions and limits, facility operation, follow-up monitoring and maintenance, and accident prevention and response (Art. 33(1), Rule Art. 35). From 10 Dec 2026 a qualified permit agent may prepare it (Art. 33(2), Act No. 21783)')} <a href="#home/cycles">${T('업무판 법정 주기', 'Dashboard cycles')} →</a></li>
          <li><b>${T('허가조건 재검토', 'Permit review')}</b> — ${T('장관이 허가조건·허가배출기준을 5년마다 검토하며, 배출수준을 계속 현저히 낮게 유지하면 3년 범위에서 주기 연장 (제9조①③)', 'The Minister reviews permit conditions and limits every five years, extendable by up to three years for sites that stay well below their limits (Art. 9(1)(3))')}</li>
        </ul>
        <p class="xs muted">${S.cite('envIp', 'envIpRule')}</p>
      </section>
      ${skAir()}`;
  }
  /* SK하이닉스 공개 자료 — 대기오염물질 배출량 (지속가능경영보고서 2026 p.104·p.39) */
  const SK_GAS = () => [['SOx', T('황산화물 SOx', 'SOx')], ['NOx', T('질소산화물 NOx', 'NOx')], ['dust', T('먼지', 'Dust')], ['HF', T('불화수소 HF', 'HF')], ['HCl', T('염화수소 HCl', 'HCl')], ['NH3', T('암모니아 NH₃', 'NH₃')]];
  function skAir() {
    const K = S.ENV_SK, y = K.years, span = (a) => `${a[0].toFixed(1)} → <b>${a[a.length - 1].toFixed(1)}</b>`;   /* 보고서처럼 소수 한 자리 (0.0 포함) */
    return `<section class="panel stack">${ui.title(T('SK하이닉스 공개 자료 — 대기오염물질 배출량', 'SK hynix disclosures — air emissions'), T(`지속가능경영보고서 2026 · 톤/년 · ${y[0]} → ${y[y.length - 1]}`, `Sustainability Report 2026 · t/yr · ${y[0]} → ${y[y.length - 1]}`))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('물질', 'Pollutant')}</th><th class="n">${T('이천', 'Icheon')}</th><th class="n">${T('청주', 'Cheongju')}</th></tr></thead><tbody>
          ${SK_GAS().map(([k, l]) => `<tr><td>${l}</td><td class="n">${span(K.air.icheon[k])}</td><td class="n">${span(K.air.cheongju[k])}</td></tr>`).join('')}
        </tbody></table></div>
        <ul class="facts">
          <li>${T(`국내 사업장 대기오염물질 배출량 ${K.airTotal.y2020}톤(2020) → ${K.airTotal.y2025}톤(2025) — 관리 목표는 2020년 수준 대비 감소 (p.39)`, `Domestic air emissions ${K.airTotal.y2020} t (2020) → ${K.airTotal.y2025} t (2025), against a goal of staying below the 2020 level (p.39)`)}</li>
          <li>${esc(L(K.tech))}</li>
          <li>${esc(L(K.gas))}</li>
        </ul>
        <p class="xs muted">${T('보고서 수치는 방지시설을 거쳐 나간 ‘배출량’입니다. 통합허가 대상 판정의 기준은 ‘발생량’(대기법 시행규칙 제42조·제43조 방법)이므로 위 판정에 그대로 넣지 마세요. HF·염화수소는 특정대기유해물질(9·10호)입니다.', 'These are post-treatment emissions; the permit thresholds use amounts generated (Air Rule Arts. 42–43), so do not put these figures into the check above. HF and HCl are specified air pollutants (Nos. 9–10).')}${S.cite('sr2026')}</p>
      </section>`;
  }
  function skWaste() {
    const K = S.ENV_SK, y = K.years;
    return `<section class="panel stack">${ui.title(T('SK하이닉스 공개 자료 — 지정폐기물', 'SK hynix disclosures — designated waste'), T('지속가능경영보고서 2026 · 국내(이천·청주)', 'Sustainability Report 2026 · Korea (Icheon, Cheongju)'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('구분', 'Item')}</th>${y.map((x) => `<th class="n">${x}</th>`).join('')}</tr></thead><tbody>
          <tr><td>${T('발생량 (톤)', 'Generated (t)')}</td>${K.waste.gen.map((v) => `<td class="n">${S.fmt(v, 0)}</td>`).join('')}</tr>
          <tr><td>${T('재활용률 (%)', 'Recycled (%)')}</td>${K.waste.rate.map((v) => `<td class="n">${v.toFixed(1)}</td>`).join('')}</tr>
        </tbody></table></div>
        <p class="small">${esc(L(K.zwtl))}</p>
        <p class="xs muted">${T('보고서 p.119(SASB TC-SC-150a.1) — 국내는 폐기물관리법상 지정폐기물, 재활용률은 총 발생량 대비 재활용 처리량(에너지 회수·매립·단순 소각 제외). 2022~2024년 값은 보고서에서 수정된 값입니다.', 'Report p.119 (SASB TC-SC-150a.1) — designated waste under the Korean Wastes Control Act; recycling rate is recycled over generated (excluding energy recovery, landfill and plain incineration). The 2022–2024 figures are as corrected in the report.')}${S.cite('sr2026')}</p>
      </section>`;
  }

  /* ---------- 탭 2 특정 유해물질 ---------- */
  function pollutTab() {
    const rows = [...S.ENV_AIR.map((x) => ({ k: 'air', x })), ...S.ENV_WATER.map((x) => ({ k: 'water', x }))];
    const linked = rows.filter((r) => r.x.ids.length).length;
    return `
      <section class="grid g2" id="anchor-pollut">
        <div class="panel stack">${ui.title(T('특정대기유해물질', 'Specified air pollutants'), T(`대기환경보전법 시행규칙 별표2 · ${S.ENV_AIR.length}종`, `Air Rule Annex 2 · ${S.ENV_AIR.length}`))}
          <p class="small">${T('유해성대기감시물질 중 저농도에서도 장기간 들이마시거나 노출되면 사람의 건강이나 동식물 생육에 직접·간접으로 위해를 끼칠 수 있어 대기 배출 관리가 필요하다고 인정된 물질입니다 (법 제2조제9호). 이 물질이 부령 기준 이상 발생하는 배출시설은 신고가 아니라 설치허가 대상이고 (시행령 제11조①1), 규모 합계 30% 이상 늘리면 변경허가를 받습니다 (일반 배출시설은 50%, 제11조④1).', 'Air toxics under watch that, even at low levels over long exposure, may directly or indirectly harm people, plants or animals, so their emissions must be managed (Act Art. 2(9)). Facilities emitting them above the ordinance threshold need an installation permit, not just a notice (Decree Art. 11(1)1), and a change permit when capacity grows by 30 % or more (50 % for other facilities, Art. 11(4)1).')}${S.cite('envAir', 'envAirDecree', 'envAirRule')}</p></div>
        <div class="panel stack">${ui.title(T('특정수질유해물질', 'Specified water pollutants'), T(`물환경보전법 시행규칙 별표3 · ${S.ENV_WATER.length}종`, `Water Rule Annex 3 · ${S.ENV_WATER.length}`))}
          <p class="small">${T('사람의 건강, 재산이나 동식물의 생육에 직접 또는 간접으로 위해를 줄 우려가 있는 수질오염물질입니다 (법 제2조제8호). 기준 이상 배출되는 폐수배출시설은 설치허가 대상이고 (시행령 제31조①1), 폐수배출량이 30% 이상(일반 50%) 또는 하루 700㎥ 이상 늘면 변경허가를 받습니다 (제31조③1). 신고로 설치한 시설도 원료·공법이 바뀌어 새로 기준 이상 배출되면 허가 대상입니다 (제31조①6).', 'Water pollutants that may directly or indirectly harm people, property, plants or animals (Act Art. 2(8)). Wastewater facilities discharging them above the threshold need a permit (Decree Art. 31(1)1); a change permit is needed when discharge grows by 30 % (50 % otherwise) or by 700 m³ a day (Art. 31(3)1). A notified facility that starts discharging them above the threshold after a change of materials or process also needs a permit (Art. 31(1)6).')}${S.cite('envWater', 'envWaterDecree', 'envWaterRule')}</p></div>
      </section>
      <p class="callout small">${T('통합관리사업장은 이 허가를 통합허가로 받습니다 (통합법 제10조①). 반도체 공정 물질과 이름이 분명히 겹치는 항목에는 물질 DB 연결을 붙였습니다 — 실제 해당 여부와 배출량 기준은 배출시설 허가 서류와 관할 기관 판단을 따르세요.', 'Integrated-management sites get these permits through the integrated permit (Act Art. 10(1)). Items that clearly match fab substances link to the substance database — actual status and thresholds follow the facility permit and the authority’s decision.')}${S.cite('envIp')}</p>
      <section class="panel stack">
        ${S.listbar({ id: 'envpol', ph: T('물질 찾기 — 예: 불소, 비소, 구리', 'Find a substance — e.g. fluoride, arsenic, copper'), total: rows.length,
          facets: [{ key: 'k', label: T('구분', 'List'), opts: [{ id: 'air', label: T('대기 별표2', 'Air Annex 2'), n: S.ENV_AIR.length }, { id: 'water', label: T('물 별표3', 'Water Annex 3'), n: S.ENV_WATER.length }] },
            { key: 'db', label: T('물질 DB', 'Substance DB'), opts: [{ id: 'y', label: T('연결 있음', 'Linked'), n: linked }] }] })}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('구분', 'List')}</th><th class="n">${T('번호', 'No.')}</th><th>${T('물질', 'Substance')}</th><th>${T('물질 DB', 'Substance DB')}</th></tr></thead><tbody>
          ${rows.map((r) => `<tr data-li="${esc(r.x.t.ko + ' ' + r.x.t.en + ' ' + r.x.ids.join(' '))}" data-f-k="${r.k}" data-f-db="${r.x.ids.length ? 'y' : 'n'}"><td class="small">${r.k === 'air' ? T('대기', 'Air') : T('물', 'Water')}</td><td class="n">${r.x.no}</td><td>${esc(L(r.x.t))}</td><td>${r.x.ids.map(chemLink).join(' ') || '<span class="xs muted">–</span>'}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="small muted" data-lb-empty hidden>${T('찾는 물질이 없습니다.', 'No matching substance.')}</p>
        <p class="xs muted">${T('물 별표3의 11호는 2016.5.20 삭제되어 번호가 건너뜁니다.', 'Water Annex 3 item 11 was deleted on 2016-05-20, so the numbers skip it.')}${S.cite('envAirRule', 'envWaterRule')}</p>
      </section>`;
  }

  /* ---------- 탭 3 지정폐기물 ---------- */
  const W0 = { kind: 'acid', start: '', small: false };
  function wasteTab() {
    const st = Object.assign({}, W0, S.load('env.waste', W0)), W = S.ENV_WASTE, w = W.find((x) => x.id === st.kind) || W[0];
    const start = /^\d{4}-\d{2}-\d{2}$/.test(st.start) ? new Date(st.start + 'T00:00:00') : null;
    let d1 = null, d2 = null, span = '';
    if (start) {
      if (st.small) { const y = new Date(start); y.setFullYear(y.getFullYear() + 1); d2 = y; d1 = S.addDays(y, -1); span = T('1년', '1 year'); }
      else { d1 = S.addDays(start, w.days - 1); d2 = S.addDays(start, w.days); span = T(`${w.days}일`, `${w.days} days`); }
    }
    const G = S.ENV_WASTE_SIGN;
    return `
      <section class="grid g2" id="anchor-waste">
        <div class="panel stack">${ui.title(T('보관 기한 계산', 'Storage deadline'), T('폐기물관리법 시행규칙 별표5', 'Waste Rule Annex 5'))}
          <div class="field"><label for="wa-kind">${T('지정폐기물 종류', 'Designated waste')}</label><select id="wa-kind">${W.map((x) => `<option value="${x.id}" ${x.id === w.id ? 'selected' : ''}>${esc(L(x.t))} — ${x.days}${T('일', ' days')}</option>`).join('')}</select></div>
          <div class="field"><label for="wa-start">${T('보관 시작일', 'Storage started')}</label><input type="date" id="wa-start" value="${esc(st.start)}"></div>
          <label class="check"><input type="checkbox" id="wa-small" ${st.small ? 'checked' : ''}> ${T('1년간 배출하는 지정폐기물 총량이 3톤 미만인 사업장', 'Site generating less than 3 t of designated waste a year')}</label>
          <p class="xs muted">${T('폐산·폐알칼리·폐유·폐유기용제·폐촉매·폐흡착제·폐흡수제·폐농약·PCB 함유 폐기물·유기성 폐수처리 오니는 45일, 그 밖의 지정폐기물은 60일을 넘겨 보관할 수 없습니다. 3톤 미만 사업장은 1년 이내 (별표5, 처리 위탁 중단·천재지변 등으로 기관이 인정한 경우 예외).', 'Waste acid, alkali, oil, organic solvent, catalysts, adsorbents, absorbents, pesticides, PCB waste and organic wastewater sludge may not be stored beyond 45 days; other designated waste 60 days; sites under 3 t a year up to 1 year (Annex 5; exceptions where the authority accepts, e.g. suspended disposal contracts or natural disasters).')}${S.cite('envWasteRule')}</p>
        </div>
        <div class="result stack" aria-live="polite">
          ${start ? `<div class="row" style="justify-content:space-between"><span class="lbl">${T('보관 한도', 'Limit')} ${span}</span>${ui.pill('warn', T('이 날짜까지 처리 위탁', 'Hand over by this date'))}</div>
            <div class="big">${S.iso(d1)}</div>
            <p class="small">${T(`보관 시작일을 첫날로 세면 ${S.iso(d1)}, 다음 날부터 세면 ${S.iso(d2)}이 마지막 날입니다. 포털은 더 이른 날짜를 처리 위탁 기한으로 보여줍니다.`, `Counting the start day as day one, the last day is ${S.iso(d1)}; counting from the next day, ${S.iso(d2)}. The portal shows the earlier date as the deadline for handing it over.`)}</p>
            <p class="xs muted">${T('행정에 관한 기간은 민법을 준용하되, 의무를 부과하는 기간은 첫날을 산입합니다 — 다만 그것이 국민에게 불리하면 그러지 않습니다 (행정기본법 제6조). 적용이 애매하면 관할 기관에 확인하세요.', 'Administrative periods follow the Civil Act, but periods imposing duties count the first day — unless that is to the citizen’s disadvantage (Framework Act on Administration Art. 6). Check with the authority where unclear.')}${S.cite('lawAdmin')}</p>`
          : `<p class="small muted">${T('보관 시작일을 고르세요', 'Pick the date storage started')}</p>`}
          <div class="callout small"><b>${esc(L(w.t))}</b> <span class="xs muted">${esc(L(w.grp))}</span><br>${esc(L(w.def))}${(w.ex || []).length ? `<br><span class="xs">${T('해당될 수 있는 물질 DB 예', 'Substance DB examples that may apply')}: ${w.ex.map(chemLink).join(' ')}</span>` : ''}${S.cite('envWasteDecree')}</div>
        </div>
      </section>
      <section class="panel stack">${ui.title(T('반도체 사업장에서 나올 수 있는 지정폐기물', 'Designated waste a fab may produce'), T('폐기물관리법 시행령 별표1 중 발췌', 'Selected from Waste Decree Annex 1'))}
        <p class="small">${T('지정폐기물은 사업장폐기물 중 폐유·폐산 등 주변 환경을 오염시킬 수 있거나 의료폐기물 등 인체에 위해를 줄 수 있는 해로운 물질로서 대통령령으로 정하는 폐기물입니다 (법 제2조제4호).', 'Designated waste is business waste that may pollute the surroundings, such as waste oil or acid, or harm people, such as medical waste, as set by presidential decree (Act Art. 2(4)).')}${S.cite('envWaste')}</p>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('종류', 'Type')}</th><th>${T('기준', 'Definition')}</th><th class="n">${T('보관 한도', 'Storage limit')}</th></tr></thead><tbody>
          ${W.map((x) => `<tr ${x.id === w.id ? 'class="sel"' : ''}><td><b class="small">${esc(L(x.t))}</b><div class="xs muted">${esc(L(x.grp))}</div></td><td class="small">${esc(L(x.def))}</td><td class="n">${x.days}${T('일', ' d')}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="xs muted">${T('별표1에는 이 밖에도 폐합성 고분자화합물, 오니류, 폐페인트·폐래커, 폐석면, PCB 함유 폐기물, 의료폐기물, 수은폐기물 등이 있습니다.', 'Annex 1 also lists waste synthetic polymers, sludges, waste paint and lacquer, asbestos, PCB waste, medical waste, mercury waste and more.')}${S.cite('envWasteDecree')}</p>
      </section>
      <section class="grid g2">
        <div class="panel stack">${ui.title(T('보관 요건', 'Storage rules'), T('시행규칙 별표5', 'Rule Annex 5'))}
          <ul class="facts">
            <li>${T('지정폐기물에 부식되거나 파손되지 않는 재질의 보관시설·보관용기 사용', 'Use storage and containers the waste cannot corrode or break')}</li>
            <li>${T('물이 스며들지 않게 바닥을 포장하고 지붕·벽면과 충분한 유출방지시설을 갖춘 보관창고에 보관 — 드럼·탱크에 새지 않게 담고 겉면이 오염되지 않았으면 바닥 포장과 방류턱·방류벽을 갖춘 시설로 갈음', 'Keep it in a store with a sealed floor, roof, walls and enough spill containment — or, for sound drums and tanks with clean outsides, a sealed floor with a bund')}</li>
            <li>${T('폐유독물질 — 종류가 다른 것을 한 시설에 두면 반응성을 고려해 칸막이·바닥 구획선으로 구분, 섞기 전 위험성 확인, 환기·공조설비와 75lux 이상 조도, 자연발화성은 온도·습도를 낮추거나 통풍 — 별표5 10)', 'Wastetoxic chemicals — separate different kinds by partitions or floor markings according to reactivity, check the hazards before mixing, provide ventilation and at least 75 lux, and keep pyrophoric waste cool, dry or well ventilated — Annex 5, 10)')}</li>
          </ul>
          <p class="xs muted">${S.cite('envWasteRule')}</p>
        </div>
        <div class="panel stack">${ui.title(T('지정폐기물 보관표지', 'Designated-waste storage sign'), T('시행규칙 별표5 9)', 'Rule Annex 5, 9)'))}
          <div class="waste-sign" role="img" aria-label="${T('지정폐기물 보관표지 양식', 'Storage sign layout')}"><b>${T('지정폐기물 보관표지', 'Designated waste storage')}</b><ol>${G.items.map((x) => `<li>${esc(L(x))}</li>`).join('')}</ol></div>
          <p class="small">${esc(L(G.size))} · ${esc(L(G.color))}</p>
          <p class="xs muted">${T('보관창고에는 사람이 쉽게 볼 수 있는 곳에 설치하고, 드럼 등 용기별로 보관하면 용기마다 종류·양·배출업소를 적습니다. 안전보건표지(산안법)와는 별개입니다.', 'Put it where people can easily see it; when storing in drums, mark each container with the type, amount and generator. It is separate from OSH safety signs.')}${S.cite('envWasteRule')} <a href="#signs/law">${T('안전보건표지', 'Safety signs')} →</a></p>
        </div>
      </section>
      ${skWaste()}`;
  }

  /* ---------- 탭 4 화학물질 배출저감계획서 (화관법 제11조의2, 시행규칙 제5조의2, 고시 제2025-18호) ---------- */
  const ERP0 = { stage: '3', staff: '', ton: 'y', first: '' };
  function erpEval(st) {
    const staff = num(st.staff), K = S.ENV_ERP;
    if (st.ton !== 'y') return { lv: 'ok', why: 'ton' };
    if (staff == null) return { lv: 'none' };
    if (staff < 30) return { lv: 'ok', why: 'staff' };
    if (st.stage === '1') { const y = num(st.first); return y ? { lv: 'bad', due: `${y + 2}-05-31`, rule: 'r6' } : { lv: 'bad', needYear: true }; }
    const row = (st.stage === '2' ? K.dl2 : K.dl3).find(([n]) => staff >= n);
    return { lv: 'bad', due: row[1], rule: 'add3', n: row[0] };
  }
  function erpTab() {
    const st = Object.assign({}, ERP0, S.load('env.erp', ERP0)), ev = erpEval(st), K = S.ENV_ERP;
    const rows = [...K.p1.map((x) => ({ s: '1', x })), ...K.p2.map((x) => ({ s: '2', x }))];
    const dbOf = (cas) => S.CHEMICALS.filter((c) => c.cas === cas).map((c) => chemLink(c.id)).join(' ');
    const past = ev.due && ev.due < S.iso(S.today());
    const dl = (tbl) => tbl.map(([n, d]) => `<tr><td>${T(`종업원 ${n}명 이상`, `${n}+ employees`)}</td><td class="n">${d}</td></tr>`).join('');
    return `
      <section class="grid g2" id="anchor-erp">
        <div class="panel stack">${ui.title(T('제출 대상·기한 판정', 'Who must submit, and by when'), T('시행규칙 제5조의2 · 고시 제6조·부칙 제3조', 'Rule Art. 5-2 · Notice Art. 6, addendum Art. 3'))}
          <div class="field"><label for="erp-stage">${T('배출하는 물질의 단계 (고시 별표1)', 'Phase of the substance (Notice Annex 1)')}</label><select id="erp-stage">
            ${[['1', T('1단계 9종 — 벤젠·디클로로메탄 등', 'Phase 1 (9) — benzene, dichloromethane and others')], ['2', T('2단계 44종 — 톨루엔·자일렌·일산화 탄소 등', 'Phase 2 (44) — toluene, xylene, carbon monoxide and others')], ['3', T('3단계 — 그 밖의 배출량조사 대상 화학물질', 'Phase 3 — other survey chemicals')]].map(([v, l]) => `<option value="${v}" ${st.stage === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
          <div class="form-grid">
            <div class="field"><label for="erp-ton">${T('그 물질을 연간 1톤 이상 배출', 'Emits 1 t or more of it a year')}</label><select id="erp-ton"><option value="y" ${st.ton === 'y' ? 'selected' : ''}>${T('예', 'Yes')}</option><option value="n" ${st.ton === 'n' ? 'selected' : ''}>${T('아니오', 'No')}</option></select></div>
            <div class="field"><label for="erp-staff">${T('종업원 수 (명)', 'Employees')}</label><input type="number" min="0" step="1" id="erp-staff" value="${esc(st.staff)}"></div>
            ${st.stage === '1' ? `<div class="field"><label for="erp-first">${T('처음 1톤 이상 배출한 해', 'First year with 1 t or more')}</label><input type="number" min="2000" max="2100" step="1" id="erp-first" value="${esc(st.first)}"></div>` : ''}
          </div>
          <p class="xs muted">${T('3단계는 화학물질관리법 시행령 제6조의 배출량조사 대상(유해화학물질, 대기오염물질·휘발성유기화합물·수질오염물질 중 화학물질, 지정된 발암성 등 물질) 가운데 1·2단계 53종을 뺀 나머지입니다.', 'Phase 3 is every survey chemical under Chemicals Control Decree Art. 6 (hazardous chemicals, chemical air and water pollutants, VOCs and designated carcinogens and the like) not already in phases 1–2.')}${S.cite('lawCcaDecree', 'nicsErp')}</p>
        </div>
        <div class="result stack" aria-live="polite">
          ${ev.lv === 'none' ? `<p class="small muted">${T('종업원 수를 넣으세요', 'Enter the number of employees')}</p>`
          : ev.lv === 'ok' ? `<div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Result')}</span>${ui.pill('ok', T('제출 대상 아님', 'Not required'))}</div>
            <p class="small">${ev.why === 'ton' ? T('고시 물질 중 어느 하나를 연간 1톤 이상 배출하는 사업장만 대상입니다 (시행규칙 제5조의2①1).', 'Only sites emitting 1 t or more a year of a listed substance are covered (Rule Art. 5-2(1)1).') : T('종업원 30명 이상인 사업장만 대상입니다 (시행규칙 제5조의2①2).', 'Only sites with 30 or more employees are covered (Rule Art. 5-2(1)2).')}</p>`
          : ev.needYear ? `<div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Result')}</span>${ui.pill('bad', T('제출 대상', 'Must submit'))}</div><p class="small">${T('처음 1톤 이상 배출한 해를 넣으면 최초 제출 기한을 계산합니다.', 'Enter the first year with 1 t or more to work out the first deadline.')}</p>`
          : `<div class="row" style="justify-content:space-between"><span class="lbl">${T('최초 제출 기한', 'First deadline')}</span>${ui.pill(past ? 'bad' : 'warn', past ? T('기한 지남', 'Past') : T('제출 대상', 'Must submit'))}</div>
            <div class="big">${ev.due}</div>
            <p class="small">${ev.rule === 'r6' ? T('1톤 이상 배출한 해의 1월 1일을 기준으로 2년이 되는 해의 5월 31일 (고시 제6조①, 시행규칙 제5조의2③).', 'By 31 May of the year two years after 1 January of the first year with 1 t or more (Notice Art. 6(1); Rule Art. 5-2(3)).') : T(`고시 부칙 제3조 — ${st.stage}단계 물질, 종업원 ${ev.n}명 이상 사업장의 기한입니다.`, `Notice addendum Art. 3 — the deadline for phase ${st.stage} substances at sites with ${ev.n}+ employees.`)}</p>
            <p class="xs muted">${T('이후에는 직전 계획서를 낸 뒤 5년이 지난 해의 5월 31일까지 다시 냅니다 (고시 제6조②, 법 제11조의2① ‘5년마다’). 폐기물처리업자가 다른 사업장의 화학물질 처리를 위탁받은 경우는 같은 해 9월 30일까지입니다.', 'After that, resubmit by 31 May of the year five years after the previous plan (Notice Art. 6(2); Act Art. 11-2(1) “every five years”). Waste processors handling other sites’ chemicals have until 30 September of the same year.')}</p>`}
          <p class="xs muted">${T('판정은 입력한 값만으로 하는 참고용입니다. 배출량은 화학물질 배출량조사 결과를 기준으로 확인하세요.', 'For reference only, from what you enter. Check emissions against the chemical release survey results.')}${S.cite('lawCca', 'lawCcaRule', 'nicsErp')}</p>
        </div>
      </section>
      <section class="grid g2">
        <div class="panel stack">${ui.title(T('계획서 내용과 절차', 'Contents and procedure'), T('법 제11조의2 · 시행규칙 제5조의2 · 고시', 'Act Art. 11-2 · Rule Art. 5-2 · Notice'))}
          <ul class="facts">
            <li>${T('내용: 사업자 일반 정보, 대상 물질의 취급량·취급 공정, 배출원·연간 배출량, 향후 5년간 배출저감 방안과 연도별 목표, 이행 실적(2회차부터) — 고시 별지 제1~6호서식 (규칙 제5조의2②, 고시 제4조)', 'Contents: general details; amounts and processes; release points and annual releases; five-year reduction plan and yearly targets; results so far (from the second plan) — Notice Forms 1–6 (Rule Art. 5-2(2); Notice Art. 4)')}</li>
            <li>${T('제출: 검토신청서와 함께 배출저감계획서 작성·제출용 웹사이트로 화학물질안전원장에게 (규칙 제5조의2③, 고시 제5조)', 'Submit with the review request through the dedicated website to the President of the National Institute of Chemical Safety (Rule Art. 5-2(3); Notice Art. 5)')}</li>
            <li>${T('검토: 접수 후 60일 이내 적합·부적합 통지, 보완 요청은 누적 30일(신청하면 1회 30일 연장), 부적합이면 협의한 기한까지 다시 제출 (고시 제8·9조)', 'Review: fit or unfit within 60 days; corrections take up to 30 days in total (one 30-day extension on request); if unfit, resubmit by the agreed date (Notice Arts. 8–9)')}</li>
            <li>${T('변경: 대상 물질이 추가되면 그 물질의 최초 기한(고시 제6조)까지, 기준년도 배출량 수정·공정 추가·저감 방안·목표 수정이나 지자체의 변경 요청은 변경 제출 통보를 받은 날부터 90일 이내 (규칙 제5조의2⑦, 고시 제10·11조)', 'Changes: an added substance by its own first deadline (Notice Art. 6); corrected base-year figures, an added process, a revised plan or a local-government request within 90 days of being told to resubmit (Rule Art. 5-2(7); Notice Arts. 10–11)')}</li>
            <li>${T('공개: 영업비밀은 비공개 심의를 신청할 수 있고(결과에 15일 이내 이의), 적합한 계획서의 주요 내용은 30일 이내 지자체·지방환경관서에 제공 (법 제11조의2④⑤, 고시 제13·14조)', 'Disclosure: trade secrets may be withheld on request (appeal within 15 days); key parts of approved plans go to local government and regional environment offices within 30 days (Act Art. 11-2(4)(5); Notice Arts. 13–14)')}</li>
          </ul>
          <p class="xs muted">${S.cite('lawCca', 'lawCcaRule', 'nicsErp')}</p>
        </div>
        <div class="panel stack">${ui.title(T('단계별 최초 제출 기한', 'First deadlines by phase'), T('고시 부칙 제3조', 'Notice addendum Art. 3'))}
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('2단계 물질', 'Phase 2')}</th><th class="n">${T('기한', 'Deadline')}</th></tr></thead><tbody>${dl(K.dl2)}</tbody></table></div>
          <div class="table-wrap"><table class="data"><thead><tr><th>${T('3단계 물질', 'Phase 3')}</th><th class="n">${T('기한', 'Deadline')}</th></tr></thead><tbody>${dl(K.dl3)}</tbody></table></div>
          <p class="xs muted">${T('1단계 물질은 고시 제6조①의 일반 기준(1톤 이상 배출한 해 + 2년이 되는 해의 5월 31일)을 따릅니다. 지자체가 지역 대상 물질로 따로 지정한 물질은 부칙 제3조를 적용하지 않습니다(부칙 제4조).', 'Phase 1 substances follow the general rule in Notice Art. 6(1) (31 May of the year two years after the first year with 1 t or more). Substances a local government designates for its area are not covered by addendum Art. 3 (addendum Art. 4).')}${S.cite('nicsErp')}</p>
        </div>
      </section>
      <section class="panel stack">${ui.title(T('1·2단계 대상 물질', 'Phase 1 and 2 substances'), T(`고시 별표1 · ${rows.length}종`, `Notice Annex 1 · ${rows.length}`))}
        ${S.listbar({ id: 'envErp', ph: T('물질 이름·CAS 찾기 — 예: 톨루엔, 1330-20-7', 'Find a name or CAS — e.g. toluene, 1330-20-7'), total: rows.length,
          facets: [{ key: 's', label: T('단계', 'Phase'), opts: [{ id: '1', label: T('1단계', 'Phase 1'), n: K.p1.length }, { id: '2', label: T('2단계', 'Phase 2'), n: K.p2.length }] }] })}
        <div class="table-wrap"><table class="data"><thead><tr><th class="n">${T('번호', 'No.')}</th><th>${T('물질', 'Substance')}</th><th>CAS</th><th>${T('물질 DB', 'Substance DB')}</th></tr></thead><tbody>
          ${rows.map((r) => `<tr data-li="${esc(r.x.t.ko + ' ' + r.x.t.en + ' ' + r.x.cas)}" data-f-s="${r.s}"><td class="n">${r.x.no}</td><td>${esc(L(r.x.t))}</td><td class="mono small">${r.x.cas}</td><td>${dbOf(r.x.cas) || '<span class="xs muted">–</span>'}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="small muted" data-lb-empty hidden>${T('찾는 물질이 없습니다.', 'No matching substance.')}</p>
        <p class="xs muted">${T('물질 DB 연결은 CAS 번호가 같은 경우만입니다. 53번 이름은 원문 표의 여는 괄호 누락만 보충했습니다.', 'Substance DB links match on CAS number only. Item 53’s name only adds the opening bracket missing from the original table.')}${S.cite('nicsErp')}</p>
      </section>`;
  }

  const TABS = { ip: () => T('통합환경관리', 'Integrated management'), pollut: () => T('특정 유해물질', 'Specified pollutants'), waste: () => T('지정폐기물', 'Designated waste'), erp: () => T('배출저감계획서', 'Emission-reduction plans') };
  S.envApi = { ipEval, erpEval };
  S.pages.env = {
    render(sub) {
      if (sub && TABS[sub] && !S.state.refreshing) S.save('tab.env', sub);
      const cur = TABS[S.tab('env', 'ip')] ? S.tab('env', 'ip') : 'ip';
      return `
      ${ui.head(T('라이브러리', 'Library'), T('환경 법정 의무', 'Environmental duties'),
        T('반도체 사업장에 걸리는 환경(E) 법정 의무 — 통합환경관리, 특정 유해물질, 지정폐기물을 원문 기준으로 봅니다.', 'Environmental duties for fabs — integrated pollution control, specified pollutants and designated waste, from the original texts.'),
        T('반도체 제조업은 환경오염시설의 통합관리에 관한 법률의 통합허가 대상 업종입니다. 대기·물·폐기물의 기준과 기한을 조문·별표 그대로 옮기고, 판정은 입력한 값만으로 하는 참고용입니다. 실제 의무는 사업장의 허가 조건과 관할 기관(기후에너지환경부·지방환경관서) 판단을 따르세요.',
          'Semiconductor manufacturing is a covered industry under the integrated pollution-control act. Thresholds and deadlines are taken straight from the articles and annexes; results use only what you enter and are for reference. Actual duties follow the site’s permit conditions and the authorities (Ministry of Climate, Energy and Environment and regional offices).'))}
      ${ui.tabs('env', Object.keys(TABS).map((id) => ({ id, label: TABS[id]() })), cur)}
      ${cur === 'pollut' ? pollutTab() : cur === 'waste' ? wasteTab() : cur === 'erp' ? erpTab() : ipTab()}`;
    },
    mount(root) {
      const cur = S.tab('env', 'ip');
      if (cur === 'pollut') { S.listFilter(root, 'envpol'); return; }
      if (cur === 'erp') {
        S.listFilter(root, 'envErp');
        const st = Object.assign({}, ERP0, S.load('env.erp', ERP0)), up = () => { S.save('env.erp', st); S.refresh(); };
        [['#erp-stage', 'stage'], ['#erp-ton', 'ton'], ['#erp-staff', 'staff'], ['#erp-first', 'first']].forEach(([s, k]) => { const el = root.querySelector(s); if (el) el.addEventListener('change', () => { st[k] = el.value; up(); }); });
        return;
      }
      if (cur === 'waste') {
        const st = Object.assign({}, W0, S.load('env.waste', W0)), up = () => { S.save('env.waste', st); S.refresh(); };
        [['#wa-kind', 'kind'], ['#wa-start', 'start']].forEach(([s, k]) => { const el = root.querySelector(s); if (el) el.addEventListener('change', () => { st[k] = el.value; up(); }); });
        const sm = root.querySelector('#wa-small'); if (sm) sm.addEventListener('change', () => { st.small = sm.checked; up(); });
        return;
      }
      const st = Object.assign({}, IP0, S.load('env.ip', IP0)), up = () => { S.save('env.ip', st); S.refresh(); };
      [['#ip-sec', 'sec'], ['#ip-air', 'air'], ['#ip-water', 'water']].forEach(([s, k]) => { const el = root.querySelector(s); if (el) el.addEventListener('change', () => { st[k] = el.value; up(); }); });
      const sme = root.querySelector('#ip-sme'); if (sme) sme.addEventListener('change', () => { st.sme = sme.checked; up(); });
    }
  };
})();

/* 수치 판정 센터 — 측정값을 국내 법령·고시와 국제 기준에 대조 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui;
  const chemById = (id) => S.CHEMICALS.find((c) => c.id === id);
  const num = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));

  /* ---------- judgement engines (also used by SDX / prevent) ---------- */
  S.judgeExposure = function (c, twa, stel, peak) {
    const out = [];
    if (twa != null) {
      if (c.twa != null) {
        const r = twa / c.twa;
        out.push({ k: 'TWA', v: twa, lim: c.twa, ratio: r,
          level: r > 1 ? 'bad' : r > 0.5 ? 'warn' : 'ok',
          msg: r > 1 ? T('시간가중평균 노출기준 초과', 'Exceeds the TWA limit')
            : r > 0.5 ? T('노출기준의 50% 초과 — 개선 검토 권고 (포털 관리선)', 'Above 50 % of the limit — review controls (portal action line)')
              : T('노출기준의 50% 이하', 'At or below 50 % of the limit') });
      } else {
        out.push({ k: 'TWA', v: twa, lim: null, level: 'info', msg: T('이 물질은 TWA가 아닌 다른 기준(C 등)으로 관리됩니다', 'This substance is controlled by another limit type (e.g. ceiling)') });
      }
    }
    if (stel != null) {
      if (c.stel != null) {
        const r = stel / c.stel;
        let level = r > 1 ? 'bad' : 'ok', msg = r > 1 ? T('단시간노출기준(STEL) 초과', 'Exceeds the STEL') : T('STEL 이하', 'Within the STEL');
        if (r <= 1 && c.twa != null && stel > c.twa) {
          level = 'warn';
          msg = T('TWA 초과·STEL 이하 구간 — 1회 15분 미만, 1일 4회 이하, 간격 60분 이상이어야 함 (고시 제2조)', 'Between TWA and STEL — each exposure < 15 min, ≤ 4 times a day, ≥ 60 min apart (Notice Art. 2)');
        }
        out.push({ k: 'STEL', v: stel, lim: c.stel, ratio: r, level, msg });
      } else if (c.c != null) {
        const r = stel / c.c;
        out.push({ k: 'C', v: stel, lim: c.c, ratio: r, level: r > 1 ? 'bad' : 'ok', msg: r > 1 ? T('최고노출기준(C) 초과 — 잠시라도 넘으면 안 됨', 'Exceeds the ceiling — must never be exceeded') : T('최고노출기준 이하', 'Within the ceiling') });
      } else {
        out.push({ k: 'STEL', v: stel, lim: null, level: 'info', msg: T('국내 고시에 STEL 값이 없습니다', 'No STEL in the Korean notice') });
      }
    }
    if (peak != null) {
      if (c.c != null) {
        const r = peak / c.c;
        out.push({ k: 'C', v: peak, lim: c.c, ratio: r, level: r > 1 ? 'bad' : 'ok', msg: r > 1 ? T('최고노출기준(C) 초과', 'Exceeds the ceiling') : T('최고노출기준 이하', 'Within the ceiling') });
      }
      if (c.idlh != null && (c.idlhUnit || c.unit) === c.unit) {
        const r = peak / c.idlh;
        out.push({ k: 'IDLH', v: peak, lim: c.idlh, ratio: r, level: r >= 1 ? 'bad' : r >= 0.1 ? 'warn' : 'ok', intl: true,
          msg: r >= 1 ? T('IDLH 이상 — 생명·건강에 즉각적 위험. 출입 통제, ERT 대응 판단', 'At or above IDLH — immediately dangerous. Control entry; ERT decides response')
            : r >= 0.1 ? T('IDLH의 10% 이상 — 원인 확인 전 접근 제한 권고 (포털 관리선)', '≥ 10 % of IDLH — restrict access until the cause is known (portal action line)')
              : T('IDLH의 10% 미만', 'Below 10 % of IDLH') });
      }
      if (c.c == null && c.idlh == null) out.push({ k: T('순간값', 'Peak'), v: peak, lim: null, level: 'info', msg: T('비교할 C·IDLH 값이 없습니다. TWA·STEL 측정으로 평가하세요', 'No ceiling or IDLH to compare; assess with TWA/STEL sampling') });
    }
    return out;
  };

  const worst = (list) => (list.some((x) => x.level === 'bad') ? 'bad' : list.some((x) => x.level === 'warn') ? 'warn' : list.some((x) => x.level === 'ok') ? 'ok' : 'info');
  const verdictText = (lv) => ({ bad: T('초과·위험', 'Exceeded / danger'), warn: T('주의', 'Caution'), ok: T('기준 이내', 'Within limits'), info: T('참고', 'Note') }[lv]);

  function gauge(ratio) {
    const pct = Math.min(ratio, 1.5) / 1.5 * 100;
    const col = ratio > 1 ? 'var(--bad)' : ratio > 0.5 ? 'var(--warn)' : 'var(--ok)';
    return `<div class="gauge" aria-hidden="true"><i style="width:${pct}%;background:${col}"></i><i style="left:${100 / 1.5 * 0.5}%;width:1px;background:var(--ink-2);opacity:.5"></i><i style="left:${100 / 1.5}%;width:2px;background:var(--ink)"></i></div>
      <div class="gauge-scale" aria-hidden="true"><span style="left:0">0</span><span style="left:33.33%">50%</span><span style="left:66.67%">100%</span><span style="left:100%">150%+</span></div>`;
  }

  function checksTable(list, unit) {
    return `<div class="table-wrap"><table class="data"><thead><tr><th>${T('기준', 'Limit')}</th><th class="n">${T('측정값', 'Measured')}</th><th class="n">${T('기준값', 'Limit')}</th><th class="n">${T('비율', 'Ratio')}</th><th>${T('판정', 'Verdict')}</th></tr></thead><tbody>
      ${list.map((x) => `<tr><td><b>${x.k}</b>${x.intl ? ` <span class="chip">NIOSH</span>` : ` <span class="chip">${T('국내', 'KR')}</span>`}</td><td class="n">${S.fmt(x.v, 4)} ${unit}</td><td class="n">${x.lim == null ? '–' : S.fmt(x.lim, 4) + ' ' + unit}</td><td class="n">${x.ratio == null ? '–' : S.fmt(x.ratio * 100, 0) + '%'}</td><td>${ui.pill(x.level, x.msg)}</td></tr>`).join('')}
    </tbody></table></div>`;
  }

  /* only substances with a Korean limit can be judged — the rest stay in the substance database */
  const chemOptions = (sel) => Object.keys(S.CHEM_CATS).map((cat) => { const list = S.CHEMICALS.filter((c) => c.cat === cat && S.hasOel(c));
    return list.length ? `<optgroup label="${S.esc(L(S.CHEM_CATS[cat]))}">${list.map((c) => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${S.esc(L(c))} (${c.f})</option>`).join('')}</optgroup>` : ''; }).join('');
  S.chemOptions = chemOptions;

  /* ---------- tools ---------- */
  const TOOLS = {
    chem: {
      label: () => T('화학물질 노출', 'Chemical exposure'),
      render() {
        const st = S.load('m.chem', { id: 'hf', twa: '0.3', stel: '', peak: '', segs: [['0.6', '2'], ['0.2', '6']] });
        const c = chemById(st.id);
        const segTwa = st.segs.reduce((a, [cv, h]) => a + (num(cv) || 0) * (num(h) || 0), 0) / 8;
        const hrs = st.segs.reduce((a, [, h]) => a + (num(h) || 0), 0);
        const res = S.judgeExposure(c, num(st.twa), num(st.stel), num(st.peak));
        const lv = worst(res);
        const main = res.find((x) => x.ratio != null);
        return `<div class="grid g2">
          <div class="panel stack">
            <div class="field"><label for="mc-id">${T('물질', 'Substance')}</label><select id="mc-id">${chemOptions(st.id)}</select></div>
            <div class="small muted">CAS ${c.cas} · ${T('국내 노출기준', 'Korean limits')}: TWA ${c.twa ?? '–'} · STEL ${c.stel ?? '–'} · C ${c.c ?? '–'} (${c.unit})${c.note ? ' · ' + S.esc(L(c.note)) : ''}${S.cite('moelOel')}${c.idlh != null ? ` · IDLH ${c.idlh} ${c.idlhUnit}${c.idlhNote ? ' (' + c.idlhNote + ')' : ''}${S.cite('nioshIdlh')}` : ''}</div>
            <div class="small">${S.regChips(c)}${S.cite('lawRule', 'lawStd')}${S.chemLinks(c) ? ` · ${S.chemLinks(c)}` : ''}</div>
            <div class="form-grid">
              <div class="field"><label for="mc-twa">${T('8시간 TWA', '8-h TWA')} (${c.unit})</label><input type="number" step="any" min="0" id="mc-twa" value="${S.esc(st.twa)}"></div>
              <div class="field"><label for="mc-stel">${T('15분 측정값', '15-min sample')} (${c.unit})</label><input type="number" step="any" min="0" id="mc-stel" value="${S.esc(st.stel)}"></div>
              <div class="field"><label for="mc-peak">${T('순간·감지기 값', 'Instant / detector')} (${c.unit})</label><input type="number" step="any" min="0" id="mc-peak" value="${S.esc(st.peak)}"></div>
            </div>
            <details><summary class="small"><b>${T('TWA 계산기 — 구간별 농도×시간', 'TWA calculator — concentration × time')}</b></summary>
              <div class="stack" style="margin-top:8px">
                ${st.segs.map(([cv, h], i) => `<div class="row"><input type="number" step="any" min="0" data-seg="${i}" data-k="0" value="${cv}" aria-label="${T('농도', 'Concentration')} ${i + 1}" style="max-width:130px"> <span class="small">${c.unit} ×</span> <input type="number" step="any" min="0" data-seg="${i}" data-k="1" value="${S.esc(h)}" aria-label="${T('시간', 'Hours')} ${i + 1}" style="max-width:90px"> <span class="small">h</span> <button class="btn danger sm" data-seg-del="${i}" type="button">×</button></div>`).join('')}
                <div class="row"><button class="btn ghost sm" type="button" id="seg-add">+ ${T('구간 추가', 'Add interval')}</button>
                <span class="small">TWA = Σ(C·T)/8 = <b class="num">${S.fmt(segTwa, 4)} ${c.unit}</b> (${S.fmt(hrs, 2)} h)</span>
                <button class="btn sm" type="button" id="seg-use">${T('TWA 칸에 적용', 'Use as TWA')}</button></div>
                ${hrs > 8 ? `<p class="xs" style="color:var(--warn)">${T('8시간 초과 근무는 노출기준 적용 시 근로시간을 특별히 고려해야 합니다 (고시 제3조②)', 'For shifts over 8 h, working time must be specially considered (Notice Art. 3(2))')}</p>` : ''}
              </div></details>
          </div>
          <div class="result" aria-live="polite">
            <div class="row" style="justify-content:space-between"><span class="lbl">${T('종합 판정', 'Overall')}</span>${ui.pill(lv, verdictText(lv))}</div>
            ${main ? `<div class="big">${S.fmt(main.ratio * 100, 0)}% <span class="small muted">${T('of', 'of')} ${main.k}</span></div>${gauge(main.ratio)}` : ''}
            ${res.length ? checksTable(res, c.unit) : `<p class="small muted">${T('측정값을 하나 이상 입력하세요', 'Enter at least one measurement')}</p>`}
            ${c.icsc ? `<div class="callout warn small"><b>ICSC</b>${S.cite('icsc')} — ${L(c.icsc)}</div>` : ''}
            ${lv === 'warn' || lv === 'bad' ? `<div class="stack" style="gap:6px"><b class="small">${T('다음 단계', 'Next steps')}</b><div class="row">
              <a class="btn ghost sm" href="#ppe" data-to-ppe>${T('이 농도로 호흡보호구 선정', 'Pick a respirator for this level')} →</a>
              <a class="btn ghost sm" href="#measure/wem">${T('측정·검진 주기 판정', 'Monitoring & health-check cycle')} →</a>
              <a class="btn ghost sm" href="#risk">${T('위험성평가에 반영', 'Add to the risk assessment')} →</a></div></div>` : ''}
            <p class="xs muted">${T('50%·IDLH 10% 관리선은 법적 기준이 아닌 포털의 참고선입니다(미국 OSHA 개별 물질 기준의 조치수준 개념 참고). 법적 판정은 작업환경측정 결과로 합니다.', 'The 50 % and 10 %-of-IDLH lines are portal reference lines, not legal limits (inspired by OSHA action levels). Legal findings rest on formal workplace measurement.')}</p>
          </div></div>`;
      },
      mount(root) {
        const st = S.load('m.chem', { id: 'hf', twa: '0.3', stel: '', peak: '', segs: [['0.6', '2'], ['0.2', '6']] });
        const upd = () => { S.save('m.chem', st); S.refresh(); };
        root.querySelector('#mc-id').addEventListener('change', (e) => { st.id = e.target.value; st.twa = st.stel = st.peak = ''; upd(); });
        ['twa', 'stel', 'peak'].forEach((k) => root.querySelector('#mc-' + k).addEventListener('change', (e) => { st[k] = e.target.value; upd(); }));
        root.querySelectorAll('[data-seg]').forEach((inp) => inp.addEventListener('change', () => { st.segs[inp.dataset.seg][inp.dataset.k] = inp.value; upd(); }));
        root.querySelectorAll('[data-seg-del]').forEach((b) => b.addEventListener('click', () => { st.segs.splice(Number(b.dataset.segDel), 1); upd(); }));
        root.querySelector('#seg-add').addEventListener('click', () => { st.segs.push(['', '']); upd(); });
        root.querySelector('#seg-use').addEventListener('click', () => { const v = st.segs.reduce((a, [cv, h]) => a + (num(cv) || 0) * (num(h) || 0), 0) / 8; st.twa = String(Math.round(v * 10000) / 10000); upd(); });
        /* 다음 단계 — 입력한 값 가운데 가장 높은 농도로 호흡보호구 선정을 채운다 */
        const tp = root.querySelector('[data-to-ppe]');
        if (tp) tp.addEventListener('click', () => { const hi = Math.max(...['twa', 'stel', 'peak'].map((k) => num(st[k]) || 0)); S.save('ppe', { id: st.id, conc: String(hi), o2: '20.9', unknown: false }); });
      },
      basis: ['moelOel', 'nioshIdlh', 'icsc']
    },

    confined: {
      label: () => T('밀폐공간 적정공기', 'Confined-space air'),
      render() {
        const st = S.load('m.conf', { o2: '19.2', co2: '0.4', co: '12', h2s: '0', lel: '4' });
        const K = S.CONFINED.kr, U = S.CONFINED.us;
        const o2 = num(st.o2), co2 = num(st.co2), co = num(st.co), h2s = num(st.h2s), lel = num(st.lel);
        const rows = [
          { p: T('산소 O₂', 'Oxygen O₂'), v: o2, u: '%', kr: T('18% 이상 23.5% 미만', '≥ 18 % and < 23.5 %'), krL: o2 == null ? null : (o2 >= K.o2Min && o2 < K.o2Max ? 'ok' : 'bad'), krM: o2 != null && o2 < K.o2Min ? T('산소결핍', 'Oxygen deficient') : '',
            us: T('19.5% 이상 23.5% 이하', '19.5–23.5 %'), usL: o2 == null ? null : (o2 >= U.o2Min && o2 <= U.o2Max ? 'ok' : 'bad') },
          { p: T('이산화탄소 CO₂', 'Carbon dioxide CO₂'), v: co2, u: '%', kr: T('1.5% 미만', '< 1.5 %'), krL: co2 == null ? null : (co2 < K.co2Max ? 'ok' : 'bad'), us: '–', usL: null },
          { p: T('일산화탄소 CO', 'Carbon monoxide CO'), v: co, u: 'ppm', kr: T('30ppm 미만', '< 30 ppm'), krL: co == null ? null : (co < K.coMax ? 'ok' : 'bad'), us: '–', usL: null },
          { p: T('황화수소 H₂S', 'Hydrogen sulfide H₂S'), v: h2s, u: 'ppm', kr: T('10ppm 미만', '< 10 ppm'), krL: h2s == null ? null : (h2s < K.h2sMax ? 'ok' : 'bad'), us: '–', usL: null },
          { p: T('가연성 가스', 'Flammable gas'), v: lel, u: '% LEL', kr: T('제618조 정의에 없음', 'Not in Art. 618'), krL: null, us: T('LFL 10% 이하', '≤ 10 % of LFL'), usL: lel == null ? null : (lel <= U.lelMax ? 'ok' : 'bad') }
        ];
        const krBad = rows.some((r) => r.krL === 'bad'), usBad = rows.some((r) => r.usL === 'bad');
        const lv = krBad ? 'bad' : usBad ? 'warn' : 'ok';
        return `<div class="grid g2">
          <div class="panel stack">
            <div class="form-grid">
              ${[['o2', 'O₂ (%)'], ['co2', 'CO₂ (%)'], ['co', 'CO (ppm)'], ['h2s', 'H₂S (ppm)'], ['lel', T('가연성 (%LEL)', 'Flammable (%LEL)')]].map(([k, l]) => `<div class="field"><label for="cf-${k}">${l}</label><input type="number" step="any" min="0" id="cf-${k}" value="${S.esc(st[k])}"></div>`).join('')}
            </div>
            <div class="callout small">${T('측정은 작업 시작 전과 <b>일시 중단 후 재시작할 때마다</b>, 지식·실무경험이 있는 지정 측정자가 합니다. 결과(측정자·일시·장소·결과)는 <b>3년 보존</b>합니다.', 'Test before starting and <b>at every restart</b>, by a designated tester with knowledge and experience. Keep tester, time, place and result for <b>3 years</b>.')}${S.cite('lawStd')}</div>
          </div>
          <div class="result" aria-live="polite">
            <div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Verdict')}</span>${ui.pill(lv, krBad ? T('적정공기 아님 — 진입 금지', 'Not acceptable air — no entry') : usBad ? T('국내 기준 충족, 미국 기준 초과 — 보수적 관리 권고', 'Meets Korean rule, fails US criterion — act conservatively') : T('적정공기 — 다른 조건 충족 시 작업 가능', 'Acceptable air — proceed if other conditions are met'))}</div>
            <div class="table-wrap"><table class="data"><thead><tr><th>${T('항목', 'Parameter')}</th><th class="n">${T('측정', 'Reading')}</th><th>${T('국내 (제618조)', 'Korea (Art. 618)')}</th><th>${T('미국 OSHA 1910.146', 'US OSHA 1910.146')}</th></tr></thead><tbody>
              ${rows.map((r) => `<tr><td>${r.p}</td><td class="n">${r.v == null ? '–' : S.fmt(r.v, 2) + ' ' + r.u}</td>
                <td>${r.krL ? ui.pill(r.krL, r.kr + (r.krM ? ' · ' + r.krM : '')) : `<span class="small muted">${r.kr}</span>`}</td>
                <td>${r.usL ? ui.pill(r.usL, r.us) : `<span class="small muted">${r.us}</span>`}</td></tr>`).join('')}
            </tbody></table></div>
            ${krBad ? `<div class="callout bad small">${T('적정공기가 아니면 환기하거나, 환기가 곤란하면 공기호흡기·송기마스크를 지급·착용해야 합니다 (제619조의2③, 제620조).', 'If the air is not acceptable, ventilate — or, if that is impossible, issue and wear SCBA or airline respirators (Arts. 619-2(3), 620).')}</div>` : ''}
            <div class="row"><a class="btn ghost sm" href="#sop/confined">${T('밀폐공간 SOP', 'Confined-space SOP')} →</a><a class="btn ghost sm" href="#ptw/new/confined">${T('밀폐공간 작업허가서 작성', 'Start a confined-space permit')} →</a></div>
          </div></div>`;
      },
      mount(root) {
        const st = S.load('m.conf', { o2: '19.2', co2: '0.4', co: '12', h2s: '0', lel: '4' });
        ['o2', 'co2', 'co', 'h2s', 'lel'].forEach((k) => root.querySelector('#cf-' + k).addEventListener('change', (e) => { st[k] = e.target.value; S.save('m.conf', st); S.refresh(); }));
      },
      basis: ['lawStd', 'osha146']
    },

    noise: {
      label: () => T('소음', 'Noise'),
      render() {
        const st = S.load('m.noise', { segs: [['92', '3'], ['86', '4'], ['78', '1']] });
        const allow = (Lv) => 8 / Math.pow(2, (Lv - 90) / 5);
        let dose = 0, over115 = false; const used = [];
        st.segs.forEach(([l, h]) => { const Lv = num(l), hr = num(h); if (Lv == null || hr == null) return; if (Lv > 115) over115 = true; if (Lv >= 80) { const Ta = allow(Lv); dose += hr / Ta; used.push([Lv, hr, Ta]); } });
        const D = dose * 100;
        const twa = D > 0 ? 90 + 16.61 * Math.log10(D / 100) : null;
        const intense = [[90, 8], [95, 4], [100, 2], [105, 1], [110, 0.5], [115, 0.25]].filter(([lv, hh]) => st.segs.reduce((a, [l, h]) => a + ((num(l) || 0) >= lv ? (num(h) || 0) : 0), 0) >= hh);
        const lv = over115 || D > 100 ? 'bad' : (twa != null && twa >= 85) ? 'warn' : 'ok';
        return `<div class="grid g2">
          <div class="panel stack">
            <span class="lbl">${T('1일 노출 구간 (dB(A) × 시간)', 'Daily exposure intervals (dB(A) × hours)')}</span>
            ${st.segs.map(([l, h], i) => `<div class="row"><input type="number" step="any" data-nseg="${i}" data-k="0" value="${S.esc(l)}" aria-label="dB(A) ${i + 1}" style="max-width:110px"> <span class="small">dB(A) ×</span> <input type="number" step="any" min="0" data-nseg="${i}" data-k="1" value="${S.esc(h)}" aria-label="${T('시간', 'hours')} ${i + 1}" style="max-width:90px"> <span class="small">h</span> <button class="btn danger sm" data-nseg-del="${i}" type="button">×</button></div>`).join('')}
            <button class="btn ghost sm" type="button" id="nseg-add" style="justify-self:start">+ ${T('구간 추가', 'Add interval')}</button>
            <div class="table-wrap"><table class="data"><thead><tr><th>${T('1일 노출시간', 'Hours/day')}</th>${S.NOISE_TABLE.map(([h]) => `<th class="n">${h}</th>`).join('')}</tr></thead><tbody><tr><td>dB(A)</td>${S.NOISE_TABLE.map(([, d]) => `<td class="n">${d}</td>`).join('')}</tr></tbody></table></div>
            <p class="xs muted">${T('고시 별표2-1: 90dB(A) 8시간, 5dB 증가마다 허용시간 절반, 115dB(A) 초과 노출 금지.', 'Notice Annex 2-1: 90 dB(A) for 8 h, allowed time halves per 5 dB, never above 115 dB(A).')}${S.cite('moelOel')}</p>
          </div>
          <div class="result" aria-live="polite">
            <div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Verdict')}</span>${ui.pill(lv, over115 ? T('115dB(A) 초과 — 노출 금지 수준', 'Above 115 dB(A) — prohibited') : D > 100 ? T('노출기준 초과', 'Exceeds the limit') : lv === 'warn' ? T('노출기준 이내이나 소음작업(85dB) 해당', 'Within the limit but a “noise job” (85 dB)') : T('노출기준 이내', 'Within the limit'))}</div>
            <div class="big">${S.fmt(D, 0)}% <span class="small muted">${T('노출량(Dose)', 'dose')}</span></div>${gauge(D / 100)}
            <div class="small">${T('8시간 환산 등가 소음', '8-h equivalent level')}: <b class="num">${twa == null ? '–' : S.fmt(twa, 1) + ' dB(A)'}</b></div>
            ${twa != null && twa >= 85 ? `<div class="callout warn small">${T('1일 8시간 기준 85dB 이상 → “소음작업” (안전보건규칙 제512조 제1호). 청력보존 프로그램 요소(노출 평가·공학적 대책·청력보호구·교육·정기 청력검사 등)를 점검하세요.', '≥ 85 dB over 8 h → a “noise job” (OSH Standards Rules Art. 512(1)). Review the hearing-conservation programme elements (exposure assessment, engineering controls, protectors, training, audiometry).')}${S.cite('lawStd')} <a href="#sop/noise">${T('소음 작업·청력보존 SOP', 'Noise & hearing SOP')} →</a></div>` : ''}
            ${intense.length ? `<div class="callout bad small">${T('“강렬한 소음작업” 해당 조건', 'Meets “intense noise job” condition')}: ${intense.map(([lv2, hh]) => `${lv2} dB ≥ ${hh} h`).join(', ')} (${T('제512조 제2호', 'Art. 512(2)')})</div>` : ''}
            <p class="xs muted">${T('계산 가정: 표 사이 값은 같은 5dB 교환율로 보간, 80dB(A) 미만 구간은 제외(포털 가정). 등가소음 = 90 + 16.61·log₁₀(D/100). 법적 판정은 작업환경측정으로 합니다.', 'Assumptions: values between table rows use the same 5 dB exchange rate; intervals below 80 dB(A) are ignored (portal assumption). Equivalent level = 90 + 16.61·log₁₀(D/100). Legal findings rest on formal measurement.')}</p>
          </div></div>`;
      },
      mount(root) {
        const st = S.load('m.noise', { segs: [['92', '3'], ['86', '4'], ['78', '1']] });
        const upd = () => { S.save('m.noise', st); S.refresh(); };
        root.querySelectorAll('[data-nseg]').forEach((inp) => inp.addEventListener('change', () => { st.segs[inp.dataset.nseg][inp.dataset.k] = inp.value; upd(); }));
        root.querySelectorAll('[data-nseg-del]').forEach((b) => b.addEventListener('click', () => { st.segs.splice(Number(b.dataset.nsegDel), 1); upd(); }));
        root.querySelector('#nseg-add').addEventListener('click', () => { st.segs.push(['', '']); upd(); });
      },
      basis: ['moelOel', 'lawStd']
    },

    impulse: {
      label: () => T('충격소음', 'Impulse noise'),
      render() {
        const st = S.load('m.imp', { db: '125', n: '800' });
        const db = num(st.db), n = num(st.n);
        let allowed = null;
        if (n != null) allowed = n <= 100 ? 140 : n <= 1000 ? 130 : n <= 10000 ? 120 : null;
        const job = db != null && n != null && ((db > 120 && n >= 10000) || (db > 130 && n >= 1000) || (db > 140 && n >= 100));
        const lv = db == null ? 'info' : db > 140 ? 'bad' : allowed == null ? 'warn' : db > allowed ? 'bad' : 'ok';
        return `<div class="grid g2">
          <div class="panel stack">
            <div class="form-grid">
              <div class="field"><label for="im-db">${T('최대 음압수준 dB(A)', 'Peak level dB(A)')}</label><input type="number" step="any" id="im-db" value="${S.esc(st.db)}"></div>
              <div class="field"><label for="im-n">${T('1일 노출 횟수', 'Impacts per day')}</label><input type="number" step="1" min="0" id="im-n" value="${S.esc(st.n)}"></div>
            </div>
            <div class="table-wrap"><table class="data"><thead><tr><th>${T('1일 노출회수', 'Impacts/day')}</th><th class="n">dB(A)</th></tr></thead><tbody>${S.IMPULSE_TABLE.map(([c, d]) => `<tr><td class="n">${S.fmt(c, 0)}</td><td class="n">${d}</td></tr>`).join('')}</tbody></table></div>
            <p class="xs muted">${T('고시 별표2-2: 최대 음압수준 140dB(A) 초과 노출 금지. 충격소음 = 최대음압 120dB(A) 이상이 1초 이상 간격으로 발생.', 'Notice Annex 2-2: never above 140 dB(A) peak. Impulse noise = peaks ≥ 120 dB(A) at intervals of 1 s or more.')}${S.cite('moelOel')}</p>
          </div>
          <div class="result" aria-live="polite">
            <div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Verdict')}</span>${ui.pill(lv, db != null && db > 140 ? T('140dB(A) 초과 — 노출 금지', 'Above 140 dB(A) — prohibited') : allowed == null ? T('1만 회 초과는 표에 없음 — 전문 평가 필요', 'Over 10,000/day is outside the table — specialist review') : db > allowed ? T('충격소음 노출기준 초과', 'Exceeds the impulse limit') : T('노출기준 이내', 'Within the limit'))}</div>
            <div class="small">${T('해당 횟수의 허용 수준', 'Allowed level for this count')}: <b class="num">${allowed == null ? '–' : allowed + ' dB(A)'}</b></div><p class="xs muted">${T('표의 행 사이 횟수(예: 1,500회)는 더 많은 횟수 쪽 행의 기준을 적용하는 보수적 해석을 썼습니다 (포털 해석).', 'Counts between table rows (e.g. 1,500) use the stricter next row — a conservative portal interpretation.')}</p>
            ${job ? `<div class="callout warn small">${T('“충격소음작업” 해당 (안전보건규칙 제512조 제3호)', 'Counts as an “impulse-noise job” (OSH Standards Rules Art. 512(3))')}${S.cite('lawStd')}</div>` : ''}
          </div></div>`;
      },
      mount(root) {
        const st = S.load('m.imp', { db: '125', n: '800' });
        ['db', 'n'].forEach((k) => root.querySelector('#im-' + k).addEventListener('change', (e) => { st[k] = e.target.value; S.save('m.imp', st); S.refresh(); }));
      },
      basis: ['moelOel', 'lawStd']
    },

    heat: {
      label: () => T('고온 (WBGT)', 'Heat (WBGT)'),
      render() {
        const st = S.load('m.heat', { nwb: '26.5', gt: '34', db: '31', sun: false, load: 1, rest: 'cont', direct: '' });
        const W = S.WBGT_TABLE;
        const nwb = num(st.nwb), gt = num(st.gt), dbt = num(st.db);
        let wbgt = num(st.direct);
        if (wbgt == null && nwb != null && gt != null) wbgt = st.sun ? (dbt == null ? null : 0.7 * nwb + 0.2 * gt + 0.1 * dbt) : 0.7 * nwb + 0.3 * gt;
        const row = W.rows.find((r) => r.id === st.rest) || W.rows[0];
        const lim = row.v[st.load];
        const lv = wbgt == null ? 'info' : wbgt > lim ? 'bad' : wbgt > lim - 1 ? 'warn' : 'ok';
        return `<div class="grid g2">
          <div class="panel stack">
            <div class="form-grid">
              <div class="field"><label for="ht-nwb">${T('자연습구온도 (℃)', 'Natural wet-bulb (°C)')}</label><input type="number" step="any" id="ht-nwb" value="${S.esc(st.nwb)}"></div>
              <div class="field"><label for="ht-gt">${T('흑구온도 (℃)', 'Globe (°C)')}</label><input type="number" step="any" id="ht-gt" value="${S.esc(st.gt)}"></div>
              <div class="field"><label for="ht-db">${T('건구온도 (℃)', 'Dry-bulb (°C)')}</label><input type="number" step="any" id="ht-db" value="${S.esc(st.db)}"></div>
              <div class="field"><label for="ht-direct">${T('WBGT 직접 입력 (선택)', 'WBGT direct (optional)')}</label><input type="number" step="any" id="ht-direct" value="${S.esc(st.direct)}"></div>
            </div>
            <label class="check"><input type="checkbox" id="ht-sun" ${st.sun ? 'checked' : ''}> ${T('태양광선이 내리쬐는 옥외 장소', 'Outdoors in direct sunlight')}</label>
            <div class="form-grid">
              <div class="field"><label for="ht-load">${T('작업강도', 'Workload')}</label><select id="ht-load">${W.loads.map((l, i) => `<option value="${i}" ${Number(st.load) === i ? 'selected' : ''}>${L(l)}</option>`).join('')}</select></div>
              <div class="field"><label for="ht-rest">${T('작업·휴식 비율', 'Work–rest regime')}</label><select id="ht-rest">${W.rows.map((r) => `<option value="${r.id}" ${st.rest === r.id ? 'selected' : ''}>${L(r)}</option>`).join('')}</select></div>
            </div>
            <p class="xs muted">${L(W.loads[st.load].d)}</p>
          </div>
          <div class="result" aria-live="polite">
            <div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Verdict')}</span>${ui.pill(lv, wbgt == null ? T('값을 입력하세요', 'Enter values') : wbgt > lim ? T('고온 노출기준 초과', 'Exceeds the heat limit') : lv === 'warn' ? T('기준 1℃ 이내 근접 (포털 참고선)', 'Within 1 °C of the limit (portal reference line)') : T('노출기준 이내', 'Within the limit'))}</div>
            <div class="big">${wbgt == null ? '–' : S.fmt(wbgt, 1) + ' ℃'} <span class="small muted">WBGT / ${T('기준', 'limit')} ${lim} ℃</span></div>
            <p class="small">${st.sun ? 'WBGT = 0.7×NWB + 0.2×GT + 0.1×DB' : 'WBGT = 0.7×NWB + 0.3×GT'} <span class="muted">(${T('고시 제11조③', 'Notice Art. 11(3)')})</span></p>
            <div class="table-wrap"><table class="data"><thead><tr><th>${T('작업휴식시간비', 'Work–rest')}</th>${W.loads.map((l) => `<th class="n">${L(l)}</th>`).join('')}</tr></thead><tbody>
              ${W.rows.map((r) => `<tr ${r.id === st.rest ? 'style="background:var(--panel-2);font-weight:600"' : ''}><td>${L(r)}</td>${r.v.map((v, i) => `<td class="n" ${r.id === st.rest && i === Number(st.load) ? 'style="outline:2px solid var(--accent);outline-offset:-2px"' : ''}>${v.toFixed(1)}</td>`).join('')}</tr>`).join('')}
            </tbody></table></div>
            <p class="xs muted">${T('고시 별표3 고온의 노출기준 (단위 ℃, WBGT)', 'Notice Annex 3 heat limits (°C WBGT)')}${S.cite('moelOel')}</p>
          </div></div>
          ${(() => {
            /* 폭염작업 — 안전보건규칙 제559조④·제560조②③·제562조②③·별표13의2 (2025.7.17 개정, 제562조③ 2025.12.1 개정) */
            const at = num(st.at);
            const lv2 = at == null ? 'info' : at >= 33 ? 'bad' : at >= 31 ? 'warn' : 'ok';
            const verdict = at == null ? T('체감온도를 입력하세요', 'Enter the apparent temperature')
              : at >= 33 ? T('33℃ 이상 — 2시간 이내마다 20분 이상 휴식', '33 °C or more — 20 min rest at least every 2 h')
              : at >= 31 ? T('31℃ 이상 — 장시간 작업이면 폭염작업', '31 °C or more — heat-wave work if prolonged')
              : T('폭염작업 기준(31℃) 미만', 'Below the 31 °C heat-wave threshold');
            const acts = at == null ? [] : at >= 31 ? [
              T('다음 중 하나 이상: 냉방·통풍 등 온·습도 조절장치 설치·가동, 작업시간대 조정 등 폭염 노출 줄이기. 그래도 폭염작업이면 적절한 휴식시간 부여 (제560조②)', 'At least one of: install and run cooling or ventilation, or reschedule work to cut exposure; if it is still heat-wave work, give adequate rest (Art. 560(2))'),
              ...(at >= 33 ? [T('체감온도 33℃ 이상에서는 매 2시간 이내에 20분 이상 휴식. 작업 성질상 휴식이 매우 곤란하면 개인용 냉방·통풍장치나 보냉장구로 체온 상승을 줄이는 조치로 대신 (제560조③)', 'At 33 °C or more, at least 20 minutes’ rest within every 2 hours; where rest is truly impractical, personal cooling or ventilation gear or cooling vests may be used instead (Art. 560(3))')] : [])
            ] : [];
            return `<section class="panel stack" style="margin-top:14px">${ui.title(T('폭염작업 판정 — 체감온도', 'Heat-wave work — apparent temperature'), T('안전보건규칙 2025.7.17 개정', 'Standards Rules, amended 2025-07-17'))}
              <div class="grid g2">
                <div class="stack">
                  <div class="field" style="max-width:260px"><label for="ht-at">${T('측정한 체감온도 (℃)', 'Measured apparent temperature (°C)')}</label><input type="number" step="any" id="ht-at" value="${S.esc(st.at || '')}"></div>
                  <p class="xs muted">${T('측정 위치: 작업장소 바닥에서 약 1.2~1.5m 높이. 옥외 이동작업처럼 측정이 곤란하면 기상청이 발표하는 체감온도를 쓸 수 있습니다 (별표13의2). 체감온도는 WBGT(위 고시 기준)와 다른 지표이므로 두 기준을 모두 확인하세요.', 'Measure about 1.2–1.5 m above the floor where people work; where that is impractical (e.g. mobile outdoor work) the KMA’s published apparent temperature may be used (Annex 13-2). Apparent temperature and WBGT (the notice limit above) are different indices, so check both.')}</p>
                </div>
                <div class="result" aria-live="polite">
                  <div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Verdict')}</span>${ui.pill(lv2, verdict)}</div>
                  ${acts.length ? `<ul class="facts">${acts.map((a) => `<li>${a}</li>`).join('')}</ul>` : ''}
                  <p class="small">${T('공통(폭염작업이 예상되면): 온·습도계 상시 비치, 작업 전 건강장해 증상·예방·응급조치 안내, 폭염작업 일자별 체감온도와 조치를 기록해 그해 12월 31일까지 보관, 열사병 등이 생기거나 의심되면 지체 없이 119(소방관서) 신고 등 조치 (제562조②③)', 'Whenever heat-wave work is expected: keep a thermo-hygrometer on site, brief workers on symptoms, prevention and first aid beforehand, record the apparent temperature and measures for each day and keep them until 31 December, and call 119 at once if heatstroke occurs or is suspected (Art. 562(2),(3))')}</p>
                  <p class="xs muted">${T('안전보건규칙 제559조④(폭염작업: 체감온도 31℃ 이상 장소의 장시간 작업)·제560조·제562조', 'Standards Rules Art. 559(4) (heat-wave work: prolonged work where the apparent temperature is 31 °C or more), 560, 562')}${S.cite('lawStd')}</p>
                </div>
              </div></section>`;
          })()}`;
      },
      mount(root) {
        const st = S.load('m.heat', { nwb: '26.5', gt: '34', db: '31', sun: false, load: 1, rest: 'cont', direct: '' });
        const upd = () => { S.save('m.heat', st); S.refresh(); };
        ['nwb', 'gt', 'db', 'direct', 'at'].forEach((k) => root.querySelector('#ht-' + k).addEventListener('change', (e) => { st[k] = e.target.value; upd(); }));
        root.querySelector('#ht-sun').addEventListener('change', (e) => { st.sun = e.target.checked; upd(); });
        root.querySelector('#ht-load').addEventListener('change', (e) => { st.load = Number(e.target.value); upd(); });
        root.querySelector('#ht-rest').addEventListener('change', (e) => { st.rest = e.target.value; upd(); });
      },
      basis: ['moelOel', 'lawStd']
    },

    lux: {
      label: () => T('조도', 'Illumination'),
      render() {
        const st = S.load('m.lux', { type: 'fine', lux: '260', exempt: false });
        const w = S.LUX.find((x) => x.id === st.type);
        const lx = num(st.lux);
        const lv = st.exempt ? 'info' : lx == null ? 'info' : lx >= w.min ? 'ok' : 'bad';
        return `<div class="grid g2">
          <div class="panel stack">
            <div class="form-grid">
              <div class="field"><label for="lx-type">${T('작업 구분', 'Work class')}</label><select id="lx-type">${S.LUX.map((x) => `<option value="${x.id}" ${x.id === st.type ? 'selected' : ''}>${L(x)} (≥ ${x.min} lux)</option>`).join('')}</select></div>
              <div class="field"><label for="lx-v">${T('측정 조도 (lux)', 'Measured (lux)')}</label><input type="number" step="any" min="0" id="lx-v" value="${S.esc(st.lux)}"></div>
            </div>
            <label class="check"><input type="checkbox" id="lx-ex" ${st.exempt ? 'checked' : ''}> ${T('갱내 작업장 또는 감광재료 취급 작업장 (예: 포토 공정 구역)', 'Underground, or a photosensitive-material workplace (e.g. photolithography area)')}</label>
          </div>
          <div class="result" aria-live="polite">
            <div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Verdict')}</span>${ui.pill(lv, st.exempt ? T('제8조 적용 제외 작업장', 'Exempt from Art. 8') : lx == null ? T('값을 입력하세요', 'Enter a value') : lx >= w.min ? T('기준 충족', 'Meets the minimum') : T(`기준 미달 (${w.min - lx} lux 부족)`, `Below minimum (${w.min - lx} lux short)`))}</div>
            <div class="big">${lx == null ? '–' : S.fmt(lx, 0)} lux <span class="small muted">/ ${T('기준', 'min')} ${w.min} lux</span></div>
            <p class="xs muted">${T('안전보건규칙 제8조: 초정밀 750 · 정밀 300 · 보통 150 · 그 밖 75 lux 이상. 갱내 작업장과 감광재료를 취급하는 작업장은 적용하지 않음.', 'OSH Standards Rules Art. 8: ultra-precision 750, precision 300, ordinary 150, other 75 lux minimum; not applied underground or where photosensitive materials are handled.')}${S.cite('lawStd')}</p>
          </div></div>`;
      },
      mount(root) {
        const st = S.load('m.lux', { type: 'fine', lux: '260', exempt: false });
        const upd = () => { S.save('m.lux', st); S.refresh(); };
        root.querySelector('#lx-type').addEventListener('change', (e) => { st.type = e.target.value; upd(); });
        root.querySelector('#lx-v').addEventListener('change', (e) => { st.lux = e.target.value; upd(); });
        root.querySelector('#lx-ex').addEventListener('change', (e) => { st.exempt = e.target.checked; upd(); });
      },
      basis: ['lawStd']
    },

    mix: {
      label: () => T('혼합물', 'Mixtures'),
      render() {
        const st = S.load('m.mix', { rows: [['ipa', '80'], ['acetone', '150'], ['pgme', '20']] });
        const items = st.rows.map(([id, v]) => { const c = chemById(id); const val = num(v); return { c, val, r: c && c.twa && val != null ? val / c.twa : null }; });
        const sum = items.reduce((a, x) => a + (x.r || 0), 0);
        const lv = sum > 1 ? 'bad' : sum > 0.5 ? 'warn' : 'ok';
        return `<div class="grid g2">
          <div class="panel stack">
            <span class="lbl">${T('혼재 물질과 각 TWA 측정값', 'Co-present substances and their TWA readings')}</span>
            ${st.rows.map(([id, v], i) => `<div class="row"><select data-mix="${i}" data-k="0" aria-label="${T('물질', 'Substance')} ${i + 1}" style="flex:1;min-width:160px">${chemOptions(id)}</select><input type="number" step="any" min="0" data-mix="${i}" data-k="1" value="${v}" aria-label="TWA ${i + 1}" style="max-width:110px"><span class="small">${chemById(id).unit}</span><button class="btn danger sm" type="button" data-mix-del="${i}">×</button></div>`).join('')}
            <button class="btn ghost sm" type="button" id="mix-add" style="justify-self:start">+ ${T('물질 추가', 'Add substance')}</button>
            <div class="callout small">${T('유해작용이 인체의 같은 부위에 가중될 때만 합산식을 씁니다. 서로 다른 부위에 작용하면 어느 한 물질이라도 기준을 넘으면 초과입니다 (고시 제6조).', 'Use the additive formula only when effects add up on the same organ. If they act on different organs, any one substance over its limit means exceedance (Notice Art. 6).')}${S.cite('moelOel')}</div>
          </div>
          <div class="result" aria-live="polite">
            <div class="row" style="justify-content:space-between"><span class="lbl">Σ C/T</span>${ui.pill(lv, sum > 1 ? T('혼합물 노출기준 초과 (1 초과)', 'Mixture limit exceeded (> 1)') : T('1 이하', '≤ 1'))}</div>
            <div class="big">${S.fmt(sum, 3)}</div>${gauge(sum)}
            <div class="table-wrap"><table class="data"><thead><tr><th>${T('물질', 'Substance')}</th><th class="n">C</th><th class="n">T (TWA)</th><th class="n">C/T</th></tr></thead><tbody>
              ${items.map((x) => `<tr><td>${S.esc(L(x.c))}</td><td class="n">${x.val == null ? '–' : S.fmt(x.val)}</td><td class="n">${x.c.twa ?? '–'}</td><td class="n">${x.r == null ? '–' : S.fmt(x.r, 3)}</td></tr>`).join('')}
            </tbody></table></div>
          </div></div>`;
      },
      mount(root) {
        const st = S.load('m.mix', { rows: [['ipa', '80'], ['acetone', '150'], ['pgme', '20']] });
        const upd = () => { S.save('m.mix', st); S.refresh(); };
        root.querySelectorAll('[data-mix]').forEach((el) => el.addEventListener('change', () => { st.rows[el.dataset.mix][el.dataset.k] = el.value; upd(); }));
        root.querySelectorAll('[data-mix-del]').forEach((b) => b.addEventListener('click', () => { st.rows.splice(Number(b.dataset.mixDel), 1); upd(); }));
        root.querySelector('#mix-add').addEventListener('click', () => { st.rows.push(['ipa', '']); upd(); });
      },
      basis: ['moelOel']
    },

    /* 2단계 — 안전보건규칙 제430조 전체환기 필요환기량 */
    vent: {
      label: () => T('전체환기량', 'General ventilation'),
      render() {
        const st = S.load('m.vent', { rows: [['ipa', '2'], ['acetone', '1']], k: 2, add: true });
        const k = Number(st.k) || 1;
        const items = st.rows.map(([id, v]) => {
          const c = chemById(id), p = S.VENT[id], use = num(v);
          const q = c && p && use != null && c.twa ? 24.1 * p.sg * use * k / (p.mw * c.twa) * 1e6 : null;   /* ㎥/hr */
          return { id, c, p, use, q };
        });
        const qs = items.map((x) => x.q).filter((x) => x != null);
        const total = qs.length ? (st.add ? qs.reduce((a, b) => a + b, 0) : Math.max(...qs)) : null;
        const off = items.filter((x) => x.p && !x.p.annex12);
        return `<div class="grid g2">
          <div class="panel stack">
            <span class="lbl">${T('유기화합물과 시간당 사용량 (L/hr)', 'Organic compounds and use per hour (L/hr)')}</span>
            ${st.rows.map(([id, v], i) => `<div class="row"><select data-vt="${i}" data-k="0" aria-label="${T('물질', 'Substance')} ${i + 1}" style="flex:1;min-width:160px">${Object.keys(S.VENT).map((x) => `<option value="${x}" ${x === id ? 'selected' : ''}>${S.esc(L(chemById(x)))}</option>`).join('')}</select><input type="number" step="any" min="0" data-vt="${i}" data-k="1" value="${S.esc(v)}" aria-label="L/hr ${i + 1}" style="max-width:100px"><span class="small">L/hr</span><button class="btn danger sm" type="button" data-vt-del="${i}" aria-label="${T('삭제', 'Delete')}">×</button></div>`).join('')}
            <button class="btn ghost sm" type="button" id="vt-add" style="justify-self:start">+ ${T('물질 추가', 'Add substance')}</button>
            <div class="field"><label for="vt-k">${T('안전계수 K', 'Safety factor K')}</label><select id="vt-k">${S.VENT_K.map(([v, l]) => `<option value="${v}" ${k === v ? 'selected' : ''}>K=${v} — ${S.esc(L(l))}</option>`).join('')}</select></div>
            <label class="check"><input type="checkbox" id="vt-add2" ${st.add ? 'checked' : ''}> ${T('유해작용이 더해진다(상가작용) — 각 환기량을 합산 (제430조②)', 'Effects add up — sum the rates (Art. 430(2))')}</label>
            <div class="callout small">${T('필요환기량(㎥/hr) = 24.1 × 비중 × 시간당 사용량(L/hr) × K ÷ (분자량 × 노출기준) × 10⁶. 혼합물은 각 환기량의 합, 상가작용이 없으면 가장 큰 값을 씁니다. 배풍기(덕트 개구부)는 발산원에 가장 가깝게 둡니다(제430조③).', 'Required rate (m³/h) = 24.1 × specific gravity × use (L/h) × K ÷ (molecular weight × exposure limit) × 10⁶. Sum the rates for mixtures, or take the largest if effects do not add up. Put the exhaust fan (or duct inlet) as close to the source as possible (Art. 430(3)).')}${S.cite('lawStd')}</div>
          </div>
          <div class="result stack" aria-live="polite">
            <div class="row" style="justify-content:space-between"><span class="lbl">${T('필요환기량', 'Required ventilation')}</span>${ui.pill('info', st.add ? T('합산', 'Summed') : T('최댓값', 'Largest'))}</div>
            <div class="big">${total == null ? '–' : S.fmt(total, 0)} <span class="small muted">㎥/hr</span></div>
            <div class="small">${total == null ? '' : `= ${S.fmt(total / 60, 1)} ㎥/min`}</div>
            <div class="table-wrap"><table class="data"><thead><tr><th>${T('물질', 'Substance')}</th><th class="n">${T('비중', 'SG')}</th><th class="n">${T('분자량', 'MW')}</th><th class="n">TWA</th><th class="n">㎥/hr</th></tr></thead><tbody>
              ${items.map((x) => `<tr><td class="small">${S.esc(L(x.c))}${x.p && !x.p.annex12 ? ' *' : ''}</td><td class="n">${x.p ? x.p.sg : '–'}</td><td class="n">${x.p ? x.p.mw : '–'}</td><td class="n">${x.c && x.c.twa ? x.c.twa + ' ppm' : '–'}</td><td class="n">${x.q == null ? '–' : S.fmt(x.q, 0)}</td></tr>`).join('')}
            </tbody></table></div>
            ${off.length ? `<p class="xs">* ${T('관리대상 유해물질(별표12)이 아니어서 제430조 적용 대상은 아닙니다 — 같은 산식을 참고로 계산했습니다.', 'Not a controlled substance under Annex 12, so Art. 430 does not apply — the same formula is shown for reference.')}</p>` : ''}
            <p class="xs muted">${T('비중·분자량은 NIOSH 포켓가이드 값, 노출기준은 국내 TWA입니다. 전체환기는 국소배기(제429조·별표13 제어풍속)를 대신하지 않습니다.', 'Specific gravity and molecular weight from the NIOSH Pocket Guide; limits are Korean TWAs. General ventilation does not replace local exhaust (Art. 429, Annex 13 capture velocities).')}${S.cite('nioshNpg', 'moelOel')}</p>
          </div></div>`;
      },
      mount(root) {
        const st = S.load('m.vent', { rows: [['ipa', '2'], ['acetone', '1']], k: 2, add: true });
        const upd = () => { S.save('m.vent', st); S.refresh(); };
        root.querySelectorAll('[data-vt]').forEach((el) => el.addEventListener('change', () => { st.rows[el.dataset.vt][el.dataset.k] = el.value; upd(); }));
        root.querySelectorAll('[data-vt-del]').forEach((b) => b.addEventListener('click', () => { st.rows.splice(Number(b.dataset.vtDel), 1); upd(); }));
        root.querySelector('#vt-add').addEventListener('click', () => { st.rows.push(['pgme', '']); upd(); });
        root.querySelector('#vt-k').addEventListener('change', (e) => { st.k = Number(e.target.value); upd(); });
        root.querySelector('#vt-add2').addEventListener('change', (e) => { st.add = e.target.checked; upd(); });
      },
      basis: ['lawStd', 'nioshNpg', 'moelOel']
    },

    /* 5단계 — 국소배기장치 후드 제어풍속 (안전보건규칙 제429조·별표13, 원문 확인 2026-09-25) */
    lev: {
      label: () => T('국소배기 제어풍속', 'Local exhaust capture velocity'),
      render() {
        const st = S.load('m.lev', { state: 'gas', hood: 'side', v: '0.42' });
        const LEV = { gas: { enc: 0.4, side: 0.5, down: 0.5, up: 1.0 }, part: { enc: 0.7, side: 1.0, down: 1.0, up: 1.2 } };
        const HOODS = [['enc', T('포위식 포위형', 'Enclosing hood')], ['side', T('외부식 측방흡인형', 'External, side draft')], ['down', T('외부식 하방흡인형', 'External, downdraft')], ['up', T('외부식 상방흡인형', 'External, canopy (updraft)')]];
        const lim = (LEV[st.state] || LEV.gas)[st.hood] || 0.5;
        const v = num(st.v);
        const lv = v == null ? 'info' : v >= lim ? 'ok' : 'bad';
        const where = st.hood === 'enc' ? T('후드 개구면에서의 풍속', 'Velocity at the hood face') : T('물질을 빨아들이려는 범위에서 후드 개구면으로부터 가장 먼 작업위치의 풍속', 'Velocity at the working point farthest from the hood face within the capture zone');
        return `<div class="grid g2">
          <div class="panel stack">
            <div class="form-grid">
              <div class="field"><label for="lev-state">${T('물질이 빨려 들어갈 때의 상태', 'State when drawn into the hood')}</label><select id="lev-state">
                <option value="gas" ${st.state === 'gas' ? 'selected' : ''}>${T('가스 상태 (가스·증기)', 'Gas (gas or vapour)')}</option>
                <option value="part" ${st.state === 'part' ? 'selected' : ''}>${T('입자 상태 (흄·분진·미스트)', 'Particulate (fume, dust, mist)')}</option></select></div>
              <div class="field"><label for="lev-hood">${T('후드 형식', 'Hood type')}</label><select id="lev-hood">${HOODS.map(([k, l]) => `<option value="${k}" ${k === st.hood ? 'selected' : ''}>${l} (${S.fmt((LEV[st.state] || LEV.gas)[k], 1)} m/s)</option>`).join('')}</select></div>
              <div class="field"><label for="lev-v">${T('측정 풍속 (m/s)', 'Measured velocity (m/s)')}</label><input type="number" step="any" min="0" id="lev-v" value="${S.esc(st.v)}"></div>
            </div>
            <p class="small"><b>${T('측정 위치', 'Where to measure')}</b> — ${where}. ${T('국소배기장치의 모든 후드를 연 상태에서 잽니다.', 'Measure with every hood of the system open.')}</p>
          </div>
          <div class="result" aria-live="polite">
            <div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Verdict')}</span>${ui.pill(lv, v == null ? T('값을 입력하세요', 'Enter a value') : v >= lim ? T('제어풍속 충족', 'Meets the capture velocity') : T(`제어풍속 미달 (${S.fmt(lim - v, 2)} m/s 부족)`, `Below the capture velocity (${S.fmt(lim - v, 2)} m/s short)`))}</div>
            <div class="big">${v == null ? '–' : S.fmt(v, 2)} m/s <span class="small muted">/ ${T('기준', 'min')} ${S.fmt(lim, 1)} m/s</span></div>
            ${v != null && v < lim ? `<div class="callout warn small">${T('후드 개구면 가까이 작업위치를 옮기거나 덕트 막힘·접속부 누설·배풍기 성능을 확인하세요. 국소배기장치(이동식 제외)는 안전검사대상기계이며 세부 종류는 고용노동부 고시로 정합니다.', 'Move the work closer to the hood face, or check the ducts for blockage, joint leaks and fan performance. Fixed local exhaust systems are machines subject to statutory safety inspection; the detailed scope is set by MOEL notice.')}${S.cite('lawDecree')} <a href="#home/cycles">${T('안전검사 주기', 'Inspection cycle')} →</a></div>` : ''}
            <div class="table-wrap"><table class="data" data-cards="no"><thead><tr><th>${T('후드 형식', 'Hood type')}</th><th class="n">${T('가스 상태', 'Gas')}</th><th class="n">${T('입자 상태', 'Particulate')}</th></tr></thead><tbody>
              ${HOODS.map(([k, l]) => `<tr ${k === st.hood ? 'class="sel"' : ''}><td class="small">${l}</td><td class="n">${S.fmt(LEV.gas[k], 1)}</td><td class="n">${S.fmt(LEV.part[k], 1)}</td></tr>`).join('')}
            </tbody></table></div>
            <p class="xs muted">${T('안전보건규칙 제429조·별표13 — 관리대상 유해물질 관련 국소배기장치 후드의 제어풍속입니다(단위 m/s). 허가대상 유해물질·분진 등 다른 장이 적용되는 작업은 해당 조문을 확인하세요.', 'Standards Rules Art. 429 and Annex 13 — capture velocities for local exhaust hoods handling controlled hazardous substances (m/s). For work under other chapters, such as licensed substances or dust, check those articles.')}${S.cite('lawStd')}</p>
          </div></div>`;
      },
      mount(root) {
        const st = S.load('m.lev', { state: 'gas', hood: 'side', v: '0.42' });
        const upd = () => { S.save('m.lev', st); S.refresh(); };
        root.querySelector('#lev-state').addEventListener('change', (e) => { st.state = e.target.value; upd(); });
        root.querySelector('#lev-hood').addEventListener('change', (e) => { st.hood = e.target.value; upd(); });
        root.querySelector('#lev-v').addEventListener('change', (e) => { st.v = e.target.value; upd(); });
      },
      basis: ['lawStd']
    },

    /* 2단계 — 작업환경측정 주기(시행규칙 제190조, 고시 제4·5조)와 특수건강진단 주기 단축(제202조②) */
    wem: {
      label: () => T('측정·검진 주기', 'Monitoring & health-check cycles'),
      calc(st) {
        const c = chemById(st.id);
        const lim = c.twa != null ? c.twa : c.c;
        const v = num(st.v), prev = num(st.prev);
        const sp = S.WEM_SPECIAL[st.id];
        const special = !!(sp && (sp.always || (sp.ph && st.ph)));
        let cyc, why;
        if (st.noise) {
          const n1 = num(st.n1), n2 = num(st.n2);
          if (st.noChange && n1 != null && n2 != null && n1 < 85 && n2 < 85) { cyc = 'year'; why = T('최근 2회 연속 85dB 미만이고 최근 1년간 공정 변경 없음 (제190조②1)', 'Two consecutive results below 85 dB and no process change in the last year (Art. 190(2)1)'); }
          else { cyc = 'half'; why = T('반기 1회 이상 (제190조①)', 'At least half-yearly (Art. 190(1))'); }
        } else {
          const r = v != null && lim ? v / lim : null;
          if (r != null && special && r > 1) { cyc = 'q'; why = T('고시 물질(허가대상·특별관리물질)이 노출기준 초과 (제190조①1, 고시 제5조)', 'A listed substance (licensed or specially controlled) exceeds the limit (Art. 190(1)1; Notice Art. 5)'); }
          else if (r != null && !special && r >= 2) { cyc = 'q'; why = T('그 밖의 화학적 인자가 노출기준의 2배 이상 초과 (제190조①2)', 'Another chemical agent at twice the limit or more (Art. 190(1)2)'); }
          else if (r != null && !special && st.noChange && prev != null && r < 1 && prev / lim < 1) { cyc = 'year'; why = T('최근 2회 연속 노출기준 미만이고 최근 1년간 공정·설비·작업방법·물질 변경 없음 (제190조②2)', 'Two consecutive results below the limit and no change to process, equipment, method or chemicals in the last year (Art. 190(2)2)'); }
          else { cyc = 'half'; why = T('반기 1회 이상 (제190조①)', 'At least half-yearly (Art. 190(1))'); }
        }
        const C = { q: [T('3개월에 1회 이상', 'At least every 3 months'), 91, T('전회 측정 완료일부터 45일 이상 간격', '≥ 45 days after the last survey')], half: [T('반기에 1회 이상', 'At least half-yearly'), 182, T('전회 측정 완료일부터 3개월 이상 간격', '≥ 3 months after the last survey')], year: [T('연 1회 이상 가능', 'Yearly allowed'), 365, T('전회 측정 완료일부터 6개월 이상 간격', '≥ 6 months after the last survey')] }[cyc];
        const exceed = !st.noise && v != null && lim && v >= lim;
        const grp = S.SHE_CYCLE.find((g) => g.id === st.grp) || S.SHE_CYCLE[0];
        const sheM = exceed ? grp.m / 2 : grp.m;
        return { c, lim, sp, cyc, why, C, exceed, grp, sheM };
      },
      render() {
        const st = S.load('m.wem', { id: 'hf', v: '0.3', prev: '0.2', noChange: false, ph: false, noise: false, n1: '', n2: '', grp: 'g6' });
        const { c, lim, sp, cyc, why, C, exceed, grp, sheM } = TOOLS.wem.calc(st);
        return `<div class="grid g2">
          <div class="panel stack">
            <label class="check"><input type="checkbox" id="wm-noise" ${st.noise ? 'checked' : ''}> ${T('소음 측정 결과로 판단', 'Judge from noise results')}</label>
            ${st.noise ? `<div class="form-grid"><div class="field"><label for="wm-n1">${T('이번 결과 dB(A)', 'This result dB(A)')}</label><input type="number" step="any" id="wm-n1" value="${S.esc(st.n1)}"></div><div class="field"><label for="wm-n2">${T('직전 결과 dB(A)', 'Previous result dB(A)')}</label><input type="number" step="any" id="wm-n2" value="${S.esc(st.n2)}"></div></div>`
              : `<div class="form-grid">
                <div class="field"><label for="wm-id">${T('유해인자', 'Agent')}</label><select id="wm-id">${chemOptions(st.id)}</select></div>
                <div class="field"><label for="wm-v">${T('이번 측정치 (TWA)', 'This result (TWA)')} (${c.unit})</label><input type="number" step="any" min="0" id="wm-v" value="${S.esc(st.v)}"></div>
                <div class="field"><label for="wm-prev">${T('직전 측정치', 'Previous result')} (${c.unit})</label><input type="number" step="any" min="0" id="wm-prev" value="${S.esc(st.prev)}"></div></div>
                <div class="small muted">${T('노출기준', 'Limit')} ${c.twa != null ? 'TWA' : 'C'} ${lim ?? '–'} ${c.unit}${S.cite('moelOel')} ${S.regChips(c)}</div>
                ${!(c.rg || '').includes('w') ? `<div class="callout warn small">${T('이 물질은 시행규칙 별표21의 작업환경측정 대상 유해인자가 아닙니다 — 아래 측정 주기는 법정 의무가 아니라 사업장 자체 측정의 참고용입니다.', 'This substance is not a monitoring agent under Rule Annex 21 — the survey cycle below is a reference for in-house monitoring, not a legal duty.')}</div>` : ''}
                ${!(c.rg || '').includes('s') ? `<div class="callout small">${T('시행규칙 별표22의 특수건강진단 대상 유해인자가 아닙니다 — 특수건강진단 주기는 참고용입니다.', 'Not a special health-check agent under Rule Annex 22 — the health-check interval is for reference only.')}</div>` : ''}
                ${sp ? `<div class="callout small">${S.esc(L(sp.t))}${sp.ph ? `<br><label class="check"><input type="checkbox" id="wm-ph" ${st.ph ? 'checked' : ''}> ${T('pH 2.0 이하 강산으로 취급', 'Handled as a strong acid at pH 2.0 or below')}</label>` : ''}</div>` : ''}`}
            <label class="check"><input type="checkbox" id="wm-nc" ${st.noChange ? 'checked' : ''}> ${T('최근 1년간 공정 설비·작업방법 변경, 설비 이전, 사용 물질 변경이 없다', 'No change to process equipment, methods, location or chemicals in the last year')}</label>
            <div class="field"><label for="wm-grp">${T('특수건강진단 대상 유해인자 구분 (별표23)', 'Special health-check group (Annex 23)')}</label><select id="wm-grp">${S.SHE_CYCLE.map((g) => `<option value="${g.id}" ${g.id === st.grp ? 'selected' : ''}>${S.esc(L(g.t))} — ${g.m}${T('개월', ' months')}</option>`).join('')}</select></div>
          </div>
          <div class="result stack" aria-live="polite">
            <div class="row" style="justify-content:space-between"><span class="lbl">${T('다음 작업환경측정', 'Next exposure survey')}</span>${ui.pill(cyc === 'q' ? 'bad' : cyc === 'year' ? 'ok' : 'info', C[0])}</div>
            <p class="small">${S.esc(why)}</p>
            <p class="small">${T('측정 시기', 'Timing')}: ${S.esc(C[2])} <span class="xs muted">(${T('작업환경측정 고시 제4조②', 'Monitoring Notice Art. 4(2)')})</span></p>
            <div class="row" style="justify-content:space-between;margin-top:6px"><span class="lbl">${T('다음 특수건강진단', 'Next special health check')}</span>${ui.pill(exceed ? 'warn' : 'info', `${sheM}${T('개월', ' months')}`)}</div>
            <p class="small">${exceed ? T(`노출기준 이상 공정의 노출 근로자는 다음 회에 한정해 주기를 2분의 1로 단축 (${grp.m} → ${sheM}개월, 제202조②1)`, `Workers exposed in a process at or above the limit get the next interval halved (${grp.m} → ${sheM} months, Art. 202(2)1)`) : T('별표23 기본 주기', 'Annex 23 base interval')}</p>
            <button class="btn sm" type="button" id="wm-apply" style="justify-self:start">${T('업무판 법정 주기에 반영', 'Apply to the dashboard cycles')}</button>
            <p class="xs muted">${T('직업병 유소견자가 나온 공정의 노출 근로자, 의사가 단축 소견을 낸 근로자도 다음 회 주기를 2분의 1로 단축합니다(제202조②2·3). 법적 판정은 작업환경측정기관의 결과표로 합니다.', 'The next interval is also halved for workers in a process with occupational-disease findings, or where a doctor advises it (Art. 202(2)2–3). Legal findings rest on the monitoring body’s result sheet.')}${S.cite('lawRule', 'moelWem', 'lawStd', 'lawDecree')}</p>
          </div></div>`;
      },
      mount(root) {
        const st = S.load('m.wem', { id: 'hf', v: '0.3', prev: '0.2', noChange: false, ph: false, noise: false, n1: '', n2: '', grp: 'g6' });
        const upd = () => { S.save('m.wem', st); S.refresh(); };
        const bind = (sel, k, chk) => { const el = root.querySelector(sel); if (el) el.addEventListener('change', () => { st[k] = chk ? el.checked : el.value; if (k === 'id') { st.v = st.prev = ''; st.ph = false; } upd(); }); };
        bind('#wm-noise', 'noise', true); bind('#wm-n1', 'n1'); bind('#wm-n2', 'n2'); bind('#wm-id', 'id'); bind('#wm-v', 'v'); bind('#wm-prev', 'prev'); bind('#wm-ph', 'ph', true); bind('#wm-nc', 'noChange', true); bind('#wm-grp', 'grp');
        root.querySelector('#wm-apply').addEventListener('click', () => {
          const w = TOOLS.wem.calc(st);
          const days = S.load('cycles.days', {});
          days.wem = w.C[1]; days.she = { 6: 182, 12: 365, 24: 730 }[w.sheM] || Math.round(w.sheM * 30.44);
          S.save('cycles.days', days);
          S.toast(T('업무판의 작업환경측정·특수건강진단 주기를 바꿨습니다', 'Dashboard cycles for monitoring and health checks updated'));
        });
      },
      basis: ['lawRule', 'moelWem', 'lawStd', 'lawDecree', 'moelOel']
    }
  };

  S.pages.measure = {
    render(sub) {
      /* #measure/<도구>로 들어오면 그 탭을 연다 (탭 클릭 재렌더 때는 사용자의 선택 유지) */
      if (!S.state.refreshing && TOOLS[sub]) S.save('tab.measure', sub);
      const cur = S.tab('measure', 'chem');
      const tool = TOOLS[cur] || TOOLS.chem;
      return `
      ${ui.head(T('판정 도구', 'Tools'), T('수치 판정 센터', 'Measurement check'),
        T('현장 측정값이 법정 기준 이내인지 바로 판정합니다.', 'Check at once whether a field reading is within the legal limit.'),
        T('국내 법령·고시와 국제 기준에 대조합니다. 모든 기준값은 원문으로 확인했고 출처를 붙였습니다.', 'Readings are compared with Korean statutes and notices and international references. Every limit was checked against the original and is cited.'))}
      ${ui.tabs('measure', Object.keys(TOOLS).map((id) => ({ id, label: TOOLS[id].label() })), cur)}
      ${tool.render()}
      <p class="xs muted">${T('근거', 'Basis')}: ${S.cite(tool.basis)} · ${T('입력값은 이 브라우저에만 저장됩니다.', 'Inputs are saved in this browser only.')}</p>`;
    },
    mount(root) { const cur = S.tab('measure', 'chem'); (TOOLS[cur] || TOOLS.chem).mount(root); }
  };
})();

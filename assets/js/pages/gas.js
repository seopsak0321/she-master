/* 가스 안전 도구 — 경보 설정값 검토(KGS FU211·FU212, KOSHA C-C-87), 혼합가스 폭발성·폭발하한계(KOSHA P-179), 비상 이격거리(ERG 2024) */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui, esc = S.esc;
  const num = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));
  const chem = (id) => S.CHEMICALS.find((c) => c.id === id);
  const name = (id) => { const c = chem(id); return c ? `${L(c)} (${c.f})` : L(S.gasName(id)); };
  const FU212 = ['sih4', 'b2h6', 'ash3', 'ph3', 'geh4', 'nf3', 'bf3'];   /* 특수고압가스 14종 중 물질 DB에 있는 것 (KGS FU212 1.1) */
  const FU211 = ['nh3', 'cl2', 'h2'];                                     /* 그 밖의 특정고압가스 (법 제20조①) */
  const worst = (a) => (a.includes('bad') ? 'bad' : a.includes('warn') ? 'warn' : a.includes('ok') ? 'ok' : 'info');

  /* ---------- 1. 경보 설정값 검토 ---------- */
  const ALARM_IDS = () => [...new Set(S.CHEMICALS.filter((c) => c.unit === 'ppm' && (c.twa != null || c.c != null || S.FLAM[c.id])).map((c) => c.id).concat(['h2', 'ch4', 'dcs', 'mcs', 'ms', 'tms']))];
  function alarmEval(st) {
    const c = chem(st.id), fl = S.FLAM[st.id];
    const fac = st.fac === 'auto' ? (FU212.includes(st.id) || FU211.includes(st.id) ? 'kgs' : 'kosha') : st.fac;
    const code = FU212.includes(st.id) ? 'FU212' : FU211.includes(st.id) ? 'FU211' : null;
    const toPpm = (v, unit) => (v == null ? null : unit === 'lel' ? (fl ? v / 100 * fl.lel * 10000 : null) : v);
    const a1 = toPpm(num(st.a1), st.unit), a2 = toPpm(num(st.a2), st.unit);
    const rows = [];
    let lim1 = Infinity;
    if (fl) {
      const l25 = fl.lel * 10000 * 0.25, l50 = fl.lel * 10000 * 0.5;
      rows.push({ k: T('가연성 — 1차 경보', 'Flammable — 1st alarm'), lim: l25, show: `${S.fmt(l25, 0)} ppm (${T(`LEL ${fl.lel}%${fl.est ? ' 추정' : ''}의 25%`, `25 % of the LEL, ${fl.lel} %${fl.est ? ' est.' : ''}`)})`, v: a1, basis: fac === 'kgs' ? `KGS ${code || 'FU211·FU212'} 2.8.2.1.2` : 'KOSHA C-C-87 7.1(1)' });
      lim1 = Math.min(lim1, l25);
      if (fac !== 'kgs') rows.push({ k: T('가연성 — 2차 경보', 'Flammable — 2nd alarm'), lim: l50, show: `${S.fmt(l50, 0)} ppm (LEL 50%)`, v: a2, basis: 'KOSHA C-C-87 7.1(2)' });
    }
    const tox = c && (c.twa != null || c.c != null);
    let refNote = '';
    if (tox) {
      const twa = c.twa != null ? c.twa : null;
      if (fac === 'kgs' || fac === 'confined') {
        let lim = twa != null ? twa : c.c;
        if (fac === 'kgs' && st.id === 'nh3' && st.nh3in) lim = 50;
        rows.push({ k: T('독성 — 경보', 'Toxic — alarm'), lim, show: `${S.fmt(lim)} ppm (${st.id === 'nh3' && st.nh3in && fac === 'kgs' ? T('실내 암모니아 50ppm', 'indoor ammonia 50 ppm') : twa != null ? T('국내 TWA', 'Korean TWA') : T('국내 C (TWA 없음)', 'Korean C (no TWA)')})`, v: a1, basis: fac === 'kgs' ? `KGS ${code || 'FU211·FU212'} 2.8.2.1.2` : 'KOSHA C-C-87 7.2(2)' });
        lim1 = Math.min(lim1, lim);
      } else {
        const ag = S.AEGL2[st.id], erpg = num(st.erpg);
        let ref = null, how = '';
        if (erpg != null) { ref = erpg; how = T('ERPG-2 (입력값)', 'ERPG-2 (entered)'); }
        else if (ag && ag[1] === 'ppm') { ref = ag[0]; how = `AEGL-2 60${T('분', ' min')}${ag[2] ? T(' (잠정)', ' (interim)') : ''}`; refNote = T('ERPG-2가 있는 물질이면 그 값이 먼저입니다 — AIHA 표에서 확인해 입력하세요.', 'If the substance has an ERPG-2, it comes first — look it up in the AIHA table and enter it.'); }
        else if (c.idlh != null && c.idlhUnit === 'ppm') { ref = c.idlh * 0.1; how = 'IDLH 10%'; }
        if (ref != null && c.c != null && c.c < ref) { ref = c.c; how += T(' → 국내 C가 더 낮아 C 적용', ' → Korean ceiling is lower, so C applies'); }
        if (ref != null) { rows.push({ k: T('독성 — 경보 (고정식 누출감지)', 'Toxic — alarm (fixed leak detector)'), lim: ref, show: `${S.fmt(ref)} ppm (${how})`, v: a1, basis: 'KOSHA C-C-87 7.2(1)' }); lim1 = Math.min(lim1, ref); }
        else rows.push({ k: T('독성 — 경보', 'Toxic — alarm'), lim: null, show: T('ERPG-2·AEGL-2·IDLH 값이 없어 LC50 등 급성독성값으로 정해야 합니다', 'No ERPG-2, AEGL-2 or IDLH — set it from acute toxicity data such as LC50'), v: a1, basis: 'KOSHA C-C-87 7.2(1)(마)' });
      }
    }
    rows.forEach((r) => { r.level = r.v == null || r.lim == null ? 'info' : r.v <= r.lim ? 'ok' : 'bad'; });
    return { fac, code, fl, tox, rows, lim1: lim1 === Infinity ? null : lim1, a1, a2, lv: worst(rows.map((r) => r.level)), refNote, both: !!(fl && tox) };
  }

  /* ---------- 2. 혼합가스 (P-179) ---------- */
  function mixEval(rows) {
    const F = [], I = [];
    rows.forEach(([id, v]) => { const x = num(v); if (x == null || x <= 0) return; if (S.FLAM[id]) F.push({ id, a: x, lel: S.FLAM[id].lel, tci: S.FLAM[id].tci != null ? S.FLAM[id].tci : S.FLAM[id].lel }); else if (S.INERT_K[id] != null) I.push({ id, b: x, k: S.INERT_K[id] }); });
    const sumA = F.reduce((a, x) => a + x.a, 0), sumB = I.reduce((a, x) => a + x.b, 0), total = sumA + sumB;
    if (!F.length) return { F, I, total, none: true };
    const LpM = 100 / F.reduce((a, x) => a + (x.a / sumA * 100) / x.lel, 0);   /* 식 (5-2): 인화성 성분만의 LEL */
    if (!I.length) return { F, I, total, flamOnly: true, lel: LpM, LpM };
    const denom = sumA + I.reduce((a, x) => a + x.k * x.b, 0);
    F.forEach((x) => { x.ap = x.a / denom * 100; });                          /* 식 (4-2) */
    const sum41 = F.reduce((a, x) => a + x.ap / x.tci, 0);                     /* 식 (4-1) */
    const K = I.reduce((a, x) => a + x.k * x.b, 0) / sumB;                    /* 식 (5-3) */
    const CL = (100 - LpM - (1 - K) * (sumB / sumA) * LpM) / (100 - LpM);     /* 식 (5-6) */
    F.forEach((x) => { x.lelp = CL * x.lel; });                               /* 식 (5-5) */
    const flammable = sum41 > 1;
    const lel = flammable && CL > 0 ? 100 / F.reduce((a, x) => a + x.a / x.lelp, 0) : null;   /* 식 (5-1) */
    return { F, I, total, sumA, sumB, denom, sum41, flammable, LpM, K, CL, lel };
  }

  /* ---------- 3. ERG ---------- */
  const ergRow = (id) => S.ERG.find((r) => r.id === id);
  const ergGuide = (id) => S.ERG_GUIDE.find((r) => r.id === id);
  const km = (v, plus) => `${Number(v).toFixed(1)}${plus ? '+' : ''} km`;   /* one decimal, as printed in the ERG */

  const TOOLS = {
    alarm: {
      label: () => T('경보 설정값 검토', 'Alarm set points'),
      render() {
        const st = S.load('gas.alarm', { id: 'ph3', fac: 'auto', unit: 'ppm', a1: '0.3', a2: '0.6', erpg: '', nh3in: false });
        const ev = alarmEval(st), c = chem(st.id);
        const facs = [['auto', T('자동 (고압가스 해당 여부로 판단)', 'Auto (by high-pressure gas status)')], ['kgs', T('고압가스 사용시설 — KGS FU211·FU212', 'High-pressure gas facility — KGS FU211/FU212')], ['kosha', T('그 밖의 시설 — KOSHA C-C-87 고정식', 'Other facilities — KOSHA C-C-87 fixed detector')], ['confined', T('밀폐공간 작업 전·중 측정기 — C-C-87 7.2(2)', 'Confined-space testing instrument — C-C-87 7.2(2)')]];
        return `<div class="grid g2">
          <div class="panel stack">
            <div class="form-grid">
              <div class="field"><label for="al-id">${T('감지 대상 가스', 'Target gas')}</label><select id="al-id">${ALARM_IDS().map((id) => `<option value="${id}" ${id === st.id ? 'selected' : ''}>${esc(name(id))}</option>`).join('')}</select></div>
              <div class="field"><label for="al-fac">${T('적용 기준', 'Applicable code')}</label><select id="al-fac">${facs.map(([v, l]) => `<option value="${v}" ${st.fac === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
            </div>
            <div class="form-grid">
              <div class="field"><label for="al-unit">${T('설정값 단위', 'Unit')}</label><select id="al-unit"><option value="ppm" ${st.unit === 'ppm' ? 'selected' : ''}>ppm</option>${ev.fl ? `<option value="lel" ${st.unit === 'lel' ? 'selected' : ''}>%LEL</option>` : ''}</select></div>
              <div class="field"><label for="al-a1">${T('1차 경보 설정값', '1st alarm set point')}</label><input type="number" step="any" min="0" id="al-a1" value="${esc(st.a1)}"></div>
              <div class="field"><label for="al-a2">${T('2차 경보 설정값 (선택)', '2nd alarm (optional)')}</label><input type="number" step="any" min="0" id="al-a2" value="${esc(st.a2)}"></div>
              ${ev.fac === 'kosha' && ev.tox ? `<div class="field"><label for="al-erpg">${T('ERPG-2 (AIHA 표에서 확인, ppm)', 'ERPG-2 (from the AIHA table, ppm)')}</label><input type="number" step="any" min="0" id="al-erpg" value="${esc(st.erpg)}"></div>` : ''}
            </div>
            ${st.id === 'nh3' && ev.fac === 'kgs' ? `<label class="check"><input type="checkbox" id="al-nh3" ${st.nh3in ? 'checked' : ''}> ${T('실내에서 쓰는 암모니아 — 경보농도 50ppm 가능 (KGS FU211 2.8.2.1.2 단서)', 'Ammonia used indoors — 50 ppm allowed (KGS FU211 2.8.2.1.2 proviso)')}</label>` : ''}
            <p class="small muted">${ev.fac === 'kgs' ? T(`고압가스 사용시설: KGS ${ev.code || 'FU211·FU212'} — 가연성은 폭발하한계의 1/4 이하, 독성은 TLV-TWA 기준농도 이하. 포털은 국내 노출기준(TWA)으로 대조합니다(원문은 TLV-TWA).`, `High-pressure gas facility: KGS ${ev.code || 'FU211/FU212'} — flammable ≤ 1/4 of LEL, toxic ≤ TLV-TWA. The portal compares with the Korean TWA (the code says TLV-TWA).`)
              : ev.fac === 'confined' ? T('밀폐공간 작업 전·중 가스농도를 재는 측정기의 경보값은 시간가중평균노출기준(TWA)으로 설정합니다.', 'Instruments that test confined-space air before and during work alarm at the TWA.')
              : T('설비 결함·오작동으로 새는 가스를 조기에 감지하는 고정식은 ERPG-2 → AEGL-2(1시간) → PAC-2 → IDLH 10% 순으로 정하고, TLV-C가 있으면 더 낮은 쪽을 씁니다.', 'Fixed detectors for early leak detection use ERPG-2 → AEGL-2 (1 h) → PAC-2 → 10 % of IDLH, or the ceiling if it is lower.')}</p>
            ${ev.both ? `<div class="callout small">${T('인화성이면서 독성인 가스는 독성가스를 기준으로 감지경보기를 설치합니다 (C-C-87 6.1(9)). 두 기준 중 낮은 값이 1차 경보 상한입니다.', 'For a gas that is both flammable and toxic, detectors are installed on the toxic basis (C-C-87 6.1(9)); the lower of the two limits caps the 1st alarm.')}</div>` : ''}
          </div>
          <div class="result stack" aria-live="polite">
            <div class="row" style="justify-content:space-between"><span class="lbl">${T('판정', 'Verdict')}</span>${ui.pill(ev.lv, ev.lv === 'bad' ? T('기준 초과 — 설정값 낮춤 검토', 'Above the limit — lower the set point') : ev.lv === 'ok' ? T('기준 이내', 'Within the limits') : T('값을 입력하세요', 'Enter a set point'))}</div>
            ${ev.lim1 != null ? `<div class="big">≤ ${S.fmt(ev.lim1)} ppm <span class="small muted">${T('1차 경보 상한', '1st-alarm cap')}</span></div>` : ''}
            <div class="table-wrap"><table class="data"><thead><tr><th>${T('기준', 'Criterion')}</th><th>${T('상한', 'Upper limit')}</th><th class="n">${T('설정값', 'Set point')}</th><th>${T('판정', 'Result')}</th></tr></thead><tbody>
              ${ev.rows.map((r) => `<tr><td><b>${esc(r.k)}</b><br><span class="xs muted">${esc(r.basis)}</span></td><td class="small">${esc(r.show)}</td><td class="n">${r.v == null ? '–' : S.fmt(r.v) + ' ppm'}</td><td>${r.level === 'info' ? '<span class="xs muted">–</span>' : ui.pill(r.level, r.level === 'ok' ? T('적합', 'OK') : T('초과', 'Too high'))}</td></tr>`).join('') || `<tr><td colspan="4" class="small muted">${T('이 가스에 적용할 기준값이 없습니다', 'No limit available for this gas')}</td></tr>`}
            </tbody></table></div>
            ${ev.refNote ? `<p class="xs">${esc(ev.refNote)}</p>` : ''}
            ${ev.a1 != null && ev.a2 != null && ev.a2 < ev.a1 ? `<p class="xs" style="color:var(--warn)">${T('2차 경보가 1차보다 낮습니다.', 'The 2nd alarm is below the 1st.')}</p>` : ''}
            <div class="callout small"><b>${T('감지경보기 기능 요건 (함께 점검)', 'Detector requirements (check these too)')}</b><ul class="clean xs">
              <li>${T('경보 정밀도: 가연성 ±25% 이하, 독성 ±30% 이하 — 전원 전압 ±10% 변동에도 유지', 'Accuracy: ±25 % (flammable), ±30 % (toxic), held with ±10 % supply variation')}</li>
              <li>${T('경보농도의 1.6배에서 30초 이내 경보 (암모니아·CO 등은 1분 이내)', 'Alarm within 30 s at 1.6 × the set point (1 min for ammonia, CO and similar)')}</li>
              <li>${T(`지시 범위: 가연성 0~LEL, 독성 0~TWA의 3배${c && c.twa != null ? ` (${S.fmt(c.twa * 3)} ppm)` : ''}, 실내 암모니아 0~150ppm`, `Scale: 0–LEL (flammable), 0–3 × TWA (toxic)${c && c.twa != null ? ` (${S.fmt(c.twa * 3)} ppm)` : ''}, indoor ammonia 0–150 ppm`)}</li>
              <li>${T('경보는 농도가 내려가도 확인·조치 전까지 계속 울림, 설정값은 잠금·암호로 관리', 'Alarms latch until acknowledged; set points locked or password-protected')}</li>
              <li>${T('최초 사용 전·수리 후 교정, 주전원 차단 시 30분 이상 비상전원 (C-C-87 6.1(8)(다)·8.1)', 'Calibrate before first use and after repair; 30 min of backup power (C-C-87 6.1(8)(c), 8.1)')}</li>
              <li>${T('작업소음(70dB 이상, 1일 8시간 이상)으로 경보를 듣기 어려우면 시각경보기 설치 검토 — 바닥에서 2~2.5m(천장이 2m 이하면 천장에서 0.15m 이내) (C-C-87 6.1(4), 2026.1.30 신설)', 'Where work noise (≥ 70 dB for 8 h or more a day) makes alarms hard to hear, consider visual alarms 2–2.5 m above the floor (within 0.15 m of a ceiling lower than 2 m) (C-C-87 6.1(4), new on 2026-01-30)')}</li></ul></div>
            <p class="xs muted">${T('KGS 코드는 고압가스 안전관리법 제22조의2의 상세기준입니다. C-C-87은 KOSHA 기술지침으로 법적 강제 기준은 아닙니다. 사내 설정 기준이 더 엄격하면 그 기준을 따릅니다.', 'KGS codes are detailed standards under High-Pressure Gas Act Art. 22-2; C-C-87 is KOSHA guidance, not binding law. Follow stricter in-house set points where they exist.')}</p>
          </div></div>`;
      },
      mount(root) {
        const st = S.load('gas.alarm', { id: 'ph3', fac: 'auto', unit: 'ppm', a1: '0.3', a2: '0.6', erpg: '', nh3in: false });
        const up = () => { S.save('gas.alarm', st); S.refresh(); };
        root.querySelector('#al-id').addEventListener('change', (e) => { st.id = e.target.value; st.a1 = st.a2 = st.erpg = ''; st.unit = 'ppm'; up(); });
        [['#al-fac', 'fac'], ['#al-unit', 'unit'], ['#al-a1', 'a1'], ['#al-a2', 'a2'], ['#al-erpg', 'erpg']].forEach(([s, k]) => { const el = root.querySelector(s); if (el) el.addEventListener('change', () => { st[k] = el.value; up(); }); });
        const n3 = root.querySelector('#al-nh3'); if (n3) n3.addEventListener('change', () => { st.nh3in = n3.checked; up(); });
      },
      basis: ['kgsFu211', 'kgsFu212', 'koshaCC87', 'koshaP179', 'epaAegl', 'nioshIdlh', 'moelOel']
    },

    mix: {
      label: () => T('혼합가스 폭발하한계', 'Gas-mixture LEL'),
      render() {
        const st = S.load('gas.mix', { rows: [['sih4', '10'], ['n2', '90']], ox: false });
        const ev = mixEval(st.rows);
        const opts = (sel) => `<optgroup label="${esc(T('인화성 가스·증기 (P-179 부록2)', 'Flammable (P-179 Annex 2)'))}">${Object.keys(S.FLAM).map((id) => `<option value="${id}" ${id === sel ? 'selected' : ''}>${esc(name(id))}</option>`).join('')}</optgroup>
          <optgroup label="${esc(T('불활성 가스 (P-179 부록1)', 'Inert (P-179 Annex 1)'))}">${Object.keys(S.INERT_K).map((id) => `<option value="${id}" ${id === sel ? 'selected' : ''}>${esc(name(id))} — K ${S.INERT_K[id]}</option>`).join('')}</optgroup>`;
        const f3 = (v) => S.fmt(v, 3);
        return `<div class="grid g2">
          <div class="panel stack">
            <span class="lbl">${T('혼합가스 조성 (mol%)', 'Mixture composition (mol%)')}</span>
            ${st.rows.map(([id, v], i) => `<div class="row"><select data-mx="${i}" data-k="0" aria-label="${T('성분', 'Component')} ${i + 1}" style="flex:1;min-width:170px">${opts(id)}</select><input type="number" step="any" min="0" data-mx="${i}" data-k="1" value="${esc(v)}" aria-label="mol% ${i + 1}" style="max-width:100px"><span class="small">mol%</span><button class="btn danger sm" type="button" data-mx-del="${i}" aria-label="${T('삭제', 'Delete')}">×</button></div>`).join('')}
            <div class="row"><button class="btn ghost sm" type="button" id="mx-add">+ ${T('성분 추가', 'Add component')}</button><button class="btn ghost sm" type="button" id="mx-ex">${T('P-179 부록5 예시 불러오기', 'Load the P-179 Annex 5 example')}</button></div>
            <p class="small ${Math.abs(ev.total - 100) > 0.01 ? '' : 'muted'}" ${Math.abs(ev.total - 100) > 0.01 ? 'style="color:var(--warn)"' : ''}>${T('합계', 'Total')} ${S.fmt(ev.total, 2)} mol%${Math.abs(ev.total - 100) > 0.01 ? T(' — 100%가 되게 맞추세요', ' — make it add up to 100 %') : ''}</p>
            <label class="check"><input type="checkbox" id="mx-ox" ${st.ox ? 'checked' : ''}> ${T('산소·NF₃·염소 등 산화성 가스가 들어 있다', 'Contains oxygen, NF₃, chlorine or another oxidiser')}</label>
            <p class="xs muted">${T('르샤틀리에 식은 인화성 가스·질소·공기 혼합에만 쓰고, 질소 외 불활성 가스가 있으면 ISO 10156 식을 씁니다(질소만 있으면 두 식의 결과가 같습니다). 부분 할로겐화 탄화수소와 공기 외 산화제에는 쓸 수 없습니다. 실험값이 가장 정확합니다(P-179 5.1·5.2.1).', 'Le Chatelier applies to flammable gas, nitrogen and air; other inerts need the ISO 10156 method (with nitrogen only the two agree). Neither applies to partially halogenated hydrocarbons or oxidisers other than air. Test data are best (P-179 5.1, 5.2.1).')}${S.cite('koshaP179')}</p>
          </div>
          <div class="result stack" aria-live="polite">
            ${st.ox ? `<div class="callout warn small">${T('산화성 가스가 포함된 혼합물은 P-179 5.3의 15단계 절차(한계산소농도·산화력 계산)로 판정해야 합니다. 이 도구의 범위 밖입니다.', 'Mixtures with oxidisers need the 15-step procedure in P-179 5.3 (limiting oxygen and oxidising power). That is outside this tool.')}</div>` :
            ev.none ? `<p class="small muted">${T('인화성 성분을 하나 이상 넣으세요', 'Add at least one flammable component')}</p>` :
            ev.flamOnly ? `<div class="row" style="justify-content:space-between"><span class="lbl">${T('혼합물 LEL (르샤틀리에, 식 5-1)', 'Mixture LEL (Le Chatelier, Eq. 5-1)')}</span>${ui.pill('bad', T('인화성', 'Flammable'))}</div><div class="big">${S.fmt(ev.lel, 2)} vol%</div>
              <p class="xs muted">${T('인화성 가스로만 된 혼합물은 폭발성 판정이 필요 없습니다(P-179 4(1)).', 'A mixture of flammables only needs no flammability test (P-179 4(1)).')}</p>` :
            `<div class="row" style="justify-content:space-between"><span class="lbl">${T('폭발성 판정 (식 4-1)', 'Flammability (Eq. 4-1)')}</span>${ev.flammable ? ui.pill('bad', T('인화성 가스', 'Flammable')) : ui.pill('ok', T('비인화성', 'Non-flammable'))}</div>
              <div class="big">Σ A′/Tci = ${f3(ev.sum41)} <span class="small muted">${ev.flammable ? '> 1' : '≤ 1'}</span></div>
              ${ev.flammable && ev.lel != null ? `<div class="small">${T('혼합물 전체의 폭발하한계', 'LEL of the whole mixture')}: <b class="num">${S.fmt(ev.lel, 2)} vol%</b> ${ev.lel <= 10 ? `<span class="chip">${T('폭발하한 10% 이하 — KGS 가연성가스 정의 해당', 'LEL ≤ 10 % — flammable gas under the KGS definition')}</span>` : ''}</div>` : ''}
              ${ev.flammable && ev.lel == null ? `<p class="xs" style="color:var(--warn)">${T('수정계수 C_L이 0 이하라 식으로 폭발하한계를 구할 수 없습니다 — 실험값을 쓰세요.', 'The correction factor C_L is zero or below, so the LEL cannot be calculated — use test data.')}</p>` : ''}
              <div class="table-wrap"><table class="data"><thead><tr><th>${T('성분', 'Component')}</th><th class="n">mol%</th><th class="n">LEL</th><th class="n">Tci</th><th class="n">A′</th><th class="n">LEL′</th></tr></thead><tbody>
                ${ev.F.map((x) => `<tr><td>${esc(name(x.id))}</td><td class="n">${S.fmt(x.a, 3)}</td><td class="n">${S.fmt(x.lel, 2)}${S.FLAM[x.id].est ? '*' : ''}</td><td class="n">${S.fmt(x.tci, 2)}${S.FLAM[x.id].tci == null ? '†' : ''}</td><td class="n">${f3(x.ap)}</td><td class="n">${x.lelp != null ? f3(x.lelp) : '–'}</td></tr>`).join('')}
                ${ev.I.map((x) => `<tr><td>${esc(name(x.id))} <span class="xs muted">K ${x.k}</span></td><td class="n">${S.fmt(x.b, 3)}</td><td colspan="4" class="xs muted">${T('불활성', 'Inert')}</td></tr>`).join('')}
              </tbody></table></div>
              <p class="xs muted">L′M ${f3(ev.LpM)} vol% · K ${f3(ev.K)} · C<sub>L</sub> ${f3(ev.CL)} (${T('식 5-2·5-3·5-6', 'Eq. 5-2, 5-3, 5-6')}) · * ${T('P-179 추정값', 'P-179 estimate')} · † ${T('Tci가 없어 LEL 사용 (P-179 4(2))', 'no Tci, LEL used (P-179 4(2))')}</p>`}
            <p class="xs muted">${T('P-179 부록5 예시(H₂ 2, CH₄ 6, Ar 27, He 65): 원문은 중간값을 반올림해 LEL 48.04 vol%, 이 도구는 반올림 없이 48.05 vol%입니다. 원문 3단계의 Σ 값은 1.5로 인쇄돼 있으나 실제 계산은 1.30이며 결론(인화성)은 같습니다.', 'P-179 Annex 5 example (H₂ 2, CH₄ 6, Ar 27, He 65): the guide rounds intermediate values and gets 48.04 vol%; this tool, without rounding, gets 48.05 vol%. Step 3 is printed as 1.5 but works out to 1.30 — the conclusion (flammable) is the same.')}</p>
          </div></div>`;
      },
      mount(root) {
        const st = S.load('gas.mix', { rows: [['sih4', '10'], ['n2', '90']], ox: false });
        const up = () => { S.save('gas.mix', st); S.refresh(); };
        root.querySelectorAll('[data-mx]').forEach((el) => el.addEventListener('change', () => { st.rows[el.dataset.mx][el.dataset.k] = el.value; up(); }));
        root.querySelectorAll('[data-mx-del]').forEach((b) => b.addEventListener('click', () => { st.rows.splice(Number(b.dataset.mxDel), 1); up(); }));
        root.querySelector('#mx-add').addEventListener('click', () => { st.rows.push(['n2', '']); up(); });
        root.querySelector('#mx-ex').addEventListener('click', () => { st.rows = [['h2', '2'], ['ch4', '6'], ['ar', '27'], ['he', '65']]; st.ox = false; up(); });
        root.querySelector('#mx-ox').addEventListener('change', (e) => { st.ox = e.target.checked; up(); });
      },
      basis: ['koshaP179', 'kgsFu212', 'nioshNpg']
    },

    erg: {
      label: () => T('비상 이격거리 (ERG)', 'Isolation distances (ERG)'),
      render() {
        const st = S.load('gas.erg', { id: 'ash3', size: 's', time: 'day', wind: 1 });
        const r = ergRow(st.id), g = ergGuide(st.id);
        let iso = null, prot = null, plus = false;
        if (r) {
          if (st.size === 's') { iso = r.s[0]; prot = st.time === 'day' ? r.s[1] : r.s[2]; }
          else if (r.t3) { iso = r.t3[0]; prot = (st.time === 'day' ? r.t3[1] : r.t3[2])[Number(st.wind)]; }
          else { iso = r.l[0]; prot = st.time === 'day' ? r.l[1] : r.l[2]; plus = !!r.plus; }
        }
        const ids = S.ERG.map((x) => x.id).concat(S.ERG_GUIDE.map((x) => x.id));
        /* schematic (not to scale): isolation circle and downwind protective-action square */
        const svg = r && iso != null ? `<svg viewBox="0 0 320 150" class="chart" role="img" aria-label="${T('초기 이격·방호 구역 개념도', 'Isolation and protective-action zones (schematic)')}">
            <rect x="120" y="15" width="190" height="120" fill="var(--warn)" opacity=".15" stroke="var(--warn)"/>
            <circle cx="60" cy="75" r="45" fill="var(--bad)" opacity=".18" stroke="var(--bad)"/><circle cx="60" cy="75" r="4" fill="var(--bad)"/>
            <text x="60" y="130" text-anchor="middle">${T('이격', 'Isolate')} ${iso} m</text>
            <text x="215" y="70" text-anchor="middle">${T('풍하 방호', 'Protect downwind')}</text><text x="215" y="88" text-anchor="middle" class="lbl-strong">${km(prot, plus)}</text>
            <path d="M110 75 H300" stroke="var(--ink-2)" stroke-width="1.5" marker-end="url(#arr)"/><defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--ink-2)"/></marker></defs>
            <text x="300" y="148" text-anchor="end" class="xs">${T('바람 방향 → (축척 아님)', 'wind → (not to scale)')}</text></svg>` : '';
        return `<div class="grid g2">
          <div class="panel stack">
            <div class="form-grid">
              <div class="field"><label for="eg-id">${T('물질', 'Material')}</label><select id="eg-id">${ids.map((id) => { const x = ergRow(id) || ergGuide(id); return `<option value="${id}" ${id === st.id ? 'selected' : ''}>UN${x.un} ${esc(name(id))}</option>`; }).join('')}</select></div>
              ${r ? `<div class="field"><label for="eg-size">${T('누출 규모', 'Spill size')}</label><select id="eg-size"><option value="s" ${st.size === 's' ? 'selected' : ''}>${T('소량 — 208L 이하 (소형 용기·작은 누설)', 'Small — 208 L or less (small package or small leak)')}</option><option value="l" ${st.size === 'l' ? 'selected' : ''}>${T('대량 — 208L 초과 (대형 용기·여러 용기)', 'Large — over 208 L (large or many packages)')}</option></select></div>
              <div class="field"><label for="eg-time">${T('시간대', 'Time')}</label><select id="eg-time"><option value="day" ${st.time === 'day' ? 'selected' : ''}>${T('주간 (일출~일몰)', 'Day (sunrise–sunset)')}</option><option value="night" ${st.time === 'night' ? 'selected' : ''}>${T('야간 (일몰~일출)', 'Night (sunset–sunrise)')}</option></select></div>
              ${st.size === 'l' && r.t3 ? `<div class="field"><label for="eg-wind">${T('풍속 (표3)', 'Wind (Table 3)')}</label><select id="eg-wind">${[T('약풍 < 10km/h', 'Low < 10 km/h'), T('중풍 10~20km/h', 'Moderate 10–20 km/h'), T('강풍 > 20km/h', 'High > 20 km/h')].map((l, i) => `<option value="${i}" ${Number(st.wind) === i ? 'selected' : ''}>${l}</option>`).join('')}</select></div>` : ''}` : ''}
            </div>
            <p class="xs muted">${T('ERG는 수송 중 사고의 초기 대응(처음 30분 정도)을 위한 지침서입니다. 사업장 고정시설의 비상대응 범위는 공정안전보고서 비상조치계획·화학사고예방관리계획서의 사고 시나리오 결과로 정하고, 이 표는 초기 판단의 참고로만 쓰세요.', 'The ERG is for the first phase of transport incidents. For fixed plant, emergency zones come from the PSM emergency plan and the chemical accident prevention plan scenarios; use this table only as an early reference.')}</p>
          </div>
          <div class="result stack" aria-live="polite">
            ${r ? `<div class="row" style="justify-content:space-between"><span class="lbl">UN${r.un} · ${T('가이드', 'Guide')} ${r.g}</span>${ui.pill('bad', T('흡입독성(TIH) 표1 대상', 'TIH — in Table 1'))}</div>
              <div class="grid g2"><div class="kpi"><span class="k">${T('먼저 모든 방향 이격', 'First isolate in all directions')}</span><span class="v">${iso} m</span></div>
              <div class="kpi"><span class="k">${T('그다음 풍하 방호', 'Then protect downwind')}</span><span class="v">${km(prot, plus)}</span></div></div>${svg}
              ${st.size === 'l' && r.t3 ? `<p class="xs">${T('표3의 ‘소형 실린더 여러 개 또는 톤 실린더 1개’ 행입니다.', 'Row “multiple small cylinders or a single ton cylinder” of Table 3.')}</p>` : ''}
              ${r.note ? `<p class="xs">${esc(L(r.note))}</p>` : ''}`
            : g ? `<div class="row" style="justify-content:space-between"><span class="lbl">UN${g.un} · ${T('가이드', 'Guide')} ${g.g}</span>${ui.pill('warn', T('표1 대상 아님 — 가이드 거리', 'Not in Table 1 — guide distances'))}</div>
              <ul class="clean small"><li>${T('즉시 모든 방향 이격', 'Isolate at once in all directions')}: <b>${g.ev[0]} m</b></li><li>${T('대량 누출 시 풍하 대피 검토', 'Large spill: consider downwind evacuation')}: <b>${g.ev[1]} m</b></li><li>${T('탱크 등이 화재에 휩싸이면 모든 방향 이격·대피', 'Tank involved in fire: isolate and evacuate in all directions')}: <b>${g.ev[2]} m</b></li></ul>` : ''}
            <ul class="clean xs muted"><li>${T('화재가 있으면 가이드의 화재 시 이격거리를 우선 쓰고, 표1은 풍하 잔여 누출 방호에 씁니다.', 'With fire, use the guide’s fire distance first and Table 1 for downwind protection from the remaining release.')}</li>
              <li>${T('테러·파손 등으로 용기 전체가 한꺼번에 나오면 거리를 두 배로 하는 것이 적절합니다.', 'For an instantaneous release of a whole package (sabotage, catastrophic failure), doubling the distances is appropriate.')}</li>
              <li>${T('기온이나 액체 온도가 30℃를 넘거나, 계곡·고층 건물 사이로 흐르면 거리가 늘 수 있습니다. ‘+’는 기상에 따라 더 멀 수 있다는 뜻입니다.', 'Above 30 °C, or where the plume is channelled by valleys or tall buildings, distances may grow; “+” means it can be larger in some weather.')}</li></ul>
          </div></div>
          <section class="panel" style="margin-top:14px" data-shared>${ui.title(T('반도체 가스 초기 이격·방호 거리 (ERG 2024 표1)', 'Fab gases — initial isolation and protective action (ERG 2024 Table 1)'))}
            <div class="table-wrap"><table class="data"><thead><tr><th>UN</th><th>${T('물질', 'Material')}</th><th class="n">${T('가이드', 'Guide')}</th><th class="n">${T('소량 이격', 'Small: isolate')}</th><th class="n">${T('소량 방호 주/야', 'Small: protect day/night')}</th><th class="n">${T('대량 이격', 'Large: isolate')}</th><th class="n">${T('대량 방호 주/야', 'Large: protect day/night')}</th></tr></thead><tbody>
              ${S.ERG.map((x) => `<tr ${x.id === st.id ? 'class="sel"' : ''}><td class="num">${x.un}</td><td class="small">${esc(name(x.id))}</td><td class="n">${x.g}</td><td class="n">${x.s[0]} m</td><td class="n">${x.s[1].toFixed(1)} / ${x.s[2].toFixed(1)} km</td>
                <td class="n">${x.t3 ? x.t3[0] + ' m*' : x.l[0] + ' m'}</td><td class="n">${x.t3 ? T('표3', 'Table 3') + '*' : `${x.l[1].toFixed(1)}${x.plus ? '+' : ''} / ${x.l[2].toFixed(1)}${x.plus ? '+' : ''} km`}</td></tr>`).join('')}
            </tbody></table></div>
            <p class="xs muted" style="margin-top:6px">* ${T('염소·불화수소·염화수소·암모니아의 대량 누출은 표3(용기 종류·풍속별)을 씁니다. 여기서는 ‘소형 실린더 여러 개 또는 톤 실린더 1개’ 행의 이격거리입니다.', 'Large spills of chlorine, HF, HCl and ammonia use Table 3 (by container and wind); the isolation shown is the “multiple small cylinders or single ton cylinder” row.')}${S.cite('erg2024')}</p>
          </section>`;
      },
      mount(root) {
        const st = S.load('gas.erg', { id: 'ash3', size: 's', time: 'day', wind: 1 });
        const up = () => { S.save('gas.erg', st); S.refresh(); };
        [['#eg-id', 'id'], ['#eg-size', 'size'], ['#eg-time', 'time'], ['#eg-wind', 'wind']].forEach(([s, k]) => { const el = root.querySelector(s); if (el) el.addEventListener('change', () => { st[k] = el.value; up(); }); });
      },
      basis: ['erg2024']
    }
  };

  S.gasApi = { alarmEval, mixEval };
  S.pages.gas = {
    render() {
      const cur = S.tab('gas', 'alarm');
      const tool = TOOLS[cur] || TOOLS.alarm;
      return `
      ${ui.head(T('판정·평가 도구', 'Tools'), T('가스 안전 도구', 'Gas safety tools'),
        T('반도체 특수가스 설비에서 바로 쓰는 세 가지 계산 — 가스 감지경보기 설정값이 KGS 코드·KOSHA 지침에 맞는지, 혼합가스가 인화성인지와 그 폭발하한계, 누출 시 초기 이격·방호 거리를 원문 기준으로 확인합니다.',
          'Three checks for fab specialty-gas systems — whether detector set points meet the KGS codes and KOSHA guidance, whether a gas mixture is flammable and its LEL, and initial isolation and protective distances for a release — all from the original documents.'))}
      ${ui.tabs('gas', Object.keys(TOOLS).map((id) => ({ id, label: TOOLS[id].label() })), cur)}
      ${tool.render()}
      <p class="xs muted">${T('근거', 'Basis')}: ${S.cite(tool.basis)} · ${T('입력값은 이 브라우저에만 저장됩니다. 판단 보조 도구이며 사내 기준과 원문을 함께 확인하세요.', 'Inputs are saved in this browser only. A decision aid — check in-house rules and the originals.')}</p>`;
    },
    mount(root) { const cur = S.tab('gas', 'alarm'); (TOOLS[cur] || TOOLS.alarm).mount(root); }
  };
})();

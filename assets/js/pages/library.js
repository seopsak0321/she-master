/* 라이브러리 — SOP·작업 안전, 공정·물질 위험 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui;
  const chemById = (id) => S.CHEMICALS.find((c) => c.id === id);
  const lvl = (l) => l === 'A' ? ui.pill('bad', T('고위험', 'High risk')) : ui.pill('warn', T('중위험', 'Medium risk'));

  function sopDetail(s) {
    const quizState = S.load('quiz.' + s.id, {});
    const answered = s.quiz.filter((q, i) => quizState[i] != null).length;
    const correct = s.quiz.filter((q, i) => Number(quizState[i]) === q.a).length;
    const dt = S.tab('sopd', 'steps');
    const rel = (S.CASES || []).filter((c) => (c.sops || []).includes(s.id));
    return `
    <section class="stack" id="sop-detail" style="gap:16px">
      <div class="panel stack" style="gap:14px">
        <div class="row" style="justify-content:space-between;align-items:flex-start">
          <div class="stack" style="gap:2px"><span class="eyebrow">${T('선택한 SOP', 'Selected SOP')}</span><h2 style="font-size:calc(24px * var(--fz));letter-spacing:-.02em">${L(s.t)}</h2><span class="small muted">${L(s.area)}</span></div>
          <div class="row">${lvl(s.level)}${s.permits.map((p) => `<span class="chip">${L(S.PERMITS[p])}</span>`).join('')}</div>
        </div>
        <div><b class="small">${T('주요 유해·위험요인', 'Key hazards')}</b><ul class="facts cols2" style="margin-top:6px">${L(s.hz).map((h) => `<li>${h}</li>`).join('')}</ul></div>
        ${rel.length ? `<div class="callout warn small"><b>${T('이 작업과 관련된 실제 사고사례', 'Real incidents linked to this job')}</b> — ${rel.map((c) => `<a href="#cases/${c.id}">${S.esc(L(c.dateLabel))} ${S.esc(L(c.t))}</a>`).join(' · ')}</div>` : ''}
        <div class="row"><a class="btn sm" href="#ptw/new/${s.id}">${T('이 작업으로 작업허가서 작성', 'Start a permit for this job')} →</a><button class="btn ghost sm" type="button" data-to-jsa="${s.id}">${T('위험성평가(JSA)로 보내기', 'Send to risk assessment (JSA)')}</button><button class="btn ghost sm" type="button" data-to-check="${s.id}">${T('체크리스트로 점검하기', 'Check as a checklist')}</button>${S.printLink('sop/' + s.id, T('SOP 인쇄 (교육 확인란 포함)', 'Print SOP (with training sign-off)'))}</div>
        <p class="xs muted keep">${ui.ex()} ${T('교육·포트폴리오용 표준 절차 예시입니다. SK하이닉스 사내 SOP가 아니며, 각 단계의 근거를 “법(조문)·지침·관행”으로 구분해 표시했습니다.', 'A teaching example, not an SK hynix internal SOP. Each step shows its basis: law (article), guide, or common practice.')}</p>
      </div>
      ${ui.tabs('sopd', [{ id: 'steps', label: T(`절차 ${s.steps.length}단계`, `${s.steps.length} steps`) }, { id: 'card', label: T('작업 전 5분 카드', '5-minute card') }, { id: 'basis', label: T('근거·물질·교육', 'Basis, substances, training') }, { id: 'quiz', label: T(`이해도 확인 ${answered}/${s.quiz.length}`, `Quiz ${answered}/${s.quiz.length}`) }], dt)}
      ${dt === 'basis' ? `
      <div class="grid g2">
        <div class="panel">${ui.title(T('법령·지침 근거', 'Legal & guidance basis'))}<ul class="facts">${s.legal.map((g) => `<li>${L(g)}</li>`).join('')}</ul><p class="small" style="margin-top:10px">${S.cite(s.src)} · KOSHA ${s.kosha.map((k) => S.koshaTag(k)).join(' ')}</p></div>
        ${(s.edu || []).length ? `<div class="panel">${ui.title(T('관련될 수 있는 특별교육', 'Special training that may apply'), T('시행규칙 별표5 제1호라목', 'Rule Annex 5, 1-d'))}
          <ul class="clean small">${s.edu.map((no) => `<li><span class="chip">${T(`제${no}호`, `No. ${no}`)}</span> ${L(S.SPECIAL_EDU[no])}</li>`).join('')}</ul>
          <p class="small" style="margin-top:10px">${T('해당하면 16시간 이상(최초 작업 전 4시간 이상, 나머지는 3개월 안에 나눠서), 단기간·간헐적 작업은 2시간 이상. 해당 여부는 실제 작업 조건으로 판단합니다.', 'If it applies: 16 h or more (4 h before the first task, the rest within 3 months), or 2 h for short or intermittent work. Whether it applies depends on the actual job.')}${S.cite('lawRule')}</p></div>` : ''}
      </div>
      ${s.chems.length ? `<div class="panel">${ui.title(T('관련 물질 노출기준', 'Related exposure limits'), T('단위 ppm 또는 mg/m³', 'ppm or mg/m³') + S.cite('moelOel', 'nioshIdlh'))}
        <div class="table-wrap"><table class="data compact"><thead><tr><th>${T('물질', 'Substance')}</th><th class="n">TWA</th><th class="n">STEL</th><th class="n">C</th><th class="n">IDLH</th><th></th></tr></thead><tbody>
        ${s.chems.map((id) => { const c = chemById(id); return `<tr><td><button type="button" class="link-btn" data-chem="${c.id}">${S.esc(L(c))}</button> <span class="muted">${c.f}</span></td><td class="n">${c.twa ?? '–'}</td><td class="n">${c.stel ?? '–'}</td><td class="n">${c.c ?? '–'}</td><td class="n">${c.idlh ?? '–'}</td><td>${S.hasOel(c) ? `<button class="btn ghost sm" type="button" data-judge="${c.id}">${T('판정', 'Check')}</button>` : ''}</td></tr>`; }).join('')}
        </tbody></table></div></div>` : ''}` : ''}
      ${dt === 'steps' ? `
    <section class="grid g3">
      <div class="panel span2">${ui.title(T('단계별 절차 (JSA)', 'Step-by-step (JSA)'))}
        <div class="steps">${s.steps.map((st, i) => `<div class="step"><span class="no">${i + 1}</span><div class="body">
          <div class="row" style="justify-content:space-between"><b>${L(st.s)}</b>${ui.basis(st.b)}</div>
          <div class="hc"><span class="small"><span class="muted">${T('위험', 'Hazard')}</span> ${L(st.h)}</span><span class="small"><span class="muted">${T('대책', 'Control')}</span> ${L(st.c)}</span></div>
        </div></div>`).join('')}</div>
      </div>
      <div class="stack">
        <div class="panel"><div class="section-title"><h2 style="color:var(--bad)">${T('작업 중지 기준', 'Stop work if…')}</h2></div><ul class="facts" style="margin-top:8px">${L(s.stop).map((x) => `<li>${x}</li>`).join('')}</ul></div>
        <div class="panel">${ui.title(T('비상 시 행동', 'In an emergency'))}<ul class="facts">${L(s.emer).map((x) => `<li>${x}</li>`).join('')}</ul></div>
      </div>
    </section>` : ''}
      ${dt === 'card' ? `<div class="card5" id="anchor-card">
        <div class="row" style="justify-content:space-between"><h3 style="font-size:calc(18px * var(--fz))">${T('작업 전 5분 안전카드', '5-minute pre-job card')}</h3><span class="row" style="gap:6px"><span class="chip">${T('협력사·현장용', 'For contractors & field crews')}</span>${S.printLink('card/' + s.id, T('카드 인쇄', 'Print card'))}${S.printLink('card/' + s.id + '/both', T('한·영 병기 인쇄', 'Print KO + EN'))}</span></div>
        <p style="font-weight:600">${L(s.t)}</p>
        <div class="cols">
          <div class="do"><h4>✓ ${T('이렇게 하세요', 'Do')}</h4><ul>${L(s.card.do).map((x) => `<li>${x}</li>`).join('')}</ul></div>
          <div class="dont"><h4>✕ ${T('절대 하지 마세요', 'Never')}</h4><ul>${L(s.card.dont).map((x) => `<li>${x}</li>`).join('')}</ul></div>
        </div>
        <p class="small" style="border-top:1px solid var(--line);padding-top:8px"><b>${T('이상하면 멈추고 알리세요.', 'If something seems wrong, stop and tell someone.')}</b> ${T('상단 EN 버튼으로 영어 카드를 볼 수 있습니다.', 'Use the KO button at the top for the Korean card.')}</p>
      </div>` : ''}
      ${dt === 'quiz' ? `<div class="panel">${ui.title(T('SOP 이해도 확인', 'SOP check-up quiz'), T(`${answered}/${s.quiz.length} 응답 · ${correct} 정답`, `${answered}/${s.quiz.length} answered · ${correct} correct`))}
        ${s.quiz.map((q, i) => { const a = quizState[i]; return `<fieldset class="quiz-q" style="border:0;margin:0;padding-inline:0"><legend class="small" style="font-weight:600;padding:0">${i + 1}. ${L(q.q)}</legend>
          ${q.o.map((o, j) => `<label><input type="radio" name="q${i}" data-quiz="${i}" value="${j}" ${String(a) === String(j) ? 'checked' : ''}> ${L(o)} ${a != null && j === q.a ? ui.pill('ok', T('정답', 'Correct')) : ''}${String(a) === String(j) && j !== q.a ? ui.pill('bad', T('다시 보기', 'Review')) : ''}</label>`).join('')}</fieldset>`; }).join('')}
        <button class="btn ghost sm" type="button" data-quiz-reset="${s.id}">${T('다시 풀기', 'Retake')}</button>
      </div>` : ''}
    </section>`;
  }

  S.pages.sop = {
    render(sub) {
      const sel = S.SOPS.find((s) => s.id === sub) || S.SOPS.find((s) => s.id === S.load('sop.sel', 'confined')) || S.SOPS[0];
      const pN = {}, lvN = {};
      S.SOPS.forEach((s) => { s.permits.forEach((p) => { pN[p] = (pN[p] || 0) + 1; }); lvN[s.level] = (lvN[s.level] || 0) + 1; });
      const both = (o) => (o == null ? '' : typeof o === 'string' ? o : [].concat(o.ko || '', o.en || '').join(' '));
      return `
      ${ui.head(T('라이브러리', 'Library'), T('SOP·작업 안전', 'SOPs & job safety'),
        T(`반도체 사업장 고위험 작업 ${S.SOPS.length}종의 표준 절차와 작업 전 5분 카드입니다.`, `Standard procedures and 5-minute pre-job cards for ${S.SOPS.length} high-risk fab jobs.`),
        T('법령 조문·KOSHA 지침·해외 규제기관 자료로 재구성한 교육용 예시입니다. 카드를 누르면 아래에 안전관리자용 절차(JSA)와 협력사 작업자용 5분 카드가 열립니다.', 'Teaching examples rebuilt from statutes, KOSHA guides and foreign regulators. Click a card to open the manager’s JSA and the contractor’s 5-minute card below.'))}
      <section class="stack" style="gap:14px" aria-label="${T('SOP 목록', 'SOP list')}">
        ${S.listbar({ id: 'sop', ph: T('작업명·위험요인·KOSHA 번호로 찾기 — 예: 밀폐, 가스, LOTO', 'Search by job, hazard or KOSHA number — e.g. confined, gas, LOTO'), total: S.SOPS.length,
          facets: [{ key: 'p', label: T('작업허가', 'Permit'), opts: Object.keys(S.PERMITS).filter((p) => pN[p]).map((p) => ({ id: p, label: L(S.PERMITS[p]), n: pN[p] })) },
            { key: 'lv', label: T('위험 등급', 'Risk'), opts: ['A', 'B'].filter((l) => lvN[l]).map((l) => ({ id: l, label: l === 'A' ? T('고위험', 'High risk') : T('중위험', 'Medium risk'), n: lvN[l] })) }] })}
        <div class="sop-grid">${S.SOPS.map((s) => `<a class="sop-card" href="#sop/${s.id}" ${s.id === sel.id ? 'aria-current="true"' : ''} style="text-decoration:none"
          data-li="${S.esc([s.id, both(s.t), both(s.area), L(s.hz).join(' '), s.kosha.join(' ')].join(' '))}" data-f-p="${s.permits.join(' ')}" data-f-lv="${s.level}">
          <div class="row" style="justify-content:space-between">${lvl(s.level)}<span class="xs muted">${s.steps.length} ${T('단계', 'steps')}</span></div>
          <h3>${L(s.t)}</h3><span class="small muted">${L(s.area)}</span>
          <div class="row">${s.permits.map((p) => `<span class="chip">${L(S.PERMITS[p])}</span>`).join('')}</div></a>`).join('')}</div>
        <p class="lb-empty" data-lb-empty hidden>${T('조건에 맞는 SOP가 없습니다. 다른 낱말이나 분류로 찾아보세요.', 'No SOPs match. Try another word or filter.')}</p>
      </section>
      ${sopDetail(sel)}`;
    },
    mount(root, sub) {
      const sel = S.SOPS.find((s) => s.id === sub) || S.SOPS.find((s) => s.id === S.load('sop.sel', 'confined')) || S.SOPS[0];
      S.save('sop.sel', sel.id);
      S.listFilter(root, 'sop');
      root.querySelectorAll('[data-chem]').forEach((b) => b.addEventListener('click', () => S.chemDetail(b.dataset.chem)));
      if (sub && !S.state.refreshing) setTimeout(() => { const d = root.querySelector('#sop-detail'); if (d) S.reveal(d); }, 0);
      root.querySelectorAll('[data-quiz]').forEach((r) => r.addEventListener('change', () => {
        const st = S.load('quiz.' + sel.id, {}); st[r.dataset.quiz] = r.value; S.save('quiz.' + sel.id, st); S.refresh();
      }));
      const rs = root.querySelector('[data-quiz-reset]'); if (rs) rs.addEventListener('click', () => { S.save('quiz.' + sel.id, {}); S.refresh(); });
      root.querySelectorAll('[data-judge]').forEach((b) => b.addEventListener('click', () => {
        S.save('m.chem', { id: b.dataset.judge, twa: '', stel: '', peak: '', segs: [['', '']] }); S.save('tab.measure', 'chem'); location.hash = '#measure';
      }));
      const tj = root.querySelector('[data-to-jsa]'); if (tj) tj.addEventListener('click', () => {
        const s = S.SOPS.find((x) => x.id === tj.dataset.toJsa);
        S.save('ra.jsa', s.steps.map((st) => ({ step: L(st.s), haz: L(st.h), ctl: L(st.c), own: '' }))); S.save('tab.risk', 'jsa'); location.hash = '#risk';
      });
      const tc = root.querySelector('[data-to-check]'); if (tc) tc.addEventListener('click', () => {
        const s = S.SOPS.find((x) => x.id === tc.dataset.toCheck);
        S.save('ra.check', s.steps.map((st) => ({ item: `${L(st.s)} — ${L(st.c)}`, b: st.b, res: '', note: '' }))); S.save('tab.risk', 'check'); location.hash = '#risk';
      });
    }
  };

  /* 물질 상세 — 표에서 이름을 누르면 옆 서랍에 비고·법정 관리·위험 특성·자료 링크·관련 공정·SOP를 모아 보여 준다 */
  const REGF = [['w', T0('작업환경측정 (별표21)', 'Monitoring (Annex 21)')], ['s', T0('특수건강진단 (별표22)', 'Health check (Annex 22)')], ['m', T0('관리대상 (별표12)', 'Controlled (Annex 12)')], ['x', T0('특별관리물질', 'Specially controlled')], ['p', T0('허가대상', 'Licensed')], ['none', T0('국내 노출기준 없음', 'No Korean limit')]];
  function T0(ko, en) { return { ko, en }; }
  const idlhText = (c) => (c.idlh == null ? '–' : c.idlh + (c.idlhUnit && c.idlhUnit !== c.unit ? ' ' + c.idlhUnit : ''));
  function chemDetail(id) {
    const c = chemById(id); if (!c) return {};
    const procs = S.PROCESSES.filter((p) => c.procs.includes(p.id));
    const sops = S.SOPS.filter((s) => s.chems.includes(c.id));
    const num = (k, v) => `<div><span class="k">${k}</span><span class="v">${v}</span></div>`;
    return {
      eyebrow: T('물질 상세', 'Substance'),
      title: `${L(c)} (${c.f.replace(/<[^>]+>/g, '')})`,
      body: `
        ${S.hasOel(c) ? `<div class="nums">${num('TWA', c.twa ?? '–')}${num('STEL', c.stel ?? '–')}${num('C', c.c ?? '–')}${num('IDLH', idlhText(c))}</div>
          <p class="xs muted">${T('단위', 'Unit')}: ${c.unit}${c.idlhNote ? ` · IDLH: ${c.idlhNote}` : ''} · ${T('국내 노출기준', 'Korean limits')}${S.cite('moelOel')} · IDLH${S.cite('nioshIdlh')}</p>`
          : `<div class="callout warn small">${T('국내 노출기준(고시 별표1)에 없는 물질입니다. 안전하다는 뜻이 아니므로 질식·화재·부식 위험은 ICSC와 MSDS로 확인하세요.', 'Not in the Korean exposure-limit annex. That does not mean safe — check asphyxiation, fire and corrosion hazards in the ICSC and MSDS.')}${c.idlh != null ? ` IDLH ${idlhText(c)}${S.cite('nioshIdlh')}` : ''}</div>`}
        <dl class="kv">
          <dt>CAS</dt><dd class="num">${c.cas}</dd>
          <dt>${T('분류', 'Group')}</dt><dd>${L(S.CHEM_CATS[c.cat])}</dd>
          ${L(c.note) ? `<dt>${T('비고', 'Notes')}</dt><dd>${S.esc(L(c.note))}</dd>` : ''}
          <dt>${T('법정 관리', 'Statutory status')}</dt><dd>${S.regChips(c)}${S.cite('lawRule', 'lawStd', 'lawDecree')}</dd>
          ${S.HPG[c.id] ? `<dt>${T('고압가스법', 'HP Gas Act')}</dt><dd>${T('특정고압가스', 'Specified high-pressure gas')} — ${S.esc(L(S.HPG[c.id]))}</dd>` : ''}
          ${c.icsc ? `<dt>${T('위험 특성', 'Hazard notes')}</dt><dd style="color:var(--warn)">${L(c.icsc)}${S.cite('icsc')}</dd>` : ''}
          ${S.chemLinks(c) ? `<dt>${T('자료', 'Data sheets')}</dt><dd>${S.chemLinks(c)}</dd>` : ''}
          ${procs.length ? `<dt>${T('관련 공정', 'Processes')}</dt><dd>${procs.map((p) => S.esc(L(p))).join(' · ')}${S.cite('oshaSemi')}</dd>` : ''}
          ${sops.length ? `<dt>SOP</dt><dd>${sops.map((s) => `<a href="#sop/${s.id}">${S.esc(L(s.t))}</a>`).join('<br>')}</dd>` : ''}
        </dl>`,
      foot: S.hasOel(c) ? `<button class="btn sm" type="button" data-judge="${c.id}">${T('이 물질로 수치 판정', 'Check a reading for this substance')} →</button>` : `<span class="xs muted">${T('노출기준이 없어 수치 판정 대상이 아닙니다', 'No limit, so no reading check')}</span>`,
      mount(dr) { const b = dr.querySelector('[data-judge]'); if (b) b.addEventListener('click', () => { S.save('m.chem', { id: b.dataset.judge, twa: '', stel: '', peak: '', segs: [['', '']] }); S.save('tab.measure', 'chem'); location.hash = '#measure'; }); }
    };
  }
  S.chemDetail = (id) => S.detail.open(() => chemDetail(id));

  S.pages.hazards = {
    render(sub) {
      /* #hazards/<물질 id>로 들어오면 물질 탭에서 그 물질만 보이게 한다 */
      const direct = sub && chemById(sub);
      if (direct && !S.state.refreshing) { S.save('tab.hz', 'chem'); S.save('lb.hz', { q: direct.cas }); }
      const tab = S.tab('hz', 'chem');
      const catN = {}; S.CHEMICALS.forEach((c) => { catN[c.cat] = (catN[c.cat] || 0) + 1; });
      const rgOf = (c) => ((c.rg || '').split('').filter((k) => 'wsmxp'.includes(k)).concat(S.hasOel(c) ? [] : ['none'])).join(' ');
      const rgN = {}; S.CHEMICALS.forEach((c) => rgOf(c).split(' ').filter(Boolean).forEach((k) => { rgN[k] = (rgN[k] || 0) + 1; }));
      return `
      ${ui.head(T('라이브러리', 'Library'), T('공정·물질 위험', 'Process & chemical hazards'),
        T('주요 물질의 국내 노출기준·IDLH와 공정 단계별 유해위험을 찾아봅니다.', 'Find exposure limits and IDLH values for key substances, and hazards by process step.'),
        T('물질 이름을 누르면 비고·법정 관리 구분·위험 특성·ICSC·MSDS·관련 공정과 SOP가 옆 창에 열리고, 거기서 바로 수치 판정으로 이어집니다. 공정 단계별 유해위험은 미국 OSHA 정리를 따릅니다.', 'Click a substance name to open its notes, statutory status, hazard notes, ICSC and MSDS links, processes and SOPs in a side panel, and go straight to a reading check. Hazards by process step follow the US OSHA compilation.'))}
      ${ui.tabs('hz', [{ id: 'chem', label: T(`물질 ${S.CHEMICALS.length}`, `Substances ${S.CHEMICALS.length}`) }, { id: 'proc', label: T(`공정 단계 ${S.PROCESSES.length}`, `Process steps ${S.PROCESSES.length}`) }], tab)}
      ${tab === 'proc' ? `
      <section class="grid g2" style="align-items:center">
        ${S.photo('cleanroom')}
        <div class="stack"><p>${T('웨이퍼는 클린룸에서 산화·세정·포토·식각·감광액 제거·도핑·증착 공정을 거칩니다. 공정마다 쓰는 가스·약품과 에너지가 달라 유해위험도 다릅니다.', 'In the cleanroom a wafer goes through oxidation, cleaning, photolithography, etching, resist stripping, doping and deposition. Each step uses different gases, chemicals and energy, so the hazards differ too.')}</p>
          <p class="small muted">${T('아래는 미국 OSHA 정리 기준입니다. 실제 공정은 사업장마다 다르므로 출발점으로만 쓰세요.', 'The cards below follow OSHA’s compilation. Real processes differ by site, so use them only as a starting point.')}${S.cite('oshaSemi')}</p></div>
      </section>
      <section class="proc-cards">${S.PROCESSES.map((p) => `<article class="panel stack" style="gap:10px">
          <h3 style="font-size:calc(17px * var(--fz))">${L(p)}</h3>
          <p class="small">${L(p.d)}</p>
          <ul class="facts">${L(p.hz).map((h) => `<li>${h}</li>`).join('')}</ul>
          <div class="row" style="gap:6px">${S.CHEMICALS.filter((c) => c.procs.includes(p.id)).map((c) => `<button type="button" class="chip" data-chem="${c.id}" title="${S.esc(L(c))}">${c.f}</button>`).join('')}</div>
          ${p.sops.length ? `<div class="small">SOP · ${p.sops.map((id) => `<a href="#sop/${id}">${L(S.SOPS.find((s) => s.id === id).t)}</a>`).join(' · ')}</div>` : ''}
        </article>`).join('')}</section>
      <p class="xs muted">${T('OSHA는 “실제 공정은 사업장마다 다르며, 유해위험 목록은 실제 공정의 위험 분석에 근거해야 한다”고 명시합니다. 이 표는 출발점일 뿐입니다.', 'OSHA notes that actual processes vary by facility and a complete hazard inventory must come from analysing the real process. Treat this table as a starting point.')}</p>` : `
      <section class="panel stack">
        ${S.listbar({ id: 'hz', ph: T('물질명·화학식·CAS로 찾기 — 예: 불소, NF3, 7664-39-3', 'Search by name, formula or CAS — e.g. fluorine, NF3, 7664-39-3'), total: S.CHEMICALS.length,
          facets: [{ key: 'c', label: T('분류', 'Group'), opts: Object.keys(S.CHEM_CATS).filter((k) => catN[k]).map((k) => ({ id: k, label: L(S.CHEM_CATS[k]), n: catN[k] })) },
            { key: 'rg', label: T('법정 관리', 'Statutory'), opts: REGF.filter(([k]) => rgN[k]).map(([k, l]) => ({ id: k, label: L(l), n: rgN[k] })) }] })}
        <div class="table-wrap"><table class="data compact"><thead><tr><th>${T('물질', 'Substance')}</th><th class="n">TWA</th><th class="n">STEL</th><th class="n">C</th><th>${T('단위', 'Unit')}</th><th class="n">IDLH</th><th></th></tr></thead><tbody>
          ${S.CHEMICALS.map((c) => `<tr id="anchor-${c.id}" data-li="${S.esc([c.id, c.ko, c.en, c.f.replace(/<[^>]+>/g, ''), c.cas].join(' '))}" data-f-c="${c.cat}" data-f-rg="${rgOf(c)}">
            <td style="min-width:12em"><button type="button" class="link-btn" data-chem="${c.id}">${S.esc(L(c))}</button>
              <div class="xs muted">${c.f} · CAS ${c.cas}${(c.rg || '').includes('x') ? ` · <b style="color:var(--bad)">${T('특별관리', 'Specially controlled')}</b>` : ''}${(c.rg || '').includes('p') ? ` · <b style="color:var(--bad)">${T('허가대상', 'Licensed')}</b>` : ''}${S.HPG[c.id] ? ` · ${T('특정고압가스', 'Specified HP gas')}` : ''}</div></td>
            <td class="n">${c.twa ?? '–'}</td><td class="n">${c.stel ?? '–'}</td><td class="n">${c.c ?? '–'}</td><td class="small">${S.hasOel(c) ? c.unit : `<span class="muted">${T('기준 없음', 'No limit')}</span>`}</td>
            <td class="n">${idlhText(c)}</td>
            <td class="nowrap">${S.hasOel(c) ? `<button class="btn ghost sm" type="button" data-judge="${c.id}">${T('판정', 'Check')}</button>` : ''}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="lb-empty" data-lb-empty hidden>${T('조건에 맞는 물질이 없습니다. 영문명·화학식·CAS 번호로도 찾아보세요.', 'No substances match. Try the English name, formula or CAS number.')}</p>
        <p class="xs muted">${T('국내 노출기준', 'Korean limits')}: ${S.cite('moelOel')} · IDLH: ${S.cite('nioshIdlh')} · ${T('위험 특성', 'Hazard notes')}: ${S.cite('icsc')} · ${T('법정 관리 구분', 'Statutory status')}: ${S.cite('lawRule', 'lawStd', 'lawDecree')} · MSDS: ${S.cite('koshaMsds')} · ${T('관련 공정', 'Processes')}: ${S.cite('oshaSemi')}</p>
        <p class="xs muted">${T('IDLH가 ‘–’이면 NIOSH 목록에 없는 물질입니다. 국내 노출기준이 없는 물질(질소·수소·디클로로실란 등)은 고시 별표1에 없다는 뜻이지 안전하다는 뜻이 아닙니다 — 질식·화재·부식 위험은 ICSC와 MSDS로 확인하고, 수치 판정·호흡보호구 선정 목록에서는 뺐습니다. ICSC 링크는 고용노동부·산업안전보건공단이 번역한 한국어판으로 열립니다.', 'A dash for IDLH means the substance is not on the NIOSH list. “No Korean limit” (nitrogen, hydrogen, dichlorosilane, etc.) means it is not in Annex 1, not that it is safe — check asphyxiation, fire and corrosion hazards in the ICSC and MSDS; these substances are left out of the measurement and respirator tools. ICSC links open the Korean edition translated by MOEL and KOSHA in Korean mode.')}</p>
      </section>`}`;
    },
    mount(root) {
      S.listFilter(root, 'hz');
      root.querySelectorAll('[data-chem]').forEach((b) => b.addEventListener('click', () => S.chemDetail(b.dataset.chem)));
      root.querySelectorAll('[data-judge]').forEach((b) => b.addEventListener('click', () => {
        S.save('m.chem', { id: b.dataset.judge, twa: '', stel: '', peak: '', segs: [['', '']] }); S.save('tab.measure', 'chem'); location.hash = '#measure';
      }));
    }
  };
})();

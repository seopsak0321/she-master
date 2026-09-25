/* 라이브러리 — SOP·작업 안전, 공정·물질 위험 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui;
  const chemById = (id) => S.CHEMICALS.find((c) => c.id === id);
  const lvl = (l) => l === 'A' ? ui.pill('bad', T('고위험', 'High risk')) : ui.pill('warn', T('중위험', 'Medium risk'));

  function sopDetail(s) {
    const quizState = S.load('quiz.' + s.id, {});
    const answered = s.quiz.filter((q, i) => quizState[i] != null).length;
    const correct = s.quiz.filter((q, i) => Number(quizState[i]) === q.a).length;
    return `
    <section class="panel stack" id="sop-detail">
      <div class="row" style="justify-content:space-between">
        <div class="stack" style="gap:4px"><h2 style="font-size:22px">${L(s.t)}</h2><span class="small muted">${L(s.area)}</span></div>
        <div class="row">${lvl(s.level)}${s.permits.map((p) => `<span class="chip">${L(S.PERMITS[p])}</span>`).join('')}</div>
      </div>
      <div class="callout ex small">${T('교육·포트폴리오용 표준 절차 예시입니다. SK하이닉스 사내 SOP가 아니며, 각 단계의 근거를 “법(조문)·지침·관행”으로 구분해 표시했습니다.', 'A teaching example, not an SK hynix internal SOP. Each step shows its basis: law (article), guide, or common practice.')}</div>
      ${(() => { const rel = (S.CASES || []).filter((c) => (c.sops || []).includes(s.id)); return rel.length ? `<div class="callout warn small"><b>${T('이 작업과 관련된 실제 사고사례', 'Real incidents linked to this job')}</b> — ${rel.map((c) => `<a href="#cases/${c.id}">${S.esc(L(c.dateLabel))} ${S.esc(L(c.t))}</a>`).join(' · ')}</div>` : ''; })()}
      <div class="grid g2">
        <div><b class="small">${T('주요 유해·위험요인', 'Key hazards')}</b><ul class="facts" style="margin-top:6px">${L(s.hz).map((h) => `<li>${h}</li>`).join('')}</ul></div>
        <div><b class="small">${T('법령·지침 근거', 'Legal & guidance basis')}</b><ul class="facts" style="margin-top:6px">${s.legal.map((g) => `<li>${L(g)}</li>`).join('')}</ul><p class="xs muted">${S.cite(s.src)} · KOSHA ${s.kosha.map((k) => S.koshaTag(k)).join(' ')}</p></div>
      </div>
      ${(s.edu || []).length ? `<div class="small"><b>${T('관련될 수 있는 특별교육 (시행규칙 별표5 제1호라목)', 'Special training that may apply (Rule Annex 5, 1-d)')}</b>
        <ul class="clean" style="margin-top:4px">${s.edu.map((no) => `<li><span class="chip">${T(`제${no}호`, `No. ${no}`)}</span> ${L(S.SPECIAL_EDU[no])}</li>`).join('')}</ul>
        <p class="xs muted">${T('해당하면 16시간 이상(최초 작업 전 4시간 이상, 나머지는 3개월 안에 나눠서), 단기간·간헐적 작업은 2시간 이상. 해당 여부는 실제 작업 조건으로 판단합니다.', 'If it applies: 16 h or more (4 h before the first task, the rest within 3 months), or 2 h for short or intermittent work. Whether it applies depends on the actual job.')}${S.cite('lawRule')}</p></div>` : ''}
      ${s.chems.length ? `<div class="small"><b>${T('관련 물질 노출기준', 'Related exposure limits')}</b>
        <div class="table-wrap" style="margin-top:6px"><table class="data"><thead><tr><th>${T('물질', 'Substance')}</th><th class="n">TWA</th><th class="n">STEL</th><th class="n">C</th><th class="n">IDLH</th><th></th></tr></thead><tbody>
        ${s.chems.map((id) => { const c = chemById(id); return `<tr><td>${S.esc(L(c))} <span class="muted">${c.f}</span></td><td class="n">${c.twa ?? '–'}</td><td class="n">${c.stel ?? '–'}</td><td class="n">${c.c ?? '–'}</td><td class="n">${c.idlh ?? '–'}</td><td><button class="btn ghost sm" type="button" data-judge="${c.id}">${T('판정', 'Check')}</button></td></tr>`; }).join('')}
        </tbody></table></div><p class="xs muted">${T('단위', 'Units')}: ppm ${T('또는', 'or')} mg/m³ · ${S.cite('moelOel', 'nioshIdlh')}</p></div>` : ''}
    </section>

    <section class="grid g3">
      <div class="panel span2">${ui.title(T('단계별 절차 (JSA)', 'Step-by-step (JSA)'))}
        <div class="steps">${s.steps.map((st, i) => `<div class="step"><span class="no">${i + 1}</span><div class="body">
          <div class="row" style="justify-content:space-between"><b>${L(st.s)}</b>${ui.basis(st.b)}</div>
          <div class="hc"><span class="small"><span class="muted">${T('위험', 'Hazard')}</span> ${L(st.h)}</span><span class="small"><span class="muted">${T('대책', 'Control')}</span> ${L(st.c)}</span></div>
        </div></div>`).join('')}</div>
        <div class="row" style="margin-top:10px"><button class="btn ghost sm" type="button" data-to-jsa="${s.id}">${T('위험성평가(JSA)로 보내기', 'Send to risk assessment (JSA)')}</button><button class="btn ghost sm" type="button" data-to-check="${s.id}">${T('체크리스트로 점검하기', 'Check as a checklist')}</button>${S.printLink('sop/' + s.id, T('SOP 인쇄 (교육 확인란 포함)', 'Print SOP (with training sign-off)'))}<a class="btn sm" href="#ptw/new/${s.id}">${T('이 작업으로 작업허가서 작성', 'Start a permit for this job')} →</a></div>
      </div>
      <div class="stack">
        <div class="panel"><div class="section-title"><h2 style="color:var(--bad)">${T('작업 중지 기준', 'Stop work if…')}</h2></div><ul class="facts" style="margin-top:8px">${L(s.stop).map((x) => `<li>${x}</li>`).join('')}</ul></div>
        <div class="panel">${ui.title(T('비상 시 행동', 'In an emergency'))}<ul class="facts">${L(s.emer).map((x) => `<li>${x}</li>`).join('')}</ul></div>
      </div>
    </section>

    <section class="grid g2">
      <div class="card5" id="anchor-card">
        <div class="row" style="justify-content:space-between"><h3 style="font-size:18px">${T('작업 전 5분 안전카드', '5-minute pre-job card')}</h3><span class="row" style="gap:6px"><span class="chip">${T('협력사·현장용', 'For contractors & field crews')}</span>${S.printLink('card/' + s.id, T('카드 인쇄', 'Print card'))}${S.printLink('card/' + s.id + '/both', T('한·영 병기 인쇄', 'Print KO + EN'))}</span></div>
        <p style="font-weight:600">${L(s.t)}</p>
        <div class="cols">
          <div class="do"><h4>✓ ${T('이렇게 하세요', 'Do')}</h4><ul>${L(s.card.do).map((x) => `<li>${x}</li>`).join('')}</ul></div>
          <div class="dont"><h4>✕ ${T('절대 하지 마세요', 'Never')}</h4><ul>${L(s.card.dont).map((x) => `<li>${x}</li>`).join('')}</ul></div>
        </div>
        <p class="small" style="border-top:1px solid var(--line);padding-top:8px"><b>${T('이상하면 멈추고 알리세요.', 'If something seems wrong, stop and tell someone.')}</b> ${T('상단 EN 버튼으로 영어 카드를 볼 수 있습니다.', 'Use the KO button at the top for the Korean card.')}</p>
      </div>
      <div class="panel">${ui.title(T('SOP 이해도 확인', 'SOP check-up quiz'), T(`${answered}/${s.quiz.length} 응답 · ${correct} 정답`, `${answered}/${s.quiz.length} answered · ${correct} correct`))}
        ${s.quiz.map((q, i) => { const a = quizState[i]; return `<fieldset class="quiz-q" style="border:0;margin:0;padding-inline:0"><legend class="small" style="font-weight:600;padding:0">${i + 1}. ${L(q.q)}</legend>
          ${q.o.map((o, j) => `<label><input type="radio" name="q${i}" data-quiz="${i}" value="${j}" ${String(a) === String(j) ? 'checked' : ''}> ${L(o)} ${a != null && j === q.a ? ui.pill('ok', T('정답', 'Correct')) : ''}${String(a) === String(j) && j !== q.a ? ui.pill('bad', T('다시 보기', 'Review')) : ''}</label>`).join('')}</fieldset>`; }).join('')}
        <button class="btn ghost sm" type="button" data-quiz-reset="${s.id}">${T('다시 풀기', 'Retake')}</button>
      </div>
    </section>`;
  }

  S.pages.sop = {
    render(sub) {
      const filter = S.tab('sopf', 'all');
      const list = S.SOPS.filter((s) => filter === 'all' || s.permits.includes(filter));
      const sel = S.SOPS.find((s) => s.id === sub) || S.SOPS.find((s) => s.id === S.load('sop.sel', 'confined')) || S.SOPS[0];
      return `
      ${ui.head(T('라이브러리', 'Library'), T('SOP·작업 안전', 'SOPs & job safety'),
        T(`반도체 사업장의 대표 고위험 작업 ${S.SOPS.length}종을 법령 조문·KOSHA 지침·해외 규제기관 자료로 재구성했습니다. 안전관리자용 절차(JSA)와 협력사 작업자용 5분 카드를 한 화면에 둡니다.`, `${S.SOPS.length} representative high-risk fab jobs rebuilt from statutes, KOSHA guides and foreign regulators. The manager’s JSA and the contractor’s 5-minute card sit on the same page.`))}
      ${ui.tabs('sopf', [{ id: 'all', label: T('전체', 'All') }].concat(Object.keys(S.PERMITS).map((p) => ({ id: p, label: L(S.PERMITS[p]) }))), filter)}
      <div class="sop-grid">${list.map((s) => `<a class="sop-card" href="#sop/${s.id}" ${s.id === sel.id ? 'aria-current="true"' : ''} style="text-decoration:none">
        <div class="row" style="justify-content:space-between">${lvl(s.level)}<span class="xs muted">${s.steps.length} ${T('단계', 'steps')}</span></div>
        <h3>${L(s.t)}</h3><span class="small muted">${L(s.area)}</span>
        <div class="row">${s.permits.map((p) => `<span class="chip">${L(S.PERMITS[p])}</span>`).join('')}</div></a>`).join('')}</div>
      ${sopDetail(sel)}`;
    },
    mount(root, sub) {
      const sel = S.SOPS.find((s) => s.id === sub) || S.SOPS.find((s) => s.id === S.load('sop.sel', 'confined')) || S.SOPS[0];
      S.save('sop.sel', sel.id);
      if (sub && !S.state.refreshing) setTimeout(() => { const d = root.querySelector('#sop-detail'); if (d) d.scrollIntoView({ block: 'start' }); }, 0);
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

  S.pages.hazards = {
    render() {
      const cat = S.tab('hzc', 'all');
      const q = S.load('hz.q', '');
      const rgf = S.load('hz.rg', '');
      const rgOk = (c) => !rgf || (rgf === 'none' ? !S.hasOel(c) : (c.rg || '').includes(rgf));
      const chems = S.CHEMICALS.filter((c) => (cat === 'all' || c.cat === cat) && rgOk(c) && (!q || (c.ko + c.en + c.f + c.cas).toLowerCase().includes(q.toLowerCase())));
      return `
      ${ui.head(T('라이브러리', 'Library'), T('공정·물질 위험', 'Process & chemical hazards'),
        T('반도체 공정 단계별 유해위험(미국 OSHA 정리)과 주요 물질의 국내 노출기준·NIOSH IDLH를 한 곳에서 봅니다. 물질을 누르면 바로 수치 판정으로 이어집니다.', 'Hazards by semiconductor process step (as compiled by US OSHA) and Korean exposure limits with NIOSH IDLH values for key substances. Tap a substance to check a reading.'))}
      <section class="panel">${ui.title(T('공정 단계별 유해위험', 'Hazards by process step'), S.cite('oshaSemi'))}
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('공정', 'Process')}</th><th>${T('개요', 'What happens')}</th><th>${T('유해위험', 'Hazards')}</th><th>${T('관련 물질', 'Substances')}</th><th>SOP</th></tr></thead><tbody>
          ${S.PROCESSES.map((p) => `<tr><td><b>${L(p)}</b></td><td class="small">${L(p.d)}</td><td class="small"><ul class="clean">${L(p.hz).map((h) => `<li>${h}</li>`).join('')}</ul></td>
            <td class="small">${S.CHEMICALS.filter((c) => c.procs.includes(p.id)).map((c) => `<span class="chip">${c.f}</span>`).join(' ')}</td>
            <td class="small">${p.sops.map((id) => `<a href="#sop/${id}">${L(S.SOPS.find((s) => s.id === id).t)}</a>`).join('<br>')}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="xs muted" style="margin-top:8px">${T('OSHA는 “실제 공정은 사업장마다 다르며, 유해위험 목록은 실제 공정의 위험 분석에 근거해야 한다”고 명시합니다. 이 표는 출발점일 뿐입니다.', 'OSHA notes that actual processes vary by facility and a complete hazard inventory must come from analysing the real process. Treat this table as a starting point.')}</p>
      </section>
      <section class="panel stack">
        ${ui.title(T('물질 데이터베이스', 'Substance database'), `${chems.length} / ${S.CHEMICALS.length}`)}
        ${ui.tabs('hzc', [{ id: 'all', label: T('전체', 'All') }].concat(Object.keys(S.CHEM_CATS).map((c) => ({ id: c, label: L(S.CHEM_CATS[c]) }))), cat)}
        <div class="form-grid">
          <div class="field"><label for="hz-q">${T('검색 (물질명·화학식·CAS)', 'Search (name, formula, CAS)')}</label><input type="text" id="hz-q" value="${S.esc(q)}"></div>
          <div class="field"><label for="hz-rg">${T('법정 관리 구분', 'Statutory status')}</label><select id="hz-rg">${[['', T('전체', 'All')], ['w', T('작업환경측정 대상 (별표21)', 'Monitoring agents (Annex 21)')], ['s', T('특수건강진단 대상 (별표22)', 'Health-check agents (Annex 22)')], ['m', T('관리대상 유해물질 (별표12)', 'Controlled substances (Annex 12)')], ['x', T('특별관리물질', 'Specially controlled')], ['p', T('허가대상 유해물질', 'Licensed substances')], ['none', T('국내 노출기준 없음', 'No Korean limit')]].map(([v, l]) => `<option value="${v}" ${rgf === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        </div>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('물질', 'Substance')}</th><th>${T('화학식', 'Formula')}</th><th>CAS</th><th class="n">TWA</th><th class="n">STEL</th><th class="n">C</th><th>${T('단위', 'Unit')}</th><th class="n">IDLH</th><th>${T('비고·법정 관리·자료', 'Notes, status, data sheets')}</th><th></th></tr></thead><tbody>
          ${chems.map((c) => `<tr><td><b>${S.esc(L(c))}</b></td><td>${c.f}</td><td class="n">${c.cas}</td><td class="n">${c.twa ?? '–'}</td><td class="n">${c.stel ?? '–'}</td><td class="n">${c.c ?? '–'}</td><td class="small">${S.hasOel(c) ? c.unit : ''}</td>
            <td class="n">${c.idlh == null ? '–' : c.idlh + ' ' + (c.idlhUnit === c.unit ? '' : c.idlhUnit)}${c.idlhNote ? `<div class="xs muted">${c.idlhNote}</div>` : ''}</td>
            <td class="small">${S.esc(L(c.note) || '')}${S.HPG[c.id] ? ` <span class="chip" title="${S.esc(T('고압가스 안전관리법 특정고압가스 — ', 'Specified high-pressure gas — ') + L(S.HPG[c.id]))}">${T('특정고압가스', 'Specified HP gas')}</span>` : ''}
              <div class="xs" style="margin-top:4px">${S.regChips(c)}</div>${S.chemLinks(c) ? `<div class="xs">${S.chemLinks(c)}</div>` : ''}${c.icsc ? `<div class="xs" style="color:var(--warn)">${L(c.icsc)}</div>` : ''}</td>
            <td>${S.hasOel(c) ? `<button class="btn ghost sm" type="button" data-judge="${c.id}">${T('판정', 'Check')}</button>` : `<span class="xs muted">${T('기준 없음', 'No limit')}</span>`}</td></tr>`).join('') || `<tr><td colspan="10" class="small muted">${T('조건에 맞는 물질이 없습니다', 'No substances match')}</td></tr>`}
        </tbody></table></div>
        <p class="xs muted">${T('국내 노출기준', 'Korean limits')}: ${S.cite('moelOel')} · IDLH: ${S.cite('nioshIdlh')} · ${T('위험 특성', 'Hazard notes')}: ${S.cite('icsc')} · ${T('법정 관리 구분', 'Statutory status')}: ${S.cite('lawRule', 'lawStd', 'lawDecree')} · MSDS: ${S.cite('koshaMsds')} · ${T('관련 공정', 'Processes')}: ${S.cite('oshaSemi')}</p>
        <p class="xs muted">${T('IDLH가 ‘–’이면 NIOSH 목록에 없는 물질입니다. 국내 노출기준이 없는 물질(질소·수소·디클로로실란 등)은 고시 별표1에 없다는 뜻이지 안전하다는 뜻이 아닙니다 — 질식·화재·부식 위험은 ICSC와 MSDS로 확인하고, 수치 판정·호흡보호구 선정 목록에서는 뺐습니다. ICSC 링크는 고용노동부·산업안전보건공단이 번역한 한국어판으로 열립니다.', 'A dash for IDLH means the substance is not on the NIOSH list. “No Korean limit” (nitrogen, hydrogen, dichlorosilane, etc.) means it is not in Annex 1, not that it is safe — check asphyxiation, fire and corrosion hazards in the ICSC and MSDS; these substances are left out of the measurement and respirator tools. ICSC links open the Korean edition translated by MOEL and KOSHA in Korean mode.')}</p>
      </section>`;
    },
    mount(root) {
      const q = root.querySelector('#hz-q');
      q.addEventListener('change', () => { S.save('hz.q', q.value); S.refresh(); });
      const rg = root.querySelector('#hz-rg'); if (rg) rg.addEventListener('change', () => { S.save('hz.rg', rg.value); S.refresh(); });
      root.querySelectorAll('[data-judge]').forEach((b) => b.addEventListener('click', () => {
        S.save('m.chem', { id: b.dataset.judge, twa: '', stel: '', peak: '', segs: [['', '']] }); S.save('tab.measure', 'chem'); location.hash = '#measure';
      }));
    }
  };
})();

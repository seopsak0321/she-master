/* 업데이트 현황(패치노트) — 공개 업데이트마다 추가·보완·수정한 내용, 콘텐츠 규모 변화, 공개 전 개발 기록 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui;
  const REPO = 'https://github.com/seopsak0321/she-master';
  const list = () => S.UPDATES || [];
  /* 바닥글·업데이트 현황이 함께 쓰는 요약 */
  S.buildInfo = function () {
    const u = list();
    return { v: S.BUILD || '', n: u.length, last: u[0] ? String(u[0].date).slice(0, 10) : '', first: u.length ? String(u[u.length - 1].date).slice(0, 10) : '' };
  };
  /* 지금 데이터에서 바로 세는 규모 (패치노트의 과거 수치와 나란히 보여 준다) */
  const live = () => [
    { k: T('물질', 'Substances'), n: (S.CHEMICALS || []).length },
    { k: 'SOP', n: (S.SOPS || []).length },
    { k: T('출처', 'Sources'), n: (S.SOURCES || []).length },
    { k: T('자료실 사이트', 'Library sites'), n: (S.RESOURCES || []).length },
    { k: T('공정 단계', 'Process steps'), n: (S.PROCESSES || []).length },
    { k: T('사고사례', 'Incident cases'), n: (S.CASES || []).length },
    { k: T('용어', 'Glossary terms'), n: (S.GLOSSARY || []).length }
  ];
  const KINDS = () => [['add', T('추가', 'Added'), 'ok'], ['chg', T('보완·반영', 'Improved'), 'info'], ['fix', T('고침', 'Fixed'), 'warn']];

  function entry(u, i) {
    const latest = i === 0;
    const counts = KINDS().map(([k, l]) => (u[k] && u[k].length ? `${l} ${u[k].length}` : '')).filter(Boolean).join(' · ');
    const body = KINDS().filter(([k]) => u[k] && u[k].length).map(([k, l, tone]) =>
      `<div class="upd-kind"><span class="pill ${tone}">${l}</span><ul>${u[k].map((x) => `<li>${L(x)}</li>`).join('')}</ul></div>`).join('');
    const commit = u.commit
      ? `<a class="mono" href="${REPO}/commit/${u.commit}" target="_blank" rel="noopener noreferrer">${u.commit}<span class="sr">${T(' (GitHub 기록, 새 창)', ' (GitHub record, new window)')}</span></a>`
      : `<span class="muted">${T('이번 공개', 'this release')}</span>`;
    return `<details class="upd${latest ? ' latest' : ''}" id="upd-${u.no}" ${i < 3 ? 'open' : ''}>
      <summary><span class="upd-no num">#${u.no}</span><span class="upd-v mono">${S.esc(u.v)}</span><span class="upd-t">${L(u.t)}</span>${latest ? ui.pill('ok', T('현재 버전', 'Current')) : ''}<span class="upd-date num">${S.esc(u.date)}</span></summary>
      <div class="upd-body">${body}
        <p class="xs muted">${counts ? counts + ' · ' : ''}${T('GitHub 기록', 'GitHub record')} ${commit}</p></div>
    </details>`;
  }

  function growth() {
    const g = S.GROWTH || [];
    const now = live();
    return `<div class="grid ${g.length % 3 ? 'g2' : 'g3'} growth">${g.map((m) => {
      const cur = now.find((x) => x.k === L(m.k));
      const pts = m.pts.slice();
      if (cur && cur.n !== pts[pts.length - 1][1]) pts.push([T('지금', 'now'), cur.n]);
      return `<div class="stack" style="gap:6px"><h3 class="chart-t">${L(m.k)}</h3>${ui.bars(pts.map(([v, n], j) => ({ label: `<span class="mono">${S.esc(v)}</span>`, v: n, tone: j === pts.length - 1 ? 'hi' : '' })), { aria: T(`${L(m.k)} 수 변화`, `${L(m.k)} over time`), fmt: (x) => String(x) })}</div>`;
    }).join('')}</div>`;
  }

  S.pages.updates = {
    render() {
      const b = S.buildInfo(), u = list();
      const adds = u.reduce((a, x) => a + (x.add || []).length, 0), fixes = u.reduce((a, x) => a + (x.fix || []).length, 0);
      return `
      ${ui.head(T('포털 정보', 'About this portal'), T('업데이트 현황', 'Update history'),
        T(`지금까지 공개 업데이트 ${b.n}회 — 업데이트마다 무엇을 추가하고 고쳤는지 적은 패치노트입니다.`, `${b.n} public updates so far — patch notes on what each one added and fixed.`),
        T('공개 업데이트는 GitHub 공개 저장소에 반영해 누구나 볼 수 있게 된 시점을 뜻하고, 날짜·시각은 커밋 기록(한국 시간)을 따릅니다. 버전 번호(v)는 브라우저가 새 파일을 받도록 올리는 빌드 번호라 공개 사이에 번호가 건너뛸 수 있습니다. 매 공개 전에 포털 자체 점검(#qa)에서 문제 0건을 확인하고, PC에 날짜별 백업을 남깁니다.',
          'A public update is when the change reached the public GitHub repository; dates and times follow the commit record (Korea time). The version number (v) is a build number raised so browsers fetch new files, so numbers can skip between releases. Before every release the self-check (#qa) must show zero issues and a dated backup is kept on the PC.'))}
      <section class="panel">
        <div class="kpis">
          <div class="kpi"><span class="k">${T('현재 버전', 'Current version')}</span><span class="v">${S.esc(b.v)}</span><span class="d">${T('바닥글에도 표시', 'also shown in the footer')}</span></div>
          <div class="kpi"><span class="k">${T('공개 업데이트', 'Public updates')}</span><span class="v">${b.n}<small>${T('회', '')}</small></span><span class="d">${T(`추가 ${adds}건 · 고침 ${fixes}건`, `${adds} additions · ${fixes} fixes`)}</span></div>
          <div class="kpi"><span class="k">${T('첫 공개', 'First release')}</span><span class="v" style="font-size:calc(20px * var(--fz))">${S.esc(b.first)}</span><span class="d">${T('개발 시작 2026-09-23', 'work began 2026-09-23')}</span></div>
          <div class="kpi"><span class="k">${T('최근 업데이트', 'Latest update')}</span><span class="v" style="font-size:calc(20px * var(--fz))">${S.esc(b.last)}</span><span class="d">${u[0] ? `<button type="button" class="link-btn" data-upd-jump="${u[0].no}">${T('내용 보기', 'See notes')}</button>` : ''}</span></div>
        </div>
      </section>
      <section class="panel">
        ${ui.title(T('콘텐츠 규모 변화', 'How the content grew'), T('버전별 개수 · ‘지금’은 현재 데이터에서 센 값', 'count by version · “now” is counted from the live data'))}
        ${growth()}
        <p class="xs" style="margin-top:10px">${T(`지금 수록 — ${live().map((x) => `${x.k} ${x.n}`).join(' · ')}`, `In the portal now — ${live().map((x) => `${x.k} ${x.n}`).join(' · ')}`)}</p>
      </section>
      <section class="stack" id="upd-list">
        ${ui.title(T('패치노트', 'Patch notes'), T('최신순 · 최근 3개는 펼쳐 둠', 'newest first · latest three open'))}
        ${u.map(entry).join('')}
      </section>
      <section class="panel">
        ${ui.title(T('공개 전 개발 기록', 'Before the first release'), T('2026-09-23 ~ 09-25 · 개발 계획서(ROADMAP)의 단계별 결과 요약', '2026-09-23 to 09-25 · summary of the stage results in the ROADMAP'))}
        <ol class="timeline">${(S.DEV_LOG || []).map((d) => `<li><span class="num">${S.esc(d.d)}</span><span>${L(d.t)}</span></li>`).join('')}</ol>
      </section>`;
    },
    mount(root) {
      root.querySelectorAll('[data-upd-jump]').forEach((a) => a.addEventListener('click', () => {
        const d = root.querySelector('#upd-' + a.dataset.updJump);
        if (d) { d.open = true; d.scrollIntoView({ block: 'start' }); }
      }));
    }
  };
})();

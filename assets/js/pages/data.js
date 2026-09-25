/* 데이터 백업·복원 — 이 브라우저에 저장된 입력값을 JSON 파일로 내보내고 되살린다 */
(function () {
  const S = window.SHE, T = S.T, L = S.L, ui = S.ui;
  const APP = 'SHE Master', FORMAT = 1;
  const KEY_OK = /^[A-Za-z0-9._-]{1,80}$/;
  const MAX_BYTES = 4.5 * 1024 * 1024;

  /* saved keys grouped by the feature that wrote them */
  const GROUPS = [
    [/^tasks$/, { ko: '업무판 — 업무 보드', en: 'Dashboard — task board' }, 'home'],
    [/^cycles(\.days)?$/, { ko: '업무판 — 법정 주기 최근 실시일·주기', en: 'Dashboard — statutory cycle dates and intervals' }, 'home'],
    [/^trn\./, { ko: '교육 이수 관리 — 대상자·교육 기록', en: 'Training records — people and records' }, 'training'],
    [/^psm\./, { ko: '공정안전 — PSM 현황·MOC·규정량·가스 판정', en: 'Process safety — PSM board, MOC, thresholds, gas check' }, 'psm'],
    [/^prev\./, { ko: '예방안전 — 조사 기록·TBM·보고 판정', en: 'Preventive safety — investigations, TBM, reporting check' }, 'prevent'],
    [/^sdx\./, { ko: 'SDX — 순찰 이벤트·과제', en: 'SDX — patrol events, pipeline' }, 'sdx'],
    [/^pt\./, { ko: '상생협력 — 의무 체크·도급승인·협력사 평가', en: 'Partnership — duties, approval check, scorecard' }, 'partner'],
    [/^fire\./, { ko: '소방·방재 — 등급·점검 일정·훈련 기록', en: 'Fire — grade, inspection schedule, drill log' }, 'fire'],
    [/^cul\./, { ko: '안전문화 — KPI 계산기', en: 'Culture — KPI calculator' }, 'culture'],
    [/^(cases\.user|case\.st\..+|moelck)$/, { ko: '사고사례 — 내 사례·대책 진행·자가점검', en: 'Incidents — my cases, measures, self-check' }, 'cases'],
    [/^ra\./, { ko: '위험성평가 워크벤치', en: 'Risk assessment workbench' }, 'risk'],
    [/^m\./, { ko: '수치 판정 입력값', en: 'Measurement-check inputs' }, 'measure'],
    [/^ptw\.(list|audit)$/, { ko: '작업허가서 — 허가서·모니터링 기록·절차 평가', en: 'Permits to work — permits, monitoring records, system audit' }, 'ptw'],
    [/^gas\./, { ko: '가스 안전 도구 입력값', en: 'Gas-tool inputs' }, 'gas'],
    [/^ppe$/, { ko: '호흡보호구 선정 입력값', en: 'Respirator-selection inputs' }, 'ppe'],
    [/^quiz\./, { ko: 'SOP 퀴즈 응답', en: 'SOP quiz answers' }, 'sop'],
    [/^lawchk$/, { ko: '출처·검증 — 법령 변경 점검 기록', en: 'Sources — law-change check log' }, 'sources']
  ];
  const PREFS = { ko: '화면 설정 — 언어·사업장·탭·검색 기록', en: 'Screen settings — language, site, tabs, search history' };
  const OTHER = { ko: '기타', en: 'Other' };
  const groupOf = (k) => {
    if (S.PREF_KEYS.test(k)) return { id: 'prefs', label: PREFS, order: 99 };
    const i = GROUPS.findIndex(([re]) => re.test(k));
    return i >= 0 ? { id: 'g' + i, label: GROUPS[i][1], route: GROUPS[i][2], order: i } : { id: 'other', label: OTHER, order: 98 };
  };
  /* feature groups in menu order, screen settings last */
  const summarize = (keys) => {
    const map = new Map();
    keys.forEach((k) => { const g = groupOf(k); const cur = map.get(g.id) || { label: g.label, route: g.route, n: 0, order: g.order }; cur.n++; map.set(g.id, cur); });
    return [...map.values()].sort((a, b) => a.order - b.order);
  };
  const bytesOf = (keys) => keys.reduce((a, k) => { try { return a + (localStorage.getItem(S.NS + k) || '').length * 2; } catch (e) { return a; } }, 0);
  const kb = (b) => S.fmt(b / 1024, 1) + ' KB';
  const localTime = (iso) => { const d = new Date(iso); return iso && !isNaN(d) ? S.iso(d) + ' ' + d.toTimeString().slice(0, 5) : ''; };

  let pending = null;   /* the backup file chosen for restore: { ok, error, name, data, exported, skipped } */

  /* 4단계 — 기능별로 골라 내보내기(인계·전달용). 전체 백업과 같은 형식이라 ‘백업 파일에서 복원’으로 받는다 */
  const groupKeys = (keys) => {
    const m = new Map();
    keys.forEach((k) => { const g = groupOf(k); const cur = m.get(g.id) || { id: g.id, label: g.label, order: g.order, keys: [] }; cur.keys.push(k); m.set(g.id, cur); });
    return [...m.values()].sort((a, b) => a.order - b.order);
  };
  let partSel = null;   /* 고른 기능 id 집합 — null이면 화면 설정을 뺀 전부 */
  const selected = (gs) => partSel || new Set(gs.filter((g) => g.id !== 'prefs').map((g) => g.id));
  function exportPart() {
    const gs = groupKeys(S.storedKeys()), sel = selected(gs);
    const pick = gs.filter((g) => sel.has(g.id)), data = {};
    pick.forEach((g) => g.keys.forEach((k) => { try { data[k] = JSON.parse(localStorage.getItem(S.NS + k)); } catch (e) { /* skip unreadable */ } }));
    if (!Object.keys(data).length) { S.toast(T('내보낼 기능을 하나 이상 고르세요', 'Choose at least one feature')); return; }
    const now = new Date();
    const file = { app: APP, format: FORMAT, exported: now.toISOString(), lang: S.state.lang, part: pick.map((g) => L(g.label)), keys: Object.keys(data).length, data };
    S.download(`SHE-Master-part-${S.iso(now)}.json`, JSON.stringify(file, null, 2), 'application/json;charset=utf-8');
    S.toast(T(`${pick.length}개 기능을 내려받았습니다`, `Exported ${pick.length} features`));
  }

  /* 데이터 사전 — 저장 키, 내용, 같은 내용을 업무 기록으로 남길 때의 법정 보존기간(원문 확인 2026-09-25) */
  const DICT = () => [
    ['tasks', T('업무 보드 — 할 일·담당·기한', 'Task board — tasks, owners, due dates'), ''],
    ['cycles, cycles.days', T('법정 주기 — 최근 실시일·주기 선택', 'Statutory cycles — last done and chosen interval'), T('실시 결과 서류는 각 법령 기준 (예: 작업환경측정 결과 5년, 발암성 등 고시 물질 30년 — 시행규칙 제241조①)', 'Result documents follow each law (e.g. monitoring results 5 years, 30 for listed carcinogens — Rule Art. 241(1))')],
    ['trn.*', T('교육 이수 — 대상자(이름·소속·입사일)·교육 기록 · 개인정보 포함', 'Training — people (name, team, hire date) and records · personal data'), ''],
    ['prev.*', T('예방안전 — 사고조사·TBM·보고 판정', 'Preventive safety — investigations, TBM, reporting'), T('산업재해 발생 원인 등 기록 3년 (법 제164조①4, 시행규칙 제72조)', 'Records of injuries and their causes: 3 years (Act Art. 164(1)4; Rule Art. 72)')],
    ['ra.*', T('위험성평가 — 평가표·참여자', 'Risk assessments — tables and participants'), T('결과 기록 3년 (시행규칙 제37조의4②)', 'Results: 3 years (Rule Art. 37-4(2))')],
    ['m.*', T('수치 판정 입력값', 'Measurement-check inputs'), T('밀폐공간 산소·유해가스 측정 기록 3년 (안전보건규칙 제619조의2④), 폭염작업 체감온도·조치 기록 그해 12월 31일까지 (제562조②3)', 'Confined-space gas tests: 3 years (Standards Rules Art. 619-2(4)); heat-wave temperatures and measures: until 31 December of that year (Art. 562(2)3)')],
    ['ptw.list, ptw.audit', T('작업허가서 — 허가서·모니터링·절차 평가', 'Permits — permits, monitoring, system audit'), T('허가서 작업 완료 후 1년 (PSM 고시 제46조 제6호), 밀폐공간 출입 허가서 3년 권고 (KOSHA C-C-49)', 'Permits: 1 year after the work (PSM Notice Art. 46(6)); confined-space entry permits: 3 years recommended (KOSHA C-C-49)')],
    ['psm.*, pt.*, fire.*, sdx.*, cul.*', T('6대 직무 입력값 — PSM 현황·MOC, 도급 의무·평가, 소방 점검·훈련, SDX 이벤트, KPI', 'Six-function inputs — PSM, contractor duties, fire checks and drills, SDX events, KPIs'), ''],
    ['cases.user, case.st.*, moelck', T('사고사례 — 내 사례·대책 진행·정부 점검 자가점검', 'Incidents — my cases, measure progress, self-check'), ''],
    ['gas.*, ppe, quiz.*, lawchk', T('도구 입력값·SOP 퀴즈·법령 변경 점검 기록', 'Tool inputs, SOP quizzes, law-change check log'), ''],
    ['lang, site, theme, tab.*, search.* …', T('화면 설정 (백업에는 들어가고, 기능별 내보내기에서는 기본 제외)', 'Screen settings (in full backups; left out of feature exports by default)'), '']
  ];

  /* 오프라인 캐시 상태 — 서비스 워커(sw.js)와 Cache Storage를 읽어 표시 */
  async function offlineStatus() {
    if (!/^https?:$/.test(location.protocol)) return { lv: 'info', t: T('파일로 열었습니다 — 이미 이 PC의 파일로 동작하므로 인터넷 없이도 열립니다(글꼴만 시스템 글꼴). 앱 설치·오프라인 캐시는 웹 서버(https)로 배포했을 때 쓸 수 있습니다.', 'Opened as a file — it already runs from this PC’s files and works without internet (system fonts only). Installing and the offline cache need the portal to be served over https.') };
    if (!('serviceWorker' in navigator) || !window.caches) return { lv: 'warn', t: T('이 브라우저는 오프라인 캐시를 지원하지 않습니다.', 'This browser does not support the offline cache.') };
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg || !reg.active) return { lv: 'warn', t: T('아직 준비되지 않았습니다 — 처음 연 직후라면 잠시 뒤 이 화면을 다시 열어 보세요.', 'Not ready yet — if you just opened the portal for the first time, reopen this page in a moment.'), reg };
    const names = (await caches.keys()).filter((k) => /^she-master-v/.test(k));
    let n = 0; for (const k of names) n += (await (await caches.open(k)).keys()).length;
    return { lv: n ? 'ok' : 'warn', t: n ? T(`포털 파일 ${n}개를 이 기기에 받아 두었습니다 (${names.join(', ')}). 인터넷이 끊겨도 열립니다.`, `${n} portal files are stored on this device (${names.join(', ')}); it opens without internet.`) : T('캐시가 비어 있습니다 — ‘다시 받기’를 누르세요.', 'The cache is empty — press “Download again”.'), reg };
  }

  function readBackup(text, name) {
    let obj;
    try { obj = JSON.parse(text); } catch (e) { return { ok: false, name, error: T('JSON 파일이 아니거나 내용이 손상됐습니다.', 'The file is not valid JSON or is damaged.') }; }
    if (!obj || obj.app !== APP || obj.format !== FORMAT || typeof obj.data !== 'object' || Array.isArray(obj.data)) {
      return { ok: false, name, error: T('SHE Master에서 내보낸 백업 파일이 아닙니다.', 'This is not a backup exported from SHE Master.') };
    }
    const data = {}; let skipped = 0;
    Object.keys(obj.data).forEach((k) => { if (KEY_OK.test(k) && obj.data[k] !== undefined) data[k] = obj.data[k]; else skipped++; });
    if (!Object.keys(data).length) return { ok: false, name, error: T('복원할 항목이 없습니다.', 'There is nothing to restore.') };
    return { ok: true, name, data, skipped, exported: typeof obj.exported === 'string' ? obj.exported : '' };
  }

  function exportBackup() {
    const data = {};
    S.storedKeys().forEach((k) => { try { data[k] = JSON.parse(localStorage.getItem(S.NS + k)); } catch (e) { /* skip unreadable */ } });
    const now = new Date();
    const file = { app: APP, format: FORMAT, exported: now.toISOString(), lang: S.state.lang, keys: Object.keys(data).length, data };
    S.download(`SHE-Master-backup-${S.iso(now)}.json`, JSON.stringify(file, null, 2), 'application/json;charset=utf-8');
    S.save('backup.last', S.iso(now));
    S.toast(T('백업 파일을 내려받았습니다', 'Backup downloaded'));
  }

  function applyRestore(mode) {
    if (!pending || !pending.ok) return;
    const keep = mode === 'merge';
    if (!keep) S.storedKeys().forEach((k) => { try { localStorage.removeItem(S.NS + k); } catch (e) { /* storage blocked */ } });
    let n = 0;
    Object.keys(pending.data).forEach((k) => { try { localStorage.setItem(S.NS + k, JSON.stringify(pending.data[k])); n++; } catch (e) { /* quota */ } });
    pending = null;
    S.toast(T(`${n}개 항목을 복원했습니다`, `Restored ${n} items`));
    setTimeout(() => location.reload(), 400);
  }

  function wipe(withPrefs) {
    S.storedKeys().filter((k) => withPrefs || !S.PREF_KEYS.test(k)).forEach((k) => { try { localStorage.removeItem(S.NS + k); } catch (e) { /* storage blocked */ } });
    S.toast(T('이 브라우저의 입력 데이터를 지웠습니다', 'Data in this browser cleared'));
    setTimeout(() => location.reload(), 400);
  }

  S.pages.data = {
    render() {
      const keys = S.storedKeys(), mine = S.userKeys();
      const groups = summarize(keys);
      const last = S.load('backup.last', null);
      const ago = last ? S.daysBetween(new Date(last + 'T00:00:00'), S.today()) : null;
      const pg = pending;
      const pgGroups = pg && pg.ok ? summarize(Object.keys(pg.data)) : [];
      return `
      ${ui.head(T('업무', 'Workspace'), T('데이터 백업·복원', 'Backup & restore'),
        T('포털에 입력한 내용을 파일로 백업하고 되살립니다.', 'Back up what you have entered to a file, and restore it.'),
        T('업무 보드, 법정 주기 실시일, 위험성평가, 조사 기록처럼 포털에 입력한 내용은 이 브라우저에만 저장됩니다. 파일로 백업해 두면 브라우저 데이터를 지웠거나 다른 PC로 옮길 때 그대로 되살릴 수 있습니다.', 'Everything you enter — tasks, cycle dates, risk assessments, investigations — is stored only in this browser. Back it up to a file so you can restore it after clearing the browser or on another PC.'))}
      <section class="grid g3">
        <div class="panel span2">${ui.title(T('이 브라우저에 저장된 데이터', 'Data stored in this browser'), `${S.fmt(keys.length)}${T('개 항목', ' items')} · ${kb(bytesOf(keys))}`)}
          ${groups.length ? `<div class="table-wrap"><table class="data"><thead><tr><th>${T('기능', 'Feature')}</th><th class="n">${T('항목 수', 'Items')}</th></tr></thead><tbody>
            ${groups.map((g) => `<tr><td>${g.route ? `<a href="#${g.route}">${S.esc(L(g.label))}</a>` : S.esc(L(g.label))}</td><td class="n">${g.n}</td></tr>`).join('')}</tbody></table></div>`
            : `<p class="small muted">${T('아직 입력한 데이터가 없습니다. 화면의 예시 값은 저장되지 않은 기본값입니다.', 'Nothing entered yet. Example values on screen are defaults, not saved data.')}</p>`}
        </div>
        <div class="panel stack">${ui.title(T('마지막 백업', 'Last backup'))}
          <span class="num" style="font-size:calc(22px * var(--fz));font-weight:600">${last ? S.esc(last) : T('없음', 'Never')}</span>
          ${last ? `<span class="small muted">${T(`${ago}일 전`, `${ago} days ago`)}</span>` : ''}
          ${mine.length && (ago == null || ago > 30) ? `<div class="callout warn small">${T('입력한 데이터가 있는데 30일 넘게 백업하지 않았습니다.', 'You have data that has not been backed up for over 30 days.')}</div>` : ''}
        </div>
      </section>

      <section class="panel stack" id="anchor-backup">${ui.title(T('백업 파일 내려받기', 'Download a backup'), 'JSON')}
        <p class="small">${T('저장된 모든 항목(화면 설정 포함)을 파일 하나로 내려받습니다. 파일에는 직접 입력한 이름·메모가 그대로 들어 있으니 안전한 곳에 보관하세요.', 'Downloads every stored item (including screen settings) as one file. It contains names and notes exactly as you typed them, so keep it somewhere safe.')}</p>
        <div class="row"><button class="btn" type="button" id="bk-export" ${keys.length ? '' : 'disabled'}>${T('백업 파일 내려받기', 'Download backup')}</button><span class="xs muted">SHE-Master-backup-${S.iso(S.today())}.json</span></div>
      </section>

      <section class="panel stack" id="anchor-share">${ui.title(T('기능별로 골라 내보내기', 'Export selected features'), T('인계·전달용', 'For hand-over'))}
        ${(() => {
          const gs = groupKeys(keys), sel = selected(gs);
          return gs.length ? `<p class="small">${T('후임자에게 교육 기록만, 협력사 담당자에게 작업허가서만 넘기는 것처럼 필요한 기능만 파일로 만듭니다. 받는 사람은 ‘백업 파일에서 복원’으로 가져옵니다.', 'Make a file with only what someone needs — training records for a successor, permits for a contractor coordinator. They load it with “Restore from a backup”.')}</p>
            <div class="grid g2">${gs.map((g) => `<label class="check"><input type="checkbox" data-part="${g.id}" ${sel.has(g.id) ? 'checked' : ''}> ${S.esc(L(g.label))} <span class="xs muted">(${g.keys.length})</span></label>`).join('')}</div>
            <div class="row"><button class="btn" type="button" id="bk-part">${T('선택한 기능만 내려받기', 'Download selected features')}</button><span class="xs muted">SHE-Master-part-${S.iso(S.today())}.json</span></div>
            <div class="callout warn small">${T('받는 사람이 ‘백업에 있는 항목만 바꾸고 나머지는 유지’로 복원해도 같은 기능의 데이터는 이 파일 내용으로 바뀝니다(기능 단위 교체이며 기록끼리 합치지는 않음). 받기 전에 자기 데이터를 백업하도록 알려 주고, 이름 등 개인정보가 든 기능은 꼭 필요한 사람에게만 전달하세요.', 'Even with “replace only the items in the backup”, the recipient’s data for the same features is replaced by this file (features are swapped whole, records are not merged). Ask them to back up first, and send features containing names only to people who need them.')}</div>`
            : `<p class="small muted">${T('아직 입력한 데이터가 없습니다.', 'Nothing entered yet.')}</p>`;
        })()}
      </section>

      <section class="panel stack" id="anchor-restore">${ui.title(T('백업 파일에서 복원', 'Restore from a backup'))}
        <div class="field" style="max-width:420px"><label for="bk-file">${T('백업 파일 선택 (.json)', 'Choose a backup file (.json)')}</label><input type="file" id="bk-file" accept=".json,application/json"></div>
        ${pg ? (pg.ok ? `<div class="result stack" style="gap:8px">
            <b class="small">${S.esc(pg.name)}</b>
            <span class="xs muted">${T('내보낸 시각', 'Exported')}: ${S.esc(localTime(pg.exported) || T('알 수 없음', 'unknown'))} · ${T(`${Object.keys(pg.data).length}개 항목`, `${Object.keys(pg.data).length} items`)}${pg.skipped ? ` · ${T(`형식이 맞지 않는 ${pg.skipped}개는 제외`, `${pg.skipped} malformed items skipped`)}` : ''}</span>
            <div class="table-wrap"><table class="data"><tbody>${pgGroups.map((g) => `<tr><td class="small">${S.esc(L(g.label))}</td><td class="n">${g.n}</td></tr>`).join('')}</tbody></table></div>
            <fieldset style="border:0;padding:0;margin:0"><legend class="small" style="font-weight:600">${T('복원 방식', 'How to restore')}</legend>
              <label class="check"><input type="radio" name="bk-mode" value="merge" checked> ${T('백업에 있는 항목만 바꾸고 나머지는 유지', 'Replace only the items in the backup; keep the rest')}</label>
              <label class="check"><input type="radio" name="bk-mode" value="replace"> ${T('지금 데이터를 모두 지우고 백업으로 교체', 'Clear everything here and replace it with the backup')}</label></fieldset>
            <div class="row"><button class="btn" type="button" id="bk-apply">${T('복원 실행', 'Restore')}</button><button class="btn ghost" type="button" id="bk-cancel">${T('취소', 'Cancel')}</button></div>
          </div>` : `<div class="callout bad small">${S.esc(pg.error)} <span class="muted">(${S.esc(pg.name)})</span></div>`) : ''}
        <p class="xs muted">${T('이 포털에서 내보낸 파일(본인 백업이나 동료가 보낸 기능별 파일)만 가져오세요. 복원하면 페이지를 다시 불러옵니다.', 'Only import files exported from this portal (your own backup or a feature file from a colleague). The page reloads after restoring.')}</p>
      </section>

      <section class="panel stack" id="anchor-offline">${ui.title(T('오프라인 사용 (현장 태블릿)', 'Offline use (field tablets)'))}
        <div id="off-status" class="small">${T('확인 중…', 'Checking…')}</div>
        <ul class="facts small">
          <li>${T('웹 서버(https 또는 localhost)로 연 경우: 처음 한 번 온라인으로 열면 포털 파일을 이 기기에 받아 두어, 이후에는 인터넷이 끊겨도 열립니다. 새 버전이 나오면 온라인일 때 자동으로 다시 받습니다.', 'Served over https or localhost: open it once online and the portal files are stored on the device, so it opens without internet afterwards; new versions download automatically when online.')}</li>
          <li>${T('앱처럼 설치: Chrome·Edge는 주소창의 설치 아이콘이나 메뉴의 ‘앱 설치’, 안드로이드는 메뉴의 ‘홈 화면에 추가’, iPad·iPhone Safari는 공유 버튼의 ‘홈 화면에 추가’.', 'Install like an app: in Chrome or Edge use the install icon in the address bar or “Install app” in the menu; on Android “Add to home screen”; in Safari on iPad or iPhone, Share › “Add to Home Screen”.')}</li>
          <li>${T('오프라인에서는 국가법령정보센터 등 외부 원문 링크가 열리지 않습니다. 입력값은 기기마다 따로 저장되므로 백업 파일로 옮기세요.', 'Offline, external links such as the National Law Information Center will not open. Entries are stored per device, so move them with a backup file.')}</li>
        </ul>
        <div class="row"><button class="btn ghost sm" type="button" id="off-refresh" hidden>${T('오프라인 파일 다시 받기', 'Download again')}</button></div>
      </section>

      <section class="panel stack" id="anchor-dict">${ui.title(T('데이터 사전과 보존기간', 'Data dictionary and retention'))}
        <p class="small">${T('포털이 이 브라우저에 저장하는 항목과, 같은 내용을 실제 업무 기록으로 남길 때의 법정 보존기간입니다. 사내 시스템으로 옮기거나 인계할 때 참고하세요.', 'What the portal stores in this browser, and how long the same content must be kept when it is a real business record. Use it when moving data to an in-house system or handing over.')}</p>
        <div class="table-wrap"><table class="data"><thead><tr><th>${T('저장 키', 'Storage keys')}</th><th>${T('내용', 'Content')}</th><th>${T('업무 기록일 때 법정 보존기간', 'Legal retention as a business record')}</th></tr></thead><tbody>
          ${DICT().map(([k, c, r]) => `<tr><td class="nowrap"><code class="xs">${S.esc(k)}</code></td><td class="small">${c}</td><td class="small">${r || '<span class="muted">–</span>'}</td></tr>`).join('')}
        </tbody></table></div>
        <p class="xs muted">${T('산안법 제164조①은 선임·재해 원인·작업환경측정·건강진단 등 서류를 3년(회의록 2년) 보존하게 하고, ⑦은 전산입력자료로 서류를 대신할 수 있게 합니다. 다만 이 포털의 브라우저 저장은 지워질 수 있으므로 법정 보존 수단으로 쓰지 말고 사내 시스템·문서로 보존하세요.', 'OSH Act Art. 164(1) requires records such as appointments, injury causes, monitoring and health checks to be kept 3 years (committee minutes 2), and (7) allows electronic records instead of paper. Browser storage here can be wiped, though, so do not rely on it for legal retention — keep records in company systems.')}${S.cite('lawAct', 'lawRule', 'lawStd', 'moelPsm', 'koshaCC49')}</p>
      </section>

      <section class="panel stack" id="anchor-team">${ui.title(T('여러 사람이 함께 쓰려면', 'Using it as a team'))}
        <p class="small">${T('이 포털은 서버 없이 동작하는 정적 사이트라, 여러 사람이 같은 데이터를 동시에 쓰거나 전자 결재를 할 수 없습니다. 지금 할 수 있는 공유는 ① 인쇄·PDF(허가서·점검표·보고서), ② 기능별 파일 전달(위), ③ 전체 백업 파일입니다.', 'This is a static site with no server, so several people cannot edit the same data at once or sign electronically. Sharing today means (1) print or PDF (permits, checklists, reports), (2) feature files (above), or (3) full backups.')}</p>
        <b class="small">${T('실제 도입 때 사내 시스템에 필요한 것', 'What a real in-house deployment needs')}</b>
        <ul class="facts small">${[T('계정과 권한 — 작성·검토·승인을 사람별로 분리', 'Accounts and roles — separate preparing, reviewing and approving'), T('서버 저장과 정기 백업', 'Server storage and scheduled backups'), T('변경 이력 — 누가·언제·무엇을 바꿨는지', 'Change history — who changed what, and when'), T('위 표의 법정 보존기간에 맞춘 보관·폐기', 'Keeping and disposing of records to the retention periods above'), T('개인정보 보호 — 교육 대상자·재해자 정보의 접근 제한', 'Personal-data protection — restricted access to trainee and casualty details'), T('출입·교육·설비 등 기존 사내 시스템과의 연계', 'Links to existing systems such as access control, training and equipment')].map((x) => `<li>${x}</li>`).join('')}</ul>
      </section>

      <section class="panel stack" id="anchor-wipe">${ui.title(T('이 브라우저의 데이터 지우기', 'Clear data in this browser'))}
        <p class="small">${T('공용 PC를 쓴 뒤나 처음부터 다시 시작할 때 씁니다. 지운 데이터는 백업 파일이 없으면 되살릴 수 없습니다.', 'Use this after working on a shared PC or to start over. Cleared data cannot be recovered without a backup.')}</p>
        <label class="check"><input type="checkbox" id="bk-wipe-prefs"> ${T('화면 설정(언어·사업장·탭 등)도 함께 지우기', 'Also clear screen settings (language, site, tabs…)')}</label>
        <div class="row"><button class="btn danger" type="button" id="bk-wipe" ${keys.length ? '' : 'disabled'}>${T('입력 데이터 모두 지우기', 'Clear all my data')}</button></div>
      </section>`;
    },
    mount(root) {
      const ex = root.querySelector('#bk-export'); if (ex) ex.addEventListener('click', () => { exportBackup(); S.refresh(); });
      root.querySelectorAll('[data-part]').forEach((el) => el.addEventListener('change', () => {
        const sel = new Set(selected(groupKeys(S.storedKeys())));
        if (el.checked) sel.add(el.dataset.part); else sel.delete(el.dataset.part);
        partSel = sel;
      }));
      const pt = root.querySelector('#bk-part'); if (pt) pt.addEventListener('click', exportPart);
      const box = root.querySelector('#off-status'), rf = root.querySelector('#off-refresh');
      offlineStatus().then((st) => {
        if (!box.isConnected) return;
        box.innerHTML = `${ui.pill(st.lv, { ok: T('오프라인 준비됨', 'Offline ready'), warn: T('확인 필요', 'Needs attention'), info: T('파일 실행', 'Running from file') }[st.lv] || '')} ${S.esc(st.t)}`;
        if (st.reg && rf) {
          rf.hidden = false;
          rf.addEventListener('click', async () => {
            try {
              for (const k of await caches.keys()) if (/^she-master-/.test(k)) await caches.delete(k);
              await st.reg.unregister();
            } catch (e) { /* 계속 진행 */ }
            S.toast(T('오프라인 파일을 지웠습니다 — 다시 불러와 새로 받습니다', 'Offline files cleared — reloading to download them again'));
            setTimeout(() => location.reload(), 500);
          });
        }
      }).catch(() => { if (box.isConnected) box.textContent = T('상태를 확인하지 못했습니다.', 'Could not check the status.'); });
      root.querySelector('#bk-file').addEventListener('change', (e) => {
        const f = e.target.files && e.target.files[0]; if (!f) return;
        if (f.size > MAX_BYTES) { pending = { ok: false, name: f.name, error: T('파일이 너무 큽니다.', 'The file is too large.') }; S.refresh(); return; }
        const rd = new FileReader();
        rd.onload = () => { pending = readBackup(String(rd.result || ''), f.name); S.refresh(); };
        rd.onerror = () => { pending = { ok: false, name: f.name, error: T('파일을 읽지 못했습니다.', 'Could not read the file.') }; S.refresh(); };
        rd.readAsText(f, 'utf-8');
      });
      const ap = root.querySelector('#bk-apply');
      if (ap) ap.addEventListener('click', () => {
        const mode = (root.querySelector('input[name="bk-mode"]:checked') || {}).value || 'merge';
        const msg = mode === 'replace' ? T('지금 이 브라우저의 데이터를 모두 지우고 백업으로 바꿉니다. 계속할까요?', 'This clears everything in this browser and replaces it with the backup. Continue?')
          : T('백업에 있는 항목으로 바꿉니다. 계속할까요?', 'Items in the backup will replace the current ones. Continue?');
        if (window.confirm(msg)) applyRestore(mode);
      });
      const cc = root.querySelector('#bk-cancel'); if (cc) cc.addEventListener('click', () => { pending = null; S.refresh(); });
      const wp = root.querySelector('#bk-wipe');
      if (wp) wp.addEventListener('click', () => {
        const withPrefs = root.querySelector('#bk-wipe-prefs').checked;
        if (window.confirm(T('이 브라우저에 저장된 입력 데이터를 모두 지웁니다. 되돌릴 수 없습니다. 계속할까요?', 'This permanently clears the data saved in this browser. Continue?'))) wipe(withPrefs);
      });
    }
  };

  /* exposed for the dashboard reminder and for tests */
  S.backup = { readBackup, summarize, lastAgo: () => { const l = S.load('backup.last', null); return l ? S.daysBetween(new Date(l + 'T00:00:00'), S.today()) : null; } };
})();

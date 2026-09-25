/* 수치 판정 기준 데이터
   - 국내 노출기준: 고용노동부고시 제2020-48호 [별표1] (개정 2018.7.30) — 원문 표 이미지와 대조 확인 (src: moelOel)
   - IDLH: 미국 NIOSH IDLH 목록 (src: nioshIdlh). 2016년 이후 개정값(이산화질소 2017, 삼불화염소 2020)을 반영. 목록에 없는 물질은 null
   - 위험 특성 메모: ILO ICSC 카드 (src: icsc)
   단위: 가스·증기 ppm, 에어로졸(미스트 등) mg/m3 (고시 제11조) */
window.SHE = window.SHE || {};

SHE.CHEM_CATS = {
  acid:   { ko: '산·부식성 액체', en: 'Acids / corrosive liquids' },
  base:   { ko: '알칼리·현상액', en: 'Bases / developers' },
  toxgas: { ko: '독성 특수가스', en: 'Toxic specialty gases' },
  pyro:   { ko: '자연발화성·인화성 가스', en: 'Pyrophoric / flammable gases' },
  fgas:   { ko: '불소계·산화성 가스', en: 'Fluorinated / oxidizing gases' },
  solv:   { ko: '유기용제·액체 원료', en: 'Organic solvents / liquid precursors' },
  metal:  { ko: '금속·무기 고체', en: 'Metals / inorganic solids' },
  inert:  { ko: '불활성·질식성 가스', en: 'Inert / asphyxiant gases' },
  byprod: { ko: '부산물·잔류물·환경 가스', en: 'By-products, residues / ambient gases' }
};

SHE.CHEMICALS = [
  { id: 'hf', cat: 'acid', ko: '불화수소(불산)', en: 'Hydrogen fluoride', f: 'HF', cas: '7664-39-3', unit: 'ppm', twa: 0.5, stel: null, c: 3, note: 'Skin', idlh: 30, idlhUnit: 'ppm',
    procs: ['clean', 'etch'],
    icsc: { ko: '피부로 흡수됨. 흡입 증상은 지연될 수 있고, 저칼슘혈증으로 수 시간 뒤 생명을 위협할 수 있음. “모든 접촉을 피할 것”', en: 'Absorbed through the skin. Inhalation symptoms may be delayed; hypocalcaemia can become life-threatening hours later. “Avoid all contact.”' } },
  { id: 'hcl', cat: 'acid', ko: '염화수소(염산)', en: 'Hydrogen chloride', f: 'HCl', cas: '7647-01-0', unit: 'ppm', twa: 1, stel: 2, c: null, note: '', idlh: 50, idlhUnit: 'ppm', procs: ['clean', 'ox', 'dep'] },
  { id: 'h2so4', cat: 'acid', ko: '황산 (흉곽성)', en: 'Sulfuric acid (thoracic fraction)', f: 'H₂SO₄', cas: '7664-93-9', unit: 'mg/m³', twa: 0.2, stel: 0.6, c: null, note: { ko: '발암성 1A (강산 미스트에 한정)', en: 'Carc. 1A (strong-acid mist only)' }, idlh: 15, idlhUnit: 'mg/m³', procs: ['clean', 'strip'] },
  { id: 'hno3', cat: 'acid', ko: '질산', en: 'Nitric acid', f: 'HNO₃', cas: '7697-37-2', unit: 'ppm', twa: 2, stel: 4, c: null, note: '', idlh: 25, idlhUnit: 'ppm', procs: ['clean', 'etch'] },
  { id: 'h3po4', cat: 'acid', ko: '인산', en: 'Phosphoric acid', f: 'H₃PO₄', cas: '7664-38-2', unit: 'mg/m³', twa: 1, stel: 3, c: null, note: '', idlh: 1000, idlhUnit: 'mg/m³', procs: ['etch'] },
  { id: 'h2o2', cat: 'acid', ko: '과산화수소', en: 'Hydrogen peroxide', f: 'H₂O₂', cas: '7722-84-1', unit: 'ppm', twa: 1, stel: null, c: null, note: { ko: '발암성 2', en: 'Carc. 2' }, idlh: 75, idlhUnit: 'ppm', procs: ['clean'] },
  { id: 'naoh', cat: 'base', ko: '수산화나트륨', en: 'Sodium hydroxide', f: 'NaOH', cas: '1310-73-2', unit: 'mg/m³', twa: null, stel: null, c: 2, note: '', idlh: 10, idlhUnit: 'mg/m³', procs: ['photo'] },
  { id: 'koh', cat: 'base', ko: '수산화칼륨', en: 'Potassium hydroxide', f: 'KOH', cas: '1310-58-3', unit: 'mg/m³', twa: null, stel: null, c: 2, note: '', idlh: null, procs: ['photo'] },
  { id: 'tmah', cat: 'base', ko: '수산화테트라메틸암모늄(TMAH)', en: 'Tetramethylammonium hydroxide (TMAH)', f: 'C₄H₁₃NO', cas: '75-59-2', unit: 'mg/m³', twa: 1, stel: null, c: null, note: { ko: 'KOSHA H-171-2023 보건관리지침', en: 'KOSHA H-171-2023 health guideline' }, idlh: null, procs: ['photo'] },
  { id: 'nh3', cat: 'base', ko: '암모니아', en: 'Ammonia', f: 'NH₃', cas: '7664-41-7', unit: 'ppm', twa: 25, stel: 35, c: null, note: '', idlh: 300, idlhUnit: 'ppm', procs: ['clean', 'dep'] },
  { id: 'ash3', cat: 'toxgas', ko: '아르신(삼수소화비소)', en: 'Arsine', f: 'AsH₃', cas: '7784-42-1', unit: 'ppm', twa: 0.005, stel: null, c: null, note: '', idlh: 3, idlhUnit: 'ppm', procs: ['dope', 'dep'],
    icsc: { ko: '혈액·호흡기계 영향. 중독 증상은 수 시간~수일 뒤에 나타날 수 있음. 극인화성', en: 'Affects blood and respiratory system; poisoning symptoms may not appear for hours or days. Extremely flammable.' } },
  { id: 'ph3', cat: 'toxgas', ko: '포스핀', en: 'Phosphine', f: 'PH₃', cas: '7803-51-2', unit: 'ppm', twa: 0.3, stel: 1, c: null, note: '', idlh: 50, idlhUnit: 'ppm', procs: ['dope', 'dep'],
    icsc: { ko: '공기와 접촉 시 자연발화 가능(자연발화온도 38°C). 흡입 시 치명적, 폐부종 가능', en: 'May ignite spontaneously in air (auto-ignition 38 °C). Fatal if inhaled; may cause lung oedema.' } },
  { id: 'b2h6', cat: 'toxgas', ko: '디보란', en: 'Diborane', f: 'B₂H₆', cas: '19287-45-7', unit: 'ppm', twa: 0.1, stel: null, c: null, note: '', idlh: 15, idlhUnit: 'ppm', procs: ['dope', 'dep'],
    icsc: { ko: '자연발화온도 40–50°C, 불순물이 있으면 상온 이하에서도 발화 가능. 폭발범위 0.8–88%. 눈·피부·호흡기 부식성', en: 'Auto-ignition 40–50 °C; contaminants may allow ignition at or below room temperature. Explosive limits 0.8–88 %. Corrosive to eyes, skin and respiratory tract.' } },
  { id: 'bf3', cat: 'toxgas', ko: '삼불화붕소', en: 'Boron trifluoride', f: 'BF₃', cas: '7637-07-2', unit: 'ppm', twa: null, stel: null, c: 1, note: '', idlh: 25, idlhUnit: 'ppm', procs: ['dope'] },
  { id: 'hbr', cat: 'toxgas', ko: '브롬화수소', en: 'Hydrogen bromide', f: 'HBr', cas: '10035-10-6', unit: 'ppm', twa: null, stel: null, c: 2, note: '', idlh: 30, idlhUnit: 'ppm', procs: ['etch'] },
  { id: 'cl2', cat: 'toxgas', ko: '염소', en: 'Chlorine', f: 'Cl₂', cas: '7782-50-5', unit: 'ppm', twa: 0.5, stel: 1, c: null, note: '', idlh: 10, idlhUnit: 'ppm', procs: ['etch'] },
  { id: 'sih4', cat: 'pyro', ko: '실레인(실란)', en: 'Silane', f: 'SiH₄', cas: '7803-62-5', unit: 'ppm', twa: 5, stel: null, c: null, note: '', idlh: null, procs: ['dep'],
    icsc: { ko: '극인화성, 공기와 접촉 시 자연발화 가능. 가스/공기 혼합물 폭발성', en: 'Extremely flammable; may ignite spontaneously on contact with air. Gas/air mixtures are explosive.' } },
  { id: 'geh4', cat: 'pyro', ko: '게르마늄 테트라하이드라이드(저메인)', en: 'Germanium tetrahydride (germane)', f: 'GeH₄', cas: '7782-65-2', unit: 'ppm', twa: 0.2, stel: null, c: null, note: '', idlh: null, procs: ['dep'] },
  { id: 'nf3', cat: 'fgas', ko: '삼불화질소', en: 'Nitrogen trifluoride', f: 'NF₃', cas: '7783-54-2', unit: 'ppm', twa: 10, stel: null, c: null, note: '', idlh: 1000, idlhUnit: 'ppm', procs: ['dep', 'etch'] },
  { id: 'clf3', cat: 'fgas', ko: '삼불화염소', en: 'Chlorine trifluoride', f: 'ClF₃', cas: '7790-91-2', unit: 'ppm', twa: null, stel: null, c: 0.1, note: '', idlh: 12, idlhUnit: 'ppm', idlhNote: 'NIOSH 2020', procs: ['dep'] },
  { id: 'f2', cat: 'fgas', ko: '불소', en: 'Fluorine', f: 'F₂', cas: '7782-41-4', unit: 'ppm', twa: 0.1, stel: null, c: null, note: '', idlh: 25, idlhUnit: 'ppm', procs: ['etch'] },
  { id: 'sf6', cat: 'fgas', ko: '육불화황', en: 'Sulfur hexafluoride', f: 'SF₆', cas: '2551-62-4', unit: 'ppm', twa: 1000, stel: null, c: null, note: '', idlh: null, procs: ['etch'] },
  { id: 'o3', cat: 'byprod', ko: '오존', en: 'Ozone', f: 'O₃', cas: '10028-15-6', unit: 'ppm', twa: 0.08, stel: 0.2, c: null, note: '', idlh: 5, idlhUnit: 'ppm', procs: ['photo', 'ox'] },
  { id: 'ipa', cat: 'solv', ko: '이소프로필 알코올(IPA)', en: 'Isopropyl alcohol (IPA)', f: 'C₃H₈O', cas: '67-63-0', unit: 'ppm', twa: 200, stel: 400, c: null, note: '', idlh: 2000, idlhUnit: 'ppm', idlhNote: '10% LEL', procs: ['clean', 'photo'] },
  { id: 'acetone', cat: 'solv', ko: '아세톤', en: 'Acetone', f: 'C₃H₆O', cas: '67-64-1', unit: 'ppm', twa: 500, stel: 750, c: null, note: '', idlh: 2500, idlhUnit: 'ppm', procs: ['clean', 'photo'] },
  { id: 'pgme', cat: 'solv', ko: '프로필렌 글리콜 모노메틸 에테르(PGME)', en: 'Propylene glycol monomethyl ether (PGME)', f: 'C₄H₁₀O₂', cas: '107-98-2', unit: 'ppm', twa: 100, stel: 150, c: null, note: '', idlh: null, procs: ['photo'] },
  { id: 'co', cat: 'byprod', ko: '일산화탄소', en: 'Carbon monoxide', f: 'CO', cas: '630-08-0', unit: 'ppm', twa: 30, stel: 200, c: null, note: { ko: '생식독성 1A', en: 'Repr. 1A' }, idlh: 1200, idlhUnit: 'ppm', procs: ['strip'] },
  { id: 'co2', cat: 'byprod', ko: '이산화탄소', en: 'Carbon dioxide', f: 'CO₂', cas: '124-38-9', unit: 'ppm', twa: 5000, stel: 30000, c: null, note: '', idlh: 40000, idlhUnit: 'ppm', procs: ['strip'] },
  { id: 'h2s', cat: 'byprod', ko: '황화수소', en: 'Hydrogen sulfide', f: 'H₂S', cas: '7783-06-4', unit: 'ppm', twa: 10, stel: 15, c: null, note: '', idlh: 100, idlhUnit: 'ppm', procs: [] },
  { id: 'no2', cat: 'byprod', ko: '이산화질소', en: 'Nitrogen dioxide', f: 'NO₂', cas: '10102-44-0', unit: 'ppm', twa: 3, stel: 5, c: null, note: '', idlh: 13, idlhUnit: 'ppm', idlhNote: 'NIOSH 2017', procs: ['etch'] },
  { id: 'hcn', cat: 'toxgas', ko: '시안화수소', en: 'Hydrogen cyanide', f: 'HCN', cas: '74-90-8', unit: 'ppm', twa: null, stel: null, c: 4.7, note: 'Skin', idlh: 50, idlhUnit: 'ppm', procs: [] },
  /* 2026-09-24 추가 — 고시 별표1 원문 표·NIOSH IDLH 문서로 확인 */
  { id: 'sbh3', cat: 'toxgas', ko: '스티빈(삼수소화안티몬)', en: 'Stibine', f: 'SbH₃', cas: '7803-52-3', unit: 'ppm', twa: 0.1, stel: null, c: null, note: '', idlh: 5, idlhUnit: 'ppm', procs: ['dope'] },
  { id: 'teos', cat: 'solv', ko: '에틸 실리케이트(TEOS)', en: 'Ethyl silicate (TEOS)', f: '(C₂H₅O)₄Si', cas: '78-10-4', unit: 'ppm', twa: 10, stel: null, c: null, note: { ko: '산화막 증착(CVD) 액체 원료', en: 'Liquid source for oxide CVD' }, idlh: 700, idlhUnit: 'ppm', procs: ['dep'] },
  { id: 'as', cat: 'byprod', ko: '비소 및 그 무기화합물 (As로서)', en: 'Arsenic & inorganic compounds (as As)', f: 'As', cas: '7440-38-2', unit: 'mg/m³', twa: 0.01, stel: null, c: null, note: { ko: '발암성 1A — 이온주입·증착 장비 정비 시 잔류물', en: 'Carc. 1A — residues met during implant and deposition maintenance' }, idlh: 5, idlhUnit: 'mg/m³', procs: ['dope', 'dep'] },

  /* 3단계(2026-09-24) — 노출기준: 고시 제2020-48호 별표1 원문(HWP) 행 확인, IDLH: NIOSH IDLH 표, 공정: 미국 OSHA 반도체 Table 1~6(src: oshaSemi),
     위험 특성: ILO ICSC 한국어판(고용노동부·산업안전보건공단 번역). 별표1에 없는 물질은 twa·stel·c 모두 null(국내 노출기준 없음) */
  { id: 'acoh', cat: 'acid', ko: '초산(아세트산)', en: 'Acetic acid', f: 'CH₃COOH', cas: '64-19-7', unit: 'ppm', twa: 10, stel: 15, c: null, note: { ko: '습식 식각액 성분 (OSHA Table 2)', en: 'Wet-etchant component (OSHA Table 2)' }, idlh: 50, idlhUnit: 'ppm', procs: ['etch'] },
  { id: 'nh4f', cat: 'acid', ko: '불화암모늄 (플루오라이드, F로서)', en: 'Ammonium fluoride (fluorides, as F)', f: 'NH₄F', cas: '12125-01-8', unit: 'mg/m³', twa: 2.5, stel: null, c: null, note: { ko: '고시 별표1 ‘플루오라이드(Fluorides, as F)’ 기준 — BOE(HF+NH₄F) 산화막 식각액 성분 (OSHA Table 2)', en: 'Annex 1 “Fluorides, as F” limit — component of BOE (HF + NH₄F) oxide etchant (OSHA Table 2)' }, idlh: 250, idlhUnit: 'mg/m³', idlhNote: 'Fluorides (as F)', procs: ['etch'],
    icsc: { ko: '가열하면 분해되어 불화수소·암모니아가 포함된 독성·부식성 흄 발생. 눈·피부·기도 자극', en: 'Decomposes on heating, giving toxic and corrosive fumes including HF and ammonia. Irritates eyes, skin and airways.' } },
  { id: 'mea', cat: 'base', ko: '에탄올아민(모노에탄올아민, MEA)', en: 'Ethanolamine (MEA)', f: 'C₂H₇NO', cas: '141-43-5', unit: 'ppm', twa: 3, stel: 6, c: null, note: { ko: '감광액 박리제 성분 (OSHA Table 4)', en: 'Photoresist stripper component (OSHA Table 4)' }, idlh: 30, idlhUnit: 'ppm', procs: ['strip'] },
  { id: 'h2se', cat: 'toxgas', ko: '셀렌화수소 (Se로서)', en: 'Hydrogen selenide (as Se)', f: 'H₂Se', cas: '7783-07-5', unit: 'ppm', twa: 0.05, stel: null, c: null, note: '', idlh: 1, idlhUnit: 'ppm', procs: [],
    icsc: { ko: '극인화성, 강환원제. 눈·기도 자극, 흡입 시 폐렴 가능. 노출기준을 넘어도 냄새로는 충분히 경고되지 않음', en: 'Extremely flammable strong reducer. Irritates eyes and airways; inhalation may cause pneumonitis. Smell gives no adequate warning above the limit.' } },
  { id: 'bcl3', cat: 'toxgas', ko: '삼염화붕소', en: 'Boron trichloride', f: 'BCl₃', cas: '10294-34-5', unit: 'ppm', twa: null, stel: null, c: null, note: { ko: '국내 노출기준 없음 — 도핑·알루미늄 식각 (OSHA Table 3·5)', en: 'No Korean limit — doping and aluminium etch (OSHA Tables 3 and 5)' }, idlh: null, procs: ['dope', 'etch'],
    icsc: { ko: '물·습한 공기와 격렬히 반응해 염화수소·붕산 생성. 눈·피부·기도 부식성, 흡입 시 폐부종(지연 가능)', en: 'Reacts violently with water and moist air, forming HCl and boric acid. Corrosive to eyes, skin and airways; lung oedema may be delayed.' } },
  { id: 'h2', cat: 'pyro', ko: '수소', en: 'Hydrogen', f: 'H₂', cas: '1333-74-0', unit: 'ppm', twa: null, stel: null, c: null, note: { ko: '국내 노출기준 없음 — 습식 산화·CVD 운반가스 (OSHA)', en: 'No Korean limit — wet oxidation and CVD carrier gas (OSHA)' }, idlh: null, procs: ['ox', 'dep'],
    icsc: { ko: '극인화성, 폭발범위 4–75%, 공기보다 가벼움. 밀폐공간에서는 산소를 밀어내 질식. 일반 가연성 가스감지기는 적합하지 않으니 수소용 감지기로 측정', en: 'Extremely flammable (4–75 % in air), lighter than air; displaces oxygen in enclosed spaces. Ordinary combustible-gas detectors are unsuitable — use a hydrogen detector.' } },
  { id: 'dcs', cat: 'pyro', ko: '디클로로실란(DCS)', en: 'Dichlorosilane (DCS)', f: 'SiH₂Cl₂', cas: '4109-96-0', unit: 'ppm', twa: null, stel: null, c: null, note: { ko: '국내 노출기준 없음 — 에피택시 원료가스 (OSHA)', en: 'No Korean limit — epitaxy source gas (OSHA)' }, idlh: null, procs: ['dep'],
    icsc: { ko: '극인화성, 공기 접촉 시 자연발화 가능, 폭발범위 4.1–99%. 물·습기와 반응해 염화수소 생성, 눈·피부·기도 부식성, 폐부종(지연 가능)', en: 'Extremely flammable, may ignite spontaneously in air (4.1–99 %). Reacts with water and moisture to form HCl; corrosive; lung oedema may be delayed.' } },
  { id: 'si2h6', cat: 'pyro', ko: '디실란', en: 'Disilane', f: 'Si₂H₆', cas: '1590-87-0', unit: 'ppm', twa: null, stel: null, c: null, note: { ko: '국내 노출기준 없음 — KOSHA C-C-65-2026이 예로 든 특수재료가스', en: 'No Korean limit — named as a special material gas in KOSHA C-C-65-2026' }, idlh: null, procs: ['dep'] },
  { id: 'n2o', cat: 'fgas', ko: '아산화질소', en: 'Nitrous oxide', f: 'N₂O', cas: '10024-97-2', unit: 'ppm', twa: null, stel: null, c: null, note: { ko: '국내 노출기준 없음 — 산화막·질화막 CVD 원료가스 (OSHA Table 6)', en: 'No Korean limit — CVD source gas for oxide and nitride films (OSHA Table 6)' }, idlh: null, procs: ['dep'],
    icsc: { ko: '불연성이지만 다른 물질의 연소를 도움(산화성). 흡입 시 도취·졸림·의식 저하, 액체 접촉 시 동상', en: 'Not combustible but supports combustion (oxidiser). Inhalation causes euphoria, drowsiness and unconsciousness; liquid causes frostbite.' } },
  { id: 'sf4', cat: 'fgas', ko: '사불화황(사불화유황)', en: 'Sulfur tetrafluoride', f: 'SF₄', cas: '7783-60-0', unit: 'ppm', twa: null, stel: null, c: 0.1, note: '', idlh: null, procs: [],
    icsc: { ko: '물·산과 격렬히 반응해 독성·부식성 흄 발생. 눈·피부·기도 부식성, 흡입 시 폐부종. 반복 노출 시 뼈·치아(불소증)', en: 'Reacts violently with water and acids, giving toxic, corrosive fumes. Corrosive; lung oedema on inhalation; repeated exposure affects bones and teeth (fluorosis).' } },
  { id: 'sif4', cat: 'fgas', ko: '사불화규소', en: 'Silicon tetrafluoride', f: 'SiF₄', cas: '7783-61-1', unit: 'ppm', twa: null, stel: null, c: null, note: { ko: '국내 노출기준 없음 — 산화막 플라즈마 식각 가스 (OSHA Table 3)', en: 'No Korean limit — oxide plasma-etch gas (OSHA Table 3)' }, idlh: null, procs: ['etch'],
    icsc: { ko: '물과 반응해 불화수소·규산 생성. 눈·피부·기도 부식성, 흡입 시 폐부종(지연 가능)', en: 'Reacts with water to form HF and silicic acid. Corrosive; lung oedema on inhalation may be delayed.' } },
  { id: 'pocl3', cat: 'solv', ko: '옥시염화인(POCl₃)', en: 'Phosphorus oxychloride', f: 'POCl₃', cas: '10025-87-3', unit: 'ppm', twa: 0.1, stel: 0.5, c: null, note: { ko: '인 확산 액체 도펀트 (OSHA Table 5)', en: 'Liquid phosphorus dopant for diffusion (OSHA Table 5)' }, idlh: null, procs: ['dope'],
    icsc: { ko: '물과 격렬히 반응해 염산·인산 생성. 눈·피부·기도 부식성, 증기 흡입 시 폐부종(지연 가능). 20°C에서 빠르게 유해 농도 도달', en: 'Reacts violently with water, forming hydrochloric and phosphoric acids. Corrosive; lung oedema from vapour may be delayed. Reaches harmful levels quickly at 20 °C.' } },
  { id: 'pcl3', cat: 'solv', ko: '삼염화인', en: 'Phosphorus trichloride', f: 'PCl₃', cas: '7719-12-2', unit: 'ppm', twa: 0.2, stel: 0.5, c: null, note: { ko: '인 확산 액체 도펀트 (OSHA Table 5)', en: 'Liquid phosphorus dopant for diffusion (OSHA Table 5)' }, idlh: 25, idlhUnit: 'ppm', procs: ['dope'] },
  { id: 'sicl4', cat: 'solv', ko: '사염화규소(테트라클로로실란)', en: 'Silicon tetrachloride', f: 'SiCl₄', cas: '10026-04-7', unit: 'ppm', twa: null, stel: null, c: null, note: { ko: '국내 노출기준 없음 — CVD 원료 (OSHA Table 6)', en: 'No Korean limit — CVD source (OSHA Table 6)' }, idlh: null, procs: ['dep'],
    icsc: { ko: '물과 격렬히 반응해 염화수소 생성(물 소화 금지). 눈·피부·기도 부식성, 증기 흡입 시 폐부종(지연 가능)', en: 'Reacts violently with water, forming HCl (do not use water to fight fires). Corrosive; lung oedema from vapour may be delayed.' } },
  { id: 'tcs', cat: 'solv', ko: '트리클로로실란(TCS)', en: 'Trichlorosilane (TCS)', f: 'SiHCl₃', cas: '10025-78-2', unit: 'ppm', twa: null, stel: null, c: null, note: { ko: '국내 노출기준 없음 — 에피택시 원료 (OSHA)', en: 'No Korean limit — epitaxy source (OSHA)' }, idlh: null, procs: ['dep'],
    icsc: { ko: '극인화성 발연 액체, 증기가 바닥을 따라 퍼져 원거리 발화 가능. 물과 격렬히 반응해 염화수소 생성, 부식성, 폐부종', en: 'Extremely flammable fuming liquid; vapour can travel along the floor to distant ignition. Reacts violently with water to form HCl; corrosive; lung oedema.' } },
  { id: 'hmds', cat: 'solv', ko: '헥사메틸디실라잔(HMDS)', en: 'Hexamethyldisilazane (HMDS)', f: 'C₆H₁₉NSi₂', cas: '999-97-3', unit: 'ppm', twa: null, stel: null, c: null, note: { ko: '국내 노출기준 없음 — 감광액 도포 전 접착 촉진제 (OSHA)', en: 'No Korean limit — adhesion promoter before photoresist coating (OSHA)' }, idlh: null, procs: ['photo'] },
  { id: 'nbac', cat: 'solv', ko: 'n-초산부틸(n-부틸 아세테이트)', en: 'n-Butyl acetate', f: 'C₆H₁₂O₂', cas: '123-86-4', unit: 'ppm', twa: 150, stel: 200, c: null, note: { ko: '감광액 용제·현상 후 린스 (OSHA Table 1)', en: 'Photoresist solvent and post-develop rinse (OSHA Table 1)' }, idlh: 1700, idlhUnit: 'ppm', procs: ['photo'] },
  { id: 'xylene', cat: 'solv', ko: '크실렌(모든 이성체)', en: 'Xylene (all isomers)', f: 'C₆H₄(CH₃)₂', cas: '1330-20-7', unit: 'ppm', twa: 100, stel: 150, c: null, note: { ko: '감광액 용제·현상제 (OSHA Table 1)', en: 'Photoresist solvent and developer (OSHA Table 1)' }, idlh: 900, idlhUnit: 'ppm', procs: ['photo'] },
  { id: 'egeea', cat: 'solv', ko: '2-에톡시에틸 아세테이트(셀로솔브 아세테이트)', en: '2-Ethoxyethyl acetate (cellosolve acetate)', f: 'C₆H₁₂O₃', cas: '111-15-9', unit: 'ppm', twa: 5, stel: null, c: null, note: { ko: '생식독성 1B, Skin — 과거 감광액 용제(OSHA Table 1). OSHA는 생식독성 때문에 글리콜에테르를 대체하라고 권고', en: 'Repr. 1B, skin — a former photoresist solvent (OSHA Table 1); OSHA advises replacing glycol ethers because of reproductive effects' }, idlh: 500, idlhUnit: 'ppm', procs: ['photo'] },
  { id: 'eg', cat: 'solv', ko: '에틸렌 글리콜(증기·미스트)', en: 'Ethylene glycol (vapour & mist)', f: 'C₂H₆O₂', cas: '107-21-1', unit: 'mg/m³', twa: null, stel: null, c: 100, note: { ko: 'BOE 식각액 첨가 (OSHA Table 2)', en: 'Added to BOE etchant (OSHA Table 2)' }, idlh: null, procs: ['etch'] },
  { id: 'etoh', cat: 'solv', ko: '에탄올(에틸 알코올)', en: 'Ethanol', f: 'C₂H₅OH', cas: '64-17-5', unit: 'ppm', twa: 1000, stel: null, c: null, note: { ko: '발암성 1A (알코올 음주에 한정) — 세정 용제 (OSHA)', en: 'Carc. 1A (alcoholic drinks only) — cleaning solvent (OSHA)' }, idlh: 3300, idlhUnit: 'ppm', idlhNote: '10% LEL', procs: ['clean'] },
  { id: 'sb', cat: 'metal', ko: '안티몬과 그 화합물 (Sb로서)', en: 'Antimony & compounds (as Sb)', f: 'Sb', cas: '7440-36-0', unit: 'mg/m³', twa: 0.5, stel: null, c: null, note: { ko: 'n형 도펀트(Sb₂O₃·SbCl₃, OSHA Table 5)', en: 'n-type dopant (Sb₂O₃, SbCl₃; OSHA Table 5)' }, idlh: 50, idlhUnit: 'mg/m³', procs: ['dope'] },
  { id: 'b2o3', cat: 'metal', ko: '산화붕소', en: 'Boron oxide', f: 'B₂O₃', cas: '1303-86-2', unit: 'mg/m³', twa: 10, stel: null, c: null, note: { ko: '생식독성 1B — p형 도펀트 (OSHA Table 5)', en: 'Repr. 1B — p-type dopant (OSHA Table 5)' }, idlh: 2000, idlhUnit: 'mg/m³', procs: ['dope'] },
  { id: 'hg', cat: 'metal', ko: '수은 및 무기형태 (아릴·알킬 화합물 제외)', en: 'Mercury, elemental & inorganic', f: 'Hg', cas: '7439-97-6', unit: 'mg/m³', twa: 0.025, stel: null, c: null, note: { ko: '생식독성 1B, Skin — 노광 수은 램프 파손 시 (OSHA)', en: 'Repr. 1B, skin — from broken mercury exposure lamps (OSHA)' }, idlh: 10, idlhUnit: 'mg/m³', procs: ['photo'],
    icsc: { ko: '고농도 증기 흡입 시 폐렴, 중추신경·신장 영향. 독성 농도라도 냄새로 알 수 없음. 오염된 작업복은 밀봉해 분리', en: 'High vapour levels cause pneumonitis; affects the CNS and kidneys. No smell even at toxic levels. Seal and segregate contaminated clothing.' } },
  { id: 'w', cat: 'metal', ko: '텅스텐 및 불용성화합물 (호흡성)', en: 'Tungsten & insoluble compounds (respirable)', f: 'W', cas: '7440-33-7', unit: 'mg/m³', twa: 5, stel: 10, c: null, note: { ko: '가용성화합물은 TWA 1·STEL 3mg/m³ — 플라즈마 식각 대상 금속막 (OSHA Table 3)', en: 'Soluble compounds: TWA 1, STEL 3 mg/m³ — a metal film etched in plasma (OSHA Table 3)' }, idlh: null, procs: ['etch'] },
  { id: 'ta', cat: 'metal', ko: '탄탈륨 (금속 및 산화흄)', en: 'Tantalum (metal & oxide fume)', f: 'Ta', cas: '7440-25-7', unit: 'mg/m³', twa: 5, stel: null, c: null, note: { ko: '고시 별표1은 Ta/Ta₂O₅(1314-61-0)로 수록 — 플라즈마 식각 대상 금속막 (OSHA Table 3)', en: 'Annex 1 lists it as Ta/Ta₂O₅ (1314-61-0) — a metal film etched in plasma (OSHA Table 3)' }, idlh: 2500, idlhUnit: 'mg/m³', procs: ['etch'] },
  { id: 'n2', cat: 'inert', ko: '질소', en: 'Nitrogen', f: 'N₂', cas: '7727-37-9', unit: 'ppm', twa: null, stel: null, c: null, note: { ko: '국내 노출기준 없음(단순 질식제) — 퍼지·운반가스 (OSHA Table 6)', en: 'No Korean limit (simple asphyxiant) — purge and carrier gas (OSHA Table 6)' }, idlh: null, procs: ['dep'],
    icsc: { ko: '누출되면 밀폐된 공간의 산소 농도를 낮춰 의식 상실·사망 위험. 들어가기 전에 산소 농도를 확인할 것', en: 'A leak lowers oxygen in enclosed spaces — risk of unconsciousness and death. Check oxygen before entry.' } },
  { id: 'ar', cat: 'inert', ko: '아르곤', en: 'Argon', f: 'Ar', cas: '7440-37-1', unit: 'ppm', twa: null, stel: null, c: null, note: { ko: '국내 노출기준 없음(단순 질식제) — 스퍼터·물리 식각 (OSHA)', en: 'No Korean limit (simple asphyxiant) — sputtering and physical etch (OSHA)' }, idlh: null, procs: ['etch'],
    icsc: { ko: '고농도에서 산소 결핍으로 의식 상실·사망 위험, 액체는 동상. 들어가기 전에 산소 농도를 확인할 것', en: 'High levels cause oxygen deficiency — unconsciousness and death; liquid causes frostbite. Check oxygen before entry.' } },
  { id: 'no', cat: 'byprod', ko: '일산화질소', en: 'Nitric oxide', f: 'NO', cas: '10102-43-9', unit: 'ppm', twa: 25, stel: null, c: null, note: '', idlh: 100, idlhUnit: 'ppm', procs: [] }
];

/* ICSC 카드 번호(ILO, CAS로 카드 대조 확인)와 법정 관리 구분 — 2026-09-24 원문 확인
   rg 글자: w=작업환경측정 대상(시행규칙 별표21), s=특수건강진단 대상(별표22), m=관리대상 유해물질(안전보건규칙 별표12),
   x=특별관리물질(별표12), p=허가대상 유해물질(시행령 제88조). 화합물은 ‘○○ 및 그 화합물’ 항목으로 판단한 경우 rgc에 적는다 */
(function () {
  const META = {
    hf: ['0283', 'wsm'], hcl: ['0163', 'wsm'], h2so4: ['0362', 'wsm'], hno3: ['0183', 'wsm'], h3po4: ['1008', 'wm'], h2o2: ['0164', 'wm'],
    naoh: ['0360', 'wm'], koh: ['0357', 'wm'], tmah: [null, ''], nh3: ['0414', 'wm'], ash3: ['0222', 'wsm'], ph3: ['0694', 'wsm'],
    b2h6: ['0432', ''], bf3: ['0231', ''], hbr: ['0282', 'wm'], cl2: ['0126', 'wsm'], sih4: ['0564', ''], geh4: ['1244', ''],
    nf3: ['1234', ''], clf3: ['0656', ''], f2: ['0046', 'wsm'], sf6: ['0571', ''], o3: ['0068', 'wsm'], ipa: ['0554', 'wsm'],
    acetone: ['0087', 'wsm'], pgme: ['0551', ''], co: ['0023', 'wsm'], co2: ['0021', ''], h2s: ['0165', 'wsm'], no2: ['0930', 'wsm'],
    hcn: ['0492', 'wsm'], sbh3: ['0776', 'wsm'], teos: ['0333', ''], as: ['0013', 'wsp'],
    acoh: ['0363', 'wm'], nh4f: ['1223', ''], mea: ['0152', 'wm'], h2se: ['0284', 'wm'], bcl3: ['0616', ''], h2: ['0001', ''],
    dcs: ['0442', ''], si2h6: [null, ''], n2o: ['0067', ''], sf4: ['1456', ''], sif4: ['0576', ''], pocl3: ['0190', ''],
    pcl3: ['0696', ''], sicl4: ['0574', ''], tcs: ['0591', ''], hmds: [null, ''], nbac: ['0399', 'wm'], xylene: [null, 'wsm'],
    egeea: ['0364', 'wsmx'], eg: ['0270', 'wsm'], etoh: ['0044', ''], sb: ['0775', 'wsm'], b2o3: ['0836', 'mx'], hg: ['0056', 'wsmx'],
    w: ['1404', 'wsm'], ta: ['1596', ''], n2: ['1198', ''], ar: ['0154', ''], no: ['1311', 'wsm']
  };
  const RGC = {
    h2so4: { ko: 'pH 2.0 이하인 강산은 특별관리물질', en: 'Specially controlled when a strong acid at pH 2.0 or below' },
    sbh3: { ko: '‘안티몬 및 그 화합물’ 항목으로 해당', en: 'Covered as “antimony and its compounds”' },
    sb: { ko: '삼산화안티몬만 특별관리물질', en: 'Only antimony trioxide is specially controlled' },
    h2se: { ko: '‘셀레늄 및 그 화합물’ 항목으로 해당(별표22에는 셀레늄 없음)', en: 'Covered as “selenium and its compounds” (selenium is not in Annex 22)' },
    hg: { ko: '아릴·알킬 화합물은 특별관리물질에서 제외', en: 'Aryl and alkyl compounds are excluded from special control' },
    as: { ko: '허가대상 유해물질로 별표21·22 마목에 해당(별표12 대상 아님)', en: 'A licensed substance, listed under item (e) of Annexes 21 and 22 (not in Annex 12)' },
    xylene: { ko: 'ICSC는 이성체별 카드(0084·0085·0086)', en: 'ICSC has one card per isomer (0084, 0085, 0086)' }
  };
  SHE.CHEMICALS.forEach((c) => { const m = META[c.id]; if (m) { c.ic = m[0]; c.rg = m[1]; } if (RGC[c.id]) c.rgc = RGC[c.id]; });
})();
/* 노출기준(TWA·STEL·C) 중 하나라도 있는 물질 — 수치 판정·호흡보호구·허가서 가스 행에만 쓴다 */
SHE.hasOel = (c) => !!c && (c.twa != null || c.stel != null || c.c != null);
SHE.REG = {
  w: { ko: '측정', en: 'Monitoring', t: { ko: '작업환경측정 대상 유해인자 (산안법 시행규칙 별표21)', en: 'Workplace monitoring agent (OSH Rule Annex 21)' } },
  s: { ko: '특검', en: 'Health check', t: { ko: '특수건강진단 대상 유해인자 (시행규칙 별표22)', en: 'Special health-check agent (OSH Rule Annex 22)' } },
  m: { ko: '관리대상', en: 'Controlled', t: { ko: '관리대상 유해물질 (안전보건규칙 별표12)', en: 'Controlled hazardous substance (Standards Rules Annex 12)' } },
  x: { ko: '특별관리', en: 'Special', t: { ko: '특별관리물질 (별표12) — 취급 시 근로자명·물질명·취급량·작업내용·보호구·사고 조치 기록(제439조), 특별관리물질임을 게시(제440조)', en: 'Specially controlled (Annex 12) — record worker, substance, amount, task, PPE and incidents when handled (Art. 439); post notice that it is specially controlled (Art. 440)' } },
  p: { ko: '허가대상', en: 'Licensed', t: { ko: '허가 대상 유해물질 (산안법 시행령 제88조)', en: 'Licensed hazardous substance (OSH Decree Art. 88)' } }
};
SHE.icscUrl = (c, lang) => (c && c.ic ? `https://chemicalsafety.ilo.org/dyn/icsc/showcard.display?p_card_id=${c.ic}&p_version=2&p_lang=${lang === 'en' ? 'en' : 'ko'}` : '');
SHE.msdsUrl = (c) => (c && /^\d+-\d+-\d$/.test(c.cas) ? `https://msds.kosha.or.kr/MSDSInfo/kcic/msdssearchMsds.do?searchCondition=cas_no&searchKeyword=${c.cas}` : '');

/* 특정고압가스 — 고압가스 안전관리법 제20조①(법에 적힌 9종)과 시행령 제16조(11종) 중 물질 DB에 있는 것.
   시행규칙 제46조①4호: 아래 가스는 저장능력과 관계없이 사용 전 사용신고 대상 (시험용 등 예외 제외). src: lawHpg, lawHpgDecree, lawHpgRule */
SHE.HPG = {
  sih4: { ko: '압축모노실란', en: 'compressed monosilane', b: 'act' },
  b2h6: { ko: '압축디보레인', en: 'compressed diborane', b: 'act' },
  ash3: { ko: '액화알진', en: 'liquefied arsine', b: 'act' },
  cl2:  { ko: '액화염소', en: 'liquefied chlorine', b: 'act' },
  nh3:  { ko: '액화암모니아', en: 'liquefied ammonia', b: 'act' },
  ph3:  { ko: '포스핀', en: 'phosphine', b: 'decree' },
  geh4: { ko: '게르만', en: 'germane', b: 'decree' },
  nf3:  { ko: '삼불화질소', en: 'nitrogen trifluoride', b: 'decree' },
  bf3:  { ko: '삼불화붕소', en: 'boron trifluoride', b: 'decree' },
  h2se: { ko: '셀렌화수소', en: 'hydrogen selenide', b: 'decree' },
  si2h6: { ko: '디실란', en: 'disilane', b: 'decree' },
  sf4:  { ko: '사불화유황', en: 'sulfur tetrafluoride', b: 'decree' },
  sif4: { ko: '사불화규소', en: 'silicon tetrafluoride', b: 'decree' }
};

/* 화학사고 즉시 신고 기준 — 「화학사고 즉시 신고에 관한 규정」 별표1 (기후에너지환경부예규 제4호, 원문 PDF 확인, src: mceReport)
   q = 제2호의 기준 유출·누출량(kg 또는 L). 표에 따로 없는 유해화학물질은 5. 반도체 사업장 관련 물질만 추림 */
SHE.CHEM_REPORT = [
  { id: 'hf', ko: '불산', en: 'Hydrofluoric acid', cas: '7664-39-3', q: 50 },
  { id: 'hcl', ko: '염산', en: 'Hydrochloric acid', cas: '7647-01-0', q: 50 },
  { id: 'hno3', ko: '질산', en: 'Nitric acid', cas: '7697-37-2', q: 500 },
  { id: 'h2so4', ko: '황산', en: 'Sulfuric acid', cas: '7664-93-9', q: 500 },
  { id: 'h2o2', ko: '과산화수소', en: 'Hydrogen peroxide', cas: '7722-84-1', q: 500 },
  { id: 'naoh', ko: '수산화나트륨', en: 'Sodium hydroxide', cas: '1310-73-2', q: 500 },
  { id: 'koh', ko: '수산화칼륨', en: 'Potassium hydroxide', cas: '1310-58-3', q: 500 },
  { id: 'nh4oh', ko: '수산화암모늄(암모니아수)', en: 'Ammonium hydroxide', cas: '1336-21-6', q: 500 },
  { id: 'cl2', ko: '염소', en: 'Chlorine', cas: '7782-50-5', q: 5 },
  { id: 'f2', ko: '플루오린(불소)', en: 'Fluorine', cas: '7782-41-4', q: 5 },
  { id: 'nh3', ko: '암모니아', en: 'Ammonia', cas: '7664-41-7', q: 50 },
  { id: 'h2s', ko: '황화수소', en: 'Hydrogen sulfide', cas: '7783-06-4', q: 50 },
  { id: 'ph3', ko: '포스핀', en: 'Phosphine', cas: '7803-51-2', q: 50 },
  { id: 'ash3', ko: '아르신', en: 'Arsine', cas: '7784-42-1', q: 50 },
  { id: 'b2h6', ko: '디보란', en: 'Diborane', cas: '19287-45-7', q: 50 },
  { id: 'other', ko: '그 밖의 유해화학물질', en: 'Other hazardous chemicals', cas: '', q: 5 },
  { id: 'none', ko: '유해화학물질이 아닌 물질', en: 'Not a hazardous chemical', cas: '', q: null }
];

/* 유해화학물질 취급시설 자체 점검 항목 — 화학물질관리법 제26조②1~5호 + 시행규칙 제26조②1~7호 (src: lawCca, lawCcaRule)
   주 1회 이상 점검, 결과 5년간 기록·비치. 법정 서식은 시행규칙 별지 제42호서식(점검대장) */
SHE.CCA_SELF = [
  { ko: '이송배관·접합부·밸브 등 관련 설비의 부식 등으로 인한 유출·누출 여부', en: 'Leaks from corroded transfer lines, joints, valves and related equipment', b: '법 26②1' },
  { ko: '고체 유해화학물질 용기를 밀폐 보관하고 있는지', en: 'Solid hazardous chemicals kept in closed containers', b: '법 26②2' },
  { ko: '액체·기체 유해화학물질을 완전히 밀폐 보관하고 있는지', en: 'Liquids and gases kept fully sealed', b: '법 26②3' },
  { ko: '보관용기의 파손·부식·균열 여부', en: 'Storage containers free of damage, corrosion or cracks', b: '법 26②4' },
  { ko: '탱크로리·트레일러 등 운반 장비의 부식·손상·노후화 여부', en: 'Tankers, trailers and other transport equipment free of corrosion, damage or wear', b: '법 26②5' },
  { ko: '물반응성 물질·인화성 고체의 물 접촉에 의한 화재·폭발 가능성', en: 'Fire/explosion risk from water contacting water-reactive substances or flammable solids', b: '규칙 26②1' },
  { ko: '인화성 액체 증기·인화성 가스가 공기 중에 있어 화재·폭발 가능성', en: 'Fire/explosion risk from flammable vapour or gas in the air', b: '규칙 26②2' },
  { ko: '자연발화 위험 물질이 취급시설·장비 주변에 있어 화재·폭발 가능성', en: 'Fire/explosion risk from pyrophoric substances near equipment', b: '규칙 26②3' },
  { ko: '누출검지설비·안전밸브·경보기·온도·압력계기의 정상 작동 여부', en: 'Leak detectors, relief valves, alarms and temperature/pressure gauges working', b: '규칙 26②4' },
  { ko: '개인보호장구가 본래 성능을 유지하는지', en: 'PPE still performs as intended', b: '규칙 26②5' },
  { ko: '저장·보관설비의 부식·손상·균열 등으로 인한 유출·누출 여부', en: 'Leaks from corroded, damaged or cracked storage equipment', b: '규칙 26②6' },
  { ko: '방류벽·트렌치 등 누출 확산 방지 집수시설이 본래 성능을 유지하는지', en: 'Bunds, trenches and other containment still perform as intended', b: '규칙 26②7' }
];

/* 공정안전보고서 제출 대상 — 유해·위험물질 규정량 (산안법 시행령 [별표13], 2026.8.1 시행본 원문 PDF 확인, src: lawDecree)
   반도체 사업장에서 쓰일 수 있는 물질만 추림. tq = 제조·취급·저장 규정량(kg), tqs = 저장 규정량(kg, 인화성 가스·액체만) */
SHE.PSM_TQ = [
  { n: 1, id: 'flamgas', ko: '인화성 가스', en: 'Flammable gases', cas: '-', tq: 5000, tqs: 200000, memo: { ko: '수소·실란·디클로로실란처럼 따로 적힌 물질은 그 행을 적용', en: 'Use the specific row for listed gases such as hydrogen, silane, dichlorosilane' } },
  { n: 2, id: 'flamliq', ko: '인화성 액체', en: 'Flammable liquids', cas: '-', tq: 5000, tqs: 200000, memo: { ko: '인화점 60℃ 이하 등 (예: IPA·아세톤)', en: 'Flash point ≤ 60 °C etc. (e.g. IPA, acetone)' } },
  { n: 6, id: 'nh3', ko: '암모니아', en: 'Ammonia', cas: '7664-41-7', tq: 10000, chem: 'nh3' },
  { n: 7, id: 'cl2', ko: '염소', en: 'Chlorine', cas: '7782-50-5', tq: 1500, chem: 'cl2' },
  { n: 12, id: 'ahf', ko: '불화수소(무수불산)', en: 'Hydrogen fluoride (anhydrous)', cas: '7664-39-3', tq: 1000, chem: 'hf' },
  { n: 13, id: 'ahcl', ko: '염화수소(무수염산)', en: 'Hydrogen chloride (anhydrous)', cas: '7647-01-0', tq: 10000, chem: 'hcl' },
  { n: 14, id: 'h2s', ko: '황화수소', en: 'Hydrogen sulfide', cas: '7783-06-4', tq: 1000, chem: 'h2s' },
  { n: 18, id: 'h2', ko: '수소', en: 'Hydrogen', cas: '1333-74-0', tq: 5000, chem: 'h2' },
  { n: 20, id: 'ph3', ko: '포스핀', en: 'Phosphine', cas: '7803-51-2', tq: 500, chem: 'ph3' },
  { n: 21, id: 'sih4', ko: '실란(Silane)', en: 'Silane', cas: '7803-62-5', tq: 1000, chem: 'sih4' },
  { n: 22, id: 'hno3', ko: '질산(중량 94.5% 이상)', en: 'Nitric acid (≥ 94.5 wt%)', cas: '7697-37-2', tq: 50000, chem: 'hno3' },
  { n: 24, id: 'h2o2', ko: '과산화수소(중량 52% 이상)', en: 'Hydrogen peroxide (≥ 52 wt%)', cas: '7722-84-1', tq: 10000, chem: 'h2o2' },
  { n: 27, id: 'hbr', ko: '브롬화수소', en: 'Hydrogen bromide', cas: '10035-10-6', tq: 10000, chem: 'hbr' },
  { n: 33, id: 'no', ko: '일산화질소', en: 'Nitric oxide', cas: '10102-43-9', tq: 10000, chem: 'no' },
  { n: 34, id: 'bcl3', ko: '붕소트리염화물', en: 'Boron trichloride', cas: '10294-34-5', tq: 10000, chem: 'bcl3' },
  { n: 36, id: 'bf3', ko: '삼불화붕소', en: 'Boron trifluoride', cas: '7637-07-2', tq: 1000, chem: 'bf3' },
  { n: 38, id: 'clf3', ko: '염소트리플루오르화(삼불화염소)', en: 'Chlorine trifluoride', cas: '7790-91-2', tq: 1000, chem: 'clf3' },
  { n: 39, id: 'f2', ko: '불소', en: 'Fluorine', cas: '7782-41-4', tq: 500, chem: 'f2' },
  { n: 41, id: 'nf3', ko: '질소트리플루오르화물(삼불화질소)', en: 'Nitrogen trifluoride', cas: '7783-54-2', tq: 20000, chem: 'nf3' },
  { n: 45, id: 'dcs', ko: '디클로로실란', en: 'Dichlorosilane', cas: '4109-96-0', tq: 1000, chem: 'dcs' },
  { n: 48, id: 'hfaq', ko: '불산(중량 10% 이상)', en: 'Hydrofluoric acid (≥ 10 wt%)', cas: '7664-39-3', tq: 10000, chem: 'hf' },
  { n: 49, id: 'hclaq', ko: '염산(중량 20% 이상)', en: 'Hydrochloric acid (≥ 20 wt%)', cas: '7647-01-0', tq: 20000, chem: 'hcl' },
  { n: 50, id: 'h2so4', ko: '황산(중량 20% 이상)', en: 'Sulfuric acid (≥ 20 wt%)', cas: '7664-93-9', tq: 20000, chem: 'h2so4' },
  { n: 51, id: 'nh4oh', ko: '암모니아수(중량 20% 이상)', en: 'Ammonia solution (≥ 20 wt%)', cas: '1336-21-6', tq: 50000, chem: 'nh3' }
];

/* 특별교육 대상 작업 — 산안법 시행규칙 [별표5] 제1호라목 중 반도체 사업장과 관련될 수 있는 항목 (2026.8.1 시행본 원문 PDF 확인, src: lawRule)
   교육시간은 [별표4]: 16시간 이상(최초 작업 전 4시간 이상, 나머지 3개월 이내 분할), 단기간·간헐적 작업 2시간 이상 */
SHE.SPECIAL_EDU = {
  4:  { ko: '폭발성·물반응성·자기반응성·자기발열성 물질, 자연발화성 액체·고체 및 인화성 액체의 제조 또는 취급작업', en: 'Making or handling explosive, water-reactive, self-reactive or self-heating substances, pyrophoric liquids/solids and flammable liquids' },
  7:  { ko: '화학설비의 탱크 내 작업', en: 'Work inside tanks of chemical equipment' },
  13: { ko: '운반용 등 하역기계를 5대 이상 보유한 사업장에서 해당 기계로 하는 작업', en: 'Work with materials-handling machines at sites that have five or more of them' },
  14: { ko: '1톤 이상의 크레인을 사용하는 작업 (1톤 미만 크레인·호이스트 5대 이상 보유 사업장 포함)', en: 'Work with cranes of 1 t or more (or sites with five or more smaller cranes/hoists)' },
  17: { ko: '전압이 75볼트 이상인 정전 및 활선작업', en: 'De-energised and live work at 75 V or more' },
  19: { ko: '굴착면의 높이가 2미터 이상이 되는 지반 굴착작업 (터널·수직갱 외의 갱 굴착 제외)', en: 'Ground excavation 2 m deep or more (excluding tunnels and shafts)' },
  32: { ko: '게이지 압력 1kg/㎠ 이상으로 사용하는 압력용기의 설치 및 취급작업', en: 'Installing and handling pressure vessels used at ≥ 1 kg/cm² gauge' },
  33: { ko: '방사선 업무에 관계되는 작업 (의료·실험용 제외)', en: 'Work related to radiation duties (excluding medical and laboratory use)' },
  34: { ko: '밀폐공간에서의 작업', en: 'Work in confined spaces' },
  35: { ko: '허가 또는 관리 대상 유해물질의 제조 또는 취급작업', en: 'Making or handling licensed or controlled hazardous substances' },
  36: { ko: '로봇작업', en: 'Robot work' },
  38: { ko: '가연물이 있는 장소에서 하는 화재위험작업', en: 'Fire-risk work where combustibles are present' }
};

/* 밀폐공간 적정공기 (안전보건규칙 제618조) + 미국 OSHA 1910.146 */
SHE.CONFINED = {
  kr: { o2Min: 18, o2Max: 23.5, co2Max: 1.5, coMax: 30, h2sMax: 10 },
  us: { o2Min: 19.5, o2Max: 23.5, lelMax: 10 }
};

/* 소음 노출기준 (고시 별표2-1) : 90dB 8h, 5dB 교환 / 115dB(A) 초과 노출 금지 */
SHE.NOISE_TABLE = [[8, 90], [4, 95], [2, 100], [1, 105], [0.5, 110], [0.25, 115]];
/* 충격소음 노출기준 (고시 별표2-2) : 1일 노출횟수 → dB(A) */
SHE.IMPULSE_TABLE = [[100, 140], [1000, 130], [10000, 120]];

/* 고온 노출기준 WBGT(℃) (고시 별표3) : rows=작업휴식, cols=경/중등/중 */
SHE.WBGT_TABLE = {
  rows: [
    { id: 'cont', ko: '계속 작업', en: 'Continuous work', v: [30.0, 26.7, 25.0] },
    { id: 'r75', ko: '매시간 75% 작업, 25% 휴식', en: '75% work / 25% rest each hour', v: [30.6, 28.0, 25.9] },
    { id: 'r50', ko: '매시간 50% 작업, 50% 휴식', en: '50% work / 50% rest each hour', v: [31.4, 29.4, 27.9] },
    { id: 'r25', ko: '매시간 25% 작업, 75% 휴식', en: '25% work / 75% rest each hour', v: [32.2, 31.1, 30.0] }
  ],
  loads: [
    { ko: '경작업', en: 'Light work', d: { ko: '시간당 200kcal까지 — 앉거나 서서 기계 조정 등 손·팔을 가볍게 쓰는 일', en: 'Up to 200 kcal/h — sitting or standing, light hand/arm work such as adjusting machines' } },
    { ko: '중등작업', en: 'Moderate work', d: { ko: '시간당 200~350kcal — 물체를 들거나 밀면서 걸어다니는 일', en: '200–350 kcal/h — walking while lifting or pushing objects' } },
    { ko: '중작업', en: 'Heavy work', d: { ko: '시간당 350~500kcal — 곡괭이질·삽질 등', en: '350–500 kcal/h — e.g. pick-axe or shovel work' } }
  ]
};

/* 조도 (안전보건규칙 제8조) — 갱내 작업장·감광재료 취급 작업장은 적용 제외 */
SHE.LUX = [
  { id: 'ultra', ko: '초정밀작업', en: 'Ultra-precision work', min: 750 },
  { id: 'fine', ko: '정밀작업', en: 'Precision work', min: 300 },
  { id: 'normal', ko: '보통작업', en: 'Ordinary work', min: 150 },
  { id: 'other', ko: '그 밖의 작업', en: 'Other work', min: 75 }
];

/* 법정 안전보건교육 시간 (산안법 시행규칙 별표4, 2025.5.30 개정) */
SHE.TRAINING = [
  { g: { ko: '근로자 정기교육', en: 'Worker periodic training' }, rows: [
    { who: { ko: '사무직 종사 근로자', en: 'Office workers' }, h: { ko: '매반기 6시간 이상', en: '≥ 6 h every half-year' } },
    { who: { ko: '판매업무 직접 종사 근로자', en: 'Workers directly in sales' }, h: { ko: '매반기 6시간 이상', en: '≥ 6 h every half-year' } },
    { who: { ko: '그 외 근로자 (생산·설비 등)', en: 'All other workers (production, facilities, etc.)' }, h: { ko: '매반기 12시간 이상', en: '≥ 12 h every half-year' } } ] },
  { g: { ko: '채용 시 교육', en: 'Training on hiring' }, rows: [
    { who: { ko: '일용근로자·계약기간 1주일 이하 기간제', en: 'Day labourers / fixed-term ≤ 1 week' }, h: { ko: '1시간 이상', en: '≥ 1 h' } },
    { who: { ko: '계약기간 1주일 초과 1개월 이하 기간제', en: 'Fixed-term > 1 week and ≤ 1 month' }, h: { ko: '4시간 이상', en: '≥ 4 h' } },
    { who: { ko: '그 밖의 근로자', en: 'All other workers' }, h: { ko: '8시간 이상', en: '≥ 8 h' } } ] },
  { g: { ko: '작업내용 변경 시 교육', en: 'Training on change of work' }, rows: [
    { who: { ko: '일용근로자·계약기간 1주일 이하 기간제', en: 'Day labourers / fixed-term ≤ 1 week' }, h: { ko: '1시간 이상', en: '≥ 1 h' } },
    { who: { ko: '그 밖의 근로자', en: 'All other workers' }, h: { ko: '2시간 이상', en: '≥ 2 h' } } ] },
  { g: { ko: '특별교육 (별표5 제1호라목 대상 작업)', en: 'Special training (work listed in Annex 5, item 1-d)' }, rows: [
    { who: { ko: '일용·1주일 이하 기간제 (제39호 제외 작업)', en: 'Day / fixed-term ≤ 1 week (excluding item 39)' }, h: { ko: '2시간 이상', en: '≥ 2 h' } },
    { who: { ko: '일용·1주일 이하 기간제 (제39호 작업)', en: 'Day / fixed-term ≤ 1 week (item 39 work)' }, h: { ko: '8시간 이상', en: '≥ 8 h' } },
    { who: { ko: '그 밖의 근로자', en: 'All other workers' }, h: { ko: '16시간 이상 (최초 작업 전 4시간 이상, 나머지 12시간은 3개월 이내 분할 가능) / 단기간·간헐적 작업 2시간 이상', en: '≥ 16 h (≥ 4 h before first task; remaining 12 h may be split within 3 months) / short-term or intermittent work ≥ 2 h' } } ] },
  { g: { ko: '건설업 기초안전·보건교육', en: 'Basic construction safety & health training' }, rows: [
    { who: { ko: '건설 일용근로자', en: 'Construction day labourers' }, h: { ko: '4시간 이상', en: '≥ 4 h' } } ] },
  { g: { ko: '관리감독자 교육', en: 'Supervisor training' }, rows: [
    { who: { ko: '정기교육', en: 'Periodic' }, h: { ko: '연간 16시간 이상', en: '≥ 16 h per year' } },
    { who: { ko: '채용 시 교육', en: 'On hiring' }, h: { ko: '8시간 이상', en: '≥ 8 h' } },
    { who: { ko: '작업내용 변경 시 교육', en: 'On change of work' }, h: { ko: '2시간 이상', en: '≥ 2 h' } },
    { who: { ko: '특별교육', en: 'Special training' }, h: { ko: '16시간 이상 (단기간·간헐적 작업 2시간 이상)', en: '≥ 16 h (short-term or intermittent work ≥ 2 h)' } } ] },
  { g: { ko: '안전보건관리책임자 등 직무교육 (별표4 제2호 — 신규는 선임 후 3개월 이내, 보수는 신규교육 이수 후 매 2년 기준 전후 6개월, 규칙 제29조)', en: 'Job training for managers (Annex 4, item 2 — initial within 3 months of appointment; refresher around every 2-year mark ±6 months, Rule Art. 29)' }, rows: [
    { who: { ko: '안전보건관리책임자', en: 'Safety & health general manager' }, h: { ko: '신규 6시간 이상 · 보수 6시간 이상', en: 'Initial ≥ 6 h · refresher ≥ 6 h' } },
    { who: { ko: '안전관리자·안전관리전문기관 종사자', en: 'Safety managers and safety-agency staff' }, h: { ko: '신규 34시간 이상 · 보수 24시간 이상', en: 'Initial ≥ 34 h · refresher ≥ 24 h' } },
    { who: { ko: '보건관리자·보건관리전문기관 종사자', en: 'Health managers and health-agency staff' }, h: { ko: '신규 34시간 이상 · 보수 24시간 이상', en: 'Initial ≥ 34 h · refresher ≥ 24 h' } },
    { who: { ko: '안전보건관리담당자', en: 'Safety & health officer (small sites)' }, h: { ko: '보수 8시간 이상', en: 'Refresher ≥ 8 h' } } ] }
];

/* 위험물안전관리법 시행령 [별표1] 위험물 및 지정수량 (개정 2024.4.30, 원문 PDF 확인 2026-09-25, src: lawDgDecree)
   반도체 사업장에서 다룰 수 있는 제3류(자연발화성·금수성)·제4류(인화성 액체)·제6류(산화성 액체)만 싣는다. u: 지정수량 단위 */
SHE.DG_CLASS = {
  3: { ko: '제3류 자연발화성·금수성 물질', en: 'Class 3 — pyrophoric and water-reactive' },
  4: { ko: '제4류 인화성 액체', en: 'Class 4 — flammable liquids' },
  6: { ko: '제6류 산화성 액체', en: 'Class 6 — oxidising liquids' }
};
SHE.DG_ITEMS = [
  { id: 'k4sp', cls: 4, q: 50, u: 'L', ko: '특수인화물', en: 'Special flammables', d: { ko: '이황화탄소·다이에틸에터, 발화점 100°C 이하 또는 인화점 -20°C 이하이고 끓는점 40°C 이하', en: 'Carbon disulfide, diethyl ether; autoignition ≤ 100 °C, or flash point ≤ -20 °C with boiling point ≤ 40 °C' } },
  { id: 'k41n', cls: 4, q: 200, u: 'L', ko: '제1석유류 (비수용성)', en: 'Class 1 petroleum (not water-soluble)', d: { ko: '인화점 21°C 미만 (별표1 예시: 아세톤·휘발유), 비수용성', en: 'Flash point < 21 °C (Annex examples: acetone, gasoline), not water-soluble' } },
  { id: 'k41w', cls: 4, q: 400, u: 'L', ko: '제1석유류 (수용성)', en: 'Class 1 petroleum (water-soluble)', d: { ko: '인화점 21°C 미만 (별표1 예시: 아세톤·휘발유), 수용성', en: 'Flash point < 21 °C (Annex examples: acetone, gasoline), water-soluble' } },
  { id: 'k4al', cls: 4, q: 400, u: 'L', ko: '알코올류', en: 'Alcohols', d: { ko: '탄소 1~3개 포화1가 알코올(변성알코올 포함). 함량 60중량% 미만 수용액 등은 제외', en: 'Saturated monohydric alcohols with 1–3 carbons (incl. denatured); aqueous solutions under 60 wt% etc. excluded' } },
  { id: 'k42n', cls: 4, q: 1000, u: 'L', ko: '제2석유류 (비수용성)', en: 'Class 2 petroleum (not water-soluble)', d: { ko: '인화점 21°C 이상 70°C 미만 (별표1 예시: 등유·경유), 비수용성', en: 'Flash point 21–70 °C (Annex examples: kerosene, diesel), not water-soluble' } },
  { id: 'k42w', cls: 4, q: 2000, u: 'L', ko: '제2석유류 (수용성)', en: 'Class 2 petroleum (water-soluble)', d: { ko: '인화점 21°C 이상 70°C 미만, 수용성', en: 'Flash point 21–70 °C, water-soluble' } },
  { id: 'k43n', cls: 4, q: 2000, u: 'L', ko: '제3석유류 (비수용성)', en: 'Class 3 petroleum (not water-soluble)', d: { ko: '인화점 70°C 이상 200°C 미만 (별표1 예시: 중유·크레오소트유), 비수용성', en: 'Flash point 70–200 °C (Annex examples: heavy oil, creosote), not water-soluble' } },
  { id: 'k43w', cls: 4, q: 4000, u: 'L', ko: '제3석유류 (수용성)', en: 'Class 3 petroleum (water-soluble)', d: { ko: '인화점 70°C 이상 200°C 미만, 수용성', en: 'Flash point 70–200 °C, water-soluble' } },
  { id: 'k44', cls: 4, q: 6000, u: 'L', ko: '제4석유류', en: 'Class 4 petroleum', d: { ko: '인화점 200°C 이상 250°C 미만 (별표1 예시: 기어유·실린더유)', en: 'Flash point 200–250 °C (Annex examples: gear oil, cylinder oil)' } },
  { id: 'k4oil', cls: 4, q: 10000, u: 'L', ko: '동식물유류', en: 'Animal and vegetable oils', d: { ko: '인화점 250°C 미만', en: 'Flash point < 250 °C' } },
  { id: 'k3k', cls: 3, q: 10, u: 'kg', ko: '칼륨', en: 'Potassium' },
  { id: 'k3na', cls: 3, q: 10, u: 'kg', ko: '나트륨', en: 'Sodium' },
  { id: 'k3aa', cls: 3, q: 10, u: 'kg', ko: '알킬알루미늄', en: 'Alkylaluminium compounds', d: { ko: '예: 트라이메틸알루미늄(증착 전구체)', en: 'e.g. trimethylaluminium (deposition precursor)' } },
  { id: 'k3li', cls: 3, q: 10, u: 'kg', ko: '알킬리튬', en: 'Alkyllithium compounds' },
  { id: 'k3p', cls: 3, q: 20, u: 'kg', ko: '황린', en: 'White phosphorus' },
  { id: 'k3am', cls: 3, q: 50, u: 'kg', ko: '알칼리금속(칼륨·나트륨 제외)·알칼리토금속', en: 'Alkali metals (other than K, Na) and alkaline-earth metals' },
  { id: 'k3om', cls: 3, q: 50, u: 'kg', ko: '유기금속화합물(알킬알루미늄·알킬리튬 제외)', en: 'Organometallic compounds (other than alkylaluminium and alkyllithium)' },
  { id: 'k3mh', cls: 3, q: 300, u: 'kg', ko: '금속의 수소화물', en: 'Metal hydrides' },
  { id: 'k3mp', cls: 3, q: 300, u: 'kg', ko: '금속의 인화물', en: 'Metal phosphides' },
  { id: 'k3cc', cls: 3, q: 300, u: 'kg', ko: '칼슘 또는 알루미늄의 탄화물', en: 'Calcium or aluminium carbides' },
  { id: 'k6pc', cls: 6, q: 300, u: 'kg', ko: '과염소산', en: 'Perchloric acid' },
  { id: 'k6hp', cls: 6, q: 300, u: 'kg', ko: '과산화수소 (농도 36중량% 이상만)', en: 'Hydrogen peroxide (only ≥ 36 wt%)' },
  { id: 'k6na', cls: 6, q: 300, u: 'kg', ko: '질산 (비중 1.49 이상만)', en: 'Nitric acid (only specific gravity ≥ 1.49)' }
];
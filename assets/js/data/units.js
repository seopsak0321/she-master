/* 단위 환산 데이터 — 각 물리량의 첫 단위(SI)를 기준으로 f = 1단위가 기준 단위로 몇인지.
   값: 미국 NIST SP 811(2008) 부록 B 환산계수(src: nistSp811), SI 정의값은 BIPM SI 브로슈어 9판(src: bipmSi).
   정의로 정확히 정해지는 단위는 정의에서 계산한 정확한 값을 쓴다:
   in = 0.0254 m, ft = 0.3048 m, lb = 0.45359237 kg, 미국 갤런 = 231 in³, 표준중력 g = 9.80665 m/s²,
   lbf = lb·g, kgf = kg·g, atm = 101325 Pa, Torr = atm/760, Btu(IT) = 1055.05585262 J, cal(IT) = 4.1868 J, cal(열화학) = 4.184 J,
   eV = 1.602176634×10⁻¹⁹ J(2019 SI 정의값). mmHg·inHg·inH₂O는 NIST의 관례값(conventional) */
window.SHE = window.SHE || {};
(function () {
  const IN = 0.0254, FT = 0.3048, YD = 0.9144, MI = 1609.344, LB = 0.45359237, G = 9.80665;
  const GAL = 231 * IN * IN * IN, FT3 = FT * FT * FT, LBF = LB * G, BTU = 1055.05585262;
  const U = (id, ko, en, f, sym) => ({ id, ko, en, f, sym: sym || id });
  SHE.UNITS = [
    { id: 'len', ko: '길이', en: 'Length', units: [
      U('m', '미터', 'metre', 1), U('km', '킬로미터', 'kilometre', 1e3), U('cm', '센티미터', 'centimetre', 1e-2), U('mm', '밀리미터', 'millimetre', 1e-3),
      U('um', '마이크로미터', 'micrometre', 1e-6, 'μm'), U('nm', '나노미터', 'nanometre', 1e-9), U('A', '옹스트롬', 'ångström', 1e-10, 'Å'),
      U('in', '인치', 'inch', IN), U('ft', '피트', 'foot', FT), U('yd', '야드', 'yard', YD), U('mi', '마일', 'mile', MI),
      U('nmi', '해리', 'nautical mile', 1852), U('mil', '밀(1/1000 in)', 'mil (thou)', IN / 1000) ] },
    { id: 'area', ko: '넓이', en: 'Area', units: [
      U('m2', '제곱미터', 'square metre', 1, 'm²'), U('km2', '제곱킬로미터', 'square kilometre', 1e6, 'km²'), U('ha', '헥타르', 'hectare', 1e4), U('a', '아르', 'are', 100),
      U('cm2', '제곱센티미터', 'square centimetre', 1e-4, 'cm²'), U('mm2', '제곱밀리미터', 'square millimetre', 1e-6, 'mm²'),
      U('in2', '제곱인치', 'square inch', IN * IN, 'in²'), U('ft2', '제곱피트', 'square foot', FT * FT, 'ft²'), U('yd2', '제곱야드', 'square yard', YD * YD, 'yd²'),
      U('acre', '에이커(국제, 43,560 ft²)', 'acre (international, 43 560 ft²)', 43560 * FT * FT), U('mi2', '제곱마일', 'square mile', MI * MI, 'mi²') ] },
    { id: 'vol', ko: '부피', en: 'Volume', units: [
      U('m3', '세제곱미터', 'cubic metre', 1, 'm³'), U('L', '리터', 'litre', 1e-3), U('mL', '밀리리터', 'millilitre', 1e-6), U('uL', '마이크로리터', 'microlitre', 1e-9, 'μL'),
      U('cm3', '세제곱센티미터(cc)', 'cubic centimetre (cc)', 1e-6, 'cm³'), U('in3', '세제곱인치', 'cubic inch', IN * IN * IN, 'in³'), U('ft3', '세제곱피트', 'cubic foot', FT3, 'ft³'),
      U('gal', '갤런(미국)', 'gallon (US)', GAL, 'gal (US)'), U('galuk', '갤런(영국)', 'gallon (UK)', 4.54609e-3, 'gal (UK)'), U('qt', '쿼트(미국 액량)', 'quart (US liquid)', GAL / 4),
      U('pt', '파인트(미국 액량)', 'pint (US liquid)', GAL / 8), U('floz', '액량 온스(미국)', 'fluid ounce (US)', GAL / 128, 'fl oz'), U('bbl', '배럴(석유, 42 US gal)', 'barrel (oil, 42 US gal)', 42 * GAL) ] },
    { id: 'mass', ko: '질량', en: 'Mass', units: [
      U('kg', '킬로그램', 'kilogram', 1), U('g', '그램', 'gram', 1e-3), U('mg', '밀리그램', 'milligram', 1e-6), U('ug', '마이크로그램', 'microgram', 1e-9, 'μg'),
      U('t', '톤(미터법)', 'tonne', 1e3), U('lb', '파운드', 'pound', LB), U('oz', '온스', 'ounce', LB / 16), U('gr', '그레인', 'grain', LB / 7000),
      U('ton', '쇼트톤(2,000 lb)', 'short ton (2000 lb)', 2000 * LB, 'short ton'), U('lton', '롱톤(2,240 lb)', 'long ton (2240 lb)', 2240 * LB, 'long ton'), U('ct', '캐럿', 'carat', 2e-4) ] },
    { id: 'time', ko: '시간', en: 'Time', units: [
      U('s', '초', 'second', 1), U('ms', '밀리초', 'millisecond', 1e-3), U('us', '마이크로초', 'microsecond', 1e-6, 'μs'), U('ns', '나노초', 'nanosecond', 1e-9),
      U('min', '분', 'minute', 60), U('h', '시간', 'hour', 3600), U('d', '일', 'day', 86400), U('wk', '주', 'week', 604800), U('yr', '년(365일)', 'year (365 d)', 31536000) ] },
    { id: 'temp', ko: '온도', en: 'Temperature', affine: true, units: [
      { id: 'C', ko: '섭씨', en: 'Celsius', sym: '°C', to: (v) => v + 273.15, from: (k) => k - 273.15 },
      { id: 'K', ko: '켈빈', en: 'kelvin', sym: 'K', to: (v) => v, from: (k) => k },
      { id: 'F', ko: '화씨', en: 'Fahrenheit', sym: '°F', to: (v) => (v - 32) * 5 / 9 + 273.15, from: (k) => (k - 273.15) * 9 / 5 + 32 },
      { id: 'R', ko: '랭킨', en: 'Rankine', sym: '°R', to: (v) => v * 5 / 9, from: (k) => k * 9 / 5 } ] },
    { id: 'pres', ko: '압력', en: 'Pressure', note: { ko: '게이지압과 절대압은 환산과 별개입니다 — 절대압 = 게이지압 + 대기압(표준 101.325 kPa). 고압가스 기준처럼 게이지압으로 정한 값은 게이지압끼리 비교하세요.', en: 'Gauge versus absolute is separate from unit conversion — absolute = gauge + atmospheric (standard 101.325 kPa). Compare gauge-based limits, such as high-pressure gas thresholds, in gauge terms.' }, units: [
      U('Pa', '파스칼', 'pascal', 1), U('hPa', '헥토파스칼', 'hectopascal', 100), U('kPa', '킬로파스칼', 'kilopascal', 1e3), U('MPa', '메가파스칼', 'megapascal', 1e6),
      U('bar', '바', 'bar', 1e5), U('mbar', '밀리바', 'millibar', 100), U('atm', '표준기압', 'standard atmosphere', 101325), U('Torr', '토르', 'torr', 101325 / 760),
      U('mmHg', '수은주밀리미터(관례값)', 'millimetre of mercury (conventional)', 133.322387415), U('inHg', '수은주인치(관례값)', 'inch of mercury (conventional)', 3386.388640341),
      U('mmH2O', '수주밀리미터(관례값)', 'millimetre of water (conventional)', G, 'mmH₂O'), U('inH2O', '수주인치(관례값)', 'inch of water (conventional)', G * 25.4, 'inH₂O'),
      U('psi', '제곱인치당 파운드힘', 'pound-force per square inch', LBF / (IN * IN)), U('kgfcm2', '제곱센티미터당 킬로그램힘', 'kilogram-force per square centimetre', G * 1e4, 'kgf/cm²') ] },
    { id: 'energy', ko: '에너지·열량', en: 'Energy', units: [
      U('J', '줄', 'joule', 1), U('kJ', '킬로줄', 'kilojoule', 1e3), U('MJ', '메가줄', 'megajoule', 1e6), U('GJ', '기가줄', 'gigajoule', 1e9),
      U('Wh', '와트시', 'watt-hour', 3600), U('kWh', '킬로와트시', 'kilowatt-hour', 3.6e6), U('MWh', '메가와트시', 'megawatt-hour', 3.6e9),
      U('calth', '칼로리(열화학)', 'calorie (thermochemical)', 4.184, 'cal_th'), U('kcalth', '킬로칼로리(열화학)', 'kilocalorie (thermochemical)', 4184, 'kcal_th'),
      U('calit', '칼로리(IT)', 'calorie (IT)', 4.1868, 'cal_IT'), U('kcalit', '킬로칼로리(IT)', 'kilocalorie (IT)', 4186.8, 'kcal_IT'),
      U('Btu', '영국열량단위(IT)', 'British thermal unit (IT)', BTU, 'Btu'), U('eV', '전자볼트', 'electronvolt', 1.602176634e-19), U('erg', '에르그', 'erg', 1e-7),
      U('ftlbf', '피트파운드힘', 'foot pound-force', FT * LBF, 'ft·lbf') ] },
    { id: 'power', ko: '일률·동력', en: 'Power', units: [
      U('W', '와트', 'watt', 1), U('kW', '킬로와트', 'kilowatt', 1e3), U('MW', '메가와트', 'megawatt', 1e6),
      U('hp', '마력(영국, 550 ft·lbf/s)', 'horsepower (550 ft·lbf/s)', 550 * FT * LBF), U('PS', '마력(미터법)', 'metric horsepower', 75 * G),
      U('Btuh', '시간당 Btu', 'Btu per hour', BTU / 3600, 'Btu/h'), U('kcalh', '시간당 킬로칼로리(IT)', 'kilocalorie (IT) per hour', 4186.8 / 3600, 'kcal/h'),
      U('USRT', '냉동톤(미국, 12,000 Btu/h)', 'ton of refrigeration (US, 12 000 Btu/h)', 12000 * BTU / 3600) ] },
    { id: 'force', ko: '힘', en: 'Force', units: [
      U('N', '뉴턴', 'newton', 1), U('kN', '킬로뉴턴', 'kilonewton', 1e3), U('dyn', '다인', 'dyne', 1e-5),
      U('kgf', '킬로그램힘', 'kilogram-force', G), U('tf', '톤힘', 'tonne-force', 1e3 * G), U('lbf', '파운드힘', 'pound-force', LBF) ] },
    { id: 'torque', ko: '토크(돌림힘)', en: 'Torque', units: [
      U('Nm', '뉴턴미터', 'newton metre', 1, 'N·m'), U('kgfm', '킬로그램힘미터', 'kilogram-force metre', G, 'kgf·m'), U('kgfcm', '킬로그램힘센티미터', 'kilogram-force centimetre', G / 100, 'kgf·cm'),
      U('lbfft', '파운드힘피트', 'pound-force foot', LBF * FT, 'lbf·ft'), U('lbfin', '파운드힘인치', 'pound-force inch', LBF * IN, 'lbf·in') ] },
    { id: 'speed', ko: '속도·풍속', en: 'Speed', units: [
      U('ms', '미터 매 초', 'metre per second', 1, 'm/s'), U('kmh', '킬로미터 매 시', 'kilometre per hour', 1 / 3.6, 'km/h'), U('cms', '센티미터 매 초', 'centimetre per second', 0.01, 'cm/s'),
      U('mph', '마일 매 시', 'mile per hour', MI / 3600), U('kn', '노트', 'knot', 1852 / 3600), U('fts', '피트 매 초', 'foot per second', FT, 'ft/s'), U('fpm', '피트 매 분', 'foot per minute', FT / 60, 'ft/min') ] },
    { id: 'flow', ko: '유량(부피)', en: 'Flow rate (volume)', units: [
      U('m3s', '세제곱미터 매 초', 'cubic metre per second', 1, 'm³/s'), U('cmm', '세제곱미터 매 분(CMM)', 'cubic metre per minute (CMM)', 1 / 60, 'm³/min'), U('cmh', '세제곱미터 매 시(CMH)', 'cubic metre per hour (CMH)', 1 / 3600, 'm³/h'),
      U('Ls', '리터 매 초', 'litre per second', 1e-3, 'L/s'), U('Lmin', '리터 매 분', 'litre per minute', 1e-3 / 60, 'L/min'), U('mLmin', '밀리리터 매 분', 'millilitre per minute', 1e-6 / 60, 'mL/min'),
      U('cfm', '세제곱피트 매 분(CFM)', 'cubic foot per minute (CFM)', FT3 / 60, 'ft³/min'), U('gpm', '갤런(미국) 매 분', 'US gallon per minute', GAL / 60, 'gal/min') ] },
    { id: 'dens', ko: '밀도', en: 'Density', units: [
      U('kgm3', '킬로그램 매 세제곱미터', 'kilogram per cubic metre', 1, 'kg/m³'), U('gcm3', '그램 매 세제곱센티미터', 'gram per cubic centimetre', 1e3, 'g/cm³'), U('gL', '그램 매 리터', 'gram per litre', 1, 'g/L'),
      U('kgL', '킬로그램 매 리터', 'kilogram per litre', 1e3, 'kg/L'), U('lbft3', '파운드 매 세제곱피트', 'pound per cubic foot', LB / FT3, 'lb/ft³'), U('lbgal', '파운드 매 갤런(미국)', 'pound per US gallon', LB / GAL, 'lb/gal') ] },
    { id: 'angle', ko: '각도', en: 'Angle', units: [
      U('deg', '도', 'degree', Math.PI / 180, '°'), U('rad', '라디안', 'radian', 1), U('arcmin', '분(각도)', 'arcminute', Math.PI / 10800, '′'), U('arcsec', '초(각도)', 'arcsecond', Math.PI / 648000, '″'),
      U('grad', '그라드', 'gradian', Math.PI / 200, 'gon'), U('rev', '회전', 'revolution', 2 * Math.PI, 'rev') ] },
    { id: 'freq', ko: '진동수·회전수', en: 'Frequency', units: [
      U('Hz', '헤르츠', 'hertz', 1), U('kHz', '킬로헤르츠', 'kilohertz', 1e3), U('MHz', '메가헤르츠', 'megahertz', 1e6), U('GHz', '기가헤르츠', 'gigahertz', 1e9), U('rpm', '분당 회전수', 'revolutions per minute', 1 / 60) ] },
    { id: 'data', ko: '데이터 양', en: 'Data', units: [
      U('B', '바이트', 'byte', 1), U('bit', '비트', 'bit', 1 / 8), U('kB', '킬로바이트(10³)', 'kilobyte (10³)', 1e3), U('MB', '메가바이트(10⁶)', 'megabyte (10⁶)', 1e6), U('GB', '기가바이트(10⁹)', 'gigabyte (10⁹)', 1e9), U('TB', '테라바이트(10¹²)', 'terabyte (10¹²)', 1e12),
      U('KiB', '키비바이트(2¹⁰)', 'kibibyte (2¹⁰)', 1024), U('MiB', '메비바이트(2²⁰)', 'mebibyte (2²⁰)', 1048576), U('GiB', '기비바이트(2³⁰)', 'gibibyte (2³⁰)', 1073741824), U('TiB', '테비바이트(2⁴⁰)', 'tebibyte (2⁴⁰)', 1099511627776) ] },
    { id: 'lux', ko: '조도', en: 'Illuminance', units: [
      U('lx', '럭스', 'lux', 1), U('fc', '풋캔들', 'footcandle', 1 / (FT * FT)), U('ph', '포트', 'phot', 1e4) ] },
    { id: 'dose', ko: '방사선 흡수선량', en: 'Absorbed dose', units: [
      U('Gy', '그레이', 'gray', 1), U('mGy', '밀리그레이', 'milligray', 1e-3), U('rad', '래드', 'rad', 1e-2) ] },
    { id: 'eqdose', ko: '방사선 등가·유효선량', en: 'Equivalent / effective dose', units: [
      U('Sv', '시버트', 'sievert', 1), U('mSv', '밀리시버트', 'millisievert', 1e-3), U('uSv', '마이크로시버트', 'microsievert', 1e-6, 'μSv'), U('rem', '렘', 'rem', 1e-2), U('mrem', '밀리렘', 'millirem', 1e-5) ] },
    { id: 'act', ko: '방사능', en: 'Activity', units: [
      U('Bq', '베크렐', 'becquerel', 1), U('kBq', '킬로베크렐', 'kilobecquerel', 1e3), U('MBq', '메가베크렐', 'megabecquerel', 1e6), U('GBq', '기가베크렐', 'gigabecquerel', 1e9),
      U('Ci', '퀴리', 'curie', 3.7e10), U('mCi', '밀리퀴리', 'millicurie', 3.7e7), U('uCi', '마이크로퀴리', 'microcurie', 3.7e4, 'μCi') ] },
    { id: 'visc', ko: '점도', en: 'Dynamic viscosity', units: [
      U('Pas', '파스칼초', 'pascal second', 1, 'Pa·s'), U('mPas', '밀리파스칼초', 'millipascal second', 1e-3, 'mPa·s'), U('P', '푸아즈', 'poise', 0.1), U('cP', '센티푸아즈', 'centipoise', 1e-3) ] },
    { id: 'kvisc', ko: '동점도', en: 'Kinematic viscosity', units: [
      U('m2s', '제곱미터 매 초', 'square metre per second', 1, 'm²/s'), U('mm2s', '제곱밀리미터 매 초', 'square millimetre per second', 1e-6, 'mm²/s'), U('St', '스토크스', 'stokes', 1e-4), U('cSt', '센티스토크스', 'centistokes', 1e-6) ] }
  ];
  /* 이상기체 몰부피 — 기체상수 R = N_A·k (두 값 모두 2019 SI 정의값) */
  SHE.GAS_R = 6.02214076e23 * 1.380649e-23;
})();

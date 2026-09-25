/* 만든 사람 약력 — 본인이 제공한 자료(프로필 문서, 졸업증명서, 논문 원문)만 요약.
   자격증 번호·생년월일·학위등록번호 같은 식별 번호는 싣지 않는다.
   영문 이름 표기 ‘Sung-Ho Lee’는 논문(한국철도학회논문집 25(2), 2022)의 저자 표기를 따른다. */
window.SHE = window.SHE || {};
(function () {
  const B = (ko, en) => ({ ko, en });
  SHE.AUTHOR = B('이성호', 'Sung-Ho Lee');
  SHE.PROFILE = {
    photo: 'assets/img/profile.jpg',
    lead: B('안전공학을 전공하고 산업안전·위험물·소방·대기환경 분야 국가기술자격을 취득했습니다. 이 포털은 기획부터 자료 조사·검증, 디자인, 개발까지 직접 만들었습니다.',
      'A safety-engineering graduate with Korean national technical qualifications in industrial safety, hazardous materials, fire protection and air quality. I planned, researched, verified, designed and built this portal myself.'),
    interests: B(['소방안전', '환경안전', '기계안전'], ['Fire safety', 'Environmental safety', 'Machine safety']),
    edu: [
      { t: B('서울과학기술대학교 안전공학과 졸업 (공학사)', 'Seoul National University of Science and Technology — B.Eng., Safety Engineering'), d: '2018.3 – 2024.8' }
    ],
    certs: [
      { t: B('산업안전기사', 'Engineer Industrial Safety (산업안전기사)'), d: '2023.9' },
      { t: B('위험물산업기사', 'Industrial Engineer Hazardous Materials (위험물산업기사)'), d: '2024.6' },
      { t: B('소방설비기사', 'Engineer Fire Protection System (소방설비기사)'), d: '2024.12' },
      { t: B('대기환경기사', 'Engineer Air Pollution Environmental (대기환경기사)'), d: '2026.6' }
    ],
    langs: [
      { t: B('TOEIC Speaking IH (150점)', 'TOEIC Speaking IH (150)'), d: '2026.6' }
    ],
    research: [
      { t: B('기계안전연구실 — 반복 하중에서의 볼트 풀림 실험 연구에 참여하고, 머신러닝 학습 데이터를 만들기 위해 도로 노면 유형을 분류한 뒤 Adams 차량 동역학 해석으로 데이터를 추출',
          'Machine Safety Lab — took part in experiments on bolt loosening under cyclic loads; to build training data for machine learning, classified road-surface types and extracted data from Adams vehicle-dynamics simulations'), d: '2021.8 – 2023.2' }
    ],
    paper: {
      t: B('반복 하중조건에서의 구조적 볼트 축력 상실과 볼트 풀림 수명에 관한 실험적 연구',
        'Experimental Study of Structural Capability Loss of Bolt Clamping Force and Loosening Life of Bolts under Cyclic Loading Conditions'),
      by: B('양민 · 정성모 · 이성호 · 임재용', 'Min Yang, SeongMo Jeong, Sung-Ho Lee, Jae-Yong Lim'),
      venue: B('한국철도학회논문집 제25권 제2호, pp. 89–95 (2022.2) · 제3저자', 'Journal of the Korean Society for Railway, Vol. 25, No. 2, pp. 89–95 (Feb 2022) · third author'),
      url: 'https://doi.org/10.7782/JKSR.2022.25.2.89'
    },
    exp: [
      { t: B('사회복무요원 — 남양주시청 시민안전관 근무', 'Social service agent (alternative military service) — Namyangju City Hall, civil safety'), d: '2019.11 – 2021.8' },
      { t: B('남양주시청 ‘플래너즈’ — 지역 행사 기획·운영(여름 축제 ‘썸머너즈’, 초등학생 2박 3일 ‘향토순례단’, 학과설명회 ‘청춘캠프’), 아동복지센터 학습 보조 · 봉사 155시간',
          'Namyangju City Hall “Planners” — planned and ran local events (a summer festival, a three-day hometown tour for primary pupils, a university-major info camp) and gave study support at a children’s welfare centre · 155 volunteer hours'), d: '2018.8 – 2019.8' },
      { t: B('종로엠학원 — 중·고등학생 반 수업과 내신 대비', 'Private academy — taught middle and high-school classes and exam preparation'), d: '2021.8 – 2023.3' },
      { t: B('생각하는황소 수학학원 — 초등학생 수학 질문·채점 튜터, 선행 과정을 어려워하는 학생에게 풀이를 쉽게 설명', 'Maths academy — tutor for primary pupils, answering questions and marking, explaining advanced material in simple steps'), d: '2024.5 – 2025.11' },
      { t: B('학과 동아리 ‘무풍’ — 학과 행사 ‘안전인의 밤’ 밴드 공연(베이스)', 'Department band — bass at the department’s “Safety Night” event'), d: '2018.3 – 2019.8' }
    ]
  };
})();

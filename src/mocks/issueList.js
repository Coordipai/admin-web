export const mockIssueList = [
  {
    id: 1,
    title: '로그인 기능 구현',
    content: '사용자 인증 시스템 구현 및 JWT 토큰 기반 인증 처리',
    priority: 'M',
    iteration: { title: 'Iteration 1', period: '2024-03-11 ~ 2024-03-17' },
    labels: ['기능', '설정'],
    assignees: ['Alice', 'Bob']
  },
  {
    id: 2,
    title: '회원가입 페이지 디자인',
    content: '회원가입 UI/UX 개선 및 반응형 디자인 적용',
    priority: 'S',
    iteration: { title: 'Iteration 1', period: '2024-03-11 ~ 2024-03-17' },
    labels: ['설정', 'UI'],
    assignees: ['Charlie']
  },
  {
    id: 3,
    title: 'API 엔드포인트 테스트',
    content: '모든 API 엔드포인트에 대한 단위 테스트 작성',
    priority: 'C',
    iteration: { title: 'Iteration 2', period: '2024-03-18 ~ 2024-03-24' },
    labels: ['테스트'],
    assignees: ['David']
  },
  {
    id: 4,
    title: '데이터베이스 스키마 설계',
    content: '프로젝트에 필요한 데이터베이스 스키마 설계 및 문서화',
    priority: 'M',
    iteration: { title: 'Iteration 1', period: '2024-03-11 ~ 2024-03-17' },
    labels: ['설정', '문서'],
    assignees: ['Alice']
  },
  {
    id: 5,
    title: 'CI/CD 파이프라인 구축',
    content: 'GitHub Actions를 사용한 CI/CD 파이프라인 구축',
    priority: 'S',
    iteration: { title: 'Iteration 2', period: '2024-03-18 ~ 2024-03-24' },
    labels: ['배포'],
    assignees: ['Bob']
  },
  {
    id: 6,
    title: '메인 페이지 버그 수정',
    content: '메인 페이지에서 발생하는 레이아웃 깨짐 현상 수정',
    priority: 'M',
    iteration: { title: 'Iteration 1', period: '2024-03-11 ~ 2024-03-17' },
    labels: ['버그 수정'],
    assignees: ['Charlie']
  },
  {
    id: 7,
    title: '코드 리팩토링',
    content: '중복 코드 제거 및 성능 최적화',
    priority: 'C',
    iteration: { title: 'Iteration 2', period: '2024-03-18 ~ 2024-03-24' },
    labels: ['리팩토링'],
    assignees: ['David']
  },
  {
    id: 8,
    title: 'API 문서 작성',
    content: 'Swagger를 사용한 API 문서 자동화',
    priority: 'S',
    iteration: { title: 'Iteration 1', period: '2024-03-11 ~ 2024-03-17' },
    labels: ['문서'],
    assignees: ['Alice']
  },
  {
    id: 9,
    title: '보안 취약점 점검',
    content: 'OWASP Top 10 기반 보안 취약점 점검 및 수정',
    priority: 'M',
    iteration: { title: 'Iteration 2', period: '2024-03-18 ~ 2024-03-24' },
    labels: ['설정', '테스트'],
    assignees: ['Bob']
  },
  {
    id: 10,
    title: '사용자 피드백 수집',
    content: '사용자 피드백 수집 시스템 구축',
    priority: 'C',
    iteration: { title: 'Iteration 1', period: '2024-03-11 ~ 2024-03-17' },
    labels: ['기능'],
    assignees: ['Charlie']
  },
  {
    id: 11,
    title: '성능 모니터링 시스템 구축',
    content: 'Prometheus와 Grafana를 활용한 시스템 모니터링 구축',
    priority: 'S',
    iteration: { title: 'Iteration 2', period: '2024-03-18 ~ 2024-03-24' },
    labels: ['설정', '배포'],
    assignees: ['David']
  },
  {
    id: 12,
    title: '이메일 인증 기능 구현',
    content: '회원가입 시 이메일 인증 기능 추가',
    priority: 'M',
    iteration: { title: 'Iteration 1', period: '2024-03-11 ~ 2024-03-17' },
    labels: ['기능', '설정'],
    assignees: ['Alice', 'Bob']
  },
  {
    id: 13,
    title: '데이터 백업 시스템 구축',
    content: '자동화된 데이터 백업 시스템 구축',
    priority: 'S',
    iteration: { title: 'Iteration 2', period: '2024-03-18 ~ 2024-03-24' },
    labels: ['설정', '배포'],
    assignees: ['Charlie']
  },
  {
    id: 14,
    title: '사용자 가이드 작성',
    content: '시스템 사용자 가이드 및 매뉴얼 작성',
    priority: 'C',
    iteration: { title: 'Iteration 1', period: '2024-03-11 ~ 2024-03-17' },
    labels: ['문서'],
    assignees: ['David']
  },
  {
    id: 15,
    title: '로깅 시스템 개선',
    content: 'ELK 스택을 활용한 로깅 시스템 구축',
    priority: 'S',
    iteration: { title: 'Iteration 2', period: '2024-03-18 ~ 2024-03-24' },
    labels: ['설정', '배포'],
    assignees: ['Alice']
  },
  {
    id: 16,
    title: '캐시 시스템 도입',
    content: 'Redis를 활용한 캐시 시스템 구축',
    priority: 'M',
    iteration: { title: 'Iteration 1', period: '2024-03-11 ~ 2024-03-17' },
    labels: ['기능', '설정'],
    assignees: ['Bob']
  },
  {
    id: 17,
    title: '테스트 자동화 구축',
    content: 'Jest와 Cypress를 활용한 테스트 자동화 구축',
    priority: 'S',
    iteration: { title: 'Iteration 2', period: '2024-03-18 ~ 2024-03-24' },
    labels: ['테스트'],
    assignees: ['Charlie']
  },
  {
    id: 18,
    title: '코드 품질 관리',
    content: 'SonarQube를 활용한 코드 품질 관리 시스템 구축',
    priority: 'C',
    iteration: { title: 'Iteration 1', period: '2024-03-11 ~ 2024-03-17' },
    labels: ['설정', '테스트'],
    assignees: ['David']
  },
  {
    id: 19,
    title: '마이크로서비스 아키텍처 설계',
    content: '시스템 마이크로서비스 아키텍처 설계 및 문서화',
    priority: 'M',
    iteration: { title: 'Iteration 2', period: '2024-03-18 ~ 2024-03-24' },
    labels: ['설정', '문서'],
    assignees: ['Alice', 'Bob']
  },
  {
    id: 20,
    title: '성능 테스트 수행',
    content: 'JMeter를 활용한 부하 테스트 및 성능 분석',
    priority: 'S',
    iteration: { title: 'Iteration 1', period: '2024-03-11 ~ 2024-03-17' },
    labels: ['테스트'],
    assignees: ['Charlie', 'David']
  }
] 
import { Project, DetailItem, ProcessStep, AutomationProject, FloatingElement } from '@/types';

// 바이브코딩 프로젝트
export const vibeProjects: Project[] = [
  {
    id: 'blogsaas',
    title: 'SULSUL AI',
    category: 'SaaS Platform',
    description: 'AI 기반 블로그 콘텐츠 자동 생성 플랫폼',
    tags: ['React 19', 'FastAPI', 'Supabase', 'AI Integration'],
    featured: true,
    url: 'https://sulsul-ai.com/',
    detailDescription: `
      바이브코딩으로 개발한 AI 기반 블로그 콘텐츠 자동 생성 SaaS 플랫폼입니다.
      
      키워드만 입력하면 AI가 SEO에 최적화된 블로그 글을 자동으로 생성해드립니다. 
      브랜드 톤앤매너 설정부터 다양한 포맷 지원까지, 콘텐츠 마케팅의 모든 과정을 자동화했습니다.
      
      현재 500+ 사용자가 매월 2,000+ 개의 콘텐츠를 생성하고 있으며, 
      평균 콘텐츠 작성 시간을 90% 단축시키고 있습니다.
    `,
    features: [
      'AI 기반 콘텐츠 자동 생성',
      '브랜드별 톤앤매너 커스터마이징',
      'SEO 최적화 자동 적용',
      '다양한 포맧 (블로그, 뉴스레터, SNS)',
      '실시간 콘텐츠 편집 및 수정',
      '팀 협업 기능'
    ],
    techStack: [
      'Frontend: React 19 + TypeScript + Vite',
      'Backend: FastAPI + Python 3.11',
      'Database: Supabase (PostgreSQL)',
      'AI: Google Gemini API',
      'Infrastructure: Vercel + Render',
      'Auth: Supabase Auth'
    ]
  },
  {
    id: 'uniatr',
    title: 'UNIATR 홈페이지',
    category: 'Corporate Website',
    description: '기업 웹사이트 풀스택 개발',
    tags: ['Next.js 14', 'TypeScript', 'Tailwind CSS'],
    featured: true,
  },
  {
    id: 'japanese-app',
    title: '일본어 학습 앱',
    category: 'Mobile Web App',
    description: '인터랙티브 언어 학습 플랫폼',
    tags: ['React', 'PWA', 'Local Storage'],
  },
];

// 노션 & 메이크 자동화 프로젝트
export const automationProjects: Project[] = [
  {
    id: 'notion-charts',
    title: '노션 차트 시스템',
    category: 'Data Visualization',
    description: '웹 기반 노션 차트 시각화 도구',
    tags: ['JavaScript', 'Chart.js', 'Notion API'],
  },
  {
    id: 'content-automation',
    title: '콘텐츠 자동 발행 시스템',
    category: 'Automation',
    description: '노션 데이터베이스와 Make를 연동하여 블로그 포스트를 자동으로 여러 플랫폼에 발행',
    tags: ['Notion API', 'Make', 'Automation'],
  },
  {
    id: 'data-collection',
    title: '경쟁사 분석 자동화',
    category: 'Automation',
    description: '매일 경쟁사 웹사이트 크롤링하여 노션 DB에 저장하고 주간 리포트 자동 생성',
    tags: ['Make', 'Notion API', 'Web Scraping'],
  },
];

// 전체 프로젝트 (하위 호환성을 위해 유지)
export const projects: Project[] = [...vibeProjects, ...automationProjects];

export const detailItems: DetailItem[] = [
  {
    number: '01',
    label: 'Specialty',
    value: 'AI 기반 자동화',
  },
  {
    number: '02',
    label: 'Experience',
    value: '바이브코딩 & 교육',
  },
  {
    number: '03',
    label: 'Mission',
    value: '효율성 극대화',
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: '기획 & 구조 설계',
    description: '사용자 관점에서 시작해 전체 시스템을 설계합니다',
  },
  {
    number: '02',
    title: '빠른 프로토타입',
    description: '핵심 기능부터 구현하여 빠르게 검증합니다',
  },
  {
    number: '03',
    title: '자동화 & 최적화',
    description: '반복 작업을 자동화하고 시스템을 개선합니다',
  },
  {
    number: '04',
    title: '결과물 완성',
    description: '품질을 타협하지 않고 완성도 있게 마무리합니다',
  },
];


export const floatingElements: FloatingElement[] = [
  {
    id: 'year',
    text: '2025',
    position: { top: '20%', left: '10%' },
    animationType: 'left',
  },
  {
    id: 'location',
    text: 'SEOUL',
    position: { top: '60%', right: '15%' },
    animationType: 'right',
  },
  {
    id: 'portfolio',
    text: 'PORTFOLIO',
    position: { bottom: '30%', left: '8%' },
    animationType: 'rotate',
  },
];

export const navigationItems = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '/projects', label: 'Projects', isRoute: true },
  { href: '#contact', label: 'Contact' },
];
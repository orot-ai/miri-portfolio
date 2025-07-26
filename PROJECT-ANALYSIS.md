# 🚀 MIRI 포트폴리오 프로젝트 아키텍처 분석

## 📋 개요

**프로젝트명**: MIRI 포트폴리오  
**기술 스택**: React 18 + TypeScript + Vite + Tailwind CSS + Supabase  
**프로젝트 타입**: 포트폴리오 웹사이트 (관리자 모드 포함)  
**배포 환경**: Vercel/Netlify (예상)

## 🏗 프로젝트 아키텍처

### 전체 구조
```
react-portfolio/
├── 📁 src/
│   ├── 📁 components/          # UI 컴포넌트들
│   │   ├── 📁 admin/          # 관리자 전용 컴포넌트
│   │   ├── 📁 animations/     # 애니메이션 컴포넌트
│   │   ├── 📁 auth/           # 인증 관련 컴포넌트
│   │   ├── 📁 layout/         # 레이아웃 컴포넌트
│   │   ├── 📁 projects/       # 프로젝트 관련 컴포넌트
│   │   ├── 📁 sections/       # 섹션별 컴포넌트
│   │   └── 📁 ui/             # 공통 UI 컴포넌트
│   ├── 📁 pages/              # 페이지 컴포넌트들
│   ├── 📁 hooks/              # 커스텀 훅들
│   ├── 📁 stores/             # 상태 관리 (Zustand)
│   ├── 📁 lib/                # 외부 API 및 유틸리티
│   ├── 📁 types/              # TypeScript 타입 정의
│   ├── 📁 utils/              # 유틸리티 함수들
│   └── 📁 data/               # 정적 데이터
├── 📁 public/                 # 정적 파일들
└── 📁 supabase/               # Supabase 설정 및 마이그레이션
```

## 🔧 핵심 기술 스택

### Frontend
- **React 18**: 함수형 컴포넌트, 훅 기반 개발
- **TypeScript**: 타입 안전성 보장
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Framer Motion**: 고급 애니메이션 라이브러리

### Backend & Database
- **Supabase**: 실시간 데이터베이스, 인증, 스토리지
  - PostgreSQL 기반
  - Row Level Security (RLS)
  - 실시간 구독 기능

### 상태 관리 & 라우팅
- **Zustand**: 경량 상태 관리 라이브러리
- **React Router DOM v7**: 클라이언트 사이드 라우팅

### 개발 도구
- **ESLint**: 코드 품질 관리
- **PostCSS + Autoprefixer**: CSS 후처리

## 📊 데이터베이스 스키마

### 주요 테이블들

#### `portfolio_content`
- **목적**: 홈페이지의 모든 텍스트 콘텐츠 관리
- **구조**:
  ```sql
  - id: UUID (PK)
  - section: VARCHAR(50) -- 'hero', 'about', 'projects', 'contact'
  - field: VARCHAR(50)   -- 'title', 'description', 'subtitle'
  - content: TEXT
  - content_type: VARCHAR(20) -- 'text', 'image', 'json'
  - created_at, updated_at: TIMESTAMP
  ```

#### `projects`
- **목적**: 포트폴리오 프로젝트 데이터 관리
- **구조**:
  ```sql
  - id: UUID (PK)
  - title: VARCHAR(255)
  - description: TEXT
  - image_url: TEXT              -- 메인 이미지
  - screenshot_1_url: TEXT       -- 스크린샷 1
  - screenshot_2_url: TEXT       -- 스크린샷 2
  - screenshot_3_url: TEXT       -- 스크린샷 3
  - thumbnail_1_url: TEXT        -- 썸네일 1
  - thumbnail_2_url: TEXT        -- 썸네일 2
  - thumbnail_3_url: TEXT        -- 썸네일 3
  - thumbnail_4_url: TEXT        -- 썸네일 4
  - tech_stack: TEXT[]           -- 기술 스택 배열
  - category: VARCHAR(20)        -- 'vibe' 또는 'automation'
  - features: TEXT[]             -- 주요 기능 배열
  - development_status: VARCHAR(50)
  - github_url: TEXT
  - demo_url: TEXT
  - order_index: INTEGER         -- 드래그 앤 드롭 순서
  - created_at, updated_at: TIMESTAMP
  ```

#### `site_settings`
- **목적**: 사이트 전역 설정 관리
- **구조**:
  ```sql
  - id: UUID (PK)
  - setting_key: VARCHAR(50) UNIQUE
  - setting_value: TEXT
  - description: TEXT
  - created_at, updated_at: TIMESTAMP
  ```

## 🎯 주요 기능 및 모듈

### 1. **관리자 모드 시스템**
- **위치**: `src/stores/adminStore.ts`
- **기능**: 
  - 실시간 콘텐츠 편집
  - 프로젝트 관리 (CRUD)
  - 이미지 업로드 및 관리
  - 드래그 앤 드롭 순서 변경

### 2. **프로젝트 관리 시스템**
- **위치**: `src/hooks/useAdminProjects.ts`
- **기능**:
  - 프로젝트 목록 조회 (카테고리별)
  - 프로젝트 생성/수정/삭제
  - 순서 변경 (드래그 앤 드롭)
  - 이미지 업로드 및 URL 관리

### 3. **콘텐츠 관리 시스템**
- **위치**: `src/hooks/useAdminContent.ts`
- **기능**:
  - 섹션별 콘텐츠 조회
  - 실시간 텍스트 편집
  - 다국어 지원 준비

### 4. **애니메이션 시스템**
- **위치**: `src/utils/animations.ts`
- **기능**:
  - 공통 애니메이션 변형들
  - 스크롤 기반 애니메이션
  - 호버 효과들
  - 그라디언트 쓸어나가기 효과

## 🔄 데이터 플로우

### 일반 사용자 플로우
```
1. 페이지 로드
   ↓
2. Supabase에서 콘텐츠 조회 (읽기 전용)
   ↓
3. 컴포넌트에 데이터 바인딩
   ↓
4. 애니메이션과 함께 렌더링
```

### 관리자 플로우
```
1. 관리자 모드 활성화
   ↓
2. 편집 가능한 컴포넌트들 활성화
   ↓
3. 실시간 편집 (EditableText, EditableImage)
   ↓
4. Supabase Admin API로 데이터 업데이트
   ↓
5. 로컬 상태 및 UI 즉시 반영
```

### 이미지 업로드 플로우
```
1. 파일 선택 (EditableImage)
   ↓
2. 파일 유효성 검증 (타입, 크기)
   ↓
3. Supabase Storage에 업로드
   ↓
4. 공개 URL 생성
   ↓
5. 데이터베이스에 URL 저장
   ↓
6. 로컬 상태 업데이트 및 UI 반영
```

## 🧩 컴포넌트 아키텍처

### 컴포넌트 계층 구조
```
App
├── Header (네비게이션)
├── Router
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── AboutSection
│   │   ├── WorkProcessSection
│   │   ├── ProjectsSection
│   │   └── ContactSection
│   ├── ProjectsPage
│   │   ├── ProjectsPageHeader
│   │   └── ProjectsGrid
│   ├── ProjectDetailPage
│   └── Admin Pages
│       ├── AdminPage
│       ├── AdminProjectsPage
│       └── AdminProjectDetailPage
└── CustomCursor
```

### 주요 컴포넌트 특징

#### **EditableText**
- 관리자 모드에서 실시간 텍스트 편집
- 자동 저장 기능
- 다양한 HTML 태그 지원

#### **EditableImage**
- 이미지 업로드 및 교체
- 파일 타입/크기 검증
- 미리보기 기능
- 드래그 앤 드롭 지원

#### **ProjectCard**
- 프로젝트 정보 표시
- 호버 애니메이션
- 반응형 디자인

## 🎨 디자인 시스템

### 색상 팔레트
```javascript
THEME_COLORS = {
  primary: '#7C3AED',  // 보라색 (브랜드 컬러)
  black: '#000000',    // 메인 텍스트
  white: '#FFFFFF',    // 배경
  gray: {              // 다양한 회색 톤
    50: '#F9FAFB',
    100: '#F3F4F6',
    // ... 900까지
  }
}
```

### 레이아웃 시스템
- **컨테이너 최대 너비**: 1100px
- **반응형 브레이크포인트**: Tailwind 기본값
- **섹션 패딩**: 일관된 수직 여백

### 애니메이션 철학
- **부드러운 전환**: 0.3-0.6초 duration
- **easeOut**: 자연스러운 감속
- **스태거 애니메이션**: 순차적 등장 효과
- **호버 피드백**: 즉각적인 반응

## 🔐 보안 및 인증

### Supabase 보안 설정
- **Row Level Security (RLS)**: 테이블별 접근 제어
- **API 키 관리**: 
  - `ANON_KEY`: 읽기 전용 작업
  - `SERVICE_KEY`: 관리자 작업 (서버 사이드)

### 관리자 인증
- **로컬 상태 기반**: 간단한 관리자 모드 토글
- **Zustand persist**: 로그인 상태 유지

## 📱 반응형 디자인

### 브레이크포인트 전략
```css
/* Mobile First 접근법 */
base: 320px+        /* 모바일 */
sm: 640px+          /* 작은 태블릿 */
md: 768px+          /* 태블릿 */
lg: 1024px+         /* 노트북 */
xl: 1280px+         /* 데스크톱 */
2xl: 1536px+        /* 큰 데스크톱 */
```

### 반응형 특징
- **유연한 그리드**: CSS Grid + Flexbox
- **반응형 이미지**: aspect-ratio 활용
- **적응형 타이포그래피**: 화면 크기별 폰트 크기 조정

## ⚡ 성능 최적화

### 현재 적용된 최적화
1. **Code Splitting**: React.lazy()로 페이지별 분할
2. **Image Optimization**: Supabase Storage 활용
3. **CSS 최적화**: Tailwind CSS 사용으로 미사용 스타일 제거
4. **상태 관리**: Zustand로 경량화

### 추가 최적화 가능 영역
1. **이미지 Lazy Loading**: Intersection Observer 활용
2. **컴포넌트 메모이제이션**: React.memo, useMemo 활용
3. **Virtual Scrolling**: 대량 데이터 처리 시
4. **Service Worker**: 오프라인 대응

## 🚀 배포 및 CI/CD

### 현재 설정
- **빌드 도구**: Vite
- **타입 체크**: TypeScript 컴파일러
- **린팅**: ESLint

### 배포 권장사항
```yaml
# .github/workflows/deploy.yml 예시
name: Deploy to Vercel
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Type check
        run: npm run type-check
      - name: Lint
        run: npm run lint
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
```

## 🔧 개발 가이드라인

### 코딩 컨벤션
1. **컴포넌트 네이밍**: PascalCase
2. **파일 네이밍**: kebab-case
3. **변수 네이밍**: camelCase
4. **상수**: UPPER_SNAKE_CASE

### 폴더 구조 규칙
```
components/
├── 기능별 폴더 (admin, auth, etc.)
├── 공통 컴포넌트 (ui/)
└── 각 컴포넌트는 index.tsx + styles 파일
```

### Git 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 과정 또는 도구 변경
```

## 🐛 알려진 문제 및 개선사항

### 현재 해결된 문제들
1. ✅ 타입 중복 정의 문제 해결
2. ✅ 이미지 업로드 400 에러 해결
3. ✅ 데이터 동기화 문제 해결

### 향후 개선 계획
1. **성능 최적화**: 이미지 lazy loading 구현
2. **접근성**: ARIA 레이블 및 키보드 네비게이션 개선
3. **테스트**: Jest + Testing Library 도입
4. **국제화**: i18n 지원 추가
5. **SEO**: 메타 태그 및 구조화된 데이터 추가

## 📖 API 문서

### AdminAPI 주요 메서드

#### 콘텐츠 관리
```typescript
// 콘텐츠 조회
AdminAPI.getContentBySection(section: string): Promise<PortfolioContent[]>

// 콘텐츠 업데이트
AdminAPI.updateContent(id: string, content: string): Promise<void>
```

#### 프로젝트 관리
```typescript
// 프로젝트 목록 조회
AdminAPI.getProjectsByCategory(category: 'vibe' | 'automation'): Promise<Project[]>

// 프로젝트 생성
AdminAPI.createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project>

// 프로젝트 업데이트
AdminAPI.updateProject(id: string, updates: Partial<Project>): Promise<void>

// 프로젝트 삭제
AdminAPI.deleteProject(id: string): Promise<void>
```

#### 파일 관리
```typescript
// 파일 업로드
AdminAPI.uploadFile(file: File, path: string): Promise<string>

// 파일 삭제
AdminAPI.deleteFile(filePath: string): Promise<void>
```

## 🎯 프로젝트 철학: 바이브코딩

이 프로젝트는 "바이브코딩" 철학을 구현한 실제 사례입니다:

1. **빠른 프로토타이핑**: Vite + React로 즉시 개발 시작
2. **실용적 접근**: 필요한 기능부터 구현, 과도한 엔지니어링 지양
3. **반복적 개선**: 기본 기능 구현 후 점진적 개선
4. **사용자 중심**: 관리자 모드로 비개발자도 쉽게 콘텐츠 관리

---

**작성일**: 2025년 1월 25일  
**버전**: 1.0.0  
**작성자**: Claude Code  
**프로젝트 상태**: 활발히 개발 중 🚀
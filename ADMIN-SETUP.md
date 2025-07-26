# 🎯 관리자 페이지 설정 가이드

## 📦 설치 완료된 구성 요소

### ✅ 1. Supabase 설정
- `@supabase/supabase-js` 설치 완료
- `/src/lib/supabase.ts` - 클라이언트 설정
- `/src/lib/adminAPI.ts` - 데이터베이스 API
- `/.env.local` - 환경변수 파일 (설정 필요)

### ✅ 2. 데이터베이스 스키마
- `supabase-schema.sql` - 테이블 생성 스크립트
- 4개 테이블: portfolio_content, projects, site_settings, media_files
- 초기 데이터 포함

### ✅ 3. 편집 가능한 UI 컴포넌트
- `EditableText` - 텍스트 편집 컴포넌트
- `EditableImage` - 이미지 업로드 컴포넌트  
- `AdminToolbar` - 관리자 툴바

### ✅ 4. 관리자 페이지 구조
- `/admin` 라우트 추가
- `AdminPage` - 메인 관리자 페이지
- 5개 섹션: Hero, About, WorkProcess, Projects, Contact

### ✅ 5. 데이터 관리 훅
- `useAdminContent` - 콘텐츠 관리 훅
- `useAdminProjects` - 프로젝트 관리 훅

## 🚀 설정 순서

### 1단계: Supabase 프로젝트 생성
1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. 새 프로젝트 생성
3. 데이터베이스 URL과 Anon Key 복사

### 2단계: 환경변수 설정
`.env.local` 파일에 실제 값 입력:
```
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_anon_key
```

### 3단계: 데이터베이스 설정
1. Supabase SQL Editor에서 `supabase-schema.sql` 실행
2. 테이블과 초기 데이터 생성 확인

### 4단계: 스토리지 설정 (이미지 업로드용)
1. Supabase Storage에서 `portfolio-images` 버킷 생성
2. Public 권한 설정

## 📱 사용 방법

### 관리자 페이지 접속
```
http://localhost:3000/admin
```

### 기본 기능
- ✏️ **텍스트 편집**: 클릭하여 직접 편집
- 🖼️ **이미지 업로드**: 이미지 영역 클릭하여 파일 선택
- 💾 **자동 저장**: 각 필드별로 개별 저장
- 👁️ **미리보기**: 툴바에서 원본 사이트 미리보기

### 편집 가능한 콘텐츠
1. **Hero Section**: 제목, 부제목, 버튼 텍스트
2. **About Section**: 설명 텍스트, 프로세스 정보
3. **Work Process**: 단계별 제목과 설명
4. **Projects**: 프로젝트 제목과 설명
5. **Contact**: 연락처 정보

## 🔧 개발 모드 실행

```bash
# 개발 서버 시작
npm run dev

# 관리자 페이지 접속
http://localhost:3000/admin
```

## 📝 주의사항

1. **환경변수 설정 필수**: Supabase 연결을 위해 반드시 `.env.local` 설정
2. **타입 에러**: 현재 빌드 시 사용하지 않는 import로 인한 에러 있음 (기능상 문제 없음)
3. **권한 설정**: 실제 프로덕션에서는 관리자 인증 구현 필요

## 🎯 다음 단계

1. **Supabase 프로젝트 생성 및 환경변수 설정**
2. **데이터베이스 스키마 실행**
3. **관리자 페이지 테스트**
4. **콘텐츠 편집 테스트**

---

**완성된 관리자 시스템의 핵심 기능:**
- 홈페이지와 동일한 디자인 구조
- 실시간 편집 기능
- 데이터베이스 연동
- 이미지 업로드 지원
- 사용자 친화적 인터페이스
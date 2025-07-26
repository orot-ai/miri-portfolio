# 🔧 코드 정리 및 리팩토링 계획

## 📋 목표
- 모든 콘솔 로그 출력 제거 (프로덕션 환경 최적화)
- 기능과 디자인 변경 없이 코드 품질 개선
- 개발 디버깅용 로그는 환경변수로 제어

## 🎯 작업 범위

### ✅ 1단계: 콘솔 로그 분석 및 분류
**Console.log 사용처 (23개 파일)**:
- `src/pages/AdminProjectDetailPage.tsx` - 저장 관련 로그 2개
- `src/pages/AdminPage.tsx` - 저장 관련 로그 2개  
- `src/pages/AdminSettingsPage.tsx` - 설정 저장 로그 2개
- `src/main.tsx` - 앱 시작 로그 1개
- `src/utils/logger.ts` - Logger 구현부 4개 (유지 필요)
- `src/components/sections/ContactSection.tsx` - 디버그 로그 1개
- `src/components/admin/EditableText.tsx` - 편집 디버그 로그 3개
- `src/hooks/useProjectOrder.ts` - 에러 로그 2개
- `scripts/**` - 스크립트 파일들 (유지)

**Logger 사용처 (18개 파일)**:
- API 관련: `adminAPI.ts` - 상세 로깅 16개
- 훅 관련: `useAdminProjects.ts` - 에러 로깅 3개
- 컴포넌트: `EditableText.tsx`, `EditableImage.tsx` - 디버그 로깅
- 유틸리티: `errorHandler.ts`, `ErrorBoundary.tsx` - 에러 로깅

### 🔄 2단계: 환경변수 기반 로깅 시스템 구축
```typescript
// 개발/프로덕션 환경 분리
const isDevelopment = import.meta.env.DEV
const enableDebugLogs = import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true'
```

### 🎨 3단계: 로그 제거 전략

#### A. 완전 제거 대상
- **디버그용 콘솔 로그**: 개발 중 임시로 추가된 로그
- **상태 확인용 로그**: "저장 시작", "클릭됨" 등
- **정보성 로그**: "Fetching projects", "Successfully fetched" 등

#### B. 조건부 유지 대상  
- **에러 로그**: 사용자 문제 해결을 위해 필요시 활성화
- **경고 로그**: 시스템 문제 감지용

#### C. 완전 유지 대상
- **Logger 시스템 코어**: `logger.ts` 핵심 기능
- **ErrorBoundary**: React 에러 경계 로깅
- **Scripts 폴더**: 개발/배포 도구

### 📂 4단계: 파일별 작업 계획

#### 🔥 **High Priority (즉시 제거)**
1. **AdminProjectDetailPage.tsx**
   - `console.log('저장할 데이터:', ...)` → 제거
   - `console.error('저장 실패:', error)` → 사용자 알림만 유지

2. **AdminPage.tsx** 
   - `console.log('서버에 저장할 데이터:', ...)` → 제거
   - `console.error('저장 실패:', error)` → 사용자 알림만 유지

3. **AdminSettingsPage.tsx**
   - `console.log('저장할 설정:', settings)` → 제거  
   - `console.error('저장 실패:', error)` → 사용자 알림만 유지

4. **EditableText.tsx**
   - `console.log('🔥 EditableText 클릭됨!')` → 제거
   - `console.log('❌ 편집 불가능:')` → 제거
   - `console.log('✅ 편집 모드 활성화!')` → 제거
   - logger 디버그 로그들도 조건부로 변경

#### 🔶 **Medium Priority (조건부 처리)**
5. **adminAPI.ts**
   - 모든 `logger.info()` → 개발 환경에서만 출력
   - 모든 `logger.warn()` → 개발 환경에서만 출력  
   - `logger.error()` → 유지 (중요한 에러)

6. **useAdminProjects.ts**, **useProjectOrder.ts**
   - 에러 로그는 유지, 정보성 로그는 조건부 처리

#### 🟢 **Low Priority (정밀 조정)**
7. **main.tsx**
   - 시작 로그 → 개발 환경에서만 출력

8. **ContactSection.tsx**
   - 디버그 로그 → 제거

### ⚡ 5단계: 성능 최적화
- **번들 크기 최적화**: 사용하지 않는 logger 코드 제거
- **런타임 최적화**: 프로덕션에서 로그 함수 호출 자체를 방지
- **메모리 최적화**: 로그용 객체 생성 최소화

### 🧪 6단계: 테스트 및 검증
1. **기능 테스트**
   - 모든 관리자 기능 정상 작동 확인
   - 에러 처리 동작 확인
   - 사용자 알림 메시지 정상 출력 확인

2. **성능 테스트**  
   - 번들 크기 변화 측정
   - 런타임 성능 개선 확인
   - 브라우저 콘솔 깔끔함 확인

3. **환경별 테스트**
   - 개발 환경: 필요한 디버그 로그만 출력
   - 프로덕션 환경: 콘솔 완전 깔끔

## 🚨 주의사항

### ❌ 절대 제거하면 안 되는 것들
- **ErrorBoundary의 에러 로깅**
- **사용자 에러 알림 (alert, toast)**
- **핵심 에러 처리 로직**
- **Logger 시스템 자체 구조**

### 🛡️ 안전 장치
- 각 파일 수정 후 즉시 기능 테스트 실행
- Git 커밋을 세분화해서 문제 발생시 롤백 가능
- 테스트 시나리오 사전 정의 및 체크리스트 활용

## 📅 작업 순서
1. ✅ **분석 완료** - 현황 파악 및 계획 수립  
2. 🔄 **환경변수 시스템** - 조건부 로깅 인프라 구축
3. 🔴 **High Priority** - 명확한 제거 대상 처리
4. 🟡 **Medium Priority** - 조건부 로깅 적용  
5. 🟢 **Low Priority** - 세부 정리
6. 🧪 **테스트 및 검증** - 전체 기능 확인
7. 🚀 **최종 배포** - GitHub 푸시 및 Vercel 배포

## 📊 성공 지표
- ✅ 브라우저 콘솔에 불필요한 로그 0개
- ✅ 모든 기능 100% 정상 작동
- ✅ 에러 상황시 적절한 사용자 피드백 제공
- ✅ 개발 환경에서는 디버깅 가능한 로그 유지
- ✅ 번들 크기 최적화 달성

---
*작성일: 2025-07-26 | 작성자: Claude Code | 상태: 계획 수립 완료*
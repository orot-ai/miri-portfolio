# 🎨 MIRI 포트폴리오 프로젝트 가이드

> 바이브코딩 방법론으로 개발된 미니멀 포트폴리오 웹사이트

## 📋 프로젝트 개요

**프로젝트명**: MIRI Portfolio  
**개발 기간**: 2025년 1월  
**개발 방법론**: 바이브코딩 ("생각이 끝나기 전에 프로토타입이 돌아간다")  
**배포 URL**: [프로덕션 URL 추가 예정]

### 핵심 컨셉
- **미니멀 디자인**: 깔끔하고 현대적인 블랙&화이트 디자인
- **보라색 포인트**: #7C3AED를 메인 컬러로 사용
- **쓸어나가기 애니메이션**: 왼쪽에서 오른쪽으로 보라색이 쫙 쓸려나가는 호버 효과
- **반응형 웹**: 모든 디바이스에서 완벽한 사용자 경험

## 🛠 기술 스택

### Core
- **React 18** + **TypeScript** - 안정성과 개발 효율성
- **Vite** - 빠른 빌드 도구
- **Tailwind CSS** - 유틸리티 퍼스트 CSS

### 애니메이션
- **Framer Motion** - 모든 인터랙션 애니메이션
- **Intersection Observer API** - 스크롤 기반 애니메이션

### 개발 도구
- **ESLint** + **Prettier** - 코드 품질 관리
- **TypeScript** - 타입 안전성

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── animations/          # 재사용 애니메이션 컴포넌트
│   │   ├── AnimatedSection.tsx
│   │   └── StaggeredContainer.tsx
│   ├── layout/              # 레이아웃 컴포넌트
│   │   └── Header.tsx
│   ├── sections/            # 페이지 섹션들
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── WorkProcessSection.tsx
│   └── ui/                  # UI 컴포넌트
│       ├── Button.tsx
│       ├── CustomCursor.tsx
│       └── ProjectCard.tsx
├── data/                    # 정적 데이터
│   └── index.ts
├── hooks/                   # 커스텀 훅
│   └── useScrollAnimation.ts
├── pages/                   # 페이지 컴포넌트
│   ├── HomePage.tsx
│   ├── ProjectDetailPage.tsx
│   └── ProjectsPage.tsx
├── types/                   # TypeScript 타입 정의
│   └── index.ts
├── utils/                   # 유틸리티 함수들
│   └── animations.ts        # 공통 애니메이션 시스템
├── App.tsx                  # 메인 앱 컴포넌트
└── main.tsx                 # 앱 엔트리 포인트
```

## 🎭 애니메이션 시스템

### 공통 애니메이션 (`/src/utils/animations.ts`)
리팩토링을 통해 모든 애니메이션을 표준화했습니다:

```typescript
// 기본 페이드인 애니메이션
commonVariants.fadeInUp
commonVariants.fadeInLeft
commonVariants.fadeInRight

// 호버 효과
hoverEffects.colorPurple    // 보라색으로 변경
hoverEffects.scale          // 확대 효과
hoverEffects.backgroundPurple // 배경 보라색

// 쓸어나가기 효과
createSweepGradientStyle()  // 스타일 생성
sweepHoverEffect           // 호버 애니메이션
```

### 애니메이션 사용 예시
```typescript
// 색상 변경 호버
<motion.h3 {...hoverEffects.colorPurple}>제목</motion.h3>

// 쓸어나가기 효과
<motion.div 
  style={createSweepGradientStyle()}
  whileHover={sweepHoverEffect.whileHover}
>
  내용
</motion.div>
```

## 🎨 디자인 시스템

### 색상 팔레트
```typescript
THEME_COLORS = {
  primary: '#7C3AED',    // 메인 보라색
  black: '#000000',      // 블랙
  white: '#FFFFFF',      // 화이트
  gray: {
    50: '#F9FAFB',      // 가장 연한 회색
    100: '#F3F4F6',
    // ... 단계별 회색
    900: '#111827'       // 가장 진한 회색
  }
}
```

### 레이아웃
- **최대 너비**: 1100px (컨테이너)
- **패딩**: 좌우 32px (px-8)
- **섹션 간격**: section-padding 클래스 사용

## 📄 페이지 구성

### 1. 홈페이지 (`/`)
- **Hero Section**: 메인 인트로 + 프로젝트 보기 버튼
- **About Section**: "생각이 끝나기 전에 프로토타입이 돌아갑니다"
- **Projects Section**: 바이브코딩 & 자동화 프로젝트 카드
- **Work Process Section**: MY WORK - 4단계 프로세스
- **Contact Section**: 연락처 정보

### 2. 프로젝트 목록 (`/projects`)
- 탭으로 구분된 프로젝트 리스트
- 바이브코딩 프로젝트 / 자동화 프로젝트
- 그리드 레이아웃으로 프로젝트 카드 표시

### 3. 프로젝트 상세 (`/project/:id`)
- 개별 프로젝트 상세 정보
- 히어로 이미지 + 2컬럼 레이아웃
- 기능 설명, 기술 스택, 개발 현황

## 🚀 개발 가이드

### 로컬 개발
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 코드 스타일
- **컴포넌트**: PascalCase
- **파일명**: PascalCase.tsx
- **함수**: camelCase
- **상수**: UPPER_SNAKE_CASE

### 컴포넌트 작성 가이드
```typescript
// 1. 타입 정의
interface ComponentProps {
  className?: string;
  // 다른 props...
}

// 2. 컴포넌트 정의
export const Component: React.FC<ComponentProps> = ({ 
  className = '' 
}) => {
  // 3. 공통 애니메이션 사용
  return (
    <motion.div 
      className={className}
      {...hoverEffects.colorPurple}
    >
      내용
    </motion.div>
  );
};

// 4. 기본 내보내기
export default Component;
```

## 📊 성능 최적화

### 이미지 최적화
- WebP 포맷 사용 권장
- 반응형 이미지 sizes 속성 활용
- Lazy loading 적용

### 애니메이션 최적화
- `transform`과 `opacity`만 애니메이션
- `will-change` 속성 필요시에만 사용
- 60fps 유지를 위한 성능 모니터링

### 번들 최적화
- 코드 스플리팅으로 초기 로딩 최적화
- Tree shaking으로 불필요한 코드 제거

## 🔧 유지보수 가이드

### 새로운 프로젝트 추가
1. `/src/data/index.ts`에서 프로젝트 데이터 추가
2. 이미지 파일을 `/public` 폴더에 추가
3. 필요시 새로운 프로젝트 상세 페이지 생성

### 애니메이션 수정
1. `/src/utils/animations.ts`에서 공통 애니메이션 수정
2. 컴포넌트별 커스텀 애니메이션은 해당 컴포넌트 내부에 정의

### 색상 변경
1. `/src/utils/animations.ts`의 `THEME_COLORS` 수정
2. Tailwind config에서 추가 색상 정의 필요시 수정

## 🐛 문제 해결

### 애니메이션이 작동하지 않을 때
1. Framer Motion import 확인
2. `whileInView` 대신 `animate` 사용 확인
3. `viewport={{ once: true }}` 설정 확인

### 호버 효과가 끝나고 위치가 이상할 때
1. CSS transition과 Framer Motion 애니메이션 충돌 확인
2. `x`, `y` 속성 대신 다른 속성 사용 고려
3. `whileHover`에서 원래 값으로 되돌아가는지 확인

### 반응형 문제
1. Tailwind의 반응형 클래스 사용
2. `max-w-[1100px]` 컨테이너 확인
3. 모바일에서 터치 이벤트 고려

## 📝 코딩 컨벤션

### Import 순서
```typescript
// 1. React 관련
import React from 'react';
import { motion } from 'framer-motion';

// 2. 외부 라이브러리
import { useNavigate } from 'react-router-dom';

// 3. 내부 컴포넌트/훅
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// 4. 타입/데이터
import { Project } from '@/types';
import { commonVariants } from '@/utils/animations';
```

### 주석 가이드
```typescript
// 단일 라인 주석
/* 여러 라인 주석 */

// TODO: 할 일
// FIXME: 수정 필요
// NOTE: 주의사항
```

## 🎯 바이브코딩 방법론

이 프로젝트는 "생각이 끝나기 전에 프로토타입이 돌아간다"는 바이브코딩 철학으로 개발되었습니다:

### 핵심 원칙
1. **빠른 프로토타이핑**: 아이디어를 즉시 구현
2. **반복적 개선**: 완벽보다는 점진적 발전
3. **실험적 접근**: 새로운 기술과 방법 적극 도입
4. **사용자 중심**: 기능보다는 경험에 집중

### 개발 프로세스
```
아이디어 💡 → 즉시 구현 ⚡ → 사용자 피드백 📝 → 개선 🔄
```

---

**개발자**: MIRI  
**마지막 업데이트**: 2025년 1월  
**문의**: [연락처 정보]
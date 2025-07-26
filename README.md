# 🎨 MIRI Portfolio - 바이브코딩 포트폴리오

> "생각이 끝나기 전에 프로토타입이 돌아간다"

React + TypeScript + Framer Motion으로 제작된 미니멀 포트폴리오 웹사이트

## ✨ 주요 특징

- **🎭 쓸어나가기 애니메이션**: 보라색이 왼쪽에서 오른쪽으로 쫙 쓸려나가는 시그니처 호버 효과
- **💜 통일된 디자인 시스템**: #7C3AED 보라색 포인트 컬러로 일관된 브랜딩
- **⚡ 리팩토링된 코드**: 공통 애니메이션 시스템으로 유지보수성 극대화  
- **📱 완벽한 반응형**: 모든 디바이스에서 동일한 사용자 경험
- **🎨 미니멀 디자인**: 블랙&화이트 기반의 현대적 디자인
- **🚀 바이브코딩 방법론**: 빠른 프로토타이핑과 반복적 개선

## 🛠 기술 스택

### Frontend
- **React 18** - 최신 React 기능 활용
- **TypeScript** - 타입 안정성과 개발 경험 향상
- **Vite** - 빠른 개발 서버와 빌드
- **Framer Motion** - 고급 애니메이션과 제스처
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크

### 개발 도구
- **ESLint** - 코드 품질 관리
- **PostCSS** - CSS 후처리
- **Lucide React** - 모던 아이콘 라이브러리

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 타입 체크
npm run type-check

# 린트
npm run lint
```

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── animations/      # 재사용 애니메이션 컴포넌트
│   │   ├── AnimatedSection.tsx
│   │   └── StaggeredContainer.tsx
│   ├── layout/         # 레이아웃 컴포넌트
│   │   └── Header.tsx
│   ├── sections/       # 페이지 섹션들
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── WorkProcessSection.tsx
│   └── ui/            # UI 컴포넌트
│       ├── Button.tsx
│       ├── CustomCursor.tsx
│       └── ProjectCard.tsx
├── data/              # 정적 데이터
├── hooks/             # 커스텀 훅
├── pages/             # 페이지 컴포넌트
├── types/             # TypeScript 타입
└── utils/             # 유틸리티 (리팩토링된 애니메이션 시스템)
    └── animations.ts   # 공통 애니메이션, 색상, 스타일
```

## 🎨 디자인 시스템

### 컬러 팔레트
```typescript
THEME_COLORS = {
  primary: '#7C3AED',    // 메인 보라색 (시그니처 컬러)
  black: '#000000',      // 블랙
  white: '#FFFFFF',      // 화이트
  gray: {
    50: '#F9FAFB',      // 연한 회색 (배경)
    100: '#F3F4F6',     // 카드 배경
    // ... 단계별 회색
    900: '#111827'       // 진한 회색
  }
}
```

### 타이포그래피
- **Primary**: Pretendard Variable (한글)
- **Secondary**: Noto Sans KR (한글 보조)
- **Sizes**: 6xl~9xl (대형 타이틀), xl~2xl (본문)

### 시그니처 애니메이션
```typescript
// 쓸어나가기 효과
createSweepGradientStyle()  // 보라색 그라디언트 생성
sweepHoverEffect           // 왼쪽→오른쪽 쓸어나가기

// 공통 호버 효과
hoverEffects.colorPurple   // 보라색 변경
hoverEffects.scale         // 확대 효과
```

## 🔧 리팩토링된 애니메이션 시스템

### 공통 애니메이션 유틸리티
```tsx
import { commonVariants, hoverEffects, createSweepGradientStyle } from '@/utils/animations';

// 기본 페이드인
<motion.div variants={commonVariants.fadeInUp}>

// 보라색 호버
<motion.h3 {...hoverEffects.colorPurple}>

// 쓸어나가기 효과
<motion.div 
  style={createSweepGradientStyle()}
  whileHover={sweepHoverEffect.whileHover}
>
```

### 스태거드 애니메이션
```tsx
<StaggeredContainer staggerDelay={0.15}>
  <StaggeredItem>순차적으로</StaggeredItem>
  <StaggeredItem>나타나는</StaggeredItem>
  <StaggeredItem>아이템들</StaggeredItem>
</StaggeredContainer>
```

### 페이지별 컴포넌트
- **HeroSection**: 메인 인트로 + 쓸어나가기 버튼
- **AboutSection**: "프로토타입이" 호버 효과
- **ProjectsSection**: 지그재그 카드 레이아웃
- **WorkProcessSection**: MY WORK 4단계
- **ContactSection**: 연락처 카드들

## 📊 성능 최적화

- **Lazy Loading**: 섹션별 지연 로딩
- **Code Splitting**: 동적 import 활용
- **Image Optimization**: 적절한 이미지 포맷과 크기
- **Animation Performance**: GPU 가속 활용
- **Bundle Analysis**: 번들 크기 최적화

## 🌐 배포

### Vercel (추천)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### Netlify
```bash
# 빌드
npm run build

# dist 폴더를 Netlify에 업로드
```

## 💡 바이브코딩 방법론

### 핵심 철학
> "생각이 끝나기 전에 프로토타입이 돌아간다"

### 개발 프로세스
```
💡 아이디어 → ⚡ 즉시 구현 → 📝 피드백 → 🔄 개선 → 🚀 배포
```

### 적용 사례
1. **빠른 프로토타이핑**: 디자인 시안 없이 코드로 직접 디자인
2. **실시간 개선**: 사용자 피드백을 즉시 반영
3. **실험적 접근**: 새로운 애니메이션과 인터랙션 시도
4. **반복적 리팩토링**: 점진적 코드 품질 향상

## 📝 커스터마이징 가이드

### 색상 변경
```typescript
// src/utils/animations.ts
THEME_COLORS.primary = '#새로운색상';  // 메인 컬러
```

### 새로운 프로젝트 추가
```typescript
// src/data/index.ts
export const vibeProjects: Project[] = [
  {
    id: 'new-project',
    title: '새 프로젝트',
    description: '설명...',
    // ...
  }
];
```

### 애니메이션 커스터마이징
```typescript
// 새로운 호버 효과 추가
export const customHover = {
  whileHover: {
    // 커스텀 애니메이션
  }
};
```

### 📋 상세 가이드
더 자세한 개발 가이드는 `PROJECT-GUIDE.md`를 참고하세요.

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 연락처

- **Email**: contact@miri.dev
- **GitHub**: [@miri](https://github.com/miri)
- **Portfolio**: [miri-portfolio.vercel.app](https://miri-portfolio.vercel.app)

---

Made with ❤️ by MIRI - 바이브코딩으로 만든 포트폴리오
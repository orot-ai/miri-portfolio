// 공통 애니메이션 변형들과 유틸리티 함수들

export const THEME_COLORS = {
  primary: '#7C3AED', // 보라색
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB', 
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
} as const;

// 공통 애니메이션 변형들
export const commonVariants = {
  // 기본 페이드인 애니메이션
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  },

  fadeInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  },

  fadeInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  },

  // 스케일 애니메이션
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  },

  // 스태거 컨테이너
  staggerContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  },

  // 제목 애니메이션 (타이포그래피용)
  titleStagger: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  },

  titleLine: {
    hidden: { 
      opacity: 0, 
      x: 100, 
      rotate: 5 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      rotate: 0,
      transition: {
        duration: 1,
        ease: [0.68, -0.55, 0.265, 1.55]
      }
    }
  }
} as const;

// 공통 호버 효과들
export const hoverEffects = {
  // 기본 스케일 호버
  scale: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  },

  // 보라색 색상 변경 호버
  colorPurple: {
    whileHover: {
      color: THEME_COLORS.primary,
      transition: { duration: 0.2 }
    }
  },

  // 위로 이동 호버
  moveUp: {
    whileHover: { y: -2 },
    transition: { duration: 0.2 }
  },

  // 보라색 배경 호버
  backgroundPurple: {
    whileHover: {
      backgroundColor: THEME_COLORS.primary,
      color: THEME_COLORS.white,
      transition: { duration: 0.2 }
    }
  },

  // 회전 및 스케일 호버 (마커용)
  markerHover: {
    whileHover: { 
      scale: 1.15,
      rotate: 10,
      backgroundColor: THEME_COLORS.primary,
      transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.95 }
  }
} as const;

// 그라디언트 쓸어나가기 효과를 위한 스타일 생성 함수
export const createSweepGradientStyle = (baseColor: string = THEME_COLORS.black) => ({
  background: `linear-gradient(90deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.primary} 50%, ${baseColor} 50%, ${baseColor} 100%)`,
  backgroundSize: "200% 100%",
  backgroundPosition: "100% 0"
});

// 쓸어나가기 호버 효과
export const sweepHoverEffect = {
  whileHover: {
    backgroundPosition: "0% 0",
    transition: { duration: 0.3 }
  }
};

// 공통 트랜지션 설정들
export const transitions = {
  smooth: { duration: 0.3, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  bouncy: { type: 'spring', bounce: 0.4 }
} as const;

// 섹션 컨테이너 스타일
export const sectionStyles = {
  container: "max-w-[1100px] mx-auto px-8",
  padding: "section-padding", // 기존 클래스 유지
  background: {
    white: "bg-white",
    gray: "bg-gray-50", 
    black: "bg-black text-white"
  }
} as const;
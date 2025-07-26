import { Variants } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASE } from './theme'

// 기본 페이드 애니메이션
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.medium,
      ease: ANIMATION_EASE.out
    }
  }
}

// 페이드 + 상하 이동 애니메이션
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.medium,
      ease: ANIMATION_EASE.out
    }
  }
}

// 페이드 + 좌우 이동 애니메이션
export const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.medium,
      ease: ANIMATION_EASE.out
    }
  }
}

export const fadeInRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.medium,
      ease: ANIMATION_EASE.out
    }
  }
}

// 스케일 애니메이션
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION.medium,
      ease: ANIMATION_EASE.bounce
    }
  }
}

// 스태거 컨테이너
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
}

// 호버 효과
export const hoverScaleVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: ANIMATION_EASE.out
    }
  },
  tap: { scale: 0.95 }
}

// 플로팅 애니메이션
export const floatingVariants = {
  float: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      ease: ANIMATION_EASE.inOut,
      repeat: Infinity,
    }
  }
}

// 펄스 애니메이션
export const pulseVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      ease: ANIMATION_EASE.inOut,
      repeat: Infinity,
    }
  }
}

// 관리자 모드 체크 헬퍼
export const getAnimationProps = (isAdminMode: boolean, variants: Variants, animateValue = 'visible') => {
  if (isAdminMode) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      variants: {}
    }
  }
  
  return {
    initial: 'hidden',
    animate: animateValue,
    variants
  }
}
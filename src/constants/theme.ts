// 테마 상수 정의
export const THEME_COLORS = {
  primary: {
    main: '#7C3AED', // Purple 600
    hover: '#6D28D9', // Purple 700
    light: '#EDE9FE', // Purple 100
  },
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
    900: '#111827',
  },
  black: '#0A0A0A',
  white: '#FFFFFF',
} as const

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  medium: 0.6,
  slow: 0.8,
  xslow: 1.0,
} as const

export const ANIMATION_EASE = {
  out: 'easeOut',
  inOut: 'easeInOut',
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.4, 0, 0.2, 1],
} as const

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export const CONTAINER_MAX_WIDTH = '1100px'

export const Z_INDEX = {
  base: 1,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  notification: 80,
  dragging: 1000,
} as const
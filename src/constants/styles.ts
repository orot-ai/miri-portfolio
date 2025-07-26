// 공통 스타일 클래스
export const commonStyles = {
  // 컨테이너
  container: 'max-w-[1100px] mx-auto px-8',
  section: 'py-20 md:py-32 relative',
  
  // 카드
  card: 'bg-white shadow-lg border border-gray-100 overflow-hidden',
  cardHover: 'transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02]',
  
  // 버튼
  button: {
    primary: 'px-6 py-3 bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors',
    secondary: 'px-6 py-3 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors',
    outline: 'px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium hover:border-gray-400 transition-colors',
    ghost: 'px-6 py-3 text-gray-600 font-medium hover:text-black hover:bg-gray-50 transition-all',
  },
  
  // 타이포그래피
  heading: {
    h1: 'text-5xl md:text-6xl lg:text-7xl font-black tracking-tight',
    h2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
    h3: 'text-2xl md:text-3xl font-bold',
    h4: 'text-xl md:text-2xl font-semibold',
  },
  
  // 텍스트
  text: {
    body: 'text-gray-600 leading-relaxed',
    small: 'text-sm text-gray-500',
    caption: 'text-xs text-gray-400 uppercase tracking-wider',
  },
  
  // 태그/배지
  badge: 'px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200',
  badgeHover: 'transition-colors group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600',
  
  // 관리자 모드
  adminEditable: 'cursor-pointer hover:bg-gray-100 hover:bg-opacity-50 px-2 py-1 rounded border-2 border-dashed border-transparent hover:border-gray-300',
  
  // 로딩/에러 상태
  loading: 'flex items-center justify-center py-12',
  error: 'text-center py-12 text-red-600',
  empty: 'text-center py-24 text-gray-600',
  
  // 애니메이션
  transition: {
    fast: 'transition-all duration-200',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  }
} as const

// 섹션 스타일
export const sectionStyles = {
  container: commonStyles.container,
  wrapper: `${commonStyles.section} ${commonStyles.container}`,
  
  header: {
    wrapper: 'text-center mb-12 md:mb-16',
    subtitle: `${commonStyles.text.caption} mb-4`,
    title: `${commonStyles.heading.h2} mb-6`,
    description: `${commonStyles.text.body} max-w-2xl mx-auto`,
  },
  
  grid: {
    base: 'grid gap-8 lg:gap-12',
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-1 md:grid-cols-2',
    cols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
} as const

// 클래스 조합 헬퍼
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}
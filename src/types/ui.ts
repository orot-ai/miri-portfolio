// 섹션 관련
export interface DetailItem {
  number: string
  label: string
  value: string
}

export interface ProcessStep {
  number: string
  title: string
  description: string
}

// 버튼 변형
export type ButtonVariant = 'primary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

// 카드 패딩
export type CardPadding = 'none' | 'small' | 'medium' | 'large'

// 배경색
export type BackgroundColor = 'white' | 'gray' | 'black'

// 탭 타입
export type TabType = 'vibe' | 'automation'

// 아이콘 버튼 변형
export type IconButtonVariant = 'default' | 'danger' | 'success' | 'warning'
export type IconButtonSize = 'small' | 'medium' | 'large'
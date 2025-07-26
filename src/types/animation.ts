// 애니메이션 타입
export type AnimationType = 
  | 'fadeInUp'
  | 'fadeInLeft' 
  | 'fadeInRight'
  | 'slideInLeft'
  | 'slideInRight' 
  | 'scaleIn'
  | 'rotateIn'
  | 'bounceIn'

// 애니메이션 설정
export interface AnimationConfig {
  type: AnimationType
  delay?: number
  duration?: number
  stagger?: number
}

// 플로팅 요소 애니메이션
export type FloatingAnimationType = 'left' | 'right' | 'rotate' | 'scale'

// 플로팅 요소 위치
export interface FloatingPosition {
  top?: string
  bottom?: string
  left?: string
  right?: string
}

// 플로팅 요소
export interface FloatingElement {
  id: string
  text: string
  position: FloatingPosition
  animationType: FloatingAnimationType
}
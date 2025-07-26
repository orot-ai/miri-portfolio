import { BaseEntity } from './common'

// 공통 타입 재내보내기
export * from './common'

// 프로젝트 카테고리
export type ProjectCategory = 'vibe' | 'automation'

// 프로젝트 상태
export enum ProjectStatus {
  Draft = 'draft',
  InProgress = 'in_progress', 
  Completed = 'completed',
  Preparing = 'preparing'
}

// 프로젝트 타입
export interface Project extends BaseEntity {
  // 기본 정보
  title: string
  description?: string
  
  // 설명 버전별 필드
  description_card?: string // 카드형 설명 (중간 길이)
  description_detail_top?: string // 디테일 상단 설명 (짧게)
  description_detail_bottom?: string // 디테일 하단 설명 (길게)
  
  // 이미지
  image_url?: string
  screenshot_1_url?: string
  screenshot_2_url?: string
  screenshot_3_url?: string
  thumbnail_1_url?: string
  thumbnail_2_url?: string
  thumbnail_3_url?: string
  thumbnail_4_url?: string
  
  // 메타데이터
  tech_stack: string[]
  category: ProjectCategory
  features: string[]
  development_status: string
  
  // 링크
  github_url?: string
  demo_url?: string
  
  // 정렬
  order_index?: number
  
  // UI 전용 필드 (DB에 없음)
  tags?: string[] // tech_stack 별칭
  url?: string // demo_url 별칭
  featured?: boolean
}

export interface DetailItem {
  number: string;
  label: string;
  value: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface AutomationProject {
  id: string;
  title: string;
  description: string;
  platforms: Array<'notion' | 'make' | 'zapier'>;
  stats?: {
    executions?: string;
    timeSaved?: string;
    services?: string;
  };
}

export interface FloatingElement {
  id: string;
  text: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  animationType: 'left' | 'right' | 'rotate' | 'scale';
}

export type AnimationType = 
  | 'fadeInUp'
  | 'fadeInLeft' 
  | 'fadeInRight'
  | 'slideInLeft'
  | 'slideInRight' 
  | 'scaleIn'
  | 'rotateIn'
  | 'bounceIn';

export interface AnimationConfig {
  type: AnimationType;
  delay?: number;
  duration?: number;
  stagger?: number;
}
import { BaseEntity } from './common'

// 프로젝트 카테고리
export type ProjectCategory = 'vibe' | 'automation'

// 프로젝트 상태
export enum ProjectStatus {
  Draft = 'draft',
  InProgress = 'in_progress', 
  Completed = 'completed',
  Preparing = 'preparing'
}

// 프로젝트 이미지 인터페이스
export interface ProjectImages {
  image_url?: string
  screenshot_1_url?: string
  screenshot_2_url?: string
  screenshot_3_url?: string
  thumbnail_1_url?: string
  thumbnail_2_url?: string
  thumbnail_3_url?: string
  thumbnail_4_url?: string
}

// 프로젝트 설명 인터페이스
export interface ProjectDescriptions {
  description?: string
  description_card?: string // 카드형 설명 (중간 길이)
  description_detail_top?: string // 디테일 상단 설명 (짧게)
  description_detail_bottom?: string // 디테일 하단 설명 (길게)
  section_title_line1?: string // 섹션 제목 첫 번째 줄
  section_title_line2?: string // 섹션 제목 두 번째 줄
}

// 프로젝트 링크 인터페이스
export interface ProjectLinks {
  github_url?: string
  demo_url?: string
}

// 프로젝트 메타데이터 인터페이스
export interface ProjectMetadata {
  tech_stack: string[]
  category: ProjectCategory
  features: string[]
  development_status: string
  order_index?: number
}

// 프로젝트 타입
export interface Project extends BaseEntity, ProjectImages, ProjectDescriptions, ProjectLinks, ProjectMetadata {
  title: string
  
  // UI 전용 필드 (DB에 없음)
  tags?: string[] // tech_stack 별칭
  url?: string // demo_url 별칭
  featured?: boolean
}

// 자동화 프로젝트 통계
export interface AutomationStats {
  executions?: string
  timeSaved?: string
  services?: string
}

// 자동화 프로젝트 타입
export interface AutomationProject {
  id: string
  title: string
  description: string
  platforms: Array<'notion' | 'make' | 'zapier'>
  stats?: AutomationStats
}
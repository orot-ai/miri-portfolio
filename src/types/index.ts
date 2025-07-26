export interface Project {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  screenshot_1_url?: string;
  screenshot_2_url?: string;
  screenshot_3_url?: string;
  thumbnail_1_url?: string;
  thumbnail_2_url?: string;
  thumbnail_3_url?: string;
  thumbnail_4_url?: string;
  tech_stack: string[];
  category: 'vibe' | 'automation';
  features: string[];
  development_status: string;
  github_url?: string;
  demo_url?: string;
  created_at: string;
  updated_at: string;
  order_index?: number; // 드래그 앤 드롭 순서
  // UI용 추가 필드
  tags?: string[]; // tech_stack을 태그로 표시
  url?: string; // demo_url 별칭
  featured?: boolean; // UI에서 사용
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
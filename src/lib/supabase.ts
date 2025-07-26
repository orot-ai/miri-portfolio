import { createClient } from '@supabase/supabase-js'
import { Project } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// 프로덕션에서는 SERVICE_KEY 사용 안 함 (보안상 위험)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL과 ANON KEY가 환경변수에 설정되어 있지 않습니다.')
}

// SERVICE_KEY는 개발 환경에서만 사용 (프로덕션에서는 RLS 활성화 필요)
const isDevelopment = import.meta.env.DEV

// 싱글톤 패턴으로 클라이언트 생성
let _supabase: any = null
let _supabaseAdmin: any = null

// 일반 사용자용 클라이언트 (읽기 전용)
export const supabase = (() => {
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
})()

// 관리자용 클라이언트 (개발 환경에서만 사용)
export const supabaseAdmin = (() => {
  if (!_supabaseAdmin) {
    if (isDevelopment && supabaseServiceKey) {
      // 개발 환경에서만 SERVICE_KEY 사용
      _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    } else {
      // 프로덕션에서는 일반 클라이언트 사용 (RLS 적용)
      console.warn('프로덕션 환경: 관리자 기능이 제한됩니다. RLS 정책을 활성화하세요.')
      _supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey)
    }
  }
  return _supabaseAdmin
})()

// 데이터베이스 타입 정의
export interface PortfolioContent {
  id: string
  section: string
  field: string
  content: string
  content_type: 'text' | 'image' | 'json'
  created_at: string
  updated_at: string
}


export interface SiteSettings {
  id: string
  setting_key: string
  setting_value: string
  description?: string
  created_at: string
  updated_at: string
}

export interface MediaFile {
  id: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  created_at: string
}